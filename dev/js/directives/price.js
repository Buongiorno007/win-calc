/* globals STEP */

'use strict';

BauVoiceApp.directive('price', function () {
  return {
    restrict: 'E',
    replace: true,
    template:
      '<div class="price clearfix" data-output="configMenu.price">' +
        '<div id="price" class="price-value">' +
          '<div class="digit-cell"><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div></div>' +
          '<div class="digit-cell"><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div></div>' +
          '<div class="digit-cell"><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div></div>' +
          '<div class="digit-cell"><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div></div>' +
          '<div class="digit-cell"><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div></div>' +
          '<div class="digit-cell"><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div></div>' +
          '<div class="digit-cell"><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div></div>' +
          '<div class="digit-cell"><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div></div>' +
          '<div class="digit-cell">.</div>' +
          '<div class="digit-cell"><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div></div>' +
          '<div class="digit-cell"><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div></div>' +
        '</div>' +
        '<div id="currency" class="price-currency">{{ setCurrencySymbol(configMenu.currency) }}</div>' +
      '</div>',
    link: function (scope, elem, attrs) {
      scope.$watch(attrs.output, function (price) {
        changePrice(price);
      });

      function changePrice(price) {
        var DELAY_PRICE_DIGIT = STEP * 2,
            DIGIT_CELL_HEIGHT = 64,
            MAX_DIGITS = 11,
            n = 0,
            priceByDigit = price.toString().split(''),
            digitCells = elem.find('#price').children(),
            $digitCell,
            digit, scrollDigitY,
            i;

        changePrice.revertDigitState = function () {
          $digitCell.css({
            top: 0,
            display: 'none'
          });
        };

        changePrice.initDigit = function () {
          $digitCell.show();
          digit = priceByDigit.shift();
        };

        changePrice.animateDigit = function () {
          scrollDigitY = digit * DIGIT_CELL_HEIGHT;

          $digitCell
            .delay(n * DELAY_PRICE_DIGIT)
            .animate({ top: -scrollDigitY }, 'slow');
        };

        for (i = MAX_DIGITS; i > 0; i--) {
          $digitCell = $(digitCells[n]);

          if (i > priceByDigit.length) {
            changePrice.revertDigitState();
          } else {
            changePrice.initDigit();
            changePrice.animateDigit();
          }

          n++;
        }
      }
    }
  };
});