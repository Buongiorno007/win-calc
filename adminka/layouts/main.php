<?php /* @var $this Controller */ ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />

	<!-- blueprint CSS framework -->
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/screen.css" media="screen, projection" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/print.css" media="print" />
	<!--[if lt IE 8]>
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/ie.css" media="screen, projection" />
	<![endif]-->

	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/main.css" />
	<link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/form.css" />

	<link rel="stylesheet" href="/soft/ajax/ajax.css" type="text/css" />
	<script type="text/javascript" src="/soft/ajax/ajax.js"></script>

	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>

<body>

<?php
		if(!Yii::app()->user->isGuest) {
?>
<div class="container" id="page">
	<div id="header-page">
		<div id="top_panel">
			<a href="<?php echo Yii::app()->homeUrl; ?>">
				<span class="window-logo"></span>
				BauVoice admin panel
			</a>
			<a id="logout_btn" href="<?php echo Yii::app()->createAbsoluteUrl('site/logout'); ?>"><img alt="" src="<?php echo Yii::app()->request->getBaseUrl(true); ?>/images/logout_btn.png" /> Выйти</a>
			<div id="search-container">
				<form>
					<div id="search-box">
						<input type="text" id="input-search" placeholder="Поиск..." />
					</div>
					<div class="icon-search">
					</div>
				</form>
			</div>
		</div>
	</div>
<?php } echo $content; ?>
	<div class="clear"></div>
		<?php if(!Yii::app()->user->isGuest) {?>
		<div id="footer-page">
			<div id="footer">
					&copy; 2014
			</div>
		</div>
</div><!-- page -->
<?php } ?>
</body>
<script>
  // Footer fixing
  jQuery(document).ready(function() {
  	var windowHeight = jQuery(window).height(),
  			bodyHeight = jQuery('body').height(),
  			fixedClass = 'footer-fix',
  			$footer = jQuery('#footer-page');

  	if(windowHeight > bodyHeight) {
  		$footer.addClass(fixedClass);
  	} else {
  		if($footer.hasClass(fixedClass)) {
  			$footer.removeClass(fixedClass);
  		}
  	}
  	jQuery(window).resize(function () {
  		if(windowHeight > bodyHeight) {
  			$footer.addClass(fixedClass);
  		} else {
  			if($footer.hasClass(fixedClass)) {
  				$footer.removeClass(fixedClass);
  			}
  		}
    });
  });
</script>
</html>
