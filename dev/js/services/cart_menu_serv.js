(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .factory('CartMenuServ', cartMenuFactory);

  function cartMenuFactory($location, globalConstants, GeneralServ, MainServ, analyticsServ, GlobalStor, OrderStor, CartStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      selectFloorPrice: selectFloorPrice,
      selectAssembling: selectAssembling,
      selectInstalment: selectInstalment,
      checkDifferentDate: checkDifferentDate,
      calculateTotalOrderPrice: calculateTotalOrderPrice,

      closeOrderDialog: closeOrderDialog,
      changeLocation: changeLocation,
      selectCity: selectCity,
      sendOrder: sendOrder,
      swipeDiscountBlock: swipeDiscountBlock
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


    //------- Calendar
    //------ change date
    function checkDifferentDate(lastday, newday) {
      var lastDateArr = lastday.split("."),
          newDateArr = newday.split("."),
          lastDate = new Date(lastDateArr[ 2 ], lastDateArr[ 1 ]-1, lastDateArr[0]),
          newDate = new Date(newDateArr[ 2 ], newDateArr[ 1 ]-1, newDateArr[0]),
          qtyDays = Math.floor((newDate - lastDate)/(1000*60*60*24));

      if(qtyDays && qtyDays > 0) {
        //------- culc Delivery Plant Discount
        var weekNumber = qtyDays/ 7,
            discount = 0;
        if(weekNumber <= 1) {
          discount = GlobalStor.global.deliveryCoeff.week_1;
        } else if (weekNumber > 1 && weekNumber <= 2) {
          discount = GlobalStor.global.deliveryCoeff.week_2;
        } else if (weekNumber > 2 && weekNumber <= 3) {
          discount = GlobalStor.global.deliveryCoeff.week_3;
        } else if (weekNumber > 3 && weekNumber <= 4) {
          discount = GlobalStor.global.deliveryCoeff.week_4;
        } else if (weekNumber > 4 && weekNumber <= 5) {
          discount = GlobalStor.global.deliveryCoeff.week_5;
        } else if (weekNumber > 5 && weekNumber <= 6) {
          discount = GlobalStor.global.deliveryCoeff.week_6;
        } else if (weekNumber > 6 && weekNumber <= 7) {
          discount = GlobalStor.global.deliveryCoeff.week_7;
        } else if (weekNumber > 7 ) {
          discount = GlobalStor.global.deliveryCoeff.week_8;
        }
        OrderStor.order.delivery_price = (discount) ? GeneralServ.roundingNumbers(OrderStor.order.productsPriceDis - GeneralServ.setPriceDis(OrderStor.order.productsPriceDis, discount)) : 0;
        if(OrderStor.order.delivery_price) {
          OrderStor.order.is_date_price_less = 1;
          OrderStor.order.is_date_price_more = 0;
          OrderStor.order.is_old_price = 1;
        } else {
          hideDeliveryPriceOnCalendar();
        }
      } else if (qtyDays && qtyDays < 0) {
        //------- culc Delivery Plant Margin
        var marginIndex = Math.abs(GlobalStor.global.deliveryCoeff.standart_time + qtyDays);
        var margin = GlobalStor.global.deliveryCoeff.percents[marginIndex]*1;
        OrderStor.order.delivery_price = (margin) ? GeneralServ.roundingNumbers(OrderStor.order.productsPriceDis - GeneralServ.roundingNumbers(OrderStor.order.productsPriceDis * (1 + margin / 100))) : 0;
        if(OrderStor.order.delivery_price) {
          OrderStor.order.is_date_price_more = 1;
          OrderStor.order.is_date_price_less = 0;
          OrderStor.order.is_old_price = 1;
        } else {
          hideDeliveryPriceOnCalendar();
        }
      } else {
        OrderStor.order.delivery_price = 0;
        hideDeliveryPriceOnCalendar();
      }
      OrderStor.order.new_delivery_date = newDate.getTime();
      calculateTotalOrderPrice();
    }



    function hideDeliveryPriceOnCalendar() {
      OrderStor.order.is_date_price_less = 0;
      OrderStor.order.is_date_price_more = 0;
      OrderStor.order.is_old_price = 0;
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
      //----- add delivery price
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




    //========== Orders Dialogs ======//

    //--------- send Order in Local DB
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

    /** open/close discount block */
    function swipeDiscountBlock() {
      CartStor.cart.isShowDiscount = !CartStor.cart.isShowDiscount;
    }


  }
})();
