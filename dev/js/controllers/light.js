(function () {
  "use strict";
  /**@ngInject*/
  angular
    .module("LightModule")
    .controller("LightCtrl", function ($filter,
                                       $timeout,
                                       loginServ,
                                       localDB,
                                       globalConstants,
                                       DesignServ,
                                       LightServ,
                                       MainServ,
                                       CartServ,
                                       SVGServ,
                                       GeneralServ,
                                       CartMenuServ,
                                       GlobalStor,
                                       ProductStor,
                                       GlassesServ,
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
      GlobalStor.global.currOpenPage = "light";
      GlobalStor.global.isLightVersion = 1;
      thisCtrl.config = {
        //---- design menu
        DELAY_SHOW_FIGURE_ITEM: 1000,
        isAddElementDetail: 0,
        detailProductIndex: 0,
        element: $filter("translate")("add_elements.ELEMENT"),
        elementa: $filter("translate")("add_elements.ELEMENTA"),
        elements: $filter("translate")("add_elements.ELEMENTS"),
        typing: "on"
      };

      GlobalStor.global.isNavMenu = 0;
      GlobalStor.global.isConfigMenu = 1;
      GlobalStor.global.activePanel = 0;
      //------- translate
      thisCtrl.TEXT1 = $filter("translate")("natification.TEXT1");
      thisCtrl.TEXT2 = $filter("translate")("natification.TEXT2");
      thisCtrl.TEXT3 = $filter("translate")("natification.TEXT3");
      thisCtrl.EDIT_HARDWARE = $filter("translate")(
        "natification.EDIT_HARDWARE"
      );
      thisCtrl.EDIT_SIZE = $filter("translate")("natification.EDIT_SIZE");
      thisCtrl.IMPOST_SHAPE = $filter("translate")("design.IMPOST_SHAPE");
      thisCtrl.SASH_SHAPE = $filter("translate")("design.SASH_SHAPE");
      thisCtrl.ANGEL_SHAPE = $filter("translate")("design.ANGEL_SHAPE");
      thisCtrl.ARCH_SHAPE = $filter("translate")("design.ARCH_SHAPE");
      thisCtrl.POSITION_SHAPE = $filter("translate")("design.POSITION_SHAPE");
      thisCtrl.UNITS_DESCRIP = $filter("translate")("design.UNITS_DESCRIP");
      thisCtrl.PROJECT_DEFAULT = $filter("translate")("design.PROJECT_DEFAULT");
      thisCtrl.BACK = $filter("translate")("common_words.BACK");
      thisCtrl.SAVE = $filter("translate")("settings.SAVE");
      thisCtrl.CANCEL = $filter("translate")("add_elements.CANCEL");
      thisCtrl.CONFIGMENU_IN_CART = $filter("translate")("mainpage.CONFIGMENU_IN_CART");
      thisCtrl.DOOR_CONFIG_LABEL = $filter("translate")(
        "design.DOOR_CONFIG_LABEL"
      );
      thisCtrl.DOOR_CONFIG_DESCTIPT = $filter("translate")(
        "design.DOOR_CONFIG_DESCTIPT"
      );
      thisCtrl.SASH_CONFIG_DESCTIPT = $filter("translate")(
        "design.SASH_CONFIG_DESCTIPT"
      );
      thisCtrl.HANDLE_CONFIG_DESCTIPT = $filter("translate")(
        "design.HANDLE_CONFIG_DESCTIPT"
      );
      thisCtrl.LOCK_CONFIG_DESCTIPT = $filter("translate")(
        "design.LOCK_CONFIG_DESCTIPT"
      );
      thisCtrl.STEP = $filter("translate")("design.STEP");
      thisCtrl.LABEL_DOOR_TYPE = $filter("translate")("design.LABEL_DOOR_TYPE");
      thisCtrl.LABEL_SASH_TYPE = $filter("translate")("design.LABEL_SASH_TYPE");
      thisCtrl.LABEL_HANDLE_TYPE = $filter("translate")(
        "design.LABEL_HANDLE_TYPE"
      );
      thisCtrl.LABEL_LOCK_TYPE = $filter("translate")("design.LABEL_LOCK_TYPE");
      thisCtrl.NOT_AVAILABLE = $filter("translate")("design.NOT_AVAILABLE");
      thisCtrl.DIM_EXTRA = $filter("translate")("design.DIM_EXTRA");
      thisCtrl.DIM_SMALL = $filter("translate")("design.DIM_SMALL");
      thisCtrl.SQUARE_EXTRA = $filter("translate")("design.SQUARE_EXTRA");
      thisCtrl.ROOM_SELECTION = $filter("translate")("mainpage.ROOM_SELECTION");
      thisCtrl.TEST_STAGE = $filter("translate")("design.TEST_STAGE");
      thisCtrl.VOICE_SPEACH = $filter("translate")("design.VOICE_SPEACH");
      thisCtrl.BY_AXIS = $filter("translate")("design.BY_AXIS");
      thisCtrl.BY_GLASS = $filter("translate")("design.BY_GLASS");
      thisCtrl.CALC_PRICE = $filter("translate")("design.CALC_PRICE");
      thisCtrl.DISCOUNT_SELECT = $filter("translate")("cart.DISCOUNT_SELECT");
      thisCtrl.MAX = $filter("translate")("common_words.MAX");
      thisCtrl.DISCOUNT_WINDOW = $filter("translate")("cart.DISCOUNT_WINDOW");
      thisCtrl.DISCOUNT_ADDELEM = $filter("translate")("cart.DISCOUNT_ADDELEM");
      thisCtrl.DISCOUNT = $filter("translate")("cart.DISCOUNT");
      thisCtrl.DISCOUNT_WITHOUT = $filter("translate")("cart.DISCOUNT_WITHOUT");
      thisCtrl.DISCOUNT_WITH = $filter("translate")("cart.DISCOUNT_WITH");
      thisCtrl.DISCOUNT_SERVICE = $filter('translate')('cart.DISCOUNT_SERVICE');

      thisCtrl.OTHER = $filter("translate")("add_elements.OTHER");
      thisCtrl.SERV1 = $filter("translate")("add_elements.SERV1");
      thisCtrl.SERV2 = $filter("translate")("add_elements.SERV2");
      thisCtrl.SERV3 = $filter("translate")("add_elements.SERV3");
      thisCtrl.SERV4 = $filter("translate")("add_elements.SERV4");

      thisCtrl.PROFILE_SYSTEM_SELECT = $filter("translate")(
        "design.PROFILE_SYSTEM_SELECT"
      );
      thisCtrl.GLASS_SELECT = $filter("translate")("design.GLASS_SELECT");
      thisCtrl.GLASS_SELECT_BIG = $filter("translate")(
        "design.GLASS_SELECT_BIG"
      );
      thisCtrl.HARDWARE_SELECT = $filter("translate")("design.HARDWARE_SELECT");
      thisCtrl.LEFT_TEXT_SELECT = $filter("translate")(
        "design.LEFT_TEXT_SELECT"
      );

      thisCtrl.SAVE = $filter("translate")("settings.SAVE");
      thisCtrl.KARKAS = $filter("translate")("mainpage.KARKAS");
      thisCtrl.KONFIG = $filter("translate")("mainpage.KONFIG");
      thisCtrl.CART = $filter("translate")("mainpage.CART");

      thisCtrl.AND = $filter("translate")("common_words.AND");
      thisCtrl.CONFIGMENU_SIZING = $filter("translate")(
        "mainpage.CONFIGMENU_SIZING"
      );
      thisCtrl.CONFIGMENU_PROFILE = $filter("translate")(
        "mainpage.CONFIGMENU_PROFILE"
      );
      thisCtrl.HEAT_TRANSFER = $filter("translate")("mainpage.HEAT_TRANSFER");
      thisCtrl.CONFIGMENU_GLASS = $filter("translate")(
        "mainpage.CONFIGMENU_GLASS"
      );
      thisCtrl.CONFIGMENU_HARDWARE = $filter("translate")(
        "mainpage.CONFIGMENU_HARDWARE"
      );
      thisCtrl.CONFIGMENU_LAMINATION_TYPE = $filter("translate")(
        "mainpage.CONFIGMENU_LAMINATION_TYPE"
      );
      thisCtrl.CONFIGMENU_LAMINATION = $filter("translate")(
        "mainpage.CONFIGMENU_LAMINATION"
      );
      thisCtrl.CONFIGMENU_ADDITIONAL = $filter("translate")(
        "mainpage.CONFIGMENU_ADDITIONAL"
      );
      thisCtrl.PRODUCT_QTY = $filter("translate")("cart.PRODUCT_QTY");
      thisCtrl.ORDER_COMMENT = $filter("translate")("cart.ORDER_COMMENT");
      thisCtrl.LETTER_M = $filter("translate")("common_words.LETTER_M");
      thisCtrl.HEATCOEF_VAL = $filter("translate")("mainpage.HEATCOEF_VAL");
      thisCtrl.ADDELEMENTS_PRODUCT_COST = $filter("translate")(
        "cart.ADDELEMENTS_PRODUCT_COST"
      );
      thisCtrl.INCH = $filter('translate')('mainpage.INCH');
      thisCtrl.GRID = $filter("translate")("add_elements.GRID");
      thisCtrl.VISOR = $filter("translate")("add_elements.VISOR");
      thisCtrl.SPILLWAY = $filter("translate")("add_elements.SPILLWAY");
      thisCtrl.OUTSIDE = $filter("translate")("add_elements.OUTSIDE");
      thisCtrl.LOUVERS = $filter("translate")("add_elements.LOUVERS");
      thisCtrl.INSIDE = $filter("translate")("add_elements.INSIDE");
      thisCtrl.CONNECTORS = $filter("translate")("add_elements.CONNECTORS");
      thisCtrl.FAN = $filter("translate")("add_elements.FAN");
      thisCtrl.WINDOWSILL = $filter("translate")("add_elements.WINDOWSILL");
      thisCtrl.HANDLEL = $filter("translate")("add_elements.HANDLEL");
      thisCtrl.OTHERS = $filter("translate")("add_elements.OTHERS");
      thisCtrl.ROOM_SELECTION = $filter("translate")("mainpage.ROOM_SELECTION");

      thisCtrl.ADD_ORDER = $filter('translate')('cart.ADD_ORDER');

      thisCtrl.ADDELEMENTS_EDIT_LIST = $filter("translate")(
        "cart.ADDELEMENTS_EDIT_LIST"
      );
      thisCtrl.WIDTH_LABEL = $filter("translate")("add_elements.WIDTH_LABEL");
      thisCtrl.HEIGHT_LABEL = $filter("translate")("add_elements.HEIGHT_LABEL");
      thisCtrl.MM = $filter("translate")("mainpage.MM");
      thisCtrl.INCH = $filter('translate')('mainpage.INCH');
      // $( "*" ).click(function() {
      //
      // });

      if (!GlobalStor.global.orderEditNumber) {
        CartStor.cart.customer.customer_location = OrderStor.order.customer_location;
      }
      /**========== FUNCTIONS ==========*/
      localDB.getLocalStor().then((result) => {
        if (result)
          if (!ProductStor.product.is_addelem_only) {
            MainServ.profile();
            MainServ.doorProfile();
            MainServ.laminationDoor();
          }
      });
      $timeout(function () {
        DesignServ.initAllImposts();
        DesignServ.initAllGlass();
        DesignServ.initAllArcs();
        DesignServ.initAllDimension();
        DesignServ.initAllGlassXGlass();
      }, 50);

      function closeAttantion() {
        GlobalStor.global.isTest = 0;
        GlobalStor.global.isDesignError = 0;
        DesignStor.design.isDimExtra = 0;
        DesignStor.design.isSquareExtra = 0;
        DesignStor.design.isDimSmall = 0;
      }

      function saveProduct() {
        LightServ.designSaved();
      }

      function goToCart() {
        MainServ.createNewProduct();
        CartMenuServ.calculateOrderPrice();
        CartMenuServ.joinAllAddElements();
        // GlobalStor.global.activePanel = 0;
        GlobalStor.global.showKarkas = 0;
        GlobalStor.global.showConfiguration = 0;
        GlobalStor.global.showCart = 1;
      }

      function saveAddElems() {
        GlobalStor.global.showCoefInfoBlock = 0;
        GlobalStor.global.continued = 0;
        if (MainServ.inputProductInOrder()) {
          //--------- moving to Cart when click on Cart button
          // goToCart();
        }
      }

      function showCartTemplte(index) {
        CartStor.cart.curProd = index;
        setTimeout(function () {
          DesignServ.initAllGlassXGlass();
        }, 1000);
        CartStor.cart.showCurrentTemp = 1;
      }

      function showAddElementDetail(productIndex) {
        if ((CartStor.cart.allAddElements[productIndex].length > 0) || (coutNull(OrderStor.order.products[productIndex].services_price_arr))) {
          thisCtrl.config.detailProductIndex = productIndex;
          thisCtrl.config.isAddElementDetail = true;
        }
      }

      function closeAddElementDetail() {
        thisCtrl.config.isAddElementDetail = false;
      }

      function enterKeyPrice(e) {
        e = e || window.event;
        if (e.keyCode === 13) {
          CartMenuServ.approveNewDisc(0)
        }
      }

      function enterKeyDop(e) {
        e = e || window.event;
        if (e.keyCode === 13) {
          CartMenuServ.approveNewDisc(1)
        }
      }

      function enterKeyDopService(e) {
        e = e || window.event;
        if (e.keyCode === 13) {
          CartMenuServ.approveNewDisc(2)
        }
      }

      function showCalck() {
        GlobalStor.global.enterCount = 1;
        GlobalStor.global.isSizeCalculator = !GlobalStor.global.isSizeCalculator;
      }

      function alert() {
        GlobalStor.global.nameAddElem = [];
        var name = "";
        var product = 0;
        var tr = "";
        for (
          var u = 0;
          u < ProductStor.product.chosenAddElements.length;
          u += 1
        ) {
          for (
            var f = 0;
            f < ProductStor.product.chosenAddElements[u].length;
            f += 1
          ) {
            var obj = {
              name: "",
              product: 0,
              tr: "",
              list: 0
            };
            for (var y = 0; y < GlobalStor.global.dataProfiles.length; y += 1) {
              if (
                ProductStor.product.chosenAddElements[u][f]
                  .parent_element_id ===
                GlobalStor.global.dataProfiles[y].element_id
              ) {
                obj.tr = ProductStor.product.chosenAddElements[u][f].name;
              } else {
                obj.name = ProductStor.product.chosenAddElements[u][f].name;
                obj.list =
                  ProductStor.product.chosenAddElements[u][f].list_group_id;
              }
            }
            GlobalStor.global.nameAddElem.push(obj);
          }
        }
        for (var d = 0; d < GlobalStor.global.nameAddElem.length; d += 1) {
          if (
            GlobalStor.global.nameAddElem[d].name ===
            GlobalStor.global.nameAddElem[d].tr ||
            GlobalStor.global.nameAddElem[d].list === 20
          ) {
            delete GlobalStor.global.nameAddElem[d].name;
          }
        }
        for (var d = 0; d < GlobalStor.global.nameAddElem.length; d += 1) {
          if (
            GlobalStor.global.nameAddElem[d].name !== undefined &&
            GlobalStor.global.continued === 0 &&
            ProductStor.product.is_addelem_only === 0
          ) {
            GlobalStor.global.dangerAlert = 1;
          }
        }
      }

      function checkForAddElem() {
        
        //  ALERT
        GlobalStor.global.isNoChangedProduct = 1;
        if (!GlobalStor.global.isChangedTemplate) {
          GlobalStor.global.isChangedTemplate = DesignStor.design.designSteps.length ? 1 : 0;
        }
        if (!GlobalStor.global.isZeroPriceList.length) {
          if (!ProductStor.product.is_addelem_only) {
            alert();
            if (GlobalStor.global.dangerAlert < 1) {
              if (ProductStor.product.beadsData.length > 0) {
                if (OrderStor.order.products.length === 0) {
                  saveProduct();
                } else if (GlobalStor.global.isNewTemplate === 1) {
                  saveProduct();
                } else if (GlobalStor.global.isChangedTemplate === 0) {
                  //  ALERT
                  GlobalStor.global.isNoChangedProduct = 1;
                } else {
                  saveProduct();
                }
              } else {
                GeneralServ.isErrorProd(
                  $filter("translate")("common_words.ERROR_PROD_BEADS")
                );
              }
            }
          } else {
            saveAddElems();
          }
        } else {
          var msg = thisCtrl.ATENTION_MSG1; //+" "+GlobalStor.global.isZeroPriceList+" "+thisCtrl.ATENTION_MSG2;
          GlobalStor.global.isZeroPriceList.forEach(function (ZeroElem) {
            msg += " " + ZeroElem + "\n";
          });
          msg += " \n" + thisCtrl.ATENTION_MSG2;
          GeneralServ.infoAlert(thisCtrl.ATENTION, msg);
        }
        
      }

      function helpModal() {
        const helpModalData = [
          {
            id: 1,
            name: 'Как работает калькулятор?',
            description: 'Всё очень просто! Приложение позволяет вам построить конструкцию, выбрать стеклопакет, изменить ламинацию, добавить подконник или водоотлив, далее вы оставляете нам свои данные (email и телефон) мы с вами связываемся и уточняем когда вам будет удобно принять ваш товар. Можете начать прямо сейчас! Переходите во вкладки с элементами и окновляйтесь вместе с РЕХАУ!',
            img: './img/rehau-img/video-help-desktop.gif',
          }
        ]
        MainServ.showInfoBox(1, helpModalData)
      }

      function coutNull(arr) {
        var tmp = 0;
        arr.forEach(function (entry) {
          (entry !== 0 ) ? tmp++ : 0;
        });
        return tmp;
      }

      function toggleDiscount() {
        GlobalStor.global.toggleDiscount = !GlobalStor.global.toggleDiscount;
      }

      function addNewProductInOrder() {
        //------- set previos Page
        CartStor.cart.showCurrentTemp = 0;
        GlobalStor.global.isNewTemplate = 1;
        GlobalStor.global.product_qty = 1;
        GeneralServ.setPreviosPage();
        //=============== CREATE NEW PRODUCT =========//
        MainServ.createNewProduct();
        DesignServ.deselectAllDimension();
        GlobalStor.global.showKarkas = 1;
        GlobalStor.global.showConfiguration = 0;
        GlobalStor.global.showCart = 0;
        GlobalStor.global.isSizeCalculator = 0;
        GlobalStor.global.activePanel = 0;
        CartStor.cart.isShowDiscount = 0;
        ProductStor.product.template_source = DesignStor.design.templateSourceTEMP;
        ProductStor.product.template = DesignStor.design.templateTEMP;
        setTimeout(function () {
          DesignServ.rebuildSVGTemplate();
        }, 250);

      }


      /**========== FINISH ==========*/
      thisCtrl.closeAttantion = closeAttantion;
      thisCtrl.saveProduct = saveProduct;
      thisCtrl.showCartTemplte = showCartTemplte;
      thisCtrl.showAddElementDetail = showAddElementDetail;
      thisCtrl.closeAddElementDetail = closeAddElementDetail;
      thisCtrl.enterKeyPrice = enterKeyPrice;
      thisCtrl.enterKeyDop = enterKeyDop;
      thisCtrl.checkForAddElem = checkForAddElem;
      thisCtrl.coutNull = coutNull;
      thisCtrl.toggleDiscount = toggleDiscount;
      thisCtrl.enterKeyDopService = enterKeyDopService;
      thisCtrl.showCalck = showCalck;
      thisCtrl.helpModal = helpModal;

      thisCtrl.box = LightServ.box;
      thisCtrl.toggleDoorConfig = LightServ.toggleDoorConfig;
      thisCtrl.closeDoorConfig = LightServ.closeDoorConfig;
      thisCtrl.saveDoorConfig = LightServ.saveDoorConfig;
      thisCtrl.addProdQty = LightServ.addProdQty;
      thisCtrl.subtractProdQty = LightServ.subtractProdQty;

      thisCtrl.inputProductInOrder = MainServ.inputProductInOrder;

      thisCtrl.approveNewDisc = CartMenuServ.approveNewDisc;

      thisCtrl.decreaseProductQty = CartServ.decreaseProductQty;
      thisCtrl.increaseProductQty = CartServ.increaseProductQty;
      thisCtrl.clickDeleteProduct = CartServ.clickDeleteProduct;
      thisCtrl.fastEdit = CartServ.fastEdit;
      thisCtrl.addNewProductInOrder = addNewProductInOrder;

      thisCtrl.selectDoor = DesignServ.selectDoor;
      thisCtrl.selectSash = DesignServ.selectSash;
      thisCtrl.selectHandle = DesignServ.selectHandle;
      thisCtrl.selectLock = DesignServ.selectLock;
      thisCtrl.stepBack = DesignServ.stepBack;

      $("#main-frame").removeClass("main-frame-mobView");
      $("#app-container").removeClass("app-container-mobView");
      $(window).load(function() {
        MainServ.resize();
      });
      window.onresize = function() {
        MainServ.resize();
      };
      //------ clicking
    });
})();
