import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import TopHeader from './components/TopHeader';
import Footer from './components/Footer';
import WelcomeModal from './components/WelcomeModal';
import PwaInstallBanner from './components/PwaInstallBanner';
import ProjectsPage from './pages/ProjectsPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <WelcomeModal />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <TopHeader />
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/"       element={<ProjectsPage />} />
              <Route path="/login"  element={<LoginPage />} />
              <Route path="/admin"  element={<AdminPage />} />
            </Routes>
          </div>
          <Footer />
          <PwaInstallBanner />
          <a
            href="tel:0552276769"
            style={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              zIndex: 9999,
              border: '2px solid var(--gold-dim)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img src="/Phone_icon.png" alt="Phone" style={{ width: '28px', height: '28px' }} />
          </a>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
