const Error = require('../models/error');

module.exports = async (error) => {
  const newError = new Error({
    type: 'API',
    message: error.message,
    statusCode: error.statusCode,
  });
  console.error(
    newError.type,
    '\n',
    newError.message,
    '\n',
    newError.statusCode
  );
  try {
    await newError.save();
  } catch (err) {
    console.log(err);
  }
};
