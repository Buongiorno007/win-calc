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
        getAdditionalElements : function () {
            var resultObj;
            resultObj = [{element : {id : 152, name : 'УВ-100х100'}, group : {id : 65, name : 'Нащельник'}}, {element : {id : 22, name : 'ОБ-120'}, group : {id : 66, name : 'Водоотлив'}}];
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
        },
        getAllLaminations : function (factory_id, callback) {
            var db, selectLaminations;
            db = openDatabase('shopping-list', '1.0', 'shopping-list', 65536);
            selectLaminations = "SELECT id, name FROM lamination_colors WHERE factory_id = "+factory_id;
            db.transaction(function(transaction) {
                transaction.executeSql(selectLaminations, [], function(transaction, result) {
                    if(result.rows.length){
                        var allLaminations = [];
                        for(var i = 0; i < result.rows.length; i++) {
                            var resultObj = {id : result.rows.item(i).id, name : ""+result.rows.item(i).name+""};
                            allLaminations.push(resultObj);
                        }
                        callback(new OkResult(allLaminations));
                    } else {
                        callback(new ErrorResult(1, 'No laminations in database!'));
                    }
                }, function(){
                    callback(new ErrorResult(2, 'Something went wrong with selection lamination_colors record'));
                });
            });
        }
    }
});

/*

 $scope.coefs = constructService.getCoefs();
 console.log($scope.coefs);
 console.log($scope.coefs.data);

 $scope.room = constructService.getRoomInfo();
 console.log($scope.room);
 console.log($scope.room.data);

 $scope.constructSize = constructService.getConstructSize();
 console.log($scope.constructSize);
 console.log($scope.constructSize.data);

 $scope.profileSystem = constructService.getProfileSystem();
 console.log($scope.profileSystem);
 console.log($scope.profileSystem.data);

 $scope.glass = constructService.getGlass();
 console.log($scope.glass);
 console.log($scope.glass.data);

 $scope.windowHardware = constructService.getWindowHardware();
 console.log($scope.windowHardware);
 console.log($scope.windowHardware.data);

 $scope.lamination = constructService.getLamination();
 console.log($scope.lamination);
 console.log($scope.lamination.data);

 $scope.price = constructService.getPrice();
 console.log($scope.price);
 console.log($scope.price.data);

 $scope.additionalElement = constructService.getAdditionalElement();
 console.log($scope.additionalElement);
 console.log($scope.additionalElement.data);

 $scope.сonstructNoteText = constructService.getConstructNoteText();
 console.log($scope.сonstructNoteText);
 console.log($scope.сonstructNoteText.data);

 $scope.constructThumb = constructService.getConstructThumb();
 console.log($scope.constructThumb);
 console.log($scope.constructThumb.data);

 helperFactory.getAllLaminations(208, function (results) {
     if (results.status) {
         $scope.laminations = results.data;
         console.log($scope.laminations);
         console.log(results);
     } else {
        console.log(results);
     }
 });

 */