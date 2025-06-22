import React from 'react';
import { Modal, Box, Typography } from '@mui/material';
import { PyrenzBlueButton } from '~/theme';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    title: string;
    price_count_monthly: string;
    price_count_yearly: string;
  } | null;
  isMonthly: boolean;
}

export function PaymentModal({
  isOpen,
  onClose,
  plan,
  isMonthly,
}: PaymentModalProps) {
  const handleKofiClick = () => {
    window.location.href = 'https://ko-fi.com/whitzscott/tiers';
  };

  const price = isMonthly
    ? plan?.price_count_monthly
    : plan?.price_count_yearly;

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 500,
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Payment for {plan?.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Price:</strong> {price}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
          <strong>Important when buying:</strong> PyrenzAI does not offer
          refunds after <strong>5 days</strong> from the purchase date.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <PyrenzBlueButton
            variant="contained"
            onClick={handleKofiClick}
            sx={{
              backgroundColor: '#FF5E5B',
              color: 'white',
              '&:hover': {
                backgroundColor: '#E04746',
              },
            }}
          >
            <img
              src="/Favicons/Kofi.png"
              alt="Kofi"
              style={{ width: '20px', marginRight: '8px' }}
            />
            Buy via Ko-fi
          </PyrenzBlueButton>
        </Box>
      </Box>
    </Modal>
  );
}
