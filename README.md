# 💰 Controle Financeiro & Patrimonial

Aplicação web responsiva (PWA) para gerenciamento de finanças pessoais e patrimônio, com autenticação JWT, importação de extratos (CSV), visualização de dados com gráficos, e estrutura pensada para escalar como SaaS futuramente.

---

## 🚀 Tecnologias Utilizadas

- **Next.js** (Fullstack – API Routes e Frontend)
- **MongoDB Atlas** (Banco de Dados NoSQL)
- **JWT + Bcrypt** (Autenticação)
- **TailwindCSS + Shadcn/ui + Recharts** (Interface)
- **Axios, Mongoose, Dotenv** (Integrações)
- **Vercel** (Deploy)

---

## 📦 Clonando o Projeto e Rodando Localmente

### ⚙️ Pré-requisitos

- Git
- Node.js LTS
- MongoDB Atlas (com cluster e string de conexão)
- VS Code (recomendado)

### 🛠️ Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/controle-financeiro.git
cd controle-financeiro

# 2. Instale as dependências
npm install

# 3. Copie o arquivo de variáveis de ambiente
cp .env.example .env.local

# 4. No .env.local, adicione sua string de conexão do MongoDB
MONGODB_URI="mongodb+srv://<usuario>:<senha>@cluster0.mongodb.net/controle-financeiro"

# 5. Rode o projeto em modo desenvolvimento
npm run dev

# Acesse em http://localhost:3000
```

---

## ✅ Funcionalidades Implementadas

- Autenticação (login, registro, logout)
- CRUD de:
  - Transações
  - Categorias
  - Dívidas e pagamentos
  - Ativos (patrimônio)
  - Rendimento/Salário
  - Alertas
  - Gamificação
- Importação de extratos em CSV
- Middleware de verificação JWT
- Conexão com MongoDB via Mongoose
- Rotas RESTful organizadas na pasta `/pages/api/`

---

## 📁 Estrutura de Pastas

```
controle-financeiro/
│
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   ├── transactions/
│   │   └── ...
│
├── models/
│   ├── User.ts
│   ├── Transaction.ts
│   └── ...
│
├── lib/
│   └── dbConnect.ts
│
├── middleware/
│   └── auth.ts
│
├── .env.local
├── package.json
└── README.md
```

---

## 📊 Em breve

- Dashboards interativas
- Exportação de dados
- Integração com Bot do WhatsApp
- Alertas e dicas inteligentes
- Sistema completo de gamificação
- Deploy contínuo e autenticação social

---