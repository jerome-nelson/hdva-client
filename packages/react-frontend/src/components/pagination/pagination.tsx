import { Button, Divider, Paper } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { usePagination } from '@material-ui/lab/Pagination';
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { usePaginationStyles } from "./pagination.styles";

export interface PaginationProps {
  count: number;
  onChange(pagenumber: number): void;
}

export const CustomPagination: React.SFC<PaginationProps> = ({ count, onChange }) => {
  const { items } = usePagination({
    count,
  });
  const classes = usePaginationStyles();
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
    <Paper className={classes.root} elevation={3}>
      <ul>
        {items.map(({ page, type, selected, ...item }, index) => {
          console.log(page);
          let children = null;

          if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            children = <div className={classes.seperator}>…</div>;
          } else if (type === 'page') {
            children = (
              <Button
                {...item}
                color="secondary"
                className={classNames({
                  [classes.button]: true,
                  [classes.btnSelected]: selected
                })}
                onClick={event => {
                  clickHandler(page, type)
                  item.onClick(event);
                }}>
                {page}
              </Button>
            );
          } else {
            children = (
              <IconButton
                {...item}
                // className={classNames({
                //   [classes.button]: true,
                //   [classes.iconBtn]: true,
                //   [classes.btnSelected]: selected
                // })}
                // type="button"
                onClick={event => {
                  clickHandler(page, type)
                  item.onClick(event);
                }}>
                {(type === "previous" && <ChevronLeftIcon width="100%" height="100%" color={item.disabled ? "disabled" : "primary"} />)}
                {(type === "next" && <ChevronRightIcon  width="100%" height="100%" color={item.disabled ? "disabled" : "primary"} />)}
              </IconButton>
            );
          }

          return <React.Fragment>
            {(type === "next" && <Divider light orientation="vertical" flexItem />)}
            <li key={index}>{children}</li>
            {(type === "previous" && <Divider light orientation="vertical" flexItem />)}
          </React.Fragment>
        })}
      </ul>
    </Paper>
  );
}