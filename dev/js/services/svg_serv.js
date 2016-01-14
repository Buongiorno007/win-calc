(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('SVGServ', designFactory);

  function designFactory($q, globalConstants, GeneralServ, ProductStor, DesignStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      createSVGTemplate: createSVGTemplate,
      createSVGTemplateIcon: createSVGTemplateIcon,
      collectAllPointsOut: collectAllPointsOut,
      setTemplateScale: setTemplateScale,
      setTemplatePosition: setTemplatePosition,

      centerBlock: centerBlock,
      sortingPoints: sortingPoints,
      getAngelPoint: getAngelPoint,
      setLines: setLines,
      setLineCoef: setLineCoef,
      getNewCoefC: getNewCoefC,
      setPointLocationToLine: setPointLocationToLine,
      intersectionQ: intersectionQ,
      cteateLineByAngel: cteateLineByAngel,
      getIntersectionInCurve: getIntersectionInCurve,
      getCoordCrossPoint: getCoordCrossPoint,
      checkLineOwnPoint: checkLineOwnPoint,
      isInsidePointInLine: isInsidePointInLine,
      getCoordSideQPCurve: getCoordSideQPCurve,
      checkEqualPoints: checkEqualPoints,
      setQPointCoord: setQPointCoord,
      getCenterLine: getCenterLine,

      checkInsidePointInLineEasy: checkInsidePointInLineEasy,
      sortByX: sortByX
    };

    return thisFactory.publicObj;




    //============ methods ================//


    function createSVGTemplate(sourceObj, depths) {
      //console.log('------------------------------------------------------');
//      console.log('svg start', new Date(), new Date().getMilliseconds());
      var thisObj = {},
          defer = $q.defer();
      //  thisObj.name = sourceObj.name;
      thisObj.details = angular.copy(sourceObj.details);
      thisObj.priceElements = {
        framesSize: [],
        frameSillSize: [],
        sashsSize: [],
        impostsSize: [],
        shtulpsSize: [],
        glassSquares: [],
        beadsSize: [],
        sashesBlock: []
      };

      var blocksQty = thisObj.details.length;


      for(var i = 0; i < blocksQty; i++) {

        //------ block 0
        if(!thisObj.details[i].level) {

          var childQty = thisObj.details[i].children.length,
              b = 0;
          if(childQty === 1) {
            for(; b < blocksQty; b++) {
              if(thisObj.details[i].children[0] === thisObj.details[b].id) {
                thisObj.details[b].position = 'single';
              }
            }
          } else if(childQty > 1) {
            for(; b < blocksQty; b++) {
              if(thisObj.details[i].children[0] === thisObj.details[b].id) {
                thisObj.details[b].position = 'first';
              } else if(thisObj.details[i].children[childQty-1] === thisObj.details[b].id) {
                thisObj.details[b].position = 'last';
              }
            }
          }

          thisObj.details[i].overallDim = [];

        } else {
//          console.log('+++++++++ block ID ++++++++++', thisObj.details[i].id);
//          console.log('+++++++++ block ++++++++++', thisObj.details[i]);
          //----- create point Q for arc or curve corner in block 1
          if(thisObj.details[i].level === 1 && thisObj.details[i].pointsQ) {
            setQPInMainBlock(thisObj.details[i]);
          }
          thisObj.details[i].center = centerBlock(thisObj.details[i].pointsOut);
          thisObj.details[i].pointsOut = sortingPoints(thisObj.details[i].pointsOut, thisObj.details[i].center);
//          console.log('+++++++++ block ++++++++++pointsOut');
          thisObj.details[i].linesOut = setLines(thisObj.details[i].pointsOut);
          if(thisObj.details[i].level === 1) {
            thisObj.details[i].pointsIn = setPointsIn(thisObj.details[i].linesOut, depths, 'frame');
          } else {
            thisObj.details[i].center = centerBlock(thisObj.details[i].pointsIn);
//            console.log('+++++++++ block ++++++++++pointsIn', JSON.stringify(thisObj.details[i].pointsIn));
            thisObj.details[i].pointsIn = sortingPoints(thisObj.details[i].pointsIn, thisObj.details[i].center);
//            console.log('+++++++++ block ++++++++++pointsIn');
          }
          thisObj.details[i].linesIn = setLines(thisObj.details[i].pointsIn);

          if(thisObj.details[i].level === 1) {
            setCornerProp(thisObj.details);
            //------- set points for each part of construction
            $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].pointsOut, thisObj.details[i].pointsIn, thisObj.priceElements));
          }


          //-------- if block has children and type is sash
          if(thisObj.details[i].children.length) {

            if(thisObj.details[i].blockType === 'sash') {
              thisObj.details[i].sashPointsOut = copyPointsOut(setPointsIn(thisObj.details[i].linesIn, depths, 'sash-out'), 'sash');
              thisObj.details[i].sashLinesOut = setLines(thisObj.details[i].sashPointsOut);
              thisObj.details[i].sashPointsIn = setPointsIn(thisObj.details[i].sashLinesOut, depths, 'sash-in');
              thisObj.details[i].sashLinesIn = setLines(thisObj.details[i].sashPointsIn);

              thisObj.details[i].hardwarePoints = setPointsIn(thisObj.details[i].sashLinesOut, depths, 'hardware');
              thisObj.details[i].hardwareLines = setLines(thisObj.details[i].hardwarePoints);

              $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].sashPointsOut, thisObj.details[i].sashPointsIn, thisObj.priceElements));

              //----- set openPoints for sash
              thisObj.details[i].sashOpenDir = setOpenDir(thisObj.details[i].openDir, thisObj.details[i].sashLinesIn);
              setSashePropertyXPrice(thisObj.details[i].sashType, thisObj.details[i].openDir, thisObj.details[i].hardwareLines, thisObj.priceElements);
            }

          //------- if block is empty
          } else {
            //------ if block is frame
            if(thisObj.details[i].blockType === 'frame') {
//              console.log('+++++++++ block ++++++++++beads');
              thisObj.details[i].beadPointsOut = copyPointsOut(thisObj.details[i].pointsIn, 'bead');
              thisObj.details[i].beadLinesOut = setLines(thisObj.details[i].beadPointsOut);
              thisObj.details[i].beadPointsIn = setPointsIn(thisObj.details[i].beadLinesOut, depths, 'frame-bead');
              //          thisObj.details[i].beadLinesIn = setLines(thisObj.details[i].beadPointsIn);

              thisObj.details[i].glassPoints = setPointsIn(thisObj.details[i].beadLinesOut, depths, 'frame-glass');
              /*          thisObj.details[i].glassLines = setLines(thisObj.details[i].beadPointsIn);*/

              thisObj.details[i].parts.push(setGlass(thisObj.details[i].glassPoints, thisObj.priceElements, thisObj.details[i].glassId));
              $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].beadPointsOut, thisObj.details[i].beadPointsIn, thisObj.priceElements, thisObj.details[i].glassId));

            } else if(thisObj.details[i].blockType === 'sash') {
              //console.info('-------', i, thisObj.details[i]);
              thisObj.details[i].sashPointsOut = copyPointsOut(setPointsIn(thisObj.details[i].linesIn, depths, 'sash-out'), 'sash');
              thisObj.details[i].sashLinesOut = setLines(thisObj.details[i].sashPointsOut);
              thisObj.details[i].sashPointsIn = setPointsIn(thisObj.details[i].sashLinesOut, depths, 'sash-in');
              thisObj.details[i].sashLinesIn = setLines(thisObj.details[i].sashPointsIn);

              thisObj.details[i].hardwarePoints = setPointsIn(thisObj.details[i].sashLinesOut, depths, 'hardware');
              thisObj.details[i].hardwareLines = setLines(thisObj.details[i].hardwarePoints);

              thisObj.details[i].beadPointsOut = copyPointsOut(thisObj.details[i].sashPointsIn, 'bead');
              thisObj.details[i].beadLinesOut = setLines(thisObj.details[i].beadPointsOut);
              thisObj.details[i].beadPointsIn = setPointsIn(thisObj.details[i].beadLinesOut, depths, 'sash-bead');
              //------ for defined open directions of sash
              thisObj.details[i].beadLinesIn = setLines(thisObj.details[i].beadPointsIn);

              thisObj.details[i].glassPoints = setPointsIn(thisObj.details[i].beadLinesOut, depths, 'sash-glass');
              //          thisObj.details[i].glassLines = setLines(thisObj.details[i].beadPointsIn);

              $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].sashPointsOut, thisObj.details[i].sashPointsIn, thisObj.priceElements));
              thisObj.details[i].parts.push(setGlass(thisObj.details[i].glassPoints, thisObj.priceElements, thisObj.details[i].glassId));
              $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].beadPointsOut, thisObj.details[i].beadPointsIn, thisObj.priceElements, thisObj.details[i].glassId));

              //----- set openPoints for sash
              thisObj.details[i].sashOpenDir = setOpenDir(thisObj.details[i].openDir, thisObj.details[i].beadLinesIn);
              setSashePropertyXPrice(thisObj.details[i].sashType, thisObj.details[i].openDir, thisObj.details[i].hardwareLines, thisObj.priceElements);
            }
          }
          setPointsXChildren(thisObj.details[i], thisObj.details, depths);
          //----- create impost parts
          if(thisObj.details[i].children.length) {
            thisObj.details[i].parts.push( setImpostParts(thisObj.details[i].impost.impostIn, thisObj.priceElements) );
          }


        }
      }

      thisObj.dimension = initDimensions(thisObj.details);

      //console.log('TEMPLATE END++++', thisObj);
      //console.log('svg finish', new Date(), new Date().getMilliseconds());
      //console.log('------------------------------------------------------');
      defer.resolve(thisObj);
      return defer.promise;
    }




    //----------- ICON

    function createSVGTemplateIcon(sourceObj, depths) {
      var defer = $q.defer(),
          newDepth = angular.copy(depths),
          coeffScale = 2;
      for(var p in newDepth) {
        for(var el in newDepth[p]) {
          newDepth[p][el] *= coeffScale;
        }
      }
      createSVGTemplate(sourceObj, newDepth).then(function(result) {
        defer.resolve(result);
      });
      return defer.promise;
    }


    //----------- SCALE

    function setTemplateScale(dim, windowW, windowH, padding) {
      var templateW = (dim.maxX - dim.minX),
          templateH = (dim.maxY - dim.minY);
      return (templateW > templateH) ? (windowW/templateW) * padding : (windowH/templateH) * padding;
    }



    //----------- TRANSLATE

    function setTemplatePosition(dim, windowW, windowH, scale) {
      var position = {
        x: (windowW - (dim.minX + dim.maxX)*scale)/2,
        y: (windowH - (dim.minY + dim.maxY)*scale)/2
      };
      return position;
    }




    /////////////////////////////////////////////////////////////////////////////////////



    function centerBlock(points){
      var pointsQty = points.length,
          center = {
            x: points.reduce(function(sum, curr){
              if(curr.dir === 'curv') {
                return sum + curr.xQ;
              } else {
                return sum + curr.x;
              }
            }, 0) / pointsQty,
            y: points.reduce(function(sum, curr){
              if(curr.dir === 'curv') {
                return sum + curr.yQ;
              } else {
                return sum + curr.y;
              }
            }, 0) / pointsQty
          };
      return center;
    }


    function sortingPoints(points, center) {
      var pointsQty = points.length;

      for(var i = 0; i < pointsQty; i++) {
        points[i].fi = getAngelPoint(center, points[i]);
      }
      points.sort(function(a, b){
        return b.fi - a.fi;
      });
//      console.log('CHECK FI+++++++++++++', JSON.stringify(points));
      return points;
    }


    function getAngelPoint(center, point) {
      var fi;
      if(point.dir === 'curv') {
        fi = Math.atan2(center.y - point.yQ, point.xQ - center.x) * (180 / Math.PI);
      } else {
        fi = Math.atan2(center.y - point.y, point.x - center.x) * (180 / Math.PI);
      }
      if(fi < 0) {
        fi += 360;
      }
      return fi;
    }



    function setLines(points) {
      var lines = [],
          pointsQty = points.length;

      for(var i = 0; i < pointsQty; i++) {
        //------ if point.view = 0
        if(points[i].type === 'frame' && !points[i].view) {
          continue;
        }
        var line = {}, index;
        //------- first
        line.from = angular.copy(points[i]);
        line.dir = points[i].dir;
        //------- end
        if(i === (pointsQty - 1)) {
          index = 0;
          if(points[index].type === 'frame' && !points[index].view) {
            index = 1;
          }
        } else {
          index = i+1;
          if(points[index].type === 'frame' && !points[index].view) {
            if(index === (pointsQty - 1)) {
              index = 0;
            } else {
              index = i+2;
            }
          }
        }
        line.to = angular.copy(points[index]);
//        line.type = setLineType(points[i].type, points[index].type);
        line.type = setLineType(points[i].id, points[index].id);
        if(line.dir === 'line') {
          line.dir = (points[index].dir === 'curv') ? 'curv' : 'line';
        }
        line.size = GeneralServ.roundingValue( (Math.hypot((line.to.x - line.from.x), (line.to.y - line.from.y))) );
        setLineCoef(line);
        lines.push(line);
      }
      //------ change place last element in array to first
      var last = lines.pop();
      lines.unshift(last);

      return lines;
    }


    function setLineCoef(line) {
      line.coefA = (line.from.y - line.to.y);
      line.coefB = (line.to.x - line.from.x);
      line.coefC = (line.from.x*line.to.y - line.to.x*line.from.y);
    }


