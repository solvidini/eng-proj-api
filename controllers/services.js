const Service = require('../models/service');

exports.getServices = (req, res, next) => {
  const currentPage = req.query.page || 1;
  let perPage = req.query.perPage || 5;
  let totalItems;

  if (!Number.isInteger(perPage)) {
    perPage.replace(/[^0-9]/g, '');
    perPage = Number(perPage);
  }
  if (!(perPage > 0 && perPage <= 30)) {
    perPage = 5;
  }

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

  expression = expression.replace(
    /[^,0-9a-zA-Z*ĄĆĘŁŃÓŚŹŻąćęłńóśźż\s]+/g,
    ''
  );
  //remove redundant spaces
  expression = expression.replace(/(\s\s+)/g, ' ');
  expression = expression.replace(/(^\s+)|(\s+$)|(,\s)|(\s,)/g, ',');
  //remove redundant *
  expression = expression.replace(/(^\*+)|(\*+$)/g, '');
  expression = expression.replace(/(\*\*+)/g, '*');
  //remove redundant ,
  expression = expression.replace(/(^,+)|(,+$)/g, '');
  expression = expression.replace(/(,,+)/g, ',');

  let expressionArray = expression.split(',');

  expressionArray = expressionArray.map((exp) => {
    if (/\*$/gi.test(exp)) {
      exp = exp.replace('*', '');
      console.log(new RegExp(['^', exp, '$'].join(''), 'i'));
      return {
        $or: [
          { title: new RegExp(['^', exp, '$'].join(''), 'gi') },
          { company: new RegExp(['^', exp, '$'].join(''), 'gi') },
          { category: new RegExp(exp, 'gi') },
          { description: new RegExp(['^', exp, '$'].join(''), 'gi') },
        ],
      };
    } else {
      if (
        exp.length > 2 &&
        (exp.slice(exp.length - 1, exp.length) === 'a' ||
          exp.slice(exp.length - 1, exp.length) === 'i' ||
          exp.slice(exp.length - 1, exp.length) === 'e' ||
          exp.slice(exp.length - 1, exp.length) === 'y' ||
          exp.slice(exp.length - 1, exp.length) === 'o')
      ) {
        exp = exp.slice(0, -1);
      }
      return {
        $or: [
          { title: new RegExp(exp, 'gi') },
          { company: new RegExp(exp, 'gi') },
          { category: new RegExp(exp, 'gi') },
          { description: new RegExp(exp, 'gi') },
        ],
      };
    }
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
