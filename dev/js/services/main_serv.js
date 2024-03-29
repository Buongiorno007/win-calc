(function () {
    "use strict";
    /**@ngInject*/
    angular
        .module("MainModule")
        .factory("MainServ", function ($location,
            $q,
            $filter,
            $timeout,
            $rootScope,
            localDB,
            GeneralServ,
            SVGServ,
            loginServ,
            optionsServ,
            AnalyticsServ,
            GlobalStor,
            OrderStor,
            ProductStor,
            UserStor,
            AuxStor,
            CartStor,
            DesignStor,
            HistoryStor,
            globalConstants) {
            /*jshint validthis:true */
            var thisFactory = this;

            /**============ METHODS ================*/
            var db = localforage.createInstance({
                driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
                name: 'bauvoice',
                version: 2.0,
                size: 4980736, // Size of database, in bytes. WebSQL-only for now.
                storeName: 'bauvoice', // Should be alphanumeric, with underscores.
                description: 'some description'
            });

            function getOnline() {
                $.get(globalConstants.serverIP, function () {
                    GlobalStor.global.onlineMode = true;
                    return true;
                }).fail(function () {
                    GlobalStor.global.onlineMode = false;
                    return false;
                });
            }

            getOnline();

            /**---------- Close Room Selector Dialog ---------*/
            function closeRoomSelectorDialog() {
                GlobalStor.global.showRoomSelectorDialog = 0;
                GlobalStor.global.selectRoom = 1;
                GlobalStor.global.configMenuTips = GlobalStor.global.startProgramm ?
                    1 :
                    0;
                //playSound('fly');
            }

            function setDefaultDoorConfig() {
                ProductStor.product.door_shape_id = 0;
                ProductStor.product.door_type_index = 0;
                ProductStor.product.door_sash_shape_id = 0;
                ProductStor.product.door_handle_shape_id = 0;
                ProductStor.product.door_lock_shape_id = 0;
                ProductStor.product.doorName = "";
                ProductStor.product.doorSashName = "";
                ProductStor.product.doorHandle = {};
                ProductStor.product.doorLock = {};
                DesignStor.design.steps.selectedStep1 = 0;
                DesignStor.design.steps.selectedStep2 = 0;
                DesignStor.design.steps.selectedStep3 = 0;
                DesignStor.design.steps.selectedStep4 = 0;
                DesignStor.designSource.steps.selectedStep1 = 0;
                DesignStor.designSource.steps.selectedStep2 = 0;
                DesignStor.designSource.steps.selectedStep3 = 0;
                DesignStor.designSource.steps.selectedStep4 = 0;
            }

            function setDefaultAuxParam() {
                AuxStor.aux.isWindowSchemeDialog = 0;
                AuxStor.aux.isAddElementListView = 0;
                AuxStor.aux.isFocusedAddElement = 0;
                AuxStor.aux.isTabFrame = 0;
                AuxStor.aux.isAddElementListView = 0;
                AuxStor.aux.showAddElementsMenu = 0;
                AuxStor.aux.addElementGroups.length = 0;
                AuxStor.aux.searchingWord = "";
                AuxStor.aux.isGridSelectorDialog = 0;
            }

            function prepareMainPage() {
                GlobalStor.global.isNavMenu = 0;
                GlobalStor.global.isConfigMenu = 1;
                GlobalStor.global.activePanel = 0;
                setDefaultAuxParam();
                // if (GlobalStor.global.startProgramm) {
                //   $timeout(function () {
                //     GlobalStor.global.showRoomSelectorDialog = 1;
                //   }, 2000);
                //   // $timeout(closeRoomSelectorDialog, 5000);
                // }
            }

            function saveUserEntry() {
                $timeout(function () {
                    localDB.exportUserEntrance(
                        UserStor.userInfo.phone,
                        UserStor.userInfo.device_code
                    );
                }, 5000);

                //TODO offline
                //      ++UserStor.userInfo.entries;
                //      var data = {entries: UserStor.userInfo.entries},
                //          dataToSend = [
                //            {
                //              model: 'users',
                //              rowId: UserStor.userInfo.id,
                //              field: JSON.stringify(data)
                //            }
                //          ];
                //       localDB.updateLocalDB(localDB.tablesLocalDB.user.tableName, data, {'id': UserStor.userInfo.id});
                //       localDB.updateServer(UserStor.userInfo.phone, UserStor.userInfo.device_code, dataToSend).then(function(data) {
                //        if(!data) {
                //          //----- if no connect with Server save in Export LocalDB
                //          localDB.insertRowLocalDB(dataToSend, localDB.tablesLocalDB.export.tableName);
                //        }
                //      });
            }


            /**  Create Order Id and Date */

            function createOrderID() {
                var currTime = new Date().getTime().toString();
                return (
                    (UserStor.userInfo.id + "" + currTime.slice(4, currTime.length)) * 1
                );
            }

            function createOrderData() {
                var productDay;
                //----------- create order number for new project
                OrderStor.order.id = createOrderID();
                //------ set delivery day
                OrderStor.order.order_date = new Date().getTime();
                productDay =
                    new Date(OrderStor.order.order_date).getDate() +
                    GlobalStor.global.deliveryCoeff.standart_time;
                OrderStor.order.delivery_date = new Date().setDate(productDay);
                OrderStor.order.new_delivery_date = angular.copy(
                    OrderStor.order.delivery_date
                );
            }

            function setCurrDiscounts() {
                OrderStor.order.discount_construct = angular.copy(
                    UserStor.userInfo.discountConstr
                );
                OrderStor.order.discount_addelem = angular.copy(
                    UserStor.userInfo.discountAddElem
                );
            }

            function setCurrTemplate() {
                let room = 6;
                if (globalConstants.serverIP === 'http://api.calc.csokna.ru') {
                    room = 0;
                }
                if (!GlobalStor.global.rooms[room]) {
                    room = 0;
                }
                ProductStor.product.construction_type =
                    GlobalStor.global.rooms[room].group_id;
                ProductStor.product.template_id =
                    GlobalStor.global.rooms[room].template_id - 1;
                ProductStor.product.room_id =
                    GlobalStor.global.rooms[room].template_id - 1;
            }

            //-------- get default json template
            function downloadAllTemplates(type) {
                var deferred = $q.defer();

                switch (type) {
                    case 1:
                        optionsServ.getTemplatesWindow(function (results) {
                            if (results.status) {
                                
                                GlobalStor.global.templateLabel = $filter("translate")(
                                    "panels.TEMPLATE_WINDOW"
                                );
                                deferred.resolve(results.data.windows);
                            } else {
                                console.log(results);
                            }
                        });
                        
                        break;
                    case 2:
                        optionsServ.getTemplatesWindowDoor(function (results) {
                            if (results.status) {
                                GlobalStor.global.templateLabel = $filter("translate")(
                                    "panels.TEMPLATE_BALCONY_ENTER"
                                );
                                deferred.resolve(results.data.windowDoor);
                            } else {
                                console.log(results);
                            }
                        });
                        break;
                    case 3:
                        optionsServ.getTemplatesBalcony(function (results) {
                            if (results.status) {
                                GlobalStor.global.templateLabel = $filter("translate")(
                                    "panels.TEMPLATE_BALCONY"
                                );
                                deferred.resolve(results.data.balconies);
                            } else {
                                console.log(results);
                            }
                        });
                        break;
                    case 4:
                        optionsServ.getTemplatesDoor(function (results) {
                            if (results.status) {
                                GlobalStor.global.templateLabel = $filter("translate")(
                                    "panels.TEMPLATE_DOOR"
                                );
                                deferred.resolve(results.data.doors);
                            } else {
                                console.log(results);
                            }
                        });
                        break;
                }
                return deferred.promise;
            }

            function fineItemById(id, list) {
                var typeQty = list.length,
                    itemQty;
                while (--typeQty > -1) {
                    itemQty = list[typeQty].length;
                    while (--itemQty > -1) {
                        if (list[typeQty][itemQty].id === id) {
                            return list[typeQty][itemQty];
                        }
                    }
                }
            }

            function downloadProfileDepth(elementId) {
                var defer = $q.defer();
                // console.time("selectLocalDB");
                localDB
                    .selectLocalDB("lists", {
                        id: elementId
                    })
                    .then(function (result) {
                        // console.timeEnd("selectLocalDB");
                        var resultObj = {};
                        if (result.length) {
                            resultObj.a = result[0].a;
                            resultObj.b = result[0].b;
                            resultObj.c = result[0].c;
                            resultObj.d = result[0].d;
                        }
                        defer.resolve(resultObj);
                    });
                return defer.promise;
            }

            //-------- set default profile
            function setCurrentProfile(product, id) {
                var deferred = $q.defer();
                var laminat = 0;
                for (var i = 0; i < GlobalStor.global.laminatCouples.length; i++) {
                    if (GlobalStor.global.laminatCouples[i].lamination_in_id === product.lamination.lamination_in_id && GlobalStor.global.laminatCouples[i].lamination_out_id === product.lamination.lamination_out_id && id === GlobalStor.global.laminatCouples[i].profile_id) {
                        laminat = angular.copy(GlobalStor.global.laminatCouples[i]);
                        break;
                    }
                }
                if (id) {

                    product.profile = angular.copy(
                        fineItemById(id, GlobalStor.global.profiles)
                    );
                } else {
                    product.profile = angular.copy(GlobalStor.global.profiles[0][0]);
                    product.currencies = angular.copy(GlobalStor.global.currencies);
                }
                var data = null
                function needed_data() {
                    var defer = $q.defer();
                    db.getItem('tables').then(function (value) {
                        data = value;
                        defer.resolve(data);
                    }).catch(function (err) {
                        console.log(err);
                        defer.resolve(0);
                    });
                    return defer.promise;
                }  
                needed_data().then(
                    function(data) {
                        try {
/*Here there are a lot of loops that go through already existing arrays in global store. They are made for adding translations.
                        Not everything is very pretty here, but it works. It's better to refactor some places so that it just takes up less space*/
                        /* TODO */ 
                        //Block for profiles and profiles descriptions translations ***
                        product.locales_names_addition_folders = data
                        GlobalStor.global.locales_names_addition_folders = data
                        //There are only profiles systems here
                        const array_size = 100;
                        const profiles_systems = [];
                        for (let i = 0; i < GlobalStor.global.locales_names_addition_folders.locales_names_profile_systems.length; i += array_size) {
                            profiles_systems.push(GlobalStor.global.locales_names_addition_folders.locales_names_profile_systems.slice(i, i + array_size));
                        }
                        GlobalStor.global.locales_names_addition_folders.locales_names_profile_systems.push(profiles_systems);
                        const filtered_array_by_name = profiles_systems[0].filter(element => element.table_attr === "name")
                        let profiles_data_profiles_types_array = GlobalStor.global.profiles[0];
                        let profiles_data_second_array = GlobalStor.global.profiles[1];
                        //Loop that runs through the profiles and pushes there translations from a filtered array
                        for(let i = 0; i < profiles_data_profiles_types_array.length; i++) {
                            for(let y = 0; y < filtered_array_by_name.length; y++) {
                                if(profiles_data_profiles_types_array[i].id === filtered_array_by_name[y].table_id) {
                                    profiles_data_profiles_types_array[i]["translate"] = filtered_array_by_name[y]
                                }
                            }
                        }
                        //Loop that runs through the profiles and pushes there translations from a filtered array. Second one
                        for(let i = 0; i < profiles_data_second_array.length; i++) {
                            for(let y = 0; y < filtered_array_by_name.length; y++) {
                                if(profiles_data_second_array[i].id === filtered_array_by_name[y].table_id) {
                                    profiles_data_second_array[i]["translate"] = filtered_array_by_name[y]
                                }
                            }
                        }
                        //Filtred array contains only descriptions translations
                        const filtered_array_by_description = profiles_systems[0].filter(element => element.table_attr === "description")
                        for(let i = 0; i < profiles_data_profiles_types_array.length; i++) {
                            for(let y = 0; y < filtered_array_by_description.length; y++) {
                                if(profiles_data_profiles_types_array[i].id === filtered_array_by_description[y].table_id) {
                                    profiles_data_profiles_types_array[i]["description"] = filtered_array_by_description[y]
    
                                }
                            }
                        }

                        for(let i = 0; i < profiles_data_second_array.length; i++) {
                            for(let y = 0; y < filtered_array_by_description.length; y++) {
                                if(profiles_data_second_array[i].id === filtered_array_by_description[y].table_id) {
                                    profiles_data_second_array[i]["description"] = filtered_array_by_description[y]
                                }
                            }
                        }
                        //Block for profiles and profiles descriptions translations end ***

                        //Block for systems_folders translation start ***
                        const system_folders = [];
                        for (let i = 0; i < GlobalStor.global.locales_names_addition_folders.locales_names_profile_system_folders; i += array_size) {
                            system_folders.push(GlobalStor.global.locales_names_addition_folders.locales_names_profile_system_folders.slice(i, i + array_size));
                        }
                        system_folders.push(GlobalStor.global.locales_names_addition_folders.locales_names_profile_system_folders);
                        //Filtred array contains only system_folders names
                        const filtered_array = system_folders[0].filter(element => element.table_attr === "name")
                        let profiles_types_array = GlobalStor.global.profilesType;
                        for(let i = 0; i < profiles_types_array.length; i++) {
                            for(let y = 0; y < filtered_array.length; y++) {
                                if(profiles_types_array[i].id === filtered_array[y].table_id) {
                                    profiles_types_array[i]["translate"] = filtered_array[y]
                                }
                            }
                        }
                        const array_filtered_by_description_profile_system_folder = system_folders[0].filter(element => element.table_attr === "description")
                        for(let i = 0; i < profiles_types_array.length; i++) {
                            for(let y = 0; y < array_filtered_by_description_profile_system_folder.length; y++) {
                                if(profiles_types_array[i].id === array_filtered_by_description_profile_system_folder[y].table_id) {
                                    profiles_types_array[i]["description"] = array_filtered_by_description_profile_system_folder[y]
                                }
                            }
                        }
                        
                        //Block for systems_folders translation end ***
                        
                        //Block for glasses folder starts ***
                        const glasses_folders = [];
                        for (let i = 0; i < GlobalStor.global.locales_names_addition_folders.locales_names_glass_folders; i += array_size) {
                            glasses_folders.push(GlobalStor.global.locales_names_addition_folders.locales_names_glass_folders.slice(i, i + array_size));
                        }
                        glasses_folders.push(GlobalStor.global.locales_names_addition_folders.locales_names_glass_folders);
                        const array_filtered_by_names_glasses_folders = glasses_folders[0].filter(element => element.table_attr === "name")
                        let glasses_folders_array_first = GlobalStor.global.glassTypes;
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                        for(let i = 0; i < glasses_folders_array_first.length; i++) {
                            for(let y = 0; y < array_filtered_by_names_glasses_folders.length; y++) {
                                if(glasses_folders_array_first[i].id === array_filtered_by_names_glasses_folders[y].table_id) {
                                    glasses_folders_array_first[i]["translate"] = array_filtered_by_names_glasses_folders[y]
                                }
                            }
                        }
                        const array_filtered_by_description_folders = glasses_folders[0].filter(element => element.table_attr === "description")
                        for(let i = 0; i < glasses_folders_array_first.length; i++) {
                           for(let y = 0; y < array_filtered_by_description_folders.length; y++) {
                               if(glasses_folders_array_first[i].id === array_filtered_by_description_folders[y].table_id) {
                                glasses_folders_array_first[i]["description"] = array_filtered_by_description_folders[y]
                               }
                           }
                       }
                        //Block for glasses folder end ***


                        //Block for hardware groups start***
                        const hardware_groups = [];
                        for (let i = 0; i < GlobalStor.global.locales_names_addition_folders.locales_names_window_hardware_groups; i += array_size) {
                            hardware_groups.push(GlobalStor.global.locales_names_addition_folders.locales_names_window_hardware_groups.slice(i, i + array_size));
                        }
                        hardware_groups.push(GlobalStor.global.locales_names_addition_folders.locales_names_window_hardware_groups);
                        const array_filtered_by_names_hardware_groups = hardware_groups[0].filter(element => element.table_attr === "name")
                        //First looop for first array
                        let hardware_groups_array_first = GlobalStor.global.hardwares[0];
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                        for(let i = 0; i < hardware_groups_array_first.length; i++) {
                            for(let y = 0; y < array_filtered_by_names_hardware_groups.length; y++) {
                                if(hardware_groups_array_first[i].id === array_filtered_by_names_hardware_groups[y].table_id) {
                                    hardware_groups_array_first[i]["translate"] = array_filtered_by_names_hardware_groups[y]
                                }
                            }
                        }
                        //Second loop for second array
                        let hardware_groups_array_second = GlobalStor.global.hardwares[1];
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                        for(let i = 0; i < hardware_groups_array_second.length; i++) {
                            for(let y = 0; y < array_filtered_by_names_hardware_groups.length; y++) {
                                if(hardware_groups_array_second[i].id === array_filtered_by_names_hardware_groups[y].table_id) {
                                    hardware_groups_array_second[i]["translate"] = array_filtered_by_names_hardware_groups[y]
                                }
                            }
                        }

                        const array_filtered_by_description_hardware_groups = hardware_groups[0].filter(element => element.table_attr === "description")
                        for(let i = 0; i < hardware_groups_array_first.length; i++) {
                           for(let y = 0; y < array_filtered_by_description_hardware_groups.length; y++) {
                               if(hardware_groups_array_first[i].id === array_filtered_by_description_hardware_groups[y].table_id) {
                                hardware_groups_array_first[i]["description"] = array_filtered_by_description_hardware_groups[y]
                               }
                           }
                       }
                        for(let i = 0; i < hardware_groups_array_second.length; i++) {
                           for(let y = 0; y < array_filtered_by_description_hardware_groups.length; y++) {
                               if(hardware_groups_array_second[i].id === array_filtered_by_description_hardware_groups[y].table_id) {
                                hardware_groups_array_second[i]["description"] = array_filtered_by_description_hardware_groups[y]
                               }
                           }
                       }
                        //Block for hardware goups end ***

                        //Block for hardware folders start ***
                        const hardware_folders = [];
                        for (let i = 0; i < GlobalStor.global.locales_names_addition_folders.locales_names_window_hardware_folders; i += array_size) {
                            hardware_folders.push(GlobalStor.global.locales_names_addition_folders.locales_names_window_hardware_folders.slice(i, i + array_size));
                        }
                        hardware_folders.push(GlobalStor.global.locales_names_addition_folders.locales_names_window_hardware_folders);
                        const array_filtered_by_names_hardware_folders = hardware_folders[0].filter(element => element.table_attr === "name")
                        //First looop for first array
                        let hardware_folders_array_first = GlobalStor.global.hardwareTypes;
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                        for(let i = 0; i < hardware_folders_array_first.length; i++) {
                            for(let y = 0; y < array_filtered_by_names_hardware_folders.length; y++) {
                                if(hardware_folders_array_first[i].id === array_filtered_by_names_hardware_folders[y].table_id) {
                                    hardware_folders_array_first[i]["translate"] = array_filtered_by_names_hardware_folders[y]
                                }
                            }
                        }
                        const array_filtered_by_description_hardware_folders = hardware_folders[0].filter(element => element.table_attr === "description")
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                        for(let i = 0; i < hardware_folders_array_first.length; i++) {
                            for(let y = 0; y < array_filtered_by_description_hardware_folders.length; y++) {
                                if(hardware_folders_array_first[i].id === array_filtered_by_description_hardware_folders[y].table_id) {
                                    hardware_folders_array_first[i]["description"] = array_filtered_by_description_hardware_folders[y]
                                }
                            }
                        }
                        //Block for hardware folders end ***


                        //Block for additional folders elements starts ***
                        const additional_folders = [];
                        for (let i = 0; i < GlobalStor.global.locales_names_addition_folders.locales_names_addition_folders; i += array_size) {
                            additional_folders.push(GlobalStor.global.locales_names_addition_folders.locales_names_addition_folders.slice(i, i + array_size));
                        }
                        additional_folders.push(GlobalStor.global.locales_names_addition_folders.locales_names_addition_folders);
                        const array_filtered_by_names_additional_folders = additional_folders[0].filter(element => element.table_attr === "name")
                        const array_filtered_by_descriptions_additional_folders = additional_folders[0].filter(element => element.table_attr === "description")

                        let additional_folders_array_zero = GlobalStor.global.addElementsAll[1].elementType;
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                         for(let i = 0; i < additional_folders_array_zero.length; i++) {
                             for(let y = 0; y < array_filtered_by_names_additional_folders.length; y++) {
                                 if(additional_folders_array_zero[i].id === array_filtered_by_names_additional_folders[y].table_id) {
                                    additional_folders_array_zero[i]["translate"] = array_filtered_by_names_additional_folders[y]
                                }
                            }
                        }
                        // Loop for description
                        for(let i = 0; i < additional_folders_array_zero.length; i++) {
                            for(let y = 0; y < array_filtered_by_descriptions_additional_folders.length; y++) {
                                if(additional_folders_array_zero[i].id === array_filtered_by_descriptions_additional_folders[y].table_id) {
                                   additional_folders_array_zero[i]["description"] = array_filtered_by_descriptions_additional_folders[y]
                                }
                            }
                        }
                        let additional_folders_array_first = GlobalStor.global.addElementsAll[2].elementType;
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                         for(let i = 0; i < additional_folders_array_first.length; i++) {
                             for(let y = 0; y < array_filtered_by_names_additional_folders.length; y++) {
                                 if(additional_folders_array_first[i].id === array_filtered_by_names_additional_folders[y].table_id) {
                                     additional_folders_array_first[i]["translate"] = array_filtered_by_names_additional_folders[y]
                                }
                            }
                        }
                        // Loop for description
                        for(let i = 0; i < additional_folders_array_first.length; i++) {
                            for(let y = 0; y < array_filtered_by_descriptions_additional_folders.length; y++) {
                                if(additional_folders_array_first[i].id === array_filtered_by_descriptions_additional_folders[y].table_id) {
                                    additional_folders_array_first[i]["description"] = array_filtered_by_descriptions_additional_folders[y]
                                }
                            }
                        }
                        let additional_folders_array_second = GlobalStor.global.addElementsAll[6].elementType;
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                         for(let i = 0; i < additional_folders_array_second.length; i++) {
                             for(let y = 0; y < array_filtered_by_names_additional_folders.length; y++) {
                                 if(additional_folders_array_second[i].id === array_filtered_by_names_additional_folders[y].table_id) {
                                    additional_folders_array_second[i]["translate"] = array_filtered_by_names_additional_folders[y]
                                }
                            }
                        }
                        // Loop for description
                        for(let i = 0; i < additional_folders_array_second.length; i++) {
                            for(let y = 0; y < array_filtered_by_descriptions_additional_folders.length; y++) {
                                if(additional_folders_array_second[i].id === array_filtered_by_descriptions_additional_folders[y].table_id) {
                                    additional_folders_array_second[i]["description"] = array_filtered_by_descriptions_additional_folders[y]
                                }
                            }
                        }
                        let additional_folders_array_third = GlobalStor.global.addElementsAll[8].elementType;
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                         for(let i = 0; i < additional_folders_array_third.length; i++) {
                             for(let y = 0; y < array_filtered_by_names_additional_folders.length; y++) {
                                 if(additional_folders_array_third[i].id === array_filtered_by_names_additional_folders[y].table_id) {
                                    additional_folders_array_third[i]["translate"] = array_filtered_by_names_additional_folders[y]
                                }
                            }
                        }
                        // Loop for description
                        for(let i = 0; i < additional_folders_array_third.length; i++) {
                            for(let y = 0; y < array_filtered_by_descriptions_additional_folders.length; y++) {
                                if(additional_folders_array_third[i].id === array_filtered_by_descriptions_additional_folders[y].table_id) {
                                    additional_folders_array_third[i]["description"] = array_filtered_by_descriptions_additional_folders[y]
                                }
                            }
                        }
                        let additional_folders_array_fourth = GlobalStor.global.addElementsAll[9].elementType;
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                         for(let i = 0; i < additional_folders_array_fourth.length; i++) {
                             for(let y = 0; y < array_filtered_by_names_additional_folders.length; y++) {
                                 if(additional_folders_array_fourth[i].id === array_filtered_by_names_additional_folders[y].table_id) {
                                    additional_folders_array_fourth[i]["translate"] = array_filtered_by_names_additional_folders[y]
                                }
                            }
                        }
                        // Loop for description
                        for(let i = 0; i < additional_folders_array_fourth.length; i++) {
                            for(let y = 0; y < array_filtered_by_descriptions_additional_folders.length; y++) {
                                if(additional_folders_array_fourth[i].id === array_filtered_by_descriptions_additional_folders[y].table_id) {
                                    additional_folders_array_fourth[i]["description"] = array_filtered_by_descriptions_additional_folders[y]
                                }
                            }
                        }
                        let additional_folders_array_fifth = GlobalStor.global.addElementsAll[10].elementType;
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                         for(let i = 0; i < additional_folders_array_fifth.length; i++) {
                             for(let y = 0; y < array_filtered_by_names_additional_folders.length; y++) {
                                 if(additional_folders_array_fifth[i].id === array_filtered_by_names_additional_folders[y].table_id) {
                                    additional_folders_array_fifth[i]["translate"] = array_filtered_by_names_additional_folders[y]
                                }
                            }
                        }
                        // Loop for description
                        for(let i = 0; i < additional_folders_array_fifth.length; i++) {
                            for(let y = 0; y < array_filtered_by_descriptions_additional_folders.length; y++) {
                                if(additional_folders_array_fifth[i].id === array_filtered_by_descriptions_additional_folders[y].table_id) {
                                    additional_folders_array_fifth[i]["description"] = array_filtered_by_descriptions_additional_folders[y]
                                }
                            }
                        }
                        let additional_folders_array_sixth = GlobalStor.global.addElementsAll[16].elementType;
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                         for(let i = 0; i < additional_folders_array_sixth.length; i++) {
                             for(let y = 0; y < array_filtered_by_names_additional_folders.length; y++) {
                                 if(additional_folders_array_sixth[i].id === array_filtered_by_names_additional_folders[y].table_id) {
                                    additional_folders_array_sixth[i]["translate"] = array_filtered_by_names_additional_folders[y]
                                }
                            }
                        }
                        // Loop for description
                        for(let i = 0; i < additional_folders_array_sixth.length; i++) {
                            for(let y = 0; y < array_filtered_by_descriptions_additional_folders.length; y++) {
                                if(additional_folders_array_sixth[i].id === array_filtered_by_descriptions_additional_folders[y].table_id) {
                                    additional_folders_array_sixth[i]["description"] = array_filtered_by_descriptions_additional_folders[y]
                                }
                            }
                        }
                        let additional_folders_array_seventh = GlobalStor.global.addElementsAll[17].elementType;
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                         for(let i = 0; i < additional_folders_array_seventh.length; i++) {
                             for(let y = 0; y < array_filtered_by_names_additional_folders.length; y++) {
                                 if(additional_folders_array_seventh[i].id === array_filtered_by_names_additional_folders[y].table_id) {
                                    additional_folders_array_seventh[i]["translate"] = array_filtered_by_names_additional_folders[y]
                                }
                            }
                        }
                        // Loop for description
                        for(let i = 0; i < additional_folders_array_seventh.length; i++) {
                            for(let y = 0; y < array_filtered_by_descriptions_additional_folders.length; y++) {
                                if(additional_folders_array_seventh[i].id === array_filtered_by_descriptions_additional_folders[y].table_id) {
                                    additional_folders_array_seventh[i]["description"] = array_filtered_by_descriptions_additional_folders[y]
                                }
                            }
                        }
                        //Block for additional folders elements end  ***


                        //Block for additional elements start ***
                        const additional_elements = [];
                        for (let i = 0; i < GlobalStor.global.locales_names_addition_folders.locales_names_lists; i += array_size) {
                            additional_elements.push(GlobalStor.global.locales_names_addition_folders.locales_names_lists.slice(i, i + array_size));
                        }
                        additional_elements.push(GlobalStor.global.locales_names_addition_folders.locales_names_lists);
                        const array_filtered_by_names_additional_elements = additional_elements[0].filter(element => element.table_attr === "name")
                        const array_filtered_by_description_additional_elements = additional_elements[0].filter(element => element.table_attr === "description")
                        /* Loop for zero element */
                        let additional_elements_array_first_zero = GlobalStor.global.addElementsAll[1].elementsList;
                        for(let i = 0; i < additional_elements_array_first_zero.length; i++) {
                            for(let y = 0; y < additional_elements_array_first_zero[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_names_additional_elements.length; z++) {
                                   if(additional_elements_array_first_zero[i][y].id === array_filtered_by_names_additional_elements[z].table_id) {
                                    additional_elements_array_first_zero[i][y]["translate"] =  array_filtered_by_names_additional_elements[z]
                                   }
                                }
                            }
                        }

                        for(let i = 0; i < additional_elements_array_first_zero.length; i++) {
                            for(let y = 0; y < additional_elements_array_first_zero[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_description_additional_elements.length; z++) {
                                    if(additional_elements_array_first_zero[i][y].id === array_filtered_by_description_additional_elements[z].table_id) {
                                        additional_elements_array_first_zero[i][y]["description"] = array_filtered_by_description_additional_elements[z]
                                    }
                                }
                            }
                        }
                        /* Loop for zero element end */
                        
                        /* Loop for first element  */
                        let additional_elements_array_first_first = GlobalStor.global.addElementsAll[1].elementsList;
                        for(let i = 0; i < additional_elements_array_first_first.length; i++) {
                            for(let y = 0; y < additional_elements_array_first_first[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_names_additional_elements.length; z++) {
                                   if(additional_elements_array_first_first[i][y].id === array_filtered_by_names_additional_elements[z].table_id) {
                                    additional_elements_array_first_first[i][y]["translate"] =  array_filtered_by_names_additional_elements[z]
                                   }
                                }
                            }
                        }

                        for(let i = 0; i < additional_elements_array_first_first.length; i++) {
                            for(let y = 0; y < additional_elements_array_first_first[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_description_additional_elements.length; z++) {
                                    if(additional_elements_array_first_first[i][y].id === array_filtered_by_description_additional_elements[z].table_id) {
                                        additional_elements_array_first_first[i][y]["description"] = array_filtered_by_description_additional_elements[z]
                                    }
                                }
                            }
                        }
                        /* Loop for first element  END*/

                        /* Loop for second element  */
                        let additional_elements_array_second = GlobalStor.global.addElementsAll[2].elementsList;
                        for(let i = 0; i < additional_elements_array_second.length; i++) {
                            for(let y = 0; y < additional_elements_array_second[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_names_additional_elements.length; z++) {
                                   if(additional_elements_array_second[i][y].id === array_filtered_by_names_additional_elements[z].table_id) {
                                    additional_elements_array_second[i][y]["translate"] =  array_filtered_by_names_additional_elements[z]
                                   }
                                }
                            }
                        }

                        for(let i = 0; i < additional_elements_array_second.length; i++) {
                            for(let y = 0; y < additional_elements_array_second[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_description_additional_elements.length; z++) {
                                    if(additional_elements_array_second[i][y].id === array_filtered_by_description_additional_elements[z].table_id) {
                                        additional_elements_array_second[i][y]["description"] = array_filtered_by_description_additional_elements[z]
                                    }
                                }
                            }
                        }
                        /* Loop for second element end */

                        /* For the sixth element */
                        let additional_elements_array_sixth_zero = GlobalStor.global.addElementsAll[6].elementsList;
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                        for(let i = 0; i < additional_elements_array_sixth_zero.length; i++) {
                            for(let y = 0; y < additional_elements_array_sixth_zero[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_names_additional_elements.length; z++) {
                                   if(additional_elements_array_sixth_zero[i][y].id === array_filtered_by_names_additional_elements[z].table_id) {
                                    additional_elements_array_sixth_zero[i][y]["translate"] =  array_filtered_by_names_additional_elements[z]
                                   }
                                }
                            }
                        }

                        for(let i = 0; i < additional_elements_array_sixth_zero.length; i++) {
                            for(let y = 0; y < additional_elements_array_sixth_zero[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_description_additional_elements.length; z++) {
                                    if(additional_elements_array_sixth_zero[i][y].id === array_filtered_by_description_additional_elements[z].table_id) {
                                        additional_elements_array_sixth_zero[i][y]["description"] = array_filtered_by_description_additional_elements[z]
                                    }
                                }
                            }
                        }
                        /* End loop for sixth element */

                        /* For the eight element */
                        let additional_elements_array_eighth_zero = GlobalStor.global.addElementsAll[8].elementsList;
                        for(let i = 0; i < additional_elements_array_eighth_zero.length; i++) {
                            for(let y = 0; y < additional_elements_array_eighth_zero[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_names_additional_elements.length; z++) {
                                   if(additional_elements_array_eighth_zero[i][y].id === array_filtered_by_names_additional_elements[z].table_id) {
                                    additional_elements_array_eighth_zero[i][y]["translate"] =  array_filtered_by_names_additional_elements[z]
                                   }
                                }
                            }
                        }

                        for(let i = 0; i < additional_elements_array_eighth_zero.length; i++) {
                            for(let y = 0; y < additional_elements_array_eighth_zero[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_description_additional_elements.length; z++) {
                                    if(additional_elements_array_eighth_zero[i][y].id === array_filtered_by_description_additional_elements[z].table_id) {
                                        additional_elements_array_eighth_zero[i][y]["description"] = array_filtered_by_description_additional_elements[z]
                                    }
                                }
                            }
                        }
                        /* End for eight element */

                        /* Loop for ninth element */
                        let additional_elements_array_ninth = GlobalStor.global.addElementsAll[9].elementsList;
                        for(let i = 0; i < additional_elements_array_ninth.length; i++) {
                            for(let y = 0; y < additional_elements_array_ninth[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_names_additional_elements.length; z++) {
                                   if(additional_elements_array_ninth[i][y].id === array_filtered_by_names_additional_elements[z].table_id) {
                                    additional_elements_array_ninth[i][y]["translate"] =  array_filtered_by_names_additional_elements[z]
                                   }
                                }
                            }
                        }

                        for(let i = 0; i < additional_elements_array_ninth.length; i++) {
                            for(let y = 0; y < additional_elements_array_ninth[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_description_additional_elements.length; z++) {
                                    if(additional_elements_array_ninth[i][y].id === array_filtered_by_description_additional_elements[z].table_id) {
                                        additional_elements_array_ninth[i][y]["description"] = array_filtered_by_description_additional_elements[z]
                                    }
                                }
                            }
                        }
                        /* Loop for ninth element end */
    
                        /* Loop for teenth element */
                        let additional_elements_array_teenth = GlobalStor.global.addElementsAll[10].elementsList;
                        for(let i = 0; i < additional_elements_array_teenth.length; i++) {
                            for(let y = 0; y < additional_elements_array_teenth[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_names_additional_elements.length; z++) {
                                   if(additional_elements_array_teenth[i][y].id === array_filtered_by_names_additional_elements[z].table_id) {
                                    additional_elements_array_teenth[i][y]["translate"] =  array_filtered_by_names_additional_elements[z]
                                   }
                                }
                            }
                        }

                        for(let i = 0; i < additional_elements_array_teenth.length; i++) {
                            for(let y = 0; y < additional_elements_array_teenth[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_description_additional_elements.length; z++) {
                                    if(additional_elements_array_teenth[i][y].id === array_filtered_by_description_additional_elements[z].table_id) {
                                        additional_elements_array_teenth[i][y]["description"] = array_filtered_by_description_additional_elements[z]
                                    }
                                }
                            }
                        }
                        /* Loop for teenth element end */

                        /* Loop for sixtenth element */
                        let additional_elements_array_sixteenth_zero = GlobalStor.global.addElementsAll[16].elementsList;
                        for(let i = 0; i < additional_elements_array_sixteenth_zero.length; i++) {
                            for(let y = 0; y < additional_elements_array_sixteenth_zero[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_names_additional_elements.length; z++) {
                                   if(additional_elements_array_sixteenth_zero[i][y].id === array_filtered_by_names_additional_elements[z].table_id) {
                                    additional_elements_array_sixteenth_zero[i][y]["translate"] =  array_filtered_by_names_additional_elements[z]
                                   }
                                }
                            }
                        }

                        for(let i = 0; i < additional_elements_array_sixteenth_zero.length; i++) {
                            for(let y = 0; y < additional_elements_array_sixteenth_zero[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_description_additional_elements.length; z++) {
                                    if(additional_elements_array_sixteenth_zero[i][y].id === array_filtered_by_description_additional_elements[z].table_id) {
                                        additional_elements_array_sixteenth_zero[i][y]["description"] = array_filtered_by_description_additional_elements[z]
                                    }
                                }
                            }
                        }
                        /* Loop for sixtenth element END */
                        
                        /* Loop for seventh element */
                        let additional_elements_array_seventeenth_zero = GlobalStor.global.addElementsAll[17].elementsList;
                        for(let i = 0; i < additional_elements_array_seventeenth_zero.length; i++) {
                            for(let y = 0; y < additional_elements_array_seventeenth_zero[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_names_additional_elements.length; z++) {
                                   if(additional_elements_array_seventeenth_zero[i][y].id === array_filtered_by_names_additional_elements[z].table_id) {
                                    additional_elements_array_seventeenth_zero[i][y]["translate"] =  array_filtered_by_names_additional_elements[z]
                                   }
                                }
                            }
                        }

                        for(let i = 0; i < additional_elements_array_seventeenth_zero.length; i++) {
                            for(let y = 0; y < additional_elements_array_seventeenth_zero[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_description_additional_elements.length; z++) {
                                    if(additional_elements_array_seventeenth_zero[i][y].id === array_filtered_by_description_additional_elements[z].table_id) {
                                        additional_elements_array_seventeenth_zero[i][y]["description"] = array_filtered_by_description_additional_elements[z]
                                    }
                                }
                            }
                        }
                        /* Loop for seventh element  END*/
                        //Block for additional elements end ***
                        
                        //Block for mosquitos start ***
                        const mosquitos = [];
                        for (let i = 0; i < GlobalStor.global.locales_names_addition_folders.locales_names_mosquitos; i += array_size) {
                            mosquitos.push(GlobalStor.global.locales_names_addition_folders.locales_names_mosquitos.slice(i, i + array_size));
                        }
                        mosquitos.push(GlobalStor.global.locales_names_addition_folders.locales_names_mosquitos)
                        const array_filtered_by_name_mosquitos = mosquitos[0].filter(element => element.table_attr === "name")

                        let mosquitos_array = GlobalStor.global.addElementsAll[0].elementsList[0];
                        for(let i = 0; i < mosquitos_array.length; i++) {
                                for(let y = 0; y < array_filtered_by_name_mosquitos.length; y++) {
                                    if(mosquitos_array[i].id === array_filtered_by_name_mosquitos[y].table_id) {
                                        mosquitos_array[i]["translate"] = array_filtered_by_name_mosquitos[y]
                                }
                            }
                        }

                        //Block for mosquitos end ***

                        //Block for mosquitos SINGLE start ***

                        // const mosquitos_single = [];
                        // for (let i = 0; i < GlobalStor.global.locales_names_addition_folders.locales_names_mosquitos_singles; i += array_size) {
                        //     mosquitos_single.push(GlobalStor.global.locales_names_addition_folders.locales_names_mosquitos_singles.slice(i, i + array_size));
                        // }
                        // mosquitos_single.push(GlobalStor.global.locales_names_addition_folders.locales_names_mosquitos_singles);
                        // const array_filtered_by_names_mosquitos_single = mosquitos_single[0].filter(element => element.table_attr === "name")

                        // let mosquitos_single_elements_array_zero = GlobalStor.global.addElementsAll[0].elementsList[0];
                        // //Loop that runs through the glasses folders and pushes there translations from a filtered array
                        //  for(let i = 0; i < mosquitos_single_elements_array_zero.length; i++) {
                        //      for(let y = 0; y < array_filtered_by_names_mosquitos_single.length; y++) {
                        //          if(mosquitos_single_elements_array_zero[i].id === array_filtered_by_names_mosquitos_single[y].table_id) {
                        //             mosquitos_single_elements_array_zero[i]["translate"] = array_filtered_by_names_mosquitos_single[y]
                        //         }
                        //     }
                        // }
                        //Block for mosquitos SINGLE end ***


                       //Block for laminations start ***
                       const laminations = [];
                       for (let i = 0; i < GlobalStor.global.locales_names_addition_folders.locales_names_lamination_factory_colors; i += array_size) {
                        laminations.push(GlobalStor.global.locales_names_addition_folders.locales_names_lamination_factory_colors.slice(i, i + array_size));
                       }
                       laminations.push(GlobalStor.global.locales_names_addition_folders.locales_names_lamination_factory_colors);
                       
                       const array_filtered_by_names_laminations = laminations[0].filter(element => element.table_attr === "name")
                       let laminations_array = GlobalStor.global.laminats;
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                            for(let i = 0; i < laminations_array.length; i++) {
                                for(let y = 0; y < array_filtered_by_names_laminations.length; y++) {
                                    if(laminations_array[i].id === array_filtered_by_names_laminations[y].table_id) {
                                        laminations_array[i]["translate"] = array_filtered_by_names_laminations[y]
                                } 
                            }
                        }
                       //Block for laminations end ***


                       //Block for lamination-couplese start ***
                       const laminations_couples = [];
                       for (let i = 0; i < GlobalStor.global.locales_names_addition_folders.locales_names_lamination_factory_colors; i += array_size) {
                        laminations_couples.push(GlobalStor.global.locales_names_addition_folders.locales_names_lamination_factory_colors.slice(i, i + array_size));
                       }
                       laminations_couples.push(GlobalStor.global.locales_names_addition_folders.locales_names_lamination_factory_colors);

                       const array_filtered_by_names_laminations_couples = laminations_couples[0].filter(element => element.table_attr === "name")

                        let laminations_couples_array = GlobalStor.global.laminatCouples;
                        //Loop that runs through the glasses folders and pushes there translations from a filtered array
                            for(let i = 0; i < laminations_couples_array.length; i++) {
                                for(let y = 0; y < array_filtered_by_names_laminations_couples.length; y++) {
                                    if(laminations_couples_array[i].lamination_in_id === array_filtered_by_names_laminations_couples[y].table_id) {
                                        laminations_couples_array[i]["translate_in_id"] = array_filtered_by_names_laminations_couples[y]
                                    } if(laminations_couples_array[i].lamination_out_id === array_filtered_by_names_laminations_couples[y].table_id) {
                                        laminations_couples_array[i]["translate_out_id"] = array_filtered_by_names_laminations_couples[y]
                                    }
                            }
                        }
                       //Block for lamination-couplese end ***


                        //Block for glasses translations starts ***
                        const glasses = [];
                        for (let i = 0; i < GlobalStor.global.locales_names_addition_folders.locales_names_lists; i += array_size) {
                            system_folders.push(GlobalStor.global.locales_names_addition_folders.locales_names_lists.slice(i, i + array_size));
                        }
                        glasses.push(GlobalStor.global.locales_names_addition_folders.locales_names_lists);
                        //Filtred array contains only glasses names
                        const array_filtered_by_names_glasses = glasses[0].filter(element => element.table_attr === "name")
                        const array_filtered_by_description_glasses_first = glasses[0].filter(element => element.table_attr === "description")
                        let glasses_array_first = GlobalStor.global.glasses;

                        for(let i = 0; i < glasses_array_first.length; i++) {
                            for(let y = 0; y < glasses_array_first[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_names_glasses.length; z++) {
                                    if(glasses_array_first[i][y].id === array_filtered_by_names_glasses[z].table_id) {
                                        glasses_array_first[i][y]["translate"] = array_filtered_by_names_glasses[z]
                                    }
                                }
                            }
                        }

                        for(let i = 0; i < glasses_array_first.length; i++) {
                            for(let y = 0; y < glasses_array_first[i].length; y++) {
                                for(let z = 0; z < array_filtered_by_description_glasses_first.length; z++) {
                                    if(glasses_array_first[i][y].id === array_filtered_by_description_glasses_first[z].table_id) {
                                        glasses_array_first[i][y]["description"] = array_filtered_by_description_glasses_first[z]
                                    }
                                }
                            }
                        }
                        //Block for glasses translations end ***
                        } catch(err) {
                            // console.log("Not all translations come from the backend, which is why you see this message")
                        }
                        
                    }
                )
               
                if (product.lamination.id > 0) {
                    product.profile.rama_list_id = angular.copy(
                        laminat.rama_list_id
                    );
                    product.profile.rama_still_list_id = angular.copy(
                        laminat.rama_still_list_id
                    );
                    product.profile.stvorka_list_id = angular.copy(
                        laminat.stvorka_list_id
                    );
                    product.profile.impost_list_id = angular.copy(
                        laminat.impost_list_id
                    );
                    product.profile.shtulp_list_id = angular.copy(
                        laminat.shtulp_list_id
                    );
                }
                //------- set Depths

                $q
                    .all([
                        downloadProfileDepth(product.profile.rama_list_id),
                        downloadProfileDepth(product.profile.rama_still_list_id),
                        downloadProfileDepth(product.profile.stvorka_list_id),
                        downloadProfileDepth(product.profile.impost_list_id),
                        downloadProfileDepth(product.profile.shtulp_list_id)
                    ])
                    .then(function (result) {
                        product.profileDepths.frameDepth = result[0];
                        product.profileDepths.frameStillDepth = result[1];
                        product.profileDepths.sashDepth = result[2];
                        product.profileDepths.impostDepth = result[3];
                        product.profileDepths.shtulpDepth = result[4];
                        deferred.resolve(product);
                    });
                return deferred.promise;
            }

            function setCurrentDoorProfile(product) {
                var deferred = $q.defer();
                //------- set Depths
                $q
                    .all([
                        downloadProfileDepth(product.profile.rama_list_id),
                        downloadProfileDepth(product.profile.rama_still_list_id),
                        downloadProfileDepth(product.profile.stvorka_list_id),
                        downloadProfileDepth(product.profile.impost_list_id),
                        downloadProfileDepth(product.profile.shtulp_list_id)
                    ])
                    .then(function (result) {
                        product.profileDepths.frameDepth = result[0];
                        product.profileDepths.frameStillDepth = result[1];
                        product.profileDepths.sashDepth = result[2];
                        product.profileDepths.impostDepth = result[3];
                        product.profileDepths.shtulpDepth = result[4];
                        deferred.resolve(product);
                    });
                return deferred.promise;
            }

            function doorProfile() {
                var door = [];
                async.eachSeries(
                    GlobalStor.global.doorsLaminations,
                    calculate,
                    function (err, result) {
                        GlobalStor.global.doorsLaminations = angular.copy(door);
                    }
                );

                function calculate(product, _cb) {
                    async.waterfall(
                        [
                            function (_callback) {
                                localDB
                                    .selectLocalDB(
                                        "lists", {
                                            id: product.rama_list_id
                                        },
                                        "parent_element_id"
                                    )
                                    .then(function (result) {
                                        _callback(null, result);
                                    });
                            },

                            function (result, _callback) {
                                if (result.length) {
                                    localDB
                                        .selectLocalDB(
                                            "elements_profile_systems", {
                                                element_id: result[0].parent_element_id
                                            },
                                            "profile_system_id"
                                        )
                                        .then(function (result2) {
                                            product.profileId = result2[0].profile_system_id;
                                            door.push(product);
                                            _callback(null, product.profileId);
                                        });
                                }

                            }
                        ],
                        function (err, result) {
                            if (err) {
                                return _cb(err, result);
                            }
                            _cb(null, result);
                        }
                    );
                }
            }

            function getGlassFromTemplateBlocks(template) {
                var blocksQty = template.details.length,
                    glassIds = [];
                while (--blocksQty > 0) {
                    if (!template.details[blocksQty].children.length) {
                        if (template.details[blocksQty].glassId) {
                            glassIds.push(angular.copy(template.details[blocksQty].glassId));
                        }
                    }
                }
                return glassIds;
            }

            function setGlassToTemplateBlocks(type,
                template,
                glassId,
                glassName,
                blockId) {
                var blocksQty = template.details.length;
                while (--blocksQty > 0) {
                    if (blockId) {
                        /** set glass to template block by its Id */
                        if (template.details[blocksQty].id === blockId) {
                            template.details[blocksQty].glassId = glassId;
                            template.details[blocksQty].glassTxt = glassName;
                            template.details[blocksQty].glass_type = type;
                            break;
                        }
                    } else {
                        /** set glass to all template blocks */
                        //if(!template.details[blocksQty].children.length) {
                        template.details[blocksQty].glassId = glassId;
                        template.details[blocksQty].glassTxt = glassName;
                        template.details[blocksQty].glass_type = type;
                        //}
                    }
                }
            }


            function setCurrentGlass(product, id) {
                //------- cleaning glass in product
                product.glass.length = 0;
                if (id) {
                    //----- get Glass Ids from template and check dublicates
                    var glassIds = GeneralServ.removeDuplicates(
                        getGlassFromTemplateBlocks(product.template)
                    ),
                        glassIdsQty = glassIds.length;
                    //------- glass filling by new elements
                    while (--glassIdsQty > -1) {
                        product.glass.push(
                            fineItemById(glassIds[glassIdsQty], GlobalStor.global.glasses)
                        );
                    }
                } else {
                    //----- set default glass in ProductStor
                    var tempGlassArr = GlobalStor.global.glassesAll.filter(function (item) {
                        if (product.profile.profileId) {
                            return product.construction_type == 4 ?
                                item.profileId === product.profile.profileId :
                                item.profileId === product.profile.id;
                        } else {
                            return item.profileId === product.profile.id;
                        }
                    });
                    if (tempGlassArr.length) {
                        GlobalStor.global.glassTypes = angular.copy(
                            tempGlassArr[0].glassTypes
                        );
                        GlobalStor.global.glasses = angular.copy(tempGlassArr[0].glasses);
                        product.glass.push(angular.copy(GlobalStor.global.glasses[0][0]));
                        GlobalStor.global.selectGlassId = product.glass[0].id;
                        GlobalStor.global.selectGlassName = product.glass[0].sku;
                        /** set Glass to all template blocks without children */
                        setGlassToTemplateBlocks(
                            product.glass[0].glass_type,
                            ProductStor.product.template_source,
                            product.glass[0].id,
                            product.glass[0].sku
                        );
                    }
                }
            }

            function setCurrentGlassInTemplate(templateSourceTemp, product, id) {
                //------- cleaning glass in product
                product.glass.length = 0;
                if (id) {
                    //----- get Glass Ids from template and check dublicates
                    var glassIds = GeneralServ.removeDuplicates(
                        getGlassFromTemplateBlocks(templateSourceTemp)
                    ),
                        glassIdsQty = glassIds.length;
                    //------- glass filling by new elements
                    while (--glassIdsQty > -1) {
                        product.glass.push(
                            fineItemById(glassIds[glassIdsQty], GlobalStor.global.glasses)
                        );
                    }
                } else {
                    //----- set default glass in ProductStor
                    var tempGlassArr = GlobalStor.global.glassesAll.filter(function (item) {
                        if (product.profile.profileId) {
                            return product.construction_type == 4 ?
                                item.profileId === product.profile.profileId :
                                item.profileId === product.profile.id;
                        } else {
                            return item.profileId === product.profile.id;
                        }
                    });
                    if (tempGlassArr.length) {
                        GlobalStor.global.glassTypes = angular.copy(
                            tempGlassArr[0].glassTypes
                        );
                        GlobalStor.global.glasses = angular.copy(tempGlassArr[0].glasses);
                        product.glass.push(angular.copy(GlobalStor.global.glasses[0][0]));
                        GlobalStor.global.selectGlassId = product.glass[0].id;
                        GlobalStor.global.selectGlassName = product.glass[0].sku;
                        /** set Glass to all template blocks without children */
                        setGlassToTemplateBlocks(
                            product.glass[0].glass_type,
                            templateSourceTemp,
                            product.glass[0].id,
                            product.glass[0].sku
                        );
                    }
                }
            }

            //for templateTemp
            function setCurrentGlassForTemplate(templateSource, product) {
                var tempGlassArr = GlobalStor.global.glassesAll.filter(function (item) {
                    if (product.profile.profileId) {
                        return product.construction_type === 4 ?
                            item.profileId === product.profile.profileId :
                            item.profileId === product.profile.id;
                    } else {
                        return item.profileId === product.profile.id;
                    }
                });
                if (tempGlassArr.length) {
                    GlobalStor.global.glassTypes = angular.copy(
                        tempGlassArr[0].glassTypes
                    );
                    GlobalStor.global.glasses = angular.copy(tempGlassArr[0].glasses);
                    product.glass.push(angular.copy(GlobalStor.global.glasses[0][0]));
                    GlobalStor.global.selectGlassId = product.glass[0].id;
                    GlobalStor.global.selectGlassName = product.glass[0].sku;
                    /** set Glass to all template blocks without children */
                    setGlassToTemplateBlocks(
                        product.glass[0].glass_type,
                        templateSource,
                        product.glass[0].id,
                        product.glass[0].sku
                    );
                }
            }

            function checkSashInTemplate(template) {
                var templQty = template.details.length,
                    counter = 0;
                while (--templQty > 0) {
                    if (template.details[templQty].blockType === "sash") {
                        counter += 1;
                        GlobalStor.global.checkSashInTemplate = counter;
                    }
                }
                return counter;
            }

            function saveTemplateInProduct(templateIndex) {
                var defer = $q.defer();
                if (!GlobalStor.global.isChangedTemplate) {
                    ProductStor.product.template_source = angular.copy(
                        GlobalStor.global.templatesSource[templateIndex]
                    );
                }
                setCurrentGlass(ProductStor.product);
                //----- create template
                SVGServ.createSVGTemplate(
                    ProductStor.product.template_source,
                    ProductStor.product.profileDepths
                ).then(function (result) {
                    DesignStor.design.templateSourceTEMP = ProductStor.product.template_source;
                    DesignStor.design.templateTEMP = angular.copy(result);
                    ProductStor.product.template = angular.copy(result);
                    GlobalStor.global.isSashesInTemplate = checkSashInTemplate(
                        ProductStor.product.template_source
                    );
                    //        console.log('TEMPLATE +++', ProductStor.product.template);
                    //----- create template icon
                    SVGServ.createSVGTemplateIcon(
                        ProductStor.product.template_source,
                        ProductStor.product.profileDepths
                    ).then(function (result) {
                        //------ show elements of room
                        GlobalStor.global.isRoomElements = 1;
                        ProductStor.product.templateIcon = angular.copy(result);
                        defer.resolve(1);
                    });
                });
                return defer.promise;
            }

            function setCurrentHardware(product, id) {
                if (id) {
                    product.hardware = fineItemById(id, GlobalStor.global.hardwares);
                } else {
                    //----- set default hardware in ProductStor
                    if (GlobalStor.global.isSashesInTemplate) {
                        product.hardware = GlobalStor.global.hardwares[0][0];
                    } else {
                        product.hardware = {};
                    }
                }
            }

            /** set Bead Id */
            function setBeadId(profileId, laminatId) {
                var deff = $q.defer(),
                    promisBeads = _.map(ProductStor.product.glass, function (item) {
                        var deff2 = $q.defer();
                        if (item.glass_width) {
                            localDB
                                .selectLocalDB(
                                    "beed_profile_systems", {
                                        profile_system_id: profileId,
                                        glass_width: item.glass_width
                                    },
                                    "list_id"
                                )
                                .then(function (beadIds) {
                                    var beadsQty = beadIds.length,
                                        beadObj = {
                                            glassId: item.id,
                                            beadId: 0
                                        };
                                    if (beadsQty) {
                                        //console.log('beads++++', beadIds);
                                        //----- if beads more one
                                        if (beadsQty > 1) {
                                            //----- go to kits and find bead width required laminat Id
                                            var pomisList = _.map(beadIds, function (item2) {
                                                var deff3 = $q.defer();
                                                localDB
                                                    .selectLocalDB(
                                                        "lists", {
                                                            id: item2.list_id
                                                        },
                                                        "beed_lamination_id"
                                                    )
                                                    .then(function (lamId) {
                                                        // console.log('lamId++++', lamId);
                                                        if (lamId) {
                                                            if (lamId[0].beed_lamination_id === laminatId) {
                                                                deff3.resolve(1);
                                                            } else {
                                                                deff3.resolve(0);
                                                            }
                                                        } else {
                                                            deff3.resolve(0);
                                                        }
                                                    });
                                                return deff3.promise;
                                            });

                                            $q.all(pomisList).then(function (results) {
                                                //console.log('finish++++', results);
                                                var resultQty = results.length;
                                                while (--resultQty > -1) {
                                                    if (results[resultQty]) {
                                                        beadObj.beadId = beadIds[resultQty].list_id;
                                                        deff2.resolve(beadObj);
                                                    }
                                                }
                                                if (!beadObj.beadId) {
                                                    console.log("Error in bead!!");
                                                    deff2.resolve(0);
                                                }
                                            });
                                        } else {
                                            beadObj.beadId = beadIds[0].list_id;
                                            deff2.resolve(beadObj);
                                        }
                                    } else {
                                        console.log("Error in bead!!");
                                        deff2.resolve(0);
                                    }
                                });
                        } else {
                            console.log("item.glass_width === 0");
                            deff2.resolve(0);
                        }
                        return deff2.promise;
                    });

                deff.resolve($q.all(promisBeads));
                return deff.promise;
            }

            function setProductPriceTOTAL(Product) {
                var deliveryCoeff = 
                    GlobalStor.global.deliveryCoeff.percents[
                    GlobalStor.global.deliveryCoeff.standart_time
                    ],
                    priceDis = UserStor.userInfo.factory_id == 2 ? Math.round(GeneralServ.setPriceDis(Product.template_price, OrderStor.order.discount_construct)) : GeneralServ.setPriceDis(Product.template_price, OrderStor.order.discount_construct);
                    
                    


                Product.product_price = GeneralServ.roundingValue(
                    Product.template_price + Product.addelem_price + Product.service_price
                );
                Product.productPriceDis = priceDis + Product.addelemPriceDis + Product.service_price_dis;
                //------ add Discount of standart delivery day of Plant
                if (deliveryCoeff) {
                    Product.productPriceDis = GeneralServ.setPriceDis(
                        Product.productPriceDis,
                        deliveryCoeff
                    );
                }
                if (UserStor.userInfo.factory_id === 2) {
                    GlobalStor.global.tempPrice =
                        Math.round(Product.productPriceDis * GlobalStor.global.product_qty);
                    GlobalStor.global.isLoader = 0;
                } else {
                    GlobalStor.global.tempPrice =
                        Product.productPriceDis * GlobalStor.global.product_qty;
                    GlobalStor.global.isLoader = 0;
                }

                if (($location.path() === "/light" || $location.path() === "/mobile") && (!ProductStor.product.is_addelem_only)) {
                    setTimeout(function () {
                        SVGServ.createSVGTemplate(
                            DesignStor.design.templateSourceTEMP,
                            ProductStor.product.profileDepths
                        ).then(function (result) {
                            DesignStor.design.templateTEMP = angular.copy(result);
                            DesignStor.design.templateTEMP.details.forEach(function (entry,
                                index) {
                                if (entry.impost) {
                                    DesignStor.design.templateSourceTEMP.details[index].impost.impostAxis[1].x = entry.impost.impostAxis[0].x;
                                    DesignStor.design.templateSourceTEMP.details[index].impost.impostAxis[0].x = entry.impost.impostAxis[1].x;
                                }
                            });
                        });
                    }, 0);
                }
            }

            //---------- Price define
            function calculationPrice(obj) {
                let tmp_hardware;
                var deferred = $q.defer();
                GlobalStor.global.isZeroPriceList = [];
                localDB.calculationPrice(obj).then(function (result) {
                    result.constrElements.forEach(function (entry) {
                        if (entry.element_group_id != 8) {
                            if (entry.priceReal == 0 || entry.price == 0) {
                                //console.log('name', entry.name);
                                GlobalStor.global.isZeroPriceList.push(entry.name);
                            }
                        }
                        if (entry.element_group_id === 5) {
                            if (entry.size === 0) {
                                GlobalStor.global.TEMP_HARDWARES[0].forEach(function (hard, item) {
                                    if (entry.id === hard.child_id) {
                                        tmp_hardware = angular.copy(entry.priceReal);
                                        entry.size = hard.length / 1000;
                                        entry.priceReal = entry.price * entry.size * entry.qty;
                                        result.priceTotal = result.priceTotal - tmp_hardware + entry.priceReal
                                    }
                                });
                            }
                        }
                    });
                    var works = 0,
                        works_dis = 0,
                        works_area = 0,
                        works_perimeter = 0,
                        works_piece = 0;
                    if (GlobalStor.global.area_price) {
                        works_area = localDB.currencyExgange(
                            GlobalStor.global.area_price * ProductStor.product.template_square,
                            GlobalStor.global.area_currencies
                        );
                    }
                    if (GlobalStor.global.perimeter_price) {
                        works_perimeter = localDB.currencyExgange(
                            GlobalStor.global.perimeter_price *
                            ((ProductStor.product.template_width / 1000 +
                                ProductStor.product.template_height / 1000) *
                                2),
                            GlobalStor.global.perimeter_currencies
                        );
                    }
                    if (GlobalStor.global.piece_price) {
                        works_piece = localDB.currencyExgange(
                            GlobalStor.global.piece_price,
                            GlobalStor.global.piece_currencies
                        );
                    }

                    if (GlobalStor.global.area_price || GlobalStor.global.perimeter_price || GlobalStor.global.piece_price) {
                        works = works_area + works_perimeter + works_piece;
                    }

                    var priceObj = angular.copy(result),
                        priceMargin,
                        doorData,
                        tempDoorItems;
                        var glassData = null
                        function glassPricesData() {
                            var defer = $q.defer();
                            db.getItem('tables').then(function (value) {
                                glassPricesData = value;
                                defer.resolve(glassPricesData);
                            }).catch(function (err) {
                                console.log(err);
                                defer.resolve(0);
                            });
                            return defer.promise;
                        }
                        /* This funciton calculates price for glasses with different ranges from db (glass_prices), also adding new key for report obj to recalculate the priceReal */
                        glassPricesData().then(
                            function(data) {
                                let glassPricesData = data.glass_prices;
                                let currentGlassData = ProductStor.product.report;
                                if (glassPricesData) {
                                    for(var i = 0; i < glassPricesData.length; i++) {
                                        for(var y = 0; y < currentGlassData.length; y++) {
                                            /* checks if ids the same */
                                            if(currentGlassData[y].element_id === glassPricesData[i].element_id) {
                                                /* check range */
                                                if (currentGlassData[y].size < glassPricesData[i].col_1_range) {
                                                    /* setting a new keys in object */
                                                    /* price from db for this particular range */ 
                                                    currentGlassData[y]["range_price"] = glassPricesData[i].col_1_price;
                                                    /* calculations the price for report */
                                                    currentGlassData[y]["total_range_price"] = (currentGlassData[y].size * currentGlassData[y].range_price);
                                                    /* To display correct price at main screen we first subtract the old price and then add the new one, so everything works correctly */
                                                    GlobalStor.global.tempPrice -= currentGlassData[y].priceReal;
                                                    GlobalStor.global.tempPrice += currentGlassData[y].total_range_price;
                                                    /* The last action is to reassign keys to display correct data in report */
                                                    if(GlobalStor.global.tempPrice) {
                                                        currentGlassData[y]["price"] = glassPricesData[i].col_1_price;
                                                        currentGlassData[y]["priceReal"] = (currentGlassData[y].size * currentGlassData[y].range_price);
                                                    }
                                                } else if ((currentGlassData[y].size > glassPricesData[i].col_2_range_1) && (currentGlassData[y].size < glassPricesData[i].col_2_range_2)) {
                                                    /* setting a new keys in object */
                                                    /* price from db for this particular range */ 
                                                    currentGlassData[y]["range_price"] = glassPricesData[i].col_2_price;
                                                    /* calculations the price for report */
                                                    currentGlassData[y]["total_range_price"] = (currentGlassData[y].size * currentGlassData[y].range_price);
                                                    /* To display correct price at main screen we first subtract the old price and then add the new one, so everything works correctly */
                                                    GlobalStor.global.tempPrice -= currentGlassData[y].priceReal;
                                                    GlobalStor.global.tempPrice += currentGlassData[y].total_range_price;
                                                    /* The last action is to reassign keys to display correct data in report */
                                                    if(GlobalStor.global.tempPrice) {
                                                        currentGlassData[y]["price"] = glassPricesData[i].col_2_price;
                                                        currentGlassData[y]["priceReal"] = (currentGlassData[y].size * currentGlassData[y].range_price);
                                                    }
                                                } else if ((currentGlassData[y].size > glassPricesData[i].col_3_range_1) && (currentGlassData[y].size < glassPricesData[i].col_3_range_2)) {
                                                    /* setting a new keys in object */
                                                    /* price from db for this particular range */ 
                                                    currentGlassData[y]["range_price"] = glassPricesData[i].col_3_price;
                                                    /* calculations the price for report */
                                                    currentGlassData[y]["total_range_price"] = (currentGlassData[y].size * currentGlassData[y].range_price);
                                                    /* To display correct price at main screen we first subtract the old price and then add the new one, so everything works correctly */
                                                    GlobalStor.global.tempPrice -= currentGlassData[y].priceReal;
                                                    GlobalStor.global.tempPrice += currentGlassData[y].total_range_price;
                                                    /* The last action is to reassign keys to display correct data in report */
                                                    if(GlobalStor.global.tempPrice) {
                                                        currentGlassData[y]["price"] = glassPricesData[i].col_3_price;
                                                        currentGlassData[y]["priceReal"] = (currentGlassData[y].size * currentGlassData[y].range_price);
                                                    }
                                                } else if ((currentGlassData[y].size > glassPricesData[i].col_4_range_1) && (currentGlassData[y].size < glassPricesData[i].col_4_range_2)) {
                                                    /* setting a new keys in object */
                                                    /* price from db for this particular range */ 
                                                    currentGlassData[y]["range_price"] = glassPricesData[i].col_4_price;
                                                    /* calculations the price for report */
                                                    currentGlassData[y]["total_range_price"] = (currentGlassData[y].size * currentGlassData[y].range_price);
                                                    /* To display correct price at main screen we first subtract the old price and then add the new one, so everything works correctly */
                                                    GlobalStor.global.tempPrice -= currentGlassData[y].priceReal;
                                                    GlobalStor.global.tempPrice += currentGlassData[y].total_range_price;
                                                    /* The last action is to reassign keys to display correct data in report */
                                                    if(GlobalStor.global.tempPrice) {
                                                        currentGlassData[y]["price"] = glassPricesData[i].col_4_price;
                                                        currentGlassData[y]["priceReal"] = (currentGlassData[y].size * currentGlassData[y].range_price);
                                                    }
                                                } else if (currentGlassData[y].size > glassPricesData[i].col_5_range) {
                                                    /* setting a new keys in object */
                                                    /* price from db for this particular range */ 
                                                    currentGlassData[y]["range_price"] = glassPricesData[i].col_5_price;
                                                    /* calculations the price for report */
                                                    currentGlassData[y]["total_range_price"] = (currentGlassData[y].size * currentGlassData[y].range_price);
                                                    /* To display correct price at main screen we first subtract the old price and then add the new one, so everything works correctly */
                                                    GlobalStor.global.tempPrice -= currentGlassData[y].priceReal;
                                                    GlobalStor.global.tempPrice += currentGlassData[y].total_range_price;
                                                    /* The last action is to reassign keys to display correct data in report */
                                                    if(GlobalStor.global.tempPrice) {
                                                        currentGlassData[y]["price"] = glassPricesData[i].col_5_price;
                                                        currentGlassData[y]["priceReal"] = (currentGlassData[y].size * currentGlassData[y].range_price);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        )
                    
                    if (priceObj.priceTotal) {
                        /** DOOR add handle and lock Ids */
                        if (ProductStor.product.construction_type === 4) {
                            localDB
                                .calcDoorElemPrice(
                                    ProductStor.product.doorHandle,
                                    ProductStor.product.doorLock.elem
                                )
                                .then(function (doorResult) {
                                    if (doorResult.consistElem) {
                                        doorResult.consistElem.forEach(function (entry) {
                                            // console.log(entry);
                                            if (entry.element_group_id !== 8) {
                                                if (entry.priceReal === 0 || entry.price === 0) {
                                                    GlobalStor.global.isZeroPriceList.push(entry.name);
                                                }
                                            }
                                        });
                                    }
                                    if (doorResult.elements) {
                                        doorResult.elements.forEach(function (entry) {
                                            // console.log(entry);
                                            if (entry.element_group_id !== 8) {
                                                if (entry.priceReal === 0 || entry.price === 0) {
                                                    GlobalStor.global.isZeroPriceList.push(entry.name);
                                                }
                                            }
                                        });
                                    }
                                    doorData = angular.copy(doorResult);
                                    priceObj.priceTotal += doorData.priceTot;
                                    priceObj.constrElements = priceObj.constrElements.concat(
                                        doorData.elements
                                    );
                                    priceMargin = GeneralServ.addMarginToPrice(
                                        priceObj.priceTotal,
                                        GlobalStor.global.margins.coeff
                                    );
                                    ProductStor.product.template_price = GeneralServ.roundingValue(
                                        priceMargin + GlobalStor.global.screw + works,
                                        2
                                    );
                                    setProductPriceTOTAL((ProductStor.product));
                                    deferred.resolve(priceObj);
                                });
                        } else {
                            priceMargin = GeneralServ.addMarginToPrice(
                                priceObj.priceTotal,
                                GlobalStor.global.margins.coeff
                            );
                            ProductStor.product.template_price = GeneralServ.roundingValue(
                                priceMargin + GlobalStor.global.screw + works,
                                2
                            );
                            setProductPriceTOTAL((ProductStor.product));
                            deferred.resolve(priceObj);
                        }
                    } else {
                        ProductStor.product.template_price = 0;
                        deferred.resolve(0);
                    }
                });
                return deferred.promise;
            }
                       
            function prepareReport(elementList) {
                var report = [],
                    elementListQty = elementList.length,
                    ind,
                    tempObj,
                    reportQty,
                    exist,
                    priceMarg;
                if (elementListQty) {
                    for (ind = 0; ind < elementListQty; ind += 1) {
                        tempObj = angular.copy(elementList[ind]);
                        tempObj.element_id = angular.copy(tempObj.id);
                        tempObj.amount = angular.copy(tempObj.qty);
                        delete tempObj.id;
                        delete tempObj.amendment_pruninng;
                        delete tempObj.currency_id;
                        delete tempObj.qty;
                        delete tempObj.waste;
                        if (ind) {
                            reportQty = report.length;
                            exist = 0;
                            if (reportQty) {
                                while (--reportQty > -1) {
                                    if (
                                        report[reportQty].element_id === tempObj.element_id &&
                                        report[reportQty].size === tempObj.size
                                    ) {
                                        exist++;
                                        report[reportQty].amount += tempObj.amount;
                                        report[reportQty].priceReal += tempObj.priceReal;
                                    }
                                }
                                if (!exist) {
                                    report.push(tempObj);
                                }
                            }
                        } else {
                            report.push(tempObj);
                        }
                    }
                    //------ add margins to price of every elements
                    reportQty = report.length;
                    while (--reportQty > -1) {
                        report[reportQty].amount = GeneralServ.roundingValue(
                            report[reportQty].amount,
                            3
                        );
                        priceMarg = GeneralServ.addMarginToPrice(
                            report[reportQty].priceReal,
                            GlobalStor.global.margins.coeff
                        );
                        report[reportQty].priceReal = GeneralServ.roundingValue(
                            priceMarg,
                            2
                        );
                    }
                }
                // console.timeEnd("prepareReport");
                return report;
            }

            //---------- Coeffs define
            function calculateCoeffs(objXFormedPrice) {
                var glassSqT = 0,
                    glassSizeQty = objXFormedPrice.sizes[5].length,
                    glassQty = ProductStor.product.glass.length,
                    glassHeatCT = 0,
                    profHeatCT = 0,
                    heatCoeffTotal = 0,
                    perimeterPrif = 0,
                    glassObj = {},
                    g,
                    coefGlass = [0, 0.05, 0.06, 0.01, 0.01, 0.01];

                for (
                    var l = 0; l < ProductStor.product.template.details.length; l += 1
                ) {
                    if (!ProductStor.product.template.details[l].children.length) {
                        //ищем стеклопакет, чтобы получить значение glass_type
                        glassObj = _.find(_.flatten(GlobalStor.global.glasses), {
                            id: ProductStor.product.template.details[l].glassId
                        });
                        //умнажаем периметр с/п на coefGlass
                        if (ProductStor.product.template.details[l].sashPointsIn) {
                            perimeterPrif +=
                                (Math.abs(
                                    ProductStor.product.template.details[l].sashPointsIn[1].x -
                                    ProductStor.product.template.details[l].sashPointsIn[0].x
                                ) *
                                    2 +
                                    Math.abs(
                                        ProductStor.product.template.details[l].sashPointsIn[2].y -
                                        ProductStor.product.template.details[l].sashPointsIn[1].y
                                    ) *
                                    2) /
                                1000 *
                                coefGlass[glassObj.glass_type];
                        } else {
                            perimeterPrif +=
                                (Math.abs(
                                    ProductStor.product.template.details[l].pointsIn[1].x -
                                    ProductStor.product.template.details[l].pointsIn[0].x
                                ) *
                                    2 +
                                    Math.abs(
                                        ProductStor.product.template.details[l].pointsIn[2].y -
                                        ProductStor.product.template.details[l].pointsIn[1].y
                                    ) *
                                    2) /
                                1000 *
                                coefGlass[glassObj.glass_type];
                        }
                    }
                }

                /** working with glasses */
                while (--glassSizeQty > -1) {
                    /** culculate glass Heat Coeff Total */
                    for (g = 0; g < glassQty; g += 1) {
                        if (
                            objXFormedPrice.sizes[5][glassSizeQty].elemId ==
                            ProductStor.product.glass[g].id
                        ) {
                            //$.isNumeric
                            ProductStor.product.glass[g].transcalency = parseFloat(ProductStor.product.glass[g].transcalency);
                            if (!angular.isNumber(ProductStor.product.glass[g].transcalency)) {
                                ProductStor.product.glass[g].transcalency = 1;
                            }
                            glassHeatCT +=
                                objXFormedPrice.sizes[5][glassSizeQty].square /
                                ProductStor.product.glass[g].transcalency; //Sglasses
                        }
                    }
                    /** get total glasses square */
                    glassSqT += objXFormedPrice.sizes[5][glassSizeQty].square; //Sстекломакетов
                }
                glassHeatCT = GeneralServ.roundingValue(glassHeatCT);
                glassSqT = GeneralServ.roundingValue(glassSqT, 3);

                /** culculate profile Heat Coeff Total */
                ProductStor.product.profile.heat_coeff_value = parseFloat(ProductStor.product.profile.heat_coeff_value);
                if (!angular.isNumber(ProductStor.product.profile.heat_coeff_value)) {
                    ProductStor.product.profile.heat_coeff_value = 1;
                }
                profHeatCT =
                    (ProductStor.product.template_square - glassSqT) /
                    ProductStor.product.profile.heat_coeff_value;

                heatCoeffTotal = profHeatCT + glassHeatCT + perimeterPrif;
                /** calculate Heat Coeff Total */
                if (UserStor.userInfo.therm_coeff_id) {
                    /** R */
                    ProductStor.product.heat_coef_total = GeneralServ.roundingValue(
                        ProductStor.product.template_square / heatCoeffTotal, 2
                    );
                    if (globalConstants.serverIP === 'https://admin.rehauselected.baueffect.com') {
                        ProductStor.product.heat_coef_expert_mark = Math.round(Math.sqrt(ProductStor.product.heat_coef_total) * 10 * 10) / 10;
                    }
                } else {
                    /** U */
                    ProductStor.product.heat_coef_total =
                        GeneralServ.roundingValue(
                            1 / (ProductStor.product.template_square / heatCoeffTotal), 2
                        );
                }
            }

            /**--------- create object for price calculation ----------*/

            function preparePrice(template,
                profileId,
                glassIds,
                hardwareId,
                laminatId) {
                var deferred = $q.defer();
                GlobalStor.global.isLoader = 1;
                setBeadId(profileId, laminatId).then(function (beadResult) {
                    if (beadResult.length && beadResult[0]) {
                        var beadIds = GeneralServ.removeDuplicates(
                            _.map(angular.copy(beadResult), function (item) {
                                var beadQty = template.priceElements.beadsSize.length;
                                while (--beadQty > -1) {
                                    if (
                                        template.priceElements.beadsSize[beadQty].glassId ===
                                        item.glassId
                                    ) {
                                        template.priceElements.beadsSize[beadQty].elemId =
                                            item.beadId;
                                    }
                                }
                                return item.beadId;
                            })
                        ),
                            objXFormedPrice = {
                                laminationId: laminatId,
                                ids: [
                                    ProductStor.product.profile.rama_list_id,
                                    ProductStor.product.profile.rama_still_list_id,
                                    ProductStor.product.profile.stvorka_list_id,
                                    ProductStor.product.profile.impost_list_id,
                                    ProductStor.product.profile.shtulp_list_id,
                                    glassIds.length > 1 ?
                                        _.map(glassIds, function (item) {
                                            return item.id;
                                        }) :
                                        glassIds[0].id,
                                    beadIds.length > 1 ? beadIds : beadIds[0],
                                    ProductStor.product.construction_type === 4 ? 0 : hardwareId
                                ],
                                sizes: []
                            };
                        //-------- beads data for analysis
                        ProductStor.product.beadsData = angular.copy(
                            template.priceElements.beadsSize
                        );
                        //------- fill objXFormedPrice for sizes
                        for (var size in template.priceElements) {
                            /** for door elements */
                            objXFormedPrice.sizes.push(
                                angular.copy(template.priceElements[size])
                            );
                        }

                        //------- set Overall Dimensions
                        ProductStor.product.template_width = 0;
                        ProductStor.product.template_height = 0;
                        ProductStor.product.template_square = 0;
                        var overallQty =
                            ProductStor.product.template.details[0].overallDim.length;
                        //console.log(ProductStor.product.template.details[0].overallDim);
                        while (--overallQty > -1) {
                            if (ProductStor.product.construction_type === 3) {
                                if (ProductStor.product.template_id === 1) {
                                    ProductStor.product.template_height =
                                        ProductStor.product.template.details[0].overallDim[0].h;
                                } else {
                                    ProductStor.product.template_height =
                                        ProductStor.product.template.details[0].overallDim[1].h - ProductStor.product.template.details[0].overallDim[0].h;
                                }
                                if (ProductStor.product.template_id === 2) {
                                    ProductStor.product.template_square =
                                        ProductStor.product.template.details[0].overallDim[0].square + ProductStor.product.template.details[0].overallDim[1].square + ProductStor.product.template.details[0].overallDim[2].square;
                                    ProductStor.product.template_width =
                                        ProductStor.product.template.details[0].overallDim[2].w;
                                } else {
                                    ProductStor.product.template_square =
                                        ProductStor.product.template.details[0].overallDim[0].square + ProductStor.product.template.details[0].overallDim[1].square;
                                    ProductStor.product.template_width =
                                        ProductStor.product.template.details[0].overallDim[1].w;

                                }
                            } else {
                                ProductStor.product.template_width =
                                    ProductStor.product.template.details[0].overallDim[
                                        overallQty
                                    ].w;
                                ProductStor.product.template_height =
                                    ProductStor.product.template.details[0].overallDim[
                                        overallQty
                                    ].h;
                                ProductStor.product.template_square =
                                    ProductStor.product.template.details[0].overallDim[
                                        overallQty
                                    ].square;

                            }
                        }

                        //        console.warn(ProductStor.product.template_width, ProductStor.product.template_height);
                        //        console.log('objXFormedPrice+++++++', JSON.stringify(objXFormedPrice));

                        //console.log('START PRICE Time!!!!!!', new Date(), new Date().getMilliseconds());

                        //--------- get product price
                        // console.time("calculationPrice");
                        calculationPrice(objXFormedPrice).then(function (result) {
                            // console.timeEnd("calculationPrice");
                            deferred.resolve(1);
                            /** set Report */
                            if (result) {
                                //---- only for this type of user
                                if (
                                    UserStor.userInfo.user_type === 5 ||
                                    UserStor.userInfo.user_type === 7
                                ) {
                                    ProductStor.product.report = prepareReport(
                                        result.constrElements
                                    );
                                    //console.log('REPORT', ProductStor.product.report);
                                    //console.timeEnd('price');
                                }
                            }
                        });

                        /** calculate coeffs */
                        calculateCoeffs(objXFormedPrice);

                        /** save analytics data first time */
                        if (
                            GlobalStor.global.startProgramm &&
                            ProductStor.product.construction_type !== 4
                        ) {
                            //AnalyticsServ.saveAnalyticDB(UserStor.userInfo.id, OrderStor.order.id,
                            // ProductStor.product.template_id, ProductStor.product.profile.id, 1);
                            /** send analytics data to Server*/
                            //------ profile
                            $timeout(function () {
                                AnalyticsServ.sendAnalyticsData(
                                    UserStor.userInfo.id,
                                    OrderStor.order.id,
                                    ProductStor.product.template_id,
                                    ProductStor.product.profile.id,
                                    1
                                );
                            }, 5000);
                        }
                    } else {
                        deferred.resolve(1);
                    }
                });
                return deferred.promise;
            }

            function parseTemplate() {
                var deferred = $q.defer();
                //------- set current template for product
                saveTemplateInProduct(ProductStor.product.template_id).then(function () {
                    setCurrentHardware(ProductStor.product);
                    var hardwareIds = ProductStor.product.hardware.id || 0;
                    // if ($location.path() !== "/light") {
                    preparePrice(
                        ProductStor.product.template,
                        ProductStor.product.profile.id,
                        ProductStor.product.glass,
                        hardwareIds,
                        ProductStor.product.lamination.lamination_in_id
                    ).then(function () {
                        deferred.resolve(1);
                    });
                    // } else {
                    //   deferred.resolve(1);
                    // }
                });
                return deferred.promise;
            }

            function prepareTemplates(type) {
                var deferred = $q.defer();
                downloadAllTemplates(type).then(function (data) {
                    if (data) {
                        GlobalStor.global.templatesSourceSTORE = angular.copy(data);
                        GlobalStor.global.templatesSource = angular.copy(data);

                        //--------- set current profile in ProductStor
                        setCurrentProfile(ProductStor.product, ProductStor.product.profile.id).then(function () {
                            parseTemplate().then(function () {
                                deferred.resolve(1);
                            });
                        });
                    } else {
                        deferred.resolve(0);
                    }
                });
                return deferred.promise;
            }

            /**-------- filtering Lamination Groupes -----------*/

            function checkLamGroupExist(lamId) {
                var lamQty = GlobalStor.global.lamGroupFiltered.length,
                    noExist = 1;
                while (--lamQty > -1) {
                    if (GlobalStor.global.lamGroupFiltered[lamQty].id === lamId) {
                        noExist = 0;
                    }
                }
                return noExist;
            }

            function laminationDoor() {
                var coupleQty = GlobalStor.global.doorsLaminations.length,
                    laminatQty = GlobalStor.global.laminats.length,
                    lam;
                while (--coupleQty > -1) {
                    for (lam = 0; lam < laminatQty; lam += 1) {
                        if (
                            GlobalStor.global.laminats[lam].id ===
                            GlobalStor.global.doorsLaminations[coupleQty].lamination_in
                        ) {
                            GlobalStor.global.doorsLaminations[coupleQty].laminat_in_name =
                                GlobalStor.global.laminats[lam].name;
                            GlobalStor.global.doorsLaminations[coupleQty].img_in_id =
                                GlobalStor.global.laminats[lam].lamination_type_id;
                            GlobalStor.global.doorsLaminations[coupleQty].lamination_in_id =
                                GlobalStor.global.doorsLaminations[coupleQty].lamination_in;
                            delete GlobalStor.global.doorsLaminations[coupleQty]
                                .lamination_in;
                        }
                        if (
                            GlobalStor.global.laminats[lam].id ===
                            GlobalStor.global.doorsLaminations[coupleQty].lamination_out
                        ) {
                            GlobalStor.global.doorsLaminations[coupleQty].laminat_out_name =
                                GlobalStor.global.laminats[lam].name;
                            GlobalStor.global.doorsLaminations[coupleQty].img_out_id =
                                GlobalStor.global.laminats[lam].lamination_type_id;
                            GlobalStor.global.doorsLaminations[coupleQty].lamination_out_id =
                                GlobalStor.global.doorsLaminations[coupleQty].lamination_out;
                            delete GlobalStor.global.doorsLaminations[coupleQty]
                                .lamination_out;
                        }
                    }
                }
            }

            function laminatFiltering() {
                if (ProductStor.product.construction_type !== 4) {
                    var laminatQty = GlobalStor.global.laminats.length,
                        /** sort by Profile */
                        lamGroupsTemp = GlobalStor.global.laminatCouples.filter(function (item) {
                            if (item.profile_id) {
                                return item.profile_id === ProductStor.product.profile.id;
                            } else {
                                return true;
                            }
                        }),
                        lamGroupsTempQty,
                        isAnyActive = 0;

                    //console.info('filter _____ ', lamGroupsTemp);
                } else {
                    var laminatQty = GlobalStor.global.laminats.length,
                        /** sort by Profile */
                        lamGroupsTemp = GlobalStor.global.doorsLaminations.filter(function (item) {
                            return item.group_id === GlobalStor.global.type_door;
                        }),
                        lamGroupsTempQty,
                        isAnyActive = 0;
                    for (var a = 0; a < lamGroupsTemp.length; a += 1) {
                        lamGroupsTemp[a].rama_still_list_id =
                            lamGroupsTemp[a].door_sill_list_id;
                    }
                }
                GlobalStor.global.lamGroupFiltered.length = 0;

                while (--laminatQty > -1) {
                    if (GlobalStor.global.laminats[laminatQty].isActive) {
                        isAnyActive = 1;
                        lamGroupsTempQty = lamGroupsTemp.length;
                        while (--lamGroupsTempQty > -1) {
                            if (
                                lamGroupsTemp[lamGroupsTempQty].img_in_id ===
                                GlobalStor.global.laminats[laminatQty].lamination_type_id
                            ) {
                                if (checkLamGroupExist(lamGroupsTemp[lamGroupsTempQty].id)) {
                                    GlobalStor.global.lamGroupFiltered.push(
                                        lamGroupsTemp[lamGroupsTempQty]
                                    );
                                }
                            } else if (
                                lamGroupsTemp[lamGroupsTempQty].img_out_id ===
                                GlobalStor.global.laminats[laminatQty].lamination_type_id
                            ) {
                                if (checkLamGroupExist(lamGroupsTemp[lamGroupsTempQty].id)) {
                                    GlobalStor.global.lamGroupFiltered.push(
                                        lamGroupsTemp[lamGroupsTempQty]
                                    );
                                }
                            }
                        }
                    }
                }
                //console.info('lamGroupFiltered _____ ', GlobalStor.global.lamGroupFiltered);
                if (!GlobalStor.global.lamGroupFiltered.length) {
                    if (!isAnyActive) {
                        GlobalStor.global.lamGroupFiltered = lamGroupsTemp;
                    }
                }
            }

            /**-------- set Lamination in product -----------*/

            function cleanLamFilter() {
                var laminatQty = GlobalStor.global.laminats.length;
                //---- deselect filter
                while (--laminatQty > -1) {
                    GlobalStor.global.laminats[laminatQty].isActive = 0;
                }
            }

            function setCurrLamination(product, newLamId) {
                //может? тут вроде смотрел но уже глаза плывут
                var selectedLam = [];
                if (product.construction_type !== 4) {
                    selectedLam = angular.copy(GlobalStor.global.laminatCouples);
                } else {
                    selectedLam = angular.copy(GlobalStor.global.doorsLaminations);
                }
                var laminatGroupQty = selectedLam.length;
                //---- clean filter
                cleanLamFilter();
                while (--laminatGroupQty > -1) {
                    if (newLamId) {
                        //------ set lamination Couple with color
                        if (selectedLam[laminatGroupQty].id === newLamId) {
                            product.lamination = selectedLam[laminatGroupQty];
                        }
                    } else {
                        //----- set white lamination Couple
                        if (!selectedLam[laminatGroupQty].id) {
                            var result = angular.copy(
                                fineItemById(product.profile.id, GlobalStor.global.profiles)
                            );
                            product.lamination = selectedLam[laminatGroupQty];
                            product.lamination.rama_list_id = result.rama_list_id;
                            product.lamination.rama_still_list_id = result.rama_still_list_id;
                            product.lamination.stvorka_list_id = result.stvorka_list_id;
                            product.lamination.impost_list_id = result.impost_list_id;
                            product.lamination.shtulp_list_id = result.shtulp_list_id;
                        }
                    }
                }
                if ($location.path() === "/light" || $location.path() === "/mobile") {
                    SVGServ.createSVGTemplate(
                        ProductStor.product.template_source,
                        ProductStor.product.profileDepths
                    ).then(function (result) {
                        DesignStor.design.templateTEMP = angular.copy(result);
                    });
                }

            }

            function setProfileByLaminat(lamId) {
                var deff = $q.defer();
                if (lamId || lamId === 0) {
                    //------ set profiles parameters
                    if (ProductStor.product.construction_type !== 4) {
                        ProductStor.product.profile.rama_list_id =
                            ProductStor.product.lamination.rama_list_id;
                        ProductStor.product.profile.rama_still_list_id =
                            ProductStor.product.lamination.rama_still_list_id;
                        ProductStor.product.profile.stvorka_list_id =
                            ProductStor.product.lamination.stvorka_list_id;
                        ProductStor.product.profile.impost_list_id =
                            ProductStor.product.lamination.impost_list_id;
                        ProductStor.product.profile.shtulp_list_id =
                            ProductStor.product.lamination.shtulp_list_id;
                    } else {
                        ProductStor.product.profile = angular.copy(
                            selectDoor(ProductStor.product.door_shape_id, ProductStor.product)
                        );
                        ProductStor.product.profile.rama_still_list_id =
                            ProductStor.product.profile.door_sill_list_id;
                    }
                }

                //------- set Depths
                $q
                    .all([
                        downloadProfileDepth(ProductStor.product.profile.rama_list_id),
                        downloadProfileDepth(
                            ProductStor.product.profile.rama_still_list_id
                        ),
                        downloadProfileDepth(ProductStor.product.profile.stvorka_list_id),
                        downloadProfileDepth(ProductStor.product.profile.impost_list_id),
                        downloadProfileDepth(ProductStor.product.profile.shtulp_list_id)
                    ])
                    .then(function (result) {
                        ProductStor.product.profileDepths.frameDepth = result[0];
                        ProductStor.product.profileDepths.frameStillDepth = result[1];
                        ProductStor.product.profileDepths.sashDepth = result[2];
                        ProductStor.product.profileDepths.impostDepth = result[3];
                        ProductStor.product.profileDepths.shtulpDepth = result[4];
                        var profile =
                            ProductStor.product.construction_type !== 4 ?
                                ProductStor.product.profile.id :
                                ProductStor.product.profile.profileId;
                        SVGServ.createSVGTemplate(
                            ProductStor.product.template_source,
                            ProductStor.product.profileDepths
                        ).then(function (result) {
                            ProductStor.product.template = angular.copy(result);
                            var hardwareIds = ProductStor.product.hardware.id || 0;
                            preparePrice(
                                ProductStor.product.template,
                                profile,
                                ProductStor.product.glass,
                                hardwareIds,
                                ProductStor.product.lamination.lamination_in_id
                            ).then(function () {
                                deff.resolve(1);
                            });
                            //----- create template icon
                            SVGServ.createSVGTemplateIcon(
                                ProductStor.product.template_source,
                                ProductStor.product.profileDepths
                            ).then(function (result) {
                                ProductStor.product.templateIcon = angular.copy(result);
                                deff.resolve(1);
                            });
                        });
                    });
                return deff.promise;
            }

            /**==================temp location for this function!!! =================*/
            function selectDoor(id, product) {
                var doorsLaminations = angular.copy(GlobalStor.global.lamGroupFiltered);
                for (var i = 0; i < doorsLaminations.length; i += 1) {
                    if (
                        product.lamination.lamination_in_id ===
                        doorsLaminations[i].lamination_in_id &&
                        product.lamination.lamination_out_id ===
                        doorsLaminations[i].lamination_out_id
                    ) {
                        product.profile.door_sill_list_id =
                            doorsLaminations[i].door_sill_list_id;
                        product.profile.impost_list_id = doorsLaminations[i].impost_list_id;
                        product.profile.rama_list_id = doorsLaminations[i].rama_list_id;
                        product.profile.shtulp_list_id = doorsLaminations[i].shtulp_list_id;
                        product.profile.stvorka_list_id =
                            doorsLaminations[i].stvorka_list_id;
                        break;
                    }
                }
                return product.profile;
            }

            /**==================temp location for this function!!! =================*/

            /**----------- Glass sizes checking -------------*/

            function checkGlassSizes(template) {
                var blocks = template.details,
                    blocksQty = blocks.length,
                    wranGlass,
                    overallGlass,
                    currWidth,
                    currHeight,
                    currSquare,
                    isWidthError,
                    isHeightError,
                    b;

                /** clean extra Glass */
                DesignStor.design.extraGlass.length = 0;

                /** glass loop */
                ProductStor.product.glass.forEach(function (item) {
                    //item.max_sq = 0.2;
                    //item.max_width = 0.50;
                    //item.max_height = 0.50;

                    item.max_sq = parseFloat(item.max_sq);
                    item.max_width = parseFloat(item.max_width);
                    item.max_height = parseFloat(item.max_height);
                    item.min_width = parseFloat(item.min_width);
                    item.min_height = parseFloat(item.min_height);

                    /** check available max_sq and max/min sizes */
                    if (
                        item.max_sq ||
                        (item.max_width &&
                            item.max_height &&
                            item.min_width &&
                            item.min_height)
                    ) {
                        /** template loop */
                        for (b = 1; b < blocksQty; b += 1) {
                            isWidthError = 0;
                            isHeightError = 0;
                            if (blocks[b].glassId === item.id) {
                                if (blocks[b].glassPoints) {
                                    if (blocks[b].glassPoints.length) {
                                        /** estimate current glass sizes */
                                        overallGlass = GeneralServ.getMaxMinCoord(
                                            blocks[b].glassPoints
                                        );
                                        currWidth = Math.round(
                                            overallGlass.maxX - overallGlass.minX
                                        );
                                        currHeight = Math.round(
                                            overallGlass.maxY - overallGlass.minY
                                        );
                                        currSquare = GeneralServ.roundingValue(
                                            currWidth * currHeight / 1000000,
                                            3
                                        );
                                        /** square incorrect */
                                        if (currSquare > item.max_sq) {
                                            wranGlass =
                                                $filter("translate")("design.GLASS") +
                                                " " +
                                                item.name +
                                                " " +
                                                $filter("translate")("design.GLASS_SQUARE") +
                                                " " +
                                                currSquare +
                                                " " +
                                                $filter("translate")("design.MAX_VALUE_HIGHER") +
                                                " " +
                                                item.max_sq +
                                                " " +
                                                $filter("translate")("common_words.LETTER_M") +
                                                "2.";

                                            DesignStor.design.extraGlass.push(wranGlass);
                                        }

                                        if (
                                            currWidth > item.max_width ||
                                            currWidth < item.min_width
                                        ) {
                                            isWidthError = 1;
                                        }
                                        if (
                                            currHeight > item.max_height ||
                                            currHeight < item.min_height
                                        ) {
                                            isHeightError = 1;
                                        }

                                        if (isWidthError && isHeightError) {
                                            /** width and height incorrect */
                                            wranGlass =
                                                $filter("translate")("design.GLASS") +
                                                " " +
                                                item.name +
                                                " " +
                                                $filter("translate")("design.GLASS_SIZE") +
                                                " " +
                                                currWidth +
                                                " x " +
                                                currHeight +
                                                " " +
                                                $filter("translate")("design.NO_MATCH_RANGE") +
                                                " " +
                                                $filter("translate")("design.BY_WIDTH") +
                                                " " +
                                                item.min_width +
                                                " - " +
                                                item.max_width +
                                                ", " +
                                                $filter("translate")("design.BY_HEIGHT") +
                                                " " +
                                                item.min_height +
                                                " - " +
                                                item.max_height +
                                                ".";

                                            DesignStor.design.extraGlass.push(wranGlass);
                                        } else if (isWidthError && !isHeightError) {
                                            /** width incorrect */
                                            wranGlass =
                                                $filter("translate")("design.GLASS") +
                                                " " +
                                                item.name +
                                                " " +
                                                $filter("translate")("design.GLASS_SIZE") +
                                                " " +
                                                currWidth +
                                                " x " +
                                                currHeight +
                                                " " +
                                                $filter("translate")("design.NO_MATCH_RANGE") +
                                                " " +
                                                $filter("translate")("design.BY_WIDTH") +
                                                " " +
                                                item.min_width +
                                                " - " +
                                                item.max_width +
                                                ".";

                                            DesignStor.design.extraGlass.push(wranGlass);
                                        } else if (!isWidthError && isHeightError) {
                                            /** height incorrect */
                                            wranGlass =
                                                $filter("translate")("design.GLASS") +
                                                " " +
                                                item.name +
                                                " " +
                                                $filter("translate")("design.GLASS_SIZE") +
                                                " " +
                                                currWidth +
                                                " x " +
                                                currHeight +
                                                " " +
                                                $filter("translate")("design.NO_MATCH_RANGE") +
                                                " " +
                                                $filter("translate")("design.BY_HEIGHT") +
                                                " " +
                                                item.min_height +
                                                " - " +
                                                item.max_height +
                                                ".";

                                            DesignStor.design.extraGlass.push(wranGlass);
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                //console.info('glass result', DesignStor.design.extraGlass);
            }

            /**----------- Hardware sizes checking -------------*/

            function checkHardwareSizes(template, harwareID) {
                if (ProductStor.product.construction_type !== 4) {
                    var blocks = template.details,
                        blocksQty = blocks.length,
                        harwareId = harwareID || ProductStor.product.hardware.id,
                        limits = GlobalStor.global.hardwareLimits.filter(function (item) {
                            return item.group_id === harwareId;
                        }),
                        limitsQty = limits.length,
                        currLimit = 0,
                        overallSize,
                        currWidth,
                        currHeight,
                        wranSash,
                        isSizeError,
                        b,
                        lim;

                    //console.info('*******', harwareId, GlobalStor.global.hardwareLimits, limits);
                    /** clean extra Hardware */
                    DesignStor.design.extraHardware.length = 0;

                    if (limitsQty) {
                        /** template loop */
                        for (b = 1; b < blocksQty; b += 1) {
                            isSizeError = 0;
                            if (blocks[b].blockType === "sash") {
                                /** finde limit for current sash */
                                for (lim = 0; lim < limitsQty; lim += 1) {
                                    if (limits[lim].type_id === blocks[b].sashType) {
                                        /** check available max/min sizes */
                                        if (
                                            limits[lim].max_width &&
                                            limits[lim].max_height &&
                                            limits[lim].min_width &&
                                            limits[lim].min_height
                                        ) {
                                            currLimit = limits[lim];
                                        }
                                        break;
                                    }
                                }
                                if (currLimit) {
                                    if (blocks[b].hardwarePoints.length) {
                                        /** estimate current sash sizes */
                                        overallSize = GeneralServ.getMaxMinCoord(
                                            blocks[b].hardwarePoints
                                        );
                                        currWidth = Math.round(overallSize.maxX - overallSize.minX);
                                        currHeight = Math.round(
                                            overallSize.maxY - overallSize.minY
                                        );
                                        if (
                                            currWidth > currLimit.max_width ||
                                            currWidth < currLimit.min_width
                                        ) {
                                            isSizeError = 1;
                                        }
                                        if (
                                            currHeight > currLimit.max_height ||
                                            currHeight < currLimit.min_height
                                        ) {
                                            isSizeError = 1;
                                        }

                                        if (isSizeError) {
                                            wranSash =
                                                currWidth +
                                                " x " +
                                                currHeight +
                                                " " +
                                                $filter("translate")("design.NO_MATCH_RANGE") +
                                                " (" +
                                                currLimit.min_width +
                                                " - " +
                                                currLimit.max_width +
                                                ") " +
                                                "x (" +
                                                currLimit.min_height +
                                                " - " +
                                                currLimit.max_height +
                                                ")";

                                            DesignStor.design.extraHardware.push(wranSash);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                //console.info('glass result', DesignStor.design.extraHardware);
            }

            /**-------------- show Info Box of element or group ------------*/

            function showInfoBox(id, itemArr) {
                if (GlobalStor.global.isInfoBox !== id) {
                    var itemArrQty = itemArr.length,
                        tempObj = {};
                    while (--itemArrQty > -1) {
                        if (itemArr[itemArrQty].lamination_type_id) {
                            if (itemArr[itemArrQty].lamination_type_id === id) {
                                tempObj = itemArr[itemArrQty];
                            }
                        } else {
                            if (itemArr[itemArrQty].id === id) {
                                tempObj = itemArr[itemArrQty];
                            }
                        }
                    } 
                    if (UserStor.userInfo.factory_id === 2 && !$.isEmptyObject(tempObj)) {
                        GlobalStor.global.infoTitle = tempObj;
                        GlobalStor.global.infoImg = tempObj.img;
                        GlobalStor.global.infoLink = tempObj.link;
                        GlobalStor.global.infoDescrip = tempObj.description;
                        GlobalStor.global.isInfoBox = id;
                    } else {
                        GlobalStor.global.infoTitle = tempObj.translate;
                        GlobalStor.global.infoImg = tempObj.img;
                        GlobalStor.global.infoLink = tempObj.link;
                        GlobalStor.global.infoDescrip = tempObj.description;
                        GlobalStor.global.isInfoBox = id;
                    }
                }
            }

            /**========== CREATE ORDER ==========*/

            function createNewProject() {
                //----- cleaning product
                ProductStor.product = ProductStor.setDefaultProduct();
                CartStor.cart = CartStor.setDefaultCart();
                OrderStor.order = OrderStor.setDefaultOrder();
                //------- set new orderId
                createOrderData();
                //------- set current Discounts
                setCurrDiscounts();
                GlobalStor.global.isChangedTemplate = 0;
                GlobalStor.global.isShowCommentBlock = 0;
                GlobalStor.global.showCoefInfoBlock = 0;
                GlobalStor.global.isCreatedNewProject = 1;
                GlobalStor.global.isCreatedNewProduct = 1;
                //------- set new templates
                setCurrTemplate();
                prepareTemplates(
                    ProductStor.product.construction_type
                ).then(function () {
                    GlobalStor.global.isLoader = 0;
                    GlobalStor.global.construction_count = 0;
                    prepareMainPage();
                    /** start lamination filtering */
                    cleanLamFilter();
                    laminatFiltering();
                    if (GlobalStor.global.currOpenPage !== "main") {
                        GlobalStor.global.showRoomSelectorDialog = 0;
                        if ($location.path() === "/light" || $location.path() === "/mobile") {
                            if ($location.path() === "/light") {
                                GlobalStor.global.currOpenPage = "light";
                            }
                            if ($location.path() === "/mobile") {
                                GlobalStor.global.currOpenPage = "mobile";
                            }
                        } else {
                            $location.path("/main");
                            GlobalStor.global.currOpenPage = "main";
                        }
                    }
                });
            }

            /**========== CREATE PRODUCT ==========*/

            function createNewProduct() {
                // console.time('createNewProduct');
                //------- cleaning product
                ProductStor.product = ProductStor.setDefaultProduct();
                GlobalStor.global.isCreatedNewProduct = 1;
                GlobalStor.global.isChangedTemplate = 0;
                //------- set new templates
                setCurrTemplate();
                prepareTemplates(
                    ProductStor.product.construction_type
                ).then(function () {
                    /** start lamination filtering */
                    cleanLamFilter();
                    laminatFiltering();

                    // console.timeEnd('createNewProduct');
                });
                if (GlobalStor.global.currOpenPage !== "main") {
                    GlobalStor.global.showRoomSelectorDialog = 0;
                    if ($location.path() === "/light" || $location.path() === "/mobile") {
                        if ($location.path() === "/light") {
                            GlobalStor.global.currOpenPage = "light";
                        }
                        if ($location.path() === "/mobile") {
                            GlobalStor.global.currOpenPage = "mobile";
                            $timeout(function () {
                                closePanelMobile();
                            }, 500);
                        }
                    } else {
                        $location.path("/main");
                        GlobalStor.global.currOpenPage = "main";
                    }
                }
                prepareMainPage();
            }

            /**========== SAVE PRODUCT ==========*/

            function checkEmptyChoosenAddElems() {
                var addElemQty = ProductStor.product.chosenAddElements.length,
                    isExist = 0;

                while (--addElemQty > -1) {
                    if (ProductStor.product.chosenAddElements[addElemQty].length) {
                        isExist++;
                    }
                }
                return isExist;
            }

            //-------- Save Product in Order and go to Cart
            function inputProductInOrder() {
                var permission = 1;
                //------- if AddElems only, check is there selected AddElems
                if (ProductStor.product.is_addelem_only) {
                    permission = checkEmptyChoosenAddElems();
                }

                if (permission) {
                    // console.info('product-----', ProductStor.product);
                    GlobalStor.global.tempAddElements.length = 0;
                    GlobalStor.global.configMenuTips = 0;
                    GlobalStor.global.isShowCommentBlock = 0;
                    setDefaultAuxParam();

                    /**============ EDIT Product =======*/
                    if (GlobalStor.global.productEditNumber) {
                        var productsQty = OrderStor.order.products.length;
                        //-------- replace product in order
                        while (--productsQty > -1) {
                            if (
                                OrderStor.order.products[productsQty].product_id ===
                                GlobalStor.global.productEditNumber
                            ) {
                                OrderStor.order.products[productsQty] = angular.copy(
                                    ProductStor.product
                                );
                            }
                        }
                        GlobalStor.global.productEditNumber = 0;
                        /**========== if New Product =========*/
                    } else {
                        ProductStor.product.product_id =
                            OrderStor.order.products.length > 0 ?
                                OrderStor.order.products.length + 1 :
                                1;
                        //delete ProductStor.product.template;
                        //-------- insert product in order
                        // OrderStor.order.products.push(ProductStor.product);
                        OrderStor.order.products.push(angular.copy(ProductStor.product));
                    }
                    //----- finish working with product
                    GlobalStor.global.isCreatedNewProduct = 0;
                    GeneralServ.stopStartProg();
                    GlobalStor.global.isChangedTemplate = 0;
                    GlobalStor.global.isNewTemplate = 0;
                }
                // console.log(OrderStor.order);
                return permission;
            }

            //--------- moving to Cart when click on Cart button
            function goToCart() {
                if (OrderStor.order.products.length) {
                    $timeout(function () {
                        //------- set previos Page
                        GeneralServ.setPreviosPage();
                        $location.path("/cart");
                        GlobalStor.global.currOpenPage = "cart";
                    }, 100);
                }
            }

            /** ========== SAVE ORDER ==========*/

            //-------- delete order from LocalDB
            function deleteOrderInDB(orderNum) {
                localDB.deleteRowLocalDB("orders", {
                    id: orderNum
                });
                localDB.deleteRowLocalDB(
                    "order_products", {
                        order_id: orderNum
                    }
                );
                localDB.deleteRowLocalDB(
                    "order_addelements", {
                        order_id: orderNum
                    }
                );
            }

            //-------- save Order into Local DB
            function saveOrderInDB(newOptions, orderType, orderStyle) {
                var deferred = $q.defer();
                angular.extend(OrderStor.order, newOptions);
                if (OrderStor.order.order_edit === 1) {
                    localDB.deleteRowLocalDB(
                        "order_products", {
                            order_id: OrderStor.order.id
                        }
                    );
                    localDB.deleteRowLocalDB(
                        "order_addelements", {
                            order_id: OrderStor.order.id
                        }
                    );
                    localDB
                        .deleteProductServer(
                            UserStor.userInfo.phone,
                            UserStor.userInfo.device_code,
                            OrderStor.order.id,
                            "order_products"
                        )
                        .then(function (def1) {
                            localDB
                                .deleteProductServer(
                                    UserStor.userInfo.phone,
                                    UserStor.userInfo.device_code,
                                    OrderStor.order.id,
                                    "order_addelements"
                                )
                                .then(function (def2) {
                                    save().then(function (res) {
                                        deferred.resolve(1);
                                    });
                                });
                        });
                } else {
                    save().then(function (res) {
                        deferred.resolve(1);
                    });
                }

                /** ===== SAVE PRODUCTS =====*/
                function save() {
                    var defer = $q.defer();
                    var prodQty = OrderStor.order.products.length,
                        p;
                    OrderStor.order.products_qty = 0;
                    for (p = 0; p < prodQty; p += 1) {
                        /** culculate products quantity for order */
                        OrderStor.order.products_qty +=
                            OrderStor.order.products[p].product_qty;
                    }
                    /** ============ SAVE ORDER =========== */
                    var orderData = angular.copy(OrderStor.order);
                    orderData.order_date = new Date(OrderStor.order.order_date);
                    orderData.order_type = orderType;
                    orderData.order_price_dis = OrderStor.order.order_price_dis;
                    orderData.order_price = OrderStor.order.order_price;
                    orderData.order_price_primary = OrderStor.order.order_price_primary;
                    orderData.order_style = orderStyle;
                    orderData.factory_id = UserStor.userInfo.factory_id;
                    orderData.user_id = UserStor.userInfo.id;
                    orderData.comment = OrderStor.order.comment;
                    orderData.delivery_date = new Date(OrderStor.order.delivery_date);
                    orderData.new_delivery_date = new Date(
                        OrderStor.order.new_delivery_date
                    );
                    orderData.customer_sex = +OrderStor.order.customer_sex || 0;
                    orderData.customer_age = OrderStor.order.customer_age ? OrderStor.order.customer_age.id : 0;
                    orderData.customer_education = OrderStor.order.customer_education ? OrderStor.order.customer_education.id : 0;
                    orderData.customer_occupation = OrderStor.order.customer_occupation ? OrderStor.order.customer_occupation.id : 0;
                    orderData.customer_infoSource = OrderStor.order.customer_infoSource ? OrderStor.order.customer_infoSource.id : 0;
                    orderData.products_qty = GeneralServ.roundingValue(
                        OrderStor.order.products_qty
                    );
                    orderData.sync_date = GlobalStor.global.loadDate;
                    if (GlobalStor.global.ISEXT) {
                        orderData.app_version = "offline";
                    } else {
                        orderData.app_version = "online";
                    }

                    //----- rates %
                    orderData.discount_construct_max =
                        UserStor.userInfo.discountConstrMax;
                    orderData.discount_addelem_max = UserStor.userInfo.discountAddElemMax;
                    orderData.default_term_plant =
                        GlobalStor.global.deliveryCoeff.percents[
                        GlobalStor.global.deliveryCoeff.standart_time
                        ];
                    orderData.disc_term_plant = CartStor.cart.discountDeliveyPlant;
                    orderData.margin_plant = CartStor.cart.marginDeliveyPlant;

                    if (orderType && orderData.order_edit === 0) {
                        orderData.additional_payment = "";
                        orderData.created = new Date();
                        orderData.sended = new Date(0);
                        orderData.state_to = new Date(0);
                        orderData.state_buch = new Date(0);
                        orderData.batch = "---";
                        orderData.base_price = 0;
                        orderData.factory_margin = 0;
                        orderData.purchase_price = 0;
                        // orderData.sale_price = 0;
                        orderData.modified = new Date();
                    }

                    delete orderData.products;
                    delete orderData.floorName;
                    delete orderData.mountingName;
                    delete orderData.dismantling_name;
                    delete orderData.selectedInstalmentPeriod;
                    delete orderData.selectedInstalmentPercent;
                    delete orderData.productsPriceDis;
                    delete orderData.orderPricePrimaryDis;
                    delete orderData.paymentFirstDis;
                    delete orderData.paymentMonthlyDis;
                    delete orderData.paymentFirstPrimaryDis;
                    delete orderData.paymentMonthlyPrimaryDis;

                    if (orderType && orderData.order_edit === 0) {
                        delete orderData.order_edit;
                        localDB
                            .insertServer(
                                UserStor.userInfo.phone,
                                UserStor.userInfo.device_code,
                                "orders",
                                orderData
                            )
                            .then(function (respond) {
                                if (
                                    GlobalStor.global.onlineMode &&
                                    navigator.onLine &&
                                    respond
                                ) {
                                    if (respond.status) {
                                        orderData.order_number = respond.order_number;
                                    } else {
                                        orderData.order_number = 0;
                                    }
                                } else {
                                    orderData.order_number = 0;
                                }
                                localDB.insertRowLocalDB(
                                    orderData,
                                    "orders"
                                );
                                defer.resolve(1);
                            });
                    } else if (orderType && orderData.order_edit === 1) {
                        var orderId = angular.copy(orderData.id);
                        delete orderData.order_edit;
                        localDB
                            .updateOrderServer(
                                UserStor.userInfo.phone,
                                UserStor.userInfo.device_code,
                                "orders",
                                angular.copy(orderData),
                                orderId
                            )
                            .then(function (res) {
                                // orderData.id = orderId;
                                //------- save draft
                                localDB.updateLocalDB(
                                    "orders",
                                    angular.copy(orderData), {
                                        'id': orderId
                                    }
                                );
                                defer.resolve(1);
                            });
                    }

                    for (p = 0; p < prodQty; p += 1) {
                        var productData = angular.copy(OrderStor.order.products[p]);
                        productData.order_id = OrderStor.order.id;
                        if (!productData.is_addelem_only) {
                            productData.template_source["beads"] = angular.copy(
                                productData.beadsData
                            );
                        }
                        if (productData.construction_type === 4) {
                            productData.profile_id = 0;
                            productData.door_group_id =
                                OrderStor.order.products[p].door_group_id;
                        } else {
                            productData.profile_id = OrderStor.order.products[p].profile.id;
                            productData.door_group_id ?
                                (productData.door_group_id = 0) :
                                (productData.door_group_id = 0);
                        }
                        productData.glass_id = _.map(
                            OrderStor.order.products[p].glass,
                            function (item) {
                                return item.id;
                            }
                        ).join(", ");

                        if (productData.construction_type === 4) {
                            productData.hardware_id = productData.doorLock.id;
                        } else {
                            if (productData.hardware.id) {
                                productData.hardware_id = productData.hardware.id;
                            } else {
                                productData.hardware_id = 0;
                            }
                        }
                        productData.lamination_id =
                            OrderStor.order.products[p].lamination.id;
                        productData.template_source = !productData.is_addelem_only ?
                            JSON.stringify(productData.template_source) :
                            JSON.stringify({});
                        productData.lamination_in_id =
                            OrderStor.order.products[p].lamination.img_in_id;
                        productData.lamination_out_id =
                            OrderStor.order.products[p].lamination.img_out_id;
                        productData.modified = new Date();
                        if (productData.template) {
                            delete productData.template;
                        }
                        delete productData.templateIcon;
                        delete productData.profile;
                        delete productData.glass;
                        delete productData.hardware;
                        delete productData.lamination;
                        delete productData.chosenAddElements;
                        delete productData.profileDepths;
                        delete productData.addelemPriceDis;
                        delete productData.productPriceDis;
                        delete productData.report;
                        delete productData.beadsData;
                        delete productData.doorName;
                        delete productData.doorSashName;
                        delete productData.doorHandle;
                        delete productData.doorLock;

                        if (orderType) {
                            console.log('productData', productData)
                            localDB.insertRowLocalDB(
                                productData,
                                "order_products"
                            );
                            localDB.insertServer(
                                UserStor.userInfo.phone,
                                UserStor.userInfo.device_code,
                                "order_products",
                                productData
                            );
                        }

                        /** ====== SAVE Report Data ===== */
                        var productReportData = angular.copy(
                            OrderStor.order.products[p].report
                        ),
                            reportQty = productReportData.length;
                        while (--reportQty > -1) {
                            productReportData[reportQty].order_id = OrderStor.order.id;
                            productReportData[reportQty].price = angular.copy(
                                productReportData[reportQty].priceReal
                            );
                            delete productReportData[reportQty].priceReal;
                            //-------- insert product Report into local DB
                            //localDB.insertRowLocalDB(productReportData[reportQty], localDB.tablesLocalDB.order_elements.tableName);
                            //-------- send Report to Server
                            // TODO localDB.insertServer(
                            // UserStor.userInfo.phone, UserStor.userInfo.device_code,
                            // localDB.tablesLocalDB.order_elements.tableName, productReportData[reportQty]);
                        }

                        /**============= SAVE ADDELEMENTS ============ */

                        var addElemQty = OrderStor.order.products[p].chosenAddElements.length, add;
                        for (add = 0; add < addElemQty; add += 1) {
                            var elemQty =
                                OrderStor.order.products[p].chosenAddElements[add].length,
                                elem;
                            if (elemQty > 0) {
                                for (elem = 0; elem < elemQty; elem += 1) {
                                    if (
                                        OrderStor.order.products[p].chosenAddElements[add][elem]
                                            .list_group_id === 20 &&
                                        !productData.is_addelem_only
                                    ) {
                                        if (
                                            typeof OrderStor.order.products[p].chosenAddElements[add][
                                                elem
                                            ].block_id !== "number"
                                        ) {
                                            OrderStor.order.products[p].chosenAddElements[add][
                                                elem
                                            ].block_id = OrderStor.order.products[
                                                p
                                            ].chosenAddElements[add][elem].block_id.split("_")[1];
                                        }
                                    }
                                    var addElementsData = {
                                        order_id: OrderStor.order.id,
                                        product_id: OrderStor.order.products[p].product_id,
                                        element_type: OrderStor.order.products[p].chosenAddElements[add][elem]
                                            .element_type,
                                        element_id: OrderStor.order.products[p].chosenAddElements[add][elem]
                                            .id,
                                        name: OrderStor.order.products[p].chosenAddElements[add][elem]
                                            .name,
                                        element_width: OrderStor.order.products[p].chosenAddElements[add][elem]
                                            .element_width,
                                        element_height: OrderStor.order.products[p].chosenAddElements[add][elem]
                                            .element_height,
                                        element_price: OrderStor.order.products[p].chosenAddElements[add][elem]
                                            .element_price,
                                        element_qty: OrderStor.order.products[p].chosenAddElements[add][elem]
                                            .element_qty,
                                        block_id: OrderStor.order.products[p].chosenAddElements[add][elem]
                                            .block_id * 1,

                                        // top_id :OrderStor.order.products[p].chosenAddElements[add][elem].top_id,
                                        // cloth_id :OrderStor.order.products[p].chosenAddElements[add][elem].cloth_id,
                                        // cloth_waste :OrderStor.order.products[p].chosenAddElements[add][elem].cloth_waste,
                                        // top_waste :OrderStor.order.products[p].chosenAddElements[add][elem].top_waste,
                                        // right_waste :OrderStor.order.products[p].chosenAddElements[add][elem].right_waste,
                                        // bottom_waste :OrderStor.order.products[p].chosenAddElements[add][elem].bottom_waste,
                                        // left_waste :OrderStor.order.products[p].chosenAddElements[add][elem].left_waste,
                                        modified: new Date()
                                    };

                                    if (orderType) {
                                        localDB.insertRowLocalDB(
                                            addElementsData,
                                            localDB.tablesLocalDB.order_addelements.tableName
                                        );
                                        localDB.insertServer(
                                            UserStor.userInfo.phone,
                                            UserStor.userInfo.device_code,
                                            localDB.tablesLocalDB.order_addelements.tableName,
                                            addElementsData
                                        );
                                    }
                                }
                            }
                        }
                    }

                    //TODO
                    //------ send analytics data to Server
                    //      AnalyticsServ.sendAnalyticsDB();

                    //----- cleaning order
                    OrderStor.order = OrderStor.setDefaultOrder();
                    //------ set current GeoLocation
                    loginServ.setUserGeoLocation(
                        UserStor.userInfo.city_id,
                        UserStor.userInfo.cityName,
                        UserStor.userInfo.climatic_zone,
                        UserStor.userInfo.heat_transfer,
                        UserStor.userInfo.fullLocation
                    );
                    //----- finish working with order
                    GlobalStor.global.isCreatedNewProject = 0;
                    return defer.promise;
                }

                return deferred.promise;
            }

            function setGlassfilter() {
                var product = angular.copy(ProductStor.product);
                var tempGlassArr = GlobalStor.global.glassesAll.filter(function (item) {
                    if (product.profile.profileId) {
                        return product.construction_type == 4 ?
                            item.profileId === product.profile.profileId :
                            item.profileId === product.profile.id;
                    } else {
                        return item.profileId === product.profile.id;
                    }
                });
                GlobalStor.global.glassTypes = angular.copy(tempGlassArr[0].glassTypes);
                GlobalStor.global.glasses = angular.copy(tempGlassArr[0].glasses);
            }

            function setGlassDefault(profileId, template, product) {
                product.glass.length = 0;
                var tempGlassArr = GlobalStor.global.glassesAll.filter(function (item) {
                    return item.profileId === profileId;
                });

                GlobalStor.global.glasses = angular.copy(tempGlassArr[0].glasses);
                product.glass.push(angular.copy(GlobalStor.global.glasses[0][0]));

                GlobalStor.global.glassTypes = angular.copy(tempGlassArr[0].glassTypes);
                GlobalStor.global.selectGlassId = product.glass[0].id;
                GlobalStor.global.selectGlassName = product.glass[0].sku;

                for (var x = 0; x < template.details.length; x += 1) {
                    template.details[x].glassId = product.glass[0].id;
                    template.details[x].glassTxt = product.glass[0].sku;
                    template.details[x].glass_type = product.glass[0].glass_type;
                }
            }

            function displayData(value) {
                return angular.copy(value) * 0.0393701;
            }

            function profile() {
                var deferred = $q.defer();
                if (ProductStor.product.is_addelem_only === 0) {
                    localDB.selectLocalDB(
                        localDB.tablesLocalDB.elements_profile_systems.tableName, {
                            'profile_system_id': ProductStor.product.profile.id
                        }).then(function (result) {
                            GlobalStor.global.dataProfiles = angular.copy(result);
                            deferred.resolve(result);
                        });
                }
                return deferred.promise;
            }

            function resize() {
                let obj = $("#main-frame");
                let width = obj.width();
                let height = obj.height();
                let scale = 1,
                    left = 0,
                    top = 0;
                if (self.innerWidth / width > self.innerHeight / height) {
                    scale = self.innerHeight / height;
                    left = Math.round(Math.abs(self.innerWidth - width * scale) / 2);
                } else {
                    scale = self.innerWidth / width;
                    top = Math.round(Math.abs(self.innerHeight - height * scale) / 2);
                }
                if (scale > 1) {
                    scale = 1;
                }
                obj.css({
                    "transform": "scale(" + scale + ")",
                    "left": left + "px",
                    "top": top + "px"
                });
            }

            function closePanelMobile(closeAll) {
                GlobalStor.global.activePanel = 0;
                GlobalStor.global.MobileTabActive = 0;
                GlobalStor.global.OpenSubFolder = -1;
                CartStor.cart.showCurrentTemp = 0;
                if (!ProductStor.product.is_addelem_only) {
                    SVGServ.createSVGTemplate(DesignStor.design.templateSourceTEMP, ProductStor.product.profileDepths)
                        .then(function (result) {
                            DesignStor.design.templateTEMP = angular.copy(result);
                            DesignStor.design.templateTEMP.details.forEach(function (entry, index) {
                                if (entry.impost) {
                                    DesignStor.design.templateSourceTEMP.details[index].impost.impostAxis[1].x = entry.impost.impostAxis[0].x;
                                    DesignStor.design.templateSourceTEMP.details[index].impost.impostAxis[0].x = entry.impost.impostAxis[1].x;
                                }
                            });

                        });
                } else {
                    if (!closeAll) {
                        setTimeout(() => {
                            $('#checkForAddElem').trigger('click');
                        }, 50);
                    }
                }

            }

            function getPCPower() {
                var iterations = 1000000;
                var s = 0;
                var diffs = 0;
                for (var j = 0; j < 10; j++) {
                    var start = +new Date();
                    for (var i = 0; i < iterations; i++) {
                        var t = Math.sqrt(i) * Math.sin(i) * Math.cos(i / 2) / 2;
                        s += t;
                    }
                    var end = +new Date();

                    var diff = end - start;
                    diffs += diff;
                }
                GlobalStor.global.getPCPower = Math.round(1000000 / diffs);
                GlobalStor.global.loader = 2;
                return Math.round(1000000 / diffs);
            }

            function extendUrl(url) {
                // return cordova.file.applicationStorageDirectory + url;
                return cordova.file.dataDirectory + url;
            }

            /**========== FINISH ==========*/

            thisFactory.publicObj = {
                extendUrl: extendUrl,
                getPCPower: getPCPower,
                closePanelMobile: closePanelMobile,
                profile: profile,
                resize: resize,
                displayData: displayData,
                setCurrentGlassInTemplate: setCurrentGlassInTemplate,
                setGlassfilter: setGlassfilter,
                setGlassDefault: setGlassDefault,
                saveUserEntry: saveUserEntry,
                createOrderData: createOrderData,
                createOrderID: createOrderID,
                doorProfile: doorProfile,
                setCurrDiscounts: setCurrDiscounts,
                setCurrTemplate: setCurrTemplate,
                prepareTemplates: prepareTemplates,
                downloadAllTemplates: downloadAllTemplates,

                setCurrentProfile: setCurrentProfile,
                setCurrentDoorProfile: setCurrentDoorProfile,
                setCurrentGlass: setCurrentGlass,
                setGlassToTemplateBlocks: setGlassToTemplateBlocks,
                setCurrentHardware: setCurrentHardware,
                fineItemById: fineItemById,
                parseTemplate: parseTemplate,
                saveTemplateInProduct: saveTemplateInProduct,
                downloadProfileDepth: downloadProfileDepth,
                checkSashInTemplate: checkSashInTemplate,
                preparePrice: preparePrice,
                setProductPriceTOTAL: setProductPriceTOTAL,
                showInfoBox: showInfoBox,
                closeRoomSelectorDialog: closeRoomSelectorDialog,
                laminatFiltering: laminatFiltering,
                cleanLamFilter: cleanLamFilter,
                laminationDoor: laminationDoor,
                setCurrLamination: setCurrLamination,
                setProfileByLaminat: setProfileByLaminat,
                checkGlassSizes: checkGlassSizes,
                checkHardwareSizes: checkHardwareSizes,

                createNewProject: createNewProject,
                createNewProduct: createNewProduct,
                setDefaultDoorConfig: setDefaultDoorConfig,
                prepareMainPage: prepareMainPage,
                setDefaultAuxParam: setDefaultAuxParam,

                inputProductInOrder: inputProductInOrder,
                goToCart: goToCart,
                saveOrderInDB: saveOrderInDB,
                deleteOrderInDB: deleteOrderInDB,

                setCurrentGlassForTemplate: setCurrentGlassForTemplate,
                getOnline: getOnline,
                calculationPrice: calculationPrice,
                calculateCoeffs: calculateCoeffs,
                setBeadId: setBeadId,
                prepareReport: prepareReport
            };

            return thisFactory.publicObj;
        });
})();
