import { Avatar, Box, Breadcrumbs, Button, Dialog, DialogActions, DialogTitle, Grid, Hidden, InputAdornment, LinearProgress, Link, List, ListItem, ListItemIcon, ListItemText, Paper, TextField, Typography } from "@material-ui/core";
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import SearchIcon from '@material-ui/icons/Search';
import { CTAButton } from "components/buttons/cta";
import { LoginContext } from "components/login-form/login.context";
import { Placeholder } from "components/placeholder/placeholder";
import { getAPI, postAPI } from "hooks/useAPI";
import { ReactComponent as FolderSVG } from "media/folder.svg";
import { Groups } from "pages/group-management/group-management.page";
import React, { useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { User } from "services/auth.service";
import { HeaderTitle } from "../../components/header/header";
import { messages } from "../../config/en";
import { useUserStyles } from "./user-management.page.style";

interface UserInputProps {
    placeholder: string;
    value: string;
    onUpdate?(value: string): void;
}

// TODO: Combine with others
interface Users {
    createdOn: Date;
    email: string;
    group: number;
    modifiedOn: Date;
    name: string;
    password: string;
    role: number;
    userId: string;
    _id: string;
}


interface PaperReplacementProps {
    title?: React.ReactNode;
    footer?: React.ReactNode;
}

// TODO: Re-name appropiately 
const PaperReplacement: React.FC<PaperReplacementProps> = ({ children, title, footer }) => {
    const classes = useUserStyles();
    return (
        <Paper className={classes.paperOverride}>
            <div className={classes.paperInside}>
                {title && (
                    <Typography color="primary" variant="h6">
                        {title}
                    </Typography>
                )}
                {children}
            </div>
            {footer}
        </Paper>
    )
};


// TODO: make generic component
const UserInput: React.FC<UserInputProps> = ({ placeholder, children, value, onUpdate }) => {
    const [initialValue, setNewValue] = useState(value);
    return (
        <TextField
            fullWidth
            placeholder={placeholder}
            color="secondary"
            value={initialValue}
            onChange={({ target }) => {
                if (onUpdate) {
                    onUpdate(target.value);
                }
                setNewValue(target.value);
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        {children}
                    </InputAdornment>
                ),
            }}
        />
    );
}

const UserForm: React.FC = () => {
    const [details, setDetails] = useState<{ [key: string]: string }>({
        username: "",
        password: "",
        firstName: "",
        lastName: ""
    });
    const noOfFields = Object.keys(details);
    const notAllFieldsFilled = noOfFields.filter(elem => elem !== "lastName" && !!details[elem]).length !== noOfFields.length - 1;
    const classes = useUserStyles();
    const name = !!details.firstName || !!details.lastName ? `${details.firstName} ${details.lastName}` : "";

    return (
        <form>
            <div className={classes.inputMargin} >
                <UserInput
                    value={name}
                    placeholder={messages["user.form.name"]}
                    onUpdate={name => {
                        const names = name.trim().split(" ");
                        setDetails({
                            ...details,
                            firstName: names[0],
                            lastName: names[1] || ""
                        });
                    }}
                />
            </div>
            <div className={classes.inputMargin} >
                <UserInput
                    value={details.username}
                    placeholder={messages["user.form.username"]}
                    onUpdate={username => {
                        setDetails({
                            ...details,
                            username
                        })
                    }}
                />
            </div>
            <div className={classes.inputMargin} >
                <UserInput
                    value={details.password}
                    placeholder={messages["user.form.password"]}
                    onUpdate={password => {
                        setDetails({
                            ...details,
                            password
                        })
                    }}
                />
            </div>
            <CTAButton
                className={classes.btnOverride}
                disabled={notAllFieldsFilled}
                type="submit"
                fullWidth
                size="medium"
                variant="contained"
                color="secondary"
            >
                {(notAllFieldsFilled ? "Fill in all fields" : "Send reset email")}
            </CTAButton>

        </form>
    )
};

interface DeleteModalProps {
    open: boolean;
    onClose(): void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle id="alert-dialog-title">Confirm deletion of user</DialogTitle>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Yes
          </Button>
                <Button onClick={onClose} color="primary" autoFocus>
                    Cancel
          </Button>
            </DialogActions>
        </Dialog>
    )
}

interface UserListProps {
    filter?: string;
    handleDeletion(event: any): void;
}

