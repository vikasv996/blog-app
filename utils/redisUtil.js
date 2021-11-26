// const redis = require('redis');
//
// const client = redis.createClient(process.env.REDIS_URL);
//
// client.on("connect", () => {
//     console.log("Client connected to redis...");
// })
//
// client.on("error", (err) => {
//     console.log("Error connecting redis:", err.message);
// })
//
// client.on("ready", () => {
//     console.log("Redis client ready to use...");
// })
//
// client.on("end", () => {
//     console.log("Redis Client disconnected");
// })
//
//
// module.exports = client;