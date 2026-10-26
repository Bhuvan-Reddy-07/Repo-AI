import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  threshold?: number;
}

export const BackToTop: React.FC<BackToTopProps> = ({ containerRef, threshold = 200 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      let scrollY = 0;
      if (containerRef && containerRef.current) {
        scrollY = containerRef.current.scrollTop;
      } else {
        scrollY = window.scrollY || document.documentElement.scrollTop;
      }
      setIsVisible(scrollY > threshold);
    };

    const targetEl = containerRef?.current;
    if (targetEl) {
      targetEl.addEventListener('scroll', checkScroll, { passive: true });
    }
    window.addEventListener('scroll', checkScroll, { passive: true });

    checkScroll();

    return () => {
      if (targetEl) {
        targetEl.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('scroll', checkScroll);
    };
  }, [containerRef, threshold]);

  const scrollToTop = () => {
    if (containerRef && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <button
      id="back-to-top"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      className="fixed bottom-24 sm:bottom-28 right-6 z-40 p-2.5 rounded-xl bg-white dark:bg-[#161B22] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-200 group print:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
      title="Back to Top"
    >
      <ArrowUp className="w-4 h-4 text-blue-600 dark:text-sky-400" />
    </button>
  );
};
