const express = require('express');

const servicesController = require('../controllers/services');

const router = express.Router();

router.get('', servicesController.getServices);

router.post('', servicesController.findServices);

module.exports = router;
