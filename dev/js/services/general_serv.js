(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('GeneralServ', generalFactory);

  function generalFactory($filter, $window, $document, GlobalStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      stopStartProg: stopStartProg,
      setPreviosPage: setPreviosPage,
      roundingValue: roundingValue,
      //rounding10: rounding10,
      //rounding100: rounding100,
      //rounding1000: rounding1000,
      //roundingNumbers: roundingNumbers,
      addMarginToPrice: addMarginToPrice,
      setPriceDis: setPriceDis,
      sorting: sorting,
      removeDuplicates: removeDuplicates,
      getMaxMinCoord: getMaxMinCoord,
      confirmAlert: confirmAlert
    };

    //TODO desktop
    //------- IMG rooms preload
    //$document.ready(function() {
    //  for(var i = 0; i < 16; i++) {
    //    $("<img />").attr("src", "img/rooms/"+i+".jpg");
    //  }
    //});

    //-------- blocking to refresh page
    //$window.onbeforeunload = function (){
    //  return $filter('translate')('common_words.PAGE_REFRESH');
    //};

    /** prevent Backspace back to previos Page */
    $window.addEventListener('keydown', function(e){
      if(e.keyCode === 8 && !$(e.target).is("input, textarea")){
        e.preventDefault();
      }
    });

    return thisFactory.publicObj;


    //============ methods ================//

    function stopStartProg() {
      if(GlobalStor.global.startProgramm && GlobalStor.global.currOpenPage === 'main') {
        GlobalStor.global.startProgramm = 0;
      }
    }

    function setPreviosPage() {
      GlobalStor.global.prevOpenPage = GlobalStor.global.currOpenPage;
    }


    //function rounding10(value) {
    //  return Math.round(value * 10) / 10;
    //}
    //
    //function rounding100(value) {
    //  return Math.round(value * 100) / 100;
    //}
    //
    //function rounding1000(value) {
    //  return Math.round(value * 1000) / 1000;
    //}
    //
    //function roundingNumbers(nubmer, radix) {
    //  var radix = (radix) ? radix : 2,
    //      numberType = typeof nubmer;
    //  if(numberType === 'string') {
    //    return parseFloat( parseFloat(nubmer).toFixed(radix) );
    //  } else if(numberType === 'number') {
    //    return parseFloat(nubmer.toFixed(radix));
    //  }
    //}

    function roundingValue(nubmer, radix) {
      var radix = (radix) ? radix : 2,
          numberType = typeof nubmer,
          roundRadix = '1', i = 0;

      for(; i < radix; i++) {
        roundRadix += '0';
      }
      roundRadix *= 1;

      if(numberType === 'string') {
        return parseFloat( (Math.round(parseFloat(nubmer) * roundRadix) / roundRadix).toFixed(radix) );
      } else if(numberType === 'number') {
        return parseFloat( (Math.round(nubmer * roundRadix) / roundRadix).toFixed(radix) );
      }
    }

    /** price Margins of Plant */
    function addMarginToPrice(price, margin) {
      return price * margin;
    }

    function setPriceDis(price, discount) {
      return roundingValue( price * (1 - discount/100) );
    }

    function sorting(a, b) {
      return a - b;
    }

    function removeDuplicates(arr) {
      return arr.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
      });
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


    function confirmAlert(title, descript, callback) {
      GlobalStor.global.isAlert = 1;
      GlobalStor.global.alertTitle = title || '';
      GlobalStor.global.alertDescr = descript || '';
      GlobalStor.global.confirmAction = callback;
    }

  }
})();
