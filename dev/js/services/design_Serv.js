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
      isExistImpostInSelected: isExistImpostInSelected,
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
          blocks = DesignStor.design.templateSourceTEMP.details.skylights,
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
          blocks = DesignStor.design.templateSourceTEMP.details.skylights,
          blocksQty = blocks.length;

      for(var b = 0; b < blocksQty; b++) {
        if (blocks[b].id === blockID) {
          blocks[b].blockType = 'frame';
          delete blocks[b].openDir;
          delete blocks[b].handlePos;
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
          pointsSource = DesignStor.design.templateSourceTEMP.details.points,
          blocksSource = DesignStor.design.templateSourceTEMP.details.skylights,
          blocks = DesignStor.design.templateTEMP.details.skylights,
          blocksQty = blocks.length,
          b = 0;
      for(; b < blocksQty; b++) {
        if(blocks[b].id === blockID) {
          //---- set simple corner
          if(cornerObj.__data__.view) {
            startCreateCornerPoint(cornerID, cornerN, blocks[b].linesOut, b, blocksSource, pointsSource);

            //----- change curve corner to simple
          } else {
            //---- delete qc point Id in blocks
            removePointId(['qc'+cornerN], blockID, blocksSource);
            //---- delete qc point in points
            removePoint(['qc'+cornerN], pointsSource);
          }

        }
      }
      //----- hide this point
      if(cornerObj.__data__.view) {
        var pointsQty = pointsSource.length;
        for (var i = 0; i < pointsQty; i++) {
          if (pointsSource[i].id === cornerID) {
            pointsSource[i].view = 0;
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
          pointsSource = DesignStor.design.templateSourceTEMP.details.points,
          blocksSource = DesignStor.design.templateSourceTEMP.details.skylights,
          blocks = DesignStor.design.templateTEMP.details.skylights,
          blocksQty = blocks.length,
          b = 0;
//      console.log('cornerID+++', cornerID);
      for(; b < blocksQty; b++) {
        if(blocks[b].id === blockID) {
          //----- set curve corner
          if (cornerObj.__data__.view) {

            startCreateCornerPoint(cornerID, cornerN, blocks[b].linesOut, b, blocksSource, pointsSource);
            createQCPoint(cornerN, cornerObj.__data__, b, blocksSource, pointsSource);

          //----- change simple corner to corve
          } else {

            var linesQty = blocks[b].linesOut.length;
            for (var l = 0; l < linesQty; l++) {
              if (blocks[b].linesOut[l].from.id === 'c'+cornerN+'-2' && blocks[b].linesOut[l].to.id === 'c'+cornerN+'-1' ) {
                var qcPoint = setQPointCoord(cornerN, blocks[b].linesOut[l]);
                createQCPoint(cornerN, qcPoint, b, blocksSource, pointsSource);
              }
            }

          }
        }
      }
      //----- hide this point
      if (cornerObj.__data__.view) {
        for (var i = 0; i < pointsSource.length; i++) {
          if (pointsSource[i].id === cornerID) {
            pointsSource[i].view = 0;
          }
        }
      }

      //----- change Template
      rebuildSVGTemplate();
    }


    function startCreateCornerPoint(cornerID, cornerN, lines, blockIndex, blocks, points) {
      var linesQty = lines.length,
          l = 0;
      for(; l < linesQty; l++) {
        if(lines[l].from.id === cornerID) {
          createCornerPoint(1, cornerN, lines[l], blockIndex, blocks, points);
        } else if(lines[l].to.id === cornerID) {
          createCornerPoint(2, cornerN, lines[l], blockIndex, blocks, points);
        }
      }
    }



    function createCornerPoint(pointN, cornerN, line, blockIndex, blocks, points) {
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

      blocks[blockIndex].pointsID.push(cornerPoint.id);
      points.push(cornerPoint);
    }


    function createQCPoint(cornerN, framePoint, blockIndex, blocks, points) {
      var QCPoint = {
        type:'corner',
        id: 'qc' + cornerN,
        x: framePoint.x,
        y: framePoint.y,
        dir:'curv'
      };
      blocks[blockIndex].pointsID.push(QCPoint.id);
      points.push(QCPoint);
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
      return coordQP;
    }


    function deleteCornerPoints(cornerObj) {
      var cornerID = cornerObj.__data__.id,
          cornerN = Number(cornerID.replace(/\D+/g, "")),
          blockID = cornerObj.attributes.blockId.nodeValue,
          pointsSource = DesignStor.design.templateSourceTEMP.details.points,
          blocksSource = DesignStor.design.templateSourceTEMP.details.skylights,
          pointsQty = pointsSource.length;

      //------- delete corner point IDs in block (pointsID)
      removePointId(['c' + cornerN + '-1', 'c' + cornerN + '-2', 'qc'+cornerN], blockID, blocksSource);

      while (--pointsQty > -1) {
        //----- show this frame point
        if (pointsSource[pointsQty].id === cornerID) {
          pointsSource[pointsQty].view = 1;
        }
      }
      //----- delete corner points
      removePoint(['c' + cornerN + '-1', 'c' + cornerN + '-2', 'qc'+cornerN], pointsSource);

      //----- change Template
      rebuildSVGTemplate();
    }






    function removePointId(criterions, blockId, blocks) {
      var blockQty = blocks.length;
      while(--blockQty > -1) {
        if(blocks[blockQty].id === blockId) {
          var idQty = blocks[blockQty].pointsID.length;
          while(--idQty > -1) {
            var critQty = criterions.length;
            while(--critQty > -1) {
              if(blocks[blockQty].pointsID[idQty] === criterions[critQty]) {
                blocks[blockQty].pointsID.splice(idQty, 1);
                break;
              }
            }
          }
        }
      }
    }


    function removePoint(criterions, points) {
      var pointsQty = points.length;
      while(--pointsQty > -1) {
        var critQty = criterions.length;
        while(--critQty > -1) {
          if(points[pointsQty].id === criterions[critQty]) {
            points.splice(pointsQty, 1);
            break;
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
            blocks = DesignStor.design.templateTEMP.details.skylights,
            blocksQty = blocks.length,
            blocksSource = DesignStor.design.templateSourceTEMP.details.skylights,
            pointsSource = DesignStor.design.templateSourceTEMP.details.points,
            pointsQty = pointsSource.length,
            currBlockIndex, currLine, position, shift;

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

        //------ collect imposts which are crossed with arc line
        var imposts = findImpostsCrossLine(currLine, blocksQty, blocks);
        console.log('imposts++++++++=', imposts);
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
          shift = coordQ.y;
          for(var j = 0; j < pointsQty; j++) {
            pointsSource[j].y += shift;
          }
          coordQ.y = 0;
        } else if(position === 4) {
          shift = coordQ.x;
          for(var j = 0; j < pointsQty; j++) {
            pointsSource[j].x += shift;
          }
          coordQ.x = 0;
        }
        //------- rebuild linesOut after shifting of points
        if(shift) {
          currLine = rebuildLinesOut(arc.points, currBlockIndex, blocksSource, pointsSource);
        }
        createArcPoint(arcN, coordQ, currBlockIndex, blocksSource, pointsSource);

        //------ create Q points (left/right) of crossing impost with arc and new point of impost
        var impostsQty = imposts.length;
        if(impostsQty) {
          //---- sorting imposts
          imposts.sort(function(a,b) {
            return a.indexBlock - b.indexBlock;
          });
//          console.log('impostsSort!!!!!!!!!!!', JSON.stringify(imposts));
          setQPointImpostArc(arcN, imposts, currLine.from, currLine.to, coordQ, blocks, blocksSource, pointsSource);
        }

        //------ change templateTEMP
        SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
          DesignStor.design.templateTEMP = angular.copy(result);
          defer.resolve('done');
        });
        return defer.promise;
      }
    }



    function findImpostsCrossLine(currLine, blocksQty, blocks) {
      var imposts = [];
      for(var b = 0; b < blocksQty; b++) {
        if(blocks[b].level && blocks[b].impost) {
          var impost = {
            indexBlock: b,
            from: blocks[b].impost.impostAxis[0],
            to: blocks[b].impost.impostAxis[1]
          };
          SVGServ.setLineCoef(impost);
//          console.log('currLine', currLine);
          impost.intersect = SVGServ.getCoordCrossPoint(currLine, impost);
//          console.log('impost.intersect', impost.intersect);
          if(impost.intersect.x >= 0 && impost.intersect.y >= 0) {

            //------ checking is cross point inner of line
            var checkPoint = SVGServ.checkLineOwnPoint(impost.intersect, impost.to, impost.from);
//            console.log('checkPoint', checkPoint);
            if (checkPoint.x >= 0 && checkPoint.x <= 1 || checkPoint.y >= 0 && checkPoint.y <= 1) {
//              console.log('currLine.from++++', currLine.from);
//              console.log(' currLine.to+++++',  currLine.to);
//              console.log('impostAxis0 +++', blocks[b].impost.impostAxis[0]);
//              console.log('impostAxis1++++', blocks[b].impost.impostAxis[1]);
              var position1 = SVGServ.setPointLocationToLine(currLine.from, currLine.to, blocks[b].impost.impostAxis[0]),
                  position2 = SVGServ.setPointLocationToLine(currLine.from, currLine.to, blocks[b].impost.impostAxis[1]);
//              console.log('position++++++++=',position1, position2);
              if(position1 > 0) {
                impost.pointIdChange = blocks[b].impost.impostAxis[0].id;
              } else if(position2 > 0) {
                impost.pointIdChange = blocks[b].impost.impostAxis[1].id;
              }
              imposts.push(impost);
            }
          }
        }
      }
      return imposts;
    }


    function rebuildLinesOut(arc, blockIndex, blocks, points) {
      var currLine,
          pointsOut = SVGServ.setPointsOut(blocks[blockIndex].pointsID, points),
          center = SVGServ.centerBlock(pointsOut);
      pointsOut = SVGServ.sortingPoints(pointsOut, center);
      var linesOut = SVGServ.setLines(pointsOut);
      var linesQty = linesOut.length;
      while(--linesQty > -1) {
        if(linesOut[linesQty].from.id === arc[0].id && linesOut[linesQty].to.id === arc[1].id) {
          currLine = linesOut[linesQty];
        }
      }
      return currLine;
    }


    function createArcPoint(arcN, coordQP, blockIndex, blocks, points) {
      var pointQ = {
        type:'arc',
        id:'qa'+arcN,
        x: coordQP.x,
        y: coordQP.y,
        dir:'curv'
      };

      //---- insert pointQ in all relative blocks
      blocks[blockIndex].pointsID.push(pointQ.id);
      points.push(pointQ);
    }






    function setQPointImpostArc(arcN, imposts, currLineFrom, currLineTo, coordQ, blocks, blocksSource, points) {
      var impost = imposts[0];
      if(impost) {
        console.log('impost ------', impost);

        //------ calc the intersections impost with arc
        var intersect = SVGServ.QLineIntersections(currLineFrom, coordQ, currLineTo, impost.from, impost.to);
        //      console.log('intersect ------',intersect);

        if (intersect.length) {

          //------- find current line

          //------ set subPoints Q left / right side of impost
          var impostQP1 = getCoordQPImostArc(intersect[0].t, currLineFrom, coordQ), impostQP2 = getCoordQPImostArc(intersect[0].t, currLineTo, coordQ);
          console.log('QPssss', impostQP1, impostQP2);

          //------- checking place of subPoints Q as to impost
          var placeImpostQP1 = SVGServ.setPointLocationToLine(impost.from, impost.to, impostQP1);
          var placeImpostQP2 = SVGServ.setPointLocationToLine(impost.from, impost.to, impostQP2);
          //        console.log('wherePoint +++ ', placeImpostQP1, placeImpostQP2);

          //------- set blocks Ids according to left / right side
          var blockIds = setBlockLocationToLine(impost.from, impost.to, blocks[impost.indexBlock].children, blocks);

          //----- create Q impost points
          var blockID1 = (placeImpostQP1 > 0) ? blockIds.pos : blockIds.neg, blockID2 = (placeImpostQP2 > 0) ? blockIds.pos : blockIds.neg;

          //        console.log('blockId +++ ', impostQP1, blockID1);
          //        console.log('blockId +++ ', impostQP2, blockID2);
          createQPImpostArc(1, arcN, impost.indexBlock, impostQP1, blockID1, blocksSource, points);
          createQPImpostArc(2, arcN, impost.indexBlock, impostQP2, blockID2, blocksSource, points);
          //----- which of the points of impost should be changed
          var pointIdOld = getImpostPointIdXChange(impost, intersect[0]);
          //----- change coordinates of impost point in SourceTEMP
          setNewCoordImpostPoint(intersect[0], pointIdOld, points);


          //------ go to next impost
          imposts.shift();
          if (imposts.length) {
            setQPointImpostArc(arcN, imposts, currLineFrom, intersect[0], impostQP1, blocks, blocksSource, points);
            setQPointImpostArc(arcN, imposts, currLineTo, intersect[0], impostQP2, blocks, blocksSource, points);
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


    function createQPImpostArc(nP, arcN, ipN, coordQP, blockIndex, blocks, points) {
      var pointQ = {
            type:'arc',
            id:'qa'+arcN+'-ip'+ipN+'-'+nP,
            x: coordQP.x,
            y: coordQP.y,
            dir:'curv'
          };
      points.push(pointQ);

      //----- insert Q point id in blocks
      blocks[blockIndex].pointsID.push(pointQ.id);
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
//              console.log('placePoint ====', blocks[i].pointsOut[pointsOutQty]);
//              console.log('placePoint ====', placePoint);
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
      return blockIndex;
    }


    function getImpostPointIdXChange(impost, newPoint) {
      var size = Math.round(Math.hypot((impost.to.x - impost.from.x), (impost.to.y - impost.from.y)) * 100) / 100,
      size1 = Math.round(Math.hypot((newPoint.x - impost.from.x), (newPoint.y - impost.from.y)) * 100) / 100;
      return (size1 > size) ? impost.to.id : impost.from.id;
    }


    function setNewCoordImpostPoint(coord, pointId, points) {
      var pointsQty = points.length;
      while(--pointsQty > -1) {
        if(points[pointsQty].id === pointId) {
          points[pointsQty].x = coord.x;
          points[pointsQty].y = coord.y;
        }
      }
    }






    function deleteArc(arcObj) {
      var defer = $q.defer(),
          arc = arcObj.__data__;

      if(arc.type === 'arc') {
        var arcID = arc.points[1].id,
            blockID = arcObj.attributes.blockId.nodeValue,
            pointsSource = DesignStor.design.templateSourceTEMP.details.points,
            pointsQty = pointsSource.length,
            blocksSource = DesignStor.design.templateSourceTEMP.details.skylights,
            blocks = DesignStor.design.templateTEMP.details.skylights,
            blocksQty = blocks.length,
            shiftX = 0, shiftY = 0;


        //------ return back the point of impost (cross point with frame)
        var currLine = {
          from: arc.points[0],
          to: arc.points[2]
        };
        SVGServ.setLineCoef(currLine);
//        console.log('currLine++++++',currLine);
        //----- imposts which cross current arc
        var imposts = findImpostsCrossLine(currLine, blocksQty, blocks);
//        console.log('imposts++++++',imposts);
        //----- change imposts coordinats
        changeCoordImpostPoint(imposts, pointsSource);

        //------ shifting
        if(!arc.points[1].x) {
          shiftX = arc.points[0].x;
        } else if(!arc.points[1].y) {
          shiftY = arc.points[0].y;
        }
        //----- delete corner points
        while(--pointsQty > -1) {
          if(pointsSource[pointsQty].id.indexOf(arcID)+1) {
            pointsSource.splice(pointsQty, 1);
          } else {
            pointsSource[pointsQty].x -= shiftX;
            pointsSource[pointsQty].y -= shiftY;
          }
        }
        //------- delete Q point IDs in block (pointsID)
        removePointId([arcID], blockID, blocksSource);
        //------- delete Q points IDs in all children blocks
        removePointIdAllBlocks(arcID, blocksSource);
        //------ change templateTEMP
        SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths).then(function(result) {
          DesignStor.design.templateTEMP = angular.copy(result);
          defer.resolve('done');
        });
        return defer.promise;
      }
    }



    function changeCoordImpostPoint(imposts, points) {
      var impostsQty = imposts.length;
      if(impostsQty) {
        while(--impostsQty > -1) {
          var pointsQty = points.length;
          while(--pointsQty > -1) {
            if(points[pointsQty].id === imposts[impostsQty].pointIdChange) {
              points[pointsQty].x = imposts[impostsQty].intersect.x;
              points[pointsQty].y = imposts[impostsQty].intersect.y;
            }
          }
        }
      }
    }



    function removePointIdAllBlocks(criterion, blocks) {
      var blockQty = blocks.length;
      while(--blockQty > -1) {
        if(blocks[blockQty].level) {
          var idQty = blocks[blockQty].pointsID.length;
          if(idQty) {
            while(--idQty > -1) {
              if(blocks[blockQty].pointsID[idQty].indexOf(criterion)+1) {
                blocks[blockQty].pointsID.splice(idQty, 1);
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
          centerGeom = {
            x: (dim.minX + dim.maxX)/2,
            y: (dim.minY + dim.maxY)/2
          },
          blocks = DesignStor.design.templateTEMP.details.skylights,
          blocksQty = blocks.length,
          blocksSource = DesignStor.design.templateSourceTEMP.details.skylights,
          pointsSource = DesignStor.design.templateSourceTEMP.details.points,
          pointsQty = pointsSource.length,
          angel, linesOut, blockIndex, impN, blockN, impVector, crossPoints;

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
          angel = 120;
          break;
      }

      //------- find lines as to current block
      for(var b = 0; b < blocksQty; b++) {
        if(blocks[b].id === blockID) {
          linesOut = blocks[b].linesOut;
          blockIndex = b;
        }
      }

      impN = getLastPointNumber(pointsQty, pointsSource);
      blockN = getLastBlockNumber();
//console.log('$$$$', centerGeom, angel);
      impVector = SVGServ.cteateLineByAngel(centerGeom, angel);
      crossPoints = getImpostCrossPointInBlock(impVector, linesOut);

//      console.log('+++crossPoints++',crossPoints);
      var impPointsQty = crossPoints.length;
      if(impPointsQty) {
        while(--impPointsQty > -1) {
          createImpostPoint(++impN, crossPoints[impPointsQty], blockIndex, blocksSource, pointsSource);
          createChildBlock(++blockN, blockIndex, blocksSource);
        }
      }

      //----- change Template
      rebuildSVGTemplate();
    }



    function getLastPointNumber(pointsQty, pointsSource) {
      var impN = 0;
      while(--pointsQty > -1) {
        if(pointsSource[pointsQty].type === 'impost' && pointsSource[pointsQty].dir === 'line') {
          var tempN = Number(pointsSource[pointsQty].id.replace(/\D+/g, ""));
          if(tempN > impN) {
            impN = tempN;
          }
        }
      }
      return impN;
    }


    function getLastBlockNumber() {
      var blocks = DesignStor.design.templateSourceTEMP.details.skylights,
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
      while(--linesQty > -1) {
        var coord, checkPoint, intersect;
//                console.log('line ++++', lines[linesQty]);
        coord = SVGServ.getCoordCrossPoint(vector, lines[linesQty]);
//                console.log('coord ++++', coord);
        if(coord.x >= 0 && coord.y >= 0) {

          //------ checking is cross point inner of line
          checkPoint = SVGServ.checkLineOwnPoint(coord, lines[linesQty].to, lines[linesQty].from);
//                          console.log('^^^^^checkPoint^^^^', checkPoint);
          if(checkPoint.x >= 0 && checkPoint.x <= 1 || checkPoint.y >=0 && checkPoint.y <= 1) {


            if(lines[linesQty].dir === 'curv') {
              intersect = SVGServ.getIntersectionInCurve(linesQty, linesQty, lines, vector, coord);
              if(intersect.length) {
                coord.x = intersect[0].x;
                coord.y = intersect[0].y;
              }
            }

            coord.x = Math.abs(Math.round(coord.x));
            coord.y = Math.abs(Math.round(coord.y));
            coord.fi = SVGServ.getAngelPoint(vector.center, coord);
            impPoints.push(coord);
          }
        }
      }
      return impPoints;
    }




    function createImpostPoint(ipN, coord, blockIndex, blocks, points) {
      var impPoint = {
        type:'impost',
        id:'ip'+ipN,
        x: coord.x,
        y: coord.y,
        fi: coord.fi,
        dir:'line'
      };
      //---- insert impostPoint in parent block
      if(!blocks[blockIndex].hasOwnProperty('impost')) {
        blocks[blockIndex].impost = {
          impostID: [],
          impostAxis: [],
          impostIn: []
        };
      }
      blocks[blockIndex].impost.impostID.push(impPoint.id);
      points.push(impPoint);
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
        pointsID: [],
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
          pointsSource = DesignStor.design.templateSourceTEMP.details.points,
          blocksSource = DesignStor.design.templateSourceTEMP.details.skylights,
          blocksQty = blocksSource.length;

      //----- delete children blocks and impost points
      while(--blocksQty > -1) {
        if(blocksSource[blocksQty].id === blockID) {
          removeAllChildrenBlock(blocksSource[blocksQty].children[0], blocksSource, pointsSource);
          removeAllChildrenBlock(blocksSource[blocksQty].children[1], blocksSource, pointsSource);
          blocksSource[blocksQty].children.length = 0;
          removePoint([blocksSource[blocksQty].impost.impostID[0], blocksSource[blocksQty].impost.impostID[1]], pointsSource);
          delete blocksSource[blocksQty].impost;
          break;
        }
      }

      //----- change Template
      rebuildSVGTemplate();
    }


    function removeAllChildrenBlock(blockID, blocks, points) {
      var blocksQty = blocks.length;
      while(--blocksQty > -1) {
        if(blocks[blocksQty].id === blockID) {
          var childQty = blocks[blocksQty].children.length;
          if(childQty) {
            removeAllChildrenBlock(blocks[blocksQty].children[0], blocks, points);
            removeAllChildrenBlock(blocks[blocksQty].children[1], blocks, points);
            removePoint([blocks[blocksQty].impost.impostID[0], blocks[blocksQty].impost.impostID[1]], points);
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
      var blocks = DesignStor.design.templateSourceTEMP.details.skylights,
          blocksQty = blocks.length,
          points = DesignStor.design.templateSourceTEMP.details.points,
          maxX = d3.max(points, function(d) { return d.x; }),
          pointsQty = points.length;

      //---- sorting points
      points.sort(function(a,b) {
        return b.x - a.x;
      });

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

      for(var b = 0; b < blocksQty; b++) {
        if(blocks[b].level === 1) {
          var childQty = blocks[b].children.length;
          if(childQty) {
            for(var c = 0; c < blocksQty; c++) {
              if(blocks[c].id === blocks[b].children[0]) {
                var firstChild = angular.copy(blocks[c]);
                for(var i = 0; i < blocksQty; i++) {
                  if(blocks[i].id === blocks[b].children[1]) {
                    //---- insert in first
                    blocks[c] = angular.copy(blocks[i]);
                    blocks[c].id = firstChild.id;
                    //---- insert in second
                    firstChild.id = blocks[i].id;
                    blocks[i] = angular.copy(firstChild);
                    //----- change parent Id of children
                    changeParentIdChildren(blocks[c], blocksQty, blocks);
                    changeParentIdChildren(blocks[i], blocksQty, blocks);
                    break;
                  }
                }
                break;
              }
            }
          }
        }
      }
      rebuildSVGTemplate();
      $timeout(function() {
        DesignStor.design.activeMenuItem = 0;
      }, 500);
    }

    function changeParentIdChildren(curBlock, blocksQty, blocks) {
      if(curBlock.children.length) {
        for(var j = 0; j < curBlock.children.length; j++) {
          for(var b = 0; b < blocksQty; b++) {
            if(blocks[b].id === curBlock.children[j]) {
              blocks[b].parent = curBlock.id;
            }
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
