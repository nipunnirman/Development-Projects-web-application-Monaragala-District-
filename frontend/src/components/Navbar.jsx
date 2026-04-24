import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { admin, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();

  const handleLogout = () => { logout(); nav('/'); };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-flag">🇱🇰</span>
          <div>
            <div className="navbar-title">ශ්‍රී ලංකා සංවර්ධන ව්‍යාපෘති</div>
            <div className="navbar-subtitle">Sri Lanka Development Projects</div>
          </div>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${loc.pathname === '/' ? 'active' : ''}`}>
            Projects
          </Link>
          {admin ? (
            <>
              <Link to="/admin" className={`nav-link ${loc.pathname.startsWith('/admin') ? 'active' : ''}`}>
                Dashboard
              </Link>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
