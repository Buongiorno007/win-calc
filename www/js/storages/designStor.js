
// storages/designStor.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('DesignModule')
    .factory('DesignStor', designStorageFactory);

  function designStorageFactory() {

    var thisFactory = this;

    thisFactory.publicObj = {
      designSource: {
        templateSourceTEMP: {},
        templateTEMP: {},
        designSteps: [],
        activeMenuItem: 0,
        activeSubMenuItem: 0,

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

        oldSize: 0,
//        oldSizeValue: 0,//--- delete
        tempSize: [],
//        tempSizeId: '',
//        tempSizeType: '',//--- delete
//        minSizePoint: 0,
//        maxSizePoint: 0,
//        startSize: 0,
//        finishSize: 0,

        isMinSizeRestriction: 0,
        isMaxSizeRestriction: 0,
        minSizeLimit: 200,
        maxSizeLimit: 5000,

        //----- Door
        doorShapeList: [],
        sashShapeList: [],
        handleShapeList: [],
        lockShapeList: [],
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


    //============ methods ================//


    function setDefaultDesign() {
      var publicObj = angular.copy(thisFactory.publicObj.designSource);
      return publicObj;
    }

    function setDefaultDoor() {
      var publicObj = angular.copy(thisFactory.publicObj.designSource.doorConfig);
      return publicObj;
    }

  }
})();

