/* globals BauVoiceApp, STEP, */

'use strict';

BauVoiceApp.controller('TemplateSelectorCtrl', ['$scope', 'constructService', '$location', 'localStorage', function ($scope, constructService, $location, localStorage) {

  $scope.global = localStorage;

  $scope.templatePanel = {
    DELAY_TEMPLATE_ELEMENT: 5 * STEP,
    switcherTemplate: false,
    templateCurrID: 1,
    typing: 'on'
  };

  constructService.getAllTemplates(function (results) {
    if (results.status) {
      $scope.templatePanel.templates = results.data.templatesWindow;
      $scope.templatePanel.templateQty = results.data.templatesWindow.length - 1;
    } else {
      console.log(results);
    }
  });

  // Select Window/Balcony Template
  $scope.toggleTemplate = function() {
    $scope.templatePanel.switcherTemplate = !$scope.templatePanel.switcherTemplate;
  };

  $scope.gotoConstructionPage = function () {
    $location.path('/construction');
  };

  // Templates Slider
  $scope.initTemplates = function() {
    var currTemplateId = $scope.templatePanel.templateCurrID;
    var prevTemplateId = currTemplateId - 1;
    var nextTemplateId = currTemplateId + 1;

    if(prevTemplateId < 0) {
      prevTemplateId = $scope.templatePanel.templateQty;
    }
    if(nextTemplateId > $scope.templatePanel.templateQty) {
      nextTemplateId = 0;
    }

    $scope.templatePanel.templateDescription = $scope.templatePanel.templates[currTemplateId].templateDescrip;
    $scope.templatePanel.templateSVG = $scope.templatePanel.templates[currTemplateId].templateSVG;

    $scope.templatePanel.templateTitlePrev = $scope.templatePanel.templates[prevTemplateId].templateTitle;
    $scope.templatePanel.templateImgPrev = $scope.templatePanel.templates[prevTemplateId].templateUrl;
    $scope.templatePanel.templateDescriptionPrev = $scope.templatePanel.templates[prevTemplateId].templateDescrip;

    $scope.templatePanel.templateTitleNext = $scope.templatePanel.templates[nextTemplateId].templateTitle;
    $scope.templatePanel.templateImgNext = $scope.templatePanel.templates[nextTemplateId].templateUrl;
    $scope.templatePanel.templateDescriptionNext = $scope.templatePanel.templates[nextTemplateId].templateDescrip;
  };

  $scope.showTemplatePrev = function() {
    $scope.templatePanel.templateCurrID -= 1;
    if($scope.templatePanel.templateCurrID < 0) {
      $scope.templatePanel.templateCurrID = $scope.templatePanel.templateQty;
    }
    $scope.initTemplates();
  };
  $scope.showTemplateNext = function() {
    $scope.templatePanel.templateCurrID += 1;
    if($scope.templatePanel.templateCurrID > $scope.templatePanel.templateQty) {
      $scope.templatePanel.templateCurrID = 0;
    }
    $scope.initTemplates();
  };

}]);


