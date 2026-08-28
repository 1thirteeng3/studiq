import {
  DIM_FISICAS,
  DIM_HUMANAS,
  PASSADAS,
  ENFASES,
  UNIDADES,
  esc,
  formatFaixa,
  formatYear,
  formatData,
  anoPresente,
  nomeEnfase,
  nomePassada,
  nomeDimensao,
  tituloNo,
  trecho,
  palavras,
  periodWeights,
  posicaoNoPeriodo,
  cobertura,
  filtrarNos,
  periodoPorId,
} from "./model.js";

export function render(root, ctx) {
  if (ctx.ui.view === "sintese") {
    root.innerHTML = drawSintese(ctx);
  } else {
    root.innerHTML = drawShell(ctx);
  }
  bind(root, ctx);
}

function drawShell(ctx) {
  const wide = ctx.ui.view === "eixo";
  return `
    <div class="shell">
      <header class="top">
        <div class="brand">
          <p class="brand-name">Eixo</p>
          <p class="brand-sub">um só tecido causal · Big Bang → presente</p>
        </div>
        <nav class="nav">
          ${navBtn(ctx, "eixo", "Eixo")}
          ${navBtn(ctx, "cobertura", "Cobertura")}
          ${navBtn(ctx, "indice", "Índice")}
          ${navBtn(ctx, "exportar", "Exportar")}
          <button class="btn" data-act="novo">Registrar nó</button>
        </nav>
      </header>
      <main class="main ${wide ? "is-wide" : ""}">
        ${drawView(ctx)}
      </main>
      <footer class="foot">
        <span>${esc(footLeft(ctx))}</span>
        <span>${esc(footRight(ctx))}</span>
      </footer>
    </div>
  `;
}

function navBtn(ctx, view, label) {
  return `<button class="nav-link ${ctx.ui.view === view ? "is-on" : ""}" data-act="nav" data-view="${view}">${label}</button>`;
}

function footLeft(ctx) {
  const n = ctx.data.nodes.length;
  const lugar = ctx.persistencia === "arquivo" ? "arquivo local data/eixo.json" : "armazenamento deste navegador";
  return `${n} ${n === 1 ? "nó" : "nós"} · ${lugar}`;
}

function footRight(ctx) {
  return `atualizado ${formatData(ctx.data.meta && ctx.data.meta.updatedAt)}`;
}

function drawView(ctx) {
  switch (ctx.ui.view) {
    case "eixo": return drawEixo(ctx);
    case "no": return drawNo(ctx);
    case "cobertura": return drawCobertura(ctx);
    case "indice": return drawIndice(ctx);
    case "exportar": return drawExportar(ctx);
    default: return drawEixo(ctx);
  }
}

function markClass(enfase) {
  if (enfase === "humana") return "humana";
  if (enfase === "transicao") return "transicao";
  return "fisica";
}

