import { Box, Breadcrumbs, Card, Grid, Hidden, IconButton, Input, InputAdornment, Link, Paper, Typography } from "@material-ui/core";
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Skeleton from '@material-ui/lab/Skeleton';
import { CTAButton } from "components/buttons/cta";
import { HeaderTitle } from "components/header/header";
import { LoginContext } from "components/login-form/login.context";
import { GenericTable } from "components/table/generic-table";
import { getDownload, postAPI } from "hooks/useAPI";
import { ReactComponent as FolderSVG } from "media/folder.svg";
import { usePropertyStyles } from "pages/properties/properties.page.style";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { convertToSlug } from "utils/auth";

interface Media {

}

interface PropertyProps {
  propertyName: string;
}

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

const initialState = {
  amount: 0,
  txt: "Images"
}
function reducer(_: Record<string, any>, action: { amount: number }) {
  const amount = action.amount;
  return amount > 0 ? {
    amount,
    txt: "Images"
  } : {
      amount,
      ...initialState
    };
}

const PropertiesPage: React.SFC<PropertyProps> = () => {
  const { user } = useContext(LoginContext);
  const classes = usePropertyStyles();
  const [amountTxt, updateAmount] = useReducer(reducer, initialState);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const location = useLocation<{ propertyName: string; propertyId: string; }>();
  const [currentMedia] = useState<Record<string, any>>();
  const [propertyData, setPropertyData] = useState<any>([]);
  const [vtLink, setVTLink] = useState<any>(null);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [`properties`, user!.group, location.state.propertyId],
    queryFn: () => postAPI<any>('/get-media', {
      pids: [location.state.propertyId],
    }, {
      token: user!.token
    }),
    enabled: Boolean(user && user.group && location.state.propertyId)
  });

  useEffect(() => {
      if (!data?.length) {
        return;
      }

      const nonVt = data.filter((el: any) => el.type !== "vt");
      const vt = data.filter((el: any) => el.type === "vt");
      setPropertyData(nonVt);
      setVTLink(vt[0]);
  }, [data]);

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
        data: <CloudDownloadOutlinedIcon onClick={async () => {
          const image = await postAPI<string>('/image/download', {
            path: [`${location.state.propertyName}/${row.resource}`],
          }, {
            token: user!.token
          })
          await getDownload(image as unknown as string, row.resource);
        }} />
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
    <React.Fragment>
      <Hidden smDown>
        <Card className={classes.sidePanel} square elevation={0}>
          <Typography gutterBottom variant="h5" component="h2">
            Overview
        </Typography>
          {currentMedia ? currentMedia.title : <Skeleton className={classes.variantBG} animation={false} variant="rect" height={20} width={400} />}
          <div className={`${classes.variantBG} ${classes.photoBG}`} />
          <CTAButton
            onClick={async () => {
              if (!selectedRows.length) {
                return;
              }
              for (let i = 0; i < selectedRows.length; i += 1) {
                const image = await postAPI<string>('/image/download', {
                  path: [`${location.state.propertyName}/${propertyData[selectedRows[i]].resource}`],
                }, {
                  token: user!.token
                })
                await getDownload(image as unknown as string, propertyData[selectedRows[i]].resource);
              }
            }}
            size="medium"
            variant="contained"
            color="primary"
            disabled={!amountTxt.amount}
            loading={false}
            type="button">
            Download {amountTxt.txt}
          </CTAButton>

          {vtLink && (
            <React.Fragment>
              <div className={classes.inputTest}>
                <Typography display="block" variant={"h6"} color="primary">
                  Virtual Tour Link (click to copy link)
              </Typography>
                <Input

                  disabled
                  color="secondary"
                  fullWidth={true}
                  id="standard-adornment-password"
                  type='text'
                  value={vtLink.resource}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          navigator.clipboard.writeText(vtLink.resource);
                        }}
                      >
                        <FileCopyIcon color="secondary" />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </div>
            </React.Fragment>
          )}

        </Card>
      </Hidden>
      <Box>
        <Hidden mdDown>
          <Breadcrumbs className={classes.breadcrumb} separator="›" aria-label="breadcrumb">
            <Link color="textSecondary" href="/" onClick={() => { }} className={classes.link}>
              <FolderSVG className={classes.icon} />
          HDVA
          </Link>
            <Link color="textSecondary" href="/properties" onClick={() => { }} className={classes.link}>
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
        <Grid container className={classes.container}>
          <Grid item md={7} xs={12}>
            <CTAButton
              onClick={async () => {
                const zip = await postAPI<any>('/generate-download', {
                  pid: [location.state.propertyId],
                }, {
                  token: user!.token
                })
                await getDownload(zip as unknown as string, `${convertToSlug(location.state.propertyName)}.zip`);
              }}
              size="medium"
              variant="contained"
              color="primary"
              loading={false}
              type="button">
              Download All
          </CTAButton>
            {propertyData && (
              <GenericTable
                selectable
                onSelect={items => {
                  setSelectedRows(items);
                  updateAmount({ amount: items.length })
                }}
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
    </React.Fragment>
  );
}

export default PropertiesPage;