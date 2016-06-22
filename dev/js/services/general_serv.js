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
    var thisFactory = this;
      var addElementDATA = [

          /** GRID */
          {
            id: 20,
            name: 'add_elements.GRIDS',
            typeClass: 'aux-grid',
            typeMenu: 33,
            mainTypeMenu: 55,
            //colorClass: 'aux_color_connect',
            delay: globalConstants.STEP * 5
          },
          /** VISOR */
          {
            id: 21,
            name: 'add_elements.VISORS',
            typeClass: 'aux-visor',
            typeMenu: 22,
            //colorClass: 'aux_color_big',
            delay: globalConstants.STEP * 6
          },
          /**SPILLWAY*/
          {
            id: 9,
            name: 'add_elements.SPILLWAYS',
            typeClass: 'aux-spillway',
            typeMenu: 22,
            //colorClass: 'aux_color_middle',
            delay: globalConstants.STEP * 6
          },
          /**OUTSIDE*/
          {
            id: 19,
            name: 'add_elements.OUTSIDE',
            typeClass: 'aux-outside',
            typeMenu: 22,
            //colorClass: 'aux_color_slope',
            delay: globalConstants.STEP * 10
          },
          /**LOUVER*/
          {
            id: 26,
            name: 'add_elements.LOUVERS',
            typeClass: 'aux-louver',
            typeMenu: 11,
            mainTypeMenu: 55,
            //colorClass: 'aux_color_middle',
            delay: globalConstants.STEP * 15
          },
          /**INSIDESLOPE*/
          {
            id: 19,
            name: 'add_elements.INSIDE',
            typeClass: 'aux-inside',
            typeMenu: 11,
            mainTypeMenu: 55,
            //colorClass: 'aux_color_slope',
            delay: globalConstants.STEP * 20
          },
          /**CONNECTORS*/
          {
            id: 12,
            name: 'add_elements.CONNECTORS',
            typeClass: 'aux-connectors',
            typeMenu: 33,
            mainTypeMenu: 55,
            //colorClass: 'aux_color_connect',
            delay: globalConstants.STEP * 30
          },
          /**FAN*/
          {
            id: 27,
            name: 'add_elements.FAN',
            typeClass: 'aux-fan',
            typeMenu: 33,
            mainTypeMenu: 55,
            //colorClass: 'aux_color_small',
            delay: globalConstants.STEP * 31
          },
          /**WINDOWSILL*/
          {
            id: 8,
            name: 'add_elements.WINDOWSILLS',
            typeClass: 'aux-windowsill',
            typeMenu: 11,
            mainTypeMenu: 55,
            //colorClass: 'aux_color_big',
            delay: globalConstants.STEP * 13
          },
          /**HANDLE*/
          {
            id: 24,
            name: 'add_elements.HANDLELS',
            typeClass: 'aux-handle',
            typeMenu: 33,
            mainTypeMenu: 55,
            //colorClass: 'aux_color_middle',
            delay: globalConstants.STEP * 28
          },
          /**OTHERS*/
          {
            id: 18,
            name: 'add_elements.OTHERS',
            typeClass: 'aux-others',
            typeMenu: 44,
            mainTypeMenu: 55,
            //colorClass: 'aux_color_small',
            delay: globalConstants.STEP * 31
          },

          /**BLIND*/
          {
            id: 99,
            name: 'add_elements.BLIND',
            typeClass: 'aux-blind',
            typeMenu: 22,
            //colorClass: 'aux_color_small',
            delay: globalConstants.STEP * 31
          },

          /**GRATING*/
          {
            id: 9999,
            name: 'add_elements.GRATING',
            typeClass: 'aux-grating',
            typeMenu: 22,
            //colorClass: 'aux_color_small',
            delay: globalConstants.STEP * 31
          },
          /**SHUTTERS*/
          {
            id: 999,
            name: 'add_elements.SHUTTERS',
            typeClass: 'aux-shutters',
            typeMenu: 22,
            //colorClass: 'aux_color_small',
            delay: globalConstants.STEP * 31
          },          
          /**SHUTTERS main*/
          {
            id: 999,
            name: 'add_elements.SHUTTERS',
            typeClass: 'aux-shut',
            mainTypeMenu: 55,
            //colorClass: 'aux_color_small',
            delay: globalConstants.STEP * 31
          },          
          /**GRATING main*/
          {
            id: 9999,
            name: 'add_elements.GRATING',
            typeClass: 'aux-grat',
            mainTypeMenu: 55,
            //colorClass: 'aux_color_small',
            delay: globalConstants.STEP * 31
          },
           /**GRATING main*/
          {
            id: 21,
            name: 'add_elements.VISORS',
            typeClass: 'aux-vis',
            mainTypeMenu: 55,
            //colorClass: 'aux_color_small',
            delay: globalConstants.STEP * 31
          },
           /**GRATING main*/
          {
            id: 9,
            name: 'add_elements.SPILLWAYS',
            typeClass: 'aux-spil',
            mainTypeMenu: 55,
            //colorClass: 'aux_color_small',
            delay: globalConstants.STEP * 31
          },

          {
            id: 13,
            name: 'add_elements.CONNECTORS',
            typeClass: 'aux-connectors',
            typeMenu: 33,
            mainTypeMenu: 55,
            //colorClass: 'aux_color_connect',
            delay: globalConstants.STEP * 30
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
    $window.onbeforeunload = function (){
      return $filter('translate')('common_words.PAGE_REFRESH');
    };

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
