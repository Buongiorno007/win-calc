(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('RoomSelectorCtrl', roomSelectorCtrl);

  function roomSelectorCtrl($scope, localStorage, globalConstants) {
    $scope.global = localStorage.storage;

    $scope.roomData = {
      DELAY_SHOW_ROOM1: 5 * globalConstants.STEP,
      DELAY_SHOW_ROOM2: 6 * globalConstants.STEP,
      DELAY_SHOW_ROOM3: 7 * globalConstants.STEP,
      DELAY_SHOW_ROOM4: 8 * globalConstants.STEP,
      DELAY_SHOW_ROOM5: 9 * globalConstants.STEP,
      DELAY_SHOW_ROOM6: 10 * globalConstants.STEP
    };


    // Room Select
    $scope.selectRoom = function(id) {
      $scope.global.product.selectedRoomId = id;
      $scope.closeRoomSelectorDialog();
      //------- if the door was modified and now we are selecting a new room, the default door parameters is setting
      if($scope.global.isConstructDoor) {
        $scope.global.setDefaultDoorConfig();
      }
      //----- if select Door
      if(id === 6) {
        $scope.global.product.templateIndex = 0;
        $scope.global.isReturnFromDiffPage = false;
        $scope.global.isChangedTemplate = false;
        $scope.global.setTemplatesFromSTORE();
        $scope.global.isConstructWind = false;
        $scope.global.isConstructWindDoor = false;
        $scope.global.isConstructBalcony = false;
        $scope.global.isConstructDoor = true;
        //------- get templates from STORE
        $scope.global.setTemplatesFromSTORE();
        //------ set new templates arrays
        $scope.global.getCurrentTemplates();
        //------- change template and price relate to Door
        $scope.global.product.templateSource = $scope.global.templatesDoorSource[$scope.global.product.templateIndex];
        $scope.global.product.templateDefault = $scope.global.templatesDoorList[$scope.global.product.templateIndex];
        $scope.global.product.templateIcon = $scope.global.templatesDoorIconList[$scope.global.product.templateIndex];
        $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
        $scope.global.prepareMainPage();
      } else if(id === 3) {
        //------- if select Balcony
        $scope.global.product.templateIndex = 0;
        $scope.global.isReturnFromDiffPage = false;
        $scope.global.isChangedTemplate = false;
        $scope.global.setTemplatesFromSTORE();
        $scope.global.isConstructWind = false;
        $scope.global.isConstructWindDoor = false;
        $scope.global.isConstructBalcony = true;
        $scope.global.isConstructDoor = false;
        //------- get templates from STORE
        $scope.global.setTemplatesFromSTORE();
        //------ set new templates arrays
        $scope.global.getCurrentTemplates();
        //------- change template and price relate to Balcony
        $scope.global.product.templateSource = $scope.global.templatesBalconySource[$scope.global.product.templateIndex];
        $scope.global.product.templateDefault = $scope.global.templatesBalconyList[$scope.global.product.templateIndex];
        $scope.global.product.templateIcon = $scope.global.templatesBalconyIconList[$scope.global.product.templateIndex];
        $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
        $scope.global.prepareMainPage();
      } else {
        if($scope.global.isConstructBalcony || $scope.global.isConstructDoor) {

          $scope.global.product.templateIndex = 0;
          $scope.global.isReturnFromDiffPage = false;
          $scope.global.isChangedTemplate = false;
          $scope.global.setTemplatesFromSTORE();
          $scope.global.isConstructWind = true;
          $scope.global.isConstructWindDoor = false;
          $scope.global.isConstructBalcony = false;
          $scope.global.isConstructDoor = false;
          //------- get templates from STORE
          $scope.global.setTemplatesFromSTORE();
          //------ set new templates arrays
          $scope.global.getCurrentTemplates();
          //------- change template and price relate to Window
          $scope.global.product.templateSource = $scope.global.templatesWindSource[$scope.global.product.templateIndex];
          $scope.global.product.templateDefault = $scope.global.templatesWindList[$scope.global.product.templateIndex];
          $scope.global.product.templateIcon = $scope.global.templatesWindIconList[$scope.global.product.templateIndex];
          $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
        }
        $scope.global.prepareMainPage();
      }
      $scope.global.startProgramm = false;
    };

    // Close Room Selector Dialog
    $scope.closeRoomSelectorDialog = function() {
      $scope.global.showRoomSelectorDialog = false;
      //playSound('fly');
    };

  }
})();