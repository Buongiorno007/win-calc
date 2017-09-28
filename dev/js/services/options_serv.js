(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('BauVoiceApp')
        .factory('optionsServ',

            function ($filter) {

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
                                    name: $filter('translate')('panels.32_TYPE'),
                                    src: 'img/templates/balcony1.png',
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
                                    name: 'Выход на балкон',
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
                                            children: [

                                            ],
                                            pointsOut: [
                                                {type:'frame', id:'fp5', x:1300, y:0, dir:'line', view:1},
                                                {type:'frame', id:'fp6', x:2000, y:0, dir:'line', view:1},
                                                {type:'frame', id:'fp7', x:2000, y:2100, dir:'line', view:1},
                                                {type:'frame', id:'fp8', x:1300, y:2100, dir:'line', view:1}
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
                                            type: 'skylight',
                                            id: 'block_3',
                                            level: 1,
                                            blockType: 'frame',
                                            //blockType:'sash',
                                            parent: 'block_0',
                                            children: [],
                                            pointsOut: [
                                                {type: 'frame', id: 'fp9', x: 2000, y: 0, dir: 'line', view: 1},
                                                {type: 'frame', id: 'fp10', x: 3100, y: 0, dir: 'line', view: 1},
                                                {type: 'frame', id: 'fp11', x: 3100, y: 1400, dir: 'line', view: 1, sill: 1},
                                                {type: 'frame', id: 'fp12', x: 2000, y: 1400, dir: 'line', view: 1, sill: 1}
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
                                        impost: {
                                            impostAxis: [{
                                                type: "shtulp",
                                                id: "sht2",
                                                x: 650,
                                                y: 0,
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
                                        children: [],
                                        pointsOut: [],
                                        pointsIn: [],
                                        pointsLight: [],
                                        parts: [],
                                        glassId: 311891,
                                        glassTxt: "4-16-4",
                                        openDir: [1, 2],
                                        handlePos: 2,
                                        sashType: 6,
                                        gridId: 0,
                                        gridTxt: ""
                                    }, {
                                        type: "skylight",
                                        id: "block_4",
                                        level: 2,
                                        blockType: "sash",
                                        parent: "block_2",
                                        children: [],
                                        pointsOut: [],
                                        pointsIn: [],
                                        pointsLight: [],
                                        parts: [],
                                        glassId: 311891,
                                        glassTxt: "4-16-4",
                                        openDir: [4],
                                        handlePos: 0,
                                        sashType: 4
                                    }],
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


            });
})();
