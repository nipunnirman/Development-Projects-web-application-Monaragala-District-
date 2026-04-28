import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import TopHeader from './components/TopHeader';
import Footer from './components/Footer';
import ProjectsPage from './pages/ProjectsPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
