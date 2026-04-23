const idService = require('../services/idService');

const getRangeController = async (req, res) => {
    const id = await idService.getNextId();
    res.send(`Generated ID: ${id}`);
};

module.exports = getRangeController;