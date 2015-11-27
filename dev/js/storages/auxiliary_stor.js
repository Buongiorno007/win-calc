(function(){
  'use strict';
    /**
     * @ngInject
     */
  angular
    .module('MainModule')
    .factory('AuxStor', auxStorageFactory);

  function auxStorageFactory($filter) {

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

        addElementGroups: [],
        searchingWord: '',
        groupNames: [
          $filter('translate')('add_elements.GRIDS'),
          $filter('translate')('add_elements.VISORS'),
          $filter('translate')('add_elements.SPILLWAYS'),
          $filter('translate')('add_elements.OUTSIDE'),
          $filter('translate')('add_elements.INSIDE'),
          $filter('translate')('add_elements.LOUVERS'),
          $filter('translate')('add_elements.CONNECTORS'),
          $filter('translate')('add_elements.FAN'),
          $filter('translate')('add_elements.WINDOWSILLS'),
          $filter('translate')('add_elements.HANDLELS'),
          $filter('translate')('add_elements.OTHERS')
        ]
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
