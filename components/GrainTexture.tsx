'use client';

import { useEffect, useRef } from 'react';

export default function GrainTexture() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 256, H = 256;
    canvas.width = W;
    canvas.height = H;

    const imageData = ctx.createImageData(W, H);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i+1] = v;
      imageData.data[i+2] = v;
      imageData.data[i+3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
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
        opacity: 0.035,
        mixBlendMode: 'multiply',
      }}
    />
  );
}
