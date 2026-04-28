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
        {/* Brand section removed in favor of TopHeader */}
        <div></div>

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
