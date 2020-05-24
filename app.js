const express = require('express');
const mongoose = require('mongoose');


const app = express();

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
