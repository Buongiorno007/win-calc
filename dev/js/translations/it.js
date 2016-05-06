﻿(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('italianDictionary', {

      common_words: {

        CHANGE: 'Cambiare',
        MONTHS: 'Gennaio, Febbraio, Marzo, Aprile, Maggio, Giugno, Luglio, Agosto, Settembre, Ottobre, Novembre, Dicembre',
        MONTHS_SHOT: 'Gen., Febb., Marzo, Apr., Mag., Giu., Luglio, Ago., Sett., Ott., Nov., Dic.',
        MONTHA: 'Gennaio, Febbraio, Marzo, Aprile, Maggio, Giugno, Luglio, Agosto, Settembre, Ottobre, Novembre, Dicembre',
        MONTH_LABEL: 'mese',
        MONTHA_LABEL: 'del mese',
        MONTHS_LABEL: 'mesi',
        ALL: 'tutto',
        MIN: 'Min',
        MAX: 'Max',
        //----- confirm dialogs

        EDIT_COPY_TXT: 'Cosa dovrei fare?',
        BUTTON_C: 'Copia',
        BUTTON_E: 'Modifica',
        BUTTON_Y: 'Sì',
        BUTTON_N: 'No',
        SPACE: '           ',

        DELETE_PRODUCT_TITLE: 'Cancella!',
        DELETE_PRODUCT_TXT: 'Volete cancellare il prodotto?',
        DELETE_ORDER_TITLE: 'Cancellazione dell’ordine!',
        DELETE_ORDER_TXT: 'Volete cancellare l’ordine?',
        COPY_ORDER_TITLE: 'Copia!',
        COPY_ORDER_TXT: 'Volete fare una copia dell’ordine?',
        SEND_ORDER_TITLE: 'La produzione !',
        SEND_ORDER_TXT: ' Volete inviare l’ordine in fabbrica?',
        NEW_TEMPLATE_TITLE: 'Cambiamento di una sagoma',
        TEMPLATE_CHANGES_LOST: ' I cambiamenti in una sagoma saranno persi! Continuare?',
        PAGE_REFRESH: "L'azzerramento della pagina porterà a perdita di dati!",
        SELECT: ' Scegliere ',
        AND: ' e ',
        OK: 'OK',
        BACK: 'Back',
        LETTER_M: 'm'
      },
      login: {
        ENTER: 'Entrare',
        PASS_CODE: 'Comunicate il codice al manager.',
        YOUR_CODE: 'Il vostro codice: ',
        EMPTY_FIELD: 'Riempite questo campo.',
        WRONG_LOGIN: 'For login (password) use only numbers, letters and symbols "@", ".", "-", "_".',
        //WRONG_NUMBER: 'Numero errato, formato +XX(XXX)XXX-XXXX.',
        SHORT_NAME: 'Nome troppo piccolo.',
        //SHORT_PASSWORD: 'Password troppo breve.',
        //SHORT_PHONE: 'Numero del telefono troppo piccolo.',
        IMPORT_DB_START: 'Aspetti, il carico di un database ha cominciato',
        IMPORT_DB_FINISH: ' Grazie, caricandolo sono complete',
        LOGIN: 'Login',
        PASSWORD: 'Password',
        MOBILE: 'Il cellulare',
        REGISTRATION: 'Registrazione',
        SELECT_COUNTRY: 'Il paese di Veberite',
        SELECT_REGION: 'Scelga la regione',
        SELECT_CITY: 'Scelga la città',
        USER_EXIST: 'Un tal utente già esiste! Provi ancora una volta.',
        USER_NOT_EXIST: 'Un tal utente non esiste. Esser registrato.',
        USER_NOT_ACTIVE: 'Non ha attivato il Suo profilo. Controlli la Sua posta.',
        USER_CHECK_EMAIL: 'La lettera di conferma La è stata mandata a posta.',
        SELECT_PRODUCER: 'Scelga il produttore',
        SELECT_FACTORY: 'Non ha scelto il produttore',
        USER_PASSWORD_ERROR: "Parola d'ordine scorretta!",
        OFFLINE: "Non c'è connessione con l'Internet!",
        IMPORT_DB: 'Il carico di Database ha cominciato! Aspetti, per favore!'
      },
      mainpage: {
        MM: ' мм ',
        CLIMATE_ZONE: 'Zona  climatica',
        THERMAL_RESISTANCE: 'Resistenza alla trasmissione termica',
        AIR_CIRCULATION: 'Coefficiente della circolazione d’aria',
        NAVMENU_GEOLOCATION: 'Scegliere la disposizione',
        NAVMENU_CURRENT_GEOLOCATION: 'La disposizione corrente',
        NAVMENU_CURRENT_CALCULATION: 'Pagamento corrente',
        NAVMENU_CART: 'Cestino per il pagamento',
        NAVMENU_ADD_ELEMENTS: 'Elementi aggiuntivi',
        NAVMENU_ALL_CALCULATIONS: 'Tutti i pagamenti',
        NAVMENU_SETTINGS: 'Impostazioni',
        NAVMENU_MORE_INFO: 'Maggiore informazione',
        NAVMENU_VOICE_HELPER: 'Assistenza a voce',
        NAVMENU_CALCULATIONS: 'Pagamenti',
        CONFIGMENU_ALERT: 'Per completare l`operazione, è necessario compilare tutti i campi',
        NAVMENU_APPENDIX: 'Allegato',
        NAVMENU_NEW_CALC: 'Il nuovo pagamento',
        CONFIGMENU_CONFIGURATION: 'Configurazioni e dimensioni',
        CONFIGMENU_SIZING: 'larghezza * altezza -',
        CONFIGMENU_PROFILE: 'Profilo',
        CONFIGMENU_GLASS: 'Parquet di vetro',
        CONFIGMENU_HARDWARE: 'Fornitura',
        CONFIGMENU_LAMINATION: 'Laminazione',
        CONFIGMENU_LAMINATION_TYPE: 'in camera / facciata',
        WHITE_LAMINATION: 'La bianca',
        CONFIGMENU_ADDITIONAL: 'In aggiunta',
        CONFIGMENU_IN_CART: 'Nel cestino',
        VOICE_SPEACH: 'Parlate...',
        COMMENT: "Lasci la nota sull'ordine qui.",
        ROOM_SELECTION: 'Scelta template',
        CONFIGMENU_NO_ADDELEMENTS: 'Gli elementi supplementari non sono scelti',
        HEATCOEF_VAL: 'Wt',
        TEMPLATE_TIP: 'Poiché il cambiamento delle dimensioni preme qui',
        PROFILE_TIP: 'Poiché una scelta di un profilo preme qui',
        GLASS_TIP: 'Poiché una scelta di una finestra doppio invetriata preme qui',
        SELECT_ALL: 'Selezionare tutto',
        SELECT_GLASS_WARN: 'Clicca sul vetro, che si desidera modificare'
      },
      panels: {
        TEMPLATE_WINDOW: 'Finestra',
        TEMPLATE_BALCONY: 'Balcone',
        TEMPLATE_DOOR: 'Porta',
        TEMPLATE_BALCONY_ENTER: 'Porta del balcone',
        TEMPLATE_EDIT: 'Redigere',
        TEMPLATE_DEFAULT: 'Progetto per difetto',
        COUNTRY: 'paese',
        BRAND: 'marchio commerciale',
        HEAT_INSULATION: 'isolamento termico',
        NOICE_INSULATION: 'isolamento acustico',
        CORROSION_COEFF: 'anticorrosione',
        BURGLAR_COEFF: 'protezione contro rottura',
        LAMINAT_INSIDE: 'in camera',
        LAMINAT_OUTSIDE: 'la facciata',
        ONE_WINDOW_TYPE: 'La porta sola',
        TWO_WINDOW_TYPE: "L'ala doppio",
        THREE_WINDOW_TYPE: 'Il da tre foglie',
        CAMERa: 'di camera',
        CAMER: ' di camera ',
        CAMERs: 'di camere',
        ENERGY_SAVE: '+risparmio di energia',
        DOOR_TYPE1: 'su perimetro',
        DOOR_TYPE2: 'senza soglia',
        DOOR_TYPE3: 'la soglia di alluminio, battere a macchina 1',
        DOOR_TYPE4: 'la soglia di alluminio, battere a macchina 2',
        HANDLE_TYPE1: 'prema la serie',
        HANDLE_TYPE2: 'maniglia di ufficio standard',
        LOCK_TYPE1: 'una chiusura con una serratura a scatto',
        LOCK_TYPE2: 'la multichiusura con una serratura a scatto',
        EXTRA_GLASS1: "Нет возможности установки стеклопакета ",
        EXTRA_GLASS2: " для данной конфигурации конструкции"
      },
      add_elements: {
        CHOOSE: 'Scegliere',
        ADD: 'Aggiungere',
        GRID: 'zanzaniera',
        VISOR: 'tettoia',
        SPILLWAY: 'scolo d’acqua',
        OUTSIDE: 'spallette esterne',
        LOUVERS: 'le serrande',
        INSIDE: 'spallette interne',
        CONNECTORS: 'connettore',
        FAN: 'microventilazione',
        WINDOWSILL: 'davanzale',
        INSIDES:'Interno',
        OUTSIDES:'Esterno',
        COMPONENTS:'Componenti',
        SHUTTERS:'persiane',
        BLIND: 'Tapparelle avvolgibili',
        GRATING: 'copertura esterna',
        HANDLEL: 'maniglia',
        OTHERS: 'altro',
        GRIDS: 'le zanzariere',
        VISORS: 'le tettoie',
        SPILLWAYS: 'gli scoli d’acqua',
        WINDOWSILLS: 'i davanzali',
        HANDLELS: 'le maniglie',
        NAME_LABEL: 'denominazione',
        ARTICUL_LABEL: 'riferimento',
        QTY_LABEL: 'pz.',
        SIZE_LABEL: 'dimensione, misura',
        WIDTH_LABEL: 'larghezza',
        HEIGHT_LABEL: 'altezza',
        OTHER_ELEMENTS1: 'Ancora',
        OTHER_ELEMENTS2: 'componenti...',
        SCHEME_VIEW: 'Schematicamente',
        LIST_VIEW: 'Lista',
        INPUT_ADD_ELEMENT: 'Aggiungere un componente elemento',
        CANCEL: 'Revoca',
        TOTAL_PRICE_TXT: 'Totale componenti aggiuntivi:',
        ELEMENTS: 'componenti',
        ELEMENT: 'componente',
        ELEMENTA: 'di componente'
      },
      add_elements_menu: {
        TIP: 'Scegliete un componente dalal lista',
        EMPTY_ELEMENT: 'Senza elemento',
        TAB_NAME_SIMPLE_FRAME: 'Schema semplice',
        TAB_NAME_HARD_FRAME: 'Schema complesso',
        TAB_EMPTY_EXPLAIN: 'Scegliete il primo elemento dalla lista.'
      },
      design: {
        SASH_SHAPE: 'battenti',
        ANGEL_SHAPE: 'angoli',
        IMPOST_SHAPE: 'imposte',
        ARCH_SHAPE: 'archi',
        POSITION_SHAPE: 'posizione',
        UNITS_DESCRIP: 'come unità di musura sono usati millimetri',
        PROJECT_DEFAULT: 'progetto per difetto',
        DOOR_CONFIG_LABEL: 'configurazione delal porta',
        DOOR_CONFIG_DESCTIPT: 'infisso porta',
        SASH_CONFIG_DESCTIPT: 'battente della porta',
        HANDLE_CONFIG_DESCTIPT: 'maniglia',
        LOCK_CONFIG_DESCTIPT: 'la serratura',
        STEP: 'passo',
        LABEL_DOOR_TYPE: 'Scegliete il modello dell’infisso porta',
        LABEL_SASH_TYPE: 'Scegliete un tipo dibattente portamaniglia',
        LABEL_HANDLE_TYPE: 'Scegliete un tipo di maniglia',
        LABEL_LOCK_TYPE: 'Scegliete un tipo di serratura',
        VOICE_SWITCH_ON: "il modo di voce è incluso",
        VOICE_NOT_UNDERSTAND: 'Non è chiaro',
        VOICE_SMALLEST_SIZE: 'dimensioni troppo piccole',
        VOICE_BIGGEST_SIZE: "dimensioni troppo grandi",
        VOICE_SMALL_GLASS_BLOCK: "apertura leggera troppo piccola",
        SQUARE_EXTRA: "Площадь конструкции превышает допустимую",
        DIM_EXTRA: "Габаритный размер конструкции превышает допустимый",
        NOT_AVAILABLE: 'È inaccessibile!',
        TEST_STAGE: "Находится в стадии тестирования",
        GLASS: "Стеклопакет",
        GLASS_SIZE: "размером",
        NO_MATCH_RANGE: "не соответствует допустимому диапазону",
        BY_WIDTH: "by width",
        BY_HEIGHT: "by height",
        GLASS_SQUARE: "с площадью",
        MAX_VALUE_HIGHER: "перевышает допустимое максимальное значение",
        EXTRA_SASH: "Текущий размер створки по фальцу",
        CHANGE_SIZE: "Для сохранения конструкции измените размеры.",
        DOOR_ERROR: "Systems of entrance doors are not configured"
      },
      history: {
        SEARCH_PLACEHOLDER: 'Ricerca per parole chiave',
        DRAFT_VIEW: 'Brutte copie dei conteggi',
        HISTORY_VIEW: 'Storia deiconteggi',
        PHONE: 'telefono',
        CLIENT: 'cliente',
        ADDRESS: 'indirizzo',
        FROM: 'da ',
        UNTIL: 'fino a ',
        PAYMENTS: 'dei pagamenti',
        ALLPRODUCTS: 'prodotti',
        ON: 'per',
        DRAFT: 'Brutta copia',
        DATE_RANGE: 'Diapason delle date',
        ALL_TIME: 'Per tutto il tempo',
        SORTING: 'Cernita',
        NEWEST_FIRST: 'Per cronologia: i nuovi all’inizio',
        NEWEST_LAST: 'Per cronologia: i nuovi alal fine',
        SORT_BY_TYPE: 'Per tipo',
        SORT_SHOW: 'Mostrare',
        SORT_SHOW_ACTIVE: 'Solo attivi',
        SORT_SHOW_WAIT: 'Solo in attesa',
        SORT_SHOW_DONE: 'Appena finito',
        BY_YOUR_REQUEST: 'Su vostra richiesta',
        NOT_FIND: 'Non è stato trovato niente',
        WAIT_MASTER: 'Aspetta il misuratore ',
        INCLUDED: 'sono inclusi',
        NO_PRINT: "Вывод спецификации невозможен ввиду отсутствия интернет-соединения"
      },
      cart: {
        ALL_ADD_ELEMENTS: 'Tutti gli elementi supplementari dell’oedine',
        ADD_ORDER: 'Aggiungere un prodotto',
        PRODUCT_QTY: 'quantitativo di prodotti',
        LIGHT_VIEW: 'Aspetto ridotto',
        FULL_VIEW: 'Aspetto integrale ',
        DELIVERY: 'Consegna',
        SELF_EXPORT: 'Trasporto individuale',
        FLOOR: 'piano',
        ASSEMBLING: 'Montaggio',
        WITHOUT_ASSEMBLING: 'senza montaggio',
        FREE: 'gratuitamente',
        PAYMENT_BY_INSTALMENTS: 'Rateazione',
        WITHOUT_INSTALMENTS: 'senza rateazione',
        DELIVERY_DATE: 'Data consegna',
        TOTAL_PRICE_LABEL: 'Totale per la consegna',
        MONTHLY_PAYMENT_LABEL: 'pagamenti mensili per',
        DATE_DELIVERY_LABEL: 'con consegna per ',
        FIRST_PAYMENT_LABEL: 'Nuovo pagamento',
        ORDER: 'Ordinare',
        MEASURE: 'Misurare',
        READY: 'Pronto',
        CALL_MASTER: 'Chiamata del misuratore per il conteggio',
        CALL_MASTER_DESCRIP: 'Per la telefonata del measurer abbiamo bisogno di sapere qualcosa su Lei. Entrambi i campi sono obbligatori per riempitura.',
        CLIENT_LOCATION: 'Località',
        CLIENT_ADDRESS: 'Indirizzo',
        CLIENT_HOUSE: "Буд",
        CLIENT_FLAT: "Кв",
        CLIENT_FLOOR: "Пов",
        CALL_ORDER: 'Stesura dell’ordine per il conteggio',
        CALL_ORDER_DESCRIP: 'Per poter eseguire il vostro ordine dobbiamo sapere qualccosa di voi.',
        CALL_ORDER_CLIENT_INFO: 'Informazioni sul cliente (campo obbligatorio):',
        CLIENT_NAME: 'Cognome Nome Patronimico',
        CALL_ORDER_DELIVERY: 'Consegnare l’ordine per',
        CALL_ORDER_TOTAL_PRICE: 'In totale',
        CALL_ORDER_ADD_INFO: 'In aggiunta:',
        CLIENT_EMAIL_ORDER: 'Электронная почта для получения спецификации',
        CLIENT_EMAIL: 'posta elettronica',
        ADD_PHONE: 'Telefono supplementare',
        CALL_CREDIT: 'Concessione rateazione e Accettazione dell’ordine per il conteggio',
        CALL_CREDIT_DESCRIP: "Per emettere il pagamento di rate ed eseguire l'ordine, dobbiamo sapere qualcosa su Lei.",
        CALL_CREDIT_CLIENT_INFO: 'Rateazione:',
        CREDIT_TARGET: 'Finalità della concessione di rateazione',
        CLIENT_ITN: 'Codice  fiscale ',
        CALL_START_TIME: 'Telefonare da:',
        CALL_END_TIME: 'fino a:',
        CALL_CREDIT_PARTIAL_PRICE: 'per',
        ADDELEMENTS_EDIT_LIST: 'Redigere la lista ...',
        ADDELEMENTS_PRODUCT_COST: 'in un prodotto',
        HEAT_TRANSFER: 'tarsmissione di calore',
        WRONG_EMAIL: 'Posta elettronica errata',
        LINK_BETWEEN_COUPLE: 'tra coppia',
        LINK_BETWEEN_ALL: 'tra tutti',
//        LINK_DELETE_ALL_GROUPE: 'cancelare tutto',
        CLIENT_SEX: 'di sesso',
        CLIENT_SEX_M: 'U',
        CLIENT_SEX_F: 'D',
        CLIENT_AGE: 'Età',
        CLIENT_AGE_OLDER: 'è più anziano di 61',
        //CLIENT_EDUCATION: 'Istruzione',
        //CLIENT_EDUC_MIDLE: 'media',
        //CLIENT_EDUC_SPEC: 'specializzato secondario',
        //CLIENT_EDUC_HIGH: 'il più alto',
        CLIENTE_ISTRUZIONE: 'Il criterio principale della vostra scelta',
        CLIENT_EDUC_MIDLE: 'Il buon prezzo',
        CLIENTE_EDUC_SPEC: 'creatore di immagine',
        CLIENT_EDUC_HIGH: 'il profilo del marchio e hardware',
        CLIENT_EDUC_4: 'Raccomandazioni venditore',
        CLIENT_OCCUPATION: 'Occupazione',
        CLIENT_OCCUP_WORKER: 'Dipendente',
        CLIENT_OCCUP_HOUSE: 'Casalinga',
        CLIENT_OCCUP_BOSS: "Uomo d'affari",
        CLIENT_OCCUP_STUD: 'Studente',
        CLIENT_OCCUP_PENSION: 'Pensionato',
        CLIENT_INFO_SOURCE: 'Fonte di informazioni',
        CLIENT_INFO_PRESS: 'Premere',
        CLIENT_INFO_FRIEND: 'Da conoscenti',
        CLIENT_INFO_ADV: 'Fare annunci visivo',
        SELECT_PLACEHOLD: "selezionare l'opzione",
        //SELECT_AGE: 'Scelga la Sua età',
        //SELECT_ADUCATION: 'Scelga la Sua istruzione',
        //SELECT_OCCUPATION: 'Scelga la Sua occupazione',
        //SELECT_INFO_SOURCE: 'Scelga la fonte di informazioni',
        NO_DISASSEMBL: 'senza smontano',
        STANDART_ASSEMBL: 'lo standard',
        VIP_ASSEMBL: 'INSTALLAZIONE DEL VIP',
        DISCOUNT: 'Sconto',
        DISCOUNT_SELECT: 'Scelta di sconto',
        DISCOUNT_WITH: 'Prendere in considerazione uno sconto',
        DISCOUNT_WITHOUT: 'Senza uno sconto',
        DISCOUNT_WINDOW: 'Sconto a un prodotto',
        DISCOUNT_ADDELEM: 'Sconto a elementi supplementari',
        ORDER_COMMENT: 'Nota Order',
        UNKNOWN: 'Sconosciuto'
      },
      settings: {
        AUTHORIZATION: 'Autorizzazione:',
        CHANGE_PASSWORD: "Cambiare la parola d'ordine",
        CHANGE_LANGUAGE: 'Cambiare la lingua',
        PRIVATE_INFO: 'Dati personalio:',
        USER_NAME: 'Persona di contatto',
        CITY: 'Città',
        ADD_PHONES: 'Telefoni supplementari:',
        INSERT_PHONE: 'Aggiungere un telefono',
        CLIENT_SUPPORT: 'Assistenza agli utentui',
        LOGOUT: 'Uscire dall’allegato',
        SAVE: 'Salvare',
        CURRENT_PASSWORD: 'Corrente',
        NEW_PASSWORD: 'Nuovo',
        CONFIRM_PASSWORD: 'Confermare',
        NO_CONFIRM_PASS: 'Password errata'
      }

    });

})();
