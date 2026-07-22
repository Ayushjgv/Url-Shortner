import { generateNanoId } from "../utils/helper.js";
import urlschema from "../models/shorturl.model.js"
import { saveShortUrl } from "../dao/shortUrl.js";

export const createShortUrlWithoutUserService = async(url) => {
    const shortUrl = generateNanoId(7);
    await saveShortUrl(shortUrl,url);
    return shortUrl;
} 

export const createShortUrlWithUserService = async(url,userId) => {
    const shortUrl = generateNanoId(7);
    await saveShortUrl(shortUrl,url,userId)
    return shortUrl;
} 