(function () {
	'use strict';
	define(['app'], function (app) {
		app.controller('MainViewCtrl', MainViewCtrl);

		MainViewCtrl.$inject = ['mainViewFactory', '$location', 'MtpApiManager', '$scope'];

		function MainViewCtrl(mainFac, $location, MtpApiManager, $scope) {
			/* js hint valid this: true*/
			var vm = this;

			vm.list = 'mainviewcontroller loaded';
			vm.showDivider = false;
			vm.inUploadPage = false;
			vm.inImPage = false;
			$scope.$on('$routeChangeStart', function (next, current) {
				if ($location.path().indexOf('page1') > -1 || $location.path().indexOf('login') > -1) {
					vm.showDivider = false;
				} else {
					vm.showDivider = true;
				}
				if ($location.path().indexOf('upload') > -1) {
					vm.inUploadPage = true;
					vm.inImPage = false;
				} else if ($location.path().indexOf('im') > -1) {
					vm.inImPage = true;
					vm.inUploadPage = false;
				}
			});
			//getTelUserId();
			vm.logOut = logOut;

			function logOut() {
				mainFac.removeToken();
				vm.authenticated = mainFac.isAuthenticated();
				$location.url('/page1');
			}

			function getTelUserId() {
				MtpApiManager.getUserID().then(function (id) {
					console.log('----------', id);
					if (id) {
						$location.url('/im');
						return;
					} else {
						$location.url('/login');
					}
				});
			}

		}
	});
}());