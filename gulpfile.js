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
  args = require('yargs').argv,                   //компонент для ипользования параметров которые перезадются в таску галпа. пример gulp --env windowSite
  removeLogs = require('gulp-removelogs'),       //Strip console statements from JavaScript
  jsonminify = require('gulp-jsonminify');       //Strip console statements from JavaScript
// Очистка результирующей папки
gulp.task('clean', function () {
  del('www/**', function () {
    console.log('Files deleted');
  });
});
var random = Math.random();
var env = args.env || 'windowSiteLocal';
var server_env = {
    "windowSiteTest": "'http://api.windowscalculator.net'",
    "windowSiteLocal": "'http://api.windowscalculator.net'",
    "windowSite": "'http://api.windowscalculator.net'",
    "steko": "'http://api.steko.com.ua'",
    "orange": "'http://api.calc.csokna.ru'",
    "window": "'http://api.windowscalculator.net'"
  },
  print_env = {
    "windowSiteTest": "'http://api.test.windowscalculator.net/orders/get-order-pdf/'",
    "windowSiteLocal": "'http://api.test.windowscalculator.net/orders/get-order-pdf/'",
    "windowSite": "'http://admin.windowscalculator.net/orders/get-order-pdf/'",
    "steko": "'http://admin.steko.com.ua:3002/orders/get-order-pdf/'",
    "orange": "'http://api.calc.csokna.ru/orders/get-order-pdf/'",
    "window": "'http://windowscalculator.net/orders/get-order-pdf/'"
  },
  path_env = {
    "windowSiteTest": "'/calculator/local/'",
    "windowSiteLocal": "'/local/'",
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
    //for fast testing
    //.pipe(replace('//#', ""))
    .pipe(jade({
      doctype: 'html',
      pretty: true
    }))
    .pipe(replace('RANDOM_FLAG', random))
    .pipe(gulp.dest(config.build.dest.html))
    .pipe(reload({stream: true}));
});


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
    .pipe(replace('ISEXTFLAG', "0"))
    .pipe(ngAnnotate({
      remove: true,
      add: true,
      single_quotes: true
    }))
    // .pipe(js_obfuscator())
    // .pipe(uglify())
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
    // .pipe(jsonminify())
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


/** extension
 * функция для сборки расширения в указанную папку.
 * id - параметр для указания пути, в какую папку сбирать расширение
 * одна функция для всех расширений
 **/
function buildExt(id) {
  //html
  if (id === "steko") {
    gulp.src(config.build.src.html)
      .pipe(newer("_product/" + id + "/ext", '.html'))
      .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
      .pipe(jade({
        doctype: 'html',
        pretty: true
      }))
      .pipe(replace('RANDOM_FLAG', random))
      .pipe(replace('orbit', "steko"))
      .pipe(gulp.dest("_product/" + id + "/ext"))
      .on('end', function () {
        gutil.log('html!');
      });

  } else {
    gulp.src(config.build.src.html)
      .pipe(newer("_product/" + id + "/ext", '.html'))
      .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
      .pipe(jade({
        doctype: 'html',
        pretty: true
      }))
      .pipe(replace('RANDOM_FLAG', random))
      .pipe(gulp.dest("_product/" + id + "/ext"))
      .on('end', function () {
        gutil.log('html!');
      });
  }

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
    .pipe(replace('ISEXTFLAG', "1"))
    .pipe(concat('main.js'))
    // .pipe(removeLogs())
    // .pipe(ngAnnotate({add: true}))
    // .pipe(js_obfuscator())
    // .pipe(uglify())
    .pipe(gulp.dest("_product/" + id + "/ext/js"))
    .on('end', function () {
      gutil.log('js!');
    });

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
    .pipe(gulp.dest("_product/" + id + "/ext/img"))
    .on('end', function () {
      //css
      gulp.src(config.build.src.css)
        .pipe(compass({
          css: "_product/" + id + "/ext/css",
          image: "_product/" + id + "/ext/img/",
          sass: "dev/sass",
          font: "_product/" + id + "/ext/fonts",
        }))
        .pipe(csso())
        .pipe(gulp.dest("_product/" + id + "/ext/css"))
        .on('end', function () {
          gutil.log('css!');
        });
      gutil.log('img!');
    });

  // Копируем шрифты
  gulp.src(config.build.src.fonts)
    .pipe(newer("_product/" + id + "/ext/fonts"))
    .pipe(gulp.dest("_product/" + id + "/ext/fonts"))
    .on('end', function () {
      gutil.log('font!');
    });

  // Копируем audio
  gulp.src(config.build.src.audio)
    .pipe(newer("_product/" + id + "/ext/audio"))
    .pipe(gulp.dest("_product/" + id + "/ext/audio"))
    .on('end', function () {
      gutil.log('audio!');
    });

  // copy translate jsons
  gulp.src(config.build.src.local)
    .pipe(newer("_product/" + id + "/ext/local"))
    .pipe(gulp.dest("_product/" + id + "/ext/local"))
    .on('end', function () {
      gutil.log('local!');
    });


  gulp.src("../offline/" + id + "/manifest.json")
    .pipe(gulp.dest("_product/" + id + "/ext"));

  gulp.src(config.offline.background)
    .pipe(gulp.dest("_product/" + id + "/ext"));

}

