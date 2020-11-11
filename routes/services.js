const express = require('express');

const servicesController = require('../controllers/services');

const router = express.Router();

router.get('/page/:pageNumber', servicesController.getServices);

router.get('', servicesController.getServices);

router.post('/page/:pageNumber', servicesController.findServices);

router.post('', servicesController.findServices);

module.exports = router;
