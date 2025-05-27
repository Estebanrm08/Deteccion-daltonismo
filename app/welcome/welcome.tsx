import React, { useState, useEffect } from 'react';
import StartScreen from '../components/StartScreen';
import FacialLandmarks from '../components/FacialLandmarks';
import SimulatedImageGrid from '../components/SimulatedImageGrid';
import ImageGrid from '../components/ImageGrid';
import Timer from '../components/Timer';
import ResultScreen from '../components/ResultScreen';
import type { ImageItem } from '../components/ImageGrid';
import ResultCharts from '../components/ResultCharts';

type VisionType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';
type SeverityLevel = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.6 | 0.8 | 1.0;

type TestResult = {
  id: string;
  type: VisionType;
  severity: SeverityLevel;
  emotion: string;
  confidence: number | null;
  responseTime: number;
  round: number;
  position: string; 
  index1to20: number; 
};

const roundsCount = 5;

const allImageFiles = [
  "amazonia.jpg", "Art.jpg", "Arte.jpg", "Artesania.jpg", "aves.jpeg",
  "bandejapaisa.jpg", "bolivar.jpg", "botero.jpg", "botero1.jpg", "botero3.jpg",
  "buenaventura.jpg", "caligallinaweb.jpg", "colombiapaisake.jpg", "cristorey.jpg", "Cultura.jpg",
  "Cultura2.jpg", "empanadasvallunas.jpg", "Escobar.jpg", "fauna.jpg", "Florarinsular.jpg",
  "frutas.jpg", "Iguana.jpg", "luladas.jpg", "micolombia.jpg", "MuseoOro.jpg",
  "Objetos.jpg", "osonegro.jpg", "Paisaje.jpg", "parquegatos.jpg", "piedra.jpg",
  "rio.jpg", "Senderismo.jpg", "tertulia.jpg", "tortuga.jpg", "tucan.jpg"
];

