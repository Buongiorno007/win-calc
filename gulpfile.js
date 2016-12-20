'use strict';
// Инициализируем плагины
var gulp = require('gulp'),                       // Собственно Gulp JS
  config = require('./config.json'),              // Конфиг для проектов
  newer = require('gulp-newer'),                  // Passing through only those source files that are newer than corresponding destination files
  concat = require('gulp-concat'),                // Склейка файлов
  jade = require('gulp-jade'),                    // Плагин для Jade
  compass = require('gulp-compass'),              // Плагин для Compass
  csso = require('gulp-csso'),                    // Минификация CSS
  imagemin = require('gulp-imagemin'),            // Минификация изображений
  uglify = require('gulp-uglify'),                // Минификация JS
  ftp = require('gulp-ftp'),                      // FTP-клиент
  del = require('del'),                           // Удаление файлов и папок
  browserSync = require('browser-sync'),          // Обновление без перезагрузки страницы
  reload = browserSync.reload,
  order = require('gulp-order'),                  // Определение порядка файлов в потоке
  csscomb = require('gulp-csscomb'),              // Форматирование стилей
  wrapper = require('gulp-wrapper'),              // Добавляет к файлу текстовую шапку и/или подвал
  plumber = require('gulp-plumber'),              // Перехватчик ошибок
  notify = require("gulp-notify"),                // Нотификатор
  ngAnnotate = require('gulp-ng-annotate'),
  htmlmin = require('gulp-htmlmin'),
  gutil = require('gulp-util'),
  js_obfuscator = require('gulp-js-obfuscator'),  //обфускация кода
  replace = require('gulp-replace'),              //плагин для замены данных в файлах (в нашем случае заменяется метка server_ip на конкретный адрес формата "http://...")
  args = require('yargs').argv;                   //компонент для ипользования параметров которые перезадются в таску галпа. пример gulp --env windowSite

// Очистка результирующей папки
gulp.task('clean', function () {
  del('www/**', function () {
    console.log('Files deleted');
  });
});

// Форматирование стилей

gulp.task('csscomb', function () {
  return gulp.src('./dev/sass/**/*.scss')
    .pipe(csscomb())
    .pipe(gulp.dest('./dev/sass'));
});


function compassTask() {
  return gulp.src(config.build.src.css)
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(compass({
      //      project: "/",
      css: "www/css",
      sass: "dev/sass",
      font: "www/fonts",
      image: "www/img",
      javascript: "www/js",
      //      style: 'compressed',
      //      relative: true,
      comments: true
    })); // Пути к css и scss должны совпадать с путями в config.rb
}


// Собираем css из Compass
gulp.task('compass', function () {
  compassTask()
    .pipe(reload({stream: true}));
});


// Собираем html из Jade
gulp.task('jade', function () {
  return gulp.src(config.build.src.html)
    .pipe(newer(config.build.dest.html, '.html'))
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(jade({
      doctype: 'html',
      pretty: true
    }))
    .pipe(gulp.dest(config.build.dest.html))
    .pipe(reload({stream: true}));
});

var env = args.env || 'steko';
var server_env = {
    "windowSiteTest": "'http://api.test.windowscalculator.net'",
    "windowSite": "'http://api.windowscalculator.net'",
    "steko": "'http://api.steko.com.ua'",
    "orange": "'http://api.orange.windowscalculator.net'",
    "window": "'http://api.windowscalculator.net'"
  },
  print_env = {
    "windowSiteTest": "'http://api.test.windowscalculator.net/orders/get-order-pdf/'",
    "windowSite": "'http://windowscalculator.net/orders/get-order-pdf/'",
    "steko": "'http://admin.steko.com.ua:3002/orders/get-order-pdf/'",
    "orange": "'http://api.orange.windowscalculator.net/orders/get-order-pdf/'",
    "window": "'http://windowscalculator.net/orders/get-order-pdf/'"
  },
  path_env = {
    "windowSiteTest": "'/calculator/local/'",
    "windowSite": "'/calculator/local/'",
    "steko": "'/local/'",
    "orange": "'/local/'",
    "window": "'/local/'"
  };

//для указания сервера, к которому будет обращаться приложение необходимо передать параметр
//по умолчанию обращение идет к стеко.
//пример "gulp --env windowSite"   - переключение на сервер WindowsCalculator
//"gulp --env window" - для расширения. т.к. пути к файлам отличаются
//gulp --env steko
//gulp --env orange
// собственно параметры windowSite|steko|orange|window

