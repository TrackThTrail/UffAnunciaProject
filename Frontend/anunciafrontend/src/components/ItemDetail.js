import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import apiUrl from './apiConfig';

const ItemDetail = () => {
    const { id } = useParams(); // Obtém o ID da URL
    const [item, setItem] = useState(null);
    const [ws, setWs] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loggedUser, setLoggedUser] = useState('');
    const [chat, setChat] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const user = await axios.get(`${apiUrl}/api/get_logged_in_user/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setLoggedUser(user.data);
                
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    alert('Token JWT não encontrado!');
                    return;
                }
                const response = await axios.get(`${apiUrl}/api/anuncios/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Adiciona o token no cabeçalho
                    }
                });
                setItem(response.data);
            } catch (error) {
                console.error("Erro ao buscar o anúncio:", error);
            }
        };

        fetchItem();
    }, [id]);

    useEffect(() => {
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [ws]);

    const iniciarChat = async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(`${apiUrl}/api/chats/iniciar_chat/`, {
            usuarioDono: item.usuario,
            usuarioVisitante: loggedUser,
            anuncio: id,
        }, {
            headers: {
                Authorization: `Bearer ${token}`, 
            }
        });

        setChat(response.data.chat_id);
        setWs(true);
    };

    const enviarMensagem = async () => {
        if (ws && messageInput) {
            setMessages((prevMessages) => [...prevMessages, { content: messageInput }]);
            try {
                await axios.post(`${apiUrl}/api/mensagens/`, {
                    chat: chat,
                    content: messageInput,
                    usuario: loggedUser,
                });
                setMessageInput('');
            } catch (error) {
                console.error('Erro ao salvar a mensagem:', error);
            }
        }
    };

    if (!item) return <p>Carregando...</p>;

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4 mb-4">
                <h1 className="text-primary">{item.nome}</h1>
                <p><strong>Categoria:</strong> {item.categoria}</p>
                <p><strong>Valor:</strong> R$ {item.valor}</p>
                <p><strong>Usuário:</strong> {item.usuario}</p>
                <button className="btn btn-primary mt-3" onClick={iniciarChat}>
                    Iniciar Chat com dono do Anúncio
                </button>
            </div>

            {ws && (
                <div className="card shadow-sm p-4">
                    <h3 className="text-secondary">Chat</h3>
                    <div 
                        style={{
                            maxHeight: '200px', 
                            overflowY: 'scroll', 
                            background: '#f8f9fa', 
                            border: '1px solid #dee2e6', 
                            borderRadius: '5px', 
                            padding: '10px'
                        }}
                    >
                        {messages.map((msg, index) => (
                            <div key={index} className="p-2 mb-2 bg-light rounded">
                                {msg.content}
                            </div>
                        ))}
                    </div>

                    <div className="input-group mt-3">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            className="form-control"
                            placeholder="Digite sua mensagem"
                        />
                        <button className="btn btn-secondary" onClick={enviarMensagem}>
                            Enviar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetail;
