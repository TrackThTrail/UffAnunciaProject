import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrl from './apiConfig';

const MeusAnuncios = () => {
    const [meusAnuncios, setMeusAnuncios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMeusAnuncios = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    alert('Token JWT não encontrado!');
                    return;
                }
                const response = await axios.get(`${apiUrl}/api/meus_anuncios/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setMeusAnuncios(response.data);
            } catch (error) {
                console.error("Erro ao buscar meus anúncios:", error);
            }
        };

        fetchMeusAnuncios();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-primary text-center">Meus Anúncios</h1>
            
            {meusAnuncios.length === 0 ? (
                <div className="alert alert-info text-center">
                    <p>Você ainda não tem anúncios publicados.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/cadastrar')}>
                        Clique aqui para criar um anúncio
                    </button>
                </div>
            ) : (
                <div className="row">
                    {meusAnuncios.map(item => (
                        <div key={item.id} className="col-md-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{item.nome}</h5>
                                    <p className="card-text">
                                        <strong>Categoria:</strong> {item.categoria}
                                    </p>
                                    <p className="card-text">
                                        <strong>Valor:</strong> R$ {item.valor}
                                    </p>
                                    <button 
                                        className="btn btn-info w-100 mt-3" 
                                        onClick={() => navigate(`/meus-chats?id=${item.id}`)}
                                    >
                                        Ir para Meus Chats
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MeusAnuncios;
