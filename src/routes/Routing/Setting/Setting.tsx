import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { SettingsPageLoader, Sidebar } from '@components/index';

const Account = React.lazy(() => import('./Items/Account'));
const Profile = React.lazy(() => import('./Items/Profile'));
const Preference = React.lazy(() => import('./Items/Preference'));

export default function Setting() {
  const [activeTab, setActiveTab] = useState<
    'account' | 'profile' | 'preference'
  >('account');

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <Account />;
      case 'profile':
        return <Profile />;
      case 'preference':
        return <Preference />;
      default:
        return <Account />;
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-4 flex justify-center gap-8">
          <span
            onClick={() => setActiveTab('account')}
            className={`cursor-pointer text-lg relative pb-1 border-b-2 ${
              activeTab === 'account'
                ? 'border-current'
                : 'border-transparent hover:border-gray-400'
            }`}
          >
            Account
          </span>
          <span
            onClick={() => setActiveTab('profile')}
            className={`cursor-pointer text-lg relative pb-1 border-b-2 ${
              activeTab === 'profile'
                ? 'border-current'
                : 'border-transparent hover:border-gray-400'
            }`}
          >
            Profile
          </span>
          <span
            onClick={() => setActiveTab('preference')}
            className={`cursor-pointer text-lg relative pb-1 border-b-2 ${
              activeTab === 'preference'
                ? 'border-current'
                : 'border-transparent hover:border-gray-400'
            }`}
          >
            Preference
          </span>
        </div>

        <Suspense fallback={<SettingsPageLoader />}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex justify-center items-center"
          >
            <div className="max-w-3xl w-full">{renderContent()}</div>
          </motion.div>
        </Suspense>
      </div>
    </div>
  );
}
