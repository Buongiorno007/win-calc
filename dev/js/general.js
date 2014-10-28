/* exported STEP, typingIndex, unvisibleClass, selectClass, activeClass, focuseClass, typingTextByChar, showElementWithDelay, typingTextWithDelay, addClassWithDelay, removeClassWithDelay */

'use strict';

var STEP = 100,
    typingIndex = true,

    selectClass = 'selected',
    focuseClass = 'focused',
    activeClass = 'active',
    unvisibleClass = 'unvisible',
    movePanelClass = 'move-panel';


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






//--------- TEMPLATE JSON PARSE ----------------

var FrameObject = function (sourceObj) {
  this.id = sourceObj.id;
  this.type = sourceObj.type;
  this.listId = 0; //это будет ID перечня из базы, у точек будет listId = 0
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
  this.listId = 7;  // = Service.GetDefaultFrameLineListId();
};
FrameLine.prototype = LineObject;

//-----------CrossPoint-------------------
var CrossPoint = function (sourceObj, depthSource) {
  FrameObject.call(this, sourceObj);
  this.depth = depthSource;
  this.lineId1 = sourceObj.line1;
  this.lineId2 = sourceObj.line2;

  this.parseIds = function(fullTemplate) {
    this.line1 = fullTemplate.findById(this.lineId1);
    this.line2 = fullTemplate.findById(this.lineId2);
    this.getCoordinates(this.line1, this.line2);
  };

  this.getCoordinates = function(line1, line2) {
    var newCoefC1 = this.getNewCoefC(this.depth ,line1),
        newCoefC2 = this.getNewCoefC(this.depth ,line2);
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

//-----------SashLine-------------------
var SashLine = function (sourceObj) {
  LineObject.call(this, sourceObj);
  this.listId = 100;  // = Service.GetDefaulSashLineListId();
};
SashLine.prototype = LineObject;

//-----------BeadBoxLine-------------------
var BeadBoxLine = function (sourceObj) {
  LineObject.call(this, sourceObj);
};
BeadBoxLine.prototype = LineObject;



var Template = function (sourceObj, depth) {
  this.name      = sourceObj.name;
  this.shortName = sourceObj.short_name;
  this.objects = [];

  var tmpObject;
  for (var i = 0; i < sourceObj.objects.length; i++) {
    tmpObject = null;
    switch(sourceObj.objects[i].type) {
      case 'fixed_point':  tmpObject = new FixedPoint(sourceObj.objects[i]);
        break;
      case 'frame_line':  tmpObject = new FrameLine(sourceObj.objects[i]);
        break;
      case 'cross_point':  tmpObject = new CrossPoint(sourceObj.objects[i], depth);
        break;
      case 'sash_line':  tmpObject = new SashLine(sourceObj.objects[i]);
        break;
      case 'bead_box_line':  tmpObject = new BeadBoxLine(sourceObj.objects[i]);
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