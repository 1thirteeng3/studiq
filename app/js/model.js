/** Constantes, semente e operações de domínio — sem efeitos colaterais de I/O. */

export const DIM_FISICAS = [
  { id: "entidades", nome: "Entidades / partes constituintes" },
  { id: "propriedades", nome: "Propriedades intrínsecas" },
  { id: "relacoes", nome: "Relações" },
  { id: "dinamica", nome: "Comportamento / dinâmica" },
  { id: "emergencias", nome: "Desdobramentos / emergências" },
];

export const DIM_HUMANAS = [
  { id: "antropologica", nome: "Antropológica" },
  { id: "sociologica", nome: "Sociológica" },
  { id: "historica", nome: "Histórica" },
  { id: "psicologica", nome: "Psicológica" },
  { id: "economica", nome: "Econômica" },
  { id: "epistemica", nome: "Epistêmica" },
  { id: "politica", nome: "Política" },
  { id: "tecnologica", nome: "Tecnológica" },
  { id: "linguistica", nome: "Linguística" },
  { id: "metafisica", nome: "Metafísica" },
  { id: "estetica", nome: "Estética" },
  { id: "teologica", nome: "Teológica" },
];

export const PASSADAS = [
  { id: "nao_iniciado", nome: "Não iniciado" },
  { id: "mapa", nome: "Mapa concluído" },
  { id: "tecido", nome: "Tecido concluído" },
];

export const ENFASES = [
  { id: "fisica", nome: "Física" },
  { id: "humana", nome: "Humana" },
  { id: "transicao", nome: "Transição" },
];

export const UNIDADES = [
  { id: "ga", nome: "Ga (bilhões de anos atrás)" },
  { id: "ma", nome: "Ma (milhões de anos atrás)" },
  { id: "ka", nome: "ka (milhares de anos atrás)" },
  { id: "ac", nome: "a.C." },
  { id: "dc", nome: "d.C." },
];

export const SEED = {
  version: 1,
  meta: {
    app: "eixo",
    metodo: "nos-causais",
    createdAt: "2026-08-28T00:00:00.000Z",
    updatedAt: "2026-08-28T00:00:00.000Z",
  },
  macroperiods: [
    {
      id: "nucleossintese",
      nome: "Nucleossíntese",
      enfase: "fisica",
      tStart: -13786997974,
      tEnd: -4569997974,
      nota: "Partição pedagógica do eixo: do Big Bang à véspera da nebulosa solar. Cobre a nucleossíntese primordial e a longa era da nucleossíntese estelar que produz os elementos pesados.",
    },
    {
      id: "formacao-planetaria",
      nome: "Formação planetária / química pré-biótica",
      nomeCurto: "Formação planetária",
      enfase: "fisica",
      tStart: -4569997974,
      tEnd: -3799997974,
      nota: "Da nebulosa solar e da acreção planetária até a janela da química pré-biótica na Terra precoce, antes das primeiras evidências de vida.",
    },
    {
      id: "evolucao-biologica",
      nome: "Evolução biológica",
      enfase: "fisica",
      tStart: -3799997974,
      tEnd: -6997974,
      nota: "Da origem da vida à ramificação que antecipa o gênero Homo. Ênfase física (entidades, dinâmica, emergências) sobre o tecido biológico.",
    },
    {
      id: "hominizacao",
      nome: "Hominização",
      enfase: "transicao",
      tStart: -6997974,
      tEnd: -297974,
      nota: "Transição de ênfase: dos hominínios ao Homo sapiens. A grade humana começa a ser pertinente; a grade física permanece necessária.",
    },
    {
      id: "paleolitico",
      nome: "Paleolítico",
      enfase: "humana",
      tStart: -297974,
      tEnd: -9974,
      nota: "Corte pedagógico: a partir de Homo sapiens, a ênfase humana passa a dominar. Não coincide com o Paleolítico arqueológico amplo (iniciado ~3,3 Ma).",
    },
    {
      id: "neolitico",
      nome: "Neolítico",
      enfase: "humana",
      tStart: -9974,
      tEnd: -3000,
      nota: "Sedentarização, agricultura, primeiros aglomerados permanentes. Peso crescente das doze dimensões humanas.",
    },
    {
      id: "antiguidade",
      nome: "Antiguidade",
      enfase: "humana",
      tStart: -3000,
      tEnd: 476,
      nota: "Da emergência da escrita e dos primeiros Estados até o marco convencional do fim do Império Romano do Ocidente.",
    },
    {
      id: "idade-media",
      nome: "Idade Média",
      enfase: "humana",
      tStart: 476,
      tEnd: 1453,
      nota: "Marco de abertura: 476. Marco de fecho: 1453 (queda de Constantinopla). Periodização europeia usada como referência de eixo, não como universal.",
    },
    {
      id: "idade-moderna",
      nome: "Idade Moderna",
      enfase: "humana",
      tStart: 1453,
      tEnd: 1789,
      nota: "Da reconfiguração quinhentista à ruptura revolucionária de 1789.",
    },
    {
      id: "idade-contemporanea",
      nome: "Idade Contemporânea",
      nomeCurto: "Contemporânea",
      enfase: "humana",
      tStart: 1789,
      tEnd: null,
      nota: "De 1789 ao presente. O termo final acompanha o ano corrente.",
    },
  ],
  nodes: [],
};

