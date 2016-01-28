(function(){
  'use strict';
    /**@ngInject*/
  angular
    .module('MainModule')
    .factory('AuxStor', auxStorageFactory);

  function auxStorageFactory() {

    var thisFactory = this;

    thisFactory.publicObj = {
      auxiliarySource: {
        addElementsType: [],
        addElementsList: [],
        showAddElementsMenu: 0,
        addElementsMenuStyle: 0,
        isFocusedAddElement: 0,
        isAddElement: 0,
        currentAddElementId: 0,
        auxParameter: 0,
        tempSize: [],
        currAddElementPrice: 0,
        isTabFrame: 0,
        isAddElementListView: 0,
        isWindowSchemeDialog: 0,
        isGridSelectorDialog: 0,
        selectedGrid: 0,
        calculatorStyle: '',

        addElementGroups: [],
        searchingWord: ''
      },
      setDefaultAuxiliary: setDefaultAuxiliary
    };

    thisFactory.publicObj.aux = setDefaultAuxiliary();

    return thisFactory.publicObj;


    //============ methods ================//

    function setDefaultAuxiliary() {
      var publicObj = angular.copy(thisFactory.publicObj.auxiliarySource);
      return publicObj;
    }

  }
})();
