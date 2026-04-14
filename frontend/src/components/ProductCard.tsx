import { Link } from 'react-router-dom';
import { Package, Star } from 'lucide-react';
import type { ProdutoCatalogo } from '../types/produto';
import { getImagemCategoria } from '../utils/categoriaImagens';
import './ProductCard.css';

interface Props {
  produto: ProdutoCatalogo;
}

export default function ProductCard({ produto }: Props) {
  const imageUrl = getImagemCategoria(produto.categoria_produto);
  
  return (
    <Link to={`/produtos/${produto.id_produto}`} className="glass-panel product-card">
      <div className="card-image-placeholder" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '180px' }}>
        {!imageUrl && <Package size={48} opacity={0.3} />}
      </div>
      <div className="card-content">
        <div className="card-header">
           <span className="category-badge">{produto.categoria_produto}</span>
           <div className="rating">
              <Star size={14} fill="currentColor" />
              <span>{produto.media_avaliacao.toFixed(1)}</span>
              <span className="rating-count">({produto.total_avaliacoes})</span>
           </div>
        </div>
        <h3 className="product-title" title={produto.nome_produto}>{produto.nome_produto}</h3>
        <p className="product-weight">
          {produto.peso_produto_gramas ? `${produto.peso_produto_gramas}g` : 'Peso Indefinido'}
        </p>
      </div>
    </Link>
  );
}
