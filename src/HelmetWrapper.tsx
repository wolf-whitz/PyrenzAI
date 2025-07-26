import { Helmet } from 'react-helmet-async';
import { useLocation, matchPath } from 'react-router-dom';
import { ReactNode } from 'react';
import { routeTitleMap } from '~/meta/pageTitles';

export const HelmetWrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const path = location.pathname;

  let title = 'Page';

  for (const pattern in routeTitleMap) {
    const match = matchPath({ path: pattern, end: true }, path);
    if (match) {
      title = routeTitleMap[pattern];
      break;
    }
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </>
  );
};
