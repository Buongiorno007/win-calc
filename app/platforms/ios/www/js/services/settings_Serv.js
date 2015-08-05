(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .factory('SettingServ', settingsFactory);

  function settingsFactory($rootScope, $q, $location, globalDB, GlobalStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      changeAvatar: changeAvatar,
      downloadLocations: downloadLocations,
      closeLocationPage: closeLocationPage
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //----- change avatar
    function changeAvatar() {
      navigator.camera.getPicture( function( data ) {
        UserStor.userInfo.avatarUrl = 'data:image/jpeg;base64,' + data;
        $rootScope.$apply();
      }, function( error ) {
        console.log( 'Error upload user avatar' + error );
        console.log(UserStor.userInfo);
      }, {
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: false,
        targetWidth: 76,
        targetHeight: 76,
        mediaType: Camera.MediaType.PICTURE
      } );
    }



    //------- collecting cities, regions and countries in one object for registration form
    function downloadLocations() {
      var deferred = $q.defer(),
          regions = [],
          mergerLocation = [],
          reg = 0,
          regionQty, cityQty;

        //--------- get all regions relative to current countryID
        globalDB.selectDBGlobal(globalDB.regionsTableDBGlobal, {'country_id':  UserStor.userInfo.countryId}).then(function(result) {
          if(result) {
            regionQty = result.length;
            for (; reg < regionQty; reg++) {
              var tempRegion = {
                id: result[reg].id,
                countryId: result[reg].country_id,
                name: result[reg].name,
                climaticZone: result[reg].climatic_zone,
                heatTransfer: result[reg].heat_transfer
              };
              regions.push(tempRegion);
            }
          } else {
            console.log('Error!!!', result);
          }

        }).then(function() {

          //--------- get all cities relative to current countryID
          globalDB.selectAllDBGlobal(globalDB.citiesTableDBGlobal).then(function(results) {
            if(results) {
              var cit = 0;
              cityQty = results.length;
              for(; cit < cityQty; cit++) {
                for(var r = 0; r < regionQty; r++) {
                  if(results[cit].region_id === regions[r].id) {
                    var location = {
                      cityId: results[cit].id,
                      cityName: results[cit].name,
                      regionName: regions[r].name,
                      climaticZone: regions[r].climaticZone,
                      heatTransfer: regions[r].heatTransfer,
                      countryId: UserStor.userInfo.countryId,
                      countryName: UserStor.userInfo.countryName,
                      fullLocation: '' + results[cit].name + ', ' + regions[r].name + ', ' + UserStor.userInfo.countryName
                    };
                    mergerLocation.push(location);
                  }
                }

              }
              deferred.resolve(mergerLocation);
            } else {
              deferred.reject(results);
            }
          });

        });
      return deferred.promise;
    }




    //-------- close Location Page
    function closeLocationPage() {
      $location.path('/' + GlobalStor.global.currOpenPage);
//      if($scope.global.isOpenSettingsPage) {
//        $scope.global.gotoSettingsPage();
//      } else {
//        $scope.global.showNavMenu = true;
//        $scope.global.isConfigMenu = false;
//        $scope.global.showPanels = {};
//        $location.path('/main');
//      }
    }




  }
})();
