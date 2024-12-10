import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import apiUrl from './apiConfig';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const chatId = queryParams.get('id');
    const [ws, setWs] = useState(null);
    const [usuarioDono, setUsuarioDono] = useState('');

    useEffect(() => {
        // Limpeza do WebSocket quando o componente for desmontado
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [ws]);

    useEffect(() => {
        // Carregar as mensagens do chat ao montar o componente
        const loadChatInfo = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    alert('Token JWT não encontrado!');
                    return;
                }
                const response = await axios.get(`${apiUrl}/api/chats/${chatId}/load_chat_data/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setMessages(response.data.mensagens);
                setUsuarioDono(response.data.chat.usuario_dono);
            } catch (error) {
                console.error("Erro ao buscar mensagens:", error);
            }
        };
        loadChatInfo();
        startSocketConnection();
    }, [chatId]);

    const startSocketConnection = () => {
        const socket = new WebSocket('ws://localhost:8001');
        socket.onopen = () => {
            console.log('Conexão WebSocket estabelecida.');
        };
        socket.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };
        socket.onerror = (event) => {
            console.error('Erro na conexão WebSocket:', event);
        };
        socket.onclose = () => {
            console.log('Conexão WebSocket fechada.');
        };
        setWs(socket);
    };

    const enviarMensagem = async () => {
        if (ws && messageInput) {
            ws.send(JSON.stringify({ message: messageInput, roomId: parseInt(chatId) }));
            setMessages((prevMessages) => [...prevMessages, { content: messageInput }]);
            try {
                await axios.post(`${apiUrl}/api/mensagens/`, {
                    chat: chatId,
                    content: messageInput,
                    usuario: usuarioDono,
                });
                setMessageInput('');
            } catch (error) {
                console.error('Erro ao salvar a mensagem:', error);
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4">
                <h3 className="text-primary">Chat com: {usuarioDono || 'Visitante'}</h3>
                <div
                    style={{
                        maxHeight: '300px',
                        overflowY: 'scroll',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '5px',
                        padding: '10px',
                        marginBottom: '20px',
                    }}
                >
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className="p-2 mb-2 bg-light rounded"
                            style={{
                                textAlign: usuarioDono === msg.usuario ? 'left' : 'right',
                            }}
                        >
                            {msg.content}
                        </div>
                    ))}
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Digite sua mensagem"
                        className="form-control"
                    />
                    <button
                        onClick={enviarMensagem}
                        className="btn btn-primary"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
