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
      selectSizeBlock: selectSizeBlock,
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
      console.log('init imposts');
      DesignStor.design.selectedImpost.length = 0;
      d3.selectAll('#tamlateSVG [item-type=impost]')
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


    function hideCornerMarks() {
      d3.selectAll('#tamlateSVG .corner_mark')
        .transition()
        .duration(300)
        .ease("linear")
        .attr('r', 0);
    }

    function deselectAllImpost() {
      d3.selectAll('#tamlateSVG [item-type=impost]').classed('frame-active', false);
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
          blockID = glassObj.attributes.blockId.nodeValue,
          blocks = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocks.length,
          dim = getMaxMinCoord(glass.points);
//      if(glass.square > globalConstants.squareLimit && (dim.maxX - dim.minX) > globalConstants.widthLimit && (dim.maxY - dim.minY) > globalConstants.heightLimint) {
      if((dim.maxX - dim.minX) > globalConstants.widthLimit && (dim.maxY - dim.minY) > globalConstants.heightLimint) {
        for (var b = 0; b < blocksQty; b++) {
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
        console.log(d3.selectAll('[blockId='+blockID+']'));//"[color=red]"

//        //------ show error
//        d3.selectAll('[blockId="'+blockID+'"]').each(function() {
//          if(this.attributes.class.nodeValue === 'glass') {
//            console.log('__class___', this.attributes.class.nodeValue);
//            var currGlass = d3.select(this);
//            currGlass.classed('error_glass', true);
//          }
//        });
        d3.selectAll('#tamlateSVG .glass').each(function(){
          if(this.attributes.blockId.nodeValue === blockID) {
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


          }
        });

      }
    }


    function deleteSash(glassObj) {
      var blockID = glassObj.attributes.blockId.nodeValue,
          blocks = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocks.length;
      for(var b = 0; b < blocksQty; b++) {
        if (blocks[b].id === blockID) {
          blocks[b].blockType = 'frame';
          delete blocks[b].openDir;
          delete blocks[b].handlePos;
          delete blocks[b].gridId;
        }
      }
      //----- change Template
      rebuildSVGTemplate();
    }





    //++++++++++ Edit Corners ++++++++//



    function setCornerPoints(cornerObj) {
      var cornerID = cornerObj.__data__.id,
          cornerN = Number(cornerID.replace(/\D+/g, "")),
          blockID = cornerObj.attributes.blockId.nodeValue,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocks = DesignStor.design.templateTEMP.details,
          blocksQty = blocks.length;

      while(--blocksQty > -1) {
        if(blocks[blocksQty].id === blockID) {
          //---- set simple corner
          if(cornerObj.__data__.view) {
            startCreateCornerPoint(cornerID, cornerN, blocks[blocksQty].linesOut, blocksQty, blocksSource);

          //----- change curve corner to simple
          } else {
            //---- delete qc point in blocks
            removePoint(['qc'+cornerN], blockID, blocksSource);
          }
        }
      }
      //----- change Template
      rebuildSVGTemplate();
    }



    function setCurvCornerPoints(cornerObj) {
      var cornerID = cornerObj.__data__.id,
          cornerN = Number(cornerID.replace(/\D+/g, "")),
          blockID = cornerObj.attributes.blockId.nodeValue,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocks = DesignStor.design.templateTEMP.details,
          blocksQty = blocks.length;

      while(--blocksQty > -1) {
        if(blocks[blocksQty].id === blockID) {
          //----- set curve corner
          if (cornerObj.__data__.view) {
            startCreateCornerPoint(cornerID, cornerN, blocks[blocksQty].linesOut, blocksQty, blocksSource);
            createQCPoint(cornerN, cornerObj.__data__, blocksQty, blocksSource);

          //----- change simple corner to corve
          } else {
            var linesQty = blocks[blocksQty].linesOut.length;
            for (var l = 0; l < linesQty; l++) {
              if (blocks[blocksQty].linesOut[l].from.id === 'c'+cornerN+'-2' && blocks[blocksQty].linesOut[l].to.id === 'c'+cornerN+'-1' ) {
                var qcPoint = setQPointCoord(cornerN, blocks[blocksQty].linesOut[l]);
                createQCPoint(cornerN, qcPoint, blocksQty, blocksSource);
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


    function createQCPoint(cornerN, framePoint, blockIndex, blocks) {
      var QCPoint = {
        type:'corner',
        id: 'qc' + cornerN,
        x: framePoint.x,
        y: framePoint.y,
        dir:'curv'
      };
      blocks[blockIndex].pointsOut.push(QCPoint);
    }



    function setQPointCoord(side, line) {
      var midX = (line.from.x + line.to.x)/ 2,
          midY = (line.from.y + line.to.y)/ 2,
          dist = line.size/ 2,
          coordQP = {};

      if(!line.coefA || !line.coefB) {
        coordQP.x = Math.round(Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) ))) + midX;
        coordQP.y = Math.round(Math.sqrt( Math.pow(dist, 2) - Math.pow((coordQP.x - midX), 2)  )) + midY;
      } else {
        switch(side) {
          case 1:
            coordQP.y = midY - Math.round(Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) )));
            coordQP.x = midX - Math.round(Math.sqrt( Math.pow(dist, 2) - Math.pow((midY - coordQP.y), 2)  ));
            break;
          case 2:
            coordQP.y = midY - Math.round(Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) )));
            coordQP.x = Math.round(Math.sqrt( Math.pow(dist, 2) - Math.pow((coordQP.y - midY), 2)  )) + midX;
            break;
          case 3:
            coordQP.y = Math.round(Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) ))) + midY;
            coordQP.x = Math.round(Math.sqrt( Math.pow(dist, 2) - Math.pow((coordQP.y - midY), 2)  )) + midX;
            break;
          case 4:
            coordQP.y = Math.round(Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) ))) + midY;
            coordQP.x = midX - Math.round(Math.sqrt( Math.pow(dist, 2) - Math.pow((midY - coordQP.y), 2)  ));
            break;
        }
      }
      coordQP.y = parseFloat(coordQP.y.toFixed(2));
      coordQP.x = parseFloat(coordQP.x.toFixed(2));
      return coordQP;
    }


    function deleteCornerPoints(cornerObj) {
      var cornerID = cornerObj.__data__.id,
          cornerN = Number(cornerID.replace(/\D+/g, "")),
          blockID = cornerObj.attributes.blockId.nodeValue,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocksSourceQty = blocksSource.length;

      //------- delete corner point in block
      removePoint(['c' + cornerN + '-1', 'c' + cornerN + '-2', 'qc'+cornerN], blockID, blocksSource);

      while(--blocksSourceQty > -1) {
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
      while(--blockQty > -1) {
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






    //++++++++++ Edit Arc ++++++++//


    function createArc(arcObj) {
      var defer = $q.defer(),
          arc = arcObj.__data__;
      //------ make changes only if element is frame, don't touch arc
      if(arc.type === 'frame') {
        var arcN = Number(arc.points[0].id.replace(/\D+/g, "")),
            blockID = arcObj.attributes.blockId.nodeValue,
            blocks = angular.copy(DesignStor.design.templateTEMP.details),
            blocksQty = blocks.length,
            blocksSource = DesignStor.design.templateSourceTEMP.details,
            currBlockIndex, currLine, position;

        //------- find line and block in order to insert Q point
        for(var b = 0; b < blocksQty; b++) {
          if(blocks[b].id === blockID) {
            var linesQty = blocks[b].linesOut.length;
            while(--linesQty > -1) {
              if(blocks[b].linesOut[linesQty].from.id === arc.points[0].id && blocks[b].linesOut[linesQty].to.id === arc.points[1].id) {
                currBlockIndex = b;
                currLine = blocks[b].linesOut[linesQty];
              }
            }
          }
        }


        //------ up
        if(arc.points[0].fi < 180 && arc.points[1].fi < 180) {
          position = 1;
          //------ right
        } else if(arc.points[0].fi < 90 && arc.points[1].fi > 270) {
          position = 2;
          //------ down
        } else if(arc.points[0].fi > 180 && arc.points[1].fi > 180) {
          position = 3;
          //------ left
        } else if(arc.points[0].fi < 270 && arc.points[1].fi > 90) {
          position = 4;
        }
        var coordQ = setQPointCoord(position, currLine);
        if(position === 1) {
          shiftingAllPoints(1, 0, coordQ.y, blocks);
          shiftingAllPoints(1, 0, coordQ.y, blocksSource);
          coordQ.y = 0;
        } else if(position === 4) {
          shiftingAllPoints(1, 1, coordQ.x, blocks);
          shiftingAllPoints(1, 1, coordQ.x, blocksSource);
          coordQ.x = 0;
        }
        //------- rebuild linesOut after shifting of points
        if(!coordQ.y || !coordQ.x) {
          currLine = rebuildLinesOut(arc.points, currBlockIndex, blocksSource);
        }
        createArcPoint(arcN, coordQ, currBlockIndex, blocksSource);
        console.log('blocksSource++++++++=', blocksSource);
        console.log('blocks++++++++=', blocks);
        //------ collect imposts which are crossed with arc line
        var imposts = findImpostsCrossLineArc(currLine, blocksQty, blocks);
        console.log('imposts++++++++=', imposts);

        //------ create Q points (left/right) of crossing impost with arc and new point of impost
        var impostsQty = imposts.length;
        if(impostsQty) {
          //---- sorting imposts
          imposts.sort(function(a,b) {
            return a.indexBlock - b.indexBlock;
          });
          setQPointImpostArc(arcN, imposts, currLine.from, currLine.to, coordQ, blocks, blocksSource);
        }

        //------ change templateTEMP
        SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
          DesignStor.design.templateTEMP = angular.copy(result);
          defer.resolve('done');
        });
        return defer.promise;
      }
    }





    function shiftingAllPoints(dir, param, shift, blocks) {
      var blocksQty = blocks.length;
      while(--blocksQty > -1) {
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


    function createArcPoint(arcN, coordQP, blockIndex, blocks) {
      var pointQ = {
        type:'arc',
        id:'qa'+arcN,
        x: coordQP.x,
        y: coordQP.y,
        dir:'curv'
      };
      //---- insert pointQ in pointsOut of current block
      blocks[blockIndex].pointsOut.push(pointQ);
    }



    function findImpostsCrossLineArc(currLine, blocksQty, blocks) {
      var imposts = [];

      var blockInds = findBlockCrossLineArc(currLine, blocksQty, blocks);
      console.log('~~~~~~blockInds~~~~~', blockInds);
      var blockIndsQty = blockInds.length;

      for(var i = 0; i < blockIndsQty; i++) {
        var b = blockInds[i];
        if(blocks[b].impost) {
          console.log('imp_______', blocks[b].impost);
          var impost = {
            indexBlock: b,
            from: angular.copy(blocks[b].impost.impostAxis[0]),
            to: angular.copy(blocks[b].impost.impostAxis[1])
          };
          SVGServ.setLineCoef(impost);
          console.log('currLine +++++', currLine, impost);
          impost.intersect = SVGServ.getCoordCrossPoint(currLine, impost);
          console.log('impost.intersect', impost.intersect);
          if(impost.intersect.x >= 0 && impost.intersect.y >= 0) {

            //------ checking is cross point inner of line
            var checkPoint = SVGServ.checkLineOwnPoint(impost.intersect, impost.to, impost.from);
            console.log('checkPoint', checkPoint);
            if (checkPoint.x >= 0 && checkPoint.x <= 1 || checkPoint.y >= 0 && checkPoint.y <= 1) {
              console.log('currLine.from++++', currLine.from);
              console.log(' currLine.to+++++',  currLine.to);
              console.log('impostAxis0 +++', blocks[b].impost.impostAxis[0]);
              console.log('impostAxis1++++', blocks[b].impost.impostAxis[1]);
              var position1 = SVGServ.setPointLocationToLine(currLine.from, currLine.to, impost.from),
                  position2 = SVGServ.setPointLocationToLine(currLine.from, currLine.to, impost.to);
              console.log('position++++++++=',position1, position2);
              if(position1 > 0) {
                //                impost.pointIdChange = blocks[b].impost.impostAxis[0].id;
                impost.pointIdChange = 0;
              } else if(position2 > 0) {
                //                impost.pointIdChange = blocks[b].impost.impostAxis[1].id;
                impost.pointIdChange = 1;
              }
              impost.intersect.x = Math.abs(impost.intersect.x);
              impost.intersect.y = Math.abs(impost.intersect.y);

              imposts.push(impost);
            }
          }
        }
      }
      return imposts;
    }


    function findBlockCrossLineArc(currLine, blocksQty, blocks) {
      var impBlockIndex = [];
      for(var b = 0; b < blocksQty; b++) {
        if(blocks[b].level) {
          var pointsQty = blocks[b].pointsOut.length,
              match = 0;
//          console.log('~~~~blocks[b]~~~~~', blocks[b]);
//          console.log('~~~~currLine~~~~~', currLine);
          if(pointsQty) {
            while(--pointsQty > -1) {
//              console.log('~~~~blocks[b].pointsOut[pointsQty]~~~~~', blocks[b].pointsOut[pointsQty]);
              var checkPoint = SVGServ.checkLineOwnPoint(blocks[b].pointsOut[pointsQty], currLine.to, currLine.from);
//              console.log('~~~~checkPoint~~~~~', checkPoint);
              if(checkPoint.x !== Infinity && checkPoint.y !== Infinity) {
                if(checkPoint.x >= 0 && checkPoint.x <= 1 || checkPoint.y >=0 && checkPoint.y <= 1) {
                  match++;
                }
              }
            }
          }
//          console.log('~~~~match~~~~~', match);
          //--- if 2 points of block on currLine so take index of this block
          if(match > 1) {
            impBlockIndex.push(b);
          }
        }
      }
      return impBlockIndex;
    }



    function setQPointImpostArc(arcN, imposts, currLineFrom, currLineTo, coordQ, blocks, blocksSource) {
      var impost = imposts[0];
      if(impost) {
        console.log('impost ``````````````````````', impost.from, impost.to);
        console.log('currLineFrom, coordQ, currLineTo ``````````````````````', currLineFrom, coordQ, currLineTo);
        //------ calc the intersections impost with arc
        var intersect = SVGServ.QLineIntersections(currLineFrom, coordQ, currLineTo, impost.from, impost.to);
              console.log('intersect ``````````````````',intersect);

        if (intersect.length) {
          //------- find current line
          //------ set subPoints Q left / right side of impost
          var impostQP1 = getCoordQPImostArc(intersect[0].t, currLineFrom, coordQ),
              impostQP2 = getCoordQPImostArc(intersect[0].t, coordQ, currLineTo),
              impostQPIn1 = getCoordQPIn(currLineFrom, impostQP1, intersect[0]),
              impostQPIn2 = getCoordQPIn(intersect[0], impostQP2, currLineTo),
              //------- checking place of subPoints Q as to impost
              placeImpostQP1 = SVGServ.setPointLocationToLine(impost.from, impost.to, impostQP1),
              placeImpostQP2 = SVGServ.setPointLocationToLine(impost.from, impost.to, impostQP2),
              //------- set blocks Ids according to left / right side
              blockIds = setBlockLocationToLine(impost.from, impost.to, blocks[impost.indexBlock].children, blocks),
              //----- create Q impost points
              blockID1 = (placeImpostQP1 > 0) ? blockIds.pos : blockIds.neg,
              blockID2 = (placeImpostQP2 > 0) ? blockIds.pos : blockIds.neg;
          console.log('QPssss', impostQP1, impostQP2, impostQPIn1, impostQPIn2);
          console.log('wherePoint +++ ', placeImpostQP1, placeImpostQP2);
          console.log('blockIds +++ ', blockIds);
                  console.log('blockId +++ ', impostQP1, blockID1);
                  console.log('blockId +++ ', impostQP2, blockID2);
          createQPImpostArc(1, arcN, impost.indexBlock, impostQP1, impostQPIn1, blockID1, blocksSource);
          createQPImpostArc(2, arcN, impost.indexBlock, impostQP2, impostQPIn2, blockID2, blocksSource);
          //----- which of the points of impost should be changed
          var pointIdOld = getImpostPointIdXChange(impost, intersect[0]);
          //----- change coordinates of impost point in SourceTEMP
          setNewCoordImpostPoint(intersect[0], pointIdOld, impost.indexBlock, blocksSource);


          //------ go to next impost
          imposts.shift();
          if (imposts.length) {
            setQPointImpostArc(arcN, imposts, currLineFrom, intersect[0], impostQP1, blocks, blocksSource);
            setQPointImpostArc(arcN, imposts, intersect[0], currLineTo, impostQP2, blocks, blocksSource);
          }

        }
      }
    }


    function getCoordQPImostArc(t, p0, p1) {
      var qpi = {
        x: (1-t)*p0.x + t*p1.x,
        y: (1-t)*p0.y + t*p1.y
      };
      return qpi;
    }


    function getCoordQPIn(currLineFrom, impostQP1, coordQ) {
      var line1 = {
            type: 'frame',
            from: currLineFrom,
            to: impostQP1
          },
          line2 = {
            type: 'frame',
            from: impostQP1,
            to: coordQ
          };
      console.log('!!!!!!!!QP impost!!!!!currLineFrom, impostQP1, coordQ=====', currLineFrom, impostQP1, coordQ);
      SVGServ.setLineCoef(line1);
      SVGServ.setLineCoef(line2);
      line1.coefC = SVGServ.getNewCoefC(GlobalStor.global.profileDepths, line1, 'frame');
      line2.coefC = SVGServ.getNewCoefC(GlobalStor.global.profileDepths, line2, 'frame');
      console.log('!!!!!!!!line1!!!!!', line1);
      console.log('!!!!!!!!line2!!!!!', line2);
      var coord = SVGServ.getCoordCrossPoint(line1, line2);
      console.log('!!!!!!!!!!!!!', coord);
      return coord;
    }


    function createQPImpostArc(nP, arcN, ipN, coordQP, coordQPIn, blockIndex, blocks) {
      var pointQ = {
            type:'arc',
            id:'qa'+arcN+'-ip'+ipN+'-'+nP,
            x: coordQP.x,
            y: coordQP.y,
            dir:'curv'
          };
      var pointQIn = angular.copy(pointQ);
      pointQIn.x = coordQPIn.x;
      pointQIn.y = coordQPIn.y;
      //----- insert Q point in pointsOut block
      blocks[blockIndex].pointsOut.push(pointQ);
      //----- insert Q point in pointsIn block
      blocks[blockIndex].pointsIn.push(pointQIn);
    }




    function setBlockLocationToLine(lineP1, lineP2, currBlockId, blocks) {
      var currBlockIdQty = currBlockId.length,
          blocksQty = blocks.length,
          blockIndex = {};
//      console.log('currBlockId ====', currBlockId);
      while(--currBlockIdQty > - 1) {
        for(var i = 0; i <  blocksQty; i++) {
          if(blocks[i].id === currBlockId[currBlockIdQty]) {
            var location = 0,
                pointsOutQty = blocks[i].pointsOut.length;
            while(--pointsOutQty > -1) {
              var placePoint = SVGServ.setPointLocationToLine(lineP1, lineP2, blocks[i].pointsOut[pointsOutQty]);
              console.log('placePoint ====', blocks[i].pointsOut[pointsOutQty]);
              console.log('placePoint ====', lineP1, lineP2);
              console.log('placePoint ====', placePoint);
              if(placePoint > 0) {
                location = 1;
              }
            }
            if(location) {
              blockIndex.pos = i;
            } else {
              blockIndex.neg = i;
            }
          }
        }
      }
      console.log('blockIndex ====', blockIndex);
      return blockIndex;
    }


    function getImpostPointIdXChange(impost, newPoint) {
      var size = Math.round(Math.hypot((impost.to.x - impost.from.x), (impost.to.y - impost.from.y)) * 100) / 100,
      size1 = Math.round(Math.hypot((newPoint.x - impost.from.x), (newPoint.y - impost.from.y)) * 100) / 100;
//      return (size1 > size) ? impost.to.id : impost.from.id;
      return (size1 > size) ? 1 : 0;
    }


    function setNewCoordImpostPoint(coord, pointId, indexBlock, blocks) {
     if(blocks[indexBlock].impost) {
       blocks[indexBlock].impost.impostAxis[pointId].x = coord.x;
       blocks[indexBlock].impost.impostAxis[pointId].y = coord.y;
//       if(blocks[indexBlock].impost.impostAxis[0].id ===  pointId) {
//         blocks[indexBlock].impost.impostAxis[0].x = coord.x;
//         blocks[indexBlock].impost.impostAxis[0].y = coord.y;
//       } else if(blocks[indexBlock].impost.impostAxis[1].id ===  pointId) {
//         blocks[indexBlock].impost.impostAxis[1].x = coord.x;
//         blocks[indexBlock].impost.impostAxis[1].y = coord.y;
//       }
     }
    }






    function deleteArc(arcObj) {
      var defer = $q.defer(),
          arc = arcObj.__data__;

      if(arc.type === 'arc') {
        var arcID = arc.points[1].id,
            blockID = arcObj.attributes.blockId.nodeValue,
            blocksSource = DesignStor.design.templateSourceTEMP.details,
            blocks = DesignStor.design.templateTEMP.details,
            blocksQty = blocks.length;


        //------ return back the point of impost (cross point with frame)
        var currLine = {
          from: arc.points[0],
          to: arc.points[2]
        };
        SVGServ.setLineCoef(currLine);
//        console.log('currLine++++++',currLine);
        //----- imposts which cross current arc
        var imposts = findImpostsCrossLineArc(currLine, blocksQty, blocks);
//        console.log('imposts++++++',imposts);
        //----- change imposts coordinats
        changeCoordImpostPoint(imposts, blocksSource);

        //------- delete Q point IDs in block (pointsID)
        removePoint([arcID], blockID, blocksSource);
        //------- delete Q points IDs in all children blocks
        removePointIdAllBlocks(arcID, blocksSource);

        //------ unshifting
        if(!arc.points[1].x) {
          shiftingAllPoints(0, 1, arc.points[0].x, blocksSource);
        } else if(!arc.points[1].y) {
          shiftingAllPoints(0, 0, arc.points[0].y, blocksSource);
        }

        //------ change templateTEMP
        SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
          DesignStor.design.templateTEMP = angular.copy(result);
          defer.resolve('done');
        });
        return defer.promise;
      }
    }



    function changeCoordImpostPoint(imposts, blocks) {
      var impostsQty = imposts.length;
      while(--impostsQty > -1) {
        if(blocks[imposts[impostsQty].indexBlock].impost) {
          var impAxisQty = blocks[imposts[impostsQty].indexBlock].impost.impostAxis.length;
          while(--impAxisQty > -1) {
//            if(blocks[imposts[impostsQty].indexBlock].impost.impostAxis[impAxisQty].id === imposts[impostsQty].pointIdChange) {
//              blocks[imposts[impostsQty].indexBlock].impost.impostAxis[impAxisQty].x = imposts[impostsQty].intersect.x;
//              blocks[imposts[impostsQty].indexBlock].impost.impostAxis[impAxisQty].y = imposts[impostsQty].intersect.y;
//            }
            blocks[imposts[impostsQty].indexBlock].impost.impostAxis[imposts[impostsQty].pointIdChange].x = imposts[impostsQty].intersect.x;
            blocks[imposts[impostsQty].indexBlock].impost.impostAxis[imposts[impostsQty].pointIdChange].y = imposts[impostsQty].intersect.y;
          }
        }
      }
    }


    function removePointIdAllBlocks(criterion, blocks) {
      var blockQty = blocks.length;
      while (--blockQty > -1) {
        if (blocks[blockQty].level) {
          var outQty = blocks[blockQty].pointsOut.length;
          if (outQty) {
            while (--outQty > -1) {
              if (blocks[blockQty].pointsOut[outQty].id.indexOf(criterion) + 1) {
                blocks[blockQty].pointsOut.splice(outQty, 1);
                break;
              }
            }
          }
          var inQty = blocks[blockQty].pointsIn.length;
          if (inQty) {
            while (--inQty > -1) {
              if (blocks[blockQty].pointsIn[inQty].id.indexOf(criterion) + 1) {
                blocks[blockQty].pointsIn.splice(inQty, 1);
                break;
              }
            }
          }
        }
      }
    }


    function workingWithAllArcs(mark, qty) {
      var currElem = d3.select('#tamlateSVG [item-type='+mark+']');
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
          newImpId = newImpost.attributes.blockId.nodeValue,
          imposts = DesignStor.design.selectedImpost,
          impostsQty = imposts.length;
      while(--impostsQty > -1) {
        //------ existed impost
        if(imposts[impostsQty].attributes.blockId.nodeValue === newImpId) {
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
          blockID = glassObj.attributes.blockId.nodeValue,
          dim = getMaxMinCoord(glass.points),
          blocks = DesignStor.design.templateTEMP.details,
          blocksQty = blocks.length,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          angel, linesOut, blockIndex, blockN, impVector, crossPoints;

//      console.log('+++++',blockID);
//      console.log('+++++',dim);

//      if(glass.square > globalConstants.squareLimit && (dim.maxX - dim.minX) > globalConstants.widthLimit && (dim.maxY - dim.minY) > globalConstants.heightLimint) {
//      if((dim.maxX - dim.minX) > globalConstants.widthLimit && (dim.maxY - dim.minY) > globalConstants.heightLimint) {
//
//      }
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
          angel = 60;
          break;
        //----- inclined left
        case 5:
          angel = 300;
          break;
      }

      //------- find lines as to current block
      for(var b = 0; b < blocksQty; b++) {
        if(blocks[b].id === blockID) {
          linesOut = blocks[b].linesOut;
          blockIndex = b;
        }
      }

      blockN = getLastBlockNumber();
      console.log('IMP center -----------', blocks[blockIndex].center, angel);
      impVector = SVGServ.cteateLineByAngel(blocks[blockIndex].center, angel);
      console.log('impVector$$$$', impVector);
      crossPoints = getImpostCrossPointInBlock(impVector, linesOut);

      console.log('IMP+++crossPoints++',crossPoints);
      var impPointsQty = crossPoints.length;
      if(impPointsQty) {
        while(--impPointsQty > -1) {
          createImpostPoint(crossPoints[impPointsQty], blockIndex, blocksSource);
          createChildBlock(++blockN, blockIndex, blocksSource);
        }
      }
console.log('blocksSource-------------',blocksSource);
      //----- change Template
      rebuildSVGTemplate();
    }




    function getLastBlockNumber() {
      var blocks = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocks.length,
          blockN = 0;
      while(--blocksQty > -1) {
        if(blocks[blocksQty].level) {
          var tempN = Number(blocks[blocksQty].id.replace(/\D+/g, ""));
          if(tempN > blockN) {
            blockN = tempN;
          }
        }
      }
      return blockN;
    }


    function getImpostCrossPointInBlock(vector, lines) {
      var impPoints = [],
          linesQty = lines.length;
//      console.log('lines @@@@@@', lines);
//      console.log('vector @@@@@@', vector);
      for(var l = 0; l < linesQty; l++) {
        var coord, checkPoint, intersect;
//                console.log('line ++++', lines[linesQty]);
        coord = SVGServ.getCoordCrossPoint(vector, lines[l]);
                console.log('coord ++++', coord);
        if(coord.x >= 0 && coord.y >= 0) {

          //------ checking is cross point inner of line
          checkPoint = SVGServ.checkLineOwnPoint(coord, lines[l].to, lines[l].from);
                          console.log('^^^^^checkPoint^^^^', checkPoint);
          if(checkPoint.x >= 0 && checkPoint.x <= 1 || checkPoint.y >= 0 && checkPoint.y <= 1) {


            if(lines[l].dir === 'curv') {
              intersect = SVGServ.getIntersectionInCurve(l, linesQty, lines, vector.center, coord);
              if(intersect.length) {
                coord.x = intersect[0].x;
                coord.y = intersect[0].y;
              }
            }

//            coord.x = Math.abs(Math.round(coord.x));
//            coord.y = Math.abs(Math.round(coord.y));
            coord.fi = SVGServ.getAngelPoint(vector.center, coord);
            impPoints.push(coord);
          }
        }
      }
      return impPoints;
    }




    function createImpostPoint(coord, blockIndex, blocks) {
      var impN = Number(blocks[blockIndex].id.replace(/\D+/g, "")),
        impPoint = {
        type:'impost',
        id:'ip'+impN,
        x: coord.x,
        y: coord.y,
        fi: coord.fi,
        dir:'line'
      };
      //---- insert impostPoint in parent block
      if(!blocks[blockIndex].impost) {
        blocks[blockIndex].impost = {
          impostAxis: [],
          impostIn: []
        };
      }
      blocks[blockIndex].impost.impostAxis.push(impPoint);
    }



    function createChildBlock (blockN, blockIndex, blocks) {
      console.log('blockN ===', blockN);
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



    function deleteImpost(impObj) {
      var blockID = impObj.attributes.blockId.nodeValue,
          blocksSource = DesignStor.design.templateSourceTEMP.details,
          blocksQty = blocksSource.length;

      //----- delete children blocks and impost points
      while(--blocksQty > -1) {
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
      while(--blocksQty > -1) {
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

      changeCoordPointsAsMirror(maxX, blocks, blocksQty);

      for(var b = 0; b < blocksQty; b++) {
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
      for(var b = 0; b < blocksQty; b++) {
        if(blocks[b].level) {
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
        for(var b = 0; b < blocksQty; b++) {
          if(blocks[b].id === blocks[indexBlock].children[0] || blocks[b].id === blocks[indexBlock].children[1]) {
            //----- change children
            changeChildrenIdChildren(b, blocksQty, blocks);
          }
        }
      }

    }








    //=============== CHANGE CONSTRUCTION SIZE ==============//

    //----- click on size SVG and get size value and Id
    function selectSizeBlock() {
      if (!GlobalStor.global.isSizeCalculator) {
        var thisSize = $(this).parent();
        DesignStor.design.startSize = +thisSize.attr('from-point');
        DesignStor.design.finishSize = +thisSize.attr('to-point');
        DesignStor.design.minSizePoint = +thisSize.attr('min-val');
        DesignStor.design.maxSizePoint = +thisSize.attr('max-val');
        DesignStor.design.maxSizeLimit = (DesignStor.design.maxSizePoint - DesignStor.design.startSize);
        if(thisSize.attr('id') === 'overallDimH' || thisSize.attr('id') === 'overallDimV') {
          DesignStor.design.minSizeLimit = DesignStor.design.minSizePoint;
        } else {
          DesignStor.design.minSizeLimit = 200;
        }
        DesignStor.design.tempSizeId = thisSize.attr('id');
        DesignStor.design.tempSizeType = thisSize.attr('size-type');
        DesignStor.design.oldSizeValue = +thisSize.text();
        //--- change color of size block
        /*
         var sizeGroup = $(thisSize.parent());
         //console.log('sizeGroup', sizeGroup);
         thisSize.attr('class', '').attr('class', sizeBoxActClass);
         sizeGroup.find('.size-rect').attr('class', '').attr('class', sizeRectActClass);
         */

        //--- show size calculator if voice helper is turn off
        if (!GlobalStor.global.isVoiceHelper) {
          GlobalStor.global.isSizeCalculator = true;
        } else {
          DesignStor.design.openVoiceHelper = true;
          startRecognition(doneRecognition, recognitionProgress, GlobalStor.global.voiceHelperLanguage);

        }
        $rootScope.$apply();
      }
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
        deactiveSizeBox(sizeRectActClass, sizeBoxActClass);

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
      //console.log(DesignStor.design.tempSizeId);
      $('#' + DesignStor.design.tempSizeId).find('tspan').text(parseInt(newSizeString, 10));
      if(GlobalStor.global.isVoiceHelper) {
        closeSizeCaclulator();
      }
    }




    //------- Close Size Calculator
    function closeSizeCaclulator() {

      if(DesignStor.design.tempSize.length > 0) {
        newLength = parseInt(DesignStor.design.tempSize.join(''), 10);
        //------- Dimensions limits checking
        if (newLength > DesignStor.design.minSizeLimit && newLength < DesignStor.design.maxSizeLimit) {
          DesignStor.design.isMinSizeRestriction = false;
          DesignStor.design.isMaxSizeRestriction = false;

          //---- save last step
          DesignStor.design.designSteps.push(angular.copy(DesignStor.design.templateSourceTEMP));

          //-------- change point coordinates in templateSource
          for (var k = 0; k < DesignStor.design.templateSourceTEMP.objects.length; k++) {
            switch (DesignStor.design.templateSourceTEMP.objects[k].type) {
              case 'fixed_point':
              case 'fixed_point_impost':
                if (DesignStor.design.tempSizeType === 'hor' && +DesignStor.design.templateSourceTEMP.objects[k].x === DesignStor.design.finishSize) {
                  DesignStor.design.templateSourceTEMP.objects[k].x = DesignStor.design.startSize + newLength;
                } else if(DesignStor.design.tempSizeType === 'vert' && +DesignStor.design.templateSourceTEMP.objects[k].y === DesignStor.design.finishSize) {
                  DesignStor.design.templateSourceTEMP.objects[k].y = DesignStor.design.startSize + newLength;
                }

                break;
            }
          }
          //console.log('$scope.templateSourceTEMP !!!!!!=== ', $scope.templateSourceTEMP);


          //------ close size calculator
          GlobalStor.global.isSizeCalculator = false;
          //------- deactive size box in svg
          deactiveSizeBox(sizeRectActClass, sizeBoxActClass);
          //-------- build new template
          SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
            DesignStor.design.templateTEMP = angular.copy(result);
          });
//          DesignStor.design.templateTEMP = new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths);

          DesignStor.design.tempSize.length = 0;
          DesignStor.design.isMinSizeRestriction = false;
          DesignStor.design.isMaxSizeRestriction = false;
        } else {

          //------ show error size
          if(newLength < DesignStor.design.minSizeLimit) {
            if(GlobalStor.global.isVoiceHelper) {
              playTTS($filter('translate')('construction.VOICE_SMALLEST_SIZE'), GlobalStor.global.voiceHelperLanguage);
              //------- deactive size box in svg
              deactiveSizeBox(sizeRectActClass, sizeBoxActClass);
              //-------- build new template
              SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
                DesignStor.design.templateTEMP = angular.copy(result);
              });
//              DesignStor.design.templateTEMP = new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths);
            } else {
              DesignStor.design.isMinSizeRestriction = true;
              DesignStor.design.isMaxSizeRestriction = false;
            }
          } else if(newLength > DesignStor.design.maxSizeLimit) {
            if(GlobalStor.global.isVoiceHelper) {
              playTTS($filter('translate')('construction.VOICE_BIGGEST_SIZE'), GlobalStor.global.voiceHelperLanguage);
              //------- deactive size box in svg
              deactiveSizeBox(sizeRectActClass, sizeBoxActClass);
              //-------- build new template
              SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
                DesignStor.design.templateTEMP = angular.copy(result);
              });
//              DesignStor.design.templateTEMP = new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths);
            } else {
              DesignStor.design.isMinSizeRestriction = false;
              DesignStor.design.isMaxSizeRestriction = true;
            }
          }

        }
      } else {
        /*
         DesignStor.design.minSizeLimit = 200;
         DesignStor.design.maxSizeLimit = 5000;
         */
        //------ close size calculator
        GlobalStor.global.isSizeCalculator = false;
        deactiveSizeBox(sizeRectActClass, sizeBoxActClass);
      }
      DesignStor.design.openVoiceHelper = false;
      DesignStor.design.loudVoice = false;
      DesignStor.design.quietVoice = false;

    }


    //---------- Deactivate Size Box for SVG Construction
    function deactiveSizeBox(sizeRectActClass, sizeBoxActClass) {
      $('g.size-box').each(function () {
        $(this).find('.'+sizeRectActClass).addClass('size-rect').removeClass(sizeRectActClass);
        $(this).find('.'+sizeBoxActClass).addClass('size-value-edit').removeClass(sizeBoxActClass);
      });
    }






    function stepBack() {
      var lastIndex = DesignStor.design.designSteps.length - 1;
      DesignStor.design.templateSourceTEMP = angular.copy(DesignStor.design.designSteps[lastIndex]);
      SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
        DesignStor.design.templateTEMP = angular.copy(result);
      });
//      DesignStor.design.templateTEMP = new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths);
      DesignStor.design.designSteps.pop();
    }



  }
})();
