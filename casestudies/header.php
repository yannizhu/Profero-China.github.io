<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="main">
 *
 * @package WordPress
 * @subpackage Twenty_Thirteen
 * @since Twenty Thirteen 1.0
 */
?><!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) | !(IE 8)  ]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width">
	<title><?php wp_title( '|', true, 'right' ); ?></title>
	<link rel="profile" href="http://gmpg.org/xfn/11">
	<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
	<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/icon.png">
	<link rel="apple-touch-icon-precomposed" href="<?php echo get_template_directory_uri(); ?>/icon.png">
	<!--[if lt IE 9]>
	<script src="<?php echo get_template_directory_uri(); ?>/js/html5.js"></script>
	<![endif]-->
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<div id="page" class="hfeed site">
		<div class="topbar">
			<a href="#" class="backtotop" title="Back to the top"><i class="icon-arrow-up"></i></a>
					
			<a href="<?php echo get_home_url(); ?>">
				<img class="logo" src="<?php echo esc_url( get_template_directory_uri( '/' ) ); ?>/images/profero-logo.png" alt="Proferotech Logo">
			</a>
			
			<a href="#" class="contactbutton" data-reveal-id="letsgetstarted" title="Start a project"><i class="icon-envelope" data-animation="fade"></i></a>
		</div>
		<header id="masthead" class="site-header" role="banner">
			<div class="header-area">
				<h1><?php bloginfo( 'name' ); ?></h1>
				<h2><?php bloginfo( 'description' ); ?></h2>
			</div>
		</header><!-- #masthead -->

		<div id="main" class="site-main">
