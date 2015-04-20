(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .factory('constructService', constructionFactory);

  function constructionFactory($q) {

    // SQL requests for select data from tables
    var selectLaminations = "SELECT id, name FROM lamination_colors ORDER BY id",
      selectProfileSystemFolders = "SELECT id, name FROM profile_system_folders order by position",
      //selectProfileSystems = "SELECT profile_systems.id, profile_system_folders.name as folder_name, profile_systems.name, profile_systems.short_name, profile_systems.country FROM profile_systems LEFT JOIN profile_system_folders ON  profile_systems.profile_system_folder_id = profile_system_folders.id WHERE profile_system_folder_id = ? order by profile_systems.id", // position
      selectProfileSystems = "SELECT profile_systems.id, profile_system_folders.name as folder_name, profile_systems.name, profile_systems.short_name, profile_systems.country, rama_list_id, rama_still_list_id, stvorka_list_id, impost_list_id, shtulp_list_id FROM profile_systems LEFT JOIN profile_system_folders ON  profile_systems.profile_system_folder_id = profile_system_folders.id WHERE profile_system_folder_id = ? order by profile_systems.id",
      selectWindowHardware = "SELECT id, name, short_name as shortName FROM window_hardware_groups WHERE is_in_calculation = 1",
      selectSectionSize = "SELECT id, a, b, c, d FROM lists WHERE id = ?";

    return {

      getRoomInfo: function (callback) {
        callback(new OkResult({
          roomInfo: [
            {
              id: 1,
              name: 'Кухня',
              airCirculation: 90
            },
            {
              id: 2,
              name: 'Гостиная',
              airCirculation: 50
            },
            {
              id: 3,
              name: 'Балкон',
              airCirculation: 0
            },
            {
              id: 4,
              name: 'Детская',
              airCirculation: 30
            },
            {
              id: 5,
              name: 'Спальня',
              airCirculation: 40
            },
            {
              id: 6,
              name: 'Вход',
              current: false,
              airCirculation: 0
            }
          ]
        }));
      },

      getAllProfileSystems: function () {
        var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), AllProfileSystems = [], allFolders, count, folder_id, resultObj = {}, j, i;
        var deferred = $q.defer();
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
                      resultObj = {folder: result.rows.item(0).folder_name, profiles: [], rama: []};
                      for (i = 0; i < result.rows.length; i++) {
                        resultObj.profiles.push({
                          id: result.rows.item(i).id,
                          name: result.rows.item(i).name,
                          short_name: result.rows.item(i).short_name,
                          country: result.rows.item(i).country,
                          rama_id: result.rows.item(i).rama_list_id,
                          rama_still_id: result.rows.item(i).rama_still_list_id,
                          sash_id: result.rows.item(i).stvorka_list_id,
                          impost_id: result.rows.item(i).impost_list_id,
                          shtulp_id: result.rows.item(i).shtulp_list_id
                        });
                      }
                      AllProfileSystems.push(resultObj);
                      if (allFolders === count) {
                        deferred.resolve(AllProfileSystems);
                      }
                      count++;
                    } else {
                      deferred.reject('No ProfileSystems in database!');
                    }
                  }, function () {
                    deferred.reject('Something went wrong with selection profile_systems record');
                  });
                }
              });
            } else {
              deferred.reject('Something went wrong with selection profile_systems record');
            }
          }, function () {
            deferred.reject('Something went wrong with selection profile_systems record');
          });
        });
        return deferred.promise;
      },



      getAllProfileSizes: function (elementId) {
        var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), resultObj = {};
        var deferred = $q.defer();
        db.transaction(function (transaction) {
          transaction.executeSql(selectSectionSize, [elementId], function (transaction, result) {
            if (result.rows.length) {
              resultObj = {
                id: result.rows.item(0).id,
                a: result.rows.item(0).a,
                b: result.rows.item(0).b,
                c: result.rows.item(0).c,
                d: result.rows.item(0).d
              };
              deferred.resolve(resultObj);
            } else {
              resultObj = {};
              deferred.resolve(resultObj);
            }

          }, function () {
            deferred.reject('Something went wrong with selection profile_systems record');
          });
        });
        return deferred.promise;
      },



  /*
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
                        resultObj.profiles.push({
                          id: result.rows.item(i).id,
                          name: result.rows.item(i).name,
                          short_name: result.rows.item(i).short_name,
                          country: result.rows.item(i).country,
                          rama_id: result.rows.item(i).rama_list_id,
                          rama_still_id: result.rows.item(i).rama_still_list_id,
                          sash_id: result.rows.item(i).stvorka_list_id,
                          impost_id: result.rows.item(i).impost_list_id,
                          shtulp_id: result.rows.item(i).shtulp_list_id
                        });
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
  */

      getTemplateImgIcons: function (callback) {
        callback(new OkResult({
          templateImgs: [
            {
              id: 1,
              name: 'Одностворчатое',
              src: 'img/templates/1.png'
            },
            {
              id: 2,
              name: 'Одностворчатое',
              src: 'img/templates/1.png'
            },
            {
              id: 3,
              name: 'Двухстворчатое',
              src: 'img/templates/3.png'
            },
            {
              id: 4,
              name: 'Трехстворчатое',
              src: 'img/templates/4.png'
            },
            {
              id: 5,
              name: 'Двухстворчатое',
              src: 'img/templates/5.png'
            },
            {
              id: 6,
              name: 'Двухстворчатое',
              src: 'img/templates/6.png'
            },
            {
              id: 7,
              name: 'Двухстворчатое',
              src: 'img/templates/7.png'
            },
            {
              id: 8,
              name: 'Одностворчатое',
              src: 'img/templates/8.png'
            },
            {
              id: 9,
              name: 'Двухстворчатое',
              src: 'img/templates/9.png'
            },
            {
              id: 10,
              name: 'Трехстворчатое',
              src: 'img/templates/10.png'
            },
            {
              id: 11,
              name: 'Трехстворчатое',
              src: 'img/templates/11.png'
            },
            {
              id: 12,
              name: 'Трехстворчатое',
              src: 'img/templates/12.png'
            }
          ]
        }));
      },


      getDefaultConstructTemplate: function(callback) {
        callback(new OkResult({
          windows: [

            {
              'name': 'Одностворчатое',
              'objects': [
                //------- main points
                {'type': 'fixed_point', id: 'fp1', x:0, y:0},
                {'type': 'fixed_point', id: 'fp2', x:1300, y:0},
                {'type': 'fixed_point', id: 'fp3', x:1300, y:1400},
                {'type': 'fixed_point', id: 'fp4', x:0, y:1400},
                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                //----- glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            },
            {
              'name':'Одностворчатое',
              'objects':[
                //------- main points
                {'type':'fixed_point', id:'fp1', x:0, y:0},
                {'type':'fixed_point', id:'fp2', x:700, y:0},
                {'type':'fixed_point', id:'fp3', x:700, y:1400},
                {'type':'fixed_point', id:'fp4', x:0, y:1400},
                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
                //-------- sash
                {'type': 'cross_point_sash_out', id: 'cpsout1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point_sash_out', id: 'cpsout2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point_sash_out', id: 'cpsout3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point_sash_out', id: 'cpsout4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'sash_out_line', id: 'sashoutline1', from: 'cpsout4', to: 'cpsout1'},
                {'type': 'sash_out_line', id: 'sashoutline2', from: 'cpsout1', to: 'cpsout2'},
                {'type': 'sash_out_line', id: 'sashoutline3', from: 'cpsout2', to: 'cpsout3'},
                {'type': 'sash_out_line', id: 'sashoutline4', from: 'cpsout3', to: 'cpsout4'},

                {'type': 'cross_point_hardware', id: 'cphw1', line1: 'sashoutline1', line2: 'sashoutline2'},
                {'type': 'cross_point_hardware', id: 'cphw2', line1: 'sashoutline2', line2: 'sashoutline3'},
                {'type': 'cross_point_hardware', id: 'cphw3', line1: 'sashoutline3', line2: 'sashoutline4'},
                {'type': 'cross_point_hardware', id: 'cphw4', line1: 'sashoutline4', line2: 'sashoutline1'},
                {'type': 'hardware_line', id: 'hardwareline1', from: 'cphw4', to: 'cphw1'},
                {'type': 'hardware_line', id: 'hardwareline2', from: 'cphw1', to: 'cphw2'},
                {'type': 'hardware_line', id: 'hardwareline3', from: 'cphw2', to: 'cphw3'},
                {'type': 'hardware_line', id: 'hardwareline4', from: 'cphw3', to: 'cphw4'},

                {'type': 'cross_point_sash_in', id: 'cpsin1', line1: 'sashoutline1', line2: 'sashoutline2'},
                {'type': 'cross_point_sash_in', id: 'cpsin2', line1: 'sashoutline2', line2: 'sashoutline3'},
                {'type': 'cross_point_sash_in', id: 'cpsin3', line1: 'sashoutline3', line2: 'sashoutline4'},
                {'type': 'cross_point_sash_in', id: 'cpsin4', line1: 'sashoutline4', line2: 'sashoutline1'},
                {'type': 'sash_line', id: 'sashline1', from: 'cpsin4', to: 'cpsin1'},
                {'type': 'sash_line', id: 'sashline2', from: 'cpsin1', to: 'cpsin2'},
                {'type': 'sash_line', id: 'sashline3', from: 'cpsin2', to: 'cpsin3'},
                {'type': 'sash_line', id: 'sashline4', from: 'cpsin3', to: 'cpsin4'},
                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'frameline3', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'sash'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},
                //----- glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'frameline3', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'sash'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'sash', id: 'sash1', parts: ['sashoutline1', 'sashline1']},
                {'type': 'sash', id: 'sash2', parts: ['sashoutline2', 'sashline2'], openType: ['sashline2', 'sashline4']},
                {'type': 'sash', id: 'sash3', parts: ['sashoutline3', 'sashline3'], openType: ['sashline3', 'sashline1']},
                {'type': 'sash', id: 'sash4', parts: ['sashoutline4', 'sashline4']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'sash_block', id: 'sashBlock1', parts: ['hardwareline1', 'hardwareline2', 'hardwareline3', 'hardwareline4'], openDir: [1, 4], handlePos: 4},
                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            },
            {
              'name':'Двухстворчатое',
              'objects':[
                //------- main points
                {'type':'fixed_point', id:'fp1', x:0, y:0},
                {'type':'fixed_point', id:'fp2', x:1060, y:0},
                {'type':'fixed_point', id:'fp3', x:1060, y:1320},
                {'type':'fixed_point', id:'fp4', x:0, y:1320},
                {'type':'fixed_point_impost', id:'fpimpost1', x:530, y:0, dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost2', x:530, y:1320, dir:'vert'},
                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
                //-------- impost
                {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'sash'},
                {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
                {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},
                //-------- sash
                {'type': 'cross_point_sash_out', id: 'cpsout5', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point_sash_out', id: 'cpsout6', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point_sash_out', id: 'cpsout7', line1: 'frameline3', line2: 'impostcenterline2'},
                {'type': 'cross_point_sash_out', id: 'cpsout8', line1: 'impostcenterline2', line2: 'frameline1'},
                {'type': 'sash_out_line', id: 'sashoutline5', from: 'cpsout8', to: 'cpsout5'},
                {'type': 'sash_out_line', id: 'sashoutline6', from: 'cpsout5', to: 'cpsout6'},
                {'type': 'sash_out_line', id: 'sashoutline7', from: 'cpsout6', to: 'cpsout7'},
                {'type': 'sash_out_line', id: 'sashoutline8', from: 'cpsout7', to: 'cpsout8'},

                {'type': 'cross_point_hardware', id: 'cphw5', line1: 'sashoutline5', line2: 'sashoutline6'},
                {'type': 'cross_point_hardware', id: 'cphw6', line1: 'sashoutline6', line2: 'sashoutline7'},
                {'type': 'cross_point_hardware', id: 'cphw7', line1: 'sashoutline7', line2: 'sashoutline8'},
                {'type': 'cross_point_hardware', id: 'cphw8', line1: 'sashoutline8', line2: 'sashoutline5'},
                {'type': 'hardware_line', id: 'hardwareline5', from: 'cphw8', to: 'cphw5'},
                {'type': 'hardware_line', id: 'hardwareline6', from: 'cphw5', to: 'cphw6'},
                {'type': 'hardware_line', id: 'hardwareline7', from: 'cphw6', to: 'cphw7'},
                {'type': 'hardware_line', id: 'hardwareline8', from: 'cphw7', to: 'cphw8'},

                {'type': 'cross_point_sash_in', id: 'cpsin5', line1: 'sashoutline5', line2: 'sashoutline6'},
                {'type': 'cross_point_sash_in', id: 'cpsin6', line1: 'sashoutline6', line2: 'sashoutline7'},
                {'type': 'cross_point_sash_in', id: 'cpsin7', line1: 'sashoutline7', line2: 'sashoutline8'},
                {'type': 'cross_point_sash_in', id: 'cpsin8', line1: 'sashoutline8', line2: 'sashoutline5'},
                {'type': 'sash_line', id: 'sashline5', from: 'cpsin8', to: 'cpsin5'},
                {'type': 'sash_line', id: 'sashline6', from: 'cpsin5', to: 'cpsin6'},
                {'type': 'sash_line', id: 'sashline7', from: 'cpsin6', to: 'cpsin7'},
                {'type': 'sash_line', id: 'sashline8', from: 'cpsin7', to: 'cpsin8'},
                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'frameline1', line2: 'frameline2', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'frameline2', line2: 'frameline3', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'sash'},
                {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
                {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
                {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
                {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
                {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
                {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
                {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
                {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
                {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
                {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
                {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
                {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

                //----- left glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
                //----- right glass
                {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameline1', line2: 'frameline2', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg6', line1: 'frameline2', line2: 'frameline3', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'sash'},
                {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
                {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
                {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
                {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
                {'type': 'sash', id: 'sash5', parts: ['sashoutline5', 'sashline5']},
                {'type': 'sash', id: 'sash6', parts: ['sashoutline6', 'sashline6'], openType: ['sashline6', 'sashline8']},
                {'type': 'sash', id: 'sash7', parts: ['sashoutline7', 'sashline7'], openType: ['sashline7', 'sashline5']},
                {'type': 'sash', id: 'sash8', parts: ['sashoutline8', 'sashline8']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
                {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
                {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
                {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

                {'type': 'sash_block', id: 'sashBlock2', parts: ['hardwareline5', 'hardwareline6', 'hardwareline7', 'hardwareline8'], openDir: [1, 4], handlePos: 4},
                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
                {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1'], level: 3, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            },
            {
              'name':'Трехстворчатое',
              'objects':[
                //------- main points
                {'type':'fixed_point', id:'fp1', x:0, y:0},
                {'type':'fixed_point', id:'fp2', x:2100, y:0},
                {'type':'fixed_point', id:'fp3', x:2100, y:1400},
                {'type':'fixed_point', id:'fp4', x:0, y:1400},
                {'type':'fixed_point_impost', id:'fpimpost1', x:700, y:0, dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost2', x:700, y:1400, dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost3', x:1400, y:0, dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost4', x:1400, y:1400, dir:'vert'},

  /*
                {'type': 'skylight', id: 'main_block_1', level: 0, points: ['fp1', 'fp2', 'fp3', 'fp4'], blockType: 'frame', insideBlocks: ['light_block_1', 'light_block_2', 'light_block_3']},

                {'type': 'skylight', id: 'light_block_1', level: 1, points: ['fp1', 'fpimpost1', 'fpimpost2', 'fp4'], blockType: 'sash', openDir: [1, 4], handlePos: 4, insideBlocks: ['light_block_4', 'light_block_5']},
                {'type': 'skylight', id: 'light_block_2', level: 1, points: ['fpimpost1', 'fpimpost3', 'fpimpost4', 'fpimpost1'], blockType: 'frame', insideBlocks: []},
                {'type': 'skylight', id: 'light_block_3', level: 1, points: ['fpimpost3', 'fp2', 'fp3', 'fpimpost4'], blockType: 'frame', insideBlocks: []},

                {'type': 'skylight', id: 'light_block_4', level: 2, parentBlock: 'light_block_1', points: ['fp1', 'fpimpost1', 'fpimpost5', 'fpimpost6'], blockType: 'frame', insideBlocks: []},
                {'type': 'skylight', id: 'light_block_5', level: 2, parentBlock: 'light_block_1', points: ['fpimpost5', 'fpimpost6', 'fpimpost2', 'fp4'], blockType: 'frame', insideBlocks: []},
  */
                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
                //-------- impost
                {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'sash'},
                {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'sash'},
                {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},

                {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'frameline1', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
                {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},
                {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
                {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},
                //-------- sash
                {'type': 'cross_point_sash_out', id: 'cpsout5', line1: 'frameline1', line2: 'impostcenterline3'},
                {'type': 'cross_point_sash_out', id: 'cpsout6', line1: 'impostcenterline3', line2: 'frameline3'},
                {'type': 'cross_point_sash_out', id: 'cpsout7', line1: 'frameline3', line2: 'impostcenterline2'},
                {'type': 'cross_point_sash_out', id: 'cpsout8', line1: 'impostcenterline2', line2: 'frameline1'},
                {'type': 'sash_out_line', id: 'sashoutline5', from: 'cpsout8', to: 'cpsout5'},
                {'type': 'sash_out_line', id: 'sashoutline6', from: 'cpsout5', to: 'cpsout6'},
                {'type': 'sash_out_line', id: 'sashoutline7', from: 'cpsout6', to: 'cpsout7'},
                {'type': 'sash_out_line', id: 'sashoutline8', from: 'cpsout7', to: 'cpsout8'},

                {'type': 'cross_point_hardware', id: 'cphw5', line1: 'sashoutline5', line2: 'sashoutline6'},
                {'type': 'cross_point_hardware', id: 'cphw6', line1: 'sashoutline6', line2: 'sashoutline7'},
                {'type': 'cross_point_hardware', id: 'cphw7', line1: 'sashoutline7', line2: 'sashoutline8'},
                {'type': 'cross_point_hardware', id: 'cphw8', line1: 'sashoutline8', line2: 'sashoutline5'},
                {'type': 'hardware_line', id: 'hardwareline5', from: 'cphw8', to: 'cphw5'},
                {'type': 'hardware_line', id: 'hardwareline6', from: 'cphw5', to: 'cphw6'},
                {'type': 'hardware_line', id: 'hardwareline7', from: 'cphw6', to: 'cphw7'},
                {'type': 'hardware_line', id: 'hardwareline8', from: 'cphw7', to: 'cphw8'},

                {'type': 'cross_point_sash_in', id: 'cpsin5', line1: 'sashoutline5', line2: 'sashoutline6'},
                {'type': 'cross_point_sash_in', id: 'cpsin6', line1: 'sashoutline6', line2: 'sashoutline7'},
                {'type': 'cross_point_sash_in', id: 'cpsin7', line1: 'sashoutline7', line2: 'sashoutline8'},
                {'type': 'cross_point_sash_in', id: 'cpsin8', line1: 'sashoutline8', line2: 'sashoutline5'},
                {'type': 'sash_line', id: 'sashline5', from: 'cpsin8', to: 'cpsin5'},
                {'type': 'sash_line', id: 'sashline6', from: 'cpsin5', to: 'cpsin6'},
                {'type': 'sash_line', id: 'sashline7', from: 'cpsin6', to: 'cpsin7'},
                {'type': 'sash_line', id: 'sashline8', from: 'cpsin7', to: 'cpsin8'},

                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'frameline1', line2: 'impostcenterline3', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'sash'},
                {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
                {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
                {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
                {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
                {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
                {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
                {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
                {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
                {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
                {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
                {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
                {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
                {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
                {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
                {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
                {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
                {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
                {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
                {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
                {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
                {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
                {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
                {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

                //---- left glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
                //----- center glass
                {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameline1', line2: 'impostcenterline3', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'sash'},
                {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
                {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
                {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
                {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
                //------ right glass
                {'type': 'cross_point_glass', id: 'cpg9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
                {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
                {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
                {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},
                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
                {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},
                {'type': 'sash', id: 'sash5', parts: ['sashoutline5', 'sashline5']},
                {'type': 'sash', id: 'sash6', parts: ['sashoutline6', 'sashline6'], openType: ['sashline6', 'sashline8']},
                {'type': 'sash', id: 'sash7', parts: ['sashoutline7', 'sashline7'], openType: ['sashline7', 'sashline5']},
                {'type': 'sash', id: 'sash8', parts: ['sashoutline8', 'sashline8']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
                {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
                {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
                {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

                {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
                {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
                {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
                {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

                {'type': 'sash_block', id: 'sashBlock2', parts: ['hardwareline5', 'hardwareline6', 'hardwareline7', 'hardwareline8'], openDir: [1, 4], handlePos: 4},
                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
                {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},

                {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH', 'dimH3'], links: ['fpimpost1', 'fpimpost2'], level: 1, side: 'top'},
                {'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost1', 'fpimpost2'], to: ['fpimpost3', 'fpimpost4'], limits: ['overallDimH', 'dimH1'], links: ['fpimpost3', 'fpimpost4'], level: 1, side: 'top'},
                {'type': 'dimensionsH', id: 'dimH3', from: ['fpimpost3', 'fpimpost4'], to: ['fp2', 'fp3'], level: 1, side: 'top'},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1', 'dimH2'], level: 3, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            },
            {
              'name':'Двухстворчатое',
              'objects':[
                //------- main points
                {'type':'fixed_point', id:'fp1', x:0, y: 0},
                {'type':'fixed_point', id:'fp2', x:1060, y:0},
                {'type':'fixed_point', id:'fp3', x:1060, y:1320},
                {'type':'fixed_point', id:'fp4', x:0, y:1320},
                {'type':'fixed_point_impost', id:'fpimpost1', x:530, y:0, dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost2', x:530, y:1320, dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost3', x:1060, y:300, dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost4', x:0, y:300, dir:'hor'},
                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
                //-------- impost
                {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
                {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

                {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline1', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline4', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
                {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline1', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline4', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
                {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
                {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
                {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
                {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
                {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
                {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
                {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
                {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
                {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
                {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
                {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
                {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
                {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
                {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
                {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
                {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
                {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
                {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
                {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
                {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
                {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
                {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

                //----- left glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline1', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},

                {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline4', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
                {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
                {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
                {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
                //----- right glass
                {'type': 'cross_point_glass', id: 'cpg9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
                {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
                {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
                {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},
                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
                {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
                {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
                {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
                {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

                {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
                {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
                {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
                {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
                {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
                {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'dimV1', from: ['fp1', 'fp2'], to: ['fpimpost4', 'fpimpost3'], limits: ['overallDimV'], level: 1, height: 150, side: 'left'},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1'], level: 3, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 2, height: 150, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            },
            {
              'name':'Двухстворчатое',
              'objects':[
                //------- main points
                {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
                {'type':'fixed_point', id:'fp2', x:'1060', y:'0'},
                {'type':'fixed_point', id:'fp3', x:'1060', y:'1320'},
                {'type':'fixed_point', id:'fp4', x:'0', y:'1320'},
                {'type':'fixed_point_impost', id:'fpimpost1', x:'530', y:'0', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost2', x:'530', y:'1320', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost3', x:'1060', y:'300', dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost4', x:'0', y:'300', dir:'hor'},
                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
                //-------- impost
                {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
                {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

                {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'frameline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'impostcenterline2', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
                {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'frameline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'impostcenterline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
                {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
                {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
                {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
                {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
                {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
                {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
                {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
                {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
                {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
                {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
                {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'impostcenterline4', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline2', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
                {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
                {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
                {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
                {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
                {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
                {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
                {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
                {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
                {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
                {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
                {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

                //----- left glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
                //----- right glass
                {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg6', line1: 'frameline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg7', line1: 'impostcenterline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
                {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
                {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
                {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},

                {'type': 'cross_point_glass', id: 'cpg9', line1: 'impostcenterline4', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline2', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
                {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
                {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
                {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},
                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
                {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
                {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
                {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
                {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

                {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
                {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
                {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
                {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
                {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
                {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'dimV1', from: ['fp2', 'fp1'], to: ['fpimpost3', 'fpimpost4'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1'], links: ['fpimpost3'], level: 3, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 1, height: 150, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            },
            {
              'name':'Двухстворчатое',
              'objects':[
                //------- main points
                {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
                {'type':'fixed_point', id:'fp2', x:'1060', y:'0'},
                {'type':'fixed_point', id:'fp3', x:'1060', y:'1320'},
                {'type':'fixed_point', id:'fp4', x:'0', y:'1320'},
                {'type':'fixed_point_impost', id:'fpimpost1', x:'530', y:'0', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost2', x:'530', y:'1320', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost3', x:'1060', y:'300', dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost4', x:'0', y:'300', dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost5', x:'1060', y:'300', dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost6', x:'0', y:'300', dir:'hor'},
                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
                //-------- impost
                {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
                {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

                {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline1', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline4', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
                {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

                {'type': 'impost_line', id: 'impostcenterline5', from: 'fpimpost5', to: 'fpimpost6', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline6', from: 'fpimpost6', to: 'fpimpost5', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost9', line1: 'frameline2', line2: 'impostcenterline5', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost10', line1: 'impostcenterline6', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost11', line1: 'impostcenterline2', line2: 'impostcenterline6', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost12', line1: 'impostcenterline5', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline5', from: 'cpimpost9', to: 'cpimpost12'},
                {'type': 'impost_in_line', id: 'impostinline6', from: 'cpimpost11', to: 'cpimpost10'},

                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline1', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline4', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
                {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
                {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
                {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
                {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
                {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
                {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
                {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
                {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
                {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
                {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
                {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'frameline2', line2: 'impostcenterline5', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'impostcenterline5', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
                {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
                {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
                {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
                {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
                {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
                {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
                {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
                {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
                {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
                {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
                {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout13', line1: 'impostcenterline6', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout15', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout16', line1: 'impostcenterline2', line2: 'impostcenterline6', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline13', from:'cpbeadout16', to:'cpbeadout13'},
                {'type': 'bead_line', id:'beadline14', from:'cpbeadout13', to:'cpbeadout14'},
                {'type': 'bead_line', id:'beadline15', from:'cpbeadout14', to:'cpbeadout15'},
                {'type': 'bead_line', id:'beadline16', from:'cpbeadout15', to:'cpbeadout16'},
                {'type': 'cross_point_bead', id: 'cpbead13', line1: 'beadline13', line2: 'beadline14'},
                {'type': 'cross_point_bead', id: 'cpbead14', line1: 'beadline14', line2: 'beadline15'},
                {'type': 'cross_point_bead', id: 'cpbead15', line1: 'beadline15', line2: 'beadline16'},
                {'type': 'cross_point_bead', id: 'cpbead16', line1: 'beadline16', line2: 'beadline13'},
                {'type': 'bead_in_line', id:'beadinline13', from:'cpbead16', to:'cpbead13'},
                {'type': 'bead_in_line', id:'beadinline14', from:'cpbead13', to:'cpbead14'},
                {'type': 'bead_in_line', id:'beadinline15', from:'cpbead14', to:'cpbead15'},
                {'type': 'bead_in_line', id:'beadinline16', from:'cpbead15', to:'cpbead16'},


                //----- left glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline1', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},

                {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline4', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg6', line1: 'frameline3', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
                {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
                {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
                {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
                //----- right glass
                {'type': 'cross_point_glass', id: 'cpg9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'impostcenterline5', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg11', line1: 'impostcenterline5', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
                {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
                {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
                {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},

                {'type': 'cross_point_glass', id: 'cpg13', line1: 'frameline2', line2: 'impostcenterline6', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg15', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg16', line1: 'impostcenterline2', line2: 'impostcenterline6', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline13', from: 'cpg16', to: 'cpg13'},
                {'type': 'glass_line', id: 'glassline14', from: 'cpg13', to: 'cpg14'},
                {'type': 'glass_line', id: 'glassline15', from: 'cpg14', to: 'cpg15'},
                {'type': 'glass_line', id: 'glassline16', from: 'cpg15', to: 'cpg16'},

                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
                {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},
                {'type': 'impost', id: 'impost3', parts: ['impostinline5', 'impostinline6']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
                {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
                {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
                {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

                {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
                {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
                {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
                {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

                {'type': 'bead_box', id:'bead13', parts: ['beadline13', 'beadinline13']},
                {'type': 'bead_box', id:'bead14', parts: ['beadline14', 'beadinline14']},
                {'type': 'bead_box', id:'bead15', parts: ['beadline15', 'beadinline15']},
                {'type': 'bead_box', id:'bead16', parts: ['beadline16', 'beadinline16']},

                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
                {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
                {'type': 'glass_paсkage', id: 'glass4', parts: ['glassline13', 'glassline14', 'glassline15', 'glassline16']},
                {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'dimV1', from: ['fp1', 'fp2'], to: ['fpimpost4', 'fpimpost3'], limits: ['overallDimV'], level: 1, height: 150, side: 'left'},
                {'type': 'dimensionsV', id: 'dimV2', from: ['fp2', 'fp1'], to: ['fpimpost5', 'fpimpost6'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1'], links: ['fpimpost5'], level: 3, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1', 'dimV2'], level: 2, height: 150, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            },
            {
              'name':'Одностворчатое',
              'objects':[
                //------- main points
                {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
                {'type':'fixed_point', id:'fp2', x:'1060', y:'0'},
                {'type':'fixed_point', id:'fp3', x:'1060', y:'1320'},
                {'type':'fixed_point', id:'fp4', x:'0', y:'1320'},
                {'type':'fixed_point_impost', id:'fpimpost1', x:'1060', y:'300', dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost2', x:'0', y:'300', dir:'hor'},

                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
                //-------- impost
                {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
                {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
                {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
                {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
                {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
                {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
                {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
                {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
                {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
                {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
                {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
                {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
                {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

                //----- top glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
                //----- down glass
                {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg6', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
                {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
                {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
                {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},

                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
                {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
                {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
                {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
                {'type': 'dimensionsV', id: 'dimV1', from: ['fp2', 'fp1'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], links: ['fpimpost1'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 1, height: 150, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            },
            {
              'name':'Трехстворчатое',
              'objects':[
                //------- main points
                {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
                {'type':'fixed_point', id:'fp2', x:'1060', y:'0'},
                {'type':'fixed_point', id:'fp3', x:'1060', y:'1320'},
                {'type':'fixed_point', id:'fp4', x:'0', y:'1320'},
                {'type':'fixed_point_impost', id:'fpimpost1', x:'1060', y:'300', dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost2', x:'0', y:'300', dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost3', x:'530', y:'0', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost4', x:'530', y:'1320', dir:'vert'},

                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
                //-------- impost
                {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
                {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

                {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
                {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
                {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
                {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
                {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
                {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
                {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
                {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
                {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
                {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
                {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
                {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
                {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
                {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
                {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
                {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
                {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
                {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
                {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
                {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
                {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
                {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
                {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
                {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},


                //----- top glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
                //----- down glass
                {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
                {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
                {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
                {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},

                {'type': 'cross_point_glass', id: 'cpg9', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
                {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
                {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
                {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},

                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
                {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
                {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
                {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
                {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

                {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
                {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
                {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
                {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
                {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
                {'type': 'dimensionsH', id: 'dimH1', from: ['fp4', 'fp1'], to: ['fpimpost4', 'fpimpost3'], limits: ['overallDimH'], level: 1, height: 150, side: 'bottom'},
                {'type': 'dimensionsV', id: 'dimV1', from: ['fp2', 'fp1'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1'], links: ['fpimpost1'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 1, height: 150, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            },
            {
              'name':'Трехстворчатое',
              'objects':[
                //------- main points
                {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
                {'type':'fixed_point', id:'fp2', x:'2100', y:'0'},
                {'type':'fixed_point', id:'fp3', x:'2100', y:'1400'},
                {'type':'fixed_point', id:'fp4', x:'0', y:'1400'},
                {'type':'fixed_point_impost', id:'fpimpost1', x:'2100', y:'300', dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost2', x:'0', y:'300', dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost3', x:'700', y:'0', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost4', x:'700', y:'1400', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost5', x:'1400', y:'0', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost6', x:'1400', y:'1400', dir:'vert'},

                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
                //-------- impost
                {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
                {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

                {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
                {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

                {'type': 'impost_line', id: 'impostcenterline5', from: 'fpimpost5', to: 'fpimpost6', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline6', from: 'fpimpost6', to: 'fpimpost5', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost10', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost11', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost12', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline5', from: 'cpimpost9', to: 'cpimpost12'},
                {'type': 'impost_in_line', id: 'impostinline6', from: 'cpimpost11', to: 'cpimpost10'},

                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
                {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
                {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
                {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
                {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
                {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
                {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
                {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
                {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
                {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
                {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
                {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
                {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
                {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
                {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
                {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
                {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
                {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
                {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
                {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
                {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
                {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
                {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout13', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout15', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout16', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline13', from:'cpbeadout16', to:'cpbeadout13'},
                {'type': 'bead_line', id:'beadline14', from:'cpbeadout13', to:'cpbeadout14'},
                {'type': 'bead_line', id:'beadline15', from:'cpbeadout14', to:'cpbeadout15'},
                {'type': 'bead_line', id:'beadline16', from:'cpbeadout15', to:'cpbeadout16'},
                {'type': 'cross_point_bead', id: 'cpbead13', line1: 'beadline13', line2: 'beadline14'},
                {'type': 'cross_point_bead', id: 'cpbead14', line1: 'beadline14', line2: 'beadline15'},
                {'type': 'cross_point_bead', id: 'cpbead15', line1: 'beadline15', line2: 'beadline16'},
                {'type': 'cross_point_bead', id: 'cpbead16', line1: 'beadline16', line2: 'beadline13'},
                {'type': 'bead_in_line', id:'beadinline13', from:'cpbead16', to:'cpbead13'},
                {'type': 'bead_in_line', id:'beadinline14', from:'cpbead13', to:'cpbead14'},
                {'type': 'bead_in_line', id:'beadinline15', from:'cpbead14', to:'cpbead15'},
                {'type': 'bead_in_line', id:'beadinline16', from:'cpbead15', to:'cpbead16'},

                //----- top glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
                //----- down glass
                {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
                {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
                {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
                {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},

                {'type': 'cross_point_glass', id: 'cpg9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg10', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
                {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
                {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
                {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},

                {'type': 'cross_point_glass', id: 'cpg13', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg15', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg16', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline13', from: 'cpg16', to: 'cpg13'},
                {'type': 'glass_line', id: 'glassline14', from: 'cpg13', to: 'cpg14'},
                {'type': 'glass_line', id: 'glassline15', from: 'cpg14', to: 'cpg15'},
                {'type': 'glass_line', id: 'glassline16', from: 'cpg15', to: 'cpg16'},

                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
                {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},
                {'type': 'impost', id: 'impost3', parts: ['impostinline5', 'impostinline6']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
                {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
                {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
                {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

                {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
                {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
                {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
                {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

                {'type': 'bead_box', id:'bead13', parts: ['beadline13', 'beadinline13']},
                {'type': 'bead_box', id:'bead14', parts: ['beadline14', 'beadinline14']},
                {'type': 'bead_box', id:'bead15', parts: ['beadline15', 'beadinline15']},
                {'type': 'bead_box', id:'bead16', parts: ['beadline16', 'beadinline16']},

                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
                {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
                {'type': 'glass_paсkage', id: 'glass4', parts: ['glassline13', 'glassline14', 'glassline15', 'glassline16']},
                {'type': 'dimensionsH', id: 'dimH1', from: ['fp4', 'fp1'], to: ['fpimpost4', 'fpimpost3'], limits: ['overallDimH', 'dimH3'], links: ['fpimpost4', 'fpimpost3'], level: 1, height: 150, side: 'bottom'},
                {'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost4', 'fpimpost3'], to: ['fpimpost6', 'fpimpost5'], limits: ['overallDimH', 'dimH1'], links: ['fpimpost6', 'fpimpost5'], level: 1, height: 150, side: 'bottom'},
                {'type': 'dimensionsH', id: 'dimH3', from: ['fpimpost6', 'fpimpost5'], to: ['fp3', 'fp2'], level: 1, height: 150, side: 'bottom'},
                {'type': 'dimensionsV', id: 'dimV1', from: ['fp2', 'fp1'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1', 'dimH2'], links: ['fpimpost1'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 1, height: 150, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            },
            {
              'name':'Трехстворчатое',
              'objects':[
                //------- main points
                {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
                {'type':'fixed_point', id:'fp2', x:'2100', y:'0'},
                {'type':'fixed_point', id:'fp3', x:'2100', y:'1400'},
                {'type':'fixed_point', id:'fp4', x:'0', y:'1400'},
                {'type':'fixed_point_impost', id:'fpimpost1', x:'2100', y:'300', dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost2', x:'0', y:'300', dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost3', x:'700', y:'0', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost4', x:'700', y:'1400', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost5', x:'1400', y:'0', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost6', x:'1400', y:'1400', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost7', x:'1050', y:'0', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost8', x:'1050', y:'1400', dir:'vert'},

                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
                //-------- impost
                {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
                {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

                {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
                {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

                {'type': 'impost_line', id: 'impostcenterline5', from: 'fpimpost5', to: 'fpimpost6', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline6', from: 'fpimpost6', to: 'fpimpost5', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost10', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost11', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost12', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline5', from: 'cpimpost9', to: 'cpimpost12'},
                {'type': 'impost_in_line', id: 'impostinline6', from: 'cpimpost11', to: 'cpimpost10'},

                {'type': 'impost_line', id: 'impostcenterline7', from: 'fpimpost7', to: 'fpimpost8', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline8', from: 'fpimpost8', to: 'fpimpost7', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost13', line1: 'frameline1', line2: 'impostcenterline7', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost14', line1: 'impostcenterline8', line2: 'frameline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost15', line1: 'impostcenterline1', line2: 'impostcenterline8', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost16', line1: 'impostcenterline7', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline7', from: 'cpimpost13', to: 'cpimpost16'},
                {'type': 'impost_in_line', id: 'impostinline8', from: 'cpimpost15', to: 'cpimpost14'},

                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline7', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline7', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
                {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
                {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
                {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
                {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
                {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
                {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
                {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
                {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
                {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
                {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
                {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
                {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
                {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
                {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
                {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
                {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
                {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
                {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
                {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
                {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
                {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
                {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout13', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout15', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout16', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline13', from:'cpbeadout16', to:'cpbeadout13'},
                {'type': 'bead_line', id:'beadline14', from:'cpbeadout13', to:'cpbeadout14'},
                {'type': 'bead_line', id:'beadline15', from:'cpbeadout14', to:'cpbeadout15'},
                {'type': 'bead_line', id:'beadline16', from:'cpbeadout15', to:'cpbeadout16'},
                {'type': 'cross_point_bead', id: 'cpbead13', line1: 'beadline13', line2: 'beadline14'},
                {'type': 'cross_point_bead', id: 'cpbead14', line1: 'beadline14', line2: 'beadline15'},
                {'type': 'cross_point_bead', id: 'cpbead15', line1: 'beadline15', line2: 'beadline16'},
                {'type': 'cross_point_bead', id: 'cpbead16', line1: 'beadline16', line2: 'beadline13'},
                {'type': 'bead_in_line', id:'beadinline13', from:'cpbead16', to:'cpbead13'},
                {'type': 'bead_in_line', id:'beadinline14', from:'cpbead13', to:'cpbead14'},
                {'type': 'bead_in_line', id:'beadinline15', from:'cpbead14', to:'cpbead15'},
                {'type': 'bead_in_line', id:'beadinline16', from:'cpbead15', to:'cpbead16'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout17', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout18', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout19', line1: 'impostcenterline1', line2: 'impostcenterline8', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout20', line1: 'impostcenterline8', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline17', from:'cpbeadout20', to:'cpbeadout17'},
                {'type': 'bead_line', id:'beadline18', from:'cpbeadout17', to:'cpbeadout18'},
                {'type': 'bead_line', id:'beadline19', from:'cpbeadout18', to:'cpbeadout19'},
                {'type': 'bead_line', id:'beadline20', from:'cpbeadout19', to:'cpbeadout20'},
                {'type': 'cross_point_bead', id: 'cpbead17', line1: 'beadline17', line2: 'beadline18'},
                {'type': 'cross_point_bead', id: 'cpbead18', line1: 'beadline18', line2: 'beadline19'},
                {'type': 'cross_point_bead', id: 'cpbead19', line1: 'beadline19', line2: 'beadline20'},
                {'type': 'cross_point_bead', id: 'cpbead20', line1: 'beadline20', line2: 'beadline17'},
                {'type': 'bead_in_line', id:'beadinline17', from:'cpbead20', to:'cpbead17'},
                {'type': 'bead_in_line', id:'beadinline18', from:'cpbead17', to:'cpbead18'},
                {'type': 'bead_in_line', id:'beadinline19', from:'cpbead18', to:'cpbead19'},
                {'type': 'bead_in_line', id:'beadinline20', from:'cpbead19', to:'cpbead20'},

                //----- top glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline7', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline7', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
                //----- down glass
                {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
                {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
                {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
                {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},

                {'type': 'cross_point_glass', id: 'cpg9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg10', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
                {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
                {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
                {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},

                {'type': 'cross_point_glass', id: 'cpg13', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg15', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg16', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline13', from: 'cpg16', to: 'cpg13'},
                {'type': 'glass_line', id: 'glassline14', from: 'cpg13', to: 'cpg14'},
                {'type': 'glass_line', id: 'glassline15', from: 'cpg14', to: 'cpg15'},
                {'type': 'glass_line', id: 'glassline16', from: 'cpg15', to: 'cpg16'},
                //------ top left glass
                {'type': 'cross_point_glass', id: 'cpg17', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg18', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg19', line1: 'impostcenterline1', line2: 'impostcenterline8', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg20', line1: 'impostcenterline8', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline17', from: 'cpg20', to: 'cpg17'},
                {'type': 'glass_line', id: 'glassline18', from: 'cpg17', to: 'cpg18'},
                {'type': 'glass_line', id: 'glassline19', from: 'cpg18', to: 'cpg19'},
                {'type': 'glass_line', id: 'glassline20', from: 'cpg19', to: 'cpg20'},

                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
                {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},
                {'type': 'impost', id: 'impost3', parts: ['impostinline5', 'impostinline6']},
                {'type': 'impost', id: 'impost4', parts: ['impostinline7', 'impostinline8']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
                {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
                {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
                {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

                {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
                {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
                {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
                {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

                {'type': 'bead_box', id:'bead13', parts: ['beadline13', 'beadinline13']},
                {'type': 'bead_box', id:'bead14', parts: ['beadline14', 'beadinline14']},
                {'type': 'bead_box', id:'bead15', parts: ['beadline15', 'beadinline15']},
                {'type': 'bead_box', id:'bead16', parts: ['beadline16', 'beadinline16']},

                {'type': 'bead_box', id:'bead17', parts: ['beadline17', 'beadinline17']},
                {'type': 'bead_box', id:'bead18', parts: ['beadline18', 'beadinline18']},
                {'type': 'bead_box', id:'bead19', parts: ['beadline19', 'beadinline19']},
                {'type': 'bead_box', id:'bead20', parts: ['beadline20', 'beadinline20']},

                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
                {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
                {'type': 'glass_paсkage', id: 'glass4', parts: ['glassline13', 'glassline14', 'glassline15', 'glassline16']},
                {'type': 'glass_paсkage', id: 'glass5', parts: ['glassline17', 'glassline18', 'glassline19', 'glassline20']},
                {'type': 'dimensionsH', id: 'dimH1', from: ['fp4', 'fp1'], to: ['fpimpost4', 'fpimpost3'], limits: ['overallDimH', 'dimH3'], links: ['fpimpost4', 'fpimpost3'], level: 1, height: 150, side: 'bottom'},
                {'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost4', 'fpimpost3'], to: ['fpimpost6', 'fpimpost5'], limits: ['overallDimH', 'dimH1'], links: ['fpimpost6', 'fpimpost5'], level: 1, height: 150, side: 'bottom'},
                {'type': 'dimensionsH', id: 'dimH3', from: ['fpimpost6', 'fpimpost5'], to: ['fp3', 'fp2'], level: 1, height: 150, side: 'bottom'},
                {'type': 'dimensionsH', id: 'dimH4', from: ['fp1', 'fp4'], to: ['fpimpost7', 'fpimpost8'], limits: ['overallDimH'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'dimV1', from: ['fp2', 'fp1'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1', 'dimH2', 'dimH4'], links: ['fpimpost1'], level: 3, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 1, height: 150, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            },
            {
              'name':'Трехстворчатое',
              'objects':[
                //------- main points
                {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
                {'type':'fixed_point', id:'fp2', x:'2100', y:'0'},
                {'type':'fixed_point', id:'fp3', x:'2100', y:'1400'},
                {'type':'fixed_point', id:'fp4', x:'0', y:'1400'},
                {'type':'fixed_point_impost', id:'fpimpost1', x:'2100', y:'300', dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost2', x:'0', y:'300', dir:'hor'},
                {'type':'fixed_point_impost', id:'fpimpost3', x:'700', y:'0', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost4', x:'700', y:'1400', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost5', x:'1400', y:'0', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost6', x:'1400', y:'1400', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost7', x:'700', y:'0', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost8', x:'700', y:'1400', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost9', x:'1400', y:'0', dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost10', x:'1400', y:'1400', dir:'vert'},

                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
                //-------- impost
                {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
                {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},

                {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
                {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},

                {'type': 'impost_line', id: 'impostcenterline5', from: 'fpimpost5', to: 'fpimpost6', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline6', from: 'fpimpost6', to: 'fpimpost5', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost10', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost11', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost12', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline5', from: 'cpimpost9', to: 'cpimpost12'},
                {'type': 'impost_in_line', id: 'impostinline6', from: 'cpimpost11', to: 'cpimpost10'},

                {'type': 'impost_line', id: 'impostcenterline7', from: 'fpimpost7', to: 'fpimpost8', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline8', from: 'fpimpost8', to: 'fpimpost7', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost13', line1: 'frameline1', line2: 'impostcenterline7', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost14', line1: 'impostcenterline8', line2: 'frameline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost15', line1: 'impostcenterline1', line2: 'impostcenterline8', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost16', line1: 'impostcenterline7', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline7', from: 'cpimpost13', to: 'cpimpost16'},
                {'type': 'impost_in_line', id: 'impostinline8', from: 'cpimpost15', to: 'cpimpost14'},

                {'type': 'impost_line', id: 'impostcenterline9', from: 'fpimpost9', to: 'fpimpost10', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline10', from: 'fpimpost10', to: 'fpimpost9', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost17', line1: 'frameline1', line2: 'impostcenterline9', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost18', line1: 'impostcenterline10', line2: 'frameline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost19', line1: 'impostcenterline1', line2: 'impostcenterline10', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost20', line1: 'impostcenterline9', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline9', from: 'cpimpost17', to: 'cpimpost20'},
                {'type': 'impost_in_line', id: 'impostinline10', from: 'cpimpost19', to: 'cpimpost18'},

                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline7', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline7', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
                {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
                {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
                {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
                {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
                {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
                {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
                {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
                {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
                {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
                {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
                {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
                {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
                {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
                {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
                {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
                {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
                {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
                {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
                {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
                {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
                {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
                {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout13', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout15', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout16', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline13', from:'cpbeadout16', to:'cpbeadout13'},
                {'type': 'bead_line', id:'beadline14', from:'cpbeadout13', to:'cpbeadout14'},
                {'type': 'bead_line', id:'beadline15', from:'cpbeadout14', to:'cpbeadout15'},
                {'type': 'bead_line', id:'beadline16', from:'cpbeadout15', to:'cpbeadout16'},
                {'type': 'cross_point_bead', id: 'cpbead13', line1: 'beadline13', line2: 'beadline14'},
                {'type': 'cross_point_bead', id: 'cpbead14', line1: 'beadline14', line2: 'beadline15'},
                {'type': 'cross_point_bead', id: 'cpbead15', line1: 'beadline15', line2: 'beadline16'},
                {'type': 'cross_point_bead', id: 'cpbead16', line1: 'beadline16', line2: 'beadline13'},
                {'type': 'bead_in_line', id:'beadinline13', from:'cpbead16', to:'cpbead13'},
                {'type': 'bead_in_line', id:'beadinline14', from:'cpbead13', to:'cpbead14'},
                {'type': 'bead_in_line', id:'beadinline15', from:'cpbead14', to:'cpbead15'},
                {'type': 'bead_in_line', id:'beadinline16', from:'cpbead15', to:'cpbead16'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout17', line1: 'frameline1', line2: 'impostcenterline9', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout18', line1: 'impostcenterline9', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout19', line1: 'impostcenterline1', line2: 'impostcenterline8', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout20', line1: 'impostcenterline8', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline17', from:'cpbeadout20', to:'cpbeadout17'},
                {'type': 'bead_line', id:'beadline18', from:'cpbeadout17', to:'cpbeadout18'},
                {'type': 'bead_line', id:'beadline19', from:'cpbeadout18', to:'cpbeadout19'},
                {'type': 'bead_line', id:'beadline20', from:'cpbeadout19', to:'cpbeadout20'},
                {'type': 'cross_point_bead', id: 'cpbead17', line1: 'beadline17', line2: 'beadline18'},
                {'type': 'cross_point_bead', id: 'cpbead18', line1: 'beadline18', line2: 'beadline19'},
                {'type': 'cross_point_bead', id: 'cpbead19', line1: 'beadline19', line2: 'beadline20'},
                {'type': 'cross_point_bead', id: 'cpbead20', line1: 'beadline20', line2: 'beadline17'},
                {'type': 'bead_in_line', id:'beadinline17', from:'cpbead20', to:'cpbead17'},
                {'type': 'bead_in_line', id:'beadinline18', from:'cpbead17', to:'cpbead18'},
                {'type': 'bead_in_line', id:'beadinline19', from:'cpbead18', to:'cpbead19'},
                {'type': 'bead_in_line', id:'beadinline20', from:'cpbead19', to:'cpbead20'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout21', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout22', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout23', line1: 'impostcenterline1', line2: 'impostcenterline10', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout24', line1: 'impostcenterline10', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline21', from:'cpbeadout24', to:'cpbeadout21'},
                {'type': 'bead_line', id:'beadline22', from:'cpbeadout21', to:'cpbeadout22'},
                {'type': 'bead_line', id:'beadline23', from:'cpbeadout22', to:'cpbeadout23'},
                {'type': 'bead_line', id:'beadline24', from:'cpbeadout23', to:'cpbeadout24'},
                {'type': 'cross_point_bead', id: 'cpbead21', line1: 'beadline21', line2: 'beadline22'},
                {'type': 'cross_point_bead', id: 'cpbead22', line1: 'beadline22', line2: 'beadline23'},
                {'type': 'cross_point_bead', id: 'cpbead23', line1: 'beadline23', line2: 'beadline24'},
                {'type': 'cross_point_bead', id: 'cpbead24', line1: 'beadline24', line2: 'beadline21'},
                {'type': 'bead_in_line', id:'beadinline21', from:'cpbead24', to:'cpbead21'},
                {'type': 'bead_in_line', id:'beadinline22', from:'cpbead21', to:'cpbead22'},
                {'type': 'bead_in_line', id:'beadinline23', from:'cpbead22', to:'cpbead23'},
                {'type': 'bead_in_line', id:'beadinline24', from:'cpbead23', to:'cpbead24'},

                //----- top glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline7', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline7', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'impostcenterline1', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
                //----- down glass
                {'type': 'cross_point_glass', id: 'cpg5', line1: 'impostcenterline2', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
                {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
                {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
                {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},

                {'type': 'cross_point_glass', id: 'cpg9', line1: 'impostcenterline2', line2: 'impostcenterline5', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg10', line1: 'impostcenterline5', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline4', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
                {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
                {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
                {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},

                {'type': 'cross_point_glass', id: 'cpg13', line1: 'impostcenterline2', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg14', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg15', line1: 'frameline3', line2: 'impostcenterline6', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg16', line1: 'impostcenterline6', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline13', from: 'cpg16', to: 'cpg13'},
                {'type': 'glass_line', id: 'glassline14', from: 'cpg13', to: 'cpg14'},
                {'type': 'glass_line', id: 'glassline15', from: 'cpg14', to: 'cpg15'},
                {'type': 'glass_line', id: 'glassline16', from: 'cpg15', to: 'cpg16'},
                //------ top left glass
                {'type': 'cross_point_glass', id: 'cpg17', line1: 'frameline1', line2: 'impostcenterline9', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg18', line1: 'impostcenterline9', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg19', line1: 'impostcenterline1', line2: 'impostcenterline8', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg20', line1: 'impostcenterline8', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline17', from: 'cpg20', to: 'cpg17'},
                {'type': 'glass_line', id: 'glassline18', from: 'cpg17', to: 'cpg18'},
                {'type': 'glass_line', id: 'glassline19', from: 'cpg18', to: 'cpg19'},
                {'type': 'glass_line', id: 'glassline20', from: 'cpg19', to: 'cpg20'},

                {'type': 'cross_point_glass', id: 'cpg21', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg22', line1: 'frameline2', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg23', line1: 'impostcenterline1', line2: 'impostcenterline10', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg24', line1: 'impostcenterline10', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline21', from: 'cpg24', to: 'cpg21'},
                {'type': 'glass_line', id: 'glassline22', from: 'cpg21', to: 'cpg22'},
                {'type': 'glass_line', id: 'glassline23', from: 'cpg22', to: 'cpg23'},
                {'type': 'glass_line', id: 'glassline24', from: 'cpg23', to: 'cpg24'},

                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
                {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},
                {'type': 'impost', id: 'impost3', parts: ['impostinline5', 'impostinline6']},
                {'type': 'impost', id: 'impost4', parts: ['impostinline7', 'impostinline8']},
                {'type': 'impost', id: 'impost5', parts: ['impostinline9', 'impostinline10']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
                {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
                {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
                {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

                {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
                {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
                {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
                {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

                {'type': 'bead_box', id:'bead13', parts: ['beadline13', 'beadinline13']},
                {'type': 'bead_box', id:'bead14', parts: ['beadline14', 'beadinline14']},
                {'type': 'bead_box', id:'bead15', parts: ['beadline15', 'beadinline15']},
                {'type': 'bead_box', id:'bead16', parts: ['beadline16', 'beadinline16']},

                {'type': 'bead_box', id:'bead17', parts: ['beadline17', 'beadinline17']},
                {'type': 'bead_box', id:'bead18', parts: ['beadline18', 'beadinline18']},
                {'type': 'bead_box', id:'bead19', parts: ['beadline19', 'beadinline19']},
                {'type': 'bead_box', id:'bead20', parts: ['beadline20', 'beadinline20']},

                {'type': 'bead_box', id:'bead21', parts: ['beadline21', 'beadinline21']},
                {'type': 'bead_box', id:'bead22', parts: ['beadline22', 'beadinline22']},
                {'type': 'bead_box', id:'bead23', parts: ['beadline23', 'beadinline23']},
                {'type': 'bead_box', id:'bead24', parts: ['beadline24', 'beadinline24']},

                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
                {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
                {'type': 'glass_paсkage', id: 'glass4', parts: ['glassline13', 'glassline14', 'glassline15', 'glassline16']},
                {'type': 'glass_paсkage', id: 'glass5', parts: ['glassline17', 'glassline18', 'glassline19', 'glassline20']},
                {'type': 'glass_paсkage', id: 'glass6', parts: ['glassline21', 'glassline22', 'glassline23', 'glassline24']},
                {'type': 'dimensionsH', id: 'dimH1', from: ['fp4', 'fp1'], to: ['fpimpost4', 'fpimpost3'], limits: ['overallDimH', 'dimH3'], links: ['fpimpost4', 'fpimpost3'], level: 1, height: 150, side: 'bottom'},
                {'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost4', 'fpimpost3'], to: ['fpimpost6', 'fpimpost5'], limits: ['overallDimH', 'dimH1'], links: ['fpimpost6', 'fpimpost5'], level: 1, height: 150, side: 'bottom'},
                {'type': 'dimensionsH', id: 'dimH3', from: ['fpimpost6', 'fpimpost5'], to: ['fp3', 'fp2'], level: 1, height: 150, side: 'bottom'},
                {'type': 'dimensionsH', id: 'dimH4', from: ['fp1', 'fp4'], to: ['fpimpost7', 'fpimpost8'], limits: ['overallDimH', 'dimH6'], links: ['fpimpost7', 'fpimpost8'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsH', id: 'dimH5', from: ['fpimpost7', 'fpimpost8'], to: ['fpimpost9', 'fpimpost10'], limits: ['overallDimH', 'dimH4'], links: ['fpimpost9', 'fpimpost10'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsH', id: 'dimH6', from: ['fpimpost9', 'fpimpost10'], to: ['fp2', 'fp3'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'dimV1', from: ['fp2', 'fp1'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimV'], level: 1, height: 150, side: 'right'},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1', 'dimH2', 'dimH4'], links: ['fpimpost1'], level: 3, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], limits: ['dimV1'], level: 1, height: 150, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            }

          ],
          windowDoor: [
            {
              'name':'Выход на балкон',
              'objects':[
                //------- main points

                {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
                {'type':'fixed_point', id:'fp2', x:'1300', y:'0'},
                {'type':'fixed_point', id:'fp3', x:'1300', y:'1400'},
                {'type':'fixed_point', id:'fp4', x:'0', y:'1400'},
                {'type':'fixed_point', id:'fp5', x:'1300', y: '0'},
                {'type':'fixed_point', id:'fp6', x:'2000', y:'0'},
                {'type':'fixed_point', id:'fp7', x:'2000', y:'2100'},
                {'type':'fixed_point', id:'fp8', x:'1300', y:'2100'},
                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},

                {'type': 'frame_line', id: 'frameline5', from: 'fp5', to: 'fp6'},
                {'type': 'frame_line', id: 'frameline6', from: 'fp6', to: 'fp7'},
                {'type': 'frame_line', id: 'frameline7', from: 'fp7', to: 'fp8', sill: true},
                {'type': 'frame_line', id: 'frameline8', from: 'fp8', to: 'fp5'},
                {'type': 'cross_point', id: 'cp5', line1: 'frameline5', line2: 'frameline6'},
                {'type': 'cross_point', id: 'cp6', line1: 'frameline6', line2: 'frameline7'},
                {'type': 'cross_point', id: 'cp7', line1: 'frameline7', line2: 'frameline8'},
                {'type': 'cross_point', id: 'cp8', line1: 'frameline8', line2: 'frameline5'},
                {'type': 'frame_in_line', id: 'frameinline5', from: 'cp8', to: 'cp5'},
                {'type': 'frame_in_line', id: 'frameinline6', from: 'cp5', to: 'cp6'},
                {'type': 'frame_in_line', id: 'frameinline7', from: 'cp6', to: 'cp7'},
                {'type': 'frame_in_line', id: 'frameinline8', from: 'cp7', to: 'cp8'},

                //-------- sash
                {'type': 'cross_point_sash_out', id: 'cpsout5', line1: 'frameline5', line2: 'frameline6'},
                {'type': 'cross_point_sash_out', id: 'cpsout6', line1: 'frameline6', line2: 'frameline7'},
                {'type': 'cross_point_sash_out', id: 'cpsout7', line1: 'frameline7', line2: 'frameline8'},
                {'type': 'cross_point_sash_out', id: 'cpsout8', line1: 'frameline8', line2: 'frameline5'},
                {'type': 'sash_out_line', id: 'sashoutline5', from: 'cpsout8', to: 'cpsout5'},
                {'type': 'sash_out_line', id: 'sashoutline6', from: 'cpsout5', to: 'cpsout6'},
                {'type': 'sash_out_line', id: 'sashoutline7', from: 'cpsout6', to: 'cpsout7'},
                {'type': 'sash_out_line', id: 'sashoutline8', from: 'cpsout7', to: 'cpsout8'},

                {'type': 'cross_point_hardware', id: 'cphw5', line1: 'sashoutline5', line2: 'sashoutline6'},
                {'type': 'cross_point_hardware', id: 'cphw6', line1: 'sashoutline6', line2: 'sashoutline7'},
                {'type': 'cross_point_hardware', id: 'cphw7', line1: 'sashoutline7', line2: 'sashoutline8'},
                {'type': 'cross_point_hardware', id: 'cphw8', line1: 'sashoutline8', line2: 'sashoutline5'},
                {'type': 'hardware_line', id: 'hardwareline5', from: 'cphw8', to: 'cphw5'},
                {'type': 'hardware_line', id: 'hardwareline6', from: 'cphw5', to: 'cphw6'},
                {'type': 'hardware_line', id: 'hardwareline7', from: 'cphw6', to: 'cphw7'},
                {'type': 'hardware_line', id: 'hardwareline8', from: 'cphw7', to: 'cphw8'},

                {'type': 'cross_point_sash_in', id: 'cpsin5', line1: 'sashoutline5', line2: 'sashoutline6'},
                {'type': 'cross_point_sash_in', id: 'cpsin6', line1: 'sashoutline6', line2: 'sashoutline7'},
                {'type': 'cross_point_sash_in', id: 'cpsin7', line1: 'sashoutline7', line2: 'sashoutline8'},
                {'type': 'cross_point_sash_in', id: 'cpsin8', line1: 'sashoutline8', line2: 'sashoutline5'},
                {'type': 'sash_line', id: 'sashline5', from: 'cpsin8', to: 'cpsin5'},
                {'type': 'sash_line', id: 'sashline6', from: 'cpsin5', to: 'cpsin6'},
                {'type': 'sash_line', id: 'sashline7', from: 'cpsin6', to: 'cpsin7'},
                {'type': 'sash_line', id: 'sashline8', from: 'cpsin7', to: 'cpsin8'},
                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'frameline5', line2: 'frameline6', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'frameline6', line2: 'frameline7', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline7', line2: 'frameline8', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'frameline8', line2: 'frameline5', blockType: 'sash'},
                {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
                {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
                {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
                {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
                {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
                {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
                {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
                {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
                {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
                {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
                {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
                {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},
                //----- left glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
                //----- right glass
                {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameline5', line2: 'frameline6', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg6', line1: 'frameline6', line2: 'frameline7', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline7', line2: 'frameline8', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameline8', line2: 'frameline5', blockType: 'sash'},
                {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
                {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
                {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
                {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'frame', id: 'frame5', parts: ['frameline5', 'frameinline5']},
                {'type': 'frame', id: 'frame6', parts: ['frameline6', 'frameinline6']},
                {'type': 'frame', id: 'frame7', parts: ['frameline7', 'frameinline7']},
                {'type': 'frame', id: 'frame8', parts: ['frameline8', 'frameinline8']},
                {'type': 'sash', id: 'sash5', parts: ['sashoutline5', 'sashline5']},
                {'type': 'sash', id: 'sash6', parts: ['sashoutline6', 'sashline6'], openType: ['sashline6', 'sashline8']},
                {'type': 'sash', id: 'sash7', parts: ['sashoutline7', 'sashline7'], openType: ['sashline7', 'sashline5']},
                {'type': 'sash', id: 'sash8', parts: ['sashoutline8', 'sashline8']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
                {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
                {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
                {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

                {'type': 'sash_block', id: 'sashBlock2', parts: ['hardwareline5', 'hardwareline6', 'hardwareline7', 'hardwareline8'], openDir: [1, 4], handlePos: 4},
                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
                {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['overallDimH'],  links: ['fp5', 'fp8'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'dimV1', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
                {'type': 'dimensionsH', id: 'dimH2', from: ['fp5', 'fp8'], to: ['fp6', 'fp7'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp6', 'fp5'], to: ['fp7', 'fp8'], level: 1, height: 150, side: 'right'},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp6', 'fp7'], limits: ['dimH1'], level: 3, height: 150, side: 'top'},
                {'type': 'square', id: 'sqr', widths: ['dimH1', 'dimH2'], heights: ['dimV1', 'overallDimV']}
              ]
            }
          ],

          balconies: [
            {
              'name':'Трехстворчатое',
              'objects':[
                //------- main points
                {'type':'fixed_point', id:'fp1', x:0, y:0},
                {'type':'fixed_point', id:'fp2', x:2100, y:0},
                {'type':'fixed_point', id:'fp3', x:2100, y:1400},
                {'type':'fixed_point', id:'fp4', x:0, y:1400},
                {'type':'fixed_point_impost', id:'fpimpost1', x:700, y:0, dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost2', x:700, y:1400, dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost3', x:1400, y:0, dir:'vert'},
                {'type':'fixed_point_impost', id:'fpimpost4', x:1400, y:1400, dir:'vert'},
                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},
                //-------- impost
                {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2', lineType: 'frame'},
                {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1', lineType: 'sash'},
                {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4', lineType: 'sash'},
                {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3', lineType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},

                {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'frameline1', line2: 'impostcenterline3', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'frame'},
                {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
                {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},
                {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
                {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},
                //-------- sash
                {'type': 'cross_point_sash_out', id: 'cpsout5', line1: 'frameline1', line2: 'impostcenterline3'},
                {'type': 'cross_point_sash_out', id: 'cpsout6', line1: 'impostcenterline3', line2: 'frameline3'},
                {'type': 'cross_point_sash_out', id: 'cpsout7', line1: 'frameline3', line2: 'impostcenterline2'},
                {'type': 'cross_point_sash_out', id: 'cpsout8', line1: 'impostcenterline2', line2: 'frameline1'},
                {'type': 'sash_out_line', id: 'sashoutline5', from: 'cpsout8', to: 'cpsout5'},
                {'type': 'sash_out_line', id: 'sashoutline6', from: 'cpsout5', to: 'cpsout6'},
                {'type': 'sash_out_line', id: 'sashoutline7', from: 'cpsout6', to: 'cpsout7'},
                {'type': 'sash_out_line', id: 'sashoutline8', from: 'cpsout7', to: 'cpsout8'},

                {'type': 'cross_point_hardware', id: 'cphw5', line1: 'sashoutline5', line2: 'sashoutline6'},
                {'type': 'cross_point_hardware', id: 'cphw6', line1: 'sashoutline6', line2: 'sashoutline7'},
                {'type': 'cross_point_hardware', id: 'cphw7', line1: 'sashoutline7', line2: 'sashoutline8'},
                {'type': 'cross_point_hardware', id: 'cphw8', line1: 'sashoutline8', line2: 'sashoutline5'},
                {'type': 'hardware_line', id: 'hardwareline5', from: 'cphw8', to: 'cphw5'},
                {'type': 'hardware_line', id: 'hardwareline6', from: 'cphw5', to: 'cphw6'},
                {'type': 'hardware_line', id: 'hardwareline7', from: 'cphw6', to: 'cphw7'},
                {'type': 'hardware_line', id: 'hardwareline8', from: 'cphw7', to: 'cphw8'},

                {'type': 'cross_point_sash_in', id: 'cpsin5', line1: 'sashoutline5', line2: 'sashoutline6'},
                {'type': 'cross_point_sash_in', id: 'cpsin6', line1: 'sashoutline6', line2: 'sashoutline7'},
                {'type': 'cross_point_sash_in', id: 'cpsin7', line1: 'sashoutline7', line2: 'sashoutline8'},
                {'type': 'cross_point_sash_in', id: 'cpsin8', line1: 'sashoutline8', line2: 'sashoutline5'},
                {'type': 'sash_line', id: 'sashline5', from: 'cpsin8', to: 'cpsin5'},
                {'type': 'sash_line', id: 'sashline6', from: 'cpsin5', to: 'cpsin6'},
                {'type': 'sash_line', id: 'sashline7', from: 'cpsin6', to: 'cpsin7'},
                {'type': 'sash_line', id: 'sashline8', from: 'cpsin7', to: 'cpsin8'},

                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout5', line1: 'frameline1', line2: 'impostcenterline3', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout7', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'sash'},
                {'type': 'bead_line', id:'beadline5', from:'cpbeadout8', to:'cpbeadout5'},
                {'type': 'bead_line', id:'beadline6', from:'cpbeadout5', to:'cpbeadout6'},
                {'type': 'bead_line', id:'beadline7', from:'cpbeadout6', to:'cpbeadout7'},
                {'type': 'bead_line', id:'beadline8', from:'cpbeadout7', to:'cpbeadout8'},
                {'type': 'cross_point_bead', id: 'cpbead5', line1: 'beadline5', line2: 'beadline6'},
                {'type': 'cross_point_bead', id: 'cpbead6', line1: 'beadline6', line2: 'beadline7'},
                {'type': 'cross_point_bead', id: 'cpbead7', line1: 'beadline7', line2: 'beadline8'},
                {'type': 'cross_point_bead', id: 'cpbead8', line1: 'beadline8', line2: 'beadline5'},
                {'type': 'bead_in_line', id:'beadinline5', from:'cpbead8', to:'cpbead5'},
                {'type': 'bead_in_line', id:'beadinline6', from:'cpbead5', to:'cpbead6'},
                {'type': 'bead_in_line', id:'beadinline7', from:'cpbead6', to:'cpbead7'},
                {'type': 'bead_in_line', id:'beadinline8', from:'cpbead7', to:'cpbead8'},

                {'type': 'cross_point_bead_out', id: 'cpbeadout9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout12', line1: 'impostcenterline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'bead_line', id:'beadline9', from:'cpbeadout12', to:'cpbeadout9'},
                {'type': 'bead_line', id:'beadline10', from:'cpbeadout9', to:'cpbeadout10'},
                {'type': 'bead_line', id:'beadline11', from:'cpbeadout10', to:'cpbeadout11'},
                {'type': 'bead_line', id:'beadline12', from:'cpbeadout11', to:'cpbeadout12'},
                {'type': 'cross_point_bead', id: 'cpbead9', line1: 'beadline9', line2: 'beadline10'},
                {'type': 'cross_point_bead', id: 'cpbead10', line1: 'beadline10', line2: 'beadline11'},
                {'type': 'cross_point_bead', id: 'cpbead11', line1: 'beadline11', line2: 'beadline12'},
                {'type': 'cross_point_bead', id: 'cpbead12', line1: 'beadline12', line2: 'beadline9'},
                {'type': 'bead_in_line', id:'beadinline9', from:'cpbead12', to:'cpbead9'},
                {'type': 'bead_in_line', id:'beadinline10', from:'cpbead9', to:'cpbead10'},
                {'type': 'bead_in_line', id:'beadinline11', from:'cpbead10', to:'cpbead11'},
                {'type': 'bead_in_line', id:'beadinline12', from:'cpbead11', to:'cpbead12'},

                //---- left glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'impostcenterline1', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
                //----- center glass
                {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameline1', line2: 'impostcenterline3', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostcenterline3', line2: 'frameline3', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameline3', line2: 'impostcenterline2', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg8', line1: 'impostcenterline2', line2: 'frameline1', blockType: 'sash'},
                {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
                {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
                {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
                {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
                //------ right glass
                {'type': 'cross_point_glass', id: 'cpg9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame'},
                {'type': 'cross_point_glass', id: 'cpg12', line1: 'impostcenterline4', line2: 'frameline1', blockType: 'frame'},
                {'type': 'glass_line', id: 'glassline9', from: 'cpg12', to: 'cpg9'},
                {'type': 'glass_line', id: 'glassline10', from: 'cpg9', to: 'cpg10'},
                {'type': 'glass_line', id: 'glassline11', from: 'cpg10', to: 'cpg11'},
                {'type': 'glass_line', id: 'glassline12', from: 'cpg11', to: 'cpg12'},
                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'impost', id: 'impost1', parts: ['impostinline1', 'impostinline2']},
                {'type': 'impost', id: 'impost2', parts: ['impostinline3', 'impostinline4']},
                {'type': 'sash', id: 'sash5', parts: ['sashoutline5', 'sashline5']},
                {'type': 'sash', id: 'sash6', parts: ['sashoutline6', 'sashline6'], openType: ['sashline6', 'sashline8']},
                {'type': 'sash', id: 'sash7', parts: ['sashoutline7', 'sashline7'], openType: ['sashline7', 'sashline5']},
                {'type': 'sash', id: 'sash8', parts: ['sashoutline8', 'sashline8']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'bead_box', id:'bead5', parts: ['beadline5', 'beadinline5']},
                {'type': 'bead_box', id:'bead6', parts: ['beadline6', 'beadinline6']},
                {'type': 'bead_box', id:'bead7', parts: ['beadline7', 'beadinline7']},
                {'type': 'bead_box', id:'bead8', parts: ['beadline8', 'beadinline8']},

                {'type': 'bead_box', id:'bead9', parts: ['beadline9', 'beadinline9']},
                {'type': 'bead_box', id:'bead10', parts: ['beadline10', 'beadinline10']},
                {'type': 'bead_box', id:'bead11', parts: ['beadline11', 'beadinline11']},
                {'type': 'bead_box', id:'bead12', parts: ['beadline12', 'beadinline12']},

                {'type': 'sash_block', id: 'sashBlock2', parts: ['hardwareline5', 'hardwareline6', 'hardwareline7', 'hardwareline8'], openDir: [1, 4], handlePos: 4},
                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
                {'type': 'glass_paсkage', id: 'glass3', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},

                {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH', 'dimH3'], links: ['fpimpost1', 'fpimpost2'], level: 1, side: 'top'},
                {'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost1', 'fpimpost2'], to: ['fpimpost3', 'fpimpost4'], limits: ['overallDimH', 'dimH1'], links: ['fpimpost3', 'fpimpost4'], level: 1, side: 'top'},
                {'type': 'dimensionsH', id: 'dimH3', from: ['fpimpost3', 'fpimpost4'], to: ['fp2', 'fp3'], level: 1, side: 'top'},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1', 'dimH2'], level: 3, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            }

          ],

          doors: [
            {
              'name': 'Одностворчатая',
              'objects': [
                //------- main points
                {'type': 'fixed_point', id: 'fp1', x: '0', y: '0'},
                {'type': 'fixed_point', id: 'fp2', x: '700', y: '0'},
                {'type': 'fixed_point', id: 'fp3', x: '700', y: '2100'},
                {'type': 'fixed_point', id: 'fp4', x: '0', y: '2100'},
                //------- frame
                {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
                {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
                {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4', sill: true},
                {'type': 'frame_line', id: 'frameline4', from: 'fp4', to: 'fp1'},
                {'type': 'cross_point', id: 'cp1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point', id: 'cp2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point', id: 'cp3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point', id: 'cp4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'frame_in_line', id: 'frameinline1', from: 'cp4', to: 'cp1'},
                {'type': 'frame_in_line', id: 'frameinline2', from: 'cp1', to: 'cp2'},
                {'type': 'frame_in_line', id: 'frameinline3', from: 'cp2', to: 'cp3'},
                {'type': 'frame_in_line', id: 'frameinline4', from: 'cp3', to: 'cp4'},

                //-------- sash
                {'type': 'cross_point_sash_out', id: 'cpsout1', line1: 'frameline1', line2: 'frameline2'},
                {'type': 'cross_point_sash_out', id: 'cpsout2', line1: 'frameline2', line2: 'frameline3'},
                {'type': 'cross_point_sash_out', id: 'cpsout3', line1: 'frameline3', line2: 'frameline4'},
                {'type': 'cross_point_sash_out', id: 'cpsout4', line1: 'frameline4', line2: 'frameline1'},
                {'type': 'sash_out_line', id: 'sashoutline1', from: 'cpsout4', to: 'cpsout1'},
                {'type': 'sash_out_line', id: 'sashoutline2', from: 'cpsout1', to: 'cpsout2'},
                {'type': 'sash_out_line', id: 'sashoutline3', from: 'cpsout2', to: 'cpsout3'},
                {'type': 'sash_out_line', id: 'sashoutline4', from: 'cpsout3', to: 'cpsout4'},

                {'type': 'cross_point_hardware', id: 'cphw1', line1: 'sashoutline1', line2: 'sashoutline2'},
                {'type': 'cross_point_hardware', id: 'cphw2', line1: 'sashoutline2', line2: 'sashoutline3'},
                {'type': 'cross_point_hardware', id: 'cphw3', line1: 'sashoutline3', line2: 'sashoutline4'},
                {'type': 'cross_point_hardware', id: 'cphw4', line1: 'sashoutline4', line2: 'sashoutline1'},
                {'type': 'hardware_line', id: 'hardwareline1', from: 'cphw4', to: 'cphw1'},
                {'type': 'hardware_line', id: 'hardwareline2', from: 'cphw1', to: 'cphw2'},
                {'type': 'hardware_line', id: 'hardwareline3', from: 'cphw2', to: 'cphw3'},
                {'type': 'hardware_line', id: 'hardwareline4', from: 'cphw3', to: 'cphw4'},

                {'type': 'cross_point_sash_in', id: 'cpsin1', line1: 'sashoutline1', line2: 'sashoutline2'},
                {'type': 'cross_point_sash_in', id: 'cpsin2', line1: 'sashoutline2', line2: 'sashoutline3'},
                {'type': 'cross_point_sash_in', id: 'cpsin3', line1: 'sashoutline3', line2: 'sashoutline4'},
                {'type': 'cross_point_sash_in', id: 'cpsin4', line1: 'sashoutline4', line2: 'sashoutline1'},
                {'type': 'sash_line', id: 'sashline1', from: 'cpsin4', to: 'cpsin1'},
                {'type': 'sash_line', id: 'sashline2', from: 'cpsin1', to: 'cpsin2'},
                {'type': 'sash_line', id: 'sashline3', from: 'cpsin2', to: 'cpsin3'},
                {'type': 'sash_line', id: 'sashline4', from: 'cpsin3', to: 'cpsin4'},

                //----------- bead box
                {'type': 'cross_point_bead_out', id: 'cpbeadout1', line1: 'frameline1', line2: 'frameline2', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout2', line1: 'frameline2', line2: 'frameline3', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout3', line1: 'frameline3', line2: 'frameline4', blockType: 'sash'},
                {'type': 'cross_point_bead_out', id: 'cpbeadout4', line1: 'frameline4', line2: 'frameline1', blockType: 'sash'},
                {'type': 'bead_line', id:'beadline1', from:'cpbeadout4', to:'cpbeadout1'},
                {'type': 'bead_line', id:'beadline2', from:'cpbeadout1', to:'cpbeadout2'},
                {'type': 'bead_line', id:'beadline3', from:'cpbeadout2', to:'cpbeadout3'},
                {'type': 'bead_line', id:'beadline4', from:'cpbeadout3', to:'cpbeadout4'},
                {'type': 'cross_point_bead', id: 'cpbead1', line1: 'beadline1', line2: 'beadline2'},
                {'type': 'cross_point_bead', id: 'cpbead2', line1: 'beadline2', line2: 'beadline3'},
                {'type': 'cross_point_bead', id: 'cpbead3', line1: 'beadline3', line2: 'beadline4'},
                {'type': 'cross_point_bead', id: 'cpbead4', line1: 'beadline4', line2: 'beadline1'},
                {'type': 'bead_in_line', id:'beadinline1', from:'cpbead4', to:'cpbead1'},
                {'type': 'bead_in_line', id:'beadinline2', from:'cpbead1', to:'cpbead2'},
                {'type': 'bead_in_line', id:'beadinline3', from:'cpbead2', to:'cpbead3'},
                {'type': 'bead_in_line', id:'beadinline4', from:'cpbead3', to:'cpbead4'},

                //----- glass
                {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'frameline2', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline2', line2: 'frameline3', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'sash'},
                {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'sash'},
                {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
                {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
                {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
                {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
                //------- essential parts
                {'type': 'frame', id: 'frame1', parts: ['frameline1', 'frameinline1']},
                {'type': 'frame', id: 'frame2', parts: ['frameline2', 'frameinline2']},
                {'type': 'frame', id: 'frame3', parts: ['frameline3', 'frameinline3']},
                {'type': 'frame', id: 'frame4', parts: ['frameline4', 'frameinline4']},
                {'type': 'sash', id: 'sash1', parts: ['sashoutline1', 'sashline1']},
                {'type': 'sash', id: 'sash2', parts: ['sashoutline2', 'sashline2'], openType: ['sashline2', 'sashline4']},
                {'type': 'sash', id: 'sash3', parts: ['sashoutline3', 'sashline3'], openType: ['sashline3', 'sashline1']},
                {'type': 'sash', id: 'sash4', parts: ['sashoutline4', 'sashline4']},

                {'type': 'bead_box', id:'bead1', parts: ['beadline1', 'beadinline1']},
                {'type': 'bead_box', id:'bead2', parts: ['beadline2', 'beadinline2']},
                {'type': 'bead_box', id:'bead3', parts: ['beadline3', 'beadinline3']},
                {'type': 'bead_box', id:'bead4', parts: ['beadline4', 'beadinline4']},

                {'type': 'sash_block', id: 'sashBlock1', parts: ['hardwareline1', 'hardwareline2', 'hardwareline3', 'hardwareline4'], openDir: [1, 4], handlePos: 4},
                {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
                {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], level: 1, height: 150, side: 'top'},
                {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
                {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
              ]
            }
          ]
        }));
      },
  /*
      getTemplatePrice: function(profileId, callback) {
        var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
        var self = this;
        db.transaction(function (transaction) {
          transaction.executeSql(selectUser, [loginData.login, self.md5(loginData.password)], function (transaction, result) {
            console.log(result.rows.item(0).login);
            if (result.rows.item(0).login) {
              callback(new OkResult({loginStatus : true}));
            } else {
              callback(new OkResult({loginStatus : false}));
            }
          }, function () {
            callback(new ErrorResult(2, 'Something went wrong with selection user record'));
          });
        });
      },
  */

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

      getProfileSystem: function (callback) {
        callback(new OkResult({
          id: 7,
          name: 'WDS 400',
          heatCoeff: 5,
          airCoeff: 10
        }));
      },


      getAllProfiles: function (callback) {
        callback(new OkResult({
          producers: [
            'WDS',
            'Другие...'
          ],
          profiles: [
            [
              {
                profileId: 51,
                profileType: '4 камеры',
                profileDescrip: 'WDS 400',
                profileCountry: 'Украина',
                profileNoise: 4,
                heatCoeff: 3,
                airCoeff: 10
              },
              {
                profileId: 52,
                profileType: '4 камеры',
                profileDescrip: 'WDS 404',
                profileCountry: 'Украина',
                profileNoise: 4,
                heatCoeff: 4,
                airCoeff: 11
              },
              {
                profileId: 53,
                profileType: '5 камер',
                profileDescrip: 'WDS 505',
                profileCountry: 'Украина',
                profileNoise: 5,
                heatCoeff: 5,
                airCoeff: 9
              },
              {
                profileId: 54,
                profileType: '4 камеры',
                profileDescrip: 'ОКОШКО S60',
                profileCountry: 'Украина',
                profileNoise: 4,
                heatCoeff: 2,
                airCoeff: 8
              }
            ]/*,
            [
              {
                profileId: 55,
                profileType: '3 камеры',
                profileDescrip: 'REHAU 60',
                profileCountry: 'Germany',
                profileNoise: 3,
                heatCoeff: 2,
                airCoeff: 8
              },
              {
                profileId: 56,
                profileType: '5 камер',
                profileDescrip: 'REHAU 70',
                profileCountry: 'Germany',
                profileNoise: 5,
                heatCoeff: 3,
                airCoeff: 10
              }
            ]*/
          ]
        }));
      },



      getAllGlass: function (callback) {
        callback(new OkResult({
          glassTypes: [
            'Стандартные',
            'Энергосберегающие',
            'Зеркальные',
            'Матовые',
            'Бронированные'
          ],
          glasses: [
            [
              {
                glassId: 145,
                glassName: '6/12/6',
                glassUrl: 'img/glasses/glass1.png',
                glassDescrip: '1 камера',
                glassNoise: 4,
                heatCoeff: 2,
                airCoeff: 9,
                glassPrice: 406
              },
              {
                glassId: 142,
                glassName: '4/16/4',
                glassUrl: 'img/glasses/glass1.png',
                glassDescrip: '1 камера',
                glassNoise: 2,
                heatCoeff: 1,
                airCoeff: 9,
                glassPrice: 210
              },
              {
                glassId: 146,
                glassName: '4/10/4/10/4',
                glassUrl: 'img/glasses/glass2.png',
                glassDescrip: '2 камеры',
                glassNoise: 4,
                heatCoeff: 3,
                airCoeff: 9,
                glassPrice: 325
              },
              {
                glassId: 147,
                glassName: '4/8/4/12/4',
                glassUrl: 'img/glasses/glass2.png',
                glassDescrip: '2 камеры',
                glassNoise: 4,
                heatCoeff: 3,
                airCoeff: 9,
                glassPrice: 325
              }
            ],
            [
              {
                glassId: 153,
                glassName: '4/16/4i',
                glassUrl: 'img/glasses/glass10.png',
                glassDescrip: '1 камера +энергосбережение',
                glassNoise: 2,
                heatCoeff: 4,
                airCoeff: 9,
                glassPrice:  245
              },
              {
                glassId: 208,
                glassName: '4/16argon/4i',
                glassUrl: 'img/glasses/glass10.png',
                glassDescrip: '1 камера +энергосбережение',
                glassNoise: 2,
                heatCoeff: 4,
                airCoeff: 9,
                glassPrice:  257
              },
              {
                glassId: 156,
                glassName: '4/10/4/10/4i',
                glassUrl: 'img/glasses/glass20.png',
                glassDescrip: '2 камеры +энергосбережение',
                glassNoise: 4,
                heatCoeff: 4,
                airCoeff: 9,
                glassPrice: 370
              },
              {
                glassId: 207,
                glassName: '4i/10/4/10/4i',
                glassUrl: 'img/glasses/glass20.png',
                glassDescrip: '2 камеры +энергосбережение',
                glassNoise: 4,
                heatCoeff: 5,
                airCoeff: 9,
                glassPrice: 465
              }
            ],
            [
              {
                glassId: 163,
                glassName: 'Зеркальный 4/16/4',
                glassUrl: 'img/glasses/glass1.png',
                glassDescrip: '1 камера',
                glassNoise: 2,
                heatCoeff: 2,
                airCoeff: 9,
                glassPrice:  678
              },
              {
                glassId: 167,
                glassName: 'Зеркальный 4/10/4/10/4',
                glassUrl: 'img/glasses/glass2.png',
                glassDescrip: '2 камеры',
                glassNoise: 4,
                heatCoeff: 3,
                airCoeff: 9,
                glassPrice: 793
              }
            ],
            [
              {
                glassId: 171,
                glassName: 'Матовый 4/16/4',
                glassUrl: 'img/glasses/glass1.png',
                glassDescrip: '1 камера',
                glassNoise: 2,
                heatCoeff: 2,
                airCoeff: 9,
                glassPrice: 678
              },
              {
                glassId: 174,
                glassName: 'Матовый 4/10/4/10/4',
                glassUrl: 'img/glasses/glass2.png',
                glassDescrip: '2 камеры',
                glassNoise: 4,
                heatCoeff: 3,
                airCoeff: 9,
                glassPrice:  793
              }
            ],
            [
              {
                glassId: 182,
                glassName: 'Бр. 2сл.(225мк) 4/16/4',
                glassUrl: 'img/glasses/glass1.png',
                glassDescrip: '1 камера',
                glassNoise: 2,
                heatCoeff: 2,
                airCoeff: 9,
                glassPrice: 1038
              },
              {
                glassId: 186,
                glassName: 'Бр. 3сл.(336мк) 6/12/6',
                glassUrl: 'img/glasses/glass1.png',
                glassDescrip: '1 камера',
                glassNoise: 4,
                heatCoeff: 2,
                airCoeff: 9,
                glassPrice: 1234
              },
              {
                glassId: 177,
                glassName: 'Бр. 2сл.(225мк) 4/10/4/10/4',
                glassUrl: 'img/glasses/glass2.png',
                glassDescrip: '2 камеры',
                glassNoise: 4,
                heatCoeff: 3,
                airCoeff: 9,
                glassPrice: 1153
              },
              {
                glassId: 221,
                glassName: 'Бр. 3сл.(336мк) 4/10/4/10/4',
                glassUrl: 'img/glasses/glass2.png',
                glassDescrip: '2 камеры',
                glassNoise: 4,
                heatCoeff: 3,
                airCoeff: 9,
                glassPrice: 1321
              }
            ]
          ]
        }));
      },

      getAllHardware: function (callback) {
        callback(new OkResult({
          hardwaresTypes: [
            'AXOR',
           // 'Мако',  //закомментировал А.С.
            'Другие...'
          ],
          hardwares: [
            [
              {
                hardwareId: 20,
                hardwareName: 'Komfort Line K-3',
                hardwareProducer: 'AXOR',
                hardwareCountry: 'Украина',
                hardwareLogo: 'img/hardware-logos/axor.png',
                hardwareLink: '#',
                hardwareNoise: 4,
                heatCoeff: 4,
                airCoeff: 5,
                hardwarePrice: 150
              }
             /* {
                hardwareId: 2,
                hardwareName: 'ACCADO 7mm',
                hardwareProducer: 'ACCADO',
                hardwareCountry: 'Турция',
                hardwareLogo: 'img/hardware-logos/accado.png',
                hardwareLink: '#',
                hardwareHeat: 2,
                hardwareNoise: 5,
                hardwarePrice: 200
             }
         */    ],
           /* [
              {
                hardwareId: 1,
                hardwareName: 'ACCADO 7mm',
                hardwareProducer: 'Мако',
                hardwareCountry: 'Турция',
                hardwareLogo: 'img/hardware-logos/maco.png',
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
                hardwareLogo: 'img/hardware-logos/maco.png',
                hardwareLink: '#',
                hardwareHeat: 3,
                hardwareNoise: 1,
                hardwarePrice: 800
              }
           ],
           */ [
               {
                hardwareId: 21,
                hardwareName: 'Roto NT',
                hardwareProducer: 'Roto',
                hardwareCountry: 'Germany',
                hardwareLogo: 'img/hardware-logos/roto.png',
                hardwareLink: '#',
                hardwareNoise: 4,
                heatCoeff: 5,
                airCoeff: 9,
                hardwarePrice: 250
              },
              {
                hardwareId: 22,
                hardwareName: 'MACO MULTI TREND',
                hardwareProducer: 'MACO',
                hardwareCountry: 'Austria',
                hardwareLogo: 'img/hardware-logos/maco.png',
                hardwareLink: '#',
                hardwareNoise: 5,
                heatCoeff: 4,
                airCoeff: 3,
                hardwarePrice: 290
              }
            ]
          ]
        }));
      },

      getAllLamination: function (callback) {
        callback(new OkResult({
          laminationWhite: 'без ламин.',
          laminationInside: [
            {
              laminationId: 1,
              laminationName: 'светлый дуб',
              laminationUrl: 'img/lamination/Birch.png',
              laminationPrice: 547
            },
            {
              laminationId: 2,
              laminationName: 'золотой дуб',
              laminationUrl: 'img/lamination/GoldenOak.png',
              laminationPrice: 547
            },
            {
              laminationId: 3,
              laminationName: 'береза',
              laminationUrl: 'img/lamination/LightOak.png',
              laminationPrice: 547
            },
            {
              laminationId: 4,
              laminationName: 'махагон',
              laminationUrl: 'img/lamination/Mahagon.png',
              laminationPrice: 547
            },
            {
              laminationId: 5,
              laminationName: 'сосна',
              laminationUrl: 'img/lamination/Pine.png',
              laminationPrice: 547
            }
          ],
          laminationOutside: [

            {
              laminationId: 1,
              laminationName: 'светлый дуб',
              laminationUrl: 'img/lamination/Birch.png',
              laminationPrice: 547
            },
            {
              laminationId: 2,
              laminationName: 'золотой дуб',
              laminationUrl: 'img/lamination/GoldenOak.png',
              laminationPrice: 547
            },
            {
              laminationId: 3,
              laminationName: 'береза',
              laminationUrl: 'img/lamination/LightOak.png',
              laminationPrice: 547
            },
            {
              laminationId: 4,
              laminationName: 'махагон',
              laminationUrl: 'img/lamination/Mahagon.png',
              laminationPrice: 547
            },
            {
              laminationId: 5,
              laminationName: 'сосна',
              laminationUrl: 'img/lamination/Pine.png',
              laminationPrice: 547
            }

          ]
        }));
      },


      getAllGrids: function (callback) {
        callback(new OkResult({

          elementType: [
            'внутренние',
            'внешние'
          ],
          elementsList: [
            [
              {
                elementId: 585,
                elementName: 'Сетка СO-100',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 585,
                elementName: 'Сетка СO-200',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 585,
                elementName: 'Сетка СO-200',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 585,
                elementName: 'Сетка СO-300',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 585,
                elementName: 'Сетка СO-300',
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },

      getAllVisors: function (callback) {
        callback(new OkResult({

          elementType: [
            'стандартные',
            'оцинкованные',
            'Матовые'
          ],
          elementsList: [
            [
              {
                elementId: 210675,
                elementName: 'Козырек белый 100мм',
                elementWidth: 1500,
                elementQty: 1
              },
              {
                elementId: 210676,
                elementName: 'Козырек белый 200мм',
                elementWidth: 1500,
                elementQty: 1
              },
              {
                elementId: 210677,
                elementName: 'Козырек белый 300мм',
                elementWidth: 1500,
                elementQty: 1
              }
            ],
            [
              {
                elementId: 210687,
                elementName: 'Козырек 100мм оцинкованный',
                elementWidth: 1500,
                elementQty: 1
              },
              {
                elementId: 210693,
                elementName: 'Козырек 200мм оцинкованный',
                elementWidth: 1500,
                elementQty: 1
              },
              {
                elementId: 210694,
                elementName: 'Козырек 300мм оцинкованный',
                elementWidth: 1500,
                elementQty: 1
              },
              {
                elementId: 210695,
                elementName: 'Козырек 400мм оцинкованный',
                elementWidth: 1500,
                elementQty: 1
              },
              {
                elementId: 210696,
                elementName: 'Козырек 500мм оцинкованный',
                elementWidth: 1500,
                elementQty: 1
              }
            ],
            [
              {
                elementId: 210697,
                elementName: 'Козырёк нестандартный',
                elementWidth: 1500,
                elementQty: 1
              }
            ]
          ]

        }));
      },

      getAllSpillways: function (callback) {
        callback(new OkResult({

          elementType: [
            'стандартные',
            'оцинкованные',
            'нестандартные'
          ],
          elementsList: [
            [
              {
                elementId: 497,
                elementType: 'Отлив белый 200мм',
                elementName: 'Отлив КO-200',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 498,
                elementType: 'Стандартные',
                elementName: 'Отлив коричневый 260мм',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 547,
                elementType: 'оцинкованный',
                elementName: 'Отлив оцинкованный 20мм',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 571,
                elementType: 'оцинкованный',
                elementName: 'Отлив оцинкованный 50мм',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 540,
                elementType: 'нестандартные',
                elementName: 'Отлив нестандартный',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },

      getAllOutsideSlope: function (callback) {
        callback(new OkResult({

          elementType: [
            'стандартные'
          ],
          elementsList: [
            [
              {
                elementId: 89349,
                elementType: 'Стандартные',
                elementName: 'Откос пластиковый',
                elementWidth: 200,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 89350,
                elementType: 'Стандартные',
                elementName: 'Откос гипсокартонный',
                elementWidth: 200,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 89351,
                elementType: 'Стандартные',
                elementName: 'Откос песчаноцементный',
                elementWidth: 200,
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },


      getAllInsideSlope: function (callback) {
        callback(new OkResult({

          elementType: [
            'стандартные'
          ],
          elementsList: [
            [
              {
                elementId: 89349,
                elementType: 'Стандартные',
                elementName: 'Откос пластиковый',
                elementWidth: 200,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 89350,
                elementType: 'Стандартные',
                elementName: 'Откос гипсокартонный',
                elementWidth: 200,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 89351,
                elementType: 'Стандартные',
                elementName: 'Откос песчаноцементный',
                elementWidth: 200,
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },


      getAllLouvers: function (callback) {
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
                elementName: 'Жалюзи КO-200',
                elementWidth: 700,
                elementHeight: 700,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementType: 'Стандартные',
                elementName: 'Жалюзи КO-300, оцинкованный',
                elementWidth: 700,
                elementHeight: 700,
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 1,
                elementType: 'оцинкованный',
                elementName: 'Жалюзи КO-100, оцинкованный',
                elementWidth: 700,
                elementHeight: 700,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementType: 'оцинкованный',
                elementName: 'Жалюзи КO-300',
                elementWidth: 700,
                elementHeight: 700,
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 1,
                elementType: 'Матовые',
                elementName: 'Жалюзи КO-300',
                elementWidth: 700,
                elementHeight: 700,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementType: 'Матовые',
                elementName: 'Жалюзи КO-300',
                elementWidth: 700,
                elementHeight: 700,
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },


      getAllConnectors: function (callback) {
        callback(new OkResult({

          elementType: [
            'стандартные',
            'усиленные',
            'балконные'
          ],
          elementsList: [
            [
              {
                elementId: 577,
                elementName: 'Соединитель стандартный 5/10',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 577,
                elementName: 'Соединитель стандартный 3/10',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 577,
                elementName: 'Соединитель усиленный 5/13',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 577,
                elementName: 'Соединитель балконный 5/13',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },

      getAllFans: function (callback) {
        callback(new OkResult({

          elementType: [
            'Стандартные',
            'GECCO',
            'Aereco'
          ],
          elementsList: [
            [
              {
                elementId: 1,
                elementName: 'С-ма прит. вентиляции 4-х ст.',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementName: 'С-ма вентиляции 4-х ст.',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 1,
                elementName: 'Система приточной вентиляции помещений GECCO',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementName: 'GECCO Система вентиляции помещений',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 1,
                elementName: 'Aereco С-ма оконной вентиляции',
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
            'LIGNODUR',
            'ДАНКЕ',
            'OpenTeck'
          ],
          elementsList: [
            [
              {
                elementId: 333,
                elementType: 'Матовые',
                elementName: 'LIGNODUR 200 мм белый',
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 334,
                elementType: 'Матовые',
                elementName: 'LIGNODUR 300 мм белый',
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 335,
                elementType: 'Матовые',
                elementName: 'LIGNODUR 400 мм белый',
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 341,
                elementType: 'Матовые',
                elementName: 'ДАНКЕ 100 мм белый матовый',
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 342,
                elementType: 'Матовые',
                elementName: 'ДАНКЕ 300 мм белый матовый',
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 301,
                elementType: 'Матовые',
                elementName: 'OpenTeck 100 мм белый',
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 302,
                elementType: 'Матовые',
                elementName: 'OpenTeck 200 мм белый',
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 303,
                elementType: 'Матовые',
                elementName: 'OpenTeck 300 мм белый',
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 304,
                elementType: 'Матовые',
                elementName: 'OpenTeck 400 мм белый',
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },

      getAllHandles: function (callback) {
        callback(new OkResult({

          elementType: [
            'Стандартные',
            'HOPPE',
            'нестандартные'
          ],
          elementsList: [
            [
              {
                elementId: 586,
                elementName: 'Ручка оконная белая',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 587,
                elementName: 'Ручка оконная с ключом белая',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 588,
                elementName: 'Ручка HOPPE (Tokyo) белая',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 589,
                elementName: 'Ручка HOPPE (Tokyo) серебр.',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 586,
                elementName: 'Ручка нестандартная',
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },


      getAllOthers: function (callback) {
        callback(new OkResult({

          elementType: [
            'стандартные',
            'усиленные',
            'балконные'
          ],
          elementsList: [
            [
              {
                elementId: 1,
                elementName: 'Армирование квадрат 40х40',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementName: 'Штифт верхней петли',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 3,
                elementName: 'П-О запор NT константный 170 (481-600), KS',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 1,
                elementName: 'Армирующий профиль 15х30',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementName: 'Нижняя петля на раме K3/100',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 1,
                elementName: 'Поворотная петля Komfort 12/20-13 левая',
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
            laminationUrl: 'img/lamination/empty.png'
          },
          laminationWhiteGlossy: {
            laminationName: 'Белый',
            laminationLabel: 'глянцевый',
            laminationUrl: 'img/lamination/empty.png'
          },
          laminations: [
            {
              laminationId: 1,
              laminationName: 'светлый дуб',
              laminationUrl: 'img/lamination/Birch.png',
              laminationPrice: 100
            },
            {
              laminationId: 2,
              laminationName: 'золотой дуб',
              laminationUrl: 'img/lamination/GoldenOak.png',
              laminationPrice: 100
            },
            {
              laminationId: 3,
              laminationName: 'береза',
              laminationUrl: 'img/lamination/LightOak.png',
              laminationPrice: 100
            },
            {
              laminationId: 4,
              laminationName: 'махагон',
              laminationUrl: 'img/lamination/Mahagon.png',
              laminationPrice: 100
            },
            {
              laminationId: 5,
              laminationName: 'сосна',
              laminationUrl: 'img/lamination/Pine.png',
              laminationPrice: 100
            }
          ]
        }));
      },

      // TODO: Сервис готов
      getConstructNoteText: function (callback) {
        callback(new OkResult({
          note: 'Срочный заказ'
        }));
      },



      getFloorPrice: function (callback) {
        callback(new OkResult({

          floors: [
            {
              name: 1,
              price: 100
            },
            {
              name: 2,
              price: 200
            },
            {
              name: 3,
              price: 300
            },
            {
              name: 4,
              price: 400
            },
            {
              name: 5,
              price: 500
            }
          ]

        }));
      },

      getAssemblingPrice: function (callback) {
        callback(new OkResult({

          assembling: [
            {
              name: 'без демонтажа',
              price: 200
            },
            {
              name: 'стандартный',
              price: 300
            },
            {
              name: 'VIP-монтаж',
              price: 400
            }
          ]

        }));
      },

      getInstalment: function (callback) {
        callback(new OkResult({

          instalment: [
            {
              period: 1,
              percent: 15
            },
            {
              period: 2,
              percent: 20
            },
            {
              period: 3,
              percent: 25
            },
            {
              period: 4,
              percent: 30
            },
            {
              period: 5,
              percent: 35
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
              shapeLabel: 'по периметру',
              shapeIcon: 'img/door-config/doorstep.png',
              shapeIconSelect: 'img/door-config-selected/doorstep.png'
            },
            {
              shapeId: 2,
              shapeLabel: 'без порога',
              shapeIcon: 'img/door-config/no-doorstep.png',
              shapeIconSelect: 'img/door-config-selected/no-doorstep.png'
            },
            {
              shapeId: 3,
              shapeLabel: 'алюминевый порог, тип1',
              shapeIcon: 'img/door-config/doorstep-al1.png',
              shapeIconSelect: 'img/door-config-selected/doorstep-al1.png'
            },
            {
              shapeId: 4,
              shapeLabel: 'алюминевый порог, тип2',
              shapeIcon: 'img/door-config/doorstep-al2.png',
              shapeIconSelect: 'img/door-config-selected/doorstep-al2.png'
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
              shapeIcon: 'img/door-config/lever-handle.png',
              shapeIconSelect: 'img/door-config-selected/lever-handle.png'
            },
            {
              shapeId: 2,
              shapeLabel: 'стандартная офисная ручка',
              shapeIcon: 'img/door-config/standart-handle.png',
              shapeIconSelect: 'img/door-config-selected/standart-handle.png'
            }
          ],

          lockType: [
            {
              shapeId: 1,
              shapeLabel: 'однозапорный с защелкой',
              shapeIcon: 'img/door-config/onelock.png',
              shapeIconSelect: 'img/door-config-selected/onelock.png'
            },
            {
              shapeId: 2,
              shapeLabel: 'многозапорный с защелкой',
              shapeIcon: 'img/door-config/multilock.png',
              shapeIconSelect: 'img/door-config-selected/multilock.png'
            }
          ]


        }));
      }

    }


  }
})();