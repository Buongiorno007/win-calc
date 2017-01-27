(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .controller('RoomSelectorCtrl',

      function ($filter,
                $location,
                globalConstants,
                MainServ,
                TemplatesServ,
                GlobalStor,
                ProductStor,
                UserStor,
                optionsServ,
                DesignStor,
                $timeout) {
        /*jshint validthis:true */
        var thisCtrl = this;
        thisCtrl.G = GlobalStor;
        thisCtrl.P = ProductStor;
        thisCtrl.U = UserStor;

        thisCtrl.config = {
          DELAY_SHOW_ROOM: 2 * globalConstants.STEP
        };


        /**============ translates ================*/
        thisCtrl.INFO_HINT = $filter('translate')('panels.INFO_HINT');
        /**============ METHODS ================*/

        //---------- Room Select
        function selectRoom(id) {
          GlobalStor.global.rooms.length
          optionsServ.getTemplateImgIcons(function (results) {
            if (results.status) {
              GlobalStor.global.templatesImgs = results.data.templateImgs.filter(function (data) {
                return data.type === GlobalStor.global.rooms[id].group_id;
              });
            }
            ;
          });
          MainServ.downloadAllTemplates(GlobalStor.global.rooms[id].group_id).then(function (data) {
            if (data) {
              GlobalStor.global.templatesSourceSTORE = angular.copy(data);
              GlobalStor.global.templatesSource = angular.copy(data);
            }
          });
          if(GlobalStor.global.selectRoom === 0 && !GlobalStor.global.selectNewTemplate) {
            GlobalStor.global.prohibitCopyingTemplate = 1;
            $location.path('/design');
            GlobalStor.global.templateTEMP = angular.copy(ProductStor.product);
            TemplatesServ.selectNewTemplate((GlobalStor.global.rooms[id].template_id - 1), id+1, 'main');
            GlobalStor.global.selectRoom = 1;
          } else {
            TemplatesServ.selectNewTemplate((GlobalStor.global.rooms[id].template_id - 1), id+1, 'main');
          }
          if (DesignStor.design.showHint >= 0) {
            GlobalStor.global.hintTimer = setTimeout(function () {
              DesignStor.design.showHint = 1;
            }, 90000);
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
