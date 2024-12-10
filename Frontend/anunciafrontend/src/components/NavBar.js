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
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold text-primary" to="/">
                    Uff Anuncia
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold" to="/anuncios">
                                Lista de Anúncios
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold" to="/cadastrar">
                                Cadastrar Anúncio
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold" to="/meus_anuncios">
                                Meus Anúncios
                            </Link>
                        </li>
                    </ul>
                    <button
                        className="btn btn-outline-danger fw-bold"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
