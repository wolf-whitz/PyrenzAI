import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Flame, Tag } from 'lucide-react';
import { MoreButtonsModal } from "@components/index"

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
    label: 'Latest',
    rpcFunction: 'get_latest_characters',
    type: 'GetLatestCharacter',
    max_character: 10,
    page: 1,
  },
  {
    icon: RefreshCw,
    label: 'Random',
    rpcFunction: 'get_random_characters',
    type: 'GetRandomCharacter',
    max_character: 10,
    page: 1,
  },
  {
    icon: Flame,
    label: 'Hot',
    rpcFunction: 'get_hot_characters',
    type: 'GetHotCharacter',
    max_character: 10,
    page: 1,
  },
  {
    icon: Tag,
    label: 'Male',
    rpcFunction: 'get_male_characters',
    type: 'GetMaleCharacter',
    max_character: 10,
    page: 1,
  },
];

type CustomButtonProps = {
  onButtonClick: (rpcFunction: string, type: string, max_character: number, page: number) => void;
};

export default function CustomButton({ onButtonClick }: CustomButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleButtons, setVisibleButtons] = useState(buttons);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      className="flex flex-wrap justify-center gap-2 mb-6 text-white font-baloo p-4 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {buttons.map((btn, index) => (
        <motion.button
          key={index}
          className="border border-white flex items-center space-x-2 rounded-md px-4 py-2 bg-black text-white transform transition-transform duration-300 hover:scale-105 font-baloo"
          onClick={() =>
            onButtonClick(
              btn.rpcFunction,
              btn.type,
              btn.max_character,
              btn.page
            )
          }
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ display: index < visibleButtons.length ? 'flex' : 'none' }}
        >
          <btn.icon size={18} />
          <span>{btn.label}</span>
        </motion.button>
      ))}
      <motion.button
        className="border border-white flex items-center space-x-2 rounded-md px-4 py-2 bg-black text-white transform transition-transform duration-300 hover:scale-105 font-baloo"
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>More</span>
      </motion.button>

      <MoreButtonsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onButtonClick={onButtonClick}
      />
    </motion.div>
  );
}
