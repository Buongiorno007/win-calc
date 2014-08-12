"use strict";

BauVoiceApp.factory('locationService', function () {
  return {
    getCity: function () {
      return new OkResult({
        city: {
          id: 156,
          name: 'Днепропетровск'
        },
        zone: {
          id: 1
        }
      });
    }
  }
});

/*

 $scope.city = locationService.getCity();
 console.log($scope.city);
 console.log($scope.city.data);

 */