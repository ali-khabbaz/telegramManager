(function () {
    'use strict';
    define(['app'], function (app) {
        app.controller('homeCtrl', homeCtrl);

        homeCtrl.$inject = ['$modal','$location','$routeParams'];

        function homeCtrl($modal,$location,$routeParams) {
            /* js hint valid this: true*/
            var vm = this;
            /*  vm.getNews = getNews;*/
            vm.redirectPage = redirectPage;
            vm.location = $location.path().split('/')[2];
            $(document).ready(function () {
                var slider = $(".slider_wrapper");
                var num_slides = slider.find(".slide").length;
                var slide_width = slider.find(".slide").css("width");
                var num_slide_width = parseInt(slider.find(".slide").css("width"));
                var num_slides_minus=num_slides=num_slides-1;
                $(".arrow_right").click(function () {
                    $('.arrow_left').removeAttr('disabled', "disabled");
                    event.preventDefault();
                    $(this).attr('disabled', "disabled");
                    slider.animate({
                        right: '-=' + slide_width
                    }, 1000, function () {
                        console.log((-num_slides * num_slide_width) + "px");
                        $(".arrow_right").removeAttr('disabled', "disabled");
                        if (slider.css("right") == (-num_slides_minus * num_slide_width) + "px") {
                            $(".arrow_right").attr('disabled', "disabled");
                        }
                    });

                });
                $(".arrow_left").click(function () {
                    $('.arrow_right').removeAttr('disabled', "disabled");
                    event.preventDefault();
                    slider.animate({
                        right: '+=' + slide_width
                    }, 1000, function () {
                        if (slider.css("right") == 0 + "px") {
                            $(".arrow_left").attr('disabled', "disabled");
                        }
                    });
                });
            });


            function redirectPage(stateId) {
                $location.path('/news').search({
                    stateId:stateId
                });
            }


        }
    });
}());