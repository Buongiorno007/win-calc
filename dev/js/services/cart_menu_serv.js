(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('CartModule')
    .factory('CartMenuServ',

  function(
    $location,
    GeneralServ,
    MainServ,
    GlobalStor,
    OrderStor,
    CartStor,
    UserStor
  ) {
    /*jshint validthis:true */
    var thisFactory = this;



    /**============ METHODS ================*/


    /**---------- join all Add Elements for Detials ---------*/

    function joinAllAddElements() {
      var productsQty = OrderStor.order.products.length,
          isExistElem = 0,
          typeElementsQty, elementsQty,
          product, tempElement, element, prod, type, elem;
      //------ cleaning allAddElements
      CartStor.cart.allAddElements.length = 0;
      CartStor.cart.isExistAddElems = 0;

      for(prod = 0; prod < productsQty; prod+=1) {
        product = [];
        typeElementsQty = OrderStor.order.products[prod].chosenAddElements.length;
        for(type = 0; type < typeElementsQty; type+=1) {
          elementsQty = OrderStor.order.products[prod].chosenAddElements[type].length;
          if(elementsQty > 0) {
            for(elem = 0; elem < elementsQty; elem+=1) {
              tempElement = angular.copy(OrderStor.order.products[prod].chosenAddElements[type][elem]);
              element = {
                id: tempElement.id,
                list_group_id: tempElement.list_group_id,
                name: tempElement.name,
                elementPriceDis: tempElement.elementPriceDis,
                element_price: tempElement.element_price,
                element_qty: tempElement.element_qty * OrderStor.order.products[prod].product_qty,
                element_type: tempElement.element_type,
                element_width: tempElement.element_width,
                element_height: tempElement.element_height
              };
              product.push(element);
            }
          }
        }
        if(product.length) {
          isExistElem+=1;
        }
        CartStor.cart.allAddElements.push(product);
      }
      //------ to show button All AddElements
      if(isExistElem) {
        CartStor.cart.isExistAddElems = 1;
      }
    }




    /**---------- mounting margin by Day ------------*/

    function setMountingMarginDay() {
      var dayIndex = new Date(OrderStor.order.new_delivery_date).getDay(),
          dayMargin = 0;
      //      console.warn('new_delivery_date', dayIndex);
      switch(dayIndex) {
        case 0: //---- Sunday
          dayMargin = UserStor.userInfo.mount_sun || 0;
          break;
        case 1: //---- Monday
          dayMargin = UserStor.userInfo.mount_mon || 0;
          break;
        case 2: //---- Tuesday
          dayMargin = UserStor.userInfo.mount_tue || 0;
          break;
        case 3: //---- Wednesday
          dayMargin = UserStor.userInfo.mount_wed || 0;
          break;
        case 4: //---- Thursday
          dayMargin = UserStor.userInfo.mount_thu || 0;
          break;
        case 5: //---- Friday
          dayMargin = UserStor.userInfo.mount_fri || 0;
          break;
        case 6: //---- Sataday
          dayMargin = UserStor.userInfo.mount_sat || 0;
          break;
      }
      //      console.log('dayMargin',dayMargin);
      OrderStor.order.mounting_price = GeneralServ.roundingValue(OrderStor.order.mounting_price * (1 + (dayMargin/100)));
    }



    function calculateInstalmentPrice(price, pricePrimary, priceDis, pricePrimaryDis) {
      if(OrderStor.order.is_instalment) {
        OrderStor.order.payment_first = GeneralServ.roundingValue( (price * OrderStor.order.selectedInstalmentPercent / 100) );
        OrderStor.order.payment_monthly = GeneralServ.roundingValue( ((price - OrderStor.order.payment_first) / OrderStor.order.selectedInstalmentPeriod) );
        OrderStor.order.paymentFirstDis = GeneralServ.roundingValue( (priceDis * OrderStor.order.selectedInstalmentPercent / 100) );
        OrderStor.order.paymentMonthlyDis = GeneralServ.roundingValue( ((priceDis - OrderStor.order.paymentFirstDis) / OrderStor.order.selectedInstalmentPeriod) );
        if(pricePrimary) {
          OrderStor.order.payment_first_primary = GeneralServ.roundingValue( (pricePrimary * OrderStor.order.selectedInstalmentPercent / 100) );
          OrderStor.order.payment_monthly_primary = GeneralServ.roundingValue( ((pricePrimary - OrderStor.order.payment_first_primary) / OrderStor.order.selectedInstalmentPeriod) );
          OrderStor.order.paymentFirstPrimaryDis = GeneralServ.roundingValue( (pricePrimaryDis * OrderStor.order.selectedInstalmentPercent / 100) );
          OrderStor.order.paymentMonthlyPrimaryDis = GeneralServ.roundingValue( ((pricePrimaryDis - OrderStor.order.paymentFirstPrimaryDis) / OrderStor.order.selectedInstalmentPeriod) );
        }
      }
    }



    /**-------- Calculate Total Order Price ------------*/

    function calculateTotalOrderPrice() {
      //playSound('price');

      OrderStor.order.order_price = 0;
      OrderStor.order.order_price_dis = 0;

      //----- add mounting margin by Day
      setMountingMarginDay();

      //----- add product prices, floor price, assembling price
      //OrderStor.order.order_price = GeneralServ.roundingValue(OrderStor.order.products_price + OrderStor.order.floor_price + OrderStor.order.mounting_price);
      OrderStor.order.order_price = OrderStor.order.products_price;
      OrderStor.order.order_price_dis = GeneralServ.roundingValue(OrderStor.order.productsPriceDis + OrderStor.order.floor_price + OrderStor.order.mounting_price);

      //----- save primary total price
      OrderStor.order.order_price_primary = angular.copy(OrderStor.order.order_price);
      OrderStor.order.orderPricePrimaryDis = angular.copy(OrderStor.order.order_price_dis);

      //----- add delivery price if order edit
      if(OrderStor.order.delivery_price) {
        if(OrderStor.order.is_date_price_more) {
          if(CartStor.cart.marginDeliveyPlant) {
            OrderStor.order.order_price += (OrderStor.order.products_price * CartStor.cart.marginDeliveyPlant / 100);
          }
          OrderStor.order.order_price_dis += OrderStor.order.delivery_price;
        } else if(OrderStor.order.is_date_price_less) {
          if(CartStor.cart.discountDeliveyPlant) {
            OrderStor.order.order_price -= (OrderStor.order.products_price * CartStor.cart.discountDeliveyPlant / 100);
          }
          OrderStor.order.order_price_dis -= OrderStor.order.delivery_price;
        } else {
          var default_delivery_plant = GlobalStor.global.deliveryCoeff.percents[GlobalStor.global.deliveryCoeff.standart_time];
          if(default_delivery_plant) {
            OrderStor.order.order_price -= (OrderStor.order.products_price * default_delivery_plant / 100);
          }
        }
      }

      OrderStor.order.order_price = GeneralServ.roundingValue(OrderStor.order.order_price);
      OrderStor.order.order_price_dis = GeneralServ.roundingValue(OrderStor.order.order_price_dis);
      CartStor.cart.discountPriceDiff = GeneralServ.roundingValue(OrderStor.order.order_price - OrderStor.order.order_price_dis);

      //------ get price with instalment
      calculateInstalmentPrice(OrderStor.order.order_price, OrderStor.order.order_price_primary, OrderStor.order.order_price_dis, OrderStor.order.orderPricePrimaryDis);
    }







    /**------- Select dropdown MENU item ---------------*/

    function selectFloorPrice(currDelivery) {
      if(OrderStor.order.floor_id !== currDelivery.id) {
        OrderStor.order.floor_id = currDelivery.id;
        if(currDelivery.id) {
          OrderStor.order.floorName = currDelivery.name;
          OrderStor.order.floor_price = currDelivery.priceReal;
          OrderStor.order.delivery_user_id = currDelivery.user_id;
        } else {
          OrderStor.order.floorName = '';
          OrderStor.order.floor_price = 0;
          OrderStor.order.delivery_user_id = 0;
        }
        calculateTotalOrderPrice();
      }
    }

    function selectAssembling(currAssemb) {
      if(OrderStor.order.mounting_id !== currAssemb.id) {
        OrderStor.order.mounting_id = currAssemb.id;
        if(currAssemb.id) {
          OrderStor.order.mountingName = currAssemb.name;
          OrderStor.order.mounting_price = currAssemb.priceReal;
          OrderStor.order.mounting_user_id = currAssemb.user_id;
        } else {
          OrderStor.order.mountingName = '';
          OrderStor.order.mounting_price = 0;
          OrderStor.order.mounting_user_id = 0;
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


    function changeProductPriceAsDiscount(discount) {
      var productQty = OrderStor.order.products.length,
          tempPrice;
      while(--productQty > -1) {
        tempPrice = GeneralServ.setPriceDis(OrderStor.order.products[productQty].template_price, discount) + OrderStor.order.products[productQty].addelemPriceDis;
        OrderStor.order.products[productQty].productPriceDis = angular.copy( GeneralServ.roundingValue(tempPrice));
      }
    }


    /**-------- Calculate All Products Price ----------------*/

    function calculateAllProductsPrice() {
      var productsQty = OrderStor.order.products.length;
      OrderStor.order.templates_price = 0;
      OrderStor.order.addelems_price = 0;
      OrderStor.order.products_price = 0;
      OrderStor.order.productsPriceDis = 0;
      CartStor.cart.squareTotal = 0;
      CartStor.cart.perimeterTotal = 0;
      CartStor.cart.qtyTotal = 0;
      while(--productsQty > -1) {
        OrderStor.order.addelems_price += OrderStor.order.products[productsQty].addelem_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.templates_price += OrderStor.order.products[productsQty].template_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.products_price += OrderStor.order.products[productsQty].product_price * OrderStor.order.products[productsQty].product_qty;
        OrderStor.order.productsPriceDis += OrderStor.order.products[productsQty].productPriceDis * OrderStor.order.products[productsQty].product_qty;
        //------ data for cuclulate Supply and Mounting Prices Submenu
        CartStor.cart.squareTotal += (OrderStor.order.products[productsQty].template_square * OrderStor.order.products[productsQty].product_qty);
        CartStor.cart.perimeterTotal += 0.002 * (OrderStor.order.products[productsQty].template_width + OrderStor.order.products[productsQty].template_height) * OrderStor.order.products[productsQty].product_qty;
        CartStor.cart.qtyTotal += OrderStor.order.products[productsQty].product_qty;
      }
      OrderStor.order.addelems_price = GeneralServ.roundingValue(OrderStor.order.addelems_price);
      OrderStor.order.templates_price = GeneralServ.roundingValue(OrderStor.order.templates_price);
      OrderStor.order.products_price = GeneralServ.roundingValue(OrderStor.order.products_price);
      CartStor.cart.squareTotal = GeneralServ.roundingValue(CartStor.cart.squareTotal);
      CartStor.cart.perimeterTotal = GeneralServ.roundingValue(CartStor.cart.perimeterTotal);
      CartStor.cart.qtyTotal = GeneralServ.roundingValue(CartStor.cart.qtyTotal);

      /** if default user discount = 0 */
      if(OrderStor.order.productsPriceDis) {
        OrderStor.order.productsPriceDis = GeneralServ.roundingValue(OrderStor.order.productsPriceDis);
      } else {
        OrderStor.order.productsPriceDis = angular.copy(OrderStor.order.products_price);
      }
    }



    function changeAddElemPriceAsDiscount(discount) {
      var productQty = OrderStor.order.products.length,
          templatePriceDis, addElemsQty, elemQty,
          prod, elem, item;
      for(prod = 0; prod < productQty; prod++) {
        templatePriceDis =  OrderStor.order.products[prod].productPriceDis - OrderStor.order.products[prod].addelemPriceDis;
        OrderStor.order.products[prod].addelemPriceDis = GeneralServ.setPriceDis(OrderStor.order.products[prod].addelem_price, discount);
        OrderStor.order.products[prod].productPriceDis = GeneralServ.roundingValue(templatePriceDis + OrderStor.order.products[prod].addelemPriceDis);

        addElemsQty = OrderStor.order.products[prod].chosenAddElements.length;
        for(elem = 0; elem < addElemsQty; elem++) {
          elemQty = OrderStor.order.products[prod].chosenAddElements[elem].length;
          if (elemQty > 0) {
            for (item = 0; item < elemQty; item++) {
              OrderStor.order.products[prod].chosenAddElements[elem][item].elementPriceDis = GeneralServ.setPriceDis(OrderStor.order.products[prod].chosenAddElements[elem][item].element_price, discount);
            }
          }
        }
      }
      /** recollect AllAddElements for Details */
      joinAllAddElements();
    }



    function culcDeliveyPriceByDiscPlant() {
      OrderStor.order.delivery_price = GeneralServ.roundingValue(OrderStor.order.productsPriceDis * CartStor.cart.discountDeliveyPlant / 100);
    }

    function culcDeliveryPriceByMargPlant() {
      OrderStor.order.delivery_price = GeneralServ.roundingValue(OrderStor.order.productsPriceDis * CartStor.cart.marginDeliveyPlant / 100);
    }

    function hideDeliveryPriceOnCalendar() {
      OrderStor.order.is_date_price_less = 0;
      OrderStor.order.is_date_price_more = 0;
      OrderStor.order.is_old_price = 0;
    }



    /**-------------- Calendar -----------------*/

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
        //------- set default User discount
        MainServ.setCurrDiscounts();
        changeAddElemPriceAsDiscount(OrderStor.order.discount_addelem);
        changeProductPriceAsDiscount(OrderStor.order.discount_construct);
        calculateAllProductsPrice();

        var marginIndex = Math.abs(GlobalStor.global.deliveryCoeff.standart_time + qtyDays);
        CartStor.cart.marginDeliveyPlant = +GlobalStor.global.deliveryCoeff.percents[marginIndex];
//        console.info('margin', margin);
        if(CartStor.cart.marginDeliveyPlant) {
          culcDeliveryPriceByMargPlant();
          OrderStor.order.is_date_price_more = 1;
          OrderStor.order.is_date_price_less = 0;
          OrderStor.order.is_old_price = 1;
        } else {
          hideDeliveryPriceOnCalendar();
        }

      //------ default delivery date
      } else {
        //------- set default User discount
        MainServ.setCurrDiscounts();
        changeAddElemPriceAsDiscount(OrderStor.order.discount_addelem);
        changeProductPriceAsDiscount(OrderStor.order.discount_construct);
        calculateAllProductsPrice();
        hideDeliveryPriceOnCalendar();
      }
      OrderStor.order.new_delivery_date = newDate.getTime();
      calculateTotalOrderPrice();
    }



    function setMenuItemPriceReal(items) {
      if(items) {
        var itemQty = items.length;
        while(--itemQty > -1) {
          if(items[itemQty].type) {
            switch(items[itemQty].type) {
              case 1: //----- Цена за 1 конструкцию
                items[itemQty].priceReal = Math.round(items[itemQty].price * CartStor.cart.qtyTotal);
                break;
              case 2: //----- Цена за 1 м2 конструкции
                items[itemQty].priceReal = Math.round(items[itemQty].price * CartStor.cart.squareTotal);
                break;
              case 3: //----- Цена за 1 м/п конструкции
                items[itemQty].priceReal = Math.round(items[itemQty].price * CartStor.cart.perimeterTotal);
                break;
              case 4: //----- Цена как % от стоимости
                items[itemQty].priceReal = Math.round(OrderStor.order.productsPriceDis * items[itemQty].price/100);
                break;
              default:
                items[itemQty].priceReal = Math.round(items[itemQty].price); //----- type = 5 price per order
                break;
            }
          }
        }
      }
    }




    /**------------- Calculate Order Price --------------*/

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

      /** set Supply & Mounting Price for submenu items*/
      setMenuItemPriceReal(GlobalStor.global.supplyData);
      setMenuItemPriceReal(GlobalStor.global.assemblingData);
    }





    /**-------- open/close discount block --------*/

    function openDiscountBlock() {
      CartStor.cart.tempConstructDisc = +OrderStor.order.discount_construct;
      CartStor.cart.tempAddelemDisc = +OrderStor.order.discount_addelem;
      CartStor.cart.isShowDiscount = 1;
    }

    function closeDiscountBlock() {
      CartStor.cart.isShowDiscount = 0;
    }

    function swipeDiscountBlock() {
      if(!CartStor.cart.isShowDiscount) {
        CartStor.cart.tempConstructDisc = +OrderStor.order.discount_construct;
        CartStor.cart.tempAddelemDisc = +OrderStor.order.discount_addelem;
      }
      CartStor.cart.isShowDiscount = !CartStor.cart.isShowDiscount;
    }


    function checkNewDiscount(discount) {
      if(discount == null) {
        discount = 0;
      } else if(discount % 1) {
        //--- float
        discount = parseFloat(discount.toFixed(1));
      }
      return discount;
    }



    function approveNewDisc(type) {
      //console.info(CartStor.cart.tempConstructDisc);
      if(type) {
        //------- discount x add element
        CartStor.cart.tempAddelemDisc = checkNewDiscount(CartStor.cart.tempAddelemDisc);
        if(CartStor.cart.tempAddelemDisc > UserStor.userInfo.discountAddElemMax) {
          CartStor.cart.tempAddelemDisc = +UserStor.userInfo.discountAddElemMax;
        }
        OrderStor.order.discount_addelem = +CartStor.cart.tempAddelemDisc;
        changeAddElemPriceAsDiscount(OrderStor.order.discount_addelem);

      } else {
        //------- discount x construction
        CartStor.cart.tempConstructDisc = checkNewDiscount(CartStor.cart.tempConstructDisc);
        if(CartStor.cart.tempConstructDisc > UserStor.userInfo.discountConstrMax) {
          CartStor.cart.tempConstructDisc = +UserStor.userInfo.discountConstrMax;
        }
        OrderStor.order.discount_construct = +CartStor.cart.tempConstructDisc;
        changeProductPriceAsDiscount(OrderStor.order.discount_construct);
      }
      //----------- start order price total calculation
      calculateOrderPrice();
    }






    /** ========== Orders Dialogs ====== */

    function setDefaultCustomerData() {
      CartStor.cart.customer.customer_city_id = arguments[0];
      CartStor.cart.customer.customer_city = arguments[1];
      CartStor.cart.customer.customer_location = arguments[2];
    }

    /**----------- Close any Order Dialog ------------*/

    function closeOrderDialog() {
      CartStor.cart.submitted = 0;
      CartStor.cart.isCityBox = 0;
      if(GlobalStor.global.orderEditNumber > 0) {
        CartStor.fillOrderForm();
      } else{
        setDefaultCustomerData(OrderStor.order.customer_city_id, OrderStor.order.customer_city, OrderStor.order.customer_location);
        CartStor.cart.customer.customer_sex = 0;
      }
      CartStor.cart.isMasterDialog = 0;
      CartStor.cart.isOrderDialog = 0;
      CartStor.cart.isCreditDialog = 0;
    }

    /**---------- send Order in Local DB ------------*/

    function sendOrder() {
      var orderStyle;
      GlobalStor.global.isLoader = 1;
      //------- set order style
      if(CartStor.cart.isMasterDialog) {
        orderStyle = 'master';
      } else {
        orderStyle = 'order';
      }

      MainServ.saveOrderInDB(CartStor.cart.customer, 1, orderStyle).then(function() {
        //--------- Close cart dialog, go to history
        closeOrderDialog();
        //------- set previos Page
        GeneralServ.setPreviosPage();
        GlobalStor.global.isLoader = 0;
        $location.path('/history');
      });
    }


    function changeLocation() {
      if(CartStor.cart.customer.customer_location) {
        CartStor.cart.isCityBox = 1;
      } else {
        CartStor.cart.isCityBox = 0;
      }
    }

    /**------------ Select City in Order Dialogs -------------*/

    function selectCity(location) {
      setDefaultCustomerData(location.cityId, location.cityName, location.fullLocation);
      CartStor.cart.isCityBox = 0;
    }







    /**========== FINISH ==========*/

    thisFactory.publicObj = {
      joinAllAddElements: joinAllAddElements,
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
      openDiscountBlock: openDiscountBlock,
      closeDiscountBlock: closeDiscountBlock,
      swipeDiscountBlock: swipeDiscountBlock,
      approveNewDisc: approveNewDisc,

      //---- sent order
      closeOrderDialog: closeOrderDialog,
      changeLocation: changeLocation,
      selectCity: selectCity,
      sendOrder: sendOrder
    };

    return thisFactory.publicObj;

  });
})();
