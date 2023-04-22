(function () {
    'use strict';
    /**@ngInject*/

    angular
        .module('BauVoiceApp')
        .factory('PointsServ',

            function (DesignStor, ProductStor) {
                var thisFactory = this;

                function templatePoints(template) {
                    if (template && !$.isEmptyObject(template)) {
                        var blockQty = template.details.length,
                            path = '',
                            noVvPath = '',          //без  View = 0
                            fpDgLR = '',             //диагональ с лево на право
                            fpDgRL = '',             //диагональ с право на лево
                            heightWmd = '',         //Высота окна
                            widthWmd = '';          //Ширина окна

                        while (--blockQty > 0) {
                            if (template.details[blockQty].level === 1) {
                                var pointsOutQty = template.details[blockQty].pointsOut.length;
                                while (--pointsOutQty > -1) {
                                    if (template.details[blockQty].pointsOut[pointsOutQty].view !== 0) {
                                        if (ProductStor.product.construction_type !== 3) {
                                            noVvPath += (template.details[blockQty].pointsOut[pointsOutQty].x);
                                            if (!pointsOutQty) {
                                                noVvPath += ' ' + (template.details[blockQty].pointsOut[pointsOutQty].y);
                                            } else {
                                                noVvPath += ' ' + (template.details[blockQty].pointsOut[pointsOutQty].y) + ',';
                                            }
                                        } else {
                                            if (template.details[blockQty].pointsOut[pointsOutQty].id === "fp6" ||
                                                template.details[blockQty].pointsOut[pointsOutQty].id === "fp1" ||
                                                template.details[blockQty].pointsOut[pointsOutQty].id === "fp5" ||
                                                template.details[blockQty].pointsOut[pointsOutQty].id === "fp2" ||
                                                template.details[blockQty].pointsOut[pointsOutQty].id === "fp4" ||
                                                template.details[blockQty].pointsOut[pointsOutQty].id === "fp3" ||
                                                template.details[blockQty].pointsOut[pointsOutQty].id === "fp8" ||
                                                template.details[blockQty].pointsOut[pointsOutQty].id === "fp9" ||
                                                template.details[blockQty].pointsOut[pointsOutQty].id === "fp10" ||
                                                template.details[blockQty].pointsOut[pointsOutQty].id === "fp11" ||
                                                template.details[blockQty].pointsOut[pointsOutQty].id === "fp12" ||
                                                template.details[blockQty].pointsOut[pointsOutQty].id === "fp7"

                                            ) {
                                                if (template.details[blockQty].pointsOut[pointsOutQty].id === "fp4" ||
                                                    template.details[blockQty].pointsOut[pointsOutQty].id === "fp3"||
                                                    template.details[blockQty].pointsOut[pointsOutQty].id === "fp11" ||
                                                    template.details[blockQty].pointsOut[pointsOutQty].id === "fp12" ) {
                                                    noVvPath += template.details[blockQty].pointsOut[pointsOutQty].x + " " + (template.details[blockQty].pointsOut[pointsOutQty].y+130) + ",";

                                                } else {
                                                    noVvPath += template.details[blockQty].pointsOut[pointsOutQty].x + " " + template.details[blockQty].pointsOut[pointsOutQty].y + ",";

                                                }
                                                if (template.details[blockQty].pointsOut[pointsOutQty].id === "fp7" ||
                                                    template.details[blockQty].pointsOut[pointsOutQty].id === "fp3" ||
                                                    template.details[blockQty].pointsOut[pointsOutQty].id === "fp11"
                                                ) {
                                                    noVvPath += template.details[blockQty].pointsOut[pointsOutQty + 3].x + " " + template.details[blockQty].pointsOut[pointsOutQty + 3].y + ",";
                                                }
                                            }
                                        }
                                    }
                                    // if ((template.details[blockQty].pointsOut[pointsOutQty].id === 'fp1') || (template.details[blockQty].pointsOut[pointsOutQty].id === 'fp3')) {
                                    //     fpDgLR += (template.details[blockQty].pointsOut[pointsOutQty].x);
                                    //     if (!pointsOutQty) {
                                    //         fpDgLR += ' ' + ((template.details[blockQty].pointsOut[pointsOutQty].y));
                                    //     } else {
                                    //         fpDgLR += ' ' + ((template.details[blockQty].pointsOut[pointsOutQty].y)) + ',';
                                    //     }
                                    // }
                                    //
                                    // if ((template.details[blockQty].pointsOut[pointsOutQty].id === 'fp2') || (template.details[blockQty].pointsOut[pointsOutQty].id === 'fp4')) {
                                    //     fpDgRL += (template.details[blockQty].pointsOut[pointsOutQty].x);
                                    //     if (!pointsOutQty) {
                                    //         fpDgRL += ' ' + ((template.details[blockQty].pointsOut[pointsOutQty].y));
                                    //     } else {
                                    //         fpDgRL += ' ' + ((template.details[blockQty].pointsOut[pointsOutQty].y)) + ',';
                                    //     }
                                    // }


                                    if (template.details[blockQty].pointsOut[pointsOutQty]) {
                                        path += (template.details[blockQty].pointsOut[pointsOutQty].x);
                                        if (!pointsOutQty) {
                                            path += ' ' + ((template.details[blockQty].pointsOut[pointsOutQty].y));
                                        } else {
                                            path += ' ' + ((template.details[blockQty].pointsOut[pointsOutQty].y)) + ',';
                                        }
                                    }

                                    // if (template.details[blockQty].pointsOut[pointsOutQty].id === 'fp3') {
                                    //     if (!pointsOutQty) {
                                    //         heightWmd += ' ' + (template.details[blockQty].pointsOut[pointsOutQty].y);
                                    //     } else {
                                    //         heightWmd += ' ' + (template.details[blockQty].pointsOut[pointsOutQty].y) + ',';
                                    //     }
                                    // }
                                    //
                                    // if (template.details[blockQty].pointsOut[pointsOutQty].id === 'fp3') {
                                    //     widthWmd += (template.details[blockQty].pointsOut[pointsOutQty].x);
                                    // }
                                }
                            }
                        }
                        var arrX = [];
                        var arrY = [];
                        template.details.forEach(function (templateDetails) {
                            if (templateDetails.level === 1) {
                                templateDetails.pointsOut.forEach(function (templateDetailsPointsOut) {
                                    arrX.push(templateDetailsPointsOut.x);
                                    arrY.push(templateDetailsPointsOut.y);
                                });
                            }
                        });
                        heightWmd = Math.max.apply(null, arrY);
                        widthWmd = Math.max.apply(null, arrX);
                        fpDgLR = "0 0," + widthWmd + " " + heightWmd;
                        fpDgRL = widthWmd + " 0,0 " + heightWmd;
                        var widthT = widthWmd,
                            heightT = heightWmd;

                        if (widthT < 1) {
                            widthT = ProductStor.product.template_width;
                            heightT = ProductStor.product.template_height;
                        } else {
                            widthT = widthWmd;
                            heightT = heightWmd;
                        }
                    }


                    if (ProductStor.product.construction_type === 3) {
                        noVvPath = noVvPath.substring(0, noVvPath.length - 1);
                    }
                  if (ProductStor.product.construction_type === 1) {
                    noVvPath = "";
                  }
                    return {
                        path: path,
                        noVvPath: noVvPath,
                        fpDgLR: fpDgLR,
                        fpDgRL: fpDgRL,
                        heightWmd: heightWmd,
                        widthWmd: widthWmd,
                        widthT: widthT,
                        heightT: heightT
                    };
                }

                thisFactory.publicObj = {
                    templatePoints: templatePoints
                };
                return thisFactory.publicObj;
            });
})();