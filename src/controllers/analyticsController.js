const analyticsService = require('../services/analyticsService');

exports.getTotalClicks = async (req, res) => {
    const code = req.params.code;

    const count = await analyticsService.getTotalClicks(code);

    res.json({
        code: 200,
        status: "success",
        data: { totalClicks: count }
    });
};

exports.getRecentClicks = async (req, res) => {
    const code = req.params.code;

    const data = await analyticsService.getRecentClicks(code);

    res.json({
        code: 200,
        status: "success",
        data
    });
};

exports.getLast24Hours = async (req, res) => {
    const code = req.params.code;

    const count = await analyticsService.getLast24HoursClicks(code);

    res.json({
        code: 200,
        status: "success",
        data: { last24Hours: count }
    });
};

exports.getTrending = async (req, res) => {
    const limit = parseInt(req.query.limit || 10);

    const data = await analyticsService.getTrending(limit);

    res.status(200).json({
        code: 200,
        status: "success",
        data
    });
};