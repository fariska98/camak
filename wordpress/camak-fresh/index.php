<?php
if (!defined('ABSPATH')) { exit; }
$slug = camak_page_slug();
if ($slug && isset(camak_titles()[$slug])) { status_header(200); }
get_header();
if ($slug === 'blog') {
    ?>
    <section class="page-hero"><div class="container"><div class="eyebrow">Our journal</div><h1>Fresh ideas.<br><span class="accent">For a well-kept space.</span></h1><p>Cleaning tips and updates from your local Camak team.</p></div></section>
    <section class="section"><div class="container">
    <?php
    $posts_query = new WP_Query(array('post_type'=>'post', 'post_status'=>'publish', 'paged'=>max(1, (int)get_query_var('paged')), 'posts_per_page'=>9));
    if ($posts_query->have_posts()) {
        echo '<div class="blog-grid">';
        while ($posts_query->have_posts()) { $posts_query->the_post(); ?>
            <article class="blog-card"><time datetime="<?php echo esc_attr(get_the_date('c')); ?>"><?php echo esc_html(get_the_date()); ?></time><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2><?php the_post_thumbnail('medium_large'); ?><p><?php echo esc_html(wp_trim_words(get_the_excerpt(), 26)); ?></p><a class="text-link" href="<?php the_permalink(); ?>">Read article →</a></article>
        <?php }
        echo '</div><nav class="pagination" aria-label="Journal pagination">';
        echo wp_kses_post(paginate_links(array('base'=>trailingslashit(home_url('/blog/')).'%_%', 'format'=>'page/%#%/', 'current'=>max(1, (int)get_query_var('paged')), 'total'=>$posts_query->max_num_pages)));
        echo '</nav>';
    } else { ?>
        <div class="empty-blog"><h2>Something fresh is on its way.</h2><p>There are no articles published yet. In the meantime, explore our services or find answers to common cleaning questions.</p><a class="btn" href="<?php echo esc_url(home_url('/faq/')); ?>">Explore our FAQs →</a></div>
    <?php }
    wp_reset_postdata(); ?>
    </div></section>
    <?php
} elseif ($slug && isset(camak_titles()[$slug])) {
    camak_partial($slug);
} elseif (have_posts()) {
    while (have_posts()) { the_post(); ?>
        <section class="page-hero"><div class="container"><div class="breadcrumbs"><a href="<?php echo esc_url(home_url('/')); ?>">Home</a><span>/</span><span><?php the_title(); ?></span></div><h1><?php the_title(); ?></h1></div></section>
        <section class="section"><article class="container article-body wp-content"><?php the_post_thumbnail('large'); the_content(); wp_link_pages(); if (comments_open() || get_comments_number()) { comments_template(); } ?></article></section>
    <?php }
} else { ?>
    <section class="page-hero"><div class="container"><div class="eyebrow">Page not found</div><h1>Let’s get you<br><span class="accent">back on track.</span></h1><p>We couldn’t find this page.</p></div></section><section class="section"><div class="container"><a class="btn" href="<?php echo esc_url(home_url('/')); ?>">Back to home →</a></div></section>
<?php }
get_footer();
