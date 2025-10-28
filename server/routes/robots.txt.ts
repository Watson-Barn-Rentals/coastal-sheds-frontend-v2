export default defineEventHandler((event) => {
	const siteUrl = useRuntimeConfig().public.mainSiteUrl || 'https://example.com';

	return new Response(
		[
			'User-agent: *',
			'Allow: /',
			`Sitemap: ${siteUrl}/sitemap.xml`,
		].join('\n'),
		{
			headers: {
				'Content-Type': 'text/plain',
			},
		}
	);
});