/*
//------------------------
var templateSource1 = {'name':'Одностворчатый ПО', 'short_name':'ОПО',
  'objects':[
    {'type':'fixed_point', 'id':'fp1', 'x':'0', 'y': '0'},
    {'type':'fixed_point', id:'fp2', x:'100', y:'0'},
    {'type':'fixed_point', id:'fp3', x:'100', y:'100'},
    {'type':'fixed_point', id:'fp4', x:'0', y:'100'},
    {'type':'frame_line', id:'r1', from:'fp1', to:'fp2'},
    {'type':'frame_line', id:'r2', from:'fp2', to:'fp3'},
    {'type':'frame_line', id:'r3', from:'fp3', to:'fp4'},
    {'type':'frame_line', id:'r4', from:'fp4', to:'fp1'},
    {'type':'cross_point', id:'cp1', line1:'r1', line2:'r2'},
    {'type':'cross_point', id:'cp2', line1:'r2', line2:'r3'},
    {'type':'cross_point', id:'cp3', line1:'r3', line2:'r4'},
    {'type':'cross_point', id:'cp4', line1:'r4', line2:'r1'},
    {'type':'sash_line', id:'s1', from:'cp1', to:'cp2'},
    {'type':'sash_line', id:'s2', from:'cp2', to:'cp3'},
    {'type':'sash_line', id:'s3', from:'cp3', to:'cp4'},
    {'type':'sash_line', id:'s4', from:'cp4', to:'cp1'},
    {'type':'cross_point', id:'cp5', line1:'s1', line2:'s2'},
    {'type':'cross_point', id:'cp6', line1:'s2', line2:'s3'},
    {'type':'cross_point', id:'cp7', line1:'s3', line2:'s4'},
    {'type':'cross_point', id:'cp8', line1:'s4', line2:'s1'},
    {'type':'bead_box_line', id:'s1', from:'cp5', to:'cp6'},
    {'type':'bead_box_line', id:'s2', from:'cp6', to:'cp7'},
    {'type':'bead_box_line', id:'s3', from:'cp7', to:'cp8'},
    {'type':'bead_box_line', id:'s4', from:'cp8', to:'cp5'}
  ]
};

var FrameObject = function (sourceObj) {
  this.id = sourceObj.id;
};

//-----------FixedPoint-------------------
var FixedPoint = function (sourceObj) {
  FrameObject.call(this, sourceObj);
  this.x = sourceObj.x;
  this.y = sourceObj.y;
};

FixedPoint.prototype = FrameObject;

//-----------LineObject-------------------
var LineObject = function (sourceObj, fullTemplate) {
  FrameObject.call(this, sourceObj);
  this.fromPointId = sourceObj.from;
  this.toPointId = sourceObj.to;


  this.parseIds = function(fullTemplate) {
    this.fromPoint = fullTemplate.findById(this.fromPointId);
    this.toPoint = fullTemplate.findById(this.toPointId);
  };

};

LineObject.prototype = FrameObject;


//-----------FrameLine-------------------
var FrameLine = function (sourceObj) {
  LineObject.call(this, sourceObj);
};

FrameLine.prototype = LineObject;


//-----------CrossPoint-------------------
var CrossPoint = function (sourceObj) {
  FrameObject.call(this, sourceObj);

  this.lineId1 = sourceObj.line1;
  this.lineId2 = sourceObj.line2;

  this.parseIds = function(fullTemplate) {
    this.line1 = fullTemplate.findById(this.lineId1);
    this.line2 = fullTemplate.findById(this.lineId2);
  };
};

CrossPoint.prototype = FrameObject;

//-----------SashLine-------------------
var SashLine = function (sourceObj) {
  LineObject.call(this, sourceObj);

};

SashLine.prototype = LineObject;

//-----------BeadBoxLine-------------------
var BeadBoxLine = function (sourceObj) {
  LineObject.call(this, sourceObj);
};

BeadBoxLine.prototype = LineObject;


var Template = function (sourceObj) {
  this.name      = sourceObj.name;
  this.shortName = sourceObj.short_name;

  this.objects = [];

  var tmpObject;
  for (var i = 0; i < sourceObj.objects.length; i++) {
    tmpObject = null;
    switch(sourceObj.objects[i].type) {
      case 'fixed_point':  tmpObject = new FixedPoint(sourceObj.objects[i]);
        break;
      case 'frame_line':  tmpObject = new FrameLine(sourceObj.objects[i]);
        break;
      case 'cross_point':  tmpObject = new CrossPoint(sourceObj.objects[i]);
        break;
      case 'sash_line':  tmpObject = new SashLine(sourceObj.objects[i]);
        break;
      case 'bead_box_line':  tmpObject = new BeadBoxLine(sourceObj.objects[i]);
        break;
    }
    if (tmpObject) {
      this.objects.push(tmpObject);
    }
  }


  //эта функция  пройдет по всем objects и свяжет ID по имени с объектами,
  // но только после того как будут все объекты уже распарсены

  this.parseIds = function() {
    for (var i = 4; i < this.objects.length; i++) {
      console.log(this.objects);
      this.objects[i].parseIds(this);
    }
  };

  this.findById = function (id) {
    for (var i = 0; i < this.objects.length; i++) {
      if (this.objects[i].id === id) {
        return this.objects[i];
      }
    }
  };
  this.parseIds();
};

var template1 = new Template(templateSource1);

console.log(JSON.stringify(template1));

*/