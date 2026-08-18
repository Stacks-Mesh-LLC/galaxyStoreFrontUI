const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const htmlFiles = [
  'index.html',
  'about.html',
  'alert-kits.html',
  'blog-alberta.html',
  'blog-apple-watch.html',
  'blog-winter-falls.html',
  'blog.html',
  'contact.html',
  'do-i-need-one.html',
  'essential-kit.html',
  'essential-plus-kit.html',
  'home-cellular-system.html',
  'in-the-home.html',
  'mobile-slimline-watch-system.html',
  'mobile-system-gps-fall-wifi.html',
  'mobile-system-gps-fall.html',
  'mobile-watch-system.html',
  'monitoring.html',
  'on-the-go.html',
  'premier-kit.html',
  'privacy.html',
  'shipping.html',
  'support-chatbot.html',
  'terms.html'
];

let errors = 0;
let checkedFiles = 0;
let checkedLinks = 0;
let checkedAssets = 0;

console.log('--- Starting Galaxy Storefront Verification ---');

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`[MISSING HTML FILE] ${file}`);
    errors++;
    return;
  }
  checkedFiles++;

  const content = fs.readFileSync(filePath, 'utf8');

  // Check all internal hrefs
  const hrefMatches = [...content.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  hrefMatches.forEach(href => {
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
      return; // External or anchor link
    }
    checkedLinks++;

    const cleanHref = href.split('?')[0].split('#')[0];
    const resolvedPath = path.resolve(rootDir, cleanHref);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`[BROKEN LINK] in ${file}: href="${href}" -> ${resolvedPath} does not exist`);
      errors++;
    }
  });

  // Check all srcs
  const srcMatches = [...content.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
  srcMatches.forEach(src => {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.includes('{{')) {
      return;
    }
    checkedAssets++;

    const cleanSrc = src.split('?')[0].split('#')[0];
    const resolvedPath = path.resolve(rootDir, cleanSrc);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`[BROKEN ASSET] in ${file}: src="${src}" -> ${resolvedPath} does not exist`);
      errors++;
    }
  });

  // Check dc-import tags
  const dcImports = [...content.matchAll(/<dc-import\s+name="([^"]+)"/g)].map(m => m[1]);
  dcImports.forEach(compName => {
    const candidateFiles = [
      path.join(rootDir, compName + '.html'),
      path.join(rootDir, compName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html'),
      path.join(rootDir, compName + '.dc.html'),
      path.join(rootDir, compName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.dc.html')
    ];

    const exists = candidateFiles.some(c => fs.existsSync(c));
    if (!exists) {
      console.error(`[BROKEN COMPONENT IMPORT] in ${file}: <dc-import name="${compName}"> cannot be resolved!`);
      errors++;
    }
  });

  // Check asset string literals inside scripts and css (e.g. imgs array or background urls)
  const assetRegex = /['"](\.\/assets\/(images|docs|video|js)\/[^'"]+)['"]/g;
  let match;
  while ((match = assetRegex.exec(content)) !== null) {
    checkedAssets++;
    const cleanAsset = match[1].split('?')[0].split('#')[0];
    const resolvedPath = path.resolve(rootDir, cleanAsset);
    if (!fs.existsSync(resolvedPath)) {
      console.error(`[BROKEN SCRIPT/CSS ASSET] in ${file}: "${match[1]}" -> ${resolvedPath} does not exist`);
      errors++;
    }
  }
});

console.log(`\nVerification Summary:`);
console.log(`- HTML Files Checked: ${checkedFiles}`);
console.log(`- Internal Links Checked: ${checkedLinks}`);
console.log(`- Static Assets Checked: ${checkedAssets}`);
console.log(`- Total Errors: ${errors}`);

if (errors > 0) {
  console.error('\nVerification failed with ' + errors + ' errors.');
  process.exit(1);
} else {
  console.log('\nAll files, routes, assets, and component imports verified successfully!');
  process.exit(0);
}
