(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('englishDictionary', {

      common_words: {
        CHANGE: 'Change',
        MONTHS: 'January, February, March, April, May, June, July, August, September, October, November, December',
        MONTHS_SHOT: 'Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sept, Oct, Nov, Dec',
        MONTHA: 'January, February, March, April, May, June, July, August, September, October, November, December',
        MONTH_LABEL: 'month',
        MONTHA_LABEL: 'months',
        MONTHS_LABEL: 'months',
        ALL: 'All',
        MIN: 'min.',
        MAX: 'max.',
        //----- confirm dialogs
        BUTTON_Y: 'YES',
        BUTTON_N: 'NO',
        DELETE_PRODUCT_TITLE: 'Delete!',
        DELETE_PRODUCT_TXT: 'Do you want to delete a product?',
        DELETE_ORDER_TITLE: 'Delete of order!',
        DELETE_ORDER_TXT: 'Do you want to delete an order?',
        COPY_ORDER_TITLE: 'Printing-down!',
        COPY_ORDER_TXT: 'Do you want to do the copy of order?',
        SEND_ORDER_TITLE: 'In a production!',
        SEND_ORDER_TXT: 'Do you want to send an order on a factory?',
        NEW_TEMPLATE_TITLE: 'Template changing',
        TEMPLATE_CHANGES_LOST: 'The template changes will lost! Continue?',
        PAGE_REFRESH: 'Reloading the page will lead to data loss!',
        SELECT: 'Select',
        AND: 'and',
        OK: 'OK',
        BACK: 'Back',
        LETTER_M: 'm'
      },
      login: {
        ENTER: 'To enter',
        PASS_CODE: 'You will reveal to this code the manager.',
        YOUR_CODE: 'Your code: ',
        EMPTY_FIELD: 'You should to fill this field.',
        WRONG_NUMBER: 'Incorrect number.',
        SHORT_NAME: 'Too short name',
        SHORT_PASSWORD: 'Too little password.',
        SHORT_PHONE: 'Too little phone number.',
        IMPORT_DB_START: 'Wait, began loading the database',
        IMPORT_DB_FINISH: 'Thank you for the download is complete',
        MOBILE: 'Mobile telephone',
        PASSWORD: 'Password',
        REGISTRATION: 'Registration',
        SELECT_COUNTRY: 'Select country',
        SELECT_REGION: 'Select region',
        SELECT_CITY: 'Select city',
        USER_EXIST: 'Sorry, but this user already exists! Please, try again.',
        USER_NOT_EXIST: 'Sorry, but this user not exists! Registrate please.',
        USER_NOT_ACTIVE: 'Sorry, but your profile is not active. Please check your email.',
        USER_CHECK_EMAIL: 'The confirmed email was send to you. Please check your email.',
        SELECT_PRODUCER: 'Choose the producer',
        SELECT_FACTORY: 'Please select the producer',
        USER_PASSWORD_ERROR: 'Sorry, but your password is wrong!',
        OFFLINE: 'No internet connection!',
        IMPORT_DB: 'DataBase Import was started! Waite please!'
      },
      mainpage: {
        MM: ' mm ',
        CLIMATE_ZONE: 'climatic area',
        THERMAL_RESISTANCE: 'heat transfer',
        AIR_CIRCULATION: 'coefficient of ventilation',
        NAVMENU_GEOLOCATION: 'To choose a location',
        NAVMENU_CURRENT_GEOLOCATION: 'Current location',
        NAVMENU_CURRENT_CALCULATION: 'Current calculation',
        NAVMENU_CART: 'Basket of calculation',
        NAVMENU_ADD_ELEMENTS: 'Add. elements',
        NAVMENU_ALL_CALCULATIONS: 'Order history',
        NAVMENU_SETTINGS: 'Settings',
        NAVMENU_MORE_INFO: 'More information',
        NAVMENU_VOICE_HELPER: 'Voice control',
        NAVMENU_CALCULATIONS: 'Calculations',
        NAVMENU_APPENDIX: 'Appendix',
        NAVMENU_NEW_CALC: '+New calculation',
        CONFIGMENU_CONFIGURATION: 'Configuration and sizes',
        CONFIGMENU_SIZING: 'width * height',
        CONFIGMENU_PROFILE: 'Profile',
        CONFIGMENU_GLASS: 'Glazing',
        CONFIGMENU_HARDWARE: 'accessories',
        CONFIGMENU_LAMINATION: 'Lamination',
        CONFIGMENU_LAMINATION_TYPE: 'room / Facade',
        WHITE_LAMINATION: 'White',
        CONFIGMENU_ADDITIONAL: 'Additionally',
        CONFIGMENU_IN_CART: 'In a basket',
        VOICE_SPEACH: 'You talk...',
        COMMENT: 'Leave a note on the order here.',
        ROOM_SELECTION: 'Template selection',
        CONFIGMENU_NO_ADDELEMENTS: 'Add Elements are not choosen',
        HEATCOEF_VAL: 'W',
        TEMPLATE_TIP: 'To change the size, click here',
        PROFILE_TIP: 'To select a profile, click here',
        GLASS_TIP: 'To select a double-glazed window, click here'//,
        //SELECT_ALL: 'Take all',
        //SELECT_GLASS_WARN: 'Click on the glazing, you want to change'
      },
      panels: {
        TEMPLATE_WINDOW: 'Window',
        TEMPLATE_BALCONY: 'Balcony',
        TEMPLATE_DOOR: 'Door',
        TEMPLATE_BALCONY_ENTER: 'Exit to a balcony',
        TEMPLATE_EDIT: 'edit',
        TEMPLATE_DEFAULT: 'Project by default',
        COUNTRY: 'country',
        BRAND: 'trademark',
        HEAT_INSULATION: 'thermal insulation',
        NOICE_INSULATION: 'noise isolation',
        CORROSION_COEFF: 'Anticorrosion',
        BURGLAR_COEFF: 'Burglar',
        LAMINAT_INSIDE: 'In room',
        LAMINAT_OUTSIDE: 'Facade',
        ONE_WINDOW_TYPE: 'One-casement',
        TWO_WINDOW_TYPE: 'Two-casement',
        THREE_WINDOW_TYPE: 'Three-leaf',
        CAMERa: 'cameras',
        CAMER: 'cameras',
        CAMERs: 'cameras',
        ENERGY_SAVE: '+energy saving',
        DOOR_TYPE1: 'on perimeter',
        DOOR_TYPE2: 'without threshold',
        DOOR_TYPE3: 'aluminum threshold, type',
        SASH_TYPE1: 'the interroom',
        SASH_TYPE2: 'the door T-shaped',
        SASH_TYPE3: 'the window',
        HANDLE_TYPE1: 'press set',
        HANDLE_TYPE2: 'standard office handle',
        LOCK_TYPE1: 'one-locking with a latch',
        LOCK_TYPE2: 'multilocking with a latch',
        EXTRA_GLASS1: "Нет возможности установки стеклопакета ",
        EXTRA_GLASS2: " для данной конфигурации конструкции"
      },
      add_elements: {
        CHOOSE: 'select',
        ADD: 'add',
        GRID: 'mosquito grid',
        VISOR: 'peak',
        SPILLWAY: 'water outflow',
        OUTSIDE: 'external slopes',
        LOUVERS: 'blinds',
        INSIDE: 'internal slopes',
        CONNECTORS: 'connector',
        FAN: 'microairing',
        WINDOWSILL: 'windowsill',
        HANDLEL: 'handle',
        OTHERS: 'other',
        GRIDS: 'mosquito grids',
        VISORS: 'peaks',
        SPILLWAYS: 'Drainages',
        WINDOWSILLS: 'sills',
        HANDLELS: 'handle',
        NAME_LABEL: 'name',
        ARTICUL_LABEL: 'reference',
        QTY_LABEL: 'pcs.',
        SIZE_LABEL: 'size',
        WIDTH_LABEL: 'width',
        HEIGHT_LABEL: 'height',
        OTHER_ELEMENTS1: 'Yet',
        OTHER_ELEMENTS2: 'component...',
        SCHEME_VIEW: 'Schematically',
        LIST_VIEW: 'List',
        INPUT_ADD_ELEMENT: 'Add Component',
        CANCEL: 'cancel',
        TOTAL_PRICE_TXT: 'Total additional components in the amount of:',
        ELEMENTS: 'components',
        ELEMENT: 'component',
        ELEMENTA: 'component'
      },
      add_elements_menu: {
        TIP: 'Select an item from the list',
        EMPTY_ELEMENT: 'Without the element',
        TAB_NAME_SIMPLE_FRAME: 'Simple design',
        TAB_NAME_HARD_FRAME: 'Composite structure',
        TAB_EMPTY_EXPLAIN: 'Please select the first item to start up construction.'
      },
      design: {
        SASH_SHAPE: 'shutters',
        ANGEL_SHAPE: 'corners',
        IMPOST_SHAPE: 'imposts',
        ARCH_SHAPE: 'arches',
        POSITION_SHAPE: 'position',
        UNITS_DESCRIP: 'All Units are in mm',
        PROJECT_DEFAULT: 'Default project',
        DOOR_CONFIG_LABEL: 'configuration of doors',
        DOOR_CONFIG_DESCTIPT: 'door frame',
        SASH_CONFIG_DESCTIPT: 'door leaf',
        HANDLE_CONFIG_DESCTIPT: 'handle',
        LOCK_CONFIG_DESCTIPT: 'lock',
        STEP: 'step',
        LABEL_DOOR_TYPE: 'Select a design door frame',
        LABEL_SASH_TYPE: 'Select the type of door leaf',
        LABEL_HANDLE_TYPE: 'Select the type of handle',
        LABEL_LOCK_TYPE: 'Select the type of lock',
        VOICE_SWITCH_ON: "The voice helper is switched on",
        VOICE_NOT_UNDERSTAND: 'It is not clear',
        VOICE_SMALLEST_SIZE: 'The smallest size',
        VOICE_BIGGEST_SIZE: "The biggest size",
        VOICE_SMALL_GLASS_BLOCK: "too small skylights",
        SQUARE_EXTRA: "Площадь конструкции превышает допустимую",
        DIM_EXTRA: "Габаритный размер конструкции превышает допустимый",
        NOT_AVAILABLE: 'Not Available!',
        TEST_STAGE: "Находится в стадии тестирования",
        GLASS: "Стеклопакет",
        GLASS_SIZE: "размером",
        NO_MATCH_RANGE: "не соответствует допустимому диапазону",
        GLASS_SQUARE: "с площадью",
        MAX_VALUE_HIGHER: "перевышает допустимое максимальное значение",
        EXTRA_SASH: "Текущий размер створки по фальцу",
        CHANGE_SIZE: "Для сохранения конструкции измените размеры."
      },
      history: {
        SEARCH_PLACEHOLDER: 'Search by keyword',
        DRAFT_VIEW: 'Drafts calculations',
        HISTORY_VIEW: 'History of settlements',
        PHONE: 'phone',
        CLIENT: 'client',
        ADDRESS: 'address',
        FROM: 'from ',
        UNTIL: 'to ',
        PAYMENTS: 'payments',
        ALLPRODUCTS: 'products',
        ON: 'on',
        DRAFT: 'Draft',
        DATE_RANGE: 'Date Range',
        ALL_TIME: 'For all time',
        SORTING: 'Sorting',
        NEWEST_FIRST: 'By the time: new first',
        NEWEST_LAST: 'By the time new at the end of',
        SORT_BY_TYPE: 'By type',
        SORT_SHOW: 'Show',
        SORT_SHOW_ACTIVE: 'Only active',
        SORT_SHOW_WAIT: 'Only pending',
        SORT_SHOW_DONE: 'Only completed',
        BY_YOUR_REQUEST: 'According to your request',
        NOT_FIND: 'nothing found',
        WAIT_MASTER: 'expects gager',
        INCLUDED: 'included',
        NO_PRINT: "Вывод спецификации невозможен ввиду отсутствия интернет-соединения"
      },
      cart: {
        ALL_ADD_ELEMENTS: 'All additional elements order',
        ADD_ORDER: 'Add the product',
        PRODUCT_QTY: 'number of products',
        LIGHT_VIEW: 'Short view',
        FULL_VIEW: 'Full view',
        DELIVERY: 'Delivery',
        SELF_EXPORT: 'Pickup',
        FLOOR: 'floor',
        ASSEMBLING: 'mounting',
        WITHOUT_ASSEMBLING: 'without mounting',
        FREE: 'free',
        PAYMENT_BY_INSTALMENTS: 'Payment by installments',
        WITHOUT_INSTALMENTS: 'free installments',
        DELIVERY_DATE: 'Delivery date',
        TOTAL_PRICE_LABEL: 'Total Delivered on',
        MONTHLY_PAYMENT_LABEL: 'monthly payments on',
        DATE_DELIVERY_LABEL: 'Delivered on',
        FIRST_PAYMENT_LABEL: 'The first payment',
        ORDER: 'To order',
        MEASURE: 'Measure',
        READY: 'Ready',
        CALL_MASTER: 'Call gager to calculate',
        CALL_MASTER_DESCRIP: 'To call gager we need something for you to know. Both fields are required.',
        CLIENT_LOCATION: 'Location',
        CLIENT_ADDRESS: 'address',
        CLIENT_HOUSE: "Буд",
        CLIENT_FLAT: "Кв",
        CLIENT_FLOOR: "Пов",
        CALL_ORDER: 'Ordering for calculating',
        CALL_ORDER_DESCRIP: 'In order to fulfill the order, we need to something about you know.',
        CALL_ORDER_CLIENT_INFO: 'Customer Information (must be filled):',
        CLIENT_NAME: 'Full Name',
        CALL_ORDER_DELIVERY: 'Deliver an order for',
        CALL_ORDER_TOTAL_PRICE: 'in all',
        CALL_ORDER_ADD_INFO: 'Extras (Optional):',
        CLIENT_EMAIL: 'Email',
        ADD_PHONE: 'Additional phone',
        CALL_CREDIT: 'Making installment and order to calculate',
        CALL_CREDIT_DESCRIP: 'To arrange installments and fulfill the order, we have something for you to know.',
        CALL_CREDIT_CLIENT_INFO: 'Installment:',
        CREDIT_TARGET: 'The purpose of registration of installments',
        CLIENT_ITN: 'Individual Tax Number',
        CALL_START_TIME: 'Call from:',
        CALL_END_TIME: 'prior to:',
        CALL_CREDIT_PARTIAL_PRICE: 'on',
        ADDELEMENTS_EDIT_LIST: 'Edit List ...',
        ADDELEMENTS_PRODUCT_COST: 'one product',
        HEAT_TRANSFER: 'heat transfer',
        WRONG_EMAIL: 'Incorrect e-mail',
        LINK_BETWEEN_COUPLE: 'between couple',
        LINK_BETWEEN_ALL: 'between all',
//        LINK_DELETE_ALL_GROUPE: 'delete all',
        CLIENT_SEX: 'Sex',
        CLIENT_SEX_M: 'm',
        CLIENT_SEX_F: 'F',
        CLIENT_AGE: 'Age',
        CLIENT_AGE_OLDER: 'older',
        //CLIENT_EDUCATION: 'Education',
        //CLIENT_EDUC_MIDLE: 'middle',
        //CLIENT_EDUC_SPEC: 'specific middle',
        //CLIENT_EDUC_HIGH: 'high',
        CLIENT_EDUCATION: 'The main criterion of your choice',
        CLIENT_EDUC_MIDLE: 'Good price',
        CLIENT_EDUC_SPEC: 'image maker',
        CLIENT_EDUC_HIGH: 'brand profile and hardware',
        CLIENT_EDUC_4: 'Recommendations seller',
        CLIENT_OCCUPATION: 'Occupation',
        CLIENT_OCCUP_WORKER: 'Employee',
        CLIENT_OCCUP_HOUSE: 'Householder',
        CLIENT_OCCUP_BOSS: 'Employer',
        CLIENT_OCCUP_STUD: 'Student',
        CLIENT_OCCUP_PENSION: 'Pensioner',
        CLIENT_INFO_SOURCE: 'Information source',
        CLIENT_INFO_PRESS: 'Press',
        CLIENT_INFO_FRIEND: 'From friends',
        CLIENT_INFO_ADV: 'Visual advertising',
        SELECT_PLACEHOLD: 'select your option',
        //SELECT_AGE: 'Select your age',
        //SELECT_ADUCATION: 'Select your aducation',
        //SELECT_OCCUPATION: 'Select your occupation',
        //SELECT_INFO_SOURCE: 'Select source',
        NO_DISASSEMBL: 'without dismantle',
        STANDART_ASSEMBL: 'the standard',
        VIP_ASSEMBL: 'VIP-installation',
        DISCOUNT: 'Discount',
        DISCOUNT_SELECT: 'The choice of discounts',
        DISCOUNT_WITH: 'In view of the discounts',
        DISCOUNT_WITHOUT: 'Excluding discounts',
        DISCOUNT_WINDOW: 'Discount on a product',
        DISCOUNT_ADDELEM: 'Discount on additional elements',
        ORDER_COMMENT: 'Order note',
        UNKNOWN: 'Unknown'
      },
      settings: {
        AUTHORIZATION: 'Authorization:',
        CHANGE_PASSWORD: 'Change password',
        CHANGE_LANGUAGE: 'Change language',
        PRIVATE_INFO: 'Personal information:',
        USER_NAME: 'Contact person',
        CITY: 'City',
        ADD_PHONES: 'Additional phones:',
        INSERT_PHONE: 'Add a phone',
        CLIENT_SUPPORT: 'Customer Support',
        LOGOUT: 'Exit the application',
        SAVE: 'Save',
        CURRENT_PASSWORD: 'The Current',
        NEW_PASSWORD: 'New',
        CONFIRM_PASSWORD: 'Confirm',
        NO_CONFIRM_PASS: 'Invalid password'
      }

    });

})();