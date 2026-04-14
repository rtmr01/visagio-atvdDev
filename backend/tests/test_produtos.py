from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)

def test_get_produtos():
    response = client.get("/produtos")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert "total" in data
    assert isinstance(data["data"], list)

def test_create_produto():
    new_product = {
        "nome_produto": "Produto Teste Automatizado",
        "categoria_produto": "informatica_acessorios",
        "peso_produto_gramas": 1500,
        "comprimento_centimetros": 30,
        "altura_centimetros": 10,
        "largura_centimetros": 20
    }
    response = client.post("/produtos", json=new_product)
    assert response.status_code == 201
    data = response.json()
    assert data["nome_produto"] == new_product["nome_produto"]
    assert "id_produto" in data

def test_get_produto_nao_existente():
    fake_id = uuid.uuid4().hex
    response = client.get(f"/produtos/{fake_id}")
    assert response.status_code == 404
