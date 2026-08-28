# Como operar o Sistema

O tempo gasto aqui não deve competir com o tempo de estudo. Quatro gestos cobrem o ciclo do método.

## 1. Criar um nó causal

No eixo, clique **Registrar nó** ou **+ nó** sobre o macroperíodo pertinente.

A unidade é uma pergunta do tipo *como X leva a Y através de quais mecanismos intermediários Z?* — não um título de matéria.

Marque, se couber, categorias da grade física e dimensões da grade humana. Não é obrigatório marcar todas; a grade é lembrete de completude. Um nó de nucleossíntese pode ignorar a grade humana; um nó neolítico raramente ignora a física (solo, clima, demografia).

O mapeamento causal (início → via → efeito) pode ficar vazio na passada 1. A passada 2 é o lugar da cadeia completa.

Status da passada é julgamento seu:

- **Não iniciado** — o nó existe como intenção.
- **Mapa concluído** — identificado como estruturante, profundidade mínima, fontes de síntese.
- **Tecido concluído** — leitura primária moderada e mapeamento dimensional feito.

A flag **candidato à profundidade seletiva** também é julgamento. O Sistema não a infere a partir das perguntas em aberto; apenas as guarda para você decidir.

Atalhos: `n` registra um nó (fora de campos de texto); `Esc` volta ao eixo; `/` abre o índice.

## 2. Escrever a síntese sem consulta

No rodapé do nó, **Escrever síntese sem consulta**.

O modo trava a navegação e **não renderiza** notas, fontes nem o mapeamento causal daquele nó. A pergunta permanece visível — é o objeto da reconstrução, não uma fonte.

Escreva de memória:

1. o nó causal;
2. as dimensões mobilizadas;
3. a cadeia causal completa;
4. as perguntas que permanecem em aberto.

O item 4 é obrigatório. Se não houver dúvida, escreva isso em palavras. É o critério principal para candidatos à passada 3.

O método pede 300–800 palavras. O Sistema mostra a contagem como fato e não recusa fora da faixa — não é um jogo de atingir a meta.

**Registrar síntese** grava o texto com timestamp. Uma síntese anterior, se houver, vai para o arquivo do nó, sem apagar o juízo passado.

**Encerrar sem registrar** descarta o rascunho. Recarregar a página também sai do modo trava (o rascunho em sessão não reabre sozinho: a trava é um ato, não um estado persistente).

## 3. Ler o painel de cobertura

**Cobertura** não é um placar.

- **Passada 1 — Mapa:** quantos dos dez macroperíodos têm ao menos um nó em mapa ou tecido. Isso é cobertura estrutural do eixo, não duração em anos.
- **Passada 2 — Tecido:** o mesmo limiar, só com nós em tecido.
- A tabela lista, por macroperíodo, ênfase, faixa, contagem de nós, presença de mapa e de tecido.
- **Passada 3** é a lista viva dos nós que você marcou, ordenável por data de marcação ou por macroperíodo.

Percentuais aparecem porque o requisito pede percentual do eixo coberto. Não há cor de “sucesso”, não há sequência, não há recompensa.

## 4. Exportar

Em **Exportar**:

- **JSON** — cópia integral, restaurável. Este é o formato de durabilidade.
- **Markdown** — o caderno legível por humano, agrupado por macroperíodo.

**Escolher arquivo JSON** substitui o caderno atual (pede confirmação).

Com `server.py` em execução, cada alteração também é gravada em `data/eixo.json`. Esse arquivo pode ir para um repositório git seu. `data/seed.json` permanece a periodização inicial; não o misture com o caderno vivo.

## Índice

Filtros: texto, dimensão mobilizada, macroperíodo, status de passada, presença de perguntas em aberto, flag de profundidade seletiva. Os dois ênfases nunca são separados em telas distintas — o índice lista o mesmo conjunto de nós que o eixo exibe junto.
