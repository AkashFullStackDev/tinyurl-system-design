const initCassandra = require('./cassandra');
const initRedis = require('./redis');

async function initAll() {
    console.log("Starting system initialization...");

    await initRedis();
    await initCassandra();

    console.log("All services initialized");
}

module.exports = initAll;