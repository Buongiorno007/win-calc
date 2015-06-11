
// controllers/design.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('DesignModule')
    .controller('DesignCtrl', designPageCtrl);

  function designPageCtrl($timeout, globalConstants, DesignServ, GlobalStor, ProductStor, DesignStor) {

    var thisCtrl = this;

    var $svgContainer = $('svg-template');

    thisCtrl.constants = globalConstants;
    thisCtrl.G = GlobalStor;
    thisCtrl.P = ProductStor;
    thisCtrl.D = DesignStor;

    //------- set current Page
    GlobalStor.global.currOpenPage = 'design';

    thisCtrl.config = {
      //---- design menu
      activeMenuItem: 0,
      isDesignError: 0,
//      isSashEdit: false,
//      isAngelEdit: false,
//      isImpostEdit: false,
//      isArchEdit: false,
//      isPositionEdit: false,
//      isSashEditMenu: false,
//      isImpostEditMenu: false,

      //----- door
      isDoorConfig: 0,
      selectedStep1: 0,
      selectedStep2: 0,
      selectedStep3: 0,
      selectedStep4: 0,

      DELAY_SHOW_FIGURE_ITEM: 1000,
      typing: 'on'
    };

    //--------- set template from ProductStor
    DesignServ.setDefaultTemplate();

    //============ if Door Construction
    if(ProductStor.product.constructionType === 4) {
      DesignServ.downloadDoorConfig();
    }



    //------ clicking
    thisCtrl.designSaved = DesignServ.designSaved;
    thisCtrl.designCancel = DesignServ.designCancel;
    thisCtrl.selectMenuItem = selectMenuItem;
    thisCtrl.setDefaultConstruction = DesignServ.setDefaultConstruction;

    //----- door config
    thisCtrl.toggleDoorConfig = toggleDoorConfig;
    thisCtrl.selectDoor = selectDoor;
    thisCtrl.selectSash = selectSash;
    thisCtrl.selectHandle = selectHandle;
    thisCtrl.selectLock = selectLock;
    thisCtrl.closeDoorConfig = closeDoorConfig;
    thisCtrl.saveDoorConfig = saveDoorConfig;

    //------ edit design
    thisCtrl.insertSash = insertSash;
    thisCtrl.insertCorner = insertCorner;
    thisCtrl.insertArc = insertArc;
    thisCtrl.insertNewImpost = editImpost;

    thisCtrl.stepBack = DesignServ.stepBack;





    //============ methods ================//


    //--------Select menu item
    function selectMenuItem(id) {
      thisCtrl.config.activeMenuItem = (thisCtrl.config.activeMenuItem === id) ? 0 : id;
      hideCornerMarks();
      deselectAllArc();
      deselectAllGlass();
//      deactivateShapeMenu();
//      thisCtrl.config.isSashEditMenu = false;
//      thisCtrl.config.isImpostEditMenu = false;
//      manipulationWithGlasses(thisCtrl.config.activeMenuItem);

      switch(thisCtrl.config.activeMenuItem) {
        case 1:
          showAllAvailableGlass();
          break;
        case 2:
          showAllAvailableCorner();
          break;
        case 3:
//          thisCtrl.config.isImpostEdit = true;
//          manipulationWithGlasses(thisCtrl.config.isImpostEdit);
          break;
        case 4:
          showAllAvailableArc();
          break;
        case 5:
//          thisCtrl.config.isPositionEdit = true;
          break;
      }
    }


    function showDesignError() {
      thisCtrl.config.isDesignError = 1;
      thisCtrl.config.activeMenuItem = 0;
      $timeout(function(){
        thisCtrl.config.isDesignError = 0;
      }, 500);
    }


    //++++++++++ Edit Sash ++++++++++//

    function showAllAvailableGlass() {

      var glasses = d3.selectAll('#tamlateSVG .glass');
      DesignStor.design.selectedGlass = glasses;
      glasses.classed('glass-active', true);

      glasses.on('click', function() {
        var glass = d3.select(this);
        deselectAllGlass();
        glass.classed('glass-active', true);
        DesignStor.design.selectedGlass = glass;
      });
    }



    function deselectAllGlass() {
      d3.selectAll('#tamlateSVG .glass').classed('glass-active', false);
    }



    function insertSash(sashType, event) {
      event.srcEvent.stopPropagation();
      thisCtrl.config.activeMenuItem = 0;
      deselectAllGlass();

      var glassQty = DesignStor.design.selectedGlass[0].length,
          i = 0;
      switch(sashType) {
        //----- delete sash
        case 1:
          for(; i < glassQty; i++) {
            DesignServ.deleteSash(DesignStor.design.selectedGlass[0][i]);
          }
          break;
        //----- insert sash
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          for(; i < glassQty; i++) {
            DesignServ.createSash(sashType, DesignStor.design.selectedGlass[0][i]);
          }
          break;
      }

    }



    //++++++++++ Edit Corner ++++++++//

    //-------- show all Corner Marks
    function showAllAvailableCorner() {
      var corners = d3.selectAll('#tamlateSVG .corner_mark');
      if(corners[0].length) {
        corners.transition()
          .duration(300)
          .ease("linear")
          .attr('r', 50);

        DesignStor.design.selectedCorner = corners;
        corners.on('click', function () {
          //----- hide all cornerMark
          hideCornerMarks();

          //----- show selected cornerMark
          var corner = d3.select(this)
            .transition()
            .duration(300)
            .ease("linear")
            .attr('r', 50);
          DesignStor.design.selectedCorner = corner;

        });

      } else {
        showDesignError();
      }

    }

    function insertCorner(conerType, event) {
      event.srcEvent.stopPropagation();
      thisCtrl.config.activeMenuItem = 0;
      hideCornerMarks();
//      console.log('DesignStor.selectedCorner = ', DesignStor.design.selectedCorner);
      var cornerQty = DesignStor.design.selectedCorner[0].length,
          i = 0;
      switch(conerType) {
        //----- delete
        case 1:
          for(; i < cornerQty; i++) {
            DesignServ.deleteCornerPoints(DesignStor.design.selectedCorner[0][i]);
          }
          break;
        //----- line angel
        case 2:
          for(; i < cornerQty; i++) {
            DesignServ.setCornerPoints(DesignStor.design.selectedCorner[0][i]);
          }
          break;
        //----- curv angel
        case 3:
          for(; i < cornerQty; i++) {
            DesignServ.setCurvCornerPoints(DesignStor.design.selectedCorner[0][i]);
          }
          break;
      }
    }

    function hideCornerMarks() {
      d3.selectAll('#tamlateSVG .corner_mark')
        .transition()
        .duration(300)
        .ease("linear")
        .attr('r', 0);
    }



    //++++++++++ Edit Arc ++++++++//

    function showAllAvailableArc() {
      var arcs = [],
          frames = d3.selectAll('#tamlateSVG .frame');

      arcs.push(frames[0].filter(function(item) {
        if(item.__data__.type === 'frame' || item.__data__.type === 'arc') {
          return true;
        }
      }));
      DesignStor.design.selectedArc = arcs;

      d3.selectAll(arcs[0])
        .classed('active_svg', true)
        .on('click', function() {
          deselectAllArc();
          var arc = d3.select(this);
          arc.classed('active_svg', true);
          DesignStor.design.selectedArc = arc;
        });

    }


    function insertArc(arcType, event) {
      event.srcEvent.stopPropagation();
      thisCtrl.config.activeMenuItem = 0;
      deselectAllArc();
      console.log('DesignStor.selectedCorner = ', DesignStor.design.selectedArc);

      var arcQty = DesignStor.design.selectedArc[0].length,
          i = 0;
      switch(arcType) {
        //----- delete arc
        case 1:
          for(; i < arcQty; i++) {
            DesignServ.deleteArc(DesignStor.design.selectedArc[0][i]);
          }
          break;
        //----- insert arc
        case 2:
          for(; i < arcQty; i++) {
            DesignServ.createArc(DesignStor.design.selectedArc[0][i]);
          }
          break;
      }

    }


    function deselectAllArc() {
      d3.selectAll('#tamlateSVG .frame').classed('active_svg', false);
    }





    //============= DOOR ===============//

    //---------- Show Door Configuration
    function toggleDoorConfig() {
      thisCtrl.config.isDoorConfig = 1;
      //----- set emplty index values
      DesignStor.design.doorConfig.doorShapeIndex = '';
      DesignStor.design.doorConfig.sashShapeIndex = '';
      DesignStor.design.doorConfig.handleShapeIndex = '';
      DesignStor.design.doorConfig.lockShapeIndex = '';
    }

    //---------- Select door shape
    function selectDoor(id) {
      if(!thisCtrl.config.selectedStep2) {
        if(DesignStor.design.doorConfig.doorShapeIndex === id) {
          DesignStor.design.doorConfig.doorShapeIndex = '';
          thisCtrl.config.selectedStep1 = 0;
        } else {
          DesignStor.design.doorConfig.doorShapeIndex = id;
          thisCtrl.config.selectedStep1 = 1;
        }
      }
    }
    //---------- Select sash shape
    function selectSash(id) {
      if(!thisCtrl.config.selectedStep3) {
        if(DesignStor.design.doorConfig.sashShapeIndex === id) {
          DesignStor.design.doorConfig.sashShapeIndex = '';
          thisCtrl.config.selectedStep2 = 0;
        } else {
          DesignStor.design.doorConfig.sashShapeIndex = id;
          thisCtrl.config.selectedStep2 = 1;
        }
      }
    }
    //-------- Select handle shape
    function selectHandle(id) {
      if(!thisCtrl.config.selectedStep4) {
        if(DesignStor.design.doorConfig.handleShapeIndex === id) {
          DesignStor.design.doorConfig.handleShapeIndex = '';
          thisCtrl.config.selectedStep3 = 0;
        } else {
          DesignStor.design.doorConfig.handleShapeIndex = id;
          thisCtrl.config.selectedStep3 = 1;
        }
      }
    }
    //--------- Select lock shape
    function selectLock(id) {
      if(DesignStor.design.doorConfig.lockShapeIndex === id) {
        DesignStor.design.doorConfig.lockShapeIndex = '';
        thisCtrl.config.selectedStep4 = 0;
      } else {
        DesignStor.design.doorConfig.lockShapeIndex = id;
        thisCtrl.config.selectedStep4 = 1;
      }
    }

    //--------- Close Door Configuration
    function closeDoorConfig() {
      if(thisCtrl.config.selectedStep3) {
        thisCtrl.config.selectedStep3 = 0;
        thisCtrl.config.selectedStep4 = 0;
        DesignStor.design.doorConfig.lockShapeIndex = '';
        DesignStor.design.doorConfig.handleShapeIndex = '';
      } else if(thisCtrl.config.selectedStep2) {
        thisCtrl.config.selectedStep2 = 0;
        DesignStor.design.doorConfig.sashShapeIndex = '';
      } else if(thisCtrl.config.selectedStep1) {
        thisCtrl.config.selectedStep1 = 0;
        DesignStor.design.doorConfig.doorShapeIndex = '';
      } else {
        //------ close door config
        thisCtrl.config.isDoorConfig = 0;
        //------ set Default indexes
        DesignStor.design.doorConfig = DesignStor.setDefaultDoor();
      }
    }

    //--------- Save Door Configuration
    function saveDoorConfig() {
      DesignStor.design.templateTEMP = new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths);
      thisCtrl.config.isDoorConfig = 0;
    }

    //=============== End Door ==================//












    //=============== CHANGE CONSTRUCTION SIZE ==============

    $svgContainer.hammer({domEvents:true}).off("tap", "tspan").on("tap", "tspan", DesignServ.selectSizeBlock);

    //------ click on size calculator, get number
    $('.construction-right-menu .size-calculator').hammer().off("tap", ".calc-digit").on("tap", ".calc-digit", getNewDigit);

    function getNewDigit() {
      var newValue = $(this).text();
      DesignServ.setValueSize(newValue);
    }

    $('.construction-right-menu .size-calculator').hammer().off("tap", ".calc-delete").on("tap", ".calc-delete", DesignServ.deleteLastNumber);






    //=============== CLICK ON GLASS PACKAGE ==============

    /*
     Hammer(svgContainer).on('tap', function( event ) {
     console.log('tap', event);
     console.log('event.target = ', event.target);
     if( event.target && event.target.className.indexOf('glass') >= 0 ) {
     console.log('select glass');
     } else if(event.target && event.target.className.indexOf('size-box-edited') >= 0) {
     console.log('select dimentions');
     }
     });
     */
