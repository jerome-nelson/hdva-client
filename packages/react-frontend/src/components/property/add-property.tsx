import { CircularProgress, createStyles, Grid, InputAdornment, Link, makeStyles, MenuItem, OutlinedInput, Paper, Select, Theme, Typography } from "@material-ui/core";
import Modal from '@material-ui/core/Modal';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import { CTAButton } from "components/buttons/cta";
import { DragAndDrop } from "components/drag-and-drop/drag-and-drop";
import { HeaderTitle } from "components/header/header";
import { BootstrapInput } from "components/input-bootstrap/bootstrap.input";
import { LoginContext } from "components/login-form/login.context";
import { ModalContext } from "components/modal/modal.context";
import { Properties, PropertyMiniTable } from "components/property/property-table";
import { messages } from "config/en";
import { getAPI, postAPI, putAPI } from "hooks/useAPI";
import { ReactComponent as FloorplanSVG } from "media/floorplan.svg";
import { ReactComponent as PhotoSVG } from "media/photography.svg";
import { Groups } from "pages/group-management/group-management.page";
import { Media } from "pages/properties/properties.page";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useQueries, useQuery } from "react-query";
import { useHistory } from "react-router-dom";

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
    existingData?: any;
    onFetch?(media: any[]): void;
    onUpload(
        files: any[]
    ): void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({ existingData, onFetch, onUpload }) => {
    const { user } = useContext(LoginContext);
    const [files, setFileList] = useState<any[]>([]);
    const [removed, setRemovedFiles] = useState<string[]>([])
    const results = useQueries([
        {
            queryKey: [`properties`, user!.group, existingData?.propertyId],
            queryFn: () => postAPI<Media>('/get-media', {
                pids: [existingData?.propertyId],
            }, {
                token: user!.token
            }),
            enabled: Boolean(user?.group && existingData?.propertyId)
        },
        {
            queryKey: [`properties`, user!.group, 3, existingData?.propertyId],
            queryFn: () => postAPI<Properties>('/properties', {
                pids: [existingData?.propertyId],
            }, {
                token: user!.token
            }),
            enabled: Boolean(user?.group && existingData?.propertyId)
        }
    ]);

    const isFetchingData = useMemo(
        () => existingData && results.reduce((state, curr) =>
            (state ? state : curr.isLoading || curr.isIdle || curr.isFetching),
            false),
        [results]);

    const isEmpty = useMemo(() =>
        results.reduce((state, curr) =>
            (state ? state : curr.isSuccess && !Boolean(curr.data)),
            false),
        [results]);

    useEffect(() => {
        if (onUpload && files.length > 0) {
            onUpload(files);
        }
    }, [files]);

    const mediaFiles = useMemo(() => {

        if (isFetchingData || isEmpty) {
            return [];
        }

        const mediaResults = results[0].data as Media[];
        if (mediaResults && mediaResults.length) {
            const data = (mediaResults as Media[])
                .map(({ resource, type }) => ({
                    name: resource,
                    type
                })
                )
                .filter(mediaFile => {
                    return !removed.includes(mediaFile.name);
                });

            if (onFetch) {
                onFetch(data);
            }

            return data;
        }

        return [];

    }, [results, removed]);

    return (
        <Grid container justify="space-evenly">
            {isFetchingData
                ? <CircularProgress color="secondary" />
                : ([
                    { name: "Upload Images", type: "photo", component: <PhotoSVG /> },
                    { name: "Upload Floorplans", type: "floorplan", component: <FloorplanSVG /> }
                ].map((obj, index) => (
                    <Grid item key={`${obj.name}-${index}`}>
                        <DragAndDrop
                            name={obj.name}
                            fileData={mediaFiles.filter(raw => raw.type === obj.type)}
                            onAdd={(newFiles: any) => {
                                const flatList = files.concat(newFiles.map((el: any) => ({
                                    file: el,
                                    resourceType: obj.type
                                })));
                                setFileList(flatList);
                            }}
                            onRemove={(removed: any) => {
                                setRemovedFiles(removed);
                                const newList = files.filter((el: any) => el.file.type !== removed.type && el.resourceType !== removed.resourceType && removed.size === el.file.size && removed.name !== el.file.name);
                                setFileList(newList);
                            }}
                        >
                            <CloudUploadIcon style={{ color: `rgba(1,1,1,0.29)`, fontSize: 120 }} />
                        </DragAndDrop>
                    </Grid>
                )))}
        </Grid>
    );
};

interface AddPropertyProps {
    onClose(): void;
}

