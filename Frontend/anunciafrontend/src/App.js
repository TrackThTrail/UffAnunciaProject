import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItemList from './components/ItemList';
import CadastroAnuncio from './components/CadastroAnuncio';
import NavBar from './components/NavBar';
import ItemDetail from './components/ItemDetail';
import MeusAnuncios from './components/MeusAnuncios';

const App = () => {
    return (
        <Router>
            <div>
                <NavBar />
                <Routes>
                    <Route path="/" element={<ItemList />} />
                    <Route path="/cadastrar" element={<CadastroAnuncio />} />
                    <Route path="/anuncios/:id" element={<ItemDetail />} /> {/* Rota para detalhes */}
                    <Route path="/meus_anuncios" element={<MeusAnuncios />} /> {/* Nova rota */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