/**!!!!!!!!!!!!!ВАЖНО билдить расширения можно:
 *
 * gulp buildStekoExt && gulp buildWindowExt && gulp buildOrangeExt
 *
 * buildExt
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
gulp.task('buildWindowSiteExt', function () {
  buildExt("windowSiteTest");
});
gulp.task('buildExt', function () {
  gulp.start('buildStekoExt', 'buildWindowExt', 'buildOrangeExt');
});

/**BUILDING SITE FOLDER
 * сборка папки для заливки на сервер
 * минифицирует все файлы (html, css, js)
 **/

function buildSite(id) {
  //html
  if (id === "steko") {
    gulp.src(config.build.src.html)
      .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
      .pipe(jade({
        doctype: 'html',
        pretty: true
      }))
      .pipe(replace('RANDOM_FLAG', random))
      .pipe(replace('orbit', "steko"))
      .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
      .pipe(gulp.dest("_product/" + id + "/site"))
      .on('end', function () {
        gutil.log('html!');
      });
  } else {
    gulp.src(config.build.src.html)
      .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
      .pipe(jade({
        doctype: 'html',
        pretty: true
      }))
      .pipe(replace('RANDOM_FLAG', random))
      .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
      .pipe(gulp.dest("_product/" + id + "/site"))
      .on('end', function () {
        gutil.log('html!');
      });
  }
  gulp.src(config.build.src.js_other)
    .pipe(gulp.dest("_product/" + id + "/site/js"));

  gulp.src(config.build.src.js_vendor)
    .pipe(order(config.build.src.js_vendor_order))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest("_product/" + id + "/site/js"))
    .on('end', function () {
      gutil.log('plugins!');
    });


  // main.js
  gulp.src(config.build.src.js)
    .pipe(ngAnnotate({add: true}))
    .pipe(replace('SERVER_IP', server_env[id]))
    .pipe(replace('PRINT_IP', print_env[id]))
    .pipe(replace('LOCAL_PATH', path_env[id]))
    .pipe(replace('ISEXTFLAG', "0"))
    .pipe(concat('main.js'))
    //.pipe(uglify({mangle: true}).on('error', gutil.log))
    .pipe(removeLogs())
    .pipe(gulp.dest("_product/" + id + "/site/js"))
    .on('end', function () {
      gutil.log('js!');
    });

  // Копируем изображения
  gulp.src(config.build.src.img)
    .pipe(gulp.dest("_product/" + id + "/site/img"))
    .on('end', function () {
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
    });
  // Копируем шрифты
  gulp.src(config.build.src.fonts)
    .pipe(gulp.dest("_product/" + id + "/site/fonts"));

  // Копируем audio
  gulp.src(config.build.src.audio)
    .pipe(gulp.dest("_product/" + id + "/site/audio"));

  // copy translate jsons
  gulp.src(config.build.src.local)
    .pipe(newer("_product/" + id + "/site/local"))
    .pipe(gulp.dest("_product/" + id + "/site/local"))
    .on('end', function () {
      gutil.log('local!');
    });

}


gulp.task('buildStekoSite', function () {
  buildSite("steko");
});

gulp.task('buildWindowSiteTest', function () {
  buildSite("windowSiteTest");
});


gulp.task('buildWindowSite', function () {
  buildSite("windowSite");
});

gulp.task('buildOrangeSite', function () {
  buildSite("orange");
});

gulp.task('buildSite', function () {
  gulp.start(['buildStekoSite', 'buildWindowSiteTest', 'buildWindowSite', 'buildOrangeSite']);
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
    .pipe(ngAnnotate({add: true}))
    .pipe(replace('SERVER_IP', server_env[env]))
    .pipe(replace('PRINT_IP', print_env[env]))
    .pipe(replace('LOCAL_PATH', path_env[env]))
    .pipe(replace('ISEXTFLAG', "1"))
    .pipe(concat('main.js'))
    //.pipe(uglify({mangle: true}).on('error', gutil.log))
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
    .pipe(replace('//#', ""))
    .pipe(jade({
      doctype: 'html',
      pretty: true
    }))
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest(config.build.dest.product));
});

