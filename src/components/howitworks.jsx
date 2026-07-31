import "./howitworks.css";

export default function HowItWorks() {
    return (
        <section className="how">
            <div className="container">

                <div className="how-heading">
                    <span>HOW IT WORKS</span>
                    <h2>
                        Start Creating in Three Simple Steps
                    </h2>
                    <p>
                        Whether you're a creator looking for teammates
                        or a freelancer searching for exciting projects,
                        CrewLink makes collaboration effortless.
                    </p>
                </div>

                <div className="steps">

                    <div className="step-line"></div>

                    <div className="step-card">
                        <div className="step-circle">
                            1
                        </div>
                        <span className="step-tag">
                            STEP 01
                        </span>
                        <h3>Create Profile</h3>
                        <p>
                            Build your creator profile, showcase your
                            skills and upload your portfolio.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-circle">
                            2
                        </div>
                        <span className="step-tag">
                            STEP 02
                        </span>
                        <h3>Find Your Crew</h3>
                        <p>
                            Discover talented collaborators and invite
                            them to your creative project.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-circle">
                            3
                        </div>
                        <span className="step-tag">
                            STEP 03
                        </span>
                        <h3>Create Together</h3>
                        <p>
                            Manage tasks, communicate efficiently and
                            deliver amazing work.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}