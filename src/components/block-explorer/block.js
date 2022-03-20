import React from "react";
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
    render() {
    return <div>Block</div>;
    }
}
  
export default Blocks;
  