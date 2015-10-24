(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('RoomInfoCtrl', roomInfoCtrl);

  function roomInfoCtrl(globalConstants, GlobalStor, OrderStor, ProductStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.O = OrderStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      DELAY_SHOW_COEFF: 20 * globalConstants.STEP,
      DELAY_SHOW_ALLROOMS_BTN: 15 * globalConstants.STEP,
      typing: 'on'
    };


    //------ clicking

    thisCtrl.showRoomSelectorDialog = showRoomSelectorDialog;
    thisCtrl.switchComment = switchComment;


    //============ methods ================//

    //------ Show/Close Room Selector Dialog
    function showRoomSelectorDialog(event) {
      //----- open if comment block is closed
      if(!GlobalStor.global.isShowCommentBlock) {
        GlobalStor.global.showRoomSelectorDialog = !GlobalStor.global.showRoomSelectorDialog;
        //playSound('fly');
      }
    }

    //----- Show Comments
    function switchComment(event) {
      //playSound('swip');
      GlobalStor.global.isShowCommentBlock = !GlobalStor.global.isShowCommentBlock;
    }

  }
})();