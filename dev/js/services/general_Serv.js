(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .factory('GeneralServ', generalFactory);

  generalFactory.$inject = [];

  function generalFactory() {

    var thisFactory = this;

    thisFactory.publicObj = {

    };

    return thisFactory.publicObj;




    //============ methods ================//


  }
})();
