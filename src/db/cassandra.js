const cassandra = require('cassandra-driver');
const config = require('../config/config');

const client = new cassandra.Client({
    contactPoints: config.CASSANDRA_HOSTS.split(','),
    localDataCenter: config.CASSANDRA_DATACENTER,
    protocolOptions: { port: 9042 },
    queryOptions: {
    consistency: cassandra.types.consistencies.quorum
  }
})


module.exports = client;