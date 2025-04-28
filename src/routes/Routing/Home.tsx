import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from '@remix-run/react';
import {
  Sidebar,
  Banner,
  SearchBar,
  CharacterCard,
  LoadMore,
  Footer,
  CustomButton,
  SkeletonCard,
} from '~/components';
import { Sparkles } from 'lucide-react';
import { useHomeStore } from '~/store';
import { useUserStore } from '~/store';
import { fetchCharacters } from '~/api';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '~/Utility/supabaseClient';
import { Character } from '@shared-types/CharacterProp';

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    search,
    currentPage,
    characters,
    total,
    loading,
    bgImage,
    setSearch,
    setCurrentPage,
    setCharacters,
    setTotal,
    setLoading,
  } = useHomeStore();

  const { user_uuid } = useUserStore();

  const [isClient, setIsClient] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  useEffect(() => {
    setIsClient(true);
    setSearch(searchParams.get('search') || '');
    setCurrentPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  const fetchCharactersData = useCallback(async () => {
    setLoading(true);
    const { characters, total } = await fetchCharacters(
      currentPage,
      itemsPerPage,
      search,
      user_uuid || ''
    );
    setCharacters(characters);
    setTotal(total);
    setLoading(false);
  }, [currentPage, search, itemsPerPage, user_uuid]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCharactersData();
    }, 300);
    return () => clearTimeout(timeout);
  }, [fetchCharactersData]);

  useEffect(() => {
    navigate(`?page=${currentPage}&search=${encodeURIComponent(search)}`, {
      replace: true,
    });
  }, [currentPage, search, navigate]);

  const handleButtonClick = async (
    rpcFunction: string,
    type: string,
    max_character: number,
    page: number
  ) => {
    setLoading(true);
    setCharacters([]);
    try {
      const { data, error } = await supabase.rpc(rpcFunction, {
        type,
        max_character,
        page,
      });
      if (error) throw error;
      setCharacters(data);
    } catch (error) {
      console.error('Error calling RPC function:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col bg-midnight min-h-screen text-white font-baloo"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: bgImage ? 'cover' : 'auto',
        backgroundPosition: bgImage ? 'center' : 'unset',
      }}
      aria-label="Home Page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-1 flex-col md:flex-row">
        <motion.div
          className="hidden md:flex md:pl-[50px]"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Sidebar />
        </motion.div>
        <div className="p-6 flex-1">
          <Banner />
          <SearchBar
            search={search}
            setSearch={setSearch}
            setCurrentPage={setCurrentPage}
            aria-label="Search Characters"
          />
          
          <CustomButton
            onButtonClick={handleButtonClick}
            aria-label="Custom Action Button"
          />

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SkeletonCard
                      key={i}
                      aria-label={`Loading Character ${i + 1}`}
                    />
                  </motion.div>
                ))
              ) : characters.length > 0 ? (
                characters.map((char: Character) => (
                  <div
                    key={char.id}
                    data-character-uuid={char.input_char_uuid}
                    data-character-id={char.id}
                    className="transition-transform hover:scale-105"
                    aria-labelledby={`character-${char.name}`}
                    style={{ order: char.id }}
                  >
                    <CharacterCard {...char} />
                  </div>
                ))
              ) : (
                <motion.p
                  className="text-gray-500 text-center w-full"
                  aria-live="polite"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  No characters found. (˚ ˃̣̣̥⌓˂̣̣̥ )
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <LoadMore
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            user_param_uuid={user_uuid || ''}
            onLoadMore={setCurrentPage}
          />
        </div>
      </div>
      <motion.div
        className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around p-2 shadow-lg z-50 md:hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Sidebar />
      </motion.div>
      <div className="pb-16 px-4">
        {isClient && <Footer />}
        <p className="text-center text-gray-500 mt-4">
          © 2025 Pyrenz AI. All Rights Reserved.
        </p>
      </div>
    </motion.div>
  );
}
