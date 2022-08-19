import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Switch, FormControlLabel, FormGroup } from '@mui/material';

// ----------------------------------------------------------------------

RHFSwitchBase.propTypes = {
  name: PropTypes.string.isRequired,
};

export default function RHFSwitchBase({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller name={name} control={control} render={({ field }) => <Switch checked={field.value} {...field} />} />
      }
      {...other}
    />
  );
}
