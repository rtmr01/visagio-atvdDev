# visagio-atvdDev
Atividade E-commerce da VIsagio- Rocketlab 2026


# 🚀 Sistema de Gerenciamento de E-Commerce (Visagio)

Este projeto foi desenvolvido como resolução do desafio técnico de estruturação de um sistema de E-Commerce, contendo listagem de produtos, filtros, cálculos de métricas (número de vendas e média de avaliação), além do CRUD completo para gerenciamento de catálogo.

## 🛠️ Stack Tecnológica

- **Backend:** FastAPI, SQLAlchemy 2.0+, Alembic, SQLite, Pydantic, Pandas (Data Seed).
- **Frontend:** Vite, React, TypeScript, React Router DOM, Axios, Lucide-React.
- **Estilização:** CSS Vanilla com variáveis (design moderno, responsivo e com componentes translúcidos baseados em *Glassmorphism*).

## 🗂️ Estrutura do Repositório

- `backend/` - Contém a API em FastAPI, Banco de Dados SQLite, e todas as rotas e instâncias (Models, Routers).
- `frontend/` - SPA React focado na UI interagindo diretamente com os serviços REST expostos pela API.

## 📦 Como instalar e Preparar o Ambiente

### 1. Inicializando o Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou 'venv\Scripts\activate' no Windows
pip install -r requirements.txt

# Criação das Tabelas
alembic upgrade head

# Ingestão de Dados (são mais de 440 mil linhas ao todo!)
python scripts/seed.py
```

### 2. Inicializando o Frontend
```bash
cd frontend
npm install
```

## 🏃 Como rodar o Projeto

É necessário rodar o backend e o frontend simultaneamente.

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```
A API rodará em: `http://localhost:8000`
Você consegue acessar a documentação gerada automaticamente via:
`http://localhost:8000/docs`

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
O Vite rodará em: `http://localhost:5173`

---

### ✨ Extras Implementados e Diferenciais

- **Paginação via Backend:** Para otimizar a visualização em uma base com 32 mil produtos.
- **Filtros Avançados:** Filtro por nome interagindo simultaneamente com Filtro por Categoria e Roteamento.
- **Debounce de Pesquisas:** As chamadas de busca só são enviadas 450ms após o usuário parar de digitar, preservando saúde do servidor.
- **Seed Otimizado:** Importação em lote (bulk) e adaptadores para garantir que nulos do CSV virem `None` em Banco SQL, desviando de restrições das FKs do projeto herdado.
- **Interface UI/UX de Auto-Nível:** Componentes reutilizáveis baseados em UI *Dark e Glass*, conferindo "Aura de Premium" a interface.

Copyright © 2026 Visagio. 
Desenvolvido via pair-programming com Antigravity.
