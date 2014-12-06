<?php
if(Yii::app()->user->isGuest){$this->redirect(Yii::app()->urlManager->createUrl('site/login'));}
$this->pageTitle=Yii::app()->name . ' - Admin Panel'; ?>
<div id="left_panel">
    <div id="avatar">
        <img width="150" alt="" src="<?php echo Yii::app()->request->getBaseUrl(true); ?>/images/avatars/<?php echo $user->avatar; ?>" />
    </div><br/>
    <?php echo $user->name; ?><br/>
    <a href="#">Мой профиль</a><hr/>
    <?php foreach($menus as $menu) {?>
        <a href="<?php echo $menu->url; ?>"><?php echo $menu->name; ?></a><br/>
    <?php } ?>
</div>
<div id="main_content">
<div class="clear"></div>
</div>
