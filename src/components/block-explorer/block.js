import React from "react";
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
  
    render() {
    return <div>Block</div>;
    }
}
  
  
  export default (Blocks);
  