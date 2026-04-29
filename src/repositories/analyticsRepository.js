const cassClient = require('../db/cassandra');
const cassQueries = require('../db/queries/cassandraQueries');

exports.getRecentClicks = async (code) => {
    const today = new Date().toISOString().split('T')[0];

    const query = cassQueries.SELECT.SELECT_CLICKS_BY_CODE_DAY;

    const result = await cassClient.execute(query, [code, new Date(today)], { prepare: true });

    return result.rows;
};

exports.getLast24HoursClicks = async (code) => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const today = now.toISOString().split('T')[0];
    const yDay = yesterday.toISOString().split('T')[0];

    const q1 = await cassClient.execute(
        cassQueries.SELECT.SELECT_CLICK_COUNT_BY_CODE_DAY,
        [code, new Date(today)],
        { prepare: true }
    );

    const q2 = await cassClient.execute(
        cassQueries.SELECT.SELECT_CLICK_COUNT_BY_CODE_DAY,
        [code, new Date(yDay)],
        { prepare: true }
    );

    const todayCount = q1.rows[0]?.count || 0;
    const yCount = q2.rows[0]?.count || 0;

    return todayCount + yCount;
};

exports.incrementClickCount = async (code) => {
    const now = new Date();
    const day = now.toISOString().split('T')[0];

    const query = cassQueries.UPDATE.UPDATE_CLICK_COUNT_BY_CODE_DAY;

    await cassClient.execute(query, [
        code,
        new Date(day)
    ], { prepare: true });
};