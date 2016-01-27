(function () {
    'use strict';
    define(['app'], function (app) {
        app.controller('newsCtrl', newsCtrl);

        newsCtrl.$inject = ['$routeParams'];

        function newsCtrl($routeParams) {
            /* js hint valid this: true*/
            var vm = this;
            vm.stateId = $routeParams;

        }
    });
}());
