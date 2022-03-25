import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { postAPI, putAPI } from "hooks/useAPI";
import { useBlockWindow } from "hooks/useBlockWindow";
import React, { createRef, useContext, useEffect } from "react";
import { COLOR_OVERRIDES } from "theme";
import { UploadIndicator } from "./upload";

const ALLOWED_IMAGES = ["image/jpeg", "image/png"];
export enum MEDIA_TYPES {
    VIRTUAL_TOUR = 'vt',
    FLOORPLAN = 'floorplan',
    IMAGE = 'photo'
};

export enum UPLOAD_STATE {
    READY,
    IN_PROGRESS,
    FAILED,
    PENDING,
    FINISHED
}

export type FileMap = {
    file: File;
    folder: string;
}

interface FileContext {
    status: UPLOAD_STATE;
    setStatus: any;
    files: FileMap[];
    setFiles: any;
    skippedFiles: FileMap[];
    setVTLink: any;
    vtLink: string;
    setSkippedFiles: any;
}

export const FileContext = React.createContext<FileContext>({
    vtLink: "",
    status: UPLOAD_STATE.READY,
    skippedFiles: [],
    setVTLink: null,
    setSkippedFiles: [],
    setStatus: null,
    setFiles: null,
    files: []
});
export const FileUploadRef = createRef<HTMLInputElement>();
export const FileUpload: React.FC = () => {
    const fileContext = useContext(FileContext);
    useEffect(() => {
        if (FileUploadRef.current !== null) {
            FileUploadRef.current.setAttribute("directory", "");
            FileUploadRef.current.setAttribute("webkitdirectory", "");
            FileUploadRef.current.setAttribute("mozdirectory", "");
        }
    }, [FileUploadRef]);
    return (
        <input ref={FileUploadRef} accept='image/*' type="file" multiple onChange={({ target }) => {
            if (!target.files) {
                return;
            }

            const mapped = Array.from(target.files).map((file) => ({
                file: file,
                folder: (file as any).webkitRelativePath.replace(file.name, '')
            }));

            const skipped = mapped.filter(({ file }) => !ALLOWED_IMAGES.includes(file.type));
            const data = mapped.filter(({ file }) => ALLOWED_IMAGES.includes(file.type));

            if (skipped.length > 0) {
                fileContext.setSkippedFiles(skipped);
            }

            if (fileContext.files.length > 0) {
                fileContext.setFiles([
                    ...fileContext.files,
                    ...data
                ]);
                return;
            }

            fileContext.setFiles(data);
        }} style={{ display: "none" }} /> as any
    )
}

export const useMiniUploadStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: 'fixed',
            bottom: `${theme.spacing(2)}px`,
            zIndex: 1200,
            width: `90%`,
            left: `5%`
        },
        btn: {
            color: COLOR_OVERRIDES.hdva_grey_light,
            cursor: "pointer",
            fontWeight: `bold`,
            background: `transparent`,
            border: `none`,
            borderBottom: `1px solid ${COLOR_OVERRIDES.hdva_grey_light}`
        }
    })
);

export const MiniFileUpload: React.FC<{ name: string; count: number; onClick?(): void; }> = ({ count, name, onClick }) => {
    useBlockWindow();
    const classes = useMiniUploadStyles();
    const { status } = useContext(FileContext);
    const countSuffix = count && count > 1 ? "files" : "file";
    const btnText = name ? `${count} ${countSuffix} left` : 'View Details';
    return (
        <div className={classes.root}>
            <UploadIndicator pending={status === UPLOAD_STATE.IN_PROGRESS || status === UPLOAD_STATE.PENDING}>
                <Grid container justify="space-between">
                    <Grid item xs={8}>
                        {((status === UPLOAD_STATE.PENDING || UPLOAD_STATE.IN_PROGRESS) && !name) && status !== UPLOAD_STATE.FAILED && `Processing`}
                        {status === UPLOAD_STATE.IN_PROGRESS && name && `Uploading ${name}`}
                        {status === UPLOAD_STATE.FINISHED && `Uploaded`}
                        {status === UPLOAD_STATE.FAILED && `Failed`}
                    </Grid>
                    {count && status === UPLOAD_STATE.IN_PROGRESS && name  && (
                        <Grid item>
                            <button className={classes.btn} onClick={onClick}>{btnText}</button>
                        </Grid>
                    )}
                </Grid>
            </UploadIndicator>
        </div>
    );
}


export const processFile = async (file: FileMap, token: string, propertyId: string): Promise<boolean | Error> => {
    try {
        const url = await postAPI<string>('/images/upload', {
            type: file.file.type,
            path: `${file.folder}${file.file.name}`
        }, {
            token
        });
        await putAPI<any>(url as unknown as string, file.file, {
            extUrl: true,
            extraHeaders: {
                "Content-Type": file.file.type
            }
        });
        const subfolder = file.folder.split(/\/(.+)/);
        const rootFile = subfolder.length > 1 ? subfolder[1] : '';
        await postAPI<any>('/media/add', {
            resource: `${rootFile}${file.file.name}`,
            type: "image",
            propertyId
        }, {
            token
        });
        return true;
    } catch (e) {
        console.log(e);
        throw e;
    }
}
