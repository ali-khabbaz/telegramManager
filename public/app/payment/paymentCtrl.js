(function () {
	'use strict';
	define(['app'], function (app) {
		app.controller('paymentCtrl', paymentCtrl);

		paymentCtrl.$inject = ['$routeParams', '$http', 'mainViewFactory', '$location', '$window'];

		function paymentCtrl($routeParams, $http, mvf, $location, $window) {
			/* js hint valid this: true*/
			var vm = this;
			vm.stateId = $routeParams;
			vm.pay = pay;


			function pay() {
				var url = mvf.apiUrl + 'app/paymentCode';
				$http.post(url).success(function (res) {
					console.log('payment------------', res);
					if (res > 0) {
						//$location.url('http://payline.ir/payment/gateway-' + res);
						$window.location.href = 'http://payline.ir/payment/gateway-' + res;
					}
				}).error(function (err) {
					console.log('payment-----err-------', err);
				});
			}

		}
	});
}());