import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ItemList from './components/ItemList';
import CadastroAnuncio from './components/CadastroAnuncio';
import NavBar from './components/NavBar';
import ItemDetail from './components/ItemDetail';
import MeusAnuncios from './components/MeusAnuncios';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import MeusChats from './components/MeusChats';
import { useEffect, useState } from 'react';
import Chat from './components/Chat';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verifica se o token de autenticação existe no localStorage
        const token = localStorage.getItem('accessToken');
        setIsAuthenticated(!!token); // Se o token existe, define como autenticado
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    return (
        <Router>
            <div>
                {isAuthenticated && <NavBar setIsAuthenticated={setIsAuthenticated} />}
                <Routes>
                    <Route path="/" element={
                            isAuthenticated ? <Navigate to="/anuncios" /> : <Login onLogin={handleLogin} setIsAuthenticated={setIsAuthenticated} />
                        } />
                    <Route path="/anuncios" element={<ItemList />} />
                    <Route path="/cadastrar" element={<CadastroAnuncio />} />
                    <Route path="/anuncios/:id" element={<ItemDetail />} />
                    <Route path="/meus_anuncios" element={<MeusAnuncios />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/meus-chats" element={<MeusChats />} />
                    <Route path="/chat" element={<Chat />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
