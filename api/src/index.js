const ReverseRegistrar = require('./ReverseRegistrar');
const NameResolver = require('./NameResolver');
const mainnetContracts = require('./contracts');

class ReverseAPI {
  /**
   * @param {AbstractSocketProvider|HttpProvider|CustomProvider|String} web3Provider web3.js provider
   * @param {Object} addresses with ./contracts.json format
   *
   * @constructor
   */
  constructor (web3, contracts = mainnetContracts) {
    this.registrar = new ReverseRegistrar(web3, contracts.reverseRegistrar);
    this.resolver = new NameResolver(web3, contracts.nameResolver);
  }
}

module.exports = ReverseAPI;