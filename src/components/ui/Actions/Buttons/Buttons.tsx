import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { buttons } from '@shared-types';
import { MoreButtonsModal } from '@components';
import { PyrenzBlueButton, NSFWSwitch } from '~/theme'; 
import { useUserStore } from '~/store';

interface CustomButtonProps {
  onButtonClick: (
    func: string,
    type: string,
    maxCharacter?: number,
    page?: number,
    tag?: string,
    gender?: 'male' | 'female',
    searchQuery?: string
  ) => void;
  onQuery: (query: string) => void;
}

export function CustomButton({ onButtonClick, onQuery }: CustomButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleButtons] = useState(buttons);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalResults, setModalResults] = useState([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const showNSFW = useUserStore((state) => state.show_nsfw);

  const handleButtonClick = async (
    func: string,
    type: string,
    maxCharacter?: number,
    page?: number,
    tag?: string,
    gender?: 'male' | 'female'
  ) => {
    setLoading(true);
    await onButtonClick(func, type, maxCharacter, page, tag, gender, searchQuery);
    setLoading(false);
  };

  const handleQuery = (query: string) => {
    onQuery(query);
  };

  useEffect(() => {
    const reloadCharacters = async () => {
      //Reload mechanism
      setLoading(true);
    };

    reloadCharacters();
  }, [showNSFW]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '1.5rem',
      }}
    >
      {visibleButtons.map((btn, index) => (
        <motion.div key={index}>
          <PyrenzBlueButton
            variant="contained"
            startIcon={React.createElement(btn.icon, { size: 18 })}
            onClick={() =>
              handleButtonClick(
                btn.Function,
                btn.type,
                btn.max_character,
                btn.page,
                btn.tag,
                btn.gender === 'male' || btn.gender === 'female'
                  ? btn.gender
                  : undefined
              )
            }
           >
            {t(btn.label)}
          </PyrenzBlueButton>
        </motion.div>
      ))}
      <motion.div>
        <PyrenzBlueButton
          variant="contained"
          onClick={() => setIsModalOpen(true)}
        >
          {t('HomePageMoreButtons.btn.more')}
        </PyrenzBlueButton>
      </motion.div>
      <NSFWSwitch />
      {isModalOpen && (
        <MoreButtonsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onButtonClick={handleButtonClick}
          buttons={buttons}
          onQuery={handleQuery}
          modalResults={modalResults}
          loading={loading}
          searchQuery={searchQuery}
        />
      )}
    </motion.div>
  );
}
