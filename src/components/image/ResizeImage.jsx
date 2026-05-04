import { useState, useEffect } from 'react';
import { ToolCard, ResultBox, Alert, LoadingState } from '../shared/ToolCard';
import Dropzone from '../shared/Dropzone';
import { resizeImage, getImageExtension, stripExtension, formatBytes } from '../../utils/imageUtils';
import { downloadBlob } from '../../utils/pdfUtils';

const IMAGE_MAX = 20 * 1024 * 1024;

const PRESETS = [
  { label: 'HD 1280×720', w: 1280, h: 720 },
  { label: 'FHD 1920×1080', w: 1920, h: 1080 },
  { label: 'Square 1080', w: 1080, h: 1080 },
  { label: 'Twitter', w: 1200, h: 675 },
  { label: 'Instagram', w: 1080, h: 1080 },
  { label: 'Thumbnail', w: 320, h: 180 },
];

export default function ResizeImage() {
  const [files, setFiles] = useState([]);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maintain, setMaintain] = useState(true);
  const [format, setFormat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  async function handleResize() {
    if (!files.length) return setError('Please select images');
    if (!width && !height) return setError('Enter at least one dimension');
    setError(''); setLoading(true); setResults([]);
    const out = [];
    try {
      for (const f of files) {
        const fmt = format || f.type || 'image/png';
        const { blob, width: w, height: h } = await resizeImage(f, {
          width: width ? +width : undefined,
          height: height ? +height : undefined,
          maintainAspectRatio: maintain,
          format: fmt,
        });
        const ext = getImageExtension(fmt);
        out.push({ blob, name: `${stripExtension(f.name)}_${w}x${h}.${ext}`, dims: `${w}×${h}` });
      }
      setResults(out);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(preset) {
    setWidth(String(preset.w));
    setHeight(String(preset.h));
  }

  return (
    <ToolCard title="Resize Image" icon="📐" description="Resize images to exact dimensions">
      <Dropzone onFiles={setFiles} accept="image/*" multiple maxSize={IMAGE_MAX}
        label="Drop images to resize" sublabel="JPG, PNG, WEBP · Max 20MB" />

      {files.length > 0 && (
        <>
          <div style={{ marginTop: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Quick Presets
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PRESETS.map(p => (
                <button key={p.label} className="btn secondary sm" onClick={() => applyPreset(p)}>{p.label}</button>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="field-label">Width (px)</label>
              <input className="input" type="number" min={1} placeholder="e.g. 1920" value={width} onChange={e => setWidth(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Height (px)</label>
              <input className="input" type="number" min={1} placeholder="e.g. 1080" value={height} onChange={e => setHeight(e.target.value)} />
            </div>
          </div>

          <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="maintain" checked={maintain} onChange={e => setMaintain(e.target.checked)} />
            <label htmlFor="maintain" style={{ cursor: 'pointer', fontSize: 14 }}>Maintain aspect ratio</label>
          </div>

          <div className="field">
            <label className="field-label">Output Format</label>
            <select className="select" value={format} onChange={e => setFormat(e.target.value)}>
              <option value="">Same as original</option>
              <option value="image/jpeg">JPG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WEBP</option>
            </select>
          </div>

          {error && <Alert type="error">{error}</Alert>}
          {loading && <LoadingState message="Resizing..." />}

          <button className="btn" onClick={handleResize} disabled={loading || (!width && !height)}>
            {loading ? <><span className="spinner" /> Processing...</> : `📐 Resize ${files.length} Image${files.length !== 1 ? 's' : ''}`}
          </button>
        </>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {results.length} file{results.length !== 1 ? 's' : ''} resized
          </div>
          {results.map((r, i) => (
            <div key={i} className="file-item" style={{ marginBottom: 6 }}>
              <span>🖼️</span>
              <span className="file-item-name">{r.name}</span>
              <span className="tag blue" style={{ flexShrink: 0 }}>{r.dims}</span>
              <span className="file-item-size">{formatBytes(r.blob.size)}</span>
              <button className="btn sm" onClick={() => downloadBlob(r.blob, r.name)}>⬇</button>
            </div>
          ))}
          {results.length > 1 && (
            <button className="btn secondary" style={{ marginTop: 8 }}
              onClick={() => results.forEach((r, i) => setTimeout(() => downloadBlob(r.blob, r.name), i * 100))}>
              ⬇ Download All
            </button>
          )}
        </div>
      )}
    </ToolCard>
  );
}
