
// services/history_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('HistoryServ', historyFactory);

  function historyFactory($location, $filter, $cordovaDialogs, globalConstants, globalDB, localDB, MainServ, GlobalStor, UserStor, HistoryStor) {

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

      orderSearching: orderSearching
    };

    return thisFactory.publicObj;




    //============ methods ================//


    //------ Download complete Orders from localDB
    function downloadOrders() {
      localDB.selectDB(localDB.ordersTableBD, {'orderType': globalConstants.fullOrderType}).then(function(result) {
        if(result) {
          //$scope.ordersSource = angular.copy(results.data);
          HistoryStor.history.orders = angular.copy(result[0]);
          //----- max day for calendar-scroll
//          HistoryStor.history.maxDeliveryDateOrder = getOrderMaxDate(HistoryStor.history.orders);
        } else {
          HistoryStor.history.isEmptyResult = true;
        }
      });
    }


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
              //$scope.ordersSource[ord].orderStyle = orderDoneStyle;

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
          var orderList;
          //-------- delete order
          if(orderType === globalConstants.fullOrderType) {
            orderList = HistoryStor.history.orders;
          //-------- delete draft
          } else {
            orderList = HistoryStor.history.drafts;
          }
          var orderListQty = orderList.length,
              i = 0;
          for(; i < orderListQty; i++) {
            if(orderList[i].orderId === orderNum) {
              orderList.splice(i, 1);
              //$scope.draftsSource.splice(i, 1);
            }
          }

          //------- delete order/draft and all its elements in Local DB
          MainServ.deleteOrderFromLocalDB(orderNum);

        }
      }
    }




    //--------------- Edit Order & Draft
    function editOrder(orderNum) {
      GlobalStor.global.orderEditNumber = orderNum;
      GlobalStor.global.isConfigMenu = true;
      GlobalStor.global.isNavMenu = false;
      //------- set previos Page
      GlobalStor.global.prevOpenPage = GlobalStor.global.currOpenPage;
      $location.path('/cart');
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
          //$scope.draftsSource = angular.copy(results.data);
          HistoryStor.history.drafts = angular.copy(result[0]);
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


  }
})();

