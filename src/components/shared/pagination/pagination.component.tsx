import React, { Dispatch, SetStateAction } from 'react';
import classes from "./pagination.module.scss";

export interface PaginationProps {
    totalCount: number;
    currentPage: number;
    setCurrentPage: Dispatch<
      SetStateAction<number>
    >;
  }
  

const Pagination = ({ currentPage, setCurrentPage, totalCount }: PaginationProps) => {

    const totalPages = Math.ceil(totalCount / 10);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
      };
    
      const renderPageButtons = () => {
        const pageButtons = [];
        const numPagesToShow = 5; // Number of page buttons to show
    
        // Calculate which page buttons to display
        let startPage = Math.max(1, currentPage - Math.floor(numPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + numPagesToShow - 1);
    
        if (endPage - startPage + 1 < numPagesToShow) {
          startPage = Math.max(1, endPage - numPagesToShow + 1);
        }
    
        for (let page = startPage; page <= endPage; page++) {
          pageButtons.push(
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? classes.active + ' '  + classes.pageButton : classes.pageButton}
            >
              {page}
            </button>
          );
        }
    
        return pageButtons;
      };
    
      const nextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      };
    
      const prevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };
    
      return (
        <div>
          <div className={classes.pagination}>
            <div style={{marginRight: '20px'}}>총 개수: {totalCount}</div>
            <button onClick={prevPage} disabled={currentPage === 1} className={classes.pageButton}>
            이전
            </button>
            {renderPageButtons()}
            <button onClick={nextPage} disabled={currentPage === totalPages} className={classes.pageButton}>
            다음
            </button>
        </div>
        </div>
      );
};

export default Pagination;
