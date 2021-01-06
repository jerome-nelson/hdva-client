import { Button, ButtonTypeMap, CircularProgress, ExtendButtonBaseTypeMap } from "@material-ui/core";
import React from "react";

// TODO: Create generic type that adds className - all custom components should use this
type CTAProps = ExtendButtonBaseTypeMap<ButtonTypeMap<{ type: "button" | "reset" | "submit" | undefined; loading: boolean }>>["props"] & { className?: string; };

export const CTAButton: React.FC<CTAProps> = props => {
    const { children, ...rest } = props;
    return (
        <Button {...rest}>
            {props.loading ? <CircularProgress size="1.5rem" color="secondary" /> : children}
        </Button>
    );
};