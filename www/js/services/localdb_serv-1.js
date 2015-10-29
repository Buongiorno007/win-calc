
// services/localdb_serv-1.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .factory('localDB', globalDBFactory);

  function globalDBFactory($http, $q, globalConstants, UserStor) {

    var db = openDatabase('bauvoice', '1.0', 'bauvoice', 5000000),
        elemLists = [], elemListsHw = [], elemListsAdd = [];



    return {
      tablesLocalDB: {
        'addition_folders': {
          'tableName': 'addition_folders',
          'prop': 'name VARCHAR(255),' +
            ' addition_type_id INTEGER,' +
            ' factory_id INTEGER,' +
            ' position INTEGER,' +
            ' img VARCHAR,' +
            ' description VARCHAR,' +
            ' link VARCHAR',
          'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(addition_type_id) REFERENCES addition_types(id)'
        },
        'cities': {
          'tableName': 'cities',
          'prop': 'name VARCHAR(255), region_id INTEGER, transport VARCHAR(2)',
          'foreignKey': ', FOREIGN KEY(region_id) REFERENCES regions(id)'
        },
        'countries': {
          'tableName': 'countries',
          'prop': 'name VARCHAR(255), currency_id INTEGER',
          'foreignKey': ', FOREIGN KEY(currency_id) REFERENCES currencies(id)'
        },
        'currencies': {
          'tableName': 'currencies',
          'prop': 'name VARCHAR(100), value NUMERIC(10, 2), factory_id INTEGER, is_base INTEGER',
          'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id)'
        },
        'directions': {
          'tableName': 'directions',
          'prop': 'name VARCHAR(255)',
          'foreignKey': ''
        },
        'elements_groups': {
          'tableName': 'elements_groups',
          'prop': 'name VARCHAR(255), base_unit INTEGER, position INTEGER',
          'foreignKey': ''
        },
        'beed_profile_systems': {
          'tableName': 'beed_profile_systems',
          'prop': 'profile_system_id INTEGER, list_id INTEGER, glass_width INTEGER',
          'foreignKey': ', FOREIGN KEY(list_id) REFERENCES lists(id)'
        },
        'factories': {
          'tableName': 'factories',
          'prop': 'name VARCHAR(255)',
          'foreignKey': ''
        },
        'glass_folders': {
          'tableName': 'glass_folders',
          'prop': 'name VARCHAR(255),' +
            ' img VARCHAR,' +
            ' position INTEGER,' +
            ' factory_id INTEGER,' +
            ' description VARCHAR,' +
            ' link VARCHAR,' +
            ' is_base INTEGER',
          'foreignKey': ''
        },
        'glass_prices': {
          'tableName': 'glass_prices',
          'prop': 'element_id INTEGER,' +
            ' col_1_range NUMERIC(10, 2),' +
            ' col_1_price NUMERIC(10, 2),' +
            ' col_2_range_1 NUMERIC(10, 2),' +
            ' col_2_range_2 NUMERIC(10, 2),' +
            ' col_2_price NUMERIC(10, 2),' +
            ' col_3_range_1 NUMERIC(10, 2),' +
            ' col_3_range_2 NUMERIC(10, 2),' +
            ' col_3_price NUMERIC(10, 2),' +
            ' col_4_range_1 NUMERIC(10, 2),' +
            ' col_4_range_2 NUMERIC(10, 2),' +
            ' col_4_price NUMERIC(10, 2),' +
            ' col_5_range NUMERIC(10, 2),' +
            ' col_5_price NUMERIC(10, 2),' +
            ' table_width INTEGER',
          'foreignKey': ''
        },
        'lamination_factory_colors': {
          'tableName': 'lamination_factory_colors',
          'prop': 'name VARCHAR(255), lamination_type_id INTEGER, factory_id INTEGER',
          'foreignKey': ', FOREIGN KEY(lamination_type_id) REFERENCES lamination_default_colors(id), FOREIGN KEY(factory_id) REFERENCES factories(id)'
        },
        'lamination_types': {
          'tableName': 'lamination_types',
          'prop': 'name VARCHAR(255)',
          'foreignKey': ''
        },
        'lists_groups': {
          'tableName': 'lists_groups',
          'prop': 'name VARCHAR(255)',
          'foreignKey': ''
        },
        'lists_types': {
          'tableName': 'lists_types',
          'prop': 'name VARCHAR(255), image_add_param VARCHAR(100)',
          'foreignKey': ''
        },
        'margin_types': {
          'tableName': 'margin_types',
          'prop': 'name VARCHAR(255)',
          'foreignKey': ''
        },
        'options_discounts': {
          'tableName': 'options_discounts',
          'prop': 'factory_id INTEGER,' +
            ' min_time INTEGER,' +
            ' standart_time INTEGER,' +
            ' base_time INTEGER,' +
            ' week_1 INTEGER,' +
            ' week_2 INTEGER,' +
            ' week_3 INTEGER,' +
            ' week_4 INTEGER,' +
            ' week_5 INTEGER,' +
            ' week_6 INTEGER,' +
            ' week_7 INTEGER,' +
            ' week_8 INTEGER,' +
            ' percents ARRAY',
          'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id)'
        },
        'elements': {
          'tableName': 'elements',
          'prop': 'sku VARCHAR(100),' +
            ' name VARCHAR(255),' +
            ' element_group_id INTEGER,' +
            ' currency_id INTEGER,' +
            ' supplier_id INTEGER,' +
            ' margin_id INTEGER,' +
            ' waste NUMERIC(10, 2),' +
            ' is_optimized INTEGER,' +
            ' is_virtual INTEGER,' +
            ' is_additional INTEGER,' +
            ' weight_accounting_unit NUMERIC(10, 3),' +
            ' glass_folder_id INTEGER,' +
            ' min_width NUMERIC,' +
            ' min_height NUMERIC,' +
            ' max_width NUMERIC,' +
            ' max_height NUMERIC,' +
            ' max_sq NUMERIC,' +
            ' transcalency NUMERIC(10, 2),' +
            ' glass_width INTEGER,' +
            ' factory_id INTEGER,' +
            ' price NUMERIC(10, 2),' +
            ' amendment_pruning NUMERIC(10, 2),' +
            ' noise_coeff INTEGER,' +
            ' heat_coeff INTEGER,' +
            ' lamination_in_id INTEGER,' +
            ' lamination_out_id INTEGER',
          'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(glass_folder_id) REFERENCES glass_folders(id), FOREIGN KEY(margin_id) REFERENCES margin_types(id), FOREIGN KEY(supplier_id) REFERENCES suppliers(id), FOREIGN KEY(currency_id) REFERENCES currencies(id), FOREIGN KEY(element_group_id) REFERENCES elements_groups(id)'
        },
        'profile_system_folders': {
          'tableName': 'profile_system_folders',
          'prop': 'name VARCHAR(255),' +
            ' factory_id INTEGER,' +
            ' position INTEGER,' +
            ' link VARCHAR,' +
            ' description VARCHAR,' +
            ' img VARCHAR',
          'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id)'
        },
        'profile_systems': {
          'tableName': 'profile_systems',
          'prop': 'name VARCHAR(255),' +
            ' short_name VARCHAR(100),' +
            ' folder_id INTEGER,' +
            ' rama_list_id INTEGER,' +
            ' rama_still_list_id INTEGER,' +
            ' stvorka_list_id INTEGER,' +
            ' impost_list_id INTEGER,' +
            ' shtulp_list_id INTEGER,' +
            ' is_editable INTEGER,' +
            ' is_default INTEGER,' +
            ' position INTEGER,' +
            ' country VARCHAR(100),' +
            ' cameras INTEGER,' +
//            ' profile_system_group_id	INTEGER,' +
            ' heat_coeff INTEGER,' +
            ' noise_coeff INTEGER,' +
            ' air_coeff INTEGER',
          'foreignKey': ''
        },
        'rules_types': {
          'tableName': 'rules_types',
          'prop': 'name VARCHAR(255), parent_unit INTEGER, child_unit INTEGER, suffix VARCHAR(15)',
          'foreignKey': ''
        },
//        'suppliers': {
//          'tableName': 'suppliers',
//          'prop': 'name VARCHAR(255), factory_id INTEGER',
//          'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id)'
//        },
        'regions': {
          'tableName': 'regions',
          'prop': 'name VARCHAR(255), country_id INTEGER, heat_transfer NUMERIC(10, 2), climatic_zone NUMERIC',
          'foreignKey': ', FOREIGN KEY(country_id) REFERENCES countries(id)'
        },
        'users': {
          'tableName': 'users',
          'prop': //'created_at TIMESTAMP,' +
//            ' updated_at TIMESTAMP,' +
            ' email VARCHAR(255),' +
            ' password VARCHAR(255),' +
//            ' session VARCHAR(255),' +
//            ' short_id VARCHAR(2),' +
//            ' parent_id INTEGER,' +
            ' factory_id INTEGER,' +
//            ' discount_construct_max NUMERIC(10, 1),' +
//            ' discount_construct_default NUMERIC(10, 1),' +
//            ' discount_addelem_max NUMERIC(10, 1),' +
//            ' discount_addelem_default NUMERIC(10, 1),' +
            ' name VARCHAR(255),' +
            ' phone VARCHAR(100),' +
//            ' inn VARCHAR(100),' +
//            ' okpo VARCHAR(100),' +
//            ' mfo VARCHAR(100),' +
//            ' bank_name VARCHAR(100),' +
//            ' bank_acc_no VARCHAR(100),' +
//            ' director VARCHAR(255),' +
//            ' stamp_file_name VARCHAR(255),' +
            ' locked INTEGER,' +
            ' user_type INTEGER,' +
//            ' contact_name VARCHAR(100),' +
            ' city_phone VARCHAR(100),' +
            ' city_id INTEGER,' +
            ' fax VARCHAR(100),' +
            ' avatar VARCHAR(255),' +
            ' birthday DATE,' +
            ' sex VARCHAR(100),' +
            ' mount_mon NUMERIC(5,2),' +
            ' mount_tue NUMERIC(5,2),' +
            ' mount_wed NUMERIC(5,2),' +
            ' mount_thu NUMERIC(5,2),' +
            ' mount_fri NUMERIC(5,2),' +
            ' mount_sat NUMERIC(5,2),' +
            ' mount_sun NUMERIC(5,2),' +
            ' device_code VARCHAR(250),'+
            ' last_sync TIMESTAMP,' +
            ' address VARCHAR',
//            ' identificator INTEGER',
          'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(city_id) REFERENCES cities(id)'
        },
        'users_discounts': {
          'tableName': 'users_discounts',
          'prop': 'user_id INTEGER,' +
            ' max_construct NUMERIC(5,1),' +
            ' max_add_elem NUMERIC(5,1),' +
            ' default_construct NUMERIC(5,1),' +
            ' default_add_elem NUMERIC(5,1),' +
            ' week_1_construct NUMERIC(5,1),' +
            ' week_1_add_elem NUMERIC(5,1),' +
            ' week_2_construct NUMERIC(5,1),' +
            ' week_2_add_elem NUMERIC(5,1),' +
            ' week_3_construct NUMERIC(5,1),' +
            ' week_3_add_elem NUMERIC(5,1),' +
            ' week_4_construct NUMERIC(5,1),' +
            ' week_4_add_elem NUMERIC(5,1),' +
            ' week_5_construct NUMERIC(5,1),' +
            ' week_5_add_elem NUMERIC(5,1),' +
            ' week_6_construct NUMERIC(5,1),' +
            ' week_6_add_elem NUMERIC(5,1),' +
            ' week_7_construct NUMERIC(5,1),' +
            ' week_7_add_elem NUMERIC(5,1),' +
            ' week_8_construct NUMERIC(5,1),' +
            ' week_8_add_elem NUMERIC(5,1)',
          'foreignKey': ''
        },
        'lists': {
          'tableName': 'lists',
          'prop': 'name VARCHAR(255),' +
            ' list_group_id INTEGER,' +
            ' list_type_id INTEGER,' +
            ' a NUMERIC(10, 2),' +
            ' b NUMERIC(10, 2),' +
            ' c NUMERIC(10, 2),' +
            ' d NUMERIC(10, 2),' +
            ' parent_element_id INTEGER,' +
            ' position NUMERIC,' +
            ' add_color_id INTEGER,' +
            ' addition_folder_id INTEGER,' +
            ' amendment_pruning NUMERIC(10, 2),' +
            ' waste NUMERIC(10, 2),' +
            ' cameras INTEGER,' +
            ' link VARCHAR,' +
            ' description VARCHAR,' +
            ' img VARCHAR',
          'foreignKey': ', FOREIGN KEY(parent_element_id) REFERENCES elements(id), FOREIGN KEY(parent_element_id) REFERENCES elements(id), FOREIGN KEY(list_group_id) REFERENCES lists_groups(id), FOREIGN KEY(add_color_id) REFERENCES addition_colors(id)'
        },
        'list_contents': {
          'tableName': 'list_contents',
          'prop': 'parent_list_id INTEGER,' +
            ' child_id INTEGER,' +
            ' child_type VARCHAR(255),' +
            ' value NUMERIC(10, 3),' +
            ' rules_type_id INTEGER,' +
            ' direction_id INTEGER,' +
            ' window_hardware_color_id INTEGER,' +
            ' lamination_type_id INTEGER',
          'foreignKey': ', FOREIGN KEY(parent_list_id) REFERENCES lists(id), FOREIGN KEY(rules_type_id) REFERENCES rules_types(id), FOREIGN KEY(direction_id) REFERENCES directions(id), FOREIGN KEY(lamination_type_id) REFERENCES lamination_types(id), FOREIGN KEY(window_hardware_color_id) REFERENCES window_hardware_colors(id)'
        },
        'window_hardware_types': {
          'tableName': 'window_hardware_types',
          'prop': 'name VARCHAR(255), short_name VARCHAR(100)',
          'foreignKey': ''
        },
        'window_hardware_folders': {
          'tableName': 'window_hardware_folders',
          'prop': 'name VARCHAR,' +
            ' factory_id INTEGER,'+
            ' link VARCHAR,' +
            ' description VARCHAR,' +
            ' img VARCHAR',
          'foreignKey': ''
        },

        'window_hardware_groups': {
          'tableName': 'window_hardware_groups',
          'prop': 'name VARCHAR(255),' +
            ' short_name VARCHAR(100),' +
            ' folder_id INTEGER,' +
            ' is_editable INTEGER,' +
            ' is_group INTEGER,' +
            ' is_in_calculation INTEGER,' +
            ' base_type_id INTEGER,' +
            ' position INTEGER,' +
            ' producer VARCHAR(255),' +
            ' country VARCHAR(255),' +
            ' noise_coeff INTEGER,' +
            ' heat_coeff INTEGER,' +
            ' link VARCHAR,' +
            ' description VARCHAR,' +
            ' img VARCHAR',
          'foreignKey': ', FOREIGN KEY(base_type_id) REFERENCES window_hardware_types_base(id)'
        },
        'window_hardwares': {
          'tableName': 'window_hardwares',
          'prop': 'window_hardware_type_id INTEGER,' +
            ' min_width INTEGER,' +
            ' max_width INTEGER,' +
            ' min_height INTEGER,' +
            ' max_height INTEGER,' +
            ' direction_id INTEGER,' +
            ' window_hardware_color_id INTEGER,' +
            ' length INTEGER,' +
            ' count INTEGER,' +
            ' child_id INTEGER,' +
            ' child_type VARCHAR(100),' +
            ' position INTEGER,' +
            ' factory_id INTEGER,' +
            ' window_hardware_group_id INTEGER,' +
            ' window_hardware_feature_id INTEGER',
          'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(window_hardware_type_id) REFERENCES window_hardware_types(id), FOREIGN KEY(direction_id) REFERENCES directions(id), FOREIGN KEY(window_hardware_group_id) REFERENCES window_hardware_groups(id), FOREIGN KEY(window_hardware_color_id) REFERENCES window_hardware_colors(id)'
        },
        'window_hardware_colors': {
          'tableName': 'window_hardware_colors',
          'prop': 'name VARCHAR(255)',
          'foreignKey': ''
        },
        'window_hardware_handles': {
          'tableName': 'window_hardware_handles',
          'prop': 'element_id INTEGER, location VARCHAR(255), constant_value NUMERIC(10, 2)',
          'foreignKey': ''
        },


        'elements_profile_systems': {
          'tableName': 'elements_profile_systems',
          'prop': 'profile_system_id INTEGER, element_id INTEGER',
          'foreignKey': ''
        },
        'orders': {
          'tableName': 'orders',
          'prop':
            'order_number VARCHAR,' +
            ' order_hz VARCHAR,' +
            ' order_date TIMESTAMP,' +
            ' order_type INTEGER,' +
            ' order_style VARCHAR,' +
            ' user_id INTEGER,' +
            ' created TIMESTAMP,' +
            ' additional_payment VARCHAR,' +
            ' sended TIMESTAMP,' +
            ' state_to TIMESTAMP,' +
            ' state_buch TIMESTAMP,' +
            ' batch VARCHAR,' +
            ' square NUMERIC(13, 2),' +
            ' base_price NUMERIC(13, 2),' +
            ' perimeter NUMERIC(13, 2),' +
            ' factory_margin NUMERIC(11, 2),'+
            ' factory_id INTEGER,' +
            ' purchase_price NUMERIC(10, 2),' +
            ' sale_price NUMERIC(10, 2),' +
            ' delivery_price NUMERIC,'+
            ' mounting_price NUMERIC,'+
            ' delivery_date TIMESTAMP,' +
            ' new_delivery_date TIMESTAMP,' +
            ' climatic_zone INTEGER,' +
            ' heat_coef_min NUMERIC,' +
            ' products_qty INTEGER,' +
            ' products_price_total NUMERIC,'+
            ' is_date_price_less INTEGER,' +
            ' is_date_price_more INTEGER,' +
            ' floor_id INTEGER,' +
            ' floor_price NUMERIC,' +
            ' mounting_id INTEGER,' +
            ' is_instalment INTEGER,' +
            ' instalment_id INTEGER,' +
            ' is_old_price INTEGER,' +
            ' payment_first NUMERIC,' +
            ' payment_monthly NUMERIC,' +
            ' payment_first_primary NUMERIC,' +
            ' payment_monthly_primary NUMERIC,' +
            ' order_price_total NUMERIC,' +
            ' order_price_total_dis NUMERIC,' +
            ' order_price_total_primary NUMERIC,' +
            ' construct_price_total NUMERIC,' +
            ' addelem_price_total NUMERIC,' +
            ' discount_construct NUMERIC,' +
            ' discount_addelem NUMERIC,' +
            ' customer_name TEXT,' +
            ' customer_email TEXT,' +
            ' customer_phone VARCHAR(30),' +
            ' customer_phone_city VARCHAR(20),' +
            ' customer_city VARCHAR,' +
            ' customer_address TEXT,' +
            ' customer_location VARCHAR,' +
            ' customer_itn INTEGER,' +
            ' customer_starttime VARCHAR,' +
            ' customer_endtime VARCHAR,' +
            ' customer_target VARCHAR,' +
            ' customer_sex INTEGER,' +
            ' customer_age INTEGER,' +
            ' customer_education INTEGER,' +
            ' customer_occupation INTEGER,' +
            ' customer_infoSource INTEGER',
          'foreignKey': ''
        },
        'order_products': {
          'tableName': 'order_products',
          'prop':
            'order_id NUMERIC,' +
            ' product_id INTEGER,' +
            ' is_addelem_only INTEGER,' +
            ' room_id INTEGER,' +
            ' construction_type INTEGER,' +
            ' template_id INTEGER,' +
            ' template_source TEXT,' +
            ' template_width NUMERIC,' +
            ' template_height NUMERIC,' +
            ' template_square NUMERIC,' +
            ' profile_id INTEGER,' +
            ' glass_id VARCHAR,' +
            ' hardware_id INTEGER,' +
            ' lamination_out_id INTEGER,' +
            ' lamination_in_id INTEGER,' +
            ' door_shape_id INTEGER,' +
            ' door_sash_shape_id INTEGER,' +
            ' door_handle_shape_id INTEGER,' +
            ' door_lock_shape_id INTEGER,' +
            ' heat_coef_total NUMERIC,' +
            ' template_price NUMERIC,' +
            ' addelem_price NUMERIC,' +
            ' product_price NUMERIC,' +
            ' comment TEXT,' +
            ' product_qty INTEGER',
          'foreignKey': ''
        },
        'order_addelements': {
          'tableName': 'order_addelements',
          'prop': 'order_id NUMERIC,' +
            ' product_id INTEGER,' +
            ' element_type INTEGER,' +
            ' element_id INTEGER,' +
            ' element_width NUMERIC,' +
            ' element_height NUMERIC,' +
            ' element_price NUMERIC,' +
            ' element_qty INTEGER',
          'foreignKey': ''
        },
        'template_groups':{
          'tableName': 'template_groups',
          'prop': 'name VARCHAR(255)',
          'foreignKey': ''
        },
        'templates':{
          'tableName': 'templates',
          'prop': 'group_id INTEGER,'+
            'name VARCHAR(255),' +
            'icon TEXT,' +
            'template_object TEXT',
          'foreignKey': ''
        },



        //-------- inner temables
        'analytics': {
          'tableName': 'analytics',
          'prop': 'created TIMESTAMP, user_id INTEGER, order_id NUMERIC, element_id INTEGER, element_type INTEGER',
          'foreignKey': ''
        },

        'export': {
          'tableName': 'export',
//          'prop': 'table_name VARCHAR, row_id INTEGER, message TEXT',
          'prop': 'model VARCHAR, rowId INTEGER, field TEXT',
          'foreignKey': ''
        }
      },



      tablesLocationLocalDB: {
        'cities': {
          'tableName': 'cities',
          'prop': 'name VARCHAR(255), region_id INTEGER, transport VARCHAR(2)',
          'foreignKey': ', FOREIGN KEY(region_id) REFERENCES regions(id)'
        },
        'countries': {
          'tableName': 'countries',
          'prop': 'name VARCHAR(255), currency_id INTEGER',
          'foreignKey': ', FOREIGN KEY(currency_id) REFERENCES currencies(id)'
        },
        'regions': {
          'tableName': 'regions',
          'prop': 'name VARCHAR(255), country_id INTEGER, heat_transfer NUMERIC(10, 2), climatic_zone NUMERIC',
          'foreignKey': ', FOREIGN KEY(country_id) REFERENCES countries(id)'
        }
      },

      addElementDBId: [
        20, // 0 - grids
        21, // 1 - visors
        9, // 2 - spillways
        19, // 3 - outSlope
        26, // 4 - louvers
        19, // 5 - inSlope
        12, // 6 - connectors
        27, // 7 - fans
        8, // 8 - windowSill
        24, // 9 - handles
        16 // 10 - others

//        1,//Сетки
//        2,//Козырьки, нащельники
//        3,//	Отливы
//        4,//	Наружные откосы
//        5,//	Жалюз
//        6,//	Внутренние откосы
//        7,//	Соединители
//        8,//	Вентиляторы
//        9,//	Подоконники
//        10,//	Ручки
//        11//	Прочее

      ],



    cleanLocalDB: function (tables) {
//        console.log('CLEEN START');
        var tableKeys = Object.keys(tables),
            promises = tableKeys.map(function(table) {
              var defer = $q.defer();
              db.transaction(function (trans) {
                trans.executeSql("DROP TABLE IF EXISTS " + table, [], function () {
//                  console.log('DROP '+ table);
                  defer.resolve(1);
                }, function () {
                  console.log('not find deleting table');
                  defer.resolve(0);
                });
              });
              return defer.promise;
            });
        return $q.all(promises);
      },



      createTablesLocalDB: function(tables) {
//        console.log('CREATE START');
        var self = this,
            tableKeys = Object.keys(tables),
            promises = tableKeys.map(function(table) {
              var defer = $q.defer();
              db.transaction(function (trans) {
                trans.executeSql("CREATE TABLE IF NOT EXISTS " + self.tablesLocalDB[table].tableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT, "+ self.tablesLocalDB[table].prop + ", modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP" + self.tablesLocalDB[table].foreignKey+")", [], function() {
//                  console.log('CREATE '+ table);
                  defer.resolve(1);
                }, function () {
                  console.log('Something went wrong with creating table ' + self.tablesLocalDB[table].tableName);
                  defer.resolve(0);
                });
              });
              return defer.promise;
            });
        return $q.all(promises);
      },



      insertRowLocalDB: function(row, tableName) {
        var keysArr = Object.keys(row),
            colums = keysArr.join(', '),
            values = keysArr.map(function (key) {
              return "'"+row[key]+"'";
            }).join(', ');
        db.transaction(function (trans) {
          trans.executeSql('INSERT INTO ' + tableName + ' (' + colums + ') VALUES (' + values + ')', [], null, function () {
            console.log('Something went wrong with insert into ' + tableName);
          });
        });
      },


      insertTablesLocalDB: function(result) {
//        console.log('INSERT START');
        var promises = [],
            tableKeys = Object.keys(result.tables),
            tableQty = tableKeys.length;
//        console.log('tabless =', tableKeys);
        db.transaction(function (trans) {
          for (var t = 0; t < tableQty; t++) {
            var colums = result.tables[tableKeys[t]].fields.join(', '),
                rowsQty = result.tables[tableKeys[t]].rows.length;
//            console.log('insert ++++', tableKeys[t]);
            if (rowsQty) {
              for (var r = 0; r < rowsQty; r++) {
                var defer = $q.defer(),
                    values = result.tables[tableKeys[t]].rows[r].map(function (elem) {
                      return "'" + elem + "'";
                    }).join(', ');
//                console.log('insert ++++', tableKeys[t], colums);
                trans.executeSql('INSERT INTO ' + tableKeys[t] + ' (' + colums + ') VALUES (' + values + ')', [], function() {
                  defer.resolve(1);
                }, function(error) {
                  console.log('Error!!! ' + error);
                  defer.resolve(0);
                });

                promises.push(defer.promise);
              }
            }
          }
        });
        return $q.all(promises);
      },


      selectLocalDB: function (tableName, options) {
        var defer = $q.defer(),
            vhereOptions = "";
        if(options) {
          vhereOptions = " WHERE ";
          var optionKeys = Object.keys(options);
          vhereOptions += optionKeys[0] + " = '" + options[optionKeys[0]] + "'";
          var optionQty = optionKeys.length;
          if(optionQty > 1) {
            for(var k = 1; k < optionQty; k++) {
              vhereOptions += " AND " + optionKeys[k] + " = '" + options[optionKeys[k]] + "'";
            }
          }
        }
        db.transaction(function (trans) {
          trans.executeSql("SELECT * FROM " + tableName + vhereOptions, [],
            function (tx, result) {
              var resultQty = result.rows.length;
              if (resultQty) {
                var resultARR = [];
                for(var i = 0; i < resultQty; i++) {
                  resultARR.push(result.rows.item(i));
                }
                defer.resolve(resultARR);
              } else {
                defer.resolve(0);
              }
            },
            function (tx, result) {
              if(Object.keys(tx).length == 0 && result.code == 5) {
                defer.resolve(0);
              }
            });
        });
        return defer.promise;
      },


      updateLocalDB: function (tableName, elem, options) {
        var vhereOptions = '',
            keysArr = Object.keys(elem),
            keysQty = keysArr.length,
            optionKeys = Object.keys(options),
            optionQty = optionKeys.length,
            elements = "";

        if(keysQty) {
          for(var k = 0; k < keysQty; k++) {
            if(!k) {
              elements += keysArr[k] + " = '" + elem[keysArr[k]]+"'";
            } else {
              elements += ", " + keysArr[k] + " = '" + elem[keysArr[k]]+"'";
            }
          }
        }
        if(optionQty) {
          vhereOptions = " WHERE ";
          vhereOptions += optionKeys[0] + " = '" + options[optionKeys[0]] + "'";
          if(optionQty > 1) {
            for(var op = 1; op < optionQty; op++) {
              vhereOptions += " AND " + optionKeys[op] + " = '" + options[optionKeys[op]] + "'";
            }
          }
        }
        db.transaction(function (trans) {
          trans.executeSql("UPDATE " + tableName + " SET " + elements + vhereOptions, [], function () {
          }, function () {
            console.log('Something went wrong with updating ' + tableName + ' record');
          });
        });
      },


      deleteRowLocalDB: function(tableName, options) {
        var optionKeys = Object.keys(options),
            optionQty = optionKeys.length,
            vhereOptions = " WHERE " + optionKeys[0] + " = '" + options[optionKeys[0]] + "'";

        if(optionQty > 1) {
          for(var k = 1; k < optionQty; k++) {
            vhereOptions += " AND " + optionKeys[k] + " = '" + options[optionKeys[k]] + "'";
          }
        }
        db.transaction(function (trans) {
          trans.executeSql('DELETE FROM ' + tableName + vhereOptions, [], null, function () {
            console.log('Something went wrong with insert into ' + tableName);
          });
        });
      },


      //============== SERVER ===========//


      //-------- get User from Server by login
      importUser: function (login) {
        var defer = $q.defer();
        $http.post(globalConstants.serverIP + '/api/login', {login: login})
          .success(function (result) {
            defer.resolve(result);
          })
          .error(function () {
            console.log('Something went wrong with User recive!');
            defer.resolve({status: 0});
          });
        return defer.promise;
      },


      //-------- get Cities, Regions, Countries from Server
      importLocation: function (login, access) {
        var defer = $q.defer(),
            self = this;
        $http.get(globalConstants.serverIP + '/api/get/locations?login='+login+'&access_token='+access)
          .success(function (result) {
            if(result.status) {
              //-------- insert in LocalDB
              self.insertTablesLocalDB(result).then(function() {
                defer.resolve(1);
              });
            } else {
              console.log('Error!');
              defer.resolve(0);
            }
          })
          .error(function () {
            console.log('Something went wrong with Location!');
            defer.resolve(0);
          });
        return defer.promise;
      },


      importFactories: function (login, access, cityIds) {
        var defer = $q.defer();
        $http.get(globalConstants.serverIP + '/api/get/factories-by-country?login='+login+'&access_token='+access+'&cities_ids='+cityIds)
          .success(function (result) {
            defer.resolve(result);
          })
          .error(function () {
            console.log('Something went wrong with get factories!');
            defer.resolve({status: 0});
          });
        return defer.promise;
      },


      importAllDB: function (login, access) {
        var defer = $q.defer(),
            self = this;
        console.log('Import database begin!');
        $http.get(globalConstants.serverIP+'/api/sync?login='+login+'&access_token='+access)
          .success(function (result) {
            console.log('importAllDB+++', result);
//            console.log('importDb is done!');
            if(result.status) {
              //-------- insert in LocalDB
              self.insertTablesLocalDB(result).then(function() {
                defer.resolve(1);
              });
            } else {
              console.log('Error!');
              defer.resolve(0);
            }
          })
          .error(function () {
            console.log('Something went wrong with importing Database!');
            defer.resolve(0);
          });
        return defer.promise;
      },


      insertServer: function(login, access, table, data) {
        var defer = $q.defer(),
            dataToSend = {
              model: table,
              row: JSON.stringify(data)
            };
        $http.post(globalConstants.serverIP+'/api/insert?login='+login+'&access_token='+access, dataToSend)
          .success(function (result) {
            console.log('send changes to server success:', result);
            defer.resolve(result);
          })
          .error(function (result) {
            console.log('send changes to server failed');
            defer.resolve(result);
          });
        return defer.promise;
      },


      updateServer: function (login, access, data) {
//        tablesToSync.push({model: table_name, rowId: tempObject.id, field: JSON.stringify(tempObject)});
        var promises = data.map(function(item) {
          var defer = $q.defer();
          $http.post(globalConstants.serverIP+'/api/update?login='+login+'&access_token='+access, item)
            .success(function (result) {
              console.log('send changes to server success:', result);
              defer.resolve(1);
            })
            .error(function () {
              console.log('send changes to server failed');
              defer.resolve(0);
            });
          return defer.promise;
        });
        return $q.all(promises);
      },


      createUserServer: function (dataJson) {
        $http.post(globalConstants.serverIP+'/api/register', dataJson)
          .success(function (result) {
            console.log(result);
          })
          .error(function () {
            console.log('Something went wrong when user creating!');
          });
      },


      exportUserEntrance: function (login, access) {
        var currTime = new Date();
        $http.get(globalConstants.serverIP+'/api/signed?login='+login+'&access_token='+access+'&date='+currTime)
          .success(function () {
            console.log('Sucsess!');
          })
          .error(function () {
            console.log('Something went wrong!');
          });
      },


      deleteOrderServer: function(login, access, orderNumber) {
        var dataSend = {orderId: orderNumber*1};
        $http.post(globalConstants.serverIP+'/api/remove-order?login='+login+'&access_token='+access, dataSend)
          .success(function (result) {
            console.log(result);
          })
          .error(function () {
            console.log('Something went wrong with order delete!');
          });
      },



      updateLocalServerDBs: function(table, row, data) {
        var defer = $q.defer(),
            self = this,
            dataToSend = [
              {
                model: table,
                rowId: row,
                field: JSON.stringify(data)
              }
            ];
        self.updateLocalDB(table, data, {'id': row});
        self.updateServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, dataToSend).then(function(data) {
          if(!data) {
            //----- if no connect with Server save in Export LocalDB
            self.insertRowLocalDB(dataToSend, self.tablesLocalDB.export.tableName);
          }
          defer.resolve(1);
        });

        return defer.promise;
      },



      sendIMGServer: function(data) {
        var defer = $q.defer();
        $http.post(globalConstants.serverIP+'/api/load-avatar', data, {
//          withCredentials: true,
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
        }).success(function (result) {
          console.log('send changes to server success:', result);
          defer.resolve(1);
        }).error(function () {
          console.log('send changes to server failed');
          defer.resolve(0);
        });
      },







//TODO old

      getLastSync: function (callback) {
        db.transaction(function (transaction) {
          transaction.executeSql("SELECT last_sync FROM device", [], function (transaction, result) {
            if (result.rows.length) {
              callback(new OkResult({last_sync: result.rows.item(0).last_sync}));
            } else {
              callback(new ErrorResult(2, 'No last_sync data in database!'));
            }
          }, function () {
            callback(new ErrorResult(2, 'Something went wrong with selection last_sync record'));
          });
        });
      },

      syncDb: function (login, access_token) {
        var deferred = $q.defer();
        var i, k, table, updateSql, lastSyncDate;
        var self = this;
        self.getLastSync(function (result) {
          lastSyncDate = result.data.last_sync;
          $http.get('http://api.voice-creator.net/sync/elements?login='+login+'&access_token=' + access_token + '&last_sync=' + lastSyncDate).success(function (result) {
            db.transaction(function (transaction) {
              if(result.tables.length) {
                for (table in result.tables) {
                  for (i = 0; i < result.tables[table].rows.length; i++) {
                    updateSql = '';
                    for(k = 0; k < result.tables[table].fields.length; k++){
                      if(!k) {
                        updateSql += result.tables[table].fields[k] + " = '" + result.tables[table].rows[i][k] + "'";
                      } else {
                        updateSql += ", " + result.tables[table].fields[k] + " = '" + result.tables[table].rows[i][k] + "'";
                      }
                    }
                    transaction.executeSql("UPDATE " + table + " SET " + updateSql + " WHERE id = " + result.tables[table].rows[i][0], [], function () {
                    }, function () {
                      console.log('Something went wrong with updating ' + table + ' record');
                    });
                  }
                }
              }
              transaction.executeSql("UPDATE device SET sync = 1, last_sync = ? WHERE id = 1", [""+result.last_sync+""], function(){
                deferred.resolve('UPDATE is done!');
              }, function () {
                console.log('Something went wrong with updating device table!');
              });
            });

          }).error(function () {
            console.log('Something went wrong with sync Database!');
          });
        });
        return deferred.promise;
      },






      md5: function (string) {
        function RotateLeft(lValue, iShiftBits) {
          return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }
        function AddUnsigned(lX, lY) {
          var lX4, lY4, lX8, lY8, lResult;
          lX8 = (lX & 0x80000000);
          lY8 = (lY & 0x80000000);
          lX4 = (lX & 0x40000000);
          lY4 = (lY & 0x40000000);
          lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
          if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
          }
          if (lX4 | lY4) {
            if (lResult & 0x40000000) {
              return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
              return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
          } else {
            return (lResult ^ lX8 ^ lY8);
          }
        }
        function F(x, y, z) {
          return (x & y) | ((~x) & z);
        }
        function G(x, y, z) {
          return (x & z) | (y & (~z));
        }
        function H(x, y, z) {
          return (x ^ y ^ z);
        }
        function I(x, y, z) {
          return (y ^ (x | (~z)));
        }
        function FF(a, b, c, d, x, s, ac) {
          a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
          return AddUnsigned(RotateLeft(a, s), b);
        }
        function GG(a, b, c, d, x, s, ac) {
          a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
          return AddUnsigned(RotateLeft(a, s), b);
        }
        function HH(a, b, c, d, x, s, ac) {
          a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
          return AddUnsigned(RotateLeft(a, s), b);
        }
        function II(a, b, c, d, x, s, ac) {
          a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
          return AddUnsigned(RotateLeft(a, s), b);
        }
        function ConvertToWordArray(string) {
          var lWordCount;
          var lMessageLength = string.length;
          var lNumberOfWords_temp1 = lMessageLength + 8;
          var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
          var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
          var lWordArray = Array(lNumberOfWords - 1);
          var lBytePosition = 0;
          var lByteCount = 0;
          while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
          }
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4) * 8;
          lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
          lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
          lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
          return lWordArray;
        }
        function WordToHex(lValue) {
          var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
          for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
          }
          return WordToHexValue;
        }
        function Utf8Encode(string) {
          string = string.replace(/\r\n/g, "\n");
          var utftext = "";
          for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
              utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
            }
          }
          return utftext;
        }
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9 , S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
        string = Utf8Encode(string);
        x = ConvertToWordArray(string);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
          AA = a;
          BB = b;
          CC = c;
          DD = d;
          a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
          d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
          c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
          b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
          a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
          d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
          c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
          b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
          a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
          d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
          c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
          b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
          a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
          d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
          c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
          b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
          a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
          d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
          c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
          b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
          a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
          d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
          c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
          b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
          a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
          d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
          c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
          b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
          a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
          d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
          c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
          b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
          a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
          d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
          c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
          b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
          a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
          d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
          c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
          b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
          a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
          d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
          c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
          b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
          a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
          d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
          c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
          b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
          a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
          d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
          c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
          b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
          a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
          d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
          c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
          b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
          a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
          d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
          c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
          b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
          a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
          d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
          c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
          b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
          a = AddUnsigned(a, AA);
          b = AddUnsigned(b, BB);
          c = AddUnsigned(c, CC);
          d = AddUnsigned(d, DD);
        }
        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
        return temp.toLowerCase();
      },





      getCurrentCurrency: function(currencyId, callback){
        db.transaction(function (transaction) {
          transaction.executeSql('select id, name, value from currencies where id = ?', [currencyId], function (transaction, result) {
            if (result.rows.length) {
              callback(new OkResult(result.rows.item(0)));
            } else {
              callback(new ErrorResult(1, 'Incorrect cityId!'));
            }
          }, function () {
            callback(new ErrorResult(2, 'Something went wrong when get current currency'));
          });
        });
      },

      getPriceByIdList: function(liId, i, k, callback){
        db.transaction(function (transaction) {
          transaction.executeSql('select parent_element_id from lists where id = ?', [liId], function (transaction, result){
            if(result.rows.length){
              transaction.executeSql('select id, currency_id, price, waste, name, amendment_pruning from elements where id = ?', [result.rows.item(0).parent_element_id], function (transaction, result){
                if(result.rows.length)
                  callback(new OkResult({"currency":result.rows.item(0), "index":i, "ix":k}));
              }, function () {
                callback(new ErrorResult(2, 'Something went wrong when get element price'));
              });
            }
          }, function () {
            callback(new ErrorResult(2, 'Something went wrong when get parent_element_id'));
          });
        });
      },

      getPriceById: function(elId, i, k, callback){
        db.transaction(function (transaction) {
          transaction.executeSql('select id, currency_id, price, waste, name, amendment_pruning from elements where id = ?', [elId], function (transaction, result){
            if(result.rows.length)
              callback(new OkResult({"currency":result.rows.item(0), "index":i, "ix":k}));
          }, function () {
            callback(new ErrorResult(2, 'Something went wrong when get element price'));
          });
        });
      },

      parseList: function(listId, callback){
        var currListId,
            lists = [];
        var self = this;
        function addL(el){
          return lists.push(el);
        }
        addL(listId);
        (function nextRecord() {
          if (lists.length) {
            currListId = lists[0];
            db.transaction(function (transaction) {
              transaction.executeSql('select * from list_contents where parent_list_id = ?', [currListId], function(transaction, result){
                for (var i = 0; i < result.rows.length; i++) {
                  elemLists.push({"elemLists":result.rows.item(i)});
                  if(result.rows.item(i).child_type === 'list') {
                    addL(result.rows.item(i).child_id);
                  }
                }
                nextRecord();
              });
            });
            lists.shift(0);
          } else {
            callback(new OkResult(elemLists));
          }
        })();
      },

      parseListHw: function(listIdHw, callback){
        var currListIdHw,
            listsHw = [];
        var self = this;
        function addLHw(elHw){
          return listsHw.push(elHw);
        }
        addLHw(listIdHw);
        (function nextRecordHw() {
          if (listsHw.length) {
            currListIdHw = listsHw[0];
            db.transaction(function (transaction) {
              transaction.executeSql('select * from list_contents where parent_list_id = ?', [currListIdHw], function(transaction, result){
                for (var i = 0; i < result.rows.length; i++) {
                  elemListsHw.push({"elemLists":result.rows.item(i)});
                  if(result.rows.item(i).child_type === 'list') {
                    addLHw(result.rows.item(i).child_id);
                  }
                }
                nextRecordHw();
              });
            });
            listsHw.shift(0);
          } else {
            callback(new OkResult(elemListsHw));
          }
        })();
      },

      parseListAdd: function(listIdAdd, callback){
        var currListIdAdd,
            listsAdd = [];
        var self = this;
        function addLAdd(elAdd){
          return listsAdd.push(elAdd);
        }
        addLAdd(listIdAdd);
        (function nextRecordAdd() {
          if (listsAdd.length) {
            currListIdAdd = listsAdd[0];
            db.transaction(function (transaction) {
              transaction.executeSql('select * from list_contents where parent_list_id = ?', [currListIdAdd], function(transaction, result){
                for (var i = 0; i < result.rows.length; i++) {
                  elemListsAdd.push({"elemLists":result.rows.item(i)});
                  if(result.rows.item(i).child_type === 'list') {
                    addLAdd(result.rows.item(i).child_id);
                  }
                }
                nextRecordAdd();
              });
            });
            listsAdd.shift(0);
          } else {
            callback(new OkResult(elemListsAdd));
          }
        })();
      },

      getValueByRule: function (parentValue, childValue, rule){
        var value = 0;
        switch (rule) {
          case 1:
            value = parentValue - childValue;
            break;
          case 3:
            value = (Math.round(parentValue) * childValue).toFixed(3);
            break;
          case 5:
            value = parentValue * childValue;
            break;
          case 6:
            value = (parentValue * childValue).toFixed(3);
            break;
          case 7:
            value = (parentValue * childValue).toFixed(3);
            break;
          case 8:
            value = (parentValue * childValue).toFixed(3);
            break;
          case 9:
            value = (parentValue * childValue).toFixed(3);
            break;
          case 12:
            value = (Math.round(parentValue) * childValue).toFixed(3);
            break;
          case 13:
            value = (parentValue * childValue).toFixed(3);
            break;
          case 14:
            value = (Math.round(parentValue) * childValue).toFixed(3);
            break;
          case 21:
            break;
          case 22:
            break;
          case 23:
            value = (parentValue * childValue).toFixed(3);
            break;
          default:
            value = childValue;
            break;
        }
        return value;
      },

      getByHardwareId: function(whId, construction, callback){
        var self = this;
        db.transaction(function (transaction) {
          transaction.executeSql('select * from window_hardwares where window_hardware_group_id = ? and child_id > 0 and count > 0', [whId], function (transaction, result){
            var hardwareresult = [];
            for(var i = 0; i < result.rows.length; i++){
              for(var j = 0; j < construction.sashesBlock.length; j++){
                if(result.rows.item(i).min_width > 0 && result.rows.item(i).max_width > 0 && construction.sashesBlock[j].sizes[0] >= result.rows.item(i).min_width && construction.sashesBlock[j].sizes[0] <= result.rows.item(i).max_width && result.rows.item(i).direction_id == 1 && result.rows.item(i).min_height == 0 && result.rows.item(i).max_height == 0) {
                  if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  }
                } else if(result.rows.item(i).min_height > 0 && result.rows.item(i).max_height > 0 && construction.sashesBlock[j].sizes[1] >= result.rows.item(i).min_height && construction.sashesBlock[j].sizes[1] <= result.rows.item(i).max_height && result.rows.item(i).direction_id == 1 && result.rows.item(i).min_width == 0 && result.rows.item(i).max_width == 0) {
                  if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  }
                } else if(result.rows.item(i).min_height > 0 && result.rows.item(i).max_height > 0 && construction.sashesBlock[j].sizes[1] >= result.rows.item(i).min_height && construction.sashesBlock[j].sizes[1] <= result.rows.item(i).max_height && result.rows.item(i).direction_id == 1 && result.rows.item(i).min_width > 0 && result.rows.item(i).max_width > 0 && construction.sashesBlock[j].sizes[0] >= result.rows.item(i).min_width && construction.sashesBlock[j].sizes[0] <= result.rows.item(i).max_width){
                  if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                    hardwareresult.push({"elemLists":result.rows.item(i)});
                  }
                } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).min_height == 0 && result.rows.item(i).max_height == 0 && result.rows.item(i).direction_id > 1 && result.rows.item(i).min_width == 0 && result.rows.item(i).max_width == 0){
                  if(construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 2 && result.rows.item(i).direction_id == 3 || construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 4 && result.rows.item(i).direction_id == 2) {
                    if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    }
                  }
                } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).min_height == 0 && result.rows.item(i).max_height == 0 && result.rows.item(i).direction_id > 1 && result.rows.item(i).min_width > 0 && result.rows.item(i).max_width > 0 && construction.sashesBlock[j].sizes[0] >= result.rows.item(i).min_width && construction.sashesBlock[j].sizes[0] <= result.rows.item(i).max_width){
                  if(construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 2 && result.rows.item(i).direction_id == 3 || construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 4 && result.rows.item(i).direction_id == 2) {
                    if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    }
                  }
                } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).min_width == 0 && result.rows.item(i).max_width == 0 && result.rows.item(i).direction_id > 1 && result.rows.item(i).min_height > 0 && result.rows.item(i).max_height > 0 && construction.sashesBlock[j].sizes[1] >= result.rows.item(i).min_height && construction.sashesBlock[j].sizes[1] <= result.rows.item(i).max_height){
                  if(construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 2 && result.rows.item(i).direction_id == 3 || construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 4 && result.rows.item(i).direction_id == 2) {
                    if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    }
                  }
                } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).min_width > 0 && result.rows.item(i).max_width > 0 && construction.sashesBlock[j].sizes[0] >= result.rows.item(i).min_width && construction.sashesBlock[j].sizes[0] <= result.rows.item(i).max_width && result.rows.item(i).direction_id > 1 && result.rows.item(i).min_height > 0 && result.rows.item(i).max_height > 0 && construction.sashesBlock[j].sizes[1] >= result.rows.item(i).min_height && construction.sashesBlock[j].sizes[1] <= result.rows.item(i).max_height){
                  if(construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 2 && result.rows.item(i).direction_id == 3 || construction.sashesBlock[j].openDir[0] == 1 && construction.sashesBlock[j].openDir[1] == 4 && result.rows.item(i).direction_id == 2) {
                    if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 2){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 2){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 1 && result.rows.item(i).window_hardware_type_id == 7){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 6){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 2 && result.rows.item(i).window_hardware_type_id == 4){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 1 && construction.sashesBlock[j].openDir[0] == 4 && result.rows.item(i).window_hardware_type_id == 4){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    } else if(construction.shtulpsSize.length > 0 && construction.sashesBlock[j].openDir.length == 2 && result.rows.item(i).window_hardware_type_id == 17){
                      hardwareresult.push({"elemLists":result.rows.item(i)});
                    }
                  }
                }
              }
            }
            self.hardwareListSync(hardwareresult, function (result){
              if(result.status){
                callback(new OkResult(result.data));
              } else {
                console.log(result);
              }
            });
          }, function () {
            callback(new ErrorResult(2, 'Something went wrong when get data'));
          });
        });
      },

      hardwareListSync: function(hardwareresult, callback){
        var currListIdHw;
        var listsHw = [];
        var self = this;
        function addLHw(elHw, keysHw){
          return listsHw.push(elHw);
        }
        for(var i = 0; i < hardwareresult.length; i++){
          if(hardwareresult[i].elemLists.child_type == 'list'){
            addLHw(hardwareresult[i].elemLists.child_id);
          }
        }
        hardwareresult.push({"lists":listsHw});
        callback(new OkResult(hardwareresult));
      },

      calculationPrice: function (construction, callback) {
        var self = this;
        var price = 0, profSys, priceObj = {};
        this.getCurrentCurrency(construction.currencyId, function (result){
          next_1(result);
        });
        function next_1(result){
          if(result.status){
            priceObj.currentCurrency = result.data;
            elemLists = [];
            self.parseList(construction.frameId, function (result){next_2(result);});
          } else {
            console.log(result);
          }
        }
        function next_2(result){
          if(result.status){
            priceObj.framesIds =  result.data;
            elemLists = [];
            self.parseList(construction.frameSillId, function (result){next_3(result);});
          } else {
            console.log(result);
          }
        }
        function next_3(result){
          if(result.status){
            priceObj.frameSillsIds =  result.data;
            elemLists = [];
            self.parseList(construction.sashId, function (result){next_4(result);});
          } else {
            console.log(result);
          }
        }
        function next_4(result){
          if(result.status){
            priceObj.sashsIds = result.data;
            elemLists = [];
            self.parseList(construction.impostId, function (result){next_5(result);});
          } else {
            console.log(result);
          }
        }
        function next_5(result) {
          if (result.status) {
            priceObj.impostIds = result.data;
            elemLists = [];
            self.parseList(construction.glassId, function (result){next_bead(result);});
          }
        }
        function next_bead(result){
          if (result.status) {
            priceObj.glassIds = result.data;
            elemLists = [];
            self.getByHardwareId(construction.hardwareId, construction, function (result){next_tmp(result);});
          }
        }
        function next_tmp(result){
          if (result.status) {
            priceObj.hardwareIds = result.data;
            elemLists = [];
            var ifList = false;
            for(var i = 0; i < priceObj.hardwareIds.length; i++){
              if("lists" in priceObj.hardwareIds[i]){
                if(priceObj.hardwareIds[i].lists.length > 0) {
                  ifList = true;
                }
              }
            }
            if(ifList){
              next_hwlist(result.data);
            } else {
              self.parseList(construction.beadId, function (result){next_glass(result);});
            }
          }
        }
        function next_hwlist(result){
          for(var i = 0; i < priceObj.hardwareIds.length; i++){
            if("lists" in priceObj.hardwareIds[i]){
              if(priceObj.hardwareIds[i].lists.length > 0){
                self.parseList(priceObj.hardwareIds[i].lists[0], function (result){next_hwlist_res(result);});
              }
            }
          }
        }
        function next_hwlist_res(result){
          if (result.status) {
            //priceObj.hardwareIds.push({"hardwareLists":result.data});
            for(var i = 0; i < priceObj.hardwareIds.length; i++){
              if("lists" in priceObj.hardwareIds[i]){
                if(priceObj.hardwareIds[i].lists.length > 0){
                  priceObj.hardwareIds.push({"hardwareLists":result.data, "parent_list_id":priceObj.hardwareIds[i].lists[0]});
                  priceObj.hardwareIds[i].lists.shift(0);
                }
              }
            }
            next_tmp({"status":true, "data":priceObj.hardwareIds});
          }
        }
        function next_glass(result){
          if(result.status){
            priceObj.beadIds = result.data;
            elemLists = [];
            db.transaction(function (transaction) {
              console.log('PRICE ids++++', construction.frameId, construction.frameSillId, construction.sashId, construction.impostId, construction.glassId, construction.beadId);
              transaction.executeSql('select parent_element_id, name from lists where id in (?, ?, ?, ?, ?, ?)', [construction.frameId, construction.frameSillId, construction.sashId, construction.impostId, construction.glassId, construction.beadId], function (transaction, result){next_6(result);}, function () {
                callback(new ErrorResult(2, 'Something went wrong when get parent_element_id'));
              });
            });
          } else {
            console.log(result);
          }
        }
        function next_6(result){
          if(result.rows.length){
            priceObj.framesIds.parent_element_id = result.rows.item(0).parent_element_id;
            priceObj.frameSillsIds.parent_element_id = result.rows.item(1).parent_element_id;
            priceObj.sashsIds.parent_element_id = result.rows.item(2).parent_element_id;
            priceObj.impostIds.parent_element_id = result.rows.item(3).parent_element_id;
            priceObj.glassIds.parent_element_id = result.rows.item(5).parent_element_id;
            priceObj.beadIds.parent_element_id = result.rows.item(4).parent_element_id;
            priceObj.framesIds.name = result.rows.item(0).name;
            priceObj.frameSillsIds.name = result.rows.item(1).name;
            priceObj.sashsIds.name = result.rows.item(2).name;
            priceObj.impostIds.name = result.rows.item(3).name;
            priceObj.glassIds.name = result.rows.item(5).name;
            priceObj.beadIds.name = result.rows.item(4).name;
            db.transaction(function (transaction) {
              transaction.executeSql('select id, currency_id, price, waste, name, amendment_pruning from elements where id in (?, ?, ?, ?, ?, ?)', [result.rows.item(0).parent_element_id, result.rows.item(1).parent_element_id, result.rows.item(2).parent_element_id, result.rows.item(3).parent_element_id, result.rows.item(4).parent_element_id, result.rows.item(5).parent_element_id], function (transaction, result){next_7(result);}, function () {
                callback(new ErrorResult(2, 'Something went wrong when get element price'));
              });
            });
          } else {
            console.log(result);
          }
        }
        function next_7(result) {
          if(result.rows.length){
            for (var i = 0; i < result.rows.length; i++) {
              if(result.rows.item(i).id == priceObj.framesIds.parent_element_id){
                priceObj.framesIds.price = result.rows.item(i);
              }
              if(result.rows.item(i).id == priceObj.frameSillsIds.parent_element_id){
                priceObj.frameSillsIds.price = result.rows.item(i);
              }
              if(result.rows.item(i).id == priceObj.sashsIds.parent_element_id){
                priceObj.sashsIds.price = result.rows.item(i);
              }
              if(result.rows.item(i).id == priceObj.impostIds.parent_element_id){
                priceObj.impostIds.price = result.rows.item(i);
              }
              if(result.rows.item(i).id == priceObj.glassIds.parent_element_id){
                priceObj.glassIds.price = result.rows.item(i);
              }
              if(result.rows.item(i).id == priceObj.beadIds.parent_element_id){
                priceObj.beadIds.price = result.rows.item(i);
              }
            }
            if(priceObj.framesIds.length) {
              for (var i = 0; i < priceObj.framesIds.length; i++) {
                if (priceObj.framesIds[i].elemLists.child_type === 'element'){
                  self.getPriceById(priceObj.framesIds[i].elemLists.child_id, i, i, function (result){
                    priceObj.framesIds[result.data.index].priceEl = result.data.currency;
                    priceObj.framesIds[result.data.index].elemName = result.data.currency.name;
                    priceObj.framesIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                } else {
                  self.getPriceByIdList(priceObj.framesIds[i].elemLists.child_id, i, i, function (result){
                    priceObj.framesIds[result.data.index].priceEl = result.data.currency;
                    priceObj.framesIds[result.data.index].elemName = result.data.currency.name;
                    priceObj.framesIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                }
              }
            }
            if(priceObj.frameSillsIds.length) {
              for (var i = 0; i < priceObj.frameSillsIds.length; i++) {
                if (priceObj.frameSillsIds[i].elemLists.child_type === 'element'){
                  self.getPriceById(priceObj.frameSillsIds[i].elemLists.child_id, i, i, function (result){
                    priceObj.frameSillsIds[result.data.index].priceEl = result.data.currency;
                    priceObj.frameSillsIds[result.data.index].elemName = result.data.currency.name;
                    priceObj.frameSillsIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                } else {
                  self.getPriceByIdList(priceObj.frameSillsIds[i].elemLists.child_id, i, i, function (result){
                    priceObj.frameSillsIds[result.data.index].priceEl = result.data.currency;
                    priceObj.frameSillsIds[result.data.index].elemName = result.data.currency.name;
                    priceObj.frameSillsIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                }
              }
            }
            if(priceObj.sashsIds.length) {
              for (var i = 0; i < priceObj.sashsIds.length; i++) {
                if (priceObj.sashsIds[i].elemLists.child_type === 'element'){
                  self.getPriceById(priceObj.sashsIds[i].elemLists.child_id, i, i, function (result){
                    priceObj.sashsIds[result.data.index].priceEl = result.data.currency;
                    priceObj.sashsIds[result.data.index].elemName = result.data.currency.name;
                    priceObj.sashsIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                } else {
                  self.getPriceByIdList(priceObj.sashsIds[i].elemLists.child_id, i, i, function (result){
                    priceObj.sashsIds[result.data.index].priceEl = result.data.currency;
                    priceObj.sashsIds[result.data.index].elemName = result.data.currency.name;
                    priceObj.sashsIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                }
              }
            }
            if(priceObj.impostIds.length) {
              for (var i = 0; i < priceObj.impostIds.length; i++) {
                if (priceObj.impostIds[i].elemLists.child_type === 'element'){
                  self.getPriceById(priceObj.impostIds[i].elemLists.child_id, i, i, function (result){
                    priceObj.impostIds[result.data.index].priceEl = result.data.currency;
                    priceObj.impostIds[result.data.index].elemName = result.data.currency.name;
                    priceObj.impostIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                } else {
                  self.getPriceByIdList(priceObj.impostIds[i].elemLists.child_id, i, i, function (result){
                    priceObj.impostIds[result.data.index].priceEl = result.data.currency;
                    priceObj.impostIds[result.data.index].elemName = result.data.currency.name;
                    priceObj.impostIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                }
              }
            }
            if(priceObj.glassIds.length) {
              for (var i = 0; i < priceObj.glassIds.length; i++) {
                if (priceObj.glassIds[i].elemLists.child_type === 'element'){
                  self.getPriceById(priceObj.glassIds[i].elemLists.child_id, i, i, function (result){
                    priceObj.glassIds[result.data.index].priceEl = result.data.currency;
                    priceObj.glassIds[result.data.index].elemName = result.data.currency.name;
                    priceObj.glassIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                } else {
                  self.getPriceByIdList(priceObj.glassIds[i].elemLists.child_id, i, i, function (result){
                    priceObj.glassIds[result.data.index].priceEl = result.data.currency;
                    priceObj.glassIds[result.data.index].elemName = result.data.currency.name;
                    priceObj.glassIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                }
              }
            }
            if(priceObj.beadIds.length) {
              for (var i = 0; i < priceObj.beadIds.length; i++) {
                if (priceObj.beadIds[i].elemLists.child_type === 'element'){
                  self.getPriceById(priceObj.beadIds[i].elemLists.child_id, i, i, function (result){
                    priceObj.beadIds[result.data.index].priceEl = result.data.currency;
                    priceObj.beadIds[result.data.index].elemName = result.data.currency.name;
                    priceObj.beadIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                } else {
                  self.getPriceByIdList(priceObj.beadIds[i].elemLists.child_id, i, i, function (result){
                    priceObj.beadIds[result.data.index].priceEl = result.data.currency;
                    priceObj.beadIds[result.data.index].elemName = result.data.currency.name;
                    priceObj.beadIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                }
              }
            }
            if(priceObj.hardwareIds.length) {
              for (var i = 0; i < priceObj.hardwareIds.length; i++) {
                if(priceObj.hardwareIds[i].elemLists){
                  if (priceObj.hardwareIds[i].elemLists.child_type === 'element'){
                    if(priceObj.hardwareIds[i].elemLists.child_id > 0){
                      self.getPriceById(priceObj.hardwareIds[i].elemLists.child_id, i, i, function (result){
                        priceObj.hardwareIds[result.data.index].priceEl = result.data.currency;
                        priceObj.hardwareIds[result.data.index].elemName = result.data.currency.name;
                        priceObj.hardwareIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                      });
                    }
                  } else {
                    if(priceObj.hardwareIds[i].elemLists.child_id > 0) {
                      self.getPriceByIdList(priceObj.hardwareIds[i].elemLists.child_id, i, i, function (result) {
                        priceObj.hardwareIds[result.data.index].priceEl = result.data.currency;
                        priceObj.hardwareIds[result.data.index].elemName = result.data.currency.name;
                        priceObj.hardwareIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                      });
                    }
                  }
                }
              }
            }
            if(priceObj.hardwareIds.length) {
              for (var i = 0; i < priceObj.hardwareIds.length; i++) {
                if(priceObj.hardwareIds[i].hardwareLists){
                  for (var k = 0; k < priceObj.hardwareIds[i].hardwareLists.length; k++) {
                    if (priceObj.hardwareIds[i].hardwareLists[k].elemLists.child_type === 'element') {
                      self.getPriceById(priceObj.hardwareIds[i].hardwareLists[k].elemLists.child_id, i, k, function (result) {
                        priceObj.hardwareIds[result.data.index].hardwareLists[result.data.ix].priceEl = result.data.currency;
                        priceObj.hardwareIds[result.data.index].hardwareLists[result.data.ix].elemName = result.data.currency.name;
                        priceObj.hardwareIds[result.data.index].hardwareLists[result.data.ix].pruning = result.data.currency.amendment_pruning;
                      });
                    } else {
                      self.getPriceByIdList(priceObj.hardwareIds[i].hardwareLists[k].elemLists.child_id, i, k, function (result) {
                        priceObj.hardwareIds[result.data.index].hardwareLists[result.data.ix].priceEl = result.data.currency;
                        priceObj.hardwareIds[result.data.index].hardwareLists[result.data.ix].elemName = result.data.currency.name;
                        priceObj.hardwareIds[result.data.index].hardwareLists[result.data.ix].pruning = result.data.currency.amendment_pruning;
                      });
                    }
                  }
                }
              }
            }
            db.transaction(function (transaction) {
              transaction.executeSql('select id, name, value from currencies', [], function (transaction, result){next_8(result);}, function () {
                callback(new ErrorResult(2, 'Something went wrong when get parent_element_id'));
              });
            });
          } else {
            console.log(result);
          }
        }
        function next_8(result) {
          if(result.rows.length){
            priceObj.currencies = [];
            priceObj.price = 0;
            for (var i = 0; i < result.rows.length; i++) {
              priceObj.currencies.push(result.rows.item(i));
            }
            var priceTmp = 0;
            if(construction.framesSize.length) {
              for (var i = 0; i < construction.framesSize.length; i++) {
                priceTmp += (((construction.framesSize[i] + priceObj.framesIds.price.amendment_pruning)/ 1000) * priceObj.framesIds.price.price) * (1 + (priceObj.framesIds.price.waste / 100));
              }
              if (priceObj.currentCurrency.id != priceObj.framesIds.price.currency_id){
                for (var i = 0; i < priceObj.currencies.length; i++) {
                  if(priceObj.currencies[i].id == priceObj.framesIds.price.currency_id){
                    priceTmp = priceTmp * priceObj.currencies[i].value;
                  }
                }
              }
            }
            priceObj.price += priceTmp;
            construction.framesSize.shift();
            var priceTmp = 0;
            if(construction.sashsSize.length) {
              for (var i = 0; i < construction.sashsSize.length; i++) {
                priceTmp += (((construction.sashsSize[i] + priceObj.sashsIds.price.amendment_pruning)/ 1000) * priceObj.sashsIds.price.price) * (1 + (priceObj.sashsIds.price.waste / 100));
              }
              if (priceObj.currentCurrency.id != priceObj.sashsIds.price.currency_id){
                for (var i = 0; i < priceObj.currencies.length; i++) {
                  if(priceObj.currencies[i].id == priceObj.sashsIds.price.currency_id){
                    priceTmp = priceTmp * priceObj.currencies[i].value;
                  }
                }
              }
            }
            priceObj.price += priceTmp;
            var priceTmp = 0;
            if(construction.beadsSize.length) {
              for (var i = 0; i < construction.beadsSize.length; i++) {
                priceTmp += (((construction.beadsSize[i] + priceObj.beadIds.price.amendment_pruning)/ 1000) * priceObj.beadIds.price.price) * (1 + (priceObj.beadIds.price.waste / 100));
              }
              if (priceObj.currentCurrency.id != priceObj.beadIds.price.currency_id){
                for (var i = 0; i < priceObj.currencies.length; i++) {
                  if(priceObj.currencies[i].id == priceObj.beadIds.price.currency_id){
                    priceTmp = priceTmp * priceObj.currencies[i].value;
                  }
                }
              }
            }
            priceObj.price += priceTmp;
            var priceTmp = 0;
            if(construction.impostsSize.length) {
              for (var i = 0; i < construction.impostsSize.length; i++) {
                priceTmp += (((construction.impostsSize[i] + priceObj.impostIds.price.amendment_pruning)/ 1000) * priceObj.impostIds.price.price) * (1 + (priceObj.impostIds.price.waste / 100));
              }
              if (priceObj.currentCurrency.id != priceObj.impostIds.price.currency_id){
                for (var i = 0; i < priceObj.currencies.length; i++) {
                  if(priceObj.currencies[i].id == priceObj.impostIds.price.currency_id){
                    priceTmp = priceTmp * priceObj.currencies[i].value;
                  }
                }
              }
            }
            priceObj.price += priceTmp;
            var priceTmp = 0;
            if(construction.glassSquares.length) {
              for (var i = 0; i < construction.glassSquares.length; i++) {
                priceTmp += construction.glassSquares[i] * priceObj.glassIds.price.price;
              }
              if (priceObj.currentCurrency.id != priceObj.glassIds.price.currency_id){
                for (var i = 0; i < priceObj.currencies.length; i++) {
                  if(priceObj.currencies[i].id == priceObj.glassIds.price.currency_id){
                    priceTmp = priceTmp * priceObj.currencies[i].value;
                  }
                }
              }
            }
            priceObj.price += priceTmp;
  //======== Рама - начало
            if(construction.framesSize.length) {
              for (var i = 0; i < construction.framesSize.length; i++) {
                if(priceObj.framesIds.length) {
                  for (var j = 0; j < priceObj.framesIds.length; j++) {
                    var priceTmp = 0;
                    if(priceObj.framesIds[j].elemLists.parent_list_id == construction.frameId){
                      if(priceObj.framesIds[j].priceEl) {
                        var value = self.getValueByRule(((construction.framesSize[i] + priceObj.framesIds[j].priceEl.amendment_pruning) / 1000), priceObj.framesIds[j].elemLists.value, priceObj.framesIds[j].elemLists.rules_type_id);
                        priceObj.framesIds[j].elemLists.newValue = value;
                        if (priceObj.framesIds[j].elemLists.rules_type_id === 3) {
                          priceTmp += (Math.round(((construction.framesSize[i] + priceObj.framesIds[j].priceEl.amendment_pruning) / 1000) * priceObj.framesIds[j].elemLists.value) * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                        } else if (priceObj.framesIds[j].elemLists.rules_type_id === 2 || priceObj.framesIds[j].elemLists.rules_type_id === 4 || priceObj.framesIds[j].elemLists.rules_type_id === 15) {
                          priceTmp += (priceObj.framesIds[j].elemLists.value * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                        } else if (priceObj.framesIds[j].elemLists.rules_type_id === 1) {
                          priceTmp += (((construction.framesSize[i] + priceObj.framesIds[j].priceEl.amendment_pruning - (priceObj.framesIds[j].elemLists.value * 1000)) / 1000) * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                        } else {
                          priceTmp += (((construction.framesSize[i] + priceObj.framesIds[j].priceEl.amendment_pruning) / 1000) * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                        }
                        if (priceObj.currentCurrency.id != priceObj.framesIds[j].priceEl.currency_id) {
                          for (var k = 0; k < priceObj.currencies.length; k++) {
                            if (priceObj.currencies[k].id == priceObj.framesIds[j].priceEl.currency_id) {
                              priceTmp = priceTmp * priceObj.currencies[k].value;
                            }
                          }
                        }
                      }
                    } else {
                      for (var g = 0; g < priceObj.framesIds.length; g++) {
                        if(priceObj.framesIds[j].elemLists.parent_list_id == priceObj.framesIds[g].elemLists.child_id){
                          var value = self.getValueByRule(priceObj.framesIds[g].elemLists.newValue, priceObj.framesIds[g].elemLists.value, priceObj.framesIds[g].elemLists.rules_type_id);
                          priceObj.framesIds[j].elemLists.newValue = value;
                          if(priceObj.framesIds[j].elemLists.rules_type_id === 3){
                            priceTmp += (Math.round((priceObj.framesIds[g].elemLists.newValue+priceObj.framesIds[j].priceEl.amendment_pruning)*priceObj.framesIds[j].elemLists.value)*priceObj.framesIds[j].priceEl.price)*(1+(priceObj.framesIds[j].priceEl.waste/100));
                          } else if(priceObj.framesIds[j].elemLists.rules_type_id === 2 || priceObj.framesIds[j].elemLists.rules_type_id === 4 || priceObj.framesIds[j].elemLists.rules_type_id === 15){
                            priceTmp += (priceObj.framesIds[g].elemLists.newValue*priceObj.framesIds[j].elemLists.value * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                          } else if (priceObj.framesIds[j].elemLists.rules_type_id === 1){
                            priceTmp += (((priceObj.framesIds[g].elemLists.newValue+priceObj.framesIds[j].priceEl.amendment_pruning - (priceObj.framesIds[j].elemLists.value*1000))/1000) * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                          } else {
                            priceTmp += (((priceObj.framesIds[g].elemLists.newValue+priceObj.framesIds[j].priceEl.amendment_pruning)/1000) * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                          }
                          if (priceObj.currentCurrency.id != priceObj.framesIds[j].priceEl.currency_id){
                            for (var k = 0; k < priceObj.currencies.length; k++) {
                              if(priceObj.currencies[k].id == priceObj.framesIds[j].priceEl.currency_id){
                                priceTmp = priceTmp * priceObj.currencies[k].value;
                              }
                            }
                          }
                        }
                      }
                    }
                    priceObj.price += priceTmp;
                  }
                }
              }
            }
  //===== Рама - конец
  //====== Подоконный профиль - начало
            if(construction.frameSillSize) {
              if(priceObj.frameSillsIds.length) {
                for (var j = 0; j < priceObj.frameSillsIds.length; j++) {
                  var priceTmp = 0;
                  if(priceObj.frameSillsIds[j].elemLists.parent_list_id == construction.frameSillId){
                    var value = self.getValueByRule(((construction.frameSillSize+priceObj.frameSillsIds[j].priceEl.amendment_pruning)/1000), priceObj.frameSillsIds[j].elemLists.value, priceObj.frameSillsIds[j].elemLists.rules_type_id);
                    priceObj.frameSillsIds[j].elemLists.newValue = value;
                    if(priceObj.frameSillsIds[j].elemLists.rules_type_id === 3){
                      priceTmp += (Math.round(((construction.frameSillSize+priceObj.frameSillsIds[j].priceEl.amendment_pruning)/1000)*priceObj.frameSillsIds[j].elemLists.value)*priceObj.frameSillsIds[j].priceEl.price)*(1+(priceObj.frameSillsIds[j].priceEl.waste/100));
                    } else if(priceObj.frameSillsIds[j].elemLists.rules_type_id === 2 || priceObj.frameSillsIds[j].elemLists.rules_type_id === 4 || priceObj.frameSillsIds[j].elemLists.rules_type_id === 15){
                      priceTmp += (priceObj.frameSillsIds[j].elemLists.value * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
                    } else if (priceObj.frameSillsIds[j].elemLists.rules_type_id === 1){
                      priceTmp += (((construction.frameSillSize+priceObj.frameSillsIds[j].priceEl.amendment_pruning - (priceObj.frameSillsIds[j].elemLists.value*1000))/1000) * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
                    } else {
                      priceTmp += (((construction.frameSillSize+priceObj.frameSillsIds[j].priceEl.amendment_pruning)/1000) * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
                    }
                    if (priceObj.currentCurrency.id != priceObj.frameSillsIds[j].priceEl.currency_id){
                      for (var k = 0; k < priceObj.currencies.length; k++) {
                        if(priceObj.currencies[k].id == priceObj.frameSillsIds[j].priceEl.currency_id){
                          priceTmp = priceTmp * priceObj.currencies[k].value;
                        }
                      }
                    }
                  } else {
                    for (var g = 0; g < priceObj.frameSillsIds.length; g++) {
                      if(priceObj.frameSillsIds[j].elemLists.parent_list_id == priceObj.frameSillsIds[g].elemLists.child_id){
                        var value = self.getValueByRule(priceObj.frameSillsIds[g].elemLists.newValue, priceObj.frameSillsIds[j].elemLists.value, priceObj.frameSillsIds[g].elemLists.rules_type_id);
                        priceObj.frameSillsIds[j].elemLists.newValue = value;
                        if(priceObj.frameSillsIds[j].elemLists.rules_type_id === 3){
                          priceTmp += (Math.round((priceObj.frameSillsIds[g].elemLists.newValue+priceObj.frameSillsIds[j].priceEl.amendment_pruning)*priceObj.frameSillsIds[j].elemLists.value)*priceObj.frameSillsIds[j].priceEl.price)*(1+(priceObj.frameSillsIds[j].priceEl.waste/100));
                        } else if(priceObj.frameSillsIds[j].elemLists.rules_type_id === 2 || priceObj.frameSillsIds[j].elemLists.rules_type_id === 4 || priceObj.frameSillsIds[j].elemLists.rules_type_id === 15){
                          priceTmp += (priceObj.frameSillsIds[j].elemLists.value * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
                        } else if (priceObj.frameSillsIds[j].elemLists.rules_type_id === 1){
                          priceTmp += (((priceObj.frameSillsIds[g].elemLists.newValue+priceObj.frameSillsIds[j].priceEl.amendment_pruning - (priceObj.frameSillsIds[j].elemLists.value*1000))) * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
                        } else {
                          priceTmp += (((priceObj.frameSillsIds[g].elemLists.newValue+priceObj.frameSillsIds[j].priceEl.amendment_pruning)/1000) * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
                        }
                        if (priceObj.currentCurrency.id != priceObj.frameSillsIds[j].priceEl.currency_id){
                          for (var k = 0; k < priceObj.currencies.length; k++) {
                            if(priceObj.currencies[k].id == priceObj.frameSillsIds[j].priceEl.currency_id){
                              priceTmp = priceTmp * priceObj.currencies[k].value;
                            }
                          }
                        }
                      }
                    }
                  }
                  priceObj.price += priceTmp;
                }
              }
            }
            //======== Подоконный профиль - конец

            //======== Створка - начало
            if(construction.sashsSize.length) {
              for (var i = 0; i < construction.sashsSize.length; i++) {
                if(priceObj.sashsIds.length) {
                  for (var j = 0; j < priceObj.sashsIds.length; j++) {
                    var priceTmp = 0;
                    if(priceObj.sashsIds[j].elemLists.parent_list_id == construction.sashId){
                      var value = self.getValueByRule(((construction.sashsSize[i]+priceObj.sashsIds[j].priceEl.amendment_pruning)/1000), priceObj.sashsIds[j].elemLists.value, priceObj.sashsIds[j].elemLists.rules_type_id);
                      priceObj.sashsIds[j].elemLists.newValue = value;
                      if(priceObj.sashsIds[j].elemLists.rules_type_id === 3){
                        priceTmp += (Math.round(((construction.sashsSize[i]+priceObj.sashsIds[j].priceEl.amendment_pruning)/1000)*priceObj.sashsIds[j].elemLists.value)*priceObj.sashsIds[j].priceEl.price)*(1+(priceObj.sashsIds[j].priceEl.waste/100));
                      } else if(priceObj.sashsIds[j].elemLists.rules_type_id === 2 || priceObj.sashsIds[j].elemLists.rules_type_id === 4 || priceObj.sashsIds[j].elemLists.rules_type_id === 15){
                        priceTmp += (priceObj.sashsIds[j].elemLists.value * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
                      } else if (priceObj.sashsIds[j].elemLists.rules_type_id === 1){
                        priceTmp += (((construction.sashsSize[i]+priceObj.sashsIds[j].priceEl.amendment_pruning - (priceObj.sashsIds[j].elemLists.value*1000))/1000) * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
                      } else {
                        priceTmp += (((construction.sashsSize[i]+priceObj.sashsIds[j].priceEl.amendment_pruning)/1000) * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
                      }
                      if (priceObj.currentCurrency.id != priceObj.sashsIds[j].priceEl.currency_id){
                        for (var k = 0; k < priceObj.currencies.length; k++) {
                          if(priceObj.currencies[k].id == priceObj.sashsIds[j].priceEl.currency_id){
                            priceTmp = priceTmp * priceObj.currencies[k].value;
                          }
                        }
                      }
                    } else {
                      for (var g = 0; g < priceObj.sashsIds.length; g++) {
                        if(priceObj.sashsIds[j].elemLists.parent_list_id == priceObj.sashsIds[g].elemLists.child_id){
                          var value = self.getValueByRule((priceObj.sashsIds[g].elemLists.newValue/1000), priceObj.sashsIds[j].elemLists.value, priceObj.sashsIds[g].elemLists.rules_type_id);
                          priceObj.sashsIds[j].elemLists.newValue = value;
                          if(priceObj.sashsIds[j].elemLists.rules_type_id === 3){
                            priceTmp += (Math.round((priceObj.sashsIds[g].elemLists.newValue+(priceObj.sashsIds[j].priceEl.amendment_pruning/1000))*priceObj.sashsIds[j].elemLists.value)*priceObj.sashsIds[j].priceEl.price)*(1+(priceObj.sashsIds[j].priceEl.waste/100));
                          } else if(priceObj.sashsIds[j].elemLists.rules_type_id === 2 || priceObj.sashsIds[j].elemLists.rules_type_id === 4 || priceObj.sashsIds[j].elemLists.rules_type_id === 15){
                            priceTmp += (priceObj.sashsIds[g].elemLists.newValue*priceObj.sashsIds[j].elemLists.value * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
                          } else if (priceObj.sashsIds[j].elemLists.rules_type_id === 1){
                            priceTmp += (((priceObj.sashsIds[g].elemLists.newValue+priceObj.sashsIds[j].priceEl.amendment_pruning - (priceObj.sashsIds[j].elemLists.value*1000))/1000) * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
                          } else {
                            priceTmp += (((priceObj.sashsIds[g].elemLists.newValue+priceObj.sashsIds[j].priceEl.amendment_pruning)/1000) * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
                          }
                          if (priceObj.currentCurrency.id != priceObj.sashsIds[j].priceEl.currency_id){
                            for (var k = 0; k < priceObj.currencies.length; k++) {
                              if(priceObj.currencies[k].id == priceObj.sashsIds[j].priceEl.currency_id){
                                priceTmp = priceTmp * priceObj.currencies[k].value;
                              }
                            }
                          }
                        }
                      }
                    }
                    priceObj.price += priceTmp;
                  }
                }
              }
            }
            //======== Створка - конец
            //======== Штапик - начало
            if(construction.beadsSize.length) {
              for (var i = 0; i < construction.beadsSize.length; i++) {
                if(priceObj.beadIds.length) {
                  for (var j = 0; j < priceObj.beadIds.length; j++) {
                    var priceTmp = 0;
                    if(priceObj.beadIds[j].elemLists.parent_list_id == construction.beadId){
                      var value = self.getValueByRule(((construction.beadsSize[i]+priceObj.beadIds[j].priceEl.amendment_pruning)/1000), priceObj.beadIds[j].elemLists.value, priceObj.beadIds[j].elemLists.rules_type_id);
                      priceObj.beadIds[j].elemLists.newValue = value;
                      if(priceObj.beadIds[j].elemLists.rules_type_id === 3){
                        priceTmp += (Math.round(((construction.beadsSize[i]+priceObj.beadIds[j].priceEl.amendment_pruning)/1000)*priceObj.beadIds[j].elemLists.value)*priceObj.beadIds[j].priceEl.price)*(1+(priceObj.beadIds[j].priceEl.waste/100));
                      } else if(priceObj.beadIds[j].elemLists.rules_type_id === 2 || priceObj.beadIds[j].elemLists.rules_type_id === 4 || priceObj.beadIds[j].elemLists.rules_type_id === 15){
                        priceTmp += (priceObj.beadIds[j].elemLists.value * priceObj.beadIds[j].priceEl.price) * (1 + (priceObj.beadIds[j].priceEl.waste / 100));
                      } else if (priceObj.beadIds[j].elemLists.rules_type_id === 1){
                        priceTmp += (((construction.beadsSize[i]+priceObj.beadIds[j].priceEl.amendment_pruning - (priceObj.beadIds[j].elemLists.value*1000))/1000) * priceObj.beadIds[j].priceEl.price) * (1 + (priceObj.beadIds[j].priceEl.waste / 100));
                      } else {
                        priceTmp += (((construction.beadsSize[i]+priceObj.beadIds[j].priceEl.amendment_pruning)/1000) * priceObj.beadIds[j].priceEl.price) * (1 + (priceObj.beadIds[j].priceEl.waste / 100));
                      }
                      if (priceObj.currentCurrency.id != priceObj.beadIds[j].priceEl.currency_id){
                        for (var k = 0; k < priceObj.currencies.length; k++) {
                          if(priceObj.currencies[k].id == priceObj.beadIds[j].priceEl.currency_id){
                            priceTmp = priceTmp * priceObj.currencies[k].value;
                          }
                        }
                      }
                    } else {
                      for (var g = 0; g < priceObj.beadIds.length; g++) {
                        if(priceObj.beadIds[j].elemLists.parent_list_id == priceObj.beadIds[g].elemLists.child_id){
                          var value = self.getValueByRule((priceObj.beadIds[g].elemLists.newValue/1000), priceObj.beadIds[j].elemLists.value, priceObj.beadIds[g].elemLists.rules_type_id);
                          priceObj.beadIds[j].elemLists.newValue = value;
                          if(priceObj.beadIds[j].elemLists.rules_type_id === 3){
                            priceTmp += (Math.round((priceObj.beadIds[g].elemLists.newValue+(priceObj.beadIds[j].priceEl.amendment_pruning/1000))*priceObj.beadIds[j].elemLists.value)*priceObj.beadIds[j].priceEl.price)*(1+(priceObj.beadIds[j].priceEl.waste/100));
                          } else if(priceObj.beadIds[j].elemLists.rules_type_id === 2 || priceObj.beadIds[j].elemLists.rules_type_id === 4 || priceObj.beadIds[j].elemLists.rules_type_id === 15){
                            priceTmp += (priceObj.beadIds[g].elemLists.newValue*priceObj.beadIds[j].elemLists.value * priceObj.beadIds[j].priceEl.price) * (1 + (priceObj.beadIds[j].priceEl.waste / 100));
                          } else if (priceObj.beadIds[j].elemLists.rules_type_id === 1){
                            priceTmp += (((priceObj.beadIds[g].elemLists.newValue+priceObj.beadIds[j].priceEl.amendment_pruning - (priceObj.beadIds[j].elemLists.value*1000))/1000) * priceObj.beadIds[j].priceEl.price) * (1 + (priceObj.beadIds[j].priceEl.waste / 100));
                          } else {
                            priceTmp += (((priceObj.beadIds[g].elemLists.newValue+priceObj.beadIds[j].priceEl.amendment_pruning)/1000) * priceObj.beadIds[j].priceEl.price) * (1 + (priceObj.beadIds[j].priceEl.waste / 100));
                          }
                          if (priceObj.currentCurrency.id != priceObj.beadIds[j].priceEl.currency_id){
                            for (var k = 0; k < priceObj.currencies.length; k++) {
                              if(priceObj.currencies[k].id == priceObj.beadIds[j].priceEl.currency_id){
                                priceTmp = priceTmp * priceObj.currencies[k].value;
                              }
                            }
                          }
                        }
                      }
                    }
                    priceObj.price += priceTmp;
                  }
                }
              }
            }
            //======= Штапик - конец
            //======= Импост - начало
            if(construction.impostsSize.length) {
              for (var i = 0; i < construction.impostsSize.length; i++) {
                if(priceObj.impostIds.length) {
                  for (var j = 0; j < priceObj.impostIds.length; j++) {
                    var priceTmp = 0;
                    if(priceObj.impostIds[j].elemLists.parent_list_id == construction.impostId){
                      var value = self.getValueByRule(((construction.impostsSize[i]+priceObj.impostIds[j].priceEl.amendment_pruning)/1000), priceObj.impostIds[j].elemLists.value, priceObj.impostIds[j].elemLists.rules_type_id);
                      priceObj.impostIds[j].elemLists.newValue = value;
                      if(priceObj.impostIds[j].elemLists.rules_type_id === 3){
                        priceTmp += (Math.round(((construction.impostsSize[i]+priceObj.impostIds[j].priceEl.amendment_pruning)/1000)*priceObj.impostIds[j].elemLists.value)*priceObj.impostIds[j].priceEl.price)*(1+(priceObj.impostIds[j].priceEl.waste/100));
                      } else if(priceObj.impostIds[j].elemLists.rules_type_id === 2 || priceObj.impostIds[j].elemLists.rules_type_id === 4 || priceObj.impostIds[j].elemLists.rules_type_id === 15){
                        priceTmp += (priceObj.impostIds[j].elemLists.value * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
                      } else if (priceObj.impostIds[j].elemLists.rules_type_id === 1){
                        priceTmp += (((construction.impostsSize[i]+priceObj.impostIds[j].priceEl.amendment_pruning - (priceObj.impostIds[j].elemLists.value*1000))/1000) * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
                      } else {
                        console.log('Формула : ('+(construction.sashsSize[i]+priceObj.framesIds[j].priceEl.amendment_pruning)/1000+'*'+priceObj.impostIds[j].priceEl.price+')*(1+('+priceObj.impostIds[j].priceEl.waste+'/100) = '+((((construction.impostsSize[i]+priceObj.impostIds[j].priceEl.amendment_pruning)/1000) * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100))).toFixed(2));
                        priceTmp += (((construction.impostsSize[i]+priceObj.impostIds[j].priceEl.amendment_pruning)/1000) * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
                      }
                      if (priceObj.currentCurrency.id != priceObj.impostIds[j].priceEl.currency_id){
                        for (var k = 0; k < priceObj.currencies.length; k++) {
                          if(priceObj.currencies[k].id == priceObj.impostIds[j].priceEl.currency_id){
                            priceTmp = priceTmp * priceObj.currencies[k].value;
                          }
                        }
                      }
                    } else {
                      for (var g = 0; g < priceObj.impostIds.length; g++) {
                        if(priceObj.impostIds[j].elemLists.parent_list_id == priceObj.impostIds[g].elemLists.child_id){
                          var value = self.getValueByRule(priceObj.impostIds[g].elemLists.newValue, priceObj.impostIds[j].elemLists.value, priceObj.impostIds[g].elemLists.rules_type_id);
                          priceObj.impostIds[j].elemLists.newValue = value;
                          if(priceObj.impostIds[j].elemLists.rules_type_id === 3){
                            priceTmp += (Math.round((priceObj.impostIds[g].elemLists.newValue+(priceObj.impostIds[j].priceEl.amendment_pruning/1000))*priceObj.impostIds[j].elemLists.value)*priceObj.impostIds[j].priceEl.price)*(1+(priceObj.impostIds[j].priceEl.waste/100));
                          } else if(priceObj.impostIds[j].elemLists.rules_type_id === 2 || priceObj.impostIds[j].elemLists.rules_type_id === 4 || priceObj.impostIds[j].elemLists.rules_type_id === 15){
                            priceTmp += (priceObj.impostIds[g].elemLists.newValue*priceObj.impostIds[j].elemLists.value * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
                          } else if (priceObj.impostIds[j].elemLists.rules_type_id === 1){
                            priceTmp += (((priceObj.impostIds[g].elemLists.newValue+priceObj.impostIds[j].priceEl.amendment_pruning - (priceObj.impostIds[j].elemLists.value*1000))/1000) * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
                          } else {
                            priceTmp += (((priceObj.impostIds[g].elemLists.newValue+priceObj.impostIds[j].priceEl.amendment_pruning)/1000) * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
                          }
                          if (priceObj.currentCurrency.id != priceObj.impostIds[j].priceEl.currency_id){
                            for (var k = 0; k < priceObj.currencies.length; k++) {
                              if(priceObj.currencies[k].id == priceObj.impostIds[j].priceEl.currency_id){
                                priceTmp = priceTmp * priceObj.currencies[k].value;
                              }
                            }
                          }
                        }
                      }
                    }
                    priceObj.price += priceTmp;
                  }
                }
              }
            }
            //====== Импост - конец
            //====== Стеклопакет - начало
            if(construction.glassSquares.length) {
              for (var i = 0; i < construction.glassSquares.length; i++) {
                if(priceObj.glassIds.length) {
                  for (var j = 0; j < priceObj.glassIds.length; j++) {
                    var priceTmp = 0;
                    if(priceObj.glassIds[j].elemLists.parent_list_id == construction.glassId){
                      var value = self.getValueByRule(1, priceObj.glassIds[j].elemLists.value, priceObj.glassIds[j].elemLists.rules_type_id);
                      priceObj.glassIds[j].elemLists.newValue = value;
                      if(priceObj.glassIds[j].elemLists.rules_type_id === 3){
                        priceTmp += (Math.round((1+priceObj.glassIds[j].priceEl.amendment_pruning)*priceObj.glassIds[j].elemLists.value)*priceObj.glassIds[j].priceEl.price)*(1+(priceObj.glassIds[j].priceEl.waste/100));
                      } else if(priceObj.glassIds[j].elemLists.rules_type_id === 2 || priceObj.glassIds[j].elemLists.rules_type_id === 4 || priceObj.glassIds[j].elemLists.rules_type_id === 15){
                        priceTmp += (priceObj.glassIds[j].elemLists.value * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
                      } else if (priceObj.glassIds[j].elemLists.rules_type_id === 1){
                        priceTmp += (((priceObj.glassIds[g].elemLists.newValue+priceObj.glassIds[j].priceEl.amendment_pruning - (priceObj.glassIds[j].elemLists.value*100))) * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
                      } else {
                        priceTmp += (((1+priceObj.glassIds[j].priceEl.amendment_pruning)/1000) * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
                      }
                      if (priceObj.currentCurrency.id != priceObj.glassIds[j].priceEl.currency_id){
                        for (var k = 0; k < priceObj.currencies.length; k++) {
                          if(priceObj.currencies[k].id == priceObj.glassIds[j].priceEl.currency_id){
                            priceTmp = priceTmp * priceObj.currencies[k].value;
                          }
                        }
                      }
                    } else {
                      for (var g = 0; g < priceObj.glassIds.length; g++) {
                        if(priceObj.glassIds[j].elemLists.parent_list_id == priceObj.glassIds[g].elemLists.child_id){
                          var value = self.getValueByRule(priceObj.glassIds[g].elemLists.newValue, priceObj.glassIds[j].elemLists.value, priceObj.glassIds[g].elemLists.rules_type_id);
                          priceObj.glassIds[j].elemLists.newValue = value;
                          if(priceObj.glassIds[j].elemLists.rules_type_id === 3){
                            priceTmp += (Math.round((priceObj.glassIds[g].elemLists.newValue+priceObj.glassIds[j].priceEl.amendment_pruning)*priceObj.glassIds[j].elemLists.value)*priceObj.glassIds[j].priceEl.price)*(1+(priceObj.glassIds[j].priceEl.waste/100));
                          } else if(priceObj.glassIds[j].elemLists.rules_type_id === 2 || priceObj.glassIds[j].elemLists.rules_type_id === 4 || priceObj.glassIds[j].elemLists.rules_type_id === 15){
                            priceTmp += (priceObj.glassIds[g].elemLists.newValue*priceObj.glassIds[j].elemLists.value * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
                          } else if (priceObj.glassIds[j].elemLists.rules_type_id === 1){
                            priceTmp += (((priceObj.glassIds[g].elemLists.newValue+priceObj.glassIds[j].priceEl.amendment_pruning - (priceObj.glassIds[j].elemLists.value*1000))) * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
                          } else {
                            priceTmp += (((priceObj.glassIds[g].elemLists.newValue+priceObj.glassIds[j].priceEl.amendment_pruning)/1000) * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
                          }
                          if (priceObj.currentCurrency.id != priceObj.glassIds[j].priceEl.currency_id){
                            for (var k = 0; k < priceObj.currencies.length; k++) {
                              if(priceObj.currencies[k].id == priceObj.glassIds[j].priceEl.currency_id){
                                priceTmp = priceTmp * priceObj.currencies[k].value;
                              }
                            }
                          }
                        }
                      }
                    }
                    priceObj.price += priceTmp;
                  }
                }
              }
            }
            //===== Стеклопакет - конец
            //===== Фурнитура - начало
            if (priceObj.hardwareIds.length) {
              for (var j = 0; j < priceObj.hardwareIds.length; j++) {
                if(priceObj.hardwareIds[j].elemLists){
                  var priceTmp = 0;
                  priceObj.hardwareIds[j].elemLists.newValue = priceObj.hardwareIds[j].elemLists.count;
                  priceTmp += (priceObj.hardwareIds[j].elemLists.count * priceObj.hardwareIds[j].priceEl.price) * (1 + (priceObj.hardwareIds[j].priceEl.waste / 100));
                  if (priceObj.currentCurrency.id != priceObj.hardwareIds[j].priceEl.currency_id){
                    for (var kc = 0; kc < priceObj.currencies.length; kc++) {
                      if(priceObj.currencies[kc].id == priceObj.hardwareIds[j].priceEl.currency_id){
                        priceTmp = priceTmp * priceObj.currencies[kc].value;
                      }
                    }
                  }
                  priceObj.price += priceTmp;
                } else if (priceObj.hardwareIds[j].hardwareLists) {
                  for (var g = 0; g < priceObj.hardwareIds.length; g++) {
                    if (priceObj.hardwareIds[g].elemLists) {
                      if (priceObj.hardwareIds[j].parent_list_id == priceObj.hardwareIds[g].elemLists.child_id && priceObj.hardwareIds[g].elemLists.child_type == 'list') {
                        for (var hwArr = 0; hwArr < priceObj.hardwareIds[j].hardwareLists.length; hwArr++) {
                          var priceTmp = 0;
                          var value = self.getValueByRule(priceObj.hardwareIds[g].elemLists.newValue, priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.value, priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.rules_type_id);
                          priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.newValue = value;
                          if (priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.rules_type_id === 3) {
                            priceTmp += (Math.round((priceObj.hardwareIds[g].elemLists.newValue + (priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.amendment_pruning / 1000)) * priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.value) * priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.price) * (1 + (priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.waste / 100));
                          } else if (priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.rules_type_id === 2 || priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.rules_type_id === 4 || priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.rules_type_id === 15) {
                            priceTmp += (priceObj.hardwareIds[g].elemLists.newValue * priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.value * priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.price) * (1 + (priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.waste / 100));
                          } else if (priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.rules_type_id === 1) {
                            priceTmp += (((priceObj.hardwareIds[g].elemLists.newValue + priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.amendment_pruning - (priceObj.hardwareIds[j].hardwareLists[hwArr].elemLists.value * 1000)) / 1000) * priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.price) * (1 + (priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.waste / 100));
                          } else {
                            priceTmp += (((priceObj.hardwareIds[g].elemLists.newValue + priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.amendment_pruning) / 1000) * priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.price) * (1 + (priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.waste / 100));
                          }
                          if (priceObj.currentCurrency.id != priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.currency_id) {
                            for (var k = 0; k < priceObj.currencies.length; k++) {
                              if (priceObj.currencies[k].id == priceObj.hardwareIds[j].hardwareLists[hwArr].priceEl.currency_id) {
                                priceTmp = priceTmp * priceObj.currencies[k].value;
                              }
                            }
                          }
                          priceObj.price += priceTmp;
                        }
                      }
                    }
                  }
                }
              }
            }
            //====== Фурнитура - конец
            priceObj.price = priceObj.price.toFixed(2);
  //          console.log('Сумма:'+priceObj.price);
            callback(new OkResult(priceObj));
          } else {
            console.log(result);
          }
        }
      },


      getAdditionalPrice: function (addList, callback){
        var self = this;
        var price = 0, addPriceObj = {};
        this.getCurrentCurrency(addList.currencyId, function (result){
          next_1(result);
        });
        function next_1(result){
          if(result.status){
            addPriceObj.currentCurrency = result.data;
            elemListsAdd = [];
            self.parseListAdd(addList.elementId, function (result){next_2(result);});
          } else {
            console.log(result);
          }
        }
        function next_2(result){
          if(result.status){
            addPriceObj.elementIds =  result.data;
            db.transaction(function (transaction) {
              transaction.executeSql('select parent_element_id, name from lists where id = ?', [addList.elementId], function (transaction, result){next_3(result);}, function () {
                callback(new ErrorResult(2, 'Something went wrong when get parent_element_id'));
              });
            });
          } else {
            console.log(result);
          }
        }
        function next_3(result){
          if(result.rows.length){
            addPriceObj.elementIds.parent_element_id = result.rows.item(0).parent_element_id;
            addPriceObj.elementIds.name = result.rows.item(0).name;
            db.transaction(function (transaction) {
              transaction.executeSql('select id, currency_id, price, waste, name, amendment_pruning from elements where id = ?', [result.rows.item(0).parent_element_id], function (transaction, result){next_4(result);}, function () {
                callback(new ErrorResult(2, 'Something went wrong when get element price'));
              });
            });
          } else {
            console.log(result);
          }
        }
        function next_4(result) {
          if(result.rows.length){
            for (var i = 0; i < result.rows.length; i++) {
              if(result.rows.item(i).id == addPriceObj.elementIds.parent_element_id){
                addPriceObj.elementIds.price = result.rows.item(i);
              }
            }
            if(addPriceObj.elementIds.length) {
              for (var i = 0; i < addPriceObj.elementIds.length; i++) {
                if (addPriceObj.elementIds[i].elemLists.child_type === 'element'){
                  self.getPriceById(addPriceObj.elementIds[i].elemLists.child_id, i, i, function (result){
                    addPriceObj.elementIds[result.data.index].priceEl = result.data.currency;
                    addPriceObj.elementIds[result.data.index].elemName = result.data.currency.name;
                    addPriceObj.elementIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                } else {
                  self.getPriceByIdList(addPriceObj.elementIds[i].elemLists.child_id, i, i, function (result){
                    addPriceObj.elementIds[result.data.index].priceEl = result.data.currency;
                    addPriceObj.elementIds[result.data.index].elemName = result.data.currency.name;
                    addPriceObj.elementIds[result.data.index].pruning = result.data.currency.amendment_pruning;
                  });
                }
              }
            }
            db.transaction(function (transaction) {
              transaction.executeSql('select id, name, value from currencies', [], function (transaction, result){next_5(result);}, function () {
                callback(new ErrorResult(2, 'Something went wrong when get parent_element_id'));
              });
            });
          } else {
            console.log(result);
          }
        }
        function next_5(result) {
          if (result.rows.length) {
            addPriceObj.currencies = [];
            addPriceObj.price = 0;
            for (var i = 0; i < result.rows.length; i++) {
              addPriceObj.currencies.push(result.rows.item(i));
            }
            var priceTmp = 0;
            if (addList.elementLength > 0) {
              priceTmp += (((addList.elementLength + addPriceObj.elementIds.price.amendment_pruning) / 1000) * addPriceObj.elementIds.price.price) * (1 + (addPriceObj.elementIds.price.waste / 100));
              if (addPriceObj.currentCurrency.id != addPriceObj.elementIds.price.currency_id) {
                for (var i = 0; i < addPriceObj.currencies.length; i++) {
                  if (addPriceObj.currencies[i].id == addPriceObj.elementIds.price.currency_id) {
                    priceTmp = priceTmp * addPriceObj.currencies[i].value;
                  }
                }
              }
            }
            addPriceObj.price += priceTmp;
            //====== Начало - доп. элементы
            if (addList.elementLength > 0) {
              if (addPriceObj.elementIds.length) {
                for (var j = 0; j < addPriceObj.elementIds.length; j++) {
                  var priceTmp = 0;
                  if (addPriceObj.elementIds[j].elemLists.parent_list_id == addList.elementId) {
                    var value = self.getValueByRule(((addList.elementLength + addPriceObj.elementIds[j].priceEl.amendment_pruning) / 1000), addPriceObj.elementIds[j].elemLists.value, addPriceObj.elementIds[j].elemLists.rules_type_id);
                    addPriceObj.elementIds[j].elemLists.newValue = value;
                    if (addPriceObj.elementIds[j].elemLists.rules_type_id === 3) {
                      priceTmp += (Math.round(((addList.elementLength + addPriceObj.elementIds[j].priceEl.amendment_pruning) / 1000) * addPriceObj.elementIds[j].elemLists.value) * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                    } else if (addPriceObj.elementIds[j].elemLists.rules_type_id === 2 || addPriceObj.elementIds[j].elemLists.rules_type_id === 4 || addPriceObj.elementIds[j].elemLists.rules_type_id === 15) {
                      priceTmp += (addPriceObj.elementIds[j].elemLists.value * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                    } else if (addPriceObj.elementIds[j].elemLists.rules_type_id === 1) {
                      priceTmp += (((addList.elementLength + addPriceObj.elementIds[j].priceEl.amendment_pruning - (addPriceObj.elementIds[j].elemLists.value * 1000)) / 1000) * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                    } else {
                      priceTmp += (((addList.elementLength + addPriceObj.elementIds[j].priceEl.amendment_pruning) / 1000) * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                    }
                    if (addPriceObj.currentCurrency.id != addPriceObj.elementIds[j].priceEl.currency_id) {
                      for (var k = 0; k < addPriceObj.currencies.length; k++) {
                        if (addPriceObj.currencies[k].id == addPriceObj.elementIds[j].priceEl.currency_id) {
                          priceTmp = priceTmp * addPriceObj.currencies[k].value;
                        }
                      }
                    }
                  } else {
                    for (var g = 0; g < addPriceObj.elementIds.length; g++) {
                      if (addPriceObj.elementIds[j].elemLists.parent_list_id == addPriceObj.elementIds[g].elemLists.child_id) {
                        var value = self.getValueByRule(addPriceObj.elementIds[g].elemLists.newValue, addPriceObj.elementIds[g].elemLists.value, addPriceObj.elementIds[g].elemLists.rules_type_id);
                        addPriceObj.elementIds[j].elemLists.newValue = value;
                        if (addPriceObj.elementIds[j].elemLists.rules_type_id === 3) {
                          priceTmp += (Math.round((addPriceObj.elementIds[g].elemLists.newValue + addPriceObj.elementIds[j].priceEl.amendment_pruning) * addPriceObj.elementIds[j].elemLists.value) * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                        } else if (addPriceObj.elementIds[j].elemLists.rules_type_id === 2 || addPriceObj.elementIds[j].elemLists.rules_type_id === 4 || addPriceObj.elementIds[j].elemLists.rules_type_id === 15) {
                          priceTmp += (addPriceObj.elementIds[g].elemLists.newValue * addPriceObj.elementIds[j].elemLists.value * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                        } else if (addPriceObj.elementIds[j].elemLists.rules_type_id === 1) {
                          priceTmp += (((addPriceObj.elementIds[g].elemLists.newValue + addPriceObj.elementIds[j].priceEl.amendment_pruning - (addPriceObj.elementIds[j].elemLists.value * 1000)) / 1000) * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                        } else {
                          priceTmp += (((addPriceObj.elementIds[g].elemLists.newValue + addPriceObj.elementIds[j].priceEl.amendment_pruning) / 1000) * addPriceObj.elementIds[j].priceEl.price) * (1 + (addPriceObj.elementIds[j].priceEl.waste / 100));
                        }
                        if (addPriceObj.currentCurrency.id != addPriceObj.elementIds[j].priceEl.currency_id) {
                          for (var k = 0; k < addPriceObj.currencies.length; k++) {
                            if (addPriceObj.currencies[k].id == addPriceObj.elementIds[j].priceEl.currency_id) {
                              priceTmp = priceTmp * addPriceObj.currencies[k].value;
                            }
                          }
                        }
                      }
                    }
                  }
                  addPriceObj.price += priceTmp;
                }
              }
            }
            //======= Доп. элементы - конец
          }
          addPriceObj.price = addPriceObj.price.toFixed(2);
          callback(new OkResult(addPriceObj));
        }
      }

    };



  }
})();

