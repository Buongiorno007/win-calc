(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('RoomInfoCtrl',

  function(
    $filter,
    globalConstants,
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

    //------- translate
    thisCtrl.CLIMATE_ZONE = $filter('translate')('mainpage.CLIMATE_ZONE');
    thisCtrl.THERMAL_RESISTANCE = $filter('translate')('mainpage.THERMAL_RESISTANCE');
    thisCtrl.ROOM_SELECTION = $filter('translate')('mainpage.ROOM_SELECTION');
    thisCtrl.COMMENT = $filter('translate')('mainpage.COMMENT');


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


    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.showRoomSelectorDialog = showRoomSelectorDialog;
    thisCtrl.switchComment = switchComment;

  });
})();