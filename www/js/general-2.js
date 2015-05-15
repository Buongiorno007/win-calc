
// general-2.js

/* exported STEP, typingIndex, unvisibleClass, selectClass, activeClass, focuseClass, typingTextByChar, showElementWithDelay, typingTextWithDelay, addClassWithDelay, removeClassWithDelay */

'use strict';

var STEP = 50,
    typingIndex = true,

    selectClass = 'selected',
    focuseClass = 'focused',
    activeClass = 'active',
    unvisibleClass = 'unvisible',
    movePanelClass = 'move-panel',
    sounds = {
      menu: {start: 7.93, end: 11.7},
      swip: {start: 8, end: 9},
      price: {start: 21, end: 23.47},
      fly: {start: 0.57, end: 1.59},
      switching: {start: 1.81, end: 2.88}
    };

Array.prototype.min = function () {
  return this.reduce(function (p, v) {
    return ( p < v ? p : v );
  });
}

Array.prototype.max = function () {
  return this.reduce(function (p, v) {
    return ( p > v ? p : v );
  });
}

function typingTextByChar($textElem1, $textElem2) {
  var source = $textElem1.data('output'),
      newText = '',
      delay = 100,
      timerId;
  if (source !== undefined && source.length) {
    timerId = setInterval(function () {
      var hasChar = newText.length < source.length;

      //newText = this.buildTypingText(newText, source);
      newText = buildTypingText(newText, source);
      $textElem1.text(newText);

      if (!hasChar) {
        clearInterval(timerId);

        if ($textElem2) {
          typingTextByChar($textElem2);
        }
      }
    }, delay);
  }

  //this.buildTypingText = function (currentTxt, sourceTxt) {
  function buildTypingText (currentTxt, sourceTxt) {
    if (typingIndex && currentTxt.length < sourceTxt.length) {
      currentTxt += sourceTxt[currentTxt.length];
      return currentTxt;
    }
  }
}

function showElementWithDelay($element, delay) {
  setTimeout(function () {
    $element.removeClass(unvisibleClass);
  }, delay);
}

function typingTextWithDelay(element, delay) {
  setTimeout(function () {
    element.each(function () {
      typingTextByChar($(this));
    });
  }, delay);
}
/*
function addClassWithDelay(element, className, delay) {
  setTimeout(function () {
    $(element).addClass(className);
  }, delay);
}

function removeClassWithDelay(element, className, delay) {
  setTimeout(function () {
    $(element).removeClass(className);
  }, delay);
}

*/

//---------- Deactivate Size Box for SVG Construction
function deactiveSizeBox(sizeEditClass, sizeClass) {
  $('g.size-box-edited').each(function () {
    this.instance.removeClass(sizeEditClass);
    this.instance.addClass(sizeClass);
  });
}



