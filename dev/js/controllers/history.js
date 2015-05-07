(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('HistoryModule')
    .controller('HistoryCtrl', historyCtrl);

  function historyCtrl($scope, $location, $filter, $cordovaDialogs, globalConstants, globalDB, localDB, GlobalStor, UserStor, HistoryStor, HistoryServ) {


    var thisCtrl = this;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.history = HistoryStor.history;
    thisCtrl.userInfo = UserStor.userInfo;


    //------- set current Page
    GlobalStor.global.currOpenPage = 'history';

    HistoryServ.downloadOrders();


    //------ clicking
    thisCtrl.sendOrderToFactory = HistoryServ.sendOrderToFactory;
    thisCtrl.makeOrderCopy = HistoryServ.makeOrderCopy;
    thisCtrl.clickDeleteOrder = HistoryServ.clickDeleteOrder;
    thisCtrl.editOrder = HistoryServ.editOrder;
    thisCtrl.viewSwitching = HistoryServ.viewSwitching;

    thisCtrl.orderSearching = HistoryServ.orderSearching;


    //============ methods ================//



    $scope.config = {
      isIntervalDate: false,
      isOrderSort: false,
      isStartDate: false,
      isSortType: 'last',
      isFinishDate: false,
      isAllPeriod: true,
      startDate: '',
      finishDate: '',
      isCurrentOrdersHide: false,
      isWaitOrdersHide: false,
      isDoneOrdersHide: false,
      isEmptySortResult: false,
      //------- Draft
      isDraftView: false,
      isIntervalDateDraft: false,
      isOrderSortDraft: false,
      isStartDateDraft: false,
      isFinishDateDraft: false,
      isAllPeriodDraft: true,
      startDateDraft: '',
      finishDateDraft: '',
      isEmptySortResultDraft: false,
      isOrderExisted: false
    };


    //----- variables for orders sorting
    $scope.createdDate = 'created';
    $scope.reverse = true;
    $scope.reverseDraft = true;












    //=========== Filtering by Date
    //------- show Date filter tool dialog
    $scope.intervalDateSelecting  = function() {
      var filterResult;
      if($scope.history.isDraftView) {
        if($scope.history.isIntervalDateDraft) {
          //-------- filtering orders by selected date
          filterResult = $scope.filteringByDate($scope.draftsSource, $scope.history.startDateDraft, $scope.history.finishDateDraft);
          if(filterResult) {
            $scope.drafts = filterResult;
          }
        }
        $scope.history.isIntervalDateDraft = !$scope.history.isIntervalDateDraft;
        $scope.history.isOrderSortDraft = false;
      } else {
        if($scope.history.isIntervalDate) {
          //-------- filtering orders by selected date
          filterResult = $scope.filteringByDate($scope.ordersSource, $scope.history.startDate, $scope.history.finishDate);
          if(filterResult) {
            $scope.orders = filterResult;
          }
        }
        $scope.history.isIntervalDate = !$scope.history.isIntervalDate;
        $scope.history.isOrderSearch = false;
        $scope.history.isOrderSort = false;
      }
    };

    //------ Select calendar-scroll
    $scope.openCalendarScroll = function(dataType) {
      if($scope.history.isDraftView) {
        if (dataType === 'start-date' && !$scope.history.isStartDateDraft ) {
          $scope.history.isStartDateDraft  = true;
          $scope.history.isFinishDateDraft  = false;
          $scope.history.isAllPeriodDraft  = false;
        } else if (dataType === 'finish-date' && !$scope.history.isFinishDateDraft ) {
          $scope.history.isStartDateDraft  = false;
          $scope.history.isFinishDateDraft  = true;
          $scope.history.isAllPeriodDraft  = false;
        } else if (dataType === 'full-date' && !$scope.history.isAllPeriodDraft ) {
          $scope.history.isStartDateDraft  = false;
          $scope.history.isFinishDateDraft  = false;
          $scope.history.isAllPeriodDraft  = true;
          $scope.history.startDateDraft  = '';
          $scope.history.finishDateDraft  = '';
          $scope.drafts = angular.copy($scope.draftsSource);
        } else {
          $scope.history.isStartDateDraft  = false;
          $scope.history.isFinishDateDraft  = false;
          $scope.history.isAllPeriodDraft = false;
        }
      } else {
        if (dataType === 'start-date' && !$scope.history.isStartDate) {
          $scope.history.isStartDate = true;
          $scope.history.isFinishDate = false;
          $scope.history.isAllPeriod = false;
        } else if (dataType === 'finish-date' && !$scope.history.isFinishDate) {
          $scope.history.isStartDate = false;
          $scope.history.isFinishDate = true;
          $scope.history.isAllPeriod = false;
        } else if (dataType === 'full-date' && !$scope.history.isAllPeriod) {
          $scope.history.isStartDate = false;
          $scope.history.isFinishDate = false;
          $scope.history.isAllPeriod = true;
          $scope.history.startDate = '';
          $scope.history.finishDate = '';
          $scope.orders = angular.copy($scope.ordersSource);
        } else {
          $scope.history.isStartDate = false;
          $scope.history.isFinishDate = false;
          $scope.history.isAllPeriod = false;
        }
      }
    };

    //------- filtering orders by Dates
    $scope.filteringByDate = function(obj, start, end) {
      if(start !== '' || end !== '') {
        var newObj, startDate, finishDate;
        newObj = angular.copy(obj);
        startDate = new Date(start).valueOf();
        finishDate = new Date(end).valueOf();
        if(start !== '' && end !== '' && startDate > finishDate) {
          return false;
        }
        for(var t = newObj.length-1;  t >= 0; t--) {
          var objDate = new Date(newObj[t].created).valueOf();
          if(objDate < startDate || objDate > finishDate) {
            newObj.splice(t, 1);
          }
        }
        return newObj;
      } else {
        return false;
      }
    };


    //=========== Sorting
    //------- show Sorting tool dialog
    $scope.orderSorting  = function() {
      if($scope.history.isDraftView) {
        $scope.history.isOrderSortDraft = !$scope.history.isOrderSortDraft;
        $scope.history.isIntervalDateDraft = false;
      } else {
        $scope.history.isOrderSort = !$scope.history.isOrderSort;
        $scope.history.isOrderSearch = false;
        $scope.history.isIntervalDate = false;
      }
    };

    //------ Select sorting type item in list
    $scope.sortingInit = function(sortType) {
      if($scope.history.isDraftView) {

        if($scope.history.isSortTypeDraft === sortType) {
          $scope.history.isSortTypeDraft = false;
          $scope.reverseDraft = true;
        } else {
          $scope.history.isSortTypeDraft = sortType;

          if($scope.history.isSortTypeDraft === 'first') {
            $scope.reverseDraft = true;
          }
          if($scope.history.isSortTypeDraft === 'last') {
            $scope.reverseDraft = false;
          }
        }

      } else {
        if ($scope.history.isSortType === sortType) {
          deSelectSortingType();
          $scope.orders = angular.copy($scope.ordersSource);
          $scope.history.isSortType = 'last';
          //$scope.reverse = true;

        } else {
          deSelectSortingType();
          $scope.history.isSortType = sortType;

          /*if($scope.history.isSortType === 'all-order') {
           deSelectSortingType()
           }*/
          if ($scope.history.isSortType === 'current-order') {
            $scope.history.isCurrentOrdersHide = false;
            $scope.history.isWaitOrdersHide = true;
            $scope.history.isDoneOrdersHide = true;
            checkExestingOrderType('order', 'credit');
          }
          if ($scope.history.isSortType === 'wait-order') {
            $scope.history.isCurrentOrdersHide = true;
            $scope.history.isWaitOrdersHide = false;
            $scope.history.isDoneOrdersHide = true;
            checkExestingOrderType(orderMasterStyle)
          }
          if ($scope.history.isSortType === 'done-order') {
            $scope.history.isWaitOrdersHide = true;
            $scope.history.isCurrentOrdersHide = true;
            $scope.history.isDoneOrdersHide = false;
            checkExestingOrderType(orderDoneStyle)
          }
        }
      }
    };

    function deSelectSortingType() {
      $scope.history.isCurrentOrdersHide = false;
      $scope.history.isWaitOrdersHide = false;
      $scope.history.isDoneOrdersHide = false;
    }

    //-------- checking orders quantity during order sorting
    function checkExestingOrderType(marker1, marker2) {
      var ordersSortCounter = 0;
      for(var ord = 0; ord < $scope.orders.length; ord++) {
        if($scope.orders[ord].orderStyle === marker1 || $scope.orders[ord].orderStyle === marker2) {
          ordersSortCounter++;
        }
      }
      if(ordersSortCounter > 0) {
        $scope.history.isEmptyResult = false;
      } else {
        $scope.history.isEmptyResult = true;
      }
    }




  }
})();