function drawEixo(ctx) {
  const nowY = anoPresente();
  const periods = ctx.data.macroperiods;
  const weights = periodWeights(periods);
  const cols = periods.map((p, i) => {
    const nos = ctx.data.nodes.filter((n) => n.macroperiodId === p.id);
    const marks = nos.map((n) => {
      const left = (posicaoNoPeriodo(n, p) * 100).toFixed(2);
      return `<button class="mark ${markClass(n.enfase)}" style="left:${left}%"
        data-act="abrir" data-id="${esc(n.id)}"
        title="${esc(tituloNo(n))}"></button>`;
    }).join("");
    return `
      <div class="period is-${esc(p.enfase)}" style="flex:${weights[i].toFixed(4)} 1 0%" data-period="${esc(p.id)}">
        <div class="period-kicker">${esc(nomeEnfase(p.enfase))}</div>
        <h2 class="period-name">${esc(p.nomeCurto || p.nome)}</h2>
        <div class="period-time">${esc(formatFaixa(p.tStart, p.tEnd, nowY))}</div>
        <div class="period-track">${marks}</div>
        <button class="period-add" data-act="novo-periodo" data-period="${esc(p.id)}">+ nó</button>
      </div>
    `;
  }).join("");

  const grupos = periods.map((p) => {
    const nos = ctx.data.nodes.filter((n) => n.macroperiodId === p.id);
    const rows = nos.length
      ? nos.map((n) => `
          <button class="row" data-act="abrir" data-id="${esc(n.id)}">
            <span class="row-mark ${markClass(n.enfase)}"></span>
            <span class="row-q">${esc(tituloNo(n))}</span>
            <span class="row-side">${esc(n.tLabel || formatYear(n.tStart, nowY))}</span>
            <span class="row-side">${esc(nomePassada(n.passada))}${n.profundidadeSeletiva ? " · seletiva" : ""}</span>
          </button>
        `).join("")
      : `<p class="empty">Nenhum nó neste trecho.</p>`;
    return `
      <section class="grupo">
        <div class="grupo-head">
          <h2>${esc(p.nome)}</h2>
          <div class="grupo-meta">${esc(nomeEnfase(p.enfase))} · ${esc(formatFaixa(p.tStart, p.tEnd, nowY))} · ${nos.length} ${nos.length === 1 ? "nó" : "nós"}</div>
        </div>
        ${rows}
      </section>
    `;
  }).join("");

  return `
    <div class="axis-wrap">
      <div class="axis-meta">
        <p class="axis-title">Eixo temporal único</p>
        <span class="hint">Física e humana no mesmo eixo. Clique num marco para abrir o nó; + nó para registrar neste trecho.</span>
      </div>
      <div class="axis-ends"><span>Big Bang</span><span>presente</span></div>
      <div class="axis">${cols}</div>
      <div class="legend">
        <span><i class="l-f"></i>física</span>
        <span><i class="l-h"></i>humana</span>
        <span><i class="l-t"></i>transição</span>
      </div>
    </div>
    ${grupos}
  `;
}

function miniAxis(ctx, currentId) {
  const weights = periodWeights(ctx.data.macroperiods);
  return `<div class="mini-axis" title="posição no eixo">
    ${ctx.data.macroperiods.map((p, i) => `
      <div class="mini-seg is-${esc(p.enfase)} ${p.id === currentId ? "is-on" : ""}"
        style="flex:${weights[i].toFixed(4)} 1 0%"></div>
    `).join("")}
  </div>`;
}

