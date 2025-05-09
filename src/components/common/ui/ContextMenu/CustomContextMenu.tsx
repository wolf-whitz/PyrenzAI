import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, MenuItem } from '@mui/material';

interface MenuItemType {
  label: string;
  action: () => void;
}

interface CustomContextMenuProps {
  items: MenuItemType[];
  onClose: () => void;
  anchorPosition: { top: number; left: number };
}

export default function CustomContextMenu({ items, onClose, anchorPosition }: CustomContextMenuProps) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    handleClose();
  };

  useEffect(() => {
    setOpen(true);
  }, [anchorPosition]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        top: anchorPosition.top,
        left: anchorPosition.left,
      }}
    >
      <Menu
        open={open}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        className="shadow-lg"
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => handleMenuItemClick(item.action)}
            className="hover:bg-gray-200"
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </motion.div>
  );
}
