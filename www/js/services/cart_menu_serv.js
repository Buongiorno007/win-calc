
// services/cart_menu_serv.js

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
      sendOrder: sendOrder
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //------- Select dropdown menu item

    function selectFloorPrice(floorName, floorPrice) {
      if(OrderStor.order.floor_id !== floorName) {
        OrderStor.order.floor_id = floorName;
        OrderStor.order.floor_price = parseFloat(floorPrice);
        calculateTotalOrderPrice();
      }
    }

    function selectAssembling(assembName, assembPrice) {
      if(OrderStor.order.mounting_id !== assembName) {
        OrderStor.order.mounting_id = assembName;
        OrderStor.order.mounting_price = parseFloat(assembPrice);
        calculateTotalOrderPrice();
      }
    }

    function selectInstalment(period, percent) {
      if(OrderStor.order.selectedInstalmentPeriod !== period) {
        OrderStor.order.is_instalment = 1;
        OrderStor.order.selectedInstalmentPeriod = period;
        OrderStor.order.selectedInstalmentPercent = percent;
        calculateInstalmentPrice(OrderStor.order.order_price_total, OrderStor.order.order_price_total_primary, OrderStor.order.order_price_total_dis, CartStor.cart.orderPriceTOTALPrimaryDis);
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
        OrderStor.order.delivery_price = globalConstants.ratePriceDeliveryLess * qtyDays;
        OrderStor.order.is_date_price_less = 1;
        OrderStor.order.is_date_price_more = 0;
        OrderStor.order.is_old_price = 1;
      } else if (qtyDays && qtyDays < 0) {
        OrderStor.order.delivery_price = globalConstants.ratePriceDeliveryMore * Math.abs(qtyDays);
        OrderStor.order.is_date_price_more = 1;
        OrderStor.order.is_date_price_less = 0;
        OrderStor.order.is_old_price = 1;
      } else {
        OrderStor.order.delivery_price = 0;
        OrderStor.order.is_date_price_less = 0;
        OrderStor.order.is_date_price_more = 0;
        OrderStor.order.is_old_price = 0;
      }
      OrderStor.order.new_delivery_date = newDate.getTime();
      calculateTotalOrderPrice();
    }





    //-------- Calculate Total Order Price
    function calculateTotalOrderPrice() {
      //playSound('price');

      OrderStor.order.order_price_total = 0;
      OrderStor.order.order_price_total_dis = 0;

      //----- add product prices, floor price, assembling price
      OrderStor.order.order_price_total += OrderStor.order.products_price_total + OrderStor.order.floor_price + OrderStor.order.mounting_price;
      OrderStor.order.order_price_total_dis += CartStor.cart.productsPriceTOTALDis + OrderStor.order.floor_price + OrderStor.order.mounting_price;

      //----- save primary total price
      OrderStor.order.order_price_total_primary = OrderStor.order.order_price_total;
      CartStor.cart.orderPriceTOTALPrimaryDis = OrderStor.order.order_price_total_dis;
      //----- add delivery price
      if(OrderStor.order.delivery_price) {
        if(OrderStor.order.is_date_price_more) {
          OrderStor.order.order_price_total += OrderStor.order.delivery_price;
          OrderStor.order.order_price_total_dis += OrderStor.order.delivery_price;
        } else if(OrderStor.order.is_date_price_less) {
          OrderStor.order.order_price_total -= OrderStor.order.delivery_price;
          OrderStor.order.order_price_total_dis -= OrderStor.order.delivery_price;
        }
      } else {
        OrderStor.order.order_price_total = OrderStor.order.order_price_total_primary;
        OrderStor.order.order_price_total_dis = CartStor.cart.orderPriceTOTALPrimaryDis;
      }

      OrderStor.order.order_price_total = GeneralServ.roundingNumbers(OrderStor.order.order_price_total);
      OrderStor.order.order_price_total_dis = GeneralServ.roundingNumbers(OrderStor.order.order_price_total_dis);
      CartStor.cart.discountPriceDiff = GeneralServ.roundingNumbers(OrderStor.order.order_price_total - OrderStor.order.order_price_total_dis);

      console.log('OrderStor++++++',OrderStor.order);
      console.log('OrderStor++++++',CartStor.cart);
      //------ get price with instalment
      calculateInstalmentPrice(OrderStor.order.order_price_total, OrderStor.order.order_price_total_primary, OrderStor.order.order_price_total_dis, CartStor.cart.orderPriceTOTALPrimaryDis);
    }



    function calculateInstalmentPrice(price, pricePrimary, priceDis, pricePrimaryDis) {
      if(OrderStor.order.is_instalment) {
        OrderStor.order.payment_first = GeneralServ.roundingNumbers( (price * OrderStor.order.selectedInstalmentPercent / 100) );
        OrderStor.order.payment_monthly = GeneralServ.roundingNumbers( ((price - OrderStor.order.payment_first) / OrderStor.order.selectedInstalmentPeriod) );
        CartStor.cart.paymentFirstDis = GeneralServ.roundingNumbers( (priceDis * OrderStor.order.selectedInstalmentPercent / 100) );
        CartStor.cart.paymentMonthlyDis = GeneralServ.roundingNumbers( ((priceDis - CartStor.cart.paymentFirstDis) / OrderStor.order.selectedInstalmentPeriod) );
        if(pricePrimary) {
          OrderStor.order.payment_first_primary = GeneralServ.roundingNumbers( (pricePrimary * OrderStor.order.selectedInstalmentPercent / 100) );
          OrderStor.order.payment_monthly_primary = GeneralServ.roundingNumbers( ((pricePrimary - OrderStor.order.payment_first_primary) / OrderStor.order.selectedInstalmentPeriod) );
          CartStor.cart.paymentFirstPrimaryDis = GeneralServ.roundingNumbers( (pricePrimaryDis * OrderStor.order.selectedInstalmentPercent / 100) );
          CartStor.cart.paymentMonthlyPrimaryDis = GeneralServ.roundingNumbers( ((pricePrimaryDis - CartStor.cart.paymentFirstPrimaryDis) / OrderStor.order.selectedInstalmentPeriod) );
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
      CartStor.cart.submitted = false;
      CartStor.cart.isCityBox = false;
      if(GlobalStor.global.orderEditNumber > 0) {
        CartStor.fillOrderForm();
      } else{
        CartStor.cart.customer = CartStor.setDefaultUser();
      }
      CartStor.cart.isMasterDialog = false;
      CartStor.cart.isOrderDialog = false;
      CartStor.cart.isCreditDialog = false;
    }


    function changeLocation() {
      if(CartStor.cart.customer.customer_location) {
        CartStor.cart.isCityBox = true;
      } else {
        CartStor.cart.isCityBox = false;
      }
    }

    //-------- Select City
    function selectCity(place) {
      CartStor.cart.customer.customer_location = place;
      CartStor.cart.isCityBox = false;
    }

  }
})();

