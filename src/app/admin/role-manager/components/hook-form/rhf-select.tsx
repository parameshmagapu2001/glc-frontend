import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Theme, SxProps } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Select, { SelectProps } from '@mui/material/Select';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useState } from 'react';

// ----------------------------------------------------------------------

type RHFSelectProps = TextFieldProps & {
  name: string;
  native?: boolean;
  maxHeight?: boolean | number;
  children: React.ReactNode;
  PaperPropsSx?: SxProps<Theme>;
};

export function RHFSelect({
  name,
  native,
  maxHeight = 220,
  helperText,
  children,
  PaperPropsSx,
  ...other
}: RHFSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{
            native,
            MenuProps: {
              PaperProps: {
                sx: {
                  ...(!native && {
                    maxHeight: typeof maxHeight === 'number' ? maxHeight : 'unset',
                  }),
                  ...PaperPropsSx,
                },
              },
            },
            // sx: {textTransform: 'lowercase' },
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}

// ----------------------------------------------------------------------

type RHFMultiSelectProps = SelectProps & {
  name: string;
  label?: string;
  chip?: boolean;
  checkbox?: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
  options: {
    id: string;
    label: string;
  }[];
};

export function RHFMultiSelect({
  name,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  helperText,
  sx,
  ...other
}: RHFMultiSelectProps) {
  const { control, setValue } = useFormContext();
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedIds = event.target.checked ? options.map(option => option.id) : [];
    setValue(name, selectedIds);
    setSelectAll(event.target.checked);
  };

  const renderValues = (value: unknown) => {
    const selectedIds = value as string[];
    if (options.length > 1) {
      const allSelected = selectedIds.length === options.length;

      if (allSelected) {
        return "All";
      }
    }

    const selectedItems = options.filter((item) => selectedIds.includes(item.id));

    if (!selectedItems.length && placeholder) {
      return (
        <Box sx={{ color: 'text.disabled' }}>
          {placeholder}
        </Box>
      );
    }

    if (chip) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.5,
            maxHeight: 110,
            overflowY: 'scroll',
            scrollbarWidth: 'none',
          }}
        >
          {selectedItems.map((item) => (
            <Chip key={item.label} size="small" label={item.label} />
          ))}
        </Box>
      );
    }

    return selectedItems.map((item) => item.label).join(', ');
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl sx={sx}>
          {label && <InputLabel id={name}> {label} </InputLabel>}

          <Select
            {...field}
            multiple
            displayEmpty={!!placeholder}
            labelId={name}
            input={<OutlinedInput fullWidth label={label} error={!!error} />}
            renderValue={renderValues}
            MenuProps={{
              PaperProps: {
                style: {
                  width: 250,
                },
              },
            }}
            {...other}
          >
            {placeholder && (
              <MenuItem disabled value="">
                <span> {placeholder} </span>
              </MenuItem>
            )}

            {checkbox && options.length > 1 && (
              <MenuItem>
                <Checkbox
                  size="small"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <span>Select All</span>
              </MenuItem>
            )}

            {options.map((option) => {
              const selected = field?.value?.includes(option.id);

              return (
                <MenuItem key={option.id} value={option.id}>
                  {checkbox && <Checkbox size="small" disableRipple checked={selected} />}

                  {option.label}
                </MenuItem>
              );
            })}
          </Select>

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
