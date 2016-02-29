(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('globalConstants', {
      serverIP: 'http://api.windowscalculator.net',
      //serverIP: 'http://api.steko.com.ua',
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
      minSizeLimit: 300,
      minSizeLimitStulp: 300,
      minRadiusHeight: 10,

      activeClass: 'active',
      //------------ SVG
      SVG_ID_EDIT: 'tamlateSVG',
      SVG_ID_GLASS: 'tamlateSVGGlass',
      SVG_ID_GRID: 'tamlateSVGGrid',

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