//    $svgContainer.hammer({domEvents:true}).on("tap", ".glass", selectGlassBlock);
//
//    function selectGlassBlock() {
//      //console.log('start tap!!!!!');
//      event.preventDefault();
//
//      //console.log('click on glass', event);
//      //console.log('click on glass', event.target);
//      if($scope.constructData.isSashEdit) {
//        //------- show sash edit menu and select all glass packages
//        if(!$scope.constructData.isSashEditMenu) {
//          $scope.constructData.isSashEditMenu = true;
//          prepareForNewShape(event, '#sash-shape-menu');
//        } else {
//          $scope.constructData.isSashEditMenu = false;
//          manipulationWithGlasses($scope.constructData.isSashEditMenu);
//        }
//        $scope.$apply();
//      } else if($scope.constructData.isAngelEdit) {
//        console.log('angel');
//      } else if($scope.constructData.isImpostEdit) {
//        //------- show impost edit menu and select all glass packages
//        if(!$scope.constructData.isImpostEditMenu) {
//          $scope.constructData.isImpostEditMenu = true;
//          prepareForNewShape(event, '#impost-shape-menu');
//        } else {
//          $scope.constructData.isImpostEditMenu = false;
//          manipulationWithGlasses($scope.constructData.isImpostEditMenu);
//        }
//        $scope.$apply();
//      } else if($scope.constructData.isArchEdit) {
//        console.log('arch');
//      } else if($scope.constructData.isPositionEdit) {
//        console.log('position');
//      }
//    }
//
//
//    function prepareForNewShape(event, idShapeMenu) {
//      //------ set the coordinats for edit sash menu
//      //console.log('glass event ==', event.gesture.center);
//      var menuX = event.gesture.center.x;
//      var menuY = event.gesture.center.y;
//      //console.log('glass menuX ==', menuX);
//      //console.log('glass menuY ==', menuY);
//      $(idShapeMenu).css({'top': (menuY)/8+'rem', 'left': (menuX)/8+'rem'});
//
//      manipulationWithGlasses(false);
//      //------- select current glass packages
//      $(event.target).css('fill', 'rgba(34, 34, 255, 0.69)');
//      //------- define id of current glass package
//      $scope.selectedGlassId = event.target.attributes['element-id'].value;
//    }
//




    //=============== CLICK ON SASH EDIT MENU
