"use strict";

BauVoiceApp.factory('constructService', function () {
  return {
    getCoefs: function () {
      return new OkResult({
        coefs: {
          thermalResistance: {
            required: 0.75,
            actual: 0.44
          },
          airCirculation: {
            required: 50,
            actual: 0
          }
        }
      });
    },
    getRoomInfo: function () {
      return new OkResult({
        id: 1,
        name: 'Детская'
      });
    },
    getConstructSize: function () {
      return new OkResult({
        width: 1200,
        height: 1250
      });
    },
    getProfileSystem: function () {
      return new OkResult({
        id: 12,
        name: 'Окошко S58'
      });
    },
    getGlass: function () {
      return new OkResult({
        id: 42,
        name: '4/16/4'
      });
    },
    getWindowHardware: function () {
      return new OkResult({
        id: 1,
        name: 'Немецкая'
      });
    },
    getLamination: function () {
      return new OkResult({
        color: {
          id: 15,
          name: 'Махагон'
        },
        type: {
          id: 4,
          name: 'Внутренняя'
        }
      });
    },
    getPrice: function () {
      return new OkResult({
        price: 2654.45,
        currency: {
          id: 3,
          name: 'uah'
        }
      });
    },
    getAdditionalElements: function () {
      return new OkResult({
        elements: [
          {
            element: {
              id: 152,
              name: 'УВ-100х100'
            },
            group: {
              id: 65,
              name: 'Нащельник'
            }
          },
          {
            element: {
              id: 22,
              name: 'ОБ-120'
            },
            group: {
              id: 66,
              name: 'Водоотлив'
            }
          }
        ]
      });
    },
    getConstructNoteText: function () {
      return new OkResult({
        note: 'Срочный заказ'
      });
    },
    getConstructThumb: function () {
      return new OkResult({
        thumburl: 'url_path'
      });
    },
    getAllLaminations: function (factoryId, callback) {
      var selectLaminations = "SELECT id, name FROM lamination_colors WHERE factory_id = " + factoryId,
          db = openDatabase('shopping-list', '1.0', 'shopping-list', 65536),
          i;

      db.transaction(function (transaction) {
        transaction.executeSql(selectLaminations, [], function (transaction, result) {
          var allLaminations = [];

          if (result.rows.length) {
            for (i = 0; i < result.rows.length; i++) {
              allLaminations.push({
                id: result.rows.item(i).id,
                name: result.rows.item(i).name + ""
              });
            }
            callback(new OkResult(allLaminations));
          } else {
            callback(new ErrorResult(1, 'No laminations in database!'));
          }
        }, function () {
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