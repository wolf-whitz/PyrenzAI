import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { buttons } from '@shared-types';
import { MoreButtonsModal } from '@components';
import { PyrenzBlueButton, NSFWSwitch } from '~/theme';

interface CustomButtonProps {
  onButtonClick: (
    type: 'hot' | 'latest' | 'random' | 'tags',
    page: number,
    options?: {
      tag?: string;
      gender?: 'male' | 'female';
      searchQuery?: string;
    }
  ) => Promise<void>;
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

  const handleCharacterFetchClick = async (
    type: 'hot' | 'latest' | 'random' | 'tags',
    page: number,
    tag?: string,
    gender?: string
  ) => {
    setLoading(true);

    await onButtonClick(type, page, {
      tag,
      gender:
        gender === 'male' || gender === 'female'
          ? (gender as 'male' | 'female')
          : undefined,
      searchQuery,
    });

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
              handleCharacterFetchClick(
                btn.type as 'hot' | 'latest' | 'random' | 'tags',
                btn.page ?? 1,
                btn.tag,
                btn.gender
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
        transition={{
          duration: 0.5,
          delay: (visibleButtons.length + 1) * 0.1,
        }}
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
