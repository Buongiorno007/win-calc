
// controllers/construction.js

/* globals BauVoiceApp, STEP, deactiveSizeBox */

'use strict';

BauVoiceApp.controller('ConstructionCtrl', ['$scope', 'constructService', 'localStorage', '$location', function ($scope, constructService, localStorage, $location) {

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
    DELAY_SHOW_FIGURE_ITEM: 2000,
    typing: 'on'
  };

  $scope.openVoiceHelper = false;
  $scope.loudVoice = false;
  $scope.quietVoice = false;

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
  $('svg-template').off().on("click", ".size-box-edited", function() {
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
        startRecognition(doneRecognition, recognitionProgress);

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

  function recognitionProgress(value) {
    if (value > 100) {
      console.log(value);
      $scope.loudVoice = true;
      $scope.quietVoice = false;

    } else {
      console.log(value);
      $scope.loudVoice = false;
      $scope.quietVoice = true;
    }
    $scope.$apply();

  }

  function doneRecognition(value) {
    console.log("doneRecognition" + value);
    $scope.voiceTxt = value;
    $scope.$apply();
    setTimeout(function() {
      var intValue = parseStringToDimension(value);
      if (intValue == "NaN") {
        intValue = "0";
      }
      playTTS(intValue);
      setValueSize(intValue);
      $scope.$apply();
    }, 1000)
  }


  //-------- Get number from calculator
  function setValueSize(newValue) {

    if($scope.openVoiceHelper) {

      var tempVal = parseInt(newValue, 10);
       console.log('tempVal', tempVal);
        $scope.voiceTxt = '';
        $scope.openVoiceHelper = false;

        if ((tempVal > 0) && (tempVal < 10000)) {
          $scope.constructData.tempSize = ("" + tempVal).split('');
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
      console.log($scope.constructData.tempSize);
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
          $scope.constructData.isMinSizeRestriction = true;
          $scope.constructData.isMaxSizeRestriction = false;
        } else if(newLength > $scope.constructData.maxSizeLimit) {
          $scope.constructData.isMinSizeRestriction = false;
          $scope.constructData.isMaxSizeRestriction = true;
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

  $('svg-template').off().on("click", ".glass", function(event) {
    if($scope.constructData.isSashEdit) {

      if(!$scope.constructData.isSashEditMenu) {
        $scope.constructData.isSashEditMenu = true;
        editSash(event);
      } else {
        $scope.constructData.isSashEditMenu = false;
      }
$scope.$apply();
    } else if($scope.constructData.isAngelEdit) {
      console.log('angel');
    } else if($scope.constructData.isImpostEdit) {
      console.log('impost');
    } else if($scope.constructData.isArchEdit) {
      console.log('arch');
    } else if($scope.constructData.isPositionEdit) {
      console.log('position');
    }
  });



  //=============== EDIT SASH CONSTRUCTION ==============

  function editSash(event) {
    var menuX = event.pageX;
    var menuY = event.pageY;
    var menuX = event.clientX
    $('#sash-shape-menu').css({'top': menuX+'px', 'left': menuY+'px'});
    console.log('sash-menu === ', $('#sash-shape-menu'));
    console.log('menuX === ', menuX);
    $('svg-template').find('.glass').each(function() {
      console.log('sash!!!!', $(this));

      //$(this).addClass('glass-active');
      $(this).css('fill', 'rgba(34, 34, 255, 0.69)');
    });

  }

}]);

