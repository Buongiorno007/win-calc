'use strict';


Array.prototype.min = function () {
  return this.reduce(function (p, v) {
    return ( p < v ? p : v );
  });
};

Array.prototype.max = function () {
  return this.reduce(function (p, v) {
    return ( p > v ? p : v );
  });
};

Array.prototype.removeDuplicates = function() {
  return this.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
  });
};

function sortNumbers(a, b) {
  return a - b;
}


function getMaxMinCoord(points) {
  var overall = {
    minX: d3.min(points, function(d) { return d.x; }),
    maxX: d3.max(points, function(d) { return d.x; }),
    minY: d3.min(points, function(d) { return d.y; }),
    maxY: d3.max(points, function(d) { return d.y; })
  };
  return overall;
}








//--------- TEMPLATE JSON PARSE ----------------



//-----------Dimension-------------------
var Dimension = function (sourceObj) {
  LineObject.call(this, sourceObj);
  this.level = sourceObj.level;
  this.height = 150;
  this.side = sourceObj.side;
  this.limits = sourceObj.limits;
  this.links = sourceObj.links;

  this.fromPointId = sourceObj.from[0];
  this.toPointId = sourceObj.to[0];

  this.fromPointsArrId = sourceObj.from;
  this.toPointsArrId = sourceObj.to;

};
//Dimension.prototype = FrameObject;
//FrameLine.prototype = LineObject;

//-----------Square-------------------
var Square = function (sourceObj) {
  FrameObject.call(this, sourceObj);
  this.squares = [];
  this.widths = [];
  this.heights = [];

  this.parseParts = function(fullTemplate) {
    for (var p = 0; p < sourceObj.widths.length; p++) {
      var width = fullTemplate.findById(sourceObj.widths[p]);
      this.widths.push(width);
      var height = fullTemplate.findById(sourceObj.heights[p]);
      this.heights.push(height);
      //-------- calculate glass square
      if (p === sourceObj.widths.length - 1) {
        for (var s = 0; s < this.widths.length; s++) {
          var square = (this.widths[s].lengthVal * this.heights[s].lengthVal) / 1000000;
          this.squares.push(square);
        }
      }
    }
  }
};
//Square.prototype = FrameObject;




function createDimentions(sourceObj) {
  var frameXArr = [],
      frameYArr = [],
      impostVertXMax = 0,
      impostHorYMax = 0,
      impostVertXArr = [],
      impostHorYArr = [],
      levelUp = 1,
      levelLeft = 1,
      dimentions = [];

  for (var i = 0; i < sourceObj.objects.length; i++) {
    switch (sourceObj.objects[i].type) {
      case 'fixed_point':
        frameXArr.push(+sourceObj.objects[i].x);
        frameYArr.push(+sourceObj.objects[i].y);
        break;
      case 'fixed_point_impost':
        if(sourceObj.objects[i].dir === 'vert') {
          impostVertXArr.push(+sourceObj.objects[i].x);
        } else if(sourceObj.objects[i].dir === 'hor') {
          impostHorYArr.push(+sourceObj.objects[i].y);
        }
        break;
    }
  }
  if(impostVertXArr.length > 0) {
    impostVertXMax = impostVertXArr.max();
    impostVertXArr = impostVertXArr.concat(frameXArr);
  }
  if(impostHorYArr.length > 0) {
    impostHorYMax = impostHorYArr.max();
    impostHorYArr = impostHorYArr.concat(frameYArr);
  }

  //---- sorting and delete dublicats
  frameXArr = frameXArr.removeDuplicates();
  frameYArr = frameYArr.removeDuplicates();
  impostVertXArr = impostVertXArr.removeDuplicates();
  impostHorYArr = impostHorYArr.removeDuplicates();

  frameXArr.sort(sortNumbers);
  frameYArr.sort(sortNumbers);
  impostVertXArr.sort(sortNumbers);
  impostHorYArr.sort(sortNumbers);

/*
  console.log('frameXArr sort== ', frameXArr);
  console.log('impostVertXArr sort== ', impostVertXArr);
  console.log('impostHorYArr sort== ', impostHorYArr);

*/

  //----- set level
  if(impostVertXArr.length > 0) {
    levelUp = 2;
    sortingCoordin(dimentions, frameXArr, 'hor', levelUp, impostVertXMax, 'overallDimH');
    sortingCoordin(dimentions, impostVertXArr, 'hor', (levelUp - 1));
  } else {
    sortingCoordin(dimentions, frameXArr, 'hor', levelUp);
  }
  if(impostHorYArr.length > 0) {
    levelLeft = 2;
    sortingCoordin(dimentions, frameYArr, 'vert', levelLeft, impostHorYMax, 'overallDimV');
    sortingCoordin(dimentions, impostHorYArr, 'vert', (levelLeft - 1));

  } else {
    sortingCoordin(dimentions, frameYArr, 'vert', levelLeft);
  }

  //console.log('dimentions == ', dimentions);
  return dimentions;

}


