
// general.js

'use strict';


function getMaxMinCoord(points) {
  var overall = {
    minX: d3.min(points, function(d) { return d.x; }),
    maxX: d3.max(points, function(d) { return d.x; }),
    minY: d3.min(points, function(d) { return d.y; }),
    maxY: d3.max(points, function(d) { return d.y; })
  };
  return overall;
}

function rounding10(value) {
  return Math.round(value * 10) / 10;
}
function rounding100(value) {
  return Math.round(value * 100) / 100;
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

//Array.prototype.removeDuplicates = function() {
//  return this.filter(function(elem, index, self) {
//    return index == self.indexOf(elem);
//  });
//};
