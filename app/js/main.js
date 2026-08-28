import { render } from "./ui.js";
import { load, saveNow, saveDebounced, downloadText, servidorDisponivel } from "./persist.js";
import {
  novoNo,
  nowIso,
  aplicarAncora,
  periodoPorId,
  palavras,
  toMarkdown,
  validateImport,
  FILTER_VAZIO,
  uid,
} from "./model.js";

const ui = {
  view: "eixo",
  nodeId: null,
  sortSeletiva: "data",
  filters: { ...FILTER_VAZIO },
  sintese: null,
  avisoExportar: null,
};

let data = null;

function persistencia() {
  return servidorDisponivel() ? "arquivo" : "navegador";
}

function ctx() {
  return { data, ui, act, persistencia: persistencia() };
}

function paint() {
  render(document.getElementById("app"), ctx());
}

function commit(immediate = false) {
  data.meta.updatedAt = nowIso();
  if (immediate) saveNow(data);
  else saveDebounced(data);
}

function node() {
  return data.nodes.find((n) => n.id === ui.nodeId) || null;
}

function touch(n) {
  n.atualizadoEm = nowIso();
}

const act = {
  nav(view) {
    if (ui.view === "sintese") return;
    ui.view = view;
    if (view !== "no") ui.nodeId = null;
    ui.avisoExportar = null;
    paint();
  },

  novo(periodId) {
    if (ui.view === "sintese") return;
    const n = novoNo();
    if (periodId) {
      n.macroperiodId = periodId;
      const p = periodoPorId(data, periodId);
      if (p) n.enfase = p.enfase;
    } else if (data.macroperiods[0]) {
      n.macroperiodId = data.macroperiods[0].id;
      n.enfase = data.macroperiods[0].enfase;
    }
    data.nodes.push(n);
    ui.view = "no";
    ui.nodeId = n.id;
    commit();
    paint();
    queueMicrotask(() => {
      const el = document.getElementById("pergunta");
      if (el) el.focus();
    });
  },

  abrir(id) {
    if (ui.view === "sintese") return;
    ui.view = "no";
    ui.nodeId = id;
    paint();
  },

  apagar() {
    if (ui.view === "sintese") return;
    data.nodes = data.nodes.filter((n) => n.id !== ui.nodeId);
    ui.nodeId = null;
    ui.view = "eixo";
    commit(true);
    paint();
  },

  patch(fields) {
    const n = node();
    if (!n) return;
    Object.assign(n, fields);
    touch(n);
    commit();
  },

  setMacro(id) {
    const n = node();
    if (!n) return;
    n.macroperiodId = id;
    const p = periodoPorId(data, id);
    if (p) n.enfase = p.enfase;
    touch(n);
    commit();
    paint();
  },

  patchAncora(which, part, value) {
    const n = node();
    if (!n) return;
    if (!n.ancora) n.ancora = { inicio: { valor: "", unidade: "dc" }, fim: { valor: "", unidade: "dc" } };
    n.ancora[which][part] = value;
    aplicarAncora(n);
    touch(n);
    commit();
  },

  toggleDim(field, id, on) {
    const n = node();
    if (!n) return;
    const set = new Set(n[field] || []);
    if (on) set.add(id);
    else set.delete(id);
    n[field] = [...set];
    touch(n);
    commit();
  },

  patchMap(fields) {
    const n = node();
    if (!n) return;
    n.mapeamentoCausal = { ...(n.mapeamentoCausal || { inicio: "", elos: [], texto: "" }), ...fields };
    touch(n);
    commit();
  },

  addElo() {
    const n = node();
    if (!n) return;
    if (!n.mapeamentoCausal) n.mapeamentoCausal = { inicio: "", elos: [], texto: "" };
    n.mapeamentoCausal.elos = n.mapeamentoCausal.elos || [];
    n.mapeamentoCausal.elos.push({ via: "", para: "" });
    touch(n);
    commit();
    paint();
  },

  rmElo(i) {
    const n = node();
    if (!n) return;
    n.mapeamentoCausal.elos.splice(i, 1);
    touch(n);
    commit();
    paint();
  },

  patchElo(i, fields) {
    const n = node();
    if (!n) return;
    Object.assign(n.mapeamentoCausal.elos[i], fields);
    touch(n);
    commit();
  },

  addFonte() {
    const n = node();
    if (!n) return;
    n.fontes = n.fontes || [];
    n.fontes.push({ id: uid("f"), referencia: "", notas: "" });
    touch(n);
    commit();
    paint();
  },

  rmFonte(i) {
    const n = node();
    if (!n) return;
    n.fontes.splice(i, 1);
    touch(n);
    commit();
    paint();
  },

  patchFonte(i, fields) {
    const n = node();
    if (!n) return;
    Object.assign(n.fontes[i], fields);
    touch(n);
    commit();
  },

  setSeletiva(on) {
    const n = node();
    if (!n) return;
    n.profundidadeSeletiva = !!on;
    n.profundidadeSeletivaEm = on ? nowIso() : null;
    touch(n);
    commit();
  },

  entrarSintese() {
    const n = node();
    if (!n) return;
    if (!String(n.pergunta || "").trim()) {
      alert("Formule a pergunta causal antes de escrever a síntese.");
      return;
    }
    ui.sintese = {
      texto: "",
      perguntas: "",
      startedAt: nowIso(),
    };
    try {
      sessionStorage.setItem("eixo.sintese.rascunho", JSON.stringify({ id: n.id, ...ui.sintese }));
    } catch (_) {
      /* ignore */
    }
    ui.view = "sintese";
    paint();
    queueMicrotask(() => {
      const el = document.getElementById("sin-texto");
      if (el) el.focus();
    });
  },

  rascunhoSintese(fields) {
    if (!ui.sintese) ui.sintese = { texto: "", perguntas: "", startedAt: nowIso() };
    Object.assign(ui.sintese, fields);
    try {
      sessionStorage.setItem("eixo.sintese.rascunho", JSON.stringify({ id: ui.nodeId, ...ui.sintese }));
    } catch (_) {
      /* ignore */
    }
  },

  sairSintese() {
    ui.sintese = null;
    try {
      sessionStorage.removeItem("eixo.sintese.rascunho");
    } catch (_) {
      /* ignore */
    }
    ui.view = "no";
    paint();
  },

  salvarSintese() {
    const n = node();
    if (!n || !ui.sintese) return { erro: "sem rascunho" };
    const texto = String(ui.sintese.texto || "").trim();
    const perguntas = String(ui.sintese.perguntas || "").trim();
    if (!texto) return { erro: "A reconstrução está vazia." };
    if (!perguntas) return { erro: "Perguntas em aberto é campo obrigatório. Se não houver dúvida, registre isso em palavras." };
    if (n.sintese && (n.sintese.texto || n.sintese.perguntasAbertas)) {
      n.sintesesAnteriores = n.sintesesAnteriores || [];
      n.sintesesAnteriores.unshift(n.sintese);
    }
    n.sintese = {
      texto,
      perguntasAbertas: perguntas,
      escritoEm: nowIso(),
      palavras: palavras(texto),
    };
    touch(n);
    commit(true);
    ui.sintese = null;
    try {
      sessionStorage.removeItem("eixo.sintese.rascunho");
    } catch (_) {
      /* ignore */
    }
    ui.view = "no";
    paint();
    return { ok: true };
  },

  setFiltro(k, v) {
    ui.filters[k] = v;
    paint();
  },

  sortSeletiva(sort) {
    ui.sortSeletiva = sort;
    paint();
  },

  exportarJSON() {
    const stamp = nowIso().slice(0, 10);
    downloadText(`eixo-${stamp}.json`, JSON.stringify(data, null, 2) + "\n", "application/json;charset=utf-8");
  },

  exportarMD() {
    const stamp = nowIso().slice(0, 10);
    downloadText(`eixo-${stamp}.md`, toMarkdown(data), "text/markdown;charset=utf-8");
  },

  importar() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const incoming = validateImport(text);
        if (!confirm("Substituir o caderno atual por este arquivo? O estado presente só se recupera se houver outra cópia.")) {
          return;
        }
        data = incoming;
        commit(true);
        ui.view = "eixo";
        ui.nodeId = null;
        ui.avisoExportar = { ok: true, msg: `Restaurado: ${data.nodes.length} nós.` };
        paint();
      } catch (err) {
        ui.view = "exportar";
        ui.avisoExportar = { ok: false, msg: "Não foi possível restaurar: " + (err && err.message ? err.message : String(err)) };
        paint();
      }
    });
    input.click();
  },
};

