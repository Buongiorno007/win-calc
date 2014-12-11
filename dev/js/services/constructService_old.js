"use strict";

BauVoiceApp.factory('constructService', function ($q) {

  // SQL requests for select data from tables
  var selectLaminations = "SELECT id, name FROM lamination_colors ORDER BY id",
    selectProfileSystemFolders = "SELECT id, name FROM profile_system_folders order by position",
    //selectProfileSystems = "SELECT profile_systems.id, profile_system_folders.name as folder_name, profile_systems.name, profile_systems.short_name, profile_systems.country FROM profile_systems LEFT JOIN profile_system_folders ON  profile_systems.profile_system_folder_id = profile_system_folders.id WHERE profile_system_folder_id = ? order by profile_systems.id", // position
    selectProfileSystems = "SELECT profile_systems.id, profile_system_folders.name as folder_name, profile_systems.name, profile_systems.short_name, profile_systems.country, rama_list_id, rama_still_list_id, stvorka_list_id, impost_list_id, shtulp_list_id FROM profile_systems LEFT JOIN profile_system_folders ON  profile_systems.profile_system_folder_id = profile_system_folders.id WHERE profile_system_folder_id = ? order by profile_systems.id",
    selectWindowHardware = "SELECT id, name, short_name as shortName FROM window_hardware_groups WHERE is_in_calculation = 1",
    selectSectionSize = "SELECT id, a, b, c, d FROM lists WHERE id = ?";

  return {

    // TODO: Сервис готов
    getRoomInfo: function (callback) {
      callback(new OkResult({
        roomInfo: [
          {
            id: 1,
            current: false,
            name: 'Кухня',
            airCirculation: 90
          },
          {
            id: 2,
            current: false,
            name: 'Гостиная',
            airCirculation: 50
          },
          {
            id: 3,
            name: 'Балкон',
            current: false,
            airCirculation: 0
          },
          {
            id: 4,
            name: 'Детская',
            current: true,
            airCirculation: 30
          },
          {
            id: 5,
            name: 'Спальня',
            current: false,
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

    getDefaultConstructTemplate: function(callback) {
      callback(new OkResult({
        windows: [
          {
            'name': 'Одностворчатый глухой',
            'objects': [
              //------- main points
              {'type': 'fixed_point', id: 'fp1', x: '0', y: '0'},
              {'type': 'fixed_point', id: 'fp2', x: '1300', y: '0'},
              {'type': 'fixed_point', id: 'fp3', x: '1300', y: '1400'},
              {'type': 'fixed_point', id: 'fp4', x: '0', y: '1400'},
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
              /*
               {'type': 'cross_point_bead', id: 'cpbead1', line1: 'frameinline1', line2: 'frameinline2'},
               {'type': 'cross_point_bead', id: 'cpbead2', line1: 'frameinline2', line2: 'frameinline3'},
               {'type': 'cross_point_bead', id: 'cpbead3', line1: 'frameinline3', line2: 'frameinline4'},
               {'type': 'cross_point_bead', id: 'cpbead4', line1: 'frameinline4', line2: 'frameinline1'},
               {'type':'bead_box_line', id:'beadline1', from:'cpbead4', to:'cpbead1'},
               {'type':'bead_box_line', id:'beadline2', from:'cpbead1', to:'cpbead2'},
               {'type':'bead_box_line', id:'beadline3', from:'cpbead2', to:'cpbead3'},
               {'type':'bead_box_line', id:'beadline4', from:'cpbead3', to:'cpbead4'}
               */
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
              /*
               {'type': 'bead_box', id:'bead1', parts: ['frameinline1', 'beadline1']},
               {'type': 'bead_box', id:'bead2', parts: ['frameinline2', 'beadline2']},
               {'type': 'bead_box', id:'bead3', parts: ['frameinline3', 'beadline3']},
               {'type': 'bead_box', id:'bead4', parts: ['frameinline4', 'beadline4']},
               */
              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Одностворчатый',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
              {'type':'fixed_point', id:'fp2', x:'700', y:'0'},
              {'type':'fixed_point', id:'fp3', x:'700', y:'1400'},
              {'type':'fixed_point', id:'fp4', x:'0', y:'1400'},
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
              {'type': 'cross_point_sash_out', id: 'cpsout1', line1: 'frameinline1', line2: 'frameinline2'},
              {'type': 'cross_point_sash_out', id: 'cpsout2', line1: 'frameinline2', line2: 'frameinline3'},
              {'type': 'cross_point_sash_out', id: 'cpsout3', line1: 'frameinline3', line2: 'frameinline4'},
              {'type': 'cross_point_sash_out', id: 'cpsout4', line1: 'frameinline4', line2: 'frameinline1'},
              {'type': 'cross_point_sash_in', id: 'cpsin1', line1: 'frameinline1', line2: 'frameinline2'},
              {'type': 'cross_point_sash_in', id: 'cpsin2', line1: 'frameinline2', line2: 'frameinline3'},
              {'type': 'cross_point_sash_in', id: 'cpsin3', line1: 'frameinline3', line2: 'frameinline4'},
              {'type': 'cross_point_sash_in', id: 'cpsin4', line1: 'frameinline4', line2: 'frameinline1'},
              {'type': 'sash_out_line', id: 'sashoutline1', from: 'cpsout4', to: 'cpsout1'},
              {'type': 'sash_out_line', id: 'sashoutline2', from: 'cpsout1', to: 'cpsout2'},
              {'type': 'sash_out_line', id: 'sashoutline3', from: 'cpsout2', to: 'cpsout3'},
              {'type': 'sash_out_line', id: 'sashoutline4', from: 'cpsout3', to: 'cpsout4'},
              {'type': 'sash_line', id: 'sashline1', from: 'cpsin4', to: 'cpsin1'},
              {'type': 'sash_line', id: 'sashline2', from: 'cpsin1', to: 'cpsin2'},
              {'type': 'sash_line', id: 'sashline3', from: 'cpsin2', to: 'cpsin3'},
              {'type': 'sash_line', id: 'sashline4', from: 'cpsin3', to: 'cpsin4'},
              //----------- bead box
              /*
              {'type': 'cross_point_bead', id: 'cpbead1', line1: 'sashline1', line2: 'sashline2'},
              {'type': 'cross_point_bead', id: 'cpbead2', line1: 'sashline2', line2: 'sashline3'},
              {'type': 'cross_point_bead', id: 'cpbead3', line1: 'sashline3', line2: 'sashline4'},
              {'type': 'cross_point_bead', id: 'cpbead4', line1: 'sashline4', line2: 'sashline1'},
              {'type':'bead_box_line', id:'beadline1', from:'cpbead4', to:'cpbead1'},
              {'type':'bead_box_line', id:'beadline2', from:'cpbead1', to:'cpbead2'},
              {'type':'bead_box_line', id:'beadline3', from:'cpbead2', to:'cpbead3'},
              {'type':'bead_box_line', id:'beadline4', from:'cpbead3', to:'cpbead4'}
               */
              //----- glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameinline1', line2: 'frameinline2', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameinline2', line2: 'frameinline3', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameinline3', line2: 'frameinline4', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameinline4', line2: 'frameinline1', blockType: 'sash'},
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
              /*
               {'type': 'bead_box', id:'bead1', parts: ['sashline1', 'beadline1']},
               {'type': 'bead_box', id:'bead2', parts: ['sashline2', 'beadline2']},
               {'type': 'bead_box', id:'bead3', parts: ['sashline3', 'beadline3']},
               {'type': 'bead_box', id:'bead4', parts: ['sashline4', 'beadline4']},
               */
              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Двухстворчатый',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
              {'type':'fixed_point', id:'fp2', x:'1060', y:'0'},
              {'type':'fixed_point', id:'fp3', x:'1060', y:'1320'},
              {'type':'fixed_point', id:'fp4', x:'0', y:'1320'},
              {'type':'fixed_point_impost', id:'fpimpost1', x:'530', y:'0'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:'530', y:'1320'},
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
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'impostcenterline1', line2: 'frameinline1'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameinline1'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'impostcenterline2', line2: 'frameinline3'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameinline3'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},
              //-------- sash
              {'type': 'cross_point_sash_out', id: 'cpsout1', line1: 'frameinline1', line2: 'frameinline2'},
              {'type': 'cross_point_sash_out', id: 'cpsout2', line1: 'frameinline2', line2: 'frameinline3'},
              {'type': 'cross_point_sash_out', id: 'cpsout3', line1: 'frameinline3', line2: 'impostinline1'},
              {'type': 'cross_point_sash_out', id: 'cpsout4', line1: 'impostinline1', line2: 'frameinline1'},
              {'type': 'cross_point_sash_in', id: 'cpsin1', line1: 'frameinline1', line2: 'frameinline2'},
              {'type': 'cross_point_sash_in', id: 'cpsin2', line1: 'frameinline2', line2: 'frameinline3'},
              {'type': 'cross_point_sash_in', id: 'cpsin3', line1: 'frameinline3', line2: 'impostinline2'},
              {'type': 'cross_point_sash_in', id: 'cpsin4', line1: 'impostinline2', line2: 'frameinline1'},
              {'type': 'sash_out_line', id: 'sashoutline1', from: 'cpsout4', to: 'cpsout1'},
              {'type': 'sash_out_line', id: 'sashoutline2', from: 'cpsout1', to: 'cpsout2'},
              {'type': 'sash_out_line', id: 'sashoutline3', from: 'cpsout2', to: 'cpsout3'},
              {'type': 'sash_out_line', id: 'sashoutline4', from: 'cpsout3', to: 'cpsout4'},
              {'type': 'sash_line', id: 'sashline1', from: 'cpsin4', to: 'cpsin1'},
              {'type': 'sash_line', id: 'sashline2', from: 'cpsin1', to: 'cpsin2'},
              {'type': 'sash_line', id: 'sashline3', from: 'cpsin2', to: 'cpsin3'},
              {'type': 'sash_line', id: 'sashline4', from: 'cpsin3', to: 'cpsin4'},
              //----------- bead box
              /*
               {'type': 'cross_point_bead', id: 'cpbead1', line1: 'frameinline1', line2: 'impostinline1'},
               {'type': 'cross_point_bead', id: 'cpbead2', line1: 'impostinline1', line2: 'frameinline3'},
               {'type': 'cross_point_bead', id: 'cpbead3', line1: 'frameinline3', line2: 'frameinline4'},
               {'type': 'cross_point_bead', id: 'cpbead4', line1: 'frameinline4', line2: 'frameinline1'},
               {'type':'bead_box_line', id:'beadline1', from:'cpbead4', to:'cpbead1'},
               {'type':'bead_box_line', id:'beadline2', from:'cpbead1', to:'cpbead2'},
               {'type':'bead_box_line', id:'beadline3', from:'cpbead2', to:'cpbead3'},
               {'type':'bead_box_line', id:'beadline4', from:'cpbead3', to:'cpbead4'}

               {'type': 'cross_point_bead', id: 'cpbead5', line1: 'sashline1', line2: 'sashline2'},
               {'type': 'cross_point_bead', id: 'cpbead6', line1: 'sashline2', line2: 'sashline3'},
               {'type': 'cross_point_bead', id: 'cpbead7', line1: 'sashline3', line2: 'sashline4'},
               {'type': 'cross_point_bead', id: 'cpbead8', line1: 'sashline4', line2: 'sashline1'},
               {'type':'bead_box_line', id:'beadline5', from:'cpbead8', to:'cpbead5'},
               {'type':'bead_box_line', id:'beadline6', from:'cpbead5', to:'cpbead6'},
               {'type':'bead_box_line', id:'beadline7', from:'cpbead6', to:'cpbead7'},
               {'type':'bead_box_line', id:'beadline8', from:'cpbead7', to:'cpbead8'}
               */
              //----- left glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame', isImpost: true},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline3', line2: 'impostcenterline1', blockType: 'frame', isImpost: true},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame', isImpost: false},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame', isImpost: false},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //----- right glass
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameinline1', line2: 'frameinline2', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'frameinline2', line2: 'frameinline3', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameinline3', line2: 'impostinline2', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'impostinline2', line2: 'frameinline1', blockType: 'sash'},
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
              {'type': 'sash', id: 'sash1', parts: ['sashoutline1', 'sashline1']},
              {'type': 'sash', id: 'sash2', parts: ['sashoutline2', 'sashline2'], openType: ['sashline2', 'sashline4']},
              {'type': 'sash', id: 'sash3', parts: ['sashoutline3', 'sashline3'], openType: ['sashline3', 'sashline1']},
              {'type': 'sash', id: 'sash4', parts: ['sashoutline4', 'sashline4']},
              /*
               {'type': 'bead_box', id:'bead1', parts: ['frameinline1', 'beadline1']},
               {'type': 'bead_box', id:'bead2', parts: ['impostinline1', 'beadline2']},
               {'type': 'bead_box', id:'bead3', parts: ['frameinline3', 'beadline3']},
               {'type': 'bead_box', id:'bead4', parts: ['frameinline4', 'beadline4']},

               {'type': 'bead_box', id:'bead5', parts: ['sashline1', 'beadline5']},
               {'type': 'bead_box', id:'bead6', parts: ['sashline2', 'beadline6']},
               {'type': 'bead_box', id:'bead7', parts: ['sashline3', 'beadline7']},
               {'type': 'bead_box', id:'bead8', parts: ['sashline4', 'beadline8']},
               */
              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1'], level: 3, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          },
          {
            'name':'Трехстворчатый',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
              {'type':'fixed_point', id:'fp2', x:'2100', y:'0'},
              {'type':'fixed_point', id:'fp3', x:'2100', y:'1400'},
              {'type':'fixed_point', id:'fp4', x:'0', y:'1400'},
              {'type':'fixed_point_impost', id:'fpimpost1', x:'700', y:'0'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:'700', y:'1400'},
              {'type':'fixed_point_impost', id:'fpimpost3', x:'1400', y:'0'},
              {'type':'fixed_point_impost', id:'fpimpost4', x:'1400', y:'1400'},
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
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1'},
              {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4'},
              {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'impostcenterline1', line2: 'frameinline1'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameinline1'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'impostcenterline2', line2: 'frameinline3'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameinline3'},
              {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline3', line2: 'frameinline1'},
              {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'frameinline1'},
              {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'impostcenterline4', line2: 'frameinline3'},
              {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameinline3'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},
              {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
              {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},
              //-------- sash
              {'type': 'cross_point_sash_out', id: 'cpsout1', line1: 'frameinline1', line2: 'impostinline4'},
              {'type': 'cross_point_sash_out', id: 'cpsout2', line1: 'impostinline4', line2: 'frameinline3'},
              {'type': 'cross_point_sash_out', id: 'cpsout3', line1: 'frameinline3', line2: 'impostinline1'},
              {'type': 'cross_point_sash_out', id: 'cpsout4', line1: 'impostinline1', line2: 'frameinline1'},
              {'type': 'cross_point_sash_in', id: 'cpsin1', line1: 'frameinline1', line2: 'impostinline3'},
              {'type': 'cross_point_sash_in', id: 'cpsin2', line1: 'impostinline3', line2: 'frameinline3'},
              {'type': 'cross_point_sash_in', id: 'cpsin3', line1: 'frameinline3', line2: 'impostinline2'},
              {'type': 'cross_point_sash_in', id: 'cpsin4', line1: 'impostinline2', line2: 'frameinline1'},
              {'type': 'sash_out_line', id: 'sashoutline1', from: 'cpsout4', to: 'cpsout1'},
              {'type': 'sash_out_line', id: 'sashoutline2', from: 'cpsout1', to: 'cpsout2'},
              {'type': 'sash_out_line', id: 'sashoutline3', from: 'cpsout2', to: 'cpsout3'},
              {'type': 'sash_out_line', id: 'sashoutline4', from: 'cpsout3', to: 'cpsout4'},
              {'type': 'sash_line', id: 'sashline1', from: 'cpsin4', to: 'cpsin1'},
              {'type': 'sash_line', id: 'sashline2', from: 'cpsin1', to: 'cpsin2'},
              {'type': 'sash_line', id: 'sashline3', from: 'cpsin2', to: 'cpsin3'},
              {'type': 'sash_line', id: 'sashline4', from: 'cpsin3', to: 'cpsin4'},
              //----------- bead box
              /*
               {'type': 'cross_point_bead', id: 'cpbead1', line1: 'frameinline1', line2: 'impostinline1'},
               {'type': 'cross_point_bead', id: 'cpbead2', line1: 'impostinline1', line2: 'frameinline3'},
               {'type': 'cross_point_bead', id: 'cpbead3', line1: 'frameinline3', line2: 'frameinline4'},
               {'type': 'cross_point_bead', id: 'cpbead4', line1: 'frameinline4', line2: 'frameinline1'},
               {'type':'bead_box_line', id:'beadline1', from:'cpbead4', to:'cpbead1'},
               {'type':'bead_box_line', id:'beadline2', from:'cpbead1', to:'cpbead2'},
               {'type':'bead_box_line', id:'beadline3', from:'cpbead2', to:'cpbead3'},
               {'type':'bead_box_line', id:'beadline4', from:'cpbead3', to:'cpbead4'}

               {'type': 'cross_point_bead', id: 'cpbead5', line1: 'sashline1', line2: 'sashline2'},
               {'type': 'cross_point_bead', id: 'cpbead6', line1: 'sashline2', line2: 'sashline3'},
               {'type': 'cross_point_bead', id: 'cpbead7', line1: 'sashline3', line2: 'sashline4'},
               {'type': 'cross_point_bead', id: 'cpbead8', line1: 'sashline4', line2: 'sashline1'},
               {'type':'bead_box_line', id:'beadline5', from:'cpbead8', to:'cpbead5'},
               {'type':'bead_box_line', id:'beadline6', from:'cpbead5', to:'cpbead6'},
               {'type':'bead_box_line', id:'beadline7', from:'cpbead6', to:'cpbead7'},
               {'type':'bead_box_line', id:'beadline8', from:'cpbead7', to:'cpbead8'}
               */
              //---- left glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame', isImpost: true},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline3', line2: 'impostcenterline1', blockType: 'frame', isImpost: true},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame', isImpost: false},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame', isImpost: false},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //----- center glass
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameinline1', line2: 'impostinline3', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostinline3', line2: 'frameinline3', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameinline3', line2: 'impostinline2', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'impostinline2', line2: 'frameinline1', blockType: 'sash'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
              //------ right glass
              {'type': 'cross_point_glass', id: 'cpg9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame', isImpost: false},
              {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame', isImpost: false},
              {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame', isImpost: true},
              {'type': 'cross_point_glass', id: 'cpg12', line1: 'frameline1', line2: 'impostcenterline4', blockType: 'frame', isImpost: true},
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
              {'type': 'sash', id: 'sash1', parts: ['sashoutline1', 'sashline1']},
              {'type': 'sash', id: 'sash2', parts: ['sashoutline2', 'sashline2'], openType: ['sashline2', 'sashline4']},
              {'type': 'sash', id: 'sash3', parts: ['sashoutline3', 'sashline3'], openType: ['sashline3', 'sashline1']},
              {'type': 'sash', id: 'sash4', parts: ['sashoutline4', 'sashline4']},
              /*
               {'type': 'bead_box', id:'bead1', parts: ['frameinline1', 'beadline1']},
               {'type': 'bead_box', id:'bead2', parts: ['impostinline1', 'beadline2']},
               {'type': 'bead_box', id:'bead3', parts: ['frameinline3', 'beadline3']},
               {'type': 'bead_box', id:'bead4', parts: ['frameinline4', 'beadline4']},

               {'type': 'bead_box', id:'bead5', parts: ['sashline1', 'beadline5']},
               {'type': 'bead_box', id:'bead6', parts: ['sashline2', 'beadline6']},
               {'type': 'bead_box', id:'bead7', parts: ['sashline3', 'beadline7']},
               {'type': 'bead_box', id:'bead8', parts: ['sashline4', 'beadline8']},
               */
              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
              //{'type': 'dimensionsH', id: 'dimH1', from: ['fp4', 'fp1'], to: ['fpimpost2', 'fpimpost1'], level: 1, height: 150, side: 'bottom'},
              //{'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost2', 'fpimpost1'], to: ['fpimpost4', 'fpimpost3'], level: 1, height: 150, side: 'bottom'},
              {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH', 'dimH3'], links: ['fpimpost1', 'fpimpost2'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost1', 'fpimpost2'], to: ['fpimpost3', 'fpimpost4'], limits: ['overallDimH', 'dimH1'], links: ['fpimpost3', 'fpimpost4'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsH', id: 'dimH3', from: ['fpimpost3', 'fpimpost4'], to: ['fp2', 'fp3'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1', 'dimH2'], level: 3, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
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
              {'type': 'frame_line', id: 'frameline7', from: 'fp7', to: 'fp8'},
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
              {'type': 'cross_point_sash_out', id: 'cpsout1', line1: 'frameinline5', line2: 'frameinline6'},
              {'type': 'cross_point_sash_out', id: 'cpsout2', line1: 'frameinline6', line2: 'frameinline7'},
              {'type': 'cross_point_sash_out', id: 'cpsout3', line1: 'frameinline7', line2: 'frameinline8'},
              {'type': 'cross_point_sash_out', id: 'cpsout4', line1: 'frameinline8', line2: 'frameinline5'},
              {'type': 'cross_point_sash_in', id: 'cpsin1', line1: 'frameinline5', line2: 'frameinline6'},
              {'type': 'cross_point_sash_in', id: 'cpsin2', line1: 'frameinline6', line2: 'frameinline7'},
              {'type': 'cross_point_sash_in', id: 'cpsin3', line1: 'frameinline7', line2: 'frameinline8'},
              {'type': 'cross_point_sash_in', id: 'cpsin4', line1: 'frameinline8', line2: 'frameinline5'},
              {'type': 'sash_out_line', id: 'sashoutline1', from: 'cpsout4', to: 'cpsout1'},
              {'type': 'sash_out_line', id: 'sashoutline2', from: 'cpsout1', to: 'cpsout2'},
              {'type': 'sash_out_line', id: 'sashoutline3', from: 'cpsout2', to: 'cpsout3'},
              {'type': 'sash_out_line', id: 'sashoutline4', from: 'cpsout3', to: 'cpsout4'},
              {'type': 'sash_line', id: 'sashline1', from: 'cpsin4', to: 'cpsin1'},
              {'type': 'sash_line', id: 'sashline2', from: 'cpsin1', to: 'cpsin2'},
              {'type': 'sash_line', id: 'sashline3', from: 'cpsin2', to: 'cpsin3'},
              {'type': 'sash_line', id: 'sashline4', from: 'cpsin3', to: 'cpsin4'},
              //----------- bead box
              /*
               {'type': 'cross_point_bead', id: 'cpbead1', line1: 'frameinline1', line2: 'impostinline1'},
               {'type': 'cross_point_bead', id: 'cpbead2', line1: 'impostinline1', line2: 'frameinline3'},
               {'type': 'cross_point_bead', id: 'cpbead3', line1: 'frameinline3', line2: 'frameinline4'},
               {'type': 'cross_point_bead', id: 'cpbead4', line1: 'frameinline4', line2: 'frameinline1'},
               {'type':'bead_box_line', id:'beadline1', from:'cpbead4', to:'cpbead1'},
               {'type':'bead_box_line', id:'beadline2', from:'cpbead1', to:'cpbead2'},
               {'type':'bead_box_line', id:'beadline3', from:'cpbead2', to:'cpbead3'},
               {'type':'bead_box_line', id:'beadline4', from:'cpbead3', to:'cpbead4'}

               {'type': 'cross_point_bead', id: 'cpbead5', line1: 'sashline1', line2: 'sashline2'},
               {'type': 'cross_point_bead', id: 'cpbead6', line1: 'sashline2', line2: 'sashline3'},
               {'type': 'cross_point_bead', id: 'cpbead7', line1: 'sashline3', line2: 'sashline4'},
               {'type': 'cross_point_bead', id: 'cpbead8', line1: 'sashline4', line2: 'sashline1'},
               {'type':'bead_box_line', id:'beadline5', from:'cpbead8', to:'cpbead5'},
               {'type':'bead_box_line', id:'beadline6', from:'cpbead5', to:'cpbead6'},
               {'type':'bead_box_line', id:'beadline7', from:'cpbead6', to:'cpbead7'},
               {'type':'bead_box_line', id:'beadline8', from:'cpbead7', to:'cpbead8'}
               */
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
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameinline5', line2: 'frameinline6', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'frameinline6', line2: 'frameinline7', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameinline7', line2: 'frameinline8', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'frameinline8', line2: 'frameinline5', blockType: 'sash'},
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
              {'type': 'sash', id: 'sash1', parts: ['sashoutline1', 'sashline1']},
              {'type': 'sash', id: 'sash2', parts: ['sashoutline2', 'sashline2'], openType: ['sashline2', 'sashline4']},
              {'type': 'sash', id: 'sash3', parts: ['sashoutline3', 'sashline3'], openType: ['sashline3', 'sashline1']},
              {'type': 'sash', id: 'sash4', parts: ['sashoutline4', 'sashline4']},
              /*
               {'type': 'bead_box', id:'bead1', parts: ['frameinline1', 'beadline1']},
               {'type': 'bead_box', id:'bead2', parts: ['impostinline1', 'beadline2']},
               {'type': 'bead_box', id:'bead3', parts: ['frameinline3', 'beadline3']},
               {'type': 'bead_box', id:'bead4', parts: ['frameinline4', 'beadline4']},

               {'type': 'bead_box', id:'bead5', parts: ['sashline1', 'beadline5']},
               {'type': 'bead_box', id:'bead6', parts: ['sashline2', 'beadline6']},
               {'type': 'bead_box', id:'bead7', parts: ['sashline3', 'beadline7']},
               {'type': 'bead_box', id:'bead8', parts: ['sashline4', 'beadline8']},
               */
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
            'name':'Трехстворчатый балкон',
            'objects':[
              //------- main points
              {'type':'fixed_point', id:'fp1', x:'0', y: '0'},
              {'type':'fixed_point', id:'fp2', x:'2100', y:'0'},
              {'type':'fixed_point', id:'fp3', x:'2100', y:'1400'},
              {'type':'fixed_point', id:'fp4', x:'0', y:'1400'},
              {'type':'fixed_point_impost', id:'fpimpost1', x:'700', y:'0'},
              {'type':'fixed_point_impost', id:'fpimpost2', x:'700', y:'1400'},
              {'type':'fixed_point_impost', id:'fpimpost3', x:'1400', y:'0'},
              {'type':'fixed_point_impost', id:'fpimpost4', x:'1400', y:'1400'},
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
              {'type': 'impost_line', id: 'impostcenterline1', from: 'fpimpost1', to: 'fpimpost2'},
              {'type': 'impost_line', id: 'impostcenterline2', from: 'fpimpost2', to: 'fpimpost1'},
              {'type': 'impost_line', id: 'impostcenterline3', from: 'fpimpost3', to: 'fpimpost4'},
              {'type': 'impost_line', id: 'impostcenterline4', from: 'fpimpost4', to: 'fpimpost3'},
              {'type': 'cross_point_impost', id: 'cpimpost1', line1: 'impostcenterline1', line2: 'frameinline1'},
              {'type': 'cross_point_impost', id: 'cpimpost2', line1: 'impostcenterline2', line2: 'frameinline1'},
              {'type': 'cross_point_impost', id: 'cpimpost3', line1: 'impostcenterline2', line2: 'frameinline3'},
              {'type': 'cross_point_impost', id: 'cpimpost4', line1: 'impostcenterline1', line2: 'frameinline3'},
              {'type': 'cross_point_impost', id: 'cpimpost5', line1: 'impostcenterline3', line2: 'frameinline1'},
              {'type': 'cross_point_impost', id: 'cpimpost6', line1: 'impostcenterline4', line2: 'frameinline1'},
              {'type': 'cross_point_impost', id: 'cpimpost7', line1: 'impostcenterline4', line2: 'frameinline3'},
              {'type': 'cross_point_impost', id: 'cpimpost8', line1: 'impostcenterline3', line2: 'frameinline3'},
              {'type': 'impost_in_line', id: 'impostinline1', from: 'cpimpost1', to: 'cpimpost4'},
              {'type': 'impost_in_line', id: 'impostinline2', from: 'cpimpost3', to: 'cpimpost2'},
              {'type': 'impost_in_line', id: 'impostinline3', from: 'cpimpost5', to: 'cpimpost8'},
              {'type': 'impost_in_line', id: 'impostinline4', from: 'cpimpost7', to: 'cpimpost6'},
              //-------- sash
              {'type': 'cross_point_sash_out', id: 'cpsout1', line1: 'frameinline1', line2: 'impostinline4'},
              {'type': 'cross_point_sash_out', id: 'cpsout2', line1: 'impostinline4', line2: 'frameinline3'},
              {'type': 'cross_point_sash_out', id: 'cpsout3', line1: 'frameinline3', line2: 'impostinline1'},
              {'type': 'cross_point_sash_out', id: 'cpsout4', line1: 'impostinline1', line2: 'frameinline1'},
              {'type': 'cross_point_sash_in', id: 'cpsin1', line1: 'frameinline1', line2: 'impostinline3'},
              {'type': 'cross_point_sash_in', id: 'cpsin2', line1: 'impostinline3', line2: 'frameinline3'},
              {'type': 'cross_point_sash_in', id: 'cpsin3', line1: 'frameinline3', line2: 'impostinline2'},
              {'type': 'cross_point_sash_in', id: 'cpsin4', line1: 'impostinline2', line2: 'frameinline1'},
              {'type': 'sash_out_line', id: 'sashoutline1', from: 'cpsout4', to: 'cpsout1'},
              {'type': 'sash_out_line', id: 'sashoutline2', from: 'cpsout1', to: 'cpsout2'},
              {'type': 'sash_out_line', id: 'sashoutline3', from: 'cpsout2', to: 'cpsout3'},
              {'type': 'sash_out_line', id: 'sashoutline4', from: 'cpsout3', to: 'cpsout4'},
              {'type': 'sash_line', id: 'sashline1', from: 'cpsin4', to: 'cpsin1'},
              {'type': 'sash_line', id: 'sashline2', from: 'cpsin1', to: 'cpsin2'},
              {'type': 'sash_line', id: 'sashline3', from: 'cpsin2', to: 'cpsin3'},
              {'type': 'sash_line', id: 'sashline4', from: 'cpsin3', to: 'cpsin4'},
              //----------- bead box
              /*
               {'type': 'cross_point_bead', id: 'cpbead1', line1: 'frameinline1', line2: 'impostinline1'},
               {'type': 'cross_point_bead', id: 'cpbead2', line1: 'impostinline1', line2: 'frameinline3'},
               {'type': 'cross_point_bead', id: 'cpbead3', line1: 'frameinline3', line2: 'frameinline4'},
               {'type': 'cross_point_bead', id: 'cpbead4', line1: 'frameinline4', line2: 'frameinline1'},
               {'type':'bead_box_line', id:'beadline1', from:'cpbead4', to:'cpbead1'},
               {'type':'bead_box_line', id:'beadline2', from:'cpbead1', to:'cpbead2'},
               {'type':'bead_box_line', id:'beadline3', from:'cpbead2', to:'cpbead3'},
               {'type':'bead_box_line', id:'beadline4', from:'cpbead3', to:'cpbead4'}

               {'type': 'cross_point_bead', id: 'cpbead5', line1: 'sashline1', line2: 'sashline2'},
               {'type': 'cross_point_bead', id: 'cpbead6', line1: 'sashline2', line2: 'sashline3'},
               {'type': 'cross_point_bead', id: 'cpbead7', line1: 'sashline3', line2: 'sashline4'},
               {'type': 'cross_point_bead', id: 'cpbead8', line1: 'sashline4', line2: 'sashline1'},
               {'type':'bead_box_line', id:'beadline5', from:'cpbead8', to:'cpbead5'},
               {'type':'bead_box_line', id:'beadline6', from:'cpbead5', to:'cpbead6'},
               {'type':'bead_box_line', id:'beadline7', from:'cpbead6', to:'cpbead7'},
               {'type':'bead_box_line', id:'beadline8', from:'cpbead7', to:'cpbead8'}
               */
              //---- left glass
              {'type': 'cross_point_glass', id: 'cpg1', line1: 'frameline1', line2: 'impostcenterline1', blockType: 'frame', isImpost: true},
              {'type': 'cross_point_glass', id: 'cpg2', line1: 'frameline3', line2: 'impostcenterline1', blockType: 'frame', isImpost: true},
              {'type': 'cross_point_glass', id: 'cpg3', line1: 'frameline3', line2: 'frameline4', blockType: 'frame', isImpost: false},
              {'type': 'cross_point_glass', id: 'cpg4', line1: 'frameline4', line2: 'frameline1', blockType: 'frame', isImpost: false},
              {'type': 'glass_line', id: 'glassline1', from: 'cpg4', to: 'cpg1'},
              {'type': 'glass_line', id: 'glassline2', from: 'cpg1', to: 'cpg2'},
              {'type': 'glass_line', id: 'glassline3', from: 'cpg2', to: 'cpg3'},
              {'type': 'glass_line', id: 'glassline4', from: 'cpg3', to: 'cpg4'},
              //----- center glass
              {'type': 'cross_point_glass', id: 'cpg5', line1: 'frameinline1', line2: 'impostinline3', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg6', line1: 'impostinline3', line2: 'frameinline3', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg7', line1: 'frameinline3', line2: 'impostinline2', blockType: 'sash'},
              {'type': 'cross_point_glass', id: 'cpg8', line1: 'impostinline2', line2: 'frameinline1', blockType: 'sash'},
              {'type': 'glass_line', id: 'glassline5', from: 'cpg8', to: 'cpg5'},
              {'type': 'glass_line', id: 'glassline6', from: 'cpg5', to: 'cpg6'},
              {'type': 'glass_line', id: 'glassline7', from: 'cpg6', to: 'cpg7'},
              {'type': 'glass_line', id: 'glassline8', from: 'cpg7', to: 'cpg8'},
              //------ right glass
              {'type': 'cross_point_glass', id: 'cpg9', line1: 'frameline1', line2: 'frameline2', blockType: 'frame', isImpost: false},
              {'type': 'cross_point_glass', id: 'cpg10', line1: 'frameline2', line2: 'frameline3', blockType: 'frame', isImpost: false},
              {'type': 'cross_point_glass', id: 'cpg11', line1: 'frameline3', line2: 'impostcenterline4', blockType: 'frame', isImpost: true},
              {'type': 'cross_point_glass', id: 'cpg12', line1: 'frameline1', line2: 'impostcenterline4', blockType: 'frame', isImpost: true},
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
              {'type': 'sash', id: 'sash1', parts: ['sashoutline1', 'sashline1']},
              {'type': 'sash', id: 'sash2', parts: ['sashoutline2', 'sashline2'], openType: ['sashline2', 'sashline4']},
              {'type': 'sash', id: 'sash3', parts: ['sashoutline3', 'sashline3'], openType: ['sashline3', 'sashline1']},
              {'type': 'sash', id: 'sash4', parts: ['sashoutline4', 'sashline4']},
              /*
               {'type': 'bead_box', id:'bead1', parts: ['frameinline1', 'beadline1']},
               {'type': 'bead_box', id:'bead2', parts: ['impostinline1', 'beadline2']},
               {'type': 'bead_box', id:'bead3', parts: ['frameinline3', 'beadline3']},
               {'type': 'bead_box', id:'bead4', parts: ['frameinline4', 'beadline4']},

               {'type': 'bead_box', id:'bead5', parts: ['sashline1', 'beadline5']},
               {'type': 'bead_box', id:'bead6', parts: ['sashline2', 'beadline6']},
               {'type': 'bead_box', id:'bead7', parts: ['sashline3', 'beadline7']},
               {'type': 'bead_box', id:'bead8', parts: ['sashline4', 'beadline8']},
               */
              {'type': 'glass_paсkage', id: 'glass1', parts: ['glassline1', 'glassline2', 'glassline3', 'glassline4']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline5', 'glassline6', 'glassline7', 'glassline8']},
              {'type': 'glass_paсkage', id: 'glass2', parts: ['glassline9', 'glassline10', 'glassline11', 'glassline12']},
              //{'type': 'dimensionsH', id: 'dimH1', from: ['fp4', 'fp1'], to: ['fpimpost2', 'fpimpost1'], level: 1, height: 150, side: 'bottom'},
              //{'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost2', 'fpimpost1'], to: ['fpimpost4', 'fpimpost3'], level: 1, height: 150, side: 'bottom'},
              {'type': 'dimensionsH', id: 'dimH1', from: ['fp1', 'fp4'], to: ['fpimpost1', 'fpimpost2'], limits: ['overallDimH', 'dimH3'], links: ['fpimpost1', 'fpimpost2'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsH', id: 'dimH2', from: ['fpimpost1', 'fpimpost2'], to: ['fpimpost3', 'fpimpost4'], limits: ['overallDimH', 'dimH1'], links: ['fpimpost3', 'fpimpost4'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsH', id: 'dimH3', from: ['fpimpost3', 'fpimpost4'], to: ['fp2', 'fp3'], level: 1, height: 150, side: 'top'},
              {'type': 'dimensionsH', id: 'overallDimH', from: ['fp1', 'fp4'], to: ['fp2', 'fp3'], limits: ['dimH1', 'dimH2'], level: 3, height: 150, side: 'top'},
              {'type': 'dimensionsV', id: 'overallDimV', from: ['fp1', 'fp2'], to: ['fp4', 'fp3'], level: 1, height: 150, side: 'left'},
              {'type': 'square', id: 'sqr', widths: ['overallDimH'], heights: ['overallDimV']}
            ]
          }

        ],

        doors: [
          {
            'name': 'Одностворчатый глухой',
            'objects': [
              //------- main points
              {'type': 'fixed_point', id: 'fp1', x: '0', y: '0'},
              {'type': 'fixed_point', id: 'fp2', x: '700', y: '0'},
              {'type': 'fixed_point', id: 'fp3', x: '700', y: '2100'},
              {'type': 'fixed_point', id: 'fp4', x: '0', y: '2100'},
              //------- frame
              {'type': 'frame_line', id: 'frameline1', from: 'fp1', to: 'fp2'},
              {'type': 'frame_line', id: 'frameline2', from: 'fp2', to: 'fp3'},
              {'type': 'frame_line', id: 'frameline3', from: 'fp3', to: 'fp4'},
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
              /*
               {'type': 'cross_point_bead', id: 'cpbead1', line1: 'frameinline1', line2: 'frameinline2'},
               {'type': 'cross_point_bead', id: 'cpbead2', line1: 'frameinline2', line2: 'frameinline3'},
               {'type': 'cross_point_bead', id: 'cpbead3', line1: 'frameinline3', line2: 'frameinline4'},
               {'type': 'cross_point_bead', id: 'cpbead4', line1: 'frameinline4', line2: 'frameinline1'},
               {'type':'bead_box_line', id:'beadline1', from:'cpbead4', to:'cpbead1'},
               {'type':'bead_box_line', id:'beadline2', from:'cpbead1', to:'cpbead2'},
               {'type':'bead_box_line', id:'beadline3', from:'cpbead2', to:'cpbead3'},
               {'type':'bead_box_line', id:'beadline4', from:'cpbead3', to:'cpbead4'}
               */
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
              /*
               {'type': 'bead_box', id:'bead1', parts: ['frameinline1', 'beadline1']},
               {'type': 'bead_box', id:'bead2', parts: ['frameinline2', 'beadline2']},
               {'type': 'bead_box', id:'bead3', parts: ['frameinline3', 'beadline3']},
               {'type': 'bead_box', id:'bead4', parts: ['frameinline4', 'beadline4']},
               */
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
        name: 'Окошко S5',
        heatCoeff: 0.9,
        airCoeff: 10
      }));
    },

    // TODO: Сервис готов
    getGlass: function (callback) {
      callback(new OkResult({
        id: 145,
        name: '6/12/6',
        heatCoeff: 0.2,
        airCoeff: 9
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



    getAllProfiles: function (callback) {
      callback(new OkResult({
        producers: [
          'Окошко',
          'Другие...'
        ],
        profiles: [
          [
            {
              profileId: 35,
              profileType: '3 камеры',
              profileDescrip: 'ОКОШКО S58',
              profileCountry: 'Украина',
              profileNoise: 4,
              heatCoeff: 0.9,
              airCoeff: 10
            },
            {
              profileId: 36,
              profileType: '3 камеры',
              profileDescrip: 'Немецкая 5 кам.',
              profileCountry: 'Украина',
              profileNoise: 3,
              heatCoeff: 0.8,
              airCoeff: 11
            },
            {
              profileId: 37,
              profileType: '2 камеры',
              profileDescrip: 'Немецкая 3 кам.',
              profileCountry: 'Украина',
              profileNoise: 5,
              heatCoeff: 0.5,
              airCoeff: 9
            },
            {
              profileId: 38,
              profileType: '4 камеры',
              profileDescrip: 'ОКОШКО S60',
              profileCountry: 'Украина',
              profileNoise: 4,
              heatCoeff: 0.7,
              airCoeff: 8
            }
          ],
          [
            {
              profileId: 39,
              profileType: '1 камерa',
              profileDescrip: 'ОКОШКО S80',
              profileCountry: 'Украина',
              profileNoise: 5,
              heatCoeff: 0.95,
              airCoeff: 10
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
              glassId: 145,
              glassName: '4/16/4',
              glassUrl: 'img/glass.png',
              glassDescrip: '3 камеры +энергосбережение',
              glassNoise: 4,
              heatCoeff: 0.2,
              airCoeff: 9,
              glassPrice: 100
            },
            {
              glassId: 146,
              glassName: '6/14/4',
              glassUrl: 'img/glass.png',
              glassDescrip: '3 камеры +энергосбережение',
              glassNoise: 5,
              heatCoeff: 0.4,
              airCoeff: 9,
              glassPrice: 200
            },
            {
              glassId: 147,
              glassName: '6/12/6',
              glassUrl: 'img/glass.png',
              glassDescrip: '3 камеры +энергосбережение',
              glassNoise: 1,
              heatCoeff: 0.3,
              airCoeff: 9,
              glassPrice: 600
            }
          ],
          [
            {
              glassId: 149,
              glassName: '4/10/4/10/4',
              glassUrl: 'img/glass.png',
              glassDescrip: '3 камеры +энергосбережение',
              glassNoise: 4,
              heatCoeff: 0.2,
              airCoeff: 9,
              glassPrice: 100
            },
            {
              glassId: 150,
              glassName: '4/8/4/12/4',
              glassUrl: 'img/glass.png',
              glassDescrip: '3 камеры +энергосбережение',
              glassNoise: 1,
              heatCoeff: 0.1,
              airCoeff: 9,
              glassPrice: 800
            }
          ],
          [
            {
              glassId: 152,
              glassName: '4/16/4i',
              glassUrl: 'img/glass.png',
              glassDescrip: '3 камеры +энергосбережение',
              glassNoise: 4,
              heatCoeff: 0.5,
              airCoeff: 9,
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
              hardwareLogo: 'img/hardware-logos/accado.png',
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
              hardwareLogo: 'img/hardware-logos/accado.png',
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
          [
            {
              hardwareId: 1,
              hardwareName: 'ACCADO 7mm',
              hardwareProducer: 'ACCADO',
              hardwareCountry: 'Турция',
              hardwareLogo: 'img/hardware-logos/siegenia.png',
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
              hardwareLogo: 'img/hardware-logos/romb.png',
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
        ],
        laminationOutside: [

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


    getAllGrids: function (callback) {
      callback(new OkResult({

        elementType: [
          'внутренние',
          'внешние'
        ],
        elementsList: [
          [
            {
              elementId: 1,
              elementName: 'Сетка СO-100',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementName: 'Сетка СO-200',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 3,
              elementName: 'Сетка СO-200',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementName: 'Сетка СO-300',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
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
              elementId: 1,
              elementType: 'Стандартные',
              elementName: 'Козырек белый 100мм',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 200
            },
            {
              elementId: 2,
              elementType: 'Стандартные',
              elementName: 'Козырек белый 200мм',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 300
            },
            {
              elementId: 3,
              elementType: 'Стандартные',
              elementName: 'Козырек белый 300мм',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 140
            }
          ],
          [
            {
              elementId: 1,
              elementType: 'оцинкованный',
              elementName: 'Козырек 100мм оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 150
            },
            {
              elementId: 2,
              elementType: 'оцинкованный',
              elementName: 'Козырек 200мм оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 180
            },
            {
              elementId: 3,
              elementType: 'оцинкованный',
              elementName: 'Козырек 300мм оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 180
            },
            {
              elementId: 4,
              elementType: 'оцинкованный',
              elementName: 'Козырек 400мм оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 180
            },
            {
              elementId: 5,
              elementType: 'оцинкованный',
              elementName: 'Козырек 500мм оцинкованный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 180
            }
          ],
          [
            {
              elementId: 1,
              elementType: 'Матовые',
              elementName: 'Козырёк нестандартный',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 110
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
              elementId: 1,
              elementType: 'Отлив белый 200мм',
              elementName: 'Отлив КO-200',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementType: 'Стандартные',
              elementName: 'Отлив коричневый 260мм',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementType: 'оцинкованный',
              elementName: 'Отлив оцинкованный 20мм',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementType: 'оцинкованный',
              elementName: 'Отлив оцинкованный 50мм',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
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
              elementId: 1,
              elementType: 'Стандартные',
              elementName: 'Откос пластиковый',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementType: 'Стандартные',
              elementName: 'Откос гипсокартонный',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 3,
              elementType: 'Стандартные',
              elementName: 'Откос песчаноцементный',
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
              elementId: 1,
              elementType: 'Стандартные',
              elementName: 'Откос пластиковый',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementType: 'Стандартные',
              elementName: 'Откос гипсокартонный',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 3,
              elementType: 'Стандартные',
              elementName: 'Откос песчаноцементный',
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
              elementId: 1,
              elementName: 'Соединитель стандартный 5/10',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementName: 'Соединитель стандартный 3/10',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementName: 'Соединитель усиленный 5/13',
              elementWidth: 1500,
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
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
              elementId: 1,
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
              elementId: 2,
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
              elementId: 3,
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
              elementId: 1,
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
              elementId: 2,
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
              elementId: 1,
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
              elementId: 2,
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
              elementId: 3,
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
              elementId: 4,
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
              elementId: 1,
              elementName: 'Ручка оконная белая',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementName: 'Ручка оконная с ключом белая',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
              elementName: 'Ручка HOPPE (Tokyo) белая',
              elementQty: 1,
              elementPrice: 100
            },
            {
              elementId: 2,
              elementName: 'Ручка HOPPE (Tokyo) серебр.',
              elementQty: 1,
              elementPrice: 100
            }
          ],
          [
            {
              elementId: 1,
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
            shapeLabel: 'без порога',
            shapeIcon: 'img/door-config/no-doorstep.png',
            shapeIconSelect: 'img/door-config-selected/no-doorstep.png'
          },
          {
            shapeId: 2,
            shapeLabel: 'по периметру',
            shapeIcon: 'img/door-config/doorstep.png',
            shapeIconSelect: 'img/door-config-selected/doorstep.png'
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
});
