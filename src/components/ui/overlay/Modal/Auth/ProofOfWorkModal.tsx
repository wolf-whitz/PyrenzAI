import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { PyrenzModal, PyrenzModalContent } from '~/theme';
import { Utils as utils } from '~/utility';

interface ProofOfWorkModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProofOfWorkModal({
  open,
  onClose,
  onSuccess,
}: ProofOfWorkModalProps) {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verifiedRef = useRef(false);
  const challengeFetchedRef = useRef(false);
  const activeChallengeRef = useRef<string | null>(null);

  const sha256 = async (input: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    return Array.from(hashArray)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const challengeAndVerify = async () => {
    if (challengeFetchedRef.current) return;
    challengeFetchedRef.current = true;
    setLoading(true);
    setVerifying(false);
    setError(null);

    try {
      const res = await utils.post<{ challenge: string; difficulty: number }>(
        '/api/GetProofChallenge',
        {}
      );
      const { challenge, difficulty } = res;

      if (!challenge || typeof difficulty !== 'number')
        throw new Error('Missing challenge/difficulty');

      activeChallengeRef.current = challenge;

      setLoading(false);
      setVerifying(true);

      let nonce = 0;
      let found = false;
      const maxAttempts = 500_000;

      while (nonce < maxAttempts) {
        const inputString = `${challenge}:${nonce}`;
        const hashHex = await sha256(inputString);

        if (hashHex.startsWith('0'.repeat(difficulty))) {
          try {
            const verifyRes = await utils.post<{ success: boolean }>(
              '/api/VerifyProof',
              {
                challenge,
                solution: nonce,
              }
            );

            if (verifyRes?.success) {
              verifiedRef.current = true;
              onSuccess();
              onClose();
            } else {
              setError('Proof rejected by server.');
            }
          } catch {
            setError('Verification request failed.');
          }

          found = true;
          break;
        }

        nonce++;
      }

      if (!found) {
        setError('Failed to solve challenge.');
      }
    } catch (err) {
      console.error('[PoW] Challenge/verification failed:', err);
      setError('Challenge or verification failed.');
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (open && !verifiedRef.current && !loading && !verifying) {
      challengeAndVerify();
    }

    if (!open) {
      challengeFetchedRef.current = false;
      activeChallengeRef.current = null;
    }
  }, [open]);

  return (
    <PyrenzModal open={open && !verifiedRef.current} onClose={() => {}}>
      <PyrenzModalContent>
        <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
            Security Check
          </Typography>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          gap={2.5}
        >
          <Typography sx={{ color: '#ccc', fontSize: '1rem' }}>
            Solving a quick proof-of-work challenge to verify you’re human.
          </Typography>

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          {(loading || verifying) && (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress color="primary" />
            </Box>
          )}
        </Box>
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
