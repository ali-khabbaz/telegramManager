(function () {

	//var showDb = require('../utilities.js').showDb;
	var c = require('../requires.js').c;
	var xlsx = require('../requires.js').xlsx;
	var fs = require('../requires.js').fs;
	var q = require('../requires.js').q;

	function vahid(req, res) {
		// var obj = xlsx.
		// parse('D:/project/Book1.xlsx');
		// var data = obj[0].data;
		// for (var x in data) {

		// 	if (x === '0') {
		// 		continue;
		// 	} else {
		// 		var center_name = data[x][3];
		// 		var name = data[x][2];
		// 		console.log(center_name);
		// 	}
		// }
		// res.send(data[2][2]);

		/*var query = "insert into state (name,description) VALUES ('بجنن','صیصی')";*/
		/*var query = "select * from state ";
		showDb(query).
		then(function (res_0) {
			res.send({
				data: res_0
			});
		});*/
		var q1 = "insert into table1 (name) VALUES('vahiddd')";
		var q2 = "insert into table1 (name) VALUES('vahiddd222')";
		var array = [q1, q2];
		showDb(array).then(function (res) {
			console.log('>>>>', res);
		});

	}

	function showDb(array) {
		var dfd = q.defer(),
			res_result = [];
		c.query('').on('result', function (res) {
			// `res` is a streams2+ Readable object stream
			res.on('data', function (row) {
				// console.log(row);
				res_result.push(row);
			}).on('end', function () {
				console.log('Result set finished');
			});
		}).on('error', function (err) {
			console.log('\n\n\n\n\n\n', err, '\n\n\n\n\n\n');
			dfd.reject(new Error(err));
		}).on('end', function () {
			dfd.resolve(res_result);
			console.log('No more result sets!');
		});
		c.end();
		return dfd.promise;
	}

	exports.vahid = vahid;
}());