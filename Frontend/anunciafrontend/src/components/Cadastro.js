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
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: '22rem' }}>
                <h2 className="text-center mb-4">Cadastro</h2>
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
                    <label htmlFor="email">Email</label>
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
                    <label htmlFor="password">Senha</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite sua senha"
                    />
                </div>
                <button className="btn btn-primary w-100" onClick={handleRegister}>
                    Cadastrar
                </button>
            </div>
        </div>
    );
}

export default Register;
