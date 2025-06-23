export const getAssetUrl = (fileId: string) => {
    const config = useRuntimeConfig()
    
    return `${config.public.apiRootUrl}/assets/${fileId}`
}