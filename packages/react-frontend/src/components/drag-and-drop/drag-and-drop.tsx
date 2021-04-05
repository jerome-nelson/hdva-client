import { createStyles, Grid, IconButton, makeStyles, Paper, Theme, Typography } from "@material-ui/core";
import DescriptionIcon from '@material-ui/icons/Description';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import { COLOR_OVERRIDES } from "theme";
import { bytesToSize } from "utils/conversion";

interface DragAndDropProps {
  fileData?: any;
  onAdd(files: any[]): void;
  onRemove(files: any[]): void;
  name: string;
}

export const useUploadPanelStyles = makeStyles((theme: Theme) => createStyles({
  bottomBtn: {
    position: `absolute`,
    bottom: `0`,
    margin: `${theme.spacing(1)}px 0`,
    width: `100%`
  },
  centerVert: {
    position: `relative`,
    "& > div": {
      top: `50%`,
      left: `50%`,
      position: `absolute`,
      transform: "translate(-50%, -50%)"
    }
  },
  fileContainer: {
    padding: `12px 0`,
  },
  // TODO: Create Generic
  btnStrip: {
    overflow: "visible",
    width: "auto",
    background: "none",
    margin: 0,
    padding: 0,
    border: "none",
    cursor: "pointer",
    color: `#f01656`,
    fontWeight: `bold`,
    fontSize: `1rem`,
    textAlign: `left`,
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    lineHeight: `1.43`,
    letterSpacing: `0.01071em`,
    "&:hover": {
      textDecoration: "underline",
    }
  },
  txtAlign: {
    paddingLeft: `${theme.spacing(1)}px`,
    textAlign: "left",
  },
  root: {
    margin: `${theme.spacing(1)}px 0`,
  },
  title: {

  },
  subline: {
    margin: `0`
  },
  uploadIcon: {
    minHeight: `300px`,
    width: `420px`,
    "&:active,&:focus": {
      borderColor: `rgba(1,1,1,0.50)`,
    },
  },
  gridLine: {
    border: `1px solid ${COLOR_OVERRIDES.hdva_grey}`,
    padding: `${theme.spacing(2)}px`
  },
  fileExists: {
    textAlign: `left`,
    color: `red`,
  },
  dragDropZone: {
    cursor: `pointer`,
    border: `dashed 3px rgba(1,1,1,0.29)`,
    borderRadius: `3px`,
    position: `relative`,
    textAlign: `center`,
    "&.inside-drag-area": {
      opacity: `0.7`,
    },
  },
  droppedFiles: {
    border: `1px solid ${COLOR_OVERRIDES.hdva_grey}`,
    height: `220px`,
    overflowX: `hidden`,
    overflowY: `scroll`,
    "& ul": {
      listStyle: "none",
      margin: `0`,
      padding: `${theme.spacing(0.2)}px`
    }
  }
}));

