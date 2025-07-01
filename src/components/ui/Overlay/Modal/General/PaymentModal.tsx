import { Box, Typography } from '@mui/material';
import { PyrenzBlueButton, PyrenzModal, PyrenzModalContent } from '~/theme';

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
    <PyrenzModal open={isOpen} onClose={onClose}>
      <PyrenzModalContent>
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
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
