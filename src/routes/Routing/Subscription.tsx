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
    title: 'Solara (Strawberry)',
    price_count_monthly: 'Free',
    price_count_yearly: 'Free',
    plan_identifier: 'melon',
    descriptions: [
      '### Unlimited Free Messages\nNo subscription, no stress.\n#4CAF50',
      '### Top-Tier Free Models\nAccess our top-tier free models anytime — up to 15K context!\n#4CAF50',
      '### Multiple Personas\nCreate an unlimited number of unique personas.\n#4CAF50',
    ],
    color: '#4CAF50',
    backgroundImage:
      'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/cdn//Solara.avif',
  },
  {
    title: 'Azura (Blueberry)',
    price_count_monthly: '$15/Month',
    price_count_yearly: '$150/Year',
    plan_identifier: 'pineapple',
    descriptions: [
      '### Top-Tier Models\nExperience premium models with 15K–20K context windows, designed for advanced memory retention.\n#2196F3',
      '### Rich, Extended Responses\nEnjoy extended, high-quality responses perfect for immersive roleplay.\n#2196F3',
      '### Better Models\nEnjoy access to up to 10 of the best free and paid models!\n#2196F3',
    ],
    color: '#2196F3',
    backgroundImage:
      'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/cdn/Azura.avif',
  },
  {
    title: 'Nyra (Pineapple)',
    price_count_monthly: '$20/Month',
    price_count_yearly: '$200/Year',
    plan_identifier: 'durian',
    descriptions: [
      '### Richer, More Immersive Chats\nDive into deeper conversations with a robust 20K–30K context window!\n#FF5722',
      '### Expansive, Detailed Responses\nReceive highly detailed responses tailored for rich roleplay.\n#FF5722',
      '### Full Model Access\nEnjoy the benefits of full access to all available models and upcoming ones!\n#FF5722',
    ],
    color: '#FF5722',
    backgroundImage:
      'https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/cdn/Nyra.avif',
  },
];

export function Subscription() {
  const [selectedPlanTitle, setSelectedPlanTitle] = useState<string | null>(null);
  const [isMonthly, setIsMonthly] = useState<boolean>(true);
  const [hoveredPlanTitle, setHoveredPlanTitle] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const userStore = useUserStore();
  const userSubscriptionPlan = userStore.subscription_plan || null;
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
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}
          <Box sx={{ marginTop: isMobile ? '56px' : 0 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: isMobile ? 2 : 5,
                flex: 1,
              }}
            >
              <Box display="flex" gap={4} mb={5}>
                <PyrenzBlueButton
                  onClick={() => setIsMonthly(true)}
                  sx={getButtonStyle(isMonthly)}
                >
                  Monthly
                </PyrenzBlueButton>
                <PyrenzBlueButton
                  onClick={() => setIsMonthly(false)}
                  sx={getButtonStyle(!isMonthly)}
                >
                  Yearly
                </PyrenzBlueButton>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                {subscriptionPlans.map((plan) => {
                  const isSubscribed = userSubscriptionPlan
                    ? userSubscriptionPlan
                        .map((planId) => planId.toLowerCase())
                        .includes(plan.plan_identifier.toLowerCase())
                    : false;
                  const isHighlighted =
                    hoveredPlanTitle === null
                      ? isSubscribed ||
                        (userSubscriptionPlan === null &&
                          plan.title === 'Azura (Blueberry)')
                      : hoveredPlanTitle === plan.title;
                  return (
                    <SubscriptionCard
                      key={plan.title}
                      plan={plan}
                      isSubscribed={isSubscribed}
                      onSubscribe={handleSubscribeClick}
                      isMonthly={isMonthly}
                      isHighlighted={isHighlighted}
                      onMouseEnter={() => setHoveredPlanTitle(plan.title)}
                      onMouseLeave={() => setHoveredPlanTitle(null)}
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
      </Box>
    </Box>
  );
}
