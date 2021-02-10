import { Box, Breadcrumbs, Grid, Hidden, Link, Paper, Typography } from "@material-ui/core";
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import Skeleton from '@material-ui/lab/Skeleton';
import { HeaderTitle } from "components/header/header";
import { LoginContext } from "components/login-form/login.context";
import { GenericTable } from "components/table/generic-table";
import { postAPI } from "hooks/useAPI";
import { ReactComponent as FolderSVG } from "media/folder.svg";
import { usePropertyStyles } from "pages/properties/properties.page.style";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";

interface Media {

}

interface PropertyProps {
  propertyName: string;
}

// const initialState = {
//   photo: [],
//   floorplan: [],
//   vt: ""
// };

// function mediaReducer(state, action) {
//   switch (action.type) {
//     case 'increment':
//       return {count: state.count + 1};
//     case 'decrement':
//       return {count: state.count - 1};
//     default:
//       throw new Error();
//   }
// }

// TODO: Type correctly
// const getMediaIcon = (type: string) => {
// if (type === "floorplan") {
//   return <FloorplanSVG />
// }

// if (type === "photo") {
//   return <PhotoSVG />;
// }
// }

const getThumbnailUrl = (url: string, type: string): string => {
  let fileName = url.replace(/ /g, "+");
  const seperator = fileName.split(".");
  if (type === "floorplan") {
    fileName = `${seperator[0]}-500x350.${seperator[1]}`;
  }

  if (type === "photo") {
    fileName = `${seperator[0]}-35x35.${seperator[1]}`;
  }

  return `${process.env.REACT_APP_IMG}/${fileName}`;
}



export const PropertiesPage: React.SFC<PropertyProps> = () => {
  const { user } = useContext(LoginContext);
  const classes = usePropertyStyles();
  const location = useLocation<{ propertyName: string; propertyId: string; }>();
  const [propertyData, setPropertyData] = useState<any>([]);

  const { isLoading, isSuccess} = useQuery({
    queryKey: [`properties`, user!.group, location.state.propertyId],
    queryFn: () => postAPI<any>('/get-media', {
      pids: [location.state.propertyId],
    }, {
      token: user!.token
    }),
    select: setPropertyData,
    enabled: Boolean(user && user.group && location.state.propertyId)
  });

  const tableStylesData = (data: any[]) => data.map(row => (
    {
      type: {
        data: (
          <Paper variant="outlined" square className={classes.iconBg}>
            <img src={getThumbnailUrl(`${location.state.propertyName}/${row.resource}`, row.type)} alt={location.state.propertyName} />
          </Paper>
        )
      },
      name: {
        data: <Typography noWrap>{row.resource}</Typography>
      },
      modified: {
        data: <Typography noWrap>{new Date(row.modifiedOn).toDateString()}</Typography>
      },
      extra: {
        data: <CloudDownloadOutlinedIcon />
      },
    }
  ));

  const cells = [{
    className: classes.iconTableCell
  }];

  const sample = {
    image: {
        data: <Skeleton variant="rect" animation="wave" height={50} width={50} />
    },
    name: {
        data: <Skeleton variant="rect" animation="wave" height={25} width={540} />
    },
    group: {
      data: <Skeleton variant="rect" animation="wave" height={25} width={165} />
    },
    dateUpdate: {
        data: <Skeleton variant="rect" animation="wave" height={25} width={25} />
    },
};
const skeleton = [
    sample,
    sample,
    sample,
    sample
];

  return (
    <Box>
      <Hidden mdDown>
        <Breadcrumbs className={classes.breadcrumb} separator="›" aria-label="breadcrumb">
          <Link color="textSecondary" href="/" onClick={() => { }} className={classes.link}>
            <FolderSVG className={classes.icon} />
          HDVA
          </Link>
          <Link color="textSecondary" href="/" onClick={() => { }} className={classes.link}>
            Properties
          </Link>
          <Link color="secondary" href="/" onClick={() => { }} className={classes.link}>
            {location.state.propertyName}
          </Link>
        </Breadcrumbs>
      </Hidden>
      <Hidden mdUp>
        <HeaderTitle isFixed alignText="center" color="primary" variant="h5" title={location.state.propertyName} />
      </Hidden>
      <Grid container>
        <Grid item xs={7}>
          {propertyData && (
            <GenericTable
              selectable
              head={[
                { name: "Name", className: classes.tableHeadCell, colSpan: 2 },
                { name: "Modified", className: classes.tableHeadCell, colSpan: 2 }
              ]}
              cells={cells}
              data={(isLoading || !isSuccess) ? skeleton : tableStylesData(propertyData)}
            />
          )}
        </Grid>
      </Grid>
    </Box>

  );
}