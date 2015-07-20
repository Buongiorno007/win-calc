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