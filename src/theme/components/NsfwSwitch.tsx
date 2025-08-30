import React, { useState } from 'react';
import { Tooltip, Box } from '@mui/material';
import { useUserStore } from '~/store';
import { GlassSwitch, PyrenzDialog } from '.';

export function NSFWSwitch() {
  const { show_nsfw, toggleShowNSFW } = useUserStore();
  const [openTooltip, setOpenTooltip] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleTooltipOpen = () => setOpenTooltip(true);
  const handleTooltipClose = () => setOpenTooltip(false);

  const handleSwitchChange = () => {
    if (!show_nsfw) setOpenDialog(true);
    else toggleShowNSFW();
  };

  const handleConfirm = () => {
    toggleShowNSFW();
    setOpenDialog(false);
  };

  const handleCancel = () => setOpenDialog(false);

  return (
    <>
      <Tooltip
        title="NSFW Switch"
        arrow
        open={openTooltip}
        onOpen={handleTooltipOpen}
        onClose={handleTooltipClose}
      >
        <Box display="inline-flex">
          <GlassSwitch
            checked={show_nsfw}
            onChange={handleSwitchChange}
            inputProps={{ 'aria-label': 'NSFW switch' }}
          />
        </Box>
      </Tooltip>

      <PyrenzDialog
        open={openDialog}
        onClose={handleCancel}
        title="Confirm Action"
        content="Enabling NSFW content confirms that you are 18 or older and that you agree to our Terms of Service. Pyrenzai does not guarantee the nature of user-generated content. If you encounter any characters or content that violate our rules, please report them. Are you sure you want to enable NSFW content?"
        onConfirm={handleConfirm}
      />
    </>
  );
}
