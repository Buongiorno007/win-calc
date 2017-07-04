(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('SettingsModule')
    .factory('SettingServ',

  function(
    $rootScope,
    $location,
    localDB,
    GlobalStor,
    UserStor
  ) {
    /*jshint validthis:true */
    var thisFactory = this;




    /**============ METHODS ================*/

    //----- change avatar
    function changeAvatar(newAvatar, form) {
      UserStor.userInfo.avatar = newAvatar;
      //------- send avatar to Server
      localDB.sendIMGServer(form);
      //------- save avatar in LocalDB
      localDB.updateLocalDB(localDB.tablesLocalDB.users.tableName, {avatar: newAvatar}, {'id': UserStor.userInfo.id});

//TODO ipad
//      navigator.camera.getPicture( function( data ) {
//        UserStor.userInfo.avatar = 'data:image/jpeg;base64,' + data;
//        localDB.updateLocalServerDBs(
      // localDB.tablesLocalDB.users.tableName, UserStor.userInfo.id, {"avatar": UserStor.userInfo.avatar}
      // );
//        $rootScope.$apply();
//      }, function( error ) {
//        console.log( 'Error upload user avatar' + error );
//        console.log(UserStor.userInfo);
//      }, {
//        destinationType: Camera.DestinationType.DATA_URL,
//        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
//        allowEdit: false,
//        targetWidth: 76,
//        targetHeight: 76,
//        mediaType: Camera.MediaType.PICTURE
//      } );
    }



    //-------- close Location Page
    function closeLocationPage() {
      console.log(GlobalStor.global.currOpenPage);
      $location.path('/' + GlobalStor.global.currOpenPage);
    }

    function gotoLocationPage() {
      $location.path('/location');
    }

    function gotoPasswordPage() {
      $location.path('/change-pass');
    }

    function gotoLanguagePage() {
      $location.path('/change-lang');
    }

    function gotoSettingsPage() {
      $location.path('/settings');
    }

    function closeSettingsPage() {
      //      $scope.global.isOpenSettingsPage = false;
      //      $scope.global.isReturnFromDiffPage = true;
      //console.log('prevOpenPage +++', GlobalStor.global.prevOpenPage);
      $location.path(GlobalStor.global.prevOpenPage);
    }



    /**========== FINISH ==========*/

    thisFactory.publicObj = {
      changeAvatar: changeAvatar,
      //downloadLocations: downloadLocations,
      closeLocationPage: closeLocationPage,
      gotoLocationPage: gotoLocationPage,
      gotoPasswordPage: gotoPasswordPage,
      gotoLanguagePage: gotoLanguagePage,
      gotoSettingsPage: gotoSettingsPage,
      closeSettingsPage: closeSettingsPage
    };

    return thisFactory.publicObj;


  });
})();
