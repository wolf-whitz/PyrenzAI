import React, { useEffect, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { AppRoutes } from '~/routes/routes';
import { Spinner } from '@components';

export function App() {
  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <Routes>{AppRoutes}</Routes>
      </Suspense>
    </Router>
  );
}