function drawNo(ctx) {
  const n = ctx.data.nodes.find((x) => x.id === ctx.ui.nodeId);
  if (!n) {
    return `<p class="lede">Nó não encontrado.</p><button class="btn" data-act="nav" data-view="eixo">Voltar ao eixo</button>`;
  }
  const p = periodoPorId(ctx.data, n.macroperiodId);
  const nowY = anoPresente();
  const ancora = n.ancora || { inicio: { valor: "", unidade: "dc" }, fim: { valor: "", unidade: "dc" } };

  const optsP = ctx.data.macroperiods.map((mp) =>
    `<option value="${esc(mp.id)}" ${mp.id === n.macroperiodId ? "selected" : ""}>${esc(mp.nome)}</option>`
  ).join("");
  const optsE = ENFASES.map((e) =>
    `<option value="${esc(e.id)}" ${e.id === n.enfase ? "selected" : ""}>${esc(e.nome)}</option>`
  ).join("");
  const optsU = (sel) => UNIDADES.map((u) =>
    `<option value="${esc(u.id)}" ${u.id === sel ? "selected" : ""}>${esc(u.nome)}</option>`
  ).join("");

  const checksF = DIM_FISICAS.map((d) => `
    <label class="check">
      <input type="checkbox" data-act="dim-f" value="${esc(d.id)}" ${n.dimensoesFisicas.includes(d.id) ? "checked" : ""}>
      <span>${esc(d.nome)}</span>
    </label>
  `).join("");
  const checksH = DIM_HUMANAS.map((d) => `
    <label class="check">
      <input type="checkbox" data-act="dim-h" value="${esc(d.id)}" ${n.dimensoesHumanas.includes(d.id) ? "checked" : ""}>
      <span>${esc(d.nome)}</span>
    </label>
  `).join("");

  const map = n.mapeamentoCausal || { inicio: "", elos: [], texto: "" };
  const elos = (map.elos || []).map((elo, i) => `
    <div class="elo">
      <div class="via-arrow">via</div>
      <input type="text" data-act="elo-via" data-i="${i}" value="${esc(elo.via || "")}" placeholder="mecanismo intermediário">
      <div class="via-arrow">leva a</div>
      <input type="text" data-act="elo-para" data-i="${i}" value="${esc(elo.para || "")}" placeholder="efeito">
      <button class="btn-quiet" data-act="elo-rm" data-i="${i}" type="button">retirar elo</button>
    </div>
  `).join("");

  const fontes = (n.fontes || []).map((f, i) => `
    <div class="fonte-row">
      <input type="text" data-act="fonte-ref" data-i="${i}" value="${esc(f.referencia || "")}" placeholder="referência">
      <input type="text" data-act="fonte-notas" data-i="${i}" value="${esc(f.notas || "")}" placeholder="nota (ocultada na síntese)">
      <button class="btn-quiet" data-act="fonte-rm" data-i="${i}" type="button">retirar</button>
    </div>
  `).join("");

  const radios = PASSADAS.map((ps) => `
    <label class="radio">
      <input type="radio" name="passada" data-act="passada" value="${esc(ps.id)}" ${n.passada === ps.id ? "checked" : ""}>
      <span>${esc(ps.nome)}</span>
    </label>
  `).join("");

  let sinteseBloco = `<p class="hint">Ainda não há síntese sem consulta neste nó.</p>`;
  if (n.sintese && (n.sintese.texto || n.sintese.perguntasAbertas)) {
    sinteseBloco = `
      <p class="hint">Registrada em ${esc(formatData(n.sintese.escritoEm))} · ${n.sintese.palavras ?? palavras(n.sintese.texto)} palavras.</p>
      <p class="lede" style="font-family:var(--font-serif)">${esc(trecho(n.sintese.texto, 280))}</p>
      <p class="hint"><strong>Perguntas em aberto.</strong> ${esc(trecho(n.sintese.perguntasAbertas, 240))}</p>
    `;
  }

  return `
    <p class="crumb">
      <button type="button" data-act="nav" data-view="eixo">Eixo</button>
      · ${esc(p ? p.nome : "sem macroperíodo")}
    </p>
    ${miniAxis(ctx, n.macroperiodId)}
    <div class="view-head">
      <div>
        <div class="label">Nó causal</div>
        <h1 class="h-serif" style="font-size:1.6rem">${esc(trecho(tituloNo(n), 90))}</h1>
      </div>
      <button class="btn-quiet btn-danger" data-act="apagar" type="button">Apagar nó</button>
    </div>

    <div class="form-grid">
      <div class="field">
        <label class="label" for="pergunta">Formulação da pergunta causal</label>
        <textarea id="pergunta" class="pergunta" data-act="campo" data-k="pergunta"
          placeholder="Como X leva a Y através de quais mecanismos intermediários Z?">${esc(n.pergunta)}</textarea>
        <p class="hint">Unidade mínima de estudo. Não é um tópico nem uma matéria — é uma pergunta explicativa sobre o tecido causal.</p>
      </div>

      <div class="panel">
        <div class="label">Posição no eixo</div>
        <div class="split">
          <div class="field">
            <label class="label" for="macro">Macroperíodo</label>
            <select id="macro" data-act="macro">${optsP}</select>
          </div>
          <div class="field">
            <label class="label" for="enfase">Ênfase</label>
            <select id="enfase" data-act="campo" data-k="enfase">${optsE}</select>
          </div>
        </div>
        <div class="split-3" style="margin-top:0.8rem">
          <div class="field">
            <label class="label">Âncora (início, opcional)</label>
            <div class="inline-fields">
              <input type="text" data-act="ancora" data-which="inicio" data-part="valor" value="${esc(ancora.inicio.valor)}" placeholder="13,8">
              <select data-act="ancora" data-which="inicio" data-part="unidade">${optsU(ancora.inicio.unidade)}</select>
            </div>
          </div>
          <div class="field">
            <label class="label">Âncora (fim, opcional)</label>
            <div class="inline-fields">
              <input type="text" data-act="ancora" data-which="fim" data-part="valor" value="${esc(ancora.fim.valor)}" placeholder="">
              <select data-act="ancora" data-which="fim" data-part="unidade">${optsU(ancora.fim.unidade)}</select>
            </div>
          </div>
          <div class="field">
            <label class="label" for="tlabel">Rótulo livre</label>
            <input id="tlabel" type="text" data-act="campo" data-k="tLabel" value="${esc(n.tLabel)}" placeholder="ex. 1347–1351, SN 1054">
          </div>
        </div>
        <p class="hint" style="margin-top:0.7rem">
          ${p ? `Faixa do macroperíodo: ${esc(formatFaixa(p.tStart, p.tEnd, nowY))}. ` : ""}
          Sem âncora, o marco assenta no meio do macroperíodo.
        </p>
      </div>

      <div>
        <div class="label">Grade física — checklist de completude, não de preenchimento obrigatório</div>
        <div class="check-grid">${checksF}</div>
      </div>
      <div>
        <div class="label">Grade humana — pertinente a partir da hominização; peso crescente desde o Neolítico</div>
        <div class="check-grid">${checksH}</div>
      </div>

      <div class="panel">
        <div class="label">Mapeamento causal</div>
        <p class="hint">Cadeia causa → mecanismo → efeito. Vazio é lícito na passada 1 (Mapa).</p>
        <div class="chain" style="margin-top:0.7rem">
          <div class="chain-start">
            <div class="via-arrow">início</div>
            <input type="text" data-act="map-inicio" value="${esc(map.inicio || "")}" placeholder="X — o ponto de partida da cadeia">
          </div>
          ${elos}
        </div>
        <div class="toolbar">
          <button class="btn" type="button" data-act="elo-add">Acrescentar elo</button>
        </div>
        <div class="field" style="margin-top:0.9rem">
          <label class="label" for="maptexto">Nota sobre o mapeamento</label>
          <textarea id="maptexto" data-act="map-texto">${esc(map.texto || "")}</textarea>
        </div>
      </div>

      <div class="field">
        <label class="label" for="notas">Notas de estudo (ocultadas durante a síntese)</label>
        <textarea id="notas" class="tall" data-act="campo" data-k="notas">${esc(n.notas || "")}</textarea>
      </div>

      <div class="panel">
        <div class="label">Fontes e anexos de referência (ocultados durante a síntese)</div>
        ${fontes || `<p class="empty">Nenhuma fonte.</p>`}
        <div class="toolbar">
          <button class="btn" type="button" data-act="fonte-add">Acrescentar fonte</button>
        </div>
      </div>

      <div class="panel">
        <div class="label">Status por passada</div>
        <div class="pass-row">${radios}</div>
        <label class="check" style="margin-top:0.9rem">
          <input type="checkbox" data-act="seletiva" ${n.profundidadeSeletiva ? "checked" : ""}>
          <span>Candidato à profundidade seletiva (passada 3)</span>
        </label>
        <p class="hint">O critério principal de seleção para a passada 3 são as perguntas em aberto da síntese. A marcação é julgamento seu — o Sistema não a infere.</p>
      </div>

      <div class="panel">
        <div class="label">Síntese sem consulta</div>
        ${sinteseBloco}
        <div class="toolbar">
          <button class="btn btn-ink" type="button" data-act="sintese">Escrever síntese sem consulta</button>
        </div>
        <p class="hint">O modo de escrita oculta notas, fontes e o mapeamento deste nó. Timestamp automático no registro.</p>
      </div>
    </div>
  `;
}

