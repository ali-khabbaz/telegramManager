(function () {
	//'use strict';
	define(['app'], function (app) {
		app.controller('registerCtrl', registerCtrl);
		registerCtrl.$inject = ['$http', 'mainViewFactory', '$rootScope', '$window'];

		function registerCtrl($http, mainFac, $rootScope, $window) {
			var vm = this;
			vm.register = register;
			vm.logOut = logOut;
			vm.anguCompleteClearSrchFld = anguCompleteClearSrchFld;
			vm.selectState = selectState;
			vm.selectCity = selectCity;
			getStates();
			vm.states = [];
			vm.cash = cash;
			vm.phonePattern = /^(9)[0-9]{9}$/;
			vm.userValue = {
				regionId: '',
				phone: '',
				pass: '',
				userName: '',
				panel_type: '1',
				amount: ''
			};
			vm.authenticated = mainFac.isAuthenticated();
			vm.user_email = '';

			function logOut() {
				mainFac.removeToken();
				vm.authenticated = mainFac.isAuthenticated();
			}

			function register(email, password) {
				var url = "http://127.0.0.1/app/register";
				var data = {
					"email": email,
					"password": password
				};
				$http.post(url, data)
					.success(function (res) {
						mainFac.setToken(res.token);
						mainFac.setUser([
							res.user,
							res.id
						]);
						vm.user = mainFac.getUser();
						console.log('>>>>>>', vm.user);
						vm.authenticated = mainFac.isAuthenticated();
					})
					.error(function (err) {
						console.log('error is', err);
					});
			}

			function anguCompleteClearSrchFld(id) {
				$rootScope.$broadcast('angucomplete-alt:clearInput', id);
			}

			function selectState(selected) {
				if (selected) {
					vm.stateId = selected.originalObject.id;

				}
			}

			function getStates() {
				var url = mainFac.getApiUrl() + 'app/getStates';
				$http({
					method: 'POST',
					url: url
				}).success(function (res) {
					vm.states = res;
				}).error(function (err) {
					console.log('error is', err);
				});
			}

			function selectCity(selected) {
				if (selected) {
					vm.userValue.regionId = selected.originalObject.regionId;
				}
			}

			function cash(panel_type) {
				if (panel_type == '1') {
					vm.userValue.amount = 1000000;
				} else if (panel_type == '2') {
					vm.userValue.amount = 1500000;
				}
				var url = mainFac.getApiUrl() + 'app/register';
				$http({
					method: 'POST',
					url: url,
					params: vm.userValue
				}).success(function (res) {
					console.log('----params------------', res);
					if (res.userName === 'exist') {
						alert('کاربر گرامی این نام کاربری تکراری است');
					}
					if (res.userName === 'notValid') {
						alert('کاربر گرامی نام کاربری معتبر نمیباشد');
					}
					if (res.userName === 'Notexist') {
						var url = mainFac.getApiUrl() + 'app/paymentCode';
						$http({
							method: 'POST',
							url: url,
							data: {
								token: res.token
							},
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							params: vm.userValue
						}).success(function (res) {
							console.log('payment------------', res);
							if (res > 0) {
								//$location.url('http://payline.ir/payment/gateway-' + res);
								$window.location.href = 'http://payline.ir/payment/gateway-' + res;
							}
						}).error(function (err) {
							console.log('error is', err);
						});


						/*$http({
						    method: 'POST',
						    url: url,
						    data: {
						        token: res.token
						    },
						    //params: vm.userValue,
						    headers: {
						        'Content-Type': 'application/json'
						    }
						}).success(function (res) {
						    console.log('payment------------', res);
						    if (res > 0) {
						        //$location.url('http://payline.ir/payment/gateway-' + res);
						        //$window.location.href = 'http://payline.ir/payment/gateway-' + res;
						    }
						}).error(function (err) {
						    console.log('payment-----err-------', err);
						});*/
					}
				}).error(function (err) {
					console.log('error is', err);
				});
			}
		}


		app.directive('wjValidationError', function () {
			return {
				require: 'ngModel',
				link: function (scope, elm, attrs, ctl) {
					scope.$watch(attrs['wjValidationError'], function (errorMsg) {
						elm[0].setCustomValidity(errorMsg);
						ctl.$setValidity('wjValidationError', errorMsg ? false : true);
					});
				}
			};
		});
	});
}());