const MESES = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

export function nowIso() {
  return new Date().toISOString();
}

export function anoPresente() {
  return new Date().getFullYear();
}

export function uid(prefix = "n") {
  const a = Date.now().toString(36);
  const b = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${a}_${b}`;
}

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (ch) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch])
  );
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function hydrate(data) {
  const d = clone(data && typeof data === "object" ? data : SEED);
  if (!d.version) d.version = 1;
  if (!d.meta) d.meta = { app: "eixo", metodo: "nos-causais", createdAt: nowIso(), updatedAt: nowIso() };
  if (!Array.isArray(d.macroperiods) || d.macroperiods.length === 0) {
    d.macroperiods = clone(SEED.macroperiods);
  }
  if (!Array.isArray(d.nodes)) d.nodes = [];
  const now = anoPresente();
  for (const p of d.macroperiods) {
    if (p.id === "idade-contemporanea" || p.tEnd == null) p.tEnd = now;
  }
  for (const n of d.nodes) {
    if (!n.mapeamentoCausal) n.mapeamentoCausal = { inicio: "", elos: [], texto: "" };
    if (!Array.isArray(n.mapeamentoCausal.elos)) n.mapeamentoCausal.elos = [];
    if (!Array.isArray(n.dimensoesFisicas)) n.dimensoesFisicas = [];
    if (!Array.isArray(n.dimensoesHumanas)) n.dimensoesHumanas = [];
    if (!Array.isArray(n.fontes)) n.fontes = [];
    if (!Array.isArray(n.sintesesAnteriores)) n.sintesesAnteriores = [];
    if (!n.ancora) n.ancora = { inicio: { valor: "", unidade: "dc" }, fim: { valor: "", unidade: "dc" } };
  }
  return d;
}

export function novoNo(partial = {}) {
  const t = nowIso();
  return {
    id: uid("n"),
    pergunta: "",
    macroperiodId: "",
    tStart: null,
    tEnd: null,
    tLabel: "",
    ancora: { inicio: { valor: "", unidade: "dc" }, fim: { valor: "", unidade: "dc" } },
    enfase: "fisica",
    dimensoesFisicas: [],
    dimensoesHumanas: [],
    mapeamentoCausal: { inicio: "", elos: [], texto: "" },
    notas: "",
    fontes: [],
    passada: "nao_iniciado",
    profundidadeSeletiva: false,
    profundidadeSeletivaEm: null,
    sintese: null,
    sintesesAnteriores: [],
    criadoEm: t,
    atualizadoEm: t,
    ...partial,
  };
}

export function periodoPorId(data, id) {
  return data.macroperiods.find((p) => p.id === id) || null;
}

export function noPorId(data, id) {
  return data.nodes.find((n) => n.id === id) || null;
}

export function nomeEnfase(id) {
  return (ENFASES.find((e) => e.id === id) || { nome: id }).nome;
}

export function nomePassada(id) {
  return (PASSADAS.find((p) => p.id === id) || { nome: id }).nome;
}

export function nomeDimensao(id) {
  const all = [...DIM_FISICAS, ...DIM_HUMANAS];
  return (all.find((d) => d.id === id) || { nome: id }).nome;
}

export function toYearCE(valor, unidade, nowYear = anoPresente()) {
  if (valor === "" || valor == null) return null;
  const v = Number(String(valor).replace(",", "."));
  if (!Number.isFinite(v)) return null;
  switch (unidade) {
    case "ga": return nowYear - v * 1e9;
    case "ma": return nowYear - v * 1e6;
    case "ka": return nowYear - v * 1e3;
    case "ac": return -Math.abs(v);
    case "dc": return v;
    default: return v;
  }
}

export function aplicarAncora(node, nowYear = anoPresente()) {
  const a = node.ancora || { inicio: { valor: "", unidade: "dc" }, fim: { valor: "", unidade: "dc" } };
  node.tStart = toYearCE(a.inicio.valor, a.inicio.unidade, nowYear);
  node.tEnd = toYearCE(a.fim.valor, a.fim.unidade, nowYear);
}

export function formatYear(yearCE, nowYear = anoPresente()) {
  if (yearCE == null || !Number.isFinite(Number(yearCE))) return "presente";
  const y = Number(yearCE);
  const ybp = nowYear - y;
  const num = (n, d) => n.toLocaleString("pt-BR", { maximumFractionDigits: d, minimumFractionDigits: 0 });
  if (ybp >= 0.95e9) return `${num(ybp / 1e9, 2)} Ga`;
  if (ybp >= 0.95e6) return `${num(ybp / 1e6, 2)} Ma`;
  if (ybp >= 10000) return `${num(ybp / 1e3, 1)} ka`;
  if (y < 0) return `${Math.abs(Math.round(y)).toLocaleString("pt-BR")} a.C.`;
  if (y === 0) return "1 a.C.";
  return `${Math.round(y).toLocaleString("pt-BR")} d.C.`;
}

export function formatFaixa(tStart, tEnd, nowYear = anoPresente()) {
  return `${formatYear(tStart, nowYear)} – ${formatYear(tEnd, nowYear)}`;
}

export function formatData(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mon = MESES[d.getMonth()];
  const yy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${dd} ${mon} ${yy}, ${hh}:${mm}`;
}

