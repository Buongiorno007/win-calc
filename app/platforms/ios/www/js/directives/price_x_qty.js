(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .directive('priceFixed', priceFixedDir);

  function priceFixedDir() {

    return {
      restrict: 'A',
      scope: {
        priceFixed: '@',
        qtyElement: '@',
        currencyElement: '@'
      },

      link: function (scope, element, attrs) {

        function getNewPrice(priceAtr, qty, currency) {
          var price = priceAtr;
          if(typeof price === 'string') {
            price = parseFloat(price);
          }
          var newPrice = parseFloat( (parseFloat(price.toFixed(2)) * qty).toFixed(2) ) + ' ' + currency;
          element.text(newPrice);
        }

        getNewPrice(scope.priceFixed, scope.qtyElement, scope.currencyElement);

        attrs.$observe('qtyElement', function () {
          getNewPrice(scope.priceFixed, scope.qtyElement, scope.currencyElement);
        });
        attrs.$observe('priceFixed', function () {
          getNewPrice(scope.priceFixed, scope.qtyElement, scope.currencyElement);
        });

      }
    };


  }
})();
