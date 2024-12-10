import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiUrl from './apiConfig';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/cadastro/`, { username, email, password });
            if (response.status === 201) {
                alert('Cadastro realizado com sucesso!');
                navigate('/');
            }
        } catch (error) {
            console.error('Erro ao fazer cadastro', error);
            alert('Erro ao cadastrar. Verifique os dados e tente novamente.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ width: '22rem', borderRadius: '10px' }}>
                <h2 className="text-center mb-4" style={{ color: '#007bff' }}>Cadastro</h2>
                <div className="form-group mb-3">
                    <label htmlFor="username" className="fw-semibold">Username</label>
                    <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Digite seu username"
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="email" className="fw-semibold">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite seu email"
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="password" className="fw-semibold">Senha</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite sua senha"
                    />
                </div>
                <button 
                    className="btn btn-primary w-100 fw-bold py-2 mb-2" 
                    onClick={handleRegister}>
                    Cadastrar
                </button>
                <button 
                    className="btn btn-outline-secondary w-100 fw-bold py-2" 
                    onClick={() => navigate('/')}>
                    Voltar para o Login
                </button>
            </div>
        </div>
    );
}

export default Register;
