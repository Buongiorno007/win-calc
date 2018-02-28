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
            SelectedName : "",
            MobileTabActive : 0,
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
            TEMP_HARDWARES : []
          },

          setDefaultGlobal: setDefaultGlobal
        };
        thisFactory.publicObj.global = setDefaultGlobal();
        return thisFactory.publicObj;

      });
})();
