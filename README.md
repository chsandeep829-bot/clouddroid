# CloudDroid

CloudDroid is a Cloudflare-hosted control dashboard and a secure, read-only status bridge for a separately hosted Android device.

## Reality check: free 24/7 Android 17

There is no dependable way to promise a 24/7 Android 17 gaming phone at zero cost. Cloudflare Pages/Workers do not provide Android compute, GPU acceleration, persistent emulator storage, or a continuously running phone. Free virtual machines can have quotas, idle reclamation, regional limits, and may not support the graphics stack needed by games.

This repository therefore does not pretend that a device exists. It reports **Not configured** until a real compatible host is connected. Android 17 support must be verified on the chosen host/runtime; do not assume an Android container image supports it.

## Architecture

- **Cloudflare Pages** serves `index.html`.
- **Pages Functions** provide `/api/status`.
- **Android host** is a separate Linux server or managed cloud Android provider.
- **Status bridge** calls the host from the server side; the host token is never sent to browser JavaScript.
- **Remote display/input and lifecycle controls** are intentionally disabled until a provider-specific, authenticated adapter is implemented and tested.

## Deploy dashboard

1. Open Cloudflare **Workers & Pages → Create application → Pages → Connect to Git**.
2. Choose this repository and branch `main`.
3. Framework preset: **None**.
4. Build command: leave empty (or use `exit 0` only if the UI requires a command).
5. Build output directory: `.` (repository root).
6. Deploy.

Do not use `npx wrangler deploy`; that is the Worker-script deployment command, not the Pages Git build configuration.

## Configure a real Android host

In the Cloudflare Pages project, open **Settings → Variables and Secrets** and add:

- `ANDROID_HOST_URL`: HTTPS origin of your own Android-host gateway, for example `https://android-gateway.example.com`.
- `ANDROID_HOST_TOKEN`: a long random secret accepted by that gateway.

The gateway must implement:

`GET /api/v1/status`

It must require `Authorization: Bearer <token>` and return JSON with this shape:

```json
{
  "status": "Running",
  "message": "Android host connected",
  "androidVersion": "17",
  "uptime": "2h 14m",
  "resources": "2 vCPU / 4 GB RAM",
  "gameStatus": "Not checked"
}
```

The status function exposes only the validated display fields. It never returns the host token. If the gateway is missing or unreachable, the dashboard reports that honestly.

## Host requirements

A suitable host needs:
- Explicit support for the required Android version (verify Android 17 rather than assuming).
- Persistent writable storage and a documented restart policy.
- Enough CPU/RAM and compatible graphics/virtualization for the intended workload.
- HTTPS, authentication, firewalling, rate limits, and logs.
- A provider-supported remote display and input protocol if browser control is required.

Never expose ADB, scrcpy, VNC, WebRTC control, or an emulator management port directly to the public internet. Put them behind an authenticated gateway. Do not commit tokens to GitHub or put them in frontend code.

## Current feature status

| Feature | Status |
|---|---|
| Dashboard | Included |
| Cloudflare status API | Included |
| Server-side host status bridge | Included |
| Android 17 runtime | Requires separate host |
| 24/7 uptime | Depends on host plan and quotas |
| Start/stop/restart | Not enabled |
| Live screen and touch | Not enabled |
| Free Fire | Not bundled; install only through supported, legitimate means |

This project is for manual remote operation. It does not automate gameplay, create rooms, or bypass game protections.
