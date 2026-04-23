const zkClient = require('../db/zookeeper');

let current = 0;
let max = 0;

const RANGE_SIZE = 1000;

function getData(path) {
    return new Promise((resolve, reject) => {
        zkClient.getData(path, (err, data, stat) => {
            if (err) return reject(err);
            resolve({ data, stat });
        });
    });
}

function setData(path, value, version) {
    return new Promise((resolve, reject) => {
        zkClient.setData(path, Buffer.from(value), version, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

async function getNewRange() {
    const { data, stat } = await getData('/counter');

    let value = parseInt(data.toString()) || 0;
    let newValue = value + RANGE_SIZE;

    await setData('/counter', String(newValue), stat.version);

    current = value + 1;
    max = newValue;

    console.log(`New Range Allocated: ${current} - ${max}`);
}

exports.getNextId = async () => {
    if (current >= max) {
        await getNewRange();
    }
    return current++;
};