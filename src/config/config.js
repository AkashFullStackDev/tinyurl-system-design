const os = require('os');

function generateServerId() {
    const hostname = os.hostname();

    const match = hostname.match(/\d+$/);

    return match ? parseInt(match[0]) : 1;
}

const config = {
    REDIS_URL:process.env.REDIS_URL,
    CASSANDRA_HOSTS: process.env.CASSANDRA_HOSTS,
    CASSANDRA_DATACENTER: process.env.CASSANDRA_DATACENTER,
    SERVER_ID: process.env.SERVER_ID || generateServerId()
}

module.exports = config;