function onKey(e) {
  if (ui.view === "sintese") {
    if (e.key === "Escape") {
      e.preventDefault();
      if (confirm("Encerrar a síntese sem registrar?")) act.sairSintese();
    }
    return;
  }
  const tag = (e.target && e.target.tagName) || "";
  const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable;
  if (e.key === "Escape" && ui.view === "no") {
    e.preventDefault();
    act.nav("eixo");
    return;
  }
  if (typing) return;
  if (e.key === "n" || e.key === "N") {
    e.preventDefault();
    act.novo();
  }
  if (e.key === "/") {
    e.preventDefault();
    act.nav("indice");
    queueMicrotask(() => {
      const el = document.querySelector("[data-act=filtro][data-k=q]");
      if (el) el.focus();
    });
  }
}

async function boot() {
  data = await load();
  try {
    const raw = sessionStorage.getItem("eixo.sintese.rascunho");
    if (raw) {
      const d = JSON.parse(raw);
      if (d && d.id && data.nodes.some((n) => n.id === d.id)) {
        /* rascunho órfão: não reabre o modo trava sozinho após recarregar */
      }
    }
  } catch (_) {
    /* ignore */
  }
  window.addEventListener("keydown", onKey);
  window.addEventListener("beforeunload", () => {
    saveNow(data);
  });
  paint();
}

boot().catch((err) => {
  document.getElementById("app").innerHTML =
    `<main class="main"><p class="err">Falha ao iniciar: ${String(err && err.message ? err.message : err)}</p></main>`;
});
