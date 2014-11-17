/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, typingTextByChar, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('HistoryCtrl', ['$scope', 'constructService', 'localStorage', 'localDB', function ($scope, constructService, localStorage, localDB) {

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

/*

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



  function selectItem(items, currItem, currClass) {
    items.each(function() {
        $(this).removeClass(currClass);
    });
    currItem.addClass(currClass);
  }

*/






  $scope.global = localStorage;

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
    isDraftView: false,
    isStartDate: false,
    isFinishDate: false,
    isAllPeriod: true,
    startDate: '',
    finishDate: ''
  };

  //------ Download complete Orders from localDB
  localDB.selectDB($scope.global.ordersTableBD, {'orderType': $scope.global.fullOrderType}, function (results) {
    if (results.status) {
      $scope.orders = angular.copy(results.data);
      //console.log($scope.orders);
    } else {
      console.log(results);
    }
  });




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


  //------ Select calendar-scroll
  $scope.openCalendarScroll = function(dataType) {
    if(dataType === 'start-date' && !$scope.history.isStartDate) {
      $scope.history.isStartDate = true;
      $scope.history.isFinishDate = false;
      $scope.history.isAllPeriod = false;
    } else if(dataType === 'finish-date' && !$scope.history.isFinishDate){
      $scope.history.isStartDate = false;
      $scope.history.isFinishDate = true;
      $scope.history.isAllPeriod = false;
    } else if(dataType === 'full-date' && !$scope.history.isAllPeriod){
      $scope.history.isStartDate = false;
      $scope.history.isFinishDate = false;
      $scope.history.isAllPeriod = true;
      $scope.history.startDate = '';
      $scope.history.finishDate = '';
    } else {
      $scope.history.isStartDate = false;
      $scope.history.isFinishDate = false;
      $scope.history.isAllPeriod = false;
    }
  };

  // History/Draft View switcher
  $scope.viewSwitching = function() {
    $scope.history.isDraftView = !$scope.history.isDraftView;

    //------ Download draft Orders from localDB
    localDB.selectDB($scope.global.ordersTableBD, {'orderType': $scope.global.draftOrderType}, function (results) {
      if (results.status) {
        $scope.drafts = angular.copy(results.data);
        //console.log($scope.orders);
      } else {
        console.log(results);
      }
    });
  };

  //--------- Delete order
  $scope.deleteOrder = function(orderType, orderId, orderIdArr) {
    //-------- delete order in Local Objects
    if(orderType === $scope.global.fullOrderType) {
      $scope.orders.splice(orderIdArr, 1);
    } else {
      $scope.drafts.splice(orderIdArr, 1);
    }
    //------- delete order in Local DB
    localDB.deleteDB($scope.global.productsTableBD, {'orderId': orderId});
    localDB.deleteDB($scope.global.componentsTableBD, {'orderId': orderId});
    localDB.deleteDB($scope.global.visorsTableBD, {'orderId': orderId});
    localDB.deleteDB($scope.global.windowSillsTableBD, {'orderId': orderId});
    localDB.deleteDB($scope.global.ordersTableBD, {'orderId': orderId});
  };


  $scope.gotoCartPage = function() {
    $scope.global.isHistoryPage = false;
    $scope.global.showNavMenu = false;
    $scope.global.gotoCartPage();
  };

}]);
