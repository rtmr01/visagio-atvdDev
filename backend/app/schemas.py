from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- Pydantic Models para Produtos ---

class ProdutoBase(BaseModel):
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None

class ProdutoCreate(ProdutoBase):
    pass

class ProdutoUpdate(BaseModel):
    nome_produto: Optional[str] = None
    categoria_produto: Optional[str] = None
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None

class ProdutoResponse(ProdutoBase):
    id_produto: str
    
    class Config:
        from_attributes = True

# Modelo estendido para o catálogo, incluindo a média de avaliação interativamente
class ProdutoCatalogoResponse(ProdutoResponse):
    media_avaliacao: Optional[float] = 0.0
    total_avaliacoes: Optional[int] = 0

class PaginatedProdutosBase(BaseModel):
    total: int
    page: int
    limit: int
    data: List[ProdutoCatalogoResponse]

# --- Pydantic Models para Avaliações ---

class AvaliacaoResponse(BaseModel):
    id_avaliacao: str
    id_pedido: str
    avaliacao: int
    titulo_comentario: Optional[str] = None
    comentario: Optional[str] = None
    data_comentario: Optional[datetime] = None
    data_resposta: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Pydantic Models para Detalhes do Produto (Vendas) ---

class VendaItemResponse(BaseModel):
    id_pedido: str
    preco_BRL: float
    preco_frete: float
    data_venda: Optional[datetime] = None  # Vem de pedido.pedido_compra_timestamp
    nome_vendedor: Optional[str] = None # Vem da relação com vendedor
    
class ProdutoDetalheResponse(ProdutoResponse):
    media_avaliacao: float = 0.0
    total_avaliacoes: int = 0
    total_vendas: int = 0
