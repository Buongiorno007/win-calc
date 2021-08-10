(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('RoomInfoCtrl',

      function (
        $filter,
        globalConstants,
        TemplatesServ,
        GlobalStor,
        OrderStor,
        ProductStor,
        UserStor,
        MainServ
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
          typing: 'on',
          TOOLTIP: [
            '',
            $filter('translate')('mainpage.TEMPLATE_TIP'),
            $filter('translate')('mainpage.PROFILE_TIP'),
            $filter('translate')('mainpage.GLASS_TIP')
          ],
        };

        //------- translate
        thisCtrl.CLIMATE_ZONE = $filter('translate')('mainpage.CLIMATE_ZONE');
        thisCtrl.HEAT_TRANSFER_RESISTANCE = $filter('translate')('mainpage.HEAT_TRANSFER_RESISTANCE');
        thisCtrl.HEAT_TRANSFER = $filter('translate')('mainpage.HEAT_TRANSFER');
        thisCtrl.ROOM_SELECTION = $filter('translate')('mainpage.ROOM_SELECTION');
        thisCtrl.WINDOW_DOOR_SELECTION = $filter('translate')('mainpage.WINDOW_DOOR_SELECTION');
        thisCtrl.POWERED_BY_1 = $filter('translate')('mainpage.POWERED_BY_1');
        thisCtrl.POWERED_BY_2 = $filter('translate')('mainpage.POWERED_BY_2');
        thisCtrl.COMMENT = $filter('translate')('mainpage.COMMENT');
        thisCtrl.LETTER_M = $filter('translate')('common_words.LETTER_M');
        thisCtrl.HEATCOEF_VAL = $filter('translate')('mainpage.HEATCOEF_VAL');
        thisCtrl.HEAT_TRANSFER_INFO_1 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_1');
        thisCtrl.HEAT_TRANSFER_INFO_2 = $filter('translate')('mainpage.HEAT_TRANSFER_INFO_2');



        /**============ METHODS ================*/

        //------ Show/Close Room Selector Dialog
        function showRoomSelectorDialog() {
          //----- open if comment block is closed
          if (!GlobalStor.global.isShowCommentBlock) {
            GlobalStor.global.showRoomSelectorDialog = !GlobalStor.global.showRoomSelectorDialog;
            //GlobalStor.global.showRoomSelectorDialog = 1;
            //playSound('fly');
          }
        }
        function showCoefInfoBlock() {
          GlobalStor.global.showCoefInfoBlock = !GlobalStor.global.showCoefInfoBlock;
        }
        //----- Show Comments
        function switchComment() {
          //playSound('swip');
          GlobalStor.global.isShowCommentBlock = !GlobalStor.global.isShowCommentBlock;
        }

        GlobalStor.global.infoDescrip = 'AAAAA'

        GlobalStor.global.infoTitle = 'TITLE MAN '

        //         imgLink: ""
        // ​
        // infoDescrip: ""
        // ​
        // infoImg: ""
        // ​
        // infoLink: ""
        // ​
        // infoTitle: ""


        //TODO Alexandr

        //function toggleTemplateType() {
        //  GlobalStor.global.isTemplateTypeMenu = !GlobalStor.global.isTemplateTypeMenu;
        //}

        //================== Select new Template Type ========================//


        //function selectNewTemplateType(marker) {
        //  GlobalStor.global.isTemplateTypeMenu = 0;
        //
        //  function goToNewTemplateType() {
        //    if (marker === 4) {
        //      MainServ.setDefaultDoorConfig();
        //    }
        //    GlobalStor.global.isChangedTemplate = 0;
        //    TemplatesServ.initNewTemplateType(marker);
        //  }
        //
        //  if (GlobalStor.global.isChangedTemplate) {
        //    //----- если выбран новый шаблон после изменения предыдущего
        //    GeneralServ.confirmAlert(
        //      $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
        //      $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
        //      goToNewTemplateType
        //    );
        //  } else {
        //    TemplatesServ.initNewTemplateType(marker);
        //  }
        //
        //}


        /**========== FINISH ==========*/

        //------ clicking
        thisCtrl.showRoomSelectorDialog = showRoomSelectorDialog;
        thisCtrl.switchComment = switchComment;
        thisCtrl.showCoefInfoBlock = showCoefInfoBlock;
        thisCtrl.showInfoBox = MainServ.showInfoBox;

        //TODO Alexandr
        //thisCtrl.selectNewTemplate = TemplatesServ.selectNewTemplate;
        //thisCtrl.toggleTemplateType = toggleTemplateType;
        //thisCtrl.selectNewTemplateType = selectNewTemplateType;




      });
})();
