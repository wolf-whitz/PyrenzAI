import React, { useState, useEffect } from 'react';
import { Textarea, GetUserUUID } from '@components';
import { PyrenzSlider, PyrenzBlueButton } from '~/theme';
import { applyTokenizer, decodeTokenizer } from '~/Utility';
import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { db } from '~/Utility';

interface ModelControls {
  blocked: number[][];
  encouraged: number[][];
  controller: {
    'Blocked Words Frequency': number;
    'Encouraged Word Frequency': number;
  };
}

interface UserData {
  model_controls: ModelControls;
  preset_instruction: string;
}

export function ModelControl() {
  const [blockedWords, setBlockedWords] = useState('');
  const [encouragedWords, setEncouragedWords] = useState('');
  const [presetInstruction, setPresetInstruction] = useState('');
  const [blockedFrequency, setBlockedFrequency] = useState(-100);
  const [encouragedFrequency, setEncouragedFrequency] = useState(100);
  const [userUUID, setUserUUID] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const uuid = await GetUserUUID();
      if (!uuid) return;
      setUserUUID(uuid);
      try {
        const { data } = await db.select<UserData>({
          tables: 'user_data',
          columns: 'model_controls, preset_instruction',
          match: { user_uuid: uuid },
        });

        const controls = data?.[0]?.model_controls;
        const instruction = data?.[0]?.preset_instruction ?? '';
        setPresetInstruction(instruction);

        if (!controls) return;

        if (Array.isArray(controls.blocked) && controls.blocked.length > 0) {
          const decoded = controls.blocked
            .map((tokens) => decodeTokenizer(tokens))
            .join(', ');
          setBlockedWords(decoded);
        }

        if (
          Array.isArray(controls.encouraged) &&
          controls.encouraged.length > 0
        ) {
          const decoded = controls.encouraged
            .map((tokens) => decodeTokenizer(tokens))
            .join(', ');
          setEncouragedWords(decoded);
        }

        const controller = controls.controller ?? {};
        if (controller['Blocked Words Frequency'] !== undefined) {
          setBlockedFrequency(controller['Blocked Words Frequency']);
        }
        if (controller['Encouraged Word Frequency'] !== undefined) {
          setEncouragedFrequency(controller['Encouraged Word Frequency']);
        }
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    init();
  }, []);

  const handleSubmit = async () => {
    if (!userUUID) return;

    const blockedWordsArray = blockedWords
      .split(',')
      .map((word) => word.trim())
      .filter(Boolean);

    const encouragedWordsArray = encouragedWords
      .split(',')
      .map((word) => word.trim())
      .filter(Boolean);

    const blockedTokens = blockedWordsArray.map((word) => applyTokenizer(word));
    const encouragedTokens = encouragedWordsArray.map((word) =>
      applyTokenizer(word)
    );

    try {
      await db.update({
        tables: 'user_data',
        values: {
          model_controls: {
            blocked: blockedTokens,
            encouraged: encouragedTokens,
            controller: {
              'Blocked Words Frequency': blockedFrequency,
              'Encouraged Word Frequency': encouragedFrequency,
            },
          },
          preset_instruction: presetInstruction,
        },
        match: { user_uuid: userUUID },
      });

      console.log('Data submitted successfully');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box>
        <Box display="flex" alignItems="center">
          <Typography variant="h6">Blocked Words</Typography>
          <Tooltip title="Words that the model will avoid using">
            <IconButton>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Textarea
          value={blockedWords}
          onChange={(e) => setBlockedWords(e.target.value)}
          placeholder="Enter blocked words separated by commas..."
        />
        <Box display="flex" alignItems="center">
          <Typography variant="h6">Encouraged Words</Typography>
          <Tooltip title="Words that the model will prefer using">
            <IconButton>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Textarea
          value={encouragedWords}
          onChange={(e) => setEncouragedWords(e.target.value)}
          placeholder="Enter encouraged words separated by commas..."
        />
        <Box display="flex" alignItems="center">
          <Typography variant="h6">Preset Instruction</Typography>
          <Tooltip title="This instruction is sent with every message. Do not modify it unless you are certain of what you're doing, as it significantly affects the model's behavior.">
            <IconButton>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Textarea
          value={presetInstruction}
          onChange={(e) => setPresetInstruction(e.target.value)}
          placeholder="Enter preset instruction..."
        />
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1">
            Blocked Words Frequency: {blockedFrequency}
          </Typography>
          <Tooltip title="Adjust the frequency penalty for blocked words">
            <IconButton>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <PyrenzSlider
          value={blockedFrequency}
          onChange={(e, newValue) => setBlockedFrequency(newValue as number)}
          min={-100}
          max={0}
        />
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1">
            Encouraged Word Frequency: {encouragedFrequency}
          </Typography>
          <Tooltip title="Adjust the frequency bonus for encouraged words">
            <IconButton>
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <PyrenzSlider
          value={encouragedFrequency}
          onChange={(e, newValue) => setEncouragedFrequency(newValue as number)}
          min={0}
          max={100}
        />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-end"
        flexGrow={1}
      >
        <PyrenzBlueButton onClick={handleSubmit} disabled={!userUUID}>
          Submit
        </PyrenzBlueButton>
      </Box>
    </Box>
  );
}
