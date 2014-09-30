/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, typingTextByChar, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('HistoryCtrl', ['$scope', 'globalData', 'constructService', function ($scope, globalData, constructService) {

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


  $scope.global = globalData;

  // indicator for user info block and searching block
  $scope.global.isHistoryPage = true;

  $scope.history = {
    isOrderSearch: false,
    isIntervalDate: false,
    isOrderSort: false,
    isIntervalDateDraft: false,
    isOrderSortDraft: false,
    filteredOrders: [],
    isEmptySearchResult: false,
    isDraftView: false
  };

  // Click on tools panel in History View
  $scope.orderSearching = function() {
    $scope.history.isOrderSearch = true;
  };

  $scope.intervalDateSelecting  = function() {
    if($scope.history.isDraftView) {
      $scope.history.isIntervalDateDraft = !$scope.history.isIntervalDateDraft;
    } else {
      $scope.history.isIntervalDate = !$scope.history.isIntervalDate;
    }
  };

  $scope.orderSorting  = function() {
    if($scope.history.isDraftView) {
      $scope.history.isOrderSortDraft = !$scope.history.isOrderSortDraft;
    } else {
      $scope.history.isOrderSort = !$scope.history.isOrderSort;
    }
  };


  // Search Orders
  var regex, checkedGroup, indexGroup, currGroup, groupTempObj;
/*
  constructService.getOrders(function (results) {
    if (results.status) {
      $scope.history.ordersGroup = results.data.orders;
    } else {
      console.log(results);
    }
  });
*/
  // Create regExpresion
  function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  $scope.checkChanges = function() {
    $scope.history.filteredOrders.length = 0;
    if($scope.searchingWord && $scope.searchingWord.length > 0) {
      regex = new RegExp('^' + escapeRegExp($scope.searchingWord), 'i');
      for(indexGroup = 0; indexGroup < $scope.history.ordersGroup.length; indexGroup++){
        currGroup = $scope.history.ordersGroup[indexGroup];
        checkedGroup = regex.test(currGroup);
        if(checkedGroup) {
          groupTempObj = {};
          groupTempObj.groupId = indexGroup+1;
          groupTempObj.groupName = currGroup;
          $scope.history.filteredOrders.push(groupTempObj);
        }
      }
    }
    if( $scope.history.filteredOrders.length == 0) {
      $scope.history.isEmptySearchResult = true;
    }
  };

  // Delete searching word
  $scope.cancelSearching = function() {
    $scope.searchingWord = '';
    $scope.history.showAddElementGroups = false;
    $scope.history.isOrderSearch = false;
  };
  // Delete last chart searching word
  $scope.deleteSearchChart = function() {
    $scope.searchingWord = $scope.searchingWord.slice(0,-1);
  };





  // History/Draft View switcher
  $scope.viewSwitching = function() {
    $scope.history.isDraftView = !$scope.history.isDraftView;
  };

}]);