export const AddProperty: React.FC<AddPropertyProps> = ({ onClose }) => {
    const classes = useAddPropertyStyles();
    const { user } = useContext(LoginContext);
    const modal = useContext(ModalContext);
    const history = useHistory();
    const [disableUpload, setDisabledUpload] = useState(true);
    const [images, setImages] = useState<any[]>([]);
    const [upload, showUpload] = useState(false);
    const [groups, setGroups] = useState<Groups[]>([]);
    const [isModalHidden, shouldHide] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [vtLink, setVTLink] = useState("");
    // const [externalVTLink, setExternalVTLink] = useState("");
    const [groupId, setGroupId] = useState<string>("");
    const [existingProperty, setSelectedProperty] = useState<Record<any, any> | null>(null);
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
    }, [groupData]);

    useEffect(() => {
        const shouldShow = (images.length > 0 && !!groupId);
        setDisabledUpload(!shouldShow);
    }, [images, groupId]);

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
                            </Grid>
                            <PropertyMiniTable
                                className={classes.searchField}
                                color="secondary"
                                onEdit={data => {
                                    setSelectedProperty(data);
                                    if (data.groupId) {
                                        setGroupId(data.groupId);
                                    }
                                    showUpload(true);
                                }}
                                filter={searchTerm}
                                onFetch={setDisabled}
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
                                        title={(Boolean(existingProperty?.name)) ? existingProperty?.name : searchTerm}
                                        alignText="center"
                                        color="primary"
                                        variant="h5"
                                    />
                                </Grid>
                            </Grid>
                            <UploadPanel
                                existingData={existingProperty}
                                onFetch={mediaList => {
                                    // Prevent re-render isses
                                }}
                                onUpload={setImages}
                            />
                            {/* TODO: Integrate into UploadPanel */}
                            {groups && (
                                <Grid container item xs={12} justify="center">
                                    <Grid xs={10} item className={classes.groupSection}>
                                        <OutlinedInput
                                            color="secondary"
                                            fullWidth={true}
                                            placeholder="Place Virtual Tour Link here"
                                            id="vt"
                                            type="text"
                                            value={vtLink}
                                            onChange={event => setVTLink(event.target.value)}
                                        />
                                    </Grid>
                                    <Grid xs={10} item className={classes.groupSection}>
                                        <Select
                                            color="primary"
                                            value={groupId}
                                            onChange={({ target }) => {
                                                setGroupId(target.value as string);
                                            }}
                                            input={<BootstrapInput />}
                                            IconComponent={ExpandMoreIcon}
                                            label="Assign Property to a Group"
                                        >
                                            {groups.map((val: any) => (<MenuItem key={val.groupId} value={val.groupId}>{val.name}</MenuItem>))}
                                        </Select>
                                    </Grid>
                                </Grid>
                            )}
                        </React.Fragment>
                    )}
                    <Grid container>
                        <Grid item xs={6}>
                            <CTAButton
                                disabled={!upload && (!searchTerm || btnDisabled)}
                                type="submit"
                                size="medium"
                                variant={"contained"}
                                color="primary"
                                startIcon={!upload ? null : <ArrowBackIosIcon />}
                                onClick={() => {
                                    if (upload) {
                                        showUpload(false);

                                        if (!searchTerm) {
                                            setSelectedProperty(null);
                                            setImages([]);
                                            console.log("gired");
                                        }

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
                                    type="submit"
                                    size="medium"
                                    variant="contained"
                                    color="primary"
                                    onClick={async () => {
                                        try {
                                            const propertiesResponse = await postAPI<Properties>('/properties/add', {
                                                name: [searchTerm],
                                                groupId: Number(groupId)
                                            }, {
                                                token: user!.token
                                            });
                                            for (let i = 0; i < images.length; i += 1) {
                                                const url = await postAPI<string>('/images/upload', {
                                                    type: images[i].file.type,
                                                    path: `${searchTerm}/${images[i].file.name}`
                                                }, {
                                                    token: user!.token
                                                });
                                               await putAPI<any>(url as unknown as string, images[i].file, {
                                                    extUrl: true,
                                                    extraHeaders: {
                                                        "Content-Type": images[i].file.type
                                                    }
                                                });
                                                await postAPI<any>('/media/add', {
                                                    resource: images[i].file.name,
                                                    type: images[i].resourceType,
                                                    propertyId: propertiesResponse[0].propertyId
                                                }, {
                                                    token: user!.token
                                                });
                                            }
                                            modal.shouldDismiss(true);
                                            modal.updateMessage("Upload is completed");
                                            history.go(0);
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