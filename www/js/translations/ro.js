
// translations/ro.js

(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('romanianDictionary', {

      common_words: {
        CHANGE: 'modifică',
        MONTHS: 'Ianuarie, Februarie, Martie, Aprilie, Mai, Iunie, Iulie, August, Septembrie, Octombrie, Novembie, Decembrie',
        MONTHS_SHOT: 'Ian, Feb, Mart, Apr, Mai, Iun, Iul, Aug, Sept, Oct, Nov, Dec',
        MONTHA: 'Ianuarie, Februarie, Martie, Aprilie, Mai, Iunie, Iulie, August, Septembrie, Octombrie, Novembie, Decembrie',
        MONTH_LABEL: 'lună',
        MONTHA_LABEL: 'lunii',
        MONTHS_LABEL: 'luni',
        ALL: 'toate',
        MIN: 'minimum',
        MAX: 'maximum',
        //----- confirm dialogs
        BUTTON_Y: 'Da',
        BUTTON_N: 'Nu',
        DELETE_PRODUCT_TITLE: 'STERGE!',
        DELETE_PRODUCT_TXT: 'Doriți să eliminați produsul?',
        DELETE_ORDER_TITLE: 'Sterge comanda!',
        DELETE_ORDER_TXT: 'Doriți să anulați comanda?',
        COPY_ORDER_TITLE: 'Copierea!',
        COPY_ORDER_TXT: 'Doriți să facă o copie la comandă?',
        SEND_ORDER_TITLE: 'în producție!',
        SEND_ORDER_TXT: 'Doriți să trimiteți comanda la uzină?',
        NEW_TEMPLATE_TITLE: 'Template changing',
        TEMPLATE_CHANGES_LOST: 'The template changes will lost! Continue?',
        SELECT: 'Select'
      },
      login: {
        ENTER: 'autentificare',
        PASS_CODE: 'Spune-i managerului acest cod.',
        YOUR_CODE: 'codul dvs: ',
        EMPTY_FIELD: 'Completați acest câmp.',
        WRONG_NUMBER: 'numar incorrect.',
        SHORT_NAME: 'Too short name',
        SHORT_PASSWORD: 'parola e prea mica.',
        SHORT_PHONE: 'Too little phone number.',
        IMPORT_DB_START: 'Подождите, началась загрузка базы данных',
        IMPORT_DB_FINISH: 'Спасибо, загрузка завершена',
        MOBILE: 'telefon mobil',
        PASSWORD: 'Parola',
        REGISTRATION: 'înregistrare',
        SELECT_COUNTRY: 'Select country',
        SELECT_REGION: 'Select region',
        SELECT_CITY: 'Select city',
        USER_EXIST: 'Sorry, but this user already exists! Please, try again.',
        USER_NOT_EXIST: 'Sorry, but this user not exists! Registrate please.',
        USER_NOT_ACTIVE: 'Sorry, but your profile is not active. Please check your email.',
        USER_CHECK_EMAIL: 'The confirmed email was send to you. Please check your email.',
        SELECT_PRODUCER: 'Choose the producer',
        SELECT_FACTORY: 'Please select the producer',
        USER_PASSWORD_ERROR: 'Sorry, but your password is wrong!'
      },
      mainpage: {
        MM: ' mm ',
        CLIMATE_ZONE: 'zona climatica ',
        THERMAL_RESISTANCE: 'rezistență termică',
        AIR_CIRCULATION: 'coeficientul circulatiei aerului',
        ROOM_KITCHEN: 'bucătărie',
        ROOM_LIVINGROOM: 'Sufragerie',
        ROOM_BALCONY: 'balcon',
        ROOM_CHILDROOM: 'Детская',
        ROOM_BEDROOM: 'dormitor',
        ROOM_DOOR: 'Intrare',
        NAVMENU_GEOLOCATION: 'Selectați locația',
        NAVMENU_CURRENT_GEOLOCATION: 'Locul de amplasare actual',
        NAVMENU_CURRENT_CALCULATION: 'calcul actual',
        NAVMENU_CART: 'cosul de cumparaturi',
        NAVMENU_ADD_ELEMENTS: 'elemente suplimentare',
        NAVMENU_ALL_CALCULATIONS: 'Toate calculele',
        NAVMENU_SETTINGS: 'Setări',
        NAVMENU_MORE_INFO: 'Mai multe informații',
        NAVMENU_VOICE_HELPER: 'Asistent vocală',
        NAVMENU_CALCULATIONS: 'calcule',
        NAVMENU_APPENDIX: 'Propunere',
        NAVMENU_NEW_CALC: '+ Calcul Nou',
        CONFIGMENU_CONFIGURATION: 'Configurația și dimensiunile',
        CONFIGMENU_SIZING: 'Lățime * Înălțime',
        CONFIGMENU_PROFILE: 'profil',
        CONFIGMENU_GLASS: 'geam termopan',
        CONFIGMENU_HARDWARE: 'furnitura ',
        CONFIGMENU_LAMINATION: 'laminare',
        CONFIGMENU_LAMINATION_TYPE: 'fațadă / camera',
        CONFIGMENU_NOT_LAMINATION: 'withuot lamination',
        CONFIGMENU_ADDITIONAL: 'Suplimentar',
        CONFIGMENU_IN_CART: 'Adaugă in coș',
        VOICE_SPEACH: 'Vorbiți...',
        COMMENT: 'Оставьте свою заметку о заказе здесь.',
        ROOM_SELECTION: 'Interior selection'
      },
      panels: {
        TEMPLATE_WINDOW: 'Fereastră',
        TEMPLATE_BALCONY: 'Balcon',
        TEMPLATE_DOOR: 'Ușă',
        TEMPLATE_BALCONY_ENTER: 'Ieșire la balcon',
        TEMPLATE_EDIT: 'Editare',
        TEMPLATE_DEFAULT: 'Proiect Standard',
        COUNTRY: 'țara',
        BRAND: 'marcă comercială',
        HEAT_INSULATION: 'izolație termică',
        NOICE_INSULATION: 'izolare fonica',
        LAMINAT_INSIDE: 'Ламинация рамы в комнате',
        LAMINAT_OUTSIDE: 'Laminare din față',
        LAMINAT_WHITE: 'Fără laminare, de culoare albă radical'
      },
      add_elements: {
        CHOOSE: 'Alege',
        ADD: 'Adauga',

        GRID: 'plasă contra țânțarilor',
        VISOR: 'parasolară',
        SPILLWAY: 'scurgere',
        OUTSIDE: 'наружные откосы',
        LOUVERS: 'jaluzele',
        INSIDE: 'внутренние откосы',
        CONNECTORS: 'conector',
        FAN: 'micro ventilare',
        WINDOWSILL: 'pervaz',
        HANDLEL: 'mâner',
        OTHERS: 'altele',
        GRIDS: 'plase de țânțari',
        VISORS: 'viziere',
        SPILLWAYS: 'scurgeri',
        WINDOWSILLS: 'Pervaze',
        HANDLELS: 'manere',
        NAME_LABEL: 'наименование',
        QTY_LABEL: 'Bucăți',
        SIZE_LABEL: 'dimensiune',
        WIDTH_LABEL: 'lățime',
        HEIGHT_LABEL: 'înălțime',
        COLOR_LABEL: 'culoare',
        OTHER_ELEMENTS1: 'încă',
        OTHER_ELEMENTS2: 'componenta...',
        SCHEME_VIEW: 'schematic',
        LIST_VIEW: 'Lista',
        INPUT_ADD_ELEMENT: 'Adaugă Componenta',
        CANCEL: 'anulare',
        TOTAL_PRICE_TXT: 'Total componente suplimentare în valoare de',
        ELEMENTS: 'componente',
        ELEMENT: 'component',
        ELEMENTA: 'componenta'
      },
      add_elements_menu: {
        TIP: 'Selectați un element din listă',
        EMPTY_ELEMENT: 'fără elementul',
        COLOR_AVAILABLE: 'culori disponibile:',
        TAB_NAME_SIMPLE_FRAME: 'construcție simplă',
        TAB_NAME_HARD_FRAME: 'construcție component',
        TAB_EMPTY_EXPLAIN: 'Vă rugăm să selectați primul element,pentru a porni construcția.'
      },
      construction: {
        SASH_SHAPE: 'cercevea',
        ANGEL_SHAPE: 'unghiuri',
        IMPOST_SHAPE: 'impost',
        ARCH_SHAPE: 'arcuri',
        POSITION_SHAPE: 'poziția',
        UNITS_DESCRIP: 'Unitățile de măsură sunt în mm',
        PROJECT_DEFAULT: 'Proiect Standard',
        DOOR_CONFIG_LABEL: 'configurația uși',
        DOOR_CONFIG_DESCTIPT: 'cadru de ușă',
        SASH_CONFIG_DESCTIPT: 'створка двери',
        HANDLE_CONFIG_DESCTIPT: 'mâner',
        LOCK_CONFIG_DESCTIPT: 'blocare a ușii',
        STEP: 'pas',
        LABEL_DOOR_TYPE: 'Selectaţi un toc de proiectare a ușii',
        LABEL_SASH_TYPE: 'Selectați tipul de cercevea la ușă',
        LABEL_HANDLE_TYPE: 'Selectați tipul de mâner',
        LABEL_LOCK_TYPE: 'Selectați tipul de blocare',
        VOICE_SWITCH_ON: "Modul Voce este activat",
        VOICE_NOT_UNDERSTAND: 'nu este clar',
        VOICE_SMALLEST_SIZE: 'prea mic',
        VOICE_BIGGEST_SIZE: "prea mare",
        VOICE_SMALL_GLASS_BLOCK: "слишком маленький световой проем"
      },
      history: {
        SEARCH_PLACEHOLDER: 'Căutare după cuvinte cheie',
        DRAFT_VIEW: 'Черновики расчетов',
        HISTORY_VIEW: 'istoria calculelor',
        PHONE: 'telefon',
        CLIENT: 'client',
        ADDRESS: 'adresa',
        FROM: 'de la ',
        UNTIL: 'pînă la ',
        PAYMENTS: 'achitare prin',
        ALLPRODUCTS: 'Construcți',
        ON: 'pe',
        DRAFT: 'Черновик',
        DATE_RANGE: 'intervalul de date',
        ALL_TIME: 'Pentru tot timpul',
        SORTING: 'Sortarea',
        NEWEST_FIRST: 'după timp:cele noi primele',
        NEWEST_LAST: 'după timp:cele noi la urmă',
        SORT_BY_TYPE: 'După tipul',
        SORT_SHOW: 'Arată',
        SORT_SHOW_ACTIVE: 'Doar activi',
        SORT_SHOW_WAIT: 'Numai în așteptarea',
        SORT_SHOW_DONE: 'Только завершенные',
        BY_YOUR_REQUEST: 'Potrivit cererea dvs.',
        NOT_FIND: 'nimic nu a fost găsit',
        WAIT_MASTER: 'aşteaptă inginerul'
      },
      cart: {
        ALL_ADD_ELEMENTS: 'toate elemente suplimentare a comenzii',
        ADD_ORDER: 'adaugă produsul',
        PRODUCT_QTY: 'numărul de produse',
        LIGHT_VIEW: 'Vizualizare scurtă',
        FULL_VIEW: 'Vizualizare completă',
        DELIVERY: 'livrare',
        SELF_EXPORT: 'Fara livrare',
        FLOOR: 'etajul',
        ASSEMBLING: 'instalare',
        WITHOUT_ASSEMBLING: 'fără montare',
        FREE: 'gratuit',
        PAYMENT_BY_INSTALMENTS: 'Plata în rate',
        WITHOUT_INSTALMENTS: 'fără rate',
        DELIVERY_DATE: 'data de livrare',
        TOTAL_PRICE_LABEL: 'în total la livrare ',
        MONTHLY_PAYMENT_LABEL: 'plata lunara cîte',
        DATE_DELIVERY_LABEL: 'La livrare',
        FIRST_PAYMENT_LABEL: 'prima achitare',
        ORDER: 'a comanda',
        MEASURE: 'Măsura',
        READY: 'Gata',
        CALL_MASTER: 'chemarea inginerului pentru calcul',
        CALL_MASTER_DESCRIP: 'Pentru a solicita inginerul, avem nevoie de ceva informatie despre dvs. Ambele campurile sunt obligatorii.',
        CLIENT_LOCATION: 'locație',
        CLIENT_ADDRESS: 'adresa',
        CALL_ORDER: 'Оформление заказа для рассчета',
        CALL_ORDER_DESCRIP: 'Pentru a îndeplini comanda,este necesar informatie despre dvs.',
        CALL_ORDER_CLIENT_INFO: 'Informații client (câmpuri obligatorii):',
        CLIENT_NAME: 'numele prenumele patronimicul',
        CALL_ORDER_DELIVERY: 'livrarea comenzi pe',
        CALL_ORDER_TOTAL_PRICE: 'Total',
        CALL_ORDER_ADD_INFO: 'suplimentar (completarea la dorinţă):',
        CLIENT_EMAIL: 'poșta electronică',
        ADD_PHONE: 'telefon suplimentar',
        CALL_CREDIT: 'Efectuarea rate și calculul comenzi',
        CALL_CREDIT_DESCRIP: 'Для того, чтобы оформить рассрочку и выполнить заказ, мы должны кое-что о вас знать.',
        CALL_CREDIT_CLIENT_INFO: 'Plata în rate:',
        CREDIT_TARGET: 'Цель оформления рассрочки',
        CLIENT_ITN: 'Индивидуальный налоговый номер',
        CALL_START_TIME: 'sunați de la:',
        CALL_END_TIME: 'pînă la :',
        CALL_CREDIT_PARTIAL_PRICE: 'pe ',
        ADDELEMENTS_EDIT_LIST: 'redactarea listei',
        ADDELEMENTS_PRODUCT_COST: 'într-o construcţie',
        HEAT_TRANSFER: 'transferul de căldură',
        WRONG_EMAIL: 'poșta electronica este incorectă',
        LINK_BETWEEN_COUPLE: 'между парой',
        LINK_BETWEEN_ALL: 'между всеми',
        LINK_DELETE_ALL_GROUPE: 'удалить все',
        CLIENT_SEX: 'Sex',
        CLIENT_SEX_M: 'M',
        CLIENT_SEX_F: 'F',
        CLIENT_AGE: 'Age',
        CLIENT_AGE_OLDER: 'older',
        CLIENT_EDUCATION: 'Education',
        CLIENT_EDUC_MIDLE: 'middle',
        CLIENT_EDUC_SPEC: 'specific middle',
        CLIENT_EDUC_HIGH: 'high',
        CLIENT_OCCUPATION: 'Occupation',
        CLIENT_OCCUP_WORKER: 'Employee',
        CLIENT_OCCUP_HOUSE: 'Householder',
        CLIENT_OCCUP_BOSS: 'Employer',
        CLIENT_OCCUP_STUD: 'Student',
        CLIENT_OCCUP_PENSION: 'pensioner',
        CLIENT_INFO_SOURCE: 'Information source',
        CLIENT_INFO_PRESS: 'Press',
        CLIENT_INFO_FRIEND: 'From friends',
        CLIENT_INFO_ADV: 'Visual advertising',
        SELECT_AGE: 'Select your age',
        SELECT_ADUCATION: 'Select your aducation',
        SELECT_OCCUPATION: 'Select your occupation',
        SELECT_INFO_SOURCE: 'Select source'
      },
      settings: {
        AUTHORIZATION: 'Autentificare:',
        CHANGE_PASSWORD: 'schimbați parola',
        CHANGE_LANGUAGE: 'Change language',
        PRIVATE_INFO: 'Informații personale:',
        USER_NAME: 'persoana de contact',
        CITY: 'oraș',
        ADD_PHONES: 'telefon suplimentar:',
        INSERT_PHONE: 'adaugați  nr de telefon',
        CLIENT_SUPPORT: 'suport clienți',
        LOGOUT: 'Ieșirea din aplicația',
        SAVE: 'Salvați',
        CURRENT_PASSWORD: 'Current',
        NEW_PASSWORD: 'nou',
        CONFIRM_PASSWORD: 'Confirmare',
        NO_CONFIRM_PASS: 'parolă incorectă'
      }

    });

})();
