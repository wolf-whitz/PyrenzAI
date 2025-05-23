import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';

type PyrenzAlertProps = {
  mode: 'Success' | 'Alert';
  message: string;
  onClose: () => void;
};

const PyrenzAlertComponent = ({ mode, message, onClose }: PyrenzAlertProps) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      onClose();
    }, 10000);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'c') {
        setOpen(false);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const alertIcon = mode === 'Success' ? (
    <CheckCircleOutlineIcon style={{ color: 'green' }} />
  ) : (
    <ErrorOutlineIcon style={{ color: 'red' }} />
  );

  const handleDragEnd = (event: MouseEvent, info: any) => {
    if (info.offset.y > 100) {
      setOpen(false);
      onClose();
    }
  };

  const notificationRoot = document.getElementById('notification-root');

  if (!notificationRoot) {
    return null;
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={handleDragEnd}
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            cursor: 'grab',
          }}
          role="alert"
          aria-live="assertive"
        >
          <Alert
            severity={mode === 'Success' ? 'success' : 'error'}
            icon={alertIcon}
            action={
              <IconButton
                aria-label="Close alert"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                  onClose();
                }}
                style={{ marginBottom: '20px' }}
                tabIndex={-1}
              >
              </IconButton>
            }
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <AlertTitle>{mode}</AlertTitle>
            {message}
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>,
    notificationRoot
  );
};

const notificationRoot = document.createElement('div');
notificationRoot.id = 'notification-root';
document.body.appendChild(notificationRoot);

export const PyrenzAlert = (message: string, mode: 'Success' | 'Alert') => {
  const [alertState, setAlertState] = useState<{ message: string; mode: 'Success' | 'Alert' } | null>(null);

  const showAlert = (message: string, mode: 'Success' | 'Alert') => {
    setAlertState({ message, mode });
  };

  const handleClose = () => {
    setAlertState(null);
  };

  if (alertState) {
    return <PyrenzAlertComponent mode={alertState.mode} message={alertState.message} onClose={handleClose} />;
  }

  showAlert(message, mode);
  return null;
};