export const DragAndDrop: React.FC<DragAndDropProps> = ({ name, children, onAdd, onRemove, fileData }) => {
  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case 'SET_DROP_DEPTH':
        return { ...state, dropDepth: action.dropDepth }
      case 'SET_IN_DROP_ZONE':
        return { ...state, inDropZone: action.inDropZone };
      case 'ADD_FILE_TO_LIST':
        const data = state.fileList.concat(action.files);
        return { ...state, fileList: data };
      case 'REMOVE_FILE_FROM_LIST':
        const { file: newFile } = action;
        const files = state.fileList.filter((el: any, index: number) => el.name !== newFile.name && index !== newFile.position);
        return {
          ...state,
          fileList: files
        };
      default:
        return state;
    }
  };
  const inputFile = useRef(null);
  const [data, dispatch] = React.useReducer(
    reducer, { dropDepth: 0, inDropZone: false, fileList: [] }
  );

  const classes = useUploadPanelStyles();
  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: 'SET_DROP_DEPTH', dropDepth: data.dropDepth + 1 });
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: 'SET_DROP_DEPTH', dropDepth: data.dropDepth - 1 });
    if (data.dropDepth > 0) return
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false })
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    e.dataTransfer.dropEffect = 'copy';
    dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true });
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    let files = [...e.dataTransfer.files];

    if (files && files.length > 0) {
      const existingFiles = data.fileList.map((f: any) => f.name)
      files = files.filter(f => !existingFiles.includes(f.name))

      dispatch({ type: 'ADD_FILE_TO_LIST', files });
      onAdd(files);
      dispatch({ type: 'SET_DROP_DEPTH', dropDepth: 0 });
      dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
    }
  };

  const onButtonClick = (e: any) => {
    if (inputFile?.current) {
      // TODO: Type correctly
      (inputFile.current as any).click();
    }
  };

  const onFieldUpdate = (e: any) => {
    let files = [...e.target.files];

    if (files && files.length > 0) {
      const existingFiles = data.fileList.map((f: any) => f.name)
      files = files.filter(f => !existingFiles.includes(f.name))

      dispatch({ type: 'ADD_FILE_TO_LIST', files });
      onAdd(files);
      dispatch({ type: 'SET_DROP_DEPTH', dropDepth: 0 });
      dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
    }
  }

  const removeFile = (position: number, name: string) => {
    const currentFile = data.fileList.filter((el: any, index: number) => el.name === name && index === position).map((f: any) => f.name);
    dispatch({
      type: 'REMOVE_FILE_FROM_LIST',
      file: {
        name: currentFile[0],
        position
      }
    });
    onRemove(currentFile[0]);
  }

  useEffect(() => { dispatch({ type: 'ADD_FILE_TO_LIST', files: fileData }); }, [fileData]);

  return (
    <Paper className={classes.root} elevation={0}>
      <input type="file" accept='image/*' style={{ display: "none" }} ref={inputFile} onChange={onFieldUpdate} multiple />
      {!Boolean(data?.fileList?.length) ? (
        <Grid
          item
          className={classNames({
            [classes.centerVert]: true,
            [classes.uploadIcon]: true,
            [classes.dragDropZone]: true,
            "inside-drag-area": data.inDropZone
          })}
          onClick={e => onButtonClick(e)}
          onDrop={e => handleDrop(e)}
          onDragOver={e => handleDragOver(e)}
          onDragEnter={e => handleDragEnter(e)}
          onDragLeave={e => handleDragLeave(e)}
        >
          <div>
            {children}
            <Typography display="block" variant="h5">{name}</Typography>
            <Typography className={classes.subline} display="block" variant="subtitle1">Drop your images here or <button className={classes.btnStrip}>Click to Browse</button></Typography>
            <Typography className={classes.subline} display="block" variant="subtitle2">Supports: JPEG, PNG, PDF</Typography>
          </div>
        </Grid>
      ) : (
          <Grid
            item
            className={classNames({
              [classes.uploadIcon]: true,
              [classes.dragDropZone]: true,
              "inside-drag-area": data.inDropZone
            })}
          >
            <Grid className={classes.droppedFiles} item>
              {[...data.fileList, ...fileData].map((f: any, index: number) => (
                <Grid key={f.name} className={classes.fileContainer} container justify="space-between">
                  <Grid className={classes.txtAlign} item xs={2} container>
                    <Grid item xs={12}><DescriptionIcon style={{ height: "100%", width: "100%" }} /></Grid>
                  </Grid>
                  <Grid className={classes.txtAlign} alignItems="center" item container xs={10}>
                    <Grid className={classes.txtAlign} item xs={10} container>
                      <Grid item xs={12}>
                        {f.name}
                      </Grid>
                      {f.size && (
                        <Grid item xs={12}>
                          <Typography>{bytesToSize(f.size)}</Typography>
                        </Grid>
                      )}
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFile(index, f.name);
                        }}
                        aria-label="delete">
                        <HighlightOffIcon color="secondary" style={{ height: "100%", width: "100%" }} />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid
              className={classes.bottomBtn}
              item
              onClick={onButtonClick}
              onDrop={e => handleDrop(e)}
              onDragOver={e => handleDragOver(e)}
              onDragEnter={e => handleDragEnter(e)}
              onDragLeave={e => handleDragLeave(e)}
            >
              <Typography className={classes.subline} display="block" variant="subtitle1">Drop your images here or <button className={classes.btnStrip}>Click to Browse</button></Typography>
              <Typography className={classes.subline} display="block" variant="subtitle2">Supports: JPEG, PNG, PDF</Typography>
            </Grid>
          </Grid>
        )}
    </Paper>
  );
};