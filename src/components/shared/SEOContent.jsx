import { TOOL_META } from '../../utils/seoMeta';

/**
 * Renders the visually-hidden H1 and a collapsible FAQ section
 * for on-page SEO on each tool page.
 */
export default function SEOContent({ toolId }) {
  const meta = TOOL_META[toolId];
  if (!meta) return null;

  return (
    <div className="seo-content">
      {/* H1 is visually subtle but present and indexable */}
      <h1 className="seo-h1">{meta.h1}</h1>

      {meta.faq?.length > 0 && (
        <details className="seo-faq">
          <summary className="seo-faq-toggle">
            <span>FAQ</span>
            <span className="seo-faq-arrow">▾</span>
          </summary>
          <div className="seo-faq-body">
            {meta.faq.map((item, i) => (
              <div key={i} className="seo-faq-item">
                <div className="seo-faq-q">{item.q}</div>
                <div className="seo-faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
