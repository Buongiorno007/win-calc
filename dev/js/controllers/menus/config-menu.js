/* globals BauVoiceApp, STEP, typingTextByChar, Template, TemplateIcon, drawSVG */

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
    var productionDays = 15,
        deliveryDate = new Date(),
        valuesDate,
        idDate;

    //------ set delivery day
    deliveryDate.setDate( $scope.global.currentDate.getDate() + productionDays );
    valuesDate = [
      deliveryDate.getDate(),
      deliveryDate.getMonth() + 1
    ];
    for(idDate in valuesDate) {
      valuesDate[ idDate ] = valuesDate[ idDate ].toString().replace( /^([0-9])$/, '0$1' );
    }
    $scope.global.deliveryDate = valuesDate[ 0 ] + '.' + valuesDate[ 1 ] + '.' + deliveryDate.getFullYear();
    $scope.global.newDeliveryDate = $scope.global.deliveryDate;
  };


  //=============== Download Add Elements from localDB for Edit Product
  $scope.downloadAddElementsEDIT = function() {

    localDB.selectDB($scope.global.gridsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedGrids = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.visorsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedVisors = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.spillwaysTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedSpillways = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.outSlopesTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedOutsideSlope = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.inSlopesTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedInsideSlope = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.louversTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedLouvers = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.connectorsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedConnectors = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.fansTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedFans = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.windowSillsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedWindowSill = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.handlesTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedHandles = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

    localDB.selectDB($scope.global.othersTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
      if (results.status) {
        $scope.global.chosenAddElements.selectedOthers = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });

  };


  //============== Download Product Data from localDB for Edit Product
  $scope.downloadProductEDIT = function() {
    localDB.selectDB($scope.global.productsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
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
    localDB.selectDB($scope.global.componentsTableBD, {'orderId': {"value": $scope.global.orderNumber, "union": 'AND'}, 'productId': $scope.global.productEditNumber}, function (results) {
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

      //------- create order date
      $scope.createOrderDate();

      //----------- get all profiles
      $scope.downloadAllProfiles = function(results) {
          if (results) {
            $scope.global.product.producers = results[0].folder;
            $scope.global.product.profiles = results[0].profiles;
            $scope.global.product.profileId = $scope.global.product.profiles[$scope.global.profileIndex].id;
            //$scope.global.product.profileName = $scope.global.product.profiles[$scope.global.profileIndex].name;

            //$scope.global.product.profileHeatCoeff = $scope.global.product.profiles[$scope.global.profileIndex].heatCoeff;
            //$scope.global.product.profileAirCoeff = $scope.global.product.profiles[$scope.global.profileIndex].airCoeff;
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


            $scope.global.parseTemplate($scope.global.profileIndex, $scope.global.product.profileId);

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
      constructService.getGlass(function (results) {
        if (results.status) {
          $scope.global.product.glassId = results.data.id;
          $scope.global.product.glassName = results.data.name;
          $scope.global.product.glassHeatCoeff = results.data.heatCoeff;
          $scope.global.product.glassAirCoeff = results.data.airCoeff;
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
            $scope.downloadAllTemplates();
          });
      });

      //----------- get all hardware
      constructService.getWindowHardware(function (results) {
        if (results.status) {
          $scope.global.product.hardwareId = results.data.id;
          $scope.global.product.hardwareName = results.data.name;
        } else {
          console.log(results);
        }
      });

      //----------- get all lamination
      constructService.getLamination(function (results) {
        if (results.status) {
          $scope.global.product.laminationOuterId = results.data.outer.id;
          $scope.global.product.laminationOuter = results.data.outer.name;
          $scope.global.product.laminationInnerId = results.data.inner.id;
          $scope.global.product.laminationInner = results.data.inner.name;
        } else {
          console.log(results);
        }
      });
/*
      //--------- get product default price
      constructService.getPrice(function (results) {
        if (results.status) {
          $scope.global.product.productPrice = results.data.price;

          var currencySymbol = '';
          if (results.data.currency.name === 'uah') {
            currencySymbol = '₴';
          }
          $scope.global.currency = currencySymbol;
        } else {
          console.log(results);
        }
      });
*/
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
      $scope.global.templatesWindThumbList.push( new TemplateIcon($scope.global.templatesWindSource[tem], $scope.global.templateDepths) );
    }
    for(var tem = 0; tem < $scope.global.templatesWindDoorSource.length; tem++) {
      $scope.global.templatesWindDoorList.push( new Template($scope.global.templatesWindDoorSource[tem], $scope.global.templateDepths) );
      $scope.global.templatesWindDoorThumbList.push( new TemplateIcon($scope.global.templatesWindDoorSource[tem], $scope.global.templateDepths) );
    }
    for(var tem = 0; tem < $scope.global.templatesBalconySource.length; tem++) {
      $scope.global.templatesBalconyList.push( new Template($scope.global.templatesBalconySource[tem], $scope.global.templateDepths) );
      $scope.global.templatesBalconyThumbList.push( new TemplateIcon($scope.global.templatesBalconySource[tem], $scope.global.templateDepths) );
    }
    for(var tem = 0; tem < $scope.global.templatesDoorSource.length; tem++) {
      $scope.global.templatesDoorList.push( new Template($scope.global.templatesDoorSource[tem], $scope.global.templateDepths) );
      $scope.global.templatesDoorThumbList.push( new TemplateIcon($scope.global.templatesDoorSource[tem], $scope.global.templateDepths) );
    }

    //-------- Save Template Arrays in Store
      //---- window
    $scope.global.templatesWindListSTORE = angular.copy($scope.global.templatesWindList);
    $scope.global.templatesWindThumbListSTORE = angular.copy($scope.global.templatesWindThumbList);
      //---- window-door
    $scope.global.templatesWindDoorListSTORE = angular.copy($scope.global.templatesWindDoorList);
    $scope.global.templatesWindDoorThumbListSTORE = angular.copy($scope.global.templatesWindDoorThumbList);
      //---- balcony
    $scope.global.templatesBalconyListSTORE = angular.copy($scope.global.templatesBalconyList);
    $scope.global.templatesBalconyThumbListSTORE = angular.copy($scope.global.templatesBalconyThumbList);
      //---- door
    $scope.global.templatesDoorListSTORE = angular.copy($scope.global.templatesDoorList);
    $scope.global.templatesDoorThumbListSTORE = angular.copy($scope.global.templatesDoorThumbList);

    //------- first of all default select Window Construction
    $scope.global.templateSource = angular.copy($scope.global.templatesWindSource[$scope.global.templateIndex]);
    $scope.global.templateDefault = angular.copy($scope.global.templatesWindList[$scope.global.templateIndex]);
    $scope.global.product.constructThumb = angular.copy($scope.global.templatesWindThumbList[$scope.global.templateIndex]);

    $scope.global.createObjXFormedPrice($scope.global.templateDefault, profileIndex, profileId, $scope.global.product.glassId);
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
          case 'sash_line':
            elementSize = template.objects[item].lengthVal;
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
            $scope.global.product.constructionWidth = template.objects[item].lengthVal;
            break;
          case 'dimensionsV':
            $scope.global.product.constructionHeight = template.objects[item].lengthVal;
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

    //console.log($scope.global.objXFormedPrice);

    //------ calculate coeffs
    $scope.global.calculateCoeffs();

    //--------- get product default price
    globalDB.calculationPrice($scope.global.objXFormedPrice, function (result) {
      if(result.status){
        //console.log('price');
        //console.log(result.data);
        $scope.global.constructionPriceTOTAL = parseFloat(angular.copy(result.data.price));
        $scope.global.setProductPriceTOTAL();
        $scope.$apply();
        var currencySymbol = '';
        if (result.data.currentCurrency.name === 'uah') {
          currencySymbol = '₴';
        }
        $scope.global.currency = currencySymbol;
        $scope.global.isFindPriceProcess = false;

        if($scope.global.isReturnFromDiffPage) {
          if($scope.global.isHistoryPage) {
            $scope.global.initTemplates();
            $scope.global.isHistoryPage = false;
          } else {
            $scope.global.createNewProduct();
          }
          $scope.global.isReturnFromDiffPage = false;
        }

      } else {
        console.log(result);
      }
    });




  };

  $scope.global.setProductPriceTOTAL = function() {
    $scope.global.product.productPrice = $scope.global.constructionPriceTOTAL + $scope.global.hardwarePriceTOTAL + $scope.global.laminationPriceTOTAL + $scope.global.addElementsPriceTOTAL;
    //$scope.$apply();
  };


  //---------- Coeffs define
  $scope.global.calculateCoeffs = function() {
    var constructionSquareTotal,
        glassSquareTotal,
        prifileHeatCoeffTotal,
        glassHeatCoeffTotal,
        item;
    //------- total construction square define
    for (item = 0; item < $scope.global.templateDefault.objects.length; item++) {
      if($scope.global.templateDefault.objects[item].type === "square") {
        constructionSquareTotal = $scope.global.templateDefault.objects[item].squares.reduce(function(a, b) {
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
    $scope.global.heatTransferTotal = parseFloat(((prifileHeatCoeffTotal + glassHeatCoeffTotal)/constructionSquareTotal).toFixed(2));

    //-------- calculate Air Coeff Total
    $scope.global.airCirculationTotal = + $scope.global.product.profileAirCoeff + $scope.global.product.glassAirCoeff;

  };





  //-------- Clear All AddElements in localStorage
  $scope.global.clearAllAddElements = function() {
    for (var prop in $scope.global.chosenAddElements) {
      if (!$scope.global.chosenAddElements.hasOwnProperty(prop)) {
        continue;
      } else {
        $scope.global.chosenAddElements[prop].length = 0;
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
      $scope.global.initTemplates();
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
        constructionData,
        addElementsData,
        addElementsObj = $scope.global.chosenAddElements;

    if (!$scope.global.productEditNumber) {
      //-------- get product quantity
      if ($scope.global.productCounter) {
        ++$scope.global.productCounter;
      } else {
        $scope.global.productCounter = 1;
      }
    } else {


      //localDB.deleteDB($scope.global.productsTableBD, options);
    }

    //-------- insert product into local DB
    productData = {
      "orderId": $scope.global.orderNumber,
      "productId": $scope.global.productCounter,
      "roomId": $scope.global.currentRoomId,
      "heatCoeff": $scope.global.heatTransferTotal,
      "airCoeff": $scope.global.airCirculationTotal,
      "addElementsOnly": $scope.global.isAddElementsONLY,
      'templateName': $scope.global.templateSource.name,
      "templateIndex": $scope.global.templateIndex,
      "productWidth": $scope.global.product.constructionWidth,
      "productHeight": $scope.global.product.constructionHeight,
      "profileId": $scope.global.product.profileId,
      "profileIndex": $scope.global.profileIndex,
      "profileName": $scope.global.product.profileName,
      "glassId": $scope.global.product.glassId,
      "glassName": $scope.global.product.glassName,
      "hardwareId": $scope.global.product.hardwareId,
      "hardwareName": $scope.global.product.hardwareName,
      "laminationOutId": $scope.global.product.laminationOuterId,
      "laminationOutName": $scope.global.product.laminationOuter,
      "laminationInId": $scope.global.product.laminationInnerId,
      "laminationInName": $scope.global.product.laminationInner,
      "addElementsPrice": $scope.global.addElementsPriceTOTAL,
      "productPrice": parseFloat($scope.global.product.productPrice.toFixed(2)),
      "productQty": 1
    };
    localDB.insertDB($scope.global.productsTableBD, productData);


    //--------- insert construction components into local DB
    var componentCount = 1;
    for(var part = 0; part < $scope.global.templateSource.objects.length; part++) {
      for(var prop in $scope.global.templateSource.objects[part]) {
        if (!$scope.global.templateSource.objects[part].hasOwnProperty(prop)) {
          continue;
        } else {
          constructionData = {
            "orderId": $scope.global.orderNumber,
            "productId": $scope.global.productCounter,
            "componentsId": componentCount,
            "property": prop,
            "value": $scope.global.templateSource.objects[part][prop]
          };
          localDB.insertDB($scope.global.componentsTableBD, constructionData);
        }
      }
      componentCount++;
    }


    //--------- insert additional elements into local DB
    for(var prop in addElementsObj) {
      if (!addElementsObj.hasOwnProperty(prop)) {
        continue;
      }
      for (var elem = 0; elem < addElementsObj[prop].length; elem++) {

        switch (prop) {

          case 'selectedGrids':
            addElementsData = {
              "orderId": $scope.global.orderNumber,
              "productId": $scope.global.productCounter,
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
              "orderId": $scope.global.orderNumber,
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

          case 'selectedSpillways':
            addElementsData = {
              "orderId": $scope.global.orderNumber,
              "productId": $scope.global.productCounter,
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
              "orderId": $scope.global.orderNumber,
              "productId": $scope.global.productCounter,
              "elementId": addElementsObj[prop][elem].elementId,
              "elementType": addElementsObj[prop][elem].elementType,
              "elementName": addElementsObj[prop][elem].elementName,
              "elementQty": addElementsObj[prop][elem].elementQty,
              //"elementWidth": addElementsObj[prop][elem].elementWidth,
              "elementPrice": addElementsObj[prop][elem].elementPrice
            };
            localDB.insertDB($scope.global.outSlopesTableBD, addElementsData);
            break;

          case 'selectedInsideSlope':
            addElementsData = {
              "orderId": $scope.global.orderNumber,
              "productId": $scope.global.productCounter,
              "elementId": addElementsObj[prop][elem].elementId,
              "elementType": addElementsObj[prop][elem].elementType,
              "elementName": addElementsObj[prop][elem].elementName,
              "elementQty": addElementsObj[prop][elem].elementQty,
              //"elementWidth": addElementsObj[prop][elem].elementWidth,
              "elementPrice": addElementsObj[prop][elem].elementPrice
            };
            localDB.insertDB($scope.global.inSlopesTableBD, addElementsData);
            break;

          case 'selectedLouvers':
            addElementsData = {
              "orderId": $scope.global.orderNumber,
              "productId": $scope.global.productCounter,
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
              "orderId": $scope.global.orderNumber,
              "productId": $scope.global.productCounter,
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
              "orderId": $scope.global.orderNumber,
              "productId": $scope.global.productCounter,
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
              "orderId": $scope.global.orderNumber,
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

          case 'selectedHandles':
            addElementsData = {
              "orderId": $scope.global.orderNumber,
              "productId": $scope.global.productCounter,
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
              "orderId": $scope.global.orderNumber,
              "productId": $scope.global.productCounter,
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

  //--------- moving to Cart when click on Cart button
  $scope.movetoCart = function() {

    $timeout(function(){
      $scope.global.gotoCartPage();
    }, 18*STEP);
  };


  $scope.global.productInit();

}]);