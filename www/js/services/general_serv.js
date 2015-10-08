
// services/general_serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .factory('GeneralServ', generalFactory);

  function generalFactory($filter, $window, $document, GlobalStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      stopStartProg: stopStartProg,
      setPreviosPage: setPreviosPage,
      roundingNumbers: roundingNumbers,
      setPriceDis: setPriceDis,
      sorting: sorting
    };

    //TODO desktop
    //------- IMG rooms preload
    $document.ready(function() {
      for(var i = 0; i < 16; i++) {
        $("<img />").attr("src", "img/rooms-icon/"+i+".jpg");
        $("<img />").attr("src", "img/rooms/"+i+".jpg");
      }
    });

    //-------- blocking to refresh page
//    $window.onbeforeunload = function (){
//      return $filter('translate')('common_words.PAGE_REFRESH');
//    };


    return thisFactory.publicObj;


    //============ methods ================//

    function stopStartProg() {
      if(GlobalStor.global.startProgramm && GlobalStor.global.currOpenPage === 'main') {
        GlobalStor.global.startProgramm = false;
      }
    }

    function setPreviosPage() {
      GlobalStor.global.prevOpenPage = GlobalStor.global.currOpenPage;
    }

    function roundingNumbers(nubmer, radix) {
      var radix = (radix) ? radix : 2,
          numberType = typeof nubmer;
      if(numberType === 'string') {
        return parseFloat( parseFloat(nubmer).toFixed(radix) );
      } else if(numberType === 'number') {
        return parseFloat(nubmer.toFixed(radix));
      }
    }

    function setPriceDis(price, discount) {
      return roundingNumbers( price * (1 - discount/100) );
    }

    function sorting(a, b) {
      return a - b;
    }

  }
})();

