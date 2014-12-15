'use strict';

BauVoiceApp.directive('calendarScroll', ['$filter', function($filter) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      maxTime: '@',
      calendarTime: '='
    },
    link: function (scope, element, attrs) {
      $(function(){
        var today = new Date();
        console.log('===========', today);
        var opt = {
          theme: 'ios',
          display: 'inline',
          showLabel: false,
          maxDate: today,
          //height: 80,
          height: 40,
          fixedWidth: 656,
          maxWidth: 656,
          onChange : function (valueText) {
            scope.calendarTime = valueText;
            scope.$apply();
          }
        };
        opt.monthNames = $filter('translate')('common_words.MONTHA').split(', ');
        element.mobiscroll().date(opt);

        attrs.$observe('maxTime', function () {
          if(scope.maxTime) {
            var newMaxDate = new Date(parseInt(scope.maxTime, 10));
                       console.log('date!!!!!!!====', newMaxDate);
            opt.maxDate = newMaxDate.toString();
                       console.log('opt!!!!!!!====', opt.maxDate);
            element.mobiscroll().date(opt);
          }
        });

      });
    }
  };
}]);