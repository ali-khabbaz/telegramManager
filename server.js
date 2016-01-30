var express = require('./server/requires.js').express,
	app = require('./server/requires.js').app,
	c = require('./server/requires.js').c,
	cluster = require('./server/requires.js').cluster,
	logger = require('./server/requires.js').logger,
	path = require('./server/requires.js').path,
	bodyParser = require('./server/requires.js').bodyParser,
	cookieParser = require('./server/requires.js').cookieParser,
	decode = require('./server/utilities.js').decode,
	makeRandomString = require('./server/utilities.js').makeRandomString,
	numCPUs = require('./server/requires.js').numCPUs,
	request = require('./server/requires.js').request,
	jwt = require('./server/requires.js').jwt,
	nodemailer = require('./server/requires.js').nodemailer,
	showDb = require('./server/utilities.js').showDb,
	q = require('./server/utilities.js').q,
	createToken = require('./server/utilities.js').createToken,
	passport = require('./server/requires.js').passport,
	local_strategy = require('./server/requires.js').local_strategy,
	multer = require('multer');
var PORT = 80,
	id = 0;
c.connect({
	host: '127.0.0.1',
	user: 'root',
	password: 'bahbah', //'2MsQMSNZ',
	db: 'telegramdb'
});

if (cluster.isMaster) {
	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on('exit', function (worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
} else {
	// Workers can share any TCP connection
	// In this case its a HTTP server
	app.set('views', __dirname + '/public/views');
	app.set('view engine', 'ejs');
	app.use(logger('dev'));
	//app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(cookieParser());
	app.use(
		express.static(path.join(__dirname, '/public'))
	);
	app.use(passport.initialize());

	app.use(function (req, res, next) {
		var temp = {},
			i;
		req.body = JSON.stringify(req.body).replace(/{/g, '').replace(/}/g, '').replace(/\\/g, '').replace(/"/g, '');
		req.body = req.body.split(',');

		for (i = 0; i < req.body.length; i++) {
			req.body[i] = req.body[i].split(':');
			temp[req.body[i][0]] = req.body[i][1];
		}
		req.body = temp;
		next();
	});
	/*app.use(multer({
	 dest: __dirname + '/upload'/!*,
	 limits: {fileSize: 8000000, files: 1}*!/
	 }).single('photo'));*/
	passport.serializeUser(function (user, done) {
		console.log('serializeeee', user);
		if (user) {
			done(null, user.id);
		} else {
			done(null, false, {
				message: 'wrong email or password'
			});
		}

	});

	var strategy_opts = {
		usernameField: 'username',
		passwordField: 'password',
		phoneField: 'phone'
	};

	var login_strategy = new local_strategy(strategy_opts, function (username, password, done) {
		console.log('----------------------call login passport', username, password);
		/*
		 in this part we find the user from DB and return the user object with username and id
		 */
		showDb("SELECT userName,ID,regionId FROM users WHERE userName = '" + username + "' AND " +
			"password = '" + password + "' ").then(function (result) {
			console.log('result is', result);
			if (result.length === 0) {
				console.log('not user');
				return done(null, false, {
					message: 'wrong email or password'
				});
			} else {
				var user = {
					"userName": result[0].userName,
					"id": +result[0].ID,
					"regionId": +result[0].regionId
				};
				return done(null, user);
			}
		}).fail(function (err) {
			console.log('errrrrrrrrr is', err);
			return done(null, false, {
				message: err
			});
		});

	});

	var register_strategy = new local_strategy(strategy_opts, function (email, password, done) {
		console.log('||||||||||||||||||||||call register passport', email, password);
		var query = "INSERT INTO users (`email`, `password`) VALUES ( '" + email + "' , " +
			" '" + password + "' )";
		showDb(query).then(function (res_1) {
			query = "SELECT email , ID FROM users WHERE email = '" + email + "' AND " +
				"password = '" + password + "' ";

			showDb(query).then(function (res_2) {
				var user = {
					"email": res_2[0].email,
					"id": res_2[0].ID
				};
				done(null, user);

			}).fail(function (err_1) {
				console.log('1', err_1);
				res.send('Errrrrrrrrrrrr : ', err);
			});

		}).fail(function (err_2) {
			console.log('1', err_2);
			res.send('Errrrrrrrrrrrr : ', err);
		});
	});

	passport.use('local-register', register_strategy);
	passport.use('local-login', login_strategy);


	var registerFunction = require('./server/apps/register.js').register;
	//var login = require('./server/apps/login.js').login;
	var global = require('./server/apps/global.js').global;
	var pdfServe = require('./server/apps/pdfServe.js').pdfServe;
	var jobs = require('./server/apps/jobs.js').jobs;
	var article_list = require('./server/apps/articleList.js').articleList;
	var video = require('./server/apps/video.js').video;
	var sec_list = require('./server/apps/sec_list.js').sec_list;
	var sections = require('./server/apps/sections.js').sections;


	app.get(/.pdf/, pdfServe);
	//app.post('/app/register', registerFunction);
	// app.post('/app/login', login);
	///ali register ali ali ali ali ali ali ali ali
	/* app.post('/app/register', passport.authenticate('local-register'), function (req, res) {
	 var token = createToken(req.user, req);
	 res.send({
	 user: req.user.email,
	 id: req.user.id,
	 token: token
	 });
	 });*/
	app.post('/app/register', function (req, res) {
		//console.log('register---------', req.query, req.body);
		var search_q = "select * from users where userName = '" + req.query.userName + "'";
		showDb(search_q).then(function (data) {
			if (data.length == 0) {
				if (!req.query.regionId) {
					req.query.regionId = 0;
				}
				var query = 'INSERT INTO users \
                    (userName,password,regionId,phone,panelType,email ) \
                    VALUES \
                    (\'' + req.query.userName + '\' , \'' + req.query.pass + '\', ' + req.query.regionId +
					', ' + req.query.phone + ',' + req.query.panel_type + ',\'' + req.query.email + '\' )';
				showDb(query).then(function () {
					query = 'select u.id id from users u where u.userName = \'' + req.query.userName + '\' ';
					showDb(query).then(function (result) {
						query = 'select count(u.userName) from users u where u.userName = \'' + req.query.userName + '\' ';
						var user = {};
						user.id = result[0].id;
						res.send({
							userName: 'Notexist',
							token: createToken(user, req)
						});
					});
				});
			} else {
				res.send({
					userName: 'exist'
				});
			}
		});
	});
	app.post('/app/login', passport.authenticate('local-login'), function (req, res) {
		var token = createToken(req.user, req);
		res.send({
			user: req.user.userName,
			regionId: req.user.regionId,
			token: token
		});
	});
	app.post('/app/google-auth', function (req, res) {
		var url = 'https://accounts.google.com/o/oauth2/token',
			apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect',
			params = {
				"client_id": req.body.client_id,
				"code": req.body.code,
				"redirect_uri": req.body.redirect_uri,
				"grant_type": 'authorization_code',
				"client_secret": 'luhLc7grx54U1pp_7BeadJep'
			};

		request.post(url, {
			"json": true,
			"form": params
		}, function (err, response, token) {
			var access_token = token.access_token,
				headers = {
					"Authorization": 'Bearer ' + access_token
				};
			request.get({
				"url": apiUrl,
				"headers": headers,
				"json": true
			}, function (err_2, response_2, profile) {
				if (!profile.code) {
					profile.sub = +profile.sub;
					console.log('profile', profile);
					var query = "SELECT ID FROM users WHERE email = '" + profile.email + "' AND " +
						"google_id = '" + profile.sub + "' ";

					showDb(query).then(function (res_2) {
						if (!res_2.length) {
							console.log('creating user');
							query = "INSERT INTO users (google_id , email, gender, name, first_name , last_name " +
								",picture ,google_profile) VALUES ('" + profile.sub + "' , '" + profile.email + "', " +
								"'" + profile.gender + "', '" + profile.name + "', '" + profile.given_name + "' ," +
								"'" + profile.family_name + "', '" + profile.picture + "' , '" + profile.profile + "' )";
							console.log('queryyyyyyyy', query);
							showDb(query).then(function (res_3) {
								console.log('user created');
								showDb("SELECT email , ID FROM users WHERE email = '" + profile.email + "' AND " +
									"google_id = '" + profile.sub + "' ").then(function (result) {
									console.log('result is', result[0].ID);
									var token = createToken({
										"id": +result[0].ID
									}, req);
									res.send({
										user: profile.email,
										id: +result[0].ID,
										token: token
									});

								}).fail(function (err) {
									console.log('errrrrrrrrr is', err);
								});


							}).fail(function (err_3) {
								console.log('err_3', err_3);
							});
						} else {
							console.log('user existed', res_2);
							showDb("SELECT email , ID FROM users WHERE email = '" + profile.email + "' AND " +
								"google_id = '" + profile.sub + "' ").then(function (result) {
								console.log('result is', result[0].ID);
								var token = createToken({
									"id": +result[0].ID
								}, req);
								res.send({
									user: profile.email,
									id: +result[0].ID,
									token: token
								});

							}).fail(function (err) {
								console.log('errrrrrrrrr is', err);
							});
						}

					}).fail(function (err_1) {
						console.log('1', err_1);
						res.send('Errrrrrrrrrrrr : ', err);
					});
				}
			});
		});
	});

	app.post('/app/forgottenPassword', function (req, res) {
		console.log('forgottenPassword---------', req.query.email);
		var search_q = "select id from users where email = '" + req.query.email + "'",
			newPassword;
		showDb(search_q).then(function (data) {
			if (data.length == 0) {
				res.send({
					email: 'email not exist'
				});
			} else {
				newPassword = makeRandomString(8);
				console.log('-----newPassword', newPassword);
				var smtpTransport = nodemailer.createTransport("SMTP", {
					service: "Gmail",
					auth: {
						user: "ali.khabbaz14@gmail.com",
						pass: "bahbahbah"
					}
				});
				var mailOptions = {
					from: "ali khabbaz <ali.khabbaz14@gmail.com>", // sender address
					to: req.query.email, // list of receivers
					subject: "ali testing ✔", // Subject line
					text: "Hello world ✔", // plaintext body
					html: "رمز عبور جدید : <b>" + newPassword + "</b>" // html body
				}
				smtpTransport.sendMail(mailOptions, function (error, response) {
					if (error) {
						console.log(error);
					} else {
						console.log("Message sent: " + response.message);
						smtpTransport.close();
						query = 'UPDATE users SET password = \'' + newPassword +
							'\' WHERE  email = \'' + req.query.email + '\'  ';
						showDb(query).then(function () {
							res.send('password sent');
						});

					}
				});

			}
		});
	});

	app.post('/app/jobs', jobs);
	app.post('/app/articleList', article_list);
	app.post('/app/video', video);
	app.post('/app/sec_list', sec_list);
	app.post('/app/sections', sections);
	app.get('/', global);
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			console.log('*********', id);
			cb(null, __dirname + '/public/upload')
		},
		filename: function (req, file, cb) {
			file.fieldname = file.originalname;
			cb(null, file.fieldname)
		}
	});
	var uploading = multer({
		storage: storage,
		fileFilter: function (req, file, cb) {
			cb(null, hasRequiredFields(req.headers, cb))
		},
		onError: function (err, next, cb) {
				console.log('error', err);
				cb(new Error('I don\'t have a clue!'));
				next(err);
			}
			/*,
			 changeDest: function (dest, req, res) {
			 var newDestination = dest + req.params.type;
			 var stat = null;
			 try {
			 stat = fs.statSync(newDestination);
			 } catch (err) {
			 fs.mkdirSync(newDestination);
			 }
			 if (stat && !stat.isDirectory()) {
			 throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
			 }
			 return newDestination
			 }*/
	});

	function hasRequiredFields(fields, cb) {
		//cb(new Error('I don\'t have a clue!'));
		if (!fields.authorization) {
			cb(new Error('I don\'t have a clue!'));
			return false;
		}
		var token = '';
		if (fields.authorization.indexOf('ali is just.') !== -1) {
			token = fields.authorization.split('ali is just.')[1];
		} else if (fields.authorization.indexOf('ali is just') !== -1) {
			token = fields.authorization.split('ali is just')[1];
		}
		var payload = jwt.decode(token, "shh...");
		if (!payload.sub) {
			cb(new Error('I don\'t have a clue!'));
			return false;
		}
		return true;
	}

	app.post('/app/upload', uploading.single('file'), function (req, res) {
		var name = req.file.filename,
			type = req.file.mimetype.split('/')[0],
			query;

		console.log('-----', req.file, name, type);

		var token = '';
		if (req.headers.authorization.indexOf('ali is just.') !== -1) {
			token = req.headers.authorization.split('ali is just.')[1];
		} else if (req.headers.authorization.indexOf('ali is just') !== -1) {
			token = req.headers.authorization.split('ali is just')[1];
		}
		var payload = jwt.decode(token, "shh...");

		id = payload.sub;
		query = 'INSERT INTO files (user_id, name, type) VALUES (' + id + ', \'' + name + '\', \'' + type + '\' )';
		showDb(query).then(function (res1) {
			if (res1[0]) {
				return res.status(401).send({
					message: 'upload failed'
				});
			} else {
				res.send({
					status: 'ok'
				});
			}
		});
		/*res.send({
		 status: 'ok'
		 });*/
	});
	app.post('/app/order', function (req, res) {
		var q = " INSERT INTO `order` (name, lastName, email , phone " +
			") VALUES ('" + req.query.name + "', " +
			"'" + req.query.lastname + "', '" + req.query.email + "' ," +
			"'" + req.query.phone + "' )";
		showDb(q).then(function () {
			console.log('ORDER>>>>>>>>insert OK');
			res.send({
				'status': 'ok'
			});
		});
	});

	app.post('/app/videos', function (req, res) {
		console.log('----------headers-----', req.headers);
		if (!req.headers.authorization) {
			return res.status(401).send({
				message: 'you are not authorized'
			});
		}
		var token = '';
		if (req.headers.authorization.indexOf('ali is just.') !== -1) {
			token = req.headers.authorization.split('ali is just.')[1];
		} else if (req.headers.authorization.indexOf('ali is just') !== -1) {
			token = req.headers.authorization.split('ali is just')[1];
		}
		var payload = jwt.decode(token, "shh...");
		if (!payload.sub) {
			return res.status(401).send({
				message: 'authentication failed'
			});
		}
		id = payload.sub;
		query = 'SELECT name FROM files WHERE user_id = ' + id + ' AND type= \'video\' ';
		console.log('--------------', query);
		showDb(query).then(function (res1) {
			res.send(res1);
		}).fail(function (err) {
			return res.status(401).send({
				Err: res1[0]
			});
		});
	});
	app.post('/app/images', function (req, res) {
		console.log('imagessssss');
		if (!req.headers.authorization) {
			return res.status(401).send({
				message: 'you are not authorized'
			});
		}
		var token = '';
		if (req.headers.authorization.indexOf('ali is just.') !== -1) {
			token = req.headers.authorization.split('ali is just.')[1];
		} else if (req.headers.authorization.indexOf('ali is just') !== -1) {
			token = req.headers.authorization.split('ali is just')[1];
		}
		var payload = jwt.decode(token, "shh...");
		if (!payload.sub) {
			return res.status(401).send({
				message: 'authentication failed'
			});
		}
		id = payload.sub;
		query = 'SELECT name FROM files WHERE user_id = ' + id + ' AND type= \'image\' ';
		console.log('--------------', query);
		showDb(query).then(function (res1) {
			res.send(res1);
		}).fail(function (err) {
			return res.status(401).send({
				Err: res1[0]
			});
		});
	});
	//////iman servicesssss///////////////////////
	////// app.post('/app/status', function (req, res) {
	//////      console.log('Statusssssss');
	//////      res.send({
	////// //////          'status': 0,
	//////          'name':'????? ??'
	//////      });
	//////  });
	/*    app.post('/app/latary', function (req, res) {
	 var query = "INSERT INTO latary (telegramID, userName ,answer" +
	 ") VALUES ('" + req.body.telegramID + "', " +
	 "'" + req.body.userName + "', " +
	 "'" + req.body.answer + "' )";
	 showDb(query).then(function (result) {
	 console.log('-----latary insert OK------');
	 });
	 });*/
	app.post('/app/consituency', function (req, res) {
		console.log('consituency', req.body);
		var search_person = "select * from people where telegramID =" + req.body.telegramID;
		showDb(search_person).then(function (result) {
			if (result.length === 0) {
				//insert
				var insert_query = "INSERT INTO people (telegramID , firstName, lastName , phone, cityId , userName " +
					") VALUES ('" + req.body.telegramID + "', " +
					"'" + req.body.firstName + "', '" + req.body.lastName + "' ," +
					"'" + req.body.phone + "', '" + req.body.cityId + "', '" + req.body.userName + "' )";
				showDb(insert_query).then(function () {
					console.log('>>>>>>>>insert OK');
				});
			} else {
				////update
				var update_query = 'UPDATE people ' + ' SET cityId= ' + req.body.cityId +
					' , phone =' + req.body.phone + ' , firstName =' + ' "' + req.body.firstName +
					'"' + ' , lastName =' + ' "' + req.body.lastName +
					'"' + ' , userName =' + ' "' + req.body.userName + '"' + ' WHERE  telegramID =' + req.body.telegramID;
				showDb(update_query).then(function () {
					console.log('update OK......');
				});
			}
			//var res_query = "select * from region r join city c on r.id = c.regionId join group_chanel gc ON c.regionId = gc.regionId  where  c.id =" + req.body.cityId;
			var res_query = "select candidaLink,chanelID from users where  regionId = " + req.body.regionId;
			showDb(res_query).then(function (consituency_res) {
				var candida_Ids = '',
					candida_link = '';
				res.send({
					candida_ids: candida_Ids,
					candida_Link: candida_link
				});

				/* var result = [consituency_res[0].regionId, consituency_res[0].center_name,
				 consituency_res[0].name, consituency_res[0].korsiNumber,
				 consituency_res[0].version
				 ];

				 var chanel_group_Ids = consituency_res[0].chanelId + ',' + consituency_res[0].intro_chanel_id + ',' + consituency_res[0].state_chanel_id; //+
				 //',' + '156863988';
				 var candida_Ids = '';
				 var chanel_group_link = consituency_res[0].chanelLink + ',' + consituency_res[0].intro_chanel_link + ',' + consituency_res[0].state_chanel_link; //+',' + 'Kvote_bot';
				 var candida_link = '';
				 res.send({
				 consituency_res: result,
				 chanel_group_ids: chanel_group_Ids,
				 candida_ids: candida_Ids,
				 chanel_group_Link: chanel_group_link,
				 candida_Link: candida_link
				 });*/
			});
		});
	});
	app.post('/app/telegram_register', function (req, res) {
		var s_q = 'select telegramID,cityId,other_city from people where telegramID = ' + req.body.telegramID;
		showDb(s_q).then(function (result) {
			if (result.length == 0) {
				var query = "INSERT INTO people (telegramID, firstName, lastName , phone " +
					") VALUES ('" + req.body.telegramID + "', " +
					"'" + req.body.firstName + "', '" + req.body.lastName + "' ," +
					"'" + req.body.phone + "' )";
				showDb(query).then(function () {
					console.log('>>>>>>>>insert OK');
				});

				res.send([1, -1, '']);

			} else if (req.body.cityId && req.body.cityId != -1) {
				var update_query = " UPDATE people set cityId = '" + req.body.cityId + "'," +
					"other_city = '" + req.body.other_city + "'" +
					" where telegramID = " + req.body.telegramID;
				showDb(update_query).then(function () {
					console.log('>>>>>>>>Update OK');
				});
				if (req.body.other_city) {
					res.send([1, req.body.cityId, req.body.other_city]);
				} else {
					res.send([1, req.body.cityId, '']);
				}

			} else {
				console.log('user already registerd!!!!');
				var city_id = -1,
					other_city = '';
				if (result[0].other_city) {
					other_city = result[0].other_city
				}
				if (result[0].cityId) {
					city_id = result[0].cityId
				}
				res.send([1, city_id, other_city]);
			}
		});
	});

	app.post('/app/consituency_version', function (req, res) {
		console.log('consituency_version');
		var search_region =
			"select version from region where id = (select regionId from city where id=(select cityId from people where telegramID =" + req.body.telegramID + "))";
		showDb(search_region).then(function (version_result) {
			console.log('response : ', version_result);
			res.send(version_result);
		});
	});
	app.post('/app/advertise', function (req, res) {
		console.log('advertise');
		var search_advertise =
			'select ad.day,ad.count,ad.content,ad.titel,ad.icon_url,p1.chanalLink ' +
			' from advertise ad join  user p1 ' +
			' on ad.candidaId = p1.id and ad.region_id' + req.body.regionid;
		var arr = [];
		showDb(search_advertise).then(function (advertise_result) {
			if (advertise_result.length === 0) {
				arr.push(['0', '0', '0', '0', '0', '0', '0', '1', '0']);
			} else {
				for (var i = 0; i < advertise_result.length; i++) {
					arr.push(['1', advertise_result[i].day, advertise_result[i].count,
						advertise_result[i].content, advertise_result[i].titel, advertise_result[i].icon_url,
						advertise_result[i].chanalLink, '1', advertise_result[i].regionId, "" ///توضیحات اضافی
					]);
				}
			}
			res.send({
				advers: arr
			});
		});
	});
	app.post('/app/advertise_status', function (req, res) {
		console.log('advertise_status > regionId ::', req.body.regionId);
		var query = "select version from advertise_version where regionId =" + req.body.regionId;
		showDb(query).then(function (result) {
			res.send([result[0].version, '0']);
		});
	});

	app.post('/app/melegram_version', function (req, res) {
		res.send([0, 0, 'ایران - انتخابات']);
		/*res.send({
		 0, //version
		 0, //status   0  for active    1 for inactive
		 '????? ??' //name

		 });*/
	});
	app.post('/app/advertise_insert', function (req, res) {
		console.log('>>>>>>>>', req.query);
		var search_advertise = "select candidaId from advertise where candidaId = '" + req.query.candidaId + "'" +
			" and day = '" + req.query.day + "'";
		showDb(search_advertise).then(function (result) {
			if (result.length == 0) {
				var query = "INSERT INTO advertise (regionId,candidaId,day,count,content,titel,icon_url,userid" +
					") VALUES ('" + req.query.regionId + "', " +
					"'" + req.query.candidaId + "', " + "'" + req.query.day + "', " + "'" + req.query.count + "', " + "'" +
					req.query.content + "', " +
					"'" + req.query.title + "', " + "'" + req.query.iconUrl + "', " + "'" + req.query.id + "' )";
				var version = "select * from advertise_version where regionId = '" + req.query.regionId + "'";
				showDb(version).then(function (res) {
					if (res.length === 0) {
						var q2 = " INSERT INTO advertise_version (regionId,version" +
							") VALUES ('" + req.query.regionId + "', " +
							"'" + 0 + "' )";
						showDb(q2).then(function () {
							console.log('select to version');
						})
					} else {
						var update_version = "update advertise_version set version = version+1 where regionId ='" + req.query.regionId + "'";
						showDb(update_version).then(function () {
							console.log('update to version');
						})
					}
				});
				showDb(query).then(function () {
					res.send({
						advertise: 'notExist'
					});
				});
			} else {
				var update_ad = "update advertise set regionId = '" + req.query.regionId + "'" +
					"  ,count = '" + req.query.count + "'" + ",  icon_url = '" + req.query.iconUrl + "'" +
					", titel  = '" + req.query.title + "'" + ", content  = '" + req.query.content + "'" +
					" where candidaId = '" + req.query.candidaId + "'" +
					" and day = '" + req.query.day + "'";
				var update_version = "update advertise_version set version = version+1 where regionId ='" + req.query.regionId + "'";
				showDb(update_version).then(function () {
					showDb(update_ad).then(function () {
						res.send({
							advertise: 'exist'
						});
					});
				});
			}
		});
	});
	app.post('/app/getStates', function (req, res) {
		var state = "select * from state";
		showDb(state).then(function (result) {
			res.send(result);
		});
	});
	app.get('/app/getCity', function (req, res) {
		var pattern = decodeURI(req.query.ss);
		console.log('>>pattern>>', pattern);
		var state = "select city , regionId from city where stateID = " + pattern;
		showDb(state).then(function (result) {
			console.log('>>>', result);
			res.send(result);
		});
	});
	app.post('/app/paymentCode', function (req, res) {
		console.log('+req.query.amount', req.query, req.body, +req.query.amount);
		var curl = require('curlrequest'),
			querystring = require('querystring'),
			url = 'http://payline.ir/payment/gateway-send',
			options = {
				url: 'http://payline.ir/payment/gateway-send',
				data: { //Data to send, inputName : value
					api: '164ee-a44de-3f114-8b564-c9aa7964d934773c10dc7e6bdfdd',
					amount: +req.query.amount,
					redirect: 'http://melegram.com/app/paymentCheck'
				},
				method: 'POST'
			};

		curl.request(options, function (err, data) {
			var payload = jwt.decode(req.body.token, "shh...");
			query = 'update users u set u.idGet = ' + data + ' where u.ID = ' + payload.sub;
			showDb(query).then(function () {
				res.send(data);
			});
		});
	});
	app.post('/app/paymentCheck', function (req, res) {
		console.log('payline------vvvvv------\n', req.body);
		doubleCheck(req.body.trans_id, req.body.id_get).then(function (result) {
			console.log('result---------------', result);
			if (result > 0) {
				query = 'update users u set u.confirmed = \'Y\' where u.idGet = ' + req.body.id_get;
				showDb(query).then(function () {
					res.send(data);
				});
				res.send('<p>payment successful</p>');
				//res.render('index');
			} else {
				// res.send('<p>payment not successful</p>');
				res.render('index');
			}
		});
	});

	function doubleCheck(trans_id, id_get) {
		var q = require('q'),
			dfd = q.defer(),
			request = require('request');
		request.post({
			url: 'http://payline.ir/payment/gateway-result-second',
			form: {
				api: '164ee-a44de-3f114-8b564-c9aa7964d934773c10dc7e6bdfdd',
				trans_id: trans_id,
				id_get: id_get
			}
		}, function (err, httpResponse, body) {
			console.log('----doubleCheck---------------', err, body, !err, body > 0);
			if (!err && body > 0) {
				dfd.resolve(body);
			} else {
				console.log('errrrrrr', err, body);
				dfd.resolve(null);
			}
		});
		return dfd.promise;
	}
	app.listen(PORT);
	console.log('listening on port', PORT);
}


/*app.post('/profile', multer({
 dest: 'uploads/',
 rename: function (fieldname, filename, req, res) {
 var newDestination = path.join(req.body.hdnUserName);
 return newDestination;
 }
 }).single('uploadedFile'), function (req, res, next) {
 res.end('over');
 });*/

//{ trans_id: '10031527', id_get: '9571377' }