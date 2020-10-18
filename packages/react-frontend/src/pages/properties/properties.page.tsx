import React from "react";
import { Typography, Breadcrumbs, CircularProgress } from "@material-ui/core";
import Link from '@material-ui/core/Link';
import { useLocation, useHistory } from "react-router-dom";
import { getCurrentUser } from "services/auth.service";
import { useAPI } from "hooks/useAPI";
import { usePropertyStyles } from "./properties.page.style";
import { CustomTable } from "components/table/custom-table";
// import HelpIcon from '@material-ui/icons/Help';
// import SettingsIcon from '@material-ui/icons/Settings';
// import { HeaderTitle } from "../../components/header/header";
// import { Tabs, Tab, Button } from "@material-ui/core";

// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';

// interface TabPanelProps {
//     children?: React.ReactNode;
//     index: any;
//     value: any;
// }

// function TabPanel(props: TabPanelProps) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`simple-tabpanel-${index}`}
//             aria-labelledby={`simple-tab-${index}`}
//             {...other}
//         >
//             {value === index && (
//                 <Box p={3}>
//                     <Typography>{children}</Typography>
//                 </Box>
//             )}
//         </div>
//     );
// }

// function a11yProps(index: any) {
//     return {
//         id: `simple-tab-${index}`,
//         'aria-controls': `simple-tabpanel-${index}`,
//     };
// }

type Property = Record<string, string>;

interface PropertyProps {
    propertyName: string;
}

export const PropertiesPage: React.SFC<PropertyProps> = ({ propertyName }) => {
    const user = getCurrentUser();
    const history = useHistory();
    const classes = usePropertyStyles();
    const location = useLocation();
    // TODO: Map API to use names as well (no more state) - or instead add as custom headers
    // TODO: Add localstorage caching for textual data
    const [properties,] = useAPI<Record<string, any>>(`/properties/${user.group}/${(location.state as any).propertyId}`, {
        extraHeaders: {
            'Authorization': user.token
        }
    });

    const [images,] = useAPI(`/files/${(location.state as any).propertyId}`, {
        extraHeaders: {
            'Authorization': user.token
        }
    });

    // const [value, setValue] = React.useState(0);
    // const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    //     setValue(newValue);
    // };
    const headCells: any[] = [
        { id: 'image', label: "" },
        { id: 'name', numeric: false, disablePadding: false, label: "Name" },
        { id: 'modified', numeric: true, disablePadding: false, label: 'Uploaded' },
        { id: 'options', numeric: true, disablePadding: false, label: "" },
        { id: 'test', numeric: true, disablePadding: false, label: "" },
    ];

    // TODO: Make smaller images

    return properties.data.length <= 0 || images.data.length <= 0 ? <CircularProgress size="1.5rem" color="secondary" /> : (
        <React.Fragment>
            <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
                <Link color="inherit" href="/">
                    Home
                </Link>
                <Link color="inherit" href="/properties">
                    Properties
                </Link>
                <Link
                    color="textPrimary"
                    href={location.pathname}
                    aria-current="page"
                >
                    {properties.data[0].name}
                </Link>
            </Breadcrumbs>

            <CustomTable user={user} headers={headCells} data={(images.data as any).files.map((image: any) => ({
                image: <img src={`//localhost:3001/image/${image.filename}`} width="40" height="40" />,
                name: image.filename,
                modifiedOn: image.uploadDate,
                options: ""
            }))} />


            {/* { isEmpty && <Typography classKey="h1">Empty</Typography>}
            <form
                action="http://localhost:3001/uploads"
                method="POST"
                encType="multipart/form-data">
                    <input type="hidden" name="pid" value="2" />
            </form> */}
            {/* <div>
                <HelpIcon />
                <SettingsIcon />
            </div>

            <HeaderTitle title="Property Name" />
            <sub>Updated 3 days ago</sub>

            <div>
                <Button variant="contained" color="primary">Download All</Button>
            </div>
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                <Tab label="Floorplan" {...a11yProps(0)} />
                <Tab label="Photos" {...a11yProps(1)} />
                <Tab label="Virtual Tour" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                Item One
      </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
      </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
      </TabPanel> */}
        </React.Fragment>
    );
}