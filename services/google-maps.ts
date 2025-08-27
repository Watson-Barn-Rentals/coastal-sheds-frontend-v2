/// <reference types="@types/google.maps" />

// ---------- Types ----------
export type LatLng = { lat: number; lng: number }

export type MapMarkerInput = {
  position: LatLng
  url: string
  label?: string                 // simple one-char label (classic Marker)
  content?: HTMLElement          // rich HTML (AdvancedMarkerElement)
}

export type CreateMapOptions = {
  element: HTMLElement
  apiKey: string
  center: LatLng
  zoom: number
  // Lock map interactions but allow marker clicks
  markersInteractOnly?: boolean
}

// Returned per-destination distance result
export type DistanceResult = {
  meters: number
  text: string        // e.g. "23.4 mi" or "37.6 km"
  seconds: number     // duration in seconds
} | null

// ---------- Loader ----------
let mapsLoadPromise: Promise<void> | null = null

export function loadGoogleMaps(apiKey: string): Promise<void> {
  if ((window as any).google?.maps) return Promise.resolve()
  if (mapsLoadPromise) return mapsLoadPromise

  const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps-loader="1"]')
  if (existing) {
    mapsLoadPromise = new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps')))
    })
    return mapsLoadPromise
  }

  const s = document.createElement('script')
  s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=quarterly`
  s.async = true
  s.defer = true
  s.dataset.googleMapsLoader = '1'
  mapsLoadPromise = new Promise<void>((resolve, reject) => {
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load Google Maps'))
  })
  document.head.appendChild(s)
  return mapsLoadPromise
}

// ---------- Map ----------
export async function createMap(opts: CreateMapOptions): Promise<google.maps.Map> {
  const { element, apiKey, center, zoom, markersInteractOnly } = opts
  await loadGoogleMaps(apiKey)

  const baseOptions: google.maps.MapOptions = {
    center, zoom,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  }

  const locked: google.maps.MapOptions = markersInteractOnly
    ? {
        gestureHandling: 'none',
        draggable: false,
        zoomControl: false,
        disableDoubleClickZoom: true,
      }
    : {}

  return new google.maps.Map(element, { ...baseOptions, ...locked })
}

// ---------- Markers ----------
export function addMarkers(
  map: google.maps.Map,
  markers: MapMarkerInput[],
): (google.maps.marker.AdvancedMarkerElement | google.maps.Marker)[] {
  const out: (google.maps.marker.AdvancedMarkerElement | google.maps.Marker)[] = []
  const hasAdvanced = !!(google.maps as any).marker?.AdvancedMarkerElement

  for (const m of markers) {
    if (hasAdvanced && m.content) {
      const adv = new (google.maps as any).marker.AdvancedMarkerElement({
        map,
        position: m.position,
        content: m.content,
        title: m.label ?? '',
      })
      adv.addListener('gmp-click', () => window.location.assign(m.url))
      out.push(adv)
    } else {
      const marker = new google.maps.Marker({
        map,
        position: m.position,
        title: m.label,
      })
      marker.addListener('click', () => window.location.assign(m.url))
      out.push(marker)
    }
  }
  return out
}

// Optional: fit bounds around markers
export function fitToMarkers(map: google.maps.Map, markers: MapMarkerInput[]) {
  if (!markers.length) return
  const bounds = new google.maps.LatLngBounds()
  markers.forEach(m => bounds.extend(m.position))
  map.fitBounds(bounds)
}

// ---------- Routes API: Compute Route Matrix (REST) ----------
function metersToText(meters: number, unit: 'imperial' | 'metric'): string {
  if (unit === 'imperial') {
    const miles = meters / 1609.344
    return miles < 0.1 ? `${(miles * 5280).toFixed(0)} ft` : `${miles.toFixed(1)} mi`
  } else {
    const km = meters / 1000
    return km < 0.1 ? `${meters.toFixed(0)} m` : `${km.toFixed(1)} km`
  }
}

/**
 * Uses Google Routes API (distanceMatrix v2:computeRouteMatrix) to get driving
 * distance + duration from a single origin to many destinations.
 *
 * NOTE:
 * - Requires the "Routes API" enabled on your key and proper HTTP referrer restrictions.
 * - You MUST include the X-Goog-FieldMask header or the request fails.
 * - Response rows include originIndex/destinationIndex; we map back to input order.
 */
export async function getDrivingDistances(
  apiKey: string,
  origin: LatLng,
  destinations: LatLng[],
  unit: 'imperial' | 'metric' = 'imperial',
): Promise<DistanceResult[]> {
  if (!destinations.length) return []

  const body = {
    origins: [
      {
        waypoint: {
          location: { latLng: { latitude: origin.lat, longitude: origin.lng } },
        },
      },
    ],
    destinations: destinations.map(d => ({
      waypoint: {
        location: { latLng: { latitude: d.lat, longitude: d.lng } },
      },
    })),
    travelMode: 'DRIVE',
    routingPreference: 'TRAFFIC_AWARE', // adjust if needed
  }

  const res = await fetch('https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      // Only request the fields we need (required by Routes API):
      'X-Goog-FieldMask': 'originIndex,destinationIndex,distanceMeters,duration,status,condition',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Routes API error ${res.status}: ${res.statusText} ${text}`)
  }

  // REST returns a JSON array (not streaming).
  const arr: Array<{
    originIndex: number
    destinationIndex: number
    distanceMeters?: number
    duration?: string // e.g., "160s"
    condition?: string // e.g., "ROUTE_EXISTS"
    status?: { code?: number; message?: string }
  }> = await res.json()

  // Prepare result array in the same order as `destinations`
  const out: DistanceResult[] = Array(destinations.length).fill(null)

  for (const el of arr) {
    const idx = el.destinationIndex
    if (idx == null || idx < 0 || idx >= destinations.length) continue

    // Treat non-existing routes or statuses with codes as null
    const ok =
      (!el.status || el.status.code == null) &&
      el.condition === 'ROUTE_EXISTS' &&
      typeof el.distanceMeters === 'number' &&
      typeof el.duration === 'string'

    if (!ok) {
      out[idx] = null
      continue
    }

    const meters = el.distanceMeters!
    const seconds = Number(el.duration?.replace(/s$/, '')) || 0
    out[idx] = {
      meters,
      seconds,
      text: metersToText(meters, unit),
    }
  }

  return out
}

// ---------- Geolocation ----------
export function getUserPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    })
  })
}
