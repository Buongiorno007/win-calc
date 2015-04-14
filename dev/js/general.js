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



function changeTemplateInArray(templateIndex, templateSourceList, templateList, templateIconList, newTemplateSource, newTemplate, newTemplateIcon) {
  //----- write new template in array
  templateSourceList[templateIndex] = angular.copy(newTemplateSource);
  templateList[templateIndex] = angular.copy(newTemplate);
  templateIconList[templateIndex] = angular.copy(newTemplateIcon);
}



//---------- Deactivate Size Box for SVG Construction
function deactiveSizeBox(sizeRectActClass, sizeBoxActClass) {
  $('g.size-box').each(function () {
    $(this).find('.'+sizeRectActClass).addClass('size-rect').removeClass(sizeRectActClass);
    $(this).find('.'+sizeBoxActClass).addClass('size-value-edit').removeClass(sizeBoxActClass);
  });
}





//--------- TEMPLATE JSON PARSE ----------------

var FrameObject = function (sourceObj) {
  this.id = sourceObj.id;
  this.type = sourceObj.type;
};

//-----------FixedPoint-------------------
var FixedPoint = function (sourceObj) {
  FrameObject.call(this, sourceObj);
  this.x = sourceObj.x;
  this.y = sourceObj.y;
};
FixedPoint.prototype = FrameObject;

//-----------LineObject-------------------
var LineObject = function (sourceObj) {
  FrameObject.call(this, sourceObj);
  this.fromPointId = sourceObj.from;
  this.toPointId = sourceObj.to;
  this.lineType = sourceObj.lineType;

  this.parseIds = function(fullTemplate) {
    this.fromPoint = fullTemplate.findById(this.fromPointId);
    this.toPoint = fullTemplate.findById(this.toPointId);
    this.getLength(this.fromPoint, this.toPoint);
  };

  this.getLength = function(fromPoint, toPoint) {
    var x1 = parseFloat(fromPoint.x),
        x2 = parseFloat(toPoint.x),
        y1 = parseFloat(fromPoint.y),
        y2 = parseFloat(toPoint.y);

    this.lengthVal = Math.round(Math.sqrt( Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2) ) * 100) / 100;

    this.coefA = (y1 - y2);
    this.coefB = (x2 - x1);
    this.coefC = (x1*y2 - x2*y1);
  }
};
LineObject.prototype = FrameObject;

//-----------FrameLine-------------------
var FrameLine = function (sourceObj) {
  LineObject.call(this, sourceObj);
  this.sill = sourceObj.sill;
};
FrameLine.prototype = LineObject;

//-----------CrossPoint-------------------
var CrossPoint = function (sourceObj, depthSource) {
  FrameObject.call(this, sourceObj);
  this.lineId1 = sourceObj.line1;
  this.lineId2 = sourceObj.line2;
  this.depth = depthSource;

  this.parseIds = function(fullTemplate) {
    this.line1 = fullTemplate.findById(this.lineId1);
    this.line2 = fullTemplate.findById(this.lineId2);
    this.getCoordinates(this.line1, this.line2, this.depth);
  };

  this.getCoordinates = function(line1, line2, depth) {
    var newCoefC1 = this.getNewCoefC(depth ,line1),
        newCoefC2 = this.getNewCoefC(depth ,line2);
    this.getCoordCrossPoint (line1, line2, newCoefC1, newCoefC2);
  };

  this.getNewCoefC = function (depth, line) {
    var newCoefC = line.coefC - (depth * Math.sqrt(Math.pow(line.coefA, 2) + Math.pow(line.coefB, 2)));
    return newCoefC;
  };

  this.getCoordCrossPoint = function(line1, line2, coefC1, coefC2) {
    var coefA1 = line1.coefA,
        coefB1 = line1.coefB,
        coefA2 = line2.coefA,
        coefB2 = line2.coefB,
        base = (coefA1 * coefB2) - (coefA2 * coefB1),
        baseX = ((-coefC1) * coefB2) - (coefB1 * (-coefC2)),
        baseY = (coefA1 * (-coefC2)) - (coefA2 * (-coefC1));
    this.x = baseX / base;
    this.y = baseY / base;
  };
};
CrossPoint.prototype = FrameObject;



