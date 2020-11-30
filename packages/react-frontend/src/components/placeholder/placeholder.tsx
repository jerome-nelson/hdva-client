import React from "react";
import { usePlaceholderStyles } from "./placeholder.style";


export interface PlaceholderProps {
    subtitle?: string;
    title: string;
}

export const Placeholder: React.SFC<PlaceholderProps> = ({ children, title, subtitle }) => {
    const classes = usePlaceholderStyles();
    return (
        <React.Fragment>
            <div className={classes.root}>
                <div className={classes.icon}>
                    <span>{children}</span>
                </div>
                <h4>{title}</h4>
                <p>{subtitle}</p>
            </div>
        </React.Fragment>
    );
}