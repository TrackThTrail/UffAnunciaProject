import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemList = () => {
    const [itens, setItens] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            debugger;
            const response = await axios.get('http://localhost:8000/api/items/');
            setItens(response.data);
        };

        fetchItems();
    }, []);

    return (
        <div>
            <h1>Itens</h1>
            <ul>
                {itens.map(item => (
                    <li key={item.id}>{item.nome}</li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;