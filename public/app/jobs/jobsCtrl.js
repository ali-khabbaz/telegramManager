(function () {
	'use strict';
	define(['app'], function (app) {
		app.controller('jobsCtrl', jobsCtrl);
		jobsCtrl.$inject = ['$http', 'mainViewFactory'];

		function jobsCtrl($http, mainFac) {
			var vm = this;
			vm.jobs_data = 'erfrf';

			/*var socket = io.connect('http://127.0.0.1');

			socket.on('message', function (data) {
				if(data.message) {
					console.log("dataaaaaaaaaaaaaaaaaaaa", data);
					socket.emit('send', { message: 'shotorrrrrrr---------' });
				} else {
					console.log("There is a problem:", data);
				}
			});*/


			getJobs();

			function getJobs() {
				var url = mainFac.getApiUrl() + 'app/jobs';
				$http.post(url).success(function (res) {
					vm.jobs_data = res;
				}).error(function (err) {
					console.log('error is', err);
					vm.jobs_data = err;
				});
			}
		}
	});
}());