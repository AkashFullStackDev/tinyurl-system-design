const initCassandra = require('./cassandra');
const initRedis = require('./redis');
const initZookeeper = require('./zookeeper');

async function initAll() {
    console.log("Starting system initialization...");

    await initRedis();
    await initCassandra();
    await initZookeeper();

    console.log("All services initialized");
}

module.exports = initAll;