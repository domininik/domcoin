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
});
