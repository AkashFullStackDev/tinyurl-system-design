const cassClient = require('../db/cassandra');
const cassQueries = require('../db/queries/cassandraQueries')

exports.saveUrl = async (id, shortCode, longUrl, expiresAt) => {

    try {
        const createdAt = new Date();

        const result = await cassClient.execute(
            cassQueries.INSERT.INSERT_URL_BY_SHORT_CODE,
            [shortCode, id, longUrl, createdAt, expiresAt],
            { prepare: true }
        );

        if (!result.rows[0]['[applied]']) {
            throw new Error("Alias already taken");
        }

        await cassClient.execute(
            cassQueries.INSERT.INSERT_URL_BY_ID,
            [id, shortCode, longUrl, createdAt, expiresAt],
            { prepare: true }
        );

    } catch (err) {
        console.error("Cassandra error:", err);
        throw err;
    }

};

exports.getUrlByShortCode = async (shortCode) => {
    const result = await cassClient.execute(
        cassQueries.SELECT.SELECT_URL_BY_SHORT_CODE,
        [shortCode],
        { prepare: true }
    );

    return result.rowLength ? result.rows[0].long_url : null;
};

exports.getUrlById = async (id) => {
    const result = await cassClient.execute(
        cassQueries.SELECT.SELECT_URL_BY_ID,
        [id],
        { prepare: true }
    );

    return result.rowLength ? result.rows[0].long_url : null;
};

exports.saveClick = async (code, ip, userAgent) => {
    const now = new Date();

    const day = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const query = cassQueries.INSERT.INSERT_CLICK_BY_CODE_DAY;

    await cassClient.execute(query, [
        code,
        day,
        now,
        ip,
        userAgent
    ], { prepare: true });
};

exports.existsByShortCode = async (code) => {
    const query = cassQueries.SELECT.SELECT_SHORT_CODE_BY_ALIAS;
    const res = await cassClient.execute(query, [code], { prepare: true });
    return res.rowLength > 0;
};