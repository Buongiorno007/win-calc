(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .factory('CartMenuServ', cartMenuFactory);

  function cartMenuFactory($location, GeneralServ, MainServ, analyticsServ, GlobalStor, OrderStor, CartStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      //---- menu
      selectFloorPrice: selectFloorPrice,
      selectAssembling: selectAssembling,
      selectInstalment: selectInstalment,
      checkDifferentDate: checkDifferentDate,
      //---- price
      calculateOrderPrice: calculateOrderPrice,
      calculateAllProductsPrice: calculateAllProductsPrice,
      calculateTotalOrderPrice: calculateTotalOrderPrice,
      changeProductPriceAsDiscount: changeProductPriceAsDiscount,
      changeAddElemPriceAsDiscount: changeAddElemPriceAsDiscount,
      swipeDiscountBlock: swipeDiscountBlock,

      //---- sent order
      closeOrderDialog: closeOrderDialog,
      changeLocation: changeLocation,
      selectCity: selectCity,
      sendOrder: sendOrder
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //------- Select dropdown menu item

    function selectFloorPrice(id, name, price) {
      if(OrderStor.order.floor_id !== id) {
        OrderStor.order.floor_id = id;
        if(id) {
          OrderStor.order.floorName = name;
          OrderStor.order.floor_price = parseFloat(price);
        } else {
          OrderStor.order.floorName = '';
          OrderStor.order.floor_price = 0;
        }
        calculateTotalOrderPrice();
      }
    }

    function selectAssembling(id, name, price) {
      if(OrderStor.order.mounting_id !== id) {
        OrderStor.order.mounting_id = id;
        if(id) {
          OrderStor.order.mountingName = name;
          OrderStor.order.mounting_price = parseFloat(price);
        } else {
          OrderStor.order.mountingName = '';
          OrderStor.order.mounting_price = 0;
        }
        calculateTotalOrderPrice();
      }
    }

    function selectInstalment(id, period, percent) {
      if(OrderStor.order.instalment_id !== id) {
        OrderStor.order.is_instalment = 1;
        OrderStor.order.instalment_id = id;
        OrderStor.order.selectedInstalmentPeriod = period;
        OrderStor.order.selectedInstalmentPercent = percent;
        calculateInstalmentPrice(OrderStor.order.order_price, OrderStor.order.order_price_primary, OrderStor.order.order_price_dis, OrderStor.order.orderPricePrimaryDis);
      }
    }


    /** Calendar */
    //------ change date
    function checkDifferentDate(lastday, newday) {
      var lastDateArr = lastday.split("."),
          newDateArr = newday.split("."),
          lastDate = new Date(lastDateArr[ 2 ], lastDateArr[ 1 ]-1, lastDateArr[0]),
          newDate = new Date(newDateArr[ 2 ], newDateArr[ 1 ]-1, newDateArr[0]),
          qtyDays = Math.floor((newDate - lastDate)/(1000*60*60*24));
      OrderStor.order.delivery_price = 0;

      //------- culc Delivery Plant Discount
      if(qtyDays && qtyDays > 0) {
        var weekNumber = qtyDays/ 7,
            discountPlant = 0,
            userDiscConstr = 0,
            userDiscAddElem = 0;
        if(weekNumber <= 1) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_1;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[0];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[0];
        } else if (weekNumber > 1 && weekNumber <= 2) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_2;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[1];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[1];
        } else if (weekNumber > 2 && weekNumber <= 3) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_3;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[2];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[2];
        } else if (weekNumber > 3 && weekNumber <= 4) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_4;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[3];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[3];
        } else if (weekNumber > 4 && weekNumber <= 5) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_5;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[4];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[4];
        } else if (weekNumber > 5 && weekNumber <= 6) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_6;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[5];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[5];
        } else if (weekNumber > 6 && weekNumber <= 7) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_7;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[6];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[6];
        } else if (weekNumber > 7 ) {
          discountPlant = GlobalStor.global.deliveryCoeff.week_8;
          userDiscConstr = UserStor.userInfo.discConstrByWeek[7];
          userDiscAddElem = UserStor.userInfo.discAddElemByWeek[7];
        }

        if(userDiscConstr) {
          OrderStor.order.discount_construct = userDiscConstr;
          changeProductPriceAsDiscount(userDiscConstr);
          calculateAllProductsPrice();
        } else {
          //---- set default discount user
          OrderStor.order.discount_construct = angular.copy(UserStor.userInfo.discountConstr);
          changeProductPriceAsDiscount(OrderStor.order.discount_construct);
          calculateAllProductsPrice();
        }
        if(userDiscAddElem) {
          OrderStor.order.discount_addelem = userDiscAddElem;
          changeAddElemPriceAsDiscount(userDiscAddElem);
          calculateAllProductsPrice();
        } else {
          //---- set default discount user
          OrderStor.order.discount_addelem = angular.copy(UserStor.userInfo.discountAddElem);
          changeAddElemPriceAsDiscount(OrderStor.order.discount_addelem);
          calculateAllProductsPrice();
        }

