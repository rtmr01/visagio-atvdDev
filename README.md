# Sistema de Gerenciamento de E-Commerce (Visagio)

O Sistema de Gerenciamento de E-Commerce é uma plataforma concebida para administrar o catálogo de produtos e visualizar dados em tempo real sobre vendas e avaliações de consumidores. Ele possibilita a rápida identificação de oportunidades de melhorias na disponibilidade e aceitação dos itens à venda.

Este projeto foi desenvolvido como resolução do desafio técnico de estruturação de um sistema de E-Commerce, contendo listagem de produtos, filtros, cálculos de métricas (número de vendas e média de avaliação), além do CRUD completo para gerenciamento de catálogo.

## Arquitetura e Tecnologias

A aplicação possui uma arquitetura clássica que separa as responsabilidades entre Front-end e Back-end, operando sobre um banco de dados relacional.

- **Backend:** Construído com **FastAPI** (Python), orquestrando as conexões com o banco via **SQLAlchemy** (ORM), mantendo integridade com schemas dinâmicos via **Pydantic** e utilizando **Alembic** para migrações.
- **Frontend:** Desenvolvido no ecossistema **React** usando **Vite** e **TypeScript**, implementando um design altamente moderno com efeito **Glassmorphism**. O roteamento é feito com `React Router` e as conexões assíncronas com a API por meio do `Axios`.
- **Estética:** Trabalhada em `Vanilla CSS`, a interface tem o **Verde Petróleo e Branco** como sua identidade visual principal, trazendo um tom premium e leitura suave.
- **Banco de Dados:** **SQLite**, modelando um esquema que inclui Produtos, Parceiros (Vendedores), Consumidores (Clientes), e suas intersecções em Pedidos, Vendas e Avaliações Reais.

## Diferenciais Incorporados

Além dos requisitos mandatórios, o projeto traz inovações de usabilidade e confiabilidade que o distinguem:

### 1. Filtro Avançado por Notas Críticas
Expandindo a capacidade de busca, os usuários podem realizar varreduras com a **Nota Mínima de Avaliação**, agilizando a verificação da aceitação pública dos produtos.

### 2. Dashboard Gerencial de KPIs
Inserido diretamente na tela do catálogo, incluímos Insights Reativos alimentados pelo endpoint inteligente `/api/produtos/stats`. O dashboard mostra o volume total de produtos, a Nota Global e a Categoria com maior incidência.

### 3. Suite de Testes Automatizados (Backend)
Garantimos a qualidade do núcleo do sistema através de um módulo moderno em `Pytest`, com testes unitários cobrindo endpoints cruciais e fluxos lógicos.

### 4. Exportador em Lote (CSV)
Permite ao gestor gerar um relatório analítico instantâneo (compatível com Excel) contendo todas as informações e métricas extraídas em tempo real da visualização atual.

## Estrutura do Repositório

- `backend/` - API em FastAPI, Banco de Dados SQLite, Models e Routers.
- `frontend/` - SPA React com UI moderna e serviços REST.
- `csv-base/` - Arquivos de dados originais para população do banco.

## Como instalar e Preparar o Ambiente

### 1. Inicializando o Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou 'venv\Scripts\activate' no Windows
pip install -r requirements.txt

# Criação das Tabelas
alembic upgrade head

# Ingestão de Dados
python scripts/seed.py
```

### 2. Inicializando o Frontend
```bash
cd frontend
npm install
```

## Como rodar o Projeto

É necessário rodar o backend e o frontend simultaneamente.

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```
A API rodará em: `http://localhost:8000`
A documentação automática está disponível em: `http://localhost:8000/docs`

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
O Vite rodará em: `http://localhost:5173`

## Outros Refinamentos e Extras

- **Paginação via Backend:** Otimização para bases de dados extensas.
- **Debounce de Pesquisas:** Preservação da saúde do servidor em buscas dinâmicas.
- **Seed Otimizado:** Importação em lote (bulk) com tratamento de dados nulos.
- **Interface UI/UX Dark e Glass:** Componentes reutilizáveis com estética premium.

---
Copyright © 2026 Visagio.
Desenvolvido via pair-programming com Antigravity.