export function palavras(texto) {
  const t = String(texto || "").trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

export function periodWeights(periods) {
  const logs = periods.map((p) => {
    const span = Math.max(Number(p.tEnd) - Number(p.tStart), 1);
    return Math.log10(span);
  });
  const sum = logs.reduce((a, b) => a + b, 0) || 1;
  const base = 0.054;
  const rest = 1 - base * periods.length;
  return logs.map((l) => base + rest * (l / sum));
}

export function posicaoNoPeriodo(node, period) {
  if (!period) return 0.5;
  const span = Number(period.tEnd) - Number(period.tStart);
  if (!(span > 0)) return 0.5;
  const t = node.tStart != null ? Number(node.tStart) : (Number(period.tStart) + Number(period.tEnd)) / 2;
  const r = (t - Number(period.tStart)) / span;
  return Math.min(0.94, Math.max(0.06, r));
}

export function cobertura(data) {
  const periods = data.macroperiods;
  const nodes = data.nodes;
  const rows = periods.map((p) => {
    const ns = nodes.filter((n) => n.macroperiodId === p.id);
    const temMapa = ns.some((n) => n.passada === "mapa" || n.passada === "tecido");
    const temTecido = ns.some((n) => n.passada === "tecido");
    return {
      id: p.id,
      nome: p.nome,
      enfase: p.enfase,
      tStart: p.tStart,
      tEnd: p.tEnd,
      nos: ns.length,
      temMapa,
      temTecido,
    };
  });
  const nMapa = rows.filter((r) => r.temMapa).length;
  const nTecido = rows.filter((r) => r.temTecido).length;
  const total = rows.length || 1;
  const seletiva = nodes
    .filter((n) => n.profundidadeSeletiva)
    .slice()
    .sort((a, b) => String(b.profundidadeSeletivaEm || "").localeCompare(String(a.profundidadeSeletivaEm || "")));
  return {
    total: rows.length,
    nMapa,
    nTecido,
    pctMapa: nMapa / total,
    pctTecido: nTecido / total,
    rows,
    seletiva,
    nNos: nodes.length,
    nMapaNos: nodes.filter((n) => n.passada === "mapa" || n.passada === "tecido").length,
    nTecidoNos: nodes.filter((n) => n.passada === "tecido").length,
    nSeletiva: seletiva.length,
    nComSintese: nodes.filter((n) => n.sintese && n.sintese.texto).length,
    nAbertas: nodes.filter((n) => n.sintese && String(n.sintese.perguntasAbertas || "").trim()).length,
  };
}

export function filtrarNos(data, filters) {
  const q = String(filters.q || "").trim().toLowerCase();
  return data.nodes.filter((n) => {
    if (q) {
      const blob = [
        n.pergunta,
        n.tLabel,
        n.notas,
        n.mapeamentoCausal && n.mapeamentoCausal.texto,
        n.sintese && n.sintese.texto,
        n.sintese && n.sintese.perguntasAbertas,
      ]
        .filter(Boolean)
        .join("\n")
        .toLowerCase();
      if (!blob.includes(q)) return false;
    }
    if (filters.periodo && n.macroperiodId !== filters.periodo) return false;
    if (filters.passada && n.passada !== filters.passada) return false;
    if (filters.dimensao) {
      const dims = [...(n.dimensoesFisicas || []), ...(n.dimensoesHumanas || [])];
      if (!dims.includes(filters.dimensao)) return false;
    }
    if (filters.abertas === "sim") {
      if (!(n.sintese && String(n.sintese.perguntasAbertas || "").trim())) return false;
    }
    if (filters.abertas === "nao") {
      if (n.sintese && String(n.sintese.perguntasAbertas || "").trim()) return false;
    }
    if (filters.seletiva === "sim" && !n.profundidadeSeletiva) return false;
    if (filters.seletiva === "nao" && n.profundidadeSeletiva) return false;
    return true;
  });
}

export function tituloNo(n) {
  const t = String(n.pergunta || "").trim();
  if (t) return t;
  return "Nó sem pergunta formulada";
}

export function trecho(s, max = 140) {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

function mdEscape(s) {
  return String(s ?? "").replace(/\r\n/g, "\n");
}

export function toMarkdown(data) {
  const nowY = anoPresente();
  const cov = cobertura(data);
  const lines = [];
  lines.push("# Eixo — exportação do caderno de nós causais");
  lines.push("");
  lines.push(`- Gerado em: ${formatData(nowIso())}`);
  lines.push(`- Nós: ${cov.nNos}`);
  lines.push(`- Cobertura Mapa: ${cov.nMapa}/${cov.total} macroperíodos`);
  lines.push(`- Cobertura Tecido: ${cov.nTecido}/${cov.total} macroperíodos`);
  lines.push(`- Candidatos à profundidade seletiva: ${cov.nSeletiva}`);
  lines.push("");
  lines.push("O Sistema registra. Não interpreta.");
  lines.push("");
  for (const p of data.macroperiods) {
    lines.push(`## ${p.nome}`);
    lines.push("");
    lines.push(`- Ênfase dominante: ${nomeEnfase(p.enfase)}`);
    lines.push(`- Faixa: ${formatFaixa(p.tStart, p.tEnd, nowY)}`);
    if (p.nota) lines.push(`- Nota de periodização: ${mdEscape(p.nota)}`);
    lines.push("");
    const ns = data.nodes.filter((n) => n.macroperiodId === p.id);
    if (!ns.length) {
      lines.push("_Nenhum nó neste macroperíodo._");
      lines.push("");
      continue;
    }
    for (const n of ns) {
      lines.push(`### ${tituloNo(n)}`);
      lines.push("");
      lines.push(`- Id: \`${n.id}\``);
      lines.push(`- Ênfase: ${nomeEnfase(n.enfase)}`);
      lines.push(`- Passada: ${nomePassada(n.passada)}`);
      lines.push(`- Profundidade seletiva: ${n.profundidadeSeletiva ? "sim" : "não"}`);
      if (n.profundidadeSeletivaEm) {
        lines.push(`- Marcado em: ${formatData(n.profundidadeSeletivaEm)}`);
      }
      if (n.tLabel) lines.push(`- Rótulo temporal: ${mdEscape(n.tLabel)}`);
      if (n.tStart != null) lines.push(`- Âncora: ${formatYear(n.tStart, nowY)}${n.tEnd != null ? " – " + formatYear(n.tEnd, nowY) : ""}`);
      const df = (n.dimensoesFisicas || []).map(nomeDimensao);
      const dh = (n.dimensoesHumanas || []).map(nomeDimensao);
      lines.push(`- Dimensões físicas: ${df.length ? df.join("; ") : "—"}`);
      lines.push(`- Dimensões humanas: ${dh.length ? dh.join("; ") : "—"}`);
      lines.push("");
      const map = n.mapeamentoCausal || { inicio: "", elos: [], texto: "" };
      lines.push("#### Mapeamento causal");
      lines.push("");
      if (map.inicio || (map.elos && map.elos.length)) {
        if (map.inicio) lines.push(`- Início: ${mdEscape(map.inicio)}`);
        for (const elo of map.elos || []) {
          lines.push(`- via ${mdEscape(elo.via || "—")} → ${mdEscape(elo.para || "—")}`);
        }
        lines.push("");
      }
      if (map.texto) {
        lines.push(mdEscape(map.texto));
        lines.push("");
      }
      if (!map.inicio && !(map.elos && map.elos.length) && !map.texto) {
        lines.push("_Não registrado._");
        lines.push("");
      }
      lines.push("#### Notas de estudo");
      lines.push("");
      lines.push(n.notas ? mdEscape(n.notas) : "_Nenhuma._");
      lines.push("");
      lines.push("#### Fontes");
      lines.push("");
      if (!n.fontes || !n.fontes.length) {
        lines.push("_Nenhuma._");
        lines.push("");
      } else {
        for (const f of n.fontes) {
          lines.push(`- ${mdEscape(f.referencia || "")}${f.notas ? " — " + mdEscape(f.notas) : ""}`);
        }
        lines.push("");
      }
      lines.push("#### Síntese sem consulta");
      lines.push("");
      if (n.sintese && (n.sintese.texto || n.sintese.perguntasAbertas)) {
        lines.push(`- Escrita em: ${formatData(n.sintese.escritoEm)}`);
        lines.push(`- Palavras: ${n.sintese.palavras ?? palavras(n.sintese.texto)}`);
        lines.push("");
        lines.push(mdEscape(n.sintese.texto || ""));
        lines.push("");
        lines.push("##### Perguntas em aberto");
        lines.push("");
        lines.push(mdEscape(n.sintese.perguntasAbertas || ""));
        lines.push("");
      } else {
        lines.push("_Ainda não escrita._");
        lines.push("");
      }
      if (n.sintesesAnteriores && n.sintesesAnteriores.length) {
        lines.push("#### Sínteses anteriores");
        lines.push("");
        for (const s of n.sintesesAnteriores) {
          lines.push(`- ${formatData(s.escritoEm)} · ${s.palavras ?? palavras(s.texto)} palavras`);
          lines.push("");
          lines.push(mdEscape(s.texto || ""));
          lines.push("");
          lines.push("Perguntas em aberto:");
          lines.push("");
          lines.push(mdEscape(s.perguntasAbertas || ""));
          lines.push("");
        }
      }
    }
  }
  lines.push("---");
  lines.push("");
  lines.push("Fim da exportação.");
  lines.push("");
  return lines.join("\n");
}

export function validateImport(raw) {
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!data || typeof data !== "object") throw new Error("arquivo vazio");
  if (data.version !== 1) throw new Error("versão não reconhecida (esperado version: 1)");
  if (!Array.isArray(data.macroperiods)) throw new Error("macroperiods ausente");
  if (!Array.isArray(data.nodes)) throw new Error("nodes ausente");
  return hydrate(data);
}

export const FILTER_VAZIO = {
  q: "",
  periodo: "",
  passada: "",
  dimensao: "",
  abertas: "",
  seletiva: "",
};
