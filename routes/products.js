const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();

router.get('', productsController.getProducts);

router.post('', productsController.findProducts);

module.exports = router;
