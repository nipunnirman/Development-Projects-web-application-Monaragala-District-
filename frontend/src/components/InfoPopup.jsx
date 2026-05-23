import React, { useEffect, useState } from 'react';
import './InfoPopup.css';

export default function InfoPopup({ message, messageEn, onClose, duration = 6000 }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        triggerClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // match fade-out animation length
  };

  return (
    <div className={`info-popup-container ${isClosing ? 'slide-up' : ''}`} role="alert">
      <div className="info-popup-content sinhala">
        <div className="info-popup-icon">ℹ️</div>
        <div className="info-popup-body">
          <p className="info-popup-text-si">{message}</p>
          {messageEn && <p className="info-popup-text-en">{messageEn}</p>}
        </div>
        <button className="info-popup-close" onClick={triggerClose} aria-label="Close message">
          ✕
        </button>
      </div>
    </div>
  );
}
