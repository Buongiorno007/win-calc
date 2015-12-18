/* globals d3, startRecognition, parseStringToDimension, playTTS */
(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('DesignModule')
    .factory('DesignServ', designFactory);

  function designFactory($rootScope, $location, $timeout, $filter, $q, globalConstants, GeneralServ, MainServ, AnalyticsServ, optionsServ, SVGServ, GlobalStor, DesignStor, OrderStor, ProductStor, UserStor) {

    var thisFactory = this,
        clickEvent = (GlobalStor.global.isDevice) ? 'touchstart' : 'click';

    thisFactory.publicObj = {
      setDefaultTemplate: setDefaultTemplate,
      designSaved: designSaved,
      designCancel: designCancel,
      setDefaultConstruction: setDefaultConstruction,

      initAllImposts: initAllImposts,
      initAllGlass: initAllGlass,
      initAllArcs: initAllArcs,
      initAllDimension: initAllDimension,
      hideCornerMarks: hideCornerMarks,
      deselectAllImpost: deselectAllImpost,
      deselectAllArc: deselectAllArc,
      deselectAllGlass: deselectAllGlass,
      rebuildSVGTemplate: rebuildSVGTemplate,

      //------- edit sash
      createSash: createSash,
      deleteSash: deleteSash,
      //------- edit corners
      setCornerPoints: setCornerPoints,
      setCurvCornerPoints: setCurvCornerPoints,
      deleteCornerPoints: deleteCornerPoints,
      //-------- edit arc
      createArc: createArc,
      deleteArc: deleteArc,
      workingWithAllArcs: workingWithAllArcs,
      //-------- edit impost
      createImpost: createImpost,
      deleteImpost: deleteImpost,
      //-------- mirror
      initMirror: initMirror,
      positionAxis: positionAxis,
      removeAllEventsInSVG: removeAllEventsInSVG,

      //---- change sizes
      setValueSize: setValueSize,
      deleteLastNumber: deleteLastNumber,
      closeSizeCaclulator: closeSizeCaclulator,
      hideSizeTools: hideSizeTools,

      stepBack: stepBack,

      //---- door
//      downloadDoorConfig: downloadDoorConfig,
      setIndexDoorConfig: setIndexDoorConfig
    };

    return thisFactory.publicObj;




    //============ methods ================//


    function setDefaultTemplate() {
      DesignStor.designSource.templateSourceTEMP = angular.copy(ProductStor.product.template_source);
      DesignStor.designSource.templateTEMP = angular.copy(ProductStor.product.template);
      DesignStor.design.templateSourceTEMP = angular.copy(ProductStor.product.template_source);
      DesignStor.design.templateTEMP = angular.copy(ProductStor.product.template);
    }



    //------- Save and Close Construction Page
    function designSaved() {
      closeSizeCaclulator(1).then(function() {
        //------ if calculator is closed
        //if(!GlobalStor.global.isSizeCalculator) {
          //----- save new template in product
          ProductStor.product.template_source = angular.copy(DesignStor.design.templateSourceTEMP);
          ProductStor.product.template = angular.copy(DesignStor.design.templateTEMP);

          //----- create template icon
          SVGServ.createSVGTemplateIcon(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function(result) {
            ProductStor.product.templateIcon = angular.copy(result);
          });

          //============ if Door Construction
          if(ProductStor.product.construction_type === 4) {
            //------- save new door config
            ProductStor.product.door_shape_id = DesignStor.design.doorShapeList[DesignStor.design.doorConfig.doorShapeIndex].shapeId;
            ProductStor.product.door_sash_shape_id = DesignStor.design.doorShapeList[DesignStor.design.doorConfig.sashShapeIndex].shapeId;
            ProductStor.product.door_handle_shape_id = DesignStor.design.doorShapeList[DesignStor.design.doorConfig.handleShapeIndex].shapeId;
            ProductStor.product.door_lock_shape_id = DesignStor.design.doorShapeList[DesignStor.design.doorConfig.lockShapeIndex].shapeId;
          }

          //------ save new template in templates Array
          GlobalStor.global.templatesSource[ProductStor.product.templateIndex] = angular.copy(ProductStor.product.template_source);

          //------- if sash was added in empty template
          if(!GlobalStor.global.isSashesInTemplate) {
            GlobalStor.global.isSashesInTemplate = MainServ.checkSashInTemplate(ProductStor.product);
            if (GlobalStor.global.isSashesInTemplate) {
              ProductStor.product.hardware = GlobalStor.global.hardwares[0][0];
              //------ save analytics data
              //AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id, ProductStor.product.template_id, ProductStor.product.hardware.id, 3);
            } else {
              ProductStor.product.hardware.id = 0;
            }
          }
          //------- refresh price of new template
          MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profile.id, ProductStor.product.glass, ProductStor.product.hardware.id).then(function() {
            //-------- template was changed
            GlobalStor.global.isChangedTemplate = 1;
            backtoTemplatePanel();
          });

        //}
      });
    }




    //--------- Cancel and Close Construction Page
    function designCancel() {
      //------- close calculator if is opened
      hideSizeTools();
      //------ go to Main Page
      backtoTemplatePanel();
    }



    //-------- Back to Template Panel
    function backtoTemplatePanel() {
      //------ cleaning DesignStor
      DesignStor.design = DesignStor.setDefaultDesign();
      //      delete DesignStor.design.templateSourceTEMP;
      //      delete DesignStor.design.templateTEMP;
      GlobalStor.global.activePanel = 0;
      GlobalStor.global.isNavMenu = 0;
      GlobalStor.global.isConfigMenu = 1;
      $location.path('/main');
    }


    //------- set Default Construction
    function setDefaultConstruction() {
      //------- close calculator if is opened
      hideSizeTools();
      //----- do if Size Calculator is not opened
      //if(!GlobalStor.global.isSizeCalculator) {
        DesignStor.design = DesignStor.setDefaultDesign();
        setDefaultTemplate();
        //============ if Door Construction
        if(ProductStor.product.construction_type === 4) {
          //---- set indexes
          setIndexDoorConfig();
        }
      //}
    }





    //============== Door ============//

//    function downloadDoorConfig() {
//      optionsServ.getDoorConfig(function (results) {
//        if (results.status) {
//          DesignStor.design.doorShapeList = results.data.doorType;
//          DesignStor.design.sashShapeList = results.data.sashType;
//          DesignStor.design.handleShapeList = results.data.handleType;
//          DesignStor.design.lockShapeList = results.data.lockType;
          //---- set indexes
//          setIndexDoorConfig();
//        } else {
//          console.log(results);
//        }
//      });
//    }

    function setIndexDoorConfig() {
      DesignStor.designSource.doorConfig.doorShapeIndex = setDoorConfigIndex(DesignStor.design.doorShapeList, ProductStor.product.door_shape_id);
      DesignStor.designSource.doorConfig.sashShapeIndex = setDoorConfigIndex(DesignStor.design.doorShapeList, ProductStor.product.door_sash_shape_id);
      DesignStor.designSource.doorConfig.handleShapeIndex = setDoorConfigIndex(DesignStor.design.doorShapeList, ProductStor.product.door_handle_shape_id);
      DesignStor.designSource.doorConfig.lockShapeIndex = setDoorConfigIndex(DesignStor.design.doorShapeList, ProductStor.product.door_lock_shape_id);

      //-------- set Default values in design
      DesignStor.design.doorConfig = DesignStor.setDefaultDoor();
    }


    function setDoorConfigIndex(list, configId) {
      var listQty = list.length;
      for(var i = 0; i < listQty; i++) {
        if(list[i].shapeId === configId) {
          return i;
        }
      }
    }





    //========== Edit Design =============//


    //------ add to all imposts event on click
    function initAllImposts() {
      DesignStor.design.selectedImpost.length = 0;
      d3.selectAll('#tamlateSVG [item_type=impost]')
        .each(function() {
          var impost = d3.select(this);
          impost.on(clickEvent, function() {
            if(DesignStor.design.tempSize.length) {
              closeSizeCaclulator();
              cleanTempSize();
            } else {
              var isImpost = isExistElementInSelected(impost[0][0], DesignStor.design.selectedImpost);
              if (isImpost) {
                impost.classed('frame-active', true);
                //------- active impost menu and submenu
                DesignStor.design.activeMenuItem = 3;
                DesignStor.design.isImpostDelete = 1;
                DesignStor.design.activeSubMenuItem = 3;
                hideCornerMarks();
                deselectAllArc();
                hideSizeTools();
                $rootScope.$apply();
              } else {
                impost.classed('frame-active', false);
                //----- if none imposts
                if (!DesignStor.design.selectedImpost.length) {
                  //------- close impost menu and submenu
                  DesignStor.design.activeMenuItem = 0;
                  DesignStor.design.activeSubMenuItem = 0;
                  $rootScope.$apply();
                  DesignStor.design.isImpostDelete = 0;
                }
              }
            }
          });
        });
    }



    function isExistElementInSelected(newElem, selectedArr) {
      var exist = 1,
          newElemId = newElem.attributes.block_id.nodeValue,
          selectedQty = selectedArr.length;
      while(--selectedQty > -1) {
        if(selectedArr[selectedQty].attributes.block_id.nodeValue === newElemId) {
          selectedArr.splice(selectedQty, 1);
          exist = 0;
          break;
        }
      }
      //-------- if the element is new one
      if(exist){
        selectedArr.push(newElem);
      }
      return exist;
    }



    //------- set click to all Glass for Dimensions
    function initAllGlass() {
      DesignStor.design.selectedGlass.length = 0;
      d3.selectAll('#tamlateSVG .glass')
        .each(function() {
          var glass = d3.select(this);
          glass.on(clickEvent, function() {
            if(DesignStor.design.tempSize.length) {
              closeSizeCaclulator();
              cleanTempSize();
            } else {
              //========= select glass
              var isGlass = isExistElementInSelected(glass[0][0], DesignStor.design.selectedGlass), blockID = glass[0][0].attributes.block_id.nodeValue;

              if (isGlass) {
                glass.classed('glass-active', true);
                hideCornerMarks();
                deselectAllImpost();
                deselectAllArc();
                hideSizeTools();

                //------- show Dimensions
                showCurrentDimLevel(blockID);

                $rootScope.$apply();
              } else {
                glass.classed('glass-active', false);
                //------- hide Dimensions of current Block
                d3.selectAll('#tamlateSVG .dim_block[block_id=' + blockID + ']').classed('dim_hidden', true);

                if (!DesignStor.design.selectedGlass.length) {
                  //------- close glass menu and submenu
                  DesignStor.design.activeMenuItem = 0;
                  DesignStor.design.activeSubMenuItem = 0;
                  //---- shifting global dimension
                  hideAllDimension();
                  $rootScope.$apply();
                }
              }
            }
          });
        });
    }


    function showCurrentDimLevel(currDimId) {
      var dim = d3.selectAll('#tamlateSVG .dim_block[block_id='+currDimId+']'),
          dimQty = dim[0].length;

      if(dimQty) {
        var isXDim = 0, isYDim = 0;
        while(--dimQty > -1) {
          if(dim[0][dimQty].attributes.axis) {
            if (dim[0][dimQty].attributes.axis.nodeValue === 'x') {
              ++isXDim;
            } else if (dim[0][dimQty].attributes.axis.nodeValue === 'y') {
              ++isYDim;
            }
          }
        }
        //------- hide all dimension Level 0
//        d3.selectAll('#tamlateSVG .dim_block').classed('dim_hidden', true);

        if(isXDim) {
          d3.selectAll('#tamlateSVG .dim_blockX').classed('dim_shiftX', true);
        }
        if(isYDim) {
          d3.selectAll('#tamlateSVG .dim_blockY').classed('dim_shiftY', true);
        }
        dim.classed('dim_hidden', false);
      }
    }




    function initAllArcs() {
      var arcs = d3.selectAll('#tamlateSVG .frame')[0].filter(function (item) {
        if (item.__data__.type === 'frame' || item.__data__.type === 'arc') {
          return true;
        }
      });
      if(arcs.length) {
        d3.selectAll(arcs).each(function() {
          var arc = d3.select(this);
          arc.on(clickEvent, function() {
            if(DesignStor.design.tempSize.length) {
              closeSizeCaclulator();
              cleanTempSize();
            } else {
              var isArc = isExistArcInSelected(arc[0][0], DesignStor.design.selectedArc);
              //console.log('add to ARC++++', DesignStor.design.selectedArc);
              if (isArc) {
                arc.classed('active_svg', true);
                deselectAllGlass();
                hideCornerMarks();
                deselectAllImpost();
                hideSizeTools();
                $rootScope.$apply();
              } else {
                arc.classed('active_svg', false);
                if (!DesignStor.design.selectedArc.length) {
                  //------- close glass menu and submenu
                  DesignStor.design.activeMenuItem = 0;
                  DesignStor.design.activeSubMenuItem = 0;
                  $rootScope.$apply();
                }
              }
            }
          });
        });
      }
    }



    function isExistArcInSelected(newElem, selectedArr) {
      var exist = 1,
          newElemId = newElem.attributes.item_id.nodeValue,
          selectedQty = selectedArr.length;
      while(--selectedQty > -1) {
        if(selectedArr[selectedQty].attributes.item_id.nodeValue === newElemId) {
          selectedArr.splice(selectedQty, 1);
          exist = 0;
          break;
        }
      }
      //-------- if the element is new one
      if(exist){
        selectedArr.push(newElem);
      }
      return exist;
    }



    function hideAllDimension() {
      d3.selectAll('#tamlateSVG .dim_blockX').classed('dim_shiftX', false);
      d3.selectAll('#tamlateSVG .dim_blockY').classed('dim_shiftY', false);
      d3.selectAll('#tamlateSVG .dim_block').classed('dim_hidden', true);
    }


    function hideCornerMarks() {
      DesignStor.design.selectedCorner.length = 0;
      d3.selectAll('#tamlateSVG .corner_mark')
        .transition()
        .duration(300)
        .ease("linear")
        .attr('r', 0);
    }

    function deselectAllImpost() {
      DesignStor.design.selectedImpost.length = 0;
      d3.selectAll('#tamlateSVG [item_type=impost]').classed('frame-active', false);
    }


    function deselectAllArc() {
      DesignStor.design.selectedArc.length = 0;
      d3.selectAll('#tamlateSVG .frame').classed('active_svg', false);
    }


    function deselectAllGlass() {
      DesignStor.design.selectedGlass.length = 0;
      d3.selectAll('#tamlateSVG .glass').classed('glass-active', false);
    }


    function rebuildSVGTemplate() {
      SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function(result) {
        DesignStor.design.templateTEMP = angular.copy(result);
      });
    }


    //++++++++++ Edit Sash +++++++++//

    function createSash(type, glassObj) {
      var glass = glassObj.__data__,
          blockID = glassObj.attributes.block_id.nodeValue,
          blocks = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocks.length,
          minGlassSize = d3.min(glass.sizes),
          sashesParams;

      /**---- shtulps ---*/
      if(type === 8 || type === 9) {
        if(minGlassSize >= globalConstants.minSizeLimitStulp) {

          if(type === 8) {
            sashesParams = [
              {
                openDir: [4],
                handlePos: 0,
                sashType: 4
              },
              {
                openDir: [1, 2],
                handlePos: 2,
                sashType: 17
              }
            ];
          } else if(type === 9) {
            sashesParams = [
              {
                openDir: [1, 4],
                handlePos: 4,
                sashType: 17
              },
              {
                openDir: [2],
                handlePos: 0,
                sashType: 4
              }
            ];
          }

          createShtulp(blockID, sashesParams);

        } else {
          //------ show error
          showErrorInBlock(blockID);
        }

      } else {

        if (minGlassSize >= globalConstants.minSizeLimit || glass.square >= globalConstants.squareLimit) {

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          for (var b = 1; b < blocksQty; b++) {
            if (blocks[b].id === blockID) {
              blocks[b].blockType = 'sash';
              blocks[b].gridId = 0;//TODO ???

              switch (type) {
                //----- 'left'
                case 2:
                  blocks[b].openDir = [4];
                  blocks[b].handlePos = 4;
                  blocks[b].sashType = 2;
                  break;
                //----- 'right'
                case 3:
                  blocks[b].openDir = [2];
                  blocks[b].handlePos = 2;
                  blocks[b].sashType = 2;
                  break;
                //----- 'up'
                case 4:
                  blocks[b].openDir = [1];
                  blocks[b].handlePos = 1;
                  blocks[b].sashType = 7;
                  break;
                //------ 'down'
                case 5:
                  blocks[b].openDir = [3];
                  blocks[b].handlePos = 3;
                  blocks[b].sashType = 2;
                  break;
                //------ 'up', 'right'
                case 6:
                  blocks[b].openDir = [1, 2];
                  blocks[b].handlePos = 2;
                  blocks[b].sashType = 6;
                  break;
                //------ 'up', 'left'
                case 7:
                  blocks[b].openDir = [1, 4];
                  blocks[b].handlePos = 4;
                  blocks[b].sashType = 6;
                  break;
              }
              //----- change Template
              rebuildSVGTemplate();
            }
          }
        } else {
          //------ show error
          showErrorInBlock(blockID);
        }
      }
    }



    /**----------- create SHTULP -----------*/

    function createShtulp(blockID, sashesParams) {
      var blocks = DesignStor.design.templateTEMP.details,
          blocksQty = blocks.length,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          angel = 90, dimType = 0, currBlockInd, curBlockN,
          lastBlockN,
          impVector,
          crossPoints;

        //---- save last step
        DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));


        //------- find lines as to current block
        while (--blocksQty > 0) {
          if (blocks[blocksQty].id === blockID) {
            currBlockInd = blocksQty*1;
            curBlockN = Number(blocks[blocksQty].id.replace(/\D+/g, ""));
          }
        }
        lastBlockN = getLastBlockNumber(blocksSource);
        impVector = SVGServ.cteateLineByAngel(blocks[currBlockInd].center, angel);
        crossPoints = getImpostCrossPointInBlock(impVector, blocks[currBlockInd].linesOut);

        if(crossPoints.length > 2) {
          sliceExtraPoints(crossPoints);
        }

        var impPointsQty = crossPoints.length;
        if (impPointsQty === 2) {
          while (--impPointsQty > -1) {
            createImpostPoint(crossPoints[impPointsQty], curBlockN, currBlockInd, blocksSource, dimType, 1);
            createChildBlock(++lastBlockN, currBlockInd, blocksSource, 1, sashesParams[impPointsQty]);
          }
          //----- change Template
          rebuildSVGTemplate();
        } else {
          //------ show error
          showErrorInBlock(blockID);
        }
    }





    function showErrorInBlock(blockID) {
      var currGlass = d3.select('#tamlateSVG .glass[block_id='+blockID+']'),
          i = 1;
      currGlass.classed('error_glass', true);

      var interval = setInterval(function() {
        if(i === 11) {
          clearInterval(interval);
        }
        if(i%2) {
          currGlass.classed('error_glass', false);
        } else {
          currGlass.classed('error_glass', true);
        }
        i++;
      }, 50);
    }




    function deleteSash(glassObj) {
      var blockID = glassObj.attributes.block_id.nodeValue,
          blocks = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocks.length,
          isShtulp = 0;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      for(var b = 1; b < blocksQty; b++) {
        if (blocks[b].id === blockID) {
          //console.log('delete sash-----', blocks[b]);

          //------- checking existing SHTULP
          isShtulp = checkShtulp(blocks[b].parent, blocks, blocksQty);
          if(isShtulp) {
            //----- delete children blocks and impost points
            removeAllChildrenBlock(blocks[isShtulp].children[0], blocks);
            removeAllChildrenBlock(blocks[isShtulp].children[1], blocks);
            blocks[isShtulp].children.length = 0;
            delete blocks[isShtulp].impost;

          } else {
            removeSashPropInBlock(blocks[b]);
          }
          break;
        }
      }
      //----- change Template
      rebuildSVGTemplate();
    }




    function checkShtulp(parentId, blocks, blocksQty) {
      var isShtulp = 0;
      while(--blocksQty > 0) {
        if(blocks[blocksQty].id === parentId) {
          if(blocks[blocksQty].impost) {
            if(blocks[blocksQty].impost.impostAxis[0].type === 'shtulp') {
              isShtulp = blocksQty;
            }
          }
        }
      }
      return isShtulp;
    }




    function removeSashPropInBlock(block) {
      block.blockType = 'frame';
      delete block.openDir;
      delete block.handlePos;
      delete block.sashType;
      delete block.gridId; //TODO ???
    }


    //------ delete sash if block sizes are small (add/remove arc)
    function checkSashesBySizeBlock(template) {
      var blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocksQty = template.details.length,
          isSashDelet = 0;
      while(--blocksQty > 0) {
        if(template.details[blocksQty].level && template.details[blocksQty].blockType === 'sash') {
          var partsQty = template.details[blocksQty].parts.length;
          while(--partsQty > -1) {
            if(template.details[blocksQty].parts[partsQty].type === 'glass') {
              var minGlassSize = d3.min(template.details[blocksQty].parts[partsQty].sizes);
//              console.log('GLASS SIZES', minGlassSize);
              if(minGlassSize <= globalConstants.minSizeLimit && minGlassSize <= globalConstants.minSizeLimit) {
                //------ delete sash
                removeSashPropInBlock(blocksSource[blocksQty]);
                isSashDelet = 1;
              }
            }
          }
        }
      }
      return isSashDelet;
    }





    //++++++++++ Edit Corners ++++++++//



    function setCornerPoints(cornerObj) {
      var cornerID = cornerObj.__data__.id,
          cornerN = Number(cornerID.replace(/\D+/g, "")),
          blockID = cornerObj.attributes.block_id.nodeValue,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocks = DesignStor.design.templateTEMP.details,
          blocksQty = blocks.length;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      while(--blocksQty > 0) {
        if(blocks[blocksQty].id === blockID) {
          //---- set simple corner
          if(cornerObj.__data__.view) {
            startCreateCornerPoint(cornerID, cornerN, blocks[blocksQty].linesOut, blocksQty, blocksSource);

          //----- change curve corner to simple
          } else {
            //---- delete qc point in blocks
            removePointQ('qc'+cornerN, blockID, blocksSource);
          }
        }
      }
      //----- change Template
      rebuildSVGTemplate();
    }


    function setCurvCornerPoints(cornerObj) {
      var cornerID = cornerObj.__data__.id,
          cornerN = Number(cornerID.replace(/\D+/g, "")),
          blockID = cornerObj.attributes.block_id.nodeValue,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocks = DesignStor.design.templateTEMP.details,
          blocksQty = blocks.length;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      while(--blocksQty > 0) {
        if(blocks[blocksQty].id === blockID) {
          //----- set curve corner
          if (cornerObj.__data__.view) {
            startCreateCornerPoint(cornerID, cornerN, blocks[blocksQty].linesOut, blocksQty, blocksSource);
            createQCPoint(cornerN, blocksQty, blocksSource);
          //----- change simple corner to corve
          } else {
            var linesQty = blocks[blocksQty].linesOut.length;
            for (var l = 0; l < linesQty; l++) {
              if (blocks[blocksQty].linesOut[l].from.id === 'c'+cornerN+'-2' && blocks[blocksQty].linesOut[l].to.id === 'c'+cornerN+'-1' ) {
                createCurveQPoint('corner', 'qc'+cornerN, blocks[blocksQty].linesOut[l], cornerN, blocksQty, blocksSource);
              }
            }
          }
        }
      }
      //----- change Template
      rebuildSVGTemplate();
    }


    function startCreateCornerPoint(cornerID, cornerN, lines, blockIndex, blocks) {
      var linesQty = lines.length;
      for(var l = 0; l < linesQty; l++) {
        if(lines[l].from.id === cornerID) {
          createCornerPoint(1, cornerN, lines[l], blockIndex, blocks);
        } else if(lines[l].to.id === cornerID) {
          createCornerPoint(2, cornerN, lines[l], blockIndex, blocks);
        }
      }
      //----- hide this point
      var pointsOutQty = blocks[blockIndex].pointsOut.length;
      while(--pointsOutQty > -1) {
        if(blocks[blockIndex].pointsOut[pointsOutQty].id === cornerID) {
          blocks[blockIndex].pointsOut[pointsOutQty].view = 0;
        }
      }
    }


    function createCornerPoint(pointN, cornerN, line, blockIndex, blocks) {
      var dictance = 200,
          cornerPoint = {
            type:'corner',
            id: 'c' + cornerN + '-' + pointN,
            dir:'line'
          };
      if(pointN === 1) {
        cornerPoint.x = ( line.from.x * (line.size - dictance) + line.to.x * dictance)/ line.size;
        cornerPoint.y = ( line.from.y * (line.size - dictance) + line.to.y * dictance)/ line.size;
      } else if(pointN === 2) {
        cornerPoint.x = ( line.from.x * dictance + line.to.x * (line.size - dictance))/ line.size;
        cornerPoint.y = ( line.from.y * dictance + line.to.y * (line.size - dictance))/ line.size;
      }
      blocks[blockIndex].pointsOut.push(cornerPoint);
    }


    function createQCPoint(cornerN, blocksInd, blocks) {
      var pointOutQty = blocks[blocksInd].pointsOut.length,
          currLine = {};
      while (--pointOutQty > -1) {
        if(blocks[blocksInd].pointsOut[pointOutQty].type === 'corner') {
          if (blocks[blocksInd].pointsOut[pointOutQty].id === 'c' + cornerN + '-2') {
            currLine.from = blocks[blocksInd].pointsOut[pointOutQty];
          }
          if (blocks[blocksInd].pointsOut[pointOutQty].id === 'c' + cornerN + '-1') {
            currLine.to = blocks[blocksInd].pointsOut[pointOutQty];
          }
        }
      }
      SVGServ.setLineCoef(currLine);
      currLine.size = GeneralServ.rounding10( (Math.hypot((currLine.to.x - currLine.from.x), (currLine.to.y - currLine.from.y))) );
      createCurveQPoint('corner', 'qc'+cornerN, currLine, cornerN, blocksInd, blocks);
    }


    function createCurveQPoint(typeQ, idQ, line, position, blockIndex, blocks) {
      var pointQ = {
        type: typeQ,
        blockId: blocks[blockIndex].id,
        id: idQ,
        heightQ: line.size/4,
        fromPId: line.from.id,
        toPId: line.to.id,
        positionQ: position
      };
      //---- insert impostPoint in parent block
      if(!blocks[blockIndex].pointsQ) {
        blocks[blockIndex].pointsQ = [];
      }
      blocks[blockIndex].pointsQ.push(pointQ);
    }





    function deleteCornerPoints(cornerObj) {
      var cornerID = cornerObj.__data__.id,
          cornerN = Number(cornerID.replace(/\D+/g, "")),
          blockID = cornerObj.attributes.block_id.nodeValue,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocksSourceQty = blocksSource.length;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      //------- delete corner point in block
      removePoint(['c' + cornerN + '-1', 'c' + cornerN + '-2'], blockID, blocksSource);

      //------- delete Q point in block
      removePointQ('qc'+cornerN, blockID, blocksSource);

      while(--blocksSourceQty > 0) {
        if(blocksSource[blocksSourceQty].id === blockID) {
          var pointsOutQty = blocksSource[blocksSourceQty].pointsOut.length;
          while(--pointsOutQty > -1) {
            if(blocksSource[blocksSourceQty].pointsOut[pointsOutQty].id === cornerID) {
              blocksSource[blocksSourceQty].pointsOut[pointsOutQty].view = 1;
            }
          }
        }
      }

      //----- change Template
      rebuildSVGTemplate();
    }


    function removePoint(criterions, blockId, blocks) {
      var blockQty = blocks.length;
      while(--blockQty > 0) {
        if(blocks[blockQty].id === blockId) {
          var pointsQty = blocks[blockQty].pointsOut.length;
          while(--pointsQty > -1) {
            var critQty = criterions.length;
            while(--critQty > -1) {
              if(blocks[blockQty].pointsOut[pointsQty].id === criterions[critQty]) {
                blocks[blockQty].pointsOut.splice(pointsQty, 1);
                break;
              }
            }
          }
        }
      }
    }


    function removePointQ(criterion, blockId, blocks) {
      var blockQty = blocks.length;
      while(--blockQty > 0) {
        if(blocks[blockQty].id === blockId) {
          if(blocks[blockQty].pointsQ) {
            var qQty = blocks[blockQty].pointsQ.length;
            while(--qQty > -1) {
              if(blocks[blockQty].pointsQ[qQty].id === criterion) {
                blocks[blockQty].pointsQ.splice(qQty, 1);
                break;
              }
            }
          }
        }
      }
    }




    //++++++++++ Edit Arc ++++++++//


    function createArc(arcObj) {
      var defer = $q.defer();
      if(!$.isEmptyObject(arcObj)) {

        var arc = arcObj.__data__;
//        console.log('+++++++++++++ ARC +++++++++++++++++++++');
        //------ make changes only if element is frame, don't touch arc
        if (arc.type === 'frame') {
          var arcN = Number(arc.points[0].id.replace(/\D+/g, "")),
              blockID = arcObj.attributes.block_id.nodeValue,
              blocks = angular.copy(DesignStor.design.templateTEMP.details),
              blocksQty = blocks.length,
              blocksSource = DesignStor.design.templateSourceTEMP.details,
              currBlockIndex, currLine, position;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          //------- find line and block in order to insert Q point
          for (var b = 1; b < blocksQty; b++) {
            if (blocks[b].id === blockID) {
              var linesQty = blocks[b].linesOut.length;
              while (--linesQty > -1) {
                if (blocks[b].linesOut[linesQty].from.id === arc.points[0].id && blocks[b].linesOut[linesQty].to.id === arc.points[1].id) {
                  currBlockIndex = b;
                  currLine = blocks[b].linesOut[linesQty];
                }
              }
            }
          }
          //------ up
          if (arc.points[0].fi < 180 && arc.points[1].fi < 180) {
            position = 1;
            //------ right
          } else if (arc.points[0].fi < 90 && arc.points[1].fi > 270) {
            position = 2;
            //------ down
          } else if (arc.points[0].fi > 180 && arc.points[1].fi > 180) {
            position = 3;
            //------ left
          } else if (arc.points[0].fi < 270 && arc.points[1].fi > 90) {
            position = 4;
          }
          var coordQ = SVGServ.setQPointCoord(position, currLine, currLine.size / 2);
          if (position === 1) {
            shiftingAllPoints(1, 0, coordQ.y, blocks);
            shiftingAllPoints(1, 0, coordQ.y, blocksSource);
            coordQ.y = 0;
          } else if (position === 4) {
            shiftingAllPoints(1, 1, coordQ.x, blocks);
            shiftingAllPoints(1, 1, coordQ.x, blocksSource);
            coordQ.x = 0;
          }
          //------- rebuild linesOut after shifting of points
          if (!coordQ.y || !coordQ.x) {
            currLine = rebuildLinesOut(arc.points, currBlockIndex, blocksSource);
          }
          createCurveQPoint('arc', 'qa'+arcN, currLine, position, currBlockIndex, blocksSource);

          //------ change templateTEMP
          SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function (result) {
            //------ delete sash if block sizes are small
            var wasSashDelet = checkSashesBySizeBlock(result);
            if (wasSashDelet) {
              SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function (result) {
                DesignStor.design.templateTEMP = angular.copy(result);
                defer.resolve('done');
              });
            } else {
              DesignStor.design.templateTEMP = angular.copy(result);
              defer.resolve('done');
            }

          });

        } else {
          defer.resolve('done');
        }
      }
      return defer.promise;
    }


    function shiftingAllPoints(dir, param, shift, blocks) {
      var blocksQty = blocks.length;
      while(--blocksQty > 0) {
        if(blocks[blocksQty].level) {
          //------ pointsOut
          if(blocks[blocksQty].pointsOut.length) {
            shiftingCoordPoints(dir, param, blocks[blocksQty].pointsOut, blocks[blocksQty].pointsOut.length, shift);
          }
          //------ pointsIn
          if(blocks[blocksQty].pointsIn.length) {
            shiftingCoordPoints(dir, param, blocks[blocksQty].pointsIn, blocks[blocksQty].pointsIn.length, shift);
          }
          //------ impostAxis
          if(blocks[blocksQty].impost) {
            var impostAxisQty = blocks[blocksQty].impost.impostAxis.length;
            if(impostAxisQty) {
              shiftingCoordPoints(dir, param, blocks[blocksQty].impost.impostAxis, impostAxisQty, shift);
            }
          }
        }
      }
    }

    function shiftingCoordPoints(dir, param, points, pointsQty, shift) {
      while(--pointsQty > -1) {
        if(param) {
          if(dir) {
            points[pointsQty].x += shift;
          } else {
            points[pointsQty].x -= shift;
          }
        } else {
          if(dir) {
            points[pointsQty].y += shift;
          } else {
            points[pointsQty].y -= shift;
          }
        }
      }
    }

    function rebuildLinesOut(arc, blockIndex, blocks) {
      var currLine,
          center = SVGServ.centerBlock(blocks[blockIndex].pointsOut),
          pointsOut = SVGServ.sortingPoints(blocks[blockIndex].pointsOut, center),
          linesOut = SVGServ.setLines(pointsOut),
          linesQty = linesOut.length;
      while(--linesQty > -1) {
        if(linesOut[linesQty].from.id === arc[0].id && linesOut[linesQty].to.id === arc[1].id) {
          currLine = linesOut[linesQty];
        }
      }
      return currLine;
    }



    function deleteArc(arcObj) {
      var defer = $q.defer();
      if(!$.isEmptyObject(arcObj)) {
        var arc = arcObj.__data__;
//console.log('DELET ARC+++++++',arc);
        if (arc.type === 'arc') {
          var arcID = arc.points[1].id,
              blockID = arcObj.attributes.block_id.nodeValue,
              blocksSource = DesignStor.design.templateSourceTEMP.details;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          //------- delete Q point in block (pointsQ)
          removePointQ(arcID, blockID, blocksSource);

          //------ unshifting
          if (!arc.points[1].x) {
            shiftingAllPoints(0, 1, arc.points[0].x, blocksSource);
          } else if (!arc.points[1].y) {
            shiftingAllPoints(0, 0, arc.points[0].y, blocksSource);
          }

          //------ change templateTEMP
          SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function (result) {
            //------ delete sash if block sizes are small
            var wasSashDelet = checkSashesBySizeBlock(result);
            if (wasSashDelet) {
              SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function (result) {
                DesignStor.design.templateTEMP = angular.copy(result);
                defer.resolve('done');
              });
            } else {
              DesignStor.design.templateTEMP = angular.copy(result);
              defer.resolve('done');
            }

          });

        } else {
          defer.resolve('done');
        }
      }
      return defer.promise;
    }


    function workingWithAllArcs(param) {
      var firstArc = DesignStor.design.selectedArc.shift(),
          arcId = firstArc.attributes.item_id.nodeValue,
          currElem = d3.select('#tamlateSVG [item_id='+arcId+']');
      if(currElem[0].length) {
        if(param) {
          createArc(currElem[0][0]).then(function() {
            if(DesignStor.design.selectedArc.length) {
              $timeout(function() {
                workingWithAllArcs(param);
              }, 1)
            }
          });
        } else {
          deleteArc(currElem[0][0]).then(function() {
            if(DesignStor.design.selectedArc.length) {
              $timeout(function() {
                workingWithAllArcs(param);
              }, 1)
            }
          });
        }
      }
    }





    //++++++++++ Edit Imposts ++++++++//


    function createImpost(impType, glassObj) {
      var glass = glassObj.__data__,
          blockID = glassObj.attributes.block_id.nodeValue,
          minGlassSize = d3.min(glass.sizes),
          blocks = DesignStor.design.templateTEMP.details,
          blocksQty = blocks.length,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          angel, dimType = 0, isImpCurv = 0, positionQ, currBlockInd, curBlockN, lastBlockN, impVector, crossPoints;


      if(minGlassSize >= globalConstants.minSizeLimit && glass.square >= globalConstants.squareLimit) {
//      if(glass.square >= globalConstants.squareLimit) {

        //---- save last step
        DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

        //-------- dimType x = 0, y = 1

        switch (impType) {
          //----- vertical
          case 2:
            angel = 90;
            break;
          //----- horisontal
          case 3:
            angel = 180;
            dimType = 1;
            break;
          //----- inclined right
          case 4:
            angel = 170;
            dimType = 1;
            break;
          case 5:
            angel = 190;
            dimType = 1;
            break;
          //----- inclined left
          case 6:
            angel = 80;
            break;
          case 7:
            angel = 100;
            break;

          //----- curve vertical
          case 8:
            angel = 90;
            isImpCurv = 1;
            positionQ = 2; //---right
            break;
          case 9:
            angel = 90;
            isImpCurv = 1;
            positionQ = 4; //---left
            break;
          //----- curve horisontal
          case 10:
            angel = 180;
            dimType = 1;
            isImpCurv = 1;
            positionQ = 1; //--- up
            break;
          case 11:
            angel = 180;
            dimType = 1;
            isImpCurv = 1;
            positionQ = 3; //--- down
            break;
          //----- inclined right curve
          case 12:
            angel = 100;
            isImpCurv = 1;
            positionQ = 1; //---- left-up
            break;
          case 13:
            angel = 100;
            isImpCurv = 1;
            positionQ = 3; //---- right-down
            break;
          //----- inclined left curve
          case 14:
            angel = 10;
            dimType = 1;
            isImpCurv = 1;
            positionQ = 4; //----- left-down
            break;
          case 15:
            angel = 10;
            dimType = 1;
            isImpCurv = 1;
            positionQ = 2; //----- right-up
            break;
        }
        //------- find lines as to current block
        for (var b = 1; b < blocksQty; b++) {
          if (blocks[b].id === blockID) {
            currBlockInd = b;
            curBlockN = Number(blocks[b].id.replace(/\D+/g, ""));
          }
        }
        lastBlockN = getLastBlockNumber(blocksSource);
        impVector = SVGServ.cteateLineByAngel(blocks[currBlockInd].center, angel);
//        console.log('~~~~~~~~~~~~impVector~~~~~~~~', impVector);
        crossPoints = getImpostCrossPointInBlock(impVector, blocks[currBlockInd].linesOut);

        if(crossPoints.length > 2) {
          sliceExtraPoints(crossPoints);
        }

        var impPointsQty = crossPoints.length;
        if (impPointsQty === 2) {

          while (--impPointsQty > -1) {
//            createImpostPoint(crossPoints[impPointsQty], curBlockN, currBlockInd, blocksSource, impPointsQty);
            createImpostPoint(crossPoints[impPointsQty], curBlockN, currBlockInd, blocksSource, dimType);
            createChildBlock(++lastBlockN, currBlockInd, blocksSource);
          }
          //------- if impost is curve
          if (isImpCurv) {
            var distMax = getRadiusMaxImpostCurv(positionQ, impVector, blocks[currBlockInd].linesIn, blocks[currBlockInd].pointsIn);
            createImpostQPoint(distMax, positionQ, curBlockN, currBlockInd, blocksSource);
          }

          //----- change Template
          rebuildSVGTemplate();
        } else {
          //------ show error
          showErrorInBlock(blockID);
          //TODO reload again createImpost(impType, glassObj) with angel changed +10 degree
        }

      } else {
        //------ show error
        showErrorInBlock(blockID);
      }
    }




    function getLastBlockNumber(blocks) {
      var blocksQty = blocks.length,
          blockN = 0;
      while(--blocksQty > 0) {
        var tempN = Number(blocks[blocksQty].id.replace(/\D+/g, ""));
        if(tempN > blockN) {
          blockN = tempN;
        }
      }
      return blockN;
    }


    function getImpostCrossPointInBlock(vector, lines) {
      var impPoints = [],
          linesQty = lines.length;
      for(var l = 0; l < linesQty; l++) {
        var coord, checkPoint;
//        console.log('~~~~~~~~~~~~lines[l]~~~~~~~~', lines[l]);
        coord = SVGServ.getCoordCrossPoint(vector, lines[l]);
        if(coord.x >= 0 && coord.y >= 0) {
          //------ checking is cross point inner of line
          checkPoint = SVGServ.checkLineOwnPoint(coord, lines[l].to, lines[l].from);
//          console.log('~~~~~~~~~~~~checkPoint~~~~~~~~', checkPoint);
          var isCross = SVGServ.isInsidePointInLine(checkPoint);
          if(isCross) {
            //---- checking dublicats
            var noExist = SVGServ.checkEqualPoints(coord, impPoints);
            if(noExist) {

              //----------- avoid insert impost in corner
              var noInCorner1 = checkImpPointInCorner(lines[l].from, coord);
              if(noInCorner1) {
                var noInCorner2 = checkImpPointInCorner(lines[l].to, coord);
                if(noInCorner2) {
//                  console.log('IMp++++++++++ line', lines[l]);
//                  console.log('~~~~~~~~~~~~coord~~~~~~~~', coord);
                  impPoints.push(coord);
                }
              }
            }
          }
        }
      }
      return impPoints;
    }



    function sliceExtraPoints(points) {
      var diff = 5,
          pQty = points.length;
      while(--pQty > -1) {
        var pQty2 = points.length;
        while(--pQty2 > -1){
          var difX = Math.abs( points[pQty].x - points[pQty2].x),
              difY = Math.abs( points[pQty].y - points[pQty2].y);
          if(difX > 0 && difX < diff) {
            if(difY > 0 && difY < diff) {
              points.splice(pQty, 1);
              break;
            }
          }
        }
      }
    }



    function checkImpPointInCorner(linePoint, impPoint) {
      var noMatch = 1,
          limit = 40,
          xDiff = impPoint.x - linePoint.x,
          yDiff = impPoint.y - linePoint.y;

      if(xDiff > 0 && xDiff < limit) {
        if(yDiff > 0 && yDiff < limit) {
          noMatch = 0;
        }
      }
      return noMatch;
    }


    function createImpostPoint(coord, curBlockN, blockIndex, blocks, dimType, isShtulp) {
      var impPoint = {
        type:'impost',
        id:'ip'+curBlockN,
        x: coord.x,
        y: coord.y,
        dir:'line',
        dimType: dimType
      };
      //---------- for SHTULP
      if(isShtulp) {
        impPoint.type = 'shtulp';
        impPoint.id = 'sht'+curBlockN;
      }
      //---- insert impostPoint in parent block
      if(!blocks[blockIndex].impost) {
        blocks[blockIndex].impost = {
          impostAxis: [],
          impostOut: [],
          impostIn: []
        };
      }
      blocks[blockIndex].impost.impostAxis.push(impPoint);
    }


    function createChildBlock (blockN, blockIndex, blocks, isShtulp, sashParams) {
      var newBlock = {
        type: 'skylight',
        id: 'block_' + blockN,
        level: blocks[blockIndex].level + 1,
        blockType: 'frame',
        parent: blocks[blockIndex].id,
        children: [],
        pointsOut: [],
        pointsIn: [],
        parts: [],
        glassId: blocks[blockIndex].glassId,
        glassTxt: blocks[blockIndex].glassTxt
      };

      //---------- for SHTULP
      if(isShtulp) {
        newBlock.blockType = 'sash';
        angular.extend(newBlock, sashParams);
      }

      //---- add Id new block in parent block
      blocks[blockIndex].children.push(newBlock.id);
      //---- insert block in blocks
      blocks.push(newBlock);
    }


    function getRadiusMaxImpostCurv(position, impVector, linesIn, pointsIn) {
//      console.log('!!!!!!!!!!getRadiusMaxImpostCurv!!!!!!!!!');

      var crossPointsIn = getImpostCrossPointInBlock(impVector, linesIn);
//      console.log('!!!!!!!!!!crossPointsIn!!!!!!!!!', crossPointsIn);
      if(crossPointsIn.length === 2) {
        var impLine = {
              from: crossPointsIn[0],
              to: crossPointsIn[1]
            },
            impRadius = GeneralServ.rounding10( (Math.hypot((impLine.from.x - impLine.to.x), (impLine.from.y - impLine.to.y)) / 2) ),
            pointsIn = angular.copy(pointsIn),
            pointsQty = pointsIn.length,
            currPoints = [],
            currBlockCenter,
            distCenterToImpost,
            coordQ, posQ;

        SVGServ.setLineCoef(impLine);
        coordQ = SVGServ.setQPointCoord(position, impLine, impRadius);
        //------ if impost vert or hor
        if (!impLine.coefA && position === 1) {
          coordQ.y -= impRadius * 2;
        } else if (!impLine.coefB && position === 4) {
          coordQ.x -= impRadius * 2;
        }
        posQ = SVGServ.setPointLocationToLine(impLine.from, impLine.to, coordQ);
        while (--pointsQty > -1) {
          var posP = SVGServ.setPointLocationToLine(impLine.from, impLine.to, pointsIn[pointsQty]);
          if (posP > 0 && posQ > 0) {
            currPoints.push(pointsIn[pointsQty]);
          } else if (posP < 0 && posQ < 0) {
            currPoints.push(pointsIn[pointsQty]);
          }
        }
        currPoints.push(impLine.from, impLine.to);
//        console.log('!!!!!!!!!!currPoints!!!!!!!!!', currPoints);
        currBlockCenter = SVGServ.centerBlock(currPoints);
//        console.log('!!!!!!!!!!currBlockCenter!!!!!!!!!', currBlockCenter);
        distCenterToImpost = GeneralServ.rounding10( (Math.abs((impLine.coefA * currBlockCenter.x + impLine.coefB * currBlockCenter.y + impLine.coefC) / Math.hypot(impLine.coefA, impLine.coefB))) );
//      console.log('IMP -------------',impRadius, distCenterToImpost);
        if (impRadius < distCenterToImpost) {
          return impRadius / 2;
        } else {
          return distCenterToImpost / 2;
        }
      }
    }


    function createImpostQPoint(dist, position, curBlockN, blockIndex, blocks) {
      var impQPoint = {
        blockId: blocks[blockIndex].id,
        dir:'curv',
        id: 'qi'+curBlockN,
        heightQ: dist,
        positionQ: position
      };
      blocks[blockIndex].impost.impostAxis.push(impQPoint);
    }






    function deleteImpost(impObj) {
      var blockID = impObj.attributes.block_id.nodeValue,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocksSource.length;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      //----- delete children blocks and impost points
      while(--blocksQty > 0) {
        if(blocksSource[blocksQty].id === blockID) {
          removeAllChildrenBlock(blocksSource[blocksQty].children[0], blocksSource);
          removeAllChildrenBlock(blocksSource[blocksQty].children[1], blocksSource);
          blocksSource[blocksQty].children.length = 0;
          delete blocksSource[blocksQty].impost;
          break;
        }
      }

      //----- change Template
      rebuildSVGTemplate();
    }


    function removeAllChildrenBlock(blockID, blocks) {
      var blocksQty = blocks.length;
      while(--blocksQty > 0) {
        if(blocks[blocksQty].id === blockID) {
          var childQty = blocks[blocksQty].children.length;
          if(childQty) {
            removeAllChildrenBlock(blocks[blocksQty].children[0], blocks);
            removeAllChildrenBlock(blocks[blocksQty].children[1], blocks);
            blocks.splice(blocksQty, 1);
          } else {
            blocks.splice(blocksQty, 1);
          }
          break;
        }
      }

    }





    //++++++++++ Create Mirror ++++++++//


    function initMirror() {
      var blocks = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocks.length,
          points = SVGServ.collectAllPointsOut(DesignStor.design.templateTEMP.details),
          maxX = d3.max(points, function(d) { return d.x; });

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      changeCoordPointsAsMirror(maxX, blocks, blocksQty);

      for(var b = 1; b < blocksQty; b++) {
        if(blocks[b].level === 1) {
          changeChildrenIdChildren(b, blocksQty, blocks);
        }
      }
//      console.log('mirror blocks_________', blocks);
      rebuildSVGTemplate();
      $timeout(function() {
        DesignStor.design.activeMenuItem = 0;
      }, 500);
    }


    function changeCoordPointsAsMirror(maxX, blocks, blocksQty) {
      for(var b = 1; b < blocksQty; b++) {
        if(blocks[b].level && blocks[b].pointsQ) {
          var pqQty = blocks[b].pointsQ.length;
          if(pqQty) {
            while(--pqQty > -1) {
              if(blocks[b].pointsQ[pqQty].id.indexOf('qa')+1) {
                setOppositDirRadiusAsMirror(blocks[b].pointsQ[pqQty]);
              } else if(blocks[b].pointsQ[pqQty].id.indexOf('qc')+1) {
                setOppositDirRadiusInclinedAsMirror(blocks[b].pointsQ[pqQty]);
              }
            }
          }
        }
        if(blocks[b].impost) {
          setNewCoordPointsAsMirror(maxX, blocks[b].impost.impostAxis);
          //------- if impost curve - change Q
          if(blocks[b].impost.impostAxis[2]) {
            var tempLine = {
              from: blocks[b].impost.impostAxis[0],
              to: blocks[b].impost.impostAxis[1]
            };
            SVGServ.setLineCoef(tempLine);
            //--------- if horizontal or vertical
            if(!tempLine.coefA || !tempLine.coefB) {
              setOppositDirRadiusAsMirror(blocks[b].impost.impostAxis[2]);
            } else {
              setOppositDirRadiusInclinedAsMirror(blocks[b].impost.impostAxis[2]);
            }
          }
        }
        if(blocks[b].pointsOut.length) {
          setNewCoordPointsAsMirror(maxX, blocks[b].pointsOut);
        }
        if(blocks[b].pointsIn.length) {
          setNewCoordPointsAsMirror(maxX, blocks[b].pointsIn);
        }

      }
    }


    function setNewCoordPointsAsMirror(maxX, points) {
      var pointsQty = points.length;
      while(--pointsQty > -1) {
        //        if(points[pointsQty].type !== 'frame') {
        if (points[pointsQty].x === 0) {
          points[pointsQty].x = maxX;
        } else if (points[pointsQty].x === maxX) {
          points[pointsQty].x = 0;
        } else {
          points[pointsQty].x = maxX - points[pointsQty].x;
        }
        //        }
      }
    }


    function setOppositDirRadiusAsMirror(pointsQ) {
      if(pointsQ.positionQ === 4) {
        pointsQ.positionQ = 2;
      } else if(pointsQ.positionQ === 2) {
        pointsQ.positionQ = 4;
      }
    }


    function setOppositDirRadiusInclinedAsMirror(pointsQ) {
      if(pointsQ.positionQ === 4) {
        pointsQ.positionQ = 3;
      } else if(pointsQ.positionQ === 2) {
        pointsQ.positionQ = 1;
      } else if(pointsQ.positionQ === 1) {
        pointsQ.positionQ = 2;
      } else if(pointsQ.positionQ === 3) {
        pointsQ.positionQ = 4;
      }
    }


    function changeChildrenIdChildren(indexBlock, blocksQty, blocks) {
      var childQty = blocks[indexBlock].children.length;
      if(childQty) {
        //------- change Id place of children
        var lastChildId = blocks[indexBlock].children.pop();
        blocks[indexBlock].children.unshift(lastChildId);
        for(var b = 1; b < blocksQty; b++) {
          if(blocks[b].id === blocks[indexBlock].children[0] || blocks[b].id === blocks[indexBlock].children[1]) {
            //----- change children
            changeChildrenIdChildren(b, blocksQty, blocks);
          }
        }
      }

    }




    function positionAxis() {
      var blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocksSource.length,
          parentBlocs = [], parentBlocsQty,
          impostInd = [],
          parentSizeMin, parentSizeMax, tempImpost,
          step, impostIndSort, impostIndQty, newX,
          b, p, i;

      //console.warn(blocks, blocksSource);

      //----- find parent block dimensions
      for(b = 1; b < blocksQty; b++) {
        if(blocksSource[b].level === 1) {
          parentBlocs.push(blocksSource[b].pointsOut.map(function(point) {
            return point.x;
          }));
        }
      }
      //console.info('impost parent----', parentBlocs);
      //----- find vertical imosts
      parentBlocsQty = parentBlocs.length;
      for(p = 0; p < parentBlocsQty; p++) {
        impostInd = [];
        parentSizeMin = d3.min(parentBlocs[p]);
        parentSizeMax = d3.max(parentBlocs[p]);

        //console.log('max/min', parentSizeMin, parentSizeMax);
        for(b = 1; b < blocksQty; b++) {
          if(blocksSource[b].impost) {
            if(blocksSource[b].impost.impostAxis) {
              //----- if impost vertical
              if(blocksSource[b].impost.impostAxis[0].x === blocksSource[b].impost.impostAxis[1].x) {
                if(blocksSource[b].impost.impostAxis[0].x > parentSizeMin && blocksSource[b].impost.impostAxis[0].x < parentSizeMax) {
                  tempImpost = {ind: b, x: blocksSource[b].impost.impostAxis[0].x};
                  impostInd.push(tempImpost);
                  //console.info('impost', blocksSource[b].impost.impostAxis, tempImpost);
                }
              }
            }
          }
        }
        //----- set new step
        step = (parentSizeMax/(impostInd.length+1));
        impostIndSort = impostInd.sort(SVGServ.sortByX);
        impostIndQty = impostIndSort.length;

        for(i = 0; i < impostIndQty; i++) {
          //-------- insert back imposts X
          if(!i) {
            newX = (parentSizeMin + step);
          } else {
            newX = (impostIndSort[i-1].x + step);
          }
          //console.warn('final----', newX);
          impostIndSort[i].x = newX;
          blocksSource[impostIndSort[i].ind].impost.impostAxis[0].x = newX;
          blocksSource[impostIndSort[i].ind].impost.impostAxis[1].x = newX;
        }
      }
      rebuildSVGTemplate();
    }










    /**=============== CHANGE CONSTRUCTION SIZE ==============*/


    //------- set click to all Dimensions
    function initAllDimension() {
      d3.selectAll('#tamlateSVG .size-box')
        .each(function() {
          var size = d3.select(this);
          size.on(clickEvent, function() {
            var sizeRect = size.select('.size-rect'),
                isActive = sizeRect[0][0].attributes[0].nodeValue.indexOf('active')+1;

            if(DesignStor.design.tempSize.length) {
              /** save new Size when click another size */
              closeSizeCaclulator();
              cleanTempSize();
            } else {
              if (isActive) {
                hideSizeTools();
              } else {
                deselectAllDimension();
                sizeRect.classed('active', true);
                var dim = size.select('.size-txt-edit');
                dim.classed('active', true);
                DesignStor.design.oldSize = dim[0][0];
                DesignStor.design.minSizeLimit = +dim[0][0].attributes[8].nodeValue;
                DesignStor.design.maxSizeLimit = +dim[0][0].attributes[9].nodeValue;
                //------- show caclulator or voice helper
                if (GlobalStor.global.isVoiceHelper) {
                  DesignStor.design.openVoiceHelper = 1;
                  startRecognition(doneRecognition, recognitionProgress, GlobalStor.global.voiceHelperLanguage);
                } else {
                  GlobalStor.global.isSizeCalculator = 1;
                  DesignStor.design.isMinSizeRestriction = 0;
                  DesignStor.design.isMaxSizeRestriction = 0;
                }
              }
              $rootScope.$apply();
            }
          });
        });

      /** switch on keyboard */
      d3.select(window)
        .on('keydown', function() {
          if(GlobalStor.global.isSizeCalculator) {
            pressCulculator(d3.event);
          }
        });
    }





    function doneRecognition(value) {
      //console.log("полученные данные", value);
      //console.log("тип полученных данных", typeof value);
      DesignStor.design.voiceTxt = value;
      $rootScope.$apply();
      $timeout(function() {
        var intValue = parseStringToDimension(value);
        //console.log("данные после парса", intValue);
        //console.log("тип полученных данных", typeof intValue);
        if (intValue == "NaN") {
          intValue = $filter('translate')('construction.VOICE_NOT_UNDERSTAND');
        }
        playTTS(intValue);
        setValueSize(intValue);
        $rootScope.$apply();
      }, 1000)
    }



    //---------- define voice force
    function recognitionProgress(value) {
      if (value > 100) {
        //console.log('value', value);
        DesignStor.design.loudVoice = true;
        DesignStor.design.quietVoice = false;

      } else {
        //console.log('value', value);
        DesignStor.design.loudVoice = false;
        DesignStor.design.quietVoice = true;
      }
      $rootScope.$apply();
    }






    /**=============== Size Calculator ==============*/


    function pressCulculator(keyEvent) {
      var newValue;
      //--------- Enter
      if (keyEvent.which === 13) {
        closeSizeCaclulator();
        $rootScope.$apply();
      } else if(keyEvent.which === 8) {
        //-------- Backspace
        deleteLastNumber();
      } else {
        switch(keyEvent.which) {
          case 48:
          case 96:
            newValue = 0;
            break;
          case 49:
          case 97:
            newValue = 1;
            break;
          case 50:
          case 98:
            newValue = 2;
            break;
          case 51:
          case 99:
            newValue = 3;
            break;
          case 52:
          case 100:
            newValue = 4;
            break;
          case 53:
          case 101:
            newValue = 5;
            break;
          case 54:
          case 102:
            newValue = 6;
            break;
          case 55:
          case 103:
            newValue = 7;
            break;
          case 56:
          case 104:
            newValue = 8;
            break;
          case 57:
          case 105:
            newValue = 9;
            break;
        }
        if(newValue !== undefined) {
          setValueSize(newValue);
        }
      }
    }


    //-------- Get number from calculator
    function setValueSize(newValue) {
      //console.log('take new value = ', newValue);
      if(GlobalStor.global.isVoiceHelper) {

        var tempVal = parseInt(newValue, 10);
        //console.log('tempVal=====', tempVal);
        DesignStor.design.voiceTxt = '';
        DesignStor.design.openVoiceHelper = false;

        if ((tempVal > 0) && (tempVal < 10000)) {
          DesignStor.design.tempSize = ("" + tempVal).split('');
          //console.log('$scope.constructData.tempSize == ', $scope.constructData.tempSize);
          changeSize();
        }
        deselectAllDimension();

      } else {
        //---- clear array from 0 after delete all number in array
        if (DesignStor.design.tempSize.length === 1 && DesignStor.design.tempSize[0] === 0) {
          DesignStor.design.tempSize.length = 0;
        }
        if (DesignStor.design.tempSize.length === 4) {
          DesignStor.design.tempSize.length = 0;
        }
        if (newValue === '0') {
          if (DesignStor.design.tempSize.length !== 0 && DesignStor.design.tempSize[0] !== 0) {
            DesignStor.design.tempSize.push(newValue);
            changeSize();
          }
        }
        if(newValue === '00') {
          if (DesignStor.design.tempSize.length !== 0 && DesignStor.design.tempSize[0] !== 0) {
            if (DesignStor.design.tempSize.length < 3) {
              DesignStor.design.tempSize.push(0, 0);
            } else if (DesignStor.design.tempSize.length === 3) {
              DesignStor.design.tempSize.push(0);
            }
            changeSize();
          }
        }
        if(newValue !== '0' && newValue !== '00') {
          DesignStor.design.tempSize.push(newValue);
          changeSize();
        }
      }
    }



    //------ Delete last number from calculator
    function deleteLastNumber() {
      DesignStor.design.tempSize.pop();
      if(DesignStor.design.tempSize.length < 1) {
        DesignStor.design.tempSize.push(0);
      }
      changeSize();
    }





    //------ Change size on SVG
    function changeSize() {
      var newSizeString = '';
      for(var numer = 0; numer < DesignStor.design.tempSize.length; numer++) {
        newSizeString += DesignStor.design.tempSize[numer].toString();
      }
      var dim = d3.select(DesignStor.design.oldSize);
      dim.text(newSizeString);
      if(GlobalStor.global.isVoiceHelper) {
        closeSizeCaclulator();
      }
    }




    //------- Close Size Calculator
    function closeSizeCaclulator(prom) {
      var deff = $q.defer();
      if(DesignStor.design.tempSize.length) {
        var newLength = parseInt(DesignStor.design.tempSize.join(''), 10);
        //------- Dimensions limits checking
        if (newLength >= DesignStor.design.minSizeLimit && newLength <= DesignStor.design.maxSizeLimit) {

          addNewSizeInTemplate(newLength);
          //------ close size calculator and deactive size box in svg
          hideSizeTools();
          //----- change Template
          SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function(result) {
            DesignStor.design.templateTEMP = angular.copy(result);
            cleanTempSize();
            deff.resolve(1);
          });
        } else {

          //------ show error size
          if(newLength < DesignStor.design.minSizeLimit) {
            if(GlobalStor.global.isVoiceHelper) {
              playTTS($filter('translate')('construction.VOICE_SMALLEST_SIZE'), GlobalStor.global.voiceHelperLanguage);
              //------- deactive size box in svg
              deselectAllDimension();
              //-------- build new template
              rebuildSVGTemplate();
            } else {
              DesignStor.design.isMinSizeRestriction = 1;
              DesignStor.design.isMaxSizeRestriction = 0;
            }
          } else if(newLength > DesignStor.design.maxSizeLimit) {
            if(GlobalStor.global.isVoiceHelper) {
              playTTS($filter('translate')('construction.VOICE_BIGGEST_SIZE'), GlobalStor.global.voiceHelperLanguage);
              //------- deactive size box in svg
              deselectAllDimension();
              //-------- build new template
              rebuildSVGTemplate();
            } else {
              DesignStor.design.isMinSizeRestriction = 0;
              DesignStor.design.isMaxSizeRestriction = 1;
            }
          }
          deff.resolve(1);
        }
      } else {
        //------ close size calculator and deselect All Dimension
        hideSizeTools();
        deff.resolve(1);
      }
      DesignStor.design.openVoiceHelper = 0;
      DesignStor.design.loudVoice = 0;
      DesignStor.design.quietVoice = 0;
      console.log('FINISH CACL');
      if(prom) {
        return deff.promise;
      }
    }





    function addNewSizeInTemplate(newLength) {
      DesignStor.design.isMinSizeRestriction = 0;
      DesignStor.design.isMaxSizeRestriction = 0;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));


      //-------- change point coordinates in templateSource
      var blocks = DesignStor.design.templateSourceTEMP.details,
          blocksOLD = DesignStor.design.templateTEMP.details,
          curBlockId = DesignStor.design.oldSize.attributes[6].nodeValue,
          curDimType = DesignStor.design.oldSize.attributes[5].nodeValue,
          dimId = DesignStor.design.oldSize.attributes[10].nodeValue,
          blocksQty = blocks.length;

      //          console.log('SIZE ````````curBlockId````````', curBlockId);
      //          console.log('SIZE ````````curDimType````````', curDimType);
      //          console.log('SIZE ````````dimId````````', dimId);


      if(curDimType === 'curve') {
        //============ changing Radius

        var newHeightQ = culcHeightQByRadiusCurve(+DesignStor.design.oldSize.attributes[11].nodeValue, newLength);

        mainFor: for (var b = 1; b < blocksQty; b++) {
          if(blocks[b].id === curBlockId) {
            //-------- search in PointsQ
            if(blocks[b].pointsQ) {
              var pointsQQty = blocks[b].pointsQ.length;
              while(--pointsQQty > -1) {
                if(blocks[b].pointsQ[pointsQQty].id === dimId) {
                  blocks[b].pointsQ[pointsQQty].heightQ = newHeightQ;
                  break mainFor;
                }
              }
            }
            //-------- search in Imposts
            if(blocks[b].impost) {
              if(blocks[b].impost.impostAxis[2].id === dimId) {
                blocks[b].impost.impostAxis[2].heightQ = newHeightQ;
                break mainFor;
              }
            }

          }
        }

      } else if(dimId.indexOf('qa')+1) {
        //========== changing Arc Height

        for(var b = 1; b < blocksQty; b++) {
          if(blocks[b].level === 1) {
            var pointsQQty = blocks[b].pointsQ.length;
            if(pointsQQty) {
              while(--pointsQQty > -1) {
                if(blocks[b].pointsQ[pointsQQty].id === dimId) {
                  blocks[b].pointsQ[pointsQQty].heightQ = newLength;
                  //                      console.log('ARC height=====', blocks[b].pointsQ[pointsQQty]);
                }
              }
            }
          }
        }

      } else {
        //========== changing Line dimension

        var startSize = +DesignStor.design.oldSize.attributes[11].nodeValue,
            oldSizeValue = +DesignStor.design.oldSize.attributes[12].nodeValue,
            axis = DesignStor.design.oldSize.attributes[13].nodeValue;

        //            console.log('SIZE ````````newLength````````', newLength);
        //            console.log('SIZE ````````startSize````````', startSize);
        //            console.log('SIZE ````````oldSizeValue````````', oldSizeValue);
        //            console.log('SIZE ````````axis````````', axis);

        for(var b = 1; b < blocksQty; b++) {
          var pointsOutQty = blocks[b].pointsOut.length;
          if(pointsOutQty) {
            while(--pointsOutQty > -1) {
              if(axis === 'x') {
                if (blocks[b].pointsOut[pointsOutQty].x === oldSizeValue) {
                  blocks[b].pointsOut[pointsOutQty].x = startSize + newLength;
                }
              } else if(axis === 'y') {
                if (blocks[b].pointsOut[pointsOutQty].y === oldSizeValue) {
                  blocks[b].pointsOut[pointsOutQty].y = startSize + newLength;
                }
              }
            }
          }
          if(blocks[b].impost) {
            for(var i = 0; i < 2; i++) {
              if(axis === 'x') {
                if (blocks[b].impost.impostAxis[i].x === oldSizeValue) {
                  blocks[b].impost.impostAxis[i].x = startSize + newLength;
                  //                      console.log('SIZE ````````x````````', blocks[b].impost.impostAxis[i]);
                }
              } else if (axis === 'y') {
                if (blocks[b].impost.impostAxis[i].y === oldSizeValue) {
                  blocks[b].impost.impostAxis[i].y = startSize + newLength;
                  //                      console.log('SIZE ````````y````````', blocks[b].impost.impostAxis[i]);
                }
              }
            }
          }
        }

      }
    }







    function cleanTempSize() {
      DesignStor.design.tempSize.length = 0;
      DesignStor.design.isMinSizeRestriction = 0;
      DesignStor.design.isMaxSizeRestriction = 0;
    }


    function culcHeightQByRadiusCurve(lineLength, radius) {
      return GeneralServ.rounding10( (radius - Math.sqrt(Math.pow(radius,2) - Math.pow(lineLength,2)/4)) );
    }


    function hideSizeTools() {
      deselectAllDimension();
      GlobalStor.global.isSizeCalculator = 0;
      DesignStor.design.openVoiceHelper = 0;
    }


    function deselectAllDimension() {
      d3.selectAll('#tamlateSVG .size-rect').classed('active', false);
      d3.selectAll('#tamlateSVG .size-txt-edit').classed('active', false);
    }






    function removeAllEventsInSVG() {
      //--------- delete click on imposts
      d3.selectAll('#tamlateSVG [item_type=impost]')
        .each(function() {
          d3.select(this).on(clickEvent, null);
        });
      //--------- delete click on glasses
      d3.selectAll('#tamlateSVG .glass')
        .each(function() {
          d3.select(this).on(clickEvent, null);
//          d3.select(this).on("touchstart", null);
//          d3.select(this).on("mousedown", null);
//          d3.select(this).on("touchend", null);
//          d3.select(this).on("mouseup", null);
        });
      //--------- delete click on arcs
      d3.selectAll('#tamlateSVG .frame')
        .each(function() {
          d3.select(this).on(clickEvent, null);
        });
      //--------- delete click on dimension
      d3.selectAll('#tamlateSVG .size-box')
        .each(function() {
          d3.select(this).on(clickEvent, null);
        });
      //--------- delete event listener for keydown
      d3.select(window).on('keydown', null);
    }




    function stepBack() {
      var lastIndex = DesignStor.design.designSteps.length - 1;
      DesignStor.design.templateSourceTEMP = angular.copy(DesignStor.design.designSteps[lastIndex]);
      SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths).then(function(result) {
        DesignStor.design.templateTEMP = angular.copy(result);
      });
      DesignStor.design.designSteps.pop();
      cleanTempSize();
      hideSizeTools();
    }



  }
})();
