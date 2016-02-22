(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('RoomSelectorCtrl', roomSelectorCtrl);

  function roomSelectorCtrl(globalConstants, MainServ, TemplatesServ, GlobalStor, ProductStor, UserStor) {
    /*jshint validthis:true */
    var thisCtrl = this;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.U = UserStor;

    thisCtrl.config = {
      DELAY_SHOW_ROOM: 2*globalConstants.STEP
    };



    /**============ METHODS ================*/

    //---------- Room Select
    function selectRoom(id) {
      TemplatesServ.selectNewTemplate((GlobalStor.global.rooms[id].template_id - 1), id+1);
    }


    /**========== FINISH ==========*/
    //------ clicking
    thisCtrl.selectRoom = selectRoom;
    thisCtrl.closeRoomSelectorDialog = MainServ.closeRoomSelectorDialog;

  }
})();