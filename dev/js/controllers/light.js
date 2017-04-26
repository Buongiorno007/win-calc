(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('LightModule')
    .controller('LightCtrl',

      function ($filter,
                $timeout,
                globalConstants,
                DesignServ,
                LightServ,
                GlobalStor,
                ProductStor,
                MainServ,
                CartServ,
                DesignStor,
                OrderStor,
                CartStor,
                UserStor) {
        var thisCtrl = this;

        thisCtrl.constants = globalConstants;
        thisCtrl.G = GlobalStor;
        thisCtrl.P = ProductStor;
        thisCtrl.D = DesignStor;
        thisCtrl.O = OrderStor;
        thisCtrl.U = UserStor;
        thisCtrl.C = CartStor;

        //------- set current Page
        GlobalStor.global.currOpenPage = 'light';

        thisCtrl.config = {
          //---- design menu
          DELAY_SHOW_FIGURE_ITEM: 1000,
          typing: 'on'
        };
        GlobalStor.global.isNavMenu = 0;
        GlobalStor.global.isConfigMenu = 1;

        //------- translate
        thisCtrl.TEXT1 = $filter('translate')('natification.TEXT1');
        thisCtrl.TEXT2 = $filter('translate')('natification.TEXT2');
        thisCtrl.TEXT3 = $filter('translate')('natification.TEXT3');
        thisCtrl.EDIT_HARDWARE = $filter('translate')('natification.EDIT_HARDWARE');
        thisCtrl.EDIT_SIZE = $filter('translate')('natification.EDIT_SIZE');
        thisCtrl.IMPOST_SHAPE = $filter('translate')('design.IMPOST_SHAPE');
        thisCtrl.SASH_SHAPE = $filter('translate')('design.SASH_SHAPE');
        thisCtrl.ANGEL_SHAPE = $filter('translate')('design.ANGEL_SHAPE');
        thisCtrl.ARCH_SHAPE = $filter('translate')('design.ARCH_SHAPE');
        thisCtrl.POSITION_SHAPE = $filter('translate')('design.POSITION_SHAPE');
        thisCtrl.UNITS_DESCRIP = $filter('translate')('design.UNITS_DESCRIP');
        thisCtrl.PROJECT_DEFAULT = $filter('translate')('design.PROJECT_DEFAULT');
        thisCtrl.BACK = $filter('translate')('common_words.BACK');
        thisCtrl.SAVE = $filter('translate')('settings.SAVE');
        thisCtrl.CANCEL = $filter('translate')('add_elements.CANCEL');
        thisCtrl.DOOR_CONFIG_LABEL = $filter('translate')('design.DOOR_CONFIG_LABEL');
        thisCtrl.DOOR_CONFIG_DESCTIPT = $filter('translate')('design.DOOR_CONFIG_DESCTIPT');
        thisCtrl.SASH_CONFIG_DESCTIPT = $filter('translate')('design.SASH_CONFIG_DESCTIPT');
        thisCtrl.HANDLE_CONFIG_DESCTIPT = $filter('translate')('design.HANDLE_CONFIG_DESCTIPT');
        thisCtrl.LOCK_CONFIG_DESCTIPT = $filter('translate')('design.LOCK_CONFIG_DESCTIPT');
        thisCtrl.STEP = $filter('translate')('design.STEP');
        thisCtrl.LABEL_DOOR_TYPE = $filter('translate')('design.LABEL_DOOR_TYPE');
        thisCtrl.LABEL_SASH_TYPE = $filter('translate')('design.LABEL_SASH_TYPE');
        thisCtrl.LABEL_HANDLE_TYPE = $filter('translate')('design.LABEL_HANDLE_TYPE');
        thisCtrl.LABEL_LOCK_TYPE = $filter('translate')('design.LABEL_LOCK_TYPE');
        thisCtrl.NOT_AVAILABLE = $filter('translate')('design.NOT_AVAILABLE');
        thisCtrl.DIM_EXTRA = $filter('translate')('design.DIM_EXTRA');
        thisCtrl.SQUARE_EXTRA = $filter('translate')('design.SQUARE_EXTRA');
        thisCtrl.ROOM_SELECTION = $filter('translate')('mainpage.ROOM_SELECTION');
        thisCtrl.TEST_STAGE = $filter('translate')('design.TEST_STAGE');
        thisCtrl.VOICE_SPEACH = $filter('translate')('design.VOICE_SPEACH');
        thisCtrl.BY_AXIS = $filter('translate')('design.BY_AXIS');
        thisCtrl.BY_GLASS = $filter('translate')('design.BY_GLASS');
        thisCtrl.CALC_PRICE = $filter('translate')('design.CALC_PRICE');


        thisCtrl.PROFILE_SYSTEM_SELECT = $filter('translate')('design.PROFILE_SYSTEM_SELECT');
        thisCtrl.GLASS_SELECT = $filter('translate')('design.GLASS_SELECT');
        thisCtrl.GLASS_SELECT_BIG = $filter('translate')('design.GLASS_SELECT_BIG');
        thisCtrl.HARDWARE_SELECT = $filter('translate')('design.HARDWARE_SELECT');
        thisCtrl.LEFT_TEXT_SELECT = $filter('translate')('design.LEFT_TEXT_SELECT');

        thisCtrl.SAVE = $filter('translate')('settings.SAVE');
        thisCtrl.KARKAS = $filter('translate')('mainpage.KARKAS');
        thisCtrl.KONFIG = $filter('translate')('mainpage.KONFIG');
        thisCtrl.CART = $filter('translate')('mainpage.CART');

        thisCtrl.AND = $filter('translate')('common_words.AND');
        thisCtrl.CONFIGMENU_SIZING = $filter('translate')('mainpage.CONFIGMENU_SIZING');
        thisCtrl.CONFIGMENU_PROFILE = $filter('translate')('mainpage.CONFIGMENU_PROFILE');
        thisCtrl.HEAT_TRANSFER = $filter('translate')('mainpage.HEAT_TRANSFER');
        thisCtrl.CONFIGMENU_GLASS = $filter('translate')('mainpage.CONFIGMENU_GLASS');
        thisCtrl.CONFIGMENU_HARDWARE = $filter('translate')('mainpage.CONFIGMENU_HARDWARE');
        thisCtrl.CONFIGMENU_LAMINATION_TYPE = $filter('translate')('mainpage.CONFIGMENU_LAMINATION_TYPE');
        thisCtrl.CONFIGMENU_LAMINATION = $filter('translate')('mainpage.CONFIGMENU_LAMINATION');
        thisCtrl.CONFIGMENU_ADDITIONAL = $filter('translate')('mainpage.CONFIGMENU_ADDITIONAL');
        thisCtrl.PRODUCT_QTY = $filter('translate')('cart.PRODUCT_QTY');
        thisCtrl.ORDER_COMMENT = $filter('translate')('cart.ORDER_COMMENT');
        thisCtrl.LETTER_M = $filter('translate')('common_words.LETTER_M');
        thisCtrl.HEATCOEF_VAL = $filter('translate')('mainpage.HEATCOEF_VAL');
        // $( "*" ).click(function() {
        //
        // });

        /**========== FUNCTIONS ==========*/

        $timeout(function () {
          DesignServ.initAllImposts();
          DesignServ.initAllGlass();
          DesignServ.initAllArcs();
          DesignServ.initAllDimension();
          DesignServ.initAllGlassXGlass();
        }, 50);

        function addProdQty() {
          GlobalStor.global.product_qty++;
        }

        function subtractProdQty() {
          if (GlobalStor.global.product_qty > 1) {
            GlobalStor.global.product_qty--;
          }
        }

        function closeAttantion() {
          GlobalStor.global.isTest = 0;
          GlobalStor.global.isDesignError = 0;
          DesignStor.design.isDimExtra = 0;
          DesignStor.design.isSquareExtra = 0;
        }

        function saveProduct() {
          ProductStor.product.template_source = angular.copy(DesignStor.design.templateSourceTEMP);
          ProductStor.product.template = angular.copy(DesignStor.design.templateTEMP);

          ProductStor.product.product_qty = GlobalStor.global.product_qty;
          MainServ.inputProductInOrder();

          console.log(ProductStor.product);
        }

        function showCartTemplte(index) {
          CartStor.cart.curProd = index;
          setTimeout(function(){ DesignServ.initAllGlassXGlass(); }, 1000);

          CartStor.cart.showCurrentTemp = 1;

        }

        /**========== FINISH ==========*/
        thisCtrl.addProdQty = addProdQty;
        thisCtrl.subtractProdQty = subtractProdQty;
        thisCtrl.closeAttantion = closeAttantion;
        thisCtrl.saveProduct = saveProduct;
        thisCtrl.showCartTemplte = showCartTemplte;

        thisCtrl.inputProductInOrder = MainServ.inputProductInOrder;

        thisCtrl.clickDeleteProduct = CartServ.clickDeleteProduct;
        thisCtrl.box = CartServ.box;
        thisCtrl.fastEdit = CartServ.fastEdit;

        thisCtrl.closeDoorConfig = DesignServ.closeDoorConfig;
        thisCtrl.selectDoor = DesignServ.selectDoor;
        thisCtrl.stepBack = DesignServ.stepBack;
        thisCtrl.toggleDoorConfig = DesignServ.toggleDoorConfig;
        //------ clicking


      });
})();
