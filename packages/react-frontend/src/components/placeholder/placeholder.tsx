import classNames from "classnames";
import React from "react";
import { usePlaceholderStyles } from "./placeholder.style";

export interface PlaceholderProps {
    subtitle?: string;
    noMargin?: boolean;
    centerVertical?: boolean;
    title: string;
}

export const Placeholder: React.SFC<PlaceholderProps> = ({ centerVertical, children, noMargin, title, subtitle }) => {
    const classes = usePlaceholderStyles({ title, centerVertical, noMargin });
    return (
        <React.Fragment>
            <div className={classNames({
                [classes.root]: true,
                [classes.verticalCenter]: centerVertical
            })}>
                <div className={classes.icon}>
                    <span>{children}</span>
                </div>
                <h4>{title}</h4>
                <p>{subtitle}</p>
            </div>
        </React.Fragment>
    );
}