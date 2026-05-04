import { useState, useRef } from 'react';
import { formatBytes } from '../../utils/imageUtils';

export default function Dropzone({ onFiles, accept = '*', multiple = false, maxSize, label, sublabel }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef();

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    processFiles(dropped);
  }

  function handleChange(e) {
    const selected = Array.from(e.target.files);
    processFiles(selected);
    e.target.value = '';
  }

  function processFiles(newFiles) {
    const filtered = accept !== '*'
      ? newFiles.filter(f => accept.split(',').some(a => {
          a = a.trim();
          if (a.startsWith('.')) return f.name.toLowerCase().endsWith(a);
          return f.type.match(a.replace('*', '.*'));
        }))
      : newFiles;

    if (maxSize) {
      const oversized = filtered.filter(f => f.size > maxSize);
      if (oversized.length > 0) {
        alert(`Some files exceed the ${formatBytes(maxSize)} limit and were skipped.`);
      }
    }

    const valid = maxSize ? filtered.filter(f => f.size <= maxSize) : filtered;
    if (!valid.length) return;

    const next = multiple ? [...files, ...valid] : valid;
    setFiles(next);
    onFiles(next);
  }

  function removeFile(i) {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    onFiles(next);
  }

  const iconMap = {
    'application/pdf': '📄',
    'image/': '🖼️',
    'application/vnd': '📊',
  };

  function getIcon(file) {
    for (const [k, v] of Object.entries(iconMap)) {
      if (file.type.startsWith(k)) return v;
    }
    return '📁';
  }

  return (
    <div>
      <div
        className={`dropzone${dragging ? ' dragover' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          onClick={e => e.stopPropagation()}
        />
        <div className="dz-icon">{dragging ? '📂' : '⬆️'}</div>
        <div className="dz-title">{label || (dragging ? 'Drop files here' : 'Click or drag & drop')}</div>
        <div className="dz-sub">{sublabel || (maxSize ? `Max ${formatBytes(maxSize)} per file` : 'Any size')}</div>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          {files.map((f, i) => (
            <div key={i} className="file-item">
              <span style={{ fontSize: 18 }}>{getIcon(f)}</span>
              <span className="file-item-name">{f.name}</span>
              <span className="file-item-size">{formatBytes(f.size)}</span>
              <button className="file-item-remove" onClick={e => { e.stopPropagation(); removeFile(i); }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
