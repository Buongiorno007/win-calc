'use strict';

BauVoiceApp.directive('orderDate', [ function() {
  return {
    restrict: 'A',
    scope: {
      orderDate: '@',
      dataMonths: '@monthsLabel'
    },
    link: function (scope, element, attrs) {

      function getDateInNewFormat(oldD, months) {
        if(oldD !== '') {
          var oldDateFormat = new Date(oldD),
              monthsArr = months.split(', '),
              newDateFormat = oldDateFormat.getDate() + ' ' + monthsArr[oldDateFormat.getMonth()] + ', ' + oldDateFormat.getFullYear();
          element.text(newDateFormat);
        } else {
          element.text('');
        }
      }

      getDateInNewFormat(scope.orderDate, scope.dataMonths);

      attrs.$observe('orderDate', function () {
        getDateInNewFormat(scope.orderDate, scope.dataMonths);
      });

    }
  };
}]);