function sortingCoordin(dimentions, coordinates, typeDim, levelDim, limit, classSize) {
  var dimPadding = (limit + 200) || 200,
      maxDimFrame = 5000,
      dimension;
  for(var d = 0; d < coordinates.length; d++) {
    if((d+1) < coordinates.length) {
      if(coordinates[d+2]) {
        dimension = {type: typeDim, from: coordinates[d], to: coordinates[d+1], level: levelDim, minDim: (coordinates[d] + dimPadding), maxDim: (coordinates[d+2] - dimPadding)};
      } else {
        if(limit) {
          dimension = {id: classSize, type: typeDim, from: coordinates[d], to: coordinates[d+1], level: levelDim, minDim: (coordinates[d] + dimPadding), maxDim: maxDimFrame};
        } else {
          dimension = {type: typeDim, from: coordinates[d], to: coordinates[d+1], level: levelDim, minDim: (coordinates[d] + dimPadding), maxDim: maxDimFrame};
        }
      }
      dimentions.push(dimension);
    }
  }
}







//////////////////////////////////////////////////


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
    currBlock.impost.impostAxis = setPointsOut(currBlock.impost.impostID, points);
    var blocksQty = blocks.length,
        pointsIDQty = currBlock.pointsOut.length;

    while(--pointsIDQty > -1) {
      var position = setPointLocationToLine(currBlock.impost.impostAxis[0], currBlock.impost.impostAxis[1], currBlock.pointsOut[pointsIDQty]);
      console.log(position);
      if(position > 0) {
        for(var i = 0; i < blocksQty; i++) {
          if(blocks[i].id === currBlock.children[1]) {
            console.log(blocks[i].id);
            blocks[i].pointsID.push(currBlock.pointsOut[pointsIDQty].id);
          }
        }
      } else {
        for(var i = 0; i < blocksQty; i++) {
          if(blocks[i].id === currBlock.children[0]) {
            console.log(blocks[i].id);
            blocks[i].pointsID.push(currBlock.pointsOut[pointsIDQty].id);
          }
        }
      }
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
      if(points[0].type === 'frame' && !points[0].view) {
        index = 1;
      } else {
        index = 0;
      }
    } else {
      if(points[i+1].type === 'frame' && !points[i+1].view) {
        index = i+2;
      } else {
        index = i+1;
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
        x: baseX / base,
        y: baseY / base
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





function setOpenDir(direction, center, beadLines) {
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
        part.points.push({x: geomCenter.x, y: dim.minY});
        part.points.push(getCrossPointSashDir(1, geomCenter, 315, beadLines));
        break;
      //----- 'right'
      case 2:
        part.points.push(getCrossPointSashDir(2, geomCenter, 225, beadLines));
        part.points.push({x: dim.maxX, y: geomCenter.y});
        part.points.push(getCrossPointSashDir(2, geomCenter, 135, beadLines));
        break;
      //------ 'down'
      case 3:
        part.points.push(getCrossPointSashDir(3, geomCenter, 135, beadLines));
        part.points.push({x: geomCenter.x, y: dim.maxY});
        part.points.push(getCrossPointSashDir(3, geomCenter, 45, beadLines));
        break;
      //----- 'left'
      case 4:
        part.points.push(getCrossPointSashDir(4, geomCenter, 45, beadLines));
        part.points.push({x: dim.minX, y: geomCenter.y});
        part.points.push(getCrossPointSashDir(4, geomCenter, 315, beadLines));
        break;
    }
//console.log('path ====', part.points);
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
  return crossPoints;
}



function cteateSashDirLine(center, angel) {
//  console.log(angel);
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
  for(var l = 0; l < linesQty; l++) {

//    console.log('line ++++', lines[l]);
    var coord = findCrossPoint(lineMark, lines[l], lineMark.coefC, lines[l].coefC);
    if(coord.x > 0 && coord.y > 0) {

      //------ checking is cross point inner of line
      var checkPoint = checkLineOwnPoint(coord, lines[l].to, lines[l].from);
      if(checkPoint.x >= 0 && checkPoint.x <= 1 || checkPoint.y >=0 && checkPoint.y <= 1) {


        if(lines[l].dir === 'curv') {
          var nextId, p1, p2, p3, l1, l2;
          //------ if first curve and next is not curve
          if(l === 0 && lines[l+1].dir === 'line') {
            nextId = linesQty-1;
            //-------- if last curve
          } else if(l === linesQty-1 && lines[0].dir === 'curv') {
            nextId = 0;
          } else if(lines[l+1].dir === 'curv') {
            nextId = l+1;
          } else if(lines[l-1].dir === 'curv') {
            nextId = l-1;
          }

          // qCurve & line defs
          var regFP = /fp\d/;
          var regC = /c\d-\d/;

          if(regFP.test(lines[l].from.id) || regC.test(lines[l].from.id) && lines[l].to.id.indexOf('q') + 1) {
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
//          console.log('p1 ------',p1);
//          console.log('p2 ------',p2);
//          console.log('p3 ------',p3);
//          console.log('l1 ------',l1);
//          console.log('l2 ------',l2);
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
            if(coord.fi > 180 && coord.fi < 360) {
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

function checkLineOwnPoint(point, lineTo, lineFrom) {
  var check = {
    x: (point.x - lineTo.x) / (lineFrom.x - lineTo.x),
    y: (point.y - lineTo.y) / (lineFrom.y - lineTo.y)
  };
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
    roots.push((-b + delta)/2);
    roots.push((-b - delta)/2);
  } else if(d === 0) {
    roots.push(-b/2);
  }
  console.log('normal ++++',normal);
  console.log('c2 ++++',c2);
  console.log('a ++++',a);
  console.log('b ++++',b);
  console.log('c ++++',c);
  console.log('d ++++',d);
  console.log('t++++',roots);

  // calc the solution points
  for(var i=0; i<roots.length; i++) {
    var t = roots[i];

    if(t >= 0 && t <= 1) {
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
        if(points[pointsQty].id.indexOf(blocks[blocksQty].impost.impostID[0]) + 1 || points[pointsQty].id.indexOf(blocks[blocksQty].impost.impostID[1]) + 1) {
          impostPoints.push(JSON.parse(JSON.stringify(points[pointsQty])));
        }
      }
    }
  }

//  console.log('impostPoints =', impostPoints);
  return impostPoints;
}



function setImpostParts(points) {
//console.log('impost part++++++', points);
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

//  console.log('part###### = ', part);
  return part;
}







////////////////////////////////////////////



var Template = function (sourceObj, depths) {
//  this.name = sourceObj.name;
  this.details = JSON.parse( JSON.stringify(sourceObj.details) );
  //this.dimentions = createDimentions(sourceObj);

  var blocksQty = this.details.skylights.length;


  for(var i = 0; i < blocksQty; i++) {
    //------ block 0
    if(this.details.skylights[i].level === 0) {

      var childQty = this.details.skylights[i].children.length,
          b = 0;
      if(childQty === 1) {
        for(; b < blocksQty; b++) {
          if(this.details.skylights[i].children[0] === this.details.skylights[b].id) {
            this.details.skylights[b].position = 'single';
          }
        }
      } else if(childQty > 1) {
        for(; b < blocksQty; b++) {
          if(this.details.skylights[i].children[0] === this.details.skylights[b].id) {
            this.details.skylights[b].position = 'first';
          } else if(this.details.skylights[i].children[childQty-1] === this.details.skylights[b].id) {
            this.details.skylights[b].position = 'last';
          }
        }
      }

    } else {
      this.details.skylights[i].pointsOut = setPointsOut(this.details.skylights[i].pointsID, this.details.points);
      this.details.skylights[i].center = centerBlock(this.details.skylights[i].pointsOut);
      this.details.skylights[i].pointsOut = sortingPoints(this.details.skylights[i].pointsOut, this.details.skylights[i].center);
      setPointsIDXChildren(this.details.skylights[i], this.details.skylights, this.details.points);
      this.details.skylights[i].linesOut = setLines(this.details.skylights[i].pointsOut);
      this.details.skylights[i].pointsIn = setPointsIn(this.details.skylights[i], depths, 'frame');
      this.details.skylights[i].linesIn = setLines(this.details.skylights[i].pointsIn);

//      console.log('block +++++ ',this.details.skylights[i].id, this.details.skylights[i]);

      if(this.details.skylights[i].level === 1) {
        setCornerProp(this.details.skylights);
        //------- set points for each part of construction
        $.merge(this.details.skylights[i].parts, setParts(this.details.skylights[i].pointsOut, this.details.skylights[i].pointsIn));
      } else {
        this.details.skylights[i].impostOut = setImpostPoints(this.details.skylights, this.details.skylights[i].parent, this.details.skylights[i].pointsIn);
      }


      //------- if block is empty
      if(this.details.skylights[i].children.length < 1) {

        //------ if block is frame
        if(this.details.skylights[i].blockType === 'frame') {
          this.details.skylights[i].beadPointsOut = copyPointsOut(this.details.skylights[i].pointsIn, 'bead');
          this.details.skylights[i].beadLinesOut = setLines(this.details.skylights[i].beadPointsOut);
          this.details.skylights[i].beadPointsIn = setPointsIn(this.details.skylights[i], depths, 'frame-bead');
//          this.details.skylights[i].beadLinesIn = setLines(this.details.skylights[i].beadPointsIn);

          this.details.skylights[i].glassPoints = setPointsIn(this.details.skylights[i], depths, 'frame-glass');
/*          this.details.skylights[i].glassLines = setLines(this.details.skylights[i].beadPointsIn);*/

          this.details.skylights[i].parts.push(setGlass(this.details.skylights[i].glassPoints));
          $.merge(this.details.skylights[i].parts, setParts(this.details.skylights[i].beadPointsOut, this.details.skylights[i].beadPointsIn));



        } else if(this.details.skylights[i].blockType === 'sash') {
          this.details.skylights[i].sashPointsOut = copyPointsOut(setPointsIn(this.details.skylights[i], depths, 'sash-out'), 'sash');
          this.details.skylights[i].sashLinesOut = setLines(this.details.skylights[i].sashPointsOut);
          this.details.skylights[i].sashPointsIn = setPointsIn(this.details.skylights[i], depths, 'sash-in');
//          this.details.skylights[i].sashLinesIn = setLines(this.details.skylights[i].sashPointsIn);

          this.details.skylights[i].hardwarePoints = setPointsIn(this.details.skylights[i], depths, 'hardware');
          this.details.skylights[i].hardwareLines = setLines(this.details.skylights[i].sashPointsIn);

          this.details.skylights[i].beadPointsOut = copyPointsOut(this.details.skylights[i].sashPointsIn, 'bead');
          this.details.skylights[i].beadLinesOut = setLines(this.details.skylights[i].beadPointsOut);
          this.details.skylights[i].beadPointsIn = setPointsIn(this.details.skylights[i], depths, 'sash-bead');
          //------ for defined open directions of sash
          this.details.skylights[i].beadLinesIn = setLines(this.details.skylights[i].beadPointsIn);

          this.details.skylights[i].glassPoints = setPointsIn(this.details.skylights[i], depths, 'sash-glass');
//          this.details.skylights[i].glassLines = setLines(this.details.skylights[i].beadPointsIn);

          $.merge(this.details.skylights[i].parts, setParts(this.details.skylights[i].sashPointsOut, this.details.skylights[i].sashPointsIn));
          this.details.skylights[i].parts.push(setGlass(this.details.skylights[i].glassPoints));
          $.merge(this.details.skylights[i].parts, setParts(this.details.skylights[i].beadPointsOut, this.details.skylights[i].beadPointsIn));

          //----- set openPoints for sash
//          this.details.skylights[i].sashOpenDir = setOpenDir(this.details.skylights[i].openDir, this.details.skylights[i].center, this.details.skylights[i].beadLinesIn);
        }

      }
    }
  }



  for(var i = 0; i < blocksQty; i++) {
    if(this.details.skylights[i].level > 0) {
      if(this.details.skylights[i].children.length) {

//        this.details.skylights[i].impost.impostAxis = setPointsOut(this.details.skylights[i].impost.impostID, this.details.points);
        //------- collect all impost pointsOut in impostIn
        var bQty = blocksQty;
        while(--bQty > -1) {
          if(this.details.skylights[i].id === this.details.skylights[bQty].parent) {
            $.merge(this.details.skylights[i].impost.impostIn, this.details.skylights[bQty].impostOut);
          }
        }

        this.details.skylights[i].parts.push( setImpostParts(this.details.skylights[i].impost.impostIn) );
      }
    }
    console.log('^^^^^^^^^', this.details.skylights[i]);
  }

};







var TemplateIcon = function (sourceObj, depths) {
  var tmpObject, coeffScale = 2;



};

/*

var Template = function (sourceObj, depths) {
  this.name = sourceObj.name;
  this.objects = [];
  this.dimentions = createDimentions(sourceObj);
//////////////////////
  //sourceObj.objects.push({'type':'fixed_point', id:'fp_corner1_1', x:20, y:0});
  buildFrames(sourceObj, depths);
  setFixedPointCorners(sourceObj);
///////////////////////
  var tmpObject,
      coeffScale = 1;

  for (var i = 0; i < sourceObj.objects.length; i++) {
    tmpObject = null;
    switch(sourceObj.objects[i].type) {
      case 'point_frame':
      case 'point_impost': tmpObject = new FixedPoint(sourceObj.objects[i]);
        break;
      case 'frame_line':
      case 'frame_in_line': tmpObject = new FrameLine(sourceObj.objects[i]);
        break;
      case 'cross_point':  tmpObject = new CrossPoint(sourceObj.objects[i], depths.frameDepth.c);
        break;
      case 'impost_line':
      case 'impost_in_line': tmpObject = new LineObject(sourceObj.objects[i]);
        break;
      case 'cross_point_impost':
        tmpObject = new CPoint(sourceObj.objects[i], depths, coeffScale);
        break;
      case 'sash_line':  tmpObject = new LineObject(sourceObj.objects[i]);
        break;
      case 'cross_point_sash_out':
        tmpObject = new CPoint(sourceObj.objects[i], depths, coeffScale);
        break;
      case 'cross_point_hardware': tmpObject = new CrossPoint(sourceObj.objects[i], depths.sashDepth.b);
        break;
      case 'hardware_line': tmpObject = new LineObject(sourceObj.objects[i]);
        break;
      case 'cross_point_sash_in':  tmpObject = new CrossPoint(sourceObj.objects[i], depths.sashDepth.c);
        break;
      case 'sash_out_line':  tmpObject = new LineObject(sourceObj.objects[i]);
        break;
      case 'cross_point_bead_out':
        tmpObject = new CPoint(sourceObj.objects[i], depths, coeffScale);
        break;
      case 'bead_line':  tmpObject = new LineObject(sourceObj.objects[i]);
        break;
      case 'cross_point_bead':  tmpObject = new CrossPoint(sourceObj.objects[i], 20);
        break;
      case 'bead_in_line':  tmpObject = new LineObject(sourceObj.objects[i]);
        break;
      case 'cross_point_glass':
        tmpObject = new CPoint(sourceObj.objects[i], depths, coeffScale);
        break;
      case 'glass_line':  tmpObject = new LineObject(sourceObj.objects[i]);
        break;
      case 'frame':
      case 'impost':
      case 'bead_box':
        tmpObject = new Frame(sourceObj.objects[i]);
        break;
      case 'sash':  tmpObject = new Sash(sourceObj.objects[i]);
        break;
      case 'sash_block':  tmpObject = new SashBlock(sourceObj.objects[i]);
        break;
      case 'glass_paсkage':  tmpObject = new Glass(sourceObj.objects[i]);
        break;
      case 'dimensionsH':  tmpObject = new Dimension(sourceObj.objects[i]);
        break;
      case 'dimensionsV':  tmpObject = new Dimension(sourceObj.objects[i]);
        break;
      case 'square':  tmpObject = new Square(sourceObj.objects[i]);
        break;
    }
    if (tmpObject) {
      this.objects.push(tmpObject);
    }
  }

  //эта функция  пройдет по всем objects и свяжет ID по имени с объектами,
  // но только после того как будут все объекты уже распарсены

  this.parseIds = function() {
    for (var i = 0; i < this.objects.length; i++) {
      if('parseIds' in this.objects[i]) {
        this.objects[i].parseIds(this);
      }
      if('parseParts' in this.objects[i]) {
        this.objects[i].parseParts(this);
      }
    }
  };

  this.findById = function (id) {
    for (var i = 0; i < this.objects.length; i++) {
      if (this.objects[i].id === id) {
        return this.objects[i];
      }
    }
  };

  this.parseIds();
};

//--------- TEMPLATE JSON PARSE FOR ICON----------------

var TemplateIcon = function (sourceObj, depths) {
  this.name = sourceObj.name;
  this.objects = [];
  this.dimentions = createDimentions(sourceObj);

  var tmpObject,
      coeffScale = 2;

  for (var i = 0; i < sourceObj.objects.length; i++) {
    tmpObject = null;
    switch(sourceObj.objects[i].type) {
      case 'fixed_point':
      case 'fixed_point_impost': tmpObject = new FixedPoint(sourceObj.objects[i]);
        break;
      case 'frame_line':
      case 'frame_in_line': tmpObject = new FrameLine(sourceObj.objects[i]);
        break;
      case 'cross_point':  tmpObject = new CrossPoint(sourceObj.objects[i], depths.frameDepth.c * coeffScale);
        break;
      case 'impost_line':
      case 'impost_in_line': tmpObject = new LineObject(sourceObj.objects[i]);
        break;
      case 'cross_point_impost':
        tmpObject = new CPoint(sourceObj.objects[i], depths, coeffScale);
        break;
      case 'sash_line':  tmpObject = new LineObject(sourceObj.objects[i]);
        break;
      case 'cross_point_sash_out':
        tmpObject = new CPoint(sourceObj.objects[i], depths, coeffScale);
        break;
      case 'cross_point_sash_in':  tmpObject = new CrossPoint(sourceObj.objects[i], depths.sashDepth.c * coeffScale);
        break;
      case 'sash_out_line':  tmpObject = new LineObject(sourceObj.objects[i]);
        break;
      case 'cross_point_bead_out':
        tmpObject = new CPoint(sourceObj.objects[i], depths, coeffScale);
        break;
      case 'bead_line':  tmpObject = new LineObject(sourceObj.objects[i]);
        break;
      case 'cross_point_bead':  tmpObject = new CrossPoint(sourceObj.objects[i], 20);
        break;
      case 'bead_in_line':  tmpObject = new LineObject(sourceObj.objects[i]);
        break;
      case 'cross_point_glass':
        tmpObject = new CPoint(sourceObj.objects[i], depths, coeffScale);
        break;
      case 'glass_line':  tmpObject = new LineObject(sourceObj.objects[i]);
        break;
      case 'frame':
      case 'impost':
      case 'bead_box':
        tmpObject = new Frame(sourceObj.objects[i]);
        break;
      case 'sash':  tmpObject = new Sash(sourceObj.objects[i]);
        break;
      case 'glass_paсkage':  tmpObject = new Glass(sourceObj.objects[i]);
        break;
      case 'dimensionsH':  tmpObject = new Dimension(sourceObj.objects[i]);
        break;
      case 'dimensionsV':  tmpObject = new Dimension(sourceObj.objects[i]);
        break;
    }
    if (tmpObject) {
      this.objects.push(tmpObject);
    }
  }

  //эта функция  пройдет по всем objects и свяжет ID по имени с объектами,
  // но только после того как будут все объекты уже распарсены

  this.parseIds = function() {
    for (var i = 0; i < this.objects.length; i++) {
      if('parseIds' in this.objects[i]) {
        this.objects[i].parseIds(this);
      }
      if('parseParts' in this.objects[i]) {
        this.objects[i].parseParts(this);
      }
    }
  };

  this.findById = function (id) {
    for (var i = 0; i < this.objects.length; i++) {
      if (this.objects[i].id === id) {
        return this.objects[i];
      }
    }
  };

  this.parseIds();
};
*/

//======================= parse Template Source

function parsingTemplateSource(obj) {
  var mainObj = {},
      objTempArr,
      objElements = [];

  var newobj = obj.replace(/^{/gm,'').replace(/}$/gm,'').split(',"objects":');
  var nameArr = newobj[0].split(':');
  mainObj[nameArr[0].replace(/^\"/gm, '').replace(/\"$/gm, '')] = nameArr[1].replace(/^\"/gm, '').replace(/\"$/gm, '');
  mainObj['objects'] = [];
  var objectsAll = newobj[1].replace(/^\[/gm,'').replace(/\]$/gm,'');
  var objRe = /\{([\s\S]*)\}/gm;
  var myArray = objectsAll.split(objRe);
  for(var i = 0; i < myArray.length; i++) {
    if(myArray[i].length > 0) {
      objTempArr = myArray[i].split('},{');
    }
  }
  for(var j = 0; j < objTempArr.length; j++) {
    var objReg;
    if(objTempArr[j].indexOf("[") > 0 || objTempArr[j].indexOf("]") > 0) {
      objReg = /([\w_"]*:\[[\w_",]*\])/gm;
    } else {
      objReg = /([\w_"]*:[\w_"]*)/gm;
    }
    var objElement = objTempArr[j].split(objReg);

    for(var k = 0; k < objElement.length; k++) {
      if(objElement[k].length === 0 || objElement[k] === ',') {
        objElement.splice(k, 1);
      } else if(objElement[k].indexOf(",") > -1) {
        objElement[k] = objElement[k].replace(/^\,/g,'').replace(/\,$/g,'');
      }
    }
    objElements.push(objElement);
  }
  for(var el = 0; el < objElements.length; el++) {
    var tempElem = {};
    for(var e = 0; e < objElements[el].length; e++) {
      if(objElements[el][e].indexOf(",") > 0 && objElements[el][e].indexOf("[") < 0) {
        var tempElementArr = objElements[el][e].split(',');
        for(var prop = 0; prop < tempElementArr.length; prop++) {
          if(tempElementArr[prop].length) {
            var elemParts = tempElementArr[prop].split(':');
            tempElem[elemParts[0].replace(/^\"/gm, '').replace(/\"$/gm, '')] = elemParts[1].replace(/^\"/gm, '').replace(/\"$/gm, '');
          }
        }
      } else if(objElements[el][e].indexOf("[") > 0) {
        var elemParts = objElements[el][e].split(':');
        var elemPartsArr = elemParts[1].replace(/^\[/g,'').replace(/\]$/g,'').split(',');
        var tempPropArr = [];
        for(var prop = 0; prop < elemPartsArr.length; prop++) {
          tempPropArr.push(elemPartsArr[prop].replace(/^\"/gm, '').replace(/\"$/gm, ''));
        }
        tempElem[elemParts[0].replace(/^\"/gm, '').replace(/\"$/gm, '')] = tempPropArr;
      } else {
        var elemParts = objElements[el][e].split(':');
        tempElem[elemParts[0].replace(/^\"/gm, '').replace(/\"$/gm, '')] = elemParts[1].replace(/^\"/gm, '').replace(/\"$/gm, '');
      }
    }
    mainObj.objects.push(tempElem);
  }
  return mainObj;
}