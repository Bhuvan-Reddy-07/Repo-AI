import React, { useEffect, useState } from 'react';

interface ScrollProgressBarProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ containerRef }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      let currentProgress = 0;

      if (containerRef && containerRef.current) {
        const el = containerRef.current;
        const totalHeight = el.scrollHeight - el.clientHeight;
        if (totalHeight > 0) {
          currentProgress = (el.scrollTop / totalHeight) * 100;
        }
      } else {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height > 0) {
          currentProgress = (winScroll / height) * 100;
        }
      }

      setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    const targetEl = containerRef?.current;
    if (targetEl) {
      targetEl.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      if (targetEl) {
        targetEl.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef]);

  return (
    <div
      id="scroll-progress-bar"
      className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent pointer-events-none print:hidden"
    >
      <div
        className="h-full bg-blue-600 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
