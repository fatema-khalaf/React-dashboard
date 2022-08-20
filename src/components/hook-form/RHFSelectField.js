import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, MenuItem } from '@mui/material';
import { useState } from 'react';

// ----------------------------------------------------------------------

RHFSelectField.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array,
};

export default function RHFSelectField({ name, options, ...other }) {
  const { control } = useFormContext();
  const [option, setOption] = useState('');
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          select
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error}
          helperText={error?.message}
          {...other}
        >
          {options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
