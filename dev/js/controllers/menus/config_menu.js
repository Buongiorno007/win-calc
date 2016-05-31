(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('ConfigMenuCtrl',

  function(
    $location,
    $filter,
    globalConstants,
    GeneralServ,
    MainServ,
    AddElementMenuServ,
    DesignServ,
    GlobalStor,
    OrderStor,
    ProductStor,
    DesignStor,
    UserStor,
    InfoBoxServ
  ) {
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
    thisCtrl.HEATCOEF_VAL = $filter('translate')('mainpage.HEATCOEF_VAL');





    /**============ METHODS ================*/


    //------- Select menu item

    function selectConfigPanel(id) {
      if(GlobalStor.global.isQtyCalculator || GlobalStor.global.isSizeCalculator) {
        /** calc Price previous parameter and close caclulators */
        AddElementMenuServ.finishCalculators();
      }
      //---- hide rooms if opened
      GlobalStor.global.showRoomSelectorDialog = 0;
      //---- hide tips
      GlobalStor.global.configMenuTips = 0;
      //---- hide comment if opened
      GlobalStor.global.isShowCommentBlock = 0;
      //---- hide template type menu if opened
      GlobalStor.global.isTemplateTypeMenu = 0;
      GeneralServ.stopStartProg();
      MainServ.setDefaultAuxParam();
      //------ close Glass Selector Dialogs
      if(GlobalStor.global.showGlassSelectorDialog) {
        DesignServ.closeGlassSelectorDialog(1);
      }

      if(id === 1) {
        GlobalStor.global.activePanel = 0;
        DesignStor.design.isGlassExtra = 0;
        $location.path('/design');
      } else {
        /** if Door */
        if(ProductStor.product.construction_type === 4) {
          //--------- show only Glasses and AddElements
          if(id === 3 || id === 6) {
            GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
          }
        } else {
          GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
        }
      }
      if(GlobalStor.global.activePanel !== 0) {
        InfoBoxServ.autoShowInfoBox(id);
      }
    }

    function saveProduct() {
      GlobalStor.global.continued = 0;
      if(MainServ.inputProductInOrder()){
        //--------- moving to Cart when click on Cart button
        MainServ.goToCart();
      }
    }


    function alert() {
      GlobalStor.global.nameAddElem = [];
      var name = '';
      var product = 0;
      var tr = '';
        for(var u=0; u<ProductStor.product.chosenAddElements.length; u+=1) {
          for(var f=0; f<ProductStor.product.chosenAddElements[u].length; f+=1) {
          var obj = {
            name : '',
            product : 0,
            tr: ''
          };
            for (var y = 0; y<GlobalStor.global.dataProfiles.length; y+=1) {
              if (ProductStor.product.chosenAddElements[u][f].id === GlobalStor.global.dataProfiles[y].list_id) {
                obj.tr = ProductStor.product.chosenAddElements[u][f].name;
              } else {
                obj.name = ProductStor.product.chosenAddElements[u][f].name;
              }    
            }
              GlobalStor.global.nameAddElem.push(obj)
          }
        }
        for (var d=0; d<GlobalStor.global.nameAddElem.length; d+=1) {
          if(GlobalStor.global.nameAddElem[d].name === GlobalStor.global.nameAddElem[d].tr) {
            delete GlobalStor.global.nameAddElem[d].name;
          }
        }
        for (var d=0; d<GlobalStor.global.nameAddElem.length; d+=1) {
          if(GlobalStor.global.nameAddElem[d].name !== undefined && GlobalStor.global.continued === 0 && ProductStor.product.is_addelem_only === 0) {
            GlobalStor.global.dangerAlert = 1;
          }
        }
    }

    function checkForAddElem() {
      alert();
      if(GlobalStor.global.dangerAlert < 1) {
        saveProduct()
      }
       else {
        console.log('errrrrrrror')
      }
    }

    function showNextTip() {
      var tipQty = thisCtrl.config.TOOLTIP.length;
      GlobalStor.global.configMenuTips +=1;
      if(GlobalStor.global.configMenuTips === tipQty) {
        GlobalStor.global.configMenuTips = 0;
        //------ open templates
        //GlobalStor.global.activePanel = 1;
        //------ close rooms
        //GlobalStor.global.showRoomSelectorDialog = 0;
      }
    }



    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.autoShowInfoBox = InfoBoxServ.autoShowInfoBox;
    thisCtrl.selectConfigPanel = selectConfigPanel;
    thisCtrl.inputProductInOrder = saveProduct;
    thisCtrl.showNextTip = showNextTip;
    thisCtrl.alert = alert;
    thisCtrl.checkForAddElem = checkForAddElem;


  });
})();