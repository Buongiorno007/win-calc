/* exported typingTextByChar, createPrice, showElementWithDelay, makeButtonActive */

'use strict';

function typingTextByChar(obj, obj2) {
  //-------Typing Text
  var source = $(obj).attr('name'),
      newText = '',
      hasChar = newText.length < source.length,
      delay = 100,
      timerId;

  if (hasChar) {
    timerId = setInterval(function () {
      newText = buildTypingText.call(this, newText, source);
      $(obj).text(newText);

      if (newText.length === source.length) {
        clearInterval(timerId);
        if (obj2) {
          typingTextByChar(obj2);
        }
      }
    }, delay);
  }
}

function buildTypingText(curentTxt, sourceTxt) {
  if (curentTxt.length === 0) {
    curentTxt = sourceTxt[0];
    //console.log(sourceTxt +'  =  '+ curentTxt);
    return curentTxt;
  }
  if (curentTxt.length < sourceTxt.length) {
    curentTxt += sourceTxt[curentTxt.length];
    //console.log(sourceTxt +'  -  '+ curentTxt);
    return curentTxt;
  }
}

//---------Typing Price
function createPrice(obj) {
  var digitObjs = [],
      source = $(obj).attr('name'),
      sourceArr = source.split(''),
      keySource, keyDigit, digitCell, scrollDigitY,
      n;

  console.log(source);

  for (keySource in sourceArr) {
    if (sourceArr[keySource] === '.') {
      digitCell = $('<div class="digitCell pricePoint">.</div>');
    } else {
      digitCell = $('<div class="digitCell"></div>');

      for (n = 9; n >= 0; n--) {
        digitCell.append($('<div class="digit">' + n + '</div>'));
      }
    }
    $(obj).append(digitCell);
    digitCell.scrollTop(700);
    digitObjs.push(digitCell);
  }

  for (keyDigit in digitObjs) {
    if (sourceArr[keyDigit] === '.') {
      continue;
    }
    scrollDigitY = digitObjs[keyDigit].children().eq(sourceArr[keyDigit]).position().top;
    digitObjs[keyDigit].delay(keyDigit * 200).animate({scrollTop: Math.abs(scrollDigitY)}, 'slow');
  }
}

//-------Showing Element
function showElementWithDelay(obj, delay) {
  setTimeout(function () {
    $(obj).show();
  }, delay);
}

//-------Small Button make active
function makeButtonActive() {
  var butClass = this.attr('class'),
      butClassGeneral = butClass.split(' '),
      butColor = this.css('border-color');

  $('.' + butClassGeneral[0]).each(function () {
    $(this).css('background-color', 'transparent').css('color', $(this).css('border-color'));
  });

  this.css('background-color', butColor).css('color', '#fff');
}