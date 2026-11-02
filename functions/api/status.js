export async function onRequest() {
  return Response.json({
    ok: true,
    service: "CloudDroid API",
    device: {
      status: "Not configured",
      message: "Connect a separately hosted Android emulator to enable device access.",
      androidVersion: null,
      uptime: null,
      resources: null,
      gameStatus: "Not connected"
    },
    capabilities: { startStop: false, screenStreaming: false, touchInput: false }
  }, { headers: { "Cache-Control": "no-store" } });
}