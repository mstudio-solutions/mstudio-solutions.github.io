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
- `config/<app>.json` – forced update: `minVersion`, `storeUrl` (empty until launch).
- `assets/style.css` – one shared stylesheet (light and dark). `assets/` also has logos and app icons.
- Header and footer are copied in every page. A change there means editing all 9 HTML files.

## Home page iOS / macOS switch
- Buttons in `.platforms` with `data-platform="ios|macos"`; iOS is selected on load.
- App cards sit in `<div data-apps="ios">`. `<div data-apps="macos" hidden>` shows "macOS apps are coming soon."
- A small inline script at the end of `index.html` toggles `aria-pressed` and `hidden`.
- New iOS app: add a `.card.app` inside `data-apps="ios"`. First macOS app: replace the "coming soon" line.

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
- When an app goes live: remove its "Coming soon" badge, add the App Store link, fill `storeUrl` in `config/<app>.json`.
- Canada app repo still has an old `docs/` folder (old support/privacy pages, old name). The App Store uses this site, so the app side should delete `docs/`. Not done from here.

## Talking to the user
- Reply in spoken Cantonese, Traditional Chinese, with some emoji (no celebration emoji like 👏 🎉 ✨ 🙌).
- Confirm before making files or apps.
