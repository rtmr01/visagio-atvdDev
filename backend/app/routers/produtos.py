from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
import uuid

from app.database import get_db
from app.models.produto import Produto
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.models.item_pedido import ItemPedido
from app.models.pedido import Pedido
from app.models.vendedor import Vendedor
import app.schemas as schemas

router = APIRouter(prefix="/produtos", tags=["Produtos"])

@router.get("/stats")
def get_produtos_stats(db: Session = Depends(get_db)):
    total_produtos = db.query(Produto).count()
    media_global = db.query(func.avg(AvaliacaoPedido.avaliacao)).scalar()
    
    # Categoria mais comum
    cat_comum = db.query(Produto.categoria_produto, func.count(Produto.id_produto).label('qtd')) \
                  .group_by(Produto.categoria_produto) \
                  .order_by(func.count(Produto.id_produto).desc()) \
                  .first()
                  
    return {
        "total_produtos": total_produtos,
        "media_global": round(media_global or 0, 2),
        "top_categoria": cat_comum[0] if cat_comum else "Nenhuma"
    }

@router.get("", response_model=schemas.PaginatedProdutosBase)
def get_produtos(
    search: Optional[str] = None,
    categoria: Optional[str] = None,
    min_avaliacao: Optional[float] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(
        Produto,
        func.avg(AvaliacaoPedido.avaliacao).label("media_avaliacao"),
        func.count(AvaliacaoPedido.id_avaliacao.distinct()).label("total_avaliacoes")
    ).outerjoin(ItemPedido, Produto.id_produto == ItemPedido.id_produto)\
     .outerjoin(Pedido, ItemPedido.id_pedido == Pedido.id_pedido)\
     .outerjoin(AvaliacaoPedido, Pedido.id_pedido == AvaliacaoPedido.id_pedido)

    if search:
        query = query.filter(or_(
            Produto.nome_produto.ilike(f"%{search}%"),
            Produto.categoria_produto.ilike(f"%{search}%")
        ))
    if categoria:
        query = query.filter(Produto.categoria_produto == categoria)

    query = query.group_by(Produto.id_produto)
    
    if min_avaliacao is not None:
        query = query.having(func.avg(AvaliacaoPedido.avaliacao) >= min_avaliacao)
    
    total = query.count()
    
    # Paginação
    produtos = query.offset((page - 1) * limit).limit(limit).all()
    
    results = []
    for prod, media, count in produtos:
        prod_dict = schemas.ProdutoCatalogoResponse.model_validate(prod)
        prod_dict.media_avaliacao = round(media, 1) if media else 0.0
        prod_dict.total_avaliacoes = count
        results.append(prod_dict)

    return schemas.PaginatedProdutosBase(
        total=total,
        page=page,
        limit=limit,
        data=results
    )

@router.get("/{id_produto}", response_model=schemas.ProdutoDetalheResponse)
def get_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    agregados = db.query(
        func.avg(AvaliacaoPedido.avaliacao).label("media"),
        func.count(AvaliacaoPedido.id_avaliacao.distinct()).label("total_ava"),
        func.count(ItemPedido.id_item).label("total_vendas")
    ).select_from(Produto)\
     .outerjoin(ItemPedido, Produto.id_produto == ItemPedido.id_produto)\
     .outerjoin(Pedido, ItemPedido.id_pedido == Pedido.id_pedido)\
     .outerjoin(AvaliacaoPedido, Pedido.id_pedido == AvaliacaoPedido.id_pedido)\
     .filter(Produto.id_produto == id_produto)\
     .first()

    response = schemas.ProdutoDetalheResponse.model_validate(produto)
    response.media_avaliacao = round(agregados.media, 1) if agregados and agregados.media else 0.0
    response.total_avaliacoes = agregados.total_ava if agregados else 0
    response.total_vendas = agregados.total_vendas if agregados else 0

    return response

@router.post("", response_model=schemas.ProdutoResponse, status_code=status.HTTP_201_CREATED)
def create_produto(produto: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    db_produto = Produto(
        id_produto=uuid.uuid4().hex,
        **produto.model_dump()
    )
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto

@router.put("/{id_produto}", response_model=schemas.ProdutoResponse)
def update_produto(id_produto: str, produto: schemas.ProdutoUpdate, db: Session = Depends(get_db)):
    db_produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    update_data = produto.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_produto, key, value)
        
    db.commit()
    db.refresh(db_produto)
    return db_produto

@router.delete("/{id_produto}", status_code=status.HTTP_204_NO_CONTENT)
def delete_produto(id_produto: str, db: Session = Depends(get_db)):
    db_produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    db.delete(db_produto)
    db.commit()
    return None

@router.get("/{id_produto}/avaliacoes", response_model=List[schemas.AvaliacaoResponse])
def get_avaliacoes_produto(id_produto: str, db: Session = Depends(get_db)):
    avaliacoes = db.query(AvaliacaoPedido)\
        .join(Pedido, Pedido.id_pedido == AvaliacaoPedido.id_pedido)\
        .join(ItemPedido, ItemPedido.id_pedido == Pedido.id_pedido)\
        .filter(ItemPedido.id_produto == id_produto)\
        .group_by(AvaliacaoPedido.id_avaliacao)\
        .all()
    return avaliacoes

@router.get("/{id_produto}/vendas", response_model=List[schemas.VendaItemResponse])
def get_vendas_produto(id_produto: str, db: Session = Depends(get_db)):
    vendas = db.query(
        ItemPedido.id_pedido,
        ItemPedido.preco_BRL,
        ItemPedido.preco_frete,
        Pedido.pedido_compra_timestamp.label("data_venda"),
        Vendedor.nome_vendedor
    ).join(Pedido, Pedido.id_pedido == ItemPedido.id_pedido)\
     .join(Vendedor, Vendedor.id_vendedor == ItemPedido.id_vendedor)\
     .filter(ItemPedido.id_produto == id_produto)\
     .order_by(Pedido.pedido_compra_timestamp.desc())\
     .all()
    
    return [schemas.VendaItemResponse(
        id_pedido=v.id_pedido,
        preco_BRL=v.preco_BRL,
        preco_frete=v.preco_frete,
        data_venda=v.data_venda,
        nome_vendedor=v.nome_vendedor
    ) for v in vendas]
