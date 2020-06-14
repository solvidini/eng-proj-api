const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const errorHandler = require('./utils/errorHandler');
const productsRoutes = require('./routes/products');
const servicesRoutes = require('./routes/services');

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  next();
});

app.use('/products', productsRoutes);
app.use('/services', servicesRoutes);

app.use((error, req, res, next) => {
  //error handler
  error.statusCode = error.statusCode || 500;
  errorHandler(error);
  res.status(error.statusCode).json({ message: error.message });
});

mongoose
  .connect(
    'mongodb+srv://cyber-admin:1423cezqS7@cluster0-liqat.mongodb.net/database?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((result) => {
    console.log('Connected to database.');
    app.listen(process.env.PORT || 8100);
  })
  .catch((err) => {
    console.log(err);
  });
