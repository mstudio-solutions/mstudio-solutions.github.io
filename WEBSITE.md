# WEBSITE.md – notes for Claude

Keep this file short. Update it when a rule, page or open task changes.

## What this is
- Company site for **mStudio Solutions**: app support pages and privacy policies.
- Live at https://mstudio-solutions.github.io (GitHub Pages, static HTML, no build step).
- Repo: `mstudio-solutions/mstudio-solutions.github.io`. Branch `main` is the live site.

## Pages
- `/` `index.html` – home: values, iOS / macOS app switch, app cards, About, Contact.
- `/<app>/` support page, `/<app>/privacy/` privacy policy. These are the App Store Support and Privacy URLs, so never move them.
  - `mcurrency` – mCurrency
  - `mpractice-canada` – mPractice Canadian Citizenship
  - `mpractice-uk` – mPractice British Citizenship
  - `mpractice-aussie` – mPractice Aussie Citizenship
  - `mpath` – mPath, free macOS Finder path bar (not App Store; .pkg from GitHub Releases)
- `config/<app>.json` – forced update: `minVersion`, `storeUrl` (empty until launch).
- `assets/style.css` – one shared stylesheet (light and dark). `assets/` also has logos and app icons.
- Header and footer are copied in every page. A change there means editing all 9 HTML files.

## Home page iOS / macOS switch
- Buttons in `.platforms` with `data-platform="ios|macos"`; iOS is selected on load.
- iOS app cards sit in `<div data-apps="ios">`, macOS cards in `<div data-apps="macos" hidden>` (mPath).
- A small inline script at the end of `index.html` toggles `aria-pressed` and `hidden`.
- New app: add a `.card.app` inside the right `data-apps` div.

## Rules
- Names: "mStudio Solutions" (titles, footer, logo alt). App: "mPractice Canadian Citizenship" (not "Canada").
- Page title format: `<App> Support - mStudio Solutions`, `<App> Privacy Policy - mStudio Solutions`.
- Keep "Coming soon" badges until an app is live on the App Store.
- Plain, simple English on the site. No prices (App Store shows local prices).
- Canada app facts come from `appstore/metadata.md` in `mstudio-solutions/mPractice-for-Canadian-Citizenship` (public, clone read-only).
- UK and Aussie pages: do not change content for now (apps not ready).

## Workflow
1. Talk it through with the user first; show a mockup or the diff and wait for OK.
2. Edit, check in a browser (Playwright + Chromium are installed) when layout changes.
3. Commit on the session branch, then push the same commit to `main` (`git push origin <branch>:main`). The site updates in 1–2 minutes.
- This session cannot delete remote branches; ask the user to do it on GitHub.

## Open tasks
- mPath: download links (home card + support page) go straight to `https://github.com/mstudio-solutions/mPath/releases/latest/download/mPath-1.0.0.pkg`. The file name has the version: when a new version ships, update both links and the file name on the support page. Install steps assume a signed, notarized .pkg (being done in the mPath session). Before going live, confirm the Release exists and the link downloads.
- When an app goes live: remove its "Coming soon" badge, add the App Store link, fill `storeUrl` in `config/<app>.json`.
- Canada app repo still has an old `docs/` folder (old support/privacy pages, old name). The App Store uses this site, so the app side should delete `docs/`. Not done from here.

## Talking to the user
- Reply in spoken Cantonese, Traditional Chinese, with some emoji (no celebration emoji like 👏 🎉 ✨ 🙌).
- Confirm before making files or apps.
