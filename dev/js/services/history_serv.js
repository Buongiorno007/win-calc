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
      localDB.selectLocalDB(localDB.tablesLocalDB.orders.tableName, {order_type: 1}).then(function(orders) {
        var orderQty = orders.length;
        HistoryStor.history.isEmptyResult = 0;
        if(orderQty) {
          while(--orderQty > -1) {
            orders[orderQty].created = new Date(orders[orderQty].created);
            orders[orderQty].delivery_date = new Date(orders[orderQty].delivery_date);
            orders[orderQty].new_delivery_date = new Date(orders[orderQty].new_delivery_date);
            orders[orderQty].order_date = new Date(orders[orderQty].order_date);
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
        return b - a;
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
            if(HistoryStor.history.orders[ord].id === orderNum) {
              //-------- change style for order
              HistoryStor.history.orders[ord].order_style = orderDoneStyle;
              HistoryStor.history.ordersSource[ord].order_style = orderDoneStyle;

              //------ update in Local BD
              localDB.updateLocalServerDBs(localDB.tablesLocalDB.orders.tableName,  orderNum, {order_style: orderDoneStyle});
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
          var ordersQty = HistoryStor.history.orders.length,
              newOrderCopy;

          for(var ord = 0; ord < ordersQty; ord++) {
            if(HistoryStor.history.orders[ord].id === orderNum) {
              newOrderCopy = angular.copy(HistoryStor.history.orders[ord]);
            }
          }
          newOrderCopy.id = MainServ.createOrderID();
          newOrderCopy.order_number = 0;
          newOrderCopy.order_hz = '---';
          newOrderCopy.created = new Date();
          newOrderCopy.modified = new Date();

          localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.orders.tableName, newOrderCopy).then(function(respond) {
            if(respond.status) {
              newOrderCopy.order_number = respond.order_number;
            }
            //---- save new order
            HistoryStor.history.orders.push(newOrderCopy);
            HistoryStor.history.ordersSource.push(newOrderCopy);
            //---- save new order in LocalDB
            localDB.insertRowLocalDB(newOrderCopy, localDB.tablesLocalDB.orders.tableName);
          });

          //------ copy all Products of this order
          copyOrderElements(orderNum, newOrderCopy.id, localDB.tablesLocalDB.order_products.tableName);

          //------ copy all AddElements of this order
          copyOrderElements(orderNum, newOrderCopy.id, localDB.tablesLocalDB.order_addelements.tableName);
        }
      }



      function copyOrderElements(oldOrderNum, newOrderNum, nameTableDB) {
        //------ Download elements of order from localDB
        localDB.selectLocalDB(nameTableDB, {'order_id': oldOrderNum}).then(function(result) {
//          console.log('result+++++', result);
          if(result.length) {
            var allElements = angular.copy(result),
                allElemQty = allElements.length,
                i = 0;

            if (allElemQty > 0) {
              //-------- set new orderId in all elements of order
              for (; i < allElemQty; i++) {
                delete allElements[i].id;
                allElements[i].modified = new Date();
                allElements[i].order_id = newOrderNum;

                //-------- insert all elements in LocalDB
                localDB.insertRowLocalDB(allElements[i], nameTableDB);
                localDB.insertServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, nameTableDB, allElements[i]);
              }
            }

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
            if(orderList[orderListQty].id === orderNum) {
              orderList.splice(orderListQty, 1);
              orderListSource.splice(orderListQty, 1);
              break;
            }
          }
          //------ if no more orders
           if(!orderList.length) {
             HistoryStor.history.isEmptyResult = 1;
           }

          //------- delete order/draft and all its elements in LocalDB
          MainServ.deleteOrderInDB(orderNum);
          //------- delet order in Server
          if(orderType) {
            localDB.deleteOrderServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, orderNum);
          }
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
        if(HistoryStor.history.orders[ordersQty].id === orderNum) {
          angular.extend(OrderStor.order, HistoryStor.history.orders[ordersQty]);
          CartStor.fillOrderForm();
        }
      }
      OrderStor.order.order_date = new Date(OrderStor.order.order_date).getTime();
      OrderStor.order.delivery_date = new Date(OrderStor.order.delivery_date).getTime();
      OrderStor.order.new_delivery_date = new Date(OrderStor.order.new_delivery_date).getTime();
      setOrderOptions(1, OrderStor.order.floor_id, GlobalStor.global.floorData);
      setOrderOptions(2, OrderStor.order.mounting_id, GlobalStor.global.assemblingData);
      setOrderOptions(3, OrderStor.order.instalment_id, GlobalStor.global.instalmentsData);

      delete OrderStor.order.additional_payment;
      delete OrderStor.order.created;
      delete OrderStor.order.sended;
      delete OrderStor.order.state_to;
      delete OrderStor.order.state_buch;
      delete OrderStor.order.batch;
      delete OrderStor.order.base_price;
      delete OrderStor.order.factory_margin;
      delete OrderStor.order.purchase_price;
      delete OrderStor.order.sale_price;
      delete OrderStor.order.modified;

      //------ Download All Products of edited Order
      downloadProducts().then(function() {
        //------ Download All Add Elements from LocalDB
        downloadAddElements().then(function () {
          GlobalStor.global.isConfigMenu = 1;
          GlobalStor.global.isNavMenu = 0;
          //------- set previos Page
          GeneralServ.setPreviosPage();
          GlobalStor.global.isLoader = 0;
//          console.warn('ORDER ====', OrderStor.order);
          $location.path('/cart');
        });
      });

    }


    function setOrderOptions(param, id, data) {
      if(id) {
        var dataQty = data.length;
        while(--dataQty > -1) {
          if(data[dataQty].id === id) {
            switch(param) {
              case 1:
                OrderStor.order.floorName = angular.copy(data[dataQty].name);
                break;
              case 2:
                OrderStor.order.mountingName = angular.copy(data[dataQty].name);
                break;
              case 3:
                OrderStor.order.selectedInstalmentPeriod = angular.copy(data[dataQty].name);
                OrderStor.order.selectedInstalmentPercent = angular.copy(data[dataQty].value);
                break;
            }
          }
        }
      }
    }


    //------ Download All Products Data for Order
    function downloadProducts() {
      var deferred = $q.defer();

      localDB.selectLocalDB(localDB.tablesLocalDB.order_products.tableName, {'order_id': GlobalStor.global.orderEditNumber}).then(function(products) {
        if(products.length) {

          //------------- parsing All Templates Source and Icons for Order
          var productPromises = products.map(function(prod) {
            var defer1 = $q.defer(),
                tempProd = ProductStor.setDefaultProduct();
            angular.extend(tempProd, prod);
            delete tempProd.id;
            delete tempProd.modified;

            //----- checking product with design or only addElements
            if(!tempProd.is_addelem_only) {
              //----- parsing design from string to object
              tempProd.template_source = JSON.parse(tempProd.template_source);

              //----- find depths and build design icon
              MainServ.setCurrentProfile(tempProd, tempProd.profile_id).then(function(){
                if(tempProd.glass_id) {
                  var glassIDs = tempProd.glass_id.split(', '),
                      glassIDsQty = glassIDs.length;
                  if(glassIDsQty) {
                    while(--glassIDsQty > -1) {
                      setGlassXOrder(tempProd, glassIDs[glassIDsQty]*1);
                    }
                  }
                }
                GlobalStor.global.isSashesInTemplate = MainServ.checkSashInTemplate(tempProd);
                MainServ.setCurrentHardware(tempProd, tempProd.hardware_id);
                setLaminationXOrder(tempProd);
                defer1.resolve(tempProd);
              });

            } else {
              defer1.resolve(1);
            }
            return defer1.promise;
          });

          $q.all(productPromises).then(function(data) {

            var iconPromise = data.map(function(item) {
              var deferIcon = $q.defer();
              SVGServ.createSVGTemplateIcon(item.template_source, item.profileDepths).then(function(data) {
                item.templateIcon = data;
                delete item.profile_id;
                delete item.glass_id;
                delete item.hardware_id;

                //----- set price Discounts
                item.addelemPriceDis = GeneralServ.setPriceDis(item.addelem_price, OrderStor.order.discount_addelem);
                item.productPriceDis = (GeneralServ.setPriceDis(item.template_price, OrderStor.order.discount_construct) + item.addelemPriceDis);

                OrderStor.order.products.push(item);
                deferIcon.resolve(1);
              });
              return deferIcon.promise;
            });

            deferred.resolve($q.all(iconPromise));
          });

        } else {
          deferred.reject(products);
        }
      });
      return deferred.promise;
    }



    function setGlassXOrder(product, id) {
      //----- set default glass in ProductStor
      var tempGlassArr = GlobalStor.global.glassesAll.filter(function(item) {
        return item.profileId === product.profile.id;
      });
      //      console.log('tempGlassArr = ', tempGlassArr);
      if(tempGlassArr.length) {
        product.glass.unshift(MainServ.fineItemById(id, tempGlassArr[0].glasses));
      }

    }


    function setLaminationXOrder(product) {
      if(product.lamination_in_id) {
        var lamInQty = GlobalStor.global.laminationsIn.length;
        while(--lamInQty > -1) {
          if(GlobalStor.global.laminationsIn[lamInQty].lamination_type_id === product.lamination_in_id) {
            product.laminationInName = angular.copy(GlobalStor.global.laminationsIn[lamInQty].name);
          }
        }
      }
      if(product.lamination_out_id) {
        var lamOutQty = GlobalStor.global.laminationsOut.length;
        while(--lamOutQty > -1) {
          if(GlobalStor.global.laminationsOut[lamOutQty].lamination_type_id === product.lamination_out_id) {
            product.laminationOutName = angular.copy(GlobalStor.global.laminationsOut[lamOutQty].name);
          }
        }
      }
    }


    //------ Download All Add Elements from LocalDB
    function downloadAddElements() {
      var deferred = $q.defer();
      localDB.selectLocalDB(localDB.tablesLocalDB.order_addelements.tableName, {'order_id': GlobalStor.global.orderEditNumber}).then(function(result) {
        var allAddElemQty = result.length,
            orderProductsQty = OrderStor.order.products.length;

        if(allAddElemQty) {
          while(--allAddElemQty > -1) {
            for(var prod = 0; prod < orderProductsQty; prod++) {
              if(result[allAddElemQty].product_id === OrderStor.order.products[prod].product_id) {
                result[allAddElemQty].id = angular.copy(result[allAddElemQty].element_id);
                delete result[allAddElemQty].element_id;
                delete result[allAddElemQty].modified;

                result[allAddElemQty].elementPriceDis = GeneralServ.setPriceDis(result[allAddElemQty].element_price, OrderStor.order.discount_addelem);
                OrderStor.order.products[prod].chosenAddElements[result[allAddElemQty].element_type].push(result[allAddElemQty]);
                if(!allAddElemQty) {
                  deferred.resolve(1);
                }
              }
            }
          }

        } else {
          deferred.resolve(1);
        }
      });
      return deferred.promise;
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
      localDB.selectLocalDB(localDB.tablesLocalDB.orders.tableName, {'order_type': 0}).then(function(drafts) {
        if(drafts.length) {
          HistoryStor.history.draftsSource = angular.copy(drafts);
          HistoryStor.history.drafts = angular.copy(drafts);
        } else {
          HistoryStor.history.isEmptyResultDraft = 1;
        }
      });
    }




    //============= HISTORY TOOLS ============//

    //=========== Searching

    function orderSearching() {
      HistoryStor.history.isOrderSearch = 1;
      HistoryStor.history.isOrderDate = 0;
      HistoryStor.history.isOrderSort = 0;
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
        HistoryStor.history.isOrderSortDraft = 0;

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
        HistoryStor.history.isOrderSearch = 0;
        HistoryStor.history.isOrderSort = 0;
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
          HistoryStor.history.isStartDateDraft  = 1;
          HistoryStor.history.isFinishDateDraft  = 0;
          HistoryStor.history.isAllPeriodDraft  = 0;
        } else if (dataType === 'finish-date' && !HistoryStor.history.isFinishDateDraft ) {
          HistoryStor.history.isStartDateDraft  = 0;
          HistoryStor.history.isFinishDateDraft  = 1;
          HistoryStor.history.isAllPeriodDraft  = 0;
        } else if (dataType === 'full-date' && !HistoryStor.history.isAllPeriodDraft ) {
          HistoryStor.history.isStartDateDraft  = 0;
          HistoryStor.history.isFinishDateDraft  = 0;
          HistoryStor.history.isAllPeriodDraft  = 1;
          HistoryStor.history.startDateDraft  = '';
          HistoryStor.history.finishDateDraft  = '';
          HistoryStor.history.drafts = angular.copy(HistoryStor.history.draftsSource);
        } else {
          HistoryStor.history.isStartDateDraft  = 0;
          HistoryStor.history.isFinishDateDraft  = 0;
          HistoryStor.history.isAllPeriodDraft = 0;
        }
      } else {
        if (dataType === 'start-date' && !HistoryStor.history.isStartDate) {
          HistoryStor.history.isStartDate = 1;
          HistoryStor.history.isFinishDate = 0;
          HistoryStor.history.isAllPeriod = 0;
        } else if (dataType === 'finish-date' && !HistoryStor.history.isFinishDate) {
          HistoryStor.history.isStartDate = 0;
          HistoryStor.history.isFinishDate = 1;
          HistoryStor.history.isAllPeriod = 0;
        } else if (dataType === 'full-date' && !HistoryStor.history.isAllPeriod) {
          HistoryStor.history.isStartDate = 0;
          HistoryStor.history.isFinishDate = 0;
          HistoryStor.history.isAllPeriod = 1;
          HistoryStor.history.startDate = '';
          HistoryStor.history.finishDate = '';
          HistoryStor.history.orders = angular.copy(HistoryStor.history.ordersSource);
        } else {
          HistoryStor.history.isStartDate = 0;
          HistoryStor.history.isFinishDate = 0;
          HistoryStor.history.isAllPeriod = 0;
        }
      }
    }




    //=========== Sorting

    //------- show Sorting tool dialog
    function orderSorting() {
      if(HistoryStor.history.isDraftView) {
        HistoryStor.history.isOrderSortDraft = !HistoryStor.history.isOrderSortDraft;
        HistoryStor.history.isOrderDateDraft = 0;
      } else {
        HistoryStor.history.isOrderSort = !HistoryStor.history.isOrderSort;
        HistoryStor.history.isOrderSearch = 0;
        HistoryStor.history.isOrderDate = 0;
      }
    }


    //------ Select sorting type item in list
    function sortingInit(sortType) {
      if(HistoryStor.history.isDraftView) {

        if(HistoryStor.history.isSortTypeDraft === sortType) {
          HistoryStor.history.isSortTypeDraft = 0;
          HistoryStor.history.reverseDraft = 1;
        } else {
          HistoryStor.history.isSortTypeDraft = sortType;

          if(HistoryStor.history.isSortTypeDraft === 'first') {
            HistoryStor.history.reverseDraft = 1;
          }
          if(HistoryStor.history.isSortTypeDraft === 'last') {
            HistoryStor.history.reverseDraft = 0;
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
            HistoryStor.history.isCurrentOrdersHide = 0;
            HistoryStor.history.isWaitOrdersHide = 1;
            HistoryStor.history.isDoneOrdersHide = 1;
            checkExestingOrderType('order', 'credit');
          }
          if (HistoryStor.history.isSortType === 'wait-order') {
            HistoryStor.history.isCurrentOrdersHide = 1;
            HistoryStor.history.isWaitOrdersHide = 0;
            HistoryStor.history.isDoneOrdersHide = 1;
            checkExestingOrderType(orderMasterStyle);
          }
          if (HistoryStor.history.isSortType === 'done-order') {
            HistoryStor.history.isWaitOrdersHide = 1;
            HistoryStor.history.isCurrentOrdersHide = 1;
            HistoryStor.history.isDoneOrdersHide = 0;
            checkExestingOrderType(orderDoneStyle);
          }
        }
      }
    }



    function deSelectSortingType() {
      HistoryStor.history.isCurrentOrdersHide = 0;
      HistoryStor.history.isWaitOrdersHide = 0;
      HistoryStor.history.isDoneOrdersHide = 0;
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
        HistoryStor.history.isEmptyResult = 0;
      } else {
        HistoryStor.history.isEmptyResult = 1;
      }
    }



  }
})();
