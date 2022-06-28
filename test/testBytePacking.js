const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { getBytePackedVar } = require("../scripts/readStorage");

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
  
  it("Read byte-packed slot: <= 6-byte", async function (){
    expect(await getBytePackedVar("0x0", addr, 0, 2)).to.equal("ace0");
    expect(await getBytePackedVar("0x0", addr, 4, 4)).to.equal("bebeace0");
    expect(await getBytePackedVar("0x0", addr, 12, 4)).to.equal("cafebebe");
    expect(await getBytePackedVar("0x0", addr, 20, 6)).to.equal("debecafebebe");
  });

  it("Read byte-packed slot: 8-byte", async function (){
    expect(await getBytePackedVar("0x0", addr, 32, 8)).to.equal("ebeedebecafebebe");
    expect(await getBytePackedVar("0x0", addr, 48, 8)).to.equal("febeeacecafebebe");
  });

  it("Read byte-packed slot: 16-byte", async function (){
    expect(await getBytePackedVar("0x1", addr, 0, 16)).to.equal("aace00bebe00cafe00ace09876543210");
    expect(await getBytePackedVar("0x1", addr, 32, 16)).to.equal("bbebe0febee00ace00cafe0123456789");
  });
});

