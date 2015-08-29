
// services/options_Serv.js

(function(){
  'use strict';
  /**
   * @ngInject
   */
  angular
    .module('BauVoiceApp')
    .factory('optionsServ', optionFactory);

  function optionFactory($filter) {

    return {


      getTemplateImgIcons: function (callback) {
        callback(new OkResult({
          templateImgs: [
            {
              id: 1,
              name: $filter('translate')('panels.ONE_WINDOW_TYPE'),
              src: 'img/templates/1.png'
            },
            {
              id: 2,
              name: $filter('translate')('panels.TWO_WINDOW_TYPE'),
              src: 'img/templates/3.png'
            },
            {
              id: 3,
              name: $filter('translate')('panels.THREE_WINDOW_TYPE'),
              src: 'img/templates/4.png'
            },
            {
              id: 4,
              name: $filter('translate')('panels.TWO_WINDOW_TYPE'),
              src: 'img/templates/5.png'
            },
            {
              id: 5,
              name: $filter('translate')('panels.TWO_WINDOW_TYPE'),
              src: 'img/templates/6.png'
            },
            {
              id: 6,
              name: $filter('translate')('panels.TWO_WINDOW_TYPE'),
              src: 'img/templates/7.png'
            },
            {
              id: 7,
              name: $filter('translate')('panels.ONE_WINDOW_TYPE'),
              src: 'img/templates/8.png'
            },
            {
              id: 8,
              name: $filter('translate')('panels.TWO_WINDOW_TYPE'),
              src: 'img/templates/9.png'
            },
            {
              id: 9,
              name: $filter('translate')('panels.THREE_WINDOW_TYPE'),
              src: 'img/templates/10.png'
            },
            {
              id: 10,
              name: $filter('translate')('panels.THREE_WINDOW_TYPE'),
              src: 'img/templates/11.png'
            },
            {
              id: 11,
              name: $filter('translate')('panels.THREE_WINDOW_TYPE'),
              src: 'img/templates/12.png'
            }
          ]
        }));
      },


      getTemplatesWindow: function(callback) {
        callback(new OkResult({
          windows: [
            {
              name: 'Глухое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
                //------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: [],
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1300, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1300, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  glassTxt: ''
                }
              ]
            },

            {
              name: 'Двухстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
                //------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:530, y:0, dir:'line'},
                      {type:'impost', id:'ip1', x:530, y:1320, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1060, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1060, y:1320, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1320, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                //------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                }
              ]
            },
            //                points: [//1:1 = 887

            {
              name: 'Трехстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
                //------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:700, y:0, dir:'line'},
                      {type:'impost', id:'ip1', x:700, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:2100, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:2100, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                //------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1400, y:0, dir:'line'},
                      {type:'impost', id:'ip3', x:1400, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0
                },
                //------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'sash',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  gridId: 0,
                  openDir: [1, 4],
                  handlePos: 4
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                }
              ]
            },



            {
              name: 'Двухстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:530, y:0, dir:'line'},
                      {type:'impost', id:'ip1', x:530, y:1320, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1060, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1060, y:1320, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1320, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:0, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:530, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                }
              ]
            },

            {
              name: 'Двухстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:530, y:0, dir:'line'},
                      {type:'impost', id:'ip1', x:530, y:1320, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1060, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1060, y:1320, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1320, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1060, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:530, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                }
              ]
            },

            {
              name: 'Двухстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:530, y:0, dir:'line'},
                      {type:'impost', id:'ip1', x:530, y:1320, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1060, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1060, y:1320, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1320, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:0, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:530, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_6', 'block_7'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1060, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:530, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_6',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_7',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                }
              ]
            },

            {
              name: 'Одностворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
                //------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1',  x:1060, y:300, dir:'line'},
                      {type:'impost', id:'ip1', x:0, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1060, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1060, y:1320, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1320, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                //------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                }
              ]
            },


            {
              name: 'Трехстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:1060, y:300, dir:'line'},
                      {type:'impost', id:'ip1', x:0, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1060, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1060, y:1320, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1320, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:530, y:0, dir:'line'},
                      {type:'impost', id:'ip3', x:530, y:1320, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                }
              ]
            },


            {
              name: 'Трехстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:2100, y:300, dir:'line'},
                      {type:'impost', id:'ip1', x:0, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:2100, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:2100, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:700, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:700, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: ['block_6', 'block_7'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1400, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:1400, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
//------- Level 4
                {
                  type:'skylight',
                  id:'block_6',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_5',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_7',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_5',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                }
              ]
            },



            {
              name: 'Трехстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:2100, y:300, dir:'line'},
                      {type:'impost', id:'ip1', x:0, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:2100, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:2100, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1050, y:0, dir:'line'},
                      {type:'impost', id:'ip3', x:1050, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_6', 'block_7'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:700, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:700, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_6',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_7',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: ['block_8', 'block_9'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1400, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:1400, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
//------- Level 4
                {
                  type:'skylight',
                  id:'block_8',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_7',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_9',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_7',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                }
              ]
            },



            {
              name: 'Трехстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:2100, y:300, dir:'line'},
                      {type:'impost', id:'ip1', x:0, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:2100, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:2100, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:700, y:0, dir:'line'},
                      {type:'impost', id:'ip3', x:700, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_6', 'block_7'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:700, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:700, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_2',
                  children: ['block_8', 'block_9'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1400, y:0, dir:'line'},
                      {type:'impost', id:'ip3', x:1400, y:300, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_6',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_7',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: ['block_10', 'block_11'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1400, y:300, dir:'line'},
                      {type:'impost', id:'ip3', x:1400, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
//------- Level 4
                {
                  type:'skylight',
                  id:'block_8',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_5',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_9',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_5',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_10',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_7',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_11',
                  level: 4,
                  blockType: 'frame',
                  parent: 'block_7',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                }
              ]
            }

          ]

        }));
      },


      getTemplatesWindowDoor: function(callback) {
        callback(new OkResult({

          windowDoor: [
            {
              name: 'Выход на балкон',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1', 'block_2'],
                  maxSizeLimit: 5000
                },
                //------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: [],
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:1300, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:1300, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_2',
                  level: 1,
                  blockType:'sash',
                  parent: 'block_0',
                  children: [],
                  pointsOut: [
                    {type:'frame', id:'fp1', x:1300, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:2000, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:2000, y:2100, dir:'line', view:1},
                    {type:'frame', id:'fp4', x:1300, y:2100, dir:'line', view:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  gridId: 0,
                  openDir: [1, 4],
                  handlePos: 4
                }
              ]
            }

          ]

        }));
      },



      getTemplatesBalcony: function(callback) {
        callback(new OkResult({

          balconies: [
            {
              name: 'Трехстворчатое',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
//------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'frame',
                  parent: 'block_0',
                  children: ['block_2', 'block_3'],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip1', x:700, y:0, dir:'line'},
                      {type:'impost', id:'ip1', x:700, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:2100, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:2100, y:1400, dir:'line', view:1, sill:1},
                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
//------- Level 2
                {
                  type:'skylight',
                  id:'block_2',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                },
                {
                  type:'skylight',
                  id:'block_3',
                  level: 2,
                  blockType: 'frame',
                  parent: 'block_1',
                  children: ['block_4', 'block_5'],
                  pointsOut: [],
                  pointsIn: [],
                  impost: {
                    impostAxis: [
                      {type:'impost', id:'ip3', x:1400, y:0, dir:'line'},
                      {type:'impost', id:'ip3', x:1400, y:1400, dir:'line'}
                    ],
                    impostOut: [],
                    impostIn : []
                  },
                  parts: [],
                  glassId: 0
                },
//------- Level 3
                {
                  type:'skylight',
                  id:'block_4',
                  level: 3,
                  blockType: 'sash',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  gridId: 0,
                  openDir: [1, 4],
                  handlePos: 4
                },
                {
                  type:'skylight',
                  id:'block_5',
                  level: 3,
                  blockType: 'frame',
                  parent: 'block_3',
                  children: [],
                  pointsOut: [],
                  pointsIn: [],
                  parts: [],
                  glassId: 0
                }
              ]
            }

          ]

        }));
      },


      getTemplatesDoor: function(callback) {
        callback(new OkResult({

          doors: [
            {
              name: 'Одностворчатая',
              details: [
                {
                  type:'skylight',
                  id:'block_0',
                  level: 0,
                  blockType:'frame',
                  children:['block_1'],
                  maxSizeLimit: 5000
                },
                //------- Level 1
                {
                  type:'skylight',
                  id:'block_1',
                  level: 1,
                  blockType:'sash',
                  parent: 'block_0',
                  children: [],
                  pointsOut: [
                    {type:'frame', id:'fp1', x:0, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp2', x:700, y:0, dir:'line', view:1},
                    {type:'frame', id:'fp3', x:700, y:2100, dir:'line', view:1},
                    {type:'frame', id:'fp4', x:0, y:2100, dir:'line', view:1}
                  ],
                  pointsIn: [],
                  parts: [],
                  glassId: 0,
                  gridId: 0,
                  openDir: [1, 4],
                  handlePos: 4
                }
              ]
            }
          ]

        }));
      },







      getAllGlass: function (callback) {
        callback(new OkResult({
          glassTypes: [
            $filter('translate')('panels.STANDART_TYPE'),
            $filter('translate')('panels.ENERGY_TYPE'),
            $filter('translate')('panels.MIRROR_TYPE'),
            $filter('translate')('panels.MAT_TYPE'),
            $filter('translate')('panels.ARMOR_TYPE')
          ],
          glasses: [
            [
              {
                glassId: 198294,//145,
                glassName: '6/12/6',
                glassUrl: 'img/glasses/glass1.png',
                glassDescrip: '1 ' + $filter('translate')('panels.CAMERa'),
                glassNoise: 4,
                heatCoeff: 0.35,
                airCoeff: 9,
                glassPrice: 406
              },
              {
                glassId: 142,
                glassName: '4/16/4',
                glassUrl: 'img/glasses/glass1.png',
                glassDescrip: '1 ' + $filter('translate')('panels.CAMERa'),
                glassNoise: 2,
                heatCoeff: 0.32,
                airCoeff: 9,
                glassPrice: 210
              },
              {
                glassId: 146,
                glassName: '4/10/4/10/4',
                glassUrl: 'img/glasses/glass2.png',
                glassDescrip: '2 ' + $filter('translate')('panels.CAMER'),
                glassNoise: 4,
                heatCoeff: 0.5,
                airCoeff: 9,
                glassPrice: 325
              },
              {
                glassId: 147,
                glassName: '4/8/4/12/4',
                glassUrl: 'img/glasses/glass2.png',
                glassDescrip: '2 ' + $filter('translate')('panels.CAMER'),
                glassNoise: 4,
                heatCoeff: 0.5,
                airCoeff: 9,
                glassPrice: 325
              }
            ],
            [
              {
                glassId: 153,
                glassName: '4/16/4i',
                glassUrl: 'img/glasses/glass10.png',
                glassDescrip: '1 '+ $filter('translate')('panels.CAMERa') + $filter('translate')('panels.ENERGY_SAVE'),
                glassNoise: 2,
                heatCoeff: 0.59,
                airCoeff: 9,
                glassPrice:  245
              },
              {
                glassId: 208,
                glassName: '4/16argon/4i',
                glassUrl: 'img/glasses/glass10.png',
                glassDescrip: '1 '+ $filter('translate')('panels.CAMERa') + $filter('translate')('panels.ENERGY_SAVE'),
                glassNoise: 2,
                heatCoeff: 0.68,
                airCoeff: 9,
                glassPrice:  257
              },
              {
                glassId: 156,
                glassName: '4/10/4/10/4i',
                glassUrl: 'img/glasses/glass20.png',
                glassDescrip: '2 '+ $filter('translate')('panels.CAMER') + $filter('translate')('panels.ENERGY_SAVE'),
                glassNoise: 4,
                heatCoeff: 0.66,
                airCoeff: 9,
                glassPrice: 370
              },
              {
                glassId: 207,
                glassName: '4i/10/4/10/4i',
                glassUrl: 'img/glasses/glass20.png',
                glassDescrip: '2 '+ $filter('translate')('panels.CAMER') + $filter('translate')('panels.ENERGY_SAVE'),
                glassNoise: 4,
                heatCoeff: 0.82,
                airCoeff: 9,
                glassPrice: 465
              }
            ],
            [
              {
                glassId: 163,
                glassName: '4/16/4',
                glassUrl: 'img/glasses/glass1.png',
                glassDescrip: '1 '+ $filter('translate')('panels.CAMERa'),
                glassNoise: 2,
                heatCoeff: 0.32,
                airCoeff: 9,
                glassPrice:  678
              },
              {
                glassId: 167,
                glassName: '4/10/4/10/4',
                glassUrl: 'img/glasses/glass2.png',
                glassDescrip: '2 '+ $filter('translate')('panels.CAMER'),
                glassNoise: 4,
                heatCoeff: 0.5,
                airCoeff: 9,
                glassPrice: 793
              }
            ],
            [
              {
                glassId: 171,
                glassName: '4/16/4',
                glassUrl: 'img/glasses/glass1.png',
                glassDescrip: '1 '+ $filter('translate')('panels.CAMERa'),
                glassNoise: 2,
                heatCoeff: 0.32,
                airCoeff: 9,
                glassPrice: 678
              },
              {
                glassId: 174,
                glassName: '4/10/4/10/4',
                glassUrl: 'img/glasses/glass2.png',
                glassDescrip: '2 '+ $filter('translate')('panels.CAMER'),
                glassNoise: 4,
                heatCoeff: 0.5,
                airCoeff: 9,
                glassPrice:  793
              }
            ],
            [
              {
                glassId: 182,
                glassName: 'Бр. 2сл.(225мк) 4/16/4',
                glassUrl: 'img/glasses/glass1.png',
                glassDescrip: '1 '+ $filter('translate')('panels.CAMERa'),
                glassNoise: 2,
                heatCoeff: 0.37,
                airCoeff: 9,
                glassPrice: 1038
              },
              {
                glassId: 186,
                glassName: 'Бр. 3сл.(336мк) 6/12/6',
                glassUrl: 'img/glasses/glass1.png',
                glassDescrip: '1 '+ $filter('translate')('panels.CAMERa'),
                glassNoise: 4,
                heatCoeff: 0.39,
                airCoeff: 9,
                glassPrice: 1234
              },
              {
                glassId: 177,
                glassName: 'Бр. 2сл.(225мк) 4/10/4/10/4',
                glassUrl: 'img/glasses/glass2.png',
                glassDescrip: '2 '+ $filter('translate')('panels.CAMER'),
                glassNoise: 4,
                heatCoeff: 0.54,
                airCoeff: 9,
                glassPrice: 1153
              },
              {
                glassId: 221,
                glassName: 'Бр. 3сл.(336мк) 4/10/4/10/4',
                glassUrl: 'img/glasses/glass2.png',
                glassDescrip: '2 '+ $filter('translate')('panels.CAMER'),
                glassNoise: 4,
                heatCoeff: 0.54,
                airCoeff: 9,
                glassPrice: 1321
              }
            ]
          ]
        }));
      },

      getAllHardware: function (callback) {
        callback(new OkResult({
          hardwaresTypes: [
            'AXOR',
            $filter('translate')('panels.OTHER_TYPE')
          ],
          hardwares: [
            [
              {
                hardwareId: 20,
                hardwareName: 'Komfort Line K-3',
                hardwareProducer: 'AXOR',
                hardwareCountry: $filter('translate')('panels.UKRAINE'),
                hardwareLogo: 'img/hardware-logos/axor.png',
                hardwareLink: '#',
                hardwareNoise: 4,
                heatCoeff: 4,
                airCoeff: 5,
                hardwarePrice: 150
              }
            ],
            [
               {
                hardwareId: 21,
                hardwareName: 'Roto NT',
                hardwareProducer: 'Roto',
                hardwareCountry: $filter('translate')('panels.GERMANY'),
                hardwareLogo: 'img/hardware-logos/roto.png',
                hardwareLink: '#',
                hardwareNoise: 4,
                heatCoeff: 5,
                airCoeff: 9,
                hardwarePrice: 250
              },
              {
                hardwareId: 22,
                hardwareName: 'MACO MULTI TREND',
                hardwareProducer: 'MACO',
                hardwareCountry: $filter('translate')('panels.AUSTRIA'),
                hardwareLogo: 'img/hardware-logos/maco.png',
                hardwareLink: '#',
                hardwareNoise: 5,
                heatCoeff: 4,
                airCoeff: 3,
                hardwarePrice: 290
              }
            ]
          ]
        }));
      },




      getAllGrids: function (callback) {
        callback(new OkResult({

          elementType: [
            $filter('translate')('panels.INNER_TYPE'),
            $filter('translate')('panels.OUTER_TYPE')
          ],
          elementsList: [
            [
              {
                elementId: 4030,
                elementName: $filter('translate')('add_elements.GRID') + ' СO-100',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 585,
                elementName: $filter('translate')('add_elements.GRID') + ' СO-200',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 585,
                elementName: $filter('translate')('add_elements.GRID') + ' СO-200',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 585,
                elementName: $filter('translate')('add_elements.GRID') + ' СO-300',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 585,
                elementName: $filter('translate')('add_elements.GRID') + ' СO-300',
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },

      getAllVisors: function (callback) {
        callback(new OkResult({

          elementType: [
            $filter('translate')('panels.STANDART_TYPE'),
            $filter('translate')('panels.GALVAN_TYPE'),
            $filter('translate')('panels.MAT_TYPE')
          ],
          elementsList: [
            [
              {
                elementId: 210675,
                elementName: $filter('translate')('panels.VISOR_ITEM') + ' 100' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementQty: 1
              },
              {
                elementId: 210676,
                elementName: $filter('translate')('panels.VISOR_ITEM') + ' 200' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementQty: 1
              },
              {
                elementId: 210677,
                elementName: $filter('translate')('panels.VISOR_ITEM') + ' 300' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementQty: 1
              }
            ],
            [
              {
                elementId: 210687,
                elementName: $filter('translate')('panels.VISOR_ITEM2') + ' 100' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementQty: 1
              },
              {
                elementId: 210693,
                elementName: $filter('translate')('panels.VISOR_ITEM2') + ' 200' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementQty: 1
              },
              {
                elementId: 210694,
                elementName: $filter('translate')('panels.VISOR_ITEM2') + ' 300' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementQty: 1
              },
              {
                elementId: 210695,
                elementName: $filter('translate')('panels.VISOR_ITEM2') + ' 400' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementQty: 1
              },
              {
                elementId: 210696,
                elementName: $filter('translate')('panels.VISOR_ITEM2') + ' 500' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementQty: 1
              }
            ],
            [
              {
                elementId: 210697,
                elementName: $filter('translate')('panels.VISOR_ITEM3'),
                elementWidth: 1500,
                elementQty: 1
              }
            ]
          ]

        }));
      },

      getAllSpillways: function (callback) {
        callback(new OkResult({

          elementType: [
            $filter('translate')('panels.STANDART_TYPE'),
            $filter('translate')('panels.GALVAN_TYPE'),
            $filter('translate')('panels.NO_STANDART_TYPE')
          ],
          elementsList: [
            [
              {
                elementId: 497,
                elementName: $filter('translate')('panels.OUTFLOW_W') + ' КO-200',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 498,
                elementName: $filter('translate')('panels.OUTFLOW_B') + ' 260' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 547,
                elementName: $filter('translate')('panels.OUTFLOW_G') +' 20' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 571,
                elementName: $filter('translate')('panels.OUTFLOW_G') +' 50' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 540,
                elementName: $filter('translate')('panels.OUTFLOW_NO_STANDART'),
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },

      getAllOutsideSlope: function (callback) {
        callback(new OkResult({

          elementType: [
            $filter('translate')('panels.STANDART_TYPE')
          ],
          elementsList: [
            [
              {
                elementId: 89349,
                elementName: $filter('translate')('panels.SLOPE_P'),
                elementWidth: 200,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 89350,
                elementName: $filter('translate')('panels.SLOPE_G'),
                elementWidth: 200,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 89351,
                elementName: $filter('translate')('panels.SLOPE_C'),
                elementWidth: 200,
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },


      getAllInsideSlope: function (callback) {
        callback(new OkResult({

          elementType: [
            $filter('translate')('panels.STANDART_TYPE')
          ],
          elementsList: [
            [
              {
                elementId: 89349,
                elementName: $filter('translate')('panels.SLOPE_P'),
                elementWidth: 200,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 89350,
                elementName: $filter('translate')('panels.SLOPE_G'),
                elementWidth: 200,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 89351,
                elementName: $filter('translate')('panels.SLOPE_C'),
                elementWidth: 200,
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },


      getAllLouvers: function (callback) {
        callback(new OkResult({

          elementType: [
            $filter('translate')('panels.STANDART_TYPE'),
            $filter('translate')('panels.GALVAN_TYPE'),
            $filter('translate')('panels.MAT_TYPE')
          ],
          elementsList: [
            [
              {
                elementId: 1,
                elementName: $filter('translate')('add_elements.LOUVERS') + ' КO-200',
                elementWidth: 700,
                elementHeight: 700,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementName: $filter('translate')('add_elements.LOUVERS') + ' КO-300',
                elementWidth: 700,
                elementHeight: 700,
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 1,
                elementName: $filter('translate')('add_elements.LOUVERS') + ' КO-100',
                elementWidth: 700,
                elementHeight: 700,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementName: $filter('translate')('add_elements.LOUVERS') + ' КO-300',
                elementWidth: 700,
                elementHeight: 700,
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 1,
                elementName: $filter('translate')('add_elements.LOUVERS') + ' КO-300',
                elementWidth: 700,
                elementHeight: 700,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementName: $filter('translate')('add_elements.LOUVERS') + ' КO-300',
                elementWidth: 700,
                elementHeight: 700,
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },


      getAllConnectors: function (callback) {
        callback(new OkResult({

          elementType: [
            $filter('translate')('panels.STANDART_TYPE'),
            $filter('translate')('panels.FORCED_TYPE'),
            $filter('translate')('panels.BALCON_TYPE')
          ],
          elementsList: [
            [
              {
                elementId: 577,
                elementName:  $filter('translate')('panels.CONNECTOR_S') + ' 5/10',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 577,
                elementName: $filter('translate')('panels.CONNECTOR_S') + ' 3/10',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 577,
                elementName: $filter('translate')('panels.CONNECTOR_F') + ' 5/13',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 577,
                elementName: $filter('translate')('panels.CONNECTOR_B') + ' 5/13',
                elementWidth: 1500,
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },

      getAllFans: function (callback) {
        callback(new OkResult({

          elementType: [
            $filter('translate')('panels.STANDART_TYPE'),
            'GECCO',
            'Aereco'
          ],
          elementsList: [
            [
              {
                elementId: 1,
                elementName: $filter('translate')('panels.FAN1'),
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementName: $filter('translate')('panels.FAN2'),
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 1,
                elementName: $filter('translate')('panels.FAN3'),
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementName: $filter('translate')('panels.FAN4'),
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 1,
                elementName: $filter('translate')('panels.FAN5'),
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },

      getAllWindowSills: function (callback) {
        callback(new OkResult({

          elementType: [
            'LIGNODUR',
            'DANKE',
            'OpenTeck'
          ],
          elementsList: [
            [
              {
                elementId: 333,
                elementName: 'LIGNODUR 200' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 334,
                elementName: 'LIGNODUR 300' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 335,
                elementName: 'LIGNODUR 400' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 341,
                elementName: 'DANKE 100' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 342,
                elementName: 'DANKE 300' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 301,
                elementName: 'OpenTeck 100' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 302,
                elementName: 'OpenTeck 200' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 303,
                elementName: 'OpenTeck 300' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 304,
                elementName: 'OpenTeck 400' + $filter('translate')('mainpage.MM'),
                elementWidth: 1500,
                elementHeight: 1500,
                elementColorId: 'matt',
                elementColor: 'img/lamination/empty.png',
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },

      getAllHandles: function (callback) {
        callback(new OkResult({

          elementType: [
            $filter('translate')('panels.STANDART_TYPE'),
            'HOPPE',
            $filter('translate')('panels.NO_STANDART_TYPE')
          ],
          elementsList: [
            [
              {
                elementId: 586,
                elementName:  $filter('translate')('panels.HANDLE1'),
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 587,
                elementName: $filter('translate')('panels.HANDLE2'),
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 588,
                elementName: $filter('translate')('panels.HANDLE3'),
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 589,
                elementName: $filter('translate')('panels.HANDLE4'),
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 586,
                elementName: $filter('translate')('panels.HANDLE5'),
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },


      getAllOthers: function (callback) {
        callback(new OkResult({

          elementType: [
            $filter('translate')('panels.STANDART_TYPE'),
            $filter('translate')('panels.FORCED_TYPE'),
            $filter('translate')('panels.BALCON_TYPE')
          ],
          elementsList: [
            [
              {
                elementId: 1,
                elementName: $filter('translate')('panels.OTHER1') + ' 40х40',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementName: $filter('translate')('panels.OTHER2'),
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 3,
                elementName: $filter('translate')('panels.OTHER3') + ' 170 (481-600), KS',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 1,
                elementName: $filter('translate')('panels.OTHER4') + ' 15х30',
                elementQty: 1,
                elementPrice: 100
              },
              {
                elementId: 2,
                elementName: $filter('translate')('panels.OTHER5') + ' K3/100',
                elementQty: 1,
                elementPrice: 100
              }
            ],
            [
              {
                elementId: 1,
                elementName: $filter('translate')('panels.OTHER6'),
                elementQty: 1,
                elementPrice: 100
              }
            ]
          ]

        }));
      },

      getLaminationAddElements: function (callback) {
        callback(new OkResult({
          laminationWhiteMatt: {
            laminationName: $filter('translate')('panels.LAM_WHITE'),
            laminationLabel: $filter('translate')('panels.LAM_MAT'),
            laminationUrl: 'img/lamination/empty.png'
          },
          laminationWhiteGlossy: {
            laminationName: $filter('translate')('panels.LAM_WHITE'),
            laminationLabel: $filter('translate')('panels.LAM_GLOSSY'),
            laminationUrl: 'img/lamination/empty.png'
          },
          laminations: [
            {
              laminationId: 1,
              laminationName: $filter('translate')('panels.LAM_LIGHT_OAK'),
              laminationUrl: 'img/lamination/343551.png',
              laminationPrice: 100
            },
            {
              laminationId: 2,
              laminationName: $filter('translate')('panels.LAM_GOLD_OAK'),
              laminationUrl: 'img/lamination/343552.png',
              laminationPrice: 100
            },
            {
              laminationId: 3,
              laminationName: $filter('translate')('panels.LAM_BIRCH'),
              laminationUrl: 'img/lamination/343553.png',
              laminationPrice: 100
            },
            {
              laminationId: 4,
              laminationName: $filter('translate')('panels.LAM_MAHAGON'),
              laminationUrl: 'img/lamination/343554.png',
              laminationPrice: 100
            },
            {
              laminationId: 5,
              laminationName: $filter('translate')('panels.LAM_PINE'),
              laminationUrl: 'img/lamination/343555.png',
              laminationPrice: 100
            }
          ]
        }));
      },


      getFloorPrice: function (callback) {
        callback(new OkResult({

          floors: [
            {
              name: 1,
              price: 100
            },
            {
              name: 2,
              price: 200
            },
            {
              name: 3,
              price: 300
            },
            {
              name: 4,
              price: 400
            },
            {
              name: 5,
              price: 500
            }
          ]

        }));
      },

      getAssemblingPrice: function (callback) {
        callback(new OkResult({

          assembling: [
            {
              name: $filter('translate')('cart.NO_DISASSEMBL'),
              price: 200
            },
            {
              name: $filter('translate')('cart.STANDART_ASSEMBL'),
              price: 300
            },
            {
              name: $filter('translate')('cart.VIP_ASSEMBL'),
              price: 400
            }
          ]

        }));
      },

      getInstalment: function (callback) {
        callback(new OkResult({

          instalment: [
            {
              period: 1,
              percent: 15
            },
            {
              period: 2,
              percent: 20
            },
            {
              period: 3,
              percent: 25
            },
            {
              period: 4,
              percent: 30
            },
            {
              period: 5,
              percent: 35
            }
          ]

        }));
      },

      getDoorConfig: function (callback) {
        callback(new OkResult({

          doorType: [
            {
              shapeId: 1,
              shapeLabel: $filter('translate')('panels.DOOR_TYPE1'),
              shapeIcon: 'img/door-config/doorstep.png',
              shapeIconSelect: 'img/door-config-selected/doorstep.png'
            },
            {
              shapeId: 2,
              shapeLabel: $filter('translate')('panels.DOOR_TYPE2'),
              shapeIcon: 'img/door-config/no-doorstep.png',
              shapeIconSelect: 'img/door-config-selected/no-doorstep.png'
            },
            {
              shapeId: 3,
              shapeLabel: $filter('translate')('panels.DOOR_TYPE3') + '1',
              shapeIcon: 'img/door-config/doorstep-al1.png',
              shapeIconSelect: 'img/door-config-selected/doorstep-al1.png'
            },
            {
              shapeId: 4,
              shapeLabel: $filter('translate')('panels.DOOR_TYPE3')+ '2',
              shapeIcon: 'img/door-config/doorstep-al2.png',
              shapeIconSelect: 'img/door-config-selected/doorstep-al2.png'
            }
          ],

          sashType: [
            {
              shapeId: 1,
              shapeLabel: $filter('translate')('panels.SASH_TYPE1') + ', 98' + $filter('translate')('mainpage.MM')
            },
            {
              shapeId: 2,
              shapeLabel: $filter('translate')('panels.SASH_TYPE2') + ', 116' + $filter('translate')('mainpage.MM')
            },
            {
              shapeId: 3,
              shapeLabel: $filter('translate')('panels.SASH_TYPE3') +', 76' + $filter('translate')('mainpage.MM')
            }
          ],

          handleType: [
            {
              shapeId: 1,
              shapeLabel: $filter('translate')('panels.HANDLE_TYPE1'),
              shapeIcon: 'img/door-config/lever-handle.png',
              shapeIconSelect: 'img/door-config-selected/lever-handle.png'
            },
            {
              shapeId: 2,
              shapeLabel: $filter('translate')('panels.HANDLE_TYPE2'),
              shapeIcon: 'img/door-config/standart-handle.png',
              shapeIconSelect: 'img/door-config-selected/standart-handle.png'
            }
          ],

          lockType: [
            {
              shapeId: 1,
              shapeLabel: $filter('translate')('panels.LOCK_TYPE1'),
              shapeIcon: 'img/door-config/onelock.png',
              shapeIconSelect: 'img/door-config-selected/onelock.png'
            },
            {
              shapeId: 2,
              shapeLabel: $filter('translate')('panels.LOCK_TYPE2'),
              shapeIcon: 'img/door-config/multilock.png',
              shapeIconSelect: 'img/door-config-selected/multilock.png'
            }
          ]


        }));
      }



    }


  }
})();

