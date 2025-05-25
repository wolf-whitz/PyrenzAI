import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { Alert, AlertTitle, IconButton } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { motion, AnimatePresence } from 'framer-motion'

type AlertMode = 'Success' | 'Alert'

type AlertState = {
  mode: AlertMode
  message: string
} | null

type AlertContextType = {
  showAlert: (message: string, mode: AlertMode) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const usePyrenzAlert = () => {
  const context = useContext(AlertContext)
  if (!context) throw new Error('PyrenzAlert must be used within an AlertProvider')
  return context.showAlert 
}


export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertState, setAlertState] = useState<AlertState>(null)

  const showAlert = (message: string, mode: AlertMode) => {
    setAlertState({ message, mode })
  }

  const handleClose = () => {
    setAlertState(null)
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AnimatePresence>
        {alertState && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(event, info) => {
              if (info.offset.y > 100) handleClose()
            }}
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
              severity={alertState.mode === 'Success' ? 'success' : 'error'}
              icon={
                alertState.mode === 'Success'
                  ? <CheckCircleOutlineIcon style={{ color: 'green' }} />
                  : <ErrorOutlineIcon style={{ color: 'red' }} />
              }
              action={
                <IconButton
                  aria-label="Close alert"
                  color="inherit"
                  size="small"
                  onClick={handleClose}
                  tabIndex={-1}
                />
              }
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <AlertTitle>{alertState.mode}</AlertTitle>
              {alertState.message}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  )
}
