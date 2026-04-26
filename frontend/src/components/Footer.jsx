import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span>🇱🇰</span>
          <div>
            <div className="footer-title sinhala">මොණරාගල දිස්ත්‍රික්කයේ සංවර්ධන ව්‍යාපෘති</div>
            <div className="footer-sub">Monaragala District Development Projects Management System</div>
          </div>
        </div>
        <div className="footer-note">
          Built with ❤️ for transparent governance · UTF-8 Sinhala support
        </div>
      </div>
    </footer>
  );
}
