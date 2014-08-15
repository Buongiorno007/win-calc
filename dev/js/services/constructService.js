"use strict";

BauVoiceApp.factory('constructService', function () {
  return {
    // TODO: Сервис готов
    getCoefs: function (callback) {
      callback(new OkResult({
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
      }));
    },
    // TODO: Сервис готов
    getRoomInfo: function (callback) {
      callback(new OkResult({
        id: 1,
        name: 'Детская'
      }));
    },
    // TODO: Сервис готов
    getConstructThumb: function (callback) {
      callback(new OkResult({
        url: '../img/config-menu/configMenu_itemIMG.png'
      }));
    },
    // TODO: Сервис готов
    getConstructSize: function (callback) {
      callback(new OkResult({
        width: 1200,
        height: 1250
      }));
    },
    // TODO: Сервис готов
    getProfileSystem: function (callback) {
      callback(new OkResult({
        id: 12,
        name: 'Окошко S58'
      }));
    },
    // TODO: Сервис готов
    getGlass: function (callback) {
      callback(new OkResult({
        id: 42,
        name: '4/16/4'
      }));
    },
    // TODO: Сервис готов
    getWindowHardware: function (callback) {
      callback(new OkResult({
        id: 1,
        name: 'Немецкая'
      }));
    },
    // TODO: Сервис готов
    getLamination: function (callback) {
      callback(new OkResult({
        outer: {
          id: 15,
          name: 'Махагон'
        },
        inner: {
          id: 4,
          name: 'Внутренняя'
        }
      }));
    },
    // TODO: Сервис готов
    getAdditionalElements: function (callback) {
      callback(new OkResult({
        elements: [
          {
            id: 152,
            name: 'УВ-100х100',
            group: {
              id: 65,
              name: 'Нащельник'
            }
          },
          {
            id: 22,
            name: 'ОБ-120',
            group: {
              id: 66,
              name: 'Водоотлив'
            }
          }
        ]
      }));
    },
    // TODO: Сервис готов
    getPrice: function (callback) {
      callback(new OkResult({
        price: 4855268.52,
        currency: {
          id: 3,
          name: 'uah'
        }
      }));
    },
    getConstructNoteText: function (callback) {
      callback(new OkResult({
        note: 'Срочный заказ'
      }));
    },
    getAllLaminations: function (callback) {
      var selectLaminations = "SELECT id, name FROM lamination_colors ORDER BY id",
      db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), i;
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
    },
    getAllProfileSystems: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      db.transaction(function (transaction) {
        transaction.executeSql("SELECT id, name FROM profile_system_folders order by position", [], function (transaction, result) {
          if (result.rows.length) {
            var AllProfileSystems = [];
            var allFolders = result.rows.length - 1;
            db.transaction(function (transaction) {
              for (var j = 0; j < result.rows.length; j++) {
                var count = 0;
                var folder_id = result.rows.item(j).id;
                transaction.executeSql("SELECT profile_systems.id, profile_system_folders.name as folder_name, profile_systems.name, profile_systems.short_name, profile_systems.country FROM profile_systems LEFT JOIN profile_system_folders ON  profile_systems.profile_system_folder_id = profile_system_folders.id WHERE profile_system_folder_id = ? order by profile_systems.position", [folder_id], function (transaction, result) {
                  if (result.rows.length) {
                    var resultObj = {folder: result.rows.item(0).folder_name, profiles: []};
                    for (var i = 0; i < result.rows.length; i++) {
                      resultObj.profiles.push({id: result.rows.item(i).id, name: "" + result.rows.item(i).name + "", short_name: "" + result.rows.item(i).short_name + "", country: "" + result.rows.item(i).country + ""});
                    }
                    AllProfileSystems.push(resultObj);
                    if (allFolders === count) {
                      callback(new OkResult(AllProfileSystems));
                    }
                    count++;
                  } else {
                    callback(new ErrorResult(1, 'No ProfileSystems in database!'));
                  }
                }, function () {
                  callback(new ErrorResult(2, 'Something went wrong with selection profile_systems record'));
                });
              }
            });
          } else {
            callback(new ErrorResult(1, 'No ProfileSystemFolders in database!'));
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong with selection profile_system_folders record'));
        });
      });
    }
  }
});