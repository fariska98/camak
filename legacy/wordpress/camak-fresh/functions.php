<?php
if (!defined('ABSPATH')) { exit; }

function camak_routes() {
    foreach (array('about-us', 'services', 'faq', 'contact-us', 'sustainability', 'blog', 'privacy-policy', 'terms-of-service') as $slug) {
        add_rewrite_rule('^' . $slug . '/?$', 'index.php?camak_page=' . $slug, 'top');
    }
    add_rewrite_rule('^blog/page/([0-9]+)/?$', 'index.php?camak_page=blog&paged=$matches[1]', 'top');
}
add_action('init', 'camak_routes');
add_filter('query_vars', function ($vars) { $vars[] = 'camak_page'; return $vars; });
add_action('after_switch_theme', function () { camak_routes(); flush_rewrite_rules(); });
add_action('switch_theme', function () { delete_option('rewrite_rules'); });
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('automatic-feed-links');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script'));
});

function camak_page_slug() {
    $virtual = get_query_var('camak_page');
    if ($virtual) { return sanitize_key($virtual); }
    if (is_front_page()) { return 'home'; }
    if (is_home()) { return 'blog'; }
    if (is_page()) { return get_post_field('post_name', get_queried_object_id()); }
    return '';
}
function camak_titles() {
    return array('home'=>'Home', 'about-us'=>'About Camak', 'services'=>'Our services', 'faq'=>'Frequently asked questions', 'contact-us'=>'Contact us', 'sustainability'=>'Sustainability', 'blog'=>'Our journal', 'privacy-policy'=>'Privacy information', 'terms-of-service'=>'Service information');
}
add_filter('document_title_parts', function ($parts) {
    $titles = camak_titles(); $slug = camak_page_slug();
    if (isset($titles[$slug])) { $parts['title'] = $titles[$slug]; }
    return $parts;
});
add_action('wp_enqueue_scripts', function () {
    $uri = get_template_directory_uri();
    wp_enqueue_style('camak-fresh', $uri . '/assets/styles.css', array(), '1.0.0');
    wp_enqueue_script('camak-fresh', $uri . '/assets/app.js', array(), '1.0.0', true);
    if (camak_page_slug() === 'contact-us') {
        wp_localize_script('camak-fresh', 'camakForm', array('url'=>admin_url('admin-ajax.php'), 'nonce'=>wp_create_nonce('camak_quote')));
    }
    if (is_singular() && comments_open() && get_option('thread_comments')) { wp_enqueue_script('comment-reply'); }
});
add_action('wp_head', function () {
    echo '<meta name="theme-color" content="#143e32">';
    echo '<link rel="icon" type="image/svg+xml" href="' . esc_url(get_template_directory_uri() . '/assets/favicon.svg') . '">';
});

function camak_partial($name) {
    $file = get_template_directory() . '/partials/' . sanitize_file_name($name) . '.html';
    if (!is_readable($file)) { return; }
    $html = file_get_contents($file);
    $html = str_replace('src="/assets/', 'src="' . esc_url(get_template_directory_uri()) . '/assets/', $html);
    $html = preg_replace_callback('~href="(/[^"\s]*)"~', function ($match) {
        return 'href="' . esc_url(home_url($match[1])) . '"';
    }, $html);
    if ($name === 'header') {
        $slug = camak_page_slug();
        $href = esc_url(home_url($slug === 'home' ? '/' : '/' . $slug . '/'));
        $html = str_replace('<a href="' . $href . '" >', '<a href="' . $href . '" aria-current="page">', $html);
    }
    if ($name === 'contact-us') {
        $hidden = '<input type="hidden" name="action" value="camak_quote"><input type="hidden" name="nonce" value="' . esc_attr(wp_create_nonce('camak_quote')) . '">';
        $html = str_replace('<form id="quote-form">', '<form id="quote-form" method="post" action="' . esc_url(admin_url('admin-post.php')) . '">' . $hidden, $html);
        $html = str_replace('Prepare my quote email', 'Request my free quote', $html);
        $html = str_replace('This preview prepares an email in your email app. Review it and press Send to contact Camak.', 'Your enquiry is sent to Camak to discuss your cleaning needs. It does not confirm a booking.', $html);
        $state = isset($_GET['enquiry']) && is_string($_GET['enquiry']) ? sanitize_key(wp_unslash($_GET['enquiry'])) : '';
        if ($state) {
            $messages = array('sent'=>'Your enquiry has been accepted by the website’s mail service. Camak will be in touch to discuss your cleaning needs.', 'error'=>'We could not send your enquiry. Please call or email Camak directly.');
            if (isset($messages[$state])) { echo '<div class="container"><p class="form-status" role="status">' . esc_html($messages[$state]) . '</p></div>'; }
        }
    }
    // Partials are theme-authored HTML, never visitor input.
    echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}

