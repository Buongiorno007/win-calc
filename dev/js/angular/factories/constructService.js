myApp.factory('constructService', function(){
    return {
        getCoefs : function () {
            var resultObj;
            resultObj = {coefs :{requiredT : 0.75, actualT : 0.44, requiredO : 50, actualO : 0}};
            return new OkResult(resultObj);
        },
        getRoomInfo : function () {
            var resultObj;
            resultObj = {id : 1, name : 'Детская'};
            return new OkResult(resultObj);
        },
        getConstructSize : function(){
            var resultObj;
            resultObj = {width : 1200, height : 1250};
            return new OkResult(resultObj);
        },
        getProfileSystem : function(){
            var resultObj;
            resultObj = {id : 12, name : 'S58'};
            return new OkResult(resultObj);
        },
        getGlass : function () {
            var resultObj;
            resultObj = {id : 42, name : '4/16/4'};
            return new OkResult(resultObj);
        },
        getWindowHardware : function(){
            var resultObj;
            resultObj = {id : 1, name : 'Немецкая'};
            return new OkResult(resultObj);
        },
        getLamination : function(){
            var resultObj;
            resultObj = {color : {id : 15, name : 'Махагон'}, type : {id : 4, name : 'Внутренняя'}};
            return new OkResult(resultObj);
        },
        getPrice : function () {
            var resultObj;
            resultObj = {price : 2654.45, currency : {id : 3, name : 'uah'}};
            return new OkResult(resultObj);
        },
        getAdditionalElement : function () {
            var resultObj;
            resultObj = [{list : {id : 152, name : 'УВ-100х100'}, group : {id : 65, name : 'Нащельник'}}, {list : {id : 22, name : 'ОБ-120'}, group : {id : 65, name : 'Водоотлив'}}];
            return new OkResult(resultObj);
        },
        getConstructNoteText : function () {
            var resultObj;
            resultObj = {note : 'Срочный заказ'};
            return new OkResult(resultObj);
        },
        getConstructThumb : function () {
            var resultObj;
            resultObj = {thumburl : 'url_path'};
            return new OkResult(resultObj);
        }
    }
});

/*

 $scope.coefs = helperFactory.getCoefs();
 console.log($scope.coefs);
 console.log($scope.coefs.data);

 $scope.room = helperFactory.getRoomInfo();
 console.log($scope.room);
 console.log($scope.room.data);

 $scope.constructSize = helperFactory.getConstructSize();
 console.log($scope.constructSize);
 console.log($scope.constructSize.data);

 $scope.profileSystem = helperFactory.getProfileSystem();
 console.log($scope.profileSystem);
 console.log($scope.profileSystem.data);

 $scope.glass = helperFactory.getGlass();
 console.log($scope.glass);
 console.log($scope.glass.data);

 $scope.windowHardware = helperFactory.getWindowHardware();
 console.log($scope.windowHardware);
 console.log($scope.windowHardware.data);

 $scope.lamination = helperFactory.getLamination();
 console.log($scope.lamination);
 console.log($scope.lamination.data);

 $scope.price = helperFactory.getPrice();
 console.log($scope.price);
 console.log($scope.price.data);

 $scope.additionalElement = helperFactory.getAdditionalElement();
 console.log($scope.additionalElement);
 console.log($scope.additionalElement.data);

 $scope.сonstructNoteText = helperFactory.getConstructNoteText();
 console.log($scope.сonstructNoteText);
 console.log($scope.сonstructNoteText.data);

 $scope.constructThumb = helperFactory.getConstructThumb();
 console.log($scope.constructThumb);
 console.log($scope.constructThumb.data);

 */