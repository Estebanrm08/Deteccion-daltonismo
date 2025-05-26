import React from 'react';

export interface ImageItem {
  id: string;
  src: string;
  alt: string;
  type: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  severity: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.6 | 0.8 | 1.0;
}

interface ImageGridProps {
  images: ImageItem[];
  onSelect: (image: ImageItem) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onSelect }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gridTemplateRows: 'repeat(4, auto)',
      gap: '12px', 
      maxWidth: '2000px',
      margin: 'auto',
      userSelect: 'none',
      overflowY: 'auto',
      maxHeight: 'calc(3 * 110px + 3 * 10px)'
    }}>
      {images.map((img, index) => {
        const row = Math.floor(index / 5) + 1;
        const col = (index % 5) + 1;
        return (
          <img
            key={img.id}
            src={img.src}
            alt={img.alt}
            title={`Posición: ${index + 1} (${row}x${col})`}
            style={{
              width: '100%',
              height: '220px',
              objectFit: 'cover',
              cursor: 'pointer',
              borderRadius: '6px',
              border: '1px solid #ccc',
              transition: 'transform 0.2s',
            }}
            onClick={() => onSelect(img)}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
        );
      })}
    </div>
  );
};


export default ImageGrid;

