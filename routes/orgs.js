var mongoose = require('mongoose');
var Org = mongoose.model('Org');

/*
 * POST /org
 */

exports.create = function(req, res){
  console.log('before');
  console.log(req.body);
  new Org(req.body).save(function(err, org){
    console.log('after');
    console.log(org);
    res.send(org);
  });
};

