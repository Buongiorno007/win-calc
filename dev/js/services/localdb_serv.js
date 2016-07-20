(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('BauVoiceApp')
    .factory('localDB',

  function(
    $http,
    $q,
    $filter,
    globalConstants,
    GeneralServ,
    UserStor,
    GlobalStor
  ) {
    var thisFactory = this,
        db = openDatabase('bauvoice', '1.0', 'bauvoice', 5000000),

        tablesLocalDB = {
          'addition_folders': {
            'tableName': 'addition_folders',
            'prop': 'name VARCHAR(255),' +
            ' addition_type_id INTEGER,' +
            ' is_push INTEGER,' +
            ' factory_id INTEGER,' +
            ' position INTEGER,' +
            ' img VARCHAR,' +
            ' description VARCHAR,' +
            ' link VARCHAR',
            'foreignKey': ', FOREIGN KEY(factory_id) REFERENCES factories(id), FOREIGN KEY(addition_type_id) REFERENCES addition_types(id)'
          },
          'cities': {
            'tableName': 'cities',
            'prop': 'region_id INTEGER, name VARCHAR(255), transport VARCHAR(2), lat NUMERIC, long NUMERIC, is_capital INTEGER, code_sync INTEGER, name_sync VARCHAR(255), area_id INTEGER',
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
          'glass_folders': {
            'tableName': 'glass_folders',
            'prop': 'name VARCHAR(255),' +
            ' img VARCHAR,' +
            ' is_push INTEGER,' +
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
          'options_coefficients': {
            'tableName': 'options_coefficients',
            'prop': 'rentability_percent INTEGER,' +
            ' rentability_hrn_m INTEGER,' +
            ' rentability_hrn INTEGER,' +
            ' others_percent INTEGER,' +
            ' others_hrn_m INTEGER,' +
            ' others_hrn INTEGER,' +
            ' transport_cost_percent INTEGER,' +
            ' transport_cost_hrn_m INTEGER,' +
            ' transport_cost_hrn INTEGER,' +
            ' salary_manager_percent INTEGER,' +
            ' salary_manager_hrn_m INTEGER,' +
            ' salary_manager_hrn INTEGER,' +
            ' rent_offices_percent INTEGER,' +
            ' rent_offices_hrn_m INTEGER,' +
            ' rent_offices_hrn INTEGER,' +
            ' salary_itr_percent INTEGER,' +
            ' salary_itr_hrn_m INTEGER,' +
            ' salary_itr_hrn INTEGER,' +
            ' rent_production_percent INTEGER,' +
            ' rent_production_hrn_m INTEGER,' +
            ' rent_production_hrn INTEGER,' +
            ' salary_glass_percent INTEGER,' +
            ' salary_glass_hrn_m INTEGER,' +
            ' salary_glass_hrn INTEGER,' +
            ' salary_assembly_percent INTEGER,' +
            ' salary_assembly_hrn_m INTEGER,' +
            ' salary_assembly_hrn INTEGER,' +
            ' estimated_cost INTEGER,' +
            ' factory_id INTEGER,' +
            ' plan_production INTEGER,' +
            ' margin NUMERIC(10, 2),' +
            ' coeff NUMERIC(10, 2)',
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
            'prop': 'heat_coeff INTEGER,' +
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
            ' noise_coeff NUMERIC,' +
            ' sku VARCHAR(100),' +
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
            ' heat_coeff_value NUMERIC(5,2),' +
            ' link VARCHAR,' +
            ' description VARCHAR,' +
            ' img VARCHAR,' +
            ' is_push INTEGER',
            'foreignKey': ''
          },
          'profile_laminations': {
            'tableName': 'profile_laminations',
            'prop': 'profile_id INTEGER,' +
            ' lamination_in_id INTEGER,' +
            ' lamination_out_id INTEGER,' +
            ' rama_list_id INTEGER,' +
            ' rama_still_list_id INTEGER,' +
            ' stvorka_list_id INTEGER,' +
            ' impost_list_id INTEGER,' +
            ' shtulp_list_id INTEGER,' +
            ' code_sync VARCHAR',
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
            ' email VARCHAR(255),' +
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
            ' address VARCHAR,' +
            ' therm_coeff_id INTEGER,' +
            ' factoryLink VARCHAR,' +
            ' code_sync VARCHAR',
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
          'users_deliveries': {
            'tableName': 'users_deliveries',
            'prop': 'user_id INTEGER,' +
            ' active INTEGER,' +
            ' name VARCHAR,' +
            ' type INTEGER,' +
            ' price NUMERIC(6,1)',
            'foreignKey': ''
          },
          'users_mountings': {
            'tableName': 'users_mountings',
            'prop': 'user_id INTEGER,' +
            ' active INTEGER,' +
            ' name VARCHAR,' +
            ' type INTEGER,' +
            ' price NUMERIC(6,1)',
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
            ' img VARCHAR,' +
            ' beed_lamination_id INTEGER,' +
            ' in_door INTEGER,' +
            ' doorstep_type INTEGER,' +
            ' glass_type INTEGER,' +
            ' glass_image INTEGER',
            'foreignKey': ', FOREIGN KEY(parent_element_id) REFERENCES elements(id), FOREIGN KEY(parent_element_id) REFERENCES elements(id), FOREIGN KEY(list_group_id) REFERENCES lists_groups(id), FOREIGN KEY(add_color_id) REFERENCES addition_colors(id)'
          },
          'list_contents': {
            'tableName': 'list_contents',
            'prop': 'parent_list_id INTEGER,' +
            ' child_id INTEGER,' +
            ' child_type VARCHAR(255),' +
            ' value NUMERIC(10, 7),' +
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
            ' is_default INTEGER,' +
            ' position INTEGER,' +
            ' producer VARCHAR(255),' +
            ' country VARCHAR(255),' +
            ' noise_coeff INTEGER,' +
            ' heat_coeff INTEGER,' +
            ' min_height INTEGER,' +
            ' max_height INTEGER,' +
            ' min_width INTEGER,' +
            ' max_width INTEGER,' +
            ' is_push INTEGER,' +
            ' link VARCHAR,' +
            ' description VARCHAR,' +
            ' img VARCHAR',
            'foreignKey': ''
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
            ' discount_construct_max NUMERIC,' +
            ' discount_addelem_max NUMERIC,' +
            ' delivery_user_id NUMERIC,' +
            ' mounting_user_id NUMERIC,' +
            ' default_term_plant NUMERIC,' +
            ' disc_term_plant NUMERIC,' +
            ' margin_plant NUMERIC,' +

            ' customer_name TEXT,' +
            ' customer_email TEXT,' +
            ' customer_phone VARCHAR(30),' +
            ' customer_phone_city VARCHAR(20),' +
            ' customer_city_id INTEGER,' +
            ' customer_city VARCHAR,' +
            ' customer_address TEXT,' +
            ' customer_house TEXT,' +
            ' customer_flat TEXT,' +
            ' customer_floor TEXT,' +
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
            ' lamination_id INTEGER,' +
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
            ' element_qty INTEGER,' +
            ' block_id INTEGER',
            'foreignKey': ''
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
          'background_templates':{
            'tableName': 'background_templates',
            'prop': 'factory_id INTEGER,'+
            'desc_1 VARCHAR(255),' +
            'desc_2 VARCHAR(255),' +
            'template_id INTEGER,' +
            'group_id INTEGER,' +
            'position INTEGER,' +
            'img VARCHAR',
            'foreignKey': ''
          },

          'factories':{
            'tableName': 'factories',
            'prop': 'name VARCHAR,'+
            'app_token VARCHAR,' +
            'link VARCHAR,' +
            'therm_coeff_id INTEGER,' +
            'max_construct_square INTEGER,' +
            'max_construct_size INTEGER',
            'foreignKey': ''
          },

          'mosquitos':{
            'tableName': 'mosquitos',
            'prop': 'profile_id INTEGER,'+
            'name VARCHAR,' +
            'bottom_id INTEGER,' +
            'bottom_waste INTEGER,' +
            'left_id INTEGER,' +
            'left_waste INTEGER,'+
            'top_id INTEGER,'+
            'top_waste INTEGER,'+
            'right_id INTEGER,'+
            'right_waste INTEGER,'+
            'cloth_id INTEGER,'+
            'cloth_waste INTEGER',
            'foreignKey': ''
          },

          'mosquitos_singles':{
            'tableName': 'mosquitos_singles',
            'prop': 'factory_id INTEGER,'+
            'name VARCHAR,' +
            'bottom_id INTEGER,' +
            'bottom_waste INTEGER,' +
            'left_id INTEGER,' +
            'left_waste INTEGER,'+
            'top_id INTEGER,'+
            'top_waste INTEGER,'+
            'right_id INTEGER,'+
            'right_waste INTEGER,'+
            'cloth_id INTEGER,'+
            'cloth_waste INTEGER',
            'foreignKey': ''
          },
          'doors_groups_dependencies':{
            'tableName': 'doors_groups_dependencies',
            'prop' :
            'doors_group_id INTEGER,'+
            'hardware_group_id INTEGER',
            'foreignKey': ''  
          },
          'doors_hardware_items':{
            'tableName': 'doors_hardware_items',
            'prop' :
            'hardware_group_id  INTEGER,'+  
            'min_width INTEGER,'+
            'max_width INTEGER,'+
            'min_height INTEGER,'+
            'max_height INTEGER,'+
            'direction_id   INTEGER,'+  
            'hardware_color_id  INTEGER,'+  
            'length INTEGER,'+  
            'count  INTEGER,'+  
            'child_id INTEGER,'+  
            'position INTEGER,'+
            'child_type STRING',    
            'foreignKey': ''  
          },
          'doors_hardware_groups':{
            'tableName': 'doors_hardware_groups',
            'prop' :
            'burglar_coeff INTEGER,'+   
            'anticorrosion_coeff INTEGER,'+ 
            'image VARCHAR(255),'+  
            'description VARCHAR(255),'+    
            'link VARCHAR(255),'+   
            'country VARCHAR(255),'+    
            'producer VARCHAR(255),'+   
            'name VARCHAR(255),'+   
            'hardware_type_id INTEGER,'+    
            'factory_id INTEGER,'+  
            'type INTEGER,'+
            'is_push INTEGER,' +    
            'height_max INTEGER,'+  
            'height_min INTEGER,'+  
            'width_max INTEGER,'+
            'width_min INTEGER',
            'foreignKey': ''  
          },
          'doors_groups':{
            'tableName': 'doors_groups',
            'prop' :
            'code_sync_white INTEGER,'+
            'shtulp_list_id INTEGER,'+
            'impost_list_id INTEGER,'+
            'stvorka_list_id INTEGER,'+
            'door_sill_list_id INTEGER,'+
            'rama_list_id INTEGER,'+
            'name VARCHAR,'+
            'folder_id INTEGER,'+
            'factory_id INTEGER',
            'foreignKey': ''  
          },
          'areas':{
            'tableName': 'areas',
            'prop':
            'name VARCHAR(255),'+ 
            'region_id INTEGER',
            'foreignKey': ', FOREIGN KEY (region_id) REFERENCES regions(id)'
          },
          'doors_laminations_dependencies':{
            'tableName': 'doors_laminations_dependencies',
            'prop' :
            'group_id INTEGER,'+ 
            'lamination_in INTEGER,'+ 
            'lamination_out INTEGER,'+ 
            'rama_list_id INTEGER,'+ 
            'door_sill_list_id INTEGER,'+ 
            'stvorka_list_id INTEGER,'+ 
            'impost_list_id INTEGER,'+ 
            'shtulp_list_id INTEGER,'+ 
            'code_sync VARCHAR',   
            'foreignKey': ''          
        },
          'window_hardware_type_ranges':{
            'tableName': 'window_hardware_type_ranges',
            'prop': 'factory_id INTEGER,'+
            'type_id INTEGER,' +
            'max_width INTEGER,' +
            'min_width INTEGER,' +
            'max_height INTEGER,' +
            'min_height INTEGER,' +
            'group_id INTEGER',
            'foreignKey': ''
          },

          'lock_lists':{
            'tableName': 'lock_lists',
            'prop': 'list_id INTEGER,'+
            'accessory_id INTEGER',
            'foreignKey': ''
          },

//-------- inner temables
//          'analytics': {
//            'tableName': 'analytics',
//            'prop': 'order_id NUMERIC, user_id INTEGER, calculation_id INTEGER, element_id INTEGER, element_type INTEGER',
//            'foreignKey': ''
//          },

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
        };








    /**============ methods ================*/



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



    /**----- if string has single quote <'> it replaces to double quotes <''> -----*/

    function checkStringToQuote(str) {
      if(angular.isString(str)) {
        if(str.indexOf("'")+1) {
          //console.warn(str);
          return str.replace(/'/g, "''");
        } else {
          return str;
        }
      } else {
        return str;
      }
    }


    function insertRowLocalDB(row, tableName) {
      var keysArr = Object.keys(row),
          colums = keysArr.join(', '),
          values = keysArr.map(function (key) {
            row[key] = checkStringToQuote(row[key]);
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
      //console.log('tabless =', tableKeys);
      db.transaction(function (trans) {
        var t;
        for (t = 0; t < tableQty; t+=1) {
          var colums = result.tables[tableKeys[t]].fields.join(', '),
              rowsQty = result.tables[tableKeys[t]].rows.length,
              r;
          //console.log('insert ++++', tableKeys[t]);
          if (rowsQty) {
            for (r = 0; r < rowsQty; r+=1) {
              var defer = $q.defer(),
                  values = result.tables[tableKeys[t]].rows[r].map(function (elem) {
                    elem = checkStringToQuote(elem);
                    return "'" + elem + "'";
                  }).join(', ');
              //console.log('insert ++++', tableKeys[t], colums, values);
              trans.executeSql('INSERT INTO ' + tableKeys[t] + ' (' + colums + ') VALUES (' + values + ')', [], function() {
                defer.resolve(1);
              }, function(error) {
                console.log('Error!!! ', error, tableKeys[t], colums);
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
          properties = columns || '*',
          vhereOptions = "";
      if(options) {
        vhereOptions = " WHERE ";
        var optionKeys = Object.keys(options);
        vhereOptions += optionKeys[0] + " = '" + options[optionKeys[0]] + "'";
        var optionQty = optionKeys.length, k;
        if(optionQty > 1) {
          for(k = 1; k < optionQty; k+=1) {
            vhereOptions += " AND " + optionKeys[k] + " = '" + options[optionKeys[k]] + "'";
          }
        }
      }
      db.transaction(function (trans) {
        trans.executeSql("SELECT "+properties+" FROM " + tableName + vhereOptions, [],
          function (tx, result) {
            var resultQty = result.rows.length;
            if (resultQty) {
              var resultARR = [], i;
              for(i = 0; i < resultQty; i+=1) {
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
          elements = "", k, op;

      if(keysQty) {
        for(k = 0; k < keysQty; k+=1) {
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
          for(op = 1; op < optionQty; op+=1) {
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
      var vhereOptions = "";
      if(options) {
        var optionKeys = Object.keys(options),
            optionQty = optionKeys.length, k;
        vhereOptions = " WHERE " + optionKeys[0] + " = '" + options[optionKeys[0]] + "'";
        if(optionQty > 1) {
          for(k = 1; k < optionQty; k+=1) {
            vhereOptions += " AND " + optionKeys[k] + " = '" + options[optionKeys[k]] + "'";
          }
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
    function importUser(login, type) {
      var defer = $q.defer(),
          query = type ? '/api/login?type=1' : '/api/login';
      $http.post(globalConstants.serverIP + query, {login: login}).then(
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
      var defer = $q.defer();
      $http.get(globalConstants.serverIP + '/api/get/locations?login='+login+'&access_token='+access).then(
        function (result) {
          if(result.data.status) {
            //-------- insert in LocalDB
            //console.warn(result.data);
            insertTablesLocalDB(result.data).then(function() {
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
          //console.log('send changes to server success:', result);
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
            //console.log('send changes to server success:', result);
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
      var dataSend = {orderId: +orderNumber};
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
          //console.log('send changes to server success:', result);
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
          lByteCount+=1;
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
        for (lCount = 0; lCount <= 3; lCount+=1) {
          lByte = (lValue >>> (lCount * 8)) & 255;
          WordToHexValue_temp = "0" + lByte.toString(16);
          WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
      }
      function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n+=1) {
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
                for (i = 0; i < result.tables[table].rows.length; i+=1) {
                  updateSql = '';
                  for(k = 0; k < result.tables[table].fields.length; k+=1){
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


    function parseHardwareKit(whId, sashBlocks, color){
      var deff = $q.defer();
      selectLocalDB(tablesLocalDB.window_hardwares.tableName, {window_hardware_group_id: whId}).then(function(result) {
        //console.warn('*****hardware = ', result);
        var resQty = result.length,
            hardwareKits = [],
            sashBlocksQty = sashBlocks.length,
            hardware, hardware1, hardware2, openDirQty, s, dir;
        if(resQty) {
          //----- loop by sizes (sashesBlock)
          for(s = 0; s < sashBlocksQty; s+=1){
            hardware = angular.copy(result);
            hardware1 = [];
            hardware2 = [];
            openDirQty = sashBlocks[s].openDir.length;

            /** change openDir for directions
             * direction_id == 1 - не учитывать
             * 2 - право
             * 3 - лево
             * */
            for(dir = 0; dir < openDirQty; dir+=1) {
              if(sashBlocks[s].openDir[dir] === 4) {
                sashBlocks[s].openDir[dir] = 2;
              } else if(sashBlocks[s].openDir[dir] === 2) {
                sashBlocks[s].openDir[dir] = 3;
              } else {
                sashBlocks[s].openDir[dir] = 1;
              }
            }

            //------ filter by type, direction and color
            hardware1 = hardware.filter(function(item) {
              if(item.window_hardware_type_id == sashBlocks[s].type && (item.window_hardware_color_id == color || !item.window_hardware_color_id)) {
                if (openDirQty == 1) {
                  return  (item.direction_id == sashBlocks[s].openDir[0] || item.direction_id == 1);
                } else if (openDirQty == 2) {
                  return (item.direction_id == sashBlocks[s].openDir[0] || item.direction_id == sashBlocks[s].openDir[1] || item.direction_id == 1);
                }
              }
            });
            hardware2 = hardware1.filter(function(item) {
              if(item.min_width && item.max_width && !item.min_height && !item.max_height) {
                if(sashBlocks[s].sizes[0] >= item.min_width && sashBlocks[s].sizes[0] <= item.max_width) {
                  return item;
                }
              } else if (!item.min_width && !item.max_width && item.min_height && item.max_height) {
                if(sashBlocks[s].sizes[1] >= item.min_height && sashBlocks[s].sizes[1] <= item.max_height) {
                  return item;
                }
              } else if (item.min_width && item.max_width && item.min_height && item.max_height) {
                if(sashBlocks[s].sizes[1] >= item.min_height && sashBlocks[s].sizes[1] <= item.max_height) {
                  if(sashBlocks[s].sizes[0] >= item.min_width && sashBlocks[s].sizes[0] <= item.max_width) {
                    return item;
                  }
                }
              } else if (!item.min_width && !item.max_width && !item.min_height && !item.max_height) {
                return item;
              }
            });
            hardwareKits.push(hardware2);
          }
          if(hardwareKits.length) {
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


    function parseMainKit(construction){
        //AH928206
      var deff = $q.defer(),
          promisesKit = construction.sizes.map(function(item, index, arr) {
            var deff1 = $q.defer();
            //----- chekh is sizes and id
            if(item.length && construction.ids[index]) {
              /** if hardware */
              if(index === arr.length-1) {
                parseHardwareKit(construction.ids[index], item, construction.laminationId).then(function(hardwares) {
                  if(hardwares.length) {
                    deff1.resolve(hardwares);
                  } else {
                    deff1.resolve(0);
                  }
                });
              } else {
                if(angular.isArray(construction.ids[index])) {
                  var promisKits = construction.ids[index].map(function(item2) {
                    var deff2 = $q.defer();
                    selectLocalDB(
                      tablesLocalDB.lists.tableName,
                      {id: item2},
                      'id, parent_element_id, name, waste, amendment_pruning'
                    ).then(function(result2) {
                      if(result2.length) {
                        deff2.resolve(result2);
                      } else {
                        deff2.resolve(0);
                      }
                    });
                    return deff2.promise;
                  });
                  $q.all(promisKits).then(function(result3) {
                    var data3 = angular.copy(result3),
                        resQty = data3.length,
                        collectArr = [], i;
                    for(i = 0; i < resQty; i+=1) {
                      if(data3[i]) {
                        if(data3[i][0].amendment_pruning) {
                          data3[i][0].amendment_pruning /= 1000;
                        }
                        collectArr.push(data3[i][0]);
                      }
                    }
                    if(collectArr.length > 1) {
                      deff1.resolve(collectArr);
                    } else if(collectArr.length === 1) {
                      deff1.resolve(collectArr[0]);
                    } else {
                      deff1.resolve(0);
                    }
                  })
                } else {
                  selectLocalDB(
                    tablesLocalDB.lists.tableName,
                    {id: construction.ids[index]},
                    'id, parent_element_id, name, waste, amendment_pruning'
                  ).then(function(result) {
                    var data = angular.copy(result);
                    if(data && data.length) {
                      if(data[0].amendment_pruning) {
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
        tablesLocalDB.lists.tableName, {id: kitID}, 'parent_element_id, name, waste, amendment_pruning'
      ).then(function(result) {
        var data = angular.copy(result);
        if(data && data.length) {
          if(data[0].amendment_pruning) {
            data[0].amendment_pruning /= 1000;
          }
          deff.resolve(data[0]);
        } else {
          deff.resolve(0);
        }
      });
      return deff.promise;
    }



    function parseListContent(listId){
      var defer = $q.defer(),
          lists = [],
          elemLists = [];
      if(angular.isArray(listId)) {
        lists = listId;
      } else {
        lists.push(listId);
      }
      (function nextRecord() {
        if (lists.length) {
          var firstKit = lists.shift(0),
              firstKitId = 0;
          if(typeof firstKit === 'object') {
            firstKitId = firstKit.childId;
          } else {
            firstKitId = firstKit;
          }
          selectLocalDB(tablesLocalDB.list_contents.tableName, {parent_list_id: firstKitId}).then(function(result) {
            var resQty = result.length, i;
            if(resQty) {
              for (i = 0; i < resQty; i+=1) {
                if(typeof firstKit === 'object') {
                  result[i].parentId = firstKit.parentId;
                }
                elemLists.push(result[i]);
                if(result[i].child_type === 'list') {
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
          if(elemLists.length) {
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
          typesQty = types.length, j,
          hardwareQty = hardvares.length, i;
      for(i = 0; i < hardwareQty; i+=1) {
        typeLoop: for(j = 0; j < typesQty; j+=1) {
          if(hardvares[i].lamination_type_id === types[j]) {
            newHardArr.push(hardvares[i]);
            break typeLoop;
          }
        }
      }
      return newHardArr;
    }



    function parseKitConsist(kits) {
      var deff = $q.defer(),
          promKits = kits.map(function(item, index, arr) {
            var deff1 = $q.defer();
            if(item) {
              if(angular.isArray(item)) {
                var promisElem = item.map(function(item2){
                  var deff2 = $q.defer();
                  /** if hardware */
                  if(index === arr.length-1) {
                    if(angular.isArray(item2)) {
                      var promisHW = item2.map(function(item3) {
                        var deff3 = $q.defer();
                        parseListContent(item3.child_id).then(function (result4) {
                          if(result4.length) {
                            deff3.resolve(checkHardwareType(result4));
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
                      if(result2.length) {
                        deff2.resolve(result2);
                      } else {
                        deff2.resolve(0);
                      }
                    });
                  }
                  return deff2.promise;
                });
                $q.all(promisElem).then(function(result3) {
                  var resQty = result3.length,
                      collectArr = [], i;
                  if(resQty) {
                    for(i = 0; i < resQty; i+=1) {
                      if(angular.isArray(result3[i])) {
                        collectArr.push(result3[i]);
                      } else {
                        if(result3[i][0]) {
                          collectArr.push(result3[i][0]);
                        } else {
                          collectArr.push(result3[i]);
                        }
                      }
                    }
                  }
                  if(collectArr.length) {
                    deff1.resolve(collectArr);
                  } else {
                    deff1.resolve(0);
                  }
                });
              } else {
                var itemId = 0;
                /** if hardware */
                if(index === arr.length-1) {
                  itemId = item.child_id;
                } else {
                  itemId = item.id;
                }
                if(itemId) {
                  parseListContent(itemId).then(function (result1) {
                    if(result1.length) {
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
        tablesLocalDB.elements.tableName, {id: listID}, 'id, sku, currency_id, price, name, element_group_id'
      ).then(function(result) {
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





    function parseKitElement(kits){
      var deff = $q.defer(),
          promisesKitElem = kits.map(function(item, index, arr) {
            var deff1 = $q.defer();
            if(item) {
              if(angular.isArray(item)) {
                var promisElem = item.map(function(item2){
                  var deff2 = $q.defer();

                  /** if hardware */
                  if(index === arr.length-1) {
                    if(angular.isArray(item2)) {
                      var promisHW = item2.map(function (item3) {
                        var deff3 = $q.defer();
                        if(item3.child_type === 'element') {
                          deff3.resolve(getElementByListId(1, item3.child_id));
                        } else {
                          getKitByID(item3.child_id).then(function(data) {
                            angular.extend(item3, data);
                            deff3.resolve(getElementByListId(1, data.parent_element_id));
                          });
                        }
                        return deff3.promise;
                      });
                      deff2.resolve($q.all(promisHW));
                    }
                  } else {
                    deff2.resolve(getElementByListId(0, item2.parent_element_id));
                  }
                  return deff2.promise;
                });

                $q.all(promisElem).then(function(result2) {
                  var resQty = result2.length,
                      collectArr = [], i;
                  if(resQty) {
                    /** if glass or beads */
                    if(index === 5 || index === 6) {
                      collectArr = result2;
                    } else {
                      for (i = 0; i < resQty; i+=1) {
                        if (result2[i]) {
                          if (angular.isArray(result2[i])) {
                            var innerArr = [], innerQty = result2[i].length, j;
                            //                          console.info(result2[i]);
                            for (j = 0; j < innerQty; j+=1) {
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
                  if(collectArr.length) {
                    deff1.resolve(collectArr);
                  } else {
                    deff1.resolve(0);
                  }
                });
              } else {
                /** if hardware */
                if(index === arr.length-1) {
                  if(item.child_type === 'element') {
                    deff1.resolve(getElementByListId(0, item.child_id));
                  } else {
                    getKitByID(item.child_id).then(function(data) {
                      angular.extend(item, data);
                      deff1.resolve(getElementByListId(0, data.parent_element_id));
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
      if(consists.length) {
        var promConsist = consists.map(function(item) {
          var deff1 = $q.defer();
          if(item && item.length) {
            var promConsistElem = item.map(function(item2) {
              var deff2 = $q.defer();
              if(angular.isArray(item2)) {
                var promConsistElem2 = item2.map(function(item3) {
                  var deff3 = $q.defer();
                  if(item3) {
                    if(angular.isArray(item3)) {
                      var promConsistElem3 = item3.map(function(item4) {
                        var deff4 = $q.defer();
                        if(item4) {
                          if(item4.child_type === 'element') {
                            deff4.resolve(getElementByListId(0, item4.child_id));
                          } else {
                            getKitByID(item4.child_id).then(function(data4) {
                              angular.extend(item4, data4);
                              deff4.resolve(getElementByListId(0, data4.parent_element_id));
                            });
                          }
                        } else {
                          deff4.resolve(0);
                        }
                        return deff4.promise;
                      });
                      deff3.resolve($q.all(promConsistElem3));
                    } else {
                      if(item3.child_type === 'element') {
                        deff3.resolve(getElementByListId(0, item3.child_id));
                      } else {
                        getKitByID(item3.child_id).then(function(data) {
                          angular.extend(item3, data);
                          deff3.resolve(getElementByListId(0, data.parent_element_id));
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
                if(item2) {
                  if (item2.child_type === 'element') {
                    deff2.resolve(getElementByListId(0, item2.child_id));
                  } else {
                    getKitByID(item2.child_id).then(function (data) {
                      angular.extend(item2, data);
                      deff2.resolve(getElementByListId(0, data.parent_element_id));
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




    function currencyExgange(price, currencyElemId) {
      var currencyQty = GlobalStor.global.currencies.length,
          c, currIndex, elemIndex;
      if(currencyQty) {
        for (c = 0; c < currencyQty; c+=1) {
          if(GlobalStor.global.currencies[c].id === UserStor.userInfo.currencyId) {
            currIndex = c;
          }
          if(GlobalStor.global.currencies[c].id === currencyElemId){
            elemIndex = c;
          }
        }
      }
//console.warn('currencies+++++++', GlobalStor.global.currencies[currIndex], GlobalStor.global.currencies[elemIndex]);
      if(GlobalStor.global.currencies[currIndex] && GlobalStor.global.currencies[elemIndex]) {
        price *= GlobalStor.global.currencies[elemIndex].value;
      }
      return price;
    }





    function culcPriceAsSize(group, kits, kitsElem, sizes, sizeQty, priceObj, constrElements) {
      var priceTemp = 0,
          sizeTemp = 0,
          sizeLabelTemp = 0,
          qtyTemp = 1,
          constrElem = {},
          block,
          waste = (kits.waste) ? (1 + (kits.waste / 100)) : 1;

      //      console.info('culcPriceAsSize =====', group, kits, kitsElem, sizes);

      /** beads */
      if(group === 6) {
        for (block = 0; block < sizeQty; block+=1) {
          /** check beadId */
          if (sizes[block].elemId === kits.id) {
            var sizeBeadQty = sizes[block].sizes.length;
            while(--sizeBeadQty > -1) {
              constrElem = angular.copy(kitsElem);
              sizeTemp = (sizes[block].sizes[sizeBeadQty] + kits.amendment_pruning);
              priceTemp = (sizeTemp * constrElem.price) * waste;

              /** currency conversion */
              if (UserStor.userInfo.currencyId != constrElem.currency_id) {
                priceTemp = currencyExgange(priceTemp, constrElem.currency_id);
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
        for (var siz = 0; siz < sizeQty; siz+=1) {
          constrElem = angular.copy(kitsElem);
          /** glasses */
          if (group === 5) {
            var isExist = 0;
            /** check size by id of glass */
            if (sizes[siz].elemId === kits.id) {
              sizeTemp = sizes[siz].square;
              sizeLabelTemp = GeneralServ.roundingValue(sizes[siz].square, 3) + ' '+
                $filter('translate')('common_words.LETTER_M') +'2 (' + sizes[siz].sizes[0] +
                ' x ' + sizes[siz].sizes[1] + ')';
              priceTemp = sizeTemp * constrElem.price * waste;
              isExist+=1;
            }
            /** hardware */
          } else if (group === 7) {
            qtyTemp = kits.count;
            priceTemp = qtyTemp * constrElem.price * waste;
          } else {
            sizeTemp = (sizes[siz] + kits.amendment_pruning);
            priceTemp = (sizeTemp * constrElem.price) * waste;
          }

          if (group === 5 && isExist || group !== 5) {
            /** currency conversion */
            if (UserStor.userInfo.currencyId != constrElem.currency_id) {
              priceTemp = currencyExgange(priceTemp, constrElem.currency_id);
            }
            constrElem.qty = angular.copy(qtyTemp);
            constrElem.size = GeneralServ.roundingValue(sizeTemp, 3);
            constrElem.sizeLabel = sizeLabelTemp;
            constrElem.priceReal = GeneralServ.roundingValue(priceTemp, 3);
            priceObj.priceTotal += priceTemp;
            //          console.warn(constrElem);
            constrElements.push(constrElem);
          }
        }
      }
    }



    function culcKitPrice(priceObj, sizes) {
      var kitElemQty = priceObj.kitsElem.length,
          sizeQty = 0,
          constrElements = [], ke;
      priceObj.priceTotal = 0;

      for(ke = 0; ke < kitElemQty; ke+=1) {
        if(priceObj.kitsElem[ke]) {
          sizeQty = sizes[ke].length;
          if(angular.isArray(priceObj.kitsElem[ke])) {
            //            console.info('culcKitPrice ===== array');
            var kitElemChildQty = priceObj.kitsElem[ke].length, child;
            for(child = 0; child < kitElemChildQty; child+=1) {
              /** hardware */
              if(angular.isArray(priceObj.kitsElem[ke][child])) {
                //                console.info('culcKitPrice ===== hardware');
                var kitElemChildQty2 = priceObj.kitsElem[ke][child].length, child2;
                for(child2 = 0; child2 < kitElemChildQty2; child2+=1) {
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
            culcPriceAsSize(ke, priceObj.kits[ke], priceObj.kitsElem[ke], sizes[ke], sizeQty, priceObj, constrElements);
          }
        }
      }

      return constrElements;
    }







    function checkDirectionConsistElem(currConsist, openDir, openDirQty) {
      if(currConsist.direction_id == 1) {
        return 1;
      } else {
        var isExist = 0,
            d;
        for(d = 0; d < openDirQty; d+=1) {
          if(openDir[d] === currConsist.direction_id) {
            isExist+=1;
          }
        }
        return isExist;
      }
    }



    function getValueByRule(parentValue, childValue, rule){
      //console.info('rule++', parentValue, childValue, rule);
      var value = 0;
      switch (rule) {
        case 1:
        case 21: //---- less width of glass
        case 22: //---- less height of glass
          //------ меньше родителя на X (м)
          value = GeneralServ.roundingValue((parentValue - childValue), 3);
          break;
        case 2: //------ X шт. на родителя
        case 5: //----- X шт. на 1 м2 родителя
          var parentValueTemp = (parentValue < 1) ? 1 : parseInt(parentValue);
          value = parentValueTemp * childValue;
          break;
        case 3:
        case 12:
        case 14:
          //------ X шт. на метр родителя
          value = GeneralServ.roundingValue((Math.round(parentValue) * childValue), 3);
          break;
        case 6:
        case 7:
        case 8:
        case 9:
        case 13:
        case 23: //------ кг на м
          value = GeneralServ.roundingValue((parentValue * childValue), 3);
          break;
        default:
          value = childValue;
          break;
      }
      //console.info('rule++value+++', value);
      return value;
    }


    function getValueByRuleGrid(parentValue, childValue, rule){
      //console.info('rule++', parentValue, childValue, rule);
      var value = 0;
      switch (rule) {
        case 1:
          //------ меньше родителя на X (м)
          value = GeneralServ.roundingValue((parentValue - childValue), 3);
          break;
        case 2: //------ X шт. на родителя
        case 5: //----- X шт. на 1 м2 родителя
          var parentValueTemp = (parentValue < 1) ? 1 : parseInt(parentValue);
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


    function culcPriceAsRule(
      parentValue, currSize, currConsist, currConsistElem, pruning, wasteValue, priceObj, sizeLabel
    ) {
      if(currConsistElem) {
        var objTmp = angular.copy(currConsistElem), priceReal = 0, sizeReal = 0, qtyReal = 1;

        //console.log('id: ' + currConsist.id + '///' + currConsistElem.id);
        //console.log('Название: ' + currConsistElem.name);
        //console.log('Цена: ' + currConsistElem.price);
        //console.log('% отхода : ' + wasteValue);
        //console.log('Поправка на обрезку : ' + pruning);
        //console.log('Размер: ' + currSize + ' m');
        //console.log('parentValue: ' + parentValue);

        /** if glass */
        if (objTmp.element_group_id === 9) {
          sizeReal = currSize;
        }
        switch (currConsist.rules_type_id) {
          case 1:
          case 21:
          case 22:
            sizeReal = GeneralServ.roundingValue((currSize + pruning - currConsist.value), 3);
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
          case 2:
          case 4:
          case 15:
            qtyReal = parentValue * currConsist.value;
            //console.log('Правило 2: ',  parentValue, ' * ', currConsist.value, ' = ', qtyReal, ' шт. на родителя');
            break;
          default:
            sizeReal = GeneralServ.roundingValue((currSize + pruning), 3);
            //console.log('Правило else:', currSize, ' + ', pruning, ' = ', (currSize + pruning), sizeReal);
            break;
        }

        if (sizeReal) {
          priceReal = sizeReal * qtyReal * currConsistElem.price * wasteValue;
        } else {
          priceReal = qtyReal * currConsistElem.price * wasteValue;
        }

        /** currency conversion */
        if (UserStor.userInfo.currencyId != currConsistElem.currency_id) {
          priceReal = currencyExgange(priceReal, currConsistElem.currency_id);
        }
        //console.info('@@@@@@@@@@@@', objTmp, objTmp.priceReal, priceReal);
        //objTmp.priceReal = GeneralServ.roundingNumbers(priceReal, 3);
        //objTmp.qty = GeneralServ.roundingNumbers(qtyReal, 3);
        objTmp.priceReal = priceReal;
        objTmp.size = GeneralServ.roundingValue(sizeReal, 3);
        objTmp.sizeLabel = sizeLabel;
        objTmp.qty = qtyReal;
        //console.warn('finish -------------- priceTmp', objTmp.priceReal, objTmp);
        priceObj.constrElements.push(objTmp);
        priceObj.priceTotal += objTmp.priceReal;
      }
    }




    function prepareConsistElemPrice(
      group, currConstrSize, mainKit, currConsist, currConsistElem, consistArr, priceObj
    ) {
      //console.info('1-----', group);
      //console.info('2-----', currConsist, currConsistElem);
      //console.info('3-----', currConstrSize, mainKit);
      if (currConsist.parent_list_id === mainKit.id) {

        var fullSize = 1,
            currSize = 1,
            sizeLabel = 0,
            wasteValue = (mainKit.waste) ? (1 + (mainKit.waste / 100)) : 1;
        /** if glasses */
        if(group === 5) {
          if(currConsist.rules_type_id === 5) {
            fullSize = currConstrSize.square;
            currSize = currConstrSize.square;
            sizeLabel = GeneralServ.roundingValue(currConstrSize.square, 3) + ' '+
              $filter('translate')('common_words.LETTER_M') +'2 (' + currConstrSize.sizes[0] +
              ' x ' + currConstrSize.sizes[1] + ')';
          } else if(currConsist.rules_type_id === 21) {
            fullSize = currConstrSize.sizes[0];
            currSize = currConstrSize.sizes[0];
          } else if(currConsist.rules_type_id === 22) {
            fullSize = currConstrSize.sizes[1];
            currSize = currConstrSize.sizes[1];
          } else {
            currSize = currConstrSize.square;
          }
        } else {
          fullSize = GeneralServ.roundingValue((currConstrSize + mainKit.amendment_pruning), 3);
          currSize = currConstrSize;
        }
        if(currConsist.child_type === "list") {
          currConsist.newValue = getValueByRule(fullSize, currConsist.value, currConsist.rules_type_id);
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
        var consistQty = consistArr.length, el;
        for (el = 0; el < consistQty; el+=1) {
          if(currConsist.parent_list_id === consistArr[el].child_id && currConsist.parentId === consistArr[el].id){
            var wasteValue = (consistArr[el].waste) ? (1 + (consistArr[el].waste / 100)) : 1,
                newValue = 1;
            if(currConsist.child_type === "list") {
              currConsist.newValue = getValueByRule(
                consistArr[el].newValue, currConsist.value, currConsist.rules_type_id
              );
            }
            if(consistArr[el].rules_type_id === 2) {
              if(currConsist.rules_type_id === 2 || currConsist.rules_type_id === 4 || currConsist.rules_type_id === 15) {
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





    function culcPriceConsistElem(group, currConsist, currConsistElem, currConstrSize, mainKit, priceObj) {
      /** if hardware */
      if(group === priceObj.consist.length-1) {
        //console.warn('-------hardware------- currConsist', currConsist);
        //console.warn('-------hardware------- currConsistElem', currConsistElem);
        //console.warn('-------hardware------- mainKit', mainKit);
        //console.warn('-------hardware------- currConstrSize', currConstrSize);
        if(angular.isArray(currConsistElem)) {
          var hwElemQty = currConsistElem.length,
              openDirQty = currConstrSize.openDir.length,
              hwInd;
          for(hwInd = 0; hwInd < hwElemQty; hwInd+=1) {
            if(angular.isArray(currConsistElem[hwInd])) {
              var hwElemQty2 = currConsistElem[hwInd].length,
                  hwInd2;
              hwElemLoop: for(hwInd2 = 0; hwInd2 < hwElemQty2; hwInd2+=1) {
                //------ check direction
                if(checkDirectionConsistElem(currConsist[hwInd][hwInd2], currConstrSize.openDir, openDirQty)) {
      //                  console.warn('-------hardware----2--- currConsist', currConsist[hwInd][hwInd2]);
      //                  console.warn('-------hardware----2--- currConsistElem', currConsistElem[hwInd][hwInd2]);

                  var objTmp = angular.copy(currConsistElem[hwInd][hwInd2]), priceReal = 0, wasteValue = 1;

                  if (currConsist[hwInd][hwInd2].parent_list_id === mainKit[hwInd].child_id) {
                    //                    console.warn('-------hardware----2--- mainKit', mainKit[hwInd]);
                    wasteValue = (mainKit[hwInd].waste) ? (1 + (mainKit[hwInd].waste / 100)) : 1;
                    objTmp.qty = getValueByRule(
                      mainKit[hwInd].count, currConsist[hwInd][hwInd2].value, currConsist[hwInd][hwInd2].rules_type_id
                    );
                    if (currConsist[hwInd][hwInd2].child_type === "list") {
                      currConsist[hwInd][hwInd2].newValue = angular.copy(objTmp.qty);
                    }
                  } else {
                    for (var el = 0; el < hwElemQty2; el+=1) {
                      if (currConsist[hwInd][hwInd2].parent_list_id === currConsist[hwInd][el].child_id && currConsist[hwInd][hwInd2].parentId === currConsist[hwInd][el].id) {
                        //                        console.warn('-------hardware------- parent list', currConsist[hwInd][el]);
                        if(!checkDirectionConsistElem(currConsist[hwInd][el], currConstrSize.openDir, openDirQty)) {
                          continue hwElemLoop;
                        }
                        wasteValue = (currConsist[hwInd][el].waste) ? (1 + (currConsist[hwInd][el].waste / 100)) : 1;
                        objTmp.qty = getValueByRule(
                          currConsist[hwInd][el].newValue,
                          currConsist[hwInd][hwInd2].value,
                          currConsist[hwInd][hwInd2].rules_type_id
                        );
                        if (currConsist[hwInd][hwInd2].child_type === "list") {
                          currConsist[hwInd][hwInd2].newValue = angular.copy(objTmp.qty);
                        }
                      }
                    }
                  }

                  priceReal = objTmp.qty * currConsistElem[hwInd][hwInd2].price * wasteValue;
                  //console.log('++++++', priceReal, objTmp.qty, currConsistElem[hwInd][hwInd2].price, wasteValue);
                  if (priceReal) {
                    /** currency conversion */
                    if (UserStor.userInfo.currencyId != currConsistElem[hwInd][hwInd2].currency_id) {
                      priceReal = currencyExgange(priceReal, currConsistElem[hwInd][hwInd2].currency_id);
                    }
                    objTmp.priceReal = GeneralServ.roundingValue(priceReal, 3);
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
        if(angular.isArray(currConsistElem)) {
          //console.log('array');
          //console.info('1-----', group);
          //console.info('2-----', currConstrSize);
          //console.info('3-----', mainKit);
          var elemQty = currConsistElem.length, elemInd;
          for (elemInd = 0; elemInd < elemQty; elemInd+=1) {
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
                group, currConstrSize, mainKit, currConsist[elemInd], currConsistElem[elemInd], currConsist, priceObj
              );
            }
          }
        } else {
          //          console.log('object');
          /** if beads */
          if(group === 6) {
            var sizeQty = currConstrSize.sizes.length;
            while(--sizeQty > -1) {
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
              group, currConstrSize, mainKit, currConsist, currConsistElem, priceObj.consist[group], priceObj
            );
          }
        }
      }
    }





    function culcConsistPrice(priceObj, construction) {
      var groupQty = priceObj.consist.length,
          group;

      for(group = 0; group < groupQty; group+=1) {
        if(priceObj.consist[group]) {
          //console.log('         ');
          //console.log('Group  ---------------------', group);
          var sizeQty = construction.sizes[group].length,
              consistQty = priceObj.consist[group].length;

          if(consistQty) {

            if(angular.isArray(priceObj.kits[group])) {
              //              console.info('culcConsistPrice ===== array');
              //                console.info('1-----', group);
              //                console.info('2-----', construction.sizes[group]);
              //                console.info('3-----', priceObj.kits[group]);
              //                console.info('4-----', priceObj.consist[group]);
              //                console.info('5-----', priceObj.consistElem[group]);

              for(var elem = 0; elem < consistQty; elem+=1) {
                /** if glass or beads */
                if(group === 5 || group === 6) {
                  var sizeObjQty = construction.sizes[group].length;
                  for(var s = 0; s < sizeObjQty; s+=1) {
                    if(construction.sizes[group][s].elemId === priceObj.kits[group][elem].id) {
                      if(priceObj.consistElem[group][elem]) {
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
                  if(priceObj.consistElem[group][elem]) {
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
              for(var s = 0; s < sizeQty; s+=1) {
                for (var elem = 0; elem < consistQty; elem+=1) {
                  if(priceObj.consistElem[group][elem]) {
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
      //console.info('START+++', construction);

      parseMainKit(construction).then(function(kits) {
        //console.warn('kits!!!!!!+', kits);
        priceObj.kits = kits;

        /** collect Kit Children Elements*/
        parseKitConsist(priceObj.kits).then(function(consist){
          //console.warn('consist!!!!!!+', consist);
          priceObj.consist = consist;

          parseKitElement(priceObj.kits).then(function(kitsElem) {
            //console.warn('kitsElem!!!!!!+', kitsElem);
            priceObj.kitsElem = kitsElem;

            parseConsistElem(priceObj.consist).then(function(consistElem){
              //console.warn('consistElem!!!!!!+', consistElem);
              priceObj.consistElem = consistElem;
              priceObj.constrElements = culcKitPrice(priceObj, construction.sizes);
              culcConsistPrice(priceObj, construction);
              priceObj.priceTotal = GeneralServ.roundingValue(priceObj.priceTotal);
              //console.info('FINISH====:', priceObj);
              finishPriceObj.constrElements = angular.copy(priceObj.constrElements);
              finishPriceObj.priceTotal = (isNaN(priceObj.priceTotal)) ? 0 : angular.copy(priceObj.priceTotal);
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
        elemObj.price = GeneralServ.roundingValue(currencyExgange(elemObj.price, elemObj.currency_id), 3);
      }
      elemObj.qty = (kit) ? kit.value : 1;
      elemObj.size = 0;
      elemObj.priceReal = GeneralServ.roundingValue((elemObj.price * elemObj.qty), 3);
      container.priceTot += elemObj.priceReal;
      container.elements.push(elemObj);
    }



    function calcDoorElemPrice(handleSource, lockSource) {
      var deffMain = $q.defer(),
          priceObj = {
            priceTot: 0,
            elements: []
          };
      var list = lockSource.filter(function(list) {
        list.child_id = list.parent_element_id;
        list.child_type = list.position;
        list.value = list.count;
        return list.position === 'list'
      });
      var elements = lockSource.filter(function(element) {
        element.child_id = element.parent_element_id;
        element.child_type = element.position;
        element.value = element.count;
        return element.position === 'element'
      });
          
      getElementByListId(0, handleSource.parent_element_id).then(function(handleData) {
        //console.info('price handle kit', handleData);
        getDoorElem(priceObj, handleData);
        (function nextRecord() {
            if (list.length) {
              var firstKit = list.shift(0),
                  firstKitId = 0;
                  firstKitId = firstKit;
                  var kit = {};
            selectLocalDB(tablesLocalDB.lists.tableName, {id: firstKitId.parent_element_id}).then(function(result) {
                getElementByListId(0, result[0].parent_element_id).then(function(lockData) {
                    kit.value = firstKitId.count;
                  //console.info('price lock kit', lockData);
                  getDoorElem(priceObj, lockData, kit);
                nextRecord();
                });
            });
        } else {
            priceObj.consist = elements;
            parseConsistElem([priceObj.consist]).then(function(consistElem) {
                //console.warn('consistElem!!!!!!+', consistElem);
                priceObj.consistElem = consistElem[0];
                var elemsQty = priceObj.consist.length;
                while(--elemsQty > -1) {
                  getDoorElem(priceObj, priceObj.consistElem[elemsQty], priceObj.consist[elemsQty]);
                }
                priceObj.priceTot = (isNaN(priceObj.priceTot)) ? 0 : GeneralServ.roundingValue(priceObj.priceTot);
                //console.warn('!!!!!!+', priceObj);
                deffMain.resolve(priceObj);
            });
          }
        })();

      });
      return deffMain.promise;
    }



    /**========= ADDELEMENT PRICE ==========*/

    function getAdditionalPrice(AddElement){
        //602829HA
        if(AddElement.elementWidth === 0 && AddElement.elementHeight === 0) {
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
        getKitByID(AddElement.elementId).then(function(kits) {
          if(kits) {
            priceObj.kits = angular.copy(kits);
            //console.warn('kits!!!!!!+', kits);
            /** parse Kit Element */
            getElementByListId(0, priceObj.kits.parent_element_id ).then(function(kitsElem){
              priceObj.kitsElem = angular.copy(kitsElem);
              //console.warn('kitsElem!!!!!!+', kitsElem);
              parseConsistElem([priceObj.consist]).then(function(consist){

                //console.warn('consistElem!!!!!!+', consist[0]);
                priceObj.consistElem = angular.copy(consist[0]);
                if (AddElement.elementWidth > 0) {
                  /** culc Kit Price */

                  var sizeSource = 0,
                      sizeTemp = 0;
                  //------ if height is existed
                  if(AddElement.elementHeight) {
                    sizeSource = GeneralServ.roundingValue((AddElement.elementWidth * AddElement.elementHeight), 3);
                    sizeTemp = GeneralServ.roundingValue(((AddElement.elementWidth + priceObj.kits.amendment_pruning)*(AddElement.elementHeight + priceObj.kits.amendment_pruning)), 3);
                  } else {
                    sizeSource = AddElement.elementWidth;
                    sizeTemp = (AddElement.elementWidth + priceObj.kits.amendment_pruning);
                  }
                  var wasteValue = (priceObj.kits.waste) ? (1 + (priceObj.kits.waste / 100)) : 1,
                      constrElem = angular.copy(priceObj.kitsElem),
                      priceTemp = GeneralServ.roundingValue((sizeTemp * constrElem.price) * wasteValue);

                  //console.warn('!!!!!!+', sizeSource, sizeTemp);
                  /** currency conversion */
                  if (UserStor.userInfo.currencyId != constrElem.currency_id){
                    priceTemp = currencyExgange(priceTemp, constrElem.currency_id);
                  }
                  constrElem.qty = 1;
                  constrElem.size = sizeTemp;
                  constrElem.priceReal = priceTemp;
                  priceObj.priceTotal += priceTemp;
                  priceObj.constrElements.push(constrElem);
                  //console.warn('constrElem!!!!!!+', constrElem);

                  /** culc Consist Price */

                  if(priceObj.consistElem) {
                    var consistQty = priceObj.consist.length;
                    if(consistQty) {
                      for(var cons = 0; cons < consistQty; cons++) {
                        //                          console.warn('child++++', priceObj.consist[cons]);
                        if(priceObj.consist[cons]) {
                          if (priceObj.consist[cons].parent_list_id === AddElement.elementId) {
                            if(priceObj.consist[cons].child_type === "list") {
                              priceObj.consist[cons].newValue = getValueByRule(
                                sizeTemp, priceObj.consist[cons].value, priceObj.consist[cons].rules_type_id
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
                              if(priceObj.consist[cons].parent_list_id === priceObj.consist[el].child_id && priceObj.consist[cons].parentId === priceObj.consist[el].id){
                                //                                  console.warn('parent++++', priceObj.consist[el]);
                                wasteValue = (priceObj.consist[el].waste) ? (1+(priceObj.consist[el].waste / 100)) : 1;
                                if(priceObj.consist[cons].child_type === "list") {
                                  priceObj.consist[cons].newValue = getValueByRule(
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
                priceObj.priceTotal = GeneralServ.roundingValue(priceObj.priceTotal);
                //console.info('FINISH ADD ====:', priceObj);
                finishPriceObj.constrElements = angular.copy(priceObj.constrElements);
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
            constrElements: [], priceTotal: 0
          };
      grid.element_width /= 1000;
      grid.element_height /= 1000;
      //console.info('START+++', AddElement, grid);

      /** parse Kit */
      $q.all([
        getKitByID(grid.cloth_id),
        getKitByID(grid.top_id)
      ]).then(function (kits) {
        var prof = angular.copy(kits[1]);
        priceObj.kits = angular.copy(kits);
        //--- add other profiles
        priceObj.kits.push(prof, prof, prof);
        //console.warn('kits!!!!!!+', priceObj.kits);

        $q.all([
          getElementByListId(0, kits[0].parent_element_id ),
          getElementByListId(0, kits[1].parent_element_id )
        ]).then(function (kitsElem) {
          var wasteList = [
                grid.cloth_waste,
                grid.top_waste,
                grid.right_waste,
                grid.bottom_waste,
                grid.left_waste
              ],
              kitsQty = wasteList.length, k,
              tempW, tempH,
              sizeTemp, wasteValue, priceTemp;

          priceObj.kitsElem = angular.copy(kitsElem);
          //--- add other profiles
          priceObj.kitsElem.push(
            angular.copy(kitsElem[1]), angular.copy(kitsElem[1]), angular.copy(kitsElem[1])
          );
          //console.warn('kitsElem!!!!!!+', priceObj.kitsElem);

          /** culc Kit Price */
          for(k = 0; k < kitsQty; k+=1) {
            wasteValue = (priceObj.kits[k].waste) ? (1 + (priceObj.kits[k].waste / 100)) : 1;
            if(priceObj.kitsElem[k]) {
              tempW = (grid.element_width + priceObj.kits[k].amendment_pruning - (wasteList[k]/1000));
              tempH = (grid.element_height + priceObj.kits[k].amendment_pruning - (wasteList[k]/1000));
              if(k === 1 || k === 3) {
                //----- profiles horizontal
                sizeTemp = GeneralServ.roundingValue(tempW, 3);
              } else if(k === 2 || k === 4) {
                //----- profiles vertical
                sizeTemp = GeneralServ.roundingValue(tempH, 3);
              } else {
                //----- grid
                sizeTemp = GeneralServ.roundingValue((tempW * tempH), 3);
              }
              priceTemp = GeneralServ.roundingValue((sizeTemp * priceObj.kitsElem[k].price) * wasteValue);

              //console.warn('!!!!!!+', sizeTemp, constrElem.price, wasteValue);
              /** currency conversion */
              if (UserStor.userInfo.currencyId != priceObj.kitsElem[k].currency_id) {
                priceTemp = GeneralServ.roundingValue(currencyExgange(priceTemp, priceObj.kitsElem[k].currency_id));
              }
              priceObj.kitsElem[k].qty = 1;
              priceObj.kitsElem[k].size = sizeTemp;
              priceObj.kitsElem[k].priceReal = priceTemp;
              priceObj.priceTotal += priceTemp;
              priceObj.constrElements.push(priceObj.kitsElem[k]);
              //console.warn('constrElem!!!!!!+', priceObj.kitsElem[k]);
            }

          }
        });

        /** collect Kit Children Elements*/
        $q.all([
          parseListContent(grid.top_id),
          parseListContent(grid.right_id),
          parseListContent(grid.bottom_id),
          parseListContent(grid.left_id)
        ]).then(function (result) {
          priceObj.consist = angular.copy(result);
          //console.warn('list-contents!!!!!!+', result);

          parseConsistElem(priceObj.consist).then(function (consist) {
            var consistQty, elemQty, cons, el, wasteValue, sizeSource;
            //console.warn('consistElem!!!!!!+', consist);
            priceObj.consistElem = angular.copy(consist);

            /** culc Consist Price */

            if(priceObj.consistElem) {
              consistQty = priceObj.consist.length;
              if(consistQty) {
                for(cons = 0; cons < consistQty; cons+=1) {
                  //console.warn('parent++++', priceObj.consist[cons]);
                  elemQty = priceObj.consist[cons].length;
                  if(elemQty) {
                    wasteValue = 1;
                    sizeSource = priceObj.kitsElem[cons+1].size;

                    for (el = 0; el < elemQty; el+=1) {
                      priceObj.consist[cons][el].newValue = getValueByRuleGrid(
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
                        0,//priceObj.consist[cons][el].amendment_pruning,
                        wasteValue,
                        priceObj
                      );
                    }
                  }
                }
              }
            }
            priceObj.priceTotal = GeneralServ.roundingValue(priceObj.priceTotal);
            //console.info('FINISH ADD ====:', priceObj);
            //console.info('FINISH ADD ====:', JSON.stringify(priceObj.constrElements));
            finishPriceObj.constrElements = angular.copy(priceObj.constrElements);
            finishPriceObj.priceTotal = angular.copy(priceObj.priceTotal);
            deffMain.resolve(finishPriceObj);
          });

        });

      });

      return deffMain.promise;
    }

    /**========== FINISH ==========*/



    thisFactory.publicObj = {
      tablesLocalDB: tablesLocalDB,
      tablesLocationLocalDB: tablesLocationLocalDB,

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
      getAdditionalPrice: getAdditionalPrice,
      calculationGridPrice: calculationGridPrice,
      calcDoorElemPrice: calcDoorElemPrice,
      currencyExgange: currencyExgange
    };

    return thisFactory.publicObj;


  });
})();