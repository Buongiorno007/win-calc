
// services/general_Serv.js

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

    };

    return thisFactory.publicObj;




    //============ methods ================//


  }
})();

