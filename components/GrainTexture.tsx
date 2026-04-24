'use client';

import { useEffect, useRef } from 'react';

export default function GrainTexture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const generate = () => {
      const W = Math.ceil(window.innerWidth);
      const H = Math.ceil(window.innerHeight);
      canvas.width = W;
      canvas.height = H;

      const imageData = ctx.createImageData(W, H);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 70;
        d[i]   = Math.min(255, v + 10);  // R warm
        d[i+1] = Math.min(255, v + 5);   // G neutral
        d[i+2] = Math.max(0,   v - 8);   // B cool down
        d[i+3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    generate();
    window.addEventListener('resize', generate);
    return () => window.removeEventListener('resize', generate);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0.06,
        mixBlendMode: 'soft-light',
      }}
    />
  );
}
