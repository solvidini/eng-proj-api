const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
   {
      scrapeID: {
         type: String,
         required: true,
      },
      title: {
         type: String,
         required: true,
      },
      company: {
         type: String,
         required: true,
      },
      category: {
         type: String,
         required: true,
      },
      path: {
         type: String,
         required: true,
      },
      uri: {
         type: String,
         required: true,
      },
      reference: {
         type: String,
         required: true,
      },
      description: {
         type: String,
      },
      price: {
         type: String,
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model('Product', productSchema);
