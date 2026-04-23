const service = require('../services/urlService');

exports.shorten = async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        let resObj = {
            code: 400,
            status: "failed",
            message: "longUrl is required.",
            data: {}
        }
        return res.status(400).json(resObj);
    }

    const code = await service.createShortUrl(longUrl);

    if (code) {
        let resObj = {
            code: 201,
            status: "success",
            message: "short url generated successfully.",
            data: {
                shortUrl: `http://localhost:8081/redirect/${code}`
            }
        }
        res.status(201).json(resObj);
    } else {
        let resObj = {
            code: 500,
            status: "failed",
            message: "Internal server error.",
            data: {}
        }
        res.status(201).json(resObj);
    }

};

exports.redirectByShortCode = async (req, res) => {
    const code = req.params.code;
    let url = await service.getLongUrlByShortCode(code);
    if (!url) return res.status(404).send("Not found");
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    res.redirect(url);
};

exports.redirectById = async (req, res) => {
    const id = req.params.id;
    let url = await service.getLongUrlById(id);
    if (!url) return res.status(404).send("Not found");
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    res.redirect(url);
};