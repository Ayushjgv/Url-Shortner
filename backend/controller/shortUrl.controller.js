import { getShortUrl } from "../dao/shortUrl.js";
import { createShortUrlWithoutUserService } from "../services/shortUrl.service.js";

export const createShortUrl = async (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
        return res.status(400).send("A valid url is required");
    }

    const shortUrl = await createShortUrlWithoutUserService(url);
    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}/`;
    const baseUrl = appUrl.endsWith("/") ? appUrl : `${appUrl}/`;
    res.send(baseUrl + shortUrl);
}


export const redirectFromShortUrl = async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const url = await getShortUrl(shortUrl);
        if(url){
            let targetUrl = url.fullUrl;
            if (!/^https?:\/\//i.test(targetUrl)) {
                targetUrl = `https://${targetUrl}`;
            }
            res.redirect(targetUrl);
        }else{
            res.status(404).send("URL not found");
        }
        
    } catch (error) {
        res.status(500).send("Server Error");
    }
}
