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
        var oldDateFormat, oldDateFormatArr, monthsArr, newDateFormat, monthId;
        monthsArr = months.split(', ');

        if(oldD !== '') {
          oldDateFormat = oldD.split(' ');
          oldDateFormatArr = oldDateFormat[0].split('-');
          monthId = parseInt(oldDateFormatArr[1], 10) - 1;
          newDateFormat = oldDateFormatArr[2] + ' ' + monthsArr[monthId] + ', ' + oldDateFormatArr[0];
        } else {
          oldDateFormat = new Date();
          newDateFormat = oldDateFormat.getDate() + ' ' + monthsArr[oldDateFormat.getMonth()] + ', ' + oldDateFormat.getFullYear();
        }

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