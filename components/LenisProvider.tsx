'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function LenisProvider() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    // lerp 0.08 = smooth but not sluggish
    const lenis = new Lenis({ autoRaf: true, lerp: 0.14, smoothWheel: true });
    return () => lenis.destroy();
  }, []);

  return null;
}
