import { useState, useEffect, useRef } from 'react';
import localforage from 'localforage';
import { usePyrenzAlert } from '~/provider';
import { Utils } from '~/utility';

export type Role = 'system' | 'user' | 'char';

export interface ChatMessage {
  role: Role;
  content: string;
  isGeneratingEmptyCharMessage?: boolean;
}

const store = localforage.createInstance({
  name: 'ChatDatabase',
  storeName: 'chat_messages',
});

interface UseAssistantAPIProps {
  initialInstruction?: string;
  disableReplacement?: boolean;
}

export function useAssistantAPI({
  initialInstruction = 'You are a helpful assistant.',
}: UseAssistantAPIProps = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [instruction, setInstruction] = useState(initialInstruction);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const showAlert = usePyrenzAlert();

  // Load instruction file
  useEffect(() => {
    fetch('/instruction.md')
      .then((res) => res.text())
      .then((text) => setInstruction(text))
      .catch(() => setInstruction(initialInstruction));
  }, [initialInstruction]);

  // Load stored messages or initialize
  useEffect(() => {
    const loadMessages = async () => {
      const stored = await store.getItem<ChatMessage[]>('all_messages');
      if (stored?.length) setMessages(stored);
      else {
        const firstMsg: ChatMessage = {
          role: 'char',
          content:
            'Hello i can help you create characters! First can you tell me what the character is?',
        };
        setMessages([firstMsg]);
        await store.setItem('all_messages', [firstMsg]);
      }
    };
    loadMessages();
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveMessages = async (allMessages: ChatMessage[]) => {
    await store.setItem('all_messages', allMessages);
  };

  const mapRoleForAPI = (role: Role) => (role === 'char' ? 'assistant' : role);

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
    const localMessages = [...allMessages, typingIndicator];

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
        return;
      }

      if (data?.result) {
        setMessages((prev) => {
          const existingSystemIndex = prev.findIndex(
            (m) => m.role === 'system'
          );
          let updated: ChatMessage[];
          if (existingSystemIndex !== -1) {
            updated = [...prev];
            updated[existingSystemIndex] = {
              ...updated[existingSystemIndex],
              content: `${instruction}\n\n[Context]\n${data.result}`,
            };
          } else {
            updated = [
              {
                role: 'system',
                content: `${instruction}\n\n[Context]\n${data.result}`,
              },
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

  return {
    messages,
    input,
    setInput,
    contextInput,
    setContextInput,
    loading,
    handleSend,
    handleClear,
    handleContextSubmit,
    handleExtract,
    messagesEndRef,
  };
}
