const redis = require('redis');
const redisUrl = require('../config/config').REDIS_URL;

const client = redis.createClient({
    url: redisUrl
})

module.exports = client;