import { usePagination } from '@material-ui/lab/Pagination';
import React, { useEffect, useState } from "react";

export interface PaginationProps {
    count: number;
    onChange(pagenumber: number): void;
}
 
export const CustomPagination: React.SFC<PaginationProps> = ({ count, onChange}) => {
    const { items } = usePagination({
        count,
    });

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        onChange(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const clickHandler = (page, type) => {
        if (type === "previous") {
            setCurrentPage(page - 1);
        }

        if (type === "next") {
            setCurrentPage(page + 1);
        }

        if (type === "page") {
            setCurrentPage(page)
        }
    }

    return (
        <nav>
        <ul>
          {items.map(({ page, type, selected, ...item }, index) => {
              console.log(page);
            let children = null;
  
            if (type === 'start-ellipsis' || type === 'end-ellipsis') {
              children = '…';
            } else if (type === 'page') {
              children = (
                <button 
                type="button" 
                style={{ fontWeight: selected ? 'bold' : undefined }} 
                {...item} 
                onClick={() => clickHandler(page, type)}>
                  {page}
                </button>
              );
            } else {
              children = (
                <button 
                type="button" 
                {...item}
                onClick={() => clickHandler(page, type)}>
                  {type}
                </button>
              );
            }
  
            return <li key={index}>{children}</li>;
          })}
        </ul>
      </nav>
    );
}