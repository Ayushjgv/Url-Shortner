import { generateNanoId } from "../utils/helper.js";
import urlschema from "../models/shorturl.model.js"
import { saveShortUrl } from "../dao/shortUrl.js";

export const createShortUrlWithoutUserService = async(url) => {
    const shortUrl = generateNanoId(7);
    await saveShortUrl(shortUrl,url);
    return shortUrl;
} 

export const createShortUrlWithUserService = async(url, userId, customSlug) => {
    if (customSlug) {
        const existing = await urlschema.findOne({ shortUrl: customSlug });
        if (existing) {
            throw new Error("Custom alias already in use. Please choose another one.");
        }
        await saveShortUrl(customSlug, url, userId);
        return customSlug;
    }
    const shortUrl = generateNanoId(7);
    await saveShortUrl(shortUrl, url, userId);
    return shortUrl;
} 