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
        var oldDateFormat, monthsArr, newDateFormat;
        if(oldD !== '') {
          oldDateFormat = new Date(oldD);
        } else {
          oldDateFormat = new Date();
        }
        monthsArr = months.split(', ');
        newDateFormat = oldDateFormat.getDate() + ' ' + monthsArr[oldDateFormat.getMonth()] + ', ' + oldDateFormat.getFullYear();
        element.text(newDateFormat);
      }

      getDateInNewFormat(scope.orderDate, scope.dataMonths);

      attrs.$observe('orderDate', function () {
        getDateInNewFormat(scope.orderDate, scope.dataMonths);
      });

    }
  };
}]);