function camak_quote_response($success, $message, $code = 200) {
    if (wp_doing_ajax()) {
        if ($success) { wp_send_json_success(array('message'=>$message), $code); }
        wp_send_json_error(array('message'=>$message), $code);
    }
    wp_safe_redirect(add_query_arg('enquiry', $success ? 'sent' : 'error', home_url('/contact-us/')));
    exit;
}
function camak_quote_field($name, $limit, $multiline = false) {
    if (!isset($_POST[$name]) || !is_string($_POST[$name])) { return ''; }
    $raw = wp_unslash($_POST[$name]);
    if (strlen($raw) > $limit * 4) { camak_quote_response(false, 'One of the fields is too long. Please shorten your enquiry.', 400); }
    return $multiline ? sanitize_textarea_field($raw) : sanitize_text_field($raw);
}
function camak_handle_quote() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { camak_quote_response(false, 'Please use the enquiry form.', 405); }
    $nonce = camak_quote_field('nonce', 100);
    if (!wp_verify_nonce($nonce, 'camak_quote')) { camak_quote_response(false, 'Please refresh this page and try again.', 403); }
    if (camak_quote_field('website', 200) !== '') { camak_quote_response(false, 'We could not accept this enquiry. Please contact Camak directly.', 400); }
    $first = camak_quote_field('firstName', 80); $last = camak_quote_field('lastName', 80);
    $email = sanitize_email(camak_quote_field('email', 180));
    $phone = camak_quote_field('phone', 40); $location = camak_quote_field('location', 150);
    $subject = camak_quote_field('subject', 150); $message = camak_quote_field('message', 4000, true);
    $service = camak_quote_field('service', 40); $frequency = camak_quote_field('frequency', 80);
    $services = array('residential'=>'Residential cleaning', 'commercial'=>'Commercial cleaning', 'eco-friendly'=>'Eco-friendly cleaning', 'specialised'=>'Specialised cleaning', 'not-sure'=>'Help me choose');
    $frequencies = array('One-off clean', 'Weekly', 'Fortnightly', 'Monthly', 'Let’s discuss');
    if (!$first || !$last || !$location || !$subject || !$message || !is_email($email) || !isset($services[$service]) || !in_array($frequency, $frequencies, true)) {
        camak_quote_response(false, 'Please complete all required fields with valid details.', 400);
    }
    // Hash the direct connection address. Do not trust spoofable forwarding headers.
    $address = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'unknown';
    $key = 'camak_quote_' . hash_hmac('sha256', $address, wp_salt('nonce'));
    $attempts = (int) get_transient($key);
    if ($attempts >= 5) { camak_quote_response(false, 'Too many enquiries in a short time. Please wait 15 minutes or call Camak.', 429); }
    set_transient($key, $attempts + 1, 15 * MINUTE_IN_SECONDS);
    $body = "New website cleaning enquiry\n\nName: $first $last\nEmail: $email\nPhone: $phone\nLocation: $location\nService: " . $services[$service] . "\nFrequency: $frequency\n\n$message";
    // Fixed verified business recipient; visitors cannot choose mail recipients.
    $sent = wp_mail('info@camakservices.co.nz', 'Camak enquiry: ' . $subject, $body, array('Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . $email));
    if (!$sent) { camak_quote_response(false, 'We could not send your enquiry. Please email info@camakservices.co.nz or call +64 27 296 0929.', 502); }
    camak_quote_response(true, 'Your enquiry has been accepted by the website’s mail service. Camak will be in touch to discuss your cleaning needs.');
}
add_action('wp_ajax_camak_quote', 'camak_handle_quote');
add_action('wp_ajax_nopriv_camak_quote', 'camak_handle_quote');
add_action('admin_post_camak_quote', 'camak_handle_quote');
add_action('admin_post_nopriv_camak_quote', 'camak_handle_quote');
