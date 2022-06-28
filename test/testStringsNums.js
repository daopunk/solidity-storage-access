const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { getShortStr, getLongStr, getUint256 } = require("../scripts/readStorage");

describe("StorageEx", function () {
  const provider = waffle.provider;
  let addr;
  let accounts;
  let users = [];

  before(async function() {
    // deploy contract
    const StorageEx = await ethers.getContractFactory("StorageEx");
    const contractX = await StorageEx.deploy();
    await contractX.deployed();
    addr = contractX.address;
    // get accounts
    accounts = await ethers.getSigners();

    for (let account of accounts) {
      users.push(account.address);
    }
  });

  it("Check test account balance", async function () {
    expect(ethers.utils.formatEther(await provider.getBalance(users[3]))).to.equal("10000.0");
  });

  it("Read short string", async function () {
    expect(await getShortStr("0x2", addr)).to.equal("hello world");
  });

  it("Read long string", async function () {
    expect(await getLongStr("0x3", addr)).to.equal("this string is 92 bytes long so it will use three 32 byte storage slots totaling 96 bytes");
  });

  it("Read uint256", async function (){
    expect(await getUint256("0x4", addr)).to.equal(99);
    expect(await getUint256("0x9", addr)).to.equal(users[0]);
    expect(await getUint256("0xa", addr)).to.equal(1);
  });
});

