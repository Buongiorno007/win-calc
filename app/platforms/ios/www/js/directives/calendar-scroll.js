
// directives/calendar-scroll.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('HistoryModule')
    .directive('calendarScroll', calendarScrollDir);

  function calendarScrollDir($filter) {

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
          console.log('today', typeof today);
          console.log(today);
          var opt = {
            theme: 'ios',
            display: 'inline',
            mode: 'mixed',
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
          //element.mobiscroll().date(opt);

          attrs.$observe('maxTime', function () {
            if(scope.maxTime) {
              console.log('maxTime', typeof scope.maxTime);
              console.log(scope.maxTime);

              var newMaxDate = new Date(parseInt(scope.maxTime, 10));
              console.log('newMaxDate', typeof newMaxDate);
              console.log(newMaxDate);
              //opt.maxDate = newMaxDate.toString();
              opt.maxDate = newMaxDate;
              //element.mobiscroll().date(opt);
            }
          });

        });
      }
    };

  }
})();
