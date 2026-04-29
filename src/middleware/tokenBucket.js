const redis = require('../db/redis');
const fs = require('fs');
const path = require('path');

const script = fs.readFileSync(
    path.join(__dirname, '../scripts/tokenBucket.lua'),
    'utf8'
);

const CAPACITY = 10;
const REFILL_RATE = 5;
const TTL = 60;

module.exports = async (req, res, next) => {
    try {
        const rawIp = (req.headers['x-forwarded-for'] || req.ip || '')
            .split(',')[0]
            .trim()
            .replace('::ffff:', '');

        const key = `token:${rawIp}`;
        const now = Date.now();

        const result = await redis.eval(script, {
            keys: [key],
            arguments: [
                CAPACITY.toString(),
                REFILL_RATE.toString(),
                now.toString(),
                TTL.toString()
            ]
        });

        if (result === 1) {
            return next();
        }

        return res.status(429).json({
            code: 429,
            status: "failed",
            message: "Too many requests (Token Bucket - Atomic)"
        });

    } catch (err) {
        console.error("Lua token bucket error:", err);
        next();
    }
};