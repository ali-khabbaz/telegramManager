define(['app'], function (app) {
	return {
		/*defaultRoutePath: '/page1',*/
		defaultRoutePath: '/home',
		routes: {
			'/main': {
				templateUrl: '/app/main/main.html'
			},
			'/authenticate': {
				templateUrl: '/app/page1/page1.html',
				dependencies: [
					'/app/page1/page1Ctrl.js'
				]
			},
			'/home': {
				templateUrl: '/app/home/home.html',
				dependencies: [
					'/app/home/homeCtrl.js'
				]
			},
			'/order': {
				templateUrl: '/app/order/order.html',
				dependencies: [
					'/app/order/orderCtrl.js'

				]
			},
			'/register': {
				templateUrl: '/app/register/register.html',
				dependencies: [
					'/app/register/registerCtrl.js',
					'/app/register/registerDirective.js'
				]
			},
			'/login': {
				templateUrl: '/app/login/login.html',
				dependencies: [
					'/app/login/loginCtrl.js'
				]
			},
			'/im': {
				templateUrl: '/app/im/im.html',
				dependencies: [
					'/app/im/imCtrl.js'
				]
			},
			'/jobs': {
				templateUrl: '/app/jobs/jobs.html',
				dependencies: [
					'/app/jobs/jobsCtrl.js'
				]
			},
			'/upload': {
				templateUrl: '/app/uploadFile/upload.html',
				dependencies: [
					'/app/uploadFile/uploadCtrl.js'
					/*,
					 '/app/uploadFile/advertise/onlinetextDirective.js'*/
				]
			},
			'/intro': {
				templateUrl: '/app/intro/intro.html',
				dependencies: [
					'/app/home/homeCtrl.js'
				]
			},'/introPanel': {
				templateUrl: '/app/introPanel/introPanel.html',
				dependencies: [
					'/app/home/homeCtrl.js'
				]
			},
			'/articleList': {
				templateUrl: '/app/articleList/articleList.html',
				dependencies: [
					'/app/articleList/articleListCtrl.js'
				]
			},
			'/video/:art_id/:sec_id/:vid_id': {
				templateUrl: '/app/video/video.html',
				dependencies: [
					'/app/video/videoCtrl.js'
				]
			},
			'/robot': {
				templateUrl: '/app/robot/robot.html',
				dependencies: [
					'/app/robot/robotCtrl.js'
				]
			},
			'/contactUs': {
				templateUrl: '/app/contactus/contactus.html',
				dependencies: [
					'/app/home/homeCtrl.js'
				]
			},
			'/question': {
				templateUrl: '/app/question/question.html',
				dependencies: [
					'/app/question/questionCtrl.js'
				]
			},
			'/news': {
				templateUrl: '/app/news/news.html',
				dependencies: [
					'/app/news/newsCtrl.js'
				]
			},
			'/payment': {
				templateUrl: '/app/payment/payment.html',
				dependencies: [
					'/app/payment/paymentCtrl.js'
				]
			}
		}
	};
});