import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark"> 

            <Link className="navbar-brand ps-3" to="/admin">Start Bootstrap</Link> 

            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i className="fas fa-bars"></i></button>
            
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <Link to="#" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></Link>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown"> 
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link className="dropdown-item" to="#!">Logout</Link></li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
