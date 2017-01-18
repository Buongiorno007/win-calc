(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('ConfigMenuServ',
      function(
        $location,
        $filter,
        GeneralServ,
        MainServ,
        CartMenuServ,
        GlobalStor,
        OrderStor,
        ProductStor,
        $timeout,
        InfoBoxServ,
        DesignStor
      ) {
        var thisFactory = this;


        /**============ METHODS ================*/
        function selectConfigPanel(id) {
          MainServ.laminatFiltering();
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
            GlobalStor.global.templateTEMP = angular.copy(ProductStor.product)
            GlobalStor.global.activePanel = 0;
            DesignStor.design.isGlassExtra = 0;
            $location.path('/design');
            //console.log(DesignStor.design.showHint);
            if (DesignStor.design.showHint >= 0){
            $timeout(function() {
              DesignStor.design.showHint = 1;
            }, 90000);}
          } else {
            /** if Door */
            if(ProductStor.product.construction_type === 4) {
              //--------- show only Glasses and AddElements
              if(id === 3 || id === 6 || id === 5) {
                GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
              } else {
                GlobalStor.global.activePanel = 0;
                DesignStor.design.isGlassExtra = 0;
                $location.path('/design');
                DesignServ.setDoorConfigDefault(ProductStor.product).then(function(result) {
                  DesignStor.design.steps.isDoorConfig = 1;
                })
              }
            } else {
              GlobalStor.global.activePanel = (GlobalStor.global.activePanel === id) ? 0 : id;
            }
          }
          if(GlobalStor.global.activePanel !== 0 && GlobalStor.global.setTimeout === 0) {
            GlobalStor.global.setTimeout = 1;
            $timeout(function() {
              InfoBoxServ.autoShow(id);
            }, 4000);
          }
        }





        /**========== FINISH ==========*/

        thisFactory.publicObj = {
          selectConfigPanel:selectConfigPanel
        };

        return thisFactory.publicObj;


      });
})();
