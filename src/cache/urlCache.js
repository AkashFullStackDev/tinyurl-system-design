const redisClient = require('../db/redis');

exports.get = async (key) => {
    return await redisClient.get(key);
};

exports.set = async (key, value) => {
    await redisClient.setEx(key, 3600, value);
};

exports.incrementCounter = async () => {
    return await redisClient.incr('url_counter');
};