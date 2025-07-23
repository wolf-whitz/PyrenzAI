import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { Alert, AlertTitle, IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

type AlertMode = 'Success' | 'success' | 'Error' | 'error' | 'Alert' | 'alert';

type AlertItem = {
  id: string;
  message: string;
  mode: AlertMode;
  count: number;
  createdAt: number;
};

type AlertContextType = {
  showAlert: (message: string, mode: AlertMode) => void;
};

const MAX_CONCURRENT_ALERTS = 3;
const ALERT_TTL = 60000;

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const usePyrenzAlert = () => {
  const context = useContext(AlertContext);
  if (!context)
    throw new Error('usePyrenzAlert must be used within an AlertProvider');
  return context.showAlert;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const showAlert = (message: string, mode: AlertMode) => {
    setAlerts((prev) => {
      const existing = [...prev].find(
        (a) => a.message === message && a.mode === mode
      );

      if (existing) {
        const updated = prev.map((a) =>
          a.id === existing.id ? { ...a, count: a.count + 1 } : a
        );
        return updated;
      }

      const newAlert: AlertItem = {
        id: uuidv4(),
        message,
        mode,
        count: 1,
        createdAt: Date.now(),
      };

      if (prev.length < MAX_CONCURRENT_ALERTS) {
        startTTL(newAlert.id);
        return [...prev, newAlert];
      } else {
        const sorted = [...prev].sort((a, b) => a.createdAt - b.createdAt);
        const oldest = sorted[0];
        stopTTL(oldest.id);
        startTTL(newAlert.id);
        return [...prev.filter((a) => a.id !== oldest.id), newAlert];
      }
    });
  };

  const startTTL = (id: string) => {
    const timeout = setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      timeouts.current.delete(id);
    }, ALERT_TTL);
    timeouts.current.set(id, timeout);
  };

  const stopTTL = (id: string) => {
    const t = timeouts.current.get(id);
    if (t) clearTimeout(t);
    timeouts.current.delete(id);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    stopTTL(id);
  };

  const getIcon = (mode: AlertMode) =>
    mode.toLowerCase().includes('success') ? (
      <CheckCircleOutlineIcon style={{ color: '#00ff9c' }} />
    ) : (
      <ErrorOutlineIcon style={{ color: '#ff5e5e' }} />
    );

  const getSeverity = (mode: AlertMode) =>
    mode.toLowerCase().includes('success') ? 'success' : 'error';

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          zIndex: 9999,
        }}
      >
        <AnimatePresence initial={false}>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100) removeAlert(alert.id);
              }}
              style={{
                borderRadius: 16,
                backdropFilter: 'blur(16px)',
                background: 'rgba(255, 255, 255, 0.06)',
                WebkitBackdropFilter: 'blur(16px)',
                cursor: 'grab',
              }}
              role="alert"
              aria-live="assertive"
            >
              <Alert
                severity={getSeverity(alert.mode)}
                icon={getIcon(alert.mode)}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => removeAlert(alert.id)}
                  >
                    <CloseIcon />
                  </IconButton>
                }
                sx={{
                  borderRadius: '16px',
                  backgroundColor: 'rgba(30,30,30,0.85)',
                  color: '#fff',
                  '& .MuiAlert-icon': {
                    alignItems: 'center',
                  },
                  '& .MuiAlert-message': {
                    fontWeight: 500,
                  },
                }}
              >
                <AlertTitle>
                  {alert.mode.charAt(0).toUpperCase() +
                    alert.mode.slice(1).toLowerCase()}
                </AlertTitle>
                {alert.message}
                {alert.count > 1 && (
                  <span style={{ marginLeft: 8, fontWeight: 'bold' }}>
                    ×{alert.count}
                  </span>
                )}
              </Alert>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
};
