/* eslint-disable */
import { filter } from 'lodash';
import { Fragment, useState } from 'react';

import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import parse from 'html-react-parser';

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
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import { ListHead, ListToolbar, ListMoreMenu } from './index';
import AppUrl from 'src/RestAPI/AppUrl';
import ListSkeleton from './ListSkeleton';

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.indexOf(query) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ListProducts({
  TABLE_HEAD,
  DESC_HEAD,
  COLLAPS_HEAD,
  data,
  setIsDeleted,
  editURL,
  deleteURL,
  isLoading,
  error,
  avatar,
  withCollapse,
}) {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [collapsed, setCollapsed] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleCollapsAllClick = (event) => {
    setCollapsAll(!collapsAll);
    setCollapsed([]);
  };
  const handleCollapse = (event, id) => {
    if (collapsAll) {
      const collpsedIndex = collapsed.indexOf(id);
      // let newSelected = [];
      if (collpsedIndex === -1) {
        setCollapsed((prevState) => [...prevState, id]);
      } else {
        setCollapsed((prevState) => prevState.filter((item) => item !== id)); // remove image from preview
      }
      // console.log(collapsed);
    } else {
      setOpen(!open);
      setCollapsId(id);
    }
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;
  const [open, setOpen] = React.useState(false);
  const [collapsId, setCollapsId] = React.useState(false);
  const [collapsAll, setCollapsAll] = React.useState(false);
  const history = [
    {
      date: '2020-01-05',
      customerId: '11091700',
      amount: 3,
    },
    {
      date: '2020-01-02',
      customerId: 'Anonymous',
      amount: 1,
    },
  ];
  return (
    <Fragment>
      <Card>
        <ListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, padding: 2 }}>
            <Table>
              <ListHead
                order={order}
                orderBy={orderBy}
                open={collapsAll}
                headLabel={TABLE_HEAD}
                rowCount={data.length}
                withCollapse
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
                onCollapsAllClick={handleCollapsAllClick}
              />
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {
                  const { id, ...tableCells } = row; // destructuer row object
                  const isItemSelected = selected.indexOf(id) !== -1;
                  return (
                    <Fragment key={id}>
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                          {withCollapse && (
                            <IconButton
                              sx={{ padding: '9px' }}
                              aria-label="expand row"
                              size="small"
                              onClick={(event) => handleCollapse(event, id)}
                            >
                              {(open && id === collapsId && !collapsAll) || (collapsAll && !collapsed.includes(id)) ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          )}
                        </TableCell>
                        {Object.keys(tableCells).map(function (key, index) {
                          // console.log(index);
                          if (index < 7) {
                            if (tableCells[key]?.toString().includes(AppUrl.BaseURL)) {
                              return (
                                <TableCell align="left" key={index}>
                                  <Avatar alt={tableCells.avatarUrl} src={tableCells.avatarUrl} />
                                </TableCell>
                              );
                            } else {
                              return (
                                <TableCell align="left" key={index}>
                                  {tableCells[key]}
                                </TableCell>
                              );
                            }
                          }
                        })}
                        <TableCell align="right">
                          <ListMoreMenu
                            setIsDeleted={setIsDeleted} // Is deleted to make the deleted data disappears once it deleted
                            editURL={`${editURL}${id}`}
                            deleteURL={`${deleteURL}${id}`}
                          />
                        </TableCell>
                      </TableRow>
                      {withCollapse && (
                        <TableRow sx={{ backgroundColor: '#00ab5517' }}>
                          <TableCell style={{ padding: 2, paddingTop: 0, paddingBottom: 0 }} colSpan={17}>
                            <Collapse
                              in={(open && id === collapsId && !collapsAll) || (collapsAll && !collapsed.includes(id))}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box sx={{ margin: 1 }}>
                                <Typography variant="subtitle1" gutterBottom component="div" color="text.green">
                                  Details
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                  <TableHead
                                    sx={{
                                      whiteSpace: 'nowrap',
                                      borderBottom: '1.2px  solid',
                                      borderColor: '#14141429',
                                      margin: 1,
                                      borderRadius: '16px',
                                    }}
                                  >
                                    <TableRow>
                                      {COLLAPS_HEAD.map((element) => {
                                        // console.log(element);
                                        return <TableCell key={element.id}>{element.label}</TableCell>;
                                      })}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow sx={{ borderBottom: '1.2px  solid', borderColor: '#14141429' }}>
                                      {Object.keys(tableCells).map(function (key, index) {
                                        if (index > 6 && index < 15) {
                                          return (
                                            <TableCell component="th" scope="row" key={index}>
                                              {tableCells[key]}
                                            </TableCell>
                                          );
                                        }
                                      })}
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </Box>

                              <Box sx={{ marginLeft: 3 }}>
                                {DESC_HEAD.map((el) => {
                                  return (
                                    <div key={el.id}>
                                      <Typography variant="subtitle2" gutterBottom component="div" mt={1}>
                                        {el.label}
                                      </Typography>
                                      <Table size="small" aria-label="purchases">
                                        <TableBody sx={{ borderBottom: '1.2px  solid', borderColor: '#14141429' }}>
                                          <TableRow>
                                            {Object.keys(tableCells).map(function (key, index) {
                                              if (index > 14 && key === el.id) {
                                                return (
                                                  <TableCell component="th" scope="row" key={index}>
                                                    {parse(tableCells[key])}
                                                  </TableCell>
                                                );
                                              }
                                            })}
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </div>
                                  );
                                })}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && <ListSkeleton TABLE_HEAD={TABLE_HEAD} avatar={avatar} />}

              {isUserNotFound && isLoading && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} error={error} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Fragment>
  );
}
