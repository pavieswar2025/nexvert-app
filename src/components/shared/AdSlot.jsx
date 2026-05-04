import { useEffect, useRef } from 'react';

// Replace with your actual AdSense publisher ID
const ADSENSE_CLIENT = 'ca-pub-7283492341344979';

export default function AdSlot({ slot, format = 'auto', size = 'leaderboard', style = {} }) {
  const ref = useRef();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {}
  }, []);

  // Development: show placeholder
  const isDev = import.meta.env.DEV || !slot || slot === 'XXXXXXXXXX';

  if (isDev) {
    return (
      <div className={`ad-slot ${size}`} style={style}>
        Advertisement
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', ...style }}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
