import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrl from './apiConfig';

const ItemList = () => {
    const [itens, setItens] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    alert('Token JWT não encontrado!');
                    return;
                }
                const response = await axios.get(`${apiUrl}/api/anuncios/`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                    }
                });
                setItens(response.data);
            } catch (error) {
                console.error("Erro ao buscar anúncios:", error);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-primary fw-bold">Itens</h1>
            {itens.length === 0 ? (
                <p className="text-muted">Nenhum item disponível no momento.</p>
            ) : (
                <div className="row">
                    {itens.map(item => (
                        <div 
                            key={item.id} 
                            className="col-md-4 mb-4" 
                            onClick={() => navigate(`/anuncios/${item.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{item.nome}</h5>
                                    <p className="card-text">
                                        <strong>Categoria:</strong> {item.categoria}
                                    </p>
                                    <p className="card-text">
                                        <strong>Valor:</strong> R$ {item.valor}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemList;
