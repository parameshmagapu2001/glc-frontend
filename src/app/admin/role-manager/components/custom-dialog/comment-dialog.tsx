import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  content: string;
  title: string;
  btnTitle?: string;
  onSubmit?: (val: any) => void;
  submitButtonStatus: boolean
  readonlyStatus: boolean
  comment?: string;
}

function CommentDialog({ open, title, content, btnTitle, onSubmit, onClose,
  submitButtonStatus,readonlyStatus, comment }: Props) {
  const [value, setValue] = useState(comment || '');

  const handleSubmit = async () => {
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 2, textAlign: 'center' }}>{title}</DialogTitle>

      {content && (
        <DialogContent sx={{ typography: 'body2' }}>
          <Typography mb="10px">{content}</Typography>
          <TextareaAutosize
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #8280FF',
              borderRadius: '5px',
            }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            minRows={8}
            readOnly={readonlyStatus}
            placeholder={content}
          />
        </DialogContent>
      )}

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>
        {submitButtonStatus &&<Button variant="contained" color="primary" onClick={handleSubmit}>
        {btnTitle || 'Cancel'}
        </Button>}
      </DialogActions>
    </Dialog>
  );
}

export default CommentDialog;
