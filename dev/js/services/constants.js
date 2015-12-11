(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('globalConstants', {
//      serverIP: 'http://192.168.1.147:3002',
//      serverIP: 'http://windowscalculator.net:3002',
      serverIP: 'http://api.windowscalculator.net',
      STEP: 50,
      REG_PHONE: /^\d+$/, // /^[0-9]{1,10}$/
      REG_NAME: /^[a-zA-Z]+$/,
      REG_MAIL: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
          // /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
      svgTemplateIconWidth: 70,
      svgTemplateIconHeight: 70,
      svgTemplateIconBigWidth: 500,
      svgTemplateIconBigHeight: 450,
      svgTemplateWidth: 1022,
      svgTemplateHeight: 767,

      //---Edit Design
      squareLimit: 0.15,
      minSizeLimit: 100,
      minSizeLimitStulp: 300,
      minRadiusHeight: 10,

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
        {label: 'uk', name: 'Українська'},
        {label: 'ru', name: 'Русский'},
        {label: 'en', name: 'English'},
        {label: 'de', name: 'Deutsch'},
        {label: 'ro', name: 'Român'},
        {label: 'it', name: 'Italiano'}
      ]

    });

})();
