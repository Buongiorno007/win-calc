(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .factory('GeneralServ', generalFactory);

  function generalFactory() {

    var thisFactory = this;

    thisFactory.publicObj = {
      roundingNumbers: roundingNumbers
    };

    return thisFactory.publicObj;




    //============ methods ================//

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