// Собираем JS
gulp.task('js', function () {
  return gulp.src(config.build.src.js)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(order(config.build.src.js_order))
    .pipe(concat('main.js'))
    .pipe(replace('SERVER_IP', server_env[env]))
    .pipe(replace('PRINT_IP', print_env[env]))
    .pipe(replace('LOCAL_PATH', path_env[env]))
    .pipe(gulp.dest(config.build.dest.js))
    .pipe(reload({stream: true}));
});

gulp.task('js-vendor', function () {
  return gulp.src(config.build.src.js_vendor)
    .pipe(order(config.build.src.js_vendor_order))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest(config.build.dest.js))
    .pipe(reload({stream: true}));
});

gulp.task('js-other', function () {
  return gulp.src(config.build.src.js_other)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(gulp.dest(config.build.dest.js))
    .pipe(reload({stream: true}));
});


// Копируем изображения
gulp.task('images', function () {
  return gulp.src(config.build.src.img)
    .pipe(newer(config.build.dest.img))
    .pipe(gulp.dest(config.build.dest.img))
    .pipe(reload({stream: true}));
});


// Копируем шрифты
gulp.task('fonts', function () {
  return gulp.src(config.build.src.fonts)
    .pipe(newer(config.build.dest.fonts))
    .pipe(gulp.dest(config.build.dest.fonts))
    .pipe(reload({stream: true}));
});


// Копируем audio
gulp.task('audio', function () {
  return gulp.src(config.build.src.audio)
    .pipe(newer(config.build.dest.audio))
    .pipe(gulp.dest(config.build.dest.audio))
    .pipe(reload({stream: true}));
});

// copy translate jsons
gulp.task('json', function () {
  return gulp.src(config.build.src.local)
    .pipe(newer(config.build.dest.local))
    .pipe(gulp.dest(config.build.dest.local))
    .pipe(reload({stream: true}));
});


///** copy files from different folders */
//
//gulp.task('copy', function() {
//  return gulp.src([
//      'dev/js/directives/location_filter.js', 'dev/js/directives/typing.js',
//      'dev/audio/*.js',
//      'adminka/*.js'
//    ])
//    .pipe(concat('plugins2.js'))
//    .pipe( gulp.dest('www/'));
//});


// Локальный сервер для разработки
// http://www.browsersync.io/docs/options/
gulp.task('server', function () {
  var files = [
    config.build.dest.html,
    config.build.dest.css,
    config.build.dest.img,
    config.build.dest.fonts,
    config.build.dest.js
  ];

  browserSync(files, {
    server: {
      baseDir: 'www'
    },
    port: 8888,
    notify: false,
    // browser: ["google chrome", "firefox", "safari"],
    open: false,
    ghostMode: {
      clicks: true,
      location: true,
      forms: true,
      scroll: true
    }
  });
});


// Запуск сервера разработки
gulp.task('watch', ['jade', 'images', 'fonts', 'compass', 'js', 'js-other', 'js-vendor', 'audio', 'json', 'server'], function () {

  gulp.watch(config.watch.jade, ['jade']);
  gulp.watch(config.watch.img, ['images']);
  gulp.watch(config.watch.fonts, ['fonts']);
  gulp.watch(config.watch.scss, ['compass']);
  gulp.watch(config.watch.js, ['js', 'js-other']);
  gulp.watch(config.watch.js_vendor, ['js-vendor']);
  gulp.watch(config.watch.local, ['json']);
});


// Сборка неминимизированного проекта
gulp.task('build', ['clean'], function () {
  gulp.start(['jade', 'images', 'fonts', 'compass', 'js', 'js-vendor', 'js-other', 'audio', 'json']);
});


gulp.task('default', ['watch']);

// Сборка минимизированного проекта
//gulp.task('production', ['clean'], function() {
//  // css
//  compassTask()
//    .pipe(csso())
//    .pipe(gulp.dest(config.build.dest.css));
//
//  // jade
//  gulp.src(config.build.src.html)
//    .pipe(plumber({ errorHandler: notify.onError("<%= error.message %>") }))
//    .pipe(jade())
//    .pipe(gulp.dest(config.build.dest.html));
//
//  // js
//  gulp.src(config.build.src.js)
//    .pipe(concat('main.js'))
//    .pipe(uglify())
//    .pipe(gulp.dest(config.build.dest.js));
//
//  gulp.src(config.build.src.js_vendor)
//    .pipe(order(config.build.src.js_order))
//    .pipe(concat('plugins.js'))
//    .pipe(gulp.dest(config.build.dest.js));
//
//  gulp.src(config.build.src.js_other)
//    .pipe(uglify())
//    .pipe(gulp.dest(config.build.dest.js));
//
//  // image
//  gulp.src(config.build.src.img)
//    .pipe(imagemin())
//    .pipe(gulp.dest(config.build.dest.img));
//
//  // fonts
//  gulp.src(config.build.src.fonts)
//    .pipe(gulp.dest(config.build.dest.fonts));
//});
/** extension
 * функция для сборки расширения в указанную папку.
 * id - параметр для указания пути, в какую папку сбирать расширение
 * одна функция для всех расширений
 **/
