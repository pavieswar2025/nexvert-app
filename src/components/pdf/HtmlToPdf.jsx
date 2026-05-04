import { useState } from 'react';
import { ToolCard, ResultBox, Alert, LoadingState } from '../shared/ToolCard';
import { htmlToPdf } from '../../utils/pdfUtils';

const SAMPLE_HTML = `<h1>My Document Title</h1>
<p>This is a <strong>paragraph</strong> with some <em>formatted text</em>.</p>
<h2>Section 1</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
<ul>
  <li>Point one</li>
  <li>Point two</li>
  <li>Point three</li>
</ul>
<h2>Section 2</h2>
<p>More content goes here. The tool extracts text from your HTML for the PDF.</p>`;

export default function HtmlToPdf() {
  const [html, setHtml] = useState('');
  const [pageSize, setPageSize] = useState('a4');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function handleConvert() {
    if (!html.trim()) return setError('Please enter HTML content');
    setError(''); setLoading(true); setResult(null);
    try {
      const blob = await htmlToPdf(html, { pageSize });
      setResult(blob);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <ToolCard title="HTML to PDF" icon="🌐" description="Convert HTML markup to PDF">
        <ResultBox blob={result} filename="document.pdf" onReset={() => setResult(null)} />
      </ToolCard>
    );
  }

  return (
    <ToolCard title="HTML to PDF" icon="🌐" description="Convert HTML markup to PDF">
      <div className="alert info" style={{ marginBottom: 16 }}>
        <span>ℹ️</span>
        <span>Basic HTML support: headings, paragraphs, lists, and inline text. Complex CSS layouts may not render perfectly.</span>
      </div>

      <div className="field">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label className="field-label" style={{ margin: 0 }}>HTML Content</label>
          <button className="btn secondary sm" onClick={() => setHtml(SAMPLE_HTML)}>Load Sample</button>
        </div>
        <textarea
          className="input"
          placeholder="<h1>Title</h1><p>Your HTML content...</p>"
          value={html}
          onChange={e => setHtml(e.target.value)}
          style={{ minHeight: 200, fontFamily: 'var(--font-mono)', fontSize: 13 }}
        />
      </div>

      <div className="field">
        <label className="field-label">Page Size</label>
        <select className="select" value={pageSize} onChange={e => setPageSize(e.target.value)}>
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
        </select>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {loading && <LoadingState message="Converting HTML..." />}

      <button className="btn" onClick={handleConvert} disabled={loading || !html.trim()}>
        {loading ? <><span className="spinner" /> Converting...</> : '⬇ Convert to PDF'}
      </button>
    </ToolCard>
  );
}
