import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Trash2, Edit, Loader2 } from 'lucide-react';
import { getProdutoById, getAvaliacoesProduto, getVendasProduto, deleteProduto } from '../services/produtos';
import type { ProdutoDetalhe, Avaliacao, Venda } from '../types/produto';
import ProductFormModal from '../components/ProductFormModal';
import { getImagemCategoria } from '../utils/categoriaImagens';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [produto, setProduto] = useState<ProdutoDetalhe | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [prodRes, avalRes, vendasRes] = await Promise.all([
        getProdutoById(id),
        getAvaliacoesProduto(id),
        getVendasProduto(id)
      ]);
      setProduto(prodRes);
      setAvaliacoes(avalRes);
      setVendas(vendasRes);
    } catch (error) {
      console.error(error);
      alert("Produto não encontrado.");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja apagar este produto? Esta ação não pode ser desfeita.")) {
      try {
        await deleteProduto(id!);
        navigate('/');
      } catch (err) {
        alert("Erro ao deletar produto!");
      }
    }
  };

  if (loading || !produto) {
    return (
      <div className="loading-wrapper">
        <Loader2 className="spinner" size={48} />
      </div>
    );
  }

  const imageUrl = getImagemCategoria(produto.categoria_produto);

  return (
    <div className="detail-container">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Voltar ao Catálogo
      </Link>

      <div className="detail-layout">
        {/* Lado Esquerdo: Info + Dimensões */}
        <div className="product-main-info glass-panel">
          <div className="detail-header">
            <span className="category-badge">{produto.categoria_produto}</span>
            <div className="action-buttons">
              <button className="btn-icon edit" onClick={() => setShowEditModal(true)} title="Editar Produto">
                <Edit size={18} />
              </button>
              <button className="btn-icon delete" onClick={handleDelete} title="Excluir Produto">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          
          {imageUrl && (
            <div className="detail-image" style={{ width: '100%', height: '250px', backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '12px', marginBottom: '2rem' }}></div>
          )}

          <h1 className="detail-title">{produto.nome_produto}</h1>
          <p className="detail-id">ID: {produto.id_produto}</p>

          <div className="dimensions-box">
             <h3>Dimensões Físicas</h3>
             <ul className="dimensions-list">
               <li><span>Peso:</span> <strong>{produto.peso_produto_gramas || '-'} g</strong></li>
               <li><span>Largura:</span> <strong>{produto.largura_centimetros || '-'} cm</strong></li>
               <li><span>Altura:</span> <strong>{produto.altura_centimetros || '-'} cm</strong></li>
               <li><span>Comprimento:</span> <strong>{produto.comprimento_centimetros || '-'} cm</strong></li>
             </ul>
          </div>
        </div>

        {/* Lado Direito: KPis */}
        <div className="product-kpis">
          <div className="kpi-card glass-panel">
            <h3 className="kpi-title">Média de Avaliações</h3>
            <div className="kpi-value rating-value">
              <Star size={32} fill="currentColor" />
              <span>{produto.media_avaliacao.toFixed(1)}</span>
            </div>
            <p className="kpi-subtitle">Baseado em {produto.total_avaliacoes} opiniões</p>
          </div>

          <div className="kpi-card glass-panel">
            <h3 className="kpi-title">Vendas Realizadas</h3>
            <div className="kpi-value">{produto.total_vendas}</div>
            <p className="kpi-subtitle">Pedidos únicos processados</p>
          </div>
        </div>
      </div>

      {/* Tabs / Seções de baixo */}
      <div className="bottom-sections">
        
        {/* Tabela de Vendas */}
        <div className="section-card glass-panel">
          <div className="section-header">
            <h2>Últimas Vendas</h2>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cod. Pedido</th>
                  <th>Preço (R$)</th>
                  <th>Frete (R$)</th>
                  <th>Data</th>
                  <th>Vendedor</th>
                </tr>
              </thead>
              <tbody>
                {vendas.slice(0, 10).map((venda) => (
                  <tr key={venda.id_pedido}>
                    <td className="mono">{venda.id_pedido.substring(0,8)}...</td>
                    <td>R$ {venda.preco_BRL.toFixed(2)}</td>
                    <td>R$ {venda.preco_frete.toFixed(2)}</td>
                    <td>{venda.data_venda ? new Date(venda.data_venda).toLocaleDateString('pt-BR') : '-'}</td>
                    <td>{venda.nome_vendedor || 'Padrão'}</td>
                  </tr>
                ))}
                {vendas.length === 0 && (
                  <tr><td colSpan={5} className="text-center">Nenhuma venda registrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {vendas.length > 10 && <p className="table-footer-note">Exibindo as 10 vendas mais recentes.</p>}
        </div>

        {/* Avaliações */}
        <div className="section-card glass-panel">
          <div className="section-header">
            <h2>Avaliações dos Consumidores</h2>
          </div>
          <div className="reviews-list">
            {avaliacoes.length === 0 ? (
               <p className="text-center empty-reviews">Este produto ainda não possui comentários.</p>
            ) : (
              avaliacoes.slice(0, 10).map((aval) => (
                <div key={aval.id_avaliacao} className="review-item">
                  <div className="review-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < aval.avaliacao ? "#fbbf24" : "transparent"} color={i < aval.avaliacao ? "#fbbf24" : "#4b5563"} />
                    ))}
                  </div>
                  {aval.titulo_comentario && <h4 className="review-title">{aval.titulo_comentario}</h4>}
                  <p className="review-comment">{aval.comentario || 'Sem comentário por escrito.'}</p>
                  {aval.data_comentario && (
                    <span className="review-date">{new Date(aval.data_comentario).toLocaleDateString('pt-BR')}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {showEditModal && (
        <ProductFormModal 
          produto={produto}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => { setShowEditModal(false); fetchDetails(); }}
        />
      )}
    </div>
  );
}
