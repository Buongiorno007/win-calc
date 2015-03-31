
// app.js

'use strict';

window.BauVoiceApp = angular.module('BauVoiceApp', [
  'ngRoute',
  'angular-websql',
  'pascalprecht.translate',
  'hmTouchEvents',
  'ngCordova'
])
.config([
  '$routeProvider',
  '$locationProvider',
  '$httpProvider',
  '$translateProvider',
  function ($routeProvider, $locationProvider, $httpProvider, $translateProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '../views/login.html',
        controller: 'LoginCtrl',
        title: 'Login'
      })
      .when('/main', {
        templateUrl: '../views/main.html',
        controller: 'MainCtrl',
        title: 'Main'
      })
      .when('/settings', {
        templateUrl: '../views/settings.html',
        controller: 'SettingsCtrl',
        title: 'Settings'
      })
      .when('/change-pass', {
        templateUrl: '../views/change-pass.html',
        controller: 'ChangePassCtrl',
        title: 'Change Pass'
      })
      .when('/change-lang', {
        templateUrl: '../views/change-lang.html',
        controller: 'ChangeLangCtrl',
        title: 'Change Language'
      })
      .when('/location', {
        templateUrl: '../views/location.html',
        controller: 'LocationCtrl',
        title: 'Location'
      })
      .when('/history', {
        templateUrl: '../views/history.html',
        controller: 'HistoryCtrl',
        title: 'History'
      })
      .when('/cart', {
        templateUrl: '../views/cart.html',
        controller: 'CartCtrl',
        title: 'Cart'
      })
      .when('/construction', {
        templateUrl: '../views/construction.html',
        controller: 'ConstructionCtrl',
        title: 'Construction'
      })
      .otherwise({
        redirectTo: '/'
      });

//    $locationProvider
//      .html5Mode(true);

    $translateProvider.translations('ru', russianDictionary);
    $translateProvider.translations('ua', ukrainianDictionary);
    $translateProvider.translations('en', englishDictionary);
    $translateProvider.translations('de', germanDictionary);
    $translateProvider.translations('ro', romanianDictionary);

    $translateProvider.preferredLanguage('ru');


    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = [function(data) {
      var param = function(obj)
      {
        var query = '';
        var name, value, fullSubName, subValue, innerObj, i, subName;

        for(name in obj)
        {
          value = obj[name];

          if(value instanceof Array)
          {
            for(i=0; i<value.length; ++i)
            {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value instanceof Object)
          {
            for(subName in value)
            {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += param(innerObj) + '&';
            }
          }
          else if(value !== undefined && value !== null)
          {
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
          }
        }

        return query.length ? query.substr(0, query.length - 1) : query;
      };

      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];


  }
]);


// general.js

/* exported STEP, typingIndex, unvisibleClass, selectClass, activeClass, focuseClass, typingTextByChar, showElementWithDelay, typingTextWithDelay, addClassWithDelay, removeClassWithDelay */

'use strict';

var STEP = 50,
    typingIndex = true,

    selectClass = 'selected',
    focuseClass = 'focused',
    activeClass = 'active',
    unvisibleClass = 'unvisible',
    movePanelClass = 'move-panel',
    soundsIntervals = {
      menu: {start: 7.93, end: 11.7},
      swip: {start: 8, end: 9},
      price: {from: 21.5, to: 23.2},
      fly: {start: 0.57, end: 1.59},
      switching: {start: 1.81, end: 2.88}
    };

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
function deactiveSizeBox(sizeRectActClass, sizeBoxActClass) {
  $('g.size-box').each(function () {
    $(this).find('.'+sizeRectActClass).addClass('size-rect').removeClass(sizeRectActClass);
    $(this).find('.'+sizeBoxActClass).addClass('size-value-edit').removeClass(sizeBoxActClass);
  });
}
/*
function deactiveSizeBox(sizeEditClass, sizeClass) {
  $('g.size-box-edited').each(function () {
    this.instance.removeClass(sizeEditClass);
    this.instance.addClass(sizeClass);
  });
}
*/

//----------- Play audio sounds

function playSound(element) {
  var audioPlayer = document.getElementById('sounds');
  //console.log('currentTime1', audioPlayer.currentTime);
  audioPlayer.pause();
  audioPlayer.currentTime = soundsIntervals[element].from;
  if(audioPlayer.currentTime === soundsIntervals[element].from) {
    audioPlayer.play();
    audioPlayer.addEventListener('timeupdate', handle, false);
  }
  //console.log('currentTime2', audioPlayer.currentTime);
  function handle() {
    var end = soundsIntervals[element].to;
    //console.log(this.currentTime + ' = ' + end);
    if(this.currentTime >= end) {
      this.pause();
      this.removeEventListener('timeupdate', handle);
    }
  }
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


// nuancespeechkit.js


var NuanceSpeechKitPlugin = function() {
};

// **Initialize speech kit**
//
// `credentialClassName`  The class name to be loaded to retrieve the app id and key  
// `serverName`  The hostname of the server to connect to  
// `port`  The port number for connection  
// `sslEnabled`  True if SSL is enabled for the connection  
// `successCallback`  The callback function for success  
// `failureCallback`  The callback function for error  
NuanceSpeechKitPlugin.prototype.initialize = function(credentialClassName,
                                                      serverName, port, sslEnabled,
                                                      successCallback, failureCallback) {
    return Cordova.exec( successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "initSpeechKit",
                         [credentialClassName, serverName, port, sslEnabled]);
};

// **Clean up speech kit**
//
// `successCallback` The callback function for success  
// `failureCallback` The callback function for error  
NuanceSpeechKitPlugin.prototype.cleanup = function(successCallback, failureCallback) {
    return Cordova.exec(successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "cleanupSpeechKit",
                         []);
};

// **Starts speech recognition**
//
// `recoType`  Type of recognition (dictation or websearch)  
// `language`  Language code for recognition  
// `successCallback`  The callback function for success  
// `failureCallback`  The callback function for error  
NuanceSpeechKitPlugin.prototype.startRecognition = function(recoType, language,
                                                            successCallback, failureCallback) {
    return Cordova.exec(successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "startRecognition",
                         [recoType, language]);
};

// **Stops speech recognition**
//
// `successCallback`  The callback function for success  
// `failureCallback`  The callback function for error  
NuanceSpeechKitPlugin.prototype.stopRecognition = function(successCallback, failureCallback) {
    return Cordova.exec(successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "stopRecognition",
                         []);
};

// **Gets the last set of results from speech recognition**
//
// `successCallback` The callback function for success  
// `failureCallback` The callback function for error  
NuanceSpeechKitPlugin.prototype.getResults = function(successCallback, failureCallback) {
    return Cordova.exec(successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "getRecoResult",
                         []);
};

// **Plays text using text to speech**
//
// `text` The text to play  
// `language` Language code for TTS playback  
// `voice` The voice to be used for TTS playback  
// `successCallback`  The callback function for success  
// `failureCallback`  The callback function for error  
NuanceSpeechKitPlugin.prototype.playTTS = function(text, language, voice,
                                                   successCallback, failureCallback) {
    return Cordova.exec(successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "startTTS",
                         [text, language, voice]);
};

// **Stops text to speech playback**
//
// `text` The text to play  
// `language` Language code for TTS playback  
// `voice` The voice to be used for TTS playback  
// `successCallback`  The callback function for success  
// `failureCallback`  The callback function for error  
NuanceSpeechKitPlugin.prototype.stopTTS = function(successCallback, failureCallback) {
    return Cordova.exec(successCallback,
                         failureCallback,
                         "PhoneGapSpeechPlugin",
                         "stopTTS",
                         []);
};


	


// parser.js


/*APP.factory('FactoryName', function () {
            return {
            functionName: function () {}
            };
            });

*/


function parseStringToDimension(value) {
    value = value.toLowerCase();
    var array = value.split(" ");
    array = updateDigits(array);
    array = updateFirstTwoToM(array);
    array = updateCM(array);
    array = updateMs(array);
    array = updateM(array);
    array = updateMM(array);
    value = summAll(array);
    return value;
};


//helpers


function updateDigits(array) {
	for (var i =0; i < array.length; i++) {
		if (array[i] === "ноль") {
			array[i] = "0";
		}
        if (array[i] === "раз") {
            array[i] = "1";
        }
        if (array[i] === "один") {
            array[i] = "1";
        }
		if (array[i] === "два") {
			array[i] = "2";
		}
		if (array[i] === "три") {
			array[i] = "3";
		}
		if (array[i] === "четыре") {
			array[i] = "4";
		}
		if (array[i] === "пять") {
			array[i] = "5";
		}
		if (array[i] === "шесть") {
			array[i] = "6";
		}
		if (array[i] === "семь") {
			array[i] = "7";
		}
		if (array[i] === "восемь") {
			array[i] = "8";
		}
		if (array[i] === "девять") {
			array[i] = "9";
		}
	}
	return array;
}

function updateCM(array) {
	for (var i =0; i < array.length; i++) {
        if (array[i] === "и") {
            array[i] = "см";
        }

        
		if ((i > 0) && (array[i] === "см") && (isNumber(array[i - 1]))) {
			array[i - 1] = parseInt(array[i - 1]) * 10;
			array.splice(i, 1);
		}
	}
	return array;
}

function updateMM(array) {
	for (var i =0; i < array.length; i++) {
		if ((i > 0) && (array[i] === "мм") && (isNumber(array[i - 1]))) {
			array.splice(i, 1);
		}
	}
	return array;
}

function updateMs(array) {
	for (var i =0; i < array.length; i++) {
		if (array[i] === "метр" || array[0] === "1м" || array[i] === "тыща" 
			|| array[i] === "тысяча") {
			array[i] = "м";
		}
	}
	return array;
}

function updateM(array) {
	for (var i =1; i < array.length; i++) {
		if ((array[i] === "м") && (isNumber(array[i - 1]))) {
			array[i - 1] = "" + parseInt(array[i - 1]) * 1000;
			array = upadtePostM(array, i);
			array.splice(i, 1);
		}
	}
	if (array[0] === "м") {
		array[0] = "1000";
		array = upadtePostM(array, 0);
	}

	return array;
}

function updateFirstTwoToM(array) {
	if (array.length == 2) {
		if ((isNumber(array[0])) && (isNumber(array[1]))) {
			array[2] = array[1];
			array[1] = "м";
			//array[0] = "" + parseInt(array[0]) * 1000;
			
			if (parseInt(array[2]) < 100) {
				array[3] = "см";
			} else {
				array[3] = "мм";
			}
		}
	}
	return array;
}

function upadtePostM(array, i) {
	if (i === array.length - 2) {
		if ((isNumber(array[i + 1])) && (parseInt(array[i + 1]) < 100)) {
			array[i + 1] = "" + parseInt(array[i + 1]) * 10;
		}
	} else if (i < array.length - 1) {
		if ((isNumber(array[i + 1])) && (parseInt(array[i + 1]) < 100) && (isNumber(array[i + 2]))) {
			array[i + 1] = "" + parseInt(array[i + 1]) * 10;
		}		
	}
	return array;
}
/*
function updateHalf(array) {
	for (var i =1; i < array.length - 2; i++) {
		if ((array[i] === "с") && (array[i + 1] === "половиной")) {
			array[i - 1] = "" + parseFloat(array[i -1]) + 0.5; 
			array.splice(i, 2);
		}
	}
	return array;
}

*/

function summAll(array) {
	var ret = 0;
	for (var i =0; i < array.length; i++) {
		ret += parseInt(array[i]); 
	}
	return "" + ret;
}



String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};


function isNumber(str) {
   return  ("" + parseInt(str) === str); 
};



// result.js

/* exported OkResult, ErrorResult */

"use strict";

function OkResult(data) {
  this.status = true;
  this.data = data;
}

function ErrorResult(code, message) {
  this.status = false;
  this.code = code;
  this.message = message;

  console.error(this.code, this.message);
}


// voicerec.js


// voicerec.js


var speechKit = new NuanceSpeechKitPlugin();


function doInit() {
    var serverURL = "cvq.nmdp.nuancemobility.net";
    speechKit.initialize("Credentials", serverURL, 443, false, function(r){printResult(r)}, function(e){printResult(e)} );
}

function doCleanup(){
    speechKit.cleanup( function(r){printResult(r)}, function(e){printResult(e)} );
}

function startRecognition(callback, progressCalback, languageLabel){
    var recInProcess = true,
        recognitionLanguage = languageLabel;
    console.log("Before startRecognition");
    speechKit.startRecognition("dictation", recognitionLanguage, function(r){printRecoResult(r)}, function(e){printRecoResult(e)} );
    console.log("After startRecognition");
    var tempObj = new Object();
   
    setTimeout(forceStop, 5000);
    
    function forceStop() {
        console.log("FORCE STOP" + recInProcess);
        if (recInProcess === true) {
            //inProcess = false;
            console.log("FORCE STOP");
            forceStopRecognition();
        }
    }
    
    function forceStopRecognition(){
        speechKit.stopRecognition(function(r){printRecoResult(r)}, function(e){console.log(e)} );
        
    }

    
    
    function printRecoResult(resultObject){
        if (resultObject.event == 'RecoVolumeUpdate'){
            console.log("RecoVolumeUpdate");
            if (progressCalback) {
                 progressCalback(resultObject.volumeLevel);
            }
        }
        else{
           
           parseAndCallback(resultObject);
        }
    }
    
    function parseAndCallback(resultObject){
        console.log("parseAndCallback" + resultObject.event);
        if (resultObject.results != undefined){
            if (resultObject.results.length > 0) {
                callback(resultObject.results[0].value);
                 recInProcess = false;
                return;
            }
        }
        if (resultObject.event != 'RecoStarted') {
            callback("0");
            recInProcess = false;
            return;
            
        }
    }
}


function stopRecognition(){
    speechKit.stopRecognition(function(r){printRecoResult(r)}, function(e){console.log(e)} );
    
}


function getResult(){
    speechKit.getResults(function(r){printResult(r)}, function(e){console.log("getResult" + e)} );
}



function printResult(resultObject){
    console.log("printResult " + resultObject.event);
}

function playTTS(text, languageLabel) {
    if (text.length > 0){
        console.log("Playing TTS");
        
        var ttsLanguageSelect = document.getElementById("tts-language");
        var ttsLanguage = languageLabel;
        speechKit.playTTS(text, ttsLanguage, null, function(r){printTTSResult(r)}, function(e){printTTSResult(e)} );
    }
    
    function printTTSResult(resultObject){
        console.log("printTTSResult " + JSON.stringify(resultObject));
    }

}



// controllers/cart.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartCtrl', ['$scope', 'localDB', 'localStorage', '$location', '$filter', '$cordovaDialogs', function ($scope, localDB, localStorage, $location, $filter, $cordovaDialogs) {

  $scope.global = localStorage;

  $scope.cart = {
    orderEddited: [],
    productsEddited: [],
    //------- for checking order in orders into LocalStorage
    isOrderExisted: true,
    allGridsDB: [],
    allVisorsDB: [],
    allSpillwaysDB: [],
    allOutSlopesDB: [],
    allInSlopesDB: [],
    allLouversDB: [],
    allConnectorsDB: [],
    allFansDB: [],
    allWindowSillsDB: [],
    allHandlesDB: [],
    allOthersDB: [],

    allAddElements: [],
    allAddElementsListSource: {
      grids: [],
      visors: [],
      spillways: [],
      outsideSlope: [],
      louvers: [],
      insideSlope: [],
      connectors: [],
      fans: [],
      windowSill: [],
      handles: [],
      others: []
    },
    allAddElementsList: {},
    addElementsUniqueList: {},
    allTemplateIcons: [],
    activeProductIndex: 0,
    addElementsListPriceTOTAL: 0,
    isAddElementDetail: false,
    isAllAddElements: false,
    isShowAllAddElements: false,
    isShowAddElementUnit: false,
    selectedAddElementUnitId: 0,
    selectedAddElementUnitIndex: 0,
    selectedAddElementUnitType: 0,
    selectedAddElementUnits: [],
    isOrderHaveAddElements: false,
    isShowLinkExplodeMenu: false,
    DELAY_START: STEP,
    typing: 'on'
  };

  var p, prod, product, addElementUnique;

  $scope.isCartLightView = false;

  $scope.global.startProgramm = false;
  $scope.global.isReturnFromDiffPage = false;
  $scope.global.isChangedTemplate = false;
  $scope.global.isOpenedCartPage = true;
  $scope.global.isOpenedHistoryPage = false;

  //------- finish edit product
  $scope.global.productEditNumber = '';


  console.log('cart page!!!!!!!!!!!!!!!');
  console.log('product ====== ', $scope.global.product);
  console.log('order ====== ', $scope.global.order);


  //----- Calculate All Products Price
  $scope.calculateProductsPrice = function() {
    $scope.global.order.productsPriceTOTAL = 0;
    for(p = 0; p <  $scope.global.order.products.length; p++) {
      $scope.global.order.productsPriceTOTAL += parseFloat( (parseFloat($scope.global.order.products[p].productPriceTOTAL.toFixed(2)) * $scope.global.order.products[p].productQty).toFixed(2) );
    }
  };

  // Calculate Order Price
  $scope.global.calculateOrderPrice = function() {
    $scope.calculateProductsPrice();
    //----- join together product prices and order option
    $scope.global.calculateTotalOrderPrice();
  };


  //---------- parse Add Elements from LocalStorage
  $scope.parseAddElementsLocaly = function() {
    $scope.cart.allAddElements = [];
    for(prod = 0; prod < $scope.global.order.products.length; prod++) {
      product = [];

      for(var prop in $scope.global.order.products[prod].chosenAddElements) {
        if (!$scope.global.order.products[prod].chosenAddElements.hasOwnProperty(prop)) {
          continue;
        }
        if($scope.global.order.products[prod].chosenAddElements[prop].length > 0) {
          $scope.cart.isOrderHaveAddElements = true;
          for (var elem = 0; elem < $scope.global.order.products[prod].chosenAddElements[prop].length; elem++) {
            product.push($scope.global.order.products[prod].chosenAddElements[prop][elem]);
          }
        }
      }
      $scope.cart.allAddElements.push(product);
    }
  };




  //================ EDIT order from Histoy ===============
  if($scope.global.orderEditNumber > 0) {
    //-------- checking if order exist in orders array into LocalStorage
    $scope.cart.isOrderExisted = false;
    for(var ord = 0; ord < $scope.global.orders.length; ord++) {
      if($scope.global.orders[ord].orderId === $scope.global.orderEditNumber) {
        $scope.cart.isOrderExisted = true;
        console.log('isOrderExisted !!!! == ', $scope.cart.isOrderExisted );
        $scope.global.order = angular.copy($scope.global.orders[ord]);
        console.log('order !!!! == ', $scope.global.order );
        $scope.parseAddElementsLocaly();
        //----------- start order price total calculation
        //$scope.calculateProductsPrice();
      }
    }

    if(!$scope.cart.isOrderExisted) {
      //------ if order not exist take it from LocalDB

      localDB.selectDB($scope.global.ordersTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.orderEddited = angular.copy(results.data);
          $scope.global.order = angular.copy($scope.global.orderSource);
          console.log('isOrderExisted == ', $scope.cart.isOrderExisted );
          console.log('orderEddited == ', $scope.cart.orderEddited );
          console.log('order == ', $scope.global.order );

          angular.extend($scope.global.order, $scope.cart.orderEddited[0]);
          if($scope.global.order.isOldPrice === 'true') {
            $scope.global.order.isOldPrice = true;
          } else {
            $scope.global.order.isOldPrice = false;
          }
          console.log('extendedOrder ==== ', $scope.global.order);

        } else {
          console.log(results);
        }
      });




      //------ Download All Add Elements from LocalDB

      localDB.selectDB($scope.global.addElementsTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          console.log('results.data === ', results.data);
          var allEddElements = angular.copy(results.data);
          for(var el = 0; el < allEddElements.length; el++) {
            switch (allEddElements[el].elementType) {
              case 1: $scope.cart.allGridsDB.push(allEddElements[el]);
                break;
              case 2: $scope.cart.allVisorsDB.push(allEddElements[el]);
                break;
              case 3: $scope.cart.allSpillwaysDB.push(allEddElements[el]);
                break;
              case 4: $scope.cart.allOutSlopesDB.push(allEddElements[el]);
                break;
              case 5: $scope.cart.allLouversDB.push(allEddElements[el]);
                break;
              case 6: $scope.cart.allInSlopesDB.push(allEddElements[el]);
                break;
              case 7: $scope.cart.allConnectorsDB.push(allEddElements[el]);
                break;
              case 8: $scope.cart.allFansDB.push(allEddElements[el]);
                break;
              case 9: $scope.cart.allWindowSillsDB.push(allEddElements[el]);
                break;
              case 10: $scope.cart.allHandlesDB.push(allEddElements[el]);
                break;
              case 11: $scope.cart.allOthersDB.push(allEddElements[el]);
                break;
            }
          }
        } else {
          console.log(results);
        }
      });


      //----------- sorting all Edd Elements by Products
      $scope.parseAddElements = function() {
        console.log('productsEdit', $scope.global.order.products);
        for(prod = 0; prod < $scope.global.order.productsQty; prod++) {

          if($scope.cart.allGridsDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allGridsDB.length; elem++) {
              if($scope.cart.allGridsDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedGrids.push($scope.cart.allGridsDB[elem]);
              }
            }
          }

          if($scope.cart.allVisorsDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allVisorsDB.length; elem++) {
              if($scope.cart.allVisorsDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedVisors.push($scope.cart.allVisorsDB[elem]);
              }
            }
          }

          if($scope.cart.allSpillwaysDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allSpillwaysDB.length; elem++) {
              if($scope.cart.allSpillwaysDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedSpillways.push($scope.cart.allSpillwaysDB[elem]);
              }
            }
          }

          if($scope.cart.allOutSlopesDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allOutSlopesDB.length; elem++) {
              if($scope.cart.allOutSlopesDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedOutsideSlope.push($scope.cart.allOutSlopesDB[elem]);
              }
            }
          }

          if($scope.cart.allInSlopesDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allInSlopesDB.length; elem++) {
              if($scope.cart.allInSlopesDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedInsideSlope.push($scope.cart.allInSlopesDB[elem]);
              }
            }
          }

          if($scope.cart.allLouversDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allLouversDB.length; elem++) {
              if($scope.cart.allLouversDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedLouvers.push($scope.cart.allLouversDB[elem]);
              }
            }
          }

          if($scope.cart.allConnectorsDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allConnectorsDB.length; elem++) {
              if($scope.cart.allConnectorsDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedConnectors.push($scope.cart.allConnectorsDB[elem]);
              }
            }
          }

          if($scope.cart.allFansDB.length > 0) {
            for(var elem = 0; elem < $scope.cart.allFansDB.length; elem++) {
              if($scope.cart.allFansDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedFans.push($scope.cart.allFansDB[elem]);
              }
            }
          }

          if($scope.cart.allWindowSillsDB.length > 0) {
            for (var elem = 0; elem < $scope.cart.allWindowSillsDB.length; elem++) {
              if ($scope.cart.allWindowSillsDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedWindowSill.push($scope.cart.allWindowSillsDB[elem]);
              }
            }
          }

          if($scope.cart.allHandlesDB.length > 0) {
            for (var elem = 0; elem < $scope.cart.allHandlesDB.length; elem++) {
              if ($scope.cart.allHandlesDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedHandles.push($scope.cart.allHandlesDB[elem]);
              }
            }
          }

          if($scope.cart.allOthersDB.length > 0) {
            for (var elem = 0; elem < $scope.cart.allOthersDB.length; elem++) {
              if ($scope.cart.allOthersDB[elem].productId === $scope.global.order.products[prod].productId) {
                $scope.global.order.products[prod].chosenAddElements.selectedOthers.push($scope.cart.allOthersDB[elem]);
              }
            }
          }
        }

        $scope.parseAddElementsLocaly();
      };



      //------ Download All Products Data for Order
      localDB.selectDB($scope.global.productsTableBD, {'orderId': $scope.global.orderEditNumber}, function (results) {
        if (results.status) {
          $scope.cart.productsEddited = angular.copy(results.data);
          //------------- parsing All Templates Source and Icons for Order

          for(var prod = 0; prod < $scope.cart.productsEddited.length; prod++) {
            var product = {};
            product = angular.copy($scope.global.productSource);
            angular.extend(product, $scope.cart.productsEddited[prod]);
            console.log('product ==== ', product);

            if(!product.isAddElementsONLY || product.isAddElementsONLY === 'false') {
              product.templateSource = parsingTemplateSource(product.templateSource);
              console.log('templateSource', product.templateSource);

              // парсинг шаблона, расчет размеров
              $scope.global.templateDepths = {
                frameDepth: $scope.global.allProfileFrameSizes[product.profileIndex],
                sashDepth: $scope.global.allProfileSashSizes[product.profileIndex],
                impostDepth: $scope.global.allProfileImpostSizes[product.profileIndex],
                shtulpDepth: $scope.global.allProfileShtulpSizes[product.profileIndex]
              };
              product.templateIcon = new TemplateIcon(product.templateSource, $scope.global.templateDepths);
              product.templateDefault = new Template(product.templateSource, $scope.global.templateDepths);
              console.log('templateIcon', product.templateIcon);
            }
            $scope.global.order.products.push(product);
          }
          $scope.parseAddElements();
          //----------- start order price total calculation
          //$scope.calculateProductsPrice();

        } else {
          console.log(results);
        }
      });

    }


  //=========== from Main page
  } else {
    $scope.parseAddElementsLocaly();
    //----------- start order price total calculation
    $scope.calculateProductsPrice();
    $scope.global.order.orderPriceTOTAL = $scope.global.order.productsPriceTOTAL;

  }








  //----- Delete Product
  $scope.clickDeleteProduct = function(productIndex) {
    /*
    if(confirm($filter('translate')('common_words.DELETE_PRODUCT_TITLE'))) {
      $scope.global.order.products.splice(productIndex, 1);
      $scope.cart.allAddElements.splice(productIndex, 1);

      if(!$scope.cart.isOrderExisted) {
        var productIdBD = productIndex + 1;
        localDB.deleteDB($scope.global.productsTableBD, {'orderId': {"value": $scope.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
        localDB.deleteDB($scope.global.addElementsTableBD, {'orderId': {"value": $scope.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
      }

      //----- if all products were deleted go to main page????
      if($scope.global.order.products.length > 0 ) {
        // Change order price
        $scope.global.calculateOrderPrice();
      } else {
        $scope.global.calculateOrderPrice();
        //$scope.global.createNewProjectCart();
        //TODO create new project
      }
    }

    navigator.notification.confirm(
      $filter('translate')('common_words.DELETE_PRODUCT_TXT'),
      deleteProduct,
      $filter('translate')('common_words.DELETE_PRODUCT_TITLE'),
      [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')]
    );
*/
    $cordovaDialogs.confirm(
      $filter('translate')('common_words.DELETE_PRODUCT_TXT'),
      $filter('translate')('common_words.DELETE_PRODUCT_TITLE'),
      [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')])
      .then(function(buttonIndex) {
        deleteProduct(buttonIndex);
      });

    function deleteProduct(button) {
      if(button == 1) {
        //playSound('delete');
        $scope.global.order.products.splice(productIndex, 1);
        $scope.cart.allAddElements.splice(productIndex, 1);

        if(!$scope.cart.isOrderExisted) {
          var productIdBD = productIndex + 1;
          localDB.deleteDB($scope.global.productsTableBD, {'orderId': {"value": $scope.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
          localDB.deleteDB($scope.global.addElementsTableBD, {'orderId': {"value": $scope.global.orderEditNumber, "union": 'AND'}, "productId": productIdBD});
        }

        //----- if all products were deleted go to main page????
        if($scope.global.order.products.length > 0 ) {
          // Change order price
          $scope.global.calculateOrderPrice();
        } else {
          //$scope.global.createNewProjectCart();
          $scope.global.calculateOrderPrice();
          //TODO create new project
        }

      }

    }
  };




  //----- Edit Produtct in main page
  $scope.editProduct = function(productIndex) {
    $scope.global.productEditNumber = productIndex;
    $scope.global.isCreatedNewProject = false;
    $scope.global.isCreatedNewProduct = false;
    $scope.global.prepareMainPage();
    $location.path('/main');
  };


  //----- Reduce Product Qty
  $scope.lessProduct = function(productIndex) {
    var newProductsQty = $scope.global.order.products[productIndex].productQty;
    if(newProductsQty === 1) {
      $scope.clickDeleteProduct(productIndex);
    } else {
      --newProductsQty;
      $scope.global.order.products[productIndex].productQty = newProductsQty;
      // Change product value in DB
      var productIdBD = productIndex + 1;
      localDB.updateDB($scope.global.productsTableBD, {"productQty": newProductsQty}, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, "productId": productIdBD});

      $scope.global.calculateOrderPrice();
    }
  };


  //----- Increase Product Qty
  $scope.moreProduct = function(productIndex) {
    var newProductsQty = $scope.global.order.products[productIndex].productQty;
    ++newProductsQty;
    $scope.global.order.products[productIndex].productQty = newProductsQty;
    // Change product value in DB
    var productIdBD = productIndex + 1;
    localDB.updateDB($scope.global.productsTableBD, {"productQty": newProductsQty}, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, "productId": productIdBD});

    $scope.global.calculateOrderPrice();
  };


  //============= AddElements detail block
  //------- Show AddElements detail block for product
  $scope.showAllAddElementDetail = function(productIndex) {
    if($scope.cart.allAddElements[productIndex].length > 0) {
      //playSound('switching');
      $scope.cart.activeProductIndex = productIndex;
      $scope.cart.isAddElementDetail = true;
    }
  };
  //--------- Close AddElements detail block
  $scope.closeAllAddElementDetail = function() {
    $scope.cart.isAddElementDetail = false;
  };

  // Full/Light View switcher
  $scope.viewSwitching = function() {
    //playSound('swip');
    $scope.isCartLightView = !$scope.isCartLightView;
  };



  //------- add new product in order
  $scope.addNewProductInOrder = function() {
    $scope.global.isOpenedCartPage = false;
    $scope.global.isCreatedNewProject = false;
    $scope.global.isCreatedNewProduct = true;
    $scope.global.prepareMainPage();
    $location.path('/main');
  };



  //============= ALL AddElements panels

  //-------- collect all AddElements in allAddElementsList from all products
  $scope.prepareAllAddElementsList = function(){
    $scope.cart.allAddElementsList = angular.copy($scope.cart.allAddElementsListSource);
    for(var pr = 0; pr < $scope.global.order.products.length; pr++) {

      for(var prop in $scope.global.order.products[pr].chosenAddElements) {
        if (!$scope.global.order.products[pr].chosenAddElements.hasOwnProperty(prop)) {
          continue;
        }
        if($scope.global.order.products[pr].chosenAddElements[prop].length > 0) {
          for (var elem = 0; elem < $scope.global.order.products[pr].chosenAddElements[prop].length; elem++) {
            var tempChosenAddElement = angular.copy($scope.global.order.products[pr].chosenAddElements[prop][elem]);
            tempChosenAddElement.elementQty *= $scope.global.order.products[pr].productQty;
            tempChosenAddElement.productQty = $scope.global.order.products[pr].productQty;
            tempChosenAddElement.productId = $scope.global.order.products[pr].productId;
            tempChosenAddElement.isAddElementsONLY = $scope.global.order.products[pr].isAddElementsONLY;
            switch (tempChosenAddElement.elementType) {
              case 1:
                $scope.cart.allAddElementsList.grids.push(tempChosenAddElement);
                break;
              case 2:
                $scope.cart.allAddElementsList.visors.push(tempChosenAddElement);
                break;
              case 3:
                $scope.cart.allAddElementsList.spillways.push(tempChosenAddElement);
                break;
              case 4:
                $scope.cart.allAddElementsList.outsideSlope.push(tempChosenAddElement);
                break;
              case 5:
                $scope.cart.allAddElementsList.louvers.push(tempChosenAddElement);
                break;
              case 6:
                $scope.cart.allAddElementsList.insideSlope.push(tempChosenAddElement);
                break;
              case 7:
                $scope.cart.allAddElementsList.connectors.push(tempChosenAddElement);
                break;
              case 8:
                $scope.cart.allAddElementsList.fans.push(tempChosenAddElement);
                break;
              case 9:
                $scope.cart.allAddElementsList.windowSill.push(tempChosenAddElement);
                break;
              case 10:
                $scope.cart.allAddElementsList.handles.push(tempChosenAddElement);
                break;
              case 11:
                $scope.cart.allAddElementsList.others.push(tempChosenAddElement);
                break;
            }

          }
        }
      }
    }
  };

  //--------------- dublicats cleaning in allAddElementsList in order to make unique element
  $scope.cleaningAllAddElementsList = function(){
    $scope.cart.addElementsUniqueList = angular.copy($scope.cart.allAddElementsList);
    //---- check dublicats
    for(var type in $scope.cart.addElementsUniqueList) {
      if (!$scope.cart.addElementsUniqueList.hasOwnProperty(type)) {
        continue;
      }
      if($scope.cart.addElementsUniqueList[type].length > 0) {
        for(var elem = $scope.cart.addElementsUniqueList[type].length - 1; elem >= 0 ; elem--) {
          for(var el = $scope.cart.addElementsUniqueList[type].length - 1; el >= 0 ; el--) {
            if(elem === el) {
              continue;
            } else {
              if($scope.cart.addElementsUniqueList[type][elem].elementId === $scope.cart.addElementsUniqueList[type][el].elementId && $scope.cart.addElementsUniqueList[type][elem].elementWidth === $scope.cart.addElementsUniqueList[type][el].elementWidth && $scope.cart.addElementsUniqueList[type][elem].elementHeight === $scope.cart.addElementsUniqueList[type][el].elementHeight) {
                $scope.cart.addElementsUniqueList[type][elem].elementQty += $scope.cart.addElementsUniqueList[type][el].elementQty;
                $scope.cart.addElementsUniqueList[type].splice(el, 1);
                elem--;
              }
            }
          }
        }
      }
    }
    //console.log('$scope.cart.addElementsUniqueList ==== ', $scope.cart.addElementsUniqueList);
  };

  //------ calculate TOTAL AddElements price
  $scope.getTOTALAddElementsPrice = function() {
    $scope.cart.addElementsListPriceTOTAL = 0;
    for(var i = 0; i < $scope.global.order.products.length; i++) {
      $scope.cart.addElementsListPriceTOTAL += ($scope.global.order.products[i].addElementsPriceSELECT * $scope.global.order.products[i].productQty);
    }
  };


  //-------- show All Add Elements panel
  $scope.showAllAddElements = function() {
    //--- open if AddElements are existed
    if($scope.cart.isOrderHaveAddElements) {
      //playSound('swip');
      $scope.cart.isShowAllAddElements = !$scope.cart.isShowAllAddElements;
      if($scope.cart.isShowAllAddElements) {
        $scope.prepareAllAddElementsList();
        $scope.cleaningAllAddElementsList();
        $scope.getTOTALAddElementsPrice();
      } else {
        $scope.cart.allAddElementsList = angular.copy($scope.cart.allAddElementsListSource);
        $scope.cart.addElementsUniqueList = {};
      }
    }
  };


  //------ delete All AddElements List
  $scope.deleteAllAddElementsList = function() {
    $scope.cart.addElementsListPriceTOTAL = 0;
    for(var pr = 0; pr < $scope.global.order.products.length; pr++) {
      $scope.global.order.products[pr].productPriceTOTAL -= $scope.global.order.products[pr].addElementsPriceSELECT;
      $scope.global.order.products[pr].addElementsPriceSELECT = 0;
      for(var prop in $scope.global.order.products[pr].chosenAddElements) {
        if (!$scope.global.order.products[pr].chosenAddElements.hasOwnProperty(prop)) {
          continue;
        }
        if($scope.global.order.products[pr].chosenAddElements[prop].length > 0) {
          $scope.global.order.products[pr].chosenAddElements[prop].length = 0;
        }
      }
    }
    //---- close all AddElements panel
    $scope.parseAddElementsLocaly();
    $scope.showAllAddElements();
    $scope.global.calculateOrderPrice();
    $scope.cart.isOrderHaveAddElements = false;
  };

  function getCurrentAddElementsType(elementType) {
    var curentType = '';
    switch (elementType) {
      case 1: curentType = 'grids';
        break;
      case 2: curentType = 'visors';
        break;
      case 3: curentType = 'spillways';
        break;
      case 4: curentType = 'outsideSlope';
        break;
      case 5: curentType = 'louvers';
        break;
      case 6: curentType = 'insideSlope';
        break;
      case 7: curentType = 'connectors';
        break;
      case 8: curentType = 'fans';
        break;
      case 9: curentType = 'windowSill';
        break;
      case 10: curentType = 'handles';
        break;
      case 11: curentType = 'others';
        break;
    }
    return curentType;
  }


  //------ delete AddElement in All AddElementsList
  $scope.deleteAddElementList = function(elementType, elementId) {
    var curentType;
    //----- if we delete all AddElement Unit in header of Unit Detail panel
    if($scope.cart.isShowAddElementUnit) {
      //playSound('swip');
      $scope.cart.isShowAddElementUnit = !$scope.cart.isShowAddElementUnit;
      $scope.cart.selectedAddElementUnitId = 0;
      $scope.cart.selectedAddElementUnitIndex = 0;
      $scope.cart.selectedAddElementUnitType = 0;
      $scope.cart.selectedAddElementUnits.length = 0;
      curentType = elementType;
    } else {
      curentType = getCurrentAddElementsType(elementType);
    }
    for (var el = ($scope.cart.allAddElementsList[curentType].length - 1); el >= 0; el--) {
      if($scope.cart.allAddElementsList[curentType][el].elementId === elementId) {
        $scope.cart.allAddElementsList[curentType].splice(el, 1);
      }
    }
    $scope.cleaningAllAddElementsList();
    for(var p = 0; p < $scope.global.order.products.length; p++) {
      for(var prop in $scope.global.order.products[p].chosenAddElements) {
        if (!$scope.global.order.products[p].chosenAddElements.hasOwnProperty(prop)) {
          continue;
        }
        if((prop.toUpperCase()).indexOf(curentType.toUpperCase())+1 && $scope.global.order.products[p].chosenAddElements[prop].length > 0) {
          for (var elem = ($scope.global.order.products[p].chosenAddElements[prop].length - 1); elem >= 0; elem--) {
            if($scope.global.order.products[p].chosenAddElements[prop][elem].elementId === elementId) {
              $scope.global.order.products[p].addElementsPriceSELECT -= $scope.global.order.products[p].chosenAddElements[prop][elem].elementPrice;
              $scope.global.order.products[p].productPriceTOTAL -= $scope.global.order.products[p].chosenAddElements[prop][elem].elementPrice;
              $scope.global.order.products[p].chosenAddElements[prop].splice(elem, 1);
            }
          }
        }
      }
    }
    $scope.getTOTALAddElementsPrice();
    $scope.parseAddElementsLocaly();
    $scope.global.calculateOrderPrice();
    //--------- if all AddElements were deleted
    //---- close all AddElements panel
    if(!$scope.cart.addElementsListPriceTOTAL) {
      $scope.showAllAddElements();
      $scope.cart.isOrderHaveAddElements = false;
    }
  };





  //-------- show Add Element Unit Detail panel
  $scope.showAddElementUnitDetail = function(elementType, elementId, elementIndex) {
    //playSound('swip');
    $scope.cart.isShowAddElementUnit = !$scope.cart.isShowAddElementUnit;
    if($scope.cart.isShowAddElementUnit) {
      $scope.cart.selectedAddElementUnitId = elementId;
      $scope.cart.selectedAddElementUnitIndex = elementIndex;
      $scope.cart.selectedAddElementUnitType = getCurrentAddElementsType(elementType);
      $scope.cart.selectedAddElementUnits.length = 0;
      //console.log('allAddElementsList == ', $scope.cart.allAddElementsList);

      for(var i = 0; i < $scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType].length; i++) {
        if($scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType][i].elementId === $scope.cart.selectedAddElementUnitId) {
          if($scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType][i].productQty === 1){
            $scope.cart.selectedAddElementUnits.push($scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType][i]);
          } else {
            var addElementsUniqueProduct = [];
            var addElementsUnique = angular.copy($scope.cart.allAddElementsList[$scope.cart.selectedAddElementUnitType][i]);
            addElementsUnique.elementQty /= addElementsUnique.productQty;
            for(var p = 0; p < addElementsUnique.productQty; p++) {
              addElementsUniqueProduct.push(addElementsUnique);
            }
            if(addElementsUniqueProduct.length > 0) {
              $scope.cart.selectedAddElementUnits.push(addElementsUniqueProduct);
            }

          }
        }
      }
      console.log('start selectedAddElementUnits = ', $scope.cart.selectedAddElementUnits);
    } else {
      $scope.cart.selectedAddElementUnitId = 0;
      $scope.cart.selectedAddElementUnitIndex = 0;
      $scope.cart.selectedAddElementUnitType = 0;
      $scope.cart.selectedAddElementUnits.length = 0;
    }

  };


  //------ delete AddElement Unit in selectedAddElementUnits panel
  $scope.deleteAddElementUnit = function(parentIndex, elementIndex, addElementUnit) {
    console.log('start delete addElementsUniqueList = ', $scope.cart.addElementsUniqueList);
    //---- close selectedAddElementUnits panel when we delete last unit
    if($scope.cart.selectedAddElementUnits.length === 1) {
      $scope.deleteAddElementList($scope.cart.selectedAddElementUnitType, addElementUnit.elementId);
      $scope.cart.selectedAddElementUnits.length = 0;
      $scope.cart.isShowLinkExplodeMenu = false;
    } else if($scope.cart.selectedAddElementUnits.length > 1) {
      if(parentIndex === '') {
        $scope.cart.selectedAddElementUnits.splice(elementIndex, 1);
      } else {
        //-------- Delete all group
        $scope.cart.isShowLinkExplodeMenu = false;
        $scope.cart.selectedAddElementUnits.splice(parentIndex, 1);
      }
      var curentType = $scope.cart.selectedAddElementUnitType;
      for (var el = ($scope.cart.allAddElementsList[curentType].length - 1); el >= 0; el--) {
        if($scope.cart.allAddElementsList[curentType][el].productId === addElementUnit.productId && $scope.cart.allAddElementsList[curentType][el].elementId === addElementUnit.elementId) {
          $scope.cart.allAddElementsList[curentType].splice(el, 1);
        }
      }
      $scope.cleaningAllAddElementsList();
      for (var p = 0; p < $scope.global.order.products.length; p++) {
        for (var prop in $scope.global.order.products[p].chosenAddElements) {
          if (!$scope.global.order.products[p].chosenAddElements.hasOwnProperty(prop)) {
            continue;
          }
          if ((prop.toUpperCase()).indexOf(curentType.toUpperCase()) + 1 && $scope.global.order.products[p].chosenAddElements[prop].length > 0) {
            for (var elem = ($scope.global.order.products[p].chosenAddElements[prop].length - 1); elem >= 0; elem--) {
              if ($scope.global.order.products[p].productId === addElementUnit.productId && $scope.global.order.products[p].chosenAddElements[prop][elem].elementId === addElementUnit.elementId) {
                $scope.global.order.products[p].addElementsPriceSELECT -= $scope.global.order.products[p].chosenAddElements[prop][elem].elementPrice;
                $scope.global.order.products[p].productPriceTOTAL -= $scope.global.order.products[p].chosenAddElements[prop][elem].elementPrice;
                $scope.global.order.products[p].chosenAddElements[prop].splice(elem, 1);
              }
            }
          }
        }
      }
      console.log($scope.global.order.products);
      $scope.getTOTALAddElementsPrice();
      $scope.parseAddElementsLocaly();
      $scope.global.calculateOrderPrice();

    }
    console.log('end delete addElementsUniqueList = ', $scope.cart.addElementsUniqueList);
  };

  //-------- Show/Hide Explode Link Menu
  $scope.toggleExplodeLinkMenu = function() {
    $scope.cart.isShowLinkExplodeMenu = !$scope.cart.isShowLinkExplodeMenu;
  };

  //-------- Explode group to one unit
  $scope.explodeUnitToOneProduct = function(parentIndex) {
    $scope.cart.isShowLinkExplodeMenu = !$scope.cart.isShowLinkExplodeMenu;

    //----- change selected product
    var currentProductId = $scope.cart.selectedAddElementUnits[parentIndex][0].productId;
    var currentProductIndex = currentProductId - 1;
    var newProductsQty = $scope.global.order.products[currentProductIndex].productQty - 1;

    // making clone
    var cloneProduct = angular.copy($scope.global.order.products[currentProductIndex]);
    cloneProduct.productId = '';
    cloneProduct.productQty = 1;
    $scope.global.order.products.push(cloneProduct);

    $scope.global.order.products[currentProductIndex].productQty = newProductsQty;
    // Change product value in DB
    localDB.updateDB($scope.global.productsTableBD, {"productQty": newProductsQty}, {'orderId': {"value": $scope.global.order.orderId, "union": 'AND'}, "productId": currentProductId});

    console.log('selectedAddElementUnits == ', $scope.cart.selectedAddElementUnits);
    console.log('selected obj == ', $scope.cart.selectedAddElementUnits[parentIndex][0]);
    console.log('selected product id== ' );
  };

  //-------- Explode all group
  $scope.explodeUnitGroupToProducts = function(parentIndex) {
    $scope.cart.isShowLinkExplodeMenu = !$scope.cart.isShowLinkExplodeMenu;
  };


}]);


// controllers/change-lang.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('ChangeLangCtrl', ['$scope', 'localStorage', '$translate', '$timeout', function ($scope, localStorage, $translate, $timeout) {

  $scope.global = localStorage;

  $scope.language = {
    DELAY_START: STEP,
    typing: 'on'
  };

  $scope.switchLang = function (languageId) {
    $translate.use($scope.global.languages[languageId].label);
    $scope.global.userInfo.langLabel = $scope.global.languages[languageId].label;
    $scope.global.userInfo.langName = $scope.global.languages[languageId].name;
    $scope.global.setLanguageVoiceHelper($scope.global.userInfo.langLabel);
    $timeout(function() {
      $scope.global.isOpenSettingsPage = false;
      $scope.global.startProgramm = false;
      $scope.global.isReturnFromDiffPage = true;
      $scope.global.gotoMainPage();
    }, 200);
  };

}]);


// controllers/change-pass.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('ChangePassCtrl', ['$scope', 'localDB', 'localStorage', function ($scope, localDB, localStorage) {

  $scope.global = localStorage;

  $scope.password = {
    DELAY_START: STEP,
    isErrorPassword: false,
    typing: 'on'
  };

  $scope.saveNewPassword = function() {
    if($scope.password.newPassword === '' && $scope.password.confirmPassword === '') {
      $scope.password.isErrorPassword = true;
    }
    if($scope.password.newPassword !== $scope.password.confirmPassword) {
      $scope.password.isErrorPassword = true;
    } else {
      $scope.password.isErrorPassword = false;
      $scope.global.userInfo.password = $scope.password.newPassword;
      localDB.updateDBGlobal($scope.global.usersTableDBGlobal, {"password": $scope.password.newPassword}, {"id": $scope.global.userInfo.id});
      //---- clean fields
      $scope.password.newPassword = $scope.password.confirmPassword = '';
    }

  };
  $scope.checkError = function() {
    $scope.password.isErrorPassword = false;
  };

}]);



// controllers/construction.js

/* globals BauVoiceApp, STEP, deactiveSizeBox */

'use strict';

BauVoiceApp.controller('ConstructionCtrl', ['$scope', 'constructService', 'localStorage', '$location', '$filter', '$interval', function ($scope, constructService, localStorage, $location, $filter, $interval) {

  $scope.global = localStorage;

  $scope.constructData = {
    tempSize: [],
    minSizeLimit: 200,
    maxSizeLimit: 5000,
    minSizePoint: 0,
    maxSizePoint: 0,
    startSize: 0,
    finishSize: 0,
    tempSizeId: '2',
    tempSizeType: '',
    oldSizeValue: 0,
    isMinSizeRestriction: false,
    isMaxSizeRestriction: false,

    activeMenuItem: false,
    isSashEdit: false,
    isAngelEdit: false,
    isImpostEdit: false,
    isArchEdit: false,
    isPositionEdit: false,

    isSashEditMenu: false,
    isImpostEditMenu: false,

    showDoorConfig: false,

    selectedDoorShape: false,
    selectedSashShape: false,
    selectedHandleShape: false,
    selectedLockShape: false,
    doorShapeDefault: '',
    sashShapeDefault: '',
    handleShapeDefault: '',
    lockShapeDefault: '',
    doorShape: '',
    sashShape: '',
    handleShape: '',
    lockShape: '',

    selectedStep1: false,
    selectedStep2: false,
    selectedStep3: false,
    selectedStep4: false,
    DELAY_SHOW_FIGURE_ITEM: 1000,
    typing: 'on'
  };

  $scope.openVoiceHelper = false;
  $scope.loudVoice = false;
  $scope.quietVoice = false;
  $scope.selectedGlassId = 0;

  var $svgContainer = $('svg-template'),
      sizeRectActClass = 'size-rect-active',
      sizeBoxActClass = 'size-value-active',
      newLength;


  $scope.templateSourceOLD = angular.copy($scope.global.product.templateSource);
  $scope.templateDefaultOLD = angular.copy($scope.global.product.templateDefault);

  $scope.templateSourceTEMP = angular.copy($scope.global.product.templateSource);
  $scope.templateDefaultTEMP = angular.copy($scope.global.product.templateDefault);



  //============ if Door Construction

  if($scope.global.isConstructDoor) {
    constructService.getDoorConfig(function (results) {
      if (results.status) {
        $scope.doorShape = results.data.doorType;
        $scope.sashShape = results.data.sashType;
        $scope.handleShape = results.data.handleType;
        $scope.lockShape = results.data.lockType;
      } else {
        console.log(results);
      }
    });

    $scope.constructData.doorShapeDefault = $scope.doorShape[$scope.global.product.doorShapeId].shapeLabel;
    $scope.constructData.sashShapeDefault = $scope.sashShape[$scope.global.product.doorSashShapeId].shapeLabel;
    $scope.constructData.handleShapeDefault = $scope.handleShape[$scope.global.product.doorHandleShapeId].shapeLabel;
    $scope.constructData.lockShapeDefault = $scope.lockShape[$scope.global.product.doorLockShapeId].shapeLabel;

    $scope.constructData.doorShape = $scope.constructData.doorShapeDefault;
    $scope.constructData.sashShape = $scope.constructData.sashShapeDefault;
    $scope.constructData.handleShape = $scope.constructData.handleShapeDefault;
    $scope.constructData.lockShape = $scope.constructData.lockShapeDefault;
  }

  //------- Select and deselect Glasses
  function manipulationWithGlasses(indicator) {
    $('svg-template').find('.glass').each(function() {
      if(indicator) {
        $(this).css('fill', 'rgba(34, 34, 255, 0.69)');
      } else {
        $(this).css('fill', 'rgba(155, 204, 255, 0.20)');
      }
    });
  }


  //--------Select menu item
  $scope.selectMenuItem = function(id) {
    $scope.constructData.activeMenuItem = ($scope.constructData.activeMenuItem === id) ? false : id;
    console.log('activeMenuItem = ', $scope.constructData.activeMenuItem);
    deactivateShapeMenu();
    $scope.constructData.isSashEditMenu = false;
    $scope.constructData.isImpostEditMenu = false;
    manipulationWithGlasses($scope.constructData.activeMenuItem);
    switch($scope.constructData.activeMenuItem) {
      case 1:
        $scope.constructData.isSashEdit = true;
        manipulationWithGlasses($scope.constructData.isSashEdit);
        break;
      case 2:
        $scope.constructData.isAngelEdit = true;
        break;
      case 3:
        $scope.constructData.isImpostEdit = true;
        manipulationWithGlasses($scope.constructData.isImpostEdit);
        break;
      case 4:
        $scope.constructData.isArchEdit = true;
        break;
      case 5:
        $scope.constructData.isPositionEdit = true;
        break;
    }
  };

  function deactivateShapeMenu() {
    $scope.constructData.isSashEdit = false;
    $scope.constructData.isAngelEdit = false;
    $scope.constructData.isImpostEdit = false;
    $scope.constructData.isArchEdit = false;
    $scope.constructData.isPositionEdit = false;
  }

  //---------- Show Door Configuration
  $scope.getDoorConfig = function() {
    $scope.constructData.showDoorConfig = ($scope.constructData.showDoorConfig) ? false : true;
  };

  //---------- Select door shape
  $scope.selectDoor = function(id, name) {
    if(!$scope.constructData.selectedStep2) {
      if($scope.constructData.selectedDoorShape === id) {
        $scope.constructData.selectedDoorShape = false;
        $scope.constructData.selectedStep1 = false;
        $scope.constructData.doorShape = $scope.constructData.doorShapeDefault;
      } else {
        $scope.constructData.selectedDoorShape = id;
        $scope.constructData.selectedStep1 = true;
        $scope.constructData.doorShape = name;
      }
    } else {
      return false;
    }
  };
  //---------- Select sash shape
  $scope.selectSash = function(id, name) {
    if(!$scope.constructData.selectedStep3) {
      if ($scope.constructData.selectedSashShape === id) {
        $scope.constructData.selectedSashShape = false;
        $scope.constructData.selectedStep2 = false;
        $scope.constructData.sashShape = $scope.constructData.sashShapeDefault;
      } else {
        $scope.constructData.selectedSashShape = id;
        $scope.constructData.selectedStep2 = true;
        $scope.constructData.sashShape = name;
      }
    }
  };
  //-------- Select handle shape
  $scope.selectHandle = function(id, name) {
    if(!$scope.constructData.selectedStep4) {
      if($scope.constructData.selectedHandleShape === id) {
        $scope.constructData.selectedHandleShape = false;
        $scope.constructData.selectedStep3 = false;
        $scope.constructData.handleShape = $scope.constructData.handleShapeDefault;
      } else {
        $scope.constructData.selectedHandleShape = id;
        $scope.constructData.selectedStep3 = true;
        $scope.constructData.handleShape = name;
      }
    }
  };
  //--------- Select lock shape
  $scope.selectLock = function(id, name) {
    if($scope.constructData.selectedLockShape === id) {
      $scope.constructData.selectedLockShape = false;
      $scope.constructData.selectedStep4 = false;
      $scope.constructData.lockShape = $scope.constructData.lockShapeDefault;
    } else {
      $scope.constructData.selectedLockShape = id;
      $scope.constructData.selectedStep4 = true;
      $scope.constructData.lockShape = name;
    }
  };

  //--------- Close Door Configuration
  $scope.closeDoorConfig = function() {
    if($scope.constructData.selectedStep3) {
      $scope.constructData.selectedStep3 = false;
      $scope.constructData.selectedStep4 = false;
      $scope.constructData.selectedLockShape = false;
      $scope.constructData.selectedHandleShape = false;
    } else if($scope.constructData.selectedStep2) {
      $scope.constructData.selectedStep2 = false;
      $scope.constructData.selectedSashShape = false;
    } else if($scope.constructData.selectedStep1) {
      $scope.constructData.selectedStep1 = false;
      $scope.constructData.selectedDoorShape = false;
    } else {
      $scope.constructData.showDoorConfig = false;
      $scope.constructData.doorShape = $scope.constructData.doorShapeDefault;
      $scope.constructData.sashShape = $scope.constructData.sashShapeDefault;
      $scope.constructData.handleShape = $scope.constructData.handleShapeDefault;
      $scope.constructData.lockShape = $scope.constructData.lockShapeDefault;
    }
  };

  //--------- Save Door Configuration
  $scope.saveDoorConfig = function() {
    $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
    $scope.constructData.showDoorConfig = false;
    $scope.global.product.doorShapeId = $scope.constructData.selectedDoorShape;
    $scope.global.product.doorSashShapeId = $scope.constructData.selectedSashShape;
    $scope.global.product.doorHandleShapeId = $scope.constructData.selectedHandleShape;
    $scope.global.product.doorLockShapeId = $scope.constructData.selectedLockShape;
    //console.log('product door', $scope.global.product);
  };

  //=============== End Door ==================





  //--------- Cancel and Close Construction Page
  $scope.gotoMainPageCancel = function () {
    $scope.global.isConstructSizeCalculator = false;
    $scope.backtoTemplatePanel();
    //---- if is open the door
    if($scope.global.isConstructDoor) {
      $scope.global.setDefaultDoorConfig();
    }
  };

  //------- Save and Close Construction Page
  $scope.gotoMainPageSaved = function () {
    //------ if calculator is closed
    if(!$scope.global.isConstructSizeCalculator) {

      //----- save new template in product
      $scope.global.product.templateSource = angular.copy($scope.templateSourceTEMP);
      $scope.global.product.templateDefault = angular.copy($scope.templateDefaultTEMP);
      $scope.global.product.templateIcon = new TemplateIcon($scope.templateSourceTEMP, $scope.global.templateDepths);

      //------ save new template in templates Array
      if($scope.global.isConstructDoor) {
        changeTemplateInArray($scope.global.product.templateIndex, $scope.global.templatesDoorSource, $scope.global.templatesDoorList, $scope.global.templatesDoorIconList, $scope.templateSourceTEMP, $scope.templateDefaultTEMP, $scope.global.product.templateIcon);
      } else if($scope.global.isConstructBalcony) {
        changeTemplateInArray($scope.global.product.templateIndex, $scope.global.templatesBalconySource, $scope.global.templatesBalconyList, $scope.global.templatesBalconyIconList, $scope.templateSourceTEMP, $scope.templateDefaultTEMP, $scope.global.product.templateIcon);
      } else if($scope.global.isConstructWindDoor) {
        changeTemplateInArray($scope.global.product.templateIndex, $scope.global.templatesWindDoorSource, $scope.global.templatesWindDoorList, $scope.global.templatesWindDoorIconList, $scope.templateSourceTEMP, $scope.templateDefaultTEMP, $scope.global.product.templateIcon);
      } else if($scope.global.isConstructWind) {
        changeTemplateInArray($scope.global.product.templateIndex, $scope.global.templatesWindSource, $scope.global.templatesWindList, $scope.global.templatesWindIconList, $scope.templateSourceTEMP, $scope.templateDefaultTEMP, $scope.global.product.templateIcon);
      }
      //------- refresh current templates arrays
      $scope.global.getCurrentTemplates();
      //-------- template was changed
      $scope.global.isChangedTemplate = true;
      $scope.backtoTemplatePanel();
    }
  };


  //-------- Back to Template Panel
  $scope.backtoTemplatePanel = function() {
    $scope.global.prepareMainPage();
    $scope.global.isReturnFromDiffPage = true;
    //console.log('construction page!!!!!!!!!!!');
    //console.log('product ====== ', $scope.global.product);
    //console.log('order ====== ', $scope.global.order);
    $location.path('/main');
  };

  function changeTemplateInArray(templateIndex, templateSourceList, templateList, templateIconList, newTemplateSource, newTemplate, newTemplateIcon) {
    //----- write new template in array
    templateSourceList[templateIndex] = angular.copy(newTemplateSource);
    templateList[templateIndex] = angular.copy(newTemplate);
    templateIconList[templateIndex] = angular.copy(newTemplateIcon);
  }







  //------- set Default Construction
  $scope.setDefaultConstruction = function() {
    if(!$scope.global.isConstructSizeCalculator) {
      $scope.templateDefaultTEMP = {};
      $scope.templateSourceTEMP = {};
      $scope.templateDefaultTEMP = angular.copy($scope.templateDefaultOLD);
      $scope.templateSourceTEMP = angular.copy($scope.templateSourceOLD);
      $scope.constructData.tempSize.length = 0;
    }
  };




  //=============== CHANGE CONSTRUCTION SIZE ==============

  $svgContainer.hammer({domEvents:true}).off("tap", "tspan").on("tap", "tspan", selectSizeBlock);

  //----- click on size SVG and get size value and Id
  function selectSizeBlock() {
    if (!$scope.global.isConstructSizeCalculator) {
      var thisSize = $(this).parent();
      $scope.constructData.startSize = +thisSize.attr('from-point');
      $scope.constructData.finishSize = +thisSize.attr('to-point');
      $scope.constructData.minSizePoint = +thisSize.attr('min-val');
      $scope.constructData.maxSizePoint = +thisSize.attr('max-val');
      $scope.constructData.maxSizeLimit = ($scope.constructData.maxSizePoint - $scope.constructData.startSize);
      if (thisSize.attr('id') === 'overallDimH' || thisSize.attr('id') === 'overallDimV') {
        $scope.constructData.minSizeLimit = $scope.constructData.minSizePoint;
      } else {
        $scope.constructData.minSizeLimit = 200;
      }
      $scope.constructData.tempSizeId = thisSize.attr('id');
      $scope.constructData.tempSizeType = thisSize.attr('size-type');
      $scope.constructData.oldSizeValue = +thisSize.text();
      //--- change color of size block
/*
      var sizeGroup = $(thisSize.parent());
      //console.log('sizeGroup', sizeGroup);
      thisSize.attr('class', '').attr('class', sizeBoxActClass);
      sizeGroup.find('.size-rect').attr('class', '').attr('class', sizeRectActClass);
*/
     /*
       console.log('startSize = ', $scope.constructData.startSize);
       console.log('finishSize = ', $scope.constructData.finishSize);
       console.log('minSizePoint = ', $scope.constructData.minSizePoint);
       console.log('maxSizePoint = ', $scope.constructData.maxSizePoint);
       console.log('tempSizeId', $scope.constructData.tempSizeId);
       console.log('tempSizeType = ', $scope.constructData.tempSizeType);
       console.log('oldSizeValue = ', $scope.constructData.oldSizeValue);
       */
      //--- show size calculator if voice helper is turn off
      if (!$scope.global.isVoiceHelper) {
        $scope.global.isConstructSizeCalculator = true;
      } else {
        $scope.openVoiceHelper = true;
        startRecognition(doneRecognition, recognitionProgress, $scope.global.voiceHelperLanguage);

      }
      $scope.$apply();
    }
  }



  //------ click on size calculator, get number
  $('.construction-right-menu .size-calculator').hammer().off("tap", ".calc-digit").on("tap", ".calc-digit", getNewDigit);

  function getNewDigit() {
    var newValue = $(this).text();
    setValueSize(newValue);
  }
  /*
  $('.construction-right-menu .size-calculator .calc-digit').off().click(function() {
    var newValue = $(this).text();
    setValueSize(newValue);
  });

  //------ click on size calculator, delete one last number
  $('.construction-right-menu .size-calculator .calc-delete').off().click(function() {
    deleteLastNumber();
  });
   */
  $('.construction-right-menu .size-calculator').hammer().off("tap", ".calc-delete").on("tap", ".calc-delete", deleteLastNumber);

  //---------- define voice force
  function recognitionProgress(value) {
    if (value > 100) {
      //console.log('value', value);
      $scope.loudVoice = true;
      $scope.quietVoice = false;

    } else {
      //console.log('value', value);
      $scope.loudVoice = false;
      $scope.quietVoice = true;
    }
    $scope.$apply();

  }

  function doneRecognition(value) {
    //console.log("полученные данные", value);
    //console.log("тип полученных данных", typeof value);
    $scope.voiceTxt = value;
    $scope.$apply();
    setTimeout(function() {
      var intValue = parseStringToDimension(value);
      //console.log("данные после парса", intValue);
      //console.log("тип полученных данных", typeof intValue);
      if (intValue == "NaN") {
        intValue = $filter('translate')('construction.VOICE_NOT_UNDERSTAND');
      }
      playTTS(intValue);
      setValueSize(intValue);
      $scope.$apply();
    }, 1000)
  }


  //-------- Get number from calculator
  function setValueSize(newValue) {
    //console.log('take new value = ', newValue);
    if($scope.global.isVoiceHelper) {

      var tempVal = parseInt(newValue, 10);
      //console.log('tempVal=====', tempVal);
      $scope.voiceTxt = '';
      $scope.openVoiceHelper = false;

      if ((tempVal > 0) && (tempVal < 10000)) {
        $scope.constructData.tempSize = ("" + tempVal).split('');
        //console.log('$scope.constructData.tempSize == ', $scope.constructData.tempSize);
        changeSize();
      }
      deactiveSizeBox(sizeRectActClass, sizeBoxActClass);

    } else {
      //---- clear array from 0 after delete all number in array
      if ($scope.constructData.tempSize.length === 1 && $scope.constructData.tempSize[0] === 0) {
        $scope.constructData.tempSize.length = 0;
      }
      if ($scope.constructData.tempSize.length === 4) {
        $scope.constructData.tempSize.length = 0;
      }
      if (newValue === '0') {
        if ($scope.constructData.tempSize.length !== 0 && $scope.constructData.tempSize[0] !== 0) {
          $scope.constructData.tempSize.push(newValue);
          changeSize();
        }
      }
      if (newValue === '00') {
        if ($scope.constructData.tempSize.length !== 0 && $scope.constructData.tempSize[0] !== 0) {
          if ($scope.constructData.tempSize.length < 3) {
            $scope.constructData.tempSize.push(0, 0);
          } else if ($scope.constructData.tempSize.length === 3) {
            $scope.constructData.tempSize.push(0);
          }
          changeSize();
        }
      }
      if (newValue !== '0' && newValue !== '00') {
        $scope.constructData.tempSize.push(newValue);
        changeSize();
      }
    }
  }

  //------ Delete last number from calculator
  function deleteLastNumber() {
      $scope.constructData.tempSize.pop();
      if($scope.constructData.tempSize.length < 1) {
        $scope.constructData.tempSize.push(0);
      }
    changeSize();
  }

  //------ Change size on SVG
  function changeSize() {
    var newSizeString = '';
    for(var numer = 0; numer < $scope.constructData.tempSize.length; numer++) {
      newSizeString += $scope.constructData.tempSize[numer].toString();
    }
    //console.log($scope.constructData.tempSizeId);
    $('#'+$scope.constructData.tempSizeId).find('tspan').text(parseInt(newSizeString, 10));
    if($scope.global.isVoiceHelper) {
      $scope.closeSizeCaclulator();
    }
  }

  //---------- Close Size Calculator
  $scope.closeSizeCaclulator = function() {
    if($scope.constructData.tempSize.length > 0) {
      newLength = parseInt($scope.constructData.tempSize.join(''), 10);
      //------- Dimensions limits checking
      if (newLength > $scope.constructData.minSizeLimit && newLength < $scope.constructData.maxSizeLimit) {
        $scope.constructData.isMinSizeRestriction = false;
        $scope.constructData.isMaxSizeRestriction = false;

        //-------- change point coordinates in templateSource
        for (var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
          switch ($scope.templateSourceTEMP.objects[k].type) {
            case 'fixed_point':
            case 'fixed_point_impost':
              if ($scope.constructData.tempSizeType === 'hor' && +$scope.templateSourceTEMP.objects[k].x === $scope.constructData.finishSize) {
                $scope.templateSourceTEMP.objects[k].x = $scope.constructData.startSize + newLength;
              } else if($scope.constructData.tempSizeType === 'vert' && +$scope.templateSourceTEMP.objects[k].y === $scope.constructData.finishSize) {
                $scope.templateSourceTEMP.objects[k].y = $scope.constructData.startSize + newLength;
              }

              break;
          }
        }
          //console.log('$scope.templateSourceTEMP !!!!!!=== ', $scope.templateSourceTEMP);


        //------ close size calculator
        $scope.global.isConstructSizeCalculator = false;
        //------- deactive size box in svg
        deactiveSizeBox(sizeRectActClass, sizeBoxActClass);
        //-------- build new template
        $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);

        $scope.constructData.tempSize.length = 0;
        $scope.constructData.isMinSizeRestriction = false;
        $scope.constructData.isMaxSizeRestriction = false;
      } else {

        //------ show error size
        if(newLength < $scope.constructData.minSizeLimit) {
          if($scope.global.isVoiceHelper) {
            playTTS($filter('translate')('construction.VOICE_SMALLEST_SIZE'), $scope.global.voiceHelperLanguage);
            //------- deactive size box in svg
            deactiveSizeBox(sizeRectActClass, sizeBoxActClass);
            //-------- build new template
            $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
          } else {
            $scope.constructData.isMinSizeRestriction = true;
            $scope.constructData.isMaxSizeRestriction = false;
          }
        } else if(newLength > $scope.constructData.maxSizeLimit) {
          if($scope.global.isVoiceHelper) {
            playTTS($filter('translate')('construction.VOICE_BIGGEST_SIZE'), $scope.global.voiceHelperLanguage);
            //------- deactive size box in svg
            deactiveSizeBox(sizeRectActClass, sizeBoxActClass);
            //-------- build new template
            $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
          } else {
            $scope.constructData.isMinSizeRestriction = false;
            $scope.constructData.isMaxSizeRestriction = true;
          }
        }

      }
    } else {
/*
      $scope.constructData.minSizeLimit = 200;
      $scope.constructData.maxSizeLimit = 5000;
*/
      //------ close size calculator
      $scope.global.isConstructSizeCalculator = false;
      deactiveSizeBox(sizeRectActClass, sizeBoxActClass);
    }
    $scope.openVoiceHelper = false;
    $scope.loudVoice = false;
    $scope.quietVoice = false;
  };










  //=============== CLICK ON GLASS PACKAGE ==============

  /*
   Hammer(svgContainer).on('tap', function( event ) {
   console.log('tap', event);
   console.log('event.target = ', event.target);
   if( event.target && event.target.className.indexOf('glass') >= 0 ) {
   console.log('select glass');
   } else if(event.target && event.target.className.indexOf('size-box-edited') >= 0) {
   console.log('select dimentions');
   }
   });
   */
  $svgContainer.hammer({domEvents:true}).on("tap", ".glass", selectGlassBlock);

  function selectGlassBlock() {
    console.log('start tap!!!!!');
    event.preventDefault();

    console.log('click on glass', event);
    console.log('click on glass', event.target);
    if($scope.constructData.isSashEdit) {
      //------- show sash edit menu and select all glass packages
      if(!$scope.constructData.isSashEditMenu) {
        $scope.constructData.isSashEditMenu = true;
        prepareForNewShape(event, '#sash-shape-menu');
      } else {
        $scope.constructData.isSashEditMenu = false;
        manipulationWithGlasses($scope.constructData.isSashEditMenu);
      }
      $scope.$apply();
    } else if($scope.constructData.isAngelEdit) {
      console.log('angel');
    } else if($scope.constructData.isImpostEdit) {
      //------- show impost edit menu and select all glass packages
      if(!$scope.constructData.isImpostEditMenu) {
        $scope.constructData.isImpostEditMenu = true;
        prepareForNewShape(event, '#impost-shape-menu');
      } else {
        $scope.constructData.isImpostEditMenu = false;
        manipulationWithGlasses($scope.constructData.isImpostEditMenu);
      }
      $scope.$apply();
    } else if($scope.constructData.isArchEdit) {
      console.log('arch');
    } else if($scope.constructData.isPositionEdit) {
      console.log('position');
    }
  }


  function prepareForNewShape(event, idShapeMenu) {
    //------ set the coordinats for edit sash menu
    //console.log('glass event ==', event.gesture.center);
    var menuX = event.gesture.center.x;
    var menuY = event.gesture.center.y;
    //console.log('glass menuX ==', menuX);
    //console.log('glass menuY ==', menuY);
    $(idShapeMenu).css({'top': (menuY)/8+'rem', 'left': (menuX)/8+'rem'});

    manipulationWithGlasses(false);
    //------- select current glass packages
    $(event.target).css('fill', 'rgba(34, 34, 255, 0.69)');
    //------- define id of current glass package
    $scope.selectedGlassId = event.target.attributes['element-id'].value;
  }





  //=============== CLICK ON SASH EDIT MENU

  $scope.insertNewSash = function() {
    editSash(arguments);
  };


  //=============== EDIT SASH CONSTRUCTION ==============

  function editSash(sashType) {
    var blockId = Number($scope.selectedGlassId.replace(/\D+/g,"")),
        currGlassPackage = {},
        insertIndex,
        isSashExist,
        sashNewId = (blockId - 1) * 4;

    //------- get data of current glass package
    for (var t = 0; t < $scope.templateDefaultTEMP.objects.length; t++) {
      if($scope.templateDefaultTEMP.objects[t].id === $scope.selectedGlassId) {
        currGlassPackage = $scope.templateDefaultTEMP.objects[t];
        isSashExist = currGlassPackage.parts[0].fromPoint.blockType;
      }
    }
//console.log('currGlassPackage', currGlassPackage);
    //-------- if need to delete existed sash
    if(sashType[0] === 'empty') {
      //----- if sash exists
      if(isSashExist === 'sash') {

        //------ delete sash from template Source
        for(var tempObj = $scope.templateSourceTEMP.objects.length-1; tempObj >= 0; tempObj--) {

          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_sash_out' || $scope.templateSourceTEMP.objects[tempObj].type === 'sash_out_line' || $scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_hardware' || $scope.templateSourceTEMP.objects[tempObj].type === 'hardware_line' || $scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_sash_in' || $scope.templateSourceTEMP.objects[tempObj].type === 'sash_line' || $scope.templateSourceTEMP.objects[tempObj].type === 'sash') {
            switch($scope.templateSourceTEMP.objects[tempObj].id) {
              case 'cpsout'+(sashNewId+1):
              case 'cpsout'+(sashNewId+2):
              case 'cpsout'+(sashNewId+3):
              case 'cpsout'+(sashNewId+4):
              case 'sashoutline'+(sashNewId+1):
              case 'sashoutline'+(sashNewId+2):
              case 'sashoutline'+(sashNewId+3):
              case 'sashoutline'+(sashNewId+4):
              case 'cphw'+(sashNewId+1):
              case 'cphw'+(sashNewId+2):
              case 'cphw'+(sashNewId+3):
              case 'cphw'+(sashNewId+4):
              case 'hardwareline'+(sashNewId+1):
              case 'hardwareline'+(sashNewId+2):
              case 'hardwareline'+(sashNewId+3):
              case 'hardwareline'+(sashNewId+4):
              case 'cpsin'+(sashNewId+1):
              case 'cpsin'+(sashNewId+2):
              case 'cpsin'+(sashNewId+3):
              case 'cpsin'+(sashNewId+4):
              case 'sashline'+(sashNewId+1):
              case 'sashline'+(sashNewId+2):
              case 'sashline'+(sashNewId+3):
              case 'sashline'+(sashNewId+4):
              case 'sash'+(sashNewId+1):
              case 'sash'+(sashNewId+2):
              case 'sash'+(sashNewId+3):
              case 'sash'+(sashNewId+4):
                $scope.templateSourceTEMP.objects.splice(tempObj, 1);
                break;
            }
          } else if($scope.templateSourceTEMP.objects[tempObj].type === 'sash_block' && $scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
            $scope.templateSourceTEMP.objects.splice(tempObj, 1);
          }

          //------- change beads & glass position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead_out' || $scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_glass') {
            switch($scope.templateSourceTEMP.objects[tempObj].id) {
              case 'cpbeadout'+(sashNewId+1):
              case 'cpbeadout'+(sashNewId+2):
              case 'cpbeadout'+(sashNewId+3):
              case 'cpbeadout'+(sashNewId+4):
              case 'cpg'+(sashNewId+1):
              case 'cpg'+(sashNewId+2):
              case 'cpg'+(sashNewId+3):
              case 'cpg'+(sashNewId+4):
                $scope.templateSourceTEMP.objects[tempObj].blockType = 'frame';
                if (($scope.templateSourceTEMP.objects[tempObj].line1.indexOf('impostcenterline') + 1)) {
                  for(var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
                    if($scope.templateSourceTEMP.objects[k].id === $scope.templateSourceTEMP.objects[tempObj].line1) {
                      $scope.templateSourceTEMP.objects[k].lineType = 'frame';
                    }
                  }
                } else if(($scope.templateSourceTEMP.objects[tempObj].line2.indexOf('impostcenterline') + 1)) {
                  for(var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
                    if($scope.templateSourceTEMP.objects[k].id === $scope.templateSourceTEMP.objects[tempObj].line2) {
                      $scope.templateSourceTEMP.objects[k].lineType = 'frame';
                    }
                  }
                }
                break;
            }
          }

        }

        //console.log('!!!!new.templateSourceTEMP === ', $scope.templateSourceTEMP);
        //-------- build new template
        $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
        //findSVGElement();
        //console.log('templateDefaultTEMP', $scope.templateDefaultTEMP.objects);

        $scope.constructData.isSashEditMenu = false;
        $scope.constructData.isSashEdit = false;
        $scope.constructData.activeMenuItem = false;

      }
    //-------- if need to edit or insert new sash
    } else {

      //-------- insert new sash
      if(isSashExist === 'frame' && currGlassPackage.square > 0.05) {

        //---- find insert index before beads to push new sash
        for (var i = 0; i < $scope.templateDefaultTEMP.objects.length; i++) {
          if($scope.templateDefaultTEMP.objects[i].type === 'bead_line') {
            insertIndex = i;
            break;
          }
        }

        //-------- build new Sash
        var newSash = [
          {'type': 'cross_point_sash_out', id: 'cpsout'+(sashNewId+1), line1: currGlassPackage.parts[0].toPoint.lineId1, line2: currGlassPackage.parts[0].toPoint.lineId2},
          {'type': 'cross_point_sash_out', id: 'cpsout'+(sashNewId+2), line1: currGlassPackage.parts[1].toPoint.lineId1, line2: currGlassPackage.parts[1].toPoint.lineId2},
          {'type': 'cross_point_sash_out', id: 'cpsout'+(sashNewId+3), line1: currGlassPackage.parts[2].toPoint.lineId1, line2: currGlassPackage.parts[2].toPoint.lineId2},
          {'type': 'cross_point_sash_out', id: 'cpsout'+(sashNewId+4), line1: currGlassPackage.parts[3].toPoint.lineId1, line2: currGlassPackage.parts[3].toPoint.lineId2},
          {'type': 'sash_out_line', id: 'sashoutline'+(sashNewId+1), from: 'cpsout'+(sashNewId+4), to: 'cpsout'+(sashNewId+1)},
          {'type': 'sash_out_line', id: 'sashoutline'+(sashNewId+2), from: 'cpsout'+(sashNewId+1), to: 'cpsout'+(sashNewId+2)},
          {'type': 'sash_out_line', id: 'sashoutline'+(sashNewId+3), from: 'cpsout'+(sashNewId+2), to: 'cpsout'+(sashNewId+3)},
          {'type': 'sash_out_line', id: 'sashoutline'+(sashNewId+4), from: 'cpsout'+(sashNewId+3), to: 'cpsout'+(sashNewId+4)},
          {'type': 'cross_point_hardware', id: 'cphw'+(sashNewId+1), line1: 'sashoutline'+(sashNewId+1), line2: 'sashoutline'+(sashNewId+2)},
          {'type': 'cross_point_hardware', id: 'cphw'+(sashNewId+2), line1: 'sashoutline'+(sashNewId+2), line2: 'sashoutline'+(sashNewId+3)},
          {'type': 'cross_point_hardware', id: 'cphw'+(sashNewId+3), line1: 'sashoutline'+(sashNewId+3), line2: 'sashoutline'+(sashNewId+4)},
          {'type': 'cross_point_hardware', id: 'cphw'+(sashNewId+4), line1: 'sashoutline'+(sashNewId+4), line2: 'sashoutline'+(sashNewId+1)},
          {'type': 'hardware_line', id: 'hardwareline'+(sashNewId+1), from: 'cphw'+(sashNewId+4), to: 'cphw'+(sashNewId+1)},
          {'type': 'hardware_line', id: 'hardwareline'+(sashNewId+2), from: 'cphw'+(sashNewId+1), to: 'cphw'+(sashNewId+2)},
          {'type': 'hardware_line', id: 'hardwareline'+(sashNewId+3), from: 'cphw'+(sashNewId+2), to: 'cphw'+(sashNewId+3)},
          {'type': 'hardware_line', id: 'hardwareline'+(sashNewId+4), from: 'cphw'+(sashNewId+3), to: 'cphw'+(sashNewId+4)},
          {'type': 'cross_point_sash_in', id: 'cpsin'+(sashNewId+1), line1: 'sashoutline'+(sashNewId+1), line2: 'sashoutline'+(sashNewId+2)},
          {'type': 'cross_point_sash_in', id: 'cpsin'+(sashNewId+2), line1: 'sashoutline'+(sashNewId+2), line2: 'sashoutline'+(sashNewId+3)},
          {'type': 'cross_point_sash_in', id: 'cpsin'+(sashNewId+3), line1: 'sashoutline'+(sashNewId+3), line2: 'sashoutline'+(sashNewId+4)},
          {'type': 'cross_point_sash_in', id: 'cpsin'+(sashNewId+4), line1: 'sashoutline'+(sashNewId+4), line2: 'sashoutline'+(sashNewId+1)},
          {'type': 'sash_line', id: 'sashline'+(sashNewId+1), from: 'cpsin'+(sashNewId+4), to: 'cpsin'+(sashNewId+1)},
          {'type': 'sash_line', id: 'sashline'+(sashNewId+2), from: 'cpsin'+(sashNewId+1), to: 'cpsin'+(sashNewId+2)},
          {'type': 'sash_line', id: 'sashline'+(sashNewId+3), from: 'cpsin'+(sashNewId+2), to: 'cpsin'+(sashNewId+3)},
          {'type': 'sash_line', id: 'sashline'+(sashNewId+4), from: 'cpsin'+(sashNewId+3), to: 'cpsin'+(sashNewId+4)},
          {'type': 'sash', id: 'sash'+(sashNewId+1), parts: ['sashoutline'+(sashNewId+1), 'sashline'+(sashNewId+1)]},
          {'type': 'sash', id: 'sash'+(sashNewId+2), parts: ['sashoutline'+(sashNewId+2), 'sashline'+(sashNewId+2)]},
          {'type': 'sash', id: 'sash'+(sashNewId+3), parts: ['sashoutline'+(sashNewId+3), 'sashline'+(sashNewId+3)]},
          {'type': 'sash', id: 'sash'+(sashNewId+4), parts: ['sashoutline'+(sashNewId+4), 'sashline'+(sashNewId+4)]},
          {'type': 'sash_block', id: 'sashBlock'+blockId, parts: ['hardwareline'+(sashNewId+1), 'hardwareline'+(sashNewId+2), 'hardwareline'+(sashNewId+3), 'hardwareline'+(sashNewId+4)], openDir: []}
        ];

        //--------- added impost properties
        for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
          if (newSash[sashObj].type === 'cross_point_sash_out') {
            if ((newSash[sashObj].line1.indexOf('impostcenterline') + 1)) {
              for(var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
                if($scope.templateSourceTEMP.objects[k].id === newSash[sashObj].line1) {
                  $scope.templateSourceTEMP.objects[k].lineType = 'sash';
                }
              }
            } else if((newSash[sashObj].line2.indexOf('impostcenterline') + 1)) {
              for(var k = 0; k < $scope.templateSourceTEMP.objects.length; k++) {
                if($scope.templateSourceTEMP.objects[k].id === newSash[sashObj].line2) {
                  $scope.templateSourceTEMP.objects[k].lineType = 'sash';
                }
              }
            }
          }
        }
        //--------- added openType, openDir properties
        for(var dir = 0; dir < sashType.length; dir++) {
          switch(sashType[dir]) {
            case 'up':
              for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
                if(newSash[sashObj].id === 'sash'+(sashNewId+3)) {
                  newSash[sashObj].openType = ['sashline'+(sashNewId+3), 'sashline'+(sashNewId+1)];
                }
                if(newSash[sashObj].id === 'sashBlock'+blockId) {
                  newSash[sashObj].openDir.push(1);
                  newSash[sashObj].handlePos = 1;
                }
              }
              break;
            case 'down':
              for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
                if(newSash[sashObj].id === 'sash'+(sashNewId+1)) {
                  newSash[sashObj].openType = ['sashline'+(sashNewId+1), 'sashline'+(sashNewId+3)];
                }
                if(newSash[sashObj].id === 'sashBlock'+blockId) {
                  newSash[sashObj].openDir.push(3);
                  newSash[sashObj].handlePos = 3;
                }
              }
              break;
            case 'left':
              for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
                if(newSash[sashObj].id === 'sash'+(sashNewId+2)) {
                  newSash[sashObj].openType = ['sashline'+(sashNewId+2), 'sashline'+(sashNewId+4)];
                }
                if(newSash[sashObj].id === 'sashBlock'+blockId) {
                  newSash[sashObj].openDir.push(4);
                  newSash[sashObj].handlePos = 4;
                }
              }
              break;
            case 'right':
              for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
                if(newSash[sashObj].id === 'sash'+(sashNewId+4)) {
                  newSash[sashObj].openType = ['sashline'+(sashNewId+4), 'sashline'+(sashNewId+2)];
                }
                if(newSash[sashObj].id === 'sashBlock'+blockId) {
                  newSash[sashObj].openDir.push(2);
                  newSash[sashObj].handlePos = 2;
                }
              }
              break;
          }
        }


        //----------- INSERT new sash in template Source
        for(var sashObj = 0; sashObj < newSash.length; sashObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex+sashObj), 0, newSash[sashObj]);
        }

        //----------- change existed beads and glass package
        for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
          //------- change beads & glass position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead_out' || $scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_glass') {
            switch($scope.templateSourceTEMP.objects[tempObj].id) {
              case 'cpbeadout'+(sashNewId+1):
              case 'cpbeadout'+(sashNewId+2):
              case 'cpbeadout'+(sashNewId+3):
              case 'cpbeadout'+(sashNewId+4):
              case 'cpg'+(sashNewId+1):
              case 'cpg'+(sashNewId+2):
              case 'cpg'+(sashNewId+3):
              case 'cpg'+(sashNewId+4):
                $scope.templateSourceTEMP.objects[tempObj].blockType = 'sash';
                break;
            }
          }
        }




      //--------- edit existing sash (opening type)
      } else if(isSashExist === 'sash') {

        //--------- clean old openType properties in sash objects and openDir in sashBlock
        for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
          switch ($scope.templateSourceTEMP.objects[tempObj].id) {
            case 'sash'+(sashNewId+1):
            case 'sash'+(sashNewId+2):
            case 'sash'+(sashNewId+3):
            case 'sash'+(sashNewId+4):
              delete $scope.templateSourceTEMP.objects[tempObj].openType;
              break;
            case 'sashBlock'+blockId:
              $scope.templateSourceTEMP.objects[tempObj].openDir.length = 0;
              break;
          }
        }

        for(var dir = 0; dir < sashType.length; dir++) {
          switch(sashType[dir]) {
            case 'up':
              for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sash'+(sashNewId+3)) {
                  $scope.templateSourceTEMP.objects[tempObj].openType = ['sashline'+(sashNewId+3), 'sashline'+(sashNewId+1)];
                }
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
                  $scope.templateSourceTEMP.objects[tempObj].openDir.push(1);
                  $scope.templateSourceTEMP.objects[tempObj].handlePos = 1;
                }
              }
              break;
            case 'down':
              for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sash'+(sashNewId+1)) {
                  $scope.templateSourceTEMP.objects[tempObj].openType = ['sashline'+(sashNewId+1), 'sashline'+(sashNewId+3)];
                }
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
                  $scope.templateSourceTEMP.objects[tempObj].openDir.push(3);
                  $scope.templateSourceTEMP.objects[tempObj].handlePos = 3;
                }
              }
              break;
            case 'left':
              for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sash'+(sashNewId+2)) {
                  $scope.templateSourceTEMP.objects[tempObj].openType = ['sashline'+(sashNewId+2), 'sashline'+(sashNewId+4)];
                }
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
                  $scope.templateSourceTEMP.objects[tempObj].openDir.push(4);
                  $scope.templateSourceTEMP.objects[tempObj].handlePos = 4;
                }
              }
              break;
            case 'right':
              for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sash'+(sashNewId+4)) {
                  $scope.templateSourceTEMP.objects[tempObj].openType = ['sashline'+(sashNewId+4), 'sashline'+(sashNewId+2)];
                }
                if($scope.templateSourceTEMP.objects[tempObj].id === 'sashBlock'+blockId) {
                  $scope.templateSourceTEMP.objects[tempObj].openDir.push(2);
                  $scope.templateSourceTEMP.objects[tempObj].handlePos = 2;
                }
              }
              break;
          }
        }

      }

      //console.log('!!!!new.templateSourceTEMP === ', $scope.templateSourceTEMP);
      //-------- build new template
      $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
      //findSVGElement();
      //console.log('templateDefaultTEMP', $scope.templateDefaultTEMP.objects);

      $scope.constructData.isSashEditMenu = false;
      $scope.constructData.isSashEdit = false;
      $scope.constructData.activeMenuItem = false;

    }

  }




  //===================== IMPOST

  //=============== CLICK ON IMPOST EDIT MENU

  $scope.insertNewImpost = function() {
    editImpost(arguments);
  };


  //=============== EDIT IMPOST CONSTRUCTION ==============

  function editImpost(impostType) {
    var blockId = Number($scope.selectedGlassId.replace(/\D+/g,"")),
        minLimitSize = 200,
        currLastIndex = blockId * 4,
        currGlassPackage = {},
        insertIndex,
        isSashExist,

        impostIndexes = [],
        impostLineIndexes = [],
        cpImpostIndexes = [],
        beadIndexes = [],
        cpGlassIndexes = [],
        glassIndexes = [],

        lastImpostIndex,
        lastImpostLineIndex,
        lastCPImpostIndex,
        lastBeadIndex,
        lastCPGlassIndex,
        lastGlassIndex,

        blockFromX,
        blockToX,
        blockFromY,
        blockToY,
        widthBlock,
        heightBlock,
        newImpostX,
        newImpostY,
        edgeTopId,
        edgeLeftId,
        edgeBottomId,
        edgeRightId,
        newImpost,
        newBead,
        newGlass,
        newDim;


    //------- get data of current glass package
    for (var t = 0; t < $scope.templateDefaultTEMP.objects.length; t++) {
      if($scope.templateDefaultTEMP.objects[t].id === $scope.selectedGlassId) {
        currGlassPackage = $scope.templateDefaultTEMP.objects[t];
        isSashExist = currGlassPackage.parts[0].fromPoint.blockType;
      }
    }

    //---- find insert index before beads to push new sash
    for (var i = 0; i < $scope.templateDefaultTEMP.objects.length; i++) {
      if ($scope.templateDefaultTEMP.objects[i].type === 'cross_point_bead_out') {
        insertIndex = i;
        break;
      }
    }
    //---- find last numbers of existed impost, bead and glass
    for (var i = 0; i < $scope.templateDefaultTEMP.objects.length; i++) {
      if ($scope.templateDefaultTEMP.objects[i].type === 'fixed_point_impost') {
        impostLineIndexes.push(Number($scope.templateDefaultTEMP.objects[i].id.replace(/\D+/g, "")));
      }
      if ($scope.templateDefaultTEMP.objects[i].type === 'cross_point_impost') {
        cpImpostIndexes.push(Number($scope.templateDefaultTEMP.objects[i].id.replace(/\D+/g, "")));
      }
      if ($scope.templateDefaultTEMP.objects[i].type === 'cross_point_bead_out') {
        beadIndexes.push(Number($scope.templateDefaultTEMP.objects[i].id.replace(/\D+/g, "")));
      }
      if ($scope.templateDefaultTEMP.objects[i].type === 'cross_point_glass') {
        cpGlassIndexes.push(Number($scope.templateDefaultTEMP.objects[i].id.replace(/\D+/g, "")));
      }
      if ($scope.templateDefaultTEMP.objects[i].type === 'glass_paсkage') {
        glassIndexes.push(Number($scope.templateDefaultTEMP.objects[i].id.replace(/\D+/g, "")));
      }
      if ($scope.templateDefaultTEMP.objects[i].type === 'impost') {
        impostIndexes.push(Number($scope.templateDefaultTEMP.objects[i].id.replace(/\D+/g, "")));
      }
    }
    //----- define max number of existed impost, bead and glass
    if(impostLineIndexes.length > 0) {
      lastImpostLineIndex = impostLineIndexes.max();
    } else {
      lastImpostLineIndex = 0;
    }
    if(cpImpostIndexes.length > 0) {
      lastCPImpostIndex = cpImpostIndexes.max();
    } else {
      lastCPImpostIndex = 0;
    }
    if(impostIndexes.length > 0) {
      lastImpostIndex = impostIndexes.max();
    } else {
      lastImpostIndex = 0;
    }
    if(beadIndexes.length > 0) {
      lastBeadIndex = beadIndexes.max();
    } else {
      lastBeadIndex = 0;
    }
    if(cpGlassIndexes.length > 0) {
      lastCPGlassIndex = cpGlassIndexes.max();
    } else {
      lastCPGlassIndex = 0;
    }
    if(glassIndexes.length > 0) {
      lastGlassIndex = glassIndexes.max();
    } else {
      lastGlassIndex = 0;
    }

/*
    console.log('blockId == ', blockId);
    console.log('currLastIndex == ', currLastIndex);
    console.log('lastImpostIndex == ', lastImpostIndex);
    console.log('lastImpostLineIndex == ', lastImpostLineIndex);
    console.log('lastCPImpostIndex == ', lastCPImpostIndex);
    console.log('lastBeadIndex == ', lastBeadIndex);
    console.log('lastCPGlassIndex == ', lastCPGlassIndex);
    console.log('lastGlassIndex == ', lastGlassIndex);
 */
    //console.log('currGlassPackage == ', currGlassPackage);

    //------ VERTICAL IMPOST
    if(impostType[0] === 'vert') {
      blockFromX = currGlassPackage.parts[0].fromPoint.x;
      blockToX = currGlassPackage.parts[0].toPoint.x;
      widthBlock = blockToX - blockFromX;

      //------- allow insert impost if widthBlock > 250
      if(widthBlock > minLimitSize) {

        //------- define new impost X & Y coordinates
        newImpostX = +blockFromX + (widthBlock / 2);
        newImpostY = currGlassPackage.parts[0].toPoint.line2.toPoint.y;
        edgeTopId = currGlassPackage.parts[0].toPoint.lineId1;
        edgeLeftId = currGlassPackage.parts[0].toPoint.lineId2;
        edgeBottomId = currGlassPackage.parts[2].toPoint.lineId1;

        //-------- build new Impost
        newImpost = [
          {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 1), x: newImpostX, y: 0, dir:'vert'},
          {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 2), x: newImpostX, y: newImpostY, dir:'vert'},
          {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 1), from: 'fpimpost' + (lastImpostLineIndex + 1), to: 'fpimpost' + (lastImpostLineIndex + 2), lineType: 'frame'},
          {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 2), from: 'fpimpost' + (lastImpostLineIndex + 2), to: 'fpimpost' + (lastImpostLineIndex + 1), lineType: 'frame'},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 1), line1: edgeTopId, line2: 'impostcenterline' + (lastImpostLineIndex + 1)},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 2), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 3), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 4), line1: 'impostcenterline' + (lastImpostLineIndex + 1), line2: edgeBottomId},
          {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 1), from: 'cpimpost' + (lastCPImpostIndex + 1), to: 'cpimpost' + (lastCPImpostIndex + 4)},
          {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 2), from: 'cpimpost' + (lastCPImpostIndex + 3), to: 'cpimpost' + (lastCPImpostIndex + 2)},
          {'type': 'impost', id: 'impost' + (lastImpostIndex + 1), parts: ['impostinline' + (lastImpostLineIndex + 1), 'impostinline' + (lastImpostLineIndex + 2)]}
        ];

        //-------- build new Bead
        newBead = [
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+1), line1: edgeTopId, line2: edgeLeftId},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+2), line1: edgeLeftId, line2: edgeBottomId},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+3), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+4), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+1), from:'cpbeadout'+(lastBeadIndex+4), to:'cpbeadout'+(lastBeadIndex+1)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+2), from:'cpbeadout'+(lastBeadIndex+1), to:'cpbeadout'+(lastBeadIndex+2)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+3), from:'cpbeadout'+(lastBeadIndex+2), to:'cpbeadout'+(lastBeadIndex+3)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+4), from:'cpbeadout'+(lastBeadIndex+3), to:'cpbeadout'+(lastBeadIndex+4)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+1), line1: 'beadline'+(lastBeadIndex+1), line2: 'beadline'+(lastBeadIndex+2)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+2), line1: 'beadline'+(lastBeadIndex+2), line2: 'beadline'+(lastBeadIndex+3)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+3), line1: 'beadline'+(lastBeadIndex+3), line2: 'beadline'+(lastBeadIndex+4)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+4), line1: 'beadline'+(lastBeadIndex+4), line2: 'beadline'+(lastBeadIndex+1)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+1), from:'cpbead'+(lastBeadIndex+4), to:'cpbead'+(lastBeadIndex+1)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+2), from:'cpbead'+(lastBeadIndex+1), to:'cpbead'+(lastBeadIndex+2)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+3), from:'cpbead'+(lastBeadIndex+2), to:'cpbead'+(lastBeadIndex+3)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+4), from:'cpbead'+(lastBeadIndex+3), to:'cpbead'+(lastBeadIndex+4)},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+1), parts: ['beadline'+(lastBeadIndex+1), 'beadinline'+(lastBeadIndex+1)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+2), parts: ['beadline'+(lastBeadIndex+2), 'beadinline'+(lastBeadIndex+2)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+3), parts: ['beadline'+(lastBeadIndex+3), 'beadinline'+(lastBeadIndex+3)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+4), parts: ['beadline'+(lastBeadIndex+4), 'beadinline'+(lastBeadIndex+4)]}
        ];
        //-------- build new Glass
        newGlass = [
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+1), line1: edgeTopId, line2: edgeLeftId},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+2), line1: edgeLeftId, line2: edgeBottomId},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+3), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+4), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+1), from: 'cpg'+(lastCPGlassIndex+4), to: 'cpg'+(lastCPGlassIndex+1)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+2), from: 'cpg'+(lastCPGlassIndex+1), to: 'cpg'+(lastCPGlassIndex+2)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+3), from: 'cpg'+(lastCPGlassIndex+2), to: 'cpg'+(lastCPGlassIndex+3)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+4), from: 'cpg'+(lastCPGlassIndex+3), to: 'cpg'+(lastCPGlassIndex+4)},
          {'type': 'glass_paсkage', id: 'glass'+(lastGlassIndex+1), parts: ['glassline'+(lastCPGlassIndex+1), 'glassline'+(lastCPGlassIndex+2), 'glassline'+(lastCPGlassIndex+3), 'glassline'+(lastCPGlassIndex+4)]}
        ];

        //--------- added blockType properties
        for(var j = 0; j < newImpost.length; j++) {
          if (newImpost[j].type === 'cross_point_impost') {
            newImpost[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }
        for(var j = 0; j < newBead.length; j++) {
          if (newBead[j].type === 'cross_point_bead_out') {
            newBead[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }
        for(var j = 0; j < newGlass.length; j++) {
          if (newGlass[j].type === 'cross_point_glass') {
            newGlass[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }


        //console.log('newImpost = ', newImpost);
        //console.log('newBead = ', newBead);
        //console.log('newGlass = ', newGlass);
        //----------- INSERT new glass in template Source
        for (var tempObj = 0; tempObj < newGlass.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newGlass[tempObj]);
        }
        //----------- INSERT new bead in template Source
        for (var tempObj = 0; tempObj < newBead.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newBead[tempObj]);
        }
        //----------- INSERT new impost in template Source
        for (var tempObj = 0; tempObj < newImpost.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newImpost[tempObj]);
        }

        //----------- change existed beads and glass package
        for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {

          //------- change beads position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead_out') {
            if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-3)) {
              $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-2)) {
              $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
            }
          }

          //------- change glass position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_glass') {
            if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-3)) {
              $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-2)) {
              $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
            }
          }
        }

        //console.log('!!!!new.templateSourceTEMP === ', JSON.stringify($scope.templateSourceTEMP));
        //console.log('!!!!new.templateSourceTEMP === ', $scope.templateSourceTEMP);
        //-------- build new template
        $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
        //console.log('templateDefaultTEMP == ', $scope.templateDefaultTEMP.objects);

        $scope.constructData.isImpostEditMenu = false;
        $scope.constructData.isImpostEdit = false;
        $scope.constructData.activeMenuItem = false;


      } else {
        playTTS($filter('translate')('construction.VOICE_SMALL_GLASS_BLOCK'), $scope.global.voiceHelperLanguage);
      }



    //------ HORISONTAL IMPOST

    } else if(impostType[0] === 'horis') {
      blockFromX = currGlassPackage.parts[1].fromPoint.y;
      blockToX = currGlassPackage.parts[1].toPoint.y;
      widthBlock = blockToX - blockFromX;

      //------- allow insert impost if widthBlock > 250
      if(widthBlock > minLimitSize) {
        //console.log('blockFromX == ', blockFromX);
        //console.log('blockToX == ', blockToX);
        //console.log('widthBlock == ', widthBlock);

        //------- define new impost X & Y coordinates
        newImpostX = +blockFromX + (widthBlock / 2);
        newImpostY = currGlassPackage.parts[1].toPoint.line2.fromPoint.x;
        edgeTopId = currGlassPackage.parts[1].toPoint.lineId1;
        edgeLeftId = currGlassPackage.parts[1].toPoint.lineId2;
        edgeBottomId = currGlassPackage.parts[3].toPoint.lineId1;

        //console.log('newImpostX', newImpostX);
        //console.log('newImpostY', newImpostY);
        //console.log('edgeTopId', edgeTopId);
        //console.log('edgeLeftId', edgeLeftId);
        //console.log('edgeBottomId',edgeBottomId);


        //-------- build new Impost
        newImpost = [
          {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 1), x: newImpostY, y: newImpostX, dir:'hor'},
          {'type': 'fixed_point_impost', id: 'fpimpost' + (lastImpostLineIndex + 2), x: 0, y: newImpostX, dir:'hor'},
          {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 1), from: 'fpimpost' + (lastImpostLineIndex + 1), to: 'fpimpost' + (lastImpostLineIndex + 2), lineType: 'frame'},
          {'type': 'impost_line', id: 'impostcenterline' + (lastImpostLineIndex + 2), from: 'fpimpost' + (lastImpostLineIndex + 2), to: 'fpimpost' + (lastImpostLineIndex + 1), lineType: 'frame'},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 1), line1: edgeTopId, line2: 'impostcenterline' + (lastImpostLineIndex + 1)},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 2), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 3), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'cross_point_impost', id: 'cpimpost' + (lastCPImpostIndex + 4), line1: 'impostcenterline' + (lastImpostLineIndex + 1), line2: edgeBottomId},
          {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 1), from: 'cpimpost' + (lastCPImpostIndex + 1), to: 'cpimpost' + (lastCPImpostIndex + 4)},
          {'type': 'impost_in_line', id: 'impostinline' + (lastImpostLineIndex + 2), from: 'cpimpost' + (lastCPImpostIndex + 3), to: 'cpimpost' + (lastCPImpostIndex + 2)},
          {'type': 'impost', id: 'impost' + (lastImpostIndex + 1), parts: ['impostinline' + (lastImpostLineIndex + 1), 'impostinline' + (lastImpostLineIndex + 2)]}
        ];

        //-------- build new Bead
        newBead = [
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+1), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+2), line1: edgeTopId, line2: edgeLeftId},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+3), line1: edgeLeftId, line2: edgeBottomId},
          {'type': 'cross_point_bead_out', id: 'cpbeadout'+(lastBeadIndex+4), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+1), from:'cpbeadout'+(lastBeadIndex+4), to:'cpbeadout'+(lastBeadIndex+1)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+2), from:'cpbeadout'+(lastBeadIndex+1), to:'cpbeadout'+(lastBeadIndex+2)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+3), from:'cpbeadout'+(lastBeadIndex+2), to:'cpbeadout'+(lastBeadIndex+3)},
          {'type': 'bead_line', id:'beadline'+(lastBeadIndex+4), from:'cpbeadout'+(lastBeadIndex+3), to:'cpbeadout'+(lastBeadIndex+4)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+1), line1: 'beadline'+(lastBeadIndex+1), line2: 'beadline'+(lastBeadIndex+2)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+2), line1: 'beadline'+(lastBeadIndex+2), line2: 'beadline'+(lastBeadIndex+3)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+3), line1: 'beadline'+(lastBeadIndex+3), line2: 'beadline'+(lastBeadIndex+4)},
          {'type': 'cross_point_bead', id: 'cpbead'+(lastBeadIndex+4), line1: 'beadline'+(lastBeadIndex+4), line2: 'beadline'+(lastBeadIndex+1)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+1), from:'cpbead'+(lastBeadIndex+4), to:'cpbead'+(lastBeadIndex+1)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+2), from:'cpbead'+(lastBeadIndex+1), to:'cpbead'+(lastBeadIndex+2)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+3), from:'cpbead'+(lastBeadIndex+2), to:'cpbead'+(lastBeadIndex+3)},
          {'type': 'bead_in_line', id:'beadinline'+(lastBeadIndex+4), from:'cpbead'+(lastBeadIndex+3), to:'cpbead'+(lastBeadIndex+4)},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+1), parts: ['beadline'+(lastBeadIndex+1), 'beadinline'+(lastBeadIndex+1)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+2), parts: ['beadline'+(lastBeadIndex+2), 'beadinline'+(lastBeadIndex+2)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+3), parts: ['beadline'+(lastBeadIndex+3), 'beadinline'+(lastBeadIndex+3)]},
          {'type': 'bead_box', id:'bead'+(lastBeadIndex+4), parts: ['beadline'+(lastBeadIndex+4), 'beadinline'+(lastBeadIndex+4)]}
        ];
        //-------- build new Glass
        newGlass = [
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+1), line1: 'impostcenterline' + (lastImpostLineIndex + 2), line2: edgeTopId},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+2), line1: edgeTopId, line2: edgeLeftId},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+3), line1: edgeLeftId, line2: edgeBottomId},
          {'type': 'cross_point_glass', id: 'cpg'+(lastCPGlassIndex+4), line1: edgeBottomId, line2: 'impostcenterline' + (lastImpostLineIndex + 2)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+1), from: 'cpg'+(lastCPGlassIndex+4), to: 'cpg'+(lastCPGlassIndex+1)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+2), from: 'cpg'+(lastCPGlassIndex+1), to: 'cpg'+(lastCPGlassIndex+2)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+3), from: 'cpg'+(lastCPGlassIndex+2), to: 'cpg'+(lastCPGlassIndex+3)},
          {'type': 'glass_line', id: 'glassline'+(lastCPGlassIndex+4), from: 'cpg'+(lastCPGlassIndex+3), to: 'cpg'+(lastCPGlassIndex+4)},
          {'type': 'glass_paсkage', id: 'glass'+(lastGlassIndex+1), parts: ['glassline'+(lastCPGlassIndex+1), 'glassline'+(lastCPGlassIndex+2), 'glassline'+(lastCPGlassIndex+3), 'glassline'+(lastCPGlassIndex+4)]}
        ];

        //--------- added blockType properties
        for(var j = 0; j < newImpost.length; j++) {
          if (newImpost[j].type === 'cross_point_impost') {
            newImpost[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }
        for(var j = 0; j < newBead.length; j++) {
          if (newBead[j].type === 'cross_point_bead_out') {
            newBead[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }
        for(var j = 0; j < newGlass.length; j++) {
          if (newGlass[j].type === 'cross_point_glass') {
            newGlass[j].blockType = (isSashExist === 'frame') ? 'frame' : 'sash';
          }
        }


        //console.log('newImpost = ', newImpost);
        //console.log('newBead = ', newBead);
        //console.log('newGlass = ', newGlass);
        //----------- INSERT new glass in template Source
        for (var tempObj = 0; tempObj < newGlass.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newGlass[tempObj]);
        }
        //----------- INSERT new bead in template Source
        for (var tempObj = 0; tempObj < newBead.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newBead[tempObj]);
        }
        //----------- INSERT new impost in template Source
        for (var tempObj = 0; tempObj < newImpost.length; tempObj++) {
          $scope.templateSourceTEMP.objects.splice((insertIndex + tempObj), 0, newImpost[tempObj]);
        }

        //----------- change existed beads and glass package
        for(var tempObj = 0; tempObj < $scope.templateSourceTEMP.objects.length; tempObj++) {

          //------- change beads position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_bead_out') {
            if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-2)) {
              $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpbeadout'+(currLastIndex-1)) {
              $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
            }
          }

          //------- change glass position
          if($scope.templateSourceTEMP.objects[tempObj].type === 'cross_point_glass') {
            if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-2)) {
              $scope.templateSourceTEMP.objects[tempObj].line2 = 'impostcenterline' + (lastImpostLineIndex + 1);
            } else if($scope.templateSourceTEMP.objects[tempObj].id === 'cpg'+(currLastIndex-1)) {
              $scope.templateSourceTEMP.objects[tempObj].line1 = 'impostcenterline' + (lastImpostLineIndex + 1);
            }
          }
        }

        //console.log('!!!!new.templateSourceTEMP === ', JSON.stringify($scope.templateSourceTEMP));
        //console.log('!!!!new.templateSourceTEMP === ', $scope.templateSourceTEMP);
        //-------- build new template
        $scope.templateDefaultTEMP = new Template($scope.templateSourceTEMP, $scope.global.templateDepths);
        //console.log('templateDefaultTEMP == ', $scope.templateDefaultTEMP.objects);

        $scope.constructData.isImpostEditMenu = false;
        $scope.constructData.isImpostEdit = false;
        $scope.constructData.activeMenuItem = false;


      } else {
        playTTS($filter('translate')('construction.VOICE_SMALL_GLASS_BLOCK'), $scope.global.voiceHelperLanguage);
      }

    }

  }



}]);



// controllers/history.js

/* globals BauVoiceApp, STEP, unvisibleClass, selectClass, activeClass, typingTextByChar, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('HistoryCtrl', ['$scope', 'constructService', 'localStorage', 'localDB', 'globalDB', '$location', '$filter', '$cordovaDialogs', function ($scope, constructService, localStorage, localDB, globalDB, $location, $filter, $cordovaDialogs) {

  $scope.global = localStorage;

  $scope.global.isOpenedHistoryPage = true;
  $scope.global.isOpenedCartPage = false;

  $scope.history = {
    isOrderSearch: false,
    isIntervalDate: false,
    isOrderSort: false,
    isStartDate: false,
    isSortType: 'last',
    isFinishDate: false,
    isAllPeriod: true,
    startDate: '',
    finishDate: '',
    isCurrentOrdersHide: false,
    isWaitOrdersHide: false,
    isDoneOrdersHide: false,
    isEmptySortResult: false,
    //------- Draft
    isDraftView: false,
    isIntervalDateDraft: false,
    isOrderSortDraft: false,
    isStartDateDraft: false,
    isFinishDateDraft: false,
    isAllPeriodDraft: true,
    startDateDraft: '',
    finishDateDraft: '',
    isEmptySortResultDraft: false,
    isOrderExisted: false
  };
  //----- variables for orders sorting
  $scope.createdDate = 'created';
  $scope.reverse = true;
  $scope.reverseDraft = true;
  var orderMasterStyle = 'master',
      orderDoneStyle = 'done';

  //console.log('isOpenedHistoryPage', $scope.global.isOpenedHistoryPage);
  //console.log('isOrderFinished', $scope.global.isOrderFinished);

  //------ Download complete Orders from localDB
  localDB.selectDB($scope.global.ordersTableBD, {'orderType': $scope.global.fullOrderType}, function (results) {
    if (results.status) {
      $scope.ordersSource = angular.copy(results.data);
      $scope.orders = angular.copy(results.data);
      //----- max day for calendar-scroll
      $scope.history.maxDeliveryDateOrder = getOrderMaxDate($scope.orders);
    } else {
      console.log(results);
      $scope.history.isEmptySortResult = true;
    }
  });

  //------- defind Order MaxDate
  function getOrderMaxDate(orders) {
    var ordersDateArr = [];
    for (var it = 0; it < orders.length; it++) {
      var oldDateArr = orders[it].deliveryDate.split('.');
      var newDateStr = Date.parse(oldDateArr[1]+'/'+oldDateArr[0]+'/'+oldDateArr[2]);
      //var newDateStr = Date.parse(oldDateArr[2], oldDateArr[1], oldDateArr[0]);
      ordersDateArr.push(newDateStr);
    }
    ordersDateArr.sort(function (a, b) {
      return b - a
    });
    return ordersDateArr[0];
  }


  //=========== Searching

  $scope.orderSearching = function() {
    $scope.history.isOrderSearch = true;
    $scope.history.isIntervalDate = false;
    $scope.history.isOrderSort = false;
  };

  // Delete searching word
  $scope.cancelSearching = function() {
    $scope.searchingWord = '';
    $scope.history.isOrderSearch = false;
  };
  // Delete last chart searching word
  $scope.deleteSearchChart = function() {
    $scope.searchingWord = $scope.searchingWord.slice(0,-1);
  };



  //=========== Filtering by Date
  //------- show Date filter tool dialog
  $scope.intervalDateSelecting  = function() {
    var filterResult;
    if($scope.history.isDraftView) {
      if($scope.history.isIntervalDateDraft) {
        //-------- filtering orders by selected date
        filterResult = $scope.filteringByDate($scope.draftsSource, $scope.history.startDateDraft, $scope.history.finishDateDraft);
        if(filterResult) {
          $scope.drafts = filterResult;
        }
      }
      $scope.history.isIntervalDateDraft = !$scope.history.isIntervalDateDraft;
      $scope.history.isOrderSortDraft = false;
    } else {
      if($scope.history.isIntervalDate) {
        //-------- filtering orders by selected date
        filterResult = $scope.filteringByDate($scope.ordersSource, $scope.history.startDate, $scope.history.finishDate);
        if(filterResult) {
          $scope.orders = filterResult;
        }
      }
      $scope.history.isIntervalDate = !$scope.history.isIntervalDate;
      $scope.history.isOrderSearch = false;
      $scope.history.isOrderSort = false;
    }
  };

  //------ Select calendar-scroll
  $scope.openCalendarScroll = function(dataType) {
    if($scope.history.isDraftView) {
      if (dataType === 'start-date' && !$scope.history.isStartDateDraft ) {
        $scope.history.isStartDateDraft  = true;
        $scope.history.isFinishDateDraft  = false;
        $scope.history.isAllPeriodDraft  = false;
      } else if (dataType === 'finish-date' && !$scope.history.isFinishDateDraft ) {
        $scope.history.isStartDateDraft  = false;
        $scope.history.isFinishDateDraft  = true;
        $scope.history.isAllPeriodDraft  = false;
      } else if (dataType === 'full-date' && !$scope.history.isAllPeriodDraft ) {
        $scope.history.isStartDateDraft  = false;
        $scope.history.isFinishDateDraft  = false;
        $scope.history.isAllPeriodDraft  = true;
        $scope.history.startDateDraft  = '';
        $scope.history.finishDateDraft  = '';
        $scope.drafts = angular.copy($scope.draftsSource);
      } else {
        $scope.history.isStartDateDraft  = false;
        $scope.history.isFinishDateDraft  = false;
        $scope.history.isAllPeriodDraft = false;
      }
    } else {
      if (dataType === 'start-date' && !$scope.history.isStartDate) {
        $scope.history.isStartDate = true;
        $scope.history.isFinishDate = false;
        $scope.history.isAllPeriod = false;
      } else if (dataType === 'finish-date' && !$scope.history.isFinishDate) {
        $scope.history.isStartDate = false;
        $scope.history.isFinishDate = true;
        $scope.history.isAllPeriod = false;
      } else if (dataType === 'full-date' && !$scope.history.isAllPeriod) {
        $scope.history.isStartDate = false;
        $scope.history.isFinishDate = false;
        $scope.history.isAllPeriod = true;
        $scope.history.startDate = '';
        $scope.history.finishDate = '';
        $scope.orders = angular.copy($scope.ordersSource);
      } else {
        $scope.history.isStartDate = false;
        $scope.history.isFinishDate = false;
        $scope.history.isAllPeriod = false;
      }
    }
  };

  //------- filtering orders by Dates
  $scope.filteringByDate = function(obj, start, end) {
    if(start !== '' || end !== '') {
      var newObj, startDate, finishDate;
      newObj = angular.copy(obj);
      startDate = new Date(start).valueOf();
      finishDate = new Date(end).valueOf();
      if(start !== '' && end !== '' && startDate > finishDate) {
        return false;
      }
      for(var t = newObj.length-1;  t >= 0; t--) {
        var objDate = new Date(newObj[t].created).valueOf();
        if(objDate < startDate || objDate > finishDate) {
          newObj.splice(t, 1);
        }
      }
      return newObj;
    } else {
      return false;
    }
  };


  //=========== Sorting
  //------- show Sorting tool dialog
  $scope.orderSorting  = function() {
    if($scope.history.isDraftView) {
      $scope.history.isOrderSortDraft = !$scope.history.isOrderSortDraft;
      $scope.history.isIntervalDateDraft = false;
    } else {
      $scope.history.isOrderSort = !$scope.history.isOrderSort;
      $scope.history.isOrderSearch = false;
      $scope.history.isIntervalDate = false;
    }
  };

  //------ Select sorting type item in list
  $scope.sortingInit = function(sortType) {
    if($scope.history.isDraftView) {

      if($scope.history.isSortTypeDraft === sortType) {
        $scope.history.isSortTypeDraft = false;
        $scope.reverseDraft = true;
      } else {
        $scope.history.isSortTypeDraft = sortType;

        if($scope.history.isSortTypeDraft === 'first') {
          $scope.reverseDraft = true;
        }
        if($scope.history.isSortTypeDraft === 'last') {
          $scope.reverseDraft = false;
        }
      }

    } else {
      if ($scope.history.isSortType === sortType) {
        deSelectSortingType();
        $scope.orders = angular.copy($scope.ordersSource);
        $scope.history.isSortType = 'last';
        //$scope.reverse = true;

      } else {
        deSelectSortingType();
        $scope.history.isSortType = sortType;

        /*if($scope.history.isSortType === 'all-order') {
         deSelectSortingType()
         }*/
        if ($scope.history.isSortType === 'current-order') {
          $scope.history.isCurrentOrdersHide = false;
          $scope.history.isWaitOrdersHide = true;
          $scope.history.isDoneOrdersHide = true;
          checkExestingOrderType('order', 'credit');
        }
        if ($scope.history.isSortType === 'wait-order') {
          $scope.history.isCurrentOrdersHide = true;
          $scope.history.isWaitOrdersHide = false;
          $scope.history.isDoneOrdersHide = true;
          checkExestingOrderType(orderMasterStyle)
        }
        if ($scope.history.isSortType === 'done-order') {
          $scope.history.isWaitOrdersHide = true;
          $scope.history.isCurrentOrdersHide = true;
          $scope.history.isDoneOrdersHide = false;
          checkExestingOrderType(orderDoneStyle)
        }
      }
    }
  };

  function deSelectSortingType() {
    $scope.history.isCurrentOrdersHide = false;
    $scope.history.isWaitOrdersHide = false;
    $scope.history.isDoneOrdersHide = false;
  }

  //-------- checking orders quantity during order sorting
  function checkExestingOrderType(marker1, marker2) {
    var ordersSortCounter = 0;
    for(var ord = 0; ord < $scope.orders.length; ord++) {
      if($scope.orders[ord].orderStyle === marker1 || $scope.orders[ord].orderStyle === marker2) {
        ordersSortCounter++;
      }
    }
    if(ordersSortCounter > 0) {
      $scope.history.isEmptySortResult = false;
    } else {
      $scope.history.isEmptySortResult = true;
    }
  }


  // History/Draft View switcher
  $scope.viewSwitching = function() {
    $scope.history.isDraftView = !$scope.history.isDraftView;

    //------ Download draft Orders from localDB
    localDB.selectDB($scope.global.ordersTableBD, {'orderType': $scope.global.draftOrderType}, function (results) {
      if (results.status) {
        $scope.draftsSource = angular.copy(results.data);
        $scope.drafts = angular.copy(results.data);
      } else {
        console.log(results);
      }
    });
  };

  //--------- Delete order
  $scope.clickDeleteOrder = function(orderType, orderNum) {
/*
    navigator.notification.confirm(
      $filter('translate')('common_words.DELETE_ORDER_TXT'),
      deleteOrder,
      $filter('translate')('common_words.DELETE_ORDER_TITLE'),
      [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')]
    );
*/
    $cordovaDialogs.confirm(
      $filter('translate')('common_words.DELETE_ORDER_TXT'),
      $filter('translate')('common_words.DELETE_ORDER_TITLE'),
      [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')])
      .then(function(buttonIndex) {
        deleteOrder(buttonIndex);
      });

    function deleteOrder(button) {
      if(button == 1) {

        //-------- delete order in Local Objects
        if (orderType === $scope.global.fullOrderType) {
          for(var ord = 0; ord < $scope.orders.length; ord++) {
            if ($scope.orders[ord].orderId === orderNum) {
              $scope.orders.splice(ord, 1);
              $scope.ordersSource.splice(ord, 1);
            }
          }
        } else {
          for(var drf = 0; drf < $scope.drafts.length; drf++) {
            if ($scope.drafts[drf].orderId === orderNum) {
              $scope.drafts.splice(drf, 1);
              $scope.draftsSource.splice(drf, 1);
            }
          }
        }
        //---- delete order in LocalStorage
        for(var ord = 0; ord < $scope.global.orders.length; ord++) {
          if ($scope.global.orders[ord].orderId === orderNum) {
            $scope.global.orders.splice(ord, 1);
          }
        }
        //------- delete order in Local DB
        $scope.global.deleteOrderFromLocalDB(orderNum);

      }
    }
  };


  //------------ send Order to Factory
  $scope.sendOrderToFactory = function(orderStyle, orderNum) {

    if(orderStyle !== orderMasterStyle) {
      navigator.notification.confirm(
        $filter('translate')('common_words.SEND_ORDER_TXT'),
        sendOrder,
        $filter('translate')('common_words.SEND_ORDER_TITLE'),
        [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')]
      );
    }

    function sendOrder(button) {
      if(button == 1) {
        for(var ord = 0; ord < $scope.orders.length; ord++) {
          if($scope.orders[ord].orderId === orderNum) {
            $scope.orders[ord].orderStyle = orderDoneStyle;
            $scope.ordersSource[ord].orderStyle = orderDoneStyle;

            //------ synchronize with Global BD
            console.log('sendOrder!!!!', $scope.orders[ord]);
            globalDB.sendOrder($scope.orders[ord], function(result){console.log(result)});
          }
        }
        localDB.updateDB($scope.global.ordersTableBD, {'orderStyle': orderDoneStyle}, {'orderId': orderNum});
      }
    }

  };


  //----------- make Order Copy
  $scope.makeOrderCopy = function(orderStyle, orderNum) {

    if(orderStyle !== orderMasterStyle) {
      navigator.notification.confirm(
        $filter('translate')('common_words.COPY_ORDER_TXT'),
        copyOrder,
        $filter('translate')('common_words.COPY_ORDER_TITLE'),
        [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')]
      );
    }

    function copyOrder(button) {
      if (button == 1) {

        //---- new order number
        var newOrderCopy = {},
            newOrderNumber = Math.floor((Math.random() * 100000));

        for(var ord = 0; ord < $scope.orders.length; ord++) {
          if ($scope.orders[ord].orderId === orderNum) {
            newOrderCopy = angular.copy($scope.orders[ord]);
          }
        }
        delete newOrderCopy.id;
        delete newOrderCopy.created;
        newOrderCopy.orderId = newOrderNumber;
        //---- save in LocalDB
        localDB.insertDB($scope.global.ordersTableBD, newOrderCopy);
        //---- save in LocalStorage
        $scope.global.orders.push(newOrderCopy);
        //---- get it again from LocalDB as to "created date"
        //TODO переделать на создание даты здесь, а не в базе? переделака директивы на другой формат даты
        localDB.selectDB($scope.global.ordersTableBD, {'orderId': newOrderNumber}, function (results) {
          if (results.status) {
            newOrderCopy = angular.copy(results.data);
            //---- add copied new order in Local Objects
            $scope.orders.push(newOrderCopy[0]);
            $scope.ordersSource.push(newOrderCopy[0]);
          } else {
            console.log(results);
          }
        });

        //------ Download Products Data from localDB
        localDB.selectDB($scope.global.productsTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allProductsDB = angular.copy(results.data);
            var newAllProductsXOrder = rewriteObjectProperty(allProductsDB, newOrderNumber);
            //console.log(newAllProductsXOrder);
            if(newAllProductsXOrder && newAllProductsXOrder.length > 0) {
              for(var p = 0; p < newAllProductsXOrder.length; p++) {
                localDB.insertDB($scope.global.productsTableBD, newAllProductsXOrder[p]);
              }
            }
          } else {
            console.log(results);
          }
        });

        //------ Download Add Elements from localDB
        localDB.selectDB($scope.global.addElementsTableBD, {'orderId': orderNum}, function (results) {
          if (results.status) {
            var allAddElementsDB = angular.copy(results.data);
            var newAllAddElementsXOrder = rewriteObjectProperty(allAddElementsDB, newOrderNumber);
            if(newAllAddElementsXOrder && newAllAddElementsXOrder.length > 0) {
              for(var w = 0; w < newAllAddElementsXOrder.length; w++) {
                localDB.insertDB($scope.global.addElementsTableBD, newAllAddElementsXOrder[w]);
              }
            }
          } else {
            console.log(results);
          }
        });

      }
    }

  };


  function rewriteObjectProperty(objSource, orderId) {
    if(objSource && objSource.length > 0) {
      for(var i = 0; i < objSource.length; i++) {
        delete objSource[i].id;
        delete objSource[i].created;
        objSource[i].orderId = orderId;
      }
      return objSource;
    }
  }

  //--------------- Edit Order & Draft
  $scope.editOrder = function(orderNum) {
    $scope.global.orderEditNumber = orderNum;
    $scope.global.isConfigMenu = true;
    $scope.global.isOpenedHistoryPage = false;
    $scope.global.gotoCartPage();
  };

/*
  function buildOrdersByType(tempOrders, orderStyle) {
    for(var ord = 0; ord < $scope.orders.length; ord++) {
      if($scope.orders[ord].orderStyle === orderStyle) {
        tempOrders.push($scope.orders[ord]);
      }
    }
  }
*/
}]);


// controllers/location.js

/* globals BauVoiceApp */

'use strict';

BauVoiceApp.controller('LocationCtrl', ['$scope', 'localDB', 'localStorage', function ($scope, localDB, localStorage) {

  $scope.global = localStorage;
  var generalLocations = [];
  $scope.locations = [];

  //----- current user location
  $scope.userNewLocation = angular.copy($scope.global.currentGeoLocation.fullLocation);

  //--------- get all cities
  localDB.selectAllDBGlobal($scope.global.regionsTableDBGlobal, function (results) {
    if (results.status) {
      $scope.regions = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });
  localDB.selectAllDBGlobal($scope.global.countriesTableDBGlobal, function (results) {
    if (results.status) {
      $scope.countries = angular.copy(results.data);
    } else {
      console.log(results);
    }
  });
  localDB.selectAllDBGlobal($scope.global.citiesTableDBGlobal, function (results) {
    if (results.status) {
      $scope.cities = angular.copy(results.data);

      for(var c = 0; c < $scope.cities.length; c++) {
        var location = {};
        location.cityId = $scope.cities[c].id;
        location.cityName = $scope.cities[c].name;
        for(var r = 0; r <  $scope.regions.length; r++) {
          if($scope.cities[c].region_id === $scope.regions[r].id) {
            location.regionName = $scope.regions[r].name;
            location.climaticZone = $scope.regions[r].climatic_zone;
            location.heatTransfer = $scope.regions[r].heat_transfer;
            for(var s = 0; s < $scope.countries.length; s++) {
              if($scope.regions[r].country_id === $scope.countries[s].id) {
                location.countryName = $scope.countries[s].name;
                generalLocations.push(location);
              }
            }
          }
        }
      }

      //-------- build locations object for searching
      for(var i = 0; i < generalLocations.length; i++) {
        var tempObj = {
          cityId: generalLocations[i].cityId,
          climaticZone: generalLocations[i].climaticZone,
          heatTransfer: generalLocations[i].heatTransfer,
          fullLocation: '' + generalLocations[i].cityName + ', ' + generalLocations[i].regionName + ', ' + generalLocations[i].countryName,
        };
        $scope.locations.push(tempObj);
      }
    } else {
      console.log(results);
    }
  });

  //-------- Select City
  $scope.selectCity = function(locationId) {
    for(var j = 0; j < $scope.locations.length; j++) {
      if($scope.locations[j].cityId === locationId) {
        $scope.userNewLocation = $scope.locations[j].fullLocation;
        //----- if user settings changing
        if($scope.global.isOpenSettingsPage) {
          $scope.global.userInfo.fullLocation = $scope.userNewLocation;
          $scope.global.userInfo.city_id = locationId;
          for(var i = 0; i < generalLocations.length; i++) {
            if (generalLocations[i].cityId === locationId) {
              $scope.global.userInfo.cityName = generalLocations[i].cityName;
              $scope.global.userInfo.regionName = generalLocations[i].regionName;
              $scope.global.userInfo.countryName = generalLocations[i].countryName;
              $scope.global.userInfo.climaticZone = generalLocations[i].climaticZone;
              $scope.global.userInfo.heatTransfer = generalLocations[i].heatTransfer;
            }
          }
          //----- save changes in Global DB
          localDB.updateDBGlobal($scope.global.usersTableDBGlobal, {"city_id": locationId}, {"id": $scope.global.userInfo.id});
        //-------- if current geolocation changing
        } else {
          for(var c = 0; c < generalLocations.length; c++) {
            if (generalLocations[c].cityId === locationId) {
              //----- build new currentGeoLocation
              $scope.global.currentGeoLocation = angular.copy(generalLocations[c]);
              $scope.global.currentGeoLocation.fullLocation = $scope.userNewLocation;
            }
          }
        }
        $scope.global.startProgramm = false;
        closeLocationPage();
      }
    }

  };
  //-------- close Location Page
  $scope.cancelLocationPage = function() {
    closeLocationPage()
  };

  function closeLocationPage() {
    if($scope.global.isOpenSettingsPage) {
      $scope.global.gotoSettingsPage();
    } else {
      $scope.global.showNavMenu = true;
      $scope.global.isConfigMenu = false;
      $scope.global.showPanels = {};
      $scope.global.gotoMainPage();
    }
  }

}]);


// controllers/login.js

'use strict';

BauVoiceApp.controller('LoginCtrl', ['$scope', '$location', '$translate', 'globalDB', function ($scope, $location, $translate, globalDB) {
  $scope.isCodeValid = true;
  $scope.submitted = false;
  $scope.isCodeCheckingSuccess = true;

  $scope.checkCode = function () {
    // запрос на сервер с проверкой кода. Если проверка прошла успешно, то синхронизировать базу данных.
    // Если неуспешно, то выдать сообщение об ошибке.
    //$scope.isCodeCheckingSuccess = !$scope.isCodeCheckingSuccess;
    console.log('click = ', $scope.submitted);
    if ($scope.isCodeCheckingSuccess) {
      $scope.isCodeValid = true;
    }
  };

  // Вряд ли нужна такая проверка, т.к. пользователю будет неудобно вводить номер со скобками и дефисами.
  // К тому же форматы номеров отличаются в разных странах.
//  $scope.regPhone = /^\+\d{2}\(\d{3}\)\d{3}-\d{4}$/;

  $scope.user = {};

  $scope.submitForm = function (form) {
    // Trigger validation flag.
    $scope.submitted = true;

    if (form.$valid) {
      $location.path('/main');
    }
  };
/*
  $scope.switchLang = function () {
    $translate.use() === 'en' ? $translate.use('ru') : $translate.use('en');
  };
*/
  //--- get device code
  globalDB.getDeviceCodeLocalDb(function(result){
    $scope.deviceCode = result.data.deviceCode;
  });
  //---- impost global DB
  globalDB.initApp(function(result){});
  //globalDB.clearDb(function(result){});
  //globalDB.syncDb(function(result){});

}]);


// controllers/main.js

/* globals BauVoiceApp */

'use strict';

BauVoiceApp.controller('MainCtrl', ['$rootScope', '$scope', 'localStorage', 'constructService', function ($rootScope, $scope, localStorage, constructService) {

  $scope.global = localStorage;
/*
  $scope.main = {
    isConfigMenuShow: false
  };

  $rootScope.$on('swipeMainPage', function() {
    $scope.main.isConfigMenuShow = !$scope.main.isConfigMenuShow;
  });
*/

}]);



// controllers/settings.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('SettingsCtrl', ['$scope', 'globalDB', 'localStorage', '$location', 'localDB', function ($scope, globalDB, localStorage, $location, localDB) {

  $scope.global = localStorage;

  $scope.settings = {
    DELAY_START: STEP,
    DELAY_SHOW_ICONS: STEP * 10,
    isInsertPhone: false,
    isEmailError: false,
    addPhones: [],
    tempAddPhone: '',
    regex: /^[0-9]{1,10}$/,
    mailReg: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    typing: 'on'
  };
  $scope.global.startProgramm = false;
  //----- for location page
  $scope.global.isOpenSettingsPage = true;

  //----- parse additional phones
  if($scope.global.userInfo.contact_name !== '') {
    $scope.settings.addPhones = $scope.global.userInfo.contact_name.split(',');
  }

  //----- change avatar
  $scope.changeAvatar = function() {
    navigator.camera.getPicture( function( data ) {
      $scope.global.AvatarUrl = 'data:image/jpeg;base64,' + data;
    }, function( error ) {
      console.log( 'Error upload user avatar' + error );
      console.log($scope.global.AvatarUrl);
    }, {
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      targetWidth: 76,
      targetHeight: 76,
      mediaType: Camera.MediaType.PICTURE
    } );
  };

  $scope.changeSettingData = function(id, obj) {
    $scope.settings.selectedSetting = id;
    findInput(obj.currentTarget.id);
  };

  $scope.appendInputPhone = function() {
    $scope.settings.isInsertPhone = !$scope.settings.isInsertPhone;
    $scope.settings.tempAddPhone = '';
    $scope.settings.isErrorPhone = false;
    findInputPhone();
  };

  $scope.cancelAddPhone = function() {
    $scope.settings.isInsertPhone = false;
    $scope.settings.isErrorPhone = false;
  };

  $scope.saveChanges = function(marker, newTxt) {
    if (event.which == 13) {
      $scope.saveTxtInBD(marker, newTxt);
    }
  };

  $scope.saveChangesBlur = function(marker, newTxt) {
      $scope.saveTxtInBD(marker, newTxt);
  };

  $scope.saveTxtInBD = function(marker, newTxt) {
    switch(marker) {
      case 'user-name':
        localDB.updateDBGlobal($scope.global.usersTableDBGlobal, {"name": newTxt}, {"id": $scope.global.userInfo.id});
        break;
      case 'user-address':
        localDB.updateDBGlobal($scope.global.usersTableDBGlobal, {"city_phone": newTxt}, {"id": $scope.global.userInfo.id}); //TODO создать поле в базе данных
        break;
      case 'user-email':
        var checkEmail = $scope.settings.mailReg.test(newTxt);
        if(checkEmail) {
          $scope.settings.isEmailError = false;
          localDB.updateDBGlobal($scope.global.usersTableDBGlobal, {"email": newTxt}, {"id": $scope.global.userInfo.id});
        } else {
          $scope.settings.isEmailError = true;
        }
        break;
    }
  };

  $scope.changeEmail = function() {
    $scope.settings.isEmailError = false;
  };

  $scope.saveChangesPhone = function() {
    if (event.which == 13) {
      var checkPhone = $scope.settings.regex.test($scope.settings.tempAddPhone);
      if(checkPhone) {
        $scope.settings.isInsertPhone = false;
        $scope.settings.isErrorPhone = false;
        $scope.settings.addPhones.push($scope.settings.tempAddPhone);
        //------- save phones in DB
        $scope.savePhoneInDB($scope.settings.addPhones);
      } else {
        $scope.settings.isErrorPhone = true;
      }
    }
  };

  $scope.deletePhone = function(phoneId) {
    $scope.settings.addPhones.splice(phoneId, 1);
    //------- save phones in DB
    $scope.savePhoneInDB($scope.settings.addPhones);
  };

  //------- save phones in DB
  $scope.savePhoneInDB = function(phones) {
    var phonesString = phones.join();
    $scope.global.userInfo.contact_name = phonesString;
    localDB.updateDBGlobal($scope.global.usersTableDBGlobal, {"contact_name": phonesString}, {"id": $scope.global.userInfo.id}); //TODO создать поле в базе данных
    $scope.settings.tempAddPhone = '';
  };

  $scope.gotoPasswordPage = function() {
    $location.path('/change-pass');
  };

  $scope.gotoLanguagePage = function() {
    $location.path('/change-lang');
  };

  $scope.closeSettingsPage = function() {
    $scope.global.isOpenSettingsPage = false;
    $scope.global.isReturnFromDiffPage = true;
    $scope.global.gotoMainPage();
  };

  $scope.logOut = function() {
    //------- clearing local DB
    localDB.deleteTable($scope.global.productsTableBD);
    localDB.deleteTable($scope.global.addElementsTableBD);
    localDB.deleteTable($scope.global.ordersTableBD);

    $location.path('/login');
  };

  function findInput(idElement) {
    setTimeout(function() {
      $('#'+idElement).find('input').focus();
    }, 100);
  }

  function findInputPhone() {
    setTimeout(function() {
      $('.set-input-phone').focus();
    }, 100);
  }

}]);


// directives/calendar-scroll.js

'use strict';

BauVoiceApp.directive('calendarScroll', ['$filter', function($filter) {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: {
      maxTime: '@',
      calendarTime: '='
    },
    link: function (scope, element, attrs) {
      $(function(){
        var today = new Date();
        console.log('today', typeof today);
        console.log(today);
        var opt = {
          theme: 'ios',
          display: 'inline',
          mode: 'mixed',
          showLabel: false,
          maxDate: today,
          //height: 80,
          height: 40,
          fixedWidth: 656,
          maxWidth: 656,
          onChange : function (valueText) {
            scope.calendarTime = valueText;
            scope.$apply();
          }
        };
        opt.monthNames = $filter('translate')('common_words.MONTHA').split(', ');
        //element.mobiscroll().date(opt);

        attrs.$observe('maxTime', function () {
          if(scope.maxTime) {
            console.log('maxTime', typeof scope.maxTime);
            console.log(scope.maxTime);

            var newMaxDate = new Date(parseInt(scope.maxTime, 10));
            console.log('newMaxDate', typeof newMaxDate);
            console.log(newMaxDate);
            //opt.maxDate = newMaxDate.toString();
            opt.maxDate = newMaxDate;
            //element.mobiscroll().date(opt);
          }
        });

      });
    }
  };
}]);


// directives/calendar.js

'use strict';

BauVoiceApp.directive('calendar', [ function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      dataMonths: '@calendarOption',
      dataMonthsShort: '@calendarOptionShort'
    },
    link: function (scope, element, attrs) {
      $(function(){
        var opt = {
          flat: true,
          format: 'd.m.Y',
          locale			: {
            days: [],
            daysShort: [],
            daysMin: [],
            monthsShort: [],
            months: []
          },
          date: scope.$parent.global.order.deliveryDate,
          min: scope.$parent.cartMenuData.minDeliveryDate,
          max: scope.$parent.cartMenuData.maxDeliveryDate,
          change: function (date) {
            scope.$parent.checkDifferentDate(scope.$parent.global.order.deliveryDate, date);
            scope.$apply();
          }
        };
        opt.locale.monthsShort = scope.dataMonthsShort.split(', ');
        opt.locale.months = scope.dataMonths.split(', ');
        element.pickmeup(opt);
      });
    }
  };
}]);



// directives/order-date.js

'use strict';

BauVoiceApp.directive('orderDate', ['$filter', function($filter) {
  return {
    restrict: 'A',
    scope: {
      orderDate: '@',
      typeDate: '='
    },

    link: function (scope, element, attrs) {

      function getDateInNewFormat(oldD, type) {
        var oldDateFormat, oldDateFormatArr, monthsArr, newDateFormat, monthId;

        monthsArr = $filter('translate')('common_words.MONTHA').split(', ');

        if(oldD !== '') {
          if(type === 'order') {
            oldDateFormat = oldD.split(' ');
            oldDateFormatArr = oldDateFormat[0].split('-');
            monthId = parseInt(oldDateFormatArr[1], 10) - 1;
            newDateFormat = oldDateFormatArr[2] + ' ' + monthsArr[monthId] + ', ' + oldDateFormatArr[0];
          } else {
            oldDateFormatArr = oldD.split('/');
            monthId = parseInt(oldDateFormatArr[0], 10) - 1;
            newDateFormat = oldDateFormatArr[1] + ' ' + monthsArr[monthId] + ', ' + oldDateFormatArr[2];
          }
        } else {
          oldDateFormat = new Date();
          newDateFormat = oldDateFormat.getDate() + ' ' + monthsArr[oldDateFormat.getMonth()] + ', ' + oldDateFormat.getFullYear();
        }

        if(!type && oldD === '') {
          element.text('');
        } else {
          element.text(newDateFormat);
        }
      }

      getDateInNewFormat(scope.orderDate, scope.typeDate);

      attrs.$observe('orderDate', function () {
        getDateInNewFormat(scope.orderDate, scope.typeDate);
      });

    }
  };
}]);


// directives/order-filter.js

'use strict';
//BauVoiceApp.filter('orderSorting', [ '$scope', function($scope) {
BauVoiceApp.filter('orderSorting', function() {
  return function(items, sortType) {
    var filtered = [];

    function buildOrdersByType(items, orderStyle) {
      angular.forEach(items, function(item) {
        if(angular.equals(item.orderStyle, orderStyle)) {
          filtered.push(item);
        }
      });
    }

    if(sortType === 'type') {
      buildOrdersByType(items, 'order');
      buildOrdersByType(items, 'credit');
      buildOrdersByType(items, 'master');
      buildOrdersByType(items, 'done');
    } else if(sortType === 'first') {
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      filtered.reverse();
    } else {
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
    }

    /*filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });*/

    return filtered;
  };

});



// directives/price-x-qty.js

'use strict';

BauVoiceApp.directive('priceFixed', function() {
  return {
    restrict: 'A',
    scope: {
      priceFixed: '@',
      qtyElement: '@',
      currencyElement: '@'
    },

    link: function (scope, element, attrs) {

      function getNewPrice(price, qty, currency) {
        if(typeof price === 'string') {
          var price = parseFloat(price);
        }
        var newPrice = parseFloat( (parseFloat(price.toFixed(2)) * qty).toFixed(2) ) + ' ' + currency;
        element.text(newPrice);
      }

      getNewPrice(scope.priceFixed, scope.qtyElement, scope.currencyElement);

      attrs.$observe('qtyElement', function () {
        getNewPrice(scope.priceFixed, scope.qtyElement, scope.currencyElement);
      });
      attrs.$observe('priceFixed', function () {
        getNewPrice(scope.priceFixed, scope.qtyElement, scope.currencyElement);
      });

    }
  };
});



// directives/price.js

/* STEP */
'use strict';

BauVoiceApp.directive('price', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      priceValue: '=',
      priceCurrency: '='
    },
    template:
      '<div class="price clearfix" data-output="priceValue">' +
        '<div id="price" class="price-value">' +
          '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
          '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
          '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
          '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
          '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
          '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
          '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
          '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
          '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
          '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
          '<div class="digit-cell"><div class="digit">&nbsp;</div><div class="digit">0</div><div class="digit">1</div><div class="digit">2</div><div class="digit">3</div><div class="digit">4</div><div class="digit">5</div><div class="digit">6</div><div class="digit">7</div><div class="digit">8</div><div class="digit">9</div><div class="digit">.</div></div>' +
        '</div>' +
        '<div id="currency" class="price-currency">{{ priceCurrency }}</div>' +
      '</div>',
    link: function (scope, elem, attrs) {
      scope.$watch(attrs.output, function (price) {
        changePrice(price, elem);
      });

    }
  };
});


function changePrice(price, elem) {
  var DELAY_PRICE_DIGIT = STEP * 2,
      DIGIT_CELL_HEIGHT = 64,
      priceByDigit,
      digitCells = elem.find('#price').children(),
      MAX_DIGITS = digitCells.length,
      COLUMN_LENGTH = $(digitCells[0]).children().length,
      n = 0,
      $digitCell,
      digit, scrollDigitY,
      i;

  if(price === undefined) {
    return false;
  } else {

    playSound('price');

    //priceByDigit = price.toString().split('');
    if(typeof price === 'string') {
      priceByDigit = price.split('');
    } else {
      priceByDigit = price.toFixed(2).split('');
    }

  }
  changePrice.revertDigitState = function () {
    $digitCell.animate({ top: 0 }, 'fast');
  };

  changePrice.initDigit = function () {
    digit = priceByDigit.shift();
  };

  changePrice.animateDigit = function () {
    if (digit === '.') {
      scrollDigitY = (COLUMN_LENGTH - 1) * DIGIT_CELL_HEIGHT;
    } else {
      scrollDigitY = (parseInt(digit, 10) + 1) * DIGIT_CELL_HEIGHT;
    }

    $digitCell
      .delay(n * DELAY_PRICE_DIGIT)
      .animate({ top: (-scrollDigitY/16) + "rem" }, 'fast');
  };

  for (i = MAX_DIGITS; i > 0; i--) {
    $digitCell = $(digitCells[n]);

    if (i > priceByDigit.length) {
      changePrice.revertDigitState();
    } else {
      changePrice.initDigit();
      changePrice.animateDigit();
    }

    n++;
  }
}


// directives/show-delay.js

'use strict';

BauVoiceApp.directive('showDelay', function () {
  return {
    scope: {
      showDelay: '@'
    },
    link: function (scope, elem, attrs) {
      attrs.$observe('showDelay', function () {
        showElementWithDelay();
      });

      function showElementWithDelay() {
        var unvisibleClass = 'unvisible';

        setTimeout(function () {
          elem.removeClass(unvisibleClass);
        }, parseInt(scope.showDelay, 10));
      }
    }
  };
});


// directives/svg.js

'use strict';

BauVoiceApp.directive('svgTemplate', [ function() {

  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      typeConstruction: '@',
      template: '=',
      templateWidth: '=',
      templateHeight: '='
    },
    link: function (scope, elem, attrs) {
      /*
      var svg = buildTemplateSVG(scope.template, scope.templateWidth, scope.templateHeight);
      if(scope.typeConstruction === 'edit') {
        elem.css({opacity: 0, visibility: 'hidden'});
      }
      elem.html(svg);
      if(scope.typeConstruction === 'edit') {
        //if(window.panZoom) {
        //  window.panZoom.destroy();
        //  delete window.panZoom;
        //}
        startPinch();
        elem.css({opacity: 1, visibility: 'visible'});
      }
*/
      scope.$watch('template', function () {
        var svg = buildTemplateSVG(scope.template, scope.templateWidth, scope.templateHeight);
        if(scope.typeConstruction === 'edit') {
          elem.css({opacity: 0, visibility: 'hidden'});
        }
        elem.html(svg);
        if(scope.typeConstruction === 'edit') {
          //if(window.panZoom) {
          //  window.panZoom.destroy();
          //  delete window.panZoom;
          //}
          startPinch();
          setTimeout(function(){
            elem.css({opacity: 1, visibility: 'visible'});
          }, 100);

        }
      });
/*
      scope.$watch('doorConfig', function () {
        var svg = buildTemplateSVG(scope.template, scope.templateWidth, scope.templateHeight);
        if(scope.typeConstruction === 'edit') {
          elem.css({opacity: 0, visibility: 'hidden'});
        }
        elem.html(svg);
        if(scope.typeConstruction === 'edit') {
          //if(window.panZoom) {
          //  window.panZoom.destroy();
          //  delete window.panZoom;
          //}
          startPinch();
          setTimeout(function(){
            elem.css({opacity: 1, visibility: 'visible'});
          }, 100);

        }
      });
*/
      function buildTemplateSVG(template, canvasWidth, canvasHeight) {
        //console.log(template);
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
            draw = SVG(svg).size(canvasWidth, canvasHeight),
            sizeClass = 'size-box',
            sizeEditClass = 'size-box-edited',
            elementsSVG = {
              frames: [],
              glasses: [],
              imposts: [],
              sashes: [],
              beads: [],
              dimensionsH: [],
              dimensionsV: [],
              openDirections: []
            },
            //coefScaleW = 0.75,
            //coefScaleH = 0.5,
            coefScaleW = 0.6,
            coefScaleH = 0.35,
            overallDimH = 0,
            overallDimV = 0,
            edgeTop = 0,
            edgeLeft = 0,
            //overallDimH = 2000,
            //overallDimV = 2000,
            //edgeTop = 300,
            //edgeLeft = 250,
            //coefScrollW = 0.55,
            //sizeBoxWidth = 250,
            //sizeBoxHeight = 120,
            //sizeBoxRadius = 35,

            dimLineHeight = 150,
            dimMarginBottom = -20,
            dimEdger = 50,

            sizeBoxWidth = 160,
            sizeBoxHeight = 70,
            sizeBoxRadius = 20,
            sizeBoxMarginBottom = 50;



        //------- Create elements of construction
        for (var i = 0; i < template.objects.length; i++) {
          var path = '',
              openSashLine = '';

          switch(template.objects[i].type) {
            case 'frame':
              //console.log('scope.parent.global.isConstructDoor =', scope.$parent.global.isConstructDoor);
              if(scope.$parent.global.isConstructDoor && scope.$parent.global.product.doorShapeId > 0){
                //console.log('doorConfig =', scope.$parent.global.product.doorShapeId);
                switch(template.objects[i].id) {
                  //----- without doorstep
                  case 'frame1':
                    path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                    path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ';
                    path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                    break;
                  case 'frame2':
                    path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                    path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ';
                    path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                    break;
                  case 'frame3':
                    if(scope.$parent.global.product.doorShapeId === 2) {
                      //----- inside Al doorstep
                      path += template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                      path += template.objects[i].parts[1].toPoint.x + ' ' + (+template.objects[i].parts[0].toPoint.y - 35) + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + (+template.objects[i].parts[0].fromPoint.y - 35) + ' ';
                      path += template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                    } else if(scope.$parent.global.product.doorShapeId === 3) {
                      //----- outside Al doorstep
                      path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                      path += template.objects[i].parts[0].toPoint.x + ' ' + (+template.objects[i].parts[0].toPoint.y + 20) + ' ' + template.objects[i].parts[0].fromPoint.x + ' ' + (+template.objects[i].parts[0].fromPoint.y + 20) + ' ';
                      path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                    }
                    break;
                  case 'frame4':
                    path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                    path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                    path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
                    break;
                }

              } else {
                path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
                path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ';
                path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
              }
              if(path !== '') {
                elementsSVG.frames.push(path);
              }
              break;

            case 'impost':
              path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
              path += template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ' + template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ';
              path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
              elementsSVG.imposts.push(path);
              break;

            case 'sash':
              path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
              path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ';
              path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
              elementsSVG.sashes.push(path);

              //---- open directions lines
              if(template.objects[i].openType.length > 0) {
                var middleX = template.objects[i].openType[1].fromPoint.x + ((template.objects[i].openType[1].lengthVal/2) * (template.objects[i].openType[1].toPoint.x - template.objects[i].openType[1].fromPoint.x) / template.objects[i].openType[1].lengthVal);
                var middleY = template.objects[i].openType[1].fromPoint.y + ((template.objects[i].openType[1].lengthVal/2) * (template.objects[i].openType[1].toPoint.y - template.objects[i].openType[1].fromPoint.y) / template.objects[i].openType[1].lengthVal);

                openSashLine += template.objects[i].openType[0].fromPoint.x + ' ' + template.objects[i].openType[0].fromPoint.y + ' ' + middleX + ' ' + middleY + ' ';
                openSashLine += template.objects[i].openType[0].toPoint.x + ' ' + template.objects[i].openType[0].toPoint.y + ' ';

                elementsSVG.openDirections.push(openSashLine);
              }
              break;

            case 'bead_box':
              path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ' + template.objects[i].parts[0].toPoint.x + ' ' + template.objects[i].parts[0].toPoint.y + ' ';
              path += template.objects[i].parts[1].toPoint.x + ' ' + template.objects[i].parts[1].toPoint.y + ' ' + template.objects[i].parts[1].fromPoint.x + ' ' + template.objects[i].parts[1].fromPoint.y + ' ';
              path += template.objects[i].parts[0].fromPoint.x + ' ' + template.objects[i].parts[0].fromPoint.y + ' ';
              elementsSVG.beads.push(path);
              break;

            case 'glass_paсkage':
              var glass = {path: ''};
              for(var p = 0; p < template.objects[i].parts.length; p++) {
                glass.path += template.objects[i].parts[p].fromPoint.x + ' ' + template.objects[i].parts[p].fromPoint.y + ' ' + template.objects[i].parts[p].toPoint.x + ' ' + template.objects[i].parts[p].toPoint.y + ' ';
              }
              glass.id = template.objects[i].id;
              elementsSVG.glasses.push(glass);
              break;
/*
            case 'dimensionsH':
              var dim = {},
                  height = template.objects[i].height * template.objects[i].level,
                  heightSizeLine = height;
                  dim.lines = [];

              if(template.objects[i].side === 'top') {
                if(+template.objects[i].level > 1) {
                  heightSizeLine = template.objects[i].height * template.objects[i].level/1.5;
                  edgeTop = heightSizeLine * 2;
                }

                dim.lines[0] = template.objects[i].fromPoint.x  + ' ' +
                  template.objects[i].fromPoint.y  + ' ' +
                  template.objects[i].fromPoint.x  + ' ' +
                  (template.objects[i].fromPoint.y -  heightSizeLine);
                dim.lines[1] = template.objects[i].fromPoint.x  + ' ' +
                  (template.objects[i].fromPoint.y -  height / 2) + ' ' +
                  template.objects[i].toPoint.x   + ' ' +
                  (template.objects[i].fromPoint.y -  height / 2);
                dim.lines[2] = template.objects[i].toPoint.x   + ' ' +
                  (template.objects[i].toPoint.y -  heightSizeLine) + ' ' +
                  template.objects[i].toPoint.x   + ' ' +
                  template.objects[i].toPoint.y;

                dim.textY = (-heightSizeLine);

              } else if(template.objects[i].side === 'bottom') {
                dim.lines[0] = template.objects[i].fromPoint.x  + ' ' +
                  template.objects[i].fromPoint.y  + ' ' +
                  template.objects[i].fromPoint.x  + ' ' +
                  (+template.objects[i].fromPoint.y +  height);
                dim.lines[1] = template.objects[i].fromPoint.x  + ' ' +
                  (+template.objects[i].fromPoint.y +  height / 2) + ' ' +
                  template.objects[i].toPoint.x   + ' ' +
                  (+template.objects[i].fromPoint.y +  height / 2);
                dim.lines[2] = template.objects[i].toPoint.x   + ' ' +
                  (+template.objects[i].toPoint.y +  height) + ' ' +
                  template.objects[i].toPoint.x   + ' ' +
                  template.objects[i].toPoint.y;

                dim.textY = (+template.objects[i].toPoint.y + height * 1.5);
              }

              dim.lengthVal =  template.objects[i].lengthVal;
              dim.textX = + template.objects[i].fromPoint.x + (template.objects[i].lengthVal / 2);
              dim.id = template.objects[i].id;
              dim.sizeType = template.objects[i].type;
              if(template.objects[i].limits) {
                dim.limits = template.objects[i].limits;
              }
              elementsSVG.dimensionsH.push(dim);

              //-------- scale svg
              if (template.objects[i].id === 'overallDimH') {
                if(scope.typeConstruction !== 'icon' && scope.typeConstruction !== 'bigIcon') {
                  canvasWidth = template.objects[i].lengthVal + edgeLeft;
                  overallDimH = canvasWidth / coefScaleW;
                }
              }
              break;

            case 'dimensionsV':
              var dim = {},
                  height = template.objects[i].height * template.objects[i].level;
                  dim.lines = [];

              if(template.objects[i].side === 'right') {
                dim.lines[0] = template.objects[i].fromPoint.x  + ' ' +
                  template.objects[i].fromPoint.y  + ' ' +
                  (+template.objects[i].fromPoint.x +  height) + ' ' +
                  template.objects[i].fromPoint.y;
                dim.lines[1] = (+template.objects[i].fromPoint.x +  height / 2) + ' ' +
                  template.objects[i].fromPoint.y + ' ' +
                  (+template.objects[i].toPoint.x  +  height / 2) + ' ' +
                  template.objects[i].toPoint.y;
                dim.lines[2] = template.objects[i].toPoint.x  + ' ' +
                  template.objects[i].toPoint.y + ' ' +
                  (+template.objects[i].toPoint.x +  height) + ' ' +
                  template.objects[i].toPoint.y;

                dim.textX = (+template.objects[i].toPoint.x + height * 2);
              } else if(template.objects[i].side === 'left') {
                dim.lines[0] = template.objects[i].fromPoint.x  + ' ' +
                  template.objects[i].fromPoint.y  + ' ' +
                  (template.objects[i].fromPoint.x -  height) + ' ' +
                  template.objects[i].fromPoint.y;
                dim.lines[1] = (template.objects[i].fromPoint.x -  height / 2) + ' ' +
                  template.objects[i].fromPoint.y + ' ' +
                  (template.objects[i].toPoint.x  -  height / 2) + ' ' +
                  template.objects[i].toPoint.y;
                dim.lines[2] = template.objects[i].toPoint.x  + ' ' +
                  template.objects[i].toPoint.y + ' ' +
                  (template.objects[i].toPoint.x -  height) + ' ' +
                  template.objects[i].toPoint.y;

                dim.textX = (-height);
                if(+template.objects[i].level > 1) {
                  edgeLeft = height * 2;
                  //console.log('edgeLeft = '+edgeLeft);
                }

              }

              dim.lengthVal =  template.objects[i].lengthVal;
              dim.textY = (template.objects[i].lengthVal / 2);
              dim.id = template.objects[i].id;
              dim.sizeType = template.objects[i].type;
              if(template.objects[i].limits) {
                dim.limits = template.objects[i].limits;
              }
              elementsSVG.dimensionsV.push(dim);

              //-------- scale svg
              if (template.objects[i].id === 'overallDimV') {
                if(scope.typeConstruction !== 'icon' && scope.typeConstruction !== 'bigIcon') {
                  canvasHeight = template.objects[i].lengthVal + edgeTop;
                  overallDimV = canvasHeight / coefScaleH;
                  //canvasHeight += edgeTop;
                }
              }

              break;
              */
          }
        }




        //------- Create dimentions

        for (var d = 0; d < template.dimentions.length; d++) {
          var dim = {};
          switch (template.dimentions[d].type) {
            case 'hor':
              var dimLineY = template.dimentions[d].level * dimLineHeight,
                  newEdgeTop = dimLineY * 2;
              dim.lines = [];

              dim.lines[0] = template.dimentions[d].from + ' ' + dimMarginBottom + ' ' + template.dimentions[d].from + ' ' + -(dimLineY + dimEdger);
              dim.lines[1] = template.dimentions[d].from + ' ' + (-dimLineY) + ' ' + template.dimentions[d].to + ' ' + (-dimLineY);
              dim.lines[2] = template.dimentions[d].to + ' ' + dimMarginBottom + ' ' + template.dimentions[d].to + ' ' + -(dimLineY + dimEdger);

              dim.lengthVal = template.dimentions[d].to - template.dimentions[d].from;
              dim.textX = +template.dimentions[d].from + (dim.lengthVal / 2);
              dim.textY = -(dimLineY + sizeBoxMarginBottom);
              dim.type = template.dimentions[d].type;
              dim.start = template.dimentions[d].from;
              dim.end = template.dimentions[d].to;
              dim.min = template.dimentions[d].minDim;
              dim.max = template.dimentions[d].maxDim;
              if(template.dimentions[d].id) {
                dim.id = template.dimentions[d].id;
              }
              elementsSVG.dimensionsH.push(dim);

              if (newEdgeTop > edgeTop) {
                edgeTop = newEdgeTop;
              }
              if(overallDimH < dim.end) {
                overallDimH = dim.end;
              }
              break;
            case 'vert':
              var dimLineX = template.dimentions[d].level * dimLineHeight, newEdgeLeft = dimLineX * 2;
              dim.lines = [];

              dim.lines[0] = dimMarginBottom + ' ' + template.dimentions[d].from + ' ' + -(dimLineX + dimEdger) + ' ' + template.dimentions[d].from;
              dim.lines[1] = (-dimLineX) + ' ' + template.dimentions[d].from + ' ' + (-dimLineX) + ' ' + template.dimentions[d].to;
              dim.lines[2] = dimMarginBottom + ' ' + template.dimentions[d].to + ' ' + -(dimLineX + dimEdger) + ' ' + template.dimentions[d].to;

              dim.lengthVal = template.dimentions[d].to - template.dimentions[d].from;
              dim.textX = -(dimLineX + sizeBoxMarginBottom);
              dim.textY = +template.dimentions[d].from + (dim.lengthVal / 2);
              dim.type = template.dimentions[d].type;
              dim.start = template.dimentions[d].from;
              dim.end = template.dimentions[d].to;
              dim.min = template.dimentions[d].minDim;
              dim.max = template.dimentions[d].maxDim;
              if(template.dimentions[d].id) {
                dim.id = template.dimentions[d].id;
              }
              elementsSVG.dimensionsV.push(dim);

              if (newEdgeLeft > edgeLeft) {
                edgeLeft = newEdgeLeft;
              }
              if(overallDimV < dim.end) {
                overallDimV = dim.end;
              }
              break;
          }

        }

        //------- Drawing elements SVG of construction

        draw = SVG(svg).size(canvasWidth, canvasHeight);
        var mainGroup = draw.group().attr('class', 'svg-pan-zoom_viewport');
        for(var prop in elementsSVG) {
          if (!elementsSVG.hasOwnProperty(prop)) {
            continue;
          }
          var group = mainGroup.group();
          for (var elem = 0; elem < elementsSVG[prop].length; elem++) {
            switch (prop) {
              case 'frames':
                if(scope.typeConstruction === 'icon') {
                  if(elem === 2 && scope.$parent.global.product.doorShapeId === 2 || elem === 2 && scope.$parent.global.product.doorShapeId === 3) {
                    group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'frame-icon doorstep');
                  } else {
                    group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'frame-icon');
                  }
                } else {
                  if(elem === 2 && scope.$parent.global.product.doorShapeId === 2 || elem === 2 && scope.$parent.global.product.doorShapeId === 3) {
                    group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'frame doorstep');
                  } else {
                    group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'frame');
                  }
                }
                break;
              case 'imposts':
                if(scope.typeConstruction === 'icon') {
                  group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'impost-icon');
                } else {
                  group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'impost');
                }
                break;
              case 'sashes':
                if(scope.typeConstruction === 'icon') {
                  group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'sash-icon');
                } else {
                  group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'sash');
                }
                break;
              case 'beads':
                if(scope.typeConstruction === 'icon') {
                  group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'bead-icon');
                } else {
                  group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'bead');
                }
                break;
              case 'glasses':
                group.path('M' + elementsSVG[prop][elem].path + 'z').attr('class', 'glass').attr('element-id', elementsSVG[prop][elem].id);
                break;
              case 'openDirections':
                group.path('M' + elementsSVG[prop][elem] + 'z').attr('class', 'open-direction');
                break;


              case 'dimensionsH':
              case 'dimensionsV':
/*
                if(scope.typeConstruction === 'icon') {
                  if (prop === 'dimensionsV') {
                    if (elementsSVG[prop][elem].id === 'overallDimV') {
                      overallDimV = elementsSVG[prop][elem].lengthVal;
                    }
                  } else {
                    if (elementsSVG[prop][elem].id === 'overallDimH') {
                      overallDimH = elementsSVG[prop][elem].lengthVal;
                    }
                  }
                  edgeTop = edgeLeft = 0;
                } else {
                  */
                if(scope.typeConstruction !== 'icon') {
                  //---- draw dimension lines
                  for(var l = 0; l < elementsSVG[prop][elem].lines.length; l++) {
                    if(l === 1) {
                      var line = group.path('M' + elementsSVG[prop][elem].lines[l] + 'z').attr('class', 'size-line');
                      line.marker('start', 30, 30, function(add) {
                        add.path('M 0,0 L -4,-2 0,-4 z').attr('class', 'size-line');
                        add.ref(-5, -2);
                        add.viewbox(-5, -5, 4, 5);
                      });
                      line.marker('mid', 30, 30, function(add) {
                        add.path('M 0,0 L 4,2 0,4 z').attr('class', 'size-line');
                        add.ref(5, 2);
                        add.viewbox(1, -1, 4, 5);
                        if(prop === 'dimensionsV') {
                          add.attr('orient', 90);
                        } else {
                          add.attr('orient', 0);
                        }
                      });

                    } else {
                      group.path('M' + elementsSVG[prop][elem].lines[l] + 'z').attr('class', 'size-line');
                    }
                  }

                  //----- draw dimension size box if construction is editible
                  var groupTxt = group.group().attr('class', sizeClass);

                  if(scope.typeConstruction === 'edit') {
                    var sizeRect = groupTxt.rect(sizeBoxWidth, sizeBoxHeight);
                    sizeRect.attr('class', 'size-rect');

                    var sizeText = groupTxt.text(' ' + elementsSVG[prop][elem].lengthVal + ' ').dx(elementsSVG[prop][elem].textX).dy(elementsSVG[prop][elem].textY);
                    sizeText.attr({
                      'from-point': elementsSVG[prop][elem].start,
                      'to-point': elementsSVG[prop][elem].end,
                      'size-type': elementsSVG[prop][elem].type,
                      'min-val': elementsSVG[prop][elem].min,
                      'max-val': elementsSVG[prop][elem].max
                    });
                    if(elementsSVG[prop][elem].id) {
                      sizeText.attr('id', elementsSVG[prop][elem].id);
                    }

                    if(prop === 'dimensionsH') {
                      sizeRect.cx(elementsSVG[prop][elem].textX).cy(elementsSVG[prop][elem].textY + 5);
                      //sizeText.attr('class', 'size-value-edit');
                    } else if(prop === 'dimensionsV') {
                      sizeRect.cx(elementsSVG[prop][elem].textX).cy(elementsSVG[prop][elem].textY + 5);
                      //sizeRect.cx(elementsSVG[prop][elem].textX - 50).cy(elementsSVG[prop][elem].textY + 5);
                      //sizeText.attr('class', 'size-value-edit-vertical');
                    }
                    sizeText.attr('class', 'size-value-edit');
                    sizeRect.radius(sizeBoxRadius);


                  } else {
                    //----- draw dimension size text
                    var sizeText = groupTxt.text(' ' + elementsSVG[prop][elem].lengthVal + ' ').dx(elementsSVG[prop][elem].textX).dy(elementsSVG[prop][elem].textY);
                    sizeText.attr({
                      'from-point': elementsSVG[prop][elem].start,
                      'to-point': elementsSVG[prop][elem].end,
                      'size-type': elementsSVG[prop][elem].type,
                      'min-val': elementsSVG[prop][elem].min,
                      'max-val': elementsSVG[prop][elem].max
                    });
                    if(elementsSVG[prop][elem].id) {
                      sizeText.attr('id', elementsSVG[prop][elem].id);
                    }
                    /*
                    if(prop === 'dimensionsV') {
                      sizeText.attr('class', 'size-value-vertical');
                    } else {
                      sizeText.attr('class', 'size-value');
                    }
                    */
                    sizeText.attr('class', 'size-value');
                  }


                  /*
                   if(prop === 'dimensionsV') {
                   sizeText.attr({id: elementsSVG[prop][elem].id});
                   } else {
                   sizeText.attr({id: elementsSVG[prop][elem].id});
                   }

                  //sizeText.attr({id: elementsSVG[prop][elem].id});
                  //sizeText.attr({limits: elementsSVG[prop][elem].limits});
                  //sizeText.attr({type: elementsSVG[prop][elem].sizeType});

                  if(scope.typeConstruction === 'edit') { //----- if construction is editible
                    if(prop === 'dimensionsV') {
                      sizeText.attr('class', 'size-value-edit-vertical');
                    } else {
                      sizeText.attr('class', 'size-value-edit');
                    }
                  } else {
                    if(prop === 'dimensionsV') {
                      sizeText.attr('class', 'size-value-vertical');
                    } else {
                      sizeText.attr('class', 'size-value');
                    }
                  }

                  // Click on size

                  groupTxt.click(function() {
                    if(scope.typeConstruction === 'edit' && !scope.$parent.global.isConstructSizeCalculator) {
                      console.log('svg click on size =', this);
                      deactiveSizeBox(sizeEditClass, sizeClass);
                      this.toggleClass(sizeClass);
                      this.toggleClass(sizeEditClass);
                    }
                  });
                   */
                }

/*
                if(scope.typeConstruction === 'bigIcon') {
                  if (prop === 'dimensionsV') {
                    if (elementsSVG[prop][elem].id === 'overallDimV') {
                      overallDimV = elementsSVG[prop][elem].lengthVal + edgeTop;
                    }
                  } else {
                    if (elementsSVG[prop][elem].id === 'overallDimH') {
                      overallDimH = elementsSVG[prop][elem].lengthVal + edgeLeft;
                    }
                  }
                }
*/

                break;
            }
          }
        }
/*
        var divW = $('.construction-scrollbox').width();
          //var mid = ((canvasWidth - edgeLeft*2)/2 - divW/2);
        var mid = ((canvasWidth)/2 - divW/2) * coefScrollW;
        //console.log('edgeLeft = ' + edgeLeft);
        //console.log('overallDimH = ' + overallDimH);
        //console.log('divW = ' + divW);
        //console.log('canvasWidth =' + canvasWidth);
        //console.log('mid = ' + mid);
          $('.construction-scrollbox').scrollLeft( mid );

          //console.log($('.construction-scrollbox').scrollLeft());
*/
        if(scope.typeConstruction === 'icon') {
          draw.viewbox(0, 0, overallDimH, (overallDimV + 20));
        } else  if(scope.typeConstruction === 'bigIcon'){
          draw.viewbox(-edgeLeft, -edgeTop, (overallDimH + edgeLeft), (overallDimV + edgeTop + 20));
        } else if(scope.typeConstruction === 'edit') {
          draw.attr({width: '100%', height: '100%'});
          draw.viewbox(-edgeLeft, -edgeTop, (overallDimH + edgeLeft), (overallDimV + edgeTop));
          draw.attr('id', 'svg-construction');
        }
        return svg;
      }



      //--------- PAN AND PINCH SVG

      var eventsHandler = {
        haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
        init: function(options) {
          var instance = options.instance,
              initialScale = 1,
              pannedX = 0,
              pannedY = 0;

          // Init Hammer
          // Listen only for pointer and touch events
          this.hammer = Hammer(options.svgElement, {
            inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
          });

          // Enable pinch
          this.hammer.get('pinch').set({enable: true});

          // Handle double tap
          this.hammer.on('doubletap', function(ev){
            console.log('ev.type = ', ev.type);
            instance.zoomIn();
          });

          // Handle pan
          this.hammer.on('pan panstart panend', function(ev){
            // On pan start reset panned variables
            console.log('ev.type = ', ev.type);
            if (ev.type === 'panstart') {
              pannedX = 0;
              pannedY = 0;
            }

            // Pan only the difference
            if (ev.type === 'pan' || ev.type === 'panend') {
              //console.log('p');
              instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY});
              pannedX = ev.deltaX;
              pannedY = ev.deltaY;
            }
          });

          // Handle pinch
          this.hammer.on('pinch pinchstart pinchend', function(ev){
            console.log('ev.type = ', ev.type);
            // On pinch start remember initial zoom
            if (ev.type === 'pinchstart') {
              initialScale = instance.getZoom();
              instance.zoom(initialScale * ev.scale);
            }

            // On pinch zoom
            if (ev.type === 'pinch' || ev.type === 'pinchend') {
              instance.zoom(initialScale * ev.scale);
            }
          });

          // Prevent moving the page on some devices when panning over SVG
          options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });
        },//--- init

        destroy: function(){
          this.hammer.destroy();
        }
      };

      var beforePan = function(oldPan, newPan){
        var stopHorizontal = false,
            stopVertical = false,
            gutterWidth = 200,
            gutterHeight = 200,
            // Computed variables
            sizes = this.getSizes(),
            leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth,
            rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom),
            topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight,
            bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom),
            customPan = {};

        customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x));
        customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y));
        return customPan;
      };


      function startPinch() {
        var svgElement = document.getElementById('svg-construction');
        //console.log('svgElement', svgElement);
        // Expose to window namespace for testing purposes
        window.panZoom = svgPanZoom(svgElement, {
          zoomEnabled: true,
          controlIconsEnabled: false,
          zoomScaleSensitivity: 0.1,
          fit: 1,
          center: 1,
          refreshRate: 'auto',
          beforePan: beforePan,
          customEventsHandler: eventsHandler
        });
      }

    }
  };
}]);


// directives/typing.js

'use strict';

BauVoiceApp.directive('typing', function () {
  return {
    scope: {
      output: '@',
      typingDelay: '@'
    },
    link: function (scope, elem, attrs) {
      attrs.$observe('typing', function (mode) {
        if (mode.toString() === 'on') {
          typingTextWithDelay();
        }
      });
      attrs.$observe('output', function () {
          typingTextWithDelay();
      });

      function typingTextWithDelay() {
        setTimeout(function () {
          var source = scope.output,
              text = '',
              NEXT_CHAR_DELAY = 15,
              timerId,
              hasChar;

          timerId = setInterval(function () {
            hasChar = text.length < source.length;

            if (hasChar) {
              text += source[text.length];
            } else {
              clearInterval(timerId);
            }
            elem.text(text);
          }, NEXT_CHAR_DELAY);
        }, parseInt(scope.typingDelay, 10));
      }
    }
  };
});


// translations/de.js

"use strict";

window.germanDictionary = {
  common_words: {
    CHANGE: 'untreu sein',
    MONTHS: 'Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember',
    MONTHS_SHOT: 'Jan, Feb, Mär, Apr, Mai, Jun, Jul, Aug, Sep, Okt, Nov, Dez',
    MONTHA: 'Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember',
    MONTH_LABEL: 'Monat',
    MONTHA_LABEL: 'des Monats',
    MONTHS_LABEL: 'Monate',
    ALL: 'alles',
    MIN: 'min.',
    MAX: 'maks.',
    //----- confirm dialogs
    BUTTON_Y: 'JA',
    BUTTON_N: 'ES IST',
    DELETE_PRODUCT_TITLE: 'Die Entfernung!',
    DELETE_PRODUCT_TXT: 'Sie wollen das Produkt entfernen?',
    DELETE_ORDER_TITLE: 'Die Entfernung der Bestellung!',
    DELETE_ORDER_TXT: 'Sie wollen die Bestellung entfernen?',
    COPY_ORDER_TITLE: 'Das Kopieren!',
    COPY_ORDER_TXT: 'Sie wollen der Bestellung kopieren?',
    SEND_ORDER_TITLE: 'In die Produktion!',
    SEND_ORDER_TXT: 'Sie wollen die Bestellung auf den Betrieb absenden?',
    NEW_TEMPLATE_TITLE: 'Template changing',
    TEMPLATE_CHANGES_LOST: 'The template changes will lost! Continue?'
  },
  login: {
    ENTER: 'Einloggen',
    PASS_CODE: 'Teilen Sie diesen Kode dem Manager mit.',
    YOUR_CODE: 'Ihr Kode: ',
    EMPTY_FIELD: 'Füllen Sie dieses Feld aus.',
    WRONG_NUMBER: 'Die falsche Nummer, das Format +XX (XXX) XXX-XXXX.',
    SHORT_PASSWORD: 'Die viel zu kleine Parole',
    SOMETHING_WRONG: 'Entstand ein furchtbarer, daraufhin ihr sehen dieser berichtet über Fehler.',
    MOBILE: 'Handy',
    PASSWORD: 'Passwort'
  },
  mainpage: {
    MM: ' mm ',
    CLIMATE_ZONE: 'Die Klimazone',
    THERMAL_RESISTANCE: 'Der Widerstand der Wärmeübertragung',
    AIR_CIRCULATION: 'Der Koeffizient des Luftwechsels',
    ROOM_KITCHEN: 'Küche',
    ROOM_LIVINGROOM: 'Wohnzimmer',
    ROOM_BALCONY: 'Altan',
    ROOM_CHILDROOM: 'Детская',
    ROOM_BEDROOM: 'Schlafzimmer',
    ROOM_DOOR: 'Eingang',
    NAVMENU_GEOLOCATION: 'Die Anordnung zu wählen',
    NAVMENU_CURRENT_GEOLOCATION: 'Die laufende Anordnung',
    NAVMENU_CURRENT_CALCULATION: 'Die laufende Berechnung',
    NAVMENU_CART: 'Der Korb der Berechnung',
    NAVMENU_ADD_ELEMENTS: 'Die zusätzlichen Elemente',
    NAVMENU_ALL_CALCULATIONS: 'Alle Berechnungen',
    NAVMENU_SETTINGS: 'Einstellungen',
    NAVMENU_MORE_INFO: 'Es gibt als mehrere Informationen',
    NAVMENU_VOICE_HELPER: 'Der Stimmhelfer',
    NAVMENU_CALCULATIONS: 'Die Berechnungen',
    NAVMENU_APPENDIX: 'Anwendung',
    NAVMENU_NEW_CALC: '+ die Neue Berechnung',
    CONFIGMENU_CONFIGURATION: 'Die Konfiguration und die Umfänge',
    CONFIGMENU_SIZING: 'Die Breite * die Höhe',
    CONFIGMENU_PROFILE: 'Profil',
    CONFIGMENU_GLASS: 'Bauglasplatte',
    CONFIGMENU_HARDWARE: 'Zubehör',
    CONFIGMENU_LAMINATION: 'Ламинация',
    CONFIGMENU_LAMINATION_TYPE: 'Die Fassade / in den Zimmer',
    CONFIGMENU_ADDITIONAL: 'Zusätzlich',
    CONFIGMENU_IN_CART: 'Zum Warenkorb',
    VOICE_SPEACH: 'Sprechen...',
    COMMENT: 'Оставьте свою заметку о заказе здесь.',
    ROOM_SELECTION: 'Interior selection'
  },
  panels: {
    TEMPLATE_WINDOW: 'Fenster',
    TEMPLATE_BALCONY: 'Altan',
    TEMPLATE_DOOR: 'Tür',
    TEMPLATE_BALCONY_ENTER: 'Der Ausgang auf den Balkon',
    TEMPLATE_EDIT: 'Editieren',
    TEMPLATE_DEFAULT: 'Das Projekt als Voreinstellung',
    COUNTRY: 'Land',
    BRAND: 'Das Warenzeichen',
    HEAT_INSULATION: 'warm Isolation',
    NOICE_INSULATION: 'шумоизоляция',
    LAMINAT_INSIDE: 'Laminieren des Rahmens im Raum',
    LAMINAT_OUTSIDE: 'Laminierung von Seiten der Straßenfront',
    LAMINAT_WHITE: 'ohne Laminierung, eine radikale weiß'
  },
  add_elements: {
    CHOOSE: 'Wählen',
    ADD: 'drauflegen',

    GRID: 'Moskitonetz',
    VISOR: 'Deflektor',
    SPILLWAY: 'Entwässerungsanlage',
    OUTSIDE: 'Außen Pisten',
    LOUVERS: 'Jalousie',
    INSIDE: 'Innen Pisten',
    CONNECTORS: 'Zwischenstepsel',
    FAN: 'Mikroventilation',
    WINDOWSILL: 'Fensterbank',
    HANDLEL: 'Griff',
    OTHERS: 'Übrige',
    GRIDS: 'Moskitonetze',
    VISORS: 'Visiere',
    SPILLWAYS: 'Entwässerungsanlagen',
    WINDOWSILLS: 'Fensterbänke',
    HANDLELS: 'Griff',
    NAME_LABEL: 'Benennung',
    QTY_LABEL: 'pcs',
    SIZE_LABEL: 'Dimension',
    WIDTH_LABEL: 'Breite',
    HEIGHT_LABEL: 'Höhe',
    COLOR_LABEL: 'Farbe',
    OTHER_ELEMENTS1: 'Noch',
    OTHER_ELEMENTS2: 'Komponente ...',
    SCHEME_VIEW: 'Schematisch',
    LIST_VIEW: 'Liste',
    INPUT_ADD_ELEMENT: 'Komponente hinzufügen',
    CANCEL: 'Stornierung',
    TOTAL_PRICE_TXT: 'Gesamte zusätzliche Komponenten in der Menge von:',
    ELEMENTS: 'Komponenten',
    ELEMENT: 'Komponente',
    ELEMENTA: 'Komponente'
  },
  add_elements_menu: {
    TIP: 'Wählen Sie ein Element aus der Liste',
    EMPTY_ELEMENT: 'Ohne das Element',
    COLOR_AVAILABLE: 'Verfügbare Farben:',
    TAB_NAME_SIMPLE_FRAME: 'Einfacher Aufbau',
    TAB_NAME_HARD_FRAME: 'Verbundstruktur',
    TAB_EMPTY_EXPLAIN: 'Wählen Sie den Anfangspunkt zu starten Bau.'
  },
  construction: {
    SASH_SHAPE: 'Flügel',
    ANGEL_SHAPE: 'Winkel',
    IMPOST_SHAPE: 'Abgaben',
    ARCH_SHAPE: 'Gewölbe',
    POSITION_SHAPE: 'Position',
    UNITS_DESCRIP: 'Da die Einheiten in mm',
    PROJECT_DEFAULT: 'Standardprojekt',
    DOOR_CONFIG_LABEL: 'Anordnung der Türen',
    DOOR_CONFIG_DESCTIPT: 'Türrahmen',
    SASH_CONFIG_DESCTIPT: 'Torblatt',
    HANDLE_CONFIG_DESCTIPT: 'Griff',
    LOCK_CONFIG_DESCTIPT: 'Verschluss',
    STEP: 'Schritt',
    LABEL_DOOR_TYPE: 'Wählen Sie ein Design Türrahmen',
    LABEL_SASH_TYPE: 'Wählen Sie die Art des Türblattes',
    LABEL_HANDLE_TYPE: 'Wählen Sie die Art der Griff',
    LABEL_LOCK_TYPE: 'Wählen Sie die Art der Sperre',
    VOICE_SWITCH_ON: "Voice-Modus aktiviert ist",
    VOICE_NOT_UNDERSTAND: 'es ist nicht klar',
    VOICE_SMALLEST_SIZE: 'zu klein',
    VOICE_BIGGEST_SIZE: "zu groß",
    VOICE_SMALL_GLASS_BLOCK: "слишком маленький световой проем"
  },
  history: {
    SEARCH_PLACEHOLDER: 'Suche nach Stichwort',
    DRAFT_VIEW: 'Entwürfe Berechnungen',
    HISTORY_VIEW: 'Siedlungsgeschichte',
    PHONE: 'Telefon',
    CLIENT: 'клиент',
    ADDRESS: 'Anschrift',
    FROM: 'von ',
    UNTIL: 'vor ',
    PAYMENTS: 'Zahlungen',
    ALLPRODUCTS: 'Produkte',
    ON: 'bis',
    DRAFT: 'Entwurf',
    DATE_RANGE: 'Datumsbereich',
    ALL_TIME: 'Die ganze Zeit',
    SORTING: 'Sortierung',
    NEWEST_FIRST: 'Mit der Zeit: neue zuerst',
    NEWEST_LAST: 'Zu der Zeit, neue am Ende',
    SORT_BY_TYPE: 'Nach Art',
    SORT_SHOW: 'Show',
    SORT_SHOW_ACTIVE: 'Nur aktiv',
    SORT_SHOW_WAIT: 'Nur angemeldete',
    SORT_SHOW_DONE: 'Только завершенные',
    BY_YOUR_REQUEST: 'Je nach Wunsch',
    NOT_FIND: 'nichts gefunden',
    WAIT_MASTER: 'erwartet Gager'
  },
  cart: {
    ALL_ADD_ELEMENTS: 'Alle Anbauteile bestellen',
    ADD_ORDER: 'Fügen Sie das Produkt',
    PRODUCT_QTY: 'Anzahl der Produkte',
    LIGHT_VIEW: 'Kurzansicht',
    FULL_VIEW: 'Vollansicht',
    DELIVERY: 'Lieferung',
    SELF_EXPORT: 'Abholen',
    FLOOR: 'Etage',
    ASSEMBLING: 'Montage',
    WITHOUT_ASSEMBLING: 'ohne Montage',
    FREE: 'kostenlos',
    PAYMENT_BY_INSTALMENTS: 'Ratenzahlung',
    WITHOUT_INSTALMENTS: 'losen Raten',
    DELIVERY_DATE: 'Liefertermin',
    TOTAL_PRICE_LABEL: 'Insgesamt Lieferung auf',
    MONTHLY_PAYMENT_LABEL: 'monatlichen Zahlungen auf',
    DATE_DELIVERY_LABEL: 'Geliefert auf',
    FIRST_PAYMENT_LABEL: 'Die erste Zahlung',
    ORDER: 'Bestellen',
    MEASURE: 'Maßnahme',
    READY: 'Bereit',
    CALL_MASTER: 'Rufen Gager zu berechnen',
    CALL_MASTER_DESCRIP: 'Um Gager nennen wir brauchen etwas für Sie zu wissen. Beide Felder sind Pflichtfelder.',
    CLIENT_LOCATION: 'Lage',
    CLIENT_ADDRESS: 'Anschrift',
    CALL_ORDER: 'Bestellung zur Berechnung',
    CALL_ORDER_DESCRIP: 'Um den Auftrag zu erfüllen, müssen wir etwas über Sie wissen.',
    CALL_ORDER_CLIENT_INFO: 'Kundeninformation (muss ausgefüllt werden):',
    CLIENT_NAME: 'Vollständiger Name',
    CALL_ORDER_DELIVERY: 'Liefern Sie eine Bestellung für',
    CALL_ORDER_TOTAL_PRICE: 'insgesamt',
    CALL_ORDER_ADD_INFO: 'Extras (optional):',
    CLIENT_EMAIL: 'E-Mail',
    ADD_PHONE: 'Zusätzliche Telefon',
    CALL_CREDIT: 'Machen Tranche und um zu berechnen',
    CALL_CREDIT_DESCRIP: 'Um Raten anordnen und erfüllen den Auftrag, wir haben etwas für Sie zu wissen.',
    CALL_CREDIT_CLIENT_INFO: 'Ratenzahlung:',
    CREDIT_TARGET: 'Der Zweck der Registrierung von Raten',
    CLIENT_ITN: 'Individuelle Steuernummers',
    CALL_START_TIME: 'Rufen Sie aus:',
    CALL_END_TIME: 'vor:',
    CALL_CREDIT_PARTIAL_PRICE: 'auf',
    ADDELEMENTS_EDIT_LIST: 'Liste bearbeiten',
    ADDELEMENTS_PRODUCT_COST: 'einem Produkt',
    HEAT_TRANSFER: 'Wärmeübertragung',
    WRONG_EMAIL: 'Falsche E-Mail',
    LINK_BETWEEN_COUPLE: 'между парой',
    LINK_BETWEEN_ALL: 'между всеми',
    LINK_DELETE_ALL_GROUPE: 'удалить все',
    CLIENT_SEX: 'Sex',
    CLIENT_SEX_M: 'M',
    CLIENT_SEX_F: 'F',
    CLIENT_AGE: 'Age',
    CLIENT_AGE_OLDER: 'older',
    CLIENT_EDUCATION: 'Education',
    CLIENT_EDUC_MIDLE: 'middle',
    CLIENT_EDUC_SPEC: 'specific middle',
    CLIENT_EDUC_HIGH: 'high',
    CLIENT_OCCUPATION: 'Occupation',
    CLIENT_OCCUP_WORKER: 'Employee',
    CLIENT_OCCUP_HOUSE: 'Householder',
    CLIENT_OCCUP_BOSS: 'Employer',
    CLIENT_OCCUP_STUD: 'Student',
    CLIENT_OCCUP_PENSION: 'pensioner',
    CLIENT_INFO_SOURCE: 'Information source',
    CLIENT_INFO_PRESS: 'Press',
    CLIENT_INFO_FRIEND: 'From friends',
    CLIENT_INFO_ADV: 'Visual advertising'
  },
  settings: {
    AUTHORIZATION: 'Autorisierung:',
    CHANGE_PASSWORD: 'Kennwort ändern',
    CHANGE_LANGUAGE: 'Change language',
    PRIVATE_INFO: 'Persönliche Informationen:',
    USER_NAME: 'Gesprächspartner',
    CITY: 'Stadt',
    ADD_PHONES: 'Zusätzliche Telefone:',
    INSERT_PHONE: 'Hinzufügen einer Telefon',
    CLIENT_SUPPORT: 'Poderzhka Benutzer',
    LOGOUT: 'Beenden Sie die Anwendung',
    SAVE: 'Speichern',
    CURRENT_PASSWORD: 'Die Jetzige',
    NEW_PASSWORD: 'Neu',
    CONFIRM_PASSWORD: 'Bestätigen',
    NO_CONFIRM_PASS: 'Ungültiges Passwort'
  }//,

  //'SWITCH_LANG': 'German'
};


// translations/en.js

"use strict";

window.englishDictionary = {
  common_words: {
    CHANGE: 'Change',
    MONTHS: 'January, February, March, April, May, June, July, August, September, October, November, December',
    MONTHS_SHOT: 'Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sept, Oct, Nov, Dec',
    MONTHA: 'January, February, March, April, May, June, July, August, September, October, November, December',
    MONTH_LABEL: 'month',
    MONTHA_LABEL: 'of the month',
    MONTHS_LABEL: 'months',
    ALL: 'All',
    MIN: 'min.',
    MAX: 'max.',
    //----- confirm dialogs
    BUTTON_Y: 'YES',
    BUTTON_N: 'IT IS NOT',
    DELETE_PRODUCT_TITLE: 'Delete!',
    DELETE_PRODUCT_TXT: 'Do you want to delete a product?',
    DELETE_ORDER_TITLE: 'Delete of order!',
    DELETE_ORDER_TXT: 'Do you want to delete an order?',
    COPY_ORDER_TITLE: 'Printing-down!',
    COPY_ORDER_TXT: 'Do you want to do the copy of order?',
    SEND_ORDER_TITLE: 'In a production!',
    SEND_ORDER_TXT: 'Do you want to send an order on a factory?',
    NEW_TEMPLATE_TITLE: 'Template changing',
    TEMPLATE_CHANGES_LOST: 'The template changes will lost! Continue?'
  },
  login: {
    ENTER: 'To enter',
    PASS_CODE: 'You will reveal to this code the manager.',
    YOUR_CODE: 'Your code: ',
    EMPTY_FIELD: 'ЗYou will fill this field.',
    WRONG_NUMBER: 'Incorrect number, format +XX(XXX)XXX-XXXX.',
    SHORT_PASSWORD: 'Too little password.',
    SOMETHING_WRONG: 'Something frightful happened, therefore you see this error message.',
    MOBILE: 'Mobile telephone',
    PASSWORD: 'Password'
  },
  mainpage: {
    MM: ' mm ',
    CLIMATE_ZONE: 'climatic area',
    THERMAL_RESISTANCE: 'resistance a heat transfer',
    AIR_CIRCULATION: 'coefficient of ventilation',
    ROOM_KITCHEN: 'Kitchen',
    ROOM_LIVINGROOM: 'Living room',
    ROOM_BALCONY: 'Балкон',
    ROOM_CHILDROOM: 'Детская',
    ROOM_BEDROOM: 'Bedroom',
    ROOM_DOOR: 'Entrance',
    NAVMENU_GEOLOCATION: 'To choose a location',
    NAVMENU_CURRENT_GEOLOCATION: 'Current location',
    NAVMENU_CURRENT_CALCULATION: 'Current calculation',
    NAVMENU_CART: 'Basket of calculation',
    NAVMENU_ADD_ELEMENTS: 'Add. elements',
    NAVMENU_ALL_CALCULATIONS: 'All calculations',
    NAVMENU_SETTINGS: 'Tuning',
    NAVMENU_MORE_INFO: 'More information',
    NAVMENU_VOICE_HELPER: 'Vocal helper',
    NAVMENU_CALCULATIONS: 'Calculations',
    NAVMENU_APPENDIX: 'Appendix',
    NAVMENU_NEW_CALC: '+ New calculation',
    CONFIGMENU_CONFIGURATION: 'Configuration and sizes',
    CONFIGMENU_SIZING: 'width * height',
    CONFIGMENU_PROFILE: 'Profile',
    CONFIGMENU_GLASS: 'Glazing',
    CONFIGMENU_HARDWARE: 'accessories',
    CONFIGMENU_LAMINATION: 'Lamination',
    CONFIGMENU_LAMINATION_TYPE: 'Facade / room',
    CONFIGMENU_ADDITIONAL: 'Additionally',
    CONFIGMENU_IN_CART: 'In a basket',
    VOICE_SPEACH: 'You talk...',
    COMMENT: 'Оставьте свою заметку о заказе здесь.',
    ROOM_SELECTION: 'Interior selection'
  },
  panels: {
    TEMPLATE_WINDOW: 'Window',
    TEMPLATE_BALCONY: 'balcony',
    TEMPLATE_DOOR: 'door',
    TEMPLATE_BALCONY_ENTER: 'Exit to a balcony',
    TEMPLATE_EDIT: 'edit',
    TEMPLATE_DEFAULT: 'Project by default',
    COUNTRY: 'country',
    BRAND: 'trademark',
    HEAT_INSULATION: 'thermal insulation',
    NOICE_INSULATION: 'noise isolation',
    LAMINAT_INSIDE: 'Lamination of a frame in the room',
    LAMINAT_OUTSIDE: 'Lamination from a facade',
    LAMINAT_WHITE: 'without lamination, radical white color'
  },
  add_elements: {
    CHOOSE: 'select ',
    ADD: 'add',

    GRID: 'mosquito grid',
    VISOR: 'peak',
    SPILLWAY: 'water outflow',
    OUTSIDE: 'external slopes',
    LOUVERS: 'blinds',
    INSIDE: 'internal slopes',
    CONNECTORS: 'connector',
    FAN: 'microairing',
    WINDOWSILL: 'windowsill',
    HANDLEL: 'handle',
    OTHERS: 'other',
    GRIDS: 'mosquito grids',
    VISORS: 'peaks',
    SPILLWAYS: 'Drainages',
    WINDOWSILLS: 'sills',
    HANDLELS: 'handle',
    NAME_LABEL: 'name',
    QTY_LABEL: 'pcs.',
    SIZE_LABEL: 'size',
    WIDTH_LABEL: 'width',
    HEIGHT_LABEL: 'height',
    COLOR_LABEL: 'color',
    OTHER_ELEMENTS1: 'Yet',
    OTHER_ELEMENTS2: 'component...',
    SCHEME_VIEW: 'Schematically',
    LIST_VIEW: 'List',
    INPUT_ADD_ELEMENT: 'Add Component',
    CANCEL: 'cancel',
    TOTAL_PRICE_TXT: 'Total additional components in the amount of:',
    ELEMENTS: 'components',
    ELEMENT: 'component',
    ELEMENTA: 'component'
  },
  add_elements_menu: {
    TIP: 'Select an item from the list',
    EMPTY_ELEMENT: 'Without the element',
    COLOR_AVAILABLE: 'Available colors:',
    TAB_NAME_SIMPLE_FRAME: 'Simple design',
    TAB_NAME_HARD_FRAME: 'Composite structure',
    TAB_EMPTY_EXPLAIN: 'Please select the first item to start up construction.'
  },
  construction: {
    SASH_SHAPE: 'shutters',
    ANGEL_SHAPE: 'corners',
    IMPOST_SHAPE: 'imposts',
    ARCH_SHAPE: 'arches',
    POSITION_SHAPE: 'position',
    UNITS_DESCRIP: 'As the Units are in mm',
    PROJECT_DEFAULT: 'Default project',
    DOOR_CONFIG_LABEL: 'configuration of doors',
    DOOR_CONFIG_DESCTIPT: 'door frame',
    SASH_CONFIG_DESCTIPT: 'door leaf',
    HANDLE_CONFIG_DESCTIPT: 'handle',
    LOCK_CONFIG_DESCTIPT: 'lock',
    STEP: 'step',
    LABEL_DOOR_TYPE: 'Select a design door frame',
    LABEL_SASH_TYPE: 'Select the type of door leaf',
    LABEL_HANDLE_TYPE: 'Select the type of handle',
    LABEL_LOCK_TYPE: 'Select the type of lock',
    VOICE_SWITCH_ON: "The voice helper is switched on",
    VOICE_NOT_UNDERSTAND: 'It is not clear',
    VOICE_SMALLEST_SIZE: 'The smallest size',
    VOICE_BIGGEST_SIZE: "The biggest size",
    VOICE_SMALL_GLASS_BLOCK: "слишком маленький световой проем"
  },
  history: {
    SEARCH_PLACEHOLDER: 'Search by keyword',
    DRAFT_VIEW: 'Drafts calculations',
    HISTORY_VIEW: 'History of settlements',
    PHONE: 'phone',
    CLIENT: 'клиент',
    ADDRESS: 'address',
    FROM: 'from ',
    UNTIL: 'to ',
    PAYMENTS: 'payments',
    ALLPRODUCTS: 'products',
    ON: 'on',
    DRAFT: 'Draft',
    DATE_RANGE: 'Date Range',
    ALL_TIME: 'For all time',
    SORTING: 'Sorting',
    NEWEST_FIRST: 'By the time: new first',
    NEWEST_LAST: 'By the time new at the end of',
    SORT_BY_TYPE: 'By type',
    SORT_SHOW: 'Show',
    SORT_SHOW_ACTIVE: 'Only active',
    SORT_SHOW_WAIT: 'Only pending',
    SORT_SHOW_DONE: 'Только завершенные',
    BY_YOUR_REQUEST: 'According to your request',
    NOT_FIND: 'nothing found',
    WAIT_MASTER: 'expects gager'
  },
  cart: {
    ALL_ADD_ELEMENTS: 'All additional elements order',
    ADD_ORDER: 'Add the product',
    PRODUCT_QTY: 'number of products',
    LIGHT_VIEW: 'Short view',
    FULL_VIEW: 'Full view',
    DELIVERY: 'Delivery',
    SELF_EXPORT: 'Pickup',
    FLOOR: 'floor',
    ASSEMBLING: 'mounting',
    WITHOUT_ASSEMBLING: 'without mounting',
    FREE: 'free',
    PAYMENT_BY_INSTALMENTS: 'Payment by installments',
    WITHOUT_INSTALMENTS: 'free installments',
    DELIVERY_DATE: 'Delivery date',
    TOTAL_PRICE_LABEL: 'Total Delivered on',
    MONTHLY_PAYMENT_LABEL: 'monthly payments on',
    DATE_DELIVERY_LABEL: 'Delivered on',
    FIRST_PAYMENT_LABEL: 'The first payment',
    ORDER: 'To order',
    MEASURE: 'Measure',
    READY: 'Ready',
    CALL_MASTER: 'Call gager to calculate',
    CALL_MASTER_DESCRIP: 'To call gager we need something for you to know. Both fields are required.',
    CLIENT_LOCATION: 'Location',
    CLIENT_ADDRESS: 'address',
    CALL_ORDER: 'Ordering for calculating',
    CALL_ORDER_DESCRIP: 'In order to fulfill the order, we need to something about you know.',
    CALL_ORDER_CLIENT_INFO: 'Customer Information (must be filled):',
    CLIENT_NAME: 'Full Name',
    CALL_ORDER_DELIVERY: 'Deliver an order for',
    CALL_ORDER_TOTAL_PRICE: 'in all',
    CALL_ORDER_ADD_INFO: 'Extras (Optional):',
    CLIENT_EMAIL: 'Email',
    ADD_PHONE: 'Additional phone',
    CALL_CREDIT: 'Making installment and order to calculate',
    CALL_CREDIT_DESCRIP: 'To arrange installments and fulfill the order, we have something for you to know.',
    CALL_CREDIT_CLIENT_INFO: 'Installment:',
    CREDIT_TARGET: 'The purpose of registration of installments',
    CLIENT_ITN: 'Individual Tax Number',
    CALL_START_TIME: 'Call from:',
    CALL_END_TIME: 'prior to:',
    CALL_CREDIT_PARTIAL_PRICE: 'on',
    ADDELEMENTS_EDIT_LIST: 'Edit List',
    ADDELEMENTS_PRODUCT_COST: 'one product',
    HEAT_TRANSFER: 'heat transfer',
    WRONG_EMAIL: 'Incorrect e-mail',
    LINK_BETWEEN_COUPLE: 'between couple',
    LINK_BETWEEN_ALL: 'between all',
    LINK_DELETE_ALL_GROUPE: 'delete all',
    CLIENT_SEX: 'Sex',
    CLIENT_SEX_M: 'M',
    CLIENT_SEX_F: 'F',
    CLIENT_AGE: 'Age',
    CLIENT_AGE_OLDER: 'older',
    CLIENT_EDUCATION: 'Education',
    CLIENT_EDUC_MIDLE: 'middle',
    CLIENT_EDUC_SPEC: 'specific middle',
    CLIENT_EDUC_HIGH: 'high',
    CLIENT_OCCUPATION: 'Occupation',
    CLIENT_OCCUP_WORKER: 'Employee',
    CLIENT_OCCUP_HOUSE: 'Householder',
    CLIENT_OCCUP_BOSS: 'Employer',
    CLIENT_OCCUP_STUD: 'Student',
    CLIENT_OCCUP_PENSION: 'Pensioner',
    CLIENT_INFO_SOURCE: 'Information source',
    CLIENT_INFO_PRESS: 'Press',
    CLIENT_INFO_FRIEND: 'From friends',
    CLIENT_INFO_ADV: 'Visual advertising'
  },
  settings: {
    AUTHORIZATION: 'Authorization:',
    CHANGE_PASSWORD: 'Change password',
    CHANGE_LANGUAGE: 'Change language',
    PRIVATE_INFO: 'Personal information:',
    USER_NAME: 'Contact person',
    CITY: 'City',
    ADD_PHONES: 'Additional phones:',
    INSERT_PHONE: 'Add a phone',
    CLIENT_SUPPORT: 'Customer Support',
    LOGOUT: 'Exit the application',
    SAVE: 'Save',
    CURRENT_PASSWORD: 'The Current',
    NEW_PASSWORD: 'New',
    CONFIRM_PASSWORD: 'Confirm',
    NO_CONFIRM_PASS: 'Invalid password'
  }
};


// translations/ro.js

"use strict";

window.romanianDictionary = {
  common_words: {
    CHANGE: 'modifică',
    MONTHS: 'Ianuarie, Februarie, Martie, Aprilie, Mai, Iunie, Iulie, August, Septembrie, Octombrie, Novembie, Decembrie',
    MONTHS_SHOT: 'Ian, Feb, Mart, Apr, Mai, Iun, Iul, Aug, Sept, Oct, Nov, Dec',
    MONTHA: 'Ianuarie, Februarie, Martie, Aprilie, Mai, Iunie, Iulie, August, Septembrie, Octombrie, Novembie, Decembrie',
    MONTH_LABEL: 'lună',
    MONTHA_LABEL: 'lunii',
    MONTHS_LABEL: 'luni',
    ALL: 'toate',
    MIN: 'minimum',
    MAX: 'maximum',
    //----- confirm dialogs
    BUTTON_Y: 'Da',
    BUTTON_N: 'Nu',
    DELETE_PRODUCT_TITLE: 'STERGE!',
    DELETE_PRODUCT_TXT: 'Doriți să eliminați produsul?',
    DELETE_ORDER_TITLE: 'Sterge comanda!',
    DELETE_ORDER_TXT: 'Doriți să anulați comanda?',
    COPY_ORDER_TITLE: 'Copierea!',
    COPY_ORDER_TXT: 'Doriți să facă o copie la comandă?',
    SEND_ORDER_TITLE: 'în producție!',
    SEND_ORDER_TXT: 'Doriți să trimiteți comanda la uzină?',
    NEW_TEMPLATE_TITLE: 'Template changing',
    TEMPLATE_CHANGES_LOST: 'The template changes will lost! Continue?'
  },
  login: {
    ENTER: 'autentificare',
    PASS_CODE: 'Spune-i managerului acest cod.',
    YOUR_CODE: 'codul dvs: ',
    EMPTY_FIELD: 'Completați acest câmp.',
    WRONG_NUMBER: 'numar incorrect,format +XX(XXX)XXX-XXXX.',
    SHORT_PASSWORD: 'parola e prea mica.',
    SOMETHING_WRONG: 'E CEVA ÎN NEREGULĂ',
    MOBILE: 'telefon mobil',
    PASSWORD: 'Parola'
  },
  mainpage: {
    MM: ' mm ',
    CLIMATE_ZONE: 'zona climatica ',
    THERMAL_RESISTANCE: 'rezistență termică',
    AIR_CIRCULATION: 'coeficientul circulatiei aerului',
    ROOM_KITCHEN: 'bucătărie',
    ROOM_LIVINGROOM: 'Sufragerie',
    ROOM_BALCONY: 'balcon',
    ROOM_CHILDROOM: 'Детская',
    ROOM_BEDROOM: 'dormitor',
    ROOM_DOOR: 'Intrare',
    NAVMENU_GEOLOCATION: 'Selectați locația',
    NAVMENU_CURRENT_GEOLOCATION: 'Locul de amplasare actual',
    NAVMENU_CURRENT_CALCULATION: 'calcul actual',
    NAVMENU_CART: 'cosul de cumparaturi',
    NAVMENU_ADD_ELEMENTS: 'elemente suplimentare',
    NAVMENU_ALL_CALCULATIONS: 'Toate calculele',
    NAVMENU_SETTINGS: 'Setări',
    NAVMENU_MORE_INFO: 'Mai multe informații',
    NAVMENU_VOICE_HELPER: 'Asistent vocală',
    NAVMENU_CALCULATIONS: 'calcule',
    NAVMENU_APPENDIX: 'Propunere',
    NAVMENU_NEW_CALC: '+ Calcul Nou',
    CONFIGMENU_CONFIGURATION: 'Configurația și dimensiunile',
    CONFIGMENU_SIZING: 'Lățime * Înălțime',
    CONFIGMENU_PROFILE: 'profil',
    CONFIGMENU_GLASS: 'geam termopan',
    CONFIGMENU_HARDWARE: 'furnitura ',
    CONFIGMENU_LAMINATION: 'laminare',
    CONFIGMENU_LAMINATION_TYPE: 'fațadă / camera',
    CONFIGMENU_ADDITIONAL: 'Suplimentar',
    CONFIGMENU_IN_CART: 'Adaugă in coș',
    VOICE_SPEACH: 'Vorbiți...',
    COMMENT: 'Оставьте свою заметку о заказе здесь.',
    ROOM_SELECTION: 'Interior selection'
  },
  panels: {
    TEMPLATE_WINDOW: 'fereastră',
    TEMPLATE_BALCONY: 'balcon',
    TEMPLATE_DOOR: 'ușă',
    TEMPLATE_BALCONY_ENTER: 'Ieșire la balcon',
    TEMPLATE_EDIT: 'Editare',
    TEMPLATE_DEFAULT: 'Proiect Standard',
    COUNTRY: 'țara',
    BRAND: 'marcă comercială',
    HEAT_INSULATION: 'izolație termică',
    NOICE_INSULATION: 'izolare fonica',
    LAMINAT_INSIDE: 'Ламинация рамы в комнате',
    LAMINAT_OUTSIDE: 'Laminare din față',
    LAMINAT_WHITE: 'Fără laminare, de culoare albă radical'
  },
  add_elements: {
    CHOOSE: 'Alege',
    ADD: 'Adauga',

    GRID: 'plasă contra țânțarilor',
    VISOR: 'parasolară',
    SPILLWAY: 'scurgere',
    OUTSIDE: 'наружные откосы',
    LOUVERS: 'jaluzele',
    INSIDE: 'внутренние откосы',
    CONNECTORS: 'conector',
    FAN: 'micro ventilare',
    WINDOWSILL: 'pervaz',
    HANDLEL: 'mâner',
    OTHERS: 'altele',
    GRIDS: 'plase de țânțari',
    VISORS: 'viziere',
    SPILLWAYS: 'scurgeri',
    WINDOWSILLS: 'Pervaze',
    HANDLELS: 'manere',
    NAME_LABEL: 'наименование',
    QTY_LABEL: 'Bucăți',
    SIZE_LABEL: 'dimensiune',
    WIDTH_LABEL: 'lățime',
    HEIGHT_LABEL: 'înălțime',
    COLOR_LABEL: 'culoare',
    OTHER_ELEMENTS1: 'încă',
    OTHER_ELEMENTS2: 'componenta...',
    SCHEME_VIEW: 'schematic',
    LIST_VIEW: 'Lista',
    INPUT_ADD_ELEMENT: 'Adaugă Componenta',
    CANCEL: 'anulare',
    TOTAL_PRICE_TXT: 'Total componente suplimentare în valoare de',
    ELEMENTS: 'componente',
    ELEMENT: 'component',
    ELEMENTA: 'componenta'
  },
  add_elements_menu: {
    TIP: 'Selectați un element din listă',
    EMPTY_ELEMENT: 'fără elementul',
    COLOR_AVAILABLE: 'culori disponibile:',
    TAB_NAME_SIMPLE_FRAME: 'construcție simplă',
    TAB_NAME_HARD_FRAME: 'construcție component',
    TAB_EMPTY_EXPLAIN: 'Vă rugăm să selectați primul element,pentru a porni construcția.'
  },
  construction: {
    SASH_SHAPE: 'cercevea',
    ANGEL_SHAPE: 'unghiuri',
    IMPOST_SHAPE: 'impost',
    ARCH_SHAPE: 'arcuri',
    POSITION_SHAPE: 'poziția',
    UNITS_DESCRIP: 'Unitățile de măsură sunt în mm',
    PROJECT_DEFAULT: 'Proiect Standard',
    DOOR_CONFIG_LABEL: 'configurația uși',
    DOOR_CONFIG_DESCTIPT: 'cadru de ușă',
    SASH_CONFIG_DESCTIPT: 'створка двери',
    HANDLE_CONFIG_DESCTIPT: 'mâner',
    LOCK_CONFIG_DESCTIPT: 'blocare a ușii',
    STEP: 'pas',
    LABEL_DOOR_TYPE: 'Selectaţi un toc de proiectare a ușii',
    LABEL_SASH_TYPE: 'Selectați tipul de cercevea la ușă',
    LABEL_HANDLE_TYPE: 'Selectați tipul de mâner',
    LABEL_LOCK_TYPE: 'Selectați tipul de blocare',
    VOICE_SWITCH_ON: "Modul Voce este activat",
    VOICE_NOT_UNDERSTAND: 'nu este clar',
    VOICE_SMALLEST_SIZE: 'prea mic',
    VOICE_BIGGEST_SIZE: "prea mare",
    VOICE_SMALL_GLASS_BLOCK: "слишком маленький световой проем"
  },
  history: {
    SEARCH_PLACEHOLDER: 'Căutare după cuvinte cheie',
    DRAFT_VIEW: 'Черновики расчетов',
    HISTORY_VIEW: 'istoria calculelor',
    PHONE: 'telefon',
    CLIENT: 'клиент',
    ADDRESS: 'adresa',
    FROM: 'de la ',
    UNTIL: 'pînă la ',
    PAYMENTS: 'achitare prin',
    ALLPRODUCTS: 'Construcți',
    ON: 'pe',
    DRAFT: 'Черновик',
    DATE_RANGE: 'intervalul de date',
    ALL_TIME: 'Pentru tot timpul',
    SORTING: 'Sortarea',
    NEWEST_FIRST: 'după timp:cele noi primele',
    NEWEST_LAST: 'după timp:cele noi la urmă',
    SORT_BY_TYPE: 'După tipul',
    SORT_SHOW: 'Arată',
    SORT_SHOW_ACTIVE: 'Doar activi',
    SORT_SHOW_WAIT: 'Numai în așteptarea',
    SORT_SHOW_DONE: 'Только завершенные',
    BY_YOUR_REQUEST: 'Potrivit cererea dvs.',
    NOT_FIND: 'nimic nu a fost găsit',
    WAIT_MASTER: 'aşteaptă inginerul'
  },
  cart: {
    ALL_ADD_ELEMENTS: 'toate elemente suplimentare a comenzii',
    ADD_ORDER: 'adaugă produsul',
    PRODUCT_QTY: 'numărul de produse',
    LIGHT_VIEW: 'Vizualizare scurtă',
    FULL_VIEW: 'Vizualizare completă',
    DELIVERY: 'livrare',
    SELF_EXPORT: 'Fara livrare',
    FLOOR: 'etajul',
    ASSEMBLING: 'instalare',
    WITHOUT_ASSEMBLING: 'fără montare',
    FREE: 'gratuit',
    PAYMENT_BY_INSTALMENTS: 'Plata în rate',
    WITHOUT_INSTALMENTS: 'fără rate',
    DELIVERY_DATE: 'data de livrare',
    TOTAL_PRICE_LABEL: 'în total la livrare ',
    MONTHLY_PAYMENT_LABEL: 'plata lunara cîte',
    DATE_DELIVERY_LABEL: 'La livrare',
    FIRST_PAYMENT_LABEL: 'prima achitare',
    ORDER: 'a comanda',
    MEASURE: 'Măsura',
    READY: 'Gata',
    CALL_MASTER: 'chemarea inginerului pentru calcul',
    CALL_MASTER_DESCRIP: 'Pentru a solicita inginerul, avem nevoie de ceva informatie despre dvs. Ambele campurile sunt obligatorii.',
    CLIENT_LOCATION: 'locație',
    CLIENT_ADDRESS: 'adresa',
    CALL_ORDER: 'Оформление заказа для рассчета',
    CALL_ORDER_DESCRIP: 'Pentru a îndeplini comanda,este necesar informatie despre dvs.',
    CALL_ORDER_CLIENT_INFO: 'Informații client (câmpuri obligatorii):',
    CLIENT_NAME: 'numele prenumele patronimicul',
    CALL_ORDER_DELIVERY: 'livrarea comenzi pe',
    CALL_ORDER_TOTAL_PRICE: 'Total',
    CALL_ORDER_ADD_INFO: 'suplimentar (completarea la dorinţă):',
    CLIENT_EMAIL: 'poșta electronică',
    ADD_PHONE: 'telefon suplimentar',
    CALL_CREDIT: 'Efectuarea rate și calculul comenzi',
    CALL_CREDIT_DESCRIP: 'Для того, чтобы оформить рассрочку и выполнить заказ, мы должны кое-что о вас знать.',
    CALL_CREDIT_CLIENT_INFO: 'Plata în rate:',
    CREDIT_TARGET: 'Цель оформления рассрочки',
    CLIENT_ITN: 'Индивидуальный налоговый номер',
    CALL_START_TIME: 'sunați de la:',
    CALL_END_TIME: 'pînă la :',
    CALL_CREDIT_PARTIAL_PRICE: 'pe ',
    ADDELEMENTS_EDIT_LIST: 'redactarea listei',
    ADDELEMENTS_PRODUCT_COST: 'într-o construcţie',
    HEAT_TRANSFER: 'transferul de căldură',
    WRONG_EMAIL: 'poșta electronica este incorectă',
    LINK_BETWEEN_COUPLE: 'между парой',
    LINK_BETWEEN_ALL: 'между всеми',
    LINK_DELETE_ALL_GROUPE: 'удалить все',
    CLIENT_SEX: 'Sex',
    CLIENT_SEX_M: 'M',
    CLIENT_SEX_F: 'F',
    CLIENT_AGE: 'Age',
    CLIENT_AGE_OLDER: 'older',
    CLIENT_EDUCATION: 'Education',
    CLIENT_EDUC_MIDLE: 'middle',
    CLIENT_EDUC_SPEC: 'specific middle',
    CLIENT_EDUC_HIGH: 'high',
    CLIENT_OCCUPATION: 'Occupation',
    CLIENT_OCCUP_WORKER: 'Employee',
    CLIENT_OCCUP_HOUSE: 'Householder',
    CLIENT_OCCUP_BOSS: 'Employer',
    CLIENT_OCCUP_STUD: 'Student',
    CLIENT_OCCUP_PENSION: 'pensioner',
    CLIENT_INFO_SOURCE: 'Information source',
    CLIENT_INFO_PRESS: 'Press',
    CLIENT_INFO_FRIEND: 'From friends',
    CLIENT_INFO_ADV: 'Visual advertising'
  },
  settings: {
    AUTHORIZATION: 'Autentificare:',
    CHANGE_PASSWORD: 'schimbați parola',
    CHANGE_LANGUAGE: 'Change language',
    PRIVATE_INFO: 'Informații personale:',
    USER_NAME: 'persoana de contact',
    CITY: 'oraș',
    ADD_PHONES: 'telefon suplimentar:',
    INSERT_PHONE: 'adaugați  nr de telefon',
    CLIENT_SUPPORT: 'suport clienți',
    LOGOUT: 'Ieșirea din aplicația',
    SAVE: 'Salvați',
    CURRENT_PASSWORD: 'Current',
    NEW_PASSWORD: 'nou',
    CONFIRM_PASSWORD: 'Confirmare',
    NO_CONFIRM_PASS: 'parolă incorectă'
  }
};


// translations/ru.js

"use strict";

window.russianDictionary = {
  common_words: {
    CHANGE: 'Изменить',
    MONTHS: 'Январь, Февраль, Март, Апрель, Май, Июнь, Июль, Август, Сентябрь, Октябрь, Ноябрь, Декабрь',
    MONTHS_SHOT: 'Янв, Февр, Март, Апр, Май, Июнь, Июль, Авг, Сент, Окт, Ноя, Дек',
    MONTHA: 'Января, Февраля, Марта, Апреля, Мая, Июня, Июля, Августа, Сентября, Октября, Ноября, Декабря',
    MONTH_LABEL: 'месяц',
    MONTHA_LABEL: 'месяца',
    MONTHS_LABEL: 'месяцeв',
    ALL: 'Все',
    MIN: 'мин.',
    MAX: 'макс.',
    //----- confirm dialogs
    BUTTON_Y: 'ДА',
    BUTTON_N: 'НЕТ',
    DELETE_PRODUCT_TITLE: 'Удаление!',
    DELETE_PRODUCT_TXT: 'Хотите удалить продукт?',
    DELETE_ORDER_TITLE: 'Удаление заказа!',
    DELETE_ORDER_TXT: 'Хотите удалить заказ?',
    COPY_ORDER_TITLE: 'Копирование!',
    COPY_ORDER_TXT: 'Хотите сделать копию заказа?',
    SEND_ORDER_TITLE: 'В производство!',
    SEND_ORDER_TXT: 'Хотите отправить заказ на завод?',
    NEW_TEMPLATE_TITLE: 'Изменение шаблона',
    TEMPLATE_CHANGES_LOST: 'Изменения в шаблоне будут потеряны! Продолжить?'
  },
  login: {
    ENTER: 'Войти',
    PASS_CODE: 'Сообщите этот код менеджеру.',
    YOUR_CODE: 'Ваш код: ',
    EMPTY_FIELD: 'Заполните это поле.',
    WRONG_NUMBER: 'Неверный номер, формат +XX(XXX)XXX-XXXX.',
    SHORT_PASSWORD: 'Слишком маленький пароль.',
    SOMETHING_WRONG: 'Произошло что-то страшное, поэтому вы видите это сообщение об ошибке.',
    MOBILE: 'Мобильный телефон',
    PASSWORD: 'Пароль'
  },
  mainpage: {
    MM: ' мм ',
    CLIMATE_ZONE: 'климатическая зона',
    THERMAL_RESISTANCE: 'сопротивление теплопередаче',
    AIR_CIRCULATION: 'коэффициент воздухообмена',
    ROOM_KITCHEN: 'Кухня',
    ROOM_LIVINGROOM: 'Гостиная',
    ROOM_BALCONY: 'Балкон',
    ROOM_CHILDROOM: 'Детская',
    ROOM_BEDROOM: 'Спальня',
    ROOM_DOOR: 'Вход',
    NAVMENU_GEOLOCATION: 'Выбрать расположение',
    NAVMENU_CURRENT_GEOLOCATION: 'Текущее расположение',
    NAVMENU_CURRENT_CALCULATION: 'Текущий расчет',
    NAVMENU_CART: 'Корзина расчета',
    NAVMENU_ADD_ELEMENTS: 'Доп. элементы',
    NAVMENU_ALL_CALCULATIONS: 'Все расчеты',
    NAVMENU_SETTINGS: 'Настройки',
    NAVMENU_MORE_INFO: 'Больше информации',
    NAVMENU_VOICE_HELPER: 'Голосовой помощник',
    NAVMENU_CALCULATIONS: 'Расчеты',
    NAVMENU_APPENDIX: 'Приложение',
    NAVMENU_NEW_CALC: '+ Новый расчет',
    CONFIGMENU_CONFIGURATION: 'Конфигурация и размеры',
    CONFIGMENU_SIZING: 'ширина * высота',
    CONFIGMENU_PROFILE: 'Профиль',
    CONFIGMENU_GLASS: 'Стеклопакет',
    CONFIGMENU_HARDWARE: 'Фурнитура',
    CONFIGMENU_LAMINATION: 'Ламинация',
    CONFIGMENU_LAMINATION_TYPE: 'фасад / в комнате',
    CONFIGMENU_ADDITIONAL: 'Дополнительно',
    CONFIGMENU_IN_CART: 'В корзину',
    VOICE_SPEACH: 'Говорите...',
    COMMENT: 'Оставьте свою заметку о заказе здесь.',
    ROOM_SELECTION: 'Выбор интерьера'
  },
  panels: {
    TEMPLATE_WINDOW: 'Oкно',
    TEMPLATE_BALCONY: 'Балкон',
    TEMPLATE_DOOR: 'Дверь',
    TEMPLATE_BALCONY_ENTER: 'Выход на балкон',
    TEMPLATE_EDIT: 'Редактировать',
    TEMPLATE_DEFAULT: 'Проект по умолчанию',
    COUNTRY: 'страна',
    BRAND: 'торговая марка',
    HEAT_INSULATION: 'теплоизоляция',
    NOICE_INSULATION: 'шумоизоляция',
    LAMINAT_INSIDE: 'Ламинация рамы в комнате',
    LAMINAT_OUTSIDE: 'Ламинация со стороны фасада',
    LAMINAT_WHITE: 'без ламинации, радикальный белый цвет'
  },
  add_elements: {
    CHOOSE: 'Выбрать',
    ADD: 'Добавить',

    GRID: 'москитная сетка',
    VISOR: 'козырек',
    SPILLWAY: 'водоотлив',
    OUTSIDE: 'наружные откосы',
    LOUVERS: 'жалюзи',
    INSIDE: 'внутренние откосы',
    CONNECTORS: 'соединитель',
    FAN: 'микропроветривание',
    WINDOWSILL: 'подоконник',
    HANDLEL: 'ручка',
    OTHERS: 'прочее',
    GRIDS: 'москитные сетки',
    VISORS: 'козырьки',
    SPILLWAYS: 'водоотливы',
    WINDOWSILLS: 'подоконники',
    HANDLELS: 'ручки',
    NAME_LABEL: 'наименование',
    QTY_LABEL: 'шт.',
    SIZE_LABEL: 'размер',
    WIDTH_LABEL: 'ширина',
    HEIGHT_LABEL: 'высота',
    COLOR_LABEL: 'цвет',
    OTHER_ELEMENTS1: 'Еще',
    OTHER_ELEMENTS2: 'компонента...',
    SCHEME_VIEW: 'Схематически',
    LIST_VIEW: 'Cписок',
    INPUT_ADD_ELEMENT: 'Добавить компонент',
    CANCEL: 'Отмена',
    TOTAL_PRICE_TXT: 'Итого дополнительных компонентов на сумму:',
    ELEMENTS: 'компонентов',
    ELEMENT: 'компонент',
    ELEMENTA: 'компонента'
  },
  add_elements_menu: {
    TIP: 'Выберите элемент из списка',
    EMPTY_ELEMENT: 'Без элемента',
    COLOR_AVAILABLE: 'Доступные цвета:',
    TAB_NAME_SIMPLE_FRAME: 'Простая конструкция',
    TAB_NAME_HARD_FRAME: 'Составная конструкция',
    TAB_EMPTY_EXPLAIN: 'Выберите из списка первый элемент, чтобы начать составлять конструкцию.'
  },
  construction: {
    SASH_SHAPE: 'створки',
    ANGEL_SHAPE: 'углы',
    IMPOST_SHAPE: 'импосты',
    ARCH_SHAPE: 'арки',
    POSITION_SHAPE: 'позиция',
    UNITS_DESCRIP: 'В качестве единиц измерения используются миллиметры',
    PROJECT_DEFAULT: 'Проект по умолчанию',
    DOOR_CONFIG_LABEL: 'конфигурация двери',
    DOOR_CONFIG_DESCTIPT: 'рама двери',
    SASH_CONFIG_DESCTIPT: 'створка двери',
    HANDLE_CONFIG_DESCTIPT: 'ручка',
    LOCK_CONFIG_DESCTIPT: 'замок',
    STEP: 'шаг',
    LABEL_DOOR_TYPE: 'Выберите конструкцию рамы двери',
    LABEL_SASH_TYPE: 'Выберите тип створки двери',
    LABEL_HANDLE_TYPE: 'Выберите тип ручки',
    LABEL_LOCK_TYPE: 'Выберите тип замка',
    VOICE_SWITCH_ON: "голосовой режим включен",
    VOICE_NOT_UNDERSTAND: 'Не понятно',
    VOICE_SMALLEST_SIZE: 'слишком маленький размер',
    VOICE_BIGGEST_SIZE: "слишком большой размер",
    VOICE_SMALL_GLASS_BLOCK: "слишком маленький световой проем"
  },
  history: {
    SEARCH_PLACEHOLDER: 'Поиск по ключевым словам',
    DRAFT_VIEW: 'Черновики расчетов',
    HISTORY_VIEW: 'История расчетов',
    PHONE: 'телефон',
    CLIENT: 'клиент',
    ADDRESS: 'адрес',
    FROM: 'от ',
    UNTIL: 'до ',
    PAYMENTS: 'платежей по',
    ALLPRODUCTS: 'изделий',
    ON: 'на',
    DRAFT: 'Черновик',
    DATE_RANGE: 'Диапазон дат',
    ALL_TIME: 'За все время',
    SORTING: 'Сортировка',
    NEWEST_FIRST: 'По времени: новые в начале',
    NEWEST_LAST: 'По времени: новые в конце',
    SORT_BY_TYPE: 'По типам',
    SORT_SHOW: 'Показать',
    SORT_SHOW_ACTIVE: 'Только активные',
    SORT_SHOW_WAIT: 'Только в ожидании',
    SORT_SHOW_DONE: 'Только завершенные',
    BY_YOUR_REQUEST: 'По вашему запросу',
    NOT_FIND: 'ничего не найдено',
    WAIT_MASTER: 'ожидает замерщика'
  },
  cart: {
    ALL_ADD_ELEMENTS: 'Все доп.элементы заказа',
    ADD_ORDER: 'Добавить изделие',
    PRODUCT_QTY: 'количество изделий',
    LIGHT_VIEW: 'Сокращенный вид',
    FULL_VIEW: 'Полный вид',
    DELIVERY: 'Доставка',
    SELF_EXPORT: 'самовывоз',
    FLOOR: 'этаж',
    ASSEMBLING: 'Монтаж',
    WITHOUT_ASSEMBLING: 'без монтажа',
    FREE: 'бесплатно',
    PAYMENT_BY_INSTALMENTS: 'Рассрочка',
    WITHOUT_INSTALMENTS: 'без рассрочки',
    DELIVERY_DATE: 'Дата поставки',
    TOTAL_PRICE_LABEL: 'Итого при поставке на',
    MONTHLY_PAYMENT_LABEL: 'ежемесячных платежа по',
    DATE_DELIVERY_LABEL: 'при поставке на',
    FIRST_PAYMENT_LABEL: 'Первый платеж',
    ORDER: 'Заказать',
    MEASURE: 'Замерить',
    READY: 'Готово',
    CALL_MASTER: 'Вызов замерщика для рассчета',
    CALL_MASTER_DESCRIP: 'Для вызова замерщика нам нужно кое-что о вас знать. Оба поля являются обязательными для заполнения.',
    CLIENT_LOCATION: 'Местоположение',
    CLIENT_ADDRESS: 'Адрес',
    CALL_ORDER: 'Оформление заказа для рассчета',
    CALL_ORDER_DESCRIP: 'Для того, чтобы выполнить заказ, мы должны кое-что о вас знать.',
    CALL_ORDER_CLIENT_INFO: 'Информация о клиенте (заполняйте обязательно):',
    CLIENT_NAME: 'Фамилия Имя Отчество',
    CALL_ORDER_DELIVERY: 'Доставить заказ на',
    CALL_ORDER_TOTAL_PRICE: 'Всего',
    CALL_ORDER_ADD_INFO: 'Дополнительно (заполняйте по желанию):',
    CLIENT_EMAIL: 'Электронная почта',
    ADD_PHONE: 'Дополнительный телефон',
    CALL_CREDIT: 'Оформление рассрочки и заказа для рассчета',
    CALL_CREDIT_DESCRIP: 'Для того, чтобы оформить рассрочку и выполнить заказ, мы должны кое-что о вас знать.',
    CALL_CREDIT_CLIENT_INFO: 'Рассрочка:',
    CREDIT_TARGET: 'Цель оформления рассрочки',
    CLIENT_ITN: 'Индивидуальный налоговый номер',
    CALL_START_TIME: 'Звонить от:',
    CALL_END_TIME: 'до:',
    CALL_CREDIT_PARTIAL_PRICE: 'по',
    ADDELEMENTS_EDIT_LIST: 'Редактировать список',
    ADDELEMENTS_PRODUCT_COST: 'в одном изделии',
    HEAT_TRANSFER: 'теплопередача',
    WRONG_EMAIL: 'Неверная электронная почта',
    LINK_BETWEEN_COUPLE: 'между парой',
    LINK_BETWEEN_ALL: 'между всеми',
    LINK_DELETE_ALL_GROUPE: 'удалить все',
    CLIENT_SEX: 'Пол',
    CLIENT_SEX_M: 'M',
    CLIENT_SEX_F: 'Ж',
    CLIENT_AGE: 'Возраст',
    CLIENT_AGE_OLDER: 'старше',
    CLIENT_EDUCATION: 'Образование',
    CLIENT_EDUC_MIDLE: 'среднее',
    CLIENT_EDUC_SPEC: 'среднее спец.',
    CLIENT_EDUC_HIGH: 'высшее',
    CLIENT_OCCUPATION: 'Занятость',
    CLIENT_OCCUP_WORKER: 'Служащий',
    CLIENT_OCCUP_HOUSE: 'Домохозяйка',
    CLIENT_OCCUP_BOSS: 'Предприниматель',
    CLIENT_OCCUP_STUD: 'Студент',
    CLIENT_OCCUP_PENSION: 'Пенсионер',
    CLIENT_INFO_SOURCE: 'Источник информации',
    CLIENT_INFO_PRESS: 'Пресса',
    CLIENT_INFO_FRIEND: 'От знакомых',
    CLIENT_INFO_ADV: 'Визуальная реклама'
  },
  settings: {
    AUTHORIZATION: 'Авторизация:',
    CHANGE_PASSWORD: 'Изменить пароль',
    CHANGE_LANGUAGE: 'Изменить язык',
    PRIVATE_INFO: 'Личная информация:',
    USER_NAME: 'Контактное лицо',
    CITY: 'Город',
    ADD_PHONES: 'Дополнительные телефоны:',
    INSERT_PHONE: 'Добавить телефон',
    CLIENT_SUPPORT: 'Подержка пользователей',
    LOGOUT: 'Выйти из приложения',
    SAVE: 'Сохранить',
    CURRENT_PASSWORD: 'Текущий',
    NEW_PASSWORD: 'Новый',
    CONFIRM_PASSWORD: 'Подтвердить',
    NO_CONFIRM_PASS: 'Неверный пароль'
  }//,

  //'SWITCH_LANG': 'English'
};


// translations/ua.js

"use strict";

window.ukrainianDictionary = {
  common_words: {
    CHANGE: 'Змінити',
    MONTHS: 'Січень, Лютий, Березень, Квітень, Травень, Червень, Липень, Серпень, Вересень, Жовтень, Листопад, Грудень',
    MONTHS_SHOT: 'Січ, Лют, Бер, Квіт, Трав, Черв, Лип, Серп, Вер, Жовт, Лист, Груд',
    MONTHA: 'Січня, Лютого, Березня, Квітня, Травня, Червня, Липня, Серпня, Вересня, Жовтня, Листопада, Грудня',
    MONTH_LABEL: 'місяць',
    MONTHA_LABEL: 'місяця',
    MONTHS_LABEL: 'місяців',
    ALL: 'Все',
    MIN: 'мін.',
    MAX: 'макс.',
    //----- confirm dialogs
    BUTTON_Y: 'ТАК',
    BUTTON_N: 'НІ',
    DELETE_PRODUCT_TITLE: 'Видалення!',
    DELETE_PRODUCT_TXT: 'Хочете видалити продукт?',
    DELETE_ORDER_TITLE: 'Видалення замовлення!',
    DELETE_ORDER_TXT: 'Хочете видалити замовлення?',
    COPY_ORDER_TITLE: 'Копіювання!',
    COPY_ORDER_TXT: 'Хочете зробити копію замовлення?',
    SEND_ORDER_TITLE: 'На виробництво!',
    SEND_ORDER_TXT: 'Хочете відправити замовлення на завод?',
    NEW_TEMPLATE_TITLE: 'Зміна шаблона',
    TEMPLATE_CHANGES_LOST: 'Зміни у шаблоні будуть загублені. Продовжити?'
  },
  login: {
    ENTER: 'Увійти',
    PASS_CODE: 'Повідомте цей код менеджерові.',
    YOUR_CODE: 'Ваш код: ',
    EMPTY_FIELD: 'Заповніть це поле.',
    WRONG_NUMBER: 'Невірний номер, формат +XX(XXX)XXX-XXXX.',
    SHORT_PASSWORD: 'Занадто маленький пароль.',
    SOMETHING_WRONG: 'Сталося щось страшне, тому ви бачите це повідомлення про помилку.',
    MOBILE: 'Мобільный телефон',
    PASSWORD: 'Пароль'
  },
  mainpage: {
    MM: ' мм ',
    CLIMATE_ZONE: 'кліматична зона',
    THERMAL_RESISTANCE: 'опір теплопередачі',
    AIR_CIRCULATION: 'коефіцієнт повітрообміну',
    ROOM_KITCHEN: 'Кухня',
    ROOM_LIVINGROOM: 'Вітальня',
    ROOM_BALCONY: 'Балкон',
    ROOM_CHILDROOM: 'Дитяча',
    ROOM_BEDROOM: 'Спальня',
    ROOM_DOOR: 'Вхід',
    NAVMENU_GEOLOCATION: 'Вибрати розташування',
    NAVMENU_CURRENT_GEOLOCATION: 'Поточне розташування',
    NAVMENU_CURRENT_CALCULATION: 'Поточний розрахунок',
    NAVMENU_CART: 'Кошик розрахунку',
    NAVMENU_ADD_ELEMENTS: 'Дод. елементи',
    NAVMENU_ALL_CALCULATIONS: 'Всі розрахунки',
    NAVMENU_SETTINGS: 'Налаштування',
    NAVMENU_MORE_INFO: 'Більше інформації',
    NAVMENU_VOICE_HELPER: 'Голосовий помічник',
    NAVMENU_CALCULATIONS: 'Розрахунки',
    NAVMENU_APPENDIX: 'Додаток',
    NAVMENU_NEW_CALC: '+ Новий розрахунок',
    CONFIGMENU_CONFIGURATION: 'Конфігурація і розміри',
    CONFIGMENU_SIZING: 'ширина * висота -',
    CONFIGMENU_PROFILE: 'Профіль',
    CONFIGMENU_GLASS: 'Склопакет',
    CONFIGMENU_HARDWARE: 'Фурнітура',
    CONFIGMENU_LAMINATION: 'Ламінація',
    CONFIGMENU_LAMINATION_TYPE: 'фасад / в кімнаті',
    CONFIGMENU_ADDITIONAL: 'Додатково',
    CONFIGMENU_IN_CART: 'В кошик',
    VOICE_SPEACH: 'Говоріть...',
    COMMENT: 'Залиште свою замітку про заказ тут.',
    ROOM_SELECTION: 'Вибір інтер`єру'
  },
  panels: {
    TEMPLATE_WINDOW: 'Вікно',
    TEMPLATE_BALCONY: 'Балкон',
    TEMPLATE_DOOR: 'Двері',
    TEMPLATE_BALCONY_ENTER: 'Вихід на балкон',
    TEMPLATE_EDIT: 'Редагувати',
    TEMPLATE_DEFAULT: 'Проект за умовчанням',
    COUNTRY: 'країна',
    BRAND: 'торгова марка',
    HEAT_INSULATION: 'теплоізоляція',
    NOICE_INSULATION: 'шумоізоляція',
    LAMINAT_INSIDE: 'Ламінація рами в кімнаті',
    LAMINAT_OUTSIDE: 'Ламінація з боку фасаду',
    LAMINAT_WHITE: 'без ламінації, радикальний білий колір'
  },
  add_elements: {
    CHOOSE: 'Вибрати',
    ADD: 'Додати',

    GRID: 'москітна сітка',
    VISOR: 'Козирок',
    SPILLWAY: 'водовідлив',
    OUTSIDE: 'зовнішні укоси',
    LOUVERS: 'жалюзі',
    INSIDE: 'внутрішні укоси',
    CONNECTORS: 'з`єднувач',
    FAN: 'мікропровітрювання',
    WINDOWSILL: 'підвіконня',
    HANDLEL: 'ручка',
    OTHERS: 'інше',

    GRIDS: 'москітні сітки',
    VISORS: 'козирки',
    SPILLWAYS: 'водовідливи',
    WINDOWSILLS: 'підвіконня',
    HANDLELS: 'ручки',
    NAME_LABEL: 'найменування',
    QTY_LABEL: 'шт.',
    SIZE_LABEL: 'розмір',
    WIDTH_LABEL: 'ширина',
    HEIGHT_LABEL: 'висота',
    COLOR_LABEL: 'колір',
    OTHER_ELEMENTS1: 'Ще',
    OTHER_ELEMENTS2: 'компонента...',
    SCHEME_VIEW: 'Схематично',
    LIST_VIEW: 'Cписок',
    INPUT_ADD_ELEMENT: 'Додати компонент',
    CANCEL: 'Відміна',
    TOTAL_PRICE_TXT: 'Разом додаткових компонентів на суму:',
    ELEMENTS: 'компонентів',
    ELEMENT: 'компонент',
    ELEMENTA: 'компонента'
  },
  add_elements_menu: {
    TIP: 'Виберіть елемент зі списку',
    EMPTY_ELEMENT: 'Без элементу',
    COLOR_AVAILABLE: 'Доступні кольори:',
    TAB_NAME_SIMPLE_FRAME: 'Проста конструкція',
    TAB_NAME_HARD_FRAME: 'Складена конструкція',
    TAB_EMPTY_EXPLAIN: 'Виберіть зі списку перший елемент, щоб почати складати конструкцію.'
  },
  construction: {
    SASH_SHAPE: 'стулки',
    ANGEL_SHAPE: 'кути',
    IMPOST_SHAPE: 'імпости',
    ARCH_SHAPE: 'арки',
    POSITION_SHAPE: 'позиція',
    UNITS_DESCRIP: 'Як одиниці виміру використовуються міліметри',
    PROJECT_DEFAULT: 'Проект за умовчанням',
    DOOR_CONFIG_LABEL: 'конфігурація дверей',
    DOOR_CONFIG_DESCTIPT: 'рама дверей',
    SASH_CONFIG_DESCTIPT: 'стулка дверей',
    HANDLE_CONFIG_DESCTIPT: 'ручка',
    LOCK_CONFIG_DESCTIPT: 'замок',
    STEP: 'крок',
    LABEL_DOOR_TYPE: 'Виберіть конструкцію рами дверей',
    LABEL_SASH_TYPE: 'Виберіть тип стулки дверей',
    LABEL_HANDLE_TYPE: 'Виберіть тип ручки',
    LABEL_LOCK_TYPE: 'Виберіть тип замка',
    VOICE_SWITCH_ON: "голосовий режим включен",
    VOICE_NOT_UNDERSTAND: 'Не зрозуміло',
    VOICE_SMALLEST_SIZE: 'замалий розмір',
    VOICE_BIGGEST_SIZE: "завеликий розмір",
    VOICE_SMALL_GLASS_BLOCK: "слишком маленький световой проем"
  },
  history: {
    SEARCH_PLACEHOLDER: 'Пошук за ключовими словами',
    DRAFT_VIEW: 'Чернетки розрахунків',
    HISTORY_VIEW: 'Історія розрахунків',
    PHONE: 'телефон',
    CLIENT: 'клієнт',
    ADDRESS: 'адреса',
    FROM: 'від ',
    UNTIL: 'до ',
    PAYMENTS: 'платежів по',
    ALLPRODUCTS: 'виробів',
    ON: 'на',
    DRAFT: 'Чернетка',
    DATE_RANGE: 'Діапазон дат',
    ALL_TIME: 'За весь час',
    SORTING: 'Сортування',
    NEWEST_FIRST: 'За часом: нові на початку',
    NEWEST_LAST: 'За часом: нові у кінці',
    SORT_BY_TYPE: 'По типах',
    SORT_SHOW: 'Показати',
    SORT_SHOW_ACTIVE: 'Тільки активні',
    SORT_SHOW_WAIT: 'Тільки в очікуванні',
    SORT_SHOW_DONE: 'Тільки завершені',
    BY_YOUR_REQUEST: 'По вашому запиту',
    NOT_FIND: 'нічого не знайдено',
    WAIT_MASTER: 'очікує замірювача'
  },
  cart: {
    ALL_ADD_ELEMENTS: 'Всі дод.елементи замовлення',
    ADD_ORDER: 'Додати виріб',
    PRODUCT_QTY: 'кількість виробів',
    LIGHT_VIEW: 'Скорочений вид',
    FULL_VIEW: 'Повний вид',
    DELIVERY: 'Доставка',
    SELF_EXPORT: 'самовивезення',
    FLOOR: 'поверх',
    ASSEMBLING: 'Монтаж',
    WITHOUT_ASSEMBLING: 'без монтажу',
    FREE: 'безкоштовно',
    PAYMENT_BY_INSTALMENTS: 'Розстрочка',
    WITHOUT_INSTALMENTS: 'без розстрочки',
    DELIVERY_DATE: 'Дата постачання',
    TOTAL_PRICE_LABEL: 'Разом при постачанні на',
    MONTHLY_PAYMENT_LABEL: 'щомісячних платежів по',
    DATE_DELIVERY_LABEL: 'при постачанні на',
    FIRST_PAYMENT_LABEL: 'Перший платіж',
    ORDER: 'Замовити',
    MEASURE: 'Заміряти',
    READY: 'Готово',
    CALL_MASTER: 'Виклик замірювача для розрахунку',
    CALL_MASTER_DESCRIP: 'Для виклику замірювача нам потрібно дещо про вас знати. Обидва поля є обов`язковими для заповнення.',
    CLIENT_LOCATION: 'Місце розташування',
    CLIENT_ADDRESS: 'Адреса',
    CALL_ORDER: 'Оформлення замовлення для розрахунку',
    CALL_ORDER_DESCRIP: 'Для того, щоб виконати замовлення, ми повинні дещо про вас знати.',
    CALL_ORDER_CLIENT_INFO: 'Інформація про клієнта (заповнюйте обов`язково):',
    CLIENT_NAME: 'Прізвище Ім`я По батькові',
    CALL_ORDER_DELIVERY: 'Доставити замовлення на',
    CALL_ORDER_TOTAL_PRICE: 'Загалом',
    CALL_ORDER_ADD_INFO: 'Додатково (заповнюйте за бажанням):',
    CLIENT_EMAIL: 'Електронна пошта',
    ADD_PHONE: 'Додатковий телефон',
    CALL_CREDIT: 'Оформлення розстрочки і замовлення для розрахунку',
    CALL_CREDIT_DESCRIP: 'Для того, щоб оформити розстрочку і виконати замовлення, ми повинні дещо про вас знати.',
    CALL_CREDIT_CLIENT_INFO: 'Розстрочка:',
    CREDIT_TARGET: 'Мета оформлення розстрочки',
    CLIENT_ITN: 'Індивідуальний податковий номер',
    CALL_START_TIME: 'Дзвонити від:',
    CALL_END_TIME: 'до:',
    CALL_CREDIT_PARTIAL_PRICE: 'по',
    ADDELEMENTS_EDIT_LIST: 'Редагувати список',
    ADDELEMENTS_PRODUCT_COST: 'в одному виробі',
    HEAT_TRANSFER: 'теплопередача',
    WRONG_EMAIL: 'Невірна електронна пошта',
    LINK_BETWEEN_COUPLE: 'між парою',
    LINK_BETWEEN_ALL: 'між усіма',
    LINK_DELETE_ALL_GROUPE: 'видалити усі',
    CLIENT_SEX: 'Стать',
    CLIENT_SEX_M: 'Ч',
    CLIENT_SEX_F: 'Ж',
    CLIENT_AGE: 'Вік',
    CLIENT_AGE_OLDER: 'старше',
    CLIENT_EDUCATION: 'Освіта',
    CLIENT_EDUC_MIDLE: 'середнэ',
    CLIENT_EDUC_SPEC: 'середнэ спец.',
    CLIENT_EDUC_HIGH: 'вища',
    CLIENT_OCCUPATION: 'Зайнятість',
    CLIENT_OCCUP_WORKER: 'Службовець',
    CLIENT_OCCUP_HOUSE: 'Домогосподарка',
    CLIENT_OCCUP_BOSS: 'Підприэмиць',
    CLIENT_OCCUP_STUD: 'Студент',
    CLIENT_OCCUP_PENSION: 'Пенсіонер',
    CLIENT_INFO_SOURCE: 'Джерело информаціі',
    CLIENT_INFO_PRESS: 'Преса',
    CLIENT_INFO_FRIEND: 'Від знайомих',
    CLIENT_INFO_ADV: 'Візуальна реклама'
  },
  settings: {
    AUTHORIZATION: 'Авторизація:',
    CHANGE_PASSWORD: 'Змінити пароль',
    CHANGE_LANGUAGE: 'Змінити мову',
    PRIVATE_INFO: 'Особиста інформація:',
    USER_NAME: 'Контактна особа',
    CITY: 'Місто',
    ADD_PHONES: 'Додаткові телефони:',
    INSERT_PHONE: 'Додати телефон',
    CLIENT_SUPPORT: 'Підтримка користувачів',
    LOGOUT: 'Вийти з додатка',
    SAVE: 'Зберегти',
    CURRENT_PASSWORD: 'Поточний',
    NEW_PASSWORD: 'Новий',
    CONFIRM_PASSWORD: 'Підтвердити',
    NO_CONFIRM_PASS: 'Невірний пароль'
  }
};



// services/constructService.js


// services/constructService.js

"use strict";

BauVoiceApp.factory('constructService', function ($q) {

  // SQL requests for select data from tables
  var selectLaminations = "SELECT id, name FROM lamination_colors ORDER BY id",
    selectProfileSystemFolders = "SELECT id, name FROM profile_system_folders order by position",
    //selectProfileSystems = "SELECT profile_systems.id, profile_system_folders.name as folder_name, profile_systems.name, profile_systems.short_name, profile_systems.country FROM profile_systems LEFT JOIN profile_system_folders ON  profile_systems.profile_system_folder_id = profile_system_folders.id WHERE profile_system_folder_id = ? order by profile_systems.id", // position
    selectProfileSystems = "SELECT profile_systems.id, profile_system_folders.name as folder_name, profile_systems.name, profile_systems.short_name, profile_systems.country, rama_list_id, rama_still_list_id, stvorka_list_id, impost_list_id, shtulp_list_id FROM profile_systems LEFT JOIN profile_system_folders ON  profile_systems.profile_system_folder_id = profile_system_folders.id WHERE profile_system_folder_id = ? order by profile_systems.id",
    selectWindowHardware = "SELECT id, name, short_name as shortName FROM window_hardware_groups WHERE is_in_calculation = 1",
    selectSectionSize = "SELECT id, a, b, c, d FROM lists WHERE id = ?";

  return {

    getRoomInfo: function (callback) {
      callback(new OkResult({
        roomInfo: [
          {
            id: 1,
            name: 'Кухня',
            airCirculation: 90
          },
          {
            id: 2,
            name: 'Гостиная',
            airCirculation: 50
          },
          {
            id: 3,
            name: 'Балкон',
            airCirculation: 0
          },
          {
            id: 4,
            name: 'Детская',
            airCirculation: 30
          },
          {
            id: 5,
            name: 'Спальня',
            airCirculation: 40
          },
          {
            id: 6,
            name: 'Вход',
            current: false,
            airCirculation: 0
          }
        ]
      }));
    },

    getAllProfileSystems: function () {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), AllProfileSystems = [], allFolders, count, folder_id, resultObj = {}, j, i;
      var deferred = $q.defer();
      db.transaction(function (transaction) {
        transaction.executeSql(selectProfileSystemFolders, [], function (transaction, result) {
          if (result.rows.length) {
            allFolders = result.rows.length - 1;
            db.transaction(function (transaction) {
              for (j = 0; j < result.rows.length; j++) {
                count = 0;
                folder_id = result.rows.item(j).id;
                transaction.executeSql(selectProfileSystems, [folder_id], function (transaction, result) {
                  if (result.rows.length) {
                    resultObj = {folder: result.rows.item(0).folder_name, profiles: [], rama: []};
                    for (i = 0; i < result.rows.length; i++) {
                      resultObj.profiles.push({
                        id: result.rows.item(i).id,
                        name: result.rows.item(i).name,
                        short_name: result.rows.item(i).short_name,
                        country: result.rows.item(i).country,
                        rama_id: result.rows.item(i).rama_list_id,
                        rama_still_id: result.rows.item(i).rama_still_list_id,
                        sash_id: result.rows.item(i).stvorka_list_id,
                        impost_id: result.rows.item(i).impost_list_id,
                        shtulp_id: result.rows.item(i).shtulp_list_id
                      });
                    }
                    AllProfileSystems.push(resultObj);
                    if (allFolders === count) {
                      deferred.resolve(AllProfileSystems);
                    }
                    count++;
                  } else {
                    deferred.reject('No ProfileSystems in database!');
                  }
                }, function () {
                  deferred.reject('Something went wrong with selection profile_systems record');
                });
              }
            });
          } else {
            deferred.reject('Something went wrong with selection profile_systems record');
          }
        }, function () {
          deferred.reject('Something went wrong with selection profile_systems record');
        });
      });
      return deferred.promise;
    },



    getAllProfileSizes: function (elementId) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), resultObj = {};
      var deferred = $q.defer();
      db.transaction(function (transaction) {
        transaction.executeSql(selectSectionSize, [elementId], function (transaction, result) {
          if (result.rows.length) {
            resultObj = {
              id: result.rows.item(0).id,
              a: result.rows.item(0).a,
              b: result.rows.item(0).b,
              c: result.rows.item(0).c,
              d: result.rows.item(0).d
            };
            deferred.resolve(resultObj);
          } else {
            resultObj = {};
            deferred.resolve(resultObj);
          }

        }, function () {
          deferred.reject('Something went wrong with selection profile_systems record');
        });
      });
      return deferred.promise;
    },



/*
    getAllProfileSystems: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), AllProfileSystems = [], allFolders, count, folder_id, resultObj = {}, j, i;
      db.transaction(function (transaction) {
        transaction.executeSql(selectProfileSystemFolders, [], function (transaction, result) {
          if (result.rows.length) {
            allFolders = result.rows.length - 1;
            db.transaction(function (transaction) {
              for (j = 0; j < result.rows.length; j++) {
                count = 0;
                folder_id = result.rows.item(j).id;
                transaction.executeSql(selectProfileSystems, [folder_id], function (transaction, result) {
                  if (result.rows.length) {
                    resultObj = {folder: result.rows.item(0).folder_name, profiles: []};
                    for (i = 0; i < result.rows.length; i++) {
                      resultObj.profiles.push({
                        id: result.rows.item(i).id,
                        name: result.rows.item(i).name,
                        short_name: result.rows.item(i).short_name,
                        country: result.rows.item(i).country,
                        rama_id: result.rows.item(i).rama_list_id,
                        rama_still_id: result.rows.item(i).rama_still_list_id,
                        sash_id: result.rows.item(i).stvorka_list_id,
                        impost_id: result.rows.item(i).impost_list_id,
                        shtulp_id: result.rows.item(i).shtulp_list_id
                      });
                    }
                    AllProfileSystems.push(resultObj);
                    if (allFolders === count) {
                      callback(new OkResult(AllProfileSystems));
                    }
                    count++;
                  } else {
                    callback(new ErrorResult(1, 'No ProfileSystems in database!'));
                  }
                }, function () {
                  callback(new ErrorResult(2, 'Something went wrong with selection profile_systems record'));
                });
              }
            });
          } else {
            callback(new ErrorResult(1, 'No ProfileSystemFolders in database!'));
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong with selection profile_system_folders record'));
        });
      });
    },
*/

    getTemplateImgIcons: function (callback) {
      callback(new OkResult({
        templateImgs: [
          {
            id: 1,
            name: 'Одностворчатое',
            src: 'img/templates/1.png'
          },
          {
            id: 2,
            name: 'Одностворчатое',
            src: 'img/templates/1.png'
          },
          {
            id: 3,
            name: 'Двухстворчатое',
            src: 'img/templates/3.png'
          },
          {
            id: 4,
            name: 'Трехстворчатое',
            src: 'img/templates/4.png'
          },
          {
            id: 5,
            name: 'Двухстворчатое',
            src: 'img/templates/5.png'
          },
          {
            id: 6,
            name: 'Двухстворчатое',
            src: 'img/templates/6.png'
          },
          {
            id: 7,
            name: 'Двухстворчатое',
            src: 'img/templates/7.png'
          },
          {
            id: 8,
            name: 'Одностворчатое',
            src: 'img/templates/8.png'
          },
          {
            id: 9,
            name: 'Двухстворчатое',
            src: 'img/templates/9.png'
          },
          {
            id: 10,
            name: 'Трехстворчатое',
            src: 'img/templates/10.png'
          },
          {
            id: 11,
            name: 'Трехстворчатое',
            src: 'img/templates/11.png'
          },
          {
            id: 12,
            name: 'Трехстворчатое',
            src: 'img/templates/12.png'
          }
        ]
      }));
    },


    getDefaultConstructTemplate: function(callback) {
      callback(new OkResult({
        windows: [

          {
            'name': 'Одностворчатое',
            'objects': [
              //------- main points
              {'type': 'fixed_point', id: 'fp1', x:0, y:0},
              {'type': 'fixed_point', id: 'fp2', x:1300, y:0},
              {'type': 'fixed_point', id: 'fp3', x:1300, y:1400},
              {'type': 'fixed_point', id: 'fp4', x:0, y:1400},
              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              //----- glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Одностворчатое',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:0, y:0},
              {'type':'fixed_point', id:'fp2', x:700, y:0},
              {'type':'fixed_point', id:'fp3', x:700, y:1400},
              {'type':'fixed_point', id:'fp4', x:0, y:1400},
              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
              //-------- sash
              {'type': 'cross_point_sash_out', id: 'cpsout1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point_sash_out', id: 'cpsout2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point_sash_out', id: 'cpsout3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point_sash_out', id: 'cpsout4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'sash_out_line', id: 'sashoutline1', from: 'cpsout4', to: 'cpsout1'},
              {'type': 'sash_out_line', id: 'sashoutline2', from: 'cpsout1', to: 'cpsout2'},
              {'type': 'sash_out_line', id: 'sashoutline3', from: 'cpsout2', to: 'cpsout3'},
              {'type': 'sash_out_line', id: 'sashoutline4', from: 'cpsout3', to: 'cpsout4'},

              {'type': 'cross_point_hardware', id: 'cphw1', line1: 'sashoutline1', line2: 'sashoutline2'},
              {'type': 'cross_point_hardware', id: 'cphw2', line1: 'sashoutline2', line2: 'sashoutline3'},
              {'type': 'cross_point_hardware', id: 'cphw3', line1: 'sashoutline3', line2: 'sashoutline4'},
              {'type': 'cross_point_hardware', id: 'cphw4', line1: 'sashoutline4', line2: 'sashoutline1'},
              {'type': 'hardware_line', id: 'hardwareline1', from: 'cphw4', to: 'cphw1'},
              {'type': 'hardware_line', id: 'hardwareline2', from: 'cphw1', to: 'cphw2'},
              {'type': 'hardware_line', id: 'hardwareline3', from: 'cphw2', to: 'cphw3'},
              {'type': 'hardware_line', id: 'hardwareline4', from: 'cphw3', to: 'cphw4'},

              {'type': 'cross_point_sash_in', id: 'cpsin1', line1: 'sashoutline1', line2: 'sashoutline2'},
              {'type': 'cross_point_sash_in', id: 'cpsin2', line1: 'sashoutline2', line2: 'sashoutline3'},
              {'type': 'cross_point_sash_in', id: 'cpsin3', line1: 'sashoutline3', line2: 'sashoutline4'},
              {'type': 'cross_point_sash_in', id: 'cpsin4', line1: 'sashoutline4', line2: 'sashoutline1'},
              {'type': 'sash_line', id: 'sashline1', from: 'cpsin4', to: 'cpsin1'},
              {'type': 'sash_line', id: 'sashline2', from: 'cpsin1', to: 'cpsin2'},
              {'type': 'sash_line', id: 'sashline3', from: 'cpsin2', to: 'cpsin3'},
              {'type': 'sash_line', id: 'sashline4', from: 'cpsin3', to: 'cpsin4'},
              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'frameline3', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'sash'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},
              //----- glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'frameline3', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'sash'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'sash', id: 'sash1', parts: ['sashoutline1', 'sashline1']},
              {'type': 'sash', id: 'sash2', parts: ['sashoutline2', 'sashline2'], openType: ['sashline2', 'sashline4']},
              {'type': 'sash', id: 'sash3', parts: ['sashoutline3', 'sashline3'], openType: ['sashline3', 'sashline1']},
              {'type': 'sash', id: 'sash4', parts: ['sashoutline4', 'sashline4']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'sash_block', id: 'sashBlock1', parts: ['hardwareline1', 'hardwareline2', 'hardwareline3', 'hardwareline4'], openDir: [1, 4], handlePos: 4},
              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Двухстворчатое',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:0, y:0},
              {'type':'fixed_point', id:'fp2', x:1060, y:0},
              {'type':'fixed_point', id:'fp3', x:1060, y:1320},
              {'type':'fixed_point', id:'fp4', x:0, y:1320},
              {'type':'fixed_point_impost', id:'fpimpost1', x:530, y:0, dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:530, y:1320, dir:'vert'},
              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
              //-------- impost
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'sash'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},
              //-------- sash
              {'type': 'cross_point_sash_out', id: 'cpsout5', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point_sash_out', id: 'cpsout6', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point_sash_out', id: 'cpsout7', line1: 'frameline3', line2: 'impostcenterline2'},
              {'type': 'cross_point_sash_out', id: 'cpsout8', line1: 'impostcenterline2', line2: 'frameline1'},
              {'type': 'sash_out_line', id: 'sashoutline5', from: 'cpsout8', to: 'cpsout5'},
              {'type': 'sash_out_line', id: 'sashoutline6', from: 'cpsout5', to: 'cpsout6'},
              {'type': 'sash_out_line', id: 'sashoutline7', from: 'cpsout6', to: 'cpsout7'},
              {'type': 'sash_out_line', id: 'sashoutline8', from: 'cpsout7', to: 'cpsout8'},

              {'type': 'cross_point_hardware', id: 'cphw5', line1: 'sashoutline5', line2: 'sashoutline6'},
              {'type': 'cross_point_hardware', id: 'cphw6', line1: 'sashoutline6', line2: 'sashoutline7'},
              {'type': 'cross_point_hardware', id: 'cphw7', line1: 'sashoutline7', line2: 'sashoutline8'},
              {'type': 'cross_point_hardware', id: 'cphw8', line1: 'sashoutline8', line2: 'sashoutline5'},
              {'type': 'hardware_line', id: 'hardwareline5', from: 'cphw8', to: 'cphw5'},
              {'type': 'hardware_line', id: 'hardwareline6', from: 'cphw5', to: 'cphw6'},
              {'type': 'hardware_line', id: 'hardwareline7', from: 'cphw6', to: 'cphw7'},
              {'type': 'hardware_line', id: 'hardwareline8', from: 'cphw7', to: 'cphw8'},

              {'type': 'cross_point_sash_in', id: 'cpsin5', line1: 'sashoutline5', line2: 'sashoutline6'},
              {'type': 'cross_point_sash_in', id: 'cpsin6', line1: 'sashoutline6', line2: 'sashoutline7'},
              {'type': 'cross_point_sash_in', id: 'cpsin7', line1: 'sashoutline7', line2: 'sashoutline8'},
              {'type': 'cross_point_sash_in', id: 'cpsin8', line1: 'sashoutline8', line2: 'sashoutline5'},
              {'type': 'sash_line', id: 'sashline5', from: 'cpsin8', to: 'cpsin5'},
              {'type': 'sash_line', id: 'sashline6', from: 'cpsin5', to: 'cpsin6'},
              {'type': 'sash_line', id: 'sashline7', from: 'cpsin6', to: 'cpsin7'},
              {'type': 'sash_line', id: 'sashline8', from: 'cpsin7', to: 'cpsin8'},
              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'frameline1', line2: 'frameline2', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'frameline2', line2: 'frameline3', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'sash'},
              {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
              {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
              {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
              {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
              {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
              {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
              {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
              {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
              {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
              {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
              {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
              {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

              //----- left glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //----- right glass
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameline1', line2: 'frameline2', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'frameline2', line2: 'frameline3', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'sash'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
              {'type': 'sash', id: 'sash5', parts: ['sashoutline5', 'sashline5']},
              {'type': 'sash', id: 'sash6', parts: ['sashoutline6', 'sashline6'], openType: ['sashline6', 'sashline8']},
              {'type': 'sash', id: 'sash7', parts: ['sashoutline7', 'sashline7'], openType: ['sashline7', 'sashline5']},
              {'type': 'sash', id: 'sash8', parts: ['sashoutline8', 'sashline8']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
              {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
              {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
              {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

              {'type': 'sash_block', id: 'sashBlock2', parts: ['hardwareline5', 'hardwareline6', 'hardwareline7', 'hardwareline8'], openDir: [1, 4], handlePos: 4},
              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1'], level: 3, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Трехстворчатое',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:0, y:0},
              {'type':'fixed_point', id:'fp2', x:2100, y:0},
              {'type':'fixed_point', id:'fp3', x:2100, y:1400},
              {'type':'fixed_point', id:'fp4', x:0, y:1400},
              {'type':'fixed_point_impost', id:'fpimpost1', x:700, y:0, dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:700, y:1400, dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost3', x:1400, y:0, dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost4', x:1400, y:1400, dir:'vert'},

/*
              {'type': 'skylight', id: 'main_block_1', level: 0, points: ['fp1', 'fp2', 'fp3', 'fp4'], blockType: 'frame', insideBlocks: ['light_block_1', 'light_block_2', 'light_block_3']},

              {'type': 'skylight', id: 'light_block_1', level: 1, points: ['fp1', 'fpimpost1', 'fpimpost2', 'fp4'], blockType: 'sash', openDir: [1, 4], handlePos: 4, insideBlocks: ['light_block_4', 'light_block_5']},
              {'type': 'skylight', id: 'light_block_2', level: 1, points: ['fpimpost1', 'fpimpost3', 'fpimpost4', 'fpimpost1'], blockType: 'frame', insideBlocks: []},
              {'type': 'skylight', id: 'light_block_3', level: 1, points: ['fpimpost3', 'fp2', 'fp3', 'fpimpost4'], blockType: 'frame', insideBlocks: []},

              {'type': 'skylight', id: 'light_block_4', level: 2, parentBlock: 'light_block_1', points: ['fp1', 'fpimpost1', 'fpimpost5', 'fpimpost6'], blockType: 'frame', insideBlocks: []},
              {'type': 'skylight', id: 'light_block_5', level: 2, parentBlock: 'light_block_1', points: ['fpimpost5', 'fpimpost6', 'fpimpost2', 'fp4'], blockType: 'frame', insideBlocks: []},
*/
              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
              //-------- impost
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'sash'},
              {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'sash'},
              {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},

              {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'frameline1', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},
              {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
              {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},
              //-------- sash
              {'type': 'cross_point_sash_out', id: 'cpsout5', line1: 'frameline1', line2: 'impostcenterline3'},
              {'type': 'cross_point_sash_out', id: 'cpsout6', line1: 'impostcenterline3', line2: 'frameline3'},
              {'type': 'cross_point_sash_out', id: 'cpsout7', line1: 'frameline3', line2: 'impostcenterline2'},
              {'type': 'cross_point_sash_out', id: 'cpsout8', line1: 'impostcenterline2', line2: 'frameline1'},
              {'type': 'sash_out_line', id: 'sashoutline5', from: 'cpsout8', to: 'cpsout5'},
              {'type': 'sash_out_line', id: 'sashoutline6', from: 'cpsout5', to: 'cpsout6'},
              {'type': 'sash_out_line', id: 'sashoutline7', from: 'cpsout6', to: 'cpsout7'},
              {'type': 'sash_out_line', id: 'sashoutline8', from: 'cpsout7', to: 'cpsout8'},

              {'type': 'cross_point_hardware', id: 'cphw5', line1: 'sashoutline5', line2: 'sashoutline6'},
              {'type': 'cross_point_hardware', id: 'cphw6', line1: 'sashoutline6', line2: 'sashoutline7'},
              {'type': 'cross_point_hardware', id: 'cphw7', line1: 'sashoutline7', line2: 'sashoutline8'},
              {'type': 'cross_point_hardware', id: 'cphw8', line1: 'sashoutline8', line2: 'sashoutline5'},
              {'type': 'hardware_line', id: 'hardwareline5', from: 'cphw8', to: 'cphw5'},
              {'type': 'hardware_line', id: 'hardwareline6', from: 'cphw5', to: 'cphw6'},
              {'type': 'hardware_line', id: 'hardwareline7', from: 'cphw6', to: 'cphw7'},
              {'type': 'hardware_line', id: 'hardwareline8', from: 'cphw7', to: 'cphw8'},

              {'type': 'cross_point_sash_in', id: 'cpsin5', line1: 'sashoutline5', line2: 'sashoutline6'},
              {'type': 'cross_point_sash_in', id: 'cpsin6', line1: 'sashoutline6', line2: 'sashoutline7'},
              {'type': 'cross_point_sash_in', id: 'cpsin7', line1: 'sashoutline7', line2: 'sashoutline8'},
              {'type': 'cross_point_sash_in', id: 'cpsin8', line1: 'sashoutline8', line2: 'sashoutline5'},
              {'type': 'sash_line', id: 'sashline5', from: 'cpsin8', to: 'cpsin5'},
              {'type': 'sash_line', id: 'sashline6', from: 'cpsin5', to: 'cpsin6'},
              {'type': 'sash_line', id: 'sashline7', from: 'cpsin6', to: 'cpsin7'},
              {'type': 'sash_line', id: 'sashline8', from: 'cpsin7', to: 'cpsin8'},

              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'frameline1', line2: 'impostcenterline3', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'sash'},
              {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
              {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
              {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
              {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
              {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
              {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
              {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
              {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
              {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
              {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
              {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
              {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
              {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
              {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
              {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
              {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
              {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
              {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
              {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
              {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
              {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
              {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
              {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

              //---- left glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //----- center glass
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameline1', line2: 'impostcenterline3', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'sash'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
              //------ right glass
              {'type': 'cross_point_glass', id: 'cpg9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
              {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
              {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
              {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},
              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
              {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},
              {'type': 'sash', id: 'sash5', parts: ['sashoutline5', 'sashline5']},
              {'type': 'sash', id: 'sash6', parts: ['sashoutline6', 'sashline6'], openType: ['sashline6', 'sashline8']},
              {'type': 'sash', id: 'sash7', parts: ['sashoutline7', 'sashline7'], openType: ['sashline7', 'sashline5']},
              {'type': 'sash', id: 'sash8', parts: ['sashoutline8', 'sashline8']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
              {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
              {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
              {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

              {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
              {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
              {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
              {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

              {'type': 'sash_block', id: 'sashBlock2', parts: ['hardwareline5', 'hardwareline6', 'hardwareline7', 'hardwareline8'], openDir: [1, 4], handlePos: 4},
              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},

              {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH', 'dimH3'], links: ['fpimpost1', 'fpimpost2'], level: 1, side: 'top'},
              {'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost1', 'fpimpost2'], to: ['fpimpost3', 'fpimpost4'], limits: ['overallDimH', 'dimH1'], links: ['fpimpost3', 'fpimpost4'], level: 1, side: 'top'},
              {'type': 'dimensionsH', id: 'dimH3', from: ['fpimpost3', 'fpimpost4'], to: ['fp2', 'fp3'], level: 1, side: 'top'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1', 'dimH2'], level: 3, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Двухстворчатое',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:0, y: 0},
              {'type':'fixed_point', id:'fp2', x:1060, y:0},
              {'type':'fixed_point', id:'fp3', x:1060, y:1320},
              {'type':'fixed_point', id:'fp4', x:0, y:1320},
              {'type':'fixed_point_impost', id:'fpimpost1', x:530, y:0, dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:530, y:1320, dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost3', x:1060, y:300, dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost4', x:0, y:300, dir:'hor'},
              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
              //-------- impost
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

              {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline1', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline4', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
              {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline1', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline4', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
              {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
              {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
              {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
              {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
              {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
              {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
              {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
              {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
              {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
              {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
              {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
              {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
              {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
              {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
              {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
              {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
              {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
              {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
              {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
              {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
              {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
              {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

              //----- left glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline1', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},

              {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline4', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
              //----- right glass
              {'type': 'cross_point_glass', id: 'cpg9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
              {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
              {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
              {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},
              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
              {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
              {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
              {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
              {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

              {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
              {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
              {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
              {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
              {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'dimV1', from: ['fp1', 'fp2'], to: ['fpimpost4', 'fpimpost3'], limits: ['overallDimV'], level: 1, height: 150, side: 'left'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1'], level: 3, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 2, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Двухстворчатое',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
              {'type':'fixed_point', id:'fp2', x:'1060', y:'0'},
              {'type':'fixed_point', id:'fp3', x:'1060', y:'1320'},
              {'type':'fixed_point', id:'fp4', x:'0', y:'1320'},
              {'type':'fixed_point_impost', id:'fpimpost1', x:'530', y:'0', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:'530', y:'1320', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost3', x:'1060', y:'300', dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost4', x:'0', y:'300', dir:'hor'},
              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
              //-------- impost
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

              {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'frameline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'impostcenterline2', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
              {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'frameline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'impostcenterline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
              {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
              {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
              {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
              {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
              {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
              {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
              {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
              {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
              {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
              {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
              {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'impostcenterline4', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline2', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
              {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
              {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
              {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
              {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
              {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
              {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
              {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
              {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
              {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
              {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
              {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

              //----- left glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //----- right glass
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'frameline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'impostcenterline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},

              {'type': 'cross_point_glass', id: 'cpg9', line1: 'impostcenterline4', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline2', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
              {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
              {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
              {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},
              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
              {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
              {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
              {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
              {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

              {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
              {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
              {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
              {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
              {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'dimV1', from: ['fp2', 'fp1'], to: ['fpimpost3', 'fpimpost4'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1'], links: ['fpimpost3'], level: 3, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Двухстворчатое',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
              {'type':'fixed_point', id:'fp2', x:'1060', y:'0'},
              {'type':'fixed_point', id:'fp3', x:'1060', y:'1320'},
              {'type':'fixed_point', id:'fp4', x:'0', y:'1320'},
              {'type':'fixed_point_impost', id:'fpimpost1', x:'530', y:'0', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:'530', y:'1320', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost3', x:'1060', y:'300', dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost4', x:'0', y:'300', dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost5', x:'1060', y:'300', dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost6', x:'0', y:'300', dir:'hor'},
              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
              //-------- impost
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

              {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline1', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline4', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
              {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

              {'type': 'impost_line', id: 'impostcenterline5', from: 'fpimpost5', to: 'fpimpost6', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline6', from: 'fpimpost6', to: 'fpimpost5', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost9', line1: 'frameline2', line2: 'impostcenterline5', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost10', line1: 'impostcenterline6', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost11', line1: 'impostcenterline2', line2: 'impostcenterline6', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost12', line1: 'impostcenterline5', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline5', from: 'cpimpost9', to: 'cpimpost12'},
              {'type': 'impost_in_line', id: 'impostinline6', from: 'cpimpost11', to: 'cpimpost10'},

              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline1', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline4', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
              {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
              {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
              {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
              {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
              {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
              {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
              {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
              {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
              {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
              {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
              {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'frameline2', line2: 'impostcenterline5', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'impostcenterline5', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
              {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
              {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
              {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
              {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
              {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
              {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
              {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
              {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
              {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
              {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
              {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout13', line1: 'impostcenterline6', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout15', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout16', line1: 'impostcenterline2', line2: 'impostcenterline6', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline13', from:'cpbeadout16', to:'cpbeadout13'},
              {'type': 'bead_line', id:'beadline14', from:'cpbeadout13', to:'cpbeadout14'},
              {'type': 'bead_line', id:'beadline15', from:'cpbeadout14', to:'cpbeadout15'},
              {'type': 'bead_line', id:'beadline16', from:'cpbeadout15', to:'cpbeadout16'},
              {'type': 'cross_point_bead', id: 'cpbead13', line1: 'beadline13', line2: 'beadline14'},
              {'type': 'cross_point_bead', id: 'cpbead14', line1: 'beadline14', line2: 'beadline15'},
              {'type': 'cross_point_bead', id: 'cpbead15', line1: 'beadline15', line2: 'beadline16'},
              {'type': 'cross_point_bead', id: 'cpbead16', line1: 'beadline16', line2: 'beadline13'},
              {'type': 'bead_in_line', id:'beadinline13', from:'cpbead16', to:'cpbead13'},
              {'type': 'bead_in_line', id:'beadinline14', from:'cpbead13', to:'cpbead14'},
              {'type': 'bead_in_line', id:'beadinline15', from:'cpbead14', to:'cpbead15'},
              {'type': 'bead_in_line', id:'beadinline16', from:'cpbead15', to:'cpbead16'},


              //----- left glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline1', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},

              {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline4', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'frameline3', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
              //----- right glass
              {'type': 'cross_point_glass', id: 'cpg9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'impostcenterline5', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg11', line1: 'impostcenterline5', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
              {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
              {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
              {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},

              {'type': 'cross_point_glass', id: 'cpg13', line1: 'frameline2', line2: 'impostcenterline6', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg15', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg16', line1: 'impostcenterline2', line2: 'impostcenterline6', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline13', from: 'cpg16', to: 'cpg13'},
              {'type': 'glass_line', id: 'glassline14', from: 'cpg13', to: 'cpg14'},
              {'type': 'glass_line', id: 'glassline15', from: 'cpg14', to: 'cpg15'},
              {'type': 'glass_line', id: 'glassline16', from: 'cpg15', to: 'cpg16'},

              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
              {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},
              {'type': 'impost', id: 'impost3', parts: ['impostinline5', 'impostinline6']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
              {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
              {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
              {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

              {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
              {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
              {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
              {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

              {'type': 'bead_box', id:'bead13', parts: ['beadline13', 'beadinline13']},
              {'type': 'bead_box', id:'bead14', parts: ['beadline14', 'beadinline14']},
              {'type': 'bead_box', id:'bead15', parts: ['beadline15', 'beadinline15']},
              {'type': 'bead_box', id:'bead16', parts: ['beadline16', 'beadinline16']},

              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
              {'type': 'glass_paсkage', id: 'glass4', parts: ['glassline13', 'glassline14', 'glassline15', 'glassline16']},
              {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'dimV1', from: ['fp1', 'fp2'], to: ['fpimpost4', 'fpimpost3'], limits: ['overallDimV'], level: 1, height: 150, side: 'left'},
              {'type': 'dimensionsV', id: 'dimV2', from: ['fp2', 'fp1'], to: ['fpimpost5', 'fpimpost6'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1'], links: ['fpimpost5'], level: 3, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1', 'dimV2'], level: 2, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Одностворчатое',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
              {'type':'fixed_point', id:'fp2', x:'1060', y:'0'},
              {'type':'fixed_point', id:'fp3', x:'1060', y:'1320'},
              {'type':'fixed_point', id:'fp4', x:'0', y:'1320'},
              {'type':'fixed_point_impost', id:'fpimpost1', x:'1060', y:'300', dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:'0', y:'300', dir:'hor'},

              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
              //-------- impost
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
              {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
              {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
              {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
              {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
              {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
              {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
              {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
              {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
              {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
              {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
              {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

              //----- top glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //----- down glass
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},

              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
              {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
              {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
              {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'dimensionsV', id: 'dimV1', from: ['fp2', 'fp1'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], links: ['fpimpost1'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Трехстворчатое',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
              {'type':'fixed_point', id:'fp2', x:'1060', y:'0'},
              {'type':'fixed_point', id:'fp3', x:'1060', y:'1320'},
              {'type':'fixed_point', id:'fp4', x:'0', y:'1320'},
              {'type':'fixed_point_impost', id:'fpimpost1', x:'1060', y:'300', dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:'0', y:'300', dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost3', x:'530', y:'0', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost4', x:'530', y:'1320', dir:'vert'},

              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
              //-------- impost
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

              {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
              {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
              {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
              {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
              {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
              {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
              {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
              {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
              {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
              {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
              {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
              {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
              {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
              {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
              {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
              {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
              {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
              {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
              {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
              {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
              {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
              {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
              {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
              {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},


              //----- top glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //----- down glass
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},

              {'type': 'cross_point_glass', id: 'cpg9', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
              {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
              {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
              {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},

              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
              {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
              {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
              {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
              {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

              {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
              {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
              {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
              {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
              {'type': 'dimensionsH', id: 'dimH1', from: ['fp4', 'fp1'], to: ['fpimpost4', 'fpimpost3'], limits: ['overallDimH'], level: 1, height: 150, side: 'bottom'},
              {'type': 'dimensionsV', id: 'dimV1', from: ['fp2', 'fp1'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1'], links: ['fpimpost1'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Трехстворчатое',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
              {'type':'fixed_point', id:'fp2', x:'2100', y:'0'},
              {'type':'fixed_point', id:'fp3', x:'2100', y:'1400'},
              {'type':'fixed_point', id:'fp4', x:'0', y:'1400'},
              {'type':'fixed_point_impost', id:'fpimpost1', x:'2100', y:'300', dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:'0', y:'300', dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost3', x:'700', y:'0', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost4', x:'700', y:'1400', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost5', x:'1400', y:'0', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost6', x:'1400', y:'1400', dir:'vert'},

              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
              //-------- impost
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

              {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
              {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

              {'type': 'impost_line', id: 'impostcenterline5', from: 'fpimpost5', to: 'fpimpost6', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline6', from: 'fpimpost6', to: 'fpimpost5', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost10', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost11', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost12', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline5', from: 'cpimpost9', to: 'cpimpost12'},
              {'type': 'impost_in_line', id: 'impostinline6', from: 'cpimpost11', to: 'cpimpost10'},

              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
              {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
              {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
              {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
              {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
              {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
              {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
              {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
              {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
              {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
              {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
              {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
              {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
              {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
              {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
              {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
              {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
              {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
              {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
              {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
              {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
              {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
              {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout13', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout15', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout16', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline13', from:'cpbeadout16', to:'cpbeadout13'},
              {'type': 'bead_line', id:'beadline14', from:'cpbeadout13', to:'cpbeadout14'},
              {'type': 'bead_line', id:'beadline15', from:'cpbeadout14', to:'cpbeadout15'},
              {'type': 'bead_line', id:'beadline16', from:'cpbeadout15', to:'cpbeadout16'},
              {'type': 'cross_point_bead', id: 'cpbead13', line1: 'beadline13', line2: 'beadline14'},
              {'type': 'cross_point_bead', id: 'cpbead14', line1: 'beadline14', line2: 'beadline15'},
              {'type': 'cross_point_bead', id: 'cpbead15', line1: 'beadline15', line2: 'beadline16'},
              {'type': 'cross_point_bead', id: 'cpbead16', line1: 'beadline16', line2: 'beadline13'},
              {'type': 'bead_in_line', id:'beadinline13', from:'cpbead16', to:'cpbead13'},
              {'type': 'bead_in_line', id:'beadinline14', from:'cpbead13', to:'cpbead14'},
              {'type': 'bead_in_line', id:'beadinline15', from:'cpbead14', to:'cpbead15'},
              {'type': 'bead_in_line', id:'beadinline16', from:'cpbead15', to:'cpbead16'},

              //----- top glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //----- down glass
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},

              {'type': 'cross_point_glass', id: 'cpg9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg10', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
              {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
              {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
              {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},

              {'type': 'cross_point_glass', id: 'cpg13', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg15', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg16', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline13', from: 'cpg16', to: 'cpg13'},
              {'type': 'glass_line', id: 'glassline14', from: 'cpg13', to: 'cpg14'},
              {'type': 'glass_line', id: 'glassline15', from: 'cpg14', to: 'cpg15'},
              {'type': 'glass_line', id: 'glassline16', from: 'cpg15', to: 'cpg16'},

              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
              {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},
              {'type': 'impost', id: 'impost3', parts: ['impostinline5', 'impostinline6']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
              {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
              {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
              {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

              {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
              {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
              {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
              {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

              {'type': 'bead_box', id:'bead13', parts: ['beadline13', 'beadinline13']},
              {'type': 'bead_box', id:'bead14', parts: ['beadline14', 'beadinline14']},
              {'type': 'bead_box', id:'bead15', parts: ['beadline15', 'beadinline15']},
              {'type': 'bead_box', id:'bead16', parts: ['beadline16', 'beadinline16']},

              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
              {'type': 'glass_paсkage', id: 'glass4', parts: ['glassline13', 'glassline14', 'glassline15', 'glassline16']},
              {'type': 'dimensionsH', id: 'dimH1', from: ['fp4', 'fp1'], to: ['fpimpost4', 'fpimpost3'], limits: ['overallDimH', 'dimH3'], links: ['fpimpost4', 'fpimpost3'], level: 1, height: 150, side: 'bottom'},
              {'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost4', 'fpimpost3'], to: ['fpimpost6', 'fpimpost5'], limits: ['overallDimH', 'dimH1'], links: ['fpimpost6', 'fpimpost5'], level: 1, height: 150, side: 'bottom'},
              {'type': 'dimensionsH', id: 'dimH3', from: ['fpimpost6', 'fpimpost5'], to: ['fp3', 'fp2'], level: 1, height: 150, side: 'bottom'},
              {'type': 'dimensionsV', id: 'dimV1', from: ['fp2', 'fp1'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1', 'dimH2'], links: ['fpimpost1'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Трехстворчатое',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
              {'type':'fixed_point', id:'fp2', x:'2100', y:'0'},
              {'type':'fixed_point', id:'fp3', x:'2100', y:'1400'},
              {'type':'fixed_point', id:'fp4', x:'0', y:'1400'},
              {'type':'fixed_point_impost', id:'fpimpost1', x:'2100', y:'300', dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:'0', y:'300', dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost3', x:'700', y:'0', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost4', x:'700', y:'1400', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost5', x:'1400', y:'0', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost6', x:'1400', y:'1400', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost7', x:'1050', y:'0', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost8', x:'1050', y:'1400', dir:'vert'},

              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
              //-------- impost
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

              {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
              {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

              {'type': 'impost_line', id: 'impostcenterline5', from: 'fpimpost5', to: 'fpimpost6', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline6', from: 'fpimpost6', to: 'fpimpost5', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost10', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost11', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost12', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline5', from: 'cpimpost9', to: 'cpimpost12'},
              {'type': 'impost_in_line', id: 'impostinline6', from: 'cpimpost11', to: 'cpimpost10'},

              {'type': 'impost_line', id: 'impostcenterline7', from: 'fpimpost7', to: 'fpimpost8', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline8', from: 'fpimpost8', to: 'fpimpost7', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost13', line1: 'frameline1', line2: 'impostcenterline7', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost14', line1: 'impostcenterline8', line2: 'frameline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost15', line1: 'impostcenterline1', line2: 'impostcenterline8', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost16', line1: 'impostcenterline7', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline7', from: 'cpimpost13', to: 'cpimpost16'},
              {'type': 'impost_in_line', id: 'impostinline8', from: 'cpimpost15', to: 'cpimpost14'},

              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline7', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline7', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
              {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
              {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
              {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
              {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
              {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
              {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
              {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
              {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
              {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
              {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
              {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
              {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
              {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
              {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
              {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
              {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
              {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
              {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
              {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
              {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
              {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
              {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout13', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout15', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout16', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline13', from:'cpbeadout16', to:'cpbeadout13'},
              {'type': 'bead_line', id:'beadline14', from:'cpbeadout13', to:'cpbeadout14'},
              {'type': 'bead_line', id:'beadline15', from:'cpbeadout14', to:'cpbeadout15'},
              {'type': 'bead_line', id:'beadline16', from:'cpbeadout15', to:'cpbeadout16'},
              {'type': 'cross_point_bead', id: 'cpbead13', line1: 'beadline13', line2: 'beadline14'},
              {'type': 'cross_point_bead', id: 'cpbead14', line1: 'beadline14', line2: 'beadline15'},
              {'type': 'cross_point_bead', id: 'cpbead15', line1: 'beadline15', line2: 'beadline16'},
              {'type': 'cross_point_bead', id: 'cpbead16', line1: 'beadline16', line2: 'beadline13'},
              {'type': 'bead_in_line', id:'beadinline13', from:'cpbead16', to:'cpbead13'},
              {'type': 'bead_in_line', id:'beadinline14', from:'cpbead13', to:'cpbead14'},
              {'type': 'bead_in_line', id:'beadinline15', from:'cpbead14', to:'cpbead15'},
              {'type': 'bead_in_line', id:'beadinline16', from:'cpbead15', to:'cpbead16'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout17', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout18', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout19', line1: 'impostcenterline1', line2: 'impostcenterline8', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout20', line1: 'impostcenterline8', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline17', from:'cpbeadout20', to:'cpbeadout17'},
              {'type': 'bead_line', id:'beadline18', from:'cpbeadout17', to:'cpbeadout18'},
              {'type': 'bead_line', id:'beadline19', from:'cpbeadout18', to:'cpbeadout19'},
              {'type': 'bead_line', id:'beadline20', from:'cpbeadout19', to:'cpbeadout20'},
              {'type': 'cross_point_bead', id: 'cpbead17', line1: 'beadline17', line2: 'beadline18'},
              {'type': 'cross_point_bead', id: 'cpbead18', line1: 'beadline18', line2: 'beadline19'},
              {'type': 'cross_point_bead', id: 'cpbead19', line1: 'beadline19', line2: 'beadline20'},
              {'type': 'cross_point_bead', id: 'cpbead20', line1: 'beadline20', line2: 'beadline17'},
              {'type': 'bead_in_line', id:'beadinline17', from:'cpbead20', to:'cpbead17'},
              {'type': 'bead_in_line', id:'beadinline18', from:'cpbead17', to:'cpbead18'},
              {'type': 'bead_in_line', id:'beadinline19', from:'cpbead18', to:'cpbead19'},
              {'type': 'bead_in_line', id:'beadinline20', from:'cpbead19', to:'cpbead20'},

              //----- top glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline7', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline7', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //----- down glass
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},

              {'type': 'cross_point_glass', id: 'cpg9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg10', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
              {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
              {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
              {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},

              {'type': 'cross_point_glass', id: 'cpg13', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg15', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg16', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline13', from: 'cpg16', to: 'cpg13'},
              {'type': 'glass_line', id: 'glassline14', from: 'cpg13', to: 'cpg14'},
              {'type': 'glass_line', id: 'glassline15', from: 'cpg14', to: 'cpg15'},
              {'type': 'glass_line', id: 'glassline16', from: 'cpg15', to: 'cpg16'},
              //------ top left glass
              {'type': 'cross_point_glass', id: 'cpg17', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg18', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg19', line1: 'impostcenterline1', line2: 'impostcenterline8', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg20', line1: 'impostcenterline8', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline17', from: 'cpg20', to: 'cpg17'},
              {'type': 'glass_line', id: 'glassline18', from: 'cpg17', to: 'cpg18'},
              {'type': 'glass_line', id: 'glassline19', from: 'cpg18', to: 'cpg19'},
              {'type': 'glass_line', id: 'glassline20', from: 'cpg19', to: 'cpg20'},

              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
              {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},
              {'type': 'impost', id: 'impost3', parts: ['impostinline5', 'impostinline6']},
              {'type': 'impost', id: 'impost4', parts: ['impostinline7', 'impostinline8']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
              {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
              {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
              {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

              {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
              {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
              {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
              {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

              {'type': 'bead_box', id:'bead13', parts: ['beadline13', 'beadinline13']},
              {'type': 'bead_box', id:'bead14', parts: ['beadline14', 'beadinline14']},
              {'type': 'bead_box', id:'bead15', parts: ['beadline15', 'beadinline15']},
              {'type': 'bead_box', id:'bead16', parts: ['beadline16', 'beadinline16']},

              {'type': 'bead_box', id:'bead17', parts: ['beadline17', 'beadinline17']},
              {'type': 'bead_box', id:'bead18', parts: ['beadline18', 'beadinline18']},
              {'type': 'bead_box', id:'bead19', parts: ['beadline19', 'beadinline19']},
              {'type': 'bead_box', id:'bead20', parts: ['beadline20', 'beadinline20']},

              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
              {'type': 'glass_paсkage', id: 'glass4', parts: ['glassline13', 'glassline14', 'glassline15', 'glassline16']},
              {'type': 'glass_paсkage', id: 'glass5', parts: ['glassline17', 'glassline18', 'glassline19', 'glassline20']},
              {'type': 'dimensionsH', id: 'dimH1', from: ['fp4', 'fp1'], to: ['fpimpost4', 'fpimpost3'], limits: ['overallDimH', 'dimH3'], links: ['fpimpost4', 'fpimpost3'], level: 1, height: 150, side: 'bottom'},
              {'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost4', 'fpimpost3'], to: ['fpimpost6', 'fpimpost5'], limits: ['overallDimH', 'dimH1'], links: ['fpimpost6', 'fpimpost5'], level: 1, height: 150, side: 'bottom'},
              {'type': 'dimensionsH', id: 'dimH3', from: ['fpimpost6', 'fpimpost5'], to: ['fp3', 'fp2'], level: 1, height: 150, side: 'bottom'},
              {'type': 'dimensionsH', id: 'dimH4', from: ['fp1', 'fp4'], to: ['fpimpost7', 'fpimpost8'], limits: ['overallDimH'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'dimV1', from: ['fp2', 'fp1'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1', 'dimH2', 'dimH4'], links: ['fpimpost1'], level: 3, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Трехстворчатое',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
              {'type':'fixed_point', id:'fp2', x:'2100', y:'0'},
              {'type':'fixed_point', id:'fp3', x:'2100', y:'1400'},
              {'type':'fixed_point', id:'fp4', x:'0', y:'1400'},
              {'type':'fixed_point_impost', id:'fpimpost1', x:'2100', y:'300', dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:'0', y:'300', dir:'hor'},
              {'type':'fixed_point_impost', id:'fpimpost3', x:'700', y:'0', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost4', x:'700', y:'1400', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost5', x:'1400', y:'0', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost6', x:'1400', y:'1400', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost7', x:'700', y:'0', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost8', x:'700', y:'1400', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost9', x:'1400', y:'0', dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost10', x:'1400', y:'1400', dir:'vert'},

              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
              //-------- impost
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

              {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
              {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

              {'type': 'impost_line', id: 'impostcenterline5', from: 'fpimpost5', to: 'fpimpost6', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline6', from: 'fpimpost6', to: 'fpimpost5', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost10', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost11', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost12', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline5', from: 'cpimpost9', to: 'cpimpost12'},
              {'type': 'impost_in_line', id: 'impostinline6', from: 'cpimpost11', to: 'cpimpost10'},

              {'type': 'impost_line', id: 'impostcenterline7', from: 'fpimpost7', to: 'fpimpost8', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline8', from: 'fpimpost8', to: 'fpimpost7', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost13', line1: 'frameline1', line2: 'impostcenterline7', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost14', line1: 'impostcenterline8', line2: 'frameline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost15', line1: 'impostcenterline1', line2: 'impostcenterline8', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost16', line1: 'impostcenterline7', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline7', from: 'cpimpost13', to: 'cpimpost16'},
              {'type': 'impost_in_line', id: 'impostinline8', from: 'cpimpost15', to: 'cpimpost14'},

              {'type': 'impost_line', id: 'impostcenterline9', from: 'fpimpost9', to: 'fpimpost10', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline10', from: 'fpimpost10', to: 'fpimpost9', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost17', line1: 'frameline1', line2: 'impostcenterline9', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost18', line1: 'impostcenterline10', line2: 'frameline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost19', line1: 'impostcenterline1', line2: 'impostcenterline10', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost20', line1: 'impostcenterline9', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline9', from: 'cpimpost17', to: 'cpimpost20'},
              {'type': 'impost_in_line', id: 'impostinline10', from: 'cpimpost19', to: 'cpimpost18'},

              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline7', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline7', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
              {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
              {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
              {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
              {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
              {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
              {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
              {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
              {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
              {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
              {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
              {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
              {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
              {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
              {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
              {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
              {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
              {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
              {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
              {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
              {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
              {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
              {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout13', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout15', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout16', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline13', from:'cpbeadout16', to:'cpbeadout13'},
              {'type': 'bead_line', id:'beadline14', from:'cpbeadout13', to:'cpbeadout14'},
              {'type': 'bead_line', id:'beadline15', from:'cpbeadout14', to:'cpbeadout15'},
              {'type': 'bead_line', id:'beadline16', from:'cpbeadout15', to:'cpbeadout16'},
              {'type': 'cross_point_bead', id: 'cpbead13', line1: 'beadline13', line2: 'beadline14'},
              {'type': 'cross_point_bead', id: 'cpbead14', line1: 'beadline14', line2: 'beadline15'},
              {'type': 'cross_point_bead', id: 'cpbead15', line1: 'beadline15', line2: 'beadline16'},
              {'type': 'cross_point_bead', id: 'cpbead16', line1: 'beadline16', line2: 'beadline13'},
              {'type': 'bead_in_line', id:'beadinline13', from:'cpbead16', to:'cpbead13'},
              {'type': 'bead_in_line', id:'beadinline14', from:'cpbead13', to:'cpbead14'},
              {'type': 'bead_in_line', id:'beadinline15', from:'cpbead14', to:'cpbead15'},
              {'type': 'bead_in_line', id:'beadinline16', from:'cpbead15', to:'cpbead16'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout17', line1: 'frameline1', line2: 'impostcenterline9', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout18', line1: 'impostcenterline9', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout19', line1: 'impostcenterline1', line2: 'impostcenterline8', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout20', line1: 'impostcenterline8', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline17', from:'cpbeadout20', to:'cpbeadout17'},
              {'type': 'bead_line', id:'beadline18', from:'cpbeadout17', to:'cpbeadout18'},
              {'type': 'bead_line', id:'beadline19', from:'cpbeadout18', to:'cpbeadout19'},
              {'type': 'bead_line', id:'beadline20', from:'cpbeadout19', to:'cpbeadout20'},
              {'type': 'cross_point_bead', id: 'cpbead17', line1: 'beadline17', line2: 'beadline18'},
              {'type': 'cross_point_bead', id: 'cpbead18', line1: 'beadline18', line2: 'beadline19'},
              {'type': 'cross_point_bead', id: 'cpbead19', line1: 'beadline19', line2: 'beadline20'},
              {'type': 'cross_point_bead', id: 'cpbead20', line1: 'beadline20', line2: 'beadline17'},
              {'type': 'bead_in_line', id:'beadinline17', from:'cpbead20', to:'cpbead17'},
              {'type': 'bead_in_line', id:'beadinline18', from:'cpbead17', to:'cpbead18'},
              {'type': 'bead_in_line', id:'beadinline19', from:'cpbead18', to:'cpbead19'},
              {'type': 'bead_in_line', id:'beadinline20', from:'cpbead19', to:'cpbead20'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout21', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout22', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout23', line1: 'impostcenterline1', line2: 'impostcenterline10', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout24', line1: 'impostcenterline10', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline21', from:'cpbeadout24', to:'cpbeadout21'},
              {'type': 'bead_line', id:'beadline22', from:'cpbeadout21', to:'cpbeadout22'},
              {'type': 'bead_line', id:'beadline23', from:'cpbeadout22', to:'cpbeadout23'},
              {'type': 'bead_line', id:'beadline24', from:'cpbeadout23', to:'cpbeadout24'},
              {'type': 'cross_point_bead', id: 'cpbead21', line1: 'beadline21', line2: 'beadline22'},
              {'type': 'cross_point_bead', id: 'cpbead22', line1: 'beadline22', line2: 'beadline23'},
              {'type': 'cross_point_bead', id: 'cpbead23', line1: 'beadline23', line2: 'beadline24'},
              {'type': 'cross_point_bead', id: 'cpbead24', line1: 'beadline24', line2: 'beadline21'},
              {'type': 'bead_in_line', id:'beadinline21', from:'cpbead24', to:'cpbead21'},
              {'type': 'bead_in_line', id:'beadinline22', from:'cpbead21', to:'cpbead22'},
              {'type': 'bead_in_line', id:'beadinline23', from:'cpbead22', to:'cpbead23'},
              {'type': 'bead_in_line', id:'beadinline24', from:'cpbead23', to:'cpbead24'},

              //----- top glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline7', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline7', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //----- down glass
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},

              {'type': 'cross_point_glass', id: 'cpg9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg10', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
              {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
              {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
              {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},

              {'type': 'cross_point_glass', id: 'cpg13', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg15', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg16', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline13', from: 'cpg16', to: 'cpg13'},
              {'type': 'glass_line', id: 'glassline14', from: 'cpg13', to: 'cpg14'},
              {'type': 'glass_line', id: 'glassline15', from: 'cpg14', to: 'cpg15'},
              {'type': 'glass_line', id: 'glassline16', from: 'cpg15', to: 'cpg16'},
              //------ top left glass
              {'type': 'cross_point_glass', id: 'cpg17', line1: 'frameline1', line2: 'impostcenterline9', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg18', line1: 'impostcenterline9', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg19', line1: 'impostcenterline1', line2: 'impostcenterline8', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg20', line1: 'impostcenterline8', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline17', from: 'cpg20', to: 'cpg17'},
              {'type': 'glass_line', id: 'glassline18', from: 'cpg17', to: 'cpg18'},
              {'type': 'glass_line', id: 'glassline19', from: 'cpg18', to: 'cpg19'},
              {'type': 'glass_line', id: 'glassline20', from: 'cpg19', to: 'cpg20'},

              {'type': 'cross_point_glass', id: 'cpg21', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg22', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg23', line1: 'impostcenterline1', line2: 'impostcenterline10', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg24', line1: 'impostcenterline10', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline21', from: 'cpg24', to: 'cpg21'},
              {'type': 'glass_line', id: 'glassline22', from: 'cpg21', to: 'cpg22'},
              {'type': 'glass_line', id: 'glassline23', from: 'cpg22', to: 'cpg23'},
              {'type': 'glass_line', id: 'glassline24', from: 'cpg23', to: 'cpg24'},

              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
              {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},
              {'type': 'impost', id: 'impost3', parts: ['impostinline5', 'impostinline6']},
              {'type': 'impost', id: 'impost4', parts: ['impostinline7', 'impostinline8']},
              {'type': 'impost', id: 'impost5', parts: ['impostinline9', 'impostinline10']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
              {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
              {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
              {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

              {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
              {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
              {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
              {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

              {'type': 'bead_box', id:'bead13', parts: ['beadline13', 'beadinline13']},
              {'type': 'bead_box', id:'bead14', parts: ['beadline14', 'beadinline14']},
              {'type': 'bead_box', id:'bead15', parts: ['beadline15', 'beadinline15']},
              {'type': 'bead_box', id:'bead16', parts: ['beadline16', 'beadinline16']},

              {'type': 'bead_box', id:'bead17', parts: ['beadline17', 'beadinline17']},
              {'type': 'bead_box', id:'bead18', parts: ['beadline18', 'beadinline18']},
              {'type': 'bead_box', id:'bead19', parts: ['beadline19', 'beadinline19']},
              {'type': 'bead_box', id:'bead20', parts: ['beadline20', 'beadinline20']},

              {'type': 'bead_box', id:'bead21', parts: ['beadline21', 'beadinline21']},
              {'type': 'bead_box', id:'bead22', parts: ['beadline22', 'beadinline22']},
              {'type': 'bead_box', id:'bead23', parts: ['beadline23', 'beadinline23']},
              {'type': 'bead_box', id:'bead24', parts: ['beadline24', 'beadinline24']},

              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
              {'type': 'glass_paсkage', id: 'glass4', parts: ['glassline13', 'glassline14', 'glassline15', 'glassline16']},
              {'type': 'glass_paсkage', id: 'glass5', parts: ['glassline17', 'glassline18', 'glassline19', 'glassline20']},
              {'type': 'glass_paсkage', id: 'glass6', parts: ['glassline21', 'glassline22', 'glassline23', 'glassline24']},
              {'type': 'dimensionsH', id: 'dimH1', from: ['fp4', 'fp1'], to: ['fpimpost4', 'fpimpost3'], limits: ['overallDimH', 'dimH3'], links: ['fpimpost4', 'fpimpost3'], level: 1, height: 150, side: 'bottom'},
              {'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost4', 'fpimpost3'], to: ['fpimpost6', 'fpimpost5'], limits: ['overallDimH', 'dimH1'], links: ['fpimpost6', 'fpimpost5'], level: 1, height: 150, side: 'bottom'},
              {'type': 'dimensionsH', id: 'dimH3', from: ['fpimpost6', 'fpimpost5'], to: ['fp3', 'fp2'], level: 1, height: 150, side: 'bottom'},
              {'type': 'dimensionsH', id: 'dimH4', from: ['fp1', 'fp4'], to: ['fpimpost7', 'fpimpost8'], limits: ['overallDimH', 'dimH6'], links: ['fpimpost7', 'fpimpost8'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsH', id: 'dimH5', from: ['fpimpost7', 'fpimpost8'], to: ['fpimpost9', 'fpimpost10'], limits: ['overallDimH', 'dimH4'], links: ['fpimpost9', 'fpimpost10'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsH', id: 'dimH6', from: ['fpimpost9', 'fpimpost10'], to: ['fp2', 'fp3'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'dimV1', from: ['fp2', 'fp1'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1', 'dimH2', 'dimH4'], links: ['fpimpost1'], level: 3, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          }

        ],
        windowDoor: [
          {
            'name':'Выход на балкон',
            'objects':[
              //------- main points

              {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
              {'type':'fixed_point', id:'fp2', x:'1300', y:'0'},
              {'type':'fixed_point', id:'fp3', x:'1300', y:'1400'},
              {'type':'fixed_point', id:'fp4', x:'0', y:'1400'},
              {'type':'fixed_point', id:'fp5', x:'1300', y: '0'},
              {'type':'fixed_point', id:'fp6', x:'2000', y:'0'},
              {'type':'fixed_point', id:'fp7', x:'2000', y:'2100'},
              {'type':'fixed_point', id:'fp8', x:'1300', y:'2100'},
              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},

              {'type': 'frame_line', id: 'frameline5', from: 'fp5', to: 'fp6'},
              {'type': 'frame_line', id: 'frameline6', from: 'fp6', to: 'fp7'},
              {'type': 'frame_line', id: 'frameline7', from: 'fp7', to: 'fp8', sill: true},
              {'type': 'frame_line', id: 'frameline8', from: 'fp8', to: 'fp5'},
              {'type': 'cross_point', id: 'cp5', line1: 'frameline5', line2: 'frameline6'},
              {'type': 'cross_point', id: 'cp6', line1: 'frameline6', line2: 'frameline7'},
              {'type': 'cross_point', id: 'cp7', line1: 'frameline7', line2: 'frameline8'},
              {'type': 'cross_point', id: 'cp8', line1: 'frameline8', line2: 'frameline5'},
              {'type': 'frame_in_line', id: 'frameinline5', from: 'cp8', to: 'cp5'},
              {'type': 'frame_in_line', id: 'frameinline6', from: 'cp5', to: 'cp6'},
              {'type': 'frame_in_line', id: 'frameinline7', from: 'cp6', to: 'cp7'},
              {'type': 'frame_in_line', id: 'frameinline8', from: 'cp7', to: 'cp8'},

              //-------- sash
              {'type': 'cross_point_sash_out', id: 'cpsout5', line1: 'frameline5', line2: 'frameline6'},
              {'type': 'cross_point_sash_out', id: 'cpsout6', line1: 'frameline6', line2: 'frameline7'},
              {'type': 'cross_point_sash_out', id: 'cpsout7', line1: 'frameline7', line2: 'frameline8'},
              {'type': 'cross_point_sash_out', id: 'cpsout8', line1: 'frameline8', line2: 'frameline5'},
              {'type': 'sash_out_line', id: 'sashoutline5', from: 'cpsout8', to: 'cpsout5'},
              {'type': 'sash_out_line', id: 'sashoutline6', from: 'cpsout5', to: 'cpsout6'},
              {'type': 'sash_out_line', id: 'sashoutline7', from: 'cpsout6', to: 'cpsout7'},
              {'type': 'sash_out_line', id: 'sashoutline8', from: 'cpsout7', to: 'cpsout8'},

              {'type': 'cross_point_hardware', id: 'cphw5', line1: 'sashoutline5', line2: 'sashoutline6'},
              {'type': 'cross_point_hardware', id: 'cphw6', line1: 'sashoutline6', line2: 'sashoutline7'},
              {'type': 'cross_point_hardware', id: 'cphw7', line1: 'sashoutline7', line2: 'sashoutline8'},
              {'type': 'cross_point_hardware', id: 'cphw8', line1: 'sashoutline8', line2: 'sashoutline5'},
              {'type': 'hardware_line', id: 'hardwareline5', from: 'cphw8', to: 'cphw5'},
              {'type': 'hardware_line', id: 'hardwareline6', from: 'cphw5', to: 'cphw6'},
              {'type': 'hardware_line', id: 'hardwareline7', from: 'cphw6', to: 'cphw7'},
              {'type': 'hardware_line', id: 'hardwareline8', from: 'cphw7', to: 'cphw8'},

              {'type': 'cross_point_sash_in', id: 'cpsin5', line1: 'sashoutline5', line2: 'sashoutline6'},
              {'type': 'cross_point_sash_in', id: 'cpsin6', line1: 'sashoutline6', line2: 'sashoutline7'},
              {'type': 'cross_point_sash_in', id: 'cpsin7', line1: 'sashoutline7', line2: 'sashoutline8'},
              {'type': 'cross_point_sash_in', id: 'cpsin8', line1: 'sashoutline8', line2: 'sashoutline5'},
              {'type': 'sash_line', id: 'sashline5', from: 'cpsin8', to: 'cpsin5'},
              {'type': 'sash_line', id: 'sashline6', from: 'cpsin5', to: 'cpsin6'},
              {'type': 'sash_line', id: 'sashline7', from: 'cpsin6', to: 'cpsin7'},
              {'type': 'sash_line', id: 'sashline8', from: 'cpsin7', to: 'cpsin8'},
              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'frameline5', line2: 'frameline6', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'frameline6', line2: 'frameline7', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline7', line2: 'frameline8', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline8', line2: 'frameline5', blockType: 'sash'},
              {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
              {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
              {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
              {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
              {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
              {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
              {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
              {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
              {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
              {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
              {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
              {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},
              //----- left glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //----- right glass
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameline5', line2: 'frameline6', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'frameline6', line2: 'frameline7', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline7', line2: 'frameline8', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline8', line2: 'frameline5', blockType: 'sash'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'frame', id: 'frame5', parts: ['frameline5', 'frameinline5']},
              {'type': 'frame', id: 'frame6', parts: ['frameline6', 'frameinline6']},
              {'type': 'frame', id: 'frame7', parts: ['frameline7', 'frameinline7']},
              {'type': 'frame', id: 'frame8', parts: ['frameline8', 'frameinline8']},
              {'type': 'sash', id: 'sash5', parts: ['sashoutline5', 'sashline5']},
              {'type': 'sash', id: 'sash6', parts: ['sashoutline6', 'sashline6'], openType: ['sashline6', 'sashline8']},
              {'type': 'sash', id: 'sash7', parts: ['sashoutline7', 'sashline7'], openType: ['sashline7', 'sashline5']},
              {'type': 'sash', id: 'sash8', parts: ['sashoutline8', 'sashline8']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
              {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
              {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
              {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

              {'type': 'sash_block', id: 'sashBlock2', parts: ['hardwareline5', 'hardwareline6', 'hardwareline7', 'hardwareline8'], openDir: [1, 4], handlePos: 4},
              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['overallDimH'],  links: ['fp5', 'fp8'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'dimV1', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
              {'type': 'dimensionsH', id: 'dimH2', from: ['fp5', 'fp8'], to: ['fp6', 'fp7'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp6', 'fp5'], to: ['fp7', 'fp8'], level: 1, height: 150, side: 'right'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp6', 'fp7'], limits: ['dimH1'], level: 3, height: 150, side: 'top'},
              {'type': 'square', id: 'sqr', widths: ['dimH1', 'dimH2'], heights: ['dimV1', 'overallDimV']}
            ]
          }
        ],

        balconies: [
          {
            'name':'Трехстворчатое',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:0, y:0},
              {'type':'fixed_point', id:'fp2', x:2100, y:0},
              {'type':'fixed_point', id:'fp3', x:2100, y:1400},
              {'type':'fixed_point', id:'fp4', x:0, y:1400},
              {'type':'fixed_point_impost', id:'fpimpost1', x:700, y:0, dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:700, y:1400, dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost3', x:1400, y:0, dir:'vert'},
              {'type':'fixed_point_impost', id:'fpimpost4', x:1400, y:1400, dir:'vert'},
              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
              //-------- impost
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'sash'},
              {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'sash'},
              {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},

              {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'frameline1', line2: 'impostcenterline3', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},
              {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
              {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},
              //-------- sash
              {'type': 'cross_point_sash_out', id: 'cpsout5', line1: 'frameline1', line2: 'impostcenterline3'},
              {'type': 'cross_point_sash_out', id: 'cpsout6', line1: 'impostcenterline3', line2: 'frameline3'},
              {'type': 'cross_point_sash_out', id: 'cpsout7', line1: 'frameline3', line2: 'impostcenterline2'},
              {'type': 'cross_point_sash_out', id: 'cpsout8', line1: 'impostcenterline2', line2: 'frameline1'},
              {'type': 'sash_out_line', id: 'sashoutline5', from: 'cpsout8', to: 'cpsout5'},
              {'type': 'sash_out_line', id: 'sashoutline6', from: 'cpsout5', to: 'cpsout6'},
              {'type': 'sash_out_line', id: 'sashoutline7', from: 'cpsout6', to: 'cpsout7'},
              {'type': 'sash_out_line', id: 'sashoutline8', from: 'cpsout7', to: 'cpsout8'},

              {'type': 'cross_point_hardware', id: 'cphw5', line1: 'sashoutline5', line2: 'sashoutline6'},
              {'type': 'cross_point_hardware', id: 'cphw6', line1: 'sashoutline6', line2: 'sashoutline7'},
              {'type': 'cross_point_hardware', id: 'cphw7', line1: 'sashoutline7', line2: 'sashoutline8'},
              {'type': 'cross_point_hardware', id: 'cphw8', line1: 'sashoutline8', line2: 'sashoutline5'},
              {'type': 'hardware_line', id: 'hardwareline5', from: 'cphw8', to: 'cphw5'},
              {'type': 'hardware_line', id: 'hardwareline6', from: 'cphw5', to: 'cphw6'},
              {'type': 'hardware_line', id: 'hardwareline7', from: 'cphw6', to: 'cphw7'},
              {'type': 'hardware_line', id: 'hardwareline8', from: 'cphw7', to: 'cphw8'},

              {'type': 'cross_point_sash_in', id: 'cpsin5', line1: 'sashoutline5', line2: 'sashoutline6'},
              {'type': 'cross_point_sash_in', id: 'cpsin6', line1: 'sashoutline6', line2: 'sashoutline7'},
              {'type': 'cross_point_sash_in', id: 'cpsin7', line1: 'sashoutline7', line2: 'sashoutline8'},
              {'type': 'cross_point_sash_in', id: 'cpsin8', line1: 'sashoutline8', line2: 'sashoutline5'},
              {'type': 'sash_line', id: 'sashline5', from: 'cpsin8', to: 'cpsin5'},
              {'type': 'sash_line', id: 'sashline6', from: 'cpsin5', to: 'cpsin6'},
              {'type': 'sash_line', id: 'sashline7', from: 'cpsin6', to: 'cpsin7'},
              {'type': 'sash_line', id: 'sashline8', from: 'cpsin7', to: 'cpsin8'},

              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'frameline1', line2: 'impostcenterline3', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'sash'},
              {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
              {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
              {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
              {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
              {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
              {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
              {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
              {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
              {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
              {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
              {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
              {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

              {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
              {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
              {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
              {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
              {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
              {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
              {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
              {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
              {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
              {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
              {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
              {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

              //---- left glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //----- center glass
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameline1', line2: 'impostcenterline3', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'sash'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
              //------ right glass
              {'type': 'cross_point_glass', id: 'cpg9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
              {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline4', line2: 'frameline1', blockType: 'frame'},
              {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
              {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
              {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
              {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},
              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
              {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},
              {'type': 'sash', id: 'sash5', parts: ['sashoutline5', 'sashline5']},
              {'type': 'sash', id: 'sash6', parts: ['sashoutline6', 'sashline6'], openType: ['sashline6', 'sashline8']},
              {'type': 'sash', id: 'sash7', parts: ['sashoutline7', 'sashline7'], openType: ['sashline7', 'sashline5']},
              {'type': 'sash', id: 'sash8', parts: ['sashoutline8', 'sashline8']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
              {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
              {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
              {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

              {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
              {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
              {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
              {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

              {'type': 'sash_block', id: 'sashBlock2', parts: ['hardwareline5', 'hardwareline6', 'hardwareline7', 'hardwareline8'], openDir: [1, 4], handlePos: 4},
              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},

              {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH', 'dimH3'], links: ['fpimpost1', 'fpimpost2'], level: 1, side: 'top'},
              {'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost1', 'fpimpost2'], to: ['fpimpost3', 'fpimpost4'], limits: ['overallDimH', 'dimH1'], links: ['fpimpost3', 'fpimpost4'], level: 1, side: 'top'},
              {'type': 'dimensionsH', id: 'dimH3', from: ['fpimpost3', 'fpimpost4'], to: ['fp2', 'fp3'], level: 1, side: 'top'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1', 'dimH2'], level: 3, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          }

        ],

        doors: [
          {
            'name': 'Одностворчатая',
            'objects': [
              //------- main points
              {'type': 'fixed_point', id: 'fp1', x: '0', y: '0'},
              {'type': 'fixed_point', id: 'fp2', x: '700', y: '0'},
              {'type': 'fixed_point', id: 'fp3', x: '700', y: '2100'},
              {'type': 'fixed_point', id: 'fp4', x: '0', y: '2100'},
              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
              {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
              {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
              {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
              {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
              {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},

              //-------- sash
              {'type': 'cross_point_sash_out', id: 'cpsout1', line1: 'frameline1', line2: 'frameline2'},
              {'type': 'cross_point_sash_out', id: 'cpsout2', line1: 'frameline2', line2: 'frameline3'},
              {'type': 'cross_point_sash_out', id: 'cpsout3', line1: 'frameline3', line2: 'frameline4'},
              {'type': 'cross_point_sash_out', id: 'cpsout4', line1: 'frameline4', line2: 'frameline1'},
              {'type': 'sash_out_line', id: 'sashoutline1', from: 'cpsout4', to: 'cpsout1'},
              {'type': 'sash_out_line', id: 'sashoutline2', from: 'cpsout1', to: 'cpsout2'},
              {'type': 'sash_out_line', id: 'sashoutline3', from: 'cpsout2', to: 'cpsout3'},
              {'type': 'sash_out_line', id: 'sashoutline4', from: 'cpsout3', to: 'cpsout4'},

              {'type': 'cross_point_hardware', id: 'cphw1', line1: 'sashoutline1', line2: 'sashoutline2'},
              {'type': 'cross_point_hardware', id: 'cphw2', line1: 'sashoutline2', line2: 'sashoutline3'},
              {'type': 'cross_point_hardware', id: 'cphw3', line1: 'sashoutline3', line2: 'sashoutline4'},
              {'type': 'cross_point_hardware', id: 'cphw4', line1: 'sashoutline4', line2: 'sashoutline1'},
              {'type': 'hardware_line', id: 'hardwareline1', from: 'cphw4', to: 'cphw1'},
              {'type': 'hardware_line', id: 'hardwareline2', from: 'cphw1', to: 'cphw2'},
              {'type': 'hardware_line', id: 'hardwareline3', from: 'cphw2', to: 'cphw3'},
              {'type': 'hardware_line', id: 'hardwareline4', from: 'cphw3', to: 'cphw4'},

              {'type': 'cross_point_sash_in', id: 'cpsin1', line1: 'sashoutline1', line2: 'sashoutline2'},
              {'type': 'cross_point_sash_in', id: 'cpsin2', line1: 'sashoutline2', line2: 'sashoutline3'},
              {'type': 'cross_point_sash_in', id: 'cpsin3', line1: 'sashoutline3', line2: 'sashoutline4'},
              {'type': 'cross_point_sash_in', id: 'cpsin4', line1: 'sashoutline4', line2: 'sashoutline1'},
              {'type': 'sash_line', id: 'sashline1', from: 'cpsin4', to: 'cpsin1'},
              {'type': 'sash_line', id: 'sashline2', from: 'cpsin1', to: 'cpsin2'},
              {'type': 'sash_line', id: 'sashline3', from: 'cpsin2', to: 'cpsin3'},
              {'type': 'sash_line', id: 'sashline4', from: 'cpsin3', to: 'cpsin4'},

              //----------- bead box
              {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'frameline3', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'sash'},
              {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'sash'},
              {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
              {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
              {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
              {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
              {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
              {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
              {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
              {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

              //----- glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'frameline3', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'sash'},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //------- essential parts
              {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
              {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
              {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
              {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
              {'type': 'sash', id: 'sash1', parts: ['sashoutline1', 'sashline1']},
              {'type': 'sash', id: 'sash2', parts: ['sashoutline2', 'sashline2'], openType: ['sashline2', 'sashline4']},
              {'type': 'sash', id: 'sash3', parts: ['sashoutline3', 'sashline3'], openType: ['sashline3', 'sashline1']},
              {'type': 'sash', id: 'sash4', parts: ['sashoutline4', 'sashline4']},

              {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
              {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
              {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
              {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

              {'type': 'sash_block', id: 'sashBlock1', parts: ['hardwareline1', 'hardwareline2', 'hardwareline3', 'hardwareline4'], openDir: [1, 4], handlePos: 4},
              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          }
        ]
      }));
    },
/*
    getTemplatePrice: function(profileId, callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      var self = this;
      db.transaction(function (transaction) {
        transaction.executeSql(selectUser, [loginData.login, self.md5(loginData.password)], function (transaction, result) {
          console.log(result.rows.item(0).login);
          if (result.rows.item(0).login) {
            callback(new OkResult({loginStatus : true}));
          } else {
            callback(new OkResult({loginStatus : false}));
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong with selection user record'));
        });
      });
    },
*/

    getAllWindowHardwares: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), i, AllWindowHardwares = [];
      db.transaction(function (transaction) {
        transaction.executeSql(selectWindowHardware, [], function (transaction, result) {
          if (result.rows.length) {
            for (i = 0; i < result.rows.length; i++) {
              AllWindowHardwares.push({
                id: result.rows.item(i).id,
                name: result.rows.item(i).name + "",
                shortName: result.rows.item(i).shortName + ""
              });
            }
            callback(new OkResult(AllWindowHardwares));
          } else {
            callback(new ErrorResult(1, 'No window_hardware in database!'));
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong with selection window_hardware_groups record'));
        });
      });
    },


    getAllLaminations: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), i, allLaminations = [];
      db.transaction(function (transaction) {
        transaction.executeSql(selectLaminations, [], function (transaction, result) {
          if (result.rows.length) {
            for (i = 0; i < result.rows.length; i++) {
              allLaminations.push({
                id: result.rows.item(i).id,
                name: result.rows.item(i).name + ""
              });
            }
            callback(new OkResult(allLaminations));
          } else {
            callback(new ErrorResult(1, 'No laminations in database!'));
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong with selection lamination_colors record'));
        });
      });
    },

    getProfileSystem: function (callback) {
      callback(new OkResult({
        id: 7,
        name: 'WDS 400',
        heatCoeff: 5,
        airCoeff: 10
      }));
    },


    getAllProfiles: function (callback) {
      callback(new OkResult({
        producers: [
          'WDS',
          'Другие...'
        ],
        profiles: [
          [
            {
              profileId: 51,
              profileType: '4 камеры',
              profileDescrip: 'WDS 400',
              profileCountry: 'Украина',
              profileNoise: 4,
              heatCoeff: 3,
              airCoeff: 10
            },
            {
              profileId: 52,
              profileType: '4 камеры',
              profileDescrip: 'WDS 404',
              profileCountry: 'Украина',
              profileNoise: 4,
              heatCoeff: 4,
              airCoeff: 11
            },
            {
              profileId: 53,
              profileType: '5 камер',
              profileDescrip: 'WDS 505',
              profileCountry: 'Украина',
              profileNoise: 5,
              heatCoeff: 5,
              airCoeff: 9
            },
            {
              profileId: 54,
              profileType: '4 камеры',
              profileDescrip: 'ОКОШКО S60',
              profileCountry: 'Украина',
              profileNoise: 4,
              heatCoeff: 2,
              airCoeff: 8
            }
          ]/*,
          [
            {
              profileId: 55,
              profileType: '3 камеры',
              profileDescrip: 'REHAU 60',
              profileCountry: 'Germany',
              profileNoise: 3,
              heatCoeff: 2,
              airCoeff: 8
            },
            {
              profileId: 56,
              profileType: '5 камер',
              profileDescrip: 'REHAU 70',
              profileCountry: 'Germany',
              profileNoise: 5,
              heatCoeff: 3,
              airCoeff: 10
            }
          ]*/
        ]
      }));
    },



    getAllGlass: function (callback) {
      callback(new OkResult({
        glassTypes: [
          'Стандартные',
          'Энергосберегающие',
          'Зеркальные',
          'Матовые',
          'Бронированные'
        ],
        glasses: [
          [
            {
              glassId: 145,
              glassName: '6/12/6',
              glassUrl: 'img/glasses/glass1.png',
              glassDescrip: '1 камера',
              glassNoise: 4,
              heatCoeff: 2,
              airCoeff: 9,
              glassPrice: 406
            },
            {
              glassId: 142,
              glassName: '4/16/4',
              glassUrl: 'img/glasses/glass1.png',
              glassDescrip: '1 камера',
              glassNoise: 2,
              heatCoeff: 1,
              airCoeff: 9,
              glassPrice: 210
            },
            {
              glassId: 146,
              glassName: '4/10/4/10/4',
              glassUrl: 'img/glasses/glass2.png',
              glassDescrip: '2 камеры',
              glassNoise: 4,
              heatCoeff: 3,
              airCoeff: 9,
              glassPrice: 325
            },
            {
              glassId: 147,
              glassName: '4/8/4/12/4',
              glassUrl: 'img/glasses/glass2.png',
              glassDescrip: '2 камеры',
              glassNoise: 4,
              heatCoeff: 3,
              airCoeff: 9,
              glassPrice: 325
            }
          ],
          [
            {
              glassId: 153,
              glassName: '4/16/4i',
              glassUrl: 'img/glasses/glass10.png',
              glassDescrip: '1 камера +энергосбережение',
              glassNoise: 2,
              heatCoeff: 4,
              airCoeff: 9,
              glassPrice:  245
            },
            {
              glassId: 208,
              glassName: '4/16argon/4i',
              glassUrl: 'img/glasses/glass10.png',
              glassDescrip: '1 камера +энергосбережение',
              glassNoise: 2,
              heatCoeff: 4,
              airCoeff: 9,
              glassPrice:  257
            },
            {
              glassId: 156,
              glassName: '4/10/4/10/4i',
              glassUrl: 'img/glasses/glass20.png',
              glassDescrip: '2 камеры +энергосбережение',
              glassNoise: 4,
              heatCoeff: 4,
              airCoeff: 9,
              glassPrice: 370
            },
            {
              glassId: 207,
              glassName: '4i/10/4/10/4i',
              glassUrl: 'img/glasses/glass20.png',
              glassDescrip: '2 камеры +энергосбережение',
              glassNoise: 4,
              heatCoeff: 5,
              airCoeff: 9,
              glassPrice: 465
            }
          ],
          [
            {
              glassId: 163,
              glassName: 'Зеркальный 4/16/4',
              glassUrl: 'img/glasses/glass1.png',
              glassDescrip: '1 камера',
              glassNoise: 2,
              heatCoeff: 2,
              airCoeff: 9,
              glassPrice:  678
            },
            {
              glassId: 167,
              glassName: 'Зеркальный 4/10/4/10/4',
              glassUrl: 'img/glasses/glass2.png',
              glassDescrip: '2 камеры',
              glassNoise: 4,
              heatCoeff: 3,
              airCoeff: 9,
              glassPrice: 793
            }
          ],
          [
            {
              glassId: 171,
              glassName: 'Матовый 4/16/4',
              glassUrl: 'img/glasses/glass1.png',
              glassDescrip: '1 камера',
              glassNoise: 2,
              heatCoeff: 2,
              airCoeff: 9,
              glassPrice: 678
            },
            {
              glassId: 174,
              glassName: 'Матовый 4/10/4/10/4',
              glassUrl: 'img/glasses/glass2.png',
              glassDescrip: '2 камеры',
              glassNoise: 4,
              heatCoeff: 3,
              airCoeff: 9,
              glassPrice:  793
            }
          ],
          [
            {
              glassId: 182,
              glassName: 'Бр. 2сл.(225мк) 4/16/4',
              glassUrl: 'img/glasses/glass1.png',
              glassDescrip: '1 камера',
              glassNoise: 2,
              heatCoeff: 2,
              airCoeff: 9,
              glassPrice: 1038
            },
            {
              glassId: 186,
              glassName: 'Бр. 3сл.(336мк) 6/12/6',
              glassUrl: 'img/glasses/glass1.png',
              glassDescrip: '1 камера',
              glassNoise: 4,
              heatCoeff: 2,
              airCoeff: 9,
              glassPrice: 1234
            },
            {
              glassId: 177,
              glassName: 'Бр. 2сл.(225мк) 4/10/4/10/4',
              glassUrl: 'img/glasses/glass2.png',
              glassDescrip: '2 камеры',
              glassNoise: 4,
              heatCoeff: 3,
              airCoeff: 9,
              glassPrice: 1153
            },
            {
              glassId: 221,
              glassName: 'Бр. 3сл.(336мк) 4/10/4/10/4',
              glassUrl: 'img/glasses/glass2.png',
              glassDescrip: '2 камеры',
              glassNoise: 4,
              heatCoeff: 3,
              airCoeff: 9,
              glassPrice: 1321
            }
          ]
        ]
      }));
    },

    getAllHardware: function (callback) {
      callback(new OkResult({
        hardwaresTypes: [
          'AXOR',
         // 'Мако',  //закомментировал А.С.
          'Другие...'
        ],
        hardwares: [
          [
            {
              hardwareId: 20,
              hardwareName: 'Komfort Line K-3',
              hardwareProducer: 'AXOR',
              hardwareCountry: 'Украина',
              hardwareLogo: 'img/hardware-logos/axor.png',
              hardwareLink: '#',
              hardwareNoise: 4,
              heatCoeff: 4,
              airCoeff: 5,
              hardwarePrice: 150
            }
           /* {
              hardwareId: 2,
              hardwareName: 'ACCADO 7mm',
              hardwareProducer: 'ACCADO',
              hardwareCountry: 'Турция',
              hardwareLogo: 'img/hardware-logos/accado.png',
              hardwareLink: '#',
              hardwareHeat: 2,
              hardwareNoise: 5,
              hardwarePrice: 200
           }
       */    ],
         /* [
            {
              hardwareId: 1,
              hardwareName: 'ACCADO 7mm',
              hardwareProducer: 'Мако',
              hardwareCountry: 'Турция',
              hardwareLogo: 'img/hardware-logos/maco.png',
              hardwareLink: '#',
              hardwareHeat: 5,
              hardwareNoise: 4,
              hardwarePrice: 100
            },
            {
              hardwareId: 2,
              hardwareName: 'ACCADO 7mm',
              hardwareProducer: 'Мако',
              hardwareCountry: 'Турция',
              hardwareLogo: 'img/hardware-logos/maco.png',
              hardwareLink: '#',
              hardwareHeat: 3,
              hardwareNoise: 1,
              hardwarePrice: 800
            }
         ],
         */ [
             {
              hardwareId: 21,
              hardwareName: 'Roto NT',
              hardwareProducer: 'Roto',
              hardwareCountry: 'Germany',
              hardwareLogo: 'img/hardware-logos/roto.png',
              hardwareLink: '#',
              hardwareNoise: 4,
              heatCoeff: 5,
              airCoeff: 9,
              hardwarePrice: 250
            },
            {
              hardwareId: 22,
              hardwareName: 'MACO MULTI TREND',
              hardwareProducer: 'MACO',
              hardwareCountry: 'Austria',
              hardwareLogo: 'img/hardware-logos/maco.png',
              hardwareLink: '#',
              hardwareNoise: 5,
              heatCoeff: 4,
              airCoeff: 3,
              hardwarePrice: 290
            }
          ]
        ]
      }));
    },

    getAllLamination: function (callback) {
      callback(new OkResult({
        laminationWhite: 'без ламин.',
        laminationInside: [
          {
            laminationId: 1,
            laminationName: 'светлый дуб',
            laminationUrl: 'img/lamination/Birch.png',
            laminationPrice: 547
          },
          {
            laminationId: 2,
            laminationName: 'золотой дуб',
            laminationUrl: 'img/lamination/GoldenOak.png',
            laminationPrice: 547
          },
          {
            laminationId: 3,
            laminationName: 'береза',
            laminationUrl: 'img/lamination/LightOak.png',
            laminationPrice: 547
          },
          {
            laminationId: 4,
            laminationName: 'махагон',
            laminationUrl: 'img/lamination/Mahagon.png',
            laminationPrice: 547
          },
          {
            laminationId: 5,
            laminationName: 'сосна',
            laminationUrl: 'img/lamination/Pine.png',
            laminationPrice: 547
          }
        ],
        laminationOutside: [

          {
            laminationId: 1,
            laminationName: 'светлый дуб',
            laminationUrl: 'img/lamination/Birch.png',
            laminationPrice: 547
          },
          {
            laminationId: 2,
            laminationName: 'золотой дуб',
            laminationUrl: 'img/lamination/GoldenOak.png',
            laminationPrice: 547
          },
          {
            laminationId: 3,
            laminationName: 'береза',
            laminationUrl: 'img/lamination/LightOak.png',
            laminationPrice: 547
          },
          {
            laminationId: 4,
            laminationName: 'махагон',
            laminationUrl: 'img/lamination/Mahagon.png',
            laminationPrice: 547
          },
          {
            laminationId: 5,
            laminationName: 'сосна',
            laminationUrl: 'img/lamination/Pine.png',
            laminationPrice: 547
          }

        ]
      }));
    },


    getAllGrids: function (callback) {
      callback(new OkResult({

        elementType: [
          'внутренние',
          'внешние'
        ],
        elementsList: [
          [
            {
              elementId: 585,
              elementName: 'Сетка СO-100',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 585,
              elementName: 'Сетка СO-200',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 585,
              elementName: 'Сетка СO-200',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 585,
              elementName: 'Сетка СO-300',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 585,
              elementName: 'Сетка СO-300',
              elementQty: 1,
              elementPrice: 100
            }
          ]
        ]

      }));
    },

    getAllVisors: function (callback) {
      callback(new OkResult({

        elementType: [
          'стандартные',
          'оцинкованные',
          'Матовые'
        ],
        elementsList: [
          [
            {
              elementId: 210675,
              elementName: 'Козырек белый 100мм',
              elementWidth: 1500,
              elementQty: 1
            },
            {
              elementId: 210676,
              elementName: 'Козырек белый 200мм',
              elementWidth: 1500,
              elementQty: 1
            },
            {
              elementId: 210677,
              elementName: 'Козырек белый 300мм',
              elementWidth: 1500,
              elementQty: 1
            }
          ],
          [
            {
              elementId: 210687,
              elementName: 'Козырек 100мм оцинкованный',
              elementWidth: 1500,
              elementQty: 1
            },
            {
              elementId: 210693,
              elementName: 'Козырек 200мм оцинкованный',
              elementWidth: 1500,
              elementQty: 1
            },
            {
              elementId: 210694,
              elementName: 'Козырек 300мм оцинкованный',
              elementWidth: 1500,
              elementQty: 1
            },
            {
              elementId: 210695,
              elementName: 'Козырек 400мм оцинкованный',
              elementWidth: 1500,
              elementQty: 1
            },
            {
              elementId: 210696,
              elementName: 'Козырек 500мм оцинкованный',
              elementWidth: 1500,
              elementQty: 1
            }
          ],
          [
            {
              elementId: 210697,
              elementName: 'Козырёк нестандартный',
              elementWidth: 1500,
              elementQty: 1
            }
          ]
        ]

      }));
    },

    getAllSpillways: function (callback) {
      callback(new OkResult({

        elementType: [
          'стандартные',
          'оцинкованные',
          'нестандартные'
        ],
        elementsList: [
          [
            {
              elementId: 497,
              elementType: 'Отлив белый 200мм',
              elementName: 'Отлив КO-200',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 498,
              elementType: 'Стандартные',
              elementName: 'Отлив коричневый 260мм',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 547,
              elementType: 'оцинкованный',
              elementName: 'Отлив оцинкованный 20мм',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 571,
              elementType: 'оцинкованный',
              elementName: 'Отлив оцинкованный 50мм',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 540,
              elementType: 'нестандартные',
              elementName: 'Отлив нестандартный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            }
          ]
        ]

      }));
    },

    getAllOutsideSlope: function (callback) {
      callback(new OkResult({

        elementType: [
          'стандартные'
        ],
        elementsList: [
          [
            {
              elementId: 89349,
              elementType: 'Стандартные',
              elementName: 'Откос пластиковый',
              elementWidth: 200,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 89350,
              elementType: 'Стандартные',
              elementName: 'Откос гипсокартонный',
              elementWidth: 200,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 89351,
              elementType: 'Стандартные',
              elementName: 'Откос песчаноцементный',
              elementWidth: 200,
              elementQty: 1,
              elementPrice: 100
            }
          ]
        ]

      }));
    },


    getAllInsideSlope: function (callback) {
      callback(new OkResult({

        elementType: [
          'стандартные'
        ],
        elementsList: [
          [
            {
              elementId: 89349,
              elementType: 'Стандартные',
              elementName: 'Откос пластиковый',
              elementWidth: 200,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 89350,
              elementType: 'Стандартные',
              elementName: 'Откос гипсокартонный',
              elementWidth: 200,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 89351,
              elementType: 'Стандартные',
              elementName: 'Откос песчаноцементный',
              elementWidth: 200,
              elementQty: 1,
              elementPrice: 100
            }
          ]
        ]

      }));
    },


    getAllLouvers: function (callback) {
      callback(new OkResult({

        elementType: [
          'Стандартные',
          'оцинкованный',
          'Матовые'
        ],
        elementsList: [
          [
            {
              elementId: 1,
              elementType: 'Стандартные',
              elementName: 'Жалюзи КO-200',
              elementWidth: 700,
              elementHeight: 700,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementType: 'Стандартные',
              elementName: 'Жалюзи КO-300, оцинкованный',
              elementWidth: 700,
              elementHeight: 700,
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementType: 'оцинкованный',
              elementName: 'Жалюзи КO-100, оцинкованный',
              elementWidth: 700,
              elementHeight: 700,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementType: 'оцинкованный',
              elementName: 'Жалюзи КO-300',
              elementWidth: 700,
              elementHeight: 700,
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementType: 'Матовые',
              elementName: 'Жалюзи КO-300',
              elementWidth: 700,
              elementHeight: 700,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementType: 'Матовые',
              elementName: 'Жалюзи КO-300',
              elementWidth: 700,
              elementHeight: 700,
              elementQty: 1,
              elementPrice: 100
            }
          ]
        ]

      }));
    },


    getAllConnectors: function (callback) {
      callback(new OkResult({

        elementType: [
          'стандартные',
          'усиленные',
          'балконные'
        ],
        elementsList: [
          [
            {
              elementId: 577,
              elementName: 'Соединитель стандартный 5/10',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 577,
              elementName: 'Соединитель стандартный 3/10',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 577,
              elementName: 'Соединитель усиленный 5/13',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 577,
              elementName: 'Соединитель балконный 5/13',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            }
          ]
        ]

      }));
    },

    getAllFans: function (callback) {
      callback(new OkResult({

        elementType: [
          'Стандартные',
          'GECCO',
          'Aereco'
        ],
        elementsList: [
          [
            {
              elementId: 1,
              elementName: 'С-ма прит. вентиляции 4-х ст.',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementName: 'С-ма вентиляции 4-х ст.',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementName: 'Система приточной вентиляции помещений GECCO',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementName: 'GECCO Система вентиляции помещений',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementName: 'Aereco С-ма оконной вентиляции',
              elementQty: 1,
              elementPrice: 100
            }
          ]
        ]

      }));
    },

    getAllWindowSills: function (callback) {
      callback(new OkResult({

        elementType: [
          'LIGNODUR',
          'ДАНКЕ',
          'OpenTeck'
        ],
        elementsList: [
          [
            {
              elementId: 333,
              elementType: 'Матовые',
              elementName: 'LIGNODUR 200 мм белый',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: 'img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 334,
              elementType: 'Матовые',
              elementName: 'LIGNODUR 300 мм белый',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: 'img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 335,
              elementType: 'Матовые',
              elementName: 'LIGNODUR 400 мм белый',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: 'img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 341,
              elementType: 'Матовые',
              elementName: 'ДАНКЕ 100 мм белый матовый',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: 'img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 342,
              elementType: 'Матовые',
              elementName: 'ДАНКЕ 300 мм белый матовый',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: 'img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 301,
              elementType: 'Матовые',
              elementName: 'OpenTeck 100 мм белый',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: 'img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 302,
              elementType: 'Матовые',
              elementName: 'OpenTeck 200 мм белый',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: 'img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 303,
              elementType: 'Матовые',
              elementName: 'OpenTeck 300 мм белый',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: 'img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 304,
              elementType: 'Матовые',
              elementName: 'OpenTeck 400 мм белый',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: 'img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            }
          ]
        ]

      }));
    },

    getAllHandles: function (callback) {
      callback(new OkResult({

        elementType: [
          'Стандартные',
          'HOPPE',
          'нестандартные'
        ],
        elementsList: [
          [
            {
              elementId: 586,
              elementName: 'Ручка оконная белая',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 587,
              elementName: 'Ручка оконная с ключом белая',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 588,
              elementName: 'Ручка HOPPE (Tokyo) белая',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 589,
              elementName: 'Ручка HOPPE (Tokyo) серебр.',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 586,
              elementName: 'Ручка нестандартная',
              elementQty: 1,
              elementPrice: 100
            }
          ]
        ]

      }));
    },


    getAllOthers: function (callback) {
      callback(new OkResult({

        elementType: [
          'стандартные',
          'усиленные',
          'балконные'
        ],
        elementsList: [
          [
            {
              elementId: 1,
              elementName: 'Армирование квадрат 40х40',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementName: 'Штифт верхней петли',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 3,
              elementName: 'П-О запор NT константный 170 (481-600), KS',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementName: 'Армирующий профиль 15х30',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementName: 'Нижняя петля на раме K3/100',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementName: 'Поворотная петля Komfort 12/20-13 левая',
              elementQty: 1,
              elementPrice: 100
            }
          ]
        ]

      }));
    },

    getLaminationAddElements: function (callback) {
      callback(new OkResult({
        laminationWhiteMatt: {
          laminationName: 'Белый',
          laminationLabel: 'матовый',
          laminationUrl: 'img/lamination/empty.png'
        },
        laminationWhiteGlossy: {
          laminationName: 'Белый',
          laminationLabel: 'глянцевый',
          laminationUrl: 'img/lamination/empty.png'
        },
        laminations: [
          {
            laminationId: 1,
            laminationName: 'светлый дуб',
            laminationUrl: 'img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 2,
            laminationName: 'золотой дуб',
            laminationUrl: 'img/lamination/GoldenOak.png',
            laminationPrice: 100
          },
          {
            laminationId: 3,
            laminationName: 'береза',
            laminationUrl: 'img/lamination/LightOak.png',
            laminationPrice: 100
          },
          {
            laminationId: 4,
            laminationName: 'махагон',
            laminationUrl: 'img/lamination/Mahagon.png',
            laminationPrice: 100
          },
          {
            laminationId: 5,
            laminationName: 'сосна',
            laminationUrl: 'img/lamination/Pine.png',
            laminationPrice: 100
          }
        ]
      }));
    },

    // TODO: Сервис готов
    getConstructNoteText: function (callback) {
      callback(new OkResult({
        note: 'Срочный заказ'
      }));
    },



    getFloorPrice: function (callback) {
      callback(new OkResult({

        floors: [
          {
            name: 1,
            price: 100
          },
          {
            name: 2,
            price: 200
          },
          {
            name: 3,
            price: 300
          },
          {
            name: 4,
            price: 400
          },
          {
            name: 5,
            price: 500
          }
        ]

      }));
    },

    getAssemblingPrice: function (callback) {
      callback(new OkResult({

        assembling: [
          {
            name: 'без демонтажа',
            price: 200
          },
          {
            name: 'стандартный',
            price: 300
          },
          {
            name: 'VIP-монтаж',
            price: 400
          }
        ]

      }));
    },

    getInstalment: function (callback) {
      callback(new OkResult({

        instalment: [
          {
            period: 1,
            percent: 15
          },
          {
            period: 2,
            percent: 20
          },
          {
            period: 3,
            percent: 25
          },
          {
            period: 4,
            percent: 30
          },
          {
            period: 5,
            percent: 35
          }
        ]

      }));
    },

    getLocations: function (callback) {
      callback(new OkResult({

        locations: [
          {
            current: true,
            city: 'Днепропетровск'
          },
          {
            current: false,
            city: 'Ивано-Франковск'
          },
          {
            current: false,
            city: 'Кировоград'
          },
          {
            current: false,
            city: 'Львов'
          },
          {
            current: false,
            city: 'Владимир-Волынский'
          },
          {
            current: false,
            city: 'Корсунь-Шевченковский'
          },
          {
            current: false,
            city: 'Днепродзержинск'
          },
          {
            current: false,
            city: 'Каменец-Подольский'
          }
        ]

      }));
    },

    getDoorConfig: function (callback) {
      callback(new OkResult({

        doorType: [
          {
            shapeId: 1,
            shapeLabel: 'по периметру',
            shapeIcon: 'img/door-config/doorstep.png',
            shapeIconSelect: 'img/door-config-selected/doorstep.png'
          },
          {
            shapeId: 2,
            shapeLabel: 'без порога',
            shapeIcon: 'img/door-config/no-doorstep.png',
            shapeIconSelect: 'img/door-config-selected/no-doorstep.png'
          },
          {
            shapeId: 3,
            shapeLabel: 'алюминевый порог, тип1',
            shapeIcon: 'img/door-config/doorstep-al1.png',
            shapeIconSelect: 'img/door-config-selected/doorstep-al1.png'
          },
          {
            shapeId: 4,
            shapeLabel: 'алюминевый порог, тип2',
            shapeIcon: 'img/door-config/doorstep-al2.png',
            shapeIconSelect: 'img/door-config-selected/doorstep-al2.png'
          }
        ],

        sashType: [
          {
            shapeId: 1,
            shapeLabel: 'межкомнатная, 98мм'
          },
          {
            shapeId: 2,
            shapeLabel: 'дверная т-образная, 116мм'
          },
          {
            shapeId: 3,
            shapeLabel: 'оконная, 76мм'
          }
        ],

        handleType: [
          {
            shapeId: 1,
            shapeLabel: 'нажимной гарнитур',
            shapeIcon: 'img/door-config/lever-handle.png',
            shapeIconSelect: 'img/door-config-selected/lever-handle.png'
          },
          {
            shapeId: 2,
            shapeLabel: 'стандартная офисная ручка',
            shapeIcon: 'img/door-config/standart-handle.png',
            shapeIconSelect: 'img/door-config-selected/standart-handle.png'
          }
        ],

        lockType: [
          {
            shapeId: 1,
            shapeLabel: 'однозапорный с защелкой',
            shapeIcon: 'img/door-config/onelock.png',
            shapeIconSelect: 'img/door-config-selected/onelock.png'
          },
          {
            shapeId: 2,
            shapeLabel: 'многозапорный с защелкой',
            shapeIcon: 'img/door-config/multilock.png',
            shapeIconSelect: 'img/door-config-selected/multilock.png'
          }
        ]


      }));
    }

  }
});



// services/globalDB.js


// services/globalDB.js

"use strict";

BauVoiceApp.factory('globalDB', ['$http', function ($http) {

  var elemLists = [], elemListsHw = [], elemListsAdd = [];

  // SQL requests for creating tables if they are not exists yet
  var createTablesSQL = ["CREATE TABLE IF NOT EXISTS factories (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS elements_groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), base_unit INTEGER, position INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS glass_folders (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), factory_id INTEGER, position INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id))",
      "CREATE TABLE IF NOT EXISTS lists_types (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), image_add_param VARCHAR(100), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS addition_colors (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), lists_type_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(lists_type_id) REFERENCES lists_types(id))",
      "CREATE TABLE IF NOT EXISTS margin_types (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS suppliers (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), factory_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id))",
      "CREATE TABLE IF NOT EXISTS currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), value NUMERIC(10, 2), factory_id INTEGER, is_base INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id))",
      "CREATE TABLE IF NOT EXISTS countries (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), currency_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(currency_id) REFERENCES currencies(id))",
      "CREATE TABLE IF NOT EXISTS regions (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), country_id INTEGER, heat_transfer NUMERIC(10, 2), climatic_zone NUMERIC, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(country_id) REFERENCES countries(id))",
      "CREATE TABLE IF NOT EXISTS cities (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), region_id INTEGER, transport VARCHAR(2), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(region_id) REFERENCES regions(id))",
      "CREATE TABLE IF NOT EXISTS lamination_colors (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), factory_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id))",
      "CREATE TABLE IF NOT EXISTS elements (id INTEGER PRIMARY KEY AUTOINCREMENT, sku VARCHAR(100), name VARCHAR(255), element_group_id INTEGER, price NUMERIC(10, 2), currency_id INTEGER, supplier_id INTEGER, margin_id INTEGER, waste NUMERIC(10, 2), is_optimized INTEGER, is_virtual INTEGER, is_additional INTEGER, weight_accounting_unit NUMERIC(10, 3), glass_folder_id INTEGER, min_width NUMERIC, min_height NUMERIC, max_width NUMERIC, max_height NUMERIC, max_sq NUMERIC, transcalency NUMERIC(10, 2), amendment_pruning NUMERIC(10, 2), glass_width INTEGER, factory_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, noise INTEGER, FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(glass_folder_id) REFERENCES glass_folders(id), FOREIGN KEY(margin_id) REFERENCES margin_types(id), FOREIGN KEY(supplier_id) REFERENCES suppliers(id), FOREIGN KEY(currency_id) REFERENCES currencies(id), FOREIGN KEY(element_group_id) REFERENCES elements_groups(id))",
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(255), password VARCHAR(255), short_id VARCHAR(2), parent_id INTEGER, factory_id INTEGER, discount_construct_max NUMERIC(10, 1), discount_construct_default NUMERIC(10, 1), discount_additional_elements_max NUMERIC(10, 1), discount_additional_elements_default NUMERIC(10, 1), name VARCHAR(255), phone VARCHAR(100), inn VARCHAR(100), okpo VARCHAR(100), mfo VARCHAR(100), bank_name VARCHAR(100), bank_acc_no VARCHAR(100), director VARCHAR(255), stamp_file_name VARCHAR(255), locked INTEGER, user_type INTEGER, contact_name VARCHAR(100), city_phone VARCHAR(100), city_id INTEGER, legal_name VARCHAR(255), fax VARCHAR(100), avatar VARCHAR(255), birthday DATE, sex VARCHAR(100), margin_mounting_mon NUMERIC(10, 2), margin_mounting_tue NUMERIC(10, 2), margin_mounting_wed NUMERIC(10, 2), margin_mounting_thu NUMERIC(10, 2), margin_mounting_fri NUMERIC(10, 2), margin_mounting_sat NUMERIC(10, 2), margin_mounting_sun NUMERIC(10, 2), min_term INTEGER, base_term INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(city_id) REFERENCES cities(id))",
      "CREATE TABLE IF NOT EXISTS lists_groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY AUTOINCREMENT, parent_element_id INTEGER, name VARCHAR(255), list_group_id INTEGER, list_type_id INTEGER, add_color_id INTEGER, a NUMERIC(10, 2), b NUMERIC(10, 2), c NUMERIC(10, 2), d NUMERIC(10, 2), position NUMERIC, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, addition_folder_id INTEGER, FOREIGN KEY(parent_element_id) REFERENCES elements(id), FOREIGN KEY(parent_element_id) REFERENCES elements(id), FOREIGN KEY(list_group_id) REFERENCES lists_groups(id), FOREIGN KEY(add_color_id) REFERENCES addition_colors(id))",
      "CREATE TABLE IF NOT EXISTS directions (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS rules_types (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), parent_unit INTEGER, child_unit INTEGER, suffix VARCHAR(15), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS window_hardware_colors (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS list_contents (id INTEGER PRIMARY KEY AUTOINCREMENT, parent_list_id INTEGER, child_id INTEGER, child_type VARCHAR(255), value NUMERIC(10, 3), rules_type_id INTEGER, direction_id INTEGER, lamination_type_id INTEGER, window_hardware_color_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(parent_list_id) REFERENCES lists(id), FOREIGN KEY(rules_type_id) REFERENCES rules_types(id), FOREIGN KEY(direction_id) REFERENCES directions(id), FOREIGN KEY(lamination_type_id) REFERENCES lamination_types(id), FOREIGN KEY(window_hardware_color_id) REFERENCES window_hardware_colors(id))",
      "CREATE TABLE IF NOT EXISTS window_hardware_types (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), short_name VARCHAR(100), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS window_hardware_types_base (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS window_hardware_groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), short_name VARCHAR(100), factory_id INTEGER, is_editable INTEGER, parent_id INTEGER, is_group INTEGER, is_in_calculation INTEGER, base_type_id INTEGER, position INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(base_type_id) REFERENCES window_hardware_types_base(id))",
      "CREATE TABLE IF NOT EXISTS window_hardware (id INTEGER PRIMARY KEY AUTOINCREMENT, window_hardware_type_id INTEGER, min_width INTEGER, max_width INTEGER, min_height INTEGER, max_height INTEGER, direction_id INTEGER, window_hardware_color_id INTEGER, length INTEGER, count INTEGER, child_id INTEGER, child_type VARCHAR(100), position INTEGER, factory_id INTEGER, window_hardware_group_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(window_hardware_type_id) REFERENCES window_hardware_types(id), FOREIGN KEY(direction_id) REFERENCES directions(id), FOREIGN KEY(window_hardware_group_id) REFERENCES window_hardware_groups(id), FOREIGN KEY(window_hardware_color_id) REFERENCES window_hardware_colors(id))",
      "CREATE TABLE IF NOT EXISTS profile_system_folders (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), factory_id INTEGER, position INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id))",
      "CREATE TABLE IF NOT EXISTS profile_systems (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), short_name VARCHAR(100), profile_system_folder_id INTEGER, rama_list_id INTEGER, rama_still_list_id INTEGER, stvorka_list_id INTEGER, impost_list_id INTEGER, shtulp_list_id INTEGER, is_editable INTEGER, is_default INTEGER, position INTEGER, country VARCHAR(100), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, cameras INTEGER, FOREIGN KEY(profile_system_folder_id) REFERENCES profile_system_folders(id))",
      "CREATE TABLE IF NOT EXISTS glass_profile_systems (id INTEGER PRIMARY KEY AUTOINCREMENT, profile_system_id INTEGER, list_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(list_id) REFERENCES lists(id))",
      "CREATE TABLE IF NOT EXISTS beed_profile_systems (id INTEGER PRIMARY KEY AUTOINCREMENT, profile_system_id INTEGER, list_id INTEGER, glass_width INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(list_id) REFERENCES lists(id))",
      "CREATE TABLE IF NOT EXISTS addition_folders (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), addition_type_id INTEGER, factory_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(addition_type_id) REFERENCES addition_types(id))",
      "CREATE TABLE IF NOT EXISTS addition_types (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"],
    createDevice = "CREATE TABLE IF NOT EXISTS device (id INTEGER PRIMARY KEY AUTOINCREMENT, device_code VARCHAR(255), sync INTEGER, last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";

  // SQL requests for select data from tables
  var selectDeviceCodeLocalDb = "SELECT device_code as code, sync FROM device",
    selectUser = "SELECT count(id) as login FROM users WHERE phone = ? AND password = ?",
    //selectUserInfo = "SELECT users.name, users.city_id, cities.name as city_name, users.avatar FROM users LEFT JOIN cities ON users.city_id = cities.id",
    selectLastSync = "SELECT last_sync FROM device";

  // SQL requests for inserting data into tables
  var insertDeviceCodeLocalDb = "INSERT INTO device (id, device_code, sync) VALUES (?, ?, ?)";

  // SQL requests for update data in tables
  var updateDeviceSync = "UPDATE device SET sync = 1, last_sync = ? WHERE id = 1";

  // SQL requests for delete tables
  var deleteTablesSQL = ["DROP table device", "DROP table factories", "DROP table elements_groups", "DROP table glass_folders",
    "DROP table lists_types", "DROP table addition_colors", "DROP table margin_types", "DROP table suppliers", "DROP table currencies", "DROP table countries",
    "DROP table regions", "DROP table cities", "DROP table lamination_colors", "DROP table elements", "DROP table users", "DROP table lists_groups", "DROP table lists",
    "DROP table directions", "DROP table rules_types", "DROP table window_hardware_colors", "DROP table list_contents", "DROP table window_hardware_types",
    "DROP table window_hardware_types_base", "DROP table window_hardware_groups", "DROP table window_hardware", "DROP table profile_system_folders",
    "DROP table profile_systems", "DROP table glass_profile_systems", "DROP table beed_profile_systems","DROP table addition_folders", "DROP table addition_types"
  ];

  return {

    md5: function (string) {
      function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
      }
      function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
          return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
          if (lResult & 0x40000000) {
            return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
          } else {
            return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
          }
        } else {
          return (lResult ^ lX8 ^ lY8);
        }
      }
      function F(x, y, z) {
        return (x & y) | ((~x) & z);
      }
      function G(x, y, z) {
        return (x & z) | (y & (~z));
      }
      function H(x, y, z) {
        return (x ^ y ^ z);
      }
      function I(x, y, z) {
        return (y ^ (x | (~z)));
      }
      function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      }
      function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      }
      function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      }
      function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
      }
      function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4) * 8;
          lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
          lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
      }
      function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
          lByte = (lValue >>> (lCount * 8)) & 255;
          WordToHexValue_temp = "0" + lByte.toString(16);
          WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
      }
      function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          }
          else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          }
          else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }
        }
        return utftext;
      }
      var x = Array();
      var k, AA, BB, CC, DD, a, b, c, d;
      var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
      var S21 = 5, S22 = 9 , S23 = 14, S24 = 20;
      var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
      var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
      string = Utf8Encode(string);
      x = ConvertToWordArray(string);
      a = 0x67452301;
      b = 0xEFCDAB89;
      c = 0x98BADCFE;
      d = 0x10325476;
      for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
      }
      var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
      return temp.toLowerCase();
    },

    getDeviceCodeLocalDb: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      var newDeviceCodeLocalDb = '';
      var words = '0123456789qwertyuiopasdfghjklzxcvbnm';
      var maxPosition = words.length - 1;
      for (var i = 0; i < 8; ++i) {
        var position = Math.floor(Math.random() * maxPosition);
        newDeviceCodeLocalDb = newDeviceCodeLocalDb + words.substring(position, position + 1);
      }
      newDeviceCodeLocalDb = "f9q9nkzu"; // TODO временно! убрать
      db.transaction(function (transaction) {
        transaction.executeSql(createDevice, []);
      });
      db.transaction(function (transaction) {
        transaction.executeSql(selectDeviceCodeLocalDb, [], function (transaction, result) {
          if (result.rows.length) {
            if (result.rows.item(0).sync) {
              callback(new OkResult({sync: true, deviceCode: result.rows.item(0).code}));
            } else {
              callback(new OkResult({sync: false, deviceCode: result.rows.item(0).code}));
            }
          } else {
            db.transaction(function (transaction) {
              transaction.executeSql(insertDeviceCodeLocalDb, [1, newDeviceCodeLocalDb, 0], function () {
              }, function () {
                callback(new ErrorResult(2, 'Something went wrong with inserting device record'));
              });
            });
            callback(new OkResult({sync: false, deviceCode: newDeviceCodeLocalDb}));
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong with selection device_code record'));
        });
      });
    },

    getDeviceCodeGlobalDb: function (deviceCode, callback) {
      if (deviceCode) {
        $http.get('http://api.voice-creator.net/sync/elements?device_code=' + deviceCode).success(function (result) {
          if(result.status) {
            if (result.data.length < 2) {
              callback(new OkResult(deviceCode));
            } else {
              callback(new ErrorResult(2, 'Device Code is already use in other device!'));
            }
          } else {
            callback(new ErrorResult(2, 'No Device Code in Database yet!'));
          }
        }).error(function () {
          callback(new ErrorResult(2, 'Something went wrong with selecting data from Database'));
        });
      } else {
        callback(new ErrorResult(2, 'Bad Device Code!'));
      }
    },

    initApp: function (callback) {
      var self = this;
      this.getDeviceCodeLocalDb(function (result) {
        if (result.status) {
          var deviceCodeLocalDb = result.data;
          console.log(deviceCodeLocalDb);
          self.getDeviceCodeGlobalDb(deviceCodeLocalDb.deviceCode, function (result) {
            if (result.status) {
              var deviceCodeGlobalDb = result.data;
              if (deviceCodeLocalDb.deviceCode === deviceCodeGlobalDb && !deviceCodeLocalDb.sync) {
                console.log('Import database begin!');
                self.importDb(deviceCodeGlobalDb, function (result) {
                  if (result.status) {
                    console.log('Database import is finished!');
                    callback(new OkResult('Database import is finished!'));
                  } else {
                    callback(new ErrorResult(2, 'Something went wrong when importing Database!'));
                  }
                });
              }
            }
          });
        }
      });
    },

    importDb: function (deviceCode, callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), i, table;
      db.transaction(function (transaction) {
        for (i = 0; i < createTablesSQL.length; i++) {
          transaction.executeSql(createTablesSQL[i], []);
        }
      });
      $http.get('http://api.voice-creator.net/sync/elements?access_token=' + deviceCode).success(function (result) {
        db.transaction(function (transaction) {
          for (table in result.tables) {
            for (i = 0; i < result.tables[table].rows.length; i++) {
              transaction.executeSql('INSERT INTO ' + table + ' (' + result.tables[table].fields.join(', ') + ') VALUES (' + getValuesString(result.tables[table].rows[i]) + ')', [], function () {
              }, function () {
                callback(new ErrorResult(2, 'Something went wrong with inserting ' + table + ' record'));
              });
            }
          }
          transaction.executeSql(updateDeviceSync, [""+result.last_sync+""], null, function () {
            callback(new ErrorResult(2, 'Something went wrong with updating device table!'));
          });
          callback({status: true});
        });
      }).error(function () {
        callback(new ErrorResult(2, 'Something went wrong with importing Database!'));
      });
    },

    getLastSync: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      db.transaction(function (transaction) {
        transaction.executeSql(selectLastSync, [], function (transaction, result) {
          if (result.rows.length) {
            callback(new OkResult({last_sync: result.rows.item(0).last_sync}));
          } else {
            callback(new ErrorResult(2, 'No last_sync data in database!'));
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong with selection last_sync record'));
        });
      });
    },

    syncDb: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), i, k, table, updateSql, lastSyncDate, deviceCode;
      var self = this;

      this.getDeviceCodeLocalDb(function (result) {
        deviceCode = result.data.deviceCode;
        self.getLastSync(function (result) {
          lastSyncDate = result.data.last_sync;
          console.log(deviceCode);
          $http.get('http://api.voice-creator.net/sync/elements?access_token=' + deviceCode + '&last_sync=' + lastSyncDate).success(function (result) {
            db.transaction(function (transaction) {
              console.log(result);
              for (table in result.tables) {
                for (i = 0; i < result.tables[table].rows.length; i++) {
                  updateSql = '';
                  for(k = 0; k < result.tables[table].fields.length; k++){
                    if(!k)
                      updateSql += result.tables[table].fields[k] + " = '" + result.tables[table].rows[i][k] + "'";
                    else
                      updateSql += ", " + result.tables[table].fields[k] + " = '" + result.tables[table].rows[i][k] + "'";
                  }
                  transaction.executeSql("UPDATE " + table + " SET " + updateSql + " WHERE id = " + result.tables[table].rows[i][0], [], function () {
                  }, function () {
                    callback(new ErrorResult(2, 'Something went wrong with updating ' + table + ' record'));
                  });
                }
              }
              transaction.executeSql(updateDeviceSync, [""+result.last_sync+""], null, function () {
                callback(new ErrorResult(2, 'Something went wrong with updating device table!'));
              });
              callback({status: true});
            });
          }).error(function () {
            callback(new ErrorResult(2, 'Something went wrong with sync Database!'));
          });
        });
      });
    },

    sendOrder: function (orderJson, callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), deviceCode;
      var self = this;
      this.getDeviceCodeLocalDb(function (result) {
        deviceCode = result.data.deviceCode;
        $http.post('http://api.voice-creator.net/sync/orders?access_token=' + deviceCode, orderJson).success(function (result) {
          callback(result);
        }).error(function () {
          callback(new ErrorResult(2, 'Something went wrong with sync Database!'));
        });
      });
    },

    clearDb: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), i;
      db.transaction(function (transaction) {
        for (i = 0; i < deleteTablesSQL.length; i++) {
          transaction.executeSql(deleteTablesSQL[i], [], function () {
            callback({status: true});
          }, function () {
            callback(new ErrorResult(2, 'Something went wrong with deleting table'));
          });
        }
      });
    },



    login: function (loginData, callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      var self = this;
      db.transaction(function (transaction) {
        transaction.executeSql(selectUser, [loginData.login, self.md5(loginData.password)], function (transaction, result) {
          console.log(result.rows.item(0).login);
          if (result.rows.item(0).login) {
            callback(new OkResult({loginStatus : true}));
          } else {
            callback(new OkResult({loginStatus : false}));
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong with selection user record'));
        });
      });
    },




    getCurrentCurrency: function(cityId, callback){
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      db.transaction(function (transaction) {
        transaction.executeSql('select id, name, value from currencies where id = (select country_id from regions where id = (select region_id from cities where id = ?))', [cityId], function (transaction, result) {
          if (result.rows.length) {
            callback(new OkResult(result.rows.item(0)));
          } else {
            callback(new ErrorResult(1, 'Incorrect cityId!'));
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong when get current currency'));
        });
      });
    },

    getPriceByIdList: function(liId, i, k, callback){
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      db.transaction(function (transaction) {
        transaction.executeSql('select parent_element_id from lists where id = ?', [liId], function (transaction, result){
          if(result.rows.length){
            transaction.executeSql('select id, currency_id, price, waste, name, amendment_pruning from elements where id = ?', [result.rows.item(0).parent_element_id], function (transaction, result){
              if(result.rows.length)
                callback(new OkResult({"currency":result.rows.item(0), "index":i, "ix":k}));
            }, function () {
              callback(new ErrorResult(2, 'Something went wrong when get element price'));
            });
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong when get parent_element_id'));
        });
      });
    },

    getPriceById: function(elId, i, k, callback){
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      db.transaction(function (transaction) {
        transaction.executeSql('select id, currency_id, price, waste, name, amendment_pruning from elements where id = ?', [elId], function (transaction, result){
          if(result.rows.length)
            callback(new OkResult({"currency":result.rows.item(0), "index":i, "ix":k}));
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong when get element price'));
        });
      });
    },

    parseList: function(listId, callback){
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), currListId;
      var lists = [];
      var self = this;
      function addL(el){
        return lists.push(el);
      }
      addL(listId);
      (function nextRecord() {
        if (lists.length) {
          currListId = lists[0];
          db.transaction(function (transaction) {
            transaction.executeSql('select * from list_contents where parent_list_id = ?', [currListId], function(transaction, result){
              for (var i = 0; i < result.rows.length; i++) {
                elemLists.push({"elemLists":result.rows.item(i)});
                if(result.rows.item(i).child_type === 'list') {
                  addL(result.rows.item(i).child_id);
                }
              }
              nextRecord();
            });
          });
          lists.shift(0);
        } else {
          callback(new OkResult(elemLists));
        }
      })();
    },

    parseListHw: function(listIdHw, callback){
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), currListIdHw;
      var listsHw = [];
      var self = this;
      function addLHw(elHw){
        return listsHw.push(elHw);
      }
      addLHw(listIdHw);
      (function nextRecordHw() {
        if (listsHw.length) {
          currListIdHw = listsHw[0];
          db.transaction(function (transaction) {
            transaction.executeSql('select * from list_contents where parent_list_id = ?', [currListIdHw], function(transaction, result){
              for (var i = 0; i < result.rows.length; i++) {
                elemListsHw.push({"elemLists":result.rows.item(i)});
                if(result.rows.item(i).child_type === 'list') {
                  addLHw(result.rows.item(i).child_id);
                }
              }
              nextRecordHw();
            });
          });
          listsHw.shift(0);
        } else {
          callback(new OkResult(elemListsHw));
        }
      })();
    },

    parseListAdd: function(listIdAdd, callback){
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), currListIdAdd;
      var listsAdd = [];
      var self = this;
      function addLAdd(elAdd){
        return listsAdd.push(elAdd);
      }
      addLAdd(listIdAdd);
      (function nextRecordAdd() {
        if (listsAdd.length) {
          currListIdAdd = listsAdd[0];
          db.transaction(function (transaction) {
            transaction.executeSql('select * from list_contents where parent_list_id = ?', [currListIdAdd], function(transaction, result){
              for (var i = 0; i < result.rows.length; i++) {
                elemListsAdd.push({"elemLists":result.rows.item(i)});
                if(result.rows.item(i).child_type === 'list') {
                  addLAdd(result.rows.item(i).child_id);
                }
              }
              nextRecordAdd();
            });
          });
          listsAdd.shift(0);
        } else {
          callback(new OkResult(elemListsAdd));
        }
      })();
    },

    getValueByRule: function (parentValue, childValue, rule){
      var value = 0;
      switch (rule) {
        case 1:
          value = parentValue - childValue;
          break;
        case 3:
          value = (Math.round(parentValue) * childValue).toFixed(3);
          break;
        case 5:
          value = parentValue * childValue;
          break;
        case 6:
          value = (parentValue * childValue).toFixed(3);
          break;
        case 7:
          value = (parentValue * childValue).toFixed(3);
          break;
        case 8:
          value = (parentValue * childValue).toFixed(3);
          break;
        case 9:
          value = (parentValue * childValue).toFixed(3);
          break;
        case 12:
          value = (Math.round(parentValue) * childValue).toFixed(3);
          break;
        case 13:
          value = (parentValue * childValue).toFixed(3);
          break;
        case 14:
          value = (Math.round(parentValue) * childValue).toFixed(3);
          break;
        case 21:
          break;
        case 22:
          break;
        case 23:
          value = (parentValue * childValue).toFixed(3);
          break;
        default:
          value = childValue;
          break;
      }
      return value;
    },

    getByHardwareId: function(whId, construction, callback){
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      var self = this;
      db.transaction(function (transaction) {
        transaction.executeSql('select * from window_hardware where window_hardware_group_id = ? and child_id > 0 and count > 0', [whId], function (transaction, result){
          var hardwareresult = [];
          for(var i = 0; i < result.rows.length; i++){
            for(var j = 0; j < construction.sashesBlock.length; j++){
              if(result.rows.item(i).min_width > 0 && result.rows.item(i).max_width > 0 && construction.sashesBlock[j].sizes[0] >= result.rows.item(i).min_width && construction.sashesBlock[j].sizes[0] <= result.rows.item(i).max_width && result.rows.item(i).direction_id == 1 && result.rows.item(i).min_height == 0 && result.rows.item(i).max_height == 0) {
                if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                }
              } else if(result.rows.item(i).min_height > 0 && result.rows.item(i).max_height > 0 && construction.sashesBlock[j].sizes[1] >= result.rows.item(i).min_height && construction.sashesBlock[j].sizes[1] <= result.rows.item(i).max_height && result.rows.item(i).direction_id == 1 && result.rows.item(i).min_width == 0 && result.rows.item(i).max_width == 0) {
                if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                }
              } else if(result.rows.item(i).min_height > 0 && result.rows.item(i).max_height > 0 && construction.sashesBlock[j].sizes[1] >= result.rows.item(i).min_height && construction.sashesBlock[j].sizes[1] <= result.rows.item(i).max_height && result.rows.item(i).direction_id == 1 && result.rows.item(i).min_width > 0 && result.rows.item(i).max_width > 0 && construction.sashesBlock[j].sizes[0] >= result.rows.item(i).min_width && construction.sashesBlock[j].sizes[0] <= result.rows.item(i).max_width){
                if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                  hardwareresult.push({"elemLists":result.rows.item(i)});
                }
              } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).min_height == 0 && result.rows.item(i).max_height == 0 && result.rows.item(i).direction_id > 1 && result.rows.item(i).min_width == 0 && result.rows.item(i).max_width == 0){
                if(construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 2 && result.rows.item(i).direction_id == 3 || construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 4 && result.rows.item(i).direction_id == 2) {
                  if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  }
                }
              } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).min_height == 0 && result.rows.item(i).max_height == 0 && result.rows.item(i).direction_id > 1 && result.rows.item(i).min_width > 0 && result.rows.item(i).max_width > 0 && construction.sashesBlock[j].sizes[0] >= result.rows.item(i).min_width && construction.sashesBlock[j].sizes[0] <= result.rows.item(i).max_width){
                if(construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 2 && result.rows.item(i).direction_id == 3 || construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 4 && result.rows.item(i).direction_id == 2) {
                  if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  }
                }
              } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).min_width == 0 && result.rows.item(i).max_width == 0 && result.rows.item(i).direction_id > 1 && result.rows.item(i).min_height > 0 && result.rows.item(i).max_height > 0 && construction.sashesBlock[j].sizes[1] >= result.rows.item(i).min_height && construction.sashesBlock[j].sizes[1] <= result.rows.item(i).max_height){
                if(construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 2 && result.rows.item(i).direction_id == 3 || construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 4 && result.rows.item(i).direction_id == 2) {
                  if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  }
                }
              } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).min_width > 0 && result.rows.item(i).max_width > 0 && construction.sashesBlock[j].sizes[0] >= result.rows.item(i).min_width && construction.sashesBlock[j].sizes[0] <= result.rows.item(i).max_width && result.rows.item(i).direction_id > 1 && result.rows.item(i).min_height > 0 && result.rows.item(i).max_height > 0 && construction.sashesBlock[j].sizes[1] >= result.rows.item(i).min_height && construction.sashesBlock[j].sizes[1] <= result.rows.item(i).max_height){
                if(construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 2 && result.rows.item(i).direction_id == 3 || construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 4 && result.rows.item(i).direction_id == 2) {
                  if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  }
                }
              }
            }
          }
          self.hardwareListSync(hardwareresult, function (result){
            if(result.status){
              callback(new OkResult(result.data));
            } else {
              console.log(result);
            }
          });
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong when get data'));
        });
      });
    },

    hardwareListSync: function(hardwareresult, callback){
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), currListIdHw;
      var listsHw = [];
      var self = this;
      function addLHw(elHw, keysHw){
        return listsHw.push(elHw);
      }
      for(var i = 0; i < hardwareresult.length; i++){
        if(hardwareresult[i].elemLists.child_type == 'list'){
          addLHw(hardwareresult[i].elemLists.child_id);
        }
      }
      hardwareresult.push({"lists":listsHw});
      callback(new OkResult(hardwareresult));
    },

    calculationPrice: function (construction, callback) {
      var self = this;
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), price = 0, profSys, priceObj = {};
      this.getCurrentCurrency(construction.cityId, function (result){
        next_1(result);
      });
      function next_1(result){
        if(result.status){
          priceObj.currentCurrency = result.data;
          elemLists = [];
          self.parseList(construction.frameId, function (result){next_2(result);});
        } else {
          console.log(result);
        }
      }
      function next_2(result){
        if(result.status){
          priceObj.framesIds =  result.data;
          elemLists = [];
          self.parseList(construction.frameSillId, function (result){next_3(result);});
        } else {
          console.log(result);
        }
      }
      function next_3(result){
        if(result.status){
          priceObj.frameSillsIds =  result.data;
          elemLists = [];
          self.parseList(construction.sashId, function (result){next_4(result);});
        } else {
          console.log(result);
        }
      }
      function next_4(result){
        if(result.status){
          priceObj.sashsIds = result.data;
          elemLists = [];
          self.parseList(construction.impostId, function (result){next_5(result);});
        } else {
          console.log(result);
        }
      }
      function next_5(result) {
        if (result.status) {
          priceObj.impostIds = result.data;
          elemLists = [];
          self.parseList(construction.glassId, function (result){next_bead(result);});
        }
      }
      function next_bead(result){
        if (result.status) {
          priceObj.glassIds = result.data;
          elemLists = [];
          self.getByHardwareId(construction.hardwareId, construction, function (result){next_tmp(result);});
        }
      }
      function next_tmp(result){
        if (result.status) {
          priceObj.hardwareIds = result.data;
          elemLists = [];
          var ifList = false;
          for(var i = 0; i < priceObj.hardwareIds.length; i++){
            if("lists" in priceObj.hardwareIds[i]){
              if(priceObj.hardwareIds[i].lists.length > 0) {
                ifList = true;
              }
            }
          }
          if(ifList){
            next_hwlist(result.data);
          } else {
            self.parseList(construction.beadId, function (result){next_glass(result);});
          }
        }
      }
      function next_hwlist(result){
        for(var i = 0; i < priceObj.hardwareIds.length; i++){
          if("lists" in priceObj.hardwareIds[i]){
            if(priceObj.hardwareIds[i].lists.length > 0){
              self.parseList(priceObj.hardwareIds[i].lists[0], function (result){next_hwlist_res(result);});
            }
          }
        }
      }
      function next_hwlist_res(result){
        if (result.status) {
          //priceObj.hardwareIds.push({"hardwareLists":result.data});
          for(var i = 0; i < priceObj.hardwareIds.length; i++){
            if("lists" in priceObj.hardwareIds[i]){
              if(priceObj.hardwareIds[i].lists.length > 0){
                priceObj.hardwareIds.push({"hardwareLists":result.data, "parent_list_id":priceObj.hardwareIds[i].lists[0]});
                priceObj.hardwareIds[i].lists.shift(0);
              }
            }
          }
          next_tmp({"status":true, "data":priceObj.hardwareIds});
        }
      }
      function next_glass(result){
        if(result.status){
          priceObj.beadIds = result.data;
          elemLists = [];
          db.transaction(function (transaction) {
            transaction.executeSql('select parent_element_id, name from lists where id in (?, ?, ?, ?, ?, ?)', [construction.frameId, construction.frameSillId, construction.sashId, construction.impostId, construction.glassId, construction.beadId], function (transaction, result){next_6(result);}, function () {
              callback(new ErrorResult(2, 'Something went wrong when get parent_element_id'));
            });
          });
        } else {
          console.log(result);
        }
      }
      function next_6(result){
        if(result.rows.length){
          priceObj.framesIds.parent_element_id = result.rows.item(0).parent_element_id;
          priceObj.frameSillsIds.parent_element_id = result.rows.item(1).parent_element_id;
          priceObj.sashsIds.parent_element_id = result.rows.item(2).parent_element_id;
          priceObj.impostIds.parent_element_id = result.rows.item(3).parent_element_id;
          priceObj.glassIds.parent_element_id = result.rows.item(5).parent_element_id;
          priceObj.beadIds.parent_element_id = result.rows.item(4).parent_element_id;
          priceObj.framesIds.name = result.rows.item(0).name;
          priceObj.frameSillsIds.name = result.rows.item(1).name;
          priceObj.sashsIds.name = result.rows.item(2).name;
          priceObj.impostIds.name = result.rows.item(3).name;
          priceObj.glassIds.name = result.rows.item(5).name;
          priceObj.beadIds.name = result.rows.item(4).name;
          db.transaction(function (transaction) {
            transaction.executeSql('select id, currency_id, price, waste, name, amendment_pruning from elements where id in (?, ?, ?, ?, ?, ?)', [result.rows.item(0).parent_element_id, result.rows.item(1).parent_element_id, result.rows.item(2).parent_element_id, result.rows.item(3).parent_element_id, result.rows.item(4).parent_element_id, result.rows.item(5).parent_element_id], function (transaction, result){next_7(result);}, function () {
              callback(new ErrorResult(2, 'Something went wrong when get element price'));
            });
          });
        } else {
          console.log(result);
        }
      }
      function next_7(result) {
        if(result.rows.length){
          for (var i = 0; i < result.rows.length; i++) {
            if(result.rows.item(i).id == priceObj.framesIds.parent_element_id){
              priceObj.framesIds.price = result.rows.item(i);
            }
            if(result.rows.item(i).id == priceObj.frameSillsIds.parent_element_id){
              priceObj.frameSillsIds.price = result.rows.item(i);
            }
            if(result.rows.item(i).id == priceObj.sashsIds.parent_element_id){
              priceObj.sashsIds.price = result.rows.item(i);
            }
            if(result.rows.item(i).id == priceObj.impostIds.parent_element_id){
              priceObj.impostIds.price = result.rows.item(i);
            }
            if(result.rows.item(i).id == priceObj.glassIds.parent_element_id){
              priceObj.glassIds.price = result.rows.item(i);
            }
            if(result.rows.item(i).id == priceObj.beadIds.parent_element_id){
              priceObj.beadIds.price = result.rows.item(i);
            }
          }
          if(priceObj.framesIds.length) {
            for (var i = 0; i < priceObj.framesIds.length; i++) {
              if (priceObj.framesIds[i].elemLists.child_type === 'element'){
                self.getPriceById(priceObj.framesIds[i].elemLists.child_id, i, i, function (result){
                  priceObj.framesIds[result.data.index].priceEl = result.data.currency;
                  priceObj.framesIds[result.data.index].elemName = result.data.currency.name;
                  priceObj.framesIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              } else {
                self.getPriceByIdList(priceObj.framesIds[i].elemLists.child_id, i, i, function (result){
                  priceObj.framesIds[result.data.index].priceEl = result.data.currency;
                  priceObj.framesIds[result.data.index].elemName = result.data.currency.name;
                  priceObj.framesIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              }
            }
          }
          if(priceObj.frameSillsIds.length) {
            for (var i = 0; i < priceObj.frameSillsIds.length; i++) {
              if (priceObj.frameSillsIds[i].elemLists.child_type === 'element'){
                self.getPriceById(priceObj.frameSillsIds[i].elemLists.child_id, i, i, function (result){
                  priceObj.frameSillsIds[result.data.index].priceEl = result.data.currency;
                  priceObj.frameSillsIds[result.data.index].elemName = result.data.currency.name;
                  priceObj.frameSillsIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              } else {
                self.getPriceByIdList(priceObj.frameSillsIds[i].elemLists.child_id, i, i, function (result){
                  priceObj.frameSillsIds[result.data.index].priceEl = result.data.currency;
                  priceObj.frameSillsIds[result.data.index].elemName = result.data.currency.name;
                  priceObj.frameSillsIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              }
            }
          }
          if(priceObj.sashsIds.length) {
            for (var i = 0; i < priceObj.sashsIds.length; i++) {
              if (priceObj.sashsIds[i].elemLists.child_type === 'element'){
                self.getPriceById(priceObj.sashsIds[i].elemLists.child_id, i, i, function (result){
                  priceObj.sashsIds[result.data.index].priceEl = result.data.currency;
                  priceObj.sashsIds[result.data.index].elemName = result.data.currency.name;
                  priceObj.sashsIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              } else {
                self.getPriceByIdList(priceObj.sashsIds[i].elemLists.child_id, i, i, function (result){
                  priceObj.sashsIds[result.data.index].priceEl = result.data.currency;
                  priceObj.sashsIds[result.data.index].elemName = result.data.currency.name;
                  priceObj.sashsIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              }
            }
          }
          if(priceObj.impostIds.length) {
            for (var i = 0; i < priceObj.impostIds.length; i++) {
              if (priceObj.impostIds[i].elemLists.child_type === 'element'){
                self.getPriceById(priceObj.impostIds[i].elemLists.child_id, i, i, function (result){
                  priceObj.impostIds[result.data.index].priceEl = result.data.currency;
                  priceObj.impostIds[result.data.index].elemName = result.data.currency.name;
                  priceObj.impostIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              } else {
                self.getPriceByIdList(priceObj.impostIds[i].elemLists.child_id, i, i, function (result){
                  priceObj.impostIds[result.data.index].priceEl = result.data.currency;
                  priceObj.impostIds[result.data.index].elemName = result.data.currency.name;
                  priceObj.impostIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              }
            }
          }
          if(priceObj.glassIds.length) {
            for (var i = 0; i < priceObj.glassIds.length; i++) {
              if (priceObj.glassIds[i].elemLists.child_type === 'element'){
                self.getPriceById(priceObj.glassIds[i].elemLists.child_id, i, i, function (result){
                  priceObj.glassIds[result.data.index].priceEl = result.data.currency;
                  priceObj.glassIds[result.data.index].elemName = result.data.currency.name;
                  priceObj.glassIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              } else {
                self.getPriceByIdList(priceObj.glassIds[i].elemLists.child_id, i, i, function (result){
                  priceObj.glassIds[result.data.index].priceEl = result.data.currency;
                  priceObj.glassIds[result.data.index].elemName = result.data.currency.name;
                  priceObj.glassIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              }
            }
          }
          if(priceObj.beadIds.length) {
            for (var i = 0; i < priceObj.beadIds.length; i++) {
              if (priceObj.beadIds[i].elemLists.child_type === 'element'){
                self.getPriceById(priceObj.beadIds[i].elemLists.child_id, i, i, function (result){
                  priceObj.beadIds[result.data.index].priceEl = result.data.currency;
                  priceObj.beadIds[result.data.index].elemName = result.data.currency.name;
                  priceObj.beadIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              } else {
                self.getPriceByIdList(priceObj.beadIds[i].elemLists.child_id, i, i, function (result){
                  priceObj.beadIds[result.data.index].priceEl = result.data.currency;
                  priceObj.beadIds[result.data.index].elemName = result.data.currency.name;
                  priceObj.beadIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              }
            }
          }
          if(priceObj.hardwareIds.length) {
            for (var i = 0; i < priceObj.hardwareIds.length; i++) {
              if(priceObj.hardwareIds[i].elemLists){
                if (priceObj.hardwareIds[i].elemLists.child_type === 'element'){
                  if(priceObj.hardwareIds[i].elemLists.child_id > 0){
                    self.getPriceById(priceObj.hardwareIds[i].elemLists.child_id, i, i, function (result){
                      priceObj.hardwareIds[result.data.index].priceEl = result.data.currency;
                      priceObj.hardwareIds[result.data.index].elemName = result.data.currency.name;
                      priceObj.hardwareIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                    });
                  }
                } else {
                  if(priceObj.hardwareIds[i].elemLists.child_id > 0) {
                    self.getPriceByIdList(priceObj.hardwareIds[i].elemLists.child_id, i, i, function (result) {
                      priceObj.hardwareIds[result.data.index].priceEl = result.data.currency;
                      priceObj.hardwareIds[result.data.index].elemName = result.data.currency.name;
                      priceObj.hardwareIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                    });
                  }
                }
              }
            }
          }
          if(priceObj.hardwareIds.length) {
            for (var i = 0; i < priceObj.hardwareIds.length; i++) {
              if(priceObj.hardwareIds[i].hardwareLists){
                for (var k = 0; k < priceObj.hardwareIds[i].hardwareLists.length; k++) {
                  if (priceObj.hardwareIds[i].hardwareLists[k].elemLists.child_type === 'element') {
                    self.getPriceById(priceObj.hardwareIds[i].hardwareLists[k].elemLists.child_id, i, k, function (result) {
                      priceObj.hardwareIds[result.data.index].hardwareLists[result.data.ix].priceEl = result.data.currency;
                      priceObj.hardwareIds[result.data.index].hardwareLists[result.data.ix].elemName = result.data.currency.name;
                      priceObj.hardwareIds[result.data.index].hardwareLists[result.data.ix].pruning = result.data.currency.amendment_pruning;
                    });
                  } else {
                    self.getPriceByIdList(priceObj.hardwareIds[i].hardwareLists[k].elemLists.child_id, i, k, function (result) {
                      priceObj.hardwareIds[result.data.index].hardwareLists[result.data.ix].priceEl = result.data.currency;
                      priceObj.hardwareIds[result.data.index].hardwareLists[result.data.ix].elemName = result.data.currency.name;
                      priceObj.hardwareIds[result.data.index].hardwareLists[result.data.ix].pruning = result.data.currency.amendment_pruning;
                    });
                  }
                }
              }
            }
          }
          db.transaction(function (transaction) {
            transaction.executeSql('select id, name, value from currencies', [], function (transaction, result){next_8(result);}, function () {
              callback(new ErrorResult(2, 'Something went wrong when get parent_element_id'));
            });
          });
        } else {
          console.log(result);
        }
      }
      function next_8(result) {
        if(result.rows.length){
          priceObj.currencies = [];
          priceObj.price = 0;
          for (var i = 0; i < result.rows.length; i++) {
            priceObj.currencies.push(result.rows.item(i));
          }
          var priceTmp = 0;
          if(construction.framesSize.length) {
            for (var i = 0; i < construction.framesSize.length; i++) {
              priceTmp += (((construction.framesSize[i] + priceObj.framesIds.price.amendment_pruning)/ 1000) * priceObj.framesIds.price.price) * (1 + (priceObj.framesIds.price.waste / 100));
            }
            if (priceObj.currentCurrency.id != priceObj.framesIds.price.currency_id){
              for (var i = 0; i < priceObj.currencies.length; i++) {
                if(priceObj.currencies[i].id == priceObj.framesIds.price.currency_id){
                  priceTmp = priceTmp * priceObj.currencies[i].value;
                }
              }
            }
          }
          priceObj.price += priceTmp;
          construction.framesSize.shift();
          var priceTmp = 0;
          if(construction.sashsSize.length) {
            for (var i = 0; i < construction.sashsSize.length; i++) {
              priceTmp += (((construction.sashsSize[i] + priceObj.sashsIds.price.amendment_pruning)/ 1000) * priceObj.sashsIds.price.price) * (1 + (priceObj.sashsIds.price.waste / 100));
            }
            if (priceObj.currentCurrency.id != priceObj.sashsIds.price.currency_id){
              for (var i = 0; i < priceObj.currencies.length; i++) {
                if(priceObj.currencies[i].id == priceObj.sashsIds.price.currency_id){
                  priceTmp = priceTmp * priceObj.currencies[i].value;
                }
              }
            }
          }
          priceObj.price += priceTmp;
          var priceTmp = 0;
          if(construction.beadsSize.length) {
            for (var i = 0; i < construction.beadsSize.length; i++) {
              priceTmp += (((construction.beadsSize[i] + priceObj.beadIds.price.amendment_pruning)/ 1000) * priceObj.beadIds.price.price) * (1 + (priceObj.beadIds.price.waste / 100));
            }
            if (priceObj.currentCurrency.id != priceObj.beadIds.price.currency_id){
              for (var i = 0; i < priceObj.currencies.length; i++) {
                if(priceObj.currencies[i].id == priceObj.beadIds.price.currency_id){
                  priceTmp = priceTmp * priceObj.currencies[i].value;
                }
              }
            }
          }
          priceObj.price += priceTmp;
          var priceTmp = 0;
          if(construction.impostsSize.length) {
            for (var i = 0; i < construction.impostsSize.length; i++) {
              priceTmp += (((construction.impostsSize[i] + priceObj.impostIds.price.amendment_pruning)/ 1000) * priceObj.impostIds.price.price) * (1 + (priceObj.impostIds.price.waste / 100));
            }
            if (priceObj.currentCurrency.id != priceObj.impostIds.price.currency_id){
              for (var i = 0; i < priceObj.currencies.length; i++) {
                if(priceObj.currencies[i].id == priceObj.impostIds.price.currency_id){
                  priceTmp = priceTmp * priceObj.currencies[i].value;
                }
              }
            }
          }
          priceObj.price += priceTmp;
          var priceTmp = 0;
          if(construction.glassSquares.length) {
            for (var i = 0; i < construction.glassSquares.length; i++) {
              priceTmp += construction.glassSquares[i] * priceObj.glassIds.price.price;
            }
            if (priceObj.currentCurrency.id != priceObj.glassIds.price.currency_id){
              for (var i = 0; i < priceObj.currencies.length; i++) {
                if(priceObj.currencies[i].id == priceObj.glassIds.price.currency_id){
                  priceTmp = priceTmp * priceObj.currencies[i].value;
                }
              }
            }
          }
          priceObj.price += priceTmp;
//======== Рама - начало
          if(construction.framesSize.length) {
            for (var i = 0; i < construction.framesSize.length; i++) {
              if(priceObj.framesIds.length) {
                for (var j = 0; j < priceObj.framesIds.length; j++) {
                  var priceTmp = 0;
                  if(priceObj.framesIds[j].elemLists.parent_list_id == construction.frameId){
                    var value = self.getValueByRule(((construction.framesSize[i]+priceObj.framesIds[j].priceEl.amendment_pruning)/1000), priceObj.framesIds[j].elemLists.value, priceObj.framesIds[j].elemLists.rules_type_id);
                    priceObj.framesIds[j].elemLists.newValue = value;
                    if(priceObj.framesIds[j].elemLists.rules_type_id === 3){
                      priceTmp += (Math.round(((construction.framesSize[i]+priceObj.framesIds[j].priceEl.amendment_pruning)/1000)*priceObj.framesIds[j].elemLists.value)*priceObj.framesIds[j].priceEl.price)*(1+(priceObj.framesIds[j].priceEl.waste/100));
                    } else if(priceObj.framesIds[j].elemLists.rules_type_id === 2 || priceObj.framesIds[j].elemLists.rules_type_id === 4 || priceObj.framesIds[j].elemLists.rules_type_id === 15){
                      priceTmp += (priceObj.framesIds[j].elemLists.value * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                    } else if (priceObj.framesIds[j].elemLists.rules_type_id === 1){
                      priceTmp += (((construction.framesSize[i]+priceObj.framesIds[j].priceEl.amendment_pruning - (priceObj.framesIds[j].elemLists.value*1000))/1000) * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                    } else {
                      priceTmp += (((construction.framesSize[i]+priceObj.framesIds[j].priceEl.amendment_pruning)/1000) * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                    }
                    if (priceObj.currentCurrency.id != priceObj.framesIds[j].priceEl.currency_id){
                      for (var k = 0; k < priceObj.currencies.length; k++) {
                        if(priceObj.currencies[k].id == priceObj.framesIds[j].priceEl.currency_id){
                          priceTmp = priceTmp * priceObj.currencies[k].value;
                        }
                      }
                    }
                  } else {
                    for (var g = 0; g < priceObj.framesIds.length; g++) {
                      if(priceObj.framesIds[j].elemLists.parent_list_id == priceObj.framesIds[g].elemLists.child_id){
                        var value = self.getValueByRule(priceObj.framesIds[g].elemLists.newValue, priceObj.framesIds[g].elemLists.value, priceObj.framesIds[g].elemLists.rules_type_id);
                        priceObj.framesIds[j].elemLists.newValue = value;
                        if(priceObj.framesIds[j].elemLists.rules_type_id === 3){
                          priceTmp += (Math.round((priceObj.framesIds[g].elemLists.newValue+priceObj.framesIds[j].priceEl.amendment_pruning)*priceObj.framesIds[j].elemLists.value)*priceObj.framesIds[j].priceEl.price)*(1+(priceObj.framesIds[j].priceEl.waste/100));
                        } else if(priceObj.framesIds[j].elemLists.rules_type_id === 2 || priceObj.framesIds[j].elemLists.rules_type_id === 4 || priceObj.framesIds[j].elemLists.rules_type_id === 15){
                          priceTmp += (priceObj.framesIds[g].elemLists.newValue*priceObj.framesIds[j].elemLists.value * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                        } else if (priceObj.framesIds[j].elemLists.rules_type_id === 1){
                          priceTmp += (((priceObj.framesIds[g].elemLists.newValue+priceObj.framesIds[j].priceEl.amendment_pruning - (priceObj.framesIds[j].elemLists.value*1000))/1000) * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                        } else {
                          priceTmp += (((priceObj.framesIds[g].elemLists.newValue+priceObj.framesIds[j].priceEl.amendment_pruning)/1000) * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                        }
                        if (priceObj.currentCurrency.id != priceObj.framesIds[j].priceEl.currency_id){
                          for (var k = 0; k < priceObj.currencies.length; k++) {
                            if(priceObj.currencies[k].id == priceObj.framesIds[j].priceEl.currency_id){
                              priceTmp = priceTmp * priceObj.currencies[k].value;
                            }
                          }
                        }
                      }
                    }
                  }
                  priceObj.price += priceTmp;
                }
              }
            }
          }
//===== Рама - конец
//====== Подоконный профиль - начало
          if(construction.frameSillSize) {
            if(priceObj.frameSillsIds.length) {
              for (var j = 0; j < priceObj.frameSillsIds.length; j++) {
                var priceTmp = 0;
                if(priceObj.frameSillsIds[j].elemLists.parent_list_id == construction.frameSillId){
                  var value = self.getValueByRule(((construction.frameSillSize+priceObj.frameSillsIds[j].priceEl.amendment_pruning)/1000), priceObj.frameSillsIds[j].elemLists.value, priceObj.frameSillsIds[j].elemLists.rules_type_id);
                  priceObj.frameSillsIds[j].elemLists.newValue = value;
                  if(priceObj.frameSillsIds[j].elemLists.rules_type_id === 3){
                    priceTmp += (Math.round(((construction.frameSillSize+priceObj.frameSillsIds[j].priceEl.amendment_pruning)/1000)*priceObj.frameSillsIds[j].elemLists.value)*priceObj.frameSillsIds[j].priceEl.price)*(1+(priceObj.frameSillsIds[j].priceEl.waste/100));
                  } else if(priceObj.frameSillsIds[j].elemLists.rules_type_id === 2 || priceObj.frameSillsIds[j].elemLists.rules_type_id === 4 || priceObj.frameSillsIds[j].elemLists.rules_type_id === 15){
                    priceTmp += (priceObj.frameSillsIds[j].elemLists.value * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
                  } else if (priceObj.frameSillsIds[j].elemLists.rules_type_id === 1){
                    priceTmp += (((construction.frameSillSize+priceObj.frameSillsIds[j].priceEl.amendment_pruning - (priceObj.frameSillsIds[j].elemLists.value*1000))/1000) * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
                  } else {
                    priceTmp += (((construction.frameSillSize+priceObj.frameSillsIds[j].priceEl.amendment_pruning)/1000) * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
                  }
                  if (priceObj.currentCurrency.id != priceObj.frameSillsIds[j].priceEl.currency_id){
                    for (var k = 0; k < priceObj.currencies.length; k++) {
                      if(priceObj.currencies[k].id == priceObj.frameSillsIds[j].priceEl.currency_id){
                        priceTmp = priceTmp * priceObj.currencies[k].value;
                      }
                    }
                  }
                } else {
                  for (var g = 0; g < priceObj.frameSillsIds.length; g++) {
                    if(priceObj.frameSillsIds[j].elemLists.parent_list_id == priceObj.frameSillsIds[g].elemLists.child_id){
                      var value = self.getValueByRule(priceObj.frameSillsIds[g].elemLists.newValue, priceObj.frameSillsIds[j].elemLists.value, priceObj.frameSillsIds[g].elemLists.rules_type_id);
                      priceObj.frameSillsIds[j].elemLists.newValue = value;
                      if(priceObj.frameSillsIds[j].elemLists.rules_type_id === 3){
                        priceTmp += (Math.round((priceObj.frameSillsIds[g].elemLists.newValue+priceObj.frameSillsIds[j].priceEl.amendment_pruning)*priceObj.frameSillsIds[j].elemLists.value)*priceObj.frameSillsIds[j].priceEl.price)*(1+(priceObj.frameSillsIds[j].priceEl.waste/100));
                      } else if(priceObj.frameSillsIds[j].elemLists.rules_type_id === 2 || priceObj.frameSillsIds[j].elemLists.rules_type_id === 4 || priceObj.frameSillsIds[j].elemLists.rules_type_id === 15){
                        priceTmp += (priceObj.frameSillsIds[j].elemLists.value * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
                      } else if (priceObj.frameSillsIds[j].elemLists.rules_type_id === 1){
                        priceTmp += (((priceObj.frameSillsIds[g].elemLists.newValue+priceObj.frameSillsIds[j].priceEl.amendment_pruning - (priceObj.frameSillsIds[j].elemLists.value*1000))) * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
                      } else {
                        priceTmp += (((priceObj.frameSillsIds[g].elemLists.newValue+priceObj.frameSillsIds[j].priceEl.amendment_pruning)/1000) * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
                      }
                      if (priceObj.currentCurrency.id != priceObj.frameSillsIds[j].priceEl.currency_id){
                        for (var k = 0; k < priceObj.currencies.length; k++) {
                          if(priceObj.currencies[k].id == priceObj.frameSillsIds[j].priceEl.currency_id){
                            priceTmp = priceTmp * priceObj.currencies[k].value;
                          }
                        }
                      }
                    }
                  }
                }
                priceObj.price += priceTmp;
              }
            }
          }
          //======== Подоконный профиль - конец

          //======== Створка - начало
          if(construction.sashsSize.length) {
            for (var i = 0; i < construction.sashsSize.length; i++) {
              if(priceObj.sashsIds.length) {
                for (var j = 0; j < priceObj.sashsIds.length; j++) {
                  var priceTmp = 0;
                  if(priceObj.sashsIds[j].elemLists.parent_list_id == construction.sashId){
                    var value = self.getValueByRule(((construction.sashsSize[i]+priceObj.sashsIds[j].priceEl.amendment_pruning)/1000), priceObj.sashsIds[j].elemLists.value, priceObj.sashsIds[j].elemLists.rules_type_id);
                    priceObj.sashsIds[j].elemLists.newValue = value;
                    if(priceObj.sashsIds[j].elemLists.rules_type_id === 3){
                      priceTmp += (Math.round(((construction.sashsSize[i]+priceObj.sashsIds[j].priceEl.amendment_pruning)/1000)*priceObj.sashsIds[j].elemLists.value)*priceObj.sashsIds[j].priceEl.price)*(1+(priceObj.sashsIds[j].priceEl.waste/100));
                    } else if(priceObj.sashsIds[j].elemLists.rules_type_id === 2 || priceObj.sashsIds[j].elemLists.rules_type_id === 4 || priceObj.sashsIds[j].elemLists.rules_type_id === 15){
                      priceTmp += (priceObj.sashsIds[j].elemLists.value * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
                    } else if (priceObj.sashsIds[j].elemLists.rules_type_id === 1){
                      priceTmp += (((construction.sashsSize[i]+priceObj.sashsIds[j].priceEl.amendment_pruning - (priceObj.sashsIds[j].elemLists.value*1000))/1000) * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
                    } else {
                      priceTmp += (((construction.sashsSize[i]+priceObj.sashsIds[j].priceEl.amendment_pruning)/1000) * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
                    }
                    if (priceObj.currentCurrency.id != priceObj.sashsIds[j].priceEl.currency_id){
                      for (var k = 0; k < priceObj.currencies.length; k++) {
                        if(priceObj.currencies[k].id == priceObj.sashsIds[j].priceEl.currency_id){
                          priceTmp = priceTmp * priceObj.currencies[k].value;
                        }
                      }
                    }
                  } else {
                    for (var g = 0; g < priceObj.sashsIds.length; g++) {
                      if(priceObj.sashsIds[j].elemLists.parent_list_id == priceObj.sashsIds[g].elemLists.child_id){
                        var value = self.getValueByRule((priceObj.sashsIds[g].elemLists.newValue/1000), priceObj.sashsIds[j].elemLists.value, priceObj.sashsIds[g].elemLists.rules_type_id);
                        priceObj.sashsIds[j].elemLists.newValue = value;
                        if(priceObj.sashsIds[j].elemLists.rules_type_id === 3){
                          priceTmp += (Math.round((priceObj.sashsIds[g].elemLists.newValue+(priceObj.sashsIds[j].priceEl.amendment_pruning/1000))*priceObj.sashsIds[j].elemLists.value)*priceObj.sashsIds[j].priceEl.price)*(1+(priceObj.sashsIds[j].priceEl.waste/100));
                        } else if(priceObj.sashsIds[j].elemLists.rules_type_id === 2 || priceObj.sashsIds[j].elemLists.rules_type_id === 4 || priceObj.sashsIds[j].elemLists.rules_type_id === 15){
                          priceTmp += (priceObj.sashsIds[g].elemLists.newValue*priceObj.sashsIds[j].elemLists.value * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
                        } else if (priceObj.sashsIds[j].elemLists.rules_type_id === 1){
                          priceTmp += (((priceObj.sashsIds[g].elemLists.newValue+priceObj.sashsIds[j].priceEl.amendment_pruning - (priceObj.sashsIds[j].elemLists.value*1000))/1000) * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
                        } else {
                          priceTmp += (((priceObj.sashsIds[g].elemLists.newValue+priceObj.sashsIds[j].priceEl.amendment_pruning)/1000) * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
                        }
                        if (priceObj.currentCurrency.id != priceObj.sashsIds[j].priceEl.currency_id){
                          for (var k = 0; k < priceObj.currencies.length; k++) {
                            if(priceObj.currencies[k].id == priceObj.sashsIds[j].priceEl.currency_id){
                              priceTmp = priceTmp * priceObj.currencies[k].value;
                            }
                          }
                        }
                      }
                    }
                  }
                  priceObj.price += priceTmp;
                }
              }
            }
          }
          //======== Створка - конец
          //======== Штапик - начало
          if(construction.beadsSize.length) {
            for (var i = 0; i < construction.beadsSize.length; i++) {
              if(priceObj.beadIds.length) {
                for (var j = 0; j < priceObj.beadIds.length; j++) {
                  var priceTmp = 0;
                  if(priceObj.beadIds[j].elemLists.parent_list_id == construction.beadId){
                    var value = self.getValueByRule(((construction.beadsSize[i]+priceObj.beadIds[j].priceEl.amendment_pruning)/1000), priceObj.beadIds[j].elemLists.value, priceObj.beadIds[j].elemLists.rules_type_id);
                    priceObj.beadIds[j].elemLists.newValue = value;
                    if(priceObj.beadIds[j].elemLists.rules_type_id === 3){
                      priceTmp += (Math.round(((construction.beadsSize[i]+priceObj.beadIds[j].priceEl.amendment_pruning)/1000)*priceObj.beadIds[j].elemLists.value)*priceObj.beadIds[j].priceEl.price)*(1+(priceObj.beadIds[j].priceEl.waste/100));
                    } else if(priceObj.beadIds[j].elemLists.rules_type_id === 2 || priceObj.beadIds[j].elemLists.rules_type_id === 4 || priceObj.beadIds[j].elemLists.rules_type_id === 15){
                      priceTmp += (priceObj.beadIds[j].elemLists.value * priceObj.beadIds[j].priceEl.price) * (1 + (priceObj.beadIds[j].priceEl.waste / 100));
                    } else if (priceObj.beadIds[j].elemLists.rules_type_id === 1){
                      priceTmp += (((construction.beadsSize[i]+priceObj.beadIds[j].priceEl.amendment_pruning - (priceObj.beadIds[j].elemLists.value*1000))/1000) * priceObj.beadIds[j].priceEl.price) * (1 + (priceObj.beadIds[j].priceEl.waste / 100));
                    } else {
                      priceTmp += (((construction.beadsSize[i]+priceObj.beadIds[j].priceEl.amendment_pruning)/1000) * priceObj.beadIds[j].priceEl.price) * (1 + (priceObj.beadIds[j].priceEl.waste / 100));
                    }
                    if (priceObj.currentCurrency.id != priceObj.beadIds[j].priceEl.currency_id){
                      for (var k = 0; k < priceObj.currencies.length; k++) {
                        if(priceObj.currencies[k].id == priceObj.beadIds[j].priceEl.currency_id){
                          priceTmp = priceTmp * priceObj.currencies[k].value;
                        }
                      }
                    }
                  } else {
                    for (var g = 0; g < priceObj.beadIds.length; g++) {
                      if(priceObj.beadIds[j].elemLists.parent_list_id == priceObj.beadIds[g].elemLists.child_id){
                        var value = self.getValueByRule((priceObj.beadIds[g].elemLists.newValue/1000), priceObj.beadIds[j].elemLists.value, priceObj.beadIds[g].elemLists.rules_type_id);
                        priceObj.beadIds[j].elemLists.newValue = value;
                        if(priceObj.beadIds[j].elemLists.rules_type_id === 3){
                          priceTmp += (Math.round((priceObj.beadIds[g].elemLists.newValue+(priceObj.beadIds[j].priceEl.amendment_pruning/1000))*priceObj.beadIds[j].elemLists.value)*priceObj.beadIds[j].priceEl.price)*(1+(priceObj.beadIds[j].priceEl.waste/100));
                        } else if(priceObj.beadIds[j].elemLists.rules_type_id === 2 || priceObj.beadIds[j].elemLists.rules_type_id === 4 || priceObj.beadIds[j].elemLists.rules_type_id === 15){
                          priceTmp += (priceObj.beadIds[g].elemLists.newValue*priceObj.beadIds[j].elemLists.value * priceObj.beadIds[j].priceEl.price) * (1 + (priceObj.beadIds[j].priceEl.waste / 100));
                        } else if (priceObj.beadIds[j].elemLists.rules_type_id === 1){
                          priceTmp += (((priceObj.beadIds[g].elemLists.newValue+priceObj.beadIds[j].priceEl.amendment_pruning - (priceObj.beadIds[j].elemLists.value*1000))/1000) * priceObj.beadIds[j].priceEl.price) * (1 + (priceObj.beadIds[j].priceEl.waste / 100));
                        } else {
                          priceTmp += (((priceObj.beadIds[g].elemLists.newValue+priceObj.beadIds[j].priceEl.amendment_pruning)/1000) * priceObj.beadIds[j].priceEl.price) * (1 + (priceObj.beadIds[j].priceEl.waste / 100));
                        }
                        if (priceObj.currentCurrency.id != priceObj.beadIds[j].priceEl.currency_id){
                          for (var k = 0; k < priceObj.currencies.length; k++) {
                            if(priceObj.currencies[k].id == priceObj.beadIds[j].priceEl.currency_id){
                              priceTmp = priceTmp * priceObj.currencies[k].value;
                            }
                          }
                        }
                      }
                    }
                  }
                  priceObj.price += priceTmp;
                }
              }
            }
          }
          //======= Штапик - конец
          //======= Импост - начало
          if(construction.impostsSize.length) {
            for (var i = 0; i < construction.impostsSize.length; i++) {
              if(priceObj.impostIds.length) {
                for (var j = 0; j < priceObj.impostIds.length; j++) {
                  var priceTmp = 0;
                  if(priceObj.impostIds[j].elemLists.parent_list_id == construction.impostId){
                    var value = self.getValueByRule(((construction.impostsSize[i]+priceObj.impostIds[j].priceEl.amendment_pruning)/1000), priceObj.impostIds[j].elemLists.value, priceObj.impostIds[j].elemLists.rules_type_id);
                    priceObj.impostIds[j].elemLists.newValue = value;
                    if(priceObj.impostIds[j].elemLists.rules_type_id === 3){
                      priceTmp += (Math.round(((construction.impostsSize[i]+priceObj.impostIds[j].priceEl.amendment_pruning)/1000)*priceObj.impostIds[j].elemLists.value)*priceObj.impostIds[j].priceEl.price)*(1+(priceObj.impostIds[j].priceEl.waste/100));
                    } else if(priceObj.impostIds[j].elemLists.rules_type_id === 2 || priceObj.impostIds[j].elemLists.rules_type_id === 4 || priceObj.impostIds[j].elemLists.rules_type_id === 15){
                      priceTmp += (priceObj.impostIds[j].elemLists.value * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
                    } else if (priceObj.impostIds[j].elemLists.rules_type_id === 1){
                      priceTmp += (((construction.impostsSize[i]+priceObj.impostIds[j].priceEl.amendment_pruning - (priceObj.impostIds[j].elemLists.value*1000))/1000) * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
                    } else {
                      console.log('Формула : ('+(construction.sashsSize[i]+priceObj.framesIds[j].priceEl.amendment_pruning)/1000+'*'+priceObj.impostIds[j].priceEl.price+')*(1+('+priceObj.impostIds[j].priceEl.waste+'/100) = '+((((construction.impostsSize[i]+priceObj.impostIds[j].priceEl.amendment_pruning)/1000) * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100))).toFixed(2));
                      priceTmp += (((construction.impostsSize[i]+priceObj.impostIds[j].priceEl.amendment_pruning)/1000) * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
                    }
                    if (priceObj.currentCurrency.id != priceObj.impostIds[j].priceEl.currency_id){
                      for (var k = 0; k < priceObj.currencies.length; k++) {
                        if(priceObj.currencies[k].id == priceObj.impostIds[j].priceEl.currency_id){
                          priceTmp = priceTmp * priceObj.currencies[k].value;
                        }
                      }
                    }
                  } else {
                    for (var g = 0; g < priceObj.impostIds.length; g++) {
                      if(priceObj.impostIds[j].elemLists.parent_list_id == priceObj.impostIds[g].elemLists.child_id){
                        var value = self.getValueByRule(priceObj.impostIds[g].elemLists.newValue, priceObj.impostIds[j].elemLists.value, priceObj.impostIds[g].elemLists.rules_type_id);
                        priceObj.impostIds[j].elemLists.newValue = value;
                        if(priceObj.impostIds[j].elemLists.rules_type_id === 3){
                          priceTmp += (Math.round((priceObj.impostIds[g].elemLists.newValue+(priceObj.impostIds[j].priceEl.amendment_pruning/1000))*priceObj.impostIds[j].elemLists.value)*priceObj.impostIds[j].priceEl.price)*(1+(priceObj.impostIds[j].priceEl.waste/100));
                        } else if(priceObj.impostIds[j].elemLists.rules_type_id === 2 || priceObj.impostIds[j].elemLists.rules_type_id === 4 || priceObj.impostIds[j].elemLists.rules_type_id === 15){
                          priceTmp += (priceObj.impostIds[g].elemLists.newValue*priceObj.impostIds[j].elemLists.value * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
                        } else if (priceObj.impostIds[j].elemLists.rules_type_id === 1){
                          priceTmp += (((priceObj.impostIds[g].elemLists.newValue+priceObj.impostIds[j].priceEl.amendment_pruning - (priceObj.impostIds[j].elemLists.value*1000))/1000) * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
                        } else {
                          priceTmp += (((priceObj.impostIds[g].elemLists.newValue+priceObj.impostIds[j].priceEl.amendment_pruning)/1000) * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
                        }
                        if (priceObj.currentCurrency.id != priceObj.impostIds[j].priceEl.currency_id){
                          for (var k = 0; k < priceObj.currencies.length; k++) {
                            if(priceObj.currencies[k].id == priceObj.impostIds[j].priceEl.currency_id){
                              priceTmp = priceTmp * priceObj.currencies[k].value;
                            }
                          }
                        }
                      }
                    }
                  }
                  priceObj.price += priceTmp;
                }
              }
            }
          }
          //====== Импост - конец
          //====== Стеклопакет - начало
          if(construction.glassSquares.length) {
            for (var i = 0; i < construction.glassSquares.length; i++) {
              if(priceObj.glassIds.length) {
                for (var j = 0; j < priceObj.glassIds.length; j++) {
                  var priceTmp = 0;
                  if(priceObj.glassIds[j].elemLists.parent_list_id == construction.glassId){
                    var value = self.getValueByRule(1, priceObj.glassIds[j].elemLists.value, priceObj.glassIds[j].elemLists.rules_type_id);
                    priceObj.glassIds[j].elemLists.newValue = value;
                    if(priceObj.glassIds[j].elemLists.rules_type_id === 3){
                      priceTmp += (Math.round((1+priceObj.glassIds[j].priceEl.amendment_pruning)*priceObj.glassIds[j].elemLists.value)*priceObj.glassIds[j].priceEl.price)*(1+(priceObj.glassIds[j].priceEl.waste/100));
                    } else if(priceObj.glassIds[j].elemLists.rules_type_id === 2 || priceObj.glassIds[j].elemLists.rules_type_id === 4 || priceObj.glassIds[j].elemLists.rules_type_id === 15){
                      priceTmp += (priceObj.glassIds[j].elemLists.value * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
                    } else if (priceObj.glassIds[j].elemLists.rules_type_id === 1){
                      priceTmp += (((priceObj.glassIds[g].elemLists.newValue+priceObj.glassIds[j].priceEl.amendment_pruning - (priceObj.glassIds[j].elemLists.value*100))) * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
                    } else {
                      priceTmp += (((1+priceObj.glassIds[j].priceEl.amendment_pruning)/1000) * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
                    }
                    if (priceObj.currentCurrency.id != priceObj.glassIds[j].priceEl.currency_id){
                      for (var k = 0; k < priceObj.currencies.length; k++) {
                        if(priceObj.currencies[k].id == priceObj.glassIds[j].priceEl.currency_id){
                          priceTmp = priceTmp * priceObj.currencies[k].value;
                        }
                      }
                    }
                  } else {
                    for (var g = 0; g < priceObj.glassIds.length; g++) {
                      if(priceObj.glassIds[j].elemLists.parent_list_id == priceObj.glassIds[g].elemLists.child_id){
                        var value = self.getValueByRule(priceObj.glassIds[g].elemLists.newValue, priceObj.glassIds[j].elemLists.value, priceObj.glassIds[g].elemLists.rules_type_id);
                        priceObj.glassIds[j].elemLists.newValue = value;
                        if(priceObj.glassIds[j].elemLists.rules_type_id === 3){
                          priceTmp += (Math.round((priceObj.glassIds[g].elemLists.newValue+priceObj.glassIds[j].priceEl.amendment_pruning)*priceObj.glassIds[j].elemLists.value)*priceObj.glassIds[j].priceEl.price)*(1+(priceObj.glassIds[j].priceEl.waste/100));
                        } else if(priceObj.glassIds[j].elemLists.rules_type_id === 2 || priceObj.glassIds[j].elemLists.rules_type_id === 4 || priceObj.glassIds[j].elemLists.rules_type_id === 15){
                          priceTmp += (priceObj.glassIds[g].elemLists.newValue*priceObj.glassIds[j].elemLists.value * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
                        } else if (priceObj.glassIds[j].elemLists.rules_type_id === 1){
                          priceTmp += (((priceObj.glassIds[g].elemLists.newValue+priceObj.glassIds[j].priceEl.amendment_pruning - (priceObj.glassIds[j].elemLists.value*1000))) * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
                        } else {
                          priceTmp += (((priceObj.glassIds[g].elemLists.newValue+priceObj.glassIds[j].priceEl.amendment_pruning)/1000) * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
                        }
                        if (priceObj.currentCurrency.id != priceObj.glassIds[j].priceEl.currency_id){
                          for (var k = 0; k < priceObj.currencies.length; k++) {
                            if(priceObj.currencies[k].id == priceObj.glassIds[j].priceEl.currency_id){
                              priceTmp = priceTmp * priceObj.currencies[k].value;
                            }
                          }
                        }
                      }
                    }
                  }
                  priceObj.price += priceTmp;
                }
              }
            }
          }
          //===== Стеклопакет - конец
          //===== Фурнитура - начало
          if (priceObj.hardwareIds.length) {
            for (var j = 0; j < priceObj.hardwareIds.length; j++) {
              if(priceObj.hardwareIds[j].elemLists){
                var priceTmp = 0;
                priceObj.hardwareIds[j].elemLists.newValue = priceObj.hardwareIds[j].elemLists.count;
                priceTmp += (priceObj.hardwareIds[j].elemLists.count * priceObj.hardwareIds[j].priceEl.price) * (1 + (priceObj.hardwareIds[j].priceEl.waste / 100));
                if (priceObj.currentCurrency.id != priceObj.hardwareIds[j].priceEl.currency_id){
                  for (var kc = 0; kc < priceObj.currencies.length; kc++) {
                    if(priceObj.currencies[kc].id == priceObj.hardwareIds[j].priceEl.currency_id){
                      priceTmp = priceTmp * priceObj.currencies[kc].value;
                    }
                  }
                }
                priceObj.price += priceTmp;
              } else if (priceObj.hardwareIds[j].hardwareLists) {
                for (var g = 0; g < priceObj.hardwareIds.length; g++) {
                  if (priceObj.hardwareIds[g].elemLists) {
                    if (priceObj.hardwareIds[j].parent_list_id == priceObj.hardwareIds[g].elemLists.child_id && priceObj.hardwareIds[g].elemLists.child_type == 'list') {
                      for (var hwArr = 0; hwArr < priceObj.hardwareIds[j].hardwareLists.length; hwArr++) {
                        var priceTmp = 0;
                        var value = self.getValueByRule(priceObj.hardwareIds[g].elemLists.newValue, priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.value, priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.rules_type_id);
                        priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.newValue = value;
                        if (priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.rules_type_id === 3) {
                          priceTmp += (Math.round((priceObj.hardwareIds[g].elemLists.newValue + (priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.amendment_pruning / 1000)) * priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.value) * priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.price) * (1 + (priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.waste / 100));
                        } else if (priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.rules_type_id === 2 || priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.rules_type_id === 4 || priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.rules_type_id === 15) {
                          priceTmp += (priceObj.hardwareIds[g].elemLists.newValue * priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.value * priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.price) * (1 + (priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.waste / 100));
                        } else if (priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.rules_type_id === 1) {
                          priceTmp += (((priceObj.hardwareIds[g].elemLists.newValue + priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.amendment_pruning - (priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.value * 1000)) / 1000) * priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.price) * (1 + (priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.waste / 100));
                        } else {
                          priceTmp += (((priceObj.hardwareIds[g].elemLists.newValue + priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.amendment_pruning) / 1000) * priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.price) * (1 + (priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.waste / 100));
                        }
                        if (priceObj.currentCurrency.id != priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.currency_id) {
                          for (var k = 0; k < priceObj.currencies.length; k++) {
                            if (priceObj.currencies[k].id == priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.currency_id) {
                              priceTmp = priceTmp * priceObj.currencies[k].value;
                            }
                          }
                        }
                        priceObj.price += priceTmp;
                      }
                    }
                  }
                }
              }
            }
          }
          //====== Фурнитура - конец
          priceObj.price = priceObj.price.toFixed(2);
//          console.log('Сумма:'+priceObj.price);
          callback(new OkResult(priceObj));
        } else {
          console.log(result);
        }
      }
    },


    getAdditionalPrice: function (addList, callback){
      var self = this;
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), price = 0, addPriceObj = {};
      this.getCurrentCurrency(addList.cityId, function (result){
        next_1(result);
      });
      function next_1(result){
        if(result.status){
          addPriceObj.currentCurrency = result.data;
          elemListsAdd = [];
          self.parseListAdd(addList.elementId, function (result){next_2(result);});
        } else {
          console.log(result);
        }
      }
      function next_2(result){
        if(result.status){
          addPriceObj.elementIds =  result.data;
          db.transaction(function (transaction) {
            transaction.executeSql('select parent_element_id, name from lists where id = ?', [addList.elementId], function (transaction, result){next_3(result);}, function () {
              callback(new ErrorResult(2, 'Something went wrong when get parent_element_id'));
            });
          });
        } else {
          console.log(result);
        }
      }
      function next_3(result){
        if(result.rows.length){
          addPriceObj.elementIds.parent_element_id = result.rows.item(0).parent_element_id;
          addPriceObj.elementIds.name = result.rows.item(0).name;
          db.transaction(function (transaction) {
            transaction.executeSql('select id, currency_id, price, waste, name, amendment_pruning from elements where id = ?', [result.rows.item(0).parent_element_id], function (transaction, result){next_4(result);}, function () {
              callback(new ErrorResult(2, 'Something went wrong when get element price'));
            });
          });
        } else {
          console.log(result);
        }
      }
      function next_4(result) {
        if(result.rows.length){
          for (var i = 0; i < result.rows.length; i++) {
            if(result.rows.item(i).id == addPriceObj.elementIds.parent_element_id){
              addPriceObj.elementIds.price = result.rows.item(i);
            }
          }
          if(addPriceObj.elementIds.length) {
            for (var i = 0; i < addPriceObj.elementIds.length; i++) {
              if (addPriceObj.elementIds[i].elemLists.child_type === 'element'){
                self.getPriceById(addPriceObj.elementIds[i].elemLists.child_id, i, i, function (result){
                  addPriceObj.elementIds[result.data.index].priceEl = result.data.currency;
                  addPriceObj.elementIds[result.data.index].elemName = result.data.currency.name;
                  addPriceObj.elementIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              } else {
                self.getPriceByIdList(addPriceObj.elementIds[i].elemLists.child_id, i, i, function (result){
                  addPriceObj.elementIds[result.data.index].priceEl = result.data.currency;
                  addPriceObj.elementIds[result.data.index].elemName = result.data.currency.name;
                  addPriceObj.elementIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                });
              }
            }
          }
          db.transaction(function (transaction) {
            transaction.executeSql('select id, name, value from currencies', [], function (transaction, result){next_5(result);}, function () {
              callback(new ErrorResult(2, 'Something went wrong when get parent_element_id'));
            });
          });
        } else {
          console.log(result);
        }
      }
      function next_5(result) {
        if (result.rows.length) {
          addPriceObj.currencies = [];
          addPriceObj.price = 0;
          for (var i = 0; i < result.rows.length; i++) {
            addPriceObj.currencies.push(result.rows.item(i));
          }
          var priceTmp = 0;
          if (addList.elementLength > 0) {
            priceTmp += (((addList.elementLength + addPriceObj.elementIds.price.amendment_pruning) / 1000) * addPriceObj.elementIds.price.price) * (1 + (addPriceObj.elementIds.price.waste / 100));
            if (addPriceObj.currentCurrency.id != addPriceObj.elementIds.price.currency_id) {
              for (var i = 0; i < addPriceObj.currencies.length; i++) {
                if (addPriceObj.currencies[i].id == addPriceObj.elementIds.price.currency_id) {
                  priceTmp = priceTmp * addPriceObj.currencies[i].value;
                }
              }
            }
          }
          addPriceObj.price += priceTmp;
          //====== Начало - доп. элементы
          if (addList.elementLength > 0) {
            if (addPriceObj.elementIds.length) {
              for (var j = 0; j < addPriceObj.elementIds.length; j++) {
                var priceTmp = 0;
                if (addPriceObj.elementIds[j].elemLists.parent_list_id == addList.elementId) {
                  var value = self.getValueByRule(((addList.elementLength + addPriceObj.elementIds[j].priceEl.amendment_pruning) / 1000), addPriceObj.elementIds[j].elemLists.value, addPriceObj.elementIds[j].elemLists.rules_type_id);
                  addPriceObj.elementIds[j].elemLists.newValue = value;
                  if (addPriceObj.elementIds[j].elemLists.rules_type_id === 3) {
                    priceTmp += (Math.round(((addList.elementLength + addPriceObj.elementIds[j].priceEl.amendment_pruning) / 1000) * addPriceObj.elementIds[j].elemLists.value) * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                  } else if (addPriceObj.elementIds[j].elemLists.rules_type_id === 2 || addPriceObj.elementIds[j].elemLists.rules_type_id === 4 || addPriceObj.elementIds[j].elemLists.rules_type_id === 15) {
                    priceTmp += (addPriceObj.elementIds[j].elemLists.value * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                  } else if (addPriceObj.elementIds[j].elemLists.rules_type_id === 1) {
                    priceTmp += (((addList.elementLength + addPriceObj.elementIds[j].priceEl.amendment_pruning - (addPriceObj.elementIds[j].elemLists.value * 1000)) / 1000) * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                  } else {
                    priceTmp += (((addList.elementLength + addPriceObj.elementIds[j].priceEl.amendment_pruning) / 1000) * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                  }
                  if (addPriceObj.currentCurrency.id != addPriceObj.elementIds[j].priceEl.currency_id) {
                    for (var k = 0; k < addPriceObj.currencies.length; k++) {
                      if (addPriceObj.currencies[k].id == addPriceObj.elementIds[j].priceEl.currency_id) {
                        priceTmp = priceTmp * addPriceObj.currencies[k].value;
                      }
                    }
                  }
                } else {
                  for (var g = 0; g < addPriceObj.elementIds.length; g++) {
                    if (addPriceObj.elementIds[j].elemLists.parent_list_id == addPriceObj.elementIds[g].elemLists.child_id) {
                      var value = self.getValueByRule(addPriceObj.elementIds[g].elemLists.newValue, addPriceObj.elementIds[g].elemLists.value, addPriceObj.elementIds[g].elemLists.rules_type_id);
                      addPriceObj.elementIds[j].elemLists.newValue = value;
                      if (addPriceObj.elementIds[j].elemLists.rules_type_id === 3) {
                        priceTmp += (Math.round((addPriceObj.elementIds[g].elemLists.newValue + addPriceObj.elementIds[j].priceEl.amendment_pruning) * addPriceObj.elementIds[j].elemLists.value) * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                      } else if (addPriceObj.elementIds[j].elemLists.rules_type_id === 2 || addPriceObj.elementIds[j].elemLists.rules_type_id === 4 || addPriceObj.elementIds[j].elemLists.rules_type_id === 15) {
                        priceTmp += (addPriceObj.elementIds[g].elemLists.newValue * addPriceObj.elementIds[j].elemLists.value * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                      } else if (addPriceObj.elementIds[j].elemLists.rules_type_id === 1) {
                        priceTmp += (((addPriceObj.elementIds[g].elemLists.newValue + addPriceObj.elementIds[j].priceEl.amendment_pruning - (addPriceObj.elementIds[j].elemLists.value * 1000)) / 1000) * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                      } else {
                        priceTmp += (((addPriceObj.elementIds[g].elemLists.newValue + addPriceObj.elementIds[j].priceEl.amendment_pruning) / 1000) * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                      }
                      if (addPriceObj.currentCurrency.id != addPriceObj.elementIds[j].priceEl.currency_id) {
                        for (var k = 0; k < addPriceObj.currencies.length; k++) {
                          if (addPriceObj.currencies[k].id == addPriceObj.elementIds[j].priceEl.currency_id) {
                            priceTmp = priceTmp * addPriceObj.currencies[k].value;
                          }
                        }
                      }
                    }
                  }
                }
                addPriceObj.price += priceTmp;
              }
            }
          }
          //======= Доп. элементы - конец
        }
        addPriceObj.price = addPriceObj.price.toFixed(2);
        callback(new OkResult(addPriceObj));
      }
    }

  }
}]);


function getValuesString(data){
  var valuesString = '', i;
  for (i = 0; i < data.length; i++) {
    if(!i){
      valuesString += "'" + data[i] + "'";
    } else {
      valuesString += ", '" + data[i] + "'";
    }
  }
  return valuesString;
}

/* Пример первой инициализации App
localStorage.initApp(function (result) {
  if(result.status){
    console.log(result);
  } else {
    console.log(result);
  }
});
*/



// services/localDB.js

"use strict";

BauVoiceApp.factory('localDB', ['$webSql', function ($webSql) {

  var dbName = 'localDB',
      tableProducts = 'products',
      tableOrders = 'orders',
      tableAddElements = 'add_elements',
      dbGlobal, db;

  dbGlobal = $webSql.openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
  db = $webSql.openDatabase(dbName, '1.0', 'Test DB', 65536);
  db.createTable(tableProducts, {
    "id":{
      "type": "INTEGER",
      "null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "created":{
      "type": "TIMESTAMP",
      "null": "NOT NULL",
      "default": "CURRENT_TIMESTAMP"
    },
    "orderId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "productId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "isAddElementsONLY":{
      "type": "BOOLEAN",
      "null": "NOT NULL"
    },
    "selectedRoomId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "templateIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "templateSource":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "templateWidth":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "templateHeight":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "beadId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "profileTypeIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "profileIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "profileId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "profileName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "profileHeatCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "profileAirCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "glassTypeIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "glassIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "glassId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "glassName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "glassHeatCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "glassAirCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "hardwareTypeIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "hardwareIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "hardwareId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "hardwareName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "hardwareHeatCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "hardwareAirCoeff":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "laminationOutIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "laminationOutName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "laminationOutPrice":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "laminationInIndex":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "laminationInName":{
      "type": "TEXT",
      "null": "NOT NULL"
    },
    "laminationInPrice":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "doorShapeId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "doorSashShapeId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "doorHandleShapeId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "doorLockShapeId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "heatTransferMin":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "heatTransferTOTAL":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "airCirculationTOTAL":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "templatePriceSELECT":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "laminationPriceSELECT":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "addElementsPriceSELECT":{
      "type": "FLOAT",
      "null": "NULL"
    },
    "productPriceTOTAL":{
      "type": "FLOAT",
      "null": "NOT NULL"
    },
    "comment":{
      "type": "TEXT",
      "null": "NULL"
    },
    "productQty":{
      "type": "INTEGER",
      "null": "NOT NULL"
    }

  });

  db.createTable(tableOrders, {
    "id":{
      "type": "INTEGER",
      "null": "NOT NULL",
      "primary": true,
      "auto_increment": true
    },
    "created":{
      "type": "TIMESTAMP",
      "null": "NOT NULL",
      "default": "CURRENT_TIMESTAMP"
    },
    "orderId":{
      "type": "INTEGER",
      "null": "NOT NULL"
    },
    "orderType": {
      "type": "TEXT",
      "null": "NULL"
    },
    "orderStyle": {
      "type": "TEXT",
      "null": "NULL"
    },
    "productsQty": {
      "type": "INTEGER",
      "null": "NULL"
    },
    "productsPriceTOTAL": {
      "type": "INTEGER",
      "null": "NULL"
    },
    "deliveryDate":{
      "type": "TEXT",
      "null": "NULL"
    },
    "newDeliveryDate":{
      "type": "TEXT",
      "null": "NULL"
    },
    "deliveryPrice": {
      "type": "INTEGER",
      "null": "NULL"
    },
    "isDatePriceLess":{
      "type": "BOOLEAN",
      "null": "NOT NULL"
    },
    "isDatePriceMore":{
      "type": "BOOLEAN",
      "null": "NOT NULL"
    },
    "selectedFloor":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "selectedFloorPrice":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "selectedAssembling":{
      "type": "TEXT",
      "null": "NULL"
    },
    "selectedAssemblingPrice":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "isInstalment":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "selectedInstalmentPeriod":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "selectedInstalmentPercent": {
      "type": "INTEGER",
      "null": "NULL"
    },
    "isOldPrice":{
      "type": "BOOLEAN",
      "null": "NOT NULL"
    },
    "paymentFirst":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "paymentMonthly":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "paymentFirstPrimary":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "paymentMonthlyPrimary":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "orderPriceTOTAL":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "orderPriceTOTALPrimary":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "name":{
      "type": "TEXT",
      "null": "NULL"
    },
    "location":{
      "type": "TEXT",
      "null": "NULL"
    },
    "address":{
      "type": "TEXT",
      "null": "NULL"
    },
    "mail": {
      "type": "TEXT",
      "null": "NULL"
    },
    "phone":{
      "type": "TEXT",
      "null": "NULL"
    },
    "phone2": {
      "type": "TEXT",
      "null": "NULL"
    },
    "itn": {
      "type": "INTEGER",
      "null": "NULL"
    },
    "starttime": {
      "type": "TEXT",
      "null": "NULL"
    },
    "endtime": {
      "type": "TEXT",
      "null": "NULL"
    },
    "target": {
      "type": "TEXT",
      "null": "NULL"
    },
    "sex": {
      "type": "TEXT",
      "null": "NULL"
    },
    "age": {
      "type": "TEXT",
      "null": "NULL"
    },
    "education": {
      "type": "TEXT",
      "null": "NULL"
    },
    "occupation": {
      "type": "TEXT",
      "null": "NULL"
    },
    "infoSource": {
      "type": "TEXT",
      "null": "NULL"
    }
  });

  db.createTable(tableAddElements, {

    "id":{
      "type": "INTEGER",
      "null": "NULL",
      "primary": true,
      "auto_increment": true
    },
    "orderId":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "productId":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementId":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementType":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementName":{
      "type": "TEXT",
      "null": "NULL"
    },
    "elementWidth":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementHeight":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementColor":{
      "type": "TEXT",
      "null": "NULL"
    },
    "elementPrice":{
      "type": "INTEGER",
      "null": "NULL"
    },
    "elementQty":{
      "type": "INTEGER",
      "null": "NULL"
    }

  });

  return {

    deleteTable: function(tableName) {
      db.dropTable(tableName).then(function(results) {
        console.log(results);
      });
    },

    insertDB: function(tableName, elem) {
      db.insert(tableName, elem).then(function(results) {
        //console.log(results.insertId);
      });
    },

    selectDB: function(tableName, options, callback) {
      var handler = [];
      db.select(tableName, options).then(function(results) {
        if (results.rows.length) {
          for(var i = 0; i < results.rows.length; i++) {
            handler.push(results.rows.item(i));
          }
          callback(new OkResult(handler));
        } else {
          callback(new ErrorResult(1, 'No in database!'));
        }
      });
    },

    selectAllDB: function(tableName, callback) {
      var handler = [];
      db.selectAll(tableName).then(function(results) {
        if (results.rows.length) {
          for(var i = 0; i < results.rows.length; i++) {
            handler.push(results.rows.item(i));
          }
          callback(new OkResult(handler));
        } else {
          callback(new ErrorResult(1, 'No in database!'));
        }
      });
    },

    deleteDB: function(tableName, options) {
      db.del(tableName, options).then(function(results) {
        console.log(results);
      });
    },

    updateDB: function(tableName, elem, options) {
      db.update(tableName, elem, options);
      /*
      db.update(tableName, elem, options).then(function(results) {
        console.log(results);
      });
      */
    },




    // Global DataBase

    selectDBGlobal: function(tableName, options, callback) {
      var handler = [];
      dbGlobal.select(tableName, options).then(function(results) {
        if (results.rows.length) {
          for(var i = 0; i < results.rows.length; i++) {
            handler.push(results.rows.item(i));
          }
          callback(new OkResult(handler));
        } else {
          callback(new ErrorResult(1, 'No in database!'));
        }
      });
    },

    selectAllDBGlobal: function(tableName, callback) {
      var handler = [];
      dbGlobal.selectAll(tableName).then(function(results) {
        if (results.rows.length) {
          for(var i = 0; i < results.rows.length; i++) {
            handler.push(results.rows.item(i));
          }
          callback(new OkResult(handler));
        } else {
          callback(new ErrorResult(1, 'No in database!'));
        }
      });
    },

    updateDBGlobal: function(tableName, elem, options) {
      dbGlobal.update(tableName, elem, options);
    }

  }

}]);




// services/localStorage.js

"use strict";

BauVoiceApp.factory('localStorage', ['$filter', function ($filter) {
  return {
    svgTemplateIconWidth: 70,
    svgTemplateIconHeight: 70,
    svgTemplateIconBigWidth: 500,
    svgTemplateIconBigHeight: 450,
    svgTemplateWidth: 800,
    svgTemplateHeight: 700,
    currentDate: new Date(),
    productionDays: 15,
    currency: '',

    isConstructWind: true,
    isConstructWindDoor: false,
    isConstructBalcony: false,
    isConstructDoor: false,
    //---- чтобы не создавался черновик при запуске проги
    startProgramm: true,
    isCreatedNewProject: true,
    isCreatedNewProduct: true,
    isOrderFinished: false,
    isOpenedCartPage: false,
    isOpenedHistoryPage: false,
    isReturnFromDiffPage: false,
    isFindPriceProcess: false,

    productEditNumber: '',
    orderEditNumber: false,


    //------- Templates
    templatesWindSTORE: [],
    templatesWindDoorSTORE: [],
    templatesBalconySTORE: [],
    templatesDoorSTORE: [],
    templatesWindListSTORE: [],
    templatesWindIconListSTORE: [],
    templatesWindDoorListSTORE: [],
    templatesWindDoorIconListSTORE: [],
    templatesBalconyListSTORE: [],
    templatesBalconyIconListSTORE: [],
    templatesDoorListSTORE: [],
    templatesDoorIconListSTORE: [],

    templatesWindSource: [],
    templatesWindDoorSource: [],
    templatesBalconySource: [],
    templatesDoorSource: [],
    templatesWindList: [],
    templatesWindDoorList: [],
    templatesBalconyList: [],
    templatesDoorList: [],
    templatesWindIconList: [],
    templatesWindDoorIconList: [],
    templatesBalconyIconList: [],
    templatesDoorIconList: [],
    templateDepths: {},

    templatesSource: [],
    templates: [],
    templatesIcons: [],
    templateLabel: '',

    //------ Profiles
    profiles: [],
    profilesType: [],
    allProfileFrameSizes: [],
    allProfileFrameStillSizes: [],
    allProfileSashSizes: [],
    allProfileImpostSizes: [],
    allProfileShtulpSizes: [],

    //------- Glasses
    glasses: [],
    glassTypes: [],

    //------ Hardwares
    hardwares: [],
    hardwareTypes: [],

    //------ Lamination
    laminationsWhite: '',
    laminationsIn: [],
    laminationsOut: [],

    userInfo: {
      city_id: 0,
      cityName: '',
      regionName: '',
      countryName: '',
      fullLocation: '',
      climaticZone: 0,
      heatTransfer: 0,
      langLabel: '',
      langName: ''
    },

    productSource: {
      orderId: 0,
      productId: 0,
      isAddElementsONLY: false,
      selectedRoomId: 4,

      templateIndex: 0,
      templateSource: {},
      templateDefault: {},
      templateIcon: {},
      templateWidth: 0,
      templateHeight: 0,
      beadId: 0,

      profileTypeIndex: 0,
      profileIndex: 0,
      profileId: 0,
      profileName: '',
      profileHeatCoeff: 0,
      profileAirCoeff: 0,

      glassTypeIndex: 0,
      glassIndex: 0,
      glassId: 0,
      glassName: '',
      glassHeatCoeff: 0,
      glassAirCoeff: 0,

      hardwareTypeIndex: 0,
      hardwareIndex: 0,
      hardwareId: 0,
      hardwareName: '',
      hardwareHeatCoeff: 0,
      hardwareAirCoeff: 0,

      laminationOutIndex: 'white',
      laminationOutName: '',
      laminationOutPrice: 0,
      laminationInIndex: 'white',
      laminationInName: '',
      laminationInPrice: 0,

      chosenAddElements: {
        selectedGrids: [],
        selectedVisors: [],
        selectedSpillways: [],
        selectedOutsideSlope: [],
        selectedLouvers: [],
        selectedInsideSlope: [],
        selectedConnectors: [],
        selectedFans: [],
        selectedWindowSill: [],
        selectedHandles: [],
        selectedOthers: []
      },

      doorShapeId: 0,
      doorSashShapeId: 0,
      doorHandleShapeId: 0,
      doorLockShapeId: 0,
      heatTransferMin: 0,
      heatTransferTOTAL: 0,
      airCirculationTOTAL: 0,

      templatePriceSELECT: 0,
      laminationPriceSELECT: 0,
      addElementsPriceSELECT: 0,
      productPriceTOTAL: 0,
      comment: '',
      productQty: 1
    },

    orderSource: {
      orderId: 0,
      orderType: '',
      orderStyle: '',
      productsQty: 0,
      products: [],
      productsPriceTOTAL: 0,
      deliveryDate: '',
      newDeliveryDate: '',
      deliveryPrice: 0,
      isDatePriceLess: false,
      isDatePriceMore: false,
      selectedFloor: 'free',
      selectedFloorPrice: 0,
      selectedAssembling: 'free',
      selectedAssemblingPrice: 0,
      isInstalment: 'false',
      selectedInstalmentPeriod: 0,
      selectedInstalmentPercent: 0,
      isOldPrice: false,
      paymentFirst: 0,
      paymentMonthly: 0,
      paymentFirstPrimary: 0,
      paymentMonthlyPrimary: 0,
      orderPriceTOTAL: 0,
      orderPriceTOTALPrimary: 0,

      name: '',
      location: '',
      address: '',
      mail: '',
      phone: '',
      phone2: '',
      itn: 0,
      starttime: '',
      endtime: '',
      target: ''

    },

    productDefault: {},
    product: {},
    order: {},
    orders: [],

    objXFormedPriceSource: {
      cityId: '',
      profileId: '',
      glassId: '',
      framesSize: [],
      sashsSize: [],
      beadsSize: [],
      impostsSize: [],
      shtulpsSize: [],
      sashesBlock: [],
      glassSizes: [],
      glassSquares: [],
      frameSillSize: 0
    },

    objXAddElementPriceSource: {
      cityId: 0,
      elementId: 0,
      elementLength: 0
    },

    //------ config-pannels tools
    showNavMenu: true,
    isConfigMenu: false,
    showPanels: {},
    isTemplatePanel: false,
    isProfilePanel: false,
    isGlassPanel: false,
    isHardwarePanel: false,
    isLaminationPanel: false,
    isAddElementsPanel: false,

    //constructionPriceTOTAL: 0,
    //hardwarePriceTOTAL: 0,
    //laminationPriceTOTAL: 0,
    //addElementsPriceTOTAL: 0,
    //orderPrice: 0,

    addElementsGroupClass: [
      'aux_color_connect',
      'aux_color_big',
      'aux_color_middle',
      'aux_color_slope',
      'aux_color_middle',
      'aux_color_slope',
      'aux_color_connect',
      'aux_color_small',
      'aux_color_big',
      'aux_color_middle',
      'aux_color_small'
    ],
    isAddElement: false,
    isAddElementListView: false,
    isConstructSizeCalculator: false,
    isTabFrame: false,

    showRoomSelectorDialog: false,
    isRoomsDialog: false,
    isOpenSettingsPage: false,
    isChangedTemplate: false,
    isVoiceHelper: false,
    voiceHelperLanguage: 'ru_ru',
    isShowCommentBlock: false,
    showMasterDialog: false,
    showOrderDialog: false,
    showCreditDialog: false,
    fullOrderType: 'complete',
    draftOrderType: 'draft',

    //------- data x order dialogs
    optionAge: [
      '20-30',
      '31-40',
      '41-50',
      '51-60',
      $filter('translate')('cart.CLIENT_AGE_OLDER') +' 61'
    ],
    optionEductaion: [
      $filter('translate')('cart.CLIENT_EDUC_MIDLE'),
      $filter('translate')('cart.CLIENT_EDUC_SPEC'),
      $filter('translate')('cart.CLIENT_EDUC_HIGH')
    ],
    optionOccupation: [
      $filter('translate')('cart.CLIENT_OCCUP_WORKER'),
      $filter('translate')('cart.CLIENT_OCCUP_HOUSE'),
      $filter('translate')('cart.CLIENT_OCCUP_BOSS'),
      $filter('translate')('cart.CLIENT_OCCUP_STUD'),
      $filter('translate')('cart.CLIENT_OCCUP_PENSION')
    ],
    optionInfo: [
      'TV',
      'InterNET',
      $filter('translate')('cart.CLIENT_INFO_PRESS'),
      $filter('translate')('cart.CLIENT_INFO_FRIEND'),
      $filter('translate')('cart.CLIENT_INFO_ADV')
    ],


  //------ WebSQL DB table names
    //--- Local
    productsTableBD: 'products',
    addElementsTableBD: 'add_elements',
    ordersTableBD: 'orders',
    //---- Global
    usersTableDBGlobal: 'users',
    citiesTableDBGlobal: 'cities',
    regionsTableDBGlobal: 'regions',
    countriesTableDBGlobal: 'countries',
    listsTableDBGlobal: 'lists',
    elementsTableDBGlobal: 'elements',
    beadsTableDBGlobal: 'beed_profile_systems',

    visorDBId: 21,
    gridDBId: 20,
    spillwayDBId: 9,
    windowsillDBId: 8,

    //------------ Languages
    languages: [
      {label: 'ua', name: 'Українська'},
      {label: 'ru', name: 'Русский'},
      {label: 'en', name: 'English'},
      {label: 'de', name: 'Deutsch'},
      {label: 'ro', name: 'Român'}
    ]

  }
}]);



// controllers/menus/cart-menu.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('CartMenuCtrl', ['$scope',  'constructService', 'localStorage', 'localDB', function ($scope, constructService, localStorage, localDB) {

  $scope.global = localStorage;

  $scope.cartMenuData = {
    floorData: [],
    assemblingData: [],
    instalmentsData: [],
    activeMenuItem: false,
    //activeInstalment: 'default',
    //------- Calendar
    maxDeliveryDate: new Date(),
    minDeliveryDate: new Date(),
    activeInstalmentSwitcher: false,
    ratePriceLess: 100,
    ratePriceMore: 100,
    DELAY_START: STEP,
    typing: 'on'
  };

  //------- Calendar

  var minDays = 2,
      maxDays = 30;

  //------ set min delivery day
  $scope.cartMenuData.minDeliveryDate.setDate( $scope.global.currentDate.getDate() + minDays);
  //------ set max delivery day
  $scope.cartMenuData.maxDeliveryDate.setDate( $scope.global.currentDate.getDate() + maxDays);
  //------ change date
  $scope.checkDifferentDate = function(lastday, newday) {
    var lastDateArr, newDateArr, lastDate, newDate, qtyDays;
    lastDateArr = lastday.split(".");
    newDateArr = newday.split(".");
    lastDate = new Date(lastDateArr[ 2 ], lastDateArr[ 1 ]-1, lastDateArr[0]);
    newDate = new Date(newDateArr[ 2 ], newDateArr[ 1 ]-1, newDateArr[0]);
    qtyDays = Math.floor((newDate - lastDate)/(1000*60*60*24));

    if(qtyDays && qtyDays > 0) {
      $scope.global.order.deliveryPrice = $scope.cartMenuData.ratePriceLess * qtyDays;
      $scope.global.order.isDatePriceLess = true;
      $scope.global.order.isDatePriceMore = false;
      $scope.global.order.isOldPrice = true;
    } else if (qtyDays && qtyDays < 0) {
      $scope.global.order.deliveryPrice = $scope.cartMenuData.ratePriceMore * Math.abs(qtyDays);
      $scope.global.order.isDatePriceMore = true;
      $scope.global.order.isDatePriceLess = false;
      $scope.global.order.isOldPrice = true;
    } else {
      $scope.global.order.deliveryPrice = false;
      $scope.global.order.isDatePriceLess = false;
      $scope.global.order.isDatePriceMore = false;
      $scope.global.order.isOldPrice = false;
    }
    $scope.global.order.newDeliveryDate = newday;
    $scope.global.calculateTotalOrderPrice();
  };


  constructService.getFloorPrice(function (results) {
    if (results.status) {
      $scope.cartMenuData.floorData = angular.copy(results.data.floors);
    } else {
      console.log(results);
    }
  });

  constructService.getAssemblingPrice(function (results) {
    if (results.status) {
      $scope.cartMenuData.assemblingData = angular.copy(results.data.assembling);
    } else {
      console.log(results);
    }
  });

  constructService.getInstalment(function (results) {
    if (results.status) {
      $scope.cartMenuData.instalmentsData = results.data.instalment;
    } else {
      console.log(results);
    }
  });




  //----- Select menu item

  $scope.selectMenuItem = function(id) {
    if($scope.cartMenuData.activeMenuItem === id) {
      $scope.cartMenuData.activeMenuItem = false;
    } else {
      $scope.cartMenuData.activeMenuItem = id;
    }
  };

  //------- Select dropdown menu item

  $scope.selectFloorPrice = function(floorName, floorPrice) {
    if($scope.global.order.selectedFloor !== floorName) {
      $scope.global.order.selectedFloor = floorName;
      $scope.global.order.selectedFloorPrice = floorPrice;
      $scope.global.calculateTotalOrderPrice();
    }
  };

  $scope.selectAssembling = function(assembName, assembPrice) {
    if($scope.global.order.selectedAssembling !== assembName) {
      $scope.global.order.selectedAssembling = assembName;
      $scope.global.order.selectedAssemblingPrice = assembPrice;
      $scope.global.calculateTotalOrderPrice();
    }
  };

  $scope.selectInstalment = function(instalmentId) {
    if(instalmentId !== undefined && $scope.global.order.isInstalment !== instalmentId) {
      $scope.global.order.isInstalment = instalmentId;
      $scope.global.order.selectedInstalmentPeriod = $scope.cartMenuData.instalmentsData[instalmentId].period;
      $scope.global.order.selectedInstalmentPercent = $scope.cartMenuData.instalmentsData[instalmentId].percent;
      $scope.calculateInstalmentPrice($scope.global.order.orderPriceTOTAL, $scope.global.order.orderPriceTOTALPrimary);
    } else if(!instalmentId || instalmentId === undefined){
      $scope.global.order.isInstalment = 'false';
      $scope.global.order.selectedInstalmentPeriod = 0;
      $scope.global.order.selectedInstalmentPercent = 0;
      $scope.cartMenuData.activeMenuItem = false;
    }
  };


  //------ show Call Master Dialog
  $scope.showCallMasterDialog = function() {
    $scope.global.showMasterDialog = true;
  };

  //------ show Order/Credit Dialog
  $scope.showCallOrderDialog = function() {
    if($scope.global.order.isInstalment !== 'false') {
      $scope.global.showCreditDialog = true;
    } else {
      $scope.global.showOrderDialog = true;
    }
  };

  //--------- this function uses into Order/Credit Dialog for create user object and set default values for select fields
  $scope.global.createUserXOrder = function() {
    return {
      sex: 'm',
      age: $scope.global.optionAge[0],
      education: $scope.global.optionEductaion[0],
      occupation: $scope.global.optionOccupation[0],
      infoSource: $scope.global.optionInfo[0]
    };
  };


  //-------- Calculate Total Order Price
  $scope.global.calculateTotalOrderPrice = function() {
    playSound('price');
    var floorPrice = parseFloat($scope.global.order.selectedFloorPrice),
        assemblingPrice = parseFloat($scope.global.order.selectedAssemblingPrice);

    $scope.global.order.orderPriceTOTAL = 0;
    //----- add product prices
    $scope.global.order.orderPriceTOTAL += $scope.global.order.productsPriceTOTAL;

    //----- add floor price
    if( $.isNumeric(floorPrice) ) {
      $scope.global.order.orderPriceTOTAL += floorPrice;
    }
    //----- add assembling price
    if( $.isNumeric(assemblingPrice) ) {
      $scope.global.order.orderPriceTOTAL += assemblingPrice;
    }
    //----- save primary total price
    $scope.global.order.orderPriceTOTALPrimary = $scope.global.order.orderPriceTOTAL;
    //----- add delivery price
    if($scope.global.order.deliveryPrice) {
      if($scope.global.order.isDatePriceMore) {
        $scope.global.order.orderPriceTOTAL += $scope.global.order.deliveryPrice;
      } else if($scope.global.order.isDatePriceLess) {
        $scope.global.order.orderPriceTOTAL -= $scope.global.order.deliveryPrice;
      }
    } else {
      $scope.global.order.orderPriceTOTAL = $scope.global.order.orderPriceTOTALPrimary;
    }

    $scope.global.order.orderPriceTOTAL = parseFloat($scope.global.order.orderPriceTOTAL.toFixed(2));
    //------ get price with instalment
    $scope.calculateInstalmentPrice($scope.global.order.orderPriceTOTAL, $scope.global.order.orderPriceTOTALPrimary);
  };

  $scope.calculateInstalmentPrice = function(price, pricePrimary) {
    if($scope.global.order.isInstalment !== 'false') {
      $scope.global.order.paymentFirst = parseFloat((price * $scope.global.order.selectedInstalmentPercent / 100).toFixed(2));
      $scope.global.order.paymentMonthly = parseFloat(((price - $scope.global.order.paymentFirst) / $scope.global.order.selectedInstalmentPeriod).toFixed(2));
      if(pricePrimary) {
        $scope.global.order.paymentFirstPrimary = parseFloat((pricePrimary * $scope.global.order.selectedInstalmentPercent / 100).toFixed(2));
        $scope.global.order.paymentMonthlyPrimary = parseFloat(((pricePrimary - $scope.global.order.paymentFirstPrimary) / $scope.global.order.selectedInstalmentPeriod).toFixed(2));
      }
    }
  };

}]);


// controllers/menus/config-menu.js

/* globals BauVoiceApp, STEP, typingTextByChar, Template, TemplateIcon, drawSVG, parsingTemplateSource */

'use strict';

BauVoiceApp.controller('ConfigMenuCtrl', ['$scope', 'globalDB', 'localDB', 'localStorage', 'constructService', '$timeout', '$q', '$filter', function ($scope, globalDB, localDB, localStorage, constructService,  $timeout, $q, $filter) {

  $scope.global = localStorage;

  $scope.configMenu = {
    DELAY_START: STEP,
    DELAY_SHOW_CONFIG_LIST: 5 * STEP,
    DELAY_SHOW_FOOTER: 5 * STEP,
    DELAY_TYPE_ITEM_TITLE: 10 * STEP,
    DELAY_SHOW_U_COEFF: 20 * STEP,
    typing: 'on'
  };

  $scope.global.isOpenedCartPage = false;
  $scope.global.isOpenedHistoryPage = false;


/*
  $scope.dubleTyping = function() {
    $timeout(function() {
      var $configItemValue = $('.config-menu .value');
      $configItemValue.each(function () {
        var $configItemNameAside = $(this).next('.name.aside');
        if ($configItemNameAside.length) {
          typingTextByChar($(this), $configItemNameAside);
        }
      });
    },  $scope.configMenu.DELAY_TYPE_ITEM_TITLE);
  };
*/

  //============= Create Order Date
  $scope.global.createOrderData = function() {
    var deliveryDate = new Date(),
        valuesDate,
        idDate;

    //----------- create order number for new project
    $scope.global.order.orderId = Math.floor((Math.random() * 100000));

    //------ set delivery day
    deliveryDate.setDate( $scope.global.currentDate.getDate() + $scope.global.productionDays );
    valuesDate = [
      deliveryDate.getDate(),
      deliveryDate.getMonth() + 1
    ];
    for(idDate in valuesDate) {
      valuesDate[ idDate ] = valuesDate[ idDate ].toString().replace( /^([0-9])$/, '0$1' );
    }

    $scope.global.order.deliveryDate = valuesDate[ 0 ] + '.' + valuesDate[ 1 ] + '.' + deliveryDate.getFullYear();
    $scope.global.order.newDeliveryDate = $scope.global.order.deliveryDate;
  };


  //----------- get all profiles
  $scope.downloadAllProfiles = function(results) {
    if (results) {
      $scope.global.profilesType = angular.copy(results[$scope.global.product.profileIndex].folder);
      $scope.global.profiles = angular.copy(results[$scope.global.product.profileIndex].profiles);
      $scope.global.product.profileId = $scope.global.profiles[$scope.global.product.profileIndex].id;
      //$scope.global.product.profileName = $scope.global.profiles[$scope.global.profileIndex].name;
      //$scope.global.product.profileHeatCoeff = $scope.global.profiles[$scope.global.profileIndex].heatCoeff;
      //$scope.global.product.profileAirCoeff = $scope.global.profiles[$scope.global.profileIndex].airCoeff;

    } else {
      console.log(results);
    }
  };

  //---------- get element section sizes as to profile
  $scope.downloadProfileElementSizes = function(results, type) {
    if(results) {
      switch(type) {
        case 'frame': $scope.global.allProfileFrameSizes = angular.copy(results);
          break;
        case 'frame-still': $scope.global.allProfileFrameStillSizes = angular.copy(results);
          break;
        case 'sash': $scope.global.allProfileSashSizes = angular.copy(results);
          break;
        case 'impost': $scope.global.allProfileImpostSizes = angular.copy(results);
          break;
        case 'shtulp': $scope.global.allProfileShtulpSizes = angular.copy(results);
          break;
      }
    } else {
      console.log(results);
    }
  };


  //-------- get default json template
  $scope.downloadAllTemplates = function() {
    constructService.getDefaultConstructTemplate(function (results) {
      if (results.status) {

        //-------- Save Source Templates in Store
        $scope.global.templatesWindSTORE = angular.copy(results.data.windows);
        $scope.global.templatesWindDoorSTORE = angular.copy(results.data.windowDoor);
        $scope.global.templatesBalconySTORE = angular.copy(results.data.balconies);
        $scope.global.templatesDoorSTORE = angular.copy(results.data.doors);

        //-------- Templates for use
        $scope.global.templatesWindSource = angular.copy(results.data.windows);
        $scope.global.templatesWindDoorSource = angular.copy(results.data.windowDoor);
        $scope.global.templatesBalconySource = angular.copy(results.data.balconies);
        $scope.global.templatesDoorSource = angular.copy(results.data.doors);

        $scope.global.parseTemplate($scope.global.product.profileIndex, $scope.global.product.profileId);

      } else {
        console.log(results);
      }
    });
  };



  $scope.global.parseTemplate = function(profileIndex, profileId) {
    // парсинг шаблона, расчет размеров
    $scope.global.templateDepths = {
      frameDepth: $scope.global.allProfileFrameSizes[profileIndex],
      sashDepth: $scope.global.allProfileSashSizes[profileIndex],
      impostDepth: $scope.global.allProfileImpostSizes[profileIndex],
      shtulpDepth: $scope.global.allProfileShtulpSizes[profileIndex]
    };

    for(var tem = 0; tem < $scope.global.templatesWindSource.length; tem++) {
      $scope.global.templatesWindList.push( new Template($scope.global.templatesWindSource[tem], $scope.global.templateDepths) );
      $scope.global.templatesWindIconList.push( new TemplateIcon($scope.global.templatesWindSource[tem], $scope.global.templateDepths) );
    }
    for(var tem = 0; tem < $scope.global.templatesWindDoorSource.length; tem++) {
      $scope.global.templatesWindDoorList.push( new Template($scope.global.templatesWindDoorSource[tem], $scope.global.templateDepths) );
      $scope.global.templatesWindDoorIconList.push( new TemplateIcon($scope.global.templatesWindDoorSource[tem], $scope.global.templateDepths) );
    }
    for(var tem = 0; tem < $scope.global.templatesBalconySource.length; tem++) {
      $scope.global.templatesBalconyList.push( new Template($scope.global.templatesBalconySource[tem], $scope.global.templateDepths) );
      $scope.global.templatesBalconyIconList.push( new TemplateIcon($scope.global.templatesBalconySource[tem], $scope.global.templateDepths) );
    }
    for(var tem = 0; tem < $scope.global.templatesDoorSource.length; tem++) {
      $scope.global.templatesDoorList.push( new Template($scope.global.templatesDoorSource[tem], $scope.global.templateDepths) );
      $scope.global.templatesDoorIconList.push( new TemplateIcon($scope.global.templatesDoorSource[tem], $scope.global.templateDepths) );
    }

    //-------- Save Template Arrays in Store
    //----- save first product
    if($scope.global.startProgramm) {

      //---- window
      $scope.global.templatesWindListSTORE = angular.copy($scope.global.templatesWindList);
      $scope.global.templatesWindIconListSTORE = angular.copy($scope.global.templatesWindIconList);
      //---- window-door

      $scope.global.templatesWindDoorListSTORE = angular.copy($scope.global.templatesWindDoorList);
      $scope.global.templatesWindDoorIconListSTORE = angular.copy($scope.global.templatesWindDoorIconList);
      //---- balcony
      $scope.global.templatesBalconyListSTORE = angular.copy($scope.global.templatesBalconyList);
      $scope.global.templatesBalconyIconListSTORE = angular.copy($scope.global.templatesBalconyIconList);
      //---- door
      $scope.global.templatesDoorListSTORE = angular.copy($scope.global.templatesDoorList);
      $scope.global.templatesDoorIconListSTORE = angular.copy($scope.global.templatesDoorIconList);

    }

    //-------- set current templates arrays
    $scope.global.getCurrentTemplates();
    //------- set current template for product
    $scope.global.saveNewTemplateInProduct($scope.global.product.templateIndex);
    $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, profileIndex, profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
  };


  $scope.global.saveNewTemplateInProduct = function(templateIndex) {
    $scope.global.product.templateSource = angular.copy($scope.global.templatesSource[templateIndex]);
    $scope.global.product.templateDefault = angular.copy($scope.global.templates[templateIndex]);
    $scope.global.product.templateIcon = angular.copy($scope.global.templatesIcons[templateIndex]);
  };


  $scope.global.getCurrentTemplates = function() {
    if($scope.global.isConstructDoor) {
      $scope.global.templatesSource = $scope.global.templatesDoorSource;
      $scope.global.templates = $scope.global.templatesDoorList;
      $scope.global.templatesIcons = $scope.global.templatesDoorIconList;
      $scope.global.templateLabel = $filter('translate')('panels.TEMPLATE_DOOR');
    } else if($scope.global.isConstructBalcony) {
      $scope.global.templatesSource = $scope.global.templatesBalconySource;
      $scope.global.templates = $scope.global.templatesBalconyList;
      $scope.global.templatesIcons = $scope.global.templatesBalconyIconList;
      $scope.global.templateLabel = $filter('translate')('panels.TEMPLATE_BALCONY');
    } else if($scope.global.isConstructWindDoor) {
      $scope.global.templatesSource = $scope.global.templatesWindDoorSource;
      $scope.global.templates = $scope.global.templatesWindDoorList;
      $scope.global.templatesIcons = $scope.global.templatesWindDoorIconList;
      $scope.global.templateLabel = $filter('translate')('panels.TEMPLATE_BALCONY_ENTER');
    } else if($scope.global.isConstructWind){
      $scope.global.templatesSource = $scope.global.templatesWindSource;
      $scope.global.templates = $scope.global.templatesWindList;
      $scope.global.templatesIcons = $scope.global.templatesWindIconList;
      $scope.global.templateLabel = $filter('translate')('panels.TEMPLATE_WINDOW');
    }
  };

  // создание объекта для отправки в базу, чтобы рассчитать цену шаблона
  $scope.global.createObjXFormedPrice = function(template, profileIndex, profileId, glassId, hardwareId) {
    //------ define Bead Id for define template price
    localDB.selectDBGlobal($scope.global.listsTableDBGlobal, {'id': glassId }, function (results) {
      if (results.status) {
        var parentId = results.data[0].parent_element_id;
        //------ find glass depth
        localDB.selectDBGlobal($scope.global.elementsTableDBGlobal, {'id': parentId }, function (results) {
          if (results.status) {
            var glassDepth = results.data[0].glass_width;
            //------ find bead Id as to glass Depth and profile Id
            localDB.selectDBGlobal($scope.global.beadsTableDBGlobal, {'profile_system_id': {"value": profileId, "union": 'AND'}, "glass_width": glassDepth}, function (results) {
              if (results.status) {
                $scope.global.product.beadId = results.data[0].list_id;
                //console.log($scope.global.product.beadId);


                $scope.global.objXFormedPrice = angular.copy($scope.global.objXFormedPriceSource);
                for (var item = 0; item < template.objects.length; item++) {
                  var elementSize;
                  if (template.objects[item].type) {
                    switch (template.objects[item].type) {
                      case 'frame_line':
                        elementSize = template.objects[item].lengthVal;
                        $scope.global.objXFormedPrice.framesSize.push(elementSize);
                        if (template.objects[item].sill) {
                          $scope.global.objXFormedPrice.frameSillSize = template.objects[item].lengthVal;
                        }
                        break;
                      case 'impost':
                        elementSize = template.objects[item].parts[0].lengthVal;
                        $scope.global.objXFormedPrice.impostsSize.push(elementSize);
                        break;
                      case 'sash':
                        elementSize = template.objects[item].parts[0].lengthVal;
                        $scope.global.objXFormedPrice.sashsSize.push(elementSize);
                        break;
                      case 'bead_line':
                        elementSize = template.objects[item].lengthVal;
                        $scope.global.objXFormedPrice.beadsSize.push(elementSize);
                        break;
                      case 'sash_block':
                        var tempSashBlock = {},
                            tempSashBlockSize = [];
                        for (var sash = 0; sash < template.objects[item].parts.length; sash++) {
                          tempSashBlockSize.push(template.objects[item].parts[sash].lengthVal);
                        }
                        tempSashBlock.sizes = tempSashBlockSize;
                        tempSashBlock.openDir = template.objects[item].openDir;
                        $scope.global.objXFormedPrice.sashesBlock.push(tempSashBlock);
                        break;
                      case 'glass_paсkage':
                        var tempGlassSizes = [];
                        for (var glass = 0; glass < template.objects[item].parts.length; glass++) {
                          tempGlassSizes.push(template.objects[item].parts[glass].lengthVal);
                        }
                        $scope.global.objXFormedPrice.glassSizes.push(tempGlassSizes);
                        $scope.global.objXFormedPrice.glassSquares.push(template.objects[item].square);
                        break;
                      case 'dimensionsH':
                        $scope.global.product.templateWidth = template.objects[item].lengthVal;
                        break;
                      case 'dimensionsV':
                        $scope.global.product.templateHeight = template.objects[item].lengthVal;
                        break;
                    }
                  }
                }
                $scope.global.objXFormedPrice.cityId = $scope.global.userInfo.city_id;
                $scope.global.objXFormedPrice.glassId = glassId;
                $scope.global.objXFormedPrice.profileId = profileId;
                $scope.global.objXFormedPrice.hardwareId = hardwareId;
                $scope.global.objXFormedPrice.hardwareColor = $scope.global.product.laminationInName;
                $scope.global.objXFormedPrice.frameId = $scope.global.allProfileFrameSizes[profileIndex].id;
                $scope.global.objXFormedPrice.frameSillId = $scope.global.allProfileFrameStillSizes[profileIndex].id;
                $scope.global.objXFormedPrice.sashId = $scope.global.allProfileSashSizes[profileIndex].id;
                $scope.global.objXFormedPrice.impostId = $scope.global.allProfileImpostSizes[profileIndex].id;
                $scope.global.objXFormedPrice.shtulpId = $scope.global.allProfileShtulpSizes[profileIndex].id;
                $scope.global.objXFormedPrice.beadId = $scope.global.product.beadId;

                //console.log(JSON.stringify($scope.global.objXFormedPrice));
                //console.log($scope.global.objXFormedPrice);

                //------ calculate coeffs
                $scope.global.calculateCoeffs();

                //--------- get product default price
                globalDB.calculationPrice($scope.global.objXFormedPrice, function (result) {
                  if(result.status){
                    //console.log('price');
                    //console.log(result.data);


                    $scope.global.product.templatePriceSELECT = parseFloat(angular.copy(result.data.price));
                    $scope.global.setProductPriceTOTAL();
                    var currencySymbol = '';
                    if (result.data.currentCurrency.name === 'uah') {
                      currencySymbol = '₴';
                    }
                    $scope.global.currency = currencySymbol;
                    $scope.global.isFindPriceProcess = false;
                  } else {
                    console.log(result);
                  }
                });



              } else {
                console.log(results);
              }
            });
          } else {
            console.log(results);
          }
        });
      } else {
        console.log(results);
      }
    });

  };

  $scope.global.setProductPriceTOTAL = function() {
    //playSound('price');
    $scope.global.product.productPriceTOTAL = $scope.global.product.templatePriceSELECT + $scope.global.product.laminationPriceSELECT + $scope.global.product.addElementsPriceSELECT;
    //------- после первой загрузки создается дефолтный объект
    if($scope.global.startProgramm) {
      //-------- create default product in localStorage
      $scope.global.productDefault = angular.copy($scope.global.product);
      //console.log('productDefault', $scope.global.productDefault);
    }
    $scope.$apply();
  };

  $scope.global.setProductPriceTOTALapply = function() {
    //playSound('price');
    $scope.global.product.productPriceTOTAL = $scope.global.product.templatePriceSELECT + $scope.global.product.laminationPriceSELECT + $scope.global.product.addElementsPriceSELECT;
  };


  //---------- Coeffs define
  $scope.global.calculateCoeffs = function() {
    var constructionSquareTotal,
        glassSquareTotal,
        prifileHeatCoeffTotal,
        glassHeatCoeffTotal,
        item;
    //------- total construction square define
    for (item = 0; item < $scope.global.product.templateDefault.objects.length; item++) {
      if($scope.global.product.templateDefault.objects[item].type === "square") {
        constructionSquareTotal = $scope.global.product.templateDefault.objects[item].squares.reduce(function(a, b) {
          return a + b;
        });
      }
    }
    //-------- total glasses square define
    glassSquareTotal = $scope.global.objXFormedPrice.glassSquares.reduce(function(a, b) {
      return a + b;
    });
    //-------- coeffs define
    prifileHeatCoeffTotal = $scope.global.product.profileHeatCoeff * (constructionSquareTotal - glassSquareTotal);
    glassHeatCoeffTotal = $scope.global.product.glassHeatCoeff * glassSquareTotal;
    //-------- calculate Heat Coeff Total
    $scope.global.product.heatTransferTOTAL = parseFloat(((prifileHeatCoeffTotal + glassHeatCoeffTotal)/constructionSquareTotal).toFixed(2));

    //-------- calculate Air Coeff Total
//    $scope.global.product.airCirculationTOTAL = + $scope.global.product.profileAirCoeff + $scope.global.product.glassAirCoeff + $scope.global.product.hardwareAirCoeff;

  };

  $scope.global.setTemplatesFromSTORE = function() {
    if($scope.global.isConstructDoor) {
      $scope.global.templatesDoorSource = angular.copy($scope.global.templatesDoorSTORE);
      $scope.global.templatesDoorList = angular.copy($scope.global.templatesDoorListSTORE);
      $scope.global.templatesDoorIconList = angular.copy($scope.global.templatesDoorIconListSTORE);
    } else if($scope.global.isConstructBalcony) {
      $scope.global.templatesBalconySource = angular.copy($scope.global.templatesBalconySTORE);
      $scope.global.templatesBalconyList = angular.copy($scope.global.templatesBalconyListSTORE);
      $scope.global.templatesBalconyIconList = angular.copy($scope.global.templatesBalconyIconListSTORE);
    } else if($scope.global.isConstructWindDoor) {
      $scope.global.templatesWindDoorSource = angular.copy($scope.global.templatesWindDoorSTORE);
      $scope.global.templatesWindDoorList = angular.copy($scope.global.templatesWindDoorListSTORE);
      $scope.global.templatesWindDoorIconList = angular.copy($scope.global.templatesWindDoorIconListSTORE);
    } else if($scope.global.isConstructWind){
      $scope.global.templatesWindSource = angular.copy($scope.global.templatesWindSTORE);
      $scope.global.templatesWindList = angular.copy($scope.global.templatesWindListSTORE);
      $scope.global.templatesWindIconList = angular.copy($scope.global.templatesWindIconListSTORE);
    }
  };

  $scope.global.setDefaultDoorConfig = function() {
    $scope.global.product.doorShapeId = 0;
    $scope.global.product.doorSashShapeId = 0;
    $scope.global.product.doorHandleShapeId = 0;
    $scope.global.product.doorLockShapeId = 0;
  };





  //================ EDIT PRODUCT =================

  if ($scope.global.productEditNumber !== '' && !$scope.global.isCreatedNewProject && !$scope.global.isCreatedNewProduct) {
    $scope.global.product = angular.copy($scope.global.order.products[$scope.global.productEditNumber]);
    //TODO templates!!!!!
  }





  //=============== FIRST START create Product =========

  if($scope.global.startProgramm && $scope.global.isCreatedNewProject && $scope.global.isCreatedNewProduct) {
console.log('FIRST START!!!!!!!!!!');
    //playSound('menu');
    //------- create new empty product
    $scope.global.product = angular.copy($scope.global.productSource);
    //------- create new empty order
    $scope.global.order = angular.copy($scope.global.orderSource);

    //------- create order date
    $scope.global.createOrderData();


    constructService.getProfileSystem(function (results) {
      if (results.status) {
        $scope.global.product.profileHeatCoeff = results.data.heatCoeff;
        $scope.global.product.profileAirCoeff = results.data.airCoeff;
        $scope.global.product.profileName = results.data.name;
      } else {
        console.log(results);
      }
    });

    //----------- get all glasses
    constructService.getAllGlass(function (results) {
      if (results.status) {
        $scope.global.glassTypes = angular.copy(results.data.glassTypes);
        $scope.global.glasses = angular.copy(results.data.glasses);
        //----- set first current glass
        $scope.global.product.glassId = $scope.global.glasses[$scope.global.product.glassIndex][$scope.global.product.glassIndex].glassId;
        $scope.global.product.glassName = $scope.global.glasses[$scope.global.product.glassIndex][$scope.global.product.glassIndex].glassName;
        $scope.global.product.glassHeatCoeff = $scope.global.glasses[$scope.global.product.glassIndex][$scope.global.product.glassIndex].heatCoeff;
        $scope.global.product.glassAirCoeff = $scope.global.glasses[$scope.global.product.glassIndex][$scope.global.product.glassIndex].airCoeff;
      } else {
        console.log(results);
      }
    });


    //----------- get all profiles
    constructService.getAllProfileSystems().then(function (data) {
      $scope.downloadAllProfiles(data);
    }).then(function () {

      var ramaQueries = [],
          sashQueries = [],
          ramaStillQueries = [],
          impostQueries = [],
          shtulpQueries = [],
          k;

      for(k = 0; k < $scope.global.profiles.length; k++) {
        ramaQueries.push(constructService.getAllProfileSizes($scope.global.profiles[k].rama_id));
        ramaStillQueries.push(constructService.getAllProfileSizes($scope.global.profiles[k].rama_still_id));
        sashQueries.push(constructService.getAllProfileSizes($scope.global.profiles[k].sash_id));
        impostQueries.push(constructService.getAllProfileSizes($scope.global.profiles[k].impost_id));
        shtulpQueries.push(constructService.getAllProfileSizes($scope.global.profiles[k].shtulp_id));
      }

      $q.all(ramaQueries).then(function (data) {
        $scope.downloadProfileElementSizes(data, 'frame');
      });
      $q.all(ramaStillQueries).then(function (data) {
        $scope.downloadProfileElementSizes(data, 'frame-still');
      });
      $q.all(sashQueries).then(function (data) {
        $scope.downloadProfileElementSizes(data, 'sash');
      });
      $q.all(impostQueries).then(function (data) {
        $scope.downloadProfileElementSizes(data, 'impost');
      });
      $q.all(shtulpQueries).then(function (data) {
        $scope.downloadProfileElementSizes(data, 'shtulp');
      }).then(function () {
        $scope.downloadAllTemplates();
      });
    });

    //----------- get all hardware
    constructService.getAllHardware(function (results) {
      if (results.status) {
        $scope.global.hardwareTypes = angular.copy(results.data.hardwaresTypes);
        $scope.global.hardwares = angular.copy(results.data.hardwares);

        //----- set first current hardware
        $scope.global.product.hardwareId = $scope.global.hardwares[$scope.global.product.hardwareIndex][$scope.global.product.hardwareIndex].hardwareId;
        $scope.global.product.hardwareName = $scope.global.hardwares[$scope.global.product.hardwareIndex][$scope.global.product.hardwareIndex].hardwareName;
        $scope.global.product.hardwareHeatCoeff = $scope.global.hardwares[$scope.global.product.hardwareIndex][$scope.global.product.hardwareIndex].heatCoeff;
        $scope.global.product.hardwareAirCoeff = $scope.global.hardwares[$scope.global.product.hardwareIndex][$scope.global.product.hardwareIndex].airCoeff;

      } else {
        console.log(results);
      }
    });

    //----------- get all lamination
    constructService.getAllLamination(function (results) {
      if (results.status) {
        $scope.global.laminationsWhite = angular.copy(results.data.laminationWhite);
        $scope.global.laminationsIn = angular.copy(results.data.laminationInside);
        $scope.global.laminationsOut = angular.copy(results.data.laminationOutside);

        //----- set first current lamination white
        $scope.global.product.laminationOutName = $scope.global.laminationsWhite;
        $scope.global.product.laminationInName = $scope.global.laminationsWhite;
      } else {
        console.log(results);
      }
    });

  }



  //=============== CREATE NEW PROJECT =========
  $scope.global.createNewProject = function() {
    if(!$scope.global.startProgramm && $scope.global.isCreatedNewProject && $scope.global.isCreatedNewProduct && !$scope.global.isReturnFromDiffPage) {
      //------- create new empty product
      $scope.global.product = angular.copy($scope.global.productDefault);
      //------- create new empty order
      $scope.global.order = angular.copy($scope.global.orderSource);

      $scope.global.isConstructWind = true;
      $scope.global.isConstructWindDoor = false;
      $scope.global.isConstructBalcony = false;
      $scope.global.isConstructDoor = false;
      //------- get templates from STORE
      $scope.global.setTemplatesFromSTORE();
      //-------- set current templates arrays
      $scope.global.getCurrentTemplates();

      //------- create order date
      console.log('new project!!!!!!!!!!!!!!');
      console.log('product ====== ', $scope.global.product);
      console.log('order ====== ', $scope.global.order);
      $scope.global.createOrderData();
    }
  };




  //=============== CREATE NEW PRODUCT =========
  $scope.global.createNewProduct = function() {
    if (!$scope.global.startProgramm && !$scope.global.isCreatedNewProject && $scope.global.isCreatedNewProduct && !$scope.global.isReturnFromDiffPage) {
      //------- create new empty product
      $scope.global.product = angular.copy($scope.global.productDefault);
      //------- get templates from STORE
      $scope.global.setTemplatesFromSTORE();
      //-------- set current templates arrays
      $scope.global.getCurrentTemplates();
      console.log('new product!!!!!!!!!!!!!!!');
      console.log('product ====== ', $scope.global.product);
      console.log('order ====== ', $scope.global.order);
    }
  };


  $scope.global.createNewProject();

  $scope.global.createNewProduct();


  //console.log('main page!!!!!!!!!!!!!!!');
  //console.log('product ====== ', $scope.global.product);
  //console.log('order ====== ', $scope.global.order);




  //------- Select menu item
  $scope.selectTemplatePanel = function() {
    if($scope.global.showPanels.showTemplatePanel) {
      $scope.global.showPanels.showTemplatePanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showTemplatePanel = true;
      $scope.global.isTemplatePanel = true;
      $scope.global.isAddElementListView = false;
    }
  };
  $scope.selectProfilePanel = function() {
    if($scope.global.showPanels.showProfilePanel) {
      $scope.global.showPanels.showProfilePanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showProfilePanel = true;
      $scope.global.isProfilePanel = true;
      $scope.global.isAddElementListView = false;
    }
  };
  $scope.selectGlassPanel = function() {
    if($scope.global.showPanels.showGlassPanel) {
      $scope.global.showPanels.showGlassPanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showGlassPanel = true;
      $scope.global.isGlassPanel = true;
      $scope.global.isAddElementListView = false;
    }
  };
  $scope.selectHardwarePanel = function() {
    if($scope.global.showPanels.showHardwarePanel) {
      $scope.global.showPanels.showHardwarePanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showHardwarePanel = true;
      $scope.global.isHardwarePanel = true;
      $scope.global.isAddElementListView = false;
    }
  };
  $scope.selectLaminationPanel = function() {
    if($scope.global.showPanels.showLaminationPanel) {
      $scope.global.showPanels.showLaminationPanel = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showLaminationPanel = true;
      $scope.global.isLaminationPanel = true;
      $scope.global.isAddElementListView = false;
    }
  };
  $scope.selectAddElementsPanel = function() {
    if($scope.global.showPanels.showAddElementsPanel) {
      $scope.global.showPanels.showAddElementsPanel = false;
      $scope.global.isAddElementListView = false;
    } else {
      clearShowPanelsObj();
      $scope.global.showPanels.showAddElementsPanel = true;
      $scope.global.isAddElementsPanel = true;
    }
    $scope.global.isFocusedAddElement = false;
    $scope.global.isTabFrame = false;
    $scope.global.showAddElementsMenu = false;
    $scope.global.desactiveAddElementParameters();
  };

  // Close all panels
  function clearShowPanelsObj() {
    for (var item in $scope.global.showPanels) {
      delete $scope.global.showPanels[item];
    }
    //---- close Scheme Dialog in AddElements
    $scope.global.isWindowSchemeDialog = false;
    //playSound('switching');
  }







  $scope.insertProductInLocalDB = function(product) {

    var productData = angular.copy(product),
        addElementsData = {},
        addElementsObj = product.chosenAddElements;

    //-------- insert product into local DB
    //productData.orderId = product.orderID;
    productData.heatTransferMin = $scope.global.currentGeoLocation.heatTransfer;
    productData.templateSource = JSON.stringify(product.templateSource);
    productData.laminationOutPrice = parseFloat(product.laminationOutPrice.toFixed(2));
    productData.laminationInPrice = parseFloat(product.laminationInPrice.toFixed(2));
    productData.templatePriceSELECT = parseFloat(product.templatePriceSELECT.toFixed(2));
    productData.laminationPriceSELECT = parseFloat(product.laminationPriceSELECT.toFixed(2));
    productData.addElementsPriceSELECT = parseFloat(product.addElementsPriceSELECT.toFixed(2));
    productData.productPriceTOTAL = parseFloat(product.productPriceTOTAL.toFixed(2));
    delete productData.templateDefault;
    delete productData.templateIcon;
    delete productData.chosenAddElements;
    localDB.insertDB($scope.global.productsTableBD, productData);


    //--------- insert additional elements into local DB
    for(var prop in addElementsObj) {
      if (!addElementsObj.hasOwnProperty(prop)) {
        continue;
      }
      for (var elem = 0; elem < addElementsObj[prop].length; elem++) {
        addElementsData = {
          "orderId": product.orderId,
          "productId": product.productId,
          "elementId": addElementsObj[prop][elem].elementId,
          "elementType": addElementsObj[prop][elem].elementType,
          "elementName": addElementsObj[prop][elem].elementName,
          "elementWidth": addElementsObj[prop][elem].elementWidth,
          "elementHeight": addElementsObj[prop][elem].elementHeight,
          "elementColor": addElementsObj[prop][elem].elementColor,
          "elementPrice": addElementsObj[prop][elem].elementPrice,
          "elementQty": addElementsObj[prop][elem].elementQty
        };

        localDB.insertDB($scope.global.addElementsTableBD, addElementsData);
      }
    }
  };


  // Save Product in Order and enter in Cart
  $scope.global.inputProductInOrder = function() {

    //=========== if no EDIT product
    if ($scope.global.productEditNumber === '') {

      //-------- add product in order LocalStorage
      $scope.global.product.orderId = $scope.global.order.orderId;
      $scope.global.product.productId = ($scope.global.order.products.length > 0) ? ($scope.global.order.products.length + 1) : 1;
      $scope.global.order.products.push($scope.global.product);
      $scope.global.order.productsQty = $scope.global.order.products.length;
      $scope.insertProductInLocalDB($scope.global.product);

    } else {
      //-------- replace product in order LocalStorage
      for(var prod = 0; prod < $scope.global.order.products.length; prod++) {
        if(prod === $scope.global.productEditNumber) {
          $scope.global.order.products[prod] = angular.copy($scope.global.product);
        }
      }

    }

    $scope.global.isCreatedNewProject = false;
    $scope.global.isCreatedNewProduct = false;

  };


  //--------- moving to Cart when click on Cart button
  $scope.movetoCart = function() {
    $timeout(function(){
      $scope.global.gotoCartPage();
    }, 2*STEP);
  };

}]);


// controllers/menus/elements-list.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('ElementsListCtrl', ['$scope', 'localStorage', 'globalDB', '$timeout', function ($scope, localStorage, globalDB, $timeout) {

  var sourceAddElement, cloneAddElement;

  $scope.global = localStorage;

  $scope.addElementsMenu = {
    DELAY_START: STEP,
    DELAY_SHOW_ELEMENTS_MENU: STEP * 10,

    tempSize: [],
    typing: 'on'
  };

  // Select AddElement
  $scope.chooseAddElement = function(typeIndex, elementIndex) {
    if(typeIndex === undefined && elementIndex === undefined) {
      $scope.global.desactiveAddElementParameters();
      $scope.global.isAddElement = false;

      switch($scope.global.isFocusedAddElement) {
        case 1:
          $scope.global.product.chosenAddElements.selectedGrids.length = 0;
          break;
        case 2:
          $scope.global.product.chosenAddElements.selectedVisors.length = 0;
          break;
        case 3:
          $scope.global.product.chosenAddElements.selectedSpillways.length = 0;
          break;
        case 4:
          $scope.global.product.chosenAddElements.selectedOutsideSlope.length = 0;
          break;
        case 5:
          $scope.global.product.chosenAddElements.selectedLouvers.length = 0;
          break;
        case 6:
          $scope.global.product.chosenAddElements.selectedInsideSlope.length = 0;
          break;
        case 7:
          $scope.global.product.chosenAddElements.selectedConnectors.length = 0;
          break;
        case 8:
          $scope.global.product.chosenAddElements.selectedFans.length = 0;
          break;
        case 9:
          $scope.global.product.chosenAddElements.selectedWindowSill.length = 0;
          break;
        case 10:
          $scope.global.product.chosenAddElements.selectedHandles.length = 0;
          break;
        case 11:
          $scope.global.product.chosenAddElements.selectedOthers.length = 0;
          break;
      }
      //Set Total Product Price
      $scope.setAddElementsTotalPrice();

    } else {
      $scope.global.isAddElement = typeIndex+'-'+elementIndex;

      sourceAddElement = $scope.global.addElementsList[typeIndex][elementIndex];
      cloneAddElement = angular.copy(sourceAddElement);

      //-------- Show current add element price
      $scope.global.objXAddElementPrice = angular.copy($scope.global.objXAddElementPriceSource);
      $scope.global.objXAddElementPrice.cityId = $scope.global.userInfo.city_id;
      $scope.global.objXAddElementPrice.elementId = cloneAddElement.elementId;
      $scope.global.objXAddElementPrice.elementLength = cloneAddElement.elementWidth;
      console.log($scope.global.objXAddElementPrice);
      globalDB.getAdditionalPrice($scope.global.objXAddElementPrice, function (results) {
        if (results.status) {
          //console.log(results.data);
          cloneAddElement.elementPrice = parseFloat(results.data.price);
          $scope.addElementsMenu.isAddElementPrice = true;
          $scope.currAddElementPrice = cloneAddElement.elementPrice;

          $scope.pushSelectedAddElement();
          //Set Total Product Price
          $scope.setAddElementsTotalPrice();
          $scope.$apply();

        } else {
          console.log(results);
        }
      });

      if($scope.global.isAddElementListView) {
        $scope.global.isAddElement = 1;
      }
    }

  };


  //--------- when we select new addElement, function checks is there this addElements in order to increase only elementQty
  function checkExistedSelectAddElement(elementsArr, elementId) {
    for(var j = 0; j < elementsArr.length; j++){
      if(elementsArr[j].elementId === elementId) {
        return j;
      }
    }
  }


  $scope.pushSelectedAddElement = function() {
    var existedElement;
    switch($scope.global.isFocusedAddElement) {
      case 1:
        existedElement = checkExistedSelectAddElement($scope.global.product.chosenAddElements.selectedGrids, cloneAddElement.elementId);
        if(existedElement === undefined) {
          cloneAddElement.elementType = 1;
          cloneAddElement.elementWidth = 0;
          cloneAddElement.elementHeight = 0;
          cloneAddElement.elementColor = '';
          $scope.global.product.chosenAddElements.selectedGrids.push(cloneAddElement);
          //---- open TABFrame when second element selected
          if($scope.global.product.chosenAddElements.selectedGrids.length === 2) {
            $scope.global.isTabFrame = true;
          }
        } else {
          $scope.global.product.chosenAddElements.selectedGrids[existedElement].elementQty += 1;
        }
        break;
      case 2:
        existedElement = checkExistedSelectAddElement($scope.global.product.chosenAddElements.selectedVisors, cloneAddElement.elementId);
        if(existedElement === undefined) {
          cloneAddElement.elementType = 2;
          cloneAddElement.elementHeight = 0;
          cloneAddElement.elementColor = '';
          $scope.global.product.chosenAddElements.selectedVisors.push(cloneAddElement);
          //---- open TABFrame when second element selected
          if($scope.global.product.chosenAddElements.selectedVisors.length === 2) {
            $scope.global.isTabFrame = true;
          }
        } else {
          $scope.global.product.chosenAddElements.selectedVisors[existedElement].elementQty += 1;
        }
        break;
      case 3:
        existedElement = checkExistedSelectAddElement($scope.global.product.chosenAddElements.selectedSpillways, cloneAddElement.elementId);
        if(existedElement === undefined) {
          cloneAddElement.elementType = 3;
          cloneAddElement.elementHeight = 0;
          cloneAddElement.elementColor = '';
          $scope.global.product.chosenAddElements.selectedSpillways.push(cloneAddElement);
          //---- open TABFrame when second element selected
          if($scope.global.product.chosenAddElements.selectedSpillways.length === 2) {
            $scope.global.isTabFrame = true;
          }
        } else {
          $scope.global.product.chosenAddElements.selectedSpillways[existedElement].elementQty += 1;
        }
        break;
      case 4:
        existedElement = checkExistedSelectAddElement($scope.global.product.chosenAddElements.selectedOutsideSlope, cloneAddElement.elementId);
        if(existedElement === undefined) {
          cloneAddElement.elementType = 4;
          cloneAddElement.elementHeight = 0;
          cloneAddElement.elementColor = '';
          $scope.global.product.chosenAddElements.selectedOutsideSlope.push(cloneAddElement);
          //---- open TABFrame when second element selected
          if($scope.global.product.chosenAddElements.selectedOutsideSlope.length === 2) {
            $scope.global.isTabFrame = true;
          }
        } else {
          $scope.global.product.chosenAddElements.selectedOutsideSlope[existedElement].elementQty += 1;
        }
        break;
      case 5:
        existedElement = checkExistedSelectAddElement($scope.global.product.chosenAddElements.selectedLouvers, cloneAddElement.elementId);
        if(existedElement === undefined) {
          cloneAddElement.elementType = 5;
          cloneAddElement.elementColor = '';
          $scope.global.product.chosenAddElements.selectedLouvers.push(cloneAddElement);
          //---- open TABFrame when second element selected
          if($scope.global.product.chosenAddElements.selectedLouvers.length === 2) {
            $scope.global.isTabFrame = true;
          }
        } else {
          $scope.global.product.chosenAddElements.selectedLouvers[existedElement].elementQty += 1;
        }
        break;
      case 6:
        existedElement = checkExistedSelectAddElement($scope.global.product.chosenAddElements.selectedInsideSlope, cloneAddElement.elementId);
        if(existedElement === undefined) {
          cloneAddElement.elementType = 6;
          cloneAddElement.elementHeight = 0;
          cloneAddElement.elementColor = '';
          $scope.global.product.chosenAddElements.selectedInsideSlope.push(cloneAddElement);
          //---- open TABFrame when second element selected
          if($scope.global.product.chosenAddElements.selectedInsideSlope.length === 2) {
            $scope.global.isTabFrame = true;
          }
        } else {
          $scope.global.product.chosenAddElements.selectedInsideSlope[existedElement].elementQty += 1;
        }
        break;
      case 7:
        existedElement = checkExistedSelectAddElement($scope.global.product.chosenAddElements.selectedConnectors, cloneAddElement.elementId);
        if(existedElement === undefined) {
          cloneAddElement.elementType = 7;
          cloneAddElement.elementHeight = 0;
          cloneAddElement.elementColor = '';
          $scope.global.product.chosenAddElements.selectedConnectors.push(cloneAddElement);
          //---- open TABFrame when second element selected
          if($scope.global.product.chosenAddElements.selectedConnectors.length === 2) {
            $scope.global.isTabFrame = true;
          }
        } else {
          $scope.global.product.chosenAddElements.selectedConnectors[existedElement].elementQty += 1;
        }
        break;
      case 8:
        existedElement = checkExistedSelectAddElement($scope.global.product.chosenAddElements.selectedFans, cloneAddElement.elementId);
        if(existedElement === undefined) {
          cloneAddElement.elementType = 8;
          cloneAddElement.elementWidth = 0;
          cloneAddElement.elementHeight = 0;
          cloneAddElement.elementColor = '';
          $scope.global.product.chosenAddElements.selectedFans.push(cloneAddElement);
          //---- open TABFrame when second element selected
          if($scope.global.product.chosenAddElements.selectedFans.length === 2) {
            $scope.global.isTabFrame = true;
          }
        } else {
          $scope.global.product.chosenAddElements.selectedFans[existedElement].elementQty += 1;
        }
        break;
      case 9:
        existedElement = checkExistedSelectAddElement($scope.global.product.chosenAddElements.selectedWindowSill, cloneAddElement.elementId);
        if(existedElement === undefined) {
          cloneAddElement.elementType = 9;
          cloneAddElement.elementHeight = 0;
          $scope.global.product.chosenAddElements.selectedWindowSill.push(cloneAddElement);
          //---- open TABFrame when second element selected
          if($scope.global.product.chosenAddElements.selectedWindowSill.length === 2) {
            $scope.global.isTabFrame = true;
          }
        } else {
          $scope.global.product.chosenAddElements.selectedWindowSill[existedElement].elementQty += 1;
        }
        break;
      case 10:
        existedElement = checkExistedSelectAddElement($scope.global.product.chosenAddElements.selectedHandles, cloneAddElement.elementId);
        if(existedElement === undefined) {
          cloneAddElement.elementType = 10;
          cloneAddElement.elementWidth = 0;
          cloneAddElement.elementHeight = 0;
          cloneAddElement.elementColor = '';
          $scope.global.product.chosenAddElements.selectedHandles.push(cloneAddElement);
          //---- open TABFrame when second element selected
          if($scope.global.product.chosenAddElements.selectedHandles.length === 2) {
            $scope.global.isTabFrame = true;
          }
        } else {
          $scope.global.product.chosenAddElements.selectedHandles[existedElement].elementQty += 1;
        }
        break;
      case 11:
        existedElement = checkExistedSelectAddElement($scope.global.product.chosenAddElements.selectedOthers, cloneAddElement.elementId);
        if(existedElement === undefined) {
          cloneAddElement.elementType = 11;
          cloneAddElement.elementWidth = 0;
          cloneAddElement.elementHeight = 0;
          cloneAddElement.elementColor = '';
          $scope.global.product.chosenAddElements.selectedOthers.push(cloneAddElement);
          //---- open TABFrame when second element selected
          if($scope.global.product.chosenAddElements.selectedOthers.length === 2) {
            $scope.global.isTabFrame = true;
          }
        } else {
          $scope.global.product.chosenAddElements.selectedOthers[existedElement].elementQty += 1;
        }
        break;
    }

  };


  $scope.setAddElementsTotalPrice = function() {
    $scope.global.product.addElementsPriceSELECT = 0;
    for (var prop in $scope.global.product.chosenAddElements) {
      if (!$scope.global.product.chosenAddElements.hasOwnProperty(prop)) {
        continue;
      } else {
        if ($scope.global.product.chosenAddElements[prop].length > 0) {
          for (var elem = 0; elem < $scope.global.product.chosenAddElements[prop].length; elem++) {
            $scope.global.product.addElementsPriceSELECT += $scope.global.product.chosenAddElements[prop][elem].elementQty * $scope.global.product.chosenAddElements[prop][elem].elementPrice;
          }
        }
      }
    }
    $scope.global.setProductPriceTOTALapply();
  };




  // Select Add Element when open List View
  $scope.selectElementListView = function(typeId, elementId, clickEvent) {
    if(typeId === undefined && elementId === undefined) {
      $scope.global.isAddElement = false;
    } else if($scope.global.isAddElement === typeId+'-'+elementId) {
      $scope.global.isAddElement = 1;
    } else if($scope.global.isAddElement === false || $scope.global.isAddElement === 1) {
      var coord = $(clickEvent.target).offset();
      //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
      $scope.addElementsMenu.coordinats = {'top': coord.top-17};
      $timeout(function() {
        $scope.global.isAddElement = typeId + '-' + elementId;
      }, 500);
    } else {
      $scope.global.isAddElement = 1;
      $timeout(function() {
        var coord = $(clickEvent.target).offset();
        //$scope.addElementsMenu.coordinats = {'top': coord.top-34};
        $scope.addElementsMenu.coordinats = {'top': coord.top-17};
      }, 500);
      $timeout(function() {
        $scope.global.isAddElement = typeId + '-' + elementId;
      }, 1000);
    }
  };



  // Show Tabs
  $scope.showFrameTabs = function() {
    //playSound('swip');
    $scope.global.isTabFrame = !$scope.global.isTabFrame;
  };

  // Delete AddElement from global object
  $scope.global.deleteAddElement = function(typeId, elementId) {
    switch(typeId) {
      case 1:
        $scope.global.product.chosenAddElements.selectedGrids.splice(elementId, 1);
        break;
      case 2:
        $scope.global.product.chosenAddElements.selectedVisors.splice(elementId, 1);
        break;
      case 3:
        $scope.global.product.chosenAddElements.selectedSpillways.splice(elementId, 1);
        break;
      case 4:
        $scope.global.product.chosenAddElements.selectedOutsideSlope.splice(elementId, 1);
        break;
      case 5:
        $scope.global.product.chosenAddElements.selectedLouvers.splice(elementId, 1);
        break;
      case 6:
        $scope.global.product.chosenAddElements.selectedInsideSlope.splice(elementId, 1);
        break;
      case 7:
        $scope.global.product.chosenAddElements.selectedConnectors.splice(elementId, 1);
        break;
      case 8:
        $scope.global.product.chosenAddElements.selectedFans.splice(elementId, 1);
        break;
      case 9:
        $scope.global.product.chosenAddElements.selectedWindowSill.splice(elementId, 1);
        break;
      case 10:
        $scope.global.product.chosenAddElements.selectedHandles.splice(elementId, 1);
        break;
      case 11:
        $scope.global.product.chosenAddElements.selectedOthers.splice(elementId, 1);
        break;
    }
    $scope.global.desactiveAddElementParameters();
    //Set Total Product Price
    $scope.setAddElementsTotalPrice();
  };

  // Close AddElements Menu
  $scope.closeAddElementsMenu = function() {
    $scope.global.isFocusedAddElement = false;
    $scope.global.isTabFrame = false;
    //playSound('swip');
    $scope.global.showAddElementsMenu = false;
    $scope.global.desactiveAddElementParameters();
    $timeout(function() {
      $scope.global.isAddElement = false;
      //playSound('swip');
      $scope.global.addElementsMenuStyle = false;
    }, $scope.addElementsMenu.DELAY_SHOW_ELEMENTS_MENU);
  };


  // Change Qty parameter
  $scope.setValueQty = function(newValue) {
    var elementId = $scope.global.currentAddElementId;
    switch($scope.global.isFocusedAddElement) {
      case 1:
        if($scope.global.product.chosenAddElements.selectedGrids[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.product.chosenAddElements.selectedGrids[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.product.chosenAddElements.selectedGrids[elementId].elementQty += newValue;
        }
        break;
      case 2:
        if($scope.global.product.chosenAddElements.selectedVisors[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.product.chosenAddElements.selectedVisors[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.product.chosenAddElements.selectedVisors[elementId].elementQty += newValue;
        }
        break;
      case 3:
        if($scope.global.product.chosenAddElements.selectedSpillways[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.product.chosenAddElements.selectedSpillways[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.product.chosenAddElements.selectedSpillways[elementId].elementQty += newValue;
        }
        break;
      case 4:
        if($scope.global.product.chosenAddElements.selectedOutsideSlope[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.product.chosenAddElements.selectedOutsideSlope[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.product.chosenAddElements.selectedOutsideSlope[elementId].elementQty += newValue;
        }
        break;
      case 5:
        if($scope.global.product.chosenAddElements.selectedLouvers[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.product.chosenAddElements.selectedLouvers[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.product.chosenAddElements.selectedLouvers[elementId].elementQty += newValue;
        }
        break;
      case 6:
        if($scope.global.product.chosenAddElements.selectedInsideSlope[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.product.chosenAddElements.selectedInsideSlope[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.product.chosenAddElements.selectedInsideSlope[elementId].elementQty += newValue;
        }
        break;
      case 7:
        if($scope.global.product.chosenAddElements.selectedConnectors[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.product.chosenAddElements.selectedConnectors[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.product.chosenAddElements.selectedConnectors[elementId].elementQty += newValue;
        }
        break;
      case 8:
        if($scope.global.product.chosenAddElements.selectedFans[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.product.chosenAddElements.selectedFans[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.product.chosenAddElements.selectedFans[elementId].elementQty += newValue;
        }
        break;
      case 9:
        if($scope.global.product.chosenAddElements.selectedWindowSill[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.product.chosenAddElements.selectedWindowSill[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.product.chosenAddElements.selectedWindowSill[elementId].elementQty += newValue;
        }
        break;
      case 10:
        if($scope.global.product.chosenAddElements.selectedHandles[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.product.chosenAddElements.selectedHandles[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.product.chosenAddElements.selectedHandles[elementId].elementQty += newValue;
        }
        break;
      case 11:
        if($scope.global.product.chosenAddElements.selectedOthers[elementId].elementQty < 2 && newValue < 0) {
          break;
        } else if($scope.global.product.chosenAddElements.selectedOthers[elementId].elementQty < 6 && newValue == -5) {
          break;
        } else {
          $scope.global.product.chosenAddElements.selectedOthers[elementId].elementQty += newValue;
        }
        break;
    }
    //Set Total Product Price
    $scope.setAddElementsTotalPrice();
  };

  // Close Qty Calculator
  $scope.closeQtyCaclulator = function() {
    $scope.global.desactiveAddElementParameters();
  };

  // Change Size parameter
  $scope.setValueSize = function(newValue) {
    //console.log($scope.addElementsMenu.tempSize);
    if($scope.addElementsMenu.tempSize.length == 1 && $scope.addElementsMenu.tempSize[0] === 0) {
      $scope.addElementsMenu.tempSize.length = 0;
    }

    if($scope.addElementsMenu.tempSize.length < 4) {
      if(newValue === '00'){
        $scope.addElementsMenu.tempSize.push(0, 0);
      } else {
        $scope.addElementsMenu.tempSize.push(newValue);
      }
    }
    changeElementSize();
  };

  // Delete last number
  $scope.deleteLastNumber = function() {
    $scope.addElementsMenu.tempSize.pop();
    if($scope.addElementsMenu.tempSize.length < 1) {
      $scope.addElementsMenu.tempSize.push(0);
    }
    changeElementSize();
  };

  // Close Size Calculator
  $scope.closeSizeCaclulator = function() {
    $scope.global.isWidthCalculator = false;
    $scope.addElementsMenu.tempSize.length = 0;
    $scope.global.desactiveAddElementParameters();

    //-------- recalculate add element price
    $scope.global.objXAddElementPrice.cityId = $scope.global.userInfo.city_id;
    switch ($scope.global.isFocusedAddElement) {
      case 2:
        $scope.global.objXAddElementPrice.elementId = $scope.global.product.chosenAddElements.selectedVisors[$scope.global.currentAddElementId].elementId;
        $scope.global.objXAddElementPrice.elementLength = $scope.global.product.chosenAddElements.selectedVisors[$scope.global.currentAddElementId].elementWidth;
        break;
      case 3:
        $scope.global.objXAddElementPrice.elementId = $scope.global.product.chosenAddElements.selectedSpillways[$scope.global.currentAddElementId].elementId;
        $scope.global.objXAddElementPrice.elementLength = $scope.global.product.chosenAddElements.selectedSpillways[$scope.global.currentAddElementId].elementWidth;
        break;
      case 4:
        $scope.global.objXAddElementPrice.elementId = $scope.global.product.chosenAddElements.selectedOutsideSlope[$scope.global.currentAddElementId].elementId;
        $scope.global.objXAddElementPrice.elementLength = $scope.global.product.chosenAddElements.selectedOutsideSlope[$scope.global.currentAddElementId].elementWidth;
        break;
      case 5:
        $scope.global.objXAddElementPrice.elementId = $scope.global.product.chosenAddElements.selectedLouvers[$scope.global.currentAddElementId].elementId;
        $scope.global.objXAddElementPrice.elementLength = $scope.global.product.chosenAddElements.selectedLouvers[$scope.global.currentAddElementId].elementWidth;
        break;
      case 6:
        $scope.global.objXAddElementPrice.elementId = $scope.global.product.chosenAddElements.selectedInsideSlope[$scope.global.currentAddElementId].elementId;
        $scope.global.objXAddElementPrice.elementLength = $scope.global.product.chosenAddElements.selectedInsideSlope[$scope.global.currentAddElementId].elementWidth;
        break;
      case 7:
        $scope.global.objXAddElementPrice.elementId = $scope.global.product.chosenAddElements.selectedConnectors[$scope.global.currentAddElementId].elementId;
        $scope.global.objXAddElementPrice.elementLength = $scope.global.product.chosenAddElements.selectedConnectors[$scope.global.currentAddElementId].elementWidth;
        break;
      case 9:
        $scope.global.objXAddElementPrice.elementId = $scope.global.product.chosenAddElements.selectedWindowSill[$scope.global.currentAddElementId].elementId;
        $scope.global.objXAddElementPrice.elementLength = $scope.global.product.chosenAddElements.selectedWindowSill[$scope.global.currentAddElementId].elementWidth;
        break;
    }

    console.log('objXAddElementPrice change size ===== ', $scope.global.objXAddElementPrice);
    globalDB.getAdditionalPrice($scope.global.objXAddElementPrice, function (results) {
      if (results.status) {
        console.log('change size!!!!!!!');
        console.log(results.data.price);
        var newElementPrice = parseFloat(results.data.price);
        $scope.addElementsMenu.isAddElementPrice = true;
        $scope.currAddElementPrice = newElementPrice;

        switch ($scope.global.isFocusedAddElement) {
          case 2:
            $scope.global.product.chosenAddElements.selectedVisors[$scope.global.currentAddElementId].elementPrice = newElementPrice;
            break;
          case 3:
            $scope.global.product.chosenAddElements.selectedSpillways[$scope.global.currentAddElementId].elementPrice = newElementPrice;
            break;
          case 4:
            $scope.global.product.chosenAddElements.selectedOutsideSlope[$scope.global.currentAddElementId].elementPrice = newElementPrice;
            break;
          case 5:
            $scope.global.product.chosenAddElements.selectedLouvers[$scope.global.currentAddElementId].elementPrice = newElementPrice;
            break;
          case 6:
            $scope.global.product.chosenAddElements.selectedInsideSlope[$scope.global.currentAddElementId].elementPrice = newElementPrice;
            break;
          case 7:
            $scope.global.product.chosenAddElements.selectedConnectors[$scope.global.currentAddElementId].elementPrice = newElementPrice;
            break;
          case 9:
            $scope.global.product.chosenAddElements.selectedWindowSill[$scope.global.currentAddElementId].elementPrice = newElementPrice;
            break;
        }
        console.log('chosenAddElements === ', $scope.global.product.chosenAddElements);
        //Set Total Product Price
        $scope.setAddElementsTotalPrice();
        $scope.$apply();

      } else {
        console.log(results);
      }
    });

  };

  function changeElementSize(){
    var newElementSize = '';
    for(var numer = 0; numer < $scope.addElementsMenu.tempSize.length; numer++) {
      newElementSize += $scope.addElementsMenu.tempSize[numer].toString();
    }
    var elementId = $scope.global.currentAddElementId;
    newElementSize = parseInt(newElementSize, 10);
    if($scope.global.isWidthCalculator) {
      switch($scope.global.isFocusedAddElement) {
        case 2:
          $scope.global.product.chosenAddElements.selectedVisors[elementId].elementWidth = newElementSize;
          break;
        case 3:
          $scope.global.product.chosenAddElements.selectedSpillways[elementId].elementWidth = newElementSize;
          break;
        case 4:
          $scope.global.product.chosenAddElements.selectedOutsideSlope[elementId].elementWidth = newElementSize;
          break;
        case 5:
          $scope.global.product.chosenAddElements.selectedLouvers[elementId].elementWidth = newElementSize;
          break;
        case 6:
          $scope.global.product.chosenAddElements.selectedInsideSlope[elementId].elementWidth = newElementSize;
          break;
        case 7:
          $scope.global.product.chosenAddElements.selectedConnectors[elementId].elementWidth = newElementSize;
          break;
        case 9:
          $scope.global.product.chosenAddElements.selectedWindowSill[elementId].elementWidth = newElementSize;
          break;
      }
    } else {
      if($scope.global.isFocusedAddElement === 5) {
        $scope.global.product.chosenAddElements.selectedLouvers[elementId].elementHeight = newElementSize;
      }
    }
  }


  // Select Add Element Lamination
  $scope.selectAddElementColor = function(id) {
    $scope.global.isAddElementColor = id;
    var elementId = $scope.global.currentAddElementId;
    if(id === 'matt') {
      $scope.global.product.chosenAddElements.selectedWindowSill[elementId].elementColor = $scope.global.addElementLaminatWhiteMatt.laminationUrl;
      $scope.global.product.chosenAddElements.selectedWindowSill[elementId].elementColorId = 'matt';
    } else if(id === 'glossy') {
      $scope.global.product.chosenAddElements.selectedWindowSill[elementId].elementColor = $scope.global.addElementLaminatWhiteGlossy.laminationUrl;
      $scope.global.product.chosenAddElements.selectedWindowSill[elementId].elementColorId = 'glossy';
    } else {
      $scope.global.product.chosenAddElements.selectedWindowSill[elementId].elementColor = $scope.global.addElementLaminatColor[id].laminationUrl;
      $scope.global.product.chosenAddElements.selectedWindowSill[elementId].elementColorId = id;
    }
  };

  $scope.clearSelectedAddElement = function() {

    $scope.global.isAddElement = false;

  };

}]);



// controllers/menus/navigation-menu.js

/* globals STEP, activeClass, typingTextByChar, showElementWithDelay, addClassWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('NavMenuCtrl', ['$scope', '$http', '$location', 'globalDB', 'constructService', 'localDB', 'localStorage', '$translate', '$timeout', '$filter', function ($scope, $http, $location, globalDB, constructService, localDB, localStorage, $translate, $timeout, $filter) {

  $scope.global = localStorage;

  $scope.navMenu = {
    DELAY_SHOW_NAV_LIST: 5 * STEP,
    DELAY_SHOW_STEP: 0.2,
    DELAY_SHOW_NAVICON: 10 * STEP,
    DELAY_TYPE_NAVTITLE: 10 * STEP,
    DELAY_TYPE_DIVIDER: 10 * STEP,
    DELAY_SHOW_ORDERS: 35 * STEP,
    DELAY_SHOW_NEWCALC_BTN: 35 * STEP,
    typing: 'on'
  };

/*
  // Check Products in Order
  $scope.checkingForNewOrder = function() {
    if ($scope.global.isCreatedNewProject) {
      //----------- create order number for new project
      $scope.global.order.orderId = Math.floor((Math.random() * 100000));
      //$scope.global.isCreatedNewProject = false;
      $scope.global.productCounter = false;
      //console.log('navmenu NEW - ' + $scope.global.isCreatedNewProject);
      //console.log('navmenu NEW orderNumber - ' + $scope.global.order.orderIdorder.orderId);
    } else {
      //console.log('navmenu OLD - ' + $scope.global.order.orderIdorder.orderId);
      localDB.selectDB($scope.global.productsTableBD, {'orderId': $scope.global.order.orderId}, function (results) {
        if (results.status) {
          $scope.global.productCounter = results.data.length;
        } else {
          console.log(results);
        }
      });
    }
  };
  //----- generate new order number or calculate products in order
  $scope.checkingForNewOrder();
*/


  //--------- get user data and location for first time

  if($scope.global.startProgramm) {
    localDB.selectAllDBGlobal($scope.global.usersTableDBGlobal, function (results) {
      if (results.status) {
        $scope.global.userInfo = angular.copy(results.data[0]);
        //------ find user city in global DB
        localDB.selectDBGlobal($scope.global.citiesTableDBGlobal, {'id': $scope.global.userInfo.city_id }, function (results) {
          if (results.status) {
            $scope.global.userInfo.cityName = results.data[0].name;
            //------ find user region in global DB
            localDB.selectDBGlobal($scope.global.regionsTableDBGlobal, {'id': results.data[0].region_id }, function (results) {
              if (results.status) {
                $scope.global.userInfo.regionName = results.data[0].name;
                $scope.global.userInfo.climaticZone = results.data[0].climatic_zone;
                $scope.global.userInfo.heatTransfer = results.data[0].heat_transfer;
                //------ find user country in global DB
                localDB.selectDBGlobal($scope.global.countriesTableDBGlobal, {'id': results.data[0].country_id }, function (results) {
                  if (results.status) {
                    $scope.global.userInfo.countryName = results.data[0].name;
                    $scope.global.userInfo.fullLocation = '' + $scope.global.userInfo.cityName + ', ' + $scope.global.userInfo.regionName + ', ' + $scope.global.userInfo.countryName;

                    //------ set current GeoLocation
                    $scope.global.currentGeoLocation = {
                      cityId: angular.copy($scope.global.userInfo.city_id),
                      cityName: angular.copy($scope.global.userInfo.cityName),
                      regionName: angular.copy($scope.global.userInfo.regionName),
                      countryName: angular.copy($scope.global.userInfo.countryName),
                      climaticZone: angular.copy($scope.global.userInfo.climaticZone),
                      heatTransfer: angular.copy($scope.global.userInfo.heatTransfer),
                      fullLocation: angular.copy($scope.global.userInfo.fullLocation)
                    };
                    $scope.setUserLanguage($scope.global.userInfo.countryName);
                    //console.log('userInfo',$scope.global.userInfo);
                  } else {
                    console.log(results);
                  }
                });

              } else {
                console.log(results);
              }
            });
          } else {
            console.log(results);
          }
        });
      } else {
        console.log(results);
      }
    });
    //$scope.global.firstGetUserData = false;
  }

  //---------- define language relate to user data
  $scope.setUserLanguage = function(country) {
    switch(country) {
      case 'Украина':
        $scope.global.userInfo.langName = $scope.global.languages[0].name;
        $scope.global.userInfo.langLabel = $scope.global.languages[0].label;
        $translate.use($scope.global.languages[0].label);
        break;
      case 'Россия':
        $scope.global.userInfo.langName = $scope.global.languages[1].name;
        $scope.global.userInfo.langLabel = $scope.global.languages[1].label;
        $translate.use($scope.global.languages[1].label);
        break;
    }
    $scope.global.setLanguageVoiceHelper($scope.global.userInfo.langLabel);
  };

  $scope.global.setLanguageVoiceHelper = function(langLabel) {
    $scope.global.voiceHelperLanguage = 'ru_RU';
    /*
    switch (langLabel) {
      //case 'ua': $scope.global.voiceHelperLanguage = 'ukr-UKR';
      case 'ua': $scope.global.voiceHelperLanguage = 'ru_RU';
        break;
      case 'ru': $scope.global.voiceHelperLanguage = 'ru_RU';
        break;
      case 'en': $scope.global.voiceHelperLanguage = 'en_US';
        break;
      case 'en': $scope.global.voiceHelperLanguage = 'de_DE';
        break;
      case 'ro': $scope.global.voiceHelperLanguage = 'ro_RO';
        break;
    }
    */
  };

  //------- Select menu item
  $scope.selectMenuItem = function(id) {
    $scope.navMenu.activeMenuItem = ($scope.navMenu.activeMenuItem === id) ? false : id;
  };

  //------- Select menu item with time out
  $scope.selectMenuItemTimeOut = function(id) {
    $scope.navMenu.activeMenuItem = id;
    $timeout(function() {
      $scope.navMenu.activeMenuItem = false;
    }, 200);
  };

  //-------- links of nav-menu items
  $scope.global.gotoMainPage = function () {
    $scope.global.isHistoryPage = false;
    $location.path('/main');
  };

  $scope.gotoCurrentProduct = function () {
    $scope.navMenu.activeMenuItem = false;
    $scope.global.startProgramm = false;
    $scope.global.isReturnFromDiffPage = true;
    $scope.global.prepareMainPage();
    $location.path('/main');
  };

  $scope.global.gotoLocationPage = function () {
    $location.path('/location');
  };

  $scope.global.gotoSettingsPage = function() {
    $location.path('/settings');
  };

  $scope.gotoHistoryPage = function () {
    $scope.global.showNavMenu = false;
    //---- если идем в историю через корзину, заказ сохраняем в черновик
    /*if($scope.global.isOpenedCartPage) {
      $scope.global.insertOrderInLocalDB({}, $scope.global.draftOrderType, '');
      $scope.global.isCreatedNewProject = false;
      $scope.global.isCreatedNewProduct = false;
    }*/
    $location.path('/history');
  };

  $scope.global.gotoCartPage = function () {
    $scope.global.showNavMenu = false;
    $location.path('/cart');
  };

  $scope.getCurrentGeolocation = function () {
    //------ Data from GPS device
    navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
    function successLocation(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true&language=ru').
        success(function(data, status, headers, config) {
          //----- save previous current location
          $scope.global.prevGeoLocation = angular.copy($scope.global.currentGeoLocation);

          var deviceLocation = data.results[0].formatted_address.split(', ');
          $scope.global.currentGeoLocation = {
            cityId: 156,
            cityName: deviceLocation[deviceLocation.length-3],
            regionName: deviceLocation[deviceLocation.length-2],
            countryName: deviceLocation[deviceLocation.length-1],
            climaticZone: 7,
            heatTransfer: 0.99,
            fullLocation: deviceLocation[deviceLocation.length-3] + ', ' + deviceLocation[deviceLocation.length-2] + ', ' + deviceLocation[deviceLocation.length-1]
          };
          console.log($scope.global.currentGeoLocation.cityName);
        }).
        error(function(data, status, headers, config) {
          alert(status);
        });
    }
    function errorLocation(error) {
      alert(error.message);
    }
  };
/*
  $scope.setCurrentGeoLocation = function () {
    var prevLocation = angular.copy( $scope.global.prevGeoLocation),
        currLocation = angular.copy($scope.global.currentGeoLocation);
    $scope.global.currentGeoLocation = prevLocation;
    $scope.global.prevGeoLocation = currLocation;
  };
*/
  $scope.gotoAddElementsPanel = function() {
    if($scope.global.product.isAddElementsONLY) {
      $scope.global.startProgramm = false;
      $scope.global.isCreatedNewProject = false;
      $scope.global.createNewProduct();
    } else {
      //------- create new empty product
      $scope.global.product = angular.copy($scope.global.productSource);
      $scope.global.product.isAddElementsONLY = true;
      $scope.global.showNavMenu = false;
      $scope.global.isConfigMenu = true;
      $scope.global.showPanels = {};
      $scope.global.showPanels.showAddElementsPanel = true;
      $scope.global.isAddElementsPanel = true;
    }
  };

  $scope.gotoLinkMoreInfo = function() {
    //----- for android
    //navigator.app.loadUrl('http://axorindustry.com', { openExternal:true });
    //----- for ios
    var ref = window.open('http://axorindustry.com', '_system');
    ref.close();
  };

  $scope.switchVoiceHelper = function() {
    $scope.global.isVoiceHelper = !$scope.global.isVoiceHelper;
    if($scope.global.isVoiceHelper) {
      playTTS($filter('translate')('construction.VOICE_SWITCH_ON'), $scope.global.voiceHelperLanguage);
    }
  };





  //----------- Create new Project
  $scope.clickNewProject = function() {

    //------ если старт и на главной странице, не сохраняет в черновики
    if($scope.global.startProgramm && !$scope.global.isOpenedHistoryPage && !$scope.global.isOpenedCartPage) {
      console.log('start Btn');
      $scope.global.startProgramm = false;
      $scope.global.prepareMainPage();

    //------- если после старта пошли в историю
    } else if($scope.global.startProgramm && $scope.global.isOpenedHistoryPage && !$scope.global.isOpenedCartPage) {
      console.log('start Btn from history');
      $scope.global.startProgramm = false;
      $scope.global.prepareMainPage();
      //------- create new empty product
      $scope.global.product = angular.copy($scope.global.productDefault);
      //------- create new empty order
      $scope.global.order = angular.copy($scope.global.orderSource);
      $location.path('/main');

    //------- создание нового проекта с сохранением в черновик предыдущего незаконченного
    } else if(!$scope.global.startProgramm && !$scope.global.isOrderFinished) {
      //------- если находимся на главной странице или в истории
      console.log('draft from history');
      if(!$scope.global.isOpenedCartPage) {
        //------ сохраняем черновик продукта в LocalDB
        console.log('draft from main page');
        $scope.global.inputProductInOrder();
        $scope.global.order.orderPriceTOTAL = $scope.global.product.productPriceTOTAL;
      }
      //------ сохраняем черновик заказа в LocalDB
      $scope.global.insertOrderInLocalDB({}, $scope.global.draftOrderType, '');
      //------ create new order
      $scope.global.isReturnFromDiffPage = false;
      $scope.global.isChangedTemplate = false;
      $scope.global.isCreatedNewProject = true;
      $scope.global.isCreatedNewProduct = true;
      $scope.global.prepareMainPage();
      if($scope.global.isOpenedCartPage || $scope.global.isOpenedHistoryPage) {
        //------- create new empty product
        $scope.global.product = angular.copy($scope.global.productDefault);
        //------- create new empty order
        $scope.global.order = angular.copy($scope.global.orderSource);
        $location.path('/main');
      } else {
        $scope.global.createNewProject();
      }

    //------- создание нового проекта после сохранения заказа в истории
    } else if(!$scope.global.startProgramm && $scope.global.isOrderFinished) {
      console.log('order finish and new order!!!!');
      //------ create new order
      $scope.global.isReturnFromDiffPage = false;
      $scope.global.isChangedTemplate = false;
      $scope.global.isCreatedNewProject = true;
      $scope.global.isCreatedNewProduct = true;
      $scope.global.isOrderFinished = false;
      $scope.global.prepareMainPage();
      //------- create new empty product
      $scope.global.product = angular.copy($scope.global.productDefault);
      //------- create new empty order
      $scope.global.order = angular.copy($scope.global.orderSource);
      $location.path('/main');
    }

  };

  $scope.global.prepareMainPage = function() {
    $scope.global.showNavMenu = false;
    $scope.global.isConfigMenu = true;
    $scope.global.showPanels = {};
    $scope.global.showPanels.showTemplatePanel = true;
    $scope.global.isTemplatePanel = true;
  };







  //-------- save Order into Local DB
  $scope.global.insertOrderInLocalDB = function(newOptions, orderType, orderStyle) {
    var orderData = {};

    $scope.global.order.orderType = orderType;
    $scope.global.order.orderStyle = orderStyle;
    $scope.global.order.productsQty = $scope.global.order.products.length;
    $scope.global.order.productsPriceTOTAL = parseFloat($scope.global.order.productsPriceTOTAL.toFixed(2));
    $scope.global.order.paymentFirst = parseFloat($scope.global.order.paymentFirst.toFixed(2));
    $scope.global.order.paymentMonthly = parseFloat($scope.global.order.paymentMonthly.toFixed(2));
    $scope.global.order.paymentFirstPrimary = parseFloat($scope.global.order.paymentFirstPrimary.toFixed(2));
    $scope.global.order.paymentMonthlyPrimary = parseFloat($scope.global.order.paymentMonthlyPrimary.toFixed(2));
    $scope.global.order.orderPriceTOTAL = parseFloat($scope.global.order.orderPriceTOTAL.toFixed(2));
    $scope.global.order.orderPriceTOTALPrimary = parseFloat($scope.global.order.orderPriceTOTALPrimary.toFixed(2));
    angular.extend($scope.global.order, newOptions);
    //------- save order in orders LocalStorage
    $scope.global.orders.push($scope.global.order);
    //console.log(JSON.stringify($scope.global.order));
    //------- save order in LocalDB
    orderData = angular.copy($scope.global.order);
    delete orderData.products;

    //console.log('$scope.global.order.orderStyle === ', $scope.global.order);
    localDB.insertDB($scope.global.ordersTableBD, orderData);
/*
    //------- merge objects for save in local db
    if(newOptions.length > 0) {
      for(var opt in newOptions) {
        if (!newOptions.hasOwnProperty(opt)) {
          continue;
        } else {
          for(var d in $scope.orderData) {
            if (!newOptions.hasOwnProperty(d)) {
              continue;
            } else {
              if(d === opt) {
                $scope.orderData[d] = newOptions[opt];
              }
            }
          }
        }
      }
    }
*/

  };

  //-------- delete order from LocalDB
  $scope.global.deleteOrderFromLocalDB = function(orderNum) {
    localDB.deleteDB($scope.global.ordersTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.productsTableBD, {'orderId': orderNum});
    localDB.deleteDB($scope.global.addElementsTableBD, {'orderId': orderNum});
  };

  console.log('$scope.global.isOpenedHistoryPage!!!!!!!!!!!', $scope.global.isOpenedHistoryPage);

}]);


// controllers/panels/additional-elements-list.js

/* globals BauVoiceApp, STEP, selectClass, activeClass */

'use strict';

BauVoiceApp.controller('AdditionalElementsListCtrl', ['$scope', 'constructService', 'localStorage', '$filter', function ($scope, constructService, localStorage, $filter) {

  $scope.global = localStorage;

  $scope.addElementsList = {
    DELAY_START: STEP,
    DELAY_SHOW_ELEMENTS_MENU: STEP * 6,

    showAddElementGroups: false,
    filteredGroups: [],
    typing: 'on'
  };

  // Search Add Elements Group
  var regex, checkedGroup, indexGroup, currGroup, groupTempObj;

  $scope.addElementsList.addElementsGroup = [
    $filter('translate')('add_elements.GRIDS'),
    $filter('translate')('add_elements.VISORS'),
    $filter('translate')('add_elements.SPILLWAYS'),
    $filter('translate')('add_elements.OUTSIDE'),
    $filter('translate')('add_elements.INSIDE'),
    $filter('translate')('add_elements.LOUVERS'),
    $filter('translate')('add_elements.CONNECTORS'),
    $filter('translate')('add_elements.FAN'),
    $filter('translate')('add_elements.WINDOWSILLS'),
    $filter('translate')('add_elements.HANDLELS'),
    $filter('translate')('add_elements.OTHERS')
  ];

  // Create regExpresion
  function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  $scope.checkChanges = function() {

    $scope.addElementsList.filteredGroups.length = 0;
    if($scope.searchingWord && $scope.searchingWord.length > 0) {
      regex = new RegExp('^' + escapeRegExp($scope.searchingWord), 'i');
      for(indexGroup = 0; indexGroup < $scope.addElementsList.addElementsGroup.length; indexGroup++){
        currGroup = $scope.addElementsList.addElementsGroup[indexGroup];
        checkedGroup = regex.test(currGroup);
        if(checkedGroup) {
          groupTempObj = {};
          groupTempObj.groupId = indexGroup+1;
          groupTempObj.groupName = currGroup;
          groupTempObj.groupClass = $scope.global.addElementsGroupClass[indexGroup];
          $scope.addElementsList.filteredGroups.push(groupTempObj);
        }
      }
    }
    if( $scope.addElementsList.filteredGroups.length > 0) {
      $scope.addElementsList.showAddElementGroups = true;
    } else {
      $scope.addElementsList.showAddElementGroups = false;
    }
  };

  // Delete searching word
  $scope.cancelSearching = function() {
    $scope.searchingWord = '';
    $scope.addElementsList.showAddElementGroups = false;
  };
  // Delete last chart searching word
  $scope.deleteSearchChart = function() {
    $scope.searchingWord = $scope.searchingWord.slice(0,-1);
  };

   //Delete All Add Elements
  $scope.clearAllAddElements = function() {
    for(var group in $scope.global.product.chosenAddElements) {
      $scope.global.product.chosenAddElements[group].length = 0;
    }
    $scope.global.totalAddElementsPrice = false;
  };

  // Close Add Elements in List View
  $scope.viewSwitching = function() {
    $scope.global.isAddElementListView = false;
    $scope.global.showAddElementsMenu = false;
    $scope.global.isAddElement = false;
  };

}]);



// controllers/panels/additional-elements.js

/* globals BauVoiceApp, STEP, activeClass */

'use strict';

BauVoiceApp.controller('AdditionalElementsCtrl', ['$scope', 'localDB', 'constructService', 'localStorage', '$timeout', function ($scope, localDB, constructService, localStorage, $timeout) {

  $scope.global = localStorage;

  $scope.addElementsPanel = {
    DELAY_START: STEP,
    DELAY_SHOW_GRID: STEP * 5,
    DELAY_SHOW_VISOR: STEP * 6,
    DELAY_SHOW_SPILLWAY: STEP * 6,
    DELAY_SHOW_OUTSIDE: STEP * 10,
    DELAY_SHOW_WINDOWSILL: STEP * 13,
    DELAY_SHOW_LOUVER: STEP * 15,
    DELAY_SHOW_INSIDESLOPE: STEP * 20,
    DELAY_SHOW_INSIDESLOPETOP: STEP * 20,
    DELAY_SHOW_INSIDESLOPERIGHT: STEP * 22,
    DELAY_SHOW_INSIDESLOPELEFT: STEP * 21,
    DELAY_SHOW_CONNECTORS: STEP * 30,
    DELAY_SHOW_FORCECONNECT: STEP * 30,
    DELAY_SHOW_BALCONCONNECT: STEP * 35,
    DELAY_SHOW_HANDLE: STEP * 28,
    DELAY_SHOW_FAN: STEP * 31,
    DELAY_SHOW_OTHERS: STEP * 31,
    DELAY_SHOW_BUTTON: STEP * 40,

    DELAY_SHOW_ELEMENTS_MENU: STEP * 12,
    typing: 'on'
  };

  //Select additional element
  $scope.global.selectAddElement = function(id) {
    if($scope.global.isFocusedAddElement !== id && $scope.global.showAddElementsMenu) {
      $scope.global.isFocusedAddElement = id;
      $scope.global.isTabFrame = false;
      //playSound('swip');
      $scope.global.showAddElementsMenu = false;
      $scope.global.desactiveAddElementParameters();
      $timeout(function() {
        $scope.global.isAddElement = false;
        $scope.global.addElementsMenuStyle = false;
        //playSound('swip');
        $scope.global.showAddElementsMenu = activeClass;
        $scope.global.downloadAddElementsData(id);
      }, $scope.addElementsPanel.DELAY_SHOW_ELEMENTS_MENU);
    } else {
      $scope.global.isFocusedAddElement = id;
      //playSound('swip');
      $scope.global.showAddElementsMenu = activeClass;
      $scope.global.downloadAddElementsData(id);
    }
  };

  $scope.global.downloadAddElementsData = function(id) {
    switch(id) {
      case 1:
        $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[0];
/*
        localDB.selectDBGlobal($scope.global.listsTableDBGlobal, {'list_group_id': $scope.global.gridDBId}, function (results) {
          if (results.status) {
            $scope.global.addElementsList = [angular.copy(results.data)];
          } else {
            console.log(results);
          }
        });
*/
        constructService.getAllGrids(function (results) {
          if (results.status) {
            $scope.global.addElementsType = results.data.elementType;
            $scope.global.addElementsList = results.data.elementsList;
          } else {
            console.log(results);
          }
        });
        break;
      case 2:
        $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[1];
/*
        localDB.selectDBGlobal($scope.global.listsTableDBGlobal, {'list_group_id': $scope.global.visorDBId}, function (results) {
          if (results.status) {
            $scope.global.addElementsList = [angular.copy(results.data)];
          } else {
            console.log(results);
          }
        });
*/
        constructService.getAllVisors(function (results) {
          if (results.status) {
            $scope.global.addElementsType = results.data.elementType;
            $scope.global.addElementsList = results.data.elementsList;
          } else {
            console.log(results);
          }
        });
        break;
      case 3:
        $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[2];
/*
        localDB.selectDBGlobal($scope.global.listsTableDBGlobal, {'list_group_id': $scope.global.spillwayDBId}, function (results) {
          if (results.status) {
            $scope.global.addElementsList = [angular.copy(results.data)];
          } else {
            console.log(results);
          }
        });
*/
        constructService.getAllSpillways(function (results) {
          if (results.status) {
            $scope.global.addElementsType = results.data.elementType;
            $scope.global.addElementsList = results.data.elementsList;
          } else {
            console.log(results);
          }
        });
        break;
      case 4:
        $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[3];
        constructService.getAllOutsideSlope(function (results) {
          if (results.status) {
            $scope.global.addElementsType = results.data.elementType;
            $scope.global.addElementsList = results.data.elementsList;
          } else {
            console.log(results);
          }
        });
        break;
      case 5:
        $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[4];
        constructService.getAllLouvers(function (results) {
          if (results.status) {
            $scope.global.addElementsType = results.data.elementType;
            $scope.global.addElementsList = results.data.elementsList;
          } else {
            console.log(results);
          }
        });
        break;
      case 6:
        $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[5];
        constructService.getAllInsideSlope(function (results) {
          if (results.status) {
            $scope.global.addElementsType = results.data.elementType;
            $scope.global.addElementsList = results.data.elementsList;
          } else {
            console.log(results);
          }
        });
        break;
      case 7:
        $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[6];
        constructService.getAllConnectors(function (results) {
          if (results.status) {
            $scope.global.addElementsType = results.data.elementType;
            $scope.global.addElementsList = results.data.elementsList;
          } else {
            console.log(results);
          }
        });
        break;
      case 8:
        $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[7];
        constructService.getAllFans(function (results) {
          if (results.status) {
            $scope.global.addElementsType = results.data.elementType;
            $scope.global.addElementsList = results.data.elementsList;
          } else {
            console.log(results);
          }
        });
        break;
      case 9:
        $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[8];
/*
        localDB.selectDBGlobal($scope.global.listsTableDBGlobal, {'list_group_id': $scope.global.windowsillDBId}, function (results) {
          if (results.status) {
            $scope.global.addElementsList = [angular.copy(results.data)];
          } else {
            console.log(results);
          }
        });
*/
        constructService.getAllWindowSills(function (results) {
          if (results.status) {
            $scope.global.addElementsType = results.data.elementType;
            $scope.global.addElementsList = results.data.elementsList;
          } else {
            console.log(results);
          }
        });
        break;
      case 10:
        $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[9];
        constructService.getAllHandles(function (results) {
          if (results.status) {
            $scope.global.addElementsType = results.data.elementType;
            $scope.global.addElementsList = results.data.elementsList;
          } else {
            console.log(results);
          }
        });
        break;
      case 11:
        $scope.global.addElementsMenuStyle = $scope.global.addElementsGroupClass[10];
        constructService.getAllOthers(function (results) {
          if (results.status) {
            $scope.global.addElementsType = results.data.elementType;
            $scope.global.addElementsList = results.data.elementsList;
          } else {
            console.log(results);
          }
        });
        break;
    }
  };

  // Select Add Element Parameter
  //$scope.changeAddElementParameter = function(focusedElementId, parameterId) {
  $scope.global.initAddElementMenuTools = function(toolsId, addElementId) {
    if($scope.global.auxParameter === $scope.global.isFocusedAddElement+'-'+toolsId+'-'+addElementId) {
      $scope.global.desactiveAddElementParameters();
      $scope.global.currentAddElementId = false;
      //console.log('close-'+$scope.global.auxParameter);
    } else {
      $scope.global.desactiveAddElementParameters();
      $scope.global.auxParameter = $scope.global.isFocusedAddElement+'-'+toolsId+'-'+addElementId;
      //console.log($scope.global.auxParameter);
      $scope.global.currentAddElementId = addElementId;
      switch(toolsId) {
        case 1:
          $scope.global.isQtyCalculator = true;
          break;
        case 2:
          $scope.global.isSizeCalculator = true;
          $scope.global.isWidthCalculator = true;
          break;
        case 3:
          $scope.global.isSizeCalculator = true;
          $scope.global.isWidthCalculator = false;
          break;
        case 4:
          $scope.global.isColorSelector = false;
          constructService.getLaminationAddElements(function (results) {
            if (results.status) {
              $scope.global.addElementLaminatWhiteMatt = results.data.laminationWhiteMatt;
              $scope.global.addElementLaminatWhiteGlossy = results.data.laminationWhiteGlossy;
              $scope.global.addElementLaminatColor = results.data.laminations;
            } else {
              console.log(results);
            }
          });
          $scope.global.isColorSelector = true;
          $scope.global.isAddElementColor = $scope.global.product.chosenAddElements.selectedWindowSill[addElementId].elementColorId;
          break;
      }
    }
  };

  $scope.global.desactiveAddElementParameters = function () {
    $scope.global.auxParameter = false;
    $scope.global.isQtyCalculator = false;
    $scope.global.isSizeCalculator = false;
    $scope.global.isColorSelector = false;
  };

  // Open Add Elements in List View
  $scope.viewSwitching = function() {
    //playSound('swip');
    $scope.global.isAddElementListView = true;
    $scope.global.isFocusedAddElement = false;
    $scope.global.isTabFrame = false;
    $scope.global.showAddElementsMenu = false;
    $scope.global.isAddElement = false;
    $scope.global.desactiveAddElementParameters();
    $timeout(function() {
      $scope.global.addElementsMenuStyle = false;
    }, $scope.addElementsPanel.DELAY_SHOW_ELEMENTS_MENU);
  };

  // Show Window Scheme Dialog
  $scope.showWindowScheme = function() {
    //playSound('fly');
    $scope.global.isWindowSchemeDialog = true;
  };

  $scope.closeWindowScheme = function() {
    //playSound('fly');
    $scope.global.isWindowSchemeDialog = false;
  };

}]);



// controllers/panels/glass.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('GlassCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.glassPanel = {
    DELAY_START: 5 * STEP,
    DELAY_BLOCK: 2 * STEP,
    DELAY_TYPING: 2.5 * STEP,
    typing: 'on'
  };


  // Select glass
  $scope.selectGlass = function(typeIndex, glassIndex, glassId) {
    $scope.global.product.glassTypeIndex = typeIndex;
    $scope.global.product.glassIndex = glassIndex;
    var selectedGlass = $scope.global.glasses[typeIndex][glassIndex];
    $scope.global.product.glassId = glassId;
    $scope.global.product.glassName = selectedGlass.glassName;
    $scope.global.product.glassHeatCoeff = selectedGlass.heatCoeff;
    $scope.global.product.glassAirCoeff = selectedGlass.airCoeff;
    $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
  };

}]);



// controllers/panels/hardware-window.js

/* globals BauVoiceApp, STEP, selectClass, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('HardwareWindowCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.hardwarePanel = {
    DELAY_START: 5 * STEP,
    DELAY_BLOCK: 2 * STEP,
    DELAY_TYPING: 2.5 * STEP,
    typing: 'on'
  };

  // Select hardware
  $scope.selectHardware = function(hardwareTypeIndex, hardwareIndex) {
    $scope.global.product.hardwareTypeIndex = hardwareTypeIndex;
    $scope.global.product.hardwareIndex = hardwareIndex;
    var selectedHardware = $scope.global.hardwares[hardwareTypeIndex][hardwareIndex];
    $scope.global.product.hardwareId = selectedHardware.hardwareId;
    $scope.global.product.hardwareName = selectedHardware.hardwareName;
    $scope.global.product.hardwareHeatCoeff = selectedHardware.heatCoeff;
    $scope.global.product.hardwareAirCoeff = selectedHardware.airCoeff;
    $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
  };

}]);



// controllers/panels/lamination.js

/* globals BauVoiceApp, STEP, selectClass, showElementWithDelay, typingTextWithDelay */

'use strict';

BauVoiceApp.controller('LaminationCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.laminationInPrice = 0;
  $scope.laminationOutPrice = 0;

  $scope.laminationPanel = {
    DELAY_START: 5 * STEP,
    DELAY_BLOCK: 2 * STEP,
    DELAY_TYPING: 2.5 * STEP,
    typing: 'on'
  };

  // Select lamination
  $scope.selectLaminatIn = function(laminatIndex) {
    if(laminatIndex !== 'white') {
      $scope.global.product.laminationInIndex = laminatIndex;
      $scope.global.product.laminationInName = $scope.global.laminationsIn[laminatIndex].laminationName;
      $scope.global.product.laminationInPrice = $scope.global.laminationsIn[laminatIndex].laminationPrice;
      $scope.setLaminationTotalPrice();
    } else {
      $scope.global.product.laminationInIndex = 'white';
      $scope.global.product.laminationInName =  $scope.global.laminationsWhite;
      $scope.global.product.laminationInPrice = 0;
      $scope.setLaminationTotalPrice();
    }
  };

  $scope.selectLaminatOut = function(laminatIndex) {
    if(laminatIndex !== 'white') {
      $scope.global.product.laminationOutIndex = laminatIndex;
      $scope.global.product.laminationOutName = $scope.global.laminationsOut[laminatIndex].laminationName;
      $scope.global.product.laminationOutPrice = $scope.global.laminationsOut[laminatIndex].laminationPrice;
      $scope.setLaminationTotalPrice();
    } else {
      $scope.global.product.laminationOutIndex = 'white';
      $scope.global.product.laminationOutName =  $scope.global.laminationsWhite;
      $scope.global.product.laminationOutPrice = 0;
      $scope.setLaminationTotalPrice();
    }
  };

  $scope.setLaminationTotalPrice = function() {
    $scope.global.product.laminationPriceSELECT = $scope.global.product.laminationInPrice + $scope.global.product.laminationOutPrice;
    $scope.global.setProductPriceTOTALapply();
  };

}]);



// controllers/panels/profile.js

/* globals BauVoiceApp, STEP, playSound */

'use strict';

BauVoiceApp.controller('ProfileCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.profilePanel = {
    DELAY_START: 5 * STEP,
    DELAY_BLOCK: 2 * STEP,
    DELAY_TYPING: 2.5 * STEP,
    typing: 'on'
  };

//TODO убрать, и взять данные из global.profiles
  constructService.getAllProfiles(function (results) {
    if (results.status) {
      $scope.profilePanel.producers = results.data.producers;
      $scope.profilePanel.profiles = results.data.profiles;
    } else {
      console.log(results);
    }
  });

  // Select profile
  $scope.selectProfile = function(producerIndex, profileIndex, profileId) {
    $scope.global.product.profileTypeIndex = producerIndex;
    $scope.global.product.profileIndex = profileIndex;
    var selectedProfile = $scope.profilePanel.profiles[producerIndex][profileIndex];
    $scope.global.product.profileId = profileId;
    $scope.global.product.profileName = selectedProfile.profileDescrip;
    $scope.global.product.profileHeatCoeff = selectedProfile.heatCoeff;
    $scope.global.product.profileAirCoeff = selectedProfile.airCoeff;
    //---- find profile index
    for(var pr = 0; pr < $scope.global.profiles.length; pr++) {
      if($scope.global.profiles[pr].id === profileId) {
        $scope.global.product.profileIndex = pr;
      }
    }

    //-------- clearing for new templates
    $scope.global.templatesWindList.length = 0;
    $scope.global.templatesWindIconList.length = 0;
    $scope.global.templatesWindDoorList.length = 0;
    $scope.global.templatesWindDoorIconList.length = 0;
    $scope.global.templatesBalconyList.length = 0;
    $scope.global.templatesBalconyIconList.length = 0;
    $scope.global.templatesDoorList.length = 0;
    $scope.global.templatesDoorIconList.length = 0;

    $scope.global.parseTemplate($scope.global.product.profileIndex, profileId);
  };

}]);



// controllers/panels/template-selector.js

/* globals BauVoiceApp, STEP, */

'use strict';

BauVoiceApp.controller('TemplateSelectorCtrl', ['$scope', '$location', 'localStorage', 'constructService', '$filter', '$cordovaDialogs', function ($scope, $location, localStorage, constructService, $filter, $cordovaDialogs) {

  $scope.global = localStorage;

  $scope.templatePanel = {
    DELAY_TEMPLATE_ELEMENT: 18 * STEP,
    switcherTemplate: false,
    typing: 'on'
  };

  //---------- download templates Img icons
  constructService.getTemplateImgIcons(function (results) {
    if (results.status) {
      $scope.global.templatesImgs = results.data.templateImgs;
    } else {
      console.log(results);
    }
  });


  //---------- select new template and recalculate it price
  $scope.selectNewTemplate = function(templateIndex) {
    $scope.templatePanel.switcherTemplate = false;
    function goToNewTemplate(button) {
      if(button == 1) {
        //------ change last changed template to old one
        $scope.backDefaultTemplate();
        $scope.global.isChangedTemplate = false;
        $scope.newPriceForNewTemplate(templateIndex);
      }
    }

    if($scope.global.isChangedTemplate) {
    //----- если выбран новый шаблон после изменения предыдущего
      $cordovaDialogs.confirm(
        $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
        $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
        [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')])
        .then(function(buttonIndex) {
          goToNewTemplate(buttonIndex);
        });
/*
      navigator.notification.confirm(
        $filter('translate')('common_words.TEMPLATE_CHANGES_LOST'),
        goToNewTemplate,
        $filter('translate')('common_words.NEW_TEMPLATE_TITLE'),
        [$filter('translate')('common_words.BUTTON_Y'), $filter('translate')('common_words.BUTTON_N')]
      );


      if(confirm($filter('translate')('common_words.TEMPLATE_CHANGES_LOST'))) {
        //------ change last changed template to old one
        $scope.backDefaultTemplate();
        $scope.global.isChangedTemplate = false;
        $scope.newPriceForNewTemplate(templateIndex);
      }
*/
    } else {
      $scope.newPriceForNewTemplate(templateIndex);
    }
  };





  $scope.newPriceForNewTemplate = function(templateIndex) {
    event.preventDefault();
    if(!$scope.global.isFindPriceProcess) {
      $scope.global.isFindPriceProcess = true;
      $scope.global.product.templateIndex = templateIndex;
      $scope.global.saveNewTemplateInProduct(templateIndex);
      //------ define product price
      $scope.global.createObjXFormedPrice($scope.global.templates[templateIndex], $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
    }
  };


  //------ click on top button to change template type
  $scope.toggleTemplate = function() {
    if(!$scope.global.isFindPriceProcess) {
      $scope.templatePanel.switcherTemplate = !$scope.templatePanel.switcherTemplate;
    }
  };

  $scope.toggleTemplateType = function(type) {
    switch(type) {
      case 'window':
        $scope.global.isConstructWind = true;
        $scope.global.isConstructWindDoor = false;
        $scope.global.isConstructDoor = false;
        $scope.global.isConstructBalcony = false;
        break;
      case 'balcon':
        $scope.global.isConstructWind = false;
        $scope.global.isConstructWindDoor = false;
        $scope.global.isConstructDoor = false;
        $scope.global.isConstructBalcony = true;
        break;
      case 'door':
        $scope.global.isConstructWind = false;
        $scope.global.isConstructWindDoor = false;
        $scope.global.isConstructDoor = true;
        $scope.global.isConstructBalcony = false;
        break;
      case 'balconEnter':
        $scope.global.isConstructWind = false;
        $scope.global.isConstructWindDoor = true;
        $scope.global.isConstructDoor = false;
        $scope.global.isConstructBalcony = false;
        break;
    }
    $scope.templatePanel.switcherTemplate = false;
    $scope.global.product.templateIndex = 0;
  };

  //------- Select Window/Balcony Entry Template
  $scope.turnOnTemplate = function(marker) {
    $scope.templatePanel.switcherTemplate = false;
    if($scope.global.isChangedTemplate) {
      //----- если выбран новый шаблон после изменения предыдущего
      if(confirm($filter('translate')('common_words.TEMPLATE_CHANGES_LOST'))) {
        if($scope.global.isConstructDoor) {
          $scope.global.setDefaultDoorConfig();
        }
        //------ change last changed template to old one
        $scope.backDefaultTemplate();
        $scope.global.isChangedTemplate = false;
        $scope.toggleTemplateType(marker);
        $scope.global.getCurrentTemplates();
        $scope.global.saveNewTemplateInProduct($scope.global.product.templateIndex);
        //------ define product price
        $scope.global.createObjXFormedPrice($scope.global.templates[$scope.global.product.templateIndex], $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
      }
    } else {
      $scope.toggleTemplateType(marker);
      $scope.global.getCurrentTemplates();
      $scope.global.saveNewTemplateInProduct($scope.global.product.templateIndex);
      //------ define product price
      $scope.global.createObjXFormedPrice($scope.global.templates[$scope.global.product.templateIndex], $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
    }
    //console.log('$scope.templatePanel.switcherTemplate == ', $scope.templatePanel.switcherTemplate);
  };


  $scope.gotoConstructionPage = function () {
    if(!$scope.global.isFindPriceProcess) {
      $location.path('/construction');
    }
  };

  //------- return to the initial template
  $scope.backDefaultTemplate = function() {
    if($scope.global.isConstructDoor) {
      $scope.global.templatesDoorSource[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesDoorSTORE[$scope.global.product.templateIndex]);
      $scope.global.templatesDoorList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesDoorListSTORE[$scope.global.product.templateIndex]);
      $scope.global.templatesDoorIconList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesDoorIconListSTORE[$scope.global.product.templateIndex]);
    } else if($scope.global.isConstructBalcony) {
      $scope.global.templatesBalconySource[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesBalconySTORE[$scope.global.product.templateIndex]);
      $scope.global.templatesBalconyList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesBalconyListSTORE[$scope.global.product.templateIndex]);
      $scope.global.templatesBalconyIconList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesBalconyIconListSTORE[$scope.global.product.templateIndex]);
    } else if($scope.global.isConstructWindDoor) {
      $scope.global.templatesWindDoorSource[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesWindDoorSTORE[$scope.global.product.templateIndex]);
      $scope.global.templatesWindDoorList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesWindDoorListSTORE[$scope.global.product.templateIndex]);
      $scope.global.templatesWindDoorIconList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesWindDoorIconListSTORE[$scope.global.product.templateIndex]);
    } else if($scope.global.isConstructWind){
      $scope.global.templatesWindSource[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesWindSTORE[$scope.global.product.templateIndex]);
      $scope.global.templatesWindList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesWindListSTORE[$scope.global.product.templateIndex]);
      $scope.global.templatesWindIconList[$scope.global.product.templateIndex] = angular.copy($scope.global.templatesWindIconListSTORE[$scope.global.product.templateIndex]);
    }
  };

  //-------- change price if template was changed
  if($scope.global.isChangedTemplate) {
    $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
  }

}]);


// controllers/parts/call-credit.js

'use strict';

BauVoiceApp.controller('CallCreditCtrl', ['$scope', 'constructService', 'localStorage', '$location', function ($scope, constructService, localStorage, $location) {

  $scope.global = localStorage;
  $scope.orderStyle = 'credit';
  $scope.user = $scope.global.createUserXOrder();
  //$scope.user.instalment = 54513123;

  // Search Location
  $scope.showTipCity = false;
  $scope.currentCity = false;
  $scope.filteredCity = [];
  var regex, checkCity, indexCity, cityObj;

  constructService.getLocations(function (results) {
    if (results.status) {
      $scope.cities = results.data.locations;
    } else {
      console.log(results);
    }
  });

  // Create regExpresion
  function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  $scope.checkChanges = function() {
    $scope.filteredCity.length = 0;
    $scope.currentCity = false;
    if($scope.user.location && $scope.user.location.length > 0) {
      regex = new RegExp('^' + escapeRegExp($scope.user.location), 'i');
      for(indexCity = 0; indexCity < $scope.cities.length; indexCity++){
        checkCity = regex.test($scope.cities[indexCity].city);
        if(checkCity) {
          cityObj = {};
          cityObj.city = $scope.cities[indexCity].city;
          cityObj.current = $scope.cities[indexCity].current;
          $scope.filteredCity.push(cityObj);
        }
      }
    }
    if($scope.filteredCity.length > 0) {
      $scope.showTipCity = true;
    } else {
      $scope.showTipCity = false;
    }
  };

  // Select City
  $scope.selectCity = function(city, curr) {
    $scope.user.location = city;
    $scope.showTipCity = false;
    if(curr) {
      $scope.currentCity = true;
    }
  };


  // Close Credit Dialog
  $scope.hideCallCreditDialog = function() {
    $scope.submitted = false;
    $scope.user = $scope.global.createUserXOrder();
    $scope.showTipCity = false;
    $scope.currentCity = false;
    $scope.global.showCreditDialog = false;
  };

  // Send Form Data
  $scope.submitForm = function (form) {
    // Trigger validation flag.
    $scope.submitted = true;

    if (form.$valid) {
      if($scope.global.orderEditNumber) {
        //----- delete old order in localDB
        $scope.global.deleteOrderFromLocalDB($scope.global.orderEditNumber);
        for(var prod = 0; prod < $scope.global.order.products.length; prod++) {
          $scope.global.insertProductInLocalDB($scope.global.orderEditNumber, $scope.global.order.products[prod].productId, $scope.global.order.products[prod]);
        }
      }
      $scope.global.insertOrderInLocalDB($scope.user, $scope.global.fullOrderType, $scope.orderStyle);
      //--------- Close cart dialog, go to history
      $scope.hideCallCreditDialog();
      $scope.global.orderEditNumber = false;
      $scope.global.isCreatedNewProject = false;
      $scope.global.isCreatedNewProduct = false;
      $scope.global.isOrderFinished = true;
      $location.path('/history');
    }
  };

}]);


// controllers/parts/call-master.js

'use strict';

BauVoiceApp.controller('CallMasterCtrl', ['$scope', 'constructService', 'localStorage', '$location', function ($scope, constructService, localStorage, $location) {

  $scope.global = localStorage;
  $scope.orderStyle = 'master';
  $scope.user = {};

  // Search Location
  $scope.showTipCity = false;
  $scope.currentCity = false;
  $scope.filteredCity = [];
  var regex, checkCity, indexCity, cityObj;

  constructService.getLocations(function (results) {
    if (results.status) {
      $scope.cities = results.data.locations;
    } else {
      console.log(results);
    }
  });

  // Create regExpresion
  function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  $scope.checkChanges = function() {
    $scope.filteredCity.length = 0;
    $scope.currentCity = false;
    if($scope.user.location && $scope.user.location.length > 0) {
      regex = new RegExp('^' + escapeRegExp($scope.user.location), 'i');
      for(indexCity = 0; indexCity < $scope.cities.length; indexCity++){
        checkCity = regex.test($scope.cities[indexCity].city);
        if(checkCity) {
          cityObj = {};
          cityObj.city = $scope.cities[indexCity].city;
          cityObj.current = $scope.cities[indexCity].current;
          $scope.filteredCity.push(cityObj);
        }
      }
    }
    if($scope.filteredCity.length > 0) {
      $scope.showTipCity = true;
    } else {
      $scope.showTipCity = false;
    }
  };

  // Select City
  $scope.selectCity = function(city, curr) {
    $scope.user.location = city;
    $scope.showTipCity = false;
    if(curr) {
      $scope.currentCity = true;
    }
  };

/*
   $scope.$watch('user.location', function (newValue, oldValue) {
   if(newValue && newValue.length > 0 && !$scope.isSelectedCity) {
   regex = new RegExp('^' + escapeRegExp(newValue), 'i');
   $scope.locationDirty = true;
   } else {
   $scope.locationDirty = false;
   }
   });

   $scope.filterBySearch = function(name) {
   if (!$scope.user.location) {
   return true;
   }
   var check = regex.test(name);
   return check;
   };
*/

  // Close Call Master Dialog
  $scope.hideCallMasterDialog = function() {
    $scope.submitted = false;
    $scope.user = {};
    $scope.showTipCity = false;
    $scope.currentCity = false;
    $scope.global.showMasterDialog = false;
  };

  // Send Form Data
  $scope.submitForm = function (form) {
    // Trigger validation flag.
    $scope.submitted = true;

    if (form.$valid) {
      if($scope.global.orderEditNumber) {
        //----- delete old order in localDB
        $scope.global.deleteOrderFromLocalDB($scope.global.orderEditNumber);
        for(var prod = 0; prod < $scope.global.order.products.length; prod++) {
          $scope.global.insertProductInLocalDB($scope.global.orderEditNumber, $scope.global.order.products[prod].productId, $scope.global.order.products[prod]);
        }
      }
      $scope.global.insertOrderInLocalDB($scope.user, $scope.global.fullOrderType, $scope.orderStyle);
      //--------- Close cart dialog, go to history
      $scope.hideCallMasterDialog();
      $scope.global.isCreatedNewProject = false;
      $scope.global.isCreatedNewProduct = false;
      $scope.global.isOrderFinished = true;
      $location.path('/history');
    }
  };

}]);


// controllers/parts/call-order.js

'use strict';

BauVoiceApp.controller('CallOrderCtrl', ['$scope', 'constructService', 'localStorage', '$location', function ($scope, constructService, localStorage, $location) {

  $scope.global = localStorage;
  $scope.orderStyle = 'order';
  $scope.user = $scope.global.createUserXOrder();

  // Search Location
  $scope.showTipCity = false;
  $scope.currentCity = false;
  $scope.filteredCity = [];
  var regex, checkCity, indexCity, cityObj;

  constructService.getLocations(function (results) {
    if (results.status) {
      $scope.cities = results.data.locations;
    } else {
      console.log(results);
    }
  });

  // Create regExpresion
  function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  $scope.checkChanges = function() {
    $scope.filteredCity.length = 0;
    $scope.currentCity = false;
    if($scope.user.location && $scope.user.location.length > 0) {
      regex = new RegExp('^' + escapeRegExp($scope.user.location), 'i');
      for(indexCity = 0; indexCity < $scope.cities.length; indexCity++){
        checkCity = regex.test($scope.cities[indexCity].city);
        if(checkCity) {
          cityObj = {};
          cityObj.city = $scope.cities[indexCity].city;
          cityObj.current = $scope.cities[indexCity].current;
          $scope.filteredCity.push(cityObj);
        }
      }
    }
    if($scope.filteredCity.length > 0) {
      $scope.showTipCity = true;
    } else {
      $scope.showTipCity = false;
    }
  };

  // Select City
  $scope.selectCity = function(city, curr) {
    $scope.user.location = city;
    $scope.showTipCity = false;
    if(curr) {
      $scope.currentCity = true;
    }
  };


  // Close Call Master Dialog
  $scope.hideCallOrderDialog = function() {
    $scope.submitted = false;
    $scope.user = $scope.global.createUserXOrder();
    $scope.showTipCity = false;
    $scope.currentCity = false;
    $scope.global.showOrderDialog = false;
  };

  // Send Form Data
  $scope.submitForm = function (form) {
    // Trigger validation flag.
    $scope.submitted = true;

    if (form.$valid) {
      if($scope.global.orderEditNumber) {
        //----- delete old order in localDB
        $scope.global.deleteOrderFromLocalDB($scope.global.orderEditNumber);
        for(var prod = 0; prod < $scope.global.order.products.length; prod++) {
          $scope.global.insertProductInLocalDB($scope.global.orderEditNumber, $scope.global.order.products[prod].productId, $scope.global.order.products[prod]);
        }
      }
      $scope.global.insertOrderInLocalDB($scope.user, $scope.global.fullOrderType, $scope.orderStyle);
      //--------- Close cart dialog, go to history
      $scope.hideCallOrderDialog();
      $scope.global.isCreatedNewProject = false;
      $scope.global.isCreatedNewProduct = false;
      $scope.global.isOrderFinished = true;
      $location.path('/history');
    }
  };

}]);


// controllers/parts/room-info.js

/* globals STEP, typingTextWithDelay, showElementWithDelay, playSound */

'use strict';

BauVoiceApp.controller('RoomInfoCtrl', ['$scope', 'constructService', 'localStorage', function ($scope, constructService, localStorage) {

  $scope.global = localStorage;

  $scope.roomInfo = {
    DELAY_SHOW_COEFF: 20 * STEP,
    DELAY_SHOW_ALLROOMS_BTN: 15 * STEP,
    typing: 'on'
  };

//--------- download rooms info
  constructService.getRoomInfo(function (results) {
    if (results.status) {
      $scope.roomInfo.roomsData = angular.copy(results.data.roomInfo);
    } else {
      console.log(results);
    }
  });


  // Show/Close Room Selector Dialog
  $scope.showRoomSelectorDialog = function(event) {
    if(!$scope.global.isShowCommentBlock) {
      if ($scope.global.showRoomSelectorDialog === true) {
        $scope.global.showRoomSelectorDialog = false;
      } else {
        $scope.global.showRoomSelectorDialog = true;
        $scope.global.isRoomsDialog = true;
      }
      //playSound('fly');
    }
  };

  //----- Show Comments
  $scope.swipeShowComment = function(event) {
    //playSound('swip');
    $scope.global.isShowCommentBlock = true;
    $scope.global.showRoomSelectorDialog = false;
  };
  $scope.swipeHideComment = function(event) {
    //playSound('swip');
    $scope.global.isShowCommentBlock = false;
  };

}]);


//event.srcEvent.stopPropagation();
//event.preventDefault();
//$event.stopImmediatePropagation();

/*

 hm-pinch="pinch($event)" hm-rotate="rotate($event)"

 $scope.rotate = function(event) {
 $scope.rotation = event.gesture.rotation % 360;
 event.gesture.preventDefault();
 }
 $scope.pinch = function(event) {
 $scope.scaleFactor = event.gesture.scale;
 event.gesture.preventDefault();
 }

 */


// controllers/parts/room-selector.js

/* globals BauVoiceApp, STEP */

'use strict';

BauVoiceApp.controller('RoomSelectorCtrl', ['$scope', '$location', 'localStorage', function ($scope, $location, localStorage) {

  $scope.global = localStorage;

  $scope.roomData = {
    DELAY_SHOW_ROOM1: 5*STEP,
    DELAY_SHOW_ROOM2: 6*STEP,
    DELAY_SHOW_ROOM3: 7*STEP,
    DELAY_SHOW_ROOM4: 8*STEP,
    DELAY_SHOW_ROOM5: 9*STEP,
    DELAY_SHOW_ROOM6: 10*STEP
  };


  // Room Select
  $scope.selectRoom = function(id) {
    $scope.global.product.selectedRoomId = id;
    $scope.closeRoomSelectorDialog();
    if($scope.global.isConstructDoor) {
      $scope.global.setDefaultDoorConfig();
    }
    //----- if select Door
    if(id === 6) {
      $scope.global.product.templateIndex = 0;
      $scope.global.isReturnFromDiffPage = false;
      $scope.global.isChangedTemplate = false;

      $scope.global.isConstructWind = false;
      $scope.global.isConstructWindDoor = false;
      $scope.global.isConstructBalcony = false;
      $scope.global.isConstructDoor = true;
      //------- get templates from STORE
      $scope.global.setTemplatesFromSTORE();
      //------ set new templates arrays
      $scope.global.getCurrentTemplates();
      //------- change template and price relate to Door
      $scope.global.product.templateSource = $scope.global.templatesDoorSource[$scope.global.product.templateIndex];
      $scope.global.product.templateDefault = $scope.global.templatesDoorList[$scope.global.product.templateIndex];
      $scope.global.product.templateIcon = $scope.global.templatesDoorIconList[$scope.global.product.templateIndex];
      $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
      $scope.global.prepareMainPage();
    } else if(id === 3) {
      //------- if select Balcony
      $scope.global.product.templateIndex = 0;
      $scope.global.isReturnFromDiffPage = false;
      $scope.global.isChangedTemplate = false;

      $scope.global.isConstructWind = false;
      $scope.global.isConstructWindDoor = false;
      $scope.global.isConstructBalcony = true;
      $scope.global.isConstructDoor = false;
      //------- get templates from STORE
      $scope.global.setTemplatesFromSTORE();
      //------ set new templates arrays
      $scope.global.getCurrentTemplates();
      //------- change template and price relate to Balcony
      $scope.global.product.templateSource = $scope.global.templatesBalconySource[$scope.global.product.templateIndex];
      $scope.global.product.templateDefault = $scope.global.templatesBalconyList[$scope.global.product.templateIndex];
      $scope.global.product.templateIcon = $scope.global.templatesBalconyIconList[$scope.global.product.templateIndex];
      $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
      $scope.global.prepareMainPage();
    } else {
      if($scope.global.isConstructBalcony || $scope.global.isConstructDoor) {

        $scope.global.product.templateIndex = 0;
        $scope.global.isReturnFromDiffPage = false;
        $scope.global.isChangedTemplate = false;

        $scope.global.isConstructWind = true;
        $scope.global.isConstructWindDoor = false;
        $scope.global.isConstructBalcony = false;
        $scope.global.isConstructDoor = false;
        //------- get templates from STORE
        $scope.global.setTemplatesFromSTORE();
        //------ set new templates arrays
        $scope.global.getCurrentTemplates();
        //------- change template and price relate to Window
        $scope.global.product.templateSource = $scope.global.templatesWindSource[$scope.global.product.templateIndex];
        $scope.global.product.templateDefault = $scope.global.templatesWindList[$scope.global.product.templateIndex];
        $scope.global.product.templateIcon = $scope.global.templatesWindIconList[$scope.global.product.templateIndex];
        $scope.global.createObjXFormedPrice($scope.global.product.templateDefault, $scope.global.product.profileIndex, $scope.global.product.profileId, $scope.global.product.glassId, $scope.global.product.hardwareId);
      }
      $scope.global.prepareMainPage();
    }

  };

  // Close Room Selector Dialog
  $scope.closeRoomSelectorDialog = function() {
    $scope.global.showRoomSelectorDialog = false;
    //playSound('fly');
  };
}]);


// controllers/parts/user-info.js

/* globals BauVoiceApp, STEP, playSound */
'use strict';

BauVoiceApp.controller('UserInfoCtrl', ['$scope', 'globalDB', 'localDB', 'localStorage', function ($scope, globalDB, localDB, localStorage) {

  $scope.global = localStorage;

  $scope.userInfo = {
    DELAY_SHOW_USER_INFO: 2000,
    typing: 'on',
    checked: false
  };
/*
  $scope.changeTyping = function () {
    if ($scope.userInfo.checked) {
      $scope.userInfo.typing = 'off';
    } else {
      $scope.userInfo.typing = 'on';
    }
  };
 */
  $scope.swipeMainPage = function(event) {
    //$rootScope.$broadcast('swipeMainPage', true);
    $scope.global.showNavMenu = !$scope.global.showNavMenu;
    $scope.global.isConfigMenu = true;
    if(!$scope.global.isOpenedHistoryPage) {
      $scope.global.startProgramm = false;
    }
    //playSound('swip');
  };

  $scope.swipeLeft = function(event) {
    if($scope.global.showNavMenu) {
      $scope.global.showNavMenu = false;
      $scope.global.isConfigMenu = true;
      if (!$scope.global.isOpenedHistoryPage) {
        $scope.global.startProgramm = false;
      }
      //playSound('swip');
    }
  };

  $scope.swipeRight = function(event) {
    if(!$scope.global.showNavMenu) {
      $scope.global.showNavMenu = true;
      $scope.global.isConfigMenu = false;
      //playSound('swip');
    }
  };

/*
  $rootScope.$on('swipeMainPage', function() {
    $scope.userInfo.isConfigMenuShow = !$scope.userInfo.isConfigMenuShow;
  });
*/

}]);

