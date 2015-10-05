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

Array.prototype.removeDuplicates = function() {
  return this.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
  });
};


//----------- ALERTS
navigator.notification = {};
navigator.notification.confirm = function (obj1, obj2, obj3, obj4) {
  swal({title: obj3,
      text: obj1,
      type: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: obj4[0],
      cancelButtonText: obj4[1],
      confirmButtonColor:	"#f98000"
    },
    function () {
      console.log('click yes');
      obj2(1);
      return 1;
    }
  );
};