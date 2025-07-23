import { motion } from 'framer-motion';
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { buttons } from '@shared-types';
import { MoreButtonsModal } from '@components';
import { PyrenzBlueButton, NSFWSwitch } from '~/theme';

interface CustomButtonProps {
  onButtonClick: (
    type: string,
    maxCharacter?: number,
    page?: number,
    tag?: string,
    gender?: 'male' | 'female',
    searchQuery?: string
  ) => void;
  onButtonTagClicked: (tag: string) => void;
}

export function CustomButton({
  onButtonClick,
  onButtonTagClicked,
}: CustomButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleButtons] = useState(buttons);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const handleButtonClick = async (
    type: string,
    maxCharacter?: number,
    page?: number,
    tag?: string,
    gender?: 'male' | 'female'
  ) => {
    setLoading(true);
    await onButtonClick(type, maxCharacter, page, tag, gender, searchQuery);
    console.log(type);
    setLoading(false);
  };

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
        alignItems: 'center',
        gap: '8px',
        marginBottom: '1.5rem',
      }}
    >
      {visibleButtons.map((btn, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <PyrenzBlueButton
            variant="contained"
            startIcon={React.createElement(btn.icon, { size: 18 })}
            onClick={() =>
              handleButtonClick(
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: visibleButtons.length * 0.1 }}
      >
        <PyrenzBlueButton
          variant="contained"
          onClick={() => setIsModalOpen(true)}
        >
          {t('HomePageMoreButtons.btn.more')}
        </PyrenzBlueButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: (visibleButtons.length + 1) * 0.1 }}
        style={{ display: 'flex', alignItems: 'center', height: 40 }}
      >
        <NSFWSwitch />
      </motion.div>

      {isModalOpen && (
        <MoreButtonsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onButtonTagClicked={onButtonTagClicked}
        />
      )}
    </motion.div>
  );
}
