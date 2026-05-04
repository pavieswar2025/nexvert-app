import { useState } from 'react';
import { ToolCard, ResultBox, Alert, LoadingState } from '../shared/ToolCard';
import Dropzone from '../shared/Dropzone';
import { imageToPpt, THEMES } from '../../utils/pptUtils';

const IMAGE_MAX = 20 * 1024 * 1024;

export default function ImageToPpt() {
  const [files, setFiles] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [layout, setLayout] = useState('one-per-slide');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function handleGenerate() {
    if (!files.length) return setError('Please select images');
    setError(''); setLoading(true); setResult(null);
    try {
      const blob = await imageToPpt(files, { theme, layout, title });
      setResult(blob);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <ToolCard title="Image to PPT" icon="🖼️" description="Build a PowerPoint from images">
        <ResultBox blob={result} filename={`${title || 'slideshow'}.pptx`} onReset={() => { setResult(null); setFiles([]); }}
          extraInfo={`${files.length} image${files.length !== 1 ? 's' : ''}`} />
      </ToolCard>
    );
  }

  return (
    <ToolCard title="Image to PPT" icon="🖼️" description="Build a PowerPoint from images">
      <Dropzone onFiles={setFiles} accept="image/*" multiple maxSize={IMAGE_MAX}
        label="Drop images for slideshow" sublabel="JPG, PNG, WEBP · Max 20MB each" />

      {files.length > 0 && (
        <>
          <div style={{ marginTop: 16 }}>
            <div className="field">
              <label className="field-label">Presentation Title (optional)</label>
              <input className="input" placeholder="My Photo Slideshow" value={title} onChange={e => setTitle(e.target.value)} />
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
                <label className="field-label">Layout</label>
                <select className="select" value={layout} onChange={e => setLayout(e.target.value)}>
                  <option value="one-per-slide">One image per slide</option>
                  <option value="grid">4-up grid</option>
                </select>
              </div>
            </div>

            <div className="alert info" style={{ marginBottom: 0 }}>
              <span>📊</span>
              <span>{files.length} image{files.length !== 1 ? 's' : ''} → {layout === 'grid' ? Math.ceil(files.length / 4) : files.length} slide{(layout === 'grid' ? Math.ceil(files.length / 4) : files.length) !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {error && <Alert type="error">{error}</Alert>}
          {loading && <LoadingState message="Building presentation..." />}

          <button className="btn" style={{ marginTop: 16 }} onClick={handleGenerate} disabled={loading}>
            {loading ? <><span className="spinner" /> Building...</> : `⬇ Create Presentation`}
          </button>
        </>
      )}
    </ToolCard>
  );
}
