/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, typingTextByChar, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('CartCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {

  var $cartPage = $('.cart-page'),
      $fullView = $cartPage.find('.full-view'),
      $lightView = $cartPage.find('.light-view'),
      $orderDeleteBTN = $cartPage.find('.order-delete'),
      $viewSwitcher = $cartPage.find('.view-switch-tab'),
      $cartContainer = $cartPage.find('.cart-container');

  // History/Draft View switcher
  $viewSwitcher.click(function() {
    $cartContainer.toggleClass(activeClass);
  });

  // Delete account
  $orderDeleteBTN.click(function() {
    $(this).closest('.order').remove();
  });

}]);