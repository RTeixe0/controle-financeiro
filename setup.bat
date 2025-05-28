@echo off
echo Criando estrutura de pastas...

mkdir public
echo. > public\logo.svg

mkdir src\app\api\auth
mkdir src\app\api\transactions
mkdir src\components
mkdir src\lib
mkdir src\models
mkdir src\types
mkdir src\styles
mkdir src\config

echo {
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "none",
  "bracketSpacing": true,
  "arrowParens": "avoid"
} > .prettierrc

(
echo module.exports = {
echo^   root: true,
echo^   extends: ['next', 'next/core-web-vitals', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
echo^   plugins: ['@typescript-eslint'],
echo^   parser: '@typescript-eslint/parser',
echo^   parserOptions: {
echo^     ecmaVersion: 'latest',
echo^     sourceType: 'module'
echo^   },
echo^   rules: {
echo^     '@typescript-eslint/no-unused-vars': ['warn'],
echo^     'no-console': 'warn'
echo^   }
echo }
) > .eslintrc.js

(
echo MONGODB_URI=
echo JWT_SECRET=
echo NEXT_PUBLIC_API_BASE_URL=
) > .env.example

(
echo import mongoose from 'mongoose'
echo.
echo const MONGODB_URI = process.env.MONGODB_URI!
echo.
echo if (!MONGODB_URI) {
echo^   throw new Error('Defina a variável MONGODB_URI no .env')
echo }
echo.
echo let cached = global.mongoose || { conn: null, promise: null }
echo.
echo export async function connectDB() {
echo^   if (cached.conn) return cached.conn
echo^   if (!cached.promise) {
echo^     cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => mongoose)
echo^   }
echo^   cached.conn = await cached.promise
echo^   return cached.conn
echo }
) > src\lib\db.ts

(
echo import mongoose, { Schema, model, models } from 'mongoose'
echo.
echo const UserSchema = new Schema({
echo^   nome: { type: String, required: true },
echo^   email: { type: String, required: true, unique: true },
echo^   senhaHash: { type: String, required: true },
echo^   criadoEm: { type: Date, default: Date.now }
echo }, { timestamps: true })
echo.
echo export const User = models.User || model('User', UserSchema)
) > src\models\User.ts

(
echo import jwt from 'jsonwebtoken'
echo.
echo const JWT_SECRET = process.env.JWT_SECRET!
echo.
echo export function gerarToken(payload) {
echo^   return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
echo }
echo.
echo export function verificarToken(token) {
echo^   return jwt.verify(token, JWT_SECRET)
echo }
) > src\lib\auth.ts

(
echo # Controle Financeiro Pessoal (Next.js + MongoDB)
echo.
echo Aplicação PWA com gestão de receitas, despesas, dívidas, ativos, dashboard e integração futura com WhatsApp e OpenAI.
echo.
echo ## 🚀 Tecnologias
echo - Next.js (App Router)
echo - TypeScript
echo - MongoDB Atlas
echo - TailwindCSS + Shadcn/ui
echo - JWT
echo - Vercel (Deploy)
echo.
echo ## ▶️ Como rodar
echo 1. Clone o repositório
echo 2. Instale as dependências:
echo    npm install
echo 3. Configure o .env baseado no .env.example
echo 4. Inicie o projeto:
echo    npm run dev
) > README.md

echo Estrutura criada com sucesso ✅
pause
