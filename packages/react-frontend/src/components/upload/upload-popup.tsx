import { CircularProgress, createStyles, IconButton, makeStyles, MenuItem, Select, Theme } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import classNames from "classnames";
import { BootstrapInput } from "components/input-bootstrap/bootstrap.input";
import { LoginContext } from "components/login-form/login.context";
import { GenericTable } from "components/table/generic-table";
import { getAPI } from "hooks/useAPI";
import { Groups } from "pages/group-management/group-management.page";
import React, { Suspense, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { COLOR_OVERRIDES } from "theme";
import { bytesToSize } from "utils/conversion";
import { Popup } from "./upload";
import { FileContext, FileMap, UPLOAD_STATE } from "./upload.context";


interface IUploadDetails {
    currentGroup?: string;
    files: FileMap[];
    onCurrent(file: string): void;
    onOk?(groupId: string): void;
    onCancel?(): void;
    show?: boolean;
}

export const useTableStyles = makeStyles<Theme>((theme) => createStyles({
    root: {
        border: `1px solid ${COLOR_OVERRIDES.hdva_grey}`,
        padding: `${theme.spacing(2)}px`,
        height: `500px`,
        overflowX: `hidden`,
        overflowY: `scroll`,
        "& .MuiTableCell-body": {
            color: `${COLOR_OVERRIDES.hdva_black} !important`
        }
    },
    disabled: {
        opacity: 0.3,
        cursor: "hand",
    },
    iconBtn: {
        color: COLOR_OVERRIDES.hdva_grey,
        "&:hover": {
            color: COLOR_OVERRIDES.hdva_red
        },
    }
}));


const CancelIcon = React.lazy(() => import('@material-ui/icons/Cancel'));
const CompletedIcon = React.lazy(() => import('@material-ui/icons/CheckCircle'));
const UploadingIcon = React.lazy(() => import('@material-ui/icons/CheckCircle'));
const FileIcon = React.lazy(() => import('@material-ui/icons/Image'));
let called = false;
// <CircularProgress size="1rem" color="primary" />

const UploadTable: React.FC<{
    currentGroup?: string;
    isReady(groupId: string): void;
    onUpload(id: number): void;
    onFailure(message: string): void;
    files: FileMap[]; 
    onDelete?(upload: number): void; 
}> = ({ files, currentGroup = "", onDelete, isReady, onUpload, onFailure }) => {
    const { user } = useContext(LoginContext);
    const { data: groupData, isLoading } = useQuery({
        queryKey: "groups",
        queryFn: () => getAPI<Groups>(`/groups`, { token: user!.token })
    });
    const [details, setDetails] = useState({
        group: currentGroup,
        property: ""
    });
    const [uploading, setStatus] = useState(false);
    const classes = useTableStyles();
    const cells = useMemo(() => {
        return files.map((upload, index) => ({
            icon: {
                data: <FileIcon />,
            },
            name: {
                data: upload.name,
            },
            size: {
                data: `${bytesToSize(upload.size)}`,
            },
            folder: {
                data: upload.folder
            },
            status: {
                data: (
                    <IconButton className={classes.iconBtn} onClick={() => {
                        if (onDelete) {
                            onDelete(index);
                        }
                    }} aria-label="delete">
                        <CancelIcon />
                    </IconButton>
                )
            }
        }))
    }, [files]);

    return (
        <Suspense fallback={<CircularProgress color="secondary" />}>
            {!isLoading && (
            <React.Fragment>
            <form onSubmit={e => e.preventDefault()}>
                        <Select
                            color="primary"
                            value={details.group}
                            input={<BootstrapInput />}
                            IconComponent={ExpandMoreIcon}
                            label="Which group are these uploads for?"
                            onChange={({ target }) => {
                                setDetails(prevState => {
                                    return {
                                        ...prevState,
                                        group: String(target.value)
                                    }
                                });

                                if(isReady) {
                                    isReady(String(target.value));
                                    setStatus(true);
                                }
                            }}
                        >
                            {(groupData || []).map((val: any, index: number) => (<MenuItem key={`${val}-${index}`} value={val.groupId}>{val.name}</MenuItem>))}
                        </Select>
                    </form>
            <GenericTable
                className={classNames({
                    [classes.root]: true,
                    [classes.disabled]: !uploading
                })}
                mini
                selectable={false}
                cells={[
                    {},
                    {},
                    {},
                    {}
                ]}
                data={cells}
            />
            </React.Fragment>
            )}
            {isLoading && (<CircularProgress />)}
        </Suspense>
    )
}

const UploadPopup: React.FC<IUploadDetails> = ({ onCurrent, currentGroup = "", files, onOk, onCancel }) => {
    const fileContext = useContext(FileContext);
    const [processing, setProcessing] = useState<{ name: string; index: number; } | null>(null);
    const [internalFileState, setInternalFiles] = useState<FileMap[]>(files);
    const canUpload = [UPLOAD_STATE.IN_PROGRESS, UPLOAD_STATE.PENDING].includes(fileContext.status);
    const [ready, setReady] = useState(canUpload);
    const [groupId, setGroupId] = useState(currentGroup);
    const isUploading = fileContext.status === UPLOAD_STATE.IN_PROGRESS;

    useEffect(() => {
        if (
            !(canUpload) || 
            !processing
        ) {
            return;
        }
        onCurrent(processing.name);
    }, [processing]);
        
    return (
        <React.Fragment>
                <Popup
                    disabled={!canUpload || !ready}
                    heading="Upload details"
                    description="Select a group and press start upload"
                    warnOnChange
                    fixedWidth
                    okText={isUploading ? 'Hide' : 'Start Upload'}
                    onOk={() => {
                        if (onOk) {
                            onOk(groupId);
                        }
                    }}
                    onCancel={() => {
                        if(onCancel) {
                            onCancel();
                        }
                    }}
                >
                    <UploadTable 
                        files={internalFileState}
                        currentGroup={groupId}
                        isReady={state => {
                            if (!state) {
                                return;
                            }
                            setReady(true);
                            setGroupId(state);
                            fileContext.setStatus(UPLOAD_STATE.PENDING);
                        }}
                        onFailure={message => {
                            fileContext.setStatus(UPLOAD_STATE.FAILED);
                            console.error(message);
                        }}
                        onUpload={nextId => {
                            const next = internalFileState[nextId];
                            setProcessing({
                                name: next.name,
                                index: nextId
                            })
                        }}
                        onDelete={proposed => {
                            const newResults = internalFileState.filter((_, index) => index !== proposed);
                            setInternalFiles(newResults);
                        }} 
                    />
                </Popup>
        </React.Fragment>
    );
}

export default UploadPopup;