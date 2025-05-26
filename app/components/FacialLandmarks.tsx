import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

type Props = {
  onEmotionChange?: (emotion: string, confidence: number | null) => void;
};

const FacialLandmarks: React.FC<Props> = ({ onEmotionChange }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emotion, setEmotion] = useState('Cargando...');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const emotionEmoji = (name: string) => {
    const map: Record<string, string> = {
      happy: '😄',
      sad: '😢',
      angry: '😠',
      fearful: '😱',
      disgusted: '🤢',
      surprised: '😲',
      neutral: '😐',
      'No detectado': '🚫',
      'Cargando...': '⏳',
    };
    return map[name] || '❓';
  };

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      console.log('✅ Modelos cargados');
    };

    const setupCameraAndDetection = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          setCameraReady(true);
          detectEmotion();
        };
      }
    };

    const detectEmotion = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const result = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx && videoRef.current) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }

      if (result?.expressions) {
        const sorted = Object.entries(result.expressions).sort((a, b) => b[1] - a[1]);
        const [topEmotion, topConfidence] = sorted[0];

        if (topConfidence > 0.5) {
          setEmotion(topEmotion);
          setConfidence(topConfidence);
          onEmotionChange?.(topEmotion, topConfidence);
        } else {
          setEmotion('No detectado');
          setConfidence(null);
          onEmotionChange?.('No detectado', null);
        }
      } else {
        setEmotion('No detectado');
        setConfidence(null);
        onEmotionChange?.('No detectado', null);
      }

      requestAnimationFrame(detectEmotion);
    };

    loadModels().then(setupCameraAndDetection);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '470px', margin: 'auto' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          boxShadow: '0 0 5px rgba(0,0,0,0.2)',
          background: cameraReady ? 'transparent' : '#f0f0f0',
        }}
      />
      <h3 style={{ textAlign: 'center', marginTop: '0.5rem' }}>
        Emoción detectada: <strong>{emotionEmoji(emotion)} {emotion}</strong>
        {confidence !== null && ` (${Math.round(confidence * 100)}%)`}
      </h3>
    </div>
  );
};

export default FacialLandmarks;



