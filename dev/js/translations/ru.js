(function(){
  'use strict';

  angular
    .module('BauVoiceApp')
    .constant('russianDictionary', {

      common_words: {
        CHANGE: 'Изменить',
        MONTHS: 'Январь, Февраль, Март, Апрель, Май, Июнь, Июль, Август, Сентябрь, Октябрь, Ноябрь, Декабрь',
        MONTHS_SHOT: 'Янв, Февр, Март, Апр, Май, Июнь, Июль, Авг, Сент, Окт, Ноя, Дек',
        MONTHA: 'Января, Февраля, Марта, Апреля, Мая, Июня, Июля, Августа, Сентября, Октября, Ноября, Декабря',
        MONTH_LABEL: 'месяц',
        MONTHA_LABEL: 'месяца',
        MONTHS_LABEL: 'месяцeв',
        ALL: 'Все',
        MIN: 'мин.',
        MAX: 'макс.',
        //----- confirm dialogs
        BUTTON_Y: 'ДА',
        BUTTON_N: 'НЕТ',
        DELETE_PRODUCT_TITLE: 'Удаление!',
        DELETE_PRODUCT_TXT: 'Хотите удалить продукт?',
        DELETE_ORDER_TITLE: 'Удаление заказа!',
        DELETE_ORDER_TXT: 'Хотите удалить заказ?',
        COPY_ORDER_TITLE: 'Копирование!',
        COPY_ORDER_TXT: 'Хотите сделать копию заказа?',
        SEND_ORDER_TITLE: 'В производство!',
        SEND_ORDER_TXT: 'Хотите отправить заказ на завод?',
        NEW_TEMPLATE_TITLE: 'Изменение шаблона',
        TEMPLATE_CHANGES_LOST: 'Изменения в шаблоне будут потеряны! Продолжить?',
        SELECT: 'Выбрать'
      },
      login: {
        ENTER: 'Войти',
        PASS_CODE: 'Сообщите этот код менеджеру.',
        YOUR_CODE: 'Ваш код: ',
        EMPTY_FIELD: 'Заполните это поле.',
        WRONG_NUMBER: 'Неверный номер.',
        SHORT_NAME: 'Слишком маленькое имя.',
        SHORT_PASSWORD: 'Слишком маленький пароль.',
        SHORT_PHONE: 'Слишком маленький номер телефона.',
        IMPORT_DB_START: 'Подождите, началась загрузка базы данных',
        IMPORT_DB_FINISH: 'Спасибо, загрузка завершена',
        MOBILE: 'Мобильный телефон',
        PASSWORD: 'Пароль',
        REGISTRATION: 'Регистрация',
        SELECT_COUNTRY: 'Веберите страну',
        SELECT_REGION: 'Выберите регион',
        SELECT_CITY: 'Выберите город',
        USER_EXIST: 'Такой пользователь уже существует! Попробуйте еще раз.',
        USER_NOT_EXIST: 'Такой пользователь не существует. Зарегистрируйтесь.',
        USER_NOT_ACTIVE: 'Вы не активировали Ваш профиль. Проверьте Вашу почту.',
        USER_CHECK_EMAIL: 'Подтвердительное письмо было отправлено Вам на почту.',
        SELECT_PRODUCER: 'Выберите производителя',
        SELECT_FACTORY: 'Вы не выбрали производителя',
        USER_PASSWORD_ERROR: 'Неверный пароль!'
      },
      mainpage: {
        MM: ' мм ',
        CLIMATE_ZONE: 'климатическая зона',
        THERMAL_RESISTANCE: 'сопротивление теплопередаче',
        AIR_CIRCULATION: 'коэффициент воздухообмена',
        ROOM_KITCHEN: 'Кухня',
        ROOM_LIVINGROOM: 'Гостиная',
        ROOM_BALCONY: 'Балкон',
        ROOM_CHILDROOM: 'Детская',
        ROOM_BEDROOM: 'Спальня',
        ROOM_DOOR: 'Вход',
        NAVMENU_GEOLOCATION: 'Выбрать расположение',
        NAVMENU_CURRENT_GEOLOCATION: 'Текущее расположение',
        NAVMENU_CURRENT_CALCULATION: 'Текущий расчет',
        NAVMENU_CART: 'Корзина расчета',
        NAVMENU_ADD_ELEMENTS: 'Доп. элементы',
        NAVMENU_ALL_CALCULATIONS: 'Все расчеты',
        NAVMENU_SETTINGS: 'Настройки',
        NAVMENU_MORE_INFO: 'Больше информации',
        NAVMENU_VOICE_HELPER: 'Голосовой помошник',
        NAVMENU_CALCULATIONS: 'Расчеты',
        NAVMENU_APPENDIX: 'Приложение',
        NAVMENU_NEW_CALC: '+ Новый расчет',
        CONFIGMENU_CONFIGURATION: 'Конфигурация и размеры',
        CONFIGMENU_SIZING: 'ширина * высота',
        CONFIGMENU_PROFILE: 'Профиль',
        CONFIGMENU_GLASS: 'Стеклопакет',
        CONFIGMENU_HARDWARE: 'Фурнитура',
        CONFIGMENU_LAMINATION: 'Ламинация',
        CONFIGMENU_LAMINATION_TYPE: 'фасад / в комнате',
        CONFIGMENU_ADDITIONAL: 'Дополнительно',
        CONFIGMENU_IN_CART: 'В корзину',
        VOICE_SPEACH: 'Говорите...',
        COMMENT: 'Оставьте свою заметку о заказе здесь.',
        ROOM_SELECTION: 'Выбор интерьера'
      },
      panels: {
        TEMPLATE_WINDOW: 'Oкно',
        TEMPLATE_BALCONY: 'Балкон',
        TEMPLATE_DOOR: 'Дверь',
        TEMPLATE_BALCONY_ENTER: 'Выход на балкон',
        TEMPLATE_EDIT: 'Редактировать',
        TEMPLATE_DEFAULT: 'Проект по умолчанию',
        COUNTRY: 'страна',
        BRAND: 'торговая марка',
        HEAT_INSULATION: 'теплоизоляция',
        NOICE_INSULATION: 'шумоизоляция',
        LAMINAT_INSIDE: 'Ламинация рамы в комнате',
        LAMINAT_OUTSIDE: 'Ламинация со стороны фасада',
        LAMINAT_WHITE: 'без ламинации, радикальный белый цвет'
      },
      add_elements: {
        CHOOSE: 'Выбрать',
        ADD: 'Добавить',

        GRID: 'москитная сетка',
        VISOR: 'козырек',
        SPILLWAY: 'водоотлив',
        OUTSIDE: 'наружные откосы',
        LOUVERS: 'жалюзи',
        INSIDE: 'внутренние откосы',
        CONNECTORS: 'соединитель',
        FAN: 'микропроветривание',
        WINDOWSILL: 'подоконник',
        HANDLEL: 'ручка',
        OTHERS: 'прочее',
        GRIDS: 'москитные сетки',
        VISORS: 'козырьки',
        SPILLWAYS: 'водоотливы',
        WINDOWSILLS: 'подоконники',
        HANDLELS: 'ручки',
        NAME_LABEL: 'наименование',
        QTY_LABEL: 'шт.',
        SIZE_LABEL: 'размер',
        WIDTH_LABEL: 'ширина',
        HEIGHT_LABEL: 'высота',
        COLOR_LABEL: 'цвет',
        OTHER_ELEMENTS1: 'Еще',
        OTHER_ELEMENTS2: 'компонента...',
        SCHEME_VIEW: 'Схематически',
        LIST_VIEW: 'Cписок',
        INPUT_ADD_ELEMENT: 'Добавить компонент',
        CANCEL: 'Отмена',
        TOTAL_PRICE_TXT: 'Итого дополнительных компонентов на сумму:',
        ELEMENTS: 'компонентов',
        ELEMENT: 'компонент',
        ELEMENTA: 'компонента'
      },
      add_elements_menu: {
        TIP: 'Выберите элемент из списка',
        EMPTY_ELEMENT: 'Без элемента',
        COLOR_AVAILABLE: 'Доступные цвета:',
        TAB_NAME_SIMPLE_FRAME: 'Простая конструкция',
        TAB_NAME_HARD_FRAME: 'Составная конструкция',
        TAB_EMPTY_EXPLAIN: 'Выберите из списка первый элемент, чтобы начать составлять конструкцию.'
      },
      construction: {
        SASH_SHAPE: 'створки',
        ANGEL_SHAPE: 'углы',
        IMPOST_SHAPE: 'импосты',
        ARCH_SHAPE: 'арки',
        POSITION_SHAPE: 'позиция',
        UNITS_DESCRIP: 'В качестве единиц измерения используются миллиметры',
        PROJECT_DEFAULT: 'Проект по умолчанию',
        DOOR_CONFIG_LABEL: 'конфигурация двери',
        DOOR_CONFIG_DESCTIPT: 'рама двери',
        SASH_CONFIG_DESCTIPT: 'створка двери',
        HANDLE_CONFIG_DESCTIPT: 'ручка',
        LOCK_CONFIG_DESCTIPT: 'замок',
        STEP: 'шаг',
        LABEL_DOOR_TYPE: 'Выберите конструкцию рамы двери',
        LABEL_SASH_TYPE: 'Выберите тип створки двери',
        LABEL_HANDLE_TYPE: 'Выберите тип ручки',
        LABEL_LOCK_TYPE: 'Выберите тип замка',
        VOICE_SWITCH_ON: "голосовой режим включен",
        VOICE_NOT_UNDERSTAND: 'Не понятно',
        VOICE_SMALLEST_SIZE: 'слишком маленький размер',
        VOICE_BIGGEST_SIZE: "слишком большой размер",
        VOICE_SMALL_GLASS_BLOCK: "слишком маленький световой проем"
      },
      history: {
        SEARCH_PLACEHOLDER: 'Поиск по ключевым словам',
        DRAFT_VIEW: 'Черновики расчетов',
        HISTORY_VIEW: 'История расчетов',
        PHONE: 'телефон',
        CLIENT: 'клиент',
        ADDRESS: 'адрес',
        FROM: 'от ',
        UNTIL: 'до ',
        PAYMENTS: 'платежей по',
        ALLPRODUCTS: 'изделий',
        ON: 'на',
        DRAFT: 'Черновик',
        DATE_RANGE: 'Диапазон дат',
        ALL_TIME: 'За все время',
        SORTING: 'Сортировка',
        NEWEST_FIRST: 'По времени: новые в начале',
        NEWEST_LAST: 'По времени: новые в конце',
        SORT_BY_TYPE: 'По типам',
        SORT_SHOW: 'Показать',
        SORT_SHOW_ACTIVE: 'Только активные',
        SORT_SHOW_WAIT: 'Только в ожидании',
        SORT_SHOW_DONE: 'Только завершенные',
        BY_YOUR_REQUEST: 'По вашему запросу',
        NOT_FIND: 'ничего не найдено',
        WAIT_MASTER: 'ожидает замерщика'
      },
      cart: {
        ALL_ADD_ELEMENTS: 'Все доп.элементы заказа',
        ADD_ORDER: 'Добавить изделие',
        PRODUCT_QTY: 'количество изделий',
        LIGHT_VIEW: 'Сокращенный вид',
        FULL_VIEW: 'Полный вид',
        DELIVERY: 'Доставка',
        SELF_EXPORT: 'самовывоз',
        FLOOR: 'этаж',
        ASSEMBLING: 'Монтаж',
        WITHOUT_ASSEMBLING: 'без монтажа',
        FREE: 'бесплатно',
        PAYMENT_BY_INSTALMENTS: 'Рассрочка',
        WITHOUT_INSTALMENTS: 'без рассрочки',
        DELIVERY_DATE: 'Дата поставки',
        TOTAL_PRICE_LABEL: 'Итого при поставке на',
        MONTHLY_PAYMENT_LABEL: 'ежемесячных платежа по',
        DATE_DELIVERY_LABEL: 'при поставке на',
        FIRST_PAYMENT_LABEL: 'Первый платеж',
        ORDER: 'Заказать',
        MEASURE: 'Замерить',
        READY: 'Готово',
        CALL_MASTER: 'Вызов замерщика для рассчета',
        CALL_MASTER_DESCRIP: 'Для вызова замерщика нам нужно кое-что о вас знать. Оба поля являются обязательными для заполнения.',
        CLIENT_LOCATION: 'Местоположение',
        CLIENT_ADDRESS: 'Адрес',
        CALL_ORDER: 'Оформление заказа для рассчета',
        CALL_ORDER_DESCRIP: 'Для того, чтобы выполнить заказ, мы должны кое-что о вас знать.',
        CALL_ORDER_CLIENT_INFO: 'Информация о клиенте (заполняйте обязательно):',
        CLIENT_NAME: 'Фамилия Имя Отчество',
        CALL_ORDER_DELIVERY: 'Доставить заказ на',
        CALL_ORDER_TOTAL_PRICE: 'Всего',
        CALL_ORDER_ADD_INFO: 'Дополнительно (заполняйте по желанию):',
        CLIENT_EMAIL: 'Электронная почта',
        ADD_PHONE: 'Дополнительный телефон',
        CALL_CREDIT: 'Оформление рассрочки и заказа для рассчета',
        CALL_CREDIT_DESCRIP: 'Для того, чтобы оформить рассрочку и выполнить заказ, мы должны кое-что о вас знать.',
        CALL_CREDIT_CLIENT_INFO: 'Рассрочка:',
        CREDIT_TARGET: 'Цель оформления рассрочки',
        CLIENT_ITN: 'Индивидуальный налоговый номер',
        CALL_START_TIME: 'Звонить от:',
        CALL_END_TIME: 'до:',
        CALL_CREDIT_PARTIAL_PRICE: 'по',
        ADDELEMENTS_EDIT_LIST: 'Редактировать список',
        ADDELEMENTS_PRODUCT_COST: 'в одном изделии',
        HEAT_TRANSFER: 'теплопередача',
        WRONG_EMAIL: 'Неверная электронная почта',
        LINK_BETWEEN_COUPLE: 'между парой',
        LINK_BETWEEN_ALL: 'между всеми',
        LINK_DELETE_ALL_GROUPE: 'удалить все',
        CLIENT_SEX: 'Пол',
        CLIENT_SEX_M: 'M',
        CLIENT_SEX_F: 'Ж',
        CLIENT_AGE: 'Возраст',
        CLIENT_AGE_OLDER: 'старше',
        CLIENT_EDUCATION: 'Образование',
        CLIENT_EDUC_MIDLE: 'среднее',
        CLIENT_EDUC_SPEC: 'среднее спец.',
        CLIENT_EDUC_HIGH: 'высшее',
        CLIENT_OCCUPATION: 'Занятость',
        CLIENT_OCCUP_WORKER: 'Служащий',
        CLIENT_OCCUP_HOUSE: 'Домохозяйка',
        CLIENT_OCCUP_BOSS: 'Предприниматель',
        CLIENT_OCCUP_STUD: 'Студент',
        CLIENT_OCCUP_PENSION: 'Пенсионер',
        CLIENT_INFO_SOURCE: 'Источник информации',
        CLIENT_INFO_PRESS: 'Пресса',
        CLIENT_INFO_FRIEND: 'От знакомых',
        CLIENT_INFO_ADV: 'Визуальная реклама',
        SELECT_AGE: 'Выберите Ваш возраст',
        SELECT_ADUCATION: 'Выберите Ваше образование',
        SELECT_OCCUPATION: 'Выберите Вашу занятость',
        SELECT_INFO_SOURCE: 'Выберите источник информации'
      },
      settings: {
        AUTHORIZATION: 'Авторизация:',
        CHANGE_PASSWORD: 'Изменить пароль',
        CHANGE_LANGUAGE: 'Изменить язык',
        PRIVATE_INFO: 'Личная информация:',
        USER_NAME: 'Контактное лицо',
        CITY: 'Город',
        ADD_PHONES: 'Дополнительные телефоны:',
        INSERT_PHONE: 'Добавить телефон',
        CLIENT_SUPPORT: 'Подержка пользователей',
        LOGOUT: 'Выйти из приложения',
        SAVE: 'Сохранить',
        CURRENT_PASSWORD: 'Текущий',
        NEW_PASSWORD: 'Новый',
        CONFIRM_PASSWORD: 'Подтвердить',
        NO_CONFIRM_PASS: 'Неверный пароль'
      }//,

      //'SWITCH_LANG': 'English'
    });

})();