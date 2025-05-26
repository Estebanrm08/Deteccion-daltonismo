import React from 'react';

type Result = {
  id: string;
  type: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  severity: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.6 | 0.8 | 1.0; // Incluye 0.1
  emotion: string;
  confidence: number | null;
  responseTime: number;
  round: number;
  position?: string;
};
  


type Props = {
  results: Result[];
  onRestart: () => void;
};

function analyzeResults(results: Result[]) {
  if (results.length === 0) {
    return {
      avgTime: '0.00',
      mostFrequentEmotion: 'Desconocido',
      likelyDeficiency: 'No identificado',
      speedLabel: 'lento',
      feedback: 'No se detectó una deficiencia de color clara.',
    };
  }

  const avgTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
  const emotionCounts = results.reduce((acc, r) => {
    acc[r.emotion] = (acc[r.emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const mostFrequentEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Desconocido';

  const colorDeficiencyCount = results.reduce((acc, r) => {
    if (r.type !== 'normal') acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const likelyDeficiency = Object.entries(colorDeficiencyCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'No identificado';

  const speedLabel = avgTime < 4 ? 'rápido' : avgTime < 8 ? 'moderado' : 'lento';

  const feedbackMap: Record<string, string> = {
    protanopia: 'Podrías tener dificultades con los tonos rojos.',
    deuteranopia: 'Podrías tener dificultades con los tonos verdes.',
    tritanopia: 'Podrías tener dificultades con los tonos azules.',
    'No identificado': 'No se detectó una deficiencia de color clara.',
  };

  return {
    avgTime: avgTime.toFixed(2),
    mostFrequentEmotion,
    likelyDeficiency,
    speedLabel,
    feedback: feedbackMap[likelyDeficiency],
  };
}

const ResultScreen: React.FC<Props> = ({ results, onRestart }) => {
  const summary = analyzeResults(results);

  return (
    <div style={{ padding: '2rem' }}>
      <h5>Resultados del Test</h5>

      {results.map((res) => (
        <div key={res.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Ronda {res.round + 1}</h3>
          <p>Tipo de visión: <strong>{res.type}</strong></p>
          <p>Gravedad: <strong>{res.severity}</strong></p>
          <p>Emoción: <strong>{res.emotion}</strong> ({Math.round((res.confidence ?? 0) * 100)}%)</p>
          <p>Tiempo de respuesta: <strong>{res.responseTime.toFixed(2)} segundos</strong></p>
        </div>
      ))}

      <hr />

      <h2>Resumen general</h2>
      <p>Tiempo promedio de respuesta: <strong>{summary.avgTime} segundos</strong> ({summary.speedLabel})</p>
      <p>Emoción más frecuente: <strong>{summary.mostFrequentEmotion}</strong></p>
      <p>Probable tipo de daltonismo: <strong>{summary.likelyDeficiency}</strong></p>
      <p><em>{summary.feedback}</em></p>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={onRestart}>🔁 Reiniciar test</button>
      </div>
    </div>
  );
};

export default ResultScreen;


