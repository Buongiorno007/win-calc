(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .factory('GeneralServ', generalFactory);

  function generalFactory(GlobalStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      stopStartProg: stopStartProg,
      setPreviosPage: setPreviosPage,
      roundingNumbers: roundingNumbers
    };

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
