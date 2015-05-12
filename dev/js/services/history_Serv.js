(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('HistoryServ', historyFactory);

  function historyFactory($location, $filter, $cordovaDialogs, $cordovaProgress, globalConstants, globalDB, localDB, MainServ, CartServ, GlobalStor, OrderStor, UserStor, HistoryStor) {

    var thisFactory = this,
        orderMasterStyle = 'master',
        orderDoneStyle = 'done';

    thisFactory.publicObj = {
      downloadOrders: downloadOrders,
      sendOrderToFactory: sendOrderToFactory,
      makeOrderCopy: makeOrderCopy,
      clickDeleteOrder: clickDeleteOrder,
      editOrder: editOrder,
      viewSwitching: viewSwitching,

      orderSearching: orderSearching,
      orderDateSelecting: orderDateSelecting,
      openCalendarScroll: openCalendarScroll,
      orderSorting: orderSorting,
      sortingInit: sortingInit
    };

    return thisFactory.publicObj;




    //============ methods ================//


    //------ Download complete Orders from localDB
    function downloadOrders() {
      localDB.selectDB(localDB.ordersTableBD, {'orderType': globalConstants.fullOrderType}).then(function(result) {
//        console.log('orders+++++', result);
        if(result) {
          HistoryStor.history.ordersSource = angular.copy(result);
          HistoryStor.history.orders = angular.copy(result);
          //----- max day for calendar-scroll
          HistoryStor.history.maxDeliveryDateOrder = getOrderMaxDate(HistoryStor.history.orders);
          console.log('maxDeliveryDateOrder =', HistoryStor.history.maxDeliveryDateOrder);
        } else {
          HistoryStor.history.isEmptyResult = true;
        }
      });
    }


    //------- defind Order MaxDate
    function getOrderMaxDate(orders) {
      var ordersDateArr = [],
          ordersQty = orders.length,
          it = 0;
      for (; it < ordersQty; it++) {
        //var oldDateArr = orders[it].deliveryDate.split('.');
        //var newDateStr = Date.parse(oldDateArr[1]+'/'+oldDateArr[0]+'/'+oldDateArr[2]);
        //var newDateStr = Date.parse(oldDateArr[2], oldDateArr[1], oldDateArr[0]);
        ordersDateArr.push(orders[it].newDeliveryDate);
      }
      ordersDateArr.sort(function (a, b) {
        return b - a
      });
      return ordersDateArr[0];
    }






    //========== Send Order to Factory ========//

    function sendOrderToFactory(orderStyle, orderNum) {

      if(orderStyle !== orderMasterStyle) {
        $cordovaDialogs.confirm(
          $filter('translate')('common_words.SEND_ORDER_TXT'),
          $filter('translate')('common_words.SEND_ORDER_TITLE'),
          [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')])
          .then(function(buttonIndex) {
            sendOrder(buttonIndex);
          });
      }

      function sendOrder(button) {
        if(button == 1) {
          var ordersQty = HistoryStor.history.orders.length,
              ord = 0;
          for(; ord < ordersQty; ord++) {
            if(HistoryStor.history.orders[ord].orderId === orderNum) {
              //-------- change style for order
              HistoryStor.history.orders[ord].orderStyle = orderDoneStyle;
              HistoryStor.history.ordersSource[ord].orderStyle = orderDoneStyle;

              //------ synchronize with Global BD
              console.log('sendOrder!!!!', HistoryStor.history.orders[ord]);
              globalDB.sendOrder(UserStor.userInfo.phone, UserStor.userInfo.device_code, HistoryStor.history.orders[ord], function(result){console.log(result)});
            }
          }
          localDB.updateDB(localDB.ordersTableBD, {'orderStyle': orderDoneStyle}, {'orderId': orderNum});
        }
      }

    }






    //========= make Order Copy =========//

    function makeOrderCopy(orderStyle, orderNum) {

      if(orderStyle !== orderMasterStyle) {
        $cordovaDialogs.confirm(
          $filter('translate')('common_words.COPY_ORDER_TXT'),
          $filter('translate')('common_words.COPY_ORDER_TITLE'),
          [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')])
          .then(function(buttonIndex) {
            copyOrder(buttonIndex);
          });
      }

      function copyOrder(button) {
        if (button == 1) {

          //---- new order number
          var newOrderId = Math.floor((Math.random() * 100000)),
              ordersQty = HistoryStor.history.orders.length,
              ord = 0,
              newOrderCopy;

          for(; ord < ordersQty; ord++) {
            if(HistoryStor.history.orders[ord].orderId === orderNum) {
              newOrderCopy = angular.copy(HistoryStor.history.orders[ord]);
            }
          }

          delete newOrderCopy.id;
          delete newOrderCopy.created;
          newOrderCopy.orderId = newOrderId;

          //---- save new order in LocalDB
          localDB.insertDB(localDB.ordersTableBD, newOrderCopy);

          //---- get it again from LocalDB as to "created date"
          //TODO переделать на создание даты здесь, а не в базе? переделака директивы на другой формат даты
//          localDB.selectDB(localDB.ordersTableBD, {'orderId': newOrderId}).then(function (results) {
//            if (results.status) {
//              newOrderCopy = angular.copy(results.data);
//              //---- add copied new order in Local Objects
//              $scope.orders.push(newOrderCopy[0]);
//              $scope.ordersSource.push(newOrderCopy[0]);
//            } else {
//              console.log(results);
//            }
//          });

          //TODO create date!
          //---- save new order
          HistoryStor.history.orders.push(newOrderCopy);
          HistoryStor.history.ordersSource.push(newOrderCopy);
          //------ copy all Products of this order
          copyOrderElements(newOrderId, localDB.productsTableBD);

          //------ copy all AddElements of this order
          copyOrderElements(newOrderId, localDB.addElementsTableBD);
          //TODO send to Server???
        }
      }

      function copyOrderElements(newOrderId, nameTableDB) {
        var allElements = [];
        //------ Download elements of order from localDB
        localDB.selectDB(nameTableDB, {'orderId': orderNum}).then(function (result) {
          if (result) {
            allElements = angular.copy(result[0]);

            var allElemQty = allElements.length, i = 0, j = 0;
            if (allElemQty > 0) {
              //-------- set new orderId in all elements of order
              for (; i < allElemQty; i++) {
                delete allElements[i].id;
                delete allElements[i].created;
                allElements[i].orderId = newOrderId;
              }
              //-------- insert all elements in LocalDB
              for (; j < allElemQty; j++) {
                localDB.insertDB(nameTableDB, allElements[j]);
              }
            }

          } else {
            console.log(result);
          }
        });
      }

    }





    //========== Delete order ==========//

    function clickDeleteOrder(orderType, orderNum) {

      $cordovaDialogs.confirm(
        $filter('translate')('common_words.DELETE_ORDER_TXT'),
        $filter('translate')('common_words.DELETE_ORDER_TITLE'),
        [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')])
        .then(function(buttonIndex) {
          deleteOrder(buttonIndex);
        });

      function deleteOrder(button) {
        if(button == 1) {
          var orderList, orderListSource;
          //-------- delete order
          if(orderType === globalConstants.fullOrderType) {
            orderList = HistoryStor.history.orders;
            orderListSource = HistoryStor.history.ordersSource;
          //-------- delete draft
          } else {
            orderList = HistoryStor.history.drafts;
            orderListSource = HistoryStor.history.draftsSource;
          }
          var orderListQty = orderList.length,
              i = 0;
          for(; i < orderListQty; i++) {
            if(orderList[i].orderId === orderNum) {
              orderList.splice(i, 1);
              orderListSource.splice(i, 1);
            }
          }

          //------- delete order/draft and all its elements in Local DB
          MainServ.deleteOrderFromLocalDB(orderNum);

        }
      }
    }




    //--------------- Edit Order & Draft
    function editOrder(orderNum) {
      //$cordovaProgress.showSimple(true);
      GlobalStor.global.orderEditNumber = orderNum;
      GlobalStor.global.isConfigMenu = true;
      GlobalStor.global.isNavMenu = false;
      //------- set previos Page
      GlobalStor.global.prevOpenPage = GlobalStor.global.currOpenPage;
      //----- cleaning order
      OrderStor.order = OrderStor.setDefaultOrder();
      //------- download edited Order
      CartServ.downloadOrder();

      //------ Download All Products of edited Order
      CartServ.downloadProducts().then(function() {
        //------ Download All Add Elements from LocalDB
        CartServ.downloadAddElements().then(function () {
          //$cordovaProgress.hide();
          $location.path('/cart');
        });
      });
    }




    //------- Orders/Drafts View switcher
    function viewSwitching() {
      HistoryStor.history.isDraftView = !HistoryStor.history.isDraftView;

      //------ Download Drafts from localDB in first open
      if(!HistoryStor.history.drafts.length) {
        downloadDrafts();
      }
    }

    //------ Download draft Orders from localDB
    function downloadDrafts() {
      localDB.selectDB(localDB.ordersTableBD, {'orderType': globalConstants.draftOrderType}).then(function(result) {
        if(result) {
          HistoryStor.history.draftsSource = angular.copy(result);
          HistoryStor.history.drafts = angular.copy(result);
        } else {
          HistoryStor.history.isEmptyResultDraft = true;
        }
      });
    }




    //============= HISTORY TOOLS ============//

    //=========== Searching

    function orderSearching() {
      HistoryStor.history.isOrderSearch = true;
      HistoryStor.history.isOrderDate = false;
      HistoryStor.history.isOrderSort = false;
    }







    //=========== Filtering by Date

    //------- show Date filter tool dialog
    function orderDateSelecting() {
      var filterResult;
      //------ in Drafts
      if(HistoryStor.history.isDraftView) {
        if(HistoryStor.history.isOrderDateDraft) {
          //-------- filtering orders by selected date
          filterResult = filteringByDate(HistoryStor.history.ordersSource, HistoryStor.history.startDateDraft, HistoryStor.history.finishDateDraft);
          if(filterResult) {
            HistoryStor.history.drafts = filterResult;
          }
        }
        HistoryStor.history.isOrderDateDraft = !HistoryStor.history.isOrderDateDraft;
        HistoryStor.history.isOrderSortDraft = false;

        //------ in Orders
      } else {
        if(HistoryStor.history.isOrderDate) {
          //-------- filtering orders by selected date
          filterResult = filteringByDate(HistoryStor.history.ordersSource, HistoryStor.history.startDate, HistoryStor.history.finishDate);
          if(filterResult) {
            HistoryStor.history.orders = filterResult;
          }
        }
        HistoryStor.history.isOrderDate = !HistoryStor.history.isOrderDate;
        HistoryStor.history.isOrderSearch = false;
        HistoryStor.history.isOrderSort = false;
      }
    }

    //------- filtering orders by Dates
    function filteringByDate(obj, start, end) {
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
    }


    //------ Select calendar-scroll
    function openCalendarScroll(dataType) {
      if(HistoryStor.history.isDraftView) {
        if (dataType === 'start-date' && !HistoryStor.history.isStartDateDraft ) {
          HistoryStor.history.isStartDateDraft  = true;
          HistoryStor.history.isFinishDateDraft  = false;
          HistoryStor.history.isAllPeriodDraft  = false;
        } else if (dataType === 'finish-date' && !HistoryStor.history.isFinishDateDraft ) {
          HistoryStor.history.isStartDateDraft  = false;
          HistoryStor.history.isFinishDateDraft  = true;
          HistoryStor.history.isAllPeriodDraft  = false;
        } else if (dataType === 'full-date' && !HistoryStor.history.isAllPeriodDraft ) {
          HistoryStor.history.isStartDateDraft  = false;
          HistoryStor.history.isFinishDateDraft  = false;
          HistoryStor.history.isAllPeriodDraft  = true;
          HistoryStor.history.startDateDraft  = '';
          HistoryStor.history.finishDateDraft  = '';
          HistoryStor.history.drafts = angular.copy(HistoryStor.history.draftsSource);
        } else {
          HistoryStor.history.isStartDateDraft  = false;
          HistoryStor.history.isFinishDateDraft  = false;
          HistoryStor.history.isAllPeriodDraft = false;
        }
      } else {
        if (dataType === 'start-date' && !HistoryStor.history.isStartDate) {
          HistoryStor.history.isStartDate = true;
          HistoryStor.history.isFinishDate = false;
          HistoryStor.history.isAllPeriod = false;
        } else if (dataType === 'finish-date' && !HistoryStor.history.isFinishDate) {
          HistoryStor.history.isStartDate = false;
          HistoryStor.history.isFinishDate = true;
          HistoryStor.history.isAllPeriod = false;
        } else if (dataType === 'full-date' && !HistoryStor.history.isAllPeriod) {
          HistoryStor.history.isStartDate = false;
          HistoryStor.history.isFinishDate = false;
          HistoryStor.history.isAllPeriod = true;
          HistoryStor.history.startDate = '';
          HistoryStor.history.finishDate = '';
          HistoryStor.history.orders = angular.copy(HistoryStor.history.ordersSource);
        } else {
          HistoryStor.history.isStartDate = false;
          HistoryStor.history.isFinishDate = false;
          HistoryStor.history.isAllPeriod = false;
        }
      }
    }




    //=========== Sorting

    //------- show Sorting tool dialog
    function orderSorting() {
      if(HistoryStor.history.isDraftView) {
        HistoryStor.history.isOrderSortDraft = !HistoryStor.history.isOrderSortDraft;
        HistoryStor.history.isOrderDateDraft = false;
      } else {
        HistoryStor.history.isOrderSort = !HistoryStor.history.isOrderSort;
        HistoryStor.history.isOrderSearch = false;
        HistoryStor.history.isOrderDate = false;
      }
    }


    //------ Select sorting type item in list
    function sortingInit(sortType) {
      if(HistoryStor.history.isDraftView) {

        if(HistoryStor.history.isSortTypeDraft === sortType) {
          HistoryStor.history.isSortTypeDraft = false;
          HistoryStor.history.reverseDraft = true;
        } else {
          HistoryStor.history.isSortTypeDraft = sortType;

          if(HistoryStor.history.isSortTypeDraft === 'first') {
            HistoryStor.history.reverseDraft = true;
          }
          if(HistoryStor.history.isSortTypeDraft === 'last') {
            HistoryStor.history.reverseDraft = false;
          }
        }

      } else {
        if (HistoryStor.history.isSortType === sortType) {
          deSelectSortingType();
          HistoryStor.history.orders = angular.copy(HistoryStor.history.ordersSource);
          HistoryStor.history.isSortType = 'last';
        } else {
          deSelectSortingType();
          HistoryStor.history.isSortType = sortType;

          /*if($scope.history.isSortType === 'all-order') {
           deSelectSortingType()
           }*/
          if (HistoryStor.history.isSortType === 'current-order') {
            HistoryStor.history.isCurrentOrdersHide = false;
            HistoryStor.history.isWaitOrdersHide = true;
            HistoryStor.history.isDoneOrdersHide = true;
            checkExestingOrderType('order', 'credit');
          }
          if (HistoryStor.history.isSortType === 'wait-order') {
            HistoryStor.history.isCurrentOrdersHide = true;
            HistoryStor.history.isWaitOrdersHide = false;
            HistoryStor.history.isDoneOrdersHide = true;
            checkExestingOrderType(orderMasterStyle)
          }
          if (HistoryStor.history.isSortType === 'done-order') {
            HistoryStor.history.isWaitOrdersHide = true;
            HistoryStor.history.isCurrentOrdersHide = true;
            HistoryStor.history.isDoneOrdersHide = false;
            checkExestingOrderType(orderDoneStyle)
          }
        }
      }
    }



    function deSelectSortingType() {
      HistoryStor.history.isCurrentOrdersHide = false;
      HistoryStor.history.isWaitOrdersHide = false;
      HistoryStor.history.isDoneOrdersHide = false;
    }

    //-------- checking orders quantity during order sorting
    function checkExestingOrderType(marker1, marker2) {
      var ordersSortCounter = 0,
          ordersQty = HistoryStor.history.orders.length,
          ord = 0;

      for(; ord < ordersQty; ord++) {
        if(HistoryStor.history.orders[ord].orderStyle === marker1 || HistoryStor.history.orders[ord].orderStyle === marker2) {
          ordersSortCounter++;
        }
      }
      if(ordersSortCounter > 0) {
        HistoryStor.history.isEmptyResult = false;
      } else {
        HistoryStor.history.isEmptyResult = true;
      }
    }



  }
})();
