import React from "react";
import "./navbar.css"
import logo from "../assets/crewlink.png";
export default function Navbar() {

    return (

        <>
            <nav className="navbar navbar-expand-lg py-3 sticky-top">
                <div className="container">
                    <a
                        className="navbar-brand d-flex align-items-center fw-bold fs-4"
                        href="#"
                    >
                        <img src={logo} alt="CrewLink Logo" className="logo" />
                        <span>CrewLink</span>
                    </a>                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mx-auto gap-3">
                            <li className="nav-item">
                                <a className="nav-link" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">About</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Features</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Projects</a>
                            </li>
                        </ul>
                        <div className="d-flex gap-3">
                            <button className="btn btn-outline-dark">Login</button>
                            <button className="btn btn-dark">Register</button>
                        </div>
                    </div>
                </div>
            </nav>
        </>

    )
}
