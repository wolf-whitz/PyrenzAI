import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PreviewFooter() {
  const { t } = useTranslation();

  const legalLinks = t('footer.legal', { returnObjects: true });

  return (
    <footer className="bg-transparent text-white py-10 w-screen animate__animated animate__fadeInUp animate__slow">
      <div className="w-screen px-16 mx-auto flex flex-wrap justify-between items-start">
        <div className="w-full md:w-1/3 px-6">
          <h3 className="font-bold text-lg border-b-2 border-[#E03201] pb-1">
            {t('footer.quickLinks')}
          </h3>
          <ul className="mt-2 space-y-2">
            {[
              { name: t('navigation.home'), path: '/Home' },
              { name: t('footer.links.explore'), path: '/Explore' },
              { name: t('navigation.chats'), path: '/Chats' },
              { name: t('footer.links.discord'), path: 'https://discord.com' },
            ].map((item, index) => (
              <li className="group" key={index}>
                <a
                  href={item.path}
                  className="transition duration-300 hover:text-[#E03201] group-hover:translate-x-2 block"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-1/3 px-6 mt-8 md:mt-0">
          <h3 className="font-bold text-lg border-b-2 border-[#E03201] pb-1">
            {t('footer.links.guide')}
          </h3>
          <ul className="mt-2 space-y-2">
            {[
              { name: t('footer.links.botCreation'), path: '/bot-creation' },
              { name: t('footer.links.howTokenWorks'), path: '/token-guide' },
              { name: t('footer.links.lorebooks'), path: '/lorebooks' },
            ].map((item, index) => (
              <li className="group" key={index}>
                <a
                  href={item.path}
                  className="transition duration-300 hover:text-[#E03201] group-hover:translate-x-2 block"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-1/3 px-6 mt-8 md:mt-0">
          <h3 className="font-bold text-lg border-b-2 border-[#E03201] pb-1">
            Legal
          </h3>
          <ul className="mt-2 space-y-2">
            {Object.entries(legalLinks).map(([key, value], index) => (
              <li className="group" key={index}>
                <a
                  href={`/${key.toLowerCase()}`}
                  className="transition duration-300 hover:text-[#E03201] group-hover:translate-x-2 block"
                >
                  {value}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full text-center mt-12 pt-4 text-sm opacity-75">
        © {new Date().getFullYear()} Pyrenz AI.{' '}
        {t('messages.allRightsReserved')}
      </div>
    </footer>
  );
}
