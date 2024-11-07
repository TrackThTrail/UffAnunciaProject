import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ItemDetail = () => {
    const { id } = useParams(); // Obtém o ID da URL
    const [item, setItem] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/anuncios/${id}/`);
                setItem(response.data);
            } catch (error) {
                console.error("Erro ao buscar o anúncio:", error);
            }
        };

        fetchItem();
    }, [id]);

    if (!item) return <p>Carregando...</p>;

    return (
        <div className="container mt-4">
            <h1>{item.nome}</h1>
            <p><strong>Categoria:</strong> {item.categoria}</p>
            <p><strong>Valor:</strong> R$ {item.valor}</p>
            <p><strong>Usuário:</strong> {item.usuario}</p>
        </div>
    );
};

export default ItemDetail;
