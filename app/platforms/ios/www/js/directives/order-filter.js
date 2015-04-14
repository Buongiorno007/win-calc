
// directives/order-filter.js

(function(){
  'use strict';

  angular
    .module('HistoryModule')
    .filter('orderSorting', orderSortingFilter);

  orderSortingFilter.$inject = [];

  function orderSortingFilter() {


    return function(items, sortType) {
      var filtered = [];

      function buildOrdersByType(items, orderStyle) {
        angular.forEach(items, function(item) {
          if(angular.equals(item.orderStyle, orderStyle)) {
            filtered.push(item);
          }
        });
      }

      if(sortType === 'type') {
        buildOrdersByType(items, 'order');
        buildOrdersByType(items, 'credit');
        buildOrdersByType(items, 'master');
        buildOrdersByType(items, 'done');
      } else if(sortType === 'first') {
        angular.forEach(items, function(item) {
          filtered.push(item);
        });
        filtered.reverse();
      } else {
        angular.forEach(items, function(item) {
          filtered.push(item);
        });
      }

      /*filtered.sort(function (a, b) {
        return (a[field] > b[field] ? 1 : -1);
      });*/

      return filtered;
    };

  }
})();

