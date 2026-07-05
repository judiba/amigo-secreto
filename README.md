# ⚡ Amigo Secreto Cyberpunk

> Sistema de sorteio de amigo secreto com tema visual cyberpunk — neon, partículas animadas e disparo anônimo de notificações por **e-mail** ou **WhatsApp**.

---

## 📸 Visão Geral

O projeto é composto por duas páginas:

| Página | Descrição |
|---|---|
| `index.html` | Cadastro dos participantes (nome, sobrenome e canal de notificação) |
| `sorteio.html` | Execução do sorteio e disparo anônimo das notificações |

---

## ✨ Funcionalidades

- **Cadastro simplificado** — nome, sobrenome e **apenas um canal de contato** (e-mail **ou** WhatsApp, não os dois)
- **Campos dinâmicos** — ao selecionar o canal, apenas o campo relevante é exibido
- **Máscara automática** no campo de WhatsApp ao digitar
- **Validação por canal** — só valida o dado do canal escolhido
- **Prevenção de duplicatas** por e-mail ou por número de WhatsApp conforme o canal
- **Mínimo de 4 participantes** — o botão de sorteio só aparece ao atingir a quantidade mínima, com indicador visual colorido
- **Algoritmo sem self-match** — ninguém tira a si mesmo (derangement via Fisher-Yates com até 1000 tentativas)
- **Canal por participante** — cada pessoa escolhe receber por ✉ e-mail ou 💬 WhatsApp
- **Disparo totalmente anônimo** — após o sorteio, os pares ficam ocultos; ninguém vê quem tirou quem na tela
- **Único botão de disparo** — "📡 DISPARAR PARA TODOS" envia para todos os pendentes de uma vez
- **Envio por WhatsApp** via `wa.me` com mensagem pré-formatada
- **Envio por e-mail** via `mailto:` com assunto e corpo prontos
- **Badge de confirmação** — cada participante recebe o badge "✓ NOTIFICADO" após o disparo
- **Persistência via `localStorage`** — participantes e resultado sobrevivem ao recarregar a página
- **Novo sorteio** — limpa todos os dados e recomeça do zero

---

## 🗂️ Estrutura do Projeto

```
challenge-amigo-secreto_pt-main/
│
├── index.html               # Página de cadastro de participantes
├── sorteio.html             # Página de sorteio e disparo anônimo
├── app.js                   # Toda a lógica da aplicação
├── style.css                # Tema cyberpunk completo
├── README.md                # Este arquivo
│
└── assets/
    ├── amigo-secreto.svg    # Ícone principal (SVG vetorial cyberpunk)
    ├── play_circle_outline.png  # Ícone do botão de sortear
    ├── bg-cyberpunk.jpg     # Imagem de fundo
    ├── glow.jpg             # Efeito de brilho
    ├── glow.png             # Efeito de brilho (PNG)
    └── neon-grid.png        # Grade neon decorativa
```

---

## 🚀 Como Usar Localmente

### Pré-requisitos

Nenhuma dependência externa — o projeto é **100% HTML + CSS + JavaScript puro**. Só precisa de um navegador moderno.

> As fontes (Orbitron, Share Tech Mono, Rajdhani) são carregadas do Google Fonts. Uma conexão com internet é necessária para que as fontes apareçam corretamente. Sem internet, o navegador usará a fonte monospace padrão do sistema.

---

### Opção 1 — Abrir direto no navegador (mais simples)

1. Baixe ou clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/challenge-amigo-secreto_pt-main.git
   ```
2. Navegue até a pasta do projeto:
   ```bash
   cd challenge-amigo-secreto_pt-main
   ```
3. Abra o arquivo `index.html` diretamente no seu navegador:
   - **Windows:** clique duplo no arquivo `index.html`
   - **macOS/Linux:** `open index.html` ou `xdg-open index.html`

> ⚠️ **Atenção:** Abrir arquivos locais via `file://` pode bloquear alguns recursos em navegadores com políticas de segurança mais rígidas (ex: Chrome). Se algo não funcionar, use a Opção 2 abaixo.

---

### Opção 2 — Servidor local com VS Code (recomendado)

1. Instale a extensão **Live Server** no VS Code:
   - Acesse: `Ctrl+Shift+X` → pesquise `Live Server` → instale
2. Abra a pasta do projeto no VS Code:
   ```bash
   code challenge-amigo-secreto_pt-main
   ```
3. Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**
4. O navegador abrirá automaticamente em `http://127.0.0.1:5500`

---

### Opção 3 — Servidor local com Node.js

```bash
# Instala o servidor estático globalmente (uma única vez)
npm install -g serve

# Na pasta do projeto, inicie o servidor
serve .
```

Acesse `http://localhost:3000` no navegador.

---

### Opção 4 — Servidor local com Python

```bash
# Python 3
python -m http.server 8080

# Python 2 (legado)
python -m SimpleHTTPServer 8080
```

Acesse `http://localhost:8080` no navegador.

---

## 🌐 Como Hospedar na Web

Por ser um projeto **estático** (sem backend), pode ser hospedado gratuitamente em diversas plataformas.

---

### ▶ GitHub Pages (gratuito)

