import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrl from './apiConfig';


const MeusAnuncios = () => {
    const [meusAnuncios, setMeusAnuncios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchMeusAnuncios = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    alert('Token JWT não encontrado!');
                    return;
                }
                const response = await axios.get(`${apiUrl}/api/meus_anuncios/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Adiciona o token no cabeçalho
                    }
                });
                setMeusAnuncios(response.data);
            } catch (error) {
                console.error("Erro ao buscar meus anúncios:", error);
            }
        };

        fetchMeusAnuncios();
    }, []);

    const handleDelete = async (id)=>{
        if(!window.confirm("Tem certeza que quer excluir esse anuncio?")){
            return;
        }
        try{
            const token = localStorage.getItem('accessToken');
            if(!token){
                alert("Fudeu de vez! Não achou o token jwt");
                return;
            }
            //Faz a requisição DELETE para o backend
            const response = await axios.delete(`${apiUrl}/api/meus_anuncios/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`, //Adiciona o token no cabeçalho
                },
            });
    
            //Atualiza o estado Local removendo o item deletado
            setMeusAnuncios((prevAnuncios) => prevAnuncios.filter((item) => item.id !== id));
            alert('Anuncio deletado com sucesso!');
        }catch(error){
            console.error('Erro ao deletar o anuncio', error.response ? error.response.data: error);
            alert(error);
        }
    }
    

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Meus Anúncios</h1>
            
            {meusAnuncios.length === 0 ? (
                <div className="alert text-center">
                    <p>Você ainda não tem anúncios publicados.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/cadastrar')}>
                        Clique aqui para criar um anúncio
                    </button>
                </div>
            ) : (
                <ul className="list-group">
                    {meusAnuncios.map(item => (
                        <li key={item.id} className="list-group-item">
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <h5>{item.nome}</h5>
                                <button style={{ backgroundColor: "#EB5F5F"}}className="btn btn-info" onClick={() =>handleDelete(item.id)}>
                                Deletar
                                </button>
                            </div>
                            
                            <p>Categoria: {item.categoria}</p>
                            <p>Local: {item.local}</p>
                            <p>Valor: R$ {item.valor}</p>
                            <div className="mt-4">
                                <button className="btn btn-info" onClick={() => navigate(`/meus-chats?id=${item.id}`)}>
                                    Ir para Meus Chats
                                </button>
                                {/* Botão de Edição */}
                                <button 
                                    className="btn btn-warning ms-2" 
                                    onClick={() => navigate(`/editar-anuncio/${item.id}/`)}>
                                    Editar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MeusAnuncios;
