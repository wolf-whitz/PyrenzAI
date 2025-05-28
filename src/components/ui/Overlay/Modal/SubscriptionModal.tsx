import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
import { useUserStore } from '~/store';
import { SubscriptionCard, PaymentModal } from '@components';

interface Plan {
  title: string;
  price_count: string;
  plan_identifier: string;
  descriptions: string[];
  color: string;
  backgroundImage: string;
}

const subscriptionPlans: Plan[] = [
  {
    title: "Melon",
    price_count: "Free",
    plan_identifier: "melon",
    descriptions: [
      "### Unlimited Free Messages\nNo subscription, no stress.\n#4CAF50",
      "### Top-Tier Free Models\nTap into our top-tier free models anytime. Upto 15K context!\n#4CAF50",
      "### Multiple Personas\nCreate up to 3 unique personas.\n#4CAF50"
    ],
    color: "#4CAF50",
    backgroundImage: "https://example.com/path-to-melon-background.jpg"
  },
  {
    title: "Plan 2",
    price_count: "$15/Month",
    plan_identifier: "pineapple",
    descriptions: [
      "### Top-Tier Models\nExperience top-tier models, featuring 15K–20K context windows designed for advanced memory retention.\n#2196F3",
      "### Rich, Extended Responses\nEnjoy rich, extended responses perfect for deep roleplay sessions.\n#2196F3",
      "### Expanded Lore Support\nEnhance your stories with expanded lore support for deeper worldbuilding.\n#2196F3"
    ],
    color: "#2196F3",
    backgroundImage: "https://example.com/path-to-plan2-background.jpg"
  },
  {
    title: "Plan 3",
    price_count: "$20/Month",
    plan_identifier: "durian",
    descriptions: [
      "### Richer, More Immersive Chats\nDive into Banana Munch for richer, more immersive chats with a beefy 20K–30K context window!\n#FF5722",
      "### Expansive, Detailed Responses\nReceive expansive, detailed responses tailored for immersive roleplay.\n#FF5722",
      "### Unlimited Personalities\nUnlock unlimited personalities to keep your conversations fresh.\n#FF5722"
    ],
    color: "#FF5722",
    backgroundImage: "https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/DurianPyrenzia.avif"
  }
];

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const userStore = useUserStore();
  const userSubscriptionPlan = userStore.subscription_plan || [];
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleSubscribeClick = (title: string) => {
    const plan = subscriptionPlans.find(p => p.title === title);
    if (plan) {
      setSelectedPlan(plan);
      setIsPaymentModalOpen(true);
    }
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 900,
          bgcolor: 'transparent',
          boxShadow: 'none',
          p: 4,
          borderRadius: 2,
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 3,
          }}>
            {subscriptionPlans.map((plan, index) => {
              const isSubscribed = plan.title === "Melon" || userSubscriptionPlan.includes(plan.title);
              return (
                <SubscriptionCard
                  key={index}
                  plan={plan}
                  isSubscribed={isSubscribed}
                  onSubscribe={handleSubscribeClick}
                />
              );
            })}
          </Box>
        </Box>
      </Modal>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        plan={selectedPlan}
      />
    </>
  );
}
