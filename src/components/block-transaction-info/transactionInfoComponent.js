import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SearchBar from "material-ui-search-bar";
import web3_eth_getBlock from "../../shared/web3/web3Helper";
import {
  Paper,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: "black",
      fontSize: "1rem",
    },
  },
});

const BlockTransactionInfo = ({ blockNumber, web3 }) => {
  const classes = useStyles();
  const [currentBlockTransactionsDetail, setCurrentBlockTransactionsDetails] =
    useState([]);
  const [searched, setSearched] = useState("");

  useEffect(() => {
    getTransactionDetails();
  }, [blockNumber]);

  async function getTransactionDetails() {
    const block = await web3_eth_getBlock(blockNumber, true);

    const result = block.transactions.filter((item) => item.value !== "0");
    setCurrentBlockTransactionsDetails(result);
  }

  const requestSearch = (searchedVal) => {
    if (searchedVal.length === 0) return getTransactionDetails();

    const filterTransactions = currentBlockTransactionsDetail.filter(
      (transaction) => {
        return transaction.from
          .toLowerCase()
          .includes(searchedVal.toLowerCase());
      }
    );

    setCurrentBlockTransactionsDetails(filterTransactions);
  };

  const cancelSearch = () => {
    setSearched("");
    getTransactionDetails();
  };

  return (
    <>
      <Paper elevation={7}>
        <Box p={5} textAlign="center">
          <h3 text-align="center"> Block {blockNumber} Transactions Details</h3>
          <SearchBar
            value={searched}
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 550 }} aria-label="simple table">
              <TableHead>
                <TableRow className={classes.root}>
                  <TableCell>Block Transaction Index</TableCell>
                  <TableCell align="center">Block Hash</TableCell>
                  <TableCell align="center">Gas</TableCell>
                  <TableCell align="center">From</TableCell>
                  <TableCell align="center">To</TableCell>
                  <TableCell align="center">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentBlockTransactionsDetail.map((block, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {block.transactionIndex}
                    </TableCell>
                    <TableCell align="center">{block.hash}</TableCell>
                    <TableCell align="center">{block.gas}</TableCell>
                    <TableCell align="center">{block.from}</TableCell>
                    <TableCell align="center">{block.to}</TableCell>
                    <TableCell align="center">{block.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </>
  );
};

export default BlockTransactionInfo;
