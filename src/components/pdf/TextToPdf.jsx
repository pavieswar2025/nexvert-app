import { useState } from 'react';
import { ToolCard, ResultBox, Alert, LoadingState } from '../shared/ToolCard';
import { textToPdf } from '../../utils/pdfUtils';

export default function TextToPdf() {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [fontSize, setFontSize] = useState(12);
  const [pageSize, setPageSize] = useState('a4');
  const [fontFamily, setFontFamily] = useState('helvetica');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function handleGenerate() {
    if (!text.trim()) return setError('Please enter some text');
    setError(''); setLoading(true); setResult(null);
    try {
      const blob = await textToPdf(text, { fontSize, pageSize, fontFamily, title, margins: 20 });
      setResult(blob);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <ToolCard title="Text to PDF" icon="📝" description="Convert plain text to PDF">
        <ResultBox blob={result} filename={`${title || 'document'}.pdf`} onReset={() => setResult(null)} />
      </ToolCard>
    );
  }

  return (
    <ToolCard title="Text to PDF" icon="📝" description="Convert plain text to PDF">
      <div className="field">
        <label className="field-label">Document Title (optional)</label>
        <input className="input" placeholder="My Document" value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div className="field">
        <label className="field-label">Content</label>
        <textarea className="input" placeholder="Type or paste your text here..." value={text} onChange={e => setText(e.target.value)} style={{ minHeight: 160 }} />
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
          {text.length} characters · ~{Math.ceil(text.split(/\s+/).filter(Boolean).length / 300)} pages
        </div>
      </div>

      <div className="grid-3">
        <div className="field">
          <label className="field-label">Page Size</label>
          <select className="select" value={pageSize} onChange={e => setPageSize(e.target.value)}>
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
            <option value="a3">A3</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">Font</label>
          <select className="select" value={fontFamily} onChange={e => setFontFamily(e.target.value)}>
            <option value="helvetica">Helvetica</option>
            <option value="times">Times New Roman</option>
            <option value="courier">Courier</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">Font Size: {fontSize}pt</label>
          <input type="range" min={9} max={24} value={fontSize} onChange={e => setFontSize(+e.target.value)} />
        </div>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {loading && <LoadingState message="Generating PDF..." />}

      <button className="btn" onClick={handleGenerate} disabled={loading || !text.trim()}>
        {loading ? <><span className="spinner" /> Generating...</> : '⬇ Generate PDF'}
      </button>
    </ToolCard>
  );
}
