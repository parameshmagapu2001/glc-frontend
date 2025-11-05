import {
  useFormContext,
  Controller,
  FieldValues,
  FieldPath,
} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete, {
  AutocompleteProps,
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
} from '@mui/material/Autocomplete';

interface RHFAutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  FormValues extends FieldValues
> extends Omit<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    'renderInput' | 'value' | 'onChange'
  > {
  name: FieldPath<FormValues>;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  value?: Multiple extends true ? T[] : T | null;
  onChange?: (
    event: React.SyntheticEvent,
    value: Multiple extends true ? T[] : T | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<T> | undefined
  ) => void;
}

export default function RHFAutocomplete<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  FormValues extends FieldValues
>({
  name,
  label,
  placeholder,
  helperText,
  value,
  onChange,
  ...other
}: RHFAutocompleteProps<T, Multiple, DisableClearable, FreeSolo, FormValues>) {
  const { control, setValue } = useFormContext<FormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          {...other}
          value={(value !== undefined ? value : field.value) as any}
          onChange={(event, newValue, reason, details) => {
            if (onChange) {
              onChange(
                event,
                newValue as Multiple extends true ? T[] : T | null,
                reason,
                details
              );
            }
          
            setValue(
              name,
              newValue as FormValues[typeof name],
              { shouldValidate: true }
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
              error={!!error}
              helperText={error ? error.message : helperText}
            />
          )}
        />
      )}
    />
  );
}
















