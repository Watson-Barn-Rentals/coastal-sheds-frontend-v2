export const submitTrackingEvent = async (eventName: string) => {
    const { proxy: googleProxy } = useScriptGoogleAnalytics()
    const { proxy: metaProxy } = useScriptMetaPixel()

    googleProxy.gtag('event', eventName)
    metaProxy.fbq('track', eventName)
}