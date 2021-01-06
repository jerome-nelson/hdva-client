import React from "react";
import { useFullScreenStyles } from "./fullscreen.style";

export const FullScreen: React.FC = ({ children }) => {

    const classes = useFullScreenStyles();

    return (
       <div className={classes.root}>
           { children }
       </div>
    );
}