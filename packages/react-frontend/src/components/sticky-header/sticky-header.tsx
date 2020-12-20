import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useStickyHeaderStyles } from "./sticky-header.style";

export const StickyHeader: React.FC = ({ children }) => {
    const classes = useStickyHeaderStyles();
    const [isSticky, setSticky] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const handleScroll = () => {
        const current = ref.current;
        if (current) {
            setSticky(current.getBoundingClientRect().top <= 0);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', () => handleScroll);
        };
    }, []);

    return (
        <div ref={ref} className={classNames({
            [classes.stickyHeader]: isSticky
        })}>
            <div className={classNames({
                [classes.stickyInner]: isSticky
            })}>
                {children}
            </div>
        </div>
    );
}