function buildExt(id) {
  //html
  gulp.src(config.build.src.html)
    .pipe(newer("_product/" + id + "/ext", '.html'))
    .pipe(replace('//#', ""))
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(jade({
      doctype: 'html',
      pretty: true
    }))
    .pipe(gulp.dest("_product/" + id + "/ext"));

  //js
  gulp.src(config.build.src.js)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(order(config.build.src.js_order))
    .pipe(replace('SERVER_IP', server_env[id]))
    .pipe(replace('PRINT_IP', print_env[id]))
    .pipe(replace('LOCAL_PATH', path_env[id]))
    .pipe(replace('//#', ""))
    .pipe(concat('main.js'))
    .pipe(ngAnnotate({add: true}))
    .pipe(js_obfuscator())
    .pipe(uglify())
    .pipe(gulp.dest("_product/" + id + "/ext/js"));

  gulp.src(config.build.src.js_vendor)
    .pipe(order(config.build.src.js_vendor_order))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest("_product/" + id + "/ext/js"));

  gulp.src(config.build.src.js_other)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(gulp.dest("_product/" + id + "/ext/js"));

  // Копируем изображения
  gulp.src(config.build.src.img)
    .pipe(newer("_product/" + id + "/ext/img"))
    .pipe(gulp.dest("_product/" + id + "/ext/img"));

  // Копируем шрифты
  gulp.src(config.build.src.fonts)
    .pipe(newer("_product/" + id + "/ext/fonts"))
    .pipe(gulp.dest("_product/" + id + "/ext/fonts"));

  // Копируем audio
  gulp.src(config.build.src.audio)
    .pipe(newer("_product/" + id + "/ext/audio"))
    .pipe(gulp.dest("_product/" + id + "/ext/audio"));

  // copy translate jsons
  gulp.src(config.build.src.local)
    .pipe(newer("_product/" + id + "/ext/local"))
    .pipe(gulp.dest("_product/" + id + "/ext/local"));


  gulp.src("../offline/" + id + "/manifest.json")
    .pipe(gulp.dest("_product/" + id + "/ext"));

  gulp.src(config.offline.background)
    .pipe(gulp.dest("_product/" + id + "/ext"));
  //css
  gulp.src(config.build.src.css)
    .pipe(compass({
      css: "_product/" + id + "/ext/css",
      image: "_product/" + id + "/ext/img/",
      sass: "dev/sass",
      font: "_product/" + id + "/ext/fonts",
    }))
    .pipe(csso())
    .pipe(gulp.dest("_product/" + id + "/ext/css"));
}

/**!!!!!!!!!!!!!ВАЖНО билдить расширения можно поочередно руками или командой
 *
 * gulp buildStekoExt && gulp buildWindowExt && gulp buildOrangeExt
 *
 * задача buildExt выполняется не корректно
 **/

gulp.task('buildStekoExt', function () {
  buildExt("steko");
});

gulp.task('buildWindowExt', function () {
  buildExt("window");
});

gulp.task('buildOrangeExt', function () {
  buildExt("orange");
});

gulp.task('buildExt', function () {
  gulp.start('StekoExt', 'WindowExt', 'OrangeExt');
});

/**BUILDING SITE FOLDER
 * сборка папки для заливки на сервер
 * минифицирует все файлы (html, css, js)
 **/

