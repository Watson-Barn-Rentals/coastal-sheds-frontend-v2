export const onSuccess = async ({ utils }) => {
	const baseUrl = process.env.WARM_BASE_URL || process.env.URL
	const warmUrls = (process.env.WARM_URLS || "/api/health")
		.split(",")
		.map((path) => path.trim())
		.filter(Boolean)
		.map((path) => (path.startsWith("http") ? path : `${baseUrl}${path}`))

	const timeoutMs = Number(process.env.WARM_TIMEOUT_MS || 15000)

	utils.status.show({
		title: "Warming endpoints",
		summary: warmUrls.join("\n"),
	})

	const fetchWithTimeout = async (url) => {
		const controller = new AbortController()
		const timer = setTimeout(() => controller.abort(), timeoutMs)

		try {
			const res = await fetch(url, {
				method: "GET",
				headers: {
					"user-agent": "netlify-cache-warmer",
					...(process.env.WARM_HEADER_AUTH
						? { authorization: process.env.WARM_HEADER_AUTH }
						: {}),
				},
				signal: controller.signal,
			})

			const body = await res.text().catch(() => "")
			if (!res.ok) {
				throw new Error(`Warm failed ${res.status} ${res.statusText} - ${body.slice(0, 200)}`)
			}
		} finally {
			clearTimeout(timer)
		}
	}

	const results = await Promise.allSettled(warmUrls.map(fetchWithTimeout))

	const failed = results
		.map((r, i) => ({ r, url: warmUrls[i] }))
		.filter(({ r }) => r.status === "rejected")

	if (failed.length) {
		// Fail-soft: don’t fail the deploy, but surface it loudly
		failed.forEach(({ url, r }) => utils.build.warn(`Warm failed: ${url} - ${r.reason?.message || r.reason}`))
	} else {
		utils.status.show({ title: "Warming complete" })
	}
}
