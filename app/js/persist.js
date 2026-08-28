import { SEED, hydrate, nowIso } from "./model.js";

const LS_KEY = "eixo.estado.v1";
let serverOk = false;
let timer = null;

export function servidorDisponivel() {
  return serverOk;
}

export async function load() {
  try {
    const r = await fetch("/api/state", { cache: "no-store" });
    if (r.ok) {
      const data = hydrate(await r.json());
      serverOk = true;
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(data));
      } catch (_) {
        /* quota */
      }
      return data;
    }
  } catch (_) {
    serverOk = false;
  }
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return hydrate(JSON.parse(raw));
  } catch (_) {
    /* parse */
  }
  const seed = hydrate(SEED);
  seed.meta.createdAt = nowIso();
  seed.meta.updatedAt = nowIso();
  return seed;
}

export async function saveNow(data) {
  data.meta = data.meta || {};
  data.meta.updatedAt = nowIso();
  const text = JSON.stringify(data);
  try {
    localStorage.setItem(LS_KEY, text);
  } catch (_) {
    /* quota */
  }
  if (!serverOk) return;
  try {
    const r = await fetch("/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!r.ok) serverOk = false;
  } catch (_) {
    serverOk = false;
  }
}

export function saveDebounced(data, ms = 400) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    saveNow(data);
  }, ms);
}

export function downloadText(filename, text, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
