// Chat.js
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
                        Authorization: `Bearer ${token}`,  // Adiciona o token no cabeçalho
                    }
                });
                setMessages(response.data.mensagens);
                setUsuarioDono(response.data.chat.usuario_dono)
            } catch (error) {
                console.error("Erro ao buscar mensagens:", error);
            }
        };
        loadChatInfo();
        startSocketConnection();
    
    }, [chatId]);

    const startSocketConnection = async () => {
        const socket = new WebSocket('ws://localhost:8001');
    
        socket.onopen = () => {
            console.log('Conexão WebSocket estabelecida.');
        };
    
        socket.onmessage = (event) => {
            debugger;
            const newMessage = JSON.parse(event.data);
            console.log('Mensasdida:', newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]); // Atualiza as mensagens
        };
    
        socket.onerror = (event) => {
            // Se for um erro de evento, imprima as informações completas
            if (event && event.message) {
                console.error('Erro na conexão WebSocket:', event.message);
                alert(`Erro na conexão WebSocket: ${event.message}`);
            } else {
                // Caso o erro seja um objeto Error (eventualmente)
                console.error('Erro na conexão WebSocket:', event);
                alert(`Erro na conexão WebSocket: ${JSON.stringify(event)}`);
            }
        };
    
        socket.onclose = () => {
            console.log('Conexão WebSocket fechada.');
        };
        setWs(socket);
    }

    const enviarMensagem = async () => {
        if (ws && messageInput) {
            ws.send(JSON.stringify({ message: messageInput, roomId: parseInt(chatId) }));
            setMessages((prevMessages) => [...prevMessages, {'content': messageInput}]);
            // Enviar a mensagem para salvar no Django
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
        <div>
            <h3>Chat com: {'usuarioVisitante'}</h3>
            <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                {messages.map((msg, index) => (
                    <div key={index}>{msg.content}</div>
                ))}
            </div>

            <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Digite sua mensagem"
            />
            <button onClick={enviarMensagem}>Enviar</button>
        </div>
    );
};

export default Chat;
