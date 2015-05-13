
// storages/designStor.js

(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('DesignModule')
    .factory('DesignStor', designStorageFactory);

  function designStorageFactory(ProductStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      designSource: {
        templateSourceTEMP: angular.copy(ProductStor.product.templateSource),
        templateTEMP: angular.copy(ProductStor.product.template),

        //----- Sizes
        tempSize: [],
        tempSizeId: '2',
        tempSizeType: '',
        minSizePoint: 0,
        maxSizePoint: 0,
        startSize: 0,
        finishSize: 0,
        oldSizeValue: 0,

        isMinSizeRestriction: 0,
        isMaxSizeRestriction: 0,
        minSizeLimit: 200,
        maxSizeLimit: 5000,
      },

      setDefaultDesign: setDefaultDesign
    };


    thisFactory.publicObj.design = setDefaultDesign();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultDesign() {
      var publicObj = angular.copy(thisFactory.publicObj.designSource);
      return publicObj;
    }

  }
})();

