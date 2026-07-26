import { useState, useEffect } from 'react';
import './PwaInstallBanner.css';

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / running in standalone mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      return; // Already installed, do not show banner
    }

    // Don't show if already dismissed in the current browser session
    if (sessionStorage.getItem('pwa-banner-dismissed')) {
      return;
    }

    // 2. Check if device is iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(ios);

    if (ios) {
      // iOS doesn't support beforeinstallprompt, so we display the banner manually
      setVisible(true);
    } else {
      // Android / Chrome / Desktop PWA prompt handler
      const handler = (e) => {
        e.preventDefault(); // Prevent default mini-infobar
        setDeferredPrompt(e);
        setVisible(true);
      };

      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      // Toggle custom instructions display for iOS Safari users
      setShowInstructions(prev => !prev);
      return;
    }

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
    sessionStorage.setItem('pwa-banner-dismissed', '1');
  };

  if (!visible) return null;

  return (
    <div className="pwa-banner-container">
      <div className="pwa-banner" role="banner" aria-label="Install app prompt">
        <div className="pwa-banner-icon">
          <img src="/pwa-192x192.png" alt="App icon" width="40" height="40" />
        </div>
        <div className="pwa-banner-text">
          <div className="pwa-banner-title">යෙදුම ස්ථාපනය කරන්න</div>
          <div className="pwa-banner-sub">Install Monaragala Dev Projects</div>
        </div>
        <button className="pwa-banner-btn" onClick={handleInstall}>
          {isIOS && showInstructions ? 'Hide Guide' : 'Install'}
        </button>
        <button className="pwa-banner-close" onClick={handleDismiss} aria-label="Dismiss">
          ✕
        </button>
      </div>

      {isIOS && showInstructions && (
        <div className="pwa-instructions-tooltip">
          <div className="pwa-instructions-arrow" />
          <div className="pwa-instructions-content">
            <span className="sinhala">ස්ථාපනය කිරීමට:</span>
            <br />
            1. Safari බ්‍රවුසරයේ පහළ ඇති <strong>Share (බෙදාගන්න)</strong> බොත්තම <span style={{fontSize: '1.1rem'}}>⎙</span> ඔබන්න.
            <br />
            2. ලැයිස්තුවෙන් <strong>Add to Home Screen (මුල් තිරයට එක් කරන්න)</strong> <span style={{fontSize: '1.1rem'}}>⊞</span> තෝරන්න.
            <div className="en-instructions" style={{ marginTop: '6px', fontSize: '0.75rem', opacity: 0.85 }}>
              To install: Tap the Share button <span style={{fontSize: '0.9rem'}}>⎙</span> in Safari, then select Add to Home Screen <span style={{fontSize: '0.9rem'}}>⊞</span>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
