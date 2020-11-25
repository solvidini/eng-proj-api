const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const errorSchema = new Schema(
   {
      type: {
         type: String,
         required: true,
      },
      message: {
         type: String,
         required: true,
      },
      statusCode: {
         type: Number,
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model('Error', errorSchema);
