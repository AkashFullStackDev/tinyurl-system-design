const redis = require('../db/redis');

const LIMIT = 100;
const WINDOW = 60; //seconds

module.exports = async (req, res, next) => {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '')
        .split(',')[0]
        .trim();

    const key = `rate:${ip}`;

    const count = await redis.incr(key);

    if (count === 1) {
        await redis.expire(key, WINDOW);
    }

    if (count > LIMIT) {
        return res.status(429).json({
            code: 429,
            status: "failed",
            message: "Too many requests"
        })
    }

    next();
}