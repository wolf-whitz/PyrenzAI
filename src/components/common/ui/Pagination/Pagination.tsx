import React from 'react';
import { LoadMore } from '~/components';

// Define the types for the props
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  userUUID: string | null;
  setCurrentPage: (page: number) => void;
  t: (key: string) => string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  userUUID,
  setCurrentPage,
  t,
}) => {
  return (
    <section aria-labelledby="pagination-heading" className="mt-6">
      <h2 id="pagination-heading" className="sr-only">
        {t('ariaLabels.paginationControls')}
      </h2>
      <LoadMore
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        user_uuid={userUUID || ''}
        onLoadMore={setCurrentPage}
      />
    </section>
  );
};

export default Pagination;
