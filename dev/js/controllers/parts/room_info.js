(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('RoomInfoCtrl', roomInfoCtrl);

  function roomInfoCtrl(globalConstants, GlobalStor, OrderStor, ProductStor, UserStor) {
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


    /**========== FINISH ==========*/

    //------ clicking
    thisCtrl.showRoomSelectorDialog = showRoomSelectorDialog;
    thisCtrl.switchComment = switchComment;

  }
})();