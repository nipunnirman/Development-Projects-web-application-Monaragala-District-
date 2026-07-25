import { useState, useEffect } from 'react';
import './PwaInstallBanner.css';

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed in this session
    if (sessionStorage.getItem('pwa-banner-dismissed')) return;

    const handler = (e) => {
      e.preventDefault(); // Prevent the default mini-infobar
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-banner-dismissed', '1');
  };

  if (!visible || dismissed) return null;

  return (
    <div className="pwa-banner" role="banner" aria-label="Install app prompt">
      <div className="pwa-banner-icon">
        <img src="/pwa-192x192.png" alt="App icon" width="40" height="40" />
      </div>
      <div className="pwa-banner-text">
        <div className="pwa-banner-title">යෙදුම ස්ථාපනය කරන්න</div>
        <div className="pwa-banner-sub">Install Monaragala Dev Projects</div>
      </div>
      <button className="pwa-banner-btn" onClick={handleInstall}>
        Install
      </button>
      <button className="pwa-banner-close" onClick={handleDismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
