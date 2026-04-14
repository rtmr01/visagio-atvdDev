import os
import sys
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import insert

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import engine
from app.models.consumidor import Consumidor
from app.models.produto import Produto
from app.models.vendedor import Vendedor
from app.models.pedido import Pedido
from app.models.item_pedido import ItemPedido
from app.models.avaliacao_pedido import AvaliacaoPedido

def load_data():
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../csv-base"))
    
    print("Iniciando a carga de dados...")
    
    with Session(engine) as session:
        if session.query(Consumidor).first():
            print("Dados já parecem existir no banco. Abortando.")
            return

        print("-> Carregando Consumidores...")
        df_cons = pd.read_csv(os.path.join(base_path, "dim_consumidores.csv"))
        df_cons["prefixo_cep"] = df_cons["prefixo_cep"].astype(str).fillna("")
        df_cons["nome_consumidor"] = df_cons["nome_consumidor"].fillna("Desconhecido")
        df_cons["cidade"] = df_cons["cidade"].fillna("Desconhecida")
        df_cons["estado"] = df_cons["estado"].fillna("NA")
        df_cons = df_cons.replace({np.nan: None})
        session.execute(insert(Consumidor), df_cons.to_dict(orient="records"))
        session.commit()
        
        print("-> Carregando Produtos...")
        df_prod = pd.read_csv(os.path.join(base_path, "dim_produtos.csv"))
        df_prod["nome_produto"] = df_prod["nome_produto"].fillna("Sem Nome")
        df_prod["categoria_produto"] = df_prod["categoria_produto"].fillna("Sem Categoria")
        df_prod = df_prod.replace({np.nan: None})
        session.execute(insert(Produto), df_prod.to_dict(orient="records"))
        session.commit()
        
        print("-> Carregando Vendedores...")
        df_vend = pd.read_csv(os.path.join(base_path, "dim_vendedores.csv"))
        df_vend["prefixo_cep"] = df_vend["prefixo_cep"].astype(str).fillna("")
        df_vend["nome_vendedor"] = df_vend["nome_vendedor"].fillna("Desconhecido")
        df_vend["cidade"] = df_vend["cidade"].fillna("Desconhecida")
        df_vend["estado"] = df_vend["estado"].fillna("NA")
        df_vend = df_vend.replace({np.nan: None})
        session.execute(insert(Vendedor), df_vend.to_dict(orient="records"))
        session.commit()
        
        print("-> Carregando Pedidos...")
        df_ped = pd.read_csv(os.path.join(base_path, "fat_pedidos.csv"))
        df_ped["status"] = df_ped["status"].fillna("Desconhecido")
        df_ped["pedido_compra_timestamp"] = pd.to_datetime(df_ped["pedido_compra_timestamp"])
        df_ped["pedido_entregue_timestamp"] = pd.to_datetime(df_ped["pedido_entregue_timestamp"])
        df_ped["data_estimada_entrega"] = pd.to_datetime(df_ped["data_estimada_entrega"]).dt.date
        df_ped = df_ped.replace({np.nan: None, pd.NaT: None})
        pedidos_dicts = df_ped.to_dict(orient="records")
        for i in range(0, len(pedidos_dicts), 10000):
            session.execute(insert(Pedido), pedidos_dicts[i:i+10000])
        session.commit()
        
        print("-> Carregando Itens dos Pedidos...")
        df_itens = pd.read_csv(os.path.join(base_path, "fat_itens_pedidos.csv"))
        df_itens["preco_BRL"] = df_itens["preco_BRL"].fillna(0.0)
        df_itens["preco_frete"] = df_itens["preco_frete"].fillna(0.0)
        df_itens = df_itens.replace({np.nan: None})
        itens_dicts = df_itens.to_dict(orient="records")
        for i in range(0, len(itens_dicts), 10000):
            session.execute(insert(ItemPedido), itens_dicts[i:i+10000])
        session.commit()
        
        print("-> Carregando Avaliações...")
        df_aval = pd.read_csv(os.path.join(base_path, "fat_avaliacoes_pedidos.csv"))
        df_aval["avaliacao"] = df_aval["avaliacao"].fillna(5).astype(int)
        df_aval["data_comentario"] = pd.to_datetime(df_aval["data_comentario"])
        df_aval["data_resposta"] = pd.to_datetime(df_aval["data_resposta"])
        df_aval = df_aval.replace({np.nan: None, pd.NaT: None})
        aval_dicts = df_aval.to_dict(orient="records")
        for i in range(0, len(aval_dicts), 10000):
            session.execute(insert(AvaliacaoPedido), aval_dicts[i:i+10000])
        session.commit()

        print("Carga de dados concluída com sucesso! 🎉")

if __name__ == "__main__":
    load_data()
