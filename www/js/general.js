
// general.js

'use strict';


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
