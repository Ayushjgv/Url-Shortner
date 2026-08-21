import redis from "redis";


const client = redis.createClient(
    { url: process.env.REDIS_URI }
);

client.on("connect", () => {
    console.log("Redis Connected");
});

client.on("error", (error) => {
    console.log("Redis Error", error);
});

client.connect().then(() => {
}).catch((err) => {
    console.log("Redis Not Connected", err);
});

export { client };