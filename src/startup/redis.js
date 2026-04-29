const redisClient = require('../db/redis');

async function initRedis() {
    await redisClient.connect();
    console.log("Redis ready");
}

module.exports = initRedis;