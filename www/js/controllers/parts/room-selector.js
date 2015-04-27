
// controllers/parts/room-selector.js

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
      GlobalStor.global.constructionType = id;
      ProductStor.product.selectedRoomId = id;
      closeRoomSelectorDialog();
      //------- if the door was modified and now we are selecting a new room, the default door parameters is setting
      if(GlobalStor.global.constructionType === 4) {
        MainServ.setDefaultDoorConfig();
      }
      //----- if select Door
      if(id === 6) {
        ProductStor.product.templateIndex = 0;
        GlobalStor.global.isReturnFromDiffPage = false;
        GlobalStor.global.isChangedTemplate = false;
        MainServ.prepareTemplates(id);

        MainServ.prepareMainPage();
      } else if(id === 3) {
        //------- if select Balcony
//        $scope.global.product.templateIndex = 0;
//        $scope.global.isReturnFromDiffPage = false;
//        $scope.global.isChangedTemplate = false;
//        $scope.global.setTemplatesFromSTORE();
//        //------- get templates from STORE
//        $scope.global.setTemplatesFromSTORE();
//        //------ set new templates arrays
//        $scope.global.getCurrentTemplates();
//        //------- change template and price relate to Balcony
//        $scope.global.product.templateSource = $scope.global.templatesBalconySource[$scope.global.product.templateIndex];
//        $scope.global.product.templateDefault = $scope.global.templatesBalconyList[$scope.global.product.templateIndex];
//        $scope.global.product.templateIcon = $scope.global.templatesBalconyIconList[$scope.global.product.templateIndex];
//        $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
//        $scope.global.prepareMainPage();
      } else {
        if(GlobalStor.global.constructionType == 3 || GlobalStor.global.constructionType == 4) {

//          $scope.global.product.templateIndex = 0;
//          $scope.global.isReturnFromDiffPage = false;
//          $scope.global.isChangedTemplate = false;
//          $scope.global.setTemplatesFromSTORE();
//          //------- get templates from STORE
//          $scope.global.setTemplatesFromSTORE();
//          //------ set new templates arrays
//          $scope.global.getCurrentTemplates();
//          //------- change template and price relate to Window
//          $scope.global.product.templateSource = $scope.global.templatesWindSource[$scope.global.product.templateIndex];
//          $scope.global.product.templateDefault = $scope.global.templatesWindList[$scope.global.product.templateIndex];
//          $scope.global.product.templateIcon = $scope.global.templatesWindIconList[$scope.global.product.templateIndex];
//          $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
        }
        MainServ.prepareMainPage();
      }
      //$scope.global.startProgramm = false;
    }


    //---------- Close Room Selector Dialog
    function closeRoomSelectorDialog() {
      GlobalStor.global.showRoomSelectorDialog = false;
      //playSound('fly');
    }

  }
})();
