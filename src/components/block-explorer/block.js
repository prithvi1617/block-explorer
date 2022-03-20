import React from "react";
import { withStyles } from "@material-ui/styles";
import web3 from "../../shared/web3/web3";
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
import BlockTransactionInfo from "../block-transaction-info/transactionInfoComponent";

const getBlockDetailsByNumber = (i, opt = true) => {
  return new Promise((resolve, reject) => {
    web3.eth.getBlock(i, opt, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const styles = (theme) => ({
  root: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: "black",
      fontSize: "1.1rem",
    },
  },
  tableCell: {
    "&:hover": {
      backgroundColor: "#0096FF",
    },
  },
});

class Blocks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blocks: [],
      curr_block: null,
      displayTransaction: false,
      loading: true,
      blockNo: null,
    };
  }

  getBlockNumber = async () => {
    let blockNumber = await web3.eth.getBlockNumber();
    return blockNumber;
  };

  getTopTenBlocks = async (curr_block_no) => {
    const block = this.state.blocks.slice();
    let max_blocks = 10;

    if (curr_block_no < max_blocks) max_blocks = curr_block_no;

    for (let i = 0; i < max_blocks; i++, curr_block_no--) {
      let currBlockNo = await getBlockDetailsByNumber(curr_block_no, true);
      block.push(currBlockNo);
    }

    this.setState({
      loading: false,
      blocks: block,
    });
  };

  async componentWillMount() {
    let curr_block_no = await this.web3_eth_getBlockNumber();

    this.setState({
      curr_block: curr_block_no,
    });

    await this.getBlocks(curr_block_no);
  }

  async componentDidMount() {
    setInterval(async () => {
      let curr_block_no = await this.web3_eth_getBlockNumber();

      if (curr_block_no > this.state?.blocks[0]?.number) {
        const block = await getBlockDetailsByNumber(curr_block_no, true);

        if (block) {
          this.state.blocks.pop();
          this.state.blocks.unshift(block);
        }

        this.setState({
          curr_block: curr_block_no,
        });
      }
    }, 3000);
  }

  handleClick = async (event) => {
    this.setState({
      displayTransaction: true,
      blockNo: event.target.getAttribute("value"),
    });
  };

  handleTextInputChange = async (event) => {
    const block = await getBlockDetailsByNumber(event.target.value, true);
    this.setState({
      currentBlockTransactionsDetail: block.transactions,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div>
          <Box px={2}>
            <h1 style={{ textAlign: "center" }}>Latest Blocks</h1>
          </Box>
          {this.state.loading ? (
            <h2 style={{ paddingTop: "25%", textAlign: "center" }}>
              Loading...
            </h2>
          ) : (
            <Box px={6}>
              <Paper elevation={5}>
                <Box textAlign="center">
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow className={classes.root}>
                          <TableCell>Block ID</TableCell>
                          <TableCell align="center">Block Number</TableCell>
                          <TableCell align="center">Gas Limit</TableCell>
                          <TableCell align="center">Nonce</TableCell>
                          <TableCell align="center">Difficulty</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.blocks.map((block, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {index}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes.tableCell}
                              onClick={this.handleClick}
                              value={block.number}
                            >
                              {block.number}
                            </TableCell>
                            <TableCell align="center">
                              {block.gasLimit}
                            </TableCell>
                            <TableCell align="center">{block.nonce}</TableCell>
                            <TableCell align="center">
                              {block.difficulty}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Paper>
            </Box>
          )}
        </div>
        <div>
          {this.state.displayTransaction ? (
            <BlockTransactionInfo
              blockNumber={this.state.blockNo}
              web3={web3}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Blocks);
