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

Não precisa instalar nada complicado nem entender de programação. Siga os passos abaixo:

### Passo 1 — Baixar o projeto

1. Clique no botão verde **"Code"** no topo desta página
2. Clique em **"Download ZIP"**
3. Extraia (descompacte) o arquivo ZIP baixado em uma pasta no seu computador

### Passo 2 — Instalar o Python (só na primeira vez)

O app precisa do **Python**, um programa gratuito, para funcionar. Se você não tem certeza se já tem, pode pular para o Passo 3 — os scripts avisam se faltar algo.

- Baixe em **https://www.python.org/downloads/**
- **Importante no Windows:** na tela de instalação, marque a caixinha **"Add Python to PATH"** antes de clicar em instalar

### Passo 3 — Abrir o app

Dentro da pasta que você extraiu, dê **duplo-clique** no arquivo correspondente ao seu sistema:

| Sistema | Arquivo |
|---|---|
| 🪟 Windows | `Iniciar - Windows.bat` |
| 🍎 Mac | `Iniciar - Mac.command` |
| 🐧 Linux | `Iniciar - Linux.sh` |

Uma janela preta (terminal) vai abrir e, em seguida, o app abre sozinho no seu navegador. **Deixe essa janela aberta** enquanto estiver usando o Pokémon Explorer — fechá-la encerra o app.

> **Mac:** se aparecer um aviso de segurança ("não é possível verificar o desenvolvedor"), clique com o botão direito no arquivo → **Abrir** → confirme.
>
> **Linux:** se o duplo-clique não funcionar, dê permissão de execução: botão direito no arquivo → Propriedades → Permissões → "Permitir executar como programa", ou rode `chmod +x "Iniciar - Linux.sh"` no terminal.

### Passo 4 — Usar

Pronto! Explore as gerações, veja detalhes dos Pokémon e monte seu time. Para fechar o app, é só fechar a janela do terminal.

---

## 🚀 Como rodar (modo manual / desenvolvedores)

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
├── Iniciar - Windows.bat # atalho de um clique (Windows)
├── Iniciar - Mac.command # atalho de um clique (Mac)
├── Iniciar - Linux.sh    # atalho de um clique (Linux)
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
