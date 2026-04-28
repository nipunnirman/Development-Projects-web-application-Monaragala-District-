import React from 'react';
import './TopHeader.css';

export default function TopHeader() {
  return (
    <header className="top-header">
      <div className="container top-header-inner">
        <div className="top-header-left">
          <img src="/Emblem_of_Sri_Lanka.svg.png" alt="Sri Lanka Emblem" className="emblem-img" />
        </div>

        <div className="top-header-center">
          <div className="official-text">
            <h1 className="sinhala">දිස්ත්‍රික් සංවර්ධන කමිටු සභාපති කාර්යාලය</h1>
            <h2 className="sinhala-sub">මොණරාගල</h2>
            <div className="english-text">District Development Committee Chairman's Office</div>
            <div className="english-sub">Monaragala</div>
          </div>
        </div>

        <div className="top-header-right">
          <div className="secretary-profile">
            <div className="photo-frame">
              <img src="/sectratory.jpeg" alt="Secretary" className="secretary-img" />
            </div>
            {/* <div className="secretary-info">
              <span className="secretary-name">District Secretary</span>
              <span className="secretary-title">Monaragala</span>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
}
