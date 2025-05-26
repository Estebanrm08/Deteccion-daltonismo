import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label
} from 'recharts';

type Result = {
  type: string;
  emotion: string;
};

type Props = {
  results: Result[];
};

const ResultCharts: React.FC<Props> = ({ results }) => {
  // Contar daltonismos (solo los detectados)
  const deficiencyCount = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  // Contar emociones (solo detectadas)
  const emotionCount = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.emotion] = (acc[r.emotion] || 0) + 1;
    return acc;
  }, {});

  // Transformar para Recharts sin relleno
  const deficiencyData = Object.entries(deficiencyCount).map(([type, count]) => ({ type, count }));
  const emotionData = Object.entries(emotionCount).map(([emotion, count]) => ({ emotion, count }));

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem', backgroundColor: '#d6336c', padding: '1rem', paddingBottom: '1.2rem', borderRadius: '12px' }}>
      {/* Daltonismo */}
      <div style={{ width: 350, height: 320, color: 'white' }}>
        <h3 style={{ textAlign: 'center', marginBottom: 16, fontWeight: 'bold' }}>
          Tipos de Daltonismo
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={deficiencyData} margin={{ top: 40, right: 30, left: 0, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.5)" />
            <XAxis 
              dataKey="type" 
              tick={{ fill: 'white', fontWeight: 'bold' }} 
              interval={0} 
              angle={-45} 
              textAnchor="end" 
            >
              <Label value="Tipo de Daltonismo" offset={-85} position="insideBottom" fill="white" fontWeight="bold" />
            </XAxis>
            <YAxis allowDecimals={false} tick={{ fill: 'white', fontWeight: 'bold' }}>
              <Label value="Cantidad" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: 'white', fontWeight: 'bold' }} />
            </YAxis>
            <Tooltip
              contentStyle={{ backgroundColor: '#72162a', borderColor: '#ff66a1' }}
              itemStyle={{ color: 'white', fontWeight: 'bold' }}
              labelStyle={{ color: 'white', fontWeight: 'bold' }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ fontWeight: 'bold', color: 'white', marginTop: '-20px' }} />
            <Bar dataKey="count" fill="#512da8" name="Daltonismo detectado por rondas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Emociones */}
      <div style={{ width: 350, height: 320, color: 'white' }}>
        <h3 style={{ textAlign: 'center', marginBottom: 16, fontWeight: 'bold' }}>
          Emociones Detectadas
        </h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={emotionData} margin={{ top: 40, right: 30, left: 0, bottom: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.5)" />
            <XAxis 
              dataKey="emotion" 
              tick={{ fill: 'white', fontWeight: 'bold' }} 
              interval={0} 
              angle={-45} 
              textAnchor="end" 
            >
              <Label value="Emoción" offset={-85} position="insideBottom" fill="white" fontWeight="bold" />
            </XAxis>
            <YAxis allowDecimals={false} tick={{ fill: 'white', fontWeight: 'bold' }}>
              <Label value="Cantidad" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fill: 'white', fontWeight: 'bold' }} />
            </YAxis>
            <Tooltip
              contentStyle={{ backgroundColor: '#7f1d1d', borderColor: '#fb7185' }}
              itemStyle={{ color: 'white', fontWeight: 'bold' }}
              labelStyle={{ color: 'white', fontWeight: 'bold' }}
            />
            <Legend verticalAlign="top" wrapperStyle={{ fontWeight: 'bold', color: 'white', marginTop: '-20px' }} />
            <Bar dataKey="count" fill="#28004A" name="Emociones detectadas por rondas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResultCharts;
