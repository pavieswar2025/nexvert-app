import { useState } from 'react';

export function ToolCard({ title, description, icon, accentColor, children }) {
  return (
    <div className="tool-card fade-up" style={{ '--card-accent': accentColor || 'var(--accent)' }}>
      <div className="tool-card-header">
        <div className="tool-card-icon">{icon}</div>
        <div>
          <h2 className="tool-card-title">{title}</h2>
          {description && <p className="tool-card-desc">{description}</p>}
        </div>
      </div>
      <div className="tool-card-body">{children}</div>
    </div>
  );
}

export function ResultBox({ blob, filename, onReset, extraInfo }) {
  function download() {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const icons = {
    pdf: '📄', pptx: '📊', jpg: '🖼️', png: '🖼️', webp: '🖼️', jpeg: '🖼️',
  };
  const ext = filename.split('.').pop().toLowerCase();

  return (
    <div className="result-box">
      <div className="file-icon">{icons[ext] || '📁'}</div>
      <div className="file-name">{filename}</div>
      <div className="file-size">{formatBytes(blob.size)}{extraInfo ? ` · ${extraInfo}` : ''}</div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn" onClick={download}>⬇ Download</button>
        <button className="btn secondary sm" onClick={onReset}>Process Another</button>
      </div>
    </div>
  );
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B','KB','MB','GB'];
  const i = Math.floor(Math.log(bytes)/Math.log(k));
  return `${parseFloat((bytes/Math.pow(k,i)).toFixed(1))} ${sizes[i]}`;
}

export function Alert({ type = 'error', children }) {
  const icons = { error: '⚠️', success: '✅', info: 'ℹ️' };
  return (
    <div className={`alert ${type}`}>
      <span>{icons[type]}</span>
      <span>{children}</span>
    </div>
  );
}

export function LoadingState({ message = 'Processing...' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0', color: 'var(--text2)' }}>
      <span className="spinner" />
      <span style={{ fontSize: 14 }}>{message}</span>
    </div>
  );
}
