/* globals typingTextByChar, showElementWithDelay, makeButtonActive */

'use strict';

var $auxChooseButton = $('.aux-choose-but');

showElementWithDelay($('.auxiliaries-container'), 400);
showElementWithDelay($('.aux-grid'), 500);
showElementWithDelay($('.aux-visor'), 600);
showElementWithDelay($('.aux-spillway'), 600);
showElementWithDelay($('.aux-outside'), 1000);
showElementWithDelay($('.aux-windowsill'), 1300);
showElementWithDelay($('.aux-louver'), 1500);
showElementWithDelay($('.aux-inside-slope'), 2000);
showElementWithDelay($('.aux-inside-slope-top'), 2000);
showElementWithDelay($('.aux-inside-slope-left'), 2100);
showElementWithDelay($('.aux-inside-slope-right'), 2200);
showElementWithDelay($('.aux-connectors'), 2400);
showElementWithDelay($('.aux-force-connect'), 2400);
showElementWithDelay($('.aux-balcon-connect'), 2500);
showElementWithDelay($('.aux-handle'), 2800);
showElementWithDelay($('.aux-fan'), 3100);
showElementWithDelay($('.aux-others'), 3100);
showElementWithDelay($auxChooseButton, 5000);
showElementWithDelay($('.aux-label'), 5000);

setTimeout(function () {
  $('.aux-label').each(function () {
    typingTextByChar($(this));
  });
}, 5000);


//------Select additional element
$auxChooseButton.click(function () {
  var title = $(this).parent().find('.aux-title'),
      params = $(this).find('.aux-params > .aux-params-label'),
      more = $(this).parent().find('.aux-more');

  //change button color
  makeButtonActive.call($(this));

  $('.aux-txt-box').each(function () {
    $(this).children().each(function () {
      var classCheck = $(this).attr('class');

      if (classCheck.indexOf('aux-choose-but') + 1 === 0 && classCheck.indexOf('aux-label') + 1 === 0) {
        $(this).hide();
      }
    });
  });

  $(this).parent().children().each(function () {
    $(this).show();
  });

  typingTextByChar(title);

  if (params.length > 0) {
    params.each(function () {
      typingTextByChar(this);
    });
  }

  if (more.length > 0) {
    typingTextByChar(more);
  }
});

$('.aux-params-but').click(function () {
  //change button color
  makeButtonActive(this);
});

//$('#start').click(function(){
//$('.aux-fan').delay(2500).queue( function(){
//$(this).toggle();
//$(this).dequeue();
//});
//});