import { createStyles, Grid, IconButton, makeStyles, Paper, Theme, Typography } from "@material-ui/core";
import DescriptionIcon from '@material-ui/icons/Description';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import { COLOR_OVERRIDES } from "theme";
import { bytesToSize } from "utils/conversion";

interface DragAndDropProps {
  onFiles(files: any[]): void;
  hasFiles?(uploaded: boolean): void;
  name: string;
}

export const useUploadPanelStyles = makeStyles((theme: Theme) => createStyles({
  bottomBtn: {
    position: `absolute`,
    bottom: `0`,
    margin: `${theme.spacing(1)}px 0`,
    width: `100%`
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
    border: `dashed 6px rgba(1,1,1,0.29)`,
    borderRadius: `6px`,
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

export const DragAndDrop: React.FC<DragAndDropProps> = ({ name, children, hasFiles, onFiles }) => {

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case 'SET_DROP_DEPTH':
        return { ...state, dropDepth: action.dropDepth }
      case 'SET_IN_DROP_ZONE':
        return { ...state, inDropZone: action.inDropZone };
      case 'ADD_FILE_TO_LIST':
        return { ...state, fileList: state.fileList.concat(action.files) };
      case 'REMOVE_FILE_FROM_LIST':
        return {
          ...state,
          fileList: action.files
        };
      default:
        return state;
    }
  };
  const inputFile = useRef(null);
  const [data, dispatch] = React.useReducer(
    reducer, { dropDepth: 0, inDropZone: false, fileList: [] }
  )

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
      dispatch({ type: 'SET_DROP_DEPTH', dropDepth: 0 });
      dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
    }
  }

  const removeFile = (position: number, name: any) => {
    const files = data.fileList.filter((el: any, index: number) => el.name !== name && index !== position).map((f: any) => f.name);
    dispatch({ type: 'REMOVE_FILE_FROM_LIST', files });
  }

  useEffect(() => {
    onFiles(data.fileList);
  }, [data]);

  return (
    <Paper className={classes.root} elevation={0}>
      <input type="file" accept='image/*' style={{ display: "none" }} ref={inputFile} onChange={onFieldUpdate} multiple />
      {!data.fileList.length ? (
        <Grid
          item
          className={classNames({
            [classes.uploadIcon]: true,
            [classes.dragDropZone]: true,
            "inside-drag-area": data.inDropZone
          })}
          onClick={onButtonClick}
          onDrop={e => handleDrop(e)}
          onDragOver={e => handleDragOver(e)}
          onDragEnter={e => handleDragEnter(e)}
          onDragLeave={e => handleDragLeave(e)}
        >
          {children}
          <Typography className={classes.title} display="block" variant="h3">{name}</Typography>
          <Typography className={classes.subline} display="block" variant="subtitle1">Drop your images here or <button>Click to Browse for Images</button></Typography>
          <Typography className={classes.subline} display="block" variant="subtitle2">Supports: JPEG, PNG, PDF</Typography>
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
              {data.fileList.map((f: any, index: number) => (
                <Grid container justify="space-between">
                  <Grid className={classes.txtAlign} item xs={8} key={f.name}>
                    <DescriptionIcon />
                   {f.name}
                  </Grid>
                  <Grid item xs={2} key={f.name}>
                    <IconButton
                      onClick={() => {
                        removeFile(index, f.name);
                      }}
                      aria-label="delete">
                      <HighlightOffIcon color="secondary" />
                    </IconButton>
                  </Grid>
                  <Grid className={classes.txtAlign}  item xs={12}><Typography>{bytesToSize(f.size)}</Typography></Grid>
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
              <Typography className={classes.subline} display="block" variant="subtitle1">Drop your images here or <button>Click to Browse for Images</button></Typography>
              <Typography className={classes.subline} display="block" variant="subtitle2">Supports: JPEG, PNG, PDF</Typography>
            </Grid>
          </Grid>
        )}
    </Paper>
  );
};