
// controllers/history.js

/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, typingTextByChar, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('HistoryCtrl', ['$scope', 'constructService', 'localStorage', 'localDB', '$location', '$filter', function ($scope, constructService, localStorage, localDB, $location, $filter) {

  $scope.global = localStorage;

  $scope.global.isOpenedHistoryPage = true;
  $scope.global.isOpenedCartPage = false;

  $scope.history = {
    isOrderSearch: false,
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
  var orderMasterStyle = 'master',
      orderDoneStyle = 'done';

  //console.log('isOpenedHistoryPage', $scope.global.isOpenedHistoryPage);
  //console.log('isOrderFinished', $scope.global.isOrderFinished);

  //------ Download complete Orders from localDB
  localDB.selectDB($scope.global.ordersTableBD, {'orderType': $scope.global.fullOrderType}, function (results) {
    if (results.status) {
      $scope.ordersSource = angular.copy(results.data);
      $scope.orders = angular.copy(results.data);
      //----- max day for calendar-scroll
      $scope.history.maxDeliveryDateOrder = getOrderMaxDate($scope.orders);
    } else {
      console.log(results);
      $scope.history.isEmptySortResult = true;
    }
  });

  //------- defind Order MaxDate
  function getOrderMaxDate(orders) {
    var ordersDateArr = [];
    for (var it = 0; it < orders.length; it++) {
      var oldDateArr = orders[it].deliveryDate.split('.');
      var newDateStr = Date.parse(oldDateArr[1]+'/'+oldDateArr[0]+'/'+oldDateArr[2]);
      //var newDateStr = Date.parse(oldDateArr[2], oldDateArr[1], oldDateArr[0]);
      ordersDateArr.push(newDateStr);
    }
    ordersDateArr.sort(function (a, b) {
      return b - a
    });
    return ordersDateArr[0];
  }


  //=========== Searching

  $scope.orderSearching = function() {
    $scope.history.isOrderSearch = true;
    $scope.history.isIntervalDate = false;
    $scope.history.isOrderSort = false;
  };

  // Delete searching word
  $scope.cancelSearching = function() {
    $scope.searchingWord = '';
    $scope.history.isOrderSearch = false;
  };
  // Delete last chart searching word
  $scope.deleteSearchChart = function() {
    $scope.searchingWord = $scope.searchingWord.slice(0,-1);
  };



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
      $scope.history.isEmptySortResult = false;
    } else {
      $scope.history.isEmptySortResult = true;
    }
  }


  // History/Draft View switcher
  $scope.viewSwitching = function() {
    $scope.history.isDraftView = !$scope.history.isDraftView;

    //------ Download draft Orders from localDB
    localDB.selectDB($scope.global.ordersTableBD, {'orderType': $scope.global.draftOrderType}, function (results) {
      if (results.status) {
        $scope.draftsSource = angular.copy(results.data);
        $scope.drafts = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });
  };

  //--------- Delete order
  $scope.clickDeleteOrder = function(orderType, orderNum) {

    navigator.notification.confirm(
      $filter('translate')('common_words.DELETE_ORDER_TXT'),
      deleteOrder,
      $filter('translate')('common_words.DELETE_ORDER_TITLE'),
      [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')]
    );

    function deleteOrder(button) {
      if(button == 1) {

        //-------- delete order in Local Objects
        if (orderType === $scope.global.fullOrderType) {
          for(var ord = 0; ord < $scope.orders.length; ord++) {
            if ($scope.orders[ord].orderId === orderNum) {
              $scope.orders.splice(ord, 1);
              $scope.ordersSource.splice(ord, 1);
            }
          }
        } else {
          for(var drf = 0; drf < $scope.drafts.length; drf++) {
            if ($scope.drafts[drf].orderId === orderNum) {
              $scope.drafts.splice(drf, 1);
              $scope.draftsSource.splice(drf, 1);
            }
          }
        }
        //---- delete order in LocalStorage
        for(var ord = 0; ord < $scope.global.orders.length; ord++) {
          if ($scope.global.orders[ord].orderId === orderNum) {
            $scope.global.orders.splice(ord, 1);
          }
        }
        //------- delete order in Local DB
        $scope.global.deleteOrderFromLocalDB(orderNum);

      }
    }
  };


  //------------ send Order to Factory
  $scope.sendOrderToFactory = function(orderStyle, orderNum) {

    if(orderStyle !== orderMasterStyle) {
      navigator.notification.confirm(
        $filter('translate')('common_words.SEND_ORDER_TXT'),
        sendOrder,
        $filter('translate')('common_words.SEND_ORDER_TITLE'),
        [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')]
      );
    }

    function sendOrder(button) {
      if(button == 1) {
        for(var ord = 0; ord < $scope.orders.length; ord++) {
          if($scope.orders[ord].orderId === orderNum) {
            $scope.orders[ord].orderStyle = orderDoneStyle;
            $scope.ordersSource[ord].orderStyle = orderDoneStyle;
          }
        }
        localDB.updateDB($scope.global.ordersTableBD, {'orderStyle': orderDoneStyle}, {'orderId': orderNum});
      }
    }

  };


  //----------- make Order Copy
  $scope.makeOrderCopy = function(orderStyle, orderNum) {

    if(orderStyle !== orderMasterStyle) {
      navigator.notification.confirm(
        $filter('translate')('common_words.COPY_ORDER_TXT'),
        copyOrder,
        $filter('translate')('common_words.COPY_ORDER_TITLE'),
        [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')]
      );
    }

    function copyOrder(button) {
      if (button == 1) {

        //---- new order number
        var newOrderCopy = {},
            newOrderNumber = Math.floor((Math.random() * 100000));

        for(var ord = 0; ord < $scope.orders.length; ord++) {
          if ($scope.orders[ord].orderId === orderNum) {
            newOrderCopy = angular.copy($scope.orders[ord]);
          }
        }
        delete newOrderCopy.id;
        delete newOrderCopy.created;
        newOrderCopy.orderId = newOrderNumber;
        //---- save in LocalDB
        localDB.insertDB($scope.global.ordersTableBD, newOrderCopy);
        //---- save in LocalStorage
        $scope.global.orders.push(newOrderCopy);
        //---- get it again from LocalDB as to "created date"
        //TODO переделать на создание даты здесь, а не в базе? переделака директивы на другой формат даты
        localDB.selectDB($scope.global.ordersTableBD, {'orderId': newOrderNumber}, function (results) {
          if (results.status) {
            newOrderCopy = angular.copy(results.data);
            //---- add copied new order in Local Objects
            $scope.orders.push(newOrderCopy[0]);
            $scope.ordersSource.push(newOrderCopy[0]);
          } else {
            console.log(results);
          }
        });


        //------ Download Products Data from localDB
        localDB.selectDB($scope.global.productsTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allProductsDB = angular.copy(results.data);
            var newAllProductsXOrder = rewriteObjectProperty(allProductsDB, newOrderNumber);
            //console.log(newAllProductsXOrder);
            if(newAllProductsXOrder && newAllProductsXOrder.length > 0) {
              for(var p = 0; p < newAllProductsXOrder.length; p++) {
                localDB.insertDB($scope.global.productsTableBD, newAllProductsXOrder[p]);
              }
            }
          } else {
            console.log(results);
          }
        });


        //------ Download Add Elements from localDB
        localDB.selectDB($scope.global.gridsTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allGridsDB = angular.copy(results.data);
            var newAllGridsXOrder = rewriteObjectProperty(allGridsDB, newOrderNumber);
            if(newAllGridsXOrder && newAllGridsXOrder.length > 0) {
              for(var w = 0; w < newAllGridsXOrder.length; w++) {
                localDB.insertDB($scope.global.gridsTableBD, newAllGridsXOrder[w]);
              }
            }
          } else {
            console.log(results);
          }
        });

        localDB.selectDB($scope.global.visorsTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allVisorsDB = angular.copy(results.data);
            var newAllVisorsXOrder = rewriteObjectProperty(allVisorsDB, newOrderNumber);
            if(newAllVisorsXOrder && newAllVisorsXOrder.length > 0) {
              for(var w = 0; w < newAllVisorsXOrder.length; w++) {
                localDB.insertDB($scope.global.visorsTableBD, newAllVisorsXOrder[w]);
              }
            }
          } else {
            console.log(results);
          }
        });

        localDB.selectDB($scope.global.spillwaysTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allSpillwaysDB = angular.copy(results.data);
            var newAllSpillwaysXOrder = rewriteObjectProperty(allSpillwaysDB, newOrderNumber);
            if(newAllSpillwaysXOrder && newAllSpillwaysXOrder.length > 0) {
              for(var w = 0; w < newAllSpillwaysXOrder.length; w++) {
                localDB.insertDB($scope.global.spillwaysTableBD, newAllSpillwaysXOrder[w]);
              }
            }
          } else {
            console.log(results);
          }
        });

        localDB.selectDB($scope.global.outSlopesTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allOutSlopesDB = angular.copy(results.data);
            var newAllOutSlopesXOrder = rewriteObjectProperty(allOutSlopesDB, newOrderNumber);
            if(newAllOutSlopesXOrder && newAllOutSlopesXOrder.length > 0) {
              for(var w = 0; w < newAllOutSlopesXOrder.length; w++) {
                localDB.insertDB($scope.global.outSlopesTableBD, newAllOutSlopesXOrder[w]);
              }
            }
          } else {
            console.log(results);
          }
        });

        localDB.selectDB($scope.global.inSlopesTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allInSlopesDB = angular.copy(results.data);
            var newAllInSlopesXOrder = rewriteObjectProperty(allInSlopesDB, newOrderNumber);
            if(newAllInSlopesXOrder && newAllInSlopesXOrder.length > 0) {
              for(var w = 0; w < newAllInSlopesXOrder.length; w++) {
                localDB.insertDB($scope.global.inSlopesTableBD, newAllInSlopesXOrder[w]);
              }
            }
          } else {
            console.log(results);
          }
        });

        localDB.selectDB($scope.global.louversTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allLouversDB = angular.copy(results.data);
            var newAllLouversXOrder = rewriteObjectProperty(allLouversDB, newOrderNumber);
            if(newAllLouversXOrder && newAllLouversXOrder.length > 0) {
              for(var w = 0; w < newAllLouversXOrder.length; w++) {
                localDB.insertDB($scope.global.louversTableBD, newAllLouversXOrder[w]);
              }
            }
          } else {
            console.log(results);
          }
        });

        localDB.selectDB($scope.global.connectorsTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allConnectorsDB = angular.copy(results.data);
            var newAllConnectorsXOrder = rewriteObjectProperty(allConnectorsDB, newOrderNumber);
            if(newAllConnectorsXOrder && newAllConnectorsXOrder.length > 0) {
              for(var w = 0; w < newAllConnectorsXOrder.length; w++) {
                localDB.insertDB($scope.global.connectorsTableBD, newAllConnectorsXOrder[w]);
              }
            }
          } else {
            console.log(results);
          }
        });

        localDB.selectDB($scope.global.fansTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allFansDB = angular.copy(results.data);
            var newAllFansXOrder = rewriteObjectProperty(allFansDB, newOrderNumber);
            if(newAllFansXOrder && newAllFansXOrder.length > 0) {
              for(var w = 0; w < newAllFansXOrder.length; w++) {
                localDB.insertDB($scope.global.fansTableBD, newAllFansXOrder[w]);
              }
            }
          } else {
            console.log(results);
          }
        });

        localDB.selectDB($scope.global.windowSillsTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allWindowSillsDB = angular.copy(results.data);
            var newAllWindowSillsXOrder = rewriteObjectProperty(allWindowSillsDB, newOrderNumber);
            if(newAllWindowSillsXOrder && newAllWindowSillsXOrder.length > 0) {
              for(var ws = 0; ws < newAllWindowSillsXOrder.length; ws++) {
                localDB.insertDB($scope.global.windowSillsTableBD, newAllWindowSillsXOrder[ws]);
              }
            }
          } else {
            console.log(results);
          }
        });

        localDB.selectDB($scope.global.handlesTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allHandlesDB = angular.copy(results.data);
            var newAllHandlesXOrder = rewriteObjectProperty(allHandlesDB, newOrderNumber);
            if(newAllHandlesXOrder && newAllHandlesXOrder.length > 0) {
              for(var w = 0; w < newAllHandlesXOrder.length; w++) {
                localDB.insertDB($scope.global.handlesTableBD, newAllHandlesXOrder[w]);
              }
            }
          } else {
            console.log(results);
          }
        });

        localDB.selectDB($scope.global.othersTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allOthersDB = angular.copy(results.data);
            var newAllOthersXOrder = rewriteObjectProperty(allOthersDB, newOrderNumber);
            if(newAllOthersXOrder && newAllOthersXOrder.length > 0) {
              for(var w = 0; w < newAllOthersXOrder.length; w++) {
                localDB.insertDB($scope.global.othersTableBD, newAllOthersXOrder[w]);
              }
            }
          } else {
            console.log(results);
          }
        });

      }
    }

  };


  function rewriteObjectProperty(objSource, orderId) {
    if(objSource && objSource.length > 0) {
      for(var i = 0; i < objSource.length; i++) {
        delete objSource[i].id;
        delete objSource[i].created;
        objSource[i].orderId = orderId;
      }
      return objSource;
    }
  }

  //--------------- Edit Order & Draft
  $scope.editOrder = function(orderNum) {
    $scope.global.orderEditNumber = orderNum;
    $scope.global.isConfigMenu = true;
    $scope.global.isOpenedHistoryPage = false;
    $scope.global.gotoCartPage();
  };

/*
  function buildOrdersByType(tempOrders, orderStyle) {
    for(var ord = 0; ord < $scope.orders.length; ord++) {
      if($scope.orders[ord].orderStyle === orderStyle) {
        tempOrders.push($scope.orders[ord]);
      }
    }
  }
*/
}]);