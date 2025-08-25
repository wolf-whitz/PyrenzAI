import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import {
  PyrenzModal,
  PyrenzModalContent,
  PyrenzBlueButton,
  PyrenzMessageBox
} from '~/theme';
import { usePyrenzAlert } from '~/provider';
import { Utils } from '~/utility';
import localforage from 'localforage';

interface AssistantModalProps {
  open: boolean;
  onClose: () => void;
}

type Role = 'system' | 'user' | 'char';
interface ChatMessage {
  role: Role;
  content: string;
  isGeneratingEmptyCharMessage?: boolean;
}

const store = localforage.createInstance({
  name: 'ChatDatabase',
  storeName: 'chat_messages',
});

export function AssistantModal({ open, onClose }: AssistantModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [instruction, setInstruction] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const showAlert = usePyrenzAlert();

  useEffect(() => {
    fetch('/instruction.md')
      .then((res) => res.text())
      .then((text) => setInstruction(text))
      .catch(() => setInstruction('You are a helpful assistant.'));
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      const stored = await store.getItem<ChatMessage[]>('all_messages');
      if (stored && stored.length > 0) {
        setMessages(stored);
      } else {
        const firstMsg: ChatMessage = {
          role: 'char',
          content: 'Hello i can help you create characters! First can you tell me what the character is?',
        };
        setMessages([firstMsg]);
        await store.setItem('all_messages', [firstMsg]);
      }
    };
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveMessages = async (allMessages: ChatMessage[]) => {
    await store.setItem('all_messages', allMessages);
  };

  const mapRoleForAPI = (role: Role) =>
    role === 'char' ? 'assistant' : role;

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const allMessages: ChatMessage[] = messages.some((m) => m.role === 'system')
      ? [...messages, userMessage]
      : [{ role: 'system', content: instruction }, ...messages, userMessage];

    const typingIndicator: ChatMessage = {
      role: 'char',
      content: '',
      isGeneratingEmptyCharMessage: true,
    };
    const localMessages: ChatMessage[] = [...allMessages, typingIndicator];

    setMessages(localMessages);
    setInput('');
    setLoading(true);
    await saveMessages(localMessages);

    try {
      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral',
          messages: allMessages.map((m) => ({
            role: mapRoleForAPI(m.role),
            content: m.content,
          })),
          temperature: 0.7,
          stream: false,
          private: true,
        }),
      });

      const result = await response.text();

      setMessages((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((m) => m.isGeneratingEmptyCharMessage);
        if (index !== -1) updated[index] = { role: 'char', content: result };
        saveMessages(updated);
        return updated;
      });
    } catch {
      showAlert('Could not fetch response from model', 'error');
      setMessages((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((m) => m.isGeneratingEmptyCharMessage);
        if (index !== -1)
          updated[index] = {
            role: 'char',
            content: 'Error: could not fetch response.',
          };
        saveMessages(updated);
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setMessages([]);
    const firstMsg: ChatMessage = {
      role: 'char',
      content:
        'Hello i can help you create characters! First can you tell me what the character is?',
    };
    setMessages([firstMsg]);
    await store.setItem('all_messages', [firstMsg]);
    showAlert('Chat cleared', 'success');
  };

  const handleContextSubmit = async () => {
    if (!contextInput.trim()) return;
    try {
      const { data, error } = await Utils.db.functions.invoke('site-scraper', {
        body: { context: contextInput },
      });

      if (error) {
        showAlert('Error submitting context', 'error');
        console.error(error);
        return;
      }

      if (data?.result) {
        setMessages((prev) => {
          const existingSystemIndex = prev.findIndex((m) => m.role === 'system');
          let updated: ChatMessage[];
          if (existingSystemIndex !== -1) {
            updated = [...prev];
            updated[existingSystemIndex] = {
              ...updated[existingSystemIndex],
              content: `${instruction}\n\n[Context]\n${data.result}`,
            };
          } else {
            updated = [
              { role: 'system', content: `${instruction}\n\n[Context]\n${data.result}` },
              ...prev,
            ];
          }
          saveMessages(updated);
          return updated;
        });
        showAlert('Context successfully added to memory!', 'success');
      } else {
        showAlert('No data returned from context function', 'error');
      }

      setContextInput('');
    } catch (err) {
      showAlert('Error submitting context', 'error');
      console.error(err);
    }
  };

  const handleExtract = () => {
    const json = JSON.stringify(messages, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversation-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <PyrenzModal open={open} onClose={onClose}>
      <PyrenzModalContent
        sx={{
          width: '800px',
          height: '600px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            flex: 1,
            maxHeight: 400,
            overflowY: 'auto',
            mb: 2,
            px: 1,
          }}
        >
          {messages
            .filter((msg) => msg.role !== 'system')
            .map((msg, i) => (
              <PyrenzMessageBox
                key={i}
                role={msg.role === 'user' ? 'user' : 'char'}
                displayName={msg.role === 'user' ? 'You' : 'Assistant'}
                content={msg.content}
                isGeneratingEmptyCharMessage={msg.isGeneratingEmptyCharMessage}
              />
            ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <textarea
            value={contextInput}
            onChange={(e) => setContextInput(e.target.value)}
            placeholder="Context via link..."
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #555',
              background: '#222',
              color: '#fff',
              minHeight: '60px',
              resize: 'none',
              fontFamily: 'inherit',
              fontSize: '14px',
            }}
            disabled={loading}
          />
          <PyrenzBlueButton onClick={handleContextSubmit} disabled={loading}>
            Submit
          </PyrenzBlueButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid #555',
              background: '#222',
              color: '#fff',
              minHeight: '60px',
              resize: 'none',
              fontFamily: 'inherit',
              fontSize: '14px',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            disabled={loading}
          />
          <PyrenzBlueButton onClick={() => handleSend(input)} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </PyrenzBlueButton>
          <PyrenzBlueButton
            onClick={handleClear}
            disabled={loading}
            color="error"
          >
            Clear
          </PyrenzBlueButton>
          <PyrenzBlueButton
            onClick={handleExtract}
            disabled={loading}
            color="secondary"
          >
            Extract
          </PyrenzBlueButton>
        </Box>
      </PyrenzModalContent>
    </PyrenzModal>
  );
}
