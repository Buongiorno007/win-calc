(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('CartModule')
        .controller('CartCtrl',
            function ($filter,
                      $location,
                      globalConstants,
                      GlobalStor,
                      OrderStor,
                      ProductStor,
                      UserStor,
                      CartStor,
                      CartServ,
                      CartMenuServ,
                      MainServ,
                      DesignServ) {
                /*jshint validthis:true */
                var thisCtrl = this;
                thisCtrl.constants = globalConstants;
                thisCtrl.G = GlobalStor;
                thisCtrl.O = OrderStor;
                thisCtrl.U = UserStor;
                thisCtrl.C = CartStor;

                thisCtrl.config = {
                    currDisConstr: 0,
                    isAddElementDetail: 0,
                    isCartLightView: 0,
                    detailProductIndex: 0,
                    isProductComment: 0,

                    element: $filter('translate')('add_elements.ELEMENT'),
                    elementa: $filter('translate')('add_elements.ELEMENTA'),
                    elements: $filter('translate')('add_elements.ELEMENTS'),
                    DELAY_START: globalConstants.STEP,
                    typing: 'on'
                };

                //------- translate
                thisCtrl.ALL_ADD_ELEMENTS = $filter('translate')('cart.ALL_ADD_ELEMENTS');
                thisCtrl.ADD_ORDER = $filter('translate')('cart.ADD_ORDER');
                thisCtrl.LETTER_M = $filter('translate')('common_words.LETTER_M');
                thisCtrl.HEATCOEF_VAL = $filter('translate')('mainpage.HEATCOEF_VAL');
                thisCtrl.MM = $filter('translate')('mainpage.MM');
                thisCtrl.INCH = $filter('translate')('mainpage.INCH');
                thisCtrl.CONFIGMENU_SIZING = $filter('translate')('mainpage.CONFIGMENU_SIZING');
                thisCtrl.CONFIGMENU_PROFILE = $filter('translate')('mainpage.CONFIGMENU_PROFILE');
                thisCtrl.CONFIGMENU_GLASS = $filter('translate')('mainpage.CONFIGMENU_GLASS');
                thisCtrl.CONFIGMENU_HARDWARE = $filter('translate')('mainpage.CONFIGMENU_HARDWARE');
                thisCtrl.CONFIGMENU_LAMINATION_TYPE = $filter('translate')('mainpage.CONFIGMENU_LAMINATION_TYPE');
                thisCtrl.CONFIGMENU_LAMINATION = $filter('translate')('mainpage.CONFIGMENU_LAMINATION');
                thisCtrl.CONFIGMENU_ADDITIONAL = $filter('translate')('mainpage.CONFIGMENU_ADDITIONAL');
                thisCtrl.PRODUCT_QTY = $filter('translate')('cart.PRODUCT_QTY');
                thisCtrl.ORDER_COMMENT = $filter('translate')('cart.ORDER_COMMENT');
                thisCtrl.LIGHT_VIEW = $filter('translate')('cart.LIGHT_VIEW');
                thisCtrl.DISCOUNT_SELECT = $filter('translate')('cart.DISCOUNT_SELECT');
                thisCtrl.MAX = $filter('translate')('common_words.MAX');
                thisCtrl.DISCOUNT_WINDOW = $filter('translate')('cart.DISCOUNT_WINDOW');
                thisCtrl.DISCOUNT_ADDELEM = $filter('translate')('cart.DISCOUNT_ADDELEM');
                thisCtrl.DISCOUNT_SERVICE = $filter('translate')('cart.DISCOUNT_SERVICE');
                thisCtrl.DISCOUNT = $filter('translate')('cart.DISCOUNT');
                thisCtrl.DISCOUNT_WITHOUT = $filter('translate')('cart.DISCOUNT_WITHOUT');
                thisCtrl.DISCOUNT_WITH = $filter('translate')('cart.DISCOUNT_WITH');
                thisCtrl.DELIVERY_MOUNTINGS = $filter('translate')('cart.DELIVERY_MOUNTINGS');
                thisCtrl.FULL_VIEW = $filter('translate')('cart.FULL_VIEW');
                thisCtrl.ORDER_LV = $filter('translate')('cart.ORDER_LV');
                thisCtrl.ADDELEMENTS_EDIT_LIST = $filter('translate')('cart.ADDELEMENTS_EDIT_LIST');
                thisCtrl.WIDTH_LABEL = $filter('translate')('add_elements.WIDTH_LABEL');
                thisCtrl.HEIGHT_LABEL = $filter('translate')('add_elements.HEIGHT_LABEL');
                thisCtrl.QTY_LABEL = $filter('translate')('add_elements.QTY_LABEL');
                thisCtrl.ADDELEMENTS_PRODUCT_COST = $filter('translate')('cart.ADDELEMENTS_PRODUCT_COST');
                thisCtrl.GRID = $filter('translate')('add_elements.GRID');
                thisCtrl.VISOR = $filter('translate')('add_elements.VISOR');
                thisCtrl.SPILLWAY = $filter('translate')('add_elements.SPILLWAY');
                thisCtrl.OUTSIDE = $filter('translate')('add_elements.OUTSIDE');
                thisCtrl.LOUVERS = $filter('translate')('add_elements.LOUVERS');
                thisCtrl.INSIDE = $filter('translate')('add_elements.INSIDE');
                thisCtrl.CONNECTORS = $filter('translate')('add_elements.CONNECTORS');
                thisCtrl.FAN = $filter('translate')('add_elements.FAN');
                thisCtrl.WINDOWSILL = $filter('translate')('add_elements.WINDOWSILL');
                thisCtrl.HANDLEL = $filter('translate')('add_elements.HANDLEL');
                thisCtrl.OTHERS = $filter('translate')('add_elements.OTHERS');
                thisCtrl.ADD = $filter('translate')('add_elements.ADD');
                thisCtrl.SORT_SHOW = $filter('translate')('history.SORT_SHOW');
                thisCtrl.NAVMENU_ADD_ELEMENTS = $filter('translate')('mainpage.NAVMENU_ADD_ELEMENTS');
                //---- add elements pannel
                thisCtrl.NAME_LABEL = $filter('translate')('add_elements.NAME_LABEL');
                thisCtrl.TOTAL_PRICE_TXT = $filter('translate')('add_elements.TOTAL_PRICE_TXT');
                thisCtrl.TOTAL_PRICE_SHORT = $filter('translate')('add_elements.TOTAL_PRICE_SHORT');
                thisCtrl.PRICE = $filter('translate')('add_elements.PRICE');
                thisCtrl.LINK_BETWEEN_COUPLE = $filter('translate')('cart.LINK_BETWEEN_COUPLE');
                thisCtrl.LINK_BETWEEN_ALL = $filter('translate')('cart.LINK_BETWEEN_ALL');
                thisCtrl.HEAT_TRANSFER = $filter('translate')('mainpage.HEAT_TRANSFER');

                thisCtrl.ADD_PRODUCT = $filter('translate')('cart.ADD_PRODUCT');
                thisCtrl.OTHER = $filter("translate")("add_elements.OTHER");
                thisCtrl.SERV1 = $filter("translate")("add_elements.SERV1");
                thisCtrl.SERV2 = $filter("translate")("add_elements.SERV2");
                thisCtrl.SERV3 = $filter("translate")("add_elements.SERV3");
                thisCtrl.SERV4 = $filter("translate")("add_elements.SERV4");

                thisCtrl.BUTTON_E = $filter("translate")("common_words.BUTTON_E");
                //------- set current Page
                if ($location.path() !== "/mobile") {
                    GlobalStor.global.currOpenPage = 'cart';
                }
                OrderStor.order.products = _.sortBy(OrderStor.order.products, 'product_id', '0');
                GlobalStor.global.productEditNumber = 0;
                //------- collect all AddElements of Order
                CartMenuServ.joinAllAddElements();
                //----------- start order price total calculation
                CartMenuServ.calculateOrderPrice();

                CartMenuServ.calculateAverageDisc();

                // console.log('cart +++++', JSON.stringify(OrderStor.order));
                //-------- return from Main Page
                if (GlobalStor.global.prevOpenPage === 'main') {
                    //----- cleaning product
                    ProductStor.product = ProductStor.setDefaultProduct();
                }
                //------- set customer data per order dialogs
                if (!GlobalStor.global.orderEditNumber) {
                    CartStor.cart.customer.customer_location = OrderStor.order.customer_location;
                }

                /**============ METHODS ================*/

                //============= AddElements detail block
                //------- Show AddElements detail block for product
                function showAddElementDetail(productIndex) {
                    if ((CartStor.cart.allAddElements[productIndex].length > 0) || (coutNull(OrderStor.order.products[productIndex].services_price_arr))) {
                        //playSound('switching');
                        thisCtrl.config.detailProductIndex = productIndex;
                        thisCtrl.config.isAddElementDetail = true;
                    }
                }

                //--------- Close AddElements detail block
                function closeAddElementDetail() {
                    thisCtrl.config.isAddElementDetail = false;
                }

                //--------- Full/Light View switcher
                function viewSwitching() {
                    //playSound('swip');
                    thisCtrl.config.isCartLightView = !thisCtrl.config.isCartLightView;
                }


                function switchProductComment(index) {
                    var commId = index + 1;
                    thisCtrl.config.isProductComment = (thisCtrl.config.isProductComment === commId) ? 0 : commId;
                }

                function enterKeyPrice(e) {
                    e = e || window.event;
                    var keycode;
                    if (window.event) {
                        keycode = e.which ? window.event.which : window.event.keyCode;
                    }
                    if (keycode === 13) {
                        CartMenuServ.approveNewDisc(0)
                    }
                }

                var isFirefox = typeof InstallTrigger !== 'undefined';
                $(".discount-container").keyup(function () {
                    if (isFirefox) {
                        CartMenuServ.approveNewDisc(0);
                        CartMenuServ.approveNewDisc(1);
                        CartMenuServ.approveNewDisc(2);
                    }
                });

                function enterKeyDop(e) {
                    e = e || window.event;
                    var keycode;
                    if (window.event) {
                        keycode = e.which ? window.event.which : window.event.keyCode;
                    }
                    if (keycode === 13) {
                        CartMenuServ.approveNewDisc(1)
                    }
                }

                function enterKeyDopService(e) {
                    e = e || window.event;
                    var keycode;
                    if (window.event) {
                        keycode = e.which ? window.event.which : window.event.keyCode;
                    }
                    if (keycode === 13) {
                        CartMenuServ.approveNewDisc(2)
                    }
                }

                function pressEnterInDisc(keyEvent) {
                    //--------- Enter
                    if (keyEvent.which === 13) {
                        CartMenuServ.closeDiscountBlock();
                    }
                }

                function showCartTemplte(index) {
                    CartStor.cart.curProd = index;
                    setTimeout(function () {
                        DesignServ.initAllGlassXGlass();
                    }, 1000);

                    CartStor.cart.showCurrentTemp = 1;

                }

                function toggleDiscount() {
                    GlobalStor.global.toggleDiscount = !GlobalStor.global.toggleDiscount;
                }

                setTimeout(() => {
                    $('.product-container').scrollTop(70);
                }, 5);

                function coutNull(arr) {
                    var tmp = 0;
                    if (arr) {
                        arr.forEach(function (entry) {
                            (entry != 0) ? tmp++ : 0;
                        });
                    }
                    return tmp;
                }

                function showMoundDeliveryFunc() {
                    GlobalStor.global.showMountDelivery = !GlobalStor.global.showMountDelivery;
                }

                function cancelMoundDeliveryFunc() {
                    GlobalStor.global.showMountDelivery = !GlobalStor.global.showMountDelivery;
                    CartMenuServ.selectFloorPrice(0);
                    CartMenuServ.selectDisAssembling(0);
                    CartMenuServ.selectAssembling(0);
                    OrderStor.order.sale_price = 0;
                    OrderStor.order.delivery_add = 0;
                    OrderStor.order.delivery_garbage_removal = 0;
                    OrderStor.order.comment = '';
                }

                function keyUp(event) {
                    switch (event.which) {
                        case 8:
                            break;
                        case 13:
                            break;
                        case 48:
                        case 49:
                        case 50:
                        case 51:
                        case 52:
                        case 53:
                        case 54:
                        case 55:
                        case 56:
                        case 57:
                            break;
                        case 189:
                            // event.preventDefault();
                            break;
                        default:
                            event.preventDefault();
                            break;
                    }

                }

                /**========== FINISH ==========*/

                //------ clicking
                thisCtrl.decreaseProductQty = CartServ.decreaseProductQty;
                thisCtrl.increaseProductQty = CartServ.increaseProductQty;
                thisCtrl.addNewProductInOrder = CartServ.addNewProductInOrder;
                thisCtrl.clickDeleteProduct = CartServ.clickDeleteProduct;
                thisCtrl.createProductCopy = CartServ.createProductCopy;
                thisCtrl.addCloneProductInOrder = CartServ.addCloneProductInOrder;
                thisCtrl.openOrderDialog = CartServ.openOrderDialog;
                thisCtrl.openBox = CartServ.openBox;
                thisCtrl.box = CartServ.box;
                thisCtrl.mobileBox = CartServ.mobileBox;
                thisCtrl.fastEdit = CartServ.fastEdit;

                thisCtrl.keyUp = keyUp;
                thisCtrl.enterKeyPrice = enterKeyPrice;
                thisCtrl.enterKeyDop = enterKeyDop;
                thisCtrl.enterKeyDopService = enterKeyDopService;
                thisCtrl.toggleDiscount = toggleDiscount;
                thisCtrl.showAddElementDetail = showAddElementDetail;
                thisCtrl.closeAddElementDetail = closeAddElementDetail;
                thisCtrl.viewSwitching = viewSwitching;
                thisCtrl.switchProductComment = switchProductComment;
                thisCtrl.pressEnterInDisc = pressEnterInDisc;
                thisCtrl.showCartTemplte = showCartTemplte;
                thisCtrl.coutNull = coutNull;
                thisCtrl.showMoundDeliveryFunc = showMoundDeliveryFunc;
                thisCtrl.cancelMoundDeliveryFunc = cancelMoundDeliveryFunc;


                thisCtrl.calculateAverageDisc = CartMenuServ.calculateAverageDisc;
                thisCtrl.showAllAddElements = CartServ.showAllAddElements;
                thisCtrl.openDiscountBlock = CartMenuServ.openDiscountBlock;
                thisCtrl.closeDiscountBlock = CartMenuServ.closeDiscountBlock;
                thisCtrl.approveNewDisc = CartMenuServ.approveNewDisc;
                thisCtrl.swipeDiscountBlock = CartMenuServ.swipeDiscountBlock;


                thisCtrl.initAllGlassXGlass = DesignServ.initAllGlassXGlass;






                if ($location.path() !== "/mobile") {
                    $("#main-frame").removeClass("main-frame-mobView");
                    $("#app-container").removeClass("app-container-mobView");
                    $(window).load(function () {
                        MainServ.resize();
                    });
                    window.onresize = function () {
                        MainServ.resize();
                    };
                }
            });
})();