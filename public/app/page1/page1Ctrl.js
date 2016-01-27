(function () {
    'use strict';
    define(['app'], function (app) {
        app.controller('page1Ctrl', page1Ctrl);
        page1Ctrl.$inject = ['$http', 'mainViewFactory', '$location'];

        function page1Ctrl($http, mainFac, $location) {
            var vm = this;
            vm.member = true;
            vm.changeMember = changeMember;
            vm.login = login;
            vm.register = register;
            vm.authenticated = mainFac.isAuthenticated();
            changeRouteIfLoggedIn();
            function changeMember() {
                vm.member = false;
            }
            function changeRouteIfLoggedIn() {
                if (vm.authenticated) {
                    $location.url('/login');
                }
            }

            function register() {
                $location.url('/register');
            }

            function login(u, pass) {
                var url = mainFac.apiUrl + 'app/login';
                var data = {
                    'username': u,
                    'password': pass
                };
                $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    data: data,
                    url: url
                }).success(function (res) {
                    mainFac.setToken(res.token);
                    mainFac.setUser([
                        res.user,
                        res.regionId,
                        res.id
                    ]);
                    console.log('get user', mainFac.getUser());
                    vm.user = mainFac.getUser();
                    vm.authenticated = mainFac.isAuthenticated();
                    changeRouteIfLoggedIn();
                }).error(function (err) {
                    console.log('error is', err);
                    alert('کاربر گرامی نام کاربری یا رمز عبور اشتباه است');
                });
            }
        }
    });
}());