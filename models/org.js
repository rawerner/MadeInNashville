var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Org = mongoose.Schema({
  name            : String,
  street          : String,
  city            : String,
  lat             : Number,
  lng             : Number,
  type            : String,
  imgUrl          : String,
  isHiring        : {type: Boolean, default: false},
  whyNashville    : String,
  website         : String,
  hiringUrl       : String,
  icon            : String,
  // email           : {type: String, required: true, unique: true},
  // password        : {type: String, required: true},
  // isAdmin         : {type: Boolean, default: false},
  // supportGGD      : {type: Boolean, default: true},
  createdAt       : {type: Date, default: Date.now}
});

Org.plugin(uniqueValidator);
mongoose.model('Org', Org);

