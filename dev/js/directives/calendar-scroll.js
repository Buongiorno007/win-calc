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
        console.log('scroll');
        console.log(today);
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
            console.log(valueText);
            scope.calendarTime = valueText;
            //console.log('scope.calendarTime = ' + scope.calendarTime);
            scope.$apply();
          }
        };
        opt.monthNames = scope.dataMonths.split(', ');
        element.mobiscroll().date(opt);

        attrs.$observe('maxTime', function () {
          if(scope.maxTime) {
            console.log('maxTime'+scope.maxTime);
            console.log(new Date(scope.maxTime));
            //today.setTime(scope.maxTime);
            //opt.maxDate = today;
            //element.mobiscroll().date(opt);
          }
        });

      });
    }
  };
}]);