// PhoneGap build
// Копируем in app/www
//var appPath = 'app/platforms/ios/';
var appPath = 'Cornerstone/platforms/ios/';
// var appPath = 'app2/platforms/ios/';


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

gulp.task('stekoApp', function () {
//html
    gulp.src(config.build.src.html)
      .pipe(newer(config.build.steko.app.root, '.html'))
      .pipe(replace('//#', ""))
      .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
      .pipe(jade({
        doctype: 'html',
        pretty: true
      }))
      .pipe(replace('orbit', "steko"))
      .pipe(replace('<script src=""></script>', '<script src="cordova.js"></script>'))
      .pipe(gulp.dest(config.build.steko.app.root))
      .on('end', function () {
        gutil.log('html!');
      });

//js
  gulp.src(config.build.src.js)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(order(config.build.src.js_order))
    .pipe(replace('SERVER_IP', server_env["steko"]))
    .pipe(replace('PRINT_IP', print_env["steko"]))
    .pipe(replace('LOCAL_PATH', path_env["steko"]))
    .pipe(replace('ISEXTFLAG', "1"))
    .pipe(concat('main.js'))
    .pipe(removeLogs())
    .pipe(ngAnnotate({add: true}))
    .pipe(js_obfuscator())
    .pipe(uglify())
    .pipe(gulp.dest(config.build.steko.app.js))
    .on('end', function () {
      gutil.log('js!');
    });

  gulp.src(config.build.src.js_vendor)
    .pipe(order(config.build.src.js_vendor_order))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest(config.build.steko.app.js));

  gulp.src(config.build.src.js_other)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(gulp.dest(config.build.steko.app.js));

// Копируем изображения
  gulp.src(config.build.src.img)
    .pipe(gulp.dest(config.build.steko.app.img))
    .on('end', function () {
      //css
      gulp.src(config.build.src.css)
        .pipe(compass({
          css: config.build.steko.app.css,
          image: config.build.steko.app.img,
          sass: "dev/sass",
          font: config.build.steko.app.fonts,
        }))
        .pipe(csso())
        .pipe(gulp.dest(config.build.steko.app.css))
        .on('end', function () {
          gutil.log('css!');
        });
      gutil.log('img!');
    });

// Копируем шрифты
  gulp.src(config.build.src.fonts)
    .pipe(gulp.dest(config.build.steko.app.fonts))
    .on('end', function () {
      gutil.log('font!');
    });

// Копируем audio
  gulp.src(config.build.src.audio)
    .pipe(gulp.dest(config.build.steko.app.audio))
    .on('end', function () {
      gutil.log('audio!')
    });

// copy translate jsons
  gulp.src(config.build.src.local)
    .pipe(gulp.dest(config.build.steko.app.local))
    .on('end', function () {
      gutil.log('local!');
    });
});


gulp.task('cleanSteko', function () {
  del(config.build.steko.app.root+'/www/**', function () {
    console.log('Files deleted');
  });
});

gulp.task('buildSteko', function () {
  gulp.start("stekoApp",['cleanSteko']);
});
/**!!!!!!!!!!!!!!!!!! CORNERSTONE */
gulp.task('cornerstoneApp', function () {
//html
  gulp.src(config.build.src.html)
    .pipe(newer(config.build.orange.app.root, '.html'))
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(jade({
      doctype: 'html',
      pretty: true
    }))
    .pipe(replace('RANDOM_FLAG', random))
    .pipe(replace('<script src=""></script>', '<script type="text/javascript" src="cordova.js"></script>'))
    .pipe(gulp.dest(config.build.orange.app.root))
    .on('end', function () {
      gutil.log('html!');
    });

//js
  gulp.src(config.build.src.js)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(order(config.build.src.js_order))
    .pipe(replace('SERVER_IP', server_env["orange"]))
    .pipe(replace('PRINT_IP', print_env["orange"]))
    .pipe(replace('LOCAL_PATH', path_env["orange"]))
    .pipe(replace('ISEXTFLAG', "1"))
    .pipe(concat('main.js'))
    // .pipe(removeLogs())
    .pipe(ngAnnotate({add: true}))
    // .pipe(js_obfuscator())
    // .pipe(uglify())
    .pipe(gulp.dest(config.build.orange.app.js))
    .on('end', function () {
      gutil.log('js!');
    });

  gulp.src(config.build.src.js_vendor)
    .pipe(order(config.build.src.js_vendor_order))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest(config.build.orange.app.js));

  gulp.src(config.build.src.js_other)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(gulp.dest(config.build.orange.app.js));

// Копируем изображения
  gulp.src(config.build.src.img)
    .pipe(gulp.dest(config.build.orange.app.img))
    .on('end', function () {
      //css
      gulp.src(config.build.src.css)
        .pipe(compass({
          css: config.build.orange.app.css,
          image: config.build.orange.app.img,
          sass: "dev/sass",
          font: config.build.orange.app.fonts,
        }))
        .pipe(csso())
        .pipe(gulp.dest(config.build.orange.app.css))
        .on('end', function () {
          gutil.log('css!');
        });
      gutil.log('img!');
    });

// Копируем шрифты
  gulp.src(config.build.src.fonts)
    .pipe(gulp.dest(config.build.orange.app.fonts))
    .on('end', function () {
      gutil.log('font!');
    });

// Копируем audio
  gulp.src(config.build.src.audio)
    .pipe(gulp.dest(config.build.orange.app.audio))
    .on('end', function () {
      gutil.log('audio!')
    });

// copy translate jsons
  gulp.src(config.build.src.local)
    .pipe(gulp.dest(config.build.orange.app.local))
    .on('end', function () {
      gutil.log('local!');
    });
});

