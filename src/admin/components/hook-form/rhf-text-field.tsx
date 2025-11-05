'use client';

import { Controller, useFormContext } from 'react-hook-form';
// @mui
import TextField, { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

export default function RHFTextField({ name, helperText, type, ...other }: Props) {
  
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={type === 'number' && field.value === 0 ? '' : field.value}
          onChange={(event) => {
            let value = event.target.value;
            if (name === 'mobile_number') {
              const onlyNums = value.replace(/\D/g, '').slice(0, 10);
              field.onChange(onlyNums);
            } 
            else if ( name === 'aadhar_number'){
              const onlyNums = value.replace(/\D/g, '').slice(0, 12);
              field.onChange(onlyNums);
            }
            else if (name === 'pan_number') {
              value = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
              field.onChange(value);
            }
            else if (name === 'firstName' || name === 'lastName' || name === 'first_name' || name === 'last_name') {
              value = value.replace(/[^A-Za-z\s]/g, ''); // Only letters and space
              field.onChange(value);
            }
            else if (name === 'region_name' || name === 'sub_region_tags'  || name === 'area_name'  ||  name === 'sub_area_tags') {
              value = value.replace(/[^A-Za-z\s]/g, '');
              field.onChange(value);
            }
            else if (type === 'number') {
              field.onChange(Number(value));
            } 
            else {
              field.onChange(value);
            }
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}
