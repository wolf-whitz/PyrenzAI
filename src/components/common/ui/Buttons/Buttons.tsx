import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MoreButtonsModal } from '@components/index';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { buttons, CustomButtonProps } from '@shared-types/MoreButtonsTypes';

export default function CustomButton({ onButtonClick }: CustomButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleButtons, setVisibleButtons] = useState(buttons);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const containerWidth = entry.contentRect.width;
        let count = 0;
        let totalWidth = 0;

        buttons.forEach((btn) => {
          const buttonWidth = 100;
          if (totalWidth + buttonWidth <= containerWidth) {
            totalWidth += buttonWidth;
            count++;
          }
        });

        setVisibleButtons(buttons.slice(0, count));
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

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
        padding: '1rem',
        borderRadius: '0.5rem',
      }}
    >
      {visibleButtons.map((btn, index) => (
        <motion.div key={index}>
          <Button
            variant="outlined"
            startIcon={<btn.icon size={18} />}
            onClick={() =>
              onButtonClick(
                btn.Function,
                btn.type,
                btn.max_character,
                btn.page,
                btn.tag
              )
            }
            sx={{
              borderColor: '#fff',
              color: '#fff',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            {t(btn.label)}
          </Button>
        </motion.div>
      ))}
      <motion.div>
        <Button
          variant="outlined"
          onClick={() => setIsModalOpen(true)}
          sx={{
            borderColor: '#fff',
            color: '#fff',
            borderRadius: '0.375rem',
            padding: '0.5rem 1rem',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          {t('HomePageMoreButtons.btn.more')}
        </Button>
      </motion.div>

      <MoreButtonsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onButtonClick={onButtonClick}
        buttons={buttons}
      />
    </motion.div>
  );
}