function drawSintese(ctx) {
  const n = ctx.data.nodes.find((x) => x.id === ctx.ui.nodeId);
  const draft = ctx.ui.sintese || { texto: "", perguntas: "" };
  const p = n ? periodoPorId(ctx.data, n.macroperiodId) : null;
  const wc = palavras(draft.texto);
  const faixa = "o método pede 300–800 palavras — o Sistema não recusa fora da faixa";
  return `
    <div class="shell">
      <div class="lockbar">
        <div>
          <h1>Síntese sem consulta</h1>
          <p>Notas, fontes e mapeamento causal deste nó estão ocultos. Não há acesso a outros nós. A síntese reconstrói de memória: o nó, as dimensões mobilizadas, a cadeia causal, as perguntas em aberto.</p>
        </div>
        <div class="lock-actions">
          <button class="btn" type="button" data-act="sintese-cancelar">Encerrar sem registrar</button>
          <button class="btn btn-ink" type="button" data-act="sintese-salvar">Registrar síntese</button>
        </div>
      </div>
      <div class="sintese">
        <p class="sintese-q">${esc(n ? tituloNo(n) : "")}</p>
        <p class="sintese-meta">${esc(p ? p.nome : "")}${n && n.tLabel ? " · " + esc(n.tLabel) : ""} · ênfase ${esc(n ? nomeEnfase(n.enfase) : "")}</p>
        <label class="label" for="sin-texto">Reconstrução</label>
        <textarea id="sin-texto" data-act="sin-texto" placeholder="Sem consultar. Reconstrua o nó causal, as dimensões mobilizadas e a cadeia completa.">${esc(draft.texto)}</textarea>
        <p class="wordfact">${wc} ${wc === 1 ? "palavra" : "palavras"} · ${faixa}</p>
        <div class="sintese-block">
          <label class="label" for="sin-abertas">Perguntas em aberto (obrigatório)</label>
          <textarea id="sin-abertas" class="abertas" data-act="sin-abertas" placeholder="O que permanece inexplicado, tenso ou duvidoso. Critério principal para a passada 3.">${esc(draft.perguntas)}</textarea>
        </div>
        <p class="err" data-role="sin-err" hidden></p>
      </div>
    </div>
  `;
}

