(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('DesignModule')
    .controller('DesignCtrl', designPageCtrl);

  function designPageCtrl($timeout, globalConstants, SVGServ, DesignServ, GlobalStor, ProductStor, DesignStor) {

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
      isDesignError: 0,

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
    thisCtrl.insertImpost = insertImpost;
    thisCtrl.insertArc = insertArc;

    thisCtrl.stepBack = DesignServ.stepBack;





    //============ methods ================//


    //--------Select menu item
    function selectMenuItem(id) {
      DesignStor.design.activeMenuItem = (DesignStor.design.activeMenuItem === id) ? 0 : id;
      if(!DesignStor.design.activeMenuItem) {
        DesignStor.design.activeSubMenuItem = 0;
      }
      DesignServ.hideCornerMarks();
      DesignServ.deselectAllImpost();
      DesignServ.deselectAllArc();
      DesignServ.deselectAllGlass();

      switch(DesignStor.design.activeMenuItem) {
        case 1:
          showAllAvailableGlass(id);
          break;
        case 2:
          showAllAvailableCorner(id);
          break;
        case 3:
          showAllAvailableGlass(id);
          break;
        case 4:
          showAllAvailableArc(id);
          break;
        case 5:
//          thisCtrl.config.isPositionEdit = true;
          break;
      }
    }


    function showDesignError() {
      thisCtrl.config.isDesignError = 1;
      DesignStor.design.activeMenuItem = 0;
      DesignStor.design.activeSubMenuItem = 0;
      $timeout(function(){
        thisCtrl.config.isDesignError = 0;
      }, 800);
    }


    //++++++++++ Edit Sash ++++++++++//

    function showAllAvailableGlass(menuId) {
      DesignStor.design.activeSubMenuItem = menuId;
      var glasses = d3.selectAll('#tamlateSVG .glass');
      DesignStor.design.selectedGlass = glasses;
      glasses.classed('glass-active', true);

      glasses.on('click', function() {
        var glass = d3.select(this);
        DesignServ.deselectAllGlass();
        glass.classed('glass-active', true);
        DesignStor.design.selectedGlass = glass;
      });
    }






    function insertSash(sashType, event) {
      event.srcEvent.stopPropagation();
      DesignStor.design.activeMenuItem = 0;
      DesignStor.design.activeSubMenuItem = 0;
      DesignServ.deselectAllGlass();

      var glassQty = DesignStor.design.selectedGlass[0].length;
      if(sashType === 1) {
        //----- delete sash
        for(var i = 0; i < glassQty; i++) {
          DesignServ.deleteSash(DesignStor.design.selectedGlass[0][i]);
        }
      } else {
        //----- insert sash
        for(var i = 0; i < glassQty; i++) {
          DesignServ.createSash(sashType, DesignStor.design.selectedGlass[0][i]);
        }
      }
    }



    //++++++++++ Edit Corner ++++++++//

    //-------- show all Corner Marks
    function showAllAvailableCorner(menuId) {
      var corners = d3.selectAll('#tamlateSVG .corner_mark');
      if(corners[0].length) {
        //---- show submenu
        DesignStor.design.activeSubMenuItem = menuId;

        corners.transition().duration(300).ease("linear").attr('r', 50);

        DesignStor.design.selectedCorner = corners;
        corners.on('click', function () {
          //----- hide all cornerMark
          DesignServ.hideCornerMarks();

          //----- show selected cornerMark
          var corner = d3.select(this).transition().duration(300).ease("linear").attr('r', 50);
          DesignStor.design.selectedCorner = corner;

        });
      } else {
        showDesignError();
      }
    }

    function insertCorner(conerType, event) {
      event.srcEvent.stopPropagation();
      //------ hide menu
      DesignStor.design.activeMenuItem = 0;
      DesignStor.design.activeSubMenuItem = 0;
      DesignServ.hideCornerMarks();
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





    //++++++++++ Edit Arc ++++++++//

    function showAllAvailableArc(menuId) {
      var arcs = d3.selectAll('#tamlateSVG .frame')[0].filter(function (item) {
        if (item.__data__.type === 'frame' || item.__data__.type === 'arc') {
          return true;
        }
      });

      if(arcs.length) {
        DesignStor.design.activeSubMenuItem = menuId;
        var arcs = d3.selectAll(arcs);
        DesignStor.design.selectedArc = arcs;

        arcs.classed('active_svg', true).on('click', function () {
          DesignServ.deselectAllArc();
          var arc = d3.select(this);
          arc.classed('active_svg', true);
          DesignStor.design.selectedArc = arc;
        });
      } else {
        showDesignError();
      }
    }



    function insertArc(arcType, event) {
      event.srcEvent.stopPropagation();
      DesignStor.design.activeMenuItem = 0;
      DesignStor.design.activeSubMenuItem = 0;
      DesignServ.deselectAllArc();
      //---- get quantity of arcs
      var arcQty = DesignStor.design.selectedArc[0].length;

      //======= delete arc
      if(arcType === 1) {
        //------ delete all arcs
        if (arcQty > 1) {
          var arcsQty = d3.selectAll('#tamlateSVG [item-type=arc]')[0].length;
          if (arcsQty) {
            DesignServ.workingWithAllArcs('arc', arcsQty);
          }
        } else {
          //------ delete one selected arc
          DesignServ.deleteArc(DesignStor.design.selectedArc[0][0]);
        }

      //======= insert arc
      } else {
        //------ insert all arcs
        if(arcQty > 1) {
          DesignServ.workingWithAllArcs('frame', arcQty);
        } else {
          //------ insert one selected arc
          DesignServ.createArc(DesignStor.design.selectedArc[0][0]);
        }
      }
    }




    //++++++++++ Edit Impost ++++++++//


    function insertImpost(impostType, event) {
      event.srcEvent.stopPropagation();
      DesignStor.design.activeMenuItem = 0;
      DesignStor.design.activeSubMenuItem = 0;
      DesignServ.deselectAllGlass();
      var impostsQty = DesignStor.design.selectedImpost.length;

      if(impostType === 1) {
        //----- delete imposts
        if (impostsQty) {
          for (var i = 0; i < impostsQty; i++) {
            DesignServ.deleteImpost(DesignStor.design.selectedImpost[i]);
          }
        }
      } else {
        if(!impostsQty) {
          var glassQty = DesignStor.design.selectedGlass[0].length;
          if(glassQty) {
            //------- insert imposts
            for(var i = 0; i < glassQty; i++) {
              DesignServ.createImpost(impostType, DesignStor.design.selectedGlass[0][i]);
            }
          }
        } else {
          DesignServ.deselectAllImpost();
        }
      }
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
      SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
        DesignStor.design.templateTEMP = angular.copy(result);
      });
//      DesignStor.design.templateTEMP = new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths);
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

//TODO  playTTS($filter('translate')('construction.VOICE_SMALL_GLASS_BLOCK'), $scope.global.voiceHelperLanguage);




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



  }
})();
