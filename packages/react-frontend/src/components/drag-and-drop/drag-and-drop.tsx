import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import { COLOR_OVERRIDES } from "theme";

interface DragAndDropProps {
  onFiles(files: any[]): void;
  hasFiles?(uploaded: boolean): void;
}

export const useUploadPanelStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    margin: `${theme.spacing(1)}px 0`,
  },
  uploadIcon: {
    border: `dotted 4px #000`,
    padding: `${theme.spacing(1)}px`,
    width: `30%`,
    "& .MuiSvgIcon-root svg g": {
      backgroundColor: "red"
    },
    "& .MuiSvgIcon-root svg path": {
      backgroundColor: "red"
    }
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
    padding: `2rem`,
    textAlign: `center`,
    "&.inside-drag-area": {
      opacity: `0.7`,
    },
  },
  droppedFiles: {
    border: `1px solid ${COLOR_OVERRIDES.hdva_grey}`,
    maxHeight: `200px`,
    overflowX: "hidden",
    overflowY: "scroll",
    "& ul": {
      listStyle: "none",
      margin: `0`,
      padding: `${theme.spacing(0.2)}px`
    }
  }
}));

export const DragAndDrop: React.FC<DragAndDropProps> = ({ children, hasFiles, onFiles }) => {

  const reducer = (state: any, action: any) => {
    switch (action.type) {
      case 'SET_DROP_DEPTH':
        return { ...state, dropDepth: action.dropDepth }
      case 'SET_IN_DROP_ZONE':
        return { ...state, inDropZone: action.inDropZone };
      case 'ADD_FILE_TO_LIST':
        return { ...state, fileList: state.fileList.concat(action.files) };
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

  useEffect(() => {
    onFiles(data.fileList);
  }, [data]);

  return (
    <Grid container className={classes.root} spacing={1}>
      <input type="file" accept='image/*' style={{ display: "none" }} ref={inputFile} onChange={onFieldUpdate} multiple />
      <Grid
        item
        xs={data.fileList.length > 0 ? 5 : 12}
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
      </Grid>
      {data.fileList.length > 0 && (<Grid className={classes.droppedFiles} item xs>
        <ul>
          {data.fileList.map((f: any) => {
            return (
              <li key={f.name}>{f.name}</li>
            )
          })}
        </ul>
      </Grid>)}
    </Grid>
  );
};