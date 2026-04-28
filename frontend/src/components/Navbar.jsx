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
            <div className="navbar-title">සංවර්ධන ද්වාරය</div>
            <div className="navbar-subtitle">Development Portal</div>
          </div>
        </Link>

        <div className="navbar-links">

          {admin && (
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