var CPoint= function (sourceObj, depthSource, coeffScale) {
  FrameObject.call(this, sourceObj);
  this.lineId1 = sourceObj.line1;
  this.lineId2 = sourceObj.line2;
  this.depths = depthSource;
  this.blockType = sourceObj.blockType;

  this.parseIds = function(fullTemplate) {
    this.line1 = fullTemplate.findById(this.lineId1);
    this.line2 = fullTemplate.findById(this.lineId2);

    if(sourceObj.type === 'cross_point_impost') {
      if (this.blockType === 'frame') {
        if (this.line1.id.indexOf('impostcenterline') + 1) {
          this.depth1 = this.depths.impostDepth.c / 2;
        } else {
          this.depth1 = this.depths.frameDepth.c;
        }
        if (this.line2.id.indexOf('impostcenterline') + 1) {
          this.depth2 = this.depths.impostDepth.c / 2;
        } else {
          this.depth2 = this.depths.frameDepth.c;
        }

      } else if (this.blockType === 'sash') {
        if (this.line1.id.indexOf('impostcenterline') + 1) {
          if (this.line1.lineType === 'sash') {
            this.depth1 = (this.depths.impostDepth.d) + this.depths.sashDepth.c;
          } else if (this.line1.lineType === 'frame') {
            this.depth1 = this.depths.impostDepth.c / 2;
          }
        } else {
          this.depth1 = (this.depths.frameDepth.b + this.depths.sashDepth.c);
        }
        if (this.line2.id.indexOf('impostcenterline') + 1) {
          if (this.line2.lineType === 'sash') {
            this.depth2 = (this.depths.impostDepth.d) + this.depths.sashDepth.c;
          } else if (this.line2.lineType === 'frame') {
            this.depth2 = this.depths.impostDepth.c / 2;
          }
        } else {
          this.depth2 = (this.depths.frameDepth.b + this.depths.sashDepth.c);
        }
      }
    } else if(sourceObj.type === 'cross_point_sash_out') {
        if (this.line1.id.indexOf('impostcenterline') + 1) {
          this.depth1 = this.depths.impostDepth.d;
        } else {
          this.depth1 = this.depths.frameDepth.b;
        }
        if (this.line2.id.indexOf('impostcenterline') + 1) {
          this.depth2 = this.depths.impostDepth.d;
        } else {
          this.depth2 = this.depths.frameDepth.b;
        }
    } else if(sourceObj.type === 'cross_point_bead_out') {
      if (this.blockType === 'frame') {
        if (this.line1.id.indexOf('impostcenterline') + 1) {
          this.depth1 = this.depths.impostDepth.c / 2;
        } else {
          this.depth1 = this.depths.frameDepth.c;
        }
        if (this.line2.id.indexOf('impostcenterline') + 1) {
          this.depth2 = this.depths.impostDepth.c / 2;
        } else {
          this.depth2 = this.depths.frameDepth.c;
        }

      } else if (this.blockType === 'sash') {
        if (this.line1.id.indexOf('impostcenterline') + 1) {
          if (this.line1.lineType === 'sash') {
            this.depth1 = (this.depths.impostDepth.d + this.depths.sashDepth.c);
          } else if (this.line1.lineType === 'frame') {
            this.depth1 = this.depths.impostDepth.c / 2;
          }
        } else {
          this.depth1 = (this.depths.frameDepth.b + this.depths.sashDepth.c);
        }
        if (this.line2.id.indexOf('impostcenterline') + 1) {
          if (this.line2.lineType === 'sash') {
            this.depth2 = (this.depths.impostDepth.d + this.depths.sashDepth.c);
          } else if (this.line2.lineType === 'frame') {
            this.depth2 = this.depths.impostDepth.c / 2;
          }
        } else {
          this.depth2 = (this.depths.frameDepth.b + this.depths.sashDepth.c);
        }
      }
    } else if(sourceObj.type === 'cross_point_glass') {
      if (this.blockType === 'frame') {
        if (this.line1.id.indexOf('impostcenterline') + 1) {
          this.depth1 = this.depths.impostDepth.b;
        } else {
          this.depth1 = this.depths.frameDepth.d;
        }
        if (this.line2.id.indexOf('impostcenterline') + 1) {
          this.depth2 = this.depths.impostDepth.b;
        } else {
          this.depth2 = this.depths.frameDepth.d;
        }

      } else if (this.blockType === 'sash') {
        if (this.line1.id.indexOf('impostcenterline') + 1) {
          if (this.line1.lineType === 'sash') {
            this.depth1 = (this.depths.impostDepth.d + this.depths.sashDepth.d);
          } else if (this.line1.lineType === 'frame') {
            this.depth1 = this.depths.impostDepth.b;
          }
        } else {
          this.depth1 = (this.depths.frameDepth.b + this.depths.sashDepth.d);
        }
        if (this.line2.id.indexOf('impostcenterline') + 1) {
          if (this.line2.lineType === 'sash') {
            this.depth2 = (this.depths.impostDepth.d + this.depths.sashDepth.d);
          } else if (this.line2.lineType === 'frame') {
            this.depth2 = this.depths.impostDepth.b;
          }
        } else {
          this.depth2 = (this.depths.frameDepth.b + this.depths.sashDepth.d);
        }
      }
    }

    this.getCoordinates(this.line1, this.line2, (this.depth1 * coeffScale), (this.depth2 * coeffScale));
  };

  this.getCoordinates = function(line1, line2, depth1, depth2) {
    var newCoefC1 = this.getNewCoefC(depth1 ,line1),
        newCoefC2 = this.getNewCoefC(depth2 ,line2);
    this.getCoordCrossPoint (line1, line2, newCoefC1, newCoefC2);
  };

  this.getNewCoefC = function (depth1, line) {
    var newCoefC = line.coefC - (depth1 * Math.sqrt(Math.pow(line.coefA, 2) + Math.pow(line.coefB, 2)));
    return newCoefC;
  };

  this.getCoordCrossPoint = function(line1, line2, coefC1, coefC2) {
    var coefA1 = line1.coefA,
        coefB1 = line1.coefB,
        coefA2 = line2.coefA,
        coefB2 = line2.coefB,
        base = (coefA1 * coefB2) - (coefA2 * coefB1),
        baseX = ((-coefC1) * coefB2) - (coefB1 * (-coefC2)),
        baseY = (coefA1 * (-coefC2)) - (coefA2 * (-coefC1));

    this.x = baseX / base;
    this.y = baseY / base;
  };
};
CPoint.prototype = FrameObject;





