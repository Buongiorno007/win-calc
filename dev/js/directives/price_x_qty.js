(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .directive('priceFixed',

  function() {

    return {
      restrict: 'A',
      scope: {
        priceFixed: '@',
        qtyElement: '@',
        currencyElement: '@'
      },

      link: function (scope, element, attrs) {

        function getNewPrice(priceAtr, qty, currency) {
          var newPrice = parseFloat( ((Math.round(parseFloat(priceAtr) * 100)/100) * qty).toFixed(2) ) + ' ' + currency;
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

  });
})();
