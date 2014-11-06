/* globals BauVoiceApp, STEP, typingTextByChar, Template, drawSVG */

'use strict';

BauVoiceApp.controller('ConfigMenuCtrl', ['$scope', 'globalDB', 'localDB', 'localStorage', 'constructService', '$timeout', '$q', function ($scope, globalDB, localDB, localStorage, constructService,  $timeout, $q) {

  $scope.global = localStorage;

  $scope.configMenu = {
    DELAY_START: STEP,
    DELAY_SHOW_CONFIG_LIST: 5 * STEP,
    DELAY_SHOW_FOOTER: 5 * STEP,
    DELAY_TYPE_ITEM_TITLE: 10 * STEP,
    typing: 'on'
  };


  var templateObjXPrice = {
    cityId: $scope.global.userGeoLocationId,
    profileId: '',
    glassId: '',
    framesSize: [],
    sashsSize: [],
    beadsSize: [],
    impostsSize: [],
    shtulpsSize: [],
    glassSize: [],
    glassSquare: 0,
    frameSillSize: 0
  };
/*
  $scope.dubleTyping = function() {
    $timeout(function() {
      var $configItemValue = $('.config-menu .value');
      $configItemValue.each(function () {
        var $configItemNameAside = $(this).next('.name.aside');
        if ($configItemNameAside.length) {
          typingTextByChar($(this), $configItemNameAside);
        }
      });
    },  $scope.configMenu.DELAY_TYPE_ITEM_TITLE);
  };
*/

  //------ Check Product Edit
  $scope.global.checkIsEditProduct = function () {
    if ($scope.global.productEditNumber) {

      //------ Download Add Elements from localDB
      localDB.selectDB($scope.global.visorsTableBD, {'productId': $scope.global.productEditNumber}, function (results) {
        if (results.status) {
          $scope.global.chosenAddElements.selectedVisors = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });
      localDB.selectDB($scope.global.windowSillsTableBD, {'productId': $scope.global.productEditNumber}, function (results) {
        if (results.status) {
          $scope.global.chosenAddElements.selectedWindowSill = angular.copy(results.data);
        } else {
          console.log(results);
        }
      });

      //------ Download Product Data from localDB
      localDB.selectDB($scope.global.orderTableBD, {'productId': $scope.global.productEditNumber}, function (results) {
        if (results.status) {
          var tempProduct = angular.copy(results.data);
          $scope.global.product.constructThumb = '#';
          $scope.global.product.constructionWidth = tempProduct[0].productWidth;
          $scope.global.product.constructionHeight = tempProduct[0].productHeight;
          $scope.global.product.profileName = tempProduct[0].profileName;
          $scope.global.product.glassName = tempProduct[0].glassName;
          $scope.global.product.hardwareName = tempProduct[0].hardwareName;
          $scope.global.product.laminationOuter = tempProduct[0].laminationNameOut;
          $scope.global.product.laminationInner = tempProduct[0].laminationNameIn;
          $scope.global.product.productPrice = tempProduct[0].productPrice;
          $scope.global.product.productQty = tempProduct[0].productQty;
          //console.log($scope.global.product);


          // change add element quantity as to product quantity
          for (var prop in $scope.global.chosenAddElements) {
            if (!$scope.global.chosenAddElements.hasOwnProperty(prop)) {
              continue;
            } else {
              if($scope.global.chosenAddElements[prop].length > 0) {
                for(var elem = 0; elem < $scope.global.chosenAddElements[prop].length; elem++) {
                  $scope.global.chosenAddElements[prop][elem].elementQty *= $scope.global.product.productQty;
                }
              }
            }
          }

        } else {
          console.log(results);
        }
      });

    } else {



      constructService.getConstructThumb(function (results) {
        if (results.status) {
          $scope.global.product.constructThumb = results.data.url;
        } else {
          console.log(results);
        }
      });


      //----------- get all profiles
      $scope.downloadAllProfiles = function(results) {
          if (results) {
            $scope.global.product.producers = results[0].folder;
            $scope.global.product.profiles = results[0].profiles;
            $scope.global.product.profileId = $scope.global.product.profiles[0].id;
            $scope.global.product.profileName = $scope.global.product.profiles[0].name;

            //console.log($scope.global.product.producers);
            //console.log($scope.global.product.profiles);
          } else {
            console.log(results);
          }
      };

      //---------- get element section sizes as to profile
      $scope.downloadProfileElementSizes = function(results, type) {
        if(results) {
          switch(type) {
            case 'frame': $scope.global.allProfileFrameSizes = angular.copy(results);
              break;
            case 'frame-still': $scope.global.allProfileFrameStillSizes = angular.copy(results);
              break;
            case 'sash': $scope.global.allProfileSashSizes = angular.copy(results);
              break;
            case 'impost': $scope.global.allProfileImpostSizes = angular.copy(results);
              break;
            case 'shtulp': $scope.global.allProfileShtulpSizes = angular.copy(results);
              break;
          }
        } else {
          console.log(results);
        }
      };


      //-------- get default json template
      $scope.downloadDefaultTemplate = function() {
          constructService.getDefaultConstructTemplate(function (results) {
          if (results.status) {

            $scope.global.templateSource = results.data;

            // парсинг шаблона, расчет размеров
            //var depth = frameSize[0].c;
            $scope.global.templateDepths = {
              frameDepth: $scope.global.allProfileFrameSizes[0],
              sashDepth: $scope.global.allProfileSashSizes[0],
              impostDepth: $scope.global.allProfileImpostSizes[0],
              shtulpDepth: $scope.global.allProfileShtulpSizes[0]

            };
            //console.log(depths);
            var templateDefault = new Template($scope.global.templateSource, $scope.global.templateDepths);
            console.log(templateDefault);

            // создание объекта для отправки в базу, чтобы рассчитать цену шаблона
            for (var item = 0; item < templateDefault.objects.length; item++) {
              var elementSize;
              if (templateDefault.objects[item].type) {
                switch (templateDefault.objects[item].type) {
                  case 'frame_line':
                    elementSize = templateDefault.objects[item].lengthVal;
                    templateObjXPrice.framesSize.push(elementSize);
                    if(templateDefault.objects[item].sill) {
                      templateObjXPrice.frameSillSize = templateDefault.objects[item].lengthVal;
                    }
                    break;
                  case 'sash_line':
                    elementSize = templateDefault.objects[item].lengthVal;
                    templateObjXPrice.sashsSize.push(elementSize);
                    break;
                  case 'bead_box_line':
                    elementSize = templateDefault.objects[item].lengthVal;
                    templateObjXPrice.beadsSize.push(elementSize);
                    break;
                  case 'glass_line':
                    elementSize = templateDefault.objects[item].lengthVal;
                    templateObjXPrice.glassSize.push(elementSize);
                    break;
                }
              }
            }
            templateObjXPrice.glassSquare = (templateObjXPrice.glassSize[0] * templateObjXPrice.glassSize[1])/1000000;
            templateObjXPrice.profileId = $scope.global.product.profileId;
            templateObjXPrice.cityId = $scope.global.userGeoLocationId;
            templateObjXPrice.frameId = $scope.global.allProfileFrameSizes[0].id;
            templateObjXPrice.frameSillId = $scope.global.allProfileFrameStillSizes[0].id;
            templateObjXPrice.sashId = $scope.global.allProfileSashSizes[0].id;
            templateObjXPrice.impostId = $scope.global.allProfileImpostSizes[0].id;
            templateObjXPrice.shtulpId = $scope.global.allProfileShtulpSizes[0].id;

              console.log(templateObjXPrice);
            //console.log(JSON.stringify(templateObjXPrice));

            // габариты шаблона
            $scope.global.product.constructionWidth = templateObjXPrice.framesSize[0];
            $scope.global.product.constructionHeight = templateObjXPrice.framesSize[1];

            $scope.global.templateDefault = templateDefault;
          } else {
            console.log(results);
          }
        });
      };


      constructService.getAllProfileSystems().then(function (data) {
          $scope.downloadAllProfiles(data);
        }).then(function () {

          var ramaQueries = [],
              sashQueries = [],
              ramaStillQueries = [],
              impostQueries = [],
              shtulpQueries = [],
              k;

          for(k = 0; k < $scope.global.product.profiles.length; k++) {
            ramaQueries.push(constructService.getAllProfileSizes($scope.global.product.profiles[k].rama_id));
            ramaStillQueries.push(constructService.getAllProfileSizes($scope.global.product.profiles[k].rama_still_id));
            sashQueries.push(constructService.getAllProfileSizes($scope.global.product.profiles[k].sash_id));
            impostQueries.push(constructService.getAllProfileSizes($scope.global.product.profiles[k].impost_id));
            shtulpQueries.push(constructService.getAllProfileSizes($scope.global.product.profiles[k].shtulp_id));
          }

          $q.all(ramaQueries).then(function (data) {
            $scope.downloadProfileElementSizes(data, 'frame');
          });
          $q.all(ramaStillQueries).then(function (data) {
            $scope.downloadProfileElementSizes(data, 'frame-still');
          });
          $q.all(sashQueries).then(function (data) {
            $scope.downloadProfileElementSizes(data, 'sash');
          });
          $q.all(impostQueries).then(function (data) {
            $scope.downloadProfileElementSizes(data, 'impost');
          });
          $q.all(shtulpQueries).then(function (data) {
            $scope.downloadProfileElementSizes(data, 'shtulp');
          }).then(function () {
            $scope.downloadDefaultTemplate();
          });
      });


/*
      var deferred = new Deferred();
      //Deferred.define();
      deferred.next(function () {
          console.log("Profiles");
          return constructService.getAllProfileSystems().next(function (data) {
            $scope.downloadAllProfilesData(data);
          });
          //return wait(1);
        }).next(function () {
          console.log("a, b, c");
          console.log($scope.global.product.profiles[0].rama_id);
          //if ($scope.global.product.profiles[0].rama_id) {
        return constructService.getAllProfileSizes($scope.global.product.profiles[0].rama_id).next(function (data) {
              $scope.downloadProfileSectionSize(data);
            });
          //}

        //return localDB.selectDBGlobal('lists', {'id': $scope.global.product.profiles[0].rama_id}).next(function (data) {
        //  $scope.downloadProfileSectionSize(data);
       // });

        })*/
        /*.loop($scope.global.product.profiles.length, function (i) {
          if ($scope.global.product.profiles[i].rama_id) {
            return localDB.selectDBGlobal('lists', {'id': $scope.global.product.profiles[i].rama_id}).next(function (data) {
              $scope.downloadProfileSectionSize(data);
            });
          }
        })*//*
        .next(function () {
          console.log("template");
          $scope.downloadDefaultTemplate();
        });
      deferred.call();
*/


      constructService.getGlass(function (results) {
        if (results.status) {
          $scope.global.product.glassId = results.data.id;
          $scope.global.product.glassName = results.data.name;
          templateObjXPrice.glassId = $scope.global.product.glassId;
        } else {
          console.log(results);
        }
      });

      constructService.getWindowHardware(function (results) {
        if (results.status) {
          $scope.global.product.hardwareName = results.data.name;
        } else {
          console.log(results);
        }
      });

      constructService.getLamination(function (results) {
        if (results.status) {
          $scope.global.product.laminationOuter = results.data.outer.name;
          $scope.global.product.laminationInner = results.data.inner.name;
        } else {
          console.log(results);
        }
      });



      // Clear All AddElements in localStorage
      for (var prop in $scope.global.chosenAddElements) {
        if (!$scope.global.chosenAddElements.hasOwnProperty(prop)) {
          continue;
        } else {
          $scope.global.chosenAddElements[prop].length = 0;
        }
      }


      /*
       constructService.getAdditionalElements(function (results) {
       if (results.status) {
       $scope.configMenu.additionalElments = results.data.elements;
       } else {
       console.log(results);
       }
       });
       */
      constructService.getPrice(function (results) {
        if (results.status) {
          //$scope.configMenu.price = results.data.price;
          //$scope.configMenu.currency = results.data.currency.name;

          $scope.global.product.productPrice = results.data.price;

          var currencySymbol = '';
          if (results.data.currency.name === 'uah') {
            currencySymbol = '₴';
          }
          $scope.currency = currencySymbol;
          $scope.global.currency = currencySymbol;
        } else {
          console.log(results);
        }
      });
      /*
       $scope.setCurrencySymbol = function (currency) {
       var currencySymbol = '';

       if (currency === 'uah') {
       currencySymbol = '₴';
       }

       return currencySymbol;
       };

       localStorage.getOrdersCart(function (results) {
       if (results.status) {
       $scope.configMenu.ordersInCart = results.data.ordersInCart;
       } else {
       console.log(results);
       }
       });
       */

      //




    }
  };

  $scope.global.checkIsEditProduct();

  //------- Select menu item

  $scope.selectTemplatePanel = function() {
    if($scope.global.showPanels.showTemplatePanel) {
      $scope.global.showPanels.showTemplatePanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showTemplatePanel = true;
      $scope.global.isTemplatePanel = true;
    }
  };
  $scope.selectProfilePanel = function() {
    if($scope.global.showPanels.showProfilePanel) {
      $scope.global.showPanels.showProfilePanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showProfilePanel = true;
      $scope.global.isProfilePanel = true;
    }
  };
  $scope.selectGlassPanel = function() {
    if($scope.global.showPanels.showGlassPanel) {
      $scope.global.showPanels.showGlassPanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showGlassPanel = true;
      $scope.global.isGlassPanel = true;
    }
  };
  $scope.selectHardwarePanel = function() {
    if($scope.global.showPanels.showHardwarePanel) {
      $scope.global.showPanels.showHardwarePanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showHardwarePanel = true;
      $scope.global.isHardwarePanel = true;
    }
  };
  $scope.selectLaminationPanel = function() {
    if($scope.global.showPanels.showLaminationPanel) {
      $scope.global.showPanels.showLaminationPanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showLaminationPanel = true;
      $scope.global.isLaminationPanel = true;
    }
  };
  $scope.selectAddElementsPanel = function() {
    if($scope.global.showPanels.showAddElementsPanel) {
      $scope.global.showPanels.showAddElementsPanel = false;
      $scope.global.isAddElementListView = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showAddElementsPanel = true;
      $scope.global.isAddElementsPanel = true;
    }
  };

  // Close all panels
  function clearShowPanelsObj() {
    for (var item in $scope.global.showPanels) {
      delete $scope.global.showPanels[item];
    }
  }







  // Save Product in Order and enter in Cart
  $scope.inputOrderInCart = function() {
/*
    localDB.deleteTable($scope.global.orderTableBD);
    localDB.deleteTable($scope.global.visorsTableBD);
    localDB.deleteTable($scope.global.windowSillsTableBD);
*/
    var productData,
        addElementsData,
        addElementsObj = $scope.global.chosenAddElements;

    if($scope.global.ordersInCart) {
      ++$scope.global.ordersInCart;
    } else {
      $scope.global.ordersInCart = 1;
    }
    ++$scope.global.productCounter;

    productData = {
      "productId": $scope.global.productCounter,
      "productWidth": $scope.global.product.constructionWidth,
      "productHeight": $scope.global.product.constructionHeight,
      "profileName": $scope.global.profileName,
      "glassName": $scope.global.glassName,
      "hardwareName": $scope.global.hardwareName,
      "laminationNameOut": $scope.global.product.laminationOuter,
      "laminationNameIn": $scope.global.product.laminationInner,
      "productPrice": $scope.global.productPrice,
      "productQty": 1
    };

    localDB.insertDB($scope.global.orderTableBD, productData);

    for(var prop in addElementsObj) {
      if (!addElementsObj.hasOwnProperty(prop)) {
        continue;
      }
      for (var elem = 0; elem < addElementsObj[prop].length; elem++) {

        switch (prop) {
          case 'selectedVisors':
            addElementsData = {
              "productId": $scope.global.productCounter,
              "elementId": addElementsObj[prop][elem].elementId,
              "elementType": addElementsObj[prop][elem].elementType,
              "elementName": addElementsObj[prop][elem].elementName,
              "elementQty": addElementsObj[prop][elem].elementQty,
              "elementWidth": addElementsObj[prop][elem].elementWidth,
              "elementPrice": addElementsObj[prop][elem].elementPrice
            };
            localDB.insertDB($scope.global.visorsTableBD, addElementsData);
            break;

          case 'selectedWindowSill':
            addElementsData = {
              "productId": $scope.global.productCounter,
              "elementId": addElementsObj[prop][elem].elementId,
              "elementType": addElementsObj[prop][elem].elementType,
              "elementName": addElementsObj[prop][elem].elementName,
              "elementQty": addElementsObj[prop][elem].elementQty,
              "elementWidth": addElementsObj[prop][elem].elementWidth,
              "elementColor": addElementsObj[prop][elem].elementColor,
              "elementPrice": addElementsObj[prop][elem].elementPrice
            };
            localDB.insertDB($scope.global.windowSillsTableBD, addElementsData);
            break;

        }
      }
    }


///*
    $timeout(function(){
      $scope.global.gotoCartPage();
    }, 2*STEP);
//*/
  }

}]);