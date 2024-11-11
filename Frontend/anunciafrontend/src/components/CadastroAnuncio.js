import React, { useState } from 'react';
import axios from 'axios';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newAnuncio = { nome, categoria, valor };
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Token JWT não encontrado!');
            return;
        }
        await axios.post('https://anunciauffheroku-b998b85f5dfd.herokuapp.com/api/anuncios/', newAnuncio, {
            headers: {
                Authorization: `Bearer ${token}`,  // Adiciona o token no cabeçalho
            }
        });
        setNome('');
        setCategoria('');
        setValor('');
    };

    return (
        <div className="container mt-4">
            <h1>Cadastrar Anúncio</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nome:</label>
                    <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} required />
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
                    <label className="form-label">Valor:</label>
                    <input type="text" className="form-control" value={valor} onChange={(e) => setValor(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Cadastrar</button>
            </form>
        </div>
    );
};

export default CadastroAnuncio;