//
//    function insertNewSash() {
//      editSash(arguments);
//    };


    //=============== EDIT SASH CONSTRUCTION ==============

    function editSash(sashType) {
//      var blockId = Number($scope.selectedGlassId.replace(/\D+/g,"")),
//          currGlassPackage = {},
//          insertIndex,
//          isSashExist,
//          sashNewId = (blockId - 1) * 4;
//
//      //------- get data of current glass package
//      for (var t = 0; t < $scope.templateTEMP.objects.length; t++) {
//        if($scope.templateTEMP.objects[t].id === $scope.selectedGlassId) {
//          currGlassPackage = $scope.templateTEMP.objects[t];
//          isSashExist = currGlassPackage.parts[0].fromPoint.blockType;
//        }
//      }
//  //console.log('currGlassPackage', currGlassPackage);
//      //-------- if need to delete existed sash
//      if(sashType[0] === 'empty') {
//        //----- if sash exists
//        if(isSashExist === 'sash') {
//
//          //------ delete sash from template Source
//          for(var tempObj = $scope.templateSourceTEMP.objects.length-1; tempObj >= 0; tempObj--) {
//
//            if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_sash_out' || $scope.templateSourceTEMP.objects[tempObj].type === 'sash_out_line' || $scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_hardware' || $scope.templateSourceTEMP.objects[tempObj].type === 'hardware_line' || $scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_sash_in' || $scope.templateSourceTEMP.objects[tempObj].type === 'sash_line' || $scope.templateSourceTEMP.objects[tempObj].type === 'sash') {
//              switch($scope.templateSourceTEMP.objects[tempObj].id) {
//                case 'cpsout'+(sashNewId+1):
//                case 'cpsout'+(sashNewId+2):
//                case 'cpsout'+(sashNewId+3):
//                case 'cpsout'+(sashNewId+4):
//                case 'sashoutline'+(sashNewId+1):
//                case 'sashoutline'+(sashNewId+2):
//                case 'sashoutline'+(sashNewId+3):
//                case 'sashoutline'+(sashNewId+4):
//                case 'cphw'+(sashNewId+1):
//                case 'cphw'+(sashNewId+2):
//                case 'cphw'+(sashNewId+3):
//                case 'cphw'+(sashNewId+4):
//                case 'hardwareline'+(sashNewId+1):
//                case 'hardwareline'+(sashNewId+2):
//                case 'hardwareline'+(sashNewId+3):
//                case 'hardwareline'+(sashNewId+4):
//                case 'cpsin'+(sashNewId+1):
//                case 'cpsin'+(sashNewId+2):
//                case 'cpsin'+(sashNewId+3):
//                case 'cpsin'+(sashNewId+4):
//                case 'sashline'+(sashNewId+1):
//                case 'sashline'+(sashNewId+2):
//                case 'sashline'+(sashNewId+3):
//                case 'sashline'+(sashNewId+4):
//                case 'sash'+(sashNewId+1):
//                case 'sash'+(sashNewId+2):
//                case 'sash'+(sashNewId+3):
//                case 'sash'+(sashNewId+4):
//                  $scope.templateSourceTEMP.objects.splice(tempObj, 1);
//                  break;
//              }
//            } else if($scope.templateSourceTEMP.objects[tempObj].type === 'sash_block' && $scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
//              $scope.templateSourceTEMP.objects.splice(tempObj, 1);
//            }
//
//            //------- change beads & glass position
//            if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead_out' || $scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_glass') {
//              switch($scope.templateSourceTEMP.objects[tempObj].id) {
//                case 'cpbeadout'+(sashNewId+1):
//                case 'cpbeadout'+(sashNewId+2):
//                case 'cpbeadout'+(sashNewId+3):
//                case 'cpbeadout'+(sashNewId+4):
//                case 'cpg'+(sashNewId+1):
//                case 'cpg'+(sashNewId+2):
//                case 'cpg'+(sashNewId+3):
//                case 'cpg'+(sashNewId+4):
//                  $scope.templateSourceTEMP.objects[tempObj].blockType = 'frame';
//                  if (($scope.templateSourceTEMP.objects[tempObj].line1.indexOf('impostcenterline') + 1)) {
//                    for(var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
//                      if($scope.templateSourceTEMP.objects[k].id === $scope.templateSourceTEMP.objects[tempObj].line1) {
//                        $scope.templateSourceTEMP.objects[k].lineType = 'frame';
//                      }
//                    }
//                  } else if(($scope.templateSourceTEMP.objects[tempObj].line2.indexOf('impostcenterline') + 1)) {
//                    for(var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
//                      if($scope.templateSourceTEMP.objects[k].id === $scope.templateSourceTEMP.objects[tempObj].line2) {
//                        $scope.templateSourceTEMP.objects[k].lineType = 'frame';
//                      }
//                    }
//                  }
//                  break;
//              }
//            }
//
//          }
//
//          //console.log('!!!!new.templateSourceTEMP === ', $scope.templateSourceTEMP);
//          //-------- build new template
//          $scope.templateTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
//          //findSVGElement();
//          //console.log('templateTEMP', $scope.templateTEMP.objects);
//
//          $scope.constructData.isSashEditMenu = false;
//          $scope.constructData.isSashEdit = false;
//          $scope.constructData.activeMenuItem = false;
//
//        }
//      //-------- if need to edit or insert new sash
//      } else {
//
//        //-------- insert new sash
//        if(isSashExist === 'frame' && currGlassPackage.square > 0.05) {
//
//          //---- find insert index before beads to push new sash
//          for (var i = 0; i < $scope.templateTEMP.objects.length; i++) {
//            if($scope.templateTEMP.objects[i].type === 'bead_line') {
//              insertIndex = i;
//              break;
//            }
//          }
//
//          //-------- build new Sash
//          var newSash = [
//            {'type': 'cross_point_sash_out', id: 'cpsout'+(sashNewId+1), line1: currGlassPackage.parts[0].toPoint.lineId1, line2: currGlassPackage.parts[0].toPoint.lineId2},
//            {'type': 'cross_point_sash_out', id: 'cpsout'+(sashNewId+2), line1: currGlassPackage.parts[1].toPoint.lineId1, line2: currGlassPackage.parts[1].toPoint.lineId2},
//            {'type': 'cross_point_sash_out', id: 'cpsout'+(sashNewId+3), line1: currGlassPackage.parts[2].toPoint.lineId1, line2: currGlassPackage.parts[2].toPoint.lineId2},
//            {'type': 'cross_point_sash_out', id: 'cpsout'+(sashNewId+4), line1: currGlassPackage.parts[3].toPoint.lineId1, line2: currGlassPackage.parts[3].toPoint.lineId2},
//            {'type': 'sash_out_line', id: 'sashoutline'+(sashNewId+1), from: 'cpsout'+(sashNewId+4), to: 'cpsout'+(sashNewId+1)},
//            {'type': 'sash_out_line', id: 'sashoutline'+(sashNewId+2), from: 'cpsout'+(sashNewId+1), to: 'cpsout'+(sashNewId+2)},
//            {'type': 'sash_out_line', id: 'sashoutline'+(sashNewId+3), from: 'cpsout'+(sashNewId+2), to: 'cpsout'+(sashNewId+3)},
//            {'type': 'sash_out_line', id: 'sashoutline'+(sashNewId+4), from: 'cpsout'+(sashNewId+3), to: 'cpsout'+(sashNewId+4)},
//            {'type': 'cross_point_hardware', id: 'cphw'+(sashNewId+1), line1: 'sashoutline'+(sashNewId+1), line2: 'sashoutline'+(sashNewId+2)},
//            {'type': 'cross_point_hardware', id: 'cphw'+(sashNewId+2), line1: 'sashoutline'+(sashNewId+2), line2: 'sashoutline'+(sashNewId+3)},
//            {'type': 'cross_point_hardware', id: 'cphw'+(sashNewId+3), line1: 'sashoutline'+(sashNewId+3), line2: 'sashoutline'+(sashNewId+4)},
//            {'type': 'cross_point_hardware', id: 'cphw'+(sashNewId+4), line1: 'sashoutline'+(sashNewId+4), line2: 'sashoutline'+(sashNewId+1)},
//            {'type': 'hardware_line', id: 'hardwareline'+(sashNewId+1), from: 'cphw'+(sashNewId+4), to: 'cphw'+(sashNewId+1)},
//            {'type': 'hardware_line', id: 'hardwareline'+(sashNewId+2), from: 'cphw'+(sashNewId+1), to: 'cphw'+(sashNewId+2)},
//            {'type': 'hardware_line', id: 'hardwareline'+(sashNewId+3), from: 'cphw'+(sashNewId+2), to: 'cphw'+(sashNewId+3)},
//            {'type': 'hardware_line', id: 'hardwareline'+(sashNewId+4), from: 'cphw'+(sashNewId+3), to: 'cphw'+(sashNewId+4)},
//            {'type': 'cross_point_sash_in', id: 'cpsin'+(sashNewId+1), line1: 'sashoutline'+(sashNewId+1), line2: 'sashoutline'+(sashNewId+2)},
//            {'type': 'cross_point_sash_in', id: 'cpsin'+(sashNewId+2), line1: 'sashoutline'+(sashNewId+2), line2: 'sashoutline'+(sashNewId+3)},
//            {'type': 'cross_point_sash_in', id: 'cpsin'+(sashNewId+3), line1: 'sashoutline'+(sashNewId+3), line2: 'sashoutline'+(sashNewId+4)},
//            {'type': 'cross_point_sash_in', id: 'cpsin'+(sashNewId+4), line1: 'sashoutline'+(sashNewId+4), line2: 'sashoutline'+(sashNewId+1)},
//            {'type': 'sash_line', id: 'sashline'+(sashNewId+1), from: 'cpsin'+(sashNewId+4), to: 'cpsin'+(sashNewId+1)},
//            {'type': 'sash_line', id: 'sashline'+(sashNewId+2), from: 'cpsin'+(sashNewId+1), to: 'cpsin'+(sashNewId+2)},
//            {'type': 'sash_line', id: 'sashline'+(sashNewId+3), from: 'cpsin'+(sashNewId+2), to: 'cpsin'+(sashNewId+3)},
//            {'type': 'sash_line', id: 'sashline'+(sashNewId+4), from: 'cpsin'+(sashNewId+3), to: 'cpsin'+(sashNewId+4)},
//            {'type': 'sash', id: 'sash'+(sashNewId+1), parts: ['sashoutline'+(sashNewId+1), 'sashline'+(sashNewId+1)]},
//            {'type': 'sash', id: 'sash'+(sashNewId+2), parts: ['sashoutline'+(sashNewId+2), 'sashline'+(sashNewId+2)]},
//            {'type': 'sash', id: 'sash'+(sashNewId+3), parts: ['sashoutline'+(sashNewId+3), 'sashline'+(sashNewId+3)]},
//            {'type': 'sash', id: 'sash'+(sashNewId+4), parts: ['sashoutline'+(sashNewId+4), 'sashline'+(sashNewId+4)]},
//            {'type': 'sash_block', id: 'sashBlock'+blockId, parts: ['hardwareline'+(sashNewId+1), 'hardwareline'+(sashNewId+2), 'hardwareline'+(sashNewId+3), 'hardwareline'+(sashNewId+4)], openDir: []}
//          ];
//
//          //--------- added impost properties
//          for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
//            if (newSash[sashObj].type === 'cross_point_sash_out') {
//              if ((newSash[sashObj].line1.indexOf('impostcenterline') + 1)) {
//                for(var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
//                  if($scope.templateSourceTEMP.objects[k].id === newSash[sashObj].line1) {
//                    $scope.templateSourceTEMP.objects[k].lineType = 'sash';
//                  }
//                }
//              } else if((newSash[sashObj].line2.indexOf('impostcenterline') + 1)) {
//                for(var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
//                  if($scope.templateSourceTEMP.objects[k].id === newSash[sashObj].line2) {
//                    $scope.templateSourceTEMP.objects[k].lineType = 'sash';
//                  }
//                }
//              }
//            }
//          }
//          //--------- added openType, openDir properties
//          for(var dir = 0; dir < sashType.length; dir++) {
//            switch(sashType[dir]) {
//              case 'up':
//                for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
//                  if(newSash[sashObj].id === 'sash'+(sashNewId+3)) {
//                    newSash[sashObj].openType = ['sashline'+(sashNewId+3), 'sashline'+(sashNewId+1)];
//                  }
//                  if(newSash[sashObj].id === 'sashBlock'+blockId) {
//                    newSash[sashObj].openDir.push(1);
//                    newSash[sashObj].handlePos = 1;
//                  }
//                }
//                break;
//              case 'down':
//                for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
//                  if(newSash[sashObj].id === 'sash'+(sashNewId+1)) {
//                    newSash[sashObj].openType = ['sashline'+(sashNewId+1), 'sashline'+(sashNewId+3)];
//                  }
//                  if(newSash[sashObj].id === 'sashBlock'+blockId) {
//                    newSash[sashObj].openDir.push(3);
//                    newSash[sashObj].handlePos = 3;
//                  }
//                }
//                break;
//              case 'left':
//                for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
//                  if(newSash[sashObj].id === 'sash'+(sashNewId+2)) {
//                    newSash[sashObj].openType = ['sashline'+(sashNewId+2), 'sashline'+(sashNewId+4)];
//                  }
//                  if(newSash[sashObj].id === 'sashBlock'+blockId) {
//                    newSash[sashObj].openDir.push(4);
//                    newSash[sashObj].handlePos = 4;
//                  }
//                }
//                break;
//              case 'right':
//                for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
//                  if(newSash[sashObj].id === 'sash'+(sashNewId+4)) {
//                    newSash[sashObj].openType = ['sashline'+(sashNewId+4), 'sashline'+(sashNewId+2)];
//                  }
//                  if(newSash[sashObj].id === 'sashBlock'+blockId) {
//                    newSash[sashObj].openDir.push(2);
//                    newSash[sashObj].handlePos = 2;
//                  }
//                }
//                break;
//            }
//          }
//
//
//          //----------- INSERT new sash in template Source
//          for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
//            $scope.templateSourceTEMP.objects.splice((insertIndex+sashObj), 0, newSash[sashObj]);
//          }
//
//          //----------- change existed beads and glass package
//          for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
//            //------- change beads & glass position
//            if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead_out' || $scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_glass') {
//              switch($scope.templateSourceTEMP.objects[tempObj].id) {
//                case 'cpbeadout'+(sashNewId+1):
//                case 'cpbeadout'+(sashNewId+2):
//                case 'cpbeadout'+(sashNewId+3):
//                case 'cpbeadout'+(sashNewId+4):
//                case 'cpg'+(sashNewId+1):
//                case 'cpg'+(sashNewId+2):
//                case 'cpg'+(sashNewId+3):
//                case 'cpg'+(sashNewId+4):
//                  $scope.templateSourceTEMP.objects[tempObj].blockType = 'sash';
//                  break;
//              }
//            }
//          }
//
//
//
//
//        //--------- edit existing sash (opening type)
//        } else if(isSashExist === 'sash') {
//
//          //--------- clean old openType properties in sash objects and openDir in sashBlock
//          for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
//            switch ($scope.templateSourceTEMP.objects[tempObj].id) {
//              case 'sash'+(sashNewId+1):
//              case 'sash'+(sashNewId+2):
//              case 'sash'+(sashNewId+3):
//              case 'sash'+(sashNewId+4):
//                delete $scope.templateSourceTEMP.objects[tempObj].openType;
//                break;
//              case 'sashBlock'+blockId:
//                $scope.templateSourceTEMP.objects[tempObj].openDir.length = 0;
//                break;
//            }
//          }
//
//          for(var dir = 0; dir < sashType.length; dir++) {
//            switch(sashType[dir]) {
//              case 'up':
//                for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
//                  if($scope.templateSourceTEMP.objects[tempObj].id === 'sash'+(sashNewId+3)) {
//                    $scope.templateSourceTEMP.objects[tempObj].openType = ['sashline'+(sashNewId+3), 'sashline'+(sashNewId+1)];
//                  }
//                  if($scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
//                    $scope.templateSourceTEMP.objects[tempObj].openDir.push(1);
//                    $scope.templateSourceTEMP.objects[tempObj].handlePos = 1;
//                  }
//                }
//                break;
//              case 'down':
//                for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
//                  if($scope.templateSourceTEMP.objects[tempObj].id === 'sash'+(sashNewId+1)) {
//                    $scope.templateSourceTEMP.objects[tempObj].openType = ['sashline'+(sashNewId+1), 'sashline'+(sashNewId+3)];
//                  }
//                  if($scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
//                    $scope.templateSourceTEMP.objects[tempObj].openDir.push(3);
//                    $scope.templateSourceTEMP.objects[tempObj].handlePos = 3;
//                  }
//                }
//                break;
//              case 'left':
//                for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
//                  if($scope.templateSourceTEMP.objects[tempObj].id === 'sash'+(sashNewId+2)) {
//                    $scope.templateSourceTEMP.objects[tempObj].openType = ['sashline'+(sashNewId+2), 'sashline'+(sashNewId+4)];
//                  }
//                  if($scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
//                    $scope.templateSourceTEMP.objects[tempObj].openDir.push(4);
//                    $scope.templateSourceTEMP.objects[tempObj].handlePos = 4;
//                  }
//                }
//                break;
//              case 'right':
//                for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
//                  if($scope.templateSourceTEMP.objects[tempObj].id === 'sash'+(sashNewId+4)) {
//                    $scope.templateSourceTEMP.objects[tempObj].openType = ['sashline'+(sashNewId+4), 'sashline'+(sashNewId+2)];
//                  }
//                  if($scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
//                    $scope.templateSourceTEMP.objects[tempObj].openDir.push(2);
//                    $scope.templateSourceTEMP.objects[tempObj].handlePos = 2;
//                  }
//                }
//                break;
//            }
//          }
//
//        }
//
//        //console.log('!!!!new.templateSourceTEMP === ', $scope.templateSourceTEMP);
//        //-------- build new template
//        $scope.templateTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
//        //findSVGElement();
//        //console.log('templateTEMP', $scope.templateTEMP.objects);
//
//        $scope.constructData.isSashEditMenu = false;
//        $scope.constructData.isSashEdit = false;
//        $scope.constructData.activeMenuItem = false;
//
//      }

    }




    //===================== IMPOST

    //=============== CLICK ON IMPOST EDIT MENU

