import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

export function SkeletonCard() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        className={`w-full min-h-[360px] rounded-lg shadow-md border border-gray-600 bg-gray-800 overflow-hidden
          ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
      >
        <Box
          className={`w-full h-48 bg-gray-600 rounded-t-lg
            ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity delay-200 duration-500`}
        ></Box>

        <Box sx={{ p: 3 }}>
          <Box
            className={`h-6 bg-gray-500 w-3/4 mb-2 rounded
              ${isLoaded ? 'w-3/4' : 'w-0'} transition-all delay-400 duration-500`}
          ></Box>

          <Box
            className={`h-4 bg-gray-500 w-full mb-2 rounded
              ${isLoaded ? 'w-full' : 'w-0'} transition-all delay-600 duration-500`}
          ></Box>

          <Box
            className={`h-4 bg-gray-500 w-2/3 mb-2 rounded
              ${isLoaded ? 'w-2/3' : 'w-0'} transition-all delay-800 duration-500`}
          ></Box>

          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {[...Array(3)].map((_, index) => (
              <Box
                key={index}
                className={`h-6 bg-gray-500 w-16 rounded-full
                  ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity delay-[${1 + index * 0.2}s] duration-500`}
              ></Box>
            ))}
          </Box>

          <Box
            sx={{
              mt: 4,
              display: 'flex',
              alignItems: 'center',
              color: 'grey.500',
              fontSize: '12px',
            }}
          >
            <Box
              className={`h-5 w-12 bg-gray-500 rounded
                ${isLoaded ? 'w-12' : 'w-0'} transition-all delay-[1.6s] duration-500`}
            ></Box>
            <Box
              sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <Box
                className={`h-5 w-5 bg-gray-500 rounded-full
                  ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity delay-[1.8s] duration-500`}
              ></Box>
              <Box
                className={`h-5 w-5 bg-gray-500 rounded-full
                  ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity delay-[2s] duration-500`}
              ></Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
