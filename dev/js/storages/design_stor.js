(function(){
  'use strict';
    /**@ngInject*/
  angular
    .module('DesignModule')
    .factory('DesignStor',

  function() {
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
        showHint : 0,
        templateSourceTEMP: {},
        templateTEMP: {},
        template_id: null,
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
        doorsGroups: [],
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

        steps: {
          isDoorConfig:0,
          selectedStep1:0,
          selectedStep2:0,
          selectedStep3:0,
          selectedStep4:0
        },
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
            id: 0,
            name: 'panels.DOOR_TYPE1',
            icon: 'img/door-config/doorstep.png',
            iconSelect: 'img/door-config-selected/doorstep.png'
          },
          {
            id: 1,
            name: 'panels.DOOR_TYPE2',
            icon: 'img/door-config/no-doorstep.png',
            iconSelect: 'img/door-config-selected/no-doorstep.png'
          },
          {
            id: 2,
            name: 'panels.DOOR_TYPE3',
            icon: 'img/door-config/doorstep-al1.png',
            iconSelect: 'img/door-config-selected/doorstep-al1.png'
          },
          {
            id: 3,
            name: 'panels.DOOR_TYPE4',
            icon: 'img/door-config/doorstep-al2.png',
            iconSelect: 'img/door-config-selected/doorstep-al2.png'
          }
        ],
        doorShapeList: [],
        sashShapeList: [],
        handleShapeList: [],
        lockShapeList: [],
        doorConfig: {
          doorTypeIndex: '',
          doorShapeIndex: '',
          doorShapeName: '',
          sashShapeIndex: '',
          sashShapeName: '',
          handleShapeIndex: '',
          handleShape: {},
          lockShapeIndex: '',
          lockShape: {},
          glassDepProf: false //соответствие старого и нового профиля. Если нет - стеклопакеты приводятся к default значению.
        }

      },

      setDefaultDesign: setDefaultDesign,
      setDefaultDoor: setDefaultDoor
    };

    var data = localStorage.getItem("DesignStor");
    if (data){
      thisFactory.publicObj.design = JSON.parse(data);
    } else {
      thisFactory.publicObj.design = setDefaultDesign();
    }
    return thisFactory.publicObj;

  });
})();
