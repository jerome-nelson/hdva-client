import { Box, Tab, Tabs, Typography } from "@material-ui/core";
import BurstModeIcon from '@material-ui/icons/BurstMode';
import CameraIcon from '@material-ui/icons/Camera';
import ImageIcon from '@material-ui/icons/Image';
import React from "react";
import { FullScreen } from "../../components/fullscreen/fullscreen";

type Property = Record<string, string>;

interface PropertyProps {
    propertyName: string;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
  }

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  } 

export const PropertiesPage: React.SFC<PropertyProps> = () => {
    const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
    // TODO: Map API to use names as well (no more state) - or instead add as custom headers
    // TODO: Add localstorage caching for textual data


    return (
        <React.Fragment>
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                <Tab icon={<BurstModeIcon />} />
                <Tab icon={<CameraIcon />} />
                <Tab icon={<ImageIcon />} />
            </Tabs>
            <TabPanel value={value} index={0} {...a11yProps(0)}>
                Photos
            </TabPanel>
            <TabPanel value={value} index={1} {...a11yProps(1)}>
                <FullScreen>
                    Virtual Tour
                </FullScreen>
            </TabPanel>
            <TabPanel value={value} index={2} {...a11yProps(2)}>
                Floorplan
            </TabPanel>
        </React.Fragment>
    );
}