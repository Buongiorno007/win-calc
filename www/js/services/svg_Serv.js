
// services/svg_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('SVGServ', designFactory);

  function designFactory($q) {

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
      QLineIntersections: QLineIntersections,
      cteateLineByAngel: cteateLineByAngel,
      getIntersectionInCurve: getIntersectionInCurve,
      getCoordCrossPoint: getCoordCrossPoint,
      checkLineOwnPoint: checkLineOwnPoint,
      isInsidePointInLine: isInsidePointInLine,
      getCoordSideQPCurve: getCoordSideQPCurve,
      checkEqualPoints: checkEqualPoints,
      setQPointCoord: setQPointCoord,
      getCenterLine: getCenterLine
    };

    return thisFactory.publicObj;




    //============ methods ================//


    function createSVGTemplate(sourceObj, depths) {
      console.log('------------------------------------------------------');
      console.log('svg start', new Date(), new Date().getMilliseconds());
      var thisObj = {},
          defer = $q.defer();
      //  thisObj.name = sourceObj.name;
      thisObj.details = angular.copy(sourceObj.details);

      var blocksQty = thisObj.details.length;


      for(var i = 0; i < blocksQty; i++) {

        //------ block 0
        if(thisObj.details[i].level === 0) {

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

        } else {

          console.log('+++++++++ block ID ++++++++++', thisObj.details[i].id);
          console.log('+++++++++ block ++++++++++', thisObj.details[i]);
          thisObj.details[i].center = centerBlock(thisObj.details[i].pointsOut);
          thisObj.details[i].pointsOut = sortingPoints(thisObj.details[i].pointsOut, thisObj.details[i].center);
          thisObj.details[i].linesOut = setLines(thisObj.details[i].pointsOut);
          if(thisObj.details[i].level === 1) {
            thisObj.details[i].pointsIn = setPointsIn(thisObj.details[i].linesOut, depths, 'frame');
          } else {
            thisObj.details[i].center = centerBlock(thisObj.details[i].pointsIn);
            thisObj.details[i].pointsIn = sortingPoints(thisObj.details[i].pointsIn, thisObj.details[i].center);
          }
          thisObj.details[i].linesIn = setLines(thisObj.details[i].pointsIn);


          if(thisObj.details[i].level === 1) {
            setCornerProp(thisObj.details);
            //------- set points for each part of construction
            $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].pointsOut, thisObj.details[i].pointsIn));
          }


          //-------- if block has children and type is sash
          if(thisObj.details[i].children.length) {

            if(thisObj.details[i].blockType === 'sash') {
              thisObj.details[i].sashPointsOut = copyPointsOut(setPointsIn(thisObj.details[i].linesIn, depths, 'sash-out'), 'sash');
              thisObj.details[i].sashLinesOut = setLines(thisObj.details[i].sashPointsOut);
              thisObj.details[i].sashPointsIn = setPointsIn(thisObj.details[i].sashLinesOut, depths, 'sash-in');
              thisObj.details[i].sashLinesIn = setLines(thisObj.details[i].sashPointsIn);

              thisObj.details[i].hardwarePoints = setPointsIn(thisObj.details[i].sashLinesOut, depths, 'hardware');
              thisObj.details[i].hardwareLines = setLines(thisObj.details[i].sashPointsIn);

              $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].sashPointsOut, thisObj.details[i].sashPointsIn));

              //----- set openPoints for sash
              thisObj.details[i].sashOpenDir = setOpenDir(thisObj.details[i].openDir, thisObj.details[i].sashLinesIn);
            }

          //------- if block is empty
          } else {
            //------ if block is frame
            if(thisObj.details[i].blockType === 'frame') {
              thisObj.details[i].beadPointsOut = copyPointsOut(thisObj.details[i].pointsIn, 'bead');
              thisObj.details[i].beadLinesOut = setLines(thisObj.details[i].beadPointsOut);
              thisObj.details[i].beadPointsIn = setPointsIn(thisObj.details[i].beadLinesOut, depths, 'frame-bead');
              //          thisObj.details[i].beadLinesIn = setLines(thisObj.details[i].beadPointsIn);

              thisObj.details[i].glassPoints = setPointsIn(thisObj.details[i].beadLinesOut, depths, 'frame-glass');
              /*          thisObj.details[i].glassLines = setLines(thisObj.details[i].beadPointsIn);*/

              thisObj.details[i].parts.push(setGlass(thisObj.details[i].glassPoints));
              $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].beadPointsOut, thisObj.details[i].beadPointsIn));



            } else if(thisObj.details[i].blockType === 'sash') {
              thisObj.details[i].sashPointsOut = copyPointsOut(setPointsIn(thisObj.details[i].linesIn, depths, 'sash-out'), 'sash');
              thisObj.details[i].sashLinesOut = setLines(thisObj.details[i].sashPointsOut);
              thisObj.details[i].sashPointsIn = setPointsIn(thisObj.details[i].sashLinesOut, depths, 'sash-in');
              thisObj.details[i].sashLinesIn = setLines(thisObj.details[i].sashPointsIn);

              thisObj.details[i].hardwarePoints = setPointsIn(thisObj.details[i].sashLinesOut, depths, 'hardware');
              thisObj.details[i].hardwareLines = setLines(thisObj.details[i].sashPointsIn);

              thisObj.details[i].beadPointsOut = copyPointsOut(thisObj.details[i].sashPointsIn, 'bead');
              thisObj.details[i].beadLinesOut = setLines(thisObj.details[i].beadPointsOut);
              thisObj.details[i].beadPointsIn = setPointsIn(thisObj.details[i].beadLinesOut, depths, 'sash-bead');
              //------ for defined open directions of sash
              thisObj.details[i].beadLinesIn = setLines(thisObj.details[i].beadPointsIn);

              thisObj.details[i].glassPoints = setPointsIn(thisObj.details[i].beadLinesOut, depths, 'sash-glass');
              //          thisObj.details[i].glassLines = setLines(thisObj.details[i].beadPointsIn);

              $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].sashPointsOut, thisObj.details[i].sashPointsIn));
              thisObj.details[i].parts.push(setGlass(thisObj.details[i].glassPoints));
              $.merge(thisObj.details[i].parts, setParts(thisObj.details[i].beadPointsOut, thisObj.details[i].beadPointsIn));

              //----- set openPoints for sash
              thisObj.details[i].sashOpenDir = setOpenDir(thisObj.details[i].openDir, thisObj.details[i].beadLinesIn);
            }
          }
          setPointsXChildren(thisObj.details[i], thisObj.details, depths);
          //----- create impost parts
          if(thisObj.details[i].children.length) {
            thisObj.details[i].parts.push( setImpostParts(thisObj.details[i].impost.impostIn) );
          }

        }
      }

      console.log('END++++', thisObj.details);
      console.log('svg finish', new Date(), new Date().getMilliseconds());
      console.log('------------------------------------------------------');
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

    function setTemplateScale(dim, width, height, padding) {
      var windowW = width,
          windowH = height,
          scale, del;

      if(width === '100%') {
        windowW = window.innerWidth;
        windowH = window.innerHeight;
      }

      var windowS = windowW * windowH,
          templateS = (dim.maxX - dim.minX) * (dim.maxY - dim.minY);

      if(windowS < templateS) {
        scale = windowS/templateS;
        del = (templateS - windowS)/templateS ;
      } else {
        scale = templateS/windowS;
        del = (windowS - templateS)/windowS ;
      }
      scale = (scale * padding) + del/10;
      //          console.log('scale = ', scale);
      return scale;
    }


    //----------- TRANSLATE

    function setTemplatePosition(dim, width, height, scale) {
      var windowW = width,
          windowH = height;

      if(width === '100%') {
        windowW = window.innerWidth;
        windowH = window.innerHeight;
      }

      var position = {
        x: (windowW - (dim.minX + dim.maxX)*scale)/2,
        y: (windowH - (dim.minY + dim.maxY)*scale)/2
      };

      //          console.log('position = ', position);
      return position;
    }




    /////////////////////////////////////////////////////////////////////////////////////



    function centerBlock(points){
      var pointsQty = points.length,
          center = {
            x: points.reduce(function(sum, curr){
              return sum + curr.x;
            }, 0) / pointsQty,
            y: points.reduce(function(sum, curr){
              return sum + curr.y;
            }, 0) / pointsQty
          };
      return center;
    }



    function sortingPoints(points, center) {
      var pointsQty = points.length;

      for(var i = 0; i < pointsQty; i++) {
        points[i].fi = getAngelPoint(center, points[i]);
        //---- for curve impost
//        if(points[i].id.indexOf('qi')+1 && !points[i].group) {
//          points[i].fi = 360 - points[i].fi;
//        }
      }
      points.sort(function(a, b){
        return b.fi - a.fi;
      });
      return points;
    }



    function getAngelPoint(center, point) {
      var fi;
      fi = Math.atan2(center.y - point.y, point.x - center.x) * (180 / Math.PI);
      if(fi < 0) {
        fi += 360;
      }
      return fi;
    }



    function setLines(points) {
      var lines = [],
          pointsQty = points.length,
          i = 0;
      for(; i < pointsQty; i++) {
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
        line.type = setLineType(points[i].type, points[index].type);
        if(line.dir === 'line') {
          line.dir = (points[index].dir === 'curv') ? 'curv' : 'line';
        }
        line.size = Math.round(Math.hypot((line.to.x - line.from.x), (line.to.y - line.from.y)) * 100) / 100;
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



    function setLineType(from, to) {
      var type = '';
      if(from === to) {
        if(from === 'impost') {
          type = 'impost';
        } else {
          type = 'frame';
        }
      } else {
        type = 'frame';
      }
      return type;
    }




    function setPointsIn(lines, depths, group) {
      var pointsIn = [],
          linesQty = lines.length;

      for(var i = 0; i < linesQty; i++) {
        var newLine1 = {},
            newLine2 = {},
            crossPoint = {},
            index;

        newLine1 = angular.copy(lines[i]);
//        console.log('newLine1****', newLine1);
        newLine1.coefC = getNewCoefC(depths, newLine1, group);
//        console.log('coefC1****', newLine1.coefC);
        if(i === (linesQty - 1)) {
          index = 0;
        } else {
          index = i+1;
        }
        newLine2 = angular.copy(lines[index]);
        newLine2.coefC = getNewCoefC(depths, newLine2, group);
//        console.log('coefC2****', newLine2.coefC);
        crossPoint = getCrossPoint2Lines(newLine1, newLine2);
//        console.log('crossPoint****', crossPoint);
        pointsIn.push(crossPoint);
      }
      return pointsIn;
    }



    function getNewCoefC(depths, line, group) {
      var depth = 0, beadDepth = 20;
//      console.log('getNewCoefC group--------', group);
      switch(group) {
        case 'frame':
          if(line.type === 'frame') {
            depth = depths.frameDepth.c;
          } else if(line.type === 'impost') {
            depth = depths.impostDepth.c/2;
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

        case 'frame+sash':
          depth = depths.frameDepth.b + depths.sashDepth.c;
          break;
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

        var normal = {
          coefA: line1.coefB,
          coefB: -line1.coefA,
          coefC: (line1.coefA * line1.to.y - line1.coefB * line1.to.x)
        };
//        console.log('normal = ',  normal);
        coord = getCoordCrossPoint(line1, normal);
      } else {
        coord = getCoordCrossPoint(line1, line2);
      }
//        console.log('coord = ', coord);
      crossPoint.x = coord.x;
      crossPoint.y = coord.y;
      crossPoint.type = (line1.type === 'impost' || line2.type === 'impost') ? 'impost' : 'frame';
      crossPoint.dir = (line1.to.dir === 'curv') ? 'curv' : 'line';
//      crossPoint.id = line1.to.id + '-' + group;
      crossPoint.id = line1.to.id;
      crossPoint.view = 1;
      return crossPoint;
    }



    function checkParallel(line1, line2) {
      var k1 = Math.round( (line1.to.y - line1.from.y) / (line1.to.x - line1.from.x) ),
          k2 = Math.round( (line2.to.y - line2.from.y) / (line2.to.x - line2.from.x) );
      return (k1 === k2) ? 1 : 0;
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

console.log('-------------setPointsXChildren -----------');
        if(currBlock.blockType === 'sash') {
          pointsIn = angular.copy(currBlock.sashPointsIn);
          linesIn = currBlock.sashLinesIn;
        } else {
          pointsIn = angular.copy(currBlock.pointsIn);
          linesIn = currBlock.linesIn;
        }
        var linesInQty = linesIn.length;

        //-------- get indexes of children blocks
        for(var i = 0; i < blocksQty; i++) {
          if(blocks[i].id === currBlock.children[0]) {
            indexChildBlock1 = i;
          } else if(blocks[i].id === currBlock.children[1]) {
            indexChildBlock2 = i;
          }
        }

        //------- create 2 impost vectors
        var impVectorAx1 = {
              type: 'impost',
              from: impAx0,
              to: impAx1
            },
            impVectorAx2 = {
              type: 'impost',
              from: impAx1,
              to: impAx0
            };
        setLineCoef(impVectorAx1);
        setLineCoef(impVectorAx2);

        var impVector1 = angular.copy(impVectorAx1),
            impVector2 = angular.copy(impVectorAx2);

        impVector1.coefC = getNewCoefC(depths, impVector1, 'frame');
        impVector2.coefC = getNewCoefC(depths, impVector2, 'frame');
//        console.log('IMP from+++++', impVectorAx1.from);
//        console.log('IMP to+++++', impVectorAx1.to);
        //-------- finde cross points each impost vectors with lineIn of block
        for(var i = 0; i < linesInQty; i++) {
          getCPImpostInsideBlock(0, 0, i, linesInQty, linesIn, impVector1, impAx0, currBlock.impost.impostIn);
          getCPImpostInsideBlock(1, 0, i, linesInQty, linesIn, impVector2, impAx1, currBlock.impost.impostIn);
          getCPImpostInsideBlock(0, 1, i, linesInQty, linesIn, impVectorAx1, impAx0, currBlock.impost.impostOut, pointsIn);
        }

//        console.log('!!!!! impVector1 -----',0, impVector1);
//        console.log('!!!!! impVector2 -----',1, impVector2);

        //------- if curve impost
        if(impPointsQty === 3) {
          //----- make order for impostOut
          var impostOutQty = currBlock.impost.impostOut.length;
          for(var i = 0; i < impostOutQty; i++) {
            currBlock.impost.impostOut[i].fi = getAngelPoint(currBlock.center, currBlock.impost.impostOut[i]);
            currBlock.impost.impostAxis[i].fi = getAngelPoint(currBlock.center, currBlock.impost.impostAxis[i]);
          }
          if(currBlock.impost.impostOut[0].fi !== currBlock.impost.impostAxis[0].fi) {
            currBlock.impost.impostOut.reverse();
          }
          var impLineOut = {
            from: angular.copy(currBlock.impost.impostOut[0]),
            to: angular.copy(currBlock.impost.impostOut[1])
          };
          setLineCoef(impLineOut);
          //------ get Q point Axis of impost
          var impAxQ = setQPointCoord(currBlock.impost.impostAxis[2].positionQ, impLineOut, currBlock.impost.impostAxis[2].radius);
          impAxQ.type = 'impost';
          impAxQ.id = 'qi' + Number(currBlock.impost.impostOut[0].id.replace(/\D+/g, ""));
          impAxQ.dir = 'curv';
          if(!impLineOut.coefA && currBlock.impost.impostAxis[2].positionQ === 1) {
            impAxQ.y -= currBlock.impost.impostAxis[2].radius * 2;
          } else if(!impLineOut.coefB && currBlock.impost.impostAxis[2].positionQ === 4) {
            impAxQ.x -= currBlock.impost.impostAxis[2].radius * 2;
          }
          blocks[indexChildBlock1].pointsOut.push(angular.copy(impAxQ));
          blocks[indexChildBlock2].pointsOut.push(angular.copy(impAxQ));
//          console.log('!!!!! impAxQ -----', impAxQ);
//          console.log('!!!!! impostOut -----', currBlock.impost.impostOut);
          //----- find Q points Inner of impost
          getImpostQPIn(0, currBlock.impost.impostOut[0], currBlock.impost.impostOut[1], impAxQ, depths, currBlock.impost.impostIn);
          getImpostQPIn(1, currBlock.impost.impostOut[1], currBlock.impost.impostOut[0], impAxQ, depths, currBlock.impost.impostIn);
        }


        var impostAx = angular.copy(currBlock.impost.impostAxis);
        //------- insert pointsOut of parent block in pointsOut of children blocks
        collectPointsXChildBlock(impostAx, pointsOut, blocks[indexChildBlock1].pointsOut, blocks[indexChildBlock2].pointsOut);
        //------- insert impostOut of impost in pointsOut of children blocks
//        $.merge(blocks[indexChildBlock1].pointsOut, angular.copy(impostAx));
        for(var i = 0; i < 2; i++) {
          blocks[indexChildBlock1].pointsOut.push(angular.copy(impostAx[i]));
          blocks[indexChildBlock2].pointsOut.push(angular.copy(impostAx[i]));
        }

        //------- insert pointsIn of parent block in pointsIn of children blocks
        collectPointsXChildBlock(impostAx, pointsIn, blocks[indexChildBlock1].pointsIn, blocks[indexChildBlock2].pointsIn);
        //------- insert impostIn of impost in pointsIn of children blocks
        collectImpPointsXChildBlock(currBlock.impost.impostIn, blocks[indexChildBlock1].pointsIn, blocks[indexChildBlock2].pointsIn);

      }
    }



    function getCPImpostInsideBlock(group, markAx, i, linesInQty, linesIn, impVector, impAx, impostIn, pointsIn) {
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
//          console.log('intersect +++', intersect[0]);
          if (intersect.length) {
            ip.x = intersect[0].x;
            ip.y = intersect[0].y;
            if(markAx){
              setSideQPCurve(i, linesInQty, linesIn, intersect[0], pointsIn);
            }
          }
        }
        //              console.log('isCross +++', isCross);
        //              console.log('cur 1 ip++++', JSON.stringify(ip));
        var noExist = checkEqualPoints(ip, impostIn);
        if(noExist) {
          impostIn.push(angular.copy(ip));
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
      if (linesIn[i].from.id.indexOf('q') + 1) {
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
          impostQP2 = getCoordSideQPCurve(intersect.t, sideQP2, curvP2);

      sideQP1.x = impostQP1.x;
      sideQP1.y = impostQP1.y;
      sideQP2.x = impostQP2.x;
      sideQP2.y = impostQP2.y;

      //----- delete Q point parent
      var pQty = pointsIn.length;
      while(--pQty > -1) {
        if(pointsIn[pQty].id === sideQP1.id) {
          pointsIn.splice(pQty, 1);
        }
      }

//console.log('QQQQ--------', impostQP1, impostQP2);
      var noExist1 = checkEqualPoints(sideQP1, pointsIn);
      if(noExist1) {
        pointsIn.push(sideQP1);
      }
      var noExist2 = checkEqualPoints(sideQP2, pointsIn);
      if(noExist2) {
        pointsIn.push(sideQP2);
      }

    }



    function getImpostQPIn(group, imp1, imp2, qi, depths, impostIn) {
      var impVector1 = {
            type: 'impost',
            dir: 'curv',
            from: imp1,
            to: qi
          },
          impVector2 = {
            type: 'impost',
            dir: 'curv',
            from: qi,
            to: imp2
          };
//      console.log('!!!!! impVector1 -----', impVector1);
//      console.log('!!!!! impVector2 -----', impVector2);
      setLineCoef(impVector1);
      setLineCoef(impVector2);
      impVector1.coefC = getNewCoefC(depths, impVector1, 'frame');
      impVector2.coefC = getNewCoefC(depths, impVector2, 'frame');
      var coordCP = getCoordCrossPoint(impVector1, impVector2);
//      console.log('coordCP---------',group, coordCP);
      var impQP = angular.copy(qi);
      impQP.group = group;
      impQP.x = coordCP.x;
      impQP.y = coordCP.y;
      impostIn.push(impQP);
    }




    function collectPointsXChildBlock(impostVector, points, pointsBlock1, pointsBlock2) {
      var pointsQty = points.length;
//      console.log('collect----- points-----', points);
      //      console.log('POSITION impostVector[1]-----', impostVector[1]);
//      console.log('POSITION impostVector[0]-----', impostVector[0]);
//      console.log('POSITION impostVector[1]-----', impostVector[1]);
      for(var i = 0; i < pointsQty; i++) {
        //------- check pointsIn of parent block as to impost
        var position = setPointLocationToLine(impostVector[0], impostVector[1], points[i]);
//        console.log('POSITION p-----', points[i]);
//        console.log('POSITION position -----', position);
        //------ block right side
        if(position > 0) {
          var exist = 0;
          if(pointsBlock2.length) {
            exist = checkDoubleQPoints(points[i].id, pointsBlock2);
          }
          if(!exist) {
//            console.log('collect+++++pointsBlock2=', pointsBlock2);
            pointsBlock2.push(angular.copy(points[i]));
          }
        //------ block left side
        } else if(position < 0){
          var exist = 0;
          if(pointsBlock1.length) {
            exist = checkDoubleQPoints(points[i].id, pointsBlock1);
          }
          if(!exist) {
//            console.log('collect+++++pointsBlock1=', pointsBlock1);
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
        x: Math.round( ((1-t)*p0.x + t*p1.x) * 100)/100,
        y: Math.round( ((1-t)*p0.y + t*p1.y) * 100)/100
      };
      return qpi;
    }



    function setQPointCoord(side, line, dist) {
      var middle = getCenterLine(line.from, line.to),
          coordQP = {};
      if(!line.coefA || !line.coefB) {
        coordQP.x = Math.round(Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) ))) + middle.x;
        coordQP.y = Math.round(Math.sqrt( Math.pow(dist, 2) - Math.pow((coordQP.x - middle.x), 2)  )) + middle.y;
      } else {
        switch(side) {
          case 1:
            coordQP.y = middle.y - Math.round(Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) )));
            coordQP.x = middle.x - Math.round(Math.sqrt( Math.pow(dist, 2) - Math.pow((middle.y - coordQP.y), 2)  ));
            break;
          case 2:
            coordQP.y = middle.y - Math.round(Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) )));
            coordQP.x = Math.round(Math.sqrt( Math.pow(dist, 2) - Math.pow((coordQP.y - middle.y), 2)  )) + middle.x;
            break;
          case 3:
            coordQP.y = Math.round(Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) ))) + middle.y;
            coordQP.x = Math.round(Math.sqrt( Math.pow(dist, 2) - Math.pow((coordQP.y - middle.y), 2)  )) + middle.x;
            break;
          case 4:
            coordQP.y = Math.round(Math.sqrt( Math.pow(dist, 2) / ( 1 + ( Math.pow((line.coefB / line.coefA), 2) ) ))) + middle.y;
            coordQP.x = middle.x - Math.round(Math.sqrt( Math.pow(dist, 2) - Math.pow((middle.y - coordQP.y), 2)  ));
            break;
        }
      }
      coordQP.y = Math.round(coordQP.y * 100)/100;
      coordQP.x = Math.round(coordQP.x * 100)/100;
      return coordQP;
    }







    function setParts(pointsOut, pointsIn) {
      var newPointsOut = pointsOut.filter(function (item) {
        if(item.type === 'frame' && !item.view) {
          return false;
        } else {
          return true;
        }
      });

      var parts = [],
          pointsQty = newPointsOut.length;

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
          //------- if one point is 'curv' from both
          if(newPointsOut[index].dir === 'curv') {
            break;
          } else if(newPointsOut[0].dir === 'curv') {
            part.type = 'arc';
            part.points.push(newPointsOut[index]);
            part.points.push(newPointsOut[0]);
            part.points.push(newPointsOut[1]);
            part.points.push(pointsIn[1]);
            part.points.push(pointsIn[0]);
            part.points.push(pointsIn[index]);
            if(newPointsOut[index].type === 'corner' || newPointsOut[1].type === 'corner') {
              part.type = 'arc-corner';
            }
            part.dir = 'curv';
          } else {
            //-------- if line
            part.points.push(newPointsOut[index]);
            part.points.push(newPointsOut[0]);
            part.points.push(pointsIn[0]);
            if(newPointsOut[index].type === 'corner' || newPointsOut[0].type === 'corner') {
              part.type = 'corner';
            }
            part.points.push(pointsIn[index]);

          }
        } else {

          //------- if curv
          if(newPointsOut[index].dir === 'curv' || newPointsOut[index+1].dir === 'curv') {
            part.type = 'arc';
            part.points.push(newPointsOut[index]);
            part.points.push(newPointsOut[index+1]);
            if(newPointsOut[index+2]) {
              part.points.push(newPointsOut[index+2]);
              part.points.push(pointsIn[index+2]);
              if(newPointsOut[index].type === 'corner' || newPointsOut[index+2].type === 'corner') {
                part.type = 'arc-corner';
              }
            } else {
              part.points.push(newPointsOut[0]);
              part.points.push(pointsIn[0]);
              if(newPointsOut[index].type === 'corner' || newPointsOut[0].type === 'corner') {
                part.type = 'arc-corner';
              }
            }
            part.points.push(pointsIn[index+1]);
            part.points.push(pointsIn[index]);
            part.dir = 'curv';
            index++;
          } else {
            //-------- if line
            part.points.push(newPointsOut[index]);
            part.points.push(newPointsOut[index+1]);
            part.points.push(pointsIn[index+1]);
            if(newPointsOut[index].type === 'corner' || newPointsOut[index+1].type === 'corner') {
              part.type = 'corner';
            }
            part.points.push(pointsIn[index]);
          }

        }
        part.path = assamblingPath(part.points);
        //------- culc length
        part.size = culcLength(part.points);
        //    console.log(part);
        if(newPointsOut[index].type === 'bead') {
          part.type = 'bead';
        } else if(newPointsOut[index].type === 'sash') {
          part.type = 'sash';
        }

        parts.push(part);
      }

      return parts;
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
      if(pointQty === 4) {
        size = Math.round(Math.hypot((arrPoints[1].x - arrPoints[0].x), (arrPoints[1].y - arrPoints[0].y)) * 100) / 100;

        //--------- Curve
      } else if(pointQty === 6) {
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




    function setGlass(glassPoints) {
      var part = {
            type: 'glass',
            points: glassPoints,
            path: 'M ',
            square: 0
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
          size = Math.round(Math.hypot((points[indNext].x - points[p].x), (points[indNext].y - points[p].y)) * 100) / 100;
        }

        sizes.push(size);
      }

      return sizes;
    }




    function setCornerProp(blocks) {
      var blocksQty = blocks.length,
          b = 0;

      for(; b < blocksQty; b++) {
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
//          dim = getMaxMinCoord(newPoints),
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
            part.points.push(getCrossPointSashDir(1, center, 225, beadLines));
            part.points.push(getCrossPointSashDir(3, center, 90, beadLines));
            part.points.push(getCrossPointSashDir(1, center, 315, beadLines));
            break;
          //----- 'right'
          case 2:
            part.points.push(getCrossPointSashDir(2, center, 225, beadLines));
            part.points.push(getCrossPointSashDir(4, center, 180, beadLines));
            part.points.push(getCrossPointSashDir(2, center, 135, beadLines));
            break;
          //------ 'down'
          case 3:
            part.points.push(getCrossPointSashDir(3, center, 135, beadLines));
            part.points.push(getCrossPointSashDir(1, center, 270, beadLines));
            part.points.push(getCrossPointSashDir(3, center, 45, beadLines));
            break;
          //----- 'left'
          case 4:
            part.points.push(getCrossPointSashDir(4, center, 45, beadLines));
            part.points.push(getCrossPointSashDir(2, center, 180, beadLines));
            part.points.push(getCrossPointSashDir(4, center, 315, beadLines));
            break;
        }
        parts.push(part);
      }

      return parts;
    }




    function preparePointsXMaxMin(lines) {
      var points = [],
          linesQty = lines.length,
          l = 0;
      for(; l < linesQty; l++) {
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
//        console.log('DIR coord ++++', coord);
        if(coord.x >= 0 && coord.y >= 0) {

          //------ checking is cross point inner of line
          isInside = checkLineOwnPoint(coord, lines[l].to, lines[l].from);
//          console.log('^^^^^isInside^^^^', isInside);
          isCross = isInsidePointInLine(isInside);

          if(isCross) {
//          if(isInside.x >= 0 && isInside.x <= 1 || isInside.y >=0 && isInside.y <= 1) {

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
//                              console.log('p1 ------',p1);
//                              console.log('p2 ------',p2);
//                              console.log('p3 ------',p3);
//                              console.log('l1 ------',l1);
//                              console.log('l2 ------',l2);
      // calc the intersections
      return QLineIntersections(p1, p2, p3, l1, l2);
    }



    function QLineIntersections(p1, p2, p3, a1, a2) {
      var intersections = [],
          // inverse line normal
          normal = {
            x: a1.y-a2.y,
            y: a2.x-a1.x
          },
          // Q-coefficients
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
          // Transform to line
          coefficient = a1.x*a2.y - a2.x*a1.y,
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
//        console.log('delta ++++', delta);
        roots.push( Math.round((-b + delta)/2*100)/100 );
        roots.push( Math.round((-b - delta)/2*100)/100 );
//        roots.push( (-b + delta)/2 );
//        roots.push( (-b - delta)/2 );
      } else if(d === 0) {
        roots.push( Math.round(-b/2*100)/100 );
//        roots.push( -b/2 );
      }

//      console.log('t++++',roots);

      // calc the solution points
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
          // bounds checks
          if(a1.x === a2.x && point.y >= minY && point.y <= maxY){
            // vertical line
            intersections.push(point);
          } else if(a1.y === a2.y && point.x >= minX && point.x <= maxX){
            // horizontal line
            intersections.push(point);
          } else if(point.x >= minX && point.y >= minY && point.x <= maxX && point.y <= maxY){
            // line passed bounds check
            intersections.push(point);
          }
        }
      }
//      console.log('~~~~~~~intersections ===', intersections);
      return intersections;
    }



    // linear interpolation utility
    function getCoordCurveByT(P0, P1, P2, t) {
      return t*t*(P0 - 2*P1 + P2) - 2*t*(P0 - P1) + P0;
    }






    //---------- for impost


    function setImpostParts(points) {
      var pointsQty = points.length,
          part = {
            type: 'impost',
            dir: 'line'
          };
      //------ if impost is line
      if(pointsQty === 4) {
        var center = centerBlock(points);
        part.points = sortingPoints(points, center);
      //------- if impost is curve
      } else if(pointsQty === 6){
        part.dir = 'curv';
        console.log('-----------IMPOST Q -----------', points);
        part.points = sortingQImpostPoints(points);
      }
      part.path = assamblingPath(part.points);
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



    function getCoordCrossPoint(line1, line2) {
      var base = (line1.coefA * line2.coefB) - (line2.coefA * line1.coefB),
          baseX = (line1.coefB * (line2.coefC)) - (line2.coefB * (line1.coefC)),
          baseY = (line2.coefA * (line1.coefC)) - (line1.coefA * (line2.coefC)),
          crossPoint = {
            x: Math.round( (baseX/base)*100 )/100,
            y: Math.round( (baseY/base)*100 )/100
          };
      return crossPoint;
    }



    function checkLineOwnPoint(point, lineTo, lineFrom) {
      var check = {
        x: Math.round( (point.x - lineTo.x)/(lineFrom.x - lineTo.x)*100 )/100,
        y: Math.round( (point.y - lineTo.y)/(lineFrom.y - lineTo.y)*100 )/100
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
      while(--blocksQty > -1) {
        if(blocks[blocksQty].level) {
          var pointsOutQty = blocks[blocksQty].pointsOut.length;
          if(pointsOutQty) {
            while(--pointsOutQty > -1) {
              if($.inArray(blocks[blocksQty].pointsOut[pointsOutQty], points) === -1) {
                points.push(angular.copy(blocks[blocksQty].pointsOut[pointsOutQty]));
              }
            }
          }
        }
      }
      return points;
    }


  }
})();

