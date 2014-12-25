
// directives/price-x-qty.js

'use strict';

BauVoiceApp.directive('priceFixed', function() {
  return {
    restrict: 'A',
    scope: {
      priceFixed: '=',
      qtyElement: '@',
      currencyElement: '@'
    },

    link: function (scope, element, attrs) {

      function getNewPrice(price, qty, currency) {
        var newPrice = parseFloat( (parseFloat(price.toFixed(2)) * qty).toFixed(2) ) + ' ' + currency;
        element.text(newPrice);
      }

      getNewPrice(scope.priceFixed, scope.qtyElement, scope.currencyElement);

      attrs.$observe('qtyElement', function () {
        getNewPrice(scope.priceFixed, scope.qtyElement, scope.currencyElement);
      });

    }
  };
});

