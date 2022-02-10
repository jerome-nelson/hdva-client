import { createStyles, Dialog, Grid, LinearProgress, makeStyles, Theme, Typography } from "@material-ui/core";
import { CTAButton } from "components/buttons/cta";
import { useBlockWindow } from "hooks/useBlockWindow";
import React from "react";
import { COLOR_OVERRIDES } from "theme";


export const useUploadStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            background: COLOR_OVERRIDES.hdva_black,
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
        }
    })
);

export const usePopupStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            marginBottom: `${theme.spacing(2)}px`
        }
    })
);

type IUploadIndicator = {
    pending?: boolean;
}

export const UploadIndicator: React.FC<IUploadIndicator> = ({ children, pending }) => {

    const classes = useUploadStyles();
    return (
        <React.Fragment>
            <Grid container justify="space-between" className={classes.root}>
                {children}
            </Grid>
            {pending && (<LinearProgress color="secondary" />)}
        </React.Fragment>
    )
}

export type IPopup = {
    cancelText?: string;
    disabled?: boolean;
    description?: string;
    heading?: string;
    okText?: string;
    onCancel?(): void;
    onOk?(): void;
    noOk?: boolean;
    noCancel?: boolean;
    fixedWidth?: boolean;
    warnOnChange?: boolean;
}

export const Popup: React.FC<IPopup> = ({ children, disabled, heading, description, fixedWidth, onCancel, noOk, noCancel, onOk, okText, cancelText, warnOnChange = false }) => {
    const [open, setOpen] = React.useState(true);
    const classes = usePopupStyles();

    useBlockWindow(warnOnChange);

    return (
        <Dialog fullWidth={fixedWidth} maxWidth="md" open={open}>
            {heading && (<Typography className={classes.header} display="block" variant="h6">{heading}</Typography>)}
            {description && (<p>{description}</p>)}
            <Grid container spacing={2} justify='flex-end'>
                {children && (
                    <Grid item xs={12}>
                        {children}
                    </Grid>
                )}
                {!noCancel && (
                    <Grid item>
                        <CTAButton
                            size="medium"
                            onClick={() => {
                                if (onCancel) {
                                    onCancel();
                                }
                                setOpen(false)
                            }}
                            color="secondary"
                            type="button"
                        >
                            {cancelText ?? "Cancel"}
                        </CTAButton>
                    </Grid>
                )}
                {!noOk && (
                    <Grid item>
                        <CTAButton
                            disabled={disabled}
                            size="medium"
                            color="primary"
                            type="button"
                            variant='contained'
                            onClick={() => {
                                if (onOk) {
                                    onOk();
                                }
                                setOpen(false)
                            }}
                        >
                            {okText ?? "Ok"}
                        </CTAButton>
                    </Grid>
                )}
            </Grid>
        </Dialog>
    );
}