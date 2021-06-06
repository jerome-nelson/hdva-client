import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';

interface AlertDialogProps {
  onAccept(): void;
  showAlert?: boolean;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ showAlert, onAccept }) => {
  const [status, setStatus] = useState(Boolean(showAlert));
  return (
    <div>
      <Dialog
        open={status}
        onClose={() => {
          setStatus(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setStatus(false);
          }} color="primary">
            Disagree
          </Button>
          <Button onClick={() => {
            setStatus(false);
            onAccept();
          }} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}