// 'use strict';

// var soap = require('soap');



// function sendSMS(req, res) {


// 	console.log('!!!!!!!!!!!!!!!!!!', req.body);


// 	var url = 'http://87.107.121.54/post/send.asmx?wsdl';
// 	var text = 'کاربر گرامی ، ' + decodeURI(req.query.fname) + ' ' + decodeURI(req.query.lname) + ' عزیز \n خوش آمدید.';

// 	var sms_args = {
// 		username: '91587970972',
// 		password: 'dayantest123',
// 		to: req.query.number,
// 		from: '10001210271813',
// 		text: text
// 	};
// 	soap.createClient(url, function (err, client) {
// 		//console.log(client);
// 		if (err) {
// 			console.log(err);
// 		}

// 		client.Send.SendSoap.SendSimpleSMS2(sms_args, function (err, result) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("Message sent: ", result);
// 				res.sendStatus(200);
// 			}
// 		});
// 	});
// }


// sendMail('forget', 'efewargergrtgr', 'poorya200x@gmail.com', 'sdfsfse');
// sendMail('register', 'efewargergrtgr', 'poorya200x@gmail.com', 'sdfsfse');
// sendSMS2('09364729436', 'سعید', 'شید کالایی', 'complete');

// exports.sendSMS = sendSMS;