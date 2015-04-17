(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('MainModule')
    .controller('AddElementsListCtrl', addElementsListCtrl);

  function addElementsListCtrl($scope, $filter, globalConstants, constructService, localStorage) {

    $scope.global = localStorage;

    $scope.addElementsList = {
      DELAY_START: globalConstants.STEP,
      DELAY_SHOW_ELEMENTS_MENU: globalConstants.STEP * 6,
      showAddElementGroups: false,
      filteredGroups: [],
      typing: 'on'
    };

    // Search Add Elements Group
    var regex, checkedGroup, indexGroup, currGroup, groupTempObj;

    $scope.addElementsList.addElementsGroup = [
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
    ];

    // Create regExpresion
    function escapeRegExp(string){
      return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    $scope.checkChanges = function() {

      $scope.addElementsList.filteredGroups.length = 0;
      if($scope.searchingWord && $scope.searchingWord.length > 0) {
        regex = new RegExp('^' + escapeRegExp($scope.searchingWord), 'i');
        for(indexGroup = 0; indexGroup < $scope.addElementsList.addElementsGroup.length; indexGroup++){
          currGroup = $scope.addElementsList.addElementsGroup[indexGroup];
          checkedGroup = regex.test(currGroup);
          if(checkedGroup) {
            groupTempObj = {};
            groupTempObj.groupId = indexGroup+1;
            groupTempObj.groupName = currGroup;
            groupTempObj.groupClass = $scope.global.addElementsGroupClass[indexGroup];
            $scope.addElementsList.filteredGroups.push(groupTempObj);
          }
        }
      }
      if( $scope.addElementsList.filteredGroups.length > 0) {
        $scope.addElementsList.showAddElementGroups = true;
      } else {
        $scope.addElementsList.showAddElementGroups = false;
      }
    };

    // Delete searching word
    $scope.cancelSearching = function() {
      $scope.searchingWord = '';
      $scope.addElementsList.showAddElementGroups = false;
    };
    // Delete last chart searching word
    $scope.deleteSearchChart = function() {
      $scope.searchingWord = $scope.searchingWord.slice(0,-1);
    };

     //Delete All Add Elements
    $scope.clearAllAddElements = function() {
      for(var group in $scope.global.product.chosenAddElements) {
        $scope.global.product.chosenAddElements[group].length = 0;
      }
      $scope.global.totalAddElementsPrice = false;
    };

    // Close Add Elements in List View
    $scope.viewSwitching = function() {
      $scope.global.isAddElementListView = false;
      $scope.global.showAddElementsMenu = false;
      $scope.global.isAddElement = false;
      $scope.global.isTabFrame = false;
    };

  }
})();
