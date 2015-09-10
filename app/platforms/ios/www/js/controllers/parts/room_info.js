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
    thisCtrl.swipeShowComment = swipeShowComment;
    thisCtrl.swipeHideComment = swipeHideComment;




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
    function swipeShowComment(event) {
      //playSound('swip');
      GlobalStor.global.isShowCommentBlock = 1;
      GlobalStor.global.showRoomSelectorDialog = 0;
    }

    function swipeHideComment(event) {
      //playSound('swip');
      GlobalStor.global.isShowCommentBlock = 0;
    }

  }
})();