function pct(x) {
  return Math.round(x * 100) + "%";
}

function drawCobertura(ctx) {
  const c = cobertura(ctx.data);
  const nowY = anoPresente();
  const rows = c.rows.map((r) => `
    <tr>
      <td>${esc(r.nome)}</td>
      <td>${esc(nomeEnfase(r.enfase))}</td>
      <td>${esc(formatFaixa(r.tStart, r.tEnd, nowY))}</td>
      <td>${r.nos}</td>
      <td><span class="dot ${r.temMapa ? "on" : ""}"></span>${r.temMapa ? "sim" : "não"}</td>
      <td><span class="dot ${r.temTecido ? "on" : ""}"></span>${r.temTecido ? "sim" : "não"}</td>
    </tr>
  `).join("");

  const sort = ctx.ui.sortSeletiva || "data";
  let lista = c.seletiva.slice();
  if (sort === "periodo") {
    const order = Object.fromEntries(ctx.data.macroperiods.map((p, i) => [p.id, i]));
    lista.sort((a, b) => (order[a.macroperiodId] ?? 99) - (order[b.macroperiodId] ?? 99));
  }
  const seletiva = lista.length
    ? lista.map((n) => {
        const p = periodoPorId(ctx.data, n.macroperiodId);
        return `
          <button class="row" data-act="abrir" data-id="${esc(n.id)}">
            <span class="row-mark ${markClass(n.enfase)}"></span>
            <span class="row-q">${esc(tituloNo(n))}</span>
            <span class="row-side">${esc(p ? p.nome : "")}</span>
            <span class="row-side">${esc(formatData(n.profundidadeSeletivaEm))}</span>
          </button>
        `;
      }).join("")
    : `<p class="empty">Nenhum nó marcado para profundidade seletiva.</p>`;

  return `
    <div class="label">Cobertura do eixo</div>
    <h1 class="h-serif" style="font-size:1.8rem">Três passadas, um eixo</h1>
    <p class="lede">O percentual mede a fração de macroperíodos com ao menos um nó na passada — cobertura estrutural do eixo, não duração física, não pontuação.</p>
    <div class="facts">
      <div class="fact">
        <div class="label">Passada 1 — Mapa</div>
        <b>${c.nMapa} / ${c.total}</b>
        <p class="hint">${pct(c.pctMapa)} dos macroperíodos com ao menos um nó em mapa ou tecido. ${c.nMapaNos} ${c.nMapaNos === 1 ? "nó" : "nós"} nesse limiar.</p>
      </div>
      <div class="fact">
        <div class="label">Passada 2 — Tecido</div>
        <b>${c.nTecido} / ${c.total}</b>
        <p class="hint">${pct(c.pctTecido)} dos macroperíodos com ao menos um nó em tecido. ${c.nTecidoNos} ${c.nTecidoNos === 1 ? "nó" : "nós"} nesse limiar.</p>
      </div>
    </div>
    <table class="cov-table">
      <thead>
        <tr>
          <th>Macroperíodo</th>
          <th>Ênfase</th>
          <th>Faixa</th>
          <th>Nós</th>
          <th>Mapa</th>
          <th>Tecido</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="label">Passada 3 — profundidade seletiva</div>
    <h2 class="h-serif">${c.nSeletiva} ${c.nSeletiva === 1 ? "nó marcado" : "nós marcados"}</h2>
    <p class="hint">Lista viva. Modo permanente, sem fim previsto. Aplicar só onde a passada 2 gerou tensão explicativa ou dúvida genuína.</p>
    <div class="sort">
      <span>ordenar por</span>
      <button class="nav-link ${sort === "data" ? "is-on" : ""}" data-act="sort-sel" data-sort="data">data da marcação</button>
      <button class="nav-link ${sort === "periodo" ? "is-on" : ""}" data-act="sort-sel" data-sort="periodo">macroperíodo</button>
    </div>
    <div class="list-seletiva">${seletiva}</div>
  `;
}

