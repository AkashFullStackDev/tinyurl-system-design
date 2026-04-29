const redisClient = require('../db/redis');

exports.get = async (key) => {
    return await redisClient.get(key);
};

exports.set = async (key, value) => {
    await redisClient.setEx(key, 3600, value);
};

exports.incr = async (key) => {
    return await redisClient.incr(key);
};

exports.incrementTrending = async (code) => {
    return await redisClient.zIncrBy('trending_urls', 1, code);
};

exports.getTopTrending = async (limit = 10) => {
    return await redisClient.zRangeWithScores(
        'trending_urls',
        0,
        limit - 1,
        { REV: true }
    );
};

exports.setWithTTL = async (key, value, ttlSeconds) => {
  await redisClient.setEx(key, ttlSeconds, value);
};