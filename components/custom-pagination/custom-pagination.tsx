import React from 'react';
import ReactPaginate from "react-paginate";
import {Icons} from "@/components/icons";
import "./custom-pagination.css"

interface PaginationProps {
    totalPages: number
    setCurrentPage: (selected: number) => void
}

const CustomPagination = ({setCurrentPage, totalPages}: PaginationProps) => {
    const handlePageClick = ({selected}: any) => {
        setCurrentPage(selected + 1);
    };
    // const showNextButton = currentPage !== totalPages;
    // const showPrevButton = currentPage !== 1;
    return (
        <>
            <ReactPaginate
                breakLabel={<span className="mr-4">...</span>}
                nextLabel={
                    <span
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pr-2.5 cursor-pointer">
                            Next <Icons.chevronRight/>
                    </span>
                }
                onPageChange={handlePageClick}
                pageRangeDisplayed={1}
                pageCount={totalPages}
                previousLabel={
                    <span
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pl-2.5 mr-4">
                          <Icons.chevronLeft/> Previous
                    </span>
                }
                containerClassName="flex items-center justify-start sm:justify-end mt-8 mb-4"
                pageClassName="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 cursor-pointer mr-4 page-item"
                activeClassName="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground hover:bg-primary hover:text-primary-foreground border border-border h-10 w-10 pointer-events-none"
            />
        </>
    );
};

export default CustomPagination;