(function () {
    'use strict';
    define(['app'], function (app) {
        app.controller('questionCtrl', questionCtrl);

        questionCtrl.$inject = ['$location','$rootScope'];

        function questionCtrl($location,$rootScope) {
            /* js hint valid this: true*/
            var vm = this;
            vm.location = $location.path().split('/')[2];

            $rootScope.$on('$routeChangeSuccess', function () {
                console.log('>>>>>>>>>>>', $location.path().split('/'));
                vm.location = $location.path().split('/')[2];
            });

        }
    });
}());