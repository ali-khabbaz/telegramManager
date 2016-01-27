define(['app'], function (app) {
    app.directive('accordion', function () {
        return {
            restrict: 'A',
            link: function (scope, elm, attr, ngModelCtrl) {
                /*because building of element that exist inside of <main>(in workflow.html) complete after end of ng-repeat
                 as a result watch scope.$parent while nextsibling will be null
                 */
                scope.$watch('scope.$parent.$$nextSibling', function () {
                    if (!scope.$parent.$$nextSibling)
                        $("." + scope.$parent.routeId).slideDown();
                });
                $(document).click(function (event) {
                    if (event.target.nodeName == "H3") {
                        var target = $(event.target).parent();
                        $(".accordion_header").parent().removeClass("open");
                        $(".accordion_header").parent().children(".accordion_main").slideUp();
                        if (target.children(".accordion_main").css("display") == "block") {
                            target.removeClass("open");
                            target.children("div.accordion_main").slideUp();
                        }
                        else {
                            target.addClass("open");
                            target.children("div.accordion_main").slideDown();
                        }
                    }
                })
            }
        };
    });
});
