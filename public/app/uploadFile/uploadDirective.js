define(['app'], function (app) {
    app.directive('accordion', function () {
        return {
            restrict: 'A',
            link: function (scope, elm, attr, ngModelCtrl,$timeout) {
                /*because building of element that exist inside of <main>(in workflow.html) complete after end of ng-repeat
                 as a result watch scope.$parent while nextsibling will be null
                 */
                //$timeout(function () {
                $(document).ready(function(){
                    $(".mCustomScrollbar").mCustomScrollbar({
                        theme: "dark-thin",
                        scrollInertia: 0,
                        live: "once"
                    });
                });
                //}, 10);
            }
        };
    });
});
