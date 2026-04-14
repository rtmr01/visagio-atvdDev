import os
import sys
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import insert

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import engine
from app.models.avaliacao_pedido import AvaliacaoPedido

def fix_avaliacoes():
    with Session(engine) as session:
        if session.query(AvaliacaoPedido).count() > 0:
            print("Avaliações já carregadas.")
            return

        base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../banco"))
        print("-> Carregando Avaliações e removendo duplicatas...")
        
        df_aval = pd.read_csv(os.path.join(base_path, "fat_avaliacoes_pedidos.csv"))
        df_aval = df_aval.drop_duplicates(subset=["id_avaliacao"])  # REMOVE DUPLICATAS
        
        df_aval["avaliacao"] = df_aval["avaliacao"].fillna(5).astype(int)
        df_aval["data_comentario"] = pd.to_datetime(df_aval["data_comentario"])
        df_aval["data_resposta"] = pd.to_datetime(df_aval["data_resposta"])
        df_aval = df_aval.replace({np.nan: None, pd.NaT: None})
        
        aval_dicts = df_aval.to_dict(orient="records")
        for i in range(0, len(aval_dicts), 10000):
            session.execute(insert(AvaliacaoPedido), aval_dicts[i:i+10000])
        
        session.commit()
        print("Avaliações finalizadas com sucesso! Tabela preenchida.")

if __name__ == "__main__":
    fix_avaliacoes()
