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
                        Authorization: `Bearer ${token}`,  // Adiciona o token no cabeçalho
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
            <h1 className="mb-4">Meus Anúncios</h1>
            
            {meusAnuncios.length === 0 ? (
                <div className="alert text-center">
                    <p>Você ainda não tem anúncios publicados.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/cadastrar')}>
                        Clique aqui para criar um anúncio
                    </button>
                </div>
            ) : (
                <ul className="list-group">
                    {meusAnuncios.map(item => (
                        <li key={item.id} className="list-group-item">
                            <h5>{item.nome}</h5>
                            <p>Categoria: {item.categoria}</p>
                            <p>Valor: R$ {item.valor}</p>
                            <div className="mt-4">
                                <button className="btn btn-info" onClick={() => navigate(`/meus-chats?id=${item.id}`)}>
                                    Ir para Meus Chats
                                </button>
                                {/* Botão de Edição */}
                                <button 
                                    className="btn btn-warning ms-2" 
                                    onClick={() => navigate(`/editar-anuncio/${item.id}/`)}>
                                    Editar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MeusAnuncios;
