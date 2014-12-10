
// services/globalDB.js

"use strict";

BauVoiceApp.factory('globalDB', ['$http', function ($http) {

  var elemLists = [];

  // SQL requests for creating tables if they are not exists yet
  var createTablesSQL = ["CREATE TABLE IF NOT EXISTS factories (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS elements_groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), base_unit INTEGER, position INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS glass_folders (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), factory_id INTEGER, position INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id))",
      "CREATE TABLE IF NOT EXISTS lists_types (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), image_add_param VARCHAR(100), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS addition_colors (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), lists_type_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(lists_type_id) REFERENCES lists_types(id))",
      "CREATE TABLE IF NOT EXISTS margin_types (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS suppliers (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), factory_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id))",
      "CREATE TABLE IF NOT EXISTS currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), value NUMERIC(10, 2), factory_id INTEGER, is_base INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id))",
      "CREATE TABLE IF NOT EXISTS countries (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), currency_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(currency_id) REFERENCES currencies(id))",
      "CREATE TABLE IF NOT EXISTS regions (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), country_id INTEGER, heat_transfer NUMERIC(10, 2), climatic_zone NUMERIC, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(country_id) REFERENCES countries(id))",
      "CREATE TABLE IF NOT EXISTS cities (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), region_id INTEGER, transport VARCHAR(2), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(region_id) REFERENCES regions(id))",
      "CREATE TABLE IF NOT EXISTS lamination_colors (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), factory_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id))",
      "CREATE TABLE IF NOT EXISTS elements (id INTEGER PRIMARY KEY AUTOINCREMENT, sku VARCHAR(100), name VARCHAR(255), element_group_id INTEGER, price NUMERIC(10, 2), currency_id INTEGER, supplier_id INTEGER, margin_id INTEGER, waste NUMERIC(10, 2), is_optimized INTEGER, is_virtual INTEGER, is_additional INTEGER, weight_accounting_unit NUMERIC(10, 3), glass_folder_id INTEGER, min_width NUMERIC, min_height NUMERIC, max_width NUMERIC, max_height NUMERIC, max_sq NUMERIC, transcalency NUMERIC(10, 2), amendment_pruning NUMERIC(10, 2), glass_width INTEGER, factory_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(glass_folder_id) REFERENCES glass_folders(id), FOREIGN KEY(margin_id) REFERENCES margin_types(id), FOREIGN KEY(supplier_id) REFERENCES suppliers(id), FOREIGN KEY(currency_id) REFERENCES currencies(id), FOREIGN KEY(element_group_id) REFERENCES elements_groups(id))",
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(255), password VARCHAR(255), short_id VARCHAR(2), parent_id INTEGER, factory_id INTEGER, discount_construct_max NUMERIC(10, 1), discount_construct_default NUMERIC(10, 1), discount_additional_elements_max NUMERIC(10, 1), discount_additional_elements_default NUMERIC(10, 1), name VARCHAR(255), phone VARCHAR(100), inn VARCHAR(100), okpo VARCHAR(100), mfo VARCHAR(100), bank_name VARCHAR(100), bank_acc_no VARCHAR(100), director VARCHAR(255), stamp_file_name VARCHAR(255), locked INTEGER, user_type INTEGER, contact_name VARCHAR(100), city_phone VARCHAR(100), city_id INTEGER, legal_name VARCHAR(255), fax VARCHAR(100), avatar VARCHAR(255), birthday DATE, sex VARCHAR(100), margin_mounting_mon NUMERIC(10, 2), margin_mounting_tue NUMERIC(10, 2), margin_mounting_wed NUMERIC(10, 2), margin_mounting_thu NUMERIC(10, 2), margin_mounting_fri NUMERIC(10, 2), margin_mounting_sat NUMERIC(10, 2), margin_mounting_sun NUMERIC(10, 2), min_term INTEGER, base_term INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(city_id) REFERENCES cities(id))",
      "CREATE TABLE IF NOT EXISTS lists_groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY AUTOINCREMENT, parent_element_id INTEGER, name VARCHAR(255), list_group_id INTEGER, list_type_id INTEGER, add_color_id INTEGER, a NUMERIC(10, 2), b NUMERIC(10, 2), c NUMERIC(10, 2), d NUMERIC(10, 2), position NUMERIC, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(parent_element_id) REFERENCES elements(id), FOREIGN KEY(parent_element_id) REFERENCES elements(id), FOREIGN KEY(list_group_id) REFERENCES lists_groups(id), FOREIGN KEY(add_color_id) REFERENCES addition_colors(id))",
      "CREATE TABLE IF NOT EXISTS directions (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS rules_types (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), parent_unit INTEGER, child_unit INTEGER, suffix VARCHAR(15), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS window_hardware_colors (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS list_contents (id INTEGER PRIMARY KEY AUTOINCREMENT, parent_list_id INTEGER, child_id INTEGER, child_type VARCHAR(255), value NUMERIC(10, 3), rules_type_id INTEGER, direction_id INTEGER, lamination_type_id INTEGER, window_hardware_color_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(parent_list_id) REFERENCES lists(id), FOREIGN KEY(rules_type_id) REFERENCES rules_types(id), FOREIGN KEY(direction_id) REFERENCES directions(id), FOREIGN KEY(lamination_type_id) REFERENCES lamination_types(id), FOREIGN KEY(window_hardware_color_id) REFERENCES window_hardware_colors(id))",
      "CREATE TABLE IF NOT EXISTS window_hardware_types (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), short_name VARCHAR(100), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS window_hardware_types_base (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
      "CREATE TABLE IF NOT EXISTS window_hardware_groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), short_name VARCHAR(100), factory_id INTEGER, is_editable INTEGER, parent_id INTEGER, is_group INTEGER, is_in_calculation INTEGER, base_type_id INTEGER, position INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(base_type_id) REFERENCES window_hardware_types_base(id))",
      "CREATE TABLE IF NOT EXISTS window_hardware (id INTEGER PRIMARY KEY AUTOINCREMENT, window_hardware_type_id INTEGER, min_width INTEGER, max_width INTEGER, min_height INTEGER, max_height INTEGER, direction_id INTEGER, window_hardware_color_id INTEGER, length INTEGER, count INTEGER, child_id INTEGER, child_type VARCHAR(100), position INTEGER, factory_id INTEGER, window_hardware_group_id INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(window_hardware_type_id) REFERENCES window_hardware_types(id), FOREIGN KEY(direction_id) REFERENCES directions(id), FOREIGN KEY(window_hardware_group_id) REFERENCES window_hardware_groups(id), FOREIGN KEY(window_hardware_color_id) REFERENCES window_hardware_colors(id))",
      "CREATE TABLE IF NOT EXISTS profile_system_folders (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), factory_id INTEGER, position INTEGER, modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(factory_id) REFERENCES factories(id))",
      "CREATE TABLE IF NOT EXISTS profile_systems (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), short_name VARCHAR(100), profile_system_folder_id INTEGER, rama_list_id INTEGER, rama_still_list_id INTEGER, stvorka_list_id INTEGER, impost_list_id INTEGER, shtulp_list_id INTEGER, is_editable INTEGER, is_default INTEGER, position INTEGER, country VARCHAR(100), modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(profile_system_folder_id) REFERENCES profile_system_folders(id))"],
    createDevice = "CREATE TABLE IF NOT EXISTS device (id INTEGER PRIMARY KEY AUTOINCREMENT, device_code VARCHAR(255), sync INTEGER, last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";

  // SQL requests for select data from tables
  var selectDeviceCodeLocalDb = "SELECT device_code as code, sync FROM device",
    selectUser = "SELECT count(id) as login FROM users WHERE phone = ? AND password = ?",
    selectUserInfo = "SELECT users.name, users.city_id, cities.name as city_name, users.avatar FROM users LEFT JOIN cities ON users.city_id = cities.id",
    selectLastSync = "SELECT last_sync FROM device";

  // SQL requests for inserting data into tables
  var insertDeviceCodeLocalDb = "INSERT INTO device (id, device_code, sync) VALUES (?, ?, ?)";

  // SQL requests for update data in tables
  var updateDeviceSync = "UPDATE device SET sync = 1, last_sync = ? WHERE id = 1";

  // SQL requests for delete tables
  var deleteTablesSQL = ["DROP table device", "DROP table factories", "DROP table device", "DROP table factories", "DROP table elements_groups", "DROP table glass_folders",
    "DROP table lists_types", "DROP table addition_colors", "DROP table margin_types", "DROP table suppliers", "DROP table currencies", "DROP table countries",
    "DROP table regions", "DROP table cities", "DROP table lamination_colors", "DROP table elements", "DROP table users", "DROP table lists_groups", "DROP table lists",
    "DROP table directions", "DROP table rules_types", "DROP table window_hardware_colors", "DROP table list_contents", "DROP table window_hardware_types",
    "DROP table window_hardware_types_base", "DROP table window_hardware_groups", "DROP table window_hardware", "DROP table profile_system_folders",
    "DROP table profile_systems"];

  return {

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

    getDeviceCodeLocalDb: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      var newDeviceCodeLocalDb = '';
      var words = '0123456789qwertyuiopasdfghjklzxcvbnm';
      var maxPosition = words.length - 1;
      for (var i = 0; i < 8; ++i) {
        var position = Math.floor(Math.random() * maxPosition);
        newDeviceCodeLocalDb = newDeviceCodeLocalDb + words.substring(position, position + 1);
      }
      newDeviceCodeLocalDb = "f9q9nkzu"; // TODO временно! убрать
      db.transaction(function (transaction) {
        transaction.executeSql(createDevice, []);
      });
      db.transaction(function (transaction) {
        transaction.executeSql(selectDeviceCodeLocalDb, [], function (transaction, result) {
          if (result.rows.length) {
            if (result.rows.item(0).sync) {
              callback(new OkResult({sync: true, deviceCode: result.rows.item(0).code}));
            } else {
              callback(new OkResult({sync: false, deviceCode: result.rows.item(0).code}));
            }
          } else {
            db.transaction(function (transaction) {
              transaction.executeSql(insertDeviceCodeLocalDb, [1, newDeviceCodeLocalDb, 0], function () {
              }, function () {
                callback(new ErrorResult(2, 'Something went wrong with inserting device record'));
              });
            });
            callback(new OkResult({sync: false, deviceCode: newDeviceCodeLocalDb}));
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong with selection device_code record'));
        });
      });
    },

    getDeviceCodeGlobalDb: function (deviceCode, callback) {
      if (deviceCode) {
        $http.get('http://api.voice-creator.net/sync/elements?device_code=' + deviceCode).success(function (result) {
          if(result.status) {
            if (result.data.length < 2) {
              callback(new OkResult(deviceCode));
            } else {
              callback(new ErrorResult(2, 'Device Code is already use in other device!'));
            }
          } else {
            callback(new ErrorResult(2, 'No Device Code in Database yet!'));
          }
        }).error(function () {
          callback(new ErrorResult(2, 'Something went wrong with selecting data from Database'));
        });
      } else {
        callback(new ErrorResult(2, 'Bad Device Code!'));
      }
    },

    initApp: function (callback) {
      var self = this;
      this.getDeviceCodeLocalDb(function (result) {
        if (result.status) {
          var deviceCodeLocalDb = result.data;
          console.log(deviceCodeLocalDb);
          self.getDeviceCodeGlobalDb(deviceCodeLocalDb.deviceCode, function (result) {
            if (result.status) {
              var deviceCodeGlobalDb = result.data;
              if (deviceCodeLocalDb.deviceCode === deviceCodeGlobalDb && !deviceCodeLocalDb.sync) {
                console.log('Import database begin!');
                self.importDb(deviceCodeGlobalDb, function (result) {
                  if (result.status) {
                    console.log('Database import is finished!');
                    callback(new OkResult('Database import is finished!'));
                  } else {
                    callback(new ErrorResult(2, 'Something went wrong when importing Database!'));
                  }
                });
              }
            }
          });
        }
      });
    },

    importDb: function (deviceCode, callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), i, table;
      db.transaction(function (transaction) {
        for (i = 0; i < createTablesSQL.length; i++) {
          transaction.executeSql(createTablesSQL[i], []);
        }
      });
      $http.get('http://api.voice-creator.net/sync/elements?access_token=' + deviceCode).success(function (result) {
        db.transaction(function (transaction) {
          for (table in result.tables) {
            for (i = 0; i < result.tables[table].rows.length; i++) {
              transaction.executeSql('INSERT INTO ' + table + ' (' + result.tables[table].fields.join(', ') + ') VALUES (' + getValuesString(result.tables[table].rows[i]) + ')', [], function () {
              }, function () {
                callback(new ErrorResult(2, 'Something went wrong with inserting ' + table + ' record'));
              });
            }
          }
          transaction.executeSql(updateDeviceSync, [""+result.last_sync+""], null, function () {
            callback(new ErrorResult(2, 'Something went wrong with updating device table!'));
          });
          callback({status: true});
        });
      }).error(function () {
        callback(new ErrorResult(2, 'Something went wrong with importing Database!'));
      });
    },

    getLastSync: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      db.transaction(function (transaction) {
        transaction.executeSql(selectLastSync, [], function (transaction, result) {
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

    syncDb: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), i, k, table, updateSql, lastSyncDate, deviceCode;
      var self = this;

      this.getDeviceCodeLocalDb(function (result) {
        deviceCode = result.data.deviceCode;
        self.getLastSync(function (result) {
          lastSyncDate = result.data.last_sync;
          $http.get('http://api.voice-creator.net/sync/elements?access_token=' + deviceCode + '&last_sync=' + lastSyncDate).success(function (result) {
            db.transaction(function (transaction) {
              for (table in result.tables) {
                for (i = 0; i < result.tables[table].rows.length; i++) {
                  updateSql = '';
                  for(k = 0; k < result.tables[table].fields.length; k++){
                    if(!k)
                      updateSql += result.tables[table].fields[k] + " = '" + result.tables[table].rows[i][k] + "'";
                    else
                      updateSql += ", " + result.tables[table].fields[k] + " = '" + result.tables[table].rows[i][k] + "'";
                  }
                  transaction.executeSql("UPDATE " + table + " SET " + updateSql + " WHERE id = " + result.tables[table].rows[i][0], [], function () {
                  }, function () {
                    callback(new ErrorResult(2, 'Something went wrong with updating ' + table + ' record'));
                  });
                }
              }
              transaction.executeSql(updateDeviceSync, [""+result.last_sync+""], null, function () {
                callback(new ErrorResult(2, 'Something went wrong with updating device table!'));
              });
              callback({status: true});
            });
          }).error(function () {
            callback(new ErrorResult(2, 'Something went wrong with sync Database!'));
          });
        });
      });
    },

    clearDb: function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), i;
      db.transaction(function (transaction) {
        for (i = 0; i < deleteTablesSQL.length; i++) {
          transaction.executeSql(deleteTablesSQL[i], [], function () {
            callback({status: true});
          }, function () {
            callback(new ErrorResult(2, 'Something went wrong with deleting table'));
          });
        }
      });
    },

/*
    getUserInfo : function (callback) {
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      db.transaction(function (transaction) {
        transaction.executeSql(selectUserInfo, [], function (transaction, result) {
          if (result.rows.length) {
            callback(new OkResult({
              user: {
                name: result.rows.item(0).name,
                avatar: result.rows.item(0).avatar
              },
              city: {
                id: result.rows.item(0).city_id,
                name: result.rows.item(0).city_name
              }
            }));
          } else {
            callback(new ErrorResult(1, 'Incorrect userId!'));
          }
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong with selection user record'));
        });
      });
    },
*/

    login: function (loginData, callback) {
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




    getCurrentCurrency: function(cityId, callback){
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      db.transaction(function (transaction) {
        transaction.executeSql('select id, name, value from currencies where id = (select country_id from regions where id = (select region_id from cities where id = ?))', [cityId], function (transaction, result) {
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

    getPriceByIdList: function(liId, i, callback){
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      db.transaction(function (transaction) {
        transaction.executeSql('select parent_element_id from lists where id = ?', [liId], function (transaction, result){
          transaction.executeSql('select id, currency_id, price, waste from elements where id = ?', [result.rows.item(0).parent_element_id], function (transaction, result){
            callback(new OkResult({"currency":result.rows.item(0), "index":i}));
          }, function () {
            callback(new ErrorResult(2, 'Something went wrong when get element price'));
          });
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong when get parent_element_id'));
        });
      });
    },

    getPriceById: function(elId, i, callback){
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536);
      db.transaction(function (transaction) {
        transaction.executeSql('select id, currency_id, price, waste from elements where id = ?', [elId], function (transaction, result){
          callback(new OkResult({"currency":result.rows.item(0), "index":i}));
        }, function () {
          callback(new ErrorResult(2, 'Something went wrong when get element price'));
        });
      });
    },

    parseList: function(listId, callback){
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), currListId;
      var lists = [];
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

    getValueByRule: function (parentValue, childValue, rule){
      var value = 0;
      switch (rule) {
        case 1:
          value = parentValue - childValue;
          break;
        case 3:
          value = Math.round(parentValue * childValue);
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
          value = Math.round(parentValue * childValue);
          break;
        case 13:
          value = parentValue * childValue;
          break;
        case 14:
          value = Math.round(parentValue * childValue);
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

    calculationPrice: function (construction, callback) {
      var self = this;
      var db = openDatabase('bauvoice', '1.0', 'bauvoice', 65536), price = 0, profSys, priceObj = {};
      this.getCurrentCurrency(construction.cityId, function (result){next_1(result);});
      function next_1(result){
        if(result.status){
          priceObj.currentCurrency = result.data;
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
          self.parseList(construction.glassId, function (result){next_glass(result);});
        }
      }
      function next_glass(result){
        if(result.status){
          priceObj.glassIds = result.data;
          elemLists = [];
          db.transaction(function (transaction) {
            transaction.executeSql('select parent_element_id from lists where id in (?, ?, ?, ?, ?)', [construction.frameId, construction.frameSillId, construction.sashId, construction.impostId, construction.glassId], function (transaction, result){next_6(result);}, function () {
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
          priceObj.glassIds.parent_element_id = result.rows.item(4).parent_element_id;
          db.transaction(function (transaction) {
            transaction.executeSql('select id, currency_id, price, waste from elements where id in (?, ?, ?, ?, ?)', [result.rows.item(0).parent_element_id, result.rows.item(1).parent_element_id, result.rows.item(2).parent_element_id, result.rows.item(3).parent_element_id, result.rows.item(4).parent_element_id], function (transaction, result){next_7(result);}, function () {
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
          }
          if(priceObj.framesIds.length) {
            for (var i = 0; i < priceObj.framesIds.length; i++) {
              if (priceObj.framesIds[i].elemLists.child_type === 'element'){
                self.getPriceById(priceObj.framesIds[i].elemLists.child_id, i, function (result){
                  priceObj.framesIds[result.data.index].priceEl = result.data.currency;
                });
              } else {
                self.getPriceByIdList(priceObj.framesIds[i].elemLists.child_id, i, function (result){
                  priceObj.framesIds[result.data.index].priceEl = result.data.currency;
                });
              }
            }
          }
          if(priceObj.frameSillsIds.length) {
            for (var i = 0; i < priceObj.frameSillsIds.length; i++) {
              if (priceObj.frameSillsIds[i].elemLists.child_type === 'element'){
                self.getPriceById(priceObj.frameSillsIds[i].elemLists.child_id, i, function (result){
                  priceObj.frameSillsIds[result.data.index].priceEl = result.data.currency;
                });
              } else {
                self.getPriceByIdList(priceObj.frameSillsIds[i].elemLists.child_id, i, function (result){
                  priceObj.frameSillsIds[result.data.index].priceEl = result.data.currency;
                });
              }
            }
          }
          if(priceObj.sashsIds.length) {
            for (var i = 0; i < priceObj.sashsIds.length; i++) {
              if (priceObj.sashsIds[i].elemLists.child_type === 'element'){
                self.getPriceById(priceObj.sashsIds[i].elemLists.child_id, i, function (result){
                  priceObj.sashsIds[result.data.index].priceEl = result.data.currency;
                });
              } else {
                self.getPriceByIdList(priceObj.sashsIds[i].elemLists.child_id, i, function (result){
                  priceObj.sashsIds[result.data.index].priceEl = result.data.currency;
                });
              }
            }
          }
          if(priceObj.impostIds.length) {
            for (var i = 0; i < priceObj.impostIds.length; i++) {
              if (priceObj.impostIds[i].elemLists.child_type === 'element'){
                self.getPriceById(priceObj.impostIds[i].elemLists.child_id, i, function (result){
                  priceObj.impostIds[result.data.index].priceEl = result.data.currency;
                });
              } else {
                self.getPriceByIdList(priceObj.impostIds[i].elemLists.child_id, i, function (result){
                  priceObj.impostIds[result.data.index].priceEl = result.data.currency;
                });
              }
            }
          }
          if(priceObj.glassIds.length) {
            for (var i = 0; i < priceObj.glassIds.length; i++) {
              if (priceObj.glassIds[i].elemLists.child_type === 'element'){
                self.getPriceById(priceObj.glassIds[i].elemLists.child_id, i, function (result){
                  priceObj.glassIds[result.data.index].priceEl = result.data.currency;
                });
              } else {
                self.getPriceByIdList(priceObj.glassIds[i].elemLists.child_id, i, function (result){
                  priceObj.glassIds[result.data.index].priceEl = result.data.currency;
                });
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
          //console.log(priceObj.framesIds);
          if(construction.framesSize.length) {
            for (var i = 0; i < construction.framesSize.length; i++) {
              //console.log('('+construction.framesSize[i]+'/1000)*'+priceObj.framesIds.price.price+')*(1+('+priceObj.framesIds.price.waste+'/100)');
              priceTmp += ((construction.framesSize[i] / 1000) * priceObj.framesIds.price.price) * (1 + (priceObj.framesIds.price.waste / 100));
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
          var priceTmp = 0;
          //console.log(priceObj.frameSillsIds);
          if(construction.frameSillId) {
            //console.log('('+construction.frameSillSize+'/1000)*'+priceObj.frameSillsIds.price.price+')*(1+('+priceObj.frameSillsIds.price.waste+'/100)');
            priceTmp += ((construction.frameSillSize / 1000) * priceObj.frameSillsIds.price.price) * (1 + (priceObj.frameSillsIds.price.waste / 100));
            if (priceObj.currentCurrency.id != priceObj.frameSillsIds.price.currency_id){
              for (var i = 0; i < priceObj.currencies.length; i++) {
                if(priceObj.currencies[i].id == priceObj.frameSillsIds.price.currency_id){
                  priceTmp = priceTmp * priceObj.currencies[i].value;
                }
              }
            }
          }
          priceObj.price += priceTmp;
          var priceTmp = 0;
          //console.log(priceObj.sashsIds);
          if(construction.sashsSize.length) {
            for (var i = 0; i < construction.sashsSize.length; i++) {
              //console.log('('+construction.sashsSize[i]+'/1000)*'+priceObj.sashsIds.price.price+')*(1+('+priceObj.sashsIds.price.waste+'/100)');
              priceTmp += ((construction.sashsSize[i] / 1000) * priceObj.sashsIds.price.price) * (1 + (priceObj.sashsIds.price.waste / 100));
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
          //console.log(priceObj.impostIds);
          if(construction.impostsSize.length) {
            for (var i = 0; i < construction.impostsSize.length; i++) {
              //console.log('('+construction.impostsSize[i]+'/1000)*'+priceObj.impostIds.price.price+')*(1+('+priceObj.impostIds.price.waste+'/100)');
              priceTmp += ((construction.impostsSize[i] / 1000) * priceObj.impostIds.price.price) * (1 + (priceObj.impostIds.price.waste / 100));
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
          //console.log(construction.glassSquares);
          if(construction.glassSquares.length) {
            for (var i = 0; i < construction.glassSquares.length; i++) {
              //console.log('('+construction.glassSquares[i]+'*'+priceObj.glassIds.price.price+')');
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
          if(construction.framesSize.length) {
            for (var i = 0; i < construction.framesSize.length; i++) {
              if(priceObj.framesIds.length) {
                for (var j = 0; j < priceObj.framesIds.length; j++) {
                  var priceTmp = 0;
                  if(priceObj.framesIds[j].elemLists.parent_list_id == construction.frameId){
                    var value = self.getValueByRule(construction.framesSize[i], priceObj.framesIds[j].elemLists.value, priceObj.framesIds[j].elemLists.rules_type_id);
                    priceObj.framesIds[j].elemLists.newValue = value;
                    //console.log('('+value+'/1000)*'+priceObj.framesIds[j].priceEl.price+')*(1+('+priceObj.framesIds[j].priceEl.waste+'/100)');
                    priceTmp += ((value / 1000) * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                    if (priceObj.currentCurrency.id != priceObj.framesIds[j].priceEl.currency_id){
                      for (var k = 0; k < priceObj.currencies.length; k++) {
                        if(priceObj.currencies[k].id == priceObj.framesIds[j].priceEl.currency_id){
                          priceTmp = priceTmp * priceObj.currencies[k].value;
                        }
                      }
                    }
                  } else {
                    for (var g = 0; g < priceObj.framesIds.length; g++) {
                      if(priceObj.framesIds[j].elemLists.parent_list_id == priceObj.framesIds[g].elemLists.child_id){
                        var value = self.getValueByRule(priceObj.framesIds[g].elemLists.newValue, priceObj.framesIds[j].elemLists.value, priceObj.framesIds[g].elemLists.rules_type_id);
                        priceObj.framesIds[j].elemLists.newValue = value;
                      }
                    }
                    //console.log('('+value+'/1000)*'+priceObj.framesIds[j].priceEl.price+')*(1+('+priceObj.framesIds[j].priceEl.waste+'/100)');
                    priceTmp += ((value / 1000) * priceObj.framesIds[j].priceEl.price) * (1 + (priceObj.framesIds[j].priceEl.waste / 100));
                    if (priceObj.currentCurrency.id != priceObj.framesIds[j].priceEl.currency_id){
                      for (var k = 0; k < priceObj.currencies.length; k++) {
                        if(priceObj.currencies[k].id == priceObj.framesIds[j].priceEl.currency_id){
                          priceTmp = priceTmp * priceObj.currencies[k].value;
                        }
                      }
                    }
                  }
                  priceObj.price += priceTmp;
                }
              }
            }
          }
          if(construction.frameSillSize) {
            if(priceObj.frameSillsIds.length) {
              for (var j = 0; j < priceObj.frameSillsIds.length; j++) {
                var priceTmp = 0;
                if(priceObj.frameSillsIds[j].elemLists.parent_list_id == construction.frameSillId){
                  var value = self.getValueByRule(construction.frameSillSize, priceObj.frameSillsIds[j].elemLists.value, priceObj.frameSillsIds[j].elemLists.rules_type_id);
                  priceObj.frameSillsIds[j].elemLists.newValue = value;
                  //console.log('('+value+'/1000)*'+priceObj.frameSillsIds[j].priceEl.price+')*(1+('+priceObj.frameSillsIds[j].priceEl.waste+'/100)');
                  priceTmp += ((value / 1000) * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
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
                    }
                  }
                  //console.log('('+value+'/1000)*'+priceObj.frameSillsIds[j].priceEl.price+')*(1+('+priceObj.frameSillsIds[j].priceEl.waste+'/100)');
                  priceTmp += ((value / 1000) * priceObj.frameSillsIds[j].priceEl.price) * (1 + (priceObj.frameSillsIds[j].priceEl.waste / 100));
                  if (priceObj.currentCurrency.id != priceObj.frameSillsIds[j].priceEl.currency_id){
                    for (var k = 0; k < priceObj.currencies.length; k++) {
                      if(priceObj.currencies[k].id == priceObj.frameSillsIds[j].priceEl.currency_id){
                        priceTmp = priceTmp * priceObj.currencies[k].value;
                      }
                    }
                  }
                }
                priceObj.price += priceTmp;
              }
            }
          }
          if(construction.sashsSize.length) {
            for (var i = 0; i < construction.sashsSize.length; i++) {
              if(priceObj.sashsIds.length) {
                for (var j = 0; j < priceObj.sashsIds.length; j++) {
                  var priceTmp = 0;
                  if(priceObj.sashsIds[j].elemLists.parent_list_id == construction.sashId){
                    var value = self.getValueByRule(construction.sashsSize[i], priceObj.sashsIds[j].elemLists.value, priceObj.sashsIds[j].elemLists.rules_type_id);
                    priceObj.sashsIds[j].elemLists.newValue = value;
                    //console.log('('+value+'/1000)*'+priceObj.sashsIds[j].priceEl.price+')*(1+('+priceObj.sashsIds[j].priceEl.waste+'/100)');
                    priceTmp += ((value / 1000) * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
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
                        var value = self.getValueByRule(priceObj.sashsIds[g].elemLists.newValue, priceObj.sashsIds[j].elemLists.value, priceObj.sashsIds[g].elemLists.rules_type_id);
                        priceObj.sashsIds[j].elemLists.newValue = value;
                      }
                    }
                    //console.log('('+value+'/1000)*'+priceObj.sashsIds[j].priceEl.price+')*(1+('+priceObj.sashsIds[j].priceEl.waste+'/100)');
                    priceTmp += ((value / 1000) * priceObj.sashsIds[j].priceEl.price) * (1 + (priceObj.sashsIds[j].priceEl.waste / 100));
                    if (priceObj.currentCurrency.id != priceObj.sashsIds[j].priceEl.currency_id){
                      for (var k = 0; k < priceObj.currencies.length; k++) {
                        if(priceObj.currencies[k].id == priceObj.sashsIds[j].priceEl.currency_id){
                          priceTmp = priceTmp * priceObj.currencies[k].value;
                        }
                      }
                    }
                  }
                  priceObj.price += priceTmp;
                }
              }
            }
          }
          if(construction.impostsSize.length) {
            for (var i = 0; i < construction.impostsSize.length; i++) {
              if(priceObj.impostIds.length) {
                for (var j = 0; j < priceObj.impostIds.length; j++) {
                  var priceTmp = 0;
                  if(priceObj.impostIds[j].elemLists.parent_list_id == construction.impostId){
                    var value = self.getValueByRule(construction.impostsSize[i], priceObj.impostIds[j].elemLists.value, priceObj.impostIds[j].elemLists.rules_type_id);
                    priceObj.impostIds[j].elemLists.newValue = value;
                    //console.log('('+value+'/1000)*'+priceObj.impostIds[j].priceEl.price+')*(1+('+priceObj.impostIds[j].priceEl.waste+'/100)');
                    priceTmp += ((value / 1000) * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
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
                      }
                    }
                    //console.log('('+value+'/1000)*'+priceObj.impostIds[j].priceEl.price+')*(1+('+priceObj.impostIds[j].priceEl.waste+'/100)');
                    priceTmp += ((value / 1000) * priceObj.impostIds[j].priceEl.price) * (1 + (priceObj.impostIds[j].priceEl.waste / 100));
                    if (priceObj.currentCurrency.id != priceObj.impostIds[j].priceEl.currency_id){
                      for (var k = 0; k < priceObj.currencies.length; k++) {
                        if(priceObj.currencies[k].id == priceObj.impostIds[j].priceEl.currency_id){
                          priceTmp = priceTmp * priceObj.currencies[k].value;
                        }
                      }
                    }
                  }
                  priceObj.price += priceTmp;
                }
              }
            }
          }
          if(construction.glassSquares.length) {
            for (var i = 0; i < construction.glassSquares.length; i++) {
              if(priceObj.glassIds.length) {
                for (var j = 0; j < priceObj.glassIds.length; j++) {
                  var priceTmp = 0;
                  if(priceObj.glassIds[j].elemLists.parent_list_id == construction.glassId){
                    var value = self.getValueByRule(1, priceObj.glassIds[j].elemLists.value, priceObj.glassIds[j].elemLists.rules_type_id);
                    priceObj.glassIds[j].elemLists.newValue = value;
                    //console.log('('+value+'*'+priceObj.glassIds[j].priceEl.price+')*(1+('+priceObj.glassIds[j].priceEl.waste+'/100)');
                    priceTmp += (value * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
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
                      }
                    }
                    //console.log('('+value+'*'+priceObj.glassIds[j].priceEl.price+')*(1+('+priceObj.glassIds[j].priceEl.waste+'/100)');
                    priceTmp += (value * priceObj.glassIds[j].priceEl.price) * (1 + (priceObj.glassIds[j].priceEl.waste / 100));
                    if (priceObj.currentCurrency.id != priceObj.glassIds[j].priceEl.currency_id){
                      for (var k = 0; k < priceObj.currencies.length; k++) {
                        if(priceObj.currencies[k].id == priceObj.glassIds[j].priceEl.currency_id){
                          priceTmp = priceTmp * priceObj.currencies[k].value;
                        }
                      }
                    }
                  }
                  priceObj.price += priceTmp;
                }
              }
            }
          }
          priceObj.price = priceObj.price.toFixed(2);
          callback(new OkResult(priceObj));
        } else {
          console.log(result);
        }
      }
    }







  }
}]);

function getValuesString(data){
  var valuesString = '', i;
  for (i = 0; i < data.length; i++) {
    if(!i){
      valuesString += "'" + data[i] + "'";
    } else {
      valuesString += ", '" + data[i] + "'";
    }
  }
  return valuesString;
}

/* Пример первой инициализации App
localStorage.initApp(function (result) {
  if(result.status){
    console.log(result);
  } else {
    console.log(result);
  }
});
*/
