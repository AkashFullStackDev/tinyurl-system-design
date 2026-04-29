const express = require('express');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.get('/:code/total', analyticsController.getTotalClicks);
router.get('/:code/recent', analyticsController.getRecentClicks);
router.get('/:code/last24h', analyticsController.getLast24Hours);
router.get('/trending', analyticsController.getTrending);

module.exports = router;