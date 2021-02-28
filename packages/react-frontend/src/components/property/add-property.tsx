import { createStyles, Grid, InputAdornment, Link, makeStyles, OutlinedInput, Paper, Theme, Typography } from "@material-ui/core";
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { CTAButton } from "components/buttons/cta";
import { PropertyMiniTable } from "components/property/property-table";
import { messages } from "config/en";
import React, { useState } from "react";

export const useAddPropertyStyles = makeStyles((theme: Theme) => createStyles({
    searchField: {
        marginBottom: `10px`,
    },
    modalWidth: {
        // Test styles
        marginTop: `50px`,
        width: `600px`
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconRight: {
        textAlign: `right`,
    },
    linkStyles: {
        display: `inline-block`,
        width: `25px`,
        height: `25px`,
        margin: `0`,
        "&:hover": {
            backgroundColor: `rgba(0,0,0, 0.05)`
        }
    }
}));

const AddProperty: React.FC = () => {
    const classes = useAddPropertyStyles();
    const [isModalHidden, shouldHide] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [btnDisabled, setDisabled] = useState(false);
    const handleClose = (event) => {
        event.preventDefault();
        shouldHide(true);
    }

    return (
        <Modal
            className={classes.modal}
            open={!isModalHidden}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <Paper className={classes.modalWidth} square>
                <Grid container>
                    <Grid className={classes.iconRight} xs={12}>
                        <Link
                            className={classes.linkStyles}
                            href="#"
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </Link>
                    </Grid>
                    <Grid xs={12}>
                        <Typography gutterBottom variant="h6" component="h6">{messages["property.modal.title"]}</Typography>
                    </Grid>
                    <Grid xs={12}>
                        <form>
                            <OutlinedInput
                                className={classes.searchField}
                                color="secondary"
                                placeholder={messages["property.modal.search"]}
                                fullWidth={true}
                                id="property_name"
                                type="text"
                                value={searchTerm}
                                onChange={({ target }) => { setSearchTerm(target.value || "") }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                }
                            />
                        </form>
                    </Grid>
                    <PropertyMiniTable className={classes.searchField} color="secondary" filter={searchTerm} onResult={result => setDisabled(Boolean(!String(searchTerm) && result > 0))} />
                    <Grid xs={12}>
                        <CTAButton
                            disabled={btnDisabled}
                            type="submit"
                            size="small"
                            variant="contained"
                            color="primary"
                        >
                            Create Property
                        </CTAButton>
                    </Grid>
                </Grid>
            </Paper>
        </Modal>
    )
};

export default AddProperty;