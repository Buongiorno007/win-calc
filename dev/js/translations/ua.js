(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('ukrainianDictionary', {

      common_words: {
        CHANGE: 'Змінити',
        MONTHS: 'Січень, Лютий, Березень, Квітень, Травень, Червень, Липень, Серпень, Вересень, Жовтень, Листопад, Грудень',
        MONTHS_SHOT: 'Січ, Лют, Бер, Квіт, Трав, Черв, Лип, Серп, Вер, Жовт, Лист, Груд',
        MONTHA: 'Січня, Лютого, Березня, Квітня, Травня, Червня, Липня, Серпня, Вересня, Жовтня, Листопада, Грудня',
        MONTH_LABEL: 'місяць',
        MONTHA_LABEL: 'місяця',
        MONTHS_LABEL: 'місяців',
        ALL: 'Все',
        MIN: 'мін.',
        MAX: 'макс.',
        //----- confirm dialogs
        BUTTON_Y: 'ТАК',
        BUTTON_N: 'НІ',
        BUTTON_C: 'Копіювати',
        BUTTON_E: 'Вставити',
        DELETE_PRODUCT_TITLE: 'Видалення!',
        ﻿COPY_ORDER_TXT: 'Що необхідно зробити?',
        DELETE_PRODUCT_TXT: 'Хочете видалити продукт?',
        DELETE_ORDER_TITLE: 'Видалення замовлення!',
        DELETE_ORDER_TXT: 'Хочете видалити замовлення?',
        COPY_ORDER_TITLE: 'Копіювання!',
        COPY_ORDER_TXT: 'Хочете зробити копію замовлення?',
        SEND_ORDER_TITLE: 'На виробництво!',
        SEND_ORDER_TXT: 'Хочете відправити замовлення на завод?',
        NEW_TEMPLATE_TITLE: 'Зміна шаблона',
        TEMPLATE_CHANGES_LOST: 'Зміни у шаблоні будуть загублені. Продовжити?',
        PAGE_REFRESH: 'Перезагрузка страницы приведет к потерю данных!',
        SELECT: 'Выбрать',
        AND: 'та',
        OK: 'OK',
        BACK: 'Назад',
        LETTER_M: 'м'
      },
      login: {
        ENTER: 'Увійти',
        PASS_CODE: 'Повідомте цей код менеджерові.',
        YOUR_CODE: 'Ваш код: ',
        EMPTY_FIELD: 'Заповніть це поле.',
        WRONG_LOGIN: 'Для логина (пароля) используйте только цифры, латинские буквы и символы "@" , "." , "-" , "_" .',
        //WRONG_NUMBER: 'Невірний номер.',
        SHORT_NAME: 'Слишком маленькое имя.',
        //SHORT_PASSWORD: 'Занадто маленький пароль.',
        //SHORT_PHONE: 'Занадто маленький номер телефона.',
        IMPORT_DB_START: 'Подождите, началась загрузка базы данных',
        IMPORT_DB_FINISH: 'Спасибо, загрузка завершена',
        LOGIN: 'Логин',
        PASSWORD: 'Пароль',
        MOBILE: 'Мобільный телефон',
        REGISTRATION: 'Регістрація',
        SELECT_COUNTRY: 'Веберите страну',
        SELECT_REGION: 'Выберите регион',
        SELECT_CITY: 'Выберите город',
        USER_EXIST: 'Такой пользователь уже существует! Попробуйте еще раз.',
        USER_NOT_EXIST: 'Такой пользователь не существует. Зарегистрируйтесь.',
        USER_NOT_ACTIVE: 'Вы не активировали Ваш профиль. Проверьте Вашу почту.',
        USER_CHECK_EMAIL: 'Подтвердительное письмо было отправлено Вам на почту.',
        SELECT_PRODUCER: 'Выберите производителя',
        SELECT_FACTORY: 'Вы не выбрали производителя',
        USER_PASSWORD_ERROR: 'Неверный пароль!',
        OFFLINE: 'Нема зв`язку з iнтернетом!',
        IMPORT_DB: 'Почалась загрузка Баз данних! Почекайте будь ласка!'
      },
      mainpage: {
        MM: ' мм ',
        CLIMATE_ZONE: 'кліматична зона',
        THERMAL_RESISTANCE: 'теплопередачa',
        AIR_CIRCULATION: 'коефіцієнт повітрообміну',
        NAVMENU_GEOLOCATION: 'Вибрати розташування',
        NAVMENU_CURRENT_GEOLOCATION: 'Поточне розташування',
        NAVMENU_CURRENT_CALCULATION: 'Поточний розрахунок',
        NAVMENU_CART: 'Кошик розрахунку',
        NAVMENU_ADD_ELEMENTS: 'Дод. елементи',
        NAVMENU_ALL_CALCULATIONS: 'Історія замовлень',
        NAVMENU_SETTINGS: 'Налаштування',
        NAVMENU_MORE_INFO: 'Більше інформації',
        NAVMENU_VOICE_HELPER: 'Голосове управління',
        NAVMENU_CALCULATIONS: 'Розрахунки',
        NAVMENU_APPENDIX: 'Додаток',
        NAVMENU_NEW_CALC: '+Новий розрахунок',
        CONFIGMENU_CONFIGURATION: 'Конфігурація і розміри',
        CONFIGMENU_SIZING: 'ширина * висота -',
        CONFIGMENU_PROFILE: 'Профіль',
        CONFIGMENU_GLASS: 'Склопакет',
        CONFIGMENU_HARDWARE: 'Фурнітура',
        CONFIGMENU_LAMINATION: 'Ламінація',
        CONFIGMENU_LAMINATION_TYPE: 'в кімнаті / фасад',
        WHITE_LAMINATION: 'Біла',
        CONFIGMENU_ADDITIONAL: 'Додатково',
        CONFIGMENU_IN_CART: 'В кошик',
        VOICE_SPEACH: 'Говоріть...',
        COMMENT: 'Залиште свою замітку про заказ тут.',
        ROOM_SELECTION: 'Вибір шаблону',
        CONFIGMENU_NO_ADDELEMENTS: 'Дод.елементи не вибранi',
        HEATCOEF_VAL: 'Вт',
        TEMPLATE_TIP: 'Для зміни розмірів натисніть сюди',
        PROFILE_TIP: 'Для вибору профілю натисніть сюди',
        GLASS_TIP: 'Для вибору склопакета натисніть сюди',
        SELECT_ALL: 'Вибрати все',
        SELECT_GLASS_WARN: 'Натисніть на склопакет, який хочете змінити'
      },
      panels: {
        TEMPLATE_WINDOW: 'Вікно',
        TEMPLATE_BALCONY: 'Балкон',
        TEMPLATE_DOOR: 'Двері',
        TEMPLATE_BALCONY_ENTER: 'Вихід на балкон',
        TEMPLATE_EDIT: 'Редагувати',
        TEMPLATE_DEFAULT: 'Проект за умовчанням',
        COUNTRY: 'країна',
        BRAND: 'торгова марка',
        HEAT_INSULATION: 'теплоізоляція',
        NOICE_INSULATION: 'шумоізоляція',
        CORROSION_COEFF: 'aнтикорозійність',
        BURGLAR_COEFF: 'протизламність',
        LAMINAT_INSIDE: 'в кімнаті',
        LAMINAT_OUTSIDE: 'фасад',
        ONE_WINDOW_TYPE: 'Одностворчатое',
        TWO_WINDOW_TYPE: 'Двухстворчатое',
        THREE_WINDOW_TYPE: 'Трехстворчатое',
        CAMERa: 'камера',
        CAMER: 'камеры',
        CAMERs: 'камер',
        ENERGY_SAVE: '+энергосбережение',
        DOOR_TYPE1: 'по периметру',
        DOOR_TYPE2: 'без порога',
        DOOR_TYPE3: 'алюминевый порог, тип1',
        DOOR_TYPE4: 'алюминевый порог, тип2',
        HANDLE_TYPE1: 'нажимной гарнитур',
        HANDLE_TYPE2: 'стандартная офисная ручка',
        LOCK_TYPE1: 'однозапорный с защелкой',
        LOCK_TYPE2: 'многозапорный с защелкой',
        EXTRA_GLASS1: "Нет возможности установки стеклопакета ",
        EXTRA_GLASS2: " для данной конфигурации конструкции"
      },
      add_elements: {
        CHOOSE: 'Вибрати',
        ADD: 'Додати',
        GRID: 'москітна сітка',
        VISOR: 'Козирок',
        SPILLWAY: 'водовідлив',
        OUTSIDE: 'зовнішні укоси',
        LOUVERS: 'жалюзі',
        INSIDE: 'внутрішні укоси',
        CONNECTORS: 'з`єднувач',
        FAN: 'мікропровітрювання',
        WINDOWSILL: 'підвіконня',
        HANDLEL: 'ручка',
        OTHERS: 'інше',
        GRIDS: 'москітні сітки',
        INSIDES: 'Внутрішні',
        OUTSIDES: 'Зовнішні',
        SHUTTERS: 'Роллети',
        BLIND: 'Віконниці',
        GRATING: "Зовнішня палітурка",
        SPILLWAYS: 'Водовідливи',
        COMPONENTS: 'Компоненти',
        WINDOWSILL: 'windowsill',
        VISORS: 'козирки',
        SPILLWAYS: 'водовідливи',
        WINDOWSILLS: 'підвіконня',
        HANDLELS: 'ручки',
        NAME_LABEL: 'найменування',
        ARTICUL_LABEL: 'aртикул',
        QTY_LABEL: 'шт.',
        SIZE_LABEL: 'розмір',
        WIDTH_LABEL: 'ширина',
        HEIGHT_LABEL: 'висота',
        OTHER_ELEMENTS1: 'Ще',
        OTHER_ELEMENTS2: 'компонента...',
        SCHEME_VIEW: 'Схематично',
        LIST_VIEW: 'Cписок',
        INPUT_ADD_ELEMENT: 'Додати компонент',
        CANCEL: 'Відміна',
        TOTAL_PRICE_TXT: 'Разом додаткових компонентів на суму:',
        ELEMENTS: 'компонентів',
        ELEMENT: 'компонент',
        ELEMENTA: 'компонента'
      },
      add_elements_menu: {
        TIP: 'Виберіть елемент зі списку',
        EMPTY_ELEMENT: 'Без элементу',
        TAB_NAME_SIMPLE_FRAME: 'Проста конструкція',
        TAB_NAME_HARD_FRAME: 'Складена конструкція',
        TAB_EMPTY_EXPLAIN: 'Виберіть зі списку перший елемент, щоб почати складати конструкцію.'
      },
      design: {
        SASH_SHAPE: 'стулки',
        ANGEL_SHAPE: 'кути',
        IMPOST_SHAPE: 'імпости',
        ARCH_SHAPE: 'арки',
        POSITION_SHAPE: 'позиція',
        UNITS_DESCRIP: 'Як одиниці виміру використовуються міліметри',
        PROJECT_DEFAULT: 'Проект за умовчанням',
        DOOR_CONFIG_LABEL: 'конфігурація дверей',
        DOOR_CONFIG_DESCTIPT: 'рама дверей',
        SASH_CONFIG_DESCTIPT: 'стулка дверей',
        HANDLE_CONFIG_DESCTIPT: 'ручка',
        LOCK_CONFIG_DESCTIPT: 'замок',
        STEP: 'крок',
        LABEL_DOOR_TYPE: 'Виберіть конструкцію рами дверей',
        LABEL_SASH_TYPE: 'Виберіть тип стулки дверей',
        LABEL_HANDLE_TYPE: 'Виберіть тип ручки',
        LABEL_LOCK_TYPE: 'Виберіть тип замка',
        VOICE_SWITCH_ON: "голосовий режим включен",
        VOICE_NOT_UNDERSTAND: 'Не зрозуміло',
        VOICE_SMALLEST_SIZE: 'замалий розмір',
        VOICE_BIGGEST_SIZE: "завеликий розмір",
        VOICE_SMALL_GLASS_BLOCK: "слишком маленький световой проем",
        SQUARE_EXTRA: "Площадь конструкции превышает допустимую",
        DIM_EXTRA: "Габаритный размер конструкции превышает допустимый",
        NOT_AVAILABLE: 'Недоступно!',
        TEST_STAGE: "Находится в стадии тестирования",
        GLASS: "Стеклопакет",
        GLASS_SIZE: "размером",
        NO_MATCH_RANGE: "не соответствует допустимому диапазону",
        BY_WIDTH: "по ширине",
        BY_HEIGHT: "по высоте",
        GLASS_SQUARE: "с площадью",
        MAX_VALUE_HIGHER: "перевышает допустимое максимальное значение",
        EXTRA_SASH: "Текущий размер створки по фальцу",
        CHANGE_SIZE: "Для сохранения конструкции измените размеры.",
        DOOR_ERROR: "Системы входных дверей не настроены"
      },
      history: {
        SEARCH_PLACEHOLDER: 'Пошук за ключовими словами',
        DRAFT_VIEW: 'Чернетки розрахунків',
        HISTORY_VIEW: 'Історія розрахунків',
        PHONE: 'телефон',
        CLIENT: 'клієнт',
        ADDRESS: 'адреса',
        FROM: 'від ',
        UNTIL: 'до ',
        PAYMENTS: 'платежів по',
        ALLPRODUCTS: 'виробів',
        ON: 'на',
        DRAFT: 'Чернетка',
        DATE_RANGE: 'Діапазон дат',
        ALL_TIME: 'За весь час',
        SORTING: 'Сортування',
        NEWEST_FIRST: 'За часом: нові на початку',
        NEWEST_LAST: 'За часом: нові у кінці',
        SORT_BY_TYPE: 'По типах',
        SORT_SHOW: 'Показати',
        SORT_SHOW_ACTIVE: 'Тільки активні',
        SORT_SHOW_WAIT: 'Тільки в очікуванні',
        SORT_SHOW_DONE: 'Тільки завершені',
        BY_YOUR_REQUEST: 'По вашому запиту',
        NOT_FIND: 'нічого не знайдено',
        WAIT_MASTER: 'очікує замірювача',
        INCLUDED: 'включені',
        NO_PRINT: "Вывод спецификации невозможен ввиду отсутствия интернет-соединения"
      },
      cart: {
        ALL_ADD_ELEMENTS: 'Всі дод.елементи замовлення',
        ADD_ORDER: 'Додати виріб',
        PRODUCT_QTY: 'кількість виробів',
        LIGHT_VIEW: 'Скорочений вид',
        FULL_VIEW: 'Повний вид',
        DELIVERY: 'Доставка',
        SELF_EXPORT: 'самовивезення',
        FLOOR: 'поверх',
        ASSEMBLING: 'Монтаж',
        WITHOUT_ASSEMBLING: 'без монтажу',
        FREE: 'безкоштовно',
        PAYMENT_BY_INSTALMENTS: 'Розстрочка',
        WITHOUT_INSTALMENTS: 'без розстрочки',
        DELIVERY_DATE: 'Дата постачання',
        TOTAL_PRICE_LABEL: 'Разом при постачанні на',
        MONTHLY_PAYMENT_LABEL: 'щомісячних платежів по',
        DATE_DELIVERY_LABEL: 'при постачанні на',
        FIRST_PAYMENT_LABEL: 'Перший платіж',
        ORDER: 'Замовити',
        MEASURE: 'Заміряти',
        READY: 'Готово',
        CALL_MASTER: 'Виклик замірювача для розрахунку',
        CALL_MASTER_DESCRIP: 'Для виклику замірювача нам потрібно дещо про вас знати. Обидва поля є обов`язковими для заповнення.',
        CLIENT_LOCATION: 'Місце розташування',
        CLIENT_ADDRESS: "Адреса",
        CLIENT_HOUSE: "Буд",
        CLIENT_FLAT: "Кв",
        CLIENT_FLOOR: "Пов",
        CALL_ORDER: 'Оформлення замовлення для розрахунку',
        CALL_ORDER_DESCRIP: 'Для того, щоб виконати замовлення, ми повинні дещо про вас знати.',
        CALL_ORDER_CLIENT_INFO: 'Інформація про клієнта (заповнюйте обов`язково):',
        CLIENT_NAME: 'Прізвище Ім`я По батькові',
        CALL_ORDER_DELIVERY: 'Доставити замовлення на',
        CALL_ORDER_TOTAL_PRICE: 'Загалом',
        CALL_ORDER_ADD_INFO: 'Додатково:',
        CLIENT_EMAIL_ORDER: 'Електронна пошта для отримання специфiкацii',
        CLIENT_EMAIL: 'Електронна пошта',
        ADD_PHONE: 'Додатковий телефон',
        CALL_CREDIT: 'Оформлення розстрочки і замовлення для розрахунку',
        CALL_CREDIT_DESCRIP: 'Для того, щоб оформити розстрочку і виконати замовлення, ми повинні дещо про вас знати.',
        CALL_CREDIT_CLIENT_INFO: 'Розстрочка:',
        CREDIT_TARGET: 'Мета оформлення розстрочки',
        CLIENT_ITN: 'Індивідуальний податковий номер',
        CALL_START_TIME: 'Дзвонити від:',
        CALL_END_TIME: 'до:',
        CALL_CREDIT_PARTIAL_PRICE: 'по',
        ADDELEMENTS_EDIT_LIST: 'Редагувати список ...',
        ADDELEMENTS_PRODUCT_COST: 'в одному виробі',
        HEAT_TRANSFER: 'теплопередача',
        WRONG_EMAIL: 'Невірна електронна пошта',
        LINK_BETWEEN_COUPLE: 'між парою',
        LINK_BETWEEN_ALL: 'між усіма',
//        LINK_DELETE_ALL_GROUPE: 'видалити усі',
        CLIENT_SEX: 'Стать',
        CLIENT_SEX_M: 'Ч',
        CLIENT_SEX_F: 'Ж',
        CLIENT_AGE: 'Вік',
        CLIENT_AGE_OLDER: 'старше 61',
        //CLIENT_EDUCATION: 'Освіта',
        //CLIENT_EDUC_MIDLE: 'середнэ',
        //CLIENT_EDUC_SPEC: 'середнэ спец.',
        //CLIENT_EDUC_HIGH: 'вища',
        CLIENT_EDUCATION: 'Головний критерій вашого вибору',
        CLIENT_EDUC_MIDLE: 'Вигідна ціна',
        CLIENT_EDUC_SPEC: 'Імідж виробника',
        CLIENT_EDUC_HIGH: 'Бренд профілю або фурнітури',
        CLIENT_EDUC_4: 'Рекомендації продавця',
        CLIENT_OCCUPATION: 'Зайнятість',
        CLIENT_OCCUP_WORKER: 'Службовець',
        CLIENT_OCCUP_HOUSE: 'Домогосподарка',
        CLIENT_OCCUP_BOSS: 'Підприэмиць',
        CLIENT_OCCUP_STUD: 'Студент',
        CLIENT_OCCUP_PENSION: 'Пенсіонер',
        CLIENT_INFO_SOURCE: 'Джерело информаціі',
        CLIENT_INFO_PRESS: 'Преса',
        CLIENT_INFO_FRIEND: 'Від знайомих',
        CLIENT_INFO_ADV: 'Візуальна реклама',
        SELECT_PLACEHOLD: 'выберите свой вариант',
        //SELECT_AGE: 'Выберите Ваш возраст',
        //SELECT_ADUCATION: 'Выберите Ваше образование',
        //SELECT_OCCUPATION: 'Выберите Вашу занятость',
        //SELECT_INFO_SOURCE: 'Выберите источник информации',
        NO_DISASSEMBL: 'без демонтажа',
        STANDART_ASSEMBL: 'стандартный',
        VIP_ASSEMBL: 'VIP-монтаж',
        DISCOUNT: 'Знижка',
        DISCOUNT_SELECT: 'Вибір знижки',
        DISCOUNT_WITH: 'Зі знижкою',
        DISCOUNT_WITHOUT: 'Без знижки',
        DISCOUNT_WINDOW: 'Знижка на виріб',
        DISCOUNT_ADDELEM: 'Знижка на додаткові елементи',
        ORDER_COMMENT: 'Заметка о заказе',
        UNKNOWN: 'Не известно'
      },
      settings: {
        AUTHORIZATION: 'Авторизація:',
        CHANGE_PASSWORD: 'Змінити пароль',
        CHANGE_LANGUAGE: 'Змінити мову',
        PRIVATE_INFO: 'Особиста інформація:',
        USER_NAME: 'Контактна особа',
        CITY: 'Місто',
        ADD_PHONES: 'Додаткові телефони:',
        INSERT_PHONE: 'Додати телефон',
        CLIENT_SUPPORT: 'Підтримка користувачів',
        LOGOUT: 'Вийти з додатка',
        SAVE: 'Зберегти',
        CURRENT_PASSWORD: 'Поточний',
        NEW_PASSWORD: 'Новий',
        CONFIRM_PASSWORD: 'Підтвердити',
        NO_CONFIRM_PASS: 'Невірний пароль'
      }

    });

})();