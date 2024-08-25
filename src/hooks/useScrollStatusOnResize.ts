import { useState, useEffect } from 'react';

function useScrollStatusOnResize() {
  const [isScrollingEnabled, setIsScrollingEnabled] = useState(true);

  useEffect(() => {
    let resizeTimer: number | undefined;

    const handleResize = () => {
      setIsScrollingEnabled(false);

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setIsScrollingEnabled(true);
      }, 500);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isScrollingEnabled;
}

export default useScrollStatusOnResize;
