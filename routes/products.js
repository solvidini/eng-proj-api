const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();

router.get('/page/:pageNumber', productsController.getProducts);

router.get('/', productsController.getProducts);

router.post('/page/:pageNumber', productsController.findProducts);

router.post('/', productsController.findProducts);

module.exports = router;
