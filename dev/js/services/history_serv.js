(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('HistoryModule')
    .factory('HistoryServ', historyFactory);

  function historyFactory($location, $filter, $cordovaDialogs, $q, localDB, GeneralServ, MainServ, SVGServ, GlobalStor, OrderStor, ProductStor, UserStor, HistoryStor, CartStor) {

    var thisFactory = this,
        orderMasterStyle = 'master',
        orderDoneStyle = 'done';

    thisFactory.publicObj = {
      toCurrentCalculation: toCurrentCalculation,
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


    //------ go to current calculations
    function toCurrentCalculation () {
      //------- set previos Page
      GeneralServ.setPreviosPage();
      if(GlobalStor.global.isCreatedNewProduct && GlobalStor.global.isCreatedNewProject) {
        $location.path('/main');
      } else {
        //-------- CREATE NEW PROJECT
        MainServ.createNewProject();
      }
    }


    //------ Download complete Orders from localDB
    function downloadOrders() {
      localDB.selectLocalDB(localDB.tablesLocalDB.orders.tableName, {order_type: 1}).then(function(result) {
        var orders = angular.copy(result);
//        console.log('orders+++++', orders);
       var orderQty = orders.length;
        if(orderQty) {
          while(--orderQty > -1) {
            orders[orderQty].created = new Date(orders[orderQty].created);
            orders[orderQty].delivery_date = new Date(orders[orderQty].delivery_date);
            orders[orderQty].new_delivery_date = new Date(orders[orderQty].new_delivery_date);
            orders[orderQty].order_date = new Date(orders[orderQty].order_date);

            //------- set order price with discounts
            setOrderPriceByDiscount(orders[orderQty]);

          }
          HistoryStor.history.ordersSource = angular.copy(orders);
          HistoryStor.history.orders = angular.copy(orders);
          //----- max day for calendar-scroll
          HistoryStor.history.maxDeliveryDateOrder = getOrderMaxDate(HistoryStor.history.orders);
//          console.log('maxDeliveryDateOrder =', HistoryStor.history.maxDeliveryDateOrder);
        } else {
          HistoryStor.history.isEmptyResult = 1;
        }
      });
    }


    function setOrderPriceByDiscount(order) {
      order.orderPriceTOTALDis = (order.construct_price_total * (1 - order.discount_construct/100)) + (order.addelem_price_total * (1 - order.discount_addelem/100)) + order.floor_price + order.mounting_price;
      if(order.is_date_price_less) {
        order.orderPriceTOTALDis -= order.delivery_price;
      } else if(order.is_date_price_more) {
        order.orderPriceTOTALDis += order.delivery_price
      }
      order.orderPriceTOTALDis = GeneralServ.roundingNumbers(order.orderPriceTOTALDis);
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
        ordersDateArr.push(orders[it].new_delivery_date);
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
          var ordersQty = HistoryStor.history.orders.length;
          for(var ord = 0; ord < ordersQty; ord++) {
            if(HistoryStor.history.orders[ord].order_number === orderNum) {
              //-------- change style for order
              HistoryStor.history.orders[ord].order_style = orderDoneStyle;
              HistoryStor.history.ordersSource[ord].order_style = orderDoneStyle;

              //------ update in Local BD
              localDB.updateLocalServerDBs(localDB.tablesLocalDB.orders.tableName,  HistoryStor.history.orders[ord].id, {order_style: orderDoneStyle});
            }
          }
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
          var newOrderNum = Math.floor((Math.random() * 100000)),
              ordersQty = HistoryStor.history.orders.length,
              newOrderCopy;

          for(var ord = 0; ord < ordersQty; ord++) {
            if(HistoryStor.history.orders[ord].order_number === orderNum) {
              newOrderCopy = angular.copy(HistoryStor.history.orders[ord]);
            }
          }

          delete newOrderCopy.id;
          delete newOrderCopy.order_number;
          delete newOrderCopy.created;
          newOrderCopy.order_number = newOrderNum;

          //---- save new order in LocalDB
          localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.orders.tableName, newOrderCopy);
          localDB.insertRowLocalDB(newOrderCopy, localDB.tablesLocalDB.orders.tableName);

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
          copyOrderElements(orderNum, newOrderNum, localDB.tablesLocalDB.order_products.tableName);

          //------ copy all AddElements of this order
          copyOrderElements(orderNum, newOrderNum, localDB.tablesLocalDB.order_addelements.tableName);
          //TODO send to Server???
        }
      }

      function copyOrderElements(oldOrderNum, newOrderNum, nameTableDB) {
        var allElements = [];
        //------ Download elements of order from localDB
        localDB.selectLocalDB(nameTableDB, {'order_number': oldOrderNum}).then(function(result) {
//          console.log('result+++++', result);
          if(result.length) {

            allElements = angular.copy(result);
            var allElemQty = allElements.length,
                i = 0;
            if (allElemQty > 0) {
              //-------- set new orderId in all elements of order
              for (; i < allElemQty; i++) {
                delete allElements[i].id;
                delete allElements[i].created;
                allElements[i].order_number = newOrderNum;
              }
              //-------- insert all elements in LocalDB
              for (; i < allElemQty; i++) {
                localDB.insertDB(nameTableDB, allElements[i]);
                //TODO
//                localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.orders.tableName, newOrderCopy);
//                localDB.insertRowLocalDB(newOrderCopy, localDB.tablesLocalDB.orders.tableName);
              }
            }

//            console.log('maxDeliveryDateOrder =', HistoryStor.history.maxDeliveryDateOrder);
          } else {
            console.log('Empty result = ', result);
          }
        });


      }

    }





    //========== Delete order ==========//

    function clickDeleteOrder(orderType, orderNum, event) {
      event.preventDefault();
      event.srcEvent.stopPropagation();

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
          if(orderType) {
            orderList = HistoryStor.history.orders;
            orderListSource = HistoryStor.history.ordersSource;
          //-------- delete draft
          } else {
            orderList = HistoryStor.history.drafts;
            orderListSource = HistoryStor.history.draftsSource;
          }
          var orderListQty = orderList.length;
          while(--orderListQty > -1) {
            if(orderList[orderListQty].order_number === orderNum) {
              orderList.splice(orderListQty, 1);
              orderListSource.splice(orderListQty, 1);
            }
          }
          //TODO delet on Server
          //------- delete order/draft and all its elements in LocalDB
          MainServ.deleteOrderInLocalDB(orderNum);
        }
      }
    }




    //--------------- Edit Order & Draft
    function editOrder(orderNum) {
      GlobalStor.global.isLoader = 1;
      GlobalStor.global.orderEditNumber = orderNum;
      //----- cleaning order
      OrderStor.order = OrderStor.setDefaultOrder();

      var ordersQty = HistoryStor.history.orders.length;
      while(--ordersQty > -1) {
        if(HistoryStor.history.orders[ordersQty].order_number === orderNum) {
          angular.extend(OrderStor.order, HistoryStor.history.orders[ordersQty]);
          CartStor.fillOrderForm();
        }
      }

      //------ Download All Products of edited Order
      downloadProducts().then(function() {
        //------ Download All Add Elements from LocalDB
        downloadAddElements().then(function () {
          GlobalStor.global.isConfigMenu = 1;
          GlobalStor.global.isNavMenu = 0;
          //------- set previos Page
          GeneralServ.setPreviosPage();
          GlobalStor.global.isLoader = 0;
          $location.path('/cart');
        });
      });

    }


    //------ Download All Products Data for Order
    function downloadProducts() {
      var deferred = $q.defer();
      localDB.selectLocalDB(localDB.tablesLocalDB.order_products.tableName, {'order_number': GlobalStor.global.orderEditNumber}).then(function(products) {
        var productsQty = products.length;
        if(productsQty) {
          //------------- parsing All Templates Source and Icons for Order
          for(var prod = 0; prod < productsQty; prod++) {
            ProductStor.product = ProductStor.setDefaultProduct();
            angular.extend(ProductStor.product, products[prod]);
console.log('EDIT PRODUCT', ProductStor.product);
            //----- checking product with design or only addElements
            if(!ProductStor.product.is_addelem_only || ProductStor.product.is_addelem_only === 'false') {
              //----- parsing design from string to object
              ProductStor.product.template_source = JSON.parse(ProductStor.product.template_source);
              //              console.log('templateSource', ProductStor.product.templateSource);
              //----- find depths and build design icon
              MainServ.setCurrentProfile(ProductStor.product.profile_id).then(function(){
                MainServ.setCurrentGlass(ProductStor.product.glass_id);
                MainServ.setCurrentHardware(ProductStor.product.hardware_id);
                SVGServ.createSVGTemplateIcon(ProductStor.product.template_source, GlobalStor.global.profileDepths).then(function(result) {
                  ProductStor.product.templateIcon = angular.copy(result);
                  deferred.resolve(1);
                });
              });
            } else {
              deferred.resolve(1);
            }
            OrderStor.order.products.push(ProductStor.product);
          }

        } else {
          deferred.reject(products);
        }
      });
      return deferred.promise;
    }


    //------ Download All Add Elements from LocalDB
    function downloadAddElements() {
      var deferred = $q.defer();
      localDB.selectLocalDB(localDB.tablesLocalDB.order_addelements.tableName, {'order_number': GlobalStor.global.orderEditNumber}).then(function(result) {
        var allAddElementsQty = result.length;
        if(allAddElementsQty) {
          //          console.log('results.data === ', result);

          for(var elem = 0; elem < allAddElementsQty; elem++) {
            for(var prod = 0; prod < OrderStor.order.products_qty; prod++) {
              if(result[elem].product_id === OrderStor.order.products[prod].product_id) {
                OrderStor.order.products[prod].chosenAddElements[result[elem].element_type].push(result[elem]);
                deferred.resolve(1);
              }
            }
          }

        } else {
          deferred.resolve(1);
        }
      });
      return deferred.promise;
    }

    /*
     additional_payment: ""
     base_price: 0
     batch: ""
     climatic_zone: 1
     created: "2015-09-04T15:36:50.000Z"
     customer_address: "ubuhu"
     customer_age: 0
     customer_city: "Dnepropetrovsk"
     customer_education: 0
     customer_email: ""
     customer_endtime: ""
     customer_infoSource: 0
     customer_itn: 0
     customer_location: "hijhjh"
     customer_name: "Gygygygyg"
     customer_occupation: 0
     customer_phone: "67554"
     customer_phone_city: ""
     customer_sex: 0
     customer_starttime: ""
     customer_target: ""
     delivery_date: "2015-09-19T15:33:02.344Z"
     delivery_price: 0
     discount_addelem: 10
     discount_construct: 10
     factory_id: 208
     factory_margin: 0
     floor_id: 1
     heat_coef_min: 1
     id: 86
     instalment_id: 0
     is_date_price_less: 0
     is_date_price_more: 0
     is_instalment: 0
     is_old_price: 0
     modified: "2015-09-04T15:36:50.000Z"
     mounting_id: 1
     mounting_price: 0
     new_delivery_date: "2015-09-19T15:33:02.344Z"
     order_date: "2015-09-04T15:32:38.715Z"
     order_number: "83664"
     order_price_total: 716.08
     order_price_total_primary: 716.08
     order_style: "master"
     order_type: 1
     payment_first: 0
     payment_first_primary: 0
     payment_monthly: 0
     payment_monthly_primary: 0
     perimeter: 0
     products_price_total: 716.08
     products_qty: 1
     purchase_price: 0
     sale_price: 0
     sended: "1970-01-01T00:00:00.000Z"
     square: 0
     state_buch: "1970-01-01T00:00:00.000Z"
     state_to: "1970-01-01T00:00:00.000Z"
     user_id: 1254
     */



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
      localDB.selectLocalDB(localDB.tablesLocalDB.orders.tableName, {'order_type': 0}).then(function(drafts) {
        if(drafts.length) {
          HistoryStor.history.draftsSource = angular.copy(drafts);
          HistoryStor.history.drafts = angular.copy(drafts);
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
        if(HistoryStor.history.orders[ord].order_style === marker1 || HistoryStor.history.orders[ord].order_style === marker2) {
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
