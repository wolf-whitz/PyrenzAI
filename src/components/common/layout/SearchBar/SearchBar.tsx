import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  setCurrentPage: (page: number) => void;
}

export default function SearchBar({
  search,
  setSearch,
  setCurrentPage,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(search);

  const handleSearch = () => {
    setSearch(inputValue);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <motion.div
      className="relative w-full mb-6"
    >
      <div
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer flex items-center justify-center w-8 h-8"
        onClick={handleSearch}
      >
        <FaSearch className="text-lg" />
      </div>
      <motion.input
        type="text"
        placeholder="Search characters..."
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInputValue(e.target.value)
        }
        onKeyDown={handleKeyDown}
        className="w-full p-3 pl-14 border-none rounded-full text-lg bg-gray-800 text-white shadow-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </motion.div>
  );
}
