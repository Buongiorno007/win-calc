(function(){
  'use strict';
    /**@ngInject*/
  angular
    .module('DesignModule')
    .factory('DesignStor',

  function($filter) {
    /*jshint validthis:true */
    var thisFactory = this;

    function setDefaultDesign() {
      return angular.copy(thisFactory.publicObj.designSource);
    }

    function setDefaultDoor() {
      return angular.copy(thisFactory.publicObj.designSource.doorConfig);
    }

    thisFactory.publicObj = {
      designSource: {
        templateSourceTEMP: {},
        templateTEMP: {},
        designSteps: [],
        activeMenuItem: 0,
        activeSubMenuItem: 0,
        isDropSubMenu: 0,
        isImpostDelete: 0,
        //----- Edit
        selectedGlass: [],
        selectedCorner: [],
        selectedImpost: [],
        selectedArc: [],
        //----- Sizes
        openVoiceHelper: 0,
        loudVoice: 0,
        quietVoice: 0,
        voiceTxt: '',
        selectedGlassId: 0,

        isDimAnimate: 0,
        oldSize: 0,
        prevSize: 0,
        tempSize: [],

        isMinSizeRestriction: 0,
        isMaxSizeRestriction: 0,
        minSizeLimit: 0,
        maxSizeLimit: 0,
        isDimExtra: 0,
        isSquareExtra: 0,

        //------- extra glasses
        extraGlass: [],
        isGlassExtra: 0,

        //------- extra hardware
        extraHardware: [],
        isHardwareExtra: 0,

        //----- Door
        isNoDoors: 0,
        doorShapeData: [
          {
            name: $filter('translate')('panels.DOOR_TYPE1'),
            icon: 'img/door-config/doorstep.png',
            iconSelect: 'img/door-config-selected/doorstep.png'
          },
          {
            name: $filter('translate')('panels.DOOR_TYPE2'),
            icon: 'img/door-config/no-doorstep.png',
            iconSelect: 'img/door-config-selected/no-doorstep.png'
          },
          {
            name: $filter('translate')('panels.DOOR_TYPE3') + '1',
            icon: 'img/door-config/doorstep-al1.png',
            iconSelect: 'img/door-config-selected/doorstep-al1.png'
          },
          {
            name: $filter('translate')('panels.DOOR_TYPE3')+ '2',
            icon: 'img/door-config/doorstep-al2.png',
            iconSelect: 'img/door-config-selected/doorstep-al2.png'
          }
        ],
        doorShapeList: [],
        sashShapeList: [],
        handleShapeList: [],
        lockShapeList: [],
        doorConfig: {
          doorShapeIndex: 0,
          doorShapeName: '',
          sashShapeIndex: 0,
          sashShapeName: '',
          handleShapeIndex: 0,
          handleShape: {},
          lockShapeIndex: 0,
          lockShape: {}
        }

      },

      setDefaultDesign: setDefaultDesign,
      setDefaultDoor: setDefaultDoor
    };

    thisFactory.publicObj.design = setDefaultDesign();
    return thisFactory.publicObj;

  });
})();
