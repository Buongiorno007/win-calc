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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassTxt: '',
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassTxt: '',
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassId: 0,
                  glassTxt: ''
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
                  glassTxt: '',
                  gridId: 0,
                  openDir: [1, 4],
                  handlePos: 4
                }
              ]
            }
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
                element_id: 4030,
                element_name: $filter('translate')('add_elements.GRID') + ' СO-100',
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 585,
                element_name: $filter('translate')('add_elements.GRID') + ' СO-200',
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 585,
                element_name: $filter('translate')('add_elements.GRID') + ' СO-200',
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 585,
                element_name: $filter('translate')('add_elements.GRID') + ' СO-300',
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 585,
                element_name: $filter('translate')('add_elements.GRID') + ' СO-300',
                element_qty: 1,
                element_price: 100
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
                element_id: 210675,
                element_name: $filter('translate')('panels.VISOR_ITEM') + ' 100' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_qty: 1
              },
              {
                element_id: 210676,
                element_name: $filter('translate')('panels.VISOR_ITEM') + ' 200' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_qty: 1
              },
              {
                element_id: 210677,
                element_name: $filter('translate')('panels.VISOR_ITEM') + ' 300' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_qty: 1
              }
            ],
            [
              {
                element_id: 210687,
                element_name: $filter('translate')('panels.VISOR_ITEM2') + ' 100' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_qty: 1
              },
              {
                element_id: 210693,
                element_name: $filter('translate')('panels.VISOR_ITEM2') + ' 200' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_qty: 1
              },
              {
                element_id: 210694,
                element_name: $filter('translate')('panels.VISOR_ITEM2') + ' 300' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_qty: 1
              },
              {
                element_id: 210695,
                element_name: $filter('translate')('panels.VISOR_ITEM2') + ' 400' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_qty: 1
              },
              {
                element_id: 210696,
                element_name: $filter('translate')('panels.VISOR_ITEM2') + ' 500' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_qty: 1
              }
            ],
            [
              {
                element_id: 210697,
                element_name: $filter('translate')('panels.VISOR_ITEM3'),
                element_width: 1500,
                element_qty: 1
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
                element_id: 497,
                element_name: $filter('translate')('panels.OUTFLOW_W') + ' КO-200',
                element_width: 1500,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 498,
                element_name: $filter('translate')('panels.OUTFLOW_B') + ' 260' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 547,
                element_name: $filter('translate')('panels.OUTFLOW_G') +' 20' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 571,
                element_name: $filter('translate')('panels.OUTFLOW_G') +' 50' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 540,
                element_name: $filter('translate')('panels.OUTFLOW_NO_STANDART'),
                element_width: 1500,
                element_qty: 1,
                element_price: 100
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
                element_id: 89349,
                element_name: $filter('translate')('panels.SLOPE_P'),
                element_width: 200,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 89350,
                element_name: $filter('translate')('panels.SLOPE_G'),
                element_width: 200,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 89351,
                element_name: $filter('translate')('panels.SLOPE_C'),
                element_width: 200,
                element_qty: 1,
                element_price: 100
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
                element_id: 89349,
                element_name: $filter('translate')('panels.SLOPE_P'),
                element_width: 200,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 89350,
                element_name: $filter('translate')('panels.SLOPE_G'),
                element_width: 200,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 89351,
                element_name: $filter('translate')('panels.SLOPE_C'),
                element_width: 200,
                element_qty: 1,
                element_price: 100
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
                element_id: 1,
                element_name: $filter('translate')('add_elements.LOUVERS') + ' КO-200',
                element_width: 700,
                element_height: 700,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 2,
                element_name: $filter('translate')('add_elements.LOUVERS') + ' КO-300',
                element_width: 700,
                element_height: 700,
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 1,
                element_name: $filter('translate')('add_elements.LOUVERS') + ' КO-100',
                element_width: 700,
                element_height: 700,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 2,
                element_name: $filter('translate')('add_elements.LOUVERS') + ' КO-300',
                element_width: 700,
                element_height: 700,
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 1,
                element_name: $filter('translate')('add_elements.LOUVERS') + ' КO-300',
                element_width: 700,
                element_height: 700,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 2,
                element_name: $filter('translate')('add_elements.LOUVERS') + ' КO-300',
                element_width: 700,
                element_height: 700,
                element_qty: 1,
                element_price: 100
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
                element_id: 577,
                element_name:  $filter('translate')('panels.CONNECTOR_S') + ' 5/10',
                element_width: 1500,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 577,
                element_name: $filter('translate')('panels.CONNECTOR_S') + ' 3/10',
                element_width: 1500,
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 577,
                element_name: $filter('translate')('panels.CONNECTOR_F') + ' 5/13',
                element_width: 1500,
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 577,
                element_name: $filter('translate')('panels.CONNECTOR_B') + ' 5/13',
                element_width: 1500,
                element_qty: 1,
                element_price: 100
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
                element_id: 1,
                element_name: $filter('translate')('panels.FAN1'),
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 2,
                element_name: $filter('translate')('panels.FAN2'),
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 1,
                element_name: $filter('translate')('panels.FAN3'),
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 2,
                element_name: $filter('translate')('panels.FAN4'),
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 1,
                element_name: $filter('translate')('panels.FAN5'),
                element_qty: 1,
                element_price: 100
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
                element_id: 333,
                element_name: 'LIGNODUR 200' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_height: 1500,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 334,
                element_name: 'LIGNODUR 300' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_height: 1500,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 335,
                element_name: 'LIGNODUR 400' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_height: 1500,
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 341,
                element_name: 'DANKE 100' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_height: 1500,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 342,
                element_name: 'DANKE 300' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_height: 1500,
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 301,
                element_name: 'OpenTeck 100' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_height: 1500,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 302,
                element_name: 'OpenTeck 200' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_height: 1500,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 303,
                element_name: 'OpenTeck 300' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_height: 1500,
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 304,
                element_name: 'OpenTeck 400' + $filter('translate')('mainpage.MM'),
                element_width: 1500,
                element_height: 1500,
                element_qty: 1,
                element_price: 100
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
                element_id: 586,
                element_name:  $filter('translate')('panels.HANDLE1'),
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 587,
                element_name: $filter('translate')('panels.HANDLE2'),
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 588,
                element_name: $filter('translate')('panels.HANDLE3'),
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 589,
                element_name: $filter('translate')('panels.HANDLE4'),
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 586,
                element_name: $filter('translate')('panels.HANDLE5'),
                element_qty: 1,
                element_price: 100
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
                element_id: 1,
                element_name: $filter('translate')('panels.OTHER1') + ' 40х40',
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 2,
                element_name: $filter('translate')('panels.OTHER2'),
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 3,
                element_name: $filter('translate')('panels.OTHER3') + ' 170 (481-600), KS',
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 1,
                element_name: $filter('translate')('panels.OTHER4') + ' 15х30',
                element_qty: 1,
                element_price: 100
              },
              {
                element_id: 2,
                element_name: $filter('translate')('panels.OTHER5') + ' K3/100',
                element_qty: 1,
                element_price: 100
              }
            ],
            [
              {
                element_id: 1,
                element_name: $filter('translate')('panels.OTHER6'),
                element_qty: 1,
                element_price: 100
              }
            ]
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
