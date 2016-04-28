(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('romanianDictionary', {

      common_words: {
        CHANGE: 'Modifică',
        MONTHS: 'Ianuarie, Februarie, Martie, Aprilie, Mai, Iunie, Iulie, August, Septembrie, Octombrie, Decembrie',
        MONTHS_SHOT: 'Ian, Feb, Mart, Apr, Mai, Iun, Iul, Aug, Sept, Oct, Nov, Dec',
        MONTHA: 'Ianuarie, Februarie, Martie, Aprilie, Mai, Iunie, Iulie, August, Septembrie, Octombrie, Decembrie',
        MONTH_LABEL: 'luna',
        MONTHA_LABEL: 'luna',
        MONTHS_LABEL: 'luni',
        ALL: 'Toate',
        MIN: 'min.',
        MAX: 'max.',
        //----- confirm dialogs
        BUTTON_Y: 'DA',
        BUTTON_N: 'NU',

        ﻿EDIT_COPY_TXT: 'Ce trebuie sa fac?',
        BUTTON_C: 'Copie',
        BUTTON_E: 'Edita',
        SPACE: '           ',

        DELETE_PRODUCT_TITLE: 'Ștergere!',
        DELETE_PRODUCT_TXT: 'Doriți să ștergeți produsul?',
        DELETE_ORDER_TITLE: 'Ștergerea comenzii!',
        DELETE_ORDER_TXT: 'Doriți să ștergeți comanda?',
        COPY_ORDER_TITLE: 'Copiere!',
        COPY_ORDER_TXT: 'Doriți să faceți o copie a comenzii?',
        SEND_ORDER_TITLE: 'În producere!',
        SEND_ORDER_TXT: 'Doriți să trimiteți comanda spre executare?',
        NEW_TEMPLATE_TITLE: 'Modificarea șablonului',
        TEMPLATE_CHANGES_LOST: 'Modificările în șablon nu vor fi salvate! Doriți să  continuați?',
        PAGE_REFRESH: 'Reîncărcarea paginii va duce la pierderea datelor!',
        SELECT: 'Alege',
        AND: 'și',
        OK: 'OK',
        BACK: 'Înapoi',
        LETTER_M: 'm'
      },
      login: {
        ENTER: 'Intră',
        PASS_CODE: 'Comunicați acest cod managerului.',
        YOUR_CODE: 'Codul Dvs.: ',
        EMPTY_FIELD: 'Completați acest câmp.',
        WRONG_LOGIN: 'Pentru numele de utilizator (parolă) folosiți doar cifre, litere latine și simbolurile  "@" , "." , "-" , "_" .',
        //WRONG_NUMBER: 'Număr incorect.',
        SHORT_NAME: 'Nume prea scurt.',
        //SHORT_PASSWORD: 'Parolă prea scurtă.',
        //SHORT_PHONE: 'Număr de telefon prea scurt.',
        IMPORT_DB_START: 'Așteptați, a început încărcarea bazei de date',
        IMPORT_DB_FINISH: 'Vă mulțumim, încărcarea a luat sfârșit',
        LOGIN: 'Nume de utilizator',
        PASSWORD: 'Parolă',
        MOBILE: 'Telefon mobil',
        REGISTRATION: 'Înregistrare',
        SELECT_COUNTRY: 'Selectați țara',
        SELECT_REGION: 'Selectați regiunea',
        SELECT_CITY: 'Selectați orașul',
        USER_EXIST: 'Un astfel de utilizator există deja! Încercați încă o dată.',
        USER_NOT_EXIST: 'Un astfel de utilizator nu există. Înregistrați-vă.',
        USER_NOT_ACTIVE: 'Nu ați activat profilul Dvs. Verificați adresa de e-mail.',
        USER_CHECK_EMAIL: 'Mesajul de confirmare a fost expediat pe adresa Dvs. de e-mail.',
        SELECT_PRODUCER: 'Selectați producătorul',
        SELECT_FACTORY: 'Nu ați selectat producătorul',
        USER_PASSWORD_ERROR: 'Parolă incorectă!',
        OFFLINE: 'Nu există conexiune la Internet!',
        IMPORT_DB: 'A început încărcarea Bazei de date! Vă rugăm să așteptați!'
      },
      mainpage: {
        MM: ' mm ',
        CLIMATE_ZONE: 'zonă climatică',
        THERMAL_RESISTANCE: 'transfer de căldură',
        AIR_CIRCULATION: 'coeficientul schimbului de aer',
        NAVMENU_GEOLOCATION: 'Alege amplasarea',
        NAVMENU_CURRENT_GEOLOCATION: 'Amplasarea curentă',
        NAVMENU_CURRENT_CALCULATION: 'Calcul curent',
        NAVMENU_CART: 'Coșul de calcul',
        NAVMENU_ADD_ELEMENTS: 'Elemente supl.',
        NAVMENU_ALL_CALCULATIONS: 'Istoricul comenzilor',
        NAVMENU_SETTINGS: 'Setări',
        NAVMENU_MORE_INFO: 'Mai multe informații',
        NAVMENU_VOICE_HELPER: 'Comenzi vocale',
        NAVMENU_CALCULATIONS: 'Calcule',
        NAVMENU_APPENDIX: 'Anexă',
        NAVMENU_NEW_CALC: '+Calcul nou',
        CONFIGMENU_CONFIGURATION: 'Configurație și dimensiuni',
        CONFIGMENU_SIZING: 'lățime * înălțime',
        CONFIGMENU_PROFILE: 'Profil',
        CONFIGMENU_GLASS: 'Termopan',
        CONFIGMENU_HARDWARE: 'Furnitură',
        CONFIGMENU_LAMINATION: 'Laminare',
        CONFIGMENU_LAMINATION_TYPE: 'fațadă  în cameră / fațadă',
        WHITE_LAMINATION: 'Albă',
        CONFIGMENU_ADDITIONAL: 'Suplimentar',
        CONFIGMENU_IN_CART: 'În coș',
        VOICE_SPEACH: 'Vorbiți...',
        COMMENT: 'Lăsați mențiunile cu privire la comandă aici.',
        ROOM_SELECTION: 'Selectare șablon',
        CONFIGMENU_NO_ADDELEMENTS: 'Elemente supl. nu au fost alese',
        HEATCOEF_VAL: 'W',
        TEMPLATE_TIP: 'Pentru a modifica dimensiunile apăsați aici',
        PROFILE_TIP: 'Pentru a selecta profilul apăsați aici',
        GLASS_TIP: 'Pentru a selecta termopanul apăsați aici',
        SELECT_ALL: 'Selectează totul',
        SELECT_GLASS_WARN: 'Faceți un clic pe termopanul, pe care doriți să-l modificați.'
      },
      panels: {
        TEMPLATE_WINDOW: 'Fereastră',
        TEMPLATE_BALCONY: 'Balcon',
        TEMPLATE_DOOR: 'Ușă',
        TEMPLATE_BALCONY_ENTER: 'Usa de la balcon',
        TEMPLATE_EDIT: 'Editează',
        TEMPLATE_DEFAULT: 'Proiect implicit',
        COUNTRY: 'țara',
        BRAND: 'marca comercială',
        HEAT_INSULATION: 'izolare termică',
        NOICE_INSULATION: 'izolare fonică',
        CORROSION_COEFF: 'anticoroziune',
        BURGLAR_COEFF: 'antiefracție',
        LAMINAT_INSIDE: 'în cameră',
        LAMINAT_OUTSIDE: 'fațadă',
        ONE_WINDOW_TYPE: 'Cu un canat',
        TWO_WINDOW_TYPE: 'Cu două canaturi',
        THREE_WINDOW_TYPE: 'Cu trei canaturi',
        CAMERa: 'cameră',
        CAMER: 'camere',
        CAMERs: 'camere',
        ENERGY_SAVE: '+economisire de energie',
        DOOR_TYPE1: 'pe perimetru',
        DOOR_TYPE2: 'fără prag',
        DOOR_TYPE3: 'prag din aluminiu, tip1',
        DOOR_TYPE4: 'prag din aluminiu, tip2',
        HANDLE_TYPE1: 'garnitură de mâner',
        HANDLE_TYPE2: 'mâner standard de birou',
        LOCK_TYPE1: 'unisafe cu dispozitiv de blocare',
        LOCK_TYPE2: 'multisafe cu dispozitiv de blocare',
        EXTRA_GLASS1: "Nu exisă posibilitate de montare a termopanului ",
        EXTRA_GLASS2: "pentru o astfel de construcție"
      },
      add_elements: {
        CHOOSE: 'Selectează',
        ADD: 'Adaugă',
        GRID: 'plasă de protecție împotriva țânțarilor',
        VISOR: 'glafuri exterioare',
        SPILLWAY: 'glafuri exterioare',
        OUTSIDE: 'cadre exterioare',
        LOUVERS: 'jaluzele',
        INSIDE: 'cadre interioare',
        CONNECTORS: 'conector',
        FAN: 'micro-aerisire',
        WINDOWSILL: 'pervaz',
        INSIDES:'Interne',
        OUTSIDES:'Exterior',
        COMPONENTS:'Componente',
        SHUTTERS:'obloane',
        BLIND: 'Rulouri exterioare',
        GRATING: 'capacul exterior',
        HANDLEL: 'mâner',
        OTHERS: 'altele',
        GRIDS: 'plase de protecție împotriva țânțarilor',
        VISORS: 'apărători',
        SPILLWAYS: 'glafuri pentru evacuarea apei',
        WINDOWSILLS: 'pervazuri',
        HANDLELS: 'mânere',
        NAME_LABEL: 'denumire',
        ARTICUL_LABEL: 'articol',
        QTY_LABEL: 'buc.',
        SIZE_LABEL: 'dimensiuni',
        WIDTH_LABEL: 'lățime',
        HEIGHT_LABEL: 'înălțime',
        OTHER_ELEMENTS1: 'Mai multe',
        OTHER_ELEMENTS2: 'componentei...',
        SCHEME_VIEW: 'Schematic',
        LIST_VIEW: 'Listă',
        INPUT_ADD_ELEMENT: 'Adaugă component',
        CANCEL: 'Anulare',
        TOTAL_PRICE_TXT: 'Total componenți suplimentari în sumă de:',
        ELEMENTS: 'componente',
        ELEMENT: 'componentă',
        ELEMENTA: 'componentei'
      },
      add_elements_menu: {
        TIP: 'Selectați elementul din listă',
        EMPTY_ELEMENT: 'Fără element',
        TAB_NAME_SIMPLE_FRAME: 'Structură simplă',
        TAB_NAME_HARD_FRAME: 'Structură din materiale compozite',
        TAB_EMPTY_EXPLAIN: 'Selectați din listă primul element, pentru a începe crearea structurii.'
      },
      design: {
        SASH_SHAPE: 'canaturi',
        ANGEL_SHAPE: 'colțuri',
        IMPOST_SHAPE: 'imposte',
        ARCH_SHAPE: 'arce',
        POSITION_SHAPE: 'poziție',
        UNITS_DESCRIP: 'Ca unitate de măsură sunt folosiți milimetrii',
        PROJECT_DEFAULT: 'Proiect implicit',
        DOOR_CONFIG_LABEL: 'configurația ușii',
        DOOR_CONFIG_DESCTIPT: 'cadrul ușii',
        SASH_CONFIG_DESCTIPT: 'canatul ușii',
        HANDLE_CONFIG_DESCTIPT: 'mâner',
        LOCK_CONFIG_DESCTIPT: 'lacăt',
        STEP: 'pas',
        LABEL_DOOR_TYPE: 'Selectați structura cadrului ușii',
        LABEL_SASH_TYPE: 'Selectați tipul canatului ușii',
        LABEL_HANDLE_TYPE: 'Selectați tipul mânerului',
        LABEL_LOCK_TYPE: 'Selectați tipul lacătului',
        VOICE_SWITCH_ON: "regimul vocal este activ",
        VOICE_NOT_UNDERSTAND: 'Nu este clar',
        VOICE_SMALLEST_SIZE: 'dimensiuni prea mici',
        VOICE_BIGGEST_SIZE: "dimensiuni prea mari",
        VOICE_SMALL_GLASS_BLOCK: "golul pentru pătrunderea luminii prea mic",
        SQUARE_EXTRA: "Suprafața construcției depășește valorile admisibile.",
        DIM_EXTRA: "Dimensiunile construcției depășesc valorile admisibile. ",
        NOT_AVAILABLE: 'Nu este disponibil!',
        TEST_STAGE: "Se află la etapa de testare.",
        GLASS: "Termopanul",
        GLASS_SIZE: "cu dimensiunea de",
        NO_MATCH_RANGE: "nu corespunde diapazonului permis",
        BY_WIDTH: "după lățime",
        BY_HEIGHT: "după înălțime",
        GLASS_SQUARE: "cu suprafața de",
        MAX_VALUE_HIGHER: "depășește valorile maxime admisibile",
        EXTRA_SASH: "Dimensiunea curentă a canatului după falț ",
        CHANGE_SIZE: "Pentru salvarea construcției modificați dimensiunile.",
        DOOR_ERROR: "Systems of entrance doors are not configured"
      },
      history: {
        SEARCH_PLACEHOLDER: 'Căutare după cuvinte-cheie',
        DRAFT_VIEW: 'Ciorne cu calcule',
        HISTORY_VIEW: 'Istoricul calculelor',
        PHONE: 'telefon',
        CLIENT: 'client',
        ADDRESS: 'adresă',
        FROM: 'de la',
        UNTIL: 'până la',
        PAYMENTS: 'plăți pentru',
        ALLPRODUCTS: 'articole',
        ON: 'la',
        DRAFT: 'Ciornă',
        DATE_RANGE: 'Diapazon de zile',
        ALL_TIME: 'Pentru toată perioada',
        SORTING: 'Clasificare',
        NEWEST_FIRST: 'După dată: cele mai recente la început',
        NEWEST_LAST: 'După dată: cele mai recente la sfârșit',
        SORT_BY_TYPE: 'După tip',
        SORT_SHOW: 'Afișează',
        SORT_SHOW_ACTIVE: 'Doar cele active',
        SORT_SHOW_WAIT: 'Doar cele în așteptare',
        SORT_SHOW_DONE: 'Doar cele finalizate',
        BY_YOUR_REQUEST: 'Conform solicitării Dvs.',
        NOT_FIND: 'nu au fost găsite rezultate',
        WAIT_MASTER: 'se așteaptă specialistul în măsurări',
        INCLUDED: 'incluse',
        NO_PRINT: "Afișarea specificațiilor nu este posibilă din cauza lipsei conexiunii la Internet."
      },
      cart: {
        ALL_ADD_ELEMENTS: 'Toate elementele supl. ale comenzii',
        ADD_ORDER: 'Adaugă articol',
        PRODUCT_QTY: 'numărul articolelor',
        LIGHT_VIEW: 'Tip abreviat',
        FULL_VIEW: 'Tip complet',
        DELIVERY: 'Livrare',
        SELF_EXPORT: 'transport cu mijloace proprii',
        FLOOR: 'etaj',
        ASSEMBLING: 'Montare',
        WITHOUT_ASSEMBLING: 'fără montare',
        FREE: 'gratuit',
        PAYMENT_BY_INSTALMENTS: 'În rate',
        WITHOUT_INSTALMENTS: 'fără achitare în rate',
        DELIVERY_DATE: 'Data livrării',
        TOTAL_PRICE_LABEL: 'Total livrare la',
        MONTHLY_PAYMENT_LABEL: 'plăți lunare pentru',
        DATE_DELIVERY_LABEL: 'în cazul livrării la',
        FIRST_PAYMENT_LABEL: 'Prima plată',
        ORDER: 'Comandă',
        MEASURE: 'Măsoară',
        READY: 'Finalizat',
        CALL_MASTER: 'Chemarea specialistului în măsurări, pentru calcule',
        CALL_MASTER_DESCRIP: 'Pentru chemarea specialistului în măsurări trebuie să cunoaștem unele detalii. Ambele câmpuri sunt ',
        CLIENT_LOCATION: 'Amplasare',
        CLIENT_ADDRESS: 'Adresa',
        CLIENT_HOUSE: "Casă",
        CLIENT_FLAT: "Ap.",
        CLIENT_FLOOR: "Et.",
        CALL_ORDER: 'Perfectarea comenzii pentru calculare',
        CALL_ORDER_DESCRIP: 'Pentru a executa comanda, trebuie să cunoaștem informații despre Dvs.',
        CALL_ORDER_CLIENT_INFO: 'Informații despre client (a se completa neapărat):',
        CLIENT_NAME: 'Nume Prenume Patronimic',
        CALL_ORDER_DELIVERY: 'Livrare comandă la',
        CALL_ORDER_TOTAL_PRICE: 'Total',
        CALL_ORDER_ADD_INFO: 'Suplimentar:',
        CLIENT_EMAIL_ORDER: 'Электронная почта для получения спецификации',
        CLIENT_EMAIL: 'E-mail',
        ADD_PHONE: 'Număr de telefon suplimentar',
        CALL_CREDIT: 'Achitare în rate și perfectarea comenzii pentru calculare',
        CALL_CREDIT_DESCRIP: 'Pentru a beneficia de achitarea în rate, trebuie să cunoaștem informații despre Dvs.',
        CALL_CREDIT_CLIENT_INFO: 'Achitare în rate:',
        CREDIT_TARGET: 'Scopul achitării în rate',
        CLIENT_ITN: 'Codul fiscal individual',
        CALL_START_TIME: 'Disponibil pentru apeluri:',
        CALL_END_TIME: 'de la:',
        CALL_CREDIT_PARTIAL_PRICE: 'până la',
        ADDELEMENTS_EDIT_LIST: 'Editează lista ...',
        ADDELEMENTS_PRODUCT_COST: 'într-un articol',
        HEAT_TRANSFER: 'transfer de căldură',
        WRONG_EMAIL: 'Adresă de e-mail incorectă',
        LINK_BETWEEN_COUPLE: 'între o pereche',
        LINK_BETWEEN_ALL: 'între toți',
//        LINK_DELETE_ALL_GROUPE: 'șterge totul',
        CLIENT_SEX: 'Sex',
        CLIENT_SEX_M: 'M',
        CLIENT_SEX_F: 'F',
        CLIENT_AGE: 'Vârsta',
        CLIENT_AGE_OLDER: 'mai mare 61',
        //CLIENT_EDUCATION: 'Studii',
        //CLIENT_EDUC_MIDLE: 'medii',
        //CLIENT_EDUC_SPEC: 'medii spec.',
        //CLIENT_EDUC_HIGH: 'superioare',
        CLIENT_EDUCATION: 'Criteriul principal al alegerii Dvs.',
        CLIENT_EDUC_MIDLE: 'Preț avantajos',
        CLIENT_EDUC_SPEC: 'Imaginea producătorului ',
        CLIENT_EDUC_HIGH: 'Marca profilului sau accesoriilor',
        CLIENT_EDUC_4: 'Recomandările vânzătorului',
        CLIENT_OCCUPATION: 'Ocuparea în câmpul muncii',
        CLIENT_OCCUP_WORKER: 'Funcționar',
        CLIENT_OCCUP_HOUSE: 'Casnică',
        CLIENT_OCCUP_BOSS: 'Antreprenor',
        CLIENT_OCCUP_STUD: 'Student',
        CLIENT_OCCUP_PENSION: 'Pensionar',
        CLIENT_INFO_SOURCE: 'Sursa de informații',
        CLIENT_INFO_PRESS: 'Presă',
        CLIENT_INFO_FRIEND: 'De la persoane cunoscute',
        CLIENT_INFO_ADV: 'Publicitate vizuală',
        SELECT_PLACEHOLD: 'selectați opțiunea Dvs.',
        //SELECT_AGE: 'Selectați vârsta Dvs.',
        //SELECT_ADUCATION: 'Selectați studiile Dvs.',
        //SELECT_OCCUPATION: 'Selectați statutului Dvs. de angajat',
        //SELECT_INFO_SOURCE: 'Selectați sursa de informații',
        NO_DISASSEMBL: 'fără demontare',
        STANDART_ASSEMBL: 'standard',
        VIP_ASSEMBL: 'montare VIP',
        DISCOUNT: 'Reducere',
        DISCOUNT_SELECT: 'Selectarea reducerii',
        DISCOUNT_WITH: 'Cu reducere',
        DISCOUNT_WITHOUT: 'Fără reducere',
        DISCOUNT_WINDOW: 'Reducere pentru articol',
        DISCOUNT_ADDELEM: 'Reducere pentru elementele suplimentare',
        ORDER_COMMENT: 'Заметка о заказе',
        UNKNOWN: 'Не известно'
      },
      settings: {
        AUTHORIZATION: 'Logare:',
        CHANGE_PASSWORD: 'Schimbă parola',
        CHANGE_LANGUAGE: 'Schimbă limba',
        PRIVATE_INFO: 'Date personale:',
        USER_NAME: 'Persoana de contat',
        CITY: 'Orașul',
        ADD_PHONES: 'Numere de telefon suplimentare:',
        INSERT_PHONE: 'Adaugă număr de telefon',
        CLIENT_SUPPORT: 'Asistență utilizatori',
        LOGOUT: 'Ieși din aplicație',
        SAVE: 'Salvează',
        CURRENT_PASSWORD: 'Curent',
        NEW_PASSWORD: 'Nou',
        CONFIRM_PASSWORD: 'Confirmă',
        NO_CONFIRM_PASS: 'Parolă incorectă'
      }

    });

})();