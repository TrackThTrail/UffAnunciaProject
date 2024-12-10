import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiUrl from './apiConfig';

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/token/`, { username, password });
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);
            setIsAuthenticated(true);
            navigate('/anuncios');
            alert('Login bem-sucedido!');
        } catch (error) {
            console.error('Erro ao fazer login', error);
            alert('Credenciais inválidas!');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ width: '22rem', borderRadius: '10px' }}>
                <h2 className="text-center mb-4" style={{ color: '#007bff' }}>Login</h2>
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
                    <label htmlFor="password" className="fw-semibold">Password</label>
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
                    onClick={handleLogin}>
                    Login
                </button>
                <button 
                    className="btn btn-outline-secondary w-100 fw-bold py-2" 
                    onClick={() => navigate('/cadastro')}>
                    Criar uma conta
                </button>
            </div>
        </div>
    );
}

export default Login;
