(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('RoomSelectorCtrl', roomSelectorCtrl);

  function roomSelectorCtrl(globalConstants, GeneralServ, MainServ, GlobalStor, ProductStor, UserStor) {

    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      rooms: [
        {
          id: 0,
          width: 750,
          height: 1450,
          price: 1289
        },
        {
          id: 1,
          width: 1250,
          height: 1450,
          price: 1756
        },
        {
          id: 2,
          width: 2050,
          height: 1450,
          price: 2427
        },
        {
          id: 3,
          width: 750,
          height: 1850,
          price: 1549
        },
        {
          id: 4,
          width: 750,
          height: 2050,
          price: 1759
        },
        {
          id: 5,
          width: 2000,
          height: 2050,
          price: 2728
        },
        {
          id: 6,
          width: 1450,
          height: 2050,
          price: 2993
        },
        {
          id: 7,
          width: 4400,
          height: 1550,
          price: 6544
        },
        {
          id: 8,
          width: 4400,
          height: 1550,
          price: 6915
        },
        {
          id: 9
        },
        {
          id: 10
        },
        {
          id: 11
        },
        {
          id: 12
        },
        {
          id: 13
        },
        {
          id: 14
        },
        {
          id: 15
        }
      ],
      DELAY_SHOW_ROOM: 2*globalConstants.STEP
    };


    //TODO must be from Server
//    for(var r = 0; r < 16; r++) {
//      var roomObj = {id: r};
//      thisCtrl.config.rooms.push(roomObj);
//    }


    //------ clicking
    thisCtrl.selectRoom = selectRoom;
    thisCtrl.closeRoomSelectorDialog = closeRoomSelectorDialog;

    //============ methods ================//

    //---------- Room Select
    function selectRoom(id) {
      ProductStor.product.room_id = id;
      closeRoomSelectorDialog();
    }


    //---------- Close Room Selector Dialog
    function closeRoomSelectorDialog() {
      GlobalStor.global.showRoomSelectorDialog = 0;
      GlobalStor.global.configMenuTips = (GlobalStor.global.startProgramm) ? 1 : 0;
      //playSound('fly');
    }

  }
})();