import React from "react";
import "./hero.css"
import heroimage from "../../assets/hero-image.png"

export default function Hero() {
    return (
        <>
            <section className="hero">

                <div className="hero-glow hero-glow-one"></div>
                <div className="hero-glow hero-glow-two"></div>
                <div className="hero-grid"></div>



                <div className="container">



                    <div className="hero-left">

                        <span className="hero-badge">
                            ✨ Behind Every Great Creator Is a Great Crew.
                        </span>

                        <h1 className="hero-title">
                            Bring Your
                            <span className="gradient-text"> Creative </span>
                            <br />
                            Vision to Life.
                        </h1>
                        <h2 className="hero-subtitle">
                            Build Better Content Together.
                        </h2>

                        <p className="hero-description">
                            Find talented collaborators, build your dream team, manage creative projects and turn ideas into exceptional content—all from one collaborative platform.
                        </p>

                        <div className="hero-buttons d-flex">
                            <button className="btn btn-dark hero-btn-primary">
                                Get Started Free
                            </button>

                            <button className="btn btn-outline-dark hero-btn-secondary">
                                Explore Projects
                            </button>
                        </div>

                        <div className="hero-trust">
                            <div className="stars">
                                ⭐⭐⭐⭐⭐
                            </div>
                            <p>
                                Built for creators who believe great content is never created alone.
                            </p>
                        </div>

                    </div>



                    <div className="hero-right">
                        <div className="hero-image-wrapper">
                            <img
                                src={heroimage}
                                alt="CrewLink Illustration"
                                className="hero-image"
                            />
                        </div>
                    </div>



                </div>
            </section>
        </>
    )
}