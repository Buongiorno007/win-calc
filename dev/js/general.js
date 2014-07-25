/* exported STEP, typingTextByChar, createPrice, showElementWithDelay, makeButtonActive */

'use strict';

var STEP = 100;

function typingTextByChar($textElem1, $textElem2) {
  var source = $textElem1.attr('name'),
      newText = '',
      delay = 100,
      timerId;

  if (source.length) {
    timerId = setInterval(function () {
      var hasChar = newText.length < source.length;

      newText = this.buildTypingText(newText, source);
      $textElem1.text(newText);

      if (!hasChar) {
        clearInterval(timerId);

        if ($textElem2) {
          typingTextByChar($textElem2);
        }
      }
    }, delay);
  }

  this.buildTypingText = function (currentTxt, sourceTxt) {
    if (currentTxt.length < sourceTxt.length) {
      currentTxt += sourceTxt[currentTxt.length];
      return currentTxt;
    }
  };
}

// TODO: Переделать в виде плагина, с возможностью передачи в scroll() цены в качестве аргумента
function createPrice($price) {
  var DELAY_PRICE_DIGIT = STEP * 2,
      DIGIT_CELL_HEIGHT = 64,
      price = $price.attr('name'),
      priceNumberByDigit = price.split(''),
      digit, digitCell, scrollDigitY,
      i, n;

  this.init = function () {
    for (i = 0; i < priceNumberByDigit.length; i++) {
      digit = priceNumberByDigit[i];

      if (digit === '.') {
        digitCell = $('<div class="digit-cell" data-digit="' + digit + '">.</div>');
      } else {
        digitCell = $('<div class="digit-cell" data-digit="' + digit + '"></div>');

        for (n = 0; n < 10; n++) {
          digitCell.append($('<div class="digit">' + n + '</div>'));
        }
      }
      $price.append(digitCell);
    }
  };

  this.scroll = function () {
    var digitCells = $price.children(),
        $digitCell;

    for (i = 0; i < digitCells.length; i++) {
      $digitCell = $(digitCells[i]);
      digit = $digitCell.data('digit');

      if (digit === '.') {
        continue;
      }

      scrollDigitY = digit * DIGIT_CELL_HEIGHT;

      $digitCell
        .delay(i * DELAY_PRICE_DIGIT)
        .animate({ top: -scrollDigitY }, 'slow');
    }
  };

  this.init();
  this.scroll();
}

function showElementWithDelay(obj, delay) {
  setTimeout(function () {
    $(obj).show();
  }, delay);
}

// TODO: Передалать функцию на изменение классов, а не css-свойств
function makeButtonActive() {
  var butClass = this.attr('class'),
      butClassGeneral = butClass.split(' '),
      butColor = this.css('border-color');

  $('.' + butClassGeneral[0]).each(function () {
    $(this).css('background-color', 'transparent').css('color', $(this).css('border-color'));
  });

  this.css('background-color', butColor).css('color', '#fff');
}