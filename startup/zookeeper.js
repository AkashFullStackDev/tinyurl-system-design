const zkClient = require('../src/db/zookeeper');

function createNodeIfNotExists(path, data = Buffer.from("0")) {
    return new Promise((resolve, reject) => {

        zkClient.exists(path, (err, stat) => {
            if (err) return reject(err);

            if (stat) {
                console.log(`Node already exists: ${path}`);
                return resolve();
            }

            zkClient.create(path, data, (err) => {
                if (err) return reject(err);

                console.log(`Node created: ${path}`);
                resolve();
            });
        });
    });
}

async function initZookeeper() {
    return new Promise((resolve, reject) => {

        const onConnected = async () => {
            console.log("Zookeeper connected");

            try {
                // creating required nodes
                await createNodeIfNotExists('/counter');   // for ID generation
                resolve();
            } catch (err) {
                reject(err);
            }
        };

        // already connected case
        if (zkClient.getState().name === 'SYNC_CONNECTED') {
            console.log("Zookeeper already connected");
            return onConnected();
        }

        zkClient.once('connected', onConnected);
        zkClient.once('error', reject);

        zkClient.connect();
    });
}

module.exports = initZookeeper;