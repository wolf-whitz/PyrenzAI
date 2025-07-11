import { useEffect, useState } from 'react';
import { supabase } from '@utils';
import { Character } from '@shared-types';
import { GetUserData } from '@components';
import * as Sentry from '@sentry/react';

interface MenuAPIProps {
  char: Character;
}

export const useMenuAPI = ({ char }: MenuAPIProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Cosmetic');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [aiCustomization, setAiCustomization] = useState<any>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleCharacterDetailsSubmit = async (characterDetails: Character) => {
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
  };

  useEffect(() => {
    const savedBg = localStorage.getItem('bgImage');
    if (savedBg) {
      setBgImage(savedBg);
    }

    const fetchData = async () => {
      try {
        const userData = await GetUserData();
        console.log(userData);

        if (userData && 'ai_customization' in userData) {
          setAiCustomization(userData.ai_customization);
          const plan = userData.subscription_data.tier;

          if (['MELON', 'PINEAPPLE', 'DURIAN'].includes(plan)) {
            setSubscriptionPlan(plan);
          } else {
            setSubscriptionPlan(null);
          }
        }
      } catch (error) {
        Sentry.captureException(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    isDropdownOpen,
    setIsDropdownOpen,
    selectedOption,
    setSelectedOption,
    bgImage,
    aiCustomization,
    subscriptionPlan,
    loading,
    handleCharacterDetailsSubmit,
  };
};
