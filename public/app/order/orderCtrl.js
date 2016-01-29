(function () {
	'use strict';
	define(['app'], function (app) {
		app.controller('orderCtrl', orderCtrl);

		orderCtrl.$inject = ['$http', 'mainViewFactory'];

		function orderCtrl($http, mainFac) {
			/* js hint valid this: true*/
			var vm = this;

			vm.person = {
				name: '',
				lastname: '',
				email: '',
				phone: ''
			};
			vm.cash = cash;

			function cash(frm, person) {
				console.log('LLL', frm, person);
				if (frm.$invalid) {
					alert('لطفا اطلاعات را درست وارد کنید');
				} else {
					$http({
						method: 'POST',
						url: mainFac.getApiUrl() + 'app/order',
						params: person
					}).success(function (res) {
						if (res.status == 'ok') {
							alert('اطلاعات شما با موفقیت ثبت شد در حال انتقال به درگاه بانکی میباشید');
						}
					}).error(function (err) {
						console.log('error is', err);
					});

				}
			}


		}
	});
}());