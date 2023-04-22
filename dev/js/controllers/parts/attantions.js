(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('AttantCtrl',

  function($filter, DesignStor, HistoryStor, UserStor, GlobalStor, SVGServ, ProductStor, globalConstants, DesignServ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.D = DesignStor;
    thisCtrl.H = HistoryStor;
    thisCtrl.U = UserStor;

    //------- translate
    thisCtrl.NO_PRINT = $filter('translate')('history.NO_PRINT');
    thisCtrl.EXTRA_SASH = $filter('translate')('design.EXTRA_SASH');
    thisCtrl.CHANGE_SIZE = $filter('translate')('design.CHANGE_SIZE') ;
    thisCtrl.DOOR_ERROR = $filter('translate')('design.DOOR_ERROR');

    /**============ METHODS ================*/

    function closeAttantion() {
      DesignStor.design.isGlassExtra = 0;
      DesignStor.design.isHardwareExtra = 0;
      HistoryStor.history.isNoPrint = 0;
      DesignStor.design.isNoDoors = 0;
      DesignStor.design.isDimSmall = 0;
    }

    function cleanTempSize() {
      DesignStor.design.tempSize.length = 0;
      DesignStor.design.isMinSizeRestriction = 0;
      DesignStor.design.isMaxSizeRestriction = 0;
      DesignStor.design.isDimExtra = 0;
      DesignStor.design.isSquareExtra = 0;
    }

    function stepBackMobile() {
      GlobalStor.global.checkDoors = 0;
      var lastIndex = DesignStor.design.designSteps.length - 1;
      DesignStor.design.templateSourceTEMP = angular.copy(DesignStor.design.designSteps[lastIndex]);
      DesignServ.rebuildSVGTemplate();
      DesignStor.design.designSteps.pop();
      cleanTempSize();
      DesignServ.hideSizeTools();
    }

    function rebuildSVGTemplate() {
      SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths)
        .then(function (result) {
          DesignStor.design.templateTEMP = angular.copy(result);
          DesignStor.design.templateTEMP.details.forEach(function (entry, index) {
            if (entry.impost) {
              DesignStor.design.templateSourceTEMP.details[index].impost.impostAxis[1].x = entry.impost.impostAxis[0].x;
              DesignStor.design.templateSourceTEMP.details[index].impost.impostAxis[0].x = entry.impost.impostAxis[1].x;
            }
          });

        });
    }
    function deselectAllDimension() {
      d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .size-rect').classed('active', false);
      d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .size-txt-edit').classed('active', false);
      d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .size-rect-rehau').classed('active', false);
      d3.selectAll('#' + globalConstants.SVG_ID_EDIT + ' .size-txt-edit-rehau').classed('active', false);
    }

    function hideSizeTools() {
      deselectAllDimension();
      GlobalStor.global.isSizeCalculator = 0;
      DesignStor.design.openVoiceHelper = 0;
    }


    function stepBack() {
      GlobalStor.global.checkDoors = 0;
      var lastIndex = DesignStor.design.designSteps.length - 1;
      DesignStor.design.templateSourceTEMP = angular.copy(DesignStor.design.designSteps[lastIndex]);
      rebuildSVGTemplate();
      DesignStor.design.designSteps.pop();
      cleanTempSize();
      hideSizeTools();
    }


    /**========== FINISH ==========*/
      //------ clicking
    thisCtrl.closeAttantion = closeAttantion;
    thisCtrl.stepBackMobile = stepBackMobile;
    thisCtrl.stepBack = stepBack;
  });
})();