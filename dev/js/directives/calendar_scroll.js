(function(){
  'use strict';
  /**@ngInject*/
  angular
    .module('HistoryModule')
    .directive('calendarScroll', calendarScrollDir);

  function calendarScrollDir($filter, HistoryStor) {

    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        calendarType: '=',
        orderType: '='
      },
      template: function(elem, attr){
        var typeTemplate = +attr.calendarType,
            templateBody = '',
            dateRange = '',
            formName = '',
            selectDayId = '',
            selectDayName = '',
            selectMonthId = '',
            selectMonthName = '',
            selectYearId = '',
            selectYearName = '',
            monthObj = $filter('translate')('common_words.MONTHS'),
            monthArr = monthObj.split(', '),
            monthQty = monthArr.length,
            dayIndex = 1, monthIndex = 0,
            yearIndex = 2010, yearEnd = new Date().getFullYear()+1;

        if(typeTemplate) {
          /** Data Finish */
          dateRange = 'date_range_from';
          formName = 'date_from';
          selectDayId = 'from_date';
          selectDayName = 'from_date_'+attr.orderType;
          selectMonthId = 'from_month';
          selectMonthName = 'from_month_'+attr.orderType;
          selectYearId = 'from_fullYear';
          selectYearName = 'from_fullYear_'+attr.orderType;
        } else {
          /** Data Start */
          dateRange = 'date_range_to';
          formName = 'date_to';
          selectDayId = 'to_date';
          selectDayName = 'to_date_'+attr.orderType;
          selectMonthId = 'to_month';
          selectMonthName = 'to_month_'+attr.orderType;
          selectYearId = 'to_fullYear';
          selectYearName = 'to_fullYear_'+attr.orderType;
        }
        templateBody = '<div class="date_range outside">'+
          '<div class="date_range_container">'+
          '<div class="'+dateRange+'">'+
          '<form name="'+formName+'">'+
          '<div class="lines"><div></div></div>'+
          '<select class="date" id="'+selectDayId+'" name="'+selectDayName+'">';

        /** Day generating */
        while(dayIndex < 32) {
          templateBody += '<option value="'+dayIndex+'">'+dayIndex+'</option>';
          dayIndex+=1;
        }
        templateBody += '</select><select class="date" id="'+selectMonthId+'" name="'+selectMonthName+'">';

        /** Month generating */
        while(monthIndex < monthQty) {
          templateBody += '<option value="'+monthIndex+'">'+monthArr[monthIndex]+'</option>';
          monthIndex+=1;
        }
        templateBody += '</select><select class="date" id="'+selectYearId+'" name="'+selectYearName+'">';

        /** Year generating */
        while(yearIndex <= yearEnd) {
          templateBody += '<option value="'+yearIndex+'">'+yearIndex+'</option>';
          yearIndex+=1;
        }
        templateBody += '</select></form></div></div></div>';

        return templateBody;

      },
      link: function (scope) {

//      Hammer.plugins.fakeMultitouch();

        function getIndexForValue(selectTag, value) {
          var selectQty = selectTag.options.length;
          while(--selectQty > -1) {
            if (selectTag.options[selectQty].value === value) {
              return selectQty;
            }
          }
        }

        function update(panel, section, datetime) {
          $('.'+panel).find("#" + section + "_date").drum('setIndex', datetime.getDate()-1);
          $('.'+panel).find("#" + section + "_month").drum('setIndex', datetime.getMonth());
          $('.'+panel).find("#" + section + "_fullYear").drum('setIndex', getIndexForValue($("#" + section + "_fullYear")[0], datetime.getFullYear()));
        }

        $(function(){
          $("select.date").drum({
            onChange : function (elem) {
              var elemNameArr = elem.name.split('_'),
                  section = elemNameArr[0],
                  isOrder = +elemNameArr[2],
                  arr = {'date' : 'setDate', 'month' : 'setMonth', 'fullYear' : 'setFullYear'},
                  date = new Date(), s, i;
              for (s in arr) {
                i = ($("form[name='date_" + section + "'] select[id='" + section + "_" + s + "']"))[0].value;
                eval ("date." + arr[s] + "(" + i + ")");
              }

              if(isOrder) {
                update('history-view', section, date);
                /** save Data for order */
                if(section === 'from'){
                  HistoryStor.history.startDate = date;
                } else {
                  HistoryStor.history.finishDate = date;
                }
              } else {
                update('draft-view', section, date);
                /** save Data for draft */
                if(section === 'from'){
                  HistoryStor.history.startDateDraft = date;
                } else {
                  HistoryStor.history.finishDateDraft = date;
                }
              }
              scope.$apply();
            }
          });

          var now = new Date();
          update('history-view', "from", new Date(now.getFullYear(), now.getMonth(), now.getDate()));
          update('history-view', "to", new Date(now.getFullYear(), now.getMonth(), now.getDate()));
          update('draft-view', "from", new Date(now.getFullYear(), now.getMonth(), now.getDate()));
          update('draft-view', "to", new Date(now.getFullYear(), now.getMonth(), now.getDate()));
        });

      }
    };

  }
})();