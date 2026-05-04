import { useState } from 'react';
import { ToolCard, ResultBox, Alert, LoadingState } from '../shared/ToolCard';
import Dropzone from '../shared/Dropzone';
import { convertImage, getImageExtension, stripExtension, formatBytes } from '../../utils/imageUtils';
import { downloadBlob } from '../../utils/pdfUtils';

const IMAGE_MAX = 20 * 1024 * 1024;

export default function ConvertImage() {
  const [files, setFiles] = useState([]);
  const [targetFormat, setTargetFormat] = useState('image/png');
  const [quality, setQuality] = useState(90);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  async function handleConvert() {
    if (!files.length) return setError('Please select images');
    setError(''); setLoading(true); setResults([]);
    const out = [];
    try {
      for (const f of files) {
        const blob = await convertImage(f, targetFormat, quality / 100);
        const ext = getImageExtension(targetFormat);
        out.push({ blob, name: `${stripExtension(f.name)}.${ext}`, original: f.size });
      }
      setResults(out);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolCard title="Convert Image" icon="🔄" description="Convert between JPG, PNG, WEBP formats">
      <Dropzone onFiles={setFiles} accept="image/*" multiple maxSize={IMAGE_MAX}
        label="Drop images to convert" sublabel="JPG, PNG, WEBP, GIF, BMP · Max 20MB" />

      {files.length > 0 && (
        <>
          <div className="grid-2" style={{ marginTop: 16 }}>
            <div className="field">
              <label className="field-label">Output Format</label>
              <select className="select" value={targetFormat} onChange={e => setTargetFormat(e.target.value)}>
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WEBP</option>
              </select>
            </div>
            {targetFormat !== 'image/png' && (
              <div className="field">
                <label className="field-label">Quality: {quality}%</label>
                <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(+e.target.value)} />
              </div>
            )}
          </div>

          {error && <Alert type="error">{error}</Alert>}
          {loading && <LoadingState message={`Converting ${files.length} image${files.length !== 1 ? 's' : ''}...`} />}

          <button className="btn" onClick={handleConvert} disabled={loading}>
            {loading ? <><span className="spinner" /> Converting...</> : `🔄 Convert ${files.length} Image${files.length !== 1 ? 's' : ''}`}
          </button>
        </>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {results.length} file{results.length !== 1 ? 's' : ''} converted
          </div>
          {results.map((r, i) => (
            <div key={i} className="file-item" style={{ marginBottom: 6 }}>
              <span>🖼️</span>
              <span className="file-item-name">{r.name}</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                <span className="file-item-size">{formatBytes(r.original)} → {formatBytes(r.blob.size)}</span>
                <span className="tag" style={{ fontSize: 10 }}>
                  {r.blob.size < r.original ? `−${Math.round((1 - r.blob.size/r.original)*100)}%` : `+${Math.round((r.blob.size/r.original-1)*100)}%`}
                </span>
              </div>
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
