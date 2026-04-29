const Snowflake = require('./snowflake');
const config = require('../config/config');

const snowflake = new Snowflake(config.SERVER_ID || 1);

exports.getNextId = async () => {
    return snowflake.nextId();
};