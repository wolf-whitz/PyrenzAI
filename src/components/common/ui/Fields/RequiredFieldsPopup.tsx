import React from 'react';
import { motion } from 'framer-motion';
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

interface RequiredFieldsPopupProps {
  missingFields: string[];
  onClose: () => void;
}

export function RequiredFieldsPopup({
  missingFields,
  onClose,
}: RequiredFieldsPopupProps) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
      role="dialog"
      aria-labelledby="missingFieldsTitle"
      aria-describedby="missingFieldsList"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-gray-900 dark:text-white w-full max-w-md flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Typography
          id="missingFieldsTitle"
          variant="h5"
          component="h2"
          className="text-center"
        >
          🚨 Missing Fields Alert 🚨
        </Typography>
        <List id="missingFieldsList" className="flex flex-col gap-2 text-base">
          {missingFields.map((field, index) => (
            <ListItem key={index} className="animate-slide-in">
              <ListItemText primary={field} />
            </ListItem>
          ))}
        </List>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          className="self-center"
        >
          Got it 👌
        </Button>
      </motion.div>
    </motion.div>
  );
}
