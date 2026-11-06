window.AUDIT_GLOBAL = {
 sitewide: [
  'Same header on every page: floating rounded navy bar, no booking button in the navigation, “FAQ’s” with a wrong apostrophe.',
  'Four text fonts across the site (Marcellus, Lato → Trebuchet MS fallback, system-ui, -apple-system) plus 2 downloaded-but-unused fonts and 6 icon fonts.',
  'Marcellus is used for headings, body copy, buttons and navigation at 18+ sizes, and is faux-bolded wherever weight 500–900 is requested.',
  'Buttons use at least six different treatments for the same job across the site.',
  'Four golds (#FEC77E, #FFD080, #E9B975, #FDC67E), a link-blue used for non-link text, and seven different text blacks/greys.',
  'Floating WhatsApp button (permanent pulse) and the “English” language pill crowd the bottom-right corner on every page.',
  'Footer: only 5 of 13 specialties listed, inconsistent address formatting, 20px bottom-bar links next to 14px copyright text on a detached white strip.',
  'Leftover Webflow/template assets and copy (“highly subsidised”, tele-health, counselling-style pillars; 60 CSS references to files that 404).'
 ],
 fontsNote: [
  'Marcellus numerals look like letters: “1” reads as “I” and “0” as “O”, so “100%” looks like “IOO%” and phone numbers like “O37O”.',
  'Lato is declared by the theme but fails to load anywhere on the site, so it silently falls back to Trebuchet MS.',
  'Poppins and Roboto are downloaded on every page but not used for visible text; Roboto Slab, TT Commons and Frank Ruhl Libre are declared but unused.',
  'Six icon fonts load on every page: Font Awesome 4 shim, Font Awesome 5, Font Awesome 6 (CDN), eicons, webflow-icons, swiper-icons.',
  'system-ui / -apple-system text (some buttons, the reviews widget, language switcher) looks different on every operating system.'
 ],
 colours: [
  ['#0B233F','Navy — brand'],['#FEC77E','Gold — buttons, icons'],['#FFD080','Second gold — “Consult Us”'],['#E9B975','Third gold — Pillars heading'],['#FDC67E','Fourth gold — card borders'],
  ['#25609D','Blue — service text, buttons, footer links'],['#000000','Black — service titles'],['#111111','Near-black — Wellness heading'],['#1A1B1F','Body text A'],['#1D1D1F','Body text B'],['#212529','Bootstrap default — Pillars'],['#7A7A7A','Grey — tele-health paragraph'],['#EEEEEE','Grey panel — reels'],['#F4F4F4','Grey — review cards'],['#25D366','WhatsApp green']
 ],
 spacing: 'Section gaps are set with margins of 0, 50, 60 and 100px (plus 50px padding on navy sections) with no consistent rule, so some sections touch while others have 200px between them. Container widths vary between 1035, 1290–1354 and full-bleed 1440px.',
 template: [
  '“Our highly subsidised therapy services are also guaranteed… If we can’t, you pay nothing.”',
  '“We can deliver services anywhere across the country via tele-health (online).”',
  '“We understand your concerns are sensitive and personal. We aim to resolve your concerns expediently…” (counselling template).',
  'Theme files from another business remain: acs-white-logo.svg, pillar-client-experience-image.png, portfolio-1---wide.svg, mission-image.png, green-glow.png.'
 ],
 performance: [
  'Homepage hero video is 56.9 MB (1080p, 60 fps, with an audio track) and sits inside a 3-slide carousel.',
  '~40 stylesheets per page, including WordPress block-editor, components, preferences and patterns CSS meant only for the admin editor.',
  'Three copies of Swiper (Elementor v8, CDN swiper@9, theme swiper-bundle) plus Fancybox.',
  'Six icon fonts (see Fonts).',
  '60 CSS references to template images that return 404.',
  'Many photos saved as PNG instead of WebP/JPEG.',
  'Theme stack mixes Hello Elementor, webflow.css, vasayurvediclinic.webflow.css, widget-styles.css and Elementor — three styling systems on one site.'
 ]
};

window.AUDIT_PAGES=[{"slug":"home","name":"Home","path":"/","group":"Main pages","c":[9,24,9]},{"slug":"about-vas-ayurvedic-clinic","name":"About Us","path":"/about-vas-ayurvedic-clinic/","group":"Main pages","c":[1,4,5]},{"slug":"ayurveda-treatments--shirodhara","name":"Shirodhara Ayurvedic Treatment in Dubai","path":"/ayurveda-treatments/shirodhara/","group":"Treatments","c":[2,11,7]},{"slug":"detox-treatment--ayurvedic-detox-treatment-in-dubai","name":"Ayurvedic Detox Treatment in Dubai","path":"/detox-treatment/ayurvedic-detox-treatment-in-dubai/","group":"Blog","c":[1,4,4]}];
window.AUDIT_HOSTED=1;
