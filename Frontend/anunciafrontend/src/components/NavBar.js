import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ setIsAuthenticated }) => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Uff Anuncia</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/anuncios">Lista de Anúncios</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cadastrar">Cadastrar Anúncio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/meus_anuncios">Meus Anúncios</Link>
                        </li>
                        <button className="btn btn-outline-danger my-2 my-sm-0" onClick={handleLogout}>Logout</button>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
