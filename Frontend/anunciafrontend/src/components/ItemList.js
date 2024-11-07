import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemList = () => {
    const [itens, setItens] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/anuncios/');
                setItens(response.data);
            } catch (error) {
                console.error("Erro ao buscar anúncios:", error);
            }
        };

        fetchItems();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Itens</h1>
            <ul className="list-group">
                {itens.map(item => (
                    <li key={item.id} className="list-group-item">
                        <h5>{item.nome}</h5>
                        <p>Categoria: {item.categoria}</p>
                        <p>Valor: R$ {item.valor}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;
