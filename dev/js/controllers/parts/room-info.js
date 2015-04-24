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
    thisCtrl.global = GlobalStor.global;
    thisCtrl.order = OrderStor.order;
    thisCtrl.product = ProductStor.product;

    thisCtrl.config = {
      DELAY_SHOW_COEFF: 20 * globalConstants.STEP,
      DELAY_SHOW_ALLROOMS_BTN: 15 * globalConstants.STEP,
      typing: 'on'
    };



    //------ clicking

    thisCtrl.showRoomSelectorDialog = showRoomSelectorDialog;
    thisCtrl.swipeShowComment = swipeShowComment;
    thisCtrl.swipeHideComment = swipeHideComment;




    //============ methods ================//

    //------ Show/Close Room Selector Dialog
    function showRoomSelectorDialog(event) {
      if(!GlobalStor.global.isShowCommentBlock) {
        if (GlobalStor.global.showRoomSelectorDialog === true) {
          GlobalStor.global.showRoomSelectorDialog = false;
        } else {
          GlobalStor.global.showRoomSelectorDialog = true;
          GlobalStor.global.isRoomsDialog = true;
        }
        //playSound('fly');
      }
    }

    //----- Show Comments
    function swipeShowComment(event) {
      //playSound('swip');
      GlobalStor.global.isShowCommentBlock = true;
      GlobalStor.global.showRoomSelectorDialog = false;
    }

    function swipeHideComment(event) {
      //playSound('swip');
      GlobalStor.global.isShowCommentBlock = false;
    }

  }
})();