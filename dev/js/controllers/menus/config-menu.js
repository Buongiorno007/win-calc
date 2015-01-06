/* globals BauVoiceApp, STEP, typingTextByChar, Template, TemplateIcon, drawSVG, parsingTemplateSource */

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

  $scope.global.isOpenedCartPage = false;
  $scope.global.isOpenedHistoryPage = false;


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
  $scope.global.createOrderData = function() {
    var deliveryDate = new Date(),
        valuesDate,
        idDate;

    //----------- create order number for new project
    $scope.global.order.orderId = Math.floor((Math.random() * 100000));

    //------ set delivery day
    deliveryDate.setDate( $scope.global.currentDate.getDate() + $scope.global.productionDays );
    valuesDate = [
      deliveryDate.getDate(),
      deliveryDate.getMonth() + 1
    ];
    for(idDate in valuesDate) {
      valuesDate[ idDate ] = valuesDate[ idDate ].toString().replace( /^([0-9])$/, '0$1' );
    }

    $scope.global.order.deliveryDate = valuesDate[ 0 ] + '.' + valuesDate[ 1 ] + '.' + deliveryDate.getFullYear();
    $scope.global.order.newDeliveryDate = $scope.global.order.deliveryDate;
  };


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

    //-------- set current templates arrays
    $scope.global.getCurrentTemplates();
    //------- set current template for product
    $scope.global.saveNewTemplateInProduct($scope.global.product.templateIndex);

    $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, profileIndex, profileId, $scope.global.product.glassId);
  };


  $scope.global.saveNewTemplateInProduct = function(templateIndex) {
    $scope.global.product.templateSource = angular.copy($scope.global.templatesSource[templateIndex]);
    $scope.global.product.templateDefault = angular.copy($scope.global.templates[templateIndex]);
    $scope.global.product.templateIcon = angular.copy($scope.global.templatesIcons[templateIndex]);
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
    //------ define Bead Id for define template price
    localDB.selectDBGlobal($scope.global.listsTableDBGlobal, {'id': glassId }, function (results) {
      if (results.status) {
        var parentId = results.data[0].parent_element_id;
        //------ find glass depth
        localDB.selectDBGlobal($scope.global.elementsTableDBGlobal, {'id': parentId }, function (results) {
          if (results.status) {
            var glassDepth = results.data[0].glass_width;
            //------ find bead Id as to glass Depth and profile Id
            localDB.selectDBGlobal($scope.global.beadsTableDBGlobal, {'profile_system_id': {"value": profileId, "union": 'AND'}, "glass_width": glassDepth}, function (results) {
              if (results.status) {
                $scope.global.product.beadId = results.data[0].list_id;
                //console.log($scope.global.product.beadId);


                $scope.global.objXFormedPrice = angular.copy($scope.global.objXFormedPriceSource);
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
                      case 'bead_line':
                        elementSize = template.objects[item].lengthVal;
                        $scope.global.objXFormedPrice.beadsSize.push(elementSize);
                        break;
                      case 'sash_block':
                        var tempSashBlock = {},
                            tempSashBlockSize = [];
                        for (var sash = 0; sash < template.objects[item].parts.length; sash++) {
                          tempSashBlockSize.push(template.objects[item].parts[sash].lengthVal);
                        }
                        tempSashBlock.sizes = tempSashBlockSize;
                        tempSashBlock.hardwareId = template.objects[item].hardwareId;
                        tempSashBlock.openDir = template.objects[item].openDir;
                        tempSashBlock.handlePos = template.objects[item].handlePos;
                        $scope.global.objXFormedPrice.sashesBlock.push(tempSashBlock);
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
                $scope.global.objXFormedPrice.beadId = $scope.global.product.beadId;

                //console.log(JSON.stringify($scope.global.objXFormedPrice));
                console.log($scope.global.objXFormedPrice);

                //------ calculate coeffs
                $scope.global.calculateCoeffs();

                //--------- get product default price
                globalDB.calculationPrice($scope.global.objXFormedPrice, function (result) {
                  if(result.status){

                    //console.log('price');
                    //console.log(result.data);
                    $scope.global.product.templatePriceSELECT = parseFloat(angular.copy(result.data.price));
                    $scope.global.setProductPriceTOTAL();
                    var currencySymbol = '';
                    if (result.data.currentCurrency.name === 'uah') {
                      currencySymbol = '₴';
                    }
                    $scope.global.currency = currencySymbol;
                    $scope.global.isFindPriceProcess = false;

                  } else {
                    console.log(result);
                  }
                });



              } else {
                console.log(results);
              }
            });
          } else {
            console.log(results);
          }
        });
      } else {
        console.log(results);
      }
    });

  };

  $scope.global.setProductPriceTOTAL = function() {
    $scope.global.product.productPriceTOTAL = $scope.global.product.templatePriceSELECT + $scope.global.product.hardwarePriceSELECT + $scope.global.product.laminationPriceSELECT + $scope.global.product.addElementsPriceSELECT;
    //------- после первой загрузки создается дефолтный объект
    if($scope.global.startProgramm) {
      //-------- create default product in localStorage
      $scope.global.productDefault = angular.copy($scope.global.product);
      //console.log('productDefault', $scope.global.productDefault);
    }
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

  $scope.global.setTemplatesFromSTORE = function() {
    if($scope.global.isConstructDoor) {
      $scope.global.templatesDoorSource = angular.copy($scope.global.templatesDoorSTORE);
      $scope.global.templatesDoorList = angular.copy($scope.global.templatesDoorListSTORE);
      $scope.global.templatesDoorIconList = angular.copy($scope.global.templatesDoorIconListSTORE);
    } else if($scope.global.isConstructBalcony) {
      $scope.global.templatesBalconySource = angular.copy($scope.global.templatesBalconySTORE);
      $scope.global.templatesBalconyList = angular.copy($scope.global.templatesBalconyListSTORE);
      $scope.global.templatesBalconyIconList = angular.copy($scope.global.templatesBalconyIconListSTORE);
    } else if($scope.global.isConstructWindDoor) {
      $scope.global.templatesWindDoorSource = angular.copy($scope.global.templatesWindDoorSTORE);
      $scope.global.templatesWindDoorList = angular.copy($scope.global.templatesWindDoorListSTORE);
      $scope.global.templatesWindDoorIconList = angular.copy($scope.global.templatesWindDoorIconListSTORE);
    } else if($scope.global.isConstructWind){
      $scope.global.templatesWindSource = angular.copy($scope.global.templatesWindSTORE);
      $scope.global.templatesWindList = angular.copy($scope.global.templatesWindListSTORE);
      $scope.global.templatesWindIconList = angular.copy($scope.global.templatesWindIconListSTORE);
    }
  };









  //================ EDIT PRODUCT =================

  if ($scope.global.productEditNumber !== '' && !$scope.global.isCreatedNewProject && !$scope.global.isCreatedNewProduct) {
    $scope.global.product = angular.copy($scope.global.order.products[$scope.global.productEditNumber]);
    //TODO templates!!!!!
  }





  //=============== FIRST START create Product =========

  if($scope.global.startProgramm && $scope.global.isCreatedNewProject && $scope.global.isCreatedNewProduct) {
console.log('FIRST START!!!!!!!!!!');
    //------- create new empty product
    $scope.global.product = angular.copy($scope.global.productSource);
    //------- create new empty order
    $scope.global.order = angular.copy($scope.global.orderSource);

    //------- create order date
    $scope.global.createOrderData();


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

  }



  //=============== CREATE NEW PROJECT =========
  $scope.global.createNewProject = function() {
    if(!$scope.global.startProgramm && $scope.global.isCreatedNewProject && $scope.global.isCreatedNewProduct && !$scope.global.isReturnFromDiffPage) {
      //------- create new empty product
      $scope.global.product = angular.copy($scope.global.productDefault);
      //------- create new empty order
      $scope.global.order = angular.copy($scope.global.orderSource);

      $scope.global.isConstructWind = true;
      $scope.global.isConstructWindDoor = false;
      $scope.global.isConstructBalcony = false;
      $scope.global.isConstructDoor = false;
      //------- get templates from STORE
      $scope.global.setTemplatesFromSTORE();
      //-------- set current templates arrays
      $scope.global.getCurrentTemplates();

      //------- create order date
      console.log('new project!!!!!!!!!!!!!!');
      console.log('product ====== ', $scope.global.product);
      console.log('order ====== ', $scope.global.order);
      $scope.global.createOrderData();
    }
  };




  //=============== CREATE NEW PRODUCT =========
  $scope.global.createNewProduct = function() {
    if (!$scope.global.startProgramm && !$scope.global.isCreatedNewProject && $scope.global.isCreatedNewProduct && !$scope.global.isReturnFromDiffPage) {
      //------- create new empty product
      $scope.global.product = angular.copy($scope.global.productDefault);
      //------- get templates from STORE
      $scope.global.setTemplatesFromSTORE();
      //-------- set current templates arrays
      $scope.global.getCurrentTemplates();
      console.log('new product!!!!!!!!!!!!!!!');
      console.log('product ====== ', $scope.global.product);
      console.log('order ====== ', $scope.global.order);
    }
  };


  $scope.global.createNewProject();

  $scope.global.createNewProduct();


  //console.log('main page!!!!!!!!!!!!!!!');
  //console.log('product ====== ', $scope.global.product);
  //console.log('order ====== ', $scope.global.order);




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







  $scope.global.insertProductInLocalDB = function(orderID, productID, product) {

    var productData = angular.copy(product),
        productIndex = productID,
        addElementsData = {},
        addElementsObj = product.chosenAddElements;

    //-------- insert product into local DB
    productData.orderId = orderID;
    productData.productId = productIndex;
    productData.templateSource = JSON.stringify(product.templateSource);
    productData.laminationOutPrice = parseFloat(product.laminationOutPrice.toFixed(2));
    productData.laminationInPrice = parseFloat(product.laminationInPrice.toFixed(2));
    productData.templatePriceSELECT = parseFloat(product.templatePriceSELECT.toFixed(2));
    productData.hardwarePriceSELECT = parseFloat(product.hardwarePriceSELECT.toFixed(2));
    productData.laminationPriceSELECT = parseFloat(product.laminationPriceSELECT.toFixed(2));
    productData.addElementsPriceSELECT = parseFloat(product.addElementsPriceSELECT.toFixed(2));
    productData.productPriceTOTAL = parseFloat(product.productPriceTOTAL.toFixed(2));
    delete productData.templateDefault;
    delete productData.templateIcon;
    delete productData.chosenAddElements;

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
              "orderId": orderID,
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
              "orderId": orderID,
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
              "orderId": orderID,
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
              "orderId": orderID,
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
              "orderId": orderID,
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
              "orderId": orderID,
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
              "orderId": orderID,
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
              "orderId": orderID,
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
              "orderId": orderID,
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
              "orderId": orderID,
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
              "orderId": orderID,
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
  };


  // Save Product in Order and enter in Cart
  $scope.global.inputProductInOrder = function() {

    //=========== if no EDIT product
    if ($scope.global.productEditNumber === '') {

      //-------- add product in order LocalStorage
      $scope.global.order.products.push($scope.global.product);

      $scope.global.insertProductInLocalDB($scope.global.order.orderId, $scope.global.order.products.length, $scope.global.product);

    } else {
      //-------- replace product in order LocalStorage
      for(var prod = 0; prod < $scope.global.order.products.length; prod++) {
        if(prod === $scope.global.productEditNumber) {
          $scope.global.order.products[prod] = angular.copy($scope.global.product);
        }
      }

    }

    $scope.global.isCreatedNewProject = false;
    $scope.global.isCreatedNewProduct = false;

  };


  //--------- moving to Cart when click on Cart button
  $scope.movetoCart = function() {
    $timeout(function(){
      $scope.global.gotoCartPage();
    }, 2*STEP);
  };

}]);