
// services/cartMenu_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .factory('CartMenuServ', cartMenuFactory);

  function cartMenuFactory($location, globalConstants, localDB, GeneralServ, MainServ, analyticsServ, GlobalStor, OrderStor, CartStor) {

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
      if(OrderStor.order.selectedFloor !== floorName) {
        OrderStor.order.selectedFloor = floorName;
        OrderStor.order.selectedFloorPrice = parseFloat(floorPrice);
        calculateTotalOrderPrice();
      }
    }

    function selectAssembling(assembName, assembPrice) {
      if(OrderStor.order.selectedAssembling !== assembName) {
        OrderStor.order.selectedAssembling = assembName;
        OrderStor.order.selectedAssemblingPrice = parseFloat(assembPrice);
        calculateTotalOrderPrice();
      }
    }

    function selectInstalment(period, percent) {
      if(OrderStor.order.selectedInstalmentPeriod !== period) {
        OrderStor.order.isInstalment = 1;
        OrderStor.order.selectedInstalmentPeriod = period;
        OrderStor.order.selectedInstalmentPercent = percent;
        calculateInstalmentPrice(OrderStor.order.orderPriceTOTAL, OrderStor.order.orderPriceTOTALPrimary, CartStor.cart.orderPriceTOTALDis, CartStor.cart.orderPriceTOTALPrimaryDis);
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
        OrderStor.order.deliveryPrice = globalConstants.ratePriceDeliveryLess * qtyDays;
        OrderStor.order.isDatePriceLess = 1;
        OrderStor.order.isDatePriceMore = 0;
        OrderStor.order.isOldPrice = 1;
      } else if (qtyDays && qtyDays < 0) {
        OrderStor.order.deliveryPrice = globalConstants.ratePriceDeliveryMore * Math.abs(qtyDays);
        OrderStor.order.isDatePriceMore = 1;
        OrderStor.order.isDatePriceLess = 0;
        OrderStor.order.isOldPrice = 1;
      } else {
        OrderStor.order.deliveryPrice = 0;
        OrderStor.order.isDatePriceLess = 0;
        OrderStor.order.isDatePriceMore = 0;
        OrderStor.order.isOldPrice = 0;
      }
      OrderStor.order.newDeliveryDate = newDate.getTime();
      calculateTotalOrderPrice();
    }





    //-------- Calculate Total Order Price
    function calculateTotalOrderPrice() {
      //playSound('price');

      OrderStor.order.orderPriceTOTAL = 0;
      CartStor.cart.orderPriceTOTALDis = 0;

      //----- add product prices, floor price, assembling price
      OrderStor.order.orderPriceTOTAL += OrderStor.order.productsPriceTOTAL + OrderStor.order.selectedFloorPrice + OrderStor.order.selectedAssemblingPrice;
      CartStor.cart.orderPriceTOTALDis += CartStor.cart.productsPriceTOTALDis + OrderStor.order.selectedFloorPrice + OrderStor.order.selectedAssemblingPrice;

      //----- save primary total price
      OrderStor.order.orderPriceTOTALPrimary = OrderStor.order.orderPriceTOTAL;
      CartStor.cart.orderPriceTOTALPrimaryDis = CartStor.cart.orderPriceTOTALDis;
      //----- add delivery price
      if(OrderStor.order.deliveryPrice) {
        if(OrderStor.order.isDatePriceMore) {
          OrderStor.order.orderPriceTOTAL += OrderStor.order.deliveryPrice;
          CartStor.cart.orderPriceTOTALDis += OrderStor.order.deliveryPrice;
        } else if(OrderStor.order.isDatePriceLess) {
          OrderStor.order.orderPriceTOTAL -= OrderStor.order.deliveryPrice;
          CartStor.cart.orderPriceTOTALDis -= OrderStor.order.deliveryPrice;
        }
      } else {
        OrderStor.order.orderPriceTOTAL = OrderStor.order.orderPriceTOTALPrimary;
        CartStor.cart.orderPriceTOTALDis = CartStor.cart.orderPriceTOTALPrimaryDis;
      }

      OrderStor.order.orderPriceTOTAL = GeneralServ.roundingNumbers(OrderStor.order.orderPriceTOTAL);
      CartStor.cart.orderPriceTOTALDis = GeneralServ.roundingNumbers(CartStor.cart.orderPriceTOTALDis);
      CartStor.cart.discountPriceDiff = GeneralServ.roundingNumbers(OrderStor.order.orderPriceTOTAL - CartStor.cart.orderPriceTOTALDis);

      console.log('OrderStor++++++',OrderStor.order);
      console.log('OrderStor++++++',CartStor.cart);
      //------ get price with instalment
      calculateInstalmentPrice(OrderStor.order.orderPriceTOTAL, OrderStor.order.orderPriceTOTALPrimary, CartStor.cart.orderPriceTOTALDis, CartStor.cart.orderPriceTOTALPrimaryDis);
    }



    function calculateInstalmentPrice(price, pricePrimary, priceDis, pricePrimaryDis) {
      if(OrderStor.order.isInstalment) {
        OrderStor.order.paymentFirst = GeneralServ.roundingNumbers( (price * OrderStor.order.selectedInstalmentPercent / 100) );
        OrderStor.order.paymentMonthly = GeneralServ.roundingNumbers( ((price - OrderStor.order.paymentFirst) / OrderStor.order.selectedInstalmentPeriod) );
        CartStor.cart.paymentFirstDis = GeneralServ.roundingNumbers( (priceDis * OrderStor.order.selectedInstalmentPercent / 100) );
        CartStor.cart.paymentMonthlyDis = GeneralServ.roundingNumbers( ((priceDis - CartStor.cart.paymentFirstDis) / OrderStor.order.selectedInstalmentPeriod) );
        if(pricePrimary) {
          OrderStor.order.paymentFirstPrimary = GeneralServ.roundingNumbers( (pricePrimary * OrderStor.order.selectedInstalmentPercent / 100) );
          OrderStor.order.paymentMonthlyPrimary = GeneralServ.roundingNumbers( ((pricePrimary - OrderStor.order.paymentFirstPrimary) / OrderStor.order.selectedInstalmentPeriod) );
          CartStor.cart.paymentFirstPrimaryDis = GeneralServ.roundingNumbers( (pricePrimaryDis * OrderStor.order.selectedInstalmentPercent / 100) );
          CartStor.cart.paymentMonthlyPrimaryDis = GeneralServ.roundingNumbers( ((pricePrimaryDis - CartStor.cart.paymentFirstPrimaryDis) / OrderStor.order.selectedInstalmentPeriod) );
        }
      }
    }




    //========== Orders Dialogs ======//

    //--------- send Order in Local DB
    function sendOrder() {
      var orderStyle;
      //------- set order style
      if(CartStor.cart.isOrderDialog) {
        orderStyle = 'order';
      } else if(CartStor.cart.isCreditDialog) {
        orderStyle = 'credit';
      } else if(CartStor.cart.isMasterDialog) {
        orderStyle = 'master';
      }
      MainServ.insertOrderInLocalDB(CartStor.cart.user, globalConstants.fullOrderType, orderStyle);
      //--------- Close cart dialog, go to history
      closeOrderDialog();
      //------- set previos Page
      GeneralServ.setPreviosPage();
      analyticsServ.sendAnalyticsGlobalDB(OrderStor.order);
      $location.path('/history');
    }



    //---------- Close any Order Dialog
    function closeOrderDialog() {
      CartStor.cart.submitted = false;
      CartStor.cart.isCityBox = false;
      if(GlobalStor.global.orderEditNumber > 0) {
        CartStor.fillOrderForm();
      } else{
        CartStor.cart.user = CartStor.setDefaultUser();
      }
      CartStor.cart.isMasterDialog = false;
      CartStor.cart.isOrderDialog = false;
      CartStor.cart.isCreditDialog = false;
    }


    function changeLocation() {
      if(CartStor.cart.user.location) {
        CartStor.cart.isCityBox = true;
      } else {
        CartStor.cart.isCityBox = false;
      }
    }

    //-------- Select City
    function selectCity(place) {
      CartStor.cart.user.location = place;
      CartStor.cart.isCityBox = false;
    }

  }
})();

