const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

export async function onRequestPost({ request, env }) {
  try {
    if (request.body) {
      const reader = request.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value?.byteLength) {
            await reader.cancel();
            return json({ ok: false, error: "Request body must be empty" }, 400);
          }
        }
      } finally {
        reader.releaseLock();
      }
    }
  } catch {
    return json({ ok: false, error: "Invalid request" }, 400);
  }

  try {
    if (!env.INSTALLS_DB) {
      throw new Error("D1 binding unavailable");
    }

    const result = await env.INSTALLS_DB
      .prepare("UPDATE install_counts SET total = total + 1 WHERE id = 1")
      .run();

    if (result.meta?.changes !== 1) {
      throw new Error("Install counter is not initialized");
    }

    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "Install count unavailable" }, 503);
  }
}
