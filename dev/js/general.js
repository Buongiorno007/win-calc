/* exported STEP, typingIndex, unvisibleClass, selectClass, activeClass, focuseClass, typingTextByChar, showElementWithDelay, typingTextWithDelay, addClassWithDelay, removeClassWithDelay */

'use strict';

var STEP = 100,
    typingIndex = true,

    selectClass = 'selected',
    focuseClass = 'focused',
    activeClass = 'active',
    unvisibleClass = 'unvisible';


function typingTextByChar($textElem1, $textElem2) {
  var source = $textElem1.data('output'),
      newText = '',
      delay = 100,
      timerId;

  if (source !== undefined && source.length) {
    timerId = setInterval(function () {
      var hasChar = newText.length < source.length;

      //newText = this.buildTypingText(newText, source);
      newText = buildTypingText(newText, source);
      $textElem1.text(newText);

      if (!hasChar) {
        clearInterval(timerId);

        if ($textElem2) {
          typingTextByChar($textElem2);
        }
      }
    }, delay);
  }

  //this.buildTypingText = function (currentTxt, sourceTxt) {
  function buildTypingText (currentTxt, sourceTxt) {
    if (typingIndex && currentTxt.length < sourceTxt.length) {
      currentTxt += sourceTxt[currentTxt.length];
      return currentTxt;
    }
  }
}

function showElementWithDelay($element, delay) {
  setTimeout(function () {
    $element.removeClass(unvisibleClass);
  }, delay);
}

function typingTextWithDelay(element, delay) {
  setTimeout(function () {
    element.each(function () {
      typingTextByChar($(this));
    });
  }, delay);
}

function addClassWithDelay(element, className, delay) {
  setTimeout(function () {
    $(element).addClass(className);
  }, delay);
}

function removeClassWithDelay(element, className, delay) {
  setTimeout(function () {
    $(element).removeClass(className);
  }, delay);
}