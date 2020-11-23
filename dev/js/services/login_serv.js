(function () {
  "use strict";
  /**@ngInject*/
  angular.module("LoginModule").factory(
    "loginServ",

    function (
      $q,
      $cordovaFileTransfer,
      $translate,
      $filter,
      localDB,
      globalConstants,
      GeneralServ,
      optionsServ,
      GlobalStor,
      ProductStor,
      OrderStor,
      AuxStor,
      UserStor,
      DesignStor,
      HistoryStor
    ) {
      /*jshint validthis:true */
      var thisFactory = this;

      /**============ METHODS ================*/

      //------ compare device language with existing dictionary, if not exist set default language = English
      function checkLangDictionary(lang) {
        var langQty = globalConstants.languages.length;
        while (--langQty > -1) {
          if (globalConstants.languages[langQty].label.indexOf(lang) + 1) {
            UserStor.userInfo.langLabel =
              globalConstants.languages[langQty].label;
            UserStor.userInfo.langName =
              globalConstants.languages[langQty].name;
            break;
          }
        }
      }

      // $(window).load(function () {
      //   document.addEventListener("deviceready", function () {
      //     getDeviceLanguage();
      //   }, function () {
      //     getDeviceLanguage();
      //   });
      // });

      //------- defined system language
      function getDeviceLanguage() {
        var browserLang = navigator.language || navigator.userLanguage;
        checkLangDictionary(browserLang);
        $translate.use(UserStor.userInfo.langLabel);
      }

      // function initExport() {
      //   var defer = $q.defer();
      //   //console.log('EXPORT');
      //   //------- check Export Table
      //   localDB.selectLocalDB(localDB.tablesLocalDB.export.tableName).then(function (data) {
      //     //        console.log('data ===', data);
      //     if (data.length) {
      //       //----- get last user
      //       localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName).then(function (user) {
      //         if (user.length) {
      //           localDB.updateServer(user[0].phone, user[0].device_code, data).then(function (result) {
      //             //console.log('FINISH export',result);
      //             //----- if update Server is success, clean Export in LocalDB
      //             if (result) {
      //               localDB.cleanLocalDB({
      //                 export: 1
      //               });
      //               defer.resolve(1);
      //             }
      //           });
      //         }
      //       });
      //     }
      //   });
      //   return defer.promise;
      // }

      function isLocalDBExist() {
        var defer = $q.defer();
        //      localDB.selectLocalDB(localDB.tablesLocalDB.users.tableName).then(function(data) {
        // localDB.selectLocalDB('sqlite_sequence').then(function (data) {
        //     //        console.log('data ===', data);
        //     if (data && data.length > 5) {
        //         defer.resolve(1);
        //     } else {
        //         defer.resolve(0);
        //     }
        // });
        return defer.promise;
      }

      function downloadAllCities() {
        var deff = $q.defer(),
          countryQty,
          regionQty,
          cityQty,
          areasQty;
        localDB.getSavedLocation().then(function (location) {
          if (location) {
            cityQty = location.cities.length;
            GlobalStor.global.locations.cities = angular.copy(location.cities);
            if (cityQty) {
              while (--cityQty > -1) {
                regionQty = GlobalStor.global.locations.regions.length;
                areasQty = GlobalStor.global.locations.areas.length;
                while (--areasQty > -1) {
                  if (
                    GlobalStor.global.locations.cities[cityQty].area_id ===
                    GlobalStor.global.locations.areas[areasQty].id
                  ) {
                    if (GlobalStor.global.locations.areas[areasQty].name) {
                      GlobalStor.global.locations.cities[cityQty].areasName =
                        GlobalStor.global.locations.areas[areasQty].name;
                    }
                  }
                }
                while (--regionQty > -1) {
                  if (
                    GlobalStor.global.locations.cities[cityQty].region_id ===
                    GlobalStor.global.locations.regions[regionQty].id
                  ) {
                    if (GlobalStor.global.locations.cities[cityQty].areasName) {
                      GlobalStor.global.locations.cities[cityQty].fullLocation =
                        "" +
                        GlobalStor.global.locations.cities[cityQty].name +
                        ", " +
                        GlobalStor.global.locations.cities[cityQty].areasName +
                        ", " +
                        GlobalStor.global.locations.regions[regionQty].name;
                    } else {
                      GlobalStor.global.locations.cities[cityQty].fullLocation =
                        "" +
                        GlobalStor.global.locations.cities[cityQty].name +
                        ", " +
                        GlobalStor.global.locations.regions[regionQty].name;
                    }
                    GlobalStor.global.locations.cities[cityQty].climatic_zone =
                      GlobalStor.global.locations.regions[
                        regionQty
                      ].climatic_zone;
                    GlobalStor.global.locations.cities[cityQty].heat_transfer =
                      GlobalStor.global.locations.regions[
                        regionQty
                      ].heat_transfer;
                    countryQty = location.countries.length;
                    while (--countryQty > -1) {
                      if (
                        location.regions[regionQty].country_id ===
                        GlobalStor.global.locations.countries[countryQty].id
                      ) {
                        GlobalStor.global.locations.cities[cityQty].country_id =
                          GlobalStor.global.locations.countries[countryQty].id;
                        GlobalStor.global.locations.cities[cityQty].currencyId =
                          GlobalStor.global.locations.countries[
                            countryQty
                          ].currency_id;
                      }
                    }
                  }
                }
              }
              // console.info('generalLocations', GlobalStor.global.locations);
              //console.info('finish time+++', new Date(), new Date().getMilliseconds());
              deff.resolve(1);
            } else {
              deff.resolve(0);
            }
          } else {
            deff.resolve(0);
          }
        });

        return deff.promise;
      }

      /**--------- set user location -------*/
      function setUserLocation() {
        var cityQty = GlobalStor.global.locations.cities.length;
        var regionQty = GlobalStor.global.locations.regions.length;
        while (--cityQty > -1) {
          if (
            GlobalStor.global.locations.cities[cityQty].id ===
            UserStor.userInfo.city_id
          ) {
            UserStor.userInfo.cityName =
              GlobalStor.global.locations.cities[cityQty].name;
            UserStor.userInfo.country_id =
              GlobalStor.global.locations.cities[cityQty].country_id;
            UserStor.userInfo.climatic_zone =
              GlobalStor.global.locations.cities[cityQty].climatic_zone;
            UserStor.userInfo.heat_transfer = +GlobalStor.global.locations
              .cities[cityQty].heat_transfer;
            UserStor.userInfo.fullLocation =
              GlobalStor.global.locations.cities[cityQty].fullLocation;
            while (--regionQty > -1) {
              if (
                GlobalStor.global.locations.cities[cityQty].region_id ===
                GlobalStor.global.locations.regions[regionQty].id
              ) {
                GlobalStor.global.regionCoefs =
                  GlobalStor.global.locations.regions[regionQty].id;
              }
            }
          }
        }
      }

      //------- collecting cities, regions and countries in one object for registration form
      function prepareLocationToUse(locations) {
        var deferred = $q.defer();
        GlobalStor.global.locations.countries = angular.copy(
          locations.countries
        );
        GlobalStor.global.locations.regions = angular.copy(locations.regions);
        GlobalStor.global.locations.areas = angular.copy(locations.areas);
        // GlobalStor.global.locations.cities = angular.copy(locations.cities);
        downloadAllCities().then(function () {
          deferred.resolve(1);
        });
        return deferred.promise;
      }

      function collectCityIdsAsCountry() {
        var defer = $q.defer(),
          cityIds = _.map(GlobalStor.global.locations.cities, function (item) {
            if (item.country_id === UserStor.userInfo.country_id) {
              return item.cityId;
            }
          });
      }

      /**--------- set user location -------*/

      /**--------- set current user geolocation ---------*/
      function setUserGeoLocation(
        cityId,
        cityName,
        climatic,
        heat,
        fullLocation
      ) {
        OrderStor.order.customer_city_id = cityId;
        OrderStor.order.customer_city = cityName;
        OrderStor.order.climatic_zone = climatic;
        OrderStor.order.heat_coef_min = heat;
        OrderStor.order.customer_location = fullLocation;
      }

      /**-------- get values from Factory --------*/
      function downloadFactoryData() {
        localDB
          .selectLocalDB(
            localDB.tablesLocalDB.factories.tableName,
            null,
            "therm_coeff_id, link, max_construct_size, max_construct_square"
          )
          .then(function (result) {
            var heat_transfer = UserStor.userInfo.heat_transfer,
              resQty;
            if (result) {
              resQty = result.length;
              if (resQty) {
                //------- Heat Coeff
                UserStor.userInfo.therm_coeff_id = angular.copy(
                  result[0].therm_coeff_id
                );
                if (UserStor.userInfo.therm_coeff_id) {
                  UserStor.userInfo.heat_transfer = GeneralServ.roundingValue(
                    1 / heat_transfer
                  );
                }
                //-------- check factory Link
                if (result[0].link !== "null") {
                  UserStor.userInfo.factoryLink = angular.copy(result[0].link);
                }
                //-------- sizes limits
                if (+result[0].max_construct_square > 0) {
                  GlobalStor.global.maxSquareLimit = angular.copy(
                    +result[0].max_construct_square
                  );
                }
                if (+result[0].max_construct_size > 0) {
                  GlobalStor.global.maxSizeLimit = angular.copy(
                    +result[0].max_construct_size
                  );
                }
              }
            }
            console.log(GlobalStor.global, 'глобалстор')
            /** set current GeoLocation */
            if (GlobalStor.global.location === []) {
              prepareLocationToUse();
            }
            setUserGeoLocation(
              UserStor.userInfo.city_id,
              UserStor.userInfo.cityName,
              UserStor.userInfo.climatic_zone,
              UserStor.userInfo.heat_transfer,
              UserStor.userInfo.fullLocation
            );

          });
      }

      function setCurrency() {
        var defer = $q.defer();
        /** download All Currencies */
        localDB
          .selectLocalDB(
            localDB.tablesLocalDB.currencies.tableName,
            null,
            "id, is_base, name, value"
          )
          .then(function (currencies) {
            var currencQty = currencies.length;
            if (currencies && currencQty) {
              GlobalStor.global.currencies = currencies;
              /** set current currency */
              while (--currencQty > -1) {
                if (currencies[currencQty].is_base === 1) {
                  UserStor.userInfo.currencyId = currencies[currencQty].id;
                  if (/uah/i.test(currencies[currencQty].name)) {
                    UserStor.userInfo.currency = "\u20b4"; //'₴';
                  } else if (/rub/i.test(currencies[currencQty].name)) {
                    UserStor.userInfo.currency = "\ue906"; // '\u20BD';//'₽';
                  } else if (/(usd|\$)/i.test(currencies[currencQty].name)) {
                    UserStor.userInfo.currency = "$";
                  } else if (/eur/i.test(currencies[currencQty].name)) {
                    UserStor.userInfo.currency = "\u20AC"; //'€';
                  } else if (/kzt/i.test(currencies[currencQty].name)) {
                    UserStor.userInfo.currency = "\u20B8"; //'TENGE';
                  } else {
                    UserStor.userInfo.currency = "\xA4"; //Generic Currency Symbol
                  }
                }
              }
              defer.resolve(1);
            } else {
              console.error("not find currencies!");
              defer.resolve(0);
            }
          });
        return defer.promise;
      }

      function setUserDiscounts() {
        var defer = $q.defer();
        //-------- add server url to avatar img
        // var url = globalConstants.serverIP + UserStor.userInfo.avatar
        // UserStor.userInfo.avatar = url;
        if (GlobalStor.global.onlineMode && navigator.onLine) {
          var url = globalConstants.serverIP + UserStor.userInfo.avatar;
          UserStor.userInfo.avatar = url;
          //#setBase64Avatar(url, function (base64Img) {
          //#});
        } else {
          localforage.getItem("userAvatar", function (err, value) {
            UserStor.userInfo.avatar = value;
          });
        }
        //USER AVATAR
        //console.log("UserStor.userInfo.avatar",UserStor.userInfo.avatar);

        localDB
          .selectLocalDB(localDB.tablesLocalDB.users_discounts.tableName)
          .then(function (result) {
            //    console.log('DISCTOUN=====', result);
            var discounts = angular.copy(result[0]);
            if (discounts) {
              UserStor.userInfo.discountConstr = +discounts.default_construct;
              UserStor.userInfo.discountAddElem = +discounts.default_add_elem;
              UserStor.userInfo.discountConstrMax = +discounts.max_construct;
              UserStor.userInfo.discountAddElemMax = +discounts.max_add_elem;

              var disKeys = Object.keys(discounts),
                disQty = disKeys.length,
                dis;
              for (dis = 0; dis < disQty; dis += 1) {
                if (disKeys[dis].indexOf("week") + 1) {
                  if (disKeys[dis].indexOf("construct") + 1) {
                    UserStor.userInfo.discConstrByWeek.push(
                      +discounts[disKeys[dis]]
                    );
                  } else if (disKeys[dis].indexOf("add_elem") + 1) {
                    UserStor.userInfo.discAddElemByWeek.push(
                      +discounts[disKeys[dis]]
                    );
                  }
                }
              }
              defer.resolve(1);
            } else {
              console.error("not find users_discounts!");
              defer.resolve(0);
            }
          });
        return defer.promise;
      }

      /** price Margins of Plant */
      function downloadPriceMargin() {
        return localDB
          .selectLocalDB(
            localDB.tablesLocalDB.options_coefficients.tableName,
            null,
            "margin, coeff"
          )
          .then(function (margins) {
            return margins;
          });
      }

      function downloadOptionsCoefficients() {
        return localDB
          .selectLocalDB(
            localDB.tablesLocalDB.options_coefficients.tableName,
            null,
            "area_price, area_currencies,perimeter_price,perimeter_currencies,piece_price,piece_currencies"
          )
          .then(function (coeffs) {
            return coeffs;
          });
      }

      /** delivery Coeff of Plant */
      function downloadDeliveryCoeff() {
        return localDB
          .selectLocalDB(localDB.tablesLocalDB.options_discounts.tableName)
          .then(function (coeff) {
            return coeff;
          });
      }

      //----------- get all elements as to groups

      function downloadAllElemAsGroup(tableGroup, tableElem, groups, elements) {
        var defer = $q.defer();
        //------- get all Folders
        localDB.selectLocalDB(tableGroup).then(function (result) {
          /** sorting types by position */
          var types = angular.copy(result).sort(function (a, b) {
            return GeneralServ.sorting(a.position, b.position);
          }),
            typesQty = types.length;
          if (typesQty) {
            groups.length = 0;
            angular.extend(groups, types);
            var promises = _.map(types, function (type) {
              var defer2 = $q.defer();

              /** change Images Path and save in device */
              // type.img = downloadElemImg(type.img);

              localDB
                .selectLocalDB(tableElem, {
                  folder_id: type.id
                })
                .then(function (result2) {
                  if (result2.length) {
                    var elem = angular.copy(result2).sort(function (a, b) {
                      return GeneralServ.sorting(a.position, b.position);
                    });
                    defer2.resolve(elem);
                  } else {
                    defer2.resolve(0);
                  }
                });
              return defer2.promise;
            });

            $q.all(promises).then(function (result3) {
              var resQty = result3.length,
                existType = [],
                r;
              for (r = 0; r < resQty; r += 1) {
                var elemsQty = result3[r].length;
                if (result3[r] && elemsQty) {
                  /** change Images Path and save in device */
                  // console.log(result3);
                  // while (--elemsQty > -1) {
                  //   result3[r][elemsQty].img = downloadElemImg(result3[r][elemsQty].img);
                  // }
                  elements.push(result3[r]);
                  existType.push(result3[r][0].folder_id);
                }
              }
              /** delete empty group */
              var existTypeQty = existType.length,
                groupQty = groups.length;
              if (existTypeQty) {
                while (--groupQty > -1) {
                  var isExist = 0,
                    t;
                  for (t = 0; t < existTypeQty; t += 1) {
                    if (groups[groupQty].id === existType[t]) {
                      isExist = 1;
                    }
                  }
                  if (!isExist) {
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

      function downloadAllGlasses() {
        var defer = $q.defer(),
          profilesQty = GlobalStor.global.profiles.length,
          profileIds = [];
        //----- collect profiles in one array
        while (--profilesQty > -1) {
          var profileQty = GlobalStor.global.profiles[profilesQty].length;
          while (--profileQty > -1) {
            profileIds.push(
              GlobalStor.global.profiles[profilesQty][profileQty].id
            );
          }
        }
        localDB
          .selectLocalDB(localDB.tablesLocalDB.lists.tableName, {
            list_type_id: 2
          })
          .then(function (sill) {
            // console.log("downloadAllGlasses start", sill);
            GlobalStor.global.allDoorSills = angular.copy(sill);
          });

        //------ create structure of GlobalStor.global.glassesAll
        //------ insert profile Id and glass Types
        var promises2 = _.map(profileIds, function (item) {
          var defer2 = $q.defer(),
            glassObj = {
              profileId: item,
              glassTypes: [],
              glasses: []
            };
          localDB
            .selectLocalDB(localDB.tablesLocalDB.glass_folders.tableName)
            .then(function (types) {
              if (types.length) {
                glassObj.glassTypes = angular.copy(types);
                GlobalStor.global.glassesAll.push(glassObj);
                defer2.resolve(1);
              } else {
                defer2.resolve(0);
              }
            });
          return defer2.promise;
        });

        $q.all(promises2).then(function (data) {
          //        console.log('data!!!!', data);
          if (data) {
            //-------- select all glass Ids as to profile Id
            var promises3 = _.map(GlobalStor.global.glassesAll, function (item) {
              var defer3 = $q.defer();
              localDB
                .selectLocalDB(
                  localDB.tablesLocalDB.elements_profile_systems.tableName,
                  {
                    profile_system_id: item.profileId
                  },
                  "element_id"
                )
                .then(function (glassId) {
                  //console.warn('glass+++', glassId);
                  var glassIdQty = glassId.length;
                  if (glassIdQty) {
                    defer3.resolve(glassId);
                  } else {
                    defer3.resolve(0);
                  }
                });
              return defer3.promise;
            });

            $q.all(promises3).then(function (glassIds) {
              //-------- get glass as to its Id
              var glassIdsQty = glassIds.length,
                promises6 = [],
                i,
                j;
              //console.log('glassIds!!!!', glassIds);

              /** find Glass Kits */
              for (j = 0; j < glassIdsQty; j += 1) {
                var defer6 = $q.defer();
                //console.warn(glassIds[j]);//TODO error
                var promises7 = _.map(glassIds[j], function (item) {
                  var defer7 = $q.defer();
                  localDB
                    .selectLocalDB(
                      localDB.tablesLocalDB.lists.tableName,
                      {
                        parent_element_id: item.element_id,
                        list_group_id: 6
                      },
                      "id, name, parent_element_id, cameras, list_group_id, list_type_id, position, description, " +
                      "img, link, glass_image, glass_type, glass_color"
                    )
                    .then(function (result2) {
                      // console.log('list +++++', result2);
                      var list = angular.copy(result2),
                        listQty = list.length;
                      if (listQty) {
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

              $q.all(promises6).then(function (lists) {
                //console.log('glasses after 2222!!!!', lists);
                var listsQty = lists.length,
                  promises4 = [];

                if (listsQty) {
                  for (i = 0; i < listsQty; i += 1) {
                    var defer4 = $q.defer();
                    GlobalStor.global.glassesAll[i].glassLists = lists[
                      i
                    ].filter(function (item) {
                      return item;
                    });

                    /** find Glass Elements */
                    var promises5 = _.map(
                      GlobalStor.global.glassesAll[i].glassLists,
                      function (item) {
                        var defer5 = $q.defer();
                        localDB
                          .selectLocalDB(
                            localDB.tablesLocalDB.elements.tableName,
                            {
                              id: item.parent_element_id
                            },
                            "id, name, sku, glass_folder_id, glass_width, heat_coeff, noise_coeff, transcalency, " +
                            "max_width, min_width, max_height, min_height, max_sq, reg_coeff"
                          )
                          .then(function (result) {
                            //console.log('glass!!!!', result);
                            var glass = angular.copy(result),
                              glassQty = glass.length;
                            if (glassQty) {
                              defer5.resolve(glass[0]);
                            } else {
                              defer5.resolve(0);
                            }
                          });
                        return defer5.promise;
                      }
                    );
                    defer4.resolve($q.all(promises5));
                    promises4.push(defer4.promise);
                  }

                  $q.all(promises4).then(function (glasses) {
                    //console.log('glasses after 1111!!!!', glasses);
                    var glassesQty = glasses.length;
                    if (glassesQty) {
                      for (i = 0; i < glassesQty; i += 1) {
                        GlobalStor.global.glassesAll[i].glasses = glasses[i];
                      }
                    }
                    //console.log('FINISH!!!!', GlobalStor.global.glassesAll);
                    defer.resolve(1);
                  });
                }
              });
            });
          }
        });
        return defer.promise;
      }

      function sortingGlasses() {
        var glassAllQty = GlobalStor.global.glassesAll.length,
          g;
        for (g = 0; g < glassAllQty; g += 1) {
          //------- merge glassList to glasses
          var listQty = GlobalStor.global.glassesAll[g].glassLists.length,
            glassTypeQty = GlobalStor.global.glassesAll[g].glassTypes.length,
            newGlassesType = [],
            newGlasses = [],
            l;
          /** merge glassList to glasses */
          for (l = 0; l < listQty; l += 1) {
            if (
              GlobalStor.global.glassesAll[g].glassLists[l]
                .parent_element_id ===
              GlobalStor.global.glassesAll[g].glasses[l].id
            ) {
              GlobalStor.global.glassesAll[g].glasses[l].elem_id = angular.copy(
                GlobalStor.global.glassesAll[g].glasses[l].id
              );
              GlobalStor.global.glassesAll[g].glasses[l].id = angular.copy(
                GlobalStor.global.glassesAll[g].glassLists[l].id
              );
              GlobalStor.global.glassesAll[g].glasses[l].name = angular.copy(
                GlobalStor.global.glassesAll[g].glassLists[l].name
              );
              GlobalStor.global.glassesAll[g].glasses[l].cameras = angular.copy(
                GlobalStor.global.glassesAll[g].glassLists[l].cameras
              );
              GlobalStor.global.glassesAll[g].glasses[
                l
              ].glass_type = angular.copy(
                GlobalStor.global.glassesAll[g].glassLists[l].glass_type
              );
              GlobalStor.global.glassesAll[g].glasses[
                l
              ].glass_color = angular.copy(
                GlobalStor.global.glassesAll[g].glassLists[l].glass_color
              );
              GlobalStor.global.glassesAll[g].glasses[
                l
              ].position = angular.copy(
                GlobalStor.global.glassesAll[g].glassLists[l].position
              );
              GlobalStor.global.glassesAll[g].glasses[l].img = angular.copy(
                GlobalStor.global.glassesAll[g].glassLists[l].img
              );
              /** change Images Path and save in device */
              // GlobalStor.global.glassesAll[g].glasses[l].img = downloadElemImg(GlobalStor.global.glassesAll[g].glasses[l].img);

              GlobalStor.global.glassesAll[g].glasses[l].link = angular.copy(
                GlobalStor.global.glassesAll[g].glassLists[l].link
              );
              GlobalStor.global.glassesAll[g].glasses[
                l
              ].description = angular.copy(
                GlobalStor.global.glassesAll[g].glassLists[l].description
              );
              GlobalStor.global.glassesAll[g].glasses[
                l
              ].glass_image = angular.copy(
                GlobalStor.global.glassesAll[g].glassLists[l].glass_image
              );
            }
          }

          /** sorting glassTypes by position */
          GlobalStor.global.glassesAll[g].glassTypes.sort(function (a, b) {
            return GeneralServ.sorting(a.position, b.position);
          });

          /** sorting glasses by type */
          while (--glassTypeQty > -1) {
            /** change Images Path and save in device */
            // GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty].img = downloadElemImg(
            //   GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty].img
            // );

            var glassByType = GlobalStor.global.glassesAll[g].glasses.filter(
              function (elem) {
                return (
                  elem.glass_folder_id ===
                  GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty].id
                );
              }
            );
            //          console.log('glassByType!!!!!', glassByType);
            if (glassByType.length) {
              newGlassesType.unshift(
                GlobalStor.global.glassesAll[g].glassTypes[glassTypeQty]
              );
              /** sorting glasses by position */
              glassByType.sort(function (a, b) {
                return GeneralServ.sorting(a.position, b.position);
              });
              newGlasses.unshift(glassByType);
            }
          }

          GlobalStor.global.glassesAll[g].glassTypes = angular.copy(
            newGlassesType
          );
          GlobalStor.global.glassesAll[g].glasses = angular.copy(newGlasses);
          delete GlobalStor.global.glassesAll[g].glassLists;
        }
      }

      /**---------- download Hardware Limits --------*/

      function downloadHardwareLimits() {
        localDB
          .selectLocalDB(
            localDB.tablesLocalDB.window_hardware_type_ranges.tableName,
            null,
            "type_id, min_width, max_width, min_height, max_height, group_id"
          )
          .then(function (result) {
            if (result && result.length) {
              GlobalStor.global.hardwareLimits = angular.copy(result);
            }
          });
      }

      //TODO
      /** download all Templates */
      //function downloadAllTemplates() {
      //
      //}

      /** change Images Path and save in device */
      function downloadElemImg(urlSource) {
        if (urlSource) {
          /** check image */
          if (/^.*\.(jpg|jpeg|png|gif|tiff)$/i.test(urlSource)) {
            // var url = globalConstants.serverIP + '' + urlSource;
            if (GlobalStor.global.isDevice) {
              var imgName = urlSource.split("/").pop(),
                //targetPath = cordova.file.documentsDirectory + '' + imgName,
                targetPath = cordova.file.dataDirectory + "" + imgName,
                trustHosts = true,
                options = {};

              //console.log('image name ====', imgName);
              //console.log('image path ====', targetPath);
              $cordovaFileTransfer
                .download(url, targetPath, options, trustHosts)
                .then(
                  function (result) {
                    console.log("Success!", result);
                  },
                  function (err) {
                    console.log("Error!", err);
                  },
                  function (progress) {
                    //console.log('progress!', progress);
                  }
                );
              return targetPath;
            } else {
              return url;
            }
            return url;
          } else {
            return "";
          }
        }
      }

      /** download all Backgrounds */
      function downloadAllBackgrounds() {
        var deff = $q.defer();
        localDB
          .selectLocalDB(localDB.tablesLocalDB.background_templates.tableName)
          .then(function (result) {
            var rooms = angular.copy(result),
              roomQty = rooms.length;
            if (roomQty) {
              /** sorting types by position */
              rooms = rooms.sort(function (a, b) {
                return GeneralServ.sorting(a.position, b.position);
              });
              //download images for rooms

              // while (--roomQty > -1) {
              //   rooms[roomQty].img = downloadElemImg(rooms[roomQty].img);
              //   //rooms[roomQty].img = globalConstants.serverIP + rooms[roomQty].img;
              //   //---- prerendering img
              //   $("<img />").attr("src", rooms[roomQty].img);
              // }
              rooms.forEach(function (entry) {
                entry.img = globalConstants.serverIP + entry.img;
              });
              //console.info('login++++', rooms);
              GlobalStor.global.rooms = rooms;
            }
            deff.resolve(1);
          });
        return deff.promise;
      }
      // Download all languages
      function downloadAllLanguages() {
        return localDB
          .selectLocalDB(
            localDB.tablesLocalDB.locales_names.tableName,
            null, 
            "id, table_name, table_id, ru, en, ua, de, ro, it, pl, bg, table_attr"          
          )
          .then(function (result) {
            if (result && result.length) {
              GlobalStor.global.locales_names = angular.copy(result)
            }
          })
        }
      /** download all lamination */
      function downloadAllLamination() {
        return localDB
          .selectLocalDB(
            localDB.tablesLocalDB.lamination_factory_colors.tableName,
            null,
            "id, name, lamination_type_id"
          )
          .then(function (lamin) {
            return lamin;
          });
       }

      /** download lamination couples */
      function downloadLamCouples() {
        var deff = $q.defer();
        localDB
          .selectLocalDB(localDB.tablesLocalDB.profile_laminations.tableName)
          .then(function (lamins) {
            if (lamins) {
              GlobalStor.global.laminatCouples = angular.copy(lamins);
              /** add lamination names */
              var coupleQty = GlobalStor.global.laminatCouples.length,
                laminatQty = GlobalStor.global.laminats.length,
                lam;
              while (--coupleQty > -1) {
                delete GlobalStor.global.laminatCouples[coupleQty].code_sync;
                delete GlobalStor.global.laminatCouples[coupleQty].modified;
                for (lam = 0; lam < laminatQty; lam += 1) {
                  if (
                    GlobalStor.global.laminats[lam].id ===
                    GlobalStor.global.laminatCouples[coupleQty].lamination_in_id
                  ) {
                    GlobalStor.global.laminatCouples[
                      coupleQty
                    ].laminat_in_name =
                      GlobalStor.global.laminats[lam].name;
                    GlobalStor.global.laminatCouples[coupleQty].img_in_id =
                      GlobalStor.global.laminats[lam].lamination_type_id;
                  }
                  if (
                    GlobalStor.global.laminats[lam].id ===
                    GlobalStor.global.laminatCouples[coupleQty]
                      .lamination_out_id
                  ) {
                    GlobalStor.global.laminatCouples[
                      coupleQty
                    ].laminat_out_name =
                      GlobalStor.global.laminats[lam].name;
                    GlobalStor.global.laminatCouples[coupleQty].img_out_id =
                      GlobalStor.global.laminats[lam].lamination_type_id;
                  }
                }
              }
              deff.resolve(1);
            } else {
              deff.resolve(1);
            }
          });
        return deff.promise;
      }

      function getAllAddKits() {
        var defer = $q.defer(),
          promises = _.map(GeneralServ.addElementDATA, function (item, index) {
            if (index) {
              return localDB.selectLocalDB(
                localDB.tablesLocalDB.lists.tableName,
                {
                  list_group_id: item.id
                }
              );
            } else {
              //-------- Grids
              return localDB.selectLocalDB(
                localDB.tablesLocalDB.mosquitos.tableName
              );
            }
          });
        $q.all(promises).then(function (result) {
          if (result[18]) {
            if (Array.isArray(result[6])) {
              result[6] = result[6].concat(result[18]);
            } else {
              result[6] = result[18];
            }
          }
          var addKits = angular.copy(result),
            resultQty = addKits.length,
            i,
            elemGroupObj;
          for (i = 0; i < resultQty; i += 1) {
            elemGroupObj = {
              elementType: [],
              elementsList: 0
            };
            if (!i && addKits[i].length) {
              //------ for Grids
              elemGroupObj.elementType.push({
                addition_type_id: 20,
                name: ""
              });
              elemGroupObj.elementsList = [addKits[i]];
            } else {
              elemGroupObj.elementsList = addKits[i];
            }
            GlobalStor.global.addElementsAll.push(elemGroupObj);
          }

          localDB
            .selectLocalDB(localDB.tablesLocalDB.mosquitos_singles.tableName)
            .then(function (gridData) {
              var gridsSingl = angular.copy(gridData),
                gridsQty = gridsSingl.length;
              if (gridsQty) {
                while (--gridsQty > -1) {
                  gridsSingl[gridsQty]["profile_id"] = 0;
                  delete gridsSingl[gridsQty].factory_id;
                }
                if (GlobalStor.global.addElementsAll[0].elementsList) {
                  if (
                    angular.isArray(
                      GlobalStor.global.addElementsAll[0].elementsList
                    )
                  ) {
                    GlobalStor.global.addElementsAll[0].elementsList[0] = GlobalStor.global.addElementsAll[0].elementsList[0].concat(
                      gridsSingl
                    );
                  }
                } else {
                  GlobalStor.global.addElementsAll[0].elementType.push({
                    addition_type_id: 20,
                    name: ""
                  });
                  GlobalStor.global.addElementsAll[0].elementsList = [
                    gridsSingl
                  ];
                }
              }
              defer.resolve(1);
            });
        });
        return defer.promise;
      }

      function getAllAddElems() {
        var deff = $q.defer(),
          promGroup = _.map(GlobalStor.global.addElementsAll, function (
            group,
            index
          ) {
            var deff1 = $q.defer();
            //------- without Grids
            if (index && group.elementsList && group.elementsList.length) {
              var promElems = _.map(group.elementsList, function (item) {
                var deff2 = $q.defer();

                /** change Images Path and save in device */
                // item.img = downloadElemImg(item.img);

                localDB
                  .selectLocalDB(localDB.tablesLocalDB.elements.tableName, {
                    id: item.parent_element_id
                  })
                  .then(function (result) {
                    if (result && result.length) {
                      GlobalStor.global.tempAddElements.push(
                        angular.copy(result[0])
                      );
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

      function getGridPrice(grids) {
        var deff = $q.defer(),
          proms = _.map(grids, function (item) {
            var deff2 = $q.defer(),
              objXAddElementPrice = {
                currencyId: UserStor.userInfo.currencyId,
                element: item
              };
            // console.log('GRID objXAddElementPrice=====', objXAddElementPrice);
            //-------- get current add element price
            localDB
              .calculationGridPrice(objXAddElementPrice)
              .then(function (results) {
                if (results) {
                  item.element_price = angular.copy(
                    GeneralServ.roundingValue(
                      GeneralServ.addMarginToPrice(
                        results.priceTotal,
                        GlobalStor.global.margins.margin
                      )
                    )
                  );
                  item.elementPriceDis = angular.copy(
                    GeneralServ.roundingValue(
                      GeneralServ.setPriceDis(
                        item.element_price,
                        OrderStor.order.discount_addelem
                      )
                    )
                  );
                  //console.log('GRID objXAddElementPrice====result +++', results);
                  deff2.resolve(item);
                } else {
                  deff2.reject(results);
                }
              });
            return deff2.promise;
          });

        deff.resolve($q.all(proms));
        return deff.promise;
      }

      function sortingAllAddElem() {
        var deff = $q.defer();
        localDB
          .selectLocalDB(localDB.tablesLocalDB.addition_folders.tableName)
          .then(function (groupsData) {
            var addElemAll = GlobalStor.global.addElementsAll,
              elemAllQty = addElemAll.length,
              defaultGroup = {
                id: 0,
                name: $filter("translate")("add_elements.OTHERS")
              },
              groups,
              newElemList,
              typeDelete,
              typeQty,
              elemQty,
              tempElemQty,
              t,
              elements,
              el,
              widthTemp,
              heightTemp,
              k,
              delQty;
            /** sorting types by position */
            if (groupsData && groupsData.length) {
              groups = groupsData.sort(function (a, b) {
                return GeneralServ.sorting(a.position, b.position);
              });
            }
            //console.info('AddElems sorting====', GlobalStor.global.addElementsAll);
            while (--elemAllQty > -1) {
              if (addElemAll[elemAllQty].elementsList) {
                if (!elemAllQty) {
                  /** Grids */
                  if (addElemAll[elemAllQty].elementsList[0]) {
                    elemQty = addElemAll[elemAllQty].elementsList[0].length;
                    if (elemQty) {
                      for (el = 0; el < elemQty; el += 1) {
                        addElemAll[elemAllQty].elementsList[0][
                          el
                        ].element_width = 1000;
                        addElemAll[elemAllQty].elementsList[0][
                          el
                        ].element_height = 1000;
                        addElemAll[elemAllQty].elementsList[0][
                          el
                        ].element_qty = 1;
                        addElemAll[elemAllQty].elementsList[0][
                          el
                        ].list_group_id = 20;
                      }
                      getGridPrice(addElemAll[elemAllQty].elementsList[0]);
                    }
                  }
                } else {
                  if (groups && groups.length) {
                    addElemAll[elemAllQty].elementType = angular.copy(groups);
                  }
                  addElemAll[elemAllQty].elementType.push(defaultGroup);
                  //------- sorting
                  newElemList = [];
                  typeDelete = [];
                  typeQty = addElemAll[elemAllQty].elementType.length;
                  elemQty = addElemAll[elemAllQty].elementsList.length;
                  tempElemQty = GlobalStor.global.tempAddElements.length;
                  for (t = 0; t < typeQty; t += 1) {
                    elements = [];
                    for (el = 0; el < elemQty; el += 1) {
                      if (
                        addElemAll[elemAllQty].elementType[t].id ===
                        addElemAll[elemAllQty].elementsList[el]
                          .addition_folder_id
                      ) {
                        widthTemp = 0;
                        heightTemp = 0;
                        switch (
                        addElemAll[elemAllQty].elementsList[el].list_group_id
                        ) {
                          case 21: // 1 - visors
                          case 9: // 2 - spillways
                          case 8: // 8 - windowSill
                          case 19: // 3 - outSlope & inSlope
                          case 12: // 6 - connectors
                          case 13: // 6 - расширители
                            widthTemp = 1000;
                            break;
                          case 26: // 4 - louvers
                            widthTemp = 1000;
                            heightTemp = 1000;
                            break;
                        }
                        var aF =
                          addElemAll[elemAllQty].elementsList[el].list_group_id;
                        if (
                          addElemAll[elemAllQty].elementType[t].max_size &&
                          (aF === 12 || aF === 21 || aF === 9 || aF === 8)
                        ) {
                          addElemAll[elemAllQty].elementsList[el].max_size =
                            addElemAll[elemAllQty].elementType[t].max_size;
                        } else {
                          addElemAll[elemAllQty].elementsList[
                            el
                          ].max_size = 5000;
                        }

                        addElemAll[elemAllQty].elementsList[
                          el
                        ].element_width = widthTemp;
                        addElemAll[elemAllQty].elementsList[
                          el
                        ].element_height = heightTemp;
                        addElemAll[elemAllQty].elementsList[el].element_qty = 1;
                        /** get price of element */
                        for (k = 0; k < tempElemQty; k += 1) {
                          if (
                            GlobalStor.global.tempAddElements[k].id ===
                            addElemAll[elemAllQty].elementsList[el]
                              .parent_element_id
                          ) {
                            ///** add price margin */
                            //GlobalStor.global.tempAddElements[k].price = GeneralServ.roundingValue(
                            // GeneralServ.addMarginToPrice(angular.copy(GlobalStor.global.tempAddElements[k].price),
                            // GlobalStor.global.margins.margin), 2);
                            /** currency conversion */
                            addElemAll[elemAllQty].elementsList[
                              el
                            ].element_price = GeneralServ.roundingValue(
                              localDB.currencyExgange(
                                GlobalStor.global.tempAddElements[k].price,
                                GlobalStor.global.tempAddElements[k].currency_id
                              ),
                              2
                            );
                          }
                        }
                        elements.push(
                          angular.copy(addElemAll[elemAllQty].elementsList[el])
                        );
                      }
                    }
                    if (elements.length) {
                      ///** sorting elements by position */
                      //elements = elements.sort(function(a, b) {
                      //  return GeneralServ.sorting(a.position, b.position);
                      //});
                      /** sorting by name */
                      elements = $filter("orderBy")(elements, "name");

                      newElemList.push(elements);
                    } else {
                      typeDelete.push(t);
                    }
                  }

                  if (newElemList.length) {
                    addElemAll[elemAllQty].elementsList = angular.copy(
                      newElemList
                    );
                  } else {
                    addElemAll[elemAllQty].elementsList = 0;
                  }

                  /** delete empty groups */
                  delQty = typeDelete.length;
                  if (delQty) {
                    while (--delQty > -1) {
                      addElemAll[elemAllQty].elementType.splice(
                        typeDelete[delQty],
                        1
                      );
                    }
                  }
                }
              }
            }
            //console.log('addElementsAll________________', addElemAll);
            deff.resolve(1);
          });
        return deff.promise;
      }

      function downloadAllAddElements() {
        var defer = $q.defer();
        /** get All kits of addElements */
        getAllAddKits().then(function () {
          /** get All elements of addElements*/
          getAllAddElems().then(function () {
            sortingAllAddElem().then(function () {
              defer.resolve(1);
            });
          });
        });
        return defer.promise;
      }

      function downloadCartMenuData() {
        /** download Supply Data */
        localDB
          .selectLocalDB(localDB.tablesLocalDB.users_deliveries.tableName)
          .then(function (supply) {
            if (supply.length) {
              GlobalStor.global.supplyData = angular.copy(supply);
              //console.warn('supplyData=', GlobalStor.global.supplyData);
            }
          });
        /** download Mounting Data */
        localDB
          .selectLocalDB(localDB.tablesLocalDB.users_mountings.tableName)
          .then(function (mounting) {
            if (mounting.length) {
              GlobalStor.global.assemblingData = angular.copy(mounting);
              // console.warn('assemblingData=', GlobalStor.global.assemblingData);
            }
          });
        /** download Disassembly Data */
        localDB
          .selectLocalDB(localDB.tablesLocalDB.users_dismantlings.tableName)
          .then(function (dismounting) {
            if (dismounting) {
              GlobalStor.global.disassemblyData = angular.copy(dismounting);
              // console.warn('Disassembly=', GlobalStor.global.disassemblyData);
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

      /**============ DOORs ===========*/

      function sortingDoorKits(doorKits, doorKitsGlobal) {
        var profsQty = GlobalStor.global.profiles.length,
          profQty,
          tempKit,
          frameDoor,
          sashDoor,
          frameQty,
          sashQty,
          f,
          s,
          currFrame,
          currSash;
        if (doorKits.length) {
          frameDoor = doorKits.filter(function (item) {
            return item.list_group_id === 2;
          });
          sashDoor = doorKits.filter(function (item) {
            return item.list_group_id === 3;
          });
          frameQty = frameDoor.length;
          sashQty = sashDoor.length;
          while (--profsQty > -1) {
            profQty = GlobalStor.global.profiles[profsQty].length;
            while (--profQty > -1) {
              tempKit = {};
              currFrame = 0;
              currSash = 0;
              for (f = 0; f < frameQty; f += 1) {
                if (
                  frameDoor[f].id ===
                  GlobalStor.global.profiles[profsQty][profQty].rama_list_id
                ) {
                  currFrame = frameDoor[f];
                }
              }
              for (s = 0; s < sashQty; s += 1) {
                if (
                  sashDoor[s].id ===
                  GlobalStor.global.profiles[profsQty][profQty].stvorka_list_id
                ) {
                  currSash = sashDoor[s];
                }
              }
              if (currFrame && currSash) {
                tempKit.profileId =
                  GlobalStor.global.profiles[profsQty][profQty].id;
                tempKit.frame = currFrame;
                tempKit.sash = currSash;
                doorKitsGlobal.push(tempKit);
              }
            }
          }
        }
      }

      /**------ download Locks ------*/
      function downloadLocks() {
        localDB
          .selectLocalDB(
            localDB.tablesLocalDB.doors_groups_dependencies.tableName
          )
          .then(function (dependencies) {
            localDB
              .selectLocalDB(
                localDB.tablesLocalDB.doors_hardware_groups.tableName
              )
              .then(function (hardware_groups) {
                // console.info('--hardware_groups---', hardware_groups);
                // console.info('--dependencies---', dependencies);
                for (var x = 0; x < hardware_groups.length; x += 1) {
                  hardware_groups[x].profIds = [];
                  for (var y = 0; y < dependencies.length; y += 1) {
                    if (
                      hardware_groups[x].id ===
                      dependencies[y].hardware_group_id
                    ) {
                      hardware_groups[x].profIds.push(
                        dependencies[y].doors_group_id
                      );
                    }
                  }
                  hardware_groups[x].profIds = hardware_groups[x].profIds.join(
                    ", "
                  );
                }
                GlobalStor.global.doorLocks = angular.copy(hardware_groups);
              });
          });
      }

      function accessoryHandles() {
        localDB
          .selectLocalDB(localDB.tablesLocalDB.lock_lists.tableName)
          .then(function (lockIds) {
            //console.info('--lockIds---', lockIds);
            GlobalStor.global.locksList = angular.copy(lockIds);
          });
      }

      function checkHandleWProfile(profArr) {
        var profIds = [],
          profArrQty = profArr.length,
          profsQty,
          profQty,
          isExist,
          i;
        for (i = 0; i < profArrQty; i += 1) {
          profsQty = GlobalStor.global.locksList.length;
          isExist = 0;
          while (--profsQty > -1) {
            if (
              GlobalStor.global.locksList[profsQty].accessory_id ===
              profArr[i].accessory_id
            ) {
              isExist = 1;
            }
          }
          if (isExist) {
            profIds.push("hel" + profArr[i].accessory_id + "lo");
          }
        }
        return profIds.join(", ");
      }

      /**------ download Handles ------*/

      function downloadDoorHandles() {
        //36 офисная ручка , 35 нажимной гарнитур
        var options = "id, name, list_type_id, parent_element_id";
        localDB
          .selectLocalDB(
            localDB.tablesLocalDB.lists.tableName,
            {
              list_type_id: 35
            },
            options
          )
          .then(function (handlData) {
            //console.warn('нажимной гарнитур', handlData);
            GlobalStor.global.doorHandlers = GlobalStor.global.doorHandlers.concat(
              handlData
            );
            localDB
              .selectLocalDB(
                localDB.tablesLocalDB.lists.tableName,
                {
                  list_type_id: 36
                },
                options
              )
              .then(function (handlData) {
                //console.warn('офисная ручка', handlData);
                GlobalStor.global.doorHandlers = GlobalStor.global.doorHandlers.concat(
                  handlData
                );

                /** download Locks */
                downloadLocks();
                accessoryHandles();
                downloadDoorsItems();
                //------- get link between handler and profile
                var promises = _.map(GlobalStor.global.doorHandlers, function (
                  item
                ) {
                  var deff = $q.defer();
                  localDB
                    .selectLocalDB(
                      localDB.tablesLocalDB.lock_lists.tableName,
                      {
                        list_id: item.id
                      },
                      "accessory_id"
                    )
                    .then(function (profileIds) {
                      //console.info('--prof---', profileIds);
                      deff.resolve(profileIds);
                    });
                  return deff.promise;
                });

                $q.all(promises).then(function (profData) {
                  var handleQty = GlobalStor.global.doorHandlers.length,
                    h;
                  for (h = 0; h < handleQty; h += 1) {
                    //--------- compare with profiles
                    GlobalStor.global.doorHandlers[
                      h
                    ].profIds = checkHandleWProfile(profData[h]);
                  }
                });
              });
          });
      }

      /**------ download Doors ------*/

      function downloadDoorKits() {
        localDB
          .selectLocalDB(
            localDB.tablesLocalDB.lists.tableName,
            {
              list_group_id: 2
            },
            "id, name, doorstep_type"
          )
          .then(function (doorData) {
            var door = angular.copy(doorData),
              doorKitsT1,
              profiles = GlobalStor.global.profiles,
              doorQty = door.length;
            if (doorQty) {
              //----- sorting door elements as to doorstep_type
              doorKitsT1 = door.filter(function (item) {
                return item.doorstep_type === 1 || item.doorstep_type === 2;
              });

              GlobalStor.global.doorKitsT1 = angular.copy(doorKitsT1);
              /** Handlers */
              downloadDoorHandles();
            } else {
              GlobalStor.global.noDoorExist = 1;
            }
          });
        downloadDoorsGroups();
        downloadDoorsLamination();
      }

      function downloadDoorsGroups() {
        localDB
          .selectLocalDB(localDB.tablesLocalDB.doors_groups.tableName)
          .then(function (doorData) {
            doorData = doorData.sort(function (a, b) {
              return a.id - b.id;
            });
            localDB
              .selectLocalDB(localDB.tablesLocalDB.lists.tableName)
              .then(function (items) {
                for (var x = 0; x < items.length; x += 1) {
                  for (var y = 0; y < doorData.length; y += 1) {
                    if (items[x].id === doorData[y].stvorka_list_id) {
                      doorData[y].list_id = items[x].parent_element_id;
                      doorData[y].list_type_id = items[x].list_type_id;
                    }
                  }
                }
                localDB
                  .selectLocalDB(
                    localDB.tablesLocalDB.elements_profile_systems.tableName
                  )
                  .then(function (prof) {
                    for (var x = 0; x < prof.length; x += 1) {
                      for (var y = 0; y < doorData.length; y += 1) {
                        if (doorData[y].list_id === prof[x].element_id) {
                          doorData[y].profile_id = prof[x].profile_system_id;
                        }
                      }
                    }
                    GlobalStor.global.doorsGroups = angular.copy(doorData);
                  });
              });
          });
      }

      function downloadDoorsLamination() {
        localDB
          .selectLocalDB(
            localDB.tablesLocalDB.doors_laminations_dependencies.tableName
          )
          .then(function (doorData) {
            GlobalStor.global.doorsLaminations = angular.copy(doorData);
          });
      }

      function downloadDoorsItems() {
        localDB
          .selectLocalDB(localDB.tablesLocalDB.doors_hardware_items.tableName)
          .then(function (doorData) {

            var items = angular.copy(doorData);
            for (var x = 0; x < items.length; x += 1) {
              items[x].parent_element_id = items[x].child_id;
              delete items[x].child_id;
            }
            GlobalStor.global.doorsItems = angular.copy(items);
          });
      }

      /** =========== DOWNLOAD ALL DATA =========== */
      function downloadAllData() {
        var defer = $q.defer();
        //console.time('start')
        /** download All Currencies and set currency symbol */
        setCurrency().then(function (data) {
          // console.log("setCurrency");
          if (data) {
            /** download user discounts */
            setUserDiscounts().then(function (data) {
              // console.log("setUserDiscounts");
              if (data) {
                /** download price Margins of Plant */
                downloadPriceMargin().then(function (margins) {
                  // console.log("downloadPriceMargin");
                  if (margins && margins.length) {
                    GlobalStor.global.margins = angular.copy(margins[0]);
                    // console.warn('Margins!!', margins);
                    /** download delivery Coeff of Plant */
                    downloadDeliveryCoeff().then(function (coeff) {
                      // console.log("downloadDeliveryCoeff");
                      if (coeff && coeff.length) {
                        // console.warn('delivery Coeff!!', coeff);
                        GlobalStor.global.deliveryCoeff = angular.copy(
                          coeff[0]
                        );
                        GlobalStor.global.deliveryCoeff.percents = _.map(
                          coeff[0].percents,
                          function (item) {
                            return +item;
                          }
                        );
                        /** download factory data */
                        downloadFactoryData();
                        /** download All Profiles */
                        downloadAllElemAsGroup(
                          localDB.tablesLocalDB.profile_system_folders
                            .tableName,
                          localDB.tablesLocalDB.profile_systems.tableName,
                          GlobalStor.global.profilesType,
                          GlobalStor.global.profiles
                        ).then(function (data) {
                          downloadOptionsCoefficients().then(function (coef) {
                            GlobalStor.global.area_currencies =
                              coef[0].area_currencies;
                            GlobalStor.global.area_price = coef[0].area_price;
                            GlobalStor.global.perimeter_currencies =
                              coef[0].perimeter_currencies;
                            GlobalStor.global.perimeter_price =
                              coef[0].perimeter_price;
                            GlobalStor.global.piece_currencies =
                              coef[0].piece_currencies;
                            GlobalStor.global.piece_price = coef[0].piece_price;
                          });
                          if (data) {
                            /** download All Glasses */
                            downloadAllGlasses().then(function (data) {
                              if (data) {
                                /** sorting glasses as to Type */
                                sortingGlasses();
                                /** download All Hardwares */
                                downloadAllElemAsGroup(
                                  localDB.tablesLocalDB.window_hardware_folders
                                    .tableName,
                                  localDB.tablesLocalDB.window_hardware_groups
                                    .tableName,
                                  GlobalStor.global.hardwareTypes,
                                  GlobalStor.global.hardwares
                                ).then(function (data) {
                                  if (data) {
                                    // console.log('HARDWARE ALL', GlobalStor.global.hardwareTypes);
                                    /** download Door Kits */
                                    downloadDoorKits();
                                    /** download Hardware Limits */
                                    downloadHardwareLimits();
                                    downloadAllLanguages();
                                    /** download All Templates and Backgrounds */
                                    downloadAllBackgrounds().then(function () {
                                      // console.log("downloadAllBackgrounds");
                                      /** download All AddElements */
                                      downloadAllAddElements().then(function () {
                                        // console.log(JSON.stringify(GlobalStor.global.tempAddElements));
                                        /** download All Lamination */
                                        downloadAllLamination().then(function (result) {
                                          if (result && result.length) {
                                            GlobalStor.global.laminats = _.map(
                                              angular.copy(result),
                                              function (item) {
                                                item.isActive = 0;
                                                return item;
                                              }
                                            );
                                            /** add white color */
                                            GlobalStor.global.laminats.unshift({
                                              id: 1,
                                              lamination_type_id: 1,
                                              isActive: 0,
                                              name: "mainpage.WHITE_LAMINATION"
                                            });
                                            /** download lamination couples */
                                            downloadLamCouples().then(
                                              function () {
                                                /** add white-white couple */
                                                GlobalStor.global.laminatCouples.push(
                                                  angular.copy(
                                                    ProductStor.product
                                                      .lamination
                                                  )
                                                );
                                              }
                                            );
                                          }
                                          /** download Cart Menu Data */
                                          downloadCartMenuData();
                                          //console.timeEnd('start');
                                          defer.resolve(1);
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
                        console.error("not find options_discounts!");
                        defer.resolve(0);
                      }
                    });
                  } else {
                    console.error("not find options_coefficients!");
                    defer.resolve(0);
                  }
                });
              }
            });
          }
        });
        return defer.promise;
      }

      /**========== FINISH ==========*/

      thisFactory.publicObj = {
        getDeviceLanguage: getDeviceLanguage,
        isLocalDBExist: isLocalDBExist,
        prepareLocationToUse: prepareLocationToUse,
        downloadAllCities: downloadAllCities,
        collectCityIdsAsCountry: collectCityIdsAsCountry,
        setUserLocation: setUserLocation,
        setUserGeoLocation: setUserGeoLocation,
        downloadAllData: downloadAllData,
        getGridPrice: getGridPrice,
        downloadAllAddElements: downloadAllAddElements
      };

      return thisFactory.publicObj;
    }
  );
})();
