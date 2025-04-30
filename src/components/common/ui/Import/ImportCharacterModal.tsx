import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button, Tabs, Tab, Typography, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Textarea } from '~/components';
import { IoCloudUploadOutline, IoLinkOutline } from 'react-icons/io5';
import { Utils } from '~/Utility/Utility';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ImportCharacterModalProps {
  onClose: () => void;
  onImport: (data: any) => void;
}

interface ImportCharacterResponse {
  data: any;
}

interface AIOption {
  Website: string;
  Placeholder: string;
}

const aiOptions: AIOption[] = [
  { Website: "ChubAI", Placeholder: "Enter ChubAI link here" },
  { Website: "CharacterAI", Placeholder: "Enter Character AI link here" }
];

export default function ImportCharacterModal({ onClose, onImport }: ImportCharacterModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [selectedAI, setSelectedAI] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleLinkChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLink(event.target.value);
  };

  const handleAISelectionChange = (event: SelectChangeEvent<string>) => {
    const selectedOption = aiOptions.find(option => option.Website === event.target.value);
    if (selectedOption) {
      setSelectedAI(event.target.value);
      setPlaceholder(selectedOption.Placeholder);
    }
  };

  const handleImport = async () => {
    if (activeTab === 0 && file) {
      onImport(file);
    } else if (activeTab === 1 && link) {
      try {
        const response = await Utils.post<ImportCharacterResponse>('/api/ImportCharacter', { link, ai: selectedAI });
        onImport(response.data);
      } catch (error) {
        toast.error('Error importing character');
      }
    }
    onClose();
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-black p-6 rounded-lg shadow-lg w-full max-w-md"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="import tabs"
            sx={{ color: 'white' }}
          >
            <Tab icon={<IoCloudUploadOutline />} label="File" iconPosition="start" sx={{ color: 'white' }} />
            <Tab icon={<IoLinkOutline />} label="Link" iconPosition="start" sx={{ color: 'white' }} />
          </Tabs>
          <div className="mt-4">
            {activeTab === 0 && (
              <div>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  Import a Tavern JSON or XML:
                </Typography>
                <Button variant="contained" onClick={handleFileButtonClick} className="mt-2" sx={{ color: 'white' }}>
                  Choose File
                </Button>
                <input
                  type="file"
                  accept=".json,.xml"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  hidden
                />
                {file && (
                  <Typography variant="body2" sx={{ color: 'white', mt: 2 }}>
                    Selected file: {file.name}
                  </Typography>
                )}
              </div>
            )}
            {activeTab === 1 && (
              <div>
                <FormControl fullWidth className="mb-4">
                  <InputLabel id="ai-select-label" sx={{ color: 'white' }}>Select AI</InputLabel>
                  <Select
                    labelId="ai-select-label"
                    id="ai-select"
                    value={selectedAI}
                    label="Select AI"
                    onChange={handleAISelectionChange}
                    sx={{ color: 'white' }}
                  >
                    {aiOptions.map((option, index) => (
                      <MenuItem key={index} value={option.Website}>
                        {option.Website}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Textarea
                  label="Import a character using link (You are allowed to bulk import characters)"
                  value={link}
                  onChange={handleLinkChange}
                  className="mt-2 w-full"
                  placeholder={placeholder || "Enter link here"}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outlined" onClick={onClose} sx={{ color: 'white', borderColor: 'white' }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleImport}>
              Import
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
