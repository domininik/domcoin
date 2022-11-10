const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Domcoin", function () {
  async function deployFixture() {
    const initialBalance = 1000;
    const [owner, otherAccount] = await ethers.getSigners();
    const Domcoin = await ethers.getContractFactory("Domcoin");
    const token = await Domcoin.deploy(initialBalance);

    return { token, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Assigns initial balance", async function () {
      const { token, owner } = await loadFixture(deployFixture);

      expect(await token.balanceOf(owner.address)).to.equal(1000);
    });

    it("Sets the right owner", async function () {
      const { token, owner } = await loadFixture(deployFixture);

      expect(await token.owner()).to.equal(owner.address);
    });
  });

  describe("Interface", function () {
    it("Returns token name", async function () {
      const { token } = await loadFixture(deployFixture);

      expect(await token.name()).to.equal("Domcoin");
    });

    it("Returns token symbol", async function () {
      const { token } = await loadFixture(deployFixture);

      expect(await token.symbol()).to.equal("DOM");
    });

    it("Returns total supply", async function () {
      const { token } = await loadFixture(deployFixture);

      expect(await token.totalSupply()).to.equal(1000);
    });
  });

  describe("Mint", function () {
    it("Increases total supply", async function () {
      const { token, otherAccount } = await loadFixture(deployFixture);
      await token.mint(otherAccount.address, 500);

      expect(await token.totalSupply()).to.equal(1500);
    });

    it("Transfers minted tokens to given account", async function () {
      const { token, otherAccount } = await loadFixture(deployFixture);
      await token.mint(otherAccount.address, 500);

      expect(await token.balanceOf(otherAccount.address)).to.equal(500);
    });
  });

  describe("Burn", function () {
    it("Decreases total supply", async function () {
      const { token } = await loadFixture(deployFixture);
      await token.burn(50);

      expect(await token.totalSupply()).to.equal(950);
    });
  });

  describe("Transfer", function () {
    it("Moves tokens between accounts", async function () {
      const { token, account, otherAccount } = await loadFixture(deployFixture);
      await token.transfer(otherAccount.address, 250);

      expect(await token.balanceOf(otherAccount.address)).to.equal(250);
    });

    it("Emits transfer event", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployFixture);

      await expect(token.transfer(otherAccount.address, 250))
        .to.emit(token, 'Transfer')
        .withArgs(owner.address, otherAccount.address, 250);
    });

    it("Reverts when tokens amount is higher than balance", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployFixture);

      await expect(token.transfer(otherAccount.address, 2000)).to.be.reverted;
    });
  });

  describe("Allowance", async function () {
    it("Sets the amount which account is allowed to spend", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployFixture);
      await token.approve(otherAccount.address, 500);

      expect(await token.allowance(owner.address, otherAccount.address)).to.equal(500);
    });

    it("Emits allowance event", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployFixture);

      await expect(token.approve(otherAccount.address, 500))
        .to.emit(token, 'Approval')
        .withArgs(owner.address, otherAccount.address, 500);
    });

    it("Updates allowance value when money is transferred", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployFixture);
      await token.approve(owner.address, 500);
      await token.transferFrom(owner.address, otherAccount.address, 50);

      expect(await token.allowance(owner.address, owner.address)).to.equal(450);
    });

    it("Reverts when amount is higher than allowance", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployFixture);
      await token.approve(owner.address, 100);

      await expect(token.transferFrom(owner.address, otherAccount.address, 200))
        .to.be.revertedWith("ERC20: insufficient allowance");
    });

    it("Allows transfering from one account to another (transferFrom)", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployFixture);
      await token.approve(owner.address, 100);

      await token.transferFrom(owner.address, otherAccount.address, 50);
      expect(await token.balanceOf(otherAccount.address)).to.equal(50);
    });

    it("Allows burning from specific account (burnFrom)", async function () {
      const { token, owner, otherAccount } = await loadFixture(deployFixture);
      await token.approve(owner.address, 100);

      await token.burnFrom(owner.address, 50);
      expect(await token.balanceOf(owner.address)).to.equal(950);
    });
  });
});
