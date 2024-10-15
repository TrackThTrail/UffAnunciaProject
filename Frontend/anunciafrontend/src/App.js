import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItemList from './components/ItemList';
import CadastroAnuncio from './components/CadastroAnuncio';
import NavBar from './components/NavBar';

const App = () => {
    return (
        <Router>
            <div>
                <NavBar />
                <Routes>
                    <Route path="/" element={<ItemList />} />
                    <Route path="/cadastrar" element={<CadastroAnuncio />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
