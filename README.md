# Put UniSync online so it installs like an app

This folder is the whole app. Upload it to any free static host. It must be served over **https** (that is also what makes the camera and location work for attendance).

## 1. Host it (pick one, 5 minutes)

**Netlify (easiest):** go to app.netlify.com/drop and drag this whole folder (or the zip) onto the page. You get a link like `https://something.netlify.app`. You can rename it in Site settings.

**Cloudflare Pages:** Workers & Pages › Create › Pages › Upload assets › drop the folder.

**GitHub Pages:** put these files in a repository, then Settings › Pages › deploy from the main branch.

**Vercel:** `vercel` in this folder, or drag it into the dashboard.

## 2. Tell Supabase about the new address

Supabase dashboard › Authentication › URL Configuration:
- **Site URL:** your new address (for example `https://unisync.netlify.app`)
- **Redirect URLs:** add the same address

Without this, email confirmation and password-reset links point to the wrong place.

## 3. Install it on a phone

- **Android (Chrome):** open the link. An "Install" banner appears on Today (or menu › Install app). It then lives on the home screen and opens full screen with no browser bar.
- **iPhone (Safari):** open the link, tap Share › Add to Home Screen › Add.
- **Laptop (Chrome/Edge):** the install icon in the address bar.

## 4. Updating later

Upload the new files to the same host. Phones pick the new version up the next time the app opens and show an **Update** button. Nothing needs reinstalling.

## What works without a network

The app opens from the phone even with no signal, and check-ins made offline are saved and sent as soon as the network returns. Signing in, messages and anything new still need a connection.