function pickRandomImages(images: string[], n: number): string[] {
  const copy = [...images];
  const selected: string[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    selected.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return selected;
}

function preloadImages(imagePaths: string[]) {
  imagePaths.forEach(src => {
    const img = new Image();
    img.src = `/images/${src}`;
  });
}

export default function Welcome() {
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [lastTime, setLastTime] = useState<number | null>(null);

  // Emoción en vivo detectada 
  const [currentEmotion, setCurrentEmotion] = useState<string>('No detectado');
  const [currentConfidence, setCurrentConfidence] = useState<number | null>(null);

  // Emoción congelada al seleccionar imagen
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedConfidence, setSelectedConfidence] = useState<number | null>(null);

  const [results, setResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [imagesForRounds, setImagesForRounds] = useState<string[]>([]);
  const [simulatedImages, setSimulatedImages] = useState<ImageItem[]>([]);

  // Flag para bloquear selección múltiple en ronda actual
  const [hasSelected, setHasSelected] = useState(false);

  useEffect(() => {
    if (started) {
      const selectedImages = pickRandomImages(allImageFiles, roundsCount);
      setImagesForRounds(selectedImages);
      preloadImages(selectedImages);
    }
  }, [started]);

  useEffect(() => {
    if (round + 1 < roundsCount && imagesForRounds.length > 0) {
      const nextImage = imagesForRounds[round + 1];
      if (nextImage) {
        preloadImages([nextImage]);
      }
    }
  }, [round, imagesForRounds]);
  
  const currentBaseImage = imagesForRounds[round] ? `/images/${imagesForRounds[round]}` : null;

  const handleSelection = (img: ImageItem) => {
    if (hasSelected) return; // bloquea selección múltiple

    const index = simulatedImages.findIndex(i => i.id === img.id);
    if (index === -1) return;

    setSelectedIndex(index);
    setIsTimerActive(false);

    // Congelar emoción y confianza al seleccionar
    setSelectedEmotion(currentEmotion);
    setSelectedConfidence(currentConfidence);

    // Si ya hay tiempo registrado, guardar resultado ahora, sino se guardará en efecto
    if (lastTime !== null) {
      saveResult(img, index, lastTime);
    }
  };

  // Guarda resultado y bloquea selección
  const saveResult = (img: ImageItem, index: number, time: number) => {
    const row = Math.floor(index / 5) + 1;
    const col = (index % 5) + 1;
    const position = `${row}x${col}`;
    const index1to20 = index + 1;

    const newResult: TestResult = {
      id: img.id,
      type: img.type,
      severity: img.severity,
      emotion: selectedEmotion ?? currentEmotion,
      confidence: selectedConfidence ?? currentConfidence,
      responseTime: time,
      round,
      position,
      index1to20,
    };

    setResults(prev => [...prev, newResult]);
    setHasSelected(true);
    console.log('📊 Resultado registrado:', newResult);
  };

  // Effect que guarda el resultado cuando lastTime cambia y hay imagen seleccionada pero resultado no guardado
  useEffect(() => {
    if (selectedIndex !== null && lastTime !== null && !hasSelected) {
      const img = simulatedImages[selectedIndex];
      if (img) saveResult(img, selectedIndex, lastTime);
    }
  }, [lastTime, selectedIndex]);

  const nextRound = () => {
    if (selectedIndex === null || lastTime === null) {
      alert('Por favor selecciona una imagen');
      return;
    }

    setSelectedIndex(null);
    setLastTime(null);
    setIsTimerActive(true);

    setSelectedEmotion(null);
    setSelectedConfidence(null);
    setHasSelected(false);

    if (round + 1 >= roundsCount) {
      setShowResults(true);
    } else {
      setRound(round + 1);
    }
  };

  const restartTest = () => {
    setRound(0);
    setSelectedIndex(null);
    setIsTimerActive(true);
    setLastTime(null);
    setCurrentEmotion('No detectado');
    setCurrentConfidence(null);
    setSelectedEmotion(null);
    setSelectedConfidence(null);
    setResults([]);
    setShowResults(false);
    setSimulatedImages([]);
    setHasSelected(false);
    const newImages = pickRandomImages(allImageFiles, roundsCount);
    setImagesForRounds(newImages);
  };

  const exportResultsToTxt = () => {
    if (results.length === 0) return;

    let content = results.map(res =>
      `🟢 Ronda ${res.round + 1} - Posición ${res.index1to20} (${res.position})
- Tipo de visión: ${res.type}
- Severidad: ${res.severity}
- Emoción: ${res.emotion}
- Confianza: ${Math.round((res.confidence ?? 0) * 100)}%
- Tiempo de respuesta: ${res.responseTime.toFixed(2)} segundos
`).join('\n');

    // Agregar resumen general al final
    const summary = analyzeResults(results);

    content += `

--------------------
Resumen General:
Tiempo promedio: ${summary.avgTime} segundos (${summary.speedLabel})
Emoción más frecuente: ${summary.mostFrequentEmotion}
Tipo probable de daltonismo: ${summary.likelyDeficiency}
Observación: ${summary.feedback}
`;

    // Descargar txt
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'resultados_daltonismo.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const analyzeResults = (results: TestResult[]) => {
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
  };

  return (
    <main>
      {!started && <StartScreen onStart={() => setStarted(true)} />}

      {started && !showResults && currentBaseImage && (
        <>
      <h1>Bienvenido al Test de Daltonismo</h1>

      {!showResults && currentBaseImage && (
        <>
          <FacialLandmarks
            onEmotionChange={(emotion, confidence) => {
              setCurrentEmotion(emotion);
              setCurrentConfidence(confidence);
            }}
          />
          <h4>Elige la imagen que veas con colores normales</h4>
          <h2>Ronda {round + 1} de {roundsCount}</h2>

          <Timer
            isActive={isTimerActive}
            onStop={(time) => setLastTime(time)}
          />

          <SimulatedImageGrid
            originalSrc={currentBaseImage}
            onImagesGenerated={(images) => {
              setSimulatedImages(images);
            }}
          />

          <ImageGrid
            images={simulatedImages}
            onSelect={handleSelection}
          />
        </>
        )}

          {selectedIndex !== null && lastTime !== null && (
            <>
              <p style={{ marginTop: '1rem' }}>
                ✅ Imagen seleccionada: <strong>{selectedIndex + 1}</strong><br />
                ⏱️ Tiempo: <strong>{lastTime} segundos</strong><br />
                😊 Emoción: <strong>{selectedEmotion ?? currentEmotion}</strong> ({Math.round(((selectedConfidence ?? currentConfidence) ?? 0) * 100)}%)
              </p>
              <button onClick={nextRound} style={{ marginTop: '1rem' }}>
                Siguiente ronda
              </button>
            </>
          )}
        </>
      )}

      {showResults && (
        <div style={{ textAlign: 'center' }}>
          <ResultScreen
            results={results}
            onRestart={() => {
              restartTest();
              setStarted(false);  
            }}
          />
          <ResultCharts results={results} />
          <button onClick={exportResultsToTxt} style={{ marginTop: '1rem' }}>
            📥 Descargar resultados
          </button>
        </div>
      )}
    </main>
  );
}
