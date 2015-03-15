if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
  module.exports = 'ngBlowAnimate';
}
(function(){
angular.module('ngBlowAnimate', []).directive('animateRestorePoint', function() {
  return function(scope, element, attrs) {
    angular.element(element).css('color','blue');
    if (scope.$last){
      $('.dock ul li a img').resizeOnApproach({'elementDefault':15,'elementClosest':30,'triggerDistance':90});
      $('.dock ul li a img').last().trigger('mouseenter');
      $('.dock ul').css('margin-left',scope.shiftOffset+'px');
      $('ul#restorePointsPanel li').removeClass('ng-hide');
      $('ul#restorePointsPanel li').css('visibility','hidden');
      $('ul#restorePointsPanel li').each(function($index,$element){
      	if($index >= scope.restorePoints.length -21){
      		$(this).css('visibility','visible');
      	}
      });
      console.log('shiftOffset'+scope.shiftOffset);
    }
  };
}).directive('myMainDirective', function() {
  return function(scope, element, attrs) {
    angular.element(element).css('border','5px solid red');
  };
});
})();