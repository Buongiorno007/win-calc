(function(){
  'use strict';
  /**@ngInject*/
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

    //------- translate
    thisCtrl.ENERGY_SAVE = $filter('translate')('panels.ENERGY_SAVE');
    thisCtrl.HEAT_INSULATION = $filter('translate')('panels.HEAT_INSULATION');
    thisCtrl.NOICE_INSULATION = $filter('translate')('panels.NOICE_INSULATION');
    thisCtrl.SELECT_ALL = $filter('translate')('mainpage.SELECT_ALL');
    thisCtrl.SELECT_GLASS_WARN = $filter('translate')('mainpage.SELECT_GLASS_WARN');

    //------ clicking
    thisCtrl.selectGlass = selectGlass;
    thisCtrl.confirmGlass = confirmGlass;
    thisCtrl.setGlassToAll = setGlassToAll;
    thisCtrl.closeGlassSelectorDialog = closeGlassSelectorDialog;
    thisCtrl.showInfoBox = MainServ.showInfoBox;


    //============ methods ================//

    /** Select glass */
    function selectGlass(newId, newName) {
      //if(ProductStor.product.glass[0].id !== newId) {
        thisCtrl.config.selectGlassId = newId;
        thisCtrl.config.selectGlassName = newName;
        //----- open glass selector dialog
        GlobalStor.global.showGlassSelectorDialog = 1;
        DesignServ.initAllGlassXGlass();
      //}
    }



    function confirmGlass() {
      var selectBlockQty = DesignStor.design.selectedGlass.length;
      if(selectBlockQty) {
        while (--selectBlockQty > -1) {
          var blockId = DesignStor.design.selectedGlass[selectBlockQty].attributes.block_id.nodeValue;
          MainServ.setGlassToTemplateBlocks(blockId, thisCtrl.config.selectGlassId, thisCtrl.config.selectGlassName);
        }
        changePriceAsNewGlass();
        closeGlassSelectorDialog();
      }
    }


    function setGlassToAll() {
      MainServ.setGlassToTemplateBlocks(0, thisCtrl.config.selectGlassId, thisCtrl.config.selectGlassName);
      changePriceAsNewGlass();
      closeGlassSelectorDialog();
    }


    function changePriceAsNewGlass () {
      GlobalStor.global.selectLastGlassId = thisCtrl.config.selectGlassId;
      DesignStor.design.selectedGlass.length = 0;
      //------- set currenct Glass
      MainServ.setCurrentGlass(ProductStor.product, GlobalStor.global.selectLastGlassId);
      SVGServ.createSVGTemplate(ProductStor.product.template_source, ProductStor.product.profileDepths).then(function(result) {
        ProductStor.product.template = angular.copy(result);
        //------ calculate price
        var hardwareIds = (ProductStor.product.hardware.id) ? ProductStor.product.hardware.id : 0;
        MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass, hardwareIds, ProductStor.product.lamination.lamination_in_id);
        //------ save analytics data
        //TODO ?? AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, newId, 2);
      });
    }

    function closeGlassSelectorDialog() {
      DesignServ.removeGlassEventsInSVG();
      GlobalStor.global.showGlassSelectorDialog = !GlobalStor.global.showGlassSelectorDialog;
    }

  }
})();
