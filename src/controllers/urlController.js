const service = require('../services/urlService');

exports.shorten = async (req, res) => {
    try {

        const { longUrl, expiresInSeconds, customAlias } = req.body;

        if (!longUrl) {
            let resObj = {
                code: 400,
                status: "failed",
                message: "longUrl is required.",
                data: {}
            }
            return res.status(400).json(resObj);
        }

        const data = await service.createShortUrl(longUrl, expiresInSeconds, customAlias);

        let resObj = {
            code: 201,
            status: "success",
            message: "short url generated successfully.",
            data: data
        }
        res.status(201).json(resObj);
    }
    catch (err) {
        res.status(400).json({
            code: 400,
            status: "failed",
            message: err.message
        });
    }

};

exports.redirectByShortCode = async (req, res) => {
    const code = req.params.code;
    let result = await service.getLongUrlByShortCode(code, req);
    if (!result) return res.status(404).send("Not found");
    if (result.expired) return res.status(410).send("Link expired");

    let url = result.url;

    if (!url.startsWith('http')) url = 'https://' + url;

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