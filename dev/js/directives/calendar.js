'use strict';

BauVoiceApp.directive('calendar', function() {
  return {
    restrict: 'E',
    link : function (scope, element, attrs) {
      $(function(){
        element.pickmeup({
          flat	: true,
          format: 'd.m.Y',
          change: function (date) {
            scope.cartMenuData.newDeliveryDate = date;
            scope.checkDifferentDate(scope.cartMenuData.deliveryDate, date);
            scope.$apply();
          }
        });
      });
    }
  }
});
