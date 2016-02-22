(function(){
  'use strict';
    /**@ngInject*/
  angular
    .module('DesignModule')
    .factory('DesignStor', designStorageFactory);

  function designStorageFactory($filter) {
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
        openVoiceHelper: false,
        loudVoice: false,
        quietVoice: false,
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

        //----- Door
        doorShapeList: [
          {
            shapeId: 1,
            shapeLabel: $filter('translate')('panels.DOOR_TYPE1'),
            shapeIcon: 'img/door-config/doorstep.png',
            shapeIconSelect: 'img/door-config-selected/doorstep.png'
          },
          {
            shapeId: 2,
            shapeLabel: $filter('translate')('panels.DOOR_TYPE2'),
            shapeIcon: 'img/door-config/no-doorstep.png',
            shapeIconSelect: 'img/door-config-selected/no-doorstep.png'
          },
          {
            shapeId: 3,
            shapeLabel: $filter('translate')('panels.DOOR_TYPE3') + '1',
            shapeIcon: 'img/door-config/doorstep-al1.png',
            shapeIconSelect: 'img/door-config-selected/doorstep-al1.png'
          },
          {
            shapeId: 4,
            shapeLabel: $filter('translate')('panels.DOOR_TYPE3')+ '2',
            shapeIcon: 'img/door-config/doorstep-al2.png',
            shapeIconSelect: 'img/door-config-selected/doorstep-al2.png'
          }
        ],
        sashShapeList: [
          {
            shapeId: 1,
            shapeLabel: $filter('translate')('panels.SASH_TYPE1') + ', 98' + $filter('translate')('mainpage.MM')
          },
          {
            shapeId: 2,
            shapeLabel: $filter('translate')('panels.SASH_TYPE2') + ', 116' + $filter('translate')('mainpage.MM')
          },
          {
            shapeId: 3,
            shapeLabel: $filter('translate')('panels.SASH_TYPE3') +', 76' + $filter('translate')('mainpage.MM')
          }
        ],
        handleShapeList: [
          {
            shapeId: 1,
            shapeLabel: $filter('translate')('panels.HANDLE_TYPE1'),
            shapeIcon: 'img/door-config/lever-handle.png',
            shapeIconSelect: 'img/door-config-selected/lever-handle.png'
          },
          {
            shapeId: 2,
            shapeLabel: $filter('translate')('panels.HANDLE_TYPE2'),
            shapeIcon: 'img/door-config/standart-handle.png',
            shapeIconSelect: 'img/door-config-selected/standart-handle.png'
          }
        ],
        lockShapeList: [
          {
            shapeId: 1,
            shapeLabel: $filter('translate')('panels.LOCK_TYPE1'),
            shapeIcon: 'img/door-config/onelock.png',
            shapeIconSelect: 'img/door-config-selected/onelock.png'
          },
          {
            shapeId: 2,
            shapeLabel: $filter('translate')('panels.LOCK_TYPE2'),
            shapeIcon: 'img/door-config/multilock.png',
            shapeIconSelect: 'img/door-config-selected/multilock.png'
          }
        ],
        doorConfig: {
          doorShapeIndex: 0,
          sashShapeIndex: 0,
          handleShapeIndex: 0,
          lockShapeIndex: 0
        }

      },

      setDefaultDesign: setDefaultDesign,
      setDefaultDoor: setDefaultDoor
    };

    thisFactory.publicObj.design = setDefaultDesign();
    return thisFactory.publicObj;

  }
})();
