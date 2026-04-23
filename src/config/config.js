const config = {
    REDIS_URL:process.env.REDIS_URL,
    CASSANDRA_HOSTS: process.env.CASSANDRA_HOSTS,
    CASSANDRA_DATACENTER: process.env.CASSANDRA_DATACENTER,
    ZOOKEEPER_URL: process.env.ZOOKEEPER_URL
}

module.exports = config;