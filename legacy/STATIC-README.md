# Camak Services redesign

A complete nine-page redesign, a private static review site, and an installable WordPress theme for the existing Camak website.

## Local preview

Requires Node.js 22 or later. No dependency installation or bundler is required.

```sh
npm run build
npm run preview
```

Open http://127.0.0.1:4173. Stop the preview with Ctrl+C.

On this workstation Node is installed outside PATH. PowerShell equivalent:

```powershell
& 'C:/Users/HP/AppData/Local/Programs/node-v24.19.0-win-x64/node.exe' scripts/serve.mjs
```

## Included

- Home, About, Services, Contact, FAQs, Sustainability, Blog, Privacy and Terms routes; custom 404.
- All four original service categories and their listed offerings.
- Responsive navigation, keyboard controls, skip link, reduced-motion support and labelled forms.
- Fifteen searchable FAQs, with category filters.
- Service-specific enquiry links; name, email, phone, location, subject, service, frequency and message fields.
- Both published telephone numbers, email, WhatsApp and a map link.
- Browser-local privacy preferences. No new analytics or advertising scripts.
- Original Camak logo and images, with locally served typography.
- WordPress blog posts, pagination, single posts, existing content fallback and native comments support.

## Preview versus the WordPress website

The private static preview prepares a `mailto:` enquiry and clearly tells visitors to send it from their email app. It does not claim that an email was delivered, collect form submissions on a server or reserve bookings.

The WordPress theme sends enquiries with `wp_mail()` to **info@camakservices.co.nz**. It provides a nonce, field validation, a honeypot, a short-lived hashed-IP rate limit, an AJAX success/failure response and a no-JavaScript POST fallback. An accepted mail-service result is not a guarantee of inbox delivery. The hosting mail transport must be configured and tested on staging before launch. Existing MetForm entries remain in the WordPress database; the redesigned form does not create new MetForm entries.

## Install on the existing WordPress site

1. Back up the site and database, then install on a staging copy first.
2. Upload `camak-fresh-theme.zip` under Appearance → Themes → Add New → Upload Theme. Activate **Camak Fresh** on staging.
3. Save Settings → Permalinks if any route needs refreshing. The theme registers the existing page paths, including a replacement for the missing privacy route. It does not delete or overwrite WordPress pages, media, posts or plugin records.
4. Configure or verify the existing WordPress email/SMTP transport. Check a real enquiry reaches the Camak inbox and replies use the visitor's email. No live email was sent during development.
5. Review the original CookieAdmin and WhatsApp plugin front-end widgets to prevent duplicate banners/buttons alongside the theme equivalents. If retaining third-party analytics or advertising, connect consent enforcement to those scripts; the new preference UI does not control arbitrary existing plugins.
6. Supply approved business privacy and service terms. The original privacy link returned 404 and the terms page had no terms text. The provided pages state what is known and do not invent business policies.
7. Confirm the contact details, service wording and images. Test active plugins, SEO/canonical metadata and caching; exclude the contact page from long-lived full-page caching so its form nonce stays fresh.
8. After staging approval, activate the theme on production. No change to the live domain, DNS or existing WordPress installation has been made by this build.

The marketing page layouts are generated theme partials, not Elementor layouts. Existing Elementor content remains in the database and switching back to the prior theme restores its rendering. Editing these redesign layouts currently happens in `scripts/build.mjs`, then regenerating the theme. Blog content continues to be managed through WordPress Posts.

## Source and rebuilding

- `scripts/build.mjs`: page content, shared header/footer and static output.
- `dist/assets/styles.css`: responsive design.
- `dist/assets/app.js`: navigation, FAQ, privacy and form interactions.
- `scripts/build-theme.mjs`: regenerates static pages and copies the layout/assets into the WordPress theme.
- `wordpress/camak-fresh/`: WordPress templates, routing and form handler.
- `scripts/check.mjs`: static links, images, anchors, headings and IDs.
- `scripts/browser-check.mjs`: local Edge headless checks and screenshots. Uses the installed Windows Edge path. Form transport checks are simulated and send no messages.

```sh
node scripts/build-theme.mjs
node scripts/check.mjs
node scripts/browser-check.mjs
```

Package `wordpress/camak-fresh` as a zip whose top-level folder is `camak-fresh`.

## Verification and limits

Desktop/mobile browser checks cover the nine pages, image loading, overflow, mobile menu/Escape, FAQ search/filters/expansion, service preselection, form validation, simulated form success/failure and saved privacy preferences. Static checks cover ten HTML documents and all internal links/assets/anchors.

The local environment does not include WordPress or PHP. WordPress integration, server form delivery, plugin interactions and production SEO require staging verification. The static preview is deliberately marked noindex; the WordPress theme follows WordPress and installed SEO plugin settings.

## Content audit

Source: https://camakservices.co.nz/ and its eight linked page routes, reviewed 15 October 2026.

The original contact page included unrelated Ghanaian contact details. Those were excluded, and the consistent Camak contacts were retained. Empty blog and sustainability pages were handled without inventing posts or certifications. The redesign does not reproduce the original zero-value job counters, ambiguous rating, placeholder social links or unavailable policies. The home page quote is retained from the original site without inventing a named reviewer.

Original images and branding are copied from Camak's public site for this redesign. Fonts are DM Sans and Manrope from Google Fonts; see the included font licence files. The design adds no new tracking integrations.
