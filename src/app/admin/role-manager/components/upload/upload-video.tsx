import { useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
//
import Iconify from '../iconify';
//
import { UploadProps } from './types';
import RejectionFiles from './errors-rejection-files';
import Video from '../video';

// ----------------------------------------------------------------------

export default function UploadVideo({
  error,
  file,
  disabled,
  helperText,
  sx,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    disabled,
    accept: {
      'video/*': []
    },
    ...other,
  });

  const [forceRender, setForceRender] = useState<number>(Date.now());

  const hasFile = !!file;

  const hasError = isDragReject || !!error;

  const videoUrl = typeof file === 'string' ? file : file?.preview;


  useEffect(() => {
    setForceRender(Date.now());
  }, [videoUrl]);

  const renderPreview = hasFile && (
    <Video
      src={videoUrl}
      style={{ width: 150, height: 125 }}
    />
  );

  const renderPlaceholder = (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1}
      className="upload-placeholder"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        borderRadius: '10%',
        position: 'absolute',
        color: 'text.disabled',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        '&:hover': {
          opacity: 0.72,
        },
        ...(hasError && {
          color: 'error.main',
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        }),
        ...(hasFile && {
          zIndex: 9,
          opacity: 0,
          color: 'common.white',
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.64),
        }),
      }}
    >
      <Iconify icon="solar:camera-add-bold" width={32} />

      <Typography variant="caption">{file ? 'Update file' : 'Upload file'}</Typography>
    </Stack>
  );

  const renderContent = (
    <Box
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
        borderRadius: '10%',
        position: 'relative',
      }}
    >
      {renderPreview}
      {renderPlaceholder}
    </Box>
  );

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Box
          {...getRootProps()}
          sx={{
            p: 1,
            width: 244,
            height: 144,
            cursor: 'pointer',
            overflow: 'hidden',
            borderRadius: '0%',
            border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
            ...(isDragActive && {
              opacity: 0.72,
            }),
            ...(disabled && {
              opacity: 0.48,
              pointerEvents: 'none',
            }),
            ...(hasError && {
              borderColor: 'error.main',
            }),
            ...(hasFile && {
              ...(hasError && {
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              }),
              '&:hover .upload-placeholder': {
                opacity: 1,
              },
            }),
            ...sx,
          }}
        >
          <input {...getInputProps()} />

          {renderContent}
        </Box>

        <Typography sx={{ marginTop: 2, width: 1 }}>{helperText}</Typography>

      </Stack>

      <RejectionFiles fileRejections={fileRejections} />
    </>
  );
}


