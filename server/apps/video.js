(function () {

	var jwt = require('../requires.js').jwt,
		q = require('../requires.js').q,
		showDb = require('../utilities.js').showDb;

	function video(req, res) {
		/*var temp = {},
			i;
		req.body = JSON.stringify(req.body).replace(/{/g, '').replace(/}/g, '').replace(/\\/g, '').replace(/"/g, '');
		req.body = req.body.split(',');
		for (i = 0; i < req.body.length; i++) {
			req.body[i] = req.body[i].split(':');
			console.log(req.body[i]);
			temp[req.body[i][0]] = req.body[i][1];
		}*/
		console.log('>>>>>', req.body);
		/*var query = "SELECT article_id, section_id, video_id, section_name," +
			"video_name FROM videos WHERE article_id = " + req.body.article_id + " AND " +
			" section_id = " + req.body.section_id + " AND" +
			" video_id = " + req.body.video_id + " " +
			" ORDER BY video_id ASC";
		showDb(query).then(function (res_1) {
			res.send({
				"err": null,
				"data": res_1
			});
		}).fail(function (err_1) {
			res.send({
				"err": err_1,
				"data": ''
			});
		});*/

	}

	exports.video = video;
}());