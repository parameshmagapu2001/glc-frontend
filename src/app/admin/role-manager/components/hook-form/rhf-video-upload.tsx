import { useFormContext, Controller } from 'react-hook-form';
// @mui
import FormHelperText from '@mui/material/FormHelperText';
//
import { UploadProps } from '../upload';
import UploadVideo from '../upload/upload-video';

// ----------------------------------------------------------------------

interface Props extends Omit<UploadProps, 'file'> {
  name: string;
  multiple?: boolean;
}

// ----------------------------------------------------------------------

export function RHFVideoUpload({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadVideo error={!!error} file={field.value} {...other} />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