function drawIndice(ctx) {
  const f = ctx.ui.filters;
  const nos = filtrarNos(ctx.data, f);
  const nowY = anoPresente();
  const optP = [`<option value="">todos os macroperíodos</option>`]
    .concat(ctx.data.macroperiods.map((p) => `<option value="${esc(p.id)}" ${f.periodo === p.id ? "selected" : ""}>${esc(p.nome)}</option>`))
    .join("");
  const optPass = [`<option value="">todas as passadas</option>`]
    .concat(PASSADAS.map((p) => `<option value="${esc(p.id)}" ${f.passada === p.id ? "selected" : ""}>${esc(p.nome)}</option>`))
    .join("");
  const optDim = [`<option value="">qualquer dimensão</option>`]
    .concat(
      [`<option disabled>—— física ——</option>`],
      DIM_FISICAS.map((d) => `<option value="${esc(d.id)}" ${f.dimensao === d.id ? "selected" : ""}>${esc(d.nome)}</option>`),
      [`<option disabled>—— humana ——</option>`],
      DIM_HUMANAS.map((d) => `<option value="${esc(d.id)}" ${f.dimensao === d.id ? "selected" : ""}>${esc(d.nome)}</option>`),
    )
    .join("");

  const lista = nos.length
    ? nos.map((n) => {
        const p = periodoPorId(ctx.data, n.macroperiodId);
        const dims = [...(n.dimensoesFisicas || []), ...(n.dimensoesHumanas || [])]
          .map(nomeDimensao)
          .slice(0, 4)
          .join(" · ");
        const abertas = n.sintese && String(n.sintese.perguntasAbertas || "").trim();
        return `
          <button class="row" data-act="abrir" data-id="${esc(n.id)}">
            <span class="row-mark ${markClass(n.enfase)}"></span>
            <span class="row-q">${esc(tituloNo(n))}</span>
            <span class="row-side">${esc(p ? p.nome : "")}${dims ? " · " + esc(dims) : ""}</span>
            <span class="row-side">${esc(nomePassada(n.passada))}${abertas ? " · perguntas abertas" : ""}${n.profundidadeSeletiva ? " · seletiva" : ""}</span>
          </button>
        `;
      }).join("")
    : `<p class="empty">Nenhum nó corresponde aos filtros.</p>`;

  return `
    <div class="label">Índice</div>
    <h1 class="h-serif" style="font-size:1.8rem">Busca e filtro</h1>
    <p class="lede">Filtrar por dimensão, macroperíodo, passada, perguntas em aberto e profundidade seletiva.</p>
    <div class="filters">
      <div class="field">
        <label class="label">Texto</label>
        <input type="text" data-act="filtro" data-k="q" value="${esc(f.q)}" placeholder="pergunta, notas, síntese…">
      </div>
      <div class="field">
        <label class="label">Macroperíodo</label>
        <select data-act="filtro" data-k="periodo">${optP}</select>
      </div>
      <div class="field">
        <label class="label">Passada</label>
        <select data-act="filtro" data-k="passada">${optPass}</select>
      </div>
      <div class="field">
        <label class="label">Dimensão</label>
        <select data-act="filtro" data-k="dimensao">${optDim}</select>
      </div>
      <div class="field">
        <label class="label">Perguntas em aberto</label>
        <select data-act="filtro" data-k="abertas">
          <option value="" ${f.abertas === "" ? "selected" : ""}>todas</option>
          <option value="sim" ${f.abertas === "sim" ? "selected" : ""}>com</option>
          <option value="nao" ${f.abertas === "nao" ? "selected" : ""}>sem</option>
        </select>
      </div>
      <div class="field">
        <label class="label">Profundidade seletiva</label>
        <select data-act="filtro" data-k="seletiva">
          <option value="" ${f.seletiva === "" ? "selected" : ""}>todas</option>
          <option value="sim" ${f.seletiva === "sim" ? "selected" : ""}>marcados</option>
          <option value="nao" ${f.seletiva === "nao" ? "selected" : ""}>não marcados</option>
        </select>
      </div>
    </div>
    <p class="count-line">${nos.length} ${nos.length === 1 ? "nó" : "nós"}</p>
    ${lista}
  `;
}

