(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .factory('HistoryServ',

      function ($location,
                $filter,
                $q,
                $http,
                globalConstants,
                localDB,
                $timeout,
                GeneralServ,
                MainServ,
                RecOrderServ,
                SVGServ,
                DesignServ,
                GlobalStor,
                OrderStor,
                ProductStor,
                UserStor,
                HistoryStor,
                CartStor,
                DesignStor,
                PrintServ) {
        /*jshint validthis:true */
        var thisFactory = this,
          orderMasterStyle = 'master',
          orderDoneStyle = 'done';
        var onlineMode;

        function getOnline() {
          $.get("http://api.steko.com.ua", function (data) {
            onlineMode = true;
            return true;
          })
            .fail(function () {
              onlineMode = false;
              return false;
            });
        }


        /**============ METHODS ================*/


        //------ go to current calculations
        function toCurrentCalculation() {
          //------- set previos Page
          GeneralServ.setPreviosPage();
          if (GlobalStor.global.isCreatedNewProduct && GlobalStor.global.isCreatedNewProject) {
            $location.path('/main');
          } else {
            //-------- CREATE NEW PROJECT
            MainServ.createNewProject();
          }
        }


        //------ Download complete Orders from localDB
        function downloadOrders() {
          localDB.selectLocalDB(localDB.tablesLocalDB.orders.tableName, {order_type: 1}).then(function (result) {
            var orders = angular.copy(result),
              orderQty = orders.length;
            HistoryStor.history.isEmptyResult = 0;
            if (orderQty) {
              while (--orderQty > -1) {
                orders[orderQty].created = new Date(orders[orderQty].created);
                orders[orderQty].delivery_date = new Date(orders[orderQty].delivery_date);
                orders[orderQty].new_delivery_date = new Date(orders[orderQty].new_delivery_date);
                orders[orderQty].order_date = new Date(orders[orderQty].order_date);
              }

              //noinspection JSAnnotator
              function sortNumber(a, b) {
                return b.order_date.getTime() - a.order_date.getTime();
              }

              HistoryStor.history.orders = angular.copy(orders.sort(sortNumber));
              HistoryStor.history.ordersSource = angular.copy(orders.sort(sortNumber));
              GlobalStor.global.isLoader = 0;
//          console.info('HISTORY orders+++++', HistoryStor.history.orders);
              //----- max day for calendar-scroll
//          HistoryStor.history.maxDeliveryDateOrder = getOrderMaxDate(HistoryStor.history.orders);
//          console.log('maxDeliveryDateOrder =', HistoryStor.history.maxDeliveryDateOrder);
            } else {
              HistoryStor.history.isEmptyResult = 1;
              GlobalStor.global.isLoader = 0;
            }
          });
        }

        //------- defind Order MaxDate
//    function getOrderMaxDate(orders) {
//      var ordersDateArr = orders.map(function(item) {
//            return item.new_delivery_date;
//          }).sort(function (a, b) {
//            return b - a;
//          });
//        //var oldDateArr = orders[it].deliveryDate.split('.');
//        //var newDateStr = Date.parse(oldDateArr[1]+'/'+oldDateArr[0]+'/'+oldDateArr[2]);
//        //var newDateStr = Date.parse(oldDateArr[2], oldDateArr[1], oldDateArr[0]);
//      return ordersDateArr[0];
//    }


        /**========== Send Order to Factory ========*/

        function orderToFactory(orderStyle, orderNum) {
          function sendOrder() {
            var ordersQty = HistoryStor.history.orders.length, ord;
            for (ord = 0; ord < ordersQty; ord += 1) {
              if (HistoryStor.history.orders[ord].id === orderNum) {
                //-------- change style for order
                HistoryStor.history.orders[ord].order_style = orderDoneStyle;
                HistoryStor.history.ordersSource[ord].order_style = orderDoneStyle;
                //------ update in Local BD
                localDB.updateLocalServerDBs(
                  localDB.tablesLocalDB.orders.tableName, orderNum, {order_style: orderDoneStyle, sended: new Date()}
                );
              }
            }
            GlobalStor.global.isLoader = 0;
          }

          /** check user */
          if (orderStyle !== orderMasterStyle && UserStor.userInfo.code_sync.length && UserStor.userInfo.code_sync !== 'null') {
            GeneralServ.confirmAlert(
              $filter('translate')('common_words.SEND_ORDER_TITLE'),
              $filter('translate')('common_words.SEND_ORDER_TXT'),
              sendOrder
            );
          }
          GlobalStor.global.isLoader = 0;
        }


        var onlineMode;
        $.get(globalConstants.serverIP, function (data) {
          onlineMode = true;
        })
          .fail(function () {
            onlineMode = false;
          });

        /**========= make Order Copy =========*/
        function sendOrderToFactory(orderStyle, orderNum) {
          if (onlineMode && navigator.onLine) {
            GlobalStor.global.isLoader = 1
            var check = [];
            check = HistoryStor.history.firstClick.filter(function (item) {
              return item === orderNum
            });
            if (check.length !== 0) {
              //console.info('second click')
              GlobalStor.global.isLoader = 0;
              for (var x = 0; x < check.length; x += 1) {
                if (check[x] !== orderNum) {
                  HistoryStor.history.firstClick.push(orderNum);
                }
              }
            } else {
              //console.info('first click')
              HistoryStor.history.firstClick.push(orderNum);
              var xhr = new XMLHttpRequest();
              xhr.open('GET', globalConstants.serverIP + '/api/export?login=' + UserStor.userInfo.phone + '&access_token=' + UserStor.userInfo.device_code + '&orderId=' + orderNum, false);
              xhr.send();
              if (xhr.status === 200) {
                if (JSON.parse(xhr.response).status === true) {
                  orderToFactory(orderStyle, orderNum);
                  HistoryStor.history.resAPI = orderNum + 'doneOrder';
                  GlobalStor.global.isLoader = 0;
                } else {
                  GlobalStor.global.textErrorOrder = JSON.parse(xhr.response).error;
                  GlobalStor.global.isLoader = 0;
                  HistoryStor.history.resAPI = orderNum + 'errorOrder';
                }
              } else {
                GlobalStor.global.isLoader = 0
                HistoryStor.history.resAPI = orderNum + 'errorOrder';
              }
            }
          } else {

            $.get(globalConstants.serverIP, function (data) {
              onlineMode = true;
            })
              .fail(function () {
                onlineMode = false;
                alert("");
              });
            GeneralServ.infoAlert(
              $filter('translate')('login.OFFLINE'),
              $filter('translate')('login.OFFLINE_INFO')
            );
          }
        }


        function reqResult() {
          if (onlineMode && navigator.onLine) {
            synchronizeOrders().then(function () {
              GlobalStor.global.isLoader = 1;
              var xhr = new XMLHttpRequest();
              var res;
              var obj = {
                order_products: localDB.tablesLocalDB.order_products,
                orders: localDB.tablesLocalDB.orders,
                order_addelements: localDB.tablesLocalDB.order_addelements
              };
              var url = 'http://admin.steko.com.ua/api/orders?login=' + UserStor.userInfo.phone + '&access_token=' + UserStor.userInfo.device_code + '&type=' + HistoryStor.history.resTimeBox.namb;
              xhr.open('GET', url, false);
              xhr.send();
              if (xhr.status != 200) {
                console.info(xhr.status + ': ' + xhr.statusText);
                GlobalStor.global.isLoader = 0;
              } else {
                localDB.cleanLocalDB(obj).then(function (data) {
                  if (data) {
                    localDB.createTablesLocalDB(obj).then(function (data) {
                      if (data) {
                        res = JSON.parse(xhr.response);
                        res.tables.order_products.fields.splice(1, 1);
                        res.tables.order_products.fields.splice(2, 1);
                        res.tables.order_products.fields.splice(6, 1);
                        res.tables.order_products.fields.splice(27, 1);
                        res.tables.orders.fields.splice(1, 1);
                        for (var x = 0; x < res.tables.order_products.rows.length; x += 1) {
                          res.tables.order_products.rows[x].splice(1, 1);
                          res.tables.order_products.rows[x].splice(2, 1);
                          res.tables.order_products.rows[x].splice(6, 1);
                          res.tables.order_products.rows[x].splice(27, 1);
                        }
                        ;
                        for (var x = 0; x < res.tables.orders.rows.length; x += 1) {
                          res.tables.orders.rows[x].splice(1, 1);
                          (res.tables.orders.rows[x][24] !== "1970-01-01T00:00:00.000Z") ? res.tables.orders.rows[x][55] = "done" : test(res.tables.orders.rows[x][55]);
                          (res.tables.orders.rows[x][25] !== "1970-01-01T00:00:00.000Z") ? res.tables.orders.rows[x][55] = "done" : test(res.tables.orders.rows[x][55]);
                          (res.tables.orders.rows[x][26] !== "1970-01-01T00:00:00.000Z") ? res.tables.orders.rows[x][55] = "done" : test(res.tables.orders.rows[x][55]);
                        }
                        ;
                        //noinspection JSAnnotator
                        function test(item) {
                          if (item === "done") {
                            return item = "order";
                          } else {
                            return item;
                          }
                        };
                        localDB.insertTablesLocalDB(res).then(function () {
                          downloadOrders();
                        });
                      }
                    });
                  }
                });
              }
            });
          } else {

            $.get(globalConstants.serverIP, function (data) {
              onlineMode = true;
            })
              .fail(function () {
                onlineMode = false;
                alert("");
              });
            GeneralServ.infoAlert(
              $filter('translate')('login.OFFLINE'),
              $filter('translate')('login.OFFLINE_INFO')
            );
          }

        }

        function deleteOption() {
          $("#deleteOption").remove();
        }

        function makeOrderCopy(orderStyle, orderNum, typeOrder) {
          GlobalStor.global.isLoader = 1;
          HistoryStor.history.orderOk = 0;
          /*      GlobalStor.global.isBox = !GlobalStor.global.isBox;*/
          if (onlineMode && navigator.onLine) {
            HistoryStor.history.orderEditNumber = orderNum;
          }
          else {
            HistoryStor.history.orderEditNumber = 0;
          }
          /*        dloadProducts();
           dloadAddElements();
           dloadOrder();
           orderItem(); */
          function copyOrderElements(oldOrderNum, newOrderNum, nameTableDB) {
            //------ Download elements of order from localDB
            localDB.selectLocalDB(nameTableDB, {'order_id': oldOrderNum}).then(function (result) {
              //          console.log('result+++++', result);
              if (result.length) {
                var allElements = angular.copy(result),
                  allElemQty = allElements.length,
                  i;

                if (allElemQty > 0) {
                  //-------- set new orderId in all elements of order
                  for (i = 0; i < allElemQty; i += 1) {
                    delete allElements[i].id;
                    allElements[i].modified = new Date();
                    allElements[i].order_id = newOrderNum;

                    //-------- insert all elements in LocalDB
                    localDB.insertRowLocalDB(allElements[i], nameTableDB);
                    localDB.insertServer(
                      UserStor.userInfo.phone, UserStor.userInfo.device_code, nameTableDB, allElements[i]
                    );
                  }
                }

              } else {
                console.log('Empty result = ', result);
              }
            });
          }

          function copyOrder() {
            //---- new order number
            var ordersQty = HistoryStor.history.orders.length,
              newOrderCopy, ord;

            for (ord = 0; ord < ordersQty; ord += 1) {
              if (HistoryStor.history.orders[ord].id === orderNum) {
                newOrderCopy = angular.copy(HistoryStor.history.orders[ord]);
              }
            }
            newOrderCopy.id = MainServ.createOrderID();
            newOrderCopy.order_number = 0;
            newOrderCopy.order_hz = '---';
            newOrderCopy.sended = new Date(0);
            newOrderCopy.state_to = new Date(0);
            newOrderCopy.state_buch = new Date(0);
            newOrderCopy.created = new Date();
            newOrderCopy.order_date = new Date();
            newOrderCopy.modified = new Date();
            newOrderCopy.order_style = 'order';
            (typeof newOrderCopy.customer_age === "number") ? newOrderCopy.customer_age = newOrderCopy.customer_age : newOrderCopy.customer_age = 0;
            (typeof newOrderCopy.customer_education === "number") ? newOrderCopy.customer_education = newOrderCopy.customer_education : newOrderCopy.customer_education = 0;
            (typeof newOrderCopy.customer_occupation === "number") ? newOrderCopy.customer_occupation = newOrderCopy.customer_occupation : newOrderCopy.customer_occupation = 0;
            (typeof newOrderCopy.customer_infoSource === "number") ? newOrderCopy.customer_infoSource = newOrderCopy.customer_infoSource : newOrderCopy.customer_infoSource = 0;
            localDB.insertServer(
              UserStor.userInfo.phone, UserStor.userInfo.device_code, localDB.tablesLocalDB.orders.tableName, newOrderCopy
            ).then(function (respond) {
              if (respond !== null) {
                if (respond.status) {
                  newOrderCopy.order_number = respond.order_number;
                }
              }
              else {
                newOrderCopy.order_number = 0;
              }
              //---- save new order
              HistoryStor.history.orders.push(newOrderCopy);
              HistoryStor.history.ordersSource.push(newOrderCopy);
              //---- save new order in LocalDB
              localDB.insertRowLocalDB(newOrderCopy, localDB.tablesLocalDB.orders.tableName);
              function sortNumber(a, b) {
                return b.order_date.getTime() - a.order_date.getTime();
              }

              HistoryStor.history.orders = angular.copy(HistoryStor.history.ordersSource.sort(sortNumber));
              HistoryStor.history.ordersSource = angular.copy(HistoryStor.history.orders);
              GlobalStor.global.isLoader = 0;
            });

            //------ copy all Products of this order
            copyOrderElements(orderNum, newOrderCopy.id, localDB.tablesLocalDB.order_products.tableName);

            //------ copy all AddElements of this order
            copyOrderElements(orderNum, newOrderCopy.id, localDB.tablesLocalDB.order_addelements.tableName);
            //GlobalStor.global.isBox = !GlobalStor.global.isBox;
          }

          /*      function editOrder() {
           GlobalStor.global.isEditBox = !GlobalStor.global.isEditBox;
           RecOrderServ.box();
           }*/

          /*      if(orderStyle !== orderMasterStyle) {
           GeneralServ.confirmAlert(
           $filter('translate')('common_words.EDIT_COPY_TXT'),
           $filter('translate')('  '),
           editOrder
           );
           GeneralServ.confirmPath(
           copyOrder
           );
           }*/
          copyOrder(); // временноsendOrderToFactory
        }

        function orderItem() {
          var deferred = $q.defer(), index;
          dloadOrder().then(function (data) {
            HistoryStor.history.isBoxArray = angular.copy(data[0]);
            dloadProducts().then(function (data) {
              HistoryStor.history.isBoxArray.products = angular.copy(data);
              for (var x = 0; x < HistoryStor.history.isBoxArray.products.length; x += 1) {
                HistoryStor.history.isBoxArray.products[x].addElementDATA = [
                  [], // 0 - grids
                  [], // 1 - visors
                  [], // 2 - spillways
                  [], // 3 - outSlope
                  [], // 4 - louvers
                  [], // 5 - inSlope
                  [], // 6 - connectors
                  [], // 7 - fans
                  [], // 8 - windowSill
                  [], // 9 - handles
                  [], // 10 - others
                  [], // 11 - shutters
                  [], // 12 - grating
                  [], // 13 - blind
                  [], // 14 - shut
                  [], // 15 - grat
                  [], // 16 - vis
                  []  // 17 - spil
                ];
              }
              dloadAddElements().then(function (data) {
                if (data) {
                  for (var i = 0; i < data.length; i += 1) {
                    for (var x = 0; x < HistoryStor.history.isBoxArray.products.length; x += 1) {
                      if (data[i].product_id === HistoryStor.history.isBoxArray.products[x].product_id) {
                        index = data[i].element_type;
                        data[i].id = angular.copy(data[i].element_id);
                        delete data[i].element_id;
                        delete data[i].modified;
                        data[i].elementPriceDis = GeneralServ.setPriceDis(
                          data[i].element_price, HistoryStor.history.isBoxArray.discount_addelem
                        );
                        data[i].list_group_id = GeneralServ.addElementDATA[index].id;
                        HistoryStor.history.isBoxArray.products[x].addElementDATA[index].push(data[i]);
                        if (!i) {
                          deferred.resolve(1);
                        }
                      }
                    }
                  }
                } else {
                  deferred.resolve(1);
                }
              });
            });
          });
          return deferred.promise;
        }


        /**========== Delete order ==========*/

        function clickDeleteOrder(orderType, orderNum) {
          //event.preventDefault();
          //event.stopPropagation();

          function deleteOrder() {
            var orderList, orderListSource;
            //-------- delete order
            if (orderType) {
              orderList = HistoryStor.history.orders;
              orderListSource = HistoryStor.history.ordersSource;
              //-------- delete draft
            } else {
              orderList = HistoryStor.history.drafts;
              orderListSource = HistoryStor.history.draftsSource;
            }
            var orderListQty = orderList.length;
            while (--orderListQty > -1) {
              if (orderList[orderListQty].id === orderNum) {
                orderList.splice(orderListQty, 1);
                orderListSource.splice(orderListQty, 1);
                break;
              }
            }
            //------ if no more orders
            if (!orderList.length) {
              HistoryStor.history.isEmptyResult = 1;
            }

            //------- delete order/draft and all its elements in LocalDB
            MainServ.deleteOrderInDB(orderNum);
            //------- delet order in Server
            if (orderType) {
              localDB.deleteOrderServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, orderNum);
            }
          }

          GeneralServ.confirmAlert(
            $filter('translate')('common_words.DELETE_ORDER_TITLE'),
            $filter('translate')('common_words.DELETE_ORDER_TXT'),
            deleteOrder
          );

        }


        /** =========== Edit Order & Draft =========== */

        function setOrderOptions(param, id, data) {
          if (id) {
            var dataQty = data.length;
            while (--dataQty > -1) {
              if (data[dataQty].id === id) {
                switch (param) {
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

        function setGlassXOrder(product, id) {
          //----- set default glass in ProductStor
          var tempGlassArr = GlobalStor.global.glassesAll.filter(function (item) {
            return item.profileId === product.profile.id;
          });
          //      console.log('tempGlassArr = ', tempGlassArr);
          if (tempGlassArr.length) {
            product.glass.unshift(MainServ.fineItemById(id, tempGlassArr[0].glasses));
          }

        }


        //------ Download All Products Data for Order
        function downloadProducts(print) {
          var deferred = $q.defer();
          var printProd = [];
          localDB.selectLocalDB(
            localDB.tablesLocalDB.order_products.tableName, {'order_id': GlobalStor.global.orderEditNumber}
          ).then(function (result) {
            var products = angular.copy(result);
            if (products.length) {
              //------------- parsing All Templates Source and Icons for Order
              var productPromises = products.map(function (prod) {
                var defer1 = $q.defer(),
                  tempProd = ProductStor.setDefaultProduct(),
                  tempProfileId;
                angular.extend(tempProd, prod);
                delete tempProd.id;
                delete tempProd.modified;
                //----- checking product with design or only addElements
                if (!tempProd.is_addelem_only) {
                  //----- parsing design from string to object
                  tempProd.template_source = JSON.parse(tempProd.template_source);
                  if (tempProd.template_source.beads) {
                    tempProd.beadsData = angular.copy(tempProd.template_source.beads);
                  }
                  if (tempProd.construction_type === 4) {
                    tempProfileId = tempProd.template_source.profile_window_id;
                  } else {
                    tempProfileId = tempProd.profile_id;
                  }

                  //----- find depths and build design icon
                  MainServ.setCurrentProfile(tempProd, tempProfileId).then(function () {
                    if (tempProd.glass_id) {
                      var glassIDs = tempProd.glass_id.split(', '),
                        glassIDsQty = glassIDs.length;
                      if (glassIDsQty) {
                        while (--glassIDsQty > -1) {
                          setGlassXOrder(tempProd, +glassIDs[glassIDsQty]);
                        }
                      }
                    }
                    GlobalStor.global.isSashesInTemplate = MainServ.checkSashInTemplate(tempProd.template_source);
                    (tempProd.construction_type !== 4) ? MainServ.setCurrentHardware(tempProd, tempProd.hardware_id) :
                      MainServ.setCurrentHardware(tempProd, tempProd.template_source.hardware_id);
                    MainServ.setCurrLamination(tempProd, tempProd.lamination_id);
                    delete tempProd.lamination_id;
                    delete tempProd.lamination_in_id;
                    delete tempProd.lamination_out_id;
                    defer1.resolve(tempProd);
                  });
                  if (tempProd.construction_type === 4) {
                    if (GlobalStor.global.noDoorExist) {
                      //-------- show alert than door not existed
                      DesignStor.design.isNoDoors = 1;
                      defer1.reject(1);
                    } else {
                      //------ cleaning DesignStor
                      DesignStor.design = DesignStor.setDefaultDesign();
                    }
                  }
                } else {
                  defer1.resolve(tempProd);
                }
                return defer1.promise;
              });

              $q.all(productPromises).then(function (data) {

                var iconPromise = data.map(function (item) {
                  var deferIcon = $q.defer();
                  //----- checking product with design or only addElements
                  if (item.is_addelem_only) {
                    //----- set price Discounts
                    item.addelemPriceDis = GeneralServ.setPriceDis(item.addelem_price, OrderStor.order.discount_addelem);
                    item.productPriceDis = (GeneralServ.setPriceDis(
                      item.template_price, OrderStor.order.discount_construct
                    ) + item.addelemPriceDis);

                    OrderStor.order.products.push(item);
                    deferIcon.resolve(1);
                  } else {
                    SVGServ.createSVGTemplateIcon(item.template_source, item.profileDepths).then(function (data) {
                      item.templateIcon = data;
                      SVGServ.createSVGTemplate(item.template_source, item.profileDepths).then(function (data2) {
                        item.template = data2;
                        delete item.profile_id;
                        delete item.glass_id;
                        delete item.hardware_id;

                        //----- set price Discounts
                        item.addelemPriceDis = GeneralServ.setPriceDis(item.addelem_price, OrderStor.order.discount_addelem);
                        item.productPriceDis = (GeneralServ.setPriceDis(
                          item.template_price, OrderStor.order.discount_construct
                        ) + item.addelemPriceDis);
                        if (print) {
                          printProd.push(item);
                          deferIcon.resolve(printProd);
                        } else {
                          OrderStor.order.products.push(item);
                          deferIcon.resolve(1);
                        }
                        //console.log(item, 'item')
                      });
                    });
                  }
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


        function dloadProducts() {
          var deferred = $q.defer();
          localDB.selectLocalDB(
            localDB.tablesLocalDB.order_products.tableName, {
              'order_id': HistoryStor.history.orderEditNumber
            }).then(function (result) {
            //console.log('result' , result)
            deferred.resolve(result);
          });
          return deferred.promise;
        }

        function dloadAddElements() {
          var deferred = $q.defer();
          localDB.selectLocalDB(
            localDB.tablesLocalDB.order_addelements.tableName, {'order_id': HistoryStor.history.orderEditNumber}
          ).then(function (result) {
            //console.log('result' , result)
            deferred.resolve(result);
          });
          return deferred.promise;
        }

        function dloadOrder() {
          var deferred = $q.defer();
          localDB.selectLocalDB(
            localDB.tablesLocalDB.orders.tableName, {
              'id': HistoryStor.history.orderEditNumber
            },
            'order_type, order_style, discount_construct, discount_addelem, discount_construct_max, discount_addelem_max, customer_address, customer_age, customer_city, customer_city_id, customer_education, customer_flat, customer_floor, customer_house, customer_infoSource, customer_location, customer_name, customer_occupation, customer_phone, customer_sex'
          ).then(function (result) {
            //console.log('result' , result)
            deferred.resolve(result);
          });
          return deferred.promise;
        }

        //------ Download All Add Elements from LocalDB
        function downloadAddElements(addEl) {
          var deferred = $q.defer();
          var orderAddElem = [];
          localDB.selectLocalDB(
            localDB.tablesLocalDB.order_addelements.tableName, {'order_id': GlobalStor.global.orderEditNumber}
          ).then(function (result) {
            var elementsAdd = angular.copy(result),
              addElementsAll = GlobalStor.global.addElementsAll,
              allAddElemQty = elementsAdd.length,
              orderProductsQty = OrderStor.order.products.length,
              prod, index;
            if (addEl) {
              deferred.resolve(elementsAdd);
            } else {
              for (var x = 0; x < allAddElemQty; x += 1) {
                for (var y = 0; y < addElementsAll[elementsAdd[x].element_type].elementsList.length; y += 1) {
                  for (var z = 0; z < addElementsAll[elementsAdd[x].element_type].elementsList[y].length; z += 1) {
                    if (elementsAdd[x].element_id === addElementsAll[elementsAdd[x].element_type].elementsList[y][z].id) {
                      if (elementsAdd[x].element_type !== 0) {
                        console.log("GlobalStor.global.addElementsAll", GlobalStor.global.addElementsAll);
                        elementsAdd[x].max_size = addElementsAll[elementsAdd[x].element_type].elementsList[y][z].max_size;
                        elementsAdd[x].parent_element_id = addElementsAll[elementsAdd[x].element_type].elementsList[y][z].parent_element_id;
                        elementsAdd[x].list_group_id = addElementsAll[elementsAdd[x].element_type].elementsList[y][z].list_group_id;
                        elementsAdd[x].list_type_id = addElementsAll[elementsAdd[x].element_type].elementsList[y][z].list_type_id;
                        break
                      }
                    }
                  }
                }
              }

              if (allAddElemQty) {
                while (--allAddElemQty > -1) {
                  for (prod = 0; prod < orderProductsQty; prod += 1) {
                    if (elementsAdd[allAddElemQty].product_id === OrderStor.order.products[prod].product_id) {
                      index = elementsAdd[allAddElemQty].element_type;
                      elementsAdd[allAddElemQty].id = angular.copy(elementsAdd[allAddElemQty].element_id);
                      delete elementsAdd[allAddElemQty].element_id;
                      delete elementsAdd[allAddElemQty].modified;
                      elementsAdd[allAddElemQty].elementPriceDis = GeneralServ.setPriceDis(
                        elementsAdd[allAddElemQty].element_price, OrderStor.order.discount_addelem
                      );
                      elementsAdd[allAddElemQty].list_group_id = GeneralServ.addElementDATA[index].id;
                      OrderStor.order.products[prod].chosenAddElements[index].push(elementsAdd[allAddElemQty]);
                      if (!allAddElemQty) {
                        deferred.resolve(1);
                      }
                    }
                  }
                }
                console.log("OrderStor.order.products", OrderStor.order.products);
              } else {
                deferred.resolve(1);
              }
            }
          });
          return deferred.promise;
        }


        function editOrder(typeOrder, orderNum) {
          GlobalStor.global.isLoader = 1;
          GlobalStor.global.orderEditNumber = orderNum;
          //----- cleaning order
          OrderStor.order = OrderStor.setDefaultOrder();

          var ordersQty = typeOrder ? HistoryStor.history.orders.length : HistoryStor.history.drafts.length;
          while (--ordersQty > -1) {
            if (typeOrder) {
              if (HistoryStor.history.orders[ordersQty].id === orderNum) {
                angular.extend(OrderStor.order, HistoryStor.history.orders[ordersQty]);
                CartStor.fillOrderForm();
              }
            } else {
              if (HistoryStor.history.drafts[ordersQty].id === orderNum) {
                angular.extend(OrderStor.order, HistoryStor.history.drafts[ordersQty]);
                CartStor.fillOrderForm();
              }
            }
          }
          OrderStor.order.order_date = new Date(OrderStor.order.order_date).getTime();
          OrderStor.order.delivery_date = new Date(OrderStor.order.delivery_date).getTime();
          OrderStor.order.new_delivery_date = new Date(OrderStor.order.new_delivery_date).getTime();
          OrderStor.order.order_edit = 1;
          setOrderOptions(1, OrderStor.order.floor_id, GlobalStor.global.supplyData);
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
          downloadProducts().then(function () {
            var products = OrderStor.order.products;


            async.eachSeries(products, calculate, function (err, result) {
              //------ Download All Add Elements from LocalDB
              downloadAddElements().then(function () {
                GlobalStor.global.isConfigMenu = 1;
                GlobalStor.global.isNavMenu = 0;
                //------- set previos Page
                GeneralServ.setPreviosPage();
                GlobalStor.global.isLoader = 0;
                //console.warn('ORDER ====', OrderStor.order);
                $location.path('/cart');
              });
            });

            function calculate(products, _cb) {
              async.waterfall([
                  function (_callback) {
                    if (products.construction_type === 4) {
                      DesignServ.setDoorConfigDefault(products).then(function (res) {
                        _callback();
                      });
                    } else {
                      _callback();
                    }
                  }
                ],
                function (err, result) {
                  if (err) {
                    //console.log('err', err)
                    return _cb(err);
                  }
                  _cb(null);
                });
            }
          });

        }


        //------ Download draft Orders from localDB
        function downloadDrafts() {
          localDB.selectLocalDB(localDB.tablesLocalDB.orders.tableName, {'order_type': 0}).then(function (result) {
            var drafts = angular.copy(result),
              draftQty = drafts.length;
//        console.log('draft =', drafts);
            HistoryStor.history.isEmptyResultDraft = 0;
            if (draftQty) {
              while (--draftQty > -1) {
                drafts[draftQty].created = new Date(drafts[draftQty].created);
                drafts[draftQty].delivery_date = new Date(drafts[draftQty].delivery_date);
                drafts[draftQty].new_delivery_date = new Date(drafts[draftQty].new_delivery_date);
                drafts[draftQty].order_date = new Date(drafts[draftQty].order_date);
              }
              HistoryStor.history.draftsSource = angular.copy(drafts);
              HistoryStor.history.drafts = angular.copy(drafts);
              //----- max day for calendar-scroll
//          HistoryStor.history.maxDeliveryDateOrder = getOrderMaxDate(HistoryStor.history.orders);
            } else {
              HistoryStor.history.isEmptyResultDraft = 1;
            }
          });
        }


        //------- Orders/Drafts View switcher
        function viewSwitching() {
          HistoryStor.history.isOrderDate = 0;
          HistoryStor.history.isOrderDateDraft = 0;
          HistoryStor.history.isDraftView = !HistoryStor.history.isDraftView;

          //------ Download Drafts from localDB in first open
          if (!HistoryStor.history.drafts.length) {
            downloadDrafts();
          }
        }

        //#
        function orderPrint(orderId) {
          /** check internet */
          if (navigator.onLine && onlineMode) {
            var domainLink = globalConstants.serverIP.split('api.').join(''),
              paramLink = orderId + '?userId=' + UserStor.userInfo.id;
            //printLink = domainLink + ':3002/orders/get-order-pdf/' + paramLink;
            var printLink = globalConstants.printIP + orderId + '?userId=' + UserStor.userInfo.id;
            GeneralServ.goToLink(printLink);
          } else {
            HistoryStor.history.orders.forEach(function (entry, index) {
              if (entry.id === orderId) {
                entry.modified = entry.modified.substr(0, 10);
                HistoryStor.history.historyID = index;
              }
            });

            GlobalStor.global.orderEditNumber = orderId;
            downloadProducts(1).then(function (result_prod) {
              var tmpSquare = 0;
              var tmpPerim = 0;
              HistoryStor.history.OrderPrintLength = result_prod.length;
              result_prod.forEach(function (item) {
                item.forEach(function (entry) {

                  if (!entry.is_addelem_only) {
                    tmpSquare += entry.template_square;
                    tmpPerim += (entry.template_height + entry.template_width) * 2;
                  }

                });
              });
              HistoryStor.history.OrderPrintSquare = tmpSquare;
              HistoryStor.history.OrderPrintPerimeter = tmpPerim / 1000;
              downloadAddElements(1).then(function (result_add) {
                if (result_add !== 0) {
                  result_add.forEach(function (entry) {
                    if (entry.element_height === 0) {
                      entry.element_width = "";
                      entry.element_height = "";
                    }
                    else {
                      entry.element_width = entry.element_width + " x ";
                      entry.element_height = entry.element_height + ",";
                    }
                  });
                }
                PrintServ.getProducts(result_prod, result_add);
              });

            })
          }
        }


        /**============= HISTORY TOOLS ============*/

        //=========== Searching

        function orderSearching() {
          HistoryStor.history.isOrderSearch = 1;
          HistoryStor.history.isOrderDate = 0;
          HistoryStor.history.isOrderSort = 0;
        }


        //=========== Filtering by Date

        //------- filtering orders by Dates
        function filteringByDate(obj, start, end) {
          var newObj, startDate, finishDate,
            t, objDate;
          if (start !== '' || end !== '') {
            newObj = angular.copy(obj);
            startDate = new Date(start).valueOf();
            finishDate = new Date(end).valueOf();
            if (start !== '' && end !== '' && startDate > finishDate) {
              return false;
            }
            for (t = newObj.length - 1; t >= 0; t -= 1) {
              objDate = new Date(newObj[t].created).valueOf();
              if (objDate < startDate || objDate > finishDate) {
                newObj.splice(t, 1);
              }
            }
            return newObj;
          } else {
            return false;
          }
        }

        //------- show Date filter tool dialog
        function orderDateSelecting() {
          var filterResult;
          //------ in Drafts
          if (HistoryStor.history.isDraftView) {
            if (HistoryStor.history.isOrderDateDraft) {
              //-------- filtering orders by selected date
              filterResult = filteringByDate(
                HistoryStor.history.draftsSource, HistoryStor.history.startDateDraft, HistoryStor.history.finishDateDraft
              );
              if (filterResult) {
                HistoryStor.history.drafts = filterResult;
              }
            }
            HistoryStor.history.isOrderDateDraft = !HistoryStor.history.isOrderDateDraft;
            HistoryStor.history.isOrderSortDraft = 0;

            //------ in Orders
          } else {
            if (HistoryStor.history.isOrderDate) {
              //-------- filtering orders by selected date
              filterResult = filteringByDate(
                HistoryStor.history.ordersSource, HistoryStor.history.startDate, HistoryStor.history.finishDate
              );
              if (filterResult) {
                HistoryStor.history.orders = filterResult;
              }
            }
            HistoryStor.history.isOrderDate = !HistoryStor.history.isOrderDate;
            HistoryStor.history.isOrderSearch = 0;
            HistoryStor.history.isOrderSort = 0;
          }
        }


        //------ Select calendar-scroll
        function openCalendarScroll(dataType) {
          if (HistoryStor.history.isDraftView) {
            if (dataType === 'start-date' && !HistoryStor.history.isStartDateDraft) {
              HistoryStor.history.isStartDateDraft = 1;
              HistoryStor.history.isFinishDateDraft = 0;
              HistoryStor.history.isAllPeriodDraft = 0;
            } else if (dataType === 'finish-date' && !HistoryStor.history.isFinishDateDraft) {
              HistoryStor.history.isStartDateDraft = 0;
              HistoryStor.history.isFinishDateDraft = 1;
              HistoryStor.history.isAllPeriodDraft = 0;
            } else if (dataType === 'full-date' && !HistoryStor.history.isAllPeriodDraft) {
              HistoryStor.history.isStartDateDraft = 0;
              HistoryStor.history.isFinishDateDraft = 0;
              HistoryStor.history.isAllPeriodDraft = 1;
              HistoryStor.history.startDateDraft = '';
              HistoryStor.history.finishDateDraft = '';
              HistoryStor.history.drafts = angular.copy(HistoryStor.history.draftsSource);
            } else {
              HistoryStor.history.isStartDateDraft = 0;
              HistoryStor.history.isFinishDateDraft = 0;
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
          if (HistoryStor.history.isDraftView) {
            HistoryStor.history.isOrderSortDraft = !HistoryStor.history.isOrderSortDraft;
            HistoryStor.history.isOrderDateDraft = 0;
          } else {
            HistoryStor.history.isOrderSort = !HistoryStor.history.isOrderSort;
            HistoryStor.history.isOrderSearch = 0;
            HistoryStor.history.isOrderDate = 0;
          }
        }


        //------ Select sorting type item in list
        function sortingInit(filterType, sortType) {
          if (HistoryStor.history.isDraftView) {

            if (HistoryStor.history.isSortTypeDraft === sortType) {
              HistoryStor.history.isSortTypeDraft = 0;
              HistoryStor.history.reverseDraft = 1;
            } else {
              HistoryStor.history.isSortTypeDraft = sortType;

              if (HistoryStor.history.isSortTypeDraft === 'first') {
                HistoryStor.history.reverseDraft = 1;
              }
              if (HistoryStor.history.isSortTypeDraft === 'last') {
                HistoryStor.history.reverseDraft = 0;
              }
            }

          } else {
            if (filterType) {
              /** filtering by Type order */
              if (HistoryStor.history.isFilterType === sortType) {
                HistoryStor.history.isFilterType = undefined;
              } else {
                HistoryStor.history.isFilterType = sortType;
              }
            } else {
              /** sorting by time */
              if (HistoryStor.history.isSortType === sortType) {
                HistoryStor.history.orders = angular.copy(HistoryStor.history.ordersSource);
                HistoryStor.history.isSortType = 'last';
              } else {
                HistoryStor.history.isSortType = sortType;
              }
            }
          }
        }

        function testFunc(orderNum) {
          HistoryStor.history.orderEditNumber = orderNum;
          GlobalStor.global.isBox = !GlobalStor.global.isBox;
          GlobalStor.global.isEditBox = !GlobalStor.global.isEditBox;
          orderItem().then(function () {
            RecOrderServ.box();
          })


        }

        function synchronizeOrders() {
          getOnline();
          if (onlineMode) {
            var defer = $q.defer();
            var orderData2;
            localDB.selectLocalDB(localDB.tablesLocalDB.orders.tableName).then(function (result_orders) {
              orderData2 = angular.copy(result_orders);
              //console.log("orderData2", orderData2);
              if (result_orders) {
                localDB.selectLocalDB(localDB.tablesLocalDB.order_products.tableName).then(function (result_order_products) {
                  var productData2 = angular.copy(result_order_products);
                  localDB.selectLocalDB(localDB.tablesLocalDB.order_addelements.tableName).then(function (result_order_addelements) {
                    var addElementsData2 = angular.copy(result_order_addelements);


                    if (typeof(orderData2.order_number) !== "number") {
                      console.log('send local save');
                      async.eachSeries(productData2, calculate1, function (err, result) {
                        defer.resolve(1);
                      });
                      async.eachSeries(addElementsData2, calculate2, function (err, result) {
                        defer.resolve(1);
                      });
                      async.eachSeries(orderData2, calculate3, function (err, result) {
                        downloadOrders();
                        defer.resolve(1);
                      });
                      //noinspection JSAnnotator
                      function calculate1(productData1, _cb) {
                        var productData;
                        if (true) {
                          async.waterfall([
                            function (_callback) {
                              productData = angular.copy(productData1);
                              _callback(null);
                            },
                            function (_callback) {
                              localDB.insertServer(
                                UserStor.userInfo.phone,
                                UserStor.userInfo.device_code,
                                localDB.tablesLocalDB.order_products.tableName,
                                productData
                              ).then(function (respond) {
                                console.log("calculate1", respond);
                                if (respond) {

                                }
                                _callback();
                              });

                            }
                          ], function (err, result) {
                            if (err) {
                              //console.log('err', err)
                              return _cb(err);
                            }
                            //console.log('herereer')
                            _cb(null);
                          });
                        }
                      }

                      //noinspection JSAnnotator
                      function calculate2(addElementsData1, _cb) {
                        var addElementsData;
                        async.waterfall([
                          function (_callback) {
                            addElementsData = angular.copy(addElementsData1);
                            _callback(null);
                          },
                          function (_callback) {
                            localDB.insertServer(
                              UserStor.userInfo.phone,
                              UserStor.userInfo.device_code,
                              localDB.tablesLocalDB.order_addelements.tableName,
                              addElementsData
                            ).then(function (respond) {
                              console.log("calculate1", respond);
                              if (respond) {

                              }
                              _callback();
                            });

                          }
                        ], function (err, result) {
                          if (err) {
                            //console.log('err', err)
                            return _cb(err);
                          }
                          //console.log('herereer')
                          _cb(null);
                        });
                      }

                      //noinspection JSAnnotator
                      function calculate3(orderData1, _cb) {
                        var orderData;
                        async.waterfall([
                          function (_callback) {
                            orderData = angular.copy(orderData1);
                            _callback(null);
                          },
                          function (_callback) {
                            localDB.insertServer(
                              UserStor.userInfo.phone,
                              UserStor.userInfo.device_code,
                              localDB.tablesLocalDB.orders.tableName,
                              orderData
                            ).then(function (respond) {
                              console.log("respond", respond);
                              if (typeof(respond.order_number) !== 'undefined') {
                                orderData.order_number = respond.order_number;
                                localDB.deleteRowLocalDB(localDB.tablesLocalDB.orders.tableName, {'id': orderData.id});
                                localDB.insertRowLocalDB(orderData, localDB.tablesLocalDB.orders.tableName);
                              }
                              _callback();
                            });
                          }
                        ], function (err, result) {
                          if (err) {
                            //console.log('err', err)
                            return _cb(err);
                          }
                          //console.log('herereer')
                          _cb(null);
                        });
                      }

                    }

                  });
                });
              } else {
                defer.resolve(1);
              }
            });
            return defer.promise;
          } else {
            GeneralServ.infoAlert(
              $filter('translate')('login.OFFLINE'),
              $filter('translate')('login.OFFLINE_INFO')
            );
          }
        }

        /**========== FINISH ==========*/

        thisFactory.publicObj = {
          toCurrentCalculation: toCurrentCalculation,
          downloadOrders: downloadOrders,
          sendOrderToFactory: sendOrderToFactory,
          makeOrderCopy: makeOrderCopy,
          clickDeleteOrder: clickDeleteOrder,
          editOrder: editOrder,
          orderPrint: orderPrint,
          orderItem: orderItem,
          viewSwitching: viewSwitching,
          dloadProducts: dloadProducts,
          dloadAddElements: dloadAddElements,
          orderSearching: orderSearching,
          orderDateSelecting: orderDateSelecting,
          openCalendarScroll: openCalendarScroll,
          orderSorting: orderSorting,
          sortingInit: sortingInit,
          reqResult: reqResult,
          synchronizeOrders: synchronizeOrders,
          deleteOption: deleteOption,
          testFunc: testFunc
        };

        return thisFactory.publicObj;


      });
})();
