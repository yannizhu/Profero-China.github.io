<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme and one of the
 * two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * For example, it puts together the home page when no home.php file exists.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage Twenty_Thirteen
 * @since Twenty Thirteen 1.0
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<div id="content" class="site-content" role="main">
		<?php if ( have_posts() ) : ?>

			<?php /* The loop */ ?>
			<?php while ( have_posts() ) : the_post(); ?>
				<?php get_template_part( 'content', get_post_format() ); ?>
			<?php endwhile; ?>

			<?php twentythirteen_paging_nav(); ?>

		<?php else : ?>
			<?php get_template_part( 'content', 'none' ); ?>
		<?php endif; ?>

		</div><!-- #content -->
		<?php get_sidebar( 'main' ); ?>
	</div><!-- #primary -->

<?php get_footer(); ?>

<div id="letsgetstarted" class="reveal-modal">
	<h1>Let's get started!</h1>
	<h2>send us an email and let's talk about what we can do for your brand</h2>
	<div class="button-group">
		<a href="mailto:tech@profero.com" class="button emailus"><i class="icon-envelope"></i> tech@profero.com</a>
		<a href="#" class="button close close-reveal-modal">close &#215;</a>
	</div>
</div>