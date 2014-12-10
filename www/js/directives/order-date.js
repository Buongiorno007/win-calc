
// directives/order-date.js

'use strict';

BauVoiceApp.directive('orderDate', [ function() {
  return {
    restrict: 'A',
    scope: {
      orderDate: '@',
      dataMonths: '@monthsLabel',
      typeDate: '='
    },
    link: function (scope, element, attrs) {

      function getDateInNewFormat(oldD, months, type) {
        var oldDateFormat, monthsArr, newDateFormat;
        if(oldD !== '') {
          oldDateFormat = new Date(oldD);
        } else {
          oldDateFormat = new Date();
        }
        monthsArr = months.split(', ');
        newDateFormat = oldDateFormat.getDate() + ' ' + monthsArr[oldDateFormat.getMonth()] + ', ' + oldDateFormat.getFullYear();
        if(!type && oldD === '') {
          element.text('');
        } else {
          element.text(newDateFormat);
        }
      }

      getDateInNewFormat(scope.orderDate, scope.dataMonths, scope.typeDate);

      attrs.$observe('orderDate', function () {
        getDateInNewFormat(scope.orderDate, scope.dataMonths, scope.typeDate);
      });

    }
  };
}]);
