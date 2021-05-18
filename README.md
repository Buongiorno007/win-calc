# BauVoice

### gulp

---

Шаблон для сайта с подключенными gulp, Jade, Compass, HTML5Boilerplate

sudo npm install -g gulp

npm install

gulp или gulp watch для разработки

gulp build для сборки

gulp production для минификации

gulp upload для загрузки на сервер

gulp clean для очистки результирующей папки

gulp csscomb для форматирования файлов стилей

## Сервер - http://localhost:8888

готовые к использованию приложения лежат в \_product/steko/site <- site или \_product/window/ext <- extension
остальное по аналогии

---

для создания расширения в командной строке нужно запустить команду "gulp buildStekoExt|buildWindowExt|buildOrangeExt"

пример:

1.  gulp buildStekoExt - данная команда выполняет сборку папку с расширением для стеко
2.  gulp buildWindowExt - данная команда выполняет сборку папку с расширением для windowscalculator
3.  gulp buildOrangeExt - данная команда выполняет сборку папку с расширением для orange
    для создания папки для заливки на сервак
4.  gulp buildStekoSite - данная команда выполняет сборку папку с файлами для заливки на стеко
5.  gulp buildWindowSite - данная команда выполняет сборку папку с файлами для заливки на windowscalculator
6.  gulp buildOrangeSite - данная команда выполняет сборку папку с файлами для заливки на orange
    файлы находятся в папке \_product/steko/site/
7.  gulp buildRehau - данная команда выполняет сборку папки с файлами для заливки на сайт rehau

чтобы сбилдить сразу все сайты или расширения выполните команду

gulp buildStekoSite && gulp buildWindowSite && gulp buildOrangeSite <<- для сайтов

gulp buildStekoExt && gulp buildWindowExt && gulp buildOrangeExt <<- для расширений
