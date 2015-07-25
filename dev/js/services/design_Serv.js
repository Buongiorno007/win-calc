/* globals d3, sortNumbers, startRecognition, parseStringToDimension, playTTS */
(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('DesignModule')
    .factory('DesignServ', designFactory);

  function designFactory($rootScope, $location, $timeout, $filter, $q, $cordovaProgress, MainServ, globalConstants, optionsServ, SVGServ, GlobalStor, DesignStor, ProductStor) {

    var thisFactory = this,
        sizeRectActClass = 'size-rect-active',
        sizeBoxActClass = 'size-value-active',
        newLength;

    thisFactory.publicObj = {
      setDefaultTemplate: setDefaultTemplate,
      designSaved: designSaved,
      designCancel: designCancel,
      setDefaultConstruction: setDefaultConstruction,

      initAllImposts: initAllImposts,
      initAllGlassXDimension: initAllGlassXDimension,
      initAllDimension: initAllDimension,
      hideCornerMarks: hideCornerMarks,
      deselectAllImpost: deselectAllImpost,
      deselectAllArc: deselectAllArc,
      deselectAllGlass: deselectAllGlass,
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

      //---- change sizes
      setValueSize: setValueSize,
      deleteLastNumber: deleteLastNumber,
      closeSizeCaclulator: closeSizeCaclulator,

      stepBack: stepBack,

      //---- door
      downloadDoorConfig: downloadDoorConfig,
      setIndexDoorConfig: setIndexDoorConfig
    };

    return thisFactory.publicObj;




    //============ methods ================//


    function setDefaultTemplate() {
      DesignStor.designSource.templateSourceTEMP = angular.copy(ProductStor.product.templateSource);
      DesignStor.designSource.templateTEMP = angular.copy(ProductStor.product.template);
      DesignStor.design.templateSourceTEMP = angular.copy(ProductStor.product.templateSource);
      DesignStor.design.templateTEMP = angular.copy(ProductStor.product.template);
    }



    //------- Save and Close Construction Page
    function designSaved() {
      //------ if calculator is closed
      if(!GlobalStor.global.isSizeCalculator) {
        //$cordovaProgress.showSimple(true);
        //----- save new template in product
        ProductStor.product.templateSource = angular.copy(DesignStor.design.templateSourceTEMP);
        ProductStor.product.template = angular.copy(DesignStor.design.templateTEMP);
        //----- create template icon
        SVGServ.createSVGTemplateIcon(ProductStor.product.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
          ProductStor.product.templateIcon = angular.copy(result);
        });

        //============ if Door Construction
        if(ProductStor.product.constructionType === 4) {
          //------- save new door config
          ProductStor.product.doorShapeId = DesignStor.design.doorShapeList[DesignStor.design.doorConfig.doorShapeIndex].shapeId;
          ProductStor.product.doorSashShapeId = DesignStor.design.doorShapeList[DesignStor.design.doorConfig.sashShapeIndex].shapeId;
          ProductStor.product.doorHandleShapeId = DesignStor.design.doorShapeList[DesignStor.design.doorConfig.handleShapeIndex].shapeId;
          ProductStor.product.doorLockShapeId = DesignStor.design.doorShapeList[DesignStor.design.doorConfig.lockShapeIndex].shapeId;
        }

        //------ save new template in templates Array
        changeTemplateInArray(ProductStor.product.templateIndex, ProductStor.product.templateSource, ProductStor.product.template, ProductStor.product.templateIcon);

        //------- refresh price of new template
        MainServ.preparePrice(ProductStor.product.template, ProductStor.product.profileId, ProductStor.product.glassId, ProductStor.product.hardwareId).then(function() {
          //-------- template was changed
          GlobalStor.global.isChangedTemplate = true;
          //$cordovaProgress.hide();
          backtoTemplatePanel();
        });

      }
    }



    function changeTemplateInArray(templateIndex, newTemplateSource, newTemplate, newTemplateIcon) {
      //----- save new template in array of templates
      GlobalStor.global.templatesSource[templateIndex] = angular.copy(newTemplateSource);
//      GlobalStor.global.templates[templateIndex] = angular.copy(newTemplate);
//      GlobalStor.global.templatesIcon[templateIndex] = angular.copy(newTemplateIcon);
    }



    //--------- Cancel and Close Construction Page
    function designCancel() {
      //------- close calculator if is opened
      GlobalStor.global.isSizeCalculator = false;
      //------ go to Main Page
      backtoTemplatePanel();
    }



    //-------- Back to Template Panel
    function backtoTemplatePanel() {
      //------ cleaning DesignStor
      DesignStor.design = DesignStor.setDefaultDesign();
      //      delete DesignStor.design.templateSourceTEMP;
      //      delete DesignStor.design.templateTEMP;
      MainServ.prepareMainPage();
      $location.path('/main');
    }


    //------- set Default Construction
    function setDefaultConstruction() {
      //----- do if Size Calculator is not opened
      if(!GlobalStor.global.isSizeCalculator) {
        DesignStor.design = DesignStor.setDefaultDesign();
        setDefaultTemplate();
        //============ if Door Construction
        if(ProductStor.product.constructionType === 4) {
          //---- set indexes
          setIndexDoorConfig();
        }
      }
    }





    //============== Door ============//

    function downloadDoorConfig() {
      optionsServ.getDoorConfig(function (results) {
        if (results.status) {
          DesignStor.design.doorShapeList = results.data.doorType;
          DesignStor.design.sashShapeList = results.data.sashType;
          DesignStor.design.handleShapeList = results.data.handleType;
          DesignStor.design.lockShapeList = results.data.lockType;

          //---- set indexes
          setIndexDoorConfig();

        } else {
          console.log(results);
        }
      });
    }

    function setIndexDoorConfig() {
      DesignStor.designSource.doorConfig.doorShapeIndex = setDoorConfigIndex(DesignStor.design.doorShapeList, ProductStor.product.doorShapeId);
      DesignStor.designSource.doorConfig.sashShapeIndex = setDoorConfigIndex(DesignStor.design.doorShapeList, ProductStor.product.doorSashShapeId);
      DesignStor.designSource.doorConfig.handleShapeIndex = setDoorConfigIndex(DesignStor.design.doorShapeList, ProductStor.product.doorHandleShapeId);
      DesignStor.designSource.doorConfig.lockShapeIndex = setDoorConfigIndex(DesignStor.design.doorShapeList, ProductStor.product.doorLockShapeId);

      //-------- set Default values in design
      DesignStor.design.doorConfig = DesignStor.setDefaultDoor();
    }


    function setDoorConfigIndex(list, configId) {
      var listQty = list.length,
          i = 0;
      for(;i < listQty; i++) {
        if(list[i].shapeId === configId) {
          return i;
        }
      }
    }





    //========== Edit Design =============//


    //------ add to all imposts event on click
    function initAllImposts() {
//      console.log('init imposts');
      DesignStor.design.selectedImpost.length = 0;
      d3.selectAll('#tamlateSVG [item_type=impost]')
        .each(function() {
          var impost = d3.select(this);
          impost.on('click', function() {
            var isImpost = isExistImpostInSelected(impost[0][0]);
            if(isImpost) {
              impost.classed('frame-active', false);
              //----- if none imposts
              if(!DesignStor.design.selectedImpost.length) {
                //------- close impost menu and submenu
                DesignStor.design.activeMenuItem = 0;
                DesignStor.design.activeSubMenuItem = 0;
                $rootScope.$apply();
              }
            } else {
              impost.classed('frame-active', true);
              //------- active impost menu and submenu
              DesignStor.design.activeMenuItem = 3;
              DesignStor.design.activeSubMenuItem = 3;
              hideCornerMarks();
              deselectAllArc();
              deselectAllGlass();
              $rootScope.$apply();
            }
          });
        });
    }


    //------- set click to all Glass for Dimensions
    function initAllGlassXDimension() {
      d3.selectAll('#tamlateSVG .glass')
        .each(function() {
          var glass = d3.select(this);
          glass.on('click', function() {
            hideAllDimension();
            var parentID = glass[0][0].attributes.parent_id.nodeValue,
                blockID = glass[0][0].attributes.block_id.nodeValue;

//            console.log('SELECTED GLASS+++++++++++++', parentID, blockID);
            if(parentID === 'block_0') {
              parentID = blockID;
            }
//            console.log('SELECTED dimBlockId+++++++++++++',parentID);
            var dim = d3.selectAll('#tamlateSVG .dim_block[block_id='+parentID+']');
            if(dim[0].length) {
              d3.select('#tamlateSVG .dim_blockX').classed('dim_shiftX', true);
              d3.select('#tamlateSVG .dim_blockY').classed('dim_shiftY', true);
              dim.classed('dim_hidden', false);
            }
//            console.log('SELECTED Dim+++++++++++++',dim);
          });
        });
    }


    function hideAllDimension() {
      d3.select('#tamlateSVG .dim_blockX').classed('dim_shiftX', false);
      d3.select('#tamlateSVG .dim_blockY').classed('dim_shiftY', false);
      d3.selectAll('#tamlateSVG .dim_block').classed('dim_hidden', true);
    }


    function hideCornerMarks() {
      d3.selectAll('#tamlateSVG .corner_mark')
        .transition()
        .duration(300)
        .ease("linear")
        .attr('r', 0);
    }

    function deselectAllImpost() {
      d3.selectAll('#tamlateSVG [item_type=impost]').classed('frame-active', false);
      DesignStor.design.selectedImpost.length = 0;
    }


    function deselectAllArc() {
      d3.selectAll('#tamlateSVG .frame').classed('active_svg', false);
    }


    function deselectAllGlass() {
      d3.selectAll('#tamlateSVG .glass').classed('glass-active', false);
    }


    function rebuildSVGTemplate() {
      SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
        DesignStor.design.templateTEMP = angular.copy(result);
      });
    }


    //++++++++++ Edit Sash +++++++++//

    function createSash(type, glassObj) {
      var glass = glassObj.__data__,
          blockID = glassObj.attributes.block_id.nodeValue,
          blocks = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocks.length,
//          dim = getMaxMinCoord(glass.points),
          minGlassSize = d3.min(glass.sizes);

//      console.log('GLASS SIZES', glassObj.__data__);
//      if(glass.square > globalConstants.squareLimit && (dim.maxX - dim.minX) > globalConstants.widthLimit && (dim.maxY - dim.minY) > globalConstants.heightLimint) {
//      if((dim.maxX - dim.minX) > globalConstants.widthLimit && (dim.maxY - dim.minY) > globalConstants.heightLimint) {
      if(minGlassSize >= globalConstants.minSizeLimit && minGlassSize >= globalConstants.minSizeLimit) {

        //---- save last step
        DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

        for (var b = 1; b < blocksQty; b++) {
          if (blocks[b].id === blockID) {
            blocks[b].blockType = 'sash';
            blocks[b].gridId = 0;

            switch (type) {
              //----- 'left'
              case 2:
                blocks[b].openDir = [4];
                blocks[b].handlePos = 4;
                break;
              //----- 'right'
              case 3:
                blocks[b].openDir = [2];
                blocks[b].handlePos = 2;
                break;
              //----- 'up'
              case 4:
                blocks[b].openDir = [1];
                blocks[b].handlePos = 1;
                break;
              //------ 'down'
              case 5:
                blocks[b].openDir = [3];
                blocks[b].handlePos = 3;
                break;
              //------ 'up', 'right'
              case 6:
                blocks[b].openDir = [1, 2];
                blocks[b].handlePos = 2;
                break;
              //------ 'up', 'left'
              case 7:
                blocks[b].openDir = [1, 4];
                blocks[b].handlePos = 4;
                break;
            }
            //----- change Template
            rebuildSVGTemplate();
          }
        }
      } else {
        console.log('not available');
        console.log(blockID);
        console.log(d3.selectAll('[block_id='+blockID+']'));//"[color=red]"

//        //------ show error
//        d3.selectAll('[blockId="'+blockID+'"]').each(function() {
//          if(this.attributes.class.nodeValue === 'glass') {
//            console.log('__class___', this.attributes.class.nodeValue);
//            var currGlass = d3.select(this);
//            currGlass.classed('error_glass', true);
//          }
//        });
        d3.selectAll('#tamlateSVG .glass[block_id='+blockID+']').each(function(){
//          if(this.attributes.block_id.nodeValue === blockID) {
            var currGlass = d3.select(this),
                i = 1;

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


//          }
        });

      }
    }


    function deleteSash(glassObj) {
      var blockID = glassObj.attributes.block_id.nodeValue,
          blocks = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocks.length;

      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      for(var b = 1; b < blocksQty; b++) {
        if (blocks[b].id === blockID) {
          removeSashPropInBlock(blocks[b]);
        }
      }
      //----- change Template
      rebuildSVGTemplate();
    }


    function removeSashPropInBlock(block) {
      block.blockType = 'frame';
      delete block.openDir;
      delete block.handlePos;
      delete block.gridId;
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
      currLine.size = Math.round(Math.hypot((currLine.to.x - currLine.from.x), (currLine.to.y - currLine.from.y)) * 100) / 100;
      createCurveQPoint('corner', 'qc'+cornerN, currLine, cornerN, blocksInd, blocks);
    }


    function createCurveQPoint(typeQ, idQ, line, position, blockIndex, blocks) {
      var pointQ = {
        type: typeQ,
        id: idQ,
        radius: line.size/4,
        radiusMax: line.size/4,
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
          SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function (result) {
            //------ delete sash if block sizes are small
            var wasSashDelet = checkSashesBySizeBlock(result);
            if (wasSashDelet) {
              SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function (result) {
                DesignStor.design.templateTEMP = angular.copy(result);
                defer.resolve('done');
              });
            } else {
              DesignStor.design.templateTEMP = angular.copy(result);
              defer.resolve('done');
            }

          });

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
          SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function (result) {
            //------ delete sash if block sizes are small
            var wasSashDelet = checkSashesBySizeBlock(result);
            if (wasSashDelet) {
              SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function (result) {
                DesignStor.design.templateTEMP = angular.copy(result);
                defer.resolve('done');
              });
            } else {
              DesignStor.design.templateTEMP = angular.copy(result);
              defer.resolve('done');
            }

          });

        }
      }
      return defer.promise;
    }


    function workingWithAllArcs(mark, qty) {
      var currElem = d3.select('#tamlateSVG [item_type='+mark+']');
      if(currElem[0].length) {
        if(mark === 'frame') {
          createArc(currElem[0][0]).then(function() {
            --qty;
            if(qty > 0) {
              $timeout(function() {
                workingWithAllArcs(mark, qty);
              }, 1)
            }
          });
        } else if(mark === 'arc') {
          deleteArc(currElem[0][0]).then(function() {
            --qty;
            if(qty > 0) {
              $timeout(function() {
                workingWithAllArcs(mark, qty);
              }, 1)
            }
          });
        }
      }
    }





    //++++++++++ Edit Imposts ++++++++//


    function isExistImpostInSelected(newImpost) {
      var exist = 0,
          newImpId = newImpost.attributes.block_id.nodeValue,
          imposts = DesignStor.design.selectedImpost,
          impostsQty = imposts.length;
      while(--impostsQty > -1) {
        //------ existed impost
        if(imposts[impostsQty].attributes.block_id.nodeValue === newImpId) {
          DesignStor.design.selectedImpost.splice(impostsQty, 1);
          exist = 1;
          break;
        }
      }
      //-------- if the impost is new one
      if(!exist){
        DesignStor.design.selectedImpost.push(newImpost);
      }
      return exist;
    }



    function createImpost(impType, glassObj) {
      var glass = glassObj.__data__,
          blockID = glassObj.attributes.block_id.nodeValue,
          dim = getMaxMinCoord(glass.points),
          blocks = DesignStor.design.templateTEMP.details,
          blocksQty = blocks.length,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          angel, isImpCurv = 0, positionQ, currBlockInd, curBlockN, lastBlockN, impVector, crossPoints;

//      console.log('+++++',dim);
//TODO set limits
//      if(glass.square > globalConstants.squareLimit && (dim.maxX - dim.minX) > globalConstants.widthLimit && (dim.maxY - dim.minY) > globalConstants.heightLimint) {
//      if((dim.maxX - dim.minX) > globalConstants.widthLimit && (dim.maxY - dim.minY) > globalConstants.heightLimint) {
//
      //---- save last step
      DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

      switch(impType){
        //----- vertical
        case 2:
          angel = 90;
          break;
        //----- horisontal
        case 3:
          angel = 180;
          break;
        //----- inclined right
        case 4:
          angel = 150;
          break;
        //----- inclined left
        case 5:
          angel = 70;
          break;

        //----- curve vertical
        case 6:
          angel = 90;
          isImpCurv = 1;
          positionQ = 2; //---right
          break;
        case 7:
          angel = 90;
          isImpCurv = 1;
          positionQ = 4; //---left
          break;
        //----- curve horisontal
        case 8:
          angel = 180;
          isImpCurv = 1;
          positionQ = 1; //--- up
          break;
        case 9:
          angel = 180;
          isImpCurv = 1;
          positionQ = 3; //--- down
          break;
        //----- inclined right curve
        case 10:
          angel = 120;
          isImpCurv = 1;
          positionQ = 1; //---- left-up
          break;
        case 11:
          angel = 120;
          isImpCurv = 1;
          positionQ = 3; //---- right-down
          break;
        //----- inclined left curve
        case 12:
          angel = 30;
          isImpCurv = 1;
          positionQ = 4; //----- left-down
          break;
        case 13:
          angel = 30;
          isImpCurv = 1;
          positionQ = 2; //----- right-up
          break;
      }
      //------- find lines as to current block
      for(var b = 1; b < blocksQty; b++) {
        if(blocks[b].id === blockID) {
          currBlockInd = b;
          curBlockN = Number(blocks[b].id.replace(/\D+/g, ""));
        }
      }
      lastBlockN = getLastBlockNumber(blocksSource);
      impVector = SVGServ.cteateLineByAngel(blocks[currBlockInd].center, angel);
      crossPoints = getImpostCrossPointInBlock(impVector, blocks[currBlockInd].linesOut);

      var impPointsQty = crossPoints.length;
      if(impPointsQty === 2) {
        while(--impPointsQty > -1) {
          createImpostPoint(crossPoints[impPointsQty], curBlockN, currBlockInd, blocksSource);
          createChildBlock(++lastBlockN, currBlockInd, blocksSource);
        }
        //------- if impost is curve
        if(isImpCurv) {
          var distMax = getRadiusMaxImpostCurv(positionQ, impVector, blocks[currBlockInd].linesIn, blocks[currBlockInd].pointsIn);
          createImpostQPoint(distMax, positionQ, curBlockN, currBlockInd, blocksSource);
        }
      }
      //----- change Template
      rebuildSVGTemplate();
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
        coord = SVGServ.getCoordCrossPoint(vector, lines[l]);
        if(coord.x >= 0 && coord.y >= 0) {
          //------ checking is cross point inner of line
          checkPoint = SVGServ.checkLineOwnPoint(coord, lines[l].to, lines[l].from);
          var isCross = SVGServ.isInsidePointInLine(checkPoint);
          if(isCross) {
            //---- checking dublicats
            var noExist = SVGServ.checkEqualPoints(coord, impPoints);
            if(noExist) {
              impPoints.push(coord);
            }
          }
        }
      }
      return impPoints;
    }


    function createImpostPoint(coord, curBlockN, blockIndex, blocks) {
      var impPoint = {
        type:'impost',
        id:'ip'+curBlockN,
        x: coord.x,
        y: coord.y,
        dir:'line'
      };
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


    function createChildBlock (blockN, blockIndex, blocks) {
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
        glassId: blocks[blockIndex].glassId
      };
      //---- add Id new block in parent block
      blocks[blockIndex].children.push(newBlock.id);
      //---- insert block in blocks
      blocks.push(newBlock);
    }


    function getRadiusMaxImpostCurv(position, impVector, linesIn, pointsIn) {
      var crossPointsIn = getImpostCrossPointInBlock(impVector, linesIn);
      if(crossPointsIn.length === 2) {
        var impLine = {
              from: crossPointsIn[0],
              to: crossPointsIn[1]
            },
            impRadius = Math.round(Math.hypot((impLine.from.x - impLine.to.x), (impLine.from.y - impLine.to.y)) / 2 * 100) / 100,
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
        currBlockCenter = SVGServ.centerBlock(currPoints);
        distCenterToImpost = Math.round(Math.abs((impLine.coefA * currBlockCenter.x + impLine.coefB * currBlockCenter.y + impLine.coefC) / Math.hypot(impLine.coefA, impLine.coefB)) * 100) / 100;
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
        id: 'ip'+curBlockN,
        radius: dist,
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
        if(blocks[b].impost) {
          setNewCoordPointsAsMirror(maxX, blocks[b].impost.impostAxis);
//            changeCoordYInclinedImpost(blocks[b].impost.impostAxis);
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








    //=============== CHANGE CONSTRUCTION SIZE ==============//


    //------- set click to all Dimensions
    function initAllDimension() {
      d3.selectAll('#tamlateSVG .size-box')
        .each(function() {
          var size = d3.select(this);
          size.on('click', function() {
            //----- if calculator is closed
            if(!GlobalStor.global.isSizeCalculator) {
              deselectAllDimension();
              size.select('.size-rect').classed('active', true);
              var dim = size.select('.size-txt-edit');
              dim.classed('active', true);
              console.log('SIZE CLICK', dim);
              DesignStor.design.oldSize = dim[0][0];
              DesignStor.design.minSizeLimit = +dim[0][0].attributes[9].nodeValue;
              DesignStor.design.maxSizeLimit = +dim[0][0].attributes[10].nodeValue;

              //------- show caclulator or voice helper
              if(GlobalStor.global.isVoiceHelper) {
                DesignStor.design.openVoiceHelper = 1;
                startRecognition(doneRecognition, recognitionProgress, GlobalStor.global.voiceHelperLanguage);
              } else {
                GlobalStor.global.isSizeCalculator = 1;
              }
            } else {
              deselectAllDimension();
              GlobalStor.global.isSizeCalculator = 0;
            }
            $rootScope.$apply();
          });
        });
    }



    function deselectAllDimension() {
      d3.selectAll('#tamlateSVG .size-rect').classed('active', false);
      d3.selectAll('#tamlateSVG .size-txt-edit').classed('active', false);
    }





//    //----- click on size SVG and get size value and Id
//    function selectSizeBlock() {
//      if (!GlobalStor.global.isSizeCalculator) {
//        var thisSize = $(this).parent();
//        DesignStor.design.startSize = +thisSize.attr('from-point');
//        DesignStor.design.finishSize = +thisSize.attr('to-point');
//        DesignStor.design.minSizePoint = +thisSize.attr('min-val');
//        DesignStor.design.maxSizePoint = +thisSize.attr('max-val');
//        DesignStor.design.maxSizeLimit = (DesignStor.design.maxSizePoint - DesignStor.design.startSize);
//        if(thisSize.attr('id') === 'overallDimH' || thisSize.attr('id') === 'overallDimV') {
//          DesignStor.design.minSizeLimit = DesignStor.design.minSizePoint;
//        } else {
//          DesignStor.design.minSizeLimit = 200;
//        }
//        DesignStor.design.tempSizeId = thisSize.attr('id');
//        DesignStor.design.tempSizeType = thisSize.attr('size-type');
//        DesignStor.design.oldSizeValue = +thisSize.text();
//
//        //--- show size calculator if voice helper is turn off
//        if (!GlobalStor.global.isVoiceHelper) {
//          GlobalStor.global.isSizeCalculator = true;
//        } else {
//          DesignStor.design.openVoiceHelper = true;
//          startRecognition(doneRecognition, recognitionProgress, GlobalStor.global.voiceHelperLanguage);
//
//        }
//        $rootScope.$apply();
//      }
//    }



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






    //=============== Size Calculator ==============//

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
//        deactiveSizeBox(sizeRectActClass, sizeBoxActClass);

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
      console.log('changeSize++++++++++', newSizeString);
      var dim = d3.select(DesignStor.design.oldSize);
      dim.text(newSizeString);

      console.log('changeSize++++++++++', DesignStor.design.oldSize);

      if(GlobalStor.global.isVoiceHelper) {
        closeSizeCaclulator();
      }
    }




    //------- Close Size Calculator
    function closeSizeCaclulator() {

      if(DesignStor.design.tempSize.length > 0) {
        newLength = parseInt(DesignStor.design.tempSize.join(''), 10);


        //              5: block_id
        //              6: from-point
        //              7: to-point
        //              8: size-val
        //              9: min-val
        //              10: max-val

        //------- Dimensions limits checking
        if (newLength >= DesignStor.design.minSizeLimit && newLength <= DesignStor.design.maxSizeLimit) {
          DesignStor.design.isMinSizeRestriction = 0;
          DesignStor.design.isMaxSizeRestriction = 0;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));


          //-------- change point coordinates in templateSource
          var oldSizeValue = +DesignStor.design.oldSize.attributes[7].nodeValue;
          var startSize = +DesignStor.design.oldSize.attributes[6].nodeValue;
          var axis = DesignStor.design.oldSize.attributes[11].nodeValue;
          var blocks = DesignStor.design.templateSourceTEMP.details;

          for (var b = 1; b < blocks.length; b++) {
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
                  }
                } else if (axis === 'y') {
                  if (blocks[b].impost.impostAxis[i].y === oldSizeValue) {
                    blocks[b].impost.impostAxis[i].y = startSize + newLength;
                  }
                }
              }
            }


          }


          //------ close size calculator
          GlobalStor.global.isSizeCalculator = 0;
          //------- deactive size box in svg
          deselectAllDimension();

          //----- change Template
          rebuildSVGTemplate();

          DesignStor.design.tempSize.length = 0;
          DesignStor.design.isMinSizeRestriction = 0;
          DesignStor.design.isMaxSizeRestriction = 0;
        } else {

          //------ show error size
          if(newLength < DesignStor.design.minSizeLimit) {
            if(GlobalStor.global.isVoiceHelper) {
              playTTS($filter('translate')('construction.VOICE_SMALLEST_SIZE'), GlobalStor.global.voiceHelperLanguage);
              //------- deactive size box in svg
              deselectAllDimension();
              //-------- build new template
              SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
                DesignStor.design.templateTEMP = angular.copy(result);
              });
//              DesignStor.design.templateTEMP = new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths);
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
              SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
                DesignStor.design.templateTEMP = angular.copy(result);
              });
//              DesignStor.design.templateTEMP = new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths);
            } else {
              DesignStor.design.isMinSizeRestriction = 0;
              DesignStor.design.isMaxSizeRestriction = 1;
            }
          }

        }
      } else {
        /*
         DesignStor.design.minSizeLimit = 200;
         DesignStor.design.maxSizeLimit = 5000;
         */
        //------ close size calculator
        GlobalStor.global.isSizeCalculator = 0;
        deselectAllDimension();
      }
      DesignStor.design.openVoiceHelper = 0;
      DesignStor.design.loudVoice = 0;
      DesignStor.design.quietVoice = 0;

    }








    function stepBack() {
      var lastIndex = DesignStor.design.designSteps.length - 1;
      DesignStor.design.templateSourceTEMP = angular.copy(DesignStor.design.designSteps[lastIndex]);
      SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
        DesignStor.design.templateTEMP = angular.copy(result);
      });
      DesignStor.design.designSteps.pop();
    }



  }
})();
