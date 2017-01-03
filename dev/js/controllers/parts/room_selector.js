(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('RoomSelectorCtrl',

  function(
    $location,
    globalConstants,
    MainServ,
    TemplatesServ,
    GlobalStor,
    ProductStor,
    UserStor,
    optionsServ
  ) {
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

      optionsServ.getTemplateImgIcons(function(results) {
        if (results.status) {
          GlobalStor.global.templatesImgs = results.data.templateImgs.filter(function(data) {
            return data.type === GlobalStor.global.rooms[id].group_id;
          });
        };
      });
      MainServ.downloadAllTemplates(GlobalStor.global.rooms[id].group_id).then(function(data) {
        if (data) {
          GlobalStor.global.templatesSourceSTORE = angular.copy(data);
          GlobalStor.global.templatesSource = angular.copy(data);
        }
      });



      if(GlobalStor.global.selectRoom === 0) {
        $location.path('/design');
        TemplatesServ.selectNewTemplate((GlobalStor.global.rooms[id].template_id - 1), id+1, 'main');
        GlobalStor.global.selectRoom = 1;
      } else {
        TemplatesServ.selectNewTemplate((GlobalStor.global.rooms[id].template_id - 1), id+1, 'main');
      }
    }


    /**========== FINISH ==========*/
    //------ clicking
    thisCtrl.selectRoom = selectRoom;
    thisCtrl.closeRoomSelectorDialog = MainServ.closeRoomSelectorDialog;
    //---- hide rooms if opened
    GlobalStor.global.showRoomSelectorDialog = 0;

  });
})();
