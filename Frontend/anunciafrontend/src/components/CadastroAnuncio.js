import React, { useState } from 'react';
import axios from 'axios';

const CadastroAnuncio = () => {
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [valor, setValor] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newAnuncio = { nome, categoria, valor };

        await axios.post('http://localhost:8000/api/anuncios/', newAnuncio);
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
                    <input type="text" className="form-control" value={categoria} onChange={(e) => setCategoria(e.target.value)} required />
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
