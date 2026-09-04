# Pokemon Explorer — Guia de Desenvolvimento

## Stack
- **Frontend:** HTML + CSS + JavaScript vanilla (sem framework, sem build step)
- **Servidor:** Python 3 — `http.server` built-in (sem dependências externas)
- **API:** [PokéAPI](https://pokeapi.co/) — gratuita, sem cadastro, CORS habilitado

## Como rodar
```bash
python3 server.py
```
Acesse em `http://localhost:1989`

## Regras

### Sem instalação de dependências
Não adicionar npm, pip packages, frameworks, etc. O app é 100% estático (HTML/CSS/JS vanilla).

### Após qualquer alteração nos arquivos
Não é necessário rebuild — basta recarregar o browser (`Ctrl+Shift+R` para forçar cache).

### Estrutura de arquivos
```
app_pokemon/
├── index.html          ← HTML puro, apenas estrutura e tags <script>/<link>
├── style.css           ← todos os estilos
├── js/
│   ├── constants.js    ← API URLs, TYPE_COLORS, ROMANS, variáveis de estado global
│   ├── utils.js        ← $(), setList(), setContent(), idFrom(), artUrl(), titleCase(), etc.
│   ├── api.js          ← apiFetch() com cache em Map
│   ├── effectiveness.js← computeEff(), groupEff()
│   ├── pokemon.js      ← selectPoke(), renderCard(), selectForm(), effGridHTML(), etc.
│   ├── team.js         ← addToTeam(), removeFromTeam(), renderTeamBar(), renderTeamView(), showTeamView()
│   ├── list.js         ← onGenChange(), onGameChange(), renderList(), pokeItemHTML()
│   ├── home.js         ← showHome(), gameTitle(), selectGame(), renderGameGrid()
│   └── main.js         ← init() — ponto de entrada, popula dropdowns, chama showHome()
├── server.py           ← servidor Python na porta 1989
└── CLAUDE.md
```

**Ordem de carregamento dos scripts** (importante — sem módulos ES, tudo em escopo global):
`constants.js → utils.js → api.js → effectiveness.js → pokemon.js → team.js → list.js → home.js → main.js`

### Estado global (em constants.js)
- `globalPoke` — todos os Pokémon (~1025)
- `allPoke` / `shownPoke` — Pokémon da geração/jogo selecionado
- `activePoke`, `activePokeId`, `activeForms`, `activeFormIdx` — Pokémon aberto no card
- `team` — array de até 6 Pokémon do time
- `viewMode` — `'home'` | `'explorer'` | `'team'`

### Modos de view e CSS
O `#content` recebe classes CSS para controlar overflow/scroll de cada tela:
- **Home:** `.home-mode` → `overflow-y: auto`
- **Time:** `.team-mode` → `overflow: hidden` (scroll interno por coluna)
- **Explorer:** sem classes extras

### Home page
- Exibe as 9+ gerações em grade: **3 cards por linha**, cada card com `flex: N` onde N = número de jogos da geração (cards com mais jogos ficam mais largos)
- Clicar em um jogo chama `selectGame(genUrl, vgUrl)` que popula os dropdowns e chama `renderGameGrid()`
- `renderGameGrid()` exibe os Pokémon do jogo em grid de 6 por linha na área principal
- `gameTitle(slug)` formata nomes de jogos: `"red-blue"` → `"Red / Blue"`, `"black-2-white-2"` → `"Black 2 / White 2"`

### Tela de time
- Grid dinâmico: `grid-template-columns: repeat(N, 1fr)` onde N = tamanho atual do time
- Seções por Pokémon (em pt-BR): **Fraco para**, **Dano normal**, **Resistente a**, **Imune para**
- Badges em pill shape com multiplicador em bolinha branca à direita
- Auto-atualiza se o usuário adicionar um Pokémon enquanto estiver na tela de time

### Cache da PokéAPI
Respostas da API são cacheadas em memória (`Map` em `api.js`) durante a sessão do browser. O cache é limpo ao recarregar a página.

### Efetividade de tipos (defensiva)
- **Fraqueza:** `double_damage_from` → ×2 (ou ×4 para dual-type)
- **Resistência:** `half_damage_from` → ×0.5 (ou ×0.25)
- **Imunidade:** `no_damage_from` → ×0
- **Dano normal:** ×1 (nenhuma relação com o tipo)

Para Pokémon dual-type: multiplicadores dos dois tipos são multiplicados entre si (ex: Ground+Flying = imune a Elétrico, 4× a Gelo).
