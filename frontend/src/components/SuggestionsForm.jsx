import { useState } from 'react';
import './SuggestionsForm.css';

// Email is kept here on the client but not shown visibly in the UI
const DEST = atob('ZGNjbW9uYXJhZ2FsYUBnbWFpbC5jb20='); // base64 of dccmonaragala@gmail.com

export default function SuggestionsForm() {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!contactInfo.trim() || !suggestion.trim()) {
      setErrorMsg('කරුණාකර දුරකථන අංකය/විද්‍යුත් තැපෑල සහ යෝජනාව ඇතුළත් කරන්න. / Please fill in your contact info and suggestion.');
      return;
    }
    setErrorMsg('');

    const subject = encodeURIComponent('යෝජනාව - Monaragala District Development Projects');

    const body = encodeURIComponent(
      `නම / Name: ${name || 'Anonymous'}\n` +
      `දුරකථන / Contact: ${contactInfo}\n\n` +
      `යෝජනාව / Suggestion:\n${suggestion}\n\n` +
      `---\nSubmitted from: Monaragala District Development Projects Portal`
    );

    window.location.href = `mailto:${DEST}?subject=${subject}&body=${body}`;
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setName('');
      setContactInfo('');
      setSuggestion('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="suggestions-section fade-up">
      <div className="suggestions-container card">
        <div className="suggestions-header">
          <div className="suggestions-icon-wrap">✉️</div>
          <div>
            <h2 className="suggestions-title-si sinhala">යෝජනා සහ අදහස්</h2>
            <h3 className="suggestions-title-en">Suggestions & Feedback</h3>
            <p className="suggestions-desc sinhala">
              දිස්ත්‍රික්කයේ සංවර්ධන කටයුතු පිළිබඳ ඔබේ යෝජනා සහ අදහස් අප වෙත යොමු කරන්න.
              <br />
              <span className="en-desc">Submit your ideas and suggestions regarding the development projects in the district.</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="suggestions-form">
          {errorMsg && (
            <div className="alert alert-error sinhala">
              {errorMsg}
            </div>
          )}
          {submitted && (
            <div className="alert alert-success sinhala">
              ✅ ඔබේ විද්‍යුත් තැපෑල යෙදුම විවෘත වෙමින් ඇත. "Send" ක්ලික් කරන්න. / Your email app is opening — click "Send" to submit.
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sg-name" className="form-label sinhala">
                ඔබේ නම <span className="en-label">(Name — Optional)</span>
              </label>
              <input
                id="sg-name"
                type="text"
                className="form-input"
                placeholder="උදා: එම්. පෙරේරා"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sg-contact" className="form-label sinhala">
                දුරකථන / විද්‍යුත් තැපෑල <span className="required-star">*</span>
                <span className="en-label"> (Contact / Email)</span>
              </label>
              <input
                id="sg-contact"
                type="text"
                className="form-input"
                placeholder="077XXXXXXX / you@example.com"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="sg-suggestion" className="form-label sinhala">
              යෝජනාව <span className="required-star">*</span>
              <span className="en-label"> (Your Suggestion)</span>
            </label>
            <textarea
              id="sg-suggestion"
              className="form-textarea"
              placeholder="ඔබේ යෝජනාව / අදහස මෙහි ලියන්න…"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              required
              rows={4}
            />
          </div>

          <p className="submit-hint sinhala">
            📬 යොමු කිරීමෙන් පසු ඔබේ විද්‍යුත් තැපෑල යෙදුම විවෘත වේ. "Send" ක්ලික් කරන්න.
            <span className="en-label"> Your email app will open pre-filled — just click Send.</span>
          </p>
          <div className="submit-btn-wrapper">
            <button type="submit" className="btn btn-primary suggestions-submit-btn">
              <span>📨</span>
              <span className="sinhala">යෝජනාව යොමු කරන්න / Submit Suggestion</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
