myApp.factory('locationService', function(){
    return {
        getCity : function(){
            var resultObj;
            resultObj = {city: {id : 156, name: 'Днепропетровск'}, zone:{id : 1}};
            return new OkResult(resultObj);
        }
    }
});

/*

 $scope.city = locationService.getCity();
 console.log($scope.city);
 console.log($scope.city.data);

 */