function buildSite(id) {
  //html
  gulp.src(config.build.src.html)
    .pipe(newer("_product/" + id + "/site", '.html'))
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(jade({
      doctype: 'html',
      pretty: true
    }))
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest("_product/" + id + "/site"));

  //js
  gulp.src(config.build.src.js)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(order(config.build.src.js_order))
    .pipe(replace('SERVER_IP', server_env[id]))
    .pipe(replace('PRINT_IP', print_env[id]))
    .pipe(replace('LOCAL_PATH', path_env[id]))
    .pipe(concat('main.js'))
    .pipe(ngAnnotate({add: true}))
    .pipe(js_obfuscator())
    .pipe(uglify())
    .pipe(gulp.dest("_product/" + id + "/site/js"));


  gulp.src(config.build.src.js_vendor)
    .pipe(order(config.build.src.js_vendor_order))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest("_product/" + id + "/site/js"));

  gulp.src(config.build.src.js_other)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(gulp.dest("_product/" + id + "/site/js"));

  // Копируем изображения
  gulp.src(config.build.src.img)
    .pipe(newer("_product/" + id + "/site/img"))
    .pipe(gulp.dest("_product/" + id + "/site/img"));

  // Копируем шрифты
  gulp.src(config.build.src.fonts)
    .pipe(newer("_product/" + id + "/site/fonts"))
    .pipe(gulp.dest("_product/" + id + "/site/fonts"));

  // Копируем audio
  gulp.src(config.build.src.audio)
    .pipe(newer("_product/" + id + "/site/audio"))
    .pipe(gulp.dest("_product/" + id + "/site/audio"));

  // copy translate jsons
  gulp.src(config.build.src.local)
    .pipe(newer("_product/" + id + "/site/local"))
    .pipe(gulp.dest("_product/" + id + "/site/local"));
  //css
  gulp.src(config.build.src.css)
    .pipe(compass({
      css: "_product/" + id + "/site/css",
      image: "_product/" + id + "/site/img/",
      sass: "dev/sass",
      font: "_product/" + id + "/site/fonts",
    }))
    .pipe(csso())
    .pipe(gulp.dest("_product/" + id + "/site/css"));
}

gulp.task('CopyWindowIMG', function () {
  // Копируем изображения
  gulp.src(config.build.src.img)
    .pipe(newer("_product/WindowSiteTest/site/img"))
    .pipe(gulp.dest("_product/WindowSiteTest/site/img"));
});

gulp.task('buildStekoSite', function () {
  buildSite("steko");
});

gulp.task('buildWindowSiteTest',['CopyWindowIMG'], function () {
  buildSite("windowSiteTest");
});


gulp.task('buildWindowSite', function () {
  buildSite("windowSite");
});

gulp.task('buildOrangeSite', function () {
  buildSite("orange");
});

gulp.task('buildSite', function () {
  gulp.start(['stekoSite', 'windowSite', 'orangeSite']);
});

/** PRODUCTION css and js min */
gulp.task('prod', function () {
  // css
  compassTask()
    .pipe(csso())
    .pipe(gulp.dest(config.build.dest.product));

  // main.js
  gulp.src(config.build.src.js)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(order(config.build.src.js_order))
    .pipe(concat('main.js'))
    .pipe(ngAnnotate({add: true}))
    .pipe(uglify({mangle: true}).on('error', gutil.log))
    .pipe(gulp.dest(config.build.dest.product));

  // plugins.js
  gulp.src(config.build.src.js_vendor)
    .pipe(order(config.build.src.js_vendor_order))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest(config.build.dest.product));

  // html
  gulp.src(config.build.src.html)
    .pipe(newer(config.build.dest.html, '.html'))
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(jade({
      doctype: 'html',
      pretty: true
    }))

    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest(config.build.dest.product));
});


/**========= Загрузка на удаленный сервер =========*/


var server = config.serverWindows;
//var server = config.serverOrange;
//var server = config.serverSteko;

/** upload index */
gulp.task('upload-index', function () {
  gulp.src(config.build.dest.html + 'index.html')
    .pipe(ftp(server));
});
/** upload html */
gulp.task('upload-html', function () {
  var settings = JSON.parse(JSON.stringify(server));
  settings.remotePath += '/views';
  gulp.src(config.build.dest.product + '/views/*.html')
    .pipe(ftp(settings));
});

/** upload js */
gulp.task('upload-js', function () {
  var settings = JSON.parse(JSON.stringify(server));
  settings.remotePath += '/js';
  gulp.src(config.build.dest.product + '/*.js')
    .pipe(ftp(settings));
});

/** upload css */
gulp.task('upload-css', function () {
  var settings = JSON.parse(JSON.stringify(server));
  settings.remotePath += '/css';
  gulp.src(config.build.dest.product + '/*.css')
    .pipe(ftp(settings));
});

/** upload fonts */
gulp.task('upload-fonts', function () {
  var settings = JSON.parse(JSON.stringify(server));
  settings.remotePath += '/fonts/icons';
  gulp.src(config.build.dest.fonts + '/icons/*.ttf')
    .pipe(ftp(settings));
});

/** upload translate */
gulp.task('upload-json', function () {
  var settings = JSON.parse(JSON.stringify(server));
  settings.remotePath += '/local';
  gulp.src(config.build.dest.local + '/*.json')
    .pipe(ftp(settings));
});

