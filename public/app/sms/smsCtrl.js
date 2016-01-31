(function () {
	//'use strict';
	define(['app'], function (app) {
		app.controller('smsCtrl', smsCtrl);

		smsCtrl.$inject = ['$http', 'mainViewFactory'];

		function smsCtrl($http, mainFac) {
			var vm = this;
			vm.number = '';
			vm.fname = '';
			vm.lname = '';

			var url = mainFac.api_url + "app/sms";

			vm.send = function () {
				$http({
					url: url,
					method: 'POST',
					params: {
						fname: vm.fname,
						lname: vm.lname,
						number: vm.number
					}
				});
			};

		}

	});
}());