function drawExportar(ctx) {
  const aviso = ctx.ui.avisoExportar
    ? `<p class="${ctx.ui.avisoExportar.ok ? "ok" : "err"}">${esc(ctx.ui.avisoExportar.msg)}</p>`
    : "";
  return `
    <div class="label">Exportação e portabilidade</div>
    <h1 class="h-serif" style="font-size:1.8rem">Os dados são seus, em texto plano</h1>
    <p class="lede">Nenhuma conta, nenhum formato proprietário. JSON é a cópia integral restaurável. Markdown é a leitura humana do caderno.</p>
    <div class="export-grid">
      <div class="panel">
        <div class="label">Exportar</div>
        <p class="hint">Baixa um arquivo para o lugar que você escolher. Guarde cópias fora deste aparelho.</p>
        <div class="toolbar">
          <button class="btn btn-ink" type="button" data-act="dl-json">Baixar JSON</button>
          <button class="btn" type="button" data-act="dl-md">Baixar Markdown</button>
        </div>
      </div>
      <div class="panel">
        <div class="label">Restaurar cópia</div>
        <p class="hint">Substitui o caderno atual pelo conteúdo de um JSON previamente exportado.</p>
        <div class="toolbar">
          <button class="btn" type="button" data-act="importar">Escolher arquivo JSON</button>
        </div>
        ${aviso}
      </div>
    </div>
    <p class="hint" style="margin-top:1.4rem">
      Com o servidor local, a fonte de verdade é <span style="font-family:var(--font-mono)">data/eixo.json</span> — versionável em git, legível num editor de texto.
      Este navegador guarda uma cópia de reserva.
    </p>
  `;
}

function currentNode(ctx) {
  return ctx.data.nodes.find((x) => x.id === ctx.ui.nodeId) || null;
}