//    function insertNewImpost() {
//      editImpost(arguments);
//    };


    //=============== EDIT IMPOST CONSTRUCTION ==============

    function editImpost(impostType) {
//      var blockId = Number($scope.selectedGlassId.replace(/\D+/g,"")),
//          minLimitSize = 200,
//          currLastIndex = blockId * 4,
//          currGlassPackage = {},
//          insertIndex,
//          isSashExist,
//
//          impostIndexes = [],
//          impostLineIndexes = [],
//          cpImpostIndexes = [],
//          beadIndexes = [],
//          cpGlassIndexes = [],
//          glassIndexes = [],
//
//          lastImpostIndex,
//          lastImpostLineIndex,
//          lastCPImpostIndex,
//          lastBeadIndex,
//          lastCPGlassIndex,
//          lastGlassIndex,
//
//          blockFromX,
//          blockToX,
//          blockFromY,
//          blockToY,
//          widthBlock,
//          heightBlock,
//          newImpostX,
//          newImpostY,
//          edgeTopId,
//          edgeLeftId,
//          edgeBottomId,
//          edgeRightId,
//          newImpost,
//          newBead,
//          newGlass,
//          newDim;
//
//
//      //------- get data of current glass package
//      for (var t = 0; t < $scope.templateTEMP.objects.length; t++) {
//        if($scope.templateTEMP.objects[t].id === $scope.selectedGlassId) {
//          currGlassPackage = $scope.templateTEMP.objects[t];
//          isSashExist = currGlassPackage.parts[0].fromPoint.blockType;
//        }
//      }
//
//      //---- find insert index before beads to push new sash
//      for (var i = 0; i < $scope.templateTEMP.objects.length; i++) {
//        if ($scope.templateTEMP.objects[i].type === 'cross_point_bead_out') {
//          insertIndex = i;
//          break;
//        }
//      }
//      //---- find last numbers of existed impost, bead and glass
//      for (var i = 0; i < $scope.templateTEMP.objects.length; i++) {
//        if ($scope.templateTEMP.objects[i].type === 'fixed_point_impost') {
//          impostLineIndexes.push(Number($scope.templateTEMP.objects[i].id.replace(/\D+/g, "")));
//        }
//        if ($scope.templateTEMP.objects[i].type === 'cross_point_impost') {
//          cpImpostIndexes.push(Number($scope.templateTEMP.objects[i].id.replace(/\D+/g, "")));
//        }
//        if ($scope.templateTEMP.objects[i].type === 'cross_point_bead_out') {
//          beadIndexes.push(Number($scope.templateTEMP.objects[i].id.replace(/\D+/g, "")));
//        }
//        if ($scope.templateTEMP.objects[i].type === 'cross_point_glass') {
//          cpGlassIndexes.push(Number($scope.templateTEMP.objects[i].id.replace(/\D+/g, "")));
//        }
//        if ($scope.templateTEMP.objects[i].type === 'glass_paсkage') {
//          glassIndexes.push(Number($scope.templateTEMP.objects[i].id.replace(/\D+/g, "")));
//        }
//        if ($scope.templateTEMP.objects[i].type === 'impost') {
//          impostIndexes.push(Number($scope.templateTEMP.objects[i].id.replace(/\D+/g, "")));
//        }
//      }
//      //----- define max number of existed impost, bead and glass
//      if(impostLineIndexes.length > 0) {
//        lastImpostLineIndex = impostLineIndexes.max();
//      } else {
//        lastImpostLineIndex = 0;
//      }
//      if(cpImpostIndexes.length > 0) {
//        lastCPImpostIndex = cpImpostIndexes.max();
//      } else {
//        lastCPImpostIndex = 0;
//      }
//      if(impostIndexes.length > 0) {
//        lastImpostIndex = impostIndexes.max();
//      } else {
//        lastImpostIndex = 0;
//      }
//      if(beadIndexes.length > 0) {
//        lastBeadIndex = beadIndexes.max();
//      } else {
//        lastBeadIndex = 0;
//      }
//      if(cpGlassIndexes.length > 0) {
//        lastCPGlassIndex = cpGlassIndexes.max();
//      } else {
//        lastCPGlassIndex = 0;
//      }
//      if(glassIndexes.length > 0) {
//        lastGlassIndex = glassIndexes.max();
//      } else {
//        lastGlassIndex = 0;
//      }
//
//
//
//      //------ VERTICAL IMPOST
//      if(impostType[0] === 'vert') {
//        blockFromX = currGlassPackage.parts[0].fromPoint.x;
//        blockToX = currGlassPackage.parts[0].toPoint.x;
//        widthBlock = blockToX - blockFromX;
//
//        //------- allow insert impost if widthBlock > 250
//        if(widthBlock > minLimitSize) {
//
//          //------- define new impost X & Y coordinates
//          newImpostX = +blockFromX + (widthBlock / 2);
//          newImpostY = currGlassPackage.parts[0].toPoint.line2.toPoint.y;
//          edgeTopId = currGlassPackage.parts[0].toPoint.lineId1;
//          edgeLeftId = currGlassPackage.parts[0].toPoint.lineId2;
//          edgeBottomId = currGlassPackage.parts[2].toPoint.lineId1;
//
//          //-------- build new Impost
//          newImpost = [
//            {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 1), x: newImpostX, y: 0, dir:'vert'},
//            {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 2), x: newImpostX, y: newImpostY, dir:'vert'},
//            {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 1), from: 'fpimpost' + (lastImpostLineIndex + 1), to: 'fpimpost' + (lastImpostLineIndex + 2), lineType: 'frame'},
//            {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 2), from: 'fpimpost' + (lastImpostLineIndex + 2), to: 'fpimpost' + (lastImpostLineIndex + 1), lineType: 'frame'},
//            {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 1), line1: edgeTopId, line2: 'impostcenterline' + (lastImpostLineIndex + 1)},
//            {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 2), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
//            {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 3), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
//            {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 4), line1: 'impostcenterline' + (lastImpostLineIndex + 1), line2: edgeBottomId},
//            {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 1), from: 'cpimpost' + (lastCPImpostIndex + 1), to: 'cpimpost' + (lastCPImpostIndex + 4)},
//            {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 2), from: 'cpimpost' + (lastCPImpostIndex + 3), to: 'cpimpost' + (lastCPImpostIndex + 2)},
//            {'type': 'impost', id: 'impost' + (lastImpostIndex + 1), parts: ['impostinline' + (lastImpostLineIndex + 1), 'impostinline' + (lastImpostLineIndex + 2)]}
//          ];
//
//          //-------- build new Bead
//          newBead = [
//            {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+1), line1: edgeTopId, line2: edgeLeftId},
//            {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+2), line1: edgeLeftId, line2: edgeBottomId},
//            {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+3), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
//            {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+4), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
//            {'type': 'bead_line', id:'beadline'+(lastBeadIndex+1), from:'cpbeadout'+(lastBeadIndex+4), to:'cpbeadout'+(lastBeadIndex+1)},
//            {'type': 'bead_line', id:'beadline'+(lastBeadIndex+2), from:'cpbeadout'+(lastBeadIndex+1), to:'cpbeadout'+(lastBeadIndex+2)},
//            {'type': 'bead_line', id:'beadline'+(lastBeadIndex+3), from:'cpbeadout'+(lastBeadIndex+2), to:'cpbeadout'+(lastBeadIndex+3)},
//            {'type': 'bead_line', id:'beadline'+(lastBeadIndex+4), from:'cpbeadout'+(lastBeadIndex+3), to:'cpbeadout'+(lastBeadIndex+4)},
//            {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+1), line1: 'beadline'+(lastBeadIndex+1), line2: 'beadline'+(lastBeadIndex+2)},
//            {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+2), line1: 'beadline'+(lastBeadIndex+2), line2: 'beadline'+(lastBeadIndex+3)},
//            {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+3), line1: 'beadline'+(lastBeadIndex+3), line2: 'beadline'+(lastBeadIndex+4)},
//            {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+4), line1: 'beadline'+(lastBeadIndex+4), line2: 'beadline'+(lastBeadIndex+1)},
//            {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+1), from:'cpbead'+(lastBeadIndex+4), to:'cpbead'+(lastBeadIndex+1)},
//            {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+2), from:'cpbead'+(lastBeadIndex+1), to:'cpbead'+(lastBeadIndex+2)},
//            {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+3), from:'cpbead'+(lastBeadIndex+2), to:'cpbead'+(lastBeadIndex+3)},
//            {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+4), from:'cpbead'+(lastBeadIndex+3), to:'cpbead'+(lastBeadIndex+4)},
//            {'type': 'bead_box', id:'bead'+(lastBeadIndex+1), parts: ['beadline'+(lastBeadIndex+1), 'beadinline'+(lastBeadIndex+1)]},
//            {'type': 'bead_box', id:'bead'+(lastBeadIndex+2), parts: ['beadline'+(lastBeadIndex+2), 'beadinline'+(lastBeadIndex+2)]},
//            {'type': 'bead_box', id:'bead'+(lastBeadIndex+3), parts: ['beadline'+(lastBeadIndex+3), 'beadinline'+(lastBeadIndex+3)]},
//            {'type': 'bead_box', id:'bead'+(lastBeadIndex+4), parts: ['beadline'+(lastBeadIndex+4), 'beadinline'+(lastBeadIndex+4)]}
//          ];
//          //-------- build new Glass
//          newGlass = [
//            {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+1), line1: edgeTopId, line2: edgeLeftId},
//            {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+2), line1: edgeLeftId, line2: edgeBottomId},
//            {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+3), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
//            {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+4), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
//            {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+1), from: 'cpg'+(lastCPGlassIndex+4), to: 'cpg'+(lastCPGlassIndex+1)},
//            {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+2), from: 'cpg'+(lastCPGlassIndex+1), to: 'cpg'+(lastCPGlassIndex+2)},
//            {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+3), from: 'cpg'+(lastCPGlassIndex+2), to: 'cpg'+(lastCPGlassIndex+3)},
//            {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+4), from: 'cpg'+(lastCPGlassIndex+3), to: 'cpg'+(lastCPGlassIndex+4)},
//            {'type': 'glass_paсkage', id: 'glass'+(lastGlassIndex+1), parts: ['glassline'+(lastCPGlassIndex+1), 'glassline'+(lastCPGlassIndex+2), 'glassline'+(lastCPGlassIndex+3), 'glassline'+(lastCPGlassIndex+4)]}
//          ];
//
//          //--------- added blockType properties
//          for(var j = 0; j < newImpost.length; j++) {
//            if (newImpost[j].type === 'cross_point_impost') {
//              newImpost[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
//            }
//          }
//          for(var j = 0; j < newBead.length; j++) {
//            if (newBead[j].type === 'cross_point_bead_out') {
//              newBead[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
//            }
//          }
//          for(var j = 0; j < newGlass.length; j++) {
//            if (newGlass[j].type === 'cross_point_glass') {
//              newGlass[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
//            }
//          }
//
//
//
//          //----------- INSERT new glass in template Source
//          for (var tempObj = 0; tempObj < newGlass.length; tempObj++) {
//            $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newGlass[tempObj]);
//          }
//          //----------- INSERT new bead in template Source
//          for (var tempObj = 0; tempObj < newBead.length; tempObj++) {
//            $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newBead[tempObj]);
//          }
//          //----------- INSERT new impost in template Source
//          for (var tempObj = 0; tempObj < newImpost.length; tempObj++) {
//            $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newImpost[tempObj]);
//          }
//
//          //----------- change existed beads and glass package
//          for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
//
//            //------- change beads position
//            if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead_out') {
//              if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-3)) {
//                $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
//              } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-2)) {
//                $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
//              }
//            }
//
//            //------- change glass position
//            if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_glass') {
//              if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-3)) {
//                $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
//              } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-2)) {
//                $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
//              }
//            }
//          }
//
//          //console.log('!!!!new.templateSourceTEMP === ', JSON.stringify($scope.templateSourceTEMP));
//          //console.log('!!!!new.templateSourceTEMP === ', $scope.templateSourceTEMP);
//          //-------- build new template
//          $scope.templateTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
//          //console.log('templateTEMP == ', $scope.templateTEMP.objects);
//
//          $scope.constructData.isImpostEditMenu = false;
//          $scope.constructData.isImpostEdit = false;
//          $scope.constructData.activeMenuItem = false;
//
//
//        } else {
//          playTTS($filter('translate')('construction.VOICE_SMALL_GLASS_BLOCK'), $scope.global.voiceHelperLanguage);
//        }
//
//
//
//      //------ HORISONTAL IMPOST
//
//      } else if(impostType[0] === 'horis') {
//        blockFromX = currGlassPackage.parts[1].fromPoint.y;
//        blockToX = currGlassPackage.parts[1].toPoint.y;
//        widthBlock = blockToX - blockFromX;
//
//        //------- allow insert impost if widthBlock > 250
//        if(widthBlock > minLimitSize) {
//          //console.log('blockFromX == ', blockFromX);
//          //console.log('blockToX == ', blockToX);
//          //console.log('widthBlock == ', widthBlock);
//
//          //------- define new impost X & Y coordinates
//          newImpostX = +blockFromX + (widthBlock / 2);
//          newImpostY = currGlassPackage.parts[1].toPoint.line2.fromPoint.x;
//          edgeTopId = currGlassPackage.parts[1].toPoint.lineId1;
//          edgeLeftId = currGlassPackage.parts[1].toPoint.lineId2;
//          edgeBottomId = currGlassPackage.parts[3].toPoint.lineId1;
//
//          //console.log('newImpostX', newImpostX);
//          //console.log('newImpostY', newImpostY);
//          //console.log('edgeTopId', edgeTopId);
//          //console.log('edgeLeftId', edgeLeftId);
//          //console.log('edgeBottomId',edgeBottomId);
//
//
//          //-------- build new Impost
//          newImpost = [
//            {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 1), x: newImpostY, y: newImpostX, dir:'hor'},
//            {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 2), x: 0, y: newImpostX, dir:'hor'},
//            {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 1), from: 'fpimpost' + (lastImpostLineIndex + 1), to: 'fpimpost' + (lastImpostLineIndex + 2), lineType: 'frame'},
//            {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 2), from: 'fpimpost' + (lastImpostLineIndex + 2), to: 'fpimpost' + (lastImpostLineIndex + 1), lineType: 'frame'},
//            {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 1), line1: edgeTopId, line2: 'impostcenterline' + (lastImpostLineIndex + 1)},
//            {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 2), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
//            {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 3), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
//            {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 4), line1: 'impostcenterline' + (lastImpostLineIndex + 1), line2: edgeBottomId},
//            {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 1), from: 'cpimpost' + (lastCPImpostIndex + 1), to: 'cpimpost' + (lastCPImpostIndex + 4)},
//            {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 2), from: 'cpimpost' + (lastCPImpostIndex + 3), to: 'cpimpost' + (lastCPImpostIndex + 2)},
//            {'type': 'impost', id: 'impost' + (lastImpostIndex + 1), parts: ['impostinline' + (lastImpostLineIndex + 1), 'impostinline' + (lastImpostLineIndex + 2)]}
//          ];
//
//          //-------- build new Bead
//          newBead = [
//            {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+1), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
//            {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+2), line1: edgeTopId, line2: edgeLeftId},
//            {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+3), line1: edgeLeftId, line2: edgeBottomId},
//            {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+4), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
//            {'type': 'bead_line', id:'beadline'+(lastBeadIndex+1), from:'cpbeadout'+(lastBeadIndex+4), to:'cpbeadout'+(lastBeadIndex+1)},
//            {'type': 'bead_line', id:'beadline'+(lastBeadIndex+2), from:'cpbeadout'+(lastBeadIndex+1), to:'cpbeadout'+(lastBeadIndex+2)},
//            {'type': 'bead_line', id:'beadline'+(lastBeadIndex+3), from:'cpbeadout'+(lastBeadIndex+2), to:'cpbeadout'+(lastBeadIndex+3)},
//            {'type': 'bead_line', id:'beadline'+(lastBeadIndex+4), from:'cpbeadout'+(lastBeadIndex+3), to:'cpbeadout'+(lastBeadIndex+4)},
//            {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+1), line1: 'beadline'+(lastBeadIndex+1), line2: 'beadline'+(lastBeadIndex+2)},
//            {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+2), line1: 'beadline'+(lastBeadIndex+2), line2: 'beadline'+(lastBeadIndex+3)},
//            {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+3), line1: 'beadline'+(lastBeadIndex+3), line2: 'beadline'+(lastBeadIndex+4)},
//            {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+4), line1: 'beadline'+(lastBeadIndex+4), line2: 'beadline'+(lastBeadIndex+1)},
//            {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+1), from:'cpbead'+(lastBeadIndex+4), to:'cpbead'+(lastBeadIndex+1)},
//            {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+2), from:'cpbead'+(lastBeadIndex+1), to:'cpbead'+(lastBeadIndex+2)},
//            {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+3), from:'cpbead'+(lastBeadIndex+2), to:'cpbead'+(lastBeadIndex+3)},
//            {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+4), from:'cpbead'+(lastBeadIndex+3), to:'cpbead'+(lastBeadIndex+4)},
//            {'type': 'bead_box', id:'bead'+(lastBeadIndex+1), parts: ['beadline'+(lastBeadIndex+1), 'beadinline'+(lastBeadIndex+1)]},
//            {'type': 'bead_box', id:'bead'+(lastBeadIndex+2), parts: ['beadline'+(lastBeadIndex+2), 'beadinline'+(lastBeadIndex+2)]},
//            {'type': 'bead_box', id:'bead'+(lastBeadIndex+3), parts: ['beadline'+(lastBeadIndex+3), 'beadinline'+(lastBeadIndex+3)]},
//            {'type': 'bead_box', id:'bead'+(lastBeadIndex+4), parts: ['beadline'+(lastBeadIndex+4), 'beadinline'+(lastBeadIndex+4)]}
//          ];
//          //-------- build new Glass
//          newGlass = [
//            {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+1), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
//            {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+2), line1: edgeTopId, line2: edgeLeftId},
//            {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+3), line1: edgeLeftId, line2: edgeBottomId},
//            {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+4), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
//            {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+1), from: 'cpg'+(lastCPGlassIndex+4), to: 'cpg'+(lastCPGlassIndex+1)},
//            {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+2), from: 'cpg'+(lastCPGlassIndex+1), to: 'cpg'+(lastCPGlassIndex+2)},
//            {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+3), from: 'cpg'+(lastCPGlassIndex+2), to: 'cpg'+(lastCPGlassIndex+3)},
//            {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+4), from: 'cpg'+(lastCPGlassIndex+3), to: 'cpg'+(lastCPGlassIndex+4)},
//            {'type': 'glass_paсkage', id: 'glass'+(lastGlassIndex+1), parts: ['glassline'+(lastCPGlassIndex+1), 'glassline'+(lastCPGlassIndex+2), 'glassline'+(lastCPGlassIndex+3), 'glassline'+(lastCPGlassIndex+4)]}
//          ];
//
//          //--------- added blockType properties
//          for(var j = 0; j < newImpost.length; j++) {
//            if (newImpost[j].type === 'cross_point_impost') {
//              newImpost[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
//            }
//          }
//          for(var j = 0; j < newBead.length; j++) {
//            if (newBead[j].type === 'cross_point_bead_out') {
//              newBead[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
//            }
//          }
//          for(var j = 0; j < newGlass.length; j++) {
//            if (newGlass[j].type === 'cross_point_glass') {
//              newGlass[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
//            }
//          }
//
//
//          //console.log('newImpost = ', newImpost);
//          //console.log('newBead = ', newBead);
//          //console.log('newGlass = ', newGlass);
//          //----------- INSERT new glass in template Source
//          for (var tempObj = 0; tempObj < newGlass.length; tempObj++) {
//            $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newGlass[tempObj]);
//          }
//          //----------- INSERT new bead in template Source
//          for (var tempObj = 0; tempObj < newBead.length; tempObj++) {
//            $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newBead[tempObj]);
//          }
//          //----------- INSERT new impost in template Source
//          for (var tempObj = 0; tempObj < newImpost.length; tempObj++) {
//            $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newImpost[tempObj]);
//          }
//
//          //----------- change existed beads and glass package
//          for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
//
//            //------- change beads position
//            if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead_out') {
//              if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-2)) {
//                $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
//              } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-1)) {
//                $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
//              }
//            }
//
//            //------- change glass position
//            if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_glass') {
//              if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-2)) {
//                $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
//              } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-1)) {
//                $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
//              }
//            }
//          }
//
//          //console.log('!!!!new.templateSourceTEMP === ', JSON.stringify($scope.templateSourceTEMP));
//          //console.log('!!!!new.templateSourceTEMP === ', $scope.templateSourceTEMP);
//          //-------- build new template
//          $scope.templateTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
//          //console.log('templateTEMP == ', $scope.templateTEMP.objects);
//
//          $scope.constructData.isImpostEditMenu = false;
//          $scope.constructData.isImpostEdit = false;
//          $scope.constructData.activeMenuItem = false;
//
//
//        } else {
//          playTTS($filter('translate')('construction.VOICE_SMALL_GLASS_BLOCK'), $scope.global.voiceHelperLanguage);
//        }
//
//      }

    }



  }
})();

