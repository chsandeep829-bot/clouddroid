# CloudDroid Android host gateway contract

All host routes must require HTTPS and the bearer token stored in Cloudflare as \`ANDROID_HOST_TOKEN\`.

## Required routes

- \`GET /api/v1/status\` returns JSON with string fields: \`status\`, \`message\`, \`androidVersion\`, \`uptime\`, \`resources\`, \`gameStatus\`.
- \`POST /api/v1/device/start\`
- \`POST /api/v1/device/stop\`
- \`POST /api/v1/device/restart\`

Lifecycle routes return JSON such as \`{"message":"Start accepted"}\`. They must authorize the bearer token, validate state transitions, rate-limit requests and audit actions. The CloudDroid Pages Function additionally requires \`CLOUDDROID_ACCESS_KEY\` from the browser as \`X-CloudDroid-Key\`.

## Example status

\`\`\`json
{
  "status": "Running",
  "message": "Android host connected",
  "androidVersion": "17",
  "uptime": "2h 14m",
  "resources": "2 vCPU / 4 GB RAM",
  "gameStatus": "Not checked"
}
\`\`\`

## Remote display

Remote screen and touch are deliberately not implemented by these generic routes. Providers use different protocols (WebRTC, VNC gateways, scrcpy web frontends, etc.). Implement a provider-specific, short-lived session endpoint and browser client only after selecting a provider and reviewing its authentication and origin requirements.

Never expose ADB or a raw remote-control port to the public internet. Do not return the bearer token or permanent remote-control URL to browser JavaScript.
