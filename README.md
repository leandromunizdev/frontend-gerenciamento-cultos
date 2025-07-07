# Sistema de Gerenciamento de Cultos - AD Piedade

Sistema para gerenciamento de cultos, escalas e visitantes da Assembleia de Deus de Piedade - Congregação de Madureira.

## Arquitetura

- **Frontend**: React 18 + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + Sequelize
- **Banco de Dados**: PostgreSQL 15
- **Containerização**: Docker + Docker Compose

## 🚀 Instalação e Execução

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- PostgreSQL 15+ (para desenvolvimento local)

### 🐳 Execução com Docker

1. **Clone os repositórios**

```bash
git clone <https://github.com/leandromunizdev/frontend-gerenciamento-cultos.git>
git clone <https://github.com/leandromunizdev/backend-gerenciamento-cultos.git>
cd ..
cd backend-gerenciamento-cultos
```

2. **Execute com Docker Compose**

```bash
docker-compose -f docker-compose.yml up -d
```

3. **Acesse a aplicação**

- Frontend: http://localhost
- Backend API: http://localhost:3008
- Documentação Swagger: http://localhost:3008/api-docs

4. **Credenciais padrão**

- Email: `admin@adpiedade.com`
- Senha: `admin123`

### 💻 Desenvolvimento Local

#### Backend

1. **Instalar dependências**

```bash
cd backend-gerenciamento-cultos
npm install
```

2. **Configurar banco PostgreSQL**

```bash
# Criar banco de dados
createdb sistema_cultos
```

3. **Configurar variáveis de ambiente**

```bash
cp .env.example .env
# Editar .env com suas configurações
```

4. **Executar seed do banco**

```bash
npm run seed
```

5. **Iniciar servidor**

```bash
npm run dev
```

#### Frontend

1. **Instalar dependências**

```bash
cd frontend-gerenciamento-cultos
npm install --force
```

2. **Configurar variáveis de ambiente**

```bash
cp .env.example .env
# Editar .env com a URL da API
```

3. **Iniciar servidor de desenvolvimento**

```bash
pnpm run dev
```

## 📋 Funcionalidades

### ✅ Implementadas

- **Autenticação e Autorização**

  - Login seguro com JWT
  - Controle de acesso baseado em cargos eclesiásticos
  - Sessões persistentes

- **Interface Responsiva**

  - Design adaptado para desktop, tablet e mobile
  - Identidade visual da AD Piedade
  - Navegação intuitiva

- **Estrutura Completa**

  - Modelos de dados
  - APIs REST
  - Sistema de logs e auditoria

- **Gerenciamento de Cultos**

  - Criação e edição de cultos
  - Controle de status

- **Sistema de Escalas**

  - Escalas manuais
  - Confirmação de presença

- **Cadastro de Visitantes**

  - Interface para recepção
  - Formulário simplificado

- **Sistema de Avaliações**

  - Avaliação pública da igreja
  - Critérios personalizáveis
  - Dashboard de feedback

- **Busca de CEP**
  - Busca de CEP para retornar um endereço de entrega através da api ViaCEP. Endpoint Utilizado: GET - viacep.com.br/ws/CEP/json/
  - API Gratuita: A API é pública e não há necessidade de cadastro prévio para sua utilização.

## 🎯 Interfaces

### 👨‍💼 Interface Administrativa

- Dashboard com estatísticas
- Gerenciamento completo de cultos
- Controle de pessoas e escalas

### 👥 Interface para Participantes

- Visualização de escalas pessoais
- Confirmação de presença
- Histórico de participações

### 📱 Interface para Recepção

- Cadastro rápido de visitantes
- Formulário simplificado

## 🔐 Sistema de Permissões

### Cargos Eclesiásticos

- **Pastor/Pastora**: Acesso total ao sistema
- **Presbítero**: Gerenciamento de cultos e escalas
- **Diácono/Diaconisa**: Gerenciamento de escalas
- **Membro**: Visualização de escalas pessoais
- **Congregado**: Acesso limitado

## 📊 Banco de Dados

### Principais Entidades

- **Usuários e Pessoas**: Sistema de autenticação e perfis
- **Cultos e Atividades**: Programação de eventos
- **Escalas**: Sistema de responsabilidades
- **Visitantes**: Cadastro e acompanhamento
- **Avaliações**: Feedback da comunidade

### Backend

```bash
npm start          # Produção
npm run dev        # Desenvolvimento
npm run seed       # Popular banco com dados iniciais
```

### Frontend

```bash
npm run dev       # Desenvolvimento
npm run build     # Build para produção
npm run preview   # Preview do build
```

## 📝 Documentação da API

A documentação da API está disponível via Swagger:

- **Local**: http://localhost:3008/api-docs
- **Docker**: http://localhost:3008/api-docs

### Principais Endpoints

#### Autenticação

- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Dados do usuário logado
- `POST /api/auth/logout` - Fazer logout

#### Cultos

- `GET /api/cultos` - Listar cultos
- `POST /api/cultos` - Criar culto
- `PUT /api/cultos/:id` - Atualizar culto
- `DELETE /api/cultos/:id` - Excluir culto

#### Escalas

- `GET /api/escalas` - Listar escalas
- `POST /api/escalas` - Criar escala
- `PATCH /api/escalas/:id/confirmar` - Confirmar presença

## 🔧 Configuração

### Variáveis de Ambiente

#### Backend (.env)

```env
NODE_ENV=development
PORT=3008
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_cultos
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=24h
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:3008/api
```

## 🚀 Deploy

### Docker Compose

```bash
# Produção
docker-compose -f docker-compose.yml up -d
```

### Manual

1. Build do frontend: `npm run build`
2. Deploy do backend em servidor Node.js
3. Configurar proxy reverso (nginx)
4. Configurar banco PostgreSQL

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

**Assembleia de Deus de Piedade**

- Site: https://adpiedade.com
- Email: contato@adpiedade.com
