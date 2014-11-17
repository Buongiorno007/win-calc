'use strict';

BauVoiceApp.directive('calendarScroll', [ function() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      dataMonths: '@calendarOption',
      calendarTime: '='
    },
    link: function (scope, element, attrs) {
      $(function(){
        var opt = {
          theme: 'ios7',
          display: 'inline',
          showLabel: false,
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

      });
    }
  };
}]);