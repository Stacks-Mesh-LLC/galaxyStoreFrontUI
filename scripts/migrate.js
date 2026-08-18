const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Define file mappings
const pageMap = {
  'Galaxy Hero.dc.html': 'index.html',
  'About.dc.html': 'about.html',
  'Alert Kits.dc.html': 'alert-kits.html',
  'Blog - Alberta.dc.html': 'blog-alberta.html',
  'Blog - Apple Watch.dc.html': 'blog-apple-watch.html',
  'Blog - Winter Falls.dc.html': 'blog-winter-falls.html',
  'Blog.dc.html': 'blog.html',
  'Contact.dc.html': 'contact.html',
  'Do I Need One.dc.html': 'do-i-need-one.html',
  'Essential Kit.dc.html': 'essential-kit.html',
  'Essential Plus Kit.dc.html': 'essential-plus-kit.html',
  'Home Cellular System.dc.html': 'home-cellular-system.html',
  'In the Home.dc.html': 'in-the-home.html',
  'Mobile Slimline Watch System.dc.html': 'mobile-slimline-watch-system.html',
  'Mobile System GPS Fall WiFi.dc.html': 'mobile-system-gps-fall-wifi.html',
  'Mobile System GPS Fall.dc.html': 'mobile-system-gps-fall.html',
  'Mobile Watch System.dc.html': 'mobile-watch-system.html',
  'Monitoring.dc.html': 'monitoring.html',
  'On-the-Go.dc.html': 'on-the-go.html',
  'Premier Kit.dc.html': 'premier-kit.html',
  'Privacy.dc.html': 'privacy.html',
  'Shipping.dc.html': 'shipping.html',
  'Support Chatbot.dc.html': 'support-chatbot.html',
  'Terms.dc.html': 'terms.html'
};

// 2. Ensure destination directories exist
const dirs = ['assets/images', 'assets/docs', 'assets/video', 'assets/js'];
dirs.forEach(d => {
  const full = path.join(rootDir, d);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

// 3. Move/Copy asset files
const rootFiles = fs.readdirSync(rootDir);

const assetMap = {};

rootFiles.forEach(file => {
  const fullPath = path.join(rootDir, file);
  if (fs.statSync(fullPath).isDirectory()) return;

  const ext = path.extname(file).toLowerCase();

  if (['.png', '.webp', '.jpg', '.jpeg', '.gif', '.svg'].includes(ext)) {
    const dest = path.join(rootDir, 'assets/images', file);
    fs.copyFileSync(fullPath, dest);
    assetMap['./' + file] = './assets/images/' + file;
    assetMap[file] = './assets/images/' + file;
  } else if (ext === '.pdf') {
    const dest = path.join(rootDir, 'assets/docs', file);
    fs.copyFileSync(fullPath, dest);
    assetMap['./' + file] = './assets/docs/' + file;
    assetMap[file] = './assets/docs/' + file;
  } else if (['.mp4', '.webm'].includes(ext)) {
    const dest = path.join(rootDir, 'assets/video', file);
    fs.copyFileSync(fullPath, dest);
    assetMap['./' + file] = './assets/video/' + file;
    assetMap[file] = './assets/video/' + file;
  } else if (['support.js', 'image-slot.js'].includes(file)) {
    const dest = path.join(rootDir, 'assets/js', file);
    fs.copyFileSync(fullPath, dest);
    assetMap['./' + file] = './assets/js/' + file;
    assetMap[file] = './assets/js/' + file;
  }
});

console.log('Copied assets to assets/ subdirectories.');

// 4. Transform and write new clean HTML files
Object.entries(pageMap).forEach(([oldName, newName]) => {
  const oldPath = path.join(rootDir, oldName);
  if (!fs.existsSync(oldPath)) {
    console.warn(`File not found: ${oldName}`);
    return;
  }

  let content = fs.readFileSync(oldPath, 'utf8');

  // Replace page links (both raw and URL-encoded)
  Object.entries(pageMap).forEach(([orig, target]) => {
    const origEncoded = encodeURIComponent(orig);
    const origNoExt = orig.replace(/\.dc\.html$/, '');
    const origNoExtEncoded = encodeURIComponent(origNoExt);

    // Replace ./Old Name.dc.html and Old Name.dc.html
    content = content.split('./' + orig).join('./' + target);
    content = content.split('./' + origEncoded).join('./' + target);
    content = content.split('"' + orig + '"').join('"' + './' + target + '"');
    content = content.split('"' + origEncoded + '"').join('"' + './' + target + '"');

    // Replace ./Old Name.dc
    content = content.split('./' + origNoExt + '.dc').join('./' + target);
    content = content.split('./' + origNoExtEncoded + '.dc').join('./' + target);
  });

  // Replace homepage specific anchors and links
  content = content.split('./Galaxy Hero.dc.html#faq').join('./index.html#faq');
  content = content.split('./Galaxy%20Hero.dc.html#faq').join('./index.html#faq');

  // Replace assets
  Object.entries(assetMap).forEach(([oldAsset, newAsset]) => {
    content = content.split('"' + oldAsset + '"').join('"' + newAsset + '"');
    content = content.split("'" + oldAsset + "'").join("'" + newAsset + "'");
    content = content.split("url('" + oldAsset + "')").join("url('" + newAsset + "')");
    content = content.split('url("./' + path.basename(oldAsset) + '")').join("url('" + newAsset + "')");
    content = content.split('url(\'./' + path.basename(oldAsset) + '\')').join("url('" + newAsset + "')");
    content = content.split('url(' + oldAsset + ')').join("url('" + newAsset + "')");
  });

  // Ensure dc-import names match
  content = content.split('<dc-import name="Support Chatbot"').join('<dc-import name="support-chatbot"');

  const newPath = path.join(rootDir, newName);
  fs.writeFileSync(newPath, content, 'utf8');
  console.log(`Generated: ${newName} from ${oldName}`);
});

console.log('Migration step completed.');
