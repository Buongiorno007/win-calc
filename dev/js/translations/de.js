(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('germanDictionary', {

      common_words: {
        CHANGE: 'untreu sein',
        MONTHS: 'Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember',
        MONTHS_SHOT: 'Jan, Feb, Mär, Apr, Mai, Jun, Jul, Aug, Sep, Okt, Nov, Dez',
        MONTHA: 'Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember',
        MONTH_LABEL: 'Monat',
        MONTHA_LABEL: 'des Monats',
        MONTHS_LABEL: 'Monate',
        ALL: 'alles',
        MIN: 'min.',
        MAX: 'maks.',
        //----- confirm dialogs
        BUTTON_Y: 'JA',
        BUTTON_N: 'ES IST',
        DELETE_PRODUCT_TITLE: 'Die Entfernung!',
        DELETE_PRODUCT_TXT: 'Sie wollen das Produkt entfernen?',
        DELETE_ORDER_TITLE: 'Die Entfernung der Bestellung!',
        DELETE_ORDER_TXT: 'Sie wollen die Bestellung entfernen?',
        COPY_ORDER_TITLE: 'Das Kopieren!',
        COPY_ORDER_TXT: 'Sie wollen der Bestellung kopieren?',
        SEND_ORDER_TITLE: 'In die Produktion!',
        SEND_ORDER_TXT: 'Sie wollen die Bestellung auf den Betrieb absenden?',
        NEW_TEMPLATE_TITLE: 'Template changing',
        TEMPLATE_CHANGES_LOST: 'The template changes will lost! Continue?'
      },
      login: {
        ENTER: 'Einloggen',
        PASS_CODE: 'Teilen Sie diesen Kode dem Manager mit.',
        YOUR_CODE: 'Ihr Kode: ',
        EMPTY_FIELD: 'Füllen Sie dieses Feld aus.',
        WRONG_NUMBER: 'Die falsche Nummer.',
        SHORT_NAME: 'Too short name',
        SHORT_PASSWORD: 'Die viel zu kleine Parole',
        SHORT_PHONE: 'Too little phone number.',
        IMPORT_DB_START: 'Подождите, началась загрузка базы данных',
        IMPORT_DB_FINISH: 'Спасибо, загрузка завершена',
        MOBILE: 'Handy',
        PASSWORD: 'Passwort',
        REGISTRATION: 'Anmeldung',
        SELECT_COUNTRY: 'Select country',
        SELECT_REGION: 'Select region',
        SELECT_CITY: 'Select city',
        USER_EXIST: 'Sorry, but this user already exists! Please, try again.',
        USER_CHECK_EMAIL: 'The confirmed email was send to you. Please, check your email.'
      },
      mainpage: {
        MM: ' mm ',
        CLIMATE_ZONE: 'Die Klimazone',
        THERMAL_RESISTANCE: 'Der Widerstand der Wärmeübertragung',
        AIR_CIRCULATION: 'Der Koeffizient des Luftwechsels',
        ROOM_KITCHEN: 'Küche',
        ROOM_LIVINGROOM: 'Wohnzimmer',
        ROOM_BALCONY: 'Altan',
        ROOM_CHILDROOM: 'Детская',
        ROOM_BEDROOM: 'Schlafzimmer',
        ROOM_DOOR: 'Eingang',
        NAVMENU_GEOLOCATION: 'Die Anordnung zu wählen',
        NAVMENU_CURRENT_GEOLOCATION: 'Die laufende Anordnung',
        NAVMENU_CURRENT_CALCULATION: 'Die laufende Berechnung',
        NAVMENU_CART: 'Der Korb der Berechnung',
        NAVMENU_ADD_ELEMENTS: 'Die zusätzlichen Elemente',
        NAVMENU_ALL_CALCULATIONS: 'Alle Berechnungen',
        NAVMENU_SETTINGS: 'Einstellungen',
        NAVMENU_MORE_INFO: 'Es gibt als mehrere Informationen',
        NAVMENU_VOICE_HELPER: 'Der Stimmhelfer',
        NAVMENU_CALCULATIONS: 'Die Berechnungen',
        NAVMENU_APPENDIX: 'Anwendung',
        NAVMENU_NEW_CALC: '+ die Neue Berechnung',
        CONFIGMENU_CONFIGURATION: 'Die Konfiguration und die Umfänge',
        CONFIGMENU_SIZING: 'Die Breite * die Höhe',
        CONFIGMENU_PROFILE: 'Profil',
        CONFIGMENU_GLASS: 'Bauglasplatte',
        CONFIGMENU_HARDWARE: 'Zubehör',
        CONFIGMENU_LAMINATION: 'Ламинация',
        CONFIGMENU_LAMINATION_TYPE: 'Die Fassade / in den Zimmer',
        CONFIGMENU_ADDITIONAL: 'Zusätzlich',
        CONFIGMENU_IN_CART: 'Zum Warenkorb',
        VOICE_SPEACH: 'Sprechen...',
        COMMENT: 'Оставьте свою заметку о заказе здесь.',
        ROOM_SELECTION: 'Interior selection'
      },
      panels: {
        TEMPLATE_WINDOW: 'Fenster',
        TEMPLATE_BALCONY: 'Altan',
        TEMPLATE_DOOR: 'Tür',
        TEMPLATE_BALCONY_ENTER: 'Der Ausgang auf den Balkon',
        TEMPLATE_EDIT: 'Editieren',
        TEMPLATE_DEFAULT: 'Das Projekt als Voreinstellung',
        COUNTRY: 'Land',
        BRAND: 'Das Warenzeichen',
        HEAT_INSULATION: 'warm Isolation',
        NOICE_INSULATION: 'шумоизоляция',
        LAMINAT_INSIDE: 'Laminieren des Rahmens im Raum',
        LAMINAT_OUTSIDE: 'Laminierung von Seiten der Straßenfront',
        LAMINAT_WHITE: 'ohne Laminierung, eine radikale weiß'
      },
      add_elements: {
        CHOOSE: 'Wählen',
        ADD: 'drauflegen',

        GRID: 'Moskitonetz',
        VISOR: 'Deflektor',
        SPILLWAY: 'Entwässerungsanlage',
        OUTSIDE: 'Außen Pisten',
        LOUVERS: 'Jalousie',
        INSIDE: 'Innen Pisten',
        CONNECTORS: 'Zwischenstepsel',
        FAN: 'Mikroventilation',
        WINDOWSILL: 'Fensterbank',
        HANDLEL: 'Griff',
        OTHERS: 'Übrige',
        GRIDS: 'Moskitonetze',
        VISORS: 'Visiere',
        SPILLWAYS: 'Entwässerungsanlagen',
        WINDOWSILLS: 'Fensterbänke',
        HANDLELS: 'Griff',
        NAME_LABEL: 'Benennung',
        QTY_LABEL: 'pcs',
        SIZE_LABEL: 'Dimension',
        WIDTH_LABEL: 'Breite',
        HEIGHT_LABEL: 'Höhe',
        COLOR_LABEL: 'Farbe',
        OTHER_ELEMENTS1: 'Noch',
        OTHER_ELEMENTS2: 'Komponente ...',
        SCHEME_VIEW: 'Schematisch',
        LIST_VIEW: 'Liste',
        INPUT_ADD_ELEMENT: 'Komponente hinzufügen',
        CANCEL: 'Stornierung',
        TOTAL_PRICE_TXT: 'Gesamte zusätzliche Komponenten in der Menge von:',
        ELEMENTS: 'Komponenten',
        ELEMENT: 'Komponente',
        ELEMENTA: 'Komponente'
      },
      add_elements_menu: {
        TIP: 'Wählen Sie ein Element aus der Liste',
        EMPTY_ELEMENT: 'Ohne das Element',
        COLOR_AVAILABLE: 'Verfügbare Farben:',
        TAB_NAME_SIMPLE_FRAME: 'Einfacher Aufbau',
        TAB_NAME_HARD_FRAME: 'Verbundstruktur',
        TAB_EMPTY_EXPLAIN: 'Wählen Sie den Anfangspunkt zu starten Bau.'
      },
      construction: {
        SASH_SHAPE: 'Flügel',
        ANGEL_SHAPE: 'Winkel',
        IMPOST_SHAPE: 'Abgaben',
        ARCH_SHAPE: 'Gewölbe',
        POSITION_SHAPE: 'Position',
        UNITS_DESCRIP: 'Da die Einheiten in mm',
        PROJECT_DEFAULT: 'Standardprojekt',
        DOOR_CONFIG_LABEL: 'Anordnung der Türen',
        DOOR_CONFIG_DESCTIPT: 'Türrahmen',
        SASH_CONFIG_DESCTIPT: 'Torblatt',
        HANDLE_CONFIG_DESCTIPT: 'Griff',
        LOCK_CONFIG_DESCTIPT: 'Verschluss',
        STEP: 'Schritt',
        LABEL_DOOR_TYPE: 'Wählen Sie ein Design Türrahmen',
        LABEL_SASH_TYPE: 'Wählen Sie die Art des Türblattes',
        LABEL_HANDLE_TYPE: 'Wählen Sie die Art der Griff',
        LABEL_LOCK_TYPE: 'Wählen Sie die Art der Sperre',
        VOICE_SWITCH_ON: "Voice-Modus aktiviert ist",
        VOICE_NOT_UNDERSTAND: 'es ist nicht klar',
        VOICE_SMALLEST_SIZE: 'zu klein',
        VOICE_BIGGEST_SIZE: "zu groß",
        VOICE_SMALL_GLASS_BLOCK: "слишком маленький световой проем"
      },
      history: {
        SEARCH_PLACEHOLDER: 'Suche nach Stichwort',
        DRAFT_VIEW: 'Entwürfe Berechnungen',
        HISTORY_VIEW: 'Siedlungsgeschichte',
        PHONE: 'Telefon',
        CLIENT: 'клиент',
        ADDRESS: 'Anschrift',
        FROM: 'von ',
        UNTIL: 'vor ',
        PAYMENTS: 'Zahlungen',
        ALLPRODUCTS: 'Produkte',
        ON: 'bis',
        DRAFT: 'Entwurf',
        DATE_RANGE: 'Datumsbereich',
        ALL_TIME: 'Die ganze Zeit',
        SORTING: 'Sortierung',
        NEWEST_FIRST: 'Mit der Zeit: neue zuerst',
        NEWEST_LAST: 'Zu der Zeit, neue am Ende',
        SORT_BY_TYPE: 'Nach Art',
        SORT_SHOW: 'Show',
        SORT_SHOW_ACTIVE: 'Nur aktiv',
        SORT_SHOW_WAIT: 'Nur angemeldete',
        SORT_SHOW_DONE: 'Только завершенные',
        BY_YOUR_REQUEST: 'Je nach Wunsch',
        NOT_FIND: 'nichts gefunden',
        WAIT_MASTER: 'erwartet Gager'
      },
      cart: {
        ALL_ADD_ELEMENTS: 'Alle Anbauteile bestellen',
        ADD_ORDER: 'Fügen Sie das Produkt',
        PRODUCT_QTY: 'Anzahl der Produkte',
        LIGHT_VIEW: 'Kurzansicht',
        FULL_VIEW: 'Vollansicht',
        DELIVERY: 'Lieferung',
        SELF_EXPORT: 'Abholen',
        FLOOR: 'Etage',
        ASSEMBLING: 'Montage',
        WITHOUT_ASSEMBLING: 'ohne Montage',
        FREE: 'kostenlos',
        PAYMENT_BY_INSTALMENTS: 'Ratenzahlung',
        WITHOUT_INSTALMENTS: 'losen Raten',
        DELIVERY_DATE: 'Liefertermin',
        TOTAL_PRICE_LABEL: 'Insgesamt Lieferung auf',
        MONTHLY_PAYMENT_LABEL: 'monatlichen Zahlungen auf',
        DATE_DELIVERY_LABEL: 'Geliefert auf',
        FIRST_PAYMENT_LABEL: 'Die erste Zahlung',
        ORDER: 'Bestellen',
        MEASURE: 'Maßnahme',
        READY: 'Bereit',
        CALL_MASTER: 'Rufen Gager zu berechnen',
        CALL_MASTER_DESCRIP: 'Um Gager nennen wir brauchen etwas für Sie zu wissen. Beide Felder sind Pflichtfelder.',
        CLIENT_LOCATION: 'Lage',
        CLIENT_ADDRESS: 'Anschrift',
        CALL_ORDER: 'Bestellung zur Berechnung',
        CALL_ORDER_DESCRIP: 'Um den Auftrag zu erfüllen, müssen wir etwas über Sie wissen.',
        CALL_ORDER_CLIENT_INFO: 'Kundeninformation (muss ausgefüllt werden):',
        CLIENT_NAME: 'Vollständiger Name',
        CALL_ORDER_DELIVERY: 'Liefern Sie eine Bestellung für',
        CALL_ORDER_TOTAL_PRICE: 'insgesamt',
        CALL_ORDER_ADD_INFO: 'Extras (optional):',
        CLIENT_EMAIL: 'E-Mail',
        ADD_PHONE: 'Zusätzliche Telefon',
        CALL_CREDIT: 'Machen Tranche und um zu berechnen',
        CALL_CREDIT_DESCRIP: 'Um Raten anordnen und erfüllen den Auftrag, wir haben etwas für Sie zu wissen.',
        CALL_CREDIT_CLIENT_INFO: 'Ratenzahlung:',
        CREDIT_TARGET: 'Der Zweck der Registrierung von Raten',
        CLIENT_ITN: 'Individuelle Steuernummers',
        CALL_START_TIME: 'Rufen Sie aus:',
        CALL_END_TIME: 'vor:',
        CALL_CREDIT_PARTIAL_PRICE: 'auf',
        ADDELEMENTS_EDIT_LIST: 'Liste bearbeiten',
        ADDELEMENTS_PRODUCT_COST: 'einem Produkt',
        HEAT_TRANSFER: 'Wärmeübertragung',
        WRONG_EMAIL: 'Falsche E-Mail',
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
        CLIENT_INFO_ADV: 'Visual advertising'
      },
      settings: {
        AUTHORIZATION: 'Autorisierung:',
        CHANGE_PASSWORD: 'Kennwort ändern',
        CHANGE_LANGUAGE: 'Change language',
        PRIVATE_INFO: 'Persönliche Informationen:',
        USER_NAME: 'Gesprächspartner',
        CITY: 'Stadt',
        ADD_PHONES: 'Zusätzliche Telefone:',
        INSERT_PHONE: 'Hinzufügen einer Telefon',
        CLIENT_SUPPORT: 'Poderzhka Benutzer',
        LOGOUT: 'Beenden Sie die Anwendung',
        SAVE: 'Speichern',
        CURRENT_PASSWORD: 'Die Jetzige',
        NEW_PASSWORD: 'Neu',
        CONFIRM_PASSWORD: 'Bestätigen',
        NO_CONFIRM_PASS: 'Ungültiges Passwort'
      }//,

      //'SWITCH_LANG': 'German'

    });

})();