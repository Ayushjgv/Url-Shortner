import urlschema from "../models/shorturl.model.js"

export const saveShortUrl = async(shortUrl,url,userId)=>{
    const newUrl = new urlschema({
        fullUrl: url,
        shortUrl: shortUrl
    });
    if(userId){
        newUrl.user = userId;
    }
    await newUrl.save();
    console.log(url);
}

export const getShortUrl = async(shortUrl)=>{
    return await urlschema.findOneAndUpdate({shortUrl:shortUrl},{$inc:{clicks:1}});
}
