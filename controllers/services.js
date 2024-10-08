const Service = require('../models/service');
const generateRegExpBasedQuery = require('../utils/generateRegExpBasedQuery');

exports.getServices = (req, res, next) => {
   let currentPage = +req.params.pageNumber || 1;
   let perPage = 5;
   let totalItems;

   if (!currentPage && currentPage < 1) {
      const error = new Error('Page number must be equal or greater than 1.');
      error.statusCode = 422;
      throw error;
   }
   currentPage = Math.abs(currentPage);

   Service.find()
      .countDocuments()
      .then((count) => {
         totalItems = count;
         if (currentPage > Math.ceil(totalItems / perPage)) {
            currentPage = Math.ceil(totalItems / perPage) || 1;
         }
         return Service.find()
            .sort({ title: 1 })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
      })
      .then((services) => {
         res.status(200).json({
            message: 'Fetched services successfully.',
            services,
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

exports.findServices = (req, res, next) => {
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

   const regExpBasedQuery = generateRegExpBasedQuery(expression);

   Service.find(regExpBasedQuery)
      .countDocuments()
      .then((count) => {
         totalItems = count;
         if (currentPage > Math.ceil(totalItems / perPage)) {
            currentPage = Math.ceil(totalItems / perPage) || 1;
         }
         return Service.find(regExpBasedQuery)
            .sort({ title: 1 })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
      })
      .then((services) => {
         res.status(200).json({
            message: 'Fetched found services successfully.',
            services,
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
