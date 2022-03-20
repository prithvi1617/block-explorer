import React from "react";
import web3 from "../../shared/web3/web3";
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

    for (var i = 0; i < max_blocks; i++, curr_block_no--) {
      var currBlockNo = await getBlockDetailsByNumber(curr_block_no, true);
      block.push(currBlockNo);
    }

    this.setState({
      loading: false,
      blocks: block,
    });
  };

    render() {
    return <div>Block</div>;
    }
}
  
export default Blocks;
  