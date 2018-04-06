/* globals d3 */
(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('BauVoiceApp')
        .directive('svgTemplate',

            function ($location,
                      globalConstants,
                      GeneralServ,
                      ProductStor,
                      SVGServ,
                      DesignServ,
                      PointsServ,
                      GlobalStor,
                      UserStor) {

                return {
                    restrict: 'E',
                    replace: true,
                    transclude: true,
                    scope: {
                        typeConstruction: '=',
                        template: '=',
                        templateWidth: '=',
                        templateHeight: '='
                    },
                    link: function (scope, elem) {
                        /**============ METHODS ================*/

                        function zooming() {
                            d3.select('#main_group')
                                .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                        }

                        function setMarker(defs, id, view, refX, refY, angel, w, h, path, classMarker) {
                            defs.append("marker")
                                .classed(classMarker, true)
                                .attr({
                                    'id': id,
                                    'viewBox': view,
                                    'refX': refX,
                                    'refY': refY,
                                    'markerWidth': w,
                                    'markerHeight': h,
                                    'orient': angel
                                })
                                .append("path")
                                .attr("d", path);
                        }

                        function setGradient(defs) {
                            var frame_fp3 = defs.append("linearGradient")
                                .attr("id", "frame_fp3")
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "0%")
                                .attr("y2", "100%");

                            frame_fp3.append("stop")
                                .attr("offset", "0")
                                .attr("stop-color", "#FFFFFF");

                            frame_fp3.append("stop")
                                .attr("offset", "2.024708e-02")
                                .attr("stop-color", "#F1F5F6");

                            frame_fp3.append("stop")
                                .attr("offset", "3.927802e-02")
                                .attr("stop-color", "#E0E4E5");

                            frame_fp3.append("stop")
                                .attr("offset", "0.94")
                                .attr("stop-color", "#E0E4E5");


                            frame_fp3.append("stop")
                                .attr("offset", "0.98")
                                .attr("stop-color", "#888A8C")
                                .attr("stop-opacity", 0.8);

                            frame_fp3.append("stop")
                                .attr("offset", "1")
                                .attr("stop-color", "#000B2A");


                            var frame_fp2 = defs.append("linearGradient")
                                .attr("id", "frame_fp2")
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "100%")
                                .attr("y2", "0%");

                            frame_fp2.append("stop")
                                .attr("offset", "0")
                                .attr("stop-color", "#FFFFFF");

                            frame_fp2.append("stop")
                                .attr("offset", "2.024708e-02")
                                .attr("stop-color", "#F1F5F6");

                            frame_fp2.append("stop")
                                .attr("offset", "3.927802e-02")
                                .attr("stop-color", "#E0E4E5");

                            frame_fp2.append("stop")
                                .attr("offset", "0.94")
                                .attr("stop-color", "#E0E4E5");


                            frame_fp2.append("stop")
                                .attr("offset", "0.98")
                                .attr("stop-color", "#888A8C")
                                .attr("stop-opacity", 0.8);

                            frame_fp2.append("stop")
                                .attr("offset", "1")
                                .attr("stop-color", "#000B2A");

                            var frame_fp1 = defs.append("linearGradient")
                                .attr("id", "frame_fp1")
                                .attr("x1", "0%")
                                .attr("y1", "100%")
                                .attr("x2", "0%")
                                .attr("y2", "0%");

                            frame_fp1.append("stop")
                                .attr("offset", "0")
                                .attr("stop-color", "#808284");

                            frame_fp1.append("stop")
                                .attr("offset", "2.024708e-02")
                                .attr("stop-color", "#C2C6C7");

                            frame_fp1.append("stop")
                                .attr("offset", "3.927802e-02")
                                .attr("stop-color", "#E0E4E6");

                            frame_fp1.append("stop")
                                .attr("offset", "0.94")
                                .attr("stop-color", "#E0E4E6");
                            frame_fp1.append("stop")
                                .attr("offset", "0.95")
                                .attr("stop-color", "#F2F6F8");

                            frame_fp1.append("stop")
                                .attr("offset", "1")
                                .attr("stop-color", "#FFFFFF");

                            var frame_fp4 = defs.append("linearGradient")
                                .attr("id", "frame_fp4")
                                .attr("x1", "100%")
                                .attr("y1", "0%")
                                .attr("x2", "0%")
                                .attr("y2", "0%");

                            frame_fp4.append("stop")
                                .attr("offset", "0")
                                .attr("stop-color", "#808284");

                            frame_fp4.append("stop")
                                .attr("offset", "2.024708e-02")
                                .attr("stop-color", "#C2C6C7");

                            frame_fp4.append("stop")
                                .attr("offset", "3.927802e-02")
                                .attr("stop-color", "#E0E4E6");

                            frame_fp4.append("stop")
                                .attr("offset", "0.94")
                                .attr("stop-color", "#E0E4E6");

                            frame_fp4.append("stop")
                                .attr("offset", "0.95")
                                .attr("stop-color", "#F2F6F8");

                            frame_fp4.append("stop")
                                .attr("offset", "1")
                                .attr("stop-color", "#FFFFFF");

                            var bead_fp4 = defs.append("linearGradient")
                                .attr("id", "bead_fp4")
                                .attr("x1", "100%")
                                .attr("y1", "0%")
                                .attr("x2", "0%")
                                .attr("y2", "0%");
                            bead_fp4.append("stop")
                                .attr("offset", "0")
                                .attr("stop-color", "#8EDFD4"); //<stop  offset="0" style="stop-color:#8EDFD4"/>
                            bead_fp4.append("stop")
                                .attr("offset", "2.231633e-02")
                                .attr("stop-color", "#8EDFD4"); // <stop  offset="2.231633e-02" style="stop-color:#8EDFD4"/>
                            bead_fp4.append("stop")
                                .attr("offset", "2.447930e-02")
                                .attr("stop-color", "#82CBC1"); //  <stop  offset="2.447930e-02" style="stop-color:#82CBC1"/>
                            bead_fp4.append("stop")
                                .attr("offset", "3.288487e-02")
                                .attr("stop-color", "#54847D"); //  <stop  offset="3.288487e-02" style="stop-color:#54847D"/>
                            bead_fp4.append("stop")
                                .attr("offset", "4.043980e-02")
                                .attr("stop-color", "#304B47"); // <stop  offset="4.043980e-02" style="stop-color:#304B47"/>
                            bead_fp4.append("stop")
                                .attr("offset", "4.687349e-02")
                                .attr("stop-color", "#162221"); // <stop  offset="4.687349e-02" style="stop-color:#162221"/>
                            bead_fp4.append("stop")
                                .attr("offset", "5.193689e-02")
                                .attr("stop-color", "#060909"); // <stop  offset="5.193689e-02" style="stop-color:#060909"/>
                            bead_fp4.append("stop")
                                .attr("offset", "5.500000e-02")
                                .attr("stop-color", "#000000"); // <stop  offset="5.500000e-02" style="stop-color:#000000"/>
                            bead_fp4.append("stop")
                                .attr("offset", "0.1216")
                                .attr("stop-color", "#000000"); // <stop  offset="0.1216" style="stop-color:#000000"/>
                            bead_fp4.append("stop")
                                .attr("offset", "0.1261")
                                .attr("stop-color", "#68696A"); // <stop  offset="0.1261" style="stop-color:#68696A"/>
                            bead_fp4.append("stop")
                                .attr("offset", "0.3224")
                                .attr("stop-color", "#919395"); // <stop  offset="0.3224" style="stop-color:#919395"/>
                            bead_fp4.append("stop")
                                .attr("offset", "0.499")
                                .attr("stop-color", "#AFB2B3"); // <stop  offset="0.499" style="stop-color:#AFB2B3"/>
                            bead_fp4.append("stop")
                                .attr("offset", "0.6488")
                                .attr("stop-color", "#C1C4C6"); //  <stop  offset="0.6488" style="stop-color:#C1C4C6"/>
                            bead_fp4.append("stop")
                                .attr("offset", "0.7537")
                                .attr("stop-color", "#C7CBCD"); // <stop  offset="0.7537" style="stop-color:#C7CBCD"/>
                            bead_fp4.append("stop")
                                .attr("offset", "0.8036")
                                .attr("stop-color", "#CDD1D3"); // <stop  offset="0.8036" style="stop-color:#CDD1D3"/>
                            bead_fp4.append("stop")
                                .attr("offset", "1")
                                .attr("stop-color", "#DEE2E4"); // <stop  offset="1" style="stop-color:#DEE2E4"/>

                            var bead_fp1 = defs.append("linearGradient")
                                .attr("id", "bead_fp1")
                                .attr("x1", "0%")
                                .attr("y1", "100%")
                                .attr("x2", "0%")
                                .attr("y2", "0%");

                            bead_fp1.append("stop")
                                .attr("offset", "0")
                                .attr("stop-color", "#8EDFD4"); //<stop  offset="0" style="stop-color:#8EDFD4"/>
                            bead_fp1.append("stop")
                                .attr("offset", "2.231633e-02")
                                .attr("stop-color", "#8EDFD4"); // <stop  offset="2.231633e-02" style="stop-color:#8EDFD4"/>
                            bead_fp1.append("stop")
                                .attr("offset", "2.447930e-02")
                                .attr("stop-color", "#82CBC1"); //  <stop  offset="2.447930e-02" style="stop-color:#82CBC1"/>
                            bead_fp1.append("stop")
                                .attr("offset", "3.288487e-02")
                                .attr("stop-color", "#54847D"); //  <stop  offset="3.288487e-02" style="stop-color:#54847D"/>
                            bead_fp1.append("stop")
                                .attr("offset", "4.043980e-02")
                                .attr("stop-color", "#304B47"); // <stop  offset="4.043980e-02" style="stop-color:#304B47"/>
                            bead_fp1.append("stop")
                                .attr("offset", "4.687349e-02")
                                .attr("stop-color", "#162221"); // <stop  offset="4.687349e-02" style="stop-color:#162221"/>
                            bead_fp1.append("stop")
                                .attr("offset", "5.193689e-02")
                                .attr("stop-color", "#060909"); // <stop  offset="5.193689e-02" style="stop-color:#060909"/>
                            bead_fp1.append("stop")
                                .attr("offset", "5.500000e-02")
                                .attr("stop-color", "#000000"); // <stop  offset="5.500000e-02" style="stop-color:#000000"/>
                            bead_fp1.append("stop")
                                .attr("offset", "0.1216")
                                .attr("stop-color", "#000000"); // <stop  offset="0.1216" style="stop-color:#000000"/>
                            bead_fp1.append("stop")
                                .attr("offset", "0.1261")
                                .attr("stop-color", "#68696A"); // <stop  offset="0.1261" style="stop-color:#68696A"/>
                            bead_fp1.append("stop")
                                .attr("offset", "0.3224")
                                .attr("stop-color", "#919395"); // <stop  offset="0.3224" style="stop-color:#919395"/>
                            bead_fp1.append("stop")
                                .attr("offset", "0.499")
                                .attr("stop-color", "#AFB2B3"); // <stop  offset="0.499" style="stop-color:#AFB2B3"/>
                            bead_fp1.append("stop")
                                .attr("offset", "0.6488")
                                .attr("stop-color", "#C1C4C6"); //  <stop  offset="0.6488" style="stop-color:#C1C4C6"/>
                            bead_fp1.append("stop")
                                .attr("offset", "0.7537")
                                .attr("stop-color", "#C7CBCD"); // <stop  offset="0.7537" style="stop-color:#C7CBCD"/>
                            bead_fp1.append("stop")
                                .attr("offset", "0.8036")
                                .attr("stop-color", "#CDD1D3"); // <stop  offset="0.8036" style="stop-color:#CDD1D3"/>
                            bead_fp1.append("stop")
                                .attr("offset", "1")
                                .attr("stop-color", "#DEE2E4"); // <stop  offset="1" style="stop-color:#DEE2E4"/>

                            var bead_fp2 = defs.append("linearGradient")
                                .attr("id", "bead_fp2")
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "100%")
                                .attr("y2", "0%");

                            bead_fp2.append("stop")
                                .attr("offset", "1.040365e-02")
                                .attr("stop-color", "#769C97"); //<stop  offset="1.040365e-02" style="stop-color:#769C97"/>
                            bead_fp2.append("stop")
                                .attr("offset", "3.798177e-02")
                                .attr("stop-color", "#000000"); // <stop  offset="3.798177e-02" style="stop-color:#000000"/>
                            bead_fp2.append("stop")
                                .attr("offset", "0.12")
                                .attr("stop-color", "#000000"); // <stop  offset="0.12" style="stop-color:#000000"/>
                            bead_fp2.append("stop")
                                .attr("offset", "0.12")
                                .attr("stop-color", "#FFFFFF"); // <stop  offset="0.12" style="stop-color:#FFFFFF"/>
                            bead_fp2.append("stop")
                                .attr("offset", "0.5977")
                                .attr("stop-color", "#FFFFFF"); // <stop  offset="0.5977" style="stop-color:#FFFFFF"/>
                            bead_fp2.append("stop")
                                .attr("offset", "0.6944")
                                .attr("stop-color", "#F7F8F9"); // <stop  offset="0.6944" style="stop-color:#F7F8F9"/>
                            bead_fp2.append("stop")
                                .attr("offset", "0.8376")
                                .attr("stop-color", "#E2E6E8"); // <stop  offset="0.8376" style="stop-color:#E2E6E8"/>
                            bead_fp2.append("stop")
                                .attr("offset", "0.8986")
                                .attr("stop-color", "#D7DBDD")
                                .attr("stop-opacity", "0.8737"); //  <stop  offset="0.8986" style="stop-color:#D7DBDD; stop-opacity:0.8737"/>
                            bead_fp2.append("stop")
                                .attr("offset", "0.9825")
                                .attr("stop-color", "#C2C6C7")
                                .attr("stop-opacity", "0.7"); // <stop  offset="0.9825" style="stop-color:#C2C6C7;stop-opacity:0.7"/>
                            bead_fp2.append("stop")
                                .attr("offset", "0.9851")
                                .attr("stop-color", "#808384"); // <stop  offset="0.9851" style="stop-color:#808384"/>
                            bead_fp2.append("stop")
                                .attr("offset", "1")
                                .attr("stop-color", "#808384"); // <stop  offset="1" style="stop-color:#808384"/>


                            var bead_fp3 = defs.append("linearGradient")
                                .attr("id", "bead_fp3")
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "0%")
                                .attr("y2", "100%");

                            bead_fp3.append("stop")
                                .attr("offset", "1.040365e-02")
                                .attr("stop-color", "#769C97"); //<stop  offset="1.040365e-02" style="stop-color:#769C97"/>
                            bead_fp3.append("stop")
                                .attr("offset", "3.798177e-02")
                                .attr("stop-color", "#000000"); // <stop  offset="3.798177e-02" style="stop-color:#000000"/>
                            bead_fp3.append("stop")
                                .attr("offset", "0.12")
                                .attr("stop-color", "#000000"); // <stop  offset="0.12" style="stop-color:#000000"/>
                            bead_fp3.append("stop")
                                .attr("offset", "0.12")
                                .attr("stop-color", "#FFFFFF"); // <stop  offset="0.12" style="stop-color:#FFFFFF"/>
                            bead_fp3.append("stop")
                                .attr("offset", "0.5977")
                                .attr("stop-color", "#FFFFFF"); // <stop  offset="0.5977" style="stop-color:#FFFFFF"/>
                            bead_fp3.append("stop")
                                .attr("offset", "0.6944")
                                .attr("stop-color", "#F7F8F9"); // <stop  offset="0.6944" style="stop-color:#F7F8F9"/>
                            bead_fp3.append("stop")
                                .attr("offset", "0.8376")
                                .attr("stop-color", "#E2E6E8"); // <stop  offset="0.8376" style="stop-color:#E2E6E8"/>
                            bead_fp3.append("stop")
                                .attr("offset", "0.8986")
                                .attr("stop-color", "#D7DBDD")
                                .attr("stop-opacity", "0.8737"); //  <stop  offset="0.8986" style="stop-color:#D7DBDD; stop-opacity:0.8737"/>
                            bead_fp3.append("stop")
                                .attr("offset", "0.9825")
                                .attr("stop-color", "#C2C6C7")
                                .attr("stop-opacity", "0.7"); // <stop  offset="0.9825" style="stop-color:#C2C6C7;stop-opacity:0.7"/>
                            bead_fp3.append("stop")
                                .attr("offset", "0.9851")
                                .attr("stop-color", "#808384"); // <stop  offset="0.9851" style="stop-color:#808384"/>
                            bead_fp3.append("stop")
                                .attr("offset", "1")
                                .attr("stop-color", "#808384"); // <stop  offset="1" style="stop-color:#808384"/>


                            var sash_fp1 = defs.append("linearGradient")
                                .attr("id", "sash_fp1")
                                .attr("x1", "0%")
                                .attr("y1", "100%")
                                .attr("x2", "0%")
                                .attr("y2", "0%");

                            sash_fp1.append("stop")
                                .attr("offset", "0")
                                .attr("stop-color", "#808384"); // 		<stop  offset="0" style="stop-color:#808384"/>
                            sash_fp1.append("stop")
                                .attr("offset", "1.403468e-02")
                                .attr("stop-color", "#808384"); // <stop  offset="1.403468e-02" style="stop-color:#808384"/>
                            sash_fp1.append("stop")
                                .attr("offset", "1.750650e-02")
                                .attr("stop-color", "#C2C6C7"); //   <stop  offset="1.750650e-02" style="stop-color:#C2C6C7"/>
                            sash_fp1.append("stop")
                                .attr("offset", "2.527444e-02")
                                .attr("stop-color", "#C2C6C7"); //  <stop  offset="2.527444e-02" style="stop-color:#C2C6C7"/>
                            sash_fp1.append("stop")
                                .attr("offset", "2.893414e-02")
                                .attr("stop-color", "#C2C6C7"); //   <stop  offset="2.893414e-02" style="stop-color:#C2C6C7"/>
                            sash_fp1.append("stop")
                                .attr("offset", "3.200000e-02")
                                .attr("stop-color", "#E0E4E6"); //  <stop  offset="3.200000e-02" style="stop-color:#E0E4E6"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.101")
                                .attr("stop-color", "#E0E4E6"); //  <stop  offset="0.101" style="stop-color:#E0E4E6"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.73")
                                .attr("stop-color", "#E0E4E6"); //  <stop  offset="0.73" style="stop-color:#E0E4E6"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.7313")
                                .attr("stop-color", "#E0E4E6"); //   <stop  offset="0.7313" style="stop-color:#E0E4E6"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.7363")
                                .attr("stop-color", "#F1F5F7"); //  <stop  offset="0.7363" style="stop-color:#F1F5F7"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.7506")
                                .attr("stop-color", "#F1F5F7"); //  <stop  offset="0.7506" style="stop-color:#F1F5F7"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.7519")
                                .attr("stop-color", "#FFFFFF"); //  <stop  offset="0.7519" style="stop-color:#FFFFFF"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.7523")
                                .attr("stop-color", "#F3F6F8"); //  <stop  offset="0.7523" style="stop-color:#F3F6F8"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.7523")
                                .attr("stop-color", "#F1F5F7"); //   <stop  offset="0.7523" style="stop-color:#F1F5F7"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.77")
                                .attr("stop-color", "#E2E6E8"); //  <stop  offset="0.77" style="stop-color:#E2E6E8"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.7732")
                                .attr("stop-color", "#E4E8EA"); //   <stop  offset="0.7732" style="stop-color:#E4E8EA"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.7918")
                                .attr("stop-color", "#ECF0F2"); //   <stop  offset="0.7918" style="stop-color:#ECF0F2"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.83")
                                .attr("stop-color", "#EEF2F4"); //   <stop  offset="0.83" style="stop-color:#EEF2F4"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.8474")
                                .attr("stop-color", "#F5F9FB"); //  <stop  offset="0.8474" style="stop-color:#F5F9FB"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.93")
                                .attr("stop-color", "#FFFFFF"); //   <stop  offset="0.93" style="stop-color:#FFFFFF"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.975")
                                .attr("stop-color", "#FFFFFF"); //   <stop  offset="0.975" style="stop-color:#FFFFFF"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.9816")
                                .attr("stop-color", "#FFFFFF")
                                .attr("stop-opacity", "0.9033"); //  <stop  offset="0.9816" style="stop-color:#FFFFFF;stop-opacity:0.9033"/>
                            sash_fp1.append("stop")
                                .attr("offset", "0.988")
                                .attr("stop-color", "#FFFFFF")
                                .attr("stop-opacity", "0.9487"); //   <stop  offset="0.988" style="stop-color:#FFFFFF;stop-opacity:0.9487"/>
                            sash_fp1.append("stop")
                                .attr("offset", "1")
                                .attr("stop-color", "#96989A"); //  <stop  offset="1" style="stop-color:#96989A"/>


                            var sash_fp4 = defs.append("linearGradient")
                                .attr("id", "sash_fp4")
                                .attr("x1", "100%")
                                .attr("y1", "0%")
                                .attr("x2", "0%")
                                .attr("y2", "0%");

                            sash_fp4.append("stop")
                                .attr("offset", "0")
                                .attr("stop-color", "#808384"); // 		<stop  offset="0" style="stop-color:#808384"/>
                            sash_fp4.append("stop")
                                .attr("offset", "1.403468e-02")
                                .attr("stop-color", "#808384"); // <stop  offset="1.403468e-02" style="stop-color:#808384"/>
                            sash_fp4.append("stop")
                                .attr("offset", "1.750650e-02")
                                .attr("stop-color", "#C2C6C7"); //   <stop  offset="1.750650e-02" style="stop-color:#C2C6C7"/>
                            sash_fp4.append("stop")
                                .attr("offset", "2.527444e-02")
                                .attr("stop-color", "#C2C6C7"); //  <stop  offset="2.527444e-02" style="stop-color:#C2C6C7"/>
                            sash_fp4.append("stop")
                                .attr("offset", "2.893414e-02")
                                .attr("stop-color", "#C2C6C7"); //   <stop  offset="2.893414e-02" style="stop-color:#C2C6C7"/>
                            sash_fp4.append("stop")
                                .attr("offset", "3.200000e-02")
                                .attr("stop-color", "#E0E4E6"); //  <stop  offset="3.200000e-02" style="stop-color:#E0E4E6"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.101")
                                .attr("stop-color", "#E0E4E6"); //  <stop  offset="0.101" style="stop-color:#E0E4E6"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.73")
                                .attr("stop-color", "#E0E4E6"); //  <stop  offset="0.73" style="stop-color:#E0E4E6"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.7313")
                                .attr("stop-color", "#E0E4E6"); //   <stop  offset="0.7313" style="stop-color:#E0E4E6"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.7363")
                                .attr("stop-color", "#F1F5F7"); //  <stop  offset="0.7363" style="stop-color:#F1F5F7"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.7506")
                                .attr("stop-color", "#F1F5F7"); //  <stop  offset="0.7506" style="stop-color:#F1F5F7"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.7519")
                                .attr("stop-color", "#FFFFFF"); //  <stop  offset="0.7519" style="stop-color:#FFFFFF"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.7523")
                                .attr("stop-color", "#F3F6F8"); //  <stop  offset="0.7523" style="stop-color:#F3F6F8"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.7523")
                                .attr("stop-color", "#F1F5F7"); //   <stop  offset="0.7523" style="stop-color:#F1F5F7"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.77")
                                .attr("stop-color", "#E2E6E8"); //  <stop  offset="0.77" style="stop-color:#E2E6E8"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.7732")
                                .attr("stop-color", "#E4E8EA"); //   <stop  offset="0.7732" style="stop-color:#E4E8EA"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.7918")
                                .attr("stop-color", "#ECF0F2"); //   <stop  offset="0.7918" style="stop-color:#ECF0F2"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.83")
                                .attr("stop-color", "#EEF2F4"); //   <stop  offset="0.83" style="stop-color:#EEF2F4"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.8474")
                                .attr("stop-color", "#F5F9FB"); //  <stop  offset="0.8474" style="stop-color:#F5F9FB"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.93")
                                .attr("stop-color", "#FFFFFF"); //   <stop  offset="0.93" style="stop-color:#FFFFFF"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.975")
                                .attr("stop-color", "#FFFFFF"); //   <stop  offset="0.975" style="stop-color:#FFFFFF"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.9816")
                                .attr("stop-color", "#FFFFFF")
                                .attr("stop-opacity", "0.9033"); //  <stop  offset="0.9816" style="stop-color:#FFFFFF;stop-opacity:0.9033"/>
                            sash_fp4.append("stop")
                                .attr("offset", "0.988")
                                .attr("stop-color", "#FFFFFF")
                                .attr("stop-opacity", "0.9487"); //   <stop  offset="0.988" style="stop-color:#FFFFFF;stop-opacity:0.9487"/>
                            sash_fp4.append("stop")
                                .attr("offset", "1")
                                .attr("stop-color", "#96989A"); //  <stop  offset="1" style="stop-color:#96989A"/>


                            var sash_fp2 = defs.append("linearGradient")
                                .attr("id", "sash_fp2")
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "100%")
                                .attr("y2", "0%");

                            sash_fp2.append("stop")
                                .attr("offset", "0")
                                .attr("stop-color", "#FFFFFF"); //  	<stop  offset="0" style="stop-color:#FFFFFF"/>
                            sash_fp2.append("stop")
                                .attr("offset", "1.539045e-02")
                                .attr("stop-color", "#FFFFFF"); // <stop  offset="1.539045e-02" style="stop-color:#FFFFFF"/>
                            sash_fp2.append("stop")
                                .attr("offset", "1.724665e-02")
                                .attr("stop-color", "#F1F5F7"); //  <stop  offset="1.724665e-02" style="stop-color:#F1F5F7"/>
                            sash_fp2.append("stop")
                                .attr("offset", "2.110961e-02")
                                .attr("stop-color", "#F1F5F7"); //   <stop  offset="2.110961e-02" style="stop-color:#F1F5F7"/>
                            sash_fp2.append("stop")
                                .attr("offset", "3.266179e-02")
                                .attr("stop-color", "#E3E7E9"); //  <stop  offset="3.266179e-02" style="stop-color:#E3E7E9"/>
                            sash_fp2.append("stop")
                                .attr("offset", "3.370352e-02")
                                .attr("stop-color", "#EDF1F3"); //   <stop  offset="3.370352e-02" style="stop-color:#EDF1F3"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.1106")
                                .attr("stop-color", "#E0E4E6"); //  <stop  offset="0.1106" style="stop-color:#E0E4E6"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.7301")
                                .attr("stop-color", "#E0E4E6"); //  <stop  offset="0.7301" style="stop-color:#E0E4E6"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.7353")
                                .attr("stop-color", "#CCD0D1"); //  <stop  offset="0.7353" style="stop-color:#CCD0D1"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.7447")
                                .attr("stop-color", "#989B9D"); //  <stop  offset="0.7447" style="stop-color:#989B9D"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.7524")
                                .attr("stop-color", "#8A8D8F"); //   <stop  offset="0.7524" style="stop-color:#8A8D8F"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.7562")
                                .attr("stop-color", "#808284"); //   <stop  offset="0.7562" style="stop-color:#808284"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.7728")
                                .attr("stop-color", "#D3D7D9"); //   <stop  offset="0.7728" style="stop-color:#D3D7D9"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.8529")
                                .attr("stop-color", "#D0D4D6"); //  <stop  offset="0.8529" style="stop-color:#D0D4D6"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.93")
                                .attr("stop-color", "#ADB0B1"); //   <stop  offset="0.93" style="stop-color:#ADB0B1"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.9704")
                                .attr("stop-color", "#A0A3A4"); //   <stop  offset="0.9704" style="stop-color:#A0A3A4"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.975")
                                .attr("stop-color", "#969899"); //   <stop  offset="0.975" style="stop-color:#969899"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.9806")
                                .attr("stop-color", "#8E9091"); //   <stop  offset="0.9806" style="stop-color:#8E9091"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.988")
                                .attr("stop-color", "#8E9091"); //   <stop  offset="0.988" style="stop-color:#8E9091"/>
                            sash_fp2.append("stop")
                                .attr("offset", "0.9915")
                                .attr("stop-color", "#67696A"); //   <stop  offset="0.9915" style="stop-color:#67696A"/>
                            sash_fp2.append("stop")
                                .attr("offset", "1")
                                .attr("stop-color", "#67696A"); //  <stop  offset="1" style="stop-color:#67696A"/>


                            var sash_fp3 = defs.append("linearGradient")
                                .attr("id", "sash_fp3")
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "0%")
                                .attr("y2", "100%");


                            sash_fp3.append("stop")
                                .attr("offset", "0")
                                .attr("stop-color", "#FFFFFF"); //<stop  offset="0" style="stop-color:#FFFFFF"/>
                            sash_fp3.append("stop")
                                .attr("offset", "1.539045e-02")
                                .attr("stop-color", "#FFFFFF"); //<stop  offset="1.539045e-02" style="stop-color:#FFFFFF"/>
                            sash_fp3.append("stop")
                                .attr("offset", "1.724665e-02")
                                .attr("stop-color", "#F1F5F7"); //<stop  offset="1.724665e-02" style="stop-color:#F1F5F7"/>
                            sash_fp3.append("stop")
                                .attr("offset", "2.110961e-02")
                                .attr("stop-color", "#F1F5F7"); //<stop  offset="2.110961e-02" style="stop-color:#F1F5F7"/>
                            sash_fp3.append("stop")
                                .attr("offset", "3.266179e-02")
                                .attr("stop-color", "#E3E7E9"); //<stop  offset="3.266179e-02" style="stop-color:#E3E7E9"/>
                            sash_fp3.append("stop")
                                .attr("offset", "3.370352e-02")
                                .attr("stop-color", "#EDF1F3"); //<stop  offset="3.370352e-02" style="stop-color:#EDF1F3"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.1106")
                                .attr("stop-color", "#E0E4E6"); //<stop  offset="0.1106" style="stop-color:#E0E4E6"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.7301")
                                .attr("stop-color", "#E0E4E6"); //<stop  offset="0.7301" style="stop-color:#E0E4E6"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.7353")
                                .attr("stop-color", "#CCD0D1"); //<stop  offset="0.7353" style="stop-color:#CCD0D1"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.7447")
                                .attr("stop-color", "#989B9D"); //<stop  offset="0.7447" style="stop-color:#989B9D"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.7524")
                                .attr("stop-color", "#8A8D8F"); //<stop  offset="0.7524" style="stop-color:#8A8D8F"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.7562")
                                .attr("stop-color", "#808284"); //<stop  offset="0.7562" style="stop-color:#808284"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.7728")
                                .attr("stop-color", "#D3D7D9"); //<stop  offset="0.7728" style="stop-color:#D3D7D9"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.8529")
                                .attr("stop-color", "#D0D4D6"); //<stop  offset="0.8529" style="stop-color:#D0D4D6"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.93")
                                .attr("stop-color", "#ADB0B1"); //<stop  offset="0.93" style="stop-color:#ADB0B1"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.9704")
                                .attr("stop-color", "#A0A3A4"); // <stop  offset="0.9704" style="stop-color:#A0A3A4"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.975")
                                .attr("stop-color", "#969899"); // <stop  offset="0.975" style="stop-color:#969899"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.9806")
                                .attr("stop-color", "#8E9091"); //<stop  offset="0.9806" style="stop-color:#8E9091"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.988")
                                .attr("stop-color", "#8E9091"); // <stop  offset="0.988" style="stop-color:#8E9091"/>
                            sash_fp3.append("stop")
                                .attr("offset", "0.9915")
                                .attr("stop-color", "#67696A"); // <stop  offset="0.9915" style="stop-color:#67696A"/>
                            sash_fp3.append("stop")
                                .attr("offset", "1")
                                .attr("stop-color", "#67696A"); //  <stop  offset="1" style="stop-color:#67696A"/>


                            var impost = defs.append("linearGradient")
                                .attr("id", "impost")
                                .attr("x1", "0%")
                                .attr("y1", "0%")
                                .attr("x2", "100%")
                                .attr("y2", "100%");

                            impost.append("stop")
                                .attr("offset", "0")
                                .attr("stop-color", "#E0E4E6");
                            /*<stop offset="0" style="stop-color:#E0E4E6"/>*/
                            impost.append("stop")
                                .attr("offset", "1")
                                .attr("stop-color", "#E0E4E6");
                            /*<stop offset="1" style="stop-color:#E0E4E6"/>*/


                            var filter = defs.append("filter")
                                .attr({
                                    "id": "rama_shadow",
                                    "x": "-100%",
                                    "y": "-100%",
                                    "width": "400%",
                                    "height": "400%",
                                    "filterUnits": "objectBoundingBox"
                                });
                            filter.append("feGaussianBlur")
                                .attr({
                                    "in": "SourceAlpha",
                                    "stdDeviation": "40"
                                });
                            filter.append("feOffset")
                                .attr({
                                    "dx": "0",
                                    "dy": "0",
                                    "result": "offsetblur"
                                });
                            filter.append("feFlood")
                                .attr({
                                    "flood-color": "#2c2a2a"
                                });
                            filter.append("feComposite")
                                .attr({
                                    "in2": "offsetblur",
                                    "operator": "in"
                                });
                            let feMerge_filter = filter.append("feMerge");
                            feMerge_filter.append("feMergeNode");
                            feMerge_filter.append("feMergeNode")
                                .attr({
                                    "in": "SourceGraphic"
                                });
                            /**<feGaussianBlur in="SourceAlpha" stdDeviation="40"></feGaussianBlur>
                             <feOffset dx="0" dy="0" result="offsetblur"></feOffset>
                             <feFlood flood-color="#8E8C8C"></feFlood>
                             <feComposite in2="offsetblur" operator="in"></feComposite>
                             <feMerge>
                             <feMergeNode></feMergeNode>
                             <feMergeNode in="SourceGraphic"></feMergeNode>
                             </feMerge> */





                            var sash_fp1_shadow = defs.append("filter")
                                .attr({
                                    "id": "sash_fp1_shadow",
                                    "x": "-100%",
                                    "y": "-100%",
                                    "width": "300%",
                                    "height": "300%"
                                });
                            sash_fp1_shadow.append("feGaussianBlur")
                                .attr({
                                    "in": "SourceAlpha",
                                    "stdDeviation": "6"
                                });
                            sash_fp1_shadow.append("feOffset")
                                .attr({
                                    "dx": "3",
                                    "dy": "-4",
                                    "result": "offsetblur"
                                });
                            sash_fp1_shadow.append("feFlood")
                                .attr({
                                    "flood-color": "#2c2a2a"
                                });
                            sash_fp1_shadow.append("feComposite")
                                .attr({
                                    "in2": "offsetblur",
                                    "operator": "in"
                                });
                            let feMerge_fp1 = sash_fp1_shadow.append("feMerge");
                            feMerge_fp1.append("feMergeNode");
                            feMerge_fp1.append("feMergeNode")
                                .attr({
                                    "in": "SourceGraphic"
                                });


                            /**
                             <feComposite in2="offsetblur" operator="in"/>
                             <feMerge>
                             <feMergeNode/>
                             <feMergeNode in="SourceGraphic"/>
                             </feMerge> */

                            var sash_fp2_shadow = defs.append("filter")
                                .attr({
                                    "id": "sash_fp2_shadow",
                                    "x": "-100%",
                                    "y": "-100%",
                                    "width": "300%",
                                    "height": "300%"
                                });
                            sash_fp2_shadow.append("feGaussianBlur")
                                .attr({
                                    "in": "SourceAlpha",
                                    "stdDeviation": "6"
                                });
                            sash_fp2_shadow.append("feOffset")
                                .attr({
                                    "dx": "4",
                                    "dy": "-3",
                                    "result": "offsetblur"
                                });
                            sash_fp2_shadow.append("feFlood")
                                .attr({
                                    "flood-color": "#2c2a2a"
                                });
                            sash_fp2_shadow.append("feComposite")
                                .attr({
                                    "in2": "offsetblur",
                                    "operator": "in"
                                });
                            let feMerge_fp2 = sash_fp2_shadow.append("feMerge");
                            feMerge_fp2.append("feMergeNode");
                            feMerge_fp2.append("feMergeNode")
                                .attr({
                                    "in": "SourceGraphic"
                                });

                            var sash_fp3_shadow = defs.append("filter")
                                .attr({
                                    "id": "sash_fp3_shadow",
                                    "x": "-100%",
                                    "y": "-100%",
                                    "width": "300%",
                                    "height": "300%"
                                });
                            sash_fp3_shadow.append("feGaussianBlur")
                                .attr({
                                    "in": "SourceAlpha",
                                    "stdDeviation": "6"
                                });
                            sash_fp3_shadow.append("feOffset")
                                .attr({
                                    "dx": "-3",
                                    "dy": "4",
                                    "result": "offsetblur"
                                });
                            sash_fp3_shadow.append("feFlood")
                                .attr({
                                    "flood-color": "#2c2a2a"
                                });
                            sash_fp3_shadow.append("feComposite")
                                .attr({
                                    "in2": "offsetblur",
                                    "operator": "in"
                                });
                            let feMerge_fp3 = sash_fp3_shadow.append("feMerge");
                            feMerge_fp3.append("feMergeNode");
                            feMerge_fp3.append("feMergeNode")
                                .attr({
                                    "in": "SourceGraphic"
                                });


                            var sash_fp4_shadow = defs.append("filter")
                                .attr({
                                    "id": "sash_fp4_shadow",
                                    "x": "-100%",
                                    "y": "-100%",
                                    "width": "300%",
                                    "height": "300%"
                                });
                            sash_fp4_shadow.append("feGaussianBlur")
                                .attr({
                                    "in": "SourceAlpha",
                                    "stdDeviation": "6"
                                });
                            sash_fp4_shadow.append("feOffset")
                                .attr({
                                    "dx": "-3",
                                    "dy": "-4",
                                    "result": "offsetblur"
                                });
                            sash_fp4_shadow.append("feFlood")
                                .attr({
                                    "flood-color": "#2c2a2a"
                                });
                            sash_fp4_shadow.append("feComposite")
                                .attr({
                                    "in2": "offsetblur",
                                    "operator": "in"
                                });
                            let feMerge_fp4 = sash_fp4_shadow.append("feMerge");
                            feMerge_fp4.append("feMergeNode");
                            feMerge_fp4.append("feMergeNode")
                                .attr({
                                    "in": "SourceGraphic"
                                });

                        }

                        function setHandle(defs, id, angel, refX, refY, classMarker, url, size) {
                            let marker = defs.append("marker");
                            marker.classed(classMarker, true)
                                .attr({
                                    'id': id,
                                    'viewBox': '0 0 80 160',
                                    'refX': refX,
                                    'refY': refY,
                                    'markerWidth': size,
                                    'markerHeight': size,
                                    'orient': angel || 0
                                })

                            marker.append("image")
                                .attr({
                                    'xlink:href': './img/' + url + '.svg',
                                    'x': 0,
                                    "y": 0,
                                    'width': '110px',
                                    'height': '110px',
                                });
                        }

                        function setSashFittings(param, data, block) {
                            var dirQty = block.sashOpenDir.length,
                                handle;
                            if (block.handlePos) {
                                if (dirQty === 1) {
                                    if (block.handlePos === 2) {
                                        handle = param ? 'url(#handleR)' : 'url(#hingeL)';
                                    } else if (block.handlePos === 1) {
                                        handle = param ? 'url(#handleU)' : 'url(#hingeD)';
                                    } else if (block.handlePos === 4) {
                                        handle = param ? 'url(#handleL)' : 'url(#hingeR)';
                                    } else if (block.handlePos === 3) {
                                        handle = param ? 'url(#handleD)' : 'url(#hingeU)';
                                    }
                                } else if (dirQty === 2) {
                                    if (data.points[1].fi < 45 || data.points[1].fi > 315) {
                                        handle = param ? 'url(#handleR)' : 'url(#hingeL)';
                                    } else if (data.points[1].fi > 135 && data.points[1].fi < 225) {
                                        handle = param ? 'url(#handleL)' : 'url(#hingeR)';
                                    }
                                }
                                return handle;
                            }
                        }

                        function createDimension(dir, dim, dimGroup, lineCreator) {
                            if (scope.typeConstruction !== (globalConstants.SVG_ID_MAIN || globalConstants.SVG_ID_PRINT)) {
                                var dimLineHeight = -150,
                                    dimEdger = 50,
                                    dimMarginBottom = -20,
                                    sizeBoxWidth = 160,
                                    sizeBoxHeight = 70,
                                    sizeBoxRadius = 20,
                                    lineSideL = [],
                                    lineSideR = [],
                                    lineCenter = [],
                                    dimBlock, sizeBox,
                                    pointL1 = {
                                        x: dir ? dimMarginBottom : dim.from,
                                        y: dir ? dim.from : dimMarginBottom
                                    },
                                    pointL2 = {
                                        x: dir ? dimLineHeight : dim.from,
                                        y: dir ? dim.from : dimLineHeight
                                    },
                                    pointR1 = {
                                        x: dir ? dimMarginBottom : dim.to,
                                        y: dir ? dim.to : dimMarginBottom
                                    },
                                    pointR2 = {
                                        x: dir ? dimLineHeight : dim.to,
                                        y: dir ? dim.to : dimLineHeight
                                    },

                                    pointC1 = {
                                        x: dir ? dimLineHeight + dimEdger : dim.from,
                                        y: dir ? dim.from : dimLineHeight + dimEdger
                                    },
                                    pointC2 = {
                                        x: dir ? dimLineHeight + dimEdger : dim.to,
                                        y: dir ? dim.to : dimLineHeight + dimEdger
                                    };
                                if (dim.dimId === "fp7") {
                                    pointL2 = {
                                        x: dir ? dimLineHeight - 200 : dim.from,
                                        y: dir ? dim.from : dimLineHeight
                                    };
                                    pointR2 = {
                                        x: dir ? dimLineHeight - 200 : dim.to,
                                        y: dir ? dim.to : dimLineHeight
                                    };
                                    pointC1 = {
                                        x: dir ? dimLineHeight + dimEdger - 200 : dim.from,
                                        y: dir ? dim.from : dimLineHeight + dimEdger
                                    };
                                    pointC2 = {
                                        x: dir ? dimLineHeight + dimEdger - 200 : dim.to,
                                        y: dir ? dim.to : dimLineHeight + dimEdger
                                    };
                                }
                                // if (dim.dimId === "fp11" ) {
                                //     pointL2 = {
                                //         x: dir ? dimLineHeight - 400 : dim.from,
                                //         y: dir ? dim.from : dimLineHeight
                                //     };
                                //     pointR2 = {
                                //         x: dir ? dimLineHeight - 400 : dim.to,
                                //         y: dir ? dim.to : dimLineHeight
                                //     };
                                //     pointC1 = {
                                //         x: dir ? dimLineHeight + dimEdger - 400 : dim.from,
                                //         y: dir ? dim.from : dimLineHeight + dimEdger
                                //     };
                                //     pointC2 = {
                                //         x: dir ? dimLineHeight + dimEdger - 400 : dim.to,
                                //         y: dir ? dim.to : dimLineHeight + dimEdger
                                //     };
                                // }

                                lineSideL.push(pointL1, pointL2);
                                lineSideR.push(pointR1, pointR2);
                                lineCenter.push(pointC1, pointC2);

                                dimBlock = dimGroup.append('g')
                                    .attr({
                                        'class': function () {
                                            var className;
                                            if (scope.typeConstruction === globalConstants.SVG_ID_ICON) {
                                                if (dir) {
                                                    className = (dim.level) ? 'dim_blockY dim_shiftY' : 'dim_block';
                                                } else {
                                                    className = (dim.level) ? 'dim_blockX dim_shiftX' : 'dim_block';
                                                }
                                            } else {
                                                if (dir) {
                                                    className = (dim.level) ? 'dim_blockY' : 'dim_block dim_hidden';
                                                } else {
                                                    className = (dim.level) ? 'dim_blockX' : 'dim_block dim_hidden';
                                                }
                                            }
                                            return className;
                                        },
                                        'block_id': dim.blockId,
                                        'axis': dim.axis
                                    });

                                dimBlock.append('path')
                                    .classed('size-line', true)
                                    .attr('d', lineCreator(lineSideR));
                                dimBlock.append('path')
                                    .classed('size-line', true)
                                    .attr('d', lineCreator(lineSideL));

                                dimBlock.append('path')
                                    .classed('size-line', true)
                                    .attr({
                                        'd': lineCreator(lineCenter),
                                        'marker-start': function () {
                                            return dir ? 'url(#dimVertR)' : 'url(#dimHorL)';
                                        },
                                        'marker-end': function () {
                                            return dir ? 'url(#dimVertL)' : 'url(#dimHorR)';
                                        }
                                    });

                                sizeBox = dimBlock.append('g')
                                    .classed('size-box', true);
                                if (scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
                                    sizeBox.append('rect')
                                        .classed('size-rect', true)
                                        .attr({
                                            'x': function () {
                                                if ($location.path() === "/mobile") {
                                                    if (dim.dimId === "fp7") {
                                                        return dir ? (dimLineHeight - sizeBoxWidth * 0.8 - 200 - 70) : (dim.from + dim.to - sizeBoxWidth) / 2 - 65;
                                                    }
                                                    // if (dim.dimId === "fp11" ) {
                                                    //     return dir ? (dimLineHeight - sizeBoxWidth * 0.8 - 400) : (dim.from + dim.to - sizeBoxWidth) / 2;
                                                    // }
                                                    return dir ? (dimLineHeight - sizeBoxWidth * 0.8 - 70) : (dim.from + dim.to - sizeBoxWidth) / 2 - 65;
                                                }
                                                if (dim.dimId === "fp7") {
                                                    return dir ? (dimLineHeight - sizeBoxWidth * 0.8 - 200) : (dim.from + dim.to - sizeBoxWidth) / 2;
                                                }
                                                return dir ? (dimLineHeight - sizeBoxWidth * 0.8) : (dim.from + dim.to - sizeBoxWidth) / 2;
                                            },


                                            'y': function () {
                                                if ($location.path() === "/mobile") {
                                                    return dir ? (dim.from + dim.to - sizeBoxHeight - 40) / 2 : (dimLineHeight - sizeBoxHeight * 0.8 - 25);
                                                }
                                                return dir ? (dim.from + dim.to - sizeBoxHeight) / 2 : (dimLineHeight - sizeBoxHeight * 0.8);
                                            },
                                            'rx': sizeBoxRadius,
                                            'ry': sizeBoxRadius,
                                            "height": 46,
                                            "width": 160
                                        });
                                }

                                if (UserStor.userInfo.factory_id === 1966) {
                                    sizeBox.append('text')
                                        .text((dim.text * 0.0393701).toFixed(1))
                                        .attr({
                                            'class': function () {
                                                return (scope.typeConstruction === globalConstants.SVG_ID_EDIT) ? 'size-txt-edit' : 'size-txt';
                                            },
                                            'x': function () {
                                                return dir ? (dimLineHeight - sizeBoxWidth * 0.8) : (dim.from + dim.to - sizeBoxWidth) / 2;
                                            },
                                            'y': function () {
                                                return dir ? (dim.from + dim.to - sizeBoxHeight) / 2 : (dimLineHeight - sizeBoxHeight * 0.8);
                                            },
                                            'dx': 80,
                                            'dy': 40,
                                            'type': 'line',
                                            'block_id': dim.blockId,
                                            'size_val': dim.text,
                                            'min_val': dim.minLimit,
                                            'max_val': dim.maxLimit,
                                            'dim_id': dim.dimId,
                                            'from_point': dim.from,
                                            'to_point': dim.to,
                                            'axis': dim.axis,
                                            'level': dim.level
                                        });
                                } else {
                                    sizeBox.append('text')
                                        .text(dim.text)
                                        .attr({
                                            'class': function () {
                                                return (scope.typeConstruction === globalConstants.SVG_ID_EDIT) ? 'size-txt-edit' : 'size-txt';
                                            },
                                            'x': function () {
                                                if ($location.path() === "/mobile") {
                                                    let move_left = 40;
                                                    if (dim.dimId === "fp7") {
                                                        return dir ? (dimLineHeight - sizeBoxWidth * 0.8 - 200 - move_left) : (dim.from + dim.to - sizeBoxWidth) / 2 - move_left;
                                                    }
                                                    return dir ? (dimLineHeight - sizeBoxWidth * 0.8 - move_left) : (dim.from + dim.to - sizeBoxWidth) / 2 - move_left;
                                                }
                                                if (dim.dimId === "fp7") {
                                                    return dir ? (dimLineHeight - sizeBoxWidth * 0.8 - 200) : (dim.from + dim.to - sizeBoxWidth) / 2;
                                                }
                                                return dir ? (dimLineHeight - sizeBoxWidth * 0.8) : (dim.from + dim.to - sizeBoxWidth) / 2;
                                            },
                                            'y': function () {
                                                return dir ? (dim.from + dim.to - sizeBoxHeight) / 2 : (dimLineHeight - sizeBoxHeight * 0.8);
                                            },
                                            'dx': 80,
                                            'dy': 40,
                                            'type': 'line',
                                            'block_id': dim.blockId,
                                            'size_val': dim.text,
                                            'min_val': dim.minLimit,
                                            'max_val': dim.maxLimit,
                                            'dim_id': dim.dimId,
                                            'from_point': dim.from,
                                            'to_point': dim.to,
                                            'axis': dim.axis,
                                            'level': dim.level
                                        });
                                }

                            }
                        }

                        function createRadiusDimension(dimQ, dimGroup, lineCreator) {

                            var radiusLine = [],
                                sizeBoxRadius = 20,
                                startPR = {
                                    x: dimQ.startX,
                                    y: dimQ.startY
                                },
                                endPR = {
                                    x: dimQ.midleX,
                                    y: dimQ.midleY
                                },
                                dimBlock, sizeBox;

                            radiusLine.push(endPR, startPR);

                            dimBlock = dimGroup.append('g')
                                .attr({
                                    'class': 'dim_block_radius',
                                    'block_id': dimQ.blockId
                                });

                            dimBlock.append('path')
                                .classed('size-line', true)
                                .attr({
                                    'd': lineCreator(radiusLine),
                                    'style': 'stroke: #000;',
                                    'marker-end': 'url(#dimArrow)'
                                });

                            sizeBox = dimBlock.append('g')
                                .classed('size-box', true);

                            if (scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
                                sizeBox.append('rect')
                                    .classed('size-rect', true)
                                    .attr({
                                        'x': dimQ.midleX,
                                        'y': dimQ.midleY,
                                        'rx': sizeBoxRadius,
                                        'ry': sizeBoxRadius,
                                        "height": 46,
                                        "width": 160
                                    });
                            }


                            sizeBox.append('text')
                                .text(dimQ.radius)
                                .attr({
                                    'class': 'size-txt-edit',
                                    'x': dimQ.midleX,
                                    'y': dimQ.midleY,
                                    'dx': 80,
                                    'dy': 40,
                                    'type': 'curve',
                                    'block_id': dimQ.blockId,
                                    'size_val': dimQ.radius,
                                    'min_val': dimQ.radiusMax,
                                    'max_val': dimQ.radiusMin,
                                    'dim_id': dimQ.id,
                                    'chord': dimQ.lengthChord
                                });
                        }

                        function backgroundSVG(heightT, widthT) {
                            if (GlobalStor.global.currOpenPage !== 'light') {
                                if (scope.typeConstruction === globalConstants.SVG_ID_MAIN) {
                                    GlobalStor.global.heightCheck = heightT;
                                    GlobalStor.global.widthCheck = widthT;
                                    GlobalStor.global.backgroundH = heightT / 1680;
                                    GlobalStor.global.backgroundW = widthT / 1680;
                                    GlobalStor.global.background = heightT / 1680;

                                    if (GlobalStor.global.backgroundH < GlobalStor.global.backgroundW) {
                                        GlobalStor.global.background = GlobalStor.global.backgroundW
                                    } else {
                                        GlobalStor.global.background = GlobalStor.global.backgroundH
                                    }
                                    if (ProductStor.product.construction_type === 1) {
                                        GlobalStor.global.imgLink = "44.png";
                                    } else if (ProductStor.product.doorLock.stvorka_type === 6) {
                                        GlobalStor.global.imgLink = "31.jpg";
                                    } else if (ProductStor.product.doorLock.stvorka_type === 7) {
                                        GlobalStor.global.imgLink = "inner-wall_glass.png";
                                    } else {
                                        GlobalStor.global.imgLink = "3333.png";
                                    }
                                }
                            }
                        }

                        function elementsRoom(heightT, widthT) {
                            if ($location.path() !== '/light') {
                                if (scope.typeConstruction === globalConstants.SVG_ID_MAIN) {
                                    var sunH = (((0.18 * heightT) - 252) + 520),
                                        /*height sun rays*/
                                        hD = 755;
                                    $('.elem17_1').css({
                                        "display": "none"
                                    });
                                    /*height display*/
                                    if (ProductStor.product.construction_type === 1) {
                                        var sunW = (((0.18 * widthT) - 234) + 520),
                                            /*width sun rays*/
                                            hsrof = 90,
                                            /*the height of the sun's rays on the floor*/
                                            upLim = 720;
                                        /*upper limit 15 block*/

                                        if (heightT < 1648) {
                                            var upl = 454,
                                                /*upper limit for window sill */
                                                dnl = 100;
                                            /*upper limit for window sill */
                                        }
                                        if (1648 < heightT && heightT < 1848) {
                                            var upl = 524,
                                                dnl = 60;
                                        }
                                        if (1848 <= heightT && heightT < 2148) {
                                            var upl = 574,
                                                dnl = 0;
                                        }
                                        if (2148 <= heightT) {
                                            var upl = 635,
                                                dnl = -30;
                                        }

                                        if (widthT > 900 && heightT < 1648) {
                                            $('.elem5').css('left', (109 + (0.48 * ((widthT / 2) - 700 * 0.32)) / 2) + 'px');
                                        } else {
                                            $('.elem5').css('left', 5000 + 'px');
                                        }

                                        $('.elem15').css({
                                            'width': ((0.48 * (widthT / 2)) + 30) + 'px',
                                            'height': hsrof + 'px',
                                            'top': upLim + 'px'
                                        });
                                        $('.elem11').css('left', 5000 + 'px');
                                        // $('.elem16').css('left', 9 + 'px');
                                        $('.elem8').css('left', 5000 + 'px');
                                        $('.elem7').css('opacity', 0);
                                        $('.elem9').css('opacity', 1);
                                        $('.elem23').css('left', 5000 + 'px');
                                        $('.elem10').css('opacity', 0);
                                        $('.elem17').css({
                                            'width': (0.4 * ((widthT / 2) * 2 + 350)) + 'px',
                                            'height': 41 + 'px',
                                            'left': 215 + 'px',
                                            'top': upl + 'px'
                                        });
                                        $('.elem18').css({
                                            'width': sunW + 'px',
                                            'height': sunH + 'px',
                                            'left': 3 + 'px',
                                            'top': (hD - sunH - dnl) + 'px'
                                        });
                                        $('.elem19').css({
                                            'width': sunW + 'px',
                                            'height': sunH + 'px',
                                            'left': 3 + 'px',
                                            'top': (hD - sunH - dnl) + 'px'
                                        });
                                        $('.elem20').css({
                                            'width': sunW + 'px',
                                            'height': sunH + 'px',
                                            'left': 3 + 'px',
                                            'top': (hD - sunH - dnl) + 'px'
                                        });
                                        $('.elem21').css({
                                            'width': sunW + 'px',
                                            'height': sunH + 'px',
                                            'left': 3 + 'px',
                                            'top': (hD - sunH - dnl) + 'px'
                                        });
                                        $('.elem24').css({
                                            'width': widthT / 4.1 + 108 + 'px'
                                        });

                                        /** ОТКОСЫ SLOPES */

                                        let windowHeight = 0;
                                        let windowWidth = 0;
                                        ProductStor.product.template_source.details.forEach(function (detail) {
                                            if (detail.id === "block_1") {
                                                windowWidth = detail.pointsOut[2].x;
                                                windowHeight = detail.pointsOut[2].y;
                                                return;
                                            }
                                        });

                                        let top = upl - windowHeight * SVGServ.setTemplateScaleMAIN(0.6) - 16;
                                        $('.left-up').css({
                                            'position': 'absolute',
                                            'display': 'inline-block',
                                            'width': '85px',
                                            'height': '85px',
                                            'left': '222px',
                                            'top': top + 'px'
                                        });

                                        let left_right_up = 208 + windowWidth * SVGServ.setTemplateScaleMAIN(0.6);
                                        $('.right-up').css({
                                            'position': 'absolute',
                                            'display': 'inline-block',
                                            'width': '58.5px',
                                            'left': left_right_up + 'px',
                                            'top': top + 'px'
                                        });
                                        // let slope_up_left = $('.left-up').offset().left +  $('.left-up').width();
                                        // let slope_up_left = $('.left_right_up').position().left;
                                        // console.log(windowWidth);
                                        let amendment_height = 0;
                                        let amendment_top = 0;
                                        let slope_up_width = windowWidth * SVGServ.setTemplateScaleMAIN(0.6) - 60;
                                        if (windowWidth <= 515) {
                                            amendment_height = 2;
                                            amendment_top = 1;
                                        } else {
                                            amendment_height = 0;
                                            amendment_top = 0;
                                        }
                                        $('.slope-up').css({
                                            'position': 'absolute',
                                            'display': 'inline-block',
                                            'width': slope_up_width + 'px',
                                            'height': 19.7 + amendment_height + 'px',
                                            'left': '285px',
                                            'top': top - amendment_top + 'px',
                                            'background-size': 'contain'
                                        });
                                        if (windowWidth > 1500) {
                                            $('.slope-up').css({
                                                'background-size': 'contain',

                                            });
                                        }

                                        let left_height = ((windowHeight) * SVGServ.setTemplateScaleMAIN(0.6)) - 30;
                                        let right_height = ((windowHeight) * SVGServ.setTemplateScaleMAIN(0.6)) - 25;
                                        $('.left').css({
                                            'position': 'absolute',
                                            'display': 'inline-block',
                                            'background-size': 'contain',
                                            'width': '20px',
                                            'height': left_height + 'px',
                                            'left': '230px',
                                            'top': top + 60 + 'px'
                                        });

                                        $('.right').css({
                                            'position': 'absolute',
                                            'display': 'inline-block',
                                            'background-size': 'contain',
                                            'height': right_height + 'px',
                                            'width': '17px',
                                            'left': Math.floor(left_right_up) + 42 + 'px',
                                            'top': top + 50 + 'px'
                                        });

                                        /** ОТКОСЫ SLOPES */

                                    }

                                    if (ProductStor.product.construction_type === 4 || ProductStor.product.construction_type === 2) {
                                        var sunW = (((0.18 * widthT) - 234) + 420);
                                        $('.elem23').css({
                                            'width': (1000 * 0.5 + (0.7 * (widthT - 700))) + 'px',
                                            'top': 665 + 'px',
                                            'left': 100 - (2.5 * (0.1 * widthT - 70)) + 'px'
                                        });
                                        $('.elem15').css({
                                            'top': 5000 + 'px'
                                        });
                                        $('.elem17').css({
                                            'width': 0 + 'px',
                                            'height': 0 + 'px',
                                            'left': 0 + 'px'
                                        });
                                        $('.elem18').css({
                                            'width': sunW + 'px',
                                            'height': sunH + 'px',
                                            'left': 130 + 'px',
                                            'top': (hD - sunH + 30) + 'px'
                                        });
                                        $('.elem19').css({
                                            'width': sunW + 'px',
                                            'height': sunH + 'px',
                                            'left': 130 + 'px',
                                            'top': (hD - sunH + 30) + 'px'
                                        });
                                        $('.elem20').css({
                                            'width': sunW + 'px',
                                            'height': sunH + 'px',
                                            'left': 130 + 'px',
                                            'top': (hD - sunH + 30) + 'px'
                                        });
                                        $('.elem21').css({
                                            'width': sunW + 'px',
                                            'height': sunH + 'px',
                                            'left': 130 + 'px',
                                            'top': (hD - sunH + 50) + 'px'
                                        });
                                        $('.elem32').css({
                                            'left': (381 + (0.48 * ((widthT / 2) - 700 * 0.32))) + 'px'
                                        });
                                        $('.elem34').css({
                                            'left': (0.23 * widthT + (190 - 19)) + 'px',
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 189 + 'px',
                                        });
                                        $('.elem38').css({
                                            'width': (0.23 * widthT - 135) + 'px',
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 189 + 'px',
                                        });
                                        $('.elem39').css({
                                            'left': (0.23 * widthT + (261 - 18)) + 'px',
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 468 + 'px',
                                            'height': 0.23 * (heightT - 2000) + 134 + 'px',
                                        });
                                        $('.elem40').css({
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 468 + 'px',
                                            'height': 0.23 * (heightT - 2000) + 140 + 'px',
                                        });

                                        $('.elem33').css({
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 189 + 'px',
                                        });
                                        $('.elem35').css('left', (0.23 * widthT + (217 - 12.1)) + 'px');

                                        $('.elem11').css('left', (0.23 * (0.991 * widthT) + 280) + 'px');
                                        $('.elem8').css('left', (0.23 * widthT + 275) + 'px');
                                        $('.elem5').css('left', 5000 + 'px');
                                        $('.elem10').css('opacity', 1);
                                        $('.elem7').css('opacity', 1);
                                        // $('.elem16').css('left', 5000 + 'px');
                                        $('.elem9').css('opacity', 0);
                                        $('.elem51').css('left', (0.23 * widthT - 443) + 'px');
                                        $('.elem52').css('left', (0.23 * widthT - 571) + 'px');
                                        $('.elem56').css('left', (0.23 * widthT + 215.42) + 'px');
                                        $('.elem59').css({
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 417 + 'px',
                                            'height': 0.23 * (heightT - 2000) + 27 + 'px',
                                        });
                                        $('.elem60').css({
                                            'left': (0.23 * widthT + (262)) + 'px',
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 412.8 + 'px',
                                            'height': 0.23 * (heightT - 2000) + 32 + 'px',
                                        });
                                        $('.elem55').css({
                                            'left': (0.23 * widthT + 177.9) + 'px',
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 172 + 'px',
                                        });
                                        $('.elem58').css({
                                            'width': (0.23 * widthT - 186.7) + 'px',
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 172.8 + 'px',
                                        });
                                        $('.elem54').css({
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 173 + 'px',
                                        });

                                    }

                                    if (ProductStor.product.construction_type === 3) {
                                        var sunW = (((0.18 * widthT) - 234) + 420);
                                        $('.elem23').css({
                                            'width': (1000 * 0.5 + (0.7 * (widthT - 700))) + 'px',
                                            'top': 665 + 'px',
                                            'left': 100 - (2.5 * (0.1 * widthT - 70)) + 'px',
                                            'z-index': -15
                                        });
                                        $('.elem15').css({
                                            'top': 5000 + 'px'
                                        });
                                        $('.elem17').css({
                                            'width': 0 + 'px',
                                            'height': 0 + 'px',
                                            'left': 0 + 'px'
                                        });
                                        $('.elem8').css('left', (0.23 * widthT + 275) + 'px');


                                        var windowWidth = 0;
                                        var windowHeight = 0;
                                        var doorHeight = 0;
                                        var doorWidth = 0;
                                        if (ProductStor.product.template_source.name === "balconies1") {
                                            //правый откос для двери
                                            $('.elem11').css('left', (0.23 * (0.991 * widthT) + 280) + 'px');
                                            ProductStor.product.template_source.details.forEach(function (detail) {
                                                if (detail.id === "block_1") {
                                                    // console.log(detail.pointsOut);
                                                    windowWidth = detail.pointsOut[2].x;
                                                    windowHeight = detail.pointsOut[2].y;
                                                    return;
                                                }
                                                if (detail.id === "block_2") {
                                                    doorHeight = detail.pointsOut[2].y;
                                                    return;
                                                }
                                            });

                                            //Левый откос для двери
                                            $('.elem10').css({
                                                'left': 267 + windowWidth * SVGServ.setTemplateScaleMAIN(0.6) + 'px'
                                            });

                                            var tmp = windowWidth * SVGServ.setTemplateScaleMAIN(1) + 55;
                                            var tmp2 = windowHeight * SVGServ.setTemplateScaleMAIN(0.6) + 180;

                                            //подоконник
                                            $('.elem17').css({
                                                'width': tmp + 'px',
                                                'height': 41 + 'px',
                                                'left': 257 + 'px',
                                                'top': tmp2 + 'px'
                                            });
                                            setTimeout(function () {
                                                $('.elem8_1').width(windowWidth * SVGServ.setTemplateScaleMAIN(0.6) + 66 + "px")
                                            }, 100);


                                        }


                                        if (ProductStor.product.template_source.name === "balconies2") {
                                            ProductStor.product.template_source.details.forEach(function (detail) {
                                                if (detail.id === "block_2") {
                                                    doorWidth = detail.pointsOut[0].x;
                                                    windowHeight = detail.pointsOut[2].y;
                                                    windowWidth = detail.pointsOut[2].x - doorWidth;
                                                    doorHeight = detail.pointsOut[2].y;
                                                    return;
                                                }

                                            });
                                            //правый откос для двери
                                            $('.elem11').css({
                                                'left': 279 + doorWidth * SVGServ.setTemplateScaleMAIN(0.6) + 'px'
                                            });
                                            $('.elem8').css({
                                                'left': 282 + doorWidth * SVGServ.setTemplateScaleMAIN(0.6) + 'px',
                                                "z-index": -12
                                            });
                                            //Левый откос для двери
                                            $('.elem10').css('left', 266 + 'px');
                                            //Левый откос для двери

                                            var tmp = windowWidth * SVGServ.setTemplateScaleMAIN(1) + 55;
                                            var tmp2 = windowHeight * SVGServ.setTemplateScaleMAIN(0.6) + 180;

                                            //подоконник
                                            $('.elem17').css({
                                                'width': tmp + 'px',
                                                'height': 41 + 'px',
                                                'left': 290 + doorWidth * SVGServ.setTemplateScaleMAIN(0.6) + 'px',
                                                'top': tmp2 + 'px'
                                            });
                                            $('.elem7_1').css({
                                                'width': 85 + 'px',
                                            });
                                            setTimeout(function () {
                                                $('.elem8_1').width(66 + "px")
                                            }, 100);
                                        }

                                        if (ProductStor.product.template_source.name === "balconies3") {
                                            var leftWindowWidth = 0;
                                            var leftWindowHeight = 0;
                                            var rightWindowWidth = 0;
                                            var rightWindowHeight = 0;
                                            var rightSill = 0;
                                            doorWidth = 0;
                                            doorHeight = 0;

                                            ProductStor.product.template_source.details.forEach(function (detail) {
                                                if (detail.id === "block_1") {
                                                    leftWindowWidth = detail.pointsOut[1].x;
                                                    leftWindowHeight = detail.pointsOut[2].y;
                                                }
                                                if (detail.id === "block_3") {
                                                    rightWindowWidth = detail.pointsOut[1].x - detail.pointsOut[0].x;
                                                    rightSill = detail.pointsOut[0].x;
                                                    rightWindowHeight = detail.pointsOut[2].y;
                                                }
                                            });
                                            $('.elem10').css({
                                                'left': 267 + leftWindowWidth * SVGServ.setTemplateScaleMAIN(0.6) + 'px'
                                            });
                                            $('.elem11').css({
                                                'left': 267 + rightSill * SVGServ.setTemplateScaleMAIN(0.6) + 11 + 'px'
                                            });


                                            $('.elem17_1').css({
                                                "display": "inline-block",
                                                'width': rightWindowWidth * SVGServ.setTemplateScaleMAIN(1) + 45 + 'px',
                                                'height': 41 + 'px',
                                                'left': 290 + rightSill * SVGServ.setTemplateScaleMAIN(0.6) + 'px',
                                                'top': rightWindowHeight * SVGServ.setTemplateScaleMAIN(0.6) + 180 + 'px'
                                            });

                                            $('.elem8').css({
                                                'left': 282 + rightSill * SVGServ.setTemplateScaleMAIN(0.6) + 'px',
                                                "z-index": -12
                                            });
                                            //подоконник
                                            $('.elem17').css({
                                                'width': leftWindowWidth * SVGServ.setTemplateScaleMAIN(1) + 45 + 'px',
                                                'height': 41 + 'px',
                                                'left': 257 + 'px',
                                                'top': leftWindowHeight * SVGServ.setTemplateScaleMAIN(0.6) + 180 + 'px'
                                            });
                                            setTimeout(function () {
                                                $('.elem8_1').width(leftWindowWidth * SVGServ.setTemplateScaleMAIN(0.6) + 66 + "px")
                                            }, 100);
                                        }


                                        $('.elem18').css({
                                            'width': sunW + 'px',
                                            'height': sunH + 'px',
                                            'left': 130 + 'px',
                                            'top': (hD - sunH + 30) + 'px'
                                        });
                                        $('.elem19').css({
                                            'width': sunW + 'px',
                                            'height': sunH + 'px',
                                            'left': 130 + 'px',
                                            'top': (hD - sunH + 30) + 'px'
                                        });
                                        $('.elem20').css({
                                            'width': sunW + 'px',
                                            'height': sunH + 'px',
                                            'left': 130 + 'px',
                                            'top': (hD - sunH + 30) + 'px'
                                        });
                                        $('.elem21').css({
                                            'width': sunW + 'px',
                                            'height': sunH + 'px',
                                            'left': 130 + 'px',
                                            'top': (hD - sunH + 50) + 'px'
                                        });
                                        $('.elem32').css({
                                            'left': (381 + (0.48 * ((widthT / 2) - 700 * 0.32))) + 'px'
                                        });
                                        $('.elem34').css({
                                            'left': (0.23 * widthT + (190 - 19)) + 'px',
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 189 + 'px',
                                        });
                                        $('.elem38').css({
                                            'width': (0.23 * widthT - 135) + 'px',
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 189 + 'px',
                                        });
                                        $('.elem39').css({
                                            'left': (0.23 * widthT + (261 - 18)) + 'px',
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 468 + 'px',
                                            'height': 0.23 * (heightT - 2000) + 134 + 'px',
                                        });
                                        $('.elem40').css({
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 468 + 'px',
                                            'height': 0.23 * (heightT - 2000) + 140 + 'px',
                                        });

                                        $('.elem33').css({
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 189 + 'px',
                                        });
                                        $('.elem35').css('left', (0.23 * widthT + (217 - 12.1)) + 'px');

                                        $('.elem5').css('left', 5000 + 'px');
                                        $('.elem10').css('opacity', 1);
                                        $('.elem7').css('opacity', 1);
                                        // $('.elem16').css('left', 5000 + 'px');
                                        $('.elem9').css('opacity', 0);
                                        $('.elem51').css('left', (0.23 * widthT - 443) + 'px');
                                        $('.elem52').css('left', (0.23 * widthT - 571) + 'px');
                                        $('.elem56').css('left', (0.23 * widthT + 215.42) + 'px');
                                        $('.elem59').css({
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 417 + 'px',
                                            'height': 0.23 * (heightT - 2000) + 27 + 'px',
                                        });
                                        $('.elem60').css({
                                            'left': (0.23 * widthT + (262)) + 'px',
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 412.8 + 'px',
                                            'height': 0.23 * (heightT - 2000) + 32 + 'px',
                                        });
                                        $('.elem55').css({
                                            'left': (0.23 * widthT + 177.9) + 'px',
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 172 + 'px',
                                        });
                                        $('.elem58').css({
                                            'width': (0.23 * widthT - 186.7) + 'px',
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 172.8 + 'px',
                                        });
                                        $('.elem54').css({
                                            'top': 0.23 * ((heightT - 2000) * (-1)) + 173 + 'px',
                                        });
                                    }
                                }
                            }
                        }

                        function getOffsetSum(elem) {
                            var top = 0,
                                left = 0
                            while (elem) {
                                top = top + parseFloat(elem.offsetTop)
                                left = left + parseFloat(elem.offsetLeft)
                                elem = elem.offsetParent
                            }
                            return {
                                top: Math.round(top),
                                left: Math.round(left)
                            }
                        }

                        function buildSVG(template, widthSVG, heightSVG) {
                            if (template && !$.isEmptyObject(template)) {
                                var container = document.createElement('div'),
                                    lineCreator = d3.svg.line()
                                        .x(function (d) {
                                            return d.x;
                                        })
                                        .y(function (d) {
                                            return d.y;
                                        })
                                        .interpolate("linear"),
                                    padding = 0.7,
                                    position = {
                                        x: 0,
                                        y: 0
                                    },
                                    mainSVG, mainGroup, elementsGroup, dimGroup,
                                    points, dimMaxMin, scale, blocksQty, i, corners,
                                    pnt = PointsServ.templatePoints(template);
                                if (scope.typeConstruction === globalConstants.SVG_CLASS_ICON) {
                                    padding = 1;

                                } else if (scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
                                    padding = 0.6;
                                } else if (scope.typeConstruction === (globalConstants.SVG_ID_MAIN || globalConstants.SVG_ID_PRINT)) {
                                    padding = 0.6;
                                }

                                mainSVG = d3.select(container).append('svg').attr({
                                    'width': widthSVG,
                                    'height': heightSVG
                                });

                                if (scope.typeConstruction === globalConstants.SVG_CLASS_ICON) {
                                    mainSVG.attr('class', scope.typeConstruction);
                                } else {
                                    mainSVG.attr('id', scope.typeConstruction);
                                }

                                points = SVGServ.collectAllPointsOut(template.details);
                                dimMaxMin = GeneralServ.getMaxMinCoord(points);

                                if (scope.typeConstruction === globalConstants.SVG_ID_MAIN) {
                                    scale = SVGServ.setTemplateScaleMAIN(padding);
                                } else if (scope.typeConstruction === globalConstants.SVG_ID_PRINT) {
                                    scale = SVGServ.setTemplateScale(dimMaxMin, widthSVG, heightSVG, padding);
                                } else {
                                    scale = SVGServ.setTemplateScale(dimMaxMin, widthSVG, heightSVG, padding);
                                }
                                if (scope.typeConstruction === globalConstants.SVG_CLASS_ICON) {
                                    position = SVGServ.setTemplatePosition(dimMaxMin, widthSVG, heightSVG, scale, 1);
                                }
                                if (scope.typeConstruction !== globalConstants.SVG_CLASS_ICON) {
                                    if (scope.typeConstruction === globalConstants.SVG_ID_MAIN) {
                                        position = SVGServ.setTemplatePositionMAIN(dimMaxMin, heightSVG, scale);
                                    } else if (scope.typeConstruction === globalConstants.SVG_ID_PRINT || scope.typeConstruction === globalConstants.SVG_ID_PRINT) {
                                        position = SVGServ.setTemplatePosition(dimMaxMin, widthSVG, heightSVG, scale, 1);
                                    } else {
                                        position = SVGServ.setTemplatePosition(dimMaxMin, widthSVG, heightSVG, scale);
                                    }

                                }

                                mainGroup = mainSVG.append("g").attr({
                                    'id': 'main_group',
                                    'transform': 'translate(' + position.x + ', ' + position.y + ') scale(' + scale + ',' + scale + ')'
                                });

                                if (scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
                                    //disable scrolling and displacement
                                    /*  mainSVG.call(d3.behavior.zoom()
                                     .translate([position.x, position.y])
                                     .scale(scale)
                                     .scaleExtent([0, 8])
                                     .on("zoom", zooming));*/
                                }

                                /** Defs */
                                if (scope.typeConstruction !== globalConstants.SVG_CLASS_ICON) {
                                    var defs = mainGroup.append("defs");
                                    /** Points */
                                    var noVvPath = pnt.noVvPath,
                                        widthT = pnt.widthT,
                                        heightT = pnt.heightT;
                                    /** background */
                                    if (GlobalStor.global.currOpenPage === 'main' && GlobalStor.global.activePanel === 0) {
                                        elementsRoom(heightT, widthT);
                                        backgroundSVG(heightT, widthT);
                                    } else if (heightT !== GlobalStor.global.heightCheck || widthT !== GlobalStor.global.widthCheck) {
                                        backgroundSVG(heightT, widthT, defs);
                                        elementsRoom(heightT, widthT);
                                    }
                                    let color_id = 0;
                                    /** lamination */
                                    if (ProductStor.product.lamination.img_in_id > 1) {
                                        if (ProductStor.product.lamination.img_in_id === 4 ||
                                            ProductStor.product.lamination.img_in_id === 14 ||
                                            ProductStor.product.lamination.img_in_id === 5 ||
                                            ProductStor.product.lamination.img_in_id === 15 ||
                                            ProductStor.product.lamination.img_in_id === 6 ||
                                            ProductStor.product.lamination.img_in_id === 16 ||
                                            ProductStor.product.lamination.img_in_id === 8 ||
                                            ProductStor.product.lamination.img_in_id === 18) {

                                            if (ProductStor.product.lamination.img_in_id === 4 || ProductStor.product.lamination.img_in_id === 14) {
                                                color_id = 4;
                                            }
                                            if (ProductStor.product.lamination.img_in_id === 5 || ProductStor.product.lamination.img_in_id === 15) {
                                                color_id = 5;
                                            }
                                            if (ProductStor.product.lamination.img_in_id === 6 || ProductStor.product.lamination.img_in_id === 16) {
                                                color_id = 6;
                                            }
                                            if (ProductStor.product.lamination.img_in_id === 8 || ProductStor.product.lamination.img_in_id === 18) {
                                                color_id = 8;
                                            }
                                            defs.append('pattern')
                                                .attr('id', 'laminat_horizontal_frame')
                                                .attr('patternUnits', 'objectBoundingBox')
                                                .attr('width', 100 + "%")
                                                .attr('height', 100 + "%")
                                                .attr('preserveAspectRatio', "none")
                                                .attr('viewBox', "0 0 350 50")
                                                .append("image")
                                                .attr("xlink:href", "img/lamination/" + color_id + "_impost_hor.jpg")
                                                .attr('width', 1500)
                                                .attr('height', 50);

                                            defs.append('pattern')
                                                .attr('id', 'laminat_vertical_frame')
                                                .attr('patternUnits', 'objectBoundingBox')
                                                .attr('width', 100 + "%")
                                                .attr('height', 100 + "%")
                                                .attr('preserveAspectRatio', "none")
                                                .attr('viewBox', "0 0 50 350")
                                                .append("image")
                                                .attr("xlink:href", "img/lamination/" + color_id + "_impost_vert.jpg")
                                                .attr('width', 50)
                                                .attr('height', 1500);


                                            defs.append('pattern')
                                                .attr('id', 'laminat_sash_top')
                                                .attr('patternUnits', 'objectBoundingBox')
                                                .attr('width', 100 + "%")
                                                .attr('height', 100 + "%")
                                                .attr('preserveAspectRatio', "none")
                                                .attr('viewBox', "0 0 350 50")
                                                .append("image")
                                                .attr("xlink:href", "img/lamination/" + color_id + "_sash_top.jpg")
                                                .attr('width', 1500)
                                                .attr('height', 50);


                                            defs.append('pattern')
                                                .attr('id', 'laminat_sash_bottom')
                                                .attr('patternUnits', 'objectBoundingBox')
                                                .attr('width', 100 + "%")
                                                .attr('height', 100 + "%")
                                                .attr('preserveAspectRatio', "none")
                                                .attr('viewBox', "0 0 350 50")
                                                .append("image")
                                                .attr("xlink:href", "img/lamination/" + color_id + "_sash_bottom.jpg")
                                                .attr('width', 1500)
                                                .attr('height', 50);

                                            defs.append('pattern')
                                                .attr('id', 'laminat_sash_left')
                                                .attr('patternUnits', 'objectBoundingBox')
                                                .attr('width', 100 + "%")
                                                .attr('height', 100 + "%")
                                                .attr('preserveAspectRatio', "none")
                                                .attr('viewBox', "0 0 50 350")
                                                .append("image")
                                                .attr("xlink:href", "img/lamination/" + color_id + "_sash_left.jpg")
                                                .attr('width', 50)
                                                .attr('height', 1500);

                                            defs.append('pattern')
                                                .attr('id', 'laminat_sash_right')
                                                .attr('patternUnits', 'objectBoundingBox')
                                                .attr('width', 100 + "%")
                                                .attr('height', 100 + "%")
                                                .attr('preserveAspectRatio', "none")
                                                .attr('viewBox', "0 0 50 350")
                                                .append("image")
                                                .attr("xlink:href", "img/lamination/" + color_id + "_sash_right.jpg")
                                                .attr('width', 50)
                                                .attr('height', 1500);

                                            defs.append('pattern')
                                                .attr('id', 'laminat_bead_top')
                                                .attr('patternUnits', 'objectBoundingBox')
                                                .attr('width', 100 + "%")
                                                .attr('height', 100 + "%")
                                                .attr('preserveAspectRatio', "none")
                                                .attr('viewBox', "0 0 350 50")
                                                .append("image")
                                                .attr("xlink:href", "img/lamination/" + color_id + "_bead_top.jpg")
                                                .attr('width', 1500)
                                                .attr('height', 50);


                                            defs.append('pattern')
                                                .attr('id', 'laminat_bead_bottom')
                                                .attr('patternUnits', 'objectBoundingBox')
                                                .attr('width', 100 + "%")
                                                .attr('height', 100 + "%")
                                                .attr('preserveAspectRatio', "none")
                                                .attr('viewBox', "0 0 350 50")
                                                .append("image")
                                                .attr("xlink:href", "img/lamination/" + color_id + "_bead_bottom.jpg")
                                                .attr('width', 1500)
                                                .attr('height', 50);

                                            defs.append('pattern')
                                                .attr('id', 'laminat_bead_left')
                                                .attr('patternUnits', 'objectBoundingBox')
                                                .attr('width', 100 + "%")
                                                .attr('height', 100 + "%")
                                                .attr('preserveAspectRatio', "none")
                                                .attr('viewBox', "0 0 50 350")
                                                .append("image")
                                                .attr("xlink:href", "img/lamination/" + color_id + "_bead_left.jpg")
                                                .attr('width', 50)
                                                .attr('height', 1500);

                                            defs.append('pattern')
                                                .attr('id', 'laminat_bead_right')
                                                .attr('patternUnits', 'objectBoundingBox')
                                                .attr('width', 100 + "%")
                                                .attr('height', 100 + "%")
                                                .attr('preserveAspectRatio', "none")
                                                .attr('viewBox', "0 0 50 350")
                                                .append("image")
                                                .attr("xlink:href", "img/lamination/" + color_id + "_bead_right.jpg")
                                                .attr('width', 50)
                                                .attr('height', 1500);
                                        }

                                        defs.append('pattern')
                                            .attr('id', 'laminat')
                                            .attr('patternUnits', 'userSpaceOnUse')
                                            .attr('width', 600)
                                            .attr('height', 400)
                                            .append("image")
                                            .attr("xlink:href", "img/lamination/" + ProductStor.product.lamination.img_in_id + ".jpg")
                                            .attr('width', 600)
                                            .attr('height', 400);

                                        defs.append('pattern')
                                            .attr('id', 'laminat1')
                                            .attr('patternUnits', 'userSpaceOnUse')
                                            .attr('width', 150)
                                            .attr('height', 100)
                                            .append("image")
                                            .attr("xlink:href", "img/lamination/" + ProductStor.product.lamination.img_in_id + ".jpg")
                                            .attr('width', 150)
                                            .attr('height', 100);


                                    } else if (ProductStor.product.doorLock.stvorka_type === 6) {
                                        defs.append('pattern')
                                            .attr('id', 'laminat')
                                            .attr('patternUnits', 'userSpaceOnUse')
                                            .attr('width', 600)
                                            .attr('height', 400)
                                            .append("image")
                                            .attr("xlink:href", "img/lamination/" + ProductStor.product.lamination.img_out_id + ".jpg")
                                            .attr('width', 600)
                                            .attr('height', 400);

                                        defs.append('pattern')
                                            .attr('id', 'laminat1')
                                            .attr('patternUnits', 'userSpaceOnUse')
                                            .attr('width', 150)
                                            .attr('height', 100)
                                            .append("image")
                                            .attr("xlink:href", "img/lamination/" + ProductStor.product.lamination.img_out_id + ".jpg")
                                            .attr('width', 150)
                                            .attr('height', 100);
                                    }
                                    if (GlobalStor.global.imgLink) {
                                        defs.append('pattern')
                                            .attr('id', 'background')
                                            .attr('patternUnits', 'userSpaceOnUse')
                                            .attr('width', 2202.92 * GlobalStor.global.background)
                                            .attr('height', 1661.3 * GlobalStor.global.background)
                                            .append("image")
                                            .attr("xlink:href", "./img/room/" + GlobalStor.global.imgLink)
                                            .attr('width', 2202.92 * GlobalStor.global.background)
                                            .attr('height', 1661.3 * GlobalStor.global.background);
                                    }

                                    /** dimension */
                                    if (ProductStor.product.doorLock.stvorka_type !== 6) {
                                        /** handle window and balkony door */
                                        setHandle(defs, 'handleR', 0, 41, 42, 'handle-mark', 'handles/handle_left', 100);
                                        setHandle(defs, 'handleL', 0, 69, 42, 'handle-mark', 'handles/handle_right', 100);
                                        setHandle(defs, 'handleU', 270, 41, 40, 'handle-mark', 'handles/handle_left', 100);
                                        setHandle(defs, 'handleD', 270, 68, 40, 'handle-mark', 'handles/handle_right', 100);

                                        setHandle(defs, 'hingeR', 0, 28, 56, 'hinge-mark', 'handles/hinge', 120);
                                        setHandle(defs, 'hingeL', 0, 69, 56, 'hinge-mark', 'handles/hinge', 120);
                                        setHandle(defs, 'hingeU', 270, 30, 56, 'hinge-mark', 'handles/hinge', 120);
                                        setHandle(defs, 'hingeD', 270, 68, 56, 'hinge-mark', 'handles/hinge', 120);
                                    } else {
                                        /** handle entrance door*/
                                        setHandle(defs, 'handleR', 0, 34, 45, 'handle-mark', 'handles/handle_door_right', 130);
                                        setHandle(defs, 'handleL', 0, 57, 45, 'handle-mark', 'handles/handle_door_right', 130);
                                        /** hinge */
                                        setHandle(defs, 'hingeR', 0, 15, 54, 'hinge-mark', 'handles/hinge', 120);
                                        setHandle(defs, 'hingeL', 0, 84, 54, 'hinge-mark', 'handles/hinge', 120);
                                    }

                                    // setMarker(defs, 'hingeR', '-1 0 9 4', -17,    5, 0,   7,  80, pathHinge, 'hinge-mark');
                                    // setMarker(defs, 'hingeL', '-1 0 9 4', 22,     5, 0,   7,  80, pathHinge, 'hinge-mark');
                                    // setMarker(defs, 'hingeU', '-1 0 9 4', -16.5,  5, 270, 7,  80, pathHinge, 'hinge-mark');
                                    // setMarker(defs, 'hingeD', '-1 0 9 4', 21.5,   5, 270, 7,  80, pathHinge, 'hinge-mark');
                                    //----- horizontal marker arrow
                                    setMarker(defs, 'dimHorL', '-5, -5, 1, 8', -5, -2, 0, 50, 50, 'M 0,0 L -4,-2 L0,-4 z', 'size-line');
                                    setMarker(defs, 'dimHorR', '-5, -5, 1, 8', -5, -2, 180, 50, 50, 'M 0,0 L -4,-2 L0,-4 z', 'size-line');
                                    //------- vertical marker arrow
                                    setMarker(defs, 'dimVertL', '4.2, -1, 8, 9', 5, 2, 90, 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');
                                    setMarker(defs, 'dimVertR', '4.2, -1, 8, 9', 5, 2, 270, 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');

                                    setMarker(defs, 'dimArrow', '4.2, -1, 8, 9', 5, 2, 'auto', 100, 60, 'M 0,0 L 4,2 L0,4 z', 'size-line');
                                    setGradient(defs);

                                }


                                /** soffits */

                                if (scope.typeConstruction === globalConstants.SVG_ID_MAIN) {
                                    var scl = scale * 4.4;
                                    if (ProductStor.product.construction_type === 1) {
                                        var positionX1 = position.x - 160,
                                            positionY1 = 18,
                                            positionX2 = position.x - 340,
                                            positionY2 = -100;
                                        mainGroup.append('g').append("polygon")
                                            .attr({
                                                'id': 'clipPolygonWindow1',
                                                'fill': '#FFFAFA',
                                                'points': noVvPath,
                                                'transform': 'translate(' + positionX1 + ', ' + positionY1 + ') scale(' + (scl) + ',' + (scl) + ')'
                                            });


                                        mainGroup.append('g').append("polygon")
                                            .attr({
                                                'id': 'clipPolygonWindow2',
                                                'fill': '#FFFAFA',
                                                'points': noVvPath,
                                                'transform': 'translate(' + positionX2 + ', ' + positionY1 + ') scale(' + (scl) + ',' + (scl) + ')'
                                            });

                                        mainGroup.append('g').append("polygon")
                                            .attr({
                                                'id': 'clipPolygonWindow3',
                                                'fill': '#FFFAFA',
                                                'points': noVvPath,
                                                'transform': 'translate(' + positionX1 + ', ' + positionY2 + ') scale(' + (scl) + ',' + (scl) + ')'
                                            });

                                        mainGroup.append('g').append("polygon")
                                            .attr({
                                                'id': 'clipPolygonWindow4',
                                                'fill': '#FFFAFA',
                                                'points': noVvPath,
                                                'transform': 'translate(' + positionX2 + ', ' + positionY2 + ') scale(' + (scl) + ',' + (scl) + ')'
                                            });
                                    } else {
                                        mainGroup.append('g').append("polygon")
                                            .attr({
                                                'id': 'clipPolygonDoor3',
                                                'fill': '#FFFAFA',
                                                'points': noVvPath,
                                                'transform': 'translate(' + (position.x - 215) + ', ' + (-80) + ') scale(' + (scl) + ',' + (scl) + ')'
                                            });

                                        mainGroup.append('g').append("polygon")
                                            .attr({
                                                'id': 'clipPolygonDoor4',
                                                'fill': '#FFFAFA',
                                                'points': noVvPath,
                                                'transform': 'translate(' + (position.x - 336) + ', ' + (-80) + ') scale(' + (scl) + ',' + (scl) + ')'
                                            });
                                    }
                                }

                                if (scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
                                    elementsGroup = mainGroup.append("g").attr({
                                        'id': 'elem_group',
                                        'filter': "url(#rama_shadow)"
                                    });
                                } else {
                                    elementsGroup = mainGroup.append("g").attr({
                                        'id': 'elem_group'
                                    });
                                }

                                dimGroup = mainGroup.append("g").attr({
                                    'id': 'dim_group'
                                });

                                blocksQty = template.details.length;
                                for (i = 1; i < blocksQty; i += 1) {
                                    let indexFrame = 0;
                                    let indexBead = 0;
                                    let indexSash = 0;
                                    let indexSashFilter = 0;
                                    elementsGroup.selectAll('path.' + template.details[i].id)
                                        .data(template.details[i].parts)
                                        .enter().append('path')
                                        .attr({
                                            'block_id': template.details[i].id,
                                            'parent_id': template.details[i].parent,
                                            //'class': function(d) { return d.type; },
                                            'class': function (d) {
                                                var className;
                                                if (scope.typeConstruction === globalConstants.SVG_CLASS_ICON) {
                                                    if (d.type === 'glass') {
                                                        if (d.glass_type === 3) {
                                                            className = 'glass-sandwich'
                                                        } else if (d.glass_type === 4) {
                                                            className = 'glass-brown'
                                                        } else {
                                                            className = 'glass-icon'
                                                        }
                                                    } else {
                                                        className = 'frame-icon';
                                                    }
                                                } else {
                                                    if (d.doorstep) {
                                                        className = 'doorstep';
                                                    } else {
                                                        className = (d.type === 'glass') ? 'glass' : 'frame';
                                                    }
                                                }
                                                return className;
                                            },

                                            'item_type': function (d) {
                                                return d.type;
                                            },
                                            'item_dir': function (d) {
                                                return d.dir;
                                            },
                                            'item_id': function (d) {
                                                return d.points[0].id;
                                            },
                                            'd': function (d) {
                                                if (ProductStor.product.doorLock.stvorka_type !== 6) {
                                                    return d.path;
                                                } else if (ProductStor.product.doorLock.stvorka_type === 6 && d.type !== 'bead') {
                                                    return d.path;
                                                }
                                            },
                                            'fill': function (d) {
                                                var fillName;

                                                if (d.type === 'glass') {
                                                    if (scope.typeConstruction === (globalConstants.SVG_ID_MAIN || globalConstants.SVG_ID_PRINT)) {
                                                        if (d.glass_type === 3) {
                                                            fillName = '#ececec';
                                                        } else if (d.glass_type === 4) {
                                                            fillName = '#A52A2A';
                                                        } else {
                                                            fillName = 'url(#background)';
                                                        }
                                                    } else {
                                                        if (d.glass_type === 3) {
                                                            fillName = '#ececec';
                                                        } else if (d.glass_type === 4) {
                                                            fillName = '#A52A2A';
                                                        } else {
                                                            fillName = 'rgba(155, 204, 255, 0.20)';
                                                        }
                                                    }
                                                } else {
                                                    if (ProductStor.product.lamination.img_in_id > 1) {
                                                        if (ProductStor.product.lamination.img_in_id === 4 ||
                                                            ProductStor.product.lamination.img_in_id === 14 ||
                                                            ProductStor.product.lamination.img_in_id === 5 ||
                                                            ProductStor.product.lamination.img_in_id === 15 ||
                                                            ProductStor.product.lamination.img_in_id === 6 ||
                                                            ProductStor.product.lamination.img_in_id === 16 ||
                                                            ProductStor.product.lamination.img_in_id === 8 ||
                                                            ProductStor.product.lamination.img_in_id === 18) {

                                                            if (d.type === "frame") {
                                                                switch (indexFrame) {
                                                                    case 0: {
                                                                        fillName = 'url(#laminat_horizontal_frame)';
                                                                        break;
                                                                    }
                                                                    case 1: {
                                                                        fillName = 'url(#laminat_vertical_frame)';
                                                                        break;
                                                                    }
                                                                    case 2: {
                                                                        fillName = 'url(#laminat_horizontal_frame)';
                                                                        break;
                                                                    }
                                                                    case 3: {
                                                                        fillName = 'url(#laminat_vertical_frame)';
                                                                        indexFrame = 0;
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                            if (d.type === "bead") {
                                                                switch (indexBead) {
                                                                    case 0: {
                                                                        fillName = 'url(#laminat_bead_bottom)';
                                                                        break;
                                                                    }
                                                                    case 1: {
                                                                        fillName = 'url(#laminat_bead_left)';
                                                                        break;
                                                                    }
                                                                    case 2: {
                                                                        fillName = 'url(#laminat_bead_top)';
                                                                        break;
                                                                    }
                                                                    case 3: {
                                                                        fillName = 'url(#laminat_bead_right)';
                                                                        indexFrame = 0;
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                            if (d.type === "sash") {
                                                                switch (indexSash) {
                                                                    case 0: {
                                                                        fillName = 'url(#laminat_sash_bottom)'; //sash_fp3
                                                                        break;
                                                                    }
                                                                    case 1: {
                                                                        fillName = 'url(#laminat_sash_left)'; //sash_fp4
                                                                        break;
                                                                    }
                                                                    case 2: {
                                                                        fillName = 'url(#laminat_sash_top)'; //sash_fp1
                                                                        break;
                                                                    }
                                                                    case 3: {
                                                                        fillName = 'url(#laminat_sash_right)'; //sash_fp2
                                                                        indexSash = 0;
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                            if (d.type === "impost" || d.type === "shtulp") {
                                                                fillName = 'url(#laminat_vertical_frame)';
                                                            }
                                                            if (indexFrame >= 3) {
                                                                indexFrame = 0
                                                            } else {
                                                                indexFrame++;
                                                            }
                                                            if (indexBead >= 3) {
                                                                indexBead = 0
                                                            } else {
                                                                indexBead++;
                                                            }
                                                            if (indexSash >= 3) {
                                                                indexSash = 0
                                                            } else {
                                                                indexSash++;
                                                            }
                                                        } else {

                                                            if ((d.type === 'frame') || (d.type === 'impost')) {
                                                                fillName = (d.type !== 'glass') ? 'url(#laminat)' : '';
                                                            } else {
                                                                fillName = (d.type !== 'glass') ? 'url(#laminat1)' : '';
                                                            }
                                                        }
                                                    } else if (ProductStor.product.lamination.img_out_id > 1 && ProductStor.product.doorLock.stvorka_type === 6) {
                                                        if ((d.type === 'frame') || (d.type === 'impost')) {
                                                            fillName = (d.type !== 'glass') ? 'url(#laminat)' : '';
                                                        } else {
                                                            fillName = (d.type !== 'glass') ? 'url(#laminat1)' : '';
                                                        }
                                                    } else {

                                                        if (d.type === "frame") {
                                                            switch (indexFrame) {
                                                                case 0: {
                                                                    if (d.points[0].id === 'fp3') {
                                                                        fillName = 'url(#frame_fp3)';
                                                                    } else {
                                                                        fillName = 'url(#frame_fp4)';
                                                                    }
                                                                    break;
                                                                }
                                                                case 1: {
                                                                    if (d.points[0].id === 'fp4') {
                                                                        fillName = 'url(#frame_fp4)';
                                                                    } else {
                                                                        fillName = 'url(#frame_fp1)';
                                                                    }
                                                                    break;
                                                                }
                                                                case 2: {
                                                                    if (d.points[0].id === 'fp1') {
                                                                        fillName = 'url(#frame_fp1)';
                                                                    } else {
                                                                        fillName = 'url(#frame_fp2)';
                                                                    }
                                                                    break;
                                                                }
                                                                case 3: {
                                                                    if (d.points[0].id === 'fp2') {
                                                                        fillName = 'url(#frame_fp2)';
                                                                    }
                                                                    indexFrame = 0;
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        if (d.type === "bead") {
                                                            switch (indexBead) {
                                                                case 0: {
                                                                    fillName = 'url(#bead_fp3)';
                                                                    break;
                                                                }
                                                                case 1: {
                                                                    fillName = 'url(#bead_fp4)';
                                                                    break;
                                                                }
                                                                case 2: {
                                                                    fillName = 'url(#bead_fp1)';
                                                                    break;
                                                                }
                                                                case 3: {
                                                                    fillName = 'url(#bead_fp2)';
                                                                    indexBead = 0;
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        if (d.type === "sash") {
                                                            switch (indexSash) {
                                                                case 0: {
                                                                    fillName = 'url(#sash_fp3)';
                                                                    break;
                                                                }
                                                                case 1: {
                                                                    fillName = 'url(#sash_fp4)';
                                                                    break;
                                                                }
                                                                case 2: {
                                                                    fillName = 'url(#sash_fp1)';
                                                                    break;
                                                                }
                                                                case 3: {
                                                                    if (ProductStor.product.door_type_index === 1) {
                                                                        if (d.points[0].id === 'fp2') {
                                                                            fillName = 'url(#sash_fp2)';
                                                                        } else {
                                                                            fillName = 'url(#sash_fp3)';
                                                                        }
                                                                    } else {
                                                                        fillName = 'url(#sash_fp2)';

                                                                    }
                                                                    indexSash = 0;
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        if (d.type === "impost" || d.type === "shtulp") {
                                                            fillName = 'url(#impost)';
                                                        }
                                                        if (indexFrame >= 3) {
                                                            indexFrame = 0
                                                        } else {
                                                            indexFrame++;
                                                        }
                                                        if (indexBead >= 3) {
                                                            indexBead = 0
                                                        } else {
                                                            indexBead++;
                                                        }
                                                        if (indexSash >= 3) {
                                                            indexSash = 0
                                                        } else {
                                                            indexSash++;
                                                        }


                                                        // if (d.type === "frame") {
                                                        //   console.log(d.points[0].id);
                                                        //
                                                        //
                                                        // }
                                                        // else {
                                                        //   fillName = '#f9f9f9';
                                                        // }
                                                        // fillName = 'url(#frame_fp1)';
                                                    }
                                                    if (scope.typeConstruction === globalConstants.SVG_CLASS_ICON) {
                                                        fillName = '#DCDCDC';
                                                    }
                                                    //   if (scope.typeConstruction === (globalConstants.SVG_ID_MAIN || globalConstants.SVG_ID_PRINT)) {
                                                    // } else {
                                                    //     fillName = '#f9f9f9';
                                                    // }
                                                }
                                                return fillName;
                                            },
                                            'filter': function (d) {
                                                let filterName;
                                                if (d.type === "sash") {
                                                    switch (indexSashFilter) {
                                                        case 0: {
                                                            filterName = 'url(#sash_fp3_shadow)';
                                                            break;
                                                        }
                                                        case 1: {
                                                            filterName = 'url(#sash_fp4_shadow)';
                                                            break;
                                                        }
                                                        case 2: {
                                                            filterName = 'url(#sash_fp1_shadow)';
                                                            break;
                                                        }
                                                        case 3: {
                                                            filterName = 'url(#sash_fp2_shadow)';
                                                            indexSashFilter = 0;
                                                            break;
                                                        }
                                                    }
                                                }
                                                if (indexSashFilter >= 3) {
                                                    indexSashFilter = 0
                                                } else {
                                                    indexSashFilter++;
                                                }
                                                if (scope.typeConstruction !== globalConstants.SVG_CLASS_ICON) {
                                                    return filterName;

                                                }
                                            },
                                            'fill-opacity': function (d) {
                                                var fillName;
                                                if (d.type === 'glass') {
                                                    if (scope.typeConstruction === (globalConstants.SVG_ID_MAIN || globalConstants.SVG_ID_PRINT)) {
                                                        if (d.glass_type === 2) {
                                                            fillName = 1;
                                                        } else {
                                                            fillName = 1;
                                                        }
                                                    }
                                                } else if (d.type === 'bead' && ProductStor.product.doorLock.stvorka_type === 6) {
                                                    fillName = 0;
                                                }
                                                return fillName
                                            }

                                        });


                                    if (scope.typeConstruction !== globalConstants.SVG_CLASS_ICON) {
                                        /** sash open direction */
                                        if (template.details[i].sashOpenDir && template.details[i].children.length === 0) {
                                            elementsGroup.selectAll('path.sash_mark.' + template.details[i].id)
                                                .data(template.details[i].sashOpenDir)
                                                .enter()
                                                .append('path')
                                                .classed('sash_mark', true)
                                                .attr({
                                                    'd': function (d) {
                                                        return lineCreator(d.points);
                                                    },
                                                    //------- handler
                                                    'marker-mid': function (d) {
                                                        return setSashFittings(1, d, template.details[i]);
                                                    },
                                                    //------- hinges
                                                    'marker-start': function (d) {
                                                        return setSashFittings(0, d, template.details[i]);
                                                    },
                                                    'marker-end': function (d) {
                                                        return setSashFittings(0, d, template.details[i]);
                                                    }
                                                });
                                        } else if (template.details[i].sashOpenDir && template.details[i].children.length !== 0) {
                                            GlobalStor.global.createHandle.push(i)
                                        }
                                        if (i + 1 === blocksQty && GlobalStor.global.createHandle.length > 0) {
                                            var h = GlobalStor.global.createHandle;
                                            for (var z = 0; z < h.length; z += 1) {
                                                elementsGroup.selectAll('path.sash_mark.' + template.details[h[z]].id)
                                                    .data(template.details[h[z]].sashOpenDir)
                                                    .enter()
                                                    .append('path')
                                                    .classed('sash_mark', true)
                                                    .attr({
                                                        'd': function (d) {
                                                            return lineCreator(d.points);
                                                        },
                                                        //------- handler
                                                        'marker-mid': function (d) {
                                                            return setSashFittings(1, d, template.details[h[z]]);
                                                        },
                                                        //------- hinges
                                                        'marker-start': function (d) {
                                                            return setSashFittings(0, d, template.details[h[z]]);
                                                        },
                                                        'marker-end': function (d) {
                                                            return setSashFittings(0, d, template.details[h[z]]);
                                                        },
                                                        "xlink:href": "./img/handle.svg"
                                                    });
                                            }
                                        }
                                        //---- corner markers
                                        if (scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
                                            if (template.details[i].level === 1) {
                                                //----- create array of frame points with corner = true
                                                corners = template.details[i].pointsOut.filter(function (item) {
                                                    return item.corner > 0;
                                                });
                                                elementsGroup.selectAll('circle.corner_mark.' + template.details[i].id)
                                                    .data(corners)
                                                    .enter()
                                                    .append('circle')
                                                    .attr({
                                                        'block_id': template.details[i].id,
                                                        'class': 'corner_mark',
                                                        'parent_id': function (d) {
                                                            return d.id;
                                                        },
                                                        'cx': function (d) {
                                                            return d.x;
                                                        },
                                                        'cy': function (d) {
                                                            return d.y;
                                                        },
                                                        'r': 0
                                                    });
                                            }
                                        }

                                        /** type Glass names */
                                        if (scope.typeConstruction === globalConstants.SVG_ID_GLASS) {
                                            if (!template.details[i].children.length) {
                                                elementsGroup.append('text')
                                                    .text(template.details[i].glassTxt)
                                                    .attr({
                                                        'block_id': template.details[i].id,
                                                        'class': 'glass-txt',
                                                        'x': template.details[i].center.x,
                                                        'y': template.details[i].center.y
                                                    });
                                            }
                                        }

                                        /** type Grid names */
                                        if (scope.typeConstruction === globalConstants.SVG_ID_GRID) {
                                            if (template.details[i].gridId) {
                                                elementsGroup.append('text')
                                                    .text(template.details[i].gridTxt)
                                                    .attr({
                                                        'class': 'glass-txt',
                                                        'x': template.details[i].center.x,
                                                        'y': template.details[i].center.y
                                                    });
                                            }
                                        }
                                    }
                                }

                                if (scope.typeConstruction !== globalConstants.SVG_CLASS_ICON) {
                                    //--------- dimension
                                    var dimXQty = template.dimension.dimX.length,
                                        dimYQty = template.dimension.dimY.length,
                                        dimQQty = template.dimension.dimQ.length,
                                        dx, dy, dq;
                                    for (dx = 0; dx < dimXQty; dx += 1) {
                                        createDimension(0, template.dimension.dimX[dx], dimGroup, lineCreator);
                                        createDimension(0, template.dimension.dimX[dx], dimGroup, lineCreator);
                                    }
                                    for (dy = 0; dy < dimYQty; dy += 1) {
                                        createDimension(1, template.dimension.dimY[dy], dimGroup, lineCreator);
                                    }
                                    for (dq = 0; dq < dimQQty; dq += 1) {
                                        createRadiusDimension(template.dimension.dimQ[dq], dimGroup, lineCreator);
                                    }
                                }

                                elem.html(container);
                                GlobalStor.global.createHandle = []

                                //======= set Events on elements
                                DesignServ.removeAllEventsInSVG();
                                //--------- set clicking to all elements
                                if (scope.typeConstruction === globalConstants.SVG_ID_EDIT) {
                                    DesignServ.initAllImposts();
                                    DesignServ.initAllGlass();
                                    DesignServ.initAllArcs();
                                    DesignServ.initAllDimension();
                                }
                            }
                        }

                        scope.$watchCollection('template', function () {
                            buildSVG(scope.template, scope.templateWidth, scope.templateHeight);
                        });

                    }
                };

            });
})();
