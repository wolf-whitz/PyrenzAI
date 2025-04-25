import React, { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Utils } from '~/Utility/Utility';
import { motion } from 'framer-motion';
import { useUserStore } from '~/store';
import { FaQuestionCircle } from 'react-icons/fa';

const sliderDescriptions = {
  maxTokens: "Controls the maximum number of tokens in the response.",
  temperature: "Controls the randomness of the output. Higher values make the output more random.",
  topP: "Controls the diversity of the output. Higher values make the output more diverse.",
  presencePenalty: "Penalizes new tokens based on their presence in the input. Higher values make the output more different from the input.",
  frequencyPenalty: "Penalizes new tokens based on their frequency in the input. Higher values make the output less repetitive."
};

export default function Customization() {
  const [maxTokens, setMaxTokens] = useState(100);
  const [temperature, setTemperature] = useState(100);
  const [topP, setTopP] = useState(100);
  const [presencePenalty, setPresencePenalty] = useState(100);
  const [frequencyPenalty, setFrequencyPenalty] = useState(100);
  const [showPopover, setShowPopover] = useState<keyof typeof sliderDescriptions | null>(null);

  const stateSetters = {
    maxTokens: setMaxTokens,
    temperature: setTemperature,
    topP: setTopP,
    presencePenalty: setPresencePenalty,
    frequencyPenalty: setFrequencyPenalty,
  };

  const handleSubmit = async () => {
    const data = {
      maxTokens,
      temperature,
      topP,
      presencePenalty,
      frequencyPenalty,
    };

    try {
      const response = await Utils.post('/persona', data);
      console.log('Response:', response);
    } catch (error) {
      console.error('Error submitting data:', error);
      window.alert('Error submitting data. Please try again.');
    }
  };

  return (
    <div className="p-4 space-y-4 relative">
      {Object.keys(sliderDescriptions).map((key) => {
        const sliderKey = key as keyof typeof sliderDescriptions;
        const stateValue = {
          maxTokens,
          temperature,
          topP,
          presencePenalty,
          frequencyPenalty,
        }[sliderKey];

        return (
          <div key={sliderKey}>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300">
                {sliderKey.charAt(0).toUpperCase() + sliderKey.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <button
                onClick={() => setShowPopover(sliderKey)}
                className="text-gray-400 hover:text-gray-300 focus:outline-none"
              >
                <FaQuestionCircle />
              </button>
            </div>
            <Slider.Root
              className="relative flex items-center h-5"
              value={[stateValue]}
              onValueChange={(value) => stateSetters[sliderKey](value[0])}
              max={sliderKey === 'maxTokens' ? 4000 : sliderKey === 'topP' ? 1 : 2}
              min={sliderKey.includes('Penalty') ? -2 : 0}
              step={sliderKey === 'maxTokens' ? 1 : sliderKey === 'topP' ? 0.01 : 0.1}
            >
              <Slider.Track className="relative h-1 w-full grow rounded-full bg-gray-600">
                <Slider.Range className="absolute h-full rounded-full bg-blue-500" />
              </Slider.Track>
              <Slider.Thumb className="block h-5 w-5 rounded-full bg-white shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" />
            </Slider.Root>
            <span className="text-sm text-gray-400">{stateValue}</span>
          </div>
        );
      })}

      {showPopover && (
        <div
          className="absolute bg-gray-800 text-white text-sm rounded p-2 z-10"
          style={{ top: '20px', left: '50%', transform: 'translateX(-50%)' }}
        >
          {sliderDescriptions[showPopover]}
          <button
            onClick={() => setShowPopover(null)}
            className="absolute top-0 right-0 mt-1 mr-1 text-gray-400 hover:text-gray-300 focus:outline-none"
          >
            &times;
          </button>
        </div>
      )}

      <motion.button
        onClick={handleSubmit}
        className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Submit
      </motion.button>
    </div>
  );
}