const UserList: React.FC<UserListProps> = ({ filter, handleDeletion }) => {
    const classes = useUserStyles();
    const { user } = useContext(LoginContext);
    const [pageNumber, setPageNumber] = useState(1);
    const groupData = useQuery({
        queryKey: "groups",
        queryFn: () => getAPI<Groups>(`/groups`, { token: user!.token })
    });
    const getUsers = useQuery({
        queryKey: [`users`, user!.group, filter],
        queryFn: () => postAPI<User>(
            '/users',
            {
                filter,
                group: user!.group > 1 ? user!.group : null,
                limit: 3,
                offset: pageNumber > 1 ? 3 * (pageNumber - 1) : null
            }, {
            token: user!.token
        }),
        enabled: Boolean(user)
    });

    const isFetching = useMemo(() => groupData.isLoading || getUsers.isLoading || getUsers.isIdle || groupData.isIdle || groupData.isFetching || getUsers.isFetching, [groupData, getUsers]);
    const isEmpty = useMemo(() => getUsers.isSuccess && groupData.isSuccess && !Boolean(getUsers.data), [getUsers]);

    return isFetching ? <LinearProgress color="secondary" /> : (
        isEmpty ? (
            <Placeholder title="No Users Found" subtitle="Add a user first">
                <NotInterestedIcon />
            </Placeholder>
        ) : (
                ((getUsers || []).data as any).map((user: Users) => (
                    <ListItem button>
                        <ListItemIcon>
                            <Avatar className={classes.avatarLarge}>{user.name.slice(0, 1)}</Avatar>
                        </ListItemIcon>
                        <ListItemText className={classes.listItem} primary={user.name} secondary={((groupData || []).data as any).filter(
                            (group: Groups) => String(user.group) === String(group.groupId))[0].name || "No Group"} />
                        <CTAButton
                            disableElevation
                            className={classes.btnOverride}
                            loading={false}
                            size="medium"
                            variant="contained"
                            color="secondary"
                            type="button">Edit</CTAButton>
                        <CTAButton loading={false}
                            disableElevation
                            className={classes.btnOverride}
                            onClick={handleDeletion}
                            size="medium"
                            variant="contained"
                            type="button">Delete</CTAButton>
                    </ListItem>
                ))
        )
    );
}

const UserPage: React.FC = () => {
    const classes = useUserStyles();
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const notAllFieldsFilled = !email;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Box>
            <Hidden mdDown>
                {/* TODO: Make generic component */}
                <Breadcrumbs className={classes.breadcrumb} separator="›" aria-label="breadcrumb">
                    <Link color="textSecondary" href="/" onClick={() => { }} className={classes.link}>
                        <FolderSVG className={classes.icon} /> HDVA
                    </Link>
                    <Link color="secondary" onClick={() => { }} className={classes.link}>{messages["user.page.title"]}</Link>
                </Breadcrumbs>
            </Hidden>
            <Hidden mdUp>
                <HeaderTitle isFixed alignText="center" color="primary" variant="h5" title={messages["user.page.title"]} />
            </Hidden>
            <Box className={classes.container}>
                <Grid className={classes.gridWidth} container spacing={2}>
                    <Grid item md={4} xs={12}>
                        <PaperReplacement
                            footer={(
                                <List component="nav" disablePadding>
                                    <UserList filter={searchTerm} handleDeletion={handleClickOpen} />
                                </List>
                            )}
                        >
                            <UserInput value={searchTerm} onUpdate={setSearchTerm} placeholder="Search for a user">
                                <SearchIcon color="secondary" />
                            </UserInput>
                            <Typography color="primary" variant="h6">{messages["user.recent.title"]}</Typography>
                        </PaperReplacement>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Grid container>
                            <Grid xs={12}>
                                <PaperReplacement title={messages["email.invite.title"]}>
                                    <blockquote>
                                        {messages["email.invite.description"]}
                                    </blockquote>
                                    <div className={classes.inputMargin} >
                                        <UserInput value={email} onUpdate={setEmail} placeholder="Enter a valid email address to send an invite" />
                                    </div>
                                    <CTAButton
                                        className={classes.btnOverride}
                                        disabled={notAllFieldsFilled}
                                        loading={false}
                                        type="submit"
                                        fullWidth
                                        size="medium"
                                        variant="contained"
                                        color="secondary"
                                    >
                                        {(notAllFieldsFilled ? "Fill in all fields" : "Send reset email")}
                                    </CTAButton>
                                </PaperReplacement>
                            </Grid>
                            <Grid xs={12} className={classes.inputMargin}>
                                <PaperReplacement title={messages["user.manual.title"]}>
                                    <UserForm />
                                </PaperReplacement>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <DeleteModal open={open} onClose={handleClose} />
        </Box >
    );
}

export default UserPage;