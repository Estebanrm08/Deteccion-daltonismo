import React, { useEffect } from "react";
import type { ImageItem } from "./ImageGrid";

const types = ['protanopia', 'deuteranopia', 'tritanopia'] as const;
const levels = [0.1, 0.2, 0.4, 0.6, 0.8, 1.0] as const; 

const applyFakeSimulation = (ctx: CanvasRenderingContext2D, type: ImageItem['type'], severity: number) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (type === 'protanopia') data[i] *= (1 - severity);
    else if (type === 'deuteranopia') data[i + 1] *= (1 - severity);
    else if (type === 'tritanopia') data[i + 2] *= (1 - severity);
  }

  ctx.putImageData(imageData, 0, 0);
};

interface SimulatedImageGridProps {
  originalSrc: string;
  onImagesGenerated: (images: ImageItem[]) => void;
}

const SimulatedImageGrid: React.FC<SimulatedImageGridProps> = ({ originalSrc, onImagesGenerated }) => {
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = originalSrc;

    img.onload = () => {
      const generated: ImageItem[] = [];

      // Generar 18 imágenes simuladas (3 tipos × 6 niveles)
      for (const type of types) {
        for (const severity of levels) {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);

          applyFakeSimulation(ctx, type, severity);

          generated.push({
            id: crypto.randomUUID(),
            src: canvas.toDataURL(),
            alt: `${type}-${severity}`,
            type,
            severity,
          });
        }
      }

      // Imagen original sin simulación
      {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        generated.push({
          id: crypto.randomUUID(),
          src: canvas.toDataURL(),
          alt: 'Imagen original',
          type: 'normal',
          severity: 0,
        });
      }

      // Imagen con severidad 0.3 de tipo aleatorio
      {
        const randomType = types[Math.floor(Math.random() * types.length)];
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        applyFakeSimulation(ctx, randomType, 0.3);
        generated.push({
          id: crypto.randomUUID(),
          src: canvas.toDataURL(),
          alt: `${randomType}-0.3`,
          type: randomType,
          severity: 0.3,
        });
      }

      // Aleatorizar matriz final (20 imágenes)
      const shuffled = generated.sort(() => Math.random() - 0.5);
      onImagesGenerated(shuffled);
    };
  }, [originalSrc]);

  return null;
};

export default SimulatedImageGrid;