gulp.task('upload', ['upload-index', 'upload-html', 'upload-js', 'upload-css', 'upload-fonts', 'upload-json']);


function makeApp(id) {

//html
  gulp.src(config.build.src.html)
    .pipe(newer("_iosApp/"+id+"/www", '.html'))
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(jade({
      doctype: 'html',
      pretty: true
    }))
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest("_iosApp/"+id+"/www"))
    .pipe(reload({stream: true}));

  //js
  gulp.src(config.build.src.js)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(order(config.build.src.js_order))
    .pipe(replace('SERVER_IP', server_env[id]))
    .pipe(replace('PRINT_IP', print_env[id]))
    .pipe(replace('LOCAL_PATH', path_env[id]))
    .pipe(concat('main.js'))
    .pipe(ngAnnotate({add: true}))
    .pipe(gulp.dest("_iosApp/"+id+"/www/js"));

  gulp.src(config.build.src.js_vendor)
    .pipe(order(config.build.src.js_vendor_order))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest("_iosApp/"+id+"/www/js"));

  // Копируем изображения
  gulp.src(config.build.src.img)
    .pipe(newer("_iosApp/"+id+"/www/img"))
    .pipe(gulp.dest("_iosApp/"+id+"/www/img"));

  // Копируем шрифты
  gulp.src(config.build.src.fonts)
    .pipe(newer("_iosApp/"+id+"/www/fonts"))
    .pipe(gulp.dest("_iosApp/"+id+"/www/fonts"));

  // Копируем audio
  gulp.src(config.build.src.audio)
    .pipe(newer("_iosApp/"+id+"/www/audio"))
    .pipe(gulp.dest("_iosApp/"+id+"/www/audio"));

  // copy translate jsons
  gulp.src(config.build.src.local)
    .pipe(newer("_iosApp/"+id+"/www/local"))
    .pipe(gulp.dest("_iosApp/"+id+"/www/local"));

  //css
  gulp.src(config.build.src.css)
    .pipe(compass({
      css: "_iosApp/"+id+"/www/css",
      image: "_iosApp/"+id+"/www/img",
      sass: "dev/sass",
      font: "_iosApp/"+id+"/www/fonts",
      javascript: "_iosApp/"+id+"/www/js"
    }))
    .pipe(csso())
    .pipe(gulp.dest("_iosApp/"+id+"/www/css"));
}
gulp.task('buildStekoApp', function () {
  makeApp("steko");
});

gulp.task('buildWindowApp', function () {
  makeApp("window");
});

gulp.task('buildOrangeApp', function () {
  makeApp("orange");
});
// PhoneGap build
// Копируем in app/www
//var appPath = 'app/platforms/ios/';
var appPath = 'app2/platforms/ios/';

gulp.task('htmlApp', function () {
  return gulp.src(config.buildApp.src.html)
    .pipe(newer(appPath + config.buildApp.dest.html))
    .pipe(gulp.dest(appPath + config.buildApp.dest.html))
    .pipe(reload({stream: true}));
});

gulp.task('cssApp', function () {
  return gulp.src(config.buildApp.src.css)
    .pipe(newer(appPath + config.buildApp.dest.css))
    .pipe(gulp.dest(appPath + config.buildApp.dest.css))
    .pipe(reload({stream: true}));
});

gulp.task('jsApp', function () {
  return gulp.src(config.buildApp.src.js)
    .pipe(newer(appPath + config.buildApp.dest.js))
    .pipe(gulp.dest(appPath + config.buildApp.dest.js))
    .pipe(reload({stream: true}));
});

gulp.task('imagesApp', function () {
  return gulp.src(config.buildApp.src.img)
    .pipe(newer(appPath + config.buildApp.dest.img))
    .pipe(gulp.dest(appPath + config.buildApp.dest.img))
    .pipe(reload({stream: true}));
});

gulp.task('fontsApp', function () {
  return gulp.src(config.buildApp.src.fonts)
    .pipe(newer(appPath + config.buildApp.dest.fonts))
    .pipe(gulp.dest(appPath + config.buildApp.dest.fonts))
    .pipe(reload({stream: true}));
});

gulp.task('localApp', function () {
  return gulp.src(config.buildApp.src.local)
    .pipe(newer(appPath + config.buildApp.dest.local))
    .pipe(gulp.dest(appPath + config.buildApp.dest.local))
    .pipe(reload({stream: true}));
});


// Запуск buildApp
gulp.task('buildapp', function () {
  gulp.start(['htmlApp', 'cssApp', 'jsApp', 'imagesApp', 'fontsApp', 'localApp']);
});
