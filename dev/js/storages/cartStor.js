(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('BauVoiceApp')
    .factory('CartStor', cartStorageFactory);

  function cartStorageFactory($filter) {

    return {

      showMasterDialog: false,
      showOrderDialog: false,
      showCreditDialog: false,

      //------- data x order dialogs
      optionAge: [
        '20-30',
        '31-40',
        '41-50',
        '51-60',
        $filter('translate')('cart.CLIENT_AGE_OLDER') +' 61'
      ],
      optionEductaion: [
        $filter('translate')('cart.CLIENT_EDUC_MIDLE'),
        $filter('translate')('cart.CLIENT_EDUC_SPEC'),
        $filter('translate')('cart.CLIENT_EDUC_HIGH')
      ],
      optionOccupation: [
        $filter('translate')('cart.CLIENT_OCCUP_WORKER'),
        $filter('translate')('cart.CLIENT_OCCUP_HOUSE'),
        $filter('translate')('cart.CLIENT_OCCUP_BOSS'),
        $filter('translate')('cart.CLIENT_OCCUP_STUD'),
        $filter('translate')('cart.CLIENT_OCCUP_PENSION')
      ],
      optionInfo: [
        'TV',
        'InterNET',
        $filter('translate')('cart.CLIENT_INFO_PRESS'),
        $filter('translate')('cart.CLIENT_INFO_FRIEND'),
        $filter('translate')('cart.CLIENT_INFO_ADV')
      ]

    }

  }
})();
