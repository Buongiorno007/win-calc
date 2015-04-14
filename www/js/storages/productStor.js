
// storages/productStor.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .factory('ProductStor', productStorageFactory);

  productStorageFactory.$inject = [];

  function productStorageFactory() {

    return {
      //------ default product
      productSource: {
        orderId: 0,
        productId: 0,
        isAddElementsONLY: false,
        selectedRoomId: 4,
        constructionType: 1,
        templateIndex: 0,
        templateSource: {},
        templateDefault: {},
        templateIcon: {},
        templateWidth: 0,
        templateHeight: 0,
        beadId: 0,

        profileTypeIndex: 0,
        profileIndex: 0,
        profileId: 0,
        profileName: '',
        profileHeatCoeff: 0,
        profileAirCoeff: 0,

        glassTypeIndex: 0,
        glassIndex: 0,
        glassId: 0,
        glassName: '',
        glassHeatCoeff: 0,
        glassAirCoeff: 0,

        hardwareTypeIndex: 0,
        hardwareIndex: 0,
        hardwareId: 0,
        hardwareName: '',
        hardwareHeatCoeff: 0,
        hardwareAirCoeff: 0,

        laminationOutIndex: 'white',
        laminationOutName: '',
        laminationOutPrice: 0,
        laminationInIndex: 'white',
        laminationInName: '',
        laminationInPrice: 0,

        chosenAddElements: {
          selectedGrids: [],
          selectedVisors: [],
          selectedSpillways: [],
          selectedOutsideSlope: [],
          selectedLouvers: [],
          selectedInsideSlope: [],
          selectedConnectors: [],
          selectedFans: [],
          selectedWindowSill: [],
          selectedHandles: [],
          selectedOthers: []
        },

        doorShapeId: 0,
        doorSashShapeId: 0,
        doorHandleShapeId: 0,
        doorLockShapeId: 0,
        heatTransferMin: 0,
        heatTransferTOTAL: 0,
        airCirculationTOTAL: 0,

        templatePriceSELECT: 0,
        laminationPriceSELECT: 0,
        addElementsPriceSELECT: 0,
        productPriceTOTAL: 0,
        comment: '',
        productQty: 1
      },

      productDefault: {},
      product: {}

    }


  }
})();

