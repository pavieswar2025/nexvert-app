import { useEffect } from 'react';
import { SITE, TOOL_META, CATEGORY_META } from '../utils/seoMeta';

/**
 * Updates <title>, meta description, canonical, Open Graph, Twitter Card,
 * and injects JSON-LD structured data for the active tool.
 */
export function useSEO(toolId, categoryId) {
  useEffect(() => {
    const meta = TOOL_META[toolId] || CATEGORY_META[categoryId] || {};
    const title = meta.title || SITE.tagline;
    const description = meta.description || SITE.description;
    const keywords = meta.keywords || '';
    const url = `${SITE.domain}/#${toolId || categoryId || ''}`;

    // ── Title ──────────────────────────────────────────────────────────────
    document.title = title;

    // ── Helper to upsert <meta> tags ───────────────────────────────────────
    function setMeta(attr, val, content) {
      let el = document.querySelector(`meta[${attr}="${val}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }

    // ── Helper to upsert <link> tags ───────────────────────────────────────
    function setLink(rel, href) {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    }

    // ── Standard meta ─────────────────────────────────────────────────────
    setMeta('name', 'description', description);
    if (keywords) setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', 'index, follow');

    // ── Canonical ─────────────────────────────────────────────────────────
    setLink('canonical', url);

    // ── Open Graph ────────────────────────────────────────────────────────
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE.name);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', `${SITE.domain}${SITE.ogImage}`);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');

    // ── Twitter Card ──────────────────────────────────────────────────────
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:site', SITE.twitterHandle);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', `${SITE.domain}${SITE.ogImage}`);

    // ── JSON-LD structured data ────────────────────────────────────────────
    let ldEl = document.getElementById('ld-json');
    if (!ldEl) {
      ldEl = document.createElement('script');
      ldEl.id = 'ld-json';
      ldEl.type = 'application/ld+json';
      document.head.appendChild(ldEl);
    }

    const faqSchema = meta.faq?.length
      ? {
          '@type': 'FAQPage',
          mainEntity: meta.faq.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }
      : null;

    const webAppSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: `${SITE.name} — ${meta.h1 || title}`,
          url,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          description,
          browserRequirements: 'Requires JavaScript',
          featureList: keywords,
        },
        {
          '@type': 'WebSite',
          url: SITE.domain,
          name: SITE.name,
          description: SITE.description,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE.domain}/#search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        ...(faqSchema ? [{ '@context': 'https://schema.org', ...faqSchema }] : []),
      ],
    };

    ldEl.textContent = JSON.stringify(webAppSchema);

    // Cleanup: remove JSON-LD on unmount handled by next render cycle
  }, [toolId, categoryId]);
}

/**
 * Manages hash-based URL routing so each tool has a shareable, bookmarkable URL.
 * e.g. https://toolforge.app/#merge-pdf
 */
export function useHashRouter(onNavigate) {
  useEffect(() => {
    function handleHash() {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) onNavigate(hash);
    }

    handleHash(); // handle initial load
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [onNavigate]);
}

export function setHash(toolId) {
  if (window.location.hash !== `#${toolId}`) {
    window.history.pushState(null, '', `#${toolId}`);
    // Trigger popstate so useSEO picks it up without a hashchange
  }
}
