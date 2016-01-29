define(['app'], function (app) {
	app.factory('mainViewFactory', mainViewFactory);
	mainViewFactory.$inject = ['$window', '$location'];

	function mainViewFactory($window, $location) {
		var factory = {
				getToken: getToken,
				getUserTelegramToken: getUserTelegramToken,
				setToken: setToken,
				getUser: getUser,
				setUser: setUser,
				isAuthenticated: isAuthenticated,
				removeToken: removeToken,
				request: request,
				response: response,
				getUserToken: getUserToken,
				getDialogs: getDialogs,
				setDialogs: setDialogs,
				getApiUrl: getApiUrl,
				//uploadfile: uploadfile,
				remoteLogin: remoteLogin,
				apiUrl: 'http://127.0.0.1/'
					/* apiUrl: 'http://melegram.com/'*/
			},
			storage = $window.localStorage,
			dialogs = [],
			cachedToken;
		return factory;

		function getApiUrl() {
			return $location.absUrl().split('/#/')[0] + '/';
		}

		function setToken(token) {
			cachedToken = token;
			storage.setItem('userToken', token);
		}

		function getToken() {
			if (!cachedToken) {
				cachedToken = storage.getItem('userToken');
			}
			return cachedToken;
		}

		function getDialogs() {
			return dialogs;
		}

		function setDialogs(dialogs) {
			dialogs = dialogs;
		}

		function isAuthenticated() {
			return !!getToken();
		}

		function setUser(user) {
			if (isAuthenticated()) {
				storage.setItem('userInfo', user);
			}
		}

		function getUser() {
			return storage.getItem('userInfo');
		}

		function getUserToken() {
			return storage.getItem('userToken');
		}

		function removeToken() {
			cachedToken = null;
			storage.removeItem('userToken');
			storage.removeItem('userInfo');
		}

		function getUserTelegramToken() {
			return storage.getItem('user_auth');
		}

		function request(config) {
			var token = getToken();
			if (token && config.url.indexOf('telegram') === -1) {
				config.headers.authorization = 'ali is just.' + token;
			} else if (config.url.indexOf('telegram') > -1) {
				//console.log('-^^^^^^^^^^^^^^', config);
				config.headers.authorization = undefined;
				return config;
			}
			return config;
		}

		function response(res) {
			return res;
		}

		function remoteLogin(provider) {

		}
	}

	app.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.interceptors.push('mainViewFactory');
	}]);
});