//----------- Play audio sounds
function playSound(element) {
  var audioPlayer = document.getElementById('sounds');
  audioPlayer.currentTime = sounds[element].start;
  audioPlayer.play();

  var handle = function() {
    var end = sounds[element].end;
    if(this.currentTime >= end) {
      this.pause();
      this.removeEventListener('timeupdate', handle);
    }
  };
  audioPlayer.addEventListener('timeupdate', handle, false);
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



var CPoint= function (sourceObj, depthSource) {
  FrameObject.call(this, sourceObj);
  this.lineId1 = sourceObj.line1;
  this.lineId2 = sourceObj.line2;
  this.depths = depthSource;
  this.blockType = sourceObj.blockType;
  //this.isImpost = sourceObj.isImpost;
  //this.insideImpost = sourceObj.insideImpost;

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

    this.getCoordinates(this.line1, this.line2, this.depth1, this.depth2);
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




//-----------Cross Point for Impost, Sash, Glass Package -------------------
var CrossPointDiff = function (sourceObj, depthSource, depthSource2) {
  FrameObject.call(this, sourceObj);
  this.lineId1 = sourceObj.line1;
  this.lineId2 = sourceObj.line2;
  this.depth = depthSource;
  this.depthDif = depthSource2;
  this.blockType = sourceObj.blockType;
  this.isImpost = sourceObj.isImpost;
  this.insideImpost = sourceObj.insideImpost;
  this.parseIds = function(fullTemplate) {
    this.line1 = fullTemplate.findById(this.lineId1);
    this.line2 = fullTemplate.findById(this.lineId2);
    this.getCoordinates(this.line1, this.line2, this.depth, this.depthDif);
  };

  this.getCoordinates = function(line1, line2, depth, depthDif) {
    var newCoefC1, newCoefC2;
    if(line1.id.indexOf('impost')+1) {
      newCoefC1 = this.getNewCoefC(depthDif ,line1);
    } else {
      newCoefC1 = this.getNewCoefC(depth ,line1);
    }

    if(line2.id.indexOf('impost')+1) {
      newCoefC2 = this.getNewCoefC(depthDif ,line2);
    } else {
      newCoefC2 = this.getNewCoefC(depth ,line2);
    }
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
CrossPointDiff.prototype = FrameObject;


//-----------SashLine-------------------
var SashLine = function (sourceObj) {
  LineObject.call(this, sourceObj);
};
SashLine.prototype = LineObject;

//-----------BeadBoxLine-------------------
var BeadBoxLine = function (sourceObj) {
  LineObject.call(this, sourceObj);
};
BeadBoxLine.prototype = LineObject;

//-----------ImpostLine-------------------
var ImpostLine = function (sourceObj) {
  LineObject.call(this, sourceObj);
};
ImpostLine.prototype = LineObject;

//-----------GlassLine-------------------
var GlassLine = function (sourceObj) {
  LineObject.call(this, sourceObj);
};
GlassLine.prototype = LineObject;


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

function buildFrames(sourceObj, depths) {
  var allFramePoints = [];
  var centerX = 0, centerY = 0;

  for (var i = 0; i < sourceObj.objects.length; i++) {
    if(sourceObj.objects[i].type === 'fixed_point') {
      allFramePoints.push(sourceObj.objects[i]);
      console.log('sourceObj.objects[i].x == ', sourceObj.objects[i].x);
      centerX = +centerX + sourceObj.objects[i].x;
      centerY = +centerY + sourceObj.objects[i].y;
    }
  }
  console.log('centerX == ', centerX);
  console.log('centerY == ', centerY);
  centerX = centerX/allFramePoints.length;
  centerY = centerY/allFramePoints.length;
  console.log('centerX == ', centerX);
  console.log('centerY == ', centerY);
  for(var i = 0; i < allFramePoints.length; i++) {
console.log('id == ', allFramePoints[i].id);
    var fi = Math.atan2(centerY - allFramePoints[i].y, allFramePoints[i].x - centerX) * (180 / Math.PI);

    console.log(Math.atan2(centerY - allFramePoints[i].y, allFramePoints[i].x - centerX));
    if(fi < 0) {
      fi = 360 + fi;
    }
    console.log('fi == ', fi);
  }

  for(var i = 1; i < allFramePoints.length; i++) {
    console.log('id == ', allFramePoints[i].id);
    var f = Math.atan2(allFramePoints[0].y - allFramePoints[i].y, allFramePoints[i].x - allFramePoints[0].x) * (180 / Math.PI);

    console.log(Math.atan2(allFramePoints[0].y - allFramePoints[i].y, allFramePoints[i].x - allFramePoints[0].x));
    console.log('f == ', f);
    if(f < 0) {
      f = 360 + f;
    }
    console.log('f 2== ', f);
  }

};

//----- create fixed points of corners
function setFixedPointCorners(sourceObj) {
  var dictance = 20,
      corners = [],
      corner = {};

  for (var i = 0; i < sourceObj.objects.length; i++) {
    if(sourceObj.objects[i].type === 'skylight' && !sourceObj.objects[i].level) {
      for(var j = 0; j < sourceObj.objects[i].points.length; j++) {
        var fpN = Number(sourceObj.objects[i].points[j].replace(/\D+/g, ""));
        if(fpN === 1) {
          corner = {
            type: 'fixed_point_corner',
            id: 'fp_corner'+fpN+'_1',
            x: 20,
            y: 0
          };
          console.log('sourceObj.objects[i].x == ', sourceObj.objects[i].x);
          sourceObj.objects.push(corner);
        }
      }

    }
  }

}

var Template = function (sourceObj, depths) {
  this.name = sourceObj.name;
  //this.shortName = sourceObj.short_name;
  sourceObj.objects.push({'type':'fixed_point', id:'fp_corner1_1', x:20, y:0});
  this.objects = [];
  buildFrames(sourceObj, depths);
  var tmpObject;
  for (var i = 0; i < sourceObj.objects.length; i++) {
    tmpObject = null;
    switch(sourceObj.objects[i].type) {
      case 'fixed_point':
      case 'fixed_point_impost': tmpObject = new FixedPoint(sourceObj.objects[i]);
        break;
      case 'fixed_point':
        break;
      case 'frame_line':
      case 'frame_in_line': tmpObject = new FrameLine(sourceObj.objects[i]);
        break;
      case 'cross_point':  tmpObject = new CrossPoint(sourceObj.objects[i], depths.frameDepth.c);
        break;
      case 'impost_line':
      case 'impost_in_line': tmpObject = new LineObject(sourceObj.objects[i]); //tmpObject = new ImpostLine(sourceObj.objects[i]);
        break;
      case 'cross_point_impost':
        tmpObject = new CPoint(sourceObj.objects[i], depths);
        /*
        if(sourceObj.objects[i].blockType === 'sash') {
          tmpObject = new CrossPointDiff(sourceObj.objects[i], (depths.frameDepth.b + depths.sashDepth.c), depths.impostDepth.c/2);
        } else if(sourceObj.objects[i].blockType === 'frame') {
          tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.c, depths.impostDepth.c/2);
        }
        */
        break;




      case 'sash_line':  tmpObject = new LineObject(sourceObj.objects[i]); //tmpObject = new SashLine(sourceObj.objects[i]);
        break;
      case 'cross_point_sash_out':
        tmpObject = new CPoint(sourceObj.objects[i], depths);
        /*
        if(sourceObj.objects[i].isImpost) {
          tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.b, depths.impostDepth.d);
        } else {
          tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.b, depths.frameDepth.b);
        }
        */
        break;
      case 'cross_point_hardware': tmpObject = new CrossPoint(sourceObj.objects[i], depths.sashDepth.b);
        break;
      case 'hardware_line': tmpObject = new LineObject(sourceObj.objects[i]); //tmpObject = new SashLine(sourceObj.objects[i]);
        break;
      case 'cross_point_sash_in':  tmpObject = new CrossPoint(sourceObj.objects[i], depths.sashDepth.c);
        break;
      case 'sash_out_line':  tmpObject = new LineObject(sourceObj.objects[i]); //tmpObject = new SashLine(sourceObj.objects[i]);
        break;
      case 'cross_point_bead_out':
        tmpObject = new CPoint(sourceObj.objects[i], depths);
        /*
        if(sourceObj.objects[i].blockType === 'sash') {
          if(sourceObj.objects[i].isImpost) {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], (depths.frameDepth.b + depths.sashDepth.c), (depths.impostDepth.d + depths.sashDepth.c));
          } else if(sourceObj.objects[i].insideImpost) {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], (depths.frameDepth.b + depths.sashDepth.c), depths.impostDepth.c/2);
          } else {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], (depths.frameDepth.b + depths.sashDepth.c), (depths.frameDepth.b + depths.sashDepth.c));
          }
        } else if(sourceObj.objects[i].blockType === 'frame') {
          if(sourceObj.objects[i].isImpost) {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.c, depths.impostDepth.c/2);
          } else {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.c, depths.frameDepth.c);
          }
        }
        */
        break;
      case 'bead_line':  tmpObject = new LineObject(sourceObj.objects[i]); //tmpObject = new BeadBoxLine(sourceObj.objects[i]);
        break;
      case 'cross_point_bead':  tmpObject = new CrossPoint(sourceObj.objects[i], 20);
        break;
      case 'bead_in_line':  tmpObject = new LineObject(sourceObj.objects[i]); //tmpObject = new BeadBoxLine(sourceObj.objects[i]);
        break;
      case 'cross_point_glass':
        tmpObject = new CPoint(sourceObj.objects[i], depths);
        /*
        if(sourceObj.objects[i].blockType === 'frame') {
          //---- is close type block
          if(sourceObj.objects[i].isImpost) {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.d, depths.impostDepth.b);
          } else {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.d, depths.frameDepth.d);
          }
        } else if(sourceObj.objects[i].blockType === 'sash') {
          if(sourceObj.objects[i].isImpost) {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], (depths.frameDepth.b + depths.sashDepth.d), (depths.impostDepth.d + depths.sashDepth.d));
          } else if(sourceObj.objects[i].insideImpost) {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], (depths.frameDepth.b + depths.sashDepth.d), depths.impostDepth.b);
          } else {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], (depths.frameDepth.b + depths.sashDepth.d), (depths.frameDepth.b + depths.sashDepth.d));
          }
        }
        */
        break;
      case 'glass_line':  tmpObject = new LineObject(sourceObj.objects[i]); //tmpObject = new GlassLine(sourceObj.objects[i]);
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
  this.name      = sourceObj.name;
  this.objects = [];

  var tmpObject,
      coeffScale = 3;

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
      case 'impost_in_line': tmpObject = new ImpostLine(sourceObj.objects[i]);
        break;
      case 'cross_point_impost':
        //tmpObject = new CPoint(sourceObj.objects[i], depths);

        if(sourceObj.objects[i].blockType === 'sash') {
          tmpObject = new CrossPointDiff(sourceObj.objects[i], (depths.frameDepth.c + depths.sashDepth.c) * coeffScale, (depths.impostDepth.c/2 + depths.sashDepth.c) * coeffScale);
        } else if(sourceObj.objects[i].blockType === 'frame') {
          tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.c * coeffScale,  (depths.impostDepth.c/2) * coeffScale );
        }
        break;
      case 'sash_line':  tmpObject = new SashLine(sourceObj.objects[i]);
        break;
      case 'cross_point_sash_out':
        if(sourceObj.objects[i].isImpost) {
          tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.b * coeffScale, depths.impostDepth.d * coeffScale);
        } else {
          tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.b * coeffScale, depths.frameDepth.b * coeffScale);
        }
        break;
      case 'cross_point_sash_in':  tmpObject = new CrossPoint(sourceObj.objects[i], depths.sashDepth.c * coeffScale);
        break;
      case 'sash_out_line':  tmpObject = new SashLine(sourceObj.objects[i]);
        break;
      case 'cross_point_bead_out':
        if(sourceObj.objects[i].blockType === 'sash') {
          if(sourceObj.objects[i].isImpost) {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], (depths.frameDepth.b + depths.sashDepth.c)* coeffScale, (depths.impostDepth.d + depths.sashDepth.c)* coeffScale);
          } else {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], (depths.frameDepth.b + depths.sashDepth.c)* coeffScale, (depths.frameDepth.b + depths.sashDepth.c)* coeffScale);
          }
        } else if(sourceObj.objects[i].blockType === 'frame') {
          if(sourceObj.objects[i].isImpost) {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.c * coeffScale, depths.impostDepth.c/2 * coeffScale);
          } else {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.c * coeffScale, depths.frameDepth.c * coeffScale);
          }
        }
        break;
      case 'bead_line':  tmpObject = new BeadBoxLine(sourceObj.objects[i]);
        break;
      case 'cross_point_bead':  tmpObject = new CrossPoint(sourceObj.objects[i], 20);
        break;
      case 'bead_in_line':  tmpObject = new BeadBoxLine(sourceObj.objects[i]);
        break;
      case 'cross_point_glass':
        if(sourceObj.objects[i].blockType === 'frame') {
          //---- is close type block
          if(sourceObj.objects[i].isImpost) {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.d * coeffScale, depths.impostDepth.b * coeffScale);
          } else {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], depths.frameDepth.d * coeffScale, depths.frameDepth.d * coeffScale);
          }
        } else if(sourceObj.objects[i].blockType === 'sash') {
          //---- is open type block
          if(sourceObj.objects[i].isImpost) {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], (depths.frameDepth.b + depths.sashDepth.d) * coeffScale, (depths.impostDepth.d + depths.impostDepth.d) * coeffScale);
          } else if(sourceObj.objects[i].insideImpost) {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], (depths.frameDepth.b + depths.sashDepth.d) * coeffScale, depths.impostDepth.b * coeffScale);
          } else {
            tmpObject = new CrossPointDiff(sourceObj.objects[i], (depths.frameDepth.b + depths.sashDepth.d) * coeffScale, (depths.frameDepth.b + depths.sashDepth.d) * coeffScale);
          }
        }
        break;
      case 'glass_line':  tmpObject = new GlassLine(sourceObj.objects[i]);
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