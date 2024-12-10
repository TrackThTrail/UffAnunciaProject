import React, { useState } from 'react';
import axios from 'axios';
import apiUrl from './apiConfig';
import { useNavigate } from 'react-router-dom';

const CadastroAnuncio = () => {
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [valor, setValor] = useState('');

    const categorias = [
        { value: 'academico', label: 'Acadêmico' },
        { value: 'alimentos', label: 'Alimentos' },
        { value: 'moradia', label: 'Moradia' },
        { value: 'outros', label: 'Outros' }
    ];

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newAnuncio = { nome, categoria, valor };
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Token JWT não encontrado!');
            return;
        }
        try {
            await axios.post(`${apiUrl}/api/anuncios/`, newAnuncio, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            alert('Anúncio cadastrado com sucesso!');
            setNome('');
            setCategoria('');
            setValor('');
            navigate('/anuncios');
        } catch (error) {
            console.error('Erro ao cadastrar anúncio:', error);
            alert('Erro ao cadastrar o anúncio. Tente novamente.');
        }
    };

    return (
        <div className="container mt-4 d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '500px', borderRadius: '10px' }}>
                <h2 className="text-center text-primary mb-4">Cadastrar Anúncio</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Nome:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Digite o nome do anúncio"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Categoria:</label>
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
                        <label className="form-label fw-semibold">Valor (R$):</label>
                        <input
                            type="number"
                            className="form-control"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            placeholder="Digite o valor"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2">Cadastrar</button>
                </form>
            </div>
        </div>
    );
};

export default CadastroAnuncio;
