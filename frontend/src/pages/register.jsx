import { User, Lock } from 'lucide-react';

function Register() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h3 className="text-center mb-4">Register</h3>
                <form>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <User size={16} />
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <Lock size={16} />
                            </span>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <Lock size={16} />
                            </span>
                            <input
                                type="password"
                                className="form-control"
                                id="confirm-password"
                                placeholder="Confirm your password"
                            />
                        </div>
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-success">Register</button>
                    </div>

                    <div className="text-center mt-3">
                        <a href="/login" className="text-decoration-none">
                            Already have an account? Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
