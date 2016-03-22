/* globals d3 */
(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('GeneralServ',

  function(
    $filter,
    $window,
    $document,
    globalConstants,
    GlobalStor
  ) {
    /*jshint validthis:true */
    var thisFactory = this,
        addElementDATA = [
          /** GRID */
          {
            id: 20,
            name: $filter('translate')('add_elements.GRIDS'),
            typeClass: 'aux-grid',
            //colorClass: 'aux_color_connect',
            delay: globalConstants.STEP * 5
          },
          /** VISOR */
          {
            id: 21,
            name: $filter('translate')('add_elements.VISORS'),
            typeClass: 'aux-visor',
            //colorClass: 'aux_color_big',
            delay: globalConstants.STEP * 6
          },
          /**SPILLWAY*/
          {
            id: 9,
            name: $filter('translate')('add_elements.SPILLWAYS'),
            typeClass: 'aux-spillway',
            //colorClass: 'aux_color_middle',
            delay: globalConstants.STEP * 6
          },
          /**OUTSIDE*/
          {
            id: 19,
            name: $filter('translate')('add_elements.OUTSIDE'),
            typeClass: 'aux-outside',
            //colorClass: 'aux_color_slope',
            delay: globalConstants.STEP * 10
          },
          /**LOUVER*/
          {
            id: 26,
            name: $filter('translate')('add_elements.LOUVERS'),
            typeClass: 'aux-louver',
            //colorClass: 'aux_color_middle',
            delay: globalConstants.STEP * 15
          },
          /**INSIDESLOPE*/
          {
            id: 19,
            name: $filter('translate')('add_elements.INSIDE'),
            typeClass: 'aux-inside',
            //colorClass: 'aux_color_slope',
            delay: globalConstants.STEP * 20
          },
          /**CONNECTORS*/
          {
            id: 12,
            name: $filter('translate')('add_elements.CONNECTORS'),
            typeClass: 'aux-connectors',
            //colorClass: 'aux_color_connect',
            delay: globalConstants.STEP * 30
          },
          /**FAN*/
          {
            id: 27,
            name: $filter('translate')('add_elements.FAN'),
            typeClass: 'aux-fan',
            //colorClass: 'aux_color_small',
            delay: globalConstants.STEP * 31
          },
          /**WINDOWSILL*/
          {
            id: 8,
            name: $filter('translate')('add_elements.WINDOWSILLS'),
            typeClass: 'aux-windowsill',
            //colorClass: 'aux_color_big',
            delay: globalConstants.STEP * 13
          },
          /**HANDLE*/
          {
            id: 24,
            name: $filter('translate')('add_elements.HANDLELS'),
            typeClass: 'aux-handle',
            //colorClass: 'aux_color_middle',
            delay: globalConstants.STEP * 28
          },
          /**OTHERS*/
          {
            id: 18,
            name: $filter('translate')('add_elements.OTHERS'),
            typeClass: 'aux-others',
            //colorClass: 'aux_color_small',
            delay: globalConstants.STEP * 31
          }
        ];


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



    /**============ METHODS ================*/

    function stopStartProg() {
      if(GlobalStor.global.startProgramm && GlobalStor.global.currOpenPage === 'main') {
        GlobalStor.global.startProgramm = 0;
      }
    }

    function setPreviosPage() {
      GlobalStor.global.prevOpenPage = GlobalStor.global.currOpenPage;
    }


    function roundingValue(nubmer, rad) {
      var radix = rad || 2,
          numberType = typeof nubmer,
          roundRadix = '1', i, newValue;

      for(i = 0; i < radix; i+=1) {
        roundRadix += '0';
      }
      roundRadix *= 1;

      if(numberType === 'string') {
        newValue = parseFloat( (Math.round(parseFloat(nubmer) * roundRadix) / roundRadix).toFixed(radix) );
      } else if(numberType === 'number') {
        newValue = parseFloat( (Math.round(nubmer * roundRadix) / roundRadix).toFixed(radix) );
      }
      return newValue;
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
        return index === self.indexOf(elem);
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
    function confirmPath(callback) {
      GlobalStor.global.confirmInActivity = callback;
    }

    function goToLink(link) {
      if(GlobalStor.global.isDevice) {
        var ref = window.open(link);
        ref.close();
      } else {
        $window.open(link);
      }
    }


    /**========== FINISH ==========*/

    thisFactory.publicObj = {
      addElementDATA: addElementDATA,
      stopStartProg: stopStartProg,
      setPreviosPage: setPreviosPage,
      roundingValue: roundingValue,
      addMarginToPrice: addMarginToPrice,
      setPriceDis: setPriceDis,
      sorting: sorting,
      removeDuplicates: removeDuplicates,
      getMaxMinCoord: getMaxMinCoord,
      confirmAlert: confirmAlert,
      goToLink: goToLink,
      confirmPath: confirmPath,
    };

    return thisFactory.publicObj;

  });
})();
