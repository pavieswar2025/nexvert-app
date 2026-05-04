import { useState } from 'react';
import { ToolCard, ResultBox, Alert, LoadingState } from '../shared/ToolCard';
import Dropzone from '../shared/Dropzone';
import { imageToPdf, MAX_FILE_SIZE } from '../../utils/pdfUtils';

export default function ImageToPdf() {
  const [files, setFiles] = useState([]);
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [fitMode, setFitMode] = useState('fit');
  const [margin, setMargin] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  async function handleConvert() {
    if (!files.length) return setError('Please select images');
    setError(''); setLoading(true); setResult(null);
    try {
      const blob = await imageToPdf(files, { pageSize, orientation, fitMode, margin });
      setResult(blob);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <ToolCard title="Image to PDF" icon="🖼️" description="Convert images to PDF pages">
        <ResultBox blob={result} filename="images.pdf" onReset={() => { setResult(null); setFiles([]); }}
          extraInfo={`${files.length} page${files.length !== 1 ? 's' : ''}`} />
      </ToolCard>
    );
  }

  return (
    <ToolCard title="Image to PDF" icon="🖼️" description="Convert images to PDF pages">
      <Dropzone
        onFiles={setFiles}
        accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,image/*"
        multiple
        maxSize={MAX_FILE_SIZE}
        label="Drop images here"
        sublabel="JPG, PNG, WEBP supported · Max 50MB each"
      />

      {files.length > 0 && (
        <>
          <div className="grid-2" style={{ marginTop: 16 }}>
            <div className="field">
              <label className="field-label">Page Size</label>
              <select className="select" value={pageSize} onChange={e => setPageSize(e.target.value)}>
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="a3">A3</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Orientation</label>
              <select className="select" value={orientation} onChange={e => setOrientation(e.target.value)}>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Fit Mode</label>
              <select className="select" value={fitMode} onChange={e => setFitMode(e.target.value)}>
                <option value="fit">Fit (letterbox)</option>
                <option value="fill">Fill (crop)</option>
                <option value="original">Original size</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Margin: {margin}mm</label>
              <input type="range" min={0} max={30} value={margin} onChange={e => setMargin(+e.target.value)} />
            </div>
          </div>

          {error && <Alert type="error">{error}</Alert>}
          {loading && <LoadingState message={`Converting ${files.length} image${files.length !== 1 ? 's' : ''}...`} />}

          <button className="btn" onClick={handleConvert} disabled={loading}>
            {loading ? <><span className="spinner" /> Processing...</> : `⬇ Convert ${files.length} Image${files.length !== 1 ? 's' : ''} to PDF`}
          </button>
        </>
      )}
    </ToolCard>
  );
}
