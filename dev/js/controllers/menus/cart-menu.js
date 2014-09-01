/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, typingTextByChar, showElementWithDelay, removeClassWithDelay, addClassWithDelay */

'use strict';

BauVoiceApp.controller('CartMenuCtrl', ['$scope', function ($scope) {
  var $cartMenu = $('.cart-menu'),
      $itemMenu = $cartMenu.find('.item'),
      $dropdownMenu = $cartMenu.find('.dropdown-cart-menu'),
      $dropDeliveryMenu = $cartMenu.find('.drop-delivery'),
      $dropAssemblingMenu = $cartMenu.find('.drop-assembling'),
      $dropInstalmentMenu = $cartMenu.find('.drop-instalment'),
      $dropDeliveryItem = $dropDeliveryMenu.find('.dropdown-item'),
      $dropAssemblingItem = $dropAssemblingMenu.find('.dropdown-item'),
      $dropInstalmentItem = $dropInstalmentMenu.find('.dropdown-item'),
      $checkSwitcher = $cartMenu.find('.check-switcher'),
      $priceBlock = $cartMenu.find('.price-block'),
      $oldPriceTab = $('.old-price-tab'),
      $calendar = $cartMenu.find('.calendar-box');

  // Calendar
  $calendar.pickmeup({
    flat	: true
  });

  //Select menu item
  $itemMenu.click(function() {

    if (!$(this).hasClass(activeClass)) {

      $itemMenu.each(function () {
        $(this).removeClass(activeClass);
      });
      $(this).addClass(activeClass);

      $dropdownMenu.each(function () {
        $(this).removeClass(activeClass);
      });
      $(this).next('.dropdown-cart-menu').addClass(activeClass);

    } else {
      $(this).removeClass(activeClass);
      $(this).next('.dropdown-cart-menu').removeClass(activeClass);
    }

  });

  // Select dropdown menu item

  $dropDeliveryItem.click(function() {
    deselectMenuItem($dropDeliveryItem, selectClass);
    $(this).addClass(selectClass);
  });
  $dropAssemblingItem.click(function() {
    deselectMenuItem($dropAssemblingItem, selectClass);
    $(this).addClass(selectClass);
  });
  $dropInstalmentItem.click(function() {
    deselectMenuItem($dropInstalmentItem, selectClass);
    $(this).addClass(selectClass);
    // Turn on Instalment
    if(!$checkSwitcher.hasClass(activeClass)) {
      $checkSwitcher.addClass(activeClass);

      $priceBlock.toggleClass(activeClass);
      $oldPriceTab.toggleClass(activeClass);
    }
  });

  // Turn off Instalment
  $('.check-switcher, .check-handle').click(function() {
    if($checkSwitcher.hasClass(activeClass)) {
      $dropdownMenu.each(function () {
        $(this).removeClass(activeClass);
      });
      $checkSwitcher.removeClass(activeClass);
      deselectMenuItem($dropInstalmentItem, selectClass);

      $priceBlock.toggleClass(activeClass);
      $oldPriceTab.toggleClass(activeClass);
    }
  });



  function deselectMenuItem(item, className) {
    item.each(function() {
      $(this).removeClass(className);
    });
  }

}]);