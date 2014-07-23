/* globals typingTextByChar, createPrice, showElementWithDelay */

'use strict';

showElementWithDelay($('.configList'), 100);

setTimeout(function () {
  $('.configItem_title').each(function () {
    typingTextByChar($(this));
  });
  $('.configItem_label').each(function () {
    typingTextByChar($(this));
  });
  $('.configItem_value').each(function () {
    var descriptlabel = $(this).next('.descript-label');
    if (descriptlabel.length > 0) {
      typingTextByChar($(this), $(descriptlabel));
    } else {
      typingTextByChar($(this));
    }
  });

  createPrice($('#price'));
  $('#currency').show();
}, 500);

showElementWithDelay($('.configItem_icon'), 1000);

//-----Menu Navigation
$('.configItem').click(function () {
  $('.configItem').each(function () {
    $(this).removeClass('configItem_active');
  });
  $(this).addClass('configItem_active');
});