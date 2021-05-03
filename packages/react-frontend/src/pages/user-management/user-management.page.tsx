import { Avatar, Box, Breadcrumbs, Button, Dialog, DialogActions, DialogTitle, Grid, Hidden, InputAdornment, LinearProgress, Link, List, ListItem, ListItemIcon, ListItemText, MenuItem, OutlinedInput, Paper, Select, Typography } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import SearchIcon from '@material-ui/icons/Search';
import { CTAButton } from "components/buttons/cta";
import { BootstrapInput } from "components/input-bootstrap/bootstrap.input";
import { LoginContext } from "components/login-form/login.context";
import { CustomPagination } from "components/pagination/pagination";
import { Placeholder } from "components/placeholder/placeholder";
import { getAPI, postAPI } from "hooks/useAPI";
import { RoleAPI, Roles } from "hooks/useRoles";
import { ReactComponent as FolderSVG } from "media/folder.svg";
import { Groups } from "pages/group-management/group-management.page";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useQueries, useQuery } from "react-query";
import { User } from "services/auth.service";
import { HeaderTitle } from "../../components/header/header";
import { messages } from "../../config/en";
import { useUserStyles } from "./user-management.page.style";

interface UserInputProps {
    placeholder: string;
    value: string;
    onUpdate(value: string): void;
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
export const PaperReplacement: React.FC<PaperReplacementProps> = ({ children, title, footer }) => {
    const classes = useUserStyles();
    return (
        <Paper>
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
    return (
        <OutlinedInput
            fullWidth
            placeholder={placeholder}
            color="secondary"
            value={value}
            onChange={({ target }) => {
                onUpdate(target.value);
            }}
            endAdornment={
                <InputAdornment position="end">
                    <SearchIcon />
                </InputAdornment>
            }
        />
    );
}

const UserForm: React.FC<any> = ({ existingUser }) => {
    const [details, setDetails] = useState<{ [key: string]: string }>({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        groupId: "",
        roleId: "",
    });
    const noOfFields = Object.keys(details);
    const notAllFieldsFilled = noOfFields.filter(elem => elem !== "lastName" && !!details[elem]).length !== noOfFields.length - 1;
    const classes = useUserStyles();
    const name = !!details.firstName || !!details.lastName ? `${details.firstName} ${details.lastName}` : "";
    const { user } = useContext(LoginContext);
    const { data: groupData, isLoading: groupsLoading } = useQuery({
        queryKey: "groups",
        queryFn: () => getAPI<Groups>(`/groups`, { token: user!.token })
    });

    const { data: roleData, isLoading: rolesIsLoading } = useQuery({
        queryKey: "roles",
        queryFn: () => getAPI<RoleAPI>("/roles", {
            token: user?.token
        }),
        enabled: Boolean(user?.token)
    });

    const { data: registration, refetch, isLoading: registrationLoading, isSuccess } = useQuery({
        queryKey: [`register`],
        queryFn: () => postAPI<User>(
            '/register',
            {
                group: details.groupId,
                name: name,
                role: details.roleId,
                email: details.username,
                password: details.password,
            }, {
            token: user!.token
        }),
        enabled: false
    });

    useEffect(() => {
        if (existingUser) {
            setDetails({
                password: "",
                ...existingUser
            });
        }
    }, [existingUser]);

    useEffect(() => {
        if (isSuccess) {
            setDetails({
                username: "",
                password: "",
                firstName: "",
                lastName: "",
                groupId: "",
                roleId: ""
            });
        }
    }, [isSuccess]);

    return (groupsLoading || rolesIsLoading) ? <LinearProgress color="secondary" /> : (
        <form onSubmit={async (event) => {
            event.preventDefault();
            refetch();
        }}>
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
            <div className={classes.inputMargin}>
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
            <div className={classes.inputMargin}>
                <Select
                    color="primary"
                    value={Number(details.groupId) || 0}
                    onChange={({ target }) => {
                        setDetails({
                            ...details,
                            groupId: target.value as string
                        });
                    }}
                    input={<BootstrapInput />}
                    IconComponent={ExpandMoreIcon}
                    label="Add User to Group"
                >
                    {(groupData || []).map((val: any) => (<MenuItem key={val.groupId} value={val.groupId}>{val.name}</MenuItem>))}
                </Select>

            </div>
            <div className={classes.inputMargin}>
                <Select
                    color="primary"
                    value={Number(details.roleId) || 0}
                    onChange={({ target }) => {
                        setDetails({
                            ...details,
                            roleId: target.value as string
                        });
                    }}
                    input={<BootstrapInput />}
                    IconComponent={ExpandMoreIcon}
                    label="Add User to Role"
                >
                    {(roleData || []).map((val: RoleAPI) => (<MenuItem key={val.id} value={val.id}>{Roles[val.rolename]}</MenuItem>))}
                </Select>

            </div>
            <CTAButton
                loading={registrationLoading}
                className={classes.btnOverride}
                disabled={notAllFieldsFilled}
                type="submit"
                fullWidth
                size="medium"
                variant="contained"
                color="secondary"
            >
                {(notAllFieldsFilled ? "Fill in all fields" : "Update user")}
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
    isFetching: boolean;
    isEmpty: boolean;
    userData: Users[];
    groupData: Groups[];
    onEdit(user: any): void;
    handleDeletion(event: any): void;
}

const UserList: React.FC<UserListProps> = ({ onEdit, isFetching, isEmpty, userData, groupData, handleDeletion }) => {
    const classes = useUserStyles();
    return isFetching ? <LinearProgress color="secondary" /> : (
        isEmpty ? (
            <Placeholder title="No Users Found" subtitle="Add a user first">
                <NotInterestedIcon />
            </Placeholder>
        ) : (
                <React.Fragment>
                    <div>
                        {(userData.map((user: Users) => (
                            <ListItem key={user.userId} button>
                                <ListItemIcon>
                                    <Avatar className={classes.avatarLarge}>{user.name.slice(0, 1)}</Avatar>
                                </ListItemIcon>
                                <ListItemText className={classes.listItem} primary={user.name} secondary={(groupData.filter(
                                    (group: Groups) => String(user.group) === String(group.groupId))[0].name || "No Group")} />
                                <CTAButton
                                    onClick={() => {
                                        const names = user.name.split(" ");
                                        onEdit({
                                            firstName: names[0],
                                            lastName: names[1] || "",
                                            groupId: user.group,
                                            roleId: user.role,
                                            username: user.email,
                                        });
                                    }}
                                    className={classes.btnOverride}
                                    loading={false}
                                    size="medium"
                                    variant="contained"
                                    color="secondary"
                                    type="button">Edit</CTAButton>
                                {/* <CTAButton
                                    loading={false}
                                    className={classes.btnOverride}
                                    onClick={handleDeletion}
                                    size="medium"
                                    variant="contained"
                                    type="button">Delete</CTAButton> */}
                            </ListItem>
                        )))}
                    </div>
                </React.Fragment>
            ));
}

const UserPage: React.FC = () => {
    const show = 4;
    const [pageNumber, setPageNumber] = useState(1);
    const { user } = useContext(LoginContext);
    const classes = useUserStyles();
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [userData, setUserData] = useState<any>({});
    const [searchTerm, setSearchTerm] = useState("");
    const results = useQueries([
        {
            queryKey: "groups",
            queryFn: () => getAPI<Groups>(`/groups`, { token: user!.token }),
            enabled: Boolean(user)
        },
        {
            queryKey: [`users`, user!.group, searchTerm],
            queryFn: () => postAPI<User>(
                '/users',
                {
                    filter: searchTerm,
                    group: user!.group > 1 ? user!.group : null,
                    limit: 3,
                    offset: pageNumber > 1 ? 3 * (pageNumber - 1) : null
                }, {
                token: user!.token
            }),
            enabled: Boolean(user)
        },
        {
            queryKey: [`users`, `filter`, user!.group, 'total'],
            queryFn: () => postAPI<number>(
                '/users-count',
                {
                    filter: searchTerm,
                    group: user!.group > 1 ? user!.group : null
                },
                { token: user!.token }
            ),
            refetchOnMount: "always",
            retry: 3,
            enabled: Boolean(user)
        }
    ]);
    const isFetching = useMemo(
        () => results.reduce((state, curr) =>
            (state ? state : curr.isLoading || curr.isIdle || curr.isFetching),
            false),
        [results]);
    const isEmpty = useMemo(() =>
        results.reduce((state, curr) =>
            (state ? state : curr.isSuccess && !Boolean(curr.data)),
            false),
        [results]);

    const notAllFieldsFilled = !email;
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return <Box>
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
                <Grid item md={5} xs={12}>
                    <PaperReplacement
                        footer={(
                            <List component="nav" disablePadding>
                                <UserList
                                    isFetching={isFetching}
                                    isEmpty={isEmpty}
                                    userData={results[1].data as any}
                                    groupData={results[0].data as any}
                                    handleDeletion={handleClickOpen}
                                    onEdit={setUserData}
                                />
                            </List>
                        )}
                    >
                        <Grid item xs={12}>
                            <Typography gutterBottom variant="h6" component="h6">Search user pages</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <UserInput value={searchTerm} onUpdate={setSearchTerm} placeholder="Search for a user">
                                <SearchIcon color="secondary" />
                            </UserInput>
                        </Grid>
                        <Typography color="primary" variant="h6">{messages["user.recent.title"]}</Typography>
                    </PaperReplacement>
                    {!isFetching && !isEmpty && (
                        <CustomPagination
                            count={Math.floor((results[2].data as unknown as number) / show)}
                            onChange={pagenumber => { setPageNumber(pagenumber) }}
                        />
                    )}
                </Grid>
                <Grid item md={5} xs={12}>
                    <Grid container>
                        <Grid item xs={12}>
                            <PaperReplacement title={messages["user.manual.title"]}>
                                <UserForm existingUser={userData} />
                            </PaperReplacement>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
        <DeleteModal open={open} onClose={handleClose} />
    </Box >;
}

export default UserPage;