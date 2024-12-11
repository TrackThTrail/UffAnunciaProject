import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from './apiConfig';
import { useNavigate, useParams } from 'react-router-dom';

const CadastroAnuncio = () => {
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [local, setLocal] = useState('');
    const [valor, setValor] = useState('');

    const locais = [
        { value: 'niteroi', label: 'Niterói' },
        { value: 'rio de janeiro', label: 'Rio de Janeiro' },
        { value: 'sao goncalo', label: 'São Gonçalo' },
        { value: 'oceanica', label: 'Região Oceânica' },
        { value: 'outro', label: 'Outro' }
    ];

    const categorias = [
        { value: 'academico', label: 'Acadêmico' },
        { value: 'alimentos', label: 'Alimentos' },
        { value: 'moradia', label: 'Moradia' },
        { value: 'outros', label: 'Outros' }
    ];

    const navigate = useNavigate();
    const { id } = useParams();  // Para pegar o id da URL se estiver editando

    useEffect(() => {
        if (id) {
            // Se for edição, buscar os dados do anúncio
            const fetchAnuncio = async () => {
                try {
                    const token = localStorage.getItem('accessToken');
                    if (!token) {
                        alert('Token JWT não encontrado!');
                        return;
                    }
                    const response = await axios.post(`${apiUrl}/api/anuncios/get_anuncio/`,{'id': id}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const { nome, categoria, local, valor } = response.data[0];
                    setNome(nome);
                    setCategoria(categoria);
                    setLocal(local);
                    setValor(valor);
                } catch (error) {
                    alert('Erro ao carregar os dados do anúncio.');
                }
            };
            fetchAnuncio();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const anuncio = { nome, categoria, local, valor };
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Token JWT não encontrado!');
            return;
        }

        try {
            if (id) {
                // Se estiver editando, fazer PUT
                await axios.put(`${apiUrl}/api/anuncios/${id}/`, anuncio, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // Se for criação, fazer POST
                await axios.post(`${apiUrl}/api/anuncios/`, anuncio, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            setNome('');
            setCategoria('');
            setLocal('');
            setValor('');
            navigate('/anuncios'); // Após salvar, redireciona para a lista
        } catch (error) {
            alert('Erro ao salvar o anúncio.');
        }
    };

    return (
        <div
            className="container mt-4"
            style={{
                backgroundImage: `url('../background.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                width: '100%',
            }}
        >
            <h1>{id ? 'Editar Anúncio' : 'Cadastrar Anúncio'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nome:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Categoria:</label>
                    <select
                        className="form-control"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        required
                    >
                        <option value="" disabled>Selecione uma categoria</option>
                        {categorias.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Local:</label>
                    <select
                        className="form-control"
                        value={local}
                        onChange={(e) => setLocal(e.target.value)}
                        required
                    >
                        <option value="" disabled>Selecione um local</option>
                        {locais.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Valor:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {id ? 'Atualizar' : 'Cadastrar'}
                </button>
            </form>
        </div>
    );
};

export default CadastroAnuncio;
