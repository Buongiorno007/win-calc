/* STEP */
'use strict';

BauVoiceApp.directive('productprice', function () {
  return {
    restrict: 'E',
    replace: true,
    template:
      '<div class="price clearfix" data-output="global.productPrice">' +
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
        '<div id="currency" class="price-currency">{{ currency }}</div>' +
        //'<div id="currency" class="price-currency">{{ setCurrencySymbol(configMenu.currency) }}</div>' +
      '</div>',
    link: function (scope, elem, attrs) {
      scope.$watch(attrs.output, function (price) {
        changePrice(price, elem);
      });

    }
  };
});

BauVoiceApp.directive('orderprice', function () {
  return {
    restrict: 'E',
    replace: true,
    template:
      '<div class="price clearfix" data-output="global.orderPrice">' +
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
      '<div id="currency" class="price-currency">{{ currency }}</div>' +
      '</div>',
    link: function (scope, elem, attrs) {
      scope.$watch(attrs.output, function (price) {
        changePrice(price, elem);
      });

    }
  };
});


function changePrice(price, elem) {
  var DELAY_PRICE_DIGIT = STEP * 2,
      DIGIT_CELL_HEIGHT = 64,
      priceByDigit = price.toString().split(''),
      digitCells = elem.find('#price').children(),
      MAX_DIGITS = digitCells.length,
      COLUMN_LENGTH = $(digitCells[0]).children().length,
      n = 0,
      $digitCell,
      digit, scrollDigitY,
      i;

  changePrice.revertDigitState = function () {
    $digitCell.animate({ top: 0 }, 'slow');
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