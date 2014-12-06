<?php
if(Yii::app()->user->isGuest){$this->redirect(Yii::app()->urlManager->createUrl('site/login'));}
$this->pageTitle=Yii::app()->name . ' - Admin Panel'; ?>
<div id="left_panel">
    <div id="avatar" style="width:160px; height:120px; padding:5px; background: url(<?php echo Yii::app()->request->getBaseUrl(true); ?>/images/avatars/<?php echo $user->avatar; ?>);background-size: cover;">
    </div><br/>
    <?php echo $user->name; ?><br/>
    <a href="#">Мой профиль</a><hr/>
    <?php foreach($menus as $menu) {?>
        <a href="<?php echo $menu->url; ?>"><?php echo $menu->name; ?></a><br/>
    <?php } ?>
</div>
<div id="main_content">
</div>
<div class="clear"></div>
