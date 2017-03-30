(function () {
  'use strict';
  /**@ngInject*/
  angular
    .module('MainModule')
    .factory('AuxStor',

      function () {
        /*jshint validthis:true */
        var thisFactory = this;

        function setDefaultAuxiliary() {
          return angular.copy(thisFactory.publicObj.auxiliarySource);
        }

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
            truefalse: 0,
            trfal: -1,
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

        // var data = localStorage.getItem("AuxStor");
        // if (data){
        //   thisFactory.publicObj.aux = angular.copy(JSON.parse(LZString.decompress(data)));
        //   //console.log("AuxStor restored");
        // } else {
        //   //console.log("AuxStor created");
        // }
        thisFactory.publicObj.aux = setDefaultAuxiliary();

        return thisFactory.publicObj;

      });
})();
