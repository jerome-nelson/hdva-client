import { Grid } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { ErrorPopup } from "../error-popup/error-popup";
import { ModalContext } from "./modal.context";
import { useModalProviderStyles } from "./modal.style";

interface ModalProps {
    options?: {}
}

export const Modal: React.FC<ModalProps> = ({ children }) => {

    const classes = useModalProviderStyles();
    const modalOptions = useContext(ModalContext);
    const [showModal, setModalState] = useState(false);

    useEffect(() => {
        if (modalOptions.flashModal) {
            setModalState(modalOptions.flashModal);
            setTimeout(() => {
                setModalState(false)
            }, 5000);
        }
    }, [modalOptions])

    return (
        <React.Fragment>
            {!children && (
                <div className={classes.root}>
                    <div className={classNames({
                        [classes.modal]: true,
                        [classes.modalHidden]: !showModal
                    })}>
                        <ErrorPopup rounded show={showModal}>
                            <Grid className={classes.gridTxtAlignment} container alignItems="center">
                                <Grid sm={11} item><span dangerouslySetInnerHTML={{ __html: modalOptions.message }} /></Grid>
                                <Grid className={classes.lastItem} item>
                                    <CancelIcon className={classes.closeIcon} onClick={() => setModalState(false)} />
                                </Grid>
                            </Grid>
                        </ErrorPopup>
                    </div>
                </div>
            )}
            {children}
        </React.Fragment>
    );
}
