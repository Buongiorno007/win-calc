<script>
    function act(){
        var idList = $("input[type=checkbox]:checked").serialize();
        var act = $("#actionName").serialize();
        if(idList){
            if(act === 'actionName=del'){
                $.post("/elements/delete", idList, function(response){
                    $.fn.yiiGridView.update("grid_el");
                });
            }
            if(act === 'actionName=copy'){
                $.post("/elements/copy", idList, function(response){
                    $.fn.yiiGridView.update("grid_el");
                });
            }
        }
    }
</script>
<?php
$this->pageTitle = Yii::app()->name . ' - Элементы';
$this->widget('zii.widgets.CBreadcrumbs', array(
    'links' => array(
        'База элементов' => array('site/base'),
        'Элементы',
    ),
    'separator' => ' &raquo; ',
    'htmlOptions' => array('class' => 'breadcrumbs'))
);
echo "<div class='header-tools'><div class='filter-block'><div class='input-filter'><form action='' method='post'>";
if (isset($_SESSION['filtr_element_group'])){
   $model->element_group_id = $_SESSION['filtr_element_group'];
}
if (empty($_SESSION['filtr'])){
    $_SESSION['filtr'] = "";
}
echo CHtml::activeDropDownList($model, 'element_group_id', CHtml::listData(ElementsGroups::model()->findAll('base_unit > 0 order by id'), 'id', 'name'), array('name' => 'filtr_element_group', 'submit' => Yii::app()->urlManager->createUrl('elements')));
echo "</form></div><div class='arrow-bg'></div></div>   <div class='add-element-block'><button id='add_element_btn'>Добавить изделие</button></div><div class='clear'></div></div>".chr(10);

echo "<form action='' method='post'>";
echo " Фильтр: <input id='filtr_list' name='search' value='".$_SESSION["filtr"]."'/> <input type='submit' value='Применить' />";
echo "</form>".chr(10);
$this->widget('zii.widgets.grid.CGridView', array(
    'id'=>'grid_el',
    'dataProvider'=>$model->search(),
    'columns'=>array(
        array(
            'class'=>'CCheckBoxColumn',
            'selectableRows' => 2,
            'value' => '$data["id"]',
            'checkBoxHtmlOptions' => array('name' => 'idList[]')
        ),
        array(
            'name' => 'sku',
            'type' => 'raw',
            'value' => 'CHtml::link(CHtml::encode($data->sku), array("elements/edit", "el" => $data->id))',
        ),
        array(
            'name' => 'name',
            'type' => 'raw',
            'value' => 'CHtml::link(CHtml::encode($data->name), array("elements/view", "id" => $data->id))',
        ),
        array(
            'name' => 'Наборы',
            'value' => 'Yii::app()->db->createCommand("select count(id) from bauvoice.public.lists where parent_element_id = $data->id")->queryScalar()?Yii::app()->db->createCommand("select count(id) from bauvoice.public.lists where parent_element_id = $data->id")->queryScalar():"создать"',
        ),
        array(
            'name' => 'supplier_id',
            'value' => '$data->supplier->name',
        ),
        'price',
        array(
            'name' => 'currency_id',
            'value' => '$data->currency->name',
        ),
    ),
));
echo "<div class='filter-block action-filter'><div class='input-filter'>";
echo CHtml::dropDownList('actionName', 'empty', array('del' => 'Удалить', 'copy' => 'Копировать'), array('empty' => 'Действие'));
echo "</div><div class='arrow-bg'></div></div>";
echo '<input type="button" id="tool-action-btn" class="green-small-btn" value="Ок" onclick="act();" />';
?>