/**
 * Normalize internal URLs to always include a trailing slash.
 * - Handles null/undefined safely.
 * - Leaves absolute URLs (http, https), mailto:, tel:, and hashes unchanged.
 * - Preserves query strings and hash fragments.
 */
export function toTrailing(url?: string | null): string | undefined {
	if (!url) return undefined

	// Skip external, tel:, mailto:, and hash-only links
	if (/^(https?:|mailto:|tel:|#)/i.test(url)) return url

	let base = url.startsWith('/') ? url : `/${url}`

	// Separate query/hash
	const qIndex = base.indexOf('?')
	const hIndex = base.indexOf('#')
	const cut = [qIndex, hIndex].filter(i => i !== -1).sort((a, b) => a - b)[0] ?? base.length

	const path = base.slice(0, cut).replace(/\/+/g, '/')
	const tail = base.slice(cut)

	const withSlash = path !== '/' && !path.endsWith('/') ? `${path}/` : path
	return withSlash + tail
}