gulp.task('cleanCorner', function () {
  del(config.build.orange.app.root+'/www/**', function () {
    console.log('Files deleted');
  });
});

gulp.task('buildCornerstone', function () {
  gulp.start("cornerstoneApp",['cleanCorner']);
});

/**!!!!!!!!!!!!!!!!!! WINDOWSCALCULATOR */
gulp.task('wincalcApp', function () {
//html
  gulp.src(config.build.src.html)
    .pipe(newer(config.build.window.app.root, '.html'))
    .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
    .pipe(jade({
      doctype: 'html',
      pretty: true
    }))
    .pipe(replace('RANDOM_FLAG', random))
    .pipe(replace('<script src=""></script>', '<script type="text/javascript" src="cordova.js"></script>'))
    .pipe(gulp.dest(config.build.window.app.root))
    .on('end', function () {
      gutil.log('html!');
    });

//js
  gulp.src(config.build.src.js)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(order(config.build.src.js_order))
    .pipe(replace('SERVER_IP', server_env["window"]))
    .pipe(replace('PRINT_IP', print_env["window"]))
    .pipe(replace('LOCAL_PATH', path_env["window"]))
    .pipe(replace('ISEXTFLAG', "1"))
    .pipe(concat('main.js'))
    .pipe(removeLogs())
    .pipe(ngAnnotate({add: true}))
    // .pipe(js_obfuscator())
    // .pipe(uglify())
    .pipe(gulp.dest(config.build.window.app.js))
    .on('end', function () {
      gutil.log('js!');
    });

  gulp.src(config.build.src.js_vendor)
    .pipe(order(config.build.src.js_vendor_order))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest(config.build.window.app.js));

  gulp.src(config.build.src.js_other)
    .pipe(wrapper({
      header: '\n// ${filename}\n\n',
      footer: '\n'
    }))
    .pipe(gulp.dest(config.build.window.app.js));

// Копируем изображения
  gulp.src(config.build.src.img)
    .pipe(gulp.dest(config.build.window.app.img))
    .on('end', function () {
      //css
      gulp.src(config.build.src.css)
        .pipe(compass({
          css: config.build.window.app.css,
          image: config.build.window.app.img,
          sass: "dev/sass",
          font: config.build.window.app.fonts,
        }))
        .pipe(csso())
        .pipe(gulp.dest(config.build.window.app.css))
        .on('end', function () {
          gutil.log('css!');
        });
      gutil.log('img!');
    });

// Копируем шрифты
  gulp.src(config.build.src.fonts)
    .pipe(gulp.dest(config.build.window.app.fonts))
    .on('end', function () {
      gutil.log('font!');
    });

// Копируем audio
  gulp.src(config.build.src.audio)
    .pipe(gulp.dest(config.build.window.app.audio))
    .on('end', function () {
      gutil.log('audio!')
    });

// copy translate jsons
  gulp.src(config.build.src.local)
    .pipe(gulp.dest(config.build.window.app.local))
    .on('end', function () {
      gutil.log('local!');
    });
});

gulp.task('cleanWincalcApp', function () {
  del(config.build.window.app.root+'/www/**', function () {
    console.log('Files deleted');
  });
});

gulp.task('buildWincalc', function () {
  gulp.start("wincalcApp",['cleanWincalcApp']);
});
