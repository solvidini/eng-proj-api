const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 5;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Product.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((products) => {
      res.status(200).json({
        message: 'Fetched products successfully.',
        products: products,
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

exports.findProducts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 5;
  let totalItems;
  let expression;

  expression = req.body.expression.replace(/(^\s+)|(\s+$)/g, '');
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

  Product.find(expressionArray)
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Product.find(expressionArray)
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((products) => {
      res.status(200).json({
        message: 'Fetched found products successfully.',
        products: products,
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
