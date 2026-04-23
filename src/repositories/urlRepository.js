const cassClient = require('../db/cassandra');
const cassQueries = require('../db/queries/cassandraQueries')

exports.saveUrl = async (id, shortCode, longUrl) => {
    try {
        const createdAt = new Date();
        await cassClient.batch([
            {
                query: cassQueries.INSERT.INSERT_URL_BY_ID,
                params: [id, shortCode, longUrl, createdAt]
            },
            {
                query: cassQueries.INSERT.INSERT_URL_BY_SHORT_CODE,
                params: [shortCode, id, longUrl, createdAt]
            }
        ], { prepare: true });

    } catch (err) {
        console.error("Cassandra batch error:", err);
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