'use strict';

/*****************NATIVE forEACH*********************/

Array.prototype.myEach = function(callback) {
  for (var i = 0; i < this.length; i++)
    callback(this[i], i, this);
};


/*****************NATIVE MAP*************************/

Array.prototype.fastMap = function(callback) {
  var arr = [];
  for(var i = 0; i < this.length; i++) {
    arr[i] = callback(this[i], i, this);
  }
  return arr;
};

/*****************NATIVE FILTER*************************/

Array.prototype.myFilter = function(callback, context) {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    if (callback.call(context, this[i], i, this))
      arr.push(this[i]);
  }
  return arr;
};


/*****************NATIVE REDUCE*************************/


Array.prototype.myReduce = function(callback, initialVal) {
  var accumulator = (initialVal === undefined) ? undefined : initialVal;
  for (var i = 0; i < this.length; i++) {
    if (accumulator !== undefined)
      accumulator = callback.call(undefined, accumulator, this[i], i, this);
    else
      accumulator = this[i];
  }
  return accumulator;
};



/*****************NATIVE EVERY*************************/

Array.prototype.myEvery = function(callback, context) {
  for (var i = 0; i < this.length; i++) {
    if (!callback.call(context, this[i], i, this))
      return false;
  }
  return true;
};



/*****************NATIVE SOME*************************/

Array.prototype.mySome = function(callback, context) {
  for (var i = 0; i < this.length; i++) {
    if (callback.call(context, this[i], i, this))
      return true;
  }
  return false;
};
