const nameResolverAbi = require('./abi/ReverseRegistrarABI');

class ReverseRegistrar {
  /**
   * @param {Web3} web3 web3.js lib
   * @param {Address} address contract address in network
   * @param {Object} options web3.js options
   *
   * @constructor
   */
  constructor (web3, address, options = null) {
    this.contract = new web3.eth.Contract(nameResolverAbi, address, options);
    this.sha3 = web3.utils.sha3;
  }

  /**
   * Sets a name for the sender address
   * @param {String} name
   *
   * @returns {Promise<Node>}
   */
  setName(name, options = null) {
    return this.contract.methods.setName(name).send(options);
  }

}

module.exports = ReverseRegistrar;
