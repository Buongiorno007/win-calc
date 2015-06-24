(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('DesignModule')
    .factory('DesignServ', designFactory);

  function designFactory($rootScope, $location, $timeout, $filter, $cordovaProgress, GeneralServ, MainServ, optionsServ, GlobalStor, DesignStor, ProductStor) {

    var thisFactory = this,
        sizeRectActClass = 'size-rect-active',
        sizeBoxActClass = 'size-value-active',
        newLength;

    thisFactory.publicObj = {
      setDefaultTemplate: setDefaultTemplate,
      designSaved: designSaved,
      designCancel: designCancel,
      setDefaultConstruction: setDefaultConstruction,

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
        ProductStor.product.templateIcon = new TemplateIcon(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths);

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
      GlobalStor.global.templates[templateIndex] = angular.copy(newTemplate);
      GlobalStor.global.templatesIcon[templateIndex] = angular.copy(newTemplateIcon);
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



    //++++++++++ Edit Sash +++++++++//

    function createSash(type, glassObj) {
      var glass = glassObj.__data__,
          blockID = glassObj.attributes.blockId.nodeValue,
          blocks = DesignStor.design.templateSourceTEMP.details.skylights,
          blocksQty = blocks.length,
//          squareLimit = 0.2,
          widthLimit = 200,
          heightLimint = 200,
          dim = getMaxMinCoord(glass.points);
//      if(glass.square > squareLimit && (dim.maxX - dim.minX) > widthLimit && (dim.maxY - dim.minY) > heightLimint) {
      if((dim.maxX - dim.minX) > widthLimit && (dim.maxY - dim.minY) > heightLimint) {
        for (var b = 0; b < blocksQty; b++) {
          if (blocks[b].id === blockID) {
            blocks[b].blockType = 'sash';

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
            DesignStor.design.templateTEMP = angular.copy(new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths));
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

      DesignStor.design.templateTEMP = angular.copy(new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths));
    }





    //++++++++++ Edit Corners ++++++++//

    function setCornerPoints(cornerObj) {
      var cornerID = cornerObj.__data__.id,
          cornerN = Number(cornerID.replace(/\D+/g, "")),
          blockID = cornerObj.attributes.blockId.nodeValue,
          points = DesignStor.design.templateTEMP.details.points,
          blocks = DesignStor.design.templateTEMP.details.skylights,
          blocksQty = blocks.length,
          b = 0;

      for(; b < blocksQty; b++) {
        if(blocks[b].id === blockID) {
          //---- set simple corner
          if(cornerObj.__data__.view) {
            startCreateCornerPoint(cornerID, cornerN, blocks[b].linesOut, blocks, points);

            //----- change curve corner to simple
          } else {
            //---- delete qc point Id in blocks
            removePointId(['qc'+cornerN], blocks);
            //---- delete qc point in points
            removePoint(['qc'+cornerN], points);
          }

        }
      }
      //----- hide this point
      if(cornerObj.__data__.view) {
        var pointsQty = points.length;
        for (var i = 0; i < pointsQty; i++) {
          if (points[i].id === cornerID) {
            points[i].view = 0;
          }
        }
      }
      //------ change templateSource
      changeTemplate();

    }



    function setCurvCornerPoints(cornerObj) {
      var cornerID = cornerObj.__data__.id,
          cornerN = Number(cornerID.replace(/\D+/g, "")),
          blockID = cornerObj.attributes.blockId.nodeValue,
          points = DesignStor.design.templateTEMP.details.points,
          blocks = DesignStor.design.templateTEMP.details.skylights,
          blocksQty = blocks.length,
          b = 0;

      for(; b < blocksQty; b++) {
        if(blocks[b].id === blockID) {
          //----- set curve corner
          if (cornerObj.__data__.view) {

            startCreateCornerPoint(cornerID, cornerN, blocks[b].linesOut, blocks, points);
            createQCPoint(cornerN, cornerObj.__data__, blocks, points);

          //----- change simple corner to corve
          } else {

            var linesQty = blocks[b].linesOut.length;
            for(var l = 0; l < linesQty; l++) {
              if(blocks[b].linesOut[l].from.id === 'c'+cornerN+'-2' && blocks[b].linesOut[l].to.id === 'c'+cornerN+'-1' ) {
                var qcPoint = setQPointCoord(cornerN, blocks[b].linesOut[l]);
                createQCPoint(cornerN, qcPoint, blocks, points);
              }
            }

          }
        }
      }
      //----- hide this point
      if (cornerObj.__data__.view) {
        for (var i = 0; i < points.length; i++) {
          if (points[i].id === cornerID) {
            points[i].view = 0;
          }
        }
      }
      //------ change templateSource
      changeTemplate();
    }





    function changeTemplate() {
      DesignStor.design.templateSourceTEMP.details.points = angular.copy(DesignStor.design.templateTEMP.details.points);
      for(var i = 0; i < DesignStor.design.templateSourceTEMP.details.skylights.length; i++) {
        if(DesignStor.design.templateSourceTEMP.details.skylights[i].level > 0) {
          DesignStor.design.templateSourceTEMP.details.skylights[i].pointsID = angular.copy(DesignStor.design.templateTEMP.details.skylights[i].pointsID);
        }
      }
      DesignStor.design.templateTEMP = angular.copy(new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths));
    }




    function deleteCornerPoints(cornerObj) {
      var cornerID = cornerObj.__data__.id,
          cornerN = Number(cornerID.replace(/\D+/g, "")),
          points = DesignStor.design.templateSourceTEMP.details.points,
          blocks = DesignStor.design.templateSourceTEMP.details.skylights,
          pointsQty = points.length;

      //------- delete corner point IDs in block (pointsID)
      removePointId(['c' + cornerN + '-1', 'c' + cornerN + '-2', 'qc'+cornerN], blocks);

      while (--pointsQty > -1) {
        //----- show this frame point
        if (points[pointsQty].id === cornerID) {
          points[pointsQty].view = 1;
        }
      }
      //----- delete corner points
      removePoint(['c' + cornerN + '-1', 'c' + cornerN + '-2', 'qc'+cornerN], points);
      DesignStor.design.templateTEMP = angular.copy(new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths));
    }



    function startCreateCornerPoint(cornerID, cornerN, lines, blocks, points) {
      var linesQty = lines.length,
          l = 0;
      for(; l < linesQty; l++) {
        if(lines[l].from.id === cornerID) {
          createCornerPoint(1, cornerN, lines[l], blocks, points);
        } else if(lines[l].to.id === cornerID) {
          createCornerPoint(2, cornerN, lines[l], blocks, points);
        }
      }
    }


    function createCornerPoint(pointN, cornerN, line, blocks, points) {
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

      addPointId(cornerPoint.id, 'fp'+cornerN, blocks);
      points.push(cornerPoint);
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




    function createQCPoint(cornerN, framePoint, blocks, points) {
      var QCPoint = {
        type:'corner',
        id: 'qc' + cornerN,
        x: framePoint.x,
        y: framePoint.y,
        dir:'curv'
      };
      addPointId(QCPoint.id, 'fp'+cornerN, blocks);
      points.push(QCPoint);
    }


    function addPointId(newId, criterion, blocks) {
      var blockQty = blocks.length;
      while(--blockQty > -1) {
        if(blocks[blockQty].level > 0) {
          var idQty = blocks[blockQty].pointsID.length;
          while(--idQty > -1) {
            if(blocks[blockQty].pointsID[idQty] === criterion) {
              blocks[blockQty].pointsID.push(newId);
            }
          }
        }
      }
    }


    function removePointId(criterions, blocks) {
      var blockQty = blocks.length;
      while(--blockQty > -1) {
        if(blocks[blockQty].level > 0) {
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
      var arc = arcObj.__data__;

      if(arc.type === 'frame') {
        var arcN = Number(arc.points[0].id.replace(/\D+/g, "")),
            blockID = arcObj.attributes.blockId.nodeValue,
            blocks = DesignStor.design.templateTEMP.details.skylights,
            blocksQty = blocks.length,
            points = DesignStor.design.templateSourceTEMP.details.points,
            pointsQty = points.length,
            currBlockID = [], currLine;

        //------- find line and block Ids to insert Q point
        for(var b = 0; b < blocksQty; b++) {
          if(blocks[b].level) {
            var linesQty = blocks[b].linesOut.length;
            while(--linesQty > -1) {
              if(blocks[b].linesOut[linesQty].from.id === arc.points[0].id && blocks[b].linesOut[linesQty].to.id === arc.points[1].id) {
                currBlockID.push(b);
                if(blocks[b].id === blockID) {
                  currLine = blocks[b].linesOut[linesQty];
                }
              }
            }
          }
        }
        //------ up
        if(arc.points[0].fi < 180 && arc.points[1].fi < 180) {
          var coordQ = setQPointCoord(1, currLine),
              shift = coordQ.y;
          //          console.log('coordQ = ', coordQ);
          for(var j = 0; j < pointsQty; j++) {
            points[j].y += shift;
          }
          coordQ.y = 0;
          createArcPoint(arcN, coordQ, currBlockID);

          //------ right
        } else if(arc.points[0].fi < 90 && arc.points[1].fi > 270) {
          var coordQ = setQPointCoord(2, currLine);
          //          console.log('coordQ = ', coordQ);
          createArcPoint(arcN, coordQ, currBlockID);

          //------ down
        } else if(arc.points[0].fi > 180 && arc.points[1].fi > 180) {
          var coordQ = setQPointCoord(3, currLine);
          //          console.log('coordQ = ', coordQ);
          createArcPoint(arcN, coordQ, currBlockID);
          //------ left
        } else if(arc.points[0].fi < 270 && arc.points[1].fi > 90) {
          var coordQ = setQPointCoord(4, currLine),
              shift = coordQ.x;
          //          console.log('coordQ = ', coordQ);
          for(var j = 0; j < pointsQty; j++) {
            points[j].x += shift;
          }
          coordQ.x = 0;
          createArcPoint(arcN, coordQ, currBlockID);
        }

        //------ check imposts
        //------ check crossing currLine with all imposts
        for(var b = 0; b < blocksQty; b++) {
          if(blocks[b].level && blocks[b].impost) {
            console.log('%%%%currLine ==== ', currLine);
            getCPImpostArc(blocks[b].impost, currLine, coordQ);
          }
        }

        DesignStor.design.templateTEMP = angular.copy(new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths));

      }
    }



    function createArcPoint(arcN, coordQP, blockID) {
      var pointQ = {
        type:'arc',
        id:'q'+arcN,
        x: coordQP.x,
        y: coordQP.y,
        dir:'curv'
      },
      blockIdQty = blockID.length;

      //---- insert pointQ in all relative blocks
      if(blockIdQty) {
        while(--blockIdQty > -1) {
          DesignStor.design.templateSourceTEMP.details.skylights[blockID[blockIdQty]].pointsID.push(pointQ.id);
        }
      }
      DesignStor.design.templateSourceTEMP.details.points.push(pointQ);
    }



    function getCPImpostArc(impost, currLine, coordQ) {
//      console.log('$$$impost$$$', impost);
//      console.log('currLine', currLine);
//      console.log('coordQ', coordQ);


      // calc the intersections impost with arc
      var points = QLineIntersections(currLine.from, coordQ, currLine.to, impost.impostAxis[0], impost.impostAxis[1]);
//      console.log('points ------',points);

      //----- which of the points of impost should be changed
      if(points.length) {
        var pointIdOld = getImpostPointIdXChange(impost.impostAxis, points[0]);
        setNewImpostPoint(points[0], pointIdOld);
      }

    }



    function getImpostPointIdXChange(impost, newPoint) {
      var size = Math.round(Math.hypot((impost[1].x - impost[0].x), (impost[1].y - impost[0].y)) * 100) / 100,
      size1 = Math.round(Math.hypot((newPoint.x - impost[0].x), (newPoint.y - impost[0].y)) * 100) / 100,
      size2 = Math.round(Math.hypot((newPoint.x - impost[1].x), (newPoint.y - impost[1].y)) * 100) / 100;

      if(size1 > size) {
        return impost[1].id;
      } else if(size2 > size) {
        return impost[0].id;
      }
    }


    function setNewImpostPoint(coord, pointId) {
      var points = DesignStor.design.templateSourceTEMP.details.points,
          pointsQty = points.length;
      while(--pointsQty > -1) {
        if(points[pointsQty].id === pointId) {
          points[pointsQty].x = coord.x;
          points[pointsQty].y = coord.y;
        }
      }
    }


    function deleteArc(arcObj) {
      var arc = arcObj.__data__;

      if(arc.type === 'arc') {
        var arcID = arc.points[1].id,
            points = DesignStor.design.templateSourceTEMP.details.points,
            blocks = DesignStor.design.templateSourceTEMP.details.skylights,
            pointsQty = points.length,
            shiftX = 0, shiftY = 0;

        //------- delete Q point IDs in block (pointsID)
        removePointId([arcID], blocks);

        //------ shifting
        if(!arc.points[1].x) {
          shiftX = arc.points[0].x;
        } else if(!arc.points[1].y) {
          shiftY = arc.points[0].y;
        }
        //----- delete corner points
        while(--pointsQty > -1) {
          if(points[pointsQty].id === arcID) {
            points.splice(pointsQty, 1);
          } else {
            points[pointsQty].x -= shiftX;
            points[pointsQty].y -= shiftY;
          }
        }

        DesignStor.design.templateTEMP = angular.copy(new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths));
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
          DesignStor.design.templateTEMP = new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths);

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
              DesignStor.design.templateTEMP = new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths);
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
              DesignStor.design.templateTEMP = new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths);
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
      DesignStor.design.templateTEMP = new Template(DesignStor.design.templateSourceTEMP, GlobalStor.global.profileDepths);
      DesignStor.design.designSteps.pop();
    }



  }
})();
