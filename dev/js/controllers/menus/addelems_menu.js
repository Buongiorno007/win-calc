(function () {
    'use strict';
    /**@ngInject*/
    angular
        .module('MainModule')
        .controller('addElementMenuCtrl',

            function ($timeout,
                      $filter,
                      globalConstants,
                      GlobalStor,
                      ProductStor,
                      UserStor,
                      AuxStor,
                      MainServ,
                      AddElementMenuServ,
                      AddElementsServ,
                      DesignServ) {

                var thisCtrl = this;
                thisCtrl.constants = globalConstants;
                thisCtrl.G = GlobalStor;
                thisCtrl.P = ProductStor;
                thisCtrl.U = UserStor;
                thisCtrl.A = AuxStor;


                thisCtrl.config = {
                    DELAY_START: globalConstants.STEP,
                    DELAY_SHOW_ELEMENTS_MENU: 10 * globalConstants.STEP,
                    typing: 'on'
                };
                AuxStor.aux.coordinats = 0;
                //------- translate
                thisCtrl.TIP = $filter('translate')('add_elements_menu.TIP');
                thisCtrl.EMPTY_ELEMENT = $filter('translate')('add_elements_menu.EMPTY_ELEMENT');
                thisCtrl.NAME_LABEL = $filter('translate')('add_elements.NAME_LABEL');
                thisCtrl.QTY_LABEL = $filter('translate')('add_elements.QTY_LABEL');
                thisCtrl.WIDTH_LABEL = $filter('translate')('add_elements.WIDTH_LABEL');
                thisCtrl.HEIGHT_LABEL = $filter('translate')('add_elements.HEIGHT_LABEL');
                thisCtrl.ADD = $filter('translate')('add_elements.ADD');
                thisCtrl.TAB_NAME_SIMPLE_FRAME = $filter('translate')('add_elements_menu.TAB_NAME_SIMPLE_FRAME');
                thisCtrl.TAB_NAME_HARD_FRAME = $filter('translate')('add_elements_menu.TAB_NAME_HARD_FRAME');
                thisCtrl.TAB_EMPTY_EXPLAIN = $filter('translate')('add_elements_menu.TAB_EMPTY_EXPLAIN');
                thisCtrl.MENU_ELEMENT = $filter('translate')('add_elements_menu.MENU_ELEMENT');
                thisCtrl.MENU_ELEMENT_2 = $filter('translate')('add_elements_menu.MENU_ELEMENT_2');
                thisCtrl.MENU_ELEMENT_3 = $filter('translate')('add_elements_menu.MENU_ELEMENT_3');
                thisCtrl.MENU_ELEMENT_4 = $filter('translate')('add_elements_menu.MENU_ELEMENT_4');
                thisCtrl.MENU_ELEMENT_5 = $filter('translate')('add_elements_menu.MENU_ELEMENT_5');
                thisCtrl.MENU_ELEMENT_6 = $filter('translate')('add_elements_menu.MENU_ELEMENT_6');
                thisCtrl.MENU_ELEMENT_7 = $filter('translate')('add_elements_menu.MENU_ELEMENT_7');
                thisCtrl.MENU_ELEMENT_8 = $filter('translate')('add_elements_menu.MENU_ELEMENT_8');
                thisCtrl.MENU_ELEMENT_9 = $filter('translate')('add_elements_menu.MENU_ELEMENT_9');
                thisCtrl.MENU_ELEMENT_10 = $filter('translate')('add_elements_menu.MENU_ELEMENT_10');
                thisCtrl.MENU_ELEMENT_11 = $filter('translate')('add_elements_menu.MENU_ELEMENT_11');
                thisCtrl.MENU_ELEMENT_12 = $filter('translate')('add_elements_menu.MENU_ELEMENT_12');
                thisCtrl.MENU_ELEMENT_13 = $filter('translate')('add_elements_menu.MENU_ELEMENT_13');
                thisCtrl.MENU_ELEMENT_14 = $filter('translate')('add_elements_menu.MENU_ELEMENT_14');
                thisCtrl.MENU_ELEMENT_15 = $filter('translate')('add_elements_menu.MENU_ELEMENT_15');
                thisCtrl.MENU_ELEMENT_16 = $filter('translate')('add_elements_menu.MENU_ELEMENT_16');
                thisCtrl.MENU_ELEMENT_17 = $filter('translate')('add_elements_menu.MENU_ELEMENT_17');
                thisCtrl.MENU_ELEMENT_18 = $filter('translate')('add_elements_menu.MENU_ELEMENT_18');
                thisCtrl.MENU_ELEMENT_19 = $filter('translate')('add_elements_menu.MENU_ELEMENT_19');
                thisCtrl.MENU_ELEMENT_20 = $filter('translate')('add_elements_menu.MENU_ELEMENT_20');
                thisCtrl.MENU_ELEMENT_21 = $filter('translate')('add_elements_menu.MENU_ELEMENT_21');
                thisCtrl.MENU_ELEMENT_22 = $filter('translate')('add_elements_menu.MENU_ELEMENT_22');
                thisCtrl.MENU_ELEMENT_23 = $filter('translate')('add_elements_menu.MENU_ELEMENT_23');
                thisCtrl.MENU_ELEMENT_24 = $filter('translate')('add_elements_menu.MENU_ELEMENT_24');
                thisCtrl.MENU_ELEMENT_25 = $filter('translate')('add_elements_menu.MENU_ELEMENT_25');
                thisCtrl.MENU_ELEMENT_26 = $filter('translate')('add_elements_menu.MENU_ELEMENT_26');
                thisCtrl.MENU_ELEMENT_27 = $filter('translate')('add_elements_menu.MENU_ELEMENT_27');
                thisCtrl.MENU_ELEMENT_28 = $filter('translate')('add_elements_menu.MENU_ELEMENT_28');
                thisCtrl.MENU_ELEMENT_29 = $filter('translate')('add_elements_menu.MENU_ELEMENT_29');
                thisCtrl.MENU_ELEMENT_30 = $filter('translate')('add_elements_menu.MENU_ELEMENT_30');
                thisCtrl.MENU_ELEMENT_31 = $filter('translate')('add_elements_menu.MENU_ELEMENT_31');
                thisCtrl.MENU_ELEMENT_32 = $filter('translate')('add_elements_menu.MENU_ELEMENT_32');
                thisCtrl.MENU_ELEMENT_33 = $filter('translate')('add_elements_menu.MENU_ELEMENT_33');
                thisCtrl.MENU_ELEMENT_34 = $filter('translate')('add_elements_menu.MENU_ELEMENT_34');
                thisCtrl.MENU_ELEMENT_35 = $filter('translate')('add_elements_menu.MENU_ELEMENT_35');
                thisCtrl.MENU_ELEMENT_36 = $filter('translate')('add_elements_menu.MENU_ELEMENT_36');
                thisCtrl.MENU_ELEMENT_37 = $filter('translate')('add_elements_menu.MENU_ELEMENT_37');
                thisCtrl.MENU_ELEMENT_38 = $filter('translate')('add_elements_menu.MENU_ELEMENT_38');
                thisCtrl.MENU_ELEMENT_39 = $filter('translate')('add_elements_menu.MENU_ELEMENT_39');
                thisCtrl.MENU_ELEMENT_40 = $filter('translate')('add_elements_menu.MENU_ELEMENT_40');
                thisCtrl.MENU_ELEMENT_41 = $filter('translate')('add_elements_menu.MENU_ELEMENT_41');
                thisCtrl.MENU_ELEMENT_42 = $filter('translate')('add_elements_menu.MENU_ELEMENT_42');
                thisCtrl.MENU_ELEMENT_43 = $filter('translate')('add_elements_menu.MENU_ELEMENT_43');
                thisCtrl.MENU_ELEMENT_44 = $filter('translate')('add_elements_menu.MENU_ELEMENT_44');
                thisCtrl.MENU_ELEMENT_45 = $filter('translate')('add_elements_menu.MENU_ELEMENT_45');
                thisCtrl.MENU_ELEMENT_46 = $filter('translate')('add_elements_menu.MENU_ELEMENT_46');
                thisCtrl.MENU_ELEMENT_47 = $filter('translate')('add_elements_menu.MENU_ELEMENT_47');
                thisCtrl.MENU_ELEMENT_48 = $filter('translate')('add_elements_menu.MENU_ELEMENT_48');
                thisCtrl.MENU_ELEMENT_49 = $filter('translate')('add_elements_menu.MENU_ELEMENT_49');
                thisCtrl.MENU_ELEMENT_50 = $filter('translate')('add_elements_menu.MENU_ELEMENT_50');


                thisCtrl.MENU_ELEMENT_51 = $filter('translate')('add_elements_menu.MENU_ELEMENT_51');
                thisCtrl.MENU_ELEMENT_52 = $filter('translate')('add_elements_menu.MENU_ELEMENT_52');
                thisCtrl.MENU_ELEMENT_53 = $filter('translate')('add_elements_menu.MENU_ELEMENT_53');
                thisCtrl.MENU_ELEMENT_54 = $filter('translate')('add_elements_menu.MENU_ELEMENT_54');
                thisCtrl.MENU_ELEMENT_55 = $filter('translate')('add_elements_menu.MENU_ELEMENT_55');

                thisCtrl.MENU_ELEMENT_56 = $filter('translate')('add_elements_menu.MENU_ELEMENT_56');
                thisCtrl.MENU_ELEMENT_57 = $filter('translate')('add_elements_menu.MENU_ELEMENT_57');
                thisCtrl.MENU_ELEMENT_58 = $filter('translate')('add_elements_menu.MENU_ELEMENT_58');
                thisCtrl.MENU_ELEMENT_59 = $filter('translate')('add_elements_menu.MENU_ELEMENT_59');
                thisCtrl.MENU_ELEMENT_60 = $filter('translate')('add_elements_menu.MENU_ELEMENT_60');

                thisCtrl.MENU_ELEMENT_61 = $filter('translate')('add_elements_menu.MENU_ELEMENT_61');
                thisCtrl.MENU_ELEMENT_62 = $filter('translate')('add_elements_menu.MENU_ELEMENT_62');
                thisCtrl.MENU_ELEMENT_63 = $filter('translate')('add_elements_menu.MENU_ELEMENT_63');
                thisCtrl.MENU_ELEMENT_64 = $filter('translate')('add_elements_menu.MENU_ELEMENT_64');
                thisCtrl.MENU_ELEMENT_65 = $filter('translate')('add_elements_menu.MENU_ELEMENT_65');

                thisCtrl.MENU_ELEMENT_66 = $filter('translate')('add_elements_menu.MENU_ELEMENT_66');
                thisCtrl.MENU_ELEMENT_67 = $filter('translate')('add_elements_menu.MENU_ELEMENT_67');
                thisCtrl.MENU_ELEMENT_68 = $filter('translate')('add_elements_menu.MENU_ELEMENT_68');
                thisCtrl.MENU_ELEMENT_69 = $filter('translate')('add_elements_menu.MENU_ELEMENT_69');

                thisCtrl.MENU_ELEMENT_70 = $filter('translate')('add_elements_menu.MENU_ELEMENT_70');
                thisCtrl.MENU_ELEMENT_71 = $filter('translate')('add_elements_menu.MENU_ELEMENT_71');
                thisCtrl.MENU_ELEMENT_72 = $filter('translate')('add_elements_menu.MENU_ELEMENT_72');
                thisCtrl.MENU_ELEMENT_73 = $filter('translate')('add_elements_menu.MENU_ELEMENT_73');
                thisCtrl.MENU_ELEMENT_74 = $filter('translate')('add_elements_menu.MENU_ELEMENT_74');
                thisCtrl.MENU_ELEMENT_75 = $filter('translate')('add_elements_menu.MENU_ELEMENT_75');
                thisCtrl.MENU_ELEMENT_76 = $filter('translate')('add_elements_menu.MENU_ELEMENT_76');
                thisCtrl.MENU_ELEMENT_77 = $filter('translate')('add_elements_menu.MENU_ELEMENT_77');
                thisCtrl.MENU_ELEMENT_78 = $filter('translate')('add_elements_menu.MENU_ELEMENT_78');
                thisCtrl.MENU_ELEMENT_79 = $filter('translate')('add_elements_menu.MENU_ELEMENT_79');


                thisCtrl.MENU_ELEMENT_80 = $filter('translate')('add_elements_menu.MENU_ELEMENT_80');
                thisCtrl.MENU_ELEMENT_81 = $filter('translate')('add_elements_menu.MENU_ELEMENT_81');
                thisCtrl.MENU_ELEMENT_82 = $filter('translate')('add_elements_menu.MENU_ELEMENT_82');
                thisCtrl.MENU_ELEMENT_83 = $filter('translate')('add_elements_menu.MENU_ELEMENT_83');
                thisCtrl.MENU_ELEMENT_84 = $filter('translate')('add_elements_menu.MENU_ELEMENT_84');
                thisCtrl.MENU_ELEMENT_85 = $filter('translate')('add_elements_menu.MENU_ELEMENT_85');
                thisCtrl.MENU_ELEMENT_86 = $filter('translate')('add_elements_menu.MENU_ELEMENT_86');
                thisCtrl.MENU_ELEMENT_87 = $filter('translate')('add_elements_menu.MENU_ELEMENT_87');
                thisCtrl.MENU_ELEMENT_88 = $filter('translate')('add_elements_menu.MENU_ELEMENT_88');
                thisCtrl.MENU_ELEMENT_89 = $filter('translate')('add_elements_menu.MENU_ELEMENT_89');
                thisCtrl.MENU_ELEMENT_90 = $filter('translate')('add_elements_menu.MENU_ELEMENT_90');


                thisCtrl.CHILD_MENU_ELEMENT = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT');
                thisCtrl.CHILD_MENU_ELEMENT_2 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_2');
                thisCtrl.CHILD_MENU_ELEMENT_3 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_3');
                thisCtrl.CHILD_MENU_ELEMENT_4 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_4');
                thisCtrl.CHILD_MENU_ELEMENT_5 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_5');
                thisCtrl.CHILD_MENU_ELEMENT_6 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_6');
                thisCtrl.CHILD_MENU_ELEMENT_7 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_7');
                thisCtrl.CHILD_MENU_ELEMENT_8 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_8');
                thisCtrl.CHILD_MENU_ELEMENT_9 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_9');
                thisCtrl.CHILD_MENU_ELEMENT_10 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_10');
                thisCtrl.CHILD_MENU_ELEMENT_11 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_11');
                thisCtrl.CHILD_MENU_ELEMENT_12 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_12');
                thisCtrl.CHILD_MENU_ELEMENT_13 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_13');
                thisCtrl.CHILD_MENU_ELEMENT_14 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_14');
                thisCtrl.CHILD_MENU_ELEMENT_15 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_15');
                thisCtrl.CHILD_MENU_ELEMENT_16 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_16');
                thisCtrl.CHILD_MENU_ELEMENT_17 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_17');
                thisCtrl.CHILD_MENU_ELEMENT_18 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_18');
                thisCtrl.CHILD_MENU_ELEMENT_19 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_19');
                thisCtrl.CHILD_MENU_ELEMENT_20 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_20');

                thisCtrl.CHILD_MENU_ELEMENT_21 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_21');
                thisCtrl.CHILD_MENU_ELEMENT_22 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_22');
                thisCtrl.CHILD_MENU_ELEMENT_23 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_23');
                thisCtrl.CHILD_MENU_ELEMENT_24 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_24');
                thisCtrl.CHILD_MENU_ELEMENT_25 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_25');
                thisCtrl.CHILD_MENU_ELEMENT_26 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_26');
                thisCtrl.CHILD_MENU_ELEMENT_27 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_27');
                thisCtrl.CHILD_MENU_ELEMENT_28 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_28');
                thisCtrl.CHILD_MENU_ELEMENT_29 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_29');
                thisCtrl.CHILD_MENU_ELEMENT_30 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_30');

                thisCtrl.CHILD_MENU_ELEMENT_31 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_31');
                thisCtrl.CHILD_MENU_ELEMENT_32 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_32');
                thisCtrl.CHILD_MENU_ELEMENT_33 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_33');
                thisCtrl.CHILD_MENU_ELEMENT_34 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_34');
                thisCtrl.CHILD_MENU_ELEMENT_35 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_35');
                thisCtrl.CHILD_MENU_ELEMENT_36 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_36');
                thisCtrl.CHILD_MENU_ELEMENT_37 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_37');
                thisCtrl.CHILD_MENU_ELEMENT_38 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_38');
                thisCtrl.CHILD_MENU_ELEMENT_39 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_39');
                thisCtrl.CHILD_MENU_ELEMENT_40 = $filter('translate')('add_elements_menu.CHILD_MENU_ELEMENT_40');
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                


                    /**============ METHODS ================*/

                /**------- Show Tabs -------*/

                function showFrameTabs() {
                    // console.log("ProductStor.product",ProductStor.product);
                    //playSound('swip');
                    AuxStor.aux.isTabFrame = !AuxStor.aux.isTabFrame;
                }


                /**========== FINISH ==========*/

                //------ clicking
                thisCtrl.selectAddElementList = AddElementsServ.selectAddElementList;
                thisCtrl.closeAddElementsMenu = AddElementMenuServ.closeAddElementsMenu;
                thisCtrl.selectAddElement = AddElementsServ.selectAddElem;
                thisCtrl.chooseAddElement = AddElementMenuServ.chooseAddElement;
                thisCtrl.chooseAddElementList = AddElementMenuServ.chooseAddElementList;
                thisCtrl.deleteAddElement = AddElementMenuServ.deleteAddElement;
                thisCtrl.showFrameTabs = showFrameTabs;
                thisCtrl.initAddElementTools = AddElementsServ.initAddElementTools;
                thisCtrl.showInfoBox = MainServ.showInfoBox;
                //------- culculator
                thisCtrl.closeQtyCaclulator = AddElementMenuServ.closeQtyCaclulator;
                thisCtrl.setValueQty = AddElementMenuServ.setValueQty;
                thisCtrl.pressCulculator = AddElementMenuServ.pressCulculator;
                thisCtrl.hideMenu = AddElementsServ.hideMenu;


            });
})();
