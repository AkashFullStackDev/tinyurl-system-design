const idService = require('./idService');
const { encode } = require('../utils/base62');
const repo = require('../repositories/urlRepository');
const cache = require('../cache/urlCache');

exports.createShortUrl = async (longUrl) => {
    const id = await idService.getNextId();
    const shortCode = encode(id);
    await repo.saveUrl(id, shortCode, longUrl);

    return shortCode;
};

exports.getLongUrlByShortCode = async (code) => {
    let url = await cache.get(code);
    if (!url) {
        url = await repo.getUrlByShortCode(code);
        if (url) {
            await cache.set(code, url);
        }
    }
    return url;
};

exports.getLongUrlById = async (id) => {
    let url = await cache.get(id);
    if (!url) {
        url = await repo.getUrlById(id);

        if (url) {
            await cache.set(code, url);
        }
    }

    return url;
};