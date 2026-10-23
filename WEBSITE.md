# WEBSITE.md – notes for Claude

Keep this file short. Update it when a rule, page or open task changes.

## What this is
- Company site for **mStudio Solutions**: app support pages and privacy policies.
- Live at https://mstudio-solutions.github.io (GitHub Pages, static HTML, no build step).
- Repo: `mstudio-solutions/mstudio-solutions.github.io`. Branch `main` is the live site.

## Pages
- `/` `index.html` – home, in this order: top card (cloud picture), Our values (3 small tiles in a row), How it works (3 small steps in a row with arrows), Apps (iOS / macOS / Web / Chrome switch, app cards), About (blue Azure card), Contact (blue card). Goal: on a laptop the first app card shows without scrolling, so keep the top part compact; never cut the values or steps text. Design theme: apps + cloud (Azure blue `#0078D4`, our own cloud drawing; never use Microsoft or Azure logos).
  - Top card picture: inline SVG in `.top-art`. The floating app icons are `<img class="float f1|f2">` right after the SVG; swap them for the main apps (the user plans to put new main apps here later).
  - Badges: `badge free` (green), `badge soon` (amber). App Store link uses `class="store"` (black button).
  - Idea on hold: a "☁ Cloud data" badge on cards for apps that really use cloud services on Azure. Not used yet: mCurrency gets rates from Frankfurter, not Azure. Ask the user before adding it to an app.
- `/<app>/` support page, `/<app>/privacy/` privacy policy. These are the App Store Support and Privacy URLs, so never move them.
  - `mcurrency` – mCurrency. Live on the App Store since 20 October 2026: https://apps.apple.com/app/id6820315916 (badge "Free", `storeUrl` filled).
  - `mpractice` – mPractice Citizenship Test: one app with a choice of the Australian, Canadian and UK test (made 22 October 2026, after Apple rejected the three separate apps under guideline 4.3). It uses the old Canadian app's App Store record. Icon `assets/mpractice-icon.png`. App facts come from `/Users/martin/Documents/iOS Apps Store/mPractice-Citizenship-Test/mPractice-Citizenship-Test.md` and `appstore/metadata.md`. The support page has one section per test. One card on the home page.
  - `mpractice-canada`, `mpractice-uk`, `mpractice-aussie` (and `/privacy/`) – old apps, now only redirect pages to `/mpractice/` (22 October 2026). Their icons and config files were removed. Keep the redirects, so old links still work.
  - `mtranslate` – mTranslate, free macOS app for the Mac App Store (card in the macOS list). App facts come from `/Users/martin/Documents/mTranslate/mTranslate.md` and `appstore/metadata.md`.
  - `mtranslate-chrome` – mTranslate for Chrome, a separate free Chrome extension (Mac and Windows), with its own card in the Chrome list (home page switch: iOS / macOS / Web / Chrome, `/#chrome`) and its own icon `assets/mtranslate-chrome-icon.png`. Support page has the download and install steps; it has its own privacy page. Zip hosted at `/mtranslate-chrome/mTranslate-for-Chrome-<version>.zip`. New version: add the new zip, update the links on this support page and the home card, delete the old zip. Source is `Chrome/mTranslate for Chrome/` in repo `mstudio-solutions/mTranslate`.
  - `iac-bicep-generator` – details page for IaC Generator for Bicep (free web tool). The tool itself lives in repo `mstudio-solutions/iac-bicep-generator-v1` at `https://mstudio-solutions.github.io/iac-bicep-generator-v1/`.
  - `mmarkdown` – mMarkdown, free macOS Markdown reader and editor for the Mac App Store, with an optional "Buy me a coffee" tip (card in the macOS list, "Coming soon"). Icon `assets/mmarkdown-icon.png`. App facts come from `/Users/martin/Documents/mMarkdown/mMarkdown.md`.
  - `mpath` – mPath, free macOS Finder path bar (not App Store; signed .pkg hosted on this site)
  - `cloud-migration` – Cloud migration service: short intro page (What we do, Why move to the cloud, Contact). On the home page it sits under its own "Services" switch (next to the Apps switch, button "Cloud migration", `/#services`). Keep it simple and general: no prices, no naming of PHP, cPanel or any security issue. Icon `assets/cloud-migration-icon.svg` (our own cloud drawing). The user links to this page from LinkedIn.
  - `clean-microsoft-teams-accounts` – Clean Microsoft Teams Accounts, free macOS tool (signed .pkg hosted on this site, no privacy page). Source and `build-pkg.sh` in repo `mstudio-solutions/Clean-Microsoft-Account-for-macOS`. Do not use Microsoft or Teams logos; the icon is our own drawing.
