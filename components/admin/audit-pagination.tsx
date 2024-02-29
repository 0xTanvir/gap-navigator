import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface PaginationProps {
  totalAuditCount: number
  page: number
  PAGE_SIZE: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  handlePrevPage: () => void
  handleNextPage: () => void
}

const AuditPagination = ({
                           page,
                           totalAuditCount,
                           PAGE_SIZE,
                           handlePrevPage,
                           handleNextPage
                         }: PaginationProps) => {
  return (
      <Pagination className="w-full pt-3">

        <PaginationContent className="sm:hidden flex flex-1 justify-between">

          <PaginationItem>
            <PaginationPrevious
                onClick={() => {
                  if (page === 1) {
                    return
                  } else {
                    handlePrevPage()
                  }
                }}
                className={page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}
                aria-disabled={page === 1}
                href={void 0}
            />
          </PaginationItem>

          <>
            <p className="text-sm">
              Page
              <span className="font-medium px-1">{page}</span>
              of
              <span className="font-medium px-1">{Math.ceil(totalAuditCount / PAGE_SIZE)}</span>
            </p>
          </>

          <PaginationItem>
            <PaginationNext
                aria-disabled={Math.ceil(totalAuditCount / PAGE_SIZE) === page}
                onClick={() => {
                  if (Math.ceil(totalAuditCount / PAGE_SIZE) === page) {
                    return;
                  } else {
                    handleNextPage()
                  }
                }}
                className={Math.ceil(totalAuditCount / PAGE_SIZE) === page ? 'cursor-not-allowed' : 'cursor-pointer'}
                href={void 0}
            />
          </PaginationItem>

        </PaginationContent>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between pt-3">
          <div>
            <p className="text-sm">
              Showing
              <span className="font-medium px-1">{(page - 1) * PAGE_SIZE + 1}</span>
              to
              <span className="font-medium px-1">{Math.min(page * PAGE_SIZE, totalAuditCount)}</span>
              of
              <span className="font-medium px-1">{totalAuditCount}</span>
              results
            </p>
          </div>

          <PaginationContent>

            <PaginationItem>
              <PaginationPrevious
                  onClick={() => {
                    if (page === 1) {
                      return
                    } else {
                      handlePrevPage()
                    }
                  }}
                  className={page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}
                  aria-disabled={page === 1}
                  href={void 0}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                  aria-disabled={Math.ceil(totalAuditCount / PAGE_SIZE) === page}
                  onClick={() => {
                    if (Math.ceil(totalAuditCount / PAGE_SIZE) === page) {
                      return;
                    } else {
                      handleNextPage()
                    }
                  }}
                  className={Math.ceil(totalAuditCount / PAGE_SIZE) === page ? 'cursor-not-allowed' : 'cursor-pointer'}
                  href={void 0}
              />
            </PaginationItem>

          </PaginationContent>

        </div>
      </Pagination>
  );
};

export default AuditPagination;