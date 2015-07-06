(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .directive('calendar', calendarDir);

  function calendarDir($filter, globalConstants, CartMenuServ, OrderStor) {

    return {
      restrict: 'E',
      transclude: true,
      link: function (scope, element, attrs) {

        var orderDay = new Date(OrderStor.order.orderDate).getDate(),
        minDeliveryDate = new Date().setDate( (orderDay + globalConstants.minDeliveryDays) ),
        maxDeliveryDate = new Date().setDate( (orderDay + globalConstants.maxDeliveryDays)),
        deliveryDate = $filter('date')(OrderStor.order.newDeliveryDate, 'dd.MM.yyyy'),
        oldDeliveryDate = $filter('date')(OrderStor.order.deliveryDate, 'dd.MM.yyyy');

        $(function(){
          var opt = {
            flat: true,
            format: 'd.m.Y',
            locale: {
              days: [],
              daysShort: [],
              daysMin: [],
              monthsShort: [],
              months: []
            },
            date: deliveryDate,
            min: minDeliveryDate,
            max: maxDeliveryDate,
            change: function (date) {
              CartMenuServ.checkDifferentDate(oldDeliveryDate, date);
              scope.$apply();
            }
          };
          opt.locale.monthsShort = $filter('translate')('common_words.MONTHS_SHOT').split(', ');
          opt.locale.months = $filter('translate')('common_words.MONTHS').split(', ');
          element.pickmeup(opt);
        });
      }
    };

  }
})();
