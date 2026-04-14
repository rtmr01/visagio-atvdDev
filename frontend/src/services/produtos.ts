import { api } from './api';
import type { Produto, ProdutoDetalhe, PaginatedProdutos, Avaliacao, Venda } from '../types/produto';

export const getProdutos = async (params: { page: number, limit: number, search?: string, categoria?: string, min_avaliacao?: number }) => {
    const res = await api.get<PaginatedProdutos>('/produtos', { params });
    return res.data;
};

export const getProdutosStats = async () => {
    const res = await api.get('/produtos/stats');
    return res.data;
};

export const getProdutoById = async (id: string) => {
    const res = await api.get<ProdutoDetalhe>(`/produtos/${id}`);
    return res.data;
};

export const getAvaliacoesProduto = async (id: string) => {
    const res = await api.get<Avaliacao[]>(`/produtos/${id}/avaliacoes`);
    return res.data;
};

export const getVendasProduto = async (id: string) => {
    const res = await api.get<Venda[]>(`/produtos/${id}/vendas`);
    return res.data;
};

export const createProduto = async (produto: Partial<Produto>) => {
    const res = await api.post<Produto>('/produtos', produto);
    return res.data;
};

export const updateProduto = async (id: string, produto: Partial<Produto>) => {
    const res = await api.put<Produto>(`/produtos/${id}`, produto);
    return res.data;
};

export const deleteProduto = async (id: string) => {
    await api.delete(`/produtos/${id}`);
};
