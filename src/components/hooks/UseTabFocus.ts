import { useEffect, useState } from 'react';

export const useTabFocus = () => {
  const [isTabFocused, setIsTabFocused] = useState(document.visibilityState === 'visible');

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabFocused(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isTabFocused;
};