//    function setLineType(from, to) {
//      var type = '';
//      if(from === to) {
//        if(from === 'impost') {
//          type = 'impost';
//        } else {
//          type = 'frame';
//        }
//      } else {
//        type = 'frame';
//      }
//      return type;
//    }

    function setLineType(from, to) {
      var type = '';
      if(from.indexOf('ip')+1 && to.indexOf('ip')+1) {
        type = 'impost';
      //} else if(from.indexOf('sht')+1 && to.indexOf('sht')+1) {
      } else if(from.indexOf('sht')+1 && to.indexOf('sht')+1 && from === to) {
        type = 'shtulp';
      } else {
        type = 'frame';
      }
      return type;
    }



    function setPointsIn(lines, depths, group) {
      var pointsIn = [],
          linesQty = lines.length;
//console.info('lines+++', lines);
      for(var i = 0; i < linesQty; i++) {
        var newLine1 = angular.copy(lines[i]),
            newLine2 = {},
            crossPoint = {},
            index;
        newLine1.coefC = getNewCoefC(depths, newLine1, group);
        if(i === (linesQty - 1)) {
          index = 0;
        } else {
          index = i+1;
        }
        newLine2 = angular.copy(lines[index]);
        newLine2.coefC = getNewCoefC(depths, newLine2, group);
        crossPoint = getCrossPoint2Lines(newLine1, newLine2);
        pointsIn.push(crossPoint);
      }
      return pointsIn;
    }


    function getNewCoefC(depths, line, group) {
      var depth = 0, beadDepth = 20;
      //console.info('depth++++', group, line.type);
      switch(group) {
        case 'frame':
          if(line.type === 'frame') {
            depth = depths.frameDepth.c;
          } else if(line.type === 'impost') {
            depth = depths.impostDepth.c/2;
          } else if(line.type === 'shtulp') {
            depth = depths.shtulpDepth.b/2;
          }
          break;
        case 'frame-bead':
        case 'sash-bead':
          depth = beadDepth;
          break;
        case 'frame-glass':
          if(line.type === 'frame') {
            depth = depths.frameDepth.d - depths.frameDepth.c;
          } else if(line.type === 'impost') {
            depth = depths.impostDepth.b - depths.impostDepth.c/2;
          }
          break;

        case 'sash-out':
          if(line.type === 'frame') {
            depth = depths.frameDepth.b - depths.frameDepth.c;
          } else if(line.type === 'impost') {
            depth = depths.impostDepth.d - depths.impostDepth.c/2;
          } else if(line.type === 'shtulp') {
            depth = depths.shtulpDepth.a/2 - depths.shtulpDepth.b/2;
          }
          break;
        case 'sash-in':
          depth = depths.sashDepth.c;
          break;
        case 'hardware':
          depth = depths.sashDepth.b;
          break;
        case 'sash-glass':
          depth = depths.sashDepth.d - depths.sashDepth.c;
          break;

        //case 'frame+sash':
        //  depth = depths.frameDepth.b + depths.sashDepth.c;
        //  break;
      }
      var newCoefC = line.coefC - (depth * Math.hypot(line.coefA, line.coefB));
      return newCoefC;
    }


    function getCrossPoint2Lines(line1, line2) {
      var crossPoint = {},
          coord = {},
          isParall = checkParallel(line1, line2);

      //------- if lines are paralles
      if(isParall) {
//            console.log('parallel = ', isParall);
        //----- set normal statement
        //    var normal = {
        //      coefA: 1,
        //      coefB: -(line1.coefB / line1.coefA),
        //      coefC: (line1.coefB * line1.to.x/ line1.coefA) - line1.to.y
        //    };

        var x2 = line1.to.x,
            y2 = line1.to.y;
//        if(line1.to.dir === 'curv') {
//          x2 = line1.to.xQ;
//          y2 = line1.to.yQ;
//        }
        var normal = {
          coefA: line1.coefB,
          coefB: -line1.coefA,
          coefC: (line1.coefA * y2 - line1.coefB * x2)
        };
//        console.log('normal = ',  normal);
        coord = getCoordCrossPoint(line1, normal);
      } else {
        coord = getCoordCrossPoint(line1, line2);
      }
//        console.log('coord = ', coord);
      crossPoint.x = coord.x;
      crossPoint.y = coord.y;

      //crossPoint.type = (line1.type === 'impost' || line2.type === 'impost') ? 'impost' : 'frame';
      if(line1.type === 'impost' || line2.type === 'impost') {
        crossPoint.type = 'impost';
      } else if(line1.type === 'shtulp' || line2.type === 'shtulp') {
        crossPoint.type = 'shtulp';
      } else {
        crossPoint.type = 'frame';
      }
      if(line1.to.dir === 'curv') {
        crossPoint.dir = 'curv';
        crossPoint.xQ = line1.to.xQ;
        crossPoint.yQ = line1.to.yQ;
      } else {
        crossPoint.dir = 'line';
      }
      crossPoint.id = line1.to.id;
      crossPoint.view = 1;
      return crossPoint;
    }


    function checkParallel(line1, line2) {
      var k1 = checkParallelCoef(line1),
          k2 = checkParallelCoef(line2);
      return (k1 === k2) ? 1 : 0;
    }


    function checkParallelCoef(line) {
      var x1 = line.from.x,
          y1 = line.from.y,
          x2 = line.to.x,
          y2 = line.to.y;
//      if(line.from.dir === 'curv') {
//        x1 = line.from.xQ;
//        y1 = line.from.yQ;
//      }
//      if(line.to.dir === 'curv') {
//        x2 = line.to.xQ;
//        y2 = line.to.yQ;
//      }
      return Math.round( (y2 - y1) / (x2 - x1) );
    }



    function setQPInMainBlock(currBlock) {
      var qpQty = currBlock.pointsQ.length;
      if(qpQty) {
        for (var q = 0; q < qpQty; q++) {
          var pointsOutQty = currBlock.pointsOut.length, curvP0 = 0, curvP1 = 0;
          for (var p = 0; p < pointsOutQty; p++) {
            if (currBlock.pointsQ[q].fromPId === currBlock.pointsOut[p].id) {
              curvP0 = currBlock.pointsOut[p];
            }
            if (currBlock.pointsQ[q].toPId === currBlock.pointsOut[p].id) {
              curvP1 = currBlock.pointsOut[p];
            }
          }

          if (curvP0 && curvP1) {
            var curvLine = {
                  from: curvP0,
                  to: curvP1
                },
                centerLine = getCenterLine(curvP0, curvP1),
                curvQP = {
                  type: currBlock.pointsQ[q].type,
                  id: currBlock.pointsQ[q].id,
                  dir: 'curv',
                  xQ: centerLine.x,
                  yQ: centerLine.y
                }, coordQP;

            setLineCoef(curvLine);

            //------ get coordinates Q point
            coordQP = setQPointCoord(currBlock.pointsQ[q].positionQ, curvLine, currBlock.pointsQ[q].heightQ * 2);
//            console.log('!!!!! curvQP -----', curvP0, curvP1, coordQP);
//            console.log('!!!!! curvQP -----', currBlock.pointsQ[q]);
            curvQP.x = coordQP.x;
            curvQP.y = coordQP.y;

            //------ if curve vert or hor
            if (!curvLine.coefA && currBlock.pointsQ[q].positionQ === 1) {
              curvQP.y -= currBlock.pointsQ[q].heightQ * 4;
            } else if (!curvLine.coefB && currBlock.pointsQ[q].positionQ === 4) {
              curvQP.x -= currBlock.pointsQ[q].heightQ * 4;
            }
//            console.log('!!!!! curvQP -----', curvQP);
            currBlock.pointsOut.push(angular.copy(curvQP));

            //------ for R dimension, get coordinates for Radius location
            currBlock.pointsQ[q].midleX = curvQP.xQ;
            currBlock.pointsQ[q].midleY = curvQP.yQ;
            setRadiusCoordXCurve(currBlock.pointsQ[q], curvP0, curvQP, curvP1);
          }

        }
      }
    }


    function setPointsXChildren(currBlock, blocks, depths) {
      if(currBlock.children.length) {
        var blocksQty = blocks.length,
            impPointsQty = currBlock.impost.impostAxis.length,
            impAx0 = angular.copy(currBlock.impost.impostAxis[0]),
            impAx1 = angular.copy(currBlock.impost.impostAxis[1]),
            pointsOut = angular.copy(currBlock.pointsOut),
            pointsIn, linesIn,
            indexChildBlock1, indexChildBlock2;

//console.log('-------------setPointsXChildren -----------');
        if(currBlock.blockType === 'sash') {
          pointsIn = angular.copy(currBlock.sashPointsIn);
          linesIn = currBlock.sashLinesIn;
        } else {
          pointsIn = angular.copy(currBlock.pointsIn);
          linesIn = currBlock.linesIn;
        }
        var linesInQty = linesIn.length;

        //-------- get indexes of children blocks
        for(var i = 1; i < blocksQty; i++) {
          if(blocks[i].id === currBlock.children[0]) {
            indexChildBlock1 = i;
          } else if(blocks[i].id === currBlock.children[1]) {
            indexChildBlock2 = i;
          }
        }

        //------- create 2 impost vectors
        var impVectorAx1 = {
              type: (impAx0.type === 'impost') ? 'impost' : 'shtulp',
              from: impAx0,
              to: impAx1
            },
            impVectorAx2 = {
              type: (impAx0.type === 'impost') ? 'impost' : 'shtulp',
              from: impAx1,
              to: impAx0
            };
        setLineCoef(impVectorAx1);
        setLineCoef(impVectorAx2);

        var impVector1 = angular.copy(impVectorAx1),
            impVector2 = angular.copy(impVectorAx2);

        impVector1.coefC = getNewCoefC(depths, impVector1, 'frame');
        impVector2.coefC = getNewCoefC(depths, impVector2, 'frame');
//        console.log('IMP impVectorAx1+++++++++', impVectorAx1);
//        console.log('IMP impVector1++++++++++', impVector1);
//        console.log('IMP impVector2++++++++++', impVector2);
//        console.log('IMP linesIn++++++++++', linesIn);
        //-------- finde cross points each impost vectors with lineIn of block
        for(var i = 0; i < linesInQty; i++) {
//          console.log('!!!!! impVector1 -----');
          getCPImpostInsideBlock(0, 0, i, linesInQty, linesIn, impVector1, impAx0, currBlock.impost.impostIn);
//          console.log('!!!!! impVector2 -----');
          getCPImpostInsideBlock(1, 0, i, linesInQty, linesIn, impVector2, impAx1, currBlock.impost.impostIn);
//          console.log('!!!!! impVectorAx1 -----');
          getCPImpostInsideBlock(0, 1, i, linesInQty, linesIn, impVectorAx1, impAx0, currBlock.impost.impostOut, pointsIn);
        }

        //------- if curve impost
        if(impPointsQty === 3) {
          //----- make order for impostOut
          var impostOutQty = currBlock.impost.impostOut.length, impAxQ;
          for(var i = 0; i < impostOutQty; i++) {
            currBlock.impost.impostOut[i].fi = getAngelPoint(currBlock.center, currBlock.impost.impostOut[i]);
            currBlock.impost.impostAxis[i].fi = getAngelPoint(currBlock.center, currBlock.impost.impostAxis[i]);
          }
          if(currBlock.impost.impostOut[0].fi !== currBlock.impost.impostAxis[0].fi) {
            currBlock.impost.impostOut.reverse();
          }

          impAxQ = getImpostQP(0, 1, currBlock.impost);
          getImpostQP(0, 0, currBlock.impost);
          getImpostQP(1, 0, currBlock.impost);

          blocks[indexChildBlock1].pointsOut.push(angular.copy(impAxQ));
          blocks[indexChildBlock2].pointsOut.push(angular.copy(impAxQ));

          //------ for R dimension, get coordinates for Radius location
          currBlock.impost.impostAxis[2].midleX = impAxQ.xQ;
          currBlock.impost.impostAxis[2].midleY = impAxQ.yQ;
          setRadiusCoordXCurve(currBlock.impost.impostAxis[2], currBlock.impost.impostOut[0], impAxQ, currBlock.impost.impostOut[1]);
        }


        var impostAx = angular.copy(currBlock.impost.impostAxis);
        //------- insert pointsOut of parent block in pointsOut of children blocks
//        console.log('!!!!! -----', blocks[indexChildBlock1].id, blocks[indexChildBlock2].id);
//        console.log('!!!!! pointsOut -----',JSON.stringify(pointsOut));
        collectPointsXChildBlock(impostAx, pointsOut, blocks[indexChildBlock1].pointsOut, blocks[indexChildBlock2].pointsOut);
        //------- insert impostOut of impost in pointsOut of children blocks
//        for(var i = 0; i < 2; i++) {
//          blocks[indexChildBlock1].pointsOut.push(angular.copy(impostAx[i]));
//          blocks[indexChildBlock2].pointsOut.push(angular.copy(impostAx[i]));
//        }
//        console.log('!!!!! pointsIn -----', JSON.stringify(pointsIn));
        //------- insert pointsIn of parent block in pointsIn of children blocks
        collectPointsXChildBlock(impostAx, pointsIn, blocks[indexChildBlock1].pointsIn, blocks[indexChildBlock2].pointsIn);
        //------- insert impostIn of impost in pointsIn of children blocks
        collectImpPointsXChildBlock(currBlock.impost.impostIn, blocks[indexChildBlock1].pointsIn, blocks[indexChildBlock2].pointsIn);
//        console.log('!!!!! indexChildBlock1 -----', JSON.stringify(blocks[indexChildBlock1].pointsIn));
//        console.log('!!!!! indexChildBlock2 -----', JSON.stringify(blocks[indexChildBlock2].pointsIn));
        //-------- set real impostAxis coord for dimensions
        var linesOutQty = currBlock.linesOut.length,
            impostQP;
        if(currBlock.impost.impostAxis[2]) {
          impostQP = angular.copy(currBlock.impost.impostAxis[2]);
        }
        currBlock.impost.impostAxis.length = 0;
        for(var i = 0; i < linesOutQty; i++) {
          getCPImpostInsideBlock(0, 0, i, linesOutQty, currBlock.linesOut, impVectorAx1, impAx0, currBlock.impost.impostAxis);
        }
        if(impostQP) {
          currBlock.impost.impostAxis.push(impostQP);
        }
        for(var i = 0; i < 2; i++) {
          blocks[indexChildBlock1].pointsOut.push(angular.copy(currBlock.impost.impostAxis[i]));
          blocks[indexChildBlock2].pointsOut.push(angular.copy(currBlock.impost.impostAxis[i]));
        }
      }
    }





    function getCPImpostInsideBlock(group, markAx, i, linesInQty, linesIn, impVector, impAx, impost, pointsIn) {
      var impCP = getCoordCrossPoint(linesIn[i], impVector),
          isInside = checkLineOwnPoint(impCP, linesIn[i].to, linesIn[i].from),
          isCross = isInsidePointInLine(isInside);

      if (isCross) {
        var ip = angular.copy(impAx);
        ip.group = group;
        ip.x = impCP.x;
        ip.y = impCP.y;

        if (linesIn[i].dir === 'curv') {
          var impCenterP = findImpostCenter(markAx, impVector);
          var intersect = getIntersectionInCurve(i, linesInQty, linesIn, impCenterP, impCP);
//          console.log('intersect +++impCenterP, impCP', impCenterP, impCP);
//          console.log('intersect +++', intersect[0]);
          if (intersect.length) {
            ip.x = intersect[0].x;
            ip.y = intersect[0].y;
            ip.t = intersect[0].t;
//            var noExist = checkEqualPoints(ip, impost);
//            if(noExist) {
//              if (markAx) {
//                setSideQPCurve(i, linesInQty, linesIn, intersect[0], pointsIn);
//              }
//              impost.push(angular.copy(ip));
//            }
          }
        }
        var noExist = checkEqualPoints(ip, impost);
        if(noExist) {
          if (linesIn[i].dir === 'curv' && markAx) {
            setSideQPCurve(i, linesInQty, linesIn, ip, pointsIn);
          }
//            console.log('impCP++++++++', JSON.stringify(ip));
          impost.push(angular.copy(ip));
//            console.log('impost++++++++', JSON.stringify(impost));
        }
      }
    }


    function isInsidePointInLine(checkCrossPoint) {
      var isCross = 0;
      if(checkCrossPoint.x === Infinity && checkCrossPoint.y >= 0 && checkCrossPoint.y <= 1) {
        isCross = 1;
      } else if(checkCrossPoint.x >= 0 && checkCrossPoint.x <= 1  && checkCrossPoint.y === Infinity) {
        isCross = 1;
      } else if(isNaN(checkCrossPoint.x) && checkCrossPoint.y >= 0 && checkCrossPoint.y <= 1) {
        isCross = 1;
      } else if(checkCrossPoint.x >= 0 && checkCrossPoint.x <= 1  && isNaN(checkCrossPoint.y)) {
        isCross = 1;
      } else if (checkCrossPoint.x >= 0 && checkCrossPoint.x <= 1  && checkCrossPoint.y >= 0 && checkCrossPoint.y <= 1) {
        isCross = 1;
        //            }
      } else if (checkCrossPoint.x >= 0 && checkCrossPoint.x <= 1  && $.isNumeric(checkCrossPoint.y)) {
        if(checkCrossPoint.y < -2 || checkCrossPoint.y > 2) {
          isCross = 1;
        }
      } else if ($.isNumeric(checkCrossPoint.x) && checkCrossPoint.y >= 0 && checkCrossPoint.y <= 1) {
        if(checkCrossPoint.x < -2 || checkCrossPoint.x > 2) {
          isCross = 1;
        }
      }
      return isCross;
    }


    function findImpostCenter(markAx, impost) {
      //---- take middle point of impost
      var centerImpost = getCenterLine(impost.from, impost.to);
      //---- if impost Axis line
      if(markAx) {
        return centerImpost;
      } else {
      //---- if impost inner line
        var normal = {
          coefA: impost.coefB,
          coefB: -impost.coefA,
          coefC: (impost.coefA * centerImpost.y - impost.coefB * centerImpost.x)
        };
        return getCoordCrossPoint(impost, normal);
      }
    }


    function setSideQPCurve(i, linesInQty, linesIn, intersect, pointsIn) {
      var sideQP1, sideQP2, index, curvP0, curvP2;
      if (linesIn[i].from.id.indexOf('q')+1) {
        index = i - 1;
        if (!linesIn[index]) {
          index = linesInQty - 1;
        }
        curvP0 = linesIn[index].from;
        curvP2 = linesIn[i].to;
        sideQP1 = angular.copy(linesIn[i].from);
      } else if (linesIn[i].to.id.indexOf('q') + 1) {
        index = i + 1;
        if (!linesIn[index]) {
          index = 0;
        }
        curvP0 = linesIn[i].from;
        curvP2 = linesIn[index].to;
        sideQP1 = angular.copy(linesIn[i].to);
      }
      sideQP2 = angular.copy(sideQP1);

      var impostQP1 = getCoordSideQPCurve(intersect.t, curvP0, sideQP1),
          impostQP2 = getCoordSideQPCurve(intersect.t, sideQP2, curvP2),
          impostQPCenter1 = getCenterLine(curvP0, intersect),
          impostQPCenter2 = getCenterLine(intersect, curvP2);

      sideQP1.x = impostQP1.x;
      sideQP1.y = impostQP1.y;
      sideQP1.xQ = impostQPCenter1.x;
      sideQP1.yQ = impostQPCenter1.y;

      sideQP2.x = impostQP2.x;
      sideQP2.y = impostQP2.y;
      sideQP2.xQ = impostQPCenter2.x;
      sideQP2.yQ = impostQPCenter2.y;
//      console.log('QQQQ--------', sideQP1);
//      console.log('QQQQ--------', sideQP2);

      //----- delete Q point parent
      var pQty = pointsIn.length;
      while(--pQty > -1) {
        if(pointsIn[pQty].id === sideQP1.id) {
          pointsIn.splice(pQty, 1);
        }
      }
//      console.log('QQQQ pointsIn after clean--------', JSON.stringify(pointsIn));

      var noExist1 = checkEqualPoints(sideQP1, pointsIn);
      if(noExist1) {
//        console.log('noExist1-------');
        pointsIn.push(sideQP1);
      }
      var noExist2 = checkEqualPoints(sideQP2, pointsIn);
      if(noExist2) {
//        console.log('noExist2-------');
        pointsIn.push(sideQP2);
      }
//      console.log('QQQQ pointsIn--------', JSON.stringify(pointsIn));
    }




    function getImpostQP(group, paramAx, impostBlock) {
      var impQP, impCurvPoints = [];

      //-------- for impostAxis
      if(paramAx) {
        impQP = {
          type: 'impost',
          id: impostBlock.impostAxis[2].id,
          dir: 'curv'
        };
        impCurvPoints.push(impostBlock.impostOut[0], impostBlock.impostOut[1]);

        //------- for impostsIn
      } else {
        impQP = angular.copy(impostBlock.impostOut[2]);
        impCurvPoints = impostBlock.impostIn.filter(function(a) {
          return (a.group === group && a.dir === 'line') ? 1 : 0;
        });
      }


      if(impCurvPoints.length === 2) {
        var impChord = {
              from: angular.copy(impCurvPoints[0]),
              to: angular.copy(impCurvPoints[1])
            },
            centerImpChord = getCenterLine(impChord.from, impChord.to),
            coordQP;

        setLineCoef(impChord);

        //------ get Q point Axis of impost
        coordQP = setQPointCoord(impostBlock.impostAxis[2].positionQ, impChord, impostBlock.impostAxis[2].heightQ*2);
        impQP.x = coordQP.x;
        impQP.y = coordQP.y;
        impQP.xQ = centerImpChord.x;
        impQP.yQ = centerImpChord.y;
        impQP.group = group;

        //------ if impost vert or hor
        if(!impChord.coefA && impostBlock.impostAxis[2].positionQ === 1) {
          impQP.y -= impostBlock.impostAxis[2].heightQ * 4;
        } else if(!impChord.coefB && impostBlock.impostAxis[2].positionQ === 4) {
          impQP.x -= impostBlock.impostAxis[2].heightQ * 4;
        }
//        console.log('!!!!! impQP -----', impQP);
        if(paramAx) {
          impostBlock.impostOut.push(impQP);
          return impQP;
        } else {
          impostBlock.impostIn.push(impQP);
        }
      }

    }




    function collectPointsXChildBlock(impostVector, points, pointsBlock1, pointsBlock2) {
      var pointsQty = points.length;
      for(var i = 0; i < pointsQty; i++) {
        //------- check pointsIn of parent block as to impost
        var position = setPointLocationToLine(impostVector[0], impostVector[1], points[i]);
        //------ block right side
        if(position > 0) {
          var exist = 0;
          if(pointsBlock2.length) {
            exist = checkDoubleQPoints(points[i].id, pointsBlock2);
          }
          if(!exist) {
            pointsBlock2.push(angular.copy(points[i]));
          }
        //------ block left side
        } else if(position < 0){
          var exist = 0;
          if(pointsBlock1.length) {
            exist = checkDoubleQPoints(points[i].id, pointsBlock1);
          }
          if(!exist) {
            pointsBlock1.push(angular.copy(points[i]));
          }
        }
      }
    }


    function collectImpPointsXChildBlock(points, pointsBlock1, pointsBlock2) {
      var pointsQty = points.length;
      for(var i = 0; i < pointsQty; i++) {
        //------ block right side
        if(points[i].group) {
          pointsBlock2.push(angular.copy(points[i]));
        //------ block left side
        } else {
          pointsBlock1.push(angular.copy(points[i]));
        }
      }
    }


    function setPointLocationToLine(lineP1, lineP2, newP) {
      return (newP.x - lineP2.x)*(newP.y - lineP1.y)-(newP.y - lineP2.y)*(newP.x - lineP1.x);
    }


    function checkEqualPoints(newPoint, pointsArr) {
      var noExist = 1,
          pointsQty = pointsArr.length;
      if (pointsQty) {
        while (--pointsQty > -1) {
          if (pointsArr[pointsQty].x === newPoint.x && pointsArr[pointsQty].y === newPoint.y) {
            noExist = 0;
          }
        }
      }
      return noExist;
    }


    function checkDoubleQPoints(newPointId, pointsIn) {
      //      console.log('-----------', newPointId, pointsIn);
      var isExist = 0,
          pointsInQty = pointsIn.length;
      if (pointsInQty) {
        while (--pointsInQty > -1) {
          if (pointsIn[pointsInQty].id.slice(0, 3) === newPointId.slice(0, 3)) {
//            if (pointsIn[pointsInQty].id.slice(0, 3).indexOf('qa') + 1 || pointsIn[pointsInQty].id.slice(0, 3).indexOf('qc') + 1) {
            if (pointsIn[pointsInQty].id.slice(0, 3).indexOf('q') + 1) {
              isExist = 1;
            }
          }
        }
      }
      return isExist;
    }


    function getCoordSideQPCurve(t, p0, p1) {
      var qpi = {
        x: GeneralServ.roundingValue( ((1-t)*p0.x + t*p1.x) ),
        y: GeneralServ.roundingValue( ((1-t)*p0.y + t*p1.y) )
      };
      return qpi;
    }


    function setQPointCoord(side, line, dist) {
      var middle = getCenterLine(line.from, line.to),
          coordQP = {};
//      console.log('setQPointCoord-----------', line, middle);
      //------- line vert or hor
      if(!line.coefA || !line.coefB) {
        coordQP.x = Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) )) + middle.x;
        coordQP.y = Math.sqrt( Math.abs( Math.pow(dist, 2) - Math.pow((coordQP.x - middle.x), 2) ) ) + middle.y;
