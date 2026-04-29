const cassandraClient = require('../db/cassandra');

async function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function initCassandra() {
    console.log("Initializing Cassandra...");

    let retries = 20;

    while (retries) {
        try {
            await cassandraClient.connect();
            console.log("Cassandra connected");

            // create keyspace
            await cassandraClient.execute(`
                CREATE KEYSPACE IF NOT EXISTS tinyurl
                WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3}
            `);

            // set keyspace
            await cassandraClient.execute(`USE tinyurl`);

            // create table
            await cassandraClient.execute(`
                CREATE TABLE IF NOT EXISTS url_by_id (
                    id bigint PRIMARY KEY,
                    short_code text,
                    long_url text,
                    created_at timestamp,
                    expires_at timestamp,
                    user_id text,
                    is_active boolean
                );
            `);

             // create table
            await cassandraClient.execute(`
                CREATE TABLE IF NOT EXISTS url_by_short_code (
                    short_code text PRIMARY KEY,
                    id bigint,
                    long_url text,
                    created_at timestamp,
                    expires_at timestamp,
                    user_id text,
                    is_active boolean
                );
            `);

             // create table
            await cassandraClient.execute(`
                CREATE TABLE IF NOT EXISTS clicks_by_code_day (
                    short_code text,
                    day date,
                    event_time timestamp,
                    ip text,
                    user_agent text,
                    PRIMARY KEY ((short_code, day), event_time)
                ) WITH CLUSTERING ORDER BY (event_time DESC);
            `);

             // create table
            await cassandraClient.execute(`
                CREATE TABLE IF NOT EXISTS clicks_count_by_code_day (
                    short_code text,
                    day date,
                    count counter,
                    PRIMARY KEY (short_code, day)
                );
            `);

            console.log("Cassandra ready");
            return;

        } catch (err) {
            console.log(`Cassandra not ready... retrying (${21 - retries}/20)`);
            retries--;
            await sleep(5000);
        }
    }

    throw new Error("Cassandra failed to start after retries");
}

module.exports = initCassandra;