
// controllers/panels/glasses.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('GlassesCtrl', glassSelectorCtrl);

  function glassSelectorCtrl($filter, globalConstants, MainServ, AnalyticsServ, DesignServ, SVGServ, GlobalStor, OrderStor, ProductStor, DesignStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      selectGlassId: 0,
      selectGlassName: '',
      camera: $filter('translate')('panels.CAMERa'),
      camer: $filter('translate')('panels.CAMER'),
      camers: $filter('translate')('panels.CAMERs'),
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };


    //------ clicking
    thisCtrl.selectGlass = selectGlass;
    thisCtrl.confirmGlass = confirmGlass;
    thisCtrl.setGlassToAll = setGlassToAll;
    thisCtrl.closeGlassSelectorDialog = closeGlassSelectorDialog;
    thisCtrl.showInfoBox = MainServ.showInfoBox;


    //============ methods ================//

    /** Select glass */
    function selectGlass(newId, newName) {
      thisCtrl.config.selectGlassId = newId;
      thisCtrl.config.selectGlassName = newName;
      //----- open glass selector dialog
      GlobalStor.global.showGlassSelectorDialog = 1;
      DesignServ.initAllGlass();
    }



    function confirmGlass() {
      var selectBlockQty = DesignStor.design.selectedGlass.length;
      if(selectBlockQty) {
        while (--selectBlockQty > -1) {
          var blockId = DesignStor.design.selectedGlass[selectBlockQty].attributes.block_id.nodeValue;
          MainServ.setGlassToAllTemplateBlocks(blockId, thisCtrl.config.selectGlassId, thisCtrl.config.selectGlassName);
        }
        changePriceAsNewGlass();
      }
      closeGlassSelectorDialog();
    }


    function setGlassToAll() {
      MainServ.setGlassToAllTemplateBlocks(0, thisCtrl.config.selectGlassId, thisCtrl.config.selectGlassName);
      changePriceAsNewGlass();
      closeGlassSelectorDialog();
    }


    function changePriceAsNewGlass () {
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
        ProductStor.product.template = angular.copy(result);
      });
      DesignServ.removeAllEventsInSVG();

      var hardwareIds = (ProductStor.product.hardware.id) ? ProductStor.product.hardware.id : 0;
      //------- set currenct Glass
      MainServ.setCurrentGlass(ProductStor.product, thisCtrl.config.selectGlassId);
      //------ calculate price
      MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass[0].id, hardwareIds);//TODO array!!
      //------ save analytics data
      //TODO ?? AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 2);
    }

    function closeGlassSelectorDialog() {
      GlobalStor.global.showGlassSelectorDialog = !GlobalStor.global.showGlassSelectorDialog;
    }

  }
})();

