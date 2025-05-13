import { Link, useLocation } from 'react-router-dom'

function NavBar() {
  const location = useLocation()

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold text-dark" to="/">
          JJ
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/' ? 'active fw-semibold text-primary' : 'text-dark'}`}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/newpost' ? 'active fw-semibold text-primary' : 'text-dark'}`}
                to="/newpost"
              >
                Novo Post
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/userprofile' ? 'active fw-semibold text-primary' : 'text-dark'}`}
                to="/userprofile"
              >
                Meu Perfil
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/login' ? 'active fw-semibold text-primary' : 'text-dark'}`}
                to="/login"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
