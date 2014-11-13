'use strict';

BauVoiceApp.directive('orderDate', [ function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      oldDate: '@dateOld',
      dataMonths: '@monthsLabel'
    },
    template: '<span>{{ newDateFormat }}</span>',
    link: function (scope, element, attrs) {
      var oldDateFormat = new Date(scope.oldDate);
      scope.monthsArr = scope.dataMonths.split(', ');
      scope.newDateFormat = oldDateFormat.getDate() + ' ' + scope.monthsArr[oldDateFormat.getMonth()] + ', ' + oldDateFormat.getFullYear();
    }
  };
}]);

