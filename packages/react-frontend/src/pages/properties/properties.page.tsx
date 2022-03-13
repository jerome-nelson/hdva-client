import { Box, Breadcrumbs, Button, ButtonGroup, Card, CircularProgress, Grid, Hidden, IconButton, Input, InputAdornment, Link, Paper, Typography } from "@material-ui/core";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popper from '@material-ui/core/Popper';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Skeleton from '@material-ui/lab/Skeleton';
import { CTAButton } from "components/buttons/cta";
import { HeaderTitle } from "components/header/header";
import { LoginContext } from "components/login-form/login.context";
import { Properties } from "components/property/property-table";
import { GenericTable } from "components/table/generic-table";
import { getDownload, postAPI } from "hooks/useAPI";
import { Roles } from "hooks/useRoles";
import { ReactComponent as FolderSVG } from "media/folder.svg";
import { usePropertyStyles } from "pages/properties/properties.page.style";
import React, { useContext, useEffect, useMemo, useReducer, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { convertToSlug } from "utils/auth";
import { Permissions } from "utils/permissions";

export interface Media {
  createdOn: Date;
  type?: string;
  modifiedOn: Date;
  resource: string;
  propertyId: number;
  _id: string;
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
  const anchorRef = React.useRef(null);
  const [amountTxt, updateAmount] = useReducer(reducer, initialState);
  const [errorImages, setErrorImages] = useState<any>({});
  const [loadingStates, updateLoading] = useState<Record<string, any>>({
    imageLoading: {},
    downloadSome: false,
    downloadAll: false
  });
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const location = useLocation<{ propertyName: string; propertyId: string; }>();
  const propertyFilter = decodeURIComponent(location.hash.replace(`/properties/`, ``));
  const getProperty = useQuery({
    queryKey: [location.hash],
    queryFn: () => postAPI<Properties>('/properties', {
      filter: [propertyFilter],
    }, {
      token: user!.token
    }),
    enabled: !location.state?.propertyId || !location.state?.propertyId
  })
  const [currentMedia] = useState<Record<string, any>>();
  const [propertyData, setPropertyData] = useState<any>([]);
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const [vtLink, setVTLink] = useState<any>(null);

  const defaultState = useMemo(() => {

    if (location.state?.propertyId && location.state?.propertyName) {
      return {
        propertyId: location.state.propertyId,
        propertyName: location.state.propertyName,
      }
    }

    if (getProperty.isError) {
      return {
        propertyId: undefined,
        propertyName: "Property Not Found"
      }
    }

    return {
      propertyName: location.state?.propertyName || getProperty.data?.[0].name,
      propertyId: location.state?.propertyId || getProperty.data?.[0].propertyId,
    }
  }, [getProperty, location]);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: [`media`, user!.group, defaultState.propertyId],
    queryFn: () => postAPI<any>('/get-media', {
      pids: [defaultState.propertyId],
    }, {
      token: user!.token
    }),
    enabled: Boolean(user && user.group && defaultState.propertyId)
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

  const tableStylesData = (data: any[]) => data.map(row => {

    let fileName = `${defaultState.propertyName}/${row.resource}`.replace(/ /g, "+");
    const seperator = fileName.split(".");

    return {
      type: {
        data: (
          <Paper variant="outlined" square className={classes.iconBg}>
            {errorImages[fileName] ? <BrokenImageIcon className={classes.imageIcon} color="disabled" /> : <img onError={() => {
              setErrorImages({
                ...errorImages,
                [fileName]: true
              });
            }}
              src={getThumbnailUrl(`${defaultState.propertyName}/${row.resource}`, row.type)} alt={defaultState.propertyName} />}
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
        data: (
          <Grid container style={{ textAlign: "right" }}>
            <Grid item xs={6}>
              <a href="#" onClick={async (e) => {
                e.preventDefault();
                const inQueue = {
                  ...loadingStates.imageLoading,
                  [seperator[0]]: true
                };
                updateLoading({
                  ...loadingStates,
                  imageLoading: inQueue,
                });
                const image = await postAPI<string>('/image/download', {
                  path: [`${defaultState.propertyName}/${row.resource}`],
                }, {
                  token: user!.token
                })
                await getDownload(image as unknown as string, row.resource);
                const outQueue = {
                  ...loadingStates.imageLoading,
                  [seperator[0]]: false
                };
                updateLoading({
                  ...loadingStates,
                  imageLoading: outQueue,
                });
              }}>
                {loadingStates.imageLoading[seperator[0]] ?
                  <CircularProgress size="1rem" color="secondary" />
                  :
                  <CloudDownloadOutlinedIcon />
                }
              </a>
            </Grid>
            <Grid item xs={6}>
              <Permissions showOn={[Roles.super, Roles.admin, Roles.uploader]}>
                <a href="#" onClick={async (e) => {
                  e.preventDefault();
                  const inQueue = {
                    ...loadingStates.imageLoading,
                    [seperator[0]]: true
                  };
                  updateLoading({
                    ...loadingStates,
                    imageLoading: inQueue,
                  });
                  try {
                    console.log(row, defaultState);
                    await postAPI<string>('/media/delete', {
                      type: row.type,
                      propertyId: defaultState?.propertyId,
                      resource: row.resource
                    }, {
                      token: user!.token
                    });
                  } catch (e) {
                    console.log(e);
                    alert("File Delete Error");
                  }
                  const outQueue = {
                    ...loadingStates.imageLoading,
                    [seperator[0]]: false
                  };
                  updateLoading({
                    ...loadingStates,
                    imageLoading: outQueue,
                  });
                  window.location.reload();
                }}>
                  {loadingStates.imageLoading[seperator[0]] ?
                    <CircularProgress size="1rem" color="secondary" />
                    :
                    <HighlightOffIcon />
                  }
                </a>
              </Permissions>
            </Grid>
          </Grid>
        )
      },
    }
  }
  );

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

  const isEmpty = isSuccess && !Boolean(data);

  return (
    <React.Fragment>
      <Hidden smDown>
        <Card className={classes.sidePanel} square elevation={0}>
          <Typography gutterBottom variant="h5" component="h2">
            Overview
          </Typography>
          {currentMedia ? currentMedia.title : <Skeleton className={classes.variantBG} animation={false} variant="rect" height={20} width={400} />}
          <div className={`${classes.variantBG} ${classes.photoBG}`} />
          <Grid container className={classes.containerBtns} justify="space-between">
            <Grid item xs={6}>
              <CTAButton
                onClick={async () => {
                  if (!selectedRows.length) {
                    return;
                  }
                  try {
                    updateLoading({
                      ...loadingStates,
                      downloadSome: true,
                    })
                    for (let i = 0; i < selectedRows.length; i += 1) {
                      const image = await postAPI<string>('/image/download', {
                        path: [`${defaultState.propertyName}/${propertyData[selectedRows[i]].resource}`],
                      }, {
                        token: user!.token
                      })
                      await getDownload(image as unknown as string, propertyData[selectedRows[i]].resource);
                      updateLoading({
                        ...loadingStates,
                        downloadSome: false,
                      })
                    }
                  } catch (e) {
                    updateLoading({
                      ...loadingStates,
                      downloadSome: false,
                    });
                  }
                }}
                size="medium"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!amountTxt.amount}
                loading={loadingStates.downloadSome}
                type="button">
                Download {amountTxt.txt}
              </CTAButton>
            </Grid>
            <Grid item xs={5}>
              <CTAButton
                onClick={async () => {
                  try {
                    updateLoading({
                      ...loadingStates,
                      downloadAll: true,
                    });
                    const zip = await postAPI<any>('/generate-download', {
                      pid: [defaultState.propertyId],
                    }, {
                      token: user!.token
                    })
                    await getDownload(zip as unknown as string, `${convertToSlug(defaultState.propertyName as string)}.zip`);
                    updateLoading({
                      ...loadingStates,
                      downloadAll: false,
                    });
                  }
                  catch (e) {
                    updateLoading({
                      ...loadingStates,
                      downloadAll: false,
                    });
                  }
                }}
                fullWidth
                size="medium"
                variant="contained"
                color="primary"
                loading={loadingStates.downloadAll}
                type="button">
                Download All
              </CTAButton>
            </Grid>
          </Grid>
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
              {defaultState.propertyName}
            </Link>
          </Breadcrumbs>
        </Hidden>
        <Hidden mdUp>
          <HeaderTitle isFixed alignText="center" color="primary" variant="h5" title={defaultState.propertyName} />
        </Hidden>
        {!isEmpty ? (
          <Grid container className={classes.container}>
            <Grid item xs={12} className={classes.mobileMore}>
              <Hidden mdUp>
                <ButtonGroup ref={anchorRef} variant="contained" color="primary" aria-label="Mobile Download Options">
                  <Button
                    onClick={event => {
                      setOpenSubmenu((prevOpen) => !prevOpen);
                    }}
                    color="primary"
                    size="small"
                    aria-label="Mobile Download Options"
                    aria-haspopup="menu"
                  >
                    Download Options <ArrowDropDownIcon />
                  </Button>
                </ButtonGroup>
                <Popper className={classes.popperOverrides} open={openSubmenu} anchorEl={anchorRef.current} role={undefined} placement="bottom-end" transition disablePortal>
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={() => null}>
                          <MenuList id="split-button-menu">
                            <MenuItem>

                              <CTAButton
                                onClick={async () => {
                                  if (!selectedRows.length) {
                                    return;
                                  }
                                  try {
                                    updateLoading({
                                      ...loadingStates,
                                      downloadSome: true,
                                    })
                                    for (let i = 0; i < selectedRows.length; i += 1) {
                                      const image = await postAPI<string>('/image/download', {
                                        path: [`${defaultState.propertyName}/${propertyData[selectedRows[i]].resource}`],
                                      }, {
                                        token: user!.token
                                      })
                                      await getDownload(image as unknown as string, propertyData[selectedRows[i]].resource);
                                      updateLoading({
                                        ...loadingStates,
                                        downloadSome: false,
                                      })
                                    }
                                  } catch (e) {
                                    updateLoading({
                                      ...loadingStates,
                                      downloadSome: false,
                                    });
                                  }
                                }}
                                size="medium"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={!amountTxt.amount}
                                loading={loadingStates.downloadSome}
                                type="button">
                                Download {amountTxt.txt}
                              </CTAButton>
                            </MenuItem>
                            <MenuItem>
                              <CTAButton
                                onClick={async () => {
                                  try {
                                    updateLoading({
                                      ...loadingStates,
                                      downloadAll: true,
                                    });
                                    const zip = await postAPI<any>('/generate-download', {
                                      pid: [defaultState.propertyId],
                                    }, {
                                      token: user!.token
                                    })
                                    await getDownload(zip as unknown as string, `${convertToSlug(defaultState.propertyName as string)}.zip`);
                                    updateLoading({
                                      ...loadingStates,
                                      downloadAll: false,
                                    });
                                  }
                                  catch (e) {
                                    updateLoading({
                                      ...loadingStates,
                                      downloadAll: false,
                                    });
                                  }
                                }}
                                fullWidth
                                size="medium"
                                variant="contained"
                                color="primary"
                                loading={loadingStates.downloadAll}
                                type="button">
                                Download All
                              </CTAButton>
                            </MenuItem>
                            {vtLink && (
                              <MenuItem>
                                <Grid container>
                                  <Grid item xs={12}>
                                    <Typography display="block" variant={"h6"} color="primary">
                                      Virtual Tour Link (click to copy link)
                                    </Typography>

                                  </Grid>
                                  <Grid item xs={12}>
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

                                  </Grid>
                                  <Grid className={classes.mobileVTTourLink} item xs={12}>
                                    <CTAButton
                                      type="button"
                                      fullWidth
                                      size="medium"
                                      variant="contained"
                                      color="primary"
                                      onClick={async () => {
                                        window.open(vtLink.resource, '_blank');
                                      }}>
                                      Open Virtual Tour
                                    </CTAButton>
                                  </Grid>
                                </Grid>
                              </MenuItem>)}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Hidden>
            </Grid>
            <Grid item md={7} xs={12}>
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
                data={(getProperty.isLoading || isLoading || !isSuccess) ? skeleton : tableStylesData(propertyData)}
              />
            </Grid>
          </Grid>
        ) : ""}
      </Box>
    </React.Fragment>
  );
}

export default PropertiesPage;