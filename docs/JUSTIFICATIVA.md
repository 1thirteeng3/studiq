# Justificativa da stack

Restrições que governam a escolha: durabilidade de década ou mais; local-first; formatos em texto plano; baixa fricção administrativa; nenhuma dependência de serviço proprietário para ler os dados no longo prazo.

## O que foi escolhido

- **Interface:** HTML, CSS e JavaScript em módulos ES, sem etapa de build, sem npm, sem framework.
- **Persistência:** um arquivo JSON (`data/eixo.json`) gravado atomicamente por um servidor Python que usa só a biblioteca padrão, com cópia de reserva no navegador.
- **Exportação:** o mesmo JSON (restaurável) e Markdown (legível).
- **Execução:** `python3 server.py`.

## Por que não o resto

**Vault Obsidian / pasta de Markdown como interface.** Markdown é o formato de exportação, não o de trabalho. O método exige um eixo único com dois ênfases simultâneos, um modo que *oculte* fontes no momento da síntese, e cobertura estrutural das três passadas. Fazer isso com plugins de um aplicativo de notas terceiriza a fidelidade metodológica para uma economia de extensões que não sobrevive uma década.

**Electron / Tauri / aplicativo de loja.** Empacota um navegador inteiro, cria ciclo de atualização e amarra o instrumento a um sistema operacional específico. O caderno de um estudo vitalício não pode depender de um runtime que o fabricante abandona.

**Nuvem, conta, sincronização proprietária.** Contraria a restrição 1 de frente. Os dados deste programa precisam ser legíveis se o autor da ferramenta desaparecer.

**SQLite.** Adequado para volume grande. Um caderno de nós causais, mesmo vitalício, é da ordem das centenas ou poucos milhares de registros. JSON pretty-printed é inspecionável num editor de texto, diferencia bem em git e coincide com o requisito de exportação em texto plano. A troca (consultas menos poderosas) não se justifica.

**React/Vue/Svelte e um empacotador.** A interface é um conjunto pequeno de vistas. O custo de um framework — `node_modules`, quebra de major versions, mapa de source — é exatamente o tipo de fricção e de risco de apodrecimento que a restrição de durabilidade pede para evitar. Um arquivo HTML de 2014 ainda abre. Um projeto Create React App de 2018, em geral, não.

**Python com pip (Flask, FastAPI).** O servidor não precisa de roteamento além de GET/PUT de um arquivo e da entrega de estáticos. Biblioteca padrão basta. `pip install` é uma falha de durabilidade: o índice, as wheels e a versão do interpretador tornam-se parte do instrumento.

## Como a escolha amarra as restrições

1. **Década+.** O estado cabe num JSON com `version: 1`. A interface cabe em arquivos que qualquer navegador de 2020–2036 consegue servir. O servidor cabe num Python 3 que distribuições Unix ainda terão. Não há chave de API, não há schema migrado por um ORM, não há CSS-in-JS.
2. **Local-first.** Nada sai da máquina. O arquivo em `data/` é a fonte de verdade; o navegador é o editor.
3. **Baixa fricção.** Um comando para subir. Gravação contínua no editor do nó, sem botão “salvar” no trabalho de registro. O único ato explícito é o registro da síntese — porque esse ato *é* o método, não um detalhe de software.
4. **Fidelidade.** Cada vista mapeia um requisito (eixo, nó, síntese travada, cobertura, índice, exportar). Não há repetição espaçada, não há baralho, não há gerador.
5. **Nenhuma automação do juízo.** O Sistema não escreve cadeias, não sugere dimensões, não marca profundidade seletiva sozinho. Checklist não preenchido não bloqueia. Contagem de palavras não pinta de verde.

O subproduto desta stack é prosaico, e deve ser: um caderno que ainda abre quando o estudo, daqui a trinta anos, chegar de novo à contemporaneidade.
