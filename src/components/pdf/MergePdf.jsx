import { useState } from 'react';
import { ToolCard, ResultBox, Alert, LoadingState } from '../shared/ToolCard';
import Dropzone from '../shared/Dropzone';
import { mergePdfs, MAX_FILE_SIZE } from '../../utils/pdfUtils';
import { formatBytes } from '../../utils/imageUtils';

export default function MergePdf() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  function moveFile(from, to) {
    const next = [...files];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setFiles(next);
  }

  async function handleMerge() {
    if (files.length < 2) return setError('Please select at least 2 PDF files');
    setError(''); setLoading(true); setResult(null);
    try {
      const blob = await mergePdfs(files);
      setResult(blob);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <ToolCard title="Merge PDFs" icon="🔗" description="Combine multiple PDFs into one">
        <ResultBox blob={result} filename="merged.pdf" onReset={() => { setResult(null); setFiles([]); }}
          extraInfo={`from ${files.length} files`} />
      </ToolCard>
    );
  }

  return (
    <ToolCard title="Merge PDFs" icon="🔗" description="Combine multiple PDFs into one">
      <Dropzone
        onFiles={setFiles}
        accept=".pdf,application/pdf"
        multiple
        maxSize={MAX_FILE_SIZE}
        label="Drop PDF files here"
        sublabel="Select 2 or more PDFs to merge"
      />

      {files.length > 1 && (
        <>
          <div style={{ marginTop: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Merge Order — {files.length} files
            </div>
            {files.map((f, i) => (
              <div key={i} className="file-item" style={{ marginBottom: 6 }}>
                <span style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 11, minWidth: 24 }}>{i + 1}</span>
                <span className="file-item-name">{f.name}</span>
                <span className="file-item-size">{formatBytes(f.size)}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn ghost sm" style={{ padding: '4px 8px' }} onClick={() => i > 0 && moveFile(i, i - 1)} disabled={i === 0}>↑</button>
                  <button className="btn ghost sm" style={{ padding: '4px 8px' }} onClick={() => i < files.length - 1 && moveFile(i, i + 1)} disabled={i === files.length - 1}>↓</button>
                </div>
              </div>
            ))}
          </div>

          {error && <Alert type="error">{error}</Alert>}
          {loading && <LoadingState message={`Merging ${files.length} PDFs...`} />}

          <button className="btn" onClick={handleMerge} disabled={loading}>
            {loading ? <><span className="spinner" /> Merging...</> : `⬇ Merge ${files.length} PDFs`}
          </button>
        </>
      )}

      {files.length === 1 && (
        <div className="alert info" style={{ marginTop: 12 }}>
          <span>ℹ️</span><span>Add at least one more PDF file to merge.</span>
        </div>
      )}
    </ToolCard>
  );
}
