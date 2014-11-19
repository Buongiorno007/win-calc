'use strict';

BauVoiceApp.directive('calendarScroll', [ function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      dataMonths: '@calendarOption',
      maxTime: '@',
      calendarTime: '='
    },
    link: function (scope, element, attrs) {
      $(function(){
        var today = new Date();
        var opt = {
          theme: 'ios7',
          display: 'inline',
          showLabel: false,
          maxDate: today,
          height: 80,
          fixedWidth: 656,
          maxWidth: 656,
          onChange : function (valueText) {
            scope.calendarTime = valueText;
            scope.$apply();
          }
        };
        opt.monthNames = scope.dataMonths.split(', ');
        element.mobiscroll().date(opt);

        attrs.$observe('maxTime', function () {
          if(scope.maxTime) {
            today.setTime(scope.maxTime);
            opt.maxDate = today;
            element.mobiscroll().date(opt);
          }
        });

      });
    }
  };
}]);