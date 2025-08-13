import { AddOutlined as AddIcon } from '@mui/icons-material';
import { PyrenzBlueButton } from '~/theme';
import clsx from 'clsx';

interface CreateButtonProps {
  className?: string;
  character_update: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function CreateButton({
  className,
  character_update,
  onClick,
  disabled = false,
}: CreateButtonProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <PyrenzBlueButton
      type="button"
      disabled={disabled}
      variant="contained"
      className={clsx('flex items-center', className)}
      startIcon={!disabled && <AddIcon className="mr-2" />}
      onClick={handleClick}
    >
      {disabled ? 'Submitting...' : character_update ? 'Update' : 'Create'}
    </PyrenzBlueButton>
  );
}
