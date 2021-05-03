import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { Variant } from "@material-ui/core/styles/createTypography";
import React from "react";
import { BackButton } from "../buttons/back-button";
import { useHeaderStyles } from "./header.style";


export interface HeaderProps {
    alignText?: 'center' | 'left' | 'right';
    color?: 'primary' | 'secondary';
    variant?: Variant;
    isFixed?: boolean;
    fixedHeight?: string;
    disableGutters?: boolean;
    disableBack?: boolean;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
}

export const HeaderTitle: React.SFC<HeaderProps> = ({ alignText, color, isFixed, disableGutters, disableBack, title, subtitle, variant, fixedHeight }) => {
    const classes = useHeaderStyles({ disableBack, title, alignText, fixedHeight });
    return (
        <React.Fragment>
            <AppBar
                color={color || "transparent"}
                position={isFixed ? "fixed" : "static"}
                className={classes.appBar}
                classes={{
                    root: classes.paperReset
                }}>
                <Toolbar className={classes.root} disableGutters={disableGutters}>
                    {!disableBack && (<BackButton color={color || "primary"} />)}
                    {title && (
                        <Typography className={classes.title} display="block" variant={variant || "h3"}>
                            {title}
                        </Typography>
                    )}
                    {subtitle && (
                        <Typography className={classes.title} display="block" variant={"h5"}>
                            {subtitle}
                        </Typography>
                    )}
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}