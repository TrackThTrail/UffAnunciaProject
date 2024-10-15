import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemList = () => {
    const [itens, setItens] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const response = await axios.get('http://localhost:8000/api/anuncios/');
            setItens(response.data);
        };

        fetchItems();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Itens</h1>
            <ul className="list-group">
                {itens.map(item => (
                    <li key={item.id} className="list-group-item">
                        {item.nome}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;