function bind(root, ctx) {
  const { act } = ctx;

  root.querySelectorAll("[data-act=nav]").forEach((el) => {
    el.addEventListener("click", () => act.nav(el.getAttribute("data-view")));
  });
  root.querySelectorAll("[data-act=novo]").forEach((el) => {
    el.addEventListener("click", () => act.novo());
  });
  root.querySelectorAll("[data-act=novo-periodo]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      act.novo(el.getAttribute("data-period"));
    });
  });
  root.querySelectorAll("[data-act=abrir]").forEach((el) => {
    el.addEventListener("click", () => act.abrir(el.getAttribute("data-id")));
  });
  root.querySelectorAll("[data-act=apagar]").forEach((el) => {
    el.addEventListener("click", () => {
      if (confirm("Apagar este nó? A ação não se desfaz, salvo se houver cópia exportada.")) act.apagar();
    });
  });
  root.querySelectorAll("[data-act=sintese]").forEach((el) => {
    el.addEventListener("click", () => act.entrarSintese());
  });
  root.querySelectorAll("[data-act=sintese-cancelar]").forEach((el) => {
    el.addEventListener("click", () => {
      if (!ctx.ui.sintese || (!ctx.ui.sintese.texto && !ctx.ui.sintese.perguntas) || confirm("Encerrar sem registrar a síntese?")) {
        act.sairSintese(false);
      }
    });
  });
  root.querySelectorAll("[data-act=sintese-salvar]").forEach((el) => {
    el.addEventListener("click", () => {
      const err = root.querySelector("[data-role=sin-err]");
      const r = act.salvarSintese();
      if (r && r.erro && err) {
        err.hidden = false;
        err.textContent = r.erro;
      }
    });
  });
  root.querySelectorAll("[data-act=sin-texto]").forEach((el) => {
    el.addEventListener("input", () => {
      act.rascunhoSintese({ texto: el.value });
      const fact = root.querySelector(".wordfact");
      if (fact) {
        const wc = palavras(el.value);
        fact.innerHTML = `${wc} ${wc === 1 ? "palavra" : "palavras"} · o método pede 300–800 palavras — o Sistema não recusa fora da faixa`;
      }
    });
  });
  root.querySelectorAll("[data-act=sin-abertas]").forEach((el) => {
    el.addEventListener("input", () => act.rascunhoSintese({ perguntas: el.value }));
  });

  const n = currentNode(ctx);
  if (n && ctx.ui.view === "no") {
    root.querySelectorAll("[data-act=campo]").forEach((el) => {
      el.addEventListener("input", () => act.patch({ [el.getAttribute("data-k")]: el.value }));
      el.addEventListener("change", () => act.patch({ [el.getAttribute("data-k")]: el.value }));
    });
    root.querySelectorAll("[data-act=macro]").forEach((el) => {
      el.addEventListener("change", () => act.setMacro(el.value));
    });
    root.querySelectorAll("[data-act=ancora]").forEach((el) => {
      const handler = () => {
        const which = el.getAttribute("data-which");
        const part = el.getAttribute("data-part");
        act.patchAncora(which, part, el.value);
      };
      el.addEventListener("input", handler);
      el.addEventListener("change", handler);
    });
    root.querySelectorAll("[data-act=dim-f]").forEach((el) => {
      el.addEventListener("change", () => act.toggleDim("dimensoesFisicas", el.value, el.checked));
    });
    root.querySelectorAll("[data-act=dim-h]").forEach((el) => {
      el.addEventListener("change", () => act.toggleDim("dimensoesHumanas", el.value, el.checked));
    });
    root.querySelectorAll("[data-act=map-inicio]").forEach((el) => {
      el.addEventListener("input", () => act.patchMap({ inicio: el.value }));
    });
    root.querySelectorAll("[data-act=map-texto]").forEach((el) => {
      el.addEventListener("input", () => act.patchMap({ texto: el.value }));
    });
    root.querySelectorAll("[data-act=elo-via]").forEach((el) => {
      el.addEventListener("input", () => act.patchElo(+el.getAttribute("data-i"), { via: el.value }));
    });
    root.querySelectorAll("[data-act=elo-para]").forEach((el) => {
      el.addEventListener("input", () => act.patchElo(+el.getAttribute("data-i"), { para: el.value }));
    });
    root.querySelectorAll("[data-act=elo-add]").forEach((el) => {
      el.addEventListener("click", () => act.addElo());
    });
    root.querySelectorAll("[data-act=elo-rm]").forEach((el) => {
      el.addEventListener("click", () => act.rmElo(+el.getAttribute("data-i")));
    });
    root.querySelectorAll("[data-act=fonte-ref]").forEach((el) => {
      el.addEventListener("input", () => act.patchFonte(+el.getAttribute("data-i"), { referencia: el.value }));
    });
    root.querySelectorAll("[data-act=fonte-notas]").forEach((el) => {
      el.addEventListener("input", () => act.patchFonte(+el.getAttribute("data-i"), { notas: el.value }));
    });
    root.querySelectorAll("[data-act=fonte-add]").forEach((el) => {
      el.addEventListener("click", () => act.addFonte());
    });
    root.querySelectorAll("[data-act=fonte-rm]").forEach((el) => {
      el.addEventListener("click", () => act.rmFonte(+el.getAttribute("data-i")));
    });
    root.querySelectorAll("[data-act=passada]").forEach((el) => {
      el.addEventListener("change", () => act.patch({ passada: el.value }));
    });
    root.querySelectorAll("[data-act=seletiva]").forEach((el) => {
      el.addEventListener("change", () => act.setSeletiva(el.checked));
    });
  }

  root.querySelectorAll("[data-act=filtro]").forEach((el) => {
    const fire = () => act.setFiltro(el.getAttribute("data-k"), el.value);
    el.addEventListener("input", fire);
    el.addEventListener("change", fire);
  });
  root.querySelectorAll("[data-act=sort-sel]").forEach((el) => {
    el.addEventListener("click", () => act.sortSeletiva(el.getAttribute("data-sort")));
  });
  root.querySelectorAll("[data-act=dl-json]").forEach((el) => {
    el.addEventListener("click", () => act.exportarJSON());
  });
  root.querySelectorAll("[data-act=dl-md]").forEach((el) => {
    el.addEventListener("click", () => act.exportarMD());
  });
  root.querySelectorAll("[data-act=importar]").forEach((el) => {
    el.addEventListener("click", () => act.importar());
  });
}
