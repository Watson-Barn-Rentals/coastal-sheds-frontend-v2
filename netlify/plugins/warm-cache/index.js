export const onSuccess = async ({ utils }) => {
	const baseUrl = process.env.WARM_BASE_URL || process.env.URL
	const warmUrls = (process.env.WARM_URLS || "/api/health")
		.split(",")
		.map((path) => path.trim())
		.filter(Boolean)
		.map((path) => (path.startsWith("http") ? path : `${baseUrl}${path}`))

	const timeoutMs = Number(process.env.WARM_TIMEOUT_MS || 30000)
	const concurrency = Number(process.env.WARM_CONCURRENCY || 4)

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

			if (!res.ok) {
				throw new Error(`Warm failed ${res.status} ${res.statusText}`)
			}

			// Drain the body (more reliable caching) without buffering into memory
			if (res.body) {
				for await (const _ of res.body) {}
			}
		} finally {
			clearTimeout(timer)
		}
	}

	const runWithConcurrency = async (items, limit, worker) => {
		const queue = [...items]
		const workers = Array.from({ length: Math.max(1, limit) }, async () => {
			while (queue.length) {
				const next = queue.shift()
				if (!next) return
				await worker(next)
			}
		})

		await Promise.all(workers)
	}

	const failures = []

	await runWithConcurrency(warmUrls, concurrency, async (url) => {
		try {
			await fetchWithTimeout(url)
			console.log(`[warm-cache] ok: ${url}`)
		} catch (error) {
			const message = error?.message || String(error)
			failures.push({ url, message })
			console.warn(`[warm-cache] failed: ${url} - ${message}`)
		}
	})

	if (failures.length) {
		utils.status.show({
			title: "Warming completed with failures",
			summary: failures.map((f) => `- ${f.url}: ${f.message}`).join("\n"),
		})

		// Fail-soft (deploy stays successful). If you DO want to fail deploys, replace with:
		// utils.build.failBuild("Cache warming failed", { error: new Error(failures[0].message) })
		return
	}

	utils.status.show({ title: "Warming complete" })
}
