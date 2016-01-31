define(['app'], function (app) {
	app.factory('authInterceptor', authInterceptor);
	authInterceptor.$inject = ['$window'];

	function authInterceptor($window) {
		var storage = $window.localStorage;
		var factory = {
			request: request,
			response: response
		};
		return factory;

		function request(config) {
			var token = storage.getItem('userToken');
			if (token && config.url.indexOf('telegram') === -1) {
				config.headers.authorization = 'ali is just.' + token;
			} else if (config.url.indexOf('telegram') > -1) {
				//delete config.headers.authorization;
				config.headers.authorization = undefined;
				return config;
			}
			return config;
		}

		function response(res) {
			return res;
		}
	}
	app.config(function ($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	});
});