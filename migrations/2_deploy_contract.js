const TokenMigrator = artifacts.require('TokenMigrator');

module.exports = function(deployer) {
  deployer.deploy(
    TokenMigrator, 
    '0xb6505dEfE58759C09e0dF0739f8F5A6f32bffd44',
    '0xC59615DA2DA226613B1C78F0c6676CAC497910bC'
  );
}