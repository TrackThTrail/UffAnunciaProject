import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrl from './apiConfig';

const MeusChats = () => {
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    alert('Token JWT não encontrado!');
                    return;
                }

                const response = await axios.get(`${apiUrl}/api/chats/meus_chats/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setChats(response.data);
            } catch (error) {
                console.error("Erro ao buscar chats:", error);
            }
        };

        fetchChats();
    }, []);

    const iniciarChatOwner = (chatId) => {
        navigate(`/chat?id=${chatId}`);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center text-primary mb-4">Meus Chats</h2>
            {chats.length === 0 ? (
                <div className="alert alert-info text-center">
                    <p>Você ainda não tem chats ativos.</p>
                </div>
            ) : (
                <div className="row">
                    {chats.map(chat => (
                        <div key={chat.id} className="col-md-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">Chat com: {chat.usuario_visitante}</h5>
                                    <p className="card-text">
                                        <strong>Última mensagem:</strong> {chat.ultima_mensagem || 'Sem mensagens'}
                                    </p>
                                    <button
                                        className="btn btn-primary w-100 mt-3"
                                        onClick={() => iniciarChatOwner(chat.id)}
                                    >
                                        Continuar Conversa
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

export default MeusChats;
