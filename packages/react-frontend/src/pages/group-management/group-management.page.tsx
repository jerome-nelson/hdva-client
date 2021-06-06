import { Avatar, Box, Breadcrumbs, Grid, Hidden, InputAdornment, LinearProgress, Link, List, ListItem, ListItemIcon, ListItemText, OutlinedInput, Typography } from "@material-ui/core";
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import SearchIcon from '@material-ui/icons/Search';
import { CTAButton } from "components/buttons/cta";
import { HeaderTitle } from "components/header/header";
import { LoginContext } from "components/login-form/login.context";
import { CustomPagination } from "components/pagination/pagination";
import { Placeholder } from "components/placeholder/placeholder";
import { messages } from "config/en";
import { getAPI, postAPI } from "hooks/useAPI";
import { ReactComponent as FolderSVG } from "media/folder.svg";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useQueries, useQuery } from "react-query";
import { PaperReplacement } from "../user-management/user-management.page";
import { useGroupStyle } from "./group-management.page.style";


export interface Groups {
    createdOn: Date;
    description?: string;
    modifiedOn: Date;
    name: string;
    groupId: string;
    _id: string;
}

interface GroupListProps {
    isFetching: boolean;
    isEmpty: boolean;
    groupData: Groups[];
    onEdit(user: any): void;
    handleDeletion(event: any): void;
}

interface GroupInputProps {
    placeholder: string;
    value: string;
    onUpdate(value: string): void;
}

const GroupForm: React.FC<any> = ({ existingGroup }) => {
    const [details, setDetails] = useState<{ [key: string]: string }>({
        name: "",
        description: ""
    });
    const noOfFields = Object.keys(details);
    const fieldsFilled = noOfFields.filter(elem => !!details[elem]).length === noOfFields.length;
    const classes = useGroupStyle();
    const { user } = useContext(LoginContext);

    const { data: group, refetch, isLoading: groupsLoading, isSuccess } = useQuery({
        queryKey: [`group`, `add`],
        queryFn: () => postAPI<Groups>(
            '/groups/add',
            {
                name: details.name,
                description: details.description
            }, {
            token: user!.token
        }),
        enabled: false
    });

    useEffect(() => {
        if (!Object.keys(existingGroup)) {
            setDetails({
                ...existingGroup
            });
        }
    }, [existingGroup]);

    useEffect(() => {
        if (isSuccess) {
            setDetails({
                name: "",
                description: ""
            });
        }
    }, [isSuccess]);

    return (
        <form onSubmit={async (event) => {
            event.preventDefault();
            refetch();
        }}>
            <div className={classes.inputMargin} >
                <GroupInput
                    value={details.name}
                    placeholder={messages["group.form.name"]}
                    onUpdate={name => {
                        setDetails({
                            ...details,
                            name
                        });
                    }}
                />
            </div>
            <div className={classes.inputMargin} >
                <GroupInput
                    value={details.description}
                    placeholder={messages["group.form.description"]}
                    onUpdate={description => {
                        setDetails({
                            ...details,
                            description
                        })
                    }}
                />
            </div>
            <CTAButton
                loading={groupsLoading}
                className={classes.btnOverride}
                disabled={!fieldsFilled}
                type="submit"
                fullWidth
                size="medium"
                variant="contained"
                color="secondary"
            >
                {(!fieldsFilled ? "Fill in all fields" : "Update group")}
            </CTAButton>

        </form>
    )
};


// TODO: make generic component
const GroupInput: React.FC<GroupInputProps> = ({ placeholder, children, value, onUpdate }) => {
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

const GroupList: React.FC<GroupListProps> = ({ onEdit, isFetching, isEmpty, groupData, handleDeletion }) => {
    const classes = useGroupStyle();
    return isFetching ? <LinearProgress color="secondary" /> : (
        isEmpty ? (
            <Placeholder title="No Users Found" subtitle="Add a user first">
                <NotInterestedIcon />
            </Placeholder>
        ) : (
                <React.Fragment>
                    <div>
                        {(groupData.map((group: Groups) => (
                            <ListItem key={group.groupId} button>
                                <ListItemIcon>
                                    <Avatar className={classes.avatarLarge}>{group.name.slice(0, 1)}</Avatar>
                                </ListItemIcon>
                                <ListItemText className={classes.listItem} primary={group.name} secondary={group.description} />
                                {/* <CTAButton
                                    onClick={() => {
                                        onEdit({
                                            name: group.name,
                                            description: group.description,
                                        });
                                    }}
                                    className={classes.btnOverride}
                                    size="medium"
                                    variant="contained"
                                    color="secondary"
                                    type="button">Edit</CTAButton> */}
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

const GroupPage: React.FC = () => {
    const show = 4;
    const [pageNumber, setPageNumber] = useState(1);
    const { user } = useContext(LoginContext);
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [groupData, setGroupData] = useState<any>({});
    const [searchTerm, setSearchTerm] = useState("");
    const results = useQueries([
        {
            queryKey: "groups",
            queryFn: () => getAPI<Groups>(`/groups`, { token: user!.token }),
            enabled: Boolean(user)
        },
        {
            queryKey: [`group`, `filter`, user!.group, 'total'],
            queryFn: () => postAPI<number>(
                '/group-count',
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
    const classes = useGroupStyle();
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
                    <Link color="secondary" onClick={() => { }} className={classes.link}>{messages["group-management.title"]}</Link>
                </Breadcrumbs>
            </Hidden>
            <Hidden mdUp>
                <HeaderTitle isFixed alignText="center" color="primary" variant="h5" title={messages["group-management.title"]} />
            </Hidden>
            <Box className={classes.container}>
                <Grid className={classes.gridWidth} container spacing={2}>
                    <Grid item md={5} xs={12}>
                        <PaperReplacement
                            footer={(
                                <List component="nav" disablePadding>
                                    <GroupList
                                        isFetching={isFetching}
                                        isEmpty={isEmpty}
                                        groupData={results[0].data as any}
                                        handleDeletion={handleClickOpen}
                                        onEdit={setGroupData}
                                    />
                                </List>
                            )}
                        >
                            <Grid item xs={12}>
                                <Typography gutterBottom variant="h6" component="h6">Search for Groups</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <GroupInput value={searchTerm} onUpdate={setSearchTerm} placeholder="Search for a group">
                                    <SearchIcon color="secondary" />
                                </GroupInput>
                            </Grid>
                            <Typography color="primary" variant="h6">{messages["group.recent.title"]}</Typography>
                        </PaperReplacement>
                        {!isFetching && !isEmpty && (
                            <CustomPagination
                                count={Math.floor((results[1].data as unknown as number) / show)}
                                onChange={pagenumber => { setPageNumber(pagenumber) }}
                            />
                        )}
                    </Grid>
                    <Grid item md={5} xs={12}>
                        <Grid container>
                            <Grid item xs={12}>
                                <PaperReplacement title={messages["group.manual.title"]}>
                                    <GroupForm existingGroup={groupData} />
                                </PaperReplacement>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default GroupPage;