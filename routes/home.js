var mongoose = require('mongoose');
var Org = mongoose.model('Org');
var _ = require('lodash');
var util = require('util');

exports.index = function(req, res){
  Org.find(function(err, orgs){
    orgs = _.map(orgs, function(o){
      var data = {website:o.website, street:o.street, city:o.city, lat:o.lat, lng:o.lng, type:o.type, url:o.hiringUrl, why:o.whyNashville, isHiring:o.isHiring, name:o.name, icon:o.icon};
      return data;
    });

    res.render('home/index', {title: 'Made In Nashville', orgs:orgs, util:util});
  });
};
