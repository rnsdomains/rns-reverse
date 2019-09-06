const nameResolverAbi = require('./abi/NameResolverABI');
const namehash = require('eth-ens-namehash').hash;

class NameResolver {
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
   * Gets an address resolution
   * @param {Address} address
   *
   * @returns {Promise<String>}
   */
  name (address) {
    // if (address.length == 40)
    let name = `${address.slice(2).toLowerCase()}.addr.reverse`;

    const hash = namehash(name);

    return this.contract.methods.name(hash).call();
  }

}

module.exports = NameResolver;
