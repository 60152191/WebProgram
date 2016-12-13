var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {type: String, required: true, trim: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  password: {type: String},
  images: [String],
  numComment: {type: Number, default: 0},
  content: {type: String, required: true, trim: true},
  country: {type: String, required: true, trim: true},
  address: {type: String, required: true, trim: true},
  price: {type: String, required: true, trim: true},
  convenient: {type: String, required: true, trim: true},
  rule: {type: String, required: true, trim: true},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var post = mongoose.model('ImgPost', schema);

module.exports = post;
