(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('globalConstants', {
       serverIP: 'http://api.windowscalculator.net',
       printIP: 'http://windowscalculator.net:3002/orders/get-order-pdf/',
       //localPath: '/calculator/local/',
      //serverIP: 'http://api.steko.com.ua',
      //printIP: 'http://admin.steko.com.ua:3002/orders/get-order-pdf/',
      localPath: '/local/', //TODO ipad
      STEP: 50,
      REG_LOGIN: /^[a-zA-Z?0-9?_?.?@?\-?]+$/,
      REG_PHONE: /^\d+$/, // /^[0-9]{1,10}$/
      REG_NAME: /^[a-zA-Z]+$/,
      REG_MAIL: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
          // /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

      //------------ SVG
      SVG_CLASS_ICON: 'tamlateIconSVG',
      SVG_ID_EDIT: 'tamlateSVG',
      SVG_ID_MAIN: 'tamlateMainSVG',
      SVG_ID_ICON: 'tamlateIconBigSVG',
      SVG_ID_GLASS: 'tamlateGlassSVG',
      SVG_ID_GRID: 'tamlateGridSVG',
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
