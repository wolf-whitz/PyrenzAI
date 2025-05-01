import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

interface PersonaCard {
  id: string;
  name: string;
  description: string;
}

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  personaData: PersonaCard[];
  loading: boolean;
  onSelect: (persona: PersonaCard) => void;
}

export default function PersonaModal({
  isOpen,
  onClose,
  personaData,
  loading,
  onSelect,
}: PersonaModalProps) {
  const truncateDescription = (description: string, limit: number = 100) => {
    return description.length > limit
      ? `${description.slice(0, limit)}...`
      : description;
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
      onClick={onClose}
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-lg p-5 w-96"
        initial={{ y: '-100vh', scale: 0.8 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: '100vh', scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" className="text-white">
            Personas
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box mt={4} className="space-y-4">
            {personaData.length > 0 ? (
              personaData.map((persona) => (
                <Box
                  key={persona.id}
                  className="bg-gray-700 rounded-lg p-4"
                  display="flex"
                  flexDirection="column"
                >
                  <Typography variant="h6" className="text-white">
                    {persona.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-300">
                    {truncateDescription(persona.description)}
                  </Typography>
                  <Button
                    onClick={() => onSelect(persona)}
                    variant="contained"
                    color="primary"
                    className="mt-3"
                  >
                    Select
                  </Button>
                </Box>
              ))
            ) : (
              <Typography variant="body1" className="text-center text-white">
                No persona data available.
              </Typography>
            )}
          </Box>
        )}
      </motion.div>
    </motion.div>,
    document.getElementById('modal-root')!
  );
}
