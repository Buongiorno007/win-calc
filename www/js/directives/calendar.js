
// directives/calendar.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .directive('calendar', calendarDir);

  function calendarDir(globalConstants, CartMenuServ, OrderStor) {

    return {
      restrict: 'E',
      transclude: true,
      scope: {
        dataMonths: '@calendarOption',
        dataMonthsShort: '@calendarOptionShort'
      },
      link: function (scope, element, attrs) {
        var minDeliveryDate = new Date(),
            maxDeliveryDate = new Date();

        //------ set min delivery day
        minDeliveryDate.setDate(OrderStor.order.orderDate.getDate() + globalConstants.minDeliveryDays);
        //------ set max delivery day
        maxDeliveryDate.setDate(OrderStor.order.orderDate.getDate() + globalConstants.maxDeliveryDays);

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
            date: OrderStor.order.deliveryDate,
            min: minDeliveryDate,
            max: maxDeliveryDate,
            change: function (date) {
              CartMenuServ.checkDifferentDate(OrderStor.order.deliveryDate, date);
              scope.$apply();
            }
          };
          opt.locale.monthsShort = scope.dataMonthsShort.split(', ');
          opt.locale.months = scope.dataMonths.split(', ');
          element.pickmeup(opt);
        });
      }
    };

  }
})();

