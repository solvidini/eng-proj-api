const Product = require('../models/product');
const searchExpressionGenerator = require('../utils/searchExpressionGenerator');

exports.getProducts = (req, res, next) => {
   let currentPage = +req.params.pageNumber || 1;
   let perPage = 5;
   let totalItems;

   if (!currentPage && currentPage < 1) {
      const error = new Error('Page number must be equal or greater than 1.');
      error.statusCode = 422;
      throw error;
   }
   currentPage = Math.abs(currentPage);

   Product.find()
      .countDocuments()
      .then((count) => {
         totalItems = count;
         if (currentPage > Math.ceil(totalItems / perPage)) {
            currentPage = Math.ceil(totalItems / perPage) || 1;
         }
         return Product.find()
            .sort({ category: 1 })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
      })
      .then((products) => {
         res.status(200).json({
            message: 'Fetched products successfully.',
            products,
            totalItems,
            currentPage,
            perPage,
         });
      })
      .catch((err) => {
         if (!err.statusCode) {
            err.statusCode = 500;
         }
         next(err);
      });
};

exports.findProducts = (req, res, next) => {
   let currentPage = +req.params.pageNumber || 1;
   let perPage = req.body.perPage || 5;
   let expression = req.body.expression;
   let totalItems;

   if (!Number.isInteger(perPage)) {
      perPage.replace(/[^0-9]/g, '');
      perPage = Number(perPage);
   }
   if (!(perPage > 0 && perPage <= 30)) {
      perPage = 5;
   }
   if (!currentPage && currentPage < 1) {
      const error = new Error('Page number must be equal or greater than 1.');
      error.statusCode = 422;
      throw error;
   }
   currentPage = Math.abs(currentPage);

   const expressionArray = searchExpressionGenerator(expression);

   Product.find(expressionArray)
      .countDocuments()
      .then((count) => {
         totalItems = count;
         if (currentPage > Math.ceil(totalItems / perPage)) {
            currentPage = Math.ceil(totalItems / perPage) || 1;
         }
         return Product.find(expressionArray)
            .sort({ category: 1 })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
      })
      .then((products) => {
         res.status(200).json({
            message: 'Fetched found products successfully.',
            products,
            totalItems,
            currentPage,
            perPage,
         });
      })
      .catch((err) => {
         if (!err.statusCode) {
            err.statusCode = 500;
         }
         next(err);
      });
};
