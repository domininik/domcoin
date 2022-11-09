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
});
