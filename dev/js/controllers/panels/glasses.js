(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('GlassesCtrl',

  function(
    $filter,
    globalConstants,
    MainServ,
    AnalyticsServ,
    DesignServ,
    SVGServ,
    GlobalStor,
    OrderStor,
    ProductStor,
    DesignStor,
    UserStor
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      prevGlassId: 0,
      prevGlassName: '',
      camera: $filter('translate')('panels.CAMERa'),
      camer: $filter('translate')('panels.CAMER'),
      camers: $filter('translate')('panels.CAMERs'),
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };

    //------- translate
    thisCtrl.ENERGY_SAVE = $filter('translate')('panels.ENERGY_SAVE');
    thisCtrl.HEAT_INSULATION = $filter('translate')('panels.HEAT_INSULATION');
    thisCtrl.NOICE_INSULATION = $filter('translate')('panels.NOICE_INSULATION');


    /**============ METHODS ================*/

    /**-------- Select glass --------*/
    function selectGlass(newId, newName) {
      GlobalStor.global.prevGlassId = angular.copy(GlobalStor.global.selectGlassId);
      GlobalStor.global.prevGlassName = angular.copy(GlobalStor.global.selectGlassName);
      GlobalStor.global.selectGlassId = newId;
      GlobalStor.global.selectGlassName = newName;
      //----- open glass selector dialog
      GlobalStor.global.showGlassSelectorDialog = 1;
      DesignServ.initAllGlassXGlass();
    }



    function changePriceAsNewGlass () {
      var hardwareIds;
      DesignStor.design.selectedGlass.length = 0;
      /** set current Glass */
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths)
        .then(function(result) {
          ProductStor.product.template = angular.copy(result);
          /** calculate price */
          hardwareIds = ProductStor.product.hardware.id || 0;
          MainServ.preparePrice(
            ProductStor.product.template,
            ProductStor.product.profile.id,
            ProductStor.product.glass,
            hardwareIds,
            ProductStor.product.lamination.lamination_in_id
          );
          //------ save analytics data
          //TODO ??
  //AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 2);
        });
    }


    function setGlassToAll() {
      MainServ.setGlassToTemplateBlocks(
        ProductStor.product.template_source,
        GlobalStor.global.selectGlassId,
        GlobalStor.global.selectGlassName
      );
      changePriceAsNewGlass();
      DesignServ.closeGlassSelectorDialog();
    }





    function confirmGlass() {
      var selectBlockQty = DesignStor.design.selectedGlass.length,
          glassesTEMP = angular.copy(ProductStor.product.glass),
          blockId;

      /** there are selected glasses */
      if(!selectBlockQty) {
        MainServ.setGlassToTemplateBlocks(
          ProductStor.product.template,
          GlobalStor.global.selectGlassId,
          GlobalStor.global.selectGlassName
        );
      }

      /** set new Glass in product */
      MainServ.setCurrentGlass(ProductStor.product, GlobalStor.global.selectGlassId);

      /** Extra Glass finding */
      MainServ.checkGlassSizes(ProductStor.product.template);

      if(DesignStor.design.extraGlass.length) {
        /** there are incorrect glasses
         * expose Alert */
        DesignStor.design.isGlassExtra = 1;
        /** return previous Glasses */
        ProductStor.product.glass = angular.copy(glassesTEMP);
        /** return prev value in template */
        MainServ.setGlassToTemplateBlocks(
          ProductStor.product.template,
          GlobalStor.global.prevGlassId,
          GlobalStor.global.prevGlassName
        );
      } else {
        /** there are selected glasses */
        if(selectBlockQty) {
          while (--selectBlockQty > -1) {
            blockId = DesignStor.design.selectedGlass[selectBlockQty].attributes.block_id.nodeValue;
            MainServ.setGlassToTemplateBlocks(
              ProductStor.product.template_source,
              GlobalStor.global.selectGlassId,
              GlobalStor.global.selectGlassName,
              blockId
            );
          }
          changePriceAsNewGlass();
          DesignServ.closeGlassSelectorDialog();
        } else {
          /** apply current glass to all skylights */
          setGlassToAll();
        }
      }

    }


    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.selectGlass = selectGlass;
    thisCtrl.confirmGlass = confirmGlass;
    thisCtrl.setGlassToAll = setGlassToAll;
    thisCtrl.closeGlassSelectorDialog = DesignServ.closeGlassSelectorDialog;
    thisCtrl.showInfoBox = MainServ.showInfoBox;


  });
})();
