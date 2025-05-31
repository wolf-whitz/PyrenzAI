import React, { useState } from 'react';
import {
  SubscriptionCard,
  PaymentModal,
  Sidebar,
  MobileNav,
} from '@components';
import { useUserStore } from '~/store';
import { PyrenzBlueButton } from '~/theme';
import { Box, useMediaQuery, useTheme } from '@mui/material';

interface Plan {
  title: string;
  price_count_monthly: string;
  price_count_yearly: string;
  plan_identifier: string;
  descriptions: string[];
  color?: string;
  backgroundImage?: string;
}

const subscriptionPlans: Plan[] = [
  {
    title: 'Azura (Blueberry)',
    price_count_monthly: 'Free',
    price_count_yearly: 'Free',
    plan_identifier: 'melon',
    descriptions: [
      '### Unlimited Free Messages\nNo subscription, no stress.\n#4CAF50',
      '### Top-Tier Free Models\nTap into our top-tier free models anytime. Upto 15K context!\n#4CAF50',
      '### Multiple Personas\nCreate up to 3 unique personas.\n#4CAF50',
    ],
    color: '#4CAF50',
    backgroundImage:
      'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/cdn/Pyrenzia.png',
  },
  {
    title: 'Solara (Strawberry)',
    price_count_monthly: '$15/Month',
    price_count_yearly: '$150/Year',
    plan_identifier: 'pineapple',
    descriptions: [
      '### Top-Tier Models\nExperience top-tier models, featuring 15K–20K context windows designed for advanced memory retention.\n#2196F3',
      '### Rich, Extended Responses\nEnjoy rich, extended responses perfect for deep roleplay sessions.\n#2196F3',
      '### Expanded Lore Support\nEnhance your stories with expanded lore support for deeper worldbuilding.\n#2196F3',
    ],
    color: '#2196F3',
    backgroundImage:
      'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/cdn//Azalea.png',
  },
  {
    title: 'Nyra (Pineapple)',
    price_count_monthly: '$20/Month',
    price_count_yearly: '$200/Year',
    plan_identifier: 'durian',
    descriptions: [
      '### Richer, More Immersive Chats\nTry out Nyra for richer, more immersive chats with a beefy 20K–30K context window!\n#FF5722',
      '### Expansive, Detailed Responses\nReceive expansive, detailed responses tailored for immersive roleplay.\n#FF5722',
      '### Unlimited Personalities\nUnlock unlimited personalities to keep your conversations fresh.\n#FF5722',
    ],
    color: '#FF5722',
    backgroundImage:
      'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/cdn/PyrenzImage.png',
  },
];

export function Subscription() {
  const [selectedPlanTitle, setSelectedPlanTitle] = useState<string | null>(
    null
  );
  const [isMonthly, setIsMonthly] = useState<boolean>(true);
  const [hoveredPlanTitle, setHoveredPlanTitle] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const userStore = useUserStore();
  const userSubscriptionPlan = userStore.subscription_plan || [];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubscribeClick = (title: string) => {
    setSelectedPlanTitle(title);
  };

  const handleCloseModal = () => {
    setSelectedPlanTitle(null);
  };

  const selectedPlan = subscriptionPlans.find(
    (plan) => plan.title === selectedPlanTitle
  );

  const getButtonStyle = (isActive: boolean) => ({
    color: 'white',
    backgroundColor: isActive
      ? isMonthly
        ? '#2196F3'
        : '#4CAF50'
      : 'rgba(0, 0, 0, 0.3)',
    border: `2px solid ${isMonthly ? '#2196F3' : '#4CAF50'}`,
    borderRadius: '20px',
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>
        {!isMobile && <Sidebar />}
        {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: isMobile ? 2 : 5,
          }}
        >
          <Box display="flex" gap={4} mb={5}>
            <PyrenzBlueButton
              onClick={() => {
                setIsMonthly(true);
              }}
              sx={getButtonStyle(isMonthly)}
            >
              Monthly
            </PyrenzBlueButton>
            <PyrenzBlueButton
              onClick={() => {
                setIsMonthly(false);
              }}
              sx={getButtonStyle(!isMonthly)}
            >
              Yearly
            </PyrenzBlueButton>
          </Box>
          <Box display="flex" flexWrap="wrap" justifyContent="center" gap={5}>
            {subscriptionPlans.map((plan) => {
              const isSubscribed = userSubscriptionPlan.includes(plan.title);
              const isHighlighted =
                hoveredPlanTitle === null
                  ? isSubscribed
                  : hoveredPlanTitle === plan.title;

              return (
                <SubscriptionCard
                  key={plan.title}
                  plan={plan}
                  isSubscribed={isSubscribed}
                  onSubscribe={handleSubscribeClick}
                  isMonthly={isMonthly}
                  isHighlighted={isHighlighted}
                  onMouseEnter={() => {
                    setHoveredPlanTitle(plan.title);
                  }}
                  onMouseLeave={() => {
                    setHoveredPlanTitle(null);
                  }}
                />
              );
            })}
          </Box>
          {selectedPlan && (
            <PaymentModal
              plan={selectedPlan}
              isOpen={!!selectedPlan}
              onClose={handleCloseModal}
              isMonthly={isMonthly}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
