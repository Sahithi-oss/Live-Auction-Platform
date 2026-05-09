import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ targetDate, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference
      };
    } else {
      timeLeft = { total: 0 };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining.total <= 0) {
        clearInterval(timer);
        if (onEnd) onEnd();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.total <= 0) {
    return <span className="text-red-500 font-bold">Ended</span>;
  }

  const format = (num) => String(num).padStart(2, '0');

  return (
    <div className="flex items-center gap-1 font-mono font-bold">
      {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
      <span>{format(timeLeft.hours)}</span>:
      <span>{format(timeLeft.minutes)}</span>:
      <span className="text-sky-400">{format(timeLeft.seconds)}</span>
    </div>
  );
};

export default CountdownTimer;
