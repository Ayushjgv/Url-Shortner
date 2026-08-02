import { getShortUrlsByUser } from "../dao/shortUrl.js";
import { findUserById } from "../dao/user.dao.js";

export const getUserDetails = async (req,res)=>{
    try {
        const user = await findUserById(req.user.userId);

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const urls = await getShortUrlsByUser(req.user.userId);
        const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}/`;
        const baseUrl = appUrl.endsWith("/") ? appUrl : `${appUrl}/`;

        res.status(200).json({
            user: {
                id: user._id,
                username:user.username,
                email:user.email,
                role:user.role,
                createdAt:user.createdAt,
            },
            urls: urls.map((url) => ({
                id: url._id,
                fullUrl: url.fullUrl,
                shortUrl: url.shortUrl,
                shortLink: baseUrl + url.shortUrl,
                clicks: url.clicks,
            })),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({message:"Internal server error"});
    }
}
