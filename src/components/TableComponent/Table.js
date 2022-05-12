import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  withStyles,
} from "@material-ui/core";
import {  AccountBalance , Favorite, FavoriteBorder } from "@material-ui/icons";
import SearchBar from "material-ui-search-bar";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TableCard.css";

const columns = [
  { id: "favourite", label: "Favourite", align: "right", minWidth: 30 },
  { id: "bank_name", label: "Bank", minWidth: 150},
  { id: "ifsc", label: "IFSC", minWidth: 150, align: "center" },
  { id: "branch", label: "Branch", minWidth: 100 },
  { id: "bank_id", label: "Bank ID", minWidth: 100 },
  {
    id: "address",
    label: "Address",
    minWidth: 40,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },

];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "auto",
  },
});


const TableCard = ({ data, category, val }) => {
  var originalRows = data;
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#5165F7",
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 10,
    },
  }))(TableCell);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState(originalRows);
  const [searched, setSearched] = useState("");
  const [isClicked, setIsClicked] = useState(false);


  useEffect(() => {
    setRows(data);
  }, [data])

  const handleClick = () => {
    setIsClicked(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const initiateSearch = (searchVal) => {
    const filteredRows = originalRows.filter((row) => {
      if (category !== "")
        return row[category].toLowerCase().includes(searchVal.toLowerCase());
      else return !null;
    });
    setRows(filteredRows);
  };

  const stopSearch = () => {
    setSearched("");
    initiateSearch(searched);
  };

  const favClick = (id) => {
    originalRows.forEach((row) => {
      if (row.ifsc === id) {
        row.favourite = !row.favourite;
      }
    });
    const item = JSON.parse(localStorage.getItem(val));
    const newItem = {
      data: originalRows,
      expiry: item.expiry,
    };
    const data = originalRows.find((row) => row.ifsc === id);
    var oldFav = JSON.parse(localStorage.getItem("favourite"));
    var flag = true;
    var newFav = [];
    oldFav.forEach((row) => {
      if (row.ifsc !== data.ifsc) {
        newFav.push(row);
      } else flag = false;
    });
    if (flag) newFav.push(data);
    localStorage.setItem("favourite", JSON.stringify(newFav));
    localStorage.setItem(val, JSON.stringify(newItem));
    setRows(originalRows);
  };

  return (
    <div className="tableCard">
      <Paper className={classes.root}>
        <SearchBar 
          value={searched}
          onChange={(searchVal) => initiateSearch(searchVal)}
          onCancelSearch={() => stopSearch()}
          className="searchbar"
        />

        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
                {columns.map((column) => (
                  <StyledTableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    <b>{column.label}</b>
                  </StyledTableCell>
                ))}
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <StyledTableCell key={column.id} align={column.align}>
                            {column.id === "favourite" && !row.favourite && (
                              <div
                                onClick={() => {
                                  favClick(row.ifsc);
                                  handleClick();
                                }}
                              >
                                <FavoriteBorder />
                              </div>
                            )}
                            
                            {column.id === "favourite" && row.favourite && (
                              <div
                                onClick={() => {
                                  favClick(row.ifsc);
                                }}
                              >
                                <Favorite style={{ color: "#5064F7" }} />
                              </div>
                            )}

                            {column.format && column.id !== "bank_name"
                              ? column.format(value)
                              : value}

                            {column.id === "bank_name" && (
                              <Link
                                to={{
                                  pathname: `/bank-details/${row["ifsc"]}`,
                                  state: { row: row },
                                }}
                              >
                                <AccountBalance />
                              </Link>
                            )}
                            
                            
                          </StyledTableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default TableCard;