1. Crie um repositório no GitHub e envie os arquivos:
   ```bash
   git init
   git add .
   git commit -m "feat: amigo secreto cyberpunk"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/amigo-secreto.git
   git push -u origin main
   ```
2. No repositório, vá em **Settings → Pages**
3. Em **Source**, selecione a branch `main` e pasta `/ (root)`
4. Clique em **Save**
5. Aguarde alguns minutos — o site estará disponível em:
   ```
   https://seu-usuario.github.io/amigo-secreto/
   ```

---

### ▶ Netlify (gratuito, arrastar e soltar)

1. Acesse [netlify.com](https://netlify.com) e crie uma conta gratuita
2. Na dashboard, clique em **"Add new site" → "Deploy manually"**
3. **Arraste a pasta inteira do projeto** para a área indicada
4. O site estará online em segundos com uma URL gerada automaticamente

**Ou via CLI:**
```bash
npm install -g netlify-cli
netlify deploy --dir . --prod
```

---

### ▶ Vercel (gratuito)

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub
2. Clique em **"Add New Project"** e importe o repositório
3. Clique em **"Deploy"** — sem nenhuma configuração adicional

**Ou via CLI:**
```bash
npm install -g vercel
vercel --prod
```

---

### ▶ Cloudflare Pages (gratuito, CDN global)

1. Acesse [pages.cloudflare.com](https://pages.cloudflare.com)
2. Conecte seu repositório GitHub
3. Em **Build settings**, deixe tudo em branco (projeto estático, sem build)
4. Clique em **Save and Deploy**

---

## 🔄 Fluxo de Uso

```
1. Abra index.html
       │
       ▼
2. Preencha: Nome + Sobrenome
   Escolha o canal: ✉ E-mail  ou  💬 WhatsApp
   Preencha apenas o campo do canal escolhido
   Clique em [+ ADICIONAR]
       │
       ▼
3. Repita para cada participante (mínimo 4)
   O indicador muda de 🔴 para 🟢 ao atingir 4
       │
       ▼
4. Clique em [⚡ INICIAR SORTEIO]  →  sorteio.html
       │
       ▼
5. Confira o resumo dos participantes
   Clique em [⚡ EXECUTAR SORTEIO]
       │
       ▼
6. Painel de disparo anônimo — os pares ficam ocultos
   Clique em [📡 DISPARAR PARA TODOS]
       │
       ▼
   WhatsApp → abre wa.me com mensagem pré-pronta para cada participante
   E-mail   → abre cliente de e-mail com mensagem pré-pronta para cada participante
   Badge "✓ NOTIFICADO" aparece em cada card após o disparo
       │
       ▼
7. Para recomeçar: [↺ NOVO SORTEIO]
```

---

## 🔒 Privacidade no Disparo

O resultado do sorteio **nunca é exibido na tela de envio**. Após o sorteio:

- Cada participante aparece listado apenas com seu nome e canal de contato
- O amigo secreto de cada um fica marcado como 🔒 *oculto*
- O organizador clica em "Disparar para Todos" — as mensagens são abertas e enviadas sem que a tela revele os pares

Isso garante que quem organiza o sorteio também não descubra os resultados.

---

## 🎨 Tecnologias e Design

| Tecnologia | Uso |
|---|---|
| HTML5 semântico | Estrutura das páginas |
| CSS3 (variáveis, animações, grid) | Tema cyberpunk completo |
| JavaScript ES6+ (vanilla) | Lógica, DOM, localStorage |
| Google Fonts | Orbitron · Share Tech Mono · Rajdhani |
| SVG inline | Ícone vetorial da caixa de presente |
| `localStorage` | Persistência de dados sem backend |
| `wa.me` | Envio de mensagem via WhatsApp |
| `mailto:` | Envio via cliente de e-mail padrão |

**Paleta de cores:**

| Token | Hex | Uso |
|---|---|---|
| `--cyan` | `#00f5ff` | Cor primária, bordas, títulos |
| `--magenta` | `#ff00cc` | Destaque, laços, fita |
| `--green` | `#00ff87` | Sucesso, confirmações |
| `--yellow` | `#f5e642` | Cantos, sparkles |
| `--bg-dark` | `#050a14` | Fundo principal |

---

## ⚠️ Observações Importantes

- **Privacidade:** os dados são salvos apenas no `localStorage` do navegador do usuário — nenhuma informação é enviada para servidores externos.
- **Envio de mensagens:** o projeto **não envia e-mails ou mensagens automaticamente**. Ele abre o cliente de e-mail ou o WhatsApp com a mensagem pré-preenchida — o envio final é feito pelo usuário.
- **WhatsApp Web:** para o envio funcionar no desktop, o WhatsApp Web precisa estar conectado ou o aplicativo instalado.
- **Bloqueio de pop-ups:** se o navegador bloquear a abertura de janelas ao clicar em "Disparar para Todos", permita pop-ups para o domínio do site. O disparo em massa usa um intervalo de 600ms entre cada mensagem para reduzir bloqueios.
- **Limpeza de dados:** ao clicar em "Novo Sorteio", participantes e resultado são apagados do `localStorage`. Esta ação é irreversível.

---

## 📄 Licença

Este projeto é de uso livre para fins educacionais e pessoais.

---

*// AMIGO SECRETO CYBERPUNK // 2025 //*
