/* globals BauVoiceApp, STEP, deactiveSizeBox */

'use strict';

BauVoiceApp.controller('ConstructionCtrl', ['$scope', 'constructService', 'localStorage', '$location', '$filter', function ($scope, constructService, localStorage, $location, $filter) {

  $scope.global = localStorage;

  $scope.constructData = {
    tempSize: [],
    minSizeLimit: 200,
    maxSizeLimit: 5000,
    isMinSizeRestriction: false,
    isMaxSizeRestriction: false,

    activeMenuItem: false,
    isSashEdit: false,
    isAngelEdit: false,
    isImpostEdit: false,
    isArchEdit: false,
    isPositionEdit: false,

    isSashEditMenu: false,
    isImpostEditMenu: false,

    showDoorConfig: false,

    selectedDoorShape: false,
    selectedSashShape: false,
    selectedHandleShape: false,
    selectedLockShape: false,
    doorShapeDefault: '',
    sashShapeDefault: '',
    handleShapeDefault: '',
    lockShapeDefault: '',
    doorShape: '',
    sashShape: '',
    handleShape: '',
    lockShape: '',

    selectedStep1: false,
    selectedStep2: false,
    selectedStep3: false,
    selectedStep4: false,
    DELAY_SHOW_FIGURE_ITEM: 1000,
    typing: 'on'
  };

  $scope.openVoiceHelper = false;
  $scope.loudVoice = false;
  $scope.quietVoice = false;
  $scope.selectedGlassId = 0;

  var sizeClass = 'size-box',
      sizeEditClass = 'size-box-edited',
      newLength, fromPointsId, toPointsId;


  $scope.templateSourceOLD = angular.copy($scope.global.product.templateSource);
  $scope.templateDefaultOLD = angular.copy($scope.global.product.templateDefault);

  $scope.templateSourceTEMP = angular.copy($scope.global.product.templateSource);
  $scope.templateDefaultTEMP = angular.copy($scope.global.product.templateDefault);



  //============ if Door Construction

  if($scope.global.isConstructDoor) {
    constructService.getDoorConfig(function (results) {
      if (results.status) {
        $scope.doorShape = results.data.doorType;
        $scope.sashShape = results.data.sashType;
        $scope.handleShape = results.data.handleType;
        $scope.lockShape = results.data.lockType;
      } else {
        console.log(results);
      }
    });


    $scope.constructData.doorShapeDefault = $scope.doorShape[$scope.global.product.doorShapeId].shapeLabel;
    $scope.constructData.sashShapeDefault = $scope.sashShape[$scope.global.product.doorSashShapeId].shapeLabel;
    $scope.constructData.handleShapeDefault = $scope.handleShape[$scope.global.product.doorHandleShapeId].shapeLabel;
    $scope.constructData.lockShapeDefault = $scope.lockShape[$scope.global.product.doorLockShapeId].shapeLabel;

    $scope.constructData.doorShape = $scope.constructData.doorShapeDefault;
    $scope.constructData.sashShape = $scope.constructData.sashShapeDefault;
    $scope.constructData.handleShape = $scope.constructData.handleShapeDefault;
    $scope.constructData.lockShape = $scope.constructData.lockShapeDefault;
  }

  //--------Select menu item
  $scope.selectMenuItem = function(id) {
    $scope.constructData.activeMenuItem = ($scope.constructData.activeMenuItem === id) ? false : id;
    deactivateShapeMenu();
    $scope.constructData.isSashEditMenu = false;
    $scope.constructData.isImpostEditMenu = false;
    deactivateSelectedGlasses();
    switch(id) {
      case 1:
        $scope.constructData.isSashEdit = true;
        break;
      case 2:
        $scope.constructData.isAngelEdit = true;
        break;
      case 3:
        $scope.constructData.isImpostEdit = true;
        break;
      case 4:
        $scope.constructData.isArchEdit = true;
        break;
      case 5:
        $scope.constructData.isPositionEdit = true;
        break;
    }
  };

  function deactivateShapeMenu() {
    $scope.constructData.isSashEdit = false;
    $scope.constructData.isAngelEdit = false;
    $scope.constructData.isImpostEdit = false;
    $scope.constructData.isArchEdit = false;
    $scope.constructData.isPositionEdit = false;
  }

  //---------- Show Door Configuration
  $scope.getDoorConfig = function() {
    $scope.constructData.showDoorConfig = ($scope.constructData.showDoorConfig) ? false : true;
  };

  //---------- Select door shape
  $scope.selectDoor = function(id, name) {
    if(!$scope.constructData.selectedStep2) {
      if($scope.constructData.selectedDoorShape === id) {
        $scope.constructData.selectedDoorShape = false;
        $scope.constructData.selectedStep1 = false;
        $scope.constructData.doorShape = $scope.constructData.doorShapeDefault;
      } else {
        $scope.constructData.selectedDoorShape = id;
        $scope.constructData.selectedStep1 = true;
        $scope.constructData.doorShape = name;
      }
    } else {
      return false;
    }
  };
  //---------- Select sash shape
  $scope.selectSash = function(id, name) {
    if(!$scope.constructData.selectedStep3) {
      if ($scope.constructData.selectedSashShape === id) {
        $scope.constructData.selectedSashShape = false;
        $scope.constructData.selectedStep2 = false;
        $scope.constructData.sashShape = $scope.constructData.sashShapeDefault;
      } else {
        $scope.constructData.selectedSashShape = id;
        $scope.constructData.selectedStep2 = true;
        $scope.constructData.sashShape = name;
      }
    }
  };
  //-------- Select handle shape
  $scope.selectHandle = function(id, name) {
    if(!$scope.constructData.selectedStep4) {
      if($scope.constructData.selectedHandleShape === id) {
        $scope.constructData.selectedHandleShape = false;
        $scope.constructData.selectedStep3 = false;
        $scope.constructData.handleShape = $scope.constructData.handleShapeDefault;
      } else {
        $scope.constructData.selectedHandleShape = id;
        $scope.constructData.selectedStep3 = true;
        $scope.constructData.handleShape = name;
      }
    }
  };
  //--------- Select lock shape
  $scope.selectLock = function(id, name) {
    if($scope.constructData.selectedLockShape === id) {
      $scope.constructData.selectedLockShape = false;
      $scope.constructData.selectedStep4 = false;
      $scope.constructData.lockShape = $scope.constructData.lockShapeDefault;
    } else {
      $scope.constructData.selectedLockShape = id;
      $scope.constructData.selectedStep4 = true;
      $scope.constructData.lockShape = name;
    }
  };

  //--------- Close Door Configuration
  $scope.closeDoorConfig = function() {
    if($scope.constructData.selectedStep3) {
      $scope.constructData.selectedStep3 = false;
      $scope.constructData.selectedStep4 = false;
      $scope.constructData.selectedLockShape = false;
      $scope.constructData.selectedHandleShape = false;
    } else if($scope.constructData.selectedStep2) {
      $scope.constructData.selectedStep2 = false;
      $scope.constructData.selectedSashShape = false;
    } else if($scope.constructData.selectedStep1) {
      $scope.constructData.selectedStep1 = false;
      $scope.constructData.selectedDoorShape = false;
    } else {
      $scope.constructData.showDoorConfig = false;
      $scope.constructData.doorShape = $scope.constructData.doorShapeDefault;
      $scope.constructData.sashShape = $scope.constructData.sashShapeDefault;
      $scope.constructData.handleShape = $scope.constructData.handleShapeDefault;
      $scope.constructData.lockShape = $scope.constructData.lockShapeDefault;
    }
  };

  //--------- Save Door Configuration
  $scope.saveDoorConfig = function() {
    $scope.constructData.showDoorConfig = false;
    $scope.global.product.doorShapeId = $scope.constructData.selectedDoorShape;
    $scope.global.product.doorSashShapeId = $scope.constructData.selectedSashShape;
    $scope.global.product.doorHandleShapeId = $scope.constructData.selectedHandleShape;
    $scope.global.product.doorLockShapeId = $scope.constructData.selectedLockShape;
    console.log('product door', $scope.global.product);
  };

  //=============== End Door ==================





  //--------- Cancel and Close Construction Page
  $scope.gotoMainPageCancel = function () {
    $scope.global.isConstructSizeCalculator = false;
    $scope.backtoTemplatePanel();
  };

  //------- Save and Close Construction Page
  $scope.gotoMainPageSaved = function () {
    //------ if calculator is closed
    if(!$scope.global.isConstructSizeCalculator) {

      //----- save new template in product
      $scope.global.product.templateSource = angular.copy($scope.templateSourceTEMP);
      $scope.global.product.templateDefault = angular.copy($scope.templateDefaultTEMP);
      $scope.global.product.templateIcon = new TemplateIcon($scope.templateSourceTEMP, $scope.global.templateDepths);

      //------ save new template in templates Array
      if($scope.global.isConstructDoor) {
        changeTemplateInArray($scope.global.product.templateIndex, $scope.global.templatesDoorSource, $scope.global.templatesDoorList, $scope.global.templatesDoorIconList, $scope.templateSourceTEMP, $scope.templateDefaultTEMP, $scope.global.product.templateIcon);
      } else if($scope.global.isConstructBalcony) {
        changeTemplateInArray($scope.global.product.templateIndex, $scope.global.templatesBalconySource, $scope.global.templatesBalconyList, $scope.global.templatesBalconyIconList, $scope.templateSourceTEMP, $scope.templateDefaultTEMP, $scope.global.product.templateIcon);
      } else if($scope.global.isConstructWindDoor) {
        changeTemplateInArray($scope.global.product.templateIndex, $scope.global.templatesWindDoorSource, $scope.global.templatesWindDoorList, $scope.global.templatesWindDoorIconList, $scope.templateSourceTEMP, $scope.templateDefaultTEMP, $scope.global.product.templateIcon);
      } else if($scope.global.isConstructWind) {
        changeTemplateInArray($scope.global.product.templateIndex, $scope.global.templatesWindSource, $scope.global.templatesWindList, $scope.global.templatesWindIconList, $scope.templateSourceTEMP, $scope.templateDefaultTEMP, $scope.global.product.templateIcon);
      }
      //------- refresh current templates arrays
      $scope.global.getCurrentTemplates();
      //-------- template was changed
      $scope.global.isChangedTemplate = true;
      $scope.backtoTemplatePanel();
    }
  };


  //-------- Back to Template Panel
  $scope.backtoTemplatePanel = function() {
    $scope.global.prepareMainPage();
    $scope.global.isReturnFromDiffPage = true;
    console.log('construction page!!!!!!!!!!!');
    console.log('product ====== ', $scope.global.product);
    console.log('order ====== ', $scope.global.order);
    $location.path('/main');
  };

  function changeTemplateInArray(templateIndex, templateSourceList, templateList, templateIconList, newTemplateSource, newTemplate, newTemplateIcon) {
    //----- write new template in array
    templateSourceList[templateIndex] = angular.copy(newTemplateSource);
    templateList[templateIndex] = angular.copy(newTemplate);
    templateIconList[templateIndex] = angular.copy(newTemplateIcon);
  }







  //------- set Default Construction
  $scope.setDefaultConstruction = function() {
    if(!$scope.global.isConstructSizeCalculator) {
      $scope.templateDefaultTEMP = {};
      $scope.templateSourceTEMP = {};
      $scope.templateDefaultTEMP = angular.copy($scope.templateDefaultOLD);
      $scope.templateSourceTEMP = angular.copy($scope.templateSourceOLD);
      $scope.constructData.tempSize.length = 0;
    }
  };




  //=============== CHANGE CONSTRUCTION SIZE ==============

  //----- click on size SVG and get size value and Id
  $('svg-template').off("click", ".size-box-edited").on("click", ".size-box-edited", function() {
    console.log('Click on size');
    console.log('calculator', $scope.global.isConstructSizeCalculator);
    if(!$scope.global.isConstructSizeCalculator) {
      var thisSize = $(this).find('text');
      $scope.constructData.oldSizeValue = thisSize.text();
      $scope.constructData.tempSizeId = thisSize.attr('id');

      //------- определение зависимых размеров и установка лимита
      var limitSizesAtrr = thisSize.attr('limits');

      if(limitSizesAtrr) {
        var sizeType = thisSize.attr('type');
        var limitSizesIds = limitSizesAtrr.split(' ');
        if(sizeType === 'dimensionsH') {
          if($scope.constructData.tempSizeId === 'overallDimH') {
            for(var siz = 0; siz < limitSizesIds.length; siz++) {
              var limitSizeValue = $('svg-template').find('#'+limitSizesIds[siz]).text();
              $scope.constructData.minSizeLimit += parseInt(limitSizeValue, 10);
            }
          } else {
            $scope.constructData.maxSizeLimit = -200;
            for(var siz = 0; siz < limitSizesIds.length; siz++) {
              var limitSizeValue = $('svg-template').find('#'+limitSizesIds[siz]).text();
              if(limitSizesIds[siz] === 'overallDimH') {
                $scope.constructData.maxSizeLimit += parseInt(limitSizeValue, 10);
              } else {
                $scope.constructData.maxSizeLimit -= parseInt(limitSizeValue, 10);
              }
            }
          }
        } else if(sizeType === 'dimensionsV') {
          if($scope.constructData.tempSizeId === 'overallDimV') {
            for(var siz = 0; siz < limitSizesIds.length; siz++) {
              var limitSizeValue = $('svg-template').find('#'+limitSizesIds[siz]).text();
              $scope.constructData.minSizeLimit += parseInt(limitSizeValue, 10);
            }
          } else {
            $scope.constructData.maxSizeLimit = -200;
            for(var siz = 0; siz < limitSizesIds.length; siz++) {
              var limitSizeValue = $('svg-template').find('#'+limitSizesIds[siz]).text();
              if(limitSizesIds[siz] === 'overallDimV') {
                $scope.constructData.maxSizeLimit += parseInt(limitSizeValue, 10);
              } else {
                $scope.constructData.maxSizeLimit -= parseInt(limitSizeValue, 10);
              }
            }
          }
        }

      }

      //getOldSizeValue();
      //--- show size calculator if voice helper is turn off
      if(!$scope.global.isVoiceHelper) {
        $scope.global.isConstructSizeCalculator = true;
      } else {
        $scope.openVoiceHelper = true;
        startRecognition(doneRecognition, recognitionProgress, $scope.global.voiceHelperLanguage);

      }
      $scope.$apply();
    }
  });


  //------ click on size calculator, get number
  $('.construction-right-menu .size-calculator .calc-digit').off().click(function() {
    var newValue = $(this).text();
    setValueSize(newValue);
  });
  //------ click on size calculator, delete one last number
  $('.construction-right-menu .size-calculator .calc-delete').off().click(function() {
    deleteLastNumber();
  });

  //---------- define voice force
  function recognitionProgress(value) {
    if (value > 100) {
      console.log('value', value);
      $scope.loudVoice = true;
      $scope.quietVoice = false;

    } else {
      console.log('value', value);
      $scope.loudVoice = false;
      $scope.quietVoice = true;
    }
    $scope.$apply();

  }

  function doneRecognition(value) {
    console.log("полученные данные", value);
    console.log("тип полученных данных", typeof value);
    $scope.voiceTxt = value;
    $scope.$apply();
    setTimeout(function() {
      var intValue = parseStringToDimension(value);
      console.log("данные после парса", intValue);
      console.log("тип полученных данных", typeof intValue);
      if (intValue == "NaN") {
        intValue = $filter('translate')('construction.VOICE_NOT_UNDERSTAND');
      }
      playTTS(intValue);
      setValueSize(intValue);
      $scope.$apply();
    }, 1000)
  }


  //-------- Get number from calculator
  function setValueSize(newValue) {

    if($scope.global.isVoiceHelper) {

      var tempVal = parseInt(newValue, 10);
      console.log('tempVal=====', tempVal);
      $scope.voiceTxt = '';
      $scope.openVoiceHelper = false;

      if ((tempVal > 0) && (tempVal < 10000)) {
        $scope.constructData.tempSize = ("" + tempVal).split('');
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.log('$scope.constructData.tempSize == ', $scope.constructData.tempSize);
        changeSize();
      }
      deactiveSizeBox(sizeEditClass, sizeClass);

    } else {
      //---- clear array from 0 after delete all number in array
      if ($scope.constructData.tempSize.length === 1 && $scope.constructData.tempSize[0] === 0) {
        $scope.constructData.tempSize.length = 0;
      }
      if ($scope.constructData.tempSize.length === 4) {
        $scope.constructData.tempSize.length = 0;
      }
      if (newValue === '0') {
        if ($scope.constructData.tempSize.length !== 0 && $scope.constructData.tempSize[0] !== 0) {
          $scope.constructData.tempSize.push(newValue);
          changeSize();
        }
      }
      if (newValue === '00') {
        if ($scope.constructData.tempSize.length !== 0 && $scope.constructData.tempSize[0] !== 0) {
          if ($scope.constructData.tempSize.length < 3) {
            $scope.constructData.tempSize.push(0, 0);
          } else if ($scope.constructData.tempSize.length === 3) {
            $scope.constructData.tempSize.push(0);
          }
          changeSize();
        }
      }
      if (newValue !== '0' && newValue !== '00') {
        $scope.constructData.tempSize.push(newValue);
        changeSize();
      }
    }
  }

  //------ Delete last number from calculator
  function deleteLastNumber() {
      $scope.constructData.tempSize.pop();
      if($scope.constructData.tempSize.length < 1) {
        $scope.constructData.tempSize.push(0);
      }
    changeSize();
  }

  //------ Change size on SVG
  function changeSize() {
    var newSizeString = '';
    for(var numer = 0; numer < $scope.constructData.tempSize.length; numer++) {
      newSizeString += $scope.constructData.tempSize[numer].toString();
    }
    var svg = document.getElementsByTagName("svg-template");

    $('#'+$scope.constructData.tempSizeId).find('tspan').text(parseInt(newSizeString, 10));
    //--- finde overall dimensions
    $scope.svgTemplateWidthTEMP = parseInt($('#overallDimH').find('tspan').text(), 10);
    $scope.svgTemplateHeightTEMP = parseInt($('#overallDimV').find('tspan').text(), 10);

    SVG(svg[0]).viewbox();
    SVG(svg[0]).size($scope.svgTemplateWidthTEMP, $scope.svgTemplateHeightTEMP);

    if($scope.global.isVoiceHelper) {
      $scope.closeSizeCaclulator();
      console.log('$scope.constructData.tempSize ===end', $scope.constructData.tempSize);
    }
  }

  //---------- Close Size Calculator
  $scope.closeSizeCaclulator = function() {
    var fromPoints = [],
        toPoints = [],
        linkPointsId = [],
        newPoints = [],
        allDimensionsV = [],
        curDimensionType;


    if($scope.constructData.tempSize.length > 0) {
      newLength = parseInt($scope.constructData.tempSize.join(''), 10);
      //console.log("newLength!!!" + newLength);
      //------- Dimensions limits checking
      if (newLength > $scope.constructData.minSizeLimit && newLength < $scope.constructData.maxSizeLimit) {
        $scope.constructData.isMinSizeRestriction = false;
        $scope.constructData.isMaxSizeRestriction = false;
        //------ parse template, get pointsId relate to changed dimension id
        for (var i = 0; i < $scope.templateDefaultTEMP.objects.length; i++) {
          if ($scope.templateDefaultTEMP.objects[i].id === $scope.constructData.tempSizeId) {
            fromPointsId = $scope.templateDefaultTEMP.objects[i].fromPointsArrId;
            toPointsId = $scope.templateDefaultTEMP.objects[i].toPointsArrId;
            linkPointsId = $scope.templateDefaultTEMP.objects[i].links;
            curDimensionType = $scope.templateDefaultTEMP.objects[i].type;
          }
        }


        //console.log($scope.global.templateDefault);
        //------ parse template, get points relate to points id
        for (var p = 0; p < fromPointsId.length; p++) {
          for (var j = 0; j < $scope.templateDefaultTEMP.objects.length; j++) {
            var point = {};
            switch ($scope.templateDefaultTEMP.objects[j].id) {
              case fromPointsId[p]:
                //var point = {};
                point.x = parseInt($scope.templateDefaultTEMP.objects[j].x, 10);
                point.y = parseInt($scope.templateDefaultTEMP.objects[j].y, 10);
                fromPoints.push(point);
                break;
              case toPointsId[p]:
                //var point = {};
                point.x = parseInt($scope.templateDefaultTEMP.objects[j].x, 10);
                point.y = parseInt($scope.templateDefaultTEMP.objects[j].y, 10);
                toPoints.push(point);
                break;
            }
          }
        }
        //console.log(fromPoints);
        //console.log(toPoints);

        //------ get new points
        for (var point = 0; point < fromPoints.length; point++) {
          var newPoint = {};
          newPoint.newPointX = fromPoints[point].x + (newLength * (toPoints[point].x - fromPoints[point].x) / $scope.constructData.oldSizeValue);
          newPoint.newPointY = fromPoints[point].y + (newLength * (toPoints[point].y - fromPoints[point].y) / $scope.constructData.oldSizeValue);
          newPoints.push(newPoint);
        }

        //-------- change point coordinates in templateSource
        for (var n = 0; n < toPointsId.length; n++) {
          for (var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
            if ($scope.templateSourceTEMP.objects[k].id === toPointsId[n]) {
              if(curDimensionType === 'dimensionsH') {
                $scope.templateSourceTEMP.objects[k].x = newPoints[n].newPointX;
              } else if(curDimensionType === 'dimensionsV') {
                $scope.templateSourceTEMP.objects[k].y = newPoints[n].newPointY;
              }
            }
          }
        }

        //console.log(linkPointsId);
        //------- change linked points in templateSource
        if(linkPointsId) {
          for (var l = 0; l < linkPointsId.length; l++) {
            for (var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
              if ($scope.templateSourceTEMP.objects[k].id === linkPointsId[l]) {
                if(curDimensionType === 'dimensionsH') {
                  $scope.templateSourceTEMP.objects[k].x = newPoints[l].newPointX;
                } else if(curDimensionType === 'dimensionsV') {
                  $scope.templateSourceTEMP.objects[k].y = newPoints[l].newPointY;
                }
              }
            }
          }
        }

        $scope.constructData.minSizeLimit = 200;
        $scope.constructData.maxSizeLimit = 5000;
        //------ close size calculator
        $scope.global.isConstructSizeCalculator = false;
        //------- deactive size box in svg
        deactiveSizeBox(sizeEditClass, sizeClass);

        //-------- build new template
        $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);

        $scope.constructData.tempSize.length = 0;
        $scope.constructData.isMinSizeRestriction = false;
        $scope.constructData.isMaxSizeRestriction = false;
      } else {

        //------ show error size
        if(newLength < $scope.constructData.minSizeLimit) {
          if($scope.global.isVoiceHelper) {
            playTTS($filter('translate')('construction.VOICE_SMALLEST_SIZE'), $scope.global.voiceHelperLanguage);
            //------- deactive size box in svg
            deactiveSizeBox(sizeEditClass, sizeClass);
            //-------- build new template
            $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
          } else {
            $scope.constructData.isMinSizeRestriction = true;
            $scope.constructData.isMaxSizeRestriction = false;
          }
        } else if(newLength > $scope.constructData.maxSizeLimit) {
          if($scope.global.isVoiceHelper) {
            playTTS($filter('translate')('construction.VOICE_BIGGEST_SIZE'), $scope.global.voiceHelperLanguage);
            //------- deactive size box in svg
            deactiveSizeBox(sizeEditClass, sizeClass);
            //-------- build new template
            $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
          } else {
            $scope.constructData.isMinSizeRestriction = false;
            $scope.constructData.isMaxSizeRestriction = true;
          }
        }

      }
    } else {
      $scope.constructData.minSizeLimit = 200;
      $scope.constructData.maxSizeLimit = 5000;
      //------ close size calculator
      $scope.global.isConstructSizeCalculator = false;
      deactiveSizeBox(sizeEditClass, sizeClass);
    }
    $scope.openVoiceHelper = false;
    $scope.loudVoice = false;
    $scope.quietVoice = false;
  };










  //=============== CLICK ON GLASS PACKAGE ==============

  $('svg-template').off("click", ".glass").on("click", ".glass", function(event) {
    if($scope.constructData.isSashEdit) {
      //------- show sash edit menu and select all glass packages
      if(!$scope.constructData.isSashEditMenu) {
        $scope.constructData.isSashEditMenu = true;
        prepareForNewShape(event, '#sash-shape-menu');
      } else {
        $scope.constructData.isSashEditMenu = false;
        deactivateSelectedGlasses();
      }
      $scope.$apply();
    } else if($scope.constructData.isAngelEdit) {
      console.log('angel');
    } else if($scope.constructData.isImpostEdit) {
      //------- show impost edit menu and select all glass packages
      if(!$scope.constructData.isImpostEditMenu) {
        $scope.constructData.isImpostEditMenu = true;
        prepareForNewShape(event, '#impost-shape-menu');
      } else {
        $scope.constructData.isImpostEditMenu = false;
        deactivateSelectedGlasses();
      }
      $scope.$apply();
    } else if($scope.constructData.isArchEdit) {
      console.log('arch');
    } else if($scope.constructData.isPositionEdit) {
      console.log('position');
    }
  });



  function prepareForNewShape(event, idShapeMenu) {
    //------ set the coordinats for edit sash menu
    var menuX = event.pageX;
    var menuY = event.pageY;
    //var menuX1 = event.clientX;
    //var menuY1 = event.clientY;
    //var menuX2 = event.offsetX;
    //var menuY2 = event.offsetY;
    //var menuX3 = event.screenX;
    //var menuY3 = event.screenY;

    $(idShapeMenu).css({'top': (menuY)/8+'rem', 'left': (menuX)/8+'rem'});
 /*
    var html = document.documentElement;
    var body = document.body;

    console.log('body === ', body.scrollLeft);
    console.log('document.body.scrollTop === ', body.scrollTop);
    console.log('offsetParent === ', event.target.offsetParent);
    console.log('offsetLeft === ', event.target.offsetParent.scrollLeft);
    console.log('offsetTop === ', event.target.offsetParent.scrollTop);
    console.log('html === ', html.scrollLeft);
    console.log('html.scrollTop === ', html.scrollTop);

    console.log('screen.availWidth === ', screen.availWidth);
    console.log('screen.availHeight === ', screen.availHeight);
    console.log('screen.width === ', screen.width);
    console.log('screen.height === ', screen.height);
*/

    //------- select all glass packages
    $('svg-template').find('.glass').each(function() {
      //$(this).addClass('glass-active');
      $(this).css('fill', 'rgba(34, 34, 255, 0.69)');
    });
    //------- define id of current glass package
    $scope.selectedGlassId = event.target.attributes['element-id'].value;
  }


  function deactivateSelectedGlasses() {
    $('svg-template').find('.glass').each(function() {
      $(this).css('fill', 'rgba(155, 204, 255, 0.20)');
    });
  }


  //=============== CLICK ON SASH EDIT MENU

  $scope.insertNewSash = function() {
    editSash(arguments);
  };


  //=============== EDIT SASH CONSTRUCTION ==============

  function editSash(sashType) {
    var blockId = Number($scope.selectedGlassId.replace(/\D+/g,"")),
        currGlassPackage = {},
        insertIndex,
        isSashExist,
        sashNewId = (blockId - 1) * 4;

    //------- get data of current glass package
    for (var t = 0; t < $scope.templateDefaultTEMP.objects.length; t++) {
      if($scope.templateDefaultTEMP.objects[t].id === $scope.selectedGlassId) {
        currGlassPackage = $scope.templateDefaultTEMP.objects[t];
        isSashExist = currGlassPackage.parts[0].fromPoint.blockType;
      }
    }
console.log('currGlassPackage', currGlassPackage);
    //-------- if need to delete existed sash
    if(sashType[0] === 'empty') {
      //----- if sash exists
      if(isSashExist === 'sash') {

        //------ delete sash from template Source
        for(var tempObj = $scope.templateSourceTEMP.objects.length-1; tempObj >= 0; tempObj--) {

          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_sash_out' || $scope.templateSourceTEMP.objects[tempObj].type === 'sash_out_line' || $scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_hardware' || $scope.templateSourceTEMP.objects[tempObj].type === 'hardware_line' || $scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_sash_in' || $scope.templateSourceTEMP.objects[tempObj].type === 'sash_line' || $scope.templateSourceTEMP.objects[tempObj].type === 'sash') {
            switch($scope.templateSourceTEMP.objects[tempObj].id) {
              case 'cpsout'+(sashNewId+1):
              case 'cpsout'+(sashNewId+2):
              case 'cpsout'+(sashNewId+3):
              case 'cpsout'+(sashNewId+4):
              case 'sashoutline'+(sashNewId+1):
              case 'sashoutline'+(sashNewId+2):
              case 'sashoutline'+(sashNewId+3):
              case 'sashoutline'+(sashNewId+4):
              case 'cphw'+(sashNewId+1):
              case 'cphw'+(sashNewId+2):
              case 'cphw'+(sashNewId+3):
              case 'cphw'+(sashNewId+4):
              case 'hardwareline'+(sashNewId+1):
              case 'hardwareline'+(sashNewId+2):
              case 'hardwareline'+(sashNewId+3):
              case 'hardwareline'+(sashNewId+4):
              case 'cpsin'+(sashNewId+1):
              case 'cpsin'+(sashNewId+2):
              case 'cpsin'+(sashNewId+3):
              case 'cpsin'+(sashNewId+4):
              case 'sashline'+(sashNewId+1):
              case 'sashline'+(sashNewId+2):
              case 'sashline'+(sashNewId+3):
              case 'sashline'+(sashNewId+4):
              case 'sash'+(sashNewId+1):
              case 'sash'+(sashNewId+2):
              case 'sash'+(sashNewId+3):
              case 'sash'+(sashNewId+4):
                $scope.templateSourceTEMP.objects.splice(tempObj, 1);
                break;
            }
          } else if($scope.templateSourceTEMP.objects[tempObj].type === 'sash_block' && $scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
            $scope.templateSourceTEMP.objects.splice(tempObj, 1);
          }

          //------- change beads & glass position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead_out' || $scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_glass') {
            switch($scope.templateSourceTEMP.objects[tempObj].id) {
              case 'cpbeadout'+(sashNewId+1):
              case 'cpbeadout'+(sashNewId+2):
              case 'cpbeadout'+(sashNewId+3):
              case 'cpbeadout'+(sashNewId+4):
              case 'cpg'+(sashNewId+1):
              case 'cpg'+(sashNewId+2):
              case 'cpg'+(sashNewId+3):
              case 'cpg'+(sashNewId+4):
                $scope.templateSourceTEMP.objects[tempObj].blockType = 'frame';
                if (($scope.templateSourceTEMP.objects[tempObj].line1.indexOf('impostcenterline') + 1)) {
                  for(var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
                    if($scope.templateSourceTEMP.objects[k].id === $scope.templateSourceTEMP.objects[tempObj].line1) {
                      $scope.templateSourceTEMP.objects[k].lineType = 'frame';
                    }
                  }
                } else if(($scope.templateSourceTEMP.objects[tempObj].line2.indexOf('impostcenterline') + 1)) {
                  for(var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
                    if($scope.templateSourceTEMP.objects[k].id === $scope.templateSourceTEMP.objects[tempObj].line2) {
                      $scope.templateSourceTEMP.objects[k].lineType = 'frame';
                    }
                  }
                }
                break;
            }
          }

        }

        //console.log('!!!!new.templateSourceTEMP === ', $scope.templateSourceTEMP);
        //-------- build new template
        $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
        //console.log('templateDefaultTEMP', $scope.templateDefaultTEMP.objects);

        $scope.constructData.isSashEditMenu = false;
        $scope.constructData.isSashEdit = false;
        $scope.constructData.activeMenuItem = false;

      }
    //-------- if need to edit or insert new sash
    } else {

      //-------- insert new sash
      if(isSashExist === 'frame' && currGlassPackage.square > 0.05) {

        //---- find insert index before beads to push new sash
        for (var i = 0; i < $scope.templateDefaultTEMP.objects.length; i++) {
          if($scope.templateDefaultTEMP.objects[i].type === 'bead_line') {
            insertIndex = i;
            break;
          }
        }

        //-------- build new Sash
        var newSash = [
          {'type': 'cross_point_sash_out', id: 'cpsout'+(sashNewId+1), line1: currGlassPackage.parts[0].toPoint.lineId1, line2: currGlassPackage.parts[0].toPoint.lineId2},
          {'type': 'cross_point_sash_out', id: 'cpsout'+(sashNewId+2), line1: currGlassPackage.parts[1].toPoint.lineId1, line2: currGlassPackage.parts[1].toPoint.lineId2},
          {'type': 'cross_point_sash_out', id: 'cpsout'+(sashNewId+3), line1: currGlassPackage.parts[2].toPoint.lineId1, line2: currGlassPackage.parts[2].toPoint.lineId2},
          {'type': 'cross_point_sash_out', id: 'cpsout'+(sashNewId+4), line1: currGlassPackage.parts[3].toPoint.lineId1, line2: currGlassPackage.parts[3].toPoint.lineId2},
          {'type': 'sash_out_line', id: 'sashoutline'+(sashNewId+1), from: 'cpsout'+(sashNewId+4), to: 'cpsout'+(sashNewId+1)},
          {'type': 'sash_out_line', id: 'sashoutline'+(sashNewId+2), from: 'cpsout'+(sashNewId+1), to: 'cpsout'+(sashNewId+2)},
          {'type': 'sash_out_line', id: 'sashoutline'+(sashNewId+3), from: 'cpsout'+(sashNewId+2), to: 'cpsout'+(sashNewId+3)},
          {'type': 'sash_out_line', id: 'sashoutline'+(sashNewId+4), from: 'cpsout'+(sashNewId+3), to: 'cpsout'+(sashNewId+4)},
          {'type': 'cross_point_hardware', id: 'cphw'+(sashNewId+1), line1: 'sashoutline'+(sashNewId+1), line2: 'sashoutline'+(sashNewId+2)},
          {'type': 'cross_point_hardware', id: 'cphw'+(sashNewId+2), line1: 'sashoutline'+(sashNewId+2), line2: 'sashoutline'+(sashNewId+3)},
          {'type': 'cross_point_hardware', id: 'cphw'+(sashNewId+3), line1: 'sashoutline'+(sashNewId+3), line2: 'sashoutline'+(sashNewId+4)},
          {'type': 'cross_point_hardware', id: 'cphw'+(sashNewId+4), line1: 'sashoutline'+(sashNewId+4), line2: 'sashoutline'+(sashNewId+1)},
          {'type': 'hardware_line', id: 'hardwareline'+(sashNewId+1), from: 'cphw'+(sashNewId+4), to: 'cphw'+(sashNewId+1)},
          {'type': 'hardware_line', id: 'hardwareline'+(sashNewId+2), from: 'cphw'+(sashNewId+1), to: 'cphw'+(sashNewId+2)},
          {'type': 'hardware_line', id: 'hardwareline'+(sashNewId+3), from: 'cphw'+(sashNewId+2), to: 'cphw'+(sashNewId+3)},
          {'type': 'hardware_line', id: 'hardwareline'+(sashNewId+4), from: 'cphw'+(sashNewId+3), to: 'cphw'+(sashNewId+4)},
          {'type': 'cross_point_sash_in', id: 'cpsin'+(sashNewId+1), line1: 'sashoutline'+(sashNewId+1), line2: 'sashoutline'+(sashNewId+2)},
          {'type': 'cross_point_sash_in', id: 'cpsin'+(sashNewId+2), line1: 'sashoutline'+(sashNewId+2), line2: 'sashoutline'+(sashNewId+3)},
          {'type': 'cross_point_sash_in', id: 'cpsin'+(sashNewId+3), line1: 'sashoutline'+(sashNewId+3), line2: 'sashoutline'+(sashNewId+4)},
          {'type': 'cross_point_sash_in', id: 'cpsin'+(sashNewId+4), line1: 'sashoutline'+(sashNewId+4), line2: 'sashoutline'+(sashNewId+1)},
          {'type': 'sash_line', id: 'sashline'+(sashNewId+1), from: 'cpsin'+(sashNewId+4), to: 'cpsin'+(sashNewId+1)},
          {'type': 'sash_line', id: 'sashline'+(sashNewId+2), from: 'cpsin'+(sashNewId+1), to: 'cpsin'+(sashNewId+2)},
          {'type': 'sash_line', id: 'sashline'+(sashNewId+3), from: 'cpsin'+(sashNewId+2), to: 'cpsin'+(sashNewId+3)},
          {'type': 'sash_line', id: 'sashline'+(sashNewId+4), from: 'cpsin'+(sashNewId+3), to: 'cpsin'+(sashNewId+4)},
          {'type': 'sash', id: 'sash'+(sashNewId+1), parts: ['sashoutline'+(sashNewId+1), 'sashline'+(sashNewId+1)]},
          {'type': 'sash', id: 'sash'+(sashNewId+2), parts: ['sashoutline'+(sashNewId+2), 'sashline'+(sashNewId+2)]},
          {'type': 'sash', id: 'sash'+(sashNewId+3), parts: ['sashoutline'+(sashNewId+3), 'sashline'+(sashNewId+3)]},
          {'type': 'sash', id: 'sash'+(sashNewId+4), parts: ['sashoutline'+(sashNewId+4), 'sashline'+(sashNewId+4)]},
          {'type': 'sash_block', id: 'sashBlock'+blockId, parts: ['hardwareline'+(sashNewId+1), 'hardwareline'+(sashNewId+2), 'hardwareline'+(sashNewId+3), 'hardwareline'+(sashNewId+4)], openDir: []}
        ];

        //--------- added impost properties
        for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
          if (newSash[sashObj].type === 'cross_point_sash_out') {
            if ((newSash[sashObj].line1.indexOf('impostcenterline') + 1)) {
              for(var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
                if($scope.templateSourceTEMP.objects[k].id === newSash[sashObj].line1) {
                  $scope.templateSourceTEMP.objects[k].lineType = 'sash';
                }
              }
            } else if((newSash[sashObj].line2.indexOf('impostcenterline') + 1)) {
              for(var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
                if($scope.templateSourceTEMP.objects[k].id === newSash[sashObj].line2) {
                  $scope.templateSourceTEMP.objects[k].lineType = 'sash';
                }
              }
            }
          }
        }
        //--------- added openType, openDir properties
        for(var dir = 0; dir < sashType.length; dir++) {
          switch(sashType[dir]) {
            case 'up':
              for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
                if(newSash[sashObj].id === 'sash'+(sashNewId+3)) {
                  newSash[sashObj].openType = ['sashline'+(sashNewId+3), 'sashline'+(sashNewId+1)];
                }
                if(newSash[sashObj].id === 'sashBlock'+blockId) {
                  newSash[sashObj].openDir.push(1);
                  newSash[sashObj].handlePos = 1;
                }
              }
              break;
            case 'down':
              for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
                if(newSash[sashObj].id === 'sash'+(sashNewId+1)) {
                  newSash[sashObj].openType = ['sashline'+(sashNewId+1), 'sashline'+(sashNewId+3)];
                }
                if(newSash[sashObj].id === 'sashBlock'+blockId) {
                  newSash[sashObj].openDir.push(3);
                  newSash[sashObj].handlePos = 3;
                }
              }
              break;
            case 'left':
              for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
                if(newSash[sashObj].id === 'sash'+(sashNewId+2)) {
                  newSash[sashObj].openType = ['sashline'+(sashNewId+2), 'sashline'+(sashNewId+4)];
                }
                if(newSash[sashObj].id === 'sashBlock'+blockId) {
                  newSash[sashObj].openDir.push(4);
                  newSash[sashObj].handlePos = 4;
                }
              }
              break;
            case 'right':
              for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
                if(newSash[sashObj].id === 'sash'+(sashNewId+4)) {
                  newSash[sashObj].openType = ['sashline'+(sashNewId+4), 'sashline'+(sashNewId+2)];
                }
                if(newSash[sashObj].id === 'sashBlock'+blockId) {
                  newSash[sashObj].openDir.push(2);
                  newSash[sashObj].handlePos = 2;
                }
              }
              break;
          }
        }


        //----------- INSERT new sash in template Source
        for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex+sashObj), 0, newSash[sashObj]);
        }

        //----------- change existed beads and glass package
        for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
          //------- change beads & glass position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead_out' || $scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_glass') {
            switch($scope.templateSourceTEMP.objects[tempObj].id) {
              case 'cpbeadout'+(sashNewId+1):
              case 'cpbeadout'+(sashNewId+2):
              case 'cpbeadout'+(sashNewId+3):
              case 'cpbeadout'+(sashNewId+4):
              case 'cpg'+(sashNewId+1):
              case 'cpg'+(sashNewId+2):
              case 'cpg'+(sashNewId+3):
              case 'cpg'+(sashNewId+4):
                $scope.templateSourceTEMP.objects[tempObj].blockType = 'sash';
                break;
            }
          }
        }




      //--------- edit existing sash (opening type)
      } else if(isSashExist === 'sash') {

        //--------- clean old openType properties in sash objects and openDir in sashBlock
        for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
          switch ($scope.templateSourceTEMP.objects[tempObj].id) {
            case 'sash'+(sashNewId+1):
            case 'sash'+(sashNewId+2):
            case 'sash'+(sashNewId+3):
            case 'sash'+(sashNewId+4):
              delete $scope.templateSourceTEMP.objects[tempObj].openType;
              break;
            case 'sashBlock'+blockId:
              $scope.templateSourceTEMP.objects[tempObj].openDir.length = 0;
              break;
          }
        }

        for(var dir = 0; dir < sashType.length; dir++) {
          switch(sashType[dir]) {
            case 'up':
              for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sash'+(sashNewId+3)) {
                  $scope.templateSourceTEMP.objects[tempObj].openType = ['sashline'+(sashNewId+3), 'sashline'+(sashNewId+1)];
                }
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
                  $scope.templateSourceTEMP.objects[tempObj].openDir.push(1);
                  $scope.templateSourceTEMP.objects[tempObj].handlePos = 1;
                }
              }
              break;
            case 'down':
              for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sash'+(sashNewId+1)) {
                  $scope.templateSourceTEMP.objects[tempObj].openType = ['sashline'+(sashNewId+1), 'sashline'+(sashNewId+3)];
                }
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
                  $scope.templateSourceTEMP.objects[tempObj].openDir.push(3);
                  $scope.templateSourceTEMP.objects[tempObj].handlePos = 3;
                }
              }
              break;
            case 'left':
              for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sash'+(sashNewId+2)) {
                  $scope.templateSourceTEMP.objects[tempObj].openType = ['sashline'+(sashNewId+2), 'sashline'+(sashNewId+4)];
                }
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
                  $scope.templateSourceTEMP.objects[tempObj].openDir.push(4);
                  $scope.templateSourceTEMP.objects[tempObj].handlePos = 4;
                }
              }
              break;
            case 'right':
              for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sash'+(sashNewId+4)) {
                  $scope.templateSourceTEMP.objects[tempObj].openType = ['sashline'+(sashNewId+4), 'sashline'+(sashNewId+2)];
                }
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
                  $scope.templateSourceTEMP.objects[tempObj].openDir.push(2);
                  $scope.templateSourceTEMP.objects[tempObj].handlePos = 2;
                }
              }
              break;
          }
        }

      }

      //console.log('!!!!new.templateSourceTEMP === ', $scope.templateSourceTEMP);
      //-------- build new template
      $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
      //console.log('templateDefaultTEMP', $scope.templateDefaultTEMP.objects);

      $scope.constructData.isSashEditMenu = false;
      $scope.constructData.isSashEdit = false;
      $scope.constructData.activeMenuItem = false;

    }

  }




  //===================== IMPOST

  //=============== CLICK ON IMPOST EDIT MENU

  $scope.insertNewImpost = function() {
    editImpost(arguments);
  };


  //=============== EDIT IMPOST CONSTRUCTION ==============

  function editImpost(impostType) {
    var blockId = Number($scope.selectedGlassId.replace(/\D+/g,"")),
        minLimitSize = 200,
        currLastIndex = blockId * 4,
        currGlassPackage = {},
        insertIndex,
        isSashExist,

        impostIndexes = [],
        impostLineIndexes = [],
        cpImpostIndexes = [],
        beadIndexes = [],
        cpGlassIndexes = [],
        glassIndexes = [],

        lastImpostIndex,
        lastImpostLineIndex,
        lastCPImpostIndex,
        lastBeadIndex,
        lastCPGlassIndex,
        lastGlassIndex,

        blockFromX,
        blockToX,
        blockFromY,
        blockToY,
        widthBlock,
        heightBlock,
        newImpostX,
        newImpostY,
        edgeTopId,
        edgeLeftId,
        edgeBottomId,
        edgeRightId,
        newImpost,
        newBead,
        newGlass;


    //------- get data of current glass package
    for (var t = 0; t < $scope.templateDefaultTEMP.objects.length; t++) {
      if($scope.templateDefaultTEMP.objects[t].id === $scope.selectedGlassId) {
        currGlassPackage = $scope.templateDefaultTEMP.objects[t];
        isSashExist = currGlassPackage.parts[0].fromPoint.blockType;
      }
    }

    //---- find insert index before beads to push new sash
    for (var i = 0; i < $scope.templateDefaultTEMP.objects.length; i++) {
      if ($scope.templateDefaultTEMP.objects[i].type === 'cross_point_bead_out') {
        insertIndex = i;
        break;
      }
    }
    //---- find last numbers of existed impost, bead and glass
    for (var i = 0; i < $scope.templateDefaultTEMP.objects.length; i++) {
      if ($scope.templateDefaultTEMP.objects[i].type === 'fixed_point_impost') {
        impostLineIndexes.push(Number($scope.templateDefaultTEMP.objects[i].id.replace(/\D+/g, "")));
      }
      if ($scope.templateDefaultTEMP.objects[i].type === 'cross_point_impost') {
        cpImpostIndexes.push(Number($scope.templateDefaultTEMP.objects[i].id.replace(/\D+/g, "")));
      }
      if ($scope.templateDefaultTEMP.objects[i].type === 'cross_point_bead_out') {
        beadIndexes.push(Number($scope.templateDefaultTEMP.objects[i].id.replace(/\D+/g, "")));
      }
      if ($scope.templateDefaultTEMP.objects[i].type === 'cross_point_glass') {
        cpGlassIndexes.push(Number($scope.templateDefaultTEMP.objects[i].id.replace(/\D+/g, "")));
      }
      if ($scope.templateDefaultTEMP.objects[i].type === 'glass_paсkage') {
        glassIndexes.push(Number($scope.templateDefaultTEMP.objects[i].id.replace(/\D+/g, "")));
      }
      if ($scope.templateDefaultTEMP.objects[i].type === 'impost') {
        impostIndexes.push(Number($scope.templateDefaultTEMP.objects[i].id.replace(/\D+/g, "")));
      }
    }
    //----- define max number of existed impost, bead and glass
    lastImpostLineIndex = impostLineIndexes.max();
    lastCPImpostIndex = cpImpostIndexes.max();
    lastImpostIndex = impostIndexes.max();
    lastBeadIndex = beadIndexes.max();
    lastCPGlassIndex = cpGlassIndexes.max();
    lastGlassIndex = glassIndexes.max();

/*
    console.log('blockId == ', blockId);
    console.log('currLastIndex == ', currLastIndex);
    console.log('lastImpostIndex == ', lastImpostIndex);
    console.log('lastImpostLineIndex == ', lastImpostLineIndex);
    console.log('lastCPImpostIndex == ', lastCPImpostIndex);
    console.log('lastBeadIndex == ', lastBeadIndex);
    console.log('lastCPGlassIndex == ', lastCPGlassIndex);
    console.log('lastGlassIndex == ', lastGlassIndex);
 */
    console.log('currGlassPackage == ', currGlassPackage);

    //------ VERTICAL IMPOST
    if(impostType[0] === 'vert') {
      blockFromX = currGlassPackage.parts[0].fromPoint.x;
      blockToX = currGlassPackage.parts[0].toPoint.x;
      widthBlock = blockToX - blockFromX;

      //------- allow insert impost if widthBlock > 250
      if(widthBlock > minLimitSize) {

        //------- define new impost X & Y coordinates
        newImpostX = +blockFromX + (widthBlock / 2);
        newImpostY = currGlassPackage.parts[0].toPoint.line2.toPoint.y;
        edgeTopId = currGlassPackage.parts[0].toPoint.lineId1;
        edgeLeftId = currGlassPackage.parts[0].toPoint.lineId2;
        edgeBottomId = currGlassPackage.parts[2].toPoint.lineId1;

        //-------- build new Impost
        newImpost = [
          {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 1), x: newImpostX, y: 0 },
          {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 2), x: newImpostX, y: newImpostY},
          {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 1), from: 'fpimpost' + (lastImpostLineIndex + 1), to: 'fpimpost' + (lastImpostLineIndex + 2), lineType: 'frame'},
          {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 2), from: 'fpimpost' + (lastImpostLineIndex + 2), to: 'fpimpost' + (lastImpostLineIndex + 1), lineType: 'frame'},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 1), line1: edgeTopId, line2: 'impostcenterline' + (lastImpostLineIndex + 1)},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 2), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 3), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 4), line1: 'impostcenterline' + (lastImpostLineIndex + 1), line2: edgeBottomId},
          {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 1), from: 'cpimpost' + (lastCPImpostIndex + 1), to: 'cpimpost' + (lastCPImpostIndex + 4)},
          {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 2), from: 'cpimpost' + (lastCPImpostIndex + 3), to: 'cpimpost' + (lastCPImpostIndex + 2)},
          {'type': 'impost', id: 'impost' + (lastImpostIndex + 1), parts: ['impostinline' + (lastImpostLineIndex + 1), 'impostinline' + (lastImpostLineIndex + 2)]}
        ];

        //-------- build new Bead
        newBead = [
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+1), line1: edgeTopId, line2: edgeLeftId},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+2), line1: edgeLeftId, line2: edgeBottomId},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+3), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+4), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+1), from:'cpbeadout'+(lastBeadIndex+4), to:'cpbeadout'+(lastBeadIndex+1)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+2), from:'cpbeadout'+(lastBeadIndex+1), to:'cpbeadout'+(lastBeadIndex+2)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+3), from:'cpbeadout'+(lastBeadIndex+2), to:'cpbeadout'+(lastBeadIndex+3)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+4), from:'cpbeadout'+(lastBeadIndex+3), to:'cpbeadout'+(lastBeadIndex+4)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+1), line1: 'beadline'+(lastBeadIndex+1), line2: 'beadline'+(lastBeadIndex+2)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+2), line1: 'beadline'+(lastBeadIndex+2), line2: 'beadline'+(lastBeadIndex+3)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+3), line1: 'beadline'+(lastBeadIndex+3), line2: 'beadline'+(lastBeadIndex+4)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+4), line1: 'beadline'+(lastBeadIndex+4), line2: 'beadline'+(lastBeadIndex+1)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+1), from:'cpbead'+(lastBeadIndex+4), to:'cpbead'+(lastBeadIndex+1)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+2), from:'cpbead'+(lastBeadIndex+1), to:'cpbead'+(lastBeadIndex+2)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+3), from:'cpbead'+(lastBeadIndex+2), to:'cpbead'+(lastBeadIndex+3)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+4), from:'cpbead'+(lastBeadIndex+3), to:'cpbead'+(lastBeadIndex+4)},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+1), parts: ['beadline'+(lastBeadIndex+1), 'beadinline'+(lastBeadIndex+1)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+2), parts: ['beadline'+(lastBeadIndex+2), 'beadinline'+(lastBeadIndex+2)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+3), parts: ['beadline'+(lastBeadIndex+3), 'beadinline'+(lastBeadIndex+3)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+4), parts: ['beadline'+(lastBeadIndex+4), 'beadinline'+(lastBeadIndex+4)]}
        ];
        //-------- build new Glass
        newGlass = [
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+1), line1: edgeTopId, line2: edgeLeftId},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+2), line1: edgeLeftId, line2: edgeBottomId},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+3), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+4), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+1), from: 'cpg'+(lastCPGlassIndex+4), to: 'cpg'+(lastCPGlassIndex+1)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+2), from: 'cpg'+(lastCPGlassIndex+1), to: 'cpg'+(lastCPGlassIndex+2)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+3), from: 'cpg'+(lastCPGlassIndex+2), to: 'cpg'+(lastCPGlassIndex+3)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+4), from: 'cpg'+(lastCPGlassIndex+3), to: 'cpg'+(lastCPGlassIndex+4)},
          {'type': 'glass_paсkage', id: 'glass'+(lastGlassIndex+1), parts: ['glassline'+(lastCPGlassIndex+1), 'glassline'+(lastCPGlassIndex+2), 'glassline'+(lastCPGlassIndex+3), 'glassline'+(lastCPGlassIndex+4)]}
        ];

        //--------- added blockType properties
        for(var j = 0; j < newImpost.length; j++) {
          if (newImpost[j].type === 'cross_point_impost') {
            newImpost[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }
        for(var j = 0; j < newBead.length; j++) {
          if (newBead[j].type === 'cross_point_bead_out') {
            newBead[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }
        for(var j = 0; j < newGlass.length; j++) {
          if (newGlass[j].type === 'cross_point_glass') {
            newGlass[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }


        //console.log('newImpost = ', newImpost);
        //console.log('newBead = ', newBead);
        //console.log('newGlass = ', newGlass);
        //----------- INSERT new glass in template Source
        for (var tempObj = 0; tempObj < newGlass.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newGlass[tempObj]);
        }
        //----------- INSERT new bead in template Source
        for (var tempObj = 0; tempObj < newBead.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newBead[tempObj]);
        }
        //----------- INSERT new impost in template Source
        for (var tempObj = 0; tempObj < newImpost.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newImpost[tempObj]);
        }

        //----------- change existed beads and glass package
        for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {

          //------- change beads position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead_out') {
            if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-3)) {
              $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-2)) {
              $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
            }
          }

          //------- change glass position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_glass') {
            if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-3)) {
              $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-2)) {
              $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
            }
          }
        }

        //console.log('!!!!new.templateSourceTEMP === ', JSON.stringify($scope.templateSourceTEMP));
        //console.log('!!!!new.templateSourceTEMP === ', $scope.templateSourceTEMP);
        //-------- build new template
        $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
        //console.log('templateDefaultTEMP == ', $scope.templateDefaultTEMP.objects);

        $scope.constructData.isImpostEditMenu = false;
        $scope.constructData.isImpostEdit = false;
        $scope.constructData.activeMenuItem = false;


      } else {
        playTTS($filter('translate')('construction.VOICE_SMALL_GLASS_BLOCK'), $scope.global.voiceHelperLanguage);
      }



    //------ HORISONTAL IMPOST

    } else if(impostType[0] === 'horis') {
      blockFromX = currGlassPackage.parts[1].fromPoint.y;
      blockToX = currGlassPackage.parts[1].toPoint.y;
      widthBlock = blockToX - blockFromX;

      //------- allow insert impost if widthBlock > 250
      if(widthBlock > minLimitSize) {
        //console.log('blockFromX == ', blockFromX);
        //console.log('blockToX == ', blockToX);
        //console.log('widthBlock == ', widthBlock);

        //------- define new impost X & Y coordinates
        newImpostX = +blockFromX + (widthBlock / 2);
        newImpostY = currGlassPackage.parts[1].toPoint.line2.fromPoint.x;
        edgeTopId = currGlassPackage.parts[1].toPoint.lineId1;
        edgeLeftId = currGlassPackage.parts[1].toPoint.lineId2;
        edgeBottomId = currGlassPackage.parts[3].toPoint.lineId1;

        //console.log('newImpostX', newImpostX);
        //console.log('newImpostY', newImpostY);
        //console.log('edgeTopId', edgeTopId);
        //console.log('edgeLeftId', edgeLeftId);
        //console.log('edgeBottomId',edgeBottomId);


        //-------- build new Impost
        newImpost = [
          {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 1), x: newImpostY, y: newImpostX},
          {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 2), x: 0, y: newImpostX},
          {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 1), from: 'fpimpost' + (lastImpostLineIndex + 1), to: 'fpimpost' + (lastImpostLineIndex + 2), lineType: 'frame'},
          {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 2), from: 'fpimpost' + (lastImpostLineIndex + 2), to: 'fpimpost' + (lastImpostLineIndex + 1), lineType: 'frame'},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 1), line1: edgeTopId, line2: 'impostcenterline' + (lastImpostLineIndex + 1)},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 2), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 3), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 4), line1: 'impostcenterline' + (lastImpostLineIndex + 1), line2: edgeBottomId},
          {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 1), from: 'cpimpost' + (lastCPImpostIndex + 1), to: 'cpimpost' + (lastCPImpostIndex + 4)},
          {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 2), from: 'cpimpost' + (lastCPImpostIndex + 3), to: 'cpimpost' + (lastCPImpostIndex + 2)},
          {'type': 'impost', id: 'impost' + (lastImpostIndex + 1), parts: ['impostinline' + (lastImpostLineIndex + 1), 'impostinline' + (lastImpostLineIndex + 2)]}
        ];

        //-------- build new Bead
        newBead = [
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+1), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+2), line1: edgeTopId, line2: edgeLeftId},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+3), line1: edgeLeftId, line2: edgeBottomId},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+4), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+1), from:'cpbeadout'+(lastBeadIndex+4), to:'cpbeadout'+(lastBeadIndex+1)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+2), from:'cpbeadout'+(lastBeadIndex+1), to:'cpbeadout'+(lastBeadIndex+2)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+3), from:'cpbeadout'+(lastBeadIndex+2), to:'cpbeadout'+(lastBeadIndex+3)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+4), from:'cpbeadout'+(lastBeadIndex+3), to:'cpbeadout'+(lastBeadIndex+4)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+1), line1: 'beadline'+(lastBeadIndex+1), line2: 'beadline'+(lastBeadIndex+2)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+2), line1: 'beadline'+(lastBeadIndex+2), line2: 'beadline'+(lastBeadIndex+3)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+3), line1: 'beadline'+(lastBeadIndex+3), line2: 'beadline'+(lastBeadIndex+4)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+4), line1: 'beadline'+(lastBeadIndex+4), line2: 'beadline'+(lastBeadIndex+1)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+1), from:'cpbead'+(lastBeadIndex+4), to:'cpbead'+(lastBeadIndex+1)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+2), from:'cpbead'+(lastBeadIndex+1), to:'cpbead'+(lastBeadIndex+2)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+3), from:'cpbead'+(lastBeadIndex+2), to:'cpbead'+(lastBeadIndex+3)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+4), from:'cpbead'+(lastBeadIndex+3), to:'cpbead'+(lastBeadIndex+4)},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+1), parts: ['beadline'+(lastBeadIndex+1), 'beadinline'+(lastBeadIndex+1)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+2), parts: ['beadline'+(lastBeadIndex+2), 'beadinline'+(lastBeadIndex+2)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+3), parts: ['beadline'+(lastBeadIndex+3), 'beadinline'+(lastBeadIndex+3)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+4), parts: ['beadline'+(lastBeadIndex+4), 'beadinline'+(lastBeadIndex+4)]}
        ];
        //-------- build new Glass
        newGlass = [
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+1), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+2), line1: edgeTopId, line2: edgeLeftId},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+3), line1: edgeLeftId, line2: edgeBottomId},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+4), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+1), from: 'cpg'+(lastCPGlassIndex+4), to: 'cpg'+(lastCPGlassIndex+1)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+2), from: 'cpg'+(lastCPGlassIndex+1), to: 'cpg'+(lastCPGlassIndex+2)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+3), from: 'cpg'+(lastCPGlassIndex+2), to: 'cpg'+(lastCPGlassIndex+3)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+4), from: 'cpg'+(lastCPGlassIndex+3), to: 'cpg'+(lastCPGlassIndex+4)},
          {'type': 'glass_paсkage', id: 'glass'+(lastGlassIndex+1), parts: ['glassline'+(lastCPGlassIndex+1), 'glassline'+(lastCPGlassIndex+2), 'glassline'+(lastCPGlassIndex+3), 'glassline'+(lastCPGlassIndex+4)]}
        ];

        //--------- added blockType properties
        for(var j = 0; j < newImpost.length; j++) {
          if (newImpost[j].type === 'cross_point_impost') {
            newImpost[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }
        for(var j = 0; j < newBead.length; j++) {
          if (newBead[j].type === 'cross_point_bead_out') {
            newBead[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }
        for(var j = 0; j < newGlass.length; j++) {
          if (newGlass[j].type === 'cross_point_glass') {
            newGlass[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }


        //console.log('newImpost = ', newImpost);
        //console.log('newBead = ', newBead);
        //console.log('newGlass = ', newGlass);
        //----------- INSERT new glass in template Source
        for (var tempObj = 0; tempObj < newGlass.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newGlass[tempObj]);
        }
        //----------- INSERT new bead in template Source
        for (var tempObj = 0; tempObj < newBead.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newBead[tempObj]);
        }
        //----------- INSERT new impost in template Source
        for (var tempObj = 0; tempObj < newImpost.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newImpost[tempObj]);
        }

        //----------- change existed beads and glass package
        for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {

          //------- change beads position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead_out') {
            if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-2)) {
              $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-1)) {
              $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
            }
          }

          //------- change glass position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_glass') {
            if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-2)) {
              $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-1)) {
              $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
            }
          }
        }

        //console.log('!!!!new.templateSourceTEMP === ', JSON.stringify($scope.templateSourceTEMP));
        //console.log('!!!!new.templateSourceTEMP === ', $scope.templateSourceTEMP);
        //-------- build new template
        $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
        console.log('templateDefaultTEMP == ', $scope.templateDefaultTEMP.objects);

        $scope.constructData.isImpostEditMenu = false;
        $scope.constructData.isImpostEdit = false;
        $scope.constructData.activeMenuItem = false;


      } else {
        playTTS($filter('translate')('construction.VOICE_SMALL_GLASS_BLOCK'), $scope.global.voiceHelperLanguage);
      }

    //------ CORNER IMPOST
    } else if(impostType[0] === 'angel-top') {

      blockFromX = currGlassPackage.parts[0].fromPoint.x;
      blockToX = currGlassPackage.parts[0].toPoint.x;
      blockFromY = currGlassPackage.parts[1].fromPoint.y;
      blockToY = currGlassPackage.parts[1].toPoint.y;
      widthBlock = blockToX - blockFromX;
      heightBlock = blockToY - blockFromY;


      //------- allow insert impost if widthBlock > 250
      if(widthBlock > minLimitSize && heightBlock > minLimitSize) {

        //------- define new impost X & Y coordinates
        newImpostX = +blockFromX + (widthBlock / 2);
        newImpostY = +blockFromY + (heightBlock / 2);
        edgeTopId = currGlassPackage.parts[0].toPoint.lineId1;
        edgeLeftId = currGlassPackage.parts[0].toPoint.lineId2;
        edgeBottomId = currGlassPackage.parts[2].toPoint.lineId1;
        edgeRightId = currGlassPackage.parts[2].toPoint.lineId2;
        console.log('edgeTopId == ', edgeTopId);
        console.log('edgeLeftId ==', edgeLeftId);
        console.log('edgeBottomId ==', edgeBottomId);



        var x1 = newImpostX,
            y1 = 0,
            x2 = 0,
            y2 = newImpostY;

        var lengthVal = Math.round(Math.sqrt( Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2) ) * 100) / 100;

        var coefA = (y1 - y2);
        var coefB = (x2 - x1);
        var coefC = (x1*y2 - x2*y1);

        for(var i = 0; i < currGlassPackage.parts.length; i ++) {
          var oldX = currGlassPackage.parts[i].toPoint.x;
          var oldY = currGlassPackage.parts[i].toPoint.y;
          var newX = ((-coefC) - (coefB * oldY)) / coefA;
          console.log('id', currGlassPackage.parts[i].toPointId);
          console.log('oldX', oldX);
          console.log('newX', newX);
        }

  /*
        //-------- build new Impost
        newImpost = [
          {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 1), x: newImpostX, y: 0 },
          {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 2), x: 0, y: newImpostY},
          {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 1), from: 'fpimpost' + (lastImpostLineIndex + 1), to: 'fpimpost' + (lastImpostLineIndex + 2), lineType: 'frame'},
          {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 2), from: 'fpimpost' + (lastImpostLineIndex + 2), to: 'fpimpost' + (lastImpostLineIndex + 1), lineType: 'frame'},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 1), line1: edgeTopId, line2: 'impostcenterline' + (lastImpostLineIndex + 1)},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 2), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 3), line1: edgeRightId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 4), line1: 'impostcenterline' + (lastImpostLineIndex + 1), line2: edgeRightId},
          {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 1), from: 'cpimpost' + (lastCPImpostIndex + 1), to: 'cpimpost' + (lastCPImpostIndex + 4)},
          {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 2), from: 'cpimpost' + (lastCPImpostIndex + 3), to: 'cpimpost' + (lastCPImpostIndex + 2)},
          {'type': 'impost', id: 'impost' + (lastImpostIndex + 1), parts: ['impostinline' + (lastImpostLineIndex + 1), 'impostinline' + (lastImpostLineIndex + 2)]}
        ];


        //-------- build new Bead
        newBead = [
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+1), line1: edgeTopId, line2: edgeLeftId},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+2), line1: edgeLeftId, line2: edgeBottomId},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+3), line1: edgeBottomId, line2: edgeRightId},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+4), line1: edgeRightId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+5), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+1), from:'cpbeadout'+(lastBeadIndex+5), to:'cpbeadout'+(lastBeadIndex+1)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+2), from:'cpbeadout'+(lastBeadIndex+1), to:'cpbeadout'+(lastBeadIndex+2)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+3), from:'cpbeadout'+(lastBeadIndex+2), to:'cpbeadout'+(lastBeadIndex+3)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+4), from:'cpbeadout'+(lastBeadIndex+3), to:'cpbeadout'+(lastBeadIndex+4)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+5), from:'cpbeadout'+(lastBeadIndex+4), to:'cpbeadout'+(lastBeadIndex+5)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+1), line1: 'beadline'+(lastBeadIndex+1), line2: 'beadline'+(lastBeadIndex+2)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+2), line1: 'beadline'+(lastBeadIndex+2), line2: 'beadline'+(lastBeadIndex+3)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+3), line1: 'beadline'+(lastBeadIndex+3), line2: 'beadline'+(lastBeadIndex+4)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+4), line1: 'beadline'+(lastBeadIndex+4), line2: 'beadline'+(lastBeadIndex+5)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+5), line1: 'beadline'+(lastBeadIndex+5), line2: 'beadline'+(lastBeadIndex+1)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+1), from:'cpbead'+(lastBeadIndex+5), to:'cpbead'+(lastBeadIndex+1)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+2), from:'cpbead'+(lastBeadIndex+1), to:'cpbead'+(lastBeadIndex+2)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+3), from:'cpbead'+(lastBeadIndex+2), to:'cpbead'+(lastBeadIndex+3)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+4), from:'cpbead'+(lastBeadIndex+3), to:'cpbead'+(lastBeadIndex+4)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+5), from:'cpbead'+(lastBeadIndex+4), to:'cpbead'+(lastBeadIndex+5)},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+1), parts: ['beadline'+(lastBeadIndex+1), 'beadinline'+(lastBeadIndex+1)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+2), parts: ['beadline'+(lastBeadIndex+2), 'beadinline'+(lastBeadIndex+2)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+3), parts: ['beadline'+(lastBeadIndex+3), 'beadinline'+(lastBeadIndex+3)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+4), parts: ['beadline'+(lastBeadIndex+4), 'beadinline'+(lastBeadIndex+4)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+5), parts: ['beadline'+(lastBeadIndex+5), 'beadinline'+(lastBeadIndex+5)]}
        ];
        *//*
        //-------- build new Glass
        newGlass = [
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+1), line1: edgeTopId, line2: edgeLeftId},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+2), line1: edgeLeftId, line2: edgeBottomId},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+3), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+4), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+1), from: 'cpg'+(lastCPGlassIndex+4), to: 'cpg'+(lastCPGlassIndex+1)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+2), from: 'cpg'+(lastCPGlassIndex+1), to: 'cpg'+(lastCPGlassIndex+2)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+3), from: 'cpg'+(lastCPGlassIndex+2), to: 'cpg'+(lastCPGlassIndex+3)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+4), from: 'cpg'+(lastCPGlassIndex+3), to: 'cpg'+(lastCPGlassIndex+4)},
          {'type': 'glass_paсkage', id: 'glass'+(lastGlassIndex+1), parts: ['glassline'+(lastCPGlassIndex+1), 'glassline'+(lastCPGlassIndex+2), 'glassline'+(lastCPGlassIndex+3), 'glassline'+(lastCPGlassIndex+4)]}
        ];
*//*
        //--------- added blockType properties
        for(var j = 0; j < newImpost.length; j++) {
          if (newImpost[j].type === 'cross_point_impost') {
            newImpost[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }
        for(var j = 0; j < newBead.length; j++) {
          if (newBead[j].type === 'cross_point_bead_out') {
            newBead[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }
        *//*
        for(var j = 0; j < newGlass.length; j++) {
          if (newGlass[j].type === 'cross_point_glass') {
            newGlass[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }


        console.log('newImpost = ', newImpost);
        //console.log('newBead = ', newBead);
        //console.log('newGlass = ', newGlass);
        //----------- INSERT new glass in template Source
        for (var tempObj = 0; tempObj < newGlass.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newGlass[tempObj]);
        }
         *//*
        //----------- INSERT new bead in template Source
        for (var tempObj = 0; tempObj < newBead.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newBead[tempObj]);
        }

        //----------- INSERT new impost in template Source
        for (var tempObj = 0; tempObj < newImpost.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newImpost[tempObj]);
        }

        //----------- change existed beads and glass package
        for(var tempObj = $scope.templateSourceTEMP.objects.length-1; tempObj >= 0; tempObj--) {

          //------- change beads position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'bead_box') {
            if($scope.templateSourceTEMP.objects[tempObj].id === 'bead'+(currLastIndex)) {
              $scope.templateSourceTEMP.objects.splice(tempObj, 1);
            }
          }
          if($scope.templateSourceTEMP.objects[tempObj].type === 'bead_in_line') {
            if($scope.templateSourceTEMP.objects[tempObj].id === 'beadinline'+(currLastIndex)) {
              $scope.templateSourceTEMP.objects.splice(tempObj, 1);
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'beadinline'+(currLastIndex-3)) {
              $scope.templateSourceTEMP.objects[tempObj].from = 'cpbead'+(currLastIndex-1);
            }
          }
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead') {
            if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbead'+(currLastIndex)) {
              $scope.templateSourceTEMP.objects.splice(tempObj, 1);
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbead'+(currLastIndex-1)) {
              $scope.templateSourceTEMP.objects[tempObj].line2 = 'beadline'+(currLastIndex-3);
            }
          }
          if($scope.templateSourceTEMP.objects[tempObj].type === 'bead_line') {
            if($scope.templateSourceTEMP.objects[tempObj].id === 'beadline'+(currLastIndex)) {
              $scope.templateSourceTEMP.objects.splice(tempObj, 1);
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'beadline'+(currLastIndex-3)) {
              $scope.templateSourceTEMP.objects[tempObj].from = 'cpbeadout'+(currLastIndex-1);
            }
          }
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead_out') {
            if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-3)) {
              $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-2)) {
              $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
              $scope.templateSourceTEMP.objects[tempObj].line2 = edgeRightId;
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-1)) {
              $scope.templateSourceTEMP.objects[tempObj].line1 = edgeRightId;
              $scope.templateSourceTEMP.objects[tempObj].line2 = edgeTopId;
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex)) {
              $scope.templateSourceTEMP.objects.splice(tempObj, 1);
            }
          }

          *//*
          //------- change glass position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_glass') {



            if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-3)) {
              $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-2)) {
              $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
            }
          }

          {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'}, // new im
          {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'}, // new im 4
          {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'}, // 4 - 1
          //{'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
          {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
          {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
          {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
          //{'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},

          {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
        *//*
        }

        console.log('!!!!new.templateSourceTEMP === ', JSON.stringify($scope.templateSourceTEMP));
        //console.log('!!!!new.templateSourceTEMP === ', $scope.templateSourceTEMP);
        //-------- build new template
        $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
        console.log('templateDefaultTEMP == ', $scope.templateDefaultTEMP.objects);

        $scope.constructData.isImpostEditMenu = false;
        $scope.constructData.isImpostEdit = false;
        $scope.constructData.activeMenuItem = false;
*/

      } else {
        playTTS($filter('translate')('construction.VOICE_SMALL_GLASS_BLOCK'), $scope.global.voiceHelperLanguage);
      }

    }


  }





}]);
