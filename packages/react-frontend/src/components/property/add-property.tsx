import { createStyles, FormControl, Grid, InputAdornment, InputLabel, Link, makeStyles, OutlinedInput, Paper, Select, Theme, Typography } from "@material-ui/core";
import Modal from '@material-ui/core/Modal';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import { CTAButton } from "components/buttons/cta";
import { DragAndDrop } from "components/drag-and-drop/drag-and-drop";
import { HeaderTitle } from "components/header/header";
import { LoginContext } from "components/login-form/login.context";
import { PropertyMiniTable } from "components/property/property-table";
import { messages } from "config/en";
import { getAPI, postAPI, putAPI, useAPI } from "hooks/useAPI";
import { ReactComponent as FloorplanSVG } from "media/floorplan.svg";
import { ReactComponent as PhotoSVG } from "media/photography.svg";
import { Groups } from "pages/group-management/group-management.page";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

// TODO: Alert Popup on close button press
export const useUploadPanelStyles = makeStyles((theme: Theme) => createStyles({
    title: {

    },
    subline: {
        margin: `0`
    }
}));
export const useAddPropertyStyles = makeStyles((theme: Theme) => createStyles({
    searchField: {
        marginBottom: `10px`,
    },
    groupSection: {
        // backgroundColor: COLOR_OVERRIDES.hdva_grey_light,
    },
    gridHeader: {
        borderBottom: `1px solid rgba(1,1,1,0.29)`,
        marginBottom: `${theme.spacing(2)}px`
    },
    lastBtn: {
        textAlign: `right`,
    },
    modalWidth: {
        width: `1000px`
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

interface UploadPanelProps {
    onUpload(
        hasUpload: boolean,
        files: any[]
    ): void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({ onUpload }) => {
    const classes = useUploadPanelStyles();
    const [showBtn, shouldBtnShow] = useState(false);
    const [files, setFileList] = useState<any[]>([]);
    useEffect(() => {
        if (onUpload) {
            onUpload(showBtn, files);
        }
    }, [showBtn, files]);

    return (
        <Grid container justify="space-evenly">
            {[{ name: "Upload Images", type: "photo", component: <PhotoSVG />  }, { name: "Upload Floorplans", type: "floorplan", component: <FloorplanSVG /> }].map((obj, index) => (
                <Grid item key={`${obj.name}-${index}`}>
                    <DragAndDrop name={obj.name} hasFiles={shouldBtnShow} onFiles={(newFiles: any) => {
                        const flatList = files.concat(newFiles.map((el: any) => ({
                            file: el,
                            resourceType: obj.type
                        })));
                        setFileList(flatList);
                    }}>
                        <CloudUploadIcon />
                    </DragAndDrop>
                </Grid>
            ))}
        </Grid>
    );
};

interface AddPropertyProps {
    onClose(): void;
}

export const AddProperty: React.FC<AddPropertyProps> = ({ onClose }) => {
    const classes = useAddPropertyStyles();
    const { user } = useContext(LoginContext);
    const [disableUpload, setDisabledUpload] = useState(false);
    const [images, setImages] = useState<any[]>([]);
    const [upload, showUpload] = useState(false);
    const [groups, setGroups] = useState<Groups[]>([]);
    const [isModalHidden, shouldHide] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [groupId, setGroupId] = useState<number | null>(null);
    const [btnDisabled, setDisabled] = useState(Boolean(searchTerm.length));
    const handleClose = (event: any) => {
        event.preventDefault();
        shouldHide(true);
    }

    const { data: groupData } = useQuery({
        queryKey: "groups",
        queryFn: () => getAPI<Groups>(`/groups`, { token: user!.token })
    });

    useEffect(() => {
        if (!groupData) {
            return;
        }

        setGroups(groupData);
    }, [groupData])

    const [propertyResponse, , , callAPI] = useAPI<any>('/properties/add', {
        prevent: true,
        useToken: true,
        extraHeaders: {
            "Content-Type": "application/json",
        }
    });

    const [, , , addMedia] = useAPI<any>('/media/add', {
        prevent: true,
        useToken: true
    });

    return (
        <Modal
            className={classes.modal}
            open={!isModalHidden}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <Paper className={classes.modalWidth} square>
                <Grid container>
                    <Grid item className={classes.iconRight} xs={12}>
                        <Link
                            className={classes.linkStyles}
                            href="#"
                            onClick={(event: any) => {
                                handleClose(event);
                                setSearchTerm("");
                                onClose();
                            }}
                        >
                            <CloseIcon />
                        </Link>
                    </Grid>
                    {!upload && (
                        <React.Fragment>
                            <Grid item xs={12}>
                                <Typography gutterBottom variant="h6" component="h6">{messages["property.modal.title"]}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <form>
                                    <OutlinedInput
                                        className={classes.searchField}
                                        color="secondary"
                                        placeholder={messages["property.table.search"]}
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
                            <PropertyMiniTable
                                className={classes.searchField}
                                color="secondary"
                                filter={searchTerm}
                                onFetch={resultFound => setDisabled(resultFound)}
                            />
                        </React.Fragment>
                    )}
                    {upload && (
                        <React.Fragment>
                            <Grid container>
                                <Grid className={classes.gridHeader} xs={12} item>
                                    <HeaderTitle
                                        disableGutters
                                        disableBack
                                        title={searchTerm}
                                        alignText="center"
                                        color="primary"
                                        variant="h5"
                                    />
                                </Grid>
                            </Grid>
                            <UploadPanel
                                onUpload={(onUpload, files) => {
                                    setImages(files);
                                    setDisabledUpload(onUpload);
                                }} />
                            {groups && (
                                <Grid xs={12} item className={classes.groupSection}>
                                    <FormControl variant="outlined">
                                        <InputLabel id="Group">Group Assignment</InputLabel>
                                        <Select
                                            color="primary"
                                            value={groupId}
                                            onChange={({ target }) => {
                                                setGroupId(Number(target.value));
                                            }}
                                            IconComponent={ExpandMoreIcon}
                                            label="Assign Property to a Group"
                                            variant="filled"
                                        >
                                            {groups.map((val: any) => (<option value={val.groupId}>{val.name}</option>))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
                        </React.Fragment>
                    )}
                    <Grid container>
                        <Grid item xs={6}>
                            <CTAButton
                                disabled={Boolean(searchTerm.length === 0) || btnDisabled}
                                disableElevation
                                type="submit"
                                size="medium"
                                variant={"contained"}
                                color="primary"
                                startIcon={!upload ? null : <ArrowBackIosIcon />}
                                onClick={() => {
                                    if (upload) {
                                        showUpload(false);
                                        return;
                                    }

                                    showUpload(true);
                                    return;
                                }}
                            >
                                {!upload ? "Create Property" : "Back"}
                            </CTAButton>
                        </Grid>
                        {upload && (
                            <Grid item xs={6} className={classes.lastBtn}>
                                <CTAButton
                                    disabled={disableUpload}
                                    disableElevation
                                    type="submit"
                                    size="medium"
                                    variant="contained"
                                    color="primary"
                                    onClick={async () => {
                                        try {
                                            await callAPI({
                                                name: [searchTerm],
                                                groupId
                                            });
                                            for (let i = 0; i < images.length; i += 1) {
                                                const url = await postAPI<string>('/images/upload', {
                                                    type: images[i].file.type,
                                                    path: encodeURIComponent(`${searchTerm}/${images[i].file.name}`)
                                                }, {
                                                    token: user!.token
                                                });
                                                await putAPI<any>(url as unknown as string, images[i].file, {
                                                    extraHeaders: {
                                                        "Content-Type": images[i].file.type
                                                    }
                                                });
                                                await addMedia({
                                                    resource: images[i].file.name,
                                                    type: images[i].resourceType,
                                                    propertyId: (propertyResponse as any).propertyId
                                                });
                                            }
                                        } catch (e) {
                                            alert("Error");
                                            console.log(e);
                                        }
                                    }}
                                >
                                    Upload
                            </CTAButton>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Modal>
    )
};

export default AddProperty;