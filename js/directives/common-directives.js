'use strict';

/* Directives */

var datOS = angular.module('common-directives', []);
datOS.directive('loading', function () {
      return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading"><div class="blockG" id="rotateG_01"></div><div class="blockG" id="rotateG_02"></div><div class="blockG" id="rotateG_03"></div><div class="blockG" id="rotateG_04"></div><div class="blockG" id="rotateG_05"></div><div class="blockG" id="rotateG_06"></div><div class="blockG" id="rotateG_07"></div><div class="blockG" id="rotateG_08"></div></div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  });

datOS.directive('checkmark', function () {
      return {
        restrict: 'E',
        replace:true,
        template: '<div class="checkmark"><div class="circle"></div><div class="stem"></div><div class="kick"></div></span></div>',
        link: function (scope, element, attr) {
              scope.$watch('checkmark', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
  });
  

datOS.directive('carouseltimeline', function () {
        return {
            restrict: 'A',
            replace: true,
            transclude: false,
            scope: {
                images: "="
            },
            template: '<img src="assets/img/timeline-stick.png">',
            link: function link(scope, element, attrs) {
                var container = $(element);
                var carousel = container.children('.jcarousel');

                carousel.jcarousel({
                    wrap: 'circular'
                });

                scope.$watch(attrs.images, function (value) {
                    carousel.jcarousel('reload');
                    console.log(value)
                });

                container.find('.jcarousel-control-prev')
                    .jcarouselControl({
                    target: '-=1'
                });

                container.find('.jcarousel-control-next')
                    .jcarouselControl({
                    target: '+=1'
                });
            }
        };
      });