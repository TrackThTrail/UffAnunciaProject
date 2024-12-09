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
    const [rating, setRating] = useState(1);
    const [currentEvaluation, setCurrentEvaluation] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const user = await axios.get(`${apiUrl}/api/get_logged_in_user/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setLoggedUser(user.data)
                

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

                const evalResponse = await axios.get(`${apiUrl}/api/avaliacoes/get_current_evaluation/`, {
                    params: { anuncio_id: id },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setCurrentEvaluation(evalResponse.data);
            } catch (error) {
                console.error("Erro ao buscar o anúncio:", error);
            }
        };

        fetchItem();

        const loadChatInfo = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    alert('Token JWT não encontrado!');
                    return;
                }
                const response = await axios.get(`${apiUrl}/api/chats/${id}/get_chat_messages/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Adiciona o token no cabeçalho
                    }
                });
                debugger;
                setMessages(response.data.mensagens);
            } catch (error) {
                console.error("Erro ao buscar mensagens:", error);
            }
        };
        loadChatInfo();
    }, [id]);

    useEffect(() => {
        // Limpeza do WebSocket quando o componente for desmontado
        return () => {
            if (ws) {
                // ws.close();
            }
        };
    }, [ws]);

    

    const iniciarChat = async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(`${apiUrl}/api/chats/iniciar_chat/`, {
            usuarioDono: item.usuario,  // Pode ser o nome do usuário ou outro identificador
            usuarioVisitante: loggedUser,
            anuncio: id, // Id do item do chat

        },{
            headers: {
                Authorization: `Bearer ${token}`,  // Adiciona o token no cabeçalho
            }
        });

        setChat(response.data.chat_id);
        // const socket = new WebSocket('ws://localhost:8001');
    
        // socket.onopen = () => {
        //     console.log('Conexão WebSocket estabelecida.');
        // };
    
        // socket.onmessage = (event) => {
        //     const newMessage = JSON.parse(event.data);
        //     console.log('Mensagem recebida:', newMessage);
        //     setMessages((prevMessages) => [...prevMessages, newMessage]); // Atualiza as mensagens
        // };
    
        // socket.onerror = (event) => {
        //     // Se for um erro de evento, imprima as informações completas
        //     if (event && event.message) {
        //         console.error('Erro na conexão WebSocket:', event.message);
        //         alert(`Erro na conexão WebSocket: ${event.message}`);
        //     } else {
        //         // Caso o erro seja um objeto Error (eventualmente)
        //         console.error('Erro na conexão WebSocket:', event);
        //         alert(`Erro na conexão WebSocket: ${JSON.stringify(event)}`);
        //     }
        // };
    
        // socket.onclose = () => {
        //     console.log('Conexão WebSocket fechada.');
        // };
    
        setWs(true);  // Atualiza o estado do WebSocket
    };

    const enviarMensagem = async () => {

        if (ws && messageInput) {
            // Enviar mensagem através do WebSocket
            const roomId = chat;
            setMessages((prevMessages) => [...prevMessages, {'content': messageInput}]);
            // ws.send(JSON.stringify({ message: messageInput, roomId: roomId}));
    
            // Enviar a mensagem para o Django para salvar no banco
            try {
                await axios.post(`${apiUrl}/api/mensagens/`, {
                    chat: chat,  // Pode ser o nome do usuário ou outro identificador
                    content: messageInput,
                    usuario: loggedUser, // Id do item do chat
                });
                setMessageInput(''); // Limpar o campo de input
            } catch (error) {
                console.error('Erro ao salvar a mensagem:', error);
            }
        }
    };

    const handleRatingSubmit = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert('Token JWT não encontrado!');
                return;
            }
            await axios.post(
                `${apiUrl}/api/anuncios/${id}/avaliar/`,
                { rating }, // Dados enviados ao backend
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                    }
                }
            );
            alert('Avaliação enviada com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar avaliação:', error);
            alert('Não foi possível enviar a avaliação.');
        }
    };

    if (!item) return <p>Carregando...</p>;

    return (
        <div className="container mt-4">
            <h1>{item.nome}</h1>
            <p><strong>Categoria:</strong> {item.categoria}</p>
            <p><strong>Valor:</strong> R$ {item.valor}</p>
            <p><strong>Usuário:</strong> {item.usuario}</p>

            <button className="btn btn-primary" onClick={iniciarChat}>
                Iniciar Chat com dono do Anúncio
            </button>

            <div className="mt-4">
                <h3>Avalie este anúncio:</h3>
                {currentEvaluation ? (
                    <p>Sua avaliação: {currentEvaluation.nota}</p>
                ) : (
                    <div className="d-flex align-items-center">
                        <select
                            className="form-select me-2"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5].map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                        <button className="btn btn-success" onClick={handleRatingSubmit}>
                            Avaliar
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <h3>Mensagens do Chat:</h3>
                {messages.length > 0 ? (
                    <ul>
                        {messages.map((message, index) => (
                            <li key={index}>{message.content}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Sem mensagens ainda.</p>
                )}
            </div>
        </div>
    );
};

export default ItemDetail;
