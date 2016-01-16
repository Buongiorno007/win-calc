(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('LoginModule')
    .factory('loginServ', startFactory);

  function startFactory($q, $cordovaGlobalization, $cordovaFileTransfer, $translate, $location, $filter, localDB, globalConstants, GeneralServ, optionsServ, GlobalStor, OrderStor, UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      getDeviceLanguage: getDeviceLanguage,
      initExport: initExport,
      isLocalDBExist: isLocalDBExist,
      prepareLocationToUse: prepareLocationToUse,
      collectCityIdsAsCountry: collectCityIdsAsCountry,
      setUserLocation: setUserLocation,
      setUserGeoLocation: setUserGeoLocation,
      downloadAllData: downloadAllData
    };

    return thisFactory.publicObj;


    //============ methods ================//


    //------- defined system language
    function getDeviceLanguage() {
      GlobalStor.global.isDevice = isDevice;
      if(GlobalStor.global.isDevice) {
        /** if Ipad */
        $cordovaGlobalization.getPreferredLanguage().then(
          function(result) {
            console.log('language++', result);
            checkLangDictionary(result.value);
            $translate.use(UserStor.userInfo.langLabel);
          },
          function(error) {
            console.log('No language defined');
          });

      } else {
        /** if browser */
        var browserLang = navigator.language || navigator.userLanguage;
        //console.info(window.navigator);
//        console.info(window.navigator.language);
//        console.info(window.navigator.userLanguage);
//        console.info(window.navigator.browserLanguage);
//        console.info("The language is: " + browserLang);
        checkLangDictionary(browserLang);
        $translate.use(UserStor.userInfo.langLabel);
      }
    }




    //------ compare device language with existing dictionary, if not exist set default language = English
    function checkLangDictionary(lang) {
      var langQty = globalConstants.languages.length;
      while(--langQty > -1) {
        if(globalConstants.languages[langQty].label.indexOf(lang)+1) {
          UserStor.userInfo.langLabel = globalConstants.languages[langQty].label;
          UserStor.userInfo.langName = globalConstants.languages[langQty].name;
          break;
        }
      }
    }




    function initExport() {
      var defer = $q.defer();
      console.log('EXPORT');
      //------- check Export Table
      localDB.selectLocalDB(localDB.tablesLocalDB.export.tableName).then(function(data) {
        //        console.log('data ===', data);
        if(data.length) {
          //----- get last user
          localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName).then(function(user) {
            if(user.length) {
              localDB.updateServer(user[0].phone, user[0].device_code, data).then(function(result) {
                console.log('FINISH export',result);
                //----- if update Server is success, clean Export in LocalDB
                if(result) {
                  localDB.cleanLocalDB({export: 1});
                  defer.resolve(1);
                }
              });
            }
          });
        }
      });
      return defer.promise;
    }


    function isLocalDBExist() {
      var defer = $q.defer();
//      localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName).then(function(data) {
      localDB.selectLocalDB('sqlite_sequence').then(function(data) {
//        console.log('data ===', data);
        if(data && data.length > 5) {
          defer.resolve(1);
        } else {
          defer.resolve(0);
        }
      });
      return defer.promise;
    }



    //------- collecting cities, regions and countries in one object for registration form
    function prepareLocationToUse() {
      var deferred = $q.defer(),
          generalLocations = {
            countries: [],
            regions: [],
            cities: [],
            mergerLocation: []
          },
          countryQty, regionQty, cityQty;
      //---- get all counties
      localDB.selectLocalDB(localDB.tablesLocalDB.countries.tableName).then(function(data) {
        countryQty = data.length;
        if(countryQty) {
          for (var stat = 0; stat < countryQty; stat++) {
            var tempCountry = {
              id: data[stat].id,
              name: data[stat].name,
              currency: data[stat].currency_id
            };
            generalLocations.countries.push(tempCountry);
          }
        } else {
          console.log('Error!!!', data);
        }
      }).then(function(){

        //--------- get all regions
        localDB.selectLocalDB(localDB.tablesLocalDB.regions.tableName).then(function(data) {
          regionQty = data.length;
          if(regionQty) {
            for (var reg = 0; reg < regionQty; reg++) {
              var tempRegion = {
                id: data[reg].id,
                countryId: data[reg].country_id,
                name: data[reg].name,
                climaticZone: data[reg].climatic_zone,
                heatTransfer: data[reg].heat_transfer
              };
              generalLocations.regions.push(tempRegion);
            }
          } else {
            console.log('Error!!!', data);
          }

        }).then(function() {

          //--------- get all cities
          localDB.selectLocalDB(localDB.tablesLocalDB.cities.tableName).then(function(data) {
            cityQty = data.length;
            if(cityQty) {
              for(var cit = 0; cit < cityQty; cit++) {
                var tempCity = {
                  id: data[cit].id,
                  regionId: data[cit].region_id,
                  name: data[cit].name
                };
                generalLocations.cities.push(tempCity);

                var location = {
                  cityId: data[cit].id,
                  cityName: data[cit].name
                };
                for(var r = 0; r < regionQty; r++) {
                  if(data[cit].region_id === generalLocations.regions[r].id) {
                    location.regionName = generalLocations.regions[r].name;
                    location.climaticZone = generalLocations.regions[r].climaticZone;
                    location.heatTransfer = GeneralServ.roundingValue(1/generalLocations.regions[r].heatTransfer);
                    for(var s = 0; s < countryQty; s++) {
                      if(generalLocations.regions[r].countryId === generalLocations.countries[s].id) {
                        location.countryId = generalLocations.countries[s].id;
                        location.countryName = generalLocations.countries[s].name;
                        location.currencyId = generalLocations.countries[s].currency;
                        location.fullLocation = '' + location.cityName + ', ' + location.regionName + ', ' + location.countryName;
                        generalLocations.mergerLocation.push(location);
                      }
                    }
                  }
                }

              }
              deferred.resolve(generalLocations);
            } else {
              deferred.reject(data);
            }
          });

        });
      });
      return deferred.promise;
    }


    function collectCityIdsAsCountry(location) {
      var defer = $q.defer(),
          locationQty = location.length,
          cityIds = [];
      for(var i = 0; i < locationQty; i++) {
        if(location[i].countryId === UserStor.userInfo.countryId) {
          cityIds.push(location[i].cityId);
        }
      }
      defer.resolve(cityIds.join(','));
      return defer.promise;
    }


    //--------- set user location
    function setUserLocation(locations, cityId) {
      var locationQty = locations.length;
      for(var loc = 0; loc < locationQty; loc++) {
        if(locations[loc].cityId === cityId) {
          UserStor.userInfo.cityName = locations[loc].cityName;
          UserStor.userInfo.climaticZone = locations[loc].climaticZone;
          UserStor.userInfo.heatTransfer = (UserStor.userInfo.therm_coeff_id) ? locations[loc].heatTransfer : GeneralServ.roundingValue(1/locations[loc].heatTransfer);
          UserStor.userInfo.countryName = locations[loc].countryName;
          UserStor.userInfo.countryId = locations[loc].countryId;
          UserStor.userInfo.fullLocation = locations[loc].fullLocation;
          //------ set current GeoLocation
          setUserGeoLocation(cityId, locations[loc].cityName, locations[loc].climaticZone, UserStor.userInfo.heatTransfer, locations[loc].fullLocation);
        }
      }
    }

    //--------- set current user geolocation
    function setUserGeoLocation(cityId, cityName, climatic, heat, fullLocation) {
      OrderStor.order.customer_city_id = cityId;
      OrderStor.order.customer_city = cityName;
      OrderStor.order.climatic_zone = climatic;
      OrderStor.order.heat_coef_min = heat;
      OrderStor.order.customer_location = fullLocation;
    }





    /** =========== DOWNLOAD ALL DATA =========== */

    function downloadAllData() {
      //console.log('START DOWNLOAD!!!!!!', new Date(), new Date().getMilliseconds());
      /** download All Currencies and set currency symbol */
      setCurrency().then(function(data) {
        if(data) {
          /** download user discounts */
          setUserDiscounts().then(function(data) {
            if(data) {

              /** download price Margins of Plant */
              downloadPriceMargin().then(function(margins) {
                if(margins && margins.length) {
                  GlobalStor.global.margins = angular.copy(margins[0]);
                  //              console.warn('Margins!!', margins);

                  /** download delivery Coeff of Plant */
                  downloadDeliveryCoeff().then(function(coeff){
                    if(coeff && coeff.length) {
                      //                  console.warn('delivery Coeff!!', coeff);
                      GlobalStor.global.deliveryCoeff = angular.copy(coeff[0]);
                      GlobalStor.global.deliveryCoeff.percents = coeff[0].percents.split(',').map(function(item) {
                        return item * 1;
                      });

                      /** download All Profiles */
                      downloadAllElemAsGroup(localDB.tablesLocalDB.profile_system_folders.tableName, localDB.tablesLocalDB.profile_systems.tableName, GlobalStor.global.profilesType, GlobalStor.global.profiles).then(function(data) {
                        if(data) {
//                          console.log('PROFILES ALL ++++++',GlobalStor.global.profilesType, GlobalStor.global.profiles);
                          /** download All Glasses */
                          downloadAllGlasses().then(function(data) {
                            if(data) {
                              /** sorting glasses as to Type */
                              sortingGlasses();
//                              console.log('GLASSES All +++++', GlobalStor.global.glassesAll);
                              /** download All Hardwares */
                              downloadAllElemAsGroup(localDB.tablesLocalDB.window_hardware_folders.tableName, localDB.tablesLocalDB.window_hardware_groups.tableName, GlobalStor.global.hardwareTypes, GlobalStor.global.hardwares).then(function(data){
                                if(data) {
//                                  console.log('HARDWARE ALL ++++++', GlobalStor.global.hardwareTypes, GlobalStor.global.hardwares);

                                  /** download All Templates and Backgrounds */
                                  downloadAllBackgrounds().then(function() {

                                    /** download All AddElements */
                                    downloadAllAddElements().then(function() {
                                      /** download All Lamination */
                                      downloadAllLamination().then(function(result) {
                                        var lamins = angular.copy(result);
  //                                      console.log('LAMINATION++++', lamins);
                                        if(lamins) {
                                          var laminQty = lamins.length;
                                          if(laminQty) {
                                            /** change Images Path and save in device */
                                            while(--laminQty > -1) {
                                              lamins[laminQty].img = downloadElemImg(lamins[laminQty].img);
                                            }
                                            GlobalStor.global.laminationsIn = angular.copy(lamins);
                                            GlobalStor.global.laminationsOut = angular.copy(lamins);
                                          }
                                        }

                                        /** download Cart Menu Data */
                                        downloadCartMenuData();
                                        GlobalStor.global.isLoader = 0;
                                        $location.path('/main');
                                        //console.log('FINISH DOWNLOAD !!!!!!', new Date(), new Date().getMilliseconds());
                                      });
                                    });
                                  });
                                }
                              });
                            }
                          });
                        }
                      });

                    } else {
                      console.error('not find options_discounts!');
                    }
                  });

                } else {
                  console.error('not find options_coefficients!');
                }
              });

            }
          });
        }
      });
    }



    function setCurrency() {
      var defer = $q.defer();
      /** download All Currencies */
      localDB.selectLocalDB(localDB.tablesLocalDB.currencies.tableName, null, 'id, is_base, name, value').then(function(currencies) {
        var currencQty = currencies.length;
        if(currencies && currencQty) {
          GlobalStor.global.currencies = currencies;
          /** set current currency */
          while(--currencQty > -1) {
            if(currencies[currencQty].is_base === 1) {
              UserStor.userInfo.currencyId = currencies[currencQty].id;
              if( /uah/i.test(currencies[currencQty].name) ) {
                UserStor.userInfo.currency = '\u20b4';//'₴';
              } else if( /rub/i.test(currencies[currencQty].name) ) {
                UserStor.userInfo.currency = '\ue906';// '\u20BD';//'₽';
              } else if( /(usd|\$)/i.test(currencies[currencQty].name) ) {
                UserStor.userInfo.currency = '$';
              } else if( /eur/i.test(currencies[currencQty].name) ) {
                UserStor.userInfo.currency = '\u20AC';//'€';
              } else {
                UserStor.userInfo.currency = '\xA4';//Generic Currency Symbol
              }
            }
          }
          defer.resolve(1);
        } else {
          console.error('not find currencies!');
          defer.resolve(0);
        }
      });
      return defer.promise;
    }


    function setUserDiscounts() {
      var defer = $q.defer();
      //-------- add server url to avatar img
      UserStor.userInfo.avatar = globalConstants.serverIP + UserStor.userInfo.avatar;

      localDB.selectLocalDB(localDB.tablesLocalDB.users_discounts.tableName).then(function(result) {
//        console.log('DISCTOUN=====', result);
        var discounts = angular.copy(result[0]);
        if(discounts) {
          UserStor.userInfo.discountConstr = discounts.default_construct*1;
          UserStor.userInfo.discountAddElem = discounts.default_add_elem*1;
          UserStor.userInfo.discountConstrMax = discounts.max_construct*1;
          UserStor.userInfo.discountAddElemMax = discounts.max_add_elem*1;

          var disKeys = Object.keys(discounts),
              disQty = disKeys.length;
          for(var dis = 0; dis < disQty; dis++) {
            if(disKeys[dis].indexOf('week')+1) {
              if(disKeys[dis].indexOf('construct')+1) {
                UserStor.userInfo.discConstrByWeek.push(discounts[disKeys[dis]]*1);
              } else if(disKeys[dis].indexOf('add_elem')+1) {
                UserStor.userInfo.discAddElemByWeek.push(discounts[disKeys[dis]]*1);
              }
            }
          }
          defer.resolve(1);
        } else {
          console.error('not find users_discounts!');
          defer.resolve(0);
        }
      });
      return defer.promise;
    }



    /** price Margins of Plant */
    function downloadPriceMargin() {
      return localDB.selectLocalDB(localDB.tablesLocalDB.options_coefficients.tableName, null, 'margin, coeff').then(function(margins) {
        return margins;
      });
    }

    /** delivery Coeff of Plant */
    function downloadDeliveryCoeff() {
      return localDB.selectLocalDB(localDB.tablesLocalDB.options_discounts.tableName).then(function(coeff) {
        return coeff;
      });
    }



    //----------- get all elements as to groups

    function downloadAllElemAsGroup(tableGroup, tableElem, groups, elements) {
      var defer = $q.defer();
      //------- get all Folders
      localDB.selectLocalDB(tableGroup).then(function(result) {
        /** sorting types by position */
        var types = angular.copy(result).sort(function(a, b) {
          return GeneralServ.sorting(a.position, b.position);
        }),
        typesQty = types.length;
        if (typesQty) {
          groups.length = 0;
          angular.extend(groups, types);
          var promises = types.map(function(type) {
            var defer2 = $q.defer();

            /** change Images Path and save in device */
            type.img = downloadElemImg(type.img);

            localDB.selectLocalDB(tableElem, {'folder_id': type.id}).then(function (result2) {
              if (result2.length) {
                var elem = angular.copy(result2).sort(function(a, b) {
                  return GeneralServ.sorting(a.position, b.position);
                });
                defer2.resolve(elem);
              } else {
                defer2.resolve(0);
              }
            });
            return defer2.promise;
          });
          $q.all(promises).then(function(result3){
            var resQty = result3.length,
                existType = [],
                r = 0;
            for(; r < resQty; r++) {
              var elemsQty = result3[r].length;
              if(result3[r] && elemsQty) {
                /** change Images Path and save in device */
                while(--elemsQty > -1) {
                  result3[r][elemsQty].img = downloadElemImg(result3[r][elemsQty].img);
                }
                elements.push(result3[r]);
                existType.push(result3[r][0].folder_id);
              }
            }
            /** delete empty group */
            var existTypeQty = existType.length,
            groupQty = groups.length;
            if(existTypeQty) {
              while(--groupQty > -1) {
                var isExist = 0, t = 0;
                for(; t < existTypeQty; t++) {
                  if(groups[groupQty].id === existType[t]) {
                    isExist = 1;
                  }
                }
                if(!isExist) {
                  groups.splice(groupQty, 1);
                }
              }
            }
            defer.resolve(1);
          });
        } else {
          defer.resolve(0);
        }
      });
      return defer.promise;
    }



    /** change Images Path and save in device */
    function downloadElemImg(urlSource) {
      if(urlSource) {
        /** check image */
        if( /^.*\.(jpg|jpeg|png|gif|tiff)$/i.test(urlSource) ) {
          var url = globalConstants.serverIP + '' + urlSource;
          if (GlobalStor.global.isDevice) {
            var imgName = urlSource.split('/').pop(),
                targetPath = cordova.file.documentsDirectory + '' + imgName,
                trustHosts = true,
                options = {};

            console.log('image name ====', imgName);
            console.log('image path ====', targetPath);
            $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
              console.log('Success!', result);
            }, function (err) {
              console.log('Error!', err);
            }, function (progress) {
//            $timeout(function () {
//              $scope.downloadProgress = (progress.loaded / progress.total) * 100;
//            })
            });
            return targetPath;
          } else {
            return url;
          }
        } else {
          return '';
        }
      }
    }



    function downloadAllGlasses() {
      var defer = $q.defer(),
          profilesQty = GlobalStor.global.profiles.length,
          profileIds = [];
      //----- collect profiles in one array
      while(--profilesQty > -1) {
        var profileQty = GlobalStor.global.profiles[profilesQty].length;
        while(--profileQty > -1) {
          profileIds.push(GlobalStor.global.profiles[profilesQty][profileQty].id);
        }
      }

      //------ create structure of GlobalStor.global.glassesAll
      //------ insert profile Id and glass Types
      var promises2 = profileIds.map(function(item) {
        var defer2 = $q.defer(),
            glassObj = {profileId: item, glassTypes: [], glasses: []};
        localDB.selectLocalDB(localDB.tablesLocalDB.glass_folders.tableName).then(function (types) {
          if(types.length) {
            glassObj.glassTypes = angular.copy(types);
            GlobalStor.global.glassesAll.push(glassObj);
            defer2.resolve(1);
          } else {
            defer2.resolve(0);
          }
        });
        return defer2.promise;
      });

      $q.all(promises2).then(function(data){
        //        console.log('data!!!!', data);
        if(data) {
          //-------- select all glass Ids as to profile Id
          var promises3 = GlobalStor.global.glassesAll.map(function(item) {
            var defer3 = $q.defer();
            localDB.selectLocalDB(localDB.tablesLocalDB.elements_profile_systems.tableName, {'profile_system_id': item.profileId}).then(function (glassId) {
              var glassIdQty = glassId.length;
              if(glassIdQty){
                defer3.resolve(glassId);
              } else {
                defer3.resolve(0);
              }
            });
            return defer3.promise;
          });

          $q.all(promises3).then(function(glassIds) {
            //-------- get glass as to its Id
            var glassIdsQty = glassIds.length,
                promises4 = [], promises6 = [];
//                        console.log('glassIds!!!!', glassIds);
            for(var i = 0; i < glassIdsQty; i++) {
              var defer4 = $q.defer();
              if(glassIds[i]) {
                var promises5 = glassIds[i].map(function (item) {
                  var defer5 = $q.defer();
                  localDB.selectLocalDB(localDB.tablesLocalDB.elements.tableName, {'id': item.element_id}).then(function (result) {
                    //                  console.log('glass!!!!', glass);
                    var glass = angular.copy(result), glassQty = glass.length;
                    if (glassQty) {
                      defer5.resolve(glass[0]);
                    } else {
                      defer5.resolve(0);
                    }
                  });
                  return defer5.promise;
                });
                defer4.resolve($q.all(promises5));
              } else {
                defer4.resolve(0);
              }
              promises4.push(defer4.promise);
            }

            for(var j = 0; j < glassIdsQty; j++) {
              var defer6 = $q.defer();
              console.warn(glassIds[j]);//TODO error
              var promises7 = glassIds[j].map(function(item) {
                var defer7 = $q.defer();
                localDB.selectLocalDB(localDB.tablesLocalDB.lists.tableName, {'parent_element_id': item.element_id}).then(function (result2) {
                  var list = angular.copy(result2),
                      listQty = list.length;
                  if(listQty){
                    defer7.resolve(list[0]);
                  } else {
                    defer7.resolve(0);
                  }
                });
                return defer7.promise;
              });

              defer6.resolve($q.all(promises7));
              promises6.push(defer6.promise);
            }

            $q.all(promises4).then(function(glasses) {
              //              console.log('glasses after 1111!!!!', glasses);
              var glassesQty = glasses.length;
              if(glassesQty) {
                for(var i = 0; i < glassesQty; i++) {
                  GlobalStor.global.glassesAll[i].glasses = glasses[i];
                }
              }
            });
            $q.all(promises6).then(function(lists) {
              //              console.log('glasses after 2222!!!!', lists);
              var listsQty = lists.length;
              if(listsQty) {
                for(var i = 0; i < listsQty; i++) {
                  GlobalStor.global.glassesAll[i].glassLists = lists[i];
                  defer.resolve(1);
                }
              }
            });

          });

        }
      });
      return defer.promise;
    }


    function sortingGlasses() {
      var glassAllQty = GlobalStor.global.glassesAll.length, g = 0;

      for(; g < glassAllQty; g++) {
        //------- merge glassList to glasses
        var listQty = GlobalStor.global.glassesAll[g].glassLists.length,
            glassTypeQty = GlobalStor.global.glassesAll[g].glassTypes.length,
            newGlassesType = [],
            newGlasses = [];
        /** merge glassList to glasses */
        for(var l = 0; l < listQty; l++) {
          if(GlobalStor.global.glassesAll[g].glassLists[l].parent_element_id === GlobalStor.global.glassesAll[g].glasses[l].id) {
            GlobalStor.global.glassesAll[g].glasses[l].elem_id = angular.copy(GlobalStor.global.glassesAll[g].glasses[l].id);
            GlobalStor.global.glassesAll[g].glasses[l].id = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].id);
            GlobalStor.global.glassesAll[g].glasses[l].name = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].name);
            GlobalStor.global.glassesAll[g].glasses[l].cameras = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].cameras);
            GlobalStor.global.glassesAll[g].glasses[l].position = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].position);
            GlobalStor.global.glassesAll[g].glasses[l].img = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].img);
            /** change Images Path and save in device */
            GlobalStor.global.glassesAll[g].glasses[l].img = downloadElemImg(GlobalStor.global.glassesAll[g].glasses[l].img);

            GlobalStor.global.glassesAll[g].glasses[l].link = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].link);
            GlobalStor.global.glassesAll[g].glasses[l].description = angular.copy(GlobalStor.global.glassesAll[g].glassLists[l].description);
          }
        }

        /** sorting glassTypes by position */
        GlobalStor.global.glassesAll[g].glassTypes.sort(function(a, b) {
          return GeneralServ.sorting(a.position, b.position);
        });

        /** sorting glasses by type */
        while(--glassTypeQty > -1) {
          /** change Images Path and save in device */
          GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty].img = downloadElemImg(GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty].img);

          var glassByType = GlobalStor.global.glassesAll[g].glasses.filter(function(elem) {
            return elem.glass_folder_id === GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty].id;
          });
          //          console.log('glassByType!!!!!', glassByType);
          if(glassByType.length) {
            newGlassesType.unshift(GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty]);
            /** sorting glasses by position */
            glassByType.sort(function(a, b) {
              return GeneralServ.sorting(a.position, b.position);
            });
            newGlasses.unshift(glassByType);
          }
        }

        GlobalStor.global.glassesAll[g].glassTypes = angular.copy(newGlassesType);
        GlobalStor.global.glassesAll[g].glasses = angular.copy(newGlasses);
        delete GlobalStor.global.glassesAll[g].glassLists;
      }

    }

    /** download all Templates */
    function downloadAllTemplates() {
//TODO
    }


    /** download all Backgrounds */
    function downloadAllBackgrounds() {
      var deff = $q.defer();
      localDB.selectLocalDB(localDB.tablesLocalDB.background_templates.tableName).then(function(result) {
        var rooms = angular.copy(result),
            roomQty = rooms.length;
        if(roomQty) {
          /** sorting types by position */
          rooms = rooms.sort(function(a, b) {
            return GeneralServ.sorting(a.position, b.position);
          });

          while(--roomQty > -1) {
            rooms[roomQty].img = downloadElemImg(rooms[roomQty].img);
            //---- prerendering img
            $("<img />").attr("src", rooms[roomQty].img);
          }
          GlobalStor.global.rooms = rooms;
        }
        deff.resolve(1);
      });
      return deff.promise;
    }


    /** download all lamination */
    function downloadAllLamination() {
      return localDB.selectLocalDB(localDB.tablesLocalDB.lamination_factory_colors.tableName).then(function(lamin) {
        return lamin;
      });
    }




    function downloadAllAddElements() {
      var defer = $q.defer();
      /** get All kits of addElements */
      getAllAddKits().then(function() {
        /** get All elements of addElements*/
        getAllAddElems().then(function() {
          sortingAllAddElem().then(function() {
            defer.resolve(1);
          });
        })
      });
      return defer.promise;
    }



    function getAllAddKits() {
      var defer = $q.defer(),
          promises = localDB.addElementDBId.map(function(item) {
            return localDB.selectLocalDB(localDB.tablesLocalDB.lists.tableName, {'list_group_id': item});
          });
      $q.all(promises).then(function (result) {
        var addKits = angular.copy(result),
            resultQty = addKits.length;
        for(var i = 0; i < resultQty; i++) {
          var elemGroupObj = {elementType: [], elementsList: addKits[i]};
          GlobalStor.global.addElementsAll.push(elemGroupObj);
        }
        defer.resolve(1);
      });
      return defer.promise;
    }


    function getAllAddElems() {
      var deff = $q.defer(),
          promGroup = GlobalStor.global.addElementsAll.map(function(group) {
            var deff1 = $q.defer();
            if(group.elementsList && group.elementsList.length) {
              var promElems = group.elementsList.map(function(item) {
                var deff2 = $q.defer();

                /** change Images Path and save in device */
                item.img = downloadElemImg(item.img);

                localDB.selectLocalDB(localDB.tablesLocalDB.elements.tableName, {'id': item.parent_element_id}).then(function(result) {
                  if(result && result.length) {
                    GlobalStor.global.tempAddElements.push(angular.copy(result[0]));
                    deff2.resolve(1);
                  } else {
                    deff2.resolve(0);
                  }
                });
                return deff2.promise;
              });
              deff1.resolve($q.all(promElems));
            } else {
              deff1.resolve(0);
            }
            return deff1.promise;
          });
      deff.resolve($q.all(promGroup));
      return deff.promise;
    }


    function sortingAllAddElem() {
      var deff = $q.defer();
      localDB.selectLocalDB(localDB.tablesLocalDB.addition_folders.tableName).then(function(groups) {

        var elemAllQty = GlobalStor.global.addElementsAll.length,
            defaultGroup = {
              id: 0,
              name: $filter('translate')('add_elements.OTHERS')
            };

        /** sorting types by position */
        if(groups && groups.length) {
          groups = groups.sort(function (a, b) {
            return GeneralServ.sorting(a.position, b.position);
          });
        }
        //console.info('AddElems sorting====', GlobalStor.global.addElementsAll);
        while(--elemAllQty > -1) {
          if(GlobalStor.global.addElementsAll[elemAllQty].elementsList) {
            if(groups && groups.length) {
              GlobalStor.global.addElementsAll[elemAllQty].elementType = angular.copy(groups);
            }
            GlobalStor.global.addElementsAll[elemAllQty].elementType.push(defaultGroup);
            //------- sorting
            var newElemList = [],
                typeDelete = [],
                typeQty = GlobalStor.global.addElementsAll[elemAllQty].elementType.length,
                elemQty = GlobalStor.global.addElementsAll[elemAllQty].elementsList.length,
                tempElemQty = GlobalStor.global.tempAddElements.length;
            for(var t = 0; t < typeQty; t++) {
              var elements = [];
              for(var el = 0; el < elemQty; el++) {
                if(GlobalStor.global.addElementsAll[elemAllQty].elementType[t].id === GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].addition_folder_id) {
                  var widthTemp = 0,
                      heightTemp = 0;
                  switch(GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].list_group_id){
                    case 21: // 1 - visors
                    case 9: // 2 - spillways
                    case 8: // 8 - windowSill
                    case 19: // 3 - outSlope & inSlope
                    case 12: // 6 - connectors
                      widthTemp = 1000;
                      break;
                    case 20: // 0 - grids
                    case 26: // 4 - louvers
                      widthTemp = 1000;
                      heightTemp = 1000;
                      break;
                  }
                  GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].element_width = widthTemp;
                  GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].element_height = heightTemp;
                  GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].element_qty = 1;
                  /** get price of element */
                  for(var k = 0; k < tempElemQty; k++) {
                    if(GlobalStor.global.tempAddElements[k].id === GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].parent_element_id) {
                      /** add price margin */
                      GlobalStor.global.tempAddElements[k].price = GeneralServ.addMarginToPrice(angular.copy(GlobalStor.global.tempAddElements[k].price), GlobalStor.global.margins.margin);
                      /** currency conversion */
                      GlobalStor.global.addElementsAll[elemAllQty].elementsList[el].element_price = localDB.currencyExgange(GlobalStor.global.tempAddElements[k].price, GlobalStor.global.tempAddElements[k].currency_id);
                    }
                  }
                  elements.push(angular.copy(GlobalStor.global.addElementsAll[elemAllQty].elementsList[el]));
                }
              }
              if(elements.length) {
                ///** sorting elements by position */
                //elements = elements.sort(function(a, b) {
                //  return GeneralServ.sorting(a.position, b.position);
                //});
                /** sorting by name */
                elements = $filter('orderBy')(elements, 'name');

                newElemList.push(elements);
              } else {
                typeDelete.push(t);
              }
            }

            if(newElemList.length) {
              GlobalStor.global.addElementsAll[elemAllQty].elementsList = angular.copy(newElemList);
            } else {
              GlobalStor.global.addElementsAll[elemAllQty].elementsList = 0;
            }

            /** delete empty groups */
            var delQty = typeDelete.length;
            if(delQty) {
              while(--delQty > -1) {
                GlobalStor.global.addElementsAll[elemAllQty].elementType.splice(typeDelete[delQty], 1);
              }
            }
          }
          //console.log('addElementsAll________________', GlobalStor.global.addElementsAll);
        }
        deff.resolve(1);
      });
      return deff.promise;
    }




    function downloadCartMenuData() {
      /** download Supply Data */
      localDB.selectLocalDB(localDB.tablesLocalDB.users_deliveries.tableName).then(function(supply) {
        if (supply.length) {
          GlobalStor.global.supplyData = angular.copy(supply);
          //console.warn('supplyData=', GlobalStor.global.supplyData);
        }
      });
      /** download Mounting Data */
      localDB.selectLocalDB(localDB.tablesLocalDB.users_mountings.tableName).then(function(mounting) {
        if (mounting.length) {
          GlobalStor.global.assemblingData = angular.copy(mounting);
          //console.warn('assemblingData=', GlobalStor.global.assemblingData);
        }
      });
      /** download Instalment Data */
      optionsServ.getInstalment(function (results) {
        if (results.status) {
          GlobalStor.global.instalmentsData = results.data.instalment;
        } else {
          console.log(results);
        }
      });
    }





  }
})();
