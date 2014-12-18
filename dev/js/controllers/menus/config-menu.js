/* globals BauVoiceApp, STEP, typingTextByChar, Template, TemplateIcon, drawSVG */

'use strict';

BauVoiceApp.controller('ConfigMenuCtrl', ['$scope', 'globalDB', 'localDB', 'localStorage', 'constructService', '$timeout', '$q', '$filter', function ($scope, globalDB, localDB, localStorage, constructService,  $timeout, $q, $filter) {

  $scope.global = localStorage;

  $scope.configMenu = {
    DELAY_START: STEP,
    DELAY_SHOW_CONFIG_LIST: 5 * STEP,
    DELAY_SHOW_FOOTER: 5 * STEP,
    DELAY_TYPE_ITEM_TITLE: 10 * STEP,
    typing: 'on'
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

  //============= Create Order Date
  $scope.createOrderDate = function() {
    var deliveryDate = new Date(),
        valuesDate,
        idDate;

    //------ set delivery day
    deliveryDate.setDate( $scope.global.currentDate.getDate() + $scope.global.productionDays );
    valuesDate = [
      deliveryDate.getDate(),
      deliveryDate.getMonth() + 1
    ];
    for(idDate in valuesDate) {
      valuesDate[ idDate ] = valuesDate[ idDate ].toString().replace( /^([0-9])$/, '0$1' );
    }
    //$scope.global.deliveryDate = valuesDate[ 0 ] + '.' + valuesDate[ 1 ] + '.' + deliveryDate.getFullYear();
    //$scope.global.newDeliveryDate = $scope.global.deliveryDate;

    $scope.global.order.deliveryDate = valuesDate[ 0 ] + '.' + valuesDate[ 1 ] + '.' + deliveryDate.getFullYear();
    //console.log($scope.global.deliveryDate);
  };


  //=============== Download Add Elements from localDB for Edit Product
  $scope.downloadAddElementsEDIT = function() {

    localDB.selectDB($scope.global.gridsTableBD, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedGrids = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.visorsTableBD, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedVisors = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.spillwaysTableBD, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedSpillways = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.outSlopesTableBD, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedOutsideSlope = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.inSlopesTableBD, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedInsideSlope = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.louversTableBD, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedLouvers = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.connectorsTableBD, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedConnectors = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.fansTableBD, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedFans = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.windowSillsTableBD, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedWindowSill = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.handlesTableBD, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedHandles = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.othersTableBD, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedOthers = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

  };


  //============== Download Product Data from localDB for Edit Product
  $scope.downloadProductEDIT = function() {
    localDB.selectDB($scope.global.productsTableBD, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        var tempProduct = angular.copy(results.data);
        $scope.global.product.constructName = tempProduct[0].templateName;
        $scope.global.product.constructionWidth = tempProduct[0].productWidth;
        $scope.global.product.constructionHeight = tempProduct[0].productHeight;
        $scope.global.product.profileName = tempProduct[0].profileName;
        $scope.global.product.glassName = tempProduct[0].glassName;
        $scope.global.product.hardwareName = tempProduct[0].hardwareName;
        $scope.global.product.laminationOuter = tempProduct[0].laminationOutName;
        $scope.global.product.laminationInner = tempProduct[0].laminationInName;
        $scope.global.product.productPrice = tempProduct[0].productPrice;
        $scope.global.product.productQty = tempProduct[0].productQty;

        $scope.global.templateSource.name = tempProduct[0].productName;
        //$scope.global.templateSource.iconUrl = tempProduct[0].productIcon;
        // change add element quantity as to product quantity
        for (var prop in $scope.global.chosenAddElements) {
          if (!$scope.global.chosenAddElements.hasOwnProperty(prop)) {
            continue;
          } else {
            if ($scope.global.chosenAddElements[prop].length > 0) {
              for (var elem = 0; elem < $scope.global.chosenAddElements[prop].length; elem++) {
                $scope.global.chosenAddElements[prop][elem].elementQty *= $scope.global.product.productQty;
              }
            }
          }
        }

      } else {
        console.log(results);
      }
    });
  };


  //=============== Download Template from localDB for Edit Product
  $scope.downloadTemplateSourceEDIT = function() {
    localDB.selectDB($scope.global.componentsTableBD, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        var tempTemplateSource = angular.copy(results.data);

        var productTemplateSource = $scope.global.parseTemplateLocalDB(tempTemplateSource, $scope.global.productEditNumber);
        productTemplateSource.name = $scope.global.product.constructName;

        $scope.global.templateDefault = new Template(productTemplateSource, $scope.global.templateDepths);
        $scope.global.product.constructThumb = new TemplateIcon(productTemplateSource, $scope.global.templateDepths);
        console.log($scope.global.templateDefault);
      } else {
        console.log(results);
      }
    });
  };

  //================== parse Template from Local DB
  $scope.global.parseTemplateLocalDB = function(tempTemplateSource, prod) {

    var productIconSource = {},
        componentsArr = [],
        itemCounter = 0;

    for (var item = 0; item < tempTemplateSource.length; item++) {
      itemCounter++;
      var componentObj = {};
      for (var it = 0; it < tempTemplateSource.length; it++) {
        if(tempTemplateSource[it].productId == prod && tempTemplateSource[it].componentsId == itemCounter) {
          if(tempTemplateSource[it].property === 'parts' || tempTemplateSource[it].property === 'openType' || tempTemplateSource[it].property === 'widths' || tempTemplateSource[it].property === 'heights') {
            var valuesArr = tempTemplateSource[it].value.split(',');
            componentObj[tempTemplateSource[it].property] = valuesArr;
          } else if(tempTemplateSource[it].property === 'from' || tempTemplateSource[it].property === 'to') {
            var valuesArr = tempTemplateSource[it].value.split(',');
            if(valuesArr.length > 1) {
              componentObj[tempTemplateSource[it].property] = valuesArr;
            } else {
              componentObj[tempTemplateSource[it].property] = valuesArr[0];
            }
          } else {
            componentObj[tempTemplateSource[it].property] = tempTemplateSource[it].value;
          }
        } else {
          continue;
        }
      }
      componentsArr.push(componentObj);
    }
    productIconSource.objects = componentsArr;
    return productIconSource;
  };




  //=============== Start download Product Data
  $scope.global.productInit = function () {

    //------ Check Product Edit
    if ($scope.global.productEditNumber && !$scope.global.isCreatedNewProject) {

      //------ Download Add Elements from localDB
      $scope.downloadAddElementsEDIT();

      //------ Download Product Data from localDB
      $scope.downloadProductEDIT();

      //------ Download Template from localDB
      $scope.downloadTemplateSourceEDIT();


    //================= Check new Product
    } else if($scope.global.isCreatedNewProject) {

      //------- create new empty product
      $scope.global.product = angular.copy($scope.global.productSource);

      //------- create order date
      $scope.createOrderDate();

      //----------- get all profiles
      $scope.downloadAllProfiles = function(results) {
          if (results) {
            $scope.global.profilesType = angular.copy(results[$scope.global.product.profileIndex].folder);
            $scope.global.profiles = angular.copy(results[$scope.global.product.profileIndex].profiles);
            $scope.global.product.profileId = $scope.global.profiles[$scope.global.product.profileIndex].id;
            //$scope.global.product.profileName = $scope.global.profiles[$scope.global.profileIndex].name;
            //$scope.global.product.profileHeatCoeff = $scope.global.profiles[$scope.global.profileIndex].heatCoeff;
            //$scope.global.product.profileAirCoeff = $scope.global.profiles[$scope.global.profileIndex].airCoeff;

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
      $scope.downloadAllTemplates = function() {
          constructService.getDefaultConstructTemplate(function (results) {
          if (results.status) {

            //-------- Save Source Templates in Store
            $scope.global.templatesWindSTORE = angular.copy(results.data.windows);
            $scope.global.templatesWindDoorSTORE = angular.copy(results.data.windowDoor);
            $scope.global.templatesBalconySTORE = angular.copy(results.data.balconies);
            $scope.global.templatesDoorSTORE = angular.copy(results.data.doors);

            //-------- Templates for use
            $scope.global.templatesWindSource = angular.copy(results.data.windows);
            $scope.global.templatesWindDoorSource = angular.copy(results.data.windowDoor);
            $scope.global.templatesBalconySource = angular.copy(results.data.balconies);
            $scope.global.templatesDoorSource = angular.copy(results.data.doors);

            $scope.global.parseTemplate($scope.global.product.profileIndex, $scope.global.product.profileId);

          } else {
            console.log(results);
          }
        });
      };

      constructService.getProfileSystem(function (results) {
        if (results.status) {
          $scope.global.product.profileHeatCoeff = results.data.heatCoeff;
          $scope.global.product.profileAirCoeff = results.data.airCoeff;
          $scope.global.product.profileName = results.data.name;
        } else {
          console.log(results);
        }
      });

      //----------- get all glasses
      constructService.getAllGlass(function (results) {
        if (results.status) {
          $scope.global.glassTypes = angular.copy(results.data.glassTypes);
          $scope.global.glasses = angular.copy(results.data.glasses);
          //----- set first current glass
          $scope.global.product.glassId = $scope.global.glasses[$scope.global.product.glassIndex][$scope.global.product.glassIndex].glassId;
          $scope.global.product.glassName = $scope.global.glasses[$scope.global.product.glassIndex][$scope.global.product.glassIndex].glassName;
          $scope.global.product.glassHeatCoeff = $scope.global.glasses[$scope.global.product.glassIndex][$scope.global.product.glassIndex].heatCoeff;
          $scope.global.product.glassAirCoeff = $scope.global.glasses[$scope.global.product.glassIndex][$scope.global.product.glassIndex].airCoeff;
        } else {
          console.log(results);
        }
      });


      //----------- get all profiles
      constructService.getAllProfileSystems().then(function (data) {
          $scope.downloadAllProfiles(data);
        }).then(function () {

          var ramaQueries = [],
              sashQueries = [],
              ramaStillQueries = [],
              impostQueries = [],
              shtulpQueries = [],
              k;

          for(k = 0; k < $scope.global.profiles.length; k++) {
            ramaQueries.push(constructService.getAllProfileSizes($scope.global.profiles[k].rama_id));
            ramaStillQueries.push(constructService.getAllProfileSizes($scope.global.profiles[k].rama_still_id));
            sashQueries.push(constructService.getAllProfileSizes($scope.global.profiles[k].sash_id));
            impostQueries.push(constructService.getAllProfileSizes($scope.global.profiles[k].impost_id));
            shtulpQueries.push(constructService.getAllProfileSizes($scope.global.profiles[k].shtulp_id));
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
            $scope.downloadAllTemplates();
          });
      });

      //----------- get all hardware
      constructService.getAllHardware(function (results) {
        if (results.status) {
          $scope.global.hardwareTypes = angular.copy(results.data.hardwaresTypes);
          $scope.global.hardwares = angular.copy(results.data.hardwares);

          //----- set first current hardware
          $scope.global.product.hardwareId = $scope.global.hardwares[$scope.global.product.hardwareIndex][$scope.global.product.hardwareIndex].hardwareId;
          $scope.global.product.hardwareName = $scope.global.hardwares[$scope.global.product.hardwareIndex][$scope.global.product.hardwareIndex].hardwareName;
          $scope.global.product.hardwareHeatCoeff = $scope.global.hardwares[$scope.global.product.hardwareIndex][$scope.global.product.hardwareIndex].heatCoeff;
          $scope.global.product.hardwareAirCoeff = $scope.global.hardwares[$scope.global.product.hardwareIndex][$scope.global.product.hardwareIndex].airCoeff;

        } else {
          console.log(results);
        }
      });

      //----------- get all lamination
      constructService.getAllLamination(function (results) {
        if (results.status) {
          $scope.global.laminationsWhite = angular.copy(results.data.laminationWhite);
          $scope.global.laminationsIn = angular.copy(results.data.laminationInside);
          $scope.global.laminationsOut = angular.copy(results.data.laminationOutside);

          //----- set first current lamination white
          $scope.global.product.laminationOutName = $scope.global.laminationsWhite;
          $scope.global.product.laminationInName = $scope.global.laminationsWhite;
        } else {
          console.log(results);
        }
      });


      //-------- Clear All AddElements in localStorage
      $scope.global.clearAllAddElements();

    }
  };





  $scope.global.parseTemplate = function(profileIndex, profileId) {
    // парсинг шаблона, расчет размеров
    $scope.global.templateDepths = {
      frameDepth: $scope.global.allProfileFrameSizes[profileIndex],
      sashDepth: $scope.global.allProfileSashSizes[profileIndex],
      impostDepth: $scope.global.allProfileImpostSizes[profileIndex],
      shtulpDepth: $scope.global.allProfileShtulpSizes[profileIndex]
    };

    for(var tem = 0; tem < $scope.global.templatesWindSource.length; tem++) {
      $scope.global.templatesWindList.push( new Template($scope.global.templatesWindSource[tem], $scope.global.templateDepths) );
      $scope.global.templatesWindIconList.push( new TemplateIcon($scope.global.templatesWindSource[tem], $scope.global.templateDepths) );
    }
    for(var tem = 0; tem < $scope.global.templatesWindDoorSource.length; tem++) {
      $scope.global.templatesWindDoorList.push( new Template($scope.global.templatesWindDoorSource[tem], $scope.global.templateDepths) );
      $scope.global.templatesWindDoorIconList.push( new TemplateIcon($scope.global.templatesWindDoorSource[tem], $scope.global.templateDepths) );
    }
    for(var tem = 0; tem < $scope.global.templatesBalconySource.length; tem++) {
      $scope.global.templatesBalconyList.push( new Template($scope.global.templatesBalconySource[tem], $scope.global.templateDepths) );
      $scope.global.templatesBalconyIconList.push( new TemplateIcon($scope.global.templatesBalconySource[tem], $scope.global.templateDepths) );
    }
    for(var tem = 0; tem < $scope.global.templatesDoorSource.length; tem++) {
      $scope.global.templatesDoorList.push( new Template($scope.global.templatesDoorSource[tem], $scope.global.templateDepths) );
      $scope.global.templatesDoorIconList.push( new TemplateIcon($scope.global.templatesDoorSource[tem], $scope.global.templateDepths) );
    }

    //-------- Save Template Arrays in Store
    //----- save first product
    if($scope.global.startProgramm) {

      //---- window
      $scope.global.templatesWindListSTORE = angular.copy($scope.global.templatesWindList);
      $scope.global.templatesWindIconListSTORE = angular.copy($scope.global.templatesWindIconList);
      //---- window-door
      $scope.global.templatesWindDoorListSTORE = angular.copy($scope.global.templatesWindDoorList);
      $scope.global.templatesWindDoorIconListSTORE = angular.copy($scope.global.templatesWindDoorIconList);
      //---- balcony
      $scope.global.templatesBalconyListSTORE = angular.copy($scope.global.templatesBalconyList);
      $scope.global.templatesBalconyIconListSTORE = angular.copy($scope.global.templatesBalconyIconList);
      //---- door
      $scope.global.templatesDoorListSTORE = angular.copy($scope.global.templatesDoorList);
      $scope.global.templatesDoorIconListSTORE = angular.copy($scope.global.templatesDoorIconList);

    }
    //------- set current template for product (Window Construction)
    $scope.global.product.templateSource = angular.copy($scope.global.templatesWindSource[$scope.global.product.templateIndex]);
    $scope.global.product.templateDefault = angular.copy($scope.global.templatesWindList[$scope.global.product.templateIndex]);
    $scope.global.product.templateIcon = angular.copy($scope.global.templatesWindIconList[$scope.global.product.templateIndex]);
    //-------- set current templates arrays
    $scope.global.getCurrentTemplates();

    $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, profileIndex, profileId, $scope.global.product.glassId);
  };


  $scope.global.getCurrentTemplates = function() {
    if($scope.global.isConstructDoor) {
      $scope.global.templatesSource = $scope.global.templatesDoorSource;
      $scope.global.templates = $scope.global.templatesDoorList;
      $scope.global.templatesIcons = $scope.global.templatesDoorIconList;
      $scope.global.templateLabel = $filter('translate')('panels.TEMPLATE_DOOR');
    } else if($scope.global.isConstructBalcony) {
      $scope.global.templatesSource = $scope.global.templatesBalconySource;
      $scope.global.templates = $scope.global.templatesBalconyList;
      $scope.global.templatesIcons = $scope.global.templatesBalconyIconList;
      $scope.global.templateLabel = $filter('translate')('panels.TEMPLATE_BALCONY');
    } else if($scope.global.isConstructWindDoor) {
      $scope.global.templatesSource = $scope.global.templatesWindDoorSource;
      $scope.global.templates = $scope.global.templatesWindDoorList;
      $scope.global.templatesIcons = $scope.global.templatesWindDoorIconList;
      $scope.global.templateLabel = $filter('translate')('panels.TEMPLATE_BALCONY_ENTER');
    } else if($scope.global.isConstructWind){
      $scope.global.templatesSource = $scope.global.templatesWindSource;
      $scope.global.templates = $scope.global.templatesWindList;
      $scope.global.templatesIcons = $scope.global.templatesWindIconList;
      $scope.global.templateLabel = $filter('translate')('panels.TEMPLATE_WINDOW');
    }
  };

  // создание объекта для отправки в базу, чтобы рассчитать цену шаблона
  $scope.global.createObjXFormedPrice = function(template, profileIndex, profileId, glassId) {
    $scope.global.objXFormedPrice = angular.copy($scope.global.objXFormedPriceSource);
    //console.log('$scope.global.objXFormedPrice');
    //console.log($scope.global.objXFormedPrice);
    for (var item = 0; item < template.objects.length; item++) {
      var elementSize;
      if (template.objects[item].type) {
        switch (template.objects[item].type) {
          case 'frame_line':
            elementSize = template.objects[item].lengthVal;
            $scope.global.objXFormedPrice.framesSize.push(elementSize);
            if (template.objects[item].sill) {
              $scope.global.objXFormedPrice.frameSillSize = template.objects[item].lengthVal;
            }
            break;
          case 'impost':
            elementSize = template.objects[item].parts[0].lengthVal;
            $scope.global.objXFormedPrice.impostsSize.push(elementSize);
            break;
          case 'sash':
            elementSize = template.objects[item].parts[0].lengthVal;
            $scope.global.objXFormedPrice.sashsSize.push(elementSize);
            break;
          case 'bead_box_line':
            elementSize = template.objects[item].lengthVal;
            $scope.global.objXFormedPrice.beadsSize.push(elementSize);
            break;
          case 'glass_paсkage':
            var tempGlassSizes = [];
            for (var glass = 0; glass < template.objects[item].parts.length; glass++) {
              tempGlassSizes.push(template.objects[item].parts[glass].lengthVal);
            }
            $scope.global.objXFormedPrice.glassSizes.push(tempGlassSizes);
            $scope.global.objXFormedPrice.glassSquares.push(template.objects[item].square);
            break;
          case 'dimensionsH':
            $scope.global.product.templateWidth = template.objects[item].lengthVal;
            break;
          case 'dimensionsV':
            $scope.global.product.templateHeight = template.objects[item].lengthVal;
            break;
        }
      }
    }

    $scope.global.objXFormedPrice.cityId = $scope.global.userInfo.city_id;
    $scope.global.objXFormedPrice.glassId = glassId;
    $scope.global.objXFormedPrice.profileId = profileId;
    $scope.global.objXFormedPrice.frameId = $scope.global.allProfileFrameSizes[profileIndex].id;
    $scope.global.objXFormedPrice.frameSillId = $scope.global.allProfileFrameStillSizes[profileIndex].id;
    $scope.global.objXFormedPrice.sashId = $scope.global.allProfileSashSizes[profileIndex].id;
    $scope.global.objXFormedPrice.impostId = $scope.global.allProfileImpostSizes[profileIndex].id;
    $scope.global.objXFormedPrice.shtulpId = $scope.global.allProfileShtulpSizes[profileIndex].id;


    //console.log(JSON.stringify($scope.global.objXFormedPrice));

    //------ calculate coeffs
    $scope.global.calculateCoeffs();

    //--------- get product default price
    globalDB.calculationPrice($scope.global.objXFormedPrice, function (result) {
      if(result.status){

        //console.log('price');
        //console.log(result.data);
        $scope.global.product.templatePriceSELECT = parseFloat(angular.copy(result.data.price));
        $scope.global.setProductPriceTOTAL();
        $scope.$apply();
        var currencySymbol = '';
        if (result.data.currentCurrency.name === 'uah') {
          currencySymbol = '₴';
        }
        $scope.global.currency = currencySymbol;
        $scope.global.isFindPriceProcess = false;

        //========== save first product
        //if($scope.global.startProgramm) {
          //$scope.global.productSource = angular.copy($scope.global.product);
          //console.log($scope.global.product);
        //}
/*
        if($scope.global.isReturnFromDiffPage) {
          if($scope.global.isHistoryPage) {
            $scope.global.initTemplates();
            $scope.global.isHistoryPage = false;
          } else {
            $scope.global.createNewProduct();
          }
          $scope.global.isReturnFromDiffPage = false;
        }
*/
      } else {
        console.log(result);
      }
    });



  };

  $scope.global.setProductPriceTOTAL = function() {
    $scope.global.product.productPriceTOTAL = $scope.global.product.templatePriceSELECT + $scope.global.product.hardwarePriceSELECT + $scope.global.product.laminationPriceSELECT + $scope.global.product.addElementsPriceSELECT;
    $scope.$apply();
  };
  $scope.global.setProductPriceTOTALapply = function() {
    $scope.global.product.productPriceTOTAL = $scope.global.product.templatePriceSELECT + $scope.global.product.hardwarePriceSELECT + $scope.global.product.laminationPriceSELECT + $scope.global.product.addElementsPriceSELECT;
  };


  //---------- Coeffs define
  $scope.global.calculateCoeffs = function() {
    var constructionSquareTotal,
        glassSquareTotal,
        prifileHeatCoeffTotal,
        glassHeatCoeffTotal,
        item;
    //------- total construction square define
    for (item = 0; item < $scope.global.product.templateDefault.objects.length; item++) {
      if($scope.global.product.templateDefault.objects[item].type === "square") {
        constructionSquareTotal = $scope.global.product.templateDefault.objects[item].squares.reduce(function(a, b) {
          return a + b;
        });
      }
    }
    //-------- total glasses square define
    glassSquareTotal = $scope.global.objXFormedPrice.glassSquares.reduce(function(a, b) {
      return a + b;
    });
    //-------- coeffs define
    prifileHeatCoeffTotal = $scope.global.product.profileHeatCoeff * (constructionSquareTotal - glassSquareTotal);
    glassHeatCoeffTotal = $scope.global.product.glassHeatCoeff * glassSquareTotal;
    //-------- calculate Heat Coeff Total
    $scope.global.product.heatTransferTOTAL = parseFloat(((prifileHeatCoeffTotal + glassHeatCoeffTotal)/constructionSquareTotal).toFixed(2));

    //-------- calculate Air Coeff Total
    $scope.global.product.airCirculationTOTAL = + $scope.global.product.profileAirCoeff + $scope.global.product.glassAirCoeff + $scope.global.product.hardwareAirCoeff;

  };





  //-------- Clear All AddElements in localStorage
  $scope.global.clearAllAddElements = function() {
    for (var prop in $scope.global.product.chosenAddElements) {
      if (!$scope.global.product.chosenAddElements.hasOwnProperty(prop)) {
        continue;
      } else {
        $scope.global.product.chosenAddElements[prop].length = 0;
      }
    }
  };





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
    $scope.global.isFocusedAddElement = false;
    $scope.global.isTabFrame = false;
    $scope.global.showAddElementsMenu = false;
    $scope.global.desactiveAddElementParameters();
  };

  // Close all panels
  function clearShowPanelsObj() {
    for (var item in $scope.global.showPanels) {
      delete $scope.global.showPanels[item];
    }
    //---- close Scheme Dialog in AddElements
    $scope.global.isWindowSchemeDialog = false;
  }









  // Save Product in Order and enter in Cart
  $scope.global.inputProductInOrder = function() {

    var productData,
        productIndex,
        addElementsData = {},
        addElementsObj = $scope.global.product.chosenAddElements;

    //=========== if no EDIT product
    if (!$scope.global.productEditNumber) {

      //-------- add product in order LocalStorage
      $scope.global.order.products.push($scope.global.product);
      productIndex = $scope.global.order.products.length;
 /*
      //-------- get product quantity
      if ($scope.global.order.products.length > 0) {
        ++$scope.global.productCounter;
      } else {
        $scope.global.productCounter = 1;
      }
*/

      //-------- insert product into local DB
      productData = {
        "orderId": $scope.global.order.orderId,
        "productId": productIndex,
        "addElementsOnly": $scope.global.product.isAddElementsONLY,
        "roomId": $scope.global.product.selectedRoomId,
        "heatCoeff": $scope.global.product.heatTransferTOTAL,
        "airCoeff": $scope.global.product.airCirculationTOTAL,

        "templateIndex": $scope.global.product.templateIndex,
        'templateName': $scope.global.product.templateSource.name,
        "templateWidth": $scope.global.product.templateWidth,
        "templateHeight": $scope.global.product.templateHeight,
        "templateSource": JSON.stringify($scope.global.product.templateSource),

        "profileTypeIndex": $scope.global.product.profileTypeIndex,
        "profileIndex": $scope.global.product.profileIndex,
        "profileId": $scope.global.product.profileId,
        "profileName": $scope.global.product.profileName,
        "profileHeatCoeff": $scope.global.product.profileHeatCoeff,
        "profileAirCoeff": $scope.global.product.profileAirCoeff,

        "glassTypeIndex": $scope.global.product.glassTypeIndex,
        "glassIndex": $scope.global.product.glassIndex,
        "glassId": $scope.global.product.glassId,
        "glassName": $scope.global.product.glassName,
        "glassHeatCoeff": $scope.global.product.glassHeatCoeff,
        "glassAirCoeff": $scope.global.product.glassAirCoeff,

        "hardwareTypeIndex": $scope.global.product.hardwareTypeIndex,
        "hardwareIndex": $scope.global.product.hardwareIndex,
        "hardwareId": $scope.global.product.hardwareId,
        "hardwareName": $scope.global.product.hardwareName,
        "hardwareHeatCoeff": $scope.global.product.hardwareHeatCoeff,
        "hardwareAirCoeff": $scope.global.product.hardwareAirCoeff,

        "laminationOutIndex": $scope.global.product.laminationOutIndex,
        "laminationOutName": $scope.global.product.laminationOutName,
        "laminationOutPrice": parseFloat($scope.global.product.laminationOutPrice.toFixed(2)),
        "laminationInIndex": $scope.global.product.laminationInnerId,
        "laminationInName": $scope.global.product.laminationInName,
        "laminationInPrice": parseFloat($scope.global.product.laminationInPrice.toFixed(2)),

        "templatePrice": parseFloat($scope.global.product.templatePriceSELECT.toFixed(2)),
        "hardwarePrice": parseFloat($scope.global.product.hardwarePriceSELECT.toFixed(2)),
        "laminationPrice": parseFloat($scope.global.product.laminationPriceSELECT.toFixed(2)),
        "addElementsPrice": parseFloat($scope.global.product.addElementsPriceSELECT.toFixed(2)),
        "productPriceTOTAL": parseFloat($scope.global.product.productPriceTOTAL.toFixed(2)),
        "productQty": 1
      };

      localDB.insertDB($scope.global.productsTableBD, productData);


      //--------- insert additional elements into local DB
      for(var prop in addElementsObj) {
        if (!addElementsObj.hasOwnProperty(prop)) {
          continue;
        }
        for (var elem = 0; elem < addElementsObj[prop].length; elem++) {

          switch (prop) {

            case 'selectedGrids':
              addElementsData = {
                "orderId": $scope.global.order.orderId,
                "productId": productIndex,
                "elementId": addElementsObj[prop][elem].elementId,
                "elementType": addElementsObj[prop][elem].elementType,
                "elementName": addElementsObj[prop][elem].elementName,
                "elementQty": addElementsObj[prop][elem].elementQty,
                //"elementWidth": addElementsObj[prop][elem].elementWidth,
                "elementPrice": addElementsObj[prop][elem].elementPrice
              };
              localDB.insertDB($scope.global.gridsTableBD, addElementsData);
              break;

            case 'selectedVisors':
              addElementsData = {
                "orderId": $scope.global.order.orderId,
                "productId": productIndex,
                "elementId": addElementsObj[prop][elem].elementId,
                "elementType": addElementsObj[prop][elem].elementType,
                "elementName": addElementsObj[prop][elem].elementName,
                "elementQty": addElementsObj[prop][elem].elementQty,
                "elementWidth": addElementsObj[prop][elem].elementWidth,
                "elementPrice": addElementsObj[prop][elem].elementPrice
              };
              localDB.insertDB($scope.global.visorsTableBD, addElementsData);
              break;

            case 'selectedSpillways':
              addElementsData = {
                "orderId": $scope.global.order.orderId,
                "productId": productIndex,
                "elementId": addElementsObj[prop][elem].elementId,
                "elementType": addElementsObj[prop][elem].elementType,
                "elementName": addElementsObj[prop][elem].elementName,
                "elementQty": addElementsObj[prop][elem].elementQty,
                "elementWidth": addElementsObj[prop][elem].elementWidth,
                "elementPrice": addElementsObj[prop][elem].elementPrice
              };
              localDB.insertDB($scope.global.spillwaysTableBD, addElementsData);
              break;

            case 'selectedOutsideSlope':
              addElementsData = {
                "orderId": $scope.global.order.orderId,
                "productId": productIndex,
                "elementId": addElementsObj[prop][elem].elementId,
                "elementType": addElementsObj[prop][elem].elementType,
                "elementName": addElementsObj[prop][elem].elementName,
                "elementQty": addElementsObj[prop][elem].elementQty,
                "elementWidth": addElementsObj[prop][elem].elementWidth,
                "elementPrice": addElementsObj[prop][elem].elementPrice
              };
              localDB.insertDB($scope.global.outSlopesTableBD, addElementsData);
              break;

            case 'selectedInsideSlope':
              addElementsData = {
                "orderId": $scope.global.order.orderId,
                "productId": productIndex,
                "elementId": addElementsObj[prop][elem].elementId,
                "elementType": addElementsObj[prop][elem].elementType,
                "elementName": addElementsObj[prop][elem].elementName,
                "elementQty": addElementsObj[prop][elem].elementQty,
                "elementWidth": addElementsObj[prop][elem].elementWidth,
                "elementPrice": addElementsObj[prop][elem].elementPrice
              };
              localDB.insertDB($scope.global.inSlopesTableBD, addElementsData);
              break;

            case 'selectedLouvers':
              addElementsData = {
                "orderId": $scope.global.order.orderId,
                "productId": productIndex,
                "elementId": addElementsObj[prop][elem].elementId,
                "elementType": addElementsObj[prop][elem].elementType,
                "elementName": addElementsObj[prop][elem].elementName,
                "elementQty": addElementsObj[prop][elem].elementQty,
                "elementWidth": addElementsObj[prop][elem].elementWidth,
                "elementHeight": addElementsObj[prop][elem].elementHeight,
                "elementPrice": addElementsObj[prop][elem].elementPrice
              };
              localDB.insertDB($scope.global.louversTableBD, addElementsData);
              break;

            case 'selectedConnectors':
              addElementsData = {
                "orderId": $scope.global.order.orderId,
                "productId": productIndex,
                "elementId": addElementsObj[prop][elem].elementId,
                "elementType": addElementsObj[prop][elem].elementType,
                "elementName": addElementsObj[prop][elem].elementName,
                "elementQty": addElementsObj[prop][elem].elementQty,
                "elementWidth": addElementsObj[prop][elem].elementWidth,
                "elementPrice": addElementsObj[prop][elem].elementPrice
              };
              localDB.insertDB($scope.global.connectorsTableBD, addElementsData);
              break;

            case 'selectedFans':
              addElementsData = {
                "orderId": $scope.global.order.orderId,
                "productId": productIndex,
                "elementId": addElementsObj[prop][elem].elementId,
                "elementType": addElementsObj[prop][elem].elementType,
                "elementName": addElementsObj[prop][elem].elementName,
                "elementQty": addElementsObj[prop][elem].elementQty,
                "elementPrice": addElementsObj[prop][elem].elementPrice
              };
              localDB.insertDB($scope.global.fansTableBD, addElementsData);
              break;

            case 'selectedWindowSill':
              addElementsData = {
                "orderId": $scope.global.order.orderId,
                "productId": productIndex,
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

            case 'selectedHandles':
              addElementsData = {
                "orderId": $scope.global.order.orderId,
                "productId": productIndex,
                "elementId": addElementsObj[prop][elem].elementId,
                "elementType": addElementsObj[prop][elem].elementType,
                "elementName": addElementsObj[prop][elem].elementName,
                "elementQty": addElementsObj[prop][elem].elementQty,
                "elementPrice": addElementsObj[prop][elem].elementPrice
              };
              localDB.insertDB($scope.global.handlesTableBD, addElementsData);
              break;

            case 'selectedOthers':
              addElementsData = {
                "orderId": $scope.global.order.orderId,
                "productId": productIndex,
                "elementId": addElementsObj[prop][elem].elementId,
                "elementType": addElementsObj[prop][elem].elementType,
                "elementName": addElementsObj[prop][elem].elementName,
                "elementQty": addElementsObj[prop][elem].elementQty,
                "elementPrice": addElementsObj[prop][elem].elementPrice
              };
              localDB.insertDB($scope.global.othersTableBD, addElementsData);
              break;

          }
        }
      }

    } else {
      //-------- replace product in order LocalStorage
      for(var prod = 0; prod < $scope.global.order.products.length; prod++) {
        if(prod === $scope.global.productEditNumber) {
          $scope.global.order.products[prod] = angular.copy($scope.global.product);
        }
      }

    }

  };


  //--------- moving to Cart when click on Cart button
  $scope.movetoCart = function() {
    $timeout(function(){
      $scope.global.gotoCartPage();
    }, 18*STEP);
  };

  /*
   //--------- insert construction into local DB
   templateData = {
   "orderId": $scope.global.order.orderId,
   "productId": productIndex,
   "template": JSON.stringify($scope.global.product.templateSource)
   };
   localDB.insertDB($scope.global.componentsTableBD, templateData);


   var componentCount = 1;
   for(var part = 0; part < $scope.global.product.templateSource.objects.length; part++) {
   for(var prop in $scope.global.product.templateSource.objects[part]) {
   if (!$scope.global.product.templateSource.objects[part].hasOwnProperty(prop)) {
   continue;
   } else {
   constructionData = {
   "orderId": $scope.global.order.orderId,
   "productId": productIndex,
   "componentsId": componentCount,
   "property": prop,
   "value": $scope.global.product.templateSource.objects[part][prop]
   };
   localDB.insertDB($scope.global.componentsTableBD, constructionData);
   }
   }
   componentCount++;
   }
   */

  $scope.global.productInit();

}]);