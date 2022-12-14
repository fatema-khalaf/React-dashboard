/* eslint-disable */
import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};
export default function SearchNotFound({ searchQuery = '', error, ...other }) {
  const message = (
    <div>
      <span>
        No results found for &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Try checking for typos or using complete words.
      </span>
    </div>
  );
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        Not found
      </Typography>
      <Typography component="span" variant="body2" align="center">
        {error ? error : message}
      </Typography>
    </Paper>
  );
}
