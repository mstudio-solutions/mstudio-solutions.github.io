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
  - `mtranslate` – mTranslate, free macOS app for the Mac App Store (card in the macOS list). App facts come from `/Users/martin/Documents/iOS Apps Store/mTranslate/mTranslate.md` and `appstore/metadata.md`.
  - `mtranslate-chrome` – mTranslate for Chrome, a separate free Chrome extension (Mac and Windows), with its own card in the Chrome list (home page switch: iOS / macOS / Web / Chrome, `/#chrome`) and its own icon `assets/mtranslate-chrome-icon.png`. Support page has the download and install steps; it has its own privacy page. Zip hosted at `/mtranslate-chrome/mTranslate-for-Chrome-<version>.zip`. New version: add the new zip, update the links on this support page and the home card, delete the old zip. Source is `ChromeExtension/` in repo `mstudio-solutions/mTranslate`.
  - `iac-bicep-generator` – details page for IaC Generator for Bicep (free web tool). The tool itself lives in repo `mstudio-solutions/iac-bicep-generator-v1` at `https://mstudio-solutions.github.io/iac-bicep-generator-v1/`.
  - `mpath` – mPath, free macOS Finder path bar (not App Store; signed .pkg hosted on this site)
  - `clean-microsoft-teams-accounts` – Clean Microsoft Teams Accounts, free macOS tool (signed .pkg hosted on this site, no privacy page). Source and `build-pkg.sh` in repo `mstudio-solutions/Clean-Microsoft-Account-for-macOS`. Do not use Microsoft or Teams logos; the icon is our own drawing.
- `config/<app>.json` – forced update: `minVersion`, `storeUrl` (empty until launch).
- `assets/style.css` – one shared stylesheet (light and dark). `assets/` also has logos and app icons.
- Header and footer are copied in every page. A change there means editing all 17 HTML files.

## Home page iOS / macOS / Web / Chrome switch
- Buttons in `.platforms` with `data-platform="ios|macos|web|chrome"`; iOS is selected on load.
- iOS app cards sit in `<div data-apps="ios">`, macOS cards in `<div data-apps="macos" hidden>` (mPath, Clean Microsoft Teams Accounts), web tools in `<div data-apps="web" hidden>` (IaC Generator for Bicep), Chrome extensions in `<div data-apps="chrome" hidden>` (mTranslate for Chrome).
- A small inline script at the end of `index.html` toggles `aria-pressed` and `hidden`. macOS, Web and Chrome set the URL to `/#macos`, `/#web` or `/#chrome` (shareable link, Back button works); iOS clears it.
- New app: add a `.card.app` inside the right `data-apps` div.

## Rules
- Names: "mStudio Solutions" (titles, footer, logo alt). App: "mPractice Canadian Citizenship" (not "Canada").
- Page title format: `<App> Support - mStudio Solutions`, `<App> Privacy Policy - mStudio Solutions`.
- Keep "Coming soon" badges until an app is live on the App Store.
- Plain, simple English on the site. No prices (App Store shows local prices).
- Repo visibility rule: paid apps (with in-app purchase) are private; free apps stay public. When a new app is added, remind the user. The website repo must stay public (GitHub Pages on the free plan).
- App repos (Canada, UK, Aussie) are private since 16 October 2026. This cloud session cannot read the user's Mac, so for app facts ask the user to drag the files into the chat (e.g. `appstore/metadata.md`).
- Canada app facts come from `appstore/metadata.md` in `mstudio-solutions/mPractice-for-Canadian-Citizenship`.
- UK app facts come from `appstore/metadata.md` and `mPractice-for-British-Citizenship.md` in `/Users/martin/Documents/iOS Apps Store/mPractice-for-British-Citizenship/` (the GitHub repo is private). The UK pages were updated from there on 12 October 2026. This app has no Settings page and no dark theme: languages and Restore Purchases are at the top of the About page (globe button, top right).
- Aussie pages were updated on 13 October 2026 for the in-app purchase (facts given by the user from the Aussie app session).

## Workflow
1. Talk it through with the user first; show a mockup or the diff and wait for OK.
2. Edit, check in a browser (Playwright + Chromium are installed) when layout changes.
3. Commit on the session branch, then push the same commit to `main` (`git push origin <branch>:main`). The site updates in 1–2 minutes.
- This session cannot delete remote branches; ask the user to do it on GitHub.

## Open tasks
- mPath: the signed .pkg is hosted on this site at `/mpath/mPath-<version>.pkg` (home card + support page link to it). New version: add the new .pkg, update both links and the file name in the install steps, delete the old .pkg. The GitHub Release on `mstudio-solutions/mPath` had an older unsigned .pkg (10 Oct 2026); the user should replace or delete it.
- When an app goes live: remove its "Coming soon" badge, add the App Store link, fill `storeUrl` in `config/<app>.json`.
- Canada app repo still has an old `docs/` folder (old support/privacy pages, old name). The App Store uses this site, so the app side should delete `docs/`. Not done from here.

## Talking to the user
- Reply in spoken Cantonese, Traditional Chinese, with some emoji (no celebration emoji like 👏 🎉 ✨ 🙌).
- Confirm before making files or apps.
