import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';

interface MenuItemType {
  label: string;
  action: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface CustomContextMenuProps {
  items: MenuItemType[];
  onClose: () => void;
  anchorPosition: { top: number; left: number };
}

export function CustomContextMenu({
  items,
  onClose,
  anchorPosition,
}: CustomContextMenuProps) {
  const [open, setOpen] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const handleMenuItemClick = (action: () => void, disabled?: boolean) => {
    if (disabled) return;
    action();
    handleClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    setOpen(true);
  }, [anchorPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="absolute"
          style={{
            top: anchorPosition.top,
            left: anchorPosition.left,
          }}
          onKeyDown={handleKeyDown}
          ref={menuRef}
          role="menu"
          tabIndex={-1}
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
            MenuListProps={{
              'aria-labelledby': 'custom-context-menu',
              role: 'menu',
              autoFocus: true,
            }}
          >
            {items.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MenuItem
                  onClick={() =>
                    handleMenuItemClick(item.action, item.disabled)
                  }
                  disabled={item.disabled}
                  className="hover:bg-gray-200"
                  role="menuitem"
                >
                  {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                  <ListItemText primary={item.label} />
                </MenuItem>
              </motion.div>
            ))}
          </Menu>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
