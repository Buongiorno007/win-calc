(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .factory('NavMenuServ', navFactory);

  function navFactory(UserStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      setLanguageVoiceHelper: setLanguageVoiceHelper
    };

    return thisFactory.publicObj;




    //============ methods ================//

    function setLanguageVoiceHelper() {
      var langLabel = 'ru_RU';

//      switch (UserStor.userInfo.langLabel) {
//        //case 'ua': langLabel = 'ukr-UKR';
//        case 'ua': langLabel = 'ru_RU';
//        break;
//        case 'ru': langLabel = 'ru_RU';
//        break;
//        case 'en': langLabel = 'en_US';
//        break;
//        case 'de': langLabel = 'de_DE';
//        break;
//        case 'ro': langLabel = 'ro_RO';
//        break;
//      }
      return langLabel;
    }

  }
})();
