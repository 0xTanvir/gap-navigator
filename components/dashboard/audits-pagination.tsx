import React from 'react';
import {
  Pagination,
  PaginationContent, PaginationEllipsis,
  PaginationItem,
  PaginationLink, PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface AuditsPaginationProps {
  totalItems: number
  pageSize: number
  currentPage: number
  totalPage: number
  paginate: (number: any) => void
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

const AuditsPagination = ({
                            totalItems,
                            pageSize,
                            currentPage,
                            paginate,
                            setCurrentPage,
                            totalPage
                          }: AuditsPaginationProps) => {
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(totalItems / pageSize); i++) {
    pageNumbers.push(i)
  }

  return (
      <Pagination className="w-full pt-3">
        <PaginationContent className="sm:hidden flex flex-1 justify-between">

          <PaginationItem>
            <PaginationPrevious
                onClick={() => {
                  if (currentPage === 1) {
                    return
                  } else {
                    setCurrentPage(prevPage => prevPage - 1)
                  }
                }}
                className={currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}
                aria-disabled={currentPage === 1}
                href={void 0}
            />
          </PaginationItem>

          <>
            <p className="text-sm">
              Page
              <span className="font-medium px-1">{currentPage}</span>
              of
              <span className="font-medium px-1">{Math.ceil(totalItems / pageSize)}</span>
            </p>
          </>

          <PaginationItem>
            <PaginationNext
                aria-disabled={Math.ceil(totalItems / pageSize) === currentPage}
                onClick={() => {
                  if (totalPage === currentPage) {
                    return
                  } else {
                    setCurrentPage(prevPage => prevPage + 1)
                  }
                }}
                className={Math.ceil(totalItems / pageSize) === currentPage ? 'cursor-not-allowed' : 'cursor-pointer'}
                href={void 0}
            />
          </PaginationItem>

        </PaginationContent>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between pt-3">
          <div>
            <p className="text-sm">
              Showing
              <span className="font-medium px-1">{(currentPage - 1) * pageSize + 1}</span>
              to
              <span className="font-medium px-1">{Math.min(currentPage * pageSize, totalItems)}</span>
              of
              <span className="font-medium px-1">{totalItems}</span>
              results
            </p>
          </div>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                  href={void 0}
                  onClick={() => {
                    if (currentPage === 1) {
                      return
                    } else {
                      setCurrentPage(prevPage => prevPage - 1)
                    }
                  }}
                  className={currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}
              />
            </PaginationItem>
            {
              pageNumbers.map(number => (
                  <PaginationItem key={number}>
                    <PaginationLink
                        onClick={() => paginate(number)}
                        href={void 0}
                        isActive={currentPage === number}
                        className={currentPage === number ? 'pointer-events-none' : 'cursor-pointer'}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
              ))
            }
            <PaginationItem>
              <PaginationNext
                  href={void 0}
                  onClick={() => {
                    if (totalPage === currentPage) {
                      return
                    } else {
                      setCurrentPage(prevPage => prevPage + 1)
                    }
                  }}
                  className={totalPage === currentPage ? 'cursor-not-allowed' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </div>
      </Pagination>
  );
};

export default AuditsPagination;