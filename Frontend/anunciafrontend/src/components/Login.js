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
            navigate('/anuncios')
            alert('Login bem-sucedido!');
        } catch (error) {
            console.error('Erro ao fazer login', error);
            alert('Credenciais inválidas!');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: '20rem' }}>
                <h2 className="text-center mb-4">Login</h2>
                <div className="form-group mb-3">
                    <label htmlFor="username">Username</label>
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
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite sua senha"
                    />
                </div>
                <button className="btn btn-primary w-100" onClick={handleLogin}>
                    Login
                </button>
                <br></br>
                <button className="btn btn-secondary w-100" onClick={() => navigate('/cadastro')}>
                    Criar uma conta
                </button>
            </div>
        </div>
    );
}

export default Login;
