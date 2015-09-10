
// controllers/parts/room_selector.js

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
      rooms: [],
      DELAY_SHOW_ROOM: 5 * globalConstants.STEP
    };


    //TODO must be from Server
    for(var r = 0; r < 16; r++) {
      var roomObj = {id: r};
      thisCtrl.config.rooms.push(roomObj);
    }


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
