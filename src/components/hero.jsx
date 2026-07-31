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

                        <div className="hero-stats">
                            <div className="stat-card">
                                <h3>12K+</h3>
                                <span>Creators</span>
                            </div>
                            <div className="stat-card">
                                <h3>7.5K+</h3>
                                <span>Projects</span>
                            </div>
                            <div className="stat-card">
                                <h3>97+</h3>
                                <span>Companies</span>
                            </div>
                        </div>

                    </div>

                    <div className="hero-right">
                        <div className="hero-image-wrapper">
                            <div className="hero-card">

                                <div className="floating-card card-editor">
                                    <span className="card-icon">🎬</span>
                                    <div>
                                        <h6>Video Editor</h6>
                                        <p>Available Now</p>
                                    </div>
                                </div>
                                <div className="floating-card card-project">
                                    <h6>Landing Page</h6>
                                    <p>4 / 5 Members</p>
                                </div>
                                <div className="floating-card card-message">
                                    <strong>Alex</strong>
                                    <p>Revision completed.</p>
                                </div>

                                <img
                                    src={heroimage}
                                    alt="CrewLink Illustration"
                                    className="hero-image"
                                />

                            </div>
                        </div>
                    </div>


                </div>
            </section>
        </>
    )
}