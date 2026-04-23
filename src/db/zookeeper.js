const zookeeper = require('node-zookeeper-client');
const ZOOKEEPER_URL = require('../config/config').ZOOKEEPER_URL

const client = zookeeper.createClient(ZOOKEEPER_URL);

module.exports = client;