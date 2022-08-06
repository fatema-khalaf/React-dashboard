/* eslint-disable */
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  Skeleton,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import { ListMoreMenu } from './index';

// ----------------------------------------------------------------------

export default function ListSkeleton({ TABLE_HEAD, avatar }) {
  const cells = [];
  for (let i = 1; i < TABLE_HEAD.length; i++) {
    cells.push(i);
  }
  const rows = [0, 1, 2, 3, 4];
  return (
    <TableBody>
      {rows.map((item) => {
        return (
          <TableRow hover key={item.id} tabIndex={-1} role="checkbox" selected={false} aria-checked={false}>
            <TableCell padding="checkbox">
              <Checkbox checked={false} />
            </TableCell>
            {cells.map(function (item) {
              if (item === avatar) {
                return (
                  <TableCell align="left" key={item}>
                    <Skeleton variant="circular">
                      <Avatar />
                    </Skeleton>
                  </TableCell>
                );
              } else {
                return (
                  <TableCell align="left" key={item}>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                );
              }
            })}
            <TableCell align="right">
              <ListMoreMenu />
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  );
}
