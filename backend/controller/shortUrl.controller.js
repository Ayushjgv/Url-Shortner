import { getShortUrl } from "../dao/shortUrl.js";
import { createShortUrlWithUserService } from "../services/shortUrl.service.js";

const RESERVED_SLUGS = new Set([
    "api", "login", "register", "dashboard", "logout", "reset-password", "verifyuser", "getuserdetails", "refresh-token"
]);

export const createShortUrl = async (req, res) => {
    try {
        const { url, customSlug } = req.body;
        if (!url || typeof url !== "string") {
            return res.status(400).send("A valid url is required");
        }

        let cleanSlug = undefined;
        if (customSlug && typeof customSlug === "string") {
            const trimmed = customSlug.trim();
            if (trimmed.length > 0) {
                if (trimmed.length < 3 || trimmed.length > 30) {
                    return res.status(400).send("Custom alias must be between 3 and 30 characters.");
                }
                if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
                    return res.status(400).send("Custom alias can only contain letters, numbers, hyphens, and underscores.");
                }
                if (RESERVED_SLUGS.has(trimmed.toLowerCase())) {
                    return res.status(400).send("This custom alias is reserved and cannot be used.");
                }
                cleanSlug = trimmed;
            }
        }

        const shortUrl = await createShortUrlWithUserService(url, req.user.userId, cleanSlug);
        const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}/`;
        const baseUrl = appUrl.endsWith("/") ? appUrl : `${appUrl}/`;
        res.send(baseUrl + shortUrl);
    } catch (error) {
        if (error.message.includes("Custom alias")) {
            return res.status(409).send(error.message);
        }
        res.status(500).send(error.message || "Server Error");
    }
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
