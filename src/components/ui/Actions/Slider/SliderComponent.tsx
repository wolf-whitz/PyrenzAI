import { PyrenzSlider } from '~/theme';
import { HelpOutlineOutlined as HelpIcon } from '@mui/icons-material';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState } from 'react';

interface SliderComponentProps {
  sliderKey: string;
  stateValue: number;
  stateSetter: (value: number) => void;
  sliderDescriptions: Record<string, string>;
  setShowPopover: (key: string | null) => void;
  maxValue?: number;
  className?: string;
}

export function SliderComponent({
  sliderKey,
  stateValue = 0,
  stateSetter,
  sliderDescriptions,
  setShowPopover,
  maxValue,
  className,
}: SliderComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box key={sliderKey} className={className} sx={{ mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          {sliderKey.charAt(0).toUpperCase() +
            sliderKey.slice(1).replace(/([A-Z])/g, ' $1')}
        </Typography>
        <Box
          component="button"
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          onClick={(e) => {
            handlePopoverOpen(e);
            setShowPopover(sliderKey);
          }}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
            focus: { outline: 'none' },
          }}
        >
          <HelpIcon fontSize="small" />
        </Box>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography
            sx={{ p: 1 }}
            className="bg-black text-white p-2 rounded shadow-md"
          >
            {sliderDescriptions[sliderKey]}
          </Typography>
        </Popover>
      </Box>
      <PyrenzSlider
        value={stateValue}
        onChange={(event, value) => stateSetter(value as number)}
        max={maxValue}
        min={sliderKey.includes('Penalty') ? -2 : 0}
        step={sliderKey === 'maxTokens' ? 1 : sliderKey === 'topP' ? 0.01 : 0.1}
        valueLabelDisplay="auto"
      />
      <Typography variant="caption" color="text.secondary">
        {stateValue}
      </Typography>
    </Box>
  );
}
