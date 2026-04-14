import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { createProduto, updateProduto } from '../services/produtos';
import type { Produto } from '../types/produto';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  produto?: Produto; // Se passado, é edição
}

export default function ProductFormModal({ onClose, onSuccess, produto }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_produto: '',
    categoria_produto: '',
    peso_produto_gramas: '',
    comprimento_centimetros: '',
    altura_centimetros: '',
    largura_centimetros: ''
  });

  useEffect(() => {
    if (produto) {
      setFormData({
        nome_produto: produto.nome_produto || '',
        categoria_produto: produto.categoria_produto || '',
        peso_produto_gramas: produto.peso_produto_gramas?.toString() || '',
        comprimento_centimetros: produto.comprimento_centimetros?.toString() || '',
        altura_centimetros: produto.altura_centimetros?.toString() || '',
        largura_centimetros: produto.largura_centimetros?.toString() || ''
      });
    }
  }, [produto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Converte os dados pra numero quando existe
    const payload = {
      nome_produto: formData.nome_produto,
      categoria_produto: formData.categoria_produto,
      ...(formData.peso_produto_gramas && { peso_produto_gramas: parseFloat(formData.peso_produto_gramas) }),
      ...(formData.comprimento_centimetros && { comprimento_centimetros: parseFloat(formData.comprimento_centimetros) }),
      ...(formData.altura_centimetros && { altura_centimetros: parseFloat(formData.altura_centimetros) }),
      ...(formData.largura_centimetros && { largura_centimetros: parseFloat(formData.largura_centimetros) }),
    };

    try {
      if (produto) {
        await updateProduto(produto.id_produto, payload);
      } else {
        await createProduto(payload);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar produto!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{produto ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Produto *</label>
            <input 
              required
              type="text" 
              className="form-control" 
              value={formData.nome_produto}
              onChange={e => setFormData({...formData, nome_produto: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Categoria *</label>
            <input 
              required
              type="text" 
              className="form-control" 
              value={formData.categoria_produto}
              placeholder="Ex: informatica_acessorios"
              onChange={e => setFormData({...formData, categoria_produto: e.target.value})}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Peso (gramas)</label>
              <input 
                type="number" step="0.01" className="form-control" 
                value={formData.peso_produto_gramas}
                onChange={e => setFormData({...formData, peso_produto_gramas: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Comprimento (cm)</label>
              <input 
                type="number" step="0.01" className="form-control" 
                value={formData.comprimento_centimetros}
                onChange={e => setFormData({...formData, comprimento_centimetros: e.target.value})}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Altura (cm)</label>
              <input 
                type="number" step="0.01" className="form-control" 
                value={formData.altura_centimetros}
                onChange={e => setFormData({...formData, altura_centimetros: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Largura (cm)</label>
              <input 
                type="number" step="0.01" className="form-control" 
                value={formData.largura_centimetros}
                onChange={e => setFormData({...formData, largura_centimetros: e.target.value})}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
              {produto ? 'Atualizar Dados' : 'Criar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
