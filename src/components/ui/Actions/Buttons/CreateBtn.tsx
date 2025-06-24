import { CircularProgress } from '@mui/material';
import clsx from 'clsx';
import { AddOutlined as AddIcon } from '@mui/icons-material';
import { PyrenzBlueButton } from '~/theme';

interface CreateButtonProps {
  loading: boolean;
  className?: string;
  character_update: boolean;
}

export function CreateButton({
  loading,
  className,
  character_update,
}: CreateButtonProps) {
  return (
    <PyrenzBlueButton
      type="submit"
      disabled={loading}
      variant="contained"
      className={clsx('flex items-center', className)}
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <AddIcon className="mr-2" />
        )
      }
    >
      {loading ? 'Submitting...' : character_update ? 'Update' : 'Create'}
    </PyrenzBlueButton>
  );
}
