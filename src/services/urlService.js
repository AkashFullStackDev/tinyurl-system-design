const idService = require('./idService');
const { encode } = require('../utils/base62');
const repo = require('../repositories/urlRepository');
const cache = require('../cache/urlCache');
const analyticsRepo = require('../repositories/analyticsRepository');
const { validateAlias } = require('../utils/aliasValidator');

exports.createShortUrl = async (longUrl, expiresInSeconds, customAlias) => {

    let shortCode;
    let id = null;

    if (customAlias) {
        const v = validateAlias(customAlias);
        if (!v.valid) {
            throw new Error(v.msg);
        }

        const exists = await repo.existsByShortCode(customAlias);
        if (exists) {
            throw new Error('Alias already taken');
        }

        shortCode = customAlias;

    } else {
        shortCode = encode(id);
    }
    id = await idService.getNextId();
    let expiresAt = null;
    if (expiresInSeconds) {
        expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    }
    await repo.saveUrl(id, shortCode, longUrl, expiresAt);

    const cacheValue = JSON.stringify({ longUrl, expiresAt });

    if (expiresInSeconds) {
        await cache.setWithTTL(shortCode, cacheValue, expiresInSeconds);
    } else {
        await cache.set(shortCode, cacheValue);
    }

    return {
        shortUrl: `http://localhost:8081/redirect/${shortCode}`,
        expiresAt
    };;
};

exports.getLongUrlByShortCode = async (code, req) => {
    let data = await cache.get(code);

    if (data) {
        data = JSON.parse(data);

        if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
            return { expired: true };
        }

        await cache.incr(`click:${code}`);
        await cache.incrementTrending(code);

        analyticsRepo.incrementClickCount(code).catch(console.error);

        repo.saveClick(
            code,
            req.ip,
            req.headers['user-agent']
        ).catch(err => console.error("Analytics error:", err));

        return { url: data.longUrl };
    }

    const row = await repo.getUrlByShortCode(code);

    if (!row) return null;

    if (row.expires_at && new Date(row.expires_at) < new Date()) {
        return { expired: true };
    }

    const cacheValue = JSON.stringify({
        longUrl: row.long_url,
        expiresAt: row.expires_at
    });

    if (row.expires_at) {
        const ttl = Math.floor((new Date(row.expires_at) - Date.now()) / 1000);
        if (ttl > 0) {
            await cache.setWithTTL(code, cacheValue, ttl);
        }
    } else {
        await cache.set(code, cacheValue);
    }

    await cache.set(code, cacheValue);

    await cache.incr(`click:${code}`);

    await cache.incrementTrending(code);

    analyticsRepo.incrementClickCount(code).catch(console.error);

    repo.saveClick(
        code,
        req.ip,
        req.headers['user-agent']
    ).catch(err => console.error("Analytics error:", err));;

    return { url: row.long_url };
};

exports.getLongUrlById = async (id) => {
    let url = await cache.get(id);
    if (!url) {
        url = await repo.getUrlById(id);

        if (url) {
            await cache.set(id, url);
        }
    }

    return url;
};