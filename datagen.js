const fs = require('fs');

const addresses = require('./addresses');

const reverseRegistrarBuild = require('./build/contracts/ReverseRegistrar');

const reverseRegistrarData = {
  abi: reverseRegistrarBuild.abi,
  bytecode: reverseRegistrarBuild.bytecode,
  address: {
    rskMainnet: addresses.ReverseRegistrar.rskMainnet,
    rskTestnet: addresses.ReverseRegistrar.rskTestnet,
  },
};

fs.writeFileSync('./ReverseRegistrarData.json', JSON.stringify(reverseRegistrarData));

const nameResolverBuild = require('./build/contracts/NameResolver');

const nameResolverData = {
  abi: nameResolverBuild.abi,
  bytecode: nameResolverBuild.bytecode,
  address: {
    rskMainnet: addresses.NameResolver.rskMainnet,
    rskTestnet: addresses.NameResolver.rskTestnet,
  },
};

fs.writeFileSync('./NameResolverData.json', JSON.stringify(nameResolverData));
