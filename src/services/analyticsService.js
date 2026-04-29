const cache = require('../cache/urlCache');
const analyticsRepo = require('../repositories/analyticsRepository');

exports.getTotalClicks = async (code) => {
    const count = await cache.get(`click:${code}`);
    return parseInt(count || 0);
};

exports.getRecentClicks = async (code) => {
    return await analyticsRepo.getRecentClicks(code);
};

exports.getLast24HoursClicks = async (code) => {
    return await analyticsRepo.getLast24HoursClicks(code);
};

exports.getTrending = async (limit) => {
    const result = await cache.getTopTrending(limit);
    console.log("Trending data:", result);

    return result.map(item => ({
        code: item.value,
        clicks: Number(item.score)
    }));
};