//-----------Frame Object-------------------
var Frame = function (sourceObj) {
  FrameObject.call(this, sourceObj);
  this.parts = [];

  this.parseParts = function(fullTemplate) {
    for(var p = 0; p < sourceObj.parts.length; p++) {
      var part = fullTemplate.findById(sourceObj.parts[p]);
      this.parts.push(part);
    }
  };

};
Frame.prototype = FrameObject;

//-----------Sash Object-------------------
var Sash = function (sourceObj) {
  FrameObject.call(this, sourceObj);
  this.parts = [];
  this.openType = [];

  this.parseParts = function(fullTemplate) {
    for(var p = 0; p < sourceObj.parts.length; p++) {
      var part = fullTemplate.findById(sourceObj.parts[p]);
      this.parts.push(part);
    }
    if(sourceObj.openType) {
      for(var t = 0; t < sourceObj.openType.length; t++) {
        var direction = fullTemplate.findById(sourceObj.openType[t]);
        this.openType.push(direction);
      }
    }
  };

};
Sash.prototype = FrameObject;


//-----------SashBlock Object-------------------
var SashBlock = function (sourceObj) {
  FrameObject.call(this, sourceObj);
  this.parts = [];
  this.openDir = sourceObj.openDir;
  this.handlePos = sourceObj.handlePos;

  this.parseParts = function(fullTemplate) {
    for(var p = 0; p < sourceObj.parts.length; p++) {
      var part = fullTemplate.findById(sourceObj.parts[p]);
      this.parts.push(part);
    }
  };
};
SashBlock.prototype = FrameObject;


//-----------Glass Object-------------------
var Glass = function (sourceObj) {
  FrameObject.call(this, sourceObj);
  this.parts = [];

  this.parseParts = function(fullTemplate) {
    for(var p = 0; p < sourceObj.parts.length; p++) {
      var part = fullTemplate.findById(sourceObj.parts[p]);
      this.parts.push(part);
      //-------- calculate glass square
      if(p  === sourceObj.parts.length - 1) {
        this.square = (this.parts[0].lengthVal * this.parts[p].lengthVal) / 1000000;
      }
    }

  };
};
Glass.prototype = FrameObject;

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
FrameLine.prototype = LineObject;

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
Square.prototype = FrameObject;


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


var Template = function (sourceObj, depths) {
  this.name = sourceObj.name;
  this.objects = [];
  this.dimentions = createDimentions(sourceObj);

  var tmpObject,
      coeffScale = 1;

  for (var i = 0; i < sourceObj.objects.length; i++) {
    tmpObject = null;
    switch(sourceObj.objects[i].type) {
      case 'fixed_point':
      case 'fixed_point_impost': tmpObject = new FixedPoint(sourceObj.objects[i]);
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