const cassandraQueries = {
    INSERT: {
        INSERT_URL_BY_ID: 'INSERT INTO url_by_id (id, short_code, long_url, created_at, expires_at) VALUES (?, ?, ?, ?, ?)',
        INSERT_URL_BY_SHORT_CODE: 'INSERT INTO url_by_short_code (short_code, id, long_url, created_at, expires_at) VALUES (?, ?, ?, ?, ?) IF NOT EXISTS',
        INSERT_CLICK_BY_CODE_DAY: `INSERT INTO clicks_by_code_day (short_code, day, event_time, ip, user_agent) VALUES (?, ?, ?, ?, ?)`
    },
    SELECT: {
        SELECT_URL_BY_SHORT_CODE: 'SELECT long_url FROM url_by_short_code WHERE short_code = ?',
        SELECT_URL_BY_ID: 'SELECT long_url FROM url_by_id WHERE id = ?',
        SELECT_CLICKS_BY_CODE_DAY: `SELECT * FROM clicks_by_code_day WHERE short_code = ? AND day = ? LIMIT 10`,
        SELECT_CLICKS_BY_CODE_DAY_EVENT_TIME: `SELECT event_time FROM clicks_by_code_day WHERE short_code=? AND day=?`,
        SELECT_CLICK_COUNT_BY_CODE_DAY: `SELECT count FROM clicks_count_by_code_day WHERE short_code=? AND day=?`,
        SELECT_SHORT_CODE_BY_ALIAS: `SELECT short_code FROM url_by_short_code WHERE short_code = ?`
    },
    UPDATE: {
        UPDATE_CLICK_COUNT_BY_CODE_DAY: `UPDATE clicks_count_by_code_day SET count = count + 1 WHERE short_code = ? AND day = ?`,
    }
}

module.exports = cassandraQueries;