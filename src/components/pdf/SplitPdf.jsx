import { useState } from 'react';
import { ToolCard, Alert, LoadingState } from '../shared/ToolCard';
import Dropzone from '../shared/Dropzone';
import { splitPdf, getPdfPageCount, MAX_FILE_SIZE } from '../../utils/pdfUtils';
import { downloadBlob, formatBytes } from '../../utils/pdfUtils';

export default function SplitPdf() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState([{ start: 1, end: 1 }]);
  const [splitMode, setSplitMode] = useState('range'); // 'range' | 'each'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);

  async function handleFiles(files) {
    if (!files.length) { setFile(null); setPageCount(0); return; }
    const f = files[0];
    setFile(f);
    setLoadingPage(true);
    try {
      const count = await getPdfPageCount(f);
      setPageCount(count);
      setRanges([{ start: 1, end: count }]);
    } catch (e) {
      setError('Could not read PDF: ' + e.message);
    } finally {
      setLoadingPage(false);
    }
  }

  function addRange() {
    setRanges([...ranges, { start: 1, end: pageCount }]);
  }

  function removeRange(i) {
    setRanges(ranges.filter((_, idx) => idx !== i));
  }

  function updateRange(i, field, val) {
    const next = ranges.map((r, idx) => idx === i ? { ...r, [field]: val } : r);
    setRanges(next);
  }

  async function handleSplit() {
    if (!file) return;
    setError(''); setLoading(true); setResults([]);
    try {
      let splitRanges = ranges;
      if (splitMode === 'each') {
        splitRanges = Array.from({ length: pageCount }, (_, i) => ({ start: i + 1, end: i + 1 }));
      }
      const blobs = await splitPdf(file, splitRanges);
      setResults(blobs);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolCard title="Split PDF" icon="✂️" description="Extract pages or ranges from a PDF">
      {!file ? (
        <Dropzone onFiles={handleFiles} accept=".pdf,application/pdf" maxSize={MAX_FILE_SIZE}
          label="Drop a PDF file" sublabel="Max 50MB" />
      ) : (
        <>
          <div className="alert info" style={{ marginBottom: 16 }}>
            <span>📄</span>
            <span>{file.name} · <strong>{pageCount} pages</strong></span>
            <button className="btn secondary sm" style={{ marginLeft: 'auto' }} onClick={() => { setFile(null); setResults([]); }}>Change</button>
          </div>

          {loadingPage && <LoadingState message="Analyzing PDF..." />}

          {!loadingPage && pageCount > 0 && (
            <>
              <div className="field">
                <label className="field-label">Split Mode</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['range', 'each'].map(mode => (
                    <button key={mode} className={`btn ${splitMode === mode ? '' : 'secondary'} sm`}
                      onClick={() => setSplitMode(mode)}>
                      {mode === 'range' ? '📐 Custom Ranges' : '📑 Every Page'}
                    </button>
                  ))}
                </div>
              </div>

              {splitMode === 'range' && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Page Ranges
                  </div>
                  {ranges.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ color: 'var(--text3)', fontSize: 12, minWidth: 16 }}>{i + 1}.</span>
                      <input className="input" type="number" min={1} max={pageCount} value={r.start}
                        onChange={e => updateRange(i, 'start', Math.min(pageCount, Math.max(1, +e.target.value)))}
                        style={{ width: 80 }} placeholder="From" />
                      <span style={{ color: 'var(--text3)' }}>–</span>
                      <input className="input" type="number" min={1} max={pageCount} value={r.end}
                        onChange={e => updateRange(i, 'end', Math.min(pageCount, Math.max(1, +e.target.value)))}
                        style={{ width: 80 }} placeholder="To" />
                      <span style={{ color: 'var(--text3)', fontSize: 12 }}>of {pageCount}</span>
                      {ranges.length > 1 && (
                        <button className="btn secondary sm" onClick={() => removeRange(i)}>✕</button>
                      )}
                    </div>
                  ))}
                  <button className="btn secondary sm" onClick={addRange}>+ Add Range</button>
                </div>
              )}

              {splitMode === 'each' && (
                <div className="alert info" style={{ marginBottom: 16 }}>
                  <span>ℹ️</span><span>Will create {pageCount} individual PDF files, one per page.</span>
                </div>
              )}

              {error && <Alert type="error">{error}</Alert>}
              {loading && <LoadingState message="Splitting PDF..." />}

              <button className="btn" onClick={handleSplit} disabled={loading}>
                {loading ? <><span className="spinner" /> Splitting...</> : '✂️ Split PDF'}
              </button>
            </>
          )}
        </>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {results.length} file{results.length !== 1 ? 's' : ''} ready
          </div>
          {results.map((r, i) => (
            <div key={i} className="file-item" style={{ marginBottom: 6 }}>
              <span>📄</span>
              <span className="file-item-name">{r.name}</span>
              <span className="file-item-size">{formatBytes(r.blob.size)}</span>
              <button className="btn sm" onClick={() => downloadBlob(r.blob, r.name)}>⬇</button>
            </div>
          ))}
          {results.length > 1 && (
            <button className="btn secondary" style={{ marginTop: 8 }} onClick={() => results.forEach(r => setTimeout(() => downloadBlob(r.blob, r.name), 200))}>
              ⬇ Download All
            </button>
          )}
        </div>
      )}
    </ToolCard>
  );
}
