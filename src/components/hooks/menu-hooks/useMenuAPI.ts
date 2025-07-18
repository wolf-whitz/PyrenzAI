import { useEffect, useState, useCallback } from 'react';
import { supabase } from '~/Utility';
import { Character } from '@shared-types';
import { GetUserData } from '@components';
import * as Sentry from '@sentry/react';

interface MenuAPIProps {
  char: Character;
}

interface AICustomization {
  model: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
  modelMemoryLimit: number;
}

export const useMenuAPI = ({ char }: MenuAPIProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Cosmetic');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [aiCustomization, setAiCustomization] = useState<AICustomization | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleCharacterDetailsSubmit = useCallback(
    async (characterDetails: Character) => {
      try {
        const { error } = await supabase
          .from('chats')
          .update({
            name: characterDetails.name,
            persona: characterDetails.persona,
            model_instructions: characterDetails.model_instructions,
          })
          .eq('char_uuid', char.char_uuid);

        if (error) throw error;

        console.log('Character details updated successfully');
      } catch (error) {
        console.error('Error updating character details:', error);
        Sentry.captureException(error);
      }
    },
    [char.char_uuid]
  );

  useEffect(() => {
    const savedBg = localStorage.getItem('bgImage');
    if (savedBg) {
      setBgImage(savedBg);
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        const result = await GetUserData();

        if ('error' in result) {
          console.error(result.error);
          return;
        }

        const userData = result;

        if (userData && 'ai_customization' in userData) {
          const { modelMemoryLimit, ...restCustomization } = userData.ai_customization;

          if (isMounted) {
            setAiCustomization({
              ...restCustomization,
              modelMemoryLimit: modelMemoryLimit ?? 15,
            });

            const plan = userData.subscription_data?.tier;
            setSubscriptionPlan(
              ['MELON', 'PINEAPPLE', 'DURIAN'].includes(plan) ? plan : null
            );
          }
        }
      } catch (error) {
        Sentry.captureException(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isDropdownOpen,
    setIsDropdownOpen,
    selectedOption,
    setSelectedOption,
    bgImage,
    setBgImage,
    aiCustomization,
    subscriptionPlan,
    loading,
    handleCharacterDetailsSubmit,
  };
};
