/* globals BauVoiceApp, STEP, selectClass, activeClass */

'use strict';

BauVoiceApp.controller('AdditionalElementsListCtrl', ['$scope', 'globalData', 'constructService', function ($scope, globalData, constructService) {

  $scope.global = globalData;

  $scope.addElementsList = {
    DELAY_START: STEP,
    DELAY_SHOW_ELEMENTS_MENU: STEP * 6,

    showAddElementGroups: false,
    filteredGroups: [],
    typing: 'on'
  };

  // Search Add Elements Group
  var regex, checkedGroup, indexGroup, currGroup, groupTempObj;

  constructService.getAddElementsGroups(function (results) {
    if (results.status) {
      $scope.addElementsList.addElementsGroup = results.data.groups;
    } else {
      console.log(results);
    }
  });

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
    for(var group in $scope.global.chosenAddElements) {
      $scope.global.chosenAddElements[group].length = 0;
    }
    $scope.global.totalAddElementsPrice = false;
  };

  // Close Add Elements in List View
  $scope.viewSwitching = function() {
    $scope.global.isAddElementListView = false;
    $scope.global.showAddElementsMenu = false;
    $scope.global.isAddElement = false;
  };

}]);
