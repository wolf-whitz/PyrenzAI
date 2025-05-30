import { PyrenzBlueButton } from '~/theme';
import React, { useState, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { buttons, CustomButtonProps } from '@shared-types/MoreButtonsTypes';

const MoreButtonsModal = React.lazy(() =>
  import('~/components/ui/Overlay/Modal/MoreButtonsModal').then((module) => ({
    default: module.MoreButtonsModal,
  }))
);

export function CustomButton({ onButtonClick }: CustomButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleButtons, setVisibleButtons] = useState(buttons);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const handleButtonClick = async (
    func: any,
    type: string,
    maxCharacter: number,
    page: number,
    tag: string
  ) => {
    setLoading(true);
    await onButtonClick(func, type, maxCharacter, page, tag);
    console.log(func, type, maxCharacter, page, tag);
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
        gap: '8px',
        marginBottom: '1.5rem',
      }}
    >
      {visibleButtons.map((btn, index) => (
        <motion.div key={index}>
          <PyrenzBlueButton
            variant="contained"
            startIcon={<btn.icon size={18} />}
            onClick={() =>
              handleButtonClick(
                btn.Function,
                btn.type,
                btn.max_character,
                btn.page,
                btn.tag as string
              )
            }
            data-state={loading ? 'loading' : undefined}
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

      {isModalOpen && (
        <Suspense>
          <MoreButtonsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onButtonClick={onButtonClick}
            buttons={buttons}
          />
        </Suspense>
      )}
    </motion.div>
  );
}
