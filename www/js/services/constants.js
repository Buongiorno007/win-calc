
// services/constants.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('globalConstants', {
      STEP: 50,
      REG_PHONE: /^\d+$/,
      REG_NAME: /^[a-zA-Z]+$/,
      REG_MAIL: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
          // /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    });

})();

