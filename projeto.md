# 🚀 Sistema de Gerenciamento de E-Commerce (Visagio) - Visão Geral do Projeto

O **Sistema de Gerenciamento de E-Commerce** é uma plataforma concebida para administrar o catálogo de produtos e visualizar dados em tempo real sobre vendas e avaliações de consumidores. Ele possibilita a rápida identificação de oportunidades de melhorias na disponibilidade e aceitação dos itens à venda.

## 🏢 Arquitetura e Tecnologias

A aplicação possui uma arquitetura clássica que separa as responsabilidades entre Front-end e Back-end, operando sobre um banco de dados relacional. 

- **Backend:** Construído com **FastAPI** (Python), orquestrando as conexões com o banco via **SQLAlchemy** (ORM) e mantendo integridade com schemas dinâmicos via **Pydantic**.
- **Frontend:** Desenvolvido no ecossistema atual do **React** usando **Vite** e **TypeScript**, implementando um design altamente moderno com efeito *Glassmorphism*. O roteamento é feito com `React Router` e as conexões assíncronas com a API por meio do `Axios`.
- **Estética:** Trabalhada em `Vanilla CSS`, a interface tem o **Verde Petróleo e Branco** como sua identidade visual principal, trazendo frescor, um tom _premium_ e uma leitura suave, de acordo com as necessidades do cliente.
- **Banco de Dados:** **SQLite**, modelando um esquema que inclui Produtos, Parceiros (Vendedores), Consumidores (Clientes), e suas intersecções em Pedidos, Vendas e Avaliações Reais.

## ✨ Os 4 Diferenciais Incorporados

Além dos requisitos mandatórios, o projeto traz inovações de usabilidade e confiabilidade que o distinguem:

### 1. 🔍 Filtro Avançado por Notas Críticas
Expandindo a capacidade de busca, adicionamos múltiplos filtros que cruzam os dados. Os usuários podem não apenas buscar categorias e descrições, mas realizar varreduras com a **Nota Mínima de Avaliação**. Isso agiliza imensamente a verificação da aceitação pública dos produtos.

### 2. 📊 Dashboard Gerencial de KPIs
Inserido diretamente na tela do catálogo, incluímos *Insights Reactivos* alimentados pelo endpoint inteligente desenvolvido sob-medida (`/api/produtos/stats`). O dashboard mostra em uma batida de olho:
  - O volume total de produtos cadastrados na base de dados geral.
  - A Nota Global, agregada de todo o repositório de vendas.
  - A Categoria com a maior incidência de cadastro, permitindo que gestores mapeiem excesso de frotas ou dependências monopolistas.

### 3. 🧪 Suíte de Testes Automatizados (Backend)
Testabilidade assegurada. Garantimos que novas contribuições no núcleo de produtos do sistema não causem regressões silenciosas através da inserção de um módulo moderno em `Pytest`. Endpoints cruciais e fluxos lógicos foram cercados com Testes Automatizados rápidos, rodando em escopo unitário antes da liberação de código de rede no pipeline de CD/CI.

### 4. 📤 Exportador Nativos em Lote (CSV)
Empoderamento de dados para o usuário do sistema através do botão `Exportar CSV`. O gestor pode mapear produtos usando os múltiplos filtros, realizar as avaliações no painel e então, com um único clique, gerar um relatório analítico instantâneo (compatível com Excel) contendo toda as informações e métricas extraídas em tempo real daquele painel visando análises externas cruciais sem precisar ser um desenvolvedor ou ter acesso restrito ao Banco.
