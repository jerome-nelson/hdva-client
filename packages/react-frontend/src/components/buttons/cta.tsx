import { Button, ButtonTypeMap, CircularProgress, ExtendButtonBaseTypeMap } from "@material-ui/core";
import React from "react";

// TODO: Create generic type that adds className - all custom components should use this
// TODO: Fix onClick typing
type CTAProps = ExtendButtonBaseTypeMap<ButtonTypeMap<{ type: "button" | "reset" | "submit" | undefined; }>>["props"] & { 
    onClick?(e?: any): void;
    loading?: boolean;
    className?: string; };

export const CTAButton: React.FC<CTAProps> = props => {
    const { children, loading, ...rest } = props;
    return (
        <Button {...rest}>
            {loading ? <CircularProgress size="1.5rem" color="secondary" /> : children}
        </Button>
    );
};