// material
import { styled } from '@mui/material/styles';
import { Box, Link, Stack, Breadcrumbs, Typography, ListItemIcon } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function CusBreadcrumbs({ title, links, page }) {
  const ListItemIconStyle = styled(ListItemIcon)({
    minWidth: 12,
    height: 12,
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });
  const separator = (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          width: 4,
          height: 4,
          display: 'flex',
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'text.disabled',
        }}
      />
    </ListItemIconStyle>
  );
  return (
    <Box direction="row" alignItems="center" justifyContent="space-between" mb={4}>
      <Box>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Breadcrumbs disableTypography separator={separator} aria-label="breadcrumb">
          {links.map((link) => (
            <Typography key={link.name} variant="body2" color="text.primary">
              <Link underline="hover" color="inherit" component={RouterLink} to={link.path}>
                {link.name}
              </Link>
            </Typography>
          ))}

          <Typography variant="body2" color="text.disabled">
            {page}
          </Typography>
        </Breadcrumbs>
      </Box>
    </Box>
  );
}