//        console.log('line vert or hor');
      } else {
        switch(side) {
          case 1:
            coordQP.y = middle.y - Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) ));
            coordQP.x = middle.x - Math.sqrt( Math.abs( Math.pow(dist, 2) - Math.pow((middle.y - coordQP.y), 2) ) );
//            console.log('1');
            break;
          case 2:
            coordQP.y = middle.y - Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) ));
            coordQP.x = Math.sqrt( Math.abs( Math.pow(dist, 2) - Math.pow((coordQP.y - middle.y), 2) ) ) + middle.x;
//            console.log('2');
            break;
          case 3:
            coordQP.y = Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) )) + middle.y;
            coordQP.x = Math.sqrt( Math.abs( Math.pow(dist, 2) - Math.pow((coordQP.y - middle.y), 2) ) ) + middle.x;
//            console.log('3');
            break;
          case 4:
            coordQP.y = Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) )) + middle.y;
            coordQP.x = middle.x - Math.sqrt( Math.abs( Math.pow(dist, 2) - Math.pow((middle.y - coordQP.y), 2) ) );
//            console.log('4');

            break;
        }
      }
      coordQP.y = GeneralServ.roundingValue( coordQP.y, 1 );
      coordQP.x = GeneralServ.roundingValue( coordQP.x, 1 );
