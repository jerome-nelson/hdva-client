import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { Properties } from 'components/property/property-table';
import { Popup } from 'components/upload/upload';
import UploadPopup from 'components/upload/upload-popup';
import { FileContext, MiniFileUpload, processFile, UPLOAD_STATE } from 'components/upload/upload.context';
import { postAPI } from 'hooks/useAPI';
import { RoleTypes } from 'hooks/useRoles';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { getCurrentUser, User } from 'services/auth.service';
import { skippedFilesText } from 'services/upload.service';
import { v4 as uuidv4 } from 'uuid';
import { LoginContext } from "./components/login-form/login.context";
import { Modal } from "./components/modal/modal";
import { ModalContext } from './components/modal/modal.context';
import { ROUTES } from "./routing";
import { theme } from "./theme";
import { PrivateRoute } from "./utils/protected-route";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount: number, error: any) => {
                return !([401, 403].includes(error.response.status) || failureCount === 3);
            },
            staleTime: 1000 * 60 * 60 * 24,
            cacheTime: 1000 * 60 * 60 * 24
        }
    }
});

// TODO: Minify
export const AppComponent = () => (
    <React.Fragment>
        <Router>
            <Switch>
                {ROUTES.map(({ auth, fullWidth, exact, props, component }) => (
                    <PrivateRoute auth={auth} fullWidth={fullWidth} exact={exact} key={uuidv4()} allowed={props.allowed as RoleTypes[]} path={props.path} toRender={component} />
                ))}
            </Switch>
        </Router>
    </React.Fragment>
);

export const App = () => {
    const called = useRef(false);
    const [status, setStatus] = useState(UPLOAD_STATE.READY);
    const [skippedFiles, setSkippedFiles] = useState<any[]>([]);
    const [fileState, setFileState] = useState<any[]>([]);
    const [currentFile, setCurrentFile] = useState("");
    const [currentGroup, setCurrentGroup] = useState("");
    const [message, setMsg] = useState("");
    const [modalChild, setModalChild] = useState<null | React.ReactNode>(null);
    const [showModal, setModal] = useState(false);
    const [userDetails, setUserDetails] = useState<User | null>(getCurrentUser());
    const [, shouldDismiss] = useState(false);
    const [showFilePopup, setView] = useState(true);
    const skippedText = useMemo(() => skippedFilesText(skippedFiles), [skippedFiles]);
    const count = fileState.length;
    const resetState = () => {
        setSkippedFiles([]);
        setFileState([]);
        setView(true);
        setCurrentFile("");
        setCurrentGroup("");
        setStatus(UPLOAD_STATE.READY);
    }

    useEffect(() => {
        async function fetchMyAPI() {
            const token = userDetails?.token;
            if (!!currentGroup && !!token && !called.current && status === UPLOAD_STATE.IN_PROGRESS) {
                try {
                    const url = '/properties/add';
                    const propertiesResponse = await postAPI<Properties>(url, {
                        name: [fileState[0].folder.split("/")[0]],
                        groupId: Number(currentGroup)
                    }, {
                        token
                    });
                    for (let i=0; i < fileState.length; i+=1) {
                        setCurrentFile(fileState[i].name);
                        await processFile(
                            fileState[i],
                            token,
                            propertiesResponse[0].propertyId
                        );
                    }
                    called.current = true;
                    resetState();
                } catch (e) {
                    setStatus(UPLOAD_STATE.FAILED);
                    return;
                }
            }
        }
        fetchMyAPI();
    }, [status, userDetails, currentGroup]);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <LoginContext.Provider
                    value={{
                        user: userDetails,
                        setUserDetails
                    }}
                >
                    <ModalContext.Provider
                        value={{
                            dismissable: false,
                            message: message,
                            flashModal: showModal,
                            shouldDismiss: shouldDismiss,
                            updateMessage: setMsg,
                            setModal: setModal,
                            setChild: setModalChild,
                            children: modalChild
                        }}
                    >
                        <FileContext.Provider value={{
                            skippedFiles,
                            setSkippedFiles,
                            status,
                            files: fileState,
                            setFiles: setFileState,
                            setStatus
                        }}>
                            <CssBaseline />
                            <AppComponent />
                            {!modalChild ? <Modal /> : (<Modal>{modalChild}</Modal>)}
                            <FileContext.Consumer>
                                {state => (
                                    <React.Fragment>
                                        {
                                            state.status === UPLOAD_STATE.FAILED && (
                                                <Popup
                                                    heading="Upload failed"
                                                    description="No property or property data was uploaded."
                                                    onOk={() => {
                                                        resetState();
                                                    }}
                                                    noCancel
                                                />
                                            )
                                        }
                                        {
                                            state.skippedFiles.length > 0 && (
                                                <Popup
                                                    description={skippedText}
                                                    heading="Unable to upload one or more files"
                                                    onOk={() => {
                                                        setSkippedFiles([]);
                                                    }}
                                                    okText="Skip Files"
                                                    onCancel={() => {
                                                        setFileState([]);
                                                        setSkippedFiles([]);
                                                    }}
                                                    warnOnChange
                                                />
                                            )
                                        }
                                        {!showFilePopup && !state.skippedFiles.length && state.files.length > 0 && (
                                            <MiniFileUpload
                                                count={count - 1}
                                                name={currentFile}
                                                onClick={() => {
                                                    setView(true);
                                                }}
                                            />
                                        )}
                                        {showFilePopup && !state.skippedFiles.length && state.files.length > 0 && (
                                            <UploadPopup
                                                files={fileState}
                                                currentGroup={currentGroup}
                                                onCurrent={setCurrentFile}
                                                onOk={groupId => {
                                                    state.setStatus(UPLOAD_STATE.IN_PROGRESS);
                                                    setCurrentGroup(groupId);
                                                    setView(false);
                                                }}
                                                onCancel={() => {
                                                    resetState();
                                                }}
                                            />
                                        )}
                                    </React.Fragment>
                                )}
                            </FileContext.Consumer>

                        </FileContext.Provider>
                    </ModalContext.Provider>

                </LoginContext.Provider>
            </ThemeProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}