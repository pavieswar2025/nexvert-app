import { useState } from 'react';
import { ToolCard, ResultBox, Alert, LoadingState } from '../shared/ToolCard';
import { textToPpt, parseSlides, THEMES } from '../../utils/pptUtils';

const SAMPLE = `Introduction to AI
This presentation covers key AI concepts.

---

What is AI?
- Artificial Intelligence simulates human intelligence
- Includes machine learning and deep learning
- Powers voice assistants, recommendations, and more

---

Machine Learning
- Algorithms that learn from data
- Supervised, unsupervised, and reinforcement learning
- Applications: spam detection, image recognition

---

Future of AI
- Autonomous vehicles and robotics
- Healthcare diagnostics and drug discovery
- Continued ethical debates and governance`;

export default function TextToPpt() {
  const [text, setText] = useState('');
  const [theme, setTheme] = useState('minimal');
  const [slideNumbers, setSlideNumbers] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const slides = text.trim() ? parseSlides(text) : [];

  async function handleGenerate() {
    if (!text.trim()) return setError('Please enter slide content');
    setError(''); setLoading(true); setResult(null);
    try {
      const blob = await textToPpt(slides, { theme, includeSlideNumbers: slideNumbers });
      setResult(blob);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <ToolCard title="Text to PPT" icon="📊" description="Generate PowerPoint from text">
        <ResultBox blob={result} filename="presentation.pptx" onReset={() => setResult(null)}
          extraInfo={`${slides.length} slides`} />
      </ToolCard>
    );
  }

  return (
    <ToolCard title="Text to PPT" icon="📊" description="Generate PowerPoint from text">
      <div className="alert info" style={{ marginBottom: 16 }}>
        <span>💡</span>
        <span>Separate slides with <code style={{ background: 'var(--bg3)', padding: '1px 5px', borderRadius: 3 }}>---</code> on its own line. First line of each section is the slide title.</span>
      </div>

      <div className="field">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label className="field-label" style={{ margin: 0 }}>Slide Content</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {slides.length > 0 && <span className="tag accent">{slides.length} slides</span>}
            <button className="btn secondary sm" onClick={() => setText(SAMPLE)}>Load Sample</button>
          </div>
        </div>
        <textarea className="input" placeholder={`Slide Title\nContent line 1\nContent line 2\n\n---\n\nNext Slide Title\nMore content...`}
          value={text} onChange={e => setText(e.target.value)} style={{ minHeight: 200 }} />
      </div>

      <div className="grid-2">
        <div className="field">
          <label className="field-label">Theme</label>
          <select className="select" value={theme} onChange={e => setTheme(e.target.value)}>
            {Object.keys(THEMES).map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field-label">Options</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 42, paddingTop: 4 }}>
            <input type="checkbox" id="slidenum" checked={slideNumbers} onChange={e => setSlideNumbers(e.target.checked)} />
            <label htmlFor="slidenum" style={{ cursor: 'pointer', fontSize: 14 }}>Slide numbers</label>
          </div>
        </div>
      </div>

      {slides.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Preview
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {slides.map((s, i) => (
              <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 4, padding: '6px 10px', fontSize: 12 }}>
                <span style={{ color: 'var(--text3)', marginRight: 6 }}>{i + 1}</span>
                <span>{s.title || 'Untitled'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <Alert type="error">{error}</Alert>}
      {loading && <LoadingState message="Generating presentation..." />}

      <button className="btn" onClick={handleGenerate} disabled={loading || slides.length === 0}>
        {loading ? <><span className="spinner" /> Generating...</> : `⬇ Generate ${slides.length > 0 ? slides.length + '-slide ' : ''}PPT`}
      </button>
    </ToolCard>
  );
}
