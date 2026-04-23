const zkClient = require('../db/zookeeper');

exports.getCounter = () => {
    return new Promise((resolve, reject) => {
        zkClient.getData('/counter', (err, data) => {
            if (err) return reject(err);

            resolve(data.toString());
        });
    });
};