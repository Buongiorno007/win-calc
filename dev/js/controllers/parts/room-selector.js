(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('RoomSelectorCtrl', roomSelectorCtrl);

  function roomSelectorCtrl(globalConstants, GeneralServ, MainServ, GlobalStor, ProductStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;

    thisCtrl.config = {
      DELAY_SHOW_ROOM1: 5 * globalConstants.STEP,
      DELAY_SHOW_ROOM2: 6 * globalConstants.STEP,
      DELAY_SHOW_ROOM3: 7 * globalConstants.STEP,
      DELAY_SHOW_ROOM4: 8 * globalConstants.STEP,
      DELAY_SHOW_ROOM5: 9 * globalConstants.STEP,
      DELAY_SHOW_ROOM6: 10 * globalConstants.STEP
    };

    //------ clicking

    thisCtrl.selectRoom = selectRoom;
    thisCtrl.closeRoomSelectorDialog = closeRoomSelectorDialog;

    //============ methods ================//

    //---------- Room Select
    function selectRoom(id) {
      ProductStor.product.room_id = id;
      closeRoomSelectorDialog();
      MainServ.prepareMainPage();
      GeneralServ.stopStartProg();
    }


    //---------- Close Room Selector Dialog
    function closeRoomSelectorDialog() {
      GlobalStor.global.showRoomSelectorDialog = false;
      //playSound('fly');
    }

  }
})();