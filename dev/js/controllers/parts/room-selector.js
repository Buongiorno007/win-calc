(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('RoomSelectorCtrl', roomSelectorCtrl);

  function roomSelectorCtrl(globalConstants, MainServ, GlobalStor, ProductStor) {

    var thisCtrl = this;
    thisCtrl.global = GlobalStor.global;
    thisCtrl.product = ProductStor.product;

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
      ProductStor.product.selectedRoomId = id;
      closeRoomSelectorDialog();

      //----- if select Door
      if(id === 6) {
        MainServ.setDefaultDoorConfig();
        ProductStor.product.constructionType = 4;
        ProductStor.product.templateIndex = 0;
//        GlobalStor.global.isReturnFromDiffPage = false;
        GlobalStor.global.isChangedTemplate = false;

        MainServ.prepareTemplates(4);

      //------- if select Balcony
      } else if(id === 3) {
        ProductStor.product.constructionType = 3;
        ProductStor.product.templateIndex = 0;
//        GlobalStor.global.isReturnFromDiffPage = false;
        GlobalStor.global.isChangedTemplate = false;

        MainServ.prepareTemplates(3);
      } else {
        if(ProductStor.product.constructionType === 3 || ProductStor.product.constructionType === 4) {
          ProductStor.product.constructionType = 1;
          ProductStor.product.templateIndex = 0;
//          GlobalStor.global.isReturnFromDiffPage = false;
          GlobalStor.global.isChangedTemplate = false;

          MainServ.prepareTemplates(1);
        }
      }
      MainServ.prepareMainPage();
      //$scope.global.startProgramm = false;
    }


    //---------- Close Room Selector Dialog
    function closeRoomSelectorDialog() {
      GlobalStor.global.showRoomSelectorDialog = false;
      //playSound('fly');
    }

  }
})();