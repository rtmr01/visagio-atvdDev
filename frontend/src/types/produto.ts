export interface Produto {
    id_produto: string;
    nome_produto: string;
    categoria_produto: string;
    peso_produto_gramas?: number | null;
    comprimento_centimetros?: number | null;
    altura_centimetros?: number | null;
    largura_centimetros?: number | null;
}

export interface ProdutoCatalogo extends Produto {
    media_avaliacao: number;
    total_avaliacoes: number;
}

export interface ProdutoDetalhe extends ProdutoCatalogo {
    total_vendas: number;
}

export interface Avaliacao {
    id_avaliacao: string;
    id_pedido: string;
    avaliacao: number;
    titulo_comentario?: string;
    comentario?: string;
    data_comentario?: string;
    data_resposta?: string;
}

export interface Venda {
    id_pedido: string;
    preco_BRL: number;
    preco_frete: number;
    data_venda?: string;
    nome_vendedor?: string;
}

export interface PaginatedProdutos {
    total: number;
    page: number;
    limit: number;
    data: ProdutoCatalogo[];
}
