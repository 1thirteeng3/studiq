# Eixo

Sistema pessoal de gestão do conhecimento para um programa de estudo autodidata cujo objeto é **um único eixo temporal contínuo** — do Big Bang ao presente — lido em duas resoluções de foco (física e humana) sobre o mesmo tecido causal.

Eixo não é um curso, não gera conteúdo e não pensa no lugar de quem estuda. É infraestrutura de registro, rastreamento e disciplina metodológica: o caderno de periodização, nunca o treinador.

## Como usar localmente

Requisito: Python 3 (somente biblioteca padrão). Nenhum `pip`, nenhum Node, nenhuma conta.

```bash
python3 server.py
```

Abra `http://127.0.0.1:8765`. Os dados vivem em `data/eixo.json` (criado na primeira execução a partir de `data/seed.json`).

Para outro endereço ou porta:

```bash
python3 server.py --host 0.0.0.0 --port 8765
```

Sem o servidor, a interface ainda funciona se um servidor estático qualquer servir `app/`, mas a persistência cai para o armazenamento do navegador. Com `server.py`, o arquivo JSON no disco é a fonte de verdade.

## O que o Sistema faz

1. Mostra **um único eixo** com os dez macroperíodos pré-carregados; nós de ênfase física e humana convivem no mesmo eixo.
2. Registra **nós causais** (pergunta, posição, dimensões, mapeamento, passada, flag de profundidade seletiva).
3. Oferece as **5 categorias físicas** e as **12 dimensões humanas** como checklist de completude, nunca como formulário forçado.
4. Abre um **modo de síntese sem consulta** que oculta notas, fontes e mapeamento do próprio nó, com timestamp e campo obrigatório de perguntas em aberto.
5. Mostra **cobertura estrutural** das três passadas (Mapa, Tecido, Profundidade seletiva).
6. Filtra nós por dimensão, macroperíodo, passada, perguntas em aberto e flag seletiva.
7. Exporta JSON (cópia restaurável) e Markdown (leitura humana).

O que o Sistema **não** faz: pontuar, gamificar, gerar sínteses, mapear cadeias automaticamente, sugerir conclusões, notificar pressão.

## Documentação

- [Como operar o Sistema](docs/USO.md)
- [Justificativa da stack](docs/JUSTIFICATIVA.md)

## Estrutura

```
app/            interface (HTML, CSS, JS — sem etapa de build)
data/seed.json  periodização macro-histórica (dado semente)
data/eixo.json  caderno vivo (gerado na primeira execução; não versionar)
server.py       servidor local e persistência atômica do JSON
docs/           uso e justificativa
```
