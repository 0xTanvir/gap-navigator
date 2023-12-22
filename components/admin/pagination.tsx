import React from 'react';
import { Icons } from "@/components/icons";

interface PaginationProps {
  totalAuditCount: number
  page: number
  PAGE_SIZE: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  handlePrevPage: () => void
  handleNextPage: () => void
}

const Pagination = ({page, totalAuditCount, PAGE_SIZE, setPage, handlePrevPage, handleNextPage}: PaginationProps) => {
  return (
      <div className="flex items-center justify-between py-3">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
              disabled={page === 1}
              onClick={handlePrevPage}
              className={page === 1 ?
                  "cursor-not-allowed relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium" :
                  "relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"}>
            Previous
          </button>
          <button
              onClick={handleNextPage}
              className="relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium">
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
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
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                  disabled={page === 1}
                  onClick={handlePrevPage}
                  className={page === 1 ? ' cursor-not-allowed relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300' : 'relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300'}>
                <Icons.arrowLeft/>
                <span className="ml-1">Previous</span>
                {/*<span className="sr-only">Previous</span>*/}

              </button>

              {/*{*/}
              {/*  Array.from(Array(Math.ceil(totalAuditCount / PAGE_SIZE) || 0)).map((_, index) => (*/}
              {/*      <a*/}
              {/*          key={index}*/}
              {/*          href={void 0}*/}
              {/*          aria-current="page"*/}
              {/*          className={index + 1 == page ? "relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold" : "relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 cursor-pointer"}*/}
              {/*          // onClick={() => {*/}
              {/*          //   if (index + 1 !== page) {*/}
              {/*          //     setPage(index + 1)*/}
              {/*          //   }*/}
              {/*          // }}*/}
              {/*      >*/}
              {/*        {index + 1}*/}
              {/*      </a>*/}
              {/*  ))*/}
              {/*}*/}

              <button
                  disabled={Math.ceil(totalAuditCount / PAGE_SIZE) === page}
                  onClick={handleNextPage}
                  className={Math.ceil(totalAuditCount / PAGE_SIZE) === page ?
                      "cursor-not-allowed relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50" :
                      "relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  }>
                <span className="ml-1">Next</span>
                {/*<span className="sr-only">Next</span>*/}
                <Icons.arrowRight/>
              </button>
            </nav>
          </div>
        </div>
      </div>
  );
};

export default Pagination;