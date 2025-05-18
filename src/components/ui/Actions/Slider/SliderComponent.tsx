import React from 'react';
import Slider from '@mui/material/Slider';
import { HelpCircle } from 'lucide-react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

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
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div key={sliderKey} className={`mb-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          {sliderKey.charAt(0).toUpperCase() +
            sliderKey.slice(1).replace(/([A-Z])/g, ' $1')}
        </label>
        <button
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          onClick={(e) => {
            handlePopoverOpen(e);
            setShowPopover(sliderKey);
          }}
          className="text-gray-400 hover:text-gray-300 focus:outline-none"
        >
          <HelpCircle />
        </button>
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
      </div>
      <Slider
        value={stateValue}
        onChange={(event, value) => stateSetter(value as number)}
        max={maxValue}
        min={sliderKey.includes('Penalty') ? -2 : 0}
        step={sliderKey === 'maxTokens' ? 1 : sliderKey === 'topP' ? 0.01 : 0.1}
        valueLabelDisplay="auto"
      />
      <span className="text-sm text-gray-400">{stateValue}</span>
    </div>
  );
}
