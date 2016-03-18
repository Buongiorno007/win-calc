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
        MONTHA_LABEL: 'Monats',
        MONTHS_LABEL: 'Monate',
        ALL: 'alles',
        MIN: 'min.',
        MAX: 'maks.',
        //----- confirm dialogs
        BUTTON_Y: 'JA',
        BUTTON_N: 'NEIN',
        DELETE_PRODUCT_TITLE: 'Die Entfernung!',
        DELETE_PRODUCT_TXT: 'Sie wollen das Produkt entfernen?',
        DELETE_ORDER_TITLE: 'Die Entfernung der Bestellung!',
        DELETE_ORDER_TXT: 'Sie wollen die Bestellung entfernen?',
        COPY_ORDER_TITLE: 'Das Kopieren!',
        COPY_ORDER_TXT: 'Sie wollen der Bestellung kopieren?',
        SEND_ORDER_TITLE: 'In die Produktion!',
        SEND_ORDER_TXT: 'Sie wollen die Bestellung auf den Betrieb absenden?',
        NEW_TEMPLATE_TITLE: 'Template-Wechsel',
        TEMPLATE_CHANGES_LOST: 'Die Template-Änderungen gehen verloren! Fortfahren?',
        PAGE_REFRESH: 'Das Neuladen der Seite zu Datenverlust führen!',
        SELECT: 'wählen',
        AND: 'und',
        OK: 'OK',
        BACK: 'Back',
        LETTER_M: 'm'
      },
      login: {
        ENTER: 'Einloggen',
        PASS_CODE: 'Teilen Sie diesen Kode dem Manager mit.',
        YOUR_CODE: 'Ihr Kode: ',
        EMPTY_FIELD: 'Füllen Sie dieses Feld aus.',
        WRONG_LOGIN: 'For login (password) use only numbers, letters and symbols "@", ".", "-", "_".',
        //WRONG_NUMBER: 'Die falsche Nummer.',
        SHORT_NAME: 'Eine zu kurze Namen',
        //SHORT_PASSWORD: 'Die viel zu kleine Parole',
        //SHORT_PHONE: 'Zu wenig Telefonnummer.',
        IMPORT_DB_START: 'Warten begann Laden der Datenbank',
        IMPORT_DB_FINISH: 'Vielen Dank für das Herunterladen abgeschlossen ist',
        LOGIN: 'Login',
        PASSWORD: 'Passwort',
        MOBILE: 'Handy',
        REGISTRATION: 'Anmeldung',
        SELECT_COUNTRY: 'Land wählen',
        SELECT_REGION: 'Region wählen',
        SELECT_CITY: 'Wählen Sie die Stadt',
        USER_EXIST: 'Dieser Benutzer ist bereits vorhanden! Versuchen Sie es erneut.',
        USER_NOT_EXIST: 'Ein solcher Benutzer nicht existiert. Registrieren.',
        USER_NOT_ACTIVE: 'Sie haben Ihr Profil aktiviert. Überprüfen Sie Ihre E-Mail.',
        USER_CHECK_EMAIL: 'Bestätigungsemail wurde Ihnen in der E-Mail gesendet.',
        SELECT_PRODUCER: 'Hersteller auswählen',
        SELECT_FACTORY: 'Sie haben noch keine gewählten Hersteller',
        USER_PASSWORD_ERROR: 'ungültiges Kennwort!',
        OFFLINE: 'Keine Verbindung zum Internet!',
        IMPORT_DB: 'Databases JETZT HERUNTERLADEN! Warten Sie mal!'
      },
      mainpage: {
        MM: ' mm ',
        CLIMATE_ZONE: 'Die Klimazone',
        THERMAL_RESISTANCE: 'Wärmeübertragung',
        AIR_CIRCULATION: 'Der Koeffizient des Luftwechsels',
        NAVMENU_GEOLOCATION: 'Die Anordnung zu wählen',
        NAVMENU_CURRENT_GEOLOCATION: 'Die laufende Anordnung',
        NAVMENU_CURRENT_CALCULATION: 'Die laufende Berechnung',
        NAVMENU_CART: 'Der Korb der Berechnung',
        NAVMENU_ADD_ELEMENTS: 'Die zusätzlichen Elemente',
        NAVMENU_ALL_CALCULATIONS: 'Bestellverlauf',
        NAVMENU_SETTINGS: 'Einstellungen',
        NAVMENU_MORE_INFO: 'Es gibt als mehrere Informationen',
        NAVMENU_VOICE_HELPER: 'Der Stimmverwaltung',
        NAVMENU_CALCULATIONS: 'Die Berechnungen',
        NAVMENU_APPENDIX: 'Anwendung',
        NAVMENU_NEW_CALC: '+Neue Berechnungs',
        CONFIGMENU_CONFIGURATION: 'Die Konfiguration und die Umfänge',
        CONFIGMENU_SIZING: 'Die Breite * die Höhe',
        CONFIGMENU_PROFILE: 'Profil',
        CONFIGMENU_GLASS: 'Bauglasplatte',
        CONFIGMENU_HARDWARE: 'Zubehör',
        CONFIGMENU_LAMINATION: 'Laminierung',
        CONFIGMENU_LAMINATION_TYPE: 'in den Zimmer / Die Fassade',
        WHITE_LAMINATION: 'Weiß',
        CONFIGMENU_ADDITIONAL: 'Zusätzlich',
        CONFIGMENU_IN_CART: 'Zum Warenkorb',
        VOICE_SPEACH: 'Sprechen...',
        COMMENT: 'Lassen Sie eine Notiz in der Größenordnung hier.',
        ROOM_SELECTION: 'Die Wahl Template',
        CONFIGMENU_NO_ADDELEMENTS: 'Zusätzliche Elemente ausgewählt',
        HEATCOEF_VAL: 'W',
        TEMPLATE_TIP: 'Um die Größe zu ändern, klicken Sie hier',
        PROFILE_TIP: 'Um ein Profil auszuwählen, klicken Sie hier',
        GLASS_TIP: 'Um eine doppelt verglasten Fenster auszuwählen, klicken Sie hier',
        SELECT_ALL: 'Alle auswählen',
        SELECT_GLASS_WARN: 'Klicken Sie auf die Verglasung zu ändern, Sie wollen'
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
        NOICE_INSULATION: 'Isolierung',
        CORROSION_COEFF: 'Korrosionsschutz',
        BURGLAR_COEFF: 'Diebstahlschutz',
        LAMINAT_INSIDE: 'im Raum',
        LAMINAT_OUTSIDE: 'Straßenfront',
        ONE_WINDOW_TYPE: 'Das Einaufklappbare',
        TWO_WINDOW_TYPE: 'Das Zweiaufklappbare',
        THREE_WINDOW_TYPE: 'Das Dreiaufklappbare',
        CAMERa: 'Kameras',
        CAMER: 'Kameras',
        CAMERs: 'Kameras',
        ENERGY_SAVE: '+Energiesparen',
        DOOR_TYPE1: 'Nach dem Perimeter',
        DOOR_TYPE2: 'Ohne Schwelle',
        DOOR_TYPE3: 'Die Aluminiumschwelle, Typ',
        SASH_TYPE1: 'Interzimmer',
        SASH_TYPE2: 'Tür- t-bildlich',
        SASH_TYPE3: 'Fenster',
        HANDLE_TYPE1: 'Druck- die Garnitur',
        HANDLE_TYPE2: 'Der standardmäßige Bürogriff',
        LOCK_TYPE1: 'One-Stop-Verriegelung',
        LOCK_TYPE2: 'Multipoint-Latch',
        EXTRA_GLASS1: "Нет возможности установки стеклопакета ",
        EXTRA_GLASS2: " для данной конфигурации конструкции"
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
        ARTICUL_LABEL: 'Nachschlagewerke',
        QTY_LABEL: 'pcs',
        SIZE_LABEL: 'Größe',
        WIDTH_LABEL: 'Breite',
        HEIGHT_LABEL: 'Höhe',
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
        TAB_NAME_SIMPLE_FRAME: 'Einfacher Aufbau',
        TAB_NAME_HARD_FRAME: 'Verbundstruktur',
        TAB_EMPTY_EXPLAIN: 'Wählen Sie den Anfangspunkt zu starten Bau.'
      },
      design: {
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
        VOICE_SMALL_GLASS_BLOCK: "zu kleine Oberlichter",
        SQUARE_EXTRA: "Площадь конструкции превышает допустимую",
        DIM_EXTRA: "Габаритный размер конструкции превышает допустимый",
        NOT_AVAILABLE: 'nicht Verfügbar!',
        TEST_STAGE: "Находится в стадии тестирования",
        GLASS: "Стеклопакет",
        GLASS_SIZE: "размером",
        NO_MATCH_RANGE: "не соответствует допустимому диапазону",
        BY_WIDTH: "by width",
        BY_HEIGHT: "by height",
        GLASS_SQUARE: "с площадью",
        MAX_VALUE_HIGHER: "перевышает допустимое максимальное значение",
        EXTRA_SASH: "Текущий размер створки по фальцу",
        CHANGE_SIZE: "Для сохранения конструкции измените размеры."
      },
      history: {
        SEARCH_PLACEHOLDER: 'Suche nach Stichwort',
        DRAFT_VIEW: 'Entwürfe Berechnungen',
        HISTORY_VIEW: 'Siedlungsgeschichte',
        PHONE: 'Telefon',
        CLIENT: 'Der Kunde',
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
        SORT_SHOW_DONE: 'nur abgeschlossen',
        BY_YOUR_REQUEST: 'Je nach Wunsch',
        NOT_FIND: 'nichts gefunden',
        WAIT_MASTER: 'erwartet Gager',
        INCLUDED: 'inbegriffen',
        NO_PRINT: "Вывод спецификации невозможен ввиду отсутствия интернет-соединения"
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
        CLIENT_HOUSE: "Буд",
        CLIENT_FLAT: "Кв",
        CLIENT_FLOOR: "Пов",
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
        ADDELEMENTS_EDIT_LIST: 'Liste bearbeiten ...',
        ADDELEMENTS_PRODUCT_COST: 'einem Produkt',
        HEAT_TRANSFER: 'Wärmeübertragung',
        WRONG_EMAIL: 'Falsche E-Mail',
        LINK_BETWEEN_COUPLE: 'zwischen einem Paar von',
        LINK_BETWEEN_ALL: 'unter allen',
//        LINK_DELETE_ALL_GROUPE: 'unter allen',
        CLIENT_SEX: 'Paul',
        CLIENT_SEX_M: 'M',
        CLIENT_SEX_F: 'F',
        CLIENT_AGE: 'Alter',
        CLIENT_AGE_OLDER: "älteren",
        //CLIENT_EDUCATION: 'Bildung',
        //CLIENT_EDUC_MIDLE: "Durchschnitt",
        //CLIENT_EDUC_SPEC: "die durchschnittliche professionell.",
        //CLIENT_EDUC_HIGH: "Higher",
        CLIENT_EDUCATION: "Das wichtigste Kriterium Ihrer Wahl",
        CLIENT_EDUC_MIDLE: "Guter Preis",
        CLIENT_EDUC_SPEC: "Bildermacher",
        CLIENT_EDUC_HIGH: "Markenprofil und Hardware",
        CLIENT_EDUC_4: 'Empfehlungen Verkäufers',
        CLIENT_OCCUPATION: "Beschäftigung",
        CLIENT_OCCUP_WORKER: "Mitarbeiter",
        CLIENT_OCCUP_HOUSE: "Hausfrau",
        CLIENT_OCCUP_BOSS: "Entrepreneur",
        CLIENT_OCCUP_STUD: 'Student',
        CLIENT_OCCUP_PENSION: 'Retired',
        CLIENT_INFO_SOURCE: 'Source',
        CLIENT_INFO_PRESS: 'Press',
        CLIENT_INFO_FRIEND: "Von Freunden",
        CLIENT_INFO_ADV: "Visuelle Werbung",
        SELECT_PLACEHOLD: 'wählen Sie Ihre Variante',
        //SELECT_AGE: "Wählen Sie Ihr Alter",
        //SELECT_ADUCATION: "Wählen Sie Ihre Bildung",
        //SELECT_OCCUPATION: "Wählen Sie Ihre Beschäftigung",
        //SELECT_INFO_SOURCE: "Quelle wählen",
        NO_DISASSEMBL: 'Ohne Demontage',
        STANDART_ASSEMBL: 'Der Standardmäßige',
        VIP_ASSEMBL: 'Der VIP-Montage',
        DISCOUNT: 'Rabatt',
        DISCOUNT_SELECT: 'Die Auswahl der Preisnachlässe',
        DISCOUNT_WITH: 'Im Hinblick auf die Preisnachlässe',
        DISCOUNT_WITHOUT: 'Ohne Rabatte',
        DISCOUNT_WINDOW: 'Rabatt auf ein Produkt',
        DISCOUNT_ADDELEM: 'Discount auf zusätzliche Elemente',
        ORDER_COMMENT: 'Anmerkung Bestellen',
        UNKNOWN: 'unbekannt'
      },
      settings: {
        AUTHORIZATION: 'Autorisierung:',
        CHANGE_PASSWORD: 'Kennwort ändern',
        CHANGE_LANGUAGE: 'ändern Sie die Sprache',
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