# Android host gateway contract

CloudDroid's Pages Function currently consumes only this endpoint:

- Method: `GET`
- Path: `/api/v1/status`
- Authentication: `Authorization: Bearer <ANDROID_HOST_TOKEN>`
- Transport: HTTPS only
- Response: JSON object with string fields `status`, `message`, `androidVersion`, `uptime`, `resources`, and `gameStatus`.

Example:

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

The CloudDroid API deliberately does not proxy arbitrary URLs, accept browser-supplied host addresses, or return the host credential. Lifecycle and remote-control endpoints are not implemented yet. Add them only with authenticated authorization, CSRF protection where applicable, strict input validation, audit logs, rate limits, and short-lived remote-view sessions.

Do not expose ADB or an unauthenticated VNC/scrcpy/WebRTC control endpoint publicly.
