import React, { useEffect, useState } from 'react';

interface TimerProps {
  isActive: boolean;
  onStop: (timeInSeconds: number) => void;
}

const Timer: React.FC<TimerProps> = ({ isActive, onStop }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      setSeconds(0);  
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      onStop(seconds);
    }
  }, [isActive, seconds, onStop]);

  return (
    <div>
      <p>⏱ Tiempo: {seconds}s</p>
    </div>
  );
};

export default Timer;

