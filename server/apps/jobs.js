(function () {
	'use strict';
	var jwt = require('../requires.js').jwt;

	function jobs(req, res) {
		if (!req.headers.ali) {
			return res.status(401).send({
				message: 'you are not authorized'
			});
		}
		var token = '';
		if (req.headers.ali.indexOf('ali is just.') !== -1) {
			token = req.headers.ali.split('ali is just.')[1];
		} else if (req.headers.ali.indexOf('ali is just') !== -1) {
			token = req.headers.ali.split('ali is just')[1];
		}
		var payload = jwt.decode(token, "shh...");
		if (!payload.sub) {
			return res.status(401).send({
				message: 'authentication failed'
			});
		}
		res.json({
			salam: "bahbah"
		});
	}

	exports.jobs = jobs;
}());