(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('BauVoiceApp')
        .factory('optionsServ',

            function ($filter, globalConstants) {
                if (globalConstants.serverIP === "https://admin.rehauselected.baueffect.com") {
                    return {
                        getTemplateImgIcons: function (callback) {
                            callback(new OkResult({
                                templateImgs: [
                                    //Одностворчатые --------------------!!
                                    //Глухое
                                    {
                                        id: 1,
                                        name: $filter('translate')('panels.1_TYPE'),
                                        src: 'img/templates/1.png',
                                        type: 1
                                    },
                                    //Поворотно-откидное
                                    {
                                        id: 4,
                                        name: $filter('translate')('panels.3_TYPE'),
                                        src: 'img/templates/3.png',
                                        type: 1
                                    },
                                    //Поворотно откидное левое
                                    {
                                        id: 5,
                                        name: $filter('translate')('panels.39_TYPE'),
                                        src: 'img/templates/39.png',
                                        type: 1
                                    },
                                    //Фрамуга
                                    {
                                        id: 6,
                                        name: $filter('translate')('panels.38_TYPE'),
                                        src: 'img/templates/38.png',
                                        type: 1
                                    },
                                    //Двустворчатые --------------------!!
                                    //Глухое с импостом 
                                    {
                                        id: 5,
                                        name: $filter('translate')('panels.4_TYPE'),
                                        src: 'img/templates/4.png',
                                        type: 1
                                    },
                                    //Поворотное с импостом 
                                    {
                                        id: 7,
                                        name: $filter('translate')('panels.6_TYPE'),
                                        src: 'img/templates/6.png',
                                        type: 1
                                    },
                                    //
                                    {
                                        id: 8,
                                        name: $filter('translate')('panels.41_TYPE'),
                                        src: 'img/templates/41.png',
                                        type: 1
                                    },

                                    //Двухстворчатое пов.откидное
                                    {
                                        id: 9,
                                        name: $filter('translate')('panels.40_TYPE'),
                                        src: 'img/templates/40.png',
                                        type: 1
                                    },
                                    //Штульповая
                                    {
                                        id: 10,
                                        name: $filter('translate')('panels.8_TYPE'),
                                        src: 'img/templates/8.png',
                                        type: 1
                                    },
                                    //Штульповое левое 
                                    {
                                        id: 11,
                                        name: $filter('translate')('panels.37_TYPE'),
                                        src: 'img/templates/37.png',
                                        type: 1
                                    },
                                    //Трехстворчатые --------------------!!
                                    //Глухое с импостами
                                    {
                                        id: 12,
                                        name: $filter('translate')('panels.9_TYPE'),
                                        src: 'img/templates/9.png',
                                        type: 1
                                    },
                                    //Поворотно-откидное с импостами 
                                    {
                                        id: 13,
                                        name: $filter('translate')('panels.11_TYPE'),
                                        src: 'img/templates/11.png',
                                        type: 1
                                    },
                                    {
                                        id: 14,
                                        name: $filter('translate')('panels.33_TYPE'),
                                        src: 'img/templates/33.png',
                                        type: 1
                                    },
                                    {
                                        id: 15,
                                        name: $filter('translate')('panels.34_TYPE'),
                                        src: 'img/templates/34.png',
                                        type: 1
                                    },
                                    {
                                        id: 16,
                                        name: $filter('translate')('panels.35_TYPE'),
                                        src: 'img/templates/35.png',
                                        type: 1
                                    },
                                    {
                                        id: 17,
                                        name: $filter('translate')('panels.36_TYPE'),
                                        src: 'img/templates/36.png',
                                        type: 1
                                    },
                                    //Окна Т-образные
                                    //Т-обр. штульповое
                                    {
                                        id: 18,
                                        name: $filter('translate')('panels.44_TYPE'),
                                        src: 'img/templates/44.png',
                                        type: 1
                                    },
                                    //Т-обр. штульповое
                                    {
                                        id: 19,
                                        name: $filter('translate')('panels.45_TYPE'),
                                        src: 'img/templates/45.png',
                                        type: 1
                                    },
                                    //Т-обр. правое пов.отк.
                                    {
                                        id: 20,
                                        name: $filter('translate')('panels.46_TYPE'),
                                        src: 'img/templates/46.png',
                                        type: 1
                                    },
                                    //Т-обр. правое пов.отк.
                                    {
                                        id: 21,
                                        name: $filter('translate')('panels.47_TYPE'),
                                        src: 'img/templates/47.png',
                                        type: 1
                                    },
                                    //Т-обр. пов.откидное
                                    {
                                        id: 22,
                                        name: $filter('translate')('panels.48_TYPE'),
                                        src: 'img/templates/48.png',
                                        type: 1
                                    },
                                    //Т-обр. пов.откидное
                                    {
                                        id: 23,
                                        name: $filter('translate')('panels.49_TYPE'),
                                        src: 'img/templates/49.png',
                                        type: 1
                                    },
                                    //Т-обр. левое пов.отк.
                                    {
                                        id: 24,
                                        name: $filter('translate')('panels.50_TYPE'),
                                        src: 'img/templates/50.png',
                                        type: 1
                                    },
                                    //Т-обр. левое пов.отк.
                                    {
                                        id: 25,
                                        name: $filter('translate')('panels.51_TYPE'),
                                        src: 'img/templates/51.png',
                                        type: 1
                                    },
                                    //Т-обр. глухое
                                    {
                                        id: 26,
                                        name: $filter('translate')('panels.52_TYPE'),
                                        src: 'img/templates/52.png',
                                        type: 1
                                    },
                                    //Т-обр. глухое
                                    {
                                        id: 27,
                                        name: $filter('translate')('panels.53_TYPE'),
                                        src: 'img/templates/53.png',
                                        type: 1
                                    },
                                    // Балконные двери 
                                    {
                                        id: 28,
                                        name: $filter('translate')('panels.21_TYPE'),
                                        src: 'img/templates/21.png',
                                        type: 1
                                    },
                                    //Балк.дверь пов.отк. левая
                                    {
                                        id: 29,
                                        name: $filter('translate')('panels.43_TYPE'),
                                        src: 'img/templates/43.png',
                                        type: 1
                                    },
                                    {
                                        id: 30,
                                        name: $filter('translate')('panels.23_TYPE'),
                                        src: 'img/templates/23.png',
                                        type: 1
                                    },
                                    //Штульповая балк.дверь левая
                                    {
                                        id: 31,
                                        name: $filter('translate')('panels.42_TYPE'),
                                        src: 'img/templates/42.png',
                                        type: 1
                                    },
                                    
                                ]
                            }));
                        },
    
    
                        getTemplatesWindow: function (callback) {
                            callback(new OkResult({
                                windows: [
                                    {
                                        name: 'Глухое',
                                        details: [
                                            {
                                                type: 'skylight',
                                                id: 'block_0',
                                                level: 0,
                                                blockType: 'frame',
                                                children: ['block_1'],
                                                maxSizeLimit: 5000
                                            },
                                            //------- Level 1
                                            {
                                                type: 'skylight',
                                                id: 'block_1',
                                                level: 1,
                                                blockType: 'frame',
                                                //blockType:'sash',
                                                parent: 'block_0',
                                                children: [],
                                                pointsOut: [
                                                    {type: 'frame', id: 'fp1', x: 0, y: 0, dir: 'line', view: 1},
                                                    {type: 'frame', id: 'fp2', x: 1300, y: 0, dir: 'line', view: 1},
                                                    {type: 'frame', id: 'fp3', x: 1300, y: 1400, dir: 'line', view: 1, sill: 1},
                                                    {type: 'frame', id: 'fp4', x: 0, y: 1400, dir: 'line', view: 1, sill: 1}
                                                ],
                                                pointsIn: [],
                                                pointsLight: [],
                                                parts: [],
                                                glassId: 0,
                                                glassTxt: ''//,
                                                //sashType: 2,
                                                //openDir: [1]
                                            }
                                        ]
                                    },
    
                                    {
                                        name: "Поворотно-откидное",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "sash",
                                            parent: "block_0",
                                            children: [],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 700,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 700,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [1, 4],
                                            handlePos: 4,
                                            sashType: 6
                                        }],
                                        hardwareLines: [[490, 1190, 490, 1190]]
                                    },
                                    {name:"Поворотное откидное левое",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"sash",parent:"block_0",children:[],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:700,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:700,y:1400,"dir":"line","view":1,"sill":1},{"type":"frame","id":"fp4","x":0,"y":1400,"dir":"line","view":1,"sill":1}],"pointsIn":[],"pointsLight":[],"parts":[],"glassId":311891,glassTxt:"4-16-4",gridId:0,gridTxt:"",openDir:[1,2],handlePos:2,sashType:6,glass_type:1}],hardwareLines:[[594,1294,594,1294]]},

                                    {name:"Фрамуга",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"sash",parent:"block_0",children:[],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1200,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1200,y:600,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:600,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1],handlePos:1,sashType:7}],hardwareLines:[[1094,494,1094,494]]},
    
                                    {
                                        name: "Глухое с импостами",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 1300,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 1300,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 650,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 650,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }]
                                    },
    
                                    {
                                        name: "Поворотное с импостами",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 1300,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 1300,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 650,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 650,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [1, 4],
                                            handlePos: 4,
                                            sashType: 6
                                        }],
                                        hardwareLines: [[482, 1190, 482, 1190]]
                                    },
                                    {name:"Пов.откидное левое с глухой частью",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1300,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1300,y:1400,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1400,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",impost:{impostAxis:[{type:"impost",id:"ip1",x:650,y:0,dir:"line",dimType:0},{type:"impost",id:"ip1",x:650,y:1400,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]},glass_type:1},{type:"skylight",id:"block_2",level:2,blockType:"sash",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,2],handlePos:2,sashType:6},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1}],hardwareLines:[[565.5,1294,565.5,1294]]},
                                    //
                                    {name:"Двухстворчатое пов.откидное",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1300,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1300,y:1400,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1400,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",impost:{impostAxis:[{type:"impost",id:"ip1",x:650,y:0,dir:"line",dimType:0},{type:"impost",id:"ip1",x:650,y:1400,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]},glass_type:1},{type:"skylight",id:"block_2",level:2,blockType:"sash",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,2],handlePos:2,sashType:6},{type:"skylight",id:"block_3",level:2,blockType:"sash",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,4],handlePos:4,sashType:6}],hardwareLines:[[565.5,1294,565.5,1294]]},
                                    
                                    {
                                        name: "Штульповое",
                                        details: [
                                            {
                                                type: "skylight",
                                                id: "block_0",
                                                level: 0,
                                                blockType: "frame",
                                                children: ["block_1"],
                                                maxSizeLimit: 5000
                                            }, {
                                                type: "skylight",
                                                id: "block_1",
                                                level: 1,
                                                blockType: "frame",
                                                parent: "block_0",
                                                children: ["block_2", "block_3"],
                                                pointsOut: [
                                                    {
                                                        type: "frame",
                                                        id: "fp1",
                                                        x: 0,
                                                        y: 0,
                                                        dir: "line",
                                                        view: 1
                                                    }, {
                                                        type: "frame",
                                                        id: "fp2",
                                                        x: 1300,
                                                        y: 0,
                                                        dir: "line",
                                                        view: 1
                                                    }, {
                                                        type: "frame",
                                                        id: "fp3",
                                                        x: 1300,
                                                        y: 1400,
                                                        dir: "line",
                                                        view: 1,
                                                        sill: 1
                                                    }, {
                                                        type: "frame",
                                                        id: "fp4",
                                                        x: 0,
                                                        y: 1400,
                                                        dir: "line",
                                                        view: 1,
                                                        sill: 1
                                                    }],
                                                pointsIn: [],
                                                pointsLight: [],
                                                parts: [],
                                                glassId: 311891,
                                                glassTxt: "4-16-4",
                                                impost: {
                                                    impostAxis: [{
                                                        type: "shtulp",
                                                        id: "sht1",
                                                        x: 650,
                                                        y: 0,
                                                        dir: "line",
                                                        dimType: 0
                                                    }, {
                                                        type: "shtulp",
                                                        id: "sht1",
                                                        x: 650,
                                                        y: 1400,
                                                        dir: "line",
                                                        dimType: 0
                                                    }],
                                                    impostOut: [],
                                                    impostIn: [],
                                                    impostLight: []
                                                }
                                            }, {
                                                type: "skylight",
                                                id: "block_2",
                                                level: 2,
                                                blockType: "sash",
                                                parent: "block_1",
                                                children: [],
                                                pointsOut: [],
                                                pointsIn: [],
                                                pointsLight: [],
                                                parts: [],
                                                glassId: 311891,
                                                glassTxt: "4-16-4",
                                                openDir: [2],
                                                handlePos: 0,
                                                sashType: 4
                                            }, {
                                                type: "skylight",
                                                id: "block_3",
                                                level: 2,
                                                blockType: "sash",
                                                parent: "block_1",
                                                children: [],
                                                pointsOut: [],
                                                pointsIn: [],
                                                pointsLight: [],
                                                parts: [],
                                                glassId: 311891,
                                                glassTxt: "4-16-4",
                                                openDir: [1, 4],
                                                handlePos: 4,
                                                sashType: 17
                                            }],
                                        hardwareLines: [[497, 1190, 497, 1190]]
                                    },

                                    {name:"Штульповое левое",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1300,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1300,y:1400,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1400,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"shtulp",id:"sht1",x:650,y:0,dir:"line",dimType:0},{type:"shtulp",id:"sht1",x:650,y:1400,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_2",level:2,blockType:"sash",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,2],handlePos:2,sashType:17},{type:"skylight",id:"block_3",level:2,blockType:"sash",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[4],handlePos:0,sashType:4}],hardwareLines:[[573.5,1294,573.5,1294]]},
    
                                    {
                                        name: "Глухое c импостами",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 2100,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 2100,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [
                                                    {
                                                        type: "impost",
                                                        id: "ip1",
                                                        x: 1400,
                                                        y: 0,
                                                        dir: "line",
                                                        dimType: 0
                                                    },
                                                    {
                                                        type: "impost",
                                                        id: "ip1",
                                                        x: 1400,
                                                        y: 1400,
                                                        dir: "line",
                                                        dimType: 0
                                                    }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: ["block_4", "block_5"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 700,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 700,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_4",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_5",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }],
                                        hardwareLines: [[497, 1190, 497, 1190]]
                                    },
    
                                    {
                                        name: "Поворотно-откидное с импостами",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 2100,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 2100,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 700,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 700,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: ["block_6", "block_7"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 1400,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 1400,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_6",
                                            level: 3,
                                            blockType: "sash",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [1, 4],
                                            handlePos: 4,
                                            sashType: 6
                                        }, {
                                            type: "skylight",
                                            id: "block_7",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }],
                                        hardwareLines: [[574, 1191, 574, 1191]]
                                    },
                                    {name:"Трёхстворчатое с левыми и правой пов.отк. ств.",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:2100,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:2100,y:1400,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1400,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",impost:{impostAxis:[{type:"impost",id:"ip1",x:700,y:0,dir:"line",dimType:0},{type:"impost",id:"ip1",x:700,y:1400,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]},glass_type:1},{type:"skylight",id:"block_2",level:2,blockType:"sash",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,2],handlePos:2,sashType:6},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:["block_6","block_7"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",impost:{impostAxis:[{type:"impost",id:"ip3",x:1400,y:0,dir:"line",dimType:0},{type:"impost",id:"ip3",x:1400,y:1400,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]},glass_type:1},{type:"skylight",id:"block_6",level:3,blockType:"sash",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,2],handlePos:2,sashType:6},{type:"skylight",id:"block_7",level:3,blockType:"sash",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,4],handlePos:4,sashType:6}],hardwareLines:[[615.5,1294,615.5,1294]]},
                                    ///
                                    {name:"Трёхстворчатое с левой и правыми пов.отк. ств.",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:2100,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:2100,y:1400,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1400,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",impost:{impostAxis:[{type:"impost",id:"ip1",x:700,y:0,dir:"line",dimType:0},{type:"impost",id:"ip1",x:700,y:1400,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]},glass_type:1},{type:"skylight",id:"block_2",level:2,blockType:"sash",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,2],handlePos:2,sashType:6},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:["block_6","block_7"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",impost:{impostAxis:[{type:"impost",id:"ip3",x:1400,y:0,dir:"line",dimType:0},{type:"impost",id:"ip3",x:1400,y:1400,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]},glass_type:1},{type:"skylight",id:"block_6",level:3,blockType:"sash",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,4],handlePos:4,sashType:6},{type:"skylight",id:"block_7",level:3,blockType:"sash",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,4],handlePos:4,sashType:6}],hardwareLines:[[615.5,1294,615.5,1294]]},
                                    ///
                                    {name:"Трёхстворчатое с левой и правой пов.отк. ств.",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:2100,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:2100,y:1400,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1400,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",impost:{impostAxis:[{type:"impost",id:"ip1",x:700,y:0,dir:"line",dimType:0},{type:"impost",id:"ip1",x:700,y:1400,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]},glass_type:1},{type:"skylight",id:"block_2",level:2,blockType:"sash",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,2],handlePos:2,sashType:6},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:["block_6","block_7"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",impost:{impostAxis:[{type:"impost",id:"ip3",x:1400,y:0,dir:"line",dimType:0},{type:"impost",id:"ip3",x:1400,y:1400,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]},glass_type:1},{type:"skylight",id:"block_6",level:3,blockType:"frame",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_7",level:3,blockType:"sash",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,4],handlePos:4,sashType:6}],hardwareLines:[[615.5,1294,615.5,1294]]},
                                    ///
                                    {name:"Трёхстворчатое с левой пов.отк. ств.",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:2100,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:2100,y:1400,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1400,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",impost:{impostAxis:[{type:"impost",id:"ip1",x:700,y:0,dir:"line",dimType:0},{type:"impost",id:"ip1",x:700,y:1400,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]},glass_type:1},{type:"skylight",id:"block_2",level:2,blockType:"frame",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:["block_6","block_7"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",impost:{impostAxis:[{type:"impost",id:"ip3",x:1400,y:0,dir:"line",dimType:0},{type:"impost",id:"ip3",x:1400,y:1400,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]},glass_type:1},{type:"skylight",id:"block_6",level:3,blockType:"sash",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",gridId:0,gridTxt:"",openDir:[1,2],handlePos:2,sashType:6,glass_type:1},{type:"skylight",id:"block_7",level:3,blockType:"frame",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1}],hardwareLines:[[637,1294,637,1294]]},
                                    //44
                                    {name:"Т-обр. штульповое",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1400,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1400,y:1900,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1900,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip1",x:0,y:1300,dir:"line",dimType:1},{type:"impost",id:"ip1",x:1400,y:1300,dir:"line",dimType:1}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_2",level:2,blockType:"frame",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:["block_4","block_5"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"shtulp",id:"sht3",x:700,y:0,dir:"line",dimType:0},{type:"shtulp",id:"sht3",x:700,y:1300,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_4",level:3,blockType:"sash",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[2],handlePos:0,sashType:4},{type:"skylight",id:"block_5",level:3,blockType:"sash",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,4],handlePos:4,sashType:17}],hardwareLines:[[623.5,1215.5,623.5,1215.5]]},
                                    //45
                                    {name:"Т-обр. штульповое",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1400,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1400,y:1900,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1900,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip1",x:0,y:600,dir:"line",dimType:1},{type:"impost",id:"ip1",x:1400,y:600,dir:"line",dimType:1}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_2",level:2,blockType:"frame",parent:"block_1",children:["block_4","block_5"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"shtulp",id:"sht2",x:700,y:600,dir:"line",dimType:0},{type:"shtulp",id:"sht2",x:700,y:1900,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_4",level:3,blockType:"sash",parent:"block_2",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[2],handlePos:0,sashType:4},{type:"skylight",id:"block_5",level:3,blockType:"sash",parent:"block_2",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,4],handlePos:4,sashType:17}],hardwareLines:[[623.5,1215.5,623.5,1215.5]]},
                                    //46
                                    {name:"Т-обр. правое пов.отк.",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1400,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1400,y:1900,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1900,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip1",x:0,y:1300,dir:"line",dimType:1},{type:"impost",id:"ip1",x:1400,y:1300,dir:"line",dimType:1}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_2",level:2,blockType:"frame",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:["block_4","block_5"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip3",x:700,y:0,dir:"line",dimType:0},{type:"impost",id:"ip3",x:700,y:1300,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_4",level:3,blockType:"frame",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_5",level:3,blockType:"sash",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,4],handlePos:4,sashType:6}],hardwareLines:[[615.5,1215.5,615.5,1215.5]]},
                                    //47
                                    {name:"Т-обр. правое пов.отк.",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1400,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1400,y:1900,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1900,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip1",x:0,y:600,dir:"line",dimType:1},{type:"impost",id:"ip1",x:1400,y:600,dir:"line",dimType:1}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_2",level:2,blockType:"frame",parent:"block_1",children:["block_4","block_5"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip2",x:700,y:600,dir:"line",dimType:0},{type:"impost",id:"ip2",x:700,y:1900,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_4",level:3,blockType:"frame",parent:"block_2",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_5",level:3,blockType:"sash",parent:"block_2",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,4],handlePos:4,sashType:6}],hardwareLines:[[615.5,1215.5,615.5,1215.5]]},
                                    //48
                                    {name:"Т-обр. пов.откидное",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1400,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1400,y:1900,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1900,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip1",x:0,y:1300,dir:"line",dimType:1},{type:"impost",id:"ip1",x:1400,y:1300,dir:"line",dimType:1}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_2",level:2,blockType:"frame",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:["block_4","block_5"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip3",x:700,y:0,dir:"line",dimType:0},{type:"impost",id:"ip3",x:700,y:1300,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_4",level:3,blockType:"sash",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,2],handlePos:2,sashType:6},{type:"skylight",id:"block_5",level:3,blockType:"sash",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,4],handlePos:4,sashType:6}],hardwareLines:[[615.5,1215.5,615.5,1215.5]]},
                                    //49
                                    {name:"Т-обр. пов.откидное",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1400,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1400,y:1900,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1900,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip1",x:0,y:600,dir:"line",dimType:1},{type:"impost",id:"ip1",x:1400,y:600,dir:"line",dimType:1}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_2",level:2,blockType:"frame",parent:"block_1",children:["block_4","block_5"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip2",x:700,y:600,dir:"line",dimType:0},{type:"impost",id:"ip2",x:700,y:1900,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_4",level:3,blockType:"sash",parent:"block_2",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,2],handlePos:2,sashType:6},{type:"skylight",id:"block_5",level:3,blockType:"sash",parent:"block_2",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,4],handlePos:4,sashType:6}],hardwareLines:[[615.5,1215.5,615.5,1215.5]]},
                                    //50
                                    {name:"Т-обр. левое пов.отк.",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1400,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1400,y:1900,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1900,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip1",x:0,y:1300,dir:"line",dimType:1},{type:"impost",id:"ip1",x:1400,y:1300,dir:"line",dimType:1}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_2",level:2,blockType:"frame",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:["block_4","block_5"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip3",x:700,y:0,dir:"line",dimType:0},{type:"impost",id:"ip3",x:700,y:1300,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_4",level:3,blockType:"sash",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,2],handlePos:2,sashType:6},{type:"skylight",id:"block_5",level:3,blockType:"frame",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1}],hardwareLines:[[615.5,1215.5,615.5,1215.5]]},
                                    //51
                                    {name:"Т-обр. левое пов.отк.",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1400,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1400,y:1900,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1900,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip1",x:0,y:600,dir:"line",dimType:1},{type:"impost",id:"ip1",x:1400,y:600,dir:"line",dimType:1}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_2",level:2,blockType:"frame",parent:"block_1",children:["block_4","block_5"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip2",x:700,y:600,dir:"line",dimType:0},{type:"impost",id:"ip2",x:700,y:1900,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_4",level:3,blockType:"sash",parent:"block_2",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,2],handlePos:2,sashType:6},{type:"skylight",id:"block_5",level:3,blockType:"frame",parent:"block_2",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1}],hardwareLines:[[615.5,1215.5,615.5,1215.5]]},
                                    //52
                                    {name:"Т-обр. глухое",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1400,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1400,y:1900,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1900,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip1",x:0,y:1300,dir:"line",dimType:1},{type:"impost",id:"ip1",x:1400,y:1300,dir:"line",dimType:1}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_2",level:2,blockType:"frame",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:["block_4","block_5"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip3",x:700,y:0,dir:"line",dimType:0},{type:"impost",id:"ip3",x:700,y:1300,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_4",level:3,blockType:"frame",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_5",level:3,blockType:"frame",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1}]},
                                    //53
                                    {name:"Т-обр. глухое",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_1",level:1,blockType:"frame",parent:"block_0",children:["block_2","block_3"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1400,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1400,y:1900,dir:"line",view:1,sill:1},{type:"frame",id:"fp4",x:0,y:1900,dir:"line",view:1,sill:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip1",x:0,y:600,dir:"line",dimType:1},{type:"impost",id:"ip1",x:1400,y:600,dir:"line",dimType:1}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_2",level:2,blockType:"frame",parent:"block_1",children:["block_4","block_5"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip2",x:700,y:600,dir:"line",dimType:0},{type:"impost",id:"ip2",x:700,y:1900,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_1",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_4",level:3,blockType:"frame",parent:"block_2",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_5",level:3,blockType:"frame",parent:"block_2",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1}]},
                                    //21
                                    {
                                        name: "поворотно-откидные",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1", "block_2"],
                                            maxSizeLimit: 5000
                                        },
                                            {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 1,
                                            blockType: "sash",
                                            parent: "block_0",
                                            children: ["block_3", "block_4"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 700,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 700,
                                                y: 2100,
                                                dir: "line",
                                                sill: 1,
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 2100,
                                                dir: "line",
                                                sill: 1,
                                                view: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [1, 4],
                                            handlePos: 4,
                                            sashType: 6,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 0,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 700,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        },
                                            {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        },
                                            {
                                            type: "skylight",
                                            id: "block_4",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }
                                        ],
                                        hardwareLines: [[490, 1890, 490, 1890]]
                                    },
                                    //43
                                    {name: "Балк.дверь пов.отк. левая",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1","block_2"],maxSizeLimit:5000},{type:"skylight",id:"block_2",level:1,blockType:"sash",parent:"block_0",children:["block_3","block_4"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:700,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:700,y:2100,dir:"line",sill:1,view:1},{type:"frame",id:"fp4",x:0,y:2100,dir:"line",sill:1,view:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",gridId:0,gridTxt:"",openDir:[1,2],handlePos:2,sashType:6,glass_type:1,impost:{impostAxis:[{type:"impost",id:"ip2",x:0,y:1400,dir:"line",dimType:1},{type:"impost",id:"ip2",x:700,y:1400,dir:"line",dimType:1}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_3",level:2,blockType:"frame",parent:"block_2",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_4",level:2,blockType:"frame",parent:"block_2",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1}],hardwareLines:[[594,1994,594,1994]]},
                                    //23
                                    {
                                        name: "Штульповые",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1", "block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_3", "block_4"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 1300,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 1300,
                                                y: 2100,
                                                sill: 1,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 2100,
                                                dir: "line",
                                                view: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            impost: {
                                                impostAxis: [{
                                                    type: "shtulp",
                                                    id: "sht2",
                                                    x: 650,
                                                    y: 0,
                                                    sill: 1,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "shtulp",
                                                    id: "sht2",
                                                    x: 650,
                                                    y: 2100,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_2",
                                            children: ["block_5", "block_6"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            openDir: [2],
                                            handlePos: 0,
                                            sashType: 4,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 0,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 650,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_4",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_2",
                                            children: ["block_7", "block_8"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            openDir: [1, 4],
                                            handlePos: 4,
                                            sashType: 17,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip4",
                                                    x: 650,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip4",
                                                    x: 1300,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_5",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_6",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_7",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_4",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_8",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_4",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }],
                                        hardwareLines: [[497, 1890, 497, 1890]]
                                    },
                                    //42
                                    {name:"Штульповая балк.дверь левая",details:[{type:"skylight",id:"block_0",level:0,blockType:"frame",children:["block_1","block_1"],maxSizeLimit:5000},{type:"skylight",id:"block_2",level:1,blockType:"frame",parent:"block_0",children:["block_3","block_4"],pointsOut:[{type:"frame",id:"fp1",x:0,y:0,dir:"line",view:1},{type:"frame",id:"fp2",x:1300,y:0,dir:"line",view:1},{type:"frame",id:"fp3",x:1300,y:2100,sill:1,dir:"line",view:1},{type:"frame",id:"fp4",x:0,y:2100,dir:"line",view:1}],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,impost:{impostAxis:[{type:"shtulp",id:"sht2",x:650,y:0,dir:"line",dimType:0},{type:"shtulp",id:"sht2",x:650,y:2100,dir:"line",dimType:0}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_3",level:2,blockType:"sash",parent:"block_2",children:["block_5","block_6"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[1,2],handlePos:2,sashType:17,impost:{impostAxis:[{type:"impost",id:"ip3",x:0,y:1400,dir:"line",dimType:1},{type:"impost",id:"ip3",x:650,y:1400,dir:"line",dimType:1}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_4",level:2,blockType:"sash",parent:"block_2",children:["block_7","block_8"],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1,openDir:[4],handlePos:0,sashType:4,impost:{impostAxis:[{type:"impost",id:"ip4",x:650,y:1400,dir:"line",dimType:1},{type:"impost",id:"ip4",x:1300,y:1400,dir:"line",dimType:1}],impostOut:[],impostIn:[],impostLight:[]}},{type:"skylight",id:"block_5",level:3,blockType:"frame",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_6",level:3,blockType:"frame",parent:"block_3",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_7",level:3,blockType:"frame",parent:"block_4",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1},{type:"skylight",id:"block_8",level:3,blockType:"frame",parent:"block_4",children:[],pointsOut:[],pointsIn:[],pointsLight:[],parts:[],glassId:311891,glassTxt:"4-16-4",glass_type:1}],hardwareLines:[[573.5,1994,573.5,1994]]}
                                ]
    
                            }));
                        },
    
    
                        getTemplatesWindowDoor: function (callback) {
                            callback(new OkResult({
    
                                windowDoor: [
                                    {
                                        name: "поворотно-откидные",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1", "block_2"],
                                            maxSizeLimit: 5000
                                        },
                                            {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 1,
                                            blockType: "sash",
                                            parent: "block_0",
                                            children: ["block_3", "block_4"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 700,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 700,
                                                y: 2100,
                                                dir: "line",
                                                sill: 1,
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 2100,
                                                dir: "line",
                                                sill: 1,
                                                view: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [1, 4],
                                            handlePos: 4,
                                            sashType: 6,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 0,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 700,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        },
                                            {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        },
                                            {
                                            type: "skylight",
                                            id: "block_4",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }
                                        ],
                                        hardwareLines: [[490, 1890, 490, 1890]]
                                    },
    
                                    {
                                        name: "поворотно",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1", "block_2"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 1,
                                            blockType: "sash",
                                            parent: "block_0",
                                            children: ["block_3", "block_4"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 700,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 700,
                                                y: 2100,
                                                dir: "line",
                                                sill: 1,
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 2100,
                                                dir: "line",
                                                sill: 1,
                                                view: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [4],
                                            handlePos: 4,
                                            sashType: 2,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 0,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 700,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_4",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }],
                                        hardwareLines: [[490, 1890, 490, 1890]]
                                    },
    
                                    {
                                        name: "Штульповые",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1", "block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_3", "block_4"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 1300,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 1300,
                                                y: 2100,
                                                sill: 1,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 2100,
                                                dir: "line",
                                                view: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            impost: {
                                                impostAxis: [{
                                                    type: "shtulp",
                                                    id: "sht2",
                                                    x: 650,
                                                    y: 0,
                                                    sill: 1,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "shtulp",
                                                    id: "sht2",
                                                    x: 650,
                                                    y: 2100,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_2",
                                            children: ["block_5", "block_6"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            openDir: [2],
                                            handlePos: 0,
                                            sashType: 4,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 0,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 650,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_4",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_2",
                                            children: ["block_7", "block_8"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            openDir: [1, 4],
                                            handlePos: 4,
                                            sashType: 17,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip4",
                                                    x: 650,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip4",
                                                    x: 1300,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_5",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_6",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_7",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_4",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_8",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_4",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }],
                                        hardwareLines: [[497, 1890, 497, 1890]]
                                    }
    
                                ]
    
                            }));
                        },
    
    
                        getTemplatesBalcony: function (callback) {
                            callback(new OkResult({
                                balconies: [
                                    {
                                        name: 'balconies1',
                                        details: [
                                            {
                                                type: 'skylight',
                                                id: 'block_0',
                                                level: 0,
                                                blockType: 'frame',
                                                children: ['block_1', 'block_2'],
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
                                                type: "skylight",
                                                id: "block_2",
                                                level: 1,
                                                blockType: "sash",
                                                parent: "block_0",
                                                children: [],
                                                pointsOut: [
                                                    {type:'frame', id:'fp5', x:1300, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp6', x:2000, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp7', x:2000, y:2100, dir:'line', view:1, sill: 1},
                                                    {type:'frame', id:'fp8', x:1300, y:2100, dir:'line', view:1, sill: 1}
                                                ],
                                                pointsIn: [
    
                                                ],
                                                parts: [
    
                                                ],
                                                glassId: 338643,
                                                glassTxt: "(24)4-16-4/проз.",
                                                gridId: 0,
                                                gridTxt: "",
                                                openDir: [
                                                    1,
                                                    4
                                                ],
                                                handlePos: 4,
                                                sashType: 6,
                                                glass_type: 1
                                            }
                                        ],
                                        hardwareLines: [[497, 1890, 497, 1890]]
                                    },
                                    {
                                        name: 'balconies2',
                                        details: [
                                            {
                                                type: 'skylight',
                                                id: 'block_0',
                                                level: 0,
                                                blockType: 'frame',
                                                children: ['block_1', 'block_2'],
                                                maxSizeLimit: 5000
                                            },
                                            //------- Level 1
                                            {
                                                type: "skylight",
                                                id: "block_1",
                                                level: 1,
                                                blockType: "sash",
                                                parent: "block_0",
                                                children: [],
                                                pointsOut: [
                                                    {type:'frame', id:'fp5', x:0, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp6', x:700, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp7', x:700, y:2100, dir:'line', view:1, sill: 1},
                                                    {type:'frame', id:'fp8', x:0, y:2100, dir:'line', view:1, sill: 1}
                                                ],
                                                pointsIn: [
    
                                                ],
                                                parts: [
    
                                                ],
                                                glassId: 338643,
                                                glassTxt: "(24)4-16-4/проз.",
                                                gridId: 0,
                                                gridTxt: "",
                                                openDir: [
                                                    1,
                                                    4
                                                ],
                                                handlePos: 4,
                                                sashType: 6,
                                                glass_type: 1
                                            },
                                            {
                                                type:'skylight',
                                                id:'block_2',
                                                level: 1,
                                                blockType:'frame',
                                                parent: 'block_0',
                                                children: [],
                                                pointsOut: [
                                                    {type:'frame', id:'fp1', x:700, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp2', x:2000, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp3', x:2000, y:1400, dir:'line', view:1, sill:1},
                                                    {type:'frame', id:'fp4', x:700, y:1400, dir:'line', view:1, sill:1}
                                                ],
                                                pointsIn: [],
                                                parts: [],
                                                glassId: 0,
                                                glassTxt: ''
                                            }
                                        ],
                                        hardwareLines: [[497, 1890, 497, 1890]]
                                    },
                                    {
                                        name: 'balconies3',
                                        details: [
                                            {
                                                type: 'skylight',
                                                id: 'block_0',
                                                level: 0,
                                                blockType: 'frame',
                                                children: ['block_1', 'block_2','block_3'],
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
                                                    {type:'frame', id:'fp2', x:500, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp3', x:500, y:1400, dir:'line', view:1, sill:1},
                                                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                                                ],
                                                pointsIn: [],
                                                parts: [],
                                                glassId: 0,
                                                glassTxt: ''
                                            },
                                            {
                                                type: "skylight",
                                                id: "block_2",
                                                level: 1,
                                                blockType: "sash",
                                                parent: "block_0",
                                                children: [],
                                                pointsOut: [
                                                    {type:'frame', id:'fp5', x:500, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp6', x:1200, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp7', x:1200, y:2100, dir:'line', view:1, sill: 1},
                                                    {type:'frame', id:'fp8', x:500, y:2100, dir:'line', view:1, sill: 1}
                                                ],
                                                pointsIn: [
    
                                                ],
                                                parts: [
    
                                                ],
                                                glassId: 338643,
                                                glassTxt: "(24)4-16-4/проз.",
                                                gridId: 0,
                                                gridTxt: "",
                                                openDir: [
                                                    1,
                                                    4
                                                ],
                                                handlePos: 4,
                                                sashType: 6,
                                                glass_type: 1
                                            }
                                            ,
                                            {
                                                type: 'skylight',
                                                id: 'block_3',
                                                level: 1,
                                                blockType: 'frame',
                                                parent: 'block_0',
                                                children: [],
                                                pointsOut: [
                                                    {type: 'frame', id: 'fp9', x: 1200, y: 0, dir: 'line', view: 1},
                                                    {type: 'frame', id: 'fp10', x: 1800, y: 0, dir: 'line', view: 1},
                                                    {type: 'frame', id: 'fp11', x: 1800, y: 1400, dir: 'line', view: 1, sill: 1},
                                                    {type: 'frame', id: 'fp12', x: 1200, y: 1400, dir: 'line', view: 1, sill: 1}
                                                ],
                                                pointsIn: [],
                                                pointsLight: [],
                                                parts: [],
                                                glassId: 0,
                                                glassTxt: ''//,
                                                //sashType: 2,
                                                //openDir: [1]
                                            }
                                        ],
                                        hardwareLines: [[497, 1890, 497, 1890]]
                                    }
    
                                ]
    
                            }));
                        },
    
    
                        getTemplatesDoor: function (callback) {
                            callback(new OkResult({
    
                                doors: [
                                    {
                                        name: "поворотно",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "sash",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 900,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 900,
                                                y: 2000,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 2000,
                                                dir: "line",
                                                view: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            openDir: [4],
                                            handlePos: 4,
                                            sashType: 2,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 0,
                                                    y: 1300,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 900,
                                                    y: 1300,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }],
                                        hardwareLines: [[795, 1895, 795, 1895]]
                                    },
                                    {
                                        name: "Одностворчатая",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 1800,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 1800,
                                                y: 2000,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 2000,
                                                dir: "line",
                                                view: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            impost: {
                                                impostAxis: [{
                                                    type: "shtulp",
                                                    id: "sht1",
                                                    x: 900,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "shtulp",
                                                    id: "sht1",
                                                    x: 900,
                                                    y: 2000,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_1",
                                            children: ["block_4", "block_5"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            openDir: [2],
                                            handlePos: 0,
                                            sashType: 4,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 0,
                                                    y: 1300,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 900,
                                                    y: 1300,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_1",
                                            children: ["block_6", "block_7"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            openDir: [4],
                                            handlePos: 4,
                                            sashType: 2,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 900,
                                                    y: 1300,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 1800,
                                                    y: 1300,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_4",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_5",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_6",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_7",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }],
                                        hardwareLines: [[823.5, 1895, 823.5, 1895]]
                                    }
    
                                ]
    
                            }));
                        },
    
    
                        getInstalment: function (callback) {
                            callback(new OkResult({
    
                                instalment: [
                                    {
                                        id: 1,
                                        name: 1,
                                        value: 15
                                    },
                                    {
                                        id: 2,
                                        name: 2,
                                        value: 20
                                    },
                                    {
                                        id: 3,
                                        name: 3,
                                        value: 25
                                    },
                                    {
                                        id: 4,
                                        name: 4,
                                        value: 30
                                    },
                                    {
                                        id: 5,
                                        name: 5,
                                        value: 35
                                    }
                                ]
    
                            }));
                        }
    
    
                    };
                } else {
                    return {
                        getTemplateImgIcons: function (callback) {
                            callback(new OkResult({
                                templateImgs: [
                                    {
                                        id: 1,
                                        name: $filter('translate')('panels.1_TYPE'),
                                        src: 'img/templates/1.png',
                                        type: 1
                                    },
                                    {
                                        id: 3,
                                        name: $filter('translate')('panels.2_TYPE'),
                                        src: 'img/templates/2.png',
                                        type: 1
                                    },
                                    {
                                        id: 4,
                                        name: $filter('translate')('panels.3_TYPE'),
                                        src: 'img/templates/3.png',
                                        type: 1
                                    },
                                    {
                                        id: 5,
                                        name: $filter('translate')('panels.4_TYPE'),
                                        src: 'img/templates/4.png',
                                        type: 1
                                    },
                                    {
                                        id: 6,
                                        name: $filter('translate')('panels.5_TYPE'),
                                        src: 'img/templates/5.png',
                                        type: 1
                                    },
                                    {
                                        id: 7,
                                        name: $filter('translate')('panels.6_TYPE'),
                                        src: 'img/templates/6.png',
                                        type: 1
                                    },
                                    {
                                        id: 8,
                                        name: $filter('translate')('panels.7_TYPE'),
                                        src: 'img/templates/7.png',
                                        type: 1
                                    },
                                    {
                                        id: 9,
                                        name: $filter('translate')('panels.8_TYPE'),
                                        src: 'img/templates/8.png',
                                        type: 1
                                    },
                                    {
                                        id: 10,
                                        name: $filter('translate')('panels.9_TYPE'),
                                        src: 'img/templates/9.png',
                                        type: 1
                                    },
                                    {
                                        id: 11,
                                        name: $filter('translate')('panels.10_TYPE'),
                                        src: 'img/templates/10.png',
                                        type: 1
                                    },
                                    {
                                        id: 12,
                                        name: $filter('translate')('panels.11_TYPE'),
                                        src: 'img/templates/11.png',
                                        type: 1
                                    },
                                    {
                                        id: 1,
                                        name: $filter('translate')('panels.21_TYPE'),
                                        src: 'img/templates/21.png',
                                        type: 2
                                    },
                                    {
                                        id: 2,
                                        name: $filter('translate')('panels.22_TYPE'),
                                        src: 'img/templates/22.png',
                                        type: 2
                                    },
                                    {
                                        id: 3,
                                        name: $filter('translate')('panels.23_TYPE'),
                                        src: 'img/templates/23.png',
                                        type: 2
                                    },
    
                                    {
                                        id: 1,
                                        name: $filter('translate')('panels.31_TYPE'),
                                        src: 'img/templates/31.png',
                                        type: 4
                                    },
                                    {
                                        id: 2,
                                        name: $filter('translate')('panels.32_TYPE'),
                                        src: 'img/templates/32.png',
                                        type: 4
                                    },
                                    {
                                        id: 1,
                                        name: $filter('translate')('panels.TEMPLATE_BALCONY_ENTER'),
                                        src: 'img/templates/balcony1.png',
                                        type: 3
                                    }
                                    ,
                                    {
                                        id: 2,
                                        name: $filter('translate')('panels.TEMPLATE_BALCONY_ENTER'),
                                        src: 'img/templates/balcony2.png',
                                        type: 3
                                    }
                                    ,
                                    {
                                        id: 3,
                                        name: $filter('translate')('panels.TEMPLATE_BALCONY_ENTER'),
                                        src: 'img/templates/balcony3.png',
                                        type: 3
                                    }
                                ]
                            }));
                        },
    
    
                        getTemplatesWindow: function (callback) {
                            callback(new OkResult({
                                windows: [
                                    {
                                        name: 'Глухое',
                                        details: [
                                            {
                                                type: 'skylight',
                                                id: 'block_0',
                                                level: 0,
                                                blockType: 'frame',
                                                children: ['block_1'],
                                                maxSizeLimit: 5000
                                            },
                                            //------- Level 1
                                            {
                                                type: 'skylight',
                                                id: 'block_1',
                                                level: 1,
                                                blockType: 'frame',
                                                //blockType:'sash',
                                                parent: 'block_0',
                                                children: [],
                                                pointsOut: [
                                                    {type: 'frame', id: 'fp1', x: 0, y: 0, dir: 'line', view: 1},
                                                    {type: 'frame', id: 'fp2', x: 1300, y: 0, dir: 'line', view: 1},
                                                    {type: 'frame', id: 'fp3', x: 1300, y: 1400, dir: 'line', view: 1, sill: 1},
                                                    {type: 'frame', id: 'fp4', x: 0, y: 1400, dir: 'line', view: 1, sill: 1}
                                                ],
                                                pointsIn: [],
                                                pointsLight: [],
                                                parts: [],
                                                glassId: 0,
                                                glassTxt: ''//,
                                                //sashType: 2,
                                                //openDir: [1]
                                            }
                                        ]
                                    },
    
                                    {
                                        name: "Глухое",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "sash",
                                            parent: "block_0",
                                            children: [],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 700,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 700,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [4],
                                            handlePos: 4,
                                            sashType: 2
                                        }],
                                        hardwareLines: [[490, 1190, 490, 1190]]
                                    },
    
                                    {
                                        name: "Глухое",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "sash",
                                            parent: "block_0",
                                            children: [],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 700,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 700,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [1, 4],
                                            handlePos: 4,
                                            sashType: 6
                                        }],
                                        hardwareLines: [[490, 1190, 490, 1190]]
                                    },
    
                                    {
                                        name: "Глухое",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 1300,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 1300,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 650,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 650,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }]
                                    },
    
                                    {
                                        name: "Глухое",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 1300,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 1300,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 650,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                },
                                                    {
                                                        type: "impost",
                                                        id: "ip1",
                                                        x: 650,
                                                        y: 1400,
                                                        dir: "line",
                                                        dimType: 0
                                                    }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        },
                                            {
                                                type: "skylight",
                                                id: "block_2",
                                                level: 2,
                                                blockType: "frame",
                                                parent: "block_1",
                                                children: [],
                                                pointsOut: [],
                                                pointsIn: [],
                                                pointsLight: [],
                                                parts: [],
                                                glassId: 311891,
                                                glassTxt: "4-16-4"
                                            },
                                            {
                                                type: "skylight",
                                                id: "block_3",
                                                level: 2,
                                                blockType: "sash",
                                                parent: "block_1",
                                                children: [],
                                                pointsOut: [],
                                                pointsIn: [],
                                                pointsLight: [],
                                                parts: [],
                                                glassId: 311891,
                                                glassTxt: "4-16-4",
                                                gridId: 0,
                                                gridTxt: "",
                                                openDir: [4],
                                                handlePos: 4,
                                                sashType: 2
                                            }],
                                        hardwareLines: [[482, 1190, 482, 1190]]
                                    },
    
                                    {
                                        name: "Глухое",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 1300,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 1300,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 650,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 650,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [1, 4],
                                            handlePos: 4,
                                            sashType: 6
                                        }],
                                        hardwareLines: [[482, 1190, 482, 1190]]
                                    },
    
                                    {
                                        name: "Глухое",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 1300,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 1300,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 650,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 650,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [2],
                                            handlePos: 2,
                                            sashType: 2
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [1, 4],
                                            handlePos: 4,
                                            sashType: 6
                                        }],
                                        hardwareLines: [[482, 1190, 482, 1190]]
                                    },
    
                                    {
                                        name: "Глухое",
                                        details: [
                                            {
                                                type: "skylight",
                                                id: "block_0",
                                                level: 0,
                                                blockType: "frame",
                                                children: ["block_1"],
                                                maxSizeLimit: 5000
                                            }, {
                                                type: "skylight",
                                                id: "block_1",
                                                level: 1,
                                                blockType: "frame",
                                                parent: "block_0",
                                                children: ["block_2", "block_3"],
                                                pointsOut: [
                                                    {
                                                        type: "frame",
                                                        id: "fp1",
                                                        x: 0,
                                                        y: 0,
                                                        dir: "line",
                                                        view: 1
                                                    }, {
                                                        type: "frame",
                                                        id: "fp2",
                                                        x: 1300,
                                                        y: 0,
                                                        dir: "line",
                                                        view: 1
                                                    }, {
                                                        type: "frame",
                                                        id: "fp3",
                                                        x: 1300,
                                                        y: 1400,
                                                        dir: "line",
                                                        view: 1,
                                                        sill: 1
                                                    }, {
                                                        type: "frame",
                                                        id: "fp4",
                                                        x: 0,
                                                        y: 1400,
                                                        dir: "line",
                                                        view: 1,
                                                        sill: 1
                                                    }],
                                                pointsIn: [],
                                                pointsLight: [],
                                                parts: [],
                                                glassId: 311891,
                                                glassTxt: "4-16-4",
                                                impost: {
                                                    impostAxis: [{
                                                        type: "shtulp",
                                                        id: "sht1",
                                                        x: 650,
                                                        y: 0,
                                                        dir: "line",
                                                        dimType: 0
                                                    }, {
                                                        type: "shtulp",
                                                        id: "sht1",
                                                        x: 650,
                                                        y: 1400,
                                                        dir: "line",
                                                        dimType: 0
                                                    }],
                                                    impostOut: [],
                                                    impostIn: [],
                                                    impostLight: []
                                                }
                                            }, {
                                                type: "skylight",
                                                id: "block_2",
                                                level: 2,
                                                blockType: "sash",
                                                parent: "block_1",
                                                children: [],
                                                pointsOut: [],
                                                pointsIn: [],
                                                pointsLight: [],
                                                parts: [],
                                                glassId: 311891,
                                                glassTxt: "4-16-4",
                                                openDir: [2],
                                                handlePos: 0,
                                                sashType: 4
                                            }, {
                                                type: "skylight",
                                                id: "block_3",
                                                level: 2,
                                                blockType: "sash",
                                                parent: "block_1",
                                                children: [],
                                                pointsOut: [],
                                                pointsIn: [],
                                                pointsLight: [],
                                                parts: [],
                                                glassId: 311891,
                                                glassTxt: "4-16-4",
                                                openDir: [1, 4],
                                                handlePos: 4,
                                                sashType: 17
                                            }],
                                        hardwareLines: [[497, 1190, 497, 1190]]
                                    },
    
                                    {
                                        name: "Глухое",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 2100,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 2100,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [
                                                    {
                                                        type: "impost",
                                                        id: "ip1",
                                                        x: 1400,
                                                        y: 0,
                                                        dir: "line",
                                                        dimType: 0
                                                    },
                                                    {
                                                        type: "impost",
                                                        id: "ip1",
                                                        x: 1400,
                                                        y: 1400,
                                                        dir: "line",
                                                        dimType: 0
                                                    }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: ["block_4", "block_5"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 700,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 700,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_4",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_5",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }],
                                        hardwareLines: [[497, 1190, 497, 1190]]
                                    },
    
                                    {
                                        name: "Глухое",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 2100,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 2100,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 700,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 700,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: ["block_6", "block_7"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 1400,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 1400,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_6",
                                            level: 3,
                                            blockType: "sash",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [4],
                                            handlePos: 4,
                                            sashType: 2
                                        }, {
                                            type: "skylight",
                                            id: "block_7",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }],
                                        hardwareLines: [[574, 1191, 574, 1191]]
                                    },
    
                                    {
                                        name: "Глухое",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 2100,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 2100,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 1400,
                                                dir: "line",
                                                view: 1,
                                                sill: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 700,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 700,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: ["block_6", "block_7"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 1400,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 1400,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_6",
                                            level: 3,
                                            blockType: "sash",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [1, 4],
                                            handlePos: 4,
                                            sashType: 6
                                        }, {
                                            type: "skylight",
                                            id: "block_7",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }],
                                        hardwareLines: [[574, 1191, 574, 1191]]
                                    }
    
                                ]
    
                            }));
                        },
    
    
                        getTemplatesWindowDoor: function (callback) {
                            callback(new OkResult({
    
                                windowDoor: [
                                    {
                                        name: "поворотно-откидные",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1", "block_2"],
                                            maxSizeLimit: 5000
                                        },
                                            {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 1,
                                            blockType: "sash",
                                            parent: "block_0",
                                            children: ["block_3", "block_4"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 700,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 700,
                                                y: 2100,
                                                dir: "line",
                                                sill: 1,
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 2100,
                                                dir: "line",
                                                sill: 1,
                                                view: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [1, 4],
                                            handlePos: 4,
                                            sashType: 6,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 0,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 700,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        },
                                            {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        },
                                            {
                                            type: "skylight",
                                            id: "block_4",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }
                                        ],
                                        hardwareLines: [[490, 1890, 490, 1890]]
                                    },
    
                                    {
                                        name: "поворотно",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1", "block_2"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 1,
                                            blockType: "sash",
                                            parent: "block_0",
                                            children: ["block_3", "block_4"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 700,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 700,
                                                y: 2100,
                                                dir: "line",
                                                sill: 1,
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 2100,
                                                dir: "line",
                                                sill: 1,
                                                view: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            gridId: 0,
                                            gridTxt: "",
                                            openDir: [4],
                                            handlePos: 4,
                                            sashType: 2,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 0,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 700,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_4",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }],
                                        hardwareLines: [[490, 1890, 490, 1890]]
                                    },
    
                                    {
                                        name: "Штульповые",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1", "block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_3", "block_4"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 1300,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 1300,
                                                y: 2100,
                                                sill: 1,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 2100,
                                                dir: "line",
                                                view: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            impost: {
                                                impostAxis: [{
                                                    type: "shtulp",
                                                    id: "sht2",
                                                    x: 650,
                                                    y: 0,
                                                    sill: 1,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "shtulp",
                                                    id: "sht2",
                                                    x: 650,
                                                    y: 2100,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_2",
                                            children: ["block_5", "block_6"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            openDir: [2],
                                            handlePos: 0,
                                            sashType: 4,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 0,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 650,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_4",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_2",
                                            children: ["block_7", "block_8"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            openDir: [1, 4],
                                            handlePos: 4,
                                            sashType: 17,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip4",
                                                    x: 650,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip4",
                                                    x: 1300,
                                                    y: 1400,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_5",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_6",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_7",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_4",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_8",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_4",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }],
                                        hardwareLines: [[497, 1890, 497, 1890]]
                                    }
    
                                ]
    
                            }));
                        },
    
    
                        getTemplatesBalcony: function (callback) {
                            callback(new OkResult({
                                balconies: [
                                    {
                                        name: 'balconies1',
                                        details: [
                                            {
                                                type: 'skylight',
                                                id: 'block_0',
                                                level: 0,
                                                blockType: 'frame',
                                                children: ['block_1', 'block_2'],
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
                                                type: "skylight",
                                                id: "block_2",
                                                level: 1,
                                                blockType: "sash",
                                                parent: "block_0",
                                                children: [],
                                                pointsOut: [
                                                    {type:'frame', id:'fp5', x:1300, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp6', x:2000, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp7', x:2000, y:2100, dir:'line', view:1, sill: 1},
                                                    {type:'frame', id:'fp8', x:1300, y:2100, dir:'line', view:1, sill: 1}
                                                ],
                                                pointsIn: [
    
                                                ],
                                                parts: [
    
                                                ],
                                                glassId: 338643,
                                                glassTxt: "(24)4-16-4/проз.",
                                                gridId: 0,
                                                gridTxt: "",
                                                openDir: [
                                                    1,
                                                    4
                                                ],
                                                handlePos: 4,
                                                sashType: 6,
                                                glass_type: 1
                                            }
                                        ],
                                        hardwareLines: [[497, 1890, 497, 1890]]
                                    },
                                    {
                                        name: 'balconies2',
                                        details: [
                                            {
                                                type: 'skylight',
                                                id: 'block_0',
                                                level: 0,
                                                blockType: 'frame',
                                                children: ['block_1', 'block_2'],
                                                maxSizeLimit: 5000
                                            },
                                            //------- Level 1
                                            {
                                                type: "skylight",
                                                id: "block_1",
                                                level: 1,
                                                blockType: "sash",
                                                parent: "block_0",
                                                children: [],
                                                pointsOut: [
                                                    {type:'frame', id:'fp5', x:0, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp6', x:700, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp7', x:700, y:2100, dir:'line', view:1, sill: 1},
                                                    {type:'frame', id:'fp8', x:0, y:2100, dir:'line', view:1, sill: 1}
                                                ],
                                                pointsIn: [
    
                                                ],
                                                parts: [
    
                                                ],
                                                glassId: 338643,
                                                glassTxt: "(24)4-16-4/проз.",
                                                gridId: 0,
                                                gridTxt: "",
                                                openDir: [
                                                    1,
                                                    4
                                                ],
                                                handlePos: 4,
                                                sashType: 6,
                                                glass_type: 1
                                            },
                                            {
                                                type:'skylight',
                                                id:'block_2',
                                                level: 1,
                                                blockType:'frame',
                                                parent: 'block_0',
                                                children: [],
                                                pointsOut: [
                                                    {type:'frame', id:'fp1', x:700, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp2', x:2000, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp3', x:2000, y:1400, dir:'line', view:1, sill:1},
                                                    {type:'frame', id:'fp4', x:700, y:1400, dir:'line', view:1, sill:1}
                                                ],
                                                pointsIn: [],
                                                parts: [],
                                                glassId: 0,
                                                glassTxt: ''
                                            }
                                        ],
                                        hardwareLines: [[497, 1890, 497, 1890]]
                                    },
                                    {
                                        name: 'balconies3',
                                        details: [
                                            {
                                                type: 'skylight',
                                                id: 'block_0',
                                                level: 0,
                                                blockType: 'frame',
                                                children: ['block_1', 'block_2','block_3'],
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
                                                    {type:'frame', id:'fp2', x:500, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp3', x:500, y:1400, dir:'line', view:1, sill:1},
                                                    {type:'frame', id:'fp4', x:0, y:1400, dir:'line', view:1, sill:1}
                                                ],
                                                pointsIn: [],
                                                parts: [],
                                                glassId: 0,
                                                glassTxt: ''
                                            },
                                            {
                                                type: "skylight",
                                                id: "block_2",
                                                level: 1,
                                                blockType: "sash",
                                                parent: "block_0",
                                                children: [],
                                                pointsOut: [
                                                    {type:'frame', id:'fp5', x:500, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp6', x:1200, y:0, dir:'line', view:1},
                                                    {type:'frame', id:'fp7', x:1200, y:2100, dir:'line', view:1, sill: 1},
                                                    {type:'frame', id:'fp8', x:500, y:2100, dir:'line', view:1, sill: 1}
                                                ],
                                                pointsIn: [
    
                                                ],
                                                parts: [
    
                                                ],
                                                glassId: 338643,
                                                glassTxt: "(24)4-16-4/проз.",
                                                gridId: 0,
                                                gridTxt: "",
                                                openDir: [
                                                    1,
                                                    4
                                                ],
                                                handlePos: 4,
                                                sashType: 6,
                                                glass_type: 1
                                            }
                                            ,
                                            {
                                                type: 'skylight',
                                                id: 'block_3',
                                                level: 1,
                                                blockType: 'frame',
                                                parent: 'block_0',
                                                children: [],
                                                pointsOut: [
                                                    {type: 'frame', id: 'fp9', x: 1200, y: 0, dir: 'line', view: 1},
                                                    {type: 'frame', id: 'fp10', x: 1800, y: 0, dir: 'line', view: 1},
                                                    {type: 'frame', id: 'fp11', x: 1800, y: 1400, dir: 'line', view: 1, sill: 1},
                                                    {type: 'frame', id: 'fp12', x: 1200, y: 1400, dir: 'line', view: 1, sill: 1}
                                                ],
                                                pointsIn: [],
                                                pointsLight: [],
                                                parts: [],
                                                glassId: 0,
                                                glassTxt: ''//,
                                                //sashType: 2,
                                                //openDir: [1]
                                            }
                                        ],
                                        hardwareLines: [[497, 1890, 497, 1890]]
                                    }
    
                                ]
    
                            }));
                        },
    
    
                        getTemplatesDoor: function (callback) {
                            callback(new OkResult({
    
                                doors: [
                                    {
                                        name: "поворотно",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "sash",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 900,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 900,
                                                y: 2000,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 2000,
                                                dir: "line",
                                                view: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            openDir: [4],
                                            handlePos: 4,
                                            sashType: 2,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 0,
                                                    y: 1300,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip1",
                                                    x: 900,
                                                    y: 1300,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "frame",
                                            parent: "block_1",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4"
                                        }],
                                        hardwareLines: [[795, 1895, 795, 1895]]
                                    },
                                    {
                                        name: "Одностворчатая",
                                        details: [{
                                            type: "skylight",
                                            id: "block_0",
                                            level: 0,
                                            blockType: "frame",
                                            children: ["block_1"],
                                            maxSizeLimit: 5000
                                        }, {
                                            type: "skylight",
                                            id: "block_1",
                                            level: 1,
                                            blockType: "frame",
                                            parent: "block_0",
                                            children: ["block_2", "block_3"],
                                            pointsOut: [{
                                                type: "frame",
                                                id: "fp1",
                                                x: 0,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp2",
                                                x: 1800,
                                                y: 0,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp3",
                                                x: 1800,
                                                y: 2000,
                                                dir: "line",
                                                view: 1
                                            }, {
                                                type: "frame",
                                                id: "fp4",
                                                x: 0,
                                                y: 2000,
                                                dir: "line",
                                                view: 1
                                            }],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            impost: {
                                                impostAxis: [{
                                                    type: "shtulp",
                                                    id: "sht1",
                                                    x: 900,
                                                    y: 0,
                                                    dir: "line",
                                                    dimType: 0
                                                }, {
                                                    type: "shtulp",
                                                    id: "sht1",
                                                    x: 900,
                                                    y: 2000,
                                                    dir: "line",
                                                    dimType: 0
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_2",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_1",
                                            children: ["block_4", "block_5"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            openDir: [2],
                                            handlePos: 0,
                                            sashType: 4,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 0,
                                                    y: 1300,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip2",
                                                    x: 900,
                                                    y: 1300,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_3",
                                            level: 2,
                                            blockType: "sash",
                                            parent: "block_1",
                                            children: ["block_6", "block_7"],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1,
                                            openDir: [4],
                                            handlePos: 4,
                                            sashType: 2,
                                            impost: {
                                                impostAxis: [{
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 900,
                                                    y: 1300,
                                                    dir: "line",
                                                    dimType: 1
                                                }, {
                                                    type: "impost",
                                                    id: "ip3",
                                                    x: 1800,
                                                    y: 1300,
                                                    dir: "line",
                                                    dimType: 1
                                                }],
                                                impostOut: [],
                                                impostIn: [],
                                                impostLight: []
                                            }
                                        }, {
                                            type: "skylight",
                                            id: "block_4",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_5",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_2",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_6",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }, {
                                            type: "skylight",
                                            id: "block_7",
                                            level: 3,
                                            blockType: "frame",
                                            parent: "block_3",
                                            children: [],
                                            pointsOut: [],
                                            pointsIn: [],
                                            pointsLight: [],
                                            parts: [],
                                            glassId: 311891,
                                            glassTxt: "4-16-4",
                                            glass_type: 1
                                        }],
                                        hardwareLines: [[823.5, 1895, 823.5, 1895]]
                                    }
    
                                ]
    
                            }));
                        },
    
    
                        getInstalment: function (callback) {
                            callback(new OkResult({
    
                                instalment: [
                                    {
                                        id: 1,
                                        name: 1,
                                        value: 15
                                    },
                                    {
                                        id: 2,
                                        name: 2,
                                        value: 20
                                    },
                                    {
                                        id: 3,
                                        name: 3,
                                        value: 25
                                    },
                                    {
                                        id: 4,
                                        name: 4,
                                        value: 30
                                    },
                                    {
                                        id: 5,
                                        name: 5,
                                        value: 35
                                    }
                                ]
    
                            }));
                        }
    
    
                    };
                }
            });
})();
