import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MeusAnuncios = () => {
    const [meusAnuncios, setMeusAnuncios] = useState([]);

    useEffect(() => {
        const fetchMeusAnuncios = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/meus_anuncios/', {
                    // headers: {
                    //     Authorization: `Bearer ${localStorage.getItem('token')}` // Envia o token de autenticação
                    // }
                });
                setMeusAnuncios(response.data);
            } catch (error) {
                console.error("Erro ao buscar meus anúncios:", error);
            }
        };

        fetchMeusAnuncios();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Meus Anúncios</h1>
            <ul className="list-group">
                {meusAnuncios.map(item => (
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

export default MeusAnuncios;
