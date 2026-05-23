import { useState, useEffect } from 'react';
import './WelcomeModal.css';

const STORAGE_KEY = 'monaragala_welcome_seen';

export default function WelcomeModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Small delay so the page renders first
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="wm-overlay" role="dialog" aria-modal="true" aria-labelledby="wm-title">
      <div className="wm-box">

        {/* Header */}
        <div className="wm-header">
          <div className="wm-logo-row">
            <img src="/uva-e1708577472866.png" alt="Uva Province" className="wm-logo" />
            <div>
              <div className="wm-org-si">දිස්ත්‍රික් සම්බන්ධීකරණ කමිටු සභාපති කාර්යාලය</div>
              <div className="wm-org-en">District Coordination Committee Chairman's Office</div>
              <div className="wm-org-district">මොණරාගල | Monaragala</div>
            </div>
          </div>
          <div className="wm-title-row">
            <h2 id="wm-title" className="wm-title-si">සාදරයෙන් පිළිගනිමු!</h2>
            <h2 className="wm-title-en">Welcome!</h2>
          </div>
        </div>

        {/* Body */}
        <div className="wm-body">

          {/* What is this site */}
          <div className="wm-section">
            <div className="wm-section-icon">🌐</div>
            <div>
              <div className="wm-section-title-si">මෙය කුමක්ද?</div>
              <div className="wm-section-title-en">What is this?</div>
              <p className="wm-text-si">
                මෙය <strong>මොණරාගල දිස්ත්‍රික්කයේ සංවර්ධන ව්‍යාපෘති</strong> නරඹා ගත හැකි නිල ද්වාරයයි.
                දිස්ත්‍රික් සම්බන්ධීකරණ කමිටු සභාපති කාර්යාලය මෙම ද්වාරය ප්‍රකාශයට පත් කරයි.
              </p>
              <p className="wm-text-en">
                This is the official portal to browse <strong>development projects in Monaragala District</strong>,
                published by the District Coordination Committee Chairman's Office.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="wm-section">
            <div className="wm-section-icon">📋</div>
            <div>
              <div className="wm-section-title-si">ඔබට සොයා ගත හැකි විස්තර</div>
              <div className="wm-section-title-en">What you can find here</div>
              <ul className="wm-list">
                <li>
                  <span className="wm-bullet">🏗️</span>
                  <span>
                    <strong>ව්‍යාපෘති නාමාවලිය</strong> — සංවර්ධන ව්‍යාපෘති ලැයිස්තුව, ප්‍රගතිය හා තත්ත්වය<br/>
                    <em>Project directory</em> — list of development projects, progress &amp; status
                  </span>
                </li>
                <li>
                  <span className="wm-bullet">📍</span>
                  <span>
                    <strong>ප්‍රාදේශීය ලේකම් / ග්‍රාම නිලධාරී</strong> — ප්‍රදේශය අනුව ව්‍යාපෘති පෙරහන් කරන්න<br/>
                    <em>DS / GN Division</em> — filter projects by your area
                  </span>
                </li>
                <li>
                  <span className="wm-bullet">💰</span>
                  <span>
                    <strong>ව්‍යාපෘති වටිනාකම</strong> — ප්‍රතිපාදන මුදල් විස්තර<br/>
                    <em>Project value</em> — estimated budget &amp; funding details
                  </span>
                </li>
                <li>
                  <span className="wm-bullet">📊</span>
                  <span>
                    <strong>උපකරණ පුවරු</strong> — දිස්ත්‍රික්කය පුරා ව්‍යාපෘති සාරාංශ සිතියම් &amp; ප්‍රස්ථාර<br/>
                    <em>Dashboard</em> — district-wide project summaries, maps &amp; charts
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* How to use */}
          <div className="wm-section">
            <div className="wm-section-icon">🧭</div>
            <div>
              <div className="wm-section-title-si">භාවිත කරන ආකාරය</div>
              <div className="wm-section-title-en">How to use</div>
              <p className="wm-text-si">
                ඉහළ ඇති <strong>ප්‍රාදේශීය ලේකම්</strong> බොත්තම් ක්ලික් කර ඔබේ ප්‍රදේශය තෝරන්න.
                ව්‍යාපෘතියක් ක්ලික් කළ විට සම්පූර්ණ විස්තර දිස් වේ.
                <strong>සිතියම</strong> හෝ <strong>උපකරණ පුවරු</strong> දසුන වෙත මාරු විය හැකිය.
              </p>
              <p className="wm-text-en">
                Click the <strong>DS Division</strong> buttons at the top to filter by area.
                Click any project to view full details.
                Switch between <strong>Grid</strong>, <strong>Map</strong>, and <strong>Dashboard</strong> views anytime.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="wm-footer">
          <p className="wm-footer-note">
            මෙම ද්වාරය ජනතාව දැනුවත් කිරීම සඳහා නිල වශයෙන් නිකුත් කර ඇත. |&nbsp;
            This portal is officially published for public awareness.
          </p>
          <button id="wm-start-btn" className="wm-btn" onClick={handleClose}>
            <span>ආරම්භ කරන්න &nbsp;/&nbsp; Get Started</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

      </div>
    </div>
  );
}
