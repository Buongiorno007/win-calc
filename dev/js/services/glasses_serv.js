(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .factory('GlassesServ',

  function(
    $location,
    $filter,
    $q,
    GlobalStor,
    DesignServ

  ) {
    /*jshint validthis:true */
    var thisFactory = this;


    /**============ METHODS ================*/
    
    function selectGlass(newId, newName) {
      GlobalStor.global.prevGlassId = angular.copy(GlobalStor.global.selectGlassId);
      GlobalStor.global.prevGlassName = angular.copy(GlobalStor.global.selectGlassName);
      GlobalStor.global.selectGlassId = newId;
      GlobalStor.global.selectGlassName = newName;
      //----- open glass selector dialog
      GlobalStor.global.showGlassSelectorDialog = 1;
      DesignServ.initAllGlassXGlass();
    }

    /**========== FINISH ==========*/
    //------ clicking
    selectGlass: selectGlass;

    thisFactory.publicObj = {
      selectGlass:selectGlass
    };

    return thisFactory.publicObj;



  });
})();
