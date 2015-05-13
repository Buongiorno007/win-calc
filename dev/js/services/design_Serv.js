(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('DesignModule')
    .factory('DesignServ', designFactory);

  function designFactory($location, $http, $filter, $cordovaGeolocation, GeneralServ, MainServ, CartServ, GlobalStor, DesignStor, ProductStor) {

    var thisFactory = this;

    thisFactory.publicObj = {
      initTemplate: initTemplate
    };

    return thisFactory.publicObj;




    //============ methods ================//

    function initTemplate() {
//      DesignStor.design.templateSourceOLD = angular.copy(ProductStor.product.templateSource);
//      DesignStor.design.templateOLD = angular.copy(ProductStor.product.template);
//
//      DesignStor.design.templateSourceTEMP = angular.copy(ProductStor.product.templateSource);
//      DesignStor.design.templateTEMP = angular.copy(ProductStor.product.template);
    }


  }
})();
