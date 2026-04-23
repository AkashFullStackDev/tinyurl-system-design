const express = require('express');
const router = express.Router();
const controller = require('../controllers/urlController');
const getRangeController = require('../controllers/zkRangeAllocationController');
const {getCounter} = require('../services/testZk');
const os = require("os");

router.get('/', (req, res) => {
  res.status(200).send(
    `Uptime: ${process.uptime()}, Host: ${os.hostname()}`
  );
});

router.post('/shorten', controller.shorten);
router.get('/redirect/:code', controller.redirectByShortCode);

router.get('/zoo', async (req, res) => {
    try {
        const value = await getCounter();
        res.send(`Counter value: ${value}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/zoo/id',getRangeController);

module.exports = router;