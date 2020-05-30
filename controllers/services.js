const Service = require('../models/service');

exports.getServices = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.body.perPage || 5;
  let totalItems;

  if (currentPage < 1) {
    const error = new Error(
      'Page number must be equal or greater than 1.'
    );
    error.statusCode = 422;
    throw error;
  }

  Service.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Service.find()
        .sort({ title: 1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((services) => {
      res.status(200).json({
        message: 'Fetched services successfully.',
        services: services,
        totalItems: totalItems,
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
  const currentPage = req.query.page || 1;
  const perPage = req.body.perPage || 5;
  let expression = req.body.expression;
  let totalItems;

  if (currentPage < 1) {
    const error = new Error(
      'Page number must be equal or greater than 1.'
    );
    error.statusCode = 422;
    throw error;
  }
  if (typeof expression === 'undefined' || expression === null) {
    const error = new Error('To find items expression must be set.');
    error.statusCode = 422;
    throw error;
  }
  expression = String(expression);

  expression = expression.replace(/(^\s+)|(\s+$)/g, '');
  expression = expression.replace(/(\s\s+)/g, ' ');
  let expressionArray = expression.split(' ');

  expressionArray = expressionArray.map((exp) => {
    return {
      $or: [
        { title: new RegExp(exp, 'gi') },
        { company: new RegExp(exp, 'gi') },
        { category: new RegExp(exp, 'gi') },
        { description: new RegExp(exp, 'gi') },
      ],
    };
  });

  expressionArray = { $and: expressionArray };

  console.log(expressionArray);

  Service.find(expressionArray)
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Service.find(expressionArray)
        .sort({ title: 1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((services) => {
      res.status(200).json({
        message: 'Fetched found services successfully.',
        services: services,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
