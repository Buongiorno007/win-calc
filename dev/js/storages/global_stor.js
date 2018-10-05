(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('BauVoiceApp')
        .factory('GlobalStor',


            function () {
                /*jshint validthis:true */
                var thisFactory = this;

                function setDefaultGlobal() {
                    return angular.copy(thisFactory.publicObj.globalSource);
                }

                thisFactory.publicObj = {
                    globalSource: {
                        cordova: 0,
                        mobileOrderHistory: 0,
                        showMountDelivery: 0,
                        OpenSubFolder: -1,
                        OpenItemFolder: -1,
                        selectedGrid: '',
                        SelectedName: "",
                        MobileTabActive: 0,
                        goLeft: false,
                        showTemplates: false,
                        ISLOGIN: 0,
                        isZeroPriceList: [],
                        screw: 0,
                        showAllGlass: 0,
                        isSavingAlert: 0,
                        isNoChangedProduct: 0,
                        isTest: 0,
                        isDesignError: 0,
                        product_qty: 1,
                        showConfiguration: 0,
                        showKarkas: 1,
                        showCart: 0,
                        isLightVersion: 0,
                        ISEXT: ISEXTFLAG,
                        onlineMode: 0,
                        hintTimer: 0,
                        analitics_storage: [],
                        showReport: 0,
                        showCoefInfoBlock: 0,
                        loadDate: 0,
                        showCurrentTemp: 0,
                        getPCPower: 0,
                        isDevice: 0,
                        continued: 0,
                        checkAlert: 0,
                        loader: 0,
                        setTimeout: 0,
                        isLoader: 0,
                        isLoader2: 0,
                        isLoader3: 0,
                        inform: [],
                        checkSashInTemplate: 0,
                        dangerAlert: 0,
                        gotoSettingsPage: 0,
                        startProgramm: 1, // for START
                        //------ navigation
                        isNavMenu: 1,
                        isConfigMenu: 0,
                        activePanel: 0,
                        configMenuTips: 0,
                        //isTemplateItemMenu: 0,
                        //isTemplateItemDesign: 1,
                        isCreatedNewProject: 1,
                        copyGlabalStorGlassesAll: [],

                        isCreatedNewProduct: 1,
                        productEditNumber: 0,
                        orderEditNumber: 0,

                        prevOpenPage: '',
                        currOpenPage: 'main',

                        isChangedTemplate: 0,
                        isVoiceHelper: 0,
                        voiceHelperLanguage: '',
                        showGlassSelectorDialog: 0,
                        isShowCommentBlock: 0,
                        isTemplateTypeMenu: 0,
                        createHandle: [],
                        heightTEMP: [],
                        widthTEMP: [],

                        //------ Rooms background
                        showRoomSelectorDialog: 0,
                        rooms: [],
                        isRoomElements: 0,

                        //------- Templates
                        imgLink: '',
                        selectRoom: 0,
                        background: 0,
                        heightCheck: 0,
                        widthCheck: 0,
                        templateLabel: '',
                        templatesSource: [],
                        templatesSourceSTORE: [],
                        //TODO templateIcons: [],
                        isSashesInTemplate: 0,
                        templateIndex: -1,
                        templatesType: 1,

                        //------ Profiles
                        profiles: [],
                        profilesType: [],

                        //------- Glasses
                        glassesAll: [],
                        glassTypes: [],
                        glasses: [],
                        selectGlassId: 0,
                        selectGlassName: '',
                        prevGlassId: 0,
                        prevGlassName: '',

                        //------ Hardwares
                        hardwares: [],
                        hardwareTypes: [],
                        hardwareLimits: [],

                        //------ Lamination
                        laminats: [],
                        laminatCouples: [],
                        lamGroupFiltered: [],

                        //------ Add Elements
                        typeMenu: 5555,
                        typeMenuID: 5555,
                        addElementsAll: [],
                        tempAddElements: [],

                        //-------- Door
                        noDoorExist: 0,
                        checkDoors: 0,
                        doorKitsT1: [],
                        doorKitsT2: [],
                        type_door: 0,
                        doorHandlers: [],
                        doorLocks: [],
                        doorsGroups: [],
                        doorsLaminations: [],

                        //------ Cart
                        supplyData: [],
                        assemblingData: [],
                        disassemblyData: [],
                        instalmentsData: [],

                        //------ Info
                        isInfoBox: 0,
                        infoTitle: '',
                        infoImg: '',
                        infoLink: '',
                        infoDescrip: '',

                        //---- report
                        isReport: 0,
                        isMobileReport: 0,

                        currencies: [],
                        locations: {
                            countries: [],
                            regions: [],
                            cities: [],
                            areas: []
                        },
                        margins: {},
                        deliveryCoeff: {},

                        //----- Alert
                        isAlert: 0,
                        isAlertInfo: 0,
                        isSyncAlert: 0,
                        alertTitle: '',
                        alertDescr: '',
                        isBox: 0,
                        isAlertHistory: 0,
                        isEditBox: 0,
                        confirmAction: 0,
                        confirmInActivity: 0,

                        //---- Calculators
                        isQtyCalculator: 0,
                        isSizeCalculator: 0,
                        isWidthCalculator: 0,
                        maxSizeLimit: 3200,
                        maxSquareLimit: 6,
                        changeLocation: 1,
                        tempPrice: 0,
                        isNewTemplate: 0,
                        construction_count: 0,
                        isServiceCalculator: 0,
                        servicesPriceIndex: -1,
                        toggleDiscount: 0,
                        TEMP_HARDWARES: [],

                        //defaultsArmirs
                        ////////////////////////////////////////////////////////////
                        defaultWindowSize0: [[1.4, 1.3, 1.4],
                        [1.3],
                        [],
                        [],
                        [],//0
                        [{ elemId: 311891, sizes: [1.206, 1.306, 1.206, 1.306], square: 1.575036 }],
                        [{ elemId: 311884, glassId: 311891, sizes: [1.219, 1.319, 1.219, 1.319] }],
                        []],
                        /////////////////////////////////////////////////////
                        // defaultWindowSize6: [[1.4, 1.3, 1.4],
                        // [1.3],
                        // [0.608, 1.337, 0.608, 1.337, 0.608, 1.337, 0.608, 1.337],
                        // [1.319],
                        // [],//6
                        // [{ elemId: 311891, sizes: [0.482, 1.211, 0.482, 1.211], square: 0.583702 }, { elemId: 311891, sizes: [0.482, 1.211, 0.482, 1.211], square: 0.583702 }],
                        // [{ elemId: 311884, glassId: 311891, sizes: [0.495, 1.224, 0.495, 1.224] }, { elemId: 311884, glassId: 311891, sizes: [0.495, 1.224, 0.495, 1.224] }],
                        // [{ openDir: [3], sizes: [566, 1295, 566, 1295], type: 2 }, { openDir: [1, 2], sizes: [566, 1295, 566, 1295], type: 6 }]],
                        // ///////////////////////////////
                        defaultWindowSize1: [[1.4, 0.7, 1.4],
                        [0.7],
                        [0.637, 1.337, 0.637, 1.337],
                        [],
                        [],//1
                        [{ elemId: 311891, sizes: [0.511, 1.211, 0.511, 1.211], square: 0.618821 }],
                        [{ elemId: 311884, glassId: 311891, sizes: [0.524, 1.224, 0.524, 1.224] }],
                        [{ openDir: [2], sizes: [595, 1295, 595, 1295], type: 2 }]],
                        /////////////////////////////////////////
                        defaultWindowSize2: [[1.4, 0.7, 1.4],
                        [0.7],
                        [],
                        [],//2
                        [],
                        [{ elemId: 311891, sizes: [0.511, 1.211, 0.511, 1.211], square: 0.618821 }],
                        [{ elemId: 317053, glassId: 311891, sizes: [0.524, 1.224, 0.524, 1.224] }],
                        [{ openDir: [1, 2], sizes: [595, 1295, 595, 1295], type: 6 }]],
                        //////////////////////////////////////////
                        // defaultWindowSize3: [[1.4, 0.7, 1.4],
                        // [0.7],
                        // [0.637, 1.337, 0.637, 1.337],
                        // [],
                        // [],
                        // [{ elemId: 311891, sizes: [0.511, 1.211, 0.511, 1.211], square: 0.618821 }],
                        // [{ elemId: 312658, glassId: 311891, sizes: [0.524, 1.224, 0.524, 1.224] }],
                        // [{ openDir: [1, 2], sizes: [595, 1295, 595, 1295], type: 6 }]],
                        ///////////////////////////////////////////////////
                        defaultWindowSize3: [[1.4, 1.3, 1.4],
                        [1.3],
                        [],
                        [1.319],
                        [], //3
                        [{ elemId: 311891, sizes: [0.577, 1.306, 0.577, 1.306], square: 0.7532355 }, { elemId: 311891, sizes: [0.577, 1.306, 0.577, 1.306], square: 0.7532355 }],
                        [{ elemId: 311884, glassId: 311891, sizes: [0.59, 1.319, 0.59, 1.319] }, { elemId: 311884, glassId: 311891, sizes: [0.59, 1.319, 0.59, 1.319] }],
                        []],
                        ///////////////////////////////////////////////////
                        defaultWindowSize4: [[1.4, 1.3, 1.4],
                        [1.3],
                        [0.608, 1.337, 0.608, 1.337],
                        [1.319],
                        [],//4
                        [{ elemId: 311891, sizes: [0.577, 1.306, 0.577, 1.306], square: 0.7532355 }, { elemId: 311891, sizes: [0.482, 1.211, 0.482, 1.211], square: 0.583702 }],
                        [{ elemId: 311884, glassId: 311891, sizes: [0.59, 1.319, 0.59, 1.319] }, { elemId: 311884, glassId: 311891, sizes: [0.495, 1.224, 0.495, 1.224] }],
                        []],
                        ///////////////////////////////////////////////////
                        defaultWindowSize5: [[1.4, 1.3, 1.4],
                        [1.3],
                        [0.608, 1.337, 0.608, 1.337],
                        [1.319],
                        [],//5
                        [{ elemId: 311891, sizes: [0.577, 1.306, 0.577, 1.306], square: 0.7532355 }, { elemId: 311891, sizes: [0.482, 1.211, 0.482, 1.211], square: 0.583702 }],
                        [{ elemId: 311884, glassId: 311891, sizes: [0.59, 1.319, 0.59, 1.319] }, { elemId: 311884, glassId: 311891, sizes: [0.495, 1.224, 0.495, 1.224] }],
                        [{ openDir: [1, 2], sizes: [566, 1295, 566, 1295], type: 6 }]],
                        //////////////////////////////////////////////
                        defaultWindowSize6: [[1.4, 1.3, 1.4],
                        [1.3],
                        [0.608, 1.337, 0.608, 1.337, 0.608, 1.337, 0.608, 1.337],
                        [1.319],
                        [], //6
                        [{ elemId: 311891, sizes: [0.482, 1.211, 0.482, 1.211], square: 0.583702 }, { elemId: 311891, sizes: [0.482, 1.211, 0.482, 1.211], square: 0.583702 }],
                        [{ elemId: 311884, glassId: 311891, sizes: [0.495, 1.224, 0.495, 1.224] }, { elemId: 311884, glassId: 311891, sizes: [0.495, 1.224, 0.495, 1.224] }],
                        [{ openDir: [3], sizes: [566, 1295, 566, 1295], type: 2 }, { openDir: [1, 2], sizes: [566, 1295, 566, 1295], type: 6 }]],
                        //////////////////////////////////////////////
                        defaultWindowSize8: [[1.4, 2.1, 1.4],
                        [2.1],
                        [],
                        [1.319, 1.319],
                        [],
                        [{ elemId: 311891, sizes: [0.627, 1.306, 0.627, 1.306], square: 0.8185355 }, { elemId: 311891, sizes: [0.627, 1.306, 0.627, 1.306], square: 0.8185355 }, { elemId: 311891, sizes: [0.648, 1.306, 0.648, 1.306], square: 0.845635 }],
                        [{ elemId: 317053, glassId: 311891, sizes: [0.64, 1.319, 0.64, 1.319] }, { elemId: 317053, glassId: 311891, sizes: [0.64, 1.319, 0.64, 1.319] }, { elemId: 317053, glassId: 311891, sizes: [0.661, 1.319, 0.661, 1.319] }],
                        []],
                        /////////////////////////////////////////////
                        defaultWindowSize9: [[1.4, 2.1, 1.4],
                        [2.1],
                        [0.679, 1.338, 0.679, 1.338],
                        [1.319, 1.319],
                        [],
                        [{ elemId: 311891, sizes: [0.627, 1.306, 0.627, 1.306], square: 0.8185355 }, { elemId: 311891, sizes: [0.553, 1.212, 0.553, 1.212], square: 0.6699595 }, { elemId: 311891, sizes: [0.627, 1.306, 0.627, 1.306], square: 0.8185355 }],
                        [{ elemId: 311884, glassId: 311891, sizes: [0.64, 1.319, 0.64, 1.319] }, { elemId: 311884, glassId: 311891, sizes: [0.566, 1.225, 0.566, 1.225] }, { elemId: 311884, glassId: 311891, sizes: [0.64, 1.319, 0.64, 1.319] }],
                        [{ openDir: [2], sizes: [637, 1295.5, 637, 1295.5], type: 2 }]],
                        ////////////////////////////////////////
                        defaultWindowSize10: [[1.4, 2.1, 1.4],
                        [2.1],
                        [0.679, 1.338, 0.679, 1.338],
                        [1.319, 1.319],
                        [],//10
                        [{ elemId: 311891, sizes: [0.627, 1.306, 0.627, 1.306], square: 0.8185355 }, { elemId: 311891, sizes: [0.553, 1.212, 0.553, 1.212], square: 0.6699595 }, { elemId: 311891, sizes: [0.627, 1.306, 0.627, 1.306], square: 0.8185355 }],
                        [{ elemId: 311884, glassId: 311891, sizes: [0.64, 1.319, 0.64, 1.319] }, { elemId: 311884, glassId: 311891, sizes: [0.566, 1.225, 0.566, 1.225] }, { elemId: 311884, glassId: 311891, sizes: [0.64, 1.319, 0.64, 1.319] }],
                        [{ openDir: [1, 2], sizes: [637, 1295.5, 637, 1295.5], type: 6 }]],

                    },


                    setDefaultGlobal: setDefaultGlobal
                };
                thisFactory.publicObj.global = setDefaultGlobal();
                return thisFactory.publicObj;

            });
})();
