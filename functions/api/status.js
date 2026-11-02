const json = (data, status = 200) => Response.json(data, {
  status,
  headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
});

export async function onRequest({ env }) {
  const base = (env.ANDROID_HOST_URL || "").replace(/\/$/, "");
  const token = env.ANDROID_HOST_TOKEN;

  if (!base || !token) {
    return json({
      ok: true,
      service: "CloudDroid API",
      device: {
        status: "Not configured",
        message: "No Android host URL and token are configured. Cloudflare hosts this dashboard, not Android itself.",
        androidVersion: null,
        uptime: null,
        resources: null,
        gameStatus: "Not connected"
      },
      capabilities: { startStop: false, screenStreaming: false, touchInput: false }
    });
  }

  try {
    const response = await fetch(base + "/api/v1/status", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(`Android host returned HTTP ${response.status}`);
    const host = await response.json();
    return json({
      ok: true,
      service: "CloudDroid API",
      device: {
        status: typeof host.status === "string" ? host.status : "Unknown",
        message: typeof host.message === "string" ? host.message : "Connected to Android host.",
        androidVersion: typeof host.androidVersion === "string" ? host.androidVersion : null,
        uptime: typeof host.uptime === "string" ? host.uptime : null,
        resources: typeof host.resources === "string" ? host.resources : null,
        gameStatus: typeof host.gameStatus === "string" ? host.gameStatus : "Unknown"
      },
      capabilities: { startStop: false, screenStreaming: false, touchInput: false }
    });
  } catch (error) {
    return json({
      ok: false,
      service: "CloudDroid API",
      device: {
        status: "Host unreachable",
        message: "The configured Android host did not respond. Check its URL, token, TLS certificate and availability.",
        androidVersion: null, uptime: null, resources: null, gameStatus: "Unknown"
      },
      capabilities: { startStop: false, screenStreaming: false, touchInput: false }
    }, 503);
  }
}
