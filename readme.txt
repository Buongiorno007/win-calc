для установки всех зависимых компонентов в командной строке выполните npm install

перечень зависимостей для запуска проекта записан в package.json

готовые к использованию приложения лежат в  _product/steko/site <- site или _product/window/ext <- extension
остальное по аналогии
****
для создания расширения в командной строке нужно запустить команду "gulp buildStekoExt|buildWindowExt|buildOrangeExt"

пример:
 1) gulp buildStekoExt - данная команда выполняет сборку папку с расширением для стеко
 2) gulp buildWindowExt - данная команда выполняет сборку папку с расширением для windowscalculator
 3) gulp buildOrangeExt - данная команда выполняет сборку папку с расширением для orange
для создания папки для заливки на сервак
 4) gulp buildStekoSite - данная команда выполняет сборку папку с файлами для заливки на стеко
 5) gulp buildWindowSite - данная команда выполняет сборку папку с файлами для заливки на windowscalculator
 6) gulp buildOrangeSite - данная команда выполняет сборку папку с файлами для заливки на orange
файлы находятся в папке _product/steko/site/

чтобы сбилдить сразу все сайты или расширения выполните команду

gulp buildStekoSite && gulp buildWindowSite && gulp buildOrangeSite <<- для сайтов

gulp buildStekoExt && gulp buildWindowExt && gulp buildOrangeExt <<- для расширений