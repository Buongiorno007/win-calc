(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('globalConstants', {
      STEP: 50,
      REG_PHONE: /^\d+$/, // /^[0-9]{1,10}$/
      REG_NAME: /^[a-zA-Z]+$/,
      REG_MAIL: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
          // /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
      productionDays: 15,
      minDeliveryDays: 2,
      maxDeliveryDays: 30,
      ratePriceDeliveryLess: 100,
      ratePriceDeliveryMore: 100,

      svgTemplateIconWidth: 70,
      svgTemplateIconHeight: 70,
      svgTemplateIconBigWidth: 500,
      svgTemplateIconBigHeight: 450,
      svgTemplateWidth: 800,
      svgTemplateHeight: 700,

      activeClass: 'active',
      addElementsGroupClass: [
        'aux_color_connect',
        'aux_color_big',
        'aux_color_middle',
        'aux_color_slope',
        'aux_color_middle',
        'aux_color_slope',
        'aux_color_connect',
        'aux_color_small',
        'aux_color_big',
        'aux_color_middle',
        'aux_color_small'
      ],

      //------------ Languages
      languages: [
        {label: 'ua', name: 'Українська'},
        {label: 'ru', name: 'Русский'},
        {label: 'en', name: 'English'},
        {label: 'de', name: 'Deutsch'},
        {label: 'ro', name: 'Român'}
      ]

    });

})();
