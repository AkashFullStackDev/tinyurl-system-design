const express = require('express');
const router = express.Router();
const controller = require('../controllers/urlController');
const os = require("os");
const rateLimiter = require('../middleware/rateLimiter');
const tokenBucket = require('../middleware/tokenBucket');

router.get('/', (req, res) => {
  res.status(200).send(
    `Uptime: ${process.uptime()}, Host: ${os.hostname()}`
  );
});

router.post('/shorten', tokenBucket, controller.shorten);
router.get('/redirect/:code', controller.redirectByShortCode);

module.exports = router;