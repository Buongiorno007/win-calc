(function(){
  'use strict';

  angular
    .module('HistoryModule')
    .directive('orderDate', orderDateDir);

  orderDateDir.$inject = ['$filter'];

  function orderDateDir($filter) {


    return {
      restrict: 'A',
      scope: {
        orderDate: '@',
        typeDate: '='
      },

      link: function (scope, element, attrs) {

        function getDateInNewFormat(oldD, type) {
          var oldDateFormat, oldDateFormatArr, monthsArr, newDateFormat, monthId;

          monthsArr = $filter('translate')('common_words.MONTHA').split(', ');

          if(oldD !== '') {
            if(type === 'order') {
              oldDateFormat = oldD.split(' ');
              oldDateFormatArr = oldDateFormat[0].split('-');
              monthId = parseInt(oldDateFormatArr[1], 10) - 1;
              newDateFormat = oldDateFormatArr[2] + ' ' + monthsArr[monthId] + ', ' + oldDateFormatArr[0];
            } else {
              oldDateFormatArr = oldD.split('/');
              monthId = parseInt(oldDateFormatArr[0], 10) - 1;
              newDateFormat = oldDateFormatArr[1] + ' ' + monthsArr[monthId] + ', ' + oldDateFormatArr[2];
            }
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

        getDateInNewFormat(scope.orderDate, scope.typeDate);

        attrs.$observe('orderDate', function () {
          getDateInNewFormat(scope.orderDate, scope.typeDate);
        });

      }
    };


  }
})();