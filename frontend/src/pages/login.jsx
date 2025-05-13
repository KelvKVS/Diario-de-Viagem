import { User, Lock } from 'lucide-react';

function Login() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h3 className="text-center mb-4">Login</h3>
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

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                    <div className="text-center mt-3">
                        <a href="/register" className="text-decoration-none">Don't have an account? Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
