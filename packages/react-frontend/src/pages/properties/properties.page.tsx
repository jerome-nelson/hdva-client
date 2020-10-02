import React from "react";
import { Typography, Breadcrumbs } from "@material-ui/core";
import Link from '@material-ui/core/Link';
import { useLocation } from "react-router-dom";
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

export const PropertiesPage: React.SFC = () => {
    const location = useLocation();


    // const [value, setValue] = React.useState(0);
    // const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    //     setValue(newValue);
    // };

    return (
        <React.Fragment>
            {/* <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="/">
                    Home
                </Link>
                <Link
                    color="textPrimary"
                    href={location.pathname}
                    aria-current="page"
                >
                    { title }
                </Link>
            </Breadcrumbs> */}
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