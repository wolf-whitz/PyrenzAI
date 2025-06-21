import React, { useEffect, useState, useRef } from 'react';
import { Typography, CircularProgress } from '@mui/material';
import CoffeeIcon from '@mui/icons-material/Coffee';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import { Utils } from '~/Utility/Utility';
import { GetUserUUID } from '@components';
import { PyrenzBlueButton } from '~/theme';

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiResponse {
  success: boolean;
  ad_watch_token: string;
}

export function AdModal({ isOpen, onClose }: AdModalProps) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);
  const [showExplosion, setShowExplosion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const coffeeButtonRef = useRef<HTMLButtonElement>(null);

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

  const handleBuyPyrenzPlus = () => {
    navigate('/Subscription');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 w-full h-full"
      style={{
        backgroundColor: 'rgba(15, 20, 30, 0.4)', 
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {showExplosion && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      )}

      <div
        className="p-6 rounded-lg text-center w-full max-w-md relative"
        style={{
          backgroundColor: 'rgba(30, 30, 40, 0.25)', 
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        <div className="relative">
          <button
            ref={coffeeButtonRef}
            className={`mx-auto mb-4 text-white animate-bounce cursor-pointer ${showExplosion ? 'hidden' : ''}`}
            style={{ background: 'none', border: 'none', padding: 0 }}
            onClick={handleCoffeeClick}
          >
            <CoffeeIcon style={{ fontSize: 48 }} />
          </button>
        </div>
        <Typography variant="h6" className="text-white">
          Support PyrenzAI Now!
        </Typography>
        <Typography variant="body1" className="text-white mb-4">
          ☕️ Help keep The devs awake! Your support = more caffeine = more late-night coding sessions 🙌
        </Typography>
        <Typography variant="caption" className="text-gray-300 mb-4 block">
          PS: If you wanna donate press the coffee icon ;3
        </Typography>
        <PyrenzBlueButton
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
        </PyrenzBlueButton>
        <PyrenzBlueButton
          onClick={handleBuyPyrenzPlus}
          sx={{
            mt: 2,
            ml: 2,
            backgroundColor: 'primary.main',
            color: 'white',
          }}
          className="mt-4"
        >
          Buy Pyrenz+
        </PyrenzBlueButton>
      </div>
    </div>
  );
}
