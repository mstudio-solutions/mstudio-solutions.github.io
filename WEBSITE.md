# WEBSITE.md – notes for Claude

Keep this file short. Update it when a rule, page or open task changes.

## What this is
- Company site for **mStudio Solutions**: app support pages and privacy policies.
- Live at https://mstudiosolutions.com (GitHub Pages, static HTML, no build step).
- Repo: `mstudio-solutions/mstudio-solutions.github.io`. Branch `main` is the live site.
- On the Mac: `/Users/martin/Documents/Web Site/` (moved and renamed 29 October 2026; the folder name differs from the repo name).
- Contact email on every page: `info@mstudiosolutions.com` (keep the `?subject=` on support and privacy links).

## Domain and email (set up 27–28 October 2026)
- Domain `mstudiosolutions.com` bought on Cloudflare (registrar and DNS). Main address has no `www`; `www.mstudiosolutions.com` and the old `https://mstudio-solutions.github.io/...` addresses redirect (301) to the same page on `https://mstudiosolutions.com`, so old links in apps and App Store Connect still work.
- `CNAME` file in the repo root holds `mstudiosolutions.com`. GitHub made it; never delete it, or the site goes back to the github.io address.
- Cloudflare DNS: 4 A + 4 AAAA records for `@` (GitHub Pages IPs), CNAME `www` → `mstudio-solutions.github.io`, all "DNS only" (grey cloud; the orange proxy breaks GitHub's HTTPS certificate). TXT `_github-pages-challenge-mstudio-solutions` verifies the domain for the GitHub org; keep it.
- Repo Settings → Pages: custom domain `mstudiosolutions.com`, Enforce HTTPS on. Changing the custom domain turns Enforce HTTPS off; tick it again once the certificate is out (a few minutes).
- Email: Cloudflare Email Routing forwards `info@mstudiosolutions.com` to `mstudiosolutions@gmail.com` (receive only; replies go out from the Gmail address). Catch-all is Drop. Its MX, SPF and DKIM records were added by Cloudflare; don't remove them.

## Pages
- `/` `index.html` – home, in this order: top card (cloud picture), Our values (3 small tiles in a row), How it works (3 small steps in a row with arrows), Apps (iOS / macOS / Web / Chrome switch, app cards), then two small cards (`.more`) that open `/about/` and `/contact/` (29 October 2026; the long About and Contact parts moved to their own pages). Goal: on a laptop the first app card shows without scrolling, so keep the top part compact; never cut the values or steps text. Design theme: apps + cloud (Azure blue `#0078D4`, our own cloud drawing; never use Microsoft or Azure logos).
  - Top card picture: inline SVG in `.top-art`. The floating app icons are `<img class="float f1|f2">` right after the SVG; swap them for the main apps (the user plans to put new main apps here later).
  - Badges: `badge free` (green), `badge soon` (amber). App Store link uses `class="store"` (black button).
  - Idea on hold: a "☁ Cloud data" badge on cards for apps that really use cloud services on Azure. Not used yet: mCurrency gets rates from Frankfurter, not Azure. Ask the user before adding it to an app.
- `/about/` – About us: short intro (founded 2025, simple apps for phone, computer and web), Our story timeline (2025 IaC Generator, 2026 mCurrency, Next: more cloud apps), What we make (3 tiles), What we care about (blue Azure card), Contact button. Never show the owner's name or LinkedIn on the site.
- `/contact/` – contact form (see "Contact form" below). `/contact/?topic=<value>` picks the topic, e.g. `?topic=cloud-migration` (used by the Cloud migration card and page).
- `/<app>/` support page, `/<app>/privacy/` privacy policy. These are the App Store Support and Privacy URLs, so never move them.
  - `mcurrency` – mCurrency. Live on the App Store since 20 October 2026: https://apps.apple.com/app/id6820315916 (badge "Free", `storeUrl` filled).
  - `mpractice` – mPractice Citizenship Test: one app with a choice of the Australian, Canadian and UK test (made 22 October 2026, after Apple rejected the three separate apps under guideline 4.3). It uses the old Canadian app's App Store record. Icon `assets/mpractice-icon.png`. App facts come from `/Users/martin/Documents/iOS Apps Store/mPractice-Citizenship-Test/mPractice-Citizenship-Test.md` and `appstore/metadata.md`. The support page has one section per test. One card on the home page.
  - `mpractice-canada`, `mpractice-uk`, `mpractice-aussie` (and `/privacy/`) – old apps, now only redirect pages to `/mpractice/` (22 October 2026). Their icons and config files were removed. Keep the redirects, so old links still work.
  - `mtranslate` – mTranslate, free macOS app for the Mac App Store (card in the macOS list). App facts come from `/Users/martin/Documents/mTranslate/mTranslate.md` and `appstore/metadata.md`.
  - `mtranslate-chrome` – mTranslate for Chrome, a separate free Chrome extension (Mac and Windows), with its own card in the Chrome list (home page switch: iOS / macOS / Web / Chrome, `/#chrome`) and its own icon `assets/mtranslate-chrome-icon.png`. Live on the Chrome Web Store since October 2026: https://chromewebstore.google.com/detail/mtranslate/kohomkifcdlockjflgjohjomfcoceeef (home card link "Chrome Web Store", support page button and install steps). No zip on this site any more (removed 24 October 2026); a new version is uploaded to the Web Store, the site doesn't change. Source is `Chrome/mTranslate for Chrome/` in repo `mstudio-solutions/mTranslate`.
  - `iac-bicep-generator` – details page for IaC Generator for Bicep (free web tool). The tool itself lives in repo `mstudio-solutions/iac-bicep-generator-v1` at `https://mstudiosolutions.com/iac-bicep-generator-v1/`.
  - `mmarkdown` – mMarkdown, free macOS Markdown reader and editor for the Mac App Store, with an optional "Buy me a coffee" tip (card in the macOS list, "Coming soon"). Icon `assets/mmarkdown-icon.png`. App facts come from `/Users/martin/Documents/mMarkdown/mMarkdown.md`.
  - `mpath` – mPath, free macOS Finder path bar for the Mac App Store, with an optional "Buy me a coffee" tip (card in the macOS list, "Coming soon"). The website .pkg was removed on 26 October 2026; never host the app here again. App facts come from `/Users/martin/Documents/mPath/mPath.md`.
  - `cloud-migration` – Cloud migration service: short intro page (What we do, Why move to the cloud, Contact). On the home page it sits under its own "Services" switch (next to the Apps switch, button "Cloud migration", `/#services`). Keep it simple and general: no prices, no naming of PHP, cPanel or any security issue. Icon `assets/cloud-migration-icon.svg` (our own cloud drawing). The user links to this page from LinkedIn.
  - `clean-microsoft-teams-accounts` – Clean Microsoft Teams Accounts, free macOS tool (signed .pkg hosted on this site, no privacy page). Source and `build-pkg.sh` in repo `mstudio-solutions/Clean-Microsoft-Account-for-macOS`. Do not use Microsoft or Teams logos; the icon is our own drawing.
- `config/<app>.json` – forced update: `minVersion`, `storeUrl` (empty until launch).
- App icons in `assets/` must fill the whole image (no clear border). Mac app icons often have a clear border of about 10%; crop it off first, or the icon looks smaller than the others.
- `assets/style.css` – one shared stylesheet (light and dark). Every page links it as `style.css?v=YYYYMMDDNN` (date + a 2-digit count); when you change the CSS, bump this number on all pages, or browsers may mix old CSS with new HTML for up to 10 minutes. `assets/` also has logos and app icons.
- Header has the logo plus `Apps · About · Contact` links (`.nav`); the current page's link has `aria-current="page"`.
- Header and footer are copied in every page. A change there means editing all HTML pages (the six redirect pages of the old mPractice apps have no header or footer).

## Home page iOS / macOS / Web / Chrome switch
- Buttons in `.platforms` with `data-platform="ios|macos|web|chrome"`; iOS is selected on load.
- iOS app cards sit in `<div data-apps="ios">`, macOS cards in `<div data-apps="macos" hidden>` (mTranslate, mMarkdown, mPath, Clean Microsoft Teams Accounts), web tools in `<div data-apps="web" hidden>` (IaC Generator for Bicep), Chrome extensions in `<div data-apps="chrome" hidden>` (mTranslate for Chrome).
- A small inline script at the end of `index.html` toggles `aria-pressed` and `hidden`. macOS, Web and Chrome set the URL to `/#macos`, `/#web` or `/#chrome` (shareable link, Back button works); iOS clears it.
- New app: add a `.card.app` inside the right `data-apps` div. Put the app name in `<h3><a class="card-link" href="<app>/">Name</a> <span class="badge ...">` – this makes the whole card open the support page (top). The card's "Support" link goes to `<app>/#contact`.
- Support pages: `<h2 id="faq">Common questions</h2>` and `<h2 id="contact">Contact support</h2>`; the contact card has a line pointing back to `#faq`. Keep these ids on new support pages.

## Contact form (`contact/index.html`)
- Fields (form `name`s): `name` (optional), `email`, `topic` (option values = app folder names, plus `general`, `cloud-migration`, `other`), `subject`, `message`, `attachment` (1 file, JPG/PNG/PDF, max 2 MB, checked in the page), `website` (hidden trap for bots: must be empty), `cf-turnstile-response` (added by Turnstile).
- Two settings at the top of the script: `FORM_ENDPOINT` and `TURNSTILE_SITE_KEY`. While `FORM_ENDPOINT` is empty, "Send message" opens the visitor's email app with the message filled in (no attachment box). When it is set, the page POSTs the form as `multipart/form-data` to it and shows the attachment box; any 2xx = sent, anything else = error message.
- Cloudflare Worker `contact-form` (Free plan) at `https://contact-form.datexts.workers.dev`, live since 29 October 2026. It allows CORS only from `https://mstudiosolutions.com`; checks the fields again (email, required fields, lengths, `website` empty, 1 file, JPG/PNG/PDF by file type, 2 MB); checks Turnstile last; builds the email (MIME) itself and sends it with the `SEND_EMAIL` binding (Email Service / Email Routing) to `mstudiosolutions@gmail.com`, From `website@mstudiosolutions.com`, Reply-To the visitor, subject `[Website] <topic>: <subject>`, the file attached. Nothing is stored. Errors only give a short message; details go to the Worker logs.
- Worker settings: binding `SEND_EMAIL`; binding `RATE_LIMITER` (Rate limiter, namespace 1001, 3 per 60 seconds: each IP can send at most 3 messages a minute; more get 429 and the page says "wait a minute"; the count is per Cloudflare location, so roughly); secret `TURNSTILE_SECRET` (the Turnstile secret key; never in the repo or chat). Turnstile widget "mStudio contact form", hostname `mstudiosolutions.com`, Managed; its site key is `TURNSTILE_SITE_KEY` in the page. The page uses `data-appearance="interaction-only"`: the box stays hidden and only shows when a visitor must click (most people pass without seeing it).
- `contact-worker/worker.js` is a copy of the Worker code (one file, no npm). To change the Worker: edit this file, paste it into the dashboard editor (Workers & Pages → contact-form → Edit code), Deploy, then commit. New topics in the page work without a Worker change (the subject shows the topic value until it is added to `TOPICS`).
- Cloudflare work: in the desktop app's built-in browser; the user signs in. Claude cannot paste into the Worker code editor: copy the code to the clipboard (`pbcopy`), the user presses Cmd + A, Cmd + V, then Claude checks the line count and clicks Deploy. The user pastes secrets and ticks Turnstile; Claude never does. Check any key copied from the dashboard letter by letter (a site key once had one A too many: Turnstile error 400020).
- Testing: real sends only from the user's own Chrome (the built-in browser does not pass Turnstile). Test the 429 limit with `fetch` from the built-in browser on `/contact/`; curl from the sandbox does not hit it (its IP changes). Worker logs: Workers & Pages → contact-form → Observability.

## Rules
- Names: "mStudio Solutions" (titles, footer, logo alt). App: "mPractice Canadian Citizenship" (not "Canada").
- Page title format: `<App> Support - mStudio Solutions`, `<App> Privacy Policy - mStudio Solutions`.
- Keep "Coming soon" badges until an app is live on the App Store.
- Plain, simple English on the site. No prices (App Store shows local prices).
- Repo visibility rule: paid apps (with in-app purchase) are private; free apps stay public. When a new app is added, remind the user. The website repo must stay public (GitHub Pages on the free plan).

## Workflow
1. Talk it through with the user first; show a mockup or the diff and wait for OK.
2. Edit, check in a browser (Playwright + Chromium are installed) when layout changes.
3. Commit on the session branch, then push the same commit to `main` (`git push origin <branch>:main`). If the user prefers, commit on `main` and push it. The site updates in 1–2 minutes.
- This session cannot delete remote branches; ask the user to do it on GitHub.

## Open tasks
- About page: the "Next" cloud icon in the Our story timeline (`about/index.html`, last `.pic`) looks too plain and small; redraw it fuller and bigger, like the app icons above it. Do it after the contact Worker is done.
- Name clean-up for the next app versions (do not change the apps before then): mCurrency 1.1 – App Store Connect Copyright "© 2026 mStudio" and description "Made by mStudio" → "mStudio Solutions"; mCurrency repo README still has the owner's name, "Sydney Australia" and an old datexts.github.io link (lines 2, 47, 50). mTranslate – "Also from mStudio" in the Mac app and Chrome extension; `Mac App/appstore/metadata.md` Name should be "mTranslate - Text Translator".
- mPath: moving to the Mac App Store (pkg removed from this site 26 October 2026). The .pkg was also deleted from the GitHub Release v1.0.0, and repo `mstudio-solutions/mPath` is now private (26 October 2026). When it goes live: remove "Coming soon", add the App Store link.
- New domain, next app versions (do not change the apps before then; each app's own session does it): change the contact email `mstudiosolutions@gmail.com` → `info@mstudiosolutions.com` and the website `https://mstudio-solutions.github.io/` → `https://mstudiosolutions.com/` in the app, its App Store Connect / Chrome Web Store Support and Privacy URLs and contact email. Files: mCurrency `src/App.tsx`, `src/native.ts`; mPractice `index.html`; mTranslate `Mac App/mTranslate/SettingsView.swift` and the Chrome extension; mMarkdown and mPath `Sources/SettingsWindow.swift`. Old addresses keep working until then (redirect).
- When an app goes live: remove its "Coming soon" badge, add the App Store link, fill `storeUrl` in `config/<app>.json`.
- Canada app repo still has an old `docs/` folder (old support/privacy pages, old name). The App Store uses this site, so the app side should delete `docs/`. Not done from here.

## Talking to the user
- Reply in spoken Cantonese, Traditional Chinese, with some emoji (no celebration emoji like 👏 🎉 ✨ 🙌).
- Confirm before making files or apps.
