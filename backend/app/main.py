from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import produtos
from app.database import Base, engine

# Não usaremos Base.metadata.create_all pois usaremos Alembic
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de Compras Online - E-Commerce Visagio",
    description="API para gerenciamento de pedidos, produtos, consumidores e vendedores.",
    version="1.0.0",
)

origins = [
    "http://localhost:5173", # Porta padrao do Vite
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(produtos.router)

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "API rodando com sucesso!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