//      console.log('ERROR coordQP!!!', coordQP);
      return coordQP;
    }







    function setParts(pointsOut, pointsIn, priceElements, currGlassId) {
      var newPointsOut = pointsOut.filter(function (item) {
        if(item.type === 'frame' && !item.view) {
          return false;
        } else {
          return true;
        }
      });

      var parts = [],
          pointsQty = newPointsOut.length,
          beadObj = {
            glassId: currGlassId,
            sizes: []
          }, tempPoint, tempPoint2;

      for(var index = 0; index < pointsQty; index++) {
        //----- passing if first point is curv
        if(index === 0 && newPointsOut[index].dir === 'curv') {
          continue;
        }
        var part = {
          type: newPointsOut[index].type,
          dir: 'line',
          points: []
        };
        //------ if last point
        if(index === (pointsQty - 1)) {
          /** if curv */
          //------- if one point is 'curv' from both
          if(newPointsOut[index].dir === 'curv') {
            break;
          } else if(newPointsOut[0].dir === 'curv') {
            part.type = 'arc';
            part.points.push(newPointsOut[index], newPointsOut[0], newPointsOut[1], pointsIn[1], pointsIn[0], pointsIn[index]);
            if(newPointsOut[index].type === 'corner' || newPointsOut[1].type === 'corner') {
              part.type = 'arc-corner';
            }
            part.dir = 'curv';
          } else {
            /**----- DOOR -----*/
            if(ProductStor.product.construction_type === 4 && (DesignStor.design.doorConfig.doorShapeIndex === 1 || DesignStor.design.doorConfig.doorShapeIndex === 2)) {
              //-------- change points fp2-fp3 frame
              if (newPointsOut[0].type === 'frame' && newPointsOut[0].id === 'fp3') {
                tempPoint = angular.copy(pointsIn[0]);
                tempPoint.y = newPointsOut[0].y * 1;
                collectPointsInParts(part, newPointsOut[index], newPointsOut[0], tempPoint, pointsIn[index]);
              } else {
                /** if line */
                collectPointsInParts(part, newPointsOut[index], newPointsOut[0], pointsIn[0], pointsIn[index]);
              }
            } else {
              /** if line */
              collectPointsInParts(part, newPointsOut[index], newPointsOut[0], pointsIn[0], pointsIn[index]);
            }

          }
        } else {

          /** if curv */
          if(newPointsOut[index].dir === 'curv' || newPointsOut[index+1].dir === 'curv') {
            part.type = 'arc';
            part.points.push(newPointsOut[index], newPointsOut[index+1]);
            if(newPointsOut[index+2]) {
              part.points.push(newPointsOut[index+2], pointsIn[index+2]);
              if(newPointsOut[index].type === 'corner' || newPointsOut[index+2].type === 'corner') {
                part.type = 'arc-corner';
              }
            } else {
              part.points.push(newPointsOut[0], pointsIn[0]);
              if(newPointsOut[index].type === 'corner' || newPointsOut[0].type === 'corner') {
                part.type = 'arc-corner';
              }
            }
            part.points.push(pointsIn[index+1], pointsIn[index]);
            part.dir = 'curv';
            index++;
          } else {
            /**----- DOOR -----*/
            if(ProductStor.product.construction_type === 4 && (DesignStor.design.doorConfig.doorShapeIndex === 1 || DesignStor.design.doorConfig.doorShapeIndex === 2)) {
              /** without doorstep */
              //-------- delete fp3-fp4 frame
              if(DesignStor.design.doorConfig.doorShapeIndex === 1) {
                if (newPointsOut[index].type === 'frame' && newPointsOut[index].id === 'fp3') {
                  continue;
                }
              }
              /** doorstep Al inner */
              //-------- change fp3-fp4 frame to inner doorstep
              if(DesignStor.design.doorConfig.doorShapeIndex === 2) {
                if (newPointsOut[index].type === 'frame' && newPointsOut[index].id === 'fp3') {
                  tempPoint = angular.copy(newPointsOut[index]);
                  tempPoint.x = pointsIn[index].x * 1;
                  tempPoint2 = angular.copy(newPointsOut[index+1]);
                  tempPoint2.x = pointsIn[index+1].x * 1;
                  collectPointsInParts(part, tempPoint, tempPoint2, pointsIn[index+1], pointsIn[index]);
                  part.doorstep = 1;
                }
              }

              if (newPointsOut[index].type === 'frame' && newPointsOut[index].id === 'fp4') {
                //-------- change points fp4-fp1 frame
                tempPoint = angular.copy(pointsIn[index]);
                tempPoint.y = newPointsOut[index].y * 1;
                collectPointsInParts(part, newPointsOut[index], newPointsOut[index+1], pointsIn[index+1], tempPoint);
              } else {
                if ((newPointsOut[index].type === 'frame' && newPointsOut[index].id !== 'fp3') || newPointsOut[index].type !== 'frame') {
                  /** if line */
                  collectPointsInParts(part, newPointsOut[index], newPointsOut[index + 1], pointsIn[index + 1], pointsIn[index]);
                }
              }
            } else {
              /** if line */
              collectPointsInParts(part, newPointsOut[index], newPointsOut[index+1], pointsIn[index+1], pointsIn[index]);
            }
          }

        }
        console.info(part.points);
        part.path = assamblingPath(part.points);
        //------- culc length
        part.size = culcLength(part.points);

        //------- per Price
        //----- converting size from mm to m
        var sizeValue = GeneralServ.roundingValue(angular.copy(part.size)/1000, 3);
        if(newPointsOut[index].type === 'bead') {
          part.type = 'bead';
          beadObj.sizes.push(sizeValue);
        } else if(newPointsOut[index].type === 'sash') {
          part.type = 'sash';
          priceElements.sashsSize.push(sizeValue);
        } else if(part.type === 'frame') {
          if(part.sill) {
            priceElements.frameSillSize.push(sizeValue);
          } else {
            priceElements.framesSize.push(sizeValue);
          }
        }
        parts.push(part);
      }
      if(beadObj.sizes.length) {
        priceElements.beadsSize.push(beadObj);
      }
      return parts;
    }


    function collectPointsInParts(part, point1, point2, point3, point4) {
      part.points.push(point1, point2, point3, point4);
      if(point1.type === 'corner' || point2.type === 'corner') {
        part.type = 'corner';
      }
      //-------- set sill
      if(point1.sill && point2.sill) {
        part.sill = 1;
      }
    }


    function assamblingPath(arrPoints) {
      var path = 'M ' + arrPoints[0].x + ',' + arrPoints[0].y,
          p = 1,
          pointQty = arrPoints.length;

      //------- Line
      if(pointQty === 4) {
        for(; p < pointQty; p++) {

          path += ' L ' + arrPoints[p].x + ',' + arrPoints[p].y;

          if(p === (pointQty - 1)) {
            path += ' Z';
          }

        }
        //--------- Curve
      } else if(pointQty === 6) {
        for(; p < pointQty; p++) {
          if(p === 3) {
            path += ' L ' + arrPoints[p].x + ',' + arrPoints[p].y;
          } else {
            path += ' Q '+ arrPoints[p].x +','+ arrPoints[p].y + ' ' + arrPoints[p+1].x +','+ arrPoints[p+1].y;
            p++;
          }

          if(p === (pointQty - 1)) {
            path += ' Z';
          }

        }
      }
      //  console.log(arrPoints);

      return path;
    }


    function culcLength(arrPoints) {
      var pointQty = arrPoints.length,
          size = 0;
      //------- Line
      if(pointQty === 2 || pointQty === 4) {
        size = GeneralServ.roundingValue( (Math.hypot((arrPoints[1].x - arrPoints[0].x), (arrPoints[1].y - arrPoints[0].y))), 1 );

        //--------- Curve
      } else if(pointQty === 3 || pointQty === 6) {
        var step = 0.01,
            t = 0;
        while(t <= 1) {
          var sizeX = 2*((1-t)*(arrPoints[1].x - arrPoints[0].x) + t*(arrPoints[2].x - arrPoints[1].x));
          var sizeY = 2*((1-t)*(arrPoints[1].y - arrPoints[0].y) + t*(arrPoints[2].y - arrPoints[1].y));
          size += Math.hypot(sizeX, sizeY)*step;
          t += step;
        }
      }
      return size;
    }


    function setGlass(glassPoints, priceElements, currGlassId) {
      var part = {
            type: 'glass',
            points: glassPoints,
            path: 'M ',
            square: 0
          },
          glassObj = {
            elemId: currGlassId
          },
          pointsQty = glassPoints.length,
          i = 0;

      for(; i < pointsQty; i++) {
        //----- if first point
        if(i === 0) {
          //----- if first point is curve
          if (glassPoints[i].dir === 'curv') {
            part.path += glassPoints[pointsQty - 1].x + ',' + glassPoints[pointsQty - 1].y;

            //-------- if line
          } else {
            part.path += glassPoints[i].x + ',' + glassPoints[i].y;
          }
        }
        //------- if curve
        if(glassPoints[i].dir === 'curv') {
          part.path += ' Q ' + glassPoints[i].x + ',' + glassPoints[i].y + ',';
          if(glassPoints[i+1]) {
            part.path += glassPoints[i+1].x + ',' + glassPoints[i+1].y;
          } else {
            part.path += glassPoints[0].x + ',' + glassPoints[0].y + ' Z';
          }
          i++;
        //-------- if line
        } else {
          part.path += ' L ' + glassPoints[i].x + ',' + glassPoints[i].y;
          if(i === (pointsQty - 1)) {
            part.path += ' Z';
          }
        }

      }
      part.square = calcSquare(glassPoints);
      part.sizes = culcLengthGlass(glassPoints);

      //------- per Price
      glassObj.square = angular.copy(part.square);
      //----- converting size from mm to m
      glassObj.sizes = angular.copy(part.sizes).map(function(item) {
        return GeneralServ.roundingValue(item/1000, 3);
      });
      priceElements.glassSquares.push(glassObj);

      return part;
    }


    function calcSquare(arrPoints) {
      var square = 0,
          pointQty = arrPoints.length;

      for(var p = 0; p < pointQty; p++) {
        if(arrPoints[p+1]) {
          square += arrPoints[p].x * arrPoints[p+1].y - arrPoints[p].y * arrPoints[p+1].x;
        } else {
          square += arrPoints[p].x * arrPoints[0].y - arrPoints[p].y * arrPoints[0].x
        }
      }
      square /= (2 * 1000000);

      //  console.log('square = ', square);
      return square;
    }


    function culcLengthGlass(points) {
      var pointQty = points.length,
          sizes = [];

      for(var p = 0; p < pointQty; p++) {
        var size = 0, indNext;
        if(p === 0 && points[p].dir === 'curve') {
          continue;
        }
        if(points[p+1]) {
          indNext = p+1;
        } else {
          indNext = 0;
        }
        //--------- Curve
        if(points[indNext].dir === 'curve') {
          var step = 0.01, t = 0, ind2;
          if(points[p+2]) {
            ind2 = p+2;
          } else {
            ind2 = 1;
          }
          while (t <= 1) {
            var sizeX = 2 * ((1 - t) * (points[indNext].x - points[p].x) + t * (points[ind2].x - points[indNext].x));
            var sizeY = 2 * ((1 - t) * (points[indNext].y - points[p].y) + t * (points[ind2].y - points[indNext].y));
            size += Math.hypot(sizeX, sizeY) * step;
            t += step;
          }
          ++p;
        } else {
          //------- Line
          size = GeneralServ.roundingValue( Math.hypot((points[indNext].x - points[p].x), (points[indNext].y - points[p].y)), 1 );
        }

        sizes.push(size);
      }

      return sizes;
    }




    function setCornerProp(blocks) {
      var blocksQty = blocks.length;

      for(var b = 1; b < blocksQty; b++) {
        //------- if block 1
        if(blocks[b].level === 1) {
          var pointsQty = blocks[b].pointsOut.length,
              i = 0;
          if(blocks[b].position === 'single') {
            for(; i < pointsQty; i++){
              blocks[b].pointsOut[i].corner = checkPointXCorner(blocks[b].pointsOut, (pointsQty-1), i);
            }
          } else if(blocks[b].position === 'first') {
            for(; i < pointsQty; i++){
              if(blocks[b].pointsOut[i].fi > 90 && blocks[b].pointsOut[i].fi < 270) {
                blocks[b].pointsOut[i].corner = checkPointXCorner(blocks[b].pointsOut, (pointsQty-1), i);
              }
            }
          } else if(blocks[b].position === 'last') {
            for(; i < pointsQty; i++){
              if(blocks[b].pointsOut[i].fi < 90 || blocks[b].pointsOut[i].fi > 270) {
                blocks[b].pointsOut[i].corner = checkPointXCorner(blocks[b].pointsOut, (pointsQty-1), i);
              }
            }
          }

        }
      }

    }


    function checkPointXCorner(points, last, curr) {
      if(curr === 0) {
        if(points[last].type !== 'arc' && points[curr].type === 'frame' && points[curr+1].type !== 'arc') {
          return 1;
        } else {
          return 0;
        }
      } else if(curr === last) {
        if(points[curr-1].type !== 'arc' && points[curr].type === 'frame' && points[0].type !== 'arc') {
          return 1;
        } else {
          return 0;
        }
      } else {
        if(points[curr-1].type !== 'arc' && points[curr].type === 'frame' && points[curr+1].type !== 'arc') {
          return 1;
        } else {
          return 0;
        }
      }
    }




    function copyPointsOut(pointsArr, label) {
      var newPointsArr = angular.copy(pointsArr),
          newPointsQty = newPointsArr.length;
      while(--newPointsQty > -1) {
        newPointsArr[newPointsQty].type = label;
      }
      return newPointsArr;
    }




    function setOpenDir(direction, beadLines) {
      var parts = [],
          newPoints = preparePointsXMaxMin(beadLines),
          center = centerBlock(newPoints),
//          dim = GeneralServ.getMaxMinCoord(newPoints),
//          center = {
//            x: (dim.minX + dim.maxX)/2,
//            y: (dim.minY + dim.maxY)/2
//          },
          dirQty = direction.length;
//      console.log('DIR line===', beadLines);
//      console.log('DIR newPoints===', newPoints);
//      console.log('DIR geomCenter===', geomCenter);

      for(var index = 0; index < dirQty; index++) {
        var part = {
          type: 'sash-dir',
          points: []
        };

        switch(direction[index]) {
          //----- 'up'
          case 1:
            part.points.push(getCrossPointSashDir(1, center, 225, beadLines), getCrossPointSashDir(3, center, 90, beadLines), getCrossPointSashDir(1, center, 315, beadLines));
            break;
          //----- 'right'
          case 2:
            part.points.push(getCrossPointSashDir(2, center, 225, beadLines), getCrossPointSashDir(4, center, 180, beadLines), getCrossPointSashDir(2, center, 135, beadLines));
            break;
          //------ 'down'
          case 3:
            part.points.push(getCrossPointSashDir(3, center, 135, beadLines), getCrossPointSashDir(1, center, 270, beadLines), getCrossPointSashDir(3, center, 45, beadLines));
            break;
          //----- 'left'
          case 4:
            part.points.push(getCrossPointSashDir(4, center, 45, beadLines), getCrossPointSashDir(2, center, 180, beadLines), getCrossPointSashDir(4, center, 315, beadLines));
            break;
        }
        parts.push(part);
      }

      return parts;
    }


    function preparePointsXMaxMin(lines) {
      var points = [],
          linesQty = lines.length;
      for(var l = 0; l < linesQty; l++) {
        if(lines[l].dir === 'curv') {
          var t = 0.5,
              peak = {}, ind0, ind1 = l, ind2;
          if(l === 0) {
            ind0 = linesQty - 1;
            ind2 = l + 1;
          } else if(l === (linesQty - 1)) {
            ind0 = l - 1;
            ind2 = 0;
          } else {
            ind0 = l - 1;
            ind2 = l + 1;
          }
          peak.x = getCoordCurveByT(lines[ind0].to.x, lines[ind1].to.x, lines[ind2].to.x, t);
          peak.y = getCoordCurveByT(lines[ind0].to.y, lines[ind1].to.y, lines[ind2].to.y, t);
          points.push(peak);
        } else {
          points.push(lines[l].to);
        }
      }
      return points;
    }


    function getCrossPointSashDir(position, centerGeom, angel, lines) {
      var sashDirVector = cteateLineByAngel(centerGeom, angel);
      var crossPoints = getCrossPointInBlock(position, sashDirVector, lines);
//      console.log('DIR new coord----------', crossPoints);
      return crossPoints;
    }


    function cteateLineByAngel(center, angel) {
//      console.log(angel);
      var k =  Math.tan(angel * Math.PI / 180),
          lineMark = {
            center: center,
            coefA: k,
            coefB: -1,
            coefC: (center.y - k*center.x)
          };
      return lineMark;
    }


    function getCrossPointInBlock(position, vector, lines) {
      var linesQty = lines.length;
//      console.log('lines @@@@@@', lines);
      for(var l = 0; l < linesQty; l++) {
        var coord, isInside, isCross, intersect;
//        console.log('DIR line ++++', lines[l]);

        coord = getCoordCrossPoint(vector, lines[l]);
        if(coord.x >= 0 && coord.y >= 0) {

          //------ checking is cross point inner of line
          isInside = checkLineOwnPoint(coord, lines[l].to, lines[l].from);
          isCross = isInsidePointInLine(isInside);
          if(isCross) {
            if(lines[l].dir === 'curv') {
              intersect = getIntersectionInCurve(l, linesQty, lines, vector.center, coord);
              if(intersect.length) {
                coord.x = intersect[0].x;
                coord.y = intersect[0].y;
              }
            }

            coord.fi = getAngelPoint(vector.center, coord);
            if(position) {
              switch(position) {
                case 1:
                  if(coord.fi > 180) {
                    return coord;
                  }
                  break;
                case 2:
                  if(coord.fi > 90 && coord.fi < 270) {
                    return coord;
                  }
                  break;
                case 3:
                  if(coord.fi < 180) {
                    return coord;
                  }
                  break;
                case 4:
                  if(coord.fi > 270 || coord.fi < 90) {
                    return coord;
                  }
                  break;
              }
            } else {
              return coord;
            }
          }
        }
      }
    }




    function getIntersectionInCurve(i, linesQty, lines, vector, coord) {
      var p1, p2, p3, l1, l2, index;

      if (lines[i].from.id.indexOf('q') + 1) {
        index = i - 1;
        if (!lines[index]) {
          index = linesQty - 1;
        }
        p1 = lines[index].from;
        p2 = lines[i].from;
        p3 = lines[i].to;
      } else if (lines[i].to.id.indexOf('q') + 1) {
        index = i + 1;
        if (!lines[index]) {
          index = 0;
        }
        p1 = lines[i].from;
        p2 = lines[i].to;
        p3 = lines[index].to;
      }

      l1 = vector;
      l2 = coord;
      //--------- calc the intersections
      return intersectionQ(p1, p2, p3, l1, l2);
    }


    function intersectionQ(p1, p2, p3, a1, a2) {
      var intersections = [],
          //------- inverse line normal
          normal = {
            x: a1.y-a2.y,//coefA
            y: a2.x-a1.x//coefB
          },
          //------- Q-coefficients
          c2 = {
            x: p1.x - 2*p2.x + p3.x,
            y: p1.y - 2*p2.y + p3.y
          },
          c1 = {
            x: 2*(p2.x - p1.x),
            y: 2*(p2.y - p1.y)
          },
          c0 = {
            x: p1.x,
            y: p1.y
          },
          //--------- Transform to line
          coefficient = a1.x*a2.y - a2.x*a1.y,//coefC
          roots = [],
          a, b, c, d;

      if(Math.abs(normal.x) === Math.abs(normal.y)) {
        a = Math.abs(normal.x*c2.x) + Math.abs(normal.y*c2.y);
        //------ if line is vert or horisontal
      } else if(!Math.abs(normal.x)) {
        a = c2.x + normal.y*c2.y;
      } else if(!Math.abs(normal.y)) {
        a = normal.x*c2.x + c2.y;
      } else {
        a = normal.x*c2.x + normal.y*c2.y;
      }

      b = (normal.x*c1.x + normal.y*c1.y)/a ;
      c = (normal.x*c0.x + normal.y*c0.y + coefficient)/a;
      d = (b*b - 4*c);

//        console.log('normal ++++',normal);
//        console.log('c1 ++++',c1);
//      console.log('c2 ++++',c2);
//      console.log('c0 ++++',c0);
//        console.log('a ++++',a);
//        console.log('b ++++',b);
//        console.log('c ++++',c);
//        console.log('d ++++',d);
      // solve the roots
      if(d > 0) {
        var delta = Math.sqrt(d);
//        console.log('delta ++++', b, delta);
        roots.push( GeneralServ.roundingValue( (-b + delta)/2 ), GeneralServ.roundingValue( (-b - delta)/2 ) );
//        roots.push( (-b + delta)/2 );
//        roots.push( (-b - delta)/2 );
      } else if(d === 0) {
        roots.push( GeneralServ.roundingValue( -b/2 ) );
//        roots.push( -b/2 );
      }
//TODO проблема с точкой пересечения
//      console.log('t++++',roots);

      //---------- calc the solution points
      for(var i=0; i<roots.length; i++) {
        var t = roots[i];

        //    if(t >= 0 && t <= 1) {
        if(t > 0 && t < 1) {
          // possible point -- pending bounds check
          var point = {
                t: t,
                x: getCoordCurveByT(p1.x, p2.x, p3.x, t),
                y: getCoordCurveByT(p1.y, p2.y, p3.y, t)
              },
              minX = Math.min(a1.x, a2.x, p1.x, p2.x, p3.x),
              minY = Math.min(a1.y, a2.y, p1.y, p2.y, p3.y),
              maxX = Math.max(a1.x, a2.x, p1.x, p2.x, p3.x),
              maxY = Math.max(a1.y, a2.y, p1.y, p2.y, p3.y);
          //---------- bounds checks
//          console.log('t++++',point);
          if(a1.x === a2.x && point.y >= minY && point.y <= maxY){
            //-------- vertical line
            intersections.push(point);
          } else if(a1.y === a2.y && point.x >= minX && point.x <= maxX){
            //-------- horizontal line
            intersections.push(point);
          } else if(point.x >= minX && point.y >= minY && point.x <= maxX && point.y <= maxY){
            //--------- line passed bounds check
            intersections.push(point);
          }
        }
      }
//      console.log('~~~~~~~intersections ===', intersections);
      return intersections;
    }


    //---------- linear interpolation utility
    function getCoordCurveByT(P0, P1, P2, t) {
      return GeneralServ.roundingValue( (t*t*(P0 - 2*P1 + P2) - 2*t*(P0 - P1) + P0) );
    }



    function setSashePropertyXPrice(sashType, openDir, hardwareLines, priceElements) {
      var tempSashBlock = {
            sizes: [],
            openDir: openDir,
            type: sashType
          },
          hardwareQty = hardwareLines.length;
      while(--hardwareQty > -1) {
        tempSashBlock.sizes.push(hardwareLines[hardwareQty].size);
      }
      priceElements.sashesBlock.push(tempSashBlock);
    }



    //---------- for impost


    function setImpostParts(points, priceElements) {
      var pointsType = points[0].type,
          pointsQty = points.length,
          part = {
            type: pointsType,
            dir: 'line'
          };
      //------ if impost is line
      if(pointsQty === 4) {
        var center = centerBlock(points);
        part.points = sortingPoints(points, center);
      //------- if impost is curve
      } else if(pointsQty === 6){
        part.dir = 'curv';
//        console.log('-----------IMPOST Q -----------', points);
        part.points = sortingQImpostPoints(points);
      }
      part.path = assamblingPath(part.points);

      //------- culc length
      var sizePoints = sortingImpPXSizes(pointsQty, part.points);
      part.size = culcLength(sizePoints);

      //------- for Price
      //----- converting size from mm to m
      var sizeValue = GeneralServ.roundingValue(angular.copy(part.size)/1000, 3);

      if(pointsType === 'impost') {
        priceElements.impostsSize.push(sizeValue);
      } else if(pointsType === 'shtulp') {
        priceElements.shtulpsSize.push(sizeValue);
      }

      return part;
    }



    function sortingQImpostPoints(points) {
      var newPoints = [],
          pointsLeft = [],
          pointsRight = [],
          impLineP1, impLineP2,
          pointsQty = points.length;
      for(var i = 0; i < pointsQty; i++) {
        if(points[i].id.indexOf('qi')+1) {
          if(points[i].group) {
            impLineP2 = points[i];
          } else {
            impLineP1 = points[i];
          }
        }
      }
      for(var i = 0; i < pointsQty; i++) {
        if(points[i].id.indexOf('qi')+1) {
          continue;
        }
        var position = setPointLocationToLine(impLineP1, impLineP2, points[i]);
        if(position > 0) {
          pointsLeft.push(points[i]);
        } else {
          pointsRight.push(points[i]);
        }
      }
      for(var l = 0; l < pointsLeft.length; l++) {
        if(pointsLeft[l].group) {
          newPoints.unshift(pointsLeft[l]);
        } else {
          newPoints.push(pointsLeft[l]);
        }
      }
      newPoints.unshift(impLineP2);
      newPoints.push(impLineP1);
      for(var r = 0; r < pointsRight.length; r++) {
        if(pointsRight[r].group) {
          newPoints.unshift(pointsRight[r]);
        } else {
          newPoints.push(pointsRight[r]);
        }
      }
//      console.log('-----------IMPOST Q -----------', newPoints);
      return newPoints;
    }


    function sortingImpPXSizes(pointsQty, impPoints) {
      var newImpPoints = [];
      if(pointsQty === 4) {
        while(--pointsQty > -1) {
          if(impPoints[pointsQty].group) {
            newImpPoints.push(impPoints[pointsQty]);
          }
        }
      } else if(pointsQty === 6) {
        for(var i = 0; i < pointsQty; i++) {
          if(impPoints[i].group) {
            if(impPoints[i].id.indexOf('ip')+1 || impPoints[i].id.indexOf('sht')+1) {
              newImpPoints.push(impPoints[i]);
            }
          }
        }
        for(var i = 0; i < pointsQty; i++) {
          if(impPoints[i].group) {
            if(impPoints[i].id.indexOf('qi')+1) {
              newImpPoints.splice(1, 0, impPoints[i]);
            }
          }
        }
      }
      return newImpPoints;
    }




    function getCoordCrossPoint(line1, line2) {
      var base = (line1.coefA * line2.coefB) - (line2.coefA * line1.coefB),
          baseX = (line1.coefB * line2.coefC) - (line2.coefB * line1.coefC),
          baseY = (line2.coefA * line1.coefC) - (line1.coefA * line2.coefC),
          crossPoint = {
            x: GeneralServ.roundingValue( GeneralServ.roundingValue(baseX/base, 3) ),
            y: GeneralServ.roundingValue( GeneralServ.roundingValue(baseY/base, 3) )
          };
      if(crossPoint.x === -0) {
        crossPoint.x = 0;
      } else if(crossPoint.y === -0) {
        crossPoint.y = 0;
      }
      return crossPoint;
    }



    function checkLineOwnPoint(point, lineTo, lineFrom) {
      var check = {
        x: GeneralServ.roundingValue( ((point.x - lineTo.x)/(lineFrom.x - lineTo.x)) ),
        y: GeneralServ.roundingValue( ((point.y - lineTo.y)/(lineFrom.y - lineTo.y)) )
      };
      if(check.x === -Infinity) {
        check.x = Infinity;
      } else if(check.y === -Infinity) {
        check.y = Infinity;
      }
      if(check.x === -0) {
        check.x = 0;
      } else if(check.y === -0) {
        check.y = 0;
      }
      return check;
    }



    function getCenterLine(pointStart, pointEnd) {
      var center = {
        x: (pointStart.x + pointEnd.x)/2,
        y: (pointStart.y + pointEnd.y)/2
      };
      return center;
    }



    function collectAllPointsOut(blocks) {
      var points = [],
          blocksQty = blocks.length;

      while(--blocksQty > 0) {
        var pointsOutQty = blocks[blocksQty].pointsOut.length;
        if(pointsOutQty) {
          while(--pointsOutQty > -1) {
            points.push(angular.copy(blocks[blocksQty].pointsOut[pointsOutQty]));
          }
        }
      }
      //------ delete dublicates
      cleanDublicat(3, points);
      return points;
    }


    function cleanDublicat(param, arr) {
      var pQty = arr.length;
      while(--pQty > -1) {
        var pQty2 = arr.length,
            exist = 0;
        for(var i = 0; i < pQty2; i++) {
          switch(param) {
            case 1:
              if(arr[i].x === arr[pQty].x) {
                exist++;
              }
              break;
            case 2:
              if(arr[i].y === arr[pQty].y) {
                exist++;
              }
              break;
            case 3:
              if(arr[i].x === arr[pQty].x && arr[i].y === arr[pQty].y) {
                exist++;
              }
              break;
          }
        }
        if(exist > 1) {
          arr.splice(pQty, 1);
        }
      }
    }


    function cleanDublicatNoFP(param, points) {
//      console.log('points******** ', points);
      var pQty = points.length;

      while(--pQty > -1) {
        var pQty2 = points.length;

        while(--pQty2 > -1) {
          if(pQty !== pQty2) {
//            console.log('********', points[pQty], points[pQty2]);
            if(points[pQty] && points[pQty2]) {
              switch(param) {
                case 1:
                  if(points[pQty].x === points[pQty2].x) {
//                    if(points[pQty].type === 'frame' && points[pQty2].type === 'frame' || points[pQty].type === 'impost' && points[pQty2].type === 'frame') {
//                      delete points[pQty];
                      //                    points.splice(pQty, 1);
//                    } else
                    if ((points[pQty2].type === 'impost' || points[pQty2].type === 'shtulp') && (points[pQty].type === 'frame' || points[pQty].type === 'corner')) {
                      delete points[pQty2];
                      //                    points.splice(pQty2, 1);
                    } else {
                      delete points[pQty];
                    }
//                    console.log('***** delete');
                  }
                  break;
                case 2:
                  if(points[pQty].y === points[pQty2].y) {
//                    if(points[pQty].type === 'frame' && points[pQty2].type === 'frame' || points[pQty].type === 'impost' && points[pQty2].type === 'frame') {
//                      delete points[pQty];
                      //                    points.splice(pQty, 1);
//                    } else
                    if ((points[pQty2].type === 'impost' || points[pQty2].type === 'shtulp') && (points[pQty].type === 'frame' || points[pQty].type === 'corner')) {
                      //                    points.splice(pQty2, 1);
                      delete points[pQty2];
                    } else {
                      delete points[pQty];
                    }
//                    console.log('***** delete');
                  }
                  break;
              }
            }
          }

        }
      }
      return points.filter(function(item) {
        return (item) ? 1 : 0;
      })
    }


    function sortByX(a, b) {
      return a.x - b.x;
    }


    function sortByY(a, b) {
      return a.y - b.y;
    }


















    function initDimensions(blocks) {
      var dimension = {
            dimX: [],
            dimY: [],
            dimQ: []
          },
          blocksQty = blocks.length,
          maxSizeLimit = blocks[0].maxSizeLimit,
          globalLimitsX, globalLimitsY, allPoints;

//      console.log('----------------- START DIMENSION-----------------');
      //=========== All points ==============//
      allPoints = collectAllPointsOut(blocks);
      //------ except Q points
      allPoints = allPoints.filter(function (elem) {
        return (elem.dir === 'curv' || elem.t) ? 0 : 1;
      });

      globalLimitsX = angular.copy(allPoints);
      globalLimitsY = angular.copy(allPoints);
      //------ delete dublicates
      cleanDublicat(1, globalLimitsX);
      cleanDublicat(2, globalLimitsY);
      //---- sorting
      globalLimitsX.sort(sortByX);
      globalLimitsY.sort(sortByY);

//      console.log('``````````allPoints``````', allPoints);
//      console.log('``````````globalLimitsX``````', globalLimitsX);
//      console.log('``````````globalLimitsY``````', globalLimitsY);

      //========== on eah block ==========//

      for (var b = 1; b < blocksQty; b++) {

        var pointsOutQty = blocks[b].pointsOut.length;

//        console.log('+++++++++++BLOCKS+++++++++', blocks[b].id);


        //========== Global Dimension of Blocks level 1 ============//

        if (blocks[b].level === 1) {
          //          console.log('========= block 1===========');
          var globalDimX = [],
              globalDimY,
              arcHeights = [],
              overallDim = {w: 0, h: 0};

          for (var i = 0; i < pointsOutQty; i++) {
            if (blocks[b].pointsOut[i].id.indexOf('fp') + 1) {
              globalDimX.push(blocks[b].pointsOut[i]);
            } else if(blocks[b].pointsOut[i].id.indexOf('qa') + 1) {
              arcHeights.push(blocks[b].pointsOut[i]);
            }
          }
          globalDimY = angular.copy(globalDimX);
          //------ delete dublicates
          cleanDublicat(1, globalDimX);
          cleanDublicat(2, globalDimY);
          //---- sorting
          globalDimX.sort(sortByX);
          globalDimY.sort(sortByY);

//          console.log('``````````globalDimX ``````', globalDimX);
//          console.log('``````````globalDimY ``````', globalDimY);
//          console.log('``````````heightArcX ``````', arcHeights);

          //          console.log('``````````Create dim by X``````````');
          collectDimension(1, 'x', globalDimX, dimension.dimX, globalLimitsX, blocks[b].id, maxSizeLimit);
          //          console.log('``````````Create dim by Y``````````');
          collectDimension(1, 'y', globalDimY, dimension.dimY, globalLimitsY, blocks[b].id, maxSizeLimit);

          //------ collect dim for arc height
          createArcDim(1, blocks[b].id, arcHeights, dimension, blocks, blocksQty);

          //----------- collect Curver Radius
          if (blocks[b].pointsQ) {
            var curveQty = blocks[b].pointsQ.length;
            if (curveQty) {
              while (--curveQty > -1) {
                dimension.dimQ.push(blocks[b].pointsQ[curveQty]);
              }
            }
          }

          //--------- get Overall Dimension
//          console.log('for overall------', dimension.dimX, dimension.dimY);
          collectOverallDim(overallDim, dimension);
//          console.log('for overall finish ------', overallDim);


          overallDim.square = calcSquare(blocks[b].pointsOut);
          //--------- push Overall Dimension
          blocks[0].overallDim.push(overallDim);
        }



        //========= Dimension in Block without children ==========//

        if (!blocks[b].children.length) {
          var blockDimX = [],
              blockDimY,
              blockLimits = [];

          cleanPointsOutDim(blockDimX, blocks[b].pointsOut);
//          console.log('`````````` blockDimX ``````````', JSON.stringify(blockDimX));

          //-------- set block Limits
          //------ go to parent and another children for Limits
          for (var bp = 1; bp < blocksQty; bp++) {
            if (blocks[bp].id === blocks[b].parent) {
              var childQty = blocks[bp].children.length;
              //------- add parent pointsOut
              cleanPointsOutDim(blockLimits, blocks[bp].pointsOut);
              //------- add impost
              if(blocks[bp].impost) {
//                console.log('dimQ+++++++++', blocks[bp].impost, blocks[bp].impost.impostAxis[0], blocks[bp].impost.impostAxis[1]);
                if(!blocks[bp].impost.impostAxis[0].t) {
                  blockLimits.push(blocks[bp].impost.impostAxis[0]);
                }
                if(!blocks[bp].impost.impostAxis[1].t) {
                  blockLimits.push(blocks[bp].impost.impostAxis[1]);
                }

                //============ collect Curver Radius of impost
                if (blocks[bp].impost.impostAxis[2]) {
//                  console.log('dimQ+++++++++', blocks[bp].impost, blocks[bp].impost.impostAxis[2]);
                  dimension.dimQ.push(blocks[bp].impost.impostAxis[2]);
                }
              }
              //------- add imposts of childern
              while(--childQty > -1) {
                if(blocks[bp].children[childQty] !== blocks[b].id) {
                  getAllImpostDim(blockLimits, blocks[bp].children[childQty], blocksQty, blocks);
                }
              }
            }
          }

          blockLimits = angular.copy(allPoints);

//          console.log('`````````` blockLimits ``````````', blockLimits);
          blockDimY = angular.copy(blockDimX);


          //========== build Dimension

          if (blockDimX.length > 1) {
            //------ delete dublicates
//            cleanDublicat(1, blockDimX);
            blockDimX = cleanDublicatNoFP(1, blockDimX);
            //---- sorting
            blockDimX.sort(sortByX);
//            console.log('`````````` new dim X ``````````', blockDimX);
//            collectDimension(0, 'x', blockDimX, dimension.dimX, blockLimits, blocks[b].parent, maxSizeLimit);
            collectDimension(0, 'x', blockDimX, dimension.dimX, blockLimits, blocks[b].id, maxSizeLimit);
          }
          if (blockDimY.length > 1) {
            //------ delete dublicates
//            cleanDublicat(2, blockDimY);
            blockDimY = cleanDublicatNoFP(2, blockDimY);
            //---- sorting
            blockDimY.sort(sortByY);
//            console.log('`````````` new dim Y ``````````', blockDimY);
//            collectDimension(0, 'y', blockDimY, dimension.dimY, blockLimits, blocks[b].parent, maxSizeLimit);
            collectDimension(0, 'y', blockDimY, dimension.dimY, blockLimits, blocks[b].id, maxSizeLimit);
          }
        }

      }

      dimension.dimX = angular.copy(deleteDublicatDim(dimension.dimX));
      dimension.dimY = angular.copy(deleteDublicatDim(dimension.dimY));
      return dimension;
    }





    function createArcDim(level, currBlockId, arcDims, dimension, blocks, blocksQty) {
      var arcQty = arcDims.length;
      while(--arcQty > -1) {
        var dim = {
          blockId: currBlockId,
          level: level,
          dimId: arcDims[arcQty].id,
          minLimit: globalConstants.minRadiusHeight
        };
        //---------- find point Q in pointsQ
        for(var b = 1; b < blocksQty; b++) {
          if(blocks[b].level === 1) {
            if(blocks[b].pointsQ) {
              var pointsQQty = blocks[b].pointsQ.length;
              if(pointsQQty) {
                for(var q = 0; q < pointsQQty; q++) {
                  if(blocks[b].pointsQ[q].id === dim.dimId) {
                    //                    console.log('DIM HEIGHT ARC pointsQ ------------', blocks[b].pointsQ[q]);
                    switch(blocks[b].pointsQ[q].positionQ) {
                      case 1:
                        dim.axis = 'y';
                        dim.from = angular.copy(blocks[b].pointsQ[q].startY);
                        dim.to = angular.copy(blocks[b].pointsQ[q].midleY);
                        break;
                      case 2:
                        dim.axis = 'x';
                        dim.from = angular.copy(blocks[b].pointsQ[q].midleX);
                        dim.to = angular.copy(blocks[b].pointsQ[q].startX);
                        break;
                      case 3:
                        dim.axis = 'y';
                        dim.from = angular.copy(blocks[b].pointsQ[q].midleY);
                        dim.to = angular.copy(blocks[b].pointsQ[q].startY);
                        break;
                      case 4:
                        dim.axis = 'x';
                        dim.from = angular.copy(blocks[b].pointsQ[q].startX);
                        dim.to = angular.copy(blocks[b].pointsQ[q].midleX);
                        break;
                    }
                    dim.text = GeneralServ.roundingValue( angular.copy(blocks[b].pointsQ[q].heightQ), 1 );
                    dim.maxLimit = blocks[b].pointsQ[q].lengthChord/4;
                  }
                }
              }
            }
          }
        }
        //        console.log('DIM HEIGHT ARC finish ------------', dim);
        if(dim.axis === 'x') {
          dimension.dimX.push(dim);
        } else {
          dimension.dimY.push(dim);
        }
      }
    }



    function collectOverallDim(overallDim, dimension) {
      var dimXQty = dimension.dimX.length,
          dimYQty = dimension.dimY.length;
      while(--dimXQty > -1) {
        if(dimension.dimX[dimXQty].level) {
          overallDim.w += dimension.dimX[dimXQty].text;
        }
      }
      while(--dimYQty > -1) {
        if(dimension.dimY[dimYQty].level) {
          overallDim.h += dimension.dimY[dimYQty].text;
        }
      }
    }



    function cleanPointsOutDim(result, points) {
      var pQty = points.length;
      while(--pQty > -1) {
        if(points[pQty].t || points[pQty].dir === 'curv' || (points[pQty].id.indexOf('fp')+1 && !points[pQty].view)){
//TODO        if(points[pQty].dir === 'curv' || (points[pQty].id.indexOf('fp')+1 && !points[pQty].view)){
          continue;
        } else {
          result.push(points[pQty]);
        }
      }
    }




    function getAllImpostDim(blockLimits, childBlockId, blocksQty, blocks) {
      for(var i = 1; i < blocksQty; i++) {
        if(blocks[i].id === childBlockId) {
          if(blocks[i].children.length) {
            if(!blocks[i].impost.impostAxis[0].t) {
              blockLimits.push(blocks[i].impost.impostAxis[0]);
            }
            if(!blocks[i].impost.impostAxis[1].t) {
              blockLimits.push(blocks[i].impost.impostAxis[1]);
            }
            getAllImpostDim(blockLimits, blocks[i].children[0], blocksQty, blocks);
            getAllImpostDim(blockLimits, blocks[i].children[1], blocksQty, blocks);
          }
        }
      }
    }




    function deleteDublicatDim(dimension) {
      var dimXLevel1 = dimension.filter(function(item) {
            return item.level === 1;
          }),
          dimXLevel1Qty = dimXLevel1.length,
          dimX = dimension.filter(function(item) {
            var count = 0;
            for(var d = 0; d < dimXLevel1Qty; d++) {
              if(!item.level && item.from === dimXLevel1[d].from && item.to === dimXLevel1[d].to) {
                ++count;
              }
            }
            if(!count) {
              return 1;
            }
          });
//      console.log('````````````````````', dimX);
      return dimX;
    }




    function collectDimension(level, axis, pointsDim, dimension, limits, currBlockId, maxSizeLimit) {
      var dimQty = pointsDim.length - 1;
//      console.log('-------- points ---------', JSON.stringify(pointsDim));
      for(var d = 0; d < dimQty; d++) {
        //----- not create global dim in block level 0
        if(!level && d+1 === dimQty && (pointsDim[d+1].type === 'frame' || pointsDim[d+1].type === 'corner')) {
          continue;
        } else {
//          console.log('````````````````````', pointsDim[d], pointsDim[d+1]);
          dimension.push(createDimObj(level, axis, d, d+1, pointsDim, limits, currBlockId, maxSizeLimit));
        }
      }
    }



    function createDimObj(level, axis, index, indexNext, blockDim, limits, currBlockId, maxSizeLimit) {
//      console.log('FINISH current point---------', blockDim[index], blockDim[indexNext]);
      var dim = {
            blockId: currBlockId,
            level: level,
            axis: axis,
            dimId: blockDim[indexNext].id,
            from: (axis === 'x') ? angular.copy(blockDim[index].x) : angular.copy(blockDim[index].y),
            to: (axis === 'x') ? angular.copy(blockDim[indexNext].x) : angular.copy(blockDim[indexNext].y)
          },
          currLimit;

      dim.text = GeneralServ.roundingValue( Math.abs(dim.to - dim.from), 1 );

//      console.log('FINISH limits---------', dim, limits);

      //=========== set Limints
      //-------- for global
      if(level) {
//                console.log('FINISH global---------');
        currLimit = setLimitsGlobalDim(dim, limits, maxSizeLimit);
      } else {
        //-------- for block
        //        console.log('FINISH block---------');
        currLimit = setLimitsDim(axis, blockDim[indexNext], dim.from, limits, maxSizeLimit);
      }
      dim.minLimit = currLimit.minL;
      dim.maxLimit = currLimit.maxL;

//      console.log('---------------DIM FINISH ------------');
      return dim;
    }



    function setLimitsGlobalDim(dim, limits, maxSizeLimit) {
      var dimLimit = {},
          limitsQty = limits.length;
      for(var i = 0; i < limitsQty; i++) {
        if(dim.axis === 'x') {
          if(limits[i].x === dim.to) {
            dimLimit.minL = (limits[i-1]) ? GeneralServ.roundingValue( (limits[i-1].x + globalConstants.minSizeLimit), 1 ) : globalConstants.minSizeLimit;
            dimLimit.maxL = (limits[i+1]) ? GeneralServ.roundingValue( (limits[i+1].x - dim.from - globalConstants.minSizeLimit), 1 ) : maxSizeLimit;
          }
        } else {
          if(limits[i].y === dim.to) {
            dimLimit.minL = (limits[i-1]) ? GeneralServ.roundingValue( (limits[i-1].y + globalConstants.minSizeLimit), 1 ) : globalConstants.minSizeLimit;
            dimLimit.maxL = (limits[i+1]) ? GeneralServ.roundingValue( (limits[i+1].y - dim.from - globalConstants.minSizeLimit), 1 ) : maxSizeLimit;
          }
        }
      }
      return dimLimit;
    }








    function setLimitsDim(axis, pointDim, startDim, limits, maxSizeLimit) {
//      console.log('!!!!!!!!! DIM LIMITS ------------', axis, pointDim, startDim, limits, maxSizeLimit);
      var dimLimit = {},
          //------ set new Limints by X or Y
          currLimits = setNewLimitsInBlock(axis, pointDim, limits),
//          currLimits = limits,
          currLimitsQty = currLimits.length;

//      console.log('!!!!!!!!! DIM NEW LIMITS ------------', currLimits);

      for(var i = 0; i < currLimitsQty; i++) {

        //---- find left second imp point
        var isSecondImpP = 0;

        for(var s = 0; s < currLimitsQty; s++) {
          if(currLimits[s].id === pointDim.id){
            var difX = pointDim.x - currLimits[s].x,
                difY = pointDim.y - currLimits[s].y;
            if(axis === 'x' && difX > 0) {
              isSecondImpP = 1;
            } else if(axis === 'y' && difY > 0){
              isSecondImpP = 1;
            }
          }
        }


//        console.log('!!!!!!!!! DIM  isSecondImpP------------', isSecondImpP, pointDim);
        if(axis === 'x') {
          if(currLimits[i].x === pointDim.x) {
            if(currLimits[i-1]) {

              if(isSecondImpP) {
                //----- second impP last
                if(pointDim.id === currLimits[i-1].id) {
                  dimLimit.minL = globalConstants.minSizeLimit;
                } else {
                  dimLimit.minL = GeneralServ.roundingValue( (pointDim.x - currLimits[i-1].x - globalConstants.minSizeLimit), 1 );
                }
              } else {
//                dimLimit.minL = GeneralServ.rounding10( (currLimits[i-1].x + globalConstants.minSizeLimit) );
                dimLimit.minL = globalConstants.minSizeLimit;
              }

            } else {
              dimLimit.minL = globalConstants.minSizeLimit;
            }
//            dimLimit.maxL = (currLimits[i+1]) ? GeneralServ.rounding10( (currLimits[i+1].x - startDim - globalConstants.minSizeLimit) ) : maxSizeLimit;
            dimLimit.maxL = (currLimits[i+1]) ? GeneralServ.roundingValue( ((pointDim.x - startDim) + (currLimits[i+1].x - pointDim.x - globalConstants.minSizeLimit)), 1 ) : maxSizeLimit;
          }
        } else {
          if(currLimits[i].y === pointDim.y) {
            if(currLimits[i-1]) {

              if(isSecondImpP) {
                //----- second impP last
                if(pointDim.id === currLimits[i-1].id) {
                  dimLimit.minL = globalConstants.minSizeLimit;
                } else {
                  dimLimit.minL = GeneralServ.roundingValue( (pointDim.y - currLimits[i-1].y - globalConstants.minSizeLimit), 1 );
                }
              } else {
//                dimLimit.minL = GeneralServ.rounding10( (currLimits[i-1].y + globalConstants.minSizeLimit) );
                dimLimit.minL = globalConstants.minSizeLimit;
              }

            } else {
              dimLimit.minL = globalConstants.minSizeLimit;
            }
//            console.log(pointDim.y, startDim, currLimits[i+1].y, pointDim.y, globalConstants.minSizeLimit);
            dimLimit.maxL = (currLimits[i+1]) ? GeneralServ.roundingValue( ((pointDim.y - startDim) + (currLimits[i+1].y - pointDim.y - globalConstants.minSizeLimit)), 1 ) : maxSizeLimit;
          }
        }
      }
      return dimLimit;
    }






    function setNewLimitsInBlock(axis, pointDim, limits) {
      var currLimits = [],
          limitsQty = limits.length,
          lim = 0;

      if(axis === 'x') {
        for(; lim < limitsQty; lim++) {
          if(pointDim.y === limits[lim].y || limits[lim].id.indexOf('fp')+1) {
            currLimits.push(limits[lim]);
          }
        }
        //------ delete dublicates
        cleanDublicat(1, currLimits);
        //---- sorting
        currLimits.sort(sortByX);

      } else {
        for(; lim < limitsQty; lim++) {
          if (pointDim.x === limits[lim].x || limits[lim].id.indexOf('fp')+1) {
            currLimits.push(limits[lim]);
          }
        }
        //------ delete dublicates
        cleanDublicat(2, currLimits);
        //---- sorting
        currLimits.sort(sortByY);
      }

      return currLimits;
    }
















    function checkInsidePointInLineEasy(isInside) {
      var exist = 0;
      if(isInside.x === Infinity || isInside.y === Infinity) {
        exist = 0;
      } else if(isInside.x >= 0 && isInside.x <= 1 && isInside.y >= 0 && isInside.y <= 1) {
        exist = 1;
      } else if(isNaN(isInside.x) && isInside.y >= 0 && isInside.y <= 1) {
        exist = 1;
      } else if(isInside.x >= 0 && isInside.x <= 1  && isNaN(isInside.y)) {
        exist = 1;
      }
      return exist;
    }





    function setRadiusCoordXCurve(pointQ, P0, QP, P1) {
      pointQ.startX = getCoordCurveByT(P0.x, QP.x, P1.x, 0.5);
      pointQ.startY = getCoordCurveByT(P0.y, QP.y, P1.y, 0.5);
      pointQ.lengthChord = GeneralServ.roundingValue( Math.hypot((P1.x - P0.x), (P1.y - P0.y)) );
      pointQ.radius = culcRadiusCurve(pointQ.lengthChord, pointQ.heightQ);
      pointQ.radiusMax = culcRadiusCurve(pointQ.lengthChord, pointQ.lengthChord/4);
      pointQ.radiusMin = culcRadiusCurve(pointQ.lengthChord, globalConstants.minRadiusHeight);
    }


    function culcRadiusCurve(lineLength, heightQ) {
      return Math.round( (heightQ/2 + (lineLength*lineLength)/(8*heightQ)) );
    }



  }
})();
