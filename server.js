const app = require('./src/app');
const initAll = require('./startup/index');

initAll()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch(err => {
        console.error("Startup failed:", err.message);
        process.exit(1);
    });


