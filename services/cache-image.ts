import { getAssetUrl } from "./get-asset-url"

export const cacheImage = async (fileId: string) => {
    const saveePath = `/public/`
    const imageBuffer = await fetch(getAssetUrl(fileId), { responseType: 'arrayBuffer' })
    writeFileSync(savePath, Buffer.from(imageBuffer))
}