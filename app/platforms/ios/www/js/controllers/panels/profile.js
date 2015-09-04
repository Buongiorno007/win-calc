
// controllers/panels/profile.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('ProfileCtrl', profileSelectorCtrl);

  function profileSelectorCtrl($scope, globalConstants, GlobalStor, UserStor, analyticsServ) {

    $scope.global = GlobalStor.global;

    $scope.profilePanel = {
      DELAY_START: 5 * globalConstants.STEP,
      DELAY_BLOCK: 2 * globalConstants.STEP,
      DELAY_TYPING: 2.5 * globalConstants.STEP,
      typing: 'on'
    };


    // Select profile
    $scope.selectProfile = function(producerIndex, profileIndex, profileId) {
      $scope.global.product.profileTypeIndex = producerIndex;
      $scope.global.product.profileIndex = profileIndex;
      var selectedProfile = $scope.profilePanel.profiles[producerIndex][profileIndex];
      $scope.global.product.profileId = profileId;
      $scope.global.product.profileName = selectedProfile.profileDescrip;
      $scope.global.product.profileHeatCoeff = selectedProfile.heatCoeff;
      $scope.global.product.profileAirCoeff = selectedProfile.airCoeff;
      //---- find profile index
      for(var pr = 0; pr < $scope.global.profiles.length; pr++) {
        if($scope.global.profiles[pr].id === profileId) {
          $scope.global.product.profileIndex = pr;
        }
      }

      //-------- clearing for new templates
      $scope.global.templatesWindList.length = 0;
      $scope.global.templatesWindIconList.length = 0;
      $scope.global.templatesWindDoorList.length = 0;
      $scope.global.templatesWindDoorIconList.length = 0;
      $scope.global.templatesBalconyList.length = 0;
      $scope.global.templatesBalconyIconList.length = 0;
      $scope.global.templatesDoorList.length = 0;
      $scope.global.templatesDoorIconList.length = 0;

      $scope.global.parseTemplate($scope.global.product.profileIndex, profileId);

      //------ save analytics data
      analyticsServ.saveAnalyticDB(UserStor.userInfo.id, $scope.global.order.orderId, profileId, producerIndex);
    };

  }
})();

