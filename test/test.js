const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getShortStr, getLongStr } = require("../scripts/readStorage");

// storage slot starting locations
const shortString = "0x1";
const longString = "0x2";

describe("StorageEx", function () {
  let addr;

  before(async function() {
    const StorageEx = await ethers.getContractFactory("StorageEx");
    const contractX = await StorageEx.deploy();
    await contractX.deployed();
    addr = contractX.address;
  });

  it("Read short string", async function () {
    expect(await getShortStr(shortString, addr)).to.equal("hello world");
  });

  it("Read long string", async function () {
    expect(await getLongStr(longString, addr)).to.equal("this string is 92 bytes long so it will use three 32 byte storage slots totaling 96 bytes");
  });


});
