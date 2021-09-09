import { ERC20Instance, TokenMigratorInstance } from '../types/truffle-contracts';

const TokenMigrator = artifacts.require('TokenMigrator');
const TestToken = artifacts.require('TestToken');

contract('TokenMigrator', (accounts) => {
  let oldToken: ERC20Instance;
  let newToken: ERC20Instance;
  let migrator: TokenMigratorInstance;

  beforeEach(async () => {
    oldToken = await TestToken.new();
    await oldToken.transfer(accounts[1], '100000');
    newToken = await TestToken.new();
    migrator = await TokenMigrator.new(oldToken.address, newToken.address);

    await newToken.transfer(migrator.address, await newToken.totalSupply());
    await oldToken.approve(migrator.address, '100000', { from: accounts[1] });
  });

  describe('migrate', () => {
    it('transfers new tokens correctly', async () => {
      const initialOldTokenBalance = await oldToken.balanceOf(accounts[1]); 
      const initialNewTokenBalance = await newToken.balanceOf(accounts[1]);
      await migrator.migrate('10000', { from: accounts[1] });
      const lastOldTokenBalance = await oldToken.balanceOf(accounts[1]); 
      const lastNewTokenBalance = await newToken.balanceOf(accounts[1]);
      const migratorOldTokenBalance = await oldToken.balanceOf(migrator.address);
      const newTokenHoldingBalance = await newToken.balanceOf(migrator.address);
      const totalSupply = await newToken.totalSupply();

      expect(initialOldTokenBalance.toString()).to.eq('100000');
      expect(initialNewTokenBalance.toString()).to.eq('0');
      expect(lastOldTokenBalance.toString()).to.eq('90000');
      expect(lastNewTokenBalance.toString()).to.eq('10000');
      expect(migratorOldTokenBalance.toString()).to.eq('10000');
      expect(newTokenHoldingBalance.toString()).to.eq(totalSupply.sub(web3.utils.toBN(10000)).toString());
    });

    it('does not transfer more than the balance', async () => {
      try {
        await migrator.migrate('100001', { from: accounts[1] });
      } catch(e) {
        return true;
      }

      throw new Error('There is problem');
    });
  });
});