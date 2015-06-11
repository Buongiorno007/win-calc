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

function centerBlock(points, block){
  var pointsQty = points.length,
      pointsIdQty = block.pointsID.length,
      i = 0;

    block.center = {
      centerX: 0,
      centerY: 0
    };
    block.pointsOut = [];

  for(; i < pointsIdQty; i++) {
    for(var j = 0; j < pointsQty; j++) {
      if(block.pointsID[i] === points[j].id) {
        block.pointsOut.push( JSON.parse(JSON.stringify(points[j])) );
        block.center.centerX += points[j].x;
        block.center.centerY += points[j].y;
      }
    }
  }
  block.center.centerX /= pointsIdQty;
  block.center.centerY /= pointsIdQty;
  return block;
}



function sortingPoints(block) {
  var blockPointsQty = block.pointsOut.length,
      i = 0;

  for(; i < blockPointsQty; i++) {
    block.pointsOut[i].fi = getAngelPoint(block.center, block.pointsOut[i]);
  }
  block.pointsOut.sort(function(a, b){
    return b.fi - a.fi;
  });
  return block;
}


function getAngelPoint(center, point) {
  var fi;
  fi = Math.atan2(center.centerY - point.y, point.x - center.centerX) * (180 / Math.PI);
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
//    line.size = Math.round(Math.sqrt( Math.pow((line.to.x - line.from.x), 2) + Math.pow((line.to.y - line.from.y), 2) ) * 100) / 100;
    line.size = Math.round(Math.hypot((line.to.x - line.from.x), (line.to.y - line.from.y)) * 100) / 100;
    line.coefA = (line.from.y - line.to.y);
    line.coefB = (line.to.x - line.from.x);
    line.coefC = (line.from.x*line.to.y - line.to.x*line.from.y);
    lines.push(line);
  }
  //------ change place last element in array to first
  var last = lines.pop();
  lines.unshift(last);

  return lines;
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
//  var newCoefC = line.coefC - (depth * Math.sqrt(Math.pow(line.coefA, 2) + Math.pow(line.coefB, 2)));
  var newCoefC = line.coefC - (depth * Math.hypot(line.coefA, line.coefB));
//  console.log('newCoefC = ', newCoefC);
  return newCoefC;
}



function getCoordCrossPoint(line1, line2, coefC1, coefC2) {

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
//  console.log(glassPoints);
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
      if(glassPoints[i].dir === 'curv'){
        part.path += glassPoints[pointsQty - 1].x + ',' + glassPoints[pointsQty - 1].y;
        part.path += ' Q ' + glassPoints[i].x + ',' + glassPoints[i].y + ',' + glassPoints[i+1].x + ',' + glassPoints[i+1].y;
        i++;

      //-------- if line
      } else {
        part.path += glassPoints[i].x + ',' + glassPoints[i].y;
      }

    } else {
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

  }
  part.square = calcSquare(glassPoints);
  return part;
}




function calcSquare(arrPoints) {
  var square = 0,
      p = 0,
      pointQty = arrPoints.length;

  for(; p < pointQty; p++) {
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
    //------- if block 1 and without sash, set corners points
    if(blocks[b].level === 1 && blocks[b].blockType === 'frame') {
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


function setPointsOut(pointsArr, label) {
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
      minX = d3.min(newPoints, function(d) { return d.x; }),
      maxX = d3.max(newPoints, function(d) { return d.x; }),
      minY = d3.min(newPoints, function(d) { return d.y; }),
      maxY = d3.max(newPoints, function(d) { return d.y; }),
      geomCenter = {
        x: (minX + maxX)/2,
        y: (minY + maxY)/2
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
        part.points.push(getCrossPointSashDir(1, center, geomCenter, 225, beadLines));
        part.points.push({x: geomCenter.x, y: minY});
        part.points.push(getCrossPointSashDir(1, center, geomCenter, 315, beadLines));
        break;
      //----- 'right'
      case 2:
        part.points.push(getCrossPointSashDir(2, center, geomCenter, 225, beadLines));
        part.points.push({x: maxX, y: geomCenter.y});
        part.points.push(getCrossPointSashDir(2, center, geomCenter, 135, beadLines));
        break;
      //------ 'down'
      case 3:
        part.points.push(getCrossPointSashDir(3, center, geomCenter, 135, beadLines));
        part.points.push({x: geomCenter.x, y: maxY});
        part.points.push(getCrossPointSashDir(3, center, geomCenter, 45, beadLines));
        break;
      //----- 'left'
      case 4:
        part.points.push(getCrossPointSashDir(4, center, geomCenter, 45, beadLines));
        part.points.push({x: minX, y: geomCenter.y});
        part.points.push(getCrossPointSashDir(4, center, geomCenter, 315, beadLines));
        break;
    }

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
          peak = {
            x: Math.pow(t,2) * (lines[l].points[0].x - 2*lines[l].points[1].x + lines[l].points[2].x) - 2*t*(lines[l].points[0].x - lines[l].points[1].x) + lines[l].points[0].x,
            y: Math.pow(t,2) * (lines[l].points[0].y - 2*lines[l].points[1].y + lines[l].points[2].y) - 2*t*(lines[l].points[0].y - lines[l].points[1].y) + lines[l].points[0].y
          };
      points.push(peak);
    } else {
      points.push(lines[l].to);
    }
  }
  return points;
}


function getCrossPointSashDir(position, centerMass, centerGeom, angel, lines) {
  var sashLineMark = cteateSashDirLine(centerGeom, angel);
  var crossPoints = getCrossPointInBlock(position, centerMass, sashLineMark, lines);
  return crossPoints;
}



function cteateSashDirLine(center, angel) {
  var k =  Math.tan(angel * Math.PI / 180),
    lineMark = {
      coefA: k,
      coefB: -1,
      coefC: (center.y - k*center.x)
    };
  return lineMark;
}



function getCrossPointInBlock(position, center, lineMark, lines) {
  var linesQty = lines.length,
//      crossPoints = [],
      l = 0;

  for(; l < linesQty; l++) {
    if(lines[l].dir === 'line') {
      var coord = findCrossPoint(lineMark, lines[l], lineMark.coefC, lines[l].coefC);
      if(coord.x > 0 && coord.y > 0) {
        coord.fi = getAngelPoint(center, coord);

        var px = (coord.x - lines[l].to.x)/(lines[l].from.x - lines[l].to.x);
        var py = (coord.y - lines[l].to.y)/(lines[l].from.y - lines[l].to.y);

        if(px >= 0 && px < 1 || py >=0 && py < 1) {
          console.log('TRUE = ', coord);
//          crossPoints.push(coord);
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
    } else {

//      var step = 0.01,
//          t = 0;
//      while(t <= 1) {
//        var sizeX = 2*((1-t)*(lines[1].x - lines[0].x) + t*(lines[2].x - lines[1].x));
//        var sizeY = 2*((1-t)*(lines[1].y - lines[0].y) + t*(lines[2].y - lines[1].y));
//        size += Math.hypot(sizeX, sizeY)*step;
//        t += step;
//      }

    }
  }
//  console.log('crossPoints ++++++', crossPoints);
//  return crossPoints;
}





function assamblingSashPath(arrPoints) {
  var path = 'M ' + arrPoints[0].x + ',' + arrPoints[0].y,
      p = 1,
      pointQty = arrPoints.length;

  for(; p < pointQty; p++) {
    path += ' L ' + arrPoints[p].x + ',' + arrPoints[p].y;
  }
  return path;
}


















//---------- for impost


function prepareLines(lines) {
  var linesQty = lines.length,
      newLines = [],
      p = 0;

  for(; p < linesQty; p++) {
    console.log(lines[p]);
    //----- passing if first line is curv
    if(p === 0 && lines[p].dir === 'curv' && lines[p+1].dir === 'line') {
      continue;
    }

    //------ if last line
    if(p === (linesQty - 1)) {
      //------- if one point is 'curv' from both
      if(lines[p].dir === 'curv' && lines[0].dir === 'curv') {
        var curve = {
          points: [],
          dir: 'curv'
        };
        curve.points.push(lines[p].from);
        curve.points.push(lines[p].to);
        curve.points.push(lines[0].to);
        newLines.push(curve);

      } else {
        //-------- if line
        newLines.push(lines[p]);
      }
    } else {

      //------- if curv
      if(lines[p].dir === 'curv' && lines[p+1].dir === 'curv') {
        var curve = {
          points: [],
          dir: 'curv'
        };
        curve.points.push(lines[p].from);
        curve.points.push(lines[p].to);
        curve.points.push(lines[p+1].to);
        newLines.push(curve);
        p++;
      } else {
        //-------- if line
        newLines.push(lines[p]);
      }
    }
  }

  return newLines;
}


////////////////////////////////////////////



var Template = function (sourceObj, depths) {
//  this.name = sourceObj.name;
  this.details = JSON.parse( JSON.stringify(sourceObj.details) );
  //this.dimentions = createDimentions(sourceObj);

  var blocksQty = this.details.skylights.length,
      i = 0;

  for(; i < blocksQty; i++) {
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
      this.details.skylights[i] = centerBlock(this.details.points, this.details.skylights[i]);
      this.details.skylights[i] = sortingPoints(this.details.skylights[i]);
      console.log('lineout');
      this.details.skylights[i].linesOut = setLines(this.details.skylights[i].pointsOut);

      if(this.details.skylights[i].level === 1) {
        setCornerProp(this.details.skylights);
//        $.merge(this.details.points , setDefaultArcPoints(this.details.skylights[i]));
      }
      //------- if block is empty
      if(this.details.skylights[i].children.length < 1) {
        this.details.skylights[i].pointsIn = setPointsIn(this.details.skylights[i], depths, 'frame');
//        console.log('linein');
        this.details.skylights[i].linesIn = setLines(this.details.skylights[i].pointsIn);

        //------- set points for each part of construction
        $.merge(this.details.skylights[i].parts, setParts(this.details.skylights[i].pointsOut, this.details.skylights[i].pointsIn));

        //------ if block is frame
        if(this.details.skylights[i].blockType === 'frame') {
          this.details.skylights[i].beadPointsOut = setPointsOut(this.details.skylights[i].pointsIn, 'bead');
          this.details.skylights[i].beadLinesOut = setLines(this.details.skylights[i].beadPointsOut);
          this.details.skylights[i].beadPointsIn = setPointsIn(this.details.skylights[i], depths, 'frame-bead');
//          this.details.skylights[i].beadLinesIn = setLines(this.details.skylights[i].beadPointsIn);

          this.details.skylights[i].glassPoints = setPointsIn(this.details.skylights[i], depths, 'frame-glass');
/*          this.details.skylights[i].glassLines = setLines(this.details.skylights[i].beadPointsIn);*/

          this.details.skylights[i].parts.push(setGlass(this.details.skylights[i].glassPoints));
          $.merge(this.details.skylights[i].parts, setParts(this.details.skylights[i].beadPointsOut, this.details.skylights[i].beadPointsIn));

        } else if(this.details.skylights[i].blockType === 'sash') {
          this.details.skylights[i].sashPointsOut = setPointsOut(setPointsIn(this.details.skylights[i], depths, 'sash-out'), 'sash');
//          console.log('sashout');
          this.details.skylights[i].sashLinesOut = setLines(this.details.skylights[i].sashPointsOut);
          this.details.skylights[i].sashPointsIn = setPointsIn(this.details.skylights[i], depths, 'sash-in');
//          this.details.skylights[i].sashLinesIn = setLines(this.details.skylights[i].sashPointsIn);

          this.details.skylights[i].hardwarePoints = setPointsIn(this.details.skylights[i], depths, 'hardware');
//          console.log('hardware');
          this.details.skylights[i].hardwareLines = setLines(this.details.skylights[i].sashPointsIn);

          this.details.skylights[i].beadPointsOut = setPointsOut(this.details.skylights[i].sashPointsIn, 'bead');
//          console.log('beadout');
          this.details.skylights[i].beadLinesOut = setLines(this.details.skylights[i].beadPointsOut);
          this.details.skylights[i].beadPointsIn = setPointsIn(this.details.skylights[i], depths, 'sash-bead');
//          console.log('beadin');
          this.details.skylights[i].beadLinesIn = setLines(this.details.skylights[i].beadPointsIn);

          this.details.skylights[i].glassPoints = setPointsIn(this.details.skylights[i], depths, 'sash-glass');
//          this.details.skylights[i].glassLines = setLines(this.details.skylights[i].beadPointsIn);

          $.merge(this.details.skylights[i].parts, setParts(this.details.skylights[i].sashPointsOut, this.details.skylights[i].sashPointsIn));
          this.details.skylights[i].parts.push(setGlass(this.details.skylights[i].glassPoints));
          $.merge(this.details.skylights[i].parts, setParts(this.details.skylights[i].beadPointsOut, this.details.skylights[i].beadPointsIn));

          //----- set openPoints for sash
          this.details.skylights[i].sashOpenDir = setOpenDir(this.details.skylights[i].openDir, this.details.skylights[i].center, this.details.skylights[i].beadLinesIn);
        }

      }
    }
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