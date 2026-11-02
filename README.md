# CloudDroid

CloudDroid is a starter dashboard for managing a separately hosted Android device.

## Included
- Responsive CloudDroid web dashboard.
- Cloudflare Pages Function at `/api/status`.
- Honest unconfigured state until a real Android host is connected.
- Device controls remain disabled until a secure host adapter is implemented.

## Important architecture note
Cloudflare Pages and Workers host the dashboard and API; they do **not** provide a full Android phone or persistent Android emulator by themselves. A separate compatible Android host is required for a 24/7 device. This repository does not claim to run Android or Free Fire.

## Deploy to Cloudflare Pages
1. In Cloudflare, open **Workers & Pages**.
2. Choose **Create application → Pages → Connect to Git**.
3. Select this repository and the `main` branch.
4. Set build command to empty / none.
5. Set build output directory to `/` (repository root).
6. Deploy. The dashboard is `index.html`; the API function is `functions/api/status.js`.

Cloudflare Git integration can automatically deploy new commits: https://developers.cloudflare.com/pages/configuration/git-integration/

## Android host integration
Before enabling device actions, implement a server-side adapter that:
- Authenticates using secrets stored as Cloudflare encrypted environment variables.
- Exposes health/status, start, stop, and secure remote-view endpoints.
- Uses short-lived, scoped credentials for browser sessions.
- Never exposes the Android host token to frontend JavaScript.
- Enforces authorization and rate limits.

Do not expose an emulator ADB port or unauthenticated remote-control endpoint to the public internet.

## Free Fire
This project supports manual remote-operation architecture only. It does not automate gameplay or room creation. Check the game's terms and use a supported device/hosting environment.
