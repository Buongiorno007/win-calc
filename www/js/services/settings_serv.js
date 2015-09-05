
// services/settings_serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('SettingsModule')
    .factory('SettingServ', settingsFactory);

  function settingsFactory($rootScope, $q, $location, localDB, GlobalStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      changeAvatar: changeAvatar,
      downloadLocations: downloadLocations,
      closeLocationPage: closeLocationPage
    };

    return thisFactory.publicObj;




    //============ methods ================//

    //----- change avatar
    function changeAvatar(newAvatar) {
      UserStor.userInfo.avatar = newAvatar;
      localDB.updateLocalServerDBs(localDB.tablesLocalDB.user.tableName, UserStor.userInfo.id, {"avatar": UserStor.userInfo.avatar});
//TODO ipad
//      navigator.camera.getPicture( function( data ) {
//        UserStor.userInfo.avatar = 'data:image/jpeg;base64,' + data;
//        localDB.updateLocalServerDBs(localDB.tablesLocalDB.user.tableName, UserStor.userInfo.id, {"avatar": UserStor.userInfo.avatar});
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



    //------- collecting cities, regions and countries in one object for registration form
    function downloadLocations() {
      var deferred = $q.defer(),
          regions = [],
          mergerLocation = [],
          regionQty, cityQty;

        //--------- get all regions relative to current countryID
        localDB.selectLocalDB(localDB.tablesLocalDB.regions.tableName, {'country_id':  UserStor.userInfo.countryId}).then(function(result) {
          regionQty = result.length;
          if(regionQty) {
            for (var reg = 0; reg < regionQty; reg++) {
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
          localDB.selectLocalDB(localDB.tablesLocalDB.cities.tableName).then(function(results) {
            cityQty = results.length;
            if(cityQty) {
              for(var cit = 0; cit < cityQty; cit++) {
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
    }


  }
})();