- `config/<app>.json` – forced update: `minVersion`, `storeUrl` (empty until launch).
- `assets/style.css` – one shared stylesheet (light and dark). Every page links it as `style.css?v=YYYYMMDD`; when you change the CSS, bump this number on all pages, or browsers may mix old CSS with new HTML for up to 10 minutes. `assets/` also has logos and app icons.
- Header and footer are copied in every page. A change there means editing all HTML pages (the six redirect pages of the old mPractice apps have no header or footer).

## Home page iOS / macOS / Web / Chrome switch
- Buttons in `.platforms` with `data-platform="ios|macos|web|chrome"`; iOS is selected on load.
- iOS app cards sit in `<div data-apps="ios">`, macOS cards in `<div data-apps="macos" hidden>` (mTranslate, mMarkdown, mPath, Clean Microsoft Teams Accounts), web tools in `<div data-apps="web" hidden>` (IaC Generator for Bicep), Chrome extensions in `<div data-apps="chrome" hidden>` (mTranslate for Chrome).
- A small inline script at the end of `index.html` toggles `aria-pressed` and `hidden`. macOS, Web and Chrome set the URL to `/#macos`, `/#web` or `/#chrome` (shareable link, Back button works); iOS clears it.
- New app: add a `.card.app` inside the right `data-apps` div. Put the app name in `<h3><a class="card-link" href="<app>/">Name</a> <span class="badge ...">` – this makes the whole card open the support page (top). The card's "Support" link goes to `<app>/#contact`.
- Support pages: `<h2 id="faq">Common questions</h2>` and `<h2 id="contact">Contact support</h2>`; the contact card has a line pointing back to `#faq`. Keep these ids on new support pages.

## Rules
- Names: "mStudio Solutions" (titles, footer, logo alt). App: "mPractice Canadian Citizenship" (not "Canada").
- Page title format: `<App> Support - mStudio Solutions`, `<App> Privacy Policy - mStudio Solutions`.
- Keep "Coming soon" badges until an app is live on the App Store.
- Plain, simple English on the site. No prices (App Store shows local prices).
- Repo visibility rule: paid apps (with in-app purchase) are private; free apps stay public. When a new app is added, remind the user. The website repo must stay public (GitHub Pages on the free plan).

## Workflow
1. Talk it through with the user first; show a mockup or the diff and wait for OK.
2. Edit, check in a browser (Playwright + Chromium are installed) when layout changes.
3. Commit on the session branch, then push the same commit to `main` (`git push origin <branch>:main`). The site updates in 1–2 minutes.
- This session cannot delete remote branches; ask the user to do it on GitHub.

## Open tasks
- Name clean-up for the next app versions (do not change the apps before then): mCurrency 1.1 – App Store Connect Copyright "© 2026 mStudio" and description "Made by mStudio" → "mStudio Solutions"; mCurrency repo README still has the owner's name, "Sydney Australia" and an old datexts.github.io link (lines 2, 47, 50). mTranslate – "Also from mStudio" in the Mac app and Chrome extension; `Mac App/appstore/metadata.md` Name should be "mTranslate - Text Translator".
- mPath: the signed .pkg is hosted on this site at `/mpath/mPath-<version>.pkg` (home card + support page link to it). New version: add the new .pkg, update both links and the file name in the install steps, delete the old .pkg. The GitHub Release on `mstudio-solutions/mPath` had an older unsigned .pkg (10 Oct 2026); the user should replace or delete it.
- When an app goes live: remove its "Coming soon" badge, add the App Store link, fill `storeUrl` in `config/<app>.json`.
- Canada app repo still has an old `docs/` folder (old support/privacy pages, old name). The App Store uses this site, so the app side should delete `docs/`. Not done from here.

## Talking to the user
- Reply in spoken Cantonese, Traditional Chinese, with some emoji (no celebration emoji like 👏 🎉 ✨ 🙌).
- Confirm before making files or apps.
