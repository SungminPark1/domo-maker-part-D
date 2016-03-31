var _ = require('underscore');
var models = require('../models');

var Domo = models.Domo;

var makerPage = function(req, res){
	Domo.DomoModel.findByOwner(req.session.account._id, function(err, docs){
		if(err){
			console.log(err);
			return res.status(400).json({error:'An error occurred'});
		}

		res.render('app', { csrfToken: req.csrfToken(), domos: docs});
	});
};

var makeDomo = function(req, res){
	if( !req.body.name || !req.body.age || !req.body.level){
		return res.status(400).json({error: "RAWR! Name, age, and level are required"});
	}

	var domoData = {
		name: req.body.name,
		age: req.body.age,
		level: req.body.level,
		owner: req.session.account._id
	};

	var newDomo = new Domo.DomoModel(domoData);

	newDomo.save(function(err){
		if(err){
			console.log(err);
			return res.status(400).json({error:'An error occurred'});
		}

		res.json({redirect: '/maker'});
	});
};

var updateDomo = function(req, res){
	if( !req.body.domoName || !req.body.newAge || !req.body.newLevel){
		return res.status(400).json({error: "RAWR! Name, age, and level are required"});
	}

	Domo.DomoModel.findByName(req.body.domoName, function(err, doc){
		//errs, handle them
        if(err) {
            return res.status(400).json({error: 'An error occurred'});         
        }
        //if no matches, let them know (does not necessarily have to be an error since technically it worked correctly)
        if(!doc) {
            return res.status(400).json({error: "No Domo found"});
        }

        doc.age = req.body.newAge;
        doc.level = req.body.newLevel;

        doc.save(function(err) {
            if(err) {
                return res.status(400).json({error: 'An error occurred'});
            }

            res.json({redirect: '/maker'});
        });
	});
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.update = updateDomo;