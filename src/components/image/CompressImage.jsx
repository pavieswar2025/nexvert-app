import { useState } from 'react';
import { ToolCard, Alert, LoadingState } from '../shared/ToolCard';
import Dropzone from '../shared/Dropzone';
import { compressImage, getImageExtension, stripExtension, formatBytes } from '../../utils/imageUtils';
import { downloadBlob } from '../../utils/pdfUtils';

const IMAGE_MAX = 20 * 1024 * 1024;

export default function CompressImage() {
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(70);
  const [maxDim, setMaxDim] = useState(2048);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  async function handleCompress() {
    if (!files.length) return setError('Please select images');
    setError(''); setLoading(true); setResults([]);
    const out = [];
    try {
      for (const f of files) {
        const { blob, width, height, format } = await compressImage(f, quality / 100, maxDim);
        const ext = getImageExtension(format);
        out.push({ blob, name: `${stripExtension(f.name)}_compressed.${ext}`, original: f.size, dims: `${width}×${height}` });
      }
      setResults(out);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const totalOriginal = files.reduce((acc, f) => acc + f.size, 0);
  const totalCompressed = results.reduce((acc, r) => acc + r.blob.size, 0);
  const savings = totalOriginal > 0 ? Math.round((1 - totalCompressed / totalOriginal) * 100) : 0;

  return (
    <ToolCard title="Compress Image" icon="📦" description="Reduce image file size">
      <Dropzone onFiles={setFiles} accept="image/*" multiple maxSize={IMAGE_MAX}
        label="Drop images to compress" sublabel="JPG, PNG, WEBP · Max 20MB" />

      {files.length > 0 && (
        <>
          <div style={{ marginTop: 16 }}>
            <div className="field">
              <label className="field-label">Quality: {quality}% {quality < 40 ? '(aggressive)' : quality < 70 ? '(balanced)' : '(high)'}</label>
              <input type="range" min={10} max={100} value={quality} onChange={e => setQuality(+e.target.value)} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
                <span>Smallest file</span><span>Best quality</span>
              </div>
            </div>

            <div className="field">
              <label className="field-label">Max Dimension: {maxDim}px</label>
              <input type="range" min={256} max={4096} step={128} value={maxDim} onChange={e => setMaxDim(+e.target.value)} />
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
                Images larger than {maxDim}px will be downscaled proportionally
              </div>
            </div>
          </div>

          {error && <Alert type="error">{error}</Alert>}
          {loading && <LoadingState message={`Compressing ${files.length} image${files.length !== 1 ? 's' : ''}...`} />}

          <button className="btn" onClick={handleCompress} disabled={loading}>
            {loading ? <><span className="spinner" /> Compressing...</> : `📦 Compress ${files.length} Image${files.length !== 1 ? 's' : ''}`}
          </button>
        </>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {savings > 0 && (
            <div className="alert success" style={{ marginBottom: 12 }}>
              <span>✅</span>
              <span>Saved <strong>{savings}%</strong> — {formatBytes(totalOriginal)} → {formatBytes(totalCompressed)}</span>
            </div>
          )}

          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {results.length} file{results.length !== 1 ? 's' : ''} compressed
          </div>

          {results.map((r, i) => {
            const saved = Math.round((1 - r.blob.size / r.original) * 100);
            return (
              <div key={i} className="file-item" style={{ marginBottom: 6 }}>
                <span>📦</span>
                <span className="file-item-name">{r.name}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                  <span className="file-item-size">{formatBytes(r.original)} → {formatBytes(r.blob.size)}</span>
                  <span className={`tag ${saved > 0 ? 'green' : 'accent'}`}>
                    {saved > 0 ? `−${saved}%` : `+${Math.abs(saved)}%`}
                  </span>
                </div>
                <button className="btn sm" onClick={() => downloadBlob(r.blob, r.name)}>⬇</button>
              </div>
            );
          })}

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
