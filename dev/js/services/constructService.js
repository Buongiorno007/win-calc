"use strict";

BauVoiceApp.factory('constructService', function () {

  // SQL requests for select data from tables
  var selectLaminations = "SELECT id, name FROM lamination_colors ORDER BY id",
    selectProfileSystemFolders = "SELECT id, name FROM profile_system_folders order by position",
    selectProfileSystems = "SELECT profile_systems.id, profile_system_folders.name as folder_name, profile_systems.name, profile_systems.short_name, profile_systems.country FROM profile_systems LEFT JOIN profile_system_folders ON  profile_systems.profile_system_folder_id = profile_system_folders.id WHERE profile_system_folder_id = ? order by profile_systems.position",
    selectWindowHardware = "SELECT id, name, short_name as shortName FROM window_hardware_groups WHERE is_in_calculation = 1";

  return {

    // TODO: Сервис готов
    getCoefs: function (callback) {
      callback(new OkResult({
        coefs: [
          {
            id: 1,
            thermalResistance: {
              required: 0.75,
              actual: 0.54
            },
            airCirculation: {
              required: 50,
              actual: 20
            }
          },
          {
            id: 2,
            thermalResistance: {
              required: 0.75,
              actual: 0.4
            },
            airCirculation: {
              required: 50,
              actual: 90
            }
          },
          {
            id: 3,
            thermalResistance: {
              required: 0.75,
              actual: 0.14
            },
            airCirculation: {
              required: 50,
              actual: 10
            }
          },
          {
            id: 4,
            thermalResistance: {
              required: 0.75,
              actual: 0.44
            },
            airCirculation: {
              required: 50,
              actual: 0
            }
          }
        ]

      }));
    },

    // TODO: Сервис готов
    getRoomInfo: function (callback) {
      callback(new OkResult({
        roomName: [
          {
            id: 1,
            name: 'Кухня'
          },
          {
            id: 2,
            name: 'Гостиная'
          },
          {
            id: 3,
            name: 'Балкон'
          },
          {
            id: 4,
            name: 'Детская'
          },
          {
            id: 5,
            name: 'Спальня'
          },
          {
            id: 6,
            name: 'Вход'
          }
        ]
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
          name: 'без лам.'
        },
        inner: {
          id: 4,
          name: 'без лам.'
        }
      }));
    },

    // TODO: Сервис готов
/*
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
*/
    getAddElementsGroups: function (callback) {
      callback(new OkResult({
        groups: [
          'Москитные сетки',
          'Козырьки',
          'Водоотливы',
          'Наружные откосы',
          'Жалюзи',
          'Внутренние откосы',
          'Соединитель',
          'Микропроветривание',
          'Подоконники',
          'Ручки',
          'Прочее'
        ]
      }));
    },

    getAllGrids: function (callback) {
      callback(new OkResult({

        elementType: [
          'Стандартные',
          'оцинкованный',
          'Матовые'
        ],
        elementsList: [
          [
            {
              elementId: 1,
              elementName: 'КO-100, оцинкованный',
              elementPrice: 100
            },
            {
              elementId: 2,
              elementName: 'КO-100, оцинкованный',
              elementPrice: 100
            },
            {
              elementId: 3,
              elementName: 'КO-100, оцинкованный',
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementName: 'КO-100, оцинкованный',
              elementPrice: 100
            },
            {
              elementId: 2,
              elementName: 'КO-100, оцинкованный',
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementName: 'КO-100, оцинкованный',
              elementPrice: 100
            }
          ]
        ]

      }));
    },

    getAllVisors: function (callback) {
      callback(new OkResult({

        elementType: [
          'Стандартные',
          'оцинкованный',
          'Матовые'
        ],
        elementsList: [
          [
            {
              elementId: 1,
              elementType: 'Стандартные',
              elementName: 'КO-200, оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementType: 'Стандартные',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 3,
              elementType: 'Стандартные',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementType: 'оцинкованный',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementType: 'оцинкованный',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementType: 'Матовые',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementType: 'Матовые',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 3,
              elementType: 'Матовые',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 4,
              elementType: 'Матовые',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            }
          ]
        ]

      }));
    },

    getAllWindowSills: function (callback) {
      callback(new OkResult({

        elementType: [
          'Стандартные',
          'оцинкованный',
          'Матовые'
        ],
        elementsList: [
          [
            {
              elementId: 1,
              elementType: 'Матовые',
              elementName: 'КO-200, оцинкованный',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: '../img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementType: 'Матовые',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: '../img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 3,
              elementType: 'Матовые',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: '../img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementType: 'Матовые',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: '../img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementType: 'Матовые',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: '../img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementType: 'Матовые',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: '../img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementType: 'Матовые',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: '../img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 3,
              elementType: 'Матовые',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: '../img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 4,
              elementType: 'Матовые',
              elementName: 'КO-300, оцинкованный',
              elementWidth: 1500,
              elementHeight: 1500,
              elementColorId: 'matt',
              elementColor: '../img/lamination/empty.png',
              elementQty: 1,
              elementPrice: 100
            }
          ]
        ]

      }));
    },

    getLaminationAddElements: function (callback) {
      callback(new OkResult({
        laminationWhiteMatt: {
          laminationName: 'Белый',
          laminationLabel: 'матовый',
          laminationUrl: '../img/lamination/empty.png'
        },
        laminationWhiteGlossy: {
          laminationName: 'Белый',
          laminationLabel: 'глянцевый',
          laminationUrl: '../img/lamination/empty.png'
        },
        laminations: [
          {
            laminationId: 1,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 2,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 3,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 4,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 5,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 6,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 7,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 8,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          }
        ]
      }));
    },

    // TODO: Сервис готов
    getPrice: function (callback) {
      callback(new OkResult({
        price: 12345678.51,
        currency: {
          id: 3,
          name: 'uah'
        }
      }));
    },

    // TODO: Сервис готов
    getConstructNoteText: function (callback) {
      callback(new OkResult({
        note: 'Срочный заказ'
      }));
    },

    getAllLaminations: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), i, allLaminations = [];
      db.transaction(function (transaction) {
        transaction.executeSql(selectLaminations, [], function (transaction, result) {
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
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), AllProfileSystems = [], allFolders, count, folder_id, resultObj = {}, j, i;
      db.transaction(function (transaction) {
        transaction.executeSql(selectProfileSystemFolders, [], function (transaction, result) {
          if (result.rows.length) {
            allFolders = result.rows.length - 1;
            db.transaction(function (transaction) {
              for (j = 0; j < result.rows.length; j++) {
                count = 0;
                folder_id = result.rows.item(j).id;
                transaction.executeSql(selectProfileSystems, [folder_id], function (transaction, result) {
                  if (result.rows.length) {
                    resultObj = {folder: result.rows.item(0).folder_name, profiles: []};
                    for (i = 0; i < result.rows.length; i++) {
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
    },

    getAllWindowHardwares: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), i, AllWindowHardwares = [];
      db.transaction(function (transaction) {
        transaction.executeSql(selectWindowHardware, [], function (transaction, result) {
          if (result.rows.length) {
            for (i = 0; i < result.rows.length; i++) {
              AllWindowHardwares.push({
                id: result.rows.item(i).id,
                name: result.rows.item(i).name + "",
                shortName: result.rows.item(i).shortName + ""
              });
            }
            callback(new OkResult(AllWindowHardwares));
          } else {
            callback(new ErrorResult(1, 'No window_hardware in database!'));
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong with selection window_hardware_groups record'));
        });
      });
    },

    getAllTemplates: function (callback) {
      callback(new OkResult({
        templatesWindow: [
          {
            templateId: 1,
            templateSVG: 'img/windowConstruction.svg',
            templateUrl: '../img/templates/balcony.png',
            templateTitle: 'Окно',
            templateDescrip: 'т-образное, две створки',
            templateWidth: '1200',
            templateHeight: '1200'
          },
          {
            templateId: 2,
            templateSVG: 'img/doorConstruction.svg',
            templateUrl: '../img/templates/window.png',
            templateTitle: 'Окно',
            templateDescrip: 'т-образное, одна створка'
          },
          {
            templateId: 3,
            templateSVG: 'img/windowConstruction.svg',
            templateUrl: '../img/templates/window.png',
            templateTitle: 'Окно',
            templateDescrip: 'т-образное'
          },
          {
            templateId: 4,
            templateSVG: 'img/doorConstruction.svg',
            templateUrl: '../img/templates/window.png',
            templateTitle: 'Окно',
            templateDescrip: 'две створки'
          }
        ],
        templatesBalcony: [
          {
            templateId: 1,
            templateSVG: 'img/doorConstruction.svg',
            templateUrl: '../img/templates/balcony.png',
            templateTitle: 'Балкон',
            templateDescrip: '1 - 4 секционный',
            templateWidth: '1200',
            templateHeight: '1200'
          }
        ],
        templatesDoor: [
          {
            templateId: 1,
            templateSVG: 'img/doorConstruction.svg',
            templateUrl: '../img/templates/balcony.png',
            templateTitle: 'Дверь',
            templateDescrip: '1 - 4 секционный',
            templateWidth: '1200',
            templateHeight: '1200'
          }
        ]

      }));
    },

    getAllProfiles: function (callback) {
      callback(new OkResult({
        producers: [
          'Окошко',
          'Другие...'
        ],
        profiles: [
          [
            {
              profileId: 1,
              profileType: '3 камеры',
              profileDescrip: 'Окошко S50 Special S50 Special',
              profileCountry: 'Украина',
              profileHeat: 5,
              profileNoise: 4,
              profilePrice: 100
            },
            {
              profileId: 2,
              profileType: '3 камеры',
              profileDescrip: 'Окошко S50 Special',
              profileCountry: 'Украина',
              profileHeat: 2,
              profileNoise: 3,
              profilePrice: 200
            },
            {
              profileId: 3,
              profileType: '2 камеры',
              profileDescrip: 'Окошко S50',
              profileCountry: 'Украина',
              profileHeat: 1,
              profileNoise: 5,
              profilePrice: 300
            }
          ],
          [
            {
              profileId: 3,
              profileType: '1 камерa',
              profileDescrip: 'Окошко S50',
              profileCountry: 'Украина',
              profileHeat: 1,
              profileNoise: 5,
              profilePrice: 500
            }
          ]
        ]
      }));
    },

    getAllGlass: function (callback) {
      callback(new OkResult({
        glassTypes: [
          'Стандартные',
          'Зеркальные',
          'Матовые'
        ],
        glasses: [
          [
            {
              glassId: 1,
              glassName: '4/24/4/16/4i555555555',
              glassUrl: '../img/glass.png',
              glassDescrip: '3 камеры +энергосбережение',
              glassHeat: 5,
              glassNoise: 4,
              glassPrice: 100
            },
            {
              glassId: 2,
              glassName: '4/24/4',
              glassUrl: '../img/glass.png',
              glassDescrip: '3 камеры +энергосбережение',
              glassHeat: 2,
              glassNoise: 5,
              glassPrice: 200
            },
            {
              glassId: 3,
              glassName: '4/24/4/16/4i',
              glassUrl: '../img/glass.png',
              glassDescrip: '3 камеры +энергосбережение',
              glassHeat: 1,
              glassNoise: 1,
              glassPrice: 600
            }
          ],
          [
            {
              glassId: 1,
              glassName: '4/24/4/16/4i555555555',
              glassUrl: '../img/glass.png',
              glassDescrip: '3 камеры +энергосбережение',
              glassHeat: 5,
              glassNoise: 4,
              glassPrice: 100
            },
            {
              glassId: 2,
              glassName: '4/24/4/16/4i555555555',
              glassUrl: '../img/glass.png',
              glassDescrip: '3 камеры +энергосбережение',
              glassHeat: 3,
              glassNoise: 1,
              glassPrice: 800
            }
          ],
          [
            {
              glassId: 1,
              glassName: '4/24/4/16/4i555555555',
              glassUrl: '../img/glass.png',
              glassDescrip: '3 камеры +энергосбережение',
              glassHeat: 5,
              glassNoise: 4,
              glassPrice: 100
            }
          ]
        ]
      }));
    },

    getAllHardware: function (callback) {
      callback(new OkResult({
        producers: [
          'Аккадо',
          'Мако',
          'Другие...'
        ],
        hardwares: [
          [
            {
              hardwareId: 1,
              hardwareName: 'ACCADO 7mm',
              hardwareProducer: 'ACCADO',
              hardwareCountry: 'Турция',
              hardwareLogo: '../img/hardware-logos/accado.png',
              hardwareLink: '#',
              hardwareHeat: 5,
              hardwareNoise: 4,
              hardwarePrice: 100
            },
            {
              hardwareId: 2,
              hardwareName: 'ACCADO 7mm',
              hardwareProducer: 'ACCADO',
              hardwareCountry: 'Турция',
              hardwareLogo: '../img/hardware-logos/accado.png',
              hardwareLink: '#',
              hardwareHeat: 2,
              hardwareNoise: 5,
              hardwarePrice: 200
            }
          ],
          [
            {
              hardwareId: 1,
              hardwareName: 'ACCADO 7mm',
              hardwareProducer: 'Мако',
              hardwareCountry: 'Турция',
              hardwareLogo: '../img/hardware-logos/maco.png',
              hardwareLink: '#',
              hardwareHeat: 5,
              hardwareNoise: 4,
              hardwarePrice: 100
            },
            {
              hardwareId: 2,
              hardwareName: 'ACCADO 7mm',
              hardwareProducer: 'Мако',
              hardwareCountry: 'Турция',
              hardwareLogo: '../img/hardware-logos/maco.png',
              hardwareLink: '#',
              hardwareHeat: 3,
              hardwareNoise: 1,
              hardwarePrice: 800
            }
          ],
          [
            {
              hardwareId: 1,
              hardwareName: 'ACCADO 7mm',
              hardwareProducer: 'ACCADO',
              hardwareCountry: 'Турция',
              hardwareLogo: '../img/hardware-logos/siegenia.png',
              hardwareLink: '#',
              hardwareHeat: 5,
              hardwareNoise: 4,
              hardwarePrice: 900
            },
            {
              hardwareId: 2,
              hardwareName: 'ACCADO 7mm',
              hardwareProducer: 'ACCADO',
              hardwareCountry: 'Турция',
              hardwareLogo: '../img/hardware-logos/romb.png',
              hardwareLink: '#',
              hardwareHeat: 1,
              hardwareNoise: 1,
              hardwarePrice: 800
            }
          ]
        ]
      }));
    },

    getAllLamination: function (callback) {
      callback(new OkResult({
        laminationWhite: 'без ламинации',
        laminationInside: [
          {
            laminationId: 1,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 2,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 3,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 4,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 5,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 6,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 7,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          },
          {
            laminationId: 8,
            laminationName: 'светлый дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          }
        ],
        laminationOutside: [
          {
            laminationId: 1,
            laminationName: 'темный дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 400
          },
          {
            laminationId: 2,
            laminationName: 'темный дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 600
          },
          {
            laminationId: 3,
            laminationName: 'темный дуб',
            laminationUrl: '../img/lamination/Birch.png',
            laminationPrice: 100
          }
        ]
      }));
    },

    getFloorPrice: function (callback) {
      callback(new OkResult({

        floors: [
          {
            floor: 'самовывоз',
            price: ''
          },
          {
            floor: '1 этаж',
            price: '+100'
          },
          {
            floor: '2 этаж',
            price: '+200'
          },
          {
            floor: '3 этаж',
            price: '+300'
          },
          {
            floor: '4 этаж',
            price: '+400'
          },
          {
            floor: '5 этаж',
            price: '+500'
          }
        ]

      }));
    },

    getAssemblingPrice: function (callback) {
      callback(new OkResult({

        assembling: [
          {
            name: 'без монтажа',
            price: 'бесплатно'
          },
          {
            name: 'без демонтажа',
            price: '+200'
          },
          {
            name: 'стандартный',
            price: '+300'
          },
          {
            name: 'VIP-монтаж',
            price: '+400'
          }
        ]

      }));
    },

    getInstalment: function (callback) {
      callback(new OkResult({

        instalment: [
          {
            period: '',
            percent: '15%'
          },
          {
            period: '2 месяца',
            percent: '20%'
          },
          {
            period: '3 месяца',
            percent: '25%'
          },
          {
            period: '4 месяца',
            percent: '30%'
          },
          {
            period: '5 месяцeв',
            percent: '35%'
          }
        ]

      }));
    },

    getLocations: function (callback) {
      callback(new OkResult({

        locations: [
          {
            current: true,
            city: 'Днепропетровск'
          },
          {
            current: false,
            city: 'Ивано-Франковск'
          },
          {
            current: false,
            city: 'Кировоград'
          },
          {
            current: false,
            city: 'Львов'
          },
          {
            current: false,
            city: 'Владимир-Волынский'
          },
          {
            current: false,
            city: 'Корсунь-Шевченковский'
          },
          {
            current: false,
            city: 'Днепродзержинск'
          },
          {
            current: false,
            city: 'Каменец-Подольский'
          }
        ]

      }));
    },

    getDoorConfig: function (callback) {
      callback(new OkResult({

        doorType: [
          {
            shapeId: 1,
            shapeLabel: 'без порога',
            shapeIcon: '../img/door-config/no-doorstep.png',
            shapeIconSelect: '../img/door-config-selected/no-doorstep.png'
          },
          {
            shapeId: 2,
            shapeLabel: 'по периметру',
            shapeIcon: '../img/door-config/doorstep.png',
            shapeIconSelect: '../img/door-config-selected/doorstep.png'
          },
          {
            shapeId: 3,
            shapeLabel: 'алюминевый порог, тип1',
            shapeIcon: '../img/door-config/doorstep-al1.png',
            shapeIconSelect: '../img/door-config-selected/doorstep-al1.png'
          },
          {
            shapeId: 4,
            shapeLabel: 'алюминевый порог, тип2',
            shapeIcon: '../img/door-config/doorstep-al2.png',
            shapeIconSelect: '../img/door-config-selected/doorstep-al2.png'
          }
        ],

        sashType: [
          {
            shapeId: 1,
            shapeLabel: 'межкомнатная, 98мм'
          },
          {
            shapeId: 2,
            shapeLabel: 'дверная т-образная, 116мм'
          },
          {
            shapeId: 3,
            shapeLabel: 'оконная, 76мм'
          }
        ],

        handleType: [
          {
            shapeId: 1,
            shapeLabel: 'нажимной гарнитур',
            shapeIcon: '../img/door-config/lever-handle.png',
            shapeIconSelect: '../img/door-config-selected/lever-handle.png'
          },
          {
            shapeId: 2,
            shapeLabel: 'стандартная офисная ручка',
            shapeIcon: '../img/door-config/standart-handle.png',
            shapeIconSelect: '../img/door-config-selected/standart-handle.png'
          }
        ],

        lockType: [
          {
            shapeId: 1,
            shapeLabel: 'однозапорный с защелкой',
            shapeIcon: '../img/door-config/onelock.png',
            shapeIconSelect: '../img/door-config-selected/onelock.png'
          },
          {
            shapeId: 2,
            shapeLabel: 'многозапорный с защелкой',
            shapeIcon: '../img/door-config/multilock.png',
            shapeIconSelect: '../img/door-config-selected/multilock.png'
          }
        ]


      }));
    }

  }
});