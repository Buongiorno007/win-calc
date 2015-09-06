
// directives/order_filter.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('HistoryModule')
    .filter('orderSorting', orderSortingFilter);

  function orderSortingFilter() {

    return function(items, sortType) {
      var filtered = [];

      function buildOrdersByType(items, orderStyle) {
        angular.forEach(items, function(item) {
          if(angular.equals(item.order_style, orderStyle)) {
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

