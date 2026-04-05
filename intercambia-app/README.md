# IntercambIA — Planejador de Intercâmbio com IA

## Testar localmente

### 1. Obtenha sua API key da Anthropic
Acesse https://console.anthropic.com/settings/keys e crie uma nova chave.

### 2. Configure o arquivo .env
Renomeie o arquivo `.env.example` para `.env` e cole sua chave:
```
ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui
```

### 3. Rode o servidor local
Abra o terminal dentro desta pasta e execute:
```
node server.js
```

### 4. Abra o browser
Acesse: http://localhost:3000

---

## Deploy no Vercel (produto público)

### 1. Suba o projeto no GitHub
- Crie um repositório no github.com
- Faça upload desta pasta (o .env NÃO sobe — já está no .gitignore)

### 2. Conecte ao Vercel
- Acesse vercel.com e clique em "New Project"
- Importe o repositório do GitHub
- Clique em "Deploy"

### 3. Configure a API key no Vercel
- No painel do projeto, vá em Settings → Environment Variables
- Adicione: `ANTHROPIC_API_KEY` = sua chave
- Clique em "Redeploy"

Pronto! Seu app estará online com URL pública.

---

## Estrutura do projeto

```
intercambia-app/
├── index.html       — Frontend do app
├── server.js        — Servidor local para testes
├── api/
│   └── chat.js      — Função serverless (protege a API key)
├── vercel.json      — Configuração do Vercel
├── package.json
├── .env.example     — Modelo do arquivo de configuração
├── .env             — Sua API key (NÃO suba para o GitHub)
└── .gitignore       — Garante que o .env não vá para o GitHub
```
