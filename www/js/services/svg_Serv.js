
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
      setTemplateScale: setTemplateScale,
      setTemplatePosition: setTemplatePosition,

      setPointsOut: setPointsOut,
      centerBlock: centerBlock,
      sortingPoints: sortingPoints,
      getAngelPoint: getAngelPoint,
      setLines: setLines,
      setLineCoef: setLineCoef,
//      getCoordCrossPointABS: getCoordCrossPointABS,
      setPointLocationToLine: setPointLocationToLine,
      QLineIntersections: QLineIntersections,
      cteateLineByAngel: cteateLineByAngel,
      getIntersectionInCurve: getIntersectionInCurve,
      getCoordCrossPoint: getCoordCrossPoint,
      checkLineOwnPoint: checkLineOwnPoint
    };

    return thisFactory.publicObj;




    //============ methods ================//


    function createSVGTemplate(sourceObj, depths) {
      console.log('svg start', new Date(), new Date().getMilliseconds());
      var thisObj = {},
          defer = $q.defer();
      //  thisObj.name = sourceObj.name;
      thisObj.details = JSON.parse( JSON.stringify(sourceObj.details) );
      //thisObj.dimentions = createDimentions(sourceObj);

      var blocksQty = thisObj.details.skylights.length;


      for(var i = 0; i < blocksQty; i++) {
        //------ block 0
        if(thisObj.details.skylights[i].level === 0) {

          var childQty = thisObj.details.skylights[i].children.length,
              b = 0;
          if(childQty === 1) {
            for(; b < blocksQty; b++) {
              if(thisObj.details.skylights[i].children[0] === thisObj.details.skylights[b].id) {
                thisObj.details.skylights[b].position = 'single';
              }
            }
          } else if(childQty > 1) {
            for(; b < blocksQty; b++) {
              if(thisObj.details.skylights[i].children[0] === thisObj.details.skylights[b].id) {
                thisObj.details.skylights[b].position = 'first';
              } else if(thisObj.details.skylights[i].children[childQty-1] === thisObj.details.skylights[b].id) {
                thisObj.details.skylights[b].position = 'last';
              }
            }
          }

        } else {
          console.log('block ID++++++++++', thisObj.details.skylights[i].id);
          if(thisObj.details.skylights[i].level === 1) {
            thisObj.details.skylights[i].pointsOut = setPointsOut(thisObj.details.skylights[i].pointsID, thisObj.details.points);
            thisObj.details.skylights[i].center = centerBlock(thisObj.details.skylights[i].pointsOut);
            thisObj.details.skylights[i].pointsOut = sortingPoints(thisObj.details.skylights[i].pointsOut, thisObj.details.skylights[i].center);
            thisObj.details.skylights[i].linesOut = setLines(thisObj.details.skylights[i].pointsOut);
            thisObj.details.skylights[i].pointsIn = setPointsIn(thisObj.details.skylights[i].linesOut, depths, 'frame');
          } else {
            thisObj.details.skylights[i].center = centerBlock(thisObj.details.skylights[i].pointsIn);
            thisObj.details.skylights[i].pointsIn = sortingPoints(thisObj.details.skylights[i].pointsIn, thisObj.details.skylights[i].center);
          }
          thisObj.details.skylights[i].linesIn = setLines(thisObj.details.skylights[i].pointsIn);
          //------- set Line Type, line coef === line frame
//          if(thisObj.details.skylights[i].level > 1) {
//            setLineTypeAsToFrames(thisObj.details.skylights[i].linesOut, thisObj.details.skylights);
//          }


          setPointsXChildren(thisObj.details.skylights[i], thisObj.details.skylights, thisObj.details.points, depths);

          if(thisObj.details.skylights[i].level === 1) {
            setCornerProp(thisObj.details.skylights);
            //------- set points for each part of construction
            $.merge(thisObj.details.skylights[i].parts, setParts(thisObj.details.skylights[i].pointsOut, thisObj.details.skylights[i].pointsIn));
          }


          //-------- if block has children and type is sash
          if(thisObj.details.skylights[i].children.length) {

            //----- create impost parts
            thisObj.details.skylights[i].parts.push( setImpostParts(thisObj.details.skylights[i].impost.impostIn) );

            if(thisObj.details.skylights[i].blockType === 'sash') {
              thisObj.details.skylights[i].sashPointsOut = copyPointsOut(setPointsIn(thisObj.details.skylights[i].linesIn, depths, 'sash-out'), 'sash');
              thisObj.details.skylights[i].sashLinesOut = setLines(thisObj.details.skylights[i].sashPointsOut);
              thisObj.details.skylights[i].sashPointsIn = setPointsIn(thisObj.details.skylights[i].sashLinesOut, depths, 'sash-in');
              thisObj.details.skylights[i].sashLinesIn = setLines(thisObj.details.skylights[i].sashPointsIn);

              thisObj.details.skylights[i].hardwarePoints = setPointsIn(thisObj.details.skylights[i].sashLinesOut, depths, 'hardware');
              thisObj.details.skylights[i].hardwareLines = setLines(thisObj.details.skylights[i].sashPointsIn);

//              thisObj.details.skylights[i].beadPointsOut = copyPointsOut(thisObj.details.skylights[i].sashPointsIn, 'bead');
//              thisObj.details.skylights[i].beadLinesOut = setLines(thisObj.details.skylights[i].beadPointsOut);
//              thisObj.details.skylights[i].beadPointsIn = setPointsIn(thisObj.details.skylights[i], depths, 'sash-bead');
//              //------ for defined open directions of sash
//              thisObj.details.skylights[i].beadLinesIn = setLines(thisObj.details.skylights[i].beadPointsIn);

              $.merge(thisObj.details.skylights[i].parts, setParts(thisObj.details.skylights[i].sashPointsOut, thisObj.details.skylights[i].sashPointsIn));

              //----- set openPoints for sash
              thisObj.details.skylights[i].sashOpenDir = setOpenDir(thisObj.details.skylights[i].openDir, thisObj.details.skylights[i].sashLinesIn);
            }

          //------- if block is empty
          } else {
            //------ if block is frame
            if(thisObj.details.skylights[i].blockType === 'frame') {
              thisObj.details.skylights[i].beadPointsOut = copyPointsOut(thisObj.details.skylights[i].pointsIn, 'bead');
              thisObj.details.skylights[i].beadLinesOut = setLines(thisObj.details.skylights[i].beadPointsOut);
              thisObj.details.skylights[i].beadPointsIn = setPointsIn(thisObj.details.skylights[i].beadLinesOut, depths, 'frame-bead');
              //          thisObj.details.skylights[i].beadLinesIn = setLines(thisObj.details.skylights[i].beadPointsIn);

              thisObj.details.skylights[i].glassPoints = setPointsIn(thisObj.details.skylights[i].beadLinesOut, depths, 'frame-glass');
              /*          thisObj.details.skylights[i].glassLines = setLines(thisObj.details.skylights[i].beadPointsIn);*/

              thisObj.details.skylights[i].parts.push(setGlass(thisObj.details.skylights[i].glassPoints));
              $.merge(thisObj.details.skylights[i].parts, setParts(thisObj.details.skylights[i].beadPointsOut, thisObj.details.skylights[i].beadPointsIn));



            } else if(thisObj.details.skylights[i].blockType === 'sash') {
              thisObj.details.skylights[i].sashPointsOut = copyPointsOut(setPointsIn(thisObj.details.skylights[i].linesIn, depths, 'sash-out'), 'sash');
              thisObj.details.skylights[i].sashLinesOut = setLines(thisObj.details.skylights[i].sashPointsOut);
              thisObj.details.skylights[i].sashPointsIn = setPointsIn(thisObj.details.skylights[i].sashLinesOut, depths, 'sash-in');
              thisObj.details.skylights[i].sashLinesIn = setLines(thisObj.details.skylights[i].sashPointsIn);

              thisObj.details.skylights[i].hardwarePoints = setPointsIn(thisObj.details.skylights[i].sashLinesOut, depths, 'hardware');
              thisObj.details.skylights[i].hardwareLines = setLines(thisObj.details.skylights[i].sashPointsIn);

              thisObj.details.skylights[i].beadPointsOut = copyPointsOut(thisObj.details.skylights[i].sashPointsIn, 'bead');
              thisObj.details.skylights[i].beadLinesOut = setLines(thisObj.details.skylights[i].beadPointsOut);
              thisObj.details.skylights[i].beadPointsIn = setPointsIn(thisObj.details.skylights[i].beadLinesOut, depths, 'sash-bead');
              //------ for defined open directions of sash
              thisObj.details.skylights[i].beadLinesIn = setLines(thisObj.details.skylights[i].beadPointsIn);

              thisObj.details.skylights[i].glassPoints = setPointsIn(thisObj.details.skylights[i].beadLinesOut, depths, 'sash-glass');
              //          thisObj.details.skylights[i].glassLines = setLines(thisObj.details.skylights[i].beadPointsIn);

              $.merge(thisObj.details.skylights[i].parts, setParts(thisObj.details.skylights[i].sashPointsOut, thisObj.details.skylights[i].sashPointsIn));
              thisObj.details.skylights[i].parts.push(setGlass(thisObj.details.skylights[i].glassPoints));
              $.merge(thisObj.details.skylights[i].parts, setParts(thisObj.details.skylights[i].beadPointsOut, thisObj.details.skylights[i].beadPointsIn));

              //----- set openPoints for sash
              thisObj.details.skylights[i].sashOpenDir = setOpenDir(thisObj.details.skylights[i].openDir, thisObj.details.skylights[i].beadLinesIn);
            }
          }
        }
      }

console.log('END++++', thisObj.details.skylights);
      console.log('svg finish', new Date(), new Date().getMilliseconds());
      defer.resolve(thisObj);
      return defer.promise;
    }






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






    function setTemplateScale(template, width, height, padding) {
      var dim = getMaxMinCoord(template.details.points),
          windowW = width,
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


    function setTemplatePosition(template, width, height, scale) {
      var dim = getMaxMinCoord(template.details.points),
          windowW = width,
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



    function setPointsOut(pointsId, points){
      var pointsQty = points.length,
          pointsIdQty = pointsId.length,
          pointsOut = [];

      for(var i = 0; i < pointsIdQty; i++) {
        for(var j = 0; j < pointsQty; j++) {
          if(pointsId[i] === points[j].id) {
            pointsOut.push( JSON.parse(JSON.stringify(points[j])) );
          }
        }
      }
      return pointsOut;
    }


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


    function setPointsXChildren(currBlock, blocks, points, depths) {
      if(currBlock.children.length) {
        var blocksQty = blocks.length,
            linesInQty = currBlock.linesIn.length,
            impostVector1, impostVector2,
            indexChildBlock1, indexChildBlock2;

        //------- set points for impostAxis
        currBlock.impost.impostAxis = setPointsOut(currBlock.impost.impostID, points);
        //------- create 2 impost vectors
        impostVector1 = {
          type: 'impost',
          from: currBlock.impost.impostAxis[0],
          to: currBlock.impost.impostAxis[1]
        };
        impostVector2 = {
          type: 'impost',
          from: currBlock.impost.impostAxis[1],
          to: currBlock.impost.impostAxis[0]
        };
        setLineCoef(impostVector1);
        setLineCoef(impostVector2);
        impostVector1.coefC = getNewCoefC(depths, impostVector1, 'frame');
        impostVector2.coefC = getNewCoefC(depths, impostVector2, 'frame');
        //-------- finde cross points each impost vectors with lineIn of block
        while(--linesInQty > -1) {
          var ip1 = angular.copy(currBlock.impost.impostAxis[0]),
              ip2 = angular.copy(currBlock.impost.impostAxis[1]),
              cp1, cp2, isInside1, isInside2;

          cp1 = getCoordCrossPoint(currBlock.linesIn[linesInQty], impostVector1);
          cp2 = getCoordCrossPoint(currBlock.linesIn[linesInQty], impostVector2);
          isInside1 = checkLineOwnPoint(cp1, currBlock.linesIn[linesInQty].to, currBlock.linesIn[linesInQty].from);
          isInside2 = checkLineOwnPoint(cp2, currBlock.linesIn[linesInQty].to, currBlock.linesIn[linesInQty].from);
          if(isInside1.x !== Infinity && isInside1.x >= 0 && isInside1.x <= 1 || isInside1.y !== Infinity && isInside1.y >=0 && isInside1.y <= 1) {
//            ip1.id += '-in';
            ip1.x = cp1.x;
            ip1.y = cp1.y;
            currBlock.impost.impostIn.push(ip1);
          }
          if(isInside2.x !== Infinity && isInside2.x >= 0 && isInside2.x <= 1 || isInside2.y !== Infinity && isInside2.y >=0 && isInside2.y <= 1) {
//            ip2.id += '-in';
            ip2.x = cp2.x;
            ip2.y = cp2.y;
            currBlock.impost.impostIn.push(ip2);
          }

        }
        console.log('---------------', currBlock.impost.impostIn);
        console.log('-+++++currBlock++++++++', currBlock);
        //-------- get indexes of children blocks
        for(var i = 0; i < blocksQty; i++) {
          if(blocks[i].id === currBlock.children[0]) {
            indexChildBlock1 = i;
          } else if(blocks[i].id === currBlock.children[1]) {
            indexChildBlock2 = i;
          }
        }

        //------- insert pointsIn of parent block in pointsIn of children blocks
        collectPointsInXChildBlock(1, currBlock.impost.impostAxis, currBlock.pointsIn, indexChildBlock1, indexChildBlock2, blocks);

        //------- insert impostIn of impost in pointsIn of children blocks
        collectPointsInXChildBlock(0, currBlock.impost.impostAxis, currBlock.impost.impostIn, indexChildBlock1, indexChildBlock2, blocks);

      }
    }


    function collectPointsInXChildBlock(param, impostVector, points, indexBlock1, indexBlock2, blocks) {
      var pointsQty = points.length;
      for(var i = 0; i < pointsQty; i++) {
        //------- check pointsIn of parent block as to impost
        var position = setPointLocationToLine(impostVector[0], impostVector[1], points[i]);
        //------ block right side
        if(position > 0) {
          var exist = 0;
          if(param && !i && blocks[indexBlock2].pointsIn.length) {
            exist = checkDoubleQPoints(points[i].id, blocks[indexBlock2].pointsIn);
          }
          if(!exist) {
            blocks[indexBlock2].pointsIn.push(points[i]);
          }
          //------ block left side
        } else if(position < 0){
          var exist = 0;
          if(param && !i && blocks[indexBlock2].pointsIn.length) {
            exist = checkDoubleQPoints(points[i].id, blocks[indexBlock1].pointsIn);
          }
          if(!exist) {
            blocks[indexBlock1].pointsIn.push(points[i]);
          }
        }
      }
    }


    function setPointLocationToLine(lineP1, lineP2, newP) {
      return (newP.x - lineP2.x)*(newP.y - lineP1.y)-(newP.y - lineP2.y)*(newP.x - lineP1.x);
    }


    function checkDoubleQPoints(newPointId, pointsIn) {
      console.log('-----------', newPointId, pointsIn);
      var isExist = 0,
          pointsInQty = pointsIn.length;
      if(pointsInQty){
        while(--pointsInQty > -1) {
          if(pointsIn[pointsInQty].id.slice(0,3) === newPointId.slice(0,3)) {
            if(pointsIn[pointsInQty].id.slice(0,3).indexOf('qa') + 1) {
              isExist = 1;
            }
          }
        }
      }
      return isExist;
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
        line.from = JSON.parse(JSON.stringify(points[i]));
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
        line.to = JSON.parse(JSON.stringify(points[index]));
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


//    function setLineTypeAsToFrames(currLines, blocks) {
//      var currLinesQty = currLines.length;
//      while(--currLinesQty > -1) {
//        var blocksQty = blocks.length;
//        while(--blocksQty > -1) {
//          if(blocks[blocksQty].level === 1) {
//            var framesQty = blocks[blocksQty].linesOut.length;
//            while(--framesQty > -1) {
//
//              var isEquel1 = checkLineOwnPoint(currLines[currLinesQty].from, blocks[blocksQty].linesOut[framesQty].to, blocks[blocksQty].linesOut[framesQty].from);
//              var isEquel2 = checkLineOwnPoint(currLines[currLinesQty].to, blocks[blocksQty].linesOut[framesQty].to, blocks[blocksQty].linesOut[framesQty].from);
////              console.log('---------------');
////              console.log('0000000', blocks[blocksQty].linesOut[framesQty].from.id, blocks[blocksQty].linesOut[framesQty].to.id, currLines[currLinesQty].from.id);
////              console.log('1111111', isEquel1);
////              console.log('0000000', blocks[blocksQty].linesOut[framesQty].from.id, blocks[blocksQty].linesOut[framesQty].to.id, currLines[currLinesQty].to.id);
////              console.log('22222222', isEquel2);
//
//              if(isEquel1.x === Infinity || isEquel1.y === Infinity || isEquel2.x === Infinity || isEquel2.y === Infinity) {
//                continue;
//              } else {
//                if(isEquel1.x > 0 && isEquel1.x < 1 && isEquel2.x > 0 && isEquel2.x < 1 || isNaN(isEquel1.x) && isNaN(isEquel2.x)) {
//                  if(isEquel1.y >0 && isEquel1.y < 1 && isEquel2.y >0 && isEquel2.y < 1 || isNaN(isEquel1.y) && isNaN(isEquel2.y)) {
//                    currLines[currLinesQty].type = 'frame';
////                    console.log('++++++ frame ++++++');
//                  }
//                }
//              }
//            }
//          }
//        }
//      }
//    }





    function setPointsIn(lines, depths, group) {
      var pointsIn = [],
          linesQty = lines.length,
          i = 0;

      for(; i < linesQty; i++) {
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
        //    console.log('parallel = ', isParall);
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
        coord = getCoordCrossPointABS(line1, normal);
      } else {
        coord = getCoordCrossPointABS(line1, line2);
      }
      //  console.log('coord = ', coord);
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
      var k1 = (line1.to.y - line1.from.y) / (line1.to.x - line1.from.x),
          k2 = (line2.to.y - line2.from.y) / (line2.to.x - line2.from.x);
      return (k1 === k2) ? 1 : 0;
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
      var newPointsArr = JSON.parse( JSON.stringify(pointsArr)),
          newPointsQty = newPointsArr.length;
      while(--newPointsQty > -1) {
        newPointsArr[newPointsQty].type = label;
      }
      return newPointsArr;
    }





    function setOpenDir(direction, beadLines) {
      var parts = [],
          newPoints = preparePointsXMaxMin(beadLines),
          dim = getMaxMinCoord(newPoints),
          geomCenter = {
            x: (dim.minX + dim.maxX)/2,
            y: (dim.minY + dim.maxY)/2
          },
          dirQty = direction.length;
console.log('DIR line===', beadLines);
      console.log('DIR newPoints===', newPoints);
      console.log('DIR geomCenter===', geomCenter);

      for(var index = 0; index < dirQty; index++) {
        var part = {
          type: 'sash-dir',
          points: []
        };

        switch(direction[index]) {
          //----- 'up'
          case 1:
            part.points.push(getCrossPointSashDir(1, geomCenter, 225, beadLines));
            part.points.push(getCrossPointSashDir(3, geomCenter, 90, beadLines));
            part.points.push(getCrossPointSashDir(1, geomCenter, 315, beadLines));
            break;
          //----- 'right'
          case 2:
            part.points.push(getCrossPointSashDir(2, geomCenter, 225, beadLines));
            part.points.push(getCrossPointSashDir(4, geomCenter, 180, beadLines));
            part.points.push(getCrossPointSashDir(2, geomCenter, 135, beadLines));
            break;
          //------ 'down'
          case 3:
            part.points.push(getCrossPointSashDir(3, geomCenter, 135, beadLines));
            part.points.push(getCrossPointSashDir(1, geomCenter, 270, beadLines));
            part.points.push(getCrossPointSashDir(3, geomCenter, 45, beadLines));
            break;
          //----- 'left'
          case 4:
            part.points.push(getCrossPointSashDir(4, geomCenter, 45, beadLines));
            part.points.push(getCrossPointSashDir(2, geomCenter, 180, beadLines));
            part.points.push(getCrossPointSashDir(4, geomCenter, 315, beadLines));
            break;
        }
//        console.log('path ====', part.points);
        part.path = assamblingSashPath(part.points);
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
          peak.x = Math.pow(t,2) * (lines[ind0].to.x - 2*lines[ind1].to.x + lines[ind2].to.x) - 2*t*(lines[ind0].to.x - lines[ind1].to.x) + lines[ind0].to.x;
          peak.y = Math.pow(t,2) * (lines[ind0].to.y - 2*lines[ind1].to.y + lines[ind2].to.y) - 2*t*(lines[ind0].to.y - lines[ind1].to.y) + lines[ind0].to.y;
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
      console.log('DIR new coord----------', crossPoints);
      return crossPoints;
    }



    function cteateLineByAngel(center, angel) {
      console.log(angel);
      var k =  Math.round(Math.tan(angel * Math.PI / 180)),
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
        var coord, checkPoint, intersect;
        console.log('DIR line ++++', lines[l]);

        coord = getCoordCrossPoint(vector, lines[l]);
        console.log('DIR coord ++++', coord);
        if(coord.x >= 0 && coord.y >= 0) {

          //------ checking is cross point inner of line
//          var checkPoint2 = checkLineOwnPoint(coord, lines[l].to, lines[l].from);
//          console.log('^^^^^checkPoint^^^^', checkPoint2);
          checkPoint = checkLineOwnPoint(coord, lines[l].to, lines[l].from);
          console.log('^^^^^checkPoint ABS^^^^', checkPoint);
          if(checkPoint.x >= 0 && checkPoint.x <= 1 || checkPoint.y >=0 && checkPoint.y <= 1) {
//          if(isInside1.x !== Infinity && isInside1.x >= 0 && isInside1.x <= 1 || isInside1.y !== Infinity && isInside1.y >=0 && isInside1.y <= 1) {

            if(lines[l].dir === 'curv') {
              intersect = getIntersectionInCurve(l, linesQty, lines, vector, coord);
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




    function getIntersectionInCurve(l, linesQty, lines, vector, coord) {
      var nextId, p1, p2, p3, l1, l2, curvDir = 1, curvId, isCurv;
      //----- find curve id
      if(lines[l].from.id.indexOf('q')+1) {
        curvId = lines[l].from.id.slice(0,3);
      } else {
        curvId = lines[l].to.id.slice(0,3);
      }
      //              console.log('curvId++++', curvId);
      //------ if first curve and next is not curve
      if(l === 0) {
        nextId = l+1;
        if(lines[nextId].dir === 'line') {
          nextId = linesQty-1;
          curvDir = 0;
        } else {
          //---- checking id of curves
          isCurv = matchingCurveId(curvId, lines[nextId]);
          //                  console.log('isCurv++++', isCurv);
          if(!isCurv) {
            nextId = linesQty-1;
            curvDir = 0;
          }
        }
        //-------- if last curve
      } else {
        if(l === linesQty-1) {
          nextId = 0;
        } else {
          nextId = l+1;
        }
        if(lines[nextId].dir === 'line') {
          nextId = l-1;
          curvDir = 0;
        } else {
          //---- checking id of curves
          isCurv = matchingCurveId(curvId, lines[nextId]);
          //                  console.log('isCurv++++', isCurv);
          if(!isCurv) {
            nextId = l-1;
            curvDir = 0;
          }
        }
      }

      // qCurve & line defs
      if(curvDir) {
        p1 = lines[l].from;
        p2 = lines[l].to;
        p3 = lines[nextId].to;
      } else {
        p1 = lines[nextId].from;
        p2 = lines[l].from;
        p3 = lines[l].to;
      }

      l1 = vector.center;
      l2 = coord;
      //                        console.log('p1 ------',p1);
      //                        console.log('p2 ------',p2);
      //                        console.log('p3 ------',p3);
      //                        console.log('l1 ------',l1);
      //                        console.log('l2 ------',l2);
      // calc the intersections
      return QLineIntersections(p1, p2, p3, l1, l2);
    }


    function matchingCurveId(curvId, line) {
      var check = 0;
      if(line.from.id.indexOf(curvId)+1){
        check = 1;
      } else if(line.to.id.indexOf(curvId)+1) {
        check = 1;
      }
      return check;
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
            x: -2*p1.x + 2*p2.x,
            y: -2*p1.y + 2*p2.y
          },
          c0 = {
            x: p1.x,
            y: p1.y
          },
          // Transform to line
          coefficient = a1.x*a2.y - a2.x*a1.y,
          roots = [],
          a, b, c, d;

      //  console.log('coefficient', coefficient);

      if(Math.abs(normal.x) === Math.abs(normal.y)) {
        a = Math.abs(normal.x*c2.x) + Math.abs(normal.y*c2.y);
        //------ if line is vert or horisontal
      } else if(!Math.abs(normal.x)) {
        a = c2.x + normal.y * c2.y;
      } else if(!Math.abs(normal.y)) {
        a = normal.x*c2.x + c2.y;
      } else {
        a = normal.x*c2.x + normal.y*c2.y;
      }
      b = (normal.x*c1.x + normal.y*c1.y)/ a,
      c = (normal.x*c0.x + normal.y*c0.y + coefficient)/ a,
      d = b*b - 4*c;

      // solve the roots
      if(d > 0) {
        var delta = Math.sqrt(d);
        roots.push( parseFloat(((-b + delta)/2).toFixed(2)) );
        roots.push( parseFloat(((-b - delta)/2).toFixed(2)) );
      } else if(d === 0) {
        roots.push( parseFloat((-b/2).toFixed(2)) );
      }
      //  console.log('normal ++++',normal);
      //  console.log('c2 ++++',c2);
      //  console.log('a ++++',a);
      //  console.log('b ++++',b);
      //  console.log('c ++++',c);
      //  console.log('d ++++',d);
//      console.log('t++++',roots);

      // calc the solution points
      for(var i=0; i<roots.length; i++) {
        var t = roots[i];

        //    if(t >= 0 && t <= 1) {
        if(t > 0 && t < 1) {
          // possible point -- pending bounds check
          var point = {
                t: t,
                x: lerp(lerp(p1.x,p2.x,t),lerp(p2.x,p3.x,t),t),
                y: lerp(lerp(p1.y,p2.y,t),lerp(p2.y,p3.y,t),t)
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
      return intersections;
    }


    // linear interpolation utility
    function lerp(a,b,x) { return(a+x*(b-a)); }




    function assamblingSashPath(arrPoints) {
      var path = 'M ' + arrPoints[0].x + ',' + arrPoints[0].y,
          pointQty = arrPoints.length;

      for(var p = 1; p < pointQty; p++) {
        path += ' L ' + arrPoints[p].x + ',' + arrPoints[p].y;
      }
      return path;
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
        part.path = assamblingPath(part.points);

        //------- if impost is curve
      } else if(pointsQty === 6){

      }
      return part;
    }




    function getCoordCrossPoint(line1, line2) {
      var base = (line1.coefA * line2.coefB) - (line2.coefA * line1.coefB),
          baseX = (line1.coefB * (line2.coefC)) - (line2.coefB * (line1.coefC)),
          baseY = (line2.coefA * (line1.coefC)) - (line1.coefA * (line2.coefC)),
          crossPoint = {
            x: parseFloat( (baseX/base).toFixed(2) ),
            y: parseFloat( (baseY/base).toFixed(2) )
          };
      return crossPoint;
    }


    function getCoordCrossPointABS(line1, line2) {
      var base = (line1.coefA * line2.coefB) - (line2.coefA * line1.coefB),
          baseX = (line1.coefB * (line2.coefC)) - (line2.coefB * (line1.coefC)),
          baseY = (line2.coefA * (line1.coefC)) - (line1.coefA * (line2.coefC)),
          crossPoint = {
            x: Math.abs(baseX / base),
            y: Math.abs(baseY / base)
          };
      return crossPoint;
    }




    function checkLineOwnPoint(point, lineTo, lineFrom) {
      var check = {
        x: parseFloat( ( (point.x - lineTo.x)/(lineFrom.x - lineTo.x) ).toFixed(2) ),
        y: parseFloat( ( (point.y - lineTo.y)/(lineFrom.y - lineTo.y) ).toFixed(2) )
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



    function checkLineOwnPointABS(point, lineTo, lineFrom) {
//      var check = {
//        x: Math.abs( (point.x - lineFrom.x)/(lineTo.x - lineFrom.x) ),
//        y: Math.abs( (point.y - lineFrom.y)/(lineTo.y - lineFrom.y) )
//      };
      var check = {
        x: Math.abs( (point.x - lineTo.x)/(lineFrom.x - lineTo.x) ),
        y: Math.abs( (point.y - lineTo.y)/(lineFrom.y - lineTo.y) )
      };
      return check;
    }




  }
})();

