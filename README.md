# 🔴 Pokémon Explorer

Explorador de Pokémon feito em **HTML + CSS + JavaScript vanilla**, sem frameworks e sem build step, consumindo dados diretamente da [PokéAPI](https://pokeapi.co/).

## ✨ Funcionalidades

- **Home** com todas as gerações Pokémon organizadas em grade, cada uma listando seus jogos
- **Exploração por geração/jogo** via dropdowns, com busca por nome
- **Cartão de detalhes** do Pokémon: stats, tipos, sprites/artwork e formas alternativas
- **Efetividade de tipos** (defensiva): fraquezas, resistências, imunidades e dano normal, incluindo combinações dual-type
- **Montagem de time**: adicione até 6 Pokémon e veja a efetividade combinada do time inteiro lado a lado
- Cache em memória das respostas da API durante a sessão do browser

---

## 📥 Nunca programou? Comece aqui

**Não precisa instalar absolutamente nada** — nem Python, nem Node, nada. Só um navegador (Chrome, Edge, Brave ou Opera).

### Passo 1 — Baixar o projeto

1. Clique no botão verde **"Code"** no topo desta página
2. Clique em **"Download ZIP"**
3. Extraia (descompacte) o arquivo ZIP baixado em uma pasta no seu computador

### Passo 2 — Abrir o app

Dentro da pasta que você extraiu, dê **duplo-clique** no arquivo **`index.html`**. Ele abre direto no seu navegador padrão e já funciona — não aparece nenhum terminal, nenhuma instalação, nada para configurar.

### Passo 3 — Usar

Pronto! Explore as gerações, veja detalhes dos Pokémon e monte seu time. Para fechar, é só fechar a aba do navegador.

> **Não carregou os Pokémon?** Isso pode acontecer em alguns navegadores mais restritivos (ex: Firefox) ao abrir o arquivo diretamente. Nesse caso, tente abrir com o Chrome/Edge/Brave/Opera.

---

## 🗂️ Estrutura

```
app_pokemon/
├── index.html          # estrutura HTML
├── style.css           # estilos
├── js/
│   ├── constants.js    # URLs da API, cores de tipos, estado global
│   ├── utils.js        # helpers de DOM e formatação
│   ├── api.js          # fetch com cache em memória
│   ├── effectiveness.js# cálculo de efetividade de tipos
│   ├── pokemon.js       # renderização do card de detalhes
│   ├── team.js          # montagem e visualização do time
│   ├── list.js          # listagem/filtragem de Pokémon
│   ├── home.js           # tela inicial com gerações e jogos
│   └── main.js          # ponto de entrada da aplicação
```

## 🧰 Stack

- Frontend 100% estático: HTML, CSS e JS vanilla (sem framework, sem npm, sem servidor)
- Dados: [PokéAPI](https://pokeapi.co/) — gratuita, sem cadastro, CORS habilitado

Mais detalhes de arquitetura e convenções em [CLAUDE.md](./CLAUDE.md).
