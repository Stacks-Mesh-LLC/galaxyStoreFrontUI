# Galaxy Medical Alert Systems — Storefront & Catalog

A modern, responsive, high-performance storefront and product catalog for **Galaxy Medical Alert Systems**. Built with pure web standards and ready for instant deployment on **Cloudflare Pages / Workers** via **GitHub**.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Verify link & asset integrity
npm run verify

# 2. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
galaxyStoreFrontUI/
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD workflow for automated Cloudflare deployment
├── assets/
│   ├── images/                     # Product shots, badges, logos, certifications
│   ├── docs/                       # Installation & product guide PDFs
│   ├── video/                      # hero.mp4 background video
│   └── js/                         # support.js runtime & interactive widgets
├── index.html                      # Homepage (Hero, Systems, Pricing, FAQ, Video)
├── about.html                      # About Us & Company Overview
├── contact.html                    # Contact Us & Inquiry Form (mailto integration)
├── monitoring.html                 # Monitoring Services & Certifications (CSAA 5-Diamond)
├── do-i-need-one.html              # Medical Alert Assessment Quiz & Scoring
├── shipping.html                   # Shipping & Returns Policy
├── terms.html                      # Terms & Conditions
├── privacy.html                    # Privacy Policy
├── blog.html                       # Blog Index
├── blog-alberta.html               # Blog: Medical Alert Systems in Alberta
├── blog-apple-watch.html           # Blog: Medical Alert vs Apple Watch
├── blog-winter-falls.html          # Blog: Winter Falls Prevention for Seniors
├── in-the-home.html                # Category: At-Home Systems
├── on-the-go.html                  # Category: On-The-Go GPS Systems
├── alert-kits.html                 # Category: Alert Kits
├── home-cellular-system.html       # Product: Home Cellular Base System
├── mobile-watch-system.html        # Product: Mobile Medical Alert Watch
├── mobile-slimline-watch-system.html # Product: Mobile Slimline Watch
├── mobile-system-gps-fall.html     # Product: Mobile GPS Pendant with Fall Detection
├── mobile-system-gps-fall-wifi.html # Product: Mobile GPS Pendant with Fall & Wi-Fi
├── essential-kit.html              # Product: Essential Kit Bundle
├── essential-plus-kit.html         # Product: Essential Plus Kit Bundle
├── premier-kit.html                # Product: Premier Kit Bundle
├── support-chatbot.html            # AI Support Assistant Component
├── _headers                        # Cloudflare caching & security headers
├── _redirects                      # Legacy URL 301 redirects
├── wrangler.jsonc                  # Cloudflare Workers / Pages configuration
├── package.json                    # Scripts and dependencies
└── README.md                       # Project documentation
```

---

## 🌐 Deploying to Cloudflare via GitHub

You can connect this repository to Cloudflare in **2 easy ways**:

### Method 1: Cloudflare Pages (Recommended — Automatic Git Deploys)

1. Push this repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Galaxy Medical Alert Storefront"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select your GitHub repository (`YOUR_REPO_NAME`).
4. Set the build settings:
   - **Framework preset**: `None`
   - **Build command**: `npm run verify`
   - **Build output directory**: `.` (root)
5. Click **Save and Deploy**.

> **Done!** Every time you push changes to GitHub, Cloudflare will automatically verify and deploy your site within seconds.

---

### Method 2: GitHub Actions + Wrangler

If you prefer deploying via GitHub Actions:
1. In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**.
2. Add the following repository secrets:
   - `CLOUDFLARE_API_TOKEN` (API Token with Cloudflare Pages permissions)
   - `CLOUDFLARE_ACCOUNT_ID` (Your Cloudflare Account ID)
3. Any push to `main` will trigger `.github/workflows/deploy.yml` and deploy automatically.

---

## 🛠️ Verification & Maintenance

Run the automated integrity test anytime before committing:
```bash
npm run verify
```
This tests all 24 HTML pages, 400+ asset references, internal links, and dynamic component imports.
