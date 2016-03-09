(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('RoomInfoCtrl',

  function(
    globalConstants,
    TemplatesServ,
    GlobalStor,
    OrderStor,
    ProductStor,
    UserStor
  ) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      DELAY_SHOW_COEFF: 20 * globalConstants.STEP,
      DELAY_SHOW_ALLROOMS_BTN: 15 * globalConstants.STEP,
      typing: 'on'
    };




    /**============ METHODS ================*/

    //------ Show/Close Room Selector Dialog
    function showRoomSelectorDialog() {
      //----- open if comment block is closed
      if(!GlobalStor.global.isShowCommentBlock) {
//        GlobalStor.global.showRoomSelectorDialog = !GlobalStor.global.showRoomSelectorDialog;
        GlobalStor.global.showRoomSelectorDialog = 1;
        //playSound('fly');
      }
    }

    //----- Show Comments
    function switchComment() {
      //playSound('swip');
      GlobalStor.global.isShowCommentBlock = !GlobalStor.global.isShowCommentBlock;
    }


    function toggleTemplateType() {
      GlobalStor.global.isTemplateTypeMenu = !GlobalStor.global.isTemplateTypeMenu;
    }

    //================== Select new Template Type ========================//
  

    function selectNewTemplateType(marker) {
      GlobalStor.global.isTemplateTypeMenu = 0;

      function goToNewTemplateType() {
        if (marker === 4) {
          MainServ.setDefaultDoorConfig();
        }
        GlobalStor.global.isChangedTemplate = 0;
        TemplatesServ.initNewTemplateType(marker);
      }

      if (GlobalStor.global.isChangedTemplate) {
        //----- если выбран новый шаблон после изменения предыдущего
        GeneralServ.confirmAlert(
          $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
          $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
          goToNewTemplateType
        );
      } else {
        TemplatesServ.initNewTemplateType(marker);
      }

    }


    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.showRoomSelectorDialog = showRoomSelectorDialog;
    thisCtrl.switchComment = switchComment;
    thisCtrl.selectNewTemplate = TemplatesServ.selectNewTemplate;
    thisCtrl.toggleTemplateType = toggleTemplateType;
    thisCtrl.selectNewTemplateType = selectNewTemplateType;
    



  });
})();