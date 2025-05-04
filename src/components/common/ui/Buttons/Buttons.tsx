import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Flame, Tag } from 'lucide-react';
import { MoreButtonsModal } from '@components/index';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

type ButtonType = {
  icon: React.ElementType;
  label: string;
  rpcFunction: string;
  type: string;
  max_character: number;
  page: number;
};

const buttons: ButtonType[] = [
  {
    icon: Sparkles,
    label: 'HomePageMoreButtons.btn.latest',
    rpcFunction: 'get_latest_characters',
    type: 'GetLatestCharacter',
    max_character: 10,
    page: 1,
  },
  {
    icon: RefreshCw,
    label: 'HomePageMoreButtons.btn.random',
    rpcFunction: 'get_random_characters',
    type: 'GetRandomCharacter',
    max_character: 10,
    page: 1,
  },
  {
    icon: Flame,
    label: 'HomePageMoreButtons.btn.hot',
    rpcFunction: 'get_hot_characters',
    type: 'GetHotCharacter',
    max_character: 10,
    page: 1,
  },
  {
    icon: Tag,
    label: 'HomePageMoreButtons.btn.male',
    rpcFunction: 'get_characters_with_tags',
    type: 'GetMaleCharacter',
    max_character: 10,
    page: 1,
  },
];

type CustomButtonProps = {
  onButtonClick: (
    rpcFunction: string,
    type: string,
    max_character: number,
    page: number
  ) => void;
};

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
      {buttons.map((btn, index) => (
        <motion.div
          key={index}
          style={{ display: index < visibleButtons.length ? 'flex' : 'none' }}
        >
          <Button
            variant="outlined"
            startIcon={<btn.icon size={18} />}
            onClick={() =>
              onButtonClick(
                btn.rpcFunction,
                btn.type,
                btn.max_character,
                btn.page
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
      />
    </motion.div>
  );
}
