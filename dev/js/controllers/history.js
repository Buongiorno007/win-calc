/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, typingTextByChar, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('HistoryCtrl', ['$scope', function ($scope) {

  var $historyPage = $('.history-page'),
      $searchTool = $historyPage.find('.search-tool'),
      $searchBTN = $historyPage.find('.search-btn'),
      $historySearch = $historyPage.find('.history-search'),
      $cancelSearch = $historyPage.find('.cancel-search'),

      $viewSwitcher = $historyPage.find('.view-switch-tab'),
      $accountsСontainer = $historyPage.find('.accounts-container'),

      $historyView = $historyPage.find('.history-view'),
      $userInfoContainer = $historyView.find('.user-info-container'),
      $toolDrop = $historyView.find('.tool'),
      $toolsBlock = $historyView.find('.tool-drop'),
      $sortFilterItem = $historyView.find('.filter-item'),
      $periodDateFilter = $historyView.find('.period'),
      $dateItemDateFilter = $historyView.find('.date-item'),

      $draftView = $historyPage.find('.draft-view'),
      $toolDropDraft = $draftView.find('.tool'),
      $toolsBlockDraft = $draftView.find('.tool-drop'),
      $sortFilterItemDraft = $draftView.find('.filter-item'),
      $periodDateFilterDraft = $draftView.find('.period'),
      $dateItemDateFilterDraft = $draftView.find('.date-item'),

      backFonClass = 'dark-fon',
      $accountDeleteBTN = $historyPage.find('.account-delete-btn'),

      DELAY_SHOW_LOC = 10 * STEP;



  // Click on tools panel in History View
  $toolDrop.click(function() {
    var currToolBlock = $(this).closest('.tool-drop');
    if(currToolBlock.hasClass(activeClass)) {
      currToolBlock.removeClass(activeClass);
      $historyView.removeClass(backFonClass);
    } else {
      $toolsBlock.removeClass(activeClass);
      currToolBlock.addClass(activeClass);
      $historyView.addClass(backFonClass);
    }
  });
  // Click on tools panel in Draft View
  $toolDropDraft.click(function() {
    var currToolBlock = $(this).closest('.tool-drop');
    if(currToolBlock.hasClass(activeClass)) {
      currToolBlock.removeClass(activeClass);
      $draftView.removeClass(backFonClass);
    } else {
      $toolsBlockDraft.removeClass(activeClass);
      currToolBlock.addClass(activeClass);
      $draftView.addClass(backFonClass);
    }
  });

  // Searching
  $searchBTN.click(function() {
    $userInfoContainer.addClass(unvisibleClass);
    $historySearch.removeClass(unvisibleClass);
    $cancelSearch.removeClass(unvisibleClass);
    $searchTool.addClass(activeClass);
    $historyView.removeClass(backFonClass);
  });
  $cancelSearch.click(function() {
    $historySearch.addClass(unvisibleClass);
    $userInfoContainer.removeClass(unvisibleClass);
    $searchTool.removeClass(activeClass);
  });

  // Select Date Filter period in History View
  $periodDateFilter.click(function() {
    selectItem($periodDateFilter, $(this), selectClass);
  });
  // Select Date Filter item in History View
  $dateItemDateFilter.click(function() {
    selectItem($dateItemDateFilter, $(this), selectClass);
  });

  // Select Date Filter period in Draft View
  $periodDateFilterDraft.click(function() {
    selectItem($periodDateFilterDraft, $(this), selectClass);
  });
  // Select Date Filter item in Draft View
  $dateItemDateFilterDraft.click(function() {
    selectItem($dateItemDateFilterDraft, $(this), selectClass);
  });


  // Select Sort Filter item in History View
  $sortFilterItem.click(function() {
    selectItem($sortFilterItem, $(this), selectClass);
  });
  // Select Sort Filter item in Draft View
  $sortFilterItemDraft.click(function() {
    selectItem($sortFilterItemDraft, $(this), selectClass);
  });

  // History/Draft View switcher
  $viewSwitcher.click(function() {
    $accountsСontainer.toggleClass(activeClass);
  });

  // Delete account
  $accountDeleteBTN.click(function() {
    $(this).closest('.account-block').remove();
  });

  function selectItem(items, currItem, currClass) {
    items.each(function() {
        $(this).removeClass(currClass);
    });
    currItem.addClass(currClass);
  }
}]);
