(function () {
  "use strict";
  /**@ngInject*/
  angular
    .module("BauVoiceApp")
    .factory("localDB", function ($http,
      $q,
      $filter,
      globalConstants,
      GeneralServ,
      UserStor,
      GlobalStor,
      AuxStor,
      ProductStor) {
      var thisFactory = this,
        tablesLocalDB = {
          addition_folders: {
            tableName: "addition_folders",
            prop: "name VARCHAR(255)," +
              " addition_type_id INTEGER," +
              " is_push INTEGER," +
              " factory_id INTEGER," +
              " position INTEGER," +
              " img VARCHAR," +
              " description VARCHAR," +
              " link VARCHAR," +
              " max_size INTEGER",
            foreignKey: ", FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(addition_type_id) REFERENCES addition_types(id)"
          },
          cities: {
            tableName: "cities",
            prop: "region_id INTEGER," +
              " name VARCHAR(255)," +
              " transport VARCHAR(2)," +
              " lat NUMERIC, long NUMERIC," +
              " is_capital INTEGER," +
              " code_sync INTEGER," +
              " name_sync VARCHAR(255)," +
              " area_id INTEGER," +
              " price_koef_id INTEGER",
            foreignKey: ", FOREIGN KEY(region_id) REFERENCES regions(id)"
          },
          price_koefficients: {
            tableName: "price_koefficients",
            prop: "element_id INTEGER," + "koef_id INTEGER," + "value NUMERIC",
            foreignKey: ""
          },
          countries: {
            tableName: "countries",
            prop: "name VARCHAR(255), currency_id INTEGER",
            foreignKey: ", FOREIGN KEY(currency_id) REFERENCES currencies(id)"
          },
          currencies: {
            tableName: "currencies",
            prop: "name VARCHAR(100), value NUMERIC(10, 2), factory_id INTEGER, is_base INTEGER",
            foreignKey: ", FOREIGN KEY(factory_id) REFERENCES factories(id)"
          },
          directions: {
            tableName: "directions",
            prop: "name VARCHAR(255)",
            foreignKey: ""
          },
          elements_groups: {
            tableName: "elements_groups",
            prop: "name VARCHAR(255), base_unit INTEGER, position INTEGER",
            foreignKey: ""
          },
          beed_profile_systems: {
            tableName: "beed_profile_systems",
            prop: "profile_system_id INTEGER, list_id INTEGER, glass_width INTEGER",
            foreignKey: ", FOREIGN KEY(list_id) REFERENCES lists(id)"
          },
          glass_folders: {
            tableName: "glass_folders",
            prop: "name VARCHAR(255)," +
              " img VARCHAR," +
              " is_push INTEGER," +
              " position INTEGER," +
              " factory_id INTEGER," +
              " description VARCHAR," +
              " link VARCHAR," +
              " is_base INTEGER",
            foreignKey: ""
          },
          glass_prices: {
            tableName: "glass_prices",
            prop: "element_id INTEGER," +
              " col_1_range NUMERIC(10, 2)," +
              " col_1_price NUMERIC(10, 2)," +
              " col_2_range_1 NUMERIC(10, 2)," +
              " col_2_range_2 NUMERIC(10, 2)," +
              " col_2_price NUMERIC(10, 2)," +
              " col_3_range_1 NUMERIC(10, 2)," +
              " col_3_range_2 NUMERIC(10, 2)," +
              " col_3_price NUMERIC(10, 2)," +
              " col_4_range_1 NUMERIC(10, 2)," +
              " col_4_range_2 NUMERIC(10, 2)," +
              " col_4_price NUMERIC(10, 2)," +
              " col_5_range NUMERIC(10, 2)," +
              " col_5_price NUMERIC(10, 2)," +
              " table_width INTEGER",
            foreignKey: ""
          },
          lamination_factory_colors: {
            tableName: "lamination_factory_colors",
            prop: "name VARCHAR(255), lamination_type_id INTEGER, factory_id INTEGER",
            foreignKey: ", FOREIGN KEY(lamination_type_id) REFERENCES lamination_default_colors(id), FOREIGN KEY(factory_id) REFERENCES factories(id)"
          },
          lamination_types: {
            tableName: "lamination_types",
            prop: "name VARCHAR(255)",
            foreignKey: ""
          },
          lists_groups: {
            tableName: "lists_groups",
            prop: "name VARCHAR(255)",
            foreignKey: ""
          },
          lists_types: {
            tableName: "lists_types",
            prop: "name VARCHAR(255), image_add_param VARCHAR(100)",
            foreignKey: ""
          },
          options_coefficients: {
            tableName: "options_coefficients",
            prop: "rentability_percent INTEGER," +
              " rentability_hrn_m INTEGER," +
              " rentability_hrn INTEGER," +
              " others_percent INTEGER," +
              " others_hrn_m INTEGER," +
              " others_hrn INTEGER," +
              " transport_cost_percent INTEGER," +
              " transport_cost_hrn_m INTEGER," +
              " transport_cost_hrn INTEGER," +
              " salary_manager_percent INTEGER," +
              " salary_manager_hrn_m INTEGER," +
              " salary_manager_hrn INTEGER," +
              " rent_offices_percent INTEGER," +
              " rent_offices_hrn_m INTEGER," +
              " rent_offices_hrn INTEGER," +
              " salary_itr_percent INTEGER," +
              " salary_itr_hrn_m INTEGER," +
              " salary_itr_hrn INTEGER," +
              " rent_production_percent INTEGER," +
              " rent_production_hrn_m INTEGER," +
              " rent_production_hrn INTEGER," +
              " salary_glass_percent INTEGER," +
              " salary_glass_hrn_m INTEGER," +
              " salary_glass_hrn INTEGER," +
              " salary_assembly_percent INTEGER," +
              " salary_assembly_hrn_m INTEGER," +
              " salary_assembly_hrn INTEGER," +
              " estimated_cost INTEGER," +
              " factory_id INTEGER," +
              " plan_production INTEGER," +
              " margin NUMERIC(10, 2)," +
              " coeff NUMERIC(10, 2)," +
              " area_price NUMERIC(10, 2)," +
              " area_currencies INTEGER," +
              " perimeter_price NUMERIC(10, 2)," +
              " perimeter_currencies INTEGER," +
              " piece_price NUMERIC(10, 2)," +
              " piece_currencies NUMERIC(10, 2)",
            foreignKey: ""
          },
          options_discounts: {
            tableName: "options_discounts",
            prop: "factory_id INTEGER," +
              " min_time INTEGER," +
              " standart_time INTEGER," +
              " base_time INTEGER," +
              " week_1 INTEGER," +
              " week_2 INTEGER," +
              " week_3 INTEGER," +
              " week_4 INTEGER," +
              " week_5 INTEGER," +
              " week_6 INTEGER," +
              " week_7 INTEGER," +
              " week_8 INTEGER," +
              " percents ARRAY",
            foreignKey: ", FOREIGN KEY(factory_id) REFERENCES factories(id)"
          },
          elements: {
            tableName: "elements",
            prop: "heat_coeff INTEGER," +
              " name VARCHAR(255)," +
              " element_group_id INTEGER," +
              " currency_id INTEGER," +
              " supplier_id INTEGER," +
              " margin_id INTEGER," +
              " waste NUMERIC(10, 2)," +
              " is_optimized INTEGER," +
              " is_virtual INTEGER," +
              " is_additional INTEGER," +
              " weight_accounting_unit NUMERIC(10, 3)," +
              " glass_folder_id INTEGER," +
              " min_width NUMERIC," +
              " min_height NUMERIC," +
              " max_width NUMERIC," +
              " max_height NUMERIC," +
              " max_sq NUMERIC," +
              " transcalency NUMERIC(10, 2)," +
              " glass_width INTEGER," +
              " factory_id INTEGER," +
              " price NUMERIC(10, 2)," +
              " amendment_pruning NUMERIC(10, 2)," +
              " noise_coeff NUMERIC," +
              " sku VARCHAR(100)," +
              " lamination_in_id INTEGER," +
              " lamination_out_id INTEGER," +
              " reg_coeff NUMERIC",
            foreignKey: ", FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(glass_folder_id) REFERENCES glass_folders(id), FOREIGN KEY(margin_id) REFERENCES margin_types(id), FOREIGN KEY(supplier_id) REFERENCES suppliers(id), FOREIGN KEY(currency_id) REFERENCES currencies(id), FOREIGN KEY(element_group_id) REFERENCES elements_groups(id)"
          },
          profile_system_folders: {
            tableName: "profile_system_folders",
            prop: "name VARCHAR(255)," +
              " factory_id INTEGER," +
              " position INTEGER," +
              " link VARCHAR," +
              " description VARCHAR," +
              " img VARCHAR",
            foreignKey: ", FOREIGN KEY(factory_id) REFERENCES factories(id)"
          },
          profile_systems: {
            tableName: "profile_systems",
            prop: "name VARCHAR(255)," +
              " short_name VARCHAR(100)," +
              " folder_id INTEGER," +
              " rama_list_id INTEGER," +
              " rama_still_list_id INTEGER," +
              " stvorka_list_id INTEGER," +
              " impost_list_id INTEGER," +
              " shtulp_list_id INTEGER," +
              " is_editable INTEGER," +
              " is_default INTEGER," +
              " position INTEGER," +
              " country VARCHAR(100)," +
              " cameras INTEGER," +
              " heat_coeff INTEGER," +
              " noise_coeff INTEGER," +
              " heat_coeff_value NUMERIC(5,2)," +
              " link VARCHAR," +
              " description VARCHAR," +
              " img VARCHAR," +
              " is_push INTEGER",
            foreignKey: ""
          },
          profile_laminations: {
            tableName: "profile_laminations",
            prop: "profile_id INTEGER," +
              " lamination_in_id INTEGER," +
              " lamination_out_id INTEGER," +
              " rama_list_id INTEGER," +
              " rama_still_list_id INTEGER," +
              " stvorka_list_id INTEGER," +
              " impost_list_id INTEGER," +
              " shtulp_list_id INTEGER," +
              " code_sync VARCHAR",
            foreignKey: ""
          },
          rules_types: {
            tableName: "rules_types",
            prop: "name VARCHAR(255), parent_unit INTEGER, child_unit INTEGER, suffix VARCHAR(15)",
            foreignKey: ""
          },
          regions: {
            tableName: "regions",
            prop: "name VARCHAR(255), country_id INTEGER, heat_transfer NUMERIC(10, 2), climatic_zone NUMERIC",
            foreignKey: ", FOREIGN KEY(country_id) REFERENCES countries(id)"
          },
          users: {
            tableName: "users",
            prop: " email VARCHAR(255)," +
              " password VARCHAR(255)," +
              " factory_id INTEGER," +
              " name VARCHAR(255)," +
              " phone VARCHAR(100)," +
              " locked INTEGER," +
              " user_type INTEGER," +
              " city_phone VARCHAR(100)," +
              " city_id INTEGER," +
              " fax VARCHAR(100)," +
              " avatar VARCHAR(255)," +
              " birthday DATE," +
              " sex VARCHAR(100)," +
              " mount_mon NUMERIC(5,2)," +
              " mount_tue NUMERIC(5,2)," +
              " mount_wed NUMERIC(5,2)," +
              " mount_thu NUMERIC(5,2)," +
              " mount_fri NUMERIC(5,2)," +
              " mount_sat NUMERIC(5,2)," +
              " mount_sun NUMERIC(5,2)," +
              " device_code VARCHAR(250)," +
              " last_sync TIMESTAMP," +
              " address VARCHAR," +
              " therm_coeff_id INTEGER," +
              " factoryLink VARCHAR," +
              " code_sync VARCHAR",
            foreignKey: ", FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(city_id) REFERENCES cities(id)"
          },
          users_discounts: {
            tableName: "users_discounts",
            prop: "user_id INTEGER," +
              " max_construct NUMERIC(5,1)," +
              " max_add_elem NUMERIC(5,1)," +
              " default_construct NUMERIC(5,1)," +
              " default_add_elem NUMERIC(5,1)," +
              " week_1_construct NUMERIC(5,1)," +
              " week_1_add_elem NUMERIC(5,1)," +
              " week_2_construct NUMERIC(5,1)," +
              " week_2_add_elem NUMERIC(5,1)," +
              " week_3_construct NUMERIC(5,1)," +
              " week_3_add_elem NUMERIC(5,1)," +
              " week_4_construct NUMERIC(5,1)," +
              " week_4_add_elem NUMERIC(5,1)," +
              " week_5_construct NUMERIC(5,1)," +
              " week_5_add_elem NUMERIC(5,1)," +
              " week_6_construct NUMERIC(5,1)," +
              " week_6_add_elem NUMERIC(5,1)," +
              " week_7_construct NUMERIC(5,1)," +
              " week_7_add_elem NUMERIC(5,1)," +
              " week_8_construct NUMERIC(5,1)," +
              " week_8_add_elem NUMERIC(5,1)",
            foreignKey: ""
          },
          users_deliveries: {
            tableName: "users_deliveries",
            prop: "user_id INTEGER," +
              " active INTEGER," +
              " name VARCHAR," +
              " type INTEGER," +
              " price NUMERIC(6,1)",
            foreignKey: ""
          },
          users_mountings: {
            tableName: "users_mountings",
            prop: "user_id INTEGER," +
              " active INTEGER," +
              " name VARCHAR," +
              " type INTEGER," +
              " price NUMERIC(6,1)",
            foreignKey: ""
          },
          users_dismantlings: {
            tableName: "users_dismantlings",
            prop: "user_id INTEGER," +
              " active INTEGER," +
              " name VARCHAR," +
              " type INTEGER," +
              " price NUMERIC(6,1)",
            foreignKey: ""
          },
          lists: {
            tableName: "lists",
            prop: "name VARCHAR(255)," +
              " list_group_id INTEGER," +
              " list_type_id INTEGER," +
              " a NUMERIC(10, 2)," +
              " b NUMERIC(10, 2)," +
              " c NUMERIC(10, 2)," +
              " d NUMERIC(10, 2)," +
              " parent_element_id INTEGER," +
              " position NUMERIC," +
              " add_color_id INTEGER," +
              " addition_folder_id INTEGER," +
              " amendment_pruning NUMERIC(10, 2)," +
              " waste NUMERIC(10, 2)," +
              " cameras INTEGER," +
              " link VARCHAR," +
              " description VARCHAR," +
              " img VARCHAR," +
              " beed_lamination_id INTEGER," +
              " in_door INTEGER," +
              " is_push INTEGER," +
              " doorstep_type INTEGER," +
              " glass_type INTEGER," +
              " glass_image INTEGER," +
              " glass_color INTEGER",
            foreignKey: ", FOREIGN KEY(parent_element_id) REFERENCES elements(id), FOREIGN KEY(parent_element_id) REFERENCES elements(id), FOREIGN KEY(list_group_id) REFERENCES lists_groups(id), FOREIGN KEY(add_color_id) REFERENCES addition_colors(id)"
          },
          list_contents: {
            tableName: "list_contents",
            prop: "parent_list_id INTEGER," +
              " child_id INTEGER," +
              " child_type VARCHAR(255)," +
              " value NUMERIC(10, 7)," +
              " rules_type_id INTEGER," +
              " direction_id INTEGER," +
              " window_hardware_color_id INTEGER," +
              " lamination_type_id INTEGER," +
              " rounding_value NUMERIC," +
              " rounding_type INTEGER",
            foreignKey: ", FOREIGN KEY(parent_list_id) REFERENCES lists(id), FOREIGN KEY(rules_type_id) REFERENCES rules_types(id), FOREIGN KEY(direction_id) REFERENCES directions(id), FOREIGN KEY(lamination_type_id) REFERENCES lamination_types(id), FOREIGN KEY(window_hardware_color_id) REFERENCES window_hardware_colors(id)"
          },
          window_hardware_types: {
            tableName: "window_hardware_types",
            prop: "name VARCHAR(255), short_name VARCHAR(100)",
            foreignKey: ""
          },
          window_hardware_folders: {
            tableName: "window_hardware_folders",
            prop: "name VARCHAR," +
              " factory_id INTEGER," +
              " link VARCHAR," +
              " description VARCHAR," +
              " img VARCHAR",
            foreignKey: ""
          },

          window_hardware_groups: {
            tableName: "window_hardware_groups",
            prop: "name VARCHAR(255)," +
              " short_name VARCHAR(100)," +
              " folder_id INTEGER," +
              " is_editable INTEGER," +
              " is_group INTEGER," +
              " is_in_calculation INTEGER," +
              " is_default INTEGER," +
              " position INTEGER," +
              " producer VARCHAR(255)," +
              " country VARCHAR(255)," +
              " noise_coeff INTEGER," +
              " heat_coeff INTEGER," +
              " min_height INTEGER," +
              " max_height INTEGER," +
              " min_width INTEGER," +
              " max_width INTEGER," +
              " is_push INTEGER," +
              " link VARCHAR," +
              " description VARCHAR," +
              " img VARCHAR",
            foreignKey: ""
          },
          window_hardwares: {
            tableName: "window_hardwares",
            prop: "window_hardware_type_id INTEGER," +
              " min_width INTEGER," +
              " max_width INTEGER," +
              " min_height INTEGER," +
              " max_height INTEGER," +
              " direction_id INTEGER," +
              " window_hardware_color_id INTEGER," +
              " length INTEGER," +
              " count INTEGER," +
              " child_id INTEGER," +
              " child_type VARCHAR(100)," +
              " position INTEGER," +
              " factory_id INTEGER," +
              " window_hardware_group_id INTEGER",
            foreignKey: ", FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(window_hardware_type_id) REFERENCES window_hardware_types(id), FOREIGN KEY(direction_id) REFERENCES directions(id), FOREIGN KEY(window_hardware_group_id) REFERENCES window_hardware_groups(id), FOREIGN KEY(window_hardware_color_id) REFERENCES window_hardware_colors(id)"
          },
          window_hardware_colors: {
            tableName: "window_hardware_colors",
            prop: "name VARCHAR(255)",
            foreignKey: ""
          },
          window_hardware_handles: {
            tableName: "window_hardware_handles",
            prop: "element_id INTEGER, location VARCHAR(255), constant_value NUMERIC(10, 2)",
            foreignKey: ""
          },

          elements_profile_systems: {
            tableName: "elements_profile_systems",
            prop: "profile_system_id INTEGER, element_id INTEGER",
            foreignKey: ""
          },
          orders: {
            tableName: "orders",
            prop: "order_number VARCHAR," +
              " order_hz VARCHAR," +
              " order_date TIMESTAMP," +
              " order_type INTEGER," +
              " order_style VARCHAR," +
              " user_id INTEGER," +
              " created TIMESTAMP," +
              " additional_payment VARCHAR," +
              " sended TIMESTAMP," +
              " state_to TIMESTAMP," +
              " state_buch TIMESTAMP," +
              " batch VARCHAR," +
              " base_price NUMERIC(13, 2)," +
              " factory_margin NUMERIC(11, 2)," +
              " factory_id INTEGER," +
              " purchase_price NUMERIC(10, 2)," +
              " sale_price NUMERIC(10, 2)," +
              " delivery_add NUMERIC(10, 2)," +
              " delivery_garbage_removal NUMERIC(10, 2)," +
              " climatic_zone INTEGER," +
              " heat_coef_min NUMERIC," +
              " products_qty INTEGER," +
              " templates_price NUMERIC," +
              " addelems_price NUMERIC," +
              " products_price NUMERIC," +
              " delivery_date TIMESTAMP," +
              " sync_date TIMESTAMP," +
              " app_version VARCHAR," +
              " new_delivery_date TIMESTAMP," +
              " delivery_price NUMERIC," +
              " is_date_price_less INTEGER," +
              " is_date_price_more INTEGER," +
              " floor_id INTEGER," +
              " floor_price NUMERIC," +
              " mounting_id INTEGER," +
              " mounting_price NUMERIC," +
              " dismantling_user_id INTEGER," +
              " dismantling_id INTEGER," +
              " dismantling_price NUMERIC," +
              " is_instalment INTEGER," +
              " instalment_id INTEGER," +
              " is_old_price INTEGER," +
              " payment_first NUMERIC," +
              " payment_monthly NUMERIC," +
              " payment_first_primary NUMERIC," +
              " payment_monthly_primary NUMERIC," +
              " order_price NUMERIC," +
              " order_price_dis NUMERIC," +
              " order_price_primary NUMERIC," +
              " discount_construct NUMERIC," +
              " discount_addelem NUMERIC," +
              " discount_construct_max NUMERIC," +
              " discount_addelem_max NUMERIC," +
              " delivery_user_id NUMERIC," +
              " mounting_user_id NUMERIC," +
              " default_term_plant NUMERIC," +
              " disc_term_plant NUMERIC," +
              " margin_plant NUMERIC," +
              " comment TEXT," +
              " customer_name TEXT," +
              " customer_email TEXT," +
              " customer_phone VARCHAR(30)," +
              " customer_phone_city VARCHAR(20)," +
              " customer_city_id INTEGER," +
              " customer_city VARCHAR," +
              " customer_address TEXT," +
              " customer_house TEXT," +
              " customer_flat TEXT," +
              " customer_floor TEXT," +
              " customer_location VARCHAR," +
              " customer_itn INTEGER," +
              " customer_starttime VARCHAR," +
              " customer_endtime VARCHAR," +
              " customer_target VARCHAR," +
              " customer_sex INTEGER," +
              " customer_age INTEGER," +
              " customer_education INTEGER," +
              " customer_occupation INTEGER," +
              " customer_infoSource INTEGER",
            foreignKey: ""
          },
          order_products: {
            tableName: "order_products",
            prop: "order_id NUMERIC," +
              " product_id INTEGER," +
              " is_addelem_only INTEGER," +
              " room_id INTEGER," +
              " construction_type INTEGER," +
              " template_id INTEGER," +
              " template_source TEXT," +
              " template_width NUMERIC," +
              " template_height NUMERIC," +
              " template_square NUMERIC," +
              " profile_id INTEGER," +
              " door_group_id INTEGER," +
              " glass_id VARCHAR," +
              " hardware_id INTEGER," +
              " lamination_id INTEGER," +
              " lamination_out_id INTEGER," +
              " lamination_in_id INTEGER," +
              " door_type_index INTEGER," +
              " door_shape_id INTEGER," +
              " door_sash_shape_id INTEGER," +
              " door_handle_shape_id INTEGER," +
              " door_lock_shape_id INTEGER," +
              " heat_coef_total NUMERIC," +
              " template_price NUMERIC," +
              " addelem_price NUMERIC," +
              " product_price NUMERIC," +
              " comment TEXT," +
              " product_qty INTEGER," +
              " services_price_arr NUMERIC[]," +
              " service_price_dis NUMERIC," +
              " service_price NUMERIC",
            foreignKey: ""
          },
          order_addelements: {
            tableName: "order_addelements",
            prop: "order_id NUMERIC," +
              " product_id INTEGER," +
              " element_type INTEGER," +
              " element_id INTEGER," +
              " name VARCHAR," +
              " element_width NUMERIC," +
              " element_height NUMERIC," +
              " element_price NUMERIC," +
              " element_qty INTEGER," +
              " block_id INTEGER",

            // ' block_id INTEGER'+
            // ' top_id INTEGER'+
            // ' cloth_id INTEGER'+
            // ' cloth_waste INTEGER'+
            // ' top_waste INTEGER'+
            // ' right_waste INTEGER'+
            // ' bottom_waste INTEGER'+
            // ' left_waste INTEGER',

            foreignKey: ""
          },
          //          'order_elements': {
          //            'tableName': 'order_elements',
          //            'prop': 'order_id NUMERIC,' +
          //              ' element_id INTEGER,' +
          //              ' element_group_id INTEGER,' +
          //              ' name VARCHAR,' +
          //              ' sku VARCHAR,' +
          //              ' size NUMERIC,' +
          //              ' amount INTEGER,' +
          //              ' price NUMERIC',
          //            'foreignKey': ''
          //          },
          template_groups: {
            tableName: "template_groups",
            prop: "name VARCHAR(255)",
            foreignKey: ""
          },
          templates: {
            tableName: "templates",
            prop: "group_id INTEGER," +
              "name VARCHAR(255)," +
              "icon TEXT," +
              "template_object TEXT",
            foreignKey: ""
          },
          background_templates: {
            tableName: "background_templates",
            prop: "factory_id INTEGER," +
              "desc_1 VARCHAR(255)," +
              "desc_2 VARCHAR(255)," +
              "template_id INTEGER," +
              "group_id INTEGER," +
              "position INTEGER," +
              "img VARCHAR",
            foreignKey: ""
          },

          factories: {
            tableName: "factories",
            prop: "name VARCHAR," +
              "app_token VARCHAR," +
              "link VARCHAR," +
              "therm_coeff_id INTEGER," +
              "max_construct_square INTEGER," +
              "max_construct_size INTEGER",
            foreignKey: ""
          },

          mosquitos: {
            tableName: "mosquitos",
            prop: "profile_id INTEGER," +
              "name VARCHAR," +
              "bottom_id INTEGER," +
              "bottom_waste INTEGER," +
              "left_id INTEGER," +
              "left_waste INTEGER," +
              "top_id INTEGER," +
              "top_waste INTEGER," +
              "right_id INTEGER," +
              "right_waste INTEGER," +
              "cloth_id INTEGER," +
              "cloth_waste INTEGER," +
              "group_id INTEGER",
            foreignKey: ""
          },

          mosquitos_singles: {
            tableName: "mosquitos_singles",
            prop: "factory_id INTEGER," +
              "name VARCHAR," +
              "bottom_id INTEGER," +
              "bottom_waste INTEGER," +
              "left_id INTEGER," +
              "left_waste INTEGER," +
              "top_id INTEGER," +
              "top_waste INTEGER," +
              "right_id INTEGER," +
              "right_waste INTEGER," +
              "cloth_id INTEGER," +
              "cloth_waste INTEGER," +
              "group_id INTEGER",
            foreignKey: ""
          },
          doors_groups_dependencies: {
            tableName: "doors_groups_dependencies",
            prop: "doors_group_id INTEGER," + "hardware_group_id INTEGER",
            foreignKey: ""
          },
          doors_hardware_items: {
            tableName: "doors_hardware_items",
            prop: "hardware_group_id  INTEGER," +
              "min_width INTEGER," +
              "max_width INTEGER," +
              "min_height INTEGER," +
              "max_height INTEGER," +
              "direction_id   INTEGER," +
              "hardware_color_id  INTEGER," +
              "length INTEGER," +
              "count  INTEGER," +
              "child_id INTEGER," +
              "position INTEGER," +
              "child_type STRING",
            foreignKey: ""
          },
          doors_hardware_groups: {
            tableName: "doors_hardware_groups",
            prop: "burglar_coeff INTEGER," +
              "anticorrosion_coeff INTEGER," +
              "image VARCHAR(255)," +
              "description VARCHAR(255)," +
              "link VARCHAR(255)," +
              "country VARCHAR(255)," +
              "producer VARCHAR(255)," +
              "name VARCHAR(255)," +
              "hardware_type_id INTEGER," +
              "factory_id INTEGER," +
              "type INTEGER," +
              "is_push INTEGER," +
              "height_max INTEGER," +
              "height_min INTEGER," +
              "width_max INTEGER," +
              "width_min INTEGER",
            foreignKey: ""
          },
          doors_groups: {
            tableName: "doors_groups",
            prop: "code_sync_white INTEGER," +
              "rama_sill_list_id INTEGER," +
              "shtulp_list_id INTEGER," +
              "impost_list_id INTEGER," +
              "stvorka_list_id INTEGER," +
              "door_sill_list_id INTEGER," +
              "rama_list_id INTEGER," +
              "name VARCHAR," +
              "folder_id INTEGER," +
              "factory_id INTEGER",
            foreignKey: ""
          },
          areas: {
            tableName: "areas",
            prop: "name VARCHAR(255)," + "region_id INTEGER",
            foreignKey: ", FOREIGN KEY (region_id) REFERENCES regions(id)"
          },
          doors_laminations_dependencies: {
            tableName: "doors_laminations_dependencies",
            prop: "group_id INTEGER," +
              "rama_sill_list_id INTEGER," +
              "lamination_in INTEGER," +
              "lamination_out INTEGER," +
              "rama_list_id INTEGER," +
              "door_sill_list_id INTEGER," +
              "stvorka_list_id INTEGER," +
              "impost_list_id INTEGER," +
              "shtulp_list_id INTEGER," +
              "code_sync VARCHAR",
            foreignKey: ""
          },
          window_hardware_type_ranges: {
            tableName: "window_hardware_type_ranges",
            prop: "factory_id INTEGER," +
              "type_id INTEGER," +
              "max_width INTEGER," +
              "min_width INTEGER," +
              "max_height INTEGER," +
              "min_height INTEGER," +
              "group_id INTEGER",
            foreignKey: ""
          },

          lock_lists: {
            tableName: "lock_lists",
            prop: "list_id INTEGER," + "accessory_id INTEGER",
            foreignKey: ""
          },

          //-------- inner temables
          //          'analytics': {
          //            'tableName': 'analytics',
          //            'prop': 'order_id NUMERIC, user_id INTEGER, calculation_id INTEGER, element_id INTEGER, element_type INTEGER',
          //            'foreignKey': ''
          //          },

          export: {
            tableName: "export",
            //          'prop': 'table_name VARCHAR, row_id INTEGER, message TEXT',
            prop: "model VARCHAR, rowId INTEGER, field TEXT",
            foreignKey: ""
          }
        },
        tablesLocationLocalDB = {
          cities: {
            tableName: "cities",
            prop: "name VARCHAR(255), region_id INTEGER, transport VARCHAR(2)",
            foreignKey: ", FOREIGN KEY(region_id) REFERENCES regions(id)"
          },
          countries: {
            tableName: "countries",
            prop: "name VARCHAR(255), currency_id INTEGER",
            foreignKey: ", FOREIGN KEY(currency_id) REFERENCES currencies(id)"
          },
          regions: {
            tableName: "regions",
            prop: "name VARCHAR(255), country_id INTEGER, heat_transfer NUMERIC(10, 2), climatic_zone NUMERIC",
            foreignKey: ", FOREIGN KEY(country_id) REFERENCES countries(id)"
          },
          filter_doorhandles: {
            tableName: "filter_doorhandles",
            prop: "factory_id INTEGER," +
              "modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
              "functions VARCHAR(255)," +
              "design VARCHAR(255)," +
              "color VARCHAR(255)," +
              "manufacturer VARCHAR(255)," +
              "id INTEGER",
            foreignKey: ""
          },
          filter_furnitures: {
            tableName: "filter_furnitures",
            prop: "factory_id INTEGER," +
              "modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
              "functions VARCHAR(255)," +
              "manufacturer VARCHAR(255)," +
              "id INTEGER",
            foreignKey: ""
          },
          filter_glasses: {
            tableName: "filter_glasses",
            prop: "factory_id INTEGER," +
              "modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
              "functions VARCHAR(255)," +
              "depth VARCHAR(255)," +
              "cameras_count VARCHAR(255)," +
              "distance_frame VARCHAR(255)," +
              "fill VARCHAR(255)," +
              "decoration VARCHAR(255)," +
              "manufacturer VARCHAR(255)," +
              "id INTEGER",
            foreignKey: ""
          },
          filter_laminations: {
            tableName: "filter_laminations",
            prop: "factory_id INTEGER," +
              "modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
              "color VARCHAR(255)," +
              "location VARCHAR(255)," +
              "cover_type VARCHAR(255)," +
              "id INTEGER",
            foreignKey: ""
          },
          filter_mosquitos: {
            tableName: "filter_mosquitos",
            prop: "factory_id INTEGER," +
              "modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
              "jumper VARCHAR(255)," +
              "color VARCHAR(255)," +
              "functions VARCHAR(255)," +
              "fastening_type VARCHAR(255)," +
              "id INTEGER",
            foreignKey: ""
          },
          filter_profile_systems: {
            tableName: "filter_profile_systems",
            prop: "factory_id INTEGER," +
              "manufacturer VARCHAR(255)," +
              "montage_width VARCHAR(255)," +
              "class VARCHAR(255)," +
              "cameras_count VARCHAR(255)," +
              "color VARCHAR(255)," +
              "design VARCHAR(255)," +
              "modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
              "id INTEGER",
            foreignKey: ""
          },
          filter_sills: {
            tableName: "filter_sills",
            prop: "factory_id INTEGER," +
              "modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
              "surface_type	 VARCHAR(255)," +
              "color VARCHAR(255)," +
              "width VARCHAR(255)," +
              "type VARCHAR(255)," +
              "id INTEGER",
            foreignKey: ""
          },
          filter_slopes: {
            tableName: "filter_slopes",
            prop: "factory_id INTEGER," +
              "modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
              "surface_type	 VARCHAR(255)," +
              "color VARCHAR(255)," +
              "width VARCHAR(255)," +
              "material VARCHAR(255)," +
              "id INTEGER",
            foreignKey: ""
          },
          filter_spillways: {
            tableName: "filter_spillways",
            prop: "factory_id INTEGER," +
              "modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
              "surface_type	 VARCHAR(255)," +
              "color VARCHAR(255)," +
              "width VARCHAR(255)," +
              "type VARCHAR(255)," +
              "id INTEGER",
            foreignKey: ""
          }

        };
      localforage.setDriver([localforage.INDEXEDDB]);
      var db = localforage.createInstance({
        name: "bauvoice"
      });
      /**============ methods ================*/
      let LocalDataBase = null;
      var LocalLocationBase = null;

      /**----- if string has single quote <'> it replaces to double quotes <''> -----*/

      function checkStringToQuote(str) {
        if (angular.isString(str)) {
          // if (!isNaN(parseFloat(str)) && !str.includes("-")) {
          //   return parseFloat(str);
          // } else {
          if (str.indexOf("'") + 1) {
            //console.warn(str);
            return str.replace(/'/g, "''");
          } else {
            return str;
          }
          // }
        } else {
          return str;
        }
      }

      function where(collection, options) {
        var arr = [];
        let length = collection.length;
        for (let index = 0; index < length; index++) {
          let el = collection[index];
          if (_.isMatch(el, options)) {
            arr.push(el);
          }
        }
        return arr;
      }

      function selectLocalDB(tableName, options, columns) {
        // console.log("selectLocalDB",tableName);
        var defer = $q.defer();
        let result = [];
        if (LocalDataBase[tableName]) {
          if (!options) {
            result = angular.copy(LocalDataBase[tableName]);
          } else {
            result = angular.copy(where(LocalDataBase[tableName], options));
          }
          if (columns) {
            let new_res = [];
            let col_list = columns.split(",");
            let result_length = result.length;
            for (let index = 0; index < result_length; index++) {
              let item = result[index];
              let row = {};
              let col_list_length = col_list.length;
              for (let jndex = 0; jndex < col_list_length; jndex++) {
                let col = col_list[jndex];
                col = col.replace(/ /g, '');
                row[col] = item[col];
              }
              new_res.push(row);
            }
            result = angular.copy(new_res);
          }
          if (result) {
            defer.resolve(result);
          } else {
            defer.resolve(0);
          }

        } else {
          defer.resolve(0);
        }
        return defer.promise;
      }

      function insertRowLocalDB(row, tableName) {
        if (!LocalDataBase[tableName]) {
          LocalDataBase[tableName] = [row];
        } else {
          LocalDataBase[tableName].push(row);
        }
        db.setItem('tables', LocalDataBase).then(function (value) {
          // Do other things once the value has been saved.
        }).catch(function (err) {
          // This code runs if there were any errors
          console.log(err);
        });
      }

      function insertTablesLocalDB(tables) {
        var defer = $q.defer();
        let tables_name = Object.keys(tables);
        let table_length = tables_name.length;
        for (let index = 0; index < table_length; index++) {
          let tableName = tables_name[index];
          LocalDataBase[tableName] = tables[tableName];
        }

        db.setItem('tables', LocalDataBase).then(function (value) {
          // Do other things once the value has been saved.
          defer.resolve(1);
        }).catch(function (err) {
          // This code runs if there were any errors
          defer.resolve(0);
          console.log(err);
        });
        return defer.promise;
      }

      function updateLocalDB(tableName, elem, options) {
        let key = Object.keys(options)[0];
        let val = options[key]
        LocalDataBase[tableName] =  LocalDataBase[tableName].filter(function(item){return item[key] !== val})

        LocalDataBase[tableName].push(elem);
        db.setItem('tables', LocalDataBase).then(function (value) {
          // Do other things once the value has been saved.
          // console.log(tableName,value[tableName])
        }).catch(function (err) {
          // This code runs if there were any errors
          console.log(err);
        });
      }

      function deleteRowLocalDB(tableName, options) {
        let key = Object.keys(options)[0];
        let val = options[key]
        if (LocalDataBase[tableName] && LocalDataBase[tableName].length) {

          LocalDataBase[tableName] =  LocalDataBase[tableName].filter(function(item){return item[key] !== val})

          db.setItem('tables', LocalDataBase).then(function (value) {
            // Do other things once the value has been saved.
            // console.log(tableName,value[tableName]);
          }).catch(function (err) {
            // This code runs if there were any errors
            console.log(err);
          });
        }
      }

      function deleteProductServer(login, access, orderNumber, table) {
        var defer = $q.defer();
        var dataSend = {
          model: table,
          orderId: orderNumber
        };
        $http
          .post(
            globalConstants.serverIP +
            "/api/remove-order-properties?login=" +
            login +
            "&access_token=" +
            access,
            dataSend
          )
          .then(
            function (result) {
              defer.resolve(result.data);
            },
            function () {
              defer.resolve({
                status: 0
              });
            }
          );
        return defer.promise;
      }

      //============== SERVER ===========//

      /** get User from Server by login */
      function importUser(login, type) {
        var defer = $q.defer(),
          query = type ? "/api/login?type=1" : "/api/login";
        $http.post(globalConstants.serverIP + query, {
          login: login
        }).then(
          function (result) {
            defer.resolve(result.data);
          },
          function () {
            console.log("Something went wrong with User recive!");
            defer.resolve({
              status: 0
            });
          }
        );
        return defer.promise;
      }

      /** get Cities, Regions, Countries from Server */
      function importLocation(login, access) {
        var defer = $q.defer();
        $http
          .get(globalConstants.serverIP + "/api/get/locations?login=" + login + "&access_token=" + access)
          .then(
            function (result) {
              if (result.data.status) {
                //-------- insert in LocalDB
                // console.warn(result.data);
                LocalLocationBase = convert(result.data);
                db.setItem('location', LocalLocationBase).then(function (value) {
                  // Do other things once the value has been saved.
                  defer.resolve(LocalLocationBase);
                }).catch(function (err) {
                  // This code runs if there were any errors
                  console.log(err);
                });
              } else {
                console.log("Error!");
                defer.resolve(0);
              }
            },
            function () {
              console.log("Something went wrong with Location!");
              defer.resolve(0);
            }
          );
        return defer.promise;
      }

      function importFactories(login, access, cityIds) {
        var defer = $q.defer();
        $http
          .get(
            globalConstants.serverIP +
            "/api/get/factories-by-country?login=" +
            login +
            "&access_token=" +
            access +
            "&cities_ids=" +
            cityIds
          )
          .then(
            function (result) {
              defer.resolve(result.data);
            },
            function () {
              console.log("Something went wrong with get factories!");
              defer.resolve({
                status: 0
              });
            }
          );
        return defer.promise;
      }

      function importAllDB(login, access) {
        var defer = $q.defer();
        //console.log('Import database begin!');
        // console.log(globalConstants.serverIP +"/api/sync?login=" +login +"&access_token=" +access);
        $http
          .get(globalConstants.serverIP + "/api/sync?login=" + login + "&access_token=" + access + "&" + Math.random())
          .then(function (result) {
              if (result.data.status) {
                //-------- insert in LocalDB
                LocalDataBase = convert(result.data);
                db.setItem('tables', LocalDataBase).then(function (value) {
                  // Do other things once the value has been saved.
                  defer.resolve(1);
                }).catch(function (err) {
                  // This code runs if there were any errors
                  console.log(err);
                });
              } else {
                console.log("importAllDB Error!");
                defer.resolve(0);
              }
            },
            function (err) {
              console.log('Something went wrong with importing Database!', err);
              defer.resolve(0);
            });
        return defer.promise;
      }

      function insertServer(login, access, table, data) {
        var defer = $q.defer(),
          dataToSend = {
            model: table,
            row: JSON.stringify(data)
          };
        $http
          .post(
            globalConstants.serverIP +
            "/api/insert?login=" +
            login +
            "&access_token=" +
            access,
            dataToSend
          )
          .then(
            function (result) {
              //console.log('send changes to server success:', result);
              defer.resolve(result.data);
            },
            function (result) {
              console.log("send changes to server failed");
              defer.resolve(result.data);
            }
          );
        return defer.promise;
      }

      function updateOrderServer(login, access, table, data, orderId) {
        var defer = $q.defer();
        if (data.id) {
          delete data.id;
        }
        if (data.modified) {
          delete data.modified;
        }
        var dataToSend = {
          model: table,
          rowId: orderId * 1,
          field: JSON.stringify(data)
        };
        $http
          .post(
            globalConstants.serverIP +
            "/api/update?login=" +
            login +
            "&access_token=" +
            access,
            dataToSend
          )
          .then(
            function (result) {
              //console.log('send changes to server success');
              defer.resolve(1);
            },
            function (result) {
              //console.log('send changes to server failed', result, table);
              defer.resolve(0);
            }
          );
        return defer.promise;
      }

      function updateServer(login, access, data) {
        var promises = _.map(data, function (item) {
          var defer = $q.defer();
          $http
            .post(
              globalConstants.serverIP +
              "/api/update?login=" +
              login +
              "&access_token=" +
              access,
              item
            )
            .then(
              function (result) {
                //console.log('send changes to server success:', result);
                defer.resolve(1);
              },
              function () {
                //console.log('send changes to server failed');
                defer.resolve(0);
              }
            );
          return defer.promise;
        });
        return $q.all(promises);
      }

      function createUserServer(dataJson) {
        $http.post(globalConstants.serverIP + "/api/register", dataJson).then(
          function (result) {
            //console.log(result);
          },
          function () {
            console.log("Something went wrong when user creating!");
          }
        );
      }

      function exportUserEntrance(login, access) {
        var currTime = new Date();
        $http
          .get(
            globalConstants.serverIP +
            "/api/signed?login=" +
            login +
            "&access_token=" +
            access +
            "&date=" +
            currTime
          )
          .then(
            function () {
              // console.log("Success!");
            },
            function () {
              console.log("Something went wrong!");
            }
          );
      }

      function deleteOrderServer(login, access, orderNumber) {
        var dataSend = {
          orderId: +orderNumber
        };
        $http
          .post(
            globalConstants.serverIP +
            "/api/remove-order?login=" +
            login +
            "&access_token=" +
            access,
            dataSend
          )
          .then(
            function (result) {
              // console.log(result.data);
            },
            function () {
              console.log("Something went wrong with order delete!");
            }
          );
      }

      function updateLocalServerDBs(table, row, data) {
        var defer = $q.defer(),
          dataToSend = [{
            model: table,
            rowId: row,
            field: JSON.stringify(data)
          }];
        updateLocalDB(table, data, {
          'id': row
        });
        updateServer(
          UserStor.userInfo.phone,
          UserStor.userInfo.device_code,
          dataToSend
        ).then(function (data) {
          if (!data) {
            //----- if no connect with Server save in Export LocalDB
            insertRowLocalDB(dataToSend, tablesLocalDB.export.tableName);
          }
          defer.resolve(1);
        });
        return defer.promise;
      }

      function sendIMGServer(data) {
        var defer = $q.defer();
        $http
          .post(globalConstants.serverIP + "/api/load-avatar", data, {
            //          withCredentials: true,
            headers: {
              "Content-Type": undefined
            },
            transformRequest: angular.identity
          })
          .then(
            function (result) {
              //console.log('send changes to server success:', result);
              defer.resolve(1);
            },
            function () {
              console.log("send changes to server failed");
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
          lX8 = lX & 0x80000000;
          lY8 = lY & 0x80000000;
          lX4 = lX & 0x40000000;
          lY4 = lY & 0x40000000;
          lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
          if (lX4 & lY4) {
            return lResult ^ 0x80000000 ^ lX8 ^ lY8;
          }
          if (lX4 | lY4) {
            if (lResult & 0x40000000) {
              return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
            } else {
              return lResult ^ 0x40000000 ^ lX8 ^ lY8;
            }
          } else {
            return lResult ^ lX8 ^ lY8;
          }
        }

        function F(x, y, z) {
          return (x & y) | (~x & z);
        }

        function G(x, y, z) {
          return (x & z) | (y & ~z);
        }

        function H(x, y, z) {
          return x ^ y ^ z;
        }

        function I(x, y, z) {
          return y ^ (x | ~z);
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
          var lNumberOfWords_temp2 =
            (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64;
          var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
          var lWordArray = Array(lNumberOfWords - 1);
          var lBytePosition = 0;
          var lByteCount = 0;
          while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - lByteCount % 4) / 4;
            lBytePosition = lByteCount % 4 * 8;
            lWordArray[lWordCount] =
              lWordArray[lWordCount] |
              (string.charCodeAt(lByteCount) << lBytePosition);
            lByteCount += 1;
          }
          lWordCount = (lByteCount - lByteCount % 4) / 4;
          lBytePosition = lByteCount % 4 * 8;
          lWordArray[lWordCount] =
            lWordArray[lWordCount] | (0x80 << lBytePosition);
          lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
          lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
          return lWordArray;
        }

        function WordToHex(lValue) {
          var WordToHexValue = "",
            WordToHexValue_temp = "",
            lByte,
            lCount;
          for (lCount = 0; lCount <= 3; lCount += 1) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue =
              WordToHexValue +
              WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
          }
          return WordToHexValue;
        }

        function Utf8Encode(string) {
          string = string.replace(/\r\n/g, "\n");
          var utftext = "";
          for (var n = 0; n < string.length; n += 1) {
            var c = string.charCodeAt(n);
            if (c < 128) {
              utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
              utftext += String.fromCharCode((c >> 6) | 192);
              utftext += String.fromCharCode((c & 63) | 128);
            } else {
              utftext += String.fromCharCode((c >> 12) | 224);
              utftext += String.fromCharCode(((c >> 6) & 63) | 128);
              utftext += String.fromCharCode((c & 63) | 128);
            }
          }
          return utftext;
        }

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7,
          S12 = 12,
          S13 = 17,
          S14 = 22;
        var S21 = 5,
          S22 = 9,
          S23 = 14,
          S24 = 20;
        var S31 = 4,
          S32 = 11,
          S33 = 16,
          S34 = 23;
        var S41 = 6,
          S42 = 10,
          S43 = 15,
          S44 = 21;
        string = Utf8Encode(string);
        x = ConvertToWordArray(string);
        a = 0x67452301;
        b = 0xefcdab89;
        c = 0x98badcfe;
        d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
          AA = a;
          BB = b;
          CC = c;
          DD = d;
          a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
          d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
          c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
          b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
          a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
          d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
          c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
          b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
          a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
          d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
          c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
          b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
          a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
          d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
          c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
          b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
          a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
          d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
          c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
          b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
          a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
          d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
          c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
          b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
          a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
          d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
          c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
          b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
          a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
          d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
          c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
          b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
          a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
          d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
          c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
          b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
          a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
          d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
          c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
          b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
          a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
          d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
          c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
          b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
          a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
          d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
          c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
          b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
          a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
          d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
          c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
          b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
          a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
          d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
          c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
          b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
          a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
          d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
          c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
          b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
          a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
          d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
          c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
          b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
          a = AddUnsigned(a, AA);
          b = AddUnsigned(b, BB);
          c = AddUnsigned(c, CC);
          d = AddUnsigned(d, DD);
        }
        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
        return temp.toLowerCase();
      }


      /********* PRICE *********/

      function parseHardwareKit(whId, sashBlocks, color) {
        var deff = $q.defer();
        selectLocalDB(tablesLocalDB.window_hardwares.tableName, {
          window_hardware_group_id: whId
        }).then(function (result) {
          var resQty = result.length,
            hardwareKits = [],
            sashBlocksQty = sashBlocks.length,
            hardware,
            hardware1,
            hardware2,
            openDirQty,
            s,
            dir;
          if (resQty) {
            //----- loop by sizes (sashesBlock)
            for (s = 0; s < sashBlocksQty; s += 1) {
              hardware = angular.copy(result);
              hardware1 = [];
              hardware2 = [];
              openDirQty = sashBlocks[s].openDir.length;

              /** change openDir for directions
               * direction_id == 1 - не учитывать
               * 2 - право
               * 3 - лево
               * */
              for (dir = 0; dir < openDirQty; dir += 1) {
                if (sashBlocks[s].openDir[dir] === 4) {
                  sashBlocks[s].openDir[dir] = 2;
                } else if (sashBlocks[s].openDir[dir] === 2) {
                  sashBlocks[s].openDir[dir] = 3;
                } else {
                  sashBlocks[s].openDir[dir] = 1;
                }
              }

              //------ filter by type, direction and color
              hardware1 = hardware.filter(function (item) {
                if (
                  item.window_hardware_type_id == sashBlocks[s].type &&
                  (item.window_hardware_color_id == color ||
                    !item.window_hardware_color_id)
                ) {
                  if (openDirQty == 1) {
                    return (
                      item.direction_id == sashBlocks[s].openDir[0] ||
                      item.direction_id == 1
                    );
                  } else if (openDirQty == 2) {
                    return (
                      item.direction_id == sashBlocks[s].openDir[0] ||
                      item.direction_id == sashBlocks[s].openDir[1] ||
                      item.direction_id == 1
                    );
                  }
                }
              });
              hardware2 = hardware1.filter(function (item) {
                var widthSashBlocks = Math.round(sashBlocks[s].sizes[0]);
                var heightSashBlocks = Math.round(sashBlocks[s].sizes[1]);
                if (
                  item.min_width &&
                  item.max_width &&
                  !item.min_height &&
                  !item.max_height
                ) {
                  if (
                    widthSashBlocks >= item.min_width &&
                    widthSashBlocks <= item.max_width
                  ) {
                    return item;
                  }
                } else if (!item.min_width &&
                  !item.max_width &&
                  item.min_height &&
                  item.max_height
                ) {
                  if (
                    heightSashBlocks >= item.min_height &&
                    heightSashBlocks <= item.max_height
                  ) {
                    return item;
                  }
                } else if (
                  item.min_width &&
                  item.max_width &&
                  item.min_height &&
                  item.max_height
                ) {
                  if (
                    heightSashBlocks >= item.min_height &&
                    heightSashBlocks <= item.max_height
                  ) {
                    if (
                      widthSashBlocks >= item.min_width &&
                      widthSashBlocks <= item.max_width
                    ) {
                      return item;
                    }
                  }
                } else if (!item.min_width &&
                  !item.max_width &&
                  !item.min_height &&
                  !item.max_height
                ) {
                  return item;
                }
              });
              hardwareKits.push(hardware2);
            }
            if (hardwareKits.length) {
              deff.resolve(hardwareKits);
            } else {
              deff.resolve(0);
            }
          } else {
            deff.resolve(0);
          }
        });
        return deff.promise;
      }

      function parseMainKit(construction) {
        //AH928206
        var deff = $q.defer(),
          promisesKit = _.map(construction.sizes, function (item, index, arr) {
            var deff1 = $q.defer();
            //----- chekh is sizes and id
            if (item.length && construction.ids[index]) {
              /** if hardware */
              if (index === arr.length - 1) {
                parseHardwareKit(
                  construction.ids[index],
                  item,
                  construction.laminationId
                ).then(function (hardwares) {
                  GlobalStor.global.TEMP_HARDWARES = hardwares;
                  if (hardwares.length) {
                    deff1.resolve(hardwares);
                  } else {
                    deff1.resolve(0);
                  }
                });
              } else {
                if (angular.isArray(construction.ids[index])) {
                  var promisKits = _.map(construction.ids[index], function (item2) {
                    var deff2 = $q.defer();
                    selectLocalDB(tablesLocalDB.lists.tableName, {
                        id: item2
                      },
                      "id, parent_element_id, name, waste, amendment_pruning"
                    ).then(function (result2) {
                      if (result2.length) {
                        deff2.resolve(result2);
                      } else {
                        deff2.resolve(0);
                      }
                    });
                    return deff2.promise;
                  });
                  $q.all(promisKits).then(function (result3) {
                    var data3 = angular.copy(result3),
                      resQty = data3.length,
                      collectArr = [],
                      i;
                    for (i = 0; i < resQty; i += 1) {
                      if (data3[i]) {
                        if (data3[i][0].amendment_pruning) {
                          data3[i][0].amendment_pruning /= 1000;
                        }
                        collectArr.push(data3[i][0]);
                      }
                    }
                    if (collectArr.length > 1) {
                      deff1.resolve(collectArr);
                    } else if (collectArr.length === 1) {
                      deff1.resolve(collectArr[0]);
                    } else {
                      deff1.resolve(0);
                    }
                  });
                } else {
                  selectLocalDB(
                    tablesLocalDB.lists.tableName, {
                      id: construction.ids[index]
                    },
                    "id, parent_element_id, name, waste, amendment_pruning"
                  ).then(function (result) {
                    var data = angular.copy(result);
                    if (data && data.length) {
                      if (data[0].amendment_pruning) {
                        data[0].amendment_pruning /= 1000;
                      }
                      deff1.resolve(data[0]);
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
        deff.resolve($q.all(promisesKit));
        return deff.promise;
      }

      function getKitByID(kitID) {
        var deff = $q.defer();
        selectLocalDB(
          tablesLocalDB.lists.tableName, {
            id: kitID
          },
          "parent_element_id, name, waste, amendment_pruning"
        ).then(function (result) {
          var data = angular.copy(result);
          if (data && data.length) {
            if (data[0].amendment_pruning) {
              data[0].amendment_pruning /= 1000;
            }
            deff.resolve(data[0]);
          } else {
            deff.resolve(0);
          }
        });
        return deff.promise;
      }

      function parseListContent(listId) {
        var defer = $q.defer(),
          lists = [],
          elemLists = [];
        if (angular.isArray(listId)) {
          lists = listId;
        } else {
          lists.push(listId);
        }
        (function nextRecord() {
          if (lists.length) {
            var firstKit = lists.shift(0),
              firstKitId = 0;
            if (typeof firstKit === "object") {
              firstKitId = firstKit.childId;
            } else {
              firstKitId = firstKit;
            }
            selectLocalDB(tablesLocalDB.list_contents.tableName, {
              parent_list_id: firstKitId
            }).then(function (result) {
              var resQty = result.length,
                i;
              if (resQty) {
                for (i = 0; i < resQty; i += 1) {
                  if (typeof firstKit === "object") {
                    result[i].parentId = firstKit.parentId;
                  }
                  elemLists.push(result[i]);
                  if (result[i].child_type === "list") {
                    var nextKit = {
                      childId: result[i].child_id,
                      parentId: result[i].id
                    };
                    lists.push(nextKit);
                  }
                }
              }
              nextRecord();
            });
          } else {
            if (elemLists.length) {
              elemLists.forEach(function (entry, index) {
                try {
                  //white lamination
                  if (
                    ProductStor.product.lamination.lamination_in_id === 1 &&
                    ProductStor.product.lamination.lamination_out_id === 1
                  ) {
                    if (
                      entry.lamination_type_id !== 0 &&
                      entry.lamination_type_id !== 4 &&
                      entry.lamination_type_id !== 5 &&
                      entry.lamination_type_id !== 6
                    ) {
                      elemLists.splice(index, 1);
                    }
                  }
                  //inner lamination
                  if (
                    ProductStor.product.lamination.lamination_in_id !== 1 &&
                    ProductStor.product.lamination.lamination_out_id === 1
                  ) {
                    if (
                      entry.lamination_type_id !== 0 &&
                      entry.lamination_type_id !== 1 &&
                      entry.lamination_type_id !== 5 &&
                      entry.lamination_type_id !== 8
                    ) {
                      elemLists.splice(index, 1);
                    }
                  }
                  //outer lamination
                  if (
                    ProductStor.product.lamination.lamination_in_id === 1 &&
                    ProductStor.product.lamination.lamination_out_id !== 1
                  ) {
                    if (
                      entry.lamination_type_id !== 0 &&
                      entry.lamination_type_id !== 2 &&
                      entry.lamination_type_id !== 6 &&
                      entry.lamination_type_id !== 7
                    ) {
                      elemLists.splice(index, 1);
                    }
                  }
                  //double-sided
                  if (
                    ProductStor.product.lamination.lamination_in_id !== 1 &&
                    ProductStor.product.lamination.lamination_out_id !== 1
                  ) {
                    if (
                      entry.lamination_type_id !== 0 &&
                      entry.lamination_type_id !== 3 &&
                      entry.lamination_type_id !== 7 &&
                      entry.lamination_type_id !== 8
                    ) {
                      elemLists.splice(index, 1);
                    }
                  }
                } catch (e) {
                  console.log(e.name);
                  console.log(e.message);
                }
              });
              defer.resolve(elemLists);
            } else {
              defer.resolve(0);
            }
          }
        })();
        return defer.promise;
      }

      function checkHardwareType(hardvares) {
        var newHardArr = [],
          types = [0, 1, 3, 4, 5, 8],
          typesQty = types.length,
          j,
          hardwareQty = hardvares.length,
          i;
        for (i = 0; i < hardwareQty; i += 1) {
          typeLoop: for (j = 0; j < typesQty; j += 1) {
            if (hardvares[i].lamination_type_id === types[j]) {
              newHardArr.push(hardvares[i]);
              break typeLoop;
            }
          }
        }
        console.log("newHardArr", newHardArr);

        return newHardArr;
      }

      function parseKitConsist(kits) {
        var deff = $q.defer(),
          promKits = _.map(kits, function (item, index, arr) {
            var deff1 = $q.defer();
            if (item) {
              if (angular.isArray(item)) {
                var promisElem = _.map(item, function (item2) {
                  var deff2 = $q.defer();
                  /** if hardware */
                  if (index === arr.length - 1) {
                    if (angular.isArray(item2)) {
                      var promisHW = _.map(item2, function (item3) {
                        var deff3 = $q.defer();
                        parseListContent(item3.child_id).then(function (result4) {
                          if (result4.length) {
                            //deff3.resolve(checkHardwareType(result4));
                            deff3.resolve(result4);
                          } else {
                            deff3.resolve(0);
                          }
                        });
                        return deff3.promise;
                      });
                      deff2.resolve($q.all(promisHW));
                    }
                  } else {
                    parseListContent(item2.id).then(function (result2) {
                      if (result2.length) {
                        deff2.resolve(result2);
                      } else {
                        deff2.resolve(0);
                      }
                    });
                  }
                  return deff2.promise;
                });
                $q.all(promisElem).then(function (result3) {
                  var resQty = result3.length,
                    collectArr = [],
                    i;
                  if (resQty) {
                    for (i = 0; i < resQty; i += 1) {
                      if (angular.isArray(result3[i])) {
                        collectArr.push(result3[i]);
                      } else {
                        if (result3[i][0]) {
                          collectArr.push(result3[i][0]);
                        } else {
                          collectArr.push(result3[i]);
                        }
                      }
                    }
                  }
                  if (collectArr.length) {
                    deff1.resolve(collectArr);
                  } else {
                    deff1.resolve(0);
                  }
                });
              } else {
                var itemId = 0;
                /** if hardware */
                if (index === arr.length - 1) {
                  itemId = item.child_id;
                } else {
                  itemId = item.id;
                }
                if (itemId) {
                  parseListContent(itemId).then(function (result1) {
                    if (result1.length) {
                      deff1.resolve(result1);
                    } else {
                      deff1.resolve(0);
                    }
                  });
                } else {
                  deff1.resolve(0);
                }
              }
            } else {
              deff1.resolve(0);
            }
            return deff1.promise;
          });
        deff.resolve($q.all(promKits));
        return deff.promise;
      }

      function getElementByListId(isArray, listID) {
        var deff = $q.defer();
        selectLocalDB(
          tablesLocalDB.elements.tableName, {
            id: listID
          },
          "id, sku, currency_id, price, name, element_group_id"
        ).then(function (result) {
          if (result.length) {
            if (isArray) {
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

      function elemValueD(obj) {
        return obj.getDate() < 10 ? "0" + obj.getDate() : obj.getDate();
      }

      function parseKitElement(kits) {
        var deff = $q.defer(),
          promisesKitElem = _.map(kits, function (item, index, arr) {
            var deff1 = $q.defer();
            if (item) {
              if (angular.isArray(item)) {
                var promisElem = _.map(item, function (item2) {
                  var deff2 = $q.defer();

                  /** if hardware */
                  if (index === arr.length - 1) {
                    if (angular.isArray(item2)) {
                      var promisHW = _.map(item2, function (item3) {
                        var deff3 = $q.defer();
                        if (item3.child_type === "element") {
                          deff3.resolve(getElementByListId(1, item3.child_id));
                        } else {
                          getKitByID(item3.child_id).then(function (data) {
                            angular.extend(item3, data);
                            deff3.resolve(
                              getElementByListId(1, data.parent_element_id)
                            );
                          });
                        }
                        return deff3.promise;
                      });
                      deff2.resolve($q.all(promisHW));
                    }
                  } else {
                    deff2.resolve(
                      getElementByListId(0, item2.parent_element_id)
                    );
                  }
                  return deff2.promise;
                });

                $q.all(promisElem).then(function (result2) {
                  var resQty = result2.length,
                    collectArr = [],
                    i;
                  if (resQty) {
                    /** if glass or beads */
                    if (index === 5 || index === 6) {
                      collectArr = result2;
                    } else {
                      for (i = 0; i < resQty; i += 1) {
                        if (result2[i]) {
                          if (angular.isArray(result2[i])) {
                            var innerArr = [],
                              innerQty = result2[i].length,
                              j;
                            //                          console.info(result2[i]);
                            for (j = 0; j < innerQty; j += 1) {
                              if (result2[i][j]) {
                                innerArr.push(result2[i][j][0]);
                              }
                            }
                            collectArr.push(innerArr);
                          } else {
                            collectArr.push(result2[i][0]);
                          }
                        }
                      }
                    }
                  }
                  if (collectArr.length) {
                    deff1.resolve(collectArr);
                  } else {
                    deff1.resolve(0);
                  }
                });
              } else {
                /** if hardware */
                if (index === arr.length - 1) {
                  if (item.child_type === "element") {
                    deff1.resolve(getElementByListId(0, item.child_id));
                  } else {
                    getKitByID(item.child_id).then(function (data) {
                      angular.extend(item, data);
                      deff1.resolve(
                        getElementByListId(0, data.parent_element_id)
                      );
                    });
                  }
                } else {
                  deff1.resolve(getElementByListId(0, item.parent_element_id));
                }
              }
            } else {
              deff1.resolve(0);
            }
            return deff1.promise;
          });
        deff.resolve($q.all(promisesKitElem));
        return deff.promise;
      }

      function parseConsistElem(consists) {
        var deff = $q.defer();
        if (consists.length) {
          var promConsist = _.map(consists, function (item) {
            var deff1 = $q.defer();
            if (item && item.length) {
              var promConsistElem = _.map(item, function (item2) {
                var deff2 = $q.defer();
                if (angular.isArray(item2)) {
                  var promConsistElem2 = _.map(item2, function (item3) {
                    var deff3 = $q.defer();
                    if (item3) {
                      if (angular.isArray(item3)) {
                        var promConsistElem3 = _.map(item3, function (item4) {
                          var deff4 = $q.defer();
                          if (item4) {
                            if (item4.child_type === "element") {
                              deff4.resolve(
                                getElementByListId(0, item4.child_id)
                              );
                            } else {
                              getKitByID(item4.child_id).then(function (data4) {
                                angular.extend(item4, data4);
                                deff4.resolve(
                                  getElementByListId(0, data4.parent_element_id)
                                );
                              });
                            }
                          } else {
                            deff4.resolve(0);
                          }
                          return deff4.promise;
                        });
                        deff3.resolve($q.all(promConsistElem3));
                      } else {
                        if (item3.child_type === "element") {
                          deff3.resolve(getElementByListId(0, item3.child_id));
                        } else {
                          getKitByID(item3.child_id).then(function (data) {
                            angular.extend(item3, data);
                            deff3.resolve(
                              getElementByListId(0, data.parent_element_id)
                            );
                          });
                        }
                      }
                    } else {
                      deff3.resolve(0);
                    }
                    return deff3.promise;
                  });
                  deff2.resolve($q.all(promConsistElem2));
                } else {
                  if (item2) {
                    if (item2.child_type === "element") {
                      deff2.resolve(getElementByListId(0, item2.child_id));
                    } else {
                      getKitByID(item2.child_id).then(function (data) {
                        angular.extend(item2, data);
                        deff2.resolve(
                          getElementByListId(0, data.parent_element_id)
                        );
                      });
                    }
                  } else {
                    deff2.resolve(0);
                  }
                }
                return deff2.promise;
              });
              deff1.resolve($q.all(promConsistElem));
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

      function elemValueM(obj) {
        return obj.getMonth() < 10 ? "0" + obj.getMonth() : obj.getMonth();
      }

      function currencyExgange(price, currencyElemId) {
        var currencyQty = GlobalStor.global.currencies.length,
          c,
          currIndex,
          elemIndex;
        if (currencyQty) {
          for (c = 0; c < currencyQty; c += 1) {
            if (
              GlobalStor.global.currencies[c].id ===
              UserStor.userInfo.currencyId
            ) {
              currIndex = c;
            }
            if (GlobalStor.global.currencies[c].id === currencyElemId) {
              elemIndex = c;
            }
          }
        }
        //console.warn('currencies+++++++', GlobalStor.global.currencies[currIndex], GlobalStor.global.currencies[elemIndex]);
        if (
          GlobalStor.global.currencies[currIndex] &&
          GlobalStor.global.currencies[elemIndex]
        ) {
          price *= GlobalStor.global.currencies[elemIndex].value;
        }
        return price;
      }

      function culcPriceAsSize(group,
        kits,
        kitsElem,
        sizes,
        sizeQty,
        priceObj,
        constrElements) {
        var priceTemp = 0,
          sizeTemp = 0,
          sizeLabelTemp = 0,
          qtyTemp = 1,
          constrElem = {},
          block,
          waste = kits.waste ? 1 + kits.waste / 100 : 1;

        //      console.info('culcPriceAsSize =====', group, kits, kitsElem, sizes);

        /** beads */
        if (group === 6) {
          for (block = 0; block < sizeQty; block += 1) {
            /** check beadId */
            if (sizes[block].elemId === kits.id) {
              var sizeBeadQty = sizes[block].sizes.length;
              while (--sizeBeadQty > -1) {
                constrElem = angular.copy(kitsElem);
                sizeTemp =
                  sizes[block].sizes[sizeBeadQty] + kits.amendment_pruning;
                priceTemp = sizeTemp * constrElem.price * waste;

                /** currency conversion */
                if (UserStor.userInfo.currencyId != constrElem.currency_id) {
                  priceTemp = currencyExgange(
                    priceTemp,
                    constrElem.currency_id
                  );
                }
                constrElem.qty = angular.copy(qtyTemp);
                constrElem.size = GeneralServ.roundingValue(sizeTemp, 3);
                constrElem.priceReal = GeneralServ.roundingValue(priceTemp, 3);
                priceObj.priceTotal += priceTemp;
                //              console.warn('finish bead-________',constrElem);
                constrElements.push(constrElem);
              }
            }
          }
        } else {
          for (var siz = 0; siz < sizeQty; siz += 1) {
            constrElem = angular.copy(kitsElem);
            /** glasses */
            if (group === 5) {
              var isExist = 0;
              /** check size by id of glass */
              if (sizes[siz].elemId === kits.id) {
                sizeTemp = sizes[siz].square;
                sizeLabelTemp =
                  GeneralServ.roundingValue(sizes[siz].square, 3) +
                  " " +
                  $filter("translate")("common_words.LETTER_M") +
                  "2 (" +
                  sizes[siz].sizes[0] +
                  " x " +
                  sizes[siz].sizes[1] +
                  ")";
                priceTemp = sizeTemp * constrElem.price * waste;
                isExist += 1;
              }
              /** hardware */
            } else if (group === 7) {
              var temp = angular.copy(priceObj);
              var storeSize = angular.copy(
                _.filter(_.compact(_.flatten(temp)), {
                  child_id: constrElem.id
                })
              );
              if (storeSize[0] && storeSize[0].length) {
                constrElem.size = angular.copy(storeSize[0].length / 1000);
                qtyTemp = kits.count;
                priceTemp =
                  qtyTemp * constrElem.price * waste * constrElem.size;
              } else {
                qtyTemp = kits.count;
                priceTemp = qtyTemp * constrElem.price * waste;
              }
            } else {
              sizeTemp = sizes[siz] + kits.amendment_pruning;
              priceTemp = sizeTemp * constrElem.price * waste;
            }

            if ((group === 5 && isExist) || group !== 5) {
              /** currency conversion */
              if (UserStor.userInfo.currencyId != constrElem.currency_id) {
                priceTemp = currencyExgange(priceTemp, constrElem.currency_id);
              }
              constrElem.qty = angular.copy(qtyTemp);
              if (
                constrElem.size <= 0 ||
                constrElem.size === undefined ||
                constrElem.size === null ||
                constrElem.size === NaN
              ) {
                constrElem.size = GeneralServ.roundingValue(sizeTemp, 3);
              }
              constrElem.sizeLabel = sizeLabelTemp;
              constrElem.priceReal = GeneralServ.roundingValue(priceTemp, 3);
              priceObj.priceTotal += priceTemp;
              constrElements.push(constrElem);
            }
          }
        }
      }

      function culcKitPrice(priceObj, sizes) {
        var kitElemQty = priceObj.kitsElem.length,
          sizeQty = 0,
          constrElements = [],
          ke;
        priceObj.priceTotal = 0;

        for (ke = 0; ke < kitElemQty; ke += 1) {
          if (priceObj.kitsElem[ke]) {
            sizeQty = sizes[ke].length;
            if (angular.isArray(priceObj.kitsElem[ke])) {
              //            console.info('culcKitPrice ===== array');
              var kitElemChildQty = priceObj.kitsElem[ke].length,
                child;
              for (child = 0; child < kitElemChildQty; child += 1) {
                /** hardware */
                if (angular.isArray(priceObj.kitsElem[ke][child])) {
                  //                console.info('culcKitPrice ===== hardware');
                  var kitElemChildQty2 = priceObj.kitsElem[ke][child].length,
                    child2;
                  for (child2 = 0; child2 < kitElemChildQty2; child2 += 1) {
                    culcPriceAsSize(
                      ke,
                      priceObj.kits[ke][child][child2],
                      priceObj.kitsElem[ke][child][child2],
                      sizes[ke][child],
                      1,
                      priceObj,
                      constrElements
                    );
                  }
                } else {
                  culcPriceAsSize(
                    ke,
                    priceObj.kits[ke][child],
                    priceObj.kitsElem[ke][child],
                    sizes[ke],
                    sizeQty,
                    priceObj,
                    constrElements
                  );
                }
              }
            } else {
              //            console.info('culcKitPrice ===== object');
              culcPriceAsSize(
                ke,
                priceObj.kits[ke],
                priceObj.kitsElem[ke],
                sizes[ke],
                sizeQty,
                priceObj,
                constrElements
              );
            }
          }
        }

        return constrElements;
      }

      function checkDirectionConsistElem(currConsist, openDir, openDirQty) {
        if (currConsist.direction_id == 1) {
          return 1;
        } else {
          var isExist = 0,
            d;
          for (d = 0; d < openDirQty; d += 1) {
            if (openDir[d] === currConsist.direction_id) {
              isExist += 1;
            }
          }
          return isExist;
        }
      }

      function getDecimal(num) {
        return num - Math.floor(num);
      }

      function getValueByRule(parentValue, childValue, rule) {
        //(rule === 2) ? console.info('rule++', parentValue, childValue, rule) : 0;
        var value = 0;
        switch (rule) {
          case 1:
          case 21: //---- less width of glass
          case 22: //---- less height of glass
            //------ меньше родителя на X (м)
            value = GeneralServ.roundingValue(parentValue - childValue, 3);
            break;
          case 2: //------ X шт. на родителя
            var parentValueTemp =
              getDecimal(parentValue) !== 0 ? 1 : parseInt(parentValue);
            value = parentValueTemp * childValue;
            break;
          case 5: //----- X шт. на 1 м2 родителя
            var parentValueTemp = parentValue < 1 ? 1 : parseInt(parentValue);
            value = parentValueTemp * childValue;
            break;
          case 3:
          case 12:
          case 14:
            //------ X шт. на метр родителя
            value = GeneralServ.roundingValue(
              Math.round(parentValue) * childValue,
              3
            );
            break;
          case 6:
          case 7:
          case 8:
          case 9:
          case 13:
          case 23: //------ кг на м
            value = GeneralServ.roundingValue(parentValue * childValue, 3);
            break;
          default:
            value = childValue;
            break;
        }
        //console.info('rule++value+++', value);
        return value;
      }

      function getValueByRuleGrid(parentValue, childValue, rule) {
        //console.info('rule++', parentValue, childValue, rule);
        var value = 0;
        switch (rule) {
          case 1:
            //------ меньше родителя на X (м)
            value = GeneralServ.roundingValue(parentValue - childValue, 3);
            break;
          case 2: //------ X шт. на родителя
            // var parentValueTemp = (parentValue < 1) ? 1 : parseInt(parentValue);
            // value = childValue;
            // break;
          case 5: //----- X шт. на 1 м2 родителя
            var parentValueTemp = parentValue < 1 ? 1 : parseInt(parentValue);
            value = parentValueTemp * childValue;
            break;
          case 3:
            //------ X шт. на метр родителя
            value = parentValue;
            break;
          default:
            value = childValue;
            break;
        }
        //console.info('rule++value+++', value);
        return value;
      }

      function culcPriceAsRule(parentValue,
        currSize,
        currConsist,
        currConsistElem,
        pruning,
        wasteValue,
        priceObj,
        sizeLabel) {
        if (currConsistElem) {
          var objTmp = angular.copy(currConsistElem),
            priceReal = 0,
            sizeReal = 0,
            roundVal = 0,
            qtyReal = 1,
            tempS = 0,
            x = 1.2;
          //console.log(currConsist, 'currConsist')
          //console.log(currConsistElem, 'currConsistElem')
          //console.log('id: ' + currConsist.id + '///' + currConsistElem.id);
          //console.log('Название: ' + currConsistElem.name);
          //console.log('Цена: ' + currConsistElem.price);
          //console.log('% отхода : ' + wasteValue);
          //console.log('Поправка на обрезку : ' + pruning);
          //console.log('Размер: ' + currSize + ' m');
          //console.log('parentValue: ' + parentValue);
          //console.log('Тип округления: ' + currConsist.rounding_type);
          //console.log('Величина округления: ' + currConsist.rounding_value);

          /** if glass */
          if (objTmp.element_group_id === 9) {
            sizeReal = currSize;
          }

          switch (currConsist.rules_type_id) {
            case 1:
            case 21:
            case 22:
              sizeReal = GeneralServ.roundingValue(currSize + pruning - currConsist.value, 3);
              //console.log('Правило 1: меньше родителя на ', currSize, ' + ', pruning, ' - ', currConsist.value, ' = ', (currSize + pruning - currConsist.value), sizeReal);
              break;

            case 3:
              //qtyReal = Math.round(currSize + pruning) * currConsist.value;
              qtyReal = (currSize + pruning) * currConsist.value;
              //console.log('Правило 3 : (', currSize, ' + ', pruning, ') *', currConsist.value, ' = ', qtyReal, ' шт. на метр родителя');
              break;
            case 5:
              //var sizeTemp = ((currSize + pruning) < 1) ? 1 : parseInt(currSize + pruning);
              //qtyReal = sizeTemp * currConsist.value;
              qtyReal = currConsist.value;
              //console.log('Правило 5 : (', sizeTemp, ') *', currConsist.value, ' = ', qtyReal, ' шт. на 1 метр2 родителя');
              //console.log('Правило 5 : (', currConsist.value, ') = ', qtyReal, ' шт. на 1 метр2 родителя');
              break;
            case 6:
            case 23:
              //qtyReal = GeneralServ.roundingNumbers((currSize + pruning) * currConsist.value, 3);
              qtyReal = (currSize + pruning) * currConsist.value;
              //console.log('Правило 23 : (', currSize, ' + ', pruning, ') *', currConsist.value, ' = ', (currSize + pruning) * currConsist.value, qtyReal, ' kg. на метр родителя');
              break;
            case 24:
              // sizeReal = 0;
              qtyReal = parentValue * currConsist.value;
              //кг на родителя
              break;
            case 2:
            case 4:
            case 15:
              qtyReal = parentValue * currConsist.value;
              //console.log('Правило 2: ',  parentValue, ' * ', currConsist.value, ' = ', qtyReal, ' шт. на родителя');
              break;
            default:
              sizeReal = GeneralServ.roundingValue(currSize + pruning, 3);
              //console.log('Правило else:', currSize, ' + ', pruning, ' = ', (currSize + pruning), sizeReal);
              break;
          }

          if (sizeReal) {
            roundVal = angular.copy(sizeReal);
            tempS = angular.copy(roundVal);
          } else {
            roundVal = angular.copy(qtyReal);
            tempS = angular.copy(roundVal);
          }
          if (currConsist.rounding_type > 0 && currConsist.rounding_value > 0) {
            switch (currConsist.rounding_type) {
              case 1:
                roundVal =
                  Math.ceil(tempS / currConsist.rounding_value) *
                  currConsist.rounding_value;
                //console.log('Кратно заданному числу в большую сторону', 'результат=', roundVal, 'исходное значение=', tempS, 'кратное число', currConsist.rounding_value);
                break;
              case 2:
                roundVal =
                  Math.floor(tempS / currConsist.rounding_value) *
                  currConsist.rounding_value;
                //console.log('Кратно заданному числу в меньшую сторону');
                break;
              case 3:
                roundVal =
                  Math.round(tempS / currConsist.rounding_value) *
                  currConsist.rounding_value;
                //console.log('Кратно заданному числу согластно математическим правилам');
                break;
            }
          }

          if (sizeReal) {
            sizeReal = angular.copy(roundVal);
            priceReal = sizeReal * qtyReal * currConsistElem.price * wasteValue;
          } else {
            qtyReal = angular.copy(roundVal);
            priceReal = qtyReal * currConsistElem.price * wasteValue;
          }
          /** currency conversion */
          if (UserStor.userInfo.currencyId !== currConsistElem.currency_id) {
            priceReal = currencyExgange(priceReal, currConsistElem.currency_id);
          }
          //console.info('@@@@@@@@@@@@', objTmp, objTmp.priceReal, priceReal);
          //objTmp.priceReal = GeneralServ.roundingNumbers(priceReal, 3);
          //objTmp.qty = GeneralServ.roundingNumbers(qtyReal, 3);

          // objTmp.priceReal = getLockalDbData(objTmp, priceReal);

          objTmp.priceReal = priceReal;

          objTmp.size = GeneralServ.roundingValue(sizeReal, 3);
          objTmp.sizeLabel = sizeLabel;
          objTmp.qty = qtyReal;
          //console.warn('finish -------------- priceTmp', objTmp.priceReal, objTmp);
          priceObj.constrElements.push(objTmp);
          priceObj.priceTotal += objTmp.priceReal;
        }
      }

      function prepareConsistElemPrice(group,
        currConstrSize,
        mainKit,
        currConsist,
        currConsistElem,
        consistArr,
        priceObj) {
        //console.info('1-----', group);
        //console.info('2-----', currConsist, currConsistElem);
        //console.info('3-----', currConstrSize, mainKit);
        if (currConsist.parent_list_id === mainKit.id) {
          var fullSize = 1,
            currSize = 1,
            sizeLabel = 0,
            wasteValue = mainKit.waste ? 1 + mainKit.waste / 100 : 1;
          /** if glasses */
          if (group === 5) {
            if (currConsist.rules_type_id === 5) {
              fullSize = currConstrSize.square;
              currSize = currConstrSize.square;
              sizeLabel =
                GeneralServ.roundingValue(currConstrSize.square, 3) +
                " " +
                $filter("translate")("common_words.LETTER_M") +
                "2 (" +
                currConstrSize.sizes[0] +
                " x " +
                currConstrSize.sizes[1] +
                ")";
            } else if (currConsist.rules_type_id === 21) {
              fullSize = currConstrSize.sizes[0];
              currSize = currConstrSize.sizes[0];
            } else if (currConsist.rules_type_id === 22) {
              fullSize = currConstrSize.sizes[1];
              currSize = currConstrSize.sizes[1];
            } else {
              currSize = currConstrSize.square;
            }
          } else {
            fullSize = GeneralServ.roundingValue(
              currConstrSize + mainKit.amendment_pruning,
              3
            );
            currSize = currConstrSize;
          }
          if (currConsist.child_type === "list") {
            currConsist.newValue = getValueByRule(
              fullSize,
              currConsist.value,
              currConsist.rules_type_id
            );
          }
          culcPriceAsRule(
            1,
            currSize,
            currConsist,
            currConsistElem,
            mainKit.amendment_pruning,
            wasteValue,
            priceObj,
            sizeLabel
          );
        } else {
          var consistQty = consistArr.length,
            el;
          for (el = 0; el < consistQty; el += 1) {
            if (
              currConsist.parent_list_id === consistArr[el].child_id &&
              currConsist.parentId === consistArr[el].id
            ) {
              var wasteValue = consistArr[el].waste ?
                1 + consistArr[el].waste / 100 :
                1,
                newValue = 1;
              if (currConsist.child_type === "list") {
                //console.log(consistArr[el], currConsist, currConsist, 'fix1')
                currConsist.newValue = getValueByRule(
                  1,
                  currConsist.value,
                  currConsist.rules_type_id
                );
              }
              if (consistArr[el].rules_type_id === 2) {
                if (
                  currConsist.rules_type_id === 2 ||
                  currConsist.rules_type_id === 4 ||
                  currConsist.rules_type_id === 15
                ) {
                  newValue = consistArr[el].newValue;
                }
              }
              culcPriceAsRule(
                newValue,
                consistArr[el].newValue,
                currConsist,
                currConsistElem,
                consistArr[el].amendment_pruning,
                wasteValue,
                priceObj
              );
            }
          }
        }
      }

      function culcPriceConsistElem(group,
        currConsist,
        currConsistElem,
        currConstrSize,
        mainKit,
        priceObj) {
        /** if hardware */
        if (group === priceObj.consist.length - 1) {
          //console.warn('-------hardware------- currConsist', currConsist);
          //console.warn('-------hardware------- currConsistElem', currConsistElem);
          //console.warn('-------hardware------- mainKit', mainKit);
          //console.warn('-------hardware------- currConstrSize', currConstrSize);
          if (angular.isArray(currConsistElem)) {
            var hwElemQty = currConsistElem.length,
              openDirQty = currConstrSize.openDir.length,
              hwInd;
            for (hwInd = 0; hwInd < hwElemQty; hwInd += 1) {
              if (angular.isArray(currConsistElem[hwInd])) {
                var hwElemQty2 = currConsistElem[hwInd].length,
                  hwInd2;
                hwElemLoop: for (hwInd2 = 0; hwInd2 < hwElemQty2; hwInd2 += 1) {
                  //------ check direction
                  if (
                    checkDirectionConsistElem(
                      currConsist[hwInd][hwInd2],
                      currConstrSize.openDir,
                      openDirQty
                    )
                  ) {
                    //                  console.warn('-------hardware----2--- currConsist', currConsist[hwInd][hwInd2]);
                    //                  console.warn('-------hardware----2--- currConsistElem', currConsistElem[hwInd][hwInd2]);

                    var objTmp = angular.copy(currConsistElem[hwInd][hwInd2]),
                      priceReal = 0,
                      wasteValue = 1;

                    if (
                      currConsist[hwInd][hwInd2].parent_list_id ===
                      mainKit[hwInd].child_id
                    ) {
                      //                    console.warn('-------hardware----2--- mainKit', mainKit[hwInd]);
                      wasteValue = mainKit[hwInd].waste ?
                        1 + mainKit[hwInd].waste / 100 :
                        1;
                      objTmp.qty = getValueByRule(
                        mainKit[hwInd].count,
                        currConsist[hwInd][hwInd2].value,
                        currConsist[hwInd][hwInd2].rules_type_id
                      );
                      if (currConsist[hwInd][hwInd2].child_type === "list") {
                        currConsist[hwInd][hwInd2].newValue = angular.copy(
                          objTmp.qty
                        );
                      }
                    } else {
                      for (var el = 0; el < hwElemQty2; el += 1) {
                        if (
                          currConsist[hwInd][hwInd2].parent_list_id ===
                          currConsist[hwInd][el].child_id &&
                          currConsist[hwInd][hwInd2].parentId ===
                          currConsist[hwInd][el].id
                        ) {
                          //                        console.warn('-------hardware------- parent list', currConsist[hwInd][el]);
                          if (!checkDirectionConsistElem(
                              currConsist[hwInd][el],
                              currConstrSize.openDir,
                              openDirQty
                            )) {
                            continue hwElemLoop;
                          }
                          wasteValue = currConsist[hwInd][el].waste ?
                            1 + currConsist[hwInd][el].waste / 100 :
                            1;
                          objTmp.qty = getValueByRule(
                            currConsist[hwInd][el].newValue,
                            currConsist[hwInd][hwInd2].value,
                            currConsist[hwInd][hwInd2].rules_type_id
                          );
                          if (
                            currConsist[hwInd][hwInd2].child_type === "list"
                          ) {
                            currConsist[hwInd][hwInd2].newValue = angular.copy(
                              objTmp.qty
                            );
                          }
                        }
                      }
                    }

                    priceReal =
                      objTmp.qty *
                      currConsistElem[hwInd][hwInd2].price *
                      wasteValue;
                    //console.log('++++++', priceReal, objTmp.qty, currConsistElem[hwInd][hwInd2].price, wasteValue);
                    if (priceReal) {
                      /** currency conversion */
                      if (UserStor.userInfo.currencyId != currConsistElem[hwInd][hwInd2].currency_id) {
                        priceReal = currencyExgange(
                          priceReal,
                          currConsistElem[hwInd][hwInd2].currency_id
                        );
                      }
                      objTmp.priceReal = GeneralServ.roundingValue(
                        priceReal,
                        3
                      );

                      objTmp.size = 0;
                      //                    console.info('finish -------priceObj------- ', priceObj);
                      //                    console.info('finish -------hardware------- ', priceObj.priceTotal, ' + ', objTmp.priceReal);
                      priceObj.constrElements.push(objTmp);
                      priceObj.priceTotal += objTmp.priceReal;
                    }
                  }
                }
              }
            }
          }
        } else {
          //        console.log('nooo hardware');
          if (angular.isArray(currConsistElem)) {
            //console.log('array');
            //console.info('1-----', group);
            //console.info('2-----', currConstrSize);
            //console.info('3-----', mainKit);
            var elemQty = currConsistElem.length,
              elemInd;
            for (elemInd = 0; elemInd < elemQty; elemInd += 1) {
              //            console.info('4-----', currConsist[elemInd], currConsistElem[elemInd]);

              /** if beads */
              if (group === 6) {
                var sizeQty = currConstrSize.sizes.length;
                while (--sizeQty > -1) {
                  //                console.info('bead size-----', currConstrSize.sizes[sizeQty]);
                  prepareConsistElemPrice(
                    group,
                    currConstrSize.sizes[sizeQty],
                    mainKit,
                    currConsist[elemInd],
                    currConsistElem[elemInd],
                    currConsist,
                    priceObj
                  );
                }
              } else {
                prepareConsistElemPrice(
                  group,
                  currConstrSize,
                  mainKit,
                  currConsist[elemInd],
                  currConsistElem[elemInd],
                  currConsist,
                  priceObj
                );
              }
            }
          } else {
            //          console.log('object');
            /** if beads */
            if (group === 6) {
              var sizeQty = currConstrSize.sizes.length;
              while (--sizeQty > -1) {
                prepareConsistElemPrice(
                  group,
                  currConstrSize.sizes[sizeQty],
                  mainKit,
                  currConsist,
                  currConsistElem,
                  priceObj.consist[group],
                  priceObj
                );
              }
            } else {
              prepareConsistElemPrice(
                group,
                currConstrSize,
                mainKit,
                currConsist,
                currConsistElem,
                priceObj.consist[group],
                priceObj
              );
            }
          }
        }
      }

      function elemValueY(obj) {
        return obj.getFullYear();
      }

      function culcConsistPrice(priceObj, construction) {
        var groupQty = priceObj.consist.length,
          group;

        for (group = 0; group < groupQty; group += 1) {
          if (priceObj.consist[group]) {
            //console.log('         ');
            //console.log('Group  ---------------------', group);
            var sizeQty = construction.sizes[group].length,
              consistQty = priceObj.consist[group].length;

            if (consistQty) {
              if (angular.isArray(priceObj.kits[group])) {
                //              console.info('culcConsistPrice ===== array');
                //                console.info('1-----', group);
                //                console.info('2-----', construction.sizes[group]);
                //                console.info('3-----', priceObj.kits[group]);
                //                console.info('4-----', priceObj.consist[group]);
                //                console.info('5-----', priceObj.consistElem[group]);

                for (var elem = 0; elem < consistQty; elem += 1) {
                  /** if glass or beads */
                  if (group === 5 || group === 6) {
                    var sizeObjQty = construction.sizes[group].length;
                    for (var s = 0; s < sizeObjQty; s += 1) {
                      if (
                        construction.sizes[group][s].elemId ===
                        priceObj.kits[group][elem].id
                      ) {
                        if (priceObj.consistElem[group][elem]) {
                          culcPriceConsistElem(
                            group,
                            priceObj.consist[group][elem],
                            priceObj.consistElem[group][elem],
                            construction.sizes[group][s],
                            priceObj.kits[group][elem],
                            priceObj
                          );
                        }
                      }
                    }
                  } else {
                    if (priceObj.consistElem[group][elem]) {
                      culcPriceConsistElem(
                        group,
                        priceObj.consist[group][elem],
                        priceObj.consistElem[group][elem],
                        construction.sizes[group][elem],
                        priceObj.kits[group][elem],
                        priceObj
                      );
                    }
                  }
                }
              } else {
                //              console.info('culcConsistPrice ===== object');
                for (var s = 0; s < sizeQty; s += 1) {
                  for (var elem = 0; elem < consistQty; elem += 1) {
                    if (priceObj.consistElem[group][elem]) {
                      culcPriceConsistElem(
                        group,
                        priceObj.consist[group][elem],
                        priceObj.consistElem[group][elem],
                        construction.sizes[group][s],
                        priceObj.kits[group],
                        priceObj
                      );
                    }
                  }
                }
              }
            }
          }
          //console.log('Group - конец ---------------------');
        }
      }

      /** CONSTRUCTION PRICE **/

      function calculationPrice(construction) {
        var deffMain = $q.defer(),
          priceObj = {},
          finishPriceObj = {};
        var tmp = 0;
        var temp_profile_id = 0;
        GlobalStor.global.screw = 0;
        if (!ProductStor.product.hardware.id &&
              ProductStor.product.lamination.img_in_id === 1 &&
              ProductStor.product.lamination.img_out_id ===  1) {
          if (ProductStor.product.profile.id === 345 || ProductStor.product.profile.id === 527) {
            temp_profile_id = 416611;
          }
          if (ProductStor.product.profile.id === 25 ||
            ProductStor.product.profile.id === 528 ||
            ProductStor.product.profile.id === 26 ||
            ProductStor.product.profile.id === 529 ||
            ProductStor.product.profile.id === 561) {
            temp_profile_id = 416727;
          }
          if (ProductStor.product.profile.id === 532 ||
            ProductStor.product.profile.id === 533 ||
            ProductStor.product.profile.id === 534 ||
            ProductStor.product.profile.id === 535 ) {
            temp_profile_id = 416728;
          }

          if (temp_profile_id) {
            if (ProductStor.product.template_square >= 1) {
              selectLocalDB(
                tablesLocalDB.elements.tableName, {
                  id: temp_profile_id
                }
              ).then(function (result) {
                if (result && result.length) {
                  tmp = result;
                  tmp[0].qty = 1;
                  if (ProductStor.product.template_square >= 1 && ProductStor.product.template_square < 2) {
                    tmp[0].qty = 0.5;
                  }
                  if (ProductStor.product.template_square >= 2 && ProductStor.product.template_square < 3) {
                    tmp[0].qty = 0.75;
                  }
                  if (ProductStor.product.template_square >= 3 && ProductStor.product.template_square < 4) {
                    tmp[0].qty = 1;
                  }
                  if (ProductStor.product.template_square >= 4 && ProductStor.product.template_square < 5) {
                    tmp[0].qty = 1.25;
                  }
                  if (ProductStor.product.template_square >= 5) {
                    tmp[0].qty = 1.5;
                  }
                  tmp[0].size = 0;
                  tmp[0].sizeLabel = 0;
                  tmp[0].priceReal = currencyExgange(
                    tmp[0].price,
                    tmp[0].currency_id
                  ) * tmp[0].qty;
                  GlobalStor.global.screw = tmp[0].priceReal;
                }
              });
            }
          }
        }
        // console.info('START+++', construction);
        // console.time("parseMainKit");
        parseMainKit(construction).then(function (kits) {
          // console.timeEnd("parseMainKit");
          // console.log('kits!!!!!!+', kits);
          // console.warn(_.where(_.compact(_.flatten(kits)), {child_id:314270}), 'kits');
          priceObj.kits = kits;
          /** collect Kit Children Elements*/
          // console.time("parseKitConsist");
          parseKitConsist(priceObj.kits).then(function (consist) {
            // console.timeEnd("parseKitConsist");
            // console.log('consist!!!!!!+', consist);
            // console.warn(_.where(_.compact(_.flatten(consist)), {id:314270}), 'consist');
            priceObj.consist = consist;
            // console.time("parseKitElement");
            parseKitElement(priceObj.kits).then(function (kitsElem) {
              // console.timeEnd("parseKitElement");
              // console.log('kitsElem!!!!!!+', kitsElem);
              // console.warn(_.where(_.compact(_.flatten(kitsElem)), {child_id:314270}), 'kitsElem');
              priceObj.kitsElem = kitsElem;
              // console.time("parseConsistElem");
              parseConsistElem(priceObj.consist).then(function (consistElem) {
                // console.timeEnd("parseConsistElem");
                // console.log('consistElem!!!!!!+', consistElem);
                // console.warn(_.where(_.compact(_.flatten(kitsElem)), {child_id:314270}), 'consistElem');
                priceObj.consistElem = consistElem;
                priceObj.constrElements = culcKitPrice(
                  priceObj,
                  construction.sizes
                );
                if (!ProductStor.product.hardware.id) {
                  if (temp_profile_id) {
                    if (ProductStor.product.template_square >= 1) {
                      if (tmp[0]) {
                        priceObj.constrElements.push(tmp[0]);
                      }
                    }
                  }
                }
                // console.log(priceObj, construction);
                culcConsistPrice(priceObj, construction);
                priceObj.priceTotal = GeneralServ.roundingValue(
                  priceObj.priceTotal
                );
                //console.info('FINISH====:', priceObj);
                finishPriceObj.constrElements = angular.copy(
                  priceObj.constrElements
                );
                finishPriceObj.priceTotal = isNaN(priceObj.priceTotal) ?
                  0 :
                  angular.copy(priceObj.priceTotal);
                deffMain.resolve(finishPriceObj);
              });
            });
          });
        });
        return deffMain.promise;
      }

      /**========= DOOR PRICE ==========*/

      function getDoorElem(container, elem, kit) {
        var elemObj = angular.copy(elem);
        /** currency conversion */
        if (UserStor.userInfo.currencyId != elemObj.currency_id) {
          elemObj.price = GeneralServ.roundingValue(
            currencyExgange(elemObj.price, elemObj.currency_id),
            3
          );
        }
        if (elem.count) {
          elemObj.qty = elem.count;
        } else {
          elemObj.qty = kit ? kit.value : 1;
        }
        elemObj.size = 0;
        elemObj.priceReal = GeneralServ.roundingValue(
          elemObj.price * elemObj.qty,
          3
        );
        container.priceTot += elemObj.priceReal;
        container.elements.push(elemObj);
      }

      function calcDoorElemPrice(handleSource, lockSource) {
        var deffMain = $q.defer(),
          priceObj = {
            priceTot: 0,
            elements: []
          };
        var list = lockSource.filter(function (list) {
          list.child_id = list.parent_element_id;
          list.child_type = list.position;
          list.value = list.count;
          return list.position === "list";
        });
        var elements = lockSource.filter(function (element) {
          element.child_id = element.parent_element_id;
          element.child_type = element.position;
          element.value = element.count;
          return element.position === "element";
        });

        getElementByListId(0, handleSource.parent_element_id).then(function (handleData) {
          //console.info('price handle kit', handleData);
          handleData.count = handleSource.count;
          getDoorElem(priceObj, handleData);
          (function nextRecord() {
            if (list.length) {
              var firstKit = list.shift(0),
                firstKitId = 0;
              firstKitId = firstKit;
              var kit = {};
              var roundVal = null;
              selectLocalDB(tablesLocalDB.lists.tableName, {
                id: firstKitId.parent_element_id
              }).then(function (result) {
                var listArr = [];
                //var pruning = result[0].amendment_pruning;
                parseListContent(firstKitId.parent_element_id).then(function (result2) {
                  if (result2 !== 0) {
                    listArr = angular.copy(result2);
                    for (var x = 0; x < listArr.length; x += 1) {
                      listArr[x].parent_element_id = listArr[x].child_id;
                    }
                    listArr = listArr.filter(function (item) {
                      if (
                        item.direction_id == 1 ||
                        item.direction_id == firstKitId.openDir
                      ) {
                        return item;
                      }
                    });
                  }
                  result = result.concat(listArr);

                  var element = result;
                  async.eachSeries(element, calculate, function (err, result) {
                    nextRecord();
                  });

                  function calculate(element, _cb) {
                    async.waterfall(
                      [
                        function (_callback) {
                          if (element.child_type === "list") {
                            list.push(element);
                            _callback();
                          } else {
                            getElementByListId(
                              0,
                              element.parent_element_id
                            ).then(function (resultElem) {
                              if (firstKitId.count) {
                                if (element.value) {
                                  kit.value = firstKitId.count * element.value;
                                } else {
                                  kit.value = firstKitId.count;
                                }
                              } else {
                                if (element.value) {
                                  kit.value = firstKitId.value * element.value;
                                } else {
                                  kit.value = firstKitId.value;
                                }
                              }
                              roundVal = angular.copy(kit.value);

                              // switch (element.rules_type_id) {
                              //   case 1:
                              //   case 21:
                              //   case 22:
                              //     roundVal = GeneralServ.roundingValue((firstKitId.count + pruning - element.value), 3);
                              //     console.log('Правило 1: меньше родителя на ', firstKitId.count, ' + ', pruning, ' - ', element.value, ' = ', (firstKitId.count + pruning - element.value), firstKitId.count);
                              //     break;
                              //   case 3:
                              //     roundVal = (firstKitId.count + pruning) * element.value;
                              //     console.log('Правило 3 : (', firstKitId.count, ' + ', pruning, ') *', element.value, ' = ', firstKitId.count, ' шт. на метр родителя');
                              //     break;
                              //   case 5:
                              //     roundVal = element.value;
                              //     console.log('Правило 5 : (', element.value, ') = ', firstKitId.count, ' шт. на 1 метр2 родителя');
                              //     break;
                              //   case 6:
                              //   case 23:
                              //     roundVal = (firstKitId.count + pruning) * element.value;
                              //     console.log('Правило 23 : (', firstKitId.count, ' + ', pruning, ') *', element.value, ' = ', (firstKitId.count + pruning) * element.value, firstKitId.count, ' kg. на метр родителя');
                              //     break;
                              //   case 2:
                              //   case 4:
                              //   case 15:
                              //     roundVal = firstKitId.count * element.value;
                              //     console.log('Правило 2: ',  firstKitId.count, ' * ', element.value, ' = ', firstKitId.count * element.value, ' шт. на родителя');
                              //     break;
                              //   default:
                              //     roundVal = GeneralServ.roundingValue((firstKitId.count + pruning), 3);
                              //     console.log('Правило else:', firstKitId.count, ' + ', pruning, ' = ', (firstKitId.count + pruning), firstKitId.count);
                              //     break;
                              // }

                              switch (element.rounding_type) {
                                case 1:
                                  kit.value =
                                    Math.ceil(
                                      roundVal / element.rounding_value
                                    ) * element.rounding_value;
                                  //console.log('Кратно заданному числу в большую сторону', 'результат=', roundVal, 'исходное значение=', roundVal, 'кратное число', element.rounding_value);
                                  break;
                                case 2:
                                  kit.value =
                                    Math.floor(
                                      roundVal / element.rounding_value
                                    ) * element.rounding_value;
                                  //console.log('Кратно заданному числу в меньшую сторону');
                                  break;
                                case 3:
                                  kit.value =
                                    Math.round(
                                      roundVal / element.rounding_value
                                    ) * element.rounding_value;
                                  //console.log('Кратно заданному числу согластно математическим правилам');
                                  break;
                              }

                              getDoorElem(priceObj, resultElem, kit);
                              _callback();
                            });
                          }
                        }
                      ],
                      function (err, result) {
                        if (err) {
                          return _cb(err);
                        }
                        _cb(null);
                      }
                    );
                  }
                });
              });
            } else {
              priceObj.consist = elements;
              parseConsistElem([priceObj.consist]).then(function (consistElem) {
                //console.warn('consistElem!!!!!!+', consistElem);
                priceObj.consistElem = consistElem[0];
                var elemsQty = priceObj.consist.length;
                while (--elemsQty > -1) {
                  getDoorElem(
                    priceObj,
                    priceObj.consistElem[elemsQty],
                    priceObj.consist[elemsQty]
                  );
                }
                priceObj.priceTot = isNaN(priceObj.priceTot) ?
                  0 :
                  GeneralServ.roundingValue(priceObj.priceTot);
                //console.warn('!!!!!!+', priceObj);
                deffMain.resolve(priceObj);
              });
            }
          })();
        });

        return deffMain.promise;
      }


      /**========= ADDELEMENT PRICE ==========*/

      function getAdditionalPrice(AddElement) {
        if (AddElement.elementWidth === 0 && AddElement.elementHeight === 0) {
          AddElement.elementWidth = 1;
        }
        var deffMain = $q.defer(),
          finishPriceObj = {},
          priceObj = {
            constrElements: [],
            priceTotal: 0
          };
        //console.info('START+++', AddElement);
        /** collect Kit Children Elements*/
        parseListContent(angular.copy(AddElement.elementId)).then(function (result) {
          //console.warn('consist!!!!!!+', result);
          priceObj.consist = angular.copy(result);

          /** parse Kit */
          getKitByID(AddElement.elementId).then(function (kits) {
            if (kits) {
              priceObj.kits = angular.copy(kits);
              //console.warn('kits!!!!!!+', kits);
              /** parse Kit Element */
              getElementByListId(
                0,
                priceObj.kits.parent_element_id
              ).then(function (kitsElem) {
                priceObj.kitsElem = angular.copy(kitsElem);
                //console.warn('kitsElem!!!!!!+', kitsElem);
                parseConsistElem([priceObj.consist]).then(function (consist) {
                  //console.warn('consistElem!!!!!!+', consist[0]);
                  priceObj.consistElem = angular.copy(consist[0]);
                  if (AddElement.elementWidth > 0) {
                    /** culc Kit Price */

                    var sizeSource = 0,
                      sizeTemp = 0;
                    //------ if height is existed
                    if (AddElement.elementHeight) {
                      sizeSource = GeneralServ.roundingValue(
                        AddElement.elementWidth * AddElement.elementHeight,
                        3
                      );
                      sizeTemp = GeneralServ.roundingValue(
                        (AddElement.elementWidth +
                          priceObj.kits.amendment_pruning) *
                        (AddElement.elementHeight +
                          priceObj.kits.amendment_pruning),
                        3
                      );
                    } else {
                      sizeSource = AddElement.elementWidth;
                      sizeTemp =
                        AddElement.elementWidth +
                        priceObj.kits.amendment_pruning;
                    }
                    var wasteValue = priceObj.kits.waste ?
                      1 + priceObj.kits.waste / 100 :
                      1,
                      constrElem = angular.copy(priceObj.kitsElem),
                      priceTemp = GeneralServ.roundingValue(
                        sizeTemp * constrElem.price * wasteValue
                      );

                    //console.warn('!!!!!!+', sizeSource, sizeTemp);
                    /** currency conversion */
                    if (
                      UserStor.userInfo.currencyId != constrElem.currency_id
                    ) {
                      priceTemp = currencyExgange(
                        priceTemp,
                        constrElem.currency_id
                      );
                    }
                    constrElem.qty = 1;
                    constrElem.size = sizeTemp;
                    constrElem.priceReal = priceTemp;
                    priceObj.priceTotal += priceTemp;
                    priceObj.constrElements.push(constrElem);
                    //console.warn('constrElem!!!!!!+', constrElem);

                    /** culc Consist Price */

                    if (priceObj.consistElem) {
                      var consistQty = priceObj.consist.length;
                      if (consistQty) {
                        for (var cons = 0; cons < consistQty; cons++) {
                          //                          console.warn('child++++', priceObj.consist[cons]);
                          if (priceObj.consist[cons]) {
                            if (
                              priceObj.consist[cons].parent_list_id ===
                              AddElement.elementId
                            ) {
                              if (
                                priceObj.consist[cons].child_type === "list"
                              ) {
                                priceObj.consist[
                                  cons
                                ].newValue = getValueByRule(
                                  sizeTemp,
                                  priceObj.consist[cons].value,
                                  priceObj.consist[cons].rules_type_id
                                );
                              }
                              culcPriceAsRule(
                                1,
                                sizeSource,
                                priceObj.consist[cons],
                                priceObj.consistElem[cons],
                                priceObj.kits.amendment_pruning,
                                wasteValue,
                                priceObj
                              );
                            } else {
                              for (var el = 0; el < consistQty; el++) {
                                if (
                                  priceObj.consist[cons].parent_list_id ===
                                  priceObj.consist[el].child_id &&
                                  priceObj.consist[cons].parentId ===
                                  priceObj.consist[el].id
                                ) {
                                  //                                  console.warn('parent++++', priceObj.consist[el]);
                                  wasteValue = priceObj.consist[el].waste ?
                                    1 + priceObj.consist[el].waste / 100 :
                                    1;
                                  if (
                                    priceObj.consist[cons].child_type === "list"
                                  ) {
                                    priceObj.consist[
                                      cons
                                    ].newValue = getValueByRule(
                                      priceObj.consist[el].newValue,
                                      priceObj.consist[cons].value,
                                      priceObj.consist[cons].rules_type_id
                                    );
                                  }
                                  culcPriceAsRule(
                                    priceObj.consist[cons].newValue,
                                    priceObj.consist[el].newValue,
                                    priceObj.consist[cons],
                                    priceObj.consistElem[cons],
                                    priceObj.consist[el].amendment_pruning,
                                    wasteValue,
                                    priceObj
                                  );
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  priceObj.priceTotal = GeneralServ.roundingValue(
                    priceObj.priceTotal
                  );
                  //console.info('FINISH ADD ====:', priceObj);
                  finishPriceObj.constrElements = angular.copy(
                    priceObj.constrElements
                  );
                  finishPriceObj.priceTotal = angular.copy(priceObj.priceTotal);
                  deffMain.resolve(finishPriceObj);
                });
              });
            } else {
              deffMain.resolve(priceObj);
            }
          });
        });
        return deffMain.promise;
      }

      /**========= GRID PRICE ==========*/

      function calculationGridPrice(AddElement) {
        var deffMain = $q.defer(),
          grid = angular.copy(AddElement.element),
          finishPriceObj = {},
          priceObj = {
            constrElements: [],
            priceTotal: 0
          };
        grid.element_width /= 1000;
        grid.element_height /= 1000;
        //console.info('START+++', AddElement, grid);

        /** parse Kit */
        $q
          .all([getKitByID(grid.cloth_id), getKitByID(grid.top_id)])
          .then(function (kits) {
            var prof = angular.copy(kits[1]);
            priceObj.kits = angular.copy(kits);
            //--- add other profiles
            priceObj.kits.push(prof, prof, prof);
            //console.warn('kits!!!!!!+', priceObj.kits);

            $q
              .all([
                getElementByListId(0, kits[0].parent_element_id),
                getElementByListId(0, kits[1].parent_element_id)
              ])
              .then(function (kitsElem) {
                var wasteList = [
                    grid.cloth_waste,
                    grid.top_waste,
                    grid.right_waste,
                    grid.bottom_waste,
                    grid.left_waste
                  ],
                  kitsQty = wasteList.length,
                  k,
                  tempW,
                  tempH,
                  sizeTemp,
                  wasteValue,
                  priceTemp;

                priceObj.kitsElem = angular.copy(kitsElem);
                //--- add other profiles
                priceObj.kitsElem.push(
                  angular.copy(kitsElem[1]),
                  angular.copy(kitsElem[1]),
                  angular.copy(kitsElem[1])
                );
                //console.warn('kitsElem!!!!!!+', priceObj.kitsElem);

                /** culc Kit Price */
                for (k = 0; k < kitsQty; k += 1) {
                  wasteValue = priceObj.kits[k].waste ?
                    1 + priceObj.kits[k].waste / 100 :
                    1;
                  if (priceObj.kitsElem[k]) {
                    tempW =
                      grid.element_width +
                      priceObj.kits[k].amendment_pruning -
                      wasteList[k] / 1000;
                    tempH =
                      grid.element_height +
                      priceObj.kits[k].amendment_pruning -
                      wasteList[k] / 1000;
                    if (k === 1 || k === 3) {
                      //----- profiles horizontal
                      sizeTemp = GeneralServ.roundingValue(tempW, 3);
                    } else if (k === 2 || k === 4) {
                      //----- profiles vertical
                      sizeTemp = GeneralServ.roundingValue(tempH, 3);
                    } else {
                      //----- grid
                      sizeTemp = GeneralServ.roundingValue(tempW * tempH, 3);
                    }
                    priceTemp = GeneralServ.roundingValue(
                      sizeTemp * priceObj.kitsElem[k].price * wasteValue
                    );

                    //console.warn('!!!!!!+', sizeTemp, constrElem.price, wasteValue);
                    /** currency conversion */
                    if (
                      UserStor.userInfo.currencyId !=
                      priceObj.kitsElem[k].currency_id
                    ) {
                      priceTemp = GeneralServ.roundingValue(
                        currencyExgange(
                          priceTemp,
                          priceObj.kitsElem[k].currency_id
                        )
                      );
                    }
                    priceObj.kitsElem[k].qty = 1;
                    priceObj.kitsElem[k].size = sizeTemp;
                    priceObj.kitsElem[k].priceReal = priceTemp;
                    priceObj.priceTotal += priceTemp;
                    priceObj.constrElements.push(priceObj.kitsElem[k]);
                    // console.warn('constrElem!!!!!!+', priceObj.kitsElem[k]);
                  }
                }
              });

            /** collect Kit Children Elements*/
            $q
              .all([
                parseListContent(grid.top_id),
                parseListContent(grid.right_id),
                parseListContent(grid.bottom_id),
                parseListContent(grid.left_id)
              ])
              .then(function (result) {
                priceObj.consist = angular.copy(result);
                //console.warn('list-contents!!!!!!+', result);

                parseConsistElem(priceObj.consist).then(function (consist) {
                  var consistQty, elemQty, cons, el, wasteValue, sizeSource;
                  //console.warn('consistElem!!!!!!+', consist);
                  priceObj.consistElem = angular.copy(consist);

                  /** culc Consist Price */

                  if (priceObj.consistElem) {
                    consistQty = priceObj.consist.length;
                    if (consistQty) {
                      for (cons = 0; cons < consistQty; cons += 1) {
                        //console.warn('parent++++', priceObj.consist[cons]);
                        elemQty = priceObj.consist[cons].length;
                        if (elemQty) {
                          wasteValue = 1;
                          sizeSource = priceObj.kitsElem[cons + 1].size;

                          for (el = 0; el < elemQty; el += 1) {
                            priceObj.consist[cons][
                              el
                            ].newValue = getValueByRuleGrid(
                              sizeSource,
                              priceObj.consist[cons][el].value,
                              priceObj.consist[cons][el].rules_type_id
                            );

                            //console.warn('child+44+++', priceObj.kitsElem[cons+1], priceObj.consist[cons][el]);
                            culcPriceAsRule(
                              1,
                              priceObj.consist[cons][el].newValue,
                              priceObj.consist[cons][el],
                              priceObj.consistElem[cons][el],
                              0, //priceObj.consist[cons][el].amendment_pruning,
                              wasteValue,
                              priceObj
                            );
                          }
                        }
                      }
                    }
                  }
                  priceObj.priceTotal = GeneralServ.roundingValue(
                    priceObj.priceTotal
                  );
                  // console.info('FINISH ADD ====:', priceObj);
                  //console.info('FINISH ADD ====:', JSON.stringify(priceObj.constrElements));
                  finishPriceObj.constrElements = angular.copy(
                    priceObj.constrElements
                  );
                  finishPriceObj.priceTotal = angular.copy(priceObj.priceTotal);
                  deffMain.resolve(finishPriceObj);
                });
              });
          });

        return deffMain.promise;
      }


      var elem_koef_number = 0;
      var element_list = [];

      function getBase64(url) {
        let defer = $q.defer();
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function () {
          let reader = new FileReader();
          reader.onloadend = function () {
            let value = reader.result;
            defer.resolve(value);
          };
          reader.readAsDataURL(xhr.response);
        };
        try {
          xhr.open('GET', url, true);
          xhr.send();
        } catch (e) {
          defer.resolve(0);
        }
        return defer.promise;
      }


      function is_url(str) {
        let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (regexp.test(str)) {
          return true;
        } else {
          return false;
        }
      }

      function getDataUri(url, callback) {
        var image = new Image();
        image.onload = function () {
          var canvas = document.createElement('canvas');
          canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
          canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

          canvas.getContext('2d').drawImage(this, 0, 0);

          // Get raw image data
          callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

          // ... or get as Data URI
          callback(canvas.toDataURL('image/png'));
        };
        image.setAttribute('crossOrigin', 'anonymous');
        try {
          image.src = url;
        } catch (e) {}
      }

      function downloadFile(url, fileURL) {
        let fileTransfer = new FileTransfer();
        url = encodeURI(url);

        fileTransfer.download(
          url,
        //   cordova.file.applicationDirectory+fileURL,
          cordova.file.applicationStorageDirectory+fileURL,
          function(entry) {
            console.log('download complete: ' + entry.toURL());
          },
          function(error) {
            console.log('download error source ' + error.source);
            console.log('download error target ' + error.target);
            console.log('upload error code is ' + error.code);
          });

      }

      function convert(input) {
        
        let output = [];
        let keys = Object.keys(input.tables);
        let tables = input.tables;
        let new_row = {};
        let new_table = {};
        let key_length = keys.length;
        for (let index = 0; index < key_length; index++) {
          new_table = [];
          let curr_table = tables[keys[index]];
          let rows_length = curr_table.rows.length;
          if (keys[index] === "cities") {
            let cities_length = input.tables.cities.rows.length;
            for (let index = 0; index < cities_length; index++) {
              let city = input.tables.cities.rows[index];
              if (city[11] === UserStor.userInfo.city_id) {
                if (city[0]) {
                  elem_koef_number = city[0];
                }
              }
            }
          }
          if (elem_koef_number !== 0) {
            element_list = [];
            if (keys[index] === "elements") {
              let price_koefficients_length = input.tables.price_koefficients.rows.length;
              for (let index = 0; index < price_koefficients_length; index++) {
                let element = input.tables.price_koefficients.rows[index];
                if (element[1] === elem_koef_number) {
                  element_list.push(element);
                }
              }
              if (element_list) {
                let elements_length = tables.elements.rows.length;
                for (let index = 0; index < elements_length; index++) {
                  let element = tables.elements.rows[index];
                  let element_list_length = element_list.length;
                  for (let index = 0; index < element_list_length; index++) {
                    let entry = element_list[index];
                    if (entry[2] === element[0]) {
                      element[21] *= entry[0];
                    }
                  }
                }
              }
            }
          }
          for (let jndex = 0; jndex < rows_length; jndex++) {
            new_row = {};
            let curr_row = curr_table.rows[jndex];
            let curr_row_length = curr_table.rows[jndex].length;
            for (let kndex = 0; kndex < curr_row_length; kndex++) {
              let key_list = "lists list_contents options_coefficients price_koefficients profile_systems users_deliveries users_discounts users_mountings window_hardware_handles";
              if (key_list.includes(keys[index])) {
                if (curr_table.fields[kndex] !== "name") {
                  new_row[curr_table.fields[kndex]] = chechFloat(curr_row[kndex]);
                } else {
                  new_row[curr_table.fields[kndex]] = checkStringToQuote(curr_row[kndex]);
                }
              } else {
                new_row[curr_table.fields[kndex]] = checkStringToQuote(curr_row[kndex]);
              }
              if (curr_table.fields[kndex] === "img" && curr_row[kndex]) {
                if (GlobalStor.global.ISEXT) {
                    downloadFile(globalConstants.serverIP + curr_row[kndex], curr_row[kndex]);
                } else {
                  new_row[curr_table.fields[kndex]] = globalConstants.serverIP + curr_row[kndex];
                }
              }
            }

            new_table.push(new_row);
          }
          output[keys[index]] = new_table;
        }
        return output;
      }

      function chechFloat(item) {
        if (!isNaN(parseFloat(item))) {
          return parseFloat(item);
        } else {
          return item;
        }
      }

      function getLocalStor() {
        var defer = $q.defer();
        db.getItem('tables').then(function (value) {
          LocalDataBase = value;
          defer.resolve(1);
        }).catch(function (err) {
          console.log(err);
          defer.resolve(0);
        });
        return defer.promise;
      }

      function getSavedLocation() {
        var defer = $q.defer();
        db.getItem('location').then(function (value) {
          LocalLocationBase = value;
          defer.resolve(LocalLocationBase);
        }).catch(function (err) {
          console.log(err);
          defer.resolve(0);
        });
        return defer.promise;
      }


      /**========== FINISH ==========*/

      thisFactory.publicObj = {
        tablesLocalDB: tablesLocalDB,
        tablesLocationLocalDB: tablesLocationLocalDB,

        convert: convert,
        getLocalStor: getLocalStor,
        getSavedLocation: getSavedLocation,
        selectLocalDB: selectLocalDB,
        insertRowLocalDB: insertRowLocalDB,
        updateLocalDB: updateLocalDB,
        insertTablesLocalDB: insertTablesLocalDB,
        deleteRowLocalDB: deleteRowLocalDB,

        importUser: importUser,
        importLocation: importLocation,
        importFactories: importFactories,
        importAllDB: importAllDB,
        insertServer: insertServer,
        updateServer: updateServer,
        updateOrderServer: updateOrderServer,
        createUserServer: createUserServer,
        exportUserEntrance: exportUserEntrance,
        deleteOrderServer: deleteOrderServer,
        updateLocalServerDBs: updateLocalServerDBs,
        sendIMGServer: sendIMGServer,
        md5: md5,

        calculationPrice: calculationPrice,
        getAdditionalPrice: getAdditionalPrice,
        calculationGridPrice: calculationGridPrice,
        calcDoorElemPrice: calcDoorElemPrice,
        currencyExgange: currencyExgange,
        deleteProductServer: deleteProductServer,
        db: db
      };

      return thisFactory.publicObj;
    });
})();
