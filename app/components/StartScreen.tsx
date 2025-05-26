// StartScreen.tsx
import React from 'react';

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div style={{ maxWidth: 600, margin: 'auto', textAlign: 'center', padding: '2rem' }}>
      <h6>Bienvenido al Test de Daltonismo</h6>

      <img
        src="/eye-icon.svg" 
        alt="Daltonismo ilustración"
        style={{
            width: '200px',
            margin: '1rem auto 2rem',
            display: 'block',
            filter: 'drop-shadow(0 29px 50px rgba(0,0,0,0.3))',
            transition: 'transform 0.6s ease',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.transform = 'rotate(360deg)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = 'rotate(0deg)';
        }}
        />
      
      <p style={{
        fontSize: '1.25rem',
        color: '#ddd',
        maxWidth: '900px',
        margin: '0 auto 2rem',
        lineHeight: 1.6,
        fontStyle: 'italic',
      }}>
        Este test detecta emociones y posibles alteraciones en la percepción del color.
      </p>
      <button
        onClick={onStart}
        style={{
          marginTop: 20,
          padding: '2rem 3em',
          fontSize: '2rem',
          fontWeight: 'bold',
          backgroundColor: '#7c3aed',
          color: 'white',
          borderRadius: 8,
          cursor: 'pointer',
          border: 'solid 2px #7c3aed',
          boxShadow: '0 10px 8px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          userSelect: 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = '#5a21b6';
          e.currentTarget.style.boxShadow = '0 15px 15px rgba(90, 33, 182, 0.6)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = '#7c3aed';
          e.currentTarget.style.boxShadow = '0 10px 8px rgba(0, 0, 0, 0.2)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Empezar Test
      </button>
    </div>
  );
};


export default StartScreen;

