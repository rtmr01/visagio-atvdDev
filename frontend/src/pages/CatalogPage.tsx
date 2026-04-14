import { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Download } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductFormModal from '../components/ProductFormModal';
import { getProdutos, getProdutosStats } from '../services/produtos';
import type { ProdutoCatalogo } from '../types/produto';
import './CatalogPage.css';

export default function CatalogPage() {
  const [produtos, setProdutos] = useState<ProdutoCatalogo[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // States de filtros
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [minAvaliacao, setMinAvaliacao] = useState<number | ''>('');
  
  // State modal novo produto
  const [showModal, setShowModal] = useState(false);
  
  // Dashboard Stats
  const [globalStats, setGlobalStats] = useState<{total_produtos: number, media_global: number, top_categoria: string} | null>(null);

  useEffect(() => {
    getProdutosStats().then(setGlobalStats).catch(console.error);
  }, []);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const res = await getProdutos({ 
        page, 
        limit: 12, 
        search, 
        categoria,
        min_avaliacao: minAvaliacao !== '' ? Number(minAvaliacao) : undefined
      });
      setProdutos(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const header = "ID,Nome,Categoria,Nota Media,Total Avaliacoes\n";
    const rows = produtos.map(p => `${p.id_produto},"${p.nome_produto}",${p.categoria_produto},${p.media_avaliacao},${p.total_avaliacoes}`);
    const csvContent = "data:text/csv;charset=utf-8," + header + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `produtos_pagina_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  useEffect(() => {
    // Debounce no search pra n matar o server de rqs a cada letrinha
    const debounceBusca = setTimeout(() => {
      fetchProdutos();
    }, 450);
    return () => clearTimeout(debounceBusca);
  }, [page, search, categoria, minAvaliacao]);

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <div>
          <h1>Catálogo de Produtos</h1>
          <p className="subtitle">Gerencie os itens do e-commerce Visagio.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={handleExportCSV} disabled={produtos.length === 0}>
            <Download size={20} />
            Exportar CSV
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Novo Produto
          </button>
        </div>
      </div>

      {globalStats && (
        <div className="dashboard-cards">
          <div className="dashboard-card glass-panel">
            <h4>Total de Produtos</h4>
            <p>{globalStats.total_produtos.toLocaleString('pt-BR')}</p>
          </div>
          <div className="dashboard-card glass-panel">
            <h4>Média Global de Notas</h4>
            <p>{globalStats.media_global.toFixed(1)} <span style={{fontSize: '1rem', color: '#fbbf24'}}>★</span></p>
          </div>
          <div className="dashboard-card glass-panel">
            <h4>Top Categoria</h4>
            <p style={{ fontSize: '1.25rem', paddingBottom: '0.25rem' }}>
              {globalStats.top_categoria.replace('_', ' ')}
            </p>
          </div>
        </div>
      )}

      <div className="filters-glass glass-panel">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar produtos por nome..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="form-control"
          />
        </div>
        
        <select 
          className="form-control category-select"
          value={categoria}
          onChange={(e) => { setCategoria(e.target.value); setPage(1); }}
        >
          <option value="">Todas as Categorias</option>
          <option value="beleza_saude">Beleza & Saúde</option>
          <option value="esporte_lazer">Esporte & Lazer</option>
          <option value="informatica_acessorios">Informática</option>
          <option value="utilidades_domesticas">Utilidades Domésticas</option>
          <option value="cama_mesa_banho">Cama & Mesa</option>
          <option value="automotivo">Automotivo</option>
          <option value="brinquedos">Brinquedos</option>
          <option value="perfumaria">Perfumaria</option>
        </select>

        <select 
          className="form-control"
          value={minAvaliacao}
          onChange={(e) => { setMinAvaliacao(e.target.value ? Number(e.target.value) : ''); setPage(1); }}
        >
          <option value="">Qualquer Avaliação</option>
          <option value="4">4+ Estrelas</option>
          <option value="3">3+ Estrelas</option>
          <option value="2">2+ Estrelas</option>
          <option value="1">1+ Estrelas</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-wrapper">
          <Loader2 className="spinner" size={48} />
        </div>
      ) : (
        <>
          <div className="products-grid">
            {produtos.map(prod => (
              <ProductCard key={prod.id_produto} produto={prod} />
            ))}
          </div>
          
          {produtos.length === 0 && (
             <div className="empty-state glass-panel">
                <Search size={48} opacity={0.2} />
                <h3>Produto não encontrado</h3>
                <p>Nenhum item com estes filtros foi encontrado na base de dados.</p>
             </div>
          )}

          {total > 12 && (
            <div className="pagination">
              <button 
                className="btn-secondary" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </button>
              
              <div className="page-info">
                <span>Página {page}</span>
                <span className="page-total">de {Math.ceil(total / 12)}</span>
              </div>
              
              <button 
                className="btn-secondary" 
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / 12)}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <ProductFormModal 
          onClose={() => setShowModal(false)} 
          onSuccess={() => { setShowModal(false); fetchProdutos(); }} 
        />
      )}
    </div>
  );
}
