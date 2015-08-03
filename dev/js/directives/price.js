(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .directive('price', priceDir);

  function priceDir(globalConstants, SoundPlayServ) {

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        priceValue: '=',
        priceCurrency: '='
      },
      template:
        '<div class="price clearfix" data-output="priceValue">' +
          '<div id="price" class="price-value">' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
            '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
          '</div>' +
          '<div id="currency" class="price-currency">{{ priceCurrency }}</div>' +
        '</div>',
      link: function (scope, elem, attrs) {
        scope.$watch(attrs.output, function (price) {
          changePrice(price, elem);
        });

      }
    };


    //============ methods ================//

    function changePrice(price, elem) {
      var DELAY_PRICE_DIGIT = globalConstants.STEP * 2,
          DIGIT_CELL_HEIGHT = 64,
          priceByDigit,
          digitCells = elem.find('#price').children(),
          MAX_DIGITS = digitCells.length,
          COLUMN_LENGTH = $(digitCells[0]).children().length,
          n = 0,
          $digitCell,
          digit, scrollDigitY,
          i;

      if(price === undefined) {
        return false;
      } else {

        //playSound('price');
        SoundPlayServ.playSound();

        //priceByDigit = price.toString().split('');
        if(typeof price === 'string') {
          priceByDigit = price.split('');
        } else {
          priceByDigit = price.toFixed(2).split('');
        }

      }
      changePrice.revertDigitState = function () {
        $digitCell.animate({ top: 0 }, 'fast');
      };

      changePrice.initDigit = function () {
        digit = priceByDigit.shift();
      };

      changePrice.animateDigit = function () {
        if (digit === '.') {
          scrollDigitY = (COLUMN_LENGTH - 1) * DIGIT_CELL_HEIGHT;
        } else {
          scrollDigitY = (parseInt(digit, 10) + 1) * DIGIT_CELL_HEIGHT;
        }

        $digitCell
          .delay(n * DELAY_PRICE_DIGIT)
          .animate({ top: (-scrollDigitY/16) + "rem" }, 'fast');
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

// event.srcEvent.stopPropagation();
  }
})();