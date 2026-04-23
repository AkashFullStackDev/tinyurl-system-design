const cassandraQueries = {
    INSERT: {
        INSERT_URL_BY_ID: 'INSERT INTO url_by_id (id, short_code, long_url, created_at) VALUES (?, ?, ?, ?)',
        INSERT_URL_BY_SHORT_CODE: 'INSERT INTO url_by_short_code (short_code, id, long_url, created_at) VALUES (?, ?, ?, ?)'
    },
    SELECT: {
        SELECT_URL_BY_SHORT_CODE: 'SELECT long_url FROM url_by_short_code WHERE short_code = ?',
        SELECT_URL_BY_ID: 'SELECT long_url FROM url_by_id WHERE id = ?',
    }
}

module.exports = cassandraQueries;