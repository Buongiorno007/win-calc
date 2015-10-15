(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .factory('localDB', globalDBFactory);

  function globalDBFactory($http, $q, globalConstants, GeneralServ, UserStor) {
    var thisFactory = this,
        db = openDatabase('bauvoice', '1.0', 'bauvoice', 5000000),

        tablesLocalDB = {
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
            'prop': 'name VARCHAR(255), app_token VARCHAR',
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
              ' heat_coeff INTEGER,' +
              ' noise_coeff INTEGER,' +
              ' heat_coeff_value NUMERIC',
            'foreignKey': ''
          },
          'rules_types': {
            'tableName': 'rules_types',
            'prop': 'name VARCHAR(255), parent_unit INTEGER, child_unit INTEGER, suffix VARCHAR(15)',
            'foreignKey': ''
          },
          'regions': {
            'tableName': 'regions',
            'prop': 'name VARCHAR(255), country_id INTEGER, heat_transfer NUMERIC(10, 2), climatic_zone NUMERIC',
            'foreignKey': ', FOREIGN KEY(country_id) REFERENCES countries(id)'
          },
          'users': {
            'tableName': 'users',
            'prop':
              'email VARCHAR(255),' +
              ' password VARCHAR(255),' +
              ' factory_id INTEGER,' +
              ' name VARCHAR(255),' +
              ' phone VARCHAR(100),' +
              ' locked INTEGER,' +
              ' user_type INTEGER,' +
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
              ' window_hardware_group_id INTEGER',
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
              ' base_price NUMERIC(13, 2),' +
              ' factory_margin NUMERIC(11, 2),'+
              ' factory_id INTEGER,' +
              ' purchase_price NUMERIC(10, 2),' +
              ' sale_price NUMERIC(10, 2),' +
              ' climatic_zone INTEGER,' +
              ' heat_coef_min NUMERIC,' +

              ' products_qty INTEGER,' +
              ' templates_price NUMERIC,' +
              ' addelems_price NUMERIC,' +
              ' products_price NUMERIC,'+

              ' delivery_date TIMESTAMP,' +
              ' new_delivery_date TIMESTAMP,' +
              ' delivery_price NUMERIC,'+
              ' is_date_price_less INTEGER,' +
              ' is_date_price_more INTEGER,' +
              ' floor_id INTEGER,' +
              ' floor_price NUMERIC,' +
              ' mounting_id INTEGER,' +
              ' mounting_price NUMERIC,'+
              ' is_instalment INTEGER,' +
              ' instalment_id INTEGER,' +

              ' is_old_price INTEGER,' +
              ' payment_first NUMERIC,' +
              ' payment_monthly NUMERIC,' +
              ' payment_first_primary NUMERIC,' +
              ' payment_monthly_primary NUMERIC,' +
              ' order_price NUMERIC,' +
              ' order_price_dis NUMERIC,' +
              ' order_price_primary NUMERIC,' +

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
              ' name VARCHAR,' +
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



        tablesLocationLocalDB = {
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

        addElementDBId = [
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
        ];



    //order_elements
    //  size: {
    //      type: 'NUMERIC',
    //        allowNull: true,
    //        defaultValue: '0.000'
    //    },
    //    amount: {
    //      type: DataTypes.INTEGER,
    //        allowNull: false
    //    },
    //    element_id: {
    //      type: DataTypes.INTEGER,
    //        allowNull: false
    //    },
    //    order_id: {
    //      type: 'NUMERIC',
    //        allowNull: false
    //    },
    //    id: {
    //      type: DataTypes.INTEGER,
    //        primaryKey: true,
    //        autoIncrement: true,
    //        allowNull: false
    //    }


    thisFactory.publicObj = {
      tablesLocalDB: tablesLocalDB,
      tablesLocationLocalDB: tablesLocationLocalDB,
      addElementDBId: addElementDBId,

      cleanLocalDB: cleanLocalDB,
      createTablesLocalDB: createTablesLocalDB,
      insertRowLocalDB: insertRowLocalDB,
      insertTablesLocalDB: insertTablesLocalDB,
      selectLocalDB: selectLocalDB,
      updateLocalDB: updateLocalDB,
      deleteRowLocalDB: deleteRowLocalDB,

      importUser: importUser,
      importLocation: importLocation,
      importFactories: importFactories,
      importAllDB: importAllDB,
      insertServer: insertServer,
      updateServer: updateServer,
      createUserServer: createUserServer,
      exportUserEntrance: exportUserEntrance,
      deleteOrderServer: deleteOrderServer,
      updateLocalServerDBs: updateLocalServerDBs,
      sendIMGServer: sendIMGServer,
      md5: md5,

      calculationPrice: calculationPrice,
      getAdditionalPrice: getAdditionalPrice
    };

    return thisFactory.publicObj;





    //============ methods ================//



    function cleanLocalDB(tables) {
      var tableKeys = Object.keys(tables),
          promises = tableKeys.map(function(table) {
            var defer = $q.defer();
            db.transaction(function (trans) {
              trans.executeSql("DROP TABLE IF EXISTS " + table, [], function () {
                defer.resolve(1);
              }, function () {
                console.log('not find deleting table');
                defer.resolve(0);
              });
            });
            return defer.promise;
          });
      return $q.all(promises);
    }



    function createTablesLocalDB(tables) {
      var tableKeys = Object.keys(tables),
          promises = tableKeys.map(function(table) {
            var defer = $q.defer();
            db.transaction(function (trans) {
              trans.executeSql("CREATE TABLE IF NOT EXISTS " + tablesLocalDB[table].tableName + " (id INTEGER PRIMARY KEY AUTOINCREMENT, "+ tablesLocalDB[table].prop + ", modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP" + tablesLocalDB[table].foreignKey+")", [], function() {
                defer.resolve(1);
              }, function () {
                console.log('Something went wrong with creating table ' + tablesLocalDB[table].tableName);
                defer.resolve(0);
              });
            });
            return defer.promise;
          });
      return $q.all(promises);
    }



    function insertRowLocalDB(row, tableName) {
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
    }


    function insertTablesLocalDB(result) {
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
    }



    function selectLocalDB(tableName, options, columns) {
      var defer = $q.defer(),
          properties = (columns) ? columns : '*',
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
        trans.executeSql("SELECT "+properties+" FROM " + tableName + vhereOptions, [],
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
            if(Object.keys(tx).length === 0 && result.code === 5) {
              defer.resolve(0);
            }
          });
      });
      return defer.promise;
    }



    function updateLocalDB(tableName, elem, options) {
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
    }



    function deleteRowLocalDB(tableName, options) {
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
    }






    //============== SERVER ===========//


    /** get User from Server by login */
    function importUser(login) {
      var defer = $q.defer();
      $http.post(globalConstants.serverIP + '/api/login', {login: login}).then(
        function (result) {
          defer.resolve(result.data);
        },
        function () {
          console.log('Something went wrong with User recive!');
          defer.resolve({status: 0});
        }
      );
      return defer.promise;
    }



    /** get Cities, Regions, Countries from Server */
    function importLocation(login, access) {
      var defer = $q.defer(),
          self = this;
      $http.get(globalConstants.serverIP + '/api/get/locations?login='+login+'&access_token='+access).then(
        function (result) {
          if(result.data.status) {
            //-------- insert in LocalDB
            self.insertTablesLocalDB(result.data).then(function() {
              defer.resolve(1);
            });
          } else {
            console.log('Error!');
            defer.resolve(0);
          }
        },
        function () {
          console.log('Something went wrong with Location!');
          defer.resolve(0);
        }
      );
      return defer.promise;
    }



    function importFactories(login, access, cityIds) {
      var defer = $q.defer();
      $http.get(globalConstants.serverIP + '/api/get/factories-by-country?login='+login+'&access_token='+access+'&cities_ids='+cityIds).then(
        function (result) {
          defer.resolve(result.data);
        },
        function () {
          console.log('Something went wrong with get factories!');
          defer.resolve({status: 0});
        }
      );
      return defer.promise;
    }




    function importAllDB(login, access) {
      var defer = $q.defer();
      console.log('Import database begin!');
      $http.get(globalConstants.serverIP+'/api/sync?login='+login+'&access_token='+access).then(
        function (result) {
          console.log('importAllDB+++', result);
          if(result.data.status) {
            //-------- insert in LocalDB
            insertTablesLocalDB(result.data).then(function() {
              defer.resolve(1);
            });
          } else {
            console.log('Error!');
            defer.resolve(0);
          }
        },
        function () {
          console.log('Something went wrong with importing Database!');
          defer.resolve(0);
        }
      );
      return defer.promise;
    }




    function insertServer(login, access, table, data) {
      var defer = $q.defer(),
          dataToSend = {
            model: table,
            row: JSON.stringify(data)
          };
      $http.post(globalConstants.serverIP+'/api/insert?login='+login+'&access_token='+access, dataToSend).then(
        function (result) {
          console.log('send changes to server success:', result);
          defer.resolve(result.data);
        },
        function (result) {
          console.log('send changes to server failed');
          defer.resolve(result.data);
        }
      );
      return defer.promise;
    }



    function updateServer(login, access, data) {
      //        tablesToSync.push({model: table_name, rowId: tempObject.id, field: JSON.stringify(tempObject)});
      var promises = data.map(function(item) {
        var defer = $q.defer();
        $http.post(globalConstants.serverIP+'/api/update?login='+login+'&access_token='+access, item).then(
          function (result) {
            console.log('send changes to server success:', result);
            defer.resolve(1);
          },
          function () {
            console.log('send changes to server failed');
            defer.resolve(0);
          }
        );
        return defer.promise;
      });
      return $q.all(promises);
    }




    function createUserServer(dataJson) {
      $http.post(globalConstants.serverIP+'/api/register', dataJson).then(
        function (result) {
          console.log(result);
        },
        function () {
          console.log('Something went wrong when user creating!');
        }
      );
    }



    function exportUserEntrance(login, access) {
      var currTime = new Date();
      $http.get(globalConstants.serverIP+'/api/signed?login='+login+'&access_token='+access+'&date='+currTime).then(
        function () {
          console.log('Sucsess!');
        },
        function () {
          console.log('Something went wrong!');
        }
      );
    }




    function deleteOrderServer(login, access, orderNumber) {
      var dataSend = {orderId: orderNumber*1};
      $http.post(globalConstants.serverIP+'/api/remove-order?login='+login+'&access_token='+access, dataSend).then(
        function (result) {
          console.log(result.data);
        },
        function () {
          console.log('Something went wrong with order delete!');
        }
      );
    }




    function updateLocalServerDBs(table, row, data) {
      var defer = $q.defer(),
          dataToSend = [
            {
              model: table,
              rowId: row,
              field: JSON.stringify(data)
            }
          ];
      updateLocalDB(table, data, {'id': row});
      updateServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, dataToSend).then(function(data) {
        if(!data) {
          //----- if no connect with Server save in Export LocalDB
          insertRowLocalDB(dataToSend, tablesLocalDB.export.tableName);
        }
        defer.resolve(1);
      });
      return defer.promise;
    }




    function sendIMGServer(data) {
      var defer = $q.defer();
      $http.post(globalConstants.serverIP+'/api/load-avatar', data, {
        //          withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
      }).then(
        function (result) {
          console.log('send changes to server success:', result);
          defer.resolve(1);
        },
        function () {
          console.log('send changes to server failed');
          defer.resolve(0);
        }
      );
    }




    function md5(string) {
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
    }



    //TODO old

    function getLastSync(callback) {
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
    }

    function syncDb(login, access_token) {
      var deferred = $q.defer();
      var i, k, table, updateSql, lastSyncDate;
      getLastSync(function (result) {
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
    }










    /********* PRICE *********/


    function parseListContent(listId){
      var defer = $q.defer(),
          lists = [],
          elemLists = [];
      if(Array.isArray(listId)) {
        lists = listId;
      } else {
        lists.push(listId);
      }
      (function nextRecord() {
        if (lists.length) {
          selectLocalDB(tablesLocalDB.list_contents.tableName, {parent_list_id: lists[0]}).then(function(result) {
            var resQty = result.length;
            if(resQty) {
              for (var i = 0; i < resQty; i++) {
                elemLists.push(result[i]);
                if(result[i].child_type === 'list') {
                  lists.push(result[i].child_id);
                }
              }
            }
            nextRecord();
          });
          lists.shift(0);
        } else {
          defer.resolve(elemLists);
        }
      })();
      return defer.promise;
    }



    function parseMainKit(construction){
      var deff = $q.defer(),
          promisesKit = construction.sizes.map(function(item, index, arr) {
            var deff1 = $q.defer();
            if(item.length) {
              /** if hardware */
              if(index === arr.length-1) {
                deff1.resolve(0);
              } else {
                if(Array.isArray(construction.ids[index])) {
                  var promisKits = construction.ids[index].map(function(item2){
                    var deff2 = $q.defer();
                    selectLocalDB(tablesLocalDB.lists.tableName, {id: item2}, 'parent_element_id, name').then(function(result2) {
                      if(result2.length) {
                        deff2.resolve(result2);
                      } else {
                        deff2.resolve(0);
                      }
                    });
                    return deff2.promise;
                  });
                  $q.all(promisKits).then(function(result3) {
                    var resQty = result3.length,
                        collectArr = [];
                    for(var i = 0; i < resQty; i++) {
                      collectArr.push(result3[i][0]);
                    }
                    deff1.resolve(collectArr);
                  })
                } else {
                  selectLocalDB(tablesLocalDB.lists.tableName, {id: construction.ids[index]}, 'parent_element_id, name').then(function(result) {
                    if(result.length) {
                      deff1.resolve(result[0]);
                    } else {
                      deff1.resolve(0);
                    }
                  });
                }
              }
            } else {
              deff1.resolve(0);
            }
            return deff1.promise;
          });
      $q.all(promisesKit).then(function(result) {
        deff.resolve(result);
      });
      return deff.promise;
    }




    function parseKitElement(kits){
      var deff = $q.defer(),
          promisesKitElem = kits.map(function(item) {
            var deff1 = $q.defer();
            if(item) {
              if(Array.isArray(item)) {
                var promisElem = item.map(function(item2){
                  var deff2 = $q.defer();
                  if(item2.parent_element_id) {
                    deff2.resolve(getElementByListId(1, item2.parent_element_id));
                    return deff2.promise;
                  }
                });
                $q.all(promisElem).then(function(result3) {
                  var resQty = result3.length,
                      collectArr = [];
                  for(var i = 0; i < resQty; i++) {
                    collectArr.push(result3[i][0]);
                  }
                  deff1.resolve(collectArr);
                })
              } else if(item.parent_element_id){
                deff1.resolve(getElementByListId(0, item.parent_element_id));
              }
            } else {
              deff1.resolve(0);
            }
            return deff1.promise;
          });
      $q.all(promisesKitElem).then(function(result) {
        deff.resolve(result);
      });
      return deff.promise;
    }





    function parseConsistElem(consists) {
      var deff = $q.defer();
      if(consists.length) {
        var promConsist = consists.map(function(item) {
          var deff1 = $q.defer();
          if(item) {
            if(item.length) {
              var promConsistElem = item.map(function(item2) {
                var deff2 = $q.defer();
                if(item2.child_type === 'element') {
                  deff2.resolve(getElementByListId(0, item2.child_id));
                } else {
                  selectLocalDB(tablesLocalDB.lists.tableName, {id: item2.child_id}, 'parent_element_id').then(function(result) {
                    if(result.length) {
                      deff2.resolve(getElementByListId(0, result[0].parent_element_id));
                    } else {
                      deff2.resolve(0);
                    }
                  });
                }
                return deff2.promise;
              });
              deff1.resolve($q.all(promConsistElem));
            } else {
              deff1.resolve(0);
            }
          } else {
            deff1.resolve(0);
          }
          return deff1.promise;
        });
        deff.resolve($q.all(promConsist));
      } else {
        deff.resolve(0);
      }
      return deff.promise;
    }



    function getElementByListId(isArray, listID) {
      var deff = $q.defer();
      selectLocalDB(tablesLocalDB.elements.tableName, {id: listID}, 'id, sku, currency_id, price, waste, name, amendment_pruning, element_group_id').then(function(result) {
        if(result.length) {
          if(isArray) {
            deff.resolve(result);
          } else {
            deff.resolve(result[0]);
          }
        } else {
          deff.resolve(0);
        }
      });
      return deff.promise;
    }



    function downloadAllCurrencies() {
      return selectLocalDB(tablesLocalDB.currencies.tableName, null, 'id, name, value').then(function(result) {
        if(result.length) {
          return result;
        }
      });
    }




    function culcKitPrice(priceObj, sizes) {
      var kitElemQty = priceObj.kitsElem.length,
          sizeQty = 0,
          constrElements = [];
      priceObj.priceTotal = 0;

      for(var ke = 0; ke < kitElemQty; ke++) {
        if(priceObj.kitsElem[ke]) {
          sizeQty = sizes[ke].length;
          if(Array.isArray(priceObj.kitsElem[ke])) {
            var kitElemChildQty = priceObj.kitsElem[ke].length;
            for(var child = 0; child < kitElemChildQty; child++) {
              culcPriceAsSize(ke, priceObj.kitsElem[ke][child], sizes[ke], sizeQty, priceObj, constrElements);
            }
          } else {
            culcPriceAsSize(ke, priceObj.kitsElem[ke], sizes[ke], sizeQty, priceObj, constrElements);
          }
        }
      }

      return constrElements;
    }




    function culcPriceAsSize(index, kitsElem, sizes, sizeQty, priceObj, constrElements) {
      var priceTemp = 0,
          sizeTemp = 0,
          constrElem = {};
      for(var siz = 0; siz < sizeQty; siz++) {
        constrElem = angular.copy(kitsElem);
        /** glasses */
        if(index === 5) {
          sizeTemp = sizes[siz];
          priceTemp = sizeTemp * constrElem.price;
        } else {
          sizeTemp = (sizes[siz] + constrElem.amendment_pruning);
          priceTemp = (sizeTemp * constrElem.price) * (1 + (constrElem.waste / 100));
        }
        /** currency conversion */
        if (priceObj.currCurrencyId != constrElem.currency_id){
//          console.log('diff currency');
          currencyExgange(priceTemp, priceObj.currCurrencyId, constrElem.currency_id, priceObj.currencies);
        }
        constrElem.qty = 1;
        constrElem.size = GeneralServ.roundingNumbers(sizeTemp, 3);
        constrElem.priceReal = GeneralServ.roundingNumbers(priceTemp, 3);
        priceObj.priceTotal += priceTemp;
        constrElements.push(constrElem);
      }
    }





    function currencyExgange(price, currCurrencyId, currencyElemId, currencies) {
      var currencyQty = currencies.length,
          c = 0,
          currIndex, elemIndex;
//      console.info('currency++++', currCurrencyId, currencyElemId, currencies);
      if(currencyQty) {
        for (; c < currencyQty; c++) {
          if(currencies[c].id === currCurrencyId) {
            currIndex = c;
          }
          if(currencies[c].id === currencyElemId){
            elemIndex = c;
          }
        }
      }
      if(currencies[currIndex] && currencies[elemIndex]) {
        if(currencies[currIndex].name === 'uah' && (currencies[elemIndex].name === 'eur' || currencies[elemIndex].name === 'usd')) {
          price *= currencies[elemIndex].value;
        }
        if(currencies[currIndex].name !== 'uah' && currencies[elemIndex].name === 'uah') {
          price /= currencies[currIndex].value;
        }
      }
    }







    function culcConsistPrice(priceObj, construction) {
      var consistQty = priceObj.consist.length;

      for(var group = 0; group < consistQty; group++) {
        if(priceObj.consist[group]) {

          var sizeQty = construction.sizes[group].length,
              elemQty = priceObj.consist[group].length;

          if(elemQty) {
            for(var s = 0; s < sizeQty; s++) {

              for(var elem = 0; elem < elemQty; elem++) {
                var wasteValue = (1 + (priceObj.consistElem[group][elem].waste / 100));

                if (Array.isArray(construction.ids[group])) {
                  var idsQty = construction.ids[group].length;
                  for (var id = 0; id < idsQty; id++) {
//                    console.error('!!!!!arrays+', construction.ids[group][id]);
                    culcPriceConsistElem(group, priceObj.consist[group][elem], priceObj.consistElem[group][elem], construction.sizes[group][s], construction.ids[group][id], wasteValue, priceObj);
                  }
                } else {
                  culcPriceConsistElem(group, priceObj.consist[group][elem], priceObj.consistElem[group][elem], construction.sizes[group][s], construction.ids[group], wasteValue, priceObj);
                }

              }

            }
          }

        }
//        console.log('Group - конец ---------------------');
      }

    }




    function culcPriceConsistElem(group, currConsist, currConsistElem, currConstrSize, currConstrIds, wasteValue, priceObj) {
      /** if hardware */
      if(group === priceObj.consist.length-1) {
        var objTmp = angular.copy(currConsistElem),
            priceReal = 0;
        currConsist.newValue = angular.copy(currConsist.count);
        priceReal = currConsist.count * currConsistElem.price * wasteValue;
        /** currency conversion */
        if (priceObj.currCurrencyId != currConsistElem.currency_id){
//          console.log('diff currency');
          currencyExgange(priceReal, priceObj.currCurrencyId, currConsistElem.currency_id, priceObj.currencies);
        }
        objTmp.priceReal = GeneralServ.roundingNumbers(priceReal, 3);
        objTmp.size = 0;
        objTmp.qty = angular.copy(currConsist.count);
//        console.warn('finish -------hardware------- priceTmp', objTmp);
        priceObj.constrElements.push(objTmp);
        priceObj.priceTotal += objTmp.priceReal;
      } else {
        if (currConsist.parent_list_id === currConstrIds) {
          /** if glasses */
          var fullSize = (group === 5) ? 1 : (currConstrSize + currConsistElem.amendment_pruning);
          currConsist.newValue = getValueByRule(fullSize, currConsist.value, currConsist.rules_type_id);
          culcPriceAsRule(1, currConstrSize, currConsist, currConsistElem, wasteValue, priceObj);

        } else {
//          console.warn('else++++');
          var elemQty = priceObj.consist[group].length;
          for (var el = 0; el < elemQty; el++) {
            if(currConsist.parent_list_id == priceObj.consist[group][el].child_id){
              //            currConsist.newValue = getValueByRule(priceObj.consist[group][el].newValue, currConsist.value, priceObj.consist[group][el].rules_type_id);
              currConsist.newValue = getValueByRule(priceObj.consist[group][el].newValue, currConsist.value, currConsist.rules_type_id);
              culcPriceAsRule(currConsist.newValue, priceObj.consist[group][el].newValue, currConsist, currConsistElem, wasteValue, priceObj);

            }
          }
        }
      }
    }


    function getValueByRule(parentValue, childValue, rule){
//      console.warn('rule++', parentValue, childValue, rule);
      var value = 0;
      switch (rule) {
        case 1:
          //------ меньше родителя на X (м)
          value = GeneralServ.roundingNumbers((parentValue - childValue), 3);
          break;
        case 3:
        case 12:
        case 14:
          //------ X шт. на метр родителя
          value = GeneralServ.roundingNumbers((Math.round(parentValue) * childValue), 3);
          break;
        case 5:
          value = parentValue * childValue;
          break;
        case 6:
        case 7:
        case 8:
        case 9:
        case 13:
        case 23:
          value = GeneralServ.roundingNumbers((parentValue * childValue), 3);
          break;
        default:
          value = childValue;
          break;
      }
//      console.warn('rule++value+++', value);
      return value;
    }






    function culcPriceAsRule(currValue, currSize, currConsist, currConsistElem, wasteValue, priceObj) {
      var objTmp = angular.copy(currConsistElem),
          priceReal = 0,
          sizeReal = 0,
          qtyReal = 0;

//      console.log('Название: ' + currConsistElem.name);
//      console.log('Цена: ' + currConsistElem.price);
//      console.log('% отхода : ' + currConsistElem.waste);
//      console.log('Поправка на обрезку : ' + currConsistElem.amendment_pruning);
//      console.log('Размер: ' + currSize + ' m');

      if (currConsist.rules_type_id === 3) {
        qtyReal = Math.round(currSize + currConsistElem.amendment_pruning) * currConsist.value;
        priceReal = qtyReal * currConsistElem.price * wasteValue;

//        console.log('Правило 3 : ' + currConsist.value + ' шт. на метр родителя');
//        console.log('Правило 3 : ', currSize, qtyReal, ' шт. на метр родителя');

      } else if (currConsist.rules_type_id === 2 || currConsist.rules_type_id === 4 || currConsist.rules_type_id === 15) {

//        console.log('Правило 2: ', currValue, currConsist.value, ' шт. на родителя');
        //        qtyReal = currValue * currConsist.value;
        qtyReal = angular.copy(currConsist.value);
        priceReal = qtyReal * currConsistElem.price * wasteValue;

      } else if (currConsist.rules_type_id === 1) {
//        console.log('Правило 1: меньше родителя на ' + currConsist.value + ' м');

        sizeReal = GeneralServ.roundingNumbers((currSize + currConsistElem.amendment_pruning - currConsist.value), 3);
        priceReal = sizeReal * currConsistElem.price * wasteValue;
        qtyReal = 1;

//        console.log('Правило 1:', currSize, currConsist.value, sizeReal);
      } else {
        sizeReal = GeneralServ.roundingNumbers((currSize + currConsistElem.amendment_pruning), 3);
        priceReal = sizeReal * currConsistElem.price * wasteValue;
        qtyReal = 1;
//        console.log('Правило else:', currSize, sizeReal);
      }

      /** currency conversion */
      if (priceObj.currCurrencyId != currConsistElem.currency_id){
//        console.log('diff currency');
        currencyExgange(priceReal, priceObj.currCurrencyId, currConsistElem.currency_id, priceObj.currencies);
      }

      objTmp.priceReal = GeneralServ.roundingNumbers(priceReal, 3);
      objTmp.size = GeneralServ.roundingNumbers(sizeReal, 3);
      objTmp.qty = GeneralServ.roundingNumbers(qtyReal, 3);
//      console.warn('finish -------------- priceTmp', objTmp);
      priceObj.constrElements.push(objTmp);
      priceObj.priceTotal += objTmp.priceReal;
    }






    function getHardwareAsId(whId, sizes){
      var deff = $q.defer();
      selectLocalDB(tablesLocalDB.window_hardwares.tableName, {window_hardware_group_id: whId}).then(function(result) {
        //        console.warn('*****hardware = ', result);
        var resQty = result.length,
            hardwareresult = [],
            lastInd = sizes.length - 1,
            sashBlockQty = sizes[lastInd].length;

        if(resQty) {
          for (var res = 0; res < resQty; res++) {
            //----- go to sizes (sashesBlock)
            for(var s = 0; s < sashBlockQty; s++){

              var openDirQty = sizes[lastInd][s].openDir.length,
                  isExist = 0;
              //              console.info('*****', sizes[lastInd][s].openDir, sizes[lastInd][s].sizes);
              //              console.info('*****222', result[res]);

              if(result[res].direction_id == 1) {

                if(result[res].min_width && result[res].max_width && !result[res].min_height && !result[res].max_height) {
                  if(sizes[lastInd][s].sizes[0] >= result[res].min_width && sizes[lastInd][s].sizes[0] <= result[res].max_width) {
                    isExist = 1;
                  }
                } else if (!result[res].min_width && !result[res].max_width && result[res].min_height && result[res].max_height) {
                  if(sizes[lastInd][s].sizes[1] >= result[res].min_height && sizes[lastInd][s].sizes[1] <= result[res].max_height) {
                    isExist = 1;
                  }
                } else if (result[res].min_width && result[res].max_width && result[res].min_height && result[res].max_height) {
                  if(sizes[lastInd][s].sizes[1] >= result[res].min_height && sizes[lastInd][s].sizes[1] <= result[res].max_height) {
                    if(sizes[lastInd][s].sizes[0] >= result[res].min_width && sizes[lastInd][s].sizes[0] <= result[res].max_width) {
                      isExist = 1;
                    }
                  }
                }

              } else if(result[res].direction_id > 1 && openDirQty === 2){

                if(!result[res].min_width && !result[res].max_width && !result[res].min_height && !result[res].max_height) {
                  if(sizes[lastInd][s].openDir[0] == 1 && sizes[lastInd][s].openDir[1] == 2 && result[res].direction_id == 3 || sizes[lastInd][s].openDir[0] == 1 && sizes[lastInd][s].openDir[1] == 4 && result[res].direction_id == 2) {
                    isExist = 1;
                  }
                } else if(result[res].min_width && result[res].max_width && !result[res].min_height && !result[res].max_height) {
                  if(sizes[lastInd][s].sizes[0] >= result[res].min_width && sizes[lastInd][s].sizes[0] <= result[res].max_width) {
                    if(sizes[lastInd][s].openDir[0] == 1 && sizes[lastInd][s].openDir[1] == 2 && result[res].direction_id == 3 || sizes[lastInd][s].openDir[0] == 1 && sizes[lastInd][s].openDir[1] == 4 && result[res].direction_id == 2) {
                      isExist = 1;
                    }
                  }
                } else if(!result[res].min_width && !result[res].max_width && result[res].min_height && result[res].max_height) {
                  if(sizes[lastInd][s].sizes[1] >= result[res].min_height && sizes[lastInd][s].sizes[1] <= result[res].max_height) {
                    if(sizes[lastInd][s].openDir[0] == 1 && sizes[lastInd][s].openDir[1] == 2 && result[res].direction_id == 3 || sizes[lastInd][s].openDir[0] == 1 && sizes[lastInd][s].openDir[1] == 4 && result[res].direction_id == 2) {
                      isExist = 1;
                    }
                  }
                } else if(result[res].min_width && result[res].max_width && result[res].min_height && result[res].max_height) {
                  if(sizes[lastInd][s].sizes[1] >= result[res].min_height && sizes[lastInd][s].sizes[1] <= result[res].max_height) {
                    if(sizes[lastInd][s].sizes[0] >= result[res].min_width && sizes[lastInd][s].sizes[0] <= result[res].max_width) {
                      if(sizes[lastInd][s].openDir[0] == 1 && sizes[lastInd][s].openDir[1] == 2 && result[res].direction_id == 3 || sizes[lastInd][s].openDir[0] == 1 && sizes[lastInd][s].openDir[1] == 4 && result[res].direction_id == 2) {
                        isExist = 1;
                      }
                    }
                  }
                }

              }
              //console.log('isExist+++', isExist);
              if(isExist) {
                if(openDirQty == 1) {
                  if(sizes[lastInd][s].openDir[0] == 2 && result[res].window_hardware_type_id == 2){
                    hardwareresult.push(result[res]);
                  } else if(sizes[lastInd][s].openDir[0] == 4 && result[res].window_hardware_type_id == 2){
                    hardwareresult.push(result[res]);
                  } else if(sizes[lastInd][s].openDir[0] == 1 && result[res].window_hardware_type_id == 7){
                    hardwareresult.push(result[res]);
                  } else if(sizes[4].length && sizes[lastInd][s].openDir[0] == 2 && result[res].window_hardware_type_id == 4){
                    hardwareresult.push(result[res]);
                  } else if(sizes[4].length && sizes[lastInd][s].openDir[0] == 4 && result[res].window_hardware_type_id == 4){
                    hardwareresult.push(result[res]);
                  }
                } else if(openDirQty == 2) {
                  if(result[res].window_hardware_type_id == 6){
                    hardwareresult.push(result[res]);
                  } else if(sizes[4].length && result[res].window_hardware_type_id == 17){
                    hardwareresult.push(result[res]);
                  }
                }
              }
            }
          }
          /** parse Kits */
          if(hardwareresult.length) {
            var promHardware = hardwareresult.map(function(item) {
              var deff2 = $q.defer();
              if(item.child_type === 'list'){
                parseListContent(angular.copy(item.child_id)).then(function (result) {
                  deff2.resolve(result);
                });
              } else {
                deff2.resolve(0);
              }
              return deff2.promise;
            });

            $q.all(promHardware).then(function(result) {
//              console.warn('hardware2++', result);
              var resQty = result.length;
              if(resQty) {
                for(var r = 0; r < resQty; r++) {
                  if(result[r]) {
                    hardwareresult.push(result[r]);
                  }
                }
              }
              deff.resolve(hardwareresult);
            });
          } else {
            deff.resolve(0);
          }


        }
      });

      return deff.promise;
    }










    /** CONSTRUCTION PRICE **/

    function calculationPrice(construction) {
      var deffMain = $q.defer(),
          priceObj = {},
          finishPriceObj = {};

      priceObj.currCurrencyId = construction.currencyId;
//      console.info('START+++', construction);
      /** collect Kit Children Elements*/
      var parseKitPromises = construction.sizes.map(function(item, index, arr) {
        var deff = $q.defer();
        if(item.length) {
          /** if hardware exists */
          if(index === arr.length-1 && construction.ids[index]) {
            getHardwareAsId(construction.ids[index], construction.sizes).then(function (result){
              deff.resolve(result);
            });
          } else {
            parseListContent(angular.copy(construction.ids[index])).then(function (result) {
              deff.resolve(result);
            });
          }
        } else {
          deff.resolve(0);
        }
        return deff.promise;
      });

      $q.all(parseKitPromises).then(function(data1) {
//        console.warn('consist!!!!!!+', data1);
        priceObj.consist = data1;

        parseMainKit(construction).then(function(data2) {
//          console.warn('kits!!!!!!+', data2);
          priceObj.kits = data2;
          parseKitElement(data2).then(function(data3) {
//            console.warn('kitsElem!!!!!!+', data3);
            priceObj.kitsElem = data3;
            parseConsistElem(priceObj.consist).then(function(data4){
//              console.warn('consistElem!!!!!!+', data4);
              priceObj.consistElem = data4;
              /** download all currencies */
              downloadAllCurrencies().then(function(data5) {
//                console.warn('currencies!!!!!!+', data5);
                priceObj.currencies = data5;
                priceObj.constrElements = culcKitPrice(priceObj, construction.sizes);
                culcConsistPrice(priceObj, construction);
                priceObj.priceTotal = GeneralServ.roundingNumbers(priceObj.priceTotal);
//                console.info('FINISH====:', priceObj);
                finishPriceObj.constrElements = angular.copy(priceObj.constrElements);
                finishPriceObj.priceTotal = angular.copy(priceObj.priceTotal);
                deffMain.resolve(finishPriceObj);
              })
            });
          });
        });
      });
      return deffMain.promise;
    }




    /** ADDELEMENT PRICE */

    function getAdditionalPrice(AddElement){
      var deffMain = $q.defer(),
          finishPriceObj = {},
          priceObj = {
            constrElements: [],
            priceTotal: 0
          };

      priceObj.currCurrencyId = AddElement.currencyId;
//      console.info('START+++', AddElement);
      /** collect Kit Children Elements*/
      parseListContent(angular.copy(AddElement.elementId)).then(function (result) {
//        console.warn('consist!!!!!!+', result);
        priceObj.consist = result;

        /** parse Kit */
        selectLocalDB(tablesLocalDB.lists.tableName, {id: AddElement.elementId}, 'parent_element_id, name').then(function(result) {
          if(result.length) {
            priceObj.kits = result[0];
//            console.warn('kits!!!!!!+', result[0]);
            /** parse Kit Element */
            getElementByListId(0, priceObj.kits.parent_element_id ).then(function(result){
              priceObj.kitsElem = result;
//              console.warn('kitsElem!!!!!!+', result);

              parseConsistElem(priceObj.consist).then(function(data4){
//                console.warn('consistElem!!!!!!+', data4);
                priceObj.consistElem = data4;
                /** download all currencies */
                downloadAllCurrencies().then(function(data5) {
//                  console.warn('currencies!!!!!!+', data5);
                  priceObj.currencies = data5;

                  if (AddElement.elementWidth > 0) {

                    /** culc Kit Price */

                    var priceTemp = 0,
                        sizeTemp = 0,
                        constrElem = angular.copy(priceObj.kitsElem);

                    sizeTemp = (AddElement.elementWidth + constrElem.amendment_pruning);
                    priceTemp = (sizeTemp * constrElem.price) * (1 + (constrElem.waste / 100));

                    /** currency conversion */
                    if (priceObj.currCurrencyId != constrElem.currency_id){
//                      console.log('diff currency');
                      currencyExgange(priceTemp, priceObj.currCurrencyId, constrElem.currency_id, priceObj.currencies);
                    }
                    constrElem.qty = 1;
                    constrElem.size = angular.copy(sizeTemp);
                    constrElem.priceReal = angular.copy(priceTemp);
                    priceObj.priceTotal += priceTemp;
                    priceObj.constrElements.push(constrElem);
//                    console.warn('constrElem!!!!!!+', constrElem);

                    /** culc Consist Price */

                    if(priceObj.consistElem) {
                      var consistQty = priceObj.consist.length;
                      if(consistQty) {
                        for(var cons = 0; cons < consistQty; cons++) {
                          if(priceObj.consist[cons]) {
                            var wasteValue = (1 + (priceObj.consistElem[cons].waste / 100));
                            if (priceObj.consist[cons].parent_list_id === AddElement.elementId) {
                              var fullSize = (AddElement.elementWidth + priceObj.consistElem[cons].amendment_pruning);
                              priceObj.consist[cons].newValue = getValueByRule(fullSize, priceObj.consist[cons].value, priceObj.consist[cons].rules_type_id);
                              culcPriceAsRule(1, AddElement.elementWidth, priceObj.consist[cons], priceObj.consistElem[cons], wasteValue, priceObj);
                            } else {
//                              console.warn('else++++');
                              for (var el = 0; el < consistQty; el++) {
                                if(priceObj.consist[cons].parent_list_id == priceObj.consist[el].child_id){
                                  priceObj.consist[cons].newValue = getValueByRule(priceObj.consist[el].newValue, priceObj.consist[cons].value, priceObj.consist[cons].rules_type_id);
                                  culcPriceAsRule(priceObj.consist[cons].newValue, priceObj.consist[el].newValue, priceObj.consist[cons], priceObj.consistElem[cons], wasteValue, priceObj);
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }

                  priceObj.priceTotal = GeneralServ.roundingNumbers(priceObj.priceTotal);
//                  console.info('FINISH ADD ====:', priceObj);
                  finishPriceObj.constrElements = angular.copy(priceObj.constrElements);
                  finishPriceObj.priceTotal = angular.copy(priceObj.priceTotal);
                  deffMain.resolve(finishPriceObj);
                })
              });

            });
          } else {
            deffMain.resolve(priceObj);
          }
        });

      });
      return deffMain.promise;
    }

  }
})();
