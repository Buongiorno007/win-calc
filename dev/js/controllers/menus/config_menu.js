(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('ConfigMenuCtrl',

      function ($location,
                $filter,
                $timeout,
                $scope,
                globalConstants,
                GeneralServ,
                loginServ,
                MainServ,
                AddElementMenuServ,
                DesignServ,
                GlobalStor,
                OrderStor,
                ProductStor,
                DesignStor,
                UserStor,
                CartStor,
                InfoBoxServ,
                ConfigMenuServ,
                CartMenuServ,
                LightServ) {
        /*jshint validthis:true */
        var thisCtrl = this;
        thisCtrl.constants = globalConstants;
        thisCtrl.G = GlobalStor;
        thisCtrl.O = OrderStor;
        thisCtrl.P = ProductStor;
        thisCtrl.U = UserStor;

        thisCtrl.config = {
          TOOLTIP: [
            '',
            $filter('translate')('mainpage.TEMPLATE_TIP'),
            $filter('translate')('mainpage.PROFILE_TIP'),
            $filter('translate')('mainpage.GLASS_TIP')
          ],
          DELAY_START: globalConstants.STEP,
          DELAY_SHOW_CONFIG_LIST: 5 * globalConstants.STEP,
          DELAY_SHOW_FOOTER: 5 * globalConstants.STEP,
          DELAY_TYPE_ITEM_TITLE: 10 * globalConstants.STEP,
          DELAY_SHOW_U_COEFF: 20 * globalConstants.STEP,
          DELAY_GO_TO_CART: 2 * globalConstants.STEP,
          typing: 'on'
        };

        //------- translate
        thisCtrl.CONFIGMENU_CONFIGURATION = $filter('translate')('mainpage.CONFIGMENU_CONFIGURATION');
        thisCtrl.CONFIGMENU_SIZING = $filter('translate')('mainpage.CONFIGMENU_SIZING');
        thisCtrl.MM = $filter('translate')('mainpage.MM');
        thisCtrl.CONFIGMENU_PROFILE = $filter('translate')('mainpage.CONFIGMENU_PROFILE');
        thisCtrl.CONFIGMENU_GLASS = $filter('translate')('mainpage.CONFIGMENU_GLASS');
        thisCtrl.CONFIGMENU_HARDWARE = $filter('translate')('mainpage.CONFIGMENU_HARDWARE');
        thisCtrl.CONFIGMENU_LAMINATION = $filter('translate')('mainpage.CONFIGMENU_LAMINATION');
        thisCtrl.CONFIGMENU_LAMINATION_TYPE = $filter('translate')('mainpage.CONFIGMENU_LAMINATION_TYPE');
        thisCtrl.CONFIGMENU_ADDITIONAL = $filter('translate')('mainpage.CONFIGMENU_ADDITIONAL');
        thisCtrl.CONFIGMENU_NO_ADDELEMENTS = $filter('translate')('mainpage.CONFIGMENU_NO_ADDELEMENTS');
        thisCtrl.CONFIGMENU_IN_CART = $filter('translate')('mainpage.CONFIGMENU_IN_CART');
        thisCtrl.SAVE = $filter('translate')('settings.SAVE');
        thisCtrl.LETTER_M = $filter('translate')('common_words.LETTER_M');
        thisCtrl.COUNT = $filter('translate')('common_words.COUNT');
        thisCtrl.HEATCOEF_VAL = $filter('translate')('mainpage.HEATCOEF_VAL');
        thisCtrl.ATENTION = $filter('translate')('natification.ATENTION');
        thisCtrl.ATENTION_MSG1 = $filter('translate')('natification.ATENTION_MSG1');
        thisCtrl.ATENTION_MSG2 = $filter('translate')('natification.ATENTION_MSG2');


        /**============ METHODS ================*/


        //------- Select menu item


        function saveProduct(go_to_cart) {
          GlobalStor.global.showCoefInfoBlock = 0;
          GlobalStor.global.servicesPriceIndex = -1;
          GlobalStor.global.continued = 0;
          ProductStor.product.product_qty = GlobalStor.global.product_qty;

          if (MainServ.inputProductInOrder()) {
            //--------- moving to Cart when click on Cart button
            if (go_to_cart) {
              MainServ.goToCart();
            }
            GlobalStor.global.construction_count = 0;
            OrderStor.order.products.forEach(function (product) {
              GlobalStor.global.construction_count += product.product_qty;
            });
          }
        }


        function alert() {
          GlobalStor.global.nameAddElem = [];
          var name = '';
          var product = 0;
          var tr = '';
          for (var u = 0; u < ProductStor.product.chosenAddElements.length; u += 1) {
            for (var f = 0; f < ProductStor.product.chosenAddElements[u].length; f += 1) {
              var obj = {
                name: '',
                product: 0,
                tr: '',
                list: 0
              };
              for (var y = 0; y < GlobalStor.global.dataProfiles.length; y += 1) {
                if (ProductStor.product.chosenAddElements[u][f].parent_element_id === GlobalStor.global.dataProfiles[y].element_id) {
                  obj.tr = ProductStor.product.chosenAddElements[u][f].name;
                } else {
                  obj.name = ProductStor.product.chosenAddElements[u][f].name;
                  obj.list = ProductStor.product.chosenAddElements[u][f].list_group_id;
                }
              }
              GlobalStor.global.nameAddElem.push(obj)
            }
          }
          for (var d = 0; d < GlobalStor.global.nameAddElem.length; d += 1) {
            if (GlobalStor.global.nameAddElem[d].name === GlobalStor.global.nameAddElem[d].tr || GlobalStor.global.nameAddElem[d].list === 20) {
              delete GlobalStor.global.nameAddElem[d].name;
            }
          }
          for (var d = 0; d < GlobalStor.global.nameAddElem.length; d += 1) {
            if (GlobalStor.global.nameAddElem[d].name !== undefined && GlobalStor.global.continued === 0 && ProductStor.product.is_addelem_only === 0) {
              GlobalStor.global.dangerAlert = 1;
            }
          }
        }

        function checkForAddElem(go_to_cart) {
          console.log(ProductStor.product);
          // ProductStor.product.template_source.report = ProductStor.product.report;
          if (!GlobalStor.global.isZeroPriceList.length) {
            if (!ProductStor.product.is_addelem_only) {
              alert();
              if (GlobalStor.global.dangerAlert < 1) {
                if (ProductStor.product.beadsData.length > 0) {
                  if (!OrderStor.order.products.length) {
                    $('#qty').hide().show(0);
                    saveProduct(go_to_cart);
                  } else if (GlobalStor.global.isNewTemplate) {
                    $('#qty').hide().show(0);
                    saveProduct();
                  } else if (!GlobalStor.global.isChangedTemplate) {
                    //  ALERT
                    GlobalStor.global.isNoChangedProduct = 1;
                  } else {
                    $('#qty').hide().show(0);
                    saveProduct(go_to_cart);
                  }
                } else {
                  GeneralServ.isErrorProd(
                    $filter('translate')('common_words.ERROR_PROD_BEADS')
                  );
                }
              }
            } else {
              saveProduct();
            }
          } else {
            var msg = thisCtrl.ATENTION_MSG1;//+" "+GlobalStor.global.isZeroPriceList+" "+thisCtrl.ATENTION_MSG2;
            console.log(GlobalStor.global.isZeroPriceList);
            GlobalStor.global.isZeroPriceList.forEach(function (ZeroElem) {
              msg += " " + ZeroElem + "\n";
            });
            msg += " \n" + thisCtrl.ATENTION_MSG2;
            GeneralServ.infoAlert(
              thisCtrl.ATENTION,
              msg
            );
          }

        }

        function showNextTip() {
          var tipQty = thisCtrl.config.TOOLTIP.length;
          GlobalStor.global.configMenuTips += 1;
          if (GlobalStor.global.configMenuTips === tipQty) {
            GlobalStor.global.configMenuTips = 0;
            //------ open templates
            //GlobalStor.global.activePanel = 1;
            //------ close rooms
            //GlobalStor.global.showRoomSelectorDialog = 0;
          }
        }

        function cartButton() {
          if (GlobalStor.global.locations.cities.length === 1) {
            loginServ.downloadAllCities(1);
          }
          GlobalStor.global.showKarkas = 0;
          GlobalStor.global.showConfiguration = 0;
          GlobalStor.global.showCart = 1;
          GlobalStor.global.activePanel = 0;
          CartMenuServ.calculateOrderPrice();
          CartMenuServ.joinAllAddElements();
        }

        function configButton() {
          DesignServ.deselectAllDimension();
          GlobalStor.global.showKarkas = 0;
          GlobalStor.global.showConfiguration = 1;
          GlobalStor.global.showCart = 0;
          GlobalStor.global.isSizeCalculator = 0;
          GlobalStor.global.activePanel = 0;
          CartStor.cart.isShowDiscount = 0;
          if ($location.path() === "/light") {
            ProductStor.product.template_source = DesignStor.design.templateSourceTEMP;
            ProductStor.product.template = DesignStor.design.templateTEMP;
          }
          setTimeout(function () {
            DesignServ.rebuildSVGTemplate();
          }, 250);
        }

        function karkasButton() {
          DesignServ.deselectAllDimension();
          GlobalStor.global.showKarkas = 1;
          GlobalStor.global.showConfiguration = 0;
          GlobalStor.global.showCart = 0;
          GlobalStor.global.isSizeCalculator = 0;
          GlobalStor.global.activePanel = 0;
          CartStor.cart.isShowDiscount = 0;
          if ($location.path() === "/light") {
            ProductStor.product.template_source = DesignStor.design.templateSourceTEMP;
            ProductStor.product.template = DesignStor.design.templateTEMP;
          }
          setTimeout(function () {
            DesignServ.rebuildSVGTemplate();
          }, 250);
        }

        function setCount() {
          if ($(".prodCounter").val() == 0 || (typeof(parseInt($(".prodCounter").val())) !== "number")) {
            GlobalStor.global.product_qty = 1;
          } else {
            GlobalStor.global.product_qty = parseInt($(".prodCounter").val());
          }
        }

        function saveProdAndGoToCart(go_to_cart) {
          checkForAddElem();
        }

        function saveAlert() {
          GeneralServ.confirmAlert(
            $filter('translate')('common_words.SAVE_OR_NO'),
            $filter('translate')('  '),
            saveProdAndGoToCart
          );
          GeneralServ.confirmPath(
            MainServ.goToCart
          );
        }

        function checkSavingProduct() {
          GlobalStor.global.isBox = 0;
          if (GlobalStor.global.isChangedTemplate) {
            GlobalStor.global.isSavingAlert = 1;
            saveAlert();
          } else {
            MainServ.goToCart();
          }
        }

        /**========== FINISH ==========*/

        //------ clicking
        thisCtrl.cartButton = cartButton;
        thisCtrl.configButton = configButton;
        thisCtrl.karkasButton = karkasButton;
        thisCtrl.setCount = setCount;
        thisCtrl.inputProductInOrder = saveProduct;
        thisCtrl.showNextTip = showNextTip;
        thisCtrl.alert = alert;
        thisCtrl.checkForAddElem = checkForAddElem;
        thisCtrl.checkSavingProduct = checkSavingProduct;

        thisCtrl.addProdQty = LightServ.addProdQty;
        thisCtrl.subtractProdQty = LightServ.subtractProdQty;
        thisCtrl.autoShowInfoBox = InfoBoxServ.autoShowInfoBox;
        thisCtrl.selectConfigPanel = ConfigMenuServ.selectConfigPanel;
        thisCtrl.goToCart = MainServ.goToCart;


      });
})();
