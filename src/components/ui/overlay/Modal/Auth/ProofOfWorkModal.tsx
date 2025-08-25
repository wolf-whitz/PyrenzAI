import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { PyrenzModal, PyrenzModalContent } from '~/theme';
import { Utils as utils } from '~/utility';

interface ProofOfWorkModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProofOfWorkModal({ open, onClose, onSuccess }: ProofOfWorkModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verifiedRef = useRef(false);

  const startPoW = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await utils.post<{ challenge: string; difficulty: number }>(
        '/api/GetProofChallenge',
        {}
      );

      const { challenge, difficulty } = res;
      const maxAttempts = 500_000;

      const worker = new Worker('worker/powWorker.js');

      worker.postMessage({ challenge, difficulty, maxAttempts });

      worker.onmessage = async (e: any) => {
        if (e.data.success) {
          try {
            const verifyRes = await utils.post<{ success: boolean }>('/api/VerifyProof', {
              challenge,
              solution: e.data.nonce,
            });

            if (verifyRes.success) {
              verifiedRef.current = true;
              onSuccess();
              onClose();
            } else {
              setError('Proof rejected by server.');
            }
          } catch {
            setError('Verification request failed.');
          }
          worker.terminate();
          setLoading(false);
        } else if (e.data.progress) {
          console.log('PoW progress nonce:', e.data.nonce);
        } else {
          setError('Failed to solve challenge.');
          worker.terminate();
          setLoading(false);
        }
      };
    } catch (err) {
      console.error('[PoW] Failed to fetch challenge:', err);
      setError('Failed to fetch challenge.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && !verifiedRef.current) startPoW();
  }, [open]);

  return (
    <PyrenzModal open={open && !verifiedRef.current} onClose={() => {}}>
      <PyrenzModalContent>
        <Box display="flex" justifyContent="center" mb={3}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
            Security Check
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" gap={2.5}>
          <Typography sx={{ color: '#ccc' }}>
            Solving a quick proof-of-work challenge to verify you’re human.
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          {loading && <CircularProgress color="primary" />}
        </Box>
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
