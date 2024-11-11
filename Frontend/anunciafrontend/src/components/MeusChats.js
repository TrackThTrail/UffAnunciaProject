// MeusChats.js
import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import axios from 'axios';

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

                const response = await axios.get('https://anunciauffheroku-b998b85f5dfd.herokuapp.com/api/chats/meus_chats/', {
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
        navigate(`/chat?id=${chatId}`)
    };

    return (
        <div className="container mt-4">
            <h2>Meus Chats</h2>
            {chats.length === 0 ? (
                <div className="alert text-center">
                    <p>Você ainda não tem chats.</p>
                </div>
            ) : (
                <ul className="list-group">
                    {chats.map(chat => (
                        <li key={chat.id} className="list-group-item">
                            <h5>Chat com: {chat.usuario_visitante}</h5>
                            <p>Última mensagem: {chat.ultima_mensagem}</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => iniciarChatOwner(chat.id, chat.usuario_visitante)}
                            >
                                Iniciar Chat com visitante
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MeusChats;