//        console.info('discont', userDiscConstr, userDiscAddElem);
//        console.info('discont Plant', discountPlant);
        if(discountPlant) {
          CartStor.cart.discountDeliveyPlant = discountPlant;
          culcDeliveyPriceByDiscPlant();
          OrderStor.order.is_date_price_less = 1;
          OrderStor.order.is_date_price_more = 0;
          OrderStor.order.is_old_price = 1;
        } else {
          calculateAllProductsPrice();
          hideDeliveryPriceOnCalendar();
        }

      //------- culc Delivery Plant Margin
      } else if (qtyDays && qtyDays < 0) {
        var marginIndex = Math.abs(GlobalStor.global.deliveryCoeff.standart_time + qtyDays);
        CartStor.cart.marginDeliveyPlant = GlobalStor.global.deliveryCoeff.percents[marginIndex]*1;
//        console.info('margin', margin);
        if(CartStor.cart.marginDeliveyPlant) {
          culcDeliveryPriceByMargPlant();
          OrderStor.order.is_date_price_more = 1;
          OrderStor.order.is_date_price_less = 0;
          OrderStor.order.is_old_price = 1;
        } else {
          calculateAllProductsPrice();
          hideDeliveryPriceOnCalendar();
        }

      //------ default delivery date
      } else {
        //------- set default discount x add element
        OrderStor.order.discount_addelem = angular.copy(UserStor.userInfo.discountAddElem);
        changeAddElemPriceAsDiscount(OrderStor.order.discount_addelem);
        //------- set default discount x construction
        OrderStor.order.discount_construct = angular.copy(UserStor.userInfo.discountConstr);
        changeProductPriceAsDiscount(OrderStor.order.discount_construct);
        calculateAllProductsPrice();
        hideDeliveryPriceOnCalendar();
      }
      calculateTotalOrderPrice();
      OrderStor.order.new_delivery_date = newDate.getTime();
    }


    function culcDeliveyPriceByDiscPlant() {
      OrderStor.order.delivery_price = GeneralServ.roundingNumbers(OrderStor.order.productsPriceDis * CartStor.cart.discountDeliveyPlant / 100);
    }

    function culcDeliveryPriceByMargPlant() {
      OrderStor.order.delivery_price = GeneralServ.roundingNumbers(OrderStor.order.productsPriceDis * CartStor.cart.marginDeliveyPlant / 100);
    }

    function hideDeliveryPriceOnCalendar() {
      OrderStor.order.is_date_price_less = 0;
      OrderStor.order.is_date_price_more = 0;
      OrderStor.order.is_old_price = 0;
    }





    /**========== Calculate Order Price ============*/

    function calculateOrderPrice() {
      calculateAllProductsPrice();
      //------ reculculate delivery price
      if(CartStor.cart.discountDeliveyPlant) {
        culcDeliveyPriceByDiscPlant();
      }
      if(CartStor.cart.marginDeliveyPlant) {
        culcDeliveryPriceByMargPlant();
      }
      //----- join together product prices and order option
      calculateTotalOrderPrice();
    }



    //-------- Calculate All Products Price
    function calculateAllProductsPrice() {
      var productsQty = OrderStor.order.products.length;
      OrderStor.order.templates_price = 0;
      OrderStor.order.addelems_price = 0;
      OrderStor.order.products_price = 0;
      OrderStor.order.productsPriceDis = 0;
      while(--productsQty > -1) {
        OrderStor.order.addelems_price += OrderStor.order.products[productsQty].addelem_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.templates_price += OrderStor.order.products[productsQty].template_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.products_price += OrderStor.order.products[productsQty].product_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.productsPriceDis += OrderStor.order.products[productsQty].productPriceDis * OrderStor.order.products[productsQty].product_qty;
      }
      OrderStor.order.addelems_price = GeneralServ.roundingNumbers(OrderStor.order.addelems_price);
      OrderStor.order.templates_price = GeneralServ.roundingNumbers(OrderStor.order.templates_price);
      OrderStor.order.products_price = GeneralServ.roundingNumbers(OrderStor.order.products_price);
      /** if default user discount = 0 */
      if(OrderStor.order.productsPriceDis) {
        OrderStor.order.productsPriceDis = GeneralServ.roundingNumbers(OrderStor.order.productsPriceDis);
      } else {
        OrderStor.order.productsPriceDis = angular.copy(OrderStor.order.products_price);
      }

    }


    //-------- Calculate Total Order Price
    function calculateTotalOrderPrice() {
      //playSound('price');

      OrderStor.order.order_price = 0;
      OrderStor.order.order_price_dis = 0;

      //----- add product prices, floor price, assembling price
      OrderStor.order.order_price = OrderStor.order.products_price + OrderStor.order.floor_price + OrderStor.order.mounting_price;
      OrderStor.order.order_price_dis = OrderStor.order.productsPriceDis + OrderStor.order.floor_price + OrderStor.order.mounting_price;

      //----- save primary total price
      OrderStor.order.order_price_primary = angular.copy(OrderStor.order.order_price);
      OrderStor.order.orderPricePrimaryDis = angular.copy(OrderStor.order.order_price_dis);

      //----- add delivery price if order edit
      if(OrderStor.order.delivery_price) {
        if(OrderStor.order.is_date_price_more) {
          OrderStor.order.order_price += OrderStor.order.delivery_price;
          OrderStor.order.order_price_dis += OrderStor.order.delivery_price;
        } else if(OrderStor.order.is_date_price_less) {
          OrderStor.order.order_price -= OrderStor.order.delivery_price;
          OrderStor.order.order_price_dis -= OrderStor.order.delivery_price;
        }
      }

      OrderStor.order.order_price = GeneralServ.roundingNumbers(OrderStor.order.order_price);
      OrderStor.order.order_price_dis = GeneralServ.roundingNumbers(OrderStor.order.order_price_dis);
      CartStor.cart.discountPriceDiff = GeneralServ.roundingNumbers(OrderStor.order.order_price - OrderStor.order.order_price_dis);

      //------ get price with instalment
      calculateInstalmentPrice(OrderStor.order.order_price, OrderStor.order.order_price_primary, OrderStor.order.order_price_dis, OrderStor.order.orderPricePrimaryDis);
    }



    function calculateInstalmentPrice(price, pricePrimary, priceDis, pricePrimaryDis) {
      if(OrderStor.order.is_instalment) {
        OrderStor.order.payment_first = GeneralServ.roundingNumbers( (price * OrderStor.order.selectedInstalmentPercent / 100) );
        OrderStor.order.payment_monthly = GeneralServ.roundingNumbers( ((price - OrderStor.order.payment_first) / OrderStor.order.selectedInstalmentPeriod) );
        OrderStor.order.paymentFirstDis = GeneralServ.roundingNumbers( (priceDis * OrderStor.order.selectedInstalmentPercent / 100) );
        OrderStor.order.paymentMonthlyDis = GeneralServ.roundingNumbers( ((priceDis - OrderStor.order.paymentFirstDis) / OrderStor.order.selectedInstalmentPeriod) );
        if(pricePrimary) {
          OrderStor.order.payment_first_primary = GeneralServ.roundingNumbers( (pricePrimary * OrderStor.order.selectedInstalmentPercent / 100) );
          OrderStor.order.payment_monthly_primary = GeneralServ.roundingNumbers( ((pricePrimary - OrderStor.order.payment_first_primary) / OrderStor.order.selectedInstalmentPeriod) );
          OrderStor.order.paymentFirstPrimaryDis = GeneralServ.roundingNumbers( (pricePrimaryDis * OrderStor.order.selectedInstalmentPercent / 100) );
          OrderStor.order.paymentMonthlyPrimaryDis = GeneralServ.roundingNumbers( ((pricePrimaryDis - OrderStor.order.paymentFirstPrimaryDis) / OrderStor.order.selectedInstalmentPeriod) );
        }
      }
    }


    /** open/close discount block */
    function swipeDiscountBlock() {
      CartStor.cart.isShowDiscount = !CartStor.cart.isShowDiscount;
    }


    function changeAddElemPriceAsDiscount(discount) {
      var productQty = OrderStor.order.products.length;
      for(var prod = 0; prod < productQty; prod++) {
        var templatePriceDis =  OrderStor.order.products[prod].productPriceDis - OrderStor.order.products[prod].addelemPriceDis;
        OrderStor.order.products[prod].addelemPriceDis = GeneralServ.setPriceDis(OrderStor.order.products[prod].addelem_price, discount);
        OrderStor.order.products[prod].productPriceDis = GeneralServ.roundingNumbers(templatePriceDis + OrderStor.order.products[prod].addelemPriceDis);

        var addElemsQty = OrderStor.order.products[prod].chosenAddElements.length;
        for(var elem = 0; elem < addElemsQty; elem++) {
          var elemQty = OrderStor.order.products[prod].chosenAddElements[elem].length;
          if (elemQty > 0) {
            for (var item = 0; item < elemQty; item++) {
              OrderStor.order.products[prod].chosenAddElements[elem][item].elementPriceDis = GeneralServ.setPriceDis(OrderStor.order.products[prod].chosenAddElements[elem][item].element_price, discount);
            }
          }
        }
      }
    }


    function changeProductPriceAsDiscount(discount) {
      var productQty = OrderStor.order.products.length;
      for(var prod = 0; prod < productQty; prod++) {
        OrderStor.order.products[prod].productPriceDis = angular.copy( GeneralServ.roundingNumbers( GeneralServ.setPriceDis(OrderStor.order.products[prod].template_price, discount) + OrderStor.order.products[prod].addelemPriceDis ));
      }
    }




    /** ========== Orders Dialogs ====== */

    /** send Order in Local DB */
    function sendOrder() {
      var orderStyle;
      GlobalStor.global.isLoader = 1;
      //------- set order style
      if(CartStor.cart.isOrderDialog) {
        orderStyle = 'order';
      } else if(CartStor.cart.isCreditDialog) {
        orderStyle = 'credit';
      } else if(CartStor.cart.isMasterDialog) {
        orderStyle = 'master';
      }
      MainServ.saveOrderInDB(CartStor.cart.customer, 1, orderStyle).then(function() {
        //--------- Close cart dialog, go to history
        closeOrderDialog();
        //------- set previos Page
        GeneralServ.setPreviosPage();
        //TODO ??? analyticsServ.sendAnalyticsGlobalDB(OrderStor.order);
        GlobalStor.global.isLoader = 0;
        $location.path('/history');
      });
    }



    //---------- Close any Order Dialog
    function closeOrderDialog() {
      CartStor.cart.submitted = 0;
      CartStor.cart.isCityBox = 0;
      if(GlobalStor.global.orderEditNumber > 0) {
        CartStor.fillOrderForm();
      } else{
        CartStor.cart.customer = CartStor.setDefaultUser();
      }
      CartStor.cart.isMasterDialog = 0;
      CartStor.cart.isOrderDialog = 0;
      CartStor.cart.isCreditDialog = 0;
    }


    function changeLocation() {
      if(CartStor.cart.customer.customer_location) {
        CartStor.cart.isCityBox = 1;
      } else {
        CartStor.cart.isCityBox = 0;
      }
    }

    //-------- Select City
    function selectCity(place) {
      CartStor.cart.customer.customer_location = place;
      CartStor.cart.isCityBox = 0;
    }


  }
})();
