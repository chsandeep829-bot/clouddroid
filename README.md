# CloudDroid

CloudDroid is a Cloudflare Pages dashboard for a separately hosted Android device. It includes a status bridge and authenticated start/stop/restart command proxy.

## Important zero-cost limitation

No reliable service can be promised to provide a 24/7 Android 17 gaming phone at exactly zero cost. Cloudflare Pages/Workers do not provide Android compute, persistent emulator storage, GPU acceleration or a running phone. Free VMs may have quotas, reclamation, limited virtualization, and no graphics acceleration. Android 17 and Free Fire compatibility must be verified with the actual provider.

This repository is a real control-plane application, not an Android emulator. It reports an unconfigured state until a compatible host is connected.

## Deploy to Cloudflare Pages

1. Workers & Pages → Create application → Pages → Connect to Git.
2. Select this repository and \`main\`.
3. Framework preset: None.
4. Build command: leave empty (or \`exit 0\` only if required).
5. Build output directory: \`.\` (repository root).
6. Deploy. Do not use \`npx wrangler deploy\` for Pages Git deployments.

## Configure secrets

In Pages project → Settings → Variables and Secrets, add these as encrypted secrets:

- \`ANDROID_HOST_URL\`: HTTPS origin of your Android gateway.
- \`ANDROID_HOST_TOKEN\`: strong random bearer token accepted by the gateway.
- \`CLOUDDROID_ACCESS_KEY\`: a separate strong key you enter in the dashboard to unlock lifecycle controls.

Never commit these secrets to GitHub. Redeploy after adding or changing variables.

## Host API contract

See [docs/ANDROID_HOST_API.md](docs/ANDROID_HOST_API.md). Host routes:
- \`GET /api/v1/status\`
- \`POST /api/v1/device/start\`
- \`POST /api/v1/device/stop\`
- \`POST /api/v1/device/restart\`

All routes must require the bearer token and use HTTPS. Lifecycle operations must be rate-limited and audited. The CloudDroid API requires \`X-CloudDroid-Key\` for command requests.

## Included

- Responsive mobile dashboard and device status.
- Server-side status bridge.
- Authenticated start, stop and restart proxy.
- No host token in browser code.
- Activity log and honest disconnected state.

## Not included yet

- Android 17 emulator/runtime (requires an external host).
- Live screen streaming, WebRTC/VNC/scrcpy browser client or touch forwarding (provider-specific).
- Guaranteed 24/7 uptime or a free compute allocation.
- Game installation or game automation.

Remote screen and touch must be implemented against the selected provider's documented protocol. Never expose ADB or an unauthenticated control port publicly. This app is intended for manual remote operation, not gameplay automation.
