(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('SVGServ', designFactory);

  function designFactory($timeout, $q) {

    var thisFactory = this,
        sizeRectActClass = 'size-rect-active',
        sizeBoxActClass = 'size-value-active',
        newLength;

    thisFactory.publicObj = {
      createSVGTemplate: createSVGTemplate,
      setPointsOut: setPointsOut,
      centerBlock: centerBlock,
      sortingPoints: sortingPoints,
      setLines: setLines,
      setLineCoef: setLineCoef,
      findCrossPoint: findCrossPoint,
      checkLineOwnPoint: checkLineOwnPoint,
      setPointLocationToLine: setPointLocationToLine,
      QLineIntersections: QLineIntersections

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
          thisObj.details.skylights[i].pointsOut = setPointsOut(thisObj.details.skylights[i].pointsID, thisObj.details.points);
          thisObj.details.skylights[i].center = centerBlock(thisObj.details.skylights[i].pointsOut);
          thisObj.details.skylights[i].pointsOut = sortingPoints(thisObj.details.skylights[i].pointsOut, thisObj.details.skylights[i].center);
          setPointsIDXChildren(thisObj.details.skylights[i], thisObj.details.skylights, thisObj.details.points);
          thisObj.details.skylights[i].linesOut = setLines(thisObj.details.skylights[i].pointsOut);
          thisObj.details.skylights[i].pointsIn = setPointsIn(thisObj.details.skylights[i], depths, 'frame');
          thisObj.details.skylights[i].linesIn = setLines(thisObj.details.skylights[i].pointsIn);

          //      console.log('block +++++ ',thisObj.details.skylights[i].id, thisObj.details.skylights[i]);

          if(thisObj.details.skylights[i].level === 1) {
            setCornerProp(thisObj.details.skylights);
            //------- set points for each part of construction
            $.merge(thisObj.details.skylights[i].parts, setParts(thisObj.details.skylights[i].pointsOut, thisObj.details.skylights[i].pointsIn));
          } else {
            thisObj.details.skylights[i].impostOut = setImpostPoints(thisObj.details.skylights, thisObj.details.skylights[i].parent, thisObj.details.skylights[i].pointsIn);
          }


          //------- if block is empty
          if(thisObj.details.skylights[i].children.length < 1) {

            //------ if block is frame
            if(thisObj.details.skylights[i].blockType === 'frame') {
              thisObj.details.skylights[i].beadPointsOut = copyPointsOut(thisObj.details.skylights[i].pointsIn, 'bead');
              thisObj.details.skylights[i].beadLinesOut = setLines(thisObj.details.skylights[i].beadPointsOut);
              thisObj.details.skylights[i].beadPointsIn = setPointsIn(thisObj.details.skylights[i], depths, 'frame-bead');
              //          thisObj.details.skylights[i].beadLinesIn = setLines(thisObj.details.skylights[i].beadPointsIn);

              thisObj.details.skylights[i].glassPoints = setPointsIn(thisObj.details.skylights[i], depths, 'frame-glass');
              /*          thisObj.details.skylights[i].glassLines = setLines(thisObj.details.skylights[i].beadPointsIn);*/

              thisObj.details.skylights[i].parts.push(setGlass(thisObj.details.skylights[i].glassPoints));
              $.merge(thisObj.details.skylights[i].parts, setParts(thisObj.details.skylights[i].beadPointsOut, thisObj.details.skylights[i].beadPointsIn));



            } else if(thisObj.details.skylights[i].blockType === 'sash') {
              thisObj.details.skylights[i].sashPointsOut = copyPointsOut(setPointsIn(thisObj.details.skylights[i], depths, 'sash-out'), 'sash');
              thisObj.details.skylights[i].sashLinesOut = setLines(thisObj.details.skylights[i].sashPointsOut);
              thisObj.details.skylights[i].sashPointsIn = setPointsIn(thisObj.details.skylights[i], depths, 'sash-in');
              //          thisObj.details.skylights[i].sashLinesIn = setLines(thisObj.details.skylights[i].sashPointsIn);

              thisObj.details.skylights[i].hardwarePoints = setPointsIn(thisObj.details.skylights[i], depths, 'hardware');
              thisObj.details.skylights[i].hardwareLines = setLines(thisObj.details.skylights[i].sashPointsIn);

              thisObj.details.skylights[i].beadPointsOut = copyPointsOut(thisObj.details.skylights[i].sashPointsIn, 'bead');
              thisObj.details.skylights[i].beadLinesOut = setLines(thisObj.details.skylights[i].beadPointsOut);
              thisObj.details.skylights[i].beadPointsIn = setPointsIn(thisObj.details.skylights[i], depths, 'sash-bead');
              //------ for defined open directions of sash
              thisObj.details.skylights[i].beadLinesIn = setLines(thisObj.details.skylights[i].beadPointsIn);

              thisObj.details.skylights[i].glassPoints = setPointsIn(thisObj.details.skylights[i], depths, 'sash-glass');
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



      for(var i = 0; i < blocksQty; i++) {
        if(thisObj.details.skylights[i].level) {
          if(thisObj.details.skylights[i].children.length) {
            //------- collect all impost pointsOut in impostIn
            var bQty = blocksQty;
            while(--bQty > -1) {
              if(thisObj.details.skylights[i].id === thisObj.details.skylights[bQty].parent) {
                $.merge(thisObj.details.skylights[i].impost.impostIn, thisObj.details.skylights[bQty].impostOut);
              }
            }

            thisObj.details.skylights[i].parts.push( setImpostParts(thisObj.details.skylights[i].impost.impostIn) );
          }
        }
        //    console.log('^^^^^^^^^', thisObj.details.skylights[i]);
      }
      console.log('svg finish', new Date(), new Date().getMilliseconds());
      defer.resolve(thisObj);
      return defer.promise;
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


    function setPointsIDXChildren(currBlock, blocks, points) {
      if(currBlock.children.length) {
        var blocksQty = blocks.length,
            pointsIDQty = currBlock.pointsOut.length,
            indexChildBlock1, indexChildBlock2;

        //------- set points for impostAxis
        currBlock.impost.impostAxis = setPointsOut(currBlock.impost.impostID, points);

        //-------- set indexes of children blocks
        for(var i = 0; i < blocksQty; i++) {
          if(blocks[i].id === currBlock.children[0]) {
            indexChildBlock1 = i;
          } else if(blocks[i].id === currBlock.children[1]) {
            indexChildBlock2 = i;
          }
        }
        //------- insert Ids of pointsOut in pointsID of children blocks
        while(--pointsIDQty > -1) {
          //------- check pointsOut of parent block as to impost
          var position = setPointLocationToLine(currBlock.impost.impostAxis[0], currBlock.impost.impostAxis[1], currBlock.pointsOut[pointsIDQty]);
          //      console.log(currBlock.impost.impostAxis);
          //      console.log(currBlock.pointsOut[pointsIDQty]);
          //      console.log('position', position);
          //------ block right side
          if(position > 0) {
            blocks[indexChildBlock2].pointsID.push(currBlock.pointsOut[pointsIDQty].id);
            //------ block left side
          } else if(position < 0){
            blocks[indexChildBlock1].pointsID.push(currBlock.pointsOut[pointsIDQty].id);
          }
        }

        //------- insert Ids of impost in pointsID of children blocks
        for(var j = 0; j < currBlock.impost.impostID.length; j++) {
          blocks[indexChildBlock1].pointsID.push(currBlock.impost.impostID[j]);
          blocks[indexChildBlock2].pointsID.push(currBlock.impost.impostID[j]);
        }

      }
    }


    function setPointLocationToLine(lineP1, lineP2, newP) {
      return (newP.x - lineP2.x)*(newP.y - lineP1.y)-(newP.y - lineP2.y)*(newP.x - lineP1.x);
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



    function setPointsIn(block, depths, group) {
      var pointsIn = [],
          linesQty = block.linesOut.length,
          i = 0;
      //  console.log('block.linesOut = ', block.level);

      for(; i < linesQty; i++) {
        var newCoefC1 = getNewCoefC(depths, block.linesOut[i], group),
            newCoefC2 = 0,
            crossPoint = {},
            index;
        if(i === (linesQty - 1)) {
          index = 0;
        } else {
          index = i+1;
        }
        newCoefC2 = getNewCoefC(depths, block.linesOut[index], group);
        crossPoint = getCoordCrossPoint (block.linesOut[i], block.linesOut[index], newCoefC1, newCoefC2);
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
            depth = depths.impostDepth.c / 2;
          }
          break;
        case 'frame-bead':
          if(line.type === 'frame') {
            depth = depths.frameDepth.c + beadDepth;
          } else if(line.type === 'impost') {
            depth = (depths.impostDepth.c / 2) + beadDepth;
          }
          break;
        case 'frame-glass':
          if(line.type === 'frame') {
            depth = depths.frameDepth.d;
          } else if(line.type === 'impost') {
            depth = depths.impostDepth.b;
          }
          break;
        case 'sash-out':
          if(line.type === 'frame') {
            depth = depths.frameDepth.b;
          } else if(line.type === 'impost') {
            depth = depths.impostDepth.d;
          }
          break;
        case 'sash-in':
          if(line.type === 'frame') {
            depth = depths.frameDepth.b + depths.sashDepth.c;
          } else if(line.type === 'impost') {
            depth = depths.impostDepth.d + depths.sashDepth.c;
          }
          break;
        case 'hardware':
          if(line.type === 'frame') {
            depth = depths.frameDepth.b + depths.sashDepth.b;
          } else if(line.type === 'impost') {
            depth = depths.impostDepth.d + depths.sashDepth.b;
          }
          break;
        case 'sash-bead':
          if(line.type === 'frame') {
            depth = depths.frameDepth.b + depths.sashDepth.c + beadDepth;
          } else if(line.type === 'impost') {
            depth = depths.impostDepth.d + depths.sashDepth.c + beadDepth;
          }
          break;
        case 'sash-glass':
          if(line.type === 'frame') {
            depth = depths.frameDepth.b + depths.sashDepth.d;
          } else if(line.type === 'impost') {
            depth = depths.impostDepth.d + depths.sashDepth.d;
          }
          break;
      }
      //  console.log('depth', line.type);
      //  console.log('depth', depth);
      var newCoefC = line.coefC - (depth * Math.hypot(line.coefA, line.coefB));
      return newCoefC;
    }



    function getCoordCrossPoint(line1, line2, coefC1, coefC2) {
      //  console.log('block.linesOut = ', line1);
      //  console.log('block.linesOut = ', line2);
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
        coord = findCrossPoint(line1, normal, coefC1, normal.coefC);
      } else {
        coord = findCrossPoint(line1, line2, coefC1, coefC2);
      }
      //  console.log('coord = ', coord);
      crossPoint.x = coord.x;
      crossPoint.y = coord.y;
      crossPoint.type = (line1.type === 'impost' || line2.type === 'impost') ? 'impost' : 'frame';
      crossPoint.dir = (line1.to.dir === 'curv') ? 'curv' : 'line';
      crossPoint.id = line1.to.id +'-in';
      crossPoint.view = 1;
      return crossPoint;
    }


    function checkParallel(line1, line2) {
      var k1 = (line1.to.y - line1.from.y) / (line1.to.x - line1.from.x),
          k2 = (line2.to.y - line2.from.y) / (line2.to.x - line2.from.x);
      return (k1 === k2) ? 1 : 0;
    }

    function findCrossPoint(line1, line2, coefC1, coefC2) {
      var base = (line1.coefA * line2.coefB) - (line2.coefA * line1.coefB),
          baseX = (line1.coefB * (coefC2)) - (line2.coefB * (coefC1)),
          baseY = (line2.coefA * (coefC1)) - (line1.coefA * (coefC2)),
          crossPoint = {
            x: Math.abs(baseX / base),
            y: Math.abs(baseY / base)
            //        x: baseX / base,
            //        y: baseY / base
          };
      return crossPoint;
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
          dirQty = direction.length,
          index = 0;

      for(; index < dirQty; index++) {
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
      var sashLineMark = cteateSashDirLine(centerGeom, angel);
      var crossPoints = getCrossPointInBlock(position, sashLineMark, lines);
//      console.log('new coord----------', crossPoints);
      return crossPoints;
    }



    function cteateSashDirLine(center, angel) {
//      console.log(angel);
      var k =  Math.round(Math.tan(angel * Math.PI / 180)),
          lineMark = {
            center: center,
            coefA: k,
            coefB: -1,
            coefC: (center.y - k*center.x)
          };
      return lineMark;
    }



    function getCrossPointInBlock(position, lineMark, lines) {
      var linesQty = lines.length;
//      console.log('lines @@@@@@', lines);
      for(var l = 0; l < linesQty; l++) {
//        console.log('line ++++', lines[l]);
        //    console.log('line ++++', lines[l]);
        var coord = findCrossPointSashDir(lineMark, lines[l], lineMark.coefC, lines[l].coefC);
//        console.log('coord ++++', coord);
        if(coord.x >= 0 && coord.y >= 0) {

          //------ checking is cross point inner of line
          var checkPoint = checkLineOwnPoint(coord, lines[l].to, lines[l].from);
//                console.log('^^^^^checkPoint^^^^', checkPoint);
          if(checkPoint.x >= 0 && checkPoint.x <= 1 || checkPoint.y >=0 && checkPoint.y <= 1) {


            if(lines[l].dir === 'curv') {
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

              l1 = lineMark.center;
              l2 = coord;
//                        console.log('p1 ------',p1);
//                        console.log('p2 ------',p2);
//                        console.log('p3 ------',p3);
//                        console.log('l1 ------',l1);
//                        console.log('l2 ------',l2);
              // calc the intersections
              var intersect = QLineIntersections(p1, p2, p3, l1, l2);
              if(intersect.length) {
                coord.x = intersect[0].x;
                coord.y = intersect[0].y;
              }
            }


            coord.fi = getAngelPoint(lineMark.center, coord);
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

          }

        }

      }


    }

    function findCrossPointSashDir(line1, line2, coefC1, coefC2) {
      var base = (line1.coefA * line2.coefB) - (line2.coefA * line1.coefB),
          baseX = (line1.coefB * (coefC2)) - (line2.coefB * (coefC1)),
          baseY = (line2.coefA * (coefC1)) - (line1.coefA * (coefC2)),
          crossPoint = {
            x: baseX / base,
            y: baseY / base
          };
      return crossPoint;
    }

    function checkLineOwnPoint(point, lineTo, lineFrom) {
      //  var check = {
      //    x: (point.x - lineTo.x) / (lineFrom.x - lineTo.x),
      //    y: (point.y - lineTo.y) / (lineFrom.y - lineTo.y)
      //  };
      var check = {
        x: Math.abs( (point.x - lineFrom.x) / (lineTo.x - lineFrom.x) ),
        y: Math.abs( (point.y - lineFrom.y) / (lineTo.y - lineFrom.y) )
      };
      return check;
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

    function setImpostPoints(blocks, parentID, points) {
      var impostPoints = [],
          blocksQty = blocks.length,
          pointsQty = points.length;
      while(--blocksQty > -1) {
        if(blocks[blocksQty].id === parentID) {

          //---- find impost in points
          while(--pointsQty > -1) {
            //------ if point match to impostId
            if(points[pointsQty].id === blocks[blocksQty].impost.impostID[0]+'-in' || points[pointsQty].id === blocks[blocksQty].impost.impostID[1]+'-in' ) {
              impostPoints.push(JSON.parse(JSON.stringify(points[pointsQty])));
            }
          }
        }
      }
      return impostPoints;
    }



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







    ////////////////////////////////////////////








  }
})();
