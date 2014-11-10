'use strict';

BauVoiceApp.directive('calendar', [ function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      dataMonths: '@calendarOption',
      dataMonthsShort: '@calendarOptionShort'
    },
    link: function (scope, element, attrs) {
      $(function(){
        var opt = {
          flat: true,
          format: 'd.m.Y',
          locale			: {
            days: [],
            daysShort: [],
            daysMin: [],
            monthsShort: [],
            months: []
          },
          date: scope.$parent.cartMenuData.deliveryDate,
          min: scope.$parent.cartMenuData.minDeliveryDate,
          max: scope.$parent.cartMenuData.maxDeliveryDate,
          change: function (date) {
            scope.$parent.checkDifferentDate(scope.$parent.cartMenuData.deliveryDate, date);
            scope.$apply();
          }
        };
        opt.locale.monthsShort = scope.dataMonthsShort.split(', ');
        opt.locale.months = scope.dataMonths.split(', ');
        element.pickmeup(opt);
      });
    }
  };
}]);
