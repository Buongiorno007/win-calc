
// services/cartMenu_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('CartModule')
    .factory('CartMenuServ', cartMenuFactory);

  function cartMenuFactory(globalConstants, GeneralServ, OrderStor, CartStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      selectFloorPrice: selectFloorPrice,
      selectAssembling: selectAssembling,
      selectInstalment: selectInstalment,
      checkDifferentDate: checkDifferentDate,
      calculateTotalOrderPrice: calculateTotalOrderPrice
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
        calculateInstalmentPrice(OrderStor.order.orderPriceTOTAL, OrderStor.order.orderPriceTOTALPrimary);
      }
    }


    //------- Calendar
    //------ change date
    function checkDifferentDate(lastday, newday) {
      var lastDateArr, newDateArr, lastDate, newDate, qtyDays;
      lastDateArr = lastday.split(".");
      newDateArr = newday.split(".");
      lastDate = new Date(lastDateArr[ 2 ], lastDateArr[ 1 ]-1, lastDateArr[0]);
      newDate = new Date(newDateArr[ 2 ], newDateArr[ 1 ]-1, newDateArr[0]);
      qtyDays = Math.floor((newDate - lastDate)/(1000*60*60*24));

      if(qtyDays && qtyDays > 0) {
        OrderStor.order.deliveryPrice = globalConstants.ratePriceDeliveryLess * qtyDays;
        OrderStor.order.isDatePriceLess = true;
        OrderStor.order.isDatePriceMore = false;
        OrderStor.order.isOldPrice = true;
      } else if (qtyDays && qtyDays < 0) {
        OrderStor.order.deliveryPrice = globalConstants.ratePriceDeliveryMore * Math.abs(qtyDays);
        OrderStor.order.isDatePriceMore = true;
        OrderStor.order.isDatePriceLess = false;
        OrderStor.order.isOldPrice = true;
      } else {
        OrderStor.order.deliveryPrice = false;
        OrderStor.order.isDatePriceLess = false;
        OrderStor.order.isDatePriceMore = false;
        OrderStor.order.isOldPrice = false;
      }
      OrderStor.order.newDeliveryDate = newday;
      calculateTotalOrderPrice();
    }





    //-------- Calculate Total Order Price
    function calculateTotalOrderPrice() {
      //playSound('price');

      OrderStor.order.orderPriceTOTAL = 0;
      //----- add product prices, floor price, assembling price
      OrderStor.order.orderPriceTOTAL += OrderStor.order.productsPriceTOTAL + OrderStor.order.selectedFloorPrice + OrderStor.order.selectedAssemblingPrice;

      //----- save primary total price
      OrderStor.order.orderPriceTOTALPrimary = OrderStor.order.orderPriceTOTAL;
      //----- add delivery price
      if(OrderStor.order.deliveryPrice) {
        if(OrderStor.order.isDatePriceMore) {
          OrderStor.order.orderPriceTOTAL += OrderStor.order.deliveryPrice;
        } else if(OrderStor.order.isDatePriceLess) {
          OrderStor.order.orderPriceTOTAL -= OrderStor.order.deliveryPrice;
        }
      } else {
        OrderStor.order.orderPriceTOTAL = OrderStor.order.orderPriceTOTALPrimary;
      }

      OrderStor.order.orderPriceTOTAL = GeneralServ.roundingNumbers(OrderStor.order.orderPriceTOTAL);
      //------ get price with instalment
      calculateInstalmentPrice(OrderStor.order.orderPriceTOTAL, OrderStor.order.orderPriceTOTALPrimary);
    }



    function calculateInstalmentPrice(price, pricePrimary) {
      if(OrderStor.order.isInstalment) {
        OrderStor.order.paymentFirst = GeneralServ.roundingNumbers( (price * OrderStor.order.selectedInstalmentPercent / 100) );
        OrderStor.order.paymentMonthly = GeneralServ.roundingNumbers( ((price - OrderStor.order.paymentFirst) / OrderStor.order.selectedInstalmentPeriod) );
        if(pricePrimary) {
          OrderStor.order.paymentFirstPrimary = GeneralServ.roundingNumbers( (pricePrimary * OrderStor.order.selectedInstalmentPercent / 100) );
          OrderStor.order.paymentMonthlyPrimary = GeneralServ.roundingNumbers( ((pricePrimary - OrderStor.order.paymentFirstPrimary) / OrderStor.order.selectedInstalmentPeriod) );
        }
      }
    }


  }
})();

