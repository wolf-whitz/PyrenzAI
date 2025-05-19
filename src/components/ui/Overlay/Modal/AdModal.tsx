import React, { useEffect, useState } from 'react';
import { Button, Typography, CircularProgress } from '@mui/material';
import CoffeeIcon from '@mui/icons-material/Coffee';
import Confetti from 'react-confetti';
import { Utils } from '~/Utility/Utility';
import { GetUserUUID } from '@components';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiResponse {
  success: boolean;
  ad_watch_token: string;
}

export function AdModal({ isOpen, onClose }: AdModalProps) {
  const [countdown, setCountdown] = useState(15);
  const [showExplosion, setShowExplosion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setCountdown(15);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  const handleCoffeeClick = () => {
    setShowExplosion(true);
    setTimeout(() => {
      setShowExplosion(false);
      window.location.href = 'https://ko-fi.com/whitzscott';
    }, 5000);
  };

  const handleClose = async () => {
    setIsLoading(true);
    const user_uuid = await GetUserUUID();
    const pressed_at = new Date().toISOString();

    if (!user_uuid || user_uuid.trim() === '') {
      console.error('User UUID is invalid or empty:', user_uuid);
      setIsLoading(false);
      return;
    }

    try {
      const response = await Utils.post('/api/Getadtoken', {
        user_uuid,
        pressed_at,
      });
      const apiResponse = response as ApiResponse;

      if (apiResponse.success && apiResponse.ad_watch_token) {
        localStorage.setItem('ad_watch_token', apiResponse.ad_watch_token);
      }
      onClose();
    } catch (error) {
      console.error('Error fetching token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-100 w-full h-full">
      {showExplosion && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}
      <div className="bg-black bg-opacity-80 p-6 rounded-lg text-center w-full max-w-md relative">
        <div className="relative">
          <CoffeeIcon
            className={`mx-auto mb-4 text-white animate-bounce cursor-pointer ${showExplosion ? 'hidden' : ''}`}
            style={{ fontSize: 48 }}
            onClick={handleCoffeeClick}
          />
        </div>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          className="text-white"
        >
          Support PyrenzAI Now!
        </Typography>
        <Typography variant="body1" className="text-white mb-4">
          ☕️ Help keep PyrenzAI awake! Your support = more caffeine = more
          late-night coding sessions 🙌
        </Typography>
        <Typography variant="caption" className="text-gray-400 mb-4 block">
          PS: If you wanna donate press the coffee icon ;3
        </Typography>
        <Button
          onClick={handleClose}
          disabled={countdown > 0 || isLoading}
          sx={{
            mt: 2,
            backgroundColor: countdown > 0 ? 'error.main' : 'success.main',
            color: 'white',
            '&:hover': {
              backgroundColor: countdown > 0 ? 'error.dark' : 'success.dark',
            },
          }}
          className="mt-4"
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : countdown > 0 ? (
            `Please wait (${countdown})`
          ) : (
            'Close'
          )}
        </Button>
      </div>
    </div>
  );
}
