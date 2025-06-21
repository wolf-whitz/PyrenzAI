import { useState } from 'react';
import { useUserStore } from '~/store';
import {
  Switch,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { pink } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: pink[500],
    '&:hover': {
      backgroundColor: 'rgba(255, 105, 180, 0.08)',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: pink[500],
  },
}));

export function NSFWSwitch() {
  const { show_nsfw, toggleShowNSFW } = useUserStore();
  const [openTooltip, setOpenTooltip] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleSwitchChange = () => {
    if (!show_nsfw) {
      setOpenDialog(true);
    } else {
      toggleShowNSFW();
    }
  };

  const handleConfirm = () => {
    toggleShowNSFW();
    setOpenDialog(false);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Tooltip
        title="NSFW Switch"
        arrow
        open={openTooltip}
        onOpen={handleTooltipOpen}
        onClose={handleTooltipClose}
      >
        <PinkSwitch
          checked={show_nsfw}
          onChange={handleSwitchChange}
          aria-label="NSFW switch"
          aria-checked={show_nsfw}
        />
      </Tooltip>
      <Dialog
        open={openDialog}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Enabling NSFW content confirms that you are 18 or older and that you
            agree to our Terms of Service. Pyrenzai does not guarantee the
            nature of user-generated content. If you encounter any characters or
            content that violate our rules, please report them. Are you sure you
            want to enable NSFW content?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancel}
            color="inherit"
            sx={{ backgroundColor: 'transparent', color: 'white' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color="inherit"
            autoFocus
            sx={{ backgroundColor: 'transparent', color: 'white' }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
