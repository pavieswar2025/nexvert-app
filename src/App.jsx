import { useState, useCallback, useEffect } from 'react';
import './App.css';

import TextToPdf from './components/pdf/TextToPdf';
import ImageToPdf from './components/pdf/ImageToPdf';
import HtmlToPdf from './components/pdf/HtmlToPdf';
import MergePdf from './components/pdf/MergePdf';
import SplitPdf from './components/pdf/SplitPdf';
import ConvertImage from './components/image/ConvertImage';
import ResizeImage from './components/image/ResizeImage';
import CompressImage from './components/image/CompressImage';
import TextToPpt from './components/ppt/TextToPpt';
import ImageToPpt from './components/ppt/ImageToPpt';
import AdSlot from './components/shared/AdSlot';
import SEOContent from './components/shared/SEOContent';
import NexvertLogo from './components/shared/NexvertLogo';
import { useSEO, useHashRouter, setHash } from './hooks/useSEO';

const CATEGORIES = [
  {
    id: 'pdf', label: 'PDF Tools', icon: '📄', color: '#ff5c35',
    tools: [
      { id: 'text-to-pdf', label: 'Text → PDF', icon: '📝', component: TextToPdf },
      { id: 'image-to-pdf', label: 'Image → PDF', icon: '🖼️', component: ImageToPdf },
      { id: 'html-to-pdf', label: 'HTML → PDF', icon: '🌐', component: HtmlToPdf },
      { id: 'merge-pdf', label: 'Merge PDFs', icon: '🔗', component: MergePdf },
      { id: 'split-pdf', label: 'Split PDF', icon: '✂️', component: SplitPdf },
    ],
  },
  {
    id: 'image', label: 'Image Tools', icon: '🖼️', color: '#4da6ff',
    tools: [
      { id: 'convert-image', label: 'Convert', icon: '🔄', component: ConvertImage },
      { id: 'resize-image', label: 'Resize', icon: '📐', component: ResizeImage },
      { id: 'compress-image', label: 'Compress', icon: '📦', component: CompressImage },
    ],
  },
  {
    id: 'ppt', label: 'PPT Tools', icon: '📊', color: '#ffd166',
    tools: [
      { id: 'text-to-ppt', label: 'Text → PPT', icon: '📊', component: TextToPpt },
      { id: 'image-to-ppt', label: 'Image → PPT', icon: '🖼️', component: ImageToPpt },
    ],
  },
];

// flat lookup: toolId → { catId }
const TOOL_MAP = {};
CATEGORIES.forEach(cat => cat.tools.forEach(t => { TOOL_MAP[t.id] = cat.id; }));

export default function App() {
  const [activeCat, setActiveCat] = useState('pdf');
  const [activeTool, setActiveTool] = useState('text-to-pdf');
  const [mobileNav, setMobileNav] = useState(false);

  // Hash-based routing
  const handleNavigate = useCallback((hash) => {
    if (TOOL_MAP[hash]) {
      setActiveCat(TOOL_MAP[hash]);
      setActiveTool(hash);
    }
  }, []);
  useHashRouter(handleNavigate);

  // Dynamic SEO per tool
  useSEO(activeTool, activeCat);

  const category = CATEGORIES.find(c => c.id === activeCat);
  const tool = category?.tools.find(t => t.id === activeTool);
  const ActiveComponent = tool?.component;

  function selectTool(catId, toolId) {
    setActiveCat(catId);
    setActiveTool(toolId);
    setMobileNav(false);
    setHash(toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <a href="/" className="logo" aria-label="Nexvert home"><NexvertLogo height={34} /></a>
          <nav className="header-nav" aria-label="Tool categories">
            {CATEGORIES.map(cat => (
              <button key={cat.id}
                className={`nav-cat-btn${activeCat === cat.id ? ' active' : ''}`}
                onClick={() => selectTool(cat.id, cat.tools[0].id)}
                style={{ '--cat-color': cat.color }}
                aria-current={activeCat === cat.id ? 'page' : undefined}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </nav>
          <button className="mobile-menu-btn" onClick={() => setMobileNav(!mobileNav)}
            aria-label={mobileNav ? 'Close menu' : 'Open menu'} aria-expanded={mobileNav}>
            {mobileNav ? '✕' : '☰'}
          </button>
        </div>
        <div style={{ padding: '8px 0', borderTop: '1px solid var(--border)' }}>
          <AdSlot slot="2135354141" format="auto" size="leaderboard" />
        </div>
      </header>

      {/* ── Mobile nav ── */}
      {mobileNav && (
        <div className="mobile-nav-overlay" onClick={() => setMobileNav(false)} role="dialog" aria-modal="true" aria-label="Navigation">
          <nav className="mobile-nav" onClick={e => e.stopPropagation()}>
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="mobile-nav-section">
                <div className="mobile-nav-cat" style={{ color: cat.color }}>{cat.icon} {cat.label}</div>
                {cat.tools.map(t => (
                  <button key={t.id}
                    className={`mobile-nav-tool${activeTool === t.id ? ' active' : ''}`}
                    onClick={() => selectTool(cat.id, t.id)}
                    style={{ '--cat-color': cat.color }}
                    aria-current={activeTool === t.id ? 'page' : undefined}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>
      )}

      <div className="app-body">
        {/* ── Sidebar ── */}
        <aside className="sidebar" aria-label="Tool list">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="sidebar-section">
              <div className="sidebar-cat" style={{ color: cat.color }}>{cat.icon} {cat.label}</div>
              {cat.tools.map(t => (
                <button key={t.id}
                  className={`sidebar-tool${activeTool === t.id && activeCat === cat.id ? ' active' : ''}`}
                  onClick={() => selectTool(cat.id, t.id)}
                  style={{ '--cat-color': cat.color }}
                  aria-current={activeTool === t.id ? 'page' : undefined}>
                  <span className="sidebar-tool-icon" aria-hidden="true">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 24 }}>
            <AdSlot slot="2626308736" size="rectangle" style={{ width: '100%', height: 200 }} />
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="main-content" id="main-content">
          {ActiveComponent && <ActiveComponent key={activeTool} />}

          {/* Per-tool SEO content: H1 + FAQ */}
          <SEOContent toolId={activeTool} />

          {/* Mid-page ad */}
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
            <AdSlot slot="9672122871" size="leaderboard" />
          </div>

          {/* Related tools */}
          {category && category.tools.length > 1 && (
            <nav className="related-tools" aria-label="More tools">
              <div className="related-title">More {category.label}</div>
              <div className="related-grid">
                {category.tools.filter(t => t.id !== activeTool).map(t => (
                  <button key={t.id} className="related-card"
                    onClick={() => selectTool(category.id, t.id)}
                    style={{ '--cat-color': category.color }}>
                    <span className="related-icon" aria-hidden="true">{t.icon}</span>
                    <span>{t.label}</span>
                    <span className="related-arrow" aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </nav>
          )}
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div>
            <strong>Nexvert</strong> — 100% client-side. Your files never leave your browser.
          </div>
          <nav className="footer-links" aria-label="Footer links">
            {CATEGORIES.flatMap(cat => cat.tools).map(t => (
              <a key={t.id} href={`#${t.id}`}
                onClick={e => { e.preventDefault(); selectTool(TOOL_MAP[t.id], t.id); }}
                className="footer-link">
                {t.label}
              </a>
            ))}
          </nav>
          <p className="footer-copy">© {new Date().getFullYear()} Nexvert. Free forever.</p>
        </div>
      </footer>
    </div>
  );
}
