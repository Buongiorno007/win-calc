
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
      roundingNumbers: roundingNumbers
    };

    //TODO desktop
    //------- IMG rooms preload
    $document.ready(function() {
      for(var i = 0; i < 13; i++) {
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

    function roundingNumbers(nubmer) {
      var numberType = typeof nubmer;
      if(numberType === 'string') {
        return parseFloat( parseFloat(nubmer).toFixed(2) );
      } else if(numberType === 'number') {
        return parseFloat(nubmer.toFixed(2));
      }
    }

  }
})();

