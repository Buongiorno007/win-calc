(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('MainModule')
    .factory('AuxStor', auxStorageFactory);

  function auxStorageFactory() {

    var thisFactory = this;

    thisFactory.publicObj = {
      auxiliarySource: {
        addElementsType: [],
        addElementsList: [],
        showAddElementsMenu: false,
        addElementsMenuStyle: false,
        isFocusedAddElement: 0,
        isAddElement: false,
        currentAddElementId: false,
        auxParameter: false,

        currAddElementPrice: 0,
        isTabFrame: false,
        isAddElementListView: false,
        isWindowSchemeDialog: false,

        showAddElementGroups: false,
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
