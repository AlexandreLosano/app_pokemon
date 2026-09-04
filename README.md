# 🔴 Pokémon Explorer

Explorador de Pokémon feito em **HTML + CSS + JavaScript vanilla**, sem frameworks e sem build step, consumindo dados diretamente da [PokéAPI](https://pokeapi.co/).

## ✨ Funcionalidades

- **Home** com todas as gerações Pokémon organizadas em grade, cada uma listando seus jogos
- **Exploração por geração/jogo** via dropdowns, com busca por nome
- **Cartão de detalhes** do Pokémon: stats, tipos, sprites/artwork e formas alternativas
- **Efetividade de tipos** (defensiva): fraquezas, resistências, imunidades e dano normal, incluindo combinações dual-type
- **Montagem de time**: adicione até 6 Pokémon e veja a efetividade combinada do time inteiro lado a lado
- Cache em memória das respostas da API durante a sessão do browser

## 🚀 Como rodar

Não há dependências para instalar — é só subir o servidor estático incluso:

```bash
python3 server.py
```

Depois acesse **http://localhost:1989**

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
└── server.py            # servidor estático (Python, porta 1989)
```

## 🧰 Stack

- Frontend 100% estático: HTML, CSS e JS vanilla (sem framework, sem npm)
- Servidor: Python 3 (`http.server`)
- Dados: [PokéAPI](https://pokeapi.co/) — gratuita, sem cadastro, CORS habilitado

Mais detalhes de arquitetura e convenções em [CLAUDE.md](./CLAUDE.md).
