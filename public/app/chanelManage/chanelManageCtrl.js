(function () {
    'use strict';
    define(['app'], function (app) {
        app.controller('chanelManageCtrl', chanelManageCtrl);

        chanelManageCtrl.$inject = ['$location','$rootScope'];

        function chanelManageCtrl